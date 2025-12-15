import InputField from "../public/InputField";

export function AddressSection({
  address,
  detailAddress,
  onDetailChange,
  isAddressLoading,
  openAddress,
}: {
  address: string;
  detailAddress?: string;
  onDetailChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  isAddressLoading: boolean;
  openAddress: () => void;
}) {
  return (
    <>
      <div className="flex items-end gap-3">
        <InputField label="주소" placeholder="주소 입력" value={address} disabled required />
        <button
          className={`flex-shrink-0 h-11 rounded-lg px-4 py-3 text-sm font-medium text-white transition
            ${isAddressLoading ? "bg-gray-300 cursor-wait" : "bg-red-400 hover:bg-red-500"}`}
          onClick={openAddress}
          disabled={isAddressLoading}
        >
          {isAddressLoading ? (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-t-transparent" />
          ) : (
            <span className="flex items-center gap-1">
              <span>📍</span>
              <span>주소 찾기</span>
            </span>
          )}
        </button>
      </div>

      <InputField
        label="상세 장소"
        placeholder="예: 스터디룸, 강남역점, 토즈 스터디센터 등"
        value={detailAddress ?? ""}
        onChange={onDetailChange}
        id="detailAddress"
      />
    </>
  );
}
