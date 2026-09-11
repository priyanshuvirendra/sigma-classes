package com.sigma.backend.controller;

import com.sigma.backend.entity.Faculty;
import com.sigma.backend.repository.FacultyRepository;
import com.sigma.backend.security.JwtService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/faculty/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class FacultyAuthController {

    private final FacultyRepository facultyRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public FacultyAuthController(
            FacultyRepository facultyRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.facultyRepository = facultyRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }


    // =====================================================
    // FACULTY LOGIN
    // =====================================================

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody Map<String, String> request
    ) {

        String username = request.get("username");
        String password = request.get("password");


        // =================================================
        // VALIDATION
        // =================================================

        if (
                username == null ||
                username.isBlank() ||
                password == null ||
                password.isBlank()
        ) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "Username and password are required"
                            )
                    );
        }


        // =================================================
        // FIND FACULTY
        // =================================================

        Faculty faculty =
                facultyRepository
                        .findByUsername(username.trim())
                        .orElse(null);


        if (faculty == null) {

            return ResponseEntity
                    .status(401)
                    .body(
                            Map.of(
                                    "message",
                                    "Invalid username or password"
                            )
                    );
        }


        // =================================================
        // CHECK ACCOUNT STATUS
        // =================================================

        String status = faculty.getStatus();


        /*
         * Only APPROVED faculty members can log in.
         *
         * Existing records with a null status are also
         * temporarily treated as approved so that existing
         * faculty accounts don't suddenly stop working.
         */

        if (
                status != null &&
                !"APPROVED".equalsIgnoreCase(status)
        ) {

            if ("PENDING".equalsIgnoreCase(status)) {

                return ResponseEntity
                        .status(403)
                        .body(
                                Map.of(
                                        "message",
                                        "Your faculty account is awaiting admin approval"
                                )
                        );
            }


            if ("REJECTED".equalsIgnoreCase(status)) {

                return ResponseEntity
                        .status(403)
                        .body(
                                Map.of(
                                        "message",
                                        "Your faculty account has been rejected"
                                )
                        );
            }


            if ("DISABLED".equalsIgnoreCase(status)) {

                return ResponseEntity
                        .status(403)
                        .body(
                                Map.of(
                                        "message",
                                        "Your faculty account has been disabled"
                                )
                        );
            }


            return ResponseEntity
                    .status(403)
                    .body(
                            Map.of(
                                    "message",
                                    "Your faculty account is not active"
                            )
                    );
        }


        // =================================================
        // CHECK PASSWORD
        // =================================================

        boolean passwordMatches =
                passwordEncoder.matches(
                        password,
                        faculty.getPassword()
                );


        if (!passwordMatches) {

            return ResponseEntity
                    .status(401)
                    .body(
                            Map.of(
                                    "message",
                                    "Invalid username or password"
                            )
                    );
        }


        // =================================================
        // GENERATE JWT
        // =================================================

        String token =
                jwtService.generateToken(
                        faculty.getUsername(),
                        "FACULTY"
                );


        // =================================================
        // RETURN LOGIN RESPONSE
        // =================================================

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Login successful",

                        "username",
                        faculty.getUsername(),

                        "name",
                        faculty.getName(),

                        "role",
                        "FACULTY",

                        "token",
                        token
                )
        );
    }
}