package com.project.studyhub.dto.study;

import java.time.LocalDateTime;
import java.util.List;

public record StudyDistanceResponse(
        Long id,
        Long leaderId,
        String studyImageUrl,
        String profileImageUrl,
        String title,
        String description,
        Integer maxMembers,
        Integer memberCount,
        String frequency,
        String duration,
        String address,
        String detailAddress,
        String status,
        LocalDateTime createdAt,
        String detailLocation,
        double distanceKm,
        List<String> tags
) {
}
