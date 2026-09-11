import { Users, Trophy, BookOpen, Award } from "lucide-react";

function Stats() {
  const stats = [
    {
      icon: Users,
      number: "1,000+",
      label: "Students Guided",
    },
    {
      icon: Trophy,
      number: "100+",
      label: "Selections Across Competitive Exams",
    },
    {
      icon: BookOpen,
      number: "15+",
      label: "Years Teaching Experience",
    },
    {
      icon: Award,
      number: "BPSC • SSC • BANK",
      label: "Teacher TRE • TET & Other Exams",
    },
  ];

  return (
    <section className="stats-section">
      <div className="container stats-grid">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div className="stat-item" key={stat.label}>
              <Icon size={24} />

              <div>
                <strong>{stat.number}</strong>
                <span>{stat.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Stats;