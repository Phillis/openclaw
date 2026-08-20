import { describe, expect, it } from "vitest";
import { buildEmbeddedAgentEndContext } from "./agent-end-context.js";

describe("buildEmbeddedAgentEndContext", () => {
  it("preserves the terminal attempt harness lane", () => {
    const context = buildEmbeddedAgentEndContext({
      run: {
        runId: "run-1",
        sessionId: "session-1",
        sessionKey: "agent:oscar:main",
        workspaceDir: "/tmp/workspace",
        provider: "openai",
        modelId: "gpt-test",
        trigger: "user",
        agentHarnessId: "openclaw",
        agentHarnessEpoch: "openclaw-epoch",
      } as never,
      agentId: "oscar",
      trace: { traceId: "trace-1", spanId: "span-1" },
      skillWorkshopAvailable: false,
      compacted: false,
    });

    expect(context).toMatchObject({
      agentHarnessId: "openclaw",
      agentHarnessEpoch: "openclaw-epoch",
    });
  });
});
