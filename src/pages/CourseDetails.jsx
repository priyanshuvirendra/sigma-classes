import { useEffect, useState } from "react";
import SEO from "../components/SEO";

import {
    ArrowLeft,
    ArrowUpRight,
    CalendarDays,
    CheckCircle2,
    Clock3,
    Clock,
    IndianRupee,
    Users,
    Monitor,
    Loader2,
    FileText,
    PlayCircle,
    ExternalLink,
    Lock,
    Phone,
} from "lucide-react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";


function CourseDetails() {

  const { courseId } = useParams();
  const navigate = useNavigate();


  // =====================================================
  // COURSE STATE
  // =====================================================

  const [course, setCourse] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // =====================================================
  // STUDY MATERIAL STATE
  // =====================================================

  const [materials, setMaterials] = useState([]);

  const [materialsLoading, setMaterialsLoading] =
    useState(false);

  const [materialsMessage, setMaterialsMessage] =
    useState("");

  const [selectedPdf, setSelectedPdf] =
    useState(null);

  const [isStudent, setIsStudent] =
    useState(false);

  const [isEnrolled, setIsEnrolled] =
    useState(false);

  const [enrollmentStatus, setEnrollmentStatus] =
    useState(null);

  const [enrollmentLoading, setEnrollmentLoading] =
    useState(false);

  const [enrollmentMessage, setEnrollmentMessage] =
    useState("");


  // =====================================================
  // FETCH COURSE
  // =====================================================

  useEffect(() => {

    const fetchCourse = async () => {

      try {

        setLoading(true);
        setError("");

        const response = await fetch(
          `https://sigma-classes-backend-ajkh.onrender.com/api/courses/${courseId}`
        );

        if (!response.ok) {

          if (response.status === 404) {

            setError(
              "Course not found."
            );

          } else {

            setError(
              "Unable to load course."
            );

          }

          return;
        }

        const data =
          await response.json();

        setCourse(data);

      } catch (err) {

        console.error(
          "Course error:",
          err
        );

        setError(
          "Unable to connect to the server."
        );

      } finally {

        setLoading(false);

      }

    };

    fetchCourse();

  }, [courseId]);


  // =====================================================
  // FETCH STUDY MATERIALS
  // =====================================================

  useEffect(() => {

    const fetchMaterials = async () => {

      const token =
        localStorage.getItem(
          "studentToken"
        );


      // -------------------------------------------------
      // STUDENT NOT LOGGED IN
      // -------------------------------------------------

      if (!token) {

        setIsStudent(false);
        setIsEnrolled(false);
        setEnrollmentStatus(null);
        setMaterials([]);

        return;
      }


      setIsStudent(true);
      setMaterialsLoading(true);
      setMaterialsMessage("");


      // -------------------------------------------------
      // GET CURRENT ENROLLMENT STATUS
      // -------------------------------------------------

      try {

        const enrollmentResponse =
          await fetch(
            "https://sigma-classes-backend-ajkh.onrender.com/api/student/enrollments",
            {
              method: "GET",
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );


        if (enrollmentResponse.ok) {

          const enrollmentData =
            await enrollmentResponse.json();

          const currentEnrollment =
            Array.isArray(enrollmentData)
              ? enrollmentData.find(
                (enrollment) =>
                  String(
                    enrollment.course?.id
                  ) === String(courseId)
              )
              : null;


          if (currentEnrollment) {

            setEnrollmentStatus(
              currentEnrollment.status
            );

          } else {

            setEnrollmentStatus(null);

          }

        }

      } catch (error) {

        console.error(
          "Enrollment status error:",
          error
        );

      }


      // -------------------------------------------------
      // GET STUDY MATERIALS
      // -------------------------------------------------

      try {

        const response =
          await fetch(
            `https://sigma-classes-backend-ajkh.onrender.com/api/student/materials/course/${courseId}`,
            {
              method: "GET",

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );


        // -------------------------------------------------
        // NOT ENROLLED / INACTIVE ENROLLMENT
        // -------------------------------------------------

        if (response.status === 403) {

          const message =
            await response.text();

          setIsEnrolled(false);

          setMaterials([]);

          if (
            message
              .toLowerCase()
              .includes("not active")
          ) {

            setMaterialsMessage(
              "Your enrollment is currently inactive. Please contact the administration to restore access."
            );

          } else {

            setMaterialsMessage(
              "You need to be enrolled in this course to access the study materials."
            );

          }

          return;
        }


        // -------------------------------------------------
        // AUTHENTICATION FAILED
        // -------------------------------------------------

        if (response.status === 401) {

          localStorage.removeItem(
            "studentToken"
          );

          localStorage.removeItem(
            "studentEmail"
          );

          localStorage.removeItem(
            "studentName"
          );

          setIsStudent(false);
          setIsEnrolled(false);
          setEnrollmentStatus(null);

          setMaterials([]);

          setMaterialsMessage(
            "Your student session has expired. Please login again."
          );

          return;
        }


        // -------------------------------------------------
        // OTHER ERROR
        // -------------------------------------------------

        if (!response.ok) {

          throw new Error(
            "Unable to load study materials."
          );

        }


        const data =
          await response.json();

        setMaterials(
          Array.isArray(data)
            ? data
            : []
        );

        setIsEnrolled(true);

      } catch (err) {

        console.error(
          "Study materials error:",
          err
        );

        setMaterialsMessage(
          "Unable to load study materials."
        );

      } finally {

        setMaterialsLoading(false);

      }

    };

    fetchMaterials();

  }, [courseId]);


  // =====================================================
  // REQUEST ENROLLMENT
  // =====================================================

  const handleEnrollmentRequest = async () => {

    const token =
      localStorage.getItem("studentToken");


    if (!token) {

      navigate("/student/login");

      return;
    }


    try {

      setEnrollmentLoading(true);
      setEnrollmentMessage("");


      const response =
        await fetch(
          `https://sigma-classes-backend-ajkh.onrender.com/api/student/enroll/${courseId}`,
          {
            method: "POST",

            headers: {
              Authorization:
                `Bearer ${token}`,

              "Content-Type":
                "application/json",
            },
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data?.message ||
          "Unable to submit enrollment request."
        );

      }


      setEnrollmentStatus(
        data.status ||
        "PENDING"
      );


      setEnrollmentMessage(
        "Your enrollment request has been submitted. Please wait for admin approval."
      );


    } catch (error) {

      console.error(
        "Enrollment request error:",
        error
      );


      setEnrollmentMessage(
        error.message ||
        "Unable to submit enrollment request."
      );


    } finally {

      setEnrollmentLoading(false);

    }

  };


  // =====================================================
  // LOADING COURSE
  // =====================================================

  if (loading) {

    return (

      <main className="course-details-page">

        <div className="container">

          <div className="course-details-loading">

            <Loader2
              size={28}
              className="course-loading-icon"
            />

            <p>
              Loading course...
            </p>

          </div>

        </div>

      </main>

    );

  }


  // =====================================================
  // COURSE ERROR
  // =====================================================

  if (error || !course) {

    return (

      <main className="course-details-page">

        <div className="container">

          <div className="course-not-found">

            <span className="section-label">
              COURSE
            </span>

            <h1>
              Course not found
            </h1>

            <p>
              {error ||
                "The course you are looking for does not exist."}
            </p>

            <Link
              to="/courses"
              className="btn btn-primary"
            >
              Back to Courses
            </Link>

          </div>

        </div>

      </main>

    );

  }


  // =====================================================
  // SEO DATA
  // =====================================================

  const courseName =
    course.name ||
    "Competitive Exam Course";

  const category =
    course.category ||
    "Competitive Exams";
  const courseDescription =
    course.description ||
    `${courseName} is a ${category} preparation course offered by Sigma Classes in Sasaram, Bihar. The course is designed to help students prepare systematically through structured classes, study materials, regular practice and guidance.`;

  const seoTitle =
    `${courseName} | ${category} Coaching in Sasaram | Sigma Classes`;
  const courseStructuredData = {
    "@context": "https://schema.org",
    "@type": "Course",

    "name": courseName,

    "description": courseDescription,

    "url":
      `https://sigmaclassesssm.in/courses/${courseId}`,

    "provider": {
      "@type": "EducationalOrganization",
      "name": "Sigma Classes",
      "url": "https://sigmaclassesssm.in/"
    },

    ...(course.category && {
      "coursePrerequisites":
        `${course.category} examination preparation`
    }),

    ...(course.faculty &&
      course.faculty.length > 0 && {
      "instructor":
        course.faculty.map((teacher) => ({
          "@type": "Person",
          "name": teacher
        }))
    }),

    ...(course.price !== null &&
      course.price !== undefined && {
      "offers": {
        "@type": "Offer",
        "price":
          Number(course.price).toFixed(2),
        "priceCurrency": "INR",
        "url":
          `https://sigmaclassesssm.in/courses/${courseId}`
      }
    })
  };

  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://sigmaclassesssm.in/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Courses",
        "item": "https://sigmaclassesssm.in/courses"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": courseName,
        "item":
          `https://sigmaclassesssm.in/courses/${courseId}`
      }
    ]
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formattedStartDate =
    course.startDate
      ? new Date(
        `${course.startDate}T00:00:00`
      ).toLocaleDateString(
        "en-IN",
        {
          day: "numeric",
          month: "long",
          year: "numeric",
        }
      )
      : "To be announced";


  // =====================================================
  // FORMAT PRICE
  // =====================================================

  const formattedPrice =
    course.price !== null &&
      course.price !== undefined
      ? Number(
        course.price
      ).toLocaleString(
        "en-IN"
      )
      : "Contact us";


  // =====================================================
  // WHATSAPP
  // =====================================================

  const whatsappMessage =
    `Hello, I want to enquire about the ${course.name} course.`;


  // =====================================================
  // GOOGLE DRIVE PDF EMBED URL
  // =====================================================

  const getGoogleDriveEmbedUrl = (url) => {

    if (!url) {
      return null;
    }


    try {

      const cleanUrl =
        url.trim();


      // -----------------------------------------------
      // GOOGLE DRIVE FILE URL
      // -----------------------------------------------

      const match =
        cleanUrl.match(
          /drive\.google\.com\/file\/d\/([^/]+)/
        );


      if (
        match &&
        match[1]
      ) {

        return (
          `https://drive.google.com/file/d/${match[1]}/preview`
        );

      }


      // -----------------------------------------------
      // GOOGLE DRIVE DIRECT URL
      // -----------------------------------------------

      if (
        cleanUrl.includes(
          "drive.google.com"
        )
      ) {

        return cleanUrl.replace(
          "/view",
          "/preview"
        );

      }

    } catch (error) {

      console.error(
        "Invalid Google Drive URL:",
        error
      );

    }


    return null;

  };


  // =====================================================
  // YOUTUBE EMBED URL
  // =====================================================

  const getYouTubeEmbedUrl = (url) => {

    if (!url) {
      return null;
    }


    try {

      const cleanUrl =
        url.trim();


      // -----------------------------------------------
      // ALREADY AN EMBED URL
      // -----------------------------------------------

      if (
        cleanUrl.includes(
          "youtube.com/embed/"
        )
      ) {

        return cleanUrl;

      }


      const parsedUrl =
        new URL(cleanUrl);


      // -----------------------------------------------
      // youtube.com/watch?v=VIDEO_ID
      // -----------------------------------------------

      if (
        parsedUrl.hostname.includes(
          "youtube.com"
        ) &&
        parsedUrl.searchParams.has("v")
      ) {

        const videoId =
          parsedUrl.searchParams.get(
            "v"
          );


        if (videoId) {

          return (
            `https://www.youtube.com/embed/${videoId}`
          );

        }

      }


      // -----------------------------------------------
      // youtu.be/VIDEO_ID
      // -----------------------------------------------

      if (
        parsedUrl.hostname ===
        "youtu.be"
      ) {

        const videoId =
          parsedUrl.pathname
            .replace("/", "")
            .trim();


        if (videoId) {

          return (
            `https://www.youtube.com/embed/${videoId}`
          );

        }

      }


      // -----------------------------------------------
      // youtube.com/shorts/VIDEO_ID
      // -----------------------------------------------

      if (
        parsedUrl.hostname.includes(
          "youtube.com"
        ) &&
        parsedUrl.pathname.startsWith(
          "/shorts/"
        )
      ) {

        const videoId =
          parsedUrl.pathname
            .split("/shorts/")[1]
            .split("/")[0];


        if (videoId) {

          return (
            `https://www.youtube.com/embed/${videoId}`
          );

        }

      }

    } catch (error) {

      console.error(
        "Invalid YouTube URL:",
        url,
        error
      );

    }


    return null;

  };


  // =====================================================
  // MATERIAL ICON
  // =====================================================

  const getMaterialIcon = (type) => {

    const materialType =
      type?.toUpperCase();


    if (
      materialType === "VIDEO"
    ) {

      return (
        <PlayCircle
          size={22}
        />
      );

    }


    if (
      materialType === "PDF"
    ) {

      return (
        <FileText
          size={22}
        />
      );

    }


    return (
      <ExternalLink
        size={22}
      />
    );

  };


  // =====================================================
  // MAIN RETURN
  // =====================================================

  return (

    <>

      {/* =================================================
                SEO
            ================================================= */}
      <SEO
        title={seoTitle}
        description={courseDescription}
        canonical={
          `https://sigmaclassesssm.in/courses/${courseId}`
        }
        structuredData={[
          courseStructuredData,
          breadcrumbStructuredData
        ]}
      />


      <main className="course-details-page">


        {/* =================================================
                    COURSE HERO
                ================================================= */}

        <section className="course-details-hero">

          <div className="container">


            <nav
              className="course-breadcrumbs"
              aria-label="Breadcrumb"
            >
              <Link to="/">
                Home
              </Link>

              <span>/</span>

              <Link to="/courses">
                Courses
              </Link>

              <span>/</span>

              <span aria-current="page">
                {courseName}
              </span>
            </nav>

            <Link
              to="/courses"
              className="back-link"
            >

              <ArrowLeft
                size={17}
              />

              Back to Courses

            </Link>


            <span className="section-label">

              {course.category ||
                "COURSE"}

            </span>


            <h1>
              {course.name}
            </h1>


            <p>
              {course.description}
            </p>

          </div>

        </section>
        {/* =================================================
    COURSE OVERVIEW TEXT
================================================= */}

        <section className="section course-seo-overview">

          <div className="container">

            <div className="detail-block">

              <span className="section-label">
                ABOUT THIS COURSE
              </span>

              <h2>
                Prepare for {courseName}
                <br />
                <span>with Sigma Classes.</span>
              </h2>

              <p>
                {courseDescription}
              </p>

              {course.tags &&
                course.tags.length > 0 && (

                  <div className="course-seo-tags">

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

            </div>

          </div>

        </section>

        {/* =================================================
                    COURSE INFORMATION
                ================================================= */}

        <section className="section">

          <div className="container">


            {/* =================================================
                            COURSE OVERVIEW
                        ================================================= */}

            <div className="course-overview">


              {/* FEE */}

              <div className="overview-item">

                <IndianRupee
                  size={22}
                />

                <div>

                  <span>
                    Course Fee
                  </span>

                  <strong>

                    {course.price !== null &&
                      course.price !== undefined
                      ? `₹${formattedPrice}`
                      : "Contact us"}

                  </strong>

                </div>

              </div>


              {/* START DATE */}

              <div className="overview-item">

                <CalendarDays
                  size={22}
                />

                <div>

                  <span>
                    Starting Date
                  </span>

                  <strong>
                    {formattedStartDate}
                  </strong>

                </div>

              </div>


              {/* DURATION */}

              <div className="overview-item">

                <Clock3
                  size={22}
                />

                <div>

                  <span>
                    Duration
                  </span>

                  <strong>

                    {course.duration ||
                      "To be announced"}

                  </strong>

                </div>

              </div>


              {/* CLASS TIMING */}

              <div className="overview-item">

                <Clock
                  size={22}
                />

                <div>

                  <span>
                    Class Timing
                  </span>

                  <strong>
                    {course.timing ||
                      "Contact us"}
                  </strong>

                </div>

              </div>


              {/* MODE */}

              <div className="overview-item">

                <Monitor
                  size={22}
                />

                <div>

                  <span>
                    Mode
                  </span>

                  <strong>

                    {course.mode ||
                      "To be announced"}

                  </strong>

                </div>

              </div>

            </div>


            {/* =================================================
                            CURRICULUM + FACULTY
                        ================================================= */}

            <div className="course-detail-grid">


              {/* =================================================
                                CURRICULUM
                            ================================================= */}

              <div className="detail-block">

                <span className="section-label">
                  CURRICULUM
                </span>


                <h2>

                  What you'll
                  <br />

                  <span>
                    learn.
                  </span>

                </h2>


                {course.curriculum &&
                  course.curriculum.length > 0 ? (

                  <div className="curriculum-list">

                    {course.curriculum.map(
                      (item, index) => (

                        <div
                          key={`${item}-${index}`}
                        >

                          <CheckCircle2
                            size={18}
                          />

                          <span>
                            {item}
                          </span>

                        </div>

                      )
                    )}

                  </div>

                ) : (

                  <p className="course-empty-content">

                    Curriculum will be
                    updated soon.

                  </p>

                )}

              </div>


              {/* =================================================
                                FACULTY
                            ================================================= */}

              <div className="detail-block">

                <span className="section-label">
                  FACULTY
                </span>


                <h2>

                  Learn from
                  <br />

                  <span>
                    experienced teachers.
                  </span>

                </h2>


                {course.faculty &&
                  course.faculty.length > 0 ? (

                  <div className="faculty-course-list">

                    {course.faculty.map(
                      (teacher, index) => (

                        <div
                          key={`${teacher}-${index}`}
                        >

                          <Users
                            size={18}
                          />

                          <span>
                            {teacher}
                          </span>

                        </div>

                      )
                    )}

                  </div>

                ) : (

                  <p className="course-empty-content">

                    Faculty information
                    will be updated soon.

                  </p>

                )}

              </div>

            </div>


            {/* =================================================
                            WHAT'S INCLUDED
                        ================================================= */}

            <div className="course-includes">

              <span className="section-label">
                WHAT'S INCLUDED
              </span>


              {course.features &&
                course.features.length > 0 ? (

                <div className="includes-grid">

                  {course.features.map(
                    (feature, index) => (

                      <div
                        key={`${feature}-${index}`}
                      >

                        <CheckCircle2
                          size={18}
                        />

                        <span>
                          {feature}
                        </span>

                      </div>

                    )
                  )}

                </div>

              ) : (

                <p className="course-empty-content">

                  Course features will be
                  updated soon.

                </p>

              )}

            </div>


            {/* =================================================
                            STUDY MATERIALS
                        ================================================= */}

            {isStudent && (

              <section className="course-study-materials">


                {/* =================================================
                                    MATERIALS HEADER
                                ================================================= */}

                <div className="course-materials-heading">

                  <div>

                    <span className="section-label">
                      STUDY MATERIALS
                    </span>


                    <h2>
                      Your course resources.
                    </h2>


                    <p>
                      Access notes, lectures
                      and other resources
                      provided for this course.
                    </p>

                  </div>

                </div>


                {/* =================================================
                                    MATERIALS LOADING
                                ================================================= */}

                {materialsLoading ? (

                  <div className="course-materials-loading">

                    <Loader2
                      size={24}
                      className="course-loading-icon"
                    />

                    <p>
                      Loading study materials...
                    </p>

                  </div>


                ) : !isEnrolled ? (

                  /* =================================================
                     NOT ENROLLED
                  ================================================= */

                  <div className="course-materials-locked">

                    <div className="course-material-lock-icon">

                      <Lock
                        size={24}
                      />

                    </div>


                    <div>

                      <h3>
                        Study materials are
                        available to enrolled
                        students.
                      </h3>


                      <p>

                        {materialsMessage ||
                          "Enroll in this course to access the study materials."}

                      </p>

                    </div>

                  </div>


                ) : materials.length === 0 ? (

                  /* =================================================
                     NO MATERIALS
                  ================================================= */

                  <div className="course-materials-empty">

                    <FileText
                      size={24}
                    />

                    <p>
                      No study materials
                      have been published
                      for this course yet.
                    </p>

                  </div>


                ) : (

                  /* =================================================
                     MATERIAL LIST
                  ================================================= */

                  <div className="course-materials-list">

                    {materials.map(
                      (material) => (

                        <article
                          className="course-material-card"
                          key={material.id}
                        >


                          {/* =================================================
                                                        MATERIAL ICON
                                                    ================================================= */}

                          <div className="course-material-icon">

                            {getMaterialIcon(
                              material.type
                            )}

                          </div>


                          <div className="course-material-content">


                            {/* =================================================
                                                            MATERIAL TYPE + SUBJECT
                                                        ================================================= */}

                            <div className="course-material-top">

                              <span className="course-material-type">

                                {material.type}

                              </span>


                              {material.subject && (

                                <span className="course-material-subject">

                                  {material.subject}

                                </span>

                              )}

                            </div>


                            {/* =================================================
                                                            TITLE
                                                        ================================================= */}

                            <h3>
                              {material.title}
                            </h3>


                            {/* =================================================
                                                            DESCRIPTION
                                                        ================================================= */}

                            {material.description && (

                              <p>
                                {material.description}
                              </p>

                            )}


                            {/* =================================================
                                                            VIDEO
                                                        ================================================= */}

                            {material.type?.toUpperCase() ===
                              "VIDEO" ? (

                              <div className="course-material-video">

                                {getYouTubeEmbedUrl(
                                  material.url
                                ) ? (

                                  <div className="course-video-wrapper">

                                    <iframe
                                      src={getYouTubeEmbedUrl(
                                        material.url
                                      )}
                                      title={
                                        material.title
                                      }
                                      loading="lazy"
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                      allowFullScreen
                                    />

                                  </div>

                                ) : (

                                  <a
                                    href={
                                      material.url
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                    className="course-material-link"
                                  >

                                    Watch Video

                                    <ExternalLink
                                      size={17}
                                    />

                                  </a>

                                )}

                              </div>


                            ) : material.type?.toUpperCase() ===
                              "PDF" ? (

                              /* =================================================
                                 PDF
                              ================================================= */

                              <div className="course-material-pdf">

                                <button
                                  type="button"
                                  className="course-material-link"
                                  onClick={() =>
                                    setSelectedPdf(
                                      material
                                    )
                                  }
                                >

                                  View PDF

                                  <ExternalLink
                                    size={17}
                                  />

                                </button>

                              </div>


                            ) : (

                              /* =================================================
                                 EXTERNAL RESOURCE
                              ================================================= */

                              <a
                                href={
                                  material.url
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="course-material-link"
                              >

                                Open Resource

                                <ExternalLink
                                  size={17}
                                />

                              </a>

                            )}

                          </div>

                        </article>

                      )
                    )}

                  </div>

                )}

              </section>

            )}

            {/* =================================================
    FREE LEARNING INTERNAL LINK
================================================= */}

            <div className="course-free-learning">
              <p>
                Looking for additional preparation resources?
              </p>

              <Link
                to="/free-learning"
                className="course-free-learning-link"
              >
                Explore Free Learning
                <ArrowUpRight size={17} />
              </Link>
            </div>



            {/* =================================================
                            ENROLLMENT CTA
                        ================================================= */}

            <div className="course-enroll">

              <div>

                <span className="section-label">
                  READY TO START?
                </span>


                <h2>
                  Start your preparation
                  today.
                </h2>


                <p>
                  Talk to our counsellor
                  for admission details.
                </p>

              </div>


              <div className="course-enroll-actions">


                {/* =================================================
                                    STUDENT LOGIN / ENROLL
                                ================================================= */}

                {!isStudent && (

                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() =>
                      navigate(
                        "/student/login",
                        {
                          state: {
                            from:
                              `/courses/${courseId}`,
                          },
                        }
                      )
                    }
                  >
                    Enroll Now
                  </button>

                )}


                {/* =================================================
                                    REQUEST ENROLLMENT
                                ================================================= */}

                {isStudent &&
                  !enrollmentStatus && (

                    <button
                      type="button"
                      className="btn btn-light"
                      onClick={
                        handleEnrollmentRequest
                      }
                      disabled={
                        enrollmentLoading
                      }
                    >

                      {enrollmentLoading
                        ? "Submitting..."
                        : "Request Enrollment"}

                    </button>

                  )}


                {/* =================================================
                                    PENDING
                                ================================================= */}

                {isStudent &&
                  enrollmentStatus ===
                  "PENDING" && (

                    <div className="enrollment-status-message">

                      Enrollment request pending
                      admin approval.

                    </div>

                  )}


                {/* =================================================
                                    ACTIVE
                                ================================================= */}

                {isStudent &&
                  enrollmentStatus ===
                  "ACTIVE" && (

                    <div className="enrollment-status-message">

                      ✓ You are enrolled in this course.

                    </div>

                  )}


                {/* =================================================
                                    INACTIVE / COMPLETED / CANCELLED
                                ================================================= */}

                {isStudent &&
                  [
                    "INACTIVE",
                    "COMPLETED",
                    "CANCELLED",
                  ].includes(
                    enrollmentStatus
                  ) && (

                    <button
                      type="button"
                      className="btn btn-light"
                      onClick={
                        handleEnrollmentRequest
                      }
                      disabled={
                        enrollmentLoading
                      }
                    >

                      {enrollmentLoading
                        ? "Submitting..."
                        : "Request Enrollment Again"}

                    </button>

                  )}


                {/* =================================================
                                    REQUEST A CALL
                                ================================================= */}

                <a
                  href="tel:+919471268826"
                  className="btn btn-light"
                >

                  <Phone
                    size={17}
                  />

                  Talk to Us

                </a>


                {/* =================================================
                                    WHATSAPP
                                ================================================= */}

                <a
                  href={`https://wa.me/9471268826?text=${encodeURIComponent(
                    whatsappMessage
                  )}`}
                  className="btn btn-outline-light"
                  target="_blank"
                  rel="noreferrer"
                >

                  Enquire on WhatsApp

                </a>

              </div>


              {enrollmentMessage && (

                <p className="enrollment-request-message">

                  {enrollmentMessage}

                </p>

              )}

            </div>

          </div>

        </section>


        {/* =====================================================
                    PDF VIEWER MODAL
                ===================================================== */}

        {selectedPdf && (

          <div
            className="course-pdf-modal"
            onClick={() =>
              setSelectedPdf(null)
            }
          >

            <div
              className="course-pdf-modal-content"
              onClick={(event) =>
                event.stopPropagation()
              }
            >


              {/* =================================================
                                MODAL HEADER
                            ================================================= */}

              <div className="course-pdf-modal-header">

                <div>

                  <span className="section-label">
                    PDF
                  </span>


                  <h3>
                    {selectedPdf.title}
                  </h3>

                </div>


                <button
                  type="button"
                  className="course-pdf-modal-close"
                  onClick={() =>
                    setSelectedPdf(null)
                  }
                  aria-label="Close PDF"
                >
                  ×
                </button>

              </div>


              {/* =================================================
                                PDF VIEWER
                            ================================================= */}

              <div className="course-pdf-modal-viewer">

                {getGoogleDriveEmbedUrl(
                  selectedPdf.url
                ) ? (

                  <iframe
                    src={getGoogleDriveEmbedUrl(
                      selectedPdf.url
                    )}
                    title={
                      selectedPdf.title
                    }
                    allow="autoplay"
                  />

                ) : (

                  <div className="course-pdf-modal-error">

                    <p>
                      Unable to display this PDF.
                    </p>


                    <a
                      href={
                        selectedPdf.url
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="course-material-link"
                    >

                      Open PDF

                      <ExternalLink
                        size={17}
                      />

                    </a>

                  </div>

                )}

              </div>

            </div>

          </div>

        )}

      </main>

    </>

  );

}


export default CourseDetails;