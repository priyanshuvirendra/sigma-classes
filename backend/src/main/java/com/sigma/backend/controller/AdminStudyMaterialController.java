package com.sigma.backend.controller;

import com.sigma.backend.entity.Course;
import com.sigma.backend.entity.StudyMaterial;
import com.sigma.backend.repository.CourseRepository;
import com.sigma.backend.repository.StudyMaterialRepository;
import com.sigma.backend.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/materials")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminStudyMaterialController {

    private final StudyMaterialRepository studyMaterialRepository;
    private final CourseRepository courseRepository;
    private final NotificationService notificationService;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public AdminStudyMaterialController(
        StudyMaterialRepository studyMaterialRepository,
        CourseRepository courseRepository,
        NotificationService notificationService
) {

        this.studyMaterialRepository =
                studyMaterialRepository;

        this.courseRepository =
                courseRepository;

                this.notificationService = notificationService;
    }
    


    // =====================================================
    // GET ALL STUDY MATERIALS
    // =====================================================

    @GetMapping
    public ResponseEntity<List<StudyMaterial>> getAllMaterials() {

        return ResponseEntity.ok(
                studyMaterialRepository.findAll()
        );
    }


    // =====================================================
    // CREATE STUDY MATERIAL
    // =====================================================

    @PostMapping
    public ResponseEntity<?> createMaterial(
            @RequestBody Map<String, Object> request
    ) {

        // -------------------------------------------------
        // REQUIRED FIELDS
        // -------------------------------------------------

        String title =
                (String) request.get("title");

        String type =
                (String) request.get("type");

        String url =
                (String) request.get("url");


        if (
                title == null ||
                title.trim().isEmpty()
        ) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "Title is required"
                            )
                    );
        }


        if (
                type == null ||
                type.trim().isEmpty()
        ) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "Type is required"
                            )
                    );
        }


        if (
                url == null ||
                url.trim().isEmpty()
        ) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "URL is required"
                            )
                    );
        }


        // -------------------------------------------------
        // COURSE ID
        // -------------------------------------------------

        Object courseIdObject =
                request.get("courseId");


        if (courseIdObject == null) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "courseId is required"
                            )
                    );
        }


        Long courseId;

        try {

            courseId =
                    Long.valueOf(
                            courseIdObject.toString()
                    );

        } catch (NumberFormatException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "Invalid courseId"
                            )
                    );
        }


        // -------------------------------------------------
        // FIND COURSE
        // -------------------------------------------------

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


        // -------------------------------------------------
        // CREATE MATERIAL
        // -------------------------------------------------

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


        // -------------------------------------------------
        // PUBLISHED
        // -------------------------------------------------

        Object publishedObject =
                request.get("published");


        if (publishedObject != null) {

            material.setPublished(
                    Boolean.parseBoolean(
                            publishedObject.toString()
                    )
            );
        }


        // -------------------------------------------------
        // SAVE
        // -------------------------------------------------

        StudyMaterial savedMaterial =
        studyMaterialRepository.save(
                material
        );

// =====================================================
// NOTIFY STUDENTS IF MATERIAL IS CREATED AS PUBLISHED
// =====================================================

if (savedMaterial.isPublished()) {

    Course savedCourse = savedMaterial.getCourse();

    if (savedCourse != null) {

        notificationService.notifyActiveStudentsOfCourse(
                savedCourse.getId(),
                "New Study Material",
                "A new " + savedMaterial.getTitle()
                        + " has been added to your "
                        + savedCourse.getName()
                        + " course.",
                "MATERIAL"
        );
    }
}

return ResponseEntity.ok(
        savedMaterial
);
    }


    // =====================================================
    // UPDATE STUDY MATERIAL
    // =====================================================

    @PutMapping("/{id}")
    public ResponseEntity<?> updateMaterial(
            @PathVariable Long id,
            @RequestBody Map<String, Object> request
    ) {

        // -------------------------------------------------
        // FIND MATERIAL
        // -------------------------------------------------

        StudyMaterial material =
                studyMaterialRepository
                        .findById(id)
                        .orElse(null);


        if (material == null) {

            return ResponseEntity
                    .notFound()
                    .build();
        }


        // -------------------------------------------------
        // TITLE
        // -------------------------------------------------

        if (request.containsKey("title")) {

            String title =
                    (String) request.get("title");


            if (
                    title == null ||
                    title.trim().isEmpty()
            ) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                Map.of(
                                        "message",
                                        "Title cannot be empty"
                                )
                        );
            }


            material.setTitle(
                    title.trim()
            );
        }


        // -------------------------------------------------
        // DESCRIPTION
        // -------------------------------------------------

        if (request.containsKey("description")) {

            material.setDescription(
                    (String) request.get("description")
            );
        }


        // -------------------------------------------------
        // SUBJECT
        // -------------------------------------------------

        if (request.containsKey("subject")) {

            material.setSubject(
                    (String) request.get("subject")
            );
        }


        // -------------------------------------------------
        // TYPE
        // -------------------------------------------------

        if (request.containsKey("type")) {

            String type =
                    (String) request.get("type");


            if (
                    type == null ||
                    type.trim().isEmpty()
            ) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                Map.of(
                                        "message",
                                        "Type cannot be empty"
                                )
                        );
            }


            material.setType(
                    type.trim().toUpperCase()
            );
        }


        // -------------------------------------------------
        // URL
        // -------------------------------------------------

        if (request.containsKey("url")) {

            String url =
                    (String) request.get("url");


            if (
                    url == null ||
                    url.trim().isEmpty()
            ) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                Map.of(
                                        "message",
                                        "URL cannot be empty"
                                )
                        );
            }


            material.setUrl(
                    url.trim()
            );
        }


        // -------------------------------------------------
        // PUBLISHED
        // -------------------------------------------------

        if (request.containsKey("published")) {

            material.setPublished(
                    Boolean.parseBoolean(
                            request
                                    .get("published")
                                    .toString()
                    )
            );
        }


        // -------------------------------------------------
        // COURSE
        // -------------------------------------------------

        if (request.containsKey("courseId")) {

            Long courseId;

            try {

                courseId =
                        Long.valueOf(
                                request
                                        .get("courseId")
                                        .toString()
                        );

            } catch (NumberFormatException e) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                Map.of(
                                        "message",
                                        "Invalid courseId"
                                )
                        );
            }


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


            material.setCourse(course);
        }


        // -------------------------------------------------
        // SAVE
        // -------------------------------------------------

        StudyMaterial updatedMaterial =
                studyMaterialRepository.save(
                        material
                );


        return ResponseEntity.ok(
                updatedMaterial
        );
    }


    // =====================================================
    // PUBLISH / UNPUBLISH
    // =====================================================

    // =====================================================
// PUBLISH / UNPUBLISH
// =====================================================

@PutMapping("/{id}/publish")
public ResponseEntity<?> updatePublishedStatus(
        @PathVariable Long id,
        @RequestBody Map<String, Boolean> request
) {

    StudyMaterial material =
            studyMaterialRepository
                    .findById(id)
                    .orElse(null);

    if (material == null) {
        return ResponseEntity
                .notFound()
                .build();
    }

    Boolean published = request.get("published");

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

    boolean wasPublished = material.isPublished();

    material.setPublished(published);

    StudyMaterial updatedMaterial =
            studyMaterialRepository.save(material);

    // =====================================================
    // NOTIFY STUDENTS WHEN MATERIAL IS PUBLISHED
    // =====================================================

    if (!wasPublished && published) {

        Course course = material.getCourse();

        if (course != null) {

            notificationService.notifyActiveStudentsOfCourse(
                    course.getId(),
                    "New Study Material",
                    "A new " + material.getTitle()
                            + " has been added to your "
                            + course.getName()
                            + " course.",
                    "MATERIAL"
            );
        }
    }

    return ResponseEntity.ok(updatedMaterial);
}

    // =====================================================
    // DELETE STUDY MATERIAL
    // =====================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMaterial(
            @PathVariable Long id
    ) {

        if (
                !studyMaterialRepository
                        .existsById(id)
        ) {

            return ResponseEntity
                    .notFound()
                    .build();
        }


        studyMaterialRepository.deleteById(
                id
        );


        return ResponseEntity
                .noContent()
                .build();
    }
}