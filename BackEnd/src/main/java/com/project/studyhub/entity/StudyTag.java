package com.project.studyhub.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * Study와 Tag의 다대다 관계를 위한 중간 테이블 엔티티.
 */
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "study_tag",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "study_tag_unique",
            columnNames = {"study_id", "tag_id"}
        )
    }
)
public class StudyTag {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "study_id")
    private Study study;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tag_id")
    private Tag tag;

    //== 생성 메서드 ==//
    public static StudyTag createStudyTag(Study study, Tag tag) {
        StudyTag studyTag = new StudyTag();
        studyTag.study = study;
        studyTag.tag = tag;
        return studyTag;
    }
}