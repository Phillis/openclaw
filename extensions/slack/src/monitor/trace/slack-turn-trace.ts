// Slack turn latency trace: end-to-end stage timings for one inbound Slack
// event through preparation, agent dispatch, model streaming, and Slack-visible
// delivery. Process-local only: no per-token I/O, no external stores, no model
// visibility. Stage timestamps use a monotonic clock (performance.now by
// default; injectable for tests). Missing stages stay null -- never fabricated.
//
// Contract notes:
// - Stage keys are stable and ordered; the completion event is the single
//   structured record for a turn (bounded diagnostic logging happens only for
//   failed/incomplete turns, decided by the sink passed to the tracer).
// - Latency histograms are bounded rolling windows (drop-oldest past
//   SLACK_TRACE_WINDOW_SAMPLES); percentiles derive from a sorted copy at
//   snapshot time, so recording cost is one array push per turn.
import { randomUUID } from "node:crypto";

export const SLACK_TRACE_WINDOW_SAMPLES = 512;
export const SLACK_TRACE_RECENT_COMPLETIONS = 64;

export type SlackTraceStageId =
  | "ingress"
  | "dedup_admission"
  | "auth_prepared"
  | "agent_enqueued"
  | "agent_started"
  | "model_request_started"
  | "first_provider_bytes"
  | "first_visible_write"
  | "final_output_ack"
  | "turn_complete";

export const SLACK_TRACE_STAGE_IDS: readonly SlackTraceStageId[] = [
  "ingress",
  "dedup_admission",
  "auth_prepared",
  "agent_enqueued",
  "agent_started",
  "model_request_started",
  "first_provider_bytes",
  "first_visible_write",
  "final_output_ack",
  "turn_complete",
];

export type SlackTurnTraceResultClass = "ok" | "error" | "cancel" | "dropped";

export type SlackTraceThinkingBucket = "off" | "low" | "medium" | "high";

export type SlackTurnTraceDimensions = {
  agentId?: string;
  accountId?: string;
  targetClass?: "dm" | "channel" | "thread";
  modelId?: string;
  thinkingLevel?: SlackTraceThinkingBucket;
  coldSession?: boolean;
  mcpMaterialized?: boolean;
  memoryCalled?: boolean;
};

export type SlackTurnTraceLatencies = {
  ingressToPreparedMs: number | null;
  queueWaitMs: number | null;
  modelToFirstByteMs: number | null;
  ingressToFirstVisibleMs: number | null;
  ingressToCompleteMs: number | null;
};

export type SlackTurnCompletionEvent = {
  type: "slack.turn.trace";
  version: 1;
  traceId: string;
  stages: Record<SlackTraceStageId, number | null>;
  dimensions: SlackTurnTraceDimensions & { resultClass: SlackTurnTraceResultClass };
  latencies: SlackTurnTraceLatencies;
};

export type SlackTurnTrace = {
  readonly traceId: string;
  /** Records the first timestamp for a stage; later calls for the same stage are ignored. */
  stage(stage: SlackTraceStageId, atMs?: number): void;
  setDimensions(dimensions: Partial<SlackTurnTraceDimensions>): void;
  /** Freezes the turn and records histograms once. Idempotent. */
  complete(params: { resultClass: SlackTurnTraceResultClass }): SlackTurnCompletionEvent;
};

function isEmptyDimensionsSlot(value: unknown): boolean {
  return value === undefined;
}

/** Low-cardinality thinking-level bucket for privacy-safe dimensions. */
export function bucketSlackTraceThinkingLevel(
  level: string | undefined,
): SlackTraceThinkingBucket | undefined {
  if (!level) {
    return undefined;
  }
  const normalized = level.toLowerCase();
  if (normalized === "off") {
    return "off";
  }
  if (normalized === "low" || normalized === "minimal" || normalized === "lowest") {
    return "low";
  }
  if (normalized === "medium" || normalized === "balanced") {
    return "medium";
  }
  return "high";
}

function deriveSlackTurnTraceLatencies(
  stages: Record<SlackTraceStageId, number | null>,
): SlackTurnTraceLatencies {
  const between = (end: SlackTraceStageId, start: SlackTraceStageId): number | null => {
    const startAt = stages[start];
    const endAt = stages[end];
    if (startAt === null || endAt === null) {
      return null;
    }
    return endAt - startAt;
  };
  return {
    ingressToPreparedMs: between("auth_prepared", "ingress"),
    queueWaitMs: between("agent_started", "agent_enqueued"),
    modelToFirstByteMs: between("first_provider_bytes", "model_request_started"),
    ingressToFirstVisibleMs: between("first_visible_write", "ingress"),
    ingressToCompleteMs: between("turn_complete", "ingress"),
  };
}

export function createSlackTurnTrace(params: {
  traceId: string;
  now?: () => number;
  onComplete?: (event: SlackTurnCompletionEvent) => void;
}): SlackTurnTrace {
  const now = params.now ?? (() => performance.now());
  const stages = Object.fromEntries(
    SLACK_TRACE_STAGE_IDS.map((stageId) => [stageId, null]),
  ) as Record<SlackTraceStageId, number | null>;
  const dimensions: SlackTurnTraceDimensions = {};
  let completion: SlackTurnCompletionEvent | undefined;
  return {
    get traceId() {
      return params.traceId;
    },
    stage(stage, atMs) {
      // First write wins so late re-entry (retries, merged debounce events)
      // cannot move an already-recorded boundary.
      if (stages[stage] !== null) {
        return;
      }
      stages[stage] = atMs ?? now();
    },
    setDimensions(next) {
      if (completion) {
        return;
      }
      for (const [key, value] of Object.entries(next)) {
        if (!isEmptyDimensionsSlot(value)) {
          (dimensions as Record<string, unknown>)[key] = value;
        }
      }
    },
    complete(completeParams) {
      if (completion) {
        return completion;
      }
      // Finalize the turn boundary at completion time (first-write semantics so
      // an explicit earlier mark, if any, wins).
      if (stages.turn_complete === null) {
        stages.turn_complete = now();
      }
      const latencies = deriveSlackTurnTraceLatencies(stages);
      completion = {
        type: "slack.turn.trace",
        version: 1,
        traceId: params.traceId,
        stages: { ...stages },
        dimensions: { ...dimensions, resultClass: completeParams.resultClass },
        latencies,
      };
      recordSlackTurnTraceLatencies(latencies);
      pushRecentSlackTurnCompletion(completion);
      params.onComplete?.(completion);
      return completion;
    },
  };
}

export function createSlackTraceId(): string {
  return `stt_${randomUUID()}`;
}

export type SlackTraceHistogramName = keyof SlackTurnTraceLatencies;

export const SLACK_TRACE_HISTOGRAM_NAMES: readonly SlackTraceHistogramName[] = [
  "ingressToPreparedMs",
  "queueWaitMs",
  "modelToFirstByteMs",
  "ingressToFirstVisibleMs",
  "ingressToCompleteMs",
];

const histogramSamples = Object.fromEntries(
  SLACK_TRACE_HISTOGRAM_NAMES.map((name) => [name, [] as number[]]),
) as Record<SlackTraceHistogramName, number[]>;

const recentCompletions: SlackTurnCompletionEvent[] = [];

function recordSlackTurnTraceLatencies(latencies: SlackTurnTraceLatencies): void {
  for (const name of SLACK_TRACE_HISTOGRAM_NAMES) {
    const value = latencies[name];
    if (value === null) {
      continue;
    }
    const samples = histogramSamples[name];
    samples.push(value);
    if (samples.length > SLACK_TRACE_WINDOW_SAMPLES) {
      samples.splice(0, samples.length - SLACK_TRACE_WINDOW_SAMPLES);
    }
  }
}

function pushRecentSlackTurnCompletion(event: SlackTurnCompletionEvent): void {
  recentCompletions.push(event);
  if (recentCompletions.length > SLACK_TRACE_RECENT_COMPLETIONS) {
    recentCompletions.splice(0, recentCompletions.length - SLACK_TRACE_RECENT_COMPLETIONS);
  }
}

/**
 * Linear-interpolation percentile over a sorted sample copy.
 * Deterministic; used only by the snapshot accessor (rare path).
 */
export function percentile(sorted: readonly number[], p: number): number {
  if (sorted.length === 0) {
    return 0;
  }
  if (sorted.length === 1) {
    return sorted[0];
  }
  const idx = (p / 100) * (sorted.length - 1);
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) {
    return sorted[lo];
  }
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
}

export type SlackTurnTraceHistogramSnapshot = {
  count: number;
  p50: number | null;
  p95: number | null;
  p99: number | null;
};

export type SlackTurnTraceSnapshot = {
  histograms: Record<SlackTraceHistogramName, SlackTurnTraceHistogramSnapshot>;
  recentCompletions: Array<Pick<SlackTurnCompletionEvent, "traceId" | "dimensions" | "latencies">>;
};

/** Read-only snapshot for later RPC exposure. No message content is retained. */
export function getSlackTurnTraceSnapshot(): SlackTurnTraceSnapshot {
  const histograms = {} as Record<SlackTraceHistogramName, SlackTurnTraceHistogramSnapshot>;
  for (const name of SLACK_TRACE_HISTOGRAM_NAMES) {
    const samples = histogramSamples[name];
    if (samples.length === 0) {
      histograms[name] = { count: 0, p50: null, p95: null, p99: null };
      continue;
    }
    const sorted = [...samples].toSorted((a, b) => a - b);
    histograms[name] = {
      count: sorted.length,
      p50: percentile(sorted, 50),
      p95: percentile(sorted, 95),
      p99: percentile(sorted, 99),
    };
  }
  return {
    histograms,
    recentCompletions: recentCompletions.map(({ traceId, dimensions, latencies }) => ({
      traceId,
      dimensions,
      latencies,
    })),
  };
}

/** Test-isolation helper: clears module-level aggregates between test files. */
export function resetSlackTurnTraceAggregates(): void {
  for (const name of SLACK_TRACE_HISTOGRAM_NAMES) {
    histogramSamples[name].length = 0;
  }
  recentCompletions.length = 0;
}
