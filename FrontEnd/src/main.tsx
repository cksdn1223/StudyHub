import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import Toast from './components/Toast';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
        <Toast />
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
