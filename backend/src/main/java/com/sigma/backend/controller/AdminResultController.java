package com.sigma.backend.controller;

import com.sigma.backend.entity.Course;
import com.sigma.backend.entity.Student;
import com.sigma.backend.entity.StudentResult;
import com.sigma.backend.repository.CourseRepository;
import com.sigma.backend.repository.StudentRepository;
import com.sigma.backend.repository.StudentResultRepository;
import com.sigma.backend.service.NotificationService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/results")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminResultController {

    private final StudentResultRepository resultRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final NotificationService notificationService;


    public AdminResultController(
        StudentResultRepository resultRepository,
        StudentRepository studentRepository,
        CourseRepository courseRepository,
        NotificationService notificationService
) {
    this.resultRepository = resultRepository;
    this.studentRepository = studentRepository;
    this.courseRepository = courseRepository;
    this.notificationService = notificationService;
}


    // =====================================================
    // GET ALL RESULTS
    // =====================================================

    @GetMapping
    public ResponseEntity<List<StudentResult>> getAllResults() {

        return ResponseEntity.ok(
                resultRepository.findAll()
        );
    }


    // =====================================================
    // CREATE RESULT
    // =====================================================

    @PostMapping
    public ResponseEntity<?> createResult(
            @RequestBody Map<String, Object> request
    ) {

        // -------------------------------------------------
        // Student ID
        // -------------------------------------------------

        Object studentIdObject =
                request.get("studentId");

        if (studentIdObject == null) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "studentId is required"
                            )
                    );
        }


        Long studentId;

        try {

            studentId =
                    Long.valueOf(
                            studentIdObject.toString()
                    );

        } catch (NumberFormatException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "Invalid studentId"
                            )
                    );
        }


        // -------------------------------------------------
        // Find Student
        // -------------------------------------------------

        Student student =
                studentRepository
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


        // -------------------------------------------------
        // Course ID
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
        // Find Course
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
        // Required fields
        // -------------------------------------------------

        String examName =
                (String) request.get("examName");


        Object marksObject =
                request.get("marksObtained");


        Object totalObject =
                request.get("totalMarks");


        if (
                examName == null ||
                examName.isBlank() ||
                marksObject == null ||
                totalObject == null
        ) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "examName, marksObtained and totalMarks are required"
                            )
                    );
        }


        Double marksObtained;

        Double totalMarks;


        try {

            marksObtained =
                    Double.parseDouble(
                            marksObject.toString()
                    );

            totalMarks =
                    Double.parseDouble(
                            totalObject.toString()
                    );

        } catch (NumberFormatException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "Invalid marks"
                            )
                    );
        }


        // -------------------------------------------------
        // Validate marks
        // -------------------------------------------------

        if (marksObtained < 0) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "Marks cannot be negative"
                            )
                    );
        }


        if (totalMarks <= 0) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "Total marks must be greater than zero"
                            )
                    );
        }


        if (marksObtained > totalMarks) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "Marks obtained cannot exceed total marks"
                            )
                    );
        }


        // -------------------------------------------------
        // Create result
        // -------------------------------------------------

        StudentResult result =
                new StudentResult();


        result.setStudent(student);

        result.setCourse(course);

        result.setExamName(examName);

        result.setMarksObtained(
                marksObtained
        );

        result.setTotalMarks(
                totalMarks
        );


        // -------------------------------------------------
        // Exam date
        // -------------------------------------------------

        Object examDateObject =
                request.get("examDate");


        if (
                examDateObject != null &&
                !examDateObject
                        .toString()
                        .isBlank()
        ) {

            try {

                result.setExamDate(
                        LocalDate.parse(
                                examDateObject.toString()
                        )
                );

            } catch (Exception e) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                Map.of(
                                        "message",
                                        "Invalid examDate. Use YYYY-MM-DD"
                                )
                        );
            }
        }


        // -------------------------------------------------
        // Rank
        // -------------------------------------------------

        Object rankObject =
                request.get("rank");


        if (rankObject != null) {

            try {

                result.setRank(
                        Integer.valueOf(
                                rankObject.toString()
                        )
                );

            } catch (NumberFormatException e) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                Map.of(
                                        "message",
                                        "Invalid rank"
                                )
                        );
            }
        }


        // -------------------------------------------------
        // Remarks
        // -------------------------------------------------

        Object remarksObject =
                request.get("remarks");


        if (remarksObject != null) {

            result.setRemarks(
                    remarksObject.toString()
            );
        }


        // -------------------------------------------------
        // Save
        // -------------------------------------------------

        StudentResult savedResult =
        resultRepository.save(result);

// =====================================================
// NOTIFY STUDENT ABOUT PUBLISHED RESULT
// =====================================================

notificationService.createNotification(
        student,
        "Result Published",
        "Your result for " + savedResult.getExamName()
                + " has been published. Check your dashboard to view your performance.",
        "RESULT"
);

return ResponseEntity.ok(
        savedResult
);
    }


    // =====================================================
    // UPDATE RESULT
    // =====================================================

    @PutMapping("/{id}")
    public ResponseEntity<?> updateResult(
            @PathVariable Long id,
            @RequestBody Map<String, Object> request
    ) {

        StudentResult result =
                resultRepository
                        .findById(id)
                        .orElse(null);


        if (result == null) {

            return ResponseEntity
                    .notFound()
                    .build();
        }


        // -------------------------------------------------
        // Exam name
        // -------------------------------------------------

        if (request.containsKey("examName")) {

            String examName =
                    request
                            .get("examName")
                            .toString();


            if (!examName.isBlank()) {

                result.setExamName(
                        examName
                );
            }
        }


        // -------------------------------------------------
        // Marks
        // -------------------------------------------------

        if (
                request.containsKey(
                        "marksObtained"
                )
        ) {

            try {

                result.setMarksObtained(
                        Double.parseDouble(
                                request
                                        .get(
                                                "marksObtained"
                                        )
                                        .toString()
                        )
                );

            } catch (NumberFormatException e) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                Map.of(
                                        "message",
                                        "Invalid marksObtained"
                                )
                        );
            }
        }


        // -------------------------------------------------
        // Total marks
        // -------------------------------------------------

        if (
                request.containsKey(
                        "totalMarks"
                )
        ) {

            try {

                result.setTotalMarks(
                        Double.parseDouble(
                                request
                                        .get(
                                                "totalMarks"
                                        )
                                        .toString()
                        )
                );

            } catch (NumberFormatException e) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                Map.of(
                                        "message",
                                        "Invalid totalMarks"
                                )
                        );
            }
        }


        // -------------------------------------------------
        // Validate marks
        // -------------------------------------------------

        if (
                result.getMarksObtained() < 0 ||
                result.getTotalMarks() <= 0 ||
                result.getMarksObtained()
                        > result.getTotalMarks()
        ) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "Invalid marks"
                            )
                    );
        }


        // -------------------------------------------------
        // Exam date
        // -------------------------------------------------

        if (
                request.containsKey(
                        "examDate"
                )
        ) {

            Object examDateObject =
                    request.get("examDate");


            if (
                    examDateObject != null &&
                    !examDateObject
                            .toString()
                            .isBlank()
            ) {

                try {

                    result.setExamDate(
                            LocalDate.parse(
                                    examDateObject
                                            .toString()
                            )
                    );

                } catch (Exception e) {

                    return ResponseEntity
                            .badRequest()
                            .body(
                                    Map.of(
                                            "message",
                                            "Invalid examDate"
                                    )
                            );
                }
            }
        }


        // -------------------------------------------------
        // Rank
        // -------------------------------------------------

        if (request.containsKey("rank")) {

            Object rankObject =
                    request.get("rank");


            if (rankObject != null) {

                try {

                    result.setRank(
                            Integer.valueOf(
                                    rankObject
                                            .toString()
                            )
                    );

                } catch (NumberFormatException e) {

                    return ResponseEntity
                            .badRequest()
                            .body(
                                    Map.of(
                                            "message",
                                            "Invalid rank"
                                    )
                            );
                }
            }
        }


        // -------------------------------------------------
        // Remarks
        // -------------------------------------------------

        if (
                request.containsKey(
                        "remarks"
                )
        ) {

            Object remarksObject =
                    request.get("remarks");


            result.setRemarks(
                    remarksObject == null
                            ? null
                            : remarksObject.toString()
            );
        }


        // -------------------------------------------------
        // Course
        // -------------------------------------------------

        if (
                request.containsKey(
                        "courseId"
                )
        ) {

            Long courseId;

            try {

                courseId =
                        Long.valueOf(
                                request
                                        .get(
                                                "courseId"
                                        )
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


            result.setCourse(course);
        }


        StudentResult updatedResult =
                resultRepository.save(result);


        return ResponseEntity.ok(
                updatedResult
        );
    }


    // =====================================================
    // DELETE RESULT
    // =====================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResult(
            @PathVariable Long id
    ) {

        if (
                !resultRepository
                        .existsById(id)
        ) {

            return ResponseEntity
                    .notFound()
                    .build();
        }


        resultRepository.deleteById(id);


        return ResponseEntity
                .noContent()
                .build();
    }

    // =====================================================
// GET ALL STUDENTS FOR ADMIN RESULT FORM
// =====================================================

@GetMapping("/students")
public ResponseEntity<List<Map<String, Object>>> getStudentsForAdmin() {

    List<Map<String, Object>> students =
            studentRepository.findAll()
                    .stream()
                    .map(student -> {

                        Map<String, Object> data =
                                new java.util.HashMap<>();

                        data.put("id", student.getId());
                        data.put("name", student.getName());
                        data.put("email", student.getEmail());
                        data.put("phone", student.getPhone());

                        return data;
                    })
                    .toList();

    return ResponseEntity.ok(students);
}
}