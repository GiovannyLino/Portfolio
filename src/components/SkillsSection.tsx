import { Code2, Database, Cloud, Globe } from "lucide-react";

const skillCategories = [
  {
    title: "Frontend",
    icon: Globe,
    skills: ["React", "Angular", "TypeScript", "Tailwind CSS", "Next.js", "Vite"],
  },
  {
    title: "Backend",
    icon: Code2,
    skills: ["Node.js", "Express.js", "REST APIs", "Java", "Python", "C"],
  },
  {
    title: "Databases",
    icon: Database,
    skills: ["MySQL", "PostgreSQL", "MongoDB", "Oracle SQL", "PL/SQL", "Oracle APEX"],
  },
  {
    title: "DevOps & Tools",
    icon: Cloud,
    skills: ["Git & GitHub", "VMs", "Cloud Concepts", "Microservices", "Postman", "Agile"],
  },
];

const SkillsSection = () => {
  return (
    <section id="skills" className="py-24 md:py-32 bg-secondary/30">
      <div className="container max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
          <span className="font-mono text-primary text-xl">02.</span>
          Skills & Technologies
          <span className="hidden sm:block h-px flex-1 bg-border ml-4" />
        </h2>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillCategories.map((cat) => (
            <div
              key={cat.title}
              className="glass-card rounded-xl p-6 border border-border/50 hover:border-primary/30 transition-all duration-300 group hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <cat.icon size={24} className="text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-3">{cat.title}</h3>
              <ul className="space-y-1.5">
                {cat.skills.map((skill) => (
                  <li key={skill} className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
