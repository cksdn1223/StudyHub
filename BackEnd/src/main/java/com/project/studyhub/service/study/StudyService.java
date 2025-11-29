package com.project.studyhub.service.study;

import com.project.studyhub.dto.study.StudyCreateRequest;
import com.project.studyhub.dto.study.StudyDistanceProjection;
import com.project.studyhub.dto.study.StudyDistanceResponse;
import com.project.studyhub.dto.study.StudyResponse;
import com.project.studyhub.entity.Study;
import com.project.studyhub.entity.Tag;
import com.project.studyhub.entity.User;
import com.project.studyhub.repository.StudyRepository;
import com.project.studyhub.repository.TagRepository;
import com.project.studyhub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudyService {
    private final StudyRepository studyRepository;
    private final UserRepository userRepository;
    private final TagRepository tagRepository;

    @Transactional
    public void createStudy(StudyCreateRequest studyCreateRequest, Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new UsernameNotFoundException("해당 유저를 찾을 수 없습니다."));
        Study study = StudyCreateRequest.from(studyCreateRequest, user);
        if (studyCreateRequest.tags() != null) {
            for (String tagName : studyCreateRequest.tags()) {
                Tag tag = tagRepository.findByName(tagName)
                        .orElseGet(() -> tagRepository.save(new Tag(tagName)));
                study.addStudyTag(tag);
            }
        }
        studyRepository.save(study);
    }

    public List<StudyDistanceResponse> getAllStudy(Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new UsernameNotFoundException("해당 유저를 찾을 수 없습니다."));
        List<StudyDistanceProjection> results = studyRepository.findStudiesWithDistanceOrdered(user.getGeom());
        return results.stream().map(
                        projection -> {

                            List<String> tags = tagRepository.findTagNamesByStudyId(projection.getId());

                            return new StudyDistanceResponse(
                                    projection.getId(),
                                    projection.getLeaderId(),
                                    projection.getTitle(),
                                    projection.getDescription(),
                                    projection.getMaxMembers(),
                                    projection.getMemberCount(),
                                    projection.getFrequency(),
                                    projection.getDuration(),
                                    projection.getAddress(),
                                    projection.getStatus(),
                                    projection.getCreatedAt(),
                                    projection.getDetailLocation(),
                                    projection.getDistanceKm(),
                                    tags
                            );
                        })
                .collect(Collectors.toList());
    }
}
