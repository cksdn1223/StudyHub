package com.project.studyhub.repository;

import com.project.studyhub.dto.study.StudyDistanceProjection;
import com.project.studyhub.dto.study.StudyDistanceResponse;
import com.project.studyhub.entity.Study;
import org.locationtech.jts.geom.Point;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface StudyRepository extends JpaRepository<Study, Long> {
    @Query(value = """
        SELECT
            s.id,
            s.leader_id AS leaderId,
            s.title,
            s.description,
            s.max_members AS maxMembers,
            s.member_count AS memberCount,
            s.frequency,
            s.duration,
            s.address,
            s.detail_address AS detailAddress,
            s.detail_location AS detailLocation,
            s.status,
            s.created_at AS createdAt,
            ST_DistanceSphere(
                s.geom,
                :userGeom
            ) / 1000.0 AS distanceKm
        FROM
            study s
        ORDER BY
            distanceKm ASC
    """, nativeQuery = true)
    List<StudyDistanceProjection> findStudiesWithDistanceOrdered(
            @Param("userGeom") Point userGeom
    );
}