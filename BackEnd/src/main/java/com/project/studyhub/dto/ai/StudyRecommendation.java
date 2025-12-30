package com.project.studyhub.dto.ai;

import java.util.List;

public record StudyRecommendation(
        String title,          // 스터디 제목
        String description,    // 스터디 설명
        int memberCount,       // 모집 인원 (예: 6)
        String frequency,      // 진행 빈도 (예: 주 2회)
        String duration,       // 예상 기간 (예: 3개월)
        String method,         // 진행 방식 (예: 온/오프라인 병행)
        List<String> tags      // 기술 스택 태그 (예: ["Java", "Spring Boot"])
) {
}