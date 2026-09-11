package com.sigma.backend.controller;

import com.sigma.backend.entity.Course;
import com.sigma.backend.entity.Enrollment;
import com.sigma.backend.entity.Student;
import com.sigma.backend.entity.StudyMaterial;

import com.sigma.backend.repository.EnrollmentRepository;
import com.sigma.backend.repository.StudentRepository;
import com.sigma.backend.repository.StudyMaterialRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student/materials")
@CrossOrigin(origins = "http://localhost:5173")
public class StudentStudyMaterialController {

    private final StudyMaterialRepository studyMaterialRepository;
    private final StudentRepository studentRepository;
    private final EnrollmentRepository enrollmentRepository;

    public StudentStudyMaterialController(
            StudyMaterialRepository studyMaterialRepository,
            StudentRepository studentRepository,
            EnrollmentRepository enrollmentRepository
    ) {
        this.studyMaterialRepository = studyMaterialRepository;
        this.studentRepository = studentRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    // =====================================================
    // GET MATERIAL FOR AN ACTIVELY ENROLLED COURSE
    // =====================================================

    @GetMapping("/course/{courseId}")
    public ResponseEntity<?> getCourseMaterials(
            @PathVariable Long courseId,
            Authentication authentication
    ) {

        // -------------------------------------------------
        // Get logged-in student's email from JWT
        // -------------------------------------------------

        String email = authentication.getName();

        // -------------------------------------------------
        // Find logged-in student
        // -------------------------------------------------

        Student student = studentRepository
                .findByEmail(email)
                .orElse(null);

        if (student == null) {
            return ResponseEntity
                    .status(404)
                    .body("Student not found");
        }

        // -------------------------------------------------
        // Find enrollment for this student + course
        // -------------------------------------------------

        Enrollment enrollment = enrollmentRepository
                .findByStudentIdAndCourseId(
                        student.getId(),
                        courseId
                )
                .orElse(null);

        // -------------------------------------------------
        // Student is not enrolled
        // -------------------------------------------------

        if (enrollment == null) {

            return ResponseEntity
                    .status(403)
                    .body("You are not enrolled in this course");
        }

        // -------------------------------------------------
        // IMPORTANT:
        // Only ACTIVE enrollment can access materials
        // -------------------------------------------------

        if (!"ACTIVE".equalsIgnoreCase(enrollment.getStatus())) {

            return ResponseEntity
                    .status(403)
                    .body(
                            "Your enrollment is not active. " +
                            "You cannot access the study materials."
                    );
        }

        // -------------------------------------------------
        // Get course from the verified enrollment
        // -------------------------------------------------

        Course course = enrollment.getCourse();

        if (course == null) {

            return ResponseEntity
                    .status(404)
                    .body("Course not found");
        }

        // -------------------------------------------------
        // Return only published materials
        // -------------------------------------------------

        List<StudyMaterial> materials =
                studyMaterialRepository
                        .findByCourseAndPublishedTrue(course);

        return ResponseEntity.ok(materials);
    }
}  