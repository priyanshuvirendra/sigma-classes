import {
  GraduationCap,
  Target,
  ClipboardCheck,
  MessageCircleQuestion,
} from "lucide-react";

function WhyChooseUs() {
  const features = [
    {
      icon: GraduationCap,
      title: "Experienced Faculty",
      text: "Learn from experienced mentors who understand competitive exams.",
    },
    {
      icon: Target,
      title: "Exam-Focused Strategy",
      text: "Structured preparation based on the latest exam patterns.",
    },
    {
      icon: ClipboardCheck,
      title: "Regular Mock Tests",
      text: "Practice regularly and track your preparation with detailed tests.",
    },
    {
      icon: MessageCircleQuestion,
      title: "Personal Doubt Support",
      text: "Get your questions answered and concepts clarified by mentors.",
    },
  ];

  return (
    <section className="section why-section" id="about">
      <div className="container">

        <div className="section-heading centered">
          <span className="section-label">WHY CHOOSE US</span>

          <h2>
            More than classes.
            <br />
            <span>A complete preparation system.</span>
          </h2>

          <p>
            We combine quality teaching, disciplined practice and continuous
            guidance to help students prepare with confidence.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div className="feature-card" key={feature.title}>
                <div className="feature-icon">
                  <Icon size={23} />
                </div>

                <h3>{feature.title}</h3>

                <p>{feature.text}</p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default WhyChooseUs;