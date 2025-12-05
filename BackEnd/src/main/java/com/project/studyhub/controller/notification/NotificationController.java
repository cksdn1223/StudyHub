package com.project.studyhub.controller.notification;

import com.project.studyhub.dto.notification.NotificationResponse;
import com.project.studyhub.service.notification.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;

    @GetMapping("/notifications")
    public ResponseEntity<List<NotificationResponse>> getNotification(Principal principal) {
        return ResponseEntity.ok(notificationService.getNotification(principal));
    }

    @PutMapping("/notifications/{notificationId}")
    public ResponseEntity<Void> readNotification(
            @PathVariable Long notificationId) {
        notificationService.readNotification(notificationId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/notifications")
    public ResponseEntity<Void> readAllNotification(Principal principal) {
        notificationService.readAllNotification(principal);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/notifications/{notificationId}")
    public ResponseEntity<Void> deleteNotification(
            @PathVariable Long notificationId) {
        notificationService.deleteNotification(notificationId);
        return ResponseEntity.ok().build();
    }


}
