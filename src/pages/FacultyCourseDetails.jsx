import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Users,
  FileText,
  PlayCircle,
  RefreshCw,
} from "lucide-react";

import FacultySidebar from "../components/FacultySidebar";


function FacultyCourseDetails() {

  const navigate = useNavigate();
  const { courseId } = useParams();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getToken = () =>
    localStorage.getItem("facultyToken") ||
    localStorage.getItem("authToken");


  const fetchCourse = async () => {

    try {

      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        navigate("/faculty");
        return;
      }

      const response = await fetch(
        "http://localhost:8080/api/faculty/courses",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          "Unable to load course."
        );
      }

      const courses = await response.json();

      const selectedCourse =
        courses.find(
          course =>
            String(course.id) === String(courseId)
        );

      if (!selectedCourse) {
        throw new Error(
          "Course not found or you do not have access to it."
        );
      }

      setCourse(selectedCourse);

    } catch (err) {

      console.error(err);

      setError(
        err.message ||
        "Unable to load course."
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {
    fetchCourse();
  }, [courseId]);


  if (loading) {

    return (
      <div className="faculty-dashboard-loading">
        Loading course...
      </div>
    );

  }


  if (error || !course) {

    return (
      <div className="faculty-dashboard-loading">

        <p>
          {error || "Course not found."}
        </p>

        <button
          onClick={() =>
            navigate("/faculty/courses")
          }
          className="faculty-secondary-btn"
        >
          <ArrowLeft size={17} />
          Back to Courses
        </button>

      </div>
    );

  }


  return (

    <div className="faculty-dashboard">


        <FacultySidebar />  

      <main
        className="faculty-dashboard-main"
    
      >

        {/* HEADER */}

        <div className="faculty-dashboard-header">

          <div>

            <button
              onClick={() =>
                navigate("/faculty/courses")
              }
              className="faculty-back-btn"
            >
              <ArrowLeft size={17} />
              My Courses
            </button>

            <span className="section-label">
              FACULTY PORTAL
            </span>

            <h1>
              {course.name}
            </h1>

            <p>
              Manage this course and its learning content.
            </p>

          </div>

          <button
            onClick={fetchCourse}
            className="faculty-secondary-btn"
          >
            <RefreshCw size={17} />
            Refresh
          </button>

        </div>


        {/* COURSE INFORMATION */}

        <div className="faculty-dashboard-card">

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

            <div>
              <strong>Duration</strong>
              <span>
                {course.duration || "—"}
              </span>
            </div>

            <div>
              <strong>Mode</strong>
              <span>
                {course.mode || "—"}
              </span>
            </div>

            <div>
              <strong>Timing</strong>
              <span>
                {course.timing || "—"}
              </span>
            </div>

          </div>

        </div>


        {/* MANAGEMENT OPTIONS */}

        <div className="faculty-course-management-grid">

          <div
            className="faculty-dashboard-card faculty-management-card"
          >

            <div className="faculty-management-icon">
              <Users size={24} />
            </div>

            <span className="section-label">
              STUDENTS
            </span>

            <h2>
              Students
            </h2>

            <p>
              View students enrolled in this course.
            </p>

            <button
              onClick={() =>
                navigate(
                  `/faculty/students?courseId=${course.id}`
                )
              }
              className="faculty-secondary-btn"
            >
              <Users size={17} />
              View Students
            </button>

          </div>


          <div
            className="faculty-dashboard-card faculty-management-card"
          >

            <div className="faculty-management-icon">
              <FileText size={24} />
            </div>

            <span className="section-label">
              CONTENT
            </span>

            <h2>
              Study Materials
            </h2>

            <p>
              Upload and manage study materials for this course.
            </p>

            <button
              onClick={() =>
                navigate(
                  `/faculty/materials?courseId=${course.id}`
                )
              }
              className="faculty-secondary-btn"
            >
              <FileText size={17} />
              Manage Materials
            </button>

          </div>


          <div
            className="faculty-dashboard-card faculty-management-card"
          >

            <div className="faculty-management-icon">
              <PlayCircle size={24} />
            </div>

            <span className="section-label">
              YOUTUBE
            </span>

            <h2>
              YouTube Content
            </h2>

            <p>
              Manage YouTube videos and playlists.
            </p>

            <button
              onClick={() =>
                navigate(
                  `/faculty/youtube?courseId=${course.id}`
                )
              }
              className="faculty-secondary-btn"
            >
              <PlayCircle size={17} />
              Manage YouTube
            </button>

          </div>

        </div>

      </main>

    </div>
  );
}

export default FacultyCourseDetails;