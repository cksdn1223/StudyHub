package com.project.studyhub.dto.notification;

import com.project.studyhub.entity.Notification;
import com.project.studyhub.enums.NotificationType;

import java.time.LocalDateTime;

public record NotificationResponse(
        Long id,
        String message,
        boolean isRead,
        NotificationType type,
        Long studyId,
        String studyTitle,
        Long senderId,
        String senderNickname,
        LocalDateTime createdAt
) {
    public static NotificationResponse from(Notification notification) {
        return new NotificationResponse(
                notification.getId(),
                notification.getMessage(),
                notification.isRead(),
                notification.getType(),
                notification.getStudy() != null ? notification.getStudy().getId() : null,
                notification.getStudy() != null ? notification.getStudy().getTitle() : null,
                notification.getSender().getUserId(),
                notification.getSender().getNickname(),
                notification.getCreatedAt()
        );
    }
}