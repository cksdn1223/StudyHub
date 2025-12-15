import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNotification, readAllNotification, readNotification } from "../../api/api";
import { queryKeys } from "../../utils/keys";
import { Notification } from "../../type";

export function useNotificationsMutations() {
  const qc = useQueryClient();

  const markAsRead = useMutation({
    mutationFn: (id: number) => readNotification(id),
    onSuccess: (_res, id) => {
      qc.setQueryData<Notification[]>(queryKeys.notifications(), (prev) => {
        if (!prev) return prev;
        return prev.map((n) => (n.id === id ? { ...n, isRead: true } : n));
      });
    },
  });
  
  const markAllAsRead = useMutation({
    mutationFn: () => readAllNotification(),
    onSuccess: () => {
      qc.setQueryData<Notification[]>(queryKeys.notifications(), (prev) => {
        if(!prev) return prev;
        return prev.map((n) => ({ ...n, isRead: true }));
      });
    },
  });

  const removeNotification = useMutation({
    mutationFn: (id: number) => deleteNotification(id),
    onSuccess: (_res, id) => {
      qc.setQueryData<Notification[]>(queryKeys.notifications(), (prev) => {
        if (!prev) return prev;
        return prev.filter((n) => n.id !== id);
      });
    },
  });

  return { markAsRead, markAllAsRead, removeNotification };
}