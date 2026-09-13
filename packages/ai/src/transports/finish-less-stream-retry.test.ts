import { describe, expect, it, vi } from "vitest";
import {
  FINISH_LESS_STREAM_MAX_ATTEMPTS,
  StreamEndedWithoutFinishReasonError,
  finishLessStreamRetryDelayMs,
  isPrematureBodyTerminationError,
  isPrematureBodyTerminationMessage,
  isRetryableFinishLessStreamError,
  isStreamEndedWithoutFinishReasonError,
  isStreamEndedWithoutFinishReasonMessage,
  withFinishLessStreamRetry,
} from "./finish-less-stream-retry.js";

describe("StreamEndedWithoutFinishReasonError", () => {
  it("keeps the harness-owned message so serialized consumers still match", () => {
    const error = new StreamEndedWithoutFinishReasonError();
    expect(error.message).toBe("Stream ended without finish_reason");
    expect(error.name).toBe("StreamEndedWithoutFinishReasonError");
    expect(error).toBeInstanceOf(Error);
  });

  it("matches only the typed class, never provider-authored text", () => {
    expect(isStreamEndedWithoutFinishReasonError(new StreamEndedWithoutFinishReasonError())).toBe(
      true,
    );
    expect(
      isStreamEndedWithoutFinishReasonError(new Error("Stream ended without finish_reason")),
    ).toBe(false);
    expect(isStreamEndedWithoutFinishReasonError("Stream ended without finish_reason")).toBe(false);
    expect(isStreamEndedWithoutFinishReasonError(undefined)).toBe(false);
  });

  it("matches the canonical message for serialized error fallbacks only", () => {
    expect(isStreamEndedWithoutFinishReasonMessage("Stream ended without finish_reason")).toBe(
      true,
    );
    expect(isStreamEndedWithoutFinishReasonMessage("stream ended without finish_reason (x2)")).toBe(
      true,
    );
    expect(isStreamEndedWithoutFinishReasonMessage("Connection reset by peer")).toBe(false);
    expect(isStreamEndedWithoutFinishReasonMessage(undefined)).toBe(false);
  });
});

describe("premature body termination predicates", () => {
  it("matches undici terminated and premature-close family errors", () => {
    // undici's live body-termination error (RCA 2026-09-13, synthetic Kimi-K3).
    const terminated = new TypeError("terminated");
    terminated.cause = Object.assign(new Error("other side closed"), { code: "UND_ERR_SOCKET" });
    expect(isPrematureBodyTerminationError(terminated)).toBe(true);
    expect(
      isPrematureBodyTerminationError(
        Object.assign(new Error("Premature close"), { code: "ERR_STREAM_PREMATURE_CLOSE" }),
      ),
    ).toBe(true);
    expect(isPrematureBodyTerminationError(new Error("socket hang up"))).toBe(true);
    expect(isPrematureBodyTerminationMessage("terminated")).toBe(true);
    expect(isPrematureBodyTerminationMessage("fetch failed: connection closed unexpectedly")).toBe(
      true,
    );
    expect(isPrematureBodyTerminationMessage("terminated: UND_ERR_SOCKET")).toBe(true);
  });

  it("never matches provider-authored HTTP errors, aborts, or unrelated text", () => {
    const httpError = Object.assign(new Error("Request terminated: policy violation"), {
      status: 502,
    });
    expect(isPrematureBodyTerminationError(httpError)).toBe(false);
    expect(
      isPrematureBodyTerminationError(Object.assign(new Error("terminated"), { statusCode: 429 })),
    ).toBe(false);
    expect(isPrematureBodyTerminationError(new Error("This operation was aborted"))).toBe(false);
    expect(isPrematureBodyTerminationError(new Error("sigkill"))).toBe(false);
    expect(isPrematureBodyTerminationError(new Error("rate limit exceeded"))).toBe(false);
    expect(isPrematureBodyTerminationError("terminated")).toBe(false);
    expect(isPrematureBodyTerminationError(undefined)).toBe(false);
    expect(isPrematureBodyTerminationMessage(undefined)).toBe(false);
  });

  it("exposes both retryable classes through isRetryableFinishLessStreamError", () => {
    expect(isRetryableFinishLessStreamError(new StreamEndedWithoutFinishReasonError())).toBe(true);
    expect(isRetryableFinishLessStreamError(new TypeError("terminated"))).toBe(true);
    expect(isRetryableFinishLessStreamError(new Error("connection reset by peer"))).toBe(false);
    expect(isRetryableFinishLessStreamError(new Error("HTTP 500: internal error"))).toBe(false);
  });
});

describe("finishLessStreamRetryDelayMs", () => {
  it("stays jittered around ~300ms", () => {
    for (let index = 0; index < 200; index += 1) {
      const delay = finishLessStreamRetryDelayMs();
      expect(delay).toBeGreaterThanOrEqual(240);
      expect(delay).toBeLessThan(360);
    }
  });
});

describe("withFinishLessStreamRetry", () => {
  it("retries once on the typed signature and resets per-attempt state", async () => {
    const attempts: number[] = [];
    const observedToolcallEndCounts: number[] = [];
    const onRetry = vi.fn();
    const result = await withFinishLessStreamRetry({
      retryDelayMs: () => 0,
      onRetry,
      run: async (attempt, attemptState) => {
        attempts.push(attempt);
        if (attempt === 1) {
          attemptState.toolcallEndCount = 0;
          throw new StreamEndedWithoutFinishReasonError();
        }
        observedToolcallEndCounts.push(attemptState.toolcallEndCount);
        return "second-attempt";
      },
    });

    expect(result).toBe("second-attempt");
    expect(attempts).toEqual([1, 2]);
    expect(observedToolcallEndCounts).toEqual([0]);
    expect(onRetry).toHaveBeenCalledTimes(1);
    expect(onRetry).toHaveBeenCalledWith(1, expect.any(StreamEndedWithoutFinishReasonError));
  });

  it("retries a stream terminated mid-body with zero toolcall_end, then succeeds", async () => {
    // RCA 2026-09-13: undici body termination mid-thinking, zero toolcall_end,
    // previously fell through the gate and stranded the run.
    const attempts: number[] = [];
    const onRetry = vi.fn();
    const result = await withFinishLessStreamRetry({
      retryDelayMs: () => 0,
      onRetry,
      run: async (attempt) => {
        attempts.push(attempt);
        if (attempt === 1) {
          throw new TypeError("terminated");
        }
        return "second-attempt";
      },
    });

    expect(result).toBe("second-attempt");
    expect(attempts).toEqual([1, 2]);
    expect(onRetry).toHaveBeenCalledTimes(1);
    expect(onRetry).toHaveBeenCalledWith(1, expect.any(TypeError));
  });

  it("does not retry a terminated stream once a toolcall_end was emitted", async () => {
    const run = vi.fn(async (_attempt: number, attemptState: { toolcallEndCount: number }) => {
      attemptState.toolcallEndCount += 1;
      throw new TypeError("terminated");
    });

    await expect(withFinishLessStreamRetry({ retryDelayMs: () => 0, run })).rejects.toThrow(
      "terminated",
    );
    expect(run).toHaveBeenCalledTimes(1);
  });

  it("does not attempt a third request when the termination retry also dies", async () => {
    const run = vi.fn(async () => {
      throw new TypeError("terminated");
    });

    await expect(withFinishLessStreamRetry({ retryDelayMs: () => 0, run })).rejects.toThrow(
      "terminated",
    );
    expect(run).toHaveBeenCalledTimes(FINISH_LESS_STREAM_MAX_ATTEMPTS);
  });

  it("never retries provider-authored HTTP errors even when the text mentions termination", async () => {
    const httpError = Object.assign(new Error("Request terminated: upstream policy"), {
      status: 502,
    });
    const run = vi.fn(async () => {
      throw httpError;
    });

    await expect(withFinishLessStreamRetry({ retryDelayMs: () => 0, run })).rejects.toBe(httpError);
    expect(run).toHaveBeenCalledTimes(1);
  });

  it("does not retry a terminated stream after the caller aborted", async () => {
    const controller = new AbortController();
    const run = vi.fn(async () => {
      controller.abort();
      throw new TypeError("terminated");
    });

    await expect(
      withFinishLessStreamRetry({ signal: controller.signal, retryDelayMs: () => 0, run }),
    ).rejects.toThrow("terminated");
    expect(run).toHaveBeenCalledTimes(1);
  });

  it("does not attempt a third request when the retry also ends finish-less", async () => {
    const run = vi.fn(async () => {
      throw new StreamEndedWithoutFinishReasonError();
    });

    await expect(withFinishLessStreamRetry({ retryDelayMs: () => 0, run })).rejects.toBeInstanceOf(
      StreamEndedWithoutFinishReasonError,
    );
    expect(run).toHaveBeenCalledTimes(FINISH_LESS_STREAM_MAX_ATTEMPTS);
  });

  it("never retries a spoofed plain Error carrying the canonical message", async () => {
    const run = vi.fn(async () => {
      throw new Error("Stream ended without finish_reason");
    });

    await expect(withFinishLessStreamRetry({ retryDelayMs: () => 0, run })).rejects.toThrow(
      "Stream ended without finish_reason",
    );
    expect(run).toHaveBeenCalledTimes(1);
  });

  it("does not retry unrelated errors", async () => {
    const failure = new Error("connection reset");
    const run = vi.fn(async () => {
      throw failure;
    });

    await expect(withFinishLessStreamRetry({ retryDelayMs: () => 0, run })).rejects.toBe(failure);
    expect(run).toHaveBeenCalledTimes(1);
  });

  it("does not retry after the caller aborted", async () => {
    const controller = new AbortController();
    const run = vi.fn(async () => {
      controller.abort();
      throw new StreamEndedWithoutFinishReasonError();
    });

    await expect(
      withFinishLessStreamRetry({ signal: controller.signal, retryDelayMs: () => 0, run }),
    ).rejects.toBeInstanceOf(StreamEndedWithoutFinishReasonError);
    expect(run).toHaveBeenCalledTimes(1);
  });

  it("does not retry once a toolcall_end event was emitted this call", async () => {
    const run = vi.fn(async (_attempt: number, attemptState: { toolcallEndCount: number }) => {
      attemptState.toolcallEndCount += 1;
      throw new StreamEndedWithoutFinishReasonError();
    });

    await expect(withFinishLessStreamRetry({ retryDelayMs: () => 0, run })).rejects.toBeInstanceOf(
      StreamEndedWithoutFinishReasonError,
    );
    expect(run).toHaveBeenCalledTimes(1);
  });
});
