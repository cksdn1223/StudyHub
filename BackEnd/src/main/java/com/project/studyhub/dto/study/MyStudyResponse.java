package com.project.studyhub.dto.study;

import com.project.studyhub.enums.StudyStatus;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class MyStudyResponse {
    private Long studyId;
    private String title;
    private String studyImageUrl;
    private String description;
    private Integer maxMembers;
    private Integer memberCount;
    private String frequency;
    private String duration;
    private String address;
    private String detailAddress;
    private String detailLocation;
    private StudyStatus status;

    private List<StudyMemberDto> members;
}