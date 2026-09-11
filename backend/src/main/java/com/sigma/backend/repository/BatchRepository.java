package com.sigma.backend.repository;

import com.sigma.backend.entity.Batch;
import com.sigma.backend.entity.Course;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BatchRepository extends JpaRepository<Batch, Long> {

    List<Batch> findByCourse(Course course);

    List<Batch> findByCourseIdAndActiveTrue(Long courseId);

    List<Batch> findByActiveTrue();
}