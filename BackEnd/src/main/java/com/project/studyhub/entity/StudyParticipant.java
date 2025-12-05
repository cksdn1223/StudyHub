package com.project.studyhub.entity;

import com.project.studyhub.enums.ParticipantStatus;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 사용자의 스터디 참여 정보를 관리하는 엔티티.
 */
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "study_participant",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "study_user_unique",
            columnNames = {"study_id", "user_id"}
        )
    }
)
public class StudyParticipant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "participant_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "study_id")
    private Study study;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    @Setter
    private ParticipantStatus status;

    public StudyParticipant(Study study, User user) {
        this.study = study;
        this.user = user;
        this.status = ParticipantStatus.PENDING;
    }
}