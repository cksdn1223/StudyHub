package com.project.studyhub.dto.websocket;

public record ChatMessageRequest(
        Long studyId,
        Long senderId,
        String content
) {
}
