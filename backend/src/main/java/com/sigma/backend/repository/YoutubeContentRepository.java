package com.sigma.backend.repository;

import com.sigma.backend.entity.YoutubeContent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface YoutubeContentRepository
        extends JpaRepository<YoutubeContent, Long> {

    List<YoutubeContent>
    findByPublishedTrueOrderByDisplayOrderAsc();

    List<YoutubeContent>
    findByTypeAndPublishedTrueOrderByDisplayOrderAsc(
            String type
    );

    // =====================================================
    // FACULTY CONTENT
    // =====================================================

    List<YoutubeContent>
    findByFacultyUsernameOrderByDisplayOrderAsc(
            String facultyUsername
    );

    List<YoutubeContent>
    findByFacultyUsernameAndPublishedTrueOrderByDisplayOrderAsc(
            String facultyUsername
    );

    long countByFacultyUsername(
            String facultyUsername
    );
}