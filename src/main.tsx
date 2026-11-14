import { createRoot } from "react-dom/client";
// Self-hosted fonts: display (headings), sans (text) and mono (labels; the chat names it too).
import "@fontsource-variable/big-shoulders-display";
import "@fontsource-variable/inter";
import "@fontsource/jetbrains-mono/latin-400";
import "@fontsource/jetbrains-mono/latin-500";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(<App />);
