import Navbar from "../components/Navbar";
import Courses from "../components/Courses";
import Footer from "../components/Footer";
import SEO from "../components/SEO";

function CoursesPage() {
    return (
        <>
            <SEO
                title="Courses | SSC, BPSC, Banking & Competitive Exam Coaching | Sigma Classes"
                description="Explore courses at Sigma Classes, Sasaram for SSC, BPSC, Banking, Teacher TRE, TET and other competitive exams. Find the right preparation program for your target examination."
                canonical="https://sigmaclassesssm.in/courses"
            />

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
                            <span>
                                for your examination.
                            </span>
                        </h1>

                        <p>
                            Explore all the courses offered by
                            Sigma Classes and choose the
                            preparation path that matches
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