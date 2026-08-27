import { t as __exportAll } from "./rolldown-runtime-D7D4PA-g.js";
import { l as parseIMessageTarget, s as normalizeIMessageHandle } from "./message-tool-api-BwIxJDoz.js";
import { p as getOptionalIMessageRuntime } from "./monitor-reply-cache-BdeUQaHO.js";
import { l as getIMessageApprovalApprovers, u as imessageApprovalAuth } from "./group-policy-BkMHTfdJ.js";
import { t as resolveIMessageReactionContext } from "./reaction-context-BAYI7pz0.js";
import { createLazyRuntimeSurface } from "openclaw/plugin-sdk/lazy-runtime";
import { asOptionalRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { asDateTimestampMs, isFutureDateTimestampMs, resolveExpiresAtMsFromDurationMs } from "openclaw/plugin-sdk/number-runtime";
import { isApprovalNotFoundError } from "openclaw/plugin-sdk/error-runtime";
import { addApprovalReactionHintToText, approvalReactionDecisionSetsMatch, buildApprovalReactionDeliveredBindingMarker, buildApprovalReactionHint, createApprovalReactionTargetStore, listApprovalReactionBindings, normalizeApprovalReactionDecision, readApprovalReactionDecisionList, readApprovalReactionDeliveredBinding, readApprovalReactionPresentationBinding, resolveTypedApprovalReactionTarget } from "openclaw/plugin-sdk/approval-reaction-runtime";
import { createPluginStateErrorReporter } from "openclaw/plugin-sdk/plugin-state-runtime";
//#region extensions/imessage/src/approval-target-keys.ts
/** Strip the `p:<n>/` part prefix Messages puts on some GUIDs so keys match. */
function normalizeIMessageGuid(value) {
	return value.trim().replace(/^p:\d+\//iu, "");
}
function chatIdToKeyValue(chatId) {
	if (chatId == null || chatId === "") return null;
	if (typeof chatId === "number") return Number.isFinite(chatId) && chatId > 0 ? String(chatId) : null;
	return chatId.trim() || null;
}
function enumerateConversationKeyForms(conversation) {
	const forms = [];
	const chatGuid = conversation.chatGuid?.trim();
	if (chatGuid) forms.push(`chat_guid:${chatGuid}`);
	const chatIdentifier = conversation.chatIdentifier?.trim();
	if (chatIdentifier) forms.push(`chat_identifier:${chatIdentifier}`);
	const chatIdValue = chatIdToKeyValue(conversation.chatId);
	if (chatIdValue) forms.push(`chat_id:${chatIdValue}`);
	const handle = conversation.handle?.trim();
	if (handle) forms.push(`handle:${handle}`);
	return forms;
}
function normalizeConversationKey(conversation) {
	return enumerateConversationKeyForms(conversation)[0];
}
/**
* Index a binding under every key derivable from the conversation. Outbound and
* inbound disagree about which key exists: send may only know
* `{handle: "+1..."}` for a DM, while the bridge populates chat_guid on the
* inbound event. Enumerating all forms keeps the two symmetric without making
* callers guess which one the bridge will pick.
*/
function enumerateApprovalTargetKeys(params) {
	const accountId = params.accountId.trim();
	const messageId = params.messageId.trim();
	if (!accountId || !messageId) return [];
	return enumerateConversationKeyForms(params.conversation).map((form) => `${accountId}:${form}:${messageId}`);
}
function buildIMessageApprovalConversationKeyForTarget(to) {
	try {
		const target = parseIMessageTarget(to);
		if (target.kind === "chat_id") return { chatId: target.chatId };
		if (target.kind === "chat_guid") return { chatGuid: target.chatGuid };
		if (target.kind === "chat_identifier") return { chatIdentifier: target.chatIdentifier };
		const handle = normalizeIMessageHandle(target.to);
		return handle ? { handle } : null;
	} catch {
		return null;
	}
}
/** Conversation key for an inbound event, mirroring the outbound key forms. */
function buildIMessageApprovalConversationKeyForInbound(params) {
	return {
		...params.chatGuid?.trim() ? { chatGuid: params.chatGuid.trim() } : {},
		...params.chatIdentifier?.trim() ? { chatIdentifier: params.chatIdentifier.trim() } : {},
		...chatIdToKeyValue(params.chatId ?? void 0) ? { chatId: params.chatId } : {},
		...params.isGroup ? {} : { handle: params.actorHandle }
	};
}
//#endregion
//#region extensions/imessage/src/approval-reaction-poll-targets.ts
const PERSISTENT_POLL_TARGET_NAMESPACE = "imessage.approval-reaction-poll-targets";
const PERSISTENT_MAX_ENTRIES$1 = 1e3;
const DEFAULT_REACTION_TARGET_TTL_MS$1 = 1440 * 60 * 1e3;
const pendingReactionPollTargets = /* @__PURE__ */ new Map();
function prunePendingReactionPollTargets(nowMs = Date.now()) {
	for (const [key, target] of pendingReactionPollTargets.entries()) if (!isFutureDateTimestampMs(target.expiresAtMs, { nowMs })) pendingReactionPollTargets.delete(key);
}
function resolvePendingReactionPollExpiry(ttlMs) {
	const nowMs = asDateTimestampMs(Date.now());
	if (nowMs === void 0) return;
	const expiresAtMs = resolveExpiresAtMsFromDurationMs(ttlMs ?? DEFAULT_REACTION_TARGET_TTL_MS$1, { nowMs }) ?? resolveExpiresAtMsFromDurationMs(DEFAULT_REACTION_TARGET_TTL_MS$1, { nowMs });
	if (expiresAtMs === void 0) return;
	return {
		ttlMs: expiresAtMs - nowMs,
		expiresAtMs
	};
}
function mergePollTargetConversation(left, right) {
	return {
		chatGuid: left.chatGuid ?? right.chatGuid,
		chatIdentifier: left.chatIdentifier ?? right.chatIdentifier,
		chatId: left.chatId ?? right.chatId,
		handle: left.handle ?? right.handle
	};
}
const reportPersistentApprovalReactionError$1 = createPluginStateErrorReporter(getOptionalIMessageRuntime, "imessage", "approval-reaction-state", "iMessage persistent approval reaction state failed");
let pendingReactionPollTargetStore;
let pendingReactionPollTargetStoreDisabled = false;
function disablePendingReactionPollTargetStore(error) {
	pendingReactionPollTargetStoreDisabled = true;
	pendingReactionPollTargetStore = void 0;
	reportPersistentApprovalReactionError$1(error);
}
function getPendingReactionPollTargetStore() {
	if (pendingReactionPollTargetStoreDisabled) return;
	if (pendingReactionPollTargetStore) return pendingReactionPollTargetStore;
	try {
		pendingReactionPollTargetStore = getOptionalIMessageRuntime()?.state.openKeyedStore({
			namespace: PERSISTENT_POLL_TARGET_NAMESPACE,
			maxEntries: PERSISTENT_MAX_ENTRIES$1,
			defaultTtlMs: DEFAULT_REACTION_TARGET_TTL_MS$1
		});
		return pendingReactionPollTargetStore;
	} catch (error) {
		disablePendingReactionPollTargetStore(error);
		return;
	}
}
function readPersistedPollTarget(value) {
	const target = asOptionalRecord(value);
	if (!target) return null;
	const accountId = typeof target.accountId === "string" ? target.accountId.trim() : "";
	const messageId = typeof target.messageId === "string" ? target.messageId.trim() : "";
	const approvalId = typeof target.approvalId === "string" ? target.approvalId.trim() : "";
	const expiresAtMs = asDateTimestampMs(target.expiresAtMs);
	const allowedDecisions = readApprovalReactionDecisionList(target.allowedDecisions);
	const rawConversation = asOptionalRecord(target.conversation) ?? {};
	const conversation = {
		...typeof rawConversation.chatGuid === "string" ? { chatGuid: rawConversation.chatGuid.trim() } : {},
		...typeof rawConversation.chatIdentifier === "string" ? { chatIdentifier: rawConversation.chatIdentifier.trim() } : {},
		...typeof rawConversation.chatId === "string" || typeof rawConversation.chatId === "number" ? { chatId: rawConversation.chatId } : {},
		...typeof rawConversation.handle === "string" ? { handle: rawConversation.handle.trim() } : {}
	};
	if (!accountId || !messageId || !approvalId || expiresAtMs === void 0 || !allowedDecisions || target.approvalKind !== "exec" && target.approvalKind !== "plugin" || !normalizeConversationKey(conversation)) return null;
	return {
		accountId,
		conversation,
		messageId,
		approvalId,
		approvalKind: target.approvalKind,
		allowedDecisions,
		expiresAtMs
	};
}
function recordIMessageApprovalReactionPollTarget(params) {
	const expiry = resolvePendingReactionPollExpiry(params.ttlMs);
	if (!expiry || params.keys.length === 0) return null;
	const target = {
		accountId: params.accountId,
		conversation: params.conversation,
		messageId: params.messageId,
		approvalId: params.approvalId,
		approvalKind: params.approvalKind,
		allowedDecisions: params.allowedDecisions,
		expiresAtMs: expiry.expiresAtMs
	};
	const store = getPendingReactionPollTargetStore();
	for (const key of params.keys) {
		pendingReactionPollTargets.set(key, target);
		store?.register(key, target, { ttlMs: expiry.ttlMs }).catch(disablePendingReactionPollTargetStore);
	}
	prunePendingReactionPollTargets();
	return expiry;
}
function deleteIMessageApprovalReactionPollTargets(keys) {
	const store = getPendingReactionPollTargetStore();
	for (const key of keys) {
		pendingReactionPollTargets.delete(key);
		store?.delete(key).catch(disablePendingReactionPollTargetStore);
	}
}
async function listPendingIMessageApprovalReactionPollTargets(params) {
	const accountId = params.accountId.trim();
	if (!accountId) return [];
	const nowMs = Date.now();
	const store = getPendingReactionPollTargetStore();
	if (store) try {
		for (const entry of await store.entries()) {
			const target = readPersistedPollTarget(entry.value);
			if (!target || !isFutureDateTimestampMs(target.expiresAtMs, { nowMs })) {
				await store.delete(entry.key);
				continue;
			}
			pendingReactionPollTargets.set(entry.key, target);
		}
	} catch (error) {
		disablePendingReactionPollTargetStore(error);
	}
	prunePendingReactionPollTargets(nowMs);
	const targetByApprovalAndMessage = /* @__PURE__ */ new Map();
	for (const target of pendingReactionPollTargets.values()) {
		if (target.accountId !== accountId) continue;
		const key = `${target.approvalId}:${normalizeIMessageGuid(target.messageId)}`;
		const existing = targetByApprovalAndMessage.get(key);
		if (!existing) {
			targetByApprovalAndMessage.set(key, target);
			continue;
		}
		targetByApprovalAndMessage.set(key, {
			...existing,
			conversation: mergePollTargetConversation(existing.conversation, target.conversation),
			expiresAtMs: Math.max(existing.expiresAtMs, target.expiresAtMs)
		});
	}
	return [...targetByApprovalAndMessage.values()];
}
function clearIMessageApprovalReactionPollTargetsForTest() {
	pendingReactionPollTargets.clear();
	pendingReactionPollTargetStore = void 0;
	pendingReactionPollTargetStoreDisabled = false;
}
//#endregion
//#region extensions/imessage/src/approval-reactions.ts
var approval_reactions_exports = /* @__PURE__ */ __exportAll({
	addIMessageApprovalReactionHintToStructuredPayload: () => addIMessageApprovalReactionHintToStructuredPayload,
	buildIMessageApprovalConversationKeyForTarget: () => buildIMessageApprovalConversationKeyForTarget,
	clearIMessageApprovalReactionTargetsForTest: () => clearIMessageApprovalReactionTargetsForTest,
	handleIMessageApprovalReaction: () => handleIMessageApprovalReaction,
	maybeResolveIMessageApprovalReaction: () => maybeResolveIMessageApprovalReaction,
	registerIMessageApprovalReactionTarget: () => registerIMessageApprovalReactionTarget,
	registerIMessageApprovalReactionTargetForDeliveredPayload: () => registerIMessageApprovalReactionTargetForDeliveredPayload,
	resolveIMessageApprovalReactionTargetWithPersistence: () => resolveIMessageApprovalReactionTargetWithPersistence,
	unregisterIMessageApprovalReactionTarget: () => unregisterIMessageApprovalReactionTarget
});
const PERSISTENT_NAMESPACE = "imessage.approval-reactions";
const PERSISTENT_MAX_ENTRIES = 1e3;
const DEFAULT_REACTION_TARGET_TTL_MS = 1440 * 60 * 1e3;
const loadResolveApprovalOverGateway = createLazyRuntimeSurface(() => import("openclaw/plugin-sdk/approval-gateway-runtime"), (runtime) => runtime.resolveApprovalOverGateway);
const reportPersistentApprovalReactionError = createPluginStateErrorReporter(getOptionalIMessageRuntime, "imessage", "approval-reaction-state", "iMessage persistent approval reaction state failed");
function reportApprovalBindingCorrelationMismatch(binding) {
	try {
		getOptionalIMessageRuntime()?.logging.getChildLogger({
			plugin: "imessage",
			feature: "approval-reaction-state"
		}).warn("iMessage approval prompt text failed binding correlation; tapbacks disabled", {
			approvalId: binding.approvalId,
			approvalKind: binding.approvalKind
		});
	} catch {}
}
function readPersistedTarget(value) {
	const target = value;
	if (!target || typeof target.approvalId !== "string" || target.approvalKind !== "exec" && target.approvalKind !== "plugin") return null;
	const allowedDecisions = readApprovalReactionDecisionList(target.allowedDecisions);
	if (!allowedDecisions) return null;
	return {
		approvalId: target.approvalId,
		approvalKind: target.approvalKind,
		allowedDecisions
	};
}
const imessageApprovalReactionTargets = createApprovalReactionTargetStore({
	namespace: PERSISTENT_NAMESPACE,
	maxEntries: PERSISTENT_MAX_ENTRIES,
	defaultTtlMs: DEFAULT_REACTION_TARGET_TTL_MS,
	openStore: (params) => getOptionalIMessageRuntime()?.state.openKeyedStore(params),
	logPersistentError: reportPersistentApprovalReactionError,
	readPersistedTarget
});
const IMESSAGE_APPROVAL_DELIVERY_BINDING_KEY = "imessageApprovalReactionBindingV1";
function visibleApprovalBindingMatches(text, binding, options) {
	if (!text) return false;
	const lines = text.split(/\r?\n/).map((line) => line.replace(/\*\*/g, "").trim());
	const normalizedHeaders = lines.map((line) => line.replace(/^[^A-Za-z0-9]*/, ""));
	const hasKindHeader = binding.approvalKind === "exec" ? lines.includes("Approval required.") || normalizedHeaders.some((line) => /^Exec approval required$/i.test(line)) : normalizedHeaders.some((line) => /^Plugin approval required$/i.test(line));
	const hasId = lines.includes(`ID: ${binding.approvalId}`) || lines.includes(`Full id: \`${binding.approvalId}\``) || lines.includes(`Full id: ${binding.approvalId}`);
	if (!hasKindHeader || !hasId) return false;
	const visibleDecisions = [];
	for (const line of lines) {
		const match = line.match(APPROVE_COMMAND_LINE_RE);
		const approvalId = match?.[1];
		const decisionsText = match?.[2];
		if (!approvalId || !decisionsText || approvalId !== binding.approvalId && approvalId !== binding.approvalSlug) continue;
		for (const token of decisionsText.split(/[\s|,]+/)) {
			const decision = normalizeApprovalReactionDecision(token);
			if (decision && !visibleDecisions.includes(decision)) visibleDecisions.push(decision);
		}
	}
	if (!approvalReactionDecisionSetsMatch(binding.allowedDecisions, visibleDecisions)) return false;
	if (!options.requireReactionHint) return true;
	const hint = buildApprovalReactionHint({ allowedDecisions: binding.allowedDecisions });
	return Boolean(hint && text.includes(hint));
}
/** Preserve a validated typed approval binding until the iMessage GUID is known. */
function addIMessageApprovalReactionHintToStructuredPayload(params) {
	const metadata = readApprovalReactionPresentationBinding({
		payload: params.payload,
		requireApprovalSlug: true,
		trimApprovalId: true
	});
	const text = params.payload.text;
	if (metadata?.approvalKind !== params.approvalKind || !text) return null;
	if (!visibleApprovalBindingMatches(text, metadata, { requireReactionHint: false })) {
		reportApprovalBindingCorrelationMismatch(metadata);
		return null;
	}
	return {
		...params.payload,
		text: addApprovalReactionHintToText({
			text,
			allowedDecisions: metadata.allowedDecisions
		}),
		channelData: {
			...params.payload.channelData,
			[IMESSAGE_APPROVAL_DELIVERY_BINDING_KEY]: buildApprovalReactionDeliveredBindingMarker({
				approvalId: metadata.approvalId,
				approvalSlug: metadata.approvalSlug,
				approvalKind: metadata.approvalKind,
				allowedDecisions: metadata.allowedDecisions
			})
		}
	};
}
const APPROVE_COMMAND_LINE_RE = /\/approve(?:@[^\s]+)?\s+([A-Za-z0-9][A-Za-z0-9._:-]*)\s+(.+)$/i;
function registerIMessageApprovalReactionTarget(params) {
	const accountId = params.accountId.trim();
	const messageId = params.messageId.trim();
	const approvalId = params.approvalId.trim();
	const allowedDecisions = listApprovalReactionBindings({ allowedDecisions: params.allowedDecisions }).map((binding) => binding.decision);
	if (!accountId || !messageId || !approvalId || params.approvalKind !== "exec" && params.approvalKind !== "plugin" || allowedDecisions.length === 0) return null;
	const target = {
		approvalId,
		approvalKind: params.approvalKind,
		allowedDecisions
	};
	const keys = enumerateApprovalTargetKeys({
		accountId,
		conversation: params.conversation,
		messageId
	});
	if (keys.length === 0) return null;
	const expiry = recordIMessageApprovalReactionPollTarget({
		keys,
		accountId,
		conversation: params.conversation,
		messageId,
		approvalId,
		approvalKind: params.approvalKind,
		allowedDecisions,
		ttlMs: params.ttlMs
	});
	if (!expiry) return null;
	for (const key of keys) imessageApprovalReactionTargets.register(key, target, { ttlMs: expiry.ttlMs });
	return target;
}
function listDeliveredIMessageApprovalGuids(params) {
	const deliveries = [];
	const seen = /* @__PURE__ */ new Set();
	for (const result of params.results) {
		if (result.channel !== "imessage") continue;
		const guid = typeof result.meta?.imessageMessageGuid === "string" ? result.meta.imessageMessageGuid.trim() : "";
		const visibleText = result.meta?.imessageVisibleText;
		if (!guid || /^\d+$/.test(guid) || seen.has(guid) || typeof visibleText !== "string") continue;
		seen.add(guid);
		deliveries.push({
			guid,
			visibleText
		});
	}
	if (!visibleApprovalBindingMatches(deliveries.map((delivery) => delivery.visibleText).join("\n"), params.binding, { requireReactionHint: true })) {
		if (params.results.some((result) => result.channel === "imessage")) reportApprovalBindingCorrelationMismatch(params.binding);
		return [];
	}
	return deliveries.map((delivery) => delivery.guid);
}
/** Bind a typed forwarded approval after iMessage returns the stable tapback GUID. */
function registerIMessageApprovalReactionTargetForDeliveredPayload(params) {
	if (params.target.channel.trim().toLowerCase() !== "imessage") return false;
	const binding = readApprovalReactionDeliveredBinding({
		payload: params.payload,
		channelDataKey: IMESSAGE_APPROVAL_DELIVERY_BINDING_KEY,
		requireApprovalSlug: true,
		trimApprovalId: true
	});
	if (!binding) return false;
	const conversation = buildIMessageApprovalConversationKeyForTarget(params.target.to);
	if (!conversation) return false;
	let registered = false;
	for (const messageId of listDeliveredIMessageApprovalGuids({
		binding,
		results: params.results
	})) registered = Boolean(registerIMessageApprovalReactionTarget({
		accountId: params.accountId,
		conversation,
		messageId,
		approvalId: binding.approvalId,
		approvalKind: binding.approvalKind,
		allowedDecisions: binding.allowedDecisions,
		ttlMs: params.ttlMs
	})) || registered;
	return registered;
}
function unregisterIMessageApprovalReactionTarget(params) {
	const keys = enumerateApprovalTargetKeys(params);
	for (const key of keys) imessageApprovalReactionTargets.delete(key);
	deleteIMessageApprovalReactionPollTargets(keys);
}
function resolveTarget(params) {
	const target = resolveTypedApprovalReactionTarget(params);
	return target ? {
		approvalId: target.approvalId,
		approvalKind: target.approvalKind,
		decision: target.decision
	} : null;
}
function formatCanonicalApprovalTerminalState(approval) {
	const decision = approval.status === "allowed" || approval.status === "denied" ? ` decision=${approval.decision}` : "";
	return `status=${approval.status}${decision} reason=${approval.reason}`;
}
async function resolveIMessageApprovalReactionTargetWithPersistence(params) {
	const keys = enumerateApprovalTargetKeys(params);
	for (const key of keys) {
		const target = resolveTarget({
			target: await imessageApprovalReactionTargets.lookup(key),
			reactionKey: params.reactionKey
		});
		if (target) return target;
	}
	return null;
}
function readApprovalReactionEvent(message, bodyText) {
	const reaction = resolveIMessageReactionContext(message, bodyText);
	if (!reaction) return null;
	const reactionKey = reaction.emoji.trim();
	const candidates = (reaction.targetGuids ?? []).map((value) => value.trim()).filter((value) => value.length > 0);
	const primary = reaction.targetGuid?.trim() || candidates[0] || "";
	const messageIdCandidates = candidates.length > 0 ? candidates : primary ? [primary] : [];
	const actorHandle = normalizeIMessageHandle((message.sender ?? "").trim());
	if (!reactionKey || !primary || !actorHandle) return null;
	const conversation = buildIMessageApprovalConversationKeyForInbound({
		chatGuid: message.chat_guid,
		chatIdentifier: message.chat_identifier,
		chatId: message.chat_id,
		isGroup: message.is_group,
		actorHandle
	});
	if (!normalizeConversationKey(conversation)) return null;
	return {
		conversation,
		messageId: primary,
		messageIdCandidates,
		actorHandle,
		reactionKey,
		action: reaction.action
	};
}
async function handleIMessageApprovalReaction(params) {
	const event = readApprovalReactionEvent(params.message, params.bodyText);
	if (!event) return {
		handled: false,
		stopPolling: false
	};
	if (event.action === "removed") return {
		handled: false,
		stopPolling: false
	};
	let target = null;
	let matchedMessageId = null;
	for (const candidate of event.messageIdCandidates) {
		target = await resolveIMessageApprovalReactionTargetWithPersistence({
			accountId: params.accountId,
			conversation: event.conversation,
			messageId: candidate,
			reactionKey: event.reactionKey
		});
		if (target) {
			matchedMessageId = candidate;
			break;
		}
	}
	if (!target) return {
		handled: false,
		stopPolling: false
	};
	if (getIMessageApprovalApprovers({
		cfg: params.cfg,
		accountId: params.accountId
	}).length === 0) {
		params.logVerboseMessage?.(`imessage: approval reaction denied id=${target.approvalId}; reactions require explicit approvers`);
		return {
			handled: true,
			stopPolling: false
		};
	}
	if (!imessageApprovalAuth.authorizeActorAction({
		cfg: params.cfg,
		accountId: params.accountId,
		senderId: event.actorHandle,
		action: "approve",
		approvalKind: target.approvalKind
	}).authorized) {
		params.logVerboseMessage?.(`imessage: approval reaction denied id=${target.approvalId} sender=${event.actorHandle}`);
		return {
			handled: true,
			stopPolling: false
		};
	}
	const resolveApprovalOverGateway = await loadResolveApprovalOverGateway();
	try {
		const result = await resolveApprovalOverGateway({
			cfg: params.cfg,
			approvalId: target.approvalId,
			approvalKind: target.approvalKind,
			decision: target.decision,
			channel: "imessage",
			accountId: params.accountId,
			senderId: event.actorHandle,
			gatewayUrl: params.gatewayUrl,
			...params.gatewayRuntime ? { gatewayRuntime: params.gatewayRuntime } : {}
		});
		for (const candidate of event.messageIdCandidates) unregisterIMessageApprovalReactionTarget({
			accountId: params.accountId,
			conversation: event.conversation,
			messageId: candidate
		});
		const outcome = result.applied ? "resolved" : "already resolved";
		params.logVerboseMessage?.(`imessage: approval reaction ${outcome} id=${target.approvalId} sender=${event.actorHandle} ${formatCanonicalApprovalTerminalState(result.approval)} via messageId=${matchedMessageId ?? event.messageId}`);
		return {
			handled: true,
			stopPolling: true,
			stopPollingReason: "resolved"
		};
	} catch (error) {
		if (isApprovalNotFoundError(error)) {
			for (const candidate of event.messageIdCandidates) unregisterIMessageApprovalReactionTarget({
				accountId: params.accountId,
				conversation: event.conversation,
				messageId: candidate
			});
			params.logVerboseMessage?.(`imessage: approval reaction ignored for expired approval id=${target.approvalId} sender=${event.actorHandle}`);
			return {
				handled: true,
				stopPolling: true,
				stopPollingReason: "not-found"
			};
		}
		try {
			getOptionalIMessageRuntime()?.logging.getChildLogger({
				plugin: "imessage",
				feature: "approval-reactions"
			}).warn("approval reaction failed", {
				approvalId: target.approvalId,
				senderId: event.actorHandle,
				error: String(error)
			});
		} catch {}
		params.logVerboseMessage?.(`imessage: approval reaction failed id=${target.approvalId} sender=${event.actorHandle}: ${String(error)}`);
		return {
			handled: true,
			stopPolling: true,
			stopPollingReason: "resolver-error"
		};
	}
}
async function maybeResolveIMessageApprovalReaction(params) {
	return (await handleIMessageApprovalReaction(params)).handled;
}
function clearIMessageApprovalReactionTargetsForTest() {
	imessageApprovalReactionTargets.clearForTest();
	clearIMessageApprovalReactionPollTargetsForTest();
	loadResolveApprovalOverGateway.clear();
}
//#endregion
export { unregisterIMessageApprovalReactionTarget as a, buildIMessageApprovalConversationKeyForTarget as c, normalizeConversationKey as d, normalizeIMessageGuid as f, registerIMessageApprovalReactionTarget as i, enumerateApprovalTargetKeys as l, handleIMessageApprovalReaction as n, listPendingIMessageApprovalReactionPollTargets as o, maybeResolveIMessageApprovalReaction as r, buildIMessageApprovalConversationKeyForInbound as s, approval_reactions_exports as t, enumerateConversationKeyForms as u };
