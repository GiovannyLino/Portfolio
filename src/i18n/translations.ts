// Interface copy only. Everything about Giovanny (bio, projects, experience) lives in
// src/data/knowledge so the page and the chat assistant share one source of truth.
import type { SectionId } from "../lib/sections";

export type Language = "en" | "pt" | "es";

export type Translations = {
  nav: { links: Record<SectionId, string>; resume: string; primary: string; openMenu: string; closeMenu: string };
  hero: { greeting: string; name: string; viewWork: string; getInTouch: string; scrollDown: string };
  sections: Record<SectionId, string>;
  about: { recentTech: string; currentRole: string; location: string; education: string; languages: string };
  experience: { technologies: string };
  projects: { other: string; internal: string; sourceCode: string; liveDemo: string };
  education: { degrees: string; certifications: string };
  contact: { subtitle: string; button: string };
  footer: { built: string };
};

export const translations = {
  en: {
    nav: {
      links: {
        about: "About",
        skills: "Skills",
        experience: "Experience",
        projects: "Projects",
        education: "Education",
        contact: "Contact",
      },
      resume: "Resume",
      primary: "Main",
      openMenu: "Open menu",
      closeMenu: "Close menu",
    },
    hero: {
      greeting: "Hi, my name is",
      name: "Giovanny Lino.",
      viewWork: "View My Work",
      getInTouch: "Get In Touch",
      scrollDown: "Scroll to About",
    },
    sections: {
      about: "About Me",
      skills: "Skills & Technologies",
      experience: "Experience",
      projects: "Featured Projects",
      education: "Education & Certifications",
      contact: "Get In Touch",
    },
    about: {
      recentTech: "Technologies I've been working with recently:",
      currentRole: "Current role",
      location: "Location",
      education: "Education",
      languages: "Languages",
    },
    experience: {
      technologies: "Technologies",
    },
    projects: {
      other: "Other projects",
      internal: "Internal project — no public code",
      sourceCode: "source code",
      liveDemo: "live demo",
    },
    education: {
      degrees: "Degrees",
      certifications: "Certifications",
    },
    contact: {
      subtitle: "What's Next?",
      button: "Say Hello",
    },
    footer: {
      built: "Built by Giovanny Lino",
    },
  },
  pt: {
    nav: {
      links: {
        about: "Sobre",
        skills: "Habilidades",
        experience: "Experiência",
        projects: "Projetos",
        education: "Formação",
        contact: "Contato",
      },
      resume: "Currículo",
      primary: "Principal",
      openMenu: "Abrir menu",
      closeMenu: "Fechar menu",
    },
    hero: {
      greeting: "Olá, meu nome é",
      name: "Giovanny Lino.",
      viewWork: "Ver Meus Projetos",
      getInTouch: "Entre em Contato",
      scrollDown: "Ir para Sobre",
    },
    sections: {
      about: "Sobre Mim",
      skills: "Habilidades & Tecnologias",
      experience: "Experiência",
      projects: "Projetos em Destaque",
      education: "Formação & Certificações",
      contact: "Entre em Contato",
    },
    about: {
      recentTech: "Tecnologias com que tenho trabalhado recentemente:",
      currentRole: "Cargo atual",
      location: "Localização",
      education: "Formação",
      languages: "Idiomas",
    },
    experience: {
      technologies: "Tecnologias",
    },
    projects: {
      other: "Outros projetos",
      internal: "Projeto interno — sem código público",
      sourceCode: "código-fonte",
      liveDemo: "demo online",
    },
    education: {
      degrees: "Formação acadêmica",
      certifications: "Certificações",
    },
    contact: {
      subtitle: "O Que Vem a Seguir?",
      button: "Diga Olá",
    },
    footer: {
      built: "Feito por Giovanny Lino",
    },
  },
  es: {
    nav: {
      links: {
        about: "Sobre Mí",
        skills: "Habilidades",
        experience: "Experiencia",
        projects: "Proyectos",
        education: "Formación",
        contact: "Contacto",
      },
      resume: "Currículum",
      primary: "Principal",
      openMenu: "Abrir menú",
      closeMenu: "Cerrar menú",
    },
    hero: {
      greeting: "Hola, mi nombre es",
      name: "Giovanny Lino.",
      viewWork: "Ver Mis Proyectos",
      getInTouch: "Contáctame",
      scrollDown: "Ir a Sobre Mí",
    },
    sections: {
      about: "Sobre Mí",
      skills: "Habilidades & Tecnologías",
      experience: "Experiencia",
      projects: "Proyectos Destacados",
      education: "Formación & Certificaciones",
      contact: "Contáctame",
    },
    about: {
      recentTech: "Tecnologías con las que he trabajado recientemente:",
      currentRole: "Cargo actual",
      location: "Ubicación",
      education: "Formación",
      languages: "Idiomas",
    },
    experience: {
      technologies: "Tecnologías",
    },
    projects: {
      other: "Otros proyectos",
      internal: "Proyecto interno — sin código público",
      sourceCode: "código fuente",
      liveDemo: "demo en línea",
    },
    education: {
      degrees: "Formación académica",
      certifications: "Certificaciones",
    },
    contact: {
      subtitle: "¿Qué Sigue?",
      button: "Di Hola",
    },
    footer: {
      built: "Hecho por Giovanny Lino",
    },
  },
} satisfies Record<Language, Translations>;
