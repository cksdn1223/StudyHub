import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import type { Notification, ParticipantStatus } from "../../type";
import { useNotification } from "../../context/NotificationContext";
import { useMyStudy } from "../../context/MyStudyContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import axios from "axios";
import { getHeaders } from "../../context/AxiosConfig";
import { useQueryClient } from "@tanstack/react-query";
import { useNotificationSettings } from "../../context/NotificationSettingsContext";

export const participantStatusChange = async (studyId: number, senderId: number, status: ParticipantStatus) => {
  await axios.put(`${import.meta.env.VITE_BASE_URL}/participant/${studyId}`, {
    userId: senderId,
    status: status
  }, getHeaders())
}

function NotificationBell() {
  const { notifications, markAsRead, markAllAsRead, removeNotification } = useNotification();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const { myStudyList, setSelectStudy } = useMyStudy();
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const { volume, setVolume } = useNotificationSettings();

  const onClickNotification = (n: Notification) => {
    if (n.type === "MESSAGE") {
      const targetStudy =
        myStudyList.find((s) => s.studyId === n.studyId) ?? myStudyList[0];
      setSelectStudy(targetStudy);
      if (location.pathname !== "/chat") navigate("/chat");
    }
    if (!n.isRead) markAsRead(n.id);
  };
  const handleAccept = async (e: React.MouseEvent, n: Notification) => {
    e.stopPropagation();
    try {
      await participantStatusChange(n.studyId, n.senderId, "ACCEPTED")
      await queryClient.invalidateQueries({ queryKey: ["myStudyList"] });
      showToast(`${n.senderNickname}님의 ${n.studyTitle.length > 5 ? n.studyTitle.substring(0, 5) + '...' : n.studyTitle} 가입을 수락하셨습니다.`, "info")
      removeNotification(n.id);
    } catch (err) {
      showToast("가입 수락 처리중 문제가 발생했습니다.", "error");
    }
  };
  const handleReject = (e: React.MouseEvent, n: Notification) => {
    e.stopPropagation();
    participantStatusChange(n.studyId, n.senderId, "REJECTED")
    showToast(`${n.senderNickname}님의 ${n.studyTitle.length > 5 ? n.studyTitle.substring(0, 5) + '...' : n.studyTitle} 가입을 거절하셨습니다.`, "info")
    removeNotification(n.id);
  };
  const handleDelete = (e: React.MouseEvent, n: Notification) => {
    e.stopPropagation();
    removeNotification(n.id);
  };
  // 바깥 클릭 시 닫히게
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const formatType = (type: Notification["type"]) => {
    switch (type) {
      case "JOIN_REQUEST":
        return "가입 요청";
      case "REQUEST_ACCEPTED":
        return "가입 수락";
      case "REQUEST_REJECTED":
        return "가입 거절";
      case "MESSAGE":
        return "메시지";
      case "BAN":
        return "강퇴";
      default:
        return type;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 벨 아이콘 + 뱃지 */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="relative p-2 rounded-full hover:text-red-400 hover:bg-gray-100 transition"
      >
        <Bell />
        {/* 🔴 안 읽은 알림이 있을 때만 뱃지 표시 */}
        {unreadCount > 0 && (
          <span
            className="
                      absolute translate-x-3 -translate-y-7
                      flex items-center justify-center
                      min-w-[16px] h-[16px]
                      rounded-full bg-red-500 text-white
                      text-[10px] leading-none px-[3px]
                      "
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* 드롭다운 */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3 justify-between">
            <div className="flex flex-col">
              <span className="font-semibold text-sm text-gray-800">
                알림
              </span>
              {/* {unreadCount > 0 && (
                <span className="text-xs text-gray-400">
                  읽지 않은 알림 {unreadCount}개
                </span>
              )} */}
            </div>
            {/* 볼륨 슬라이더 */}
            <div className="flex items-center gap-2 text-[12px] text-gray-500">
              <span className="whitespace-nowrap">소리</span>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={Math.round(volume * 100)}
                onChange={(e) => setVolume(Number(e.target.value) / 100)}
                className="flex-1 w-20 accent-red-400"
              />
              <span className="w-8 text-[11px] text-right text-gray-400">
                {Math.round(volume * 100)}%
              </span>
            </div>

            {/* 모두 읽기 버튼 */}
            <button
              type="button"
              disabled={unreadCount === 0}
              onClick={markAllAsRead}
              className={`
                inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium
                transition
                ${unreadCount === 0
                  ? "border-gray-200 text-gray-300 bg-gray-50 cursor-default"
                  : "border-indigo-100 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 hover:border-indigo-200"
                }
              `}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              모두 읽기
            </button>
          </div>

          {/* 밑 알림 리스트 구역 */}
          <div className="max-h-80 overflow-y-auto py-0">
            {notifications.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-gray-400">
                새로운 알림이 없습니다.
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => onClickNotification?.(n)}
                  className={`w-full text-left px-4 py-3 flex gap-3 rounded-xl hover:bg-gray-50 transition hover:cursor-pointer
                    ${!n.isRead ? "bg-indigo-50/60" : ""}`}
                >

                  {/* 왼쪽 점/타입 */}
                  <div className="pt-1">
                    {!n.isRead ? (
                      <span className="block w-2 h-2 rounded-full bg-indigo-500" />
                    ) : (
                      <span className="block w-2 h-2 rounded-full bg-gray-300" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-medium text-indigo-600">
                        {formatType(n.type)}
                      </span>
                      <span className="text-[11px] text-gray-400">
                        {new Date(n.createdAt).toLocaleString("ko-KR", {
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        {n.type !== "JOIN_REQUEST" && <button
                          type="button"
                          onClick={(e) => handleDelete(e, n)}
                          className=" text-gray-500 font-bold w-4 h-4 hover:text-red-500"
                        >
                          ✕
                        </button>}
                      </span>
                    </div>

                    <p className="mt-0.5 text-xs text-gray-500 truncate">
                      {n.studyTitle} · {n.senderNickname}
                    </p>
                    <p className="mt-1 text-sm text-gray-800 line-clamp-2">
                      {n.message}
                    </p>
                    {n.type === "JOIN_REQUEST" && (
                      <div className="mt-2 flex gap-2">
                        <button
                          type="button"
                          onClick={(e) => handleAccept(e, n)}
                          className="px-3 py-1 rounded-full text-xs font-medium
                                    bg-emerald-50 text-emerald-600 border border-emerald-100
                                    hover:bg-emerald-100 transition"
                        >
                          수락
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleReject(e, n)}
                          className="px-3 py-1 rounded-full text-xs font-medium
                                    bg-red-50 text-red-500 border border-red-100
                                    hover:bg-red-100 transition"
                        >
                          거절
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
