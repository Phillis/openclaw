import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { t as pruneMapToMaxSize } from "./map-size-DAGm21RM.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { n as normalizeMessageChannel } from "./message-channel-core-BDhVfGhd.js";
import { t as isDeliverableMessageChannel } from "./message-channel-normalize-rAbqRXlG.js";
import { randomBytes } from "node:crypto";
//#region src/gateway/message-action-turn-capability.ts
const DEFAULT_TTL_MS = 15 * 6e4;
const MAX_TTL_MS = 1440 * 6e4;
const MAX_ACTIVE_CAPABILITIES = 4096;
const RUN_LIFETIME_EXPIRES_AT_MS = Number.MAX_SAFE_INTEGER;
const CAPABILITY_COMPLETION_GRACE_MS = 6e4;
const capabilitiesByToken = /* @__PURE__ */ new Map();
function isTrustedMessageActionTurnIngress(provider) {
	const normalized = normalizeMessageChannel(provider);
	return normalized !== void 0 && isDeliverableMessageChannel(normalized);
}
function resolveTtlMs(value) {
	if (!Number.isFinite(value) || value === void 0 || value <= 0) return DEFAULT_TTL_MS;
	return Math.min(Math.trunc(value), MAX_TTL_MS);
}
/** Mirrors agent timeout semantics while leaving unlimited runs to explicit revocation. */
function resolveMessageActionTurnCapabilityLifetime(timeoutMs) {
	return Number.isFinite(timeoutMs) && timeoutMs > 0 ? { ttlMs: timeoutMs + CAPABILITY_COMPLETION_GRACE_MS } : { expiresWithRun: true };
}
function copyToolContext(context) {
	if (!context) return;
	return {
		currentChannelId: normalizeOptionalString(context.currentChannelId),
		currentChatType: context.currentChatType,
		currentMessagingTarget: normalizeOptionalString(context.currentMessagingTarget),
		currentGraphChannelId: normalizeOptionalString(context.currentGraphChannelId),
		currentChannelProvider: context.currentChannelProvider,
		currentThreadTs: normalizeOptionalString(context.currentThreadTs),
		currentMessageId: context.currentMessageId,
		currentSourceTurnId: normalizeOptionalString(context.currentSourceTurnId),
		replyToMode: context.replyToMode,
		hasRepliedRef: context.hasRepliedRef,
		sameChannelThreadRequired: context.sameChannelThreadRequired,
		skipCrossContextDecoration: context.skipCrossContextDecoration
	};
}
function sweepExpiredMessageActionTurnCapabilities(nowMs = Date.now()) {
	let removed = 0;
	for (const [token, capability] of capabilitiesByToken) if (nowMs >= capability.expiresAtMs) {
		capabilitiesByToken.delete(token);
		removed += 1;
	}
	return removed;
}
/**
* Mint an opaque current-turn capability from trusted channel ingress.
* Public Gateway agent requests never receive this token.
*/
function mintMessageActionTurnCapability(params) {
	const agentId = normalizeAgentId(params.agentId);
	const runId = params.runId.trim();
	const sessionKey = params.sessionKey.trim();
	if (!agentId || !runId || !sessionKey) throw new Error("message action turn capability requires agent, run, and session identity");
	const nowMs = params.nowMs ?? Date.now();
	sweepExpiredMessageActionTurnCapabilities(nowMs);
	pruneMapToMaxSize(capabilitiesByToken, MAX_ACTIVE_CAPABILITIES - 1);
	const token = randomBytes(32).toString("base64url");
	capabilitiesByToken.set(token, {
		agentId,
		runId,
		sessionKey,
		expiresAtMs: params.expiresWithRun ? RUN_LIFETIME_EXPIRES_AT_MS : nowMs + resolveTtlMs(params.ttlMs),
		sessionId: normalizeOptionalString(params.sessionId),
		sourceReplySessionKey: normalizeOptionalString(params.sourceReplySessionKey),
		requesterAccountId: normalizeOptionalString(params.requesterAccountId),
		requesterSenderId: normalizeOptionalString(params.requesterSenderId),
		toolContext: copyToolContext(params.toolContext)
	});
	return token;
}
function resolveMessageActionTurnCapability(params) {
	const token = params.token?.trim();
	if (!token) return;
	const capability = capabilitiesByToken.get(token);
	if (!capability) return;
	if ((params.nowMs ?? Date.now()) >= capability.expiresAtMs) {
		capabilitiesByToken.delete(token);
		return;
	}
	if (capability.agentId !== normalizeAgentId(params.agentId) || capability.runId !== params.runId?.trim() || capability.sessionKey !== params.sessionKey.trim() || capability.sessionId && capability.sessionId !== normalizeOptionalString(params.sessionId)) return;
	return {
		expiresAtMs: capability.expiresAtMs,
		sessionId: capability.sessionId,
		sourceReplySessionKey: capability.sourceReplySessionKey,
		requesterAccountId: capability.requesterAccountId,
		requesterSenderId: capability.requesterSenderId,
		toolContext: copyToolContext(capability.toolContext)
	};
}
function revokeMessageActionTurnCapability(token) {
	return token ? capabilitiesByToken.delete(token) : false;
}
//#endregion
export { revokeMessageActionTurnCapability as a, resolveMessageActionTurnCapabilityLifetime as i, mintMessageActionTurnCapability as n, resolveMessageActionTurnCapability as r, isTrustedMessageActionTurnIngress as t };
