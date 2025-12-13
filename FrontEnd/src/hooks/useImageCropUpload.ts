import { useRef, useState } from "react";
import { useToast } from "../context/ToastContext";
import { axiosErrorType } from "../type";

interface UseImageCropUploadOptions {
  // 서버에 업로드하는 실제 API 호출 함수 (각 컴포넌트에서 주입)
  uploadCallback: (formData: FormData) => Promise<void>;
  // 현재 서버에 저장된 이미지 URL
  initialUrl?: string | null;
  // 기본 이미지 (없을 때 보여줄)
  defaultImage?: string;
  // MB 단위 최대 파일 크기 (기본 2MB)
  maxFileSizeMB?: number;
}

export function useImageCropUpload({
  uploadCallback,
  initialUrl = null,
  defaultImage,
  maxFileSizeMB = 2,
}: UseImageCropUploadOptions) {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [uploading, setUploading] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [cropImageUrl, setCropImageUrl] = useState<string | null>(null);
  const [showCropModal, setShowCropModal] = useState(false);

  const handleClick = () => {
    if (uploading) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("이미지 파일만 업로드할 수 있습니다.", "error");
      return;
    }

    const maxSize = maxFileSizeMB * 1024 * 1024;
    if (file.size > maxSize) {
      showToast(`이미지 크기는 ${maxFileSizeMB}MB 이하만 가능합니다.`, "error");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setCropImageUrl(objectUrl);
    setShowCropModal(true);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCropConfirm = async (blob: Blob) => {
    if (!blob) return;
    setShowCropModal(false);

    const previewUrl = URL.createObjectURL(blob);
    setLocalPreview(previewUrl);

    const formData = new FormData();
    formData.append("file", blob, "image.jpg");

    try {
      setUploading(true);
      await uploadCallback(formData);
      showToast("이미지가 변경되었습니다.", "success");
    } catch (error) {
      showToast((error as axiosErrorType).response.data.message, "error");
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
    (initialUrl
      ? initialUrl
      : defaultImage);

  return {
    // state
    uploading,
    displayUrl,
    showCropModal,
    cropImageUrl,
    // refs
    fileInputRef,
    // handlers
    handleClick,
    handleFileChange,
    handleCropConfirm,
    handleCropCancel,
  };
}
