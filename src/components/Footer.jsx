function Footer() {

  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">

      <div className="container">

        <div className="footer-grid">

          {/* =====================================================
              BRAND
          ===================================================== */}

          <div className="footer-brand">

            <a href="#home" className="logo footer-logo">

              <span className="logo-mark">
                SIGMA
              </span>

              <span>
                SIGMA <strong>CLASSES</strong>
              </span>

            </a>

            <p className="footer-description">
           BPSC • SSC • BANK • Competitive Exams
Focused preparation with experienced faculty and structured guidance.
            </p>

            <div className="footer-location">
              <span>📍</span>
              <span>
               Sasaram, Bihar
              </span>
            </div>

          </div>


          {/* =====================================================
              QUICK LINKS
          ===================================================== */}

          <div className="footer-column">

            <h4>
              Quick Links
            </h4>

            <a href="#home">
              Home
            </a>

            <a href="#courses">
              Courses
            </a>

            <a href="#faculty">
              Faculty
            </a>

            <a href="#results">
              Results
            </a>

     <a href="/admin">
  Staff Login
</a>

            <a href="#contact">
              Contact
            </a>

          </div>


          {/* =====================================================
              COURSES
          ===================================================== */}

          <div className="footer-column">

            <h4>
              Popular Courses
            </h4>

            <a href="#courses">
              SSC CGL
            </a>

            <a href="#courses">
              SSC CHSL
            </a>

            <a href="#courses">
              Banking Exams
            </a>

            <a href="#courses">
              Quantitative Aptitude
            </a>

            <a href="#courses">
              Reasoning
            </a>

            <a href="#courses">
              English
            </a>

          </div>


          {/* =====================================================
              STUDENT PORTAL
          ===================================================== */}

          <div className="footer-column">

            <h4>
              Student Portal
            </h4>

            <a href="/student/login">
              Student Login
            </a>

            <a href="/student/dashboard">
              My Courses
            </a>

            <a href="/student/dashboard">
              Study Materials
            </a>

            <a href="/student/dashboard">
              YouTube Content
            </a>

            <a href="/student/forgot-password">
              Forgot Password
            </a>

          </div>


          {/* =====================================================
              CONTACT
          ===================================================== */}

          <div className="footer-column">

            <h4>
              Contact Us
            </h4>

           <a href="tel:+919471268826">
              +91 94712 68826
            </a>

            <a href="tel:+919198940104">  +91 91989 40104 </a>

            <a href="mailto:info@sigmaclasses.com">
              info@sigmaclasses.com
            </a>

            <span>
              Sasaram, Bhar
            </span>

            <span>
              Mon – Sat: 9:00 AM – 7:00 PM
            </span>

          </div>

        </div>


        {/* =====================================================
            SOCIAL + LEGAL
        ===================================================== */}

        <div className="footer-middle">

          <div className="footer-social">

            <span>
              Follow Sigma Classes
            </span>

            <div className="social-links">

              <a
                href="https://www.youtube.com/@SigmaClasses87"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
              >
                YouTube
              </a>

              <a
                href="#"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                Instagram
              </a>

              <a
                href="https://www.facebook.com/p/SIGMA-Classes-61558091289264/"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
              >
                Facebook
              </a>

              <a
                href="#"
                target="_blank"
                rel="noreferrer"
                aria-label="Telegram"
              >
                Telegram
              </a>

            </div>

          </div>

        </div>


        {/* =====================================================
            BOTTOM
        ===================================================== */}

        <div className="footer-bottom">

          <span>
            © {currentYear} Sigma Classes. All rights reserved.
          </span>

          <span>
            Empowering students to prepare smarter.
          </span>

        </div>

      </div>

    </footer>
  );
}

export default Footer;