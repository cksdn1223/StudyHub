# DB 설계
## 1. 🧑‍💻 사용자 (User) 테이블

| 필드명 | 데이터 타입 | 제약 조건 | 설명 |
| :--- | :--- | :--- | :--- |
| `user_id` | **BIGSERIAL** | **PK**, NOT NULL | 사용자 고유 ID (자동 증가). |
| `email` | VARCHAR(100) | NOT NULL, UNIQUE | 로그인 ID 및 주요 연락처. |
| `password` | VARCHAR(255) | NOT NULL | 암호화된 비밀번호. |
| `nickname` | VARCHAR(50) | NOT NULL, UNIQUE | 사용자 닉네임. |
| `role` | VARCHAR(20) | NOT NULL | 사용자 역할 (ROLE\_USER, ROLE\_ADMIN 등). |
| `created_at` | TIMESTAMP | NOT NULL | 생성 시각. |

## 2. 📝 스터디 모집 (Study) 테이블

스터디 모집글의 핵심 정보와 **PostGIS**를 위한 지리 정보를 저장합니다.

| 필드명 | 데이터 타입 | 제약 조건 | 설명 |
| :--- | :--- | :--- | :--- |
| `study_id` | **BIGSERIAL** | **PK**, NOT NULL | 스터디 고유 ID. |
| `leader_id` | BIGINT | **FK (User.user_id)** | 스터디장 ID. |
| `title` | VARCHAR(100) | NOT NULL | 모집글 제목. |
| `content` | TEXT | NOT NULL | 모집글 상세 내용. |
| `max_members` | INTEGER | NOT NULL | 최대 모집 인원. |
| `current_members` | INTEGER | NOT NULL | 현재 참여 인원. |
| `status` | VARCHAR(20) | NOT NULL | 모집 상태 (RECRUITING, FULL, FINISHED). |
| `location_name` | VARCHAR(100) | NULL | 스터디 장소 이름 (예: 강남역 스타벅스). |
| `geom` | **GEOMETRY(Point, 4326)** | NULL | **PostGIS** 좌표 저장 필드 (위도, 경도). |
| `created_at` | TIMESTAMP | NOT NULL | 생성 시각. |

> **💡 PostGIS 활용:** `geom` 필드는 PostGIS 확장으로 생성되며, 위도와 경도를 저장하여 **거리 기반 검색**에 사용됩니다.

## 3. 🏷️ 기술 태그 (Tag) 및 관계 테이블

복합 검색을 위한 **기술 스택** 정보를 저장하고, `Study`와 **다대다(M:N)** 관계를 연결합니다.

### Tag 테이블

| 필드명 | 데이터 타입 | 제약 조건 | 설명 |
| :--- | :--- | :--- | :--- |
| `tag_id` | **SERIAL** | **PK**, NOT NULL | 태그 고유 ID. |
| `name` | VARCHAR(50) | NOT NULL, UNIQUE | 태그 이름 (예: React, SpringBoot). |

### Study_Tag 테이블 (중간 테이블)

| 필드명 | 데이터 타입 | 제약 조건 | 설명 |
| :--- | :--- | :--- | :--- |
| `study_tag_id` | BIGSERIAL | **PK**, NOT NULL | 중간 테이블 고유 ID. |
| `study_id` | BIGINT | **FK (Study.study_id)** | 스터디 ID. |
| `tag_id` | INTEGER | **FK (Tag.tag_id)** | 태그 ID. |
| | | **UNIQUE (study_id, tag_id)** | 중복 태그 방지. |

## 4. 🤝 스터디 참여 (Study_Participant) 테이블

사용자가 어떤 스터디에 참여 중인지 상태를 관리합니다.

| 필드명 | 데이터 타입 | 제약 조건 | 설명 |
| :--- | :--- | :--- | :--- |
| `participant_id` | BIGSERIAL | **PK**, NOT NULL | 참여 기록 고유 ID. |
| `study_id` | BIGINT | **FK (Study.study_id)** | 스터디 ID. |
| `user_id` | BIGINT | **FK (User.user_id)** | 참여 사용자 ID. |
| `status` | VARCHAR(20) | NOT NULL | 참여 상태 (PENDING, ACCEPTED, REJECTED). |
| | | **UNIQUE (study_id, user_id)** | 한 스터디에 한 번만 참여 신청 가능. |

## 5. 🔔 알림 (Notification) 테이블

사용자 접속 상태와 무관하게 발생한 알림을 저장하고 관리합니다. (Websocket 및 Web Push의 보조 역할)

| 필드명 | 데이터 타입 | 제약 조건 | 설명 |
| :--- | :--- | :--- | :--- |
| `notification_id` | **BIGSERIAL** | **PK**, NOT NULL | 알림 고유 ID. |
| `receiver_id` | BIGINT | **FK (User.user_id)** | 알림을 받을 사용자 ID. |
| `message` | VARCHAR(255) | NOT NULL | 알림 내용. |
| `is_read` | BOOLEAN | NOT NULL | 사용자 확인 여부 (True/False). |
| `type` | VARCHAR(50) | NULL | 알림 타입 (JOIN_REQUEST, ACCEPTED 등). |
| `created_at` | TIMESTAMP | NOT NULL | 생성 시각. |

## 6. 📱 웹 푸시 구독 (Push_Subscription) 테이블

사용자에게 **Web Push Notification** 을 보내기 위해 브라우저가 제공한 고유 구독 정보를 저장합니다.

| 필드명 | 데이터 타입 | 제약 조건 | 설명 |
| :--- | :--- | :--- | :--- |
| `subscription_id` | **BIGSERIAL** | **PK**, NOT NULL | 구독 정보 고유 ID. |
| `user_id` | BIGINT | **FK (User.user_id)**, UNIQUE | 사용자 ID. (한 사용자당 하나의 활성 구독) |
| `endpoint` | VARCHAR(512) | NOT NULL | 푸시 서비스 엔드포인트 URL. |
| `p256dh_key` | VARCHAR(255) | NOT NULL | 인증 키 (p256dh). |
| `auth_key` | VARCHAR(255) | NOT NULL | 인증 시크릿 키. |
| `created_at` | TIMESTAMP | NOT NULL | 생성 시각. |

---

## 7. 💬 채팅 메시지 (Chat_Message) 테이블

사용자 간의 **대화내용을 저장해서 불러오는 기능** 을 구현할 때 필요합니다.

| 필드명 | 데이터 타입 | 제약 조건 | 설명 |
| :--- | :--- | :--- | :--- |
| `message_id` | **BIGSERIAL** | **PK**, NOT NULL | 메시지 고유 ID. |
| `study_id` | BIGINT | **FK (Study.study_id)** | 메시지가 속한 스터디 그룹 ID. |
| `sender_id` | BIGINT | **FK (User.user_id)** | 메시지를 보낸 사용자 ID. |
| `content` | TEXT | NOT NULL | 메시지 내용. |
| `sent_at` | TIMESTAMP | NOT NULL | 메시지 전송 시각 (조회 순서 기준). |

## 8. 🚫 사용자 차단/신고 (Block\_Report) 테이블 (관리 권장)

사용자 간의 불건전한 행위나 스팸성 게시물에 대한 **관리 기능** 을 구현할 때 필요합니다.

| 필드명 | 데이터 타입 | 제약 조건 | 설명 |
| :--- | :--- | :--- | :--- |
| `report_id` | **BIGSERIAL** | **PK**, NOT NULL | 신고/차단 기록 ID. |
| `reporter_id` | BIGINT | **FK (User.user_id)** | 신고한 사용자 ID. |
| `target_id` | BIGINT | **FK (User.user_id)** | 신고 대상 사용자 ID. |
| `report_type` | VARCHAR(50) | NOT NULL | 신고 유형 (SPAM, ABUSE, ETC). |
| `status` | VARCHAR(20) | NOT NULL | 처리 상태 (PENDING, PROCESSED). |
| `reported_at` | TIMESTAMP | NOT NULL | 신고 시각. |

---

# 🔗 엔티티 간의 관계 설계

| 관계 테이블 | 대상 테이블 | 관계 유형 | 외래 키 (FK) 컬럼 | 설명 |
| :--- | :--- | :--- | :--- | :--- |
| **Study** | **User** | 1:N | `leader_id` | 스터디 개설자 연결. |
| **Study\_Tag** | **Study** | 1:N | `study_id` | N:M 관계 해소. |
| **Study\_Tag** | **Tag** | 1:N | `tag_id` | N:M 관계 해소. |
| **Study\_Participant** | **User** | 1:N | `user_id` | 참여 신청/기록 사용자 연결. |
| **Study\_Participant** | **Study** | 1:N | `study_id` | 참여 스터디 연결. |
| **Notification** | **User** | 1:N | `receiver_id` | 알림 수신자 연결. |
| **Push\_Subscription** | **User** | 1:1 | `user_id` | 웹 푸시 구독 정보 연결. (Unique) |
| **Chat\_Message** | **Study** | 1:N | `study_id` | 메시지가 속한 스터디 연결. |
| **Chat\_Message** | **User** | 1:N | `sender_id` | 메시지 발신자 연결. |
| **Block\_Report** | **User** | 1:N | `reporter_id` | 신고한 사용자 연결. |
| **Block\_Report** | **User** | 1:N | `target_id` | 신고 대상 사용자 연결. |