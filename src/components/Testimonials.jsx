import { Quote } from "lucide-react";

function Testimonials() {
  const testimonials = [
    {
      name: "Ankit Sharma",
      exam: "SSC CGL",
      text: "The regular mock tests and doubt sessions helped me improve my accuracy and confidence.",
      initial: "A",
    },
    {
      name: "Neha Singh",
      exam: "IBPS PO",
      text: "The faculty explains difficult concepts in a very simple way. The guidance was extremely helpful.",
      initial: "N",
    },
    {
      name: "Rohit Das",
      exam: "SBI PO",
      text: "The structured study plan kept me consistent throughout my preparation journey.",
      initial: "R",
    },
  ];

  return (
    <section className="section testimonials-section">
      <div className="container">

        <div className="section-heading centered">
          <span className="section-label">
            STUDENT STORIES
          </span>

          <h2>
            What our students
            <br />
            <span>say about us.</span>
          </h2>

          <p>
            Real experiences from students who prepared with Sigma Classes.
          </p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((testimonial) => (
            <div
              className="testimonial-card"
              key={testimonial.name}
            >
              <Quote size={22} />

              <div className="stars">
                ★★★★★
              </div>

              <p>
                "{testimonial.text}"
              </p>

              <div className="testimonial-author">
                <div className="author-avatar">
                  {testimonial.initial}
                </div>

                <div>
                  <strong>{testimonial.name}</strong>
                  <span>{testimonial.exam}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Testimonials;