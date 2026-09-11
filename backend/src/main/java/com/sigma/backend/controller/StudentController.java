package com.sigma.backend.controller;

import com.sigma.backend.entity.Student;
import com.sigma.backend.repository.StudentRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.sigma.backend.service.EmailService;
import java.util.Map;

import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://localhost:5173")
public class StudentController {

private final StudentRepository studentRepository;
private final PasswordEncoder passwordEncoder;
private final EmailService emailService;

 public StudentController(
        StudentRepository studentRepository,
        PasswordEncoder passwordEncoder,
        EmailService emailService
) {
    this.studentRepository = studentRepository;
    this.passwordEncoder = passwordEncoder;
    this.emailService = emailService;
}

    // =====================================================
    // STUDENT REGISTRATION
    // =====================================================
@PostMapping("/register")
public ResponseEntity<?> register(
        @RequestBody Student student
) {

    // =====================================================
    // CHECK DUPLICATE EMAIL
    // =====================================================

    if (studentRepository.existsByEmail(student.getEmail())) {

        return ResponseEntity
                .badRequest()
                .body(
                        Map.of(
                                "message",
                                "Email is already registered"
                        )
                );
    }


    // =====================================================
// VALIDATE PHONE NUMBER
// =====================================================

String phone = student.getPhone();

if (phone == null || !phone.trim().matches("^[6-9]\\d{9}$")) {

    return ResponseEntity
            .badRequest()
            .body(
                    Map.of(
                            "message",
                            "Please enter a valid 10-digit Indian mobile number"
                    )
            );
}

    // =====================================================
    // ENCODE PASSWORD
    // =====================================================

    student.setPassword(
            passwordEncoder.encode(
                    student.getPassword()
            )
    );


    // =====================================================
    // CREATE EMAIL VERIFICATION TOKEN
    // =====================================================

    String verificationToken =
            UUID.randomUUID().toString();

    student.setEmailVerified(false);

    student.setVerificationToken(
            verificationToken
    );

    student.setVerificationTokenExpiry(
            LocalDateTime.now().plusHours(24)
    );


    // =====================================================
    // SAVE STUDENT
    // =====================================================

    Student savedStudent =
            studentRepository.save(student);


    // =====================================================
    // SEND WELCOME EMAIL
    // =====================================================

    try {

        emailService.sendWelcomeEmail(
                savedStudent.getName(),
                savedStudent.getEmail()
        );

    } catch (Exception e) {

        System.err.println(
                "Welcome email could not be sent to "
                        + savedStudent.getEmail()
        );

        e.printStackTrace();
    }


    // =====================================================
    // SEND EMAIL VERIFICATION
    // =====================================================

    try {

        emailService.sendVerificationEmail(
                savedStudent.getName(),
                savedStudent.getEmail(),
                savedStudent.getVerificationToken()
        );

    } catch (Exception e) {

        System.err.println(
                "Verification email could not be sent to "
                        + savedStudent.getEmail()
        );

        e.printStackTrace();
    }


    // =====================================================
    // NEVER EXPOSE PASSWORD OR TOKEN
    // =====================================================

    savedStudent.setPassword(null);
    savedStudent.setVerificationToken(null);
    savedStudent.setVerificationTokenExpiry(null);


    return ResponseEntity.ok(savedStudent);
}

// =====================================================
// VERIFY STUDENT EMAIL
// =====================================================

@GetMapping("/verify-email")
public ResponseEntity<?> verifyEmail(
        @RequestParam String token
) {

    Student student =
            studentRepository
                    .findByVerificationToken(token)
                    .orElse(null);

    // Invalid token

    if (student == null) {

        return ResponseEntity
                .badRequest()
                .body(
                        Map.of(
                                "message",
                                "Invalid or expired verification link"
                        )
                );
    }


    // Already verified

    if (student.isEmailVerified()) {

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Email is already verified"
                )
        );
    }


    // Check token expiry

    if (
            student.getVerificationTokenExpiry() == null ||
            student.getVerificationTokenExpiry()
                    .isBefore(LocalDateTime.now())
    ) {

        return ResponseEntity
                .badRequest()
                .body(
                        Map.of(
                                "message",
                                "Verification link has expired"
                        )
                );
    }


    // Verify email

    student.setEmailVerified(true);

    // Invalidate token after successful verification

    student.setVerificationToken(null);
    student.setVerificationTokenExpiry(null);


    studentRepository.save(student);


    return ResponseEntity.ok(
            Map.of(
                    "message",
                    "Email verified successfully"
            )
    );
}

// =====================================================
// RESEND VERIFICATION EMAIL
// =====================================================

@PostMapping("/resend-verification")
public ResponseEntity<?> resendVerification(
        @RequestBody Map<String, String> request
) {

    String email = request.get("email");

    if (email == null || email.isBlank()) {

        return ResponseEntity
                .badRequest()
                .body(
                        Map.of(
                                "message",
                                "Email address is required"
                        )
                );
    }

    email = email.trim().toLowerCase();


    // =====================================================
    // FIND STUDENT
    // =====================================================

    Student student =
            studentRepository
                    .findByEmail(email)
                    .orElse(null);


    // Don't reveal whether an email exists

    if (student == null) {

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "If an account exists with this email, a verification email has been sent"
                )
        );
    }


    // =====================================================
    // CHECK ALREADY VERIFIED
    // =====================================================

    if (student.isEmailVerified()) {

        return ResponseEntity
                .badRequest()
                .body(
                        Map.of(
                                "message",
                                "This email address is already verified"
                        )
                );
    }


    // =====================================================
    // GENERATE NEW TOKEN
    // =====================================================

    String verificationToken =
            UUID.randomUUID().toString();

    student.setVerificationToken(
            verificationToken
    );

    student.setVerificationTokenExpiry(
            LocalDateTime.now().plusHours(24)
    );


    studentRepository.save(student);


    // =====================================================
    // SEND VERIFICATION EMAIL
    // =====================================================

    try {

        emailService.sendVerificationEmail(
                student.getName(),
                student.getEmail(),
                verificationToken
        );

    } catch (Exception e) {

        System.err.println(
                "Verification email could not be sent to "
                        + student.getEmail()
        );

        e.printStackTrace();

        return ResponseEntity
                .internalServerError()
                .body(
                        Map.of(
                                "message",
                                "Unable to send verification email. Please try again later."
                        )
                );
    }


    return ResponseEntity.ok(
            Map.of(
                    "message",
                    "Verification email sent successfully"
            )
    );
}

// =====================================================
// FORGOT PASSWORD
// =====================================================

@PostMapping("/forgot-password")
public ResponseEntity<?> forgotPassword(
        @RequestBody Map<String, String> request
) {

    String email = request.get("email");

    if (email == null || email.isBlank()) {

        return ResponseEntity
                .badRequest()
                .body(
                        Map.of(
                                "message",
                                "Email address is required"
                        )
                );
    }

    email = email.trim().toLowerCase();


    // =====================================================
    // FIND STUDENT
    // =====================================================

    Student student =
            studentRepository
                    .findByEmail(email)
                    .orElse(null);


    /*
     * Don't reveal whether the email exists.
     */

    if (student == null) {

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "If an account exists with this email, a password reset link has been sent"
                )
        );
    }


    // =====================================================
    // GENERATE RESET TOKEN
    // =====================================================

    String resetToken =
            UUID.randomUUID().toString();


    student.setPasswordResetToken(
            resetToken
    );

    student.setPasswordResetTokenExpiry(
            LocalDateTime.now().plusHours(1)
    );


    studentRepository.save(student);


    // =====================================================
    // SEND RESET EMAIL
    // =====================================================

    try {

        emailService.sendPasswordResetEmail(
                student.getName(),
                student.getEmail(),
                resetToken
        );

    } catch (Exception e) {

        System.err.println(
                "Password reset email could not be sent to "
                        + student.getEmail()
        );

        e.printStackTrace();

        return ResponseEntity
                .internalServerError()
                .body(
                        Map.of(
                                "message",
                                "Unable to send password reset email. Please try again later."
                        )
                );
    }


    return ResponseEntity.ok(
            Map.of(
                    "message",
                    "If an account exists with this email, a password reset link has been sent"
            )
    );
}
    // =====================================================
    // GET LOGGED-IN STUDENT PROFILE
    // =====================================================
@GetMapping("/profile")
public ResponseEntity<?> getProfile(
        Authentication authentication
) {

    String email = authentication.getName();

    Student student =
            studentRepository.findByEmail(email)
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

    boolean hasPassword =
            student.getPassword() != null &&
            !student.getPassword().isBlank();

    Map<String, Object> profile = new java.util.HashMap<>();

    profile.put("id", student.getId());
    profile.put("name", student.getName());
    profile.put("email", student.getEmail());
    profile.put("phone", student.getPhone());
    profile.put("emailVerified", student.isEmailVerified());
    profile.put("hasPassword", hasPassword);

    return ResponseEntity.ok(profile);
}

// =====================================================
// RESET PASSWORD
// =====================================================

@PostMapping("/reset-password")
public ResponseEntity<?> resetPassword(
        @RequestBody Map<String, String> request
) {

    String token = request.get("token");
    String newPassword = request.get("newPassword");

    // =====================================================
    // VALIDATE REQUEST
    // =====================================================

    if (token == null || token.isBlank()) {

        return ResponseEntity
                .badRequest()
                .body(
                        Map.of(
                                "message",
                                "Password reset token is required"
                        )
                );
    }

    if (newPassword == null || newPassword.isBlank()) {

        return ResponseEntity
                .badRequest()
                .body(
                        Map.of(
                                "message",
                                "New password is required"
                        )
                );
    }

    if (newPassword.length() < 6) {

        return ResponseEntity
                .badRequest()
                .body(
                        Map.of(
                                "message",
                                "Password must be at least 6 characters"
                        )
                );
    }


    // =====================================================
    // FIND STUDENT BY RESET TOKEN
    // =====================================================

    Student student =
            studentRepository
                    .findByPasswordResetToken(token)
                    .orElse(null);


    if (student == null) {

        return ResponseEntity
                .badRequest()
                .body(
                        Map.of(
                                "message",
                                "Invalid or expired password reset link"
                        )
                );
    }


    // =====================================================
    // CHECK TOKEN EXPIRY
    // =====================================================

    if (
            student.getPasswordResetTokenExpiry() == null ||
            student.getPasswordResetTokenExpiry()
                    .isBefore(LocalDateTime.now())
    ) {

        return ResponseEntity
                .badRequest()
                .body(
                        Map.of(
                                "message",
                                "Password reset link has expired"
                        )
                );
    }


    // =====================================================
    // PREVENT SAME PASSWORD
    // =====================================================

    if (
            passwordEncoder.matches(
                    newPassword,
                    student.getPassword()
            )
    ) {

        return ResponseEntity
                .badRequest()
                .body(
                        Map.of(
                                "message",
                                "New password must be different from your current password"
                        )
                );
    }


    // =====================================================
    // UPDATE PASSWORD
    // =====================================================

    student.setPassword(
            passwordEncoder.encode(newPassword)
    );


    // =====================================================
    // INVALIDATE RESET TOKEN
    // =====================================================

    student.setPasswordResetToken(null);

    student.setPasswordResetTokenExpiry(null);


    studentRepository.save(student);


    return ResponseEntity.ok(
            Map.of(
                    "message",
                    "Password reset successfully"
            )
    );
}
  // =====================================================
// CHANGE / SET STUDENT PASSWORD
// =====================================================

@PutMapping("/change-password")
public ResponseEntity<?> changePassword(
        @RequestBody Map<String, String> request,
        Authentication authentication
) {

    String email = authentication.getName();

    Student student =
            studentRepository.findByEmail(email)
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

    String currentPassword =
            request.get("currentPassword");

    String newPassword =
            request.get("newPassword");


    // =====================================================
    // VALIDATE NEW PASSWORD
    // =====================================================

    if (newPassword == null ||
        newPassword.isBlank()) {

        return ResponseEntity
                .badRequest()
                .body(
                        Map.of(
                                "message",
                                "New password is required"
                        )
                );
    }

    if (newPassword.length() < 6) {

        return ResponseEntity
                .badRequest()
                .body(
                        Map.of(
                                "message",
                                "New password must be at least 6 characters"
                        )
                );
    }


    // =====================================================
    // GOOGLE ACCOUNT WITHOUT PASSWORD
    // =====================================================

    if (student.getPassword() == null ||
        student.getPassword().isBlank()) {

        student.setPassword(
                passwordEncoder.encode(newPassword)
        );

        studentRepository.save(student);

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Password set successfully"
                )
        );
    }


    // =====================================================
    // EXISTING PASSWORD ACCOUNT
    // =====================================================

    if (currentPassword == null ||
        currentPassword.isBlank()) {

        return ResponseEntity
                .badRequest()
                .body(
                        Map.of(
                                "message",
                                "Current password is required"
                        )
                );
    }


    // =====================================================
    // VERIFY CURRENT PASSWORD
    // =====================================================

    if (!passwordEncoder.matches(
            currentPassword,
            student.getPassword()
    )) {

        return ResponseEntity
                .badRequest()
                .body(
                        Map.of(
                                "message",
                                "Current password is incorrect"
                        )
                );
    }


    // =====================================================
    // PREVENT SAME PASSWORD
    // =====================================================

    if (passwordEncoder.matches(
            newPassword,
            student.getPassword()
    )) {

        return ResponseEntity
                .badRequest()
                .body(
                        Map.of(
                                "message",
                                "New password must be different from your current password"
                        )
                );
    }


    // =====================================================
    // UPDATE PASSWORD
    // =====================================================

    student.setPassword(
            passwordEncoder.encode(newPassword)
    );

    studentRepository.save(student);

    return ResponseEntity.ok(
            Map.of(
                    "message",
                    "Password changed successfully"
            )
    );
}
// UPDATE LOGGED-IN STUDENT PROFILE
// =====================================================

@PutMapping("/profile")
public ResponseEntity<?> updateProfile(
        @RequestBody Map<String, String> request,
        Authentication authentication
) {

    String email = authentication.getName();

    Student student =
            studentRepository.findByEmail(email)
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

    String name = request.get("name");
    String phone = request.get("phone");

    if (name == null || name.trim().isEmpty()) {

        return ResponseEntity
                .badRequest()
                .body(
                        Map.of(
                                "message",
                                "Name cannot be empty"
                        )
                );
    }

if (phone == null || !phone.trim().matches("^[6-9]\\d{9}$")) {

    return ResponseEntity
            .badRequest()
            .body(
                    Map.of(
                            "message",
                            "Please enter a valid 10-digit Indian mobile number"
                    )
            );
}
    student.setName(name.trim());
    student.setPhone(phone.trim());

    Student savedStudent =
            studentRepository.save(student);

    // Never expose password
    savedStudent.setPassword(null);

    return ResponseEntity.ok(savedStudent);
}

}