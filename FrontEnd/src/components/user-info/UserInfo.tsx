import { ChevronLeft } from "lucide-react";
import UserAddressSection from "./UserAddressSection";
import UserInfoSection from "./UserInfoSection";
import UserPasswordSection from "./UserPasswordSection";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import ProfileImageUploader from "./ProfileImageUploader";

function UserInfo() {
  const navigate = useNavigate();
  const { user: leader } = useAuth();
  const [inputNickname, setInputNickname] = useState('');
  const [inputDescription, setInputDescription] = useState('');
  useEffect(() => {
    setInputNickname(leader.nickname);
    setInputDescription(leader.description);
  }, [leader])

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-8">
        <button
          type="button"
          onClick={() => navigate("/find")}
          className="inline-flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100 text-gray-700 border border-gray-200"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">내 정보 관리</h1>
          <p className="text-sm text-gray-500 mt-1">
            프로필, 주소, 비밀번호를 한 곳에서 관리할 수 있어요.
          </p>
        </div>
      </div>

      {/* 메인 레이아웃 */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2.2fr)_minmax(260px,1fr)] gap-6 items-start">
        {/* 왼쪽: 설정 섹션들 */}
        <div className="space-y-6">
          <UserInfoSection nick={inputNickname} setNick={setInputNickname} des={inputDescription} setDes={setInputDescription} />
          <UserAddressSection />
          <UserPasswordSection />
        </div>

        {/* 오른쪽: 미리보기 카드 */}
        <aside className="p-6 rounded-2xl shadow-sm border bg-red-50 border-red-300 lg:sticky lg:top-24">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            프로필 미리보기
          </h2>

          <div className="flex items-center gap-2 mb-4">
            <ProfileImageUploader />
            <div>
              <p className="text-sm text-gray-500">닉네임</p>
              <p className="font-semibold text-gray-900">
                {inputNickname}
              </p>
            </div>
          </div>

          <div className="space-y-2 border-t border-gray-300 pt-3 text-sm text-gray-700">
            <div>
              <p className="text-xs text-gray-500 mb-1">이메일</p>
              <p className="font-medium break-all">{leader.email}</p>
            </div>
            <div className="pt-3 border-t border-gray-300">
              <p className="text-xs text-gray-500 mb-1">소개</p>
              <p className="whitespace-pre-wrap">
                {inputDescription && inputDescription.trim().length > 0
                  ? inputDescription
                  : "저장된 소개가 없습니다. 왼쪽에서 프로필 소개를 작성해보세요."}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default UserInfo;
