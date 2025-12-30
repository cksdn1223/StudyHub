import React from 'react';
import { useToast } from '../../context/ToastContext';
import { Zap, X, Info } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion"

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

  const { container, icon: Icon } = getStyles(type);

  // 애니메이션 클래스 설정
  const baseClasses = `
    fixed bottom-10 left-1/2 
    px-6 py-3 rounded-lg shadow-xl text-white font-semibold 
    z-50 border-b-4 flex items-center space-x-3
    ${container}
  `;

  return (
    <AnimatePresence>
      {isVisible && (<motion.div
        initial={{ opacity: 0, y: 50, x: "-50%" }}
        animate={{ opacity: 1, y: 0, x: "-50%" }}
        exit={{ opacity: 0, y: 20, x: "-50%", scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className={baseClasses}
      >
        <Icon size={20} />
        <span>{message}</span>
      </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;