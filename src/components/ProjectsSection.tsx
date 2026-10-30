import { Code2, ExternalLink, Github, Lock } from "lucide-react";
import { featuredProjects, localize, otherProjects, type Project } from "@/data/knowledge";
import { useLanguage } from "@/i18n/LanguageContext";
import { projectAnchorId } from "@/lib/sections";
import { cn } from "@/lib/utils";
import Section from "./Section";
import TechTags from "./TechTags";

const ProjectCard = ({ project, className }: { project: Project; className?: string }) => {
  const { t, language } = useLanguage();
  const title = localize(project.title, language);
  const { repo, demo } = project.links;
  const isInternal = project.origin === "work" && !repo && !demo;

  return (
    <article
      id={projectAnchorId(project.id)}
      data-project-id={project.id}
      className={cn(
        "glass-card rounded-xl p-6 border border-border/50 hover:border-primary/30 transition-all duration-300 group hover:-translate-y-1 flex flex-col scroll-mt-24",
        className,
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          <Code2 className="text-primary" size={24} aria-hidden="true" />
        </div>
        <div className="flex items-center gap-3">
          {repo && (
            <a
              href={repo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label={`${title} — ${t.projects.sourceCode}`}
            >
              <Github size={20} />
            </a>
          )}
          {demo && (
            <a
              href={demo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label={`${title} — ${t.projects.liveDemo}`}
            >
              <ExternalLink size={20} />
            </a>
          )}
        </div>
      </div>

      <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{project.summary[language]}</p>
      {isInternal && (
        <p className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground mb-4">
          <Lock size={12} aria-hidden="true" />
          {t.projects.internal}
        </p>
      )}
      <TechTags skillIds={project.stack} label={t.experience.technologies} />
    </article>
  );
};

const ProjectsSection = () => {
  const { t } = useLanguage();

  return (
    <Section id="projects">
      <div className="grid md:grid-cols-2 gap-6">
        {featuredProjects.map((project, i) => (
          <ProjectCard key={project.id} project={project} className={i === 0 ? "md:col-span-2" : undefined} />
        ))}
      </div>

      <h3 className="mt-16 mb-6 text-xl font-semibold text-foreground">{t.projects.other}</h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {otherProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </Section>
  );
};

export default ProjectsSection;
