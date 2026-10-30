import type { ServerConfig } from "../config.js";
import { GeminiProvider } from "./gemini.js";
import { ProviderError, type LLMProvider } from "./provider.js";

export * from "./provider.js";

/** Builds the provider selected in the config. Throws when its credentials are missing. */
export function createProvider({ llm }: ServerConfig): LLMProvider {
  switch (llm.provider) {
    case "gemini":
      if (!llm.apiKey) throw new ProviderError("unavailable", "GEMINI_API_KEY is not set");
      return new GeminiProvider({ apiKey: llm.apiKey, model: llm.model, thinkingLevel: llm.thinkingLevel });
  }
}
