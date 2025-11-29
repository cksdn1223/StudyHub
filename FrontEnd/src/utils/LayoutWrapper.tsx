// src/components/LayoutWrapper.tsx (수정)

import React from 'react';
import Header from '../components/Header';
import { useLocation } from 'react-router-dom'; // useLocation 추가

function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isMainPage = location.pathname === '/';


  const HEADER_HEIGHT_CLASS = 'pt-20 ';

  const headerWrapperClasses = `
        fixed top-0 left-0 w-full z-50 transition duration-300 ease-in-out
        ${isMainPage
      ? 'bg-transparent shadow-none'
      : 'bg-transparent backdrop-blur-sm shadow-md'
    }
    `;

  return (
    <div className="min-h-screen">
      <div
        className={headerWrapperClasses}
      >
        <Header />
      </div>
      <main className={HEADER_HEIGHT_CLASS}>
        {children}
      </main>
    </div>
  );
}

export default LayoutWrapper;