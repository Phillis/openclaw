import { normalizeLowercaseStringOrEmpty } from "@openclaw/normalization-core/string-coerce";
import {
  listActiveEmbeddedRunSessionIds,
  listActiveEmbeddedRunSessionKeys,
} from "../agents/embedded-agent-runner/active-run-projections.js";
import { discoverRestartRecoveryStoreTargets } from "../agents/main-session-recovery/main-session-restart-recovery-shared.js";
import {
  canonicalizeMainSessionAlias,
  resolveAgentMainSessionKey,
} from "../config/sessions/main-session.js";
import { resolveSessionStorePathCore } from "../config/sessions/paths.js";
import {
  applySessionEntryReplacements,
  loadSessionEntry,
  patchSessionEntryCore,
  type SessionEntryReplacement,
} from "../config/sessions/session-accessor.js";
import { readSessionEntryInWorker } from "../config/sessions/session-entry-read-runtime.js";
import type { SessionEntry } from "../config/sessions/types.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import {
  isSubagentSessionKey,
  normalizeAgentId,
  resolveAgentIdFromSessionKey,
  toAgentStoreSessionKey,
} from "../routing/session-key.js";
import { resolveMainScopedEventSessionKey } from "./event-session-routing.js";
import type { HeartbeatConfig } from "./heartbeat-config.js";
import { heartbeatLog } from "./heartbeat-log.js";

/** Fork helper: trim + deduplicate a string iterable into a Set (inlined from the pre-9.7 shared module). */
function normalizeStringSet(values: Iterable<string> | undefined): Set<string> {
  const normalized = new Set<string>();
  for (const value of values ?? []) {
    const trimmed = value.trim();
    if (trimmed) {
      normalized.add(trimmed);
    }
  }
  return normalized;
}

/** Fork helper: true when an embedded run still owns the session (inlined from the pre-9.7 shared module). */
function hasCurrentProcessOwner(params: {
  activeSessionIds: Set<string>;
  activeSessionKeys: Set<string>;
  entry: { sessionId: string };
  sessionKey: string;
}): boolean {
  if (params.activeSessionIds.has(params.entry.sessionId)) {
    return true;
  }
  return params.activeSessionIds.size === 0 && params.activeSessionKeys.has(params.sessionKey);
}

/** Reason recorded on isolated heartbeat rows a previous gateway lifecycle killed. */
const HEARTBEAT_RESTART_INTERRUPTED_REASON =
  "heartbeat run interrupted because the gateway restarted";

/**
 * Boot-time reconcile for isolated heartbeat runs the previous gateway
 * lifecycle killed. Isolated heartbeat sessions are deliberately excluded from
 * main-session restart recovery, and their window rows are otherwise finalized
 * only by in-process terminal settlement — so a restart leaves them `running`
 * forever. Mark the owner-exact set (entries carrying the
 * heartbeatIsolatedBaseSessionKey marker) failed at boot, when no in-process
 * run can own them, mirroring the cron receipt's interrupted fact. Bookkeeping
 * only: no resume, no synthetic wake. Never reconcile outside boot — an active
 * embedded run fences its own row out below.
 */
export async function markStartupOrphanedHeartbeatIsolatedSessions(params: {
  cfg?: OpenClawConfig;
  stateDir?: string;
}): Promise<{ marked: number; skipped: number }> {
  const result = { marked: 0, skipped: 0 };
  const activeSessionIds = normalizeStringSet(listActiveEmbeddedRunSessionIds());
  const activeSessionKeys = normalizeStringSet(listActiveEmbeddedRunSessionKeys());
  for (const storeTarget of await discoverRestartRecoveryStoreTargets({
    cfg: params.cfg,
    stateDir: params.stateDir,
  })) {
    const storeResult = await applySessionEntryReplacements<{ marked: number; skipped: number }>({
      storePath: storeTarget.storePath,
      requireWriteSuccess: true,
      update: (entries) => {
        const replacements: SessionEntryReplacement[] = [];
        const counts = { marked: 0, skipped: 0 };
        for (const { sessionKey, entry } of entries) {
          // Owner-exact: only rows stamped by heartbeat isolation. Main-session
          // recovery owns every other running row by design.
          if (!entry.heartbeatIsolatedBaseSessionKey?.trim()) {
            counts.skipped++;
            continue;
          }
          // 10.6 persisted rows no longer carry "running" as a status literal;
          // an active-owning row is identified by heartbeat isolation + no
          // current process owner (checks above). Mark anything left as
          // failed — a completed row would not be isolated-live here.
          if (hasCurrentProcessOwner({ activeSessionIds, activeSessionKeys, entry, sessionKey })) {
            counts.skipped++;
            continue;
          }
          const now = Date.now();
          entry.status = "failed";
          entry.abortedLastRun = true;
          entry.lastRunError = HEARTBEAT_RESTART_INTERRUPTED_REASON;
          entry.endedAt = now;
          entry.runtimeMs = Math.max(0, now - (entry.startedAt ?? now));
          entry.lifecycleRunId = undefined;
          entry.updatedAt = now;
          replacements.push({ sessionKey, entry });
          counts.marked++;
        }
        return { result: counts, replacements };
      },
    });
    result.marked += storeResult.marked;
    result.skipped += storeResult.skipped;
  }
  if (result.marked > 0) {
    heartbeatLog.warn(`marked ${result.marked} restart-killed isolated heartbeat window(s) failed`);
  }
  return result;
}

export function resolveHeartbeatSessionKey(
  cfg: OpenClawConfig,
  agentId: string,
  heartbeat?: HeartbeatConfig,
  forcedSessionKey?: string,
  env: NodeJS.ProcessEnv = process.env,
) {
  const sessionCfg = cfg.session;
  const scope = sessionCfg?.scope ?? "per-sender";
  const resolvedAgentId = normalizeAgentId(agentId);
  const mainSessionKey =
    scope === "global" ? "global" : resolveAgentMainSessionKey({ cfg, agentId: resolvedAgentId });
  const storePath = resolveSessionStorePathCore(sessionCfg?.store, {
    // A literal `global` row is global only inside the selected agent's store.
    // Falling back here leaks the default agent's route into secondary heartbeats.
    agentId: resolvedAgentId,
    env,
  });
  const selectSession = (sessionKey = mainSessionKey, suppressOriginatingContext = false) => ({
    sessionKey,
    storePath,
    suppressOriginatingContext,
  });

  if (scope === "global") {
    return selectSession();
  }

  const resolveCandidate = (requestKey: string) => {
    const candidate = toAgentStoreSessionKey({
      agentId: resolvedAgentId,
      requestKey,
      mainKey: cfg.session?.mainKey,
    });
    if (isSubagentSessionKey(candidate)) {
      return undefined;
    }
    const canonical = canonicalizeMainSessionAlias({
      cfg,
      agentId: resolvedAgentId,
      sessionKey: candidate,
    });
    return canonical !== "global" &&
      !isSubagentSessionKey(canonical) &&
      resolveAgentIdFromSessionKey(canonical) === normalizeAgentId(resolvedAgentId)
      ? canonical
      : undefined;
  };

  // Guard: never route heartbeats to subagent sessions, regardless of entry path.
  const forced = forcedSessionKey?.trim();
  if (forced && isSubagentSessionKey(forced)) {
    return selectSession(mainSessionKey, true);
  }

  const forcedCanonical = forced ? resolveCandidate(forced) : undefined;
  if (forcedCanonical) {
    return selectSession(
      resolveMainScopedEventSessionKey({
        cfg,
        sessionKey: forcedCanonical,
        agentId: resolvedAgentId,
      }) ?? forcedCanonical,
    );
  }

  const trimmed = heartbeat?.session?.trim() ?? "";
  if (!trimmed || isSubagentSessionKey(trimmed)) {
    return selectSession();
  }

  const normalized = normalizeLowercaseStringOrEmpty(trimmed);
  if (normalized === "main" || normalized === "global") {
    return selectSession();
  }

  return selectSession(resolveCandidate(trimmed) || mainSessionKey);
}

/** The heartbeat's event queue session and its stored row. */
export type ResolvedHeartbeatSession = {
  sessionKey: string;
  storePath: string;
  suppressOriginatingContext: boolean;
  entry: SessionEntry | undefined;
};

export async function resolveHeartbeatSession(
  cfg: OpenClawConfig,
  agentId: string,
  heartbeat?: HeartbeatConfig,
  forcedSessionKey?: string,
  env: NodeJS.ProcessEnv = process.env,
): Promise<ResolvedHeartbeatSession> {
  const resolved = resolveHeartbeatSessionKey(cfg, agentId, heartbeat, forcedSessionKey, env);
  return {
    ...resolved,
    entry: await readSessionEntryInWorker({
      agentId,
      storePath: resolved.storePath,
      sessionKey: resolved.sessionKey,
      env,
    }),
  };
}

function isHeartbeatSessionOf(sessionKey: string, baseSessionKey: string): boolean {
  return (
    sessionKey.startsWith(baseSessionKey) &&
    /^(:heartbeat)+$/.test(sessionKey.slice(baseSessionKey.length))
  );
}

function resolveIsolatedHeartbeatSessionKey(params: {
  agentId: string;
  sessionKey: string;
  configuredSessionKey: string;
  storePath: string;
  env: NodeJS.ProcessEnv;
  sessionEntry?: { heartbeatIsolatedBaseSessionKey?: string };
}) {
  const storedBaseSessionKey = params.sessionEntry?.heartbeatIsolatedBaseSessionKey?.trim();
  if (params.configuredSessionKey === "global") {
    // The base global row stays literal inside its agent store; its isolated sibling
    // must be agent-qualified so ordinary session writes remain canonical.
    const isolatedSessionKey = toAgentStoreSessionKey({
      agentId: params.agentId,
      requestKey: "global:heartbeat",
    });
    if (
      params.sessionKey === "global" ||
      (storedBaseSessionKey === "global" &&
        (params.sessionKey === isolatedSessionKey ||
          isHeartbeatSessionOf(params.sessionKey, isolatedSessionKey)))
    ) {
      return { isolatedSessionKey, isolatedBaseSessionKey: "global" };
    }
  }
  // Collapse repeated `:heartbeat` suffixes introduced by wake-triggered re-entry.
  // The guard on configuredSessionKey ensures we do not strip a legitimate single
  // `:heartbeat` suffix that is part of the user-configured base key itself
  // (e.g. heartbeat.session: "alerts:heartbeat"). When the configured key already
  // ends with `:heartbeat`, a forced wake passes `configuredKey:heartbeat` which
  // must be treated as a new base rather than an existing isolated key.
  let isolatedBaseSessionKey = params.sessionKey;
  if (storedBaseSessionKey && isHeartbeatSessionOf(params.sessionKey, storedBaseSessionKey)) {
    isolatedBaseSessionKey = storedBaseSessionKey;
  } else if (
    isHeartbeatSessionOf(params.sessionKey, params.configuredSessionKey) &&
    !params.configuredSessionKey.endsWith(":heartbeat")
  ) {
    isolatedBaseSessionKey = params.configuredSessionKey;
  }
  return {
    isolatedSessionKey: `${isolatedBaseSessionKey}:heartbeat`,
    isolatedBaseSessionKey,
  };
}

/** Execution key and descriptive conversation chosen for a heartbeat event queue. */
export type HeartbeatSessionSelection = ResolvedHeartbeatSession & {
  run:
    | { kind: "shared"; sessionKey: string }
    | { kind: "isolated"; sessionKey: string; baseSessionKey: string };
  conversationEntry: SessionEntry | undefined;
  inspectsRunQueue: boolean;
};

/** Selects the execution key and descriptive conversation for an already-resolved event queue. */
export function resolveHeartbeatSessionSelection(
  cfg: OpenClawConfig,
  agentId: string,
  heartbeat: HeartbeatConfig | undefined,
  session: ResolvedHeartbeatSession,
  isolated: boolean,
  env: NodeJS.ProcessEnv = process.env,
): HeartbeatSessionSelection {
  if (!isolated) {
    return {
      ...session,
      run: { kind: "shared", sessionKey: session.sessionKey },
      conversationEntry: session.entry,
      inspectsRunQueue: true,
    };
  }
  const configured = resolveHeartbeatSessionKey(cfg, agentId, heartbeat, undefined, env);
  const { isolatedSessionKey, isolatedBaseSessionKey } = resolveIsolatedHeartbeatSessionKey({
    agentId,
    sessionKey: session.sessionKey,
    configuredSessionKey: configured.sessionKey,
    storePath: session.storePath,
    env,
    sessionEntry: session.entry,
  });
  return {
    ...session,
    run: {
      kind: "isolated",
      sessionKey: isolatedSessionKey,
      baseSessionKey: isolatedBaseSessionKey,
    },
    conversationEntry:
      isolatedBaseSessionKey === session.sessionKey
        ? session.entry
        : loadSessionEntry({
            agentId,
            storePath: session.storePath,
            sessionKey: isolatedBaseSessionKey,
            env,
          }),
    // Legacy isolated queues retain their route after the execution key is canonicalized.
    inspectsRunQueue: session.sessionKey !== isolatedBaseSessionKey,
  };
}

export function resolveStaleHeartbeatIsolatedSessionKey(params: {
  sessionKey: string;
  isolatedSessionKey: string;
  isolatedBaseSessionKey: string;
}) {
  if (params.sessionKey === params.isolatedSessionKey) {
    return undefined;
  }
  return isHeartbeatSessionOf(params.sessionKey, params.isolatedBaseSessionKey)
    ? params.sessionKey
    : undefined;
}

export async function restoreHeartbeatUpdatedAt(params: {
  agentId: string;
  storePath: string;
  sessionKey: string;
  updatedAt?: number;
}) {
  const { updatedAt, ...scope } = params;
  if (typeof updatedAt !== "number") {
    return;
  }
  const entry = loadSessionEntry(scope);
  if (!entry || entry.updatedAt === Math.max(entry.updatedAt ?? 0, updatedAt)) {
    return;
  }
  await patchSessionEntryCore(
    scope,
    (nextEntry, context) => {
      const resolvedUpdatedAt = Math.max(nextEntry.updatedAt ?? 0, updatedAt);
      return context.existingEntry && nextEntry.updatedAt !== resolvedUpdatedAt
        ? { ...nextEntry, updatedAt: resolvedUpdatedAt }
        : null;
    },
    { replaceEntry: true },
  );
}
