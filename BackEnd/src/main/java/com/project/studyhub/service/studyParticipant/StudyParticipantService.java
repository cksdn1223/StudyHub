package com.project.studyhub.service.studyParticipant;

import com.project.studyhub.dto.participant.StudyParticipantRequest;
import com.project.studyhub.entity.Study;
import com.project.studyhub.entity.StudyParticipant;
import com.project.studyhub.entity.User;
import com.project.studyhub.event.ParticipantStatusChangeEvent;
import com.project.studyhub.enums.NotificationType;
import com.project.studyhub.exception.MemberMaxException;
import com.project.studyhub.exception.MemberMinException;
import com.project.studyhub.exception.ParticipantExistsException;
import com.project.studyhub.exception.ResourceNotFoundException;
import com.project.studyhub.repository.StudyParticipantRepository;
import com.project.studyhub.repository.StudyRepository;
import com.project.studyhub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;

@Service
@RequiredArgsConstructor
public class StudyParticipantService {
    private final StudyParticipantRepository studyParticipantRepository;
    private final StudyRepository studyRepository;
    private final UserRepository userRepository;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public void createParticipant(Long studyId, Principal principal) {
        Study study = studyRepository.findById(studyId)
                .orElseThrow(() -> new ResourceNotFoundException("해당 스터디를 찾을 수 없습니다."));
        User sender = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new UsernameNotFoundException("해당 유저를 찾을 수 없습니다."));

        if (studyParticipantRepository.existsByStudyAndUser(study, sender)) {
            // 데이터베이스에 요청이 이미 존재하니 그에 해당하는 에러 처리
            StudyParticipant studyParticipant = studyParticipantRepository.findByStudy_IdAndUser_UserId(study.getId(), sender.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("해당 참여요청을 찾을 수 없습니다."));
            switch (studyParticipant.getStatus()) {
                case PENDING -> throw new ParticipantExistsException("참여 대기중인 스터디입니다.");
                case ACCEPTED -> throw new ParticipantExistsException("참여중인 스터디입니다.");
                case REJECTED -> throw new ParticipantExistsException("참여 요청이 거절된 스터디입니다.");
                case BAN -> throw new ParticipantExistsException("강퇴된 스터디입니다. 다시 참여할 수 없습니다.");
            }
        } else { // 데이터베이스에 참가 요청이 없다면 가입요청
            StudyParticipant studyParticipant = new StudyParticipant(study, sender);
            studyParticipantRepository.save(studyParticipant);
            eventPublisher.publishEvent(new ParticipantStatusChangeEvent(study, study.getLeader(), sender , NotificationType.JOIN_REQUEST));
        }
    }

    @Transactional
    public void participantStatusChange(Long studyId, StudyParticipantRequest request) {
        StudyParticipant studyParticipant = studyParticipantRepository.findByStudy_IdAndUser_UserId(studyId, request.userId())
                .orElseThrow(() -> new ResourceNotFoundException("해당 신청을 찾을 수 없습니다."));
        Study study = studyParticipant.getStudy();
        User receiver = userRepository.findById(request.userId())
                .orElseThrow(() -> new UsernameNotFoundException("해당 유저를 찾을 수 없습니다."));
        NotificationType notificationType = getNotificationType(request, study);

        if (notificationType != null) {
            // 1. 참여 상태 변경
            studyParticipant.setStatus(request.status());
            // 2. 이벤트 발행
            eventPublisher.publishEvent(new ParticipantStatusChangeEvent(study, receiver, studyParticipant.getUser(), notificationType));
        }
    }

    private static NotificationType getNotificationType(StudyParticipantRequest request, Study study) {
        NotificationType notificationType = null;

        switch (request.status()) {
            case ACCEPTED -> {
                if (study.getMemberCount() < study.getMaxMembers()) {
                    notificationType = NotificationType.REQUEST_ACCEPTED;
                } else throw new MemberMaxException("이미 가득 찬 스터디입니다.");
            }
            case REJECTED -> notificationType = NotificationType.REQUEST_REJECTED;
            case BAN -> {
                if (study.getMemberCount() > 1) {
                    notificationType = NotificationType.BAN;
                } else throw new MemberMinException("마지막 남은 멤버는 강퇴할 수 없습니다.");
            }
            case PENDING -> throw new IllegalArgumentException("PENDING 상태로 변경할 수 없습니다.");
        }
        return notificationType;
    }
// TODO: study 인원수 가득차거나 비슷해지면 승인해도 거절되고 study status 바꾸기 모집중(RECRUITING), 모집완료(FULL), 활동종료(FINISHED)
}
