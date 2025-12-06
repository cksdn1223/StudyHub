
import { useQueryClient } from '@tanstack/react-query';
import { ChatMessage } from '../../type';
import { useEffect, useState } from 'react';
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useAuth } from '../../context/AuthContext';
import { useMyStudy } from '../../context/MyStudyContext';
import JoinStudyList from './JoinStudyList';
import Chat from './Chat';
import StudyInfo from './StudyInfo';




function Study() {
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { isLoading, error, selectStudy } = useMyStudy();
  const selectedStudyId = selectStudy?.studyId;
  // 웹소켓 연결용 useEffect
  useEffect(() => {
    if (!selectedStudyId) return;
    const client = new Client({
      webSocketFactory: () => new SockJS("/ws-stomp"),
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe(`/sub/message/${selectedStudyId}`, (message) => {
          const newMessage: ChatMessage = JSON.parse(message.body);
          queryClient.setQueryData<ChatMessage[]>(
            ["chatList", selectedStudyId],
            (old) => (old ? [...old, newMessage] : [newMessage])
          );
        });
      },
    });
    client.activate();
    setStompClient(client);
    return () => {
      if (client.active) {
        client.deactivate();
      }
    };
  }, [selectedStudyId, queryClient]);
  // 메시지 전송용 함수


  if (!user) return;
  if (isLoading) return <div>로딩중...</div>
  if (error) return <div>문제가 발생했습니다.. 관리자에게 문의해주세요.</div>
  if (!selectStudy) return <div>스터디 정보를 불러오는 중입니다...</div>
  return (
    <div className="bg-gray-50">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr_320px] gap-6 items-start">
          {/* 왼쪽: 참여 스터디 목록 */}
          <JoinStudyList />
          {/* 중앙: 채팅 영역 */}
          <Chat stompClient={stompClient} />
          {/* 오른쪽: 스터디 정보 */}
          <StudyInfo />
        </div>
      </div>
    </div>
  );
}


export default Study;
