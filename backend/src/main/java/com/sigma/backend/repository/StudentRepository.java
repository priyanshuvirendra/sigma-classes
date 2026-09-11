package com.sigma.backend.repository;

import com.sigma.backend.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudentRepository
        extends JpaRepository<Student, Long> {

    Optional<Student> findByEmail(String email);

    boolean existsByEmail(String email);

    Optional<Student> findByGoogleId(String googleId);

    Optional<Student> findByPasswordResetToken(String passwordResetToken);

    Optional<Student> findByVerificationToken(
            String verificationToken
    );
}