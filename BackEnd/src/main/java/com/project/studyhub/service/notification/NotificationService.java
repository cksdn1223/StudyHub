package com.project.studyhub.service.notification;

import com.project.studyhub.dto.notification.NotificationResponse;
import com.project.studyhub.dto.pushSubscription.WebPushPayload;
import com.project.studyhub.entity.Notification;
import com.project.studyhub.entity.Study;
import com.project.studyhub.entity.User;
import com.project.studyhub.enums.NotificationType;
import com.project.studyhub.exception.ResourceNotFoundException;
import com.project.studyhub.repository.NotificationRepository;
import com.project.studyhub.repository.UserRepository;
import com.project.studyhub.service.push.WebPushService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final WebPushService webPushService;

    public List<NotificationResponse> getNotification(Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(()-> new UsernameNotFoundException("해당 유저를 찾을 수 없습니다."));
        List<Notification> notificationList = notificationRepository.findByReceiver_UserId(user.getUserId());
        if(notificationList.isEmpty()) return new ArrayList<>();
        return notificationList.stream()
                .map(NotificationResponse::from)
                .toList();
    }

    @Transactional
    public void readNotification(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(()-> new ResourceNotFoundException("해당 알림을 찾을 수 없습니다."));
        notification.markAsRead();
    }
    @Transactional
    public void readAllNotification(Principal principal) {
        User receiver = userRepository.findByEmail(principal.getName())
                .orElseThrow(()-> new UsernameNotFoundException("해당 유저를 찾을 수 없습니다."));
        List<Notification> notification = notificationRepository.findByReceiver_UserId(receiver.getUserId());
        notification.stream().filter(noti-> !noti.isRead()).forEach(Notification::markAsRead);
    }
    @Transactional
    public void deleteNotification(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(()->new ResourceNotFoundException("해당 알림을 찾을 수 없습니다. "));
        notificationRepository.delete(notification);
    }


    @Transactional
    public void sendNotification(Study study, User receiver, User sender, NotificationType type) {
        // 준영속 상태의 sender를 현재 세션에 다시 연결하기 위해 DB에서 조회합니다.
        User persistentSender = userRepository.findById(sender.getUserId())
                .orElseThrow(() -> new UsernameNotFoundException("Sender not found with id: " + sender.getUserId()));
        String message = createMessage(study.getTitle(), type);
        Notification notification = new Notification(study, receiver, persistentSender, message, type);
        notificationRepository.save(notification);

        // WebSocket으로 실시간 알림 전송
        messagingTemplate.convertAndSend(
                "/sub/notification/" + receiver.getUserId(),
                NotificationResponse.from(notification)
        );

        // WebPush 전송 (가입 요청은 제외)
        if (type != NotificationType.JOIN_REQUEST) {
            WebPushPayload payload = createWebPushPayload(study.getTitle(), type);
            webPushService.sendToUser(receiver, payload);
        }
    }

    private String createMessage(String studyTitle, NotificationType type) {
        return switch (type) {
            case JOIN_REQUEST -> String.format("가입 요청을 보냈습니다. [%s]", studyTitle);
            case REQUEST_ACCEPTED -> String.format("[%s] 스터디 가입 요청이 수락되었습니다.", studyTitle);
            case REQUEST_REJECTED -> String.format("[%s] 스터디 가입 요청이 거절되었습니다.", studyTitle);
            case BAN -> String.format("[%s] 스터디에서 강퇴되었습니다.", studyTitle);
            default -> "새로운 알림이 도착했습니다.";
        };
    }

    private WebPushPayload createWebPushPayload(String studyTitle, NotificationType type) {
        String title = switch (type) {
            case REQUEST_ACCEPTED -> String.format("[%s] 스터디 가입 승인", studyTitle);
            case REQUEST_REJECTED -> String.format("[%s] 스터디 거절", studyTitle);
            case BAN -> String.format("[%s] 스터디 강퇴", studyTitle);
            default -> "StudyHub 알림";
        };
        String body = createMessage(studyTitle, type);
        return new WebPushPayload(title, body, "/");
    }
}