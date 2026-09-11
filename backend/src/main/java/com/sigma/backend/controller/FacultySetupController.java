package com.sigma.backend.controller;

import com.sigma.backend.entity.Faculty;
import com.sigma.backend.repository.FacultyRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/setup")
@CrossOrigin(origins = "http://localhost:5173")
public class FacultySetupController {

    private final FacultyRepository facultyRepository;
    private final PasswordEncoder passwordEncoder;

    public FacultySetupController(
            FacultyRepository facultyRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.facultyRepository = facultyRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/faculty")
    public String createFaculty() {

        if (
                facultyRepository
                        .findByUsername("faculty1")
                        .isPresent()
        ) {
            return "Faculty account already exists";
        }

        Faculty faculty = new Faculty();

        faculty.setUsername("faculty1");

        faculty.setPassword(
                passwordEncoder.encode("Faculty@3334")
        );

        faculty.setName("Test Faculty");

        faculty.setEmail("faculty@sigma.com");

        faculty.setDesignation("Senior Faculty");

        faculty.setSubject("Mathematics");

        faculty.setExperience("10+ Years");

        faculty.setDescription(
                "Test faculty account for Sigma Classes."
        );

        facultyRepository.save(faculty);

        return "Faculty account created successfully";
    }
}