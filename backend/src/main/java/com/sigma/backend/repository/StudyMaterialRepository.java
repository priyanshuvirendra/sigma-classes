package com.sigma.backend.repository;

import com.sigma.backend.entity.Course;
import com.sigma.backend.entity.StudyMaterial;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudyMaterialRepository
        extends JpaRepository<StudyMaterial, Long> {

    List<StudyMaterial> findByCourseAndPublishedTrue(
            Course course
    );

    List<StudyMaterial> findByCourse(
            Course course
    );

  List<StudyMaterial> findByCourseIdIn(
            List<Long> courseIds
    );
}