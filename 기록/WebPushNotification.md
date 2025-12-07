# Web Push
## 브라우저에서 권한 허용
- Notification.requestPermission()
## Service Worker 등록
- sw.js 가 백그라운드에서 알림을 받음
## Push 구독 정보 생성
- PushManager.subscribe(...) → endpoint + key 들 생성
## 구독 정보를 백엔드에 저장
- /api/push/subscribe 같은 API로 전송
## 서버에서 알림 발생할 때
- 지금처럼 DB에 Notification 저장 + WebSocket 전송
- + Web Push로 OS/브라우저에 푸시 발송

# 1. Service Worker 파일 만들기
`public/sw.js`
# 2. 서비스워커 & 푸시구독 등록
1. VALID Public Key 준비
`npm install web-push -g`
`web-push generate-vapid-keys`
2. 구독 로직 유틸 함수
`pushSubscription.ts`
3. 로그인 후 한 번 구독 등록 & 서버로 보내기
`AuthContext.tsx`
# 3. 백엔드 구독정보 저장
`PushSubscription.java`
`PushSubscribeRequest.java`
`PushController.java`
`PushService.java`
# 4. 백엔드 알림 생성 시 Web Push 보내기
1. 의존성 추가
```java
    implementation 'nl.martijndwars:web-push:5.1.1'      // 버전은 최신으로 맞춰도 됨
    implementation 'org.bouncycastle:bcprov-jdk15on:1.70' // ECDSA 암호화용
```
2. VAPID 키 설정
`public_key`, `secret_key`, `subject`
3. 리포지토리 추가
`PushSubscriptionRepository.java`
4. WebPushService 구현
> 실제로 HTTP 푸시를 쏘는 서비스
`WebPushService.java`
5. 기존 알림 로직에 WebPushService 끼워넣기

