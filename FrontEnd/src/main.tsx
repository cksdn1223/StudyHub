import React from 'react'
import ReactDOM from 'react-dom/client'
import './css/index.css'
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import Toast from './components/public/Toast';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NotificationProvider } from './context/NotificationContext';
import { MyStudyProvider } from './context/MyStudyContext';
import { NotificationSettingsProvider } from './context/NotificationSettingsContext';
import NotificationSocketListener from './components/public/NotificationSocketListener';

const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ToastProvider>
          <AuthProvider>
            <MyStudyProvider>
              <NotificationProvider>
                <NotificationSettingsProvider >
                  <NotificationSocketListener />
                  <App />
                </NotificationSettingsProvider>
              </NotificationProvider>
            </MyStudyProvider>
          </AuthProvider>
          <Toast />
        </ToastProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
)
