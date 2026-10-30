import { useState } from "react";
import { Briefcase, Check, Copy, ExternalLink, FileText, FolderGit2, Github, Linkedin, Lock, Mail, MapPin, Wrench } from "lucide-react";
import {
  getProject,
  getSkill,
  localize,
  profile,
  skillCategories,
  whereUsed,
  type Language,
} from "@/data/knowledge";
import type { ChatCard, Source, UiAction } from "../protocol";
import type { ChatCopy } from "../i18n";
import styles from "../ChatWidget.module.css";

interface CardProps {
  lang: Language;
  copy: ChatCopy;
  /** Scrolls or highlights the page; the widget decides when (phones close the sheet first). */
  onPageAction: (action: UiAction) => void;
}

const Tags = ({ ids, lang }: { ids: readonly string[]; lang: Language }) => (
  <ul className={styles.tags}>
    {ids.map((id) => {
      const skill = getSkill(id);
      return skill ? <li key={id}>{localize(skill.name, lang)}</li> : null;
    })}
  </ul>
);

const ProjectCard = ({ id, lang, copy, onPageAction }: CardProps & { id: string }) => {
  const project = getProject(id);
  if (!project) return null;
  const title = localize(project.title, lang);
  const { repo, demo } = project.links;

  return (
    <article className={styles.card} aria-label={title}>
      <header className={styles.cardHeader}>
        <span className={styles.cardIcon}>
          <FolderGit2 size={16} aria-hidden="true" />
        </span>
        <h3>{title}</h3>
      </header>
      <p className={styles.cardText}>{project.summary[lang]}</p>
      <Tags ids={project.stack} lang={lang} />
      <div className={styles.cardActions}>
        <button type="button" className={styles.cardButton} onClick={() => onPageAction({ type: "highlightProject", projectId: project.id })}>
          <MapPin size={14} aria-hidden="true" />
          {copy.cards.viewOnPage}
        </button>
        {repo && (
          <a className={styles.cardLink} href={repo} target="_blank" rel="noopener noreferrer">
            <Github size={14} aria-hidden="true" />
            {copy.cards.code}
          </a>
        )}
        {demo && (
          <a className={styles.cardLink} href={demo} target="_blank" rel="noopener noreferrer">
            <ExternalLink size={14} aria-hidden="true" />
            {copy.cards.demo}
          </a>
        )}
        {!repo && !demo && (
          <span className={styles.cardNote}>
            <Lock size={12} aria-hidden="true" />
            {copy.cards.internal}
          </span>
        )}
      </div>
    </article>
  );
};

const SkillCard = ({ id, lang, copy, onPageAction }: CardProps & { id: string }) => {
  const skill = getSkill(id);
  if (!skill) return null;
  const name = localize(skill.name, lang);
  const category = skillCategories.find((c) => c.id === skill.category)?.name[lang];
  const used = whereUsed(skill.id);
  const hasEvidence = used.experience.length + used.projects.length > 0;

  return (
    <article className={styles.card} aria-label={name}>
      <header className={styles.cardHeader}>
        <span className={styles.cardIcon}>
          <Wrench size={16} aria-hidden="true" />
        </span>
        <div>
          <h3>{name}</h3>
          <p className={styles.cardMeta}>
            {category}
            {skill.detail ? ` · ${localize(skill.detail, lang)}` : ""}
          </p>
        </div>
      </header>
      {hasEvidence ? (
        <>
          <p className={styles.cardLabel}>{copy.cards.usedIn}</p>
          <ul className={styles.evidence}>
            {used.experience.map((job) => (
              <li key={job.id}>
                <button type="button" onClick={() => onPageAction({ type: "navigate", section: "experience" })}>
                  <Briefcase size={13} aria-hidden="true" />
                  {job.role[lang]} · {job.company}
                </button>
              </li>
            ))}
            {used.projects.map((project) => (
              <li key={project.id}>
                <button type="button" onClick={() => onPageAction({ type: "highlightProject", projectId: project.id })}>
                  <FolderGit2 size={13} aria-hidden="true" />
                  {localize(project.title, lang)}
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className={styles.cardNote}>{copy.cards.listedOnly}</p>
      )}
    </article>
  );
};

const ContactCard = ({ lang, copy, onPageAction }: CardProps) => {
  const [copied, setCopied] = useState(false);
  const { email, linkedin, github, resume } = profile.links;

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard blocked: the address is visible and selectable anyway.
    }
  };

  return (
    <article className={styles.card} aria-label={copy.cards.contactTitle}>
      <header className={styles.cardHeader}>
        <span className={styles.cardIcon}>
          <Mail size={16} aria-hidden="true" />
        </span>
        <h3>{copy.cards.contactTitle}</h3>
      </header>
      <div className={styles.emailRow}>
        <a href={`mailto:${email}`}>{email}</a>
        <button type="button" className={styles.iconButton} onClick={copyEmail} aria-label={copied ? copy.cards.copied : copy.cards.copy}>
          {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
        </button>
      </div>
      <div className={styles.cardActions}>
        <button type="button" className={styles.cardButton} onClick={() => onPageAction({ type: "navigate", section: "contact" })}>
          <MapPin size={14} aria-hidden="true" />
          {copy.cards.openForm}
        </button>
        <a className={styles.cardLink} href={linkedin} target="_blank" rel="noopener noreferrer">
          <Linkedin size={14} aria-hidden="true" />
          LinkedIn
        </a>
        <a className={styles.cardLink} href={github} target="_blank" rel="noopener noreferrer">
          <Github size={14} aria-hidden="true" />
          GitHub
        </a>
        <a className={styles.cardLink} href={resume[lang]} target="_blank" rel="noopener noreferrer">
          <FileText size={14} aria-hidden="true" />
          {copy.cards.resume}
        </a>
      </div>
    </article>
  );
};

export const ChatCardView = ({ card, ...props }: CardProps & { card: ChatCard }) => {
  switch (card.kind) {
    case "project":
      return <ProjectCard id={card.id} {...props} />;
    case "skill":
      return <SkillCard id={card.id} {...props} />;
    case "contact":
      return <ContactCard {...props} />;
  }
};

export const SourceList = ({ sources, label }: { sources: Source[]; label: string }) => (
  <div className={styles.sources}>
    <p className={styles.cardLabel}>{label}</p>
    <ul>
      {sources.map((source) => (
        <li key={source.url}>
          <a href={source.url} target="_blank" rel="noopener noreferrer">
            <ExternalLink size={12} aria-hidden="true" />
            {source.title}
          </a>
        </li>
      ))}
    </ul>
  </div>
);
