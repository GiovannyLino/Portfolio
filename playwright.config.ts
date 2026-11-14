import { defineConfig, devices } from "@playwright/test";

const PORT = 4174;

// End-to-end tests for the Gio.AI flows. They run on the installed Google Chrome
// (channel "chrome", also preinstalled on GitHub Actions runners) and mock /api/chat, so they
// need no API key and spend no LLM quota.
export default defineConfig({
  testDir: "e2e",
  timeout: 30_000,
  // The page animates all the time (canvas, marquees) and the chat is a lazy chunk the dev
  // server compiles on first use: with several pages in parallel the default 5 s is too tight.
  expect: { timeout: 10_000 },
  fullyParallel: true,
  // Every test runs the full animated page against one dev server; more than two at a time
  // starves the machine and the slowest one times out.
  workers: 2,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
  },
  projects: [
    // Desktop runs the page as visitors get it, animations included.
    { name: "desktop", use: { ...devices["Desktop Chrome"], channel: "chrome" } },
    // The phone asks for reduced motion, so the still version of the page is covered too.
    {
      name: "mobile",
      use: { ...devices["Pixel 7"], channel: "chrome", contextOptions: { reducedMotion: "reduce" } },
    },
  ],
  webServer: {
    command: `npm run dev -- --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
