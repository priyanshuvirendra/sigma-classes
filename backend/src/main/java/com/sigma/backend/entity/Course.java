package com.sigma.backend.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "courses")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    // =====================================================
    // BASIC COURSE INFORMATION
    // =====================================================

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, length = 1000)
    private String description;

    private String category;

    private String duration;

    private Double price;

    private String imageUrl;

    @Column(nullable = false)
    private boolean active = true;


    // =====================================================
    // ADDITIONAL COURSE INFORMATION
    // =====================================================

    private LocalDate startDate;

    private String mode;

    private String timing;


    // =====================================================
    // CURRICULUM
    // =====================================================

    @ElementCollection
    @CollectionTable(
            name = "course_curriculum",
            joinColumns = @JoinColumn(name = "course_id")
    )
    @Column(name = "item")
    private List<String> curriculum =
            new ArrayList<>();


    // =====================================================
    // FACULTY
    // =====================================================

    @ElementCollection
    @CollectionTable(
            name = "course_faculty",
            joinColumns = @JoinColumn(name = "course_id")
    )
    @Column(name = "teacher")
    private List<String> faculty =
            new ArrayList<>();


    // =====================================================
    // FEATURES
    // =====================================================

    @ElementCollection
    @CollectionTable(
            name = "course_features",
            joinColumns = @JoinColumn(name = "course_id")
    )
    @Column(name = "feature")
    private List<String> features =
            new ArrayList<>();


    // =====================================================
    // TAGS
    // =====================================================

    @ElementCollection
    @CollectionTable(
            name = "course_tags",
            joinColumns = @JoinColumn(name = "course_id")
    )
    @Column(name = "tag")
    private List<String> tags =
            new ArrayList<>();


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public Course() {
    }


    // =====================================================
    // ID
    // =====================================================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    // =====================================================
    // NAME
    // =====================================================

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }


    // =====================================================
    // DESCRIPTION
    // =====================================================

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }


    // =====================================================
    // CATEGORY
    // =====================================================

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }


    // =====================================================
    // DURATION
    // =====================================================

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }


    // =====================================================
    // PRICE
    // =====================================================

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }


    // =====================================================
    // IMAGE URL
    // =====================================================

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }


    // =====================================================
    // ACTIVE
    // =====================================================

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }


    // =====================================================
    // START DATE
    // =====================================================

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }


    // =====================================================
    // MODE
    // =====================================================

    public String getMode() {
        return mode;
    }

    public void setMode(String mode) {
        this.mode = mode;
    }


    // =====================================================
    // TIMING
    // =====================================================

    public String getTiming() {
        return timing;
    }

    public void setTiming(String timing) {
        this.timing = timing;
    }


    // =====================================================
    // CURRICULUM
    // =====================================================

    public List<String> getCurriculum() {
        return curriculum;
    }

    public void setCurriculum(
            List<String> curriculum
    ) {
        this.curriculum =
                curriculum;
    }


    // =====================================================
    // FACULTY
    // =====================================================

    public List<String> getFaculty() {
        return faculty;
    }

    public void setFaculty(
            List<String> faculty
    ) {
        this.faculty =
                faculty;
    }


    // =====================================================
    // FEATURES
    // =====================================================

    public List<String> getFeatures() {
        return features;
    }

    public void setFeatures(
            List<String> features
    ) {
        this.features =
                features;
    }


    // =====================================================
    // TAGS
    // =====================================================

    public List<String> getTags() {
        return tags;
    }

    public void setTags(
            List<String> tags
    ) {
        this.tags =
                tags;
    }
}