// Strings the always-loaded launcher needs (button label and section teasers).
import type { Language } from "@/i18n/translations";
import type { SectionId } from "@/lib/sections";

export type TeaserKey = SectionId | "top";

export interface LauncherCopy {
  open: string;
  dismissTeaser: string;
  teasers: Record<TeaserKey, { text: string; question: string }>;
}

export const launcherCopy = {
  pt: {
    open: "Abrir o assistente Gio.AI",
    dismissTeaser: "Dispensar sugestão",
    teasers: {
      top: { text: "Oi! Sou o Gio.AI. Quer um resumo do Giovanny em 30 segundos?", question: "Me dá um resumo rápido do Giovanny?" },
      about: { text: "Quer saber o que o Giovanny faz na Logicalis?", question: "O que o Giovanny faz na Logicalis?" },
      skills: { text: "Pergunte onde ele usou qualquer tecnologia daqui.", question: "Onde ele usou Ansible e Splunk?" },
      experience: { text: "Pergunte o que ele faz com observabilidade.", question: "O que ele faz com observabilidade na Logicalis?" },
      projects: { text: "Quer saber como ele montou o pipeline NetBox → Ansible?", question: "Como funciona o pipeline NetBox → Ansible?" },
      education: { text: "Curioso sobre as certificações de automação dele?", question: "Quais certificações ele tem?" },
      contact: { text: "Posso abrir o contato com uma mensagem pronta.", question: "Quero entrar em contato com o Giovanny" },
    },
  },
  en: {
    open: "Open the Gio.AI assistant",
    dismissTeaser: "Dismiss suggestion",
    teasers: {
      top: { text: "Hi! I'm Gio.AI. Want a 30-second summary of Giovanny?", question: "Can you give me a quick summary of Giovanny?" },
      about: { text: "Curious what Giovanny does at Logicalis?", question: "What does Giovanny do at Logicalis?" },
      skills: { text: "Ask where he used any technology here.", question: "Where did he use Ansible and Splunk?" },
      experience: { text: "Ask what he does with observability.", question: "What does he do with observability at Logicalis?" },
      projects: { text: "Want to know how he built the NetBox → Ansible pipeline?", question: "How does the NetBox → Ansible pipeline work?" },
      education: { text: "Curious about his automation certifications?", question: "Which certifications does he have?" },
      contact: { text: "I can open the contact form with a message ready.", question: "I'd like to get in touch with Giovanny" },
    },
  },
  es: {
    open: "Abrir el asistente Gio.AI",
    dismissTeaser: "Descartar sugerencia",
    teasers: {
      top: { text: "¡Hola! Soy Gio.AI. ¿Quieres un resumen de Giovanny en 30 segundos?", question: "¿Me das un resumen rápido de Giovanny?" },
      about: { text: "¿Quieres saber qué hace Giovanny en Logicalis?", question: "¿Qué hace Giovanny en Logicalis?" },
      skills: { text: "Pregunta dónde usó cualquier tecnología de aquí.", question: "¿Dónde usó Ansible y Splunk?" },
      experience: { text: "Pregunta qué hace con observabilidad.", question: "¿Qué hace con observabilidad en Logicalis?" },
      projects: { text: "¿Quieres saber cómo armó el pipeline NetBox → Ansible?", question: "¿Cómo funciona el pipeline NetBox → Ansible?" },
      education: { text: "¿Curioso por sus certificaciones de automatización?", question: "¿Qué certificaciones tiene?" },
      contact: { text: "Puedo abrir el contacto con un mensaje listo.", question: "Quiero ponerme en contacto con Giovanny" },
    },
  },
} satisfies Record<Language, LauncherCopy>;
