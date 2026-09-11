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
            CourseRepository courseRepository
    ) {
        this.courseRepository = courseRepository;
    }


    // =====================================================
    // GET ALL COURSES
    // =====================================================

    @GetMapping
    public ResponseEntity<List<Course>> getAllCourses() {

        return ResponseEntity.ok(
                courseRepository.findAll()
        );
    }


    // =====================================================
    // CREATE COURSE
    // =====================================================

    @PostMapping
    public ResponseEntity<Course> createCourse(
            @RequestBody Course course
    ) {

        /*
         * Make sure a new course gets a new database ID.
         */

        course.setId(null);


        Course savedCourse =
                courseRepository.save(course);


        return ResponseEntity.ok(
                savedCourse
        );
    }


    // =====================================================
    // GET COURSE BY ID
    // =====================================================

    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourse(
            @PathVariable Long id
    ) {

        return courseRepository
                .findById(id)
                .map(ResponseEntity::ok)
                .orElse(
                        ResponseEntity
                                .notFound()
                                .build()
                );
    }


    // =====================================================
    // UPDATE COURSE
    // =====================================================

    @PutMapping("/{id}")
    public ResponseEntity<Course> updateCourse(
            @PathVariable Long id,
            @RequestBody Course courseData
    ) {

        Course course =
                courseRepository
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
                courseData.getName()
        );


        course.setDescription(
                courseData.getDescription()
        );


        course.setCategory(
                courseData.getCategory()
        );


        course.setDuration(
                courseData.getDuration()
        );


        course.setPrice(
                courseData.getPrice()
        );


        course.setImageUrl(
                courseData.getImageUrl()
        );


        course.setActive(
                courseData.isActive()
        );


        // =================================================
        // ADDITIONAL INFORMATION
        // =================================================

        course.setStartDate(
                courseData.getStartDate()
        );


        course.setMode(
                courseData.getMode()
        );


        // =================================================
        // CURRICULUM
        // =================================================

        course.setCurriculum(
                courseData.getCurriculum()
        );


        // =================================================
        // FACULTY
        // =================================================

        course.setFaculty(
                courseData.getFaculty()
        );


        // =================================================
        // FEATURES
        // =================================================

        course.setFeatures(
                courseData.getFeatures()
        );


        // =================================================
        // TAGS
        // =================================================

        course.setTags(
                courseData.getTags()
        );


        // =================================================
        // SAVE
        // =================================================

        Course updatedCourse =
                courseRepository.save(course);


        return ResponseEntity.ok(
                updatedCourse
        );
    }


    // =====================================================
    // DELETE COURSE
    // =====================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(
            @PathVariable Long id
    ) {

        if (
                !courseRepository
                        .existsById(id)
        ) {

            return ResponseEntity
                    .notFound()
                    .build();
        }


        courseRepository.deleteById(id);


        return ResponseEntity
                .noContent()
                .build();
    }
}