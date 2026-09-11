package com.sigma.backend.util;

import java.net.URI;

public class YoutubeUrlUtils {

    private YoutubeUrlUtils() {
    }

    public static String extractVideoId(String url) {

        if (url == null || url.isBlank()) {
            return null;
        }

        try {
            URI uri = URI.create(url.trim());

            String host = uri.getHost();

            if (host == null) {
                return null;
            }

            host = host.toLowerCase();

            // youtu.be/VIDEO_ID
            if (host.equals("youtu.be")) {

                String path = uri.getPath();

                if (path != null && path.length() > 1) {
                    return path.substring(1);
                }

                return null;
            }
// youtube.com URLs
if (host.equals("youtube.com")
        || host.equals("www.youtube.com")
        || host.equals("m.youtube.com")) {

    String path = uri.getPath();

    // youtube.com/shorts/VIDEO_ID
    if (path != null && path.startsWith("/shorts/")) {

        String videoId =
                path.substring("/shorts/".length())
                        .split("/")[0];

        if (!videoId.isBlank()) {
            return videoId;
        }
    }

    // youtube.com/watch?v=VIDEO_ID
    String query = uri.getQuery();

    if (query == null) {
        return null;
    }

    for (String parameter : query.split("&")) {

        String[] pair = parameter.split("=", 2);

        if (pair.length == 2
                && pair[0].equals("v")) {

            return pair[1];
        }
    }
}

        } catch (Exception ignored) {
        }

        return null;
    }

    public static String extractPlaylistId(String url) {

        if (url == null || url.isBlank()) {
            return null;
        }

        try {
            URI uri = URI.create(url.trim());

            String host = uri.getHost();

            if (host == null) {
                return null;
            }

            host = host.toLowerCase();

            if (!(host.equals("youtube.com")
                    || host.equals("www.youtube.com")
                    || host.equals("m.youtube.com"))) {

                return null;
            }

            String query = uri.getQuery();

            if (query == null) {
                return null;
            }

            for (String parameter : query.split("&")) {

                String[] pair = parameter.split("=", 2);

                if (pair.length == 2
                        && pair[0].equals("list")) {

                    return pair[1];
                }
            }

        } catch (Exception ignored) {
        }

        return null;
    }

    public static String getThumbnailUrl(
            String type,
            String youtubeId) {

        if (youtubeId == null || youtubeId.isBlank()) {
            return null;
        }

if ("VIDEO".equalsIgnoreCase(type)
        || "SHORTS".equalsIgnoreCase(type)) {

            return "https://img.youtube.com/vi/"
                    + youtubeId
                    + "/hqdefault.jpg";
        }

        return null;
    }
}