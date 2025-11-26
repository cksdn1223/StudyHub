

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* 로고 및 서비스 이름 */}
        <div className="flex flex-col items-center justify-center mb-4">
          <h3 className="text-2xl font-bold text-red-400">
            📖 StudyHub
          </h3>
          <p className="text-sm text-gray-400 mt-1">개발자와 학생들을 위한 최고의 스터디 매칭 서비스</p>
        </div>
        
        {/* 링크 및 정보 */}
        <div className="flex flex-wrap justify-center space-x-4 sm:space-x-8 text-sm mb-4">
          <a href="#" className="text-gray-300 hover:text-red-400 transition duration-150">이용약관</a>
          <a href="#" className="text-gray-300 hover:text-red-400 transition duration-150">개인정보처리방침</a>
          <a href="#" className="text-gray-300 hover:text-red-400 transition duration-150">고객센터</a>
        </div>
        
        {/* 저작권 정보 */}
        <p className="text-xs text-gray-500 mt-4">
          &copy; {new Date().getFullYear()} StudyHub. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;