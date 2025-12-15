import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useAuth } from "../../context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { useNotificationSettings } from "../../context/NotificationSettingsContext";
import { Notification } from "../../type";
import { queryKeys } from "../../utils/keys";

const NotificationSocketListener = () => {
  const { user } = useAuth();
  const qc = useQueryClient();

  const msgSoundRef = useRef<HTMLAudioElement | null>(null);
  const otherSoundRef = useRef<HTMLAudioElement | null>(null);

  const { volume } = useNotificationSettings();
  const volumeRef = useRef(volume);
  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

  const WS_BASE_URL = import.meta.env.DEV
    ? "" // dev일 땐 "" + "/ws-stomp" => "/ws-stomp" (=> proxy 사용)
    : import.meta.env.VITE_BASE_URL; // prod일 땐 Cloud Run 주소
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    if (user.email.length === 0) return;
    if (clientRef.current) return;
    const client = new Client({
      webSocketFactory: () => new SockJS(`${WS_BASE_URL}/ws-stomp`),
      reconnectDelay: 5000,
      onConnect: () => {
        const sub = client.subscribe(`/sub/notification/${user.id}`, (message) => {
          const notification = JSON.parse(message.body);

          qc.setQueryData<Notification[]>(queryKeys.notifications(), (prev) => {
            const list = prev ?? [];
            if (list.some((x) => x.id === notification.id)) return list;
            const next = [notification, ...list];
            next.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            return next;
          });

          if (notification.type === "BAN" || notification.type === "REQUEST_ACCEPTED") {
            qc.invalidateQueries({ queryKey: queryKeys.myStudyList() });
          }

          const targetRef =
            notification.type === "MESSAGE" ? otherSoundRef : msgSoundRef;
          if (targetRef.current) {
            targetRef.current.volume = volumeRef.current;
            targetRef.current.currentTime = 0;
            targetRef.current.play().catch(() => { });
          }
        });
        void sub;
      },
    });

    clientRef.current = client;
    client.activate();

    return () => {
      client.deactivate();
      clientRef.current = null;
    };
  }, [user, qc, WS_BASE_URL]);

  return (
    <>
      <audio
        ref={msgSoundRef}
        src="/sounds/message.mp3"
        preload="auto"
      />
      <audio
        ref={otherSoundRef}
        src="/sounds/other.mp3"
        preload="auto"
      />
    </>
  );
};

export default NotificationSocketListener;
