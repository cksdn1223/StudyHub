import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useEffect, useState } from "react";

function Test() {
  const [stompClient, setStompClient] = useState<Client | null>(null);

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS("/ws-stomp"),
      reconnectDelay: 5000, // 끊겼을 때 재연결 (옵션)
      onConnect: () => {
        console.log("🔗 STOMP connected");
        client.subscribe("/sub/message", (message) => {
          console.log("📩 받은 메시지:", message);
        });
      },
      onStompError: (frame) => {
        console.error("❌ STOMP error:", frame.headers["message"]);
      },
    });
    client.activate();
    setStompClient(client);
    return () => {
      client.deactivate();
    };
  }, []);

  const sendMessage = () => {
    if (stompClient && stompClient.connected) {
      stompClient.publish({
        destination: "/pub/message", // @MessageMapping("/message")랑 매핑
        body: "hello from frontend",
      });
      console.log("✅ 메시지 발행");
    } else {
      console.log("⚠️ 아직 WebSocket이 연결되지 않았습니다.");
    }
  };

  return (
    <div>
      <button onClick={sendMessage}>메시지 보내기</button>

    </div>
  );
}

export default Test;
