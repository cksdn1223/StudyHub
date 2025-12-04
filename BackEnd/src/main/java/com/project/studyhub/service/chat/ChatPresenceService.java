package com.project.studyhub.service.chat;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ChatPresenceService {

    private final Map<Long, Set<Long>> roomUsers = new ConcurrentHashMap<>();

    public void enterRoom(Long studyId, Long userId) {
        roomUsers
                .computeIfAbsent(studyId, id -> ConcurrentHashMap.newKeySet())
                .add(userId);
    }

    public void leaveRoom(Long studyId, Long userId) {
        Set<Long> users = roomUsers.get(studyId);
        if (users != null) {
            users.remove(userId);
            if(users.isEmpty()) {
                roomUsers.remove(studyId);
            }
        }
    }

    public boolean isInRoom(Long studyId, Long userId) {
        Set<Long> users = roomUsers.get(studyId);
        return users != null && users.contains(userId);
    }
}
