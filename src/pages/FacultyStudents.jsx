import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Users,
  RefreshCw,
  Mail,
  Phone,
  Search,
  Filter,
  BookOpen,
  X,
  ArrowUpDown,
} from "lucide-react";

import FacultySidebar from "../components/FacultySidebar";


function FacultyStudents() {

  const navigate = useNavigate();


  // =====================================================
  // STATE
  // =====================================================

  const [students, setStudents] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // SEARCH

  const [searchTerm, setSearchTerm] = useState("");


  // FILTERS

  const [courseFilter, setCourseFilter] = useState("ALL");

  const [statusFilter, setStatusFilter] = useState("ALL");


  // SORT

  const [sortBy, setSortBy] = useState("NAME_ASC");


  // =====================================================
  // TOKEN
  // =====================================================

  const getToken = () =>
    localStorage.getItem("facultyToken") ||
    localStorage.getItem("authToken");


  // =====================================================
  // FETCH STUDENTS
  // =====================================================

  const fetchStudents = async () => {

    try {

      setLoading(true);

      setError("");


      const token = getToken();


      if (!token) {

        throw new Error(
          "Faculty authentication token not found."
        );

      }


      const response = await fetch(
        "https://sigma-classes-backend-ajkh.onrender.com/api/faculty/students",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      if (!response.ok) {

        throw new Error(
          "Unable to load students."
        );

      }


      const data = await response.json();


      setStudents(
        Array.isArray(data)
          ? data
          : []
      );


    } catch (err) {

      console.error(
        "Failed to fetch students:",
        err
      );


      setError(
        err.message ||
        "Unable to load students."
      );


    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {

    fetchStudents();

  }, []);


  // =====================================================
  // UNIQUE COURSES
  // =====================================================

  const courses = useMemo(() => {

    const courseMap = new Map();


    students.forEach(student => {

      if (
        student.courseId &&
        student.courseName
      ) {

        courseMap.set(
          String(student.courseId),
          student.courseName
        );

      }

    });


    return Array.from(
      courseMap.entries()
    ).map(([id, name]) => ({
      id,
      name,
    }));

  }, [students]);


  // =====================================================
  // STATISTICS
  // =====================================================

  const totalStudents = students.length;


  const activeStudents =
    students.filter(
      student =>
        String(student.status)
          .toUpperCase() === "ACTIVE"
    ).length;


  const totalCourses =
    new Set(
      students
        .map(student => student.courseId)
        .filter(Boolean)
    ).size;


  // =====================================================
  // FILTER + SEARCH + SORT
  // =====================================================

  const filteredStudents = useMemo(() => {

    let result = [...students];


    // -------------------------------------------------
    // SEARCH
    // -------------------------------------------------

    const search =
      searchTerm
        .trim()
        .toLowerCase();


    if (search) {

      result = result.filter(student => {

        const name =
          String(student.name || "")
            .toLowerCase();

        const email =
          String(student.email || "")
            .toLowerCase();

        const phone =
          String(student.phone || "")
            .toLowerCase();

        const course =
          String(student.courseName || "")
            .toLowerCase();


        return (
          name.includes(search) ||
          email.includes(search) ||
          phone.includes(search) ||
          course.includes(search)
        );

      });

    }


    // -------------------------------------------------
    // COURSE FILTER
    // -------------------------------------------------

    if (courseFilter !== "ALL") {

      result = result.filter(
        student =>
          String(student.courseId) ===
          String(courseFilter)
      );

    }


    // -------------------------------------------------
    // STATUS FILTER
    // -------------------------------------------------

    if (statusFilter !== "ALL") {

      result = result.filter(
        student =>
          String(student.status)
            .toUpperCase() ===
          statusFilter
      );

    }


    // -------------------------------------------------
    // SORT
    // -------------------------------------------------

    result.sort((a, b) => {

      switch (sortBy) {

        case "NAME_ASC":

          return String(a.name || "")
            .localeCompare(
              String(b.name || "")
            );


        case "NAME_DESC":

          return String(b.name || "")
            .localeCompare(
              String(a.name || "")
            );

case "NEWEST":
  return (
    new Date(b.enrolledAt || 0).getTime() -
    new Date(a.enrolledAt || 0).getTime()
  );

case "OLDEST":
  return (
    new Date(a.enrolledAt || 0).getTime() -
    new Date(b.enrolledAt || 0).getTime()
  );


        default:

          return 0;

      }

    });


    return result;

  }, [
    students,
    searchTerm,
    courseFilter,
    statusFilter,
    sortBy,
  ]);


  // =====================================================
  // CLEAR FILTERS
  // =====================================================

  const clearFilters = () => {

    setSearchTerm("");

    setCourseFilter("ALL");

    setStatusFilter("ALL");

    setSortBy("NAME_ASC");

  };


  // =====================================================
  // CHECK WHETHER FILTERS ARE ACTIVE
  // =====================================================

  const hasActiveFilters =
    searchTerm.trim() !== "" ||
    courseFilter !== "ALL" ||
    statusFilter !== "ALL" ||
    sortBy !== "NAME_ASC";


  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {

    if (!date) {
      return "—";
    }


    const parsedDate =
      new Date(date);


    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {

      return "—";

    }


    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );

  };


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div className="faculty-dashboard">


      {/* =================================================
          SIDEBAR
      ================================================= */}

      <FacultySidebar />


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="faculty-dashboard-main">


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="faculty-dashboard-header">

          <div>

            <button
              onClick={() =>
                navigate("/faculty/dashboard")
              }
              className="faculty-back-btn"
            >

              <ArrowLeft size={17} />

              Dashboard

            </button>


            <span className="section-label">
              FACULTY PORTAL
            </span>


            <h1>
              Students
            </h1>


            <p>
              Students enrolled in your courses.
            </p>

          </div>


          <button
            onClick={fetchStudents}
            className="faculty-secondary-btn"
            disabled={loading}
          >

            <RefreshCw
              size={17}
              className={
                loading
                  ? "faculty-spin"
                  : ""
              }
            />

            Refresh

          </button>

        </div>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (

          <div className="faculty-dashboard-error">

            {error}

          </div>

        )}


        {/* =================================================
            STATISTICS
        ================================================= */}

        {!loading && !error && (

          <div className="faculty-students-stats">

<div className="faculty-student-stat-card">

  <Users size={19} />

  <div>
    <div className="faculty-student-stat-label">
      Total Students
    </div>

    <div className="faculty-student-stat-value">
      {students.length}
    </div>
  </div>

</div>

     <div className="faculty-student-stat-card">

  <Users size={19} />

  <div>
    <div className="faculty-student-stat-label">
      Active Students
    </div>

    <div className="faculty-student-stat-value">
      {activeStudents}
    </div>
  </div>

</div>
<div className="faculty-student-stat-card">

  <Users size={19} />

  <div>
    <div className="faculty-student-stat-label">
Courses

    </div>

    <div className="faculty-student-stat-value">
      {courses.length  }    
    </div>
  </div>

</div>

          </div>

        )}


        {/* =================================================
            SEARCH + FILTER BAR
        ================================================= */}

        {!loading && !error && (

          <section className="faculty-students-toolbar">
{/* =====================================================
    SEARCH + FILTER + SORT
===================================================== */}

<div className="faculty-student-toolbar">

  {/* SEARCH */}

  <div className="faculty-student-search">

    <Search size={18} />

    <input
      type="text"
      placeholder="Search by name, email, phone or course..."
      value={searchTerm}
      onChange={(e) =>
        setSearchTerm(e.target.value)
      }
    />

    {searchTerm && (
      <button
        type="button"
        className="faculty-search-clear"
        onClick={() => setSearchTerm("")}
        aria-label="Clear search"
      >
        <X size={16} />
      </button>
    )}

  </div>


  {/* FILTERS */}

  <div className="faculty-student-filters">

    {/* COURSE */}

    <div className="faculty-filter-control">

      <label>
        <BookOpen size={15} />
        Course
      </label>

      <select
        value={courseFilter}
        onChange={(e) =>
          setCourseFilter(e.target.value)
        }
      >

        <option value="ALL">
          All Courses
        </option>

        {courses.map(course => (
          <option
            key={course.id}
            value={course.id}
          >
            {course.name}
          </option>
        ))}

      </select>

    </div>


    {/* STATUS */}

    <div className="faculty-filter-control">

      <label>
        <Users size={15} />
        Status
      </label>

      <select
        value={statusFilter}
        onChange={(e) =>
          setStatusFilter(e.target.value)
        }
      >

        <option value="ALL">
          All Status
        </option>

        <option value="ACTIVE">
          Active
        </option>

        <option value="INACTIVE">
          Inactive
        </option>

      </select>

    </div>


    {/* SORT */}

    <div className="faculty-filter-control">

      <label>
        <ArrowUpDown size={15} />
        Sort by
      </label>

      <select
        value={sortBy}
        onChange={(e) =>
          setSortBy(e.target.value)
        }
      >

        <option value="NAME_ASC">
          Name: A–Z
        </option>

        <option value="NAME_DESC">
          Name: Z–A
        </option>

        <option value="NEWEST">
          Newest Enrolled
        </option>

        <option value="OLDEST">
          Oldest Enrolled
        </option>

      </select>

    </div>


    {/* CLEAR */}

    {hasActiveFilters && (

      <button
        type="button"
        className="faculty-clear-filters"
        onClick={clearFilters}
      >
        <X size={15} />
        Clear filters
      </button>

    )}

  </div>

</div>

          </section>

        )}


        {/* =================================================
            RESULT COUNT
        ================================================= */}

        {!loading && !error && (

          <div className="faculty-students-result-info">

            <span>

              Showing{" "}

              <strong>
                {filteredStudents.length}
              </strong>

              {" "}of{" "}

              <strong>
                {totalStudents}
              </strong>

              {" "}students

            </span>

          </div>

        )}


        {/* =================================================
            LOADING
        ================================================= */}

        {loading ? (

          <div className="faculty-dashboard-loading">

            Loading students...

          </div>


        ) : filteredStudents.length === 0 ? (

          /* =================================================
             NO RESULTS
          ================================================= */

          <div className="faculty-dashboard-card faculty-students-empty">

            <Users size={38} />

            <h2>
              No students found
            </h2>

            <p>

              {students.length === 0
                ? "No active students are currently enrolled in your courses."
                : "No students match your current search or filters."
              }

            </p>


            {students.length > 0 &&
              hasActiveFilters && (

                <button
                  onClick={clearFilters}
                  className="faculty-secondary-btn"
                >

                  <X size={16} />

                  Clear Filters

                </button>

              )}

          </div>


        ) : (

          /* =================================================
             STUDENT TABLE
          ================================================= */

          <div className="faculty-students-table-wrapper">

            <table className="faculty-students-table">


              <thead>

                <tr>

                  <th>
                    Student
                  </th>

                  <th>
                    Email
                  </th>

                  <th>
                    Phone
                  </th>

                  <th>
                    Course
                  </th>

                  <th>
                    Enrolled
                  </th>

                  <th>
                    Status
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredStudents.map(student => (

                  <tr
                    key={student.enrollmentId}
                  >


                    {/* STUDENT */}

                    <td>

                      <strong>
                        {student.name || "—"}
                      </strong>

                    </td>


                    {/* EMAIL */}

                    <td>

                      <span>

                        <Mail size={14} />

                        {student.email || "—"}

                      </span>

                    </td>


                    {/* PHONE */}

                    <td>

                      <span>

                        <Phone size={14} />

                        {student.phone || "—"}

                      </span>

                    </td>


                    {/* COURSE */}

                    <td>

                      {student.courseName || "—"}

                    </td>


                    {/* ENROLLED */}

                    <td>

                      {formatDate(
                        student.enrolledAt
                      )}

                    </td>


                    {/* STATUS */}

                    <td>

                      <span
                        className={`faculty-status-badge ${
                          String(
                            student.status || ""
                          ).toLowerCase()
                        }`}
                      >

                        {student.status || "UNKNOWN"}

                      </span>

                    </td>


                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </main>

    </div>

  );

}

export default FacultyStudents;