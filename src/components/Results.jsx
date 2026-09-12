import { ArrowRight, Trophy } from "lucide-react";

function Results() {
  return (
    <section className="section results-section" id="results">
      <div className="container">

        <div className="results-header">

          <div className="section-heading">
            <span className="section-label">
              OUR RESULTS
            </span>

            <h2>
              Results built through
              <br />
              <span>focused preparation.</span>
            </h2>

            <p>
              Consistent guidance, experienced faculty and exam-focused
              preparation designed to help aspirants perform with confidence.
            </p>
          </div>

          <div className="result-highlight">
            <Trophy size={23} />

            <div>
              <strong>100+</strong>
              <span>Selections and counting</span>
            </div>
          </div>

        </div>


        <div className="results-grid">

          {/* SSC & BANKING */}

          <div className="result-card">
            <div className="result-photo">
              <Trophy size={28} />
            </div>

            <div className="result-info">
              <span>SSC & BANKING</span>
              <h3>SSC • Banking</h3>
              <strong>Structured preparation</strong>
            </div>
          </div>


          {/* TEACHER EXAMS */}

          <div className="result-card">
            <div className="result-photo">
              <Trophy size={28} />
            </div>

            <div className="result-info">
              <span>TEACHER EXAMS</span>
              <h3>TRE • TET</h3>
              <strong>Focused exam preparation</strong>
            </div>
          </div>


          {/* BPSC */}

          <div className="result-card">
            <div className="result-photo">
              <Trophy size={28} />
            </div>

            <div className="result-info">
              <span>STATE COMPETITIVE EXAMS</span>
              <h3>BPSC & OTHERS</h3>
              <strong>Exam-oriented guidance</strong>
            </div>
          </div>


          {/* GENERAL COMPETITIVE EXAMS */}

          <div className="result-card">
            <div className="result-photo">
              <Trophy size={28} />
            </div>

            <div className="result-info">
              <span>COMPETITIVE EXAMS</span>
              <h3>100+ Selections</h3>
              <strong>And counting</strong>
            </div>
          </div>

        </div>


        <a href="#enquiry" className="text-link">
          Enquire about our courses
          <ArrowRight size={16} />
        </a>

      </div>
    </section>
  );
}

export default Results;