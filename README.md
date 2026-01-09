# StudyHub - 위치 기반 스터디 매칭 플랫폼

## 📋 프로젝트 개요

StudyHub는 사용자의 지리적 위치와 관심 기술 스택을 기반으로 최적의 스터디 그룹을 매칭해주는 웹 플랫폼입니다. 실시간 소통과 안정적인 알림 시스템을 통해 원활한 스터디 활동을 지원합니다.

## 🏗️ 기술 스택

### Backend
- **Framework**: Spring Boot 3.5.8 + Java 17
- **Security**: Spring Security + JWT (io.jsonwebtoken 0.13.0)
- **Database**: PostgreSQL + PostGIS (공간 데이터 처리)
- **WebSocket**: SockJS + STOMP (실시간 통신)
- **Push Notifications**: Web Push API + VAPID

### Frontend
- **Framework**: React 18.2 + TypeScript 5.0.2
- **Build Tool**: Vite 4.4.5
- **State Management**: React Query (TanStack) 5.90.11
- **WebSocket Client**: @stomp/stompjs + sockjs-client
- **Styling**: Tailwind CSS 3.4.18

## 🚀 핵심 기능

### 1. 위치 기반 스터디 검색
- PostGIS 확장을 사용한 공간 쿼리로 반경 내 스터디 검색
- Vworld API 연동으로 주소 → 좌표 변환

### 2. 실시간 채팅 시스템
- WebSocket을 통한 양방향 메시징
- 채팅 참여자 상태 추적 및 오프라인 사용자 푸시 알림

### 3. 스터디 참여 워크플로우
- 4단계 상태 관리: PENDING → ACCEPTED/REJECTED/BAN
- 이중 채널 알림: WebSocket + Web Push

### 4. 기술 스택 태그 시스템
- 50+ 개의 기술 태그 지원
- 자동 완성 및 중복 검증 기능

## 🏛️ 시스템 아키텍처

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   (React SPA)   │◄──►│  (Spring Boot)  │◄──►│ (PostgreSQL)    │
│                 │    │                 │    │   + PostGIS     │
│ • Firebase      │    │ • Cloud Run     │    │                 │
│ • WebSocket     │    │ • WebSocket     │    │ • Spatial Data  │
│ • Service Worker│    │ • Web Push      │    │ • JPA Entities  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔄 CI/CD 파이프라인

### Backend 배포
- 트리거: `BackEnd/**` 경로 변경 시
- GCP Cloud Build → Artifact Registry → Cloud Run 배포

### Frontend 배포
- 트리거: `FrontEnd/**` 경로 변경 시
- Vite 빌드 → Firebase Hosting 배포

## 🛠️ 로컬 개발 환경 설정

### Backend 실행
```bash
cd BackEnd
./gradlew bootRun
```

### Frontend 실행
```bash
cd FrontEnd
npm install
npm run dev
```

### 환경 변수 설정
- Backend: `application.properties`에 DB 연결 정보 설정
- Frontend: `.env` 파일에 API URL 설정

## 📁 프로젝트 구조

```
StudyHub/
├── BackEnd/
│   ├── src/main/java/com/project/studyhub/
│   │   ├── controller/     # REST API 엔드포인트
│   │   ├── service/        # 비즈니스 로직
│   │   ├── repository/     # 데이터 접근 계층
│   │   ├── entity/         # JPA 엔티티
│   │   └── config/         # 설정 클래스
│   └── build.gradle
├── FrontEnd/
│   ├── src/
│   │   ├── components/     # React 컴포넌트
│   │   ├── context/        # React Context
│   │   ├── api/           # API 클라이언트
│   │   └── types/         # TypeScript 타입
│   └── package.json
└── .github/workflows/     # CI/CD 파이프라인
```

## 🌟 주요 기술적 도전 과제

### 1. 공간 데이터 최적화
PostGIS의 `ST_DistanceSphere` 함수를 사용하여 지구 표면上的 정확한 거리 계산

### 2. 이중 채널 알림 시스템
WebSocket으로 실시간 사용자에게 전달하고, 오프라인 사용자에게는 Web Push로 알림 전송

### 3. 상태 기반 참여 관리
스터디 참여 요청의 상태 전이를 체계적으로 관리하고 각 단계별 알림 발송

## 📊 성능 및 확장성

- **데이터베이스**: 공간 인덱스를 통한 위치 기반 검색 최적화
- **캐싱**: React Query를 통한 서버 상태 캐싱
- **실시간 통신**: WebSocket 연결 풀링 및 메시지 브로커
- **배포**: Cloud Run의 자동 스케일링 활용

## 🔗 외부 서비스 연동

- **Vworld API**: 한국 주소 지오코딩
- **Daum Postcode API**: 주소 검색 UI
- **Google Cloud Storage**: 스터디 이미지 파일 저장
- **Firebase Hosting**: 프론트엔드 정적 호스팅

---
