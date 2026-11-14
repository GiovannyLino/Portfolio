// Source: CV header and "Resumo profissional" (Oct 2026). Tagline and contact copy
// carried over from the previous version of the site.
import type { Profile } from "./types.js";

// There is no Spanish CV: Spanish visitors get the English one.
const RESUME_PT = "/Giovanny_Lino_CV_DevOps_PT.pdf";
const RESUME_EN = "/Giovanny_Lino_Resume_DevOps_EN.pdf";

export const profile = {
  name: "Giovanny Lino",
  fullName: "Giovanny Lino Tavares de Oliveira",
  headline: {
    en: "Service Provider Analyst | DevOps, SRE & Infrastructure Automation",
    pt: "Service Provider Analyst | DevOps, SRE e Automação de Infraestrutura",
    es: "Service Provider Analyst | DevOps, SRE y Automatización de Infraestructura",
  },
  location: {
    en: "São Paulo, SP, Brazil",
    pt: "São Paulo, SP",
    es: "São Paulo, SP, Brasil",
  },
  tagline: {
    en: "I engineer the bridge between code and infrastructure.",
    pt: "Eu construo a ponte entre código e infraestrutura.",
    es: "Construyo el puente entre código e infraestructura.",
  },
  intro: {
    en: "Service Provider Analyst at Logicalis and Computer Science student — currently focused on becoming a DevOps professional.",
    pt: "Service Provider Analyst na Logicalis e estudante de Ciência da Computação — atualmente focado em me tornar um profissional na área de DevOps.",
    es: "Service Provider Analyst en Logicalis y estudiante de Ciencias de la Computación — actualmente enfocado en convertirme en un profesional del área de DevOps.",
  },
  about: {
    en: [
      [
        "I'm a ",
        { text: "Service Provider Analyst at Logicalis", tone: "strong" },
        " and a ",
        { text: "Computer Science student", tone: "strong" },
        ", working hands-on with infrastructure automation, observability and the support of mission-critical telecom carrier environments.",
      ],
      [
        "My experience spans Linux, containers (Docker and Podman), Infrastructure as Code (Ansible and Terraform), CI/CD pipelines, AWS and observability. I also build with ",
        { text: "generative AI", tone: "accent" },
        ": ",
        { text: "LLM", tone: "accent" },
        " integrations and ",
        { text: "AI agents", tone: "accent" },
        " with tool calling, like Gio.AI, this portfolio's assistant.",
      ],
      [
        "I bring a solid software development background (Python, Node.js, JavaScript/TypeScript, SQL) to building automation, REST API integrations and internal operations tooling. My goal is to work as a ",
        { text: "DevOps/SRE Engineer", tone: "accent" },
        ", focused on automation, reliability, continuous delivery and Infrastructure as Code culture.",
      ],
    ],
    pt: [
      [
        "Sou ",
        { text: "Service Provider Analyst na Logicalis", tone: "strong" },
        " e ",
        { text: "estudante de Ciência da Computação", tone: "strong" },
        ", com atuação prática em automação de infraestrutura, observabilidade e sustentação de ambientes críticos de operadoras de telecomunicações.",
      ],
      [
        "Tenho experiência com Linux, containers (Docker e Podman), Infrastructure as Code (Ansible e Terraform), pipelines de CI/CD, AWS e observabilidade. Também desenvolvo soluções com ",
        { text: "IA generativa", tone: "accent" },
        ": integrações com ",
        { text: "LLMs", tone: "accent" },
        " e ",
        { text: "agentes de IA", tone: "accent" },
        " com tool calling, como o Gio.AI, o assistente deste portfólio.",
      ],
      [
        "Aplico minha base em desenvolvimento (Python, Node.js, JavaScript/TypeScript, SQL) na construção de automações, integrações via APIs REST e ferramentas internas de operação. Meu objetivo é atuar como ",
        { text: "Engenheiro DevOps/SRE", tone: "accent" },
        ", com foco em automação, confiabilidade, entrega contínua e cultura de Infrastructure as Code.",
      ],
    ],
    es: [
      [
        "Soy ",
        { text: "Service Provider Analyst en Logicalis", tone: "strong" },
        " y ",
        { text: "estudiante de Ciencias de la Computación", tone: "strong" },
        ", con experiencia práctica en automatización de infraestructura, observabilidad y soporte de entornos críticos de operadoras de telecomunicaciones.",
      ],
      [
        "Tengo experiencia con Linux, contenedores (Docker y Podman), Infraestructura como Código (Ansible y Terraform), pipelines de CI/CD, AWS y observabilidad. También desarrollo soluciones con ",
        { text: "IA generativa", tone: "accent" },
        ": integraciones con ",
        { text: "LLMs", tone: "accent" },
        " y ",
        { text: "agentes de IA", tone: "accent" },
        " con tool calling, como Gio.AI, el asistente de este portafolio.",
      ],
      [
        "Aplico mi base en desarrollo (Python, Node.js, JavaScript/TypeScript, SQL) a la construcción de automatizaciones, integraciones vía APIs REST y herramientas internas de operación. Mi objetivo es trabajar como ",
        { text: "Ingeniero DevOps/SRE", tone: "accent" },
        ", con foco en automatización, confiabilidad, entrega continua y cultura de Infraestructura como Código.",
      ],
    ],
  },
  careerGoal: {
    en: "To work as a DevOps/SRE Engineer focused on automation, reliability, continuous delivery and Infrastructure as Code culture.",
    pt: "Atuar como Engenheiro DevOps/SRE, com foco em automação, confiabilidade, entrega contínua e cultura de Infrastructure as Code.",
    es: "Trabajar como Ingeniero DevOps/SRE, con foco en automatización, confiabilidad, entrega continua y cultura de Infraestructura como Código.",
  },
  availability: {
    en: "I'm currently open to new opportunities and always happy to talk about DevOps, SRE and network automation. Whether you have a question, a project idea, or just want to say hi — my inbox is always open!",
    pt: "Estou aberto a novas oportunidades e sempre disposto a conversar sobre DevOps, SRE e automação de redes. Se você tem uma pergunta, uma ideia de projeto, ou só quer dar um oi — minha inbox está sempre aberta!",
    es: "Estoy abierto a nuevas oportunidades y siempre dispuesto a conversar sobre DevOps, SRE y automatización de redes. Si tienes una pregunta, una idea de proyecto, o solo quieres saludar — ¡mi inbox está siempre abierta!",
  },
  languages: [
    { name: { en: "Portuguese", pt: "Português", es: "Portugués" }, level: { en: "Native", pt: "Nativo", es: "Nativo" } },
    { name: { en: "English", pt: "Inglês", es: "Inglés" }, level: { en: "Advanced", pt: "Avançado", es: "Avanzado" } },
    {
      name: { en: "Spanish", pt: "Espanhol", es: "Español" },
      level: { en: "Intermediate", pt: "Intermediário", es: "Intermedio" },
    },
    { name: { en: "French", pt: "Francês", es: "Francés" }, level: { en: "Basic", pt: "Básico", es: "Básico" } },
  ],
  links: {
    email: "giovannylino9@gmail.com",
    github: "https://github.com/GiovannyLino",
    linkedin: "https://www.linkedin.com/in/giovanny-lino/",
    resume: { en: RESUME_EN, pt: RESUME_PT, es: RESUME_EN },
  },
} as const satisfies Profile;
