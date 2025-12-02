package com.project.studyhub.repository;

import com.project.studyhub.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findAllByStudy_IdOrderBySentAtAsc(Long studyId);
}