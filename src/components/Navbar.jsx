import {
  Menu,
  Moon,
  Phone,
  Sun,
  X,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";

function Navbar() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("sigma-theme");

    if (savedTheme) {
      return savedTheme === "dark";
    }

    return true;
  });

  const [menuOpen, setMenuOpen] = useState(false);

  const [isStudentLoggedIn, setIsStudentLoggedIn] = useState(
    () => Boolean(localStorage.getItem("studentToken"))
  );

  useEffect(() => {
    const theme = darkMode ? "dark" : "light";

    document.documentElement.setAttribute("data-theme", theme);

    localStorage.setItem("sigma-theme", theme);
  }, [darkMode]);

  useEffect(() => {
    const checkStudentLogin = () => {
      setIsStudentLoggedIn(
        Boolean(localStorage.getItem("studentToken"))
      );
    };

    window.addEventListener("storage", checkStudentLogin);

    return () => {
      window.removeEventListener("storage", checkStudentLogin);
    };
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="container nav-container">

        {/* Logo */}
        <a
          href="/"
          className="logo"
          onClick={closeMenu}
        >
          <span className="logo-mark">S</span>

          <span>
            Sigma <strong>Classes</strong>
          </span>
        </a>


        {/* Navigation */}
        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>

          <a href="/#home" onClick={closeMenu}>
            Home
          </a>

          <a href="/courses"onClick={closeMenu}>
            Courses
          </a>

          <a href="/#results" onClick={closeMenu}>
            Results
          </a>

          <a href="/#faculty" onClick={closeMenu}>
            Faculty
          </a>

          <a href="/#enquiry" onClick={closeMenu}>
            Contact
          </a>

          {/* Student Portal */}
          <a
            href={
              isStudentLoggedIn
                ? "/student/dashboard"
                : "/student/login"
            }
            className="nav-student-link"
            onClick={closeMenu}
          >
            <UserRound size={16} />

            <span>
              {isStudentLoggedIn
                ? "Dashboard"
                : "Student Portal"}
            </span>
          </a>

        </nav>


        {/* Actions */}
        <div className="nav-actions">

          {/* Theme Toggle */}
          <button
            type="button"
            className="theme-toggle"
            onClick={() =>
              setDarkMode((current) => !current)
            }
            aria-label={
              darkMode
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
            title={
              darkMode
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
          >
            {darkMode ? (
              <Sun size={18} />
            ) : (
              <Moon size={18} />
            )}
          </button>


          {/* Desktop CTA */}
          <a
            href="tel:+919471268826"
            className="nav-cta"
          >
            <Phone size={17} />
            <span>Talk to Us</span>
          </a>


          {/* Mobile Menu */}
          <button
            type="button"
            className="mobile-menu"
            onClick={() =>
              setMenuOpen((current) => !current)
            }
            aria-label={
              menuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <X size={23} />
            ) : (
              <Menu size={23} />
            )}
          </button>

        </div>

      </div>
    </header>
  );
}

export default Navbar;