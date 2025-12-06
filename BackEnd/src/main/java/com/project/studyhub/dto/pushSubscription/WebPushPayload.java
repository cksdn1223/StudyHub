package com.project.studyhub.dto.pushSubscription;

public record WebPushPayload(
        String title,
        String message,
        String url
) {}