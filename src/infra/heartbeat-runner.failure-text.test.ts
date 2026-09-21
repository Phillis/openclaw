// P0-1 runner-side regression: a runner-level failed turn's REAL failure text
// (replyPayload.text at classification time) must be carried on the run result
// so the cron receipt composes "heartbeat failed: agent-runner-failure: <text>".
// The BUG-089 H silent-timeout acks stay untouched — suppressed failures never
// reach the failure branch and never carry failureText.
import { afterEach, describe, expect, it, vi } from "vitest";
import { setReplyPayloadMetadata } from "../auto-reply/reply-payload.js";
import { resolveReplyOperationRunState } from "../auto-reply/reply/reply-operation-run-state.js";
import { createReplyOperation } from "../auto-reply/reply/reply-run-registry.js";
import type { OpenClawConfig } from "../config/config.js";
import { closeOpenClawAgentDatabasesForTest } from "../state/openclaw-agent-db.js";
import { closeOpenClawStateDatabaseForTest } from "../state/openclaw-state-db.js";
import { getLastHeartbeatEvent, resetHeartbeatEventsForTest } from "./heartbeat-events.js";
import { runHeartbeatOnce, type HeartbeatDeps } from "./heartbeat-runner.js";
import { installHeartbeatRunnerTestRuntime } from "./heartbeat-runner.test-harness.js";
import {
  readSessionStoreForTest,
  seedMainSessionStore,
  withTempTelegramHeartbeatSandbox,
} from "./heartbeat-runner.test-utils.js";

installHeartbeatRunnerTestRuntime();

const DISTINCTIVE_FAILURE_TEXT =
  "runner refused the turn: provider dispatch queue lost the model call after 60s";

describe("runHeartbeatOnce failure text capture (P0-1)", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    resetHeartbeatEventsForTest();
    closeOpenClawAgentDatabasesForTest();
    closeOpenClawStateDatabaseForTest();
  });

  function createConfig(params: { tmpDir: string; storePath: string }): OpenClawConfig {
    return {
      agents: {
        defaults: {
          workspace: params.tmpDir,
          heartbeat: { every: "5m", target: "none" },
        },
      },
      channels: {
        telegram: { token: "test-token", allowFrom: ["*"], heartbeat: { showOk: false } },
      },
      session: { store: params.storePath },
    } as OpenClawConfig;
  }

  function createDeps(params: {
    getReplyFromConfig: HeartbeatDeps["getReplyFromConfig"];
  }): HeartbeatDeps {
    return {
      getQueueSize: () => 0,
      nowMs: () => 0,
      getReplyFromConfig: params.getReplyFromConfig,
    };
  }

  function runHeartbeat(cfg: OpenClawConfig, replySpy: HeartbeatDeps["getReplyFromConfig"]) {
    return runHeartbeatOnce({ cfg, deps: createDeps({ getReplyFromConfig: replySpy }) });
  }

  function makeFailedOwnerOperation() {
    const operation = createReplyOperation({
      sessionKey: "heartbeat-p0-1-failure-text",
      sessionId: "heartbeat-p0-1-failure-text",
      turnKind: "heartbeat",
      resetTriggered: false,
    });
    operation.fail("run_failed", new Error(DISTINCTIVE_FAILURE_TEXT));
    operation.complete();
    return operation;
  }

  it("carries the real bounded failure text on a runner-level failed result", async () => {
    await withTempTelegramHeartbeatSandbox(async ({ tmpDir, storePath, replySpy }) => {
      const cfg = createConfig({ tmpDir, storePath });
      await seedMainSessionStore(storePath, cfg, {});
      replySpy.mockImplementation(async (_ctx, options) => {
        const operation = makeFailedOwnerOperation();
        const runState = resolveReplyOperationRunState(options);
        if (!runState) {
          throw new Error("Expected heartbeat reply operation run state");
        }
        runState.agentTurn = "failed";
        runState.agentTurnOwner = operation;
        return setReplyPayloadMetadata(
          { text: DISTINCTIVE_FAILURE_TEXT, isError: true },
          { deliverDespiteSourceReplySuppression: true },
        );
      });

      const result = await runHeartbeat(cfg, replySpy);

      expect(result).toEqual({
        status: "failed",
        reason: "agent-runner-failure",
        failureText: DISTINCTIVE_FAILURE_TEXT,
      });
      expect(getLastHeartbeatEvent()).toMatchObject({
        status: "failed",
        reason: "agent-runner-failure",
        silent: true,
      });
    });
  }, 20_000);

  it("bounds captured failure text to 500 characters", async () => {
    await withTempTelegramHeartbeatSandbox(async ({ tmpDir, storePath, replySpy }) => {
      const cfg = createConfig({ tmpDir, storePath });
      await seedMainSessionStore(storePath, cfg, {});
      const longText = `${DISTINCTIVE_FAILURE_TEXT} ${"y".repeat(600)}`;
      replySpy.mockImplementation(async (_ctx, options) => {
        const operation = makeFailedOwnerOperation();
        const runState = resolveReplyOperationRunState(options);
        if (!runState) {
          throw new Error("Expected heartbeat reply operation run state");
        }
        runState.agentTurn = "failed";
        runState.agentTurnOwner = operation;
        return setReplyPayloadMetadata(
          { text: longText, isError: true },
          { deliverDespiteSourceReplySuppression: true },
        );
      });

      const result = await runHeartbeat(cfg, replySpy);

      expect(result.status).toBe("failed");
      expect(result.reason).toBe("agent-runner-failure");
      expect(result.failureText?.length).toBe(500);
      expect(result.failureText).toBe(longText.slice(0, 500));
    });
  }, 20_000);

  it("does not attach failureText when a run has no explicit failure", async () => {
    await withTempTelegramHeartbeatSandbox(async ({ tmpDir, storePath, replySpy }) => {
      const cfg = createConfig({ tmpDir, storePath });
      await seedMainSessionStore(storePath, cfg, {});
      replySpy.mockResolvedValue({ text: "ok" });

      const result = await runHeartbeat(cfg, replySpy);

      expect(result.status).toBe("ran");
      expect("failureText" in result ? result.failureText : undefined).toBeUndefined();
      expect("failureKind" in result ? result.failureKind : undefined).toBeUndefined();
    });
  }, 20_000);

  it("keeps silent-timeout acks failureText-free (BUG-089 H untouched)", async () => {
    await withTempTelegramHeartbeatSandbox(async ({ tmpDir, storePath, replySpy }) => {
      const cfg = createConfig({ tmpDir, storePath });
      await seedMainSessionStore(storePath, cfg, {});
      replySpy.mockImplementation(async (_ctx, options) => {
        const operation = makeFailedOwnerOperation();
        const runState = resolveReplyOperationRunState(options);
        if (!runState) {
          throw new Error("Expected heartbeat reply operation run state");
        }
        runState.agentTurn = "failed";
        runState.agentTurnOwner = operation;
        return {
          text: "Request timed out before a response was generated",
          isError: true,
        };
      });

      // Background wake: the timeout-shape text is silently acked (kind ack,
      // silent) instead of a failure outcome — the receipt carries no text.
      const result = await runHeartbeatOnce({
        cfg,
        deps: createDeps({ getReplyFromConfig: replySpy }),
        source: "interval",
        intent: "scheduled",
        reason: "interval",
      });

      expect(result.status).toBe("ran");
      expect("failureText" in result ? result.failureText : undefined).toBeUndefined();
    });
  }, 20_000);
});
