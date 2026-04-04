import { Code2, Database, Cloud, Globe } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const skillCategories = [
  {
    titleKey: "Frontend",
    icon: Globe,
    skills: ["React", "Angular", "TypeScript", "Tailwind CSS", "Next.js", "Vite"],
  },
  {
    titleKey: "Backend",
    icon: Code2,
    skills: ["Node.js", "Express.js", "REST APIs", "Java", "Python", "C"],
  },
  {
    titleKey: "Databases",
    icon: Database,
    skills: ["MySQL", "PostgreSQL", "MongoDB", "Oracle SQL", "PL/SQL", "Oracle APEX"],
  },
  {
    titleKey: "DevOps & Tools",
    icon: Cloud,
    skills: ["Git & GitHub", "VMs", "Cloud Concepts", "Microservices", "Postman", "Agile"],
  },
];

const SkillsSection = () => {
  const { t } = useLanguage();

  return (
    <div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {skillCategories.map((cat) => (
          <div
            key={cat.titleKey}
            className="glass-card rounded-xl p-6 border border-border/50 hover:border-primary/30 transition-all duration-300 group hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <cat.icon size={24} className="text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-3">{cat.titleKey}</h3>
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
  );
};

export default SkillsSection;
