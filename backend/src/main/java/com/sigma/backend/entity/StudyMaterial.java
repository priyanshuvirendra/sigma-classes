package com.sigma.backend.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "study_materials")
public class StudyMaterial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    // =====================================================
    // COURSE
    // =====================================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "course_id",
            nullable = false
    )
    private Course course;


    // =====================================================
    // MATERIAL DETAILS
    // =====================================================

    @Column(nullable = false)
    private String title;


    @Column(length = 2000)
    private String description;


    /*
     * Examples:
     *
     * PDF
     * VIDEO
     * LINK
     */

    @Column(nullable = false)
    private String type;


    /*
     * For PDF:
     * Google Drive PDF URL
     *
     * For VIDEO:
     * YouTube URL
     *
     * For LINK:
     * Any external resource URL
     */

    @Column(nullable = false, length = 2000)
    private String url;


    // =====================================================
    // SUBJECT
    // =====================================================

    private String subject;


    // =====================================================
    // PUBLISHED STATUS
    // =====================================================

    /*
     * false = Admin has saved it but students cannot see it
     *
     * true = Students can see the material
     */

    @Column(nullable = false)
    private boolean published = false;


    // =====================================================
    // CREATED AT
    // =====================================================

    @Column(nullable = false)
    private LocalDateTime createdAt;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public StudyMaterial() {
    }


    // =====================================================
    // PRE PERSIST
    // =====================================================

    @PrePersist
    protected void onCreate() {

        if (createdAt == null) {

            createdAt =
                    LocalDateTime.now();
        }
    }


    // =====================================================
    // GETTERS / SETTERS
    // =====================================================

    public Long getId() {

        return id;
    }

    public void setId(Long id) {

        this.id = id;
    }


    public Course getCourse() {

        return course;
    }

    public void setCourse(Course course) {

        this.course = course;
    }


    public String getTitle() {

        return title;
    }

    public void setTitle(String title) {

        this.title = title;
    }


    public String getDescription() {

        return description;
    }

    public void setDescription(
            String description
    ) {

        this.description = description;
    }


    public String getType() {

        return type;
    }

    public void setType(String type) {

        this.type = type;
    }


    public String getUrl() {

        return url;
    }

    public void setUrl(String url) {

        this.url = url;
    }


    public String getSubject() {

        return subject;
    }

    public void setSubject(String subject) {

        this.subject = subject;
    }


    public boolean isPublished() {

        return published;
    }

    public void setPublished(
            boolean published
    ) {

        this.published = published;
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