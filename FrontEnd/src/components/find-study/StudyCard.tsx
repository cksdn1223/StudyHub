import { StudyList } from "../../type";
import { formatDistanceToNow, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';




function StudyCard(study: StudyList) {
  const dateObject = parseISO(study.createdAt);
  const timeAgo = formatDistanceToNow(dateObject, {
    addSuffix: true,
    locale: ko
  });
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
    <div className="flex justify-between border-b border-gray-200 py-6 hover:bg-gray-50 transition duration-150">
      <div className="flex-grow pr-4">
        <div className="flex items-center text-sm mb-1 text-gray-500">
          <StudyStatusBadge />
          <span className="text-green-600 font-semibold mr-3">{Math.ceil(study.distanceKm * 10) / 10} Km</span>
          <span className="mr-3 text-gray-400">|</span>
          <span className="mr-3">{timeAgo}</span>
        </div>
        <h4 className="text-lg font-semibold text-gray-800 mb-2 hover:text-red-500 cursor-pointer">
          {study.title}
        </h4>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{study.description}</p>

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

      {/* 아바타 (임시) */}
      <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0 self-start">
        {/*  */}
      </div>
    </div>
  );
}

export default StudyCard;