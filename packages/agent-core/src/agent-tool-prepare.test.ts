import { Type } from "typebox";
import { describe, expect, it, vi } from "vitest";
import { createTurnSequenceStream } from "./agent-loop.test-support.js";
import type { AgentTool } from "./types.js";

describe("tool preValidate normalization (fork)", () => {
  it("applies the tool's preValidate normalization before schema validation", async () => {
    const execute = vi.fn(async () => ({
      content: [{ type: "text" as const, text: "card ok" }],
      details: {},
    }));
    const streamFn = createTurnSequenceStream([
      [
        {
          type: "toolCall",
          id: "call-card",
          name: "card",
          arguments: { data: { key: "v" } },
        },
      ],
      [{ type: "text", text: "done" }],
    ]);
    const tool: AgentTool = {
      name: "card",
      label: "card",
      description: "card",
      parameters: Type.Object({ key: Type.String() }, { additionalProperties: false }),
      preValidate: (params) => {
        const nested = params.data;
        return typeof nested === "object" && nested !== null && "key" in nested
          ? { key: (nested as { key: string }).key }
          : params;
      },
      execute,
    };

    const events = await collectEvents(
      agentLoop(
        [{ role: "user", content: "hello", timestamp: 1 }],
        { systemPrompt: "", messages: [], tools: [tool] },
        config,
        undefined,
        streamFn,
      ),
    );
    const endEvent = events.find(
      (event): event is Extract<AgentEvent, { type: "tool_execution_end" }> =>
        event.type === "tool_execution_end",
    );

    expect(execute).toHaveBeenCalledWith(
      "call-card",
      { key: "v" },
      undefined,
      expect.any(Function),
    );
    expect(endEvent).toMatchObject({ executionStarted: true });
  });

  it("treats a non-record preValidate result as no transform and validates raw arguments", async () => {
    const executed: string[] = [];
    const streamFn = createTurnSequenceStream([
      [
        {
          type: "toolCall",
          id: "call-card",
          name: "card",
          arguments: { data: { key: "v" } },
        },
      ],
      [{ type: "text", text: "done" }],
    ]);
    const tool: AgentTool = {
      ...makeTool("card", executed),
      parameters: Type.Object({ key: Type.String() }, { additionalProperties: false }),
      preValidate: () => undefined as never,
    };

    const events = await collectEvents(
      agentLoop(
        [{ role: "user", content: "hello", timestamp: 1 }],
        { systemPrompt: "", messages: [], tools: [tool] },
        config,
        undefined,
        streamFn,
      ),
    );
    const endEvent = events.find(
      (event): event is Extract<AgentEvent, { type: "tool_execution_end" }> =>
        event.type === "tool_execution_end",
    );

    expect(executed).toEqual([]);
    expect(endEvent).toMatchObject({ executionStarted: false, errorKind: "argument-validation" });
  });
});
