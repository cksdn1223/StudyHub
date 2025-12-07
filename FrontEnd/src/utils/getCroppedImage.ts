import { Area } from "react-easy-crop";

/**
 * imageSrc: 크롭할 이미지 URL
 * pixelCrop: react-easy-crop에서 넘어오는 crop 영역
 */
export const getCroppedImage = (
  imageSrc: string,
  pixelCrop: Area
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = imageSrc;

    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("2D 컨텍스트를 가져올 수 없습니다."));
        return;
      }

      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Blob 생성 실패"));
            return;
          }
          resolve(blob);
        },
        "image/jpeg",
        0.9
      );
    };

    image.onerror = (err) => reject(err);
  });
};
