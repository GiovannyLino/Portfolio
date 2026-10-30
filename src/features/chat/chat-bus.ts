// Window events between the page and the lazy-loaded chat, so neither side imports the
// other: the page opens the chat (stack explorer, project cards, tour) and the chat
// pre-fills the contact form.
const OPEN_EVENT = "gioai:open";
const CONTACT_PREFILL_EVENT = "gioai:contact-prefill";

export interface OpenChatDetail {
  question?: string;
}

export interface ContactPrefill {
  subject: string;
  message?: string;
}

const emit = <T>(name: string, detail: T): void => {
  window.dispatchEvent(new CustomEvent<T>(name, { detail }));
};

const listen = <T>(name: string, listener: (detail: T) => void): (() => void) => {
  const handler = (event: Event) => listener((event as CustomEvent<T>).detail);
  window.addEventListener(name, handler);
  return () => window.removeEventListener(name, handler);
};

export const openChat = (detail: OpenChatDetail = {}): void => emit(OPEN_EVENT, detail);

export const onOpenChat = (listener: (detail: OpenChatDetail) => void) =>
  listen<OpenChatDetail | null>(OPEN_EVENT, (detail) => listener(detail ?? {}));

export const prefillContact = (prefill: ContactPrefill): void => emit(CONTACT_PREFILL_EVENT, prefill);

export const onContactPrefill = (listener: (prefill: ContactPrefill) => void) => listen(CONTACT_PREFILL_EVENT, listener);
