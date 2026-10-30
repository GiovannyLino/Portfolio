import { useMemo, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { createLowlight } from "lowlight";
import bash from "highlight.js/lib/languages/bash";
import json from "highlight.js/lib/languages/json";
import python from "highlight.js/lib/languages/python";
import typescript from "highlight.js/lib/languages/typescript";
import yaml from "highlight.js/lib/languages/yaml";
import { Check, Copy } from "lucide-react";
import styles from "../ChatWidget.module.css";

// Only the languages that fit this portfolio (automation, scripts, configs): the full
// highlight.js set would multiply the chat bundle.
const lowlight = createLowlight({ bash, json, python, typescript, yaml });
const ALIASES: Record<string, string> = { sh: "bash", shell: "bash", yml: "yaml", py: "python", ts: "typescript", js: "typescript" };

interface CodeBlockProps {
  code: string;
  language?: string;
  copyLabel: string;
  copiedLabel: string;
}

const CodeBlock = ({ code, language, copyLabel, copiedLabel }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);
  const lang = language ? (ALIASES[language] ?? language) : undefined;

  // Rendered from lowlight's syntax tree as React elements: no HTML strings involved.
  const highlighted = useMemo(
    () => (lang && lowlight.registered(lang) ? toJsxRuntime(lowlight.highlight(lang, code), { Fragment, jsx, jsxs }) : code),
    [code, lang],
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard blocked (permissions, insecure context): the code stays selectable.
    }
  };

  return (
    <div className={styles.codeBlock}>
      <div className={styles.codeHeader}>
        <span>{language ?? "code"}</span>
        <button type="button" className={styles.codeCopy} onClick={copy} aria-label={copied ? copiedLabel : copyLabel}>
          {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
          <span aria-hidden="true">{copied ? copiedLabel : ""}</span>
        </button>
      </div>
      <pre>
        <code>{highlighted}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;
