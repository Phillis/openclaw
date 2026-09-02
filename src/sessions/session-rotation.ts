import {
  loadSessionEntryReadOnly,
  listSessionEntryKeysReadOnly,
  upsertSessionEntryCore,
} from "../config/sessions/session-accessor.js";
import type { SessionAccessScope } from "../config/sessions/session-accessor.types.js";
import type { SessionEntry } from "../config/sessions/types.js";
import type { SessionRotationConfig } from "../config/types.base.js";
import { createSubsystemLogger } from "../logging/subsystem.js";
// Core admission-path session rotation + context ceiling.
//
// Lossless is the contract: a rotated session is ARCHIVED (archivedAt +
// archivedBy="rotation"), never deleted. The rotated key `base:rK` keeps the
// transcript and LCM history readable while the old entry rejects new work via
// the existing archived gate (resolveSessionWorkStartError in lifecycle.ts).
//
// When `session.rotation` is absent (or has no trigger) the feature is OFF and
// these helpers are a cost-free no-op (everything is gated on the rotation
// object having at least one trigger). The channel plugin always sends the BASE
// peer key; the gateway resolves the current epoch here, so rotation is
// channel-agnostic and does not touch the plugins.
import { parseAgentSessionKey } from "../routing/session-key.js";
import { isCronSessionKey, isSubagentSessionKey } from "./session-key-utils.js";
import { runExclusiveSessionLifecycleMutation } from "./session-lifecycle-admission.js";

const MILLIS_PER_HOUR = 3_600_000;

const log = createSubsystemLogger("sessions/rotation");

export const ROTATION_ARCHIVE_ACTOR_TYPE = "rotation";

/** Stable gateway error reason that triggers the single mid-queue epoch re-resolve. */
export const SESSION_ROTATION_CHANGED_ERROR_REASON = "session-rotation-changed";

// region key helpers
const ROTATED_SUFFIX_RE = /:r(\d+)$/;

/** Parses a rotated `base:rK` session key into { baseKey, epoch } (epoch >= 1). */
export function parseRotatedSessionKey(
  key: string | null | undefined,
): { baseKey: string; epoch: number } | undefined {
  if (!key) {
    return undefined;
  }
  const match = ROTATED_SUFFIX_RE.exec(key);
  if (!match) {
    return undefined;
  }
  const epoch = Number(match[1]);
  if (!Number.isInteger(epoch) || epoch < 1) {
    return undefined;
  }
  return { baseKey: key.slice(0, key.length - match[0].length), epoch };
}

/** Deterministic rotated session key for a rotation-eligible base peer key. */
export function buildRotatedSessionKey(baseKey: string, epoch: number): string {
  return `${baseKey}:r${epoch}`;
}

/**
 * Whether a session key is a rotation-eligible peer conversation.
 *
 * Eligible shapes are agent-scoped peer sessions (`agent:<id>:<channel>:
 * direct:<peer>`, `agent:<id>:direct:<peer>`, group/channel keys) that are NOT
 * the agent's protected main key and not cron/subagent/handoff/internal
 * families. The `:rK` suffix is treated opaquely and does not change
 * eligibility: a `base:rK` key is eligible exactly when its base is.
 */
export function isRotationEligibleSessionKey(
  key: string | null | undefined,
  options: { mainKey?: string } = {},
): boolean {
  const raw = (key ?? "").trim();
  if (!raw) {
    return false;
  }
  const base = parseRotatedSessionKey(raw)?.baseKey ?? raw;
  const parsed = parseAgentSessionKey(base);
  if (!parsed) {
    return false;
  }
  const rest = parsed.rest;
  if (!rest) {
    return false;
  }
  const mainKey = (options.mainKey ?? "main").trim().toLowerCase();
  if (rest.toLowerCase() === mainKey) {
    return false;
  }
  if (isCronSessionKey(base) || isSubagentSessionKey(base)) {
    return false;
  }
  if (base.toLowerCase().endsWith(":handoff")) {
    return false;
  }
  return /(?:^|:)direct(?::|$)/i.test(rest) || /:group:|:channel:/i.test(rest);
}

/** Resolves the rotation-trigger reason (turns/age) for an active entry. */
export function resolveRotationTrigger(params: {
  entry?: { rotationTurnCount?: number; sessionStartedAt?: number } | null;
  baseSessionStartedAt?: number;
  rotation: { maxTurns?: number; maxAgeHours?: number };
  now: number;
}): { reason: "turns" | "age" | null; turnCount: number; ageHours: number } {
  const turnCount = params.entry?.rotationTurnCount ?? 0;
  const startedAt = params.baseSessionStartedAt ?? params.entry?.sessionStartedAt;
  const ageMs = startedAt === undefined ? 0 : Math.max(0, params.now - Math.max(0, startedAt));
  const ageHours = ageMs / MILLIS_PER_HOUR;
  const maxTurns = params.rotation.maxTurns;
  const maxAgeHours = params.rotation.maxAgeHours;
  if (maxTurns !== undefined && maxTurns > 0 && turnCount >= maxTurns) {
    return { reason: "turns", turnCount, ageHours };
  }
  if (maxAgeHours !== undefined && maxAgeHours > 0 && ageHours >= maxAgeHours) {
    return { reason: "age", turnCount, ageHours };
  }
  return { reason: null, turnCount, ageHours };
}

/** Whether the rotation feature is on (has at least one turn/age trigger). */
export function isRotationEnabled(rotation: SessionRotationConfig | undefined): boolean {
  if (!rotation) {
    return false;
  }
  return (
    (rotation.maxTurns !== undefined && rotation.maxTurns > 0) ||
    (rotation.maxAgeHours !== undefined && rotation.maxAgeHours > 0)
  );
}
// --------------------------------------------------------------------------- store scope

export type RotationStoreScope = {
  agentId: string;
  env?: NodeJS.ProcessEnv;
  storePath?: string;
};

function accessScope(scope: RotationStoreScope, sessionKey: string): SessionAccessScope {
  return {
    agentId: scope.agentId,
    env: scope.env,
    sessionKey,
    storePath: scope.storePath,
  };
}

/** Loads one persisted entry for an exact rotation key (no alias rewriting). */
function loadRotationEntry(
  scope: RotationStoreScope,
  sessionKey: string,
): SessionEntry | undefined {
  return loadSessionEntryReadOnly(accessScope(scope, sessionKey));
}

/**
 * Resolves the current active epoch for a base key: the highest persisted,
 * non-archived `base:rK` entry (base itself is epoch 0). If no persisted
 * non-archived row exists, falls back to epoch 0 / the base key.
 */
export function resolveCurrentRotationEpoch(
  scope: RotationStoreScope,
  baseKey: string,
): { epoch: number; key: string } {
  const keys = listSessionEntryKeysReadOnly({
    agentId: scope.agentId,
    env: scope.env,
    storePath: scope.storePath,
  });
  let bestEpoch = -1;
  for (const persistedKey of keys) {
    let epoch: number;
    if (persistedKey === baseKey) {
      epoch = 0;
    } else {
      const parsed = parseRotatedSessionKey(persistedKey);
      if (!parsed || parsed.baseKey !== baseKey) {
        continue;
      }
      epoch = parsed.epoch;
    }
    const entry = loadRotationEntry(scope, persistedKey);
    if (entry?.archivedAt === undefined) {
      if (epoch > bestEpoch) {
        bestEpoch = epoch;
      }
    }
  }
  const epoch = Math.max(bestEpoch, 0);
  return { epoch, key: epoch === 0 ? baseKey : buildRotatedSessionKey(baseKey, epoch) };
}

function isArchivedRotationEntry(entry: SessionEntry | undefined): boolean {
  return (
    entry?.archivedAt !== undefined &&
    (entry?.archivedBy as { type?: string } | undefined)?.type === // SAFETY: structural read of the rotation actor discriminator.
      ROTATION_ARCHIVE_ACTOR_TYPE
  );
}

/**
 * Core rotation trigger + bookkeeping, executed under the lifecycle-mutation
 * fence on the base identity so concurrent admissions cannot double-advance.
 *
 * - Determines the current active epoch (highest non-archived `base:rK`).
 * - If a trigger (turns/age) fires, archives the current active entry
 *   (archivedAt=now, archivedBy="rotation"; never deleted) and advances to
 *   `base:r<epoch+1>`.
 * - Bumps rotationTurnCount / lastInteractionAt on the newly active entry under
 *   the same fence.
 *
 * Returns the key the request should be admitted against and whether it rotated.
 */
export async function runSessionRotationAdmission(params: {
  scope: RotationStoreScope;
  baseKey: string;
  rotation: SessionRotationConfig;
  now?: number;
}): Promise<{
  baseKey: string;
  targetKey: string;
  rotated: boolean;
  reason?: "turns" | "age";
  turnCount?: number;
  ageHours?: number;
}> {
  const now = params.now ?? Date.now();
  if (!isRotationEnabled(params.rotation)) {
    return { baseKey: params.baseKey, targetKey: params.baseKey, rotated: false };
  }
  return await runExclusiveSessionLifecycleMutation({
    scope: params.scope.storePath ?? `rotation:${params.baseKey}`,
    identities: [params.baseKey],
    run: async () => {
      const current = resolveCurrentRotationEpoch(params.scope, params.baseKey);
      const currentEntry = loadRotationEntry(params.scope, current.key);
      const baseEntry = loadRotationEntry(params.scope, params.baseKey);
      const trigger = resolveRotationTrigger({
        entry: currentEntry,
        baseSessionStartedAt: baseEntry?.sessionStartedAt,
        rotation: params.rotation,
        now,
      });
      let targetKey = current.key;
      let rotated = false;
      let nextEpoch = current.epoch;
      if (trigger.reason !== null) {
        rotated = true;
        nextEpoch = current.epoch + 1;
        // Archive the old active entry losslessly by merging the archive markers
        // onto the existing row (never replace, or transcript-side fields drop).
        if (currentEntry) {
          await upsertSessionEntryCore(accessScope(params.scope, current.key), {
            archivedAt: now,
            archivedBy: { type: "rotation" as const, id: "rotation" },
            updatedAt: now,
          });
        }
        targetKey = buildRotatedSessionKey(params.baseKey, nextEpoch);
        log.info(
          `[session-rotation] baseKey=${params.baseKey} from=${current.key} ` +
            `to=${targetKey} reason=${trigger.reason} turnCount=${trigger.turnCount} ` +
            `ageHours=${trigger.ageHours.toFixed(2)}`,
        );
      }
      // Bump the bookkeeping on the newly active entry (creating it if absent).
      const active = loadRotationEntry(params.scope, targetKey);
      await upsertSessionEntryCore(accessScope(params.scope, targetKey), {
        rotationEpoch: nextEpoch,
        rotationTurnCount: (active?.rotationTurnCount ?? 0) + 1,
        lastRotationAt: rotated ? now : active?.lastRotationAt,
        sessionStartedAt: active?.sessionStartedAt ?? now,
        lastInteractionAt: now,
      });
      return {
        baseKey: params.baseKey,
        targetKey,
        rotated,
        reason: trigger.reason ?? undefined,
        turnCount: trigger.turnCount,
        ageHours: trigger.ageHours,
      };
    },
  });
}

/**
 * Pure re-resolution of the current active epoch used for the mid-queue retry:
 * after an admission on a stale rotated key fails with the archived error, the
 * gateway re-resolves the current epoch once and re-admits. No mutation.
 */
export function resolveSessionRotationRetryTarget(
  scope: RotationStoreScope,
  baseKey: string,
): { targetKey: string; baseKey: string } {
  return { baseKey, targetKey: resolveCurrentRotationEpoch(scope, baseKey).key };
}

/**
 * Whether a request currently targets an archived rotation entry (mid-queue
 * captured before a boundary advanced the epoch). Used to select the retry
 * path: returns true when the entry at `sessionKey` is archived by rotation.
 */
export function isRotationArchivedEntry(scope: RotationStoreScope, sessionKey: string): boolean {
  return isArchivedRotationEntry(loadRotationEntry(scope, sessionKey));
}

/**
 * Admission-path rotation target for one inbound chat.send: resolves the
 * current epoch (advancing/archiving when a trigger fires) and returns the key
 * the request should be admitted against. No-op (returns the same key) when the
 * feature is off or the key is not a rotation-eligible peer conversation.
 */
export async function resolveSessionRotationAdmissionTarget(params: {
  scope: RotationStoreScope;
  sessionKey: string;
  rotation: SessionRotationConfig | undefined;
  mainKey?: string;
  now?: number;
}): Promise<{ sessionKey: string; rotated: boolean }> {
  const { rotation } = params;
  if (!rotation || !isRotationEnabled(rotation)) {
    return { sessionKey: params.sessionKey, rotated: false };
  }
  if (!isRotationEligibleSessionKey(params.sessionKey, { mainKey: params.mainKey })) {
    return { sessionKey: params.sessionKey, rotated: false };
  }
  const baseKey = parseRotatedSessionKey(params.sessionKey)?.baseKey ?? params.sessionKey;
  const admission = await runSessionRotationAdmission({
    scope: params.scope,
    baseKey,
    rotation,
    now: params.now,
  });
  return { sessionKey: admission.targetKey, rotated: admission.rotated };
}

// region ceiling
/**
 * Admission-time ceiling for non-rotatable long-lived sessions (agent:<id>
 * main). When ceilingTokens is configured and the fresh context estimate
 * crosses it, request a compaction cycle via the injected invocation. A failed
 * compaction is fail-open: return { compact: true } and callers admit anyway.
 */
export function shouldEnforceCeiling(params: {
  rotation: SessionRotationConfig | undefined;
  sessionKey: string;
  isMainLongLived: boolean;
  estimatedTokens: number | undefined;
}): boolean {
  const ceiling = params.rotation?.ceilingTokens;
  if (ceiling === undefined || ceiling <= 0 || !params.isMainLongLived) {
    return false;
  }
  return params.estimatedTokens !== undefined && params.estimatedTokens >= ceiling;
}

export function resolveSessionCeilingEstimate(entry: SessionEntry | undefined): number | undefined {
  const total = entry?.totalTokens;
  return typeof total === "number" && Number.isFinite(total) && total >= 0 ? total : undefined;
}

/**
 * Admission-time ceiling cycle for a non-rotatable long-lived (main) session.
 * When ceilingTokens is configured and the estimated context crosses it, request
 * a compaction via the injected adapter. Always returns { admitted: true } so
 * interactive traffic is never blocked: a missing/failed compaction is fail-open
 * (logged) and admission proceeds on the same key.
 */
export async function runSessionCeilingCycle(params: {
  scope: RotationStoreScope;
  sessionKey: string;
  rotation: SessionRotationConfig | undefined;
  estimatedTokens: number | undefined;
  runCompaction?: () => Promise<void>;
}): Promise<{ compactRequested: boolean; admitted: true }> {
  const enforce = shouldEnforceCeiling({
    rotation: params.rotation,
    sessionKey: params.sessionKey,
    isMainLongLived: !isRotationEligibleSessionKey(params.sessionKey),
    estimatedTokens: params.estimatedTokens,
  });
  if (!enforce) {
    return { compactRequested: false, admitted: true };
  }
  log.info(
    `[session-ceiling] sessionKey=${params.sessionKey} ` +
      `estimatedTokens=${params.estimatedTokens} ` +
      `ceilingTokens=${params.rotation?.ceilingTokens} requesting compaction`,
  );
  try {
    if (params.runCompaction) {
      await params.runCompaction();
    }
  } catch (error) {
    // Fail-open: never block interactive traffic on a failed compaction.
    log.warn(
      `[session-ceiling] compaction failed for ${params.sessionKey}; admitting anyway: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
  return { compactRequested: true, admitted: true };
}
