package com.sigma.backend.controller;

import com.sigma.backend.entity.YoutubeContent;
import com.sigma.backend.repository.YoutubeContentRepository;
import com.sigma.backend.security.JwtService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/faculty/youtube")
@CrossOrigin(origins = "http://localhost:5173")
public class FacultyYoutubeController {

    private final YoutubeContentRepository repository;
    private final JwtService jwtService;

    public FacultyYoutubeController(
            YoutubeContentRepository repository,
            JwtService jwtService) {
        this.repository = repository;
        this.jwtService = jwtService;
    }

    // =====================================================
    // GET TOKEN
    // =====================================================

    private String getToken(String authHeader) {

        if (authHeader == null ||
                !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException(
                    "Missing authorization token");
        }

        return authHeader.substring(7);
    }

    // =====================================================
    // VALIDATE FACULTY
    // =====================================================

    private String validateFaculty(
            String authHeader) {

        String token = getToken(authHeader);

        if (!jwtService.isTokenValid(token)) {
            throw new RuntimeException(
                    "Invalid or expired token");
        }

        String role = jwtService.extractRole(token);

        if (!"FACULTY".equalsIgnoreCase(role)) {
            throw new RuntimeException(
                    "Faculty access required");
        }

        return jwtService.extractUsername(token);
    }

    // =====================================================
    // EXTRACT YOUTUBE ID
    // =====================================================

    private String extractYoutubeId(
            String url,
            String type) {

        if (url == null ||
                url.trim().isEmpty()) {
            throw new RuntimeException(
                    "YouTube URL is required.");
        }

        String cleanUrl = url.trim();

        try {

            URI uri = URI.create(cleanUrl);

            String host = uri.getHost() == null
                    ? ""
                    : uri.getHost()
                            .toLowerCase();

            String path = uri.getPath() == null
                    ? ""
                    : uri.getPath();

            // =================================================
            // PLAYLIST
            // =================================================

            if ("PLAYLIST".equalsIgnoreCase(type)) {

                String query = uri.getQuery();

                if (query != null) {

                    for (String parameter : query.split("&")) {

                        String[] pair = parameter.split(
                                "=",
                                2);

                        if (pair.length == 2 &&
                                "list".equalsIgnoreCase(
                                        pair[0])) {

                            return pair[1];
                        }
                    }
                }

                throw new RuntimeException(
                        "Invalid YouTube playlist URL.");
            }

            // =================================================
            // YOUTUBE SHORTS
            // =================================================

            if (path.startsWith("/shorts/")) {

                String id = path.substring(
                        "/shorts/".length());

                if (id.contains("/")) {

                    id = id.substring(
                            0,
                            id.indexOf("/"));
                }

                if (!id.isEmpty()) {
                    return id;
                }
            }

            // =================================================
            // STANDARD YOUTUBE WATCH URL
            // https://www.youtube.com/watch?v=VIDEO_ID
            // =================================================

            String query = uri.getQuery();

            if (query != null) {

                for (String parameter : query.split("&")) {

                    String[] pair = parameter.split(
                            "=",
                            2);

                    if (pair.length == 2 &&
                            "v".equalsIgnoreCase(
                                    pair[0])) {

                        return pair[1];
                    }
                }
            }

            // =================================================
            // YOUTU.BE
            // https://youtu.be/VIDEO_ID
            // =================================================

            if (host.equals("youtu.be") ||
                    host.equals("www.youtu.be")) {

                String id = path.startsWith("/")
                        ? path.substring(1)
                        : path;

                if (id.contains("/")) {

                    id = id.substring(
                            0,
                            id.indexOf("/"));
                }

                if (!id.isEmpty()) {
                    return id;
                }
            }

        } catch (Exception e) {

            throw new RuntimeException(
                    "Invalid YouTube URL.");
        }

        throw new RuntimeException(
                "Could not extract YouTube ID from the URL.");
    }

    // =====================================================
    // GET ALL YOUTUBE CONTENT
    // =====================================================

    @GetMapping
    public ResponseEntity<?> getContent(
            @RequestHeader("Authorization") String authHeader) {

        try {

            /*
             * Validate faculty.
             *
             * We intentionally return ALL YouTube content
             * because YouTube content is global for students.
             */

            validateFaculty(authHeader);

            List<YoutubeContent> content = repository.findAll();

            return ResponseEntity.ok(content);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(401)
                    .body(
                            Map.of(
                                    "message",
                                    e.getMessage()));
        }
    }

    // =====================================================
    // CREATE YOUTUBE CONTENT
    // =====================================================

@PostMapping
public ResponseEntity<?> create(
        @RequestHeader("Authorization") String authHeader,
        @RequestBody YoutubeContent content
) {

    try {

        validateFaculty(authHeader);

        String token = authHeader.substring(7);

        String facultyUsername =
                jwtService.extractUsername(token);

        content.setId(null);

        content.setFacultyUsername(
                facultyUsername
        );

        if (content.getYoutubeUrl() == null ||
                content.getYoutubeUrl().trim().isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "YouTube URL is required."
                            )
                    );
        }

        if (content.getYoutubeId() == null ||
                content.getYoutubeId().trim().isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "YouTube ID is required."
                            )
                    );
        }

        return ResponseEntity.ok(
                repository.save(content)
        );

    } catch (Exception e) {

        e.printStackTrace();

        return ResponseEntity
                .badRequest()
                .body(
                        Map.of(
                                "message",
                                e.getMessage() != null
                                        ? e.getMessage()
                                        : "Unable to create YouTube content."
                        )
                );
    }
}


    // UPDATE YOUTUBE CONTENT
    // =====================================================

    @PutMapping("/{id}")
    public ResponseEntity<?> update(
            @RequestHeader("Authorization") String authHeader,

            @PathVariable Long id,

            @RequestBody YoutubeContent data) {

        try {

            // -------------------------------------------------
            // GET LOGGED-IN FACULTY
            // -------------------------------------------------

            String facultyUsername = validateFaculty(authHeader);

            // -------------------------------------------------
            // FIND CONTENT
            // -------------------------------------------------

            YoutubeContent content = repository
                    .findById(id)
                    .orElse(null);

            if (content == null) {

                return ResponseEntity
                        .notFound()
                        .build();
            }

            // -------------------------------------------------
            // SECURITY CHECK
            // -------------------------------------------------

            if (content.getFacultyUsername() == null ||
                    !facultyUsername.equals(
                            content.getFacultyUsername())) {

                return ResponseEntity
                        .status(403)
                        .body(
                                Map.of(
                                        "message",
                                        "You do not have permission to update this content."));
            }

            // -------------------------------------------------
            // VALIDATE
            // -------------------------------------------------

            if (data.getTitle() == null ||
                    data.getTitle()
                            .trim()
                            .isEmpty()) {

                throw new RuntimeException(
                        "Title is required.");
            }

            if (data.getType() == null ||
                    data.getType()
                            .trim()
                            .isEmpty()) {

                throw new RuntimeException(
                        "Content type is required.");
            }

            if (data.getYoutubeUrl() == null ||
                    data.getYoutubeUrl()
                            .trim()
                            .isEmpty()) {

                throw new RuntimeException(
                        "YouTube URL is required.");
            }

            // -------------------------------------------------
            // UPDATE TYPE
            // -------------------------------------------------

            content.setType(
                    data.getType());

            // -------------------------------------------------
            // UPDATE URL
            // -------------------------------------------------

            content.setYoutubeUrl(
                    data.getYoutubeUrl());

            // -------------------------------------------------
            // REGENERATE YOUTUBE ID
            // -------------------------------------------------

            String youtubeId = extractYoutubeId(
                    data.getYoutubeUrl(),
                    data.getType());

            content.setYoutubeId(
                    youtubeId);

            // -------------------------------------------------
            // UPDATE OTHER FIELDS
            // -------------------------------------------------

            content.setTitle(
                    data.getTitle());

            content.setDescription(
                    data.getDescription());

            content.setCategory(
                    data.getCategory());

            content.setThumbnailUrl(
                    data.getThumbnailUrl());

            content.setPublished(
                    data.isPublished());

            if (data.getDisplayOrder() != null) {

                content.setDisplayOrder(
                        data.getDisplayOrder());

            } else {

                content.setDisplayOrder(0);

            }

            // -------------------------------------------------
            // KEEP ORIGINAL OWNER
            // -------------------------------------------------

            content.setFacultyUsername(
                    facultyUsername);

            // -------------------------------------------------
            // SAVE
            // -------------------------------------------------

            return ResponseEntity.ok(
                    repository.save(content));

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    e.getMessage()));
        }
    }

    // =====================================================
    // DELETE YOUTUBE CONTENT
    // =====================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(
            @RequestHeader("Authorization") String authHeader,

            @PathVariable Long id) {

        try {

            // -------------------------------------------------
            // GET LOGGED-IN FACULTY
            // -------------------------------------------------

            String facultyUsername = validateFaculty(authHeader);

            // -------------------------------------------------
            // FIND CONTENT
            // -------------------------------------------------

            YoutubeContent content = repository
                    .findById(id)
                    .orElse(null);

            if (content == null) {

                return ResponseEntity
                        .notFound()
                        .build();
            }

            // -------------------------------------------------
            // SECURITY CHECK
            // -------------------------------------------------

            if (content.getFacultyUsername() == null ||
                    !facultyUsername.equals(
                            content.getFacultyUsername())) {

                return ResponseEntity
                        .status(403)
                        .body(
                                Map.of(
                                        "message",
                                        "You do not have permission to delete this content."));
            }

            // -------------------------------------------------
            // DELETE
            // -------------------------------------------------

            repository.delete(content);

            return ResponseEntity
                    .noContent()
                    .build();

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    e.getMessage()));
        }
    }
}