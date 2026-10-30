// Interface copy only. Everything about Giovanny (bio, projects, experience) lives in
// src/data/knowledge so the page and the chat assistant share one source of truth.
import type { SectionId } from "../lib/sections.js";

export type Language = "en" | "pt" | "es";

export type Translations = {
  nav: { links: Record<SectionId, string>; resume: string; primary: string; openMenu: string; closeMenu: string };
  hero: { greeting: string; name: string; viewWork: string; getInTouch: string; scrollDown: string };
  sections: Record<SectionId, string>;
  about: { recentTech: string; currentRole: string; location: string; education: string; languages: string };
  experience: { technologies: string };
  projects: { other: string; internal: string; sourceCode: string; liveDemo: string };
  education: { degrees: string; certifications: string };
  skills: { askHint: string };
  contact: {
    subtitle: string;
    form: {
      name: string;
      email: string;
      subject: string;
      message: string;
      namePlaceholder: string;
      emailPlaceholder: string;
      subjectPlaceholder: string;
      messagePlaceholder: string;
      submit: string;
      sending: string;
      prefilled: string;
      sent: string;
      mailtoOpened: string;
      failed: string;
      orEmail: string;
      defaultSubject: string;
      errors: { name: string; email: string; message: string };
    };
  };
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
    skills: {
      askHint: "Click a technology to ask Gio.AI where Giovanny used it.",
    },
    contact: {
      subtitle: "What's Next?",
      form: {
        name: "Name",
        email: "Email",
        subject: "Subject",
        message: "Message",
        namePlaceholder: "Your name",
        emailPlaceholder: "you@company.com",
        subjectPlaceholder: "What is it about?",
        messagePlaceholder: "Tell me about the opportunity, project or question…",
        submit: "Send message",
        sending: "Sending…",
        prefilled: "Gio.AI filled this in from your conversation — review it before sending.",
        sent: "Message sent! Thanks for reaching out.",
        mailtoOpened: "Your email app opened with the message ready. If nothing happened, write to",
        failed: "The message couldn't be sent. Please write to",
        orEmail: "Prefer email?",
        defaultSubject: "Contact from the portfolio",
        errors: {
          name: "Please enter your name.",
          email: "Please enter a valid email address.",
          message: "Please write at least 10 characters.",
        },
      },
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
    skills: {
      askHint: "Clique numa tecnologia para perguntar ao Gio.AI onde o Giovanny a usou.",
    },
    contact: {
      subtitle: "O Que Vem a Seguir?",
      form: {
        name: "Nome",
        email: "E-mail",
        subject: "Assunto",
        message: "Mensagem",
        namePlaceholder: "Seu nome",
        emailPlaceholder: "voce@empresa.com",
        subjectPlaceholder: "Sobre o que é?",
        messagePlaceholder: "Conte sobre a oportunidade, o projeto ou a dúvida…",
        submit: "Enviar mensagem",
        sending: "Enviando…",
        prefilled: "O Gio.AI preencheu a partir da sua conversa — revise antes de enviar.",
        sent: "Mensagem enviada! Obrigado pelo contato.",
        mailtoOpened: "Seu app de e-mail abriu com a mensagem pronta. Se nada aconteceu, escreva para",
        failed: "Não foi possível enviar a mensagem. Escreva para",
        orEmail: "Prefere e-mail?",
        defaultSubject: "Contato pelo portfólio",
        errors: {
          name: "Informe seu nome.",
          email: "Informe um e-mail válido.",
          message: "Escreva pelo menos 10 caracteres.",
        },
      },
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
    skills: {
      askHint: "Haz clic en una tecnología para preguntarle a Gio.AI dónde la usó Giovanny.",
    },
    contact: {
      subtitle: "¿Qué Sigue?",
      form: {
        name: "Nombre",
        email: "Correo",
        subject: "Asunto",
        message: "Mensaje",
        namePlaceholder: "Tu nombre",
        emailPlaceholder: "tu@empresa.com",
        subjectPlaceholder: "¿De qué se trata?",
        messagePlaceholder: "Cuéntame sobre la oportunidad, el proyecto o la duda…",
        submit: "Enviar mensaje",
        sending: "Enviando…",
        prefilled: "Gio.AI lo completó a partir de tu conversación — revísalo antes de enviar.",
        sent: "¡Mensaje enviado! Gracias por escribir.",
        mailtoOpened: "Tu app de correo se abrió con el mensaje listo. Si no pasó nada, escribe a",
        failed: "No se pudo enviar el mensaje. Escribe a",
        orEmail: "¿Prefieres correo?",
        defaultSubject: "Contacto desde el portafolio",
        errors: {
          name: "Escribe tu nombre.",
          email: "Escribe un correo válido.",
          message: "Escribe al menos 10 caracteres.",
        },
      },
    },
    footer: {
      built: "Hecho por Giovanny Lino",
    },
  },
} satisfies Record<Language, Translations>;
