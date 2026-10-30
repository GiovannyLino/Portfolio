// POST /api/chat — streams the assistant's answer as Server-Sent Events.
// Protocol: src/features/chat/protocol.ts. The LLM key only exists in this function's env.
import { readConfig } from "./_lib/config.js";
import { createChatHandler } from "./_lib/handler.js";
import { createProvider, type LLMProvider } from "./_lib/llm/index.js";
import { createRateLimiter } from "./_lib/rate-limit.js";
import { createWikipediaSearch } from "./_lib/web-search.js";

let handler: ((request: Request) => Promise<Response>) | undefined;
// Reused while the instance is warm so the fallback's cooldown spans requests.
let provider: LLMProvider | undefined;

// Built on the first request and reused while the instance stays warm.
export default {
  fetch(request: Request): Promise<Response> {
    if (!handler) {
      const config = readConfig();
      handler = createChatHandler({
        config,
        rateLimiter: createRateLimiter(config),
        createProvider: () => (provider ??= createProvider(config)),
        log: (entry) => console.info(JSON.stringify(entry)),
        webSearch: config.webSearchEnabled ? createWikipediaSearch() : undefined,
      });
    }
    return handler(request);
  },
};
