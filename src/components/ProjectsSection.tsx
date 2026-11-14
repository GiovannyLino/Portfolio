import type { PointerEvent } from "react";
import { ExternalLink, Github, Lock, MessageCircle } from "lucide-react";
import { featuredProjects, localize, otherProjects, type Project } from "@/data/knowledge";
import { openChat } from "@/features/chat/chat-bus";
import { launcherCopy } from "@/features/chat/launcher-copy";
import { useLanguage } from "@/i18n/LanguageContext";
import { projectAnchorId } from "@/lib/sections";
import { cn } from "@/lib/utils";
import { hasFinePointer, prefersReducedMotion } from "@/motion/env";
import { Reveal } from "@/motion/Reveal";
import ProjectArt from "./ProjectArt";
import Section from "./Section";
import TechTags from "./TechTags";
import ui from "./ui.module.css";
import styles from "./ProjectsSection.module.css";

const TILT_DEGREES = 2.4;

// The card leans towards the pointer and a soft light follows it. The article itself is
// what gets measured; only its inner panel moves.
const onTilt = (event: PointerEvent<HTMLElement>) => {
  if (event.pointerType !== "mouse" || !hasFinePointer() || prefersReducedMotion()) return;
  const rect = event.currentTarget.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width;
  const y = (event.clientY - rect.top) / rect.height;
  const { style } = event.currentTarget;
  style.setProperty("--tilt-x", `${((0.5 - y) * 2 * TILT_DEGREES).toFixed(2)}deg`);
  style.setProperty("--tilt-y", `${((x - 0.5) * 2 * TILT_DEGREES).toFixed(2)}deg`);
  style.setProperty("--light-x", `${(x * 100).toFixed(1)}%`);
  style.setProperty("--light-y", `${(y * 100).toFixed(1)}%`);
};

const onTiltEnd = (event: PointerEvent<HTMLElement>) => {
  const { style } = event.currentTarget;
  style.removeProperty("--tilt-x");
  style.removeProperty("--tilt-y");
};

/** "Ask Gio.AI", source code and live demo. */
const ProjectActions = ({ project, title }: { project: Project; title: string }) => {
  const { t, language } = useLanguage();
  const ask = launcherCopy[language].ask;
  const { repo, demo } = project.links;

  return (
    <div className={styles.actions}>
      <button
        type="button"
        className={styles.ask}
        onClick={() => openChat({ question: ask.project(title) })}
        aria-label={ask.projectLabel(title)}
        title={ask.projectLabel(title)}
      >
        <MessageCircle size={15} aria-hidden="true" />
        Gio.AI
      </button>
      {repo && (
        <a
          href={repo}
          target="_blank"
          rel="noopener noreferrer"
          className={ui.iconButton}
          aria-label={`${title} — ${t.projects.sourceCode}`}
          title={t.projects.sourceCode}
        >
          <Github size={17} aria-hidden="true" />
        </a>
      )}
      {demo && (
        <a
          href={demo}
          target="_blank"
          rel="noopener noreferrer"
          className={ui.iconButton}
          aria-label={`${title} — ${t.projects.liveDemo}`}
          title={t.projects.liveDemo}
        >
          <ExternalLink size={17} aria-hidden="true" />
        </a>
      )}
    </div>
  );
};

const FeaturedProject = ({ project, index }: { project: Project; index: number }) => {
  const { t, language } = useLanguage();
  const title = localize(project.title, language);
  const isInternal = project.origin === "work" && !project.links.repo && !project.links.demo;

  return (
    // The assistant scrolls to and outlines this element (#project-<id>, see lib/sections).
    <Reveal
      as="article"
      id={projectAnchorId(project.id)}
      data-project-id={project.id}
      className={styles.card}
      index={index % 2}
      onPointerMove={onTilt}
      onPointerLeave={onTiltEnd}
    >
      <div className={styles.panel}>
        <div className={styles.artSlot}>
          <ProjectArt projectId={project.id} className={styles.art} />
          <span className={cn("display", styles.cardNumber)} aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <div className={styles.cardBody}>
          <h3 className={cn("display", styles.cardTitle)}>{title}</h3>
          <p className={styles.summary}>{project.summary[language]}</p>

          {project.problem && project.solution && (
            <dl className={styles.why}>
              <div>
                <dt className="label">{t.projects.problem}</dt>
                <dd>{project.problem[language]}</dd>
              </div>
              <div>
                <dt className="label">{t.projects.solution}</dt>
                <dd>{project.solution[language]}</dd>
              </div>
            </dl>
          )}

          <TechTags skillIds={project.stack} label={t.experience.technologies} />

          <div className={styles.cardFoot}>
            {isInternal ? (
              <p className={cn("label", styles.internal)}>
                <Lock size={12} aria-hidden="true" />
                {t.projects.internal}
              </p>
            ) : (
              <span />
            )}
            <ProjectActions project={project} title={title} />
          </div>
        </div>
      </div>
    </Reveal>
  );
};

const OtherProject = ({ project, index }: { project: Project; index: number }) => {
  const { t, language } = useLanguage();
  const title = localize(project.title, language);

  return (
    <Reveal as="li">
      <article id={projectAnchorId(project.id)} data-project-id={project.id} className={styles.other}>
        <span className={cn("label", styles.otherNumber)} aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h4 className={cn("display", styles.otherTitle)}>{title}</h4>
        <div className={styles.otherBody}>
          <p>{project.summary[language]}</p>
          <TechTags skillIds={project.stack} label={t.experience.technologies} />
        </div>
        <ProjectActions project={project} title={title} />
      </article>
    </Reveal>
  );
};

const ProjectsSection = () => {
  const { t } = useLanguage();

  return (
    <Section id="projects" surface="ink">
      <div className={styles.featured}>
        {featuredProjects.map((project, index) => (
          <FeaturedProject key={project.id} project={project} index={index} />
        ))}
      </div>

      <Reveal as="div" className={styles.othersHeader}>
        <h3 className={cn("display", styles.othersTitle)}>{t.projects.other}</h3>
      </Reveal>
      <ul className={styles.others}>
        {otherProjects.map((project, index) => (
          <OtherProject key={project.id} project={project} index={featuredProjects.length + index} />
        ))}
      </ul>
    </Section>
  );
};

export default ProjectsSection;
