import { describe, expect, it } from "vitest";
import { configureAiTransportHost, getAiTransportHost } from "../host.js";
import type { Model } from "../types.js";
import { resolveProviderSimpleCompletionHeadersForAttempt } from "./provider-transport-turn-state.js";

const model = {
  id: "gpt-5.6-luna",
  name: "GPT-5.6 Luna",
  api: "openai-completions",
  provider: "openai",
  baseUrl: "https://api.openai.com/v1",
  reasoning: false,
  input: ["text"],
  cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
  contextWindow: 128_000,
  maxTokens: 4096,
} satisfies Model<"openai-completions">;

describe("provider transport turn state", () => {
  it("bumps the attempt counter on the same turnId for the finish-less retry", () => {
    const previousHost = getAiTransportHost();
    const capturedContexts: Array<{ turnId: string; attempt: number }> = [];
    configureAiTransportHost({
      ...previousHost,
      plugin: {
        ...previousHost.plugin,
        resolveTransportTurnState: (params) => {
          capturedContexts.push({
            turnId: params.context.turnId,
            attempt: params.context.attempt,
          });
          return { headers: { "x-test-attempt": String(params.context.attempt) } };
        },
      },
    });
    try {
      const turnId = "turn-1";
      const first = resolveProviderSimpleCompletionHeadersForAttempt(model, undefined, {
        turnId,
        attempt: 1,
      });
      const second = resolveProviderSimpleCompletionHeadersForAttempt(model, undefined, {
        turnId,
        attempt: 2,
      });

      expect(capturedContexts.map((context) => context.attempt)).toEqual([1, 2]);
      expect(capturedContexts[0]?.turnId).toBe(capturedContexts[1]?.turnId);
      expect(first).toEqual({ "x-test-attempt": "1" });
      expect(second).toEqual({ "x-test-attempt": "2" });
    } finally {
      configureAiTransportHost(previousHost);
    }
  });
});
