package com.project.studyhub.service.notification;

import com.project.studyhub.dto.notification.NotificationResponse;
import com.project.studyhub.entity.Notification;
import com.project.studyhub.entity.User;
import com.project.studyhub.exception.ResourceNotFoundException;
import com.project.studyhub.repository.NotificationRepository;
import com.project.studyhub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public List<NotificationResponse> getNotification(Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                        .orElseThrow(()-> new UsernameNotFoundException("해당 유저를 찾을 수 없습니다."));
        List<Notification> notificationList = notificationRepository.findByReceiver_UserId(user.getUserId());
        if(notificationList.isEmpty()) return new ArrayList<>();
        return notificationList.stream()
                .map(NotificationResponse::from)
                .toList();
    }

    @Transactional
    public void readNotification(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(()-> new ResourceNotFoundException("해당 알림을 찾을 수 없습니다."));
        notification.markAsRead();
    }

    public void readAllNotification(Principal principal) {
        User receiver = userRepository.findByEmail(principal.getName())
                .orElseThrow(()-> new UsernameNotFoundException("해당 유저를 찾을 수 없습니다."));
        List<Notification> notification = notificationRepository.findByReceiver_UserId(receiver.getUserId());
        notification.stream().filter(noti-> !noti.isRead()).forEach(Notification::markAsRead);
    }

    public void deleteNotification(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(()->new ResourceNotFoundException("해당 알림을 찾을 수 없습니다. "));
        notificationRepository.delete(notification);
    }
}
