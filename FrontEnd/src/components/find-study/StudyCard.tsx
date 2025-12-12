import { StudyList } from "../../type";
import { useNavigate } from "react-router-dom";

function StudyCard(study: StudyList) {
  const navigate = useNavigate();

  const StudyStatusBadge = () => {
    switch (study.status) {
      case 'RECRUITING':
        return (
          <span className="bg-green-400 text-green-800 text-xs font-medium px-2 py-0.5 rounded-md mr-2">
            모집중
          </span>
        );
      case 'FULL':
        return (
          <span className="bg-blue-400 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-md mr-2">
            모집완료
          </span>
        );
      case 'FINISHED':
        return (
          <span className="bg-gray-400 text-gray-800 text-xs font-medium px-2 py-0.5 rounded-md mr-2">
            활동종료
          </span>
        );
      default:
        return null; // 알 수 없는 상태는 표시하지 않음
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className="flex justify-between border-b border-gray-200 py-6 hover:bg-gray-50 transition duration-150 focus:outline-none"
    >
      <div className="flex-1 pr-4">
        <div className="flex items-center text-sm mb-1 text-gray-500">
          <StudyStatusBadge />
          <span className="text-green-600 font-semibold mr-3">{Math.ceil(study.distanceKm * 10) / 10} Km</span>
          <span className="mr-3 text-gray-400">|</span>
          <span className="mr-3">{study.formattedCreatedAt}</span>
        </div>
        <span
          className="text-lg font-semibold text-gray-800 hover:text-red-500 mb-2  cursor-pointer"
          onClick={() => navigate(`/study/${study.id}`)}>
          {study.title}
        </span>
        <p className="text-sm text-gray-600 mb-3 line-clamp-1">{study.description}</p>

        {/* 태그 목록 */}
        <div className="flex space-x-2 mb-3">
          {study.tags.map(tag => (
            <span key={tag} className="bg-red-200 text-red-600 text-xs text-center font-medium px-2 py-0.5 rounded-md">
              {tag}
            </span>
          ))}
        </div>

        {/* 세부 정보 */}
        <div className="flex items-center text-sm text-gray-500 space-x-4">
          <span>{study.memberCount}/{study.maxMembers}명</span>
          <span className="text-gray-300">|</span>
          <span>{study.frequency}</span>
          <span className="text-gray-300">|</span>
          <span>{study.duration}</span>
        </div>
      </div>

      {/* 아바타 */}
      {study.studyImageUrl === null ?
        <div className="w-24 h-24 rounded-full bg-red-200 flex items-center justify-center text-white font-semibold text-4xl">
          {study.title?.[0] ?? "?"}
        </div> :
        <img
          className="w-24 h-24 rounded-full"
          src={study.studyImageUrl}
          alt="프로필 이미지"
        />
      }


    </div>
  );
}

export default StudyCard;