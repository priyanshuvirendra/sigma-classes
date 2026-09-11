import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  RefreshCw,
  Plus,
  FileText,
  Eye,
  EyeOff,
  Trash2,
  X,
} from "lucide-react";

import FacultySidebar from "../components/FacultySidebar";

function FacultyMaterials() {

  const navigate = useNavigate();

  const [materials, setMaterials] = useState([]);
  const [courses, setCourses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    courseId: "",
    title: "",
    type: "PDF",
    subject: "",
    url: "",
    description: "",
    published: true,
  });


  // =====================================================
  // TOKEN
  // =====================================================

  const getToken = () =>
    localStorage.getItem("facultyToken") ||
    localStorage.getItem("authToken");


  // =====================================================
  // FETCH MATERIALS
  // =====================================================

  const fetchMaterials = async () => {

    try {

      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:8080/api/faculty/materials",
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Unable to load study materials.");
      }

      const data = await response.json();

      setMaterials(Array.isArray(data) ? data : []);

    } catch (err) {

      console.error(err);

      setError(
        err.message ||
        "Unable to load study materials."
      );

    } finally {

      setLoading(false);

    }
  };


  // =====================================================
  // FETCH FACULTY COURSES
  // =====================================================

  const fetchCourses = async () => {

    try {

      const response = await fetch(
        "http://localhost:8080/api/faculty/courses",
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Unable to load courses.");
      }

      const data = await response.json();

      setCourses(Array.isArray(data) ? data : []);

    } catch (err) {

      console.error("Course loading error:", err);

    }
  };


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {

    fetchMaterials();
    fetchCourses();

  }, []);


  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (e) => {

    const { name, value, type, checked } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

  };


  // =====================================================
  // ADD MATERIAL
  // =====================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    if (!formData.courseId) {
      setError("Please select a course.");
      return;
    }

    if (!formData.title.trim()) {
      setError("Please enter a material title.");
      return;
    }

    if (!formData.url.trim()) {
      setError("Please enter the material URL.");
      return;
    }

    try {

      setSaving(true);

      const response = await fetch(
        "http://localhost:8080/api/faculty/materials",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },

          body: JSON.stringify({
            ...formData,
            courseId: Number(formData.courseId),
          }),
        }
      );


      if (!response.ok) {

        let message =
          "Unable to create study material.";

        try {

          const data = await response.json();

          if (data?.message) {
            message = data.message;
          }

        } catch {
          // Ignore JSON parsing error
        }

        throw new Error(message);
      }


      // Reset form

      setFormData({
        courseId: "",
        title: "",
        type: "PDF",
        subject: "",
        url: "",
        description: "",
        published: true,
      });

      setShowForm(false);

      await fetchMaterials();

    } catch (err) {

      console.error(err);

      setError(
        err.message ||
        "Unable to create study material."
      );

    } finally {

      setSaving(false);

    }
  };


  // =====================================================
  // DELETE MATERIAL
  // =====================================================

  const handleDelete = async (id) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this study material?"
      );

    if (!confirmed) {
      return;
    }

    try {

      setError("");

      const response = await fetch(
        `http://localhost:8080/api/faculty/materials/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );


      if (!response.ok) {

        let message =
          "Unable to delete material.";

        try {

          const data =
            await response.json();

          if (data?.message) {
            message = data.message;
          }

        } catch {
          // Ignore JSON parsing error
        }

        throw new Error(message);
      }


      await fetchMaterials();

    } catch (err) {

      console.error(err);

      setError(
        err.message ||
        "Unable to delete material."
      );

    }
  };


  // =====================================================
  // TOGGLE PUBLISH
  // =====================================================

  const handleTogglePublish = async (material) => {

    try {

      setError("");

      const response = await fetch(
        `http://localhost:8080/api/faculty/materials/${material.id}/publish`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },

          body: JSON.stringify({
            published: !material.published,
          }),
        }
      );


      if (!response.ok) {

        let message =
          "Unable to update material.";

        try {

          const data =
            await response.json();

          if (data?.message) {
            message = data.message;
          }

        } catch {
          // Ignore JSON parsing error
        }

        throw new Error(message);
      }


      await fetchMaterials();

    } catch (err) {

      console.error(err);

      setError(
        err.message ||
        "Unable to update material."
      );

    }
  };


  // =====================================================
  // OPEN MATERIAL
  // =====================================================

  const openMaterial = (url) => {

    if (!url) {
      return;
    }

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );

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
              CONTENT
            </span>

            <h1>
              Study Materials
            </h1>

            <p>
              Manage learning material for your assigned courses.
            </p>

          </div>


          {/* HEADER ACTIONS */}

          <div className="faculty-header-actions">

            <button
              onClick={fetchMaterials}
              className="faculty-secondary-btn"
              disabled={loading}
            >
              <RefreshCw size={17} />
              Refresh
            </button>


            <button
              onClick={() =>
                setShowForm(prev => !prev)
              }
              className="faculty-primary-btn"
            >

              {showForm ? (
                <>
                  <X size={17} />
                  Close
                </>
              ) : (
                <>
                  <Plus size={17} />
                  Add Material
                </>
              )}

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
            ADD MATERIAL FORM
        ================================================= */}

        {showForm && (

          <section className="faculty-material-form-card">

            <span className="section-label">
              NEW MATERIAL
            </span>

            <h2>
              Add Study Material
            </h2>


            <form
              onSubmit={handleSubmit}
              className="faculty-material-form"
            >

              {/* COURSE */}

              <div className="faculty-form-group">

                <label>
                  Course
                </label>

                <select
                  name="courseId"
                  value={formData.courseId}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select course
                  </option>

                  {courses.map(course => (

                    <option
                      key={course.id}
                      value={course.id}
                    >
                      {course.name}
                    </option>

                  ))}

                </select>

              </div>


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
                  placeholder="Material title"
                  required
                />

              </div>


              {/* TYPE */}

              <div className="faculty-form-group">

                <label>
                  Type
                </label>

                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                >

                  <option value="PDF">
                    PDF
                  </option>

                  <option value="VIDEO">
                    Video
                  </option>

                  <option value="LINK">
                    Link
                  </option>

                  <option value="DOCUMENT">
                    Document
                  </option>

                  <option value="NOTES">
                    Notes
                  </option>

                </select>

              </div>


              {/* SUBJECT */}

              <div className="faculty-form-group">

                <label>
                  Subject
                </label>

                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Subject"
                />

              </div>


              {/* URL */}

              <div className="faculty-form-group faculty-form-full">

                <label>
                  URL
                </label>

                <input
                  type="url"
                  name="url"
                  value={formData.url}
                  onChange={handleChange}
                  placeholder="https://..."
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
                  placeholder="Short description of the material"
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

                  Publish immediately

                </label>

              </div>


              {/* SUBMIT */}

              <div className="faculty-form-actions">

                <button
                  type="button"
                  className="faculty-secondary-btn"
                  onClick={() =>
                    setShowForm(false)
                  }
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
                    : "Save Material"}

                </button>

              </div>

            </form>

          </section>

        )}


        {/* =================================================
            MATERIALS
        ================================================= */}

        {loading ? (

          <div className="faculty-dashboard-loading">
            Loading study materials...
          </div>

        ) : materials.length === 0 ? (

          <div className="faculty-dashboard-card faculty-empty-state">

            <FileText size={40} />

            <h2>
              No study materials
            </h2>

            <p>
              You haven't added any study materials yet.
            </p>

            <button
              className="faculty-primary-btn"
              onClick={() =>
                setShowForm(true)
              }
            >
              <Plus size={17} />
              Add Material
            </button>

          </div>

        ) : (

          <div className="faculty-materials-list">

            {materials.map(material => (

              <article
                key={material.id}
                className="faculty-material-card"
              >

                {/* TOP */}

                <div className="faculty-material-top">

                  <div className="faculty-material-type">

                    <FileText size={17} />

                    <span>
                      {material.type || "PDF"}
                    </span>

                  </div>


                  <span
                    className={
                      material.published
                        ? "faculty-material-published"
                        : "faculty-material-unpublished"
                    }
                  >

                    {material.published
                      ? "Published"
                      : "Unpublished"}

                  </span>

                </div>


                {/* TITLE */}

                <h2>
                  {material.title}
                </h2>


                {/* DESCRIPTION */}

                {material.description && (

                  <p className="faculty-material-description">
                    {material.description}
                  </p>

                )}


                {/* SUBJECT */}

                {material.subject && (

                  <div className="faculty-material-subject">

                    <strong>
                      Subject:
                    </strong>

                    <span>
                      {material.subject}
                    </span>

                  </div>

                )}


                {/* COURSE */}

                <div className="faculty-material-course">

                  {material.courseName ||
                    material.course?.name ||
                    "Course"}

                </div>


                {/* ACTIONS */}

                <div className="faculty-material-actions">

                  <button
                    className="faculty-material-open-btn"
                    onClick={() =>
                      openMaterial(material.url)
                    }
                  >
                    <Eye size={16} />
                    Open
                  </button>


                  <button
                    className="faculty-secondary-btn"
                    onClick={() =>
                      handleTogglePublish(material)
                    }
                  >

                    {material.published ? (
                      <>
                        <EyeOff size={16} />
                        Unpublish
                      </>
                    ) : (
                      <>
                        <Eye size={16} />
                        Publish
                      </>
                    )}

                  </button>


                  <button
                    className="faculty-danger-btn"
                    onClick={() =>
                      handleDelete(material.id)
                    }
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>

                </div>

              </article>

            ))}

          </div>

        )}

      </main>

    </div>
  );
}

export default FacultyMaterials;