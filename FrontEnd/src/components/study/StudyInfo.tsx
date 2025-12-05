import { EllipsisVertical, Send } from 'lucide-react';
import Card from '../Card';
import axios from 'axios';
import { getHeaders } from '../../context/AxiosConfig';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ChatMessage } from '../../type';
import { useEffect, useRef, useState } from 'react';
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useAuth } from '../../context/AuthContext';
import { useMyStudy } from '../../context/MyStudyContext';


const getChatData = async (studyId: number) => {
  const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/study/${studyId}/messages`, getHeaders());
  return response.data;
}

function StudyInfo() {
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  const { user } = useAuth();
  const queryClient = useQueryClient();

  // 스터디 리스트 불러오는 useQuery
  const { myStudyList: data, isLoading, error, selectStudy, setSelectStudy } = useMyStudy();
  // 기본 선택 스터디 첫번째로 만드는 useEffect
  useEffect(() => {
    if (data.length === 0) return;
    else if(selectStudy === null) setSelectStudy(data[0])
  }, [data, setSelectStudy, selectStudy])
  const selectedStudyId = selectStudy?.studyId;
  // 채팅내역 불러오는 useQuery
  const { data: chatList, isLoading: chatListLoading, error: chatListError } = useQuery<ChatMessage[]>({
    queryKey: ['chatList', selectedStudyId],
    queryFn: () => {
      if (!selectedStudyId) {
        throw new Error('studyId가 없습니다.');
      }
      return getChatData(selectedStudyId);
    },
    enabled: !!selectedStudyId,
    refetchOnWindowFocus: false,
  })
  // 채팅창 드래그 자동스크롤 관리
  useEffect(() => {
    if (!messagesContainerRef.current) return;
    const el = messagesContainerRef.current;
    el.scrollTop = el.scrollHeight; 
  }, [chatList]);
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
  const sendMessage = () => {
    if (stompClient && stompClient.connected && inputMessage.trim() !== "") {
      stompClient.publish({
        destination: `/pub/message/${selectedStudyId}`,
        body: JSON.stringify(
          {
            userId: user?.id,
            content: inputMessage,
          }),
      });
      setInputMessage('');
    }
  };

  // 상태에 따라서 채팅 오른쪽 점 색이 바뀜
  const statusColorMap: Record<string, string> = {
    RECRUITING: 'bg-emerald-500',
    FULL: 'bg-yellow-400',
    FINISHED: 'bg-gray-400',
  };
  if (!user) return;
  if (isLoading) return <div>로딩중...</div>
  if (error) return <div>문제가 발생했습니다.. 관리자에게 문의해주세요.</div>
  if (data && selectStudy && chatList) {
    return (
      <div className="bg-gray-50">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr_320px] gap-6 items-start">

            {/* 왼쪽: 참여 스터디 목록 */}
            <Card
              title="참여 스터디"
            >
              {/* 참여 스터디 목록 표시구역 */}
              <div className="space-y-3">
                {data.map((study) => (
                  <div
                    key={study.studyId}
                    // 채팅으로 연결할 studyId
                    onClick={() => setSelectStudy(study)}
                    className={`flex items-center gap-3 p-3 rounded-xl border ${selectStudy === study ? 'border-red-400' : 'border-gray-100'} bg-white hover:border-red-400 hover:shadow-sm transition hover:cursor-pointer`}
                  >
                    <div className={`w-10 h-10 rounded-lg bg-red-500 flex items-center justify-center text-white font-semibold`}>
                      {study.title.slice(0, 1)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-800 truncate">{study.title}</p>
                      </div>
                      <p className="text-xs text-gray-500 truncate">{study.description}</p>
                    </div>
                    <span
                      className={`w-2 h-2 rounded-full ${statusColorMap[study.status] ?? 'bg-gray-300'
                        }`}
                    />
                  </div>
                ))}
              </div>
            </Card>


            {/* 중앙: 채팅 영역 */}
            <Card className="flex flex-col min-h-[80vh] max-h-[85vh] overflow-hidden">
              <div className="flex items-start justify-between pb-4 border-b border-gray-100 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-red-500 text-white flex items-center justify-center font-semibold">
                    {selectStudy.title?.[0] ?? "?"}
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-800">{selectStudy.title}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <span>{selectStudy.address}</span>
                      <span>·</span>
                      <span>{selectStudy.detailAddress ? selectStudy.detailAddress : '세부 위치 없음'}</span>
                      <span>·</span>
                      <span>{selectStudy.detailLocation}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div
                ref={messagesContainerRef}
                className="py-4 space-y-4 flex-1 overflow-y-auto chat-scroll scroll-smooth"
              >
                {chatListLoading
                  ? "로딩중입니다..."
                  : chatListError
                    ? "채팅내역을 불러오는데 실패했습니다.. 관리자에게 문의해주세요."
                    : chatList.map((message, index) => {
                      const isMine = message.senderId === user.id;

                      const formattedTime = new Intl.DateTimeFormat("ko-KR", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                        timeZone: "Asia/Seoul",
                      }).format(new Date(message.sentAt));

                      return (
                        <div
                          key={index}
                          className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                        >
                          {/* 상대방일 때: 아바타 */}
                          {!isMine && (
                            <div className="mr-2">
                              <div className="w-10 h-10 rounded-2xl bg-blue-200 flex items-center justify-center text-white font-semibold text-sm">
                                {message.senderNickname?.[0] ?? "?"}
                              </div>
                            </div>
                          )}

                          {/* 말풍선 + 이름/시간 영역 */}
                          <div
                            className={`flex flex-col ${isMine ? "items-end" : "items-start"
                              } max-w-[70%]`}
                          >
                            {/* 상대방 이름 */}
                            {!isMine && (
                              <span className="text-xs text-gray-700 mb-1">
                                {message.senderNickname}
                              </span>
                            )}

                            {/* 말풍선 + 시간 한 줄 */}
                            <div
                              className={`flex items-end gap-1 ${isMine ? "flex-row" : "flex-row"
                                }`}
                            >
                              {/* 내 메시지: 시간 - 말풍선(노랑) */}
                              {/* 상대 메시지: 말풍선(흰색) - 시간 */}
                              {isMine && (
                                <span className="text-[11px] text-gray-500">
                                  {formattedTime}
                                </span>
                              )}

                              <div
                                className={`rounded-xl px-3 py-2 shadow-sm ${isMine
                                  ? "bg-yellow-300"
                                  : "bg-white border border-gray-200"
                                  }`}
                              >
                                <p className={`text-sm break-words font-medium ${isMine ? "text-gray-900" : "text-gray-900"}`}>
                                  {message.content}
                                </p>
                              </div>

                              {!isMine && (
                                <span className="text-[11px] text-gray-500">
                                  {formattedTime}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                <div ref={messagesEndRef}></div>
              </div>
              {/* 메시지 전송 구역 */}
              <div className="mt-auto border-t border-gray-100 pt-4 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="flex-1 flex items-center rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                      placeholder="메시지를 입력하세요..."
                      className="flex-1 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={sendMessage}
                    className="p-3 rounded-xl bg-red-400 text-white hover:bg-red-500 shadow-sm"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-3 mt-3 text-xs text-gray-900 font-sans flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-red-300 hover:cursor-pointer"
                    onClick={() => setInputMessage('좋아요!')}>좋아요!</span>
                  <span className="px-3 py-1 rounded-full bg-red-300 hover:cursor-pointer"
                    onClick={() => setInputMessage('감사합니다.')}>감사합니다.</span>
                  <span className="px-3 py-1 rounded-full bg-red-300 hover:cursor-pointer"
                    onClick={() => setInputMessage('안녕하세요.')}>안녕하세요.</span>
                  <span className="px-3 py-1 rounded-full bg-red-300 hover:cursor-pointer"
                    onClick={() => setInputMessage('확인했습니다.')}>확인했습니다.</span>
                </div>
              </div>
            </Card>

            {/* 오른쪽: 스터디 정보 */}
            <Card title="스터디 정보">
              <div className="mb-6">
                <p className="text-lg font-bold text-gray-800">{selectStudy.title}</p>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed line-clamp-3">
                  {selectStudy.description}
                </p>
                <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <span className="inline-block w-2 h-2 rounded-full bg-red-400" />
                    {selectStudy.frequency}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="inline-block w-2 h-2 rounded-full bg-indigo-400" />
                    {selectStudy.duration}
                  </span>
                </div>
              </div>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-gray-800">참여 멤버 ({selectStudy.memberCount})</p>
                </div>
                <div className="space-y-3">
                  {selectStudy.members.map((member) => (
                    <div key={member.userId} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full ${member.leader ? 'bg-red-100 text-red-500' : 'bg-gray-100 text-gray-500'} flex items-center justify-center font-semibold`}>
                          {member.nickname[0]}
                        </div>
                        <div>
                          <p className={`text-sm font-semibold ${member.leader ? 'text-gray-900' : 'text-gray-800'}`}>{member.nickname}</p>
                          <p className="text-xs text-gray-500">{member.leader ? '리더' : '멤버'}</p>
                        </div>
                      </div>
                      <div>
                        <EllipsisVertical
                          size={20}
                          strokeWidth={2.5}
                          className="text-gray-400 hover:text-red-500 hover:cursor-pointer"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </Card>

          </div>
        </div>
      </div>
    );
  }
}

export default StudyInfo;
