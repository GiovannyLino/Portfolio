import { experience } from "./experience";
import { projects } from "./projects";
import { skillCategories, skills } from "./skills";
import type { Experience, Project, Skill, SkillCategory } from "./types";

// Widen the `as const` tuples to their interfaces so optional fields can be read uniformly.
export const allSkills: readonly Skill[] = skills;
export const allProjects: readonly Project[] = projects;
export const allExperience: readonly Experience[] = experience;

const indexById = <T extends { readonly id: string }>(items: readonly T[]) =>
  new Map(items.map((item) => [item.id, item] as const));

const skillIndex = indexById(allSkills);
const projectIndex = indexById(allProjects);
const experienceIndex = indexById(allExperience);

export const getSkill = (id: string): Skill | undefined => skillIndex.get(id);
export const getProject = (id: string): Project | undefined => projectIndex.get(id);
export const getExperience = (id: string): Experience | undefined => experienceIndex.get(id);

/** Most recent position first, as listed in the CV. */
export const currentPosition: Experience = allExperience[0];

export const featuredProjects = allProjects.filter((project) => project.featured);
export const otherProjects = allProjects.filter((project) => !project.featured);
export const featuredSkills = allSkills.filter((skill) => skill.featured);

/** Evidence for a skill: every position and project that lists it. */
export const whereUsed = (skillId: string) => ({
  experience: allExperience.filter((job) => (job.skills as readonly string[]).includes(skillId)),
  projects: allProjects.filter((project) => (project.stack as readonly string[]).includes(skillId)),
});

/** Categories in display order with their visible skills; empty categories are dropped. */
export const skillsByCategory = (): { category: SkillCategory; skills: Skill[] }[] =>
  skillCategories
    .map((category) => ({
      category,
      skills: allSkills.filter((skill) => skill.category === category.id && skill.listed !== false),
    }))
    .filter((group) => group.skills.length > 0);
