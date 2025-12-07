import { useState } from "react";
import axios from "axios";
import Card from "../public/Card";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { getHeaders } from "../../context/AxiosConfig";
import { useDaumPostcodePopup } from "react-daum-postcode";

function UserAddressSection() {
  const { user, refreshUser } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const open = useDaumPostcodePopup(
    "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
  );

  const handleComplete = async (data: { address: string }) => {
    try {
      setLoading(true);
      const addr = data.address;
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/vworld`,
        {
          params: { address: addr },
        }
      );
      const x = Number(response.data.response.result.point.x);
      const y = Number(response.data.response.result.point.y);
      await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/user/address`,
        {
          address: addr,
          longitude: x,
          latitude: y,
        },
        getHeaders()
      );

      await refreshUser();
      showToast("주소가 변경되었습니다.", "success");
    } catch (err) {
      showToast("주소 변경 중 문제가 발생했습니다.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddress = () => {
    open({ onComplete: handleComplete });
  };

  return (
    <Card title="주소 정보">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">현재 주소</p>
            <p className="font-semibold text-gray-800">
              {user.address || "등록된 주소가 없습니다."}
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddress}
            disabled={loading}
            className="px-3 py-1.5 text-sm rounded-lg bg-red-500 text-white disabled:opacity-60"
          >
            {loading ? "변경 중..." : "주소 변경"}
          </button>
        </div>

        {/* 필요하다면 입력 필드도 그대로 유지 가능 (읽기 전용) */}
        <div className="flex gap-2">
          <label htmlFor="address" className="sr-only">
            주소 입력
          </label>
          <input
            id="address"
            value={user.address ?? ""}
            type="text"
            disabled
            placeholder="주소 입력"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm
              focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
          <button
            type="button"
            onClick={handleAddress}
            className="flex-shrink-0 px-4 py-3 bg-gray-700 text-white text-sm font-medium rounded-lg hover:bg-gray-900"
          >
            주소 찾기
          </button>
        </div>
      </div>
    </Card>
  );
}

export default UserAddressSection;