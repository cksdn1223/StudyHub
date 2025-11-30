import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StudyCard from './StudyCard';
import { getHeaders } from '../../context/AxiosConfig';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { StudyList } from '../../type';

const fetchStudyList = async () => {
  const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/study`, getHeaders());
  return response.data;
};

function FindStudy() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [distanceFilter, setDistanceFilter] = useState<number | 'ALL'>(5);
  const [sortOption, setSortOption] = useState<'latest' | 'distance' | 'popular'>('latest');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'RECRUITING' | 'FULL' | 'FINISHED'>('ALL');

  const { data, isLoading, error } = useQuery<StudyList[]>({
    queryKey: ['studyList'],
    queryFn: fetchStudyList,
  });


  const filteredStudies = useMemo(() => {
    if (!data) return [];

    const normalizedTerm = searchTerm.trim().toLowerCase();
    const filtered = data.filter((study) => {
      const matchesDistance =
        distanceFilter === 'ALL' || study.distanceKm <= distanceFilter;
      const matchesStatus = statusFilter === 'ALL' || study.status === statusFilter;
      const matchesSearch =
        normalizedTerm === '' ||
        study.title.toLowerCase().includes(normalizedTerm) ||
        study.description.toLowerCase().includes(normalizedTerm) ||
        study.tags.some((tag) => tag.toLowerCase().includes(normalizedTerm));

      return matchesDistance && matchesStatus && matchesSearch;
    });

    return filtered.sort((a, b) => {
      switch (sortOption) {
        case 'distance':
          return a.distanceKm - b.distanceKm;
        case 'popular':
          return b.memberCount - a.memberCount;
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }, [data, distanceFilter, searchTerm, sortOption, statusFilter]);

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        <section className="bg-red-50 rounded-xl p-8 mb-10">
          <h1 className="text-2xl font-bold text-gray-800 mb-3">
            가까운 곳에서 함께 성장할 <br />
            스터디 메이트를 찾아보세요
          </h1>
          <p className="text-gray-600 mb-6">
            위치 기반으로 내 주변의 스터디를 찾고, 관심 기술로 필터링하여 최적의 만남을 안내하세요
          </p>
          <button
            className="px-6 py-3 bg-red-400 text-white font-medium rounded-lg shadow-md hover:bg-red-500 transition duration-150"
            onClick={() => navigate("/create")}
          >
            + 스터디 만들기
          </button>
        </section>


        {/* --- 검색 및 필터 섹션 --- */}
        <section className="mb-10">
          {/* 검색 입력창 */}
          <div className="flex border border-gray-300 rounded-lg shadow-sm p-3 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500 mr-3 self-center">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              type="text"
              placeholder="스터디 검색 (제목, 내용, 기술 스택)"
              className="flex-grow outline-none text-gray-700 placeholder-gray-400"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          {/* 필터 및 정렬 */}
          <div className="flex justify-between items-center text-sm text-gray-600">
            <div className="flex space-x-4">
              {/* 거리 필터 */}
              <label className="flex items-center space-x-2 cursor-pointer hover:text-red-500 transition duration-150">
                <span className="font-semibold text-red-500">거리</span>
                <select
                  className="border border-gray-300 rounded-md px-2 py-1 text-gray-700 focus:outline-none focus:ring-1 focus:ring-red-400"
                  value={distanceFilter}
                  onChange={(event) =>
                    setDistanceFilter(event.target.value === 'ALL' ? 'ALL' : Number(event.target.value))
                  }
                >
                  <option value="5">5km 이내</option>
                  <option value="10">10km 이내</option>
                  <option value="20">20km 이내</option>
                  <option value="50">50km 이내</option>
                </select>
              </label>

              <div className="text-gray-300">|</div>

              {/* 기준 필터 */}
              <label className="flex items-center space-x-2 cursor-pointer hover:text-red-500 transition duration-150">
                <span>정렬</span>
                <select
                  className="border border-gray-300 rounded-md px-2 py-1 text-gray-700 focus:outline-none focus:ring-1 focus:ring-red-400"
                  value={sortOption}
                  onChange={(event) => setSortOption(event.target.value as 'latest' | 'distance' | 'popular')}
                >
                  <option value="latest">최신순</option>
                  <option value="distance">가까운순</option>
                  <option value="popular">인원 많은순</option>
                </select>
              </label>

              <div className="text-gray-300">|</div>

              {/* 모집 상태 필터 */}
              <label className="flex items-center space-x-2 cursor-pointer hover:text-red-500 transition duration-150">
                <span>모집상태</span>
                <select
                  className="border border-gray-300 rounded-md px-2 py-1 text-gray-700 focus:outline-none focus:ring-1 focus:ring-red-400"
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}
                >
                  <option value="ALL">전체</option>
                  <option value="RECRUITING">모집중</option>
                  <option value="FULL">모집완료</option>
                  <option value="FINISHED">활동종료</option>
                </select>
              </label>
            </div>

            {/* 총 개수 */}
            <div className="text-gray-500">
              총 <span className="text-red-500 font-semibold">{filteredStudies.length}</span>개의 스터디
            </div>
          </div>

          {/* 선택된 태그 목록 (이미지 기반) */}
          <div className="flex space-x-2 mt-4 text-xs">
            <span className="text-gray-500 font-medium">인기 태그:</span>
            {['React', 'Spring', 'Node.js', 'Python', 'Java', 'TypeScript', 'Vue.js'].map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => setSearchTerm(tag)}
                className="border border-gray-300 text-gray-700 px-3 py-1 rounded-full cursor-pointer hover:bg-gray-100 transition duration-150"
              >
                {tag}
              </button>
            ))}
          </div>
        </section>

        {/* --- 3. 스터디 목록 섹션 --- */}
        <section>
          {isLoading ? '로딩중...' : error ? '문제가 발생했습니다..! 다시 로그인하시거나 관리자에게 문의해주세요.' :
            <div className="border-t border-gray-200">
              {filteredStudies.length > 0 ? (
                filteredStudies.map(study => (
                  <StudyCard key={study.id} {...study} />
                ))
              ) : (
                <p className="py-6 text-center text-gray-500">조건에 맞는 스터디가 없습니다.</p>
              )}
            </div>
          }
        </section>

      </main>
    </div >
  );
}

export default FindStudy;