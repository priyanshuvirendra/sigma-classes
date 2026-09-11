import Navbar from "../components/Navbar";
import YoutubeSection from "../components/YoutubeSection";
import Footer from "../components/Footer";

function FreeLearningPage() {
    return (
        <>
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
                            Explore free classes, exam tricks, demo
                            lectures, Shorts and playlists from
                            Sigma Classes.
                        </p>

                    </div>

                </div>


                <YoutubeSection />

            </main>

            <Footer />
        </>
    );
}

export default FreeLearningPage;