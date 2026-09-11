import { useEffect, useState } from "react";
import { ArrowUpRight, ListVideo, Play } from "lucide-react";

const API_BASE_URL = "https://sigma-classes-backend-ajkh.onrender.com";

function YoutubeSection({ limit = null, showViewAll = false }) {
    const [contents, setContents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchYoutubeContent = async () => {
            try {
                const response = await fetch(
                    `${API_BASE_URL}/api/youtube-content`
                );

                if (!response.ok) {
                    throw new Error("Failed to load YouTube content");
                }

                const data = await response.json();

                setContents(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error(
                    "YouTube content error:",
                    error
                );

                setContents([]);
            } finally {
                setLoading(false);
            }
        };

        fetchYoutubeContent();
    }, []);

    const getWatchUrl = (content) => {
        if (!content?.youtubeId) {
            return "#";
        }

        if (content.type === "PLAYLIST") {
            return `https://www.youtube.com/playlist?list=${content.youtubeId}`;
        }

        return `https://www.youtube.com/watch?v=${content.youtubeId}`;
    };


    // =====================================================
    // VISIBLE CONTENT
    // =====================================================

    const visibleContents =
        limit !== null
            ? contents.slice(0, limit)
            : contents;


    // =====================================================
    // EMPTY STATE
    // =====================================================

    if (!loading && contents.length === 0) {
        return null;
    }


    return (
        <section className="section public-youtube-section">

            <div className="container">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="public-youtube-header">

                    <div>

                        <span className="section-label">
                            FREE LEARNING
                        </span>

                        <h2>
                            Learn from{" "}
                            <span>Sigma Classes.</span>
                        </h2>

                        <p>
                            Watch free classes, exam tricks and
                            demo lectures from our official
                            YouTube channel.
                        </p>

                    </div>


                    <a
                        href="https://www.youtube.com/@SigmaClasses87"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="public-youtube-channel-btn"
                    >
                        Visit YouTube Channel
                        <ArrowUpRight size={17} />
                    </a>

                </div>


                {/* =================================================
                    LOADING
                ================================================= */}

                {loading ? (

                    <div className="public-youtube-loading">
                        Loading free learning content...
                    </div>

                ) : (

                    <>

                        {/* =================================================
                            YOUTUBE GRID
                        ================================================= */}

                        <div className="public-youtube-grid">

                            {visibleContents.map((content) => {

                                const isShort =
                                    content.type === "SHORTS";

                                const isPlaylist =
                                    content.type === "PLAYLIST";

                                return (

                                    <article
                                        className={`public-youtube-card ${
                                            isShort
                                                ? "public-youtube-card-short"
                                                : ""
                                        }`}
                                        key={content.id}
                                    >

                                        {/* =================================================
                                            THUMBNAIL
                                        ================================================= */}

                                        <a
                                            href={getWatchUrl(content)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="public-youtube-thumbnail"
                                        >

                                            {content.thumbnailUrl ? (

                                                <img
                                                    src={
                                                        content.thumbnailUrl
                                                    }
                                                    alt={
                                                        content.title
                                                    }
                                                />

                                            ) : (

                                                <div className="public-youtube-placeholder">

                                                    {isPlaylist
                                                        ? "PLAYLIST"
                                                        : isShort
                                                            ? "SHORTS"
                                                            : "VIDEO"}

                                                </div>

                                            )}


                                            <span className="public-youtube-play">

                                                {isPlaylist ? (

                                                    <ListVideo size={21} />

                                                ) : (

                                                    <Play
                                                        size={21}
                                                        fill="currentColor"
                                                    />

                                                )}

                                            </span>

                                        </a>


                                        {/* =================================================
                                            CONTENT
                                        ================================================= */}

                                        <div className="public-youtube-card-content">

                                            <span className="public-youtube-type">

                                                {isPlaylist
                                                    ? "Playlist"
                                                    : isShort
                                                        ? "Shorts"
                                                        : "Free Class"}

                                            </span>


                                            <h3>
                                                {content.title}
                                            </h3>


                                            {content.category && (

                                                <span className="public-youtube-category">
                                                    {content.category}
                                                </span>

                                            )}


                                            {content.description && (

                                                <p>
                                                    {content.description}
                                                </p>

                                            )}


                                            <a
                                                href={getWatchUrl(content)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="public-youtube-watch-btn"
                                            >

                                                {isPlaylist
                                                    ? "View Playlist"
                                                    : isShort
                                                        ? "Watch Short"
                                                        : "Watch Video "}

                                                <ArrowUpRight
                                                    size={16}
                                                />

                                            </a>

                                        </div>

                                    </article>

                                );

                            })}

                        </div>


                        {/* =================================================
                            VIEW ALL FREE LEARNING
                        ================================================= */}

                        {showViewAll &&
                            limit !== null &&
                            contents.length > limit && (

                                <div className="public-youtube-view-all">

                                    <a
                                        href="/free-learning"
                                        className="public-youtube-view-all-button"
                                    >

                                        View All Free Learning

                                        <ArrowUpRight size={18} />

                                    </a>

                                </div>

                            )}

                    </>

                )}

            </div>

        </section>
    );
}

export default YoutubeSection;