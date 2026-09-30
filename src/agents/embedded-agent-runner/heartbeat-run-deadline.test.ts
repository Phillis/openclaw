import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { OpenClawTestState } from "../../test-utils/openclaw-test-state.js";
import {
  buildEmbeddedRunnerAssistant,
  makeEmbeddedRunnerAttempt,
} from "../test-helpers/embedded-agent-runner-e2e-fixtures.js";
import { makeAttemptResult } from "./run.overflow-compaction.fixture.js";
import {
  mockedBuildEmbeddedRunPayloads,
  mockedRunEmbeddedAttempt,
  createOverflowRunParams,
  resetSharedRunIntegrationHarnessMocks,
  useOpenAIPlatformAuthFixture,
} from "./run.overflow-compaction.harness.js";
import { loadSharedRunIntegrationHarness } from "./run.shared-integration-harness.test-support.js";
import { withAuthorizedPermissionChange } from "./run/permission-change.js";
import type { EmbeddedRunAttemptParams } from "./run/types.js";

const SUMMARY_TEXT = "Board settled: all clear.";
const NARRATION_TEXT = "Checking the queue before reporting.";
const RUN_TIMEOUT_MS = 30_000;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/** The mocked harness only supports the OpenAI route; keep the plugin harness selected. */
function createPluginHarnessRunParams(state: OpenClawTestState) {
  return {
    ...createOverflowRunParams(state),
    provider: "openai",
    model: "gpt-5.6-luna",
    sessionRoot: state.sessionsDir(),
  } as const;
}

/**
 * First attempt of the two-attempt shape: burns wall clock, then requests the
 * permission continuation the run loop re-dispatches from.
 */
function mockFirstPermissionAttempt(recorder: { timeoutMs?: number; sleepMs?: number }) {
  mockedRunEmbeddedAttempt.mockImplementationOnce(async (attempt) => {
    recorder.timeoutMs = attempt.timeoutMs;
    if (recorder.sleepMs !== undefined) {
      await delay(recorder.sleepMs);
    }
    withAuthorizedPermissionChange(
      attempt.permissionChange!.owner,
      "full",
      () => void attempt.permissionChange!.request("full"),
    );
    return makeAttemptResult({
      aborted: true,
      toolMetas: [{ toolName: "exec", meta: "completed mutation" }],
      replayMetadata: { replaySafe: false, hadPotentialSideEffects: true },
    });
  });
}

/** Second attempt: acknowledges the applied mode like the real attempt backend would. */
function mockContinuationAttempt(recorder: { timeoutMs?: number }) {
  mockedRunEmbeddedAttempt.mockImplementationOnce(async (attempt) => {
    recorder.timeoutMs = attempt.timeoutMs;
    // The real backend records the installed mode; the mock replays that fact
    // so the permission continuation loop can settle.
    attempt.permissionChange?.applied();
    return makeAttemptResult({ assistantTexts: ["Continued"] });
  });
}

let state: OpenClawTestState;

describe("embedded run wall-clock deadline (heartbeat/cron/ask scope)", () => {
  let runEmbeddedAgent: Awaited<ReturnType<typeof loadSharedRunIntegrationHarness>>;
  let buildEmbeddedRunPayloads: typeof import("./run/payloads.js").buildEmbeddedRunPayloads;

  beforeAll(async () => {
    runEmbeddedAgent = await loadSharedRunIntegrationHarness();
    ({ buildEmbeddedRunPayloads } =
      await vi.importActual<typeof import("./run/payloads.js")>("./run/payloads.js"));
  });

  beforeEach(async () => {
    resetSharedRunIntegrationHarnessMocks();
    const { createOpenClawTestState } = await import("../../test-utils/openclaw-test-state.js");
    state = await createOpenClawTestState({ label: "heartbeat-run-deadline" });
    useOpenAIPlatformAuthFixture();
  });

  afterEach(async () => {
    await state?.cleanup();
  });

  it("clamps a retry attempt to the remaining run wall clock", async () => {
    // Deliberate per-run deadline: the run started with the override marker
    // set. The first attempt burns 2s of wall clock, then a permission
    // continuation re-dispatches; the retry must not re-arm the full 30s —
    // only the remaining run budget.
    const first: { timeoutMs?: number } = { sleepMs: 2_000 };
    const second: { timeoutMs?: number } = {};
    mockFirstPermissionAttempt(first);
    mockContinuationAttempt(second);

    await runEmbeddedAgent({
      ...createPluginHarnessRunParams(state),
      permissionMode: "workspace",
      timeoutMs: RUN_TIMEOUT_MS,
      runTimeoutOverrideMs: RUN_TIMEOUT_MS,
      runId: "run-heartbeat-deadline-clamp",
    });

    expect(first.timeoutMs).toBeLessThanOrEqual(RUN_TIMEOUT_MS);
    expect(first.timeoutMs).toBeGreaterThan(RUN_TIMEOUT_MS - 2_000);
    expect(second.timeoutMs).toBeLessThan(RUN_TIMEOUT_MS);
    expect(second.timeoutMs).toBeGreaterThanOrEqual(RUN_TIMEOUT_MS - 10_000);
    expect(mockedRunEmbeddedAttempt).toHaveBeenCalledTimes(2);
  });

  it("keeps the full attempt timeout when the run has no deliberate override", async () => {
    // Scope-leak guard: user/manual turns keep today's per-attempt semantics.
    const first: { timeoutMs?: number } = { sleepMs: 2_000 };
    const second: { timeoutMs?: number } = {};
    mockFirstPermissionAttempt(first);
    mockContinuationAttempt(second);

    await runEmbeddedAgent({
      ...createPluginHarnessRunParams(state),
      permissionMode: "workspace",
      timeoutMs: RUN_TIMEOUT_MS,
      runId: "run-heartbeat-deadline-no-override",
    });

    expect(first.timeoutMs).toBe(RUN_TIMEOUT_MS);
    expect(second.timeoutMs).toBe(RUN_TIMEOUT_MS);
    expect(mockedRunEmbeddedAttempt).toHaveBeenCalledTimes(2);
  });

  it("soft-stops inside the reserve and settles a summary through finalization", async () => {
    // With the 90s soft-stop reserve, a run whose wall clock already sits
    // inside the reserve stops dispatching tool rounds after the first
    // completed turn. The stopped turn's narration is not a final answer, so
    // the run still owes one tool-free settled-turn summary instead of
    // burning to the hard per-attempt timeout.
    const narrationAssistant = buildEmbeddedRunnerAssistant({
      stopReason: "toolUse",
      content: [
        { type: "text", text: NARRATION_TEXT },
        { type: "toolCall", id: "tool-1", name: "story_list", arguments: {} },
      ],
    });
    const summaryAssistant = buildEmbeddedRunnerAssistant({
      stopReason: "stop",
      content: [{ type: "text", text: SUMMARY_TEXT }],
    });
    const finalizerTimeouts: number[] = [];
    mockedRunEmbeddedAttempt.mockImplementationOnce(async (attempt) => {
      // A completed turn inside the reserve: the run-owned stop hook now trips.
      expect(attempt.shouldStopAfterTurn?.()).toBe(true);
      return makeEmbeddedRunnerAttempt({
        sessionIdUsed: "test-session",
        assistantTexts: [NARRATION_TEXT],
        toolMetas: [{ toolCallId: "tool-1", toolName: "story_list", isError: false }],
        itemLifecycle: { startedCount: 1, completedCount: 1, activeCount: 0 },
        messagesSnapshot: [
          { role: "user", content: [{ type: "text", text: "[OpenClaw heartbeat poll]" }] },
          narrationAssistant,
          {
            role: "toolResult",
            toolCallId: "tool-1",
            toolName: "story_list",
            content: [{ type: "text", text: "queue empty" }],
            isError: false,
          },
        ] as never,
        lastAssistant: narrationAssistant,
        currentAttemptAssistant: narrationAssistant,
        currentAttemptCompletedAssistant: narrationAssistant,
        replayMetadata: { hadPotentialSideEffects: false, replaySafe: true },
        currentAttemptReplayMetadata: { hadPotentialSideEffects: false, replaySafe: true },
      } as never);
    });
    mockedRunEmbeddedAttempt.mockImplementationOnce(async (attempt: EmbeddedRunAttemptParams) => {
      expect(attempt.disableTools).toBe(true);
      expect(attempt.operation).toBe("settled-tool-finalization");
      finalizerTimeouts.push(attempt.timeoutMs);
      return makeEmbeddedRunnerAttempt({
        sessionIdUsed: "test-session",
        assistantTexts: [SUMMARY_TEXT],
        messagesSnapshot: [{ role: "assistant", content: summaryAssistant.content }] as never,
        lastAssistant: summaryAssistant,
        currentAttemptAssistant: summaryAssistant,
        currentAttemptCompletedAssistant: summaryAssistant,
      } as never);
    });
    // The summary assertion reads real payloads built from the finalizer.
    mockedBuildEmbeddedRunPayloads.mockImplementation((params) => buildEmbeddedRunPayloads(params));

    const result = await runEmbeddedAgent({
      ...createPluginHarnessRunParams(state),
      timeoutMs: RUN_TIMEOUT_MS,
      runTimeoutOverrideMs: RUN_TIMEOUT_MS,
      runId: "run-heartbeat-deadline-soft-stop",
    });

    expect(mockedRunEmbeddedAttempt).toHaveBeenCalledTimes(2);
    // The summary turn's timer is also bound to the remaining run wall clock.
    expect(finalizerTimeouts[0]).toBeGreaterThan(0);
    expect(finalizerTimeouts[0]).toBeLessThan(RUN_TIMEOUT_MS);
    const payloadTexts = (result.payloads ?? []).map((payload) => payload.text);
    expect(payloadTexts).toContain(SUMMARY_TEXT);
    expect(result.meta?.aborted).toBeFalsy();
    expect(result.meta?.error).toBeUndefined();
  });

  it("settles a summary when the in-flight turn finishes just after the deadline", async () => {
    // Live-observed residual gap: the wall-clock soft stop fired, but the
    // in-flight turn straddled the deadline and completed after it (drain
    // grace). Finalization used to receive a ~zero clamp against the
    // already-passed deadline, could not complete, and the run hit the hard
    // backstop as timeout-with-no-summary — 31 turns of real work lost from
    // the record. The finalizer must instead receive a real, bounded timer so
    // the heavy poll settles DONE with a summary.
    const narrationAssistant = buildEmbeddedRunnerAssistant({
      stopReason: "toolUse",
      content: [
        { type: "text", text: NARRATION_TEXT },
        { type: "toolCall", id: "tool-1", name: "story_list", arguments: {} },
      ],
    });
    const summaryAssistant = buildEmbeddedRunnerAssistant({
      stopReason: "stop",
      content: [{ type: "text", text: SUMMARY_TEXT }],
    });
    const finalizerTimeouts: number[] = [];
    const RUN_DEADLINE_MS = 3_000;
    mockedRunEmbeddedAttempt.mockImplementationOnce(async (attempt) => {
      // The soft stop is already latched (the 3s deadline sits inside the 90s
      // reserve), and the turn runs past the deadline before completing.
      expect(attempt.shouldStopAfterTurn?.()).toBe(true);
      await delay(RUN_DEADLINE_MS + 200);
      return makeEmbeddedRunnerAttempt({
        sessionIdUsed: "test-session",
        assistantTexts: [NARRATION_TEXT],
        toolMetas: [{ toolCallId: "tool-1", toolName: "story_list", isError: false }],
        itemLifecycle: { startedCount: 1, completedCount: 1, activeCount: 0 },
        messagesSnapshot: [
          { role: "user", content: [{ type: "text", text: "[OpenClaw heartbeat poll]" }] },
          narrationAssistant,
          {
            role: "toolResult",
            toolCallId: "tool-1",
            toolName: "story_list",
            content: [{ type: "text", text: "queue empty" }],
            isError: false,
          },
        ] as never,
        lastAssistant: narrationAssistant,
        currentAttemptAssistant: narrationAssistant,
        currentAttemptCompletedAssistant: narrationAssistant,
        replayMetadata: { hadPotentialSideEffects: false, replaySafe: true },
        currentAttemptReplayMetadata: { hadPotentialSideEffects: false, replaySafe: true },
      } as never);
    });
    mockedRunEmbeddedAttempt.mockImplementationOnce(async (attempt: EmbeddedRunAttemptParams) => {
      expect(attempt.disableTools).toBe(true);
      expect(attempt.operation).toBe("settled-tool-finalization");
      finalizerTimeouts.push(attempt.timeoutMs);
      return makeEmbeddedRunnerAttempt({
        sessionIdUsed: "test-session",
        assistantTexts: [SUMMARY_TEXT],
        messagesSnapshot: [{ role: "assistant", content: summaryAssistant.content }] as never,
        lastAssistant: summaryAssistant,
        currentAttemptAssistant: summaryAssistant,
        currentAttemptCompletedAssistant: summaryAssistant,
      } as never);
    });
    mockedBuildEmbeddedRunPayloads.mockImplementation((params) => buildEmbeddedRunPayloads(params));

    const result = await runEmbeddedAgent({
      ...createPluginHarnessRunParams(state),
      timeoutMs: 600_000,
      runTimeoutOverrideMs: RUN_DEADLINE_MS,
      runId: "run-heartbeat-deadline-past-due-finalization",
    });

    expect(mockedRunEmbeddedAttempt).toHaveBeenCalledTimes(2);
    // The passed deadline must not degenerate the finalizer timer to ~1ms.
    expect(finalizerTimeouts[0]).toBeGreaterThan(1_000);
    // Still bounded: never more than the attempt's own run-clamped budget.
    expect(finalizerTimeouts[0]).toBeLessThanOrEqual(RUN_DEADLINE_MS);
    const payloadTexts = (result.payloads ?? []).map((payload) => payload.text);
    expect(payloadTexts).toContain(SUMMARY_TEXT);
    expect(result.meta?.aborted).toBeFalsy();
    expect(result.meta?.error).toBeUndefined();
  });

  it("does not finalize the same narration shape without a run deadline", async () => {
    // Precision guard: without a budget stop, narration payloads keep the
    // established gate (they are classified downstream, not finalized here).
    const narrationAssistant = buildEmbeddedRunnerAssistant({
      stopReason: "toolUse",
      content: [
        { type: "text", text: NARRATION_TEXT },
        { type: "toolCall", id: "tool-1", name: "story_list", arguments: {} },
      ],
    });
    mockedRunEmbeddedAttempt.mockImplementationOnce(async (attempt) => {
      expect(attempt.shouldStopAfterTurn).toBeUndefined();
      return makeEmbeddedRunnerAttempt({
        sessionIdUsed: "test-session",
        assistantTexts: [NARRATION_TEXT],
        toolMetas: [{ toolCallId: "tool-1", toolName: "story_list", isError: false }],
        itemLifecycle: { startedCount: 1, completedCount: 1, activeCount: 0 },
        messagesSnapshot: [
          { role: "user", content: [{ type: "text", text: "run the probe" }] },
          narrationAssistant,
          {
            role: "toolResult",
            toolCallId: "tool-1",
            toolName: "story_list",
            content: [{ type: "text", text: "queue empty" }],
            isError: false,
          },
        ] as never,
        lastAssistant: narrationAssistant,
        currentAttemptAssistant: narrationAssistant,
        currentAttemptCompletedAssistant: narrationAssistant,
        replayMetadata: { hadPotentialSideEffects: false, replaySafe: true },
        currentAttemptReplayMetadata: { hadPotentialSideEffects: false, replaySafe: true },
      } as never);
    });
    // Narration must be visible as a payload for the precision guard to mean
    // anything: with payloadCount 1 and no budget stop, the established gate
    // disqualifies the graceful terminal turn.
    mockedBuildEmbeddedRunPayloads.mockImplementation((params) => buildEmbeddedRunPayloads(params));

    await runEmbeddedAgent({
      ...createPluginHarnessRunParams(state),
      timeoutMs: RUN_TIMEOUT_MS,
      runId: "run-heartbeat-deadline-no-stop",
    });

    expect(mockedRunEmbeddedAttempt).toHaveBeenCalledTimes(1);
  });
});
