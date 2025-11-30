package com.project.studyhub.repository;

import com.project.studyhub.entity.Study;
import com.project.studyhub.entity.StudyParticipant;
import com.project.studyhub.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudyParticipantRepository extends JpaRepository<StudyParticipant, Long> {
    boolean existsByStudyAndUser(Study study, User user);
}