package com.project.studyhub.service.gcs;

import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.project.studyhub.entity.Study;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Service
public class StudyImageService {
    private final Storage storage;
    private final String bucketName;

    public StudyImageService(
            Storage storage,
            @Value("${spring.cloud.gcp.storage.bucket}") String bucketName) {
        this.storage = storage;
        this.bucketName = bucketName;
    }

    public String uploadProfileImage(Study study, MultipartFile file) {
        // 간단한 검증
        if (file.isEmpty()) {
            throw new IllegalArgumentException("파일이 비어있습니다.");
        }
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("이미지 파일만 업로드할 수 있습니다.");
        }

        String ext = extractExtension(file.getOriginalFilename());
        String objectName = "studys/" + study.getId() + "/image/" + UUID.randomUUID() + ext;

        try {
            BlobId blobId = BlobId.of(bucketName, objectName);
            BlobInfo blobInfo = BlobInfo.newBuilder(blobId)
                    .setContentType(contentType)
                    .build();

            storage.create(blobInfo, file.getBytes());

            // public 버킷이라면 이 URL로 바로 접근 가능
            return String.format("https://storage.googleapis.com/%s/%s", bucketName, objectName);

        } catch (Exception e) {
            throw new RuntimeException("프로필 이미지 업로드 중 오류 발생", e);
        }
    }

    private String extractExtension(String originalName) {
        if (originalName == null) return "";
        int dot = originalName.lastIndexOf('.');
        return dot > -1 ? originalName.substring(dot) : "";
    }
}
