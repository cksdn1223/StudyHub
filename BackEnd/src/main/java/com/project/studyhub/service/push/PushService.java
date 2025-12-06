package com.project.studyhub.service.push;

import com.project.studyhub.dto.pushSubscription.PushSubscribeRequest;
import com.project.studyhub.entity.PushSubscription;
import com.project.studyhub.entity.User;
import com.project.studyhub.repository.PushSubscriptionRepository;
import com.project.studyhub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.security.Principal;

@Service
@RequiredArgsConstructor
public class PushService {
    private final UserRepository userRepository;
    private final PushSubscriptionRepository pushSubscriptionRepository;

    public void subscribe(PushSubscribeRequest req, Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new UsernameNotFoundException("유저를 찾을 수 없습니다."));

        // 기존 endpoint 있으면 업데이트 / 없으면 생성
        PushSubscription sub = pushSubscriptionRepository
                .findByUserAndEndpoint(user, req.endpoint())
                .orElseGet(() -> new PushSubscription(user, req.endpoint(), req.keys().p256dh(), req.keys().auth()));
        sub.update(req.endpoint(), req.keys().p256dh(), req.keys().auth());
        pushSubscriptionRepository.save(sub);
    }
}
