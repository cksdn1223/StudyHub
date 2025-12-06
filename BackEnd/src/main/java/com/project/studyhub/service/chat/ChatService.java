package com.project.studyhub.service.chat;

import com.project.studyhub.dto.chat.ChatMessageRequest;
import com.project.studyhub.dto.chat.ChatMessageResponse;
import com.project.studyhub.dto.notification.NotificationResponse;
import com.project.studyhub.dto.pushSubscription.WebPushPayload;
import com.project.studyhub.entity.*;
import com.project.studyhub.enums.NotificationType;
import com.project.studyhub.enums.ParticipantStatus;
import com.project.studyhub.exception.ResourceNotFoundException;
import com.project.studyhub.repository.ChatMessageRepository;
import com.project.studyhub.repository.NotificationRepository;
import com.project.studyhub.repository.StudyRepository;
import com.project.studyhub.repository.UserRepository;
import com.project.studyhub.service.push.WebPushService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class ChatService {
    private final SimpMessagingTemplate messagingTemplate;
    private final ChatMessageRepository chatMessageRepository;
    private final StudyRepository studyRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;
    private final ChatPresenceService chatPresenceService;
    private final WebPushService webPushService;

    @Transactional
    public void handleChatMessage(Long studyId, ChatMessageRequest request) {
        Study study = studyRepository.findById(studyId)
                .orElseThrow(() -> new ResourceNotFoundException("해당 스터디를 찾을 수 없습니다."));
        User sender = userRepository.findById(request.userId())
                .orElseThrow(() -> new UsernameNotFoundException("해당 유저를 찾을 수 없습니다."));

        ChatMessage chatMessage = new ChatMessage(study, sender, request.content());
        chatMessageRepository.save(chatMessage);
        ChatMessageResponse send = ChatMessageResponse.from(chatMessage);

        Stream.concat(
                        // 1) 리더
                        Stream.of(study.getLeader()),
                        // 2) ACCEPTED 멤버들
                        study.getParticipants().stream()
                                .filter(sp -> sp.getStatus() == ParticipantStatus.ACCEPTED)
                                .map(StudyParticipant::getUser)
                )
                .distinct()
                .filter(receiver -> !receiver.getUserId().equals(sender.getUserId())) // 본인 제외
                .filter(receiver -> !chatPresenceService.isInRoom(studyId, receiver.getUserId())) // 방 안 제외
                .filter(receiver -> shouldNotify(receiver, study)) // 3분 쿨타임
                .forEach(receiver -> {
                    String title = study.getTitle();
                    String preview = title.length() > 5 ? title.substring(0, 5) + "..." : title;
                    String message = "[" + preview + "]에 새 채팅 메시지가 도착했습니다.";
                    Notification notification = new Notification(study, receiver, sender, message, NotificationType.MESSAGE);
                    notificationRepository.save(notification);
                    messagingTemplate.convertAndSend(
                            "/sub/notification/" + receiver.getUserId(),
                            NotificationResponse.from(notification));
                    // WebPush 부분
                    webPushService.sendToUser(
                            receiver,
                            new WebPushPayload(
                                    "새 채팅 알림",
                                    message,
                                    "/chat"
                            )
                    );
                });

        messagingTemplate.convertAndSend("/sub/message/" + studyId, send);
    }

    public List<ChatMessageResponse> getStudyChat(Long studyId) {
        return chatMessageRepository.findAllByStudy_IdOrderBySentAtAsc(studyId)
                .stream()
                .map(ChatMessageResponse::from)
                .toList();
    }

//    헬퍼 메서드
    private boolean shouldNotify(User receiver, Study study) {
        LocalDateTime threshold = LocalDateTime.now().minusMinutes(3); //3분 쿨타임
        return !notificationRepository.existsByReceiverAndStudyAndTypeAndCreatedAtAfter(
                receiver,
                study,
                NotificationType.MESSAGE,
                threshold
        );
    }
}
