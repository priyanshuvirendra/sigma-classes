import { useState } from "react";
import {
    Eye,
    EyeOff,
    LockKeyhole,
    LogIn,
} from "lucide-react";

import { useNavigate } from "react-router-dom";


function AdminLogin() {

    const navigate = useNavigate();

    const [identifier, setIdentifier] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    // =====================================================
    // LOGIN
    // =====================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setLoading(true);
        setError("");


        try {

            const response = await fetch(
                "http://localhost:8080/api/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify({
                        identifier,
                        password,
                    }),
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Invalid username/email or password"
                );

            }


            // =================================================
            // STORE COMMON AUTH DATA
            // =================================================

            localStorage.setItem(
                "authToken",
                data.token
            );

            localStorage.setItem(
                "authRole",
                data.role
            );

            localStorage.setItem(
                "authIdentifier",
                data.identifier
            );


            // =================================================
            // STORE ROLE-SPECIFIC DATA
            // =================================================

            if (data.username) {

                localStorage.setItem(
                    "username",
                    data.username
                );

            }


            if (data.name) {

                localStorage.setItem(
                    "userName",
                    data.name
                );

            }


            if (data.email) {

                localStorage.setItem(
                    "userEmail",
                    data.email
                );

            }


            // =================================================
            // REDIRECT BASED ON ROLE
            // =================================================

            if (data.role === "ADMIN") {

                // Keep compatibility with existing AdminAuth
                localStorage.setItem(
                    "adminToken",
                    data.token
                );

                localStorage.setItem(
                    "adminUsername",
                    data.username
                );

                navigate("/admin");

                return;
            }


            if (data.role === "FACULTY") {

                localStorage.setItem(
                    "facultyToken",
                    data.token
                );

                localStorage.setItem(
                    "facultyUsername",
                    data.username
                );

                localStorage.setItem(
                    "facultyName",
                    data.name
                );

                navigate("/faculty/dashboard");
                
                return;
            }


            if (data.role === "STUDENT") {

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

                navigate("/student/dashboard");

                return;
            }


            throw new Error(
                "Unknown user role."
            );


        } catch (error) {

            console.error(
                "Login error:",
                error
            );

            setError(
                error.message ||
                "Unable to login. Please try again."
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <main className="admin-login-page">

            <div className="admin-login-card">


                {/* =================================================
            ICON
        ================================================= */}

                <div className="admin-login-icon">

                    <LockKeyhole size={24} />

                </div>


                {/* =================================================
            LABEL
        ================================================= */}

                <span className="section-label">
                    SIGMA CLASSES
                </span>


                <h1>
                    Welcome back.
                </h1>


                <p className="admin-login-subtitle">
                    Sign in to access your account.
                </p>


                {/* =================================================
            FORM
        ================================================= */}

                <form
                    className="admin-login-form"
                    onSubmit={handleSubmit}
                >


                    {/* =================================================
              IDENTIFIER
          ================================================= */}

                    <div className="form-group">

                        <label htmlFor="login-identifier">
                            Username / Email
                        </label>


                        <input
                            id="login-identifier"
                            type="text"
                            placeholder="Enter username or email"
                            value={identifier}
                            onChange={(event) => {

                                setIdentifier(
                                    event.target.value
                                );

                                setError("");

                            }}
                            autoComplete="username"
                            required
                        />

                    </div>


                    {/* =================================================
              PASSWORD
          ================================================= */}

                    <div className="form-group">

                        <label htmlFor="login-password">
                            Password
                        </label>


                        <div className="password-input">

                            <input
                                id="login-password"
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Enter password"
                                value={password}
                                onChange={(event) => {

                                    setPassword(
                                        event.target.value
                                    );

                                    setError("");

                                }}
                                autoComplete="current-password"
                                required
                            />


                            <button
                                type="button"
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


                    {/* =================================================
              ERROR
          ================================================= */}

                    {error && (

                        <div className="admin-login-error">

                            {error}

                        </div>

                    )}


                    {/* =================================================
              LOGIN BUTTON
          ================================================= */}

                    <button
                        type="submit"
                        className="btn btn-primary admin-login-submit"
                        disabled={loading}
                    >

                        {loading ? (

                            "Signing in..."

                        ) : (

                            <>
                                Sign In
                                <LogIn size={17} />
                            </>

                        )}

                    </button>

                </form>


                <p className="admin-login-footer">
                    Authorized users only.
                </p>

            </div>

        </main>

    );

}


export default AdminLogin;