import { StreamEndedWithoutFinishReasonError } from "@openclaw/ai/transports";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AssistantMessage } from "../../../llm/types.js";
import { PROVIDER_FAILURE_WITH_OUTPUT_ERROR_CODE } from "../../../llm/types.js";
import {
  buildEmbeddedRunnerAssistant,
  makeEmbeddedRunnerAttempt,
} from "../../test-helpers/embedded-agent-runner-e2e-fixtures.js";
import { handleEmbeddedAssistantFailure } from "./assistant-failure.js";
import {
  isMidStreamDropError,
  isMidStreamDropWithoutFinishReason,
  MAX_MIDSTREAM_DROP_RETRIES,
} from "./midstream-drop-retry.js";
import { resolveEmbeddedRunAttemptTerminalState } from "./terminal-outcome.js";

type AssistantFailureInput = Parameters<typeof handleEmbeddedAssistantFailure>[0];

/**
 * PHIL-FORK (BUG-019) regression suite. Live evidence (magnus E00-F07 g2,
 * 2026-09-04T18:42:13.970Z, transcript seq 32): opencode-go 200 + ~3.6s of
 * partial SSE, stream ended without finish_reason → assistant message
 * stopReason=error, errorMessage="Stream ended without finish_reason",
 * content: [], zero usage — and the run ended TERMINAL with no retry and no
 * failover. The durable fix retries the attempt from the unchanged
 * conversation state.
 */
function makeMidStreamDropInput(options?: {
  assistantTexts?: string[];
  emptyErrorRetries?: number;
  errorMessage?: string;
  maybeRetryTransient?: () => Promise<boolean>;
  replaySafe?: boolean;
}) {
  const replaySafe = options?.replaySafe !== false;
  // Byte-for-byte the live evidence shape (errorMessage overridable for the
  // premature-termination mirror: undici `TypeError: terminated`).
  const assistant = buildEmbeddedRunnerAssistant({
    provider: "opencode-go",
    model: "glm-5.3-flash",
    stopReason: "error",
    errorMessage: options?.errorMessage ?? "Stream ended without finish_reason",
    content: [],
  });
  const replayMetadata = { hadPotentialSideEffects: !replaySafe, replaySafe };
  const attempt = makeEmbeddedRunnerAttempt({
    // Partial streamed text was observed before the drop — the reason the
    // silent-error gate (which requires empty assistantTexts) cannot absorb
    // this class.
    assistantTexts: options?.assistantTexts ?? ["I have verified the"],
    lastAssistant: assistant,
    currentAttemptAssistant: assistant,
    currentAttemptReplayMetadata: replayMetadata,
    replayMetadata,
    toolMetas: replaySafe ? [] : [{ toolName: "edit", replaySafe: false }],
  });
  const input: AssistantFailureInput = {
    runParams: { sessionId: "session:midstream-drop-test" },
    attempt,
    attemptAssistant: assistant,
    currentAttemptAssistant: assistant,
    terminalState: resolveEmbeddedRunAttemptTerminalState({ attempt, assistant }),
    activeErrorContext: { provider: "opencode-go", model: "glm-5.3-flash" },
    provider: "opencode-go",
    providerOwner: undefined,
    modelId: "glm-5.3-flash",
    model: "glm-5.3-flash",
    thinkLevel: "off",
    getThinkLevel: () => "off",
    attemptedThinking: new Set(["off"]),
    fallbackConfigured: true,
    pluginHarnessOwnsTransport: true,
    authProfileId: undefined,
    authProfileStore: { version: 1, profiles: {}, usageStats: {} },
    runtimeAuthRetry: false,
    maybeRefreshRuntimeAuthForAuthError: vi.fn(async () => false),
    emptyErrorRetries: options?.emptyErrorRetries ?? 0,
    overloadProfileRotations: 0,
    previousRetryFailoverReason: null,
    // Upstream consolidated the failover collaborators under `input.failover`
    // (EmbeddedRunFailoverRetryController pick); the mid-stream port consults
    // failover.maybeRetryTransient once the local budget is exhausted.
    failover: {
      resolveAuthProfileFailureReason: () => null,
      maybeMarkAuthProfileFailure: vi.fn(async () => {}),
      advanceAuthProfile: vi.fn(async () => false),
      advanceRateLimitAuthProfile: vi.fn(async () => false),
      transientRetryCount: 0,
      overloadProfileRotationLimit: 1,
      maybeRetryTransient: vi.fn(options?.maybeRetryTransient ?? (async () => false)),
    },
    traceAttempts: [],
    suspendForFailure: vi.fn(),
    suspensionSessionId: "session:midstream-drop-test",
    agentDir: "/tmp/openclaw-midstream-drop-test",
    isProbeSession: false,
  } as unknown as AssistantFailureInput;
  return { assistant, input };
}

describe("isMidStreamDropError", () => {
  it("matches the live typed transport error instance", () => {
    expect(isMidStreamDropError(new StreamEndedWithoutFinishReasonError())).toBe(true);
  });

  it("falls back to the canonical message for serialized plain Errors", () => {
    expect(isMidStreamDropError(new Error("Stream ended without finish_reason"))).toBe(true);
    expect(isMidStreamDropError(new Error("rate limit exceeded, retry after 30s"))).toBe(false);
  });

  it("matches premature body termination signatures (undici terminated family)", () => {
    expect(isMidStreamDropError(new TypeError("terminated"))).toBe(true);
    expect(isMidStreamDropError(new Error("Premature close"))).toBe(true);
    expect(isMidStreamDropError(new Error("other side closed"))).toBe(true);
    expect(isMidStreamDropError(new Error("This operation was aborted"))).toBe(false);
  });
});

describe("isMidStreamDropWithoutFinishReason", () => {
  it("matches the live evidence signature", () => {
    const assistant = {
      stopReason: "error",
      errorMessage: "Stream ended without finish_reason",
    } as AssistantMessage;
    expect(isMidStreamDropWithoutFinishReason(assistant)).toBe(true);
  });

  it("matches premature body termination signatures", () => {
    expect(
      isMidStreamDropWithoutFinishReason({
        stopReason: "error",
        errorMessage: "terminated",
      } as AssistantMessage),
    ).toBe(true);
    expect(
      isMidStreamDropWithoutFinishReason({
        stopReason: "error",
        errorMessage: "Premature close",
      } as AssistantMessage),
    ).toBe(true);
  });

  it("excludes process kill signals: sigkill/sigterm are not body terminations", () => {
    // Deliberately narrower than diagnosticErrorFailureKind's terminated
    // family: a process kill is not a connection body death, so it never
    // claims the bounded re-request.
    expect(
      isMidStreamDropWithoutFinishReason({
        stopReason: "error",
        errorMessage: "sigkill",
      } as AssistantMessage),
    ).toBe(false);
  });

  it("rejects non-error stop reasons and missing messages", () => {
    expect(
      isMidStreamDropWithoutFinishReason({
        stopReason: "stop",
      } as AssistantMessage),
    ).toBe(false);
    expect(isMidStreamDropWithoutFinishReason(undefined)).toBe(false);
    expect(isMidStreamDropWithoutFinishReason({ stopReason: "error" } as AssistantMessage)).toBe(
      false,
    );
  });

  it("rejects provider-authored error text (refusal semantics must stay terminal)", () => {
    expect(
      isMidStreamDropWithoutFinishReason({
        stopReason: "error",
        errorMessage: "Provider finish_reason: content_filter",
      } as AssistantMessage),
    ).toBe(false);
    expect(
      isMidStreamDropWithoutFinishReason({
        stopReason: "error",
        errorMessage: "rate limit exceeded, retry after 30s",
      } as AssistantMessage),
    ).toBe(false);
  });
});

describe("handleEmbeddedAssistantFailure mid-stream drop retry (BUG-019)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("retries the live-evidence shape: partial streamed text, replay-safe, first drop", async () => {
    const { input } = makeMidStreamDropInput();
    const outcome = await handleEmbeddedAssistantFailure(input);
    expect(outcome.action).toBe("retry");
    expect(outcome.emptyErrorRetries).toBe(1);
  });

  it("retries the premature-termination mirror: undici terminated after transport retry exhausted", async () => {
    // RCA 2026-09-13 (assignment_a7919909): the transport retry gate did not
    // match `terminated`, so the run synthesized an error assistant with that
    // message and went terminal with no run-level retry either. Both gates
    // now recognize the signature; the run-level re-request stays bounded.
    const { input } = makeMidStreamDropInput({ errorMessage: "terminated" });
    const outcome = await handleEmbeddedAssistantFailure(input);
    expect(outcome.action).toBe("retry");
    expect(outcome.emptyErrorRetries).toBe(1);
  });

  it("increments the bounded budget across consecutive drops", async () => {
    const { input } = makeMidStreamDropInput({ emptyErrorRetries: 2 });
    const outcome = await handleEmbeddedAssistantFailure(input);
    expect(outcome.action).toBe("retry");
    expect(outcome.emptyErrorRetries).toBe(3);
  });

  it("consults the transient controller once the local budget is exhausted", async () => {
    const maybeRetryTransient = vi.fn(async () => true);
    const { input } = makeMidStreamDropInput({
      emptyErrorRetries: MAX_MIDSTREAM_DROP_RETRIES,
      maybeRetryTransient,
    });
    const outcome = await handleEmbeddedAssistantFailure(input);
    expect(maybeRetryTransient).toHaveBeenCalledWith(
      expect.objectContaining({ reason: "unknown" }),
    );
    expect(outcome.action).toBe("retry");
  });

  it("does not claim the local retry when the current attempt is not replay-safe", async () => {
    const { input } = makeMidStreamDropInput({ replaySafe: false });
    const outcome = await handleEmbeddedAssistantFailure(input);
    // Falls through to the downstream pipeline (silent-error/failover paths),
    // never the bounded mid-stream local retry.
    expect(outcome.action === "retry" && outcome.emptyErrorRetries === 1).toBe(false);
  });

  it("stays terminal for replay-unsafe provider failures with output", async () => {
    const assistant = buildEmbeddedRunnerAssistant({
      provider: "opencode-go",
      model: "glm-5.3-flash",
      stopReason: "error",
      errorMessage: "Stream ended without finish_reason",
      content: [],
      errorCode: PROVIDER_FAILURE_WITH_OUTPUT_ERROR_CODE,
    });
    const attempt = makeEmbeddedRunnerAttempt({
      assistantTexts: ["partial"],
      lastAssistant: assistant,
      currentAttemptAssistant: assistant,
      currentAttemptReplayMetadata: { hadPotentialSideEffects: false, replaySafe: true },
    });
    const base = makeMidStreamDropInput();
    const input = {
      ...base.input,
      attempt,
      attemptAssistant: assistant,
    } as AssistantFailureInput;
    const outcome = await handleEmbeddedAssistantFailure(input);
    expect(outcome.action === "retry" && outcome.emptyErrorRetries === 1).toBe(false);
  });
});
