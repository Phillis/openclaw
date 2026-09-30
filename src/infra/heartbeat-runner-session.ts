import { normalizeLowercaseStringOrEmpty } from "@openclaw/normalization-core/string-coerce";
import {
  listActiveEmbeddedRunSessionIds,
  listActiveEmbeddedRunSessionKeys,
} from "../agents/embedded-agent-runner/active-run-projections.js";
import {
  discoverRestartRecoveryStoreTargets,
  hasCurrentProcessOwner,
  normalizeStringSet,
} from "../agents/main-session-recovery/main-session-restart-recovery-shared.js";
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
import type { OpenClawConfig } from "../config/types.openclaw.js";
import {
  isSubagentSessionKey,
  normalizeAgentId,
  resolveAgentIdFromSessionKey,
  toAgentStoreSessionKey,
} from "../routing/session-key.js";
import { resolveMainScopedEventSessionKey } from "./event-session-routing.js";
import type { HeartbeatConfig } from "./heartbeat-config.js";
import { heartbeatLog } from "./heartbeat-runner-config.js";

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
    statuses: ["running"],
  })) {
    const storeResult = await applySessionEntryReplacements<{ marked: number; skipped: number }>({
      storePath: storeTarget.storePath,
      statuses: ["running"],
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
  const mainSession = (suppressOriginatingContext = false) => ({
    sessionKey: mainSessionKey,
    storePath,
    suppressOriginatingContext,
  });

  if (scope === "global") {
    return mainSession();
  }

  // Guard: never route heartbeats to subagent sessions, regardless of entry path.
  const forced = forcedSessionKey?.trim();
  if (forced && isSubagentSessionKey(forced)) {
    return mainSession(true);
  }

  if (forced && !isSubagentSessionKey(forced)) {
    const forcedCandidate = toAgentStoreSessionKey({
      agentId: resolvedAgentId,
      requestKey: forced,
      mainKey: cfg.session?.mainKey,
    });
    if (!isSubagentSessionKey(forcedCandidate)) {
      const forcedCanonical = canonicalizeMainSessionAlias({
        cfg,
        agentId: resolvedAgentId,
        sessionKey: forcedCandidate,
      });
      if (forcedCanonical !== "global" && !isSubagentSessionKey(forcedCanonical)) {
        const sessionAgentId = resolveAgentIdFromSessionKey(forcedCanonical);
        if (sessionAgentId === normalizeAgentId(resolvedAgentId)) {
          const routedSessionKey =
            resolveMainScopedEventSessionKey({
              cfg,
              sessionKey: forcedCanonical,
              agentId: resolvedAgentId,
            }) ?? forcedCanonical;
          return {
            sessionKey: routedSessionKey,
            storePath,
            suppressOriginatingContext: false,
          };
        }
      }
    }
  }

  const trimmed = heartbeat?.session?.trim() ?? "";
  if (!trimmed || isSubagentSessionKey(trimmed)) {
    return mainSession();
  }

  const normalized = normalizeLowercaseStringOrEmpty(trimmed);
  if (normalized === "main" || normalized === "global") {
    return mainSession();
  }

  const candidate = toAgentStoreSessionKey({
    agentId: resolvedAgentId,
    requestKey: trimmed,
    mainKey: cfg.session?.mainKey,
  });
  if (isSubagentSessionKey(candidate)) {
    return mainSession();
  }
  const canonical = canonicalizeMainSessionAlias({
    cfg,
    agentId: resolvedAgentId,
    sessionKey: candidate,
  });
  if (canonical !== "global" && !isSubagentSessionKey(canonical)) {
    const sessionAgentId = resolveAgentIdFromSessionKey(canonical);
    if (sessionAgentId === normalizeAgentId(resolvedAgentId)) {
      return {
        sessionKey: canonical,
        storePath,
        suppressOriginatingContext: false,
      };
    }
  }

  return mainSession();
}

export function resolveHeartbeatSession(
  cfg: OpenClawConfig,
  agentId: string,
  heartbeat?: HeartbeatConfig,
  forcedSessionKey?: string,
  env: NodeJS.ProcessEnv = process.env,
) {
  const resolved = resolveHeartbeatSessionKey(cfg, agentId, heartbeat, forcedSessionKey, env);
  return {
    ...resolved,
    entry: loadSessionEntry({
      agentId,
      storePath: resolved.storePath,
      sessionKey: resolved.sessionKey,
      env,
    }),
  };
}

// A stored base that itself ends with `:heartbeat` is normally a previously-derived
// isolated base: wake re-entry against a rotated/missing isolated entry falls through
// to the forced-key fallback and re-isolates the already-isolated key, pinning the
// `:heartbeat` key as a permanent base (observed as `X:heartbeat:heartbeat` rows).
// Collapse those back to the real base — but only when the stored base is provably
// derived: its own entry is gone or carries an isolation marker. A live, unmarked
// session that merely ends with `:heartbeat` (e.g. a forced real `alerts:heartbeat`
// lane, or heartbeat.session configured with the suffix, guarded below) stays a
// legitimate base and must not be stripped.
function resolveNonNestedHeartbeatBaseSessionKey(params: {
  storedBaseSessionKey: string;
  configuredSessionKey: string;
  storePath: string;
  env: NodeJS.ProcessEnv;
}): string {
  if (
    !params.storedBaseSessionKey.endsWith(":heartbeat") ||
    params.configuredSessionKey.endsWith(":heartbeat")
  ) {
    return params.storedBaseSessionKey;
  }
  const strippedBaseSessionKey = params.storedBaseSessionKey.replace(/(?::heartbeat)+$/, "");
  if (!strippedBaseSessionKey) {
    return params.storedBaseSessionKey;
  }
  let storedBaseEntry: { heartbeatIsolatedBaseSessionKey?: string } | undefined;
  try {
    storedBaseEntry = loadSessionEntry({
      storePath: params.storePath,
      sessionKey: params.storedBaseSessionKey,
      env: params.env,
    });
  } catch {
    // Unreadable store: keep today's base rather than guessing a collapse.
    return params.storedBaseSessionKey;
  }
  // Only a stored base whose own entry carries an isolation marker is provably a
  // derived run key (execution stamps every isolated entry). A missing or unmarked
  // entry stays a legitimate base: forced real `:heartbeat`-suffixed lanes pin that
  // contract, and collapse-on-missing would steal their identity.
  const baseIsDerived = Boolean(storedBaseEntry?.heartbeatIsolatedBaseSessionKey?.trim());
  return baseIsDerived ? strippedBaseSessionKey : params.storedBaseSessionKey;
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
    const suffix = params.sessionKey.slice(isolatedSessionKey.length);
    if (
      params.sessionKey === "global" ||
      (storedBaseSessionKey === "global" &&
        (params.sessionKey === isolatedSessionKey ||
          (params.sessionKey.startsWith(isolatedSessionKey) && /^(:heartbeat)+$/.test(suffix))))
    ) {
      return { isolatedSessionKey, isolatedBaseSessionKey: "global" };
    }
  }
  if (storedBaseSessionKey) {
    const baseSessionKey = resolveNonNestedHeartbeatBaseSessionKey({
      storedBaseSessionKey,
      configuredSessionKey: params.configuredSessionKey,
      storePath: params.storePath,
      env: params.env,
    });
    const suffix = params.sessionKey.slice(baseSessionKey.length);
    if (
      params.sessionKey.startsWith(baseSessionKey) &&
      suffix.length > 0 &&
      /^(:heartbeat)+$/.test(suffix)
    ) {
      return {
        isolatedSessionKey: `${baseSessionKey}:heartbeat`,
        isolatedBaseSessionKey: baseSessionKey,
      };
    }
  }

  // Collapse repeated `:heartbeat` suffixes introduced by wake-triggered re-entry.
  // The guard on configuredSessionKey ensures we do not strip a legitimate single
  // `:heartbeat` suffix that is part of the user-configured base key itself
  // (e.g. heartbeat.session: "alerts:heartbeat"). When the configured key already
  // ends with `:heartbeat`, a forced wake passes `configuredKey:heartbeat` which
  // must be treated as a new base rather than an existing isolated key.
  const configuredSuffix = params.sessionKey.slice(params.configuredSessionKey.length);
  if (
    params.sessionKey.startsWith(params.configuredSessionKey) &&
    /^(:heartbeat)+$/.test(configuredSuffix) &&
    !params.configuredSessionKey.endsWith(":heartbeat")
  ) {
    return {
      isolatedSessionKey: `${params.configuredSessionKey}:heartbeat`,
      isolatedBaseSessionKey: params.configuredSessionKey,
    };
  }
  return {
    isolatedSessionKey: `${params.sessionKey}:heartbeat`,
    isolatedBaseSessionKey: params.sessionKey,
  };
}

/** Selects the event queue, execution key and descriptive conversation before delivery. */
export function resolveHeartbeatSessionSelection(
  cfg: OpenClawConfig,
  agentId: string,
  heartbeat?: HeartbeatConfig,
  forcedSessionKey?: string,
  env: NodeJS.ProcessEnv = process.env,
) {
  const session = resolveHeartbeatSession(cfg, agentId, heartbeat, forcedSessionKey, env);
  if (heartbeat?.isolatedSession !== true) {
    return {
      ...session,
      run: { kind: "shared", sessionKey: session.sessionKey },
      conversationEntry: session.entry,
      inspectsRunQueue: true,
    } as const;
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
  } as const;
}

export function resolveStaleHeartbeatIsolatedSessionKey(params: {
  sessionKey: string;
  isolatedSessionKey: string;
  isolatedBaseSessionKey: string;
}) {
  if (params.sessionKey === params.isolatedSessionKey) {
    return undefined;
  }
  const suffix = params.sessionKey.slice(params.isolatedBaseSessionKey.length);
  if (
    params.sessionKey.startsWith(params.isolatedBaseSessionKey) &&
    suffix.length > 0 &&
    /^(:heartbeat)+$/.test(suffix)
  ) {
    return params.sessionKey;
  }
  return undefined;
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
