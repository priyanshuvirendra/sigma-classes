package com.sigma.backend.controller;

import com.sigma.backend.entity.Batch;
import com.sigma.backend.entity.Course;
import com.sigma.backend.repository.BatchRepository;
import com.sigma.backend.repository.CourseRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/batches")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminBatchController {

    private final BatchRepository batchRepository;
    private final CourseRepository courseRepository;

    public AdminBatchController(
            BatchRepository batchRepository,
            CourseRepository courseRepository
    ) {
        this.batchRepository = batchRepository;
        this.courseRepository = courseRepository;
    }


    // =====================================================
    // GET ALL BATCHES
    // =====================================================

    @GetMapping
    public ResponseEntity<List<Batch>> getAllBatches() {
        return ResponseEntity.ok(batchRepository.findAll());
    }


    // =====================================================
    // GET BATCHES FOR A COURSE
    // =====================================================

    @GetMapping("/course/{courseId}")
    public ResponseEntity<?> getBatchesByCourse(
            @PathVariable Long courseId
    ) {

        Course course = courseRepository
                .findById(courseId)
                .orElse(null);

        if (course == null) {
            return ResponseEntity
                    .status(404)
                    .body(Map.of("message", "Course not found"));
        }

        return ResponseEntity.ok(
                batchRepository.findByCourse(course)
        );
    }


    // =====================================================
    // CREATE BATCH
    // =====================================================

    @PostMapping
    public ResponseEntity<?> createBatch(
            @RequestBody Map<String, Object> request
    ) {

        String name = request.get("name") != null
                ? request.get("name").toString().trim()
                : "";

        String timing = request.get("timing") != null
                ? request.get("timing").toString().trim()
                : "";

        String faculty = request.get("faculty") != null
                ? request.get("faculty").toString().trim()
                : "";

        Object courseIdObject = request.get("courseId");

        if (name.isBlank()) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("message", "Batch name is required"));
        }

        if (courseIdObject == null) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("message", "Course is required"));
        }

        Long courseId;

        try {
            courseId = Long.valueOf(
                    courseIdObject.toString()
            );
        } catch (NumberFormatException error) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("message", "Invalid course ID"));
        }

        Course course = courseRepository
                .findById(courseId)
                .orElse(null);

        if (course == null) {
            return ResponseEntity
                    .status(404)
                    .body(Map.of("message", "Course not found"));
        }

        Batch batch = new Batch();

        batch.setName(name);
        batch.setCourse(course);
        batch.setTiming(
                timing.isBlank() ? null : timing
        );
        batch.setFaculty(
                faculty.isBlank() ? null : faculty
        );
        batch.setActive(true);

        Batch savedBatch = batchRepository.save(batch);

        return ResponseEntity.ok(savedBatch);
    }


    // =====================================================
    // UPDATE BATCH
    // =====================================================

    @PutMapping("/{id}")
    public ResponseEntity<?> updateBatch(
            @PathVariable Long id,
            @RequestBody Map<String, Object> request
    ) {

        Batch batch = batchRepository
                .findById(id)
                .orElse(null);

        if (batch == null) {
            return ResponseEntity
                    .status(404)
                    .body(Map.of("message", "Batch not found"));
        }

        String name = request.get("name") != null
                ? request.get("name").toString().trim()
                : "";

        if (name.isBlank()) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("message", "Batch name is required"));
        }

        batch.setName(name);

        if (request.get("timing") != null) {
            String timing = request.get("timing")
                    .toString()
                    .trim();

            batch.setTiming(
                    timing.isBlank() ? null : timing
            );
        }

        if (request.get("faculty") != null) {
            String faculty = request.get("faculty")
                    .toString()
                    .trim();

            batch.setFaculty(
                    faculty.isBlank() ? null : faculty
            );
        }

        if (request.get("courseId") != null) {

            Long courseId;

            try {
                courseId = Long.valueOf(
                        request.get("courseId").toString()
                );
            } catch (NumberFormatException error) {
                return ResponseEntity
                        .badRequest()
                        .body(Map.of("message", "Invalid course ID"));
            }

            Course course = courseRepository
                    .findById(courseId)
                    .orElse(null);

            if (course == null) {
                return ResponseEntity
                        .status(404)
                        .body(Map.of("message", "Course not found"));
            }

            batch.setCourse(course);
        }

        Batch updatedBatch = batchRepository.save(batch);

        return ResponseEntity.ok(updatedBatch);
    }


    // =====================================================
    // ACTIVATE / DEACTIVATE BATCH
    // =====================================================

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateBatchStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> request
    ) {

        Batch batch = batchRepository
                .findById(id)
                .orElse(null);

        if (batch == null) {
            return ResponseEntity
                    .status(404)
                    .body(Map.of("message", "Batch not found"));
        }

        Boolean active = request.get("active");

        if (active == null) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("message", "Active status is required"));
        }

        batch.setActive(active);

        Batch updatedBatch = batchRepository.save(batch);

        return ResponseEntity.ok(updatedBatch);
    }


    // =====================================================
    // DELETE BATCH
    // =====================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBatch(
            @PathVariable Long id
    ) {

        Batch batch = batchRepository
                .findById(id)
                .orElse(null);

        if (batch == null) {
            return ResponseEntity
                    .status(404)
                    .body(Map.of("message", "Batch not found"));
        }

        batchRepository.delete(batch);

        return ResponseEntity.noContent().build();
    }
}