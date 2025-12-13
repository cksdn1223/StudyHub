package com.project.studyhub.event;

import com.project.studyhub.entity.Study;
import com.project.studyhub.entity.User;
import com.project.studyhub.enums.NotificationType;
import lombok.Getter;

@Getter
public class ParticipantStatusChangeEvent {
    private final Study study;
    private final User receiver;
    private final NotificationType notificationType;

    public ParticipantStatusChangeEvent(Study study, User receiver, NotificationType notificationType) {
        this.study = study;
        this.receiver = receiver;
        this.notificationType = notificationType;
    }
}