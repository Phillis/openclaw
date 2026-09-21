// W2 turn-receipt enforcement regressions: when
// agents.defaults.heartbeatTurnReceiptRequired is enabled, a completed beat
// must leave disk evidence of its work — a persisted heartbeat outcome row,
// at least one transcript event for the run session, or an explicit heartbeat
// tool response. A quiet beat with NO evidence is the 3x-confirmed dropped
// step: the run result becomes failed/turn-receipt-missing (failureKind
// local_kill, circuit-neutral) so the cron retry re-runs the beat and the
// receipt error_text carries the reason (P0-1 composition). Enforcement off
// keeps today's behavior byte-identical (no quiet rows, no gate).
import { afterEach, describe, expect, it, vi } from "vitest";
import { createHeartbeatToolResponsePayload } from "../auto-reply/heartbeat-tool-response.js";
import { SILENT_REPLY_TOKEN } from "../auto-reply/tokens.js";
import type { OpenClawConfig } from "../config/config.js";
import { closeOpenClawAgentDatabasesForTest } from "../state/openclaw-agent-db.js";
import { closeOpenClawStateDatabaseForTest } from "../state/openclaw-state-db.js";
import { getLastHeartbeatEvent, resetHeartbeatEventsForTest } from "./heartbeat-events.js";
import { claimHeartbeatOutcomeForRun } from "./heartbeat-outcome-store.js";
import { HEARTBEAT_TURN_RECEIPT_MISSING_REASON } from "./heartbeat-runner-run.js";
import { runHeartbeatOnce, type HeartbeatDeps } from "./heartbeat-runner.js";
import { installHeartbeatRunnerTestRuntime } from "./heartbeat-runner.test-harness.js";
import {
  seedMainSessionStore,
  withTempTelegramHeartbeatSandbox,
} from "./heartbeat-runner.test-utils.js";

installHeartbeatRunnerTestRuntime();

describe("runHeartbeatOnce turn-receipt enforcement (W2)", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    resetHeartbeatEventsForTest();
    closeOpenClawAgentDatabasesForTest();
    closeOpenClawStateDatabaseForTest();
  });

  function createConfig(params: {
    tmpDir: string;
    storePath: string;
    receiptRequired?: boolean;
  }): OpenClawConfig {
    return {
      agents: {
        defaults: {
          workspace: params.tmpDir,
          heartbeat: { every: "5m", target: "telegram" },
          ...(params.receiptRequired ? { heartbeatTurnReceiptRequired: true } : {}),
        },
      },
      messages: { visibleReplies: "automatic" },
      channels: {
        telegram: { token: "test-token", allowFrom: ["*"], heartbeat: { showOk: false } },
      },
      session: { store: params.storePath },
    } as OpenClawConfig;
  }

  function createDeps(params: {
    getReplyFromConfig: HeartbeatDeps["getReplyFromConfig"];
    countRunTranscriptEvents?: HeartbeatDeps["countRunTranscriptEvents"];
    hasHeartbeatRunOutcome?: HeartbeatDeps["hasHeartbeatRunOutcome"];
  }): HeartbeatDeps {
    return {
      getQueueSize: () => 0,
      nowMs: () => 0,
      getReplyFromConfig: params.getReplyFromConfig,
      ...(params.countRunTranscriptEvents
        ? { countRunTranscriptEvents: params.countRunTranscriptEvents }
        : {}),
      ...(params.hasHeartbeatRunOutcome
        ? { hasHeartbeatRunOutcome: params.hasHeartbeatRunOutcome }
        : {}),
    };
  }

  async function seedTelegramSession(storePath: string, cfg: OpenClawConfig) {
    return await seedMainSessionStore(storePath, cfg, {
      lastChannel: "telegram",
      lastProvider: "telegram",
      lastTo: "-1001234567890",
    });
  }

  it.each([
    { name: "silent reply token", reply: { text: SILENT_REPLY_TOKEN } },
    { name: "empty reply", reply: { text: "" } },
  ])("records the enforced quiet outcome row and stays ran for a $name", async ({ reply }) => {
    await withTempTelegramHeartbeatSandbox(async ({ tmpDir, storePath, replySpy }) => {
      vi.stubEnv("OPENCLAW_STATE_DIR", tmpDir);
      const cfg = createConfig({ tmpDir, storePath, receiptRequired: true });
      const sessionKey = await seedTelegramSession(storePath, cfg);
      replySpy.mockResolvedValue(reply);

      const result = await runHeartbeatOnce({
        cfg,
        deps: createDeps({ getReplyFromConfig: replySpy }),
        source: "manual",
        intent: "immediate",
        reason: "operator check",
      });

      expect(result.status).toBe("ran");
      expect("failureKind" in result ? result.failureKind : undefined).toBeUndefined();
      // The quiet ack is routed through the outcome store: the beat's receipt
      // is provable on disk even though the turn produced no explicit output.
      expect(
        await claimHeartbeatOutcomeForRun({
          agentId: "main",
          sessionKey,
          storePath,
          runId: "user-run",
        }),
      ).toMatchObject({
        outcome: "done",
        summary: "quiet beat (receipt enforced)",
        wakeSource: "manual",
        wakeReason: "operator check",
      });
    });
  });

  it("fails a receipt-enforced beat that left no disk evidence of work", async () => {
    await withTempTelegramHeartbeatSandbox(async ({ tmpDir, storePath, replySpy }) => {
      vi.stubEnv("OPENCLAW_STATE_DIR", tmpDir);
      const cfg = createConfig({ tmpDir, storePath, receiptRequired: true });
      await seedTelegramSession(storePath, cfg);
      replySpy.mockResolvedValue({ text: SILENT_REPLY_TOKEN });

      const result = await runHeartbeatOnce({
        cfg,
        deps: createDeps({
          getReplyFromConfig: replySpy,
          countRunTranscriptEvents: () => 0,
          hasHeartbeatRunOutcome: () => false,
        }),
        source: "manual",
        intent: "immediate",
        reason: "operator check",
      });

      // Definitive local observation: circuit-neutral (failureKind local_kill,
      // never a provider failover reason) so the cron retry re-runs the beat.
      expect(result).toEqual({
        status: "failed",
        reason: HEARTBEAT_TURN_RECEIPT_MISSING_REASON,
        failureKind: "local_kill",
      });
      expect(getLastHeartbeatEvent()).toMatchObject({
        status: "failed",
        reason: HEARTBEAT_TURN_RECEIPT_MISSING_REASON,
      });
    });
  });

  it("counts an explicit heartbeat tool response as receipt evidence", async () => {
    await withTempTelegramHeartbeatSandbox(async ({ tmpDir, storePath, replySpy }) => {
      vi.stubEnv("OPENCLAW_STATE_DIR", tmpDir);
      const cfg = createConfig({ tmpDir, storePath, receiptRequired: true });
      await seedTelegramSession(storePath, cfg);
      replySpy.mockResolvedValue(
        createHeartbeatToolResponsePayload({
          outcome: "no_change",
          notify: false,
          summary: "Nothing needs attention.",
        }),
      );

      const result = await runHeartbeatOnce({
        cfg,
        deps: createDeps({
          getReplyFromConfig: replySpy,
          countRunTranscriptEvents: () => 0,
          hasHeartbeatRunOutcome: () => false,
        }),
        source: "manual",
        intent: "immediate",
        reason: "operator check",
      });

      expect(result.status).toBe("ran");
      expect("failureKind" in result ? result.failureKind : undefined).toBeUndefined();
    });
  });

  it("counts transcript events for the run session as receipt evidence", async () => {
    await withTempTelegramHeartbeatSandbox(async ({ tmpDir, storePath, replySpy }) => {
      vi.stubEnv("OPENCLAW_STATE_DIR", tmpDir);
      const cfg = createConfig({ tmpDir, storePath, receiptRequired: true });
      await seedTelegramSession(storePath, cfg);
      replySpy.mockResolvedValue({ text: SILENT_REPLY_TOKEN });

      const result = await runHeartbeatOnce({
        cfg,
        deps: createDeps({
          getReplyFromConfig: replySpy,
          countRunTranscriptEvents: () => 1,
          hasHeartbeatRunOutcome: () => false,
        }),
        source: "manual",
        intent: "immediate",
        reason: "operator check",
      });

      expect(result.status).toBe("ran");
      expect("failureKind" in result ? result.failureKind : undefined).toBeUndefined();
    });
  });

  it("keeps enforcement off byte-identical: quiet beat runs with no outcome row", async () => {
    await withTempTelegramHeartbeatSandbox(async ({ tmpDir, storePath, replySpy }) => {
      vi.stubEnv("OPENCLAW_STATE_DIR", tmpDir);
      const cfg = createConfig({ tmpDir, storePath });
      const sessionKey = await seedTelegramSession(storePath, cfg);
      replySpy.mockResolvedValue({ text: SILENT_REPLY_TOKEN });

      const result = await runHeartbeatOnce({
        cfg,
        deps: createDeps({ getReplyFromConfig: replySpy }),
        source: "manual",
        intent: "immediate",
        reason: "operator check",
      });

      expect(result.status).toBe("ran");
      expect("failureKind" in result ? result.failureKind : undefined).toBeUndefined();
      expect(
        await claimHeartbeatOutcomeForRun({
          agentId: "main",
          sessionKey,
          storePath,
          runId: "user-run",
        }),
      ).toBeUndefined();
    });
  });

  it("keeps enforcement off a no-op gate even when no evidence exists", async () => {
    await withTempTelegramHeartbeatSandbox(async ({ tmpDir, storePath, replySpy }) => {
      vi.stubEnv("OPENCLAW_STATE_DIR", tmpDir);
      const cfg = createConfig({ tmpDir, storePath });
      await seedTelegramSession(storePath, cfg);
      replySpy.mockResolvedValue({ text: SILENT_REPLY_TOKEN });

      const result = await runHeartbeatOnce({
        cfg,
        deps: createDeps({
          getReplyFromConfig: replySpy,
          countRunTranscriptEvents: () => 0,
          hasHeartbeatRunOutcome: () => false,
        }),
        source: "manual",
        intent: "immediate",
        reason: "operator check",
      });

      expect(result).toEqual({ status: "ran", durationMs: expect.any(Number) });
    });
  });
});
