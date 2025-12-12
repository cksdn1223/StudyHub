import axios from "axios";
import { ChevronRight, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { getHeaders } from "../../context/AxiosConfig";
import { axiosErrorType, StudyList, UserInfo } from "../../type";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import defaultAvatar from "../../assets/image/defaultImage.webp"
import { useStudyList } from "../../hooks/useStudyList";

const tagLink = [
  // 프론트엔드 (Frontend)
  { tag: 'React', link: 'https://react.dev/' },
  { tag: 'Vue.js', link: 'https://vuejs.org/guide/introduction.html' },
  { tag: 'Angular', link: 'https://angular.io/docs' },
  { tag: 'Next.js', link: 'https://nextjs.org/docs' },
  { tag: 'Nuxt.js', link: 'https://nuxt.com/docs/getting-started/introduction' },
  { tag: 'Svelte', link: 'https://svelte.dev/docs' },
  { tag: 'TypeScript', link: 'https://www.typescriptlang.org/docs/' },
  { tag: 'JavaScript', link: 'https://developer.mozilla.org/ko/docs/Web/JavaScript' },
  { tag: 'HTML5', link: 'https://developer.mozilla.org/ko/docs/Web/HTML' },
  { tag: 'CSS3', link: 'https://developer.mozilla.org/ko/docs/Web/CSS' },
  { tag: 'Tailwind CSS', link: 'https://tailwindcss.com/docs' },
  { tag: 'Redux', link: 'https://redux-toolkit.js.org/' },
  { tag: 'Zustand', link: 'https://docs.pmnd.rs/zustand/getting-started/introduction' },

  // 백엔드 (Backend)
  { tag: 'Spring Boot', link: 'https://docs.spring.io/spring-boot/docs/current/reference/html/' },
  { tag: 'Node.js', link: 'https://nodejs.org/en/docs' },
  { tag: 'Express.js', link: 'https://expressjs.com/' },
  { tag: 'NestJS', link: 'https://docs.nestjs.com/' },
  { tag: 'Django', link: 'https://docs.djangoproject.com/en/5.0/' },
  { tag: 'Flask', link: 'https://flask.palletsprojects.com/en/3.0.x/' },
  { tag: 'Go', link: 'https://go.dev/doc/' },
  { tag: 'Kotlin', link: 'https://kotlinlang.org/docs/home.html' },
  { tag: 'Java', link: 'https://docs.oracle.com/en/java/' },
  { tag: 'Python', link: 'https://docs.python.org/3/' },
  { tag: 'C#', link: 'https://learn.microsoft.com/en-us/dotnet/csharp/' },
  { tag: 'PHP', link: 'https://www.php.net/manual/en/' },
  { tag: 'Ruby on Rails', link: 'https://guides.rubyonrails.org/' },

  // 데이터베이스 & 캐시 (DB & Cache)
  { tag: 'MySQL', link: 'https://dev.mysql.com/doc/refman/8.0/en/' },
  { tag: 'PostgreSQL', link: 'https://www.postgresql.org/docs/' },
  { tag: 'MongoDB', link: 'https://www.mongodb.com/docs/' },
  { tag: 'Redis', link: 'https://redis.io/docs/' },
  { tag: 'Oracle', link: 'https://docs.oracle.com/en/database/oracle/oracle-database/index.html' },
  { tag: 'MariaDB', link: 'https://mariadb.com/kb/en/documentation/' },

  // 클라우드 & 인프라 (Cloud & Infra)
  { tag: 'Docker', link: 'https://docs.docker.com/' },
  { tag: 'Kubernetes', link: 'https://kubernetes.io/docs/home/' },
  { tag: 'AWS', link: 'https://docs.aws.amazon.com/' },
  { tag: 'Azure', link: 'https://docs.microsoft.com/en-us/azure/' },
  { tag: 'GCP', link: 'https://cloud.google.com/docs' },

  // 모바일 & 기타
  { tag: 'Flutter', link: 'https://docs.flutter.dev/' },
  { tag: 'React Native', link: 'https://reactnative.dev/docs/getting-started' },
  { tag: 'Swift', link: 'https://www.swift.org/documentation/' },
  { tag: 'Git', link: 'https://git-scm.com/doc' },
];

function Sidebar({ selectedContent }: { selectedContent: StudyList }) {
  const navigate = useNavigate();
  const { data: studyList } = useStudyList();
  const { showToast } = useToast();
  const { user } = useAuth();

  const [leader, setLeader] = useState<UserInfo>();
  useEffect(() => {
    const getLeaderData = async () => {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/${selectedContent.leaderId}`, getHeaders());
      setLeader(response.data);
    }
    getLeaderData();
  }, [selectedContent.leaderId])
  if(studyList===undefined) return;
  const similarStudies = studyList
    .filter((study) => study.id !== selectedContent.id)
    .map((study) => {
      const sameTags = study.tags.filter((tag: string) => selectedContent.tags.includes(tag));
      return {
        study,
        sameTags,
        sameTagCount: sameTags.length,
      };
    })
    .filter(({ sameTagCount }) => sameTagCount > 0)
    .sort((a, b) => b.sameTagCount - a.sameTagCount)
    .slice(0, 5);

  const isLeader = leader?.email === user.email;
  const buttonClasses = isLeader ?
    'w-full bg-gray-500 text-white text-center font-bold py-3 rounded-lg transition duration-150 shadow-md cursor-not-allowed' :
    'w-full bg-red-500 hover:cursor-pointer text-center hover:bg-red-600 text-white font-bold py-3 rounded-lg transition duration-150 shadow-md';
  const buttonText = isLeader
    ? '🔥 본인의 스터디에 참여하실 수 없습니다.'
    : '🔥 스터디 참여 신청하기';
  const handleApply = async () => {
    if (!isLeader) {
      try {
        await axios.post(`${import.meta.env.VITE_BASE_URL}/participant/${selectedContent.id}`, null, getHeaders());
        showToast('스터디 참여 신청이 완료되었습니다.', 'success')
      } catch (error) {
        showToast((error as axiosErrorType).response.data.message, 'error');
      }

    }
  };
  if (!leader) return <div>유저정보를 불러올 수 없습니다.</div>
  return (
    <div className="lg:w-4/12 lg:sticky lg:top-8 mt-8 lg:mt-0">
      {/* --- 신청 버튼 섹션 --- */}
      <div className="mb-6">
        <button
          type="button"
          className={buttonClasses}
          onClick={handleApply}
          disabled={isLeader}
        >
          {buttonText}
        </button>
      </div>

      {/* --- 스터디장 정보 섹션 --- */}
      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100 mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-2">스터디장 정보</h2>
        <div className="flex items-center mb-2">
          <img
            className="w-16 h-16 rounded-full"
            src={selectedContent.profileImageUrl !== "defaultUrl" ? selectedContent.profileImageUrl : defaultAvatar}
            alt="프로필 이미지 "
          />
          <div>
            <p className="ml-4 font-semibold text-gray-800">{leader.nickname}</p>
          </div>
        </div>
        <div className="text-sm text-gray-600">
          <p className="font-semibold text-gray-800">{leader.email}</p>
          {leader.description ? leader.description : "저장한 소개가 없습니다."}
        </div>
      </div>

      {/* --- 추천 학습 자료 섹션 --- */}
      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100 mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">📍 추천 학습 자료</h2>
        <ul className="space-y-3 text-sm">
          {selectedContent.tags.filter(tag => tagLink.find(list => list.tag === tag)?.link !== undefined).map(tag => (
            <li key={tag}>
              <a
                className="text-blue-600 hover:underline cursor-pointer"
                href={(tagLink.find(list => list.tag === tag)?.link)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ChevronRight size={14} className="inline mr-1" /> {tag} 공식 문서
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* --- 비슷한 스터디 섹션 --- */}
      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-4">비슷한 스터디</h2>

        {similarStudies.length === 0 ? (
          <p className="text-sm text-gray-500">비슷한 태그를 가진 다른 스터디가 없습니다.</p>
        ) : (
          similarStudies.map(({ study, sameTags }) => (
            <div
              key={study.id}
              className="mb-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
              onClick={() => navigate(`/study/${study.id}`)}
            >
              <p className="font-semibold text-gray-800">{study.title}</p>

              <div className="flex items-center text-xs text-gray-500 mt-1">
                <MapPin size={12} className="mr-1" />
                <span>{study.detailLocation ?? "온라인 / 오프라인 미정"}</span>

                {/* 공통 태그 뱃지 */}
                <div className="flex flex-wrap ml-2 gap-1">
                  {sameTags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-green-100 text-green-700 rounded-lg"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Sidebar;