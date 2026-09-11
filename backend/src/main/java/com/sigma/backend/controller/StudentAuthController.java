package com.sigma.backend.controller;


import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.sigma.backend.entity.Student;
import com.sigma.backend.repository.StudentRepository;
import com.sigma.backend.security.GoogleTokenVerifierService;
import com.sigma.backend.security.JwtService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/students/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class StudentAuthController {

    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final GoogleTokenVerifierService googleTokenVerifierService;

    public StudentAuthController(
            StudentRepository studentRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            GoogleTokenVerifierService googleTokenVerifierService
    ) {
        this.studentRepository = studentRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.googleTokenVerifierService = googleTokenVerifierService;
    }


    // =====================================================
    // STUDENT LOGIN - EMAIL / PASSWORD
    // =====================================================

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody Map<String, String> request
    ) {

        String email = request.get("email");
        String password = request.get("password");

        // Validate request

        if (email == null ||
            email.isBlank() ||
            password == null ||
            password.isBlank()) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "Email and password are required"
                            )
                    );
        }


        // Find student

        Student student =
                studentRepository
                        .findByEmail(email)
                        .orElse(null);


        // Student not found

        if (student == null) {

            return ResponseEntity
                    .status(401)
                    .body(
                            Map.of(
                                    "message",
                                    "Invalid email or password"
                            )
                    );
        }


        // =====================================================
        // CHECK EMAIL VERIFICATION
        // =====================================================

        if (!student.isEmailVerified()) {

            return ResponseEntity
                    .status(403)
                    .body(
                            Map.of(
                                    "message",
                                    "Please verify your email before logging in",
                                    "emailVerified",
                                    false
                            )
                    );
        }


        // =====================================================
        // VERIFY PASSWORD
        // =====================================================

        boolean passwordMatches =
                passwordEncoder.matches(
                        password,
                        student.getPassword()
                );

        if (!passwordMatches) {

            return ResponseEntity
                    .status(401)
                    .body(
                            Map.of(
                                    "message",
                                    "Invalid email or password"
                            )
                    );
        }


        // Generate JWT

        String token =
                jwtService.generateToken(
                        student.getEmail(),
                        "STUDENT"
                );


        // Return login response

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Login successful",

                        "email",
                        student.getEmail(),

                        "name",
                        student.getName(),

                        "token",
                        token
                )
        );
    }


    // =====================================================
    // STUDENT LOGIN - GOOGLE
    // =====================================================

    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(
            @RequestBody Map<String, String> request
    ) {

        String credential = request.get("credential");

        // Validate request

        if (credential == null || credential.isBlank()) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "Google credential is required"
                            )
                    );
        }


        try {

            // =================================================
            // VERIFY GOOGLE ID TOKEN
            // =================================================

            GoogleIdToken.Payload payload =
                    googleTokenVerifierService.verify(credential);


            // =================================================
            // GET GOOGLE USER INFORMATION
            // =================================================

            String googleId =
                    payload.getSubject();

            String email =
                    payload.getEmail();

            String name =
                    (String) payload.get("name");


            // =================================================
            // CHECK GOOGLE EMAIL VERIFICATION
            // =================================================

            Boolean emailVerified =
                    (Boolean) payload.get("email_verified");

            if (!Boolean.TRUE.equals(emailVerified)) {

                return ResponseEntity
                        .status(401)
                        .body(
                                Map.of(
                                        "message",
                                        "Google email is not verified"
                                )
                        );
            }


            // =================================================
            // FIND STUDENT BY GOOGLE ID
            // =================================================

            Student student =
                    studentRepository
                            .findByGoogleId(googleId)
                            .orElse(null);


            // =================================================
            // IF GOOGLE ID DOES NOT EXIST,
            // CHECK WHETHER EMAIL ALREADY EXISTS
            // =================================================

            if (student == null) {

                student =
                        studentRepository
                                .findByEmail(email)
                                .orElse(null);
            }


            // =================================================
            // EXISTING STUDENT
            // =================================================

            if (student != null) {

                // Link Google account if not already linked

                if (student.getGoogleId() == null ||
                    !student.getGoogleId().equals(googleId)) {

                    student.setGoogleId(googleId);
                }

                // Google has verified the email

                student.setEmailVerified(true);

                studentRepository.save(student);

            }


            // =================================================
            // NEW GOOGLE STUDENT
            // =================================================

            else {

                student = new Student();

                student.setName(
                        name != null && !name.isBlank()
                                ? name
                                : "Google Student"
                );

                student.setEmail(email);

                student.setGoogleId(googleId);

                // Google has already verified the email

                student.setEmailVerified(true);

                // No fake password or phone

                student.setPassword(null);
                student.setPhone(null);

                studentRepository.save(student);
            }


            // =================================================
            // GENERATE NORMAL SIGMA JWT
            // =================================================

            String token =
                    jwtService.generateToken(
                            student.getEmail(),
                            "STUDENT"
                    );


            // =================================================
            // RETURN LOGIN RESPONSE
            // =================================================

            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "Google login successful",

                            "email",
                            student.getEmail(),

                            "name",
                            student.getName(),

                            "token",
                            token
                    )
            );

        } catch (Exception e) {

            return ResponseEntity
                    .status(401)
                    .body(
                            Map.of(
                                    "message",
                                    "Invalid Google credential"
                            )
                    );
        }
    }
}