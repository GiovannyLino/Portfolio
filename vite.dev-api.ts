// Development-only bridge: serves the Vercel functions in api/ from the Vite dev server,
// so `npm run dev` runs the chat end to end without the Vercel CLI. Production never
// loads this file; Vercel runs api/*.ts itself.
import type { IncomingMessage, ServerResponse } from "node:http";
import { existsSync } from "node:fs";
import path from "node:path";
import { loadEnv, type Plugin, type ViteDevServer } from "vite";

const ROUTE = /^\/api\/([a-z][a-z0-9-]*)\/?(?:\?.*)?$/;

const readBody = (req: IncomingMessage): Promise<Buffer> =>
  new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });

async function handle(server: ViteDevServer, name: string, req: IncomingMessage, res: ServerResponse) {
  const module = await server.ssrLoadModule(`/api/${name}.ts`);
  const abort = new AbortController();
  res.on("close", () => abort.abort());

  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value !== undefined) headers.set(key, Array.isArray(value) ? value.join(", ") : value);
  }
  const hasBody = req.method !== "GET" && req.method !== "HEAD";
  const request = new Request(new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`), {
    method: req.method,
    headers,
    body: hasBody ? await readBody(req) : undefined,
    signal: abort.signal,
  });

  const response: Response = await module.default.fetch(request);
  res.statusCode = response.status;
  response.headers.forEach((value, key) => res.setHeader(key, value));
  if (!response.body) return res.end();

  const reader = response.body.getReader();
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    res.write(value);
  }
  res.end();
}

export function devApi(mode: string): Plugin {
  return {
    name: "dev-api",
    apply: "serve",
    configureServer(server) {
      // Server-side env (GEMINI_API_KEY, ...) from .env / .env.local; never exposed to the client.
      for (const [key, value] of Object.entries(loadEnv(mode, process.cwd(), ""))) process.env[key] ??= value;

      server.middlewares.use((req, res, next) => {
        const name = ROUTE.exec(req.url ?? "")?.[1];
        if (!name || !existsSync(path.resolve("api", `${name}.ts`))) return next();
        handle(server, name, req, res).catch(next);
      });
    },
  };
}
