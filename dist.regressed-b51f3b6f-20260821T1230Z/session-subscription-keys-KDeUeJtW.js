import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
//#region src/gateway/session-subscription-keys.ts
function resolveSessionSubscriptionKey(sessionKey, agentId) {
	return normalizeLowercaseStringOrEmpty(sessionKey) === "global" ? `agent:${normalizeAgentId(agentId)}:global` : sessionKey;
}
function resolveSessionSubscriptionKeys(sessionKey, agentId, defaultAgentId) {
	const canonicalKey = resolveSessionSubscriptionKey(sessionKey, agentId);
	return defaultAgentId && normalizeLowercaseStringOrEmpty(sessionKey) === "global" && normalizeAgentId(agentId) === normalizeAgentId(defaultAgentId) ? [canonicalKey, "global"] : [canonicalKey];
}
//#endregion
export { resolveSessionSubscriptionKeys as n, resolveSessionSubscriptionKey as t };
