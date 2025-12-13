import Card from '../public/Card';
import { useMyStudy } from '../../context/MyStudyContext';
import { useAuth } from '../../context/AuthContext';
import { useEffect, useRef, useState } from 'react';
import { Camera, Send } from 'lucide-react';
import { Client } from '@stomp/stompjs';
import defaultAvatar from '../../assets/image/defaultImage.webp';
import { useImageCropUpload } from '../../hooks/useImageCropUpload';
import ProfileImageCropModal from '../user-info/ProfileImageCropModal';
import { changeStudyImg } from '../../api/api';

function Chat({ stompClient }: { stompClient: Client | null }) {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const { chatList, chatListLoading, chatListError, selectStudy } = useMyStudy();
  const { user } = useAuth();
  const selectedStudyId = selectStudy?.studyId;
  const {
    uploading,
    showCropModal,
    cropImageUrl,
    fileInputRef,
    handleClick,
    handleFileChange,
    handleCropConfirm,
    handleCropCancel,
  } = useImageCropUpload({
    uploadCallback: async (formData) => {
      await changeStudyImg(formData, selectStudy?.studyId)
    },
  });
  useEffect(() => {
    if (!messagesContainerRef.current) return;
    const el = messagesContainerRef.current;
    el.scrollTop = el.scrollHeight;
  }, [chatList]);
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
  if (selectStudy && user)
    return (
      <>
        <Card className="flex flex-col min-h-[80vh] max-h-[85vh] overflow-hidden">
          <div className="flex items-start justify-between pb-4 border-b border-gray-100 flex-shrink-0">
            <div className="flex items-center gap-3">

              <div className="relative inline-block">
                <div className="w-24 h-24 rounded-lg overflow-hidden text-4xl bg-gray-300 flex items-center justify-center">
                  {selectStudy.studyImageUrl === null ? (
                    <>{selectStudy.title.slice(0, 1)}</>
                  ) : (
                    <img
                      className="w-full h-full object-cover"
                      src={selectStudy.studyImageUrl}
                      alt="스터디 이미지"
                    />)}
                </div>

                <button
                  type="button"
                  onClick={handleClick}
                  disabled={uploading}
                  className="absolute bottom-0 right-0 w-7 h-7 rounded-full 
                  bg-indigo-600 text-white flex items-center justify-center
                  shadow-sm hover:bg-indigo-700
                  disabled:opacity-60"
                >
                  <Camera size={14} />
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              {showCropModal && cropImageUrl && (
                <ProfileImageCropModal
                  rect={true}
                  imageUrl={cropImageUrl}
                  onCancel={handleCropCancel}
                  onConfirm={handleCropConfirm}
                />
              )}

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
                          <img
                            src={message.senderImageUrl === "defaultUrl" ? defaultAvatar : message.senderImageUrl} alt="유저 프로필 이미지" className='w-10 h-10 rounded-2xl' />
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
      </>
    );
}

export default Chat;