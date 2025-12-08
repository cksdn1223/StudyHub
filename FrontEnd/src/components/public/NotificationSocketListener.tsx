import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useNotification } from "../../context/NotificationContext";
import { useAuth } from "../../context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { useNotificationSettings } from "../../context/NotificationSettingsContext";

const NotificationSocketListener = () => {
  const { addNotification } = useNotification();
  const { user } = useAuth();
  const queryClient = useQueryClient();

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
        client.subscribe(`/sub/notification/${user.id}`, (message) => {
          const notification = JSON.parse(message.body);
          addNotification(notification);
          if (notification.type === "BAN" || notification.type === "REQUEST_ACCEPTED") {
            queryClient.invalidateQueries({ queryKey: ["myStudyList"] });
          }
          const targetRef =
            notification.type === "MESSAGE" ? msgSoundRef : otherSoundRef;

          if (targetRef.current) {
            targetRef.current.volume = volumeRef.current;
            targetRef.current.currentTime = 0;
            targetRef.current.play().catch(() => { });
          }
        });
      }
    });

    clientRef.current = client;
    client.activate();

    return () => {
      client.deactivate();
      clientRef.current = null;
    };
  }, [addNotification, user, queryClient]);

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
