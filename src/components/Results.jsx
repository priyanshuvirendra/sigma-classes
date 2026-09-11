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
              Hard work that
              <br />
              <span>gets results.</span>
            </h2>
          </div>

          <div className="result-highlight">
            <Trophy size={23} />

            <div>
              <strong>100+</strong>
              <span>Selections across competitive exams</span>
            </div>
          </div>

        </div>

        <div className="results-grid">

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

          <div className="result-card">
            <div className="result-photo">
              <Trophy size={28} />
            </div>

            <div className="result-info">
              <span>EXAM PREPARATION</span>
              <h3>SSC • BANKING</h3>
              <strong>Successful preparation</strong>
            </div>
          </div>

          <div className="result-card">
            <div className="result-photo">
              <Trophy size={28} />
            </div>

            <div className="result-info">
              <span>TEACHER EXAMS</span>
              <h3>TRE • TET</h3>
              <strong>Focused preparation</strong>
            </div>
          </div>

          <div className="result-card">
            <div className="result-photo">
              <Trophy size={28} />
            </div>

            <div className="result-info">
              <span>COMPETITIVE EXAMS</span>
              <h3>BPSC & OTHERS</h3>
              <strong>Exam-oriented guidance</strong>
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