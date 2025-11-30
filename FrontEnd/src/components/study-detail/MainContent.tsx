import { ChevronRight, MapPin } from "lucide-react";
import { StudyList } from "../../type";
import { useNavigate } from "react-router-dom";

function MainContent({ data }: { data: StudyList }) {
  const navigate = useNavigate();
  
  return (
    <div className="lg:w-8/12 pr-6">
      <div className="text-sm text-gray-500 mb-4 flex items-center">
        <span onClick={()=>navigate("/find")} className="hover:cursor-pointer hover:text-red-500">스터디 찾기</span> <ChevronRight size={14} className="mx-1" />
        <span className="font-semibold text-blue-600">{data.title}</span>
      </div>

      <div className="flex items-center text-sm text-red-500 font-semibold mb-2">
        <MapPin size={16} className="mr-1" />
        <span>{Math.ceil(data.distanceKm * 10) / 10}Km · {data.formattedCreatedAt} 등록</span>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">{data.title}</h1>
      <div className="flex space-x-2 mb-6">
        {data.tags.map(tag => (
          <span key={tag} className="px-3 py-1 text-sm font-medium bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {tag}
          </span>
        ))}
      </div>

      {/* --- 상세 정보 섹션 --- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 border border-gray-200 rounded-lg bg-white shadow-sm mb-8">
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">
            {data.memberCount}/{data.maxMembers}
          </p>
          <p className="text-xs text-gray-500 mt-1">모집 인원</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-gray-800">{data.frequency}</p>
          <p className="text-xs text-gray-500 mt-1">진행 빈도</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-gray-800">{data.duration}</p>
          <p className="text-xs text-gray-500 mt-1">진행 기간</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-gray-800">{data.detailLocation}</p>
          <p className="text-xs text-gray-500 mt-1">유형</p>
        </div>
      </div>

      {/* --- 스터디 소개 섹션 --- */}
      <section className="mb-8">
        <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{data.description}</p>
      </section>

      {/* --- 모집 장소 섹션 --- */}
      <section className="p-4 border border-gray-200 rounded-lg bg-gray-50 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">모집 장소</h2>
        <div className="flex flex-col items-center justify-center bg-white p-6 rounded-lg border">
          <MapPin size={32} className="text-blue-500 mb-3" />
          <p className="font-semibold text-gray-800 mb-1">{data.address}</p>
        </div>
        <p className="text-xs text-gray-500 mt-3 text-center">
          {data.detailAddress ? data.detailAddress : '세부정보가 없습니다.'}
        </p>
      </section>
    </div>
  );
}

export default MainContent;