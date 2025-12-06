import { EllipsisVertical } from 'lucide-react';
import Card from '../Card';
import { useState } from 'react';
import { useMyStudy } from '../../context/MyStudyContext';
import { useAuth } from '../../context/AuthContext';

function StudyInfo() {
  const [openMemberId, setOpenMemberId] = useState<number | null>(null);
  const { selectStudy } = useMyStudy();
  const { user } = useAuth();
  if (!user || !selectStudy) return;
  const isLeader = selectStudy?.members.find(member => member.leader)?.userId === user.id;

  const handleKick = (studyId, userId) => {
    console.log(studyId, userId)
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
                  <div className={`w-10 h-10 rounded-full ${member.leader ? 'bg-red-100 text-red-500' : 'bg-gray-100 text-gray-500'} flex items-center justify-center font-semibold`}>
                    {member.nickname[0]}
                  </div>
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
                    onClick={() => handleKick(selectStudy.studyId, member.userId)}
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