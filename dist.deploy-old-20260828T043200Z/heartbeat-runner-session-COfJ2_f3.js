import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
import { a as isSubagentSessionKey } from "./session-key-utils-Di3FvABa.js";
import { b as toAgentStoreSessionKey, f as resolveAgentIdFromSessionKey } from "./session-key-Dbce_H9p.js";
import { o as resolveSessionStorePathCore } from "./paths-DVAvlIOc.js";
import { n as canonicalizeMainSessionAlias, r as resolveAgentMainSessionKey } from "./main-session-CPkeRwvL.js";
import { f as loadSessionEntry, m as patchSessionEntryCore } from "./session-accessor.sqlite-entry-CNdoUuFZ.js";
import "./session-accessor-B-FKZX9M.js";
import { r as resolveMainScopedEventSessionKey } from "./event-session-routing-CPkIEuBm.js";
//#region src/infra/heartbeat-runner-session.ts
function resolveHeartbeatSessionKey(cfg, agentId, heartbeat, forcedSessionKey, env = process.env) {
	const sessionCfg = cfg.session;
	const scope = sessionCfg?.scope ?? "per-sender";
	const resolvedAgentId = normalizeAgentId(agentId);
	const mainSessionKey = scope === "global" ? "global" : resolveAgentMainSessionKey({
		cfg,
		agentId: resolvedAgentId
	});
	const storePath = resolveSessionStorePathCore(sessionCfg?.store, {
		agentId: resolvedAgentId,
		env
	});
	const mainSession = (suppressOriginatingContext = false) => ({
		sessionKey: mainSessionKey,
		storePath,
		suppressOriginatingContext
	});
	if (scope === "global") return mainSession();
	const forced = forcedSessionKey?.trim();
	if (forced && isSubagentSessionKey(forced)) return mainSession(true);
	if (forced && !isSubagentSessionKey(forced)) {
		const forcedCandidate = toAgentStoreSessionKey({
			agentId: resolvedAgentId,
			requestKey: forced,
			mainKey: cfg.session?.mainKey
		});
		if (!isSubagentSessionKey(forcedCandidate)) {
			const forcedCanonical = canonicalizeMainSessionAlias({
				cfg,
				agentId: resolvedAgentId,
				sessionKey: forcedCandidate
			});
			if (forcedCanonical !== "global" && !isSubagentSessionKey(forcedCanonical)) {
				if (resolveAgentIdFromSessionKey(forcedCanonical) === normalizeAgentId(resolvedAgentId)) return {
					sessionKey: resolveMainScopedEventSessionKey({
						cfg,
						sessionKey: forcedCanonical,
						agentId: resolvedAgentId
					}) ?? forcedCanonical,
					storePath,
					suppressOriginatingContext: false
				};
			}
		}
	}
	const trimmed = heartbeat?.session?.trim() ?? "";
	if (!trimmed || isSubagentSessionKey(trimmed)) return mainSession();
	const normalized = normalizeLowercaseStringOrEmpty(trimmed);
	if (normalized === "main" || normalized === "global") return mainSession();
	const candidate = toAgentStoreSessionKey({
		agentId: resolvedAgentId,
		requestKey: trimmed,
		mainKey: cfg.session?.mainKey
	});
	if (isSubagentSessionKey(candidate)) return mainSession();
	const canonical = canonicalizeMainSessionAlias({
		cfg,
		agentId: resolvedAgentId,
		sessionKey: candidate
	});
	if (canonical !== "global" && !isSubagentSessionKey(canonical)) {
		if (resolveAgentIdFromSessionKey(canonical) === normalizeAgentId(resolvedAgentId)) return {
			sessionKey: canonical,
			storePath,
			suppressOriginatingContext: false
		};
	}
	return mainSession();
}
function resolveHeartbeatSession(cfg, agentId, heartbeat, forcedSessionKey, env = process.env) {
	const resolved = resolveHeartbeatSessionKey(cfg, agentId, heartbeat, forcedSessionKey, env);
	return {
		...resolved,
		entry: loadSessionEntry({
			storePath: resolved.storePath,
			sessionKey: resolved.sessionKey,
			env
		})
	};
}
function resolveIsolatedHeartbeatSessionKey(params) {
	const storedBaseSessionKey = params.sessionEntry?.heartbeatIsolatedBaseSessionKey?.trim();
	if (params.configuredSessionKey === "global") {
		const isolatedSessionKey = toAgentStoreSessionKey({
			agentId: params.agentId,
			requestKey: "global:heartbeat"
		});
		const suffix = params.sessionKey.slice(isolatedSessionKey.length);
		if (params.sessionKey === "global" || storedBaseSessionKey === "global" && (params.sessionKey === isolatedSessionKey || params.sessionKey.startsWith(isolatedSessionKey) && /^(:heartbeat)+$/.test(suffix))) return {
			isolatedSessionKey,
			isolatedBaseSessionKey: "global"
		};
	}
	if (storedBaseSessionKey) {
		const suffix = params.sessionKey.slice(storedBaseSessionKey.length);
		if (params.sessionKey.startsWith(storedBaseSessionKey) && suffix.length > 0 && /^(:heartbeat)+$/.test(suffix)) return {
			isolatedSessionKey: `${storedBaseSessionKey}:heartbeat`,
			isolatedBaseSessionKey: storedBaseSessionKey
		};
	}
	const configuredSuffix = params.sessionKey.slice(params.configuredSessionKey.length);
	if (params.sessionKey.startsWith(params.configuredSessionKey) && /^(:heartbeat)+$/.test(configuredSuffix) && !params.configuredSessionKey.endsWith(":heartbeat")) return {
		isolatedSessionKey: `${params.configuredSessionKey}:heartbeat`,
		isolatedBaseSessionKey: params.configuredSessionKey
	};
	return {
		isolatedSessionKey: `${params.sessionKey}:heartbeat`,
		isolatedBaseSessionKey: params.sessionKey
	};
}
function resolveStaleHeartbeatIsolatedSessionKey(params) {
	if (params.sessionKey === params.isolatedSessionKey) return;
	const suffix = params.sessionKey.slice(params.isolatedBaseSessionKey.length);
	if (params.sessionKey.startsWith(params.isolatedBaseSessionKey) && suffix.length > 0 && /^(:heartbeat)+$/.test(suffix)) return params.sessionKey;
}
async function restoreHeartbeatUpdatedAt(params) {
	const { storePath, sessionKey, updatedAt } = params;
	if (typeof updatedAt !== "number") return;
	const entry = loadSessionEntry({
		storePath,
		sessionKey
	});
	if (!entry) return;
	const nextUpdatedAt = Math.max(entry.updatedAt ?? 0, updatedAt);
	if (entry.updatedAt === nextUpdatedAt) return;
	await patchSessionEntryCore({
		storePath,
		sessionKey
	}, (nextEntry, context) => {
		if (!context.existingEntry) return null;
		const resolvedUpdatedAt = Math.max(nextEntry.updatedAt ?? 0, updatedAt);
		if (nextEntry.updatedAt === resolvedUpdatedAt) return null;
		return {
			...nextEntry,
			updatedAt: resolvedUpdatedAt
		};
	}, { replaceEntry: true });
}
//#endregion
export { restoreHeartbeatUpdatedAt as a, resolveStaleHeartbeatIsolatedSessionKey as i, resolveHeartbeatSessionKey as n, resolveIsolatedHeartbeatSessionKey as r, resolveHeartbeatSession as t };
