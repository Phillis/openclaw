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

it("fails open when the bridge rollover throws: admits on the oversized entry", async () => {
  await withOpenClawTestState({ label: "gateway-bridge-ceiling-rollover" }, async (state) => {
    const cfg = config(state.workspaceDir, 150_000);
    await state.writeConfig(cfg);
    await seedOversizedBridgeEntry(state);
    const rolloverSpy = vi
      .spyOn(bridgeRollover, "performBridgeSessionRollover")
      .mockRejectedValue(new Error("storage down"));
    logMocks.warn.mockClear();
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
          idempotencyKey: "bridge-rollover-throw",
        },
      });
      // Fail-open: the failure is logged and the delivery is admitted anyway.
      expect(rolloverSpy).toHaveBeenCalledOnce();
      expect(logMocks.warn).toHaveBeenCalledWith(expect.stringContaining("admitting anyway"));
      expect(respond).not.toHaveBeenCalled();
      expect(setup).toBeDefined();
      // No reset happened; admission proceeded against the unchanged entry.
      const entry = loadSessionEntry({ agentId: "oscar", env: state.env, sessionKey: BRIDGE_KEY });
      expect(entry?.sessionId).toBe(SEED_SESSION_ID);
      expect(entry?.totalTokens).toBe(455_000);
      expect(setup?.preparedSession.value.entry.sessionId).toBe(SEED_SESSION_ID);
      expect(setup?.admitted.value.admittedSessionId).toBe(SEED_SESSION_ID);
    } finally {
      setup?.admitted.value.cleanupAdmittedRun();
      clearAgentRunContext("bridge-rollover-throw", setup?.admitted.value.lifecycleGeneration ?? 0);
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
