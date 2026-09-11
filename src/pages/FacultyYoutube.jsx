import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  RefreshCw,
  PlayCircle,
  Search,
  Plus,
  ExternalLink,
  X,
} from "lucide-react";

import FacultySidebar from "../components/FacultySidebar";


function FacultyYoutube() {

  const navigate = useNavigate();


  // =====================================================
  // STATE
  // =====================================================

  const [contents, setContents] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const [typeFilter, setTypeFilter] = useState("ALL");

  const [showForm, setShowForm] = useState(false);

  const [saving, setSaving] = useState(false);


  // =====================================================
  // FORM DATA
  // =====================================================

  const [formData, setFormData] = useState({
    title: "",
    type: "VIDEO",
    category: "",
    youtubeUrl: "",
    description: "",
    published: true,
  });


  // =====================================================
  // TOKEN
  // =====================================================

  const getToken = () => {

    return (
      localStorage.getItem("facultyToken") ||
      localStorage.getItem("authToken")
    );

  };


  // =====================================================
  // HANDLE FORM CHANGE
  // =====================================================

  const handleChange = (e) => {

    const {
      name,
      value,
      type,
      checked,
    } = e.target;


    setFormData((prev) => ({

      ...prev,

      [name]:
        type === "checkbox"
          ? checked
          : value,

    }));

  };


  // =====================================================
  // EXTRACT YOUTUBE ID
  // =====================================================

  const extractYoutubeId = (url) => {

    if (!url) {
      return null;
    }

    try {

      const parsedUrl = new URL(url);


      // -----------------------------------------------
      // Normal YouTube video
      // youtube.com/watch?v=XXXXXXXXXXX
      // -----------------------------------------------

      if (
        parsedUrl.hostname.includes("youtube.com") &&
        parsedUrl.pathname === "/watch"
      ) {

        return parsedUrl.searchParams.get("v");

      }


      // -----------------------------------------------
      // YouTube Shorts
      // youtube.com/shorts/XXXXXXXXXXX
      // -----------------------------------------------

      if (
        parsedUrl.hostname.includes("youtube.com") &&
        parsedUrl.pathname.startsWith("/shorts/")
      ) {

        return parsedUrl.pathname
          .split("/")[2]
          ?.split("?")[0];

      }


      // -----------------------------------------------
      // YouTube embed
      // youtube.com/embed/XXXXXXXXXXX
      // -----------------------------------------------

      if (
        parsedUrl.hostname.includes("youtube.com") &&
        parsedUrl.pathname.startsWith("/embed/")
      ) {

        return parsedUrl.pathname
          .split("/")[2]
          ?.split("?")[0];

      }


      // -----------------------------------------------
      // youtu.be/XXXXXXXXXXX
      // -----------------------------------------------

      if (
        parsedUrl.hostname === "youtu.be"
      ) {

        return parsedUrl.pathname
          .split("/")[1]
          ?.split("?")[0];

      }


      return null;

    } catch {

      return null;

    }

  };


  // =====================================================
  // EXTRACT PLAYLIST ID
  // =====================================================

  const extractPlaylistId = (url) => {

    if (!url) {
      return null;
    }

    try {

      const parsedUrl = new URL(url);

      return (
        parsedUrl.searchParams.get("list") ||
        null
      );

    } catch {

      return null;

    }

  };


  // =====================================================
  // GET THUMBNAIL
  // =====================================================

  const getThumbnailUrl = (
    youtubeId,
    type
  ) => {

    if (
      !youtubeId ||
      type === "PLAYLIST"
    ) {
      return null;
    }

    return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;

  };


  // =====================================================
  // VALIDATE YOUTUBE URL
  // =====================================================

  const validateYoutubeUrl = (
    url,
    type
  ) => {

    if (!url.trim()) {

      return "YouTube URL is required.";

    }


    try {

      const parsedUrl = new URL(
        url.trim()
      );


      const isYoutube =
        parsedUrl.hostname === "youtube.com" ||
        parsedUrl.hostname === "www.youtube.com" ||
        parsedUrl.hostname === "m.youtube.com" ||
        parsedUrl.hostname === "youtu.be";


      if (!isYoutube) {

        return "Please enter a valid YouTube URL.";

      }


      if (type === "PLAYLIST") {

        const playlistId =
          extractPlaylistId(url);

        if (!playlistId) {

          return "Please enter a valid YouTube playlist URL.";

        }

      } else {

        const youtubeId =
          extractYoutubeId(url);

        if (!youtubeId) {

          return "Unable to identify the YouTube video from this URL.";

        }

      }


      return null;

    } catch {

      return "Please enter a valid YouTube URL.";

    }

  };


  // =====================================================
  // FETCH YOUTUBE CONTENT
  // =====================================================

  const fetchYoutubeContent = async () => {

    try {

      setLoading(true);

      setError("");


      const token = getToken();


      if (!token) {

        navigate("/faculty");

        return;

      }


      const response = await fetch(
        "https://sigma-classes-backend-ajkh.onrender.com/api/faculty/youtube",
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      if (!response.ok) {

        throw new Error(
          "Unable to load YouTube content."
        );

      }


      const data =
        await response.json();


      setContents(
        Array.isArray(data)
          ? data
          : []
      );


    } catch (err) {

      console.error(err);


      setError(
        err.message ||
        "Unable to load YouTube content."
      );


    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // SAVE YOUTUBE CONTENT
  // =====================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");


    // -----------------------------------------------
    // TITLE
    // -----------------------------------------------

    if (!formData.title.trim()) {

      alert("Title is required.");

      return;

    }


    // -----------------------------------------------
    // URL
    // -----------------------------------------------

    const url =
      formData.youtubeUrl.trim();


    const urlError =
      validateYoutubeUrl(
        url,
        formData.type
      );


    if (urlError) {

      alert(urlError);

      return;

    }


    // -----------------------------------------------
    // YOUTUBE ID
    // -----------------------------------------------

    let youtubeId;


    if (
      formData.type === "PLAYLIST"
    ) {

      youtubeId =
        extractPlaylistId(url);

    } else {

      youtubeId =
        extractYoutubeId(url);

    }


    if (!youtubeId) {

      alert(
        "Unable to extract YouTube ID."
      );

      return;

    }


    try {

      setSaving(true);


      const token =
        getToken();


      if (!token) {

        navigate("/faculty");

        return;

      }


      // -----------------------------------------------
      // THUMBNAIL
      // -----------------------------------------------

      const thumbnailUrl =
        getThumbnailUrl(
          youtubeId,
          formData.type
        );


      // -----------------------------------------------
      // BACKEND PAYLOAD
      // -----------------------------------------------

      const payload = {

        title:
          formData.title.trim(),

        type:
          formData.type,

        youtubeUrl:
          url,

        youtubeId:
          youtubeId,

        description:
          formData.description.trim() ||
          null,

        category:
          formData.category.trim() ||
          null,

        thumbnailUrl:
          thumbnailUrl,

        published:
          formData.published,

        displayOrder:
          0,

      };


      console.log(
        "YouTube payload:",
        payload
      );


      const response = await fetch(
        "https://sigma-classes-backend-ajkh.onrender.com/api/faculty/youtube",
        {

          method: "POST",

          headers: {

            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,

          },

          body:
            JSON.stringify(payload),

        }
      );


      if (!response.ok) {

        let message =
          "Unable to save YouTube content.";


        try {

          const errorData =
            await response.json();


          message =
            errorData?.message ||
            errorData?.error ||
            message;

        } catch {

          // Ignore JSON parse error

        }


        throw new Error(message);

      }


      // -----------------------------------------------
      // RESET FORM
      // -----------------------------------------------

      setFormData({

        title: "",

        type: "VIDEO",

        category: "",

        youtubeUrl: "",

        description: "",

        published: true,

      });


      setShowForm(false);


      await fetchYoutubeContent();


    } catch (err) {

      console.error(err);


      setError(
        err.message ||
        "Unable to save YouTube content."
      );


      alert(
        err.message ||
        "Unable to save YouTube content."
      );


    } finally {

      setSaving(false);

    }

  };


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {

    fetchYoutubeContent();

  }, []);


  // =====================================================
  // SEARCH + FILTER
  // =====================================================

  const filteredContents =
    useMemo(() => {

      let result =
        [...contents];


      const search =
        searchTerm
          .trim()
          .toLowerCase();


      // -----------------------------------------------
      // SEARCH
      // -----------------------------------------------

      if (search) {

        result =
          result.filter((item) => {

            const title =
              String(
                item.title || ""
              ).toLowerCase();


            const description =
              String(
                item.description || ""
              ).toLowerCase();


            const category =
              String(
                item.category || ""
              ).toLowerCase();


            return (
              title.includes(search) ||
              description.includes(search) ||
              category.includes(search)
            );

          });

      }


      // -----------------------------------------------
      // TYPE FILTER
      // -----------------------------------------------

      if (
        typeFilter !== "ALL"
      ) {

        result =
          result.filter((item) => {

            return (
              String(
                item.type || ""
              ).toUpperCase() ===
              typeFilter
            );

          });

      }


      return result;

    }, [
      contents,
      searchTerm,
      typeFilter,
    ]);


  // =====================================================
  // CLEAR FILTERS
  // =====================================================

  const clearFilters = () => {

    setSearchTerm("");

    setTypeFilter("ALL");

  };


  // =====================================================
  // ACTIVE FILTER CHECK
  // =====================================================

  const hasActiveFilters =
    searchTerm.trim() !== "" ||
    typeFilter !== "ALL";


  // =====================================================
  // OPEN ADD CONTENT FORM
  // =====================================================

  const handleAddContent = () => {

    setError("");

    setShowForm(true);

  };


  // =====================================================
  // CLOSE FORM
  // =====================================================

  const handleCloseForm = () => {

    if (saving) {
      return;
    }


    setShowForm(false);


    setFormData({

      title: "",

      type: "VIDEO",

      category: "",

      youtubeUrl: "",

      description: "",

      published: true,

    });

  };


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div className="faculty-dashboard">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <FacultySidebar />


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="faculty-dashboard-main">


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="faculty-dashboard-header">

          <div>

            <button
              onClick={() =>
                navigate("/faculty/dashboard")
              }
              className="faculty-back-btn"
            >

              <ArrowLeft size={17} />

              Dashboard

            </button>


            <span className="section-label">
              FACULTY PORTAL
            </span>


            <h1>
              YouTube Content
            </h1>


            <p>
              Manage YouTube content available
              to all students.
            </p>

          </div>


          <div className="faculty-header-actions">


            {/* REFRESH */}

            <button
              onClick={fetchYoutubeContent}
              className="faculty-secondary-btn"
              disabled={loading}
            >

              <RefreshCw
                size={17}
                className={
                  loading
                    ? "faculty-spin"
                    : ""
                }
              />

              Refresh

            </button>


            {/* ADD CONTENT */}

            <button
              className="faculty-primary-btn"
              onClick={handleAddContent}
            >

              <Plus size={17} />

              Add Content

            </button>

          </div>

        </div>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (

          <div className="faculty-dashboard-error">

            {error}

          </div>

        )}


        {/* =================================================
            ADD YOUTUBE CONTENT FORM
        ================================================= */}

        {showForm && (

          <section className="faculty-youtube-form-card">


            {/* FORM HEADER */}

            <div className="faculty-youtube-form-header">

              <div>

                <span className="section-label">
                  NEW CONTENT
                </span>


                <h2>
                  Add YouTube Content
                </h2>


                <p>
                  Add videos, shorts, or playlists
                  for all students.
                </p>

              </div>


              <button
                type="button"
                className="faculty-form-close"
                onClick={handleCloseForm}
                disabled={saving}
                aria-label="Close"
              >

                <X size={20} />

              </button>

            </div>


            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="faculty-youtube-form"
            >


              {/* TITLE */}

              <div className="faculty-form-group">

                <label>
                  Title
                </label>


                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter video title"
                  required
                />

              </div>


              {/* CONTENT TYPE */}

              <div className="faculty-form-group">

                <label>
                  Content Type
                </label>


                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                >

                  <option value="VIDEO">
                    Video
                  </option>

                  <option value="SHORTS">
                    Shorts
                  </option>

                  <option value="PLAYLIST">
                    Playlist
                  </option>

                </select>

              </div>


              {/* CATEGORY */}

              <div className="faculty-form-group">

                <label>
                  Category
                </label>


                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g. Mathematics"
                />

              </div>


              {/* YOUTUBE URL */}

              <div className="faculty-form-group faculty-form-full">

                <label>
                  YouTube URL
                </label>


                <input
                  type="url"
                  name="youtubeUrl"
                  value={formData.youtubeUrl}
                  onChange={handleChange}
                  placeholder="https://www.youtube.com/watch?v=..."
                  required
                />

              </div>


              {/* DESCRIPTION */}

              <div className="faculty-form-group faculty-form-full">

                <label>
                  Description
                </label>


                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Short description of the content..."
                  rows={4}
                />

              </div>


              {/* PUBLISH */}

              <div className="faculty-material-publish">

                <label>

                  <input
                    type="checkbox"
                    name="published"
                    checked={formData.published}
                    onChange={handleChange}
                  />

                  <span>
                    Publish immediately
                  </span>

                </label>

              </div>


              {/* ACTIONS */}

              <div className="faculty-form-actions">

                <button
                  type="button"
                  className="faculty-secondary-btn"
                  onClick={handleCloseForm}
                  disabled={saving}
                >

                  Cancel

                </button>


                <button
                  type="submit"
                  className="faculty-primary-btn"
                  disabled={saving}
                >

                  {saving
                    ? "Saving..."
                    : "Save Content"}

                </button>

              </div>


            </form>

          </section>

        )}


        {/* =================================================
            SEARCH + FILTER
        ================================================= */}

        <div className="faculty-youtube-toolbar">


          {/* SEARCH */}

          <div className="faculty-youtube-search">

            <Search size={18} />


            <input
              type="text"
              placeholder="Search videos, categories..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(
                  e.target.value
                )
              }
            />


            {searchTerm && (

              <button
                type="button"
                onClick={() =>
                  setSearchTerm("")
                }
                className="faculty-search-clear"
                aria-label="Clear search"
              >

                <X size={16} />

              </button>

            )}

          </div>


          {/* FILTER */}

          <div className="faculty-youtube-filter">

            <label>
              Content Type
            </label>


            <select
              value={typeFilter}
              onChange={(e) =>
                setTypeFilter(
                  e.target.value
                )
              }
            >

              <option value="ALL">
                All Content
              </option>

              <option value="VIDEO">
                Videos
              </option>

              <option value="SHORTS">
                Shorts
              </option>

              <option value="PLAYLIST">
                Playlists
              </option>

            </select>

          </div>


          {/* CLEAR FILTERS */}

          {hasActiveFilters && (

            <button
              type="button"
              className="faculty-clear-filters"
              onClick={clearFilters}
            >

              <X size={15} />

              Clear filters

            </button>

          )}

        </div>


        {/* =================================================
            RESULT COUNT
        ================================================= */}

        {!loading && (

          <div className="faculty-youtube-results">

            Showing{" "}

            <strong>
              {filteredContents.length}
            </strong>

            {" "}of{" "}

            <strong>
              {contents.length}
            </strong>

            {" "}content items

          </div>

        )}


        {/* =================================================
            LOADING
        ================================================= */}

        {loading ? (

          <div className="faculty-dashboard-loading">

            Loading YouTube content...

          </div>

        ) : filteredContents.length === 0 ? (

          <div className="faculty-dashboard-card faculty-youtube-empty">

            <PlayCircle size={42} />


            <h2>
              No YouTube content found
            </h2>


            <p>

              {hasActiveFilters

                ? "Try changing your search or filters."

                : "You haven't added any YouTube content yet."

              }

            </p>


            {!hasActiveFilters && (

              <button
                onClick={handleAddContent}
                className="faculty-primary-btn"
              >

                <Plus size={17} />

                Add YouTube Content

              </button>

            )}

          </div>

        ) : (

          <div className="faculty-youtube-grid">

            {filteredContents.map((item) => (

              <article
                className="faculty-youtube-card"
                key={item.id}
              >


                {/* THUMBNAIL */}

                <div className="faculty-youtube-thumbnail">

                  {item.thumbnailUrl ? (

                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                    />

                  ) : (

                    <div className="faculty-youtube-thumbnail-placeholder">

                      <PlayCircle size={38} />

                    </div>

                  )}

                </div>


                {/* CARD BODY */}

                <div className="faculty-youtube-card-body">


                  <div className="faculty-youtube-card-top">

                    <span className="section-label">

                      {item.type || "VIDEO"}

                    </span>

                  </div>


                  <h2>
                    {item.title}
                  </h2>


                  {item.description && (

                    <p>
                      {item.description}
                    </p>

                  )}


                  {item.category && (

                    <div className="faculty-youtube-meta">

                      <span>

                        Category:{" "}

                        {item.category}

                      </span>

                    </div>

                  )}


                  {item.youtubeUrl && (

                    <a
                      href={item.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="faculty-youtube-open"
                    >

                      Watch on YouTube

                      <ExternalLink
                        size={15}
                      />

                    </a>

                  )}

                </div>

              </article>

            ))}

          </div>

        )}

      </main>

    </div>

  );

}


export default FacultyYoutube;