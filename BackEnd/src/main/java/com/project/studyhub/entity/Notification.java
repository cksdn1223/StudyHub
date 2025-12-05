package com.project.studyhub.entity;

import com.project.studyhub.enums.NotificationType;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.ColumnDefault;

import java.time.LocalDateTime;

/**
 * 사용자에게 보낼 알림 정보를 저장하는 엔티티.
 */
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "notification")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notification_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "receiver_id")
    private User receiver;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "sender_id")
    private User sender;

    @Column(nullable = false)
    private String message;

    @Column(nullable = false)
    @ColumnDefault("false")
    private boolean isRead;

    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    private NotificationType type;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "study_id")
    private Study study;

    @CreationTimestamp
    @Column(updatable = false, nullable = false)
    private LocalDateTime createdAt;

    public Notification(Study study, User receiver, User sender, String message, NotificationType type) {
        this.study = study;
        this.receiver = receiver;
        this.sender = sender;
        this.message = message;
        this.isRead = false;
        this.type = type;
    }

    public void markAsRead() {
        this.isRead = true;
    }
}