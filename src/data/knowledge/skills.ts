// Source: CV "Competências técnicas" (Oct 2026). The "frameworks" category and the
// unlisted entries come from the project stacks in the CV and the public GitHub repos.
import type { Skill, SkillCategory } from "./types";

export const skillCategories = [
  { id: "cloud", name: { en: "Cloud Computing", pt: "Cloud Computing", es: "Computación en la nube" } },
  {
    id: "containers",
    name: { en: "Containers & Orchestration", pt: "Containers e Orquestração", es: "Contenedores y orquestación" },
  },
  {
    id: "iac",
    name: {
      en: "Infrastructure as Code & Automation",
      pt: "Infrastructure as Code e Automação",
      es: "Infraestructura como código y automatización",
    },
  },
  { id: "cicd", name: { en: "CI/CD & Version Control", pt: "CI/CD e Versionamento", es: "CI/CD y control de versiones" } },
  {
    id: "observability",
    name: { en: "Observability & Monitoring", pt: "Observabilidade e Monitoramento", es: "Observabilidad y monitoreo" },
  },
  {
    id: "systems",
    name: { en: "Operating Systems & Networking", pt: "Sistemas Operacionais e Redes", es: "Sistemas operativos y redes" },
  },
  { id: "languages", name: { en: "Programming & Scripting", pt: "Linguagens e Scripting", es: "Lenguajes y scripting" } },
  { id: "databases", name: { en: "Databases", pt: "Bancos de Dados", es: "Bases de datos" } },
  { id: "practices", name: { en: "Methodologies & Practices", pt: "Metodologias e Práticas", es: "Metodologías y prácticas" } },
  { id: "frameworks", name: { en: "Frameworks & Tools", pt: "Frameworks e Ferramentas", es: "Frameworks y herramientas" } },
] as const satisfies readonly SkillCategory[];

export const skills = [
  // Cloud
  {
    id: "aws",
    name: "AWS",
    category: "cloud",
    detail: "EC2, S3, IAM, VPC, RDS/Aurora",
    aliases: ["amazon web services", "ec2", "s3", "iam", "vpc", "rds", "aurora"],
    featured: true,
  },
  { id: "gcp", name: "GCP", category: "cloud", aliases: ["google cloud"] },
  { id: "vercel", name: "Vercel", category: "cloud" },
  { id: "netlify", name: "Netlify", category: "cloud" },
  {
    id: "cloud-architecture",
    name: { en: "Cloud architecture", pt: "Arquitetura em nuvem", es: "Arquitectura en la nube" },
    category: "cloud",
    aliases: ["cloud"],
  },
  {
    id: "high-availability",
    name: { en: "High availability", pt: "Alta disponibilidade", es: "Alta disponibilidad" },
    category: "cloud",
    aliases: ["ha"],
  },

  // Containers & orchestration
  { id: "docker", name: "Docker", category: "containers", aliases: ["container", "containers"] },
  { id: "podman", name: "Podman", category: "containers", detail: "rootless", aliases: ["container", "containers"], featured: true },
  { id: "kubernetes", name: "Kubernetes", category: "containers", aliases: ["k8s"] },
  { id: "containerlab", name: "Containerlab", category: "containers", aliases: ["clab", "lab"], featured: true },
  { id: "pnetlab", name: "PNETLab", category: "containers", aliases: ["pnet", "lab"] },
  {
    id: "virtualization",
    name: { en: "Virtualization", pt: "Virtualização", es: "Virtualización" },
    category: "containers",
    aliases: ["vm", "vms", "virtual machines", "maquinas virtuais", "maquinas virtuales"],
  },

  // Infrastructure as Code & automation
  {
    id: "ansible",
    name: "Ansible",
    category: "iac",
    detail: {
      en: "playbooks, roles, dynamic inventory",
      pt: "playbooks, roles, inventário dinâmico",
      es: "playbooks, roles, inventario dinámico",
    },
    aliases: ["playbook", "playbooks", "automation", "automacao", "automatizacion"],
    featured: true,
  },
  { id: "terraform", name: "Terraform", category: "iac", aliases: ["hcl"] },
  { id: "netbox", name: "NetBox", category: "iac", aliases: ["source of truth", "ssot"], featured: true },
  { id: "jinja2", name: "Jinja2", category: "iac", aliases: ["jinja", "templates"] },
  { id: "yaml", name: "YAML", category: "iac", aliases: ["yml"] },

  // CI/CD & version control
  { id: "git", name: "Git", category: "cicd" },
  { id: "github", name: "GitHub", category: "cicd" },
  { id: "github-actions", name: "GitHub Actions", category: "cicd", aliases: ["actions", "workflows"] },
  {
    id: "cicd",
    name: { en: "Continuous integration & delivery", pt: "Integração e entrega contínuas", es: "Integración y entrega continuas" },
    category: "cicd",
    aliases: ["ci/cd", "ci", "cd", "pipeline", "pipelines"],
  },
  { id: "gitops", name: "GitOps", category: "cicd" },
  {
    id: "deploy-automation",
    name: { en: "Deployment automation", pt: "Automação de deploy", es: "Automatización de despliegues" },
    category: "cicd",
    aliases: ["deploy", "deployment"],
  },

  // Observability & monitoring
  {
    id: "splunk",
    name: "Splunk",
    category: "observability",
    aliases: ["spl", "logs", "observability", "observabilidade", "observabilidad", "monitoring", "monitoramento"],
    featured: true,
  },
  {
    id: "thousandeyes",
    name: "ThousandEyes",
    category: "observability",
    aliases: ["thousand eyes", "observability", "observabilidade", "observabilidad", "monitoring", "monitoramento"],
    featured: true,
  },
  { id: "metabase", name: "Metabase", category: "observability", aliases: ["bi"] },
  { id: "power-bi", name: "Power BI", category: "observability", aliases: ["powerbi", "power query", "bi"] },
  {
    id: "dashboards-alerting",
    name: { en: "Dashboards & alerting", pt: "Dashboards e alertas", es: "Dashboards y alertas" },
    category: "observability",
    aliases: ["dashboard", "alerts", "alertas", "monitoring", "monitoramento", "monitoreo"],
  },
  {
    id: "rca",
    name: { en: "Root cause analysis (RCA)", pt: "Análise de causa raiz (RCA)", es: "Análisis de causa raíz (RCA)" },
    category: "observability",
    aliases: ["rca", "post-mortem", "postmortem", "troubleshooting", "incidents", "incidentes"],
  },
  { id: "aiops", name: "AIOps", category: "observability", aliases: ["ai ops"] },

  // Operating systems & networking
  { id: "linux", name: "Linux", category: "systems", detail: "Ubuntu, RHEL", aliases: ["ubuntu", "rhel", "red hat"] },
  { id: "tcp-ip", name: "TCP/IP", category: "systems", aliases: ["networking", "redes"] },
  { id: "dns", name: "DNS", category: "systems" },
  {
    id: "routing-switching",
    name: { en: "Routing & switching", pt: "Roteamento e switching", es: "Enrutamiento y switching" },
    category: "systems",
    aliases: ["routing", "switching", "roteamento", "switches", "routers", "roteadores", "network", "redes"],
  },
  { id: "wireguard", name: "VPN (WireGuard)", category: "systems", aliases: ["vpn", "wireguard"] },
  {
    id: "cisco",
    name: { en: "Cisco equipment", pt: "Equipamentos Cisco", es: "Equipos Cisco" },
    category: "systems",
    aliases: ["cisco"],
  },

  // Programming & scripting
  { id: "python", name: "Python", category: "languages", aliases: ["py", "scripts", "scripting"], featured: true },
  { id: "bash", name: "Shell/Bash", category: "languages", aliases: ["shell", "bash", "sh", "scripts"] },
  { id: "javascript", name: "JavaScript", category: "languages", aliases: ["js"] },
  { id: "typescript", name: "TypeScript", category: "languages", aliases: ["ts"] },
  { id: "nodejs", name: "Node.js", category: "languages", aliases: ["node"] },
  { id: "sql", name: "SQL", category: "languages" },
  { id: "plsql", name: "PL/SQL", category: "languages", aliases: ["plsql", "oracle"] },

  // Databases
  {
    id: "postgresql",
    name: "PostgreSQL",
    category: "databases",
    detail: "AWS Aurora, Supabase",
    aliases: ["postgres", "aurora", "supabase"],
  },
  { id: "supabase", name: "Supabase", category: "databases", aliases: ["rls", "row level security"], listed: false },
  { id: "mysql", name: "MySQL", category: "databases" },
  { id: "oracle", name: "Oracle", category: "databases" },
  {
    id: "data-modeling",
    name: { en: "Data modeling", pt: "Modelagem de dados", es: "Modelado de datos" },
    category: "databases",
    aliases: ["modeling", "modelagem"],
  },
  { id: "nosql", name: "NoSQL", category: "databases" },

  // Methodologies & practices
  { id: "devops", name: "DevOps", category: "practices" },
  { id: "sre", name: "SRE", category: "practices", aliases: ["site reliability engineering", "reliability", "confiabilidade"] },
  { id: "infrastructure-as-code", name: "Infrastructure as Code", category: "practices", aliases: ["iac"] },
  { id: "itil", name: "ITIL", category: "practices", aliases: ["incident management", "change management", "gestao de incidentes"] },
  {
    id: "agile",
    name: { en: "Scrum/Agile", pt: "Scrum/Metodologias Ágeis", es: "Scrum/Metodologías ágiles" },
    category: "practices",
    aliases: ["scrum", "agile", "agil"],
  },
  { id: "rest-apis", name: "REST APIs", category: "practices", aliases: ["api", "apis", "rest", "uri module", "integration", "integracao"] },
  {
    id: "microservices",
    name: { en: "Microservices", pt: "Microsserviços", es: "Microservicios" },
    category: "practices",
    aliases: ["microservice", "microsservicos"],
  },
  {
    id: "docs-runbooks",
    name: {
      en: "Technical documentation & runbooks",
      pt: "Documentação técnica e runbooks",
      es: "Documentación técnica y runbooks",
    },
    category: "practices",
    aliases: ["runbook", "runbooks", "sop", "documentation", "documentacao"],
  },

  // Frameworks & tools (from project stacks)
  { id: "react", name: "React", category: "frameworks", aliases: ["reactjs"] },
  { id: "vite", name: "Vite", category: "frameworks" },
  { id: "tailwind", name: "Tailwind CSS", category: "frameworks", aliases: ["tailwind"] },
  { id: "angular", name: "Angular", category: "frameworks", aliases: ["rxjs"] },
  { id: "express", name: "Express", category: "frameworks", aliases: ["expressjs"] },
  { id: "bullmq", name: "BullMQ", category: "frameworks", aliases: ["queue", "jobs"] },
] as const satisfies readonly Skill[];

export type SkillId = (typeof skills)[number]["id"];
