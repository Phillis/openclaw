import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { a as listAgentIds, b as tryResolveLegacyCompatibilityAgentId, g as resolveSystemAgentTargetAgentId, p as resolveDefaultAgentId } from "./agent-scope-config-BdXMWufB.js";
import { u as normalizeMainKey } from "./session-key-D8GLfPr_.js";
import { n as resolvePersistedSessionStoreOwnerForKey } from "./session-store-owner-BGbniDph.js";
import "./legacy.default-agent-owner-D8ws5hED.js";
import { t as resolveCanonicalMainSessionKey } from "./main-session-key-D69_dk8f.js";
//#region src/config/sessions/main-session.ts
const FALLBACK_DEFAULT_AGENT_ID = "main";
const SESSION_ROUTING_CHANGED_ERROR_REASON = "session-routing-changed";
/** Builds the canonical main session key for an agent. */
function buildMainSessionKey(agentId, mainKey) {
	return `agent:${normalizeAgentId(agentId)}:${normalizeMainKey(mainKey)}`;
}
/** Resolves the configured main session key, honoring global session scope. */
function resolveMainSessionKey(cfg) {
	return resolveCanonicalMainSessionKey({
		agentId: tryResolveLegacyCompatibilityAgentId(cfg) ?? resolveDefaultAgentId(cfg, {
			surface: "main-session routing",
			hint: "Pass an explicit agent/session key instead of the unscoped main alias."
		}),
		mainKey: cfg.session?.mainKey,
		sessionScope: cfg.session?.scope
	});
}
/** Resolves the owner and canonical session target for ambient system work. */
function resolveSystemMainSessionTarget(cfg) {
	const agentId = resolveSystemAgentTargetAgentId(cfg);
	return {
		agentId,
		sessionKey: resolveCanonicalMainSessionKey({
			agentId,
			mainKey: cfg.session?.mainKey,
			sessionScope: cfg.session?.scope
		})
	};
}
/** Resolves the main session owned by configured ambient system work. */
function resolveSystemMainSessionKey(cfg) {
	return resolveSystemMainSessionTarget(cfg).sessionKey;
}
/** Stable fingerprint for the config values that canonicalize chat session keys. */
function resolveSessionRoutingContract(cfg) {
	const scope = cfg?.session?.scope ?? "per-sender";
	const persistedOwner = scope === "global" ? resolvePersistedSessionStoreOwnerForKey(cfg, "global") : { kind: "none" };
	const routingOwner = persistedOwner.kind === "configured" ? persistedOwner.agentId : persistedOwner.kind === "retired" ? `retired:${persistedOwner.agentId}` : tryResolveLegacyCompatibilityAgentId(cfg) ?? (cfg.agents?.ownership === "explicit" ? "unowned" : listAgentIds(cfg)[0] ?? "main");
	return [
		scope,
		normalizeMainKey(cfg?.session?.mainKey),
		routingOwner
	].join("|");
}
/** Resolves the main session key for one explicit agent. */
function resolveAgentMainSessionKey(params) {
	return buildMainSessionKey(params.agentId, params.cfg?.session?.mainKey);
}
/** Resolves an explicit agent id to its canonical main session key. */
function resolveExplicitAgentSessionKey(params) {
	const agentId = params.agentId?.trim();
	if (!agentId) return;
	return resolveAgentMainSessionKey({
		cfg: params.cfg,
		agentId
	});
}
/** Canonicalizes main-session aliases to the current scoped session key. */
function canonicalizeMainSessionAlias(params) {
	const raw = params.sessionKey.trim();
	if (!raw) return raw;
	const agentId = normalizeAgentId(params.agentId);
	const mainKey = normalizeMainKey(params.cfg?.session?.mainKey);
	const agentMainSessionKey = buildMainSessionKey(agentId, mainKey);
	const agentMainAliasKey = buildMainSessionKey(agentId, "main");
	const legacyMainKey = buildMainSessionKey(FALLBACK_DEFAULT_AGENT_ID, mainKey);
	const legacyMainAliasKey = buildMainSessionKey(FALLBACK_DEFAULT_AGENT_ID, "main");
	const isMainAlias = raw === "main" || raw === mainKey || raw === agentMainSessionKey || raw === agentMainAliasKey || raw === legacyMainKey || raw === legacyMainAliasKey;
	if (params.cfg?.session?.scope === "global" && isMainAlias) return "global";
	if (isMainAlias) return agentMainSessionKey;
	return raw;
}
//#endregion
export { resolveMainSessionKey as a, resolveSystemMainSessionTarget as c, resolveExplicitAgentSessionKey as i, canonicalizeMainSessionAlias as n, resolveSessionRoutingContract as o, resolveAgentMainSessionKey as r, resolveSystemMainSessionKey as s, SESSION_ROUTING_CHANGED_ERROR_REASON as t };
