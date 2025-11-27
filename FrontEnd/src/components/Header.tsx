import { BookOpenText } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


function Header() {
  const textColor = "text-white";
  const { user, isLoggedIn, logout } = useAuth();

  const handleLogout = () => {
    logout("성공적으로 로그아웃 하였습니다.", "success");
  };

  return (
    <header className="flex justify-between items-center h-16 px-4 sm:px-6 md:px-8 bg-transparent backdrop-blur-sm shadow-none">
      <Link to="/" className="text-xl sm:text-3xl font-bold text-red-400 flex items-center">
        <BookOpenText className="w-7 h-7 mr-2" />
        StudyHub
      </Link>
      {/* 네비게이션 영역 */}
      <nav>
        {/* 네비게이션 아이템들을 가로로 배치 */}
        <ul className="flex items-center space-x-4 sm:space-x-6">

          {/* 💡 로그인 상태에 따른 조건부 렌더링 */}
          {isLoggedIn ? (
            // ==========================================================
            // A. 로그인 상태일 때: 채팅, 알림, 프로필 표시
            // ==========================================================
            <>
              {/* 로그아웃 아이콘 */}
              <li className={`cursor-pointer hover:text-red-400 transition duration-150 ${textColor}`}
                onClick={handleLogout}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
              </li>
              {/* 채팅 아이콘 */}
              <li className={`hover:text-red-400 transition duration-150 cursor-pointer text-sm sm:text-base hidden sm:block ${textColor}`}>
                <Link to="/chat">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                  </svg>
                </Link>
              </li>

              {/* 알림 아이콘 */}
              <li className={`cursor-pointer hover:text-red-400 transition duration-150 ${textColor}`}>
                <Link to="/notifications">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                  </svg>
                </Link>
              </li>

              {/* 내이름 (프로필) 영역 */}
              <li className="flex items-center ml-2 cursor-pointer group">
                {/* 💡 프로필 클릭 시 이동 */}
                <Link to="/profile" className="flex items-center">
                  <img
                    className="w-8 h-8 rounded-full object-cover border-2 border-red-400"
                    src="https://via.placeholder.com/150/FF4B4B/FFFFFF?text=P"
                    alt="프로필 이미지"
                  />
                  <span className={`ml-2 ${textColor} group-hover:text-red-400 font-medium text-sm sm:text-base hidden md:inline`}>
                    {user?.nickname}
                  </span>
                </Link>
              </li>
            </>
          ) : (
            // ==========================================================
            // B. 로그아웃 상태일 때: 로그인 및 회원가입 버튼 표시
            // ==========================================================
            <>
              <li className="hidden sm:block">
                <Link
                  to="/login"
                  className={`px-4 py-2 font-medium transition duration-150 ${textColor} hover:text-red-400`}
                >
                  로그인
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-red-400 text-white font-medium rounded-lg hover:bg-red-500 transition duration-150"
                >
                  회원가입
                </Link>
              </li>
            </>
          )}

        </ul>
      </nav>
    </header>
  );
}

export default Header;