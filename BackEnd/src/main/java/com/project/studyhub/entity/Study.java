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

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(nullable = false)
    private Integer maxMembers;

    @Column(nullable = false)
    private Integer currentMembers;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private StudyStatus status;

    @Column(length = 100)
    private String locationName;

    @Column(columnDefinition = "GEOMETRY(Point, 4326)")
    private Point geom;

    @CreationTimestamp
    @Column(updatable = false, nullable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "study", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<StudyTag> studyTags = new ArrayList<>();

    public Study(User leader, String title, String content, Integer maxMembers, Integer currentMembers, String locationName, Point geom) {
        this.leader = leader;
        this.title = title;
        this.content = content;
        this.maxMembers = maxMembers;
        this.currentMembers = currentMembers;
        this.status = StudyStatus.RECRUITING;
        this.locationName = locationName;
        this.geom = geom;
    }

    //== 연관관계 편의 메서드 ==//
    public void addStudyTag(Tag tag) {
        StudyTag studyTag = StudyTag.createStudyTag(this, tag);
        this.studyTags.add(studyTag);
    }
}
