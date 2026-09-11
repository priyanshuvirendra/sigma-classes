import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  RefreshCw,
} from "lucide-react";

import FacultySidebar from "../components/FacultySidebar";

function FacultyCourses() {

  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  const getToken = () =>
    localStorage.getItem("facultyToken") ||
    localStorage.getItem("authToken");


  const fetchCourses = async () => {

    try {

      setLoading(true);
      setError("");

      const token = getToken();

      const response = await fetch(
        "http://localhost:8080/api/faculty/courses",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          "Unable to load your courses."
        );
      }

      const data = await response.json();

      setCourses(data);

    } catch (err) {

      setError(
        err.message ||
        "Unable to load courses."
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {
    fetchCourses();
  }, []);


  return (

    <div className="faculty-dashboard">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <FacultySidebar />


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="faculty-dashboard-main">

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
              My Courses
            </h1>

            <p>
              Courses currently assigned to you.
            </p>

          </div>


          <button
            onClick={fetchCourses}
            className="faculty-secondary-btn"
          >
            <RefreshCw size={17} />
            Refresh
          </button>

        </div>


        {/* =====================================================
            ERROR
        ===================================================== */}

        {error && (
          <div className="faculty-dashboard-error">
            {error}
          </div>
        )}


        {/* =====================================================
            LOADING
        ===================================================== */}

        {loading ? (

          <div className="faculty-dashboard-loading">
            Loading courses...
          </div>


        ) : courses.length === 0 ? (

          /* =====================================================
             NO COURSES
          ===================================================== */

          <div className="faculty-dashboard-card">

            <BookOpen size={35} />

            <h2>
              No courses assigned
            </h2>

            <p>
              You currently don't have any
              courses assigned to you.
            </p>

          </div>


        ) : (

          /* =====================================================
             COURSES
          ===================================================== */<div className="faculty-course-grid">

  {courses.map(course => (

    <article
      className="faculty-dashboard-card faculty-course-clickable"
      key={course.id}
      onClick={() =>
        navigate(`/faculty/courses/${course.id}`)
      }
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          navigate(`/faculty/courses/${course.id}`);
        }
      }}
    >

      {course.imageUrl && (
        <img
          src={course.imageUrl}
          alt={course.name}
          className="faculty-course-image"
        />
      )}

      <span className="section-label">
        {course.category || "COURSE"}
      </span>

      <h2>
        {course.name}
      </h2>

      <p>
        {course.description}
      </p>

      <div className="faculty-course-meta">

        <span>
          Duration:{" "}
          {course.duration || "—"}
        </span>

        <span>
          Mode:{" "}
          {course.mode || "—"}
        </span>

        <span>
          Timing:{" "}
          {course.timing || "—"}
        </span>

      </div>

      <div className="faculty-course-view">
        View Course →
      </div>

    </article>

  ))}

</div>
        )}

      </main>

    </div>
  );
}

export default FacultyCourses;