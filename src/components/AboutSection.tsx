import type { ReactNode } from "react";
import { Briefcase, GraduationCap, Languages, MapPin, type LucideIcon } from "lucide-react";
import { currentPosition, education, featuredSkills, formatPeriod, localize, profile } from "@/data/knowledge";
import { useLanguage } from "@/i18n/LanguageContext";
import RichParagraph from "./RichParagraph";
import Section from "./Section";

const Fact = ({ icon: Icon, label, children }: { icon: LucideIcon; label: string; children: ReactNode }) => (
  <div className="flex gap-3">
    <div className="w-10 h-10 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center">
      <Icon size={20} className="text-primary" aria-hidden="true" />
    </div>
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm text-foreground">{children}</dd>
    </div>
  </div>
);

const AboutSection = () => {
  const { t, language } = useLanguage();
  const [degree] = education;

  return (
    <Section id="about">
      <div className="grid md:grid-cols-5 gap-10">
        <div className="md:col-span-3 space-y-4 text-muted-foreground leading-relaxed">
          {profile.about[language].map((paragraph, i) => (
            <RichParagraph key={i} segments={paragraph} />
          ))}
          <p className="pt-2">{t.about.recentTech}</p>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2 font-mono text-sm">
            {featuredSkills.map((skill) => (
              <li key={skill.id} className="flex items-center gap-2">
                <span aria-hidden="true" className="text-primary">
                  ▹
                </span>
                {localize(skill.name, language)}
              </li>
            ))}
          </ul>
        </div>

        <dl className="md:col-span-2 self-start glass-card rounded-xl p-6 border border-border/50 space-y-5">
          <Fact icon={Briefcase} label={t.about.currentRole}>
            {currentPosition.role[language]} · {currentPosition.company}
            <span className="block font-mono text-xs text-muted-foreground mt-0.5">
              {formatPeriod(currentPosition.period, language)}
            </span>
          </Fact>
          <Fact icon={MapPin} label={t.about.location}>
            {profile.location[language]}
          </Fact>
          <Fact icon={GraduationCap} label={t.about.education}>
            {degree.degree[language]}
            <span className="block font-mono text-xs text-muted-foreground mt-0.5">
              USCS · {degree.period.start} – {degree.period.end}
            </span>
          </Fact>
          <Fact icon={Languages} label={t.about.languages}>
            {profile.languages.map((spoken) => `${spoken.name[language]} (${spoken.level[language]})`).join(" · ")}
          </Fact>
        </dl>
      </div>
    </Section>
  );
};

export default AboutSection;
