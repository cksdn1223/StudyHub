import { useState } from 'react';
import { Link } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import { BookOpenText, MapPin, MessageCircle, Shield } from 'lucide-react';

function AuthPage({ authType }: { authType: 'login' | 'register' }) {
  const [authMode, setAuthMode] = useState<'login' | 'register'>(authType);
  const isLoginMode = authMode === 'login';
  const BANNER_BG_COLOR = "bg-red-400"; // 커스텀 살구색 사용

  return (
    <div className="flex w-full min-h-screen">

      {/* -------------------- 1. 왼쪽 고정 배너 영역 (이미지 스타일 적용) -------------------- */}
      <div
        className={`relative hidden lg:flex w-1/2 p-12 flex-col justify-center items-center ${BANNER_BG_COLOR} text-white`}
      >

        <Link to="/" className="text-3xl font-bold absolute top-6 left-12 text-white flex items-center">
          {/* 💡 아이콘 스타일 반영 */}
          <BookOpenText className="w-7 h-7 mr-2" />
          StudyHub
        </Link>

        {/* 메인 중앙 문구 블록 */}
        <div className="text-center px-4">

          {/* 💡 헤드라인 글꼴 및 크기 변경 (이미지와 유사하게 두껍고 크게) */}
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
            가까운 곳에서 <br />
            함께 성장할 <br />
            스터디 메이트를 찾아보세요
          </h1>

          {/* 서브 문구 스타일 변경 */}
          <p className="text-base sm:text-lg mb-10 opacity-90">
            위치 기반 매칭으로 내 주변 스터디를 찾고, <br />
            관심 기술로 필터링하여 최적의 팀을 만나보세요
          </p>

          {/* 핵심 가치 목록 (아이콘 및 스타일 반영) */}
          <ul className="inline-block space-y-6 text-left pt-6">
            {/* 1. 위치 기반 스터디 매칭 */}
            <li className="flex items-center text-lg font-medium">
              <MapPin className="w-6 h-6 mr-3 text-white p-1 border border-white rounded-full" />
              위치 기반 스터디 매칭
            </li>
            {/* 2. 실시간 채팅 & 알림 */}
            <li className="flex items-center text-lg font-medium">
              <MessageCircle className="w-6 h-6 mr-3 text-white p-1 border border-white rounded-full" />
              실시간 채팅 & 알림
            </li>
            {/* 3. 안전한 인증 시스템 */}
            <li className="flex items-center text-lg font-medium">
              <Shield className="w-6 h-6 mr-3 text-white p-1 border border-white rounded-full" />
              안전한 인증 시스템
            </li>
          </ul>
        </div>
      </div>

      {/* -------------------- 2. 오른쪽 동적 폼 영역 (배경: White) -------------------- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">

        {/* 폼 컨테이너 */}
        <div className="w-full max-w-md p-6 sm:p-10">

          {/* 제목 및 전환 버튼 */}

          {/* 💡 폼 컴포넌트 애니메이션 Wrapper 추가 */}
          <div
            key={authMode} // 💡 핵심: key를 authMode로 설정하여 모드가 바뀔 때마다 컴포넌트가 '재생성'되게 합니다.
            className="
            animate-fade-in-slide 
            transition-all 
            duration-500 
            ease-out
            "
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              {isLoginMode ? '로그인' : '회원가입'}
            </h2>
            {isLoginMode ? (
              <Login />
            ) : (
              <Register setAuthMode={setAuthMode}/>
            )}
            {/* 하단 전환 링크 */}
            <div className="mt-8 text-center text-sm text-gray-600">
              {isLoginMode ? (
                <>
                  계정이 없으신가요?
                  <button
                    onClick={() => setAuthMode('register')}
                    className="font-semibold text-red-500 hover:text-red-600 ml-1 transition duration-150"
                  >
                    회원가입
                  </button>
                </>
              ) : (
                <>
                  이미 계정이 있으신가요?
                  <button
                    onClick={() => setAuthMode('login')}
                    className="font-semibold text-red-500 hover:text-red-600 ml-1 transition duration-150"
                  >
                    로그인
                  </button>
                </>
              )}
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}

export default AuthPage;