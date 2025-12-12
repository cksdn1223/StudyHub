import axios from "axios";
import { getHeaders } from "../../context/AxiosConfig";
import { useImageCropUpload } from "../../hooks/useImageCropUpload";
import ProfileImageCropModal from "../user-info/ProfileImageCropModal";
import { Camera } from "lucide-react";

interface StudyImageUploaderProps {
  studyId: number;
  studyTitle: string;
  studyImageUrl?: string | null;
  onUpdated?: (newUrl?: string) => void;
}

function StudyImageUploader({ studyId, studyTitle, studyImageUrl, onUpdated }: StudyImageUploaderProps) {
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
    initialUrl: studyImageUrl ?? null,
    defaultImage: "default",
    uploadCallback: async (formData) => {
      const res = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/study/${studyId}/study-image`,
        formData,
        {
          ...getHeaders(),
          headers: {
            ...getHeaders().headers,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // 필요하다면 부모에게 새 URL 전달
      onUpdated?.(res.data?.imageUrl);
    },
  });

  return (
    <>
      <div className="relative inline-block">
        <div className="w-24 h-24 rounded-lg overflow-hidden text-4xl bg-gray-300 flex items-center justify-center">
          {displayUrl === "default" ? (
            <>{studyTitle.slice(0, 1)}</>
          ) : (
            <img
              className="w-full h-full object-cover"
              src={displayUrl}
              alt="스터디 이미지"
            />)}
        </div>

        <button
          type="button"
          onClick={handleClick}
          disabled={uploading}
          className="absolute bottom-0 right-0 w-7 h-7 rounded-full 
                  bg-indigo-600 text-white flex items-center justify-center
                  shadow-sm hover:bg-indigo-700
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
          rect={true}
          imageUrl={cropImageUrl}
          onCancel={handleCropCancel}
          onConfirm={handleCropConfirm}
        />
      )}
    </>
  );
}

export default StudyImageUploader;
