import {
  Activity,
  ClipboardCheck,
  Cloud,
  Container,
  Database,
  FileCode2,
  GitBranch,
  Layers,
  Network,
  Terminal,
  type LucideIcon,
} from "lucide-react";
import { localize, skillsByCategory, type SkillCategoryId } from "@/data/knowledge";
import { useLanguage } from "@/i18n/LanguageContext";
import Section from "./Section";

const CATEGORY_ICONS: Record<SkillCategoryId, LucideIcon> = {
  cloud: Cloud,
  containers: Container,
  iac: FileCode2,
  cicd: GitBranch,
  observability: Activity,
  systems: Network,
  languages: Terminal,
  databases: Database,
  practices: ClipboardCheck,
  frameworks: Layers,
};

const groups = skillsByCategory();

const SkillsSection = () => {
  const { language } = useLanguage();

  return (
    <Section id="skills">
      {/* CSS columns balance the cards, whose heights vary with the number of skills. */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
        {groups.map(({ category, skills }) => {
          const Icon = CATEGORY_ICONS[category.id];
          return (
            <div
              key={category.id}
              className="break-inside-avoid mb-6 glass-card rounded-xl p-6 border border-border/50 hover:border-primary/30 transition-colors duration-300 group"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Icon size={20} className="text-primary" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-foreground leading-snug">{category.name[language]}</h3>
              </div>
              <ul className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <li key={skill.id} className="font-mono text-xs text-primary/80 bg-primary/5 px-2.5 py-1 rounded-full">
                    {localize(skill.name, language)}
                    {skill.detail && <span className="text-muted-foreground"> · {localize(skill.detail, language)}</span>}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </Section>
  );
};

export default SkillsSection;
