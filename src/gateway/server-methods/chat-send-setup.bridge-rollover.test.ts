import { expect, it, vi } from "vitest";
import * as bridgeRollover from "../../agents/embedded-agent-runner/run/bridge-session-rollover.js";
import {
  loadSessionEntry,
  upsertSessionEntryCore,
} from "../../config/sessions/session-accessor.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import { clearAgentRunContext } from "../../infra/agent-run-registry.js";
import {
  withOpenClawTestState,
  type OpenClawTestState,
} from "../../test-utils/openclaw-test-state.js";
import { createDirectChatContext } from "../server-chat.agent-events.test-helpers.js";
import { prepareAndAdmitChatSend } from "./chat-send-setup.js";
import type { RespondFn } from "./types.js";

const logMocks = vi.hoisted(() => {
  const logger = {
    subsystem: "test",
    isEnabled: () => false,
    trace: () => {},
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    fatal: () => {},
    raw: () => {},
    child: () => logger,
  };
  return logger;
});

vi.mock("../../logging/subsystem.js", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../logging/subsystem.js")>();
  return { ...actual, createSubsystemLogger: () => logMocks };
});

const BRIDGE_KEY = "agent:oscar:pi";
const SEED_SESSION_ID = "seed-session-1";

const config = (workspaceDir: string, ceilingTokens: number) =>
  ({
    agents: {
      ownership: "explicit",
      entries: { oscar: { workspace: workspaceDir } },
      defaults: { skipBootstrap: true },
    },
    session: { rotation: { ceilingTokens } },
  }) satisfies OpenClawConfig;

async function seedOversizedBridgeEntry(state: OpenClawTestState) {
  await upsertSessionEntryCore(
    { agentId: "oscar", env: state.env, sessionKey: BRIDGE_KEY },
    { sessionId: SEED_SESSION_ID, updatedAt: 1000, totalTokens: 455_000 },
  );
}

it("rolls an oversized bridge session to a fresh window at chat.send admission", async () => {
  await withOpenClawTestState({ label: "gateway-bridge-ceiling-rollover" }, async (state) => {
    const cfg = config(state.workspaceDir, 150_000);
    await state.writeConfig(cfg);
    await seedOversizedBridgeEntry(state);
    const rolloverSpy = vi.spyOn(bridgeRollover, "performBridgeSessionRollover");
    const respond = vi.fn<RespondFn>();
    let setup: Awaited<ReturnType<typeof prepareAndAdmitChatSend>> | undefined;
    try {
      setup = await prepareAndAdmitChatSend({
        client: null,
        context: createDirectChatContext({ getRuntimeConfig: () => cfg }),
        respond,
        params: {
          agentId: "oscar",
          sessionKey: BRIDGE_KEY,
          message: "ping the bridge",
          idempotencyKey: "bridge-rollover-hit",
        },
      });
      expect(respond).not.toHaveBeenCalled();
      expect(setup).toBeDefined();
      // Rollover ran for the exact bridge session at the admission boundary.
      expect(rolloverSpy).toHaveBeenCalledOnce();
      expect(rolloverSpy.mock.calls[0]?.[0]).toMatchObject({
        agentId: "oscar",
        sessionKey: BRIDGE_KEY,
      });
      // The entry was reset to a fresh window under the same canonical key.
      const fresh = loadSessionEntry({ agentId: "oscar", env: state.env, sessionKey: BRIDGE_KEY });
      expect(fresh?.sessionId).toBeDefined();
      expect(fresh?.sessionId).not.toBe(SEED_SESSION_ID);
      expect(fresh?.totalTokens).toBe(0);
      // Admission (re-prepare + admit) landed on the fresh window exactly once.
      expect(setup?.preparedSession.value.entry.sessionId).toBe(fresh?.sessionId);
      expect(setup?.admitted.value.admittedSessionId).toBe(fresh?.sessionId);
    } finally {
      setup?.admitted.value.cleanupAdmittedRun();
      clearAgentRunContext("bridge-rollover-hit", setup?.admitted.value.lifecycleGeneration ?? 0);
      rolloverSpy.mockRestore();
    }
  });
});

it("returns a typed retryable refusal when the bridge rollover throws: never admits the over-ceiling bridge", async () => {
  await withOpenClawTestState({ label: "gateway-bridge-ceiling-rollover" }, async (state) => {
    const cfg = config(state.workspaceDir, 150_000);
    await state.writeConfig(cfg);
    await seedOversizedBridgeEntry(state);
    const rolloverSpy = vi
      .spyOn(bridgeRollover, "performBridgeSessionRollover")
      .mockRejectedValue(new Error("storage down"));
    logMocks.warn.mockClear();
    const respond = vi.fn<RespondFn>();
    try {
      const setup = await prepareAndAdmitChatSend({
        client: null,
        context: createDirectChatContext({ getRuntimeConfig: () => cfg }),
        respond,
        params: {
          agentId: "oscar",
          sessionKey: BRIDGE_KEY,
          message: "ping the bridge",
          idempotencyKey: "bridge-rollover-throw",
        },
      });
      // Fail-closed: the failure is logged and NO admission happens.
      expect(rolloverSpy).toHaveBeenCalledOnce();
      expect(logMocks.warn).toHaveBeenCalledWith(expect.stringContaining("bridge rollover failed"));
      // The send returns a typed retryable transport refusal, not a run.
      expect(respond).toHaveBeenCalledTimes(1);
      expect(respond.mock.calls[0]?.[0]).toBe(false);
      expect(respond.mock.calls[0]?.[2]).toMatchObject({
        retryable: true,
        details: { reason: "SESSION_CEILING_BRIDGE_ROLLOVER_FAILED" },
      });
      expect(setup).toBeUndefined();
      // No reset happened; the over-ceiling entry is unchanged and un-admitted.
      const entry = loadSessionEntry({ agentId: "oscar", env: state.env, sessionKey: BRIDGE_KEY });
      expect(entry?.sessionId).toBe(SEED_SESSION_ID);
      expect(entry?.totalTokens).toBe(455_000);
    } finally {
      rolloverSpy.mockRestore();
    }
  });
});

it("returns a typed NO_ENTRY refusal when rollover finds nothing to rotate", async () => {
  await withOpenClawTestState({ label: "gateway-bridge-ceiling-rollover" }, async (state) => {
    const cfg = config(state.workspaceDir, 150_000);
    await state.writeConfig(cfg);
    await seedOversizedBridgeEntry(state);
    const rolloverSpy = vi
      .spyOn(bridgeRollover, "performBridgeSessionRollover")
      .mockResolvedValue(false);
    const respond = vi.fn<RespondFn>();
    try {
      const setup = await prepareAndAdmitChatSend({
        client: null,
        context: createDirectChatContext({ getRuntimeConfig: () => cfg }),
        respond,
        params: {
          agentId: "oscar",
          sessionKey: BRIDGE_KEY,
          message: "ping the bridge",
          idempotencyKey: "bridge-rollover-no-entry",
        },
      });
      expect(rolloverSpy).toHaveBeenCalledOnce();
      expect(respond.mock.calls[0]?.[2]).toMatchObject({
        retryable: true,
        details: { reason: "SESSION_CEILING_BRIDGE_ROLLOVER_NO_ENTRY" },
      });
      expect(setup).toBeUndefined();
      const entry = loadSessionEntry({ agentId: "oscar", env: state.env, sessionKey: BRIDGE_KEY });
      expect(entry?.sessionId).toBe(SEED_SESSION_ID);
      expect(entry?.totalTokens).toBe(455_000);
    } finally {
      rolloverSpy.mockRestore();
    }
  });
});

it("triggers rollover exactly at the ceiling boundary (estimatedTokens == ceilingTokens)", async () => {
  await withOpenClawTestState({ label: "gateway-bridge-ceiling-rollover" }, async (state) => {
    const cfg = config(state.workspaceDir, 150_000);
    await state.writeConfig(cfg);
    await upsertSessionEntryCore(
      { agentId: "oscar", env: state.env, sessionKey: BRIDGE_KEY },
      { sessionId: SEED_SESSION_ID, updatedAt: 1000, totalTokens: 150_000 },
    );
    const rolloverSpy = vi.spyOn(bridgeRollover, "performBridgeSessionRollover");
    const respond = vi.fn<RespondFn>();
    let setup: Awaited<ReturnType<typeof prepareAndAdmitChatSend>> | undefined;
    try {
      setup = await prepareAndAdmitChatSend({
        client: null,
        context: createDirectChatContext({ getRuntimeConfig: () => cfg }),
        respond,
        params: {
          agentId: "oscar",
          sessionKey: BRIDGE_KEY,
          message: "ping the bridge",
          idempotencyKey: "bridge-rollover-boundary",
        },
      });
      expect(rolloverSpy).toHaveBeenCalledOnce();
      const fresh = loadSessionEntry({ agentId: "oscar", env: state.env, sessionKey: BRIDGE_KEY });
      expect(fresh?.sessionId).not.toBe(SEED_SESSION_ID);
      expect(fresh?.totalTokens).toBe(0);
      expect(setup?.preparedSession.value.entry.sessionId).toBe(fresh?.sessionId);
      expect(setup?.admitted.value.admittedSessionId).toBe(fresh?.sessionId);
    } finally {
      setup?.admitted.value.cleanupAdmittedRun();
      clearAgentRunContext(
        "bridge-rollover-boundary",
        setup?.admitted.value.lifecycleGeneration ?? 0,
      );
      rolloverSpy.mockRestore();
    }
  });
});

it("does not trigger rollover one token under the ceiling", async () => {
  await withOpenClawTestState({ label: "gateway-bridge-ceiling-rollover" }, async (state) => {
    const cfg = config(state.workspaceDir, 150_000);
    await state.writeConfig(cfg);
    await upsertSessionEntryCore(
      { agentId: "oscar", env: state.env, sessionKey: BRIDGE_KEY },
      { sessionId: SEED_SESSION_ID, updatedAt: 1000, totalTokens: 149_999 },
    );
    const rolloverSpy = vi.spyOn(bridgeRollover, "performBridgeSessionRollover");
    const respond = vi.fn<RespondFn>();
    let setup: Awaited<ReturnType<typeof prepareAndAdmitChatSend>> | undefined;
    try {
      setup = await prepareAndAdmitChatSend({
        client: null,
        context: createDirectChatContext({ getRuntimeConfig: () => cfg }),
        respond,
        params: {
          agentId: "oscar",
          sessionKey: BRIDGE_KEY,
          message: "ping the bridge",
          idempotencyKey: "bridge-rollover-under-one",
        },
      });
      expect(rolloverSpy).not.toHaveBeenCalled();
      expect(respond).not.toHaveBeenCalled();
      expect(setup).toBeDefined();
      const entry = loadSessionEntry({ agentId: "oscar", env: state.env, sessionKey: BRIDGE_KEY });
      expect(entry?.sessionId).toBe(SEED_SESSION_ID);
      expect(entry?.totalTokens).toBe(149_999);
    } finally {
      setup?.admitted.value.cleanupAdmittedRun();
      clearAgentRunContext(
        "bridge-rollover-under-one",
        setup?.admitted.value.lifecycleGeneration ?? 0,
      );
      rolloverSpy.mockRestore();
    }
  });
});

it("rolls over the BUG-034 1.03M-class ceiling scenario and admits exactly once on the fresh window", async () => {
  await withOpenClawTestState({ label: "gateway-bridge-ceiling-rollover" }, async (state) => {
    const cfg = config(state.workspaceDir, 150_000);
    await state.writeConfig(cfg);
    await upsertSessionEntryCore(
      { agentId: "oscar", env: state.env, sessionKey: BRIDGE_KEY },
      { sessionId: SEED_SESSION_ID, updatedAt: 1000, totalTokens: 1_030_000 },
    );
    const rolloverSpy = vi.spyOn(bridgeRollover, "performBridgeSessionRollover");
    const respond = vi.fn<RespondFn>();
    let setup: Awaited<ReturnType<typeof prepareAndAdmitChatSend>> | undefined;
    try {
      setup = await prepareAndAdmitChatSend({
        client: null,
        context: createDirectChatContext({ getRuntimeConfig: () => cfg }),
        respond,
        params: {
          agentId: "oscar",
          sessionKey: BRIDGE_KEY,
          message: "ping the bridge",
          idempotencyKey: "bridge-rollover-1030k",
        },
      });
      expect(respond).not.toHaveBeenCalled();
      expect(rolloverSpy).toHaveBeenCalledOnce();
      const fresh = loadSessionEntry({ agentId: "oscar", env: state.env, sessionKey: BRIDGE_KEY });
      expect(fresh?.sessionId).not.toBe(SEED_SESSION_ID);
      expect(fresh?.totalTokens).toBe(0);
      expect(setup?.preparedSession.value.entry.sessionId).toBe(fresh?.sessionId);
      expect(setup?.admitted.value.admittedSessionId).toBe(fresh?.sessionId);
    } finally {
      setup?.admitted.value.cleanupAdmittedRun();
      clearAgentRunContext("bridge-rollover-1030k", setup?.admitted.value.lifecycleGeneration ?? 0);
      rolloverSpy.mockRestore();
    }
  });
});

it("does not roll over a non-bridge main session crossing the ceiling", async () => {
  await withOpenClawTestState({ label: "gateway-bridge-ceiling-rollover" }, async (state) => {
    const cfg = config(state.workspaceDir, 150_000);
    await state.writeConfig(cfg);
    await upsertSessionEntryCore(
      { agentId: "oscar", env: state.env, sessionKey: "agent:oscar:main" },
      { sessionId: SEED_SESSION_ID, updatedAt: 1000, totalTokens: 455_000 },
    );
    const rolloverSpy = vi.spyOn(bridgeRollover, "performBridgeSessionRollover");
    const respond = vi.fn<RespondFn>();
    let setup: Awaited<ReturnType<typeof prepareAndAdmitChatSend>> | undefined;
    try {
      setup = await prepareAndAdmitChatSend({
        client: null,
        context: createDirectChatContext({ getRuntimeConfig: () => cfg }),
        respond,
        params: {
          agentId: "oscar",
          sessionKey: "agent:oscar:main",
          message: "ping main",
          idempotencyKey: "bridge-rollover-main",
        },
      });
      // Compaction-only ceiling path: no rollover, entry untouched, admitted.
      expect(rolloverSpy).not.toHaveBeenCalled();
      expect(respond).not.toHaveBeenCalled();
      expect(setup).toBeDefined();
      const entry = loadSessionEntry({
        agentId: "oscar",
        env: state.env,
        sessionKey: "agent:oscar:main",
      });
      expect(entry?.sessionId).toBe(SEED_SESSION_ID);
      expect(entry?.totalTokens).toBe(455_000);
    } finally {
      setup?.admitted.value.cleanupAdmittedRun();
      clearAgentRunContext("bridge-rollover-main", setup?.admitted.value.lifecycleGeneration ?? 0);
      rolloverSpy.mockRestore();
    }
  });
});

it("does not roll over a bridge session under the ceiling", async () => {
  await withOpenClawTestState({ label: "gateway-bridge-ceiling-rollover" }, async (state) => {
    const cfg = config(state.workspaceDir, 150_000);
    await state.writeConfig(cfg);
    await upsertSessionEntryCore(
      { agentId: "oscar", env: state.env, sessionKey: BRIDGE_KEY },
      { sessionId: SEED_SESSION_ID, updatedAt: 1000, totalTokens: 1_000 },
    );
    const rolloverSpy = vi.spyOn(bridgeRollover, "performBridgeSessionRollover");
    const respond = vi.fn<RespondFn>();
    let setup: Awaited<ReturnType<typeof prepareAndAdmitChatSend>> | undefined;
    try {
      setup = await prepareAndAdmitChatSend({
        client: null,
        context: createDirectChatContext({ getRuntimeConfig: () => cfg }),
        respond,
        params: {
          agentId: "oscar",
          sessionKey: BRIDGE_KEY,
          message: "ping the bridge",
          idempotencyKey: "bridge-rollover-under",
        },
      });
      expect(rolloverSpy).not.toHaveBeenCalled();
      expect(respond).not.toHaveBeenCalled();
      expect(setup).toBeDefined();
      const entry = loadSessionEntry({ agentId: "oscar", env: state.env, sessionKey: BRIDGE_KEY });
      expect(entry?.sessionId).toBe(SEED_SESSION_ID);
      expect(entry?.totalTokens).toBe(1_000);
    } finally {
      setup?.admitted.value.cleanupAdmittedRun();
      clearAgentRunContext("bridge-rollover-under", setup?.admitted.value.lifecycleGeneration ?? 0);
      rolloverSpy.mockRestore();
    }
  });
});
