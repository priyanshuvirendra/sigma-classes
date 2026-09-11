package com.sigma.backend.controller;

import com.sigma.backend.entity.Student;
import com.sigma.backend.repository.StudentRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/student")
@CrossOrigin(origins = "http://localhost:5173")
public class StudentProfileController {

    private final StudentRepository studentRepository;

    public StudentProfileController(
            StudentRepository studentRepository
    ) {
        this.studentRepository = studentRepository;
    }


    // =====================================================
    // GET STUDENT PROFILE
    // =====================================================

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(
            Authentication authentication
    ) {

        // Username comes from JWT subject
        String email =
                authentication.getName();


        // Find student
        Student student =
                studentRepository
                        .findByEmail(email)
                        .orElse(null);


        if (student == null) {

            return ResponseEntity
                    .notFound()
                    .build();
        }


        // Never return password
        student.setPassword(null);


        return ResponseEntity.ok(student);
    }
}