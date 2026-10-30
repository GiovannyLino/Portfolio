// Copy for the lazy chat panel. The launcher's own strings live in launcher-copy.ts so the
// main bundle doesn't carry the whole panel's text in three languages.
import type { Language } from "@/i18n/translations";
import type { ChatErrorCode, ToolName } from "./protocol";

export interface ChatCopy {
  name: string;
  tagline: string;
  close: string;
  newChat: string;
  greeting: string;
  placeholder: string;
  send: string;
  stop: string;
  stopped: string;
  you: string;
  status: { online: string; thinking: string; writing: string };
  tools: Partial<Record<ToolName, string>>;
  starters: string[];
  starterTitle: string;
  errors: Record<ChatErrorCode, string> & { rateLimited: (minutes: number) => string; fallbackLead: string; retry: string };
  cards: {
    viewOnPage: string;
    code: string;
    demo: string;
    internal: string;
    usedIn: string;
    listedOnly: string;
    copy: string;
    copied: string;
    resume: string;
    openForm: string;
    sources: string;
    contactTitle: string;
  };
  code: { copy: string; copied: string };
}

export const chatCopy = {
  pt: {
    name: "Gio.AI",
    tagline: "assistente do portfólio",
    close: "Fechar o assistente",
    newChat: "Nova conversa",
    greeting:
      "Oi! Eu sou o **Gio.AI**, o assistente deste portfólio. Conheço a trajetória, os projetos e as skills do Giovanny — por onde começamos?",
    placeholder: "Pergunte sobre o Giovanny…",
    send: "Enviar",
    stop: "Parar",
    stopped: "_Resposta interrompida._",
    you: "Você",
    status: { online: "online", thinking: "pensando…", writing: "escrevendo…" },
    tools: {
      searchPortfolio: "procurando no portfólio…",
      getProjectDetails: "abrindo o projeto…",
      webSearch: "consultando a Wikipedia…",
    },
    starterTitle: "Sugestões para começar",
    starters: ["O que ele faz na Logicalis?", "Mostre os projetos de automação", "Quais certificações ele tem?", "Como falar com ele?"],
    errors: {
      invalid_request: "Não consegui entender essa mensagem.",
      forbidden_origin: "Este chat só funciona no site do Giovanny.",
      rate_limited: "Muitas perguntas seguidas.",
      upstream_quota: "Atingi meu limite de respostas por agora.",
      upstream_unavailable: "Estou com dificuldade para pensar agora.",
      internal: "Algo deu errado do meu lado.",
      rateLimited: (minutes) => `Muitas perguntas seguidas 😅 Tente de novo em ${minutes} min.`,
      fallbackLead: "Enquanto isso, aqui vai o que eu sei:",
      retry: "Tentar de novo",
    },
    cards: {
      viewOnPage: "Ver na página",
      code: "Código",
      demo: "Demo",
      internal: "Projeto interno — sem código público",
      usedIn: "Usado em",
      listedOnly: "Listado nas competências do CV",
      copy: "Copiar",
      copied: "Copiado!",
      resume: "Currículo (PDF)",
      openForm: "Ir para o contato",
      sources: "Fontes",
      contactTitle: "Falar com o Giovanny",
    },
    code: { copy: "Copiar código", copied: "Copiado" },
  },
  en: {
    name: "Gio.AI",
    tagline: "portfolio assistant",
    close: "Close the assistant",
    newChat: "New conversation",
    greeting:
      "Hi! I'm **Gio.AI**, this portfolio's assistant. I know Giovanny's career, projects and skills — where should we start?",
    placeholder: "Ask about Giovanny…",
    send: "Send",
    stop: "Stop",
    stopped: "_Answer stopped._",
    you: "You",
    status: { online: "online", thinking: "thinking…", writing: "typing…" },
    tools: {
      searchPortfolio: "searching the portfolio…",
      getProjectDetails: "opening the project…",
      webSearch: "checking Wikipedia…",
    },
    starterTitle: "Ideas to start",
    starters: [
      "What does he do at Logicalis?",
      "Show me his automation projects",
      "Which certifications does he have?",
      "How can I get in touch?",
    ],
    errors: {
      invalid_request: "I couldn't understand that message.",
      forbidden_origin: "This chat only works on Giovanny's site.",
      rate_limited: "Too many questions in a row.",
      upstream_quota: "I've hit my answer limit for now.",
      upstream_unavailable: "I'm having trouble thinking right now.",
      internal: "Something went wrong on my side.",
      rateLimited: (minutes) => `Too many questions in a row 😅 Try again in ${minutes} min.`,
      fallbackLead: "Meanwhile, here's what I know:",
      retry: "Try again",
    },
    cards: {
      viewOnPage: "View on page",
      code: "Code",
      demo: "Demo",
      internal: "Internal project — no public code",
      usedIn: "Used in",
      listedOnly: "Listed among the CV skills",
      copy: "Copy",
      copied: "Copied!",
      resume: "Résumé (PDF)",
      openForm: "Go to contact",
      sources: "Sources",
      contactTitle: "Talk to Giovanny",
    },
    code: { copy: "Copy code", copied: "Copied" },
  },
  es: {
    name: "Gio.AI",
    tagline: "asistente del portafolio",
    close: "Cerrar el asistente",
    newChat: "Nueva conversación",
    greeting:
      "¡Hola! Soy **Gio.AI**, el asistente de este portafolio. Conozco la trayectoria, los proyectos y las habilidades de Giovanny — ¿por dónde empezamos?",
    placeholder: "Pregunta sobre Giovanny…",
    send: "Enviar",
    stop: "Detener",
    stopped: "_Respuesta interrumpida._",
    you: "Tú",
    status: { online: "en línea", thinking: "pensando…", writing: "escribiendo…" },
    tools: {
      searchPortfolio: "buscando en el portafolio…",
      getProjectDetails: "abriendo el proyecto…",
      webSearch: "consultando Wikipedia…",
    },
    starterTitle: "Ideas para empezar",
    starters: [
      "¿Qué hace en Logicalis?",
      "Muéstrame sus proyectos de automatización",
      "¿Qué certificaciones tiene?",
      "¿Cómo puedo ponerme en contacto?",
    ],
    errors: {
      invalid_request: "No pude entender ese mensaje.",
      forbidden_origin: "Este chat solo funciona en el sitio de Giovanny.",
      rate_limited: "Demasiadas preguntas seguidas.",
      upstream_quota: "Alcancé mi límite de respuestas por ahora.",
      upstream_unavailable: "Me está costando pensar en este momento.",
      internal: "Algo salió mal de mi lado.",
      rateLimited: (minutes) => `Demasiadas preguntas seguidas 😅 Inténtalo de nuevo en ${minutes} min.`,
      fallbackLead: "Mientras tanto, esto es lo que sé:",
      retry: "Intentar de nuevo",
    },
    cards: {
      viewOnPage: "Ver en la página",
      code: "Código",
      demo: "Demo",
      internal: "Proyecto interno — sin código público",
      usedIn: "Usado en",
      listedOnly: "Listado en las habilidades del CV",
      copy: "Copiar",
      copied: "¡Copiado!",
      resume: "Currículum (PDF)",
      openForm: "Ir al contacto",
      sources: "Fuentes",
      contactTitle: "Hablar con Giovanny",
    },
    code: { copy: "Copiar código", copied: "Copiado" },
  },
} satisfies Record<Language, ChatCopy>;
