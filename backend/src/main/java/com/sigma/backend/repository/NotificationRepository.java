package com.sigma.backend.repository;

import com.sigma.backend.entity.Notification;
import com.sigma.backend.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByStudentOrderByCreatedAtDesc(Student student);

    List<Notification> findByStudentAndReadFalseOrderByCreatedAtDesc(Student student);

    long countByStudentAndReadFalse(Student student);
}