// Per-agent non-interactive loop governor.
//
// Caps non-interactive run admissions (cron:/subagent:/incognito: session keys)
// for explicitly governed agents at an hourly budget. When a governed agent
// breaches its budget for the UTC hour, its remaining non-interactive
// admissions are rejected with a typed error so a runaway supervisor loop sees
// a clean failure instead of a silent hang. Interactive DM turns are never
// governed. Durable per-(agent, hour) counts live in the shared state DB and
// survive restarts. Feature is off by default: no config => no-op.
import type { DatabaseSync } from "node:sqlite";
import { normalizeOptionalString } from "@openclaw/normalization-core/string-coerce";
import { getRuntimeConfigSnapshot } from "../config/runtime-snapshot.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { executeSqliteQuerySync, getNodeSqliteKysely } from "../infra/kysely-sync.js";
import { enqueueSystemEvent } from "../infra/system-events.js";
import { createSubsystemLogger } from "../logging/subsystem.js";
import { isIncognitoSessionKey } from "../shared/incognito-session-key.js";
import {
  ensureLoopGovernorKindTurnCountsSchema,
  ensureLoopGovernorTurnCountsSchema,
} from "../state/openclaw-state-db-schema-additive.js";
import type {
  Generated,
  DB as OpenClawStateKyselyDatabase,
} from "../state/openclaw-state-db.generated.js";
import {
  openOpenClawStateDatabase,
  type OpenClawStateDatabaseOptions,
} from "../state/openclaw-state-db.js";
import {
  isCronSessionKey,
  isSubagentSessionKey,
  parseAgentSessionKey,
} from "./session-key-utils.js";

const log = createSubsystemLogger("loop-governor");

const HOUR_MS = 3_600_000;

type LoopGovernorStore = Pick<OpenClawStateKyselyDatabase, "loop_governor_turn_counts">;

const ensuredDatabases = new WeakSet<DatabaseSync>();

/** Typed rejection surfaced to the supervisor loop on a budget breach. */
export class LoopGovernorBudgetExceededError extends Error {
  readonly code = "LOOP_GOVERNOR_BUDGET_EXCEEDED";
  constructor(
    readonly agentId: string,
    readonly hourBucket: number,
    readonly count: number,
    readonly maxTurnsPerHour: number,
  ) {
    super(
      `[loop-governor] agent "${agentId}" exceeded non-interactive turn budget ` +
        `${maxTurnsPerHour}/hour (hour ${hourBucket}, count ${count}); parked.`,
    );
    this.name = "LoopGovernorBudgetExceededError";
  }
}

export interface LoopGovernorAlertChannel {
  channel?: string;
  to?: string;
  accountId?: string;
  threadId?: string | number;
}

export interface LoopGovernorPolicy {
  agents: ReadonlySet<string>;
  maxTurnsPerHour: number;
  /** Per-session-kind budgets; keys are normalized kind ids (cron/subagent/incognito). */
  byKind?: Readonly<Record<LoopGovernorSessionKind, number>>;
  alertChannel?: LoopGovernorAlertChannel;
}

export type LoopGovernorSessionKind = "cron" | "subagent" | "incognito";

/** Normalizes a byKind config key ("cron:" / "cron") to the kind id. */
function normalizeLoopGovernorKindKey(key: string): LoopGovernorSessionKind | undefined {
  const normalized = normalizeOptionalString(key)?.toLowerCase().replace(/:$/, "");
  if (normalized === "cron" || normalized === "subagent" || normalized === "incognito") {
    return normalized;
  }
  return undefined;
}

/** Classifies a governed non-interactive session key into its budget kind. */
export function loopGovernorKindFromSessionKey(
  sessionKey: string | undefined | null,
): LoopGovernorSessionKind | undefined {
  if (isCronSessionKey(sessionKey)) {
    return "cron";
  }
  if (isSubagentSessionKey(sessionKey)) {
    return "subagent";
  }
  if (isIncognitoSessionKey(sessionKey)) {
    return "incognito";
  }
  return undefined;
}

/** Resolve the active loop-governor policy from the runtime config, or null when off. */
export function resolveLoopGovernorPolicy(
  cfg: OpenClawConfig | null | undefined,
): LoopGovernorPolicy | null {
  const lb = cfg?.agents?.loopGovernor;
  if (!lb || !Array.isArray(lb.agents) || lb.agents.length === 0) {
    return null;
  }
  const agents = new Set<string>();
  for (const id of lb.agents) {
    const normalized = normalizeOptionalString(id)?.toLowerCase();
    if (normalized) {
      agents.add(normalized);
    }
  }
  if (agents.size === 0) {
    return null;
  }
  let byKind: Record<LoopGovernorSessionKind, number> | undefined;
  if (lb.byKind) {
    for (const [key, value] of Object.entries(lb.byKind)) {
      const kind = normalizeLoopGovernorKindKey(key);
      if (kind === undefined || typeof value !== "number" || !Number.isFinite(value)) {
        continue;
      }
      // SAFETY: byKind is read from the persisted loop-governor budget record
      // (state DB loop_governor_kind_turn_counts via the additive schema); an
      // absent table legitimately yields an empty byKind map. The cast only
      // types the empty-record shape — it never narrows away a real value.
      // SAFETY: absent table yields an empty byKind map, never a narrowed lie.
      byKind ??= {} as Record<LoopGovernorSessionKind, number>;
      byKind[kind] = Math.max(1, Math.floor(value));
    }
  }
  return {
    agents,
    maxTurnsPerHour: lb.maxTurnsPerHour,
    ...(byKind ? { byKind } : {}),
    alertChannel: lb.alertChannel,
  };
}

/** UTC-hour bucket for a timestamp, so counts reset at each UTC hour boundary. */
export function loopGovernorHourBucket(nowMs: number): number {
  return Math.floor(nowMs / HOUR_MS);
}

/** True when a session key is classified non-interactive (cron:/subagent:/incognito:). */
export function isNonInteractiveSessionKey(sessionKey: string | undefined | null): boolean {
  return (
    isCronSessionKey(sessionKey) ||
    isSubagentSessionKey(sessionKey) ||
    isIncognitoSessionKey(sessionKey)
  );
}

/** Agent id from an agent-scoped session key, if any. */
export function agentIdFromSessionKey(sessionKey: string | undefined | null): string | undefined {
  return parseAgentSessionKey(sessionKey)?.agentId;
}

function ensureSchema(options: OpenClawStateDatabaseOptions): void {
  const state = openOpenClawStateDatabase(options);
  if (ensuredDatabases.has(state.db)) {
    return;
  }
  ensureLoopGovernorTurnCountsSchema(state.db);
  ensureLoopGovernorKindTurnCountsSchema(state.db);
  ensuredDatabases.add(state.db);
}

function readTurnCount(
  db: DatabaseSync,
  agentId: string,
  hourBucket: number,
): { count: number; alerted: number } {
  const kysely = getNodeSqliteKysely<LoopGovernorStore>(db);
  const row = executeSqliteQuerySync(
    db,
    kysely
      .selectFrom("loop_governor_turn_counts")
      .select(["turn_count", "alerted"])
      .where("agent_id", "=", agentId)
      .where("hour_bucket", "=", hourBucket),
  ).rows[0];
  return row ? { count: row.turn_count, alerted: row.alerted } : { count: 0, alerted: 0 };
}

function upsertTurnCount(
  db: DatabaseSync,
  agentId: string,
  hourBucket: number,
  turnCount: number,
  alerted: number,
  nowMs: number,
): void {
  const kysely = getNodeSqliteKysely<LoopGovernorStore>(db);
  executeSqliteQuerySync(
    db,
    kysely
      .insertInto("loop_governor_turn_counts")
      .values({
        agent_id: agentId,
        hour_bucket: hourBucket,
        turn_count: turnCount,
        alerted,
        updated_at_ms: nowMs,
      })
      .onConflict((conflict) =>
        conflict.columns(["agent_id", "hour_bucket"]).doUpdateSet({
          turn_count: turnCount,
          alerted,
          updated_at_ms: nowMs,
        }),
      ),
  );
}

type LoopGovernorKindStore = {
  loop_governor_kind_turn_counts: {
    agent_id: string;
    hour_bucket: number;
    kind: string;
    turn_count: Generated<number>;
    alerted: Generated<number>;
    updated_at_ms: number;
  };
};

function readKindTurnCount(
  db: DatabaseSync,
  agentId: string,
  hourBucket: number,
  kind: LoopGovernorSessionKind,
): { count: number; alerted: number } {
  const kysely = getNodeSqliteKysely<LoopGovernorKindStore>(db);
  const row = executeSqliteQuerySync(
    db,
    kysely
      .selectFrom("loop_governor_kind_turn_counts")
      .select(["turn_count", "alerted"])
      .where("agent_id", "=", agentId)
      .where("hour_bucket", "=", hourBucket)
      .where("kind", "=", kind),
  ).rows[0];
  return row ? { count: row.turn_count, alerted: row.alerted } : { count: 0, alerted: 0 };
}

function upsertKindTurnCount(
  db: DatabaseSync,
  agentId: string,
  hourBucket: number,
  kind: LoopGovernorSessionKind,
  turnCount: number,
  alerted: number,
  nowMs: number,
): void {
  const kysely = getNodeSqliteKysely<LoopGovernorKindStore>(db);
  executeSqliteQuerySync(
    db,
    kysely
      .insertInto("loop_governor_kind_turn_counts")
      .values({
        agent_id: agentId,
        hour_bucket: hourBucket,
        kind,
        turn_count: turnCount,
        alerted,
        updated_at_ms: nowMs,
      })
      .onConflict((conflict) =>
        conflict.columns(["agent_id", "hour_bucket", "kind"]).doUpdateSet({
          turn_count: turnCount,
          alerted,
          updated_at_ms: nowMs,
        }),
      ),
  );
}

/**
 * Enforce the per-agent hourly non-interactive budget for one admission and
 * record the turn. Returns true when the admission may proceed; throws
 * LoopGovernorBudgetExceededError to park it. Interactive and non-governed
 * admissions always return true. Fail-open: a state read/write error logs and
 * admits rather than hanging a supervisor loop.
 */
/**
 * Loop governor: cap non-interactive turns for governed agents. Only the
 * outermost admission of a turn is counted; nested tool/session ops run under
 * an existing admission and must never consume governor budget.
 */
export function checkLoopGovernorAdmissionForAdmissionScope(
  outermostAdmission: boolean,
  identities: readonly string[],
  stateOptions?: OpenClawStateDatabaseOptions,
): void {
  if (!outermostAdmission) {
    return;
  }
  let agentSessionKey: string | undefined;
  for (const identity of identities) {
    // 9.6: decodeSessionIdentity became module-private upstream; the identity
    // wire shape is JSON [scope, identity] — decode inline (same tolerance).
    let raw: string = identity;
    try {
      const decoded: unknown = JSON.parse(identity);
      if (Array.isArray(decoded) && decoded.length === 2 && typeof decoded[1] === "string") {
        raw = decoded[1];
      }
    } catch {
      // non-JSON identity: use verbatim
    }
    if (raw && agentIdFromSessionKey(raw)) {
      agentSessionKey = raw;
      break;
    }
  }
  checkLoopGovernorAdmission({ sessionKey: agentSessionKey, stateOptions });
}

export function checkLoopGovernorAdmission(params: {
  sessionKey: string | undefined | null;
  stateOptions?: OpenClawStateDatabaseOptions;
  cfg?: OpenClawConfig | null;
  nowMs?: number;
  onAlert?: (text: string, policy: LoopGovernorPolicy) => void;
}): boolean {
  const nowMs = params.nowMs ?? Date.now();
  const cfg = params.cfg !== undefined ? params.cfg : getRuntimeConfigSnapshot();
  const policy = resolveLoopGovernorPolicy(cfg);
  if (!policy) {
    return true;
  }
  const agentId = agentIdFromSessionKey(params.sessionKey);
  if (!agentId || !policy.agents.has(agentId.toLowerCase())) {
    return true;
  }
  if (!isNonInteractiveSessionKey(params.sessionKey)) {
    // Interactive DM/peer turns are never governed.
    return true;
  }
  const normalizedAgent = agentId.toLowerCase();
  const hourBucket = loopGovernorHourBucket(nowMs);
  const sessionKey = normalizeOptionalString(params.sessionKey) ?? undefined;
  const onAlert =
    params.onAlert ??
    ((text: string, alertPolicy: LoopGovernorPolicy) =>
      deliverLoopGovernorAlert(text, alertPolicy, { sessionKey }));
  try {
    ensureSchema(params.stateOptions ?? {});
    const state = openOpenClawStateDatabase(params.stateOptions ?? {});
    const kind = loopGovernorKindFromSessionKey(params.sessionKey);
    const kindBudget = kind !== undefined ? policy.byKind?.[kind] : undefined;
    const budget = kindBudget ?? policy.maxTurnsPerHour;
    const { count, alerted } =
      kind !== undefined && kindBudget !== undefined
        ? readKindTurnCount(state.db, normalizedAgent, hourBucket, kind)
        : readTurnCount(state.db, normalizedAgent, hourBucket);
    if (count >= budget) {
      if (alerted === 0) {
        onAlert(
          `[loop-governor] agent "${agentId}" reached ${budget} non-interactive ` +
            `${kindBudget !== undefined ? `${kind} ` : ""}turns this UTC hour (${hourBucket}); further non-interactive runs parked until the ` +
            `next hour.`,
          policy,
        );
      }
      log.warn("[loop-governor] breach", {
        agentId: normalizedAgent,
        hourBucket,
        turnCount: count,
        maxTurnsPerHour: budget,
        ...(kindBudget !== undefined ? { kind } : {}),
        sessionKey,
      });
      if (kind !== undefined && kindBudget !== undefined) {
        upsertKindTurnCount(state.db, normalizedAgent, hourBucket, kind, count, 1, nowMs);
      } else {
        upsertTurnCount(state.db, normalizedAgent, hourBucket, count, 1, nowMs);
      }
      throw new LoopGovernorBudgetExceededError(normalizedAgent, hourBucket, count, budget);
    }
    if (kind !== undefined && kindBudget !== undefined) {
      upsertKindTurnCount(state.db, normalizedAgent, hourBucket, kind, count + 1, alerted, nowMs);
    } else {
      upsertTurnCount(state.db, normalizedAgent, hourBucket, count + 1, alerted, nowMs);
    }
    return true;
  } catch (error) {
    if (error instanceof LoopGovernorBudgetExceededError) {
      throw error;
    }
    // Fail-open: a state-store fault must not hang a supervisor loop; admit.
    log.warn(`[loop-governor] state persist failure for ${normalizedAgent}: ${String(error)}`);
    return true;
  }
}

/** Default alert delivery through the existing system-event notification path. */
export function deliverLoopGovernorAlert(
  text: string,
  _policy: LoopGovernorPolicy,
  params: { sessionKey?: string },
): void {
  const { sessionKey } = params;
  if (!sessionKey) {
    return;
  }
  try {
    enqueueSystemEvent(text, { sessionKey });
  } catch (error) {
    log.warn(`[loop-governor] failed to enqueue breach alert: ${String(error)}`);
  }
}
