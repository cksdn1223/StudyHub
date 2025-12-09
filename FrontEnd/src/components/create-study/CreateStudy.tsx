import { useCallback, useMemo, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import Card from '../public/Card';
import InputField from '../public/InputField';
import SelectField from '../public/SelectField';
import StudyPreview from './StudyPreview';
import { useDaumPostcodePopup } from 'react-daum-postcode';
import { StudyData } from '../../type';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getHeaders } from '../../context/AxiosConfig';
const tagList = [
  // 프론트엔드 (Frontend)
  'React', 'Vue.js', 'Angular', 'Next.js', 'Nuxt.js', 'Svelte',
  'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS',
  'Styled Components', 'Recoil', 'Redux', 'Zustand', 'Webpack',
  'Babel',

  // 백엔드 (Backend)
  'Spring Boot', 'Node.js', 'Express.js', 'NestJS', 'Django',
  'Flask', 'Go', 'Ktor', 'Kotlin', 'Java', 'Python', 'C#',
  'PHP', 'Ruby on Rails',

  // 데이터베이스 & 캐시 (DB & Cache)
  'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Oracle',
  'MariaDB', 'SQLAlchemy', 'Prisma', 'TypeORM',

  // 클라우드 & 인프라 (Cloud & Infra)
  'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP',
  'Terraform', 'Jenkins', 'CI/CD', 'Nginx', 'Apache',

  // 모바일 & 기타
  'Flutter', 'React Native', 'Swift', 'Kotlin (Android)',
  'Git', 'GitHub Actions', 'Jira', 'Figma'
];

function CreateStudy() {
  const [isAddressLoading, setIsAddressLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [studyData, setStudyData] = useState<StudyData>({
    title: '',
    description: '',
    memberCount: 1,
    maxMembers: 6,
    frequency: '',
    duration: '',
    tags: [],
    address: '',
    detailAddress: '',
    longitude: 0.0,
    latitude: 0.0,
    detailLocation: '',
  });
  const [isFocused, setIsFocused] = useState(false);
  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);
  const handleBlur = useCallback(() => {
    // 딜레이를 주어 사용자가 목록을 클릭할 시간을 확보합니다. (약 150ms)
    setTimeout(() => {
      setIsFocused(false);
    }, 150);
  }, []);


  const [tag, setTag] = useState('');
  const addTags = useCallback((inputTag: string) => {
    // studyData.tags 랑 중복 안되고 공백 안되게
    if (inputTag.trim() === '') {
      showToast('빈 태그는 입력하실 수 없습니다.', 'error')
      return;
    }
    if (studyData.tags.includes(inputTag)) {
      showToast('중복된 태그는 입력하실 수 없습니다.', 'info')
      return;
    }
    setStudyData({ ...studyData, tags: [...studyData.tags, inputTag] });
    setTag('');
  }, [studyData, setStudyData, setTag, showToast]);
  const filteredTags = useMemo(() => {
    if (tag.length < 1) return [];
    return tagList
      .filter(item =>
        item.toLowerCase().includes(tag.toLowerCase()) &&
        !studyData.tags.includes(item)
      )
      .slice(0, 5); // 최대 5개까지만 보여주기
  }, [tag, studyData.tags]);

  const selectTagFromList = useCallback((selectedTag: string) => {
    addTags(selectedTag);
  }, [addTags]);
  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTags(tag);
    }
  }, [tag, addTags]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setStudyData({ ...studyData, [e.target.id]: e.target.value });
  };

  const open = useDaumPostcodePopup('https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js');
  const handleComplete = async (data: { address: string }) => {
    try {
      setIsAddressLoading(true);

      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/vworld`,
        {
          params: {
            address: data.address,
          },
        }
      );

      const result = response.data.results[0];
      const location = result.geometry.location;

      setStudyData((prev) => ({
        ...prev,
        address: data.address,
        latitude: location.lat, // 위도
        longitude: location.lng, // 경도
      }));
    } catch (error) {
      console.error(error);
    } finally {
      setIsAddressLoading(false);
    }
  };

  const handleAddress = () => {
    open({ onComplete: handleComplete });
  };

  const handleCreate = async () => {
    if (!studyData.title) {
      showToast('스터디 제목을 입력해주세요.', 'error');
      return;
    }
    if (!studyData.description) {
      showToast('스터디 설명을 입력해주세요.', 'error');
      return;
    }
    if (!studyData.frequency) {
      showToast('진행 빈도를 선택해주세요.', 'error');
      return;
    }
    if (!studyData.duration) {
      showToast('예상 기간을 선택해주세요.', 'error');
      return;
    }
    if (!studyData.detailLocation) {
      showToast('진행 방식을 선택해주세요.', 'error');
      return;
    }
    if (studyData.tags.length === 0) {
      showToast('기술 스택 태그를 1개 이상 입력해주세요.', 'error');
      return;
    }
    if (!studyData.address) {
      showToast('주소를 입력해주세요.', 'error');
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/study`, studyData, getHeaders());
      showToast('스터디가 성공적으로 생성되었습니다.', 'success');
      navigate('/find');
    } catch (error) {
      showToast('스터디 생성에 실패했습니다.', 'error');
    }

  }
  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center pb-6 border-b border-gray-200">
          <ChevronLeft className="w-6 h-6 text-gray-700 cursor-pointer mr-3" onClick={() => navigate("/find")} />
          <h1 className="text-xl font-bold text-gray-800">스터디 만들기</h1>
        </div>

        <p className="text-gray-500 mt-2">새로운 스터디를 만들고 함께할 팀원들을 모집해보세요</p>

        {/* 메인 콘텐츠 영역 */}
        <div className="mt-8 flex flex-col lg:flex-row gap-8">
          {/* 왼쪽 입력 폼 (Main Content) */}
          <div className="lg:w-2/3 space-y-8">

            {/* 기본 정보 */}
            <Card
              title="기본 정보"
              actionButton={
                <button className="flex items-center text-sm text-red-500 font-medium hover:text-red-600 transition">
                  <span className="text-xs mr-1">✏️</span>
                  <span>AI 추천</span>
                </button>
              }
            >
              <InputField
                label="스터디 제목"
                placeholder="예: React 심화 스터디 모집합니다"
                required
                onChange={handleChange}
                id="title"
                value={studyData.title}
              />

              <InputField
                label="스터디 설명"
                placeholder="스터디의 목표, 진행 방식, 예상 커리큘럼 등을 자세히 작성해주세요."
                rows={5}
                required
                onChange={handleChange}
                id="description"
                value={studyData.description}
              />
            </Card>

            {/* 스터디 설정 */}
            <Card title="스터디 설정">
              <div className="flex gap-4 items-end">
                <div className="w-1/2">
                  <div className="w-1/2">
                    <label className="text-sm font-semibold text-gray-800">모집 인원</label>
                    <div className="flex items-center mt-1">
                      {/* 모집 인원 필드는 커스텀된 입력 방식이므로 별도로 유지 */}
                      <input
                        type="number"
                        min="1"
                        disabled
                        id='memberCount'
                        onChange={handleChange}
                        value={studyData.memberCount}
                        className="w-1/2 px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-red-300 focus:border-red-300 text-sm text-center"
                      />
                      <span className="px-2 py-3 text-gray-500">/</span>
                      <input
                        type="number"
                        value={studyData.maxMembers}
                        id='maxMembers'
                        onChange={handleChange}
                        min="1"
                        className="w-1/2 px-4 py-3 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-red-300 focus:border-red-300 text-sm text-center"
                      />
                      <span className="ml-1 text-sm text-gray-600">명</span>
                    </div>
                  </div>
                </div>
                <div className="w-1/2">
                  <SelectField
                    label="진행 빈도"
                    defaultValue="선택해주세요"
                    options={['주 1회', '주 2회', '주 3회', '주 4회', '주 5회', '주 6회', '주 7회', '월 1회', '월 2회', '월 3회']}
                    required
                    onChange={handleChange}
                    id="frequency"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-4">
                <SelectField
                  label="예상 기간"
                  defaultValue="선택해주세요"
                  options={['1개월', '3개월', '6개월 이상']}
                  required
                  onChange={handleChange}
                  id="duration"
                />
                <SelectField
                  label="진행 방식"
                  defaultValue="오프라인"
                  options={['온라인', '오프라인', '온/오프라인 병행']}
                  required
                  onChange={handleChange}
                  id="detailLocation"
                />
              </div>
            </Card>

            {/* 기술 스택 태그 */}
            <Card title="기술 스택 태그">
              <div className="relative">
                <div className="flex items-end gap-2">
                  <InputField
                    placeholder="기술 스택을 입력하고 Enter를 누르세요"
                    fullWidth={true}
                    label=""
                    onChange={(e) => setTag(e.target.value)}
                    value={tag}
                    onKeyPress={handleKeyPress}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                  <button onClick={() => addTags(tag)} className="flex-shrink-0 px-4 py-3 text-sm font-medium bg-red-400 text-white rounded-lg hover:bg-red-500">
                    추가
                  </button>
                </div>
                {(filteredTags.length > 0 && isFocused) && (
                  <div className="absolute z-10 w-[calc(100%-70px)] bg-white border border-gray-300 rounded-lg mt-1 shadow-lg max-h-48 overflow-y-auto">
                    {filteredTags.map((item) => (
                      <div
                        key={item}
                        onClick={() => selectTagFromList(item)}
                        className="px-4 py-2 text-sm text-gray-800 cursor-pointer hover:bg-red-50 hover:text-red-600 transition duration-100"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4">
                <p className="text-sm font-semibold text-gray-800 mb-2">현재 태그:</p>
                <div className="flex flex-wrap">
                  {studyData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex hover:cursor-pointer items-center px-3 py-1 mr-2 mb-2 text-sm font-medium bg-red-100 text-red-700 rounded-full"
                      onClick={() => {
                        setStudyData({ ...studyData, tags: studyData.tags.filter((t) => t !== tag) });
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Card>

            {/* 모집 장소 */}
            <Card title="모집 장소">
              <div className="flex items-end gap-3">
                <InputField
                  label="주소"
                  placeholder="주소 입력"
                  value={studyData.address}
                  disabled
                  required
                />
                <button
                  className={`flex-shrink-0 h-11 rounded-lg px-4 py-3 text-sm font-medium text-white transition
                            ${isAddressLoading ? "bg-gray-300 cursor-wait" : "bg-red-400 hover:bg-red-500"}`}
                  onClick={handleAddress}
                  disabled={isAddressLoading}
                >
                  {isAddressLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-t-transparent" />
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <span>📍</span>
                      <span>주소 찾기</span>
                    </span>
                  )}
                </button>
              </div>

              <InputField
                label="상세 장소"
                placeholder="예: 스터디룸, 강남역점, 토즈 스터디센터 등"
                value={studyData.detailAddress}
                onChange={handleChange}
                id="detailAddress"
              />
            </Card>
          </div>

          {/* 오른쪽 미리보기 (Preview Sidebar) */}
          <div className="lg:w-1/3 space-y-6">
            <StudyPreview
              title={studyData.title || '스터디 제목을 입력해주세요'}
              description={studyData.description || '스터디 설명을 입력해주세요'}
              memberCount={studyData.memberCount}
              maxMembers={studyData.maxMembers}
              frequency={studyData.frequency || '선택해주세요'}
              duration={studyData.duration || '선택해주세요'}
              detailLocation={studyData.detailLocation || '오프라인'}
            />
          </div>
        </div>

        {/* 하단 버튼 영역 */}
        <div className="flex justify-end pt-8 mt-10 border-t border-gray-200">
          <div className="space-x-4 flex">
            <button className="px-6 py-3 text-sm font-semibold text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition" onClick={() => navigate("/find")}>
              취소
            </button>
            <button className="flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition" onClick={handleCreate}>
              <span className="mr-1">+</span>
              <span>스터디 만들기</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateStudy;