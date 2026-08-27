import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import "./agent-scope-BizOtGGz.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { a as listAgentIds, b as tryResolveLegacyCompatibilityAgentId, t as AgentSelectionRequiredError } from "./agent-scope-config-BdXMWufB.js";
import { c as parseAgentSessionKey } from "./session-key-utils-D8x_bjrd.js";
import { u as normalizeMainKey } from "./session-key-D8GLfPr_.js";
import { n as resolvePersistedSessionStoreOwnerForKey } from "./session-store-owner-BGbniDph.js";
import "./legacy.default-agent-owner-D8ws5hED.js";
import { t as ErrorCodes } from "./gateway-error-details-BWo6Le6w.js";
import { s as errorShape } from "./error-codes-CMSvT5-d.js";
//#region src/gateway/session-request-agent.ts
/** Resolves only stable implicit ownership for unscoped session rows and active runs. */
function tryResolveSessionCompatibilityOwnerAgentId(cfg, key) {
	const persistedStoreOwner = resolvePersistedSessionStoreOwnerForKey(cfg, key);
	if (persistedStoreOwner.kind === "configured") return persistedStoreOwner.agentId;
	return persistedStoreOwner.kind === "retired" ? void 0 : tryResolveLegacyCompatibilityAgentId(cfg);
}
function resolveRequestedSessionAgentId(cfg, key, explicitAgentId, options) {
	const parsed = parseAgentSessionKey(key.trim());
	const requestedAgentId = normalizeOptionalString(explicitAgentId);
	const configuredAgentIds = listAgentIds(cfg);
	const normalizedRequestedAgentId = requestedAgentId ? normalizeAgentId(requestedAgentId) : void 0;
	if (normalizedRequestedAgentId && !options?.allowUnconfiguredExplicitAgent && !configuredAgentIds.includes(normalizedRequestedAgentId)) return {
		ok: false,
		error: errorShape(ErrorCodes.INVALID_REQUEST, `Unknown agent id "${explicitAgentId}"`)
	};
	if (parsed?.agentId) {
		const keyAgentId = normalizeAgentId(parsed.agentId);
		if (cfg.session?.scope === "global" && (parsed.rest === "main" || parsed.rest === normalizeMainKey(cfg.session?.mainKey)) && !options?.allowUnconfiguredExplicitAgent && !configuredAgentIds.includes(keyAgentId)) return {
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
export { tryResolveSessionCompatibilityOwnerAgentId as n, resolveRequestedSessionAgentId as t };
