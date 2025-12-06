package com.project.studyhub.service.push;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.studyhub.dto.pushSubscription.WebPushPayload;
import com.project.studyhub.entity.PushSubscription;
import com.project.studyhub.entity.User;
import com.project.studyhub.repository.PushSubscriptionRepository;
import lombok.RequiredArgsConstructor;
import nl.martijndwars.webpush.Notification;
import nl.martijndwars.webpush.PushService;

import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.jose4j.lang.JoseException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.security.Security;
import java.security.spec.InvalidKeySpecException;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class WebPushService {
    private final PushSubscriptionRepository pushSubscriptionRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final PushService pushService;

    public WebPushService(
            PushSubscriptionRepository pushSubscriptionRepository,
            @Value("${vapid.public.key}") String publicKey,
            @Value("${vapid.private.key}") String privateKey,
            @Value("${vapid.subject}") String subject
    ) throws GeneralSecurityException {
        this.pushSubscriptionRepository = pushSubscriptionRepository;
        if (Security.getProvider("BC") == null) {
            Security.addProvider(new BouncyCastleProvider());
        }
        this.pushService = new PushService()
                .setPublicKey(publicKey)
                .setPrivateKey(privateKey)
                .setSubject(subject);
    }

    public void sendToUser(User user, WebPushPayload payload) {
        List<PushSubscription> subList = pushSubscriptionRepository.findAllByUser(user);
        if (subList.isEmpty()) return; // 이 유저는 푸시 구독 없음

        final String json;
        try {
            json = objectMapper.writeValueAsString(payload);
        } catch (IOException e) {
            e.printStackTrace();
            return;
        }
        subList.forEach(sub -> {
            try {
                Notification notification = new Notification(
                        sub.getEndpoint(),
                        sub.getP256dh(),
                        sub.getAuth(),
                        json.getBytes()
                );
                pushService.send(notification);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            } catch (GeneralSecurityException | IOException | JoseException | ExecutionException e) {
                e.printStackTrace();
                // TODO: 여기서 410 Gone 같은 응답이면 이 구독 삭제하는 로직 추가해도 됨
            }
        });
    }
}

