import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    BookOpen,
    CheckCircle2,
    BarChart3,
    Award,
    X,
    Bell,
    Globe2,
    CheckCheck,
    Menu,
    LogOut,
    // your other existing icons...
} from "lucide-react";

function StudentDashboard() {

    const navigate = useNavigate();


    // =====================================================
    // STATE
    // =====================================================

    const [profile, setProfile] = useState(null);

    const [enrollments, setEnrollments] = useState([]);

    const [results, setResults] = useState([]);
    const [showHeaderMenu, setShowHeaderMenu] = useState(false);

    const [youtubeContents, setYoutubeContents] = useState([]);
    const [youtubeLoading, setYoutubeLoading] = useState(false);
    const [youtubeError, setYoutubeError] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedYoutubeContent, setSelectedYoutubeContent] = useState(null);

    const [error, setError] = useState("");

    const [editingProfile, setEditingProfile] = useState(false);

    const [profileForm, setProfileForm] = useState({
        name: "",
        phone: "",
    });

    const [profileUpdateLoading, setProfileUpdateLoading] = useState(false);
    const [profileUpdateError, setProfileUpdateError] = useState("");
    const [profileUpdateSuccess, setProfileUpdateSuccess] = useState("");
    const [changingPassword, setChangingPassword] = useState(false);

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [passwordSuccess, setPasswordSuccess] = useState("");

    const [notifications, setNotifications] = useState([]);
const [showNotifications, setShowNotifications] = useState(false);
const [notificationLoading, setNotificationLoading] = useState(false);

const loadNotifications = async () => {
  const token = localStorage.getItem("studentToken");

  if (!token) return;

  setNotificationLoading(true);

  try {
    const response = await fetch(
      "https://sigma-classes-backend-ajkh.onrender.com/api/student/notifications",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Unable to load notifications");
    }

    const data = await response.json();

    setNotifications(data);
  } catch (error) {
    console.error("Notification loading error:", error);
  } finally {
    setNotificationLoading(false);
  }
};

    // =====================================================
    // FETCH DASHBOARD DATA
    // =====================================================

    useEffect(() => {

        const token =
            localStorage.getItem("studentToken");


        // =================================================
        // CHECK LOGIN
        // =================================================

        if (!token) {

            navigate("/student/login");

            return;
        }


        const fetchDashboard = async () => {

            try {

                const headers = {
                    Authorization:
                        `Bearer ${token}`,
                };


                // =================================================
                // GET STUDENT PROFILE
                // =================================================

                const profileResponse =
                    await fetch(
                        "https://sigma-classes-backend-ajkh.onrender.com/api/student/profile",
                        {
                            method: "GET",
                            headers,
                        }
                    );


                if (!profileResponse.ok) {

                    if (
                        profileResponse.status === 401 ||
                        profileResponse.status === 403
                    ) {

                        localStorage.removeItem(
                            "studentToken"
                        );

                        localStorage.removeItem(
                            "studentEmail"
                        );

                        localStorage.removeItem(
                            "studentName"
                        );


                        navigate(
                            "/student/login"
                        );

                        return;
                    }


                    throw new Error(
                        "Unable to load student profile"
                    );
                }


                const profileData =
                    await profileResponse.json();


                // =================================================
                // GET ENROLLED COURSES
                // =================================================

                const enrollmentResponse =
                    await fetch(
                        "https://sigma-classes-backend-ajkh.onrender.com/api/student/enrollments",
                        {
                            method: "GET",
                            headers,
                        }
                    );


                if (!enrollmentResponse.ok) {

                    throw new Error(
                        "Unable to load enrolled courses"
                    );
                }


                const enrollmentData =
                    await enrollmentResponse.json();


                // =================================================
                // GET STUDENT RESULTS
                // =================================================

                const resultsResponse =
                    await fetch(
                        "https://sigma-classes-backend-ajkh.onrender.com/api/student/results",
                        {
                            method: "GET",
                            headers,
                        }
                    );


                if (!resultsResponse.ok) {

                    if (
                        resultsResponse.status === 401 ||
                        resultsResponse.status === 403
                    ) {

                        localStorage.removeItem(
                            "studentToken"
                        );

                        localStorage.removeItem(
                            "studentEmail"
                        );

                        localStorage.removeItem(
                            "studentName"
                        );


                        navigate(
                            "/student/login"
                        );

                        return;
                    }


                    throw new Error(
                        "Unable to load student results"
                    );
                }


                const resultsData =
                    await resultsResponse.json();


                // =================================================
                // GET YOUTUBE CONTENT
                // =================================================

                try {
                    setYoutubeLoading(true);

                    const youtubeResponse = await fetch(
                        "https://sigma-classes-backend-ajkh.onrender.com/api/youtube-content"
                    );

                    if (!youtubeResponse.ok) {
                        throw new Error(
                            "Unable to load YouTube content"
                        );
                    }

                    const youtubeData =
                        await youtubeResponse.json();

                    setYoutubeContents(
                        Array.isArray(youtubeData)
                            ? youtubeData
                            : []
                    );

                } catch (youtubeFetchError) {

                    console.error(
                        "YouTube content error:",
                        youtubeFetchError
                    );

                    setYoutubeError(
                        youtubeFetchError.message ||
                        "Unable to load YouTube content."
                    );

                } finally {
                    setYoutubeLoading(false);
                }
                // =================================================
                // SET DATA
                // =================================================

                setProfile(
                    profileData
                );


                setEnrollments(
                    Array.isArray(enrollmentData)
                        ? enrollmentData
                        : []
                );


                setResults(
                    Array.isArray(resultsData)
                        ? resultsData
                        : []
                );

            } catch (error) {

                console.error(
                    "Dashboard error:",
                    error
                );


                setError(
                    error.message ||
                    "Something went wrong"
                );

            } finally {

                setLoading(false);

            }

        };


        fetchDashboard();
        loadNotifications();

    }, [navigate]);



    const markNotificationAsRead = async (id) => {
  const token = localStorage.getItem("studentToken");

  try {
    const response = await fetch(
      `https://sigma-classes-backend-ajkh.onrender.com/api/student/notifications/${id}/read`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Unable to mark notification as read");
    }

    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  } catch (error) {
    console.error("Mark notification error:", error);
  }
};

const markAllNotificationsAsRead = async () => {
  const token = localStorage.getItem("studentToken");

  try {
    const response = await fetch(
      "https://sigma-classes-backend-ajkh.onrender.com/api/student/notifications/read-all",
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Unable to mark notifications as read");
    }

    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  } catch (error) {
    console.error("Mark all notifications error:", error);
  }
};
    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {

        localStorage.removeItem(
            "studentToken"
        );

        localStorage.removeItem(
            "studentEmail"
        );

        localStorage.removeItem(
            "studentName"
        );


        navigate(
            "/student/login"
        );
    };

    // =====================================================
    // EDIT PROFILE
    // =====================================================

    const handleEditProfile = () => {
        setProfileForm({
            name: profile?.name || "",
            phone: profile?.phone || "",
        });

        setProfileUpdateError("");
        setProfileUpdateSuccess("");
        setEditingProfile(true);
    };


    const handleProfileFormChange = (event) => {
        const { name, value } = event.target;

        setProfileForm((current) => ({
            ...current,
            [name]: value,
        }));
    };


    const handleProfileUpdate = async (event) => {
        event.preventDefault();

        const token = localStorage.getItem("studentToken");

        if (!token) {
            navigate("/student/login");
            return;
        }

        if (!profileForm.name.trim()) {
            setProfileUpdateError("Name cannot be empty.");
            return;
        }

        if (!profileForm.phone.trim()) {
            setProfileUpdateError("Phone number cannot be empty.");
            return;
        }

        try {
            setProfileUpdateLoading(true);
            setProfileUpdateError("");
            setProfileUpdateSuccess("");

            const response = await fetch(
                "https://sigma-classes-backend-ajkh.onrender.com/api/students/profile",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        name: profileForm.name.trim(),
                        phone: profileForm.phone.trim(),
                    }),
                }
            );

            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem("studentToken");
                localStorage.removeItem("studentEmail");
                localStorage.removeItem("studentName");

                navigate("/student/login");
                return;
            }

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to update profile."
                );
            }

            setProfile(data);

            localStorage.setItem("studentName", data.name);

            setProfileUpdateSuccess(
                "Profile updated successfully."
            );

            setEditingProfile(false);

        } catch (error) {

            console.error(
                "Profile update error:",
                error
            );

            setProfileUpdateError(
                error.message ||
                "Unable to update profile."
            );

        } finally {

            setProfileUpdateLoading(false);
        }
    };

    // =====================================================
    // CHANGE PASSWORD
    // =====================================================

    const handlePasswordFormChange = (event) => {
        const { name, value } = event.target;

        setPasswordForm((current) => ({
            ...current,
            [name]: value,
        }));
    };
const handleChangePassword = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("studentToken");

    if (!token) {
        navigate("/student/login");
        return;
    }

    setPasswordError("");
    setPasswordSuccess("");

    // Current password is required only when
    // the account already has a password.
    if (
        profile?.hasPassword &&
        !passwordForm.currentPassword
    ) {
        setPasswordError(
            "Please enter your current password."
        );
        return;
    }

    if (!passwordForm.newPassword) {
        setPasswordError(
            "Please enter a new password."
        );
        return;
    }

    if (passwordForm.newPassword.length < 6) {
        setPasswordError(
            "New password must be at least 6 characters."
        );
        return;
    }

    if (
        passwordForm.newPassword !==
        passwordForm.confirmPassword
    ) {
        setPasswordError(
            "New password and confirm password do not match."
        );
        return;
    }

    try {
        setPasswordLoading(true);

        const requestBody = {
            newPassword: passwordForm.newPassword,
        };

        // Only send currentPassword for accounts
        // that already have a password.
        if (profile?.hasPassword) {
            requestBody.currentPassword =
                passwordForm.currentPassword;
        }

        const response = await fetch(
            "https://sigma-classes-backend-ajkh.onrender.com/api/students/change-password",
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(requestBody),
            }
        );

        if (
            response.status === 401 ||
            response.status === 403
        ) {
            localStorage.removeItem("studentToken");
            localStorage.removeItem("studentEmail");
            localStorage.removeItem("studentName");

            navigate("/student/login");
            return;
        }

        const data =
            await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(
                data.message ||
                "Failed to change password."
            );
        }

        setPasswordSuccess(
            data.message ||
            (
                profile?.hasPassword
                    ? "Password changed successfully."
                    : "Password set successfully."
            )
        );

        // Account now definitely has a password.
        setProfile((current) =>
            current
                ? {
                    ...current,
                    hasPassword: true,
                }
                : current
        );

        setPasswordForm({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        });

        setChangingPassword(false);

    } catch (error) {

        console.error(
            "Change password error:",
            error
        );

        setPasswordError(
            error.message ||
            "Unable to change password."
        );

    } finally {
        setPasswordLoading(false);
    }
};
    // =====================================================
    // RESULT PERFORMANCE SUMMARY
    // =====================================================

    const resultPercentages = results
        .map((result) => Number(result.percentage))
        .filter((percentage) => Number.isFinite(percentage));

    const averagePercentage =
        resultPercentages.length > 0
            ? (
                resultPercentages.reduce(
                    (total, percentage) => total + percentage,
                    0
                ) / resultPercentages.length
            ).toFixed(2)
            : "—";

    const bestPercentage =
        resultPercentages.length > 0
            ? Math.max(...resultPercentages).toFixed(2)
            : "—";



    const getYoutubeEmbedUrl = (content) => {
        if (!content?.youtubeId) {
            return "";
        }

        if (content.type === "PLAYLIST") {
            return `https://www.youtube.com/embed/videoseries?list=${content.youtubeId}`;
        }

        return `https://www.youtube.com/embed/${content.youtubeId}`;
    };
    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="student-dashboard">

                <p>
                    Loading dashboard...
                </p>

            </div>

        );
    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        return (

            <div className="student-dashboard">

                <p>
                    {error}
                </p>


                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/student/login"
                        )
                    }
                >
                    Back to Login
                </button>

            </div>

        );
    }


    // =====================================================
    // DASHBOARD
    // =====================================================

    return (

        <div className="student-dashboard">


            {/* =================================================
                HEADER
            ================================================= */}

<header className="student-dashboard-header">

  <div className="student-header-left">

    <div className="student-avatar-wrap">
      <div className="student-avatar">
        {profile?.name
          ? profile.name
              .trim()
              .split(/\s+/)
              .slice(0, 2)
              .map((namePart) => namePart.charAt(0))
              .join("")
              .toUpperCase()
          : "S"}
      </div>

      <span className="student-avatar-status"></span>
    </div>

    <div className="student-header-content">

      <span className="student-header-label">
        STUDENT PORTAL
      </span>

      <h1>
        Welcome, {profile?.name}
      </h1>

      <p>
        Welcome to your Sigma Classes dashboard.
      </p>

    </div>

  </div>


  {/* HEADER ACTIONS */}
  {/* =================================================
    HEADER ACTIONS
================================================= */}

<div className="student-header-actions">

  {/* MOBILE MENU BUTTON */}
  <button
    type="button"
    className="student-mobile-menu-btn"
    onClick={() =>
      setShowHeaderMenu((current) => !current)
    }
    aria-label="Open dashboard menu"
    aria-expanded={showHeaderMenu}
  >
    {showHeaderMenu ? (
      <X size={20} />
    ) : (
      <Menu size={20} />
    )}
  </button>


  {/* DESKTOP / TABLET ACTIONS */}

  <div
    className={`student-header-menu ${
      showHeaderMenu ? "open" : ""
    }`}
  >

    <button
      type="button"
      className="dashboard-public-btn"
      onClick={() => {
        setShowHeaderMenu(false);
        navigate("/");
      }}
    >
      <Globe2 size={16} />
      Back to Home
    </button>


<button
  type="button"
  className="student-logout-btn"
  onClick={() => {
    setShowHeaderMenu(false);
    handleLogout();
  }}
>
  <LogOut size={16} />
  Logout
</button>

    <div className="student-notification-wrapper">

      <button
        type="button"
        className="student-notification-button"
        onClick={() => {
          setShowNotifications((current) => !current);

          if (!showNotifications) {
            loadNotifications();
          }
        }}
        aria-label="Notifications"
      >
        <Bell size={20} />

        {notifications.filter(
          (notification) => !notification.read
        ).length > 0 && (
          <span className="student-notification-badge">
            {notifications.filter(
              (notification) => !notification.read
            ).length}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="student-notification-panel">

          <div className="student-notification-header">

            <div>
              <strong>Notifications</strong>

              <span>
                {
                  notifications.filter(
                    (notification) => !notification.read
                  ).length
                } unread
              </span>
            </div>

            <div className="student-notification-actions">

              {notifications.some(
                (notification) => !notification.read
              ) && (
                <button
                  type="button"
                  onClick={markAllNotificationsAsRead}
                  title="Mark all as read"
                >
                  <CheckCheck size={17} />
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowNotifications(false)}
                title="Close"
              >
                <X size={17} />
              </button>

            </div>

          </div>


          <div className="student-notification-list">

            {notificationLoading ? (

              <div className="student-notification-empty">
                Loading notifications...
              </div>

            ) : notifications.length === 0 ? (

              <div className="student-notification-empty">
                <Bell size={28} />
                <strong>No notifications</strong>
                <span>
                  You're all caught up.
                </span>
              </div>

            ) : (

              notifications.map((notification) => (

                <button
                  type="button"
                  key={notification.id}
                  className={`student-notification-item ${
                    notification.read ? "" : "unread"
                  }`}
                  onClick={() => {
                    if (!notification.read) {
                      markNotificationAsRead(
                        notification.id
                      );
                    }
                  }}
                >

                  <div className="student-notification-item-icon">
                    <Bell size={16} />
                  </div>

                  <div className="student-notification-item-content">

                    <strong>
                      {notification.title}
                    </strong>

                    <p>
                      {notification.message}
                    </p>

                    <span>
                      {new Date(
                        notification.createdAt
                      ).toLocaleString()}
                    </span>

                  </div>

                  {!notification.read && (
                    <span className="student-notification-unread-dot" />
                  )}

                </button>

              ))

            )}

          </div>

        </div>
      )}

    </div>

  </div>

</div>

</header>
            {/* =================================================
    DASHBOARD SUMMARY
================================================= */}

            <div className="student-summary-grid">
                <div
                    className="student-summary-card"
                    onClick={() =>
                        document
                            .getElementById("student-courses")
                            ?.scrollIntoView({
                                behavior: "smooth",
                                block: "start",
                            })
                    }
                >

                    <div className="student-summary-icon">
                        <BookOpen size={20} />
                    </div>

                    <div>
                        <span>My Courses</span>

                        <strong>
                            {enrollments.length}
                        </strong>
                    </div>

                </div>

                <div
                    className="student-summary-card"
                    onClick={() =>
                        document
                            .getElementById("student-courses")
                            ?.scrollIntoView({
                                behavior: "smooth",
                                block: "start",
                            })
                    }
                >

                    <div className="student-summary-icon">
                        <CheckCircle2 size={20} />
                    </div>

                    <div>
                        <span>Active Courses</span>

                        <strong>
                            {
                                enrollments.filter(
                                    (enrollment) =>
                                        enrollment.status === "ACTIVE"
                                ).length
                            }
                        </strong>
                    </div>

                </div>

                <div
                    className="student-summary-card"
                    onClick={() =>
                        document
                            .getElementById("student-results")
                            ?.scrollIntoView({
                                behavior: "smooth",
                                block: "start",
                            })
                    }
                >

                    <div className="student-summary-icon">
                        <Award size={20} />
                    </div>

                    <div>
                        <span>Results</span>

                        <strong>
                            {results.length}
                        </strong>
                    </div>

                </div>

            </div>


            {/* =================================================
                PROFILE
            ================================================= */}
            <section className="student-profile">

                <div className="section-header">

                    <div>
                        <span className="section-label">
                            ACCOUNT
                        </span>

                        <h2>
                            My Profile
                        </h2>
                    </div>

                    {!editingProfile && (
                        <button
                            type="button"
                            className="student-profile-edit-btn"
                            onClick={handleEditProfile}
                        >
                            Edit Profile
                        </button>
                    )}

                </div>


                {editingProfile ? (

                    <form
                        className="student-profile-form"
                        onSubmit={handleProfileUpdate}
                    >

                        <div className="student-profile-form-grid">

                            <div className="student-profile-field">

                                <label htmlFor="profile-name">
                                    Name
                                </label>

                                <input
                                    id="profile-name"
                                    type="text"
                                    name="name"
                                    value={profileForm.name}
                                    onChange={handleProfileFormChange}
                                    placeholder="Enter your name"
                                />

                            </div>


                            <div className="student-profile-field">

                                <label htmlFor="profile-email">
                                    Email
                                </label>

                                <input
                                    id="profile-email"
                                    type="email"
                                    value={profile?.email || ""}
                                    disabled
                                />

                                <small>
                                    Email cannot be changed.
                                </small>

                            </div>


                            <div className="student-profile-field">

                                <label htmlFor="profile-phone">
                                    Phone
                                </label>

                                <input
                                    id="profile-phone"
                                    type="tel"
                                    name="phone"
                                    value={profileForm.phone}
                                    onChange={handleProfileFormChange}
                                    placeholder="Enter your phone number"
                                />

                            </div>

                        </div>


                        {profileUpdateError && (
                            <div className="admin-error">
                                {profileUpdateError}
                            </div>
                        )}


                        <div className="student-profile-form-actions">

                            <button
                                type="button"
                                className="student-profile-cancel-btn"
                                onClick={() => {
                                    setEditingProfile(false);
                                    setProfileUpdateError("");
                                    setProfileUpdateSuccess("");
                                }}
                                disabled={profileUpdateLoading}
                            >
                                Cancel
                            </button>


                            <button
                                type="submit"
                                className="student-profile-save-btn"
                                disabled={profileUpdateLoading}
                            >
                                {profileUpdateLoading
                                    ? "Saving..."
                                    : "Save Changes"}
                            </button>

                        </div>

                    </form>

                ) : (

                    <div className="profile-details">

                        <p>
                            <strong>Name:</strong>{" "}
                            {profile?.name}
                        </p>

                        <p>
                            <strong>Email:</strong>{" "}
                            {profile?.email}
                        </p>

                        <p>
                            <strong>Phone:</strong>{" "}
                            {profile?.phone}
                        </p>

                    </div>

                )}


                {profileUpdateSuccess && !editingProfile && (
                    <div className="profile-update-success">
                        ✓ {profileUpdateSuccess}
                    </div>
                )}
                <div className="student-password-section">

                    <div className="student-password-header">

                        <div>
                            <h3>Account Security</h3>

                           <p>
    {profile?.hasPassword
        ? "Change your password to keep your account secure."
        : "Set a password so you can also sign in with your email and password."
    }
</p>
                        </div>

                        {!changingPassword && (
                            <button
                                type="button"
                                className="student-password-btn"
                                onClick={() => {
                                    setPasswordError("");
                                    setPasswordSuccess("");
                                    setChangingPassword(true);
                                }}
                            >
                              {profile?.hasPassword
    ? "Change Password"
    : "Set Password"
}
                            </button>
                        )}

                    </div>


                    {changingPassword && (

                        <form
                            className="student-password-form"
                            onSubmit={handleChangePassword}
                        >
{profile?.hasPassword && (
    <div className="student-password-field">

        <label htmlFor="current-password">
            Current Password
        </label>

        <input
            id="current-password"
            type="password"
            name="currentPassword"
            value={passwordForm.currentPassword}
            onChange={handlePasswordFormChange}
            placeholder="Enter current password"
            autoComplete="current-password"
        />

    </div>
)}


                            <div className="student-password-field">

                                <label htmlFor="new-password">
                                    New Password
                                </label>

                                <input
                                    id="new-password"
                                    type="password"
                                    name="newPassword"
                                    value={passwordForm.newPassword}
                                    onChange={handlePasswordFormChange}
                                    placeholder="Enter new password"
                                    autoComplete="new-password"
                                />

                            </div>


                            <div className="student-password-field">

                                <label htmlFor="confirm-password">
                                    Confirm New Password
                                </label>

                                <input
                                    id="confirm-password"
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordForm.confirmPassword}
                                    onChange={handlePasswordFormChange}
                                    placeholder="Confirm new password"
                                    autoComplete="new-password"
                                />

                            </div>


                            {passwordError && (
                                <div className="admin-error">
                                    {passwordError}
                                </div>
                            )}


                            <div className="student-password-actions">

                                <button
                                    type="button"
                                    className="student-profile-cancel-btn"
                                    onClick={() => {
                                        setChangingPassword(false);

                                        setPasswordForm({
                                            currentPassword: "",
                                            newPassword: "",
                                            confirmPassword: "",
                                        });

                                        setPasswordError("");
                                    }}
                                    disabled={passwordLoading}
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="student-profile-save-btn"
                                    disabled={passwordLoading}
                                >
{passwordLoading
    ? (
        profile?.hasPassword
            ? "Changing..."
            : "Setting..."
      )
    : (
        profile?.hasPassword
            ? "Change Password"
            : "Set Password"
      )
}
                                </button>

                            </div>

                        </form>
                    )}


                    {passwordSuccess && !changingPassword && (
                        <div className="profile-update-success">
                            ✓ {passwordSuccess}
                        </div>
                    )}

                </div>


            </section>
            {/* =================================================
                MY COURSES
            ================================================= */}
            <section
                className="student-courses"
                id="student-courses"
            >

                <div className="section-header">

                    <h2>
                        My Courses
                    </h2>


                    {/* =========================================
                        BROWSE COURSES
                    ========================================= */}

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/courses"
                            )
                        }
                    >
                        Browse Courses
                    </button>

                </div>


                {/* =================================================
                    NO ENROLLMENTS
                ================================================= */}

                {enrollments.length === 0 ? (

                    <div className="student-empty-courses">

                        <div className="student-empty-courses-icon">
                            <BookOpen size={28} />
                        </div>

                        <h3>No Courses Yet</h3>

                        <p>
                            You haven't enrolled in any course yet.
                            Explore our courses and submit an enrollment request
                            to get started.
                        </p>

                        <button
                            type="button"
                            className="student-course-btn"
                            onClick={() => navigate("/#courses")}
                        >
                            Explore Courses
                        </button>

                    </div>

                ) : (


                    /* =================================================
                       ENROLLED COURSES
                    ================================================= */

                    <div className="course-grid">

                        {enrollments.map(
                            (enrollment) => (

                                <div
                                    className="course-card"
                                    key={enrollment.id}
                                >

                                    <div className="student-course-card-header">

                                        <div>
                                            <span className="student-course-category">
                                                {enrollment.course.category}
                                            </span>

                                            <h3>
                                                {enrollment.course.name}
                                            </h3>
                                        </div>

                                        <span
                                            className={`student-enrollment-status status-${(
                                                enrollment.status || ""
                                            ).toLowerCase()}`}
                                        >
                                            {enrollment.status}
                                        </span>

                                    </div>


                                    <p className="student-course-description">
                                        {enrollment.course.description}
                                    </p>


                                    <div className="student-course-info-grid">

                                        <div className="student-course-info-item">
                                            <span>Mode</span>

                                            <strong>
                                                {enrollment.course.mode || "Offline Classroom"}
                                            </strong>
                                        </div>


                                        <div className="student-course-info-item">
                                            <span>Duration</span>

                                            <strong>
                                                {enrollment.course.duration || "—"}
                                            </strong>
                                        </div>
<div className="student-course-info-item">
    <span>Class Timing</span>

    <strong>
        {enrollment.course.timing || "—"}
    </strong>
</div>

                                        <div className="student-course-info-item">
                                            <span>Start Date</span>

                                            <strong>
                                                {enrollment.course.startDate || "—"}
                                            </strong>
                                        </div>


                                        <div className="student-course-info-item">
                                            <span>Enrolled On</span>

                                            <strong>
                                                {enrollment.enrolledAt
                                                    ? new Date(
                                                        enrollment.enrolledAt
                                                    ).toLocaleDateString("en-IN", {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric",
                                                    })
                                                    : "—"}
                                            </strong>
                                        </div>

                                    </div>


                                    {/* =================================
        COURSE ACTION
    ================================= */}

                                    <div className="student-course-action">

                                        {enrollment.status === "ACTIVE" ? (

                                            <button
                                                type="button"
                                                className="student-course-btn"
                                                onClick={() =>
                                                    navigate(
                                                        `/courses/${enrollment.course.id}`
                                                    )
                                                }
                                            >
                                                View Course Resources
                                            </button>

                                        ) : enrollment.status === "PENDING" ? (

                                            <div className="student-course-pending">
                                                <span>⏳ Enrollment Pending</span>

                                                <small>
                                                    Waiting for admin approval
                                                </small>
                                            </div>

                                        ) : enrollment.status === "COMPLETED" ? (

                                            <div className="student-course-completed">
                                                <span>✓ Course Completed</span>
                                            </div>

                                        ) : enrollment.status === "CANCELLED" ? (

                                            <div className="student-course-cancelled">
                                                <span>✕ Enrollment Cancelled</span>
                                            </div>

                                        ) : (

                                            <div className="student-course-inactive">
                                                <span>Enrollment Inactive</span>
                                            </div>

                                        )}

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}

            </section>




            {/* =================================================
    FREE LEARNING
================================================= */}

            <section className="student-youtube-section">

                <div className="section-header">

                    <div>
                        <span className="section-label">
                            FREE LEARNING
                        </span>

                        <h2>
                            Learn from Sigma Classes
                        </h2>

                        <p>
                            Watch free classes and educational content
                            from our official YouTube channel.
                        </p>
                    </div>

                    <a
                        href="https://www.youtube.com/@SigmaClasses87"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="student-youtube-channel-btn"
                    >
                        Visit YouTube Channel
                    </a>

                </div>


                {youtubeLoading ? (

                    <div className="student-youtube-empty">
                        <p>
                            Loading free learning content...
                        </p>
                    </div>

                ) : youtubeError ? (

                    <div className="student-youtube-empty">
                        <p>
                            {youtubeError}
                        </p>
                    </div>

                ) : youtubeContents.length === 0 ? (

                    <div className="student-youtube-empty">
                        <h3>
                            Free Learning Content Coming Soon
                        </h3>

                        <p>
                            New videos and playlists will appear here
                            when they are published by Sigma Classes.
                        </p>
                    </div>

                ) : (

                    <div className="student-youtube-grid">

                        {youtubeContents.map((content) => (

                            <article
                                className="student-youtube-card"
                                key={content.id}
                            >

                                <button
                                    type="button"
                                    className="student-youtube-thumbnail"
                                    onClick={() => setSelectedYoutubeContent(content)}
                                >

                                    {content.thumbnailUrl ? (
                                        <img
                                            src={content.thumbnailUrl}
                                            alt={content.title}
                                        />
                                    ) : (
                                        <div className="student-youtube-thumbnail-placeholder">
                                            {content.type === "PLAYLIST"
                                                ? "PLAYLIST"
                                                : content.type === "SHORTS"
                                                    ? "SHORTS"
                                                    : "VIDEO"}
                                        </div>
                                    )}

                                </button>


                                <div className="student-youtube-card-content">

                                    <span className="student-youtube-type">
                                        {content.type === "PLAYLIST"
                                            ? "Playlist"
                                            : content.type === "SHORTS"
                                                ? "Shorts"
                                                : "Video"}
                                    </span>

                                    <h3>
                                        {content.title}
                                    </h3>

                                    {content.category && (
                                        <span className="student-youtube-category">
                                            {content.category}
                                        </span>
                                    )}

                                    {content.description && (
                                        <p>
                                            {content.description}
                                        </p>
                                    )}

                                    <button
                                        type="button"
                                        className="student-youtube-watch-btn"
                                        onClick={() => setSelectedYoutubeContent(content)}
                                    >
                                        {content.type === "PLAYLIST"
    ? "View Playlist"
    : content.type === "SHORTS"
        ? "Watch Short"
        : "Watch Video"}
                                    </button>

                                </div>

                            </article>

                        ))}

                    </div>

                )}

            </section>
            {/* =================================================
                MY RESULTS
            ================================================= */}
            <section
                className="student-results"
                id="student-results"
            >

                <div className="section-header">

                    <div>

                        <span className="section-label">
                            PERFORMANCE
                        </span>


                        <h2>
                            My Results
                        </h2>

                    </div>

                </div>

                {/* =================================================
    PERFORMANCE OVERVIEW
================================================= */}

                <div className="student-results-overview">

                    <div className="student-result-summary-card">

                        <div className="student-result-summary-icon">
                            <BookOpen size={19} />
                        </div>

                        <div>
                            <span>Tests Taken</span>

                            <strong>
                                {results.length}
                            </strong>
                        </div>

                    </div>


                    <div className="student-result-summary-card">

                        <div className="student-result-summary-icon">
                            <BarChart3 size={19} />
                        </div>

                        <div>
                            <span>Average Score</span>

                            <strong>
                                {averagePercentage}
                                {averagePercentage !== "—" && "%"}
                            </strong>
                        </div>

                    </div>


                    <div className="student-result-summary-card">

                        <div className="student-result-summary-icon">
                            <Award size={19} />
                        </div>

                        <div>
                            <span>Best Score</span>

                            <strong>
                                {bestPercentage}
                                {bestPercentage !== "—" && "%"}
                            </strong>
                        </div>

                    </div>

                </div>


                {/* =================================================
                    NO RESULTS
                ================================================= */}

                {results.length === 0 ? (

                    <div className="empty-results">

                        <p>
                            You don't have any results yet.
                        </p>

                    </div>


                ) : (


                    /* =================================================
                       RESULTS
                    ================================================= */

                    <div className="student-results-grid">

                        {results.map(
                            (result) => (

                                <article
                                    className="student-result-card"
                                    key={result.id}
                                >


                                    {/* =================================
                                        RESULT HEADER
                                    ================================= */}

                                    <div className="student-result-header">

                                        <div className="student-result-title">

                                            <span className="result-category">

                                                {result.course?.category ||
                                                    "RESULT"}

                                            </span>


                                            <h3>
                                                {result.examName}
                                            </h3>


                                            <p className="result-course">

                                                {result.course?.name}

                                            </p>

                                        </div>


                                        {/* =================================
                                            RANK
                                        ================================= */}

                                        {result.rank !== null &&
                                            result.rank !== undefined && (

                                                <div className="result-rank">

                                                    <span>
                                                        Rank
                                                    </span>


                                                    <strong>
                                                        #{result.rank}
                                                    </strong>

                                                </div>

                                            )}

                                    </div>


                                    {/* =================================
                                        RESULT METRICS
                                    ================================= */}

                                    <div className="student-result-metrics">


                                        {/* MARKS */}

                                        <div className="result-metric">

                                            <span>
                                                Marks
                                            </span>


                                            <strong>

                                                {result.marksObtained}

                                                <small>
                                                    {" / "}
                                                    {result.totalMarks}
                                                </small>

                                            </strong>

                                        </div>


                                        {/* PERCENTAGE */}

                                        <div className="result-metric">

                                            <span>
                                                Percentage
                                            </span>


                                            <strong>

                                                {result.percentage !== null &&
                                                    result.percentage !== undefined
                                                    ? `${Number(
                                                        result.percentage
                                                    ).toFixed(2)}%`
                                                    : "—"}

                                            </strong>

                                        </div>

                                    </div>


                                    {/* =================================
                                        EXAM DATE
                                    ================================= */}

                                    {result.examDate && (

                                        <div className="result-date">

                                            <span>
                                                Exam Date
                                            </span>


                                            <strong>
                                                {result.examDate}
                                            </strong>

                                        </div>

                                    )}


                                    {/* =================================
                                        REMARKS
                                    ================================= */}

                                    {result.remarks && (

                                        <div className="result-remarks">

                                            <span>
                                                Remarks
                                            </span>


                                            <p>
                                                {result.remarks}
                                            </p>

                                        </div>

                                    )}

                                </article>

                            )
                        )}

                    </div>

                )}

            </section>
            {selectedYoutubeContent && (
                <div
                    className="youtube-video-modal"
                    onClick={() => setSelectedYoutubeContent(null)}
                >

                    <div
                        className="youtube-video-modal-content"
                        onClick={(event) => event.stopPropagation()}
                    >

                        <div className="youtube-video-modal-header">

                            <div>
                                <span className="section-label">
                                    {selectedYoutubeContent.type === "PLAYLIST"
                                        ? "PLAYLIST"
                                        : "FREE CLASS"}
                                </span>

                                <h2>
                                    {selectedYoutubeContent.title}
                                </h2>
                            </div>

                            <button
                                type="button"
                                className="youtube-video-modal-close"
                                onClick={() =>
                                    setSelectedYoutubeContent(null)
                                }
                                aria-label="Close video"
                            >
                                <X size={22} />
                            </button>

                        </div>


                        <div className="youtube-video-player">

                            <iframe
                                src={getYoutubeEmbedUrl(
                                    selectedYoutubeContent
                                )}
                                title={selectedYoutubeContent.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            />

                        </div>

                    </div>

                </div>
            )}

        </div>

    );

}


export default StudentDashboard;