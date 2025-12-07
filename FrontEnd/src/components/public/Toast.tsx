import React from 'react';
import { useToast } from '../../context/ToastContext';
import { Zap, X, Info } from 'lucide-react';

// 💡 Tailwind CSS를 사용하여 스타일링 (이전 디자인과 유사하게)
const getStyles = (type: 'success' | 'error' | 'info') => {
  switch (type) {
    case 'success':
      return { container: 'bg-green-500 border-green-700', icon: Zap };
    case 'error':
      return { container: 'bg-red-500 border-red-700', icon: X };
    case 'info':
    default:
      return { container: 'bg-blue-500 border-blue-700', icon: Info };
  }
};

const Toast: React.FC = () => {
  const { toastState } = useToast();
  const { message, type, isVisible } = toastState;

  if (!isVisible) return null;
  const { container, icon: Icon } = getStyles(type);
  // 애니메이션 클래스 설정
const baseClasses = `
    fixed bottom-5 left-1/2 transform -translate-x-1/2 
    px-6 py-3 rounded-lg shadow-xl text-white font-semibold 
    transition-all duration-300 z-50 border-b-4 flex items-center space-x-3
    ${container} 
    animate-toast-in
  `;

return (
    <div className={baseClasses}>
        <Icon size={20} />
        <span>{message}</span>
    </div>
  );
};

export default Toast;