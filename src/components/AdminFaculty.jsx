import { useEffect, useMemo, useState } from "react";

import {
  Users,
  UserPlus,
  Search,
  RefreshCw,
  Pencil,
  Trash2,
  Check,
  X,
  BookOpen,
  UserX,
  UserCheck,
  Save,
  Plus,
} from "lucide-react";


const API = "http://localhost:8080/api/admin";


function AdminFaculty() {

  // =====================================================
  // STATE
  // =====================================================

  const [faculty, setFaculty] = useState([]);
  const [courses, setCourses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [coursesLoading, setCoursesLoading] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [editingFaculty, setEditingFaculty] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [selectedFaculty, setSelectedFaculty] = useState(null);

  const [assignedCourses, setAssignedCourses] = useState([]);

  const [form, setForm] = useState({
    username: "",
    password: "",
    name: "",
    email: "",
    phone: "",
    designation: "",
    subject: "",
    experience: "",
    description: "",
  });


  // =====================================================
  // TOKEN
  // =====================================================

  const getToken = () => {

    const token =
      localStorage.getItem("adminToken");

    if (!token) {
      throw new Error("Admin session expired.");
    }

    return token;
  };


  // =====================================================
  // FETCH FACULTY
  // =====================================================

  const fetchFaculty = async () => {

    try {

      setLoading(true);
      setError("");

      const token = getToken();

      const response = await fetch(
        `${API}/faculty`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );


      if (
        response.status === 401 ||
        response.status === 403
      ) {
        throw new Error(
          "Admin authorization failed."
        );
      }


      if (!response.ok) {
        throw new Error(
          "Failed to load faculty."
        );
      }


      const data =
        await response.json();

      setFaculty(data);

    } catch (error) {

      console.error(
        "Faculty fetch failed:",
        error
      );

      setError(
        error.message ||
        "Unable to load faculty."
      );

    } finally {

      setLoading(false);

    }
  };


  // =====================================================
  // FETCH COURSES
  // =====================================================

  const fetchCourses = async () => {

    try {

      setCoursesLoading(true);

      const token = getToken();

      const response = await fetch(
        `${API}/courses`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );


      if (!response.ok) {
        throw new Error(
          "Failed to load courses."
        );
      }


      const data =
        await response.json();

      setCourses(data);

    } catch (error) {

      console.error(
        "Courses fetch failed:",
        error
      );

    } finally {

      setCoursesLoading(false);

    }
  };


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {

    fetchFaculty();
    fetchCourses();

  }, []);


  // =====================================================
  // RESET FORM
  // =====================================================

  const resetForm = () => {

    setEditingFaculty(null);

    setForm({
      username: "",
      password: "",
      name: "",
      email: "",
      phone: "",
      designation: "",
      subject: "",
      experience: "",
      description: "",
    });

  };


  // =====================================================
  // OPEN ADD FORM
  // =====================================================

  const openAddForm = () => {

    resetForm();

    setShowForm(true);

  };


  // =====================================================
  // OPEN EDIT FORM
  // =====================================================

  const openEditForm = (member) => {

    setEditingFaculty(member);

    setForm({
      username:
        member.username || "",

      password: "",

      name:
        member.name || "",

      email:
        member.email || "",

      phone:
        member.phone || "",

      designation:
        member.designation || "",

      subject:
        member.subject || "",

      experience:
        member.experience || "",

      description:
        member.description || "",
    });

    setShowForm(true);

  };


  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (event) => {

    const {
      name,
      value,
    } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

  };


  // =====================================================
  // SAVE FACULTY
  // =====================================================

  const saveFaculty = async (event) => {

    event.preventDefault();

    try {

      const token = getToken();

      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        designation:
          form.designation.trim(),
        subject:
          form.subject.trim(),
        experience:
          form.experience.trim(),
        description:
          form.description.trim(),
      };


      // -------------------------------------------------
      // CREATE
      // -------------------------------------------------

      if (!editingFaculty) {

        if (!form.username.trim()) {
          alert("Username is required.");
          return;
        }

        if (!form.password.trim()) {
          alert("Password is required.");
          return;
        }

        payload.username =
          form.username.trim();

        payload.password =
          form.password;


        const response = await fetch(
          `${API}/faculty`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body:
              JSON.stringify(payload),
          }
        );


        const data =
          await response.json()
            .catch(() => ({}));


        if (!response.ok) {

          throw new Error(
            data.message ||
            "Failed to create faculty."
          );
        }


        setFaculty((current) => [
          data,
          ...current,
        ]);

        alert(
          "Faculty created successfully. Awaiting approval."
        );

      }

      // -------------------------------------------------
      // UPDATE
      // -------------------------------------------------

      else {

        if (form.password.trim()) {
          payload.password =
            form.password;
        }


        const response = await fetch(
          `${API}/faculty/${editingFaculty.id}`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body:
              JSON.stringify(payload),
          }
        );


        const data =
          await response.json()
            .catch(() => ({}));


        if (!response.ok) {

          throw new Error(
            data.message ||
            "Failed to update faculty."
          );
        }


        setFaculty((current) =>
          current.map((item) =>
            item.id === editingFaculty.id
              ? data
              : item
          )
        );

        alert(
          "Faculty updated successfully."
        );

      }


      setShowForm(false);
      resetForm();

    } catch (error) {

      console.error(
        "Faculty save failed:",
        error
      );

      alert(
        error.message ||
        "Unable to save faculty."
      );

    }

  };


  // =====================================================
  // APPROVE
  // =====================================================

  const approveFaculty = async (id) => {

    try {

      const token = getToken();

      const response = await fetch(
        `${API}/faculty/${id}/approve`,
        {
          method: "PUT",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );


      const data =
        await response.json()
          .catch(() => ({}));


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to approve faculty."
        );
      }


      setFaculty((current) =>
        current.map((item) =>
          item.id === id
            ? data.faculty
            : item
        )
      );

    } catch (error) {

      console.error(
        "Approve faculty failed:",
        error
      );

      alert(error.message);

    }

  };


  // =====================================================
  // REJECT
  // =====================================================

  const rejectFaculty = async (id) => {

    if (
      !window.confirm(
        "Are you sure you want to reject this faculty?"
      )
    ) {
      return;
    }


    try {

      const token = getToken();

      const response = await fetch(
        `${API}/faculty/${id}/reject`,
        {
          method: "PUT",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );


      const data =
        await response.json()
          .catch(() => ({}));


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to reject faculty."
        );
      }


      setFaculty((current) =>
        current.map((item) =>
          item.id === id
            ? data.faculty
            : item
        )
      );

    } catch (error) {

      console.error(
        "Reject faculty failed:",
        error
      );

      alert(error.message);

    }

  };


  // =====================================================
  // DISABLE
  // =====================================================

  const disableFaculty = async (id) => {

    if (
      !window.confirm(
        "Disable this faculty account?"
      )
    ) {
      return;
    }


    try {

      const token = getToken();

      const response = await fetch(
        `${API}/faculty/${id}/disable`,
        {
          method: "PUT",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );


      const data =
        await response.json()
          .catch(() => ({}));


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to disable faculty."
        );
      }


      setFaculty((current) =>
        current.map((item) =>
          item.id === id
            ? data.faculty
            : item
        )
      );

    } catch (error) {

      console.error(
        "Disable faculty failed:",
        error
      );

      alert(error.message);

    }

  };


  // =====================================================
  // DELETE FACULTY
  // =====================================================

  const deleteFaculty = async (id) => {

    if (
      !window.confirm(
        "Delete this faculty permanently? Their course assignments will also be removed."
      )
    ) {
      return;
    }


    try {

      const token = getToken();

      const response = await fetch(
        `${API}/faculty/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );


      if (!response.ok) {

        const data =
          await response.json()
            .catch(() => ({}));

        throw new Error(
          data.message ||
          "Failed to delete faculty."
        );
      }


      setFaculty((current) =>
        current.filter(
          (item) => item.id !== id
        )
      );


      if (
        selectedFaculty?.id === id
      ) {
        setSelectedFaculty(null);
      }


    } catch (error) {

      console.error(
        "Delete faculty failed:",
        error
      );

      alert(error.message);

    }

  };


  // =====================================================
  // LOAD ASSIGNED COURSES
  // =====================================================

  const openCourseAssignment = async (
    member
  ) => {

    try {

      const token = getToken();

      setSelectedFaculty(member);

      const response = await fetch(
        `${API}/faculty/${member.id}/courses`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );


      if (!response.ok) {

        throw new Error(
          "Failed to load assigned courses."
        );
      }


      const data =
        await response.json();

      setAssignedCourses(data);

    } catch (error) {

      console.error(
        "Assigned courses failed:",
        error
      );

      alert(error.message);

    }

  };


  // =====================================================
  // ASSIGN COURSE
  // =====================================================

  const assignCourse = async (
    courseId
  ) => {

    if (!selectedFaculty) {
      return;
    }


    try {

      const token = getToken();

      const response = await fetch(
        `${API}/faculty/${selectedFaculty.id}/courses/${courseId}`,
        {
          method: "POST",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );


      const data =
        await response.json()
          .catch(() => ({}));


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to assign course."
        );
      }


      await openCourseAssignment(
        selectedFaculty
      );

    } catch (error) {

      console.error(
        "Course assignment failed:",
        error
      );

      alert(error.message);

    }

  };


  // =====================================================
  // REMOVE COURSE
  // =====================================================

  const removeCourse = async (
    courseId
  ) => {

    if (!selectedFaculty) {
      return;
    }


    if (
      !window.confirm(
        "Remove this course from the faculty?"
      )
    ) {
      return;
    }


    try {

      const token = getToken();

      const response = await fetch(
        `${API}/faculty/${selectedFaculty.id}/courses/${courseId}`,
        {
          method: "DELETE",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );


      const data =
        await response.json()
          .catch(() => ({}));


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Failed to remove course."
        );
      }


      await openCourseAssignment(
        selectedFaculty
      );

    } catch (error) {

      console.error(
        "Remove course failed:",
        error
      );

      alert(error.message);

    }

  };


  // =====================================================
  // FILTER FACULTY
  // =====================================================

  const filteredFaculty = useMemo(() => {

    const query =
      search
        .toLowerCase()
        .trim();


    return faculty.filter((member) => {

      const matchesSearch =
        !query ||
        member.name
          ?.toLowerCase()
          .includes(query) ||
        member.username
          ?.toLowerCase()
          .includes(query) ||
        member.email
          ?.toLowerCase()
          .includes(query) ||
        member.subject
          ?.toLowerCase()
          .includes(query);


      const matchesStatus =
        statusFilter === "ALL" ||
        member.status === statusFilter;


      return (
        matchesSearch &&
        matchesStatus
      );

    });

  }, [
    faculty,
    search,
    statusFilter,
  ]);


  // =====================================================
  // STATISTICS
  // =====================================================

  const pendingCount =
    faculty.filter(
      (item) =>
        item.status === "PENDING"
    ).length;


  const approvedCount =
    faculty.filter(
      (item) =>
        item.status === "APPROVED"
    ).length;


  const disabledCount =
    faculty.filter(
      (item) =>
        item.status === "DISABLED"
    ).length;


  // =====================================================
  // UI
  // =====================================================

  return (
    <section className="admin-results">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="admin-table-header">

        <div>

          <span className="section-label">
            FACULTY MANAGEMENT
          </span>

          <h2>
            Faculty
          </h2>

          <p>
            Manage faculty accounts,
            approvals and course assignments.
          </p>

        </div>


        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >

          <button
            type="button"
            className="admin-refresh"
            onClick={() => {
              fetchFaculty();
              fetchCourses();
            }}
          >
            <RefreshCw size={17} />
            Refresh
          </button>


          <button
            type="button"
            className="btn btn-primary"
            onClick={openAddForm}
          >
            <Plus size={17} />
            Add Faculty
          </button>

        </div>

      </div>


      {/* =================================================
          STATISTICS
      ================================================= */}

      <div className="admin-stats">

        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            <Users size={20} />
          </div>

          <div>
            <span>Total Faculty</span>
            <strong>
              {faculty.length}
            </strong>
          </div>

        </div>


        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            <UserCheck size={20} />
          </div>

          <div>
            <span>Approved</span>
            <strong>
              {approvedCount}
            </strong>
          </div>

        </div>


        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            <UserPlus size={20} />
          </div>

          <div>
            <span>Pending</span>
            <strong>
              {pendingCount}
            </strong>
          </div>

        </div>


        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            <UserX size={20} />
          </div>

          <div>
            <span>Disabled</span>
            <strong>
              {disabledCount}
            </strong>
          </div>

        </div>

      </div>


      {/* =================================================
          SEARCH + FILTER
      ================================================= */}

      <div className="admin-toolbar">

        <div className="admin-search">

          <Search size={17} />

          <input
            type="text"
            placeholder="Search faculty by name, username, email or subject..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

        </div>


        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target.value
            )
          }
        >

          <option value="ALL">
            All Status
          </option>

          <option value="PENDING">
            Pending
          </option>

          <option value="APPROVED">
            Approved
          </option>

          <option value="REJECTED">
            Rejected
          </option>

          <option value="DISABLED">
            Disabled
          </option>

        </select>

      </div>


      {error && (
        <div className="admin-empty">
          {error}
        </div>
      )}


      {/* =================================================
          FACULTY TABLE
      ================================================= */}

      <div className="admin-table-card">

        {loading ? (

          <div className="admin-empty">
            Loading faculty...
          </div>

        ) : filteredFaculty.length === 0 ? (

          <div className="admin-empty">
            No faculty found.
          </div>

        ) : (

          <div className="admin-table-wrapper">

            <table className="admin-table">

              <thead>

                <tr>
                  <th>Faculty</th>
                  <th>Contact</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>

              </thead>


              <tbody>

                {filteredFaculty.map(
                  (member) => (

                    <tr key={member.id}>

                      {/* FACULTY */}

                      <td>

                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "3px",
                          }}
                        >

                          <strong>
                            {member.name}
                          </strong>

                          <span>
                            @{member.username}
                          </span>

                        </div>

                      </td>


                      {/* CONTACT */}

                      <td>

                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "3px",
                          }}
                        >

                          <span>
                            {member.email}
                          </span>

                          {member.phone && (
                            <span>
                              {member.phone}
                            </span>
                          )}

                        </div>

                      </td>


                      {/* SUBJECT */}

                      <td>
                        {member.subject || "—"}
                      </td>


                      {/* STATUS */}

                      <td>

                        <span
                          className={`admin-status admin-status-${(
                            member.status || ""
                          ).toLowerCase()}`}
                        >
                          {member.status || "UNKNOWN"}
                        </span>

                      </td>


                      {/* ACTIONS */}

                      <td>

                        <div
                          style={{
                            display: "flex",
                            gap: "6px",
                            flexWrap: "wrap",
                          }}
                        >

                          {member.status ===
                            "PENDING" && (

                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={() =>
                                approveFaculty(
                                  member.id
                                )
                              }
                              title="Approve"
                            >
                              <Check size={15} />
                              Approve
                            </button>

                          )}


                          {member.status ===
                            "APPROVED" && (

                            <button
                              type="button"
                              className="btn btn-light"
                              onClick={() =>
                                disableFaculty(
                                  member.id
                                )
                              }
                              title="Disable"
                            >
                              <UserX size={15} />
                              Disable
                            </button>

                          )}


                          {member.status ===
                            "DISABLED" && (

                            <button
                              type="button"
                              className="btn btn-light"
                              onClick={() =>
                                approveFaculty(
                                  member.id
                                )
                              }
                              title="Enable"
                            >
                              <UserCheck size={15} />
                              Enable
                            </button>

                          )}


                          {member.status ===
                            "PENDING" && (

                            <button
                              type="button"
                              className="btn btn-light"
                              onClick={() =>
                                rejectFaculty(
                                  member.id
                                )
                              }
                            >
                              <X size={15} />
                              Reject
                            </button>

                          )}


                          <button
                            type="button"
                            className="btn btn-light"
                            onClick={() =>
                              openCourseAssignment(
                                member
                              )
                            }
                            title="Manage Courses"
                          >
                            <BookOpen size={15} />
                            Courses
                          </button>


                          <button
                            type="button"
                            className="btn btn-light"
                            onClick={() =>
                              openEditForm(member)
                            }
                            title="Edit"
                          >
                            <Pencil size={15} />
                            Edit
                          </button>


                          <button
                            type="button"
                            className="btn btn-light"
                            onClick={() =>
                              deleteFaculty(
                                member.id
                              )
                            }
                            title="Delete"
                          >
                            <Trash2 size={15} />
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>


      {/* =================================================
          ADD / EDIT FACULTY MODAL
      ================================================= */}

      {showForm && (

        <div
          className="admin-modal-overlay"
          onClick={() =>
            setShowForm(false)
          }
        >

          <div
            className="admin-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="admin-modal-header">

              <div>

                <span className="section-label">
                  FACULTY MANAGEMENT
                </span>

                <h2>
                  {editingFaculty
                    ? "Edit Faculty"
                    : "Add Faculty"}
                </h2>

              </div>


              <button
                type="button"
                className="admin-modal-close"
                onClick={() =>
                  setShowForm(false)
                }
              >
                <X size={20} />
              </button>

            </div>


            <form
              className="admin-result-form"
              onSubmit={saveFaculty}
            >

              <div className="admin-form-grid">

                {!editingFaculty && (

                  <div className="admin-form-field">

                    <label>
                      Username
                    </label>

                    <input
                      name="username"
                      value={form.username}
                      onChange={handleChange}
                      placeholder="e.g. faculty01"
                      required
                    />

                  </div>

                )}


                {!editingFaculty && (

                  <div className="admin-form-field">

                    <label>
                      Password
                    </label>

                    <input
                      name="password"
                      type="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Faculty login password"
                      required
                    />

                  </div>

                )}


                <div className="admin-form-field">

                  <label>
                    Name
                  </label>

                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Faculty name"
                    required
                  />

                </div>


                <div className="admin-form-field">

                  <label>
                    Email
                  </label>

                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="faculty@example.com"
                    required
                  />

                </div>


                <div className="admin-form-field">

                  <label>
                    Phone
                  </label>

                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Phone number"
                  />

                </div>


                <div className="admin-form-field">

                  <label>
                    Designation
                  </label>

                  <input
                    name="designation"
                    value={form.designation}
                    onChange={handleChange}
                    placeholder="e.g. Senior Faculty"
                  />

                </div>


                <div className="admin-form-field">

                  <label>
                    Subject
                  </label>

                  <input
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="e.g. Mathematics"
                  />

                </div>


                <div className="admin-form-field">

                  <label>
                    Experience
                  </label>

                  <input
                    name="experience"
                    value={form.experience}
                    onChange={handleChange}
                    placeholder="e.g. 5 Years"
                  />

                </div>


                <div className="admin-form-field admin-form-field-wide">

                  <label>
                    Description
                  </label>

                  <textarea
                    name="description"
                    rows="4"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Faculty description..."
                  />

                </div>

              </div>


              <div className="admin-modal-actions">

                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  {editingFaculty ? (
                    <Pencil size={17} />
                  ) : (
                    <Save size={17} />
                  )}

                  {editingFaculty
                    ? "Update Faculty"
                    : "Create Faculty"}
                </button>


                <button
                  type="button"
                  className="btn btn-light"
                  onClick={() =>
                    setShowForm(false)
                  }
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>

        </div>

      )}


      {/* =================================================
          COURSE ASSIGNMENT MODAL
      ================================================= */}

      {selectedFaculty && (

        <div
          className="admin-modal-overlay"
          onClick={() =>
            setSelectedFaculty(null)
          }
        >

          <div
            className="admin-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="admin-modal-header">

              <div>

                <span className="section-label">
                  COURSE ASSIGNMENT
                </span>

                <h2>
                  {selectedFaculty.name}
                </h2>

                <p>
                  @{selectedFaculty.username}
                </p>

              </div>


              <button
                type="button"
                className="admin-modal-close"
                onClick={() =>
                  setSelectedFaculty(null)
                }
              >
                <X size={20} />
              </button>

            </div>


            <div>

              <h3>
                Assigned Courses
              </h3>


              {assignedCourses.length === 0 ? (

                <div className="admin-empty">
                  No courses assigned.
                </div>

              ) : (

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >

                  {assignedCourses.map(
                    (course) => (

                      <div
                        key={course.id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: "12px",
                          padding: "12px 14px",
                          border: "1px solid rgba(128,128,128,.2)",
                          borderRadius: "10px",
                        }}
                      >

                        <div>

                          <strong>
                            {course.name}
                          </strong>

                          <div>
                            {course.category || ""}
                          </div>

                        </div>


                        <button
                          type="button"
                          className="btn btn-light"
                          onClick={() =>
                            removeCourse(
                              course.id
                            )
                          }
                        >
                          <X size={15} />
                          Remove
                        </button>

                      </div>

                    )
                  )}

                </div>

              )}


              <hr
                style={{
                  margin: "20px 0",
                  opacity: 0.2,
                }}
              />


              <h3>
                Assign New Course
              </h3>


              {coursesLoading ? (

                <div className="admin-empty">
                  Loading courses...
                </div>

              ) : (

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    marginTop: "10px",
                  }}
                >

                  {courses
                    .filter(
                      (course) =>
                        !assignedCourses.some(
                          (assigned) =>
                            assigned.id ===
                            course.id
                        )
                    )
                    .map((course) => (

                      <button
                        key={course.id}
                        type="button"
                        className="btn btn-light"
                        style={{
                          justifyContent:
                            "flex-start",
                        }}
                        onClick={() =>
                          assignCourse(
                            course.id
                          )
                        }
                      >
                        <Plus size={15} />
                        {course.name}
                      </button>

                    ))}

                </div>

              )}

            </div>

          </div>

        </div>

      )}

    </section>
  );
}


export default AdminFaculty;