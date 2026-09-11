import { useEffect, useRef, useState } from "react";

import {
  ArrowLeft,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  User,
  UserPlus,
} from "lucide-react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";


function StudentRegister() {

  const navigate = useNavigate();
  const location = useLocation();

  const googleButtonRef = useRef(null);


  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });


  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);


  // =====================================================
  // GOOGLE SIGN UP
  // =====================================================

  useEffect(() => {

    if (!window.google || !googleButtonRef.current) {
      return;
    }


    window.google.accounts.id.initialize({

      client_id:
        "996737068260-86silob2jo1eok37ki9f6rtj8t4m307l.apps.googleusercontent.com",

      callback: async (response) => {

        try {

          setError("");
          setLoading(true);


          const googleResponse = await fetch(
            "http://localhost:8080/api/students/auth/google",
            {
              method: "POST",

              headers: {
                "Content-Type": "application/json",
              },

              body: JSON.stringify({
                credential: response.credential,
              }),
            }
          );


          const data = await googleResponse.json();


          if (!googleResponse.ok) {

            throw new Error(
              data.message ||
              "Google registration failed"
            );
          }


          // =================================================
          // SAVE STUDENT AUTHENTICATION
          // =================================================

          localStorage.setItem(
            "studentToken",
            data.token
          );

          localStorage.setItem(
            "studentEmail",
            data.email
          );

          localStorage.setItem(
            "studentName",
            data.name
          );


          // =================================================
          // REDIRECT
          // =================================================

          const destination =
            location.state?.from ||
            "/student/dashboard";


          navigate(destination, {
            replace: true,
          });


        } catch (error) {

          setError(
            error.message ||
            "Google registration failed"
          );

        } finally {

          setLoading(false);

        }
      },
    });


    // =====================================================
    // RENDER GOOGLE BUTTON
    // =====================================================

    window.google.accounts.id.renderButton(
      googleButtonRef.current,
      {
        theme: "outline",
        size: "large",
        width: 360,
        text: "continue_with",
        shape: "rectangular",
        logo_alignment: "left",
      }
    );

  }, [location.state, navigate]);


  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleChange = (event) => {

    const { name, value } = event.target;


    setFormData((current) => ({
      ...current,
      [name]: value,
    }));


    if (error) {
      setError("");
    }
  };


  // =====================================================
  // NORMAL REGISTRATION
  // =====================================================

  const handleSubmit = async (event) => {

    event.preventDefault();

    setError("");


    const phone =
      formData.phone.trim();


    // =====================================================
    // PHONE VALIDATION
    // =====================================================

    if (!/^[6-9]\d{9}$/.test(phone)) {

      setError(
        "Please enter a valid 10-digit Indian mobile number."
      );

      return;
    }


    setLoading(true);


    try {

      const response = await fetch(
        "http://localhost:8080/api/students/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(formData),
        }
      );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Registration failed"
        );
      }


      // =====================================================
      // REGISTRATION SUCCESS
      // =====================================================

      navigate("/student/login", {

        state: {
          from: location.state?.from,
        },

      });


    } catch (error) {

      setError(error.message);

    } finally {

      setLoading(false);

    }
  };


  // =====================================================
  // UI
  // =====================================================

  return (

    <main className="student-login-page">


      {/* =====================================================
          BACKGROUND DECORATION
      ===================================================== */}

      <div
        className="student-login-decoration student-login-decoration-one"
      />

      <div
        className="student-login-decoration student-login-decoration-two"
      />


      <div className="student-login-container">


        {/* =====================================================
            BACK
        ===================================================== */}

        <button
          type="button"
          className="student-login-back"
          onClick={() => navigate("/")}
        >

          <ArrowLeft size={16} />

          Back to Sigma Classes

        </button>


        <div className="student-login-layout">


          {/* =====================================================
              LEFT SIDE
          ===================================================== */}

          <div className="student-login-intro">


            <div className="student-login-brand">

              <span className="student-login-logo">
                S
              </span>

              <span className="student-login-brand-name">
                Sigma <strong>Classes</strong>
              </span>

            </div>


            <span className="student-login-portal-label">
              STUDENT PORTAL
            </span>


            <h1>
              Start your
              <br />

              <span>
                preparation journey.
              </span>

            </h1>


            <p>

              Create your Sigma Classes student account and
              get access to your enrolled courses, study
              materials, test results and free learning
              resources.

              Your Chance to be the part of best Coaching institute in Sasaram.

            </p>


            <div className="student-login-highlights">


              <div>

                <span>
                  01
                </span>

                <p>
                  Create your student account
                </p>

              </div>


              <div>

                <span>
                  02
                </span>

                <p>
                  Request enrollment in courses
                </p>

              </div>


              <div>

                <span>
                  03
                </span>

                <p>
                  Track your preparation journey
                </p>

              </div>


            </div>

          </div>


          {/* =====================================================
              REGISTER CARD
          ===================================================== */}

          <div className="student-login-card">


            <div className="student-login-card-header">


              <div className="student-login-icon">

                <UserPlus size={21} />

              </div>


              <div>

                <span className="section-label">
                  GET STARTED
                </span>


                <h2>
                  Create Account
                </h2>


                <p>
                  Register as a Sigma Classes student.
                </p>

              </div>

            </div>


            {/* =====================================================
                ERROR
            ===================================================== */}

            {error && (

              <div
                className="student-login-error"
                role="alert"
              >

                {error}

              </div>

            )}


            {/* =====================================================
                NORMAL REGISTRATION FORM
            ===================================================== */}

            <form
              className="student-login-form"
              onSubmit={handleSubmit}
            >


              {/* =====================================================
                  FULL NAME
              ===================================================== */}

              <div className="student-login-field">

                <label htmlFor="student-name">
                  Full Name
                </label>


                <div className="student-login-input-wrapper">

                  <User
                    size={18}
                    className="student-login-input-icon"
                  />


                  <input
                    id="student-name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    autoComplete="name"
                    required
                  />

                </div>

              </div>


              {/* =====================================================
                  EMAIL
              ===================================================== */}

              <div className="student-login-field">

                <label htmlFor="student-register-email">
                  Email Address
                </label>


                <div className="student-login-input-wrapper">

                  <Mail
                    size={18}
                    className="student-login-input-icon"
                  />


                  <input
                    id="student-register-email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                  />

                </div>

              </div>


              {/* =====================================================
                  PHONE
              ===================================================== */}

              <div className="student-login-field">

                <label htmlFor="student-phone">
                  Phone Number
                </label>


                <div className="student-login-input-wrapper">

                  <Phone
                    size={18}
                    className="student-login-input-icon"
                  />


                  <input
                    id="student-phone"
                    name="phone"
                    type="tel"
                    placeholder="Enter your 10-digit mobile number"
                    value={formData.phone}
                    onChange={handleChange}
                    autoComplete="tel"
                    inputMode="numeric"
                    pattern="[6-9][0-9]{9}"
                    maxLength={10}
                    required
                  />

                </div>

              </div>


              {/* =====================================================
                  PASSWORD
              ===================================================== */}

              <div className="student-login-field">

                <label htmlFor="student-register-password">
                  Password
                </label>


                <div className="student-login-input-wrapper">

                  <LockKeyhole
                    size={18}
                    className="student-login-input-icon"
                  />


                  <input
                    id="student-register-password"
                    name="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    required
                  />


                  <button
                    type="button"
                    className="student-login-password-toggle"
                    onClick={() =>
                      setShowPassword(
                        (current) => !current
                      )
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >

                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}

                  </button>

                </div>

              </div>


              {/* =====================================================
                  CREATE ACCOUNT
              ===================================================== */}

              <button
                type="submit"
                className="student-login-submit"
                disabled={loading}
              >

                {loading ? (

                  <>
                    <span className="student-login-spinner" />
                    Creating Account...
                  </>

                ) : (

                  "Create Account"

                )}

              </button>


            </form>


            {/* =====================================================
                GOOGLE SIGN UP
            ===================================================== */}

            <div className="student-login-divider">

              <span>
                Or continue with
              </span>

            </div>


            <div
              ref={googleButtonRef}
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "16px",
              }}
            />


            {/* =====================================================
                LOGIN
            ===================================================== */}

            <div className="student-login-divider">

              <span>
                Already have an account?
              </span>

            </div>


            <button
              type="button"
              className="student-login-register"
              onClick={() =>
                navigate("/student/login", {
                  state: {
                    from: location.state?.from,
                  },
                })
              }
            >

              <UserPlus size={17} />

              Sign In

            </button>


            <p className="student-login-footer">

              Your account lets you access Sigma Classes
              student services and resources.

            </p>


          </div>

        </div>

      </div>

    </main>

  );
}


export default StudentRegister;