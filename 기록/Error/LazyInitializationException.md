# Hibernate LazyInitializationException 정리  
> failed to lazily initialize a collection of role … could not initialize proxy – no Session

---

## 1. 오류 내용

**로그 전문 (핵심 부분)**

```text
org.hibernate.LazyInitializationException: failed to lazily initialize a collection of role:
com.project.studyhub.entity.Study.participants: could not initialize proxy - no Session
    ...
    at com.project.studyhub.service.chat.ChatService.handleChatMessage(ChatService.java:46)
    at com.project.studyhub.controller.chat.ChatController.sendMassage(ChatController.java:27)
````

**의미**
Hibernate가 `Study.participants` 처럼 `LAZY`로 설정된 컬렉션을 **초기화하려고 했는데**,
이미 DB 세션(영속성 컨텍스트, Session)이 **닫혀 있어서** 데이터를 불러올 수 없을 때 발생하는 예외.

---

## 2. 현재 상황 정리

문제가 난 메서드:

```java
public void handleChatMessage(Long studyId, ChatMessageRequest request) {
    Study study = studyRepository.findById(studyId)
            .orElseThrow(() -> new ResourceNotFoundException("해당 스터디를 찾을 수 없습니다."));
    User sender = userRepository.findById(request.userId())
            .orElseThrow(() -> new UsernameNotFoundException("해당 유저를 찾을 수 없습니다."));

    ChatMessage chatMessage = new ChatMessage(study, sender, request.content());
    chatMessageRepository.save(chatMessage);
    ChatMessageResponse send = ChatMessageResponse.from(chatMessage);

    // 🔥 여기에서 LazyInitializationException 발생
    study.getParticipants().stream()
            .map(StudyParticipant::getUser)
            .filter(receiver -> !receiver.getUserId().equals(sender.getUserId()))
            .filter(receiver -> !chatPresenceService.isInRoom(studyId, receiver.getUserId()))
            .filter(receiver -> shouldNotify(receiver, study))
            .forEach(receiver -> {
                String title = study.getTitle();
                String preview = title.length() > 5 ? title.substring(0, 5) + "..." : title;
                String message = "[" + preview + "]에 새 채팅 메시지가 도착했습니다.";
                Notification notification = new Notification(study, receiver, sender, message, NotificationType.MESSAGE);
                notificationRepository.save(notification);
                messagingTemplate.convertAndSendToUser(
                        receiver.getEmail(),
                        "/sub/notification",
                        NotificationResponse.from(notification));
            });

    messagingTemplate.convertAndSend("/sub/message/" + studyId, send);
}
```

`Study.participants` 는 대부분 이렇게 되어 있을 가능성이 높음:

```java
@OneToMany(mappedBy = "study", fetch = FetchType.LAZY)
private List<StudyParticipant> participants;
```

---

## 3. 발생 원인

1. **`Study.participants` 가 LAZY 로딩 컬렉션**

   * DB에서 Study를 가져올 때, `participants` 는 바로 안 가져오고 “프록시”만 들고 있음.
   * 실제 `participants` 에 접근하는 시점에 쿼리를 날려서 데이터를 불러옴.

2. **그런데, WebSocket 핸들러에서 트랜잭션이 열려 있지 않음**

   * `handleChatMessage` 메서드에 `@Transactional` 이 없으면,

     * `studyRepository.findById()` 에서 한 번 세션/트랜잭션 열렸다가
     * 리턴 이후 바로 세션이 닫히고,
     * 그 뒤에 `study.getParticipants()` 를 읽으려고 하면
       → 이미 세션이 없어서 DB를 못 치고, Lazy 초기화 실패.

3. **HTTP 요청과 달리 @WebSocket 은 OpenSessionInView 보호가 없음**

   * 보통 REST 컨트롤러에서는 `spring.jpa.open-in-view=true` 설정 덕분에
     컨트롤러까지 세션이 살아 있어서 이런 에러가 잘 안 터짐.
   * WebSocket 메시지 핸들러는 이 보호막 없이,
     **서비스 메서드가 알아서 트랜잭션을 관리해줘야 함.**

---

## 4. 문제 해결 방법

### ✅ 해결 방법 1: `handleChatMessage`에 `@Transactional` 추가 (가장 간단 & 추천)

**핵심 아이디어**

* `Study` 조회, `participants` 접근, `ChatMessage`/`Notification` 저장을
  **전부 하나의 트랜잭션/세션 안에서 처리**하게 만들기.

```java
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final StudyRepository studyRepository;
    private final UserRepository userRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final ChatPresenceService chatPresenceService;

    @Transactional  // 🔴 추가
    public void handleChatMessage(Long studyId, ChatMessageRequest request) {
        Study study = studyRepository.findById(studyId)
                .orElseThrow(() -> new ResourceNotFoundException("해당 스터디를 찾을 수 없습니다."));
        User sender = userRepository.findById(request.userId())
                .orElseThrow(() -> new UsernameNotFoundException("해당 유저를 찾을 수 없습니다."));

        ChatMessage chatMessage = new ChatMessage(study, sender, request.content());
        chatMessageRepository.save(chatMessage);
        ChatMessageResponse send = ChatMessageResponse.from(chatMessage);

        // 같은 트랜잭션 안이라 Lazy 컬렉션 초기화 가능
        study.getParticipants().stream()
                .map(StudyParticipant::getUser)
                .filter(receiver -> !receiver.getUserId().equals(sender.getUserId()))
                .filter(receiver -> !chatPresenceService.isInRoom(studyId, receiver.getUserId()))
                .filter(receiver -> shouldNotify(receiver, study))
                .forEach(receiver -> {
                    String title = study.getTitle();
                    String preview = title.length() > 5 ? title.substring(0, 5) + "..." : title;
                    String message = "[" + preview + "]에 새 채팅 메시지가 도착했습니다.";
                    Notification notification = new Notification(study, receiver, sender, message, NotificationType.MESSAGE);
                    notificationRepository.save(notification);
                    messagingTemplate.convertAndSendToUser(
                            receiver.getEmail(),
                            "/sub/notification",
                            NotificationResponse.from(notification));
                });

        messagingTemplate.convertAndSend("/sub/message/" + studyId, send);
    }
}
```

또는 클래스에 한 번에:

```java
@Service
@RequiredArgsConstructor
@Transactional  // 클래스 단위로 적용
public class ChatService {
    ...
}
```
---

## 5. 이 오류가 프론트(WebSocket) 쪽에 준 영향

* `handleChatMessage` 안에서 예외가 발생하면서,

  * 아래 코드까지 도달하지 못함:

    ```java
    messagingTemplate.convertAndSend("/sub/message/" + studyId, send);
    ```

* 결과적으로 클라이언트의 구독 콜백이 한 번도 호출되지 않음:

  ```ts
  client.subscribe(`/sub/message/${selectedStudyId}`, (message) => {
    const newMessage: ChatMessage = JSON.parse(message.body);
    console.log("갱신됨"); // ❌ 여기까지 안 옴

    queryClient.setQueryData(
      ["chatList", selectedStudyId],
      (old) => (old ? [...old, newMessage] : [newMessage])
    );
  });
  ```

* 즉, **WebSocket 구독/경로가 문제가 아니라**,
  **서버에서 예외가 터져서 메시지를 브로드캐스트하지 못했던 것**이 원인.

---

## 6. 최종 정리

* **오류명**: `LazyInitializationException`
* **발생 이유**:

  * LAZY 컬렉션(`Study.participants`)에 접근하는 시점에
    이미 Hibernate 세션/트랜잭션이 닫혀 있었음.
  * WebSocket 핸들러에서 서비스 메서드에 `@Transactional`이 없어서 트랜잭션이 유지되지 않았기 때문.
* **해결 방법**:
 `ChatService.handleChatMessage` (또는 서비스 전체)에 `@Transactional` 추가 ✅
