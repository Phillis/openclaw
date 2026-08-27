import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
import { c as parseAgentSessionKey, o as normalizeSessionKeyPreservingOpaquePeerIds, r as isCronRunSessionKey, s as normalizeSessionPeerId } from "./session-key-utils-Di3FvABa.js";
import { n as normalizeAccountId } from "./account-id-BH0zJUew.js";
//#region src/routing/session-key.ts
/** Legacy on-disk identity used only by doctor/migration and their fixtures. */
const LEGACY_IMPLICIT_AGENT_ID = "main";
/** @deprecated legacy implicit agent id; use roster default resolution. Removal: next major SDK cut. */
const DEFAULT_AGENT_ID = LEGACY_IMPLICIT_AGENT_ID;
const DEFAULT_MAIN_KEY = "main";
function normalizeToken(value) {
	return normalizeLowercaseStringOrEmpty(value);
}
function scopedHeartbeatWakeOptions(sessionKey, wakeOptions, mainKey, scope) {
	const parsed = parseAgentSessionKey(sessionKey);
	if (!parsed) return wakeOptions;
	if (isCronRunSessionKey(sessionKey)) {
		if (scope === "global") return {
			...wakeOptions,
			agentId: parsed.agentId
		};
		return {
			...wakeOptions,
			sessionKey: buildAgentMainSessionKey({
				agentId: parsed.agentId,
				mainKey
			})
		};
	}
	return {
		...wakeOptions,
		sessionKey
	};
}
function resolveEventSessionKey(sessionKey, mainKey, scope) {
	const parsed = parseAgentSessionKey(sessionKey);
	if (!parsed || !isCronRunSessionKey(sessionKey)) return sessionKey;
	if (scope === "global") return "global";
	return buildAgentMainSessionKey({
		agentId: parsed.agentId,
		mainKey
	});
}
function normalizeMainKey(value) {
	return normalizeLowercaseStringOrEmpty(value) || "main";
}
function toAgentRequestSessionKey(storeKey) {
	const raw = (storeKey ?? "").trim();
	if (!raw) return;
	return parseAgentSessionKey(raw)?.rest ?? raw;
}
function agentSessionKeysMatchByRequestKey(left, right) {
	const leftRaw = (left ?? "").trim();
	const rightRaw = (right ?? "").trim();
	if (!leftRaw || !rightRaw) return false;
	return leftRaw === rightRaw || toAgentRequestSessionKey(leftRaw) === toAgentRequestSessionKey(rightRaw);
}
function toAgentStoreSessionKey(params) {
	const raw = (params.requestKey ?? "").trim();
	const lowered = normalizeLowercaseStringOrEmpty(raw);
	if (!raw || lowered === "main") return buildAgentMainSessionKey({
		agentId: params.agentId,
		mainKey: params.mainKey
	});
	const parsed = parseAgentSessionKey(raw);
	if (parsed) return `agent:${parsed.agentId}:${parsed.rest}`;
	const normalized = normalizeSessionKeyPreservingOpaquePeerIds(raw);
	if (lowered.startsWith("agent:")) return normalized;
	return `agent:${normalizeAgentId(params.agentId)}:${normalized}`;
}
function resolveAgentIdFromSessionKey(sessionKey, configuredDefaultAgentId) {
	const parsed = parseAgentSessionKey(sessionKey);
	if (parsed?.agentId) return normalizeAgentId(parsed.agentId);
	if (classifySessionKeyShape(sessionKey) === "malformed_agent") throw new Error("Malformed agent session key; refusing default-agent resolution.");
	const configuredDefault = configuredDefaultAgentId?.trim();
	if (configuredDefault) return normalizeAgentId(configuredDefault);
	throw new Error("Session key does not contain an agent id; resolve it with the configured default agent.");
}
function classifySessionKeyShape(sessionKey) {
	const raw = (sessionKey ?? "").trim();
	if (!raw) return "missing";
	if (parseAgentSessionKey(raw)) return "agent";
	return normalizeLowercaseStringOrEmpty(raw).startsWith("agent:") ? "malformed_agent" : "legacy_or_alias";
}
function isUnscopedSessionKeySentinel(sessionKey) {
	const lowered = normalizeLowercaseStringOrEmpty(sessionKey);
	return lowered === "global" || lowered === "unknown";
}
function scopeLegacySessionKeyToAgent(params) {
	const raw = (params.sessionKey ?? "").trim();
	if (!raw) return;
	const agentId = params.agentId?.trim();
	if (!agentId || classifySessionKeyShape(raw) !== "legacy_or_alias") return raw;
	return toAgentStoreSessionKey({
		agentId,
		requestKey: raw,
		mainKey: params.mainKey
	});
}
function normalizeOptionalAgentId(value) {
	const trimmed = normalizeOptionalString(value);
	return trimmed ? normalizeAgentId(trimmed) : void 0;
}
function sanitizeAgentId(value) {
	return normalizeAgentId(value);
}
function buildAgentMainSessionKey(params) {
	return `agent:${normalizeAgentId(params.agentId)}:${normalizeMainKey(params.mainKey)}`;
}
function buildAgentPeerSessionKey(params) {
	const peerKind = params.peerKind ?? "direct";
	if (peerKind === "direct") {
		const dmScope = params.dmScope ?? "main";
		let peerId = (params.peerId ?? "").trim();
		const linkedPeerId = dmScope === "main" ? null : resolveLinkedDirectPeerId({
			identityLinks: params.identityLinks,
			channel: params.channel,
			peerId
		});
		if (linkedPeerId) peerId = linkedPeerId;
		peerId = normalizeLowercaseStringOrEmpty(peerId);
		if (dmScope === "per-account-channel-peer" && peerId) {
			const channel = normalizeLowercaseStringOrEmpty(params.channel) || "unknown";
			const accountId = normalizeAccountId(params.accountId);
			return `agent:${normalizeAgentId(params.agentId)}:${channel}:${accountId}:direct:${peerId}`;
		}
		if (dmScope === "per-channel-peer" && peerId) {
			const channel = normalizeLowercaseStringOrEmpty(params.channel) || "unknown";
			return `agent:${normalizeAgentId(params.agentId)}:${channel}:direct:${peerId}`;
		}
		if (dmScope === "per-peer" && peerId) return `agent:${normalizeAgentId(params.agentId)}:direct:${peerId}`;
		return buildAgentMainSessionKey({
			agentId: params.agentId,
			mainKey: params.mainKey
		});
	}
	if (params.groupScope === "main") return buildAgentMainSessionKey({
		agentId: params.agentId,
		mainKey: params.mainKey
	});
	const channel = normalizeLowercaseStringOrEmpty(params.channel) || "unknown";
	const peerId = normalizeSessionPeerId({
		channel: params.channel,
		peerKind,
		peerId: params.peerId
	}) || "unknown";
	return `agent:${normalizeAgentId(params.agentId)}:${channel}:${peerKind}:${peerId}`;
}
/** @internal Resolves a declared cross-channel identity for one direct peer. */
function resolveLinkedDirectPeerId(params) {
	const identityLinks = params.identityLinks;
	if (!identityLinks) return null;
	const peerId = params.peerId.trim();
	if (!peerId) return null;
	const candidates = /* @__PURE__ */ new Set();
	const rawCandidate = normalizeToken(peerId);
	if (rawCandidate) candidates.add(rawCandidate);
	const channel = normalizeToken(params.channel);
	if (channel) {
		const scopedCandidate = normalizeToken(`${channel}:${peerId}`);
		if (scopedCandidate) candidates.add(scopedCandidate);
	}
	if (candidates.size === 0) return null;
	for (const [canonical, ids] of Object.entries(identityLinks)) {
		const canonicalName = canonical.trim();
		if (!canonicalName) continue;
		if (!Array.isArray(ids)) continue;
		for (const id of ids) {
			const normalized = normalizeToken(id);
			if (normalized && candidates.has(normalized)) return canonicalName;
		}
	}
	return null;
}
function buildGroupHistoryKey(params) {
	const channel = normalizeToken(params.channel) || "unknown";
	const accountId = normalizeAccountId(params.accountId);
	const peerId = normalizeSessionPeerId({
		channel,
		peerKind: params.peerKind,
		peerId: params.peerId
	}) || "unknown";
	return `${channel}:${accountId}:${params.peerKind}:${peerId}`;
}
function resolveThreadSessionKeys(params) {
	const threadId = (params.threadId ?? "").trim();
	if (!threadId) return {
		sessionKey: params.baseSessionKey,
		parentSessionKey: void 0
	};
	const normalizedThread = params.normalizeThreadId?.(threadId) ?? normalizeLowercaseStringOrEmpty(threadId);
	return {
		sessionKey: params.useSuffix ?? true ? `${params.baseSessionKey}:thread:${normalizedThread}` : params.baseSessionKey,
		parentSessionKey: params.parentSessionKey
	};
}
//#endregion
export { scopeLegacySessionKeyToAgent as _, buildAgentMainSessionKey as a, toAgentStoreSessionKey as b, classifySessionKeyShape as c, normalizeOptionalAgentId as d, resolveAgentIdFromSessionKey as f, sanitizeAgentId as g, resolveThreadSessionKeys as h, agentSessionKeysMatchByRequestKey as i, isUnscopedSessionKeySentinel as l, resolveLinkedDirectPeerId as m, DEFAULT_MAIN_KEY as n, buildAgentPeerSessionKey as o, resolveEventSessionKey as p, LEGACY_IMPLICIT_AGENT_ID as r, buildGroupHistoryKey as s, DEFAULT_AGENT_ID as t, normalizeMainKey as u, scopedHeartbeatWakeOptions as v, toAgentRequestSessionKey as y };
