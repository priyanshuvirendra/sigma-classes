package com.sigma.backend.controller;

import com.sigma.backend.entity.YoutubeContent;
import com.sigma.backend.repository.YoutubeContentRepository;
import com.sigma.backend.util.YoutubeUrlUtils;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/youtube-content")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminYoutubeContentController {

    private final YoutubeContentRepository youtubeContentRepository;

    public AdminYoutubeContentController(
            YoutubeContentRepository youtubeContentRepository) {
        this.youtubeContentRepository = youtubeContentRepository;
    }

    /* =====================================================
       GET ALL YOUTUBE CONTENT
    ===================================================== */

    @GetMapping
    public ResponseEntity<List<YoutubeContent>> getAllContent() {

        return ResponseEntity.ok(
                youtubeContentRepository.findAll()
        );
    }

    /* =====================================================
       GET SINGLE CONTENT
    ===================================================== */

    @GetMapping("/{id}")
    public ResponseEntity<?> getContentById(
            @PathVariable Long id) {

        return youtubeContentRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity.notFound().build()
                );
    }

    /* =====================================================
       CREATE CONTENT
    ===================================================== */

    @PostMapping
public ResponseEntity<?> createContent(
        @RequestBody YoutubeContent content) {

    if (content.getType() == null ||
        (!content.getType().equalsIgnoreCase("VIDEO")
                && !content.getType().equalsIgnoreCase("SHORTS")
                && !content.getType().equalsIgnoreCase("PLAYLIST"))) {

    return ResponseEntity.badRequest().body(
            Map.of("message",
                    "Type must be VIDEO, SHORTS or PLAYLIST.")
    );
}

    if (content.getYoutubeUrl() == null ||
            content.getYoutubeUrl().isBlank()) {

        return ResponseEntity.badRequest().body(
                Map.of("message",
                        "YouTube URL is required.")
        );
    }

    String type = content.getType().toUpperCase();

    String youtubeId;

    if ("VIDEO".equals(type) || "SHORTS".equals(type)) {

    youtubeId =
            YoutubeUrlUtils.extractVideoId(
                    content.getYoutubeUrl()
            );

} else {

    youtubeId =
            YoutubeUrlUtils.extractPlaylistId(
                    content.getYoutubeUrl()
            );
}

    if (youtubeId == null || youtubeId.isBlank()) {

        return ResponseEntity.badRequest().body(
                Map.of("message",
                        "Invalid YouTube URL for the selected content type.")
        );
    }

    if (content.getTitle() == null ||
            content.getTitle().isBlank()) {

        return ResponseEntity.badRequest().body(
                Map.of("message",
                        "Title is required.")
        );
    }

    content.setType(type);
    content.setYoutubeId(youtubeId);
    content.setYoutubeUrl(
            content.getYoutubeUrl().trim()
    );

    if ("VIDEO".equals(type)) {

        content.setThumbnailUrl(
                YoutubeUrlUtils.getThumbnailUrl(
                        type,
                        youtubeId
                )
        );
    }

    if (content.getDisplayOrder() == null) {
        content.setDisplayOrder(0);
    }

    YoutubeContent saved =
            youtubeContentRepository.save(content);

    return ResponseEntity.ok(saved);
}
    /* =====================================================
       UPDATE CONTENT
    ===================================================== */
@PutMapping("/{id}")
public ResponseEntity<?> updateContent(
        @PathVariable Long id,
        @RequestBody YoutubeContent request) {

    YoutubeContent existing =
            youtubeContentRepository.findById(id)
                    .orElse(null);

    if (existing == null) {
        return ResponseEntity.notFound().build();
    }

    if (request.getType() == null ||
        (!request.getType().equalsIgnoreCase("VIDEO")
                && !request.getType().equalsIgnoreCase("SHORTS")
                && !request.getType().equalsIgnoreCase("PLAYLIST"))) {

    return ResponseEntity.badRequest().body(
            Map.of("message",
                    "Type must be VIDEO, SHORTS or PLAYLIST.")
    );
}

    if (request.getYoutubeUrl() == null ||
            request.getYoutubeUrl().isBlank()) {

        return ResponseEntity.badRequest().body(
                Map.of("message",
                        "YouTube URL is required.")
        );
    }

    if (request.getTitle() == null ||
            request.getTitle().isBlank()) {

        return ResponseEntity.badRequest().body(
                Map.of("message",
                        "Title is required.")
        );
    }

    String type = request.getType().toUpperCase();

    String youtubeId;

    if ("VIDEO".equals(type) || "SHORTS".equals(type)) {

    youtubeId =
            YoutubeUrlUtils.extractVideoId(
                    request.getYoutubeUrl()
            );

} else {

    youtubeId =
            YoutubeUrlUtils.extractPlaylistId(
                    request.getYoutubeUrl()
            );
}
    if (youtubeId == null || youtubeId.isBlank()) {

        return ResponseEntity.badRequest().body(
                Map.of("message",
                        "Invalid YouTube URL for the selected content type.")
        );
    }

    existing.setType(type);

    existing.setYoutubeUrl(
            request.getYoutubeUrl().trim()
    );

    existing.setYoutubeId(youtubeId);

    existing.setTitle(
            request.getTitle().trim()
    );

    existing.setDescription(
            request.getDescription()
    );

    existing.setCategory(
            request.getCategory()
    );

    if ("VIDEO".equals(type)) {

        existing.setThumbnailUrl(
                YoutubeUrlUtils.getThumbnailUrl(
                        type,
                        youtubeId
                )
        );

    } else {

        existing.setThumbnailUrl(
                request.getThumbnailUrl()
        );
    }

    existing.setPublished(
            request.isPublished()
    );

    existing.setDisplayOrder(
            request.getDisplayOrder() == null
                    ? 0
                    : request.getDisplayOrder()
    );

    return ResponseEntity.ok(
            youtubeContentRepository.save(existing)
    );
}
    /* =====================================================
       DELETE CONTENT
    ===================================================== */

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteContent(
            @PathVariable Long id) {

        if (!youtubeContentRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        youtubeContentRepository.deleteById(id);

        return ResponseEntity.ok(
                Map.of("message",
                        "YouTube content deleted successfully.")
        );
    }

    /* =====================================================
       PUBLISH / UNPUBLISH
    ===================================================== */

    @PutMapping("/{id}/publish")
    public ResponseEntity<?> updatePublishedStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> request) {

        YoutubeContent content =
                youtubeContentRepository.findById(id)
                        .orElse(null);

        if (content == null) {
            return ResponseEntity.notFound().build();
        }

        Boolean published = request.get("published");

        if (published == null) {
            return ResponseEntity.badRequest().body(
                    Map.of("message",
                            "Published status is required.")
            );
        }

        content.setPublished(published);

        return ResponseEntity.ok(
                youtubeContentRepository.save(content)
        );
    }
}