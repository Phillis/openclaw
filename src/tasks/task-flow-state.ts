// Structured task-flow checkpoint/watch helpers keep long-running work resumable.
import { normalizeOptionalString } from "@openclaw/normalization-core/string-coerce";
import type { JsonValue, TaskFlowRecord } from "./task-flow-registry.types.js";

const CHECKPOINT_KEY = "__openclawCheckpoint";
const WATCH_KEY = "__openclawWatch";

export type TaskFlowCheckpoint = {
  summary?: string;
  nextAction?: string;
  unblockCondition?: string;
  reportTrigger?: string;
  assumptions?: string[];
  verifiedFacts?: string[];
  artifactRefs?: Record<string, string>;
  updatedAt?: number;
};

export type TaskFlowWatch = {
  waitingOn?: string;
  expectedEvent?: string;
  reviewAt?: number;
  reviewReason?: string;
  staleAfterMs?: number;
  stallCount?: number;
};

export type TaskFlowAttention = {
  state: "review_due" | "stale";
  reason: string;
  updatedAt?: number;
  reviewAt?: number;
  waitingOn?: string;
  expectedEvent?: string;
  stallCount?: number;
};

function asRecord(value: JsonValue | undefined | null): Record<string, JsonValue> | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return undefined;
  }
  return { ...(value as Record<string, JsonValue>) };
}

function normalizeOptionalNumber(value: JsonValue | undefined): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function normalizeStringArray(value: JsonValue | undefined): string[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }
  const next = value
    .filter((entry): entry is string => typeof entry === "string")
    .map((entry) => normalizeOptionalString(entry))
    .filter((entry): entry is string => Boolean(entry));
  return next.length > 0 ? next : undefined;
}

function normalizeStringRecord(value: JsonValue | undefined): Record<string, string> | undefined {
  const record = asRecord(value);
  if (!record) {
    return undefined;
  }
  const nextEntries = Object.entries(record)
    .map(([key, entry]) => {
      const normalizedKey = normalizeOptionalString(key);
      const normalizedValue =
        typeof entry === "string" ? normalizeOptionalString(entry) : undefined;
      return normalizedKey && normalizedValue ? ([normalizedKey, normalizedValue] as const) : null;
    })
    .filter((entry): entry is readonly [string, string] => Boolean(entry));
  return nextEntries.length > 0 ? Object.fromEntries(nextEntries) : undefined;
}

function normalizeCheckpointRecord(value: JsonValue | undefined): TaskFlowCheckpoint | undefined {
  const record = asRecord(value);
  if (!record) {
    return undefined;
  }
  const checkpoint: TaskFlowCheckpoint = {
    ...(typeof record.summary === "string" && normalizeOptionalString(record.summary)
      ? { summary: normalizeOptionalString(record.summary) }
      : {}),
    ...(typeof record.nextAction === "string" && normalizeOptionalString(record.nextAction)
      ? { nextAction: normalizeOptionalString(record.nextAction) }
      : {}),
    ...(typeof record.unblockCondition === "string" &&
    normalizeOptionalString(record.unblockCondition)
      ? { unblockCondition: normalizeOptionalString(record.unblockCondition) }
      : {}),
    ...(typeof record.reportTrigger === "string" && normalizeOptionalString(record.reportTrigger)
      ? { reportTrigger: normalizeOptionalString(record.reportTrigger) }
      : {}),
    ...(normalizeStringArray(record.assumptions)
      ? { assumptions: normalizeStringArray(record.assumptions) }
      : {}),
    ...(normalizeStringArray(record.verifiedFacts)
      ? { verifiedFacts: normalizeStringArray(record.verifiedFacts) }
      : {}),
    ...(normalizeStringRecord(record.artifactRefs)
      ? { artifactRefs: normalizeStringRecord(record.artifactRefs) }
      : {}),
    ...(normalizeOptionalNumber(record.updatedAt) !== undefined
      ? { updatedAt: normalizeOptionalNumber(record.updatedAt) }
      : {}),
  };
  return Object.keys(checkpoint).length > 0 ? checkpoint : undefined;
}

function normalizeWatchRecord(value: JsonValue | undefined): TaskFlowWatch | undefined {
  const record = asRecord(value);
  if (!record) {
    return undefined;
  }
  const watch: TaskFlowWatch = {
    ...(typeof record.waitingOn === "string" && normalizeOptionalString(record.waitingOn)
      ? { waitingOn: normalizeOptionalString(record.waitingOn) }
      : {}),
    ...(typeof record.expectedEvent === "string" && normalizeOptionalString(record.expectedEvent)
      ? { expectedEvent: normalizeOptionalString(record.expectedEvent) }
      : {}),
    ...(normalizeOptionalNumber(record.reviewAt) !== undefined
      ? { reviewAt: normalizeOptionalNumber(record.reviewAt) }
      : {}),
    ...(typeof record.reviewReason === "string" && normalizeOptionalString(record.reviewReason)
      ? { reviewReason: normalizeOptionalString(record.reviewReason) }
      : {}),
    ...(normalizeOptionalNumber(record.staleAfterMs) !== undefined
      ? { staleAfterMs: normalizeOptionalNumber(record.staleAfterMs) }
      : {}),
    ...(normalizeOptionalNumber(record.stallCount) !== undefined
      ? { stallCount: normalizeOptionalNumber(record.stallCount) }
      : {}),
  };
  return Object.keys(watch).length > 0 ? watch : undefined;
}

function checkpointToJsonValue(value: TaskFlowCheckpoint): JsonValue | undefined {
  const artifactRefs =
    value.artifactRefs && Object.keys(value.artifactRefs).length > 0
      ? value.artifactRefs
      : undefined;
  const checkpoint: Record<string, JsonValue> = {
    ...(value.summary ? { summary: value.summary } : {}),
    ...(value.nextAction ? { nextAction: value.nextAction } : {}),
    ...(value.unblockCondition ? { unblockCondition: value.unblockCondition } : {}),
    ...(value.reportTrigger ? { reportTrigger: value.reportTrigger } : {}),
    ...(value.assumptions?.length ? { assumptions: value.assumptions } : {}),
    ...(value.verifiedFacts?.length ? { verifiedFacts: value.verifiedFacts } : {}),
    ...(artifactRefs ? { artifactRefs } : {}),
    ...(typeof value.updatedAt === "number" ? { updatedAt: value.updatedAt } : {}),
  };
  return Object.keys(checkpoint).length > 0 ? checkpoint : undefined;
}

function watchToJsonValue(value: TaskFlowWatch): JsonValue | undefined {
  const watch: Record<string, JsonValue> = {
    ...(value.waitingOn ? { waitingOn: value.waitingOn } : {}),
    ...(value.expectedEvent ? { expectedEvent: value.expectedEvent } : {}),
    ...(typeof value.reviewAt === "number" ? { reviewAt: value.reviewAt } : {}),
    ...(value.reviewReason ? { reviewReason: value.reviewReason } : {}),
    ...(typeof value.staleAfterMs === "number" ? { staleAfterMs: value.staleAfterMs } : {}),
    ...(typeof value.stallCount === "number" ? { stallCount: value.stallCount } : {}),
  };
  return Object.keys(watch).length > 0 ? watch : undefined;
}

export function readTaskFlowCheckpoint(
  stateJson: JsonValue | undefined,
): TaskFlowCheckpoint | undefined {
  const record = asRecord(stateJson);
  if (!record) {
    return undefined;
  }
  return normalizeCheckpointRecord(record[CHECKPOINT_KEY] ?? record.checkpoint);
}

export function readTaskFlowWatch(stateJson: JsonValue | undefined): TaskFlowWatch | undefined {
  const record = asRecord(stateJson);
  if (!record) {
    return undefined;
  }
  return normalizeWatchRecord(record[WATCH_KEY] ?? record.watch);
}

export function mergeTaskFlowStructuredState(params: {
  stateJson?: JsonValue | null;
  checkpoint?: TaskFlowCheckpoint | null;
  watch?: TaskFlowWatch | null;
}): JsonValue | null | undefined {
  const base = asRecord(params.stateJson);
  const explicitNull = params.stateJson === null;
  const next = base ? { ...base } : {};

  if (params.checkpoint !== undefined) {
    const checkpoint = params.checkpoint ? checkpointToJsonValue(params.checkpoint) : undefined;
    if (checkpoint === undefined) {
      delete next[CHECKPOINT_KEY];
      delete next.checkpoint;
    } else {
      next[CHECKPOINT_KEY] = checkpoint;
    }
  }

  if (params.watch !== undefined) {
    const watch = params.watch ? watchToJsonValue(params.watch) : undefined;
    if (watch === undefined) {
      delete next[WATCH_KEY];
      delete next.watch;
    } else {
      next[WATCH_KEY] = watch;
    }
  }

  if (Object.keys(next).length === 0) {
    return explicitNull ? null : undefined;
  }
  return next;
}

export function deriveTaskFlowAttention(
  flow: Pick<TaskFlowRecord, "status" | "updatedAt" | "stateJson">,
  now = Date.now(),
): TaskFlowAttention | undefined {
  if (
    flow.status === "succeeded" ||
    flow.status === "failed" ||
    flow.status === "cancelled" ||
    flow.status === "lost" ||
    flow.status === "blocked"
  ) {
    return undefined;
  }
  const checkpoint = readTaskFlowCheckpoint(flow.stateJson);
  const watch = readTaskFlowWatch(flow.stateJson);
  if (!watch) {
    return undefined;
  }
  if (typeof watch.reviewAt === "number" && watch.reviewAt <= now) {
    return {
      state: "review_due",
      reason: watch.reviewReason ?? "Flow review is due.",
      ...(checkpoint?.updatedAt !== undefined ? { updatedAt: checkpoint.updatedAt } : {}),
      reviewAt: watch.reviewAt,
      ...(watch.waitingOn ? { waitingOn: watch.waitingOn } : {}),
      ...(watch.expectedEvent ? { expectedEvent: watch.expectedEvent } : {}),
      ...(watch.stallCount !== undefined ? { stallCount: watch.stallCount } : {}),
    };
  }
  if (typeof watch.staleAfterMs === "number" && watch.staleAfterMs >= 0) {
    const referenceAt = Math.max(flow.updatedAt ?? 0, checkpoint?.updatedAt ?? 0);
    if (referenceAt > 0 && now - referenceAt >= watch.staleAfterMs) {
      return {
        state: "stale",
        reason:
          watch.reviewReason ??
          `Flow state is stale; no checkpoint update for ${now - referenceAt}ms.`,
        ...(checkpoint?.updatedAt !== undefined ? { updatedAt: checkpoint.updatedAt } : {}),
        ...(watch.reviewAt !== undefined ? { reviewAt: watch.reviewAt } : {}),
        ...(watch.waitingOn ? { waitingOn: watch.waitingOn } : {}),
        ...(watch.expectedEvent ? { expectedEvent: watch.expectedEvent } : {}),
        ...(watch.stallCount !== undefined ? { stallCount: watch.stallCount } : {}),
      };
    }
  }
  return undefined;
}
