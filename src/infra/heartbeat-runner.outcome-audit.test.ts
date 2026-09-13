// Covers heartbeat_outcomes recording for every terminal run shape, including
// tool-less silent completions, runner failures, and unconfirmed deliveries.
import { afterEach, describe, expect, it, vi } from "vitest";
import { createHeartbeatToolResponsePayload } from "../auto-reply/heartbeat-tool-response.js";
import { SILENT_REPLY_TOKEN } from "../auto-reply/tokens.js";
import type { OpenClawConfig } from "../config/config.js";
import { closeOpenClawAgentDatabasesForTest } from "../state/openclaw-agent-db.js";
import { closeOpenClawStateDatabaseForTest } from "../state/openclaw-state-db.js";
import { claimHeartbeatOutcomeForRun } from "./heartbeat-outcome-store.js";
import { runHeartbeatOnce, type HeartbeatDeps } from "./heartbeat-runner.js";
import { installHeartbeatRunnerTestRuntime } from "./heartbeat-runner.test-harness.js";
import {
  seedMainSessionStore,
  setHeartbeatAgentTurnStatus,
  withTempTelegramHeartbeatSandbox,
} from "./heartbeat-runner.test-utils.js";

installHeartbeatRunnerTestRuntime();

describe("runHeartbeatOnce outcome audit rows", () => {
  const TELEGRAM_GROUP = "-1001234567890";

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  function createConfig(params: {
    tmpDir: string;
    storePath: string;
    target?: "telegram" | "none";
    visibleReplies?: "automatic" | "message_tool";
  }): OpenClawConfig {
    return {
      agents: {
        defaults: {
          workspace: params.tmpDir,
          heartbeat: { every: "5m", target: params.target ?? "telegram" },
        },
      },
      ...(params.visibleReplies ? { messages: { visibleReplies: params.visibleReplies } } : {}),
      channels: {
        telegram: {
          token: "test-token",
          allowFrom: ["*"],
          heartbeat: { showOk: false },
        },
      },
      session: { store: params.storePath },
    } as OpenClawConfig;
  }

  function createDeps(params: {
    sendTelegram: ReturnType<typeof vi.fn>;
    getReplyFromConfig: HeartbeatDeps["getReplyFromConfig"];
  }): HeartbeatDeps {
    return {
      telegram: params.sendTelegram as unknown,
      getQueueSize: () => 0,
      nowMs: () => 0,
      getReplyFromConfig: params.getReplyFromConfig,
    };
  }

  function runHeartbeat(
    cfg: OpenClawConfig,
    replySpy: HeartbeatDeps["getReplyFromConfig"],
    sendTelegram: ReturnType<typeof vi.fn>,
    overrides: Omit<Parameters<typeof runHeartbeatOnce>[0], "cfg" | "deps"> = {},
  ) {
    return runHeartbeatOnce({
      cfg,
      ...overrides,
      deps: createDeps({ sendTelegram, getReplyFromConfig: replySpy }),
    });
  }

  async function seedTelegramSession(storePath: string, cfg: OpenClawConfig) {
    return await seedMainSessionStore(storePath, cfg, {
      lastChannel: "telegram",
      lastProvider: "telegram",
      lastTo: TELEGRAM_GROUP,
    });
  }

  it.each([
    { name: "silent reply token", reply: { text: SILENT_REPLY_TOKEN } },
    { name: "empty reply", reply: { text: "" } },
  ])(
    "records a quiet outcome when a tool-less heartbeat completes with a $name",
    async ({ reply }) => {
      await withTempTelegramHeartbeatSandbox(async ({ tmpDir, storePath, replySpy }) => {
        vi.stubEnv("OPENCLAW_STATE_DIR", tmpDir);
        const cfg = createConfig({ tmpDir, storePath, visibleReplies: "automatic" });
        const sessionKey = await seedTelegramSession(storePath, cfg);
        replySpy.mockResolvedValue(reply);
        const sendTelegram = vi.fn().mockResolvedValue({ messageId: "m1" });

        const result = await runHeartbeat(cfg, replySpy, sendTelegram, {
          source: "manual",
          reason: "operator check",
        });

        expect(result.status).toBe("ran");
        expect(sendTelegram).not.toHaveBeenCalled();
        expect(
          claimHeartbeatOutcomeForRun({
            agentId: "main",
            sessionKey,
            storePath,
            runId: "user-run",
          }),
        ).toMatchObject({
          outcome: "done",
          responseReason: "no_change",
          summary: "Heartbeat completed with no user-visible reply.",
          wakeSource: "manual",
          wakeReason: "operator check",
        });
        closeOpenClawAgentDatabasesForTest();
        closeOpenClawStateDatabaseForTest();
      });
    },
  );

  it("records a blocked outcome when a tool-less heartbeat run fails", async () => {
    await withTempTelegramHeartbeatSandbox(async ({ tmpDir, storePath, replySpy }) => {
      vi.stubEnv("OPENCLAW_STATE_DIR", tmpDir);
      const cfg = createConfig({ tmpDir, storePath, visibleReplies: "automatic" });
      const sessionKey = await seedTelegramSession(storePath, cfg);
      replySpy.mockImplementation(async (_ctx, options) => {
        setHeartbeatAgentTurnStatus(options, "failed");
        return { text: SILENT_REPLY_TOKEN };
      });
      const sendTelegram = vi.fn().mockResolvedValue({ messageId: "m1" });

      const result = await runHeartbeat(cfg, replySpy, sendTelegram, {
        source: "manual",
        reason: "operator check",
      });

      expect(result).toEqual({ status: "failed", reason: "agent-runner-failure" });
      expect(sendTelegram).not.toHaveBeenCalled();
      expect(
        claimHeartbeatOutcomeForRun({
          agentId: "main",
          sessionKey,
          storePath,
          runId: "user-run",
        }),
      ).toMatchObject({
        outcome: "blocked",
        responseReason: "agent-runner-failure",
        wakeSource: "manual",
        wakeReason: "operator check",
      });
      closeOpenClawAgentDatabasesForTest();
      closeOpenClawStateDatabaseForTest();
    });
  });

  it("records a blocked outcome when a tool-less reply has no delivery target", async () => {
    await withTempTelegramHeartbeatSandbox(async ({ tmpDir, storePath, replySpy }) => {
      vi.stubEnv("OPENCLAW_STATE_DIR", tmpDir);
      const cfg = createConfig({
        tmpDir,
        storePath,
        target: "none",
        visibleReplies: "automatic",
      });
      const sessionKey = await seedTelegramSession(storePath, cfg);
      replySpy.mockResolvedValue({ text: "Deployment finished and smoke tests pass." });
      const sendTelegram = vi.fn().mockResolvedValue({ messageId: "m1" });

      const result = await runHeartbeat(cfg, replySpy, sendTelegram, { source: "manual" });

      expect(result.status).toBe("ran");
      expect(sendTelegram).not.toHaveBeenCalled();
      const stored = claimHeartbeatOutcomeForRun({
        agentId: "main",
        sessionKey,
        storePath,
        runId: "user-run",
      });
      expect(stored).toMatchObject({ outcome: "blocked", wakeSource: "manual" });
      expect(stored?.responseReason).toContain("delivery=");
      expect(stored?.summary).toContain("Deployment finished");
      closeOpenClawAgentDatabasesForTest();
      closeOpenClawStateDatabaseForTest();
    });
  });

  it("leaves delivered visible alerts to their own record without an outcome row", async () => {
    await withTempTelegramHeartbeatSandbox(async ({ tmpDir, storePath, replySpy }) => {
      vi.stubEnv("OPENCLAW_STATE_DIR", tmpDir);
      const cfg = createConfig({ tmpDir, storePath });
      const sessionKey = await seedTelegramSession(storePath, cfg);
      replySpy.mockResolvedValue(
        createHeartbeatToolResponsePayload({
          outcome: "needs_attention",
          notify: true,
          summary: "Build is blocked.",
          notificationText: "Build is blocked on missing credentials.",
        }),
      );
      const sendTelegram = vi.fn().mockResolvedValue({ messageId: "m1" });

      const result = await runHeartbeat(cfg, replySpy, sendTelegram, { source: "manual" });

      expect(result.status).toBe("ran");
      expect(sendTelegram).toHaveBeenCalledOnce();
      expect(
        claimHeartbeatOutcomeForRun({
          agentId: "main",
          sessionKey,
          storePath,
          runId: "user-run",
        }),
      ).toBeUndefined();
      closeOpenClawAgentDatabasesForTest();
      closeOpenClawStateDatabaseForTest();
    });
  });

  it("persists tool no_change responses as done with the no_change reason", async () => {
    await withTempTelegramHeartbeatSandbox(async ({ tmpDir, storePath, replySpy }) => {
      vi.stubEnv("OPENCLAW_STATE_DIR", tmpDir);
      const cfg = createConfig({ tmpDir, storePath });
      const sessionKey = await seedTelegramSession(storePath, cfg);
      replySpy.mockResolvedValue(
        createHeartbeatToolResponsePayload({
          outcome: "no_change",
          notify: false,
          summary: "Nothing needs attention.",
        }),
      );
      const sendTelegram = vi.fn().mockResolvedValue({ messageId: "m1" });

      const result = await runHeartbeat(cfg, replySpy, sendTelegram, {
        source: "manual",
        reason: "operator check",
      });

      expect(result.status).toBe("ran");
      expect(sendTelegram).not.toHaveBeenCalled();
      expect(
        claimHeartbeatOutcomeForRun({
          agentId: "main",
          sessionKey,
          storePath,
          runId: "user-run",
        }),
      ).toMatchObject({
        outcome: "done",
        responseReason: "no_change",
        summary: "Nothing needs attention.",
        wakeSource: "manual",
        wakeReason: "operator check",
      });
      closeOpenClawAgentDatabasesForTest();
      closeOpenClawStateDatabaseForTest();
    });
  });
});
