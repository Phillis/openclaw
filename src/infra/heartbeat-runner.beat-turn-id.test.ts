// Regression coverage for the heartbeat double-prompt defect: every beat must
// carry one idempotent source-turn id so the persisted poll prompt is adopted
// by the run's pre-persisted-turn reconciliation instead of being orphaned and
// re-persisted (which produced two user prompts per beat, ~5s apart).
import { describe, expect, it, vi } from "vitest";
import { readChannelSourceTurnId } from "../auto-reply/reply/source-turn-id.js";
import type { OpenClawConfig } from "../config/config.js";
import { resolveAgentMainSessionKey } from "../config/sessions.js";
import { runHeartbeatOnce } from "./heartbeat-runner.js";
import {
  seedSessionStore,
  type HeartbeatReplySpy,
  withTempHeartbeatSandbox,
} from "./heartbeat-runner.test-utils.js";

vi.mock("./outbound/deliver.js", () => ({
  deliverOutboundPayloads: vi.fn().mockResolvedValue([]),
  deliverOutboundPayloadsInternal: vi.fn().mockResolvedValue([]),
}));

function expectedBeatTurnId(agentId: string, startedAt: number): string {
  return `heartbeat-beat:v1:${agentId}:${startedAt}`;
}

async function runBeat(params: {
  tmpDir: string;
  storePath: string;
  replySpy: HeartbeatReplySpy;
  agentId: string;
  nowMs: number;
}): Promise<string | undefined> {
  const cfg: OpenClawConfig = {
    agents: {
      defaults: {
        workspace: params.tmpDir,
        heartbeat: {
          every: "30m",
          target: "whatsapp",
          lightContext: true,
        },
      },
      list: [{ id: "oscar" }, { id: "alinaai" }],
    },
    channels: { whatsapp: { allowFrom: ["*"] } },
    session: { store: params.storePath },
  };
  await seedSessionStore(
    params.storePath,
    resolveAgentMainSessionKey({ cfg, agentId: params.agentId }),
    {
      lastChannel: "whatsapp",
      lastProvider: "whatsapp",
      lastTo: "+1555",
    },
  );
  params.replySpy.mockResolvedValue({ text: "NO_REPLY" });
  const result = await runHeartbeatOnce({
    cfg,
    agentId: params.agentId,
    deps: {
      getReplyFromConfig: params.replySpy,
      getQueueSize: () => 0,
      nowMs: () => params.nowMs,
    },
  });
  if (params.replySpy.mock.calls.length === 0) {
    throw new Error(`heartbeat did not dispatch; result=${JSON.stringify(result)}`);
  }
  const [ctx] = params.replySpy.mock.calls.at(-1) ?? [];
  return ctx ? readChannelSourceTurnId(ctx) : undefined;
}

describe("heartbeat beat source-turn idempotency", () => {
  it("stamps each beat context with one deterministic per-beat source-turn id", async () => {
    await withTempHeartbeatSandbox(
      async ({ tmpDir, storePath, replySpy }) => {
        const turnId = await runBeat({
          tmpDir,
          storePath,
          replySpy,
          agentId: "oscar",
          nowMs: 1_789_280_186_064,
        });
        expect(turnId).toBe(expectedBeatTurnId("oscar", 1_789_280_186_064));
      },
      { prefix: "openclaw-hb-beat-id-" },
    );
  });

  it("keeps the id stable for the same beat and distinct across beats", async () => {
    await withTempHeartbeatSandbox(
      async ({ tmpDir, storePath, replySpy }) => {
        const first = await runBeat({
          tmpDir,
          storePath,
          replySpy,
          agentId: "oscar",
          nowMs: 1_789_280_186_064,
        });
        const sameBeatRetry = await runBeat({
          tmpDir,
          storePath,
          replySpy,
          agentId: "oscar",
          nowMs: 1_789_280_186_064,
        });
        expect(sameBeatRetry).toBe(first);
        const nextBeat = await runBeat({
          tmpDir,
          storePath,
          replySpy,
          agentId: "oscar",
          nowMs: 1_789_280_186_064 + 30 * 60 * 1000,
        });
        expect(nextBeat).toBeDefined();
        expect(nextBeat).not.toBe(first);
      },
      { prefix: "openclaw-hb-beat-id-" },
    );
  });

  it("scopes the id per agent", async () => {
    await withTempHeartbeatSandbox(
      async ({ tmpDir, storePath, replySpy }) => {
        const oscar = await runBeat({
          tmpDir,
          storePath,
          replySpy,
          agentId: "oscar",
          nowMs: 1_789_280_186_064,
        });
        const alinaai = await runBeat({
          tmpDir,
          storePath,
          replySpy,
          agentId: "alinaai",
          nowMs: 1_789_280_186_064,
        });
        expect(oscar).not.toBe(alinaai);
        expect(alinaai).toBe(expectedBeatTurnId("alinaai", 1_789_280_186_064));
      },
      { prefix: "openclaw-hb-beat-id-" },
    );
  });
});
