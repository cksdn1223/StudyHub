package com.project.studyhub.controller.websocket;

import com.project.studyhub.dto.chat.ChatMessageRequest;
import com.project.studyhub.dto.chat.ChatMessageResponse;
import com.project.studyhub.service.websocket.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
public class ChatController {
    private final ChatService chatService;

    @MessageMapping("/message/{studyId}")
    public void sendMassage(
            @DestinationVariable Long studyId,
            @Payload ChatMessageRequest request,
            Principal principal
    ){
        log.info("studyId = {}, msg = {}", studyId, request);
        chatService.handleChatMessage(studyId, request);
    }

    @GetMapping("/study/{studyId}/messages")
    public ResponseEntity<List<ChatMessageResponse>> getStudyChat(
            @PathVariable Long studyId) {
        return ResponseEntity.ok(chatService.getStudyChat(studyId));
    }
}

