package com.sigma.backend.controller;

import com.sigma.backend.entity.Course;
import com.sigma.backend.entity.Enrollment;
import com.sigma.backend.entity.Faculty;
import com.sigma.backend.entity.Student;
import com.sigma.backend.entity.StudyMaterial;
import com.sigma.backend.repository.CourseRepository;
import com.sigma.backend.repository.EnrollmentRepository;
import com.sigma.backend.repository.FacultyRepository;
import com.sigma.backend.repository.StudyMaterialRepository;
import com.sigma.backend.security.JwtService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/faculty")
@CrossOrigin(origins = "http://localhost:5173")
public class FacultyController {

        private final FacultyRepository facultyRepository;
        private final CourseRepository courseRepository;
        private final EnrollmentRepository enrollmentRepository;
        private final StudyMaterialRepository studyMaterialRepository;
        private final JwtService jwtService;

        // =====================================================
        // CONSTRUCTOR
        // =====================================================

        public FacultyController(
                        FacultyRepository facultyRepository,
                        CourseRepository courseRepository,
                        EnrollmentRepository enrollmentRepository,
                        StudyMaterialRepository studyMaterialRepository,
                        JwtService jwtService) {
                this.facultyRepository = facultyRepository;
                this.courseRepository = courseRepository;
                this.enrollmentRepository = enrollmentRepository;
                this.studyMaterialRepository = studyMaterialRepository;
                this.jwtService = jwtService;
        }

        // =====================================================
        // GET STUDENTS OF LOGGED-IN FACULTY
        // =====================================================
        @GetMapping("/students")
        public ResponseEntity<?> getMyStudents(
                        @RequestHeader("Authorization") String authHeader,
                        @RequestParam(required = false) Long courseId) {

                if (authHeader == null ||
                                !authHeader.startsWith("Bearer ")) {
                        return ResponseEntity
                                        .status(401)
                                        .body(
                                                        Map.of(
                                                                        "message",
                                                                        "Missing or invalid authorization token"));
                }

                String token = authHeader.substring(7);

                try {

                        // =====================================================
                        // VERIFY TOKEN
                        // =====================================================

                        if (!jwtService.isTokenValid(token)) {

                                return ResponseEntity
                                                .status(401)
                                                .body(
                                                                Map.of(
                                                                                "message",
                                                                                "Invalid or expired token"));
                        }

                        // =====================================================
                        // EXTRACT FACULTY INFORMATION
                        // =====================================================

                        String username = jwtService.extractUsername(token);

                        String role = jwtService.extractRole(token);

                        if (!"FACULTY".equals(role)) {

                                return ResponseEntity
                                                .status(403)
                                                .body(
                                                                Map.of(
                                                                                "message",
                                                                                "Faculty access required"));
                        }

                        // =====================================================
                        // FIND COURSES ASSIGNED TO FACULTY
                        // =====================================================

                        List<Course> courses = courseRepository
                                        .findCoursesByFacultyUsername(username);

                        if (courseId != null) {

                                courses = courses.stream()
                                                .filter(course -> course.getId().equals(courseId))
                                                .toList();
                        }
                        // =====================================================
                        // FIND STUDENTS
                        // =====================================================

                        List<Map<String, Object>> students = new ArrayList<>();

                        for (Course course : courses) {

                                List<Enrollment> enrollments = enrollmentRepository
                                                .findByCourseIdAndStatus(
                                                                course.getId(),
                                                                "ACTIVE");

                                for (Enrollment enrollment : enrollments) {

                                        Student student = enrollment.getStudent();

                                        Map<String, Object> studentData = new HashMap<>();

                                        studentData.put(
                                                        "enrollmentId",
                                                        enrollment.getId());

                                        studentData.put(
                                                        "studentId",
                                                        student.getId());

                                        studentData.put(
                                                        "name",
                                                        student.getName());

                                        studentData.put(
                                                        "email",
                                                        student.getEmail());

                                        studentData.put(
                                                        "phone",
                                                        student.getPhone());

                                        studentData.put(
                                                        "courseId",
                                                        course.getId());

                                        studentData.put(
                                                        "courseName",
                                                        course.getName());

                                        studentData.put(
                                                        "status",
                                                        enrollment.getStatus());

                                        studentData.put(
                                                        "enrolledAt",
                                                        enrollment.getEnrolledAt());

                                        students.add(studentData);
                                }
                        }

                        // =====================================================
                        // RETURN STUDENTS
                        // =====================================================

                        return ResponseEntity.ok(students);

                } catch (Exception e) {

                        e.printStackTrace();

                        return ResponseEntity
                                        .status(401)
                                        .body(
                                                        Map.of(
                                                                        "message",
                                                                        "Invalid or expired token"));
                }
        }

}