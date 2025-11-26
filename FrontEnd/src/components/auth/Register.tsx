
function Register() {
  return (
    <form className="space-y-6 border border-gray-200 rounded-xl shadow-lg p-8 bg-white">
      <h3 className="text-center text-gray-600 mb-6">
        스터디 매칭을 위한 새로운 계정을 만드세요.
      </h3>

      {/* 이름/닉네임 입력 */}
      <div>
        <label htmlFor="name" className="sr-only">이름/닉네임</label>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder="이름 또는 닉네임"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 placeholder-gray-500 text-sm"
        />
      </div>

      {/* 이메일 입력 */}
      <div>
        <label htmlFor="email" className="sr-only">이메일</label>
        <input
          id="email"
          name="email"
          type="text"
          required
          placeholder="이메일 주소"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 placeholder-gray-500 text-sm"
        />
      </div>

      {/* 비밀번호 입력 */}
      <div>
        <label htmlFor="password" className="sr-only">비밀번호</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          placeholder="비밀번호 (8자 이상)"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 placeholder-gray-500 text-sm"
        />
      </div>

      {/* 비밀번호 확인 */}
      <div>
        <label htmlFor="confirm-password" className="sr-only">비밀번호 확인</label>
        <input
          id="confirm-password"
          name="confirm-password"
          type="password"
          required
          placeholder="비밀번호 확인"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 placeholder-gray-500 text-sm"
        />
      </div>


      {/* 회원가입 버튼 */}
      <button
        type="submit"
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-400 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 mt-8"
      >
        회원가입
      </button>

      {/* Oauth2 버튼은 회원가입 폼에서는 생략하거나, 필요하다면 여기에 추가할 수 있습니다. */}
    </form>
  );
}

export default Register;