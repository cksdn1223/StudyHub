import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext'; 
import { UserLogin, UserRegister } from '../type';

export const useAuthApi = () => {
  const { login } = useAuth();
  const { showToast } = useToast();

  // --- 로그인 처리 함수 ---
  const handleLogin = async (user: UserLogin) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/login`, user);
      login(response.headers.authorization);
      showToast('로그인에 성공했습니다.', 'success');
      return true;
    } catch (e) {
      showToast('로그인에 실패했습니다. 다시 시도해주세요.', 'error');
      return false;
    }
  };

  // --- 회원가입 처리 함수 ---
  const handleRegister = async (user: UserRegister) => {
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/register`, user);
      showToast('회원가입이 완료되었습니다! 로그인해 주세요.', 'success');
      return true;
    } catch (e) {
      showToast('회원가입에 실패했습니다. 다시 시도해주세요.', 'error');
      return false;
    }
  };

  // 호출 가능한 함수들을 객체로 반환합니다.
  return { handleLogin, handleRegister };
};



