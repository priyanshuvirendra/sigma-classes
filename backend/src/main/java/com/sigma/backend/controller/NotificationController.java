package com.sigma.backend.controller;

import com.sigma.backend.entity.Notification;
import com.sigma.backend.entity.Student;
import com.sigma.backend.repository.NotificationRepository;
import com.sigma.backend.repository.StudentRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/student/notifications")
@CrossOrigin(origins = "http://localhost:5173")
public class NotificationController {

    private final NotificationRepository notificationRepository;
    private final StudentRepository studentRepository;

    public NotificationController(
            NotificationRepository notificationRepository,
            StudentRepository studentRepository
    ) {
        this.notificationRepository = notificationRepository;
        this.studentRepository = studentRepository;
    }

    // =====================================================
    // GET ALL NOTIFICATIONS
    // =====================================================

    @GetMapping
    public ResponseEntity<?> getNotifications(
            Authentication authentication
    ) {

        String email = authentication.getName();

        Student student = studentRepository
                .findByEmail(email)
                .orElse(null);

        if (student == null) {
            return ResponseEntity
                    .status(404)
                    .body(Map.of("message", "Student not found"));
        }

        List<Notification> notifications =
                notificationRepository
                        .findByStudentOrderByCreatedAtDesc(student);

        return ResponseEntity.ok(notifications);
    }

    // =====================================================
    // GET UNREAD COUNT
    // =====================================================

    @GetMapping("/unread-count")
    public ResponseEntity<?> getUnreadCount(
            Authentication authentication
    ) {

        String email = authentication.getName();

        Student student = studentRepository
                .findByEmail(email)
                .orElse(null);

        if (student == null) {
            return ResponseEntity
                    .status(404)
                    .body(Map.of("message", "Student not found"));
        }

        long unreadCount =
                notificationRepository
                        .countByStudentAndReadFalse(student);

        return ResponseEntity.ok(
                Map.of("count", unreadCount)
        );
    }

    // =====================================================
    // MARK NOTIFICATION AS READ
    // =====================================================

    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(
            @PathVariable Long id,
            Authentication authentication
    ) {

        String email = authentication.getName();

        Student student = studentRepository
                .findByEmail(email)
                .orElse(null);

        if (student == null) {
            return ResponseEntity
                    .status(404)
                    .body(Map.of("message", "Student not found"));
        }

        Notification notification =
                notificationRepository
                        .findById(id)
                        .orElse(null);

        if (notification == null) {
            return ResponseEntity
                    .status(404)
                    .body(Map.of("message", "Notification not found"));
        }

        // Security check:
        // A student can only modify their own notification.
        if (!notification.getStudent().getId().equals(student.getId())) {
            return ResponseEntity
                    .status(403)
                    .body(Map.of("message", "Access denied"));
        }

        notification.setRead(true);

        notificationRepository.save(notification);

        return ResponseEntity.ok(
                Map.of("message", "Notification marked as read")
        );
    }

    // =====================================================
    // MARK ALL NOTIFICATIONS AS READ
    // =====================================================

    @PutMapping("/read-all")
    public ResponseEntity<?> markAllAsRead(
            Authentication authentication
    ) {

        String email = authentication.getName();

        Student student = studentRepository
                .findByEmail(email)
                .orElse(null);

        if (student == null) {
            return ResponseEntity
                    .status(404)
                    .body(Map.of("message", "Student not found"));
        }

        List<Notification> notifications =
                notificationRepository
                        .findByStudentAndReadFalseOrderByCreatedAtDesc(student);

        for (Notification notification : notifications) {
            notification.setRead(true);
        }

        notificationRepository.saveAll(notifications);

        return ResponseEntity.ok(
                Map.of("message", "All notifications marked as read")
        );
    }
}