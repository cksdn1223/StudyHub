package com.project.studyhub.dto.study;

import java.time.LocalDateTime;
import java.util.List;

public record StudyDistanceResponse(
        Long id,
        Long leaderId,
        String title,
        String description,
        Integer maxMembers,
        Integer memberCount,
        String frequency,
        String duration,
        String address,
        String status,
        LocalDateTime createdAt,
        String detailLocation,
        double distanceKm,
        List<String> tags
) {
}
