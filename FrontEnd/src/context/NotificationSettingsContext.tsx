import React, { createContext, useContext, useEffect, useState } from "react";

type NotificationSettings = {
  volume: number; // 0 ~ 1
  setVolume: (v: number) => void;
};

const NotificationSettingsContext = createContext<NotificationSettings | undefined>(undefined);

const STORAGE_KEY = "studyhub_notification_volume";

export const NotificationSettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [volume, setVolumeState] = useState(0.3); // 기본 30%

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      const parsed = Number(saved);
      if (!Number.isNaN(parsed) && parsed >= 0 && parsed <= 1) {
        setVolumeState(parsed);
      }
    }
  }, []);

  const setVolume = (v: number) => {
    const clamped = Math.min(1, Math.max(0, v));
    setVolumeState(clamped);
    localStorage.setItem(STORAGE_KEY, String(clamped));
  };

  return (
    <NotificationSettingsContext.Provider value={{ volume, setVolume }}>
      {children}
    </NotificationSettingsContext.Provider>
  );
};

export const useNotificationSettings = () => {
  const ctx = useContext(NotificationSettingsContext);
  if (!ctx) {
    throw new Error("useNotificationSettings는 NotificationSettingsProvider 안에서만 사용해야 합니다.");
  }
  return ctx;
};
