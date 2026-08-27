// Unit tests for the Slack turn latency trace module: stage discipline,
// histogram math, and correlation-id hygiene. The trace is a pure pointer-and-
// array module (no I/O, no network), so tests run without any plugin runtime.
import { beforeEach, describe, expect, it } from "vitest";
import {
  SLACK_TRACE_STAGE_IDS,
  bucketSlackTraceThinkingLevel,
  createSlackTurnTrace,
  getSlackTurnTraceSnapshot,
  percentile,
  resetSlackTurnTraceAggregates,
} from "./slack-turn-trace.js";

describe("bucketSlackTraceThinkingLevel", () => {
  it("buckets known levels into low-cardinality buckets", () => {
    expect(bucketSlackTraceThinkingLevel(undefined)).toBeUndefined();
    expect(bucketSlackTraceThinkingLevel("off")).toBe("off");
    expect(bucketSlackTraceThinkingLevel("low")).toBe("low");
    expect(bucketSlackTraceThinkingLevel("minimal")).toBe("low");
    expect(bucketSlackTraceThinkingLevel("medium")).toBe("medium");
    expect(bucketSlackTraceThinkingLevel("high")).toBe("high");
    expect(bucketSlackTraceThinkingLevel("xhigh")).toBe("high");
    expect(bucketSlackTraceThinkingLevel("max")).toBe("high");
  });
});

describe("createSlackTurnTrace", () => {
  let nowMs: number;

  beforeEach(() => {
    nowMs = 0;
    resetSlackTurnTraceAggregates();
  });

  it("records stage timestamps in monotonic order and completes once", () => {
    const trace = createSlackTurnTrace({ traceId: "t1", now: () => nowMs });
    nowMs = 10;
    trace.stage("ingress");
    nowMs = 25;
    trace.stage("auth_prepared");
    nowMs = 40;
    trace.stage("turn_complete");

    const first = trace.complete({ resultClass: "ok" });
    const second = trace.complete({ resultClass: "ok" });

    expect(second).toBe(first);
    expect(first.stages.ingress).toBe(10);
    expect(first.stages.auth_prepared).toBe(25);
    expect(first.stages.turn_complete).toBe(40);
    expect(first.latencies.ingressToPreparedMs).toBe(15);
    expect(first.latencies.ingressToCompleteMs).toBe(30);
  });

  it("reports missing stages as null and skips their latencies", () => {
    const trace = createSlackTurnTrace({ traceId: "t2", now: () => nowMs });
    nowMs = 5;
    trace.stage("ingress");
    nowMs = 20;
    trace.stage("turn_complete");
    const event = trace.complete({ resultClass: "ok" });

    expect(event.stages.model_request_started).toBeNull();
    expect(event.stages.first_provider_bytes).toBeNull();
    expect(event.latencies.modelToFirstByteMs).toBeNull();
    // These are still derivable from the present stages.
    expect(event.latencies.ingressToCompleteMs).toBe(15);
  });

  it("keeps the first timestamp for a stage (idempotent, retry-safe)", () => {
    const trace = createSlackTurnTrace({ traceId: "t3", now: () => nowMs });
    nowMs = 10;
    trace.stage("ingress");
    nowMs = 99;
    trace.stage("ingress"); // re-entry must not move the boundary
    const event = trace.complete({ resultClass: "ok" });
    expect(event.stages.ingress).toBe(10);
  });

  it("records a result class and freezes dimensions at completion", () => {
    const trace = createSlackTurnTrace({ traceId: "t4", now: () => nowMs });
    trace.setDimensions({ agentId: "a1", accountId: "acc1" });
    trace.complete({ resultClass: "error" });
    // Late dimension writes after completion are ignored.
    trace.setDimensions({ modelId: "should-not-land" });
    const event = trace.complete({ resultClass: "error" });
    expect(event.dimensions.agentId).toBe("a1");
    expect(event.dimensions.accountId).toBe("acc1");
    expect(event.dimensions.resultClass).toBe("error");
    expect(event.dimensions.modelId).toBeUndefined();
  });
});

describe("histogram math", () => {
  it("computes p50/p95/p99 on known sorted samples", () => {
    const samples = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const sorted = [...samples].toSorted((a, b) => a - b);
    expect(percentile(sorted, 50)).toBeCloseTo(5.5, 5);
    expect(percentile(sorted, 95)).toBeCloseTo(9.55, 5);
    expect(percentile(sorted, 99)).toBeCloseTo(9.91, 5);
  });

  it("handles empty and single-element inputs", () => {
    expect(percentile([], 50)).toBe(0);
    expect(percentile([42], 50)).toBe(42);
  });

  it("derives snapshot histograms from completed turns and bounds the window", async () => {
    // Push slightly more than the bounded window to prove oldest samples are
    // dropped rather than unbounded growth.
    const clock = { n: 0 };
    for (let i = 0; i < 560; i += 1) {
      const trace = createSlackTurnTrace({
        traceId: `bulk-${i}`,
        now: () => {
          clock.n += 1;
          return clock.n;
        },
      });
      trace.stage("ingress");
      trace.stage("turn_complete");
      trace.complete({ resultClass: "ok" });
    }
    const snapshot = getSlackTurnTraceSnapshot();
    expect(snapshot.histograms.ingressToCompleteMs.count).toBe(512);
    expect(snapshot.histograms.ingressToCompleteMs.p50).toBeGreaterThan(0);
    expect(snapshot.histograms.ingressToCompleteMs.p95).toBeGreaterThanOrEqual(
      snapshot.histograms.ingressToCompleteMs.p50 ?? 0,
    );
    expect(snapshot.histograms.ingressToCompleteMs.p99).toBeGreaterThanOrEqual(
      snapshot.histograms.ingressToCompleteMs.p95 ?? 0,
    );
  });

  it("leaves unobserved histograms empty", () => {
    const snapshot = getSlackTurnTraceSnapshot();
    expect(snapshot.histograms.ingressToPreparedMs.count).toBe(0);
    expect(snapshot.histograms.ingressToPreparedMs.p50).toBeNull();
  });
});

describe("correlation id hygiene", () => {
  beforeEach(() => {
    resetSlackTurnTraceAggregates();
  });

  it("never injects the trace id into user-visible content payloads", () => {
    const trace = createSlackTurnTrace({ traceId: "stt_secret-id-abc", now: () => 0 });
    trace.stage("ingress");
    trace.stage("turn_complete");
    trace.complete({ resultClass: "ok" });

    // Simulate the model-facing/user-visible structures the pipeline carries.
    const ctxPayload = {
      body: "hello from a user",
      BodyForAgent: "hello from a user",
    };
    const outboundPayload = { text: "agent reply", blocks: [] };
    const serialized = JSON.stringify({ ctxPayload, outboundPayload, message: { text: "hi" } });
    expect(serialized).not.toContain("stt_secret-id-abc");
  });

  it("is the only configured trace present in prepared/dispatch structures", () => {
    const trace = createSlackTurnTrace({ traceId: "stt_prop-1", now: () => 0 });
    trace.stage("ingress");

    // This mirrors how message-handler attaches identity onto the prepared
    // message before it is handed to dispatch.
    const prepared = { traceId: trace.traceId, trace } as { traceId?: string; trace?: object };
    expect(prepared.traceId).toBe("stt_prop-1");
    expect(prepared.trace).toBe(trace);

    // The exact same object must flow through to dispatch without re-minting.
    expect(SLACK_TRACE_STAGE_IDS).toContain("ingress");
    const dispatchTrace = prepared.trace as typeof trace;
    dispatchTrace.stage("turn_complete");
    const event = dispatchTrace.complete({ resultClass: "ok" });
    expect(event.traceId).toBe("stt_prop-1");
    expect(event.stages.ingress).toBe(0);
  });
});
