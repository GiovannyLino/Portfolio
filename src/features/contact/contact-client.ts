// Delivery for the contact form: EmailJS when its three VITE_EMAILJS_* variables are set
// (EmailJS keys are public by design), otherwise the visitor's email app via mailto:.
import { profile } from "@/data/knowledge";

export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export type ContactField = "name" | "email" | "message";

export interface EmailJsConfig {
  serviceId: string;
  templateId: string;
  publicKey: string;
}

export const CONTACT_LIMITS = { name: 80, email: 120, subject: 120, message: 2000, minMessage: 10 } as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Fields that need fixing, in form order. */
export function validateContact({ name, email, message }: ContactMessage): ContactField[] {
  const invalid: ContactField[] = [];
  if (name.trim().length < 2) invalid.push("name");
  if (!EMAIL_PATTERN.test(email.trim())) invalid.push("email");
  if (message.trim().length < CONTACT_LIMITS.minMessage) invalid.push("message");
  return invalid;
}

export function emailJsConfig(env: Partial<ImportMetaEnv> = import.meta.env): EmailJsConfig | null {
  const serviceId = env.VITE_EMAILJS_SERVICE_ID;
  const templateId = env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = env.VITE_EMAILJS_PUBLIC_KEY;
  return serviceId && templateId && publicKey ? { serviceId, templateId, publicKey } : null;
}

export const buildMailto = ({ name, email, subject, message }: ContactMessage, to: string = profile.links.email): string =>
  `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`${message}\n\n— ${name} <${email}>`)}`;

interface SendOptions {
  config?: EmailJsConfig | null;
  openUrl?: (url: string) => void;
}

/** Resolves with the channel used; rejects when EmailJS refuses or the network fails. */
export async function sendContactMessage(
  message: ContactMessage,
  { config = emailJsConfig(), openUrl = (url) => window.location.assign(url) }: SendOptions = {},
): Promise<"emailjs" | "mailto"> {
  if (!config) {
    openUrl(buildMailto(message));
    return "mailto";
  }
  // Loaded on submit only, so the SDK never weighs on the page.
  const { send } = await import("@emailjs/browser");
  await send(
    config.serviceId,
    config.templateId,
    { from_name: message.name, reply_to: message.email, subject: message.subject, message: message.message },
    { publicKey: config.publicKey, limitRate: { id: "portfolio-contact", throttle: 20_000 } },
  );
  return "emailjs";
}
