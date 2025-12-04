package com.project.studyhub.service.notification;

import com.project.studyhub.dto.notification.NotificationResponse;
import com.project.studyhub.entity.Notification;
import com.project.studyhub.entity.User;
import com.project.studyhub.repository.NotificationRepository;
import com.project.studyhub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ProblemDetail;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public List<NotificationResponse> getNotification(Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                        .orElseThrow(()-> new UsernameNotFoundException("해당 유저를 찾을 수 없습니다."));
        List<Notification> notificationList = notificationRepository.findByReceiver_Id(user.getUserId());
        return notificationList.stream()
                .map(NotificationResponse::from)
                .toList();
    }
}
