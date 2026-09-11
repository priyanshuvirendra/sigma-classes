import { useNavigate } from "react-router-dom";
import {
  LogOut,
  User,
  BookOpen,
  Users,
  FileText,
  CalendarDays,
} from "lucide-react";

function Faculty() {

  const navigate = useNavigate();

  const facultyName =
    localStorage.getItem("facultyName") ||
    localStorage.getItem("userName") ||
    "Faculty";


  const handleLogout = () => {

    localStorage.removeItem("authToken");
    localStorage.removeItem("authRole");
    localStorage.removeItem("authIdentifier");

    localStorage.removeItem("facultyToken");
    localStorage.removeItem("facultyUsername");
    localStorage.removeItem("facultyName");

    navigate("/admin/login");

  };


  return (

    <main className="faculty-portal">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="faculty-portal-header">

        <div>

          <span className="section-label">
            FACULTY PORTAL
          </span>

          <h1>
            Welcome, {facultyName}.
          </h1>

          <p>
            Manage your classes, students and
            academic content from here.
          </p>

        </div>


        <button
          className="faculty-logout-btn"
          onClick={handleLogout}
        >

          <LogOut size={17} />

          Logout

        </button>

      </header>


      {/* =================================================
          DASHBOARD CARDS
      ================================================= */}

      <section className="faculty-dashboard-grid">


        {/* PROFILE */}

        <article className="faculty-dashboard-card">

          <div className="faculty-dashboard-icon">
            <User size={22} />
          </div>

          <h3>
            My Profile
          </h3>

          <p>
            View and manage your faculty profile.
          </p>

        </article>


        {/* COURSES */}

        <article className="faculty-dashboard-card">

          <div className="faculty-dashboard-icon">
            <BookOpen size={22} />
          </div>

          <h3>
            My Courses
          </h3>

          <p>
            View the courses assigned to you.
          </p>

        </article>


        {/* STUDENTS */}

        <article className="faculty-dashboard-card">

          <div className="faculty-dashboard-icon">
            <Users size={22} />
          </div>

          <h3>
            Students
          </h3>

          <p>
            View students enrolled in your courses.
          </p>

        </article>


        {/* STUDY MATERIAL */}

        <article className="faculty-dashboard-card">

          <div className="faculty-dashboard-icon">
            <FileText size={22} />
          </div>

          <h3>
            Study Material
          </h3>

          <p>
            Upload and manage study materials.
          </p>

        </article>


        {/* CLASSES */}

        <article className="faculty-dashboard-card">

          <div className="faculty-dashboard-icon">
            <CalendarDays size={22} />
          </div>

          <h3>
            Classes
          </h3>

          <p>
            Manage your upcoming classes.
          </p>

        </article>

      </section>

    </main>

  );

}

export default Faculty;