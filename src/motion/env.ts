import type { CSSProperties } from "react";

const matches = (query: string): boolean =>
  typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia(query).matches;

/** The visitor asked the system for less motion: decoration stays still. */
export const prefersReducedMotion = (): boolean => matches("(prefers-reduced-motion: reduce)");

/** Mouse or trackpad: effects that follow the pointer make sense. */
export const hasFinePointer = (): boolean => matches("(hover: hover) and (pointer: fine)");

export const clamp = (value: number, min = 0, max = 1): number => Math.min(max, Math.max(min, value));

/** Frame-rate independent smoothing factor for `current += (goal - current) * k`. */
export const damp = (elapsedMs: number, timeConstantMs: number): number =>
  timeConstantMs <= 0 ? 1 : 1 - Math.exp(-elapsedMs / timeConstantMs);

/** Inline custom properties (`--i`, `--delay`…), which React's style type does not know. */
export const cssVars = (vars: Record<`--${string}`, string | number | undefined>): CSSProperties =>
  vars as CSSProperties;
