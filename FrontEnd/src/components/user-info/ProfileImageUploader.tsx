import { Camera } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { useRef, useState } from "react";
import axios from "axios";
import { getHeaders } from "../../context/AxiosConfig";
import defaultAvatar from "../../assets/image/defaultImage.webp"
import ProfileImageCropModal from "./ProfileImageCropModal";

function ProfileImageUploader() {
  const { user: leader, refreshUser } = useAuth();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [cropImageUrl, setCropImageUrl] = useState<string | null>(null); // 크롭 대상 이미지 URL
  const [showCropModal, setShowCropModal] = useState(false);

  if (leader.email.length === 0) return;

  const handleClick = () => {
    if (uploading) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 간단 검증
    if (!file.type.startsWith("image/")) {
      showToast("이미지 파일만 업로드할 수 있습니다.", "error");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      showToast("이미지 크기는 2MB 이하(2MB)만 가능합니다.", "error");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setCropImageUrl(objectUrl);
    setShowCropModal(true);
    // 파일 input 초기화
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // 크롭 모달에서 적용하기 눌렀을 때
  const handleCropConfirm = async (blob: Blob) => {
    if (!blob) return;
    setShowCropModal(false);

    // 프론트 미리보기용
    const previewUrl = URL.createObjectURL(blob);
    setLocalPreview(previewUrl);

    const formData = new FormData();
    formData.append("file", blob, "profile.jpg"); // 이름 임의 지정

    try {
      setUploading(true);
      await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/user/profile-image`,
        formData,
        {
          ...getHeaders(),
          headers: {
            ...getHeaders().headers,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      showToast("프로필 이미지가 변경되었습니다.", "success");
      await refreshUser();
    } catch (err) {
      console.error(err);
      showToast("이미지 업로드 중 오류가 발생했습니다.", "error");
      setLocalPreview(null);
    } finally {
      setUploading(false);
      if (cropImageUrl) {
        URL.revokeObjectURL(cropImageUrl);
        setCropImageUrl(null);
      }
    }
  };
  const handleCropCancel = () => {
    setShowCropModal(false);
    if (cropImageUrl) {
      URL.revokeObjectURL(cropImageUrl);
      setCropImageUrl(null);
    }
  };

  const displayUrl =
    localPreview ??
    (leader.profileImageUrl && leader.profileImageUrl !== "defaultUrl"
      ? leader.profileImageUrl
      : defaultAvatar);

  return (
    <>
      <div className="relative inline-block">
        {/* 동그란 아바타 박스 */}
        <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
          <img
            className="w-full h-full object-cover"
            src={displayUrl}
            alt="프로필 이미지"
          />
        </div>

        {/* 카메라 버튼 */}
        <button
          type="button"
          onClick={handleClick}
          disabled={uploading}
          className="absolute bottom-0 right-0 w-7 h-7 rounded-full 
                  bg-indigo-600 text-white flex items-center justify-center
                  border-2 border-white shadow-sm hover:bg-indigo-700
                  disabled:opacity-60"
        >
          <Camera size={14} />
        </button>

        {/* 숨겨진 파일 인풋 */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* 크롭 모달 */}
      {
        showCropModal && cropImageUrl && (
          <ProfileImageCropModal
            imageUrl={cropImageUrl}
            onCancel={handleCropCancel}
            onConfirm={handleCropConfirm}
          />
        )
      }
    </>
  );
}

export default ProfileImageUploader;