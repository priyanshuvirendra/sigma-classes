import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  LoaderCircle,
  XCircle,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

function VerifyEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  const verificationStarted = useRef(false);

  useEffect(() => {
    if (verificationStarted.current) {
      return;
    }

    verificationStarted.current = true;

    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Verification token is missing.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(
          `https://sigma-classes-backend-ajkh.onrender.com/api/students/verify-email?token=${encodeURIComponent(
            token
          )}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Email verification failed."
          );
        }

        setStatus("success");
        setMessage(
          data.message || "Email verified successfully."
        );
      } catch (error) {
        setStatus("error");
        setMessage(
          error.message || "Unable to verify your email."
        );
      }
    };

    verifyEmail();
  }, [searchParams]);

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

          {/* LOADING */}

          {status === "loading" && (
            <>
              <div className="student-verification-icon loading">
                <LoaderCircle size={38} />
              </div>

              <span className="student-login-portal-label">
                STUDENT PORTAL
              </span>

              <h1>
                Verifying your email...
              </h1>

              <p>
                Please wait while we verify your
                Sigma Classes student account.
              </p>
            </>
          )}


          {/* SUCCESS */}

          {status === "success" && (
            <>
              <div className="student-verification-icon success">
                <CheckCircle2 size={42} />
              </div>

              <span className="student-login-portal-label">
                EMAIL VERIFIED
              </span>

              <h1>
                Email verified successfully!
              </h1>

              <p>
                {message}
                <br />
                <br />
                Your Sigma Classes account is now ready.
                You can sign in to your student portal.
              </p>

              <button
                type="button"
                className="student-login-submit"
                onClick={() => navigate("/student/login")}
              >
                Go to Student Login
              </button>
            </>
          )}


          {/* ERROR */}

          {status === "error" && (
            <>
              <div className="student-verification-icon error">
                <XCircle size={42} />
              </div>

              <span className="student-login-portal-label">
                VERIFICATION FAILED
              </span>

              <h1>
                Unable to verify email
              </h1>

              <p>
                {message}
              </p>

              <button
                type="button"
                className="student-login-submit"
                onClick={() => navigate("/student/login")}
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

export default VerifyEmail;