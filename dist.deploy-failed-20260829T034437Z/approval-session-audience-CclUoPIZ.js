import "./agent-scope-DigoIwHb.js";
import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
import { g as resolveDefaultAgentId } from "./agent-scope-config-CUBiGmG3.js";
import { c as parseAgentSessionKey } from "./session-key-utils-Di3FvABa.js";
import { n as getRuntimeConfig } from "./io-DlN5njvP.js";
import { n as resolveSessionStoreAgentId, r as resolveSessionStoreKey } from "./session-store-key-DRF7yKG5.js";
import { p as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-CNdoUuFZ.js";
import "./session-accessor-B-FKZX9M.js";
import { t as buildLatestSubagentRunReadIndex } from "./subagent-registry-read-kfj2Ed2f.js";
import "./operator-approval-store-BY5ymuaJ.js";
//#region src/gateway/approval-session-audience.ts
const MAX_APPROVAL_AUDIENCE_SESSIONS = 64;
function canonicalizeAudienceSessionKey(sources, sessionKey, relativeToSessionKey) {
	const raw = sessionKey?.trim();
	if (!raw) return null;
	return sources.canonicalizeSessionKey(raw, relativeToSessionKey)?.trim() || null;
}
/** Resolves the source session and its operator-visible ancestor audience. */
function resolveApprovalSessionAudienceFromSources(params) {
	const sourceSessionKey = canonicalizeAudienceSessionKey(params.sources, params.sourceSessionKey);
	if (!sourceSessionKey) return [];
	const audience = [];
	const queued = /* @__PURE__ */ new Set([sourceSessionKey]);
	const pending = [sourceSessionKey];
	const enqueue = (sessionKey) => {
		if (!sessionKey || queued.has(sessionKey) || pending.length >= MAX_APPROVAL_AUDIENCE_SESSIONS) return;
		queued.add(sessionKey);
		pending.push(sessionKey);
	};
	for (const sessionKey of pending) {
		audience.push(sessionKey);
		const subagentLineage = params.sources.getLatestSubagentLineage(sessionKey);
		const registryParents = [canonicalizeAudienceSessionKey(params.sources, subagentLineage?.controllerSessionKey, sessionKey), canonicalizeAudienceSessionKey(params.sources, subagentLineage?.requesterSessionKey, sessionKey)].filter((candidate) => Boolean(candidate));
		if (registryParents.length > 0) {
			for (const parentSessionKey of registryParents) enqueue(parentSessionKey);
			continue;
		}
		const storedLineage = params.sources.getStoredSessionLineage(sessionKey);
		const parentSessionKey = storedLineage?.parentSessionKey?.trim() ? storedLineage.parentSessionKey : storedLineage?.spawnedBy;
		enqueue(canonicalizeAudienceSessionKey(params.sources, parentSessionKey, sessionKey));
	}
	return audience;
}
function createRuntimeApprovalSessionAudienceSources(cfg, sourceAgentId) {
	const subagentRuns = buildLatestSubagentRunReadIndex();
	const resolveStorageTarget = (sessionKey) => {
		const parsed = parseAgentSessionKey(sessionKey);
		if (parsed?.rest.toLowerCase() === "global") return {
			agentId: normalizeAgentId(parsed.agentId),
			sessionKey: "global"
		};
		return {
			agentId: resolveSessionStoreAgentId(cfg, sessionKey),
			sessionKey
		};
	};
	return {
		canonicalizeSessionKey: (sessionKey, relativeToSessionKey) => {
			if (!relativeToSessionKey) return canonicalizeApprovalSourceStreamKey(cfg, sessionKey, sourceAgentId);
			const relativeAgentId = resolveSessionStoreAgentId(cfg, relativeToSessionKey);
			const canonical = resolveSessionStoreKey({
				cfg,
				sessionKey,
				storeAgentId: relativeAgentId
			});
			return canonical ? resolveApprovalSourceStreamKey(canonical, relativeAgentId) : canonical;
		},
		getLatestSubagentLineage: (sessionKey) => subagentRuns.getLatestSubagentRun(sessionKey),
		getStoredSessionLineage: (sessionKey) => {
			const target = resolveStorageTarget(sessionKey);
			return loadSessionEntryReadOnly({
				agentId: target.agentId,
				clone: false,
				hydrateSkillPromptRefs: false,
				sessionKey: target.sessionKey
			});
		}
	};
}
/** Resolves an approval audience from the live registry and session stores. */
function resolveApprovalSessionAudience(sourceSessionKey, sourceAgentId) {
	return resolveApprovalSessionAudienceFromSources({
		sourceSessionKey,
		sources: createRuntimeApprovalSessionAudienceSources(getRuntimeConfig(), sourceAgentId)
	});
}
/** Canonicalize one source key against config: agent scoping, main-key aliases, global sentinel. */
function canonicalizeApprovalSourceStreamKey(cfg, sessionKey, sourceAgentId) {
	const ownerAgentId = normalizeAgentId(sourceAgentId ?? resolveDefaultAgentId(cfg));
	const lowered = sessionKey.trim().toLowerCase();
	return resolveApprovalSourceStreamKey(resolveSessionStoreKey({
		cfg,
		sessionKey: parseAgentSessionKey(sessionKey) || lowered === "global" || lowered === "unknown" ? sessionKey : `agent:${ownerAgentId}:${sessionKey}`
	}), ownerAgentId);
}
/**
* Fallback audience key when the lineage walk fails. Config-only
* canonicalization (agent scope, configured main-key aliases) still applies
* when the config loads; the pure-string form is the true last resort.
*/
/** Non-throwing audience resolver for injection into the approval manager.
* Lineage is routing metadata, not an approval safety prerequisite; when
* session stores are unavailable this preserves the agent-scoped source. */
function resolveApprovalSessionAudienceWithFallback(sourceSessionKey, sourceAgentId) {
	try {
		return resolveApprovalSessionAudience(sourceSessionKey, sourceAgentId);
	} catch {
		return [resolveApprovalFallbackAudienceSessionKey(sourceSessionKey, sourceAgentId)];
	}
}
function resolveApprovalFallbackAudienceSessionKey(sourceSessionKey, sourceAgentId) {
	try {
		return canonicalizeApprovalSourceStreamKey(getRuntimeConfig(), sourceSessionKey, sourceAgentId);
	} catch {
		return resolveApprovalSourceStreamKey(sourceSessionKey, sourceAgentId);
	}
}
/** Best-effort stream key used when lineage lookup is unavailable. */
function resolveApprovalSourceStreamKey(sourceSessionKey, sourceAgentId) {
	const normalizedSessionKey = sourceSessionKey.trim();
	const lowered = normalizedSessionKey.toLowerCase();
	if (!sourceAgentId || lowered === "unknown" || parseAgentSessionKey(normalizedSessionKey)) return normalizedSessionKey;
	const agentId = normalizeAgentId(sourceAgentId);
	return lowered === "global" ? `agent:${agentId}:global` : `agent:${agentId}:${normalizedSessionKey}`;
}
//#endregion
export { resolveApprovalSourceStreamKey as n, resolveApprovalSessionAudienceWithFallback as t };
