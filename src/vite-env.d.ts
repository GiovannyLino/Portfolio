/// <reference types="vite/client" />

// Client-side env vars (public: Vite inlines them into the bundle). Server secrets such as
// GEMINI_API_KEY never use the VITE_ prefix.
interface ImportMetaEnv {
  readonly VITE_EMAILJS_SERVICE_ID?: string;
  readonly VITE_EMAILJS_TEMPLATE_ID?: string;
  readonly VITE_EMAILJS_PUBLIC_KEY?: string;
}
