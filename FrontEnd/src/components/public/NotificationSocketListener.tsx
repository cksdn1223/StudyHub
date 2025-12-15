import { useCallback, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNotificationSettings } from "../../context/NotificationSettingsContext";
import { Notification } from "../../type";
import { useNotificationSocket } from "../../hooks/useNotificationSocket";

const NotificationSocketListener = () => {
  const { user } = useAuth();
  const { volume } = useNotificationSettings();

  const msgSoundRef = useRef<HTMLAudioElement | null>(null);
  const otherSoundRef = useRef<HTMLAudioElement | null>(null);

  const volumeRef = useRef(volume);
  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

  const WS_BASE_URL = import.meta.env.DEV
    ? "" // dev일 땐 "" + "/ws-stomp" => "/ws-stomp" (=> proxy 사용)
    : import.meta.env.VITE_BASE_URL; // prod일 땐 Cloud Run 주소

  const onNotification = useCallback((n: Notification) => {
    const targetRef = n.type === "MESSAGE" ? otherSoundRef : msgSoundRef;
    const audio = targetRef.current;
    if (!audio) return;

    audio.volume = volumeRef.current;
    audio.currentTime = 0;
    void audio.play();
  }, []);
  useNotificationSocket({
    enabled: !!user?.id && !!user?.email,
    wsBaseUrl: WS_BASE_URL,
    userId: user?.id ?? 0,
    onNotification,
  });

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
