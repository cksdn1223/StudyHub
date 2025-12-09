package com.project.studyhub.service.study;

import com.project.studyhub.dto.study.*;
import com.project.studyhub.entity.Study;
import com.project.studyhub.entity.StudyParticipant;
import com.project.studyhub.entity.Tag;
import com.project.studyhub.entity.User;
import com.project.studyhub.enums.ParticipantStatus;
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
                                    user.getProfileImageUrl(),
                                    projection.getTitle(),
                                    projection.getDescription(),
                                    projection.getMaxMembers(),
                                    projection.getMemberCount(),
                                    projection.getFrequency(),
                                    projection.getDuration(),
                                    projection.getAddress(),
                                    projection.getDetailAddress(),
                                    projection.getStatus(),
                                    projection.getCreatedAt(),
                                    projection.getDetailLocation(),
                                    projection.getDistanceKm(),
                                    tags
                            );
                        })
                .collect(Collectors.toList());
    }

    public List<MyStudyResponse> getJoinStudy(Principal principal) {
        User me = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new UsernameNotFoundException("해당 유저를 찾을 수 없습니다."));
        List<Study> studies = studyRepository.findMyStudiesWithMembers(me, ParticipantStatus.ACCEPTED);

        return studies.stream()
                .map(this::toMyStudyResponseDto)
                .collect(Collectors.toList());
    }


    private MyStudyResponse toMyStudyResponseDto(Study study) {

        User leader = study.getLeader();
        Long leaderId = leader.getUserId();

        // 1. 리더 DTO
        StudyMemberDto leaderDto = StudyMemberDto.builder()
                .userId(leaderId)
                .nickname(leader.getNickname())
                .email(leader.getEmail())
                .leader(true)
                .status(null) // 리더는 status 개념 X
                .build();

        // 2. ACCEPTED 멤버들만 필터링 (리더는 participants에 포함 안 된다고 가정)
        List<StudyMemberDto> acceptedMemberDtos = study.getParticipants().stream()
                .filter(sp -> sp.getStatus() == ParticipantStatus.ACCEPTED)
                .map(sp -> {
                    User u = sp.getUser();
                    return StudyMemberDto.builder()
                            .userId(u.getUserId())
                            .nickname(u.getNickname())
                            .email(u.getEmail())
                            .leader(false)
                            .status(sp.getStatus())
                            .build();
                })
                .collect(Collectors.toList());

        // 3. 리더 + ACCEPTED 멤버들 합치기 (리더를 맨 앞에)
        acceptedMemberDtos.add(0, leaderDto);

        return MyStudyResponse.builder()
                .studyId(study.getId())
                .title(study.getTitle())
                .description(study.getDescription())
                .maxMembers(study.getMaxMembers())
                .memberCount(study.getMemberCount())
                .frequency(study.getFrequency())
                .duration(study.getDuration())
                .address(study.getAddress())
                .detailAddress(study.getDetailAddress())
                .detailLocation(study.getDetailLocation())
                .status(study.getStatus())
                .members(acceptedMemberDtos)
                .build();
    }


}
