package com.sigma.backend.controller;

import com.sigma.backend.entity.Course;
import com.sigma.backend.entity.Faculty;
import com.sigma.backend.repository.CourseRepository;
import com.sigma.backend.repository.FacultyRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/faculty")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminFacultyController {

    private final FacultyRepository facultyRepository;
    private final CourseRepository courseRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminFacultyController(
            FacultyRepository facultyRepository,
            CourseRepository courseRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.facultyRepository = facultyRepository;
        this.courseRepository = courseRepository;
        this.passwordEncoder = passwordEncoder;
    }


    // =====================================================
    // GET ALL FACULTY
    // =====================================================

    @GetMapping
    public ResponseEntity<List<Faculty>> getAllFaculty() {

        List<Faculty> facultyList =
                facultyRepository.findAll();

        /*
         * Never send passwords to the frontend.
         */

        facultyList.forEach(faculty ->
                faculty.setPassword(null)
        );

        return ResponseEntity.ok(facultyList);
    }


    // =====================================================
    // GET FACULTY BY ID
    // =====================================================

    @GetMapping("/{id}")
    public ResponseEntity<?> getFaculty(
            @PathVariable Long id
    ) {

        Faculty faculty =
                facultyRepository
                        .findById(id)
                        .orElse(null);

        if (faculty == null) {

            return ResponseEntity
                    .status(404)
                    .body(
                            Map.of(
                                    "message",
                                    "Faculty not found"
                            )
                    );
        }

        faculty.setPassword(null);

        return ResponseEntity.ok(faculty);
    }


    // =====================================================
    // CREATE FACULTY
    // =====================================================

    @PostMapping
    public ResponseEntity<?> createFaculty(
            @RequestBody Map<String, Object> request
    ) {

        String username =
                request.get("username") != null
                        ? request.get("username")
                                .toString()
                                .trim()
                        : "";

        String password =
                request.get("password") != null
                        ? request.get("password")
                                .toString()
                        : "";

        String name =
                request.get("name") != null
                        ? request.get("name")
                                .toString()
                                .trim()
                        : "";

        String email =
                request.get("email") != null
                        ? request.get("email")
                                .toString()
                                .trim()
                        : "";

        String phone =
                request.get("phone") != null
                        ? request.get("phone")
                                .toString()
                                .trim()
                        : "";

        String designation =
                request.get("designation") != null
                        ? request.get("designation")
                                .toString()
                                .trim()
                        : "";

        String subject =
                request.get("subject") != null
                        ? request.get("subject")
                                .toString()
                                .trim()
                        : "";

        String experience =
                request.get("experience") != null
                        ? request.get("experience")
                                .toString()
                                .trim()
                        : "";

        String description =
                request.get("description") != null
                        ? request.get("description")
                                .toString()
                                .trim()
                        : "";


        // =================================================
        // VALIDATION
        // =================================================

        if (username.isBlank()) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "Username is required"
                            )
                    );
        }

        if (password.isBlank()) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "Password is required"
                            )
                    );
        }

        if (name.isBlank()) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "Name is required"
                            )
                    );
        }

        if (email.isBlank()) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "Email is required"
                            )
                    );
        }


        // =================================================
        // CHECK DUPLICATE USERNAME
        // =================================================

        if (
                facultyRepository
                        .findByUsername(username)
                        .isPresent()
        ) {

            return ResponseEntity
                    .status(409)
                    .body(
                            Map.of(
                                    "message",
                                    "Username already exists"
                            )
                    );
        }


        // =================================================
        // CHECK DUPLICATE EMAIL
        // =================================================

        if (
                facultyRepository
                        .findByEmail(email)
                        .isPresent()
        ) {

            return ResponseEntity
                    .status(409)
                    .body(
                            Map.of(
                                    "message",
                                    "Email already exists"
                            )
                    );
        }


        // =================================================
        // CREATE FACULTY
        // =================================================

        Faculty faculty = new Faculty();

        faculty.setUsername(username);

        /*
         * IMPORTANT:
         * Password must be encoded exactly like the
         * existing faculty authentication expects.
         */

        faculty.setPassword(
                passwordEncoder.encode(password)
        );

        faculty.setName(name);
        faculty.setEmail(email);

        faculty.setPhone(
                phone.isBlank() ? null : phone
        );

        faculty.setDesignation(
                designation.isBlank()
                        ? null
                        : designation
        );

        faculty.setSubject(
                subject.isBlank()
                        ? null
                        : subject
        );

        faculty.setExperience(
                experience.isBlank()
                        ? null
                        : experience
        );

        faculty.setDescription(
                description.isBlank()
                        ? null
                        : description
        );

        /*
         * New faculty must be approved by admin
         * before being treated as active faculty.
         */

        faculty.setStatus("PENDING");


        Faculty savedFaculty =
                facultyRepository.save(faculty);

        savedFaculty.setPassword(null);

        return ResponseEntity.ok(savedFaculty);
    }


    // =====================================================
    // UPDATE FACULTY
    // =====================================================

    @PutMapping("/{id}")
    public ResponseEntity<?> updateFaculty(
            @PathVariable Long id,
            @RequestBody Map<String, Object> request
    ) {

        Faculty faculty =
                facultyRepository
                        .findById(id)
                        .orElse(null);

        if (faculty == null) {

            return ResponseEntity
                    .status(404)
                    .body(
                            Map.of(
                                    "message",
                                    "Faculty not found"
                            )
                    );
        }


        // =================================================
        // BASIC INFORMATION
        // =================================================

        if (request.get("name") != null) {

            String name =
                    request.get("name")
                            .toString()
                            .trim();

            if (name.isBlank()) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                Map.of(
                                        "message",
                                        "Name cannot be empty"
                                )
                        );
            }

            faculty.setName(name);
        }


        if (request.get("email") != null) {

            String email =
                    request.get("email")
                            .toString()
                            .trim();

            if (email.isBlank()) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                Map.of(
                                        "message",
                                        "Email cannot be empty"
                                )
                        );
            }

            /*
             * Don't allow another faculty to use
             * the same email.
             */

            Faculty existing =
                    facultyRepository
                            .findByEmail(email)
                            .orElse(null);

            if (
                    existing != null &&
                    !existing.getId()
                            .equals(id)
            ) {

                return ResponseEntity
                        .status(409)
                        .body(
                                Map.of(
                                        "message",
                                        "Email already exists"
                                )
                        );
            }

            faculty.setEmail(email);
        }


        if (request.get("phone") != null) {

            String phone =
                    request.get("phone")
                            .toString()
                            .trim();

            faculty.setPhone(
                    phone.isBlank()
                            ? null
                            : phone
            );
        }


        if (request.get("designation") != null) {

            String designation =
                    request.get("designation")
                            .toString()
                            .trim();

            faculty.setDesignation(
                    designation.isBlank()
                            ? null
                            : designation
            );
        }


        if (request.get("subject") != null) {

            String subject =
                    request.get("subject")
                            .toString()
                            .trim();

            faculty.setSubject(
                    subject.isBlank()
                            ? null
                            : subject
            );
        }


        if (request.get("experience") != null) {

            String experience =
                    request.get("experience")
                            .toString()
                            .trim();

            faculty.setExperience(
                    experience.isBlank()
                            ? null
                            : experience
            );
        }


        if (request.get("description") != null) {

            String description =
                    request.get("description")
                            .toString()
                            .trim();

            faculty.setDescription(
                    description.isBlank()
                            ? null
                            : description
            );
        }


        // =================================================
        // PASSWORD
        // =================================================

        /*
         * Password is optional during update.
         *
         * If admin leaves it out, the existing password
         * remains unchanged.
         */

        if (request.get("password") != null) {

            String password =
                    request.get("password")
                            .toString();

            if (!password.isBlank()) {

                faculty.setPassword(
                        passwordEncoder.encode(password)
                );
            }
        }


        // =================================================
        // SAVE
        // =================================================

        Faculty updatedFaculty =
                facultyRepository.save(faculty);

        updatedFaculty.setPassword(null);

        return ResponseEntity.ok(updatedFaculty);
    }


    // =====================================================
    // APPROVE FACULTY
    // =====================================================

    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveFaculty(
            @PathVariable Long id
    ) {

        Faculty faculty =
                facultyRepository
                        .findById(id)
                        .orElse(null);

        if (faculty == null) {

            return ResponseEntity
                    .status(404)
                    .body(
                            Map.of(
                                    "message",
                                    "Faculty not found"
                            )
                    );
        }

        faculty.setStatus("APPROVED");

        Faculty updatedFaculty =
                facultyRepository.save(faculty);

        updatedFaculty.setPassword(null);

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Faculty approved successfully",

                        "faculty",
                        updatedFaculty
                )
        );
    }


    // =====================================================
    // REJECT FACULTY
    // =====================================================

    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectFaculty(
            @PathVariable Long id
    ) {

        Faculty faculty =
                facultyRepository
                        .findById(id)
                        .orElse(null);

        if (faculty == null) {

            return ResponseEntity
                    .status(404)
                    .body(
                            Map.of(
                                    "message",
                                    "Faculty not found"
                            )
                    );
        }

        faculty.setStatus("REJECTED");

        Faculty updatedFaculty =
                facultyRepository.save(faculty);

        updatedFaculty.setPassword(null);

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Faculty rejected",

                        "faculty",
                        updatedFaculty
                )
        );
    }


    // =====================================================
    // DISABLE FACULTY
    // =====================================================

    @PutMapping("/{id}/disable")
    public ResponseEntity<?> disableFaculty(
            @PathVariable Long id
    ) {

        Faculty faculty =
                facultyRepository
                        .findById(id)
                        .orElse(null);

        if (faculty == null) {

            return ResponseEntity
                    .status(404)
                    .body(
                            Map.of(
                                    "message",
                                    "Faculty not found"
                            )
                    );
        }

        faculty.setStatus("DISABLED");

        Faculty updatedFaculty =
                facultyRepository.save(faculty);

        updatedFaculty.setPassword(null);

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Faculty disabled",

                        "faculty",
                        updatedFaculty
                )
        );
    }


    // =====================================================
    // GET COURSES ASSIGNED TO FACULTY
    // =====================================================

    @GetMapping("/{id}/courses")
    public ResponseEntity<?> getFacultyCourses(
            @PathVariable Long id
    ) {

        Faculty faculty =
                facultyRepository
                        .findById(id)
                        .orElse(null);

        if (faculty == null) {

            return ResponseEntity
                    .status(404)
                    .body(
                            Map.of(
                                    "message",
                                    "Faculty not found"
                            )
                    );
        }

        String username =
                faculty.getUsername();


        List<Course> allCourses =
                courseRepository.findAll();


        List<Course> assignedCourses =
                allCourses.stream()
                        .filter(course ->
                                course.getFaculty() != null &&
                                course.getFaculty()
                                        .contains(username)
                        )
                        .toList();


        return ResponseEntity.ok(
                assignedCourses
        );
    }


    // =====================================================
    // ASSIGN FACULTY TO COURSE
    // =====================================================

    @PostMapping("/{id}/courses/{courseId}")
    public ResponseEntity<?> assignFacultyToCourse(
            @PathVariable Long id,
            @PathVariable Long courseId
    ) {

        Faculty faculty =
                facultyRepository
                        .findById(id)
                        .orElse(null);

        if (faculty == null) {

            return ResponseEntity
                    .status(404)
                    .body(
                            Map.of(
                                    "message",
                                    "Faculty not found"
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


        // =================================================
        // INITIALIZE FACULTY LIST
        // =================================================

        if (course.getFaculty() == null) {

            course.setFaculty(
                    new ArrayList<>()
            );
        }


        String username =
                faculty.getUsername();


        // =================================================
        // CHECK DUPLICATE ASSIGNMENT
        // =================================================

        if (
                course.getFaculty()
                        .contains(username)
        ) {

            return ResponseEntity
                    .status(409)
                    .body(
                            Map.of(
                                    "message",
                                    "Faculty is already assigned to this course"
                            )
                    );
        }


        // =================================================
        // ASSIGN
        // =================================================

        course.getFaculty()
                .add(username);


        Course updatedCourse =
                courseRepository.save(course);


        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Faculty assigned successfully",

                        "course",
                        updatedCourse
                )
        );
    }


    // =====================================================
    // REMOVE FACULTY FROM COURSE
    // =====================================================

    @DeleteMapping("/{id}/courses/{courseId}")
    public ResponseEntity<?> removeFacultyFromCourse(
            @PathVariable Long id,
            @PathVariable Long courseId
    ) {

        Faculty faculty =
                facultyRepository
                        .findById(id)
                        .orElse(null);

        if (faculty == null) {

            return ResponseEntity
                    .status(404)
                    .body(
                            Map.of(
                                    "message",
                                    "Faculty not found"
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


        if (course.getFaculty() == null) {

            return ResponseEntity
                    .status(404)
                    .body(
                            Map.of(
                                    "message",
                                    "Faculty is not assigned to this course"
                            )
                    );
        }


        String username =
                faculty.getUsername();


        boolean removed =
                course.getFaculty()
                        .remove(username);


        if (!removed) {

            return ResponseEntity
                    .status(404)
                    .body(
                            Map.of(
                                    "message",
                                    "Faculty is not assigned to this course"
                            )
                    );
        }


        courseRepository.save(course);


        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Faculty removed from course successfully"
                )
        );
    }


    // =====================================================
    // DELETE FACULTY
    // =====================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFaculty(
            @PathVariable Long id
    ) {

        Faculty faculty =
                facultyRepository
                        .findById(id)
                        .orElse(null);

        if (faculty == null) {

            return ResponseEntity
                    .status(404)
                    .body(
                            Map.of(
                                    "message",
                                    "Faculty not found"
                            )
                    );
        }


        String username =
                faculty.getUsername();


        // =================================================
        // REMOVE FACULTY FROM ALL COURSES FIRST
        // =================================================

        List<Course> courses =
                courseRepository.findAll();


        for (Course course : courses) {

            if (
                    course.getFaculty() != null &&
                    course.getFaculty()
                            .remove(username)
            ) {

                courseRepository.save(course);
            }
        }


        // =================================================
        // DELETE FACULTY
        // =================================================

        facultyRepository.delete(faculty);


        return ResponseEntity
                .noContent()
                .build();
    }
}