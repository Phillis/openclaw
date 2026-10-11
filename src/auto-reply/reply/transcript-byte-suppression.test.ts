import { afterEach, describe, expect, it, vi } from "vitest";
import { emitAgentEvent } from "../../infra/agent-events.js";
import {
  maybeAlertTranscriptByteSuppression,
  resetTranscriptSuppressionAlertRateLimitsForTest,
  TRANSCRIPT_SUPPRESSION_ALERT_AFTER_MS,
  TRANSCRIPT_SUPPRESSION_ALERT_RATE_LIMIT_MS,
} from "./transcript-byte-suppression.js";

vi.mock("../../infra/agent-events.js", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../infra/agent-events.js")>();
  return { ...actual, emitAgentEvent: vi.fn() };
});

describe("maybeAlertTranscriptByteSuppression", () => {
  afterEach(() => {
    resetTranscriptSuppressionAlertRateLimitsForTest();
    vi.clearAllMocks();
  });

  it("never alerts when the latch age is unknown or below the threshold", () => {
    const now = Date.now();
    expect(
      maybeAlertTranscriptByteSuppression({
        activeTranscriptBytes: 12_900_000,
        autoTruncateOutcome: "locked",
        latchedAt: undefined,
        maxActiveTranscriptBytes: 2_000_000,
        now,
        runId: "run-1",
        sessionKey: "agent:oscar:main",
      }),
    ).toEqual({ alerted: false });
    expect(
      maybeAlertTranscriptByteSuppression({
        activeTranscriptBytes: 12_900_000,
        autoTruncateOutcome: "locked",
        latchedAt: now - (TRANSCRIPT_SUPPRESSION_ALERT_AFTER_MS - 1),
        maxActiveTranscriptBytes: 2_000_000,
        now,
        runId: "run-1",
        sessionKey: "agent:oscar:main",
      }),
    ).toMatchObject({ alerted: false });
    expect(emitAgentEvent).not.toHaveBeenCalled();
  });

  it("alerts once per rate window when suppression persisted past the threshold", () => {
    const now = Date.now();
    const latchedAt = now - (TRANSCRIPT_SUPPRESSION_ALERT_AFTER_MS + 60_000);
    const input = {
      activeTranscriptBytes: 12_900_000,
      agentId: "oscar",
      autoTruncateOutcome: "locked",
      latchedAt,
      maxActiveTranscriptBytes: 2_000_000,
      now,
      runId: "run-1",
      sessionKey: "agent:oscar:main",
    } as const;
    expect(maybeAlertTranscriptByteSuppression(input)).toMatchObject({
      alerted: true,
      persistedMs: TRANSCRIPT_SUPPRESSION_ALERT_AFTER_MS + 60_000,
    });
    expect(emitAgentEvent).toHaveBeenCalledTimes(1);
    expect(emitAgentEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        runId: "run-1",
        sessionKey: "agent:oscar:main",
        agentId: "oscar",
        stream: "compaction",
        data: expect.objectContaining({
          phase: "suppressed",
          level: "alert",
          activeTranscriptBytes: 12_900_000,
          maxActiveTranscriptBytes: 2_000_000,
        }),
      }),
    );
    // The next suppressed turn inside the rate window stays quiet.
    expect(
      maybeAlertTranscriptByteSuppression({
        ...input,
        now: now + (TRANSCRIPT_SUPPRESSION_ALERT_RATE_LIMIT_MS - 1),
        runId: "run-2",
      }),
    ).toMatchObject({ alerted: false, rateLimited: true });
    expect(emitAgentEvent).toHaveBeenCalledTimes(1);
    // Past the rate window the alert fires again for the still-suppressed seat.
    expect(
      maybeAlertTranscriptByteSuppression({
        ...input,
        now: now + TRANSCRIPT_SUPPRESSION_ALERT_RATE_LIMIT_MS + 1,
        runId: "run-3",
      }),
    ).toMatchObject({ alerted: true });
    expect(emitAgentEvent).toHaveBeenCalledTimes(2);
  });
});
