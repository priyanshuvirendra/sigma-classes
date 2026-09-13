import "./App.css";

import React, { useEffect } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import CourseDetails from "./pages/CourseDetails";
import AdminLogin from "./pages/AdminLogin";
import VerifyEmail from "./pages/VerifyEmail";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import FacultyDashboard from "./pages/FacultyDashboard";
import WhyChooseUs from "./components/WhyChooseUs";
import Courses from "./components/Courses";
import Results from "./components/Results";
import FacultyCourseDetails from "./pages/FacultyCourseDetails";
import Faculty from "./components/faculty";
import YoutubeSection from "./components/YoutubeSection";
import Testimonials from "./components/Testimonials";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import EnquiryForm from "./components/EnquiryForm";
import ResetPassword from "./pages/ResetPassword";
import Admin from "./pages/Admin";
import StudentLogin from "./pages/StudentLogin";
import StudentDashboard from "./pages/StudentDashboard";
import StudentRegister from "./pages/StudentRegister";
import ForgotPassword from "./pages/ForgotPassword";
import CoursesPage from "./pages/CoursesPage";
import AdminAuth from "./components/AdminAuth";
import FreeLearningPage from "./pages/FreeLearningPage";
import FacultyPage from "./pages/Faculty";
import FacultyAuth from "./components/FacultyAuth";
import FacultyCourses from "./pages/FacultyCourses";
import FacultyStudents from "./pages/FacultyStudents";
import FacultyMaterials from "./pages/FacultyMaterials";
import FacultyYoutube from "./pages/FacultyYoutube";
import FacultyProfile from "./pages/FacultyProfile";

function ScrollToHash() {
  const location = useLocation();

  React.useEffect(() => {
    if (!location.hash) return;

    const id = location.hash.substring(1);

    setTimeout(() => {
      const element = document.getElementById(id);

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  }, [location]);

  return null;
}

function Home() {
  return (
    <>
      <Navbar />

      <main>

        {/* HERO */}
        <Hero />

        {/* STATS */}
        <Stats />

        {/* WHY CHOOSE US */}
        <WhyChooseUs />

        {/* COURSES */}
        <Courses limit={3}
        showViewAll={true} />



        {/* FACULTY */}
        <Faculty />

        
        {/* RESULTS */}
        <Results />


        {/* YOUTUBE */}
        <YoutubeSection
  limit={3}
  showViewAll={true}
/>
        {/* TESTIMONIALS */}
        <Testimonials />

        {/* CTA */}
        <CTA />


        {/* =====================================================
            ENQUIRY FORM
        ===================================================== */}

        <section
          className="section enquiry-section"
          id="enquiry"
        >

          <div className="container">

            <div className="enquiry-layout">


              {/* LEFT SIDE */}

              <div className="enquiry-info">

                <span className="section-label">
                  GET IN TOUCH
                </span>

                <h2>
                  Let's build your
                  <br />
                  <span>
                    selection strategy.
                  </span>
                </h2>

                <p>
                  Tell us about your target examination and our
                  counsellor will help you choose the right course
                  and preparation plan.
                </p>


                <div className="enquiry-points">


                  {/* POINT 01 */}

                  <div>

                    <span>
                      01
                    </span>

                    <div>

                      <strong>
                        Tell us your goal
                      </strong>

                      <p>
                        Choose your target examination and course.
                      </p>

                    </div>

                  </div>


                  {/* POINT 02 */}

                  <div>

                    <span>
                      02
                    </span>

                    <div>

                      <strong>
                        Get personalised guidance
                      </strong>

                      <p>
                        Our counsellor will understand your
                        preparation needs.
                      </p>

                    </div>

                  </div>


                  {/* POINT 03 */}

                  <div>

                    <span>
                      03
                    </span>

                    <div>

                      <strong>
                        Start your preparation
                      </strong>

                      <p>
                        Get the right course and begin your journey.
                      </p>

                    </div>

                  </div>

                </div>

              </div>


              {/* RIGHT SIDE */}

              <div className="enquiry-card">

                <div className="enquiry-card-header">

                  <span className="section-label">
                    ENQUIRY FORM
                  </span>

                  <h3>
                    Request a call back
                  </h3>

                  <p>
                    Fill in your details and we'll get in touch.
                  </p>

                </div>

                <EnquiryForm />

              </div>

            </div>

          </div>

        </section>

      </main>


      {/* FOOTER */}

      <Footer />

    </>
  );
}


function App() {
  return (
   <BrowserRouter>

  <ScrollToHash />

  <Routes>

        {/* =====================================================
            HOME PAGE
        ===================================================== */}

        <Route
          path="/"
          element={
            <Home />
          }
        />


       {/* =====================================================
    ALL COURSES PAGE
===================================================== */}

<Route
  path="/courses"
  element={<CoursesPage />}
/>

<Route
  path="/free-learning"
  element={<FreeLearningPage />}
/>

{/* =====================================================
    COURSE DETAILS PAGE
===================================================== */}

<Route
  path="/courses/:courseId"
  element={
    <>
      <Navbar />

      <CourseDetails />

      <Footer />
    </>
  }
/>

<Route
  path="/student/forgot-password"
  element={<ForgotPassword />}
/>

<Route
  path="/student/verify-email"
  element={<VerifyEmail />}
/>

        {/* =====================================================
            ADMIN
        ===================================================== */}

       {/* =====================================================
    ADMIN
===================================================== */}

<Route
  path="/admin"
  element={
    <AdminAuth>
      <Admin />
    </AdminAuth>
  }
/>


<Route
  path="/admin/login"
  element={
    <AdminLogin />
  }
/>

{/* =====================================================
    FACULTY
===================================================== */}


<Route
  path="/faculty"
  element={
    <FacultyAuth>
      <FacultyDashboard />
    </FacultyAuth>
  }
/>

<Route
  path="/faculty/dashboard"
  element={
    <FacultyAuth>
      <FacultyDashboard />
    </FacultyAuth>
  }
/>

<Route
  path="/faculty/courses"
  element={
    <FacultyAuth>
      <FacultyCourses />
    </FacultyAuth>
  }
/>
<Route
  path="/faculty/courses/:courseId"
  element={
    <FacultyAuth>
      <FacultyCourseDetails />
    </FacultyAuth>
  }
/>
<Route
  path="/faculty/students"
  element={
    <FacultyAuth>
      <FacultyStudents />
    </FacultyAuth>
  }
/>

<Route
  path="/faculty/materials"
  element={
    <FacultyAuth>
      <FacultyMaterials />
    </FacultyAuth>
  }
/>

<Route
  path="/faculty/youtube"
  element={
    <FacultyAuth>
      <FacultyYoutube />
    </FacultyAuth>
  }
/>

<Route
  path="/faculty/profile"
  element={
    <FacultyAuth>
      <FacultyProfile />
    </FacultyAuth>
  }
/>
        <Route
          path="/admin/login"
          element={
            <AdminLogin />
          }
        />

<Route
  path="/student/reset-password"
  element={<ResetPassword />}
/>
        {/* =====================================================
            STUDENT REGISTRATION
        ===================================================== */}

        <Route
          path="/student/register"
          element={
            <StudentRegister />
          }
        />


        {/* =====================================================
            STUDENT LOGIN
        ===================================================== */}

        <Route
          path="/student/login"
          element={
            <StudentLogin />
          }
        />


        {/* =====================================================
            STUDENT DASHBOARD
        ===================================================== */}

        <Route
          path="/student/dashboard"
          element={
            <StudentDashboard />
          }
        />

      </Routes>





      {/* =====================================================
          GLOBAL WHATSAPP BUTTON
          Appears on every page
      ===================================================== */}

      <WhatsAppButton />

    </BrowserRouter>
  );
}


export default App;