package com.project.studyhub.service.studyParticipant;

import com.project.studyhub.dto.notification.NotificationResponse;
import com.project.studyhub.dto.participant.StudyParticipantRequest;
import com.project.studyhub.entity.Notification;
import com.project.studyhub.entity.Study;
import com.project.studyhub.entity.StudyParticipant;
import com.project.studyhub.entity.User;
import com.project.studyhub.enums.NotificationType;
import com.project.studyhub.enums.ParticipantStatus;
import com.project.studyhub.exception.MemberMaxException;
import com.project.studyhub.exception.ParticipantExistsException;
import com.project.studyhub.exception.ResourceNotFoundException;
import com.project.studyhub.repository.NotificationRepository;
import com.project.studyhub.repository.StudyParticipantRepository;
import com.project.studyhub.repository.StudyRepository;
import com.project.studyhub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
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
    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public void createParticipant(Long studyId, Principal principal) {
        Study study = studyRepository.findById(studyId)
                .orElseThrow(() -> new ResourceNotFoundException("해당 스터디를 찾을 수 없습니다."));
        User sender = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new UsernameNotFoundException("해당 유저를 찾을 수 없습니다."));

        if (studyParticipantRepository.existsByStudyAndUser(study, sender)) {
            // 데이터베이스에 요청이 이미 존재하니 그에 해당하는 에러 처리
            StudyParticipant studyParticipant = studyParticipantRepository.findByStudy_IdAndUser_UserId(study.getId(), sender.getUserId())
                    .orElseThrow(()-> new ResourceNotFoundException("해당 참여요청을 찾을 수 없습니다."));
            switch(studyParticipant.getStatus()) {
                case PENDING -> throw new ParticipantExistsException("참여 대기중인 스터디입니다.");
                case ACCEPTED -> throw new ParticipantExistsException("참여중인 스터디입니다.");
                case REJECTED -> throw new ParticipantExistsException("참여 요청이 거절된 스터디입니다.");
                default -> {
                }
            }
        }
        else { // 데이터베이스에 참가 요청이 없다면 가입요청
            StudyParticipant studyParticipant = new StudyParticipant(study, sender);
            Notification notification = new Notification(study, study.getLeader(), sender, sender.getNickname() + "님이 가입 요청을 보냈습니다. [" + study.getTitle() + "]", NotificationType.JOIN_REQUEST);
            studyParticipantRepository.save(studyParticipant);
            notificationRepository.save(notification);
            messagingTemplate.convertAndSend(
                    "/sub/notification/" + study.getLeader().getUserId(),
                    NotificationResponse.from(notification));
        }
    }

    @Transactional
    public void participantStatusChange(Long studyId, StudyParticipantRequest request) {
        StudyParticipant studyParticipant = studyParticipantRepository.findByStudy_IdAndUser_UserId(studyId, request.userId())
                .orElseThrow(() -> new ResourceNotFoundException("해당 신청을 찾을 수 없습니다."));
        if (request.status().equals(ParticipantStatus.ACCEPTED)) {
            Study study = studyParticipant.getStudy();
            if (study.getMemberCount() < study.getMaxMembers()) {
                study.addMemberCount();
                User receiver = userRepository.findById(request.userId())
                        .orElseThrow(() -> new UsernameNotFoundException("해당 유저를 찾을 수 없습니다."));
                Notification notification = new Notification(study, receiver, study.getLeader(), String.format(
                        "[%s] 스터디 가입 요청이 수락되었습니다.",
                        study.getTitle()
                ), NotificationType.REQUEST_ACCEPTED);
                notificationRepository.save(notification);
                messagingTemplate.convertAndSend(
                        "/sub/notification/" + receiver.getUserId(),
                        NotificationResponse.from(notification));
            } else throw new MemberMaxException("이미 가득 찬 스터디입니다.");
        } else if (request.status().equals(ParticipantStatus.REJECTED)) {
            Study study = studyParticipant.getStudy();
            User receiver = userRepository.findById(request.userId())
                    .orElseThrow(() -> new UsernameNotFoundException("해당 유저를 찾을 수 없습니다."));
            Notification notification = new Notification(study, receiver, study.getLeader(), String.format(
                    "[%s] 스터디 가입 요청이 거절되었습니다.",
                    study.getTitle()
            ), NotificationType.REQUEST_REJECTED);
            notificationRepository.save(notification);
            messagingTemplate.convertAndSend(
                    "/sub/notification/" + receiver.getUserId(),
                    NotificationResponse.from(notification));
        }
        studyParticipant.setStatus(request.status());
    }
    // TODO: study 인원수 가득차거나 비슷해지면 승인해도 거절되고 study status 바꾸기 모집중(RECRUITING), 모집완료(FULL), 활동종료(FINISHED)
}
