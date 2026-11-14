// The guided tour: six stops narrated by Gio.AI. Scripted rather than generated, so it
// works without the LLM (and its free quota); facts are interpolated from the knowledge base.
import { allExperience, certifications, currentPosition, education, formatYearMonth, type Language } from "@/data/knowledge";
import type { UiAction } from "./protocol";

export interface TourStop {
  id: string;
  action: UiAction;
  /** Markdown, one or two sentences. */
  text: string;
}

const SHOWCASE_PROJECT = "gio-ai-assistant";

export function buildTour(lang: Language): TourStop[] {
  const role = currentPosition.role[lang];
  const company = currentPosition.company;
  const since = formatYearMonth(allExperience[allExperience.length - 1].period.start, lang);
  const certCount = certifications.length;
  const certName = certifications[0].name;
  const graduation = education[0].period.end;

  const text = {
    pt: {
      about: `Este é o Giovanny: **${role} na ${company}** e estudante de Ciência da Computação na USCS. Ele trabalha com automação de infraestrutura, observabilidade e sustentação de ambientes de operadoras de telecom.`,
      experience: `Na ${company} desde ${since}: começou como estagiário e hoje é ${role}. As atividades incluem automação com **Ansible e Python**, integrações via APIs REST e incidentes N2/N3 seguindo ITIL.`,
      projects: `Um destaque sou eu mesmo: o **Gio.AI** é um agente com **LLM e tool calling** que o Giovanny construiu. Eu busco no conteúdo do portfólio e movo a página enquanto respondo.`,
      skills: `As competências vão de **IA e LLMs** a cloud (AWS), containers (Docker, Podman) e Infrastructure as Code (Ansible, Terraform). Dica: clique numa tecnologia para me perguntar onde ele a usou.`,
      education: `Ele tem ${certCount} certificações, entre elas a **${certName}**, e cursa Ciência da Computação na USCS, com conclusão prevista para ${graduation}.`,
      contact: `É isso! Para falar com ele, baixe o currículo, chame no LinkedIn ou use o botão de e-mail. E se tiver qualquer pergunta, é só me chamar.`,
    },
    en: {
      about: `Meet Giovanny: **${role} at ${company}** and a Computer Science student at USCS. He works on infrastructure automation, observability and the support of telecom carrier environments.`,
      experience: `At ${company} since ${since}: he started as an intern and is now a ${role}. His work includes automation with **Ansible and Python**, REST API integrations and L2/L3 incidents following ITIL.`,
      projects: `One highlight is me: **Gio.AI** is an agent with an **LLM and tool calling** that Giovanny built. I search the portfolio's content and move the page while I answer.`,
      skills: `His skills range from **AI and LLMs** to cloud (AWS), containers (Docker, Podman) and Infrastructure as Code (Ansible, Terraform). Tip: click any technology to ask me where he used it.`,
      education: `He holds ${certCount} certifications, including **${certName}**, and is studying Computer Science at USCS, expected to finish in ${graduation}.`,
      contact: `That's it! To talk to him, download the résumé, reach out on LinkedIn or use the email button. And if you have any question, just ask me.`,
    },
    es: {
      about: `Este es Giovanny: **${role} en ${company}** y estudiante de Ciencias de la Computación en la USCS. Trabaja con automatización de infraestructura, observabilidad y soporte de entornos de operadoras de telecomunicaciones.`,
      experience: `En ${company} desde ${since}: empezó como pasante y hoy es ${role}. Sus actividades incluyen automatización con **Ansible y Python**, integraciones vía APIs REST e incidentes N2/N3 según ITIL.`,
      projects: `Un destacado soy yo: **Gio.AI** es un agente con **LLM y tool calling** que Giovanny construyó. Busco en el contenido del portafolio y muevo la página mientras respondo.`,
      skills: `Sus habilidades van de **IA y LLMs** a cloud (AWS), contenedores (Docker, Podman) e Infraestructura como Código (Ansible, Terraform). Consejo: haz clic en cualquier tecnología para preguntarme dónde la usó.`,
      education: `Tiene ${certCount} certificaciones, entre ellas **${certName}**, y estudia Ciencias de la Computación en la USCS, con finalización prevista en ${graduation}.`,
      contact: `¡Eso es todo! Para hablar con él, descarga el currículum, escríbele en LinkedIn o usa el botón de correo. Y si tienes alguna pregunta, solo pregúntame.`,
    },
  }[lang];

  return [
    { id: "about", action: { type: "navigate", section: "about" }, text: text.about },
    { id: "experience", action: { type: "navigate", section: "experience" }, text: text.experience },
    { id: "projects", action: { type: "highlightProject", projectId: SHOWCASE_PROJECT }, text: text.projects },
    { id: "skills", action: { type: "navigate", section: "skills" }, text: text.skills },
    { id: "education", action: { type: "navigate", section: "education" }, text: text.education },
    { id: "contact", action: { type: "navigate", section: "contact" }, text: text.contact },
  ];
}
