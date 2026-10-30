import { Award, GraduationCap } from "lucide-react";
import { certifications, education } from "@/data/knowledge";
import { useLanguage } from "@/i18n/LanguageContext";
import Section from "./Section";

const cardClass = "glass-card rounded-xl p-6 border border-border/50 hover:border-primary/30 transition-colors duration-300";
const headingClass = "flex items-center gap-3 font-semibold text-foreground mb-5";
const iconBoxClass = "w-10 h-10 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center";

const EducationSection = () => {
  const { t, language } = useLanguage();

  return (
    <Section id="education">
      <div className="grid md:grid-cols-2 gap-6">
        <div className={cardClass}>
          <h3 className={headingClass}>
            <span className={iconBoxClass}>
              <GraduationCap size={20} className="text-primary" aria-hidden="true" />
            </span>
            {t.education.degrees}
          </h3>
          <ul className="space-y-5">
            {education.map((item) => (
              <li key={item.id}>
                <p className="font-medium text-foreground">{item.degree[language]}</p>
                <p className="text-sm text-muted-foreground">{item.institution}</p>
                <p className="font-mono text-xs text-muted-foreground mt-1">
                  {item.period.start} – {item.period.end}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className={cardClass}>
          <h3 className={headingClass}>
            <span className={iconBoxClass}>
              <Award size={20} className="text-primary" aria-hidden="true" />
            </span>
            {t.education.certifications}
          </h3>
          <ul className="space-y-4">
            {certifications.map((cert) => (
              <li key={cert.id}>
                <p className="font-medium text-foreground leading-snug">{cert.name}</p>
                <p className="font-mono text-xs text-muted-foreground mt-1">
                  {cert.issuer} · {cert.year}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
};

export default EducationSection;
