
import { useEffect, useState } from "react";

import {
  ArrowRight,
  Phone,
  Users,
  Trophy,
  BookOpen,
  MapPin,
  CalendarDays,
} from "lucide-react";

import sigmaLogo from "../assets/sigma-logo.png";
import founderImage from "../assets/founder.png";

function Hero() {
  const exams = [
    { name: "BPSC", type: "bpsc" },
    { name: "SSC", type: "ssc" },
    { name: "BANKING", type: "banking" },
    { name: "TEACHER TRE", type: "teacher" },
    { name: "TET", type: "tet" },
  ];

  return (
    <section className="sigma-hero">

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="sigma-hero-background">

        <div className="sigma-bg-red-glow"></div>

        <div className="sigma-bg-gold-glow"></div>

        <div className="sigma-bg-diagonal"></div>

        <div className="sigma-bg-books">
          <div className="sigma-book sigma-book-1"></div>
          <div className="sigma-book sigma-book-2"></div>
          <div className="sigma-book sigma-book-3"></div>

          <div className="sigma-desk"></div>
        </div>

        <div className="sigma-bg-grid"></div>

      </div>


      {/* =====================================================
          HERO CONTENT
      ===================================================== */}

      <div className="sigma-hero-content">

      
        {/* MAIN AREA */}
        <div className="sigma-hero-main">


    


          {/* =================================================
              LEFT
          ================================================= */}

          <div className="sigma-hero-left">

            <div className="sigma-hero-eyebrow">
              <span></span>
              SASARAM'S TRUSTED COMPETITIVE EXAM COACHING
            </div>


            <h1 className="sigma-hero-title">
              Prepare with
              <span className="red-text"> Experience.</span>

              <br />

              Achieve with
              <span className="gold-text"> Confidence.</span>
            </h1>


            <p className="sigma-hero-description">
              Focused preparation for BPSC, SSC, Banking, Teacher TRE,
              TET and other competitive examinations — guided by
              experienced faculty and built around disciplined,
              classroom learning.
            </p>


            {/* EXAMS */}
            <div className="sigma-exam-section">

              <span className="sigma-exam-label">
                PREPARATION FOR
              </span>

              <div className="sigma-exam-list">

                {exams.map((exam) => (
                  <div
                    className={`sigma-exam-pill ${exam.type}`}
                    key={exam.name}
                  >

                    <span className="sigma-exam-icon">
                      {exam.type === "bpsc" && "B"}
                      {exam.type === "ssc" && "S"}
                      {exam.type === "banking" && "₹"}
                      {exam.type === "teacher" && "T"}
                      {exam.type === "tet" && "T"}
                    </span>

                    <span>{exam.name}</span>

                  </div>
                ))}

              </div>

            </div>


            {/* BUTTONS */}
            <div className="sigma-hero-buttons">

              <a
                href="/courses"
                className="sigma-primary-button"
              >
                Explore Courses
                <ArrowRight size={20} />
              </a>


              <a
                href="tel:+91 94712 68826" 

                className="sigma-secondary-button"
              >
                <Phone size={17} />
                Talk to Us
              </a>

            </div>


            {/* TRUST POINTS */}
            <div className="sigma-trust-row">

              <div className="sigma-trust-point">
                <Users size={22} />
                <span>
                  Experienced
                  <br />
                  Faculty
                </span>
              </div>

              <div className="sigma-trust-separator"></div>

              <div className="sigma-trust-point">
                <BookOpen size={22} />
                <span>
                  Focused Classroom
                  <br />
                  Preparation
                </span>
              </div>

              <div className="sigma-trust-separator"></div>

              <div className="sigma-trust-point">
                <Trophy size={22} />
                <span>
                  Proven
                  <br />
                  Results
                </span>
              </div>

            </div>

          </div>


          {/* =================================================
              RIGHT
          ================================================= */}

          <div className="sigma-hero-right">

            {/* LARGE SIGMA BACKDROP */}
            <div className="sigma-right-mark">
              Σ
            </div>


            {/* BRAND MARK */}
            <div className="sigma-right-brand">

              <div className="sigma-right-symbol">
                Σ
              </div>

              <strong>SIGMA CLASSES</strong>

              <span>SASARAM • BIHAR</span>

              <div className="sigma-brand-rule">
                <span></span>
                <small>Competitive Exam Preparation</small>
                <span></span>
              </div>

            </div>


            {/* FOUNDER IMAGE */}
            <div className="sigma-founder-wrap">

              <div className="sigma-founder-red-light"></div>

              <img
                src={founderImage}
                alt="Director and CEO of Sigma Classes"
                className="sigma-founder"
              />

            </div>


            {/* EXPERIENCE CARD */}
            <div className="sigma-proof-card">

              <div className="sigma-proof-years">

                <div className="sigma-proof-small-title">
                  ESTABLISHED EXPERIENCE
                </div>

                <div className="sigma-years">
                  15<span>+</span>
                  <small>YEARS</small>
                </div>

                <div className="sigma-years-label">
                  TEACHING EXPERIENCE
                </div>

              </div>


              <div className="sigma-card-line"></div>


              <div className="sigma-proof-stats">

                <div className="sigma-proof-stat">

                  <Users size={29} />

                  <strong>1,000+</strong>

                  <span>Students Guided</span>

                </div>


                <div className="sigma-proof-stat">

                  <Trophy size={29} />

                  <strong>100+</strong>

                  <span>Selections</span>

                </div>

              </div>

            </div>


            {/* FOUNDER SIGNATURE */}
            <div className="sigma-founder-caption">

              <div className="sigma-signature">
                Akhauri Sudhanshu
                <br />
                Srivastava
              </div>

              <div className="sigma-signature-line"></div>

              <strong>Director &amp; CEO</strong>

              <span>
                EX FACULTY DACE, B.H.U &amp; RAU, Varanasi
              </span>

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          FULL WIDTH BOTTOM BAR
      ===================================================== */}

      <div className="sigma-hero-bottom">

        <div className="sigma-bottom-inner">

          <div className="sigma-bottom-item">

            <div className="sigma-bottom-icon red">
              <Users size={28} />
            </div>

            <div>
              <strong>1,000+</strong>
              <span>Students Guided</span>
            </div>

          </div>


          <div className="sigma-bottom-divider"></div>


          <div className="sigma-bottom-item">

            <div className="sigma-bottom-icon gold">
              <Trophy size={28} />
            </div>

            <div>
              <strong>100+</strong>
              <span>
                Selections Across
                <br />
                Competitive Exams
              </span>
            </div>

          </div>


          <div className="sigma-bottom-divider"></div>


          <div className="sigma-bottom-item">

            <div className="sigma-bottom-icon red">
              <CalendarDays size={28} />
            </div>

            <div>
              <strong>15+</strong>
              <span>Years Teaching Experience</span>
            </div>

          </div>


          <div className="sigma-bottom-divider"></div>


          <div className="sigma-bottom-location">

            <div className="sigma-bottom-icon red">
              <MapPin size={28} />
            </div>

            <div>
              <strong>SASARAM, BIHAR</strong>
              <span>Your Success, Our Commitment.</span>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Hero;