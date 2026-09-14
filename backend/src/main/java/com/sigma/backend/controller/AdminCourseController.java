package com.sigma.backend.controller;

import com.sigma.backend.entity.Course;
import com.sigma.backend.repository.CourseRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/courses")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminCourseController {

        private final CourseRepository courseRepository;

        public AdminCourseController(
                        CourseRepository courseRepository) {
                this.courseRepository = courseRepository;
        }

        // =====================================================
        // GET ALL COURSES
        // =====================================================

        @GetMapping
        public ResponseEntity<List<Course>> getAllCourses() {

                return ResponseEntity.ok(
                                courseRepository.findAll());
        }

        // =====================================================
        // CREATE COURSE
        // =====================================================

        @PostMapping
        public ResponseEntity<Course> createCourse(
                        @RequestBody Course course) {

                /*
                 * Make sure a new course gets a new database ID.
                 */

                course.setId(null);

                Course savedCourse =
                                courseRepository.save(course);

                return ResponseEntity.ok(
                                savedCourse);
        }

        // =====================================================
        // GET COURSE BY ID
        // =====================================================

        @GetMapping("/{id}")
        public ResponseEntity<Course> getCourse(
                        @PathVariable Long id) {

                return courseRepository
                                .findById(id)
                                .map(ResponseEntity::ok)
                                .orElse(
                                                ResponseEntity
                                                                .notFound()
                                                                .build());
        }

        // =====================================================
        // UPDATE COURSE
        // =====================================================

        @PutMapping("/{id}")
        public ResponseEntity<Course> updateCourse(
                        @PathVariable Long id,
                        @RequestBody Course courseData) {

                Course course = courseRepository
                                .findById(id)
                                .orElse(null);

                if (course == null) {

                        return ResponseEntity
                                        .notFound()
                                        .build();
                }

                // =================================================
                // BASIC INFORMATION
                // =================================================

                course.setName(
                                courseData.getName());

                course.setDescription(
                                courseData.getDescription());

                course.setCategory(
                                courseData.getCategory());

                course.setDuration(
                                courseData.getDuration());

                course.setPrice(
                                courseData.getPrice());

                course.setImageUrl(
                                courseData.getImageUrl());

                course.setActive(
                                courseData.isActive());

                // =================================================
                // ADDITIONAL INFORMATION
                // =================================================

                course.setStartDate(
                                courseData.getStartDate());

                course.setMode(
                                courseData.getMode());

                // =================================================
                // TIMING
                // =================================================

                course.setTiming(
                                courseData.getTiming());

                // =================================================
                // CURRICULUM
                // =================================================

                course.setCurriculum(
                                courseData.getCurriculum());

                // =================================================
                // FACULTY
                // =================================================

                course.setFaculty(
                                courseData.getFaculty());

                // =================================================
                // FEATURES
                // =================================================

                course.setFeatures(
                                courseData.getFeatures());

                // =================================================
                // TAGS
                // =================================================

                course.setTags(
                                courseData.getTags());

                // =================================================
                // SAVE
                // =================================================

                Course updatedCourse =
                                courseRepository.save(course);

                return ResponseEntity.ok(
                                updatedCourse);
        }

        // =====================================================
        // RESTORE COURSE
        // =====================================================

        @PutMapping("/{id}/restore")
        public ResponseEntity<Course> restoreCourse(
                        @PathVariable Long id) {

                Course course =
                                courseRepository
                                                .findById(id)
                                                .orElse(null);

                if (course == null) {

                        return ResponseEntity
                                        .notFound()
                                        .build();
                }

                /*
                 * Restore the course by making it active.
                 *
                 * No other course information is modified.
                 */

                course.setActive(true);

                Course restoredCourse =
                                courseRepository.save(course);

                return ResponseEntity.ok(
                                restoredCourse);
        }

        // =====================================================
        // ARCHIVE COURSE
        // =====================================================

        @DeleteMapping("/{id}")
        public ResponseEntity<Course> deleteCourse(
                        @PathVariable Long id) {

                Course course =
                                courseRepository
                                                .findById(id)
                                                .orElse(null);

                if (course == null) {

                        return ResponseEntity
                                        .notFound()
                                        .build();
                }

                /*
                 * Do not physically delete the course.
                 *
                 * Existing enrollments and other course-related
                 * records may still reference this course.
                 *
                 * Instead, mark the course as inactive.
                 */

                course.setActive(false);

                Course archivedCourse =
                                courseRepository.save(course);

                /*
                 * Return the updated course so the frontend
                 * can immediately update its local state.
                 */

                return ResponseEntity.ok(
                                archivedCourse);
        }
}