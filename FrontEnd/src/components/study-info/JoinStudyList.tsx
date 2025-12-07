import Card from '../public/Card';
import { useMyStudy } from '../../context/MyStudyContext';

function JoinStudyList() {
  const { myStudyList: data, selectStudy, setSelectStudy } = useMyStudy();
  // 상태에 따라서 채팅 오른쪽 점 색이 바뀜
  const statusColorMap: Record<string, string> = {
    RECRUITING: 'bg-emerald-500',
    FULL: 'bg-yellow-400',
    FINISHED: 'bg-gray-400',
  };

  return (
    <>
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
    </>
  );
}

export default JoinStudyList;