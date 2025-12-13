package com.project.studyhub.service.notification;

import com.project.studyhub.event.ParticipantStatusChangeEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class NotificationEventListener {

    private final NotificationService notificationService;

    @Async // 알림 발송을 비동기로 처리하여 기본 트랜잭션에 영향을 주지 않음
    @EventListener
    public void handleParticipantStatusChangeEvent(ParticipantStatusChangeEvent event) {
        notificationService.sendNotification(
                event.study(),
                event.receiver(),
                event.sender(),
                event.notificationType()
        );
    }
}