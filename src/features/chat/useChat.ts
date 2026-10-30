import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import type { Language } from "@/i18n/translations";
import type { SectionId } from "@/lib/sections";
import { CHAT_LIMITS, type UiAction } from "./protocol";
import { streamChat } from "./lib/chat-client";
import {
  conversationReducer,
  emptyConversation,
  newEntry,
  toHistory,
  type ConversationState,
} from "./lib/conversation";
import { localAnswer } from "./lib/fallback";
import type { MoodCue } from "./lib/mood";
import { clearConversation, loadConversation, saveConversation } from "./lib/storage";

interface UseChatOptions {
  lang: Language;
  section: SectionId | null;
  /** Text stored in place of an answer the visitor stopped before any text arrived. */
  stoppedPlaceholder: string;
  onUiAction: (action: UiAction) => void;
}

export interface Cue {
  kind: MoodCue;
  /** Changes on every cue so repeated cues of the same kind still trigger. */
  at: number;
}

export function useChat({ lang, section, stoppedPlaceholder, onUiAction }: UseChatOptions) {
  const [state, dispatch] = useReducer(conversationReducer, undefined, () => emptyConversation(loadConversation()));
  const [cue, setCue] = useState<Cue | null>(null);

  // Latest values for the async send loop, which outlives the render that started it.
  const stateRef = useRef<ConversationState>(state);
  const optionsRef = useRef({ lang, section, stoppedPlaceholder, onUiAction });
  const abortRef = useRef<AbortController | null>(null);
  stateRef.current = state;
  optionsRef.current = { lang, section, stoppedPlaceholder, onUiAction };

  const busy = state.phase !== "idle";

  useEffect(() => {
    if (!busy) saveConversation(state.entries);
  }, [state.entries, busy]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const emitCue = useCallback((kind: MoodCue) => setCue({ kind, at: Date.now() }), []);

  const send = useCallback(
    async (text: string) => {
      const question = text.trim().slice(0, CHAT_LIMITS.maxInputChars);
      if (!question || stateRef.current.phase !== "idle") return;

      const { lang: language, section: visible } = optionsRef.current;
      const user = newEntry("user", question);
      const assistant = newEntry("assistant", "", "streaming");
      const messages = toHistory(stateRef.current.entries, question);
      dispatch({ type: "send", user, assistant });

      const controller = new AbortController();
      abortRef.current = controller;
      let finished = false;

      for await (const event of streamChat({ messages, lang: language, ...(visible ? { section: visible } : {}) }, controller.signal)) {
        if (event.type === "ui") {
          optionsRef.current.onUiAction(event.action);
          emitCue("ui");
          continue;
        }
        if (event.type === "error") {
          const { code, retryAfter } = event;
          dispatch({ type: "fail", id: assistant.id, error: { code, retryAfter }, fallback: localAnswer(question, language) });
          emitCue("error");
          finished = true;
          controller.abort(); // release the connection if the server kept it open
          break;
        }
        dispatch({ type: "event", id: assistant.id, event });
        if (event.type === "done") {
          emitCue("done");
          finished = true;
        }
      }

      if (!finished) {
        if (controller.signal.aborted) {
          dispatch({ type: "stopped", id: assistant.id, placeholder: optionsRef.current.stoppedPlaceholder });
        } else {
          // The stream ended without "done": treat it like an unavailable upstream.
          dispatch({ type: "fail", id: assistant.id, error: { code: "upstream_unavailable" }, fallback: localAnswer(question, language) });
          emitCue("error");
        }
      }
      if (abortRef.current === controller) abortRef.current = null;
    },
    [emitCue],
  );

  const stop = useCallback(() => abortRef.current?.abort(), []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    clearConversation();
    dispatch({ type: "reset" });
  }, []);

  /** Asks the question behind a failed answer again. */
  const retry = useCallback(
    (assistantId: string) => {
      const entries = stateRef.current.entries;
      const index = entries.findIndex((entry) => entry.id === assistantId);
      const question = index > 0 ? entries[index - 1] : undefined;
      if (question?.role === "user") void send(question.content);
    },
    [send],
  );

  return { ...state, busy, cue, send, stop, reset, retry, boop: () => emitCue("boop") };
}
