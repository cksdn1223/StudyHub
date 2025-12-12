package com.project.studyhub.dto.chat;

import com.project.studyhub.entity.ChatMessage;

import java.time.LocalDateTime;

public record ChatMessageResponse(
        Long senderId,
        String senderNickname,
        String senderImageUrl,
        String content,
        LocalDateTime sentAt
) {
    public static ChatMessageResponse from(ChatMessage m) {
        return new ChatMessageResponse(
                m.getSender().getUserId(),
                m.getSender().getNickname(),
                m.getSender().getProfileImageUrl(),
                m.getContent(),
                m.getSentAt()
        );
    }
}
