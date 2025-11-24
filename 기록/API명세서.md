# 📄 스터디 매칭 웹 서비스 (StudyHub) 임시 API 명세서
## 1. 🔑 인증 및 사용자 API (Auth & User)

| Method | URI | 설명 | 요청 Body / Query Parameter |
| :--- | :--- | :--- | :--- |
| **POST** | `/auth/signup` | **회원가입** (User 테이블 생성) | `email`, `password`, `nickname` |
| **POST** | `/auth/login` | **로그인** 및 JWT 발급 | `email`, `password` |
| **GET** | `/users/me` | **내 정보 조회** (JWT 필요) | (없음) |
| **PUT** | `/users/me` | 프로필 업데이트 | `nickname`, `password` 등 |

## 2. 📚 스터디 모집 및 검색 API (Study & Search)

이 섹션은 **QueryDSL**과 **PostGIS**를 활용하는 가장 복잡한 엔드포인트입니다.

| Method | URI | 설명 | 요청 Body / Query Parameter |
| :--- | :--- | :--- | :--- |
| **POST** | `/studies` | **스터디 모집글 생성** | `title`, `content`, `max_members`, `location_name`, **`latitude`**, **`longitude`**, `tag_ids` |
| **GET** | `/studies` | **스터디 목록 조회 및 복합 검색** | **`keyword`**, **`tags`**(List), **`status`**, `page`, `size` |
| **GET** | `/studies/nearby` | **위치 기반 검색** (PostGIS) | **`center_lat`**, **`center_lon`**, **`radius_km`** (Query Parameter) |
| **GET** | `/studies/{studyId}` | 특정 스터디 상세 조회 | (없음) |
| **PUT** | `/studies/{studyId}` | 스터디 수정 (리더만 가능) | `title`, `max_members`, `status` 등 |

## 3. 🤝 스터디 참여 API (Participation)

`Study_Participant` 테이블의 상태(`PENDING`, `ACCEPTED`, `REJECTED`)를 변경하는 로직입니다.

| Method | URI | 설명 | 요청 Body / Query Parameter |
| :--- | :--- | :--- | :--- |
| **POST** | `/studies/{studyId}/join` | 스터디 **참여 신청** (status: PENDING) | (없음) |
| **PUT** | `/studies/{studyId}/participants/{userId}/accept` | **신청 수락** (리더 전용, status: ACCEPTED) | (없음) |
| **PUT** | `/studies/{studyId}/participants/{userId}/reject` | **신청 거절** (리더 전용, status: REJECTED) | (없음) |
| **DELETE** | `/studies/{studyId}/leave` | 스터디 **나가기** | (없음) |

## 4. 🔔 알림 및 메시징 API (Notification & Chat)

Websocket (STOMP)은 HTTP REST API가 아닌 별도의 소켓 연결 프로토콜을 사용하므로, REST API는 주로 **구독 정보 저장** 및 **알림 조회**에 사용됩니다.

| Method | URI | 설명 | 요청 Body / Query Parameter |
| :--- | :--- | :--- | :--- |
| **POST** | `/notifications/subscribe/push` | **Web Push 구독 정보 저장** (`Push_Subscription` 테이블) | `endpoint`, `p256dh_key`, `auth_key` (Web Push Payload) |
| **GET** | `/notifications` | **미확인/과거 알림 목록 조회** | `is_read` (Query Parameter) |
| **PUT** | `/notifications/{id}/read` | 알림 읽음 처리 | (없음) |
| **GET** | `/studies/{studyId}/messages` | **채팅 기록 조회** (Chat\_Message 테이블) | `cursor_id` (마지막 조회 메시지 ID, 무한 스크롤용) |

> **💡 Websocket Endpoints (STOMP):**
> * **연결:** `/ws`
> * **구독 (개인 알림):** `/user/{userId}/queue/notifications`
> * **구독 (채팅방):** `/topic/studies/{studyId}/chat`

## 5. 🚨 관리 및 신고 API (Moderation)

| Method | URI | 설명 | 요청 Body / Query Parameter |
| :--- | :--- | :--- | :--- |
| **POST** | `/users/{targetId}/report` | **사용자 신고** (Block\_Report 테이블) | `report_type`, `content` |
| **GET** | `/admin/reports` | **신고 목록 조회** (관리자 전용) | `status` (PENDING 등) |
| **POST** | `/admin/reports/{reportId}/process` | 신고 처리 (관리자 전용) | `action` (BAN, IGNORE 등) |