// Curated answers in the assistant's voice (third person). Facts are interpolated from the
// other files so the FAQ cannot drift from the CV. Also the chat's offline fallback.
import { certifications, education } from "./education.js";
import { profile } from "./profile.js";
import { allExperience, featuredProjects } from "./queries.js";
import type { FaqEntry, Language, Localized } from "./types.js";
import { formatPeriod, formatYearMonth, localize } from "./utils.js";

const perLanguage = (build: (lang: Language) => string): Localized => ({
  en: build("en"),
  pt: build("pt"),
  es: build("es"),
});

const [current, previous] = allExperience;
const [degree, technical] = education;

export const faq = [
  {
    id: "who",
    question: { en: "Who is Giovanny?", pt: "Quem é o Giovanny?", es: "¿Quién es Giovanny?" },
    answer: {
      en: `Giovanny Lino is a ${current.role.en} at ${current.company} and a Computer Science student at USCS. He works with infrastructure automation, observability and the support of mission-critical telecom carrier environments.`,
      pt: `Giovanny Lino é ${current.role.pt} na ${current.company} e estudante de Ciência da Computação na USCS. Ele atua com automação de infraestrutura, observabilidade e sustentação de ambientes críticos de operadoras de telecomunicações.`,
      es: `Giovanny Lino es ${current.role.es} en ${current.company} y estudiante de Ciencias de la Computación en la USCS. Trabaja con automatización de infraestructura, observabilidad y soporte de entornos críticos de operadoras de telecomunicaciones.`,
    },
    keywords: ["who", "quem", "quien", "about", "sobre", "perfil", "profile", "summary", "resumo", "resumen"],
    section: "about",
  },
  {
    id: "current-role",
    question: {
      en: `What does he do at ${current.company}?`,
      pt: `O que ele faz na ${current.company}?`,
      es: `¿Qué hace en ${current.company}?`,
    },
    answer: {
      en: `Since ${formatYearMonth(current.period.start, "en")} he has been a ${current.role.en}, supporting telecom carrier environments: availability, performance and SLA compliance, end-to-end observability with Splunk and ThousandEyes, automation with Ansible and Python, and L2/L3 incident troubleshooting following ITIL. Before that he was a ${previous.role.en} (${formatPeriod(previous.period, "en")}).`,
      pt: `Desde ${formatYearMonth(current.period.start, "pt")} ele é ${current.role.pt}, sustentando ambientes de operadoras de telecomunicações: disponibilidade, desempenho e SLA, observabilidade fim a fim com Splunk e ThousandEyes, automação com Ansible e Python e troubleshooting de incidentes N2/N3 seguindo ITIL. Antes, foi ${previous.role.pt} (${formatPeriod(previous.period, "pt")}).`,
      es: `Desde ${formatYearMonth(current.period.start, "es")} es ${current.role.es}, dando soporte a entornos de operadoras de telecomunicaciones: disponibilidad, rendimiento y SLA, observabilidad de extremo a extremo con Splunk y ThousandEyes, automatización con Ansible y Python y troubleshooting de incidentes N2/N3 según ITIL. Antes fue ${previous.role.es} (${formatPeriod(previous.period, "es")}).`,
    },
    keywords: ["logicalis", "job", "work", "trabalho", "trabajo", "role", "cargo", "puesto", "experience", "experiencia", "analyst", "analista"],
    section: "experience",
  },
  {
    id: "observability",
    question: {
      en: "Which observability tools does he work with?",
      pt: "Com quais ferramentas de observabilidade ele trabalha?",
      es: "¿Con qué herramientas de observabilidad trabaja?",
    },
    answer: {
      en: "Mainly Splunk and ThousandEyes: dashboards, searches and alerts, event correlation and root cause analysis (RCA) for telecom customer services. His skills also include Power BI and Metabase, and he holds Cisco's Black Belt AIOps certification.",
      pt: "Principalmente Splunk e ThousandEyes: dashboards, buscas e alertas, correlação de eventos e análise de causa raiz (RCA) para serviços de clientes telecom. As competências dele também incluem Power BI e Metabase, e ele tem a certificação Black Belt AIOps da Cisco.",
      es: "Principalmente Splunk y ThousandEyes: dashboards, búsquedas y alertas, correlación de eventos y análisis de causa raíz (RCA) para servicios de clientes telecom. Sus habilidades también incluyen Power BI y Metabase, y tiene la certificación Black Belt AIOps de Cisco.",
    },
    keywords: ["observability", "observabilidade", "observabilidad", "monitoring", "monitoramento", "monitoreo", "splunk", "thousandeyes", "dashboards", "alerts", "alertas"],
    section: "experience",
  },
  {
    id: "network-automation",
    question: {
      en: "What has he automated with Ansible?",
      pt: "O que ele já automatizou com Ansible?",
      es: "¿Qué ha automatizado con Ansible?",
    },
    answer: {
      en: "Switch and router configuration (playbooks, roles, dynamic inventory and Jinja2 templates); a pipeline that uses NetBox as source of truth to drive Ansible and provision devices in the monitoring platform via REST API; and PoC environment provisioning in PoC-in-a-Box. He validates automation in PNETLab and Containerlab labs before it reaches production.",
      pt: "Configuração de switches e roteadores (playbooks, roles, inventário dinâmico e templates Jinja2); um pipeline que usa o NetBox como source of truth para guiar o Ansible e provisionar dispositivos na plataforma de monitoramento via API REST; e o provisionamento de ambientes de PoC no PoC-in-a-Box. Ele valida as automações em laboratórios PNETLab e Containerlab antes de chegarem à produção.",
      es: "Configuración de switches y routers (playbooks, roles, inventario dinámico y plantillas Jinja2); un pipeline que usa NetBox como source of truth para guiar a Ansible y aprovisionar dispositivos en la plataforma de monitoreo vía API REST; y el aprovisionamiento de entornos de PoC en PoC-in-a-Box. Valida las automatizaciones en laboratorios PNETLab y Containerlab antes de llevarlas a producción.",
    },
    keywords: ["ansible", "automation", "automacao", "automatizacion", "netbox", "network", "rede", "red", "iac", "playbooks"],
    section: "projects",
    projectId: "netbox-ansible-pipeline",
  },
  {
    id: "featured-projects",
    question: {
      en: "What are his main projects?",
      pt: "Quais são os principais projetos dele?",
      es: "¿Cuáles son sus principales proyectos?",
    },
    answer: perLanguage((lang) => {
      const titles = featuredProjects.map((project) => localize(project.title, lang)).join("; ");
      const lead = { en: "His featured projects are", pt: "Os projetos em destaque são", es: "Sus proyectos destacados son" };
      return `${lead[lang]}: ${titles}.`;
    }),
    keywords: ["projects", "projetos", "proyectos", "portfolio", "built", "construiu", "construyo"],
    section: "projects",
  },
  {
    id: "education",
    question: { en: "Where does he study?", pt: "Onde ele estuda?", es: "¿Dónde estudia?" },
    answer: {
      en: `He is pursuing a ${degree.degree.en} at ${degree.institution} (${degree.period.start}–${degree.period.end}) and holds a ${technical.degree.en} from ${technical.institution} (${technical.period.start}–${technical.period.end}).`,
      pt: `Ele cursa ${degree.degree.pt} na ${degree.institution} (${degree.period.start}–${degree.period.end}) e é ${technical.degree.pt} pelo ${technical.institution} (${technical.period.start}–${technical.period.end}).`,
      es: `Cursa la ${degree.degree.es} en la ${degree.institution} (${degree.period.start}–${degree.period.end}) y es ${technical.degree.es} por el ${technical.institution} (${technical.period.start}–${technical.period.end}).`,
    },
    keywords: ["education", "formacao", "formacion", "university", "universidade", "universidad", "degree", "graduacao", "college", "faculdade", "uscs", "senai"],
    section: "education",
  },
  {
    id: "certifications",
    question: {
      en: "Which certifications does he have?",
      pt: "Quais certificações ele tem?",
      es: "¿Qué certificaciones tiene?",
    },
    answer: perLanguage((lang) => {
      const list = certifications.map((cert) => `${cert.name} (${cert.issuer}, ${cert.year})`).join("; ");
      const lead = { en: "He holds", pt: "Ele possui", es: "Tiene" };
      return `${lead[lang]}: ${list}.`;
    }),
    keywords: ["certifications", "certificacoes", "certificaciones", "certified", "certificado", "iquall", "aws", "cisco"],
    section: "education",
  },
  {
    id: "availability",
    question: {
      en: "Is he open to new opportunities?",
      pt: "Ele está aberto a novas oportunidades?",
      es: "¿Está abierto a nuevas oportunidades?",
    },
    answer: {
      en: `Yes, he says he is open to new opportunities. Career goal: ${profile.careerGoal.en}`,
      pt: `Sim, ele está aberto a novas oportunidades. Objetivo de carreira: ${profile.careerGoal.pt}`,
      es: `Sí, está abierto a nuevas oportunidades. Objetivo profesional: ${profile.careerGoal.es}`,
    },
    keywords: ["hiring", "hire", "contratar", "vaga", "vacante", "job", "opportunity", "oportunidade", "oportunidad", "available", "disponivel", "disponible"],
    section: "contact",
  },
  {
    id: "contact",
    question: {
      en: "How can I contact him?",
      pt: "Como entro em contato com ele?",
      es: "¿Cómo puedo contactarlo?",
    },
    answer: {
      en: `By email at ${profile.links.email}, on LinkedIn (${profile.links.linkedin}) or GitHub (${profile.links.github}). His resume can be downloaded from the site.`,
      pt: `Por email em ${profile.links.email}, pelo LinkedIn (${profile.links.linkedin}) ou pelo GitHub (${profile.links.github}). O currículo pode ser baixado no site.`,
      es: `Por email en ${profile.links.email}, en LinkedIn (${profile.links.linkedin}) o en GitHub (${profile.links.github}). Su currículum se puede descargar en el sitio.`,
    },
    keywords: ["contact", "contato", "contacto", "falar", "conversar", "hablar", "talk", "reach", "email", "mail", "linkedin", "github", "resume", "curriculo", "curriculum", "cv"],
    section: "contact",
  },
  {
    id: "languages",
    question: {
      en: "Which languages does he speak?",
      pt: "Quais idiomas ele fala?",
      es: "¿Qué idiomas habla?",
    },
    answer: perLanguage((lang) =>
      profile.languages.map((spoken) => `${spoken.name[lang]} (${spoken.level[lang].toLowerCase()})`).join(", ") + ".",
    ),
    keywords: ["languages", "idiomas", "english", "ingles", "spanish", "espanhol", "espanol", "french", "frances", "speak", "fala", "habla"],
    section: "about",
  },
] as const satisfies readonly FaqEntry[];
