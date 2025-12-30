import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext'; 
import { axiosErrorType, UserLogin, UserRegister } from '../type';
import { postLogin, postRegister } from '../api/api';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export const useAuthApi = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const qc = useQueryClient();
  const navigate = useNavigate();


  // --- 로그인 처리 함수 ---
  const handleLogin = async (user: UserLogin) => {
    try {
      const response = await postLogin(user);
      const newToken = response.headers.authorization;

      // 기존 React Query 의 모든 캐시를 완전히 삭제
      qc.clear();

      await login(newToken);

      showToast('로그인에 성공했습니다.', 'success');

      navigate("/")
      return true;
    } catch (error) {
      showToast((error as axiosErrorType).response.data.message, 'error');
      return false;
    }
  };

  // --- 회원가입 처리 함수 ---
  const handleRegister = async (user: UserRegister) => {
    try {
      await postRegister(user);
      showToast('회원가입이 완료되었습니다! 로그인해 주세요.', 'success');
      return true;
    } catch (error) {
      showToast((error as axiosErrorType).response.data.message, 'error');
      return false;
    }
  };

  // 호출 가능한 함수들을 객체로 반환합니다.
  return { handleLogin, handleRegister };
};



