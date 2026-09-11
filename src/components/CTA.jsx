import { ArrowRight, Phone } from "lucide-react";

function CTA() {
  return (
    <section className="cta-section" id="contact">
      <div className="container cta-content">

        <div>
          <span className="section-label">
            READY TO START?
          </span>

          <h2>
            Your selection journey
            <br />
            starts today.
          </h2>

          <p>
            Talk to our counsellor and find the right preparation program
            for your target examination.
          </p>
        </div>

        <div className="cta-buttons">

          <a href="tel:+91 94712 68826" className="btn btn-light">
            <Phone size={17} />
            Talk to Us
          </a>

          <a href="#courses" className="btn btn-outline-light">
            Explore Courses
            <ArrowRight size={17} />
          </a>

        </div>

      </div>
    </section>
  );
}

export default CTA;