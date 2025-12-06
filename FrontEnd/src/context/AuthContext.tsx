import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useToast } from './ToastContext';
import { useNavigate } from 'react-router-dom';
import { User } from '../type';

type AuthContextType = {
  user: User | null;
  isLoggedIn: boolean;
  login: (accessToken: string) => void;
  logout: (message: string, type: 'success' | 'error' | 'info') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const TOKEN_KEY = 'studyhub_jwt';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const isLoggedIn = !!user;

  const logout = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    navigate("/")
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    showToast(message, type);
  }, [showToast, navigate]);

  const checkTokenExpiration = useCallback((token: string) => {
    try {
      const decoded: { exp: number, userId: number, email: string, nickname: string, role: string } = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        logout("세션이 만료되었습니다. 다시 로그인해주세요.", 'info');
        return false;
      }

      const userData: User = {
        id: decoded.userId,
        email: decoded.email,
        nickname: decoded.nickname,
        role: decoded.role
      };
      setUser(userData);
      return true;

    } catch (e) {
      logout("토큰이 유효하지 않습니다. 다시 로그인해주세요.", 'error');
      return false;
    }
  }, [logout]);


  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      checkTokenExpiration(token);
    }

    const interval = setInterval(() => {
      const currentToken = localStorage.getItem(TOKEN_KEY);
      if (currentToken) {
        checkTokenExpiration(currentToken);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [checkTokenExpiration]);

  const login = (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    checkTokenExpiration(token);
  };
  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
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