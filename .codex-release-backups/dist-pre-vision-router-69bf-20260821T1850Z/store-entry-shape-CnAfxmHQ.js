import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { a as normalizeHyphenSlug } from "./string-normalization-e_fvmxMf.js";
import { c as parseAgentSessionKey, s as normalizeSessionPeerId } from "./session-key-utils-D8x_bjrd.js";
import { u as validateSessionId } from "./paths-CfFmgJmW.js";
import { i as listChannelPlugins } from "./registry-BQt6AaEH.js";
import { r as listDeliverableMessageChannels } from "./message-channel-normalize-BhvdDSLi.js";
import "./message-channel-C3nRvjrX.js";
//#region src/config/sessions/group.ts
const getGroupSurfaces = () => /* @__PURE__ */ new Set([...listDeliverableMessageChannels(), "webchat"]);
function resolveLegacyGroupSessionKey(ctx) {
	for (const plugin of listChannelPlugins()) {
		const resolved = plugin.messaging?.resolveLegacyGroupSessionKey?.(ctx);
		if (resolved) return resolved;
	}
	return null;
}
function normalizeGroupLabel(raw) {
	return normalizeHyphenSlug(raw);
}
function joinOpaqueTail(parts, start) {
	return normalizeOptionalString(parts[start]) ? parts.slice(start).join(":") : null;
}
function resolveOriginatingGroupTargetId(params) {
	const target = normalizeOptionalString(params.ctx.OriginatingTo ?? params.ctx.To) ?? "";
	if (!target) return null;
	const parts = target.split(":");
	if (parts.length < 2) return null;
	const head = normalizeLowercaseStringOrEmpty(parts[0]);
	const second = normalizeOptionalLowercaseString(parts[1]);
	if ((second === "group" || second === "channel") && (head === params.provider || getGroupSurfaces().has(head))) return joinOpaqueTail(parts, 2);
	if (head === params.provider || head === "chat" || head === "room" || head === "group") return joinOpaqueTail(parts, 1);
	if (head === "channel") return joinOpaqueTail(parts, 1);
	return null;
}
function shortenGroupId(value) {
	const trimmed = normalizeOptionalString(value) ?? "";
	if (!trimmed) return "";
	if (trimmed.length <= 14) return trimmed;
	return `${trimmed.slice(0, 6)}...${trimmed.slice(-4)}`;
}
/**
* Builds a human-readable group/channel title from stored chat metadata.
* Prefers the native channel name (#general) or the chat subject verbatim;
* returns undefined when only opaque route ids are available so callers can
* fall back to the compact token form below.
*/
function buildGroupDisplayTitle(params) {
	const subject = normalizeOptionalString(params.subject);
	const groupChannel = normalizeOptionalString(params.groupChannel);
	const space = normalizeOptionalString(params.space);
	if (groupChannel) {
		const channelLabel = groupChannel.startsWith("#") ? groupChannel : `#${groupChannel}`;
		return space ? `${space} ${channelLabel}` : channelLabel;
	}
	return subject ?? space ?? void 0;
}
/** Builds a compact display label for group sessions from channel metadata or ids. */
function buildGroupDisplayName(params) {
	const providerKey = normalizeOptionalLowercaseString(params.provider) ?? "group";
	const groupChannel = normalizeOptionalString(params.groupChannel);
	const space = normalizeOptionalString(params.space);
	const subject = normalizeOptionalString(params.subject);
	const detail = (groupChannel && space ? `${space}${groupChannel.startsWith("#") ? "" : "#"}${groupChannel}` : groupChannel || subject || space || "") || "";
	const fallbackId = normalizeOptionalString(params.id) ?? params.key;
	const rawLabel = detail || fallbackId;
	let token = normalizeGroupLabel(rawLabel);
	if (!token) token = normalizeGroupLabel(shortenGroupId(rawLabel));
	if (!params.groupChannel && token.startsWith("#")) token = token.replace(/^#+/, "");
	if (token && !/^[@#]/.test(token) && !token.startsWith("g-") && !token.includes("#")) token = `g-${token}`;
	return token ? `${providerKey}:${token}` : providerKey;
}
/**
* Resolves channel/group chat context into the persisted group session key.
*
* Provider-prefixed ids use channel-owned normalization, while legacy plugin resolvers remain a
* fallback for older channel surfaces that cannot yet express the generic route shape.
*/
function resolveGroupSessionKey(ctx) {
	const from = normalizeOptionalString(ctx.From) ?? "";
	const chatType = normalizeOptionalLowercaseString(ctx.ChatType);
	const normalizedChatType = chatType === "channel" ? "channel" : chatType === "group" ? "group" : void 0;
	const legacyResolution = resolveLegacyGroupSessionKey(ctx);
	if (!(normalizedChatType === "group" || normalizedChatType === "channel" || from.includes(":group:") || from.includes(":channel:") || legacyResolution !== null)) return null;
	const providerHint = normalizeOptionalLowercaseString(ctx.Provider);
	const parts = from.split(":");
	const head = normalizeLowercaseStringOrEmpty(parts[0]);
	const headIsSurface = head ? getGroupSurfaces().has(head) : false;
	if (!headIsSurface && !providerHint && legacyResolution) return legacyResolution;
	const provider = headIsSurface ? head : providerHint ?? legacyResolution?.channel;
	if (!provider) return null;
	const second = normalizeOptionalLowercaseString(parts[1]);
	const secondIsKind = second === "group" || second === "channel";
	const kind = secondIsKind ? second : from.includes(":channel:") || normalizedChatType === "channel" ? "channel" : "group";
	const originatingGroupTargetId = !secondIsKind && normalizedChatType ? resolveOriginatingGroupTargetId({
		ctx,
		provider
	}) : null;
	const id = originatingGroupTargetId ? originatingGroupTargetId : headIsSurface ? secondIsKind ? joinOpaqueTail(parts, 2) : joinOpaqueTail(parts, 1) : from;
	if (!id) return null;
	const finalId = normalizeSessionPeerId({
		channel: provider,
		peerKind: kind,
		peerId: id
	});
	if (!finalId) return null;
	return {
		key: `${provider}:${kind}:${finalId}`,
		channel: provider,
		id: finalId,
		chatType: kind === "channel" ? "channel" : "group"
	};
}
//#endregion
//#region src/config/sessions/store-entry-shape.ts
function isSafeSessionId(value) {
	if (typeof value !== "string") return false;
	const trimmed = value.trim();
	if (!trimmed || trimmed.length > 255) return false;
	if (trimmed.includes("/") || trimmed.includes("\\") || trimmed === "." || trimmed === "..") return false;
	return /^[A-Za-z0-9][A-Za-z0-9._:@-]*$/.test(trimmed);
}
function normalizeTranscriptSessionId(value) {
	try {
		return validateSessionId(value);
	} catch {
		return;
	}
}
function normalizeOptionalTimestamp(value) {
	return value === void 0 ? void 0 : typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : 0;
}
/** Removes retired runtime locator fields before a session entry is persisted or returned. */
function projectCanonicalSessionEntryShape(value) {
	const { icon: _retiredIcon, sessionFile: _retiredSessionFile, transcriptPath: _retiredTranscriptPath, pendingFinalDeliveryCreatedAt, pendingFinalDeliveryLastAttemptAt: _pendingFinalDeliveryLastAttemptAt, pendingFinalDeliveryAttemptCount: _pendingFinalDeliveryAttemptCount, pendingFinalDeliveryLastError: _pendingFinalDeliveryLastError, pendingFinalDeliveryText, pendingFinalDeliveryContext, pendingFinalDeliveryIntentId, fallbackNoticeSelectedModel, fallbackNoticeActiveModel, fallbackNoticeReason, memoryFlushAt: _memoryFlushAt, memoryFlushCompactionCount, memoryFlushContextHash: _memoryFlushContextHash, memoryFlushFailureCount, memoryFlushLastFailedAt: _memoryFlushLastFailedAt, memoryFlushLastFailureError: _memoryFlushLastFailureError, ...canonicalValue } = value;
	const legacyPendingText = normalizeOptionalString(pendingFinalDeliveryText);
	const legacySelectedModel = normalizeOptionalString(fallbackNoticeSelectedModel);
	const legacyActiveModel = normalizeOptionalString(fallbackNoticeActiveModel);
	const legacyFlushCompactionCount = normalizeCount(memoryFlushCompactionCount);
	const legacyFlushFailureCount = normalizeCount(memoryFlushFailureCount);
	const intentId = normalizeOptionalString(pendingFinalDeliveryIntentId);
	const pendingFinalDelivery = normalizePendingFinalDelivery(canonicalValue.pendingFinalDelivery) ?? (legacyPendingText || value.pendingFinalDelivery === true ? {
		...legacyPendingText ? {
			kind: "replayable",
			text: legacyPendingText
		} : { kind: "transport-only" },
		createdAt: normalizeOptionalTimestamp(pendingFinalDeliveryCreatedAt) ?? normalizeOptionalTimestamp(value.updatedAt) ?? 0,
		...isRecord(pendingFinalDeliveryContext) ? { context: pendingFinalDeliveryContext } : {},
		...intentId ? { intentId } : {}
	} : void 0);
	if (pendingFinalDelivery) canonicalValue.pendingFinalDelivery = pendingFinalDelivery;
	else delete canonicalValue.pendingFinalDelivery;
	const pendingDeliveryNotice = normalizePendingDeliveryNotice(canonicalValue.pendingDeliveryNotice);
	if (pendingDeliveryNotice) canonicalValue.pendingDeliveryNotice = pendingDeliveryNotice;
	else delete canonicalValue.pendingDeliveryNotice;
	const pendingTranscriptRepair = normalizePendingTranscriptRepair(canonicalValue.pendingTranscriptRepair);
	if (pendingTranscriptRepair) canonicalValue.pendingTranscriptRepair = pendingTranscriptRepair;
	else delete canonicalValue.pendingTranscriptRepair;
	const reason = normalizeOptionalString(fallbackNoticeReason);
	const fallbackNotice = normalizeFallbackNotice(canonicalValue.fallbackNotice) ?? (legacySelectedModel && legacyActiveModel ? {
		kind: "active",
		selectedModel: legacySelectedModel,
		activeModel: legacyActiveModel,
		...reason ? { reason } : {}
	} : void 0);
	if (fallbackNotice) canonicalValue.fallbackNotice = fallbackNotice;
	else delete canonicalValue.fallbackNotice;
	const memoryFlush = normalizeMemoryFlush(canonicalValue.memoryFlush) ?? (legacyFlushFailureCount && legacyFlushFailureCount > 0 ? {
		kind: "failed",
		...legacyFlushCompactionCount !== void 0 ? { compactionCount: legacyFlushCompactionCount } : {},
		failureCount: legacyFlushFailureCount
	} : legacyFlushCompactionCount !== void 0 ? {
		kind: "succeeded",
		compactionCount: legacyFlushCompactionCount
	} : void 0);
	if (memoryFlush) canonicalValue.memoryFlush = memoryFlush;
	else delete canonicalValue.memoryFlush;
	return canonicalValue;
}
function normalizePendingFinalDelivery(value) {
	if (!isRecord(value)) return;
	const createdAt = normalizeOptionalTimestamp(value.createdAt);
	if (createdAt === void 0) return;
	const intentId = normalizeOptionalString(value.intentId);
	const deliveries = normalizePendingFinalDeliveries(value.deliveries);
	const base = {
		createdAt,
		...isRecord(value.context) ? { context: value.context } : {},
		...intentId ? { intentId } : {},
		...deliveries ? { deliveries } : {}
	};
	if (value.kind === "transport-only") return {
		kind: "transport-only",
		...base
	};
	const text = normalizeOptionalString(value.text);
	return value.kind === "replayable" && text ? {
		kind: "replayable",
		text,
		...base
	} : void 0;
}
function normalizePendingFinalDeliveries(value) {
	if (!Array.isArray(value)) return;
	const deliveries = value.flatMap((item) => {
		const id = isRecord(item) ? normalizeOptionalString(item.id) : void 0;
		const state = isRecord(item) ? item.state : void 0;
		return id && (state === "prepared" || state === "queued" || state === "delivered" || state === "suppressed" || state === "unknown") ? [{
			id,
			state
		}] : [];
	});
	return deliveries.length > 0 ? deliveries : void 0;
}
function normalizePendingDeliveryNotice(value) {
	if (!isRecord(value) || !isRecord(value.context)) return;
	const createdAt = normalizeOptionalTimestamp(value.createdAt);
	const intentId = normalizeOptionalString(value.intentId);
	return createdAt !== void 0 && intentId && (value.state === "owed" || value.state === "unresolved") ? {
		createdAt,
		context: value.context,
		intentId,
		state: value.state
	} : void 0;
}
function normalizePendingTranscriptRepair(value) {
	if (!Array.isArray(value) || value.length === 0) return;
	const normalized = [];
	for (const item of value) {
		const record = normalizePendingTranscriptRepairRecord(item);
		if (record) normalized.push(record);
	}
	return normalized.length > 0 ? normalized : void 0;
}
function normalizePendingTranscriptRepairRecord(value) {
	if (!isRecord(value)) return;
	const id = normalizeOptionalString(value.id);
	const text = normalizeOptionalString(value.text);
	const createdAt = normalizeOptionalTimestamp(value.createdAt);
	if (!id || !text || createdAt === void 0) return;
	const provider = normalizeOptionalString(value.provider);
	const model = normalizeOptionalString(value.model);
	return {
		id,
		text,
		...provider ? { provider } : {},
		...model ? { model } : {},
		createdAt
	};
}
function normalizeFallbackNotice(value) {
	if (!isRecord(value) || value.kind !== "active") return;
	const selectedModel = normalizeOptionalString(value.selectedModel);
	const activeModel = normalizeOptionalString(value.activeModel);
	const reason = normalizeOptionalString(value.reason);
	return selectedModel && activeModel ? {
		kind: "active",
		selectedModel,
		activeModel,
		...reason ? { reason } : {}
	} : void 0;
}
function normalizeMemoryFlush(value) {
	if (!isRecord(value)) return;
	const compactionCount = normalizeCount(value.compactionCount);
	if (value.kind === "succeeded" && compactionCount !== void 0) return {
		kind: "succeeded",
		compactionCount
	};
	const failureCount = normalizeCount(value.failureCount);
	if (value.kind !== "failed" || !failureCount) return;
	return {
		kind: "failed",
		...compactionCount !== void 0 ? { compactionCount } : {},
		failureCount
	};
}
function normalizeCount(value) {
	return typeof value === "number" && Number.isFinite(value) && value >= 0 ? Math.floor(value) : void 0;
}
/** Normalizes persisted session store entries before they reach runtime callers. */
function normalizePersistedSessionEntryShape(value, options = {}) {
	if (!isRecord(value)) return;
	const modelSelectionLocked = value.modelSelectionLocked === true;
	let next = projectCanonicalSessionEntryShape(value);
	if (value.sessionId !== void 0) {
		if (!isSafeSessionId(value.sessionId)) return;
		const sessionId = value.sessionId.trim();
		const legacySessionFile = value.sessionFile;
		if (!modelSelectionLocked && options.sessionKey !== void 0 && parseAgentSessionKey(options.sessionKey) !== null && sessionId === options.sessionKey && (value.initializationPending === true || typeof legacySessionFile !== "string" || !legacySessionFile.trim())) {
			const { sessionId: _legacyPendingSessionId, ...pendingEntry } = next;
			next = {
				...pendingEntry,
				initializationPending: true
			};
		} else {
			if (modelSelectionLocked && sessionId !== value.sessionId) return;
			if (!normalizeTranscriptSessionId(sessionId)) return;
			if (sessionId !== value.sessionId) next = {
				...next,
				sessionId
			};
		}
	}
	const updatedAt = normalizeOptionalTimestamp(value.updatedAt);
	if (updatedAt !== value.updatedAt) next.updatedAt = updatedAt ?? 0;
	return next;
}
//#endregion
export { resolveGroupSessionKey as a, buildGroupDisplayTitle as i, projectCanonicalSessionEntryShape as n, buildGroupDisplayName as r, normalizePersistedSessionEntryShape as t };
