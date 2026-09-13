// Typed-error retry storm coverage: tools whose error contracts stamp typed
// codes (e.g. EXPECTED_VERSION_CONFLICT) can loop with rotating arguments, which
// every identical-args detector misses. The typed_error_repeat detector counts
// run-scoped failures per typed identity, args-agnostic, and stays silent until
// the tool contract's single retry is spent.
import { describe, expect, it, vi } from "vitest";
import type { ToolLoopDetectionConfig } from "../config/types.tools.js";
import type { SessionState, ToolCallRecord } from "../logging/diagnostic-session-state.js";

// Recognize a provider-docked send tool by name (only "telegram" here) so the
// volatility strip applies to it without pulling in the channel-plugin registry; the
// real detector is covered by embedded-agent-messaging's own tests.
const isMessagingToolSendActionMock = vi.hoisted(() =>
  vi.fn((toolName: string): boolean => toolName === "telegram"),
);
vi.mock("./embedded-agent-messaging.js", () => ({
  isMessagingToolSendAction: isMessagingToolSendActionMock,
}));
import {
  detectToolCallLoop,
  recordToolCall,
  recordToolCallOutcome,
} from "./tool-loop-detection.js";

const enabledLoopDetectionConfig: ToolLoopDetectionConfig = { enabled: true };

function createState(): SessionState {
  return {
    lastActivity: Date.now(),
    state: "processing",
    queueDepth: 0,
  };
}

function recordOutcome(params: {
  state: SessionState;
  toolName: string;
  toolParams: unknown;
  toolCallId: string;
  result?: unknown;
  error?: unknown;
  runId?: string;
}): ToolCallRecord | undefined {
  recordToolCall(
    params.state,
    params.toolName,
    params.toolParams,
    params.toolCallId,
    enabledLoopDetectionConfig,
    params.runId ? { runId: params.runId } : undefined,
  );
  return recordToolCallOutcome(params.state, {
    toolName: params.toolName,
    toolParams: params.toolParams,
    toolCallId: params.toolCallId,
    ...(params.result !== undefined ? { result: params.result } : {}),
    ...(params.error !== undefined ? { error: params.error } : {}),
    ...(params.runId ? { runId: params.runId } : {}),
  });
}

/** Dispatcher envelope with the inner error JSON the live conflict arrived in. */
function typedConflictResult(innerId: string, typedCode: string, version: number) {
  const errorText =
    `the expected story version (9) conflicted with the current canonical story version (${version}); ` +
    `re-read the story and retry the identical command once with expected_story_version set to ${version} ` +
    `| typed_code=${typedCode} | owner=story`;
  const inner = {
    status: "error",
    typed_code: typedCode,
    error: errorText,
  };
  return {
    content: [
      { type: "text", text: JSON.stringify({ tool: { id: innerId }, result: inner }, null, 2) },
    ],
    details: { tool: { id: innerId }, result: inner, status: "failed" },
  };
}

function storyReadResult(index: number) {
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(
          {
            status: "ok",
            version: 14,
            generated_at: `2026-09-10T18:${String(10 + index).padStart(2, "0")}:00Z`,
          },
          null,
          2,
        ),
      },
    ],
    details: { status: "ok" },
  };
}

function dispatcherParams(innerId: string, args: Record<string, unknown>) {
  return { id: innerId, args };
}

function conflictArgs(index: number): Record<string, unknown> {
  // Every retry rotates fabricated arguments exactly like the live storm.
  return {
    action: "approve_exception",
    story_id: "story-9f2",
    expected_story_version: 9,
    attempt: index,
    contract_hash: `sha256:fabricated${index}`,
  };
}

describe("typed_error_repeat detector", () => {
  it("replays the live EXPECTED_VERSION_CONFLICT storm: silent through the single retry, warning at #3, critical block at #5", () => {
    const state = createState();
    const readParams = dispatcherParams("ewt_v2_story_get", { story_id: "story-9f2" });
    let sequence = 0;
    const recordRead = () => {
      recordOutcome({
        state,
        toolName: "tool_call",
        toolParams: readParams,
        toolCallId: `call-${sequence}`,
        result: storyReadResult(sequence),
      });
      sequence += 1;
    };
    const recordConflict = () => {
      const index = sequence;
      sequence += 1;
      recordOutcome({
        state,
        toolName: "tool_call",
        toolParams: dispatcherParams("ewt_v2_story_control", conflictArgs(index)),
        toolCallId: `call-${index}`,
        result: typedConflictResult(
          "ewt_v2_story_control",
          "EXPECTED_VERSION_CONFLICT",
          14 + index,
        ),
      });
    };
    const detectNextConflict = () =>
      detectToolCallLoop(
        state,
        "tool_call",
        dispatcherParams("ewt_v2_story_control", conflictArgs(sequence + 1)),
        enabledLoopDetectionConfig,
      );

    recordRead();
    recordConflict();
    recordRead();
    recordConflict();
    // The tool contract's single retry is spent silently.
    expect(detectNextConflict()).toEqual({ stuck: false });

    recordConflict();
    recordRead();
    const warning = detectNextConflict();
    expect(warning).toMatchObject({
      stuck: true,
      level: "warning",
      detector: "typed_error_repeat",
      count: 3,
    });
    if (warning.stuck) {
      expect(warning.message).toContain("EXPECTED_VERSION_CONFLICT");
      expect(warning.message).toContain("park");
      expect(warning.message).toContain("final summary");
    }

    recordConflict();
    recordRead();
    const repeatedWarning = detectNextConflict();
    expect(repeatedWarning).toMatchObject({
      stuck: true,
      level: "warning",
      detector: "typed_error_repeat",
      count: 4,
    });

    recordConflict();
    recordRead();
    const critical = detectNextConflict();
    expect(critical).toMatchObject({
      stuck: true,
      level: "critical",
      detector: "typed_error_repeat",
      count: 5,
    });
    if (critical.stuck) {
      expect(critical.message).toContain("EXPECTED_VERSION_CONFLICT");
      expect(critical.message).toContain("park");
      expect(critical.message).toContain("final summary");
    }
  });

  it("keeps rotated typed codes as separate identities (A×2 + B×2 never fires)", () => {
    const state = createState();
    const recordCoded = (typedCode: string, index: number) => {
      recordOutcome({
        state,
        toolName: "tool_call",
        toolParams: dispatcherParams("ewt_v2_story_control", conflictArgs(index)),
        toolCallId: `call-${index}`,
        result: typedConflictResult("ewt_v2_story_control", typedCode, 14 + index),
      });
    };
    recordCoded("EXPECTED_VERSION_CONFLICT", 0);
    recordCoded("EXPECTED_VERSION_CONFLICT", 1);
    recordCoded("CONTRACT_HASH_MISMATCH", 2);
    recordCoded("CONTRACT_HASH_MISMATCH", 3);
    expect(
      detectToolCallLoop(
        state,
        "tool_call",
        dispatcherParams("ewt_v2_story_control", conflictArgs(4)),
        enabledLoopDetectionConfig,
      ),
    ).toEqual({ stuck: false });

    recordCoded("CONTRACT_HASH_MISMATCH", 4);
    const warning = detectToolCallLoop(
      state,
      "tool_call",
      dispatcherParams("ewt_v2_story_control", conflictArgs(5)),
      enabledLoopDetectionConfig,
    );
    // Only code B reached the threshold; code A's two failures never mixed in.
    expect(warning).toMatchObject({
      stuck: true,
      level: "warning",
      detector: "typed_error_repeat",
      count: 3,
    });
    if (warning.stuck) {
      expect(warning.message).toContain("CONTRACT_HASH_MISMATCH");
      expect(warning.message).not.toContain("EXPECTED_VERSION_CONFLICT");
    }
  });

  it("separates dispatcher inner-id families and never blocks the succeeding read target", () => {
    const state = createState();
    for (let index = 0; index < 5; index += 1) {
      recordOutcome({
        state,
        toolName: "tool_call",
        toolParams: dispatcherParams("ewt_v2_story_control", conflictArgs(index)),
        toolCallId: `call-${index}`,
        result: typedConflictResult(
          "ewt_v2_story_control",
          "EXPECTED_VERSION_CONFLICT",
          14 + index,
        ),
      });
    }
    // The interleaved story read succeeds all run; it must stay admissible.
    expect(
      detectToolCallLoop(
        state,
        "tool_call",
        dispatcherParams("ewt_v2_story_get", { story_id: "story-9f2" }),
        enabledLoopDetectionConfig,
      ),
    ).toEqual({ stuck: false });
    // A different dispatcher target is a different family.
    expect(
      detectToolCallLoop(
        state,
        "tool_call",
        dispatcherParams("ewt_v2_story_publish", { story_id: "story-9f2" }),
        enabledLoopDetectionConfig,
      ),
    ).toEqual({ stuck: false });
    expect(
      detectToolCallLoop(
        state,
        "tool_call",
        dispatcherParams("ewt_v2_story_control", conflictArgs(5)),
        enabledLoopDetectionConfig,
      ).stuck,
    ).toBe(true);
  });

  it("counts a plain tool's typed failures under the tool-name family", () => {
    const state = createState();
    for (let index = 0; index < 5; index += 1) {
      recordOutcome({
        state,
        toolName: "board_lock",
        toolParams: { lane: "beta", attempt: index },
        toolCallId: `call-${index}`,
        result: typedConflictResult("board_lock", "LANE_HELD", 14 + index),
      });
    }
    const critical = detectToolCallLoop(
      state,
      "board_lock",
      { lane: "beta", attempt: 5 },
      enabledLoopDetectionConfig,
    );
    expect(critical).toMatchObject({
      stuck: true,
      level: "critical",
      detector: "typed_error_repeat",
      count: 5,
    });
    // Other tools never inherit another tool's family.
    expect(
      detectToolCallLoop(state, "board_unlock", { lane: "beta" }, enabledLoopDetectionConfig),
    ).toEqual({ stuck: false });
  });

  it("stamps thrown typed errors and leaves unknown-tool errors unstamped", () => {
    const state = createState();
    for (let index = 0; index < 3; index += 1) {
      recordOutcome({
        state,
        toolName: "board_lock",
        toolParams: { lane: "beta", attempt: index },
        toolCallId: `throw-${index}`,
        error: new Error(`lane beta is held by another run | typed_code=LANE_HELD (${index})`),
      });
    }
    const warning = detectToolCallLoop(
      state,
      "board_lock",
      { lane: "beta", attempt: 3 },
      enabledLoopDetectionConfig,
    );
    expect(warning).toMatchObject({
      stuck: true,
      level: "warning",
      detector: "typed_error_repeat",
      count: 3,
    });

    const unknownState = createState();
    const unknownRecord = recordOutcome({
      state: unknownState,
      toolName: "board_lock",
      toolParams: { lane: "beta" },
      toolCallId: "unknown-0",
      error: new Error("Unknown tool: board_locko. Did you mean: board_lock?"),
    });
    expect(unknownRecord).toMatchObject({ unknownToolName: "board_locko." });
    expect(unknownRecord?.failureIdentityFamily).toBeUndefined();
    expect(unknownRecord?.typedErrorCode).toBeUndefined();
  });

  it("never stamps a successful result that merely echoes a typed code", () => {
    const state = createState();
    for (let index = 0; index < 2; index += 1) {
      recordOutcome({
        state,
        toolName: "tool_call",
        toolParams: dispatcherParams("ewt_v2_story_control", conflictArgs(index)),
        toolCallId: `call-${index}`,
        result: typedConflictResult(
          "ewt_v2_story_control",
          "EXPECTED_VERSION_CONFLICT",
          14 + index,
        ),
      });
    }
    const echoedRead = recordOutcome({
      state,
      toolName: "tool_call",
      toolParams: dispatcherParams("ewt_v2_story_get", { story_id: "story-9f2" }),
      toolCallId: "call-echo",
      result: {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              status: "ok",
              version: 14,
              lastConflict: "typed_code=EXPECTED_VERSION_CONFLICT",
            }),
          },
        ],
        details: { status: "ok", lastConflict: "typed_code=EXPECTED_VERSION_CONFLICT" },
      },
    });
    expect(echoedRead?.failureIdentityFamily).toBeUndefined();
    expect(echoedRead?.typedErrorCode).toBeUndefined();
    // The echoed success must not inflate the conflict count past the retry.
    expect(
      detectToolCallLoop(
        state,
        "tool_call",
        dispatcherParams("ewt_v2_story_control", conflictArgs(2)),
        enabledLoopDetectionConfig,
      ),
    ).toEqual({ stuck: false });
  });

  it("scopes typed failure counting to the run", () => {
    const state = createState();
    for (let index = 0; index < 5; index += 1) {
      recordOutcome({
        state,
        toolName: "tool_call",
        toolParams: dispatcherParams("ewt_v2_story_control", conflictArgs(index)),
        toolCallId: `call-${index}`,
        result: typedConflictResult(
          "ewt_v2_story_control",
          "EXPECTED_VERSION_CONFLICT",
          14 + index,
        ),
        runId: "run-a",
      });
    }
    expect(
      detectToolCallLoop(
        state,
        "tool_call",
        dispatcherParams("ewt_v2_story_control", conflictArgs(5)),
        enabledLoopDetectionConfig,
        { runId: "run-b" },
      ),
    ).toEqual({ stuck: false });
    expect(
      detectToolCallLoop(
        state,
        "tool_call",
        dispatcherParams("ewt_v2_story_control", conflictArgs(5)),
        enabledLoopDetectionConfig,
        { runId: "run-a" },
      ).stuck,
    ).toBe(true);
  });

  it("leaves exec outcome identity untouched", () => {
    const state = createState();
    for (let index = 0; index < 6; index += 1) {
      const record = recordOutcome({
        state,
        toolName: "exec",
        toolParams: { command: `report-${index}` },
        toolCallId: `exec-${index}`,
        result: {
          content: [
            {
              type: "text",
              text: `lane held\ntyped_code=EXPECTED_VERSION_CONFLICT\n(command exited with code 1)`,
            },
          ],
          details: {
            status: "completed",
            exitCode: 1,
            aggregated: `lane held\ntyped_code=EXPECTED_VERSION_CONFLICT\n(command exited with code 1)`,
          },
        },
      });
      expect(record).toMatchObject({ outcomeKind: "terminal-exec-failure" });
      expect(record?.failureIdentityHash).toBeDefined();
      expect(record?.failureIdentityFamily).toBeUndefined();
      expect(record?.typedErrorCode).toBeUndefined();
    }
    // Rotating exec args keep the existing no-progress behavior (no typed veto).
    expect(
      detectToolCallLoop(state, "exec", { command: "report-6" }, enabledLoopDetectionConfig),
    ).toEqual({ stuck: false });
  });
});
