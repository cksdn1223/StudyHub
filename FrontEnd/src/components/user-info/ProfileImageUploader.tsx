import { Camera } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import defaultAvatar from "../../assets/image/defaultImage.webp"
import ProfileImageCropModal from "./ProfileImageCropModal";
import { useImageCropUpload } from "../../hooks/useImageCropUpload";
import { changeProfileImg } from "../../api/api";


function ProfileImageUploader() {
  const { user: leader, refreshUser } = useAuth();

  const initialProfileUrl =
    leader?.profileImageUrl && leader.profileImageUrl !== "defaultUrl"
      ? leader.profileImageUrl
      : null;

  const {
    uploading,
    displayUrl,
    showCropModal,
    cropImageUrl,
    fileInputRef,
    handleClick,
    handleFileChange,
    handleCropConfirm,
    handleCropCancel,
  } = useImageCropUpload({
    initialUrl: initialProfileUrl,
    defaultImage: defaultAvatar,
    uploadCallback: async (formData) => {
      await changeProfileImg(formData);
      await refreshUser();
    },
  });

  if (!leader || !leader.email) return null;

  return (
    <>
      <div className="relative inline-block">
        <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
          <img
            className="w-full h-full object-cover"
            src={displayUrl ?? defaultAvatar}
            alt="프로필 이미지"
          />
        </div>

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

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {showCropModal && cropImageUrl && (
        <ProfileImageCropModal
          imageUrl={cropImageUrl}
          onCancel={handleCropCancel}
          onConfirm={handleCropConfirm}
        />
      )}
    </>
  );
}

export default ProfileImageUploader;