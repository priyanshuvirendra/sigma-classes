import Navbar from "../components/Navbar";
import YoutubeSection from "../components/YoutubeSection";
import Footer from "../components/Footer";
import SEO from "../components/SEO";
import { Link } from "react-router-dom";



function FreeLearningPage() {
    return (
        <>

        <SEO
    title="Free Learning | SSC, BPSC, Banking & Competitive Exams | Sigma Classes"
    description="Explore free classes, demo lectures, exam tricks, Shorts and playlists from Sigma Classes to support your preparation for SSC, BPSC, Banking, Teacher TRE, TET and other competitive examinations."
    canonical="https://sigmaclassesssm.in/free-learning"
/>
            <Navbar />

            <main className="free-learning-page">

                <div className="free-learning-page-header">

                    <div className="container">

                        <span className="section-label">
                            FREE LEARNING
                        </span>

                        <h1>
                            Learn. Practice.
                            <br />
                            <span>Prepare with Sigma Classes.</span>
                        </h1>
<p>
    Explore free classes, exam tricks, demo lectures,
    Shorts and playlists from Sigma Classes to support
    your competitive exam preparation.
</p>

                    </div>

                </div>


                <YoutubeSection />

                <div className="container">
    <div className="free-learning-course-link">

        <p>
            Looking for a structured preparation program?
        </p>

        <Link
            to="/courses"
            className="free-learning-course-link-button"
        >
            Explore Our Courses
        </Link>

    </div>
</div>

            </main>

            <Footer />
        </>
    );
}

export default FreeLearningPage;