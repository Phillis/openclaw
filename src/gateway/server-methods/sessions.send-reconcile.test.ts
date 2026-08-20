// Focused coverage for sessions.sendReconcile ownership and durability lookup.

import { expectDefined } from "@openclaw/normalization-core";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useAutoCleanupTempDirTracker } from "../../../test/helpers/temp-dir.js";
import { SessionTranscriptProjectionUnavailableError } from "../../config/sessions/session-accessor.js";
import {
  appendTranscriptMessage,
  upsertSessionEntryCore as upsertSessionEntry,
} from "../../config/sessions/session-accessor.js";
import { closeOpenClawAgentDatabasesForTest } from "../../state/openclaw-agent-db.js";
import { closeOpenClawStateDatabaseForTest } from "../../state/openclaw-state-db.js";
import { sessionReadHandlers } from "./sessions-read.js";
import type { GatewayRequestContext, RespondFn } from "./types.js";

const tempDirs = useAutoCleanupTempDirTracker(afterEach);

const sessionReadHandler = expectDefined(
  sessionReadHandlers["sessions.sendReconcile"],
  'sessionReadHandlers["sessions.sendReconcile"] test invariant',
);

type ChatAbortEntry = NonNullable<ReturnType<typeof makeActiveEntry>>;
function makeActiveEntry(params: {
  runId: string;
  sessionKey: string;
  agentId?: string;
  controlUiVisible?: boolean;
  projectSessionActive?: boolean;
}): ChatAbortEntry {
  return {
    controller: new AbortController(),
    sessionId: "session-active",
    sessionKey: params.sessionKey,
    ...(params.agentId ? { agentId: params.agentId } : {}),
    startedAtMs: Date.now(),
    expiresAtMs: Date.now() + 60_000,
    kind: "chat-send",
    ...(params.controlUiVisible !== undefined ? { controlUiVisible: params.controlUiVisible } : {}),
    ...(params.projectSessionActive !== undefined
      ? { projectSessionActive: params.projectSessionActive }
      : {}),
  };
}

function context(params: {
  abortEntries?: ReadonlyArray<readonly [string, ChatAbortEntry]>;
}): GatewayRequestContext {
  return {
    chatAbortControllers: new Map(params.abortEntries ?? []),
    getRuntimeConfig: () => ({
      agents: { list: [{ id: "main", default: true }, { id: "work" }] },
    }),
    broadcastToConnIds: vi.fn(),
    getSessionEventSubscriberConnIds: () => new Set(),
  } as unknown as GatewayRequestContext;
}

async function invoke(params: Record<string, unknown>, ctx: GatewayRequestContext) {
  const respond = vi.fn() as unknown as RespondFn;
  await sessionReadHandler({
    req: { id: "req-send-reconcile" } as never,
    params,
    respond,
    context: ctx,
    client: null,
    isWebchatConnect: () => false,
  });
  return respond;
}

beforeEach(() => {
  vi.stubEnv("OPENCLAW_STATE_DIR", tempDirs.make("openclaw-send-reconcile-"));
});

afterEach(() => {
  closeOpenClawAgentDatabasesForTest();
  closeOpenClawStateDatabaseForTest();
  vi.unstubAllEnvs();
});

describe("sessions.sendReconcile", () => {
  it("rejects missing runId and bad params", async () => {
    const respond = await invoke({ key: "agent:main:reconcile" }, context({}));
    expect(respond).toHaveBeenCalledWith(
      false,
      undefined,
      expect.objectContaining({ code: "INVALID_REQUEST" }),
    );

    const noKey = await invoke({ runId: "run-1" }, context({}));
    expect(noKey).toHaveBeenCalledWith(
      false,
      undefined,
      expect.objectContaining({ code: "INVALID_REQUEST" }),
    );
  });

  it("reports active when the live registry owns the exact runId for that session", async () => {
    const respond = await invoke(
      { key: "agent:work:reconcile-live", runId: "run-active" },
      context({
        abortEntries: [
          [
            "run-active",
            makeActiveEntry({
              runId: "run-active",
              sessionKey: "agent:work:reconcile-live",
              agentId: "work",
            }),
          ],
        ],
      }),
    );

    expect(respond).toHaveBeenCalledWith(
      true,
      {
        key: "agent:work:reconcile-live",
        agentId: "work",
        runId: "run-active",
        status: "active",
      },
      undefined,
    );
  });

  it("reports active over the durable lookup when both owners agree", async () => {
    const sessionKey = "agent:work:reconcile-both";
    await upsertSessionEntry(
      { agentId: "work", sessionKey },
      { sessionId: "session-both", updatedAt: 1 },
    );
    await appendTranscriptMessage(
      { agentId: "work", sessionKey, sessionId: "session-both" },
      {
        message: {
          role: "user",
          content: "durable",
          idempotencyKey: "run-both:user",
          timestamp: 1,
        },
      },
    );

    const respond = await invoke(
      { key: sessionKey, runId: "run-both" },
      context({
        abortEntries: [
          [
            "run-both",
            makeActiveEntry({
              runId: "run-both",
              sessionKey,
              agentId: "work",
            }),
          ],
        ],
      }),
    );

    expect(respond).toHaveBeenCalledWith(
      true,
      {
        key: sessionKey,
        agentId: "work",
        runId: "run-both",
        status: "active",
      },
      undefined,
    );
  });

  it("reports applied when the durable transcript owns the user turn with idempotencyKey `${runId}:user`", async () => {
    const sessionKey = "agent:work:reconcile-durable";
    await upsertSessionEntry(
      { agentId: "work", sessionKey },
      { sessionId: "session-durable", updatedAt: 1 },
    );
    // Older assistant turn and a noise assistant turn must not satisfy the
    // exact-key lookup; only the matching user turn at the durable layer does.
    await appendTranscriptMessage(
      { agentId: "work", sessionKey, sessionId: "session-durable" },
      {
        message: {
          role: "assistant",
          content: "older assistant",
          idempotencyKey: "noise-assistant",
          timestamp: 1,
        },
      },
    );
    await appendTranscriptMessage(
      { agentId: "work", sessionKey, sessionId: "session-durable" },
      {
        message: {
          role: "user",
          content: "client send",
          idempotencyKey: "run-durable:user",
          timestamp: 2,
        },
      },
    );
    await appendTranscriptMessage(
      { agentId: "work", sessionKey, sessionId: "session-durable" },
      {
        message: {
          role: "assistant",
          content: "noise assistant",
          idempotencyKey: "noise-assistant-2",
          timestamp: 3,
        },
      },
    );

    // Restart simulation: process is gone, chatAbortControllers is empty,
    // but the durable user turn survives. Reconciliation must still see applied.
    const respond = await invoke({ key: sessionKey, runId: "run-durable" }, context({}));

    expect(respond).toHaveBeenCalledWith(
      true,
      {
        key: sessionKey,
        agentId: "work",
        runId: "run-durable",
        status: "applied",
      },
      undefined,
    );
  });

  it("reports not_found when the durable user turn is owned by a different session", async () => {
    const targetSessionKey = "agent:work:reconcile-mismatch-target";
    const otherSessionKey = "agent:work:reconcile-mismatch-other";
    await upsertSessionEntry(
      { agentId: "work", sessionKey: targetSessionKey },
      { sessionId: "session-target", updatedAt: 1 },
    );
    await upsertSessionEntry(
      { agentId: "work", sessionKey: otherSessionKey },
      { sessionId: "session-other", updatedAt: 1 },
    );
    // The exact-key user turn lives on a different session; this must not
    // satisfy a reconciliation for the target session.
    await appendTranscriptMessage(
      { agentId: "work", sessionKey: otherSessionKey, sessionId: "session-other" },
      {
        message: {
          role: "user",
          content: "owned elsewhere",
          idempotencyKey: "run-mismatch:user",
          timestamp: 1,
        },
      },
    );

    const respond = await invoke({ key: targetSessionKey, runId: "run-mismatch" }, context({}));

    expect(respond).toHaveBeenCalledWith(
      true,
      {
        key: targetSessionKey,
        agentId: "work",
        runId: "run-mismatch",
        status: "not_found",
      },
      undefined,
    );
  });

  it("reports not_found without mutating session state when neither live nor durable evidence exists", async () => {
    const sessionKey = "agent:work:reconcile-not-found";
    await upsertSessionEntry(
      { agentId: "work", sessionKey },
      { sessionId: "session-not-found", updatedAt: 1 },
    );
    // Noise turn with a different idempotency key must not satisfy the lookup.
    await appendTranscriptMessage(
      { agentId: "work", sessionKey, sessionId: "session-not-found" },
      {
        message: {
          role: "user",
          content: "noise",
          idempotencyKey: "noise:user",
          timestamp: 1,
        },
      },
    );

    const before = (
      await import("../../config/sessions/session-accessor.js")
    ).loadTranscriptEventsSync({
      agentId: "work",
      sessionKey,
      sessionId: "session-not-found",
    }).length;

    const respond = await invoke({ key: sessionKey, runId: "run-missing" }, context({}));

    expect(respond).toHaveBeenCalledWith(
      true,
      {
        key: sessionKey,
        agentId: "work",
        runId: "run-missing",
        status: "not_found",
      },
      undefined,
    );

    const after = (
      await import("../../config/sessions/session-accessor.js")
    ).loadTranscriptEventsSync({
      agentId: "work",
      sessionKey,
      sessionId: "session-not-found",
    }).length;
    expect(after).toBe(before);
  });

  it("does not report active when the live entry's sessionKey does not match the requested canonical key", async () => {
    const sessionKey = "agent:work:reconcile-canonical";
    await upsertSessionEntry(
      { agentId: "work", sessionKey },
      { sessionId: "session-canonical", updatedAt: 1 },
    );

    const respond = await invoke(
      { key: sessionKey, runId: "run-canonical" },
      context({
        abortEntries: [
          [
            "run-canonical",
            makeActiveEntry({
              runId: "run-canonical",
              // Different session key on the entry; ownership must not transfer.
              sessionKey: "agent:other:elsewhere",
              agentId: "work",
            }),
          ],
        ],
      }),
    );

    expect(respond).toHaveBeenCalledWith(
      true,
      {
        key: sessionKey,
        agentId: "work",
        runId: "run-canonical",
        status: "not_found",
      },
      undefined,
    );
  });

  it("hides backend/internal active entries (projectSessionActive=false, controlUiVisible=false) from the live match", async () => {
    const sessionKey = "agent:work:reconcile-hidden";
    await upsertSessionEntry(
      { agentId: "work", sessionKey },
      { sessionId: "session-hidden", updatedAt: 1 },
    );

    const respond = await invoke(
      { key: sessionKey, runId: "run-hidden" },
      context({
        abortEntries: [
          [
            "run-hidden",
            makeActiveEntry({
              runId: "run-hidden",
              sessionKey,
              agentId: "work",
              controlUiVisible: false,
              projectSessionActive: false,
            }),
          ],
        ],
      }),
    );

    expect(respond).toHaveBeenCalledWith(
      true,
      {
        key: sessionKey,
        agentId: "work",
        runId: "run-hidden",
        status: "not_found",
      },
      undefined,
    );
  });

  it("surfaces UNAVAILABLE when the transcript projection is rebuilding", async () => {
    const sessionKey = "agent:work:reconcile-projection";
    await upsertSessionEntry(
      { agentId: "work", sessionKey },
      { sessionId: "session-projection", updatedAt: 1 },
    );

    // Force the read to throw the documented projection-unavailable error
    // without depending on scheduler timing.
    const accessor = await import("../../config/sessions/session-accessor.js");
    const spy = vi.spyOn(accessor, "loadTranscriptEvents").mockImplementationOnce(() => {
      throw new SessionTranscriptProjectionUnavailableError("session-projection");
    });

    try {
      const respond = await invoke({ key: sessionKey, runId: "run-projection" }, context({}));

      expect(respond).toHaveBeenCalledWith(
        false,
        undefined,
        expect.objectContaining({ code: "UNAVAILABLE", retryable: true }),
      );
    } finally {
      spy.mockRestore();
    }
  });
});
