package com.sigma.backend.repository;

import com.sigma.backend.entity.Student;
import com.sigma.backend.entity.StudentResult;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudentResultRepository
        extends JpaRepository<StudentResult, Long> {

    List<StudentResult> findByStudent(
            Student student
    );

    List<StudentResult> findByCourseId(
            Long courseId
    );

    List<StudentResult> findByStudentId(
            Long studentId
    );
}