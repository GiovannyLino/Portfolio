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
import { MessageCircle } from "lucide-react";
import { localize, skillsByCategory, type SkillCategoryId } from "@/data/knowledge";
import { openChat } from "@/features/chat/chat-bus";
import { launcherCopy } from "@/features/chat/launcher-copy";
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
  const { t, language } = useLanguage();
  const ask = launcherCopy[language].ask;

  return (
    <Section id="skills">
      <p className="-mt-4 mb-8 flex items-center gap-2 text-sm text-muted-foreground">
        <MessageCircle size={16} className="shrink-0 text-primary" aria-hidden="true" />
        {t.skills.askHint}
      </p>
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
                {skills.map((skill) => {
                  const name = localize(skill.name, language);
                  return (
                    <li key={skill.id}>
                      {/* Stack explorer: each technology opens the chat asking where it was used. */}
                      <button
                        type="button"
                        onClick={() => openChat({ question: ask.skill(name) })}
                        aria-label={ask.skillLabel(name)}
                        title={ask.skillLabel(name)}
                        className="group/chip font-mono text-xs text-left text-primary bg-primary/5 px-2.5 py-1 rounded-full transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {name}
                        {skill.detail && (
                          <span className="text-muted-foreground group-hover/chip:text-primary-foreground/80">
                            {" "}
                            · {localize(skill.detail, language)}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </Section>
  );
};

export default SkillsSection;
