package com.sigma.backend.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "student_results")
public class StudentResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(
            name = "student_id",
            nullable = false
    )
    private Student student;

    @ManyToOne
    @JoinColumn(
            name = "course_id",
            nullable = false
    )
    private Course course;

    @Column(nullable = false)
    private String examName;

    private LocalDate examDate;

    @Column(nullable = false)
    private Double marksObtained;

    @Column(nullable = false)
    private Double totalMarks;

    private Double percentage;

    @Column(name = "student_rank")
private Integer rank;

    @Column(length = 1000)
    private String remarks;

    @Column(nullable = false)
    private LocalDateTime createdAt;


    public StudentResult() {
    }


    @PrePersist
    @PreUpdate
    protected void calculateResult() {

        if (
                totalMarks != null &&
                totalMarks > 0 &&
                marksObtained != null
        ) {

            percentage =
                    (marksObtained / totalMarks) * 100;
        }

        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }


    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }


    public String getExamName() {
        return examName;
    }

    public void setExamName(String examName) {
        this.examName = examName;
    }


    public LocalDate getExamDate() {
        return examDate;
    }

    public void setExamDate(LocalDate examDate) {
        this.examDate = examDate;
    }


    public Double getMarksObtained() {
        return marksObtained;
    }

    public void setMarksObtained(
            Double marksObtained
    ) {
        this.marksObtained = marksObtained;
    }


    public Double getTotalMarks() {
        return totalMarks;
    }

    public void setTotalMarks(
            Double totalMarks
    ) {
        this.totalMarks = totalMarks;
    }


    public Double getPercentage() {
        return percentage;
    }

    public void setPercentage(
            Double percentage
    ) {
        this.percentage = percentage;
    }


    public Integer getRank() {
        return rank;
    }

    public void setRank(Integer rank) {
        this.rank = rank;
    }


    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }


    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(
            LocalDateTime createdAt
    ) {
        this.createdAt = createdAt;
    }
}