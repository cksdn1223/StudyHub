package com.project.studyhub.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Web Push 구독 정보를 저장하는 엔티티.
 */
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PushSubscription {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "subscription_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(length = 512, nullable = false)
    private String endpoint;

    @Column(name = "p256dh_key", nullable = false)
    private String p256dh;

    @Column(name = "auth_key", nullable = false)
    private String auth;

    @CreationTimestamp
    @Column(updatable = false, nullable = false)
    private LocalDateTime createdAt;

    public PushSubscription(User user, String endpoint, String p256dh, String auth) {
        this.user = user;
        this.endpoint = endpoint;
        this.p256dh = p256dh;
        this.auth = auth;
    }

    public void update(String endpoint, String p256dh, String auth) {
        this.endpoint = endpoint;
        this.p256dh = p256dh;
        this.auth = auth;
    }
}