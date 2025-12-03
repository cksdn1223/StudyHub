package com.project.studyhub.controller.studyParticipant;

import com.project.studyhub.service.studyParticipant.StudyParticipantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequiredArgsConstructor
@RequestMapping("/participant")
public class StudyParticipantController {
    private final StudyParticipantService participantService;

    @PostMapping("/{studyId}")
    public ResponseEntity<Void> createParticipant(
            @PathVariable Long studyId,
            Principal principal) {
        participantService.createParticipant(studyId, principal);
        return ResponseEntity.ok().build();
    }
}
