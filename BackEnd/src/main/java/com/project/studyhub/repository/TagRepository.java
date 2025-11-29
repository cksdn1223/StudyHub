package com.project.studyhub.repository;

import com.project.studyhub.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TagRepository extends JpaRepository<Tag, Long> {
    Optional<Tag> findByName(String name);

    @Query("SELECT t.name FROM Tag t JOIN StudyTag st ON t.id = st.tag.id WHERE st.study.id = :studyId")
    List<String> findTagNamesByStudyId(@Param("studyId") Long studyId);
}