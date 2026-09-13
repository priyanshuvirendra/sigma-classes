function Footer() {

  const currentYear = new Date().getFullYear();

  const googleMapsUrl =
    "https://maps.app.goo.gl/SN9eicfNBMT28Eot7";

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
              Focused preparation for competitive exams with
              experienced faculty and structured guidance.
            </p>

            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className="footer-location-link"
            >
              📍 Sasaram, Bihar
            </a>

          </div>


          {/* =====================================================
              QUICK LINKS
          ===================================================== */}

          <div className="footer-column">

            <h4>Quick Links</h4>

            <a href="#home">
              Home
            </a>

            <a href="/courses">
              Courses
            </a>

           <a href="/#faculty">
  Faculty
</a>

<a href="/#results">
  Results
</a>

<a href="/#enquiry">
  Contact
</a>
          </div>


          {/* =====================================================
              STUDENT
          ===================================================== */}

          <div className="footer-column">

            <h4>Student</h4>

            <a href="/student/login">
              Student Login
            </a>

            <a href="/student/register">
              Create Account
            </a>

            <a href="/student/forgot-password">
              Forgot Password
            </a>

            <a href="/admin">
              Staff Login
            </a>

          </div>


          {/* =====================================================
              CONTACT
          ===================================================== */}

          <div className="footer-column footer-contact">

            <h4>Contact Us</h4>

            <a href="tel:+919471268826">
              +91 94712 68826
            </a>

            <a href="tel:+919198940104">
              +91 91989 40104
            </a>

            <a href="mailto:info@sigmaclasses.com">
              info@sigmaclasses.com
            </a>

            <span>
              Mon – Sat: 9:00 AM – 7:00 PM
            </span>

          </div>

        </div>


        {/* =====================================================
            LOCATION
        ===================================================== */}

        <div className="footer-location-section">

          <div className="footer-location-content">

            <div>

              <span className="footer-location-label">
                FIND US
              </span>

              <h3>
                Visit Sigma Classes
              </h3>

              <p>
                2nd Floor, Above Just Study Library, Behind P-Mart, Near Overbridge, Gaurakshini, Sasaram, Bihar
              </p>

            </div>

            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className="footer-map-card"
              aria-label="Open Sigma Classes location in Google Maps"
            >

              <div className="footer-map-placeholder">

                <span className="footer-map-pin">
                  📍
                </span>

                <span>
                  Sigma Classes
                </span>

                <small>
                  Sasaram, Bihar
                </small>

              </div>

              <div className="footer-map-action">
                View on Google Maps →
              </div>

            </a>

          </div>

        </div>


        {/* =====================================================
            SOCIAL
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
                href="https://www.facebook.com/p/SIGMA-Classes-61558091289264/"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
              >
                Facebook
              </a>
 <a
                href="https://www.google.com/maps/place//@24.9588286,84.0151549,17z/data=!3m1!4b1!4m3!3m2!1s0x398db7e084da4bdb:0x24ed74ce9c11728b!12e1?entry=ttu&g_ep=EgoyMDI2MDkwOS4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noreferrer"
                aria-label="Google"   
              >
                Review Us on Google
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