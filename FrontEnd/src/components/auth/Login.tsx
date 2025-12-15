import { useEffect, useState } from "react";
import { EMAIL_REGEX, PASSWORD_REGEX, UserLogin } from "../../type";
import { useAuthApi } from "../../hooks/useAuthApi";
import { useToast } from "../../context/ToastContext";



function Login() {
  const { handleLogin } = useAuthApi();
  const { showToast } = useToast();
  const [user, setUser] = useState<UserLogin>({
    email: '',
    password: ''
  })
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isEmailInvalid, setIsEmailInvalid] = useState(false);
  const [isPasswordInvalid, setIsPasswordInvalid] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isLoginLoading) return;

    const isEmailValidOnSubmit = EMAIL_REGEX.test(user.email.trim());
    const isPasswordValidOnSubmit = PASSWORD_REGEX.test(user.password.trim());

    if (!isEmailValidOnSubmit) {
      showToast("이메일 형식이 올바르지 않습니다.", "error");
      setIsEmailInvalid(true);
      return;
    }
    if (!isPasswordValidOnSubmit) {
      showToast("비밀번호는 최소 8자, 영문, 숫자, 특수문자를 포함해야 합니다.", "error");
      setIsPasswordInvalid(true);
      return;
    }
    setIsLoginLoading(true);
    try {
      await handleLogin(user);
    } finally {
      setIsLoginLoading(false);
    }

  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setUser(prev => ({
      ...prev,
      [id]: value,
    }));
  };
  const handleSocialLogin = (provider: "google" | "github") => {
    window.location.href = `${import.meta.env.VITE_BASE_URL}/oauth2/authorization/${provider}`;
  };
  useEffect(() => {
    // ID 검증 로직
    const currentEmail = user.email.trim();
    if (currentEmail === '') {
      setIsEmailInvalid(false);
      return;
    }
    const isValid = EMAIL_REGEX.test(currentEmail);
    setIsEmailInvalid(!isValid);
  }, [user.email])
  useEffect(() => {
    // PW 검증 로직
    const currentPassword = user.password.trim();
    if (currentPassword === '') {
      setIsPasswordInvalid(false);
      return;
    }
    const isValid = PASSWORD_REGEX.test(currentPassword);
    setIsPasswordInvalid(!isValid);
  }, [user.password])
  const emailInputClasses = `
    w-full px-4 py-3 rounded-lg focus:outline-none placeholder-gray-500 text-sm 
    transition duration-150 ease-in-out
    ${user.email.trim() !== '' && !isEmailInvalid // 유효성 통과 상태
      ? 'border border-green-500 focus:ring-1 focus:ring-green-500'
      : isEmailInvalid // 유효성 오류 상태
        ? 'border border-red-700 ring-1 ring-red-700 focus:ring-red-700 focus:border-red-700'
        : 'border border-gray-400 focus:border-red-300 focus:ring-1 focus:ring-red-300' // 기본 상태
    }
  `;
  const passwordInputClasses = `
    w-full px-4 py-3 rounded-lg focus:outline-none placeholder-gray-500 text-sm 
    transition duration-150 ease-in-out
    ${user.password.trim() !== '' && !isPasswordInvalid // 유효성 통과 상태
      ? 'border border-green-500 focus:ring-1 focus:ring-green-500'
      : isPasswordInvalid // 유효성 오류 상태
        ? 'border border-red-700 ring-1 ring-red-600 focus:ring-red-600 focus:border-red-600'
        : 'border border-gray-400 focus:border-red-300 focus:ring-1 focus:ring-red-300' // 기본상태
    }
  `;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 border border-gray-200 rounded-xl shadow-lg p-8 bg-white">
      <h3 className="text-center text-gray-600 mb-5 h-3">
        스터디 메이트를 찾기 위해 로그인하세요.
      </h3>

      {/* 이메일 입력 */}
      <div className="h-12">
        <label htmlFor="email" className="sr-only">이메일</label>
        <p
          className={`text-red-500 text-xs mb-1 ml-1 transition-opacity duration-300
              ${isEmailInvalid && user.email.trim() !== ''
              ? 'opacity-100'
              : 'opacity-0'
            }`
          }
        >
          올바른 이메일 형식이 아닙니다.
        </p>
        <input
          id="email"
          type="text"
          value={user.email}
          onChange={handleChange}
          placeholder="이메일을 입력하세요"
          className={emailInputClasses}
        />
      </div>

      {/* 비밀번호 입력 */}
      <div>
        <p
          className={`text-red-500 text-xs mb-1 ml-1 transition-opacity duration-300
              ${isPasswordInvalid && user.password.trim() !== ''
              ? 'opacity-100'
              : 'opacity-0'
            }`
          }
        >
          최소 8자, 영문, 숫자, 특수문자를 포함해야 합니다.
        </p>
        <label htmlFor="password" className="sr-only">비밀번호</label>
        <input
          id="password"
          type="password"
          value={user.password}
          onChange={handleChange}
          placeholder="비밀번호를 입력하세요"
          className={passwordInputClasses}
        />
      </div>


      {/* 로그인 버튼 */}
      <button
        type="submit"
        disabled={isLoginLoading}
        className={`
                    w-full flex items-center justify-center gap-2
                    py-3 px-4 border border-transparent rounded-lg shadow-sm
                    text-sm font-medium text-white bg-red-400 hover:bg-red-500
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500
                    transition duration-150
                    ${isLoginLoading ? "opacity-60 cursor-not-allowed hover:bg-red-400" : ""}
                  `}
      >
        {isLoginLoading && (
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-100 border-t-transparent" />
        )}
        {isLoginLoading ? "로그인 중..." : "로그인"}
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
      <div className="space-y-3">
        {/* Google 로그인 */}
        <button
          type="button"
          onClick={() => handleSocialLogin("google")}
          className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition duration-150"
        >
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            className="block w-5 h-5 mr-3"
          >
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
            <path fill="none" d="M0 0h48v48H0z"></path>
          </svg>

          {/* 버튼 텍스트 */}
          <div>Google 로그인</div>
        </button>

        {/* Github 로그인 */}
        <button
          type="button"
          onClick={() => handleSocialLogin("github")}
          className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition duration-150"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg"
            alt="GitHub 로고"
            className="w-5 h-5 mr-3"
          />
          <div>GitHub 로그인</div>
        </button>
      </div>
    </form>
  );
}

export default Login;