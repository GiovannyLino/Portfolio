import type { ContactPrefill } from "@/features/chat/chat-bus";

/** mailto: link; when the assistant sent the visitor here, the email opens with its subject and draft. */
export const contactHref = (email: string, prefill: ContactPrefill | null): string => {
  if (!prefill) return `mailto:${email}`;
  const params = [`subject=${encodeURIComponent(prefill.subject)}`];
  if (prefill.message) params.push(`body=${encodeURIComponent(prefill.message)}`);
  return `mailto:${email}?${params.join("&")}`;
};
