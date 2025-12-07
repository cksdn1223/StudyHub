# 유저 프로필 이미지 관련 기술선택

이미지를 그대로 로컬에 올리는 방식은 이미지 수가 적을 때는 상관없지만,  
유저 프로필 이미지처럼 “유저 수만큼 계속 늘어나는 리소스”의 경우에는 서버 디스크 용량과 백업, 배포 시 파일 동기화 문제 등이 생길 수 있다고 판단했다.  
특히 100명의 유저면 100개, 1,000명이라면 1,000개 이상으로 선형적으로 증가하기 때문에, 애플리케이션 서버에 직접 올리는 방식은 장기적으로 비효율적이라 생각해 **Cloud Storage(Object Storage)** 를 사용하기로 했다.

## 요구사항 정리

- 유저마다 최대 1장의 프로필 이미지를 가진다.
- 추후 유저 수가 늘어나도 서버 교체/스케일 아웃에 영향을 최소화하고 싶다.
- 이미지 교체 시에는 기존 이미지는 더 이상 참조되지 않도록 정리할 수 있어야 한다.
- 프론트에서는 단순히 `URL`만 받아서 `<img>`로 렌더링할 수 있으면 된다.

## 대안 비교

### 1) 애플리케이션 서버 로컬에 저장

- **장점**
  - 구현이 가장 간단함 (`/uploads/profile/…` 형태로 저장 후 URL 매핑).
  - 추가 설정이 필요 없음.
- **단점**
  - 서버를 여러 대로 늘릴 경우, **파일 동기화 문제가 발생**함.
  - 서버 디스크 용량이 직접적으로 이미지 수에 영향을 받아 관리가 번거로움.
  - 배포/롤백 시 파일까지 같이 관리해야 해서 운영 복잡도 증가.
  - 백업 전략을 따로 세워야 함.

### 2) DB에 BLOB 형태로 저장

- **장점**
  - 트랜잭션 안에서 메타데이터와 이미지를 한 번에 관리 가능.
  - 파일 시스템 권한이나 경로를 신경 쓰지 않아도 됨.
- **단점**
  - DB I/O 부하 증가 및 백업 용량 증가 → 비용/성능 비효율.
  - 이미지 조회를 위해 항상 DB를 거쳐야 해서 캐싱/정적 파일 서빙이 어렵다.

### 3) Cloud Object Storage (선택)

- **장점**
  - 이미지 파일은 Object Storage에 저장, DB에는 **이미지 URL만 저장** → 책임 분리.
  - 저장 용량이 거의 무한에 가깝고, 비용도 상대적으로 저렴.
  - 애플리케이션 서버 수와 무관하게 이미지가 한 곳에서 관리되어 **스케일 아웃에 유리**.
  - 추후 CDN(CloudFront, Cloudflare 등)을 붙여 이미지 로딩 속도 개선 가능.
  - 백업/내구성, 가용성이 기본적으로 보장됨.
- **단점**
  - 초기 셋업이 로컬 저장보다 복잡함(IAM 권한, 버킷 설정, SDK 연동 등).
  - 퍼블릭/프라이빗 권한 설정, presigned URL 등 **보안/권한 설계**를 고려해야 함.

위 대안들을 비교했을 때, 현재 프로젝트는 **실제 서비스 운영을 염두**에 두고 있고,  
유저 수 증가를 가정한 확장성·운영 편의성이 중요하다고 판단하여  
최종적으로 Cloud Object Storage 방식을 선택했다.  

## 적용 방식(설계)

- DB `User` 엔티티에는 다음과 같이 **프로필 이미지 URL만** 저장한다.
  - `profileImageUrl: String (nullable)`
- 프로필 이미지 업로드 플로우:
  1. 클라이언트에서 특정 엔드포인트로 이미지 업로드 요청
  2. 백엔드에서 이미지 유효성 검사(용량/확장자 등) 후 Cloud Storage에 업로드
  3. 업로드된 파일의 URL을 받아 `User.profileImageUrl`을 갱신
  4. 응답으로 최신 `profileImageUrl`을 반환하면, 프론트는 해당 URL로 이미지 표시
- 프론트에서는:
  - `user.profileImageUrl`이 있으면 해당 URL을 표시
  - 없으면 기본 아바타 아이콘을 사용

## 기대 효과 및 향후 개선 방향

- 애플리케이션 서버와 이미지 저장소가 분리되어, **배포·스케일 아웃 시 영향 최소화**.
- 유저 수가 많아져도 서버 로컬 디스크 용량 걱정을 줄이고, 비용/운영 측면에서 효율적.
- 추후:
  - CDN 연동을 통해 정적 리소스 로딩 속도 최적화
  - presigned URL을 활용해 **프론트 → 스토리지 직접 업로드** 구조로 개선해
    백엔드의 파일 전송 부하를 줄이는 방향까지 고도화 가능.


------

# 전체 구조
1. 프론트: 유저가 이미지 선택 -> `POST /user/profile-image`로 `FormData` 전송
2. 백엔드:
  - 이미지 검증(확장자,사이즈등)
  - GCS 버킷에 users/{userId}/profile/{uuid}.jpg 로 업로드
  - GCS URL을 DB에 저장
3. 프론트: 프로필 표시할 때 DB에 저장된 URL 그대로 `<img src={profileImageUrl} />`

# 1. GCS 버킷 설계 (개발/운영 분리)
1. 버킷 나누기
  - 개발: studyhub-profile-dev
  - 운영: studyhub-profile-prod
  - 리전: asia-northeast3 (서울)
2. 권한 전략
  - 버킷 단위 설정
    - "Uniform bucket-level access" 켜기
    - Public read 가 부담되면 Signed URL 로 바꾸면 됨
>경로 예시 `users/{userId}/profile/profile-{uuid}.jpg`

# 2. Spring Boot 에서 GCS 연동
1. 의존성 추가
`implementation 'com.google.cloud:google-cloud-storage:2.40.0'`
2. 설정 값
```properties
spring.cloud.gcp.storage.project-id=프로젝트명
spring.cloud.gcp.storage.credentials.location=classpath:json키 이름.json
spring.cloud.gcp.storage.bucket=버킷명
```
3. Storage Bean 설정
```java
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GcsConfig {

    @Bean
    public Storage storage() {
        return StorageOptions.getDefaultInstance().getService();
    }
}
```
> `getDefaultInstance()`는 로컬 환경변수/GCP 서비스계정을 자동으로 사용

# 3. 프로필 이미지 업로드 서비스 예시
```java
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.BlobId;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Service
public class ProfileImageService {

    private final Storage storage;
    private final String bucketName;

    public ProfileImageService(Storage storage,
                               @Value("${app.gcs.bucket-name}") String bucketName) {
        this.storage = storage;
        this.bucketName = bucketName;
    }

    public String uploadProfileImage(Long userId, MultipartFile file) {
        // 간단한 검증
        if (file.isEmpty()) {
            throw new IllegalArgumentException("파일이 비어있습니다.");
        }
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("이미지 파일만 업로드할 수 있습니다.");
        }

        String ext = extractExtension(file.getOriginalFilename());
        String objectName = "users/" + userId + "/profile/" + UUID.randomUUID() + ext;

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
```
- UserService 사용 예시
```java
@Transactional
public void changeProfileImage(Long userId, MultipartFile file) {
    User user = userRepository.findById(userId)
            .orElseThrow(() -> new UsernameNotFoundException("유저를 찾을 수 없습니다."));

    String newUrl = profileImageService.uploadProfileImage(userId, file);

    // 필요하면 기존 이미지 삭제 로직도 추가 (oldUrl 파싱 → GCS 삭제)
    user.changeProfileImageUrl(newUrl);
}
```

# 4. 로컬 개발 vs GCP 배포 시 인증/환경 차이
1. 로컬 개발
  - GCP콘솔에서 서비스 계정 생성
    - 역할: `Storage Object Admin` (테스트용)
    - 키(JSON) 발급
  - 개발 PC에 환경 변수 설정\
    `setx GOOGLE_APPLICATION_CREDENTIALS "C:\path\to\service-account.json"`
  - SpringBoot에서 `getDefaultInstance()`가 이 키를 사용해서 접근

2. GCP 배포(Cloud Run 기준 예시)
  - Cloud Run 서비스에 서비스 계정 연결
    - 이 서비스 계정에 최소한 `Storage Object Admin`(또는 `Storage Object Creator + Viewer`) 권한을 버킷에 부여.
  - 키 파일 필요 없음
    - Cloud Run 내부에서는 **메타데이터 서버**로 자동 인증이 되기 때문에 `getDefaultInstance()`로 바로 GCS 사용 가능.
  - 환경별 버킷 분리
    - Cloud Run "환경 변수" 에 `SPRING_PROFILES_ACTIVE=prod`
    - `application.properties`에서 prod용 버킷 이름 사용.

# 5. 프론트에서 연동
1. 업로드 요청 (예: `/user/profile-image`)
```tsx
const handleProfileImageChange = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  await axios.post(
    `${import.meta.env.VITE_BASE_URL}/user/profile-image`,
    formData,
    {
      ...getHeaders(),
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  // 업로드 후 내 정보 다시 fetch or refreshUser()
};
```
2. 미리보기/표시
```tsx
<img
  src={user.profileImageUrl ?? "/images/default-avatar.png"}
  alt="프로필 이미지"
  className="w-12 h-12 rounded-full object-cover"
/>
```

----

# GCS 버킷 만들기
1. GCP콘솔 -> Cloud Storage -> Buckets -> Create Bucket
2. 설정 예시
  - **Bucket name**: `studyhub-profile-dev
  - **Location type**: `Region`
  - **Location**: `asia-northeast3`
  - **Default storage class**: `Standard`
  - **Access control**: 권장 **Uniform**(Uniform bucket-level access)
3. 이미지 URL로 바로 접근하려면 Permission 탭에서 `allUsers` -> `Storage Object Viewer` 권한을 주면 public read가 됨
> 프로필 정도니까 public read 도 괜찮음

# 서비스 계정 + 키 만들기
1. IAM & ADMIN -> Service Accounts
2. "Create Service account"
3. 역할: `Storage Object Admin`
4. 생성된 서비스 계정에서 Keys -> Add key -> JSON 저장

