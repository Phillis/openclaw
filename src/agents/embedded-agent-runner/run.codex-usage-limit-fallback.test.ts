// Coverage for handing Codex usage-limit prompt failures to model fallback.
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import { makeModelFallbackCfg } from "../test-helpers/model-fallback-config-fixture.js";
import { makeAttemptResult } from "./run.overflow-compaction.fixture.js";
import {
  loadRunOverflowCompactionHarness,
  MockedFailoverError,
  mockedClassifyFailoverReason,
  mockedGlobalHookRunner,
  mockedRunEmbeddedAttempt,
  overflowBaseRunParams,
  resetRunOverflowCompactionHarnessMocks,
} from "./run.overflow-compaction.harness.js";

let runEmbeddedAgent: typeof import("./run.js").runEmbeddedAgent;

describe("runEmbeddedAgent Codex usage-limit fallback handoff", () => {
  beforeAll(async () => {
    ({ runEmbeddedAgent } = await loadRunOverflowCompactionHarness());
  });

  beforeEach(() => {
    resetRunOverflowCompactionHarnessMocks();
    mockedGlobalHookRunner.hasHooks.mockImplementation(() => false);
  });

  it("throws FailoverError for Codex subscription usage-limit prompt failures when model fallbacks are configured", async () => {
    const rawUsageLimitError =
      "You've reached your Codex subscription usage limit. Next reset in 2 days, Jun 18 at 3:09 AM GMT+2. Wait until the reset time, use another Codex account if available, or switch to another configured model/provider.";

    mockedClassifyFailoverReason.mockReturnValue("rate_limit");
    mockedRunEmbeddedAttempt.mockResolvedValueOnce(
      makeAttemptResult({
        assistantTexts: [],
        codexAppServerFailure: {
          kind: "client_closed_before_turn_completed",
          transport: "websocket",
          replaySafe: false,
          replayBlockedReason: "assistant_output",
        },
        promptError: rawUsageLimitError,
        promptErrorSource: "prompt",
      }),
    );

    const promise = runEmbeddedAgent({
      ...overflowBaseRunParams,
      runId: "run-codex-usage-limit-fallback",
      config: makeModelFallbackCfg({
        agents: {
          defaults: {
            model: {
              primary: "codex/gpt-5.3-codex-spark",
              fallbacks: ["lmstudio/qwopus3.5-9b-v3@q5_k_s"],
            },
          },
        },
      }),
    });

    await expect(promise).rejects.toBeInstanceOf(MockedFailoverError);
    await expect(promise).rejects.toThrow("You've reached your Codex subscription usage limit.");
  });
});
