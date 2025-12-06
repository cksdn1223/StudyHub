package com.project.studyhub.dto.pushSubscription;

public record PushSubscribeRequest(
        String endpoint,
        PushKeys keys
) {
    public record PushKeys(String p256dh, String auth) {}
}
