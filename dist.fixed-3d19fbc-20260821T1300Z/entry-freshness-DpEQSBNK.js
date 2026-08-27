import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { f as resolveAgentIdFromSessionKey } from "./session-key-D8GLfPr_.js";
import { o as resolveSessionStorePathCore } from "./paths-CfFmgJmW.js";
import { $t as loadSessionEntryReadOnly, at as getCliSessionBinding } from "./session-accessor-CIiPoGwM.js";
import { o as resolveSessionLifecycleTimestamps } from "./lifecycle-4IbI4BFl.js";
import { a as resolveSessionResetPolicy, i as evaluateSessionFreshness } from "./reset-1TbI4IQQ.js";
//#region src/config/sessions/entry-freshness.ts
function hasProviderOwnedSession(entry) {
	const provider = normalizeOptionalString(entry?.providerOverride ?? entry?.modelProvider);
	return Boolean(provider && getCliSessionBinding(entry, provider));
}
/** Resolves one session entry's reset freshness using the runtime lifecycle rules. */
function resolveSessionEntryResetFreshness(params) {
	const agentId = params.agentId ?? resolveAgentIdFromSessionKey(params.sessionKey, params.defaultAgentId);
	const sessionCfg = params.sessionCfg;
	const storePath = params.storePath ?? resolveSessionStorePathCore(sessionCfg?.store, {
		agentId,
		env: params.env
	});
	const entry = loadSessionEntryReadOnly({
		...params,
		agentId,
		storePath
	});
	const resetType = params.resetType;
	const resetPolicy = resolveSessionResetPolicy({
		sessionCfg,
		resetType,
		resetOverride: params.resetOverride
	});
	const lifecycleTimestamps = resolveSessionLifecycleTimestamps({
		entry,
		agentId,
		sessionKey: params.sessionKey,
		storePath
	});
	const base = {
		lifecycleTimestamps,
		resetPolicy,
		resetType
	};
	if (!entry) return {
		state: "missing",
		entry: void 0,
		freshness: void 0,
		...base
	};
	const freshness = resetPolicy.configured !== true && hasProviderOwnedSession(entry) ? { fresh: true } : evaluateSessionFreshness({
		updatedAt: entry.updatedAt,
		sessionStartedAt: lifecycleTimestamps.sessionStartedAt,
		lastInteractionAt: lifecycleTimestamps.lastInteractionAt,
		now: params.now ?? Date.now(),
		policy: resetPolicy
	});
	return {
		state: freshness.fresh ? "fresh" : "stale",
		entry,
		freshness,
		...base
	};
}
//#endregion
export { resolveSessionEntryResetFreshness as n, hasProviderOwnedSession as t };
