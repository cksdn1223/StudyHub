import Header from "../Header";
import mainBg from "../../assets/main-background.jpg"
import { useEffect, useRef, useState } from "react";
import FeatureSection from "./FeatureSection";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";

const HEADER_HEIGHT = 80;

function MainPage() {
  const [isHeaderFixed, setIsHeaderFixed] = useState(true);
  const featureSectionRef = useRef<HTMLDivElement>(null);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const scrollToFeatures = () => {
    if (featureSectionRef.current === null) return;
    featureSectionRef.current.scrollIntoView({
      behavior: 'smooth', // 부드러운 스크롤 효과
      block: 'start',      // 섹션의 시작점을 뷰포트 상단에 맞춤
    });
  };
  useEffect(() => {
    const handleScroll = () => {
      if (!featureSectionRef.current) return;
      const featureTop = featureSectionRef.current.offsetTop;
      const scrollPosition = window.scrollY;
      if (scrollPosition >= featureTop - HEADER_HEIGHT) {
        setIsHeaderFixed(false);
      } else {
        setIsHeaderFixed(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleProtectedAction = (path: string) => {
    if (isLoggedIn) {
      navigate(path);
    } else {
      showToast('로그인이 필요한 서비스입니다.', 'info');
      setTimeout(() => {
        navigate('/auth/login');
      }, 500);
    }
  };
  return (
    <div>
      <div
        className={`
          fixed top-0 left-0 w-full z-50 
          transition-transform duration-300
          ${isHeaderFixed ? 'translate-y-0' : '-translate-y-full'} 
        `}
      >
        <Header/>
      </div>
      <div className="relative w-full min-h-screen bg-cover bg-left bg-no-repeat flex flex-col items-center justify-center p-4 pt-20"
        style={{ backgroundImage: `url(${mainBg})` }}>

        {/* 💡 광원 오버레이 */}
        <div
          className="absolute inset-0 z-10"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backgroundImage: 'radial-gradient(circle at 16% 30%, transparent 10%, rgba(0, 0, 0, 0.6) 30%)'
          }}
        ></div>




        <div className="relative z-20 text-center text-white sm:mt-0">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 animate-fade-in-up">
            가까운 곳에서
          </h1>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-red-400 animate-fade-in-up delay-150">
            함께 성장하세요
          </h1>
          <p className="text-base sm:text-lg md:text-xl mb-8 animate-fade-in delay-300">
            지리적 위치와 관심 기술을 기반으로 최적의 스터디 그룹을 매칭하는 플랫폼
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center animate-fade-in delay-500">
            <button
              onClick={() => handleProtectedAction('/find')}
              className="flex items-center justify-center px-6 py-3 bg-red-400 hover:bg-red-500 text-white font-semibold rounded-lg shadow-md transition duration-300 transform hover:scale-105"
            >
              <span className="mr-2">🔍</span> 스터디 찾기
            </button>
            <button
              onClick={() => handleProtectedAction('/create')}
              className="flex items-center justify-center px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg shadow-md transition duration-300 transform hover:scale-105"
            >
              <span className="mr-2">✨</span> 스터디 만들기
            </button>
          </div>
        </div>

        <div className="absolute bottom-8 z-20 cursor-pointer animate-fade-in delay-700" onClick={scrollToFeatures}>
          <svg className="w-8 h-8 text-white animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </div>
      <div ref={featureSectionRef} style={{backgroundColor:"#FAFAFA"}}>
        <FeatureSection />
      </div>
      <Footer />
    </div>
  );
}

export default MainPage;