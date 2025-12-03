package com.project.studyhub.config;

import com.project.studyhub.entity.User;
import com.project.studyhub.repository.UserRepository;
import com.project.studyhub.service.chat.ChatPresenceService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.stereotype.Component;

import java.security.Principal;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
@RequiredArgsConstructor
public class StompPresenceInterceptor implements ChannelInterceptor {
    private final ChatPresenceService chatPresenceService;
    private final UserRepository userRepository;

    private final Map<String, Long> sessionStudyMap = new ConcurrentHashMap<>();

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor =
                MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
        if(accessor == null) return message;

        StompCommand command = accessor.getCommand();
        String sessionId = accessor.getSessionId();
        Principal principal = accessor.getUser();

        if(principal == null) return message;

        User user = userRepository.findByEmail(principal.getName())
                .orElse(null);
        if (user == null) return message;

        if(StompCommand.SUBSCRIBE.equals(command)){
            String destination = accessor.getDestination(); // /sub/message/{studyId}

            if(destination != null && destination.startsWith("/sub/message/")) {
                String idPart = destination.substring("/sub/message/".length());
                try {
                    Long studyId = Long.parseLong(idPart);

                    chatPresenceService.enterRoom(studyId, user.getUserId());
                    sessionStudyMap.put(sessionId, studyId);
                } catch (NumberFormatException e) {
                    // 예외처리
                }
            }
        } else if (StompCommand.DISCONNECT.equals(command)) {
            Long studyId = sessionStudyMap.remove(sessionId);
            if(studyId != null) {
                chatPresenceService.leaveRoom(studyId, user.getUserId());
            }
        }
        return message;
    }
}
