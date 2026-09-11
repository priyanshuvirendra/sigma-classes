import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  RefreshCw,
  User,
  Mail,
  Phone,
  BookOpen,
  Edit3,
  Save,
  X,
  ShieldCheck,
  AtSign,
  CheckCircle2,
} from "lucide-react";

import FacultySidebar from "../components/FacultySidebar";


function FacultyProfile() {

  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editing, setEditing] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  // =====================================================
  // TOKEN
  // =====================================================

  const getToken = () =>
    localStorage.getItem("facultyToken") ||
    localStorage.getItem("authToken");


  // =====================================================
  // FETCH PROFILE
  // =====================================================

  const fetchProfile = async () => {

    try {

      setLoading(true);
      setError("");
      setSuccess("");

      const token = getToken();

      if (!token) {
        navigate("/faculty");
        return;
      }


      const response = await fetch(
        "http://localhost:8080/api/faculty/profile",
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );


      if (!response.ok) {
        throw new Error(
          "Unable to load faculty profile."
        );
      }


      const data = await response.json();

      setProfile(data);

      setFormData({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        subject:
          data.subject ||
          data.specialization ||
          "",
      });

    } catch (err) {

      console.error(
        "Profile fetch error:",
        err
      );

      setError(
        err.message ||
        "Unable to load faculty profile."
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {

    fetchProfile();

  }, []);


  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

  };


  // =====================================================
  // PROFILE COMPLETION
  // =====================================================

  const profileCompletion = useMemo(() => {

    if (!profile) {
      return 0;
    }

    const fields = [
      profile.name,
      profile.email,
      profile.phone,
      profile.subject ||
      profile.specialization,
    ];

    const completed =
      fields.filter(
        value =>
          value &&
          String(value).trim() !== ""
      ).length;

    return Math.round(
      (completed / fields.length) * 100
    );

  }, [profile]);


  // =====================================================
  // SAVE PROFILE
  // =====================================================

  const handleSave = async () => {

    try {

      setSaving(true);
      setError("");
      setSuccess("");

      const token = getToken();

      if (!token) {
        navigate("/faculty");
        return;
      }


      const response = await fetch(
        "http://localhost:8080/api/faculty/profile",
        {
          method: "PUT",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },

          body: JSON.stringify(formData),
        }
      );


      if (!response.ok) {

        let message =
          "Unable to update profile.";

        try {

          const data =
            await response.json();

          if (data?.message) {
            message = data.message;
          }

        } catch {
          // Ignore JSON parsing error
        }

        throw new Error(message);

      }


      const updatedProfile =
        await response.json();


      setProfile(updatedProfile);


      setFormData({
        name:
          updatedProfile.name || "",

        email:
          updatedProfile.email || "",

        phone:
          updatedProfile.phone || "",

        subject:
          updatedProfile.subject ||
          updatedProfile.specialization ||
          "",
      });


      // =================================================
      // UPDATE SIDEBAR DATA
      // =================================================

      if (updatedProfile.name) {

        localStorage.setItem(
          "facultyName",
          updatedProfile.name
        );

      }


      if (
        updatedProfile.subject ||
        updatedProfile.specialization
      ) {

        localStorage.setItem(
          "facultySubject",
          updatedProfile.subject ||
          updatedProfile.specialization
        );

      }


      setEditing(false);

      setSuccess(
        "Profile updated successfully."
      );


    } catch (err) {

      console.error(
        "Profile update error:",
        err
      );

      setError(
        err.message ||
        "Unable to update profile."
      );

    } finally {

      setSaving(false);

    }

  };


  // =====================================================
  // CANCEL EDIT
  // =====================================================

  const handleCancel = () => {

    if (!profile) {
      return;
    }


    setFormData({
      name:
        profile.name || "",

      email:
        profile.email || "",

      phone:
        profile.phone || "",

      subject:
        profile.subject ||
        profile.specialization ||
        "",
    });


    setEditing(false);
    setError("");
    setSuccess("");

  };


  // =====================================================
  // INITIAL
  // =====================================================

  const getInitial = () => {

    const name =
      profile?.name ||
      localStorage.getItem(
        "facultyName"
      ) ||
      "Faculty";

    return name
      .charAt(0)
      .toUpperCase();

  };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="faculty-layout">

        <FacultySidebar />

        <main className="faculty-page">

          <div className="faculty-page-loading">

            <RefreshCw
              size={22}
              className="faculty-spin"
            />

            <span>
              Loading profile...
            </span>

          </div>

        </main>

      </div>

    );

  }


  // =====================================================
  // PAGE
  // =====================================================

  return (

    <div className="faculty-layout">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <FacultySidebar />


      {/* =================================================
          MAIN
      ================================================= */}

      <main className="faculty-page">


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="faculty-page-header">

          <div className="faculty-profile-header-left">

            <button
              className="faculty-back-btn"
              onClick={() =>
                navigate(
                  "/faculty/dashboard"
                )
              }
            >

              <ArrowLeft size={17} />

              <span>
                Dashboard
              </span>

            </button>


            <span className="faculty-section-label">
              ACCOUNT
            </span>


            <h1>
              My Profile
            </h1>


            <p>
              View and manage your faculty account information.
            </p>

          </div>


          <button
            className="faculty-secondary-btn"
            onClick={fetchProfile}
            disabled={loading || saving}
          >

            <RefreshCw
              size={17}
              className={
                loading
                  ? "faculty-spin"
                  : ""
              }
            />

            <span>
              Refresh
            </span>

          </button>

        </div>


        {/* =================================================
            ALERTS
        ================================================= */}

        {error && (

          <div className="faculty-profile-alert faculty-profile-error">

            <X size={17} />

            <span>
              {error}
            </span>

          </div>

        )}


        {success && (

          <div className="faculty-profile-alert faculty-profile-success">

            <CheckCircle2 size={17} />

            <span>
              {success}
            </span>

          </div>

        )}


        {/* =================================================
            PROFILE
        ================================================= */}

        {profile && (

          <div className="faculty-profile-layout">


            {/* =================================================
                MAIN PROFILE CARD
            ================================================= */}

            <section className="faculty-profile-container">


              {/* =================================================
                  PROFILE HERO
              ================================================= */}

              <div className="faculty-profile-top">


                <div className="faculty-profile-identity">

                  <div className="faculty-profile-avatar">

                    {getInitial()}

                  </div>


                  <div className="faculty-profile-heading">

                    <span className="faculty-section-label">
                      FACULTY ACCOUNT
                    </span>

                    <h2>
                      {profile.name ||
                        "Faculty"}
                    </h2>

                    <p>
                      {profile.subject ||
                        profile.specialization ||
                        "Faculty Member"}
                    </p>

                    {profile.username && (

                      <div className="faculty-profile-username">

                        <AtSign size={14} />

                        {profile.username}

                      </div>

                    )}

                  </div>

                </div>


                {!editing && (

                  <button
                    className="faculty-primary-btn faculty-profile-edit-btn"
                    onClick={() => {

                      setEditing(true);
                      setError("");
                      setSuccess("");

                    }}
                  >

                    <Edit3 size={17} />

                    <span>
                      Edit Profile
                    </span>

                  </button>

                )}

              </div>


              {/* =================================================
                  PROFILE DETAILS
              ================================================= */}

              <div className="faculty-profile-details">


                {/* NAME */}

                <div className="faculty-profile-field">

                  <div className="faculty-profile-field-icon">
                    <User size={19} />
                  </div>

                  <div className="faculty-profile-field-content">

                    <label>
                      Full Name
                    </label>

                    {editing ? (

                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                      />

                    ) : (

                      <span>
                        {profile.name ||
                          "Not provided"}
                      </span>

                    )}

                  </div>

                </div>


                {/* EMAIL */}

                <div className="faculty-profile-field">

                  <div className="faculty-profile-field-icon">
                    <Mail size={19} />
                  </div>

                  <div className="faculty-profile-field-content">

                    <label>
                      Email Address
                    </label>

                    {editing ? (

                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter email"
                      />

                    ) : (

                      <span>
                        {profile.email ||
                          "Not provided"}
                      </span>

                    )}

                  </div>

                </div>


                {/* PHONE */}

                <div className="faculty-profile-field">

                  <div className="faculty-profile-field-icon">
                    <Phone size={19} />
                  </div>

                  <div className="faculty-profile-field-content">

                    <label>
                      Phone Number
                    </label>

                    {editing ? (

                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                      />

                    ) : (

                      <span>
                        {profile.phone ||
                          "Not provided"}
                      </span>

                    )}

                  </div>

                </div>


                {/* SUBJECT */}

                <div className="faculty-profile-field">

                  <div className="faculty-profile-field-icon">
                    <BookOpen size={19} />
                  </div>

                  <div className="faculty-profile-field-content">

                    <label>
                      Subject / Specialization
                    </label>

                    {editing ? (

                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Enter subject"
                      />

                    ) : (

                      <span>
                        {profile.subject ||
                          profile.specialization ||
                          "Not provided"}
                      </span>

                    )}

                  </div>

                </div>


              </div>


              {/* =================================================
                  EDIT ACTIONS
              ================================================= */}

              {editing && (

                <div className="faculty-profile-actions">

                  <button
                    type="button"
                    className="faculty-secondary-btn"
                    onClick={handleCancel}
                    disabled={saving}
                  >

                    <X size={17} />

                    <span>
                      Cancel
                    </span>

                  </button>


                  <button
                    type="button"
                    className="faculty-primary-btn"
                    onClick={handleSave}
                    disabled={saving}
                  >

                    {saving ? (

                      <>
                        <RefreshCw
                          size={17}
                          className="faculty-spin"
                        />

                        Saving...
                      </>

                    ) : (

                      <>
                        <Save size={17} />

                        Save Changes
                      </>

                    )}

                  </button>

                </div>

              )}

            </section>


            {/* =================================================
                ACCOUNT SIDEBAR
            ================================================= */}

            <aside className="faculty-profile-side">


              {/* PROFILE COMPLETION */}

              <div className="faculty-profile-info-card">

                <div className="faculty-profile-info-card-header">

                  <div className="faculty-profile-info-icon">
                    <CheckCircle2 size={19} />
                  </div>

                  <div>

                    <span>
                      PROFILE
                    </span>

                    <h3>
                      Completion
                    </h3>

                  </div>

                </div>


                <div className="faculty-profile-progress">

                  <div className="faculty-profile-progress-top">

                    <span>
                      Profile completed
                    </span>

                    <strong>
                      {profileCompletion}%
                    </strong>

                  </div>


                  <div className="faculty-profile-progress-track">

                    <div
                      className="faculty-profile-progress-bar"
                      style={{
                        width: `${profileCompletion}%`,
                      }}
                    />

                  </div>

                </div>


                <p>
                  Keep your contact and subject
                  information up to date.
                </p>

              </div>


              {/* ACCOUNT */}

              <div className="faculty-profile-info-card">

                <div className="faculty-profile-info-card-header">

                  <div className="faculty-profile-info-icon">
                    <ShieldCheck size={19} />
                  </div>

                  <div>

                    <span>
                      ACCOUNT
                    </span>

                    <h3>
                      Account Details
                    </h3>

                  </div>

                </div>


                <div className="faculty-profile-account-list">


                  <div className="faculty-profile-account-row">

                    <span>
                      Username
                    </span>

                    <strong>
                      {profile.username ||
                        "Not available"}
                    </strong>

                  </div>


                  <div className="faculty-profile-account-row">

                    <span>
                      Role
                    </span>

                    <strong>
                      {profile.role ||
                        "FACULTY"}
                    </strong>

                  </div>


                  <div className="faculty-profile-account-row">

                    <span>
                      Status
                    </span>

                    <strong className="faculty-profile-status">

                      <span />

                      Active

                    </strong>

                  </div>


                </div>

              </div>


              {/* QUICK INFO */}

              <div className="faculty-profile-info-card faculty-profile-tip-card">

                <span className="faculty-section-label">
                  TIP
                </span>

                <h3>
                  Keep your profile updated
                </h3>

                <p>
                  Students and the faculty portal
                  use your profile information for
                  identification and communication.
                </p>

              </div>


            </aside>

          </div>

        )}

      </main>

    </div>

  );

}


export default FacultyProfile;