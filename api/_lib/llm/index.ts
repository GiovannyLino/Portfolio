import type { ServerConfig } from "../config.js";
import { FallbackProvider } from "./fallback.js";
import { GeminiProvider } from "./gemini.js";
import { ProviderError, type LLMProvider } from "./provider.js";

export * from "./provider.js";

/** Builds the provider selected in the config. Throws when its credentials are missing. */
export function createProvider({ llm }: ServerConfig): LLMProvider {
  switch (llm.provider) {
    case "gemini": {
      const { apiKey } = llm;
      if (!apiKey) throw new ProviderError("unavailable", "GEMINI_API_KEY is not set");
      const gemini = (model: string) => new GeminiProvider({ apiKey, model, thinkingLevel: llm.thinkingLevel });
      const primary = gemini(llm.model);
      return llm.fallbackModel && llm.fallbackModel !== llm.model
        ? new FallbackProvider(primary, gemini(llm.fallbackModel))
        : primary;
    }
  }
}
