package com.sigma.backend.repository;

import com.sigma.backend.entity.Enrollment;
import com.sigma.backend.entity.Student;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {

    List<Enrollment> findByStudent(Student student);

    boolean existsByStudentIdAndCourseId(Long studentId, Long courseId);

    Optional<Enrollment> findByStudentIdAndCourseId(
            Long studentId,
            Long courseId
    );

    List<Enrollment> findByCourseIdAndStatus(
            Long courseId,
            String status
    );
}