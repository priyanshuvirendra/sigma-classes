package com.sigma.backend.controller;

import com.sigma.backend.entity.Course;
import com.sigma.backend.repository.CourseRepository;
import com.sigma.backend.security.JwtService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/faculty")
@CrossOrigin(origins = "http://localhost:5173")
public class FacultyCourseController {

    private final CourseRepository courseRepository;
    private final JwtService jwtService;

    public FacultyCourseController(
            CourseRepository courseRepository,
            JwtService jwtService
    ) {
        this.courseRepository = courseRepository;
        this.jwtService = jwtService;
    }


    // =====================================================
    // GET COURSES ASSIGNED TO LOGGED-IN FACULTY
    // =====================================================

    @GetMapping("/courses")
    public ResponseEntity<?> getMyCourses(
            @RequestHeader("Authorization") String authHeader
    ) {

        // -------------------------------------------------
        // CHECK AUTHORIZATION HEADER
        // -------------------------------------------------

        if (
                authHeader == null ||
                !authHeader.startsWith("Bearer ")
        ) {

            return ResponseEntity
                    .status(401)
                    .body(
                            Map.of(
                                    "message",
                                    "Missing or invalid authorization token"
                            )
                    );
        }


        String token = authHeader.substring(7);


        try {

            // -------------------------------------------------
            // VALIDATE TOKEN
            // -------------------------------------------------

            if (!jwtService.isTokenValid(token)) {

                return ResponseEntity
                        .status(401)
                        .body(
                                Map.of(
                                        "message",
                                        "Invalid or expired token"
                                )
                        );
            }


            // -------------------------------------------------
            // EXTRACT USERNAME + ROLE
            // -------------------------------------------------

            String username =
                    jwtService.extractUsername(token);

            String role =
                    jwtService.extractRole(token);


            // -------------------------------------------------
            // CHECK FACULTY ROLE
            // -------------------------------------------------

            if (!"FACULTY".equals(role)) {

                return ResponseEntity
                        .status(403)
                        .body(
                                Map.of(
                                        "message",
                                        "Faculty access required"
                                )
                        );
            }


            // -------------------------------------------------
            // FIND ASSIGNED COURSES
            // -------------------------------------------------

            List<Course> courses =
                    courseRepository
                            .findCoursesByFacultyUsername(username);


            // -------------------------------------------------
            // RETURN COURSES
            // -------------------------------------------------

            return ResponseEntity.ok(courses);

        } catch (Exception e) {

            return ResponseEntity
                    .status(401)
                    .body(
                            Map.of(
                                    "message",
                                    "Invalid or expired token"
                            )
                    );
        }
    }
}