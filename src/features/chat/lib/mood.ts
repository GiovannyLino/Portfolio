import type { MascotMood } from "../Mascot";
import type { Phase } from "./conversation";

/** What the mascot does while nothing special just happened. */
export function baseMood(phase: Phase, typing: boolean): MascotMood {
  if (phase === "waiting") return "thinking";
  if (phase === "streaming") return "talking";
  return typing ? "listening" : "idle";
}

export type MoodCue = "ui" | "done" | "error" | "boop";

/** Short reactions layered over the base mood, and how long each one lasts (ms). */
export const CUE_MOODS: Record<MoodCue, { mood: MascotMood; ms: number }> = {
  ui: { mood: "pointing", ms: 1400 },
  done: { mood: "happy", ms: 1600 },
  error: { mood: "confused", ms: 2800 },
  boop: { mood: "happy", ms: 900 },
};
