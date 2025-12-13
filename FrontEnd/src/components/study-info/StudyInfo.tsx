import { EllipsisVertical } from 'lucide-react';
import Card from '../public/Card';
import { useState } from 'react';
import { useMyStudy } from '../../context/MyStudyContext';
import { useAuth } from '../../context/AuthContext';
import { Member, MyStudyList } from '../../type';
import { useToast } from '../../context/ToastContext';
import { useQueryClient } from '@tanstack/react-query';
import defaultAvatar from "../../assets/image/defaultImage.webp";
import { participantStatusChange } from '../../api/api';

function StudyInfo() {
  const [openMemberId, setOpenMemberId] = useState<number | null>(null);
  const { selectStudy } = useMyStudy();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { showToast } = useToast();
  if (!selectStudy) return;
  const isLeader = selectStudy?.members.find(member => member.leader)?.userId === user.id;

  const handleKick = async (study: MyStudyList, sender: Member) => {
    // queryClient.invalidateQueries({ queryKey: ["myStudyList"] });
    queryClient.setQueryData<MyStudyList[]>(["myStudyList"], (old) =>
      old
        ? old.map((s) =>
          s.studyId === study.studyId
            ? {
              ...s,
              members: s.members.filter((m) => m.userId !== sender.userId),
              memberCount: s.memberCount - 1,
            }
            : s
        )
        : old
    );
    try {
      await participantStatusChange(study.studyId, sender.userId, "BAN");
      showToast(
        `${sender.nickname}님을 ${study.title.length > 5 ? study.title.substring(0, 5) + "..." : study.title
        }에서 강퇴하셨습니다.`,
        "info"
      );
      queryClient.invalidateQueries({ queryKey: ["myStudyList"] });
    } catch (e) {
      showToast("강퇴 처리 중 문제가 발생했습니다.", "error");
      queryClient.invalidateQueries({ queryKey: ["myStudyList"] });
    }
  }
  return (
    <>
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
              <div
                key={member.userId}
                className={`flex items-center justify-between ${openMemberId === member.userId ? "relative z-10" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <img src={member.profileImageUrl === "defaultUrl" ? defaultAvatar : member.profileImageUrl} alt="프로필 이미지" className={`w-10 h-10 rounded-full`} />
                  <div>
                    <p className={`text-sm font-semibold ${member.leader ? 'text-gray-900' : 'text-gray-800'}`}>{member.nickname}</p>
                    <p className="text-xs text-gray-500">{member.leader ? '리더' : '멤버'}</p>
                  </div>
                </div>
                {!member.leader && isLeader && <div className="relative">
                  <button
                    type="button"
                    className="relative p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-red-500"
                    onClick={() =>
                      setOpenMemberId((prev) =>
                        prev === member.userId ? null : member.userId
                      )
                    }
                  >
                    <EllipsisVertical strokeWidth={2.2} />
                  </button>
                  <div
                    className={`absolute right-0 top-7 w-24 border border-gray-300 rounded-xl shadow-xl
                      transform origin-top-right
                      transition-all duration-150
                      ${openMemberId === member.userId
                        ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
                      }
                    `}
                  >
                    <button
                      type="button"
                      className="w-full px-3 py-2 text-sm text-red-500 rounded-xl font-semibold text-center bg-white hover:bg-red-50 z-20"
                      onClick={() => handleKick(selectStudy, member)}
                    >
                      강퇴하기
                    </button>
                  </div>
                </div>}
              </div>
            ))}
          </div>
        </div>
      </Card>
    </>
  );
}

export default StudyInfo;