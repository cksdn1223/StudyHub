import { useState } from "react";
import axios from "axios";
import { useToast } from "../../context/ToastContext";
import { axiosErrorType, PASSWORD_REGEX } from "../../type";
import { changePassword } from "../../api/api";

type PasswordChangeModalProps = {
  onClose: () => void;
};

const PasswordChangeModal = ({ onClose }: PasswordChangeModalProps) => {
  const { showToast } = useToast();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isNewPasswordValid =
    newPassword.length === 0 ? null : PASSWORD_REGEX.test(newPassword);
  const isConfirmMatched =
    newPasswordConfirm.length === 0
      ? null
      : newPassword === newPasswordConfirm;

  const resetState = () => {
    setCurrentPassword("");
    setNewPassword("");
    setNewPasswordConfirm("");
    setError(null);
  };

  const handleClose = () => {
    if (loading) return;
    resetState();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!currentPassword || !newPassword || !newPasswordConfirm) {
      setError("모든 항목을 입력해주세요.");
      return;
    }

    if (!PASSWORD_REGEX.test(newPassword)) {
      setError(
        "새 비밀번호는 8자 이상, 영문/숫자/특수문자를 모두 포함하고 공백이 없어야 합니다."
      );
      return;
    }

    if (newPassword !== newPasswordConfirm) {
      setError("새 비밀번호와 확인 비밀번호가 일치하지 않습니다.");
      return;
    }

    if (newPassword === currentPassword) {
      setError("현재 비밀번호와 다른 비밀번호를 사용해주세요.");
      return;
    }

    try {
      setLoading(true);
      await changePassword(currentPassword, newPassword);
      showToast("비밀번호가 성공적으로 변경되었습니다.", "success");
      resetState();
      onClose();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          (err as axiosErrorType).response?.data?.message ??
          "현재 비밀번호가 올바르지 않습니다."
        );
      } else {
        setError("비밀번호 변경 중 문제가 발생했습니다. 다시 시도해주세요.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fade-in">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            비밀번호 변경
          </h2>
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            ×
          </button>
        </div>
        <p className="text-xs text-gray-500 mb-4">
          새 비밀번호는 <span className="font-semibold">영문, 숫자, 특수문자</span>를
          모두 포함하고 <span className="font-semibold">8자 이상</span>이어야
          합니다. 공백은 사용할 수 없어요.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 현재 비밀번호 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              현재 비밀번호
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="현재 비밀번호를 입력하세요"
            />
          </div>

          {/* 새 비밀번호 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              새 비밀번호
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1
                ${isNewPasswordValid === false
                  ? "border-red-400 focus:ring-red-400"
                  : "border-gray-300 focus:ring-indigo-500"
                }`}
              placeholder="8자 이상, 영문/숫자/특수문자 포함"
            />
            <p
              className={`mt-1 text-xs ${isNewPasswordValid === null
                  ? "text-gray-400"
                  : isNewPasswordValid
                    ? "text-green-600"
                    : "text-red-500"
                }`}
            >
              · 영문, 숫자, 특수문자를 모두 포함하고 공백 없이 8자 이상이어야 합니다.
            </p>
          </div>

          {/* 새 비밀번호 확인 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              새 비밀번호 확인
            </label>
            <input
              type="password"
              value={newPasswordConfirm}
              onChange={(e) => setNewPasswordConfirm(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1
                ${isConfirmMatched === false
                  ? "border-red-400 focus:ring-red-400"
                  : "border-gray-300 focus:ring-indigo-500"
                }`}
              placeholder="새 비밀번호를 다시 입력하세요"
            />
            {isConfirmMatched === false && (
              <p className="mt-1 text-xs text-red-500">
                · 새 비밀번호와 확인 비밀번호가 일치하지 않습니다.
              </p>
            )}
          </div>

          {/* 에러 메시지 */}
          {error && (
            <p className="text-sm text-red-500 mt-1 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {/* 버튼 영역 */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
              disabled={loading}
            >
              취소
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-1.5 text-sm rounded-lg bg-indigo-600 text-white font-medium disabled:opacity-60 disabled:cursor-not-allowed hover:bg-indigo-700"
            >
              {loading ? "변경 중..." : "변경하기"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordChangeModal;
