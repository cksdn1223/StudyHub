import { useQueryClient } from "@tanstack/react-query";
import { Notification } from "../type";
import { useEffect } from "react";
import { queryKeys } from "../utils/keys";

export function useNotificationSocket({
  enabled,
  subscribe,
}: {
  enabled: boolean;
  subscribe: (onMessage: (n: Notification) => void) => () => void;
}) {
  const qc = useQueryClient();

  useEffect(() => {
    if (!enabled) return;

    const unsubscribe = subscribe((n) => {
      qc.setQueryData<Notification[]>(queryKeys.notifications(), (prev) => {
        const list = prev ?? [];
        if (list.some((x) => x.id === n.id)) return list;
        const next = [n, ...list];
        next.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        return next;
      });
    });
    return () => unsubscribe?.();
  }, [enabled, subscribe, qc])
}
