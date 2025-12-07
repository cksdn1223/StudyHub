import { useState } from "react";
import { useToast } from "../../context/ToastContext";
import axios from "axios";
import { getHeaders } from "../../context/AxiosConfig";
import Card from "../public/Card";
import { useAuth } from "../../context/AuthContext";

const MAX_NICKNAME_LENGTH = 15;
const MAX_DESCRIPTION_LENGTH = 80;

function UserInfoSection(
  { nick, setNick, des, setDes }:
    { nick: string, setNick: React.Dispatch<React.SetStateAction<string>>, des: string, setDes: React.Dispatch<React.SetStateAction<string>> }) {
  const { refreshUser } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleNickChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_NICKNAME_LENGTH) {
      setNick(value);
    } else {
      // 초과 입력은 무시하거나, 필요하면 여기서 토스트 띄워도 됨
      setNick(value.slice(0, MAX_NICKNAME_LENGTH));
    }
  };

  const handleDesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_DESCRIPTION_LENGTH) {
      setDes(value);
    } else {
      setDes(value.slice(0, MAX_DESCRIPTION_LENGTH));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nick.trim()) {
      showToast("닉네임을 입력해주세요.", "error");
      return;
    }

    try {
      setLoading(true);
      await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/user/info`,
        { nickname: nick, description: des },
        getHeaders()
      );
      await refreshUser();
      showToast("프로필 정보가 수정되었습니다.", "success");
    } catch (err) {
      console.error(err);
      showToast("프로필 수정 중 문제가 발생했습니다.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="기본 정보">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            닉네임
            <span className="pl-1 text-xs text-gray-400">
              {nick.length}/{MAX_NICKNAME_LENGTH}
            </span>
          </label>
          <input
            type="text"
            value={nick}
            onChange={handleNickChange}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            소개
            <span className="pl-1 text-xs text-gray-400">
              {des.length}/{MAX_DESCRIPTION_LENGTH}
            </span>
          </label>
          <input
            type="text"
            value={des}
            onChange={handleDesChange}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="간단한 한 줄 소개를 적어보세요."
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium disabled:opacity-60"
          >
            {loading ? "저장 중..." : "변경"}
          </button>
        </div>
      </form>
    </Card>
  );
}


export default UserInfoSection;