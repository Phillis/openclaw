/**
 * Bounded isolated-heartbeat transcript windows: when a beat's stored context
 * exceeds the configured cap, the next beat emits a session_end reset so the
 * context engine rotates to a fresh window instead of replaying an
 * uncompactable conversation every beat (2026-09 heartbeat burn RCA).
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { heartbeatRunnerWhatsAppPlugin } from "../../test/helpers/infra/heartbeat-runner-channel-plugins.js";
import type { ChannelPlugin } from "../channels/plugins/types.public.js";
import type { OpenClawConfig } from "../config/config.js";
import { resolveMainSessionKey } from "../config/sessions.js";
import type { SessionEntry } from "../config/sessions/types.js";
import { buildChannelOutboundSessionRoute } from "../plugin-sdk/core.js";
import {
  initializeGlobalHookRunner,
  resetGlobalHookRunner,
} from "../plugins/hook-runner-global.js";
import type { PluginHookSessionEndEvent } from "../plugins/hook-types.js";
import { addTestHook } from "../plugins/hooks.test-helpers.js";
import { setActivePluginRegistry } from "../plugins/runtime.js";
import { createTestRegistry } from "../test-utils/channel-plugins.js";
import {
  DEFAULT_HEARTBEAT_MAX_TRANSCRIPT_TOKENS,
  resolveHeartbeatMaxTranscriptTokens,
} from "./heartbeat-runner-config.js";
import { runHeartbeatOnce } from "./heartbeat-runner.js";
import { installHeartbeatRunnerTestRuntime } from "./heartbeat-runner.test-harness.js";
import {
  readSessionStoreForTest,
  seedHeartbeatScratchForTest,
  seedSessionStore,
  withTempHeartbeatSandbox,
} from "./heartbeat-runner.test-utils.js";
import { resolveHeartbeatWindowRotation } from "./heartbeat-transcript-window.js";

installHeartbeatRunnerTestRuntime();

const deliverOutboundPayloadsInternal = vi.hoisted(() =>
  vi.fn(async () => [{ channel: "whatsapp", messageId: "msg-1" }]),
);

vi.mock("./outbound/deliver.js", () => ({
  deliverOutboundPayloads: deliverOutboundPayloadsInternal,
  deliverOutboundPayloadsInternal,
}));

afterEach(() => {
  deliverOutboundPayloadsInternal.mockClear();
  resetGlobalHookRunner();
});

function makeIsolatedHeartbeatConfig(
  tmpDir: string,
  storePath: string,
  heartbeat: Partial<OpenClawConfig["agents"]> extends never ? never : Record<string, unknown>,
): OpenClawConfig {
  return {
    agents: {
      list: [{ id: "main", default: true }],
      defaults: {
        workspace: tmpDir,
        heartbeat: {
          every: "5m",
          target: "last",
          isolatedSession: true,
          ...heartbeat,
        },
      },
    },
    channels: { whatsapp: { allowFrom: ["*"] } },
    session: { store: storePath },
  } as OpenClawConfig;
}

function installWhatsAppRoute() {
  const plugin: ChannelPlugin = {
    ...heartbeatRunnerWhatsAppPlugin,
    capabilities: {
      ...heartbeatRunnerWhatsAppPlugin.capabilities,
      chatTypes: ["direct"],
    },
    messaging: {
      ...heartbeatRunnerWhatsAppPlugin.messaging,
      targetResolver: { looksLikeId: () => true },
      resolveOutboundSessionRoute: ({ cfg, agentId, accountId, target }) =>
        buildChannelOutboundSessionRoute({
          cfg,
          agentId,
          channel: "whatsapp",
          accountId,
          recipientSessionExact: true,
          peer: { kind: "direct", id: target },
          chatType: "direct",
          from: target,
          to: target,
        }),
    },
  };
  setActivePluginRegistry(createTestRegistry([{ pluginId: "whatsapp", plugin, source: "test" }]));
}

type SessionEndEvent = PluginHookSessionEndEvent;

function installSessionEndHook(events: SessionEndEvent[]) {
  const registry = createTestRegistry([]);
  addTestHook({
    registry,
    pluginId: "heartbeat-window-rotation-test",
    hookName: "session_end",
    handler: (event: unknown) => {
      events.push(event as SessionEndEvent);
      return {};
    },
  });
  initializeGlobalHookRunner(registry);
}

async function seedOversizedIsolatedWindow(params: {
  storePath: string;
  baseSessionKey: string;
  sessionId: string;
  totalTokens: number;
}) {
  const isolatedSessionKey = `${params.baseSessionKey}:heartbeat`;
  await seedSessionStore(params.storePath, isolatedSessionKey, {
    sessionId: params.sessionId,
    totalTokens: params.totalTokens,
    totalTokensFresh: true,
  });
  return isolatedSessionKey;
}

describe("isolated heartbeat transcript window rotation", () => {
  it("emits a reset lifecycle and rotates the window when the cap is exceeded", async () => {
    await withTempHeartbeatSandbox(async ({ tmpDir, storePath, replySpy }) => {
      installWhatsAppRoute();
      const cfg = makeIsolatedHeartbeatConfig(tmpDir, storePath, {
        maxTranscriptTokens: 1000,
        target: "last",
      });
      const baseSessionKey = resolveMainSessionKey(cfg);
      const nowMs = Date.now();
      await seedHeartbeatScratchForTest({ content: "- Check status\n" });
      await seedSessionStore(storePath, baseSessionKey, {
        sessionId: "base-session",
        updatedAt: nowMs - 1_000,
        lastChannel: "whatsapp",
        lastProvider: "whatsapp",
        lastTo: "+15551234567",
      });
      const isolatedSessionKey = await seedOversizedIsolatedWindow({
        storePath,
        baseSessionKey,
        sessionId: "old-heartbeat-session",
        totalTokens: 50_000,
      });
      const events: SessionEndEvent[] = [];
      installSessionEndHook(events);
      replySpy.mockResolvedValueOnce({ text: "Status needs attention." });

      const result = await runHeartbeatOnce({
        cfg,
        deps: {
          getReplyFromConfig: replySpy,
          getQueueSize: () => 0,
          nowMs: () => nowMs,
        },
      });

      expect(result.status).toBe("ran");
      await vi.waitFor(() => {
        expect(events).toHaveLength(1);
      });
      const event = events[0]!;
      expect(event).toMatchObject({
        sessionId: "old-heartbeat-session",
        sessionKey: isolatedSessionKey,
        reason: "reset",
      });
      expect(event.nextSessionId).toBeTruthy();
      expect(event.nextSessionId).not.toBe("old-heartbeat-session");

      const store = readSessionStoreForTest<{ sessionId?: string }>(storePath);
      expect(store[isolatedSessionKey]?.sessionId).toBe(event.nextSessionId);
    });
  });

  it("keeps the window and emits no reset when the stored context is under the cap", async () => {
    await withTempHeartbeatSandbox(async ({ tmpDir, storePath, replySpy }) => {
      installWhatsAppRoute();
      const cfg = makeIsolatedHeartbeatConfig(tmpDir, storePath, {
        maxTranscriptTokens: 120_000,
        target: "last",
      });
      const baseSessionKey = resolveMainSessionKey(cfg);
      const nowMs = Date.now();
      await seedHeartbeatScratchForTest({ content: "- Check status\n" });
      await seedSessionStore(storePath, baseSessionKey, {
        sessionId: "base-session",
        updatedAt: nowMs - 1_000,
        lastChannel: "whatsapp",
        lastProvider: "whatsapp",
        lastTo: "+15551234567",
      });
      await seedOversizedIsolatedWindow({
        storePath,
        baseSessionKey,
        sessionId: "small-heartbeat-session",
        totalTokens: 5_000,
      });
      const events: SessionEndEvent[] = [];
      installSessionEndHook(events);
      replySpy.mockResolvedValueOnce({ text: "ok" });

      const result = await runHeartbeatOnce({
        cfg,
        deps: {
          getReplyFromConfig: replySpy,
          getQueueSize: () => 0,
          nowMs: () => nowMs,
        },
      });

      expect(result.status).toBe("ran");
      await new Promise((resolve) => {
        setTimeout(resolve, 20);
      });
      expect(events).toHaveLength(0);
      const store = readSessionStoreForTest<{ sessionId?: string }>(storePath);
      // The per-beat fresh session still rotates its id; only the context-engine
      // window lifecycle must stay untouched under the cap.
      expect(store[`${baseSessionKey}:heartbeat`]?.sessionId).toBeDefined();
      expect(store[`${baseSessionKey}:heartbeat`]?.sessionId).not.toBe("small-heartbeat-session");
    });
  });
});

describe("heartbeat transcript window rotation decision", () => {
  const previousEntry = (overrides: Partial<SessionEntry>): SessionEntry =>
    ({
      sessionId: "old-session",
      updatedAt: 1,
      ...overrides,
    }) as SessionEntry;

  it("defaults the cap to 120000 tokens", () => {
    expect(DEFAULT_HEARTBEAT_MAX_TRANSCRIPT_TOKENS).toBe(120_000);
    expect(resolveHeartbeatMaxTranscriptTokens(undefined)).toBe(120_000);
    expect(resolveHeartbeatMaxTranscriptTokens({} as never)).toBe(120_000);
  });

  it("honors an explicit cap and disables rotation at 0", () => {
    expect(resolveHeartbeatMaxTranscriptTokens({ maxTranscriptTokens: 500 } as never)).toBe(500);
    expect(resolveHeartbeatMaxTranscriptTokens({ maxTranscriptTokens: 0 } as never)).toBe(0);
  });

  it("rotates only when a measured previous window reaches the cap", () => {
    const heartbeat = { maxTranscriptTokens: 1000 } as never;
    expect(
      resolveHeartbeatWindowRotation({
        previousEntry: previousEntry({ totalTokens: 1000, totalTokensFresh: true }),
        heartbeat,
        nextSessionId: "new-session",
      }),
    ).toMatchObject({
      previousSessionId: "old-session",
      nextSessionId: "new-session",
      previousTokens: 1000,
      capTokens: 1000,
    });
    expect(
      resolveHeartbeatWindowRotation({
        previousEntry: previousEntry({ totalTokens: 999, totalTokensFresh: true }),
        heartbeat,
        nextSessionId: "new-session",
      }),
    ).toBeUndefined();
    // Unmeasurable windows never rotate rather than guessing.
    expect(
      resolveHeartbeatWindowRotation({
        previousEntry: previousEntry({}),
        heartbeat,
        nextSessionId: "new-session",
      }),
    ).toBeUndefined();
    // Stale token snapshots fall back to the persisted context estimate.
    expect(
      resolveHeartbeatWindowRotation({
        previousEntry: previousEntry({
          totalTokens: 40,
          totalTokensFresh: false,
          contextTokens: 2000,
        }),
        heartbeat,
        nextSessionId: "new-session",
      }),
    ).toMatchObject({ previousTokens: 2000 });
  });

  it("never rotates without both session identities or when the cap is disabled", () => {
    const heartbeat = { maxTranscriptTokens: 1000 } as never;
    expect(
      resolveHeartbeatWindowRotation({
        previousEntry: previousEntry({ totalTokens: 5000, totalTokensFresh: true }),
        heartbeat,
        nextSessionId: undefined,
      }),
    ).toBeUndefined();
    expect(
      resolveHeartbeatWindowRotation({
        previousEntry: undefined,
        heartbeat,
        nextSessionId: "new-session",
      }),
    ).toBeUndefined();
    expect(
      resolveHeartbeatWindowRotation({
        previousEntry: previousEntry({ totalTokens: 5000, totalTokensFresh: true }),
        heartbeat: { maxTranscriptTokens: 0 } as never,
        nextSessionId: "new-session",
      }),
    ).toBeUndefined();
  });
});
