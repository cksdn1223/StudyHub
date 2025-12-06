import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { Notification, NotificationContextType } from "../type";
import { getHeaders } from "./AxiosConfig";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider = ({ children }: React.PropsWithChildren) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { isLoggedIn } = useAuth();
  // 🔹 1) 처음 진입 시 백엔드에서 알림 불러오기
  useEffect(() => {
    if (!isLoggedIn) return;
    const fetchInitial = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/notifications`, getHeaders());
        const noti = res.data.sort((a:Notification,b:Notification)=> new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setNotifications(noti);
        setUnreadCount(res.data.filter((noti: Notification) => !noti.isRead).length);
      } catch (e) {
        console.error("알림 초기 로딩 실패", e);
      }
    };
    fetchInitial();
  }, [isLoggedIn]);

  // 🔹 2) 웹소켓으로 받은 새 알림 추가할 때 사용
  const addNotification = (n: Notification) => {
    setNotifications((prev) => [n, ...prev]);
    if (!n.isRead) {
      setUnreadCount((prev) => prev + 1);
    }
  };

  // 🔹 3) 개별 읽음 처리
  const markAsRead = async (id: number) => {
    try {
      await axios.put(`${import.meta.env.VITE_BASE_URL}/notifications/${id}`, null, getHeaders());
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (e) {
      console.error("알림 읽음 처리 실패", e);
    }
  };

  // 🔹 4) 전체 읽음 처리
  const markAllAsRead = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_BASE_URL}/notifications`, null, getHeaders());
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (e) {
      console.error("알림 전체 읽음 처리 실패", e);
    }
  };

  // 5. 알람 삭제
  const removeNotification = async (id: number) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/notifications/${id}`,
        getHeaders()
      );

      setNotifications((prev) => {
        const target = prev.find((n) => n.id === id);
        const next = prev.filter((n) => n.id !== id);

        if (target && !target.isRead) {
          setUnreadCount((prevCount) => Math.max(prevCount - 1, 0));
        }

        return next;
      });
    } catch (e) {
      console.error("알림 삭제 실패", e);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error("useNotification은 NotificationProvider 안에서만 사용해야 합니다.");
  }
  return ctx;
};