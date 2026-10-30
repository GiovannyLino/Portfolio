import { allExperience, formatPeriod } from "@/data/knowledge";
import { useLanguage } from "@/i18n/LanguageContext";
import Section from "./Section";
import TechTags from "./TechTags";

const ExperienceSection = () => {
  const { t, language } = useLanguage();

  return (
    <Section id="experience">
      <ol className="relative ml-2 border-l border-border space-y-12">
        {allExperience.map((job) => (
          <li key={job.id} className="relative pl-8">
            <span
              aria-hidden="true"
              className="absolute -left-[7px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-primary bg-background"
            />
            <p className="font-mono text-xs text-muted-foreground mb-1">
              {formatPeriod(job.period, language)} · {job.location[language]}
            </p>
            <h3 className="text-lg font-semibold text-foreground">
              {job.role[language]} <span className="text-primary">@ {job.company}</span>
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground leading-relaxed">
              {job.highlights[language].map((highlight, i) => (
                <li key={i} className="flex gap-3">
                  <span aria-hidden="true" className="text-primary">
                    ▹
                  </span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <TechTags skillIds={job.skills} label={t.experience.technologies} />
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
};

export default ExperienceSection;
