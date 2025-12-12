package com.project.studyhub.dto.study;

import java.time.LocalDateTime;

public interface StudyDistanceProjection {
    Long getId();
    Long getLeaderId();
    String getStudyImageUrl();
    String getTitle();
    String getDescription();
    Integer getMaxMembers();
    Integer getMemberCount();
    String getFrequency();
    String getDuration();
    String getAddress();
    String getDetailAddress();
    String getStatus();
    LocalDateTime getCreatedAt();
    String getDetailLocation();
    double getDistanceKm();
}
