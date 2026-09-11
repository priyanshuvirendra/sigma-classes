package com.sigma.backend.controller;

import com.sigma.backend.entity.Course;
import com.sigma.backend.entity.StudyMaterial;
import com.sigma.backend.repository.CourseRepository;
import com.sigma.backend.repository.StudyMaterialRepository;
import com.sigma.backend.security.JwtService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/faculty/materials")
@CrossOrigin(origins = "http://localhost:5173")
public class FacultyStudyMaterialController {

    private final StudyMaterialRepository studyMaterialRepository;
    private final CourseRepository courseRepository;
    private final JwtService jwtService;

    public FacultyStudyMaterialController(
            StudyMaterialRepository studyMaterialRepository,
            CourseRepository courseRepository,
            JwtService jwtService
    ) {
        this.studyMaterialRepository = studyMaterialRepository;
        this.courseRepository = courseRepository;
        this.jwtService = jwtService;
    }


    // =====================================================
    // AUTHENTICATED FACULTY USERNAME
    // =====================================================

    private String getFacultyUsername(
            String authHeader
    ) {

        if (
                authHeader == null ||
                !authHeader.startsWith("Bearer ")
        ) {
            throw new RuntimeException(
                    "Missing authorization token"
            );
        }

        String token =
                authHeader.substring(7);

        if (!jwtService.isTokenValid(token)) {
            throw new RuntimeException(
                    "Invalid or expired token"
            );
        }

        String role =
                jwtService.extractRole(token);

        if (!"FACULTY".equals(role)) {
            throw new RuntimeException(
                    "Faculty access required"
            );
        }

        return jwtService.extractUsername(token);
    }


    // =====================================================
    // GET MATERIALS OF ASSIGNED COURSES
    // =====================================================

    @GetMapping
    public ResponseEntity<?> getMyMaterials(
            @RequestHeader("Authorization")
            String authHeader
    ) {

        try {

            String username =
                    getFacultyUsername(authHeader);

            List<Course> courses =
                    courseRepository
                            .findCoursesByFacultyUsername(
                                    username
                            );

            if (courses.isEmpty()) {
                return ResponseEntity.ok(
                        List.of()
                );
            }

            List<Long> courseIds =
                    courses.stream()
                            .map(Course::getId)
                            .toList();

            return ResponseEntity.ok(
                    studyMaterialRepository
                            .findByCourseIdIn(courseIds)
            );

        } catch (Exception e) {

            return ResponseEntity
                    .status(401)
                    .body(
                            Map.of(
                                    "message",
                                    e.getMessage()
                            )
                    );
        }
    }


    // =====================================================
    // CREATE MATERIAL
    // =====================================================

    @PostMapping
    public ResponseEntity<?> createMaterial(
            @RequestHeader("Authorization")
            String authHeader,

            @RequestBody
            Map<String, Object> request
    ) {

        try {

            String username =
                    getFacultyUsername(authHeader);


            String title =
                    (String) request.get("title");

            String type =
                    (String) request.get("type");

            String url =
                    (String) request.get("url");


            if (
                    title == null ||
                    title.isBlank()
            ) {
                return ResponseEntity.badRequest()
                        .body(
                                Map.of(
                                        "message",
                                        "Title is required"
                                )
                        );
            }


            if (
                    type == null ||
                    type.isBlank()
            ) {
                return ResponseEntity.badRequest()
                        .body(
                                Map.of(
                                        "message",
                                        "Type is required"
                                )
                        );
            }


            if (
                    url == null ||
                    url.isBlank()
            ) {
                return ResponseEntity.badRequest()
                        .body(
                                Map.of(
                                        "message",
                                        "URL is required"
                                )
                        );
            }


            Object courseIdObject =
                    request.get("courseId");

            if (courseIdObject == null) {
                return ResponseEntity.badRequest()
                        .body(
                                Map.of(
                                        "message",
                                        "courseId is required"
                                )
                        );
            }


            Long courseId =
                    Long.valueOf(
                            courseIdObject.toString()
                    );


            Course course =
                    courseRepository
                            .findById(courseId)
                            .orElse(null);


            if (course == null) {
                return ResponseEntity
                        .notFound()
                        .build();
            }


            // =================================================
            // IMPORTANT SECURITY CHECK
            // =================================================

            boolean assigned =
                    courseRepository
                            .findCoursesByFacultyUsername(
                                    username
                            )
                            .stream()
                            .anyMatch(
                                    c ->
                                            c.getId()
                                                    .equals(courseId)
                            );


            if (!assigned) {

                return ResponseEntity
                        .status(403)
                        .body(
                                Map.of(
                                        "message",
                                        "This course is not assigned to you"
                                )
                        );
            }


            StudyMaterial material =
                    new StudyMaterial();

            material.setTitle(
                    title.trim()
            );

            material.setDescription(
                    (String) request.get("description")
            );

            material.setSubject(
                    (String) request.get("subject")
            );

            material.setType(
                    type.trim().toUpperCase()
            );

            material.setUrl(
                    url.trim()
            );

            material.setCourse(course);


            Object published =
                    request.get("published");

            if (published != null) {

                material.setPublished(
                        Boolean.parseBoolean(
                                published.toString()
                        )
                );
            }


            return ResponseEntity.ok(
                    studyMaterialRepository.save(
                            material
                    )
            );

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    e.getMessage()
                            )
                    );
        }
    }


    // =====================================================
    // DELETE MATERIAL
    // =====================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMaterial(
            @RequestHeader("Authorization")
            String authHeader,

            @PathVariable Long id
    ) {

        try {

            String username =
                    getFacultyUsername(authHeader);


            StudyMaterial material =
                    studyMaterialRepository
                            .findById(id)
                            .orElse(null);


            if (material == null) {
                return ResponseEntity
                        .notFound()
                        .build();
            }


            Course course =
                    material.getCourse();


            boolean assigned =
                    courseRepository
                            .findCoursesByFacultyUsername(
                                    username
                            )
                            .stream()
                            .anyMatch(
                                    c ->
                                            c.getId()
                                                    .equals(
                                                            course.getId()
                                                    )
                            );


            if (!assigned) {

                return ResponseEntity
                        .status(403)
                        .body(
                                Map.of(
                                        "message",
                                        "You cannot delete this material"
                                )
                        );
            }


            studyMaterialRepository.delete(
                    material
            );


            return ResponseEntity
                    .noContent()
                    .build();

        } catch (Exception e) {

            return ResponseEntity
                    .status(401)
                    .body(
                            Map.of(
                                    "message",
                                    e.getMessage()
                            )
                    );
        }
    }


    // =====================================================
    // PUBLISH / UNPUBLISH
    // =====================================================

    @PutMapping("/{id}/publish")
    public ResponseEntity<?> updatePublishedStatus(
            @RequestHeader("Authorization")
            String authHeader,

            @PathVariable Long id,

            @RequestBody
            Map<String, Boolean> request
    ) {

        try {

            String username =
                    getFacultyUsername(authHeader);


            StudyMaterial material =
                    studyMaterialRepository
                            .findById(id)
                            .orElse(null);


            if (material == null) {
                return ResponseEntity
                        .notFound()
                        .build();
            }


            Course course =
                    material.getCourse();


            boolean assigned =
                    courseRepository
                            .findCoursesByFacultyUsername(
                                    username
                            )
                            .stream()
                            .anyMatch(
                                    c ->
                                            c.getId()
                                                    .equals(
                                                            course.getId()
                                                    )
                            );


            if (!assigned) {

                return ResponseEntity
                        .status(403)
                        .body(
                                Map.of(
                                        "message",
                                        "You cannot modify this material"
                                )
                        );
            }


            Boolean published =
                    request.get("published");


            if (published == null) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                Map.of(
                                        "message",
                                        "published is required"
                                )
                        );
            }


            material.setPublished(
                    published
            );


            return ResponseEntity.ok(
                    studyMaterialRepository.save(
                            material
                    )
            );

        } catch (Exception e) {

            return ResponseEntity
                    .status(401)
                    .body(
                            Map.of(
                                    "message",
                                    e.getMessage()
                            )
                    );
        }
    }
}