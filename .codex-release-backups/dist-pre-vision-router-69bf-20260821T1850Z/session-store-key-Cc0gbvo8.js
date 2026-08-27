import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import "./agent-scope-D9GLFAyB.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { a as listAgentIds, b as tryResolveLegacyCompatibilityAgentId, t as AgentSelectionRequiredError } from "./agent-scope-config-CsnnOL14.js";
import { c as parseAgentSessionKey, o as normalizeSessionKeyPreservingOpaquePeerIds } from "./session-key-utils-D8x_bjrd.js";
import { u as normalizeMainKey } from "./session-key-D8GLfPr_.js";
import { n as resolvePersistedSessionStoreOwnerForKey } from "./session-store-owner-CLtsGq3M.js";
import "./legacy.default-agent-owner-0YGX8Nyg.js";
import { n as canonicalizeMainSessionAlias, r as resolveAgentMainSessionKey } from "./main-session-Dth0X5B9.js";
//#region src/gateway/session-store-key.ts
/** Canonicalize an opaque session key into the agent-scoped store namespace. */
function canonicalizeSessionKeyForAgent(agentId, key) {
	const lowered = normalizeLowercaseStringOrEmpty(key);
	if (lowered === "global" || lowered === "unknown") return lowered;
	const normalized = normalizeSessionKeyPreservingOpaquePeerIds(key);
	if (normalized.startsWith("agent:")) return normalized;
	return `agent:${normalizeAgentId(agentId)}:${normalized}`;
}
function resolveLogicalSessionStoreAgentId(cfg, sessionKey) {
	const persistedOwner = resolvePersistedSessionStoreOwnerForKey(cfg, sessionKey);
	if (persistedOwner.kind === "configured") return persistedOwner.agentId;
	if (persistedOwner.kind === "retired") throw new AgentSelectionRequiredError(listAgentIds(cfg), {
		surface: `session key "${sessionKey}"`,
		hint: `Its recorded owner "${persistedOwner.agentId}" is no longer configured. Select a configured agent explicitly.`
	});
	const compatibilityAgentId = tryResolveLegacyCompatibilityAgentId(cfg);
	if (compatibilityAgentId) return normalizeAgentId(compatibilityAgentId);
	throw new AgentSelectionRequiredError(listAgentIds(cfg), {
		surface: `session key "${sessionKey}"`,
		hint: "Use an agent-prefixed session key or select an agent explicitly."
	});
}
function shouldRemapLegacyDefaultMainAlias(cfg, parsed, options) {
	if (normalizeAgentId(parsed.agentId) !== "main" || listAgentIds(cfg).includes("main")) return false;
	const rest = normalizeLowercaseStringOrEmpty(parsed.rest);
	const mainKey = normalizeMainKey(cfg.session?.mainKey);
	if (rest !== "main" && rest !== mainKey) return false;
	if (options?.storeAgentId) return true;
	resolveLogicalSessionStoreAgentId(cfg, "main");
	return true;
}
function resolveParsedSessionStoreKey(cfg, raw, parsed, options) {
	if (!shouldRemapLegacyDefaultMainAlias(cfg, parsed, options)) return {
		agentId: normalizeAgentId(parsed.agentId),
		sessionKey: normalizeSessionKeyPreservingOpaquePeerIds(raw)
	};
	const agentId = options?.storeAgentId ? normalizeAgentId(options.storeAgentId) : resolveLogicalSessionStoreAgentId(cfg, "main");
	return {
		agentId,
		sessionKey: `agent:${agentId}:${normalizeLowercaseStringOrEmpty(parsed.rest)}`
	};
}
/** Resolve any incoming session key into the canonical key used in persisted session stores. */
function resolveSessionStoreKey(params) {
	const raw = normalizeOptionalString(params.sessionKey) ?? "";
	if (!raw) return raw;
	const rawLower = normalizeLowercaseStringOrEmpty(raw);
	if (rawLower === "global" || rawLower === "unknown") return rawLower;
	const parsed = parseAgentSessionKey(raw);
	if (parsed) {
		const resolved = resolveParsedSessionStoreKey(params.cfg, raw, parsed, { storeAgentId: params.storeAgentId });
		const canonical = canonicalizeMainSessionAlias({
			cfg: params.cfg,
			agentId: resolved.agentId,
			sessionKey: resolved.sessionKey
		});
		if (canonical !== resolved.sessionKey) return canonical;
		return resolved.sessionKey;
	}
	const lowered = normalizeLowercaseStringOrEmpty(raw);
	const rawMainKey = normalizeMainKey(params.cfg.session?.mainKey);
	const storeAgentId = params.storeAgentId ? normalizeAgentId(params.storeAgentId) : void 0;
	if (lowered === "main" || lowered === rawMainKey) {
		if (params.cfg.session?.scope === "global") return "global";
		return resolveAgentMainSessionKey({
			cfg: params.cfg,
			agentId: storeAgentId ?? resolveLogicalSessionStoreAgentId(params.cfg, raw)
		});
	}
	return canonicalizeSessionKeyForAgent(storeAgentId ?? resolveLogicalSessionStoreAgentId(params.cfg, raw), raw);
}
/** Resolve the agent that owns a canonical session-store key. */
function resolveSessionStoreAgentId(cfg, canonicalKey) {
	if (canonicalKey === "global" || canonicalKey === "unknown") return resolveLogicalSessionStoreAgentId(cfg, canonicalKey);
	const parsed = parseAgentSessionKey(canonicalKey);
	if (parsed?.agentId) return normalizeAgentId(parsed.agentId);
	return resolveLogicalSessionStoreAgentId(cfg, canonicalKey);
}
/** Resolve a session key for lookup inside a specific agent's store. */
function resolveStoredSessionKeyForAgentStore(params) {
	const raw = normalizeOptionalString(params.sessionKey) ?? "";
	if (!raw) return raw;
	const lowered = normalizeLowercaseStringOrEmpty(raw);
	if (lowered === "global" || lowered === "unknown") return lowered;
	const persistedOwner = resolvePersistedSessionStoreOwnerForKey(params.cfg, raw);
	if (!parseAgentSessionKey(raw) && persistedOwner.kind === "configured" && persistedOwner.agentId === normalizeAgentId(params.agentId) && lowered !== "main" && lowered !== normalizeMainKey(params.cfg.session?.mainKey)) return raw;
	const key = parseAgentSessionKey(raw) ? raw : canonicalizeSessionKeyForAgent(params.agentId, raw);
	return resolveSessionStoreKey({
		cfg: params.cfg,
		sessionKey: key,
		storeAgentId: params.agentId
	});
}
/** Resolve the owner agent for a stored session key, returning null for global/unknown keys. */
function resolveStoredSessionOwnerAgentId(params) {
	const canonicalKey = resolveStoredSessionKeyForAgentStore(params);
	if (canonicalKey === "global" || canonicalKey === "unknown") return null;
	return resolveSessionStoreAgentId(params.cfg, canonicalKey);
}
//#endregion
export { resolveStoredSessionOwnerAgentId as a, resolveStoredSessionKeyForAgentStore as i, resolveSessionStoreAgentId as n, resolveSessionStoreKey as r, canonicalizeSessionKeyForAgent as t };
