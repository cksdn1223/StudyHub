package com.project.studyhub.dto.websocket;

public record ChatMessageResponse(
        String content,
        String senderNickname,
        String time
) {
}