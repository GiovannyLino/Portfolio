import { memo } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import type { Element, ElementContent } from "hast";
import { isSectionId, type SectionId } from "@/lib/sections";
import { cn } from "@/lib/utils";
import CodeBlock from "./CodeBlock";
import styles from "../ChatWidget.module.css";

interface MarkdownProps {
  content: string;
  streaming?: boolean;
  onNavigate: (section: SectionId) => void;
  copyLabel: string;
  copiedLabel: string;
}

const textOf = (node: ElementContent): string =>
  node.type === "text" ? node.value : node.type === "element" ? node.children.map(textOf).join("") : "";

const languageOf = (code: Element | undefined): string | undefined => {
  const classes = code?.properties?.className;
  const name = Array.isArray(classes) ? classes.map(String).find((value) => value.startsWith("language-")) : undefined;
  return name?.slice("language-".length);
};

/**
 * Model output rendered as Markdown. Raw HTML is never rendered (react-markdown escapes it
 * by default), images are dropped, and unsafe URLs are neutralized by react-markdown's
 * default urlTransform. Links to page sections (#projects) scroll the page instead.
 */
const Markdown = ({ content, streaming, onNavigate, copyLabel, copiedLabel }: MarkdownProps) => {
  const components: Components = {
    a: ({ href, children }) => {
      const anchor = href?.startsWith("#") ? href.slice(1) : undefined;
      if (anchor && isSectionId(anchor)) {
        return (
          <a
            href={href}
            onClick={(event) => {
              event.preventDefault();
              onNavigate(anchor);
            }}
          >
            {children}
          </a>
        );
      }
      return (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      );
    },
    pre: ({ node }) => {
      const code = node?.children.find((child): child is Element => child.type === "element" && child.tagName === "code");
      return (
        <CodeBlock
          code={code ? code.children.map(textOf).join("").replace(/\n$/, "") : ""}
          language={languageOf(code)}
          copyLabel={copyLabel}
          copiedLabel={copiedLabel}
        />
      );
    },
    // The assistant is told not to use headings; render any it sends as bold text.
    h1: ({ children }) => <p><strong>{children}</strong></p>,
    h2: ({ children }) => <p><strong>{children}</strong></p>,
    h3: ({ children }) => <p><strong>{children}</strong></p>,
  };

  return (
    <div className={cn(styles.markdown, streaming && styles.streaming)}>
      <ReactMarkdown components={components} disallowedElements={["img"]} unwrapDisallowed>
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default memo(Markdown);
