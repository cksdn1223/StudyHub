package com.project.studyhub.controller.notification;

import com.project.studyhub.dto.notification.NotificationResponse;
import com.project.studyhub.service.notification.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;

    @GetMapping("/notification")
    public ResponseEntity<List<NotificationResponse>> getNotification(Principal principal) {
        return ResponseEntity.ok(notificationService.getNotification(principal));
    }
}
