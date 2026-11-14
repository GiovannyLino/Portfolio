import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { devApi } from "./vite.dev-api";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), devApi(mode)],
  build: {
    // Photos stay separate files (cacheable, parsed off the JS path) even when tiny.
    assetsInlineLimit: (filePath: string) => (filePath.endsWith(".webp") ? false : undefined),
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
}));
