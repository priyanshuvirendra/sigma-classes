package com.sigma.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;


@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

@Column(nullable = false)
@Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
private String name;

@Column(nullable = false, unique = true)
@Email(message = "Please enter a valid email address")
private String email;
@Column(nullable = true)
@Pattern(
    regexp = "^[6-9]\\d{9}$",
    message = "Please enter a valid 10-digit Indian mobile number"
)
private String phone;

@Column(nullable = true)
@Size(
    min = 6,
    max = 100,
    message = "Password must be between 6 and 100 characters"
)
private String password;
@Column(unique = true)
private String googleId;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
private boolean emailVerified = false;

@Column(unique = true)
private String verificationToken;

private LocalDateTime verificationTokenExpiry;
private String passwordResetToken;

private LocalDateTime passwordResetTokenExpiry;


    public Student() {
    }


    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }


    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }


    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }


    public String getPassword() {
        return password;
    }

    public String getGoogleId() {
    return googleId;
}

public void setGoogleId(String googleId) {
    this.googleId = googleId;
}

    public void setPassword(String password) {
        this.password = password;
    }


    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    public boolean isEmailVerified() {
    return emailVerified;
}

public void setEmailVerified(boolean emailVerified) {
    this.emailVerified = emailVerified;
}

public String getVerificationToken() {
    return verificationToken;
}

public void setVerificationToken(String verificationToken) {
    this.verificationToken = verificationToken;
}

public LocalDateTime getVerificationTokenExpiry() {
    return verificationTokenExpiry;
}

public void setVerificationTokenExpiry(
        LocalDateTime verificationTokenExpiry
) {
    this.verificationTokenExpiry = verificationTokenExpiry;
}

public String getPasswordResetToken() {
    return passwordResetToken;
}

public void setPasswordResetToken(String passwordResetToken) {
    this.passwordResetToken = passwordResetToken;
}

public LocalDateTime getPasswordResetTokenExpiry() {
    return passwordResetTokenExpiry;
}

public void setPasswordResetTokenExpiry(
        LocalDateTime passwordResetTokenExpiry
) {
    this.passwordResetTokenExpiry = passwordResetTokenExpiry;
}
}