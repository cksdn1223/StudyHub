package com.project.studyhub.service.chat;

import com.project.studyhub.dto.chat.ChatMessageRequest;
import com.project.studyhub.dto.chat.ChatMessageResponse;
import com.project.studyhub.entity.*;
import com.project.studyhub.enums.NotificationType;
import com.project.studyhub.exception.ResourceNotFoundException;
import com.project.studyhub.repository.ChatMessageRepository;
import com.project.studyhub.repository.NotificationRepository;
import com.project.studyhub.repository.StudyRepository;
import com.project.studyhub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {
    private final SimpMessagingTemplate messagingTemplate;
    private final ChatMessageRepository chatMessageRepository;
    private final StudyRepository studyRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;
    private final ChatPresenceService chatPresenceService;

    public void handleChatMessage(Long studyId, ChatMessageRequest request) {
        Study study = studyRepository.findById(studyId)
                .orElseThrow(() -> new ResourceNotFoundException("해당 스터디를 찾을 수 없습니다."));
        User sender = userRepository.findById(request.userId())
                .orElseThrow(() -> new UsernameNotFoundException("해당 유저를 찾을 수 없습니다."));

        ChatMessage chatMessage = new ChatMessage(study, sender, request.content());
        chatMessageRepository.save(chatMessage);
        ChatMessageResponse send = ChatMessageResponse.from(chatMessage);

        study.getParticipants().stream()
                .map(StudyParticipant::getUser)
                .filter(receiver -> !receiver.getUserId().equals(sender.getUserId())) // 본인 제외
                .filter(receiver -> !chatPresenceService.isInRoom(studyId, receiver.getUserId())) // 방 안 제외
                .filter(receiver -> shouldNotify(receiver, study)) // 3분 쿨타임
                .forEach(receiver -> {
                    String title = study.getTitle();
                    String preview = title.length() > 5 ? title.substring(0, 5) + "..." : title;
                    String message = "[" + preview + "]에 새 채팅 메시지가 도착했습니다.";
                    notificationRepository.save(
                            new Notification(study, receiver, sender, message, NotificationType.MESSAGE)
                    );
//                    messagingTemplate.convertAndSend("/sub/notification");
//                    알람 쪽으로 보내는거 아직안햇음
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
