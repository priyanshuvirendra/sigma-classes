import { useEffect, useState } from "react";

import {
  ArrowUpRight,
  Calculator,
  Landmark,
  BookOpen,
  Loader2,
  CalendarDays,
  Clock3,
  Monitor,
} from "lucide-react";

function Courses({ limit = null, showViewAll = false }) {

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // =====================================================
  // FETCH COURSES FROM BACKEND
  // =====================================================

  useEffect(() => {

    const fetchCourses = async () => {

      try {

        setLoading(true);
        setError("");

        const response = await fetch(
          "https://sigma-classes-backend-ajkh.onrender.com/api/courses"
        );

        if (!response.ok) {
          throw new Error("Unable to load courses.");
        }

        const data = await response.json();

        setCourses(data);

      } catch (err) {

        console.error("Courses error:", err);

        setError(
          "Unable to load courses. Please try again later."
        );

      } finally {

        setLoading(false);

      }

    };

    fetchCourses();

  }, []);


  // =====================================================
  // COURSE ICON
  // =====================================================

  const getCourseIcon = (category) => {

    const value =
      category?.toLowerCase() || "";

    if (
      value.includes("bank") ||
      value.includes("ibps") ||
      value.includes("sbi")
    ) {
      return Landmark;
    }

    if (value.includes("ssc")) {
      return Calculator;
    }

    return BookOpen;
  };


  // =====================================================
  // VISIBLE COURSES
  // =====================================================

  const visibleCourses =
    limit !== null
      ? courses.slice(0, limit)
      : courses;


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (
      <section
        className="section courses-section"
        id="courses"
      >

        <div className="container">

          <div className="section-heading-row">

            <div>

              <span className="section-label">
                OUR COURSES
              </span>

              <h2>
                Choose your exam.
                <br />
                <span>
                  We'll build the strategy.
                </span>
              </h2>

            </div>

            <p>
              Comprehensive preparation designed
              to take you from fundamentals to
              exam-ready.
            </p>

          </div>


          <div className="courses-loading">

            <Loader2
              size={26}
              className="course-loading-icon"
            />

            <p>
              Loading courses...
            </p>

          </div>

        </div>

      </section>
    );

  }


  // =====================================================
  // ERROR
  // =====================================================

  if (error) {

    return (
      <section
        className="section courses-section"
        id="courses"
      >

        <div className="container">

          <div className="section-heading-row">

            <div>

              <span className="section-label">
                OUR COURSES
              </span>

              <h2>
                Choose your exam.
                <br />
                <span>
                  We'll build the strategy.
                </span>
              </h2>

            </div>

          </div>


          <div className="courses-error">

            <p>{error}</p>

          </div>

        </div>

      </section>
    );

  }


  // =====================================================
  // NO COURSES
  // =====================================================

  if (courses.length === 0) {

    return (
      <section
        className="section courses-section"
        id="courses"
      >

        <div className="container">

          <div className="section-heading-row">

            <div>

              <span className="section-label">
                OUR COURSES
              </span>

              <h2>
                Choose your exam.
                <br />
                <span>
                  We'll build the strategy.
                </span>
              </h2>

            </div>

          </div>


          <div className="courses-empty">

            <p>
              No courses are currently available.
            </p>

          </div>

        </div>

      </section>
    );

  }


  // =====================================================
  // COURSES
  // =====================================================

  return (

    <section
      className="section courses-section"
      id="courses"
    >

      <div className="container">

        <div className="section-heading-row">

          <div>

            <span className="section-label">
              OUR COURSES
            </span>

            <h2>
              Choose your exam.
              <br />

              <span>
                We'll build the strategy.
              </span>
            </h2>

          </div>


          <p>
            Comprehensive preparation designed
            to take you from fundamentals to
            exam-ready.
          </p>

        </div>


        {/* =================================================
            COURSE GRID
        ================================================= */}

        <div className="courses-grid">

          {visibleCourses.map((course) => {

            const Icon =
              getCourseIcon(course.category);

            return (

              <article
                className="course-card"
                key={course.id}
              >

                <div className="course-top">

                  <div className="course-icon">
                    <Icon size={25} />
                  </div>

                  <span className="course-category">
                    {course.category || "COURSE"}
                  </span>

                </div>


                <h3>
                  {course.name}
                </h3>


                <p>
                  {course.description}
                </p>


                {/* COURSE INFORMATION */}

                <div className="course-meta">

                  {course.mode && (
                    <div className="course-meta-item">

                      <Monitor size={15} />

                      <span>
                        {course.mode}
                      </span>

                    </div>
                  )}


                  {course.duration && (
                    <div className="course-meta-item">

                      <Clock3 size={15} />

                      <span>
                        {course.duration}
                      </span>

                    </div>
                  )}


                  {course.startDate && (
                    <div className="course-meta-item">

                      <CalendarDays size={15} />

                      <span>
                        Starts{" "}
                        {new Date(
                          course.startDate
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </span>

                    </div>
                  )}

                </div>


                {/* COURSE TAGS */}

                {course.tags &&
                  course.tags.length > 0 && (

                    <div className="course-tags">

                      {course.tags.map(
                        (tag, index) => (

                          <span
                            key={`${tag}-${index}`}
                          >
                            {tag}
                          </span>

                        )
                      )}

                    </div>

                  )}


                {/* COURSE LINK */}

                <a
                  href={`/courses/${course.id}`}
                  className="course-link"
                >

                  View Course

                  <ArrowUpRight size={18} />

                </a>

              </article>

            );

          })}

        </div>


        {/* =================================================
            VIEW ALL COURSES
        ================================================= */}
{/* =================================================
    VIEW ALL COURSES
================================================= */}

{showViewAll &&
  limit !== null &&
  courses.length > limit && (

    <div className="courses-view-all">

      <a
        href="/courses"
        className="courses-view-all-button"
      >
        View All Courses

        <ArrowUpRight size={18} />

      </a>

    </div>

)}

      </div>

    </section>

  );

}

export default Courses;