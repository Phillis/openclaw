import type { AssistantMessage, Model } from "openclaw/plugin-sdk/llm";
import { Type } from "typebox";
import { describe, expect, it } from "vitest";
import {
  createAssistant,
  createAssistantResultStream,
  createTestSession,
  registerAgentSessionLoopTestLifecycle,
  streamMocks,
} from "./agent-session-loop-correctness.test-support.js";
import type { ToolDefinition } from "./extensions/types.js";

registerAgentSessionLoopTestLifecycle();

const loopTool: ToolDefinition = {
  name: "probe_board",
  label: "Probe Board",
  description: "runs one background supervision probe",
  parameters: Type.Object({}),
  execute: async () => ({
    content: [{ type: "text", text: "probe result" }],
    details: {},
  }),
};

/** Tool-call marathon shape: every turn calls a tool, so the loop never ends on its own. */
function mockToolCallMarathon(params: { textAfterTurns?: number } = {}) {
  let modelTurns = 0;
  streamMocks.streamSimple.mockImplementation(async (activeModel: Model) => {
    modelTurns += 1;
    const stopCallingTools =
      params.textAfterTurns !== undefined && modelTurns > params.textAfterTurns;
    const content: AssistantMessage["content"] = stopCallingTools
      ? [{ type: "text", text: "wrapped up" }]
      : [{ type: "toolCall", id: `call-${modelTurns}`, name: "probe_board", arguments: {} }];
    return createAssistantResultStream(
      createAssistant(activeModel, content, stopCallingTools ? "stop" : "toolUse"),
    );
  });
  return () => modelTurns;
}

describe("AgentSession bounded background turn budget", () => {
  it("stops dispatching model turns at the budget and settles the run normally", async () => {
    // The marathon stays willing to call tools forever, but yields text after 5
    // turns so a missing budget wiring fails the count assertion fast instead
    // of hanging.
    const getTurnCount = mockToolCallMarathon({ textAfterTurns: 5 });
    let budgetChecks = 0;
    const { session } = await createTestSession({
      customTools: [loopTool],
      shouldStopAfterTurn: () => {
        budgetChecks += 1;
        return budgetChecks >= 2;
      },
    });

    await session.prompt("run the background probe");

    // The stop hook fires once per completed turn; reaching the budget must end
    // the loop instead of dispatching a third model turn. Without the budget
    // wiring this marathon shape never terminates on its own.
    expect(getTurnCount()).toBe(2);
    expect(budgetChecks).toBe(2);
  });

  it("keeps un-budgeted runs unaffected until the model stops calling tools", async () => {
    const getTurnCount = mockToolCallMarathon({ textAfterTurns: 3 });
    const { session } = await createTestSession({
      customTools: [loopTool],
    });

    await session.prompt("run the background probe");

    // No stop hook installed: every tool round continues until the model's
    // final text turn closes the run naturally.
    expect(getTurnCount()).toBe(4);
    const lastAssistant = session.agent.state.messages.findLast(
      (message) => message.role === "assistant",
    ) as AssistantMessage | undefined;
    expect(lastAssistant?.stopReason).toBe("stop");
  });

  it("terminates a never-ending tool marathon exactly at the budget cap", async () => {
    // No textAfterTurns: this marathon would loop forever, so the budget stop
    // is the only exit. Heartbeat wakes install this hook through the run
    // loop's maxToolLoopAttempts cap (DEFAULT_HEARTBEAT_TOOL_LOOP_BUDGET).
    const getTurnCount = mockToolCallMarathon();
    let budgetChecks = 0;
    const { session } = await createTestSession({
      customTools: [loopTool],
      shouldStopAfterTurn: () => {
        budgetChecks += 1;
        return budgetChecks >= 3;
      },
    });

    await session.prompt("run the background probe");

    expect(getTurnCount()).toBe(3);
    expect(budgetChecks).toBe(3);
    // The loop's contract ends at the cap with the executed tool result of the
    // stopped turn as the last entry; the host terminal machinery owes the run
    // its graceful final answer turn (settled-turn finalization).
    expect(session.agent.state.messages.at(-1)?.role).toBe("toolResult");
  });
});
