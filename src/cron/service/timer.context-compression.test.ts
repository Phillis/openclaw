import { describe, expect, it, vi } from "vitest";
import type { CronJob } from "../types.js";
import { applyJobResult } from "./timer.js";

function makeRecurringAgentTurnJob(): CronJob {
  const message = [
    "You are Oscar running the heavy recurring PR QA merge sweep with GitHub review, QA routing, and blocker cleanup.",
    "Check current state, coordinate owners, verify blockers, and produce a compact result for the next run.",
  ]
    .join(" ")
    .repeat(10);
  return {
    id: "job-1",
    name: "Heavy recurring job",
    enabled: true,
    createdAtMs: 1_700_000_000_000,
    updatedAtMs: 1_700_000_000_000,
    schedule: { kind: "every", everyMs: 3_600_000 },
    sessionTarget: "isolated",
    wakeMode: "now",
    payload: {
      kind: "agentTurn",
      message,
    },
    state: {},
  };
}

function makeCronServiceState() {
  return {
    deps: {
      cronConfig: {},
      log: {
        warn: vi.fn(),
        info: vi.fn(),
      },
    },
  } as any;
}

describe("applyJobResult context compression carry-forward state", () => {
  it("stores a compact summary snapshot for recurring agentTurn jobs", () => {
    const job = makeRecurringAgentTurnJob();
    const state = makeCronServiceState();

    applyJobResult(state, job, {
      status: "ok",
      summary:
        "Previous run merged two PRs, routed one QA handoff, and assigned the remaining blocker to Dante.",
      startedAt: 1_700_000_100_000,
      endedAt: 1_700_000_160_000,
    });

    expect(job.state.contextCompressionSummary).toContain("merged two PRs");
    expect(job.state.contextCompressionStatus).toBe("ok");
    expect(job.state.contextCompressionSource).toBe("summary");
    expect(job.state.contextCompressionUpdatedAtMs).toBe(1_700_000_160_000);
    expect(job.state.contextCompressionPromptHash).toMatch(/^[a-f0-9]{32}$/u);
  });

  it("preserves the prior carry-forward snapshot on skipped runs", () => {
    const job = makeRecurringAgentTurnJob();
    const state = makeCronServiceState();
    job.state.contextCompressionSummary = "stable summary";
    job.state.contextCompressionStatus = "ok";
    job.state.contextCompressionSource = "summary";
    job.state.contextCompressionUpdatedAtMs = 123;
    job.state.contextCompressionPromptHash = "abc123";

    applyJobResult(state, job, {
      status: "skipped",
      summary: "fresh but skipped",
      startedAt: 1_700_000_200_000,
      endedAt: 1_700_000_260_000,
    });

    expect(job.state.contextCompressionSummary).toBe("stable summary");
    expect(job.state.contextCompressionStatus).toBe("ok");
    expect(job.state.contextCompressionSource).toBe("summary");
    expect(job.state.contextCompressionUpdatedAtMs).toBe(123);
    expect(job.state.contextCompressionPromptHash).toBe("abc123");
  });

  it("does not store carry-forward state for short cron jobs", () => {
    const job = makeRecurringAgentTurnJob();
    const state = makeCronServiceState();
    if (job.payload.kind !== "agentTurn") {
      throw new Error("expected agentTurn payload");
    }
    job.payload.message = "Short recurring reminder.";

    applyJobResult(state, job, {
      status: "ok",
      summary: "done",
      startedAt: 1_700_000_300_000,
      endedAt: 1_700_000_360_000,
    });

    expect(job.state.contextCompressionSummary).toBeUndefined();
    expect(job.state.contextCompressionPromptHash).toBeUndefined();
  });
});
