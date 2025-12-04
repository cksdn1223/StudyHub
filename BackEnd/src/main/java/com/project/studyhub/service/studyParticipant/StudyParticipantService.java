package com.project.studyhub.service.studyParticipant;

import com.project.studyhub.dto.notification.NotificationResponse;
import com.project.studyhub.entity.Notification;
import com.project.studyhub.entity.Study;
import com.project.studyhub.entity.StudyParticipant;
import com.project.studyhub.entity.User;
import com.project.studyhub.enums.NotificationType;
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
                .orElseThrow(()-> new ResourceNotFoundException("해당 스터디를 찾을 수 없습니다."));
        User sender = userRepository.findByEmail(principal.getName())
                .orElseThrow(()-> new UsernameNotFoundException("해당 유저를 찾을 수 없습니다."));
        // 기본 대기중 상태
        if(studyParticipantRepository.existsByStudyAndUser(study, sender))
            throw new ParticipantExistsException("이미 참여한 스터디입니다.");
        StudyParticipant studyParticipant = new StudyParticipant(study, sender);
        Notification notification = new Notification(study, study.getLeader(), sender, sender.getNickname()+"님이 가입 요청을 보냈습니다.", NotificationType.JOIN_REQUEST);
        studyParticipantRepository.save(studyParticipant);
        notificationRepository.save(notification);

        messagingTemplate.convertAndSend(
                "/sub/notification/" + study.getLeader().getUserId(),
                NotificationResponse.from(notification));
    }

    // TODO: Patch하는 엔드포인트 만들고 PENDING 대기, ACCEPTED 승인, REJECTED 거절 / 변경가능하게 만들기
    // TODO: study 인원수 가득차거나 비슷해지면 승인해도 거절되고 study status 바꾸기 모집중(RECRUITING), 모집완료(FULL), 활동종료(FINISHED)
}
