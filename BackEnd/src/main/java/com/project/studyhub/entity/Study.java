package com.project.studyhub.entity;

import com.project.studyhub.enums.StudyStatus;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.locationtech.jts.geom.Point;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Study {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "leader_id")
    private User leader;

    @Column(length = 100, nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = true)
    private String description;

    @Column(nullable = false)
    private Integer maxMembers;

    @Column(nullable = false)
    private Integer memberCount;
    @Column(nullable = false)
    private String frequency;
    @Column(nullable = false)
    private String duration;
    @Column(nullable = false)
    private String address;
    private String detailAddress;
    // 진행방식 (온라인, 오프라인, 온/오프라인 병행)
    @Column(nullable = false)
    private String detailLocation;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private StudyStatus status;

    @Column(columnDefinition = "GEOMETRY(Point, 4326)")
    // double longitude / double latitude 경도,위도 순서대로 저장
    private Point geom;

    @CreationTimestamp
    @Column(updatable = false, nullable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "study", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<StudyTag> studyTags = new ArrayList<>();
    @OneToMany(mappedBy = "study", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<StudyParticipant> participants = new ArrayList<>();

    public Study(String title, String description, Integer maxMembers, Integer memberCount, String frequency, String duration, String address, String detailAddress, String detailLocation, Point geom, User leader) {
        this.title = title;
        this.description = description;
        this.maxMembers = maxMembers;
        this.memberCount = memberCount;
        this.frequency = frequency;
        this.duration = duration;
        this.address = address;
        this.detailAddress = detailAddress;
        this.detailLocation = detailLocation;
        this.geom = geom;
        this.leader = leader;
        this.status = StudyStatus.RECRUITING;
    }

    //== 연관관계 편의 메서드 ==//
    public void addStudyTag(Tag tag) {
        StudyTag studyTag = StudyTag.createStudyTag(this, tag);
        this.studyTags.add(studyTag);
    }
}
