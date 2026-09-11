import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  BookOpen,
  Users,
  FileText,
  PlayCircle,
  User,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react";

function FacultySidebar() {

  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("facultyTheme") === "dark";
  });


  const facultyName =
    localStorage.getItem("facultyName") ||
    "Faculty";

  const facultySubject =
    localStorage.getItem("facultySubject") ||
    "Faculty Portal";


  // =====================================================
  // APPLY THEME
  // =====================================================

  useEffect(() => {

    const theme =
      darkMode ? "dark" : "light";

    document.documentElement.setAttribute(
      "data-theme",
      theme
    );

    localStorage.setItem(
      "facultyTheme",
      theme
    );

  }, [darkMode]);


  // =====================================================
  // CLOSE MOBILE SIDEBAR ON RESIZE
  // =====================================================

  useEffect(() => {

    const handleResize = () => {

      if (window.innerWidth > 900) {
        setMobileOpen(false);
      }

    };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );
    };

  }, []);


  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {

    localStorage.removeItem("facultyToken");
    localStorage.removeItem("authToken");
    localStorage.removeItem("facultyName");
    localStorage.removeItem("facultySubject");

    navigate("/faculty");

  };


  // =====================================================
  // INITIAL
  // =====================================================

  const getInitial = () => {

    return facultyName
      ? facultyName.charAt(0).toUpperCase()
      : "F";

  };


  // =====================================================
  // NAVIGATION CLICK
  // =====================================================

  const handleNavigation = () => {

    if (window.innerWidth <= 900) {
      setMobileOpen(false);
    }

  };


  return (
    <>
      {/* =================================================
          MOBILE TOP BAR
      ================================================= */}

      <div className="faculty-mobile-header">

        <button
          className="faculty-mobile-menu-btn"
          onClick={() =>
            setMobileOpen(true)
          }
          aria-label="Open navigation"
        >
          <Menu size={22} />
        </button>


        <div className="faculty-mobile-brand">

          <div className="faculty-sidebar-logo-box">
            S
          </div>

          <div>
            <strong>
              SIGMA CLASSES
            </strong>

            <span>
              Faculty Portal
            </span>
          </div>

        </div>


        <button
          className="faculty-theme-toggle"
          onClick={() =>
            setDarkMode(prev => !prev)
          }
          aria-label="Toggle theme"
        >

          {darkMode ? (
            <Sun size={19} />
          ) : (
            <Moon size={19} />
          )}

        </button>

      </div>


      {/* =================================================
          MOBILE OVERLAY
      ================================================= */}

      {mobileOpen && (
        <div
          className="faculty-sidebar-overlay"
          onClick={() =>
            setMobileOpen(false)
          }
        />
      )}


      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside
        className={`faculty-sidebar ${
          mobileOpen
            ? "faculty-sidebar-mobile-open"
            : ""
        }`}
      >

        {/* =================================================
            SIDEBAR HEADER
        ================================================= */}

        <div className="faculty-sidebar-logo">

          <div className="faculty-sidebar-logo-box">
            S
          </div>

          <div className="faculty-sidebar-logo-text">

            <strong>
              SIGMA CLASSES
            </strong>

            <span>
              Faculty Portal
            </span>

          </div>


          {/* MOBILE CLOSE */}

          <button
            className="faculty-sidebar-close"
            onClick={() =>
              setMobileOpen(false)
            }
            aria-label="Close navigation"
          >
            <X size={21} />
          </button>

        </div>


        {/* =================================================
            FACULTY INFORMATION
        ================================================= */}

        <div className="faculty-sidebar-user">

          <div className="faculty-sidebar-avatar">
            {getInitial()}
          </div>

          <div className="faculty-sidebar-user-info">

            <strong>
              {facultyName}
            </strong>

            <span>
              {facultySubject}
            </span>

          </div>

        </div>


        {/* =================================================
            NAVIGATION
        ================================================= */}

        <nav className="faculty-sidebar-nav">

          {/* MAIN */}

          <div className="faculty-sidebar-section">

            <div className="faculty-sidebar-section-title">
              MAIN
            </div>


            <NavLink
              to="/faculty/dashboard"
              onClick={handleNavigation}
              className={({ isActive }) =>
                `faculty-sidebar-link ${
                  isActive ? "active" : ""
                }`
              }
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </NavLink>


            <NavLink
              to="/faculty/courses"
              onClick={handleNavigation}
              className={({ isActive }) =>
                `faculty-sidebar-link ${
                  isActive ? "active" : ""
                }`
              }
            >
              <BookOpen size={18} />
              <span>My Courses</span>
            </NavLink>


            <NavLink
              to="/faculty/students"
              onClick={handleNavigation}
              className={({ isActive }) =>
                `faculty-sidebar-link ${
                  isActive ? "active" : ""
                }`
              }
            >
              <Users size={18} />
              <span>Students</span>
            </NavLink>

          </div>


          {/* CONTENT */}

          <div className="faculty-sidebar-section">

            <div className="faculty-sidebar-section-title">
              CONTENT
            </div>


            <NavLink
              to="/faculty/materials"
              onClick={handleNavigation}
              className={({ isActive }) =>
                `faculty-sidebar-link ${
                  isActive ? "active" : ""
                }`
              }
            >
              <FileText size={18} />
              <span>Study Materials</span>
            </NavLink>


            <NavLink
              to="/faculty/youtube"
              onClick={handleNavigation}
              className={({ isActive }) =>
                `faculty-sidebar-link ${
                  isActive ? "active" : ""
                }`
              }
            >
              <PlayCircle size={18} />
              <span>YouTube Content</span>
            </NavLink>

          </div>


          {/* ACCOUNT */}

          <div className="faculty-sidebar-section">

            <div className="faculty-sidebar-section-title">
              ACCOUNT
            </div>


            <NavLink
              to="/faculty/profile"
              onClick={handleNavigation}
              className={({ isActive }) =>
                `faculty-sidebar-link ${
                  isActive ? "active" : ""
                }`
              }
            >
              <User size={18} />
              <span>My Profile</span>
            </NavLink>

          </div>

        </nav>


        {/* =================================================
            SIDEBAR BOTTOM
        ================================================= */}

        <div className="faculty-sidebar-bottom">

          {/* DESKTOP THEME */}

          <button
            className="faculty-sidebar-theme"
            onClick={() =>
              setDarkMode(prev => !prev)
            }
          >

            {darkMode ? (
              <Sun size={18} />
            ) : (
              <Moon size={18} />
            )}

            <span>
              {darkMode
                ? "Light Mode"
                : "Dark Mode"}
            </span>

          </button>


          {/* LOGOUT */}

          <button
            className="faculty-sidebar-logout"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>

        </div>

      </aside>
    </>
  );
}

export default FacultySidebar;