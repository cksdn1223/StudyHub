package com.project.studyhub.repository;

import com.project.studyhub.entity.StudyParticipant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudyParticipantRepository extends JpaRepository<StudyParticipant, Long> {
}