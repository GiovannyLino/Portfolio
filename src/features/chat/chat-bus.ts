// Lets any part of the page open the chat (optionally with a question) without importing
// the lazy-loaded widget. Phase 6 uses it for the stack explorer and the guided tour.
const OPEN_EVENT = "gioai:open";

export interface OpenChatDetail {
  question?: string;
}

export const openChat = (detail: OpenChatDetail = {}): void => {
  window.dispatchEvent(new CustomEvent<OpenChatDetail>(OPEN_EVENT, { detail }));
};

export const onOpenChat = (listener: (detail: OpenChatDetail) => void): (() => void) => {
  const handler = (event: Event) => listener((event as CustomEvent<OpenChatDetail>).detail ?? {});
  window.addEventListener(OPEN_EVENT, handler);
  return () => window.removeEventListener(OPEN_EVENT, handler);
};
