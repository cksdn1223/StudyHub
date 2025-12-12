import { useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import { getCroppedImage } from "../../utils/getCroppedImage";

type ProfileImageCropModalProps = {
  imageUrl: string;
  rect?: boolean;
  onCancel: () => void;
  onConfirm: (blob: Blob) => void;
};

const ProfileImageCropModal = ({
  imageUrl,
  rect,
  onCancel,
  onConfirm,
}: ProfileImageCropModalProps) => {
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCropComplete = (_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  };

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return;
    try {
      setLoading(true);
      const blob = await getCroppedImage(imageUrl, croppedAreaPixels);
      onConfirm(blob);
    } catch (err) {
      console.error(err);
      alert("이미지 처리 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-4 flex flex-col">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          프로필 이미지 자르기
        </h2>

        {/* 크롭 영역 */}
        <div className="relative w-full aspect-square bg-black/10 rounded-xl overflow-hidden">
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape={rect ? "rect" : "round"}
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
          />
        </div>

        {/* 줌 슬라이더 */}
        <div className="mt-3">
          <label className="block text-xs text-gray-500 mb-1">
            확대 / 축소
          </label>
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
        </div>

        {/* 버튼들 */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-200"
            disabled={loading}
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="px-4 py-1.5 text-sm rounded-lg bg-red-400 hover:bg-red-500 text-white font-medium disabled:opacity-60"
          >
            {loading ? "적용 중..." : "적용하기"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileImageCropModal;
