import { describe, expect, it } from "vitest";
import { encodeEvent, type ChatEvent } from "../protocol";
import { createSseParser } from "./stream-parser";

const text: ChatEvent = { type: "text", delta: "Olá" };
const done: ChatEvent = { type: "done" };

describe("createSseParser", () => {
  it("parses several events from one chunk", () => {
    const parser = createSseParser();
    expect(parser.push(encodeEvent(text) + encodeEvent(done))).toEqual([text, done]);
  });

  it("reassembles events split across chunks at any position", () => {
    const wire = encodeEvent(text) + encodeEvent({ type: "suggestions", items: ["a b", "c"] }) + encodeEvent(done);
    for (let cut = 1; cut < wire.length; cut++) {
      const parser = createSseParser();
      const events = [...parser.push(wire.slice(0, cut)), ...parser.push(wire.slice(cut)), ...parser.flush()];
      expect(events, `cut at ${cut}`).toEqual([text, { type: "suggestions", items: ["a b", "c"] }, done]);
    }
  });

  it("accepts CRLF line endings", () => {
    expect(createSseParser().push(`data: ${JSON.stringify(text)}\r\n\r\n`)).toEqual([text]);
  });

  it("skips comments, malformed JSON and unknown event types", () => {
    const parser = createSseParser();
    const wire = ": keep-alive\n\n" + "data: {oops\n\n" + 'data: {"type":"mystery"}\n\n' + encodeEvent(done);
    expect(parser.push(wire)).toEqual([done]);
  });

  it("returns an event without a trailing blank line on flush", () => {
    const parser = createSseParser();
    expect(parser.push(`data: ${JSON.stringify(done)}`)).toEqual([]);
    expect(parser.flush()).toEqual([done]);
  });
});
