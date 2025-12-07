import { BookOpenText, LogOut, MessageCircleCode, Search } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import NotificationBell from "./NotificationBell";


function Header() {
  const { user, isLoggedIn, logout } = useAuth();
  const location = useLocation();
  const isMainPage = location.pathname === '/';
  const handleLogout = () => {
    logout("성공적으로 로그아웃 하였습니다.", "success");
  };


  return (
    <header className="flex justify-between items-center h-16 px-4 sm:px-6 md:px-8">
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
            <>
              {/* 로그아웃 아이콘 */}
              <li className={`cursor-pointer ${isMainPage ? "text-white" : 'text-neutral-500'} hover:text-red-400 transition duration-150 relative p-2 rounded-full hover:bg-gray-100`}
                onClick={handleLogout}>
                <LogOut />
              </li>
              {/* 찾기 아이콘 */}
              <li className={`cursor-pointer ${isMainPage ? "text-white" : 'text-neutral-500'} hover:text-red-400 transition duration-150 relative p-2 rounded-full hover:bg-gray-100`}>
                <Link to={"/find"}>
                  <Search />
                </Link>
              </li>
              {/* 채팅 아이콘 */}
              <li className={`cursor-pointer ${isMainPage ? "text-white" : 'text-neutral-500'} hover:text-red-400 transition duration-150 relative p-2 rounded-full hover:bg-gray-100`}>
                <Link to="/chat">
                  <MessageCircleCode />
                </Link>
              </li>

              {/* 알림 아이콘 */}
              <li className={`${isMainPage ? "text-white" : 'text-neutral-500'} transition duration-150`}>
                <NotificationBell />
              </li>

              {/* 내이름 (프로필) 영역 */}
              <li className="flex items-center ml-2 cursor-pointer group">
                {/* 💡 프로필 클릭 시 이동 */}
                <Link to="/profile" className="flex items-center">
                  <img
                    className="w-8 h-8 rounded-full object-cover border-2 border-red-400"
                    alt="프로필 이미지"
                  />
                  <span className={`ml-2 ${isMainPage ? 'text-white' : 'text-neutral-500'} group-hover:text-red-400 font-medium text-sm sm:text-base hidden md:inline`}>
                    {user?.nickname || "사용자"}
                  </span>
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className="hidden sm:block">
                <Link
                  to="/auth/login"
                  className={`px-4 py-2 font-medium transition duration-150 ${isMainPage ? 'text-white' : 'text-neutral-500'} hover:text-red-400`}
                >
                  로그인
                </Link>
              </li>
              <li>
                <Link
                  to="/auth/register"
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