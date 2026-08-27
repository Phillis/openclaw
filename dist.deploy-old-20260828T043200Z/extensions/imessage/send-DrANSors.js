import { d as resolveIMessageChatDbLookupPath, l as resolveIMessageRemoteHost, n as hasExclusiveIMessageLocalDatabase, o as resolveIMessageAccount } from "./accounts-DIpGOIiN.js";
import { l as parseIMessageTarget, n as formatIMessageChatTarget, s as normalizeIMessageHandle } from "./message-tool-api-BwIxJDoz.js";
import { c as rememberIMessageReplyCache, h as chatContextFromIMessageTarget, p as getOptionalIMessageRuntime, v as resolveIMessageDirectChatService } from "./monitor-reply-cache-BdeUQaHO.js";
import { a as IMessageRpcRequestError, n as sanitizeIMessageFinalOutboundText, o as createIMessageRpcClient, t as protectIMessageFencedRoleMarkers } from "./sanitize-outbound-Bp3Bjyyc.js";
import { l as getIMessageApprovalApprovers, u as imessageApprovalAuth } from "./group-policy-BkMHTfdJ.js";
import { a as rememberPersistedIMessageEcho, r as forgetPersistedIMessageEchoKey } from "./persisted-echo-cache-DGxy-J4t.js";
import { d as normalizeConversationKey, f as normalizeIMessageGuid, i as registerIMessageApprovalReactionTarget, l as enumerateApprovalTargetKeys, s as buildIMessageApprovalConversationKeyForInbound, u as enumerateConversationKeyForms } from "./approval-reactions-DSAIB0Ye.js";
import { i as runIMessageCliJsonCommand, r as resolveAuthorizedIMessageReplyReference, t as withIMessageRemoteFile } from "./remote-file-CyTTuRAt.js";
import { createMessageReceiptFromOutboundResults } from "openclaw/plugin-sdk/channel-outbound";
import { createLazyRuntimeSurface } from "openclaw/plugin-sdk/lazy-runtime";
import { accessSync, constants } from "node:fs";
import { basename } from "node:path";
import { asOptionalRecord, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { sleep } from "openclaw/plugin-sdk/runtime-env";
import { extractOriginalFilename, kindFromMime, resolveOutboundAttachmentFromUrl } from "openclaw/plugin-sdk/media-runtime";
import { asDateTimestampMs } from "openclaw/plugin-sdk/number-runtime";
import { PlatformMessageNotDispatchedError, isApprovalNotFoundError } from "openclaw/plugin-sdk/error-runtime";
import { addApprovalReactionHintToText, createApprovalReactionTargetStore, listApprovalReactionBindings } from "openclaw/plugin-sdk/approval-reaction-runtime";
import { convertMarkdownTables, stripInlineDirectiveTagsForDelivery } from "openclaw/plugin-sdk/text-chunking";
import { createChannelPartialDeliveryError } from "openclaw/plugin-sdk/channel-inbound";
import { openNodeSqliteDatabase } from "openclaw/plugin-sdk/sqlite-runtime";
import { createPluginStateErrorReporter } from "openclaw/plugin-sdk/plugin-state-runtime";
import { requireRuntimeConfig } from "openclaw/plugin-sdk/plugin-config-runtime";
import { resolveMarkdownTableMode } from "openclaw/plugin-sdk/markdown-table-runtime";
import { resolvePreferredOpenClawTmpDir, withTempWorkspace } from "openclaw/plugin-sdk/temp-path";
//#region extensions/imessage/src/approval-control-binding-window.ts
const pendingByConversation = /* @__PURE__ */ new Map();
function approvalControlBindingAbortError(signal) {
	const reason = signal?.reason;
	return reason instanceof Error ? reason : new Error("iMessage approval control binding aborted", { cause: reason });
}
function bindingKeys(accountId, conversation) {
	const account = accountId.trim();
	return account ? enumerateConversationKeyForms(conversation).map((form) => `${account}:${form}`) : [];
}
/** Marks the send-to-binding interval during which a visible control is not yet resolvable. */
function beginIMessageApprovalControlBinding(params) {
	const keys = bindingKeys(params.accountId, params.conversation);
	let resolveDone = () => {};
	const window = {
		done: new Promise((resolve) => {
			resolveDone = resolve;
		}),
		close: () => {}
	};
	let closed = false;
	window.close = () => {
		if (closed) return;
		closed = true;
		for (const key of keys) {
			const windows = pendingByConversation.get(key);
			windows?.delete(window);
			if (windows?.size === 0) pendingByConversation.delete(key);
		}
		resolveDone();
	};
	for (const key of keys) {
		const windows = pendingByConversation.get(key) ?? /* @__PURE__ */ new Set();
		windows.add(window);
		pendingByConversation.set(key, windows);
	}
	return { close: window.close };
}
/** Waits for one matching delivery to finish binding; callers recheck until none remain. */
async function waitForIMessageApprovalControlBinding(params) {
	const windows = /* @__PURE__ */ new Set();
	for (const key of bindingKeys(params.accountId, params.conversation)) for (const window of pendingByConversation.get(key) ?? []) windows.add(window);
	if (windows.size === 0) return false;
	if (params.abortSignal?.aborted) throw approvalControlBindingAbortError(params.abortSignal);
	let detachAbort = () => {};
	const aborted = new Promise((_resolve, reject) => {
		const onAbort = () => reject(approvalControlBindingAbortError(params.abortSignal));
		params.abortSignal?.addEventListener("abort", onAbort, { once: true });
		detachAbort = () => params.abortSignal?.removeEventListener("abort", onAbort);
	});
	try {
		await Promise.race([Promise.race([...windows].map((window) => window.done)), aborted]);
	} finally {
		detachAbort();
	}
	return true;
}
function clearIMessageApprovalControlBindingsForTest() {
	for (const windows of pendingByConversation.values()) for (const window of windows) window.close();
	pendingByConversation.clear();
}
const iMessageApprovalControlBindings = {
	begin: beginIMessageApprovalControlBinding,
	wait: waitForIMessageApprovalControlBinding,
	clearForTest: clearIMessageApprovalControlBindingsForTest
};
//#endregion
//#region extensions/imessage/src/approval-polls.ts
const TARGET_NAMESPACE = "imessage.approval-polls";
const TOMBSTONE_NAMESPACE = "imessage.approval-poll-tombstones";
const MAX_ENTRIES = 1e3;
const DEFAULT_TARGET_TTL_MS = 1440 * 60 * 1e3;
/**
* Messages has no close-poll API, so a resolved approval's balloon stays
* tappable forever. Tombstones outlive the binding so late taps are swallowed
* instead of reaching the agent as "Poll vote: ..." prose. Persisted, because a
* gateway restart must not turn old polls back into chat noise.
*/
const TOMBSTONE_TTL_MS = 720 * 60 * 60 * 1e3;
const APPROVAL_DECISIONS = /* @__PURE__ */ new Set([
	"allow-once",
	"allow-always",
	"deny"
]);
const loadResolveApprovalOverGateway = createLazyRuntimeSurface(() => import("openclaw/plugin-sdk/approval-gateway-runtime"), (runtime) => runtime.resolveApprovalOverGateway);
const reportPersistentError = createPluginStateErrorReporter(getOptionalIMessageRuntime, "imessage", "approval-poll-state", "iMessage persistent approval poll state failed");
function readPersistedTarget(value) {
	const target = value;
	if (!target || typeof target.approvalId !== "string" || target.approvalKind !== "exec" && target.approvalKind !== "plugin" || !Array.isArray(target.optionDecisions)) return null;
	const optionDecisions = target.optionDecisions.flatMap((pair) => {
		if (!Array.isArray(pair) || pair.length !== 2) return [];
		const [optionId, decision] = pair;
		if (typeof optionId !== "string" || typeof decision !== "string") return [];
		return APPROVAL_DECISIONS.has(decision) ? [[optionId, decision]] : [];
	});
	return optionDecisions.length > 0 ? {
		approvalId: target.approvalId,
		approvalKind: target.approvalKind,
		optionDecisions
	} : null;
}
const pollTargets = createApprovalReactionTargetStore({
	namespace: TARGET_NAMESPACE,
	maxEntries: MAX_ENTRIES,
	defaultTtlMs: DEFAULT_TARGET_TTL_MS,
	openStore: (params) => getOptionalIMessageRuntime()?.state.openKeyedStore(params),
	logPersistentError: reportPersistentError,
	readPersistedTarget
});
const pollTombstones = createApprovalReactionTargetStore({
	namespace: TOMBSTONE_NAMESPACE,
	maxEntries: MAX_ENTRIES,
	defaultTtlMs: TOMBSTONE_TTL_MS,
	openStore: (params) => getOptionalIMessageRuntime()?.state.openKeyedStore(params),
	logPersistentError: reportPersistentError,
	readPersistedTarget: (value) => {
		const approvalId = value?.approvalId;
		return typeof approvalId === "string" ? { approvalId } : null;
	}
});
/**
* Poll option labels for an approval, in canonical decision order. Reuses the
* tapback bindings so the two controls never disagree about which decisions
* exist or what they are called.
*/
function buildApprovalPollOptions(params) {
	return listApprovalReactionBindings(params).map((binding) => ({
		decision: binding.decision,
		text: `${binding.emoji} ${binding.label}`
	}));
}
/**
* Match the option ids Messages returned back to decisions. Text only pairs the
* response against what we asked for; the id is what a later vote is authorized
* against, since option text in a vote payload is attacker-shaped.
*/
function mapSentPollOptionsToDecisions(params) {
	if (params.sent.length !== params.requested.length) return [];
	const byText = new Map(params.requested.map((option) => [option.text.trim(), option.decision]));
	const seenIds = /* @__PURE__ */ new Set();
	const seenDecisions = /* @__PURE__ */ new Set();
	const mapped = [];
	for (const option of params.sent) {
		const id = option.id.trim();
		const decision = byText.get(option.text.trim());
		if (!id || !decision || seenIds.has(id) || seenDecisions.has(decision)) return [];
		seenIds.add(id);
		seenDecisions.add(decision);
		mapped.push([id, decision]);
	}
	return seenDecisions.size === params.requested.length ? mapped : [];
}
function registerIMessageApprovalPollTarget(params) {
	const accountId = params.accountId.trim();
	const approvalId = params.approvalId.trim();
	const expiresAtMs = asDateTimestampMs(params.expiresAtMs);
	const ttlMs = expiresAtMs === void 0 ? void 0 : expiresAtMs - Date.now();
	if (!accountId || !approvalId || params.optionDecisions.length === 0 || ttlMs === void 0 || ttlMs <= 0) return false;
	const keys = enumeratePollTargetKeys({
		accountId,
		conversation: params.conversation,
		pollGuid: params.pollGuid,
		optionIds: params.optionDecisions.map(([optionId]) => optionId)
	});
	if (keys.length === 0) return false;
	const target = {
		approvalId,
		approvalKind: params.approvalKind,
		optionDecisions: params.optionDecisions
	};
	for (const key of keys) {
		pollTargets.register(key, target, { ttlMs });
		pollTombstones.register(key, { approvalId }, { ttlMs: TOMBSTONE_TTL_MS });
	}
	return true;
}
function unregisterIMessageApprovalPollTarget(params) {
	for (const key of enumeratePollTargetKeys({
		accountId: params.accountId,
		conversation: params.conversation,
		pollGuid: params.pollGuid,
		optionIds: params.optionDecisions?.map(([optionId]) => optionId)
	})) {
		pollTargets.delete(key);
		pollTombstones.register(key, { approvalId: params.approvalId ?? "" }, { ttlMs: TOMBSTONE_TTL_MS });
	}
}
/**
* Consume votes for a poll that was created but could not be safely bound.
* Messages has no reliable retract primitive for this balloon.
*/
function registerIMessageApprovalPollTombstone(params) {
	const keys = enumeratePollTargetKeys({
		accountId: params.accountId,
		conversation: params.conversation,
		pollGuid: params.pollGuid,
		optionIds: params.optionIds
	});
	if (keys.length === 0) return false;
	for (const key of keys) pollTombstones.register(key, { approvalId: params.approvalId }, { ttlMs: TOMBSTONE_TTL_MS });
	return true;
}
function enumeratePollTargetKeys(params) {
	const references = [...params.pollGuid?.trim() ? [`guid:${normalizeIMessageGuid(params.pollGuid)}`] : [], ...(params.optionIds ?? []).flatMap((optionId) => {
		const normalized = optionId.trim();
		return normalized ? [`option:${normalized}`] : [];
	})];
	return [...new Set(references.flatMap((messageId) => enumerateApprovalTargetKeys({
		accountId: params.accountId,
		conversation: params.conversation,
		messageId
	})))];
}
function readPollVoteEvent(message) {
	const poll = message.poll;
	if (!poll || poll.kind !== "vote") return null;
	const pollGuid = normalizeIMessageGuid(typeof poll.original_guid === "string" && poll.original_guid || typeof poll.poll_guid === "string" && poll.poll_guid || "");
	const sender = normalizeIMessageHandle((message.sender ?? "").trim());
	const destinationCallerId = normalizeIMessageHandle((message.destination_caller_id ?? "").trim());
	const actorHandle = (message.is_from_me !== true && Boolean(sender) && Boolean(destinationCallerId) && sender === destinationCallerId ? "" : sender) || (message.is_from_me === true ? destinationCallerId : "");
	if (!pollGuid || !actorHandle) return null;
	const rawVotes = Array.isArray(poll.votes) ? poll.votes : poll.vote ? [poll.vote] : [];
	let malformedVotes = false;
	const votes = rawVotes.flatMap((vote) => {
		if (!vote || typeof vote.option_id !== "string") {
			malformedVotes = true;
			return [];
		}
		const optionId = vote.option_id.trim();
		if (!optionId) {
			malformedVotes = true;
			return [];
		}
		return [{
			optionId,
			participantKey: typeof vote.participant === "string" ? normalizeIMessageHandle(vote.participant.trim().replace(/^[ep]:/iu, "")) : "",
			selected: vote.event_type === "selected"
		}];
	});
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
		pollGuid,
		actorHandle,
		votes,
		malformedVotes
	};
}
async function lookupPollTarget(params) {
	for (const key of enumeratePollTargetKeys({
		accountId: params.accountId,
		conversation: params.conversation,
		pollGuid: params.pollGuid,
		optionIds: params.optionIds
	})) {
		const target = await pollTargets.lookup(key);
		if (target) return target;
	}
	return null;
}
async function hasTombstone(params) {
	for (const key of enumeratePollTargetKeys({
		accountId: params.accountId,
		conversation: params.conversation,
		pollGuid: params.pollGuid,
		optionIds: params.optionIds
	})) if (await pollTombstones.lookup(key)) return true;
	return false;
}
/**
* Outcomes for votes we own are logged at info, not verbose: an approval
* decision is security-relevant, and diagnosing "the tap did nothing" must not
* require re-running the gateway in debug.
*/
function info(message, fields) {
	try {
		getOptionalIMessageRuntime()?.logging.getChildLogger({
			plugin: "imessage",
			feature: "approval-polls"
		}).info(message, fields);
	} catch {}
}
function warn$1(message, fields) {
	try {
		getOptionalIMessageRuntime()?.logging.getChildLogger({
			plugin: "imessage",
			feature: "approval-polls"
		}).warn(message, fields);
	} catch {}
}
/**
* Resolve a pending approval from an inbound native poll vote. Returns true when
* the event belongs to an approval poll we own, so the monitor can stop it
* before the ordinary dispatch pipeline renders it as prose.
*/
async function maybeResolveIMessageApprovalPollVote(params) {
	const event = readPollVoteEvent(params.message);
	if (!event) return false;
	const lookupKey = {
		accountId: params.accountId,
		conversation: event.conversation,
		pollGuid: event.pollGuid,
		optionIds: event.votes.map((vote) => vote.optionId)
	};
	const target = await lookupPollTarget(lookupKey);
	if (!target) return await hasTombstone(lookupKey);
	if (event.malformedVotes) {
		warn$1("approval poll vote ignored: malformed complete vote set", {
			approvalId: target.approvalId,
			actorHandle: event.actorHandle
		});
		return true;
	}
	const directlyAttributedVotes = event.votes.filter((vote) => vote.participantKey === event.actorHandle);
	const participantKeys = new Set(event.votes.map((vote) => vote.participantKey).filter(Boolean));
	const actorVotes = directlyAttributedVotes.length > 0 ? directlyAttributedVotes : event.votes.length === 1 || participantKeys.size === 1 ? event.votes : [];
	if (actorVotes.length === 0) {
		warn$1("approval poll vote participants did not identify the transport actor", {
			approvalId: target.approvalId,
			actorHandle: event.actorHandle
		});
		return true;
	}
	const selectedVotes = actorVotes.filter((vote) => vote.selected);
	if (selectedVotes.length === 0) {
		info("approval poll deselect ignored; first selection decides", { approvalId: target.approvalId });
		return true;
	}
	const selectedDecisions = selectedVotes.map((vote) => ({
		optionId: vote.optionId,
		decision: target.optionDecisions.find(([optionId]) => optionId === vote.optionId)?.[1]
	}));
	if (selectedDecisions.some((entry) => !entry.decision)) {
		warn$1("approval poll vote ignored: selected option not bound to a decision", {
			approvalId: target.approvalId,
			optionIds: selectedDecisions.map((entry) => entry.optionId)
		});
		return true;
	}
	const decisions = [...new Set(selectedDecisions.map((entry) => entry.decision))];
	if (decisions.length !== 1) {
		warn$1("approval poll vote ignored: ambiguous selected decisions", {
			approvalId: target.approvalId,
			decisions
		});
		return true;
	}
	const decision = decisions[0];
	if (!decision) return true;
	if (getIMessageApprovalApprovers({
		cfg: params.cfg,
		accountId: params.accountId
	}).length === 0) {
		info("approval poll vote denied: no explicit approvers configured", { approvalId: target.approvalId });
		return true;
	}
	if (!imessageApprovalAuth.authorizeActorAction({
		cfg: params.cfg,
		accountId: params.accountId,
		senderId: event.actorHandle,
		action: "approve",
		approvalKind: target.approvalKind
	}).authorized) {
		info("approval poll vote denied: sender not an approver", {
			approvalId: target.approvalId,
			actorHandle: event.actorHandle
		});
		return true;
	}
	const resolveApprovalOverGateway = await loadResolveApprovalOverGateway();
	try {
		const result = await resolveApprovalOverGateway({
			cfg: params.cfg,
			approvalId: target.approvalId,
			approvalKind: target.approvalKind,
			decision,
			channel: "imessage",
			accountId: params.accountId,
			senderId: event.actorHandle,
			gatewayUrl: params.gatewayUrl,
			...params.gatewayRuntime ? { gatewayRuntime: params.gatewayRuntime } : {}
		});
		unregisterIMessageApprovalPollTarget({
			...lookupKey,
			optionDecisions: target.optionDecisions,
			approvalId: target.approvalId
		});
		info(`approval poll vote ${result.applied ? "resolved" : "already resolved"}`, {
			approvalId: target.approvalId,
			actorHandle: event.actorHandle,
			decision
		});
		return true;
	} catch (error) {
		if (isApprovalNotFoundError(error)) {
			unregisterIMessageApprovalPollTarget({
				...lookupKey,
				optionDecisions: target.optionDecisions,
				approvalId: target.approvalId
			});
			info("approval poll vote ignored: approval already gone", { approvalId: target.approvalId });
			return true;
		}
		warn$1("approval poll vote failed", {
			approvalId: target.approvalId,
			senderId: event.actorHandle,
			error: String(error)
		});
		throw error;
	}
}
function clearIMessageApprovalPollTargetsForTest() {
	pollTargets.clearForTest();
	pollTombstones.clearForTest();
	loadResolveApprovalOverGateway.clear();
}
const iMessageApprovalPollTargets = {
	register: registerIMessageApprovalPollTarget,
	unregister: unregisterIMessageApprovalPollTarget,
	registerTombstone: registerIMessageApprovalPollTombstone,
	clearForTest: clearIMessageApprovalPollTargetsForTest
};
//#endregion
//#region extensions/imessage/src/send.ts
const MIN_PENDING_PERSISTED_ECHO_TTL_MS = 6e4;
const PENDING_PERSISTED_ECHO_GRACE_MS = 5e3;
function resolveMessageId(result) {
	if (!result) return null;
	const raw = typeof result.messageGuid === "string" && result.messageGuid.trim() || typeof result.messageId === "string" && result.messageId.trim() || typeof result.message_id === "string" && result.message_id.trim() || typeof result.id === "string" && result.id.trim() || typeof result.guid === "string" && result.guid.trim() || (typeof result.message_id === "number" ? String(result.message_id) : null) || (typeof result.id === "number" ? String(result.id) : null);
	return raw ? raw.trim() : null;
}
function resolveOutboundMessageGuid(result) {
	if (!result) return null;
	for (const key of [
		"messageGuid",
		"guid",
		"messageId",
		"message_id",
		"id"
	]) {
		const guid = normalizeResolvedMessageGuid(result[key]);
		if (guid) return guid;
	}
	return null;
}
function isNumericMessageRowId(value) {
	return typeof value === "string" && /^\d+$/.test(value.trim());
}
function resolveTargetService(target) {
	if (target.kind !== "handle") return;
	if (target.serviceExplicit || target.service !== "auto") return target.service;
}
function normalizeResolvedMessageGuid(value) {
	if (typeof value !== "string") return null;
	const trimmed = value.trim();
	return isConcreteIMessageMessageId(trimmed) && !isNumericMessageRowId(trimmed) ? trimmed : null;
}
function resolveMessageGuidFromChatDb(params) {
	const dbPath = params.dbPath?.trim();
	const messageId = params.messageId.trim();
	if (!dbPath || !isNumericMessageRowId(messageId)) return null;
	let db = null;
	try {
		db = openNodeSqliteDatabase(dbPath, { readOnly: true });
		return normalizeResolvedMessageGuid(db.prepare("SELECT guid FROM message WHERE ROWID = ?").get(messageId)?.guid);
	} catch {
		return null;
	} finally {
		try {
			db?.close();
		} catch {}
	}
}
function getStringRowValue(row, key) {
	return normalizeResolvedMessageGuid(row?.[key]);
}
function appleMessageDateLowerBoundMs(sentAfterMs) {
	if (!Number.isFinite(sentAfterMs)) return null;
	return Math.max(0, Math.floor((sentAfterMs - 9783072e5 - 5e3) * 1e6));
}
function resolveLatestSentMessageGuidFromChatDb(params) {
	const dbPath = params.dbPath?.trim();
	if (!dbPath) return null;
	let db = null;
	try {
		db = openNodeSqliteDatabase(dbPath, { readOnly: true });
		const targetClauses = [];
		const targetParams = [];
		const lowerBound = appleMessageDateLowerBoundMs(params.sentAfterMs);
		if (params.text) {
			targetClauses.push("m.text = ?");
			targetParams.push(params.text);
		}
		if (lowerBound !== null) {
			targetClauses.push("m.date >= ?");
			targetParams.push(lowerBound);
		}
		if (params.target.kind === "chat_id") {
			targetClauses.push("cmj.chat_id = ?");
			targetParams.push(params.target.chatId);
		} else if (params.target.kind === "chat_guid") {
			targetClauses.push("c.guid = ?");
			targetParams.push(params.target.chatGuid);
		} else if (params.target.kind === "chat_identifier") {
			targetClauses.push("c.chat_identifier = ?");
			targetParams.push(params.target.chatIdentifier);
		} else {
			const normalizedHandle = normalizeIMessageHandle(params.target.to);
			targetClauses.push("(h.id = ? OR h.uncanonicalized_id = ?)");
			targetParams.push(normalizedHandle, params.target.to);
		}
		const selectSql = `
      SELECT m.guid
      FROM message m
      LEFT JOIN chat_message_join cmj ON cmj.message_id = m.ROWID
      LEFT JOIN chat c ON c.ROWID = cmj.chat_id
      LEFT JOIN handle h ON h.ROWID = m.handle_id
      WHERE m.is_from_me = 1
      ${targetClauses.length ? `AND ${targetClauses.join(" AND ")}` : ""}
      ORDER BY m.date DESC, m.ROWID DESC
      LIMIT 10
    `;
		return getStringRowValue(db.prepare(selectSql).all(...targetParams)[0], "guid");
	} catch {
		return null;
	} finally {
		try {
			db?.close();
		} catch {}
	}
}
function canResolveLatestSentMessageGuidFromChatDb(dbPath) {
	const normalizedDbPath = dbPath?.trim();
	if (!normalizedDbPath) return false;
	try {
		accessSync(normalizedDbPath, constants.R_OK);
		return true;
	} catch {
		return false;
	}
}
async function resolveApprovalBindingMessageGuid(params) {
	const immediateGuid = resolveOutboundMessageGuid(params.result);
	if (immediateGuid) return immediateGuid;
	const messageId = params.messageId?.trim();
	if (!messageId || !isNumericMessageRowId(messageId)) return null;
	return normalizeResolvedMessageGuid(await (params.resolveMessageGuidImpl ?? resolveMessageGuidFromChatDb)({
		dbPath: params.dbPath,
		messageId
	}));
}
async function resolveFallbackSentMessageGuid(params) {
	const resolver = params.resolveSentMessageGuidImpl ?? resolveLatestSentMessageGuidFromChatDb;
	if (!params.resolveSentMessageGuidImpl && !canResolveLatestSentMessageGuidFromChatDb(params.dbPath)) return null;
	const deadlineMs = Date.now() + 5e3;
	while (Date.now() <= deadlineMs) {
		const resolved = normalizeResolvedMessageGuid(await resolver({
			dbPath: params.dbPath,
			target: params.target,
			text: params.text,
			sentAfterMs: params.sentAfterMs
		}));
		if (resolved) return resolved;
		if (Date.now() >= deadlineMs) return null;
		await sleep(250);
	}
	return null;
}
function shouldRecoverApprovalPromptGuid(params) {
	return Boolean(params.approvalPrompt && !params.filePath && !params.replyToId);
}
function canCheckSentMessageAfterRpcTimeout(params) {
	return Boolean(params.resolveSentMessageGuidImpl) || canResolveLatestSentMessageGuidFromChatDb(params.dbPath);
}
function resolveOutboundEchoText(text) {
	return text.trim() || void 0;
}
function resolveOutboundEchoMedia(mediaContentType) {
	if (!mediaContentType) return;
	return {
		contentType: mediaContentType,
		kind: kindFromMime(mediaContentType) ?? "unknown"
	};
}
function createIMessageSendReceipt(params) {
	const messageId = params.messageId.trim();
	const results = isConcreteIMessageMessageId(messageId) ? [{
		channel: "imessage",
		messageId,
		meta: { targetKind: params.target.kind }
	}] : [];
	if (results[0]) {
		if (params.target.kind === "chat_id") results[0].chatId = String(params.target.chatId);
		else if (params.target.kind === "chat_guid") results[0].conversationId = params.target.chatGuid;
		else if (params.target.kind === "chat_identifier") results[0].conversationId = params.target.chatIdentifier;
	}
	const receiptParams = {
		results,
		kind: params.kind
	};
	if (params.replyToId) receiptParams.replyToId = params.replyToId;
	return createMessageReceiptFromOutboundResults(receiptParams);
}
function isConcreteIMessageMessageId(messageId) {
	const trimmed = messageId?.trim();
	return Boolean(trimmed && trimmed !== "unknown" && trimmed !== "ok");
}
async function withOriginalIMessageAttachmentPath(filePath, send) {
	const filename = extractOriginalFilename(filePath);
	if (basename(filePath) === filename) return await send(filePath);
	return await withTempWorkspace({
		rootDir: resolvePreferredOpenClawTmpDir(),
		prefix: "openclaw-imessage-outbound-"
	}, async (workspace) => await send(await workspace.copyIn(filename, filePath)));
}
function canSynthesizeAttachmentChatHandle(raw) {
	const trimmed = raw.trim();
	return trimmed.includes("@") || trimmed.startsWith("+");
}
function resolveOutboundEchoScope(params) {
	if (params.target.kind === "chat_id") return `${params.accountId}:${formatIMessageChatTarget(params.target.chatId)}`;
	if (params.target.kind === "chat_guid") return `${params.accountId}:chat_guid:${params.target.chatGuid}`;
	if (params.target.kind === "chat_identifier") return `${params.accountId}:chat_identifier:${params.target.chatIdentifier}`;
	return `${params.accountId}:imessage:${params.target.to}`;
}
function resolveIMessageSendFailure(result) {
	if (result.success !== false) return null;
	return typeof result.error === "string" && result.error.trim() ? result.error.trim() : "iMessage action failed";
}
function normalizeIMessageRpcSendError(error) {
	if (!(error instanceof IMessageRpcRequestError)) return error;
	const data = asOptionalRecord(error.data);
	return data?.disposition === "not_started" && data.retry_safe === true ? new PlatformMessageNotDispatchedError(error.message, { cause: error }) : error;
}
async function requestIMessageRpcSend(client, method, params, timeoutMs) {
	try {
		return await client.request(method, params, { timeoutMs });
	} catch (error) {
		throw normalizeIMessageRpcSendError(error);
	}
}
function isIMessageRpcSendTimeout(error) {
	const message = error instanceof Error ? error.message : String(error);
	return /imsg rpc timeout \(send\)/i.test(message);
}
async function runIMessageCliJson(cliPath, dbPath, args, timeoutMs) {
	return await runIMessageCliJsonCommand({
		args,
		cliPath,
		dbPath,
		timeoutMs
	});
}
function resultService(value) {
	const normalized = normalizeOptionalString(value)?.toLowerCase();
	return normalized === "imessage" || normalized === "sms" ? normalized : void 0;
}
function resolvePendingPersistedEchoTtlMs(timeoutMs) {
	return Math.max(MIN_PENDING_PERSISTED_ECHO_TTL_MS, Math.max(0, timeoutMs) + PENDING_PERSISTED_ECHO_GRACE_MS);
}
function isAttachmentCommandFallbackError(error) {
	const message = error instanceof Error ? error.message : String(error);
	return /(?:unknown|unrecognized|invalid|unsupported)\s+(?:command|subcommand)|not a recognized command|send-attachment.*(?:not found|unsupported|unavailable)|private api bridge.*unavailable|requires the imsg private api bridge|run imsg launch/iu.test(message);
}
function isThreadedReplyUnsupportedError(error) {
	const message = error instanceof Error ? error.message : String(error);
	return /reply_to requires bridge transport|cannot send threaded repl|threaded repl(?:y|ies)\b.*(?:unsupported|not supported|requires|unavailable)|requires bridge transport/iu.test(message);
}
async function resolveAttachmentChatTarget(params) {
	if (params.target.kind === "chat_guid") return params.target.chatGuid;
	if (params.target.kind === "handle") {
		if (!canSynthesizeAttachmentChatHandle(params.target.to)) return null;
		const normalizedHandle = normalizeIMessageHandle(params.target.to);
		if (!normalizedHandle) return null;
		const service = params.target.service !== "auto" ? params.target.service : params.service;
		if (service === "sms") return `SMS;-;${normalizedHandle}`;
		if (service === "imessage") return `iMessage;-;${normalizedHandle}`;
		return `any;-;${normalizedHandle}`;
	}
	if (params.target.kind !== "chat_id") return null;
	const result = await params.runCliJson([
		"group",
		"--chat-id",
		String(params.target.chatId)
	]);
	return normalizeOptionalString(result.guid) ?? normalizeOptionalString(result.chat_guid) ?? null;
}
async function trySendAttachmentForTarget(params) {
	if (params.audioAsVoice && params.sendTransport === "applescript") throw new Error("iMessage voice messages require bridge transport; AppleScript cannot send native voice notes. Set sendTransport to bridge or auto.");
	if (params.target.kind === "handle" && !params.audioAsVoice && params.sendTransport !== "bridge" && (params.service === "sms" || params.service === "imessage")) return null;
	if (params.remoteHost && params.sendTransport === "applescript") return null;
	let attachmentChatTarget = null;
	if (params.remoteHost) if (params.target.kind === "chat_guid") attachmentChatTarget = params.target.chatGuid;
	else if (params.target.kind === "chat_identifier") attachmentChatTarget = params.target.chatIdentifier;
	else if (params.target.kind === "handle") {
		const normalizedHandle = normalizeIMessageHandle(params.target.to);
		if (normalizedHandle) {
			const service = params.target.service !== "auto" ? params.target.service : params.service;
			attachmentChatTarget = `${service === "sms" ? "SMS" : service === "imessage" ? "iMessage" : "any"};-;${normalizedHandle}`;
		}
	} else attachmentChatTarget = formatIMessageChatTarget(params.target.chatId);
	else try {
		attachmentChatTarget = await resolveAttachmentChatTarget({
			target: params.target,
			service: params.service,
			runCliJson: params.runCliJson
		});
	} catch (error) {
		if (!params.audioAsVoice && isAttachmentCommandFallbackError(error)) return null;
		throw error;
	}
	if (!attachmentChatTarget) {
		if (params.audioAsVoice) throw new Error("iMessage voice messages require an existing chat and bridge transport.");
		return null;
	}
	const echoScope = resolveOutboundEchoScope({
		accountId: params.accountId,
		target: params.target
	});
	let result;
	let pendingEchoKey;
	try {
		if (echoScope) pendingEchoKey = rememberPersistedIMessageEcho({
			scope: echoScope,
			text: params.echoText,
			media: params.echoMedia,
			ttlMs: params.pendingEchoTtlMs,
			pending: true
		});
		result = await withOriginalIMessageAttachmentPath(params.filePath, async (attachmentPath) => {
			if (params.remoteHost) {
				const requestRpc = params.requestRpc;
				if (!requestRpc) throw new Error("iMessage remote attachment RPC is unavailable");
				return await params.withRemoteFile({
					remoteHost: params.remoteHost,
					localPath: attachmentPath,
					timeoutMs: params.timeoutMs,
					use: async (remotePath) => {
						const rpcParams = {
							file: remotePath,
							...params.audioAsVoice ? { audio: true } : {},
							...params.replyToId ? { reply_to: params.replyToId } : {}
						};
						if (params.target.kind === "chat_id") rpcParams.chat_id = params.target.chatId;
						else if (params.target.kind === "chat_guid") rpcParams.chat_guid = params.target.chatGuid;
						else rpcParams.chat_identifier = attachmentChatTarget;
						return await requestRpc("send.attachment", rpcParams);
					}
				});
			}
			return await params.runCliJson([
				"send-attachment",
				"--chat",
				attachmentChatTarget,
				"--file",
				attachmentPath,
				...params.audioAsVoice ? ["--audio"] : [],
				...params.replyToId ? ["--reply-to", params.replyToId] : [],
				"--transport",
				params.sendTransport === "bridge" ? "dylib" : params.sendTransport
			]);
		});
	} catch (error) {
		forgetPersistedIMessageEchoKey(pendingEchoKey);
		if (!params.audioAsVoice && isAttachmentCommandFallbackError(error)) return null;
		throw error;
	}
	const failure = resolveIMessageSendFailure(result);
	if (failure) {
		const error = new Error(failure);
		forgetPersistedIMessageEchoKey(pendingEchoKey);
		if (!params.audioAsVoice && isAttachmentCommandFallbackError(error)) return null;
		throw error;
	}
	const resolvedId = resolveMessageId(result);
	const approvalBindingMessageId = await resolveApprovalBindingMessageGuid({
		dbPath: params.dbPath,
		messageId: resolvedId,
		result,
		resolveMessageGuidImpl: params.resolveMessageGuidImpl
	});
	const messageId = resolvedId ?? (result.ok || result.success ? "ok" : "unknown");
	if (echoScope) rememberPersistedIMessageEcho({
		scope: echoScope,
		text: params.echoText,
		media: params.echoMedia,
		messageId: resolvedId ?? void 0
	});
	if (resolvedId && isConcreteIMessageMessageId(resolvedId)) rememberIMessageReplyCache({
		accountId: params.accountId,
		messageId: resolvedId,
		chatGuid: params.target.kind === "chat_guid" ? params.target.chatGuid : params.target.kind === "chat_id" ? attachmentChatTarget : void 0,
		chatIdentifier: params.target.kind === "chat_identifier" || params.target.kind === "handle" ? attachmentChatTarget : void 0,
		chatId: params.target.kind === "chat_id" ? params.target.chatId : void 0,
		timestamp: Date.now(),
		isFromMe: true
	});
	return {
		messageId,
		...approvalBindingMessageId ? { guid: approvalBindingMessageId } : {},
		sentText: "",
		...params.echoText ? { echoText: params.echoText } : {},
		...params.echoMedia ? { echoMedia: params.echoMedia } : {},
		receipt: createIMessageSendReceipt({
			messageId,
			target: params.target,
			kind: params.audioAsVoice ? "voice" : "media",
			...params.replyToId ? { replyToId: params.replyToId } : {}
		})
	};
}
async function sendMessageIMessage(to, text, opts) {
	const cfg = requireRuntimeConfig(opts.config, "iMessage send");
	const account = opts.account ?? resolveIMessageAccount({
		cfg,
		accountId: opts.accountId
	});
	const cliPath = opts.cliPath?.trim() || account.config.cliPath?.trim() || "imsg";
	const dbPath = opts.dbPath?.trim() || account.config.dbPath?.trim();
	const remoteHost = await resolveIMessageRemoteHost({
		cliPath,
		remoteHost: account.config.remoteHost
	});
	const chatDbLookupPath = resolveIMessageChatDbLookupPath({
		cliPath,
		dbPath,
		remoteHost
	});
	const target = parseIMessageTarget(opts.chatId ? formatIMessageChatTarget(opts.chatId) : to);
	const service = opts.service ?? resolveTargetService(target) ?? account.config.service;
	const sendTransport = account.config.sendTransport ?? "auto";
	const resolvedReplyToId = resolveAuthorizedIMessageReplyReference({
		account,
		target,
		cliPath,
		dbPath,
		remoteHost,
		hasExclusiveLocalDatabase: hasExclusiveIMessageLocalDatabase({
			cfg,
			account,
			cliPath,
			dbPath,
			remoteHost
		}),
		service,
		replyToId: opts.replyToId,
		conversationReadOrigin: opts.conversationReadOrigin
	});
	const timeoutMs = opts.timeoutMs ?? Math.max(account.config.probeTimeoutMs ?? 0, 18e4);
	const pendingEchoTtlMs = resolvePendingPersistedEchoTtlMs(timeoutMs);
	const region = opts.region?.trim() || account.config.region?.trim() || "US";
	const maxBytes = typeof opts.maxBytes === "number" ? opts.maxBytes : typeof account.config.mediaMaxMb === "number" ? account.config.mediaMaxMb * 1024 * 1024 : 16 * 1024 * 1024;
	let message = opts.approvalPrompt ? addApprovalReactionHintToText({
		text,
		allowedDecisions: opts.approvalPrompt.allowedDecisions
	}) : text;
	const protectedRoles = protectIMessageFencedRoleMarkers(message);
	message = protectedRoles.text;
	let filePath;
	let mediaContentType;
	if (opts.mediaUrl?.trim()) {
		const resolved = await (opts.resolveAttachmentImpl ?? resolveOutboundAttachmentFromUrl)(opts.mediaUrl.trim(), maxBytes, {
			mediaAccess: opts.mediaAccess,
			localRoots: opts.mediaLocalRoots,
			readFile: opts.mediaReadFile
		});
		filePath = resolved.path;
		mediaContentType = resolved.contentType ?? void 0;
	}
	if (!message.trim() && !filePath) throw new Error("iMessage send requires text or media");
	if (message.trim()) {
		const tableMode = resolveMarkdownTableMode({
			cfg,
			channel: "imessage",
			accountId: account.accountId
		});
		protectedRoles.verifyProtectedRoles(message);
		message = convertMarkdownTables(message, tableMode);
		protectedRoles.verifyProtectedRoles(message);
	}
	protectedRoles.verifyProtectedRoles(message);
	message = stripInlineDirectiveTagsForDelivery(message).text;
	protectedRoles.verifyProtectedRoles(message);
	if (!message.trim() && !filePath) throw new Error("iMessage send requires text or media");
	const formatted = sanitizeIMessageFinalOutboundText(message, {
		formatMarkdown: true,
		protection: protectedRoles
	});
	message = formatted.text;
	if (!message.trim() && !filePath) throw new Error("iMessage send requires text or media");
	const echoText = resolveOutboundEchoText(message);
	const echoMedia = filePath ? resolveOutboundEchoMedia(mediaContentType) : void 0;
	let effectiveReplyToId = resolvedReplyToId;
	const runCliJson = opts.runCliJson ?? ((args) => runIMessageCliJson(cliPath, dbPath, args, timeoutMs));
	const requestOwnedRpc = async (method, rpcParams) => {
		const rpcClient = opts.createClient ? await opts.createClient({
			cliPath,
			dbPath,
			remoteHost
		}) : await createIMessageRpcClient({
			cliPath,
			dbPath,
			remoteHost
		});
		try {
			return await requestIMessageRpcSend(rpcClient, method, rpcParams, timeoutMs);
		} finally {
			await rpcClient.stop();
		}
	};
	const withRemoteFile = opts.withRemoteFile ?? withIMessageRemoteFile;
	if (filePath && (!resolvedReplyToId || opts.audioAsVoice)) {
		const attachmentResult = await trySendAttachmentForTarget({
			accountId: account.accountId,
			dbPath: chatDbLookupPath,
			target,
			service,
			sendTransport,
			filePath,
			audioAsVoice: opts.audioAsVoice,
			...resolvedReplyToId ? { replyToId: resolvedReplyToId } : {},
			echoMedia,
			pendingEchoTtlMs,
			timeoutMs,
			remoteHost,
			runCliJson,
			requestRpc: requestOwnedRpc,
			withRemoteFile,
			resolveMessageGuidImpl: opts.resolveMessageGuidImpl
		});
		if (attachmentResult) {
			if (!message.trim()) return attachmentResult;
			await opts.onDeliveryResult?.({
				...attachmentResult,
				content: "",
				messageIds: attachmentResult.receipt.platformMessageIds,
				visibleReplySent: true,
				...attachmentResult.receipt.replyToId ? { replyToId: attachmentResult.receipt.replyToId } : {}
			});
			let captionResult;
			try {
				captionResult = await sendMessageIMessage(to, text, {
					...opts,
					...opts.client ? { client: opts.client } : {},
					mediaUrl: void 0,
					onDeliveryResult: void 0
				});
			} catch (error) {
				throw createChannelPartialDeliveryError(error, {
					content: "",
					messageIds: attachmentResult.receipt.platformMessageIds,
					receipt: attachmentResult.receipt,
					visibleReplySent: true
				});
			}
			return {
				messageId: isConcreteIMessageMessageId(attachmentResult.messageId) ? attachmentResult.messageId : captionResult.messageId,
				...captionResult.guid ?? attachmentResult.guid ? { guid: captionResult.guid ?? attachmentResult.guid } : {},
				sentText: captionResult.sentText,
				...captionResult.echoText ?? attachmentResult.echoText ? { echoText: captionResult.echoText ?? attachmentResult.echoText } : {},
				...attachmentResult.echoMedia ? { echoMedia: attachmentResult.echoMedia } : {},
				receipt: createMessageReceiptFromOutboundResults({
					results: [{ receipt: attachmentResult.receipt }, { receipt: captionResult.receipt }],
					sentAt: Math.max(attachmentResult.receipt.sentAt, captionResult.receipt.sentAt)
				})
			};
		}
	}
	const params = {
		text: message,
		service: service || "auto",
		region,
		transport: sendTransport
	};
	if (resolvedReplyToId) params.reply_to = resolvedReplyToId;
	if (formatted.ranges.length > 0) params.formatting = formatted.ranges;
	if (filePath) params.file = filePath;
	if (target.kind === "chat_id") params.chat_id = target.chatId;
	else if (target.kind === "chat_guid") params.chat_guid = target.chatGuid;
	else if (target.kind === "chat_identifier") params.chat_identifier = target.chatIdentifier;
	else params.to = target.to;
	const echoScope = resolveOutboundEchoScope({
		accountId: account.accountId,
		target
	});
	const client = opts.client ?? (opts.createClient ? await opts.createClient({
		cliPath,
		dbPath,
		remoteHost
	}) : await createIMessageRpcClient({
		cliPath,
		dbPath,
		remoteHost
	}));
	const shouldClose = !opts.client;
	let closedClient = false;
	const stopOwnedClient = async () => {
		if (!shouldClose || closedClient) return;
		closedClient = true;
		await client.stop();
	};
	const requestSuccessfulSend = async (sendParams) => {
		const request = async (nativeParams) => await requestIMessageRpcSend(client, "send", nativeParams, timeoutMs);
		const response = filePath ? await withOriginalIMessageAttachmentPath(filePath, async (attachmentPath) => {
			if (remoteHost) return await withRemoteFile({
				remoteHost,
				localPath: attachmentPath,
				timeoutMs,
				use: async (remotePath) => request({
					...sendParams,
					file: remotePath
				})
			});
			return await request({
				...sendParams,
				file: attachmentPath
			});
		}) : await request(sendParams);
		const failure = resolveIMessageSendFailure(response);
		if (failure) throw new Error(failure);
		return response;
	};
	let result;
	const sendStartedAtMs = Date.now();
	let pendingEchoKey;
	try {
		try {
			if (echoScope) pendingEchoKey = rememberPersistedIMessageEcho({
				scope: echoScope,
				text: echoText,
				media: echoMedia,
				ttlMs: pendingEchoTtlMs,
				pending: true
			});
			result = await requestSuccessfulSend(params);
		} catch (error) {
			if (resolvedReplyToId && isThreadedReplyUnsupportedError(error)) {
				const plainParams = { ...params };
				delete plainParams.reply_to;
				result = await requestSuccessfulSend(plainParams);
				effectiveReplyToId = void 0;
			} else if (filePath || !isIMessageRpcSendTimeout(error)) throw error;
			else if (!shouldRecoverApprovalPromptGuid({
				approvalPrompt: opts.approvalPrompt,
				filePath,
				replyToId: resolvedReplyToId
			}) || !canCheckSentMessageAfterRpcTimeout({
				dbPath: chatDbLookupPath,
				resolveSentMessageGuidImpl: opts.resolveSentMessageGuidImpl
			})) throw error;
			else {
				const recoveredGuid = await resolveFallbackSentMessageGuid({
					dbPath: chatDbLookupPath,
					target,
					text: message,
					sentAfterMs: sendStartedAtMs,
					resolveSentMessageGuidImpl: opts.resolveSentMessageGuidImpl
				});
				if (recoveredGuid) result = {
					guid: recoveredGuid,
					status: "sent"
				};
				else throw error;
			}
		}
		const resolvedId = resolveMessageId(result);
		const messageId = resolvedId ?? (result?.ok || result?.success || result?.status === "sent" ? "ok" : "unknown");
		let approvalBindingMessageId = await resolveApprovalBindingMessageGuid({
			dbPath: chatDbLookupPath,
			messageId: resolvedId,
			result,
			resolveMessageGuidImpl: opts.resolveMessageGuidImpl
		});
		if (!approvalBindingMessageId && shouldRecoverApprovalPromptGuid({
			approvalPrompt: opts.approvalPrompt,
			filePath,
			replyToId: effectiveReplyToId
		})) approvalBindingMessageId = await resolveFallbackSentMessageGuid({
			dbPath: chatDbLookupPath,
			target,
			text: message,
			sentAfterMs: sendStartedAtMs,
			resolveSentMessageGuidImpl: opts.resolveSentMessageGuidImpl
		});
		if (echoScope) rememberPersistedIMessageEcho({
			scope: echoScope,
			text: echoText,
			media: echoMedia,
			messageId: resolvedId ?? void 0
		});
		const providerChatGuid = normalizeOptionalString(result.chat_guid) ?? normalizeOptionalString(result.chatGuid);
		const confirmedService = resolveIMessageDirectChatService(resultService(result.service) ?? service, providerChatGuid);
		if (resolvedId && isConcreteIMessageMessageId(resolvedId)) {
			const chatContext = chatContextFromIMessageTarget(target, confirmedService ?? service);
			rememberIMessageReplyCache({
				accountId: account.accountId,
				messageId: resolvedId,
				...chatContext,
				...providerChatGuid ? { chatGuid: providerChatGuid } : {},
				timestamp: Date.now(),
				isFromMe: true
			});
		}
		if (message && approvalBindingMessageId && opts.approvalPrompt) {
			const handleForKey = target.kind === "handle" ? normalizeIMessageHandle(target.to) : void 0;
			const conversation = {
				...target.kind === "chat_guid" ? { chatGuid: target.chatGuid } : {},
				...target.kind === "chat_identifier" ? { chatIdentifier: target.chatIdentifier } : {},
				...target.kind === "chat_id" ? { chatId: target.chatId } : {},
				...handleForKey ? { handle: handleForKey } : {}
			};
			registerIMessageApprovalReactionTarget({
				accountId: account.accountId,
				conversation,
				messageId: approvalBindingMessageId,
				approvalId: opts.approvalPrompt.approvalId,
				approvalKind: opts.approvalPrompt.approvalKind,
				allowedDecisions: opts.approvalPrompt.allowedDecisions
			});
		}
		return {
			messageId,
			...approvalBindingMessageId ? { guid: approvalBindingMessageId } : {},
			...confirmedService ? { service: confirmedService } : {},
			...providerChatGuid ? { chatGuid: providerChatGuid } : {},
			sentText: message,
			...echoText ? { echoText } : {},
			...echoMedia ? { echoMedia } : {},
			receipt: createIMessageSendReceipt({
				messageId,
				target,
				kind: filePath ? "media" : "text",
				...effectiveReplyToId ? { replyToId: effectiveReplyToId } : {}
			})
		};
	} catch (error) {
		forgetPersistedIMessageEchoKey(pendingEchoKey);
		throw error;
	} finally {
		await stopOwnedClient();
	}
}
//#endregion
export { maybeResolveIMessageApprovalPollVote as a, mapSentPollOptionsToDecisions as i, buildApprovalPollOptions as n, iMessageApprovalControlBindings as o, iMessageApprovalPollTargets as r, sendMessageIMessage as t };
