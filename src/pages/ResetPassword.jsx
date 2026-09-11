import { useState } from "react";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  LockKeyhole,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [status, setStatus] = useState("form");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!token) {
      setStatus("error");
      setError("Password reset token is missing.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch(
        "http://localhost:8080/api/students/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to reset password."
        );
      }

      setStatus("success");
    } catch (error) {
      setStatus("error");
      setError(
        error.message || "Unable to reset your password."
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
          onClick={() => navigate("/")}
        >
          <ArrowLeft size={16} />
          Back to Sigma Classes
        </button>


        <div className="student-verification-card">

          {/* =================================================
              RESET FORM
          ================================================= */}

          {status === "form" && (
            <>
              <div className="student-verification-icon loading">
                <LockKeyhole size={38} />
              </div>

              <span className="student-login-portal-label">
                STUDENT PORTAL
              </span>

              <h1>
                Create a new password
              </h1>

              <p>
                Enter a new password for your Sigma Classes
                student account.
              </p>


              {error && (
                <div
                  className="student-login-error"
                  role="alert"
                >
                  {error}
                </div>
              )}


              <form
                className="student-login-form"
                onSubmit={handleSubmit}
              >

                {/* NEW PASSWORD */}

                <div className="student-login-field">
                  <label htmlFor="reset-password">
                    New Password
                  </label>

                  <div className="student-login-input-wrapper">

                    <LockKeyhole
                      size={18}
                      className="student-login-input-icon"
                    />

                    <input
                      id="reset-password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(event) =>
                        setNewPassword(
                          event.target.value
                        )
                      }
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


                {/* CONFIRM PASSWORD */}

                <div className="student-login-field">
                  <label htmlFor="reset-confirm-password">
                    Confirm Password
                  </label>

                  <div className="student-login-input-wrapper">

                    <LockKeyhole
                      size={18}
                      className="student-login-input-icon"
                    />

                    <input
                      id="reset-confirm-password"
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(
                          event.target.value
                        )
                      }
                      autoComplete="new-password"
                      required
                    />

                    <button
                      type="button"
                      className="student-login-password-toggle"
                      onClick={() =>
                        setShowConfirmPassword(
                          (current) => !current
                        )
                      }
                      aria-label={
                        showConfirmPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>

                  </div>
                </div>


                <button
                  type="submit"
                  className="student-login-submit"
                  disabled={status === "loading"}
                >
                  {status === "loading"
                    ? "Resetting Password..."
                    : "Reset Password"}
                </button>

              </form>
            </>
          )}


          {/* =================================================
              SUCCESS
          ================================================= */}

          {status === "success" && (
            <>
              <div className="student-verification-icon success">
                <CheckCircle2 size={42} />
              </div>

              <span className="student-login-portal-label">
                PASSWORD UPDATED
              </span>

              <h1>
                Password reset successfully!
              </h1>

              <p>
                Your Sigma Classes student account password
                has been updated successfully.
                <br />
                <br />
                You can now sign in using your new password.
              </p>

              <button
                type="button"
                className="student-login-submit"
                onClick={() =>
                  navigate("/student/login")
                }
              >
                Go to Student Login
              </button>
            </>
          )}


          {/* =================================================
              ERROR
          ================================================= */}

          {status === "error" && (
            <>
              <div className="student-verification-icon error">
                <AlertCircle size={42} />
              </div>

              <span className="student-login-portal-label">
                RESET FAILED
              </span>

              <h1>
                Unable to reset password
              </h1>

              <p>
                {error}
              </p>

              <button
                type="button"
                className="student-login-submit"
                onClick={() =>
                  navigate("/student/login")
                }
              >
                Go to Student Login
              </button>
            </>
          )}

        </div>
      </div>
    </main>
  );
}

export default ResetPassword;