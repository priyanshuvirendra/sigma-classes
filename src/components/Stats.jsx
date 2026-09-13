import {
  Users,
  ClipboardCheck,
  MessageCircleQuestion,
  Trophy,
} from "lucide-react";

function Stats() {
  const stats = [
    {
      icon: Users,
      title: "Experienced Faculty",
      description: "Learn from dedicated and experienced teachers",
    },
    {
      icon: ClipboardCheck,
      title: "Regular Mock Tests",
      description: "Practice with exam-focused tests",
    },
    {
      icon: MessageCircleQuestion,
      title: "Personal Doubt Support",
      description: "Get help whenever you need it",
    },
    {
      icon: Trophy,
      title: "Result Focused",
      description: "Preparation designed around real exam outcomes",
    },
  ];

  return (
    <section className="stats-section">
      <div className="container stats-grid">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div className="stat-item" key={stat.title}>
              <Icon size={24} />

              <div>
                <strong>{stat.title}</strong>
                <span>{stat.description}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Stats;