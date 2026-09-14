package com.sigma.backend.controller;

import com.sigma.backend.entity.Course;
import com.sigma.backend.repository.CourseRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:5174" })
public class CourseController {

        private final CourseRepository courseRepository;

        public CourseController(
                        CourseRepository courseRepository) {
                this.courseRepository = courseRepository;
        }

        // =====================================================
        // GET ALL ACTIVE COURSES
        // =====================================================

        @GetMapping
        public ResponseEntity<List<Course>> getCourses() {

                return ResponseEntity.ok(
                                courseRepository.findByActiveTrue());
        }

        // =====================================================
        // GET COURSE BY ID
        // =====================================================
        @GetMapping("/{id}")
        public ResponseEntity<Course> getCourse(
                        @PathVariable Long id) {

                return courseRepository
                                .findById(id)
                                .filter(Course::isActive)
                                .map(ResponseEntity::ok)
                                .orElse(
                                                ResponseEntity
                                                                .notFound()
                                                                .build());
        }
}