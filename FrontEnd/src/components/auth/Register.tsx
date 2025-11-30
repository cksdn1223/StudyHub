import { useEffect, useState } from "react";
import { UserRegister, EMAIL_REGEX, PASSWORD_REGEX } from "../../type";
import { useAuthApi } from "../../hooks/useAuthApi";
import { useToast } from "../../context/ToastContext";
import { useNavigate } from "react-router-dom";
import { useDaumPostcodePopup } from 'react-daum-postcode';
import axios from "axios";

const NICKNAME_MIN_LENGTH = 2;

function Register() {
  const { handleRegister } = useAuthApi();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [user, setUser] = useState<UserRegister>({
    nickname: '',
    email: '',
    password: '',
    address: '',
    longitude: 0,
    latitude: 0,
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isNicknameInvalid, setIsNicknameInvalid] = useState(false);
  const [isEmailInvalid, setIsEmailInvalid] = useState(false);
  const [isPasswordInvalid, setIsPasswordInvalid] = useState(false);
  const [isConfirmPasswordInvalid, setIsConfirmPasswordInvalid] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const originalNickname = user.nickname;
    const trimmedNickname = originalNickname.trim();
    const isNicknameLengthValid = trimmedNickname.length >= NICKNAME_MIN_LENGTH;
    const isNicknameSpacesValid = originalNickname === trimmedNickname;

    const isEmailValidOnSubmit = EMAIL_REGEX.test(user.email.trim());
    const isPasswordValidOnSubmit = PASSWORD_REGEX.test(user.password);
    const isPasswordMatchOnSubmit = user.password === confirmPassword && confirmPassword !== '';


    if (!isNicknameLengthValid || !isNicknameSpacesValid) {
      setIsNicknameInvalid(true);
      showToast("닉네임은 최소 2자 이상이어야 하며, 앞뒤 공백을 포함할 수 없습니다.", "error");
      return;
    }
    if (!isEmailValidOnSubmit) {
      setIsEmailInvalid(true);
      showToast("이메일 형식이 올바르지 않습니다.", "error");
      return;
    }
    if (!isPasswordValidOnSubmit) {
      setIsPasswordInvalid(true);
      showToast("비밀번호는 최소 8자, 영문/숫자/특수문자를 포함해야 하며, 공백을 포함할 수 없습니다.", "error");
      return;
    }
    if (!isPasswordMatchOnSubmit) {
      setIsConfirmPasswordInvalid(true);
      showToast("비밀번호가 일치하지 않습니다.", "error");
      return;
    }
    if (user.address === '') {
      showToast("옳바른 주소가 입력되지 않았습니다.", "error");
      return;
    }

    if (await handleRegister(user)) navigate("/auth/login");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setUser(prev => ({
      ...prev,
      [id]: value,
    }));
  };

  useEffect(() => {
    const originalNickname = user.nickname;
    const trimmedNickname = originalNickname.trim();

    if (originalNickname === '') {
      setIsNicknameInvalid(false);
      return;
    }

    let isInvalid = false;

    if (originalNickname !== trimmedNickname) {
      isInvalid = true;
    }
    else if (trimmedNickname.length < NICKNAME_MIN_LENGTH) {
      isInvalid = true;
    }

    setIsNicknameInvalid(isInvalid);
  }, [user.nickname]);

  useEffect(() => {
    const currentEmail = user.email.trim();
    if (currentEmail === '') {
      setIsEmailInvalid(false);
      return;
    }
    setIsEmailInvalid(!EMAIL_REGEX.test(currentEmail));
  }, [user.email])

  useEffect(() => {
    const currentPassword = user.password;
    if (currentPassword === '') {
      setIsPasswordInvalid(false);
    } else {
      setIsPasswordInvalid(!PASSWORD_REGEX.test(currentPassword));
    }
    // 비밀번호 확인 검증
    if (confirmPassword.trim() !== '') {
      setIsConfirmPasswordInvalid(currentPassword !== confirmPassword);
    }
  }, [user.password, confirmPassword]);

  useEffect(() => {
    const currentConfirmPassword = confirmPassword.trim();
    if (currentConfirmPassword === '') {
      setIsConfirmPasswordInvalid(false);
      return;
    }
    setIsConfirmPasswordInvalid(user.password !== currentConfirmPassword);
  }, [confirmPassword, user.password]);

  const getInputFieldClasses = (isInvalid: boolean, value: string) => {
    const isValid = !isInvalid && value !== '';
    return `
      w-full px-4 py-3 rounded-lg focus:outline-none placeholder-gray-500 text-sm 
      transition duration-150 ease-in-out
      ${isValid
        ? 'border border-green-500 focus:ring-1 focus:ring-green-500' // 통과 상태
        : isInvalid
          ? 'border border-red-700 ring-1 ring-red-700 focus:ring-red-700 focus:border-red-700' // 오류 상태
          : 'border border-gray-400 focus:border-red-300 focus:ring-1 focus:ring-red-300' // 기본 상태
      }
    `;
  };

  const nicknameInputClasses = getInputFieldClasses(isNicknameInvalid, user.nickname);
  const emailInputClasses = getInputFieldClasses(isEmailInvalid, user.email);
  const passwordInputClasses = getInputFieldClasses(isPasswordInvalid, user.password);
  const confirmPasswordInputClasses = getInputFieldClasses(isConfirmPasswordInvalid, confirmPassword);

  // 주소검색관련
  const open = useDaumPostcodePopup('https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js');
  const handleComplete = async (data: { address: string }) => {
    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/vworld`, {
      params: {
        address: data.address,
      }
    })
    setUser(prev => ({
      ...prev,
      address: data.address,
      longitude: response.data.response.result.point.x,
      latitude: response.data.response.result.point.y,
    }));
  };

  const handleAddress = () => {
    open({ onComplete: handleComplete });
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6 border border-gray-200 rounded-xl shadow-lg p-8 bg-white">
        <h3 className="text-center text-gray-600 mb-6">
          스터디 매칭을 위한 새로운 계정을 만드세요.
        </h3>

        {/* 닉네임 입력 */}
        <div>
          <label htmlFor="nickname" className="sr-only">이름/닉네임</label>
          <input
            id="nickname"
            value={user.nickname}
            onChange={handleChange}
            type="text"
            placeholder="이름 또는 닉네임 (2자 이상)"
            className={nicknameInputClasses}
          />
          <p
            className={`text-red-500 text-xs mt-1 ml-1 transition-opacity duration-300
              ${isNicknameInvalid && user.nickname !== ''
                ? 'opacity-100' : 'opacity-0'
              }`
            }
          >
            최소 2자 이상이어야 하며, 앞뒤 공백을 포함할 수 없습니다.
          </p>
        </div>

        {/* 이메일 입력 */}
        <div>
          <label htmlFor="email" className="sr-only">이메일</label>
          <input
            id="email"
            value={user.email}
            onChange={handleChange}
            type="text"
            placeholder="이메일 주소"
            className={emailInputClasses}
          />
          <p
            className={`text-red-500 text-xs mt-1 ml-1 transition-opacity duration-300
              ${isEmailInvalid && user.email.trim() !== ''
                ? 'opacity-100' : 'opacity-0'
              }`
            }
          >
            올바른 이메일 형식이 아닙니다.
          </p>
        </div>

        {/* 비밀번호 입력 */}
        <div>
          <label htmlFor="password" className="sr-only">비밀번호</label>
          <input
            id="password"
            value={user.password}
            onChange={handleChange}
            type="password"
            placeholder="비밀번호 (8자 이상, 영문/숫자/특수문자, 공백 제외)"
            className={passwordInputClasses}
          />
          <p
            className={`text-red-500 text-xs mt-1 ml-1 transition-opacity duration-300
              ${isPasswordInvalid && user.password !== ''
                ? 'opacity-100' : 'opacity-0'
              }`
            }
          >
            최소 8자, 영문, 숫자, 특수문자를 포함해야합니다.(공백X)
          </p>
        </div>

        {/* 비밀번호 확인 */}
        <div>
          <label htmlFor="confirmPassword" className="sr-only">비밀번호 확인</label>
          <input
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type="password"
            placeholder="비밀번호 확인"
            className={confirmPasswordInputClasses}
          />
          <p
            className={`text-red-500 text-xs mt-1 ml-1 transition-opacity duration-300
              ${isConfirmPasswordInvalid && confirmPassword.trim() !== ''
                ? 'opacity-100' : 'opacity-0'
              }`
            }
          >
            비밀번호가 일치하지 않습니다.
          </p>
        </div>

        {/* 도로명주소입력 */}
        <div className="flex gap-2">
          <label htmlFor="address" className="sr-only">주소 입력</label>
          <input
            id="address"
            value={user.address}
            type="text"
            disabled
            placeholder="주소 입력"
            className="w-full px-4 py-3 rounded-lg focus:outline-none placeholder-gray-500 text-sm
            border border-gray-400 focus:border-red-300 focus:ring-1 focus:ring-red-300"
          />
          <button
            type="button"
            onClick={handleAddress}
            className="flex-shrink-0 px-4 py-3 bg-gray-700 text-white text-sm font-medium rounded-lg hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            주소 찾기
          </button>
        </div>

        {/* 회원가입 버튼 */}
        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-400 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 mt-8"
        >
          회원가입
        </button>
      </form>
    </>
  );
}

export default Register;