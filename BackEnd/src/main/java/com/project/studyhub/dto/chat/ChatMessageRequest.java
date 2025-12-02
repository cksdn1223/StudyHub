package com.project.studyhub.dto.chat;

public record ChatMessageRequest(
        Long userId,
        String content
) {
}
