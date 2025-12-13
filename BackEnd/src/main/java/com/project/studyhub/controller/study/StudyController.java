package com.project.studyhub.controller.study;

import com.project.studyhub.dto.study.MyStudyResponse;
import com.project.studyhub.dto.study.StudyCreateRequest;
import com.project.studyhub.dto.study.StudyDistanceResponse;
import com.project.studyhub.service.study.StudyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<Void> createStudy(@RequestBody StudyCreateRequest studyCreateRequest, Principal principal) {
        studyService.createStudy(studyCreateRequest, principal);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<StudyDistanceResponse>> getAllStudy(Principal principal) {
        return ResponseEntity.ok(studyService.getAllStudy(principal));
    }

    @GetMapping("/me")
    public ResponseEntity<List<MyStudyResponse>> getJoinStudy(Principal principal) {
        return ResponseEntity.ok(studyService.getJoinStudy(principal));
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
