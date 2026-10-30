// This folder is the single source of truth for the page sections and for the chat
// assistant. It is also bundled by the Vercel function in api/, which does not resolve
// the "@/" alias: keep imports relative and never import React, CSS or assets here.
import type { Language } from "../../i18n/translations";
import type { SectionId } from "../../lib/sections";
import type { SkillId } from "./skills";
import type { ProjectId } from "./projects";
import type { ExperienceId } from "./experience";

export type { Language, SectionId, SkillId, ProjectId, ExperienceId };

export type Localized<T = string> = Readonly<Record<Language, T>>;

/** Proper nouns (AWS, Ansible) stay as plain strings; everything else is localized. */
export type Text = string | Localized;

/** Inline emphasis for prose rendered on the page. */
export type RichSegment = string | { readonly text: string; readonly tone: "strong" | "accent" };
export type RichText = readonly RichSegment[];

/** "YYYY-MM". `end: null` means the position is current. */
export type YearMonth = `${number}-${number}`;

export interface MonthPeriod {
  readonly start: YearMonth;
  readonly end: YearMonth | null;
}

export interface YearPeriod {
  readonly start: number;
  readonly end: number;
}

export type SkillCategoryId =
  | "cloud"
  | "containers"
  | "iac"
  | "cicd"
  | "observability"
  | "systems"
  | "languages"
  | "databases"
  | "practices"
  | "frameworks";

export interface SkillCategory {
  readonly id: SkillCategoryId;
  readonly name: Localized;
}

export interface Skill {
  readonly id: string;
  readonly name: Text;
  readonly category: SkillCategoryId;
  /** Shown after the name, e.g. AWS → "EC2, S3, IAM, VPC, RDS/Aurora". */
  readonly detail?: Text;
  /** Extra search terms: abbreviations, sub-products, PT/EN/ES variants. */
  readonly aliases?: readonly string[];
  /** Listed under "technologies I've been working with recently" in About. */
  readonly featured?: boolean;
  /** Catalog-only: usable in project stacks and search, hidden from the Skills grid. */
  readonly listed?: false;
}

export interface Experience {
  readonly id: string;
  readonly company: string;
  readonly role: Localized;
  readonly location: Localized;
  readonly period: MonthPeriod;
  readonly highlights: Localized<readonly string[]>;
  readonly skills: readonly SkillId[];
}

export interface Project {
  readonly id: string;
  readonly title: Text;
  /** Featured projects come from the CV; the others are older public repositories. */
  readonly featured: boolean;
  /** "work" projects without links are internal: there is no public code to show. */
  readonly origin: "work" | "personal";
  /** Set only when the CV ties the project to a position. */
  readonly experienceId?: ExperienceId;
  readonly summary: Localized;
  readonly problem?: Localized;
  readonly solution?: Localized;
  readonly highlights?: Localized<readonly string[]>;
  readonly stack: readonly SkillId[];
  readonly links: { readonly repo?: string; readonly demo?: string };
}

export interface Education {
  readonly id: string;
  readonly degree: Localized;
  readonly institution: string;
  readonly location: string;
  readonly period: YearPeriod;
}

export interface Certification {
  readonly id: string;
  readonly name: string;
  readonly issuer: string;
  readonly year: number;
}

export interface SpokenLanguage {
  readonly name: Localized;
  readonly level: Localized;
}

/** Only data already public on the site. The phone number in the CV PDF stays out on purpose. */
export interface Profile {
  readonly name: string;
  readonly fullName: string;
  readonly headline: Localized;
  readonly location: Localized;
  /** Hero subtitle. */
  readonly tagline: Localized;
  /** Hero description. */
  readonly intro: Localized;
  /** About paragraphs, first person (the page speaks as Giovanny). */
  readonly about: Localized<readonly RichText[]>;
  readonly careerGoal: Localized;
  /** Contact section copy, first person. */
  readonly availability: Localized;
  readonly languages: readonly SpokenLanguage[];
  readonly links: {
    readonly email: string;
    readonly github: string;
    readonly linkedin: string;
    readonly resume: Localized;
  };
}

export interface FaqEntry {
  readonly id: string;
  readonly question: Localized;
  /** Written about Giovanny in the third person: it doubles as the chat's offline answer. */
  readonly answer: Localized;
  readonly keywords: readonly string[];
  readonly section?: SectionId;
  readonly projectId?: ProjectId;
}
