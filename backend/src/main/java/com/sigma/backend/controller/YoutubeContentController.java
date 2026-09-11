package com.sigma.backend.controller;

import com.sigma.backend.entity.YoutubeContent;
import com.sigma.backend.repository.YoutubeContentRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/youtube-content")
@CrossOrigin(origins = "http://localhost:5173")
public class YoutubeContentController {

    private final YoutubeContentRepository youtubeContentRepository;

    public YoutubeContentController(
            YoutubeContentRepository youtubeContentRepository) {
        this.youtubeContentRepository = youtubeContentRepository;
    }

    /* =====================================================
       GET ALL PUBLISHED YOUTUBE CONTENT
    ===================================================== */

    @GetMapping
    public ResponseEntity<List<YoutubeContent>> getPublishedContent() {

        return ResponseEntity.ok(
                youtubeContentRepository
                        .findByPublishedTrueOrderByDisplayOrderAsc()
        );
    }

    /* =====================================================
       GET PUBLISHED VIDEOS
    ===================================================== */

    @GetMapping("/videos")
    public ResponseEntity<List<YoutubeContent>> getPublishedVideos() {

        return ResponseEntity.ok(
                youtubeContentRepository
                        .findByTypeAndPublishedTrueOrderByDisplayOrderAsc(
                                "VIDEO"
                        )
        );
    }

    /* =====================================================
       GET PUBLISHED PLAYLISTS
    ===================================================== */

    @GetMapping("/playlists")
    public ResponseEntity<List<YoutubeContent>> getPublishedPlaylists() {

        return ResponseEntity.ok(
                youtubeContentRepository
                        .findByTypeAndPublishedTrueOrderByDisplayOrderAsc(
                                "PLAYLIST"
                        )
        );
    }
}