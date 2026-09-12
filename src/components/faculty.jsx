import {
  Award,
  BookOpen,
  Target,
  Clock3,
} from "lucide-react";
import facultyDark from "../assets/faculty-dark.png";
import facultyLight from "../assets/faculty-light.png";
import faculty1 from "../assets/madhu.png";
import facultyManish from "../assets/manish.png";

function Faculty() {
const facultyMembers = [
  {
    name: "Manish Mishra",
    designation: "GS Faculty",
    subject: "General Studies",
    experience: "5+ Years",
    description:
      "Dedicated General Studies faculty focused on building strong conceptual understanding and helping students prepare effectively for competitive examinations.",
    image: facultyManish,
  },
  {
    name: "Madhu Mam",
    designation: "English & Reasoning Faculty",
    subject: "English & Reasoning",
    experience: "3+ Years",
    description:
      "Experienced faculty for English and Reasoning, helping students strengthen their fundamentals, accuracy and problem-solving approach for competitive examinations.",
    image: faculty1,
  },
];
  return (
    <section className="section faculty-section" id="faculty">
      <div className="container">

        {/* =====================================================
            SECTION HEADING
        ===================================================== */}

        <div className="section-heading centered">

          <span className="section-label">
            OUR FACULTY
          </span>

          <h2>
            Learn from an experienced
            <br />
            <span>competitive exam educator.</span>
          </h2>

          <p>
            Strong subject knowledge, years of classroom experience and
            practical guidance focused on competitive examinations.
          </p>

        </div>


        {/* =====================================================
            DIRECTOR / FOUNDER PROFILE
        ===================================================== */}

        <div className="founder-profile">

          {/* PHOTO */}

          <div className="founder-photo">

            <img
              src={facultyLight}
              alt="Akhauri Sudhanshu Srivastava"
              className="founder-photo-light"
            />

            <img
              src={facultyDark}
              alt="Akhauri Sudhanshu Srivastava"
              className="founder-photo-dark"
            />

          </div>


          {/* INFORMATION */}

          <div className="founder-content">

            <span className="founder-eyebrow">
              DIRECTOR & CEO
            </span>

            <h3>
              Akhauri Sudhanshu Srivastava
            </h3>

            <p className="founder-designation">
              Director & CEO
            </p>

            <p className="founder-credential">
              EX FACULTY DACE, B.H.U & RAU, Varanasi
            </p>

            <p className="founder-description">
              With more than 15 years of teaching experience, our director
              brings strong academic knowledge and practical understanding
              of competitive examinations to help aspirants prepare with
              confidence.
            </p>


            {/* HIGHLIGHTS */}

            <div className="founder-highlights">

              <div className="founder-highlight">

                <div className="founder-highlight-icon">
                  <Award size={21} />
                </div>

                <div>
                  <strong>Experience</strong>

                  <span>
                    More than 15 years of teaching
                  </span>
                </div>

              </div>


              <div className="founder-highlight">

                <div className="founder-highlight-icon">
                  <BookOpen size={21} />
                </div>

                <div>
                  <strong>Expertise</strong>

                  <span>
                    Competitive examinations
                  </span>
                </div>

              </div>


              <div className="founder-highlight">

                <div className="founder-highlight-icon">
                  <Target size={21} />
                </div>

                <div>
                  <strong>Subjects</strong>

                  <span>
                    Mathematics, Reasoning & General Science
                  </span>

                </div>

              </div>

            </div>


            {/* QUOTE */}

            <div className="founder-quote">

              <span className="founder-quote-mark">
                “
              </span>

              <p>
                Our goal is to provide quality guidance and build the
                confidence every aspirant needs to succeed in competitive
                examinations.
              </p>

            </div>

          </div>

        </div>


        {/* =====================================================
            OTHER FACULTY
        ===================================================== */}

        <div className="faculty-team">

          <div className="faculty-team-heading">

            <span className="section-label">
              OUR TEACHING TEAM
            </span>

            <h3>
              Meet the faculty behind
              <span> Sigma Classes.</span>
            </h3>

            <p>
              Experienced educators dedicated to focused classroom
              preparation and helping students move towards their goals.
            </p>

          </div>


          {/* FACULTY GRID */}

          <div className="faculty-team-grid">

            {facultyMembers.map((faculty, index) => (

              <article
                className="faculty-card"
                key={index}
              >

                {/* PHOTO */}

                <div className="faculty-card-image">

                  <img
                    src={faculty.image}
                    alt={faculty.name}
                  />

                </div>


                {/* CONTENT */}

                <div className="faculty-card-content">

                  <h4>
                    {faculty.name}
                  </h4>

                  <span className="faculty-card-designation">
                    {faculty.designation}
                  </span>

                  <p className="faculty-card-description">
                    {faculty.description}
                  </p>


                  {/* CARD DIVIDER */}

                  <div className="faculty-card-divider"></div>


                  {/* CARD META */}

                  <div className="faculty-card-meta">

                    <div className="faculty-card-meta-item">

                      <div className="faculty-card-meta-icon">
                        <BookOpen size={20} />
                      </div>

                      <div>
                        <strong>Subject</strong>
                        <span>{faculty.subject}</span>
                      </div>

                    </div>


                    <div className="faculty-card-meta-item">

                      <div className="faculty-card-meta-icon">
                        <Clock3 size={20} />
                      </div>

                      <div>
                        <strong>Experience</strong>
                        <span>{faculty.experience}</span>
                      </div>

                    </div>

                  </div>

                </div>

              </article>

            ))}

          </div>

        </div>

      </div>
    </section>
  );
}

export default Faculty;