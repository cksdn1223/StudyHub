import { useState } from "react";
import { UserLogin } from "../../type";
import axios from "axios";

function Login() {
  const [user, setUser] = useState<UserLogin>({
    email: '',
    password: ''
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/login`, user);
    console.log(response.data);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setUser(prev => ({
      ...prev,
      [id]: value,
    }));
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-6 border border-gray-200 rounded-xl shadow-lg p-8 bg-white">
      <h3 className="text-center text-gray-600 mb-6">
        스터디 메이트를 찾기 위해 로그인하세요.
      </h3>

      {/* 이메일 입력 */}
      <div>
        <label htmlFor="email" className="sr-only">이메일</label>
        <input
          id="email"
          type="text"
          value={user.email}
          onChange={handleChange}
          required
          placeholder="이메일을 입력하세요"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 placeholder-gray-500 text-sm"
        />
      </div>

      {/* 비밀번호 입력 */}
      <div>
        <label htmlFor="password" className="sr-only">비밀번호</label>
        <input
          id="password"
          type="password"
          value={user.password}
          onChange={handleChange}
          required
          placeholder="비밀번호를 입력하세요"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 placeholder-gray-500 text-sm"
        />
      </div>


      {/* 로그인 버튼 */}
      <button
        type="submit"
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-400 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150"
      >
        로그인
      </button>

      {/* 구분선 */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500">
            또는
          </span>
        </div>
      </div>

      {/* 💡 Oauth2 로그인 버튼 */}
      <div className="space-y-3">
        {/* Google 로그인 */}
        <button
          type="button"
          className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition duration-150"
        >
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google Logo" className="w-5 h-5 mr-3" />
          Google 로그인
        </button>

        {/* Github 로그인 */}
        <button
          type="button"
          className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition duration-150"
        >
          <img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg" alt="Github Logo" className="w-5 h-5 mr-3" />
          Github 로그인
        </button>
      </div>
    </form>
  );
}

export default Login;