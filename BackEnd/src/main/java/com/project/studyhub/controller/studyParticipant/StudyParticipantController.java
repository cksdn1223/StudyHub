package com.project.studyhub.controller.studyParticipant;

import com.project.studyhub.dto.participant.StudyParticipantRequest;
import com.project.studyhub.entity.StudyParticipant;
import com.project.studyhub.entity.User;
import com.project.studyhub.service.studyParticipant.StudyParticipantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequiredArgsConstructor
@RequestMapping("/participant")
public class StudyParticipantController {
    private final StudyParticipantService participantService;

    @PostMapping("/{studyId}")
    public ResponseEntity<Void> createParticipant(
            @PathVariable Long studyId,
            @AuthenticationPrincipal User sender) {
        participantService.createParticipant(studyId, sender);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{studyId}")
    public ResponseEntity<Void> participantStatusChange(
            @PathVariable Long studyId,
            @RequestBody StudyParticipantRequest request) {
        participantService.participantStatusChange(studyId, request);
        return ResponseEntity.ok().build();
    }

}
