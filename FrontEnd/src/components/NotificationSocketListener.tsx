import { useEffect } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useNotification } from "../context/NotificationContext";
import { useAuth } from "../context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";

const NotificationSocketListener = () => {
  const { addNotification } = useNotification();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  useEffect(() => {
    if(!user) return;
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
