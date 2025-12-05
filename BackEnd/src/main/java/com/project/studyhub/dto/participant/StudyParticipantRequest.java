package com.project.studyhub.dto.participant;

import com.project.studyhub.enums.ParticipantStatus;

public record StudyParticipantRequest(
        Long userId,
        ParticipantStatus status
) {
}
