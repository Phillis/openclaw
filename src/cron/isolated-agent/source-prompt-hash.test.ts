import { describe, expect, it } from "vitest";
import { createCronSourcePromptHash } from "./source-prompt-hash.js";

describe("createCronSourcePromptHash", () => {
  it("uses the router-compatible Unicode, newline, and whitespace canonicalization", () => {
    expect(createCronSourcePromptHash("  Cafe\u0301\r\n\tweekly\u00a0report  ")).toBe(
      "sha256:88ec7d2417d3bacb289c2bb9d44e96b179c98d395e5242e822061e29ca481a2d",
    );
    expect(createCronSourcePromptHash("Caf\u00e9 weekly report")).toBe(
      "sha256:88ec7d2417d3bacb289c2bb9d44e96b179c98d395e5242e822061e29ca481a2d",
    );
  });

  it("omits empty canonical prompts", () => {
    expect(createCronSourcePromptHash(undefined)).toBeUndefined();
    expect(createCronSourcePromptHash(" \r\n\t ")).toBeUndefined();
  });
});
