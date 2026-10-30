// Featured projects: CV "Projetos relevantes" (Oct 2026). Problem/solution only restate
// what the CV and the experience bullets say. Other projects: public GitHub READMEs,
// most recently pushed first.
import type { Project } from "./types.js";

export const projects = [
  {
    id: "poc-in-a-box",
    title: "PoC-in-a-Box",
    featured: true,
    origin: "work",
    summary: {
      en: "Internal platform that automates the creation of Proof of Concept environments, reducing manual setup time.",
      pt: "Plataforma interna para automatizar a criação de ambientes de Proof of Concept, reduzindo tempo de setup manual.",
      es: "Plataforma interna que automatiza la creación de entornos de Proof of Concept, reduciendo el tiempo de configuración manual.",
    },
    problem: {
      en: "Building Proof of Concept environments relied on manual setup.",
      pt: "A criação de ambientes de Proof of Concept dependia de setup manual.",
      es: "La creación de entornos de Proof of Concept dependía de configuración manual.",
    },
    solution: {
      en: "Topology orchestration with Containerlab, provisioning with Ansible, asynchronous job execution with BullMQ and rootless Podman containers.",
      pt: "Orquestração de topologias com Containerlab, provisionamento com Ansible, execução de jobs assíncronos com BullMQ e containers com Podman rootless.",
      es: "Orquestación de topologías con Containerlab, aprovisionamiento con Ansible, ejecución de jobs asíncronos con BullMQ y contenedores con Podman rootless.",
    },
    stack: ["containerlab", "ansible", "podman", "bullmq", "nodejs", "linux"],
    links: {},
  },
  {
    id: "netbox-ansible-pipeline",
    title: {
      en: "Network Automation Pipeline with NetBox and Ansible",
      pt: "Pipeline de Automação de Rede com NetBox e Ansible",
      es: "Pipeline de Automatización de Red con NetBox y Ansible",
    },
    featured: true,
    origin: "work",
    experienceId: "logicalis-telecom-intern",
    summary: {
      en: "Network automation pipeline using NetBox as source of truth, Ansible dynamic inventory and automatic device provisioning in the monitoring platform via REST API (uri module), eliminating manual registration.",
      pt: "Pipeline de automação de rede usando NetBox como source of truth, inventário dinâmico no Ansible e provisionamento automático de dispositivos na plataforma de monitoramento via API REST (módulo uri), eliminando cadastros manuais.",
      es: "Pipeline de automatización de red con NetBox como source of truth, inventario dinámico en Ansible y aprovisionamiento automático de dispositivos en la plataforma de monitoreo vía API REST (módulo uri), eliminando registros manuales.",
    },
    problem: {
      en: "Devices had to be registered manually in the monitoring platform.",
      pt: "Os dispositivos precisavam ser cadastrados manualmente na plataforma de monitoramento.",
      es: "Los dispositivos debían registrarse manualmente en la plataforma de monitoreo.",
    },
    solution: {
      en: "NetBox became the source of truth: Ansible builds its dynamic inventory from it and provisions each device in the monitoring platform through the REST API (uri module), with bidirectional synchronization.",
      pt: "O NetBox virou a source of truth: o Ansible monta o inventário dinâmico a partir dele e provisiona cada dispositivo na plataforma de monitoramento via API REST (módulo uri), com sincronização bidirecional.",
      es: "NetBox pasó a ser la source of truth: Ansible arma su inventario dinámico a partir de él y aprovisiona cada dispositivo en la plataforma de monitoreo vía API REST (módulo uri), con sincronización bidireccional.",
    },
    highlights: {
      en: ["NetBox as source of truth", "Bidirectional synchronization", "Ansible dynamic inventory", "Monitoring provisioning via REST API (uri module)"],
      pt: ["NetBox como source of truth", "Sincronização bidirecional", "Inventário dinâmico no Ansible", "Provisionamento do monitoramento via API REST (módulo uri)"],
      es: ["NetBox como source of truth", "Sincronización bidireccional", "Inventario dinámico en Ansible", "Aprovisionamiento del monitoreo vía API REST (módulo uri)"],
    },
    stack: ["netbox", "ansible", "rest-apis", "yaml", "jinja2", "python"],
    links: {},
  },
  {
    id: "network-automation-lab",
    title: {
      en: "Network Virtualization and Automation Lab",
      pt: "Laboratório de Virtualização e Automação de Redes",
      es: "Laboratorio de Virtualización y Automatización de Redes",
    },
    featured: true,
    origin: "work",
    experienceId: "logicalis-telecom-intern",
    summary: {
      en: "Virtualized lab for developing and testing automation, with Ansible playbooks applied to virtualized switches and routers, consolidating Infrastructure as Code practices in network environments.",
      pt: "Laboratório virtualizado para desenvolvimento e teste de automações com playbooks Ansible aplicados a switches e roteadores virtualizados, consolidando práticas de Infrastructure as Code em ambiente de rede.",
      es: "Laboratorio virtualizado para desarrollar y probar automatizaciones, con playbooks de Ansible aplicados a switches y routers virtualizados, consolidando prácticas de Infraestructura como Código en entornos de red.",
    },
    problem: {
      en: "Automation had to be validated before being applied in production.",
      pt: "As automações precisavam ser validadas antes da aplicação em produção.",
      es: "Las automatizaciones debían validarse antes de aplicarse en producción.",
    },
    solution: {
      en: "Virtualized topologies on PNETLab and Containerlab, where Ansible playbooks run against virtual switches and routers first.",
      pt: "Topologias virtualizadas no PNETLab e no Containerlab, onde os playbooks Ansible rodam primeiro contra switches e roteadores virtuais.",
      es: "Topologías virtualizadas en PNETLab y Containerlab, donde los playbooks de Ansible se ejecutan primero contra switches y routers virtuales.",
    },
    stack: ["ansible", "pnetlab", "containerlab", "linux", "infrastructure-as-code"],
    links: {},
  },
  {
    id: "aurora-dashboard-migration",
    title: {
      en: "Corporate Dashboard Migration to AWS Aurora PostgreSQL",
      pt: "Migração de Dashboard Corporativo para AWS Aurora PostgreSQL",
      es: "Migración de Dashboard Corporativo a AWS Aurora PostgreSQL",
    },
    featured: true,
    origin: "work",
    experienceId: "logicalis-telecom-intern",
    summary: {
      en: "Migration of an operational database to AWS Aurora PostgreSQL, with WireGuard VPN connectivity, a data access layer, a database explorer UI and continuous deployment integrated with GitHub.",
      pt: "Migração de base de dados operacional para AWS Aurora PostgreSQL, com conectividade via VPN WireGuard, camada de acesso a dados, explorador de banco e deploy contínuo integrado ao GitHub.",
      es: "Migración de una base de datos operativa a AWS Aurora PostgreSQL, con conectividad vía VPN WireGuard, capa de acceso a datos, explorador de base de datos y despliegue continuo integrado con GitHub.",
    },
    problem: {
      en: "The corporate dashboard depended on manual, Excel-based processes.",
      pt: "O dashboard corporativo dependia de processos manuais em Excel.",
      es: "El dashboard corporativo dependía de procesos manuales en Excel.",
    },
    solution: {
      en: "Data moved to AWS Aurora PostgreSQL, reachable over a WireGuard VPN, behind a data access layer and a database explorer, with continuous deployment from GitHub.",
      pt: "Os dados foram para o AWS Aurora PostgreSQL, acessível via VPN WireGuard, atrás de uma camada de acesso a dados e de um explorador de banco, com deploy contínuo a partir do GitHub.",
      es: "Los datos pasaron a AWS Aurora PostgreSQL, accesible vía VPN WireGuard, detrás de una capa de acceso a datos y un explorador de base de datos, con despliegue continuo desde GitHub.",
    },
    stack: ["aws", "postgresql", "wireguard", "nodejs", "react", "vercel", "cicd"],
    links: {},
  },
  {
    id: "rick-and-morty-spa",
    title: "Rick & Morty SPA",
    featured: false,
    origin: "personal",
    summary: {
      en: "Angular single-page application consuming the Rick & Morty REST API, built for a technical assessment from a Figma layout: infinite scroll, global search, route guards and a responsive layout.",
      pt: "SPA em Angular consumindo a API REST do Rick & Morty, feita para um teste técnico a partir de um layout no Figma: scroll infinito, busca global, route guards e layout responsivo.",
      es: "SPA en Angular que consume la API REST de Rick & Morty, hecha para una prueba técnica a partir de un diseño en Figma: scroll infinito, búsqueda global, route guards y diseño responsive.",
    },
    stack: ["angular", "typescript", "rest-apis"],
    links: { repo: "https://github.com/GiovannyLino/spa-rick-and-morty" },
  },
  {
    id: "task-manager-api",
    title: "Task Manager API",
    featured: false,
    origin: "personal",
    summary: {
      en: "RESTful API built by a team of four to manage users, projects and tasks, with task lifecycle, status updates and activity history. Java 17, Spring Boot and MongoDB Atlas in a layered structure (controller, service, repository, DTO).",
      pt: "API RESTful feita por uma equipe de quatro pessoas para gerenciar usuários, projetos e tarefas, com ciclo de vida, atualização de status e histórico de atividades das tarefas. Java 17, Spring Boot e MongoDB Atlas em camadas (controller, service, repository, DTO).",
      es: "API RESTful hecha por un equipo de cuatro personas para gestionar usuarios, proyectos y tareas, con ciclo de vida, actualización de estado e historial de actividades de las tareas. Java 17, Spring Boot y MongoDB Atlas en capas (controller, service, repository, DTO).",
    },
    stack: ["java", "spring-boot", "mongodb", "rest-apis"],
    links: { repo: "https://github.com/GiovannyLino/TaskMan" },
  },
  {
    id: "know-your-fan",
    title: "Know Your Fan",
    featured: false,
    origin: "personal",
    summary: {
      en: "Web app for the eSports organization FURIA to collect, validate and analyze fan data, with AI-validated document upload and social media account linking. Built with React, Vite and Tailwind CSS, deployed on Vercel.",
      pt: "Aplicação web para a organização de eSports FURIA coletar, validar e analisar dados de fãs, com upload de documentos validado por IA e vinculação de redes sociais. Feita com React, Vite e Tailwind CSS, com deploy na Vercel.",
      es: "Aplicación web para que la organización de eSports FURIA recopile, valide y analice datos de sus fans, con carga de documentos validada por IA y vinculación de redes sociales. Hecha con React, Vite y Tailwind CSS, desplegada en Vercel.",
    },
    stack: ["react", "vite", "tailwind", "vercel"],
    links: {
      repo: "https://github.com/GiovannyLino/FURIA-KnowYourFan",
      demo: "https://furia-know-your-fan-lyart.vercel.app",
    },
  },
] as const satisfies readonly Project[];

export type ProjectId = (typeof projects)[number]["id"];
