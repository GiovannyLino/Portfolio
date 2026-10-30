// Source: CV "Formação acadêmica" and "Certificações" (Oct 2026).
import type { Certification, Education } from "./types.js";

export const education = [
  {
    id: "uscs-computer-science",
    degree: {
      en: "Bachelor of Computer Science",
      pt: "Bacharelado em Ciência da Computação",
      es: "Licenciatura en Ciencias de la Computación",
    },
    institution: "Universidade de São Caetano do Sul (USCS)",
    location: "São Caetano do Sul, SP",
    period: { start: 2024, end: 2028 },
  },
  {
    id: "senai-mechatronics",
    degree: {
      en: "Technical Degree in Mechatronics",
      pt: "Técnico em Mecatrônica",
      es: "Técnico en Mecatrónica",
    },
    institution: "SENAI Armando de Arruda Pereira",
    location: "São Caetano do Sul, SP",
    period: { start: 2019, end: 2021 },
  },
] as const satisfies readonly Education[];

export const certifications = [
  { id: "iquall-inas", name: "Iquall NetOps Automation Specialist (INAS)", issuer: "Iquall Networks", year: 2026 },
  { id: "iquall-inaa", name: "Iquall Network Automation Associate (INAA)", issuer: "Iquall Networks", year: 2026 },
  {
    id: "aws-academy-cloud-foundations",
    name: "AWS Academy Graduate – Cloud Foundations",
    issuer: "Amazon Web Services",
    year: 2026,
  },
  { id: "cisco-black-belt-aiops", name: "Black Belt AIOps", issuer: "Cisco", year: 2026 },
] as const satisfies readonly Certification[];
