import { useEffect, useRef, useState } from "react";

import {
    ArrowLeft,
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
    UserPlus,
} from "lucide-react";

import {
    useLocation,
    useNavigate,
} from "react-router-dom";


function StudentLogin() {

    const navigate = useNavigate();
    const location = useLocation();

    const googleButtonRef = useRef(null);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [
        resendingVerification,
        setResendingVerification
    ] = useState(false);

    const [
        verificationMessage,
        setVerificationMessage
    ] = useState("");


    // =====================================================
    // GOOGLE SIGN-IN
    // =====================================================

    useEffect(() => {

        let intervalId;

        const initializeGoogleLogin = () => {

            if (
                !window.google ||
                !window.google.accounts ||
                !window.google.accounts.id ||
                !googleButtonRef.current
            ) {
                return false;
            }

            // Prevent rendering the button multiple times
            if (googleButtonRef.current.childNodes.length > 0) {
                return true;
            }

            window.google.accounts.id.initialize({
                client_id:
                    "996737068260-86silob2jo1eok37ki9f6rtj8t4m307l.apps.googleusercontent.com",

                callback: handleGoogleResponse,
            });


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

            return true;
        };


        // Google script is async, so wait until it is available
        if (!initializeGoogleLogin()) {

            intervalId = setInterval(() => {

                if (initializeGoogleLogin()) {
                    clearInterval(intervalId);
                }

            }, 300);

        }


        return () => {

            if (intervalId) {
                clearInterval(intervalId);
            }

        };

    }, []);


    // =====================================================
    // HANDLE GOOGLE RESPONSE
    // =====================================================

    const handleGoogleResponse = async (response) => {

        if (!response?.credential) {
            setError("Google authentication failed.");
            return;
        }

        setError("");
        setVerificationMessage("");
        setGoogleLoading(true);

        try {

            const backendResponse = await fetch(
                "https://sigma-classes-backend-ajkh.onrender.com/api/students/auth/google",
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


            const data = await backendResponse.json();


            if (!backendResponse.ok) {

                throw new Error(
                    data.message ||
                    "Google sign-in failed. Please try again."
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
            // RETURN TO ORIGINAL PAGE
            // =================================================

            const destination =
                location.state?.from ||
                "/student/dashboard";


            navigate(destination, {
                replace: true,
            });


        } catch (error) {

            console.error(
                "Google login error:",
                error
            );

            setError(
                error.message ||
                "Unable to sign in with Google."
            );

        } finally {

            setGoogleLoading(false);

        }

    };


    // =====================================================
    // EMAIL / PASSWORD LOGIN
    // =====================================================

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;


        setFormData((current) => ({
            ...current,
            [name]: value,
        }));


        if (error) {
            setError("");
        }

    };


    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setLoading(true);

        try {

            const response = await fetch(
                "https://sigma-classes-backend-ajkh.onrender.com/api/students/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify(formData),
                }
            );


            const data = await response.json();


            if (!response.ok) {

                if (
                    response.status === 403 &&
                    data.emailVerified === false
                ) {

                    setVerificationMessage("");

                    throw new Error(
                        "Please verify your email before logging in."
                    );

                }


                throw new Error(
                    data.message ||
                    "Invalid email or password"
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
            // RETURN TO ORIGINAL PAGE
            // =================================================

            const destination =
                location.state?.from ||
                "/student/dashboard";


            navigate(destination, {
                replace: true,
            });


        } catch (error) {

            setError(error.message);

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // RESEND VERIFICATION EMAIL
    // =====================================================

    const handleResendVerification = async () => {

        setResendingVerification(true);
        setVerificationMessage("");
        setError("");

        try {

            const response = await fetch(
                "https://sigma-classes-backend-ajkh.onrender.com/api/students/resend-verification",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify({
                        email: formData.email,
                    }),
                }
            );


            const data = await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Unable to resend verification email."
                );

            }


            setVerificationMessage(
                data.message ||
                "Verification email sent successfully."
            );


        } catch (error) {

            setVerificationMessage(
                error.message ||
                "Unable to resend verification email."
            );

        } finally {

            setResendingVerification(false);

        }

    };


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
                    BACK TO WEBSITE
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

                    {/* =================================================
                        LEFT SIDE
                    ================================================= */}

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
                            Your preparation.
                            <br />
                            <span>Your progress.</span>
                        </h1>


                        <p>
                            Access your enrolled courses, study materials,
                            test results and free learning resources from
                            your Sigma Classes student dashboard.
                        </p>


                        <div className="student-login-highlights">

                            <div>
                                <span>01</span>

                                <p>
                                    Access your enrolled courses
                                </p>
                            </div>


                            <div>
                                <span>02</span>

                                <p>
                                    View study materials and results
                                </p>
                            </div>


                            <div>
                                <span>03</span>

                                <p>
                                    Stay connected with Sigma Classes
                                </p>
                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        LOGIN CARD
                    ================================================= */}

                    <div className="student-login-card">

                        <div className="student-login-card-header">

                            <div className="student-login-icon">
                                <LockKeyhole size={21} />
                            </div>


                            <div>

                                <span className="section-label">
                                    WELCOME BACK
                                </span>

                                <h2>
                                    Student Login
                                </h2>

                                <p>
                                    Sign in to access your dashboard.
                                </p>

                            </div>

                        </div>


                        {/* =================================================
                            ERROR
                        ================================================= */}

                        {error && (

                            <div
                                className="student-login-error"
                                role="alert"
                            >

                                {error}


                                {error.includes(
                                    "verify your email"
                                ) && (

                                    <button
                                        type="button"
                                        className="student-login-resend"
                                        onClick={
                                            handleResendVerification
                                        }
                                        disabled={
                                            resendingVerification ||
                                            !formData.email
                                        }
                                    >

                                        {resendingVerification
                                            ? "Sending..."
                                            : "Resend Verification Email"}

                                    </button>

                                )}

                            </div>

                        )}


                        {verificationMessage && (

                            <div
                                className="student-login-verification-message"
                                role="status"
                            >
                                {verificationMessage}
                            </div>

                        )}


                        {/* =================================================
                            EMAIL / PASSWORD FORM
                        ================================================= */}

                        <form
                            className="student-login-form"
                            onSubmit={handleSubmit}
                        >

                            {/* EMAIL */}

                            <div className="student-login-field">

                                <label htmlFor="student-email">
                                    Email Address
                                </label>


                                <div className="student-login-input-wrapper">

                                    <Mail
                                        size={18}
                                        className="student-login-input-icon"
                                    />


                                    <input
                                        id="student-email"
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


                            {/* PASSWORD */}

                            <div className="student-login-field">

                                <div className="student-login-label-row">

                                    <label htmlFor="student-password">
                                        Password
                                    </label>


                                    <button
                                        type="button"
                                        className="student-login-forgot"
                                        onClick={() =>
                                            navigate(
                                                "/student/forgot-password"
                                            )
                                        }
                                    >
                                        Forgot Password?
                                    </button>

                                </div>


                                <div className="student-login-input-wrapper">

                                    <LockKeyhole
                                        size={18}
                                        className="student-login-input-icon"
                                    />


                                    <input
                                        id="student-password"
                                        name="password"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        autoComplete="current-password"
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


                            {/* SIGN IN */}

                            <button
                                type="submit"
                                className="student-login-submit"
                                disabled={
                                    loading ||
                                    googleLoading
                                }
                            >

                                {loading ? (
                                    <>
                                        <span className="student-login-spinner" />
                                        Signing In...
                                    </>
                                ) : (
                                    "Sign In"
                                )}

                            </button>

                        </form>


                        {/* =================================================
                            GOOGLE LOGIN DIVIDER
                        ================================================= */}

                        <div className="student-login-divider">
                            <span>OR</span>
                        </div>


                        {/* =================================================
                            GOOGLE LOGIN
                        ================================================= */}

                        <div
                            className="student-login-google-wrapper"
                            style={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "center",
                                minHeight: "44px",
                            }}
                        >

                            <div
                                ref={googleButtonRef}
                                style={{
                                    minHeight: "44px",
                                }}
                            />

                        </div>


                        {googleLoading && (

                            <p
                                style={{
                                    textAlign: "center",
                                    marginTop: "10px",
                                    fontSize: "13px",
                                    opacity: 0.7,
                                }}
                            >
                                Signing in with Google...
                            </p>

                        )}


                        {/* =================================================
                            REGISTER
                        ================================================= */}

                        <div className="student-login-divider">
                            <span>New to Sigma Classes?</span>
                        </div>


                        <button
                            type="button"
                            className="student-login-register"
                            onClick={() =>
                                navigate(
                                    "/student/register",
                                    {
                                        state: {
                                            from:
                                                location.state?.from,
                                        },
                                    }
                                )
                            }
                        >

                            <UserPlus size={17} />

                            Create Student Account

                        </button>


                        <p className="student-login-footer">
                            By signing in, you agree to use the Sigma Classes
                            student portal responsibly.
                        </p>

                    </div>

                </div>

            </div>

        </main>

    );

}


export default StudentLogin;