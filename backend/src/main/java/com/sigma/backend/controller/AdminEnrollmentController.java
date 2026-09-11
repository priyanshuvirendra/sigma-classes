package com.sigma.backend.controller;

import com.sigma.backend.entity.Course;
import com.sigma.backend.entity.Enrollment;
import com.sigma.backend.entity.Student;
import com.sigma.backend.repository.CourseRepository;
import com.sigma.backend.repository.EnrollmentRepository;
import com.sigma.backend.repository.StudentRepository;
import com.sigma.backend.service.EmailService;
import com.sigma.backend.service.NotificationService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/enrollments")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminEnrollmentController {

    private final EnrollmentRepository enrollmentRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final EmailService emailService;
    private final NotificationService notificationService;

    public AdminEnrollmentController(
            EnrollmentRepository enrollmentRepository,
            StudentRepository studentRepository,
            CourseRepository courseRepository,
            EmailService emailService,
            NotificationService notificationService) {

        this.enrollmentRepository = enrollmentRepository;
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
        this.emailService = emailService;
        this.notificationService = notificationService;
    }

    // =====================================================
    // GET ALL ENROLLMENTS
    // =====================================================

    @GetMapping
    public ResponseEntity<List<Enrollment>> getAllEnrollments() {

        return ResponseEntity.ok(
                enrollmentRepository.findAll()
        );
    }

    // =====================================================
    // CREATE ENROLLMENT
    // =====================================================

    @PostMapping
    public ResponseEntity<?> createEnrollment(
            @RequestBody Map<String, Object> request) {

        Object studentIdObject = request.get("studentId");
        Object courseIdObject = request.get("courseId");

        // -------------------------------------------------
        // VALIDATE REQUEST
        // -------------------------------------------------

        if (studentIdObject == null || courseIdObject == null) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "Student ID and Course ID are required"
                            )
                    );
        }

        Long studentId;
        Long courseId;

        try {

            studentId = Long.valueOf(
                    studentIdObject.toString()
            );

            courseId = Long.valueOf(
                    courseIdObject.toString()
            );

        } catch (NumberFormatException error) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "Invalid student ID or course ID"
                            )
                    );
        }

        // =================================================
        // FIND STUDENT
        // =================================================

        Student student = studentRepository
                .findById(studentId)
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

        // =================================================
        // FIND COURSE
        // =================================================

        Course course = courseRepository
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

        // =================================================
        // CHECK COURSE ACTIVE
        // =================================================

        if (!course.isActive()) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "This course is currently inactive"
                            )
                    );
        }

        // =================================================
        // CHECK DUPLICATE ENROLLMENT
        // =================================================

        if (enrollmentRepository
                .existsByStudentIdAndCourseId(
                        studentId,
                        courseId
                )) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "Student is already enrolled in this course"
                            )
                    );
        }

        // =================================================
        // CREATE ENROLLMENT
        // =================================================

        Enrollment enrollment = new Enrollment();

        enrollment.setStudent(student);
        enrollment.setCourse(course);

        // Admin-created enrollment is immediately active
        enrollment.setStatus("ACTIVE");

        Enrollment savedEnrollment =
                enrollmentRepository.save(enrollment);

        // =================================================
        // CREATE STUDENT NOTIFICATION
        // =================================================

        try {

            notificationService.createNotification(
                    student,
                    "Enrollment Approved",
                    "Your enrollment for "
                            + course.getName()
                            + " has been approved. You can now access your course materials.",
                    "ENROLLMENT"
            );

        } catch (Exception error) {

            System.err.println(
                    "Failed to create enrollment notification: "
                            + error.getMessage()
            );
        }

        // =================================================
        // SEND APPROVAL EMAIL
        // =================================================

        try {

            emailService.sendEnrollmentApprovedEmail(
                    student.getName(),
                    student.getEmail(),
                    course.getName(),
                    course.getCategory(),
                    course.getDuration(),
                    course.getMode()
            );

        } catch (Exception error) {

            System.err.println(
                    "Failed to send enrollment approval email: "
                            + error.getMessage()
            );
        }

        // =================================================
        // RETURN CREATED ENROLLMENT
        // =================================================

        return ResponseEntity.ok(
                savedEnrollment
        );
    }

    // =====================================================
    // UPDATE ENROLLMENT STATUS
    // =====================================================

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {

        // -------------------------------------------------
        // FIND ENROLLMENT
        // -------------------------------------------------

        Enrollment enrollment = enrollmentRepository
                .findById(id)
                .orElse(null);

        if (enrollment == null) {

            return ResponseEntity
                    .status(404)
                    .body(
                            Map.of(
                                    "message",
                                    "Enrollment not found"
                            )
                    );
        }

        // -------------------------------------------------
        // GET STATUS
        // -------------------------------------------------

        String status = request.get("status");

        if (status == null || status.isBlank()) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "Status is required"
                            )
                    );
        }

        status = status
                .trim()
                .toUpperCase();

        // =================================================
        // VALIDATE STATUS
        // =================================================

        if (!status.equals("PENDING")
                && !status.equals("ACTIVE")
                && !status.equals("INACTIVE")
                && !status.equals("COMPLETED")
                && !status.equals("CANCELLED")) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "Invalid enrollment status"
                            )
                    );
        }

        // =================================================
        // STORE OLD STATUS
        // =================================================

        String oldStatus = enrollment.getStatus();

        // =================================================
        // UPDATE STATUS
        // =================================================

        enrollment.setStatus(status);

        Enrollment updatedEnrollment =
                enrollmentRepository.save(enrollment);

        // =================================================
        // HANDLE ACTIVATION
        // =================================================

        if (!"ACTIVE".equalsIgnoreCase(oldStatus)
                && "ACTIVE".equalsIgnoreCase(status)) {

            Student student = enrollment.getStudent();
            Course course = enrollment.getCourse();

            // -------------------------------------------------
            // CREATE STUDENT NOTIFICATION
            // -------------------------------------------------

            try {

                notificationService.createNotification(
                        student,
                        "Enrollment Approved",
                        "Your enrollment for "
                                + course.getName()
                                + " has been approved. You can now access your course materials.",
                        "ENROLLMENT"
                );

            } catch (Exception error) {

                System.err.println(
                        "Failed to create enrollment notification: "
                                + error.getMessage()
                );
            }

            // -------------------------------------------------
            // SEND APPROVAL EMAIL
            // -------------------------------------------------

            try {

                emailService.sendEnrollmentApprovedEmail(
                        student.getName(),
                        student.getEmail(),
                        course.getName(),
                        course.getCategory(),
                        course.getDuration(),
                        course.getMode()
                );

            } catch (Exception error) {

                System.err.println(
                        "Failed to send enrollment approval email: "
                                + error.getMessage()
                );
            }
        }

        // =================================================
        // RETURN UPDATED ENROLLMENT
        // =================================================

        return ResponseEntity.ok(
                updatedEnrollment
        );
    }

    // =====================================================
    // DELETE ENROLLMENT
    // =====================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEnrollment(
            @PathVariable Long id) {

        // -------------------------------------------------
        // CHECK EXISTENCE
        // -------------------------------------------------

        if (!enrollmentRepository.existsById(id)) {

            return ResponseEntity
                    .notFound()
                    .build();
        }

        // -------------------------------------------------
        // DELETE
        // -------------------------------------------------

        enrollmentRepository.deleteById(id);

        return ResponseEntity
                .noContent()
                .build();
    }
}