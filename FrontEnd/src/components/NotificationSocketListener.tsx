import { useEffect } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useNotification } from "../context/NotificationContext";
import { useAuth } from "../context/AuthContext";

const NotificationSocketListener = () => {
  const { addNotification } = useNotification();
  const { user } = useAuth();
  useEffect(() => {
    if(!user) return;
    const client = new Client({
      webSocketFactory: () => new SockJS("/ws-stomp"),
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe(`/sub/notification/${user.id}`, (message) => {
          const notification = JSON.parse(message.body);
          addNotification(notification);
        });
      }
    });
    client.activate();
    return () => {
      client.deactivate();
    };
  }, [addNotification, user]);

  return null;
};

export default NotificationSocketListener;
