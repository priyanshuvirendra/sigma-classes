package com.sigma.backend.controller;

import com.sigma.backend.entity.Student;
import com.sigma.backend.entity.StudentResult;
import com.sigma.backend.repository.StudentRepository;
import com.sigma.backend.repository.StudentResultRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student/results")
@CrossOrigin(origins = "http://localhost:5173")
public class StudentResultController {

    private final StudentResultRepository resultRepository;
    private final StudentRepository studentRepository;


    public StudentResultController(
            StudentResultRepository resultRepository,
            StudentRepository studentRepository
    ) {
        this.resultRepository = resultRepository;
        this.studentRepository = studentRepository;
    }


    // =====================================================
    // GET MY RESULTS
    // =====================================================

    @GetMapping
    public ResponseEntity<?> getMyResults(
            Authentication authentication
    ) {

        String email = authentication.getName();


        // Find logged-in student

        Student student =
                studentRepository
                        .findByEmail(email)
                        .orElse(null);


        if (student == null) {

            return ResponseEntity
                    .notFound()
                    .build();
        }


        // Get only this student's results

        List<StudentResult> results =
                resultRepository
                        .findByStudent(student);


        return ResponseEntity.ok(results);
    }


    // =====================================================
    // GET A SINGLE RESULT
    // =====================================================

    @GetMapping("/{id}")
    public ResponseEntity<?> getMyResult(
            @PathVariable Long id,
            Authentication authentication
    ) {

        String email = authentication.getName();


        // Find logged-in student

        Student student =
                studentRepository
                        .findByEmail(email)
                        .orElse(null);


        if (student == null) {

            return ResponseEntity
                    .notFound()
                    .build();
        }


        // Find result

        StudentResult result =
                resultRepository
                        .findById(id)
                        .orElse(null);


        if (result == null) {

            return ResponseEntity
                    .notFound()
                    .build();
        }


        // IMPORTANT:
        // Make sure this result belongs
        // to the logged-in student.

        if (
                !result
                        .getStudent()
                        .getId()
                        .equals(student.getId())
        ) {

            return ResponseEntity
                    .status(403)
                    .body(
                            "You are not allowed to access this result"
                    );
        }


        return ResponseEntity.ok(result);
    }
}