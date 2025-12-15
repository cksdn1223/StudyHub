import { useQueryClient } from "@tanstack/react-query";
import { Notification } from "../type";
import { useEffect, useRef } from "react";
import { queryKeys } from "../utils/keys";
import { Client, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";

type Args = {
  enabled: boolean;
  wsBaseUrl: string;  // "" or VITE_BASE_URL
  userId: number;
  onNotification?: (n: Notification) => void;
};

export function useNotificationSocket({
  enabled,
  wsBaseUrl,
  userId,
  onNotification,
}: Args) {
  const qc = useQueryClient();
  const clientRef = useRef<Client | null>(null);
  const subRef = useRef<StompSubscription | null>(null);
  const prevKeyRef = useRef<string>("");

  const onNotiRef = useRef(onNotification);
  useEffect(() => {
    onNotiRef.current = onNotification;
  }, [onNotification])

  useEffect(() => {
    const key = `${wsBaseUrl}-${userId}`;

    // 조건 안 맞으면 정리
    if (!enabled) {
      subRef.current?.unsubscribe();
      subRef.current = null;
      if (clientRef.current) void clientRef.current?.deactivate();
      clientRef.current = null;
      prevKeyRef.current = "";
      return;
    }

    // key가 바뀌면 기존 연결 정리 후 새로 연결
    if (prevKeyRef.current && prevKeyRef.current !== key) {
      subRef.current?.unsubscribe();
      subRef.current = null;
      if (clientRef.current) void clientRef.current.deactivate();
      clientRef.current = null;
    }
    prevKeyRef.current = key;

    if (clientRef.current) return;

    const client = new Client({
      webSocketFactory: () => new SockJS(`${wsBaseUrl}/ws-stomp`),
      reconnectDelay: 5000,
      onConnect: () => {
        subRef.current?.unsubscribe();

        subRef.current = client.subscribe(`/sub/notification/${userId}`, (message) => {
          const n: Notification = JSON.parse(message.body);

          qc.setQueryData<Notification[]>(queryKeys.notifications(), (prev) => {
            const list = prev ?? [];
            if (list.some((x) => x.id === n.id)) return list;
            const next = [n, ...list];
            next.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            return next;
          });
          if (n.type === "BAN" || n.type === "REQUEST_ACCEPTED") {
            qc.invalidateQueries({ queryKey: queryKeys.myStudyList() });
          }
          onNotiRef.current?.(n);
        });
      },
    });

    clientRef.current = client;
    client.activate();

    return () => {
      subRef.current?.unsubscribe();
      subRef.current = null;

      void client.deactivate();
      clientRef.current = null;
    };
  }, [enabled, wsBaseUrl, userId, qc])
}
