package com.project.studyhub.controller.push;

import com.project.studyhub.dto.pushSubscription.PushSubscribeRequest;
import com.project.studyhub.entity.PushSubscription;
import com.project.studyhub.entity.User;
import com.project.studyhub.repository.PushSubscriptionRepository;
import com.project.studyhub.repository.UserRepository;
import com.project.studyhub.service.push.PushService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequiredArgsConstructor
@RequestMapping("/push")
public class PushController {
    private final PushService pushService;

    @PostMapping("/subscribe")
    public ResponseEntity<Void> subscribe(
            @RequestBody PushSubscribeRequest req,
            Principal principal
            ) {
        pushService.subscribe(req, principal);
        return ResponseEntity.ok().build();
    }

}
