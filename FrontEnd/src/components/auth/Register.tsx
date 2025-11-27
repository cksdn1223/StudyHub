import { useState } from "react";
import { UserRegister } from "../../type";
import { useAuthApi } from "../../hooks/useAuthApi";
import { useNavigate } from "react-router-dom";

function Register({ setAuthMode }: { setAuthMode: (mode: 'login' | 'register') => void }) {
  const { handleRegister } = useAuthApi();
  const [user, setUser] = useState<UserRegister>({
    nickname: '',
    email: '',
    password: '',
  })
  const [ confirmPassword, setConfirmPassword ] = useState('');
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (await handleRegister(user)) setAuthMode("login");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setUser(prev => ({
      ...prev,
      [id]: value,
    }));
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6 border border-gray-200 rounded-xl shadow-lg p-8 bg-white">
        <h3 className="text-center text-gray-600 mb-6">
          스터디 매칭을 위한 새로운 계정을 만드세요.
        </h3>

        {/* 이름/닉네임 입력 */}
        <div>
          <label htmlFor="nickname" className="sr-only">이름/닉네임</label>
          <input
            id="nickname"
            value={user.nickname}
            onChange={handleChange}
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
            value={user.email}
            onChange={handleChange}
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
            value={user.password}
            onChange={handleChange}
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
            value={confirmPassword}
            onChange={(e)=>setConfirmPassword(e.target.value)}
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
      </form>
    </>

  );
}

export default Register;