package com.sigma.backend.controller;

import com.sigma.backend.entity.Course;
import com.sigma.backend.entity.Enrollment;
import com.sigma.backend.entity.Student;
import com.sigma.backend.repository.CourseRepository;
import com.sigma.backend.repository.EnrollmentRepository;
import com.sigma.backend.repository.StudentRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.sigma.backend.service.EmailService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/student")
@CrossOrigin(origins = "http://localhost:5173")
public class EnrollmentController {

private final EnrollmentRepository enrollmentRepository;
private final StudentRepository studentRepository;
private final CourseRepository courseRepository;
private final EmailService emailService;


    public EnrollmentController(
            EnrollmentRepository enrollmentRepository,
            StudentRepository studentRepository,
            CourseRepository courseRepository,
            EmailService emailService
    ) {
        this.enrollmentRepository = enrollmentRepository;
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
        this.emailService = emailService;
    }


    // =====================================================
    // ENROLL IN COURSE
    // =====================================================

    @PostMapping("/enroll/{courseId}")
    public ResponseEntity<?> enroll(
            @PathVariable Long courseId,
            Authentication authentication
    ) {

        // Get email from JWT

        String email = authentication.getName();


        // Find student

        Student student =
                studentRepository
                        .findByEmail(email)
                        .orElse(null);


        if (student == null) {

            return ResponseEntity
                    .status(404)
                    .body(
                            Map.of(
                                    "message",
                                    "Student not found"
                            )
                    );
        }


        // Find course

        Course course =
                courseRepository
                        .findById(courseId)
                        .orElse(null);


        if (course == null) {

            return ResponseEntity
                    .status(404)
                    .body(
                            Map.of(
                                    "message",
                                    "Course not found"
                            )
                    );
        }


        // Check whether course is active

        if (!course.isActive()) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "Course is not currently available"
                            )
                    );
        }


        // Prevent duplicate enrollment

        if (
                enrollmentRepository
                        .existsByStudentIdAndCourseId(
                                student.getId(),
                                course.getId()
                        )
        ) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "Already enrolled in this course"
                            )
                    );
        }


        // Create enrollment

        Enrollment enrollment =
                new Enrollment();

        enrollment.setStudent(student);
        enrollment.setCourse(course);
        enrollment.setStatus("PENDING");

        // Save enrollment

        Enrollment savedEnrollment =
                enrollmentRepository.save(
                        enrollment
                );

        try {
    emailService.sendEnrollmentRequestEmail(
        student.getName(),
        student.getEmail(),
        course.getName(),
        course.getCategory(),
        course.getDuration(),
        course.getMode()
    );
} catch (Exception e) {
    System.err.println(
        "Failed to send enrollment request email: "
            + e.getMessage()
    );
}


        return ResponseEntity.ok(
                savedEnrollment
        );
    }


    // =====================================================
    // GET MY COURSES
    // =====================================================

    @GetMapping("/enrollments")
    public ResponseEntity<List<Enrollment>> getMyEnrollments(
            Authentication authentication
    ) {

        String email =
                authentication.getName();


        Student student =
                studentRepository
                        .findByEmail(email)
                        .orElse(null);


        if (student == null) {

            return ResponseEntity
                    .notFound()
                    .build();
        }


        return ResponseEntity.ok(
                enrollmentRepository
                        .findByStudent(student)
        );
    }
}