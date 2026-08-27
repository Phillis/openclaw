import { h as resolveSessionAgentId } from "./agent-scope-BizOtGGz.js";
import { d as sessionDeliveryOrigin } from "./delivery-context.shared-D-qPZITK.js";
import { o as resolveEffectiveSessionToolsVisibility, r as createSessionVisibilityGuard, t as createAgentToAgentPolicy } from "./session-visibility-tSWqHzCC.js";
import "./session-store-runtime-BsqwEEwm.js";
import { i as resolveTranscriptStemToSessionKeys, r as loadCombinedSessionStoreForGateway, t as extractTranscriptIdentityFromSessionsMemoryHit } from "./session-transcript-hit-BTWgfF3o.js";
import { t as buildSessionEntry } from "./memory-core-host-engine-sessions-AjUCuahu.js";
import "./memory-host-core-BtXcl9nj.js";
import { n as readSessionResetRecallCutoffMetadata, t as readSessionArchiveReasonFromHitPath } from "./session-reset-recall-metadata-_gATHFyh.js";
//#region extensions/memory-core/src/session-search-visibility.ts
function normalizeAgentIdForCompare(value) {
	return value?.trim().toLowerCase() || void 0;
}
function isGlobalSessionKeyForSharedScope(cfg, key) {
	return cfg.session?.scope === "global" && key.trim().toLowerCase() === "global";
}
function isSameStoredTranscript(anchor, candidate) {
	if (!anchor || !candidate) return false;
	const anchorSessionId = anchor.sessionId?.trim();
	if (anchorSessionId && candidate.sessionId?.trim() === anchorSessionId) return true;
	const anchorSessionFile = anchor.sessionFile;
	const candidateSessionFile = candidate.sessionFile;
	return typeof anchorSessionFile === "string" && anchorSessionFile.trim().length > 0 && typeof candidateSessionFile === "string" && candidateSessionFile.trim() === anchorSessionFile.trim();
}
function isPrivateConversation(params) {
	if (!params.entry) return false;
	const key = params.key.trim().toLowerCase();
	const chatTypes = [params.entry.chatType, sessionDeliveryOrigin(params.entry)?.chatType].filter((chatType) => chatType !== void 0);
	if (chatTypes.some((chatType) => chatType === "group" || chatType === "channel") || /:active-memory:[a-f0-9]{12}$/i.test(key)) return false;
	const prefix = `agent:${params.agentId.trim().toLowerCase()}:`;
	if (key === "global" || key === `${prefix}global`) return false;
	if (key.startsWith(`${prefix}explicit:`)) return chatTypes.length > 0 && chatTypes.every((chatType) => chatType === "direct");
	if (key.includes(":group:") || key.includes(":channel:") || /:(?:active-memory|cron|heartbeat|hook|node|subagent)(?::|$)/.test(key)) return false;
	if (chatTypes.length > 0) return chatTypes.every((chatType) => chatType === "direct");
	if (key.includes(":direct:") || key.includes(":dm:")) return true;
	return false;
}
function anchorAliasesArePrivate(params) {
	for (const [key, entry] of Object.entries(params.store)) {
		if (key === params.anchorSessionKey) continue;
		if (!isSameStoredTranscript(params.anchorEntry, entry)) continue;
		if (!isPrivateConversation({
			agentId: params.agentId,
			entry,
			key
		})) return false;
	}
	return true;
}
function isTrustedRecallRequester(params) {
	const requesterSessionKey = params.requesterSessionKey?.trim();
	if (!requesterSessionKey) return false;
	if (requesterSessionKey === params.anchorSessionKey) return true;
	if (!requesterSessionKey.startsWith(params.anchorSessionKey)) return false;
	const recallSuffix = requesterSessionKey.slice(params.anchorSessionKey.length);
	return /^:active-memory:[a-f0-9]{12}$/i.test(recallSuffix);
}
function filterSessionKeysByScopedAgent(params) {
	const scopedAgentId = normalizeAgentIdForCompare(params.scopedAgentId);
	if (!scopedAgentId) return params.keys;
	return params.keys.filter((key) => {
		if (isGlobalSessionKeyForSharedScope(params.cfg, key)) return true;
		return normalizeAgentIdForCompare(resolveSessionAgentId({
			sessionKey: key,
			config: params.cfg
		})) === scopedAgentId;
	});
}
async function filterMemorySearchHitsBySessionVisibility(params) {
	const visibility = resolveEffectiveSessionToolsVisibility({
		cfg: params.cfg,
		sandboxed: params.sandboxed
	});
	const a2aPolicy = createAgentToAgentPolicy(params.cfg);
	const requesterAgentId = params.requesterSessionKey ? resolveSessionAgentId({
		sessionKey: params.requesterSessionKey,
		config: params.cfg
	}) : void 0;
	const scopedAgentId = params.agentId?.trim() || requesterAgentId;
	const guard = params.requesterSessionKey ? await createSessionVisibilityGuard({
		action: "history",
		requesterSessionKey: params.requesterSessionKey,
		visibility,
		a2aPolicy
	}) : null;
	const { store: combinedSessionStore, storePath } = loadCombinedSessionStoreForGateway(params.cfg, scopedAgentId ? { agentId: scopedAgentId } : {});
	const conversationRecall = params.conversationRecall;
	const trustedAgentScope = Boolean(params.trustedAgentScope && scopedAgentId && !params.requesterSessionKey && !conversationRecall);
	const anchorSessionKey = conversationRecall?.anchorSessionKey.trim();
	const recallAgentId = anchorSessionKey ? resolveSessionAgentId({
		sessionKey: anchorSessionKey,
		config: params.cfg
	}) : void 0;
	const anchorEntry = anchorSessionKey ? combinedSessionStore[anchorSessionKey] : void 0;
	let anchorResetCutoffPromise;
	const resolveAnchorResetCutoff = () => {
		if (anchorResetCutoffPromise) return anchorResetCutoffPromise;
		const sessionId = anchorEntry?.sessionId?.trim();
		if (!recallAgentId || !sessionId || !anchorSessionKey) return Promise.resolve({ state: "invalid" });
		anchorResetCutoffPromise = buildSessionEntry(`${sessionId}.jsonl`, {
			agentId: recallAgentId,
			sessionId,
			sessionKey: anchorSessionKey,
			storePath,
			updatedAtMs: anchorEntry?.updatedAt
		}).then(readSessionResetRecallCutoffMetadata).catch(() => ({ state: "invalid" }));
		return anchorResetCutoffPromise;
	};
	const recallAuthorized = Boolean(conversationRecall && !params.sandboxed && conversationRecall.scope === "same-agent-private" && (conversationRecall.corpus === "sessions" || conversationRecall.corpus === "configured") && anchorSessionKey && isTrustedRecallRequester({
		anchorSessionKey,
		requesterSessionKey: params.requesterSessionKey
	}) && normalizeAgentIdForCompare(recallAgentId) === normalizeAgentIdForCompare(scopedAgentId) && recallAgentId && isPrivateConversation({
		agentId: recallAgentId,
		entry: anchorEntry,
		key: anchorSessionKey
	}) && anchorAliasesArePrivate({
		store: combinedSessionStore,
		agentId: recallAgentId,
		anchorSessionKey,
		anchorEntry
	}));
	if (conversationRecall && !recallAuthorized) return conversationRecall.corpus === "configured" ? params.hits.filter((hit) => hit.source !== "sessions") : [];
	const isSessionKeyAllowed = (key, allowAnchorTranscript = false) => {
		if (!conversationRecall || !anchorSessionKey || !recallAgentId) {
			const visibilityKey = scopedAgentId && isGlobalSessionKeyForSharedScope(params.cfg, key) ? `agent:${scopedAgentId}:global` : key;
			return trustedAgentScope || guard?.check(visibilityKey).allowed === true;
		}
		const candidateEntry = combinedSessionStore[key];
		if (!allowAnchorTranscript && (key === anchorSessionKey || isSameStoredTranscript(anchorEntry, candidateEntry))) return false;
		if (normalizeAgentIdForCompare(resolveSessionAgentId({
			sessionKey: key,
			config: params.cfg
		})) !== normalizeAgentIdForCompare(recallAgentId)) return false;
		return isPrivateConversation({
			agentId: recallAgentId,
			entry: candidateEntry,
			key
		});
	};
	const expandRecallAliasKeys = (keys) => {
		const expanded = new Set(keys);
		for (const key of keys) {
			const entry = combinedSessionStore[key];
			if (!entry) continue;
			for (const [candidateKey, candidateEntry] of Object.entries(combinedSessionStore)) if (isSameStoredTranscript(entry, candidateEntry)) expanded.add(candidateKey);
		}
		return [...expanded];
	};
	const areSessionKeysAllowed = (keys, allowAnchorTranscript = false) => {
		return conversationRecall ? expandRecallAliasKeys(keys).every((key) => isSessionKeyAllowed(key, allowAnchorTranscript)) : keys.some((key) => isSessionKeyAllowed(key));
	};
	const next = [];
	for (const hit of params.hits) {
		if (hit.source !== "sessions") {
			if (!conversationRecall || conversationRecall.corpus === "configured") next.push(hit);
			continue;
		}
		if (!trustedAgentScope && (!params.requesterSessionKey || !guard && !conversationRecall)) continue;
		const identity = extractTranscriptIdentityFromSessionsMemoryHit(hit.path);
		if (!identity) continue;
		const archiveReason = readSessionArchiveReasonFromHitPath(hit.path);
		if (conversationRecall && archiveReason === "deleted") continue;
		const normalizedScopedAgentId = normalizeAgentIdForCompare(scopedAgentId);
		const normalizedOwnerAgentId = normalizeAgentIdForCompare(identity.ownerAgentId);
		if (normalizedScopedAgentId && normalizedOwnerAgentId && normalizedOwnerAgentId !== normalizedScopedAgentId) continue;
		const sameAgentLiveOwnerId = !identity.archived && normalizedScopedAgentId && normalizedOwnerAgentId === normalizedScopedAgentId ? normalizedOwnerAgentId : void 0;
		const archivedOwnerAgentId = Boolean(identity.archived && identity.ownerAgentId && (!scopedAgentId || normalizeAgentIdForCompare(identity.ownerAgentId) === normalizeAgentIdForCompare(scopedAgentId))) ? identity.ownerAgentId ?? scopedAgentId : void 0;
		const resolvedKeys = resolveTranscriptStemToSessionKeys({
			store: combinedSessionStore,
			stem: identity.stem,
			...archivedOwnerAgentId ? { archivedOwnerAgentId } : {}
		});
		const keys = filterSessionKeysByScopedAgent({
			cfg: params.cfg,
			scopedAgentId,
			keys: resolvedKeys
		});
		if (keys.length === 0) {
			if (sameAgentLiveOwnerId && (visibility === "agent" || visibility === "all") && !conversationRecall) next.push(hit);
			continue;
		}
		let allowResetAnchor = false;
		const anchorSessionId = anchorEntry?.sessionId?.trim();
		if (conversationRecall && !identity.archived && recallAgentId && anchorSessionId && identity.stem === anchorSessionId && normalizedOwnerAgentId === normalizeAgentIdForCompare(recallAgentId)) {
			const cutoff = await resolveAnchorResetCutoff();
			allowResetAnchor = cutoff?.state === "valid" && hit.endLine < cutoff.cutoffLine;
		}
		if (!areSessionKeysAllowed(keys, archiveReason === "reset" || allowResetAnchor)) continue;
		next.push(hit);
	}
	return next;
}
//#endregion
export { filterMemorySearchHitsBySessionVisibility as t };
