import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  UserRound,
  BookOpen,
  Users,
  FileText,
  PlayCircle,
  LogOut,
  Menu,
  X,
} from "lucide-react";

import FacultySidebar from "../components/FacultySidebar";


function FacultyDashboard() {

  const navigate = useNavigate();

  const [faculty, setFaculty] = useState(null);

  const [stats, setStats] = useState({
    courses: 0,
    students: 0,
    studyMaterials: 0,
    youtubeContent: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
 // nst [sidebarOpen, setSidebarOpen] = useState(false);


  // =====================================================
  // GET FACULTY TOKEN
  // =====================================================

  const getToken = () => {

    return (
      localStorage.getItem("facultyToken") ||
      localStorage.getItem("authToken")
    );

  };


  // =====================================================
  // FETCH DASHBOARD DATA
  // =====================================================

  useEffect(() => {

    const token = getToken();


    // ---------------------------------------------------
    // NO TOKEN
    // ---------------------------------------------------

    if (!token) {

      navigate("/admin/login");

      return;
    }


    const fetchDashboard = async () => {

      try {

        setLoading(true);
        setError("");


        // =================================================
        // 1. FACULTY PROFILE
        // =================================================

        const profileResponse = await fetch(
          "https://sigma-classes-backend-ajkh.onrender.com/api/faculty/profile",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );


        if (!profileResponse.ok) {

          throw new Error(
            "Unable to load faculty profile"
          );

        }


        const facultyData =
          await profileResponse.json();


        setFaculty(facultyData);


        // =================================================
        // 2. COURSES
        // =================================================

        const coursesResponse = await fetch(
          "https://sigma-classes-backend-ajkh.onrender.com/api/faculty/courses",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );


        if (!coursesResponse.ok) {

          throw new Error(
            "Unable to load faculty courses"
          );

        }


        const courses =
          await coursesResponse.json();


        // =================================================
        // 3. STUDENTS
        // =================================================

        const studentsResponse = await fetch(
          "https://sigma-classes-backend-ajkh.onrender.com/api/faculty/students",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );


        if (!studentsResponse.ok) {

          throw new Error(
            "Unable to load faculty students"
          );

        }


        const students =
          await studentsResponse.json();


        // =================================================
        // 4. STUDY MATERIALS
        // =================================================

        const materialsResponse = await fetch(
          "https://sigma-classes-backend-ajkh.onrender.com/api/faculty/materials",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );


        if (!materialsResponse.ok) {

          throw new Error(
            "Unable to load study materials"
          );

        }


        const materials =
          await materialsResponse.json();


        // =================================================
        // 5. YOUTUBE CONTENT
        // =================================================

        const youtubeResponse = await fetch(
          "https://sigma-classes-backend-ajkh.onrender.com/api/faculty/youtube",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );


        if (!youtubeResponse.ok) {

          throw new Error(
            "Unable to load YouTube content"
          );

        }


        const youtubeContent =
          await youtubeResponse.json();


        // =================================================
        // 6. UPDATE STATISTICS
        // =================================================

        setStats({

          courses:
            Array.isArray(courses)
              ? courses.length
              : 0,


          students:
            Array.isArray(students)
              ? new Set(
                  students.map(
                    (student) =>
                      student.studentId ||
                      student.id
                  )
                ).size
              : 0,


          studyMaterials:
            Array.isArray(materials)
              ? materials.length
              : 0,


          youtubeContent:
            Array.isArray(youtubeContent)
              ? youtubeContent.length
              : 0,

        });


      } catch (err) {

        console.error(
          "Faculty dashboard error:",
          err
        );


        setError(
          err.message ||
          "Unable to load dashboard"
        );


      } finally {

        setLoading(false);

      }

    };


    fetchDashboard();

  }, [navigate]);


  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {

    localStorage.removeItem("authToken");
    localStorage.removeItem("authRole");
    localStorage.removeItem("authIdentifier");

    localStorage.removeItem("facultyToken");
    localStorage.removeItem("facultyUsername");
    localStorage.removeItem("facultyName");

    navigate("/admin/login");

  };


  // =====================================================
  // NAVIGATION
  // =====================================================

 const goTo = (path) => {
  navigate(path);
};


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="faculty-dashboard-loading">

        Loading dashboard...

      </div>

    );

  }


  // =====================================================
  // ERROR
  // =====================================================

  if (error && !faculty) {

    return (

      <div className="faculty-dashboard-loading">

        <p>{error}</p>

        <button
          onClick={() =>
            window.location.reload()
          }
        >
          Try Again
        </button>

      </div>

    );

  }


  if (!faculty) {

    return null;

  }


  // =====================================================
  // DASHBOARD
  // =====================================================

return (
  <div className="faculty-layout">

    <FacultySidebar />

    <main className="faculty-main">

      {/* =================================================
          MAIN CONTENT
      ================================================= */}



        {/* =================================================
            HEADER
        ================================================= */}

        <div className="faculty-dashboard-header">

          <div>

            <span className="section-label">
              FACULTY PORTAL
            </span>

            <h1>
              Welcome back,{" "}
              {faculty.name}.
            </h1>

            <p>
              Manage your courses, students
              and learning content.
            </p>

          </div>


          <div className="faculty-header-user">

            <div className="faculty-avatar">

              {faculty.name?.charAt(0)}

            </div>

            <div>

              <strong>
                {faculty.name}
              </strong>

              <span>
                {faculty.subject}
              </span>

            </div>

          </div>

        </div>


        {/* ERROR */}

        {error && (

          <div className="faculty-dashboard-error">

            {error}

          </div>

        )}


        {/* =================================================
            STATISTICS
        ================================================= */}

        <section className="faculty-stats-grid">


          {/* COURSES */}

          <button
            className="faculty-stat-card"
            onClick={() =>
              goTo("/faculty/courses")
            }
          >

            <div className="faculty-stat-icon">

              <BookOpen size={20} />

            </div>

            <span>
              My Courses
            </span>

            <strong>
              {stats.courses}
            </strong>

          </button>


          {/* STUDENTS */}

          <button
            className="faculty-stat-card"
            onClick={() =>
              goTo("/faculty/students")
            }
          >

            <div className="faculty-stat-icon">

              <Users size={20} />

            </div>

            <span>
              Students
            </span>

            <strong>
              {stats.students}
            </strong>

          </button>


          {/* STUDY MATERIAL */}

          <button
            className="faculty-stat-card"
            onClick={() =>
              goTo("/faculty/materials")
            }
          >

            <div className="faculty-stat-icon">

              <FileText size={20} />

            </div>

            <span>
              Study Materials
            </span>

            <strong>
              {stats.studyMaterials}
            </strong>

          </button>


          {/* YOUTUBE */}

          <button
            className="faculty-stat-card"
            onClick={() =>
              goTo("/faculty/youtube")
            }
          >

            <div className="faculty-stat-icon">

              <PlayCircle size={20} />

            </div>

            <span>
              YouTube Content
            </span>

            <strong>
              {stats.youtubeContent}
            </strong>

          </button>

        </section>


        {/* =================================================
            PROFILE + QUICK ACTIONS
        ================================================= */}

        <section className="faculty-dashboard-grid">


          {/* PROFILE */}

          <div className="faculty-dashboard-card">

            <div className="faculty-card-header">

              <div>

                <span className="section-label">
                  PROFILE
                </span>

                <h2>
                  Faculty Information
                </h2>

              </div>

            </div>


            <div className="faculty-profile-details">


              <div>

                <span>
                  Name
                </span>

                <strong>
                  {faculty.name}
                </strong>

              </div>


              <div>

                <span>
                  Username
                </span>

                <strong>
                  {faculty.username}
                </strong>

              </div>


              <div>

                <span>
                  Email
                </span>

                <strong>
                  {faculty.email}
                </strong>

              </div>


              <div>

                <span>
                  Subject
                </span>

                <strong>
                  {faculty.subject}
                </strong>

              </div>


              <div>

                <span>
                  Designation
                </span>

                <strong>
                  {faculty.designation}
                </strong>

              </div>


              <div>

                <span>
                  Experience
                </span>

                <strong>
                  {faculty.experience}
                </strong>

              </div>


            </div>

          </div>


          {/* QUICK ACTIONS */}

          <div className="faculty-dashboard-card">

            <div className="faculty-card-header">

              <div>

                <span className="section-label">
                  QUICK ACTIONS
                </span>

                <h2>
                  Manage Content
                </h2>

              </div>

            </div>


            <div className="faculty-quick-actions">


              <button
                onClick={() =>
                  goTo("/faculty/courses")
                }
              >

                <BookOpen size={20} />

                <div>

                  <strong>
                    My Courses
                  </strong>

                  <span>
                    View assigned courses
                  </span>

                </div>

              </button>


              <button
                onClick={() =>
                  goTo("/faculty/materials")
                }
              >

                <FileText size={20} />

                <div>

                  <strong>
                    Study Materials
                  </strong>

                  <span>
                    Upload learning material
                  </span>

                </div>

              </button>


              <button
                onClick={() =>
                  goTo("/faculty/youtube")
                }
              >

                <PlayCircle size={20} />

                <div>

                  <strong>
                    YouTube Content
                  </strong>

                  <span>
                    Manage video resources
                  </span>

                </div>

              </button>


            </div>

          </div>

        </section>


        {/* =================================================
            ABOUT FACULTY
        ================================================= */}

        <section className="faculty-dashboard-card faculty-about-card">

          <span className="section-label">
            ABOUT YOU
          </span>

          <h2>
            Teaching Profile
          </h2>

          <p>
            {faculty.description ||
              "No description available."}
          </p>

        </section>


      </main>

    </div>

  );

}


export default FacultyDashboard;