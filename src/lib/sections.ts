// Single contract between the page layout, the scrollspy and the chat tools
// (navigateToSection / highlightProject). Order here defines the "01." numbering.
export const SECTION_IDS = ["about", "skills", "experience", "projects", "education", "contact"] as const;

export type SectionId = (typeof SECTION_IDS)[number];

export const isSectionId = (value: string): value is SectionId =>
  (SECTION_IDS as readonly string[]).includes(value);

export const sectionNumber = (id: SectionId): string =>
  `${String(SECTION_IDS.indexOf(id) + 1).padStart(2, "0")}.`;

export const projectAnchorId = (projectId: string): string => `project-${projectId}`;
