package com.sigma.backend.controller;

import com.sigma.backend.entity.Student;
import com.sigma.backend.repository.StudentRepository;
import com.sigma.backend.repository.EnrollmentRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/students")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminStudentController {

    private final StudentRepository studentRepository;
    private final EnrollmentRepository enrollmentRepository;

    public AdminStudentController(
            StudentRepository studentRepository,
            EnrollmentRepository enrollmentRepository
    ) {
        this.studentRepository = studentRepository;
        this.enrollmentRepository = enrollmentRepository;
    }


    // =====================================================
    // GET ALL STUDENTS
    // =====================================================

    @GetMapping
    public ResponseEntity<?> getAllStudents() {

        List<Student> students =
                studentRepository.findAll();

        // Never expose passwords
        students.forEach(student ->
                student.setPassword(null)
        );

        return ResponseEntity.ok(students);
    }


    // =====================================================
    // GET STUDENT BY ID
    // =====================================================

    @GetMapping("/{id}")
    public ResponseEntity<?> getStudentById(
            @PathVariable Long id
    ) {

        Student student =
                studentRepository.findById(id).orElse(null);

        if (student == null) {
            return ResponseEntity.notFound().build();
        }

        // Never expose password
        student.setPassword(null);

        return ResponseEntity.ok(student);
    }


    // =====================================================
    // UPDATE STUDENT
    // =====================================================

    @PutMapping("/{id}")
    public ResponseEntity<?> updateStudent(
            @PathVariable Long id,
            @RequestBody Student updatedStudent
    ) {

        Student student =
                studentRepository.findById(id).orElse(null);

        if (student == null) {
            return ResponseEntity.notFound().build();
        }

        // Check if new email already belongs to another student
        if (updatedStudent.getEmail() != null
                && !updatedStudent.getEmail()
                .equalsIgnoreCase(student.getEmail())) {

            Student existingStudent =
                    studentRepository
                            .findByEmail(updatedStudent.getEmail())
                            .orElse(null);

            if (existingStudent != null
                    && !existingStudent.getId().equals(id)) {

                return ResponseEntity.badRequest()
                        .body(Map.of(
                                "message",
                                "Email is already registered"
                        ));
            }
        }

        // Update name
        if (updatedStudent.getName() != null
                && !updatedStudent.getName().isBlank()) {

            student.setName(
                    updatedStudent.getName().trim()
            );
        }

        // Update email
        if (updatedStudent.getEmail() != null
                && !updatedStudent.getEmail().isBlank()) {

            student.setEmail(
                    updatedStudent.getEmail()
                            .trim()
                            .toLowerCase()
            );
        }

        // Update phone
        if (updatedStudent.getPhone() != null
                && !updatedStudent.getPhone().isBlank()) {

            student.setPhone(
                    updatedStudent.getPhone().trim()
            );
        }

        Student savedStudent =
                studentRepository.save(student);

        // Never return password
        savedStudent.setPassword(null);

        return ResponseEntity.ok(savedStudent);
    }


    // =====================================================
    // DELETE STUDENT
    // =====================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStudent(
            @PathVariable Long id
    ) {

        Student student =
                studentRepository.findById(id).orElse(null);

        if (student == null) {
            return ResponseEntity.notFound().build();
        }

        // Do not delete students who have enrollments
        boolean hasEnrollments =
                !enrollmentRepository
                        .findByStudent(student)
                        .isEmpty();

        if (hasEnrollments) {

            return ResponseEntity
                    .status(409)
                    .body(
                            Map.of(
                                    "message",
                                    "This student cannot be deleted because they have course enrollments. Remove the enrollments first."
                            )
                    );
        }

        studentRepository.delete(student);

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Student deleted successfully"
                )
        );
    }
}