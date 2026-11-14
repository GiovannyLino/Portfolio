// Strings the always-loaded parts of the assistant need: the launcher (button label and
// section teasers) and the "ask Gio.AI" entry points on the page (stack explorer, projects).
import type { Language } from "@/i18n/translations";
import type { SectionId } from "@/lib/sections";

export type TeaserKey = SectionId | "top";

export interface LauncherCopy {
  open: string;
  dismissTeaser: string;
  teasers: Record<TeaserKey, { text: string; question: string }>;
  ask: {
    skill: (name: string) => string;
    skillLabel: (name: string) => string;
    project: (title: string) => string;
    projectLabel: (title: string) => string;
  };
}

export const launcherCopy = {
  pt: {
    open: "Abrir o assistente Gio.AI",
    dismissTeaser: "Dispensar sugestão",
    teasers: {
      top: { text: "Oi! Sou o Gio.AI. Quer um resumo do Giovanny em 30 segundos?", question: "Me dá um resumo rápido do Giovanny?" },
      about: { text: "Quer saber o que o Giovanny faz na Logicalis?", question: "O que o Giovanny faz na Logicalis?" },
      skills: { text: "Pergunte onde ele usou qualquer tecnologia daqui.", question: "Onde ele usou LLMs e agentes de IA?" },
      experience: { text: "Pergunte como ele usa automação no dia a dia.", question: "Como ele usa automação no trabalho?" },
      projects: { text: "Quer saber como eu funciono por dentro? Sou um agente de IA.", question: "Como funciona o Gio.AI?" },
      education: { text: "Curioso sobre as certificações de automação dele?", question: "Quais certificações ele tem?" },
      contact: { text: "Posso abrir o contato com uma mensagem pronta.", question: "Quero entrar em contato com o Giovanny" },
    },
    ask: {
      skill: (name) => `Onde o Giovanny usou ${name}?`,
      skillLabel: (name) => `Perguntar ao Gio.AI onde ${name} foi usado`,
      project: (title) => `Me conta sobre o projeto ${title}`,
      projectLabel: (title) => `Perguntar ao Gio.AI sobre ${title}`,
    },
  },
  en: {
    open: "Open the Gio.AI assistant",
    dismissTeaser: "Dismiss suggestion",
    teasers: {
      top: { text: "Hi! I'm Gio.AI. Want a 30-second summary of Giovanny?", question: "Can you give me a quick summary of Giovanny?" },
      about: { text: "Curious what Giovanny does at Logicalis?", question: "What does Giovanny do at Logicalis?" },
      skills: { text: "Ask where he used any technology here.", question: "Where did he use LLMs and AI agents?" },
      experience: { text: "Ask how he uses automation day to day.", question: "How does he use automation at work?" },
      projects: { text: "Curious how I work inside? I'm an AI agent.", question: "How does Gio.AI work?" },
      education: { text: "Curious about his automation certifications?", question: "Which certifications does he have?" },
      contact: { text: "I can open the contact form with a message ready.", question: "I'd like to get in touch with Giovanny" },
    },
    ask: {
      skill: (name) => `Where did Giovanny use ${name}?`,
      skillLabel: (name) => `Ask Gio.AI where ${name} was used`,
      project: (title) => `Tell me about the ${title} project`,
      projectLabel: (title) => `Ask Gio.AI about ${title}`,
    },
  },
  es: {
    open: "Abrir el asistente Gio.AI",
    dismissTeaser: "Descartar sugerencia",
    teasers: {
      top: { text: "¡Hola! Soy Gio.AI. ¿Quieres un resumen de Giovanny en 30 segundos?", question: "¿Me das un resumen rápido de Giovanny?" },
      about: { text: "¿Quieres saber qué hace Giovanny en Logicalis?", question: "¿Qué hace Giovanny en Logicalis?" },
      skills: { text: "Pregunta dónde usó cualquier tecnología de aquí.", question: "¿Dónde usó LLMs y agentes de IA?" },
      experience: { text: "Pregunta cómo usa la automatización en el día a día.", question: "¿Cómo usa la automatización en el trabajo?" },
      projects: { text: "¿Quieres saber cómo funciono por dentro? Soy un agente de IA.", question: "¿Cómo funciona Gio.AI?" },
      education: { text: "¿Curioso por sus certificaciones de automatización?", question: "¿Qué certificaciones tiene?" },
      contact: { text: "Puedo abrir el contacto con un mensaje listo.", question: "Quiero ponerme en contacto con Giovanny" },
    },
    ask: {
      skill: (name) => `¿Dónde usó Giovanny ${name}?`,
      skillLabel: (name) => `Preguntar a Gio.AI dónde se usó ${name}`,
      project: (title) => `Cuéntame sobre el proyecto ${title}`,
      projectLabel: (title) => `Preguntar a Gio.AI sobre ${title}`,
    },
  },
} satisfies Record<Language, LauncherCopy>;
