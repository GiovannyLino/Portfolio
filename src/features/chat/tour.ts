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

const SHOWCASE_PROJECT = "netbox-ansible-pipeline";

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
      experience: `Na ${company} desde ${since}: começou como estagiário e hoje é ${role}. As atividades incluem observabilidade com **Splunk e ThousandEyes**, automação com **Ansible e Python** e incidentes N2/N3 seguindo ITIL.`,
      projects: `Um destaque é o **pipeline NetBox → Ansible**: o NetBox vira a source of truth e os dispositivos são provisionados no monitoramento via API REST, sem cadastro manual.`,
      skills: `As competências vão de cloud (AWS) e containers (Docker, Podman) a Infrastructure as Code (Ansible, Terraform) e observabilidade. Dica: clique numa tecnologia para me perguntar onde ele a usou.`,
      education: `Ele tem ${certCount} certificações, entre elas a **${certName}**, e cursa Ciência da Computação na USCS, com conclusão prevista para ${graduation}.`,
      contact: `É isso! Para falar com ele, baixe o currículo, chame no LinkedIn ou use o botão de e-mail. E se tiver qualquer pergunta, é só me chamar.`,
    },
    en: {
      about: `Meet Giovanny: **${role} at ${company}** and a Computer Science student at USCS. He works on infrastructure automation, observability and the support of telecom carrier environments.`,
      experience: `At ${company} since ${since}: he started as an intern and is now a ${role}. His work includes observability with **Splunk and ThousandEyes**, automation with **Ansible and Python**, and L2/L3 incidents following ITIL.`,
      projects: `A highlight is the **NetBox → Ansible pipeline**: NetBox becomes the source of truth and devices are provisioned in the monitoring platform via REST API, with no manual registration.`,
      skills: `His skills range from cloud (AWS) and containers (Docker, Podman) to Infrastructure as Code (Ansible, Terraform) and observability. Tip: click any technology to ask me where he used it.`,
      education: `He holds ${certCount} certifications, including **${certName}**, and is studying Computer Science at USCS, expected to finish in ${graduation}.`,
      contact: `That's it! To talk to him, download the résumé, reach out on LinkedIn or use the email button. And if you have any question, just ask me.`,
    },
    es: {
      about: `Este es Giovanny: **${role} en ${company}** y estudiante de Ciencias de la Computación en la USCS. Trabaja con automatización de infraestructura, observabilidad y soporte de entornos de operadoras de telecomunicaciones.`,
      experience: `En ${company} desde ${since}: empezó como pasante y hoy es ${role}. Sus actividades incluyen observabilidad con **Splunk y ThousandEyes**, automatización con **Ansible y Python** e incidentes N2/N3 según ITIL.`,
      projects: `Un destacado es el **pipeline NetBox → Ansible**: NetBox pasa a ser la source of truth y los dispositivos se aprovisionan en el monitoreo vía API REST, sin registro manual.`,
      skills: `Sus habilidades van de cloud (AWS) y contenedores (Docker, Podman) a Infraestructura como Código (Ansible, Terraform) y observabilidad. Consejo: haz clic en cualquier tecnología para preguntarme dónde la usó.`,
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
