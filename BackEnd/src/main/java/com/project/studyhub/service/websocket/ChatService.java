package com.project.studyhub.service.websocket;

import com.project.studyhub.dto.websocket.ChatMessageRequest;
import com.project.studyhub.entity.ChatMessage;
import com.project.studyhub.entity.Study;
import com.project.studyhub.entity.User;
import com.project.studyhub.exception.ResourceNotFoundException;
import com.project.studyhub.repository.ChatMessageRepository;
import com.project.studyhub.repository.StudyRepository;
import com.project.studyhub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class ChatService {
    private final SimpMessagingTemplate messagingTemplate;
    private final ChatMessageRepository chatMessageRepository;
    private final StudyRepository studyRepository;
    private final UserRepository userRepository;

    public void handleChatMessage(ChatMessageRequest request) {
        Study study = studyRepository.findById(request.studyId())
                .orElseThrow(() -> new ResourceNotFoundException("해당 스터디를 찾을 수 없습니다."));
        User sender = userRepository.findById(request.senderId())
                .orElseThrow(() -> new UsernameNotFoundException("해당 유저를 찾을 수 없습니다."));
        ChatMessage chatMessage = new ChatMessage(study, sender, request.content());
        chatMessageRepository.save(chatMessage);

//        ChatMessageRequest response = new ChatMessageRequest(
//                sender.getNickname(),
//                request.content(),
//                LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))
//        );
//
//        String destination = "/sub/chat/" + request.studyId();
//        messagingTemplate.convertAndSend(destination, response);
    }
}
