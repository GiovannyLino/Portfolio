// Interface copy only. Everything about Giovanny (bio, projects, experience) lives in
// src/data/knowledge so the page and the chat assistant share one source of truth.
import type { SectionId } from "../lib/sections.js";

export type Language = "en" | "pt" | "es";

export type Translations = {
  nav: {
    links: Record<SectionId, string>;
    resume: string;
    primary: string;
    menu: string;
    openMenu: string;
    closeMenu: string;
    skip: string;
    theme: string;
    language: string;
  };
  hero: { greeting: string; name: string; viewWork: string; getInTouch: string; scrollDown: string; localTime: string };
  sections: Record<SectionId, string>;
  about: { recentTech: string; currentRole: string; location: string; education: string; languages: string };
  experience: { technologies: string };
  projects: { other: string; internal: string; sourceCode: string; liveDemo: string; problem: string; solution: string };
  education: { degrees: string; certifications: string };
  skills: { askHint: string };
  contact: { subtitle: string; button: string };
  footer: { built: string; backToTop: string };
  notFound: { title: string; back: string };
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
      menu: "Menu",
      openMenu: "Open menu",
      closeMenu: "Close menu",
      skip: "Skip to content",
      theme: "Switch between light and dark theme",
      language: "Language",
    },
    hero: {
      greeting: "Hi, my name is",
      name: "Giovanny Lino.",
      viewWork: "View My Work",
      getInTouch: "Get In Touch",
      scrollDown: "Scroll to About",
      localTime: "Local time",
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
      problem: "Problem",
      solution: "Solution",
    },
    education: {
      degrees: "Degrees",
      certifications: "Certifications",
    },
    skills: {
      askHint: "Click a technology to ask Gio.AI where Giovanny used it.",
    },
    contact: {
      subtitle: "What's Next?",
      button: "Say Hello",
    },
    footer: {
      built: "Built by Giovanny Lino",
      backToTop: "Back to top",
    },
    notFound: {
      title: "Page not found",
      back: "Back to the homepage",
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
      menu: "Menu",
      openMenu: "Abrir menu",
      closeMenu: "Fechar menu",
      skip: "Pular para o conteúdo",
      theme: "Alternar entre tema claro e escuro",
      language: "Idioma",
    },
    hero: {
      greeting: "Olá, meu nome é",
      name: "Giovanny Lino.",
      viewWork: "Ver Meus Projetos",
      getInTouch: "Entre em Contato",
      scrollDown: "Ir para Sobre",
      localTime: "Hora local",
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
      problem: "Problema",
      solution: "Solução",
    },
    education: {
      degrees: "Formação acadêmica",
      certifications: "Certificações",
    },
    skills: {
      askHint: "Clique numa tecnologia para perguntar ao Gio.AI onde o Giovanny a usou.",
    },
    contact: {
      subtitle: "O Que Vem a Seguir?",
      button: "Diga Olá",
    },
    footer: {
      built: "Feito por Giovanny Lino",
      backToTop: "Voltar ao topo",
    },
    notFound: {
      title: "Página não encontrada",
      back: "Voltar para o início",
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
      menu: "Menú",
      openMenu: "Abrir menú",
      closeMenu: "Cerrar menú",
      skip: "Saltar al contenido",
      theme: "Cambiar entre tema claro y oscuro",
      language: "Idioma",
    },
    hero: {
      greeting: "Hola, mi nombre es",
      name: "Giovanny Lino.",
      viewWork: "Ver Mis Proyectos",
      getInTouch: "Contáctame",
      scrollDown: "Ir a Sobre Mí",
      localTime: "Hora local",
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
      problem: "Problema",
      solution: "Solución",
    },
    education: {
      degrees: "Formación académica",
      certifications: "Certificaciones",
    },
    skills: {
      askHint: "Haz clic en una tecnología para preguntarle a Gio.AI dónde la usó Giovanny.",
    },
    contact: {
      subtitle: "¿Qué Sigue?",
      button: "Di Hola",
    },
    footer: {
      built: "Hecho por Giovanny Lino",
      backToTop: "Volver arriba",
    },
    notFound: {
      title: "Página no encontrada",
      back: "Volver al inicio",
    },
  },
} satisfies Record<Language, Translations>;
