import { useState } from "react";
import {
  ArrowLeft,
  LockKeyhole,
  Mail,
  Send,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("form");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch(
        "https://sigma-classes-backend-ajkh.onrender.com/api/students/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to process your request."
        );
      }

      setMessage(
        data.message ||
          "If an account exists with this email, a password reset link has been sent."
      );

      setStatus("success");
    } catch (error) {
      setStatus("error");
      setMessage(
        error.message ||
          "Unable to send password reset email."
      );
    }
  };

  return (
    <main className="student-login-page">
      <div className="student-login-decoration student-login-decoration-one" />
      <div className="student-login-decoration student-login-decoration-two" />

      <div className="student-login-container">

        <button
          type="button"
          className="student-login-back"
          onClick={() => navigate("/student/login")}
        >
          <ArrowLeft size={16} />
          Back to Student Login
        </button>

        <div className="student-verification-card">

          {status === "form" && (
            <>
              <div className="student-verification-icon loading">
                <LockKeyhole size={38} />
              </div>

              <span className="student-login-portal-label">
                STUDENT PORTAL
              </span>

              <h1>
                Forgot your password?
              </h1>

              <p>
                Enter the email address associated with your
                Sigma Classes account and we'll send you a
                password reset link.
              </p>

              <form
                className="student-login-form"
                onSubmit={handleSubmit}
              >
                <div className="student-login-field">
                  <label htmlFor="forgot-email">
                    Email Address
                  </label>

                  <div className="student-login-input-wrapper">
                    <Mail
                      size={18}
                      className="student-login-input-icon"
                    />

                    <input
                      id="forgot-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(event) =>
                        setEmail(event.target.value)
                      }
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="student-login-submit"
                  disabled={status === "loading"}
                >
                  {status === "loading" ? (
                    <>
                      <span className="student-login-spinner" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={17} />
                      Send Reset Link
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          {status === "success" && (
            <>
              <div className="student-verification-icon success">
                <CheckCircle2 size={42} />
              </div>

              <span className="student-login-portal-label">
                CHECK YOUR EMAIL
              </span>

              <h1>
                Reset link sent
              </h1>

              <p>
                {message}
              </p>

              <button
                type="button"
                className="student-login-submit"
                onClick={() =>
                  navigate("/student/login")
                }
              >
                Back to Student Login
              </button>
            </>
          )}

          {status === "error" && (
            <>
              <div className="student-verification-icon error">
                <LockKeyhole size={42} />
              </div>

              <span className="student-login-portal-label">
                SOMETHING WENT WRONG
              </span>

              <h1>
                Unable to send reset link
              </h1>

              <p>
                {message}
              </p>

              <button
                type="button"
                className="student-login-submit"
                onClick={() => {
                  setStatus("form");
                  setMessage("");
                }}
              >
                Try Again
              </button>
            </>
          )}

        </div>
      </div>
    </main>
  );
}

export default ForgotPassword;