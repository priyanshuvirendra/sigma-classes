import Navbar from "../components/Navbar";
import Courses from "../components/Courses";
import Footer from "../components/Footer";

function CoursesPage() {
  return (
    <>
      <Navbar />

      <main className="courses-page">

        <div className="courses-page-header">

          <div className="container">

            <span className="section-label">
              ALL COURSES
            </span>

            <h1>
              Find the right preparation
              <br />
              <span>for your examination.</span>
            </h1>

            <p>
              Explore all the courses offered by Sigma Classes
              and choose the preparation path that matches
              your target examination.
            </p>

          </div>

        </div>


        <Courses />

      </main>

      <Footer />
    </>
  );
}

export default CoursesPage;