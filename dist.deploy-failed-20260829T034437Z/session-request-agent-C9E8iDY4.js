import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { x as resolvePersistedSessionStoreOwnerForKey } from "./agent-scope-DigoIwHb.js";
import { n as normalizeAgentId, r as normalizeAgentIdStrict } from "./agent-id-CeT3w4ap.js";
import { C as tryResolveLegacyCompatibilityAgentId, a as listAgentIds, t as AgentSelectionRequiredError } from "./agent-scope-config-CUBiGmG3.js";
import { c as parseAgentSessionKey } from "./session-key-utils-Di3FvABa.js";
import { u as normalizeMainKey } from "./session-key-Dbce_H9p.js";
import "./legacy.default-agent-owner-CL_-T11Y.js";
import { t as ErrorCodes } from "./gateway-error-details-C2IaYyht.js";
import { d as errorShape } from "./validation-errors-rELRlKfn.js";
//#region src/gateway/session-subscription-keys.ts
function resolveSessionSubscriptionKey(sessionKey, agentId) {
	return normalizeLowercaseStringOrEmpty(sessionKey) === "global" ? `agent:${normalizeAgentId(agentId)}:global` : sessionKey;
}
function resolveSessionSubscriptionKeys(sessionKey, agentId, defaultAgentId) {
	const canonicalKey = resolveSessionSubscriptionKey(sessionKey, agentId);
	return defaultAgentId && normalizeLowercaseStringOrEmpty(sessionKey) === "global" && normalizeAgentId(agentId) === normalizeAgentId(defaultAgentId) ? [canonicalKey, "global"] : [canonicalKey];
}
//#endregion
//#region src/gateway/session-request-agent.ts
/** Resolves public event identity separately from private session routing ownership. */
function resolveSessionEventAgentScope(cfg, key, explicitAgentId, publishQualifiedAgent = false) {
	const parsed = parseAgentSessionKey(key.trim());
	const keyAgentId = parsed?.agentId ? normalizeAgentId(parsed.agentId) : void 0;
	const explicit = explicitAgentId === void 0 ? null : normalizeAgentIdStrict(explicitAgentId);
	if (explicit !== null && !explicit.ok) return null;
	if (explicit?.value && keyAgentId && explicit.value !== keyAgentId) return null;
	const persistedOwner = resolvePersistedSessionStoreOwnerForKey(cfg, key);
	const compatibilityOwnerAgentId = keyAgentId ? void 0 : tryResolveSessionCompatibilityOwnerAgentId(cfg, key);
	return [
		explicit?.value ?? (publishQualifiedAgent && keyAgentId && listAgentIds(cfg).includes(keyAgentId) ? keyAgentId : void 0),
		explicit?.value ?? keyAgentId ?? compatibilityOwnerAgentId ?? (persistedOwner.kind === "retired" ? persistedOwner.agentId : void 0),
		compatibilityOwnerAgentId
	];
}
/** Binds a retired unqualified owner to its private sharing scope. */
function resolvePrivateSessionEventBroadcastScope(key, [eventAgentId, routingAgentId, compatibilityOwnerAgentId]) {
	return key && !parseAgentSessionKey(key) && !eventAgentId && routingAgentId && !compatibilityOwnerAgentId ? {
		agentId: routingAgentId,
		sessionKeys: resolveSessionSubscriptionKeys(key, routingAgentId)
	} : void 0;
}
/** Resolves only stable implicit ownership for unscoped session rows and active runs. */
function tryResolveSessionCompatibilityOwnerAgentId(cfg, key) {
	const persistedStoreOwner = resolvePersistedSessionStoreOwnerForKey(cfg, key);
	if (persistedStoreOwner.kind === "configured") return persistedStoreOwner.agentId;
	return persistedStoreOwner.kind === "retired" ? void 0 : tryResolveLegacyCompatibilityAgentId(cfg);
}
function resolveRequestedSessionAgentId(cfg, key, explicitAgentId) {
	const parsed = parseAgentSessionKey(key.trim());
	const configuredAgentIds = listAgentIds(cfg);
	const normalizedRequest = explicitAgentId === void 0 ? null : normalizeAgentIdStrict(explicitAgentId);
	if (normalizedRequest && !normalizedRequest.ok) return {
		ok: false,
		error: errorShape(ErrorCodes.INVALID_REQUEST, `Unknown agent id "${explicitAgentId}"`)
	};
	const normalizedRequestedAgentId = normalizedRequest?.value;
	if (normalizedRequestedAgentId && !configuredAgentIds.includes(normalizedRequestedAgentId)) return {
		ok: false,
		error: errorShape(ErrorCodes.INVALID_REQUEST, `Unknown agent id "${explicitAgentId}"`)
	};
	if (parsed?.agentId) {
		const keyAgentId = normalizeAgentId(parsed.agentId);
		if (cfg.session?.scope === "global" && (parsed.rest === "main" || parsed.rest === normalizeMainKey(cfg.session?.mainKey)) && !configuredAgentIds.includes(keyAgentId)) return {
			ok: false,
			error: errorShape(ErrorCodes.INVALID_REQUEST, `Unknown agent id "${parsed.agentId}"`)
		};
		if (normalizedRequestedAgentId && keyAgentId !== normalizedRequestedAgentId) return {
			ok: false,
			error: errorShape(ErrorCodes.INVALID_REQUEST, `agent "${explicitAgentId}" does not match session key agent "${keyAgentId}"`)
		};
		return {
			ok: true,
			agentId: keyAgentId
		};
	}
	const persistedStoreOwner = resolvePersistedSessionStoreOwnerForKey(cfg, key);
	if (persistedStoreOwner.kind === "retired") return {
		ok: false,
		error: errorShape(ErrorCodes.INVALID_REQUEST, `session key belongs to retired agent "${persistedStoreOwner.agentId}"`)
	};
	if (normalizedRequestedAgentId) {
		if (persistedStoreOwner.kind === "configured" && persistedStoreOwner.agentId !== normalizedRequestedAgentId) return {
			ok: false,
			error: errorShape(ErrorCodes.INVALID_REQUEST, `agent "${explicitAgentId}" does not match session key agent "${persistedStoreOwner.agentId}"`)
		};
		return {
			ok: true,
			agentId: normalizedRequestedAgentId
		};
	}
	const inferredAgentId = tryResolveSessionCompatibilityOwnerAgentId(cfg, key);
	if (inferredAgentId) return {
		ok: true,
		agentId: inferredAgentId
	};
	const selectionError = new AgentSelectionRequiredError(configuredAgentIds, {
		surface: `session key "${key}"`,
		hint: "Pass agentId or use an agent-prefixed session key."
	});
	return {
		ok: false,
		error: errorShape(ErrorCodes.INVALID_REQUEST, selectionError.message)
	};
}
//#endregion
export { resolveSessionSubscriptionKey as a, tryResolveSessionCompatibilityOwnerAgentId as i, resolveRequestedSessionAgentId as n, resolveSessionSubscriptionKeys as o, resolveSessionEventAgentScope as r, resolvePrivateSessionEventBroadcastScope as t };
