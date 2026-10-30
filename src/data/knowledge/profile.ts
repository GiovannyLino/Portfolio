// Source: CV header and "Resumo profissional" (Oct 2026). Tagline and contact copy
// carried over from the previous version of the site.
import type { Profile } from "./types";

// Points at the PDF currently in public/. Swap per language once the new CVs are there.
const RESUME_PATH = "/Giovanny_Lino_CV_2026.pdf";

export const profile = {
  name: "Giovanny Lino",
  fullName: "Giovanny Lino Tavares de Oliveira",
  headline: {
    en: "Service Provider Analyst | DevOps, SRE & Infrastructure Automation",
    pt: "Analista de Service Provider | DevOps, SRE e Automação de Infraestrutura",
    es: "Analista de Service Provider | DevOps, SRE y Automatización de Infraestructura",
  },
  location: {
    en: "Santo André, São Paulo, Brazil",
    pt: "Santo André, São Paulo, Brasil",
    es: "Santo André, São Paulo, Brasil",
  },
  tagline: {
    en: "I engineer the bridge between code and infrastructure.",
    pt: "Eu construo a ponte entre código e infraestrutura.",
    es: "Construyo el puente entre código e infraestructura.",
  },
  intro: {
    en: "Service Provider Analyst at Logicalis and Computer Science student — automating infrastructure, building observability with Splunk and ThousandEyes, and supporting mission-critical telecom environments.",
    pt: "Analista de Service Provider na Logicalis e estudante de Ciência da Computação — automatizo infraestrutura, construo observabilidade com Splunk e ThousandEyes e sustento ambientes críticos de operadoras de telecom.",
    es: "Analista de Service Provider en Logicalis y estudiante de Ciencias de la Computación — automatizo infraestructura, construyo observabilidad con Splunk y ThousandEyes y doy soporte a entornos críticos de operadoras de telecomunicaciones.",
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
        "My experience spans Linux, containers (Docker and Podman), Infrastructure as Code (Ansible and Terraform), CI/CD pipelines, AWS and end-to-end monitoring with ",
        { text: "Splunk", tone: "accent" },
        " and ",
        { text: "ThousandEyes", tone: "accent" },
        ".",
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
        { text: "Analista de Service Provider na Logicalis", tone: "strong" },
        " e ",
        { text: "estudante de Ciência da Computação", tone: "strong" },
        ", com atuação prática em automação de infraestrutura, observabilidade e sustentação de ambientes críticos de operadoras de telecomunicações.",
      ],
      [
        "Tenho experiência com Linux, containers (Docker e Podman), Infrastructure as Code (Ansible e Terraform), pipelines de CI/CD, AWS e monitoramento fim a fim com ",
        { text: "Splunk", tone: "accent" },
        " e ",
        { text: "ThousandEyes", tone: "accent" },
        ".",
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
        { text: "Analista de Service Provider en Logicalis", tone: "strong" },
        " y ",
        { text: "estudiante de Ciencias de la Computación", tone: "strong" },
        ", con experiencia práctica en automatización de infraestructura, observabilidad y soporte de entornos críticos de operadoras de telecomunicaciones.",
      ],
      [
        "Tengo experiencia con Linux, contenedores (Docker y Podman), Infraestructura como Código (Ansible y Terraform), pipelines de CI/CD, AWS y monitoreo de extremo a extremo con ",
        { text: "Splunk", tone: "accent" },
        " y ",
        { text: "ThousandEyes", tone: "accent" },
        ".",
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
    resume: { en: RESUME_PATH, pt: RESUME_PATH, es: RESUME_PATH },
  },
} as const satisfies Profile;
