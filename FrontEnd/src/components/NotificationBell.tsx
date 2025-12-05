import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import type { Notification } from "../type";
import { useNotification } from "../context/NotificationContext";
import { useMyStudy } from "../context/MyStudyContext";
import { useNavigate } from "react-router-dom";



function NotificationBell() {
  const { notifications, markAsRead, markAllAsRead, removeNotification } = useNotification();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const { myStudyList, setSelectStudy } = useMyStudy();
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const onClickNotification = (n: Notification) => {
    if (location.pathname !== "/chat") navigate("/chat");
    if (n.type === "MESSAGE") setSelectStudy(myStudyList.find(study => study.studyId === n.studyId) || myStudyList[0])
    else if (n.type === "JOIN_REQUEST") {
    //TODO 참여 쪽으로 넘어가게
      console.log('join_request')
    }
    if (!n.isRead) markAsRead(n.id);
  };
  const handleAccept = (e: React.MouseEvent, n: Notification) => {
    e.stopPropagation();
    if (!n.isRead) markAsRead(n.id);
    console.log("가입 요청 수락:", n);
  };
  const handleReject = (e: React.MouseEvent, n: Notification) => {
    e.stopPropagation();
    if (!n.isRead) markAsRead(n.id);
    console.log("가입 요청 거절:", n);
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
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <span className="font-semibold text-sm text-gray-800">
              알림
              {unreadCount > 0 && (
                <span className="pl-2 text-xs text-gray-400">
                  읽지 않은 알림 {unreadCount}개
                </span>
              )}
            </span>
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
          <div className="max-h-80 overflow-y-auto py-0">
            {notifications.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-gray-400">
                새로운 알림이 없습니다.
              </div>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => onClickNotification?.(n)}
                  className={`w-full text-left px-4 py-3 flex gap-3 hover:bg-gray-50 transition ${!n.isRead ? "bg-indigo-50/60" : ""
                    }`}
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
                        <button
                          type="button"
                          onClick={(e) => handleDelete(e, n)}
                          className=" text-gray-300 w-4 h-4 hover:text-red-500"
                        >
                          ✕
                        </button>
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
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
