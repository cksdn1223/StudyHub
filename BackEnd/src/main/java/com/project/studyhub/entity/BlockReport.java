package com.project.studyhub.entity;

import com.project.studyhub.enums.ReportStatus;
import com.project.studyhub.enums.ReportType;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * 사용자 신고 및 차단 내역을 관리하는 엔티티.
 */
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "block_report")
public class BlockReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "report_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "reporter_id")
    private User reporter;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "target_id")
    private User target;

    @Enumerated(EnumType.STRING)
    @Column(length = 50, nullable = false)
    private ReportType reportType;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private ReportStatus status;

    @CreationTimestamp
    @Column(updatable = false, nullable = false)
    private LocalDateTime reportedAt;
}