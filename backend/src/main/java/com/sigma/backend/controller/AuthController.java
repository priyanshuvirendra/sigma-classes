package com.sigma.backend.controller;

import com.sigma.backend.entity.Admin;
import com.sigma.backend.entity.Faculty;
import com.sigma.backend.entity.Student;

import com.sigma.backend.repository.AdminRepository;
import com.sigma.backend.repository.FacultyRepository;
import com.sigma.backend.repository.StudentRepository;

import com.sigma.backend.security.JwtService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AdminRepository adminRepository;
    private final FacultyRepository facultyRepository;
    private final StudentRepository studentRepository;

    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(
            AdminRepository adminRepository,
            FacultyRepository facultyRepository,
            StudentRepository studentRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.adminRepository = adminRepository;
        this.facultyRepository = facultyRepository;
        this.studentRepository = studentRepository;

        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    // =====================================================
    // COMMON LOGIN
    // ADMIN + FACULTY + STUDENT
    // =====================================================

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody Map<String, String> request) {

        String identifier = request.get("identifier");

        String password = request.get("password");

        // =====================================================
        // VALIDATE REQUEST
        // =====================================================

        if (identifier == null ||
                identifier.isBlank() ||
                password == null ||
                password.isBlank()) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "Username/email and password are required"));
        }

        // =====================================================
        // 1. CHECK ADMIN
        // =====================================================

        Admin admin = adminRepository
                .findByUsername(identifier)
                .orElse(null);

        if (admin != null) {

            boolean passwordMatches = passwordEncoder.matches(
                    password,
                    admin.getPassword());

            if (passwordMatches) {

                String token = jwtService.generateToken(
                        admin.getUsername(),
                        "ADMIN");

                return ResponseEntity.ok(
                        Map.of(
                                "message",
                                "Login successful",

                                "identifier",
                                admin.getUsername(),

                                "username",
                                admin.getUsername(),

                                "role",
                                "ADMIN",

                                "token",
                                token));
            }
        }

        Faculty faculty = facultyRepository
                .findByUsername(identifier)
                .orElse(null);

        System.out.println("=================================");
        System.out.println("LOGIN IDENTIFIER: " + identifier);
        System.out.println("FACULTY FOUND: " + (faculty != null));

        if (faculty != null) {

            boolean passwordMatches = passwordEncoder.matches(
                    password,
                    faculty.getPassword());

            System.out.println(
                    "FACULTY PASSWORD MATCHES: " +
                            passwordMatches);

            System.out.println("=================================");

            if (passwordMatches) {

                String token = jwtService.generateToken(
                        faculty.getUsername(),
                        "FACULTY");

                return ResponseEntity.ok(
                        Map.of(
                                "message",
                                "Login successful",

                                "identifier",
                                faculty.getUsername(),

                                "username",
                                faculty.getUsername(),

                                "name",
                                faculty.getName(),

                                "role",
                                "FACULTY",

                                "token",
                                token));
            }
        }
        // =====================================================
        // 2. CHECK FACULTY
        // =====================================================

        // =====================================================
        // 3. CHECK STUDENT
        // =====================================================

        Student student = studentRepository
                .findByEmail(identifier)
                .orElse(null);

        if (student != null) {

            // =================================================
            // EMAIL VERIFICATION
            // =================================================

            if (!student.isEmailVerified()) {

                return ResponseEntity
                        .status(403)
                        .body(
                                Map.of(
                                        "message",
                                        "Please verify your email before logging in",

                                        "emailVerified",
                                        false));
            }

            // =================================================
            // PASSWORD
            // =================================================

            boolean passwordMatches = passwordEncoder.matches(
                    password,
                    student.getPassword());

            if (passwordMatches) {

                String token = jwtService.generateToken(
                        student.getEmail(),
                        "STUDENT");

                return ResponseEntity.ok(
                        Map.of(
                                "message",
                                "Login successful",

                                "identifier",
                                student.getEmail(),

                                "email",
                                student.getEmail(),

                                "name",
                                student.getName(),

                                "role",
                                "STUDENT",

                                "token",
                                token));
            }
        }

        // =====================================================
        // INVALID LOGIN
        // =====================================================

        return ResponseEntity
                .status(401)
                .body(
                        Map.of(
                                "message",
                                "Invalid username/email or password"));
    }
}