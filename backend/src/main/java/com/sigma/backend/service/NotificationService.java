package com.sigma.backend.service;

import com.sigma.backend.entity.Enrollment;
import com.sigma.backend.entity.Notification;
import com.sigma.backend.entity.Student;
import com.sigma.backend.repository.EnrollmentRepository;
import com.sigma.backend.repository.NotificationRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final EnrollmentRepository enrollmentRepository;

    public NotificationService(
            NotificationRepository notificationRepository,
            EnrollmentRepository enrollmentRepository
    ) {
        this.notificationRepository = notificationRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    // =====================================================
    // CREATE NOTIFICATION FOR ONE STUDENT
    // =====================================================

    public Notification createNotification(
            Student student,
            String title,
            String message,
            String type
    ) {

        Notification notification = new Notification();

        notification.setStudent(student);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type);
        notification.setRead(false);

        return notificationRepository.save(notification);
    }

    // =====================================================
    // NOTIFY ALL ACTIVE STUDENTS OF A COURSE
    // =====================================================

    public void notifyActiveStudentsOfCourse(
            Long courseId,
            String title,
            String message,
            String type
    ) {

        List<Enrollment> enrollments =
                enrollmentRepository.findByCourseIdAndStatus(
                        courseId,
                        "ACTIVE"
                );

        for (Enrollment enrollment : enrollments) {

            Student student = enrollment.getStudent();

            createNotification(
                    student,
                    title,
                    message,
                    type
            );
        }
    }
}