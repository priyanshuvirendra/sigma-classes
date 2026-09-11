package com.sigma.backend.controller;

import com.sigma.backend.entity.Faculty;
import com.sigma.backend.repository.FacultyRepository;
import com.sigma.backend.security.JwtService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/faculty/profile")
@CrossOrigin(origins = "http://localhost:5173")
public class FacultyProfileController {

    private final FacultyRepository facultyRepository;
    private final JwtService jwtService;

    public FacultyProfileController(
            FacultyRepository facultyRepository,
            JwtService jwtService
    ) {
        this.facultyRepository = facultyRepository;
        this.jwtService = jwtService;
    }


    // =====================================================
    // GET PROFILE
    // =====================================================

    @GetMapping
    public ResponseEntity<?> getProfile(
            @RequestHeader(value = "Authorization", required = false)
            String authHeader
    ) {

        try {

            // -------------------------------------------------
            // VALIDATE TOKEN
            // -------------------------------------------------

            String username = validateAndGetUsername(authHeader);

            if (username == null) {
                return ResponseEntity
                        .status(401)
                        .body(
                                Map.of(
                                        "message",
                                        "Invalid or expired token"
                                )
                        );
            }


            // -------------------------------------------------
            // FIND FACULTY
            // -------------------------------------------------

            Faculty faculty =
                    facultyRepository
                            .findByUsername(username)
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


            // -------------------------------------------------
            // RETURN SAFE PROFILE DATA
            // DO NOT RETURN PASSWORD
            // -------------------------------------------------

            return ResponseEntity.ok(
                    createProfileResponse(faculty)
            );


        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(401)
                    .body(
                            Map.of(
                                    "message",
                                    "Invalid or expired token"
                            )
                    );
        }
    }



    // =====================================================
    // UPDATE PROFILE
    // =====================================================

    @PutMapping
    public ResponseEntity<?> updateProfile(
            @RequestHeader(value = "Authorization", required = false)
            String authHeader,

            @RequestBody Faculty data
    ) {

        try {

            // -------------------------------------------------
            // VALIDATE TOKEN
            // -------------------------------------------------

            String username = validateAndGetUsername(authHeader);

            if (username == null) {

                return ResponseEntity
                        .status(401)
                        .body(
                                Map.of(
                                        "message",
                                        "Invalid or expired token"
                                )
                        );
            }


            // -------------------------------------------------
            // FIND LOGGED-IN FACULTY
            // -------------------------------------------------

            Faculty faculty =
                    facultyRepository
                            .findByUsername(username)
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


            // -------------------------------------------------
            // BASIC VALIDATION
            // -------------------------------------------------

            if (
                    data.getName() == null ||
                    data.getName().trim().isEmpty()
            ) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                Map.of(
                                        "message",
                                        "Name is required"
                                )
                        );
            }


            if (
                    data.getEmail() == null ||
                    data.getEmail().trim().isEmpty()
            ) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                Map.of(
                                        "message",
                                        "Email is required"
                                )
                        );
            }


            // -------------------------------------------------
            // UPDATE EDITABLE FIELDS
            // -------------------------------------------------
            //
            // IMPORTANT:
            // We deliberately DO NOT update:
            //
            // - id
            // - username
            // - password
            //
            // These should not be changed through this profile
            // endpoint.
            // -------------------------------------------------

            faculty.setName(
                    data.getName().trim()
            );

            faculty.setEmail(
                    data.getEmail().trim()
            );

            faculty.setPhone(
    cleanValue(data.getPhone())
);

            faculty.setDesignation(
                    cleanValue(data.getDesignation())
            );

            faculty.setSubject(
                    cleanValue(data.getSubject())
            );

            faculty.setExperience(
                    cleanValue(data.getExperience())
            );

            faculty.setDescription(
                    cleanValue(data.getDescription())
            );


            // -------------------------------------------------
            // SAVE
            // -------------------------------------------------

            Faculty updatedFaculty =
                    facultyRepository.save(faculty);


            // -------------------------------------------------
            // RETURN UPDATED SAFE DATA
            // -------------------------------------------------

            return ResponseEntity.ok(
                    createProfileResponse(updatedFaculty)
            );


        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    e.getMessage() != null
                                            ? e.getMessage()
                                            : "Unable to update profile"
                            )
                    );
        }
    }



    // =====================================================
    // TOKEN VALIDATION
    // =====================================================

    private String validateAndGetUsername(
            String authHeader
    ) {

        if (
                authHeader == null ||
                !authHeader.startsWith("Bearer ")
        ) {

            return null;
        }


        String token =
                authHeader.substring(7);


        if (
                token == null ||
                token.trim().isEmpty()
        ) {

            return null;
        }


        if (!jwtService.isTokenValid(token)) {

            return null;
        }


        String role =
                jwtService.extractRole(token);


        if (!"FACULTY".equals(role)) {

            return null;
        }


        return jwtService.extractUsername(token);
    }



    // =====================================================
    // SAFE PROFILE RESPONSE
    // =====================================================

    private Map<String, Object> createProfileResponse(
            Faculty faculty
    ) {

        Map<String, Object> response =
                new LinkedHashMap<>();


        response.put(
                "id",
                faculty.getId()
        );

        response.put(
                "username",
                faculty.getUsername()
        );

        response.put(
                "name",
                faculty.getName()
        );

        response.put(
                "email",
                faculty.getEmail()
        );

        response.put(
    "phone",
    faculty.getPhone()
);

        response.put(
                "designation",
                faculty.getDesignation()
        );

        response.put(
                "subject",
                faculty.getSubject()
        );

        response.put(
                "experience",
                faculty.getExperience()
        );

        response.put(
                "description",
                faculty.getDescription()
        );


        return response;
    }



    // =====================================================
    // CLEAN OPTIONAL VALUES
    // =====================================================

    private String cleanValue(String value) {

        if (value == null) {
            return null;
        }

        String cleaned =
                value.trim();

        return cleaned.isEmpty()
                ? null
                : cleaned;
    }
}