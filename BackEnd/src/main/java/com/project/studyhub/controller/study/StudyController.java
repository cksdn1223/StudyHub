package com.project.studyhub.controller.study;

import com.project.studyhub.dto.study.MyStudyResponse;
import com.project.studyhub.dto.study.StudyCreateRequest;
import com.project.studyhub.dto.study.StudyDistanceResponse;
import com.project.studyhub.entity.User;
import com.project.studyhub.service.study.StudyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/study")
public class StudyController {
    private final StudyService studyService;

    @PostMapping
    public ResponseEntity<Void> createStudy(
            @RequestBody StudyCreateRequest studyCreateRequest,
            @AuthenticationPrincipal User user) {
        studyService.createStudy(studyCreateRequest, user);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<StudyDistanceResponse>> getAllStudy(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(studyService.getAllStudy(user));
    }

    @GetMapping("/me")
    public ResponseEntity<List<MyStudyResponse>> getJoinStudy(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(studyService.getJoinStudy(user));
    }

    @PatchMapping("/{studyId}/study-image")
    public ResponseEntity<Void> changeStudyImage(
            @PathVariable Long studyId,
            @RequestParam("file") MultipartFile file,
            Principal principal
    ){
        studyService.changeStudyImage(studyId, file, principal);
        return ResponseEntity.noContent().build();
    }
}
