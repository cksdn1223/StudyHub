package com.project.studyhub.repository;

import com.project.studyhub.entity.Notification;
import com.project.studyhub.entity.Study;
import com.project.studyhub.entity.User;
import com.project.studyhub.enums.NotificationType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
//    이 사용자가 이 스터디에서 최근에 받은 알림이 있는지 체크하는 메서드
    boolean existsByReceiverAndStudyAndTypeAndCreatedAtAfter(
            User receiver,
            Study study,
            NotificationType type,
            LocalDateTime createdAt
    );

    List<Notification> findByReceiver_UserId(Long receiverId);
}