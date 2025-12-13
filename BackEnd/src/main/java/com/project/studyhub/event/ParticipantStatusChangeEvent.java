package com.project.studyhub.event;

import com.project.studyhub.entity.Study;
import com.project.studyhub.entity.User;
import com.project.studyhub.enums.NotificationType;

public record ParticipantStatusChangeEvent(
        Study study,
        User receiver,
        User sender,
        NotificationType notificationType) {
}