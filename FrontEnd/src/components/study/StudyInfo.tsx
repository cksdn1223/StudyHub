import { Bell, Bookmark, EllipsisVertical, Image as MoreVertical, Phone, Send, Video } from 'lucide-react';
import Card from '../Card';
import axios from 'axios';
import { getHeaders } from '../../context/AxiosConfig';
import { useQuery } from '@tanstack/react-query';
import { MyStudyList } from '../../type';
import { useEffect, useState } from 'react';



type ChatMessage = {
  id: number;
  sender?: string;
  time?: string;
  text?: string;
  fromMe?: boolean;
  accent?: 'primary' | 'highlight';
  attachment?: { name: string; size: string };
  type?: 'date' | 'system';
};
const chatMessages: ChatMessage[] = [
  { id: 100, type: 'date', text: '2024년 11월 26일' },
  { id: 1, sender: '김현수', time: '오후 2:31', text: '안녕하세요! 다음 주 프로젝트 일정에 대해서 논의해보면 좋을 것 같습니다.', accent: 'primary' },
  { id: 2, sender: '김현수', time: '오후 2:31', text: '현재 진행 상황을 공유하고 다음 단계를 계획해보죠!' },
  { id: 3, sender: '김개발', time: '오후 2:35', text: '좋은 아이디어네요! 저도 참여하고 싶습니다.', fromMe: true, accent: 'highlight' },
  { id: 4, sender: '박민지', time: '오후 2:42', text: '저희 팀 프로젝트 진행 상황 공유드릴게요!' },
  {
    id: 5,
    sender: '박민지',
    time: '오후 2:42',
    text: 'React_프로젝트_계획서.pdf',
    attachment: { name: 'React_프로젝트_계획서.pdf', size: '2.3 MB' },
  },
  { id: 6, sender: '박명희', time: '오후 3:15', text: '안녕하세요! 새로 참여하게 된 박명희입니다. 잘 부탁드립니다!' },
];



const getData = async () => {
  const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/study/me`, getHeaders());
  return response.data;
}
function StudyInfo() {
  const { data, isLoading, error } = useQuery<MyStudyList[]>({
    queryKey: ['myStudyList'],
    queryFn: getData
  })

  const statusColorMap: Record<string, string> = {
    RECRUITING: 'bg-emerald-500',
    FULL: 'bg-yellow-400',
    FINISHED: 'bg-gray-400',
  };
  const [selectStudy, setSelectStudy] = useState<MyStudyList>();
  useEffect(() => {
    if (!data) return;
    setSelectStudy(data[0])
  }, [data])

  if (isLoading) return <div>로딩중...</div>
  if (error) return <div>문제가 발생했습니다.. 관리자에게 문의해주세요.</div>
  if (data && selectStudy) {
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
            <Card className="flex flex-col min-h-[700px] max-h-[85vh] overflow-hidden">
              <div className="flex items-start justify-between pb-4 border-b border-gray-100 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-semibold">
                    N
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-800">{selectStudy.title}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <span>{selectStudy.address}</span>
                      <span>·</span>
                      <span>{selectStudy.detailAddress}</span>
                      <span>·</span>
                      <span>{selectStudy.detailLocation}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="py-4 space-y-4 flex-1 overflow-y-auto">
                {chatMessages.map((message) => {
                  if (message.type === 'date') {
                    return (
                      <div key={message.id} className="flex justify-center">
                        <div className="px-4 py-1 text-xs text-gray-500 bg-gray-100 rounded-full">
                          {message.text}
                        </div>
                      </div>
                    );
                  }

                  const isMine = message.fromMe;
                  const bubbleClasses = `
                  max-w-[70%] rounded-2xl px-4 py-3 shadow-sm border
                  bg-red-50 border-red-100 text-red-600
                `;

                  return (
                    <div key={message.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div className="flex items-start gap-3 max-w-full">
                        {/* 아이콘 */}
                        {!isMine && (
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-semibold">
                            {message.sender?.[0] ?? '?'}
                          </div>
                        )}
                        <div className={`space-y-1 ${isMine ? 'justify-end' : 'justify-start'}`}>
                          {/* 이름, 날짜 */}
                          {!isMine && (
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-gray-800">{message.sender}</p>
                              <span className="text-xs text-gray-400">{message.time}</span>
                            </div>
                          )}
                          {/* 채팅내용 */}
                          <div className={`${bubbleClasses}`}>
                            <p className="text-sm text-gray-800">{message.text}</p>
                          </div>
                          {isMine && (
                            <div className="text-right">
                              <span className="text-xs text-gray-400">{message.time}</span>
                            </div>
                          )}
                        </div>
                        {/* 내 아이콘 */}
                        {isMine && (
                          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-500 font-semibold">
                            나
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* 메시지 전송 구역 */}
              <div className="mt-auto border-t border-gray-100 pt-4 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="flex-1 flex items-center rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
                    <input
                      type="text"
                      placeholder="메시지를 입력하세요..."
                      className="flex-1 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    className="p-3 rounded-xl bg-red-400 text-white hover:bg-red-500 shadow-sm"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-3 mt-3 text-xs text-gray-500 flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-gray-100">예시 답장: 좋아요!</span>
                  <span className="px-3 py-1 rounded-full bg-gray-100">감사합니다.</span>
                  <span className="px-3 py-1 rounded-full bg-gray-100">안녕하세요.</span>
                  <span className="px-3 py-1 rounded-full bg-gray-100">확인했습니다.</span>
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
