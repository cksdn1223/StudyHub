import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useNotification } from "../../context/NotificationContext";
import { useAuth } from "../../context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";

const NotificationSocketListener = () => {
  const { addNotification } = useNotification();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isConnectedRef = useRef(false);
  
  const msgSoundRef = useRef<HTMLAudioElement | null>(null);
  const otherSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (user.email.length===0) return;
    if (isConnectedRef.current) return; // dev에서 중복 실행 방지
    isConnectedRef.current = true;
    const client = new Client({
      webSocketFactory: () => new SockJS("/ws-stomp"),
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
            targetRef.current.volume = 0.5;
            targetRef.current.currentTime = 0;
            targetRef.current
              .play()
              .catch(() => {
                // 자동재생 막힐 수 있으니 에러는 무시
              });
          }
        });
      }
    });
    client.activate();
    return () => {
      client.deactivate();
      isConnectedRef.current = false;
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
