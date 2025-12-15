import React, { createContext, useContext, useMemo } from "react";
import { NotificationContextType } from "../type";
import { useAuth } from "./AuthContext";
import { useNotificationsQuery } from "../hooks/queries/useNotificationsQuery";
import { useNotificationsMutations } from "../hooks/queries/useNotificationMutations";

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider = ({ children }: React.PropsWithChildren) => {
  const { isLoggedIn } = useAuth();
  const enabled = isLoggedIn;

  const { data: notifications = [] } = useNotificationsQuery(enabled);
  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  const { markAsRead, markAllAsRead, removeNotification } = useNotificationsMutations();

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead: (id: number) => markAsRead.mutateAsync(id),
        markAllAsRead: () => markAllAsRead.mutateAsync(),
        removeNotification: (id: number) => removeNotification.mutateAsync(id),
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