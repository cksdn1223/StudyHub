import React, { createContext, useContext, useState, ReactNode, useCallback, useRef } from 'react';

// 💡 Toast 메시지의 타입을 정의합니다.
type ToastType = 'success' | 'error' | 'info';

// 💡 Toast 상태와 액션을 정의합니다.
interface ToastState {
  message: string;
  type: ToastType;
  isVisible: boolean;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
  toastState: ToastState;
}

// 💡 Context 초기값 설정
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// 💡 Toast를 보여주는 함수를 제공하는 Provider 컴포넌트
interface ToastProviderProps {
  children: ReactNode;
}

const initialToastState: ToastState = {
  message: '',
  type: 'info',
  isVisible: false,
};

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toastState, setToastState] = useState<ToastState>(initialToastState);
  const timerRef = useRef<number | null>(null);
  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    setToastState({ message, type, isVisible: true });
    
    if (timerRef.current) window.clearTimeout(timerRef.current);

    timerRef.current = window.setTimeout(() => {
      setToastState(prev => ({ ...prev, isVisible: false }));
      timerRef.current = null;
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, toastState }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast는 ToastProvider 내에서 사용되어야 합니다.');
  }
  return context;
};