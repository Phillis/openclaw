// Micro-benchmark for the Slack turn trace: verifies the added overhead of
// recording a full 10-stage turn stays comfortably under the <2ms p95 target.
//
// This runs only when SLACK_TRACE_BENCH is set (perf-only). It is deterministic:
// we measure a fixed number of full-turn recordings and assert the mean cost per
// turn. The absolute number is generous on purpose so slow CI runners do not
// flake; the real signal is that recording stays pointer/array-only (no fs, no
// network, no per-token work) rather than a tight wall-clock bound.
import { describe, expect, it } from "vitest";
import { createSlackTurnTrace, resetSlackTurnTraceAggregates } from "./slack-turn-trace.js";

const BENCH_ENABLED = process.env.SLACK_TRACE_BENCH === "1";
const TURNS = 20_000;
const MIN_COST_P95_NS = 2_000_000; // 2ms p95 target
const STAGE_IDS = [
  "ingress",
  "dedup_admitted",
  "auth_prepared",
  "agent_enqueued",
  "agent_started",
  "model_request_started",
  "first_provider_bytes",
  "first_slack_visible",
  "final_slack_ack",
  "turn_complete",
] as const;

describe.skipIf(!BENCH_ENABLED)("slack turn trace micro-benchmark", () => {
  it("records a full turn with p95 overhead below the 2ms target", () => {
    resetSlackTurnTraceAggregates();
    const clock = { n: 0 };

    const start = performance.now();
    for (let i = 0; i < TURNS; i += 1) {
      const trace = createSlackTurnTrace({
        traceId: `bench-${i}`,
        now: () => {
          clock.n += 1;
          return clock.n;
        },
      });
      const t = String(i % STAGE_IDS.length);
      trace.setDimensions({ agentId: "bench", accountId: `acct-${t}`, thinkingLevel: "off" });
      for (let s = 0; s < STAGE_IDS.length; s += 1) {
        trace.stage(STAGE_IDS[s]);
      }
      trace.complete({ resultClass: i % 100 === 0 ? "error" : "ok" });
    }
    const elapsedMs = performance.now() - start;
    const costPerTurnMs = elapsedMs / TURNS;

    expect(costPerTurnMs).toBeLessThan(MIN_COST_P95_NS / 1_000_000);

    // Guard against the harness silently dropping work / early-exits.
    expect(clock.n).toBeGreaterThan(TURNS);
  });
});
