import { useToast } from '../../context/ToastContext';
import Card from '../public/Card'; // Card 컴포넌트 import

const StudyPreview = ({ title, description, memberCount, maxMembers, frequency, duration, detailLocation }: React.PropsWithChildren<{
  title: string;
  description: string;
  memberCount: number;
  maxMembers: number;
  frequency: string;
  duration: string;
  detailLocation: string,
}>) => {
  const { showToast } = useToast();
  return (
    <>
      <Card className="bg-red-50 border-red-300">
        <h2 className="text-base font-bold text-red-700 border-b border-red-200 pb-3 mb-3">미리보기</h2>

        <div className="bg-white p-4 rounded-lg border border-red-200 shadow-sm">
          <p className="text-xs text-red-500 font-semibold mb-1">모집중 | {detailLocation}</p>
          <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>

          <div className="flex text-sm text-gray-600 mb-3 space-x-4">
            <div className="flex items-center"><span className="mr-1">🧑‍🤝‍🧑</span> {memberCount}/{maxMembers} 명</div>
            <div className="flex items-center"><span className="mr-1">🗓️</span> {frequency}</div>
            <div className="flex items-center"><span className="mr-1">🕒</span> {duration}</div>
          </div>

          <div className="text-sm text-gray-700 whitespace-pre-line">{description}</div>
        </div>

        {/* 작성 팁 */}
        <div className="mt-4 p-4 rounded-lg bg-yellow-50 border border-yellow-200 text-sm">
          <p className="flex items-center font-bold text-yellow-800 mb-2">
            <span className="text-lg mr-2">📌</span> 작성 팁
          </p>
          <ul className="text-yellow-700 space-y-1 text-xs list-disc list-inside">
            <li><strong>구체적인 목표</strong>와 커리큘럼을 명시</li>
            <li><strong>예상되는 참여자 수준</strong>을 알려주세요</li>
            <li><strong>정확한 진행 방식과 장소</strong>를 기입하세요</li>
            <li>관련 <strong>기술 스택</strong>을 추가하세요</li>
          </ul>
        </div>
      </Card>
      <button
        type="button"
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        onClick={() => showToast("AI 추천 기능은 현재 준비 중입니다.", "info")}
      >
        AI에게 추천받기
      </button>
    </>
  );
};

export default StudyPreview;