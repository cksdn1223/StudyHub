import React, { useContext, useState, useEffect, ReactNode, useCallback, createContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useToast } from './ToastContext';
import { useNavigate } from 'react-router-dom';
import { JwtPayload, User } from '../type';
import { getHeaders } from './AxiosConfig';
import { registerPush } from '../utils/pushSubscription';
import axios from 'axios';

type AuthContextType = {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  isLoggedIn: boolean;
  login: (accessToken: string) => void;
  logout: (message: string, type: 'success' | 'error' | 'info') => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const TOKEN_KEY = 'studyhub_jwt';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [user, setUser] = useState<User>({
    id: 0,
    email: '',
    nickname: '',
    address: '',
    description: '',
    role: '',
    profileImageUrl: 'defaultUrl',
  });
  const isLoggedIn = user.email.length !== 0

  const logout = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    navigate("/")
    localStorage.removeItem(TOKEN_KEY);
    setUser({
      id: 0,
      email: '',
      nickname: '',
      address: '',
      description: '',
      role: '',
      profileImageUrl: 'defaultUrl',
    });
    showToast(message, type);
  }, [showToast, navigate]);

  const getDecoded = useCallback((token: string): JwtPayload | null => {
    try {
      return jwtDecode<JwtPayload>(token);
    } catch (e) {
      logout("토큰이 유효하지 않습니다. 다시 로그인해주세요.", 'error');
      return null;
    }
  }, [logout]);

  const fetchMyProfile = async (): Promise<User> => {
    const res = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/user/me`,
      getHeaders()
    );
    return res.data; // { email, nickname, address, description, role } 형태 
  };

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    const decoded = getDecoded(token);
    if (!decoded) return;
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      logout("세션이 만료되었습니다. 다시 로그인해주세요.", "info");
      return;
    }
    // 서버에서 프로필 조회
    const profile = await fetchMyProfile();
    setUser(profile);
  }, [logout, getDecoded])

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) refreshUser();

    const interval = setInterval(() => {
      const currentToken = localStorage.getItem(TOKEN_KEY);
      if (currentToken) {
        const decoded = getDecoded(currentToken);
        if (!decoded) return;
        const now = Date.now() / 1000;
        if (decoded.exp < now) logout("세션이 만료되었습니다. 다시 로그인해주세요.", "info");
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [refreshUser, logout, getDecoded])

  const login = (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    refreshUser();
  };

  // 로그인시 web push 구독
  useEffect(() => {
    const setupPush = async () => {
      if(user.email.length===0) return;
      const sub = await registerPush();
      if (!sub) return;

      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/push/subscribe`,
        {
          endpoint: sub.endpoint,
          keys: sub.toJSON().keys, // { p256dh, auth }
        },
        getHeaders()
      );
    };

    setupPush();
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser, isLoggedIn, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// 💡 Custom Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth는 AuthProvider 내에서 사용되어야 합니다.');
  }
  return context;
};