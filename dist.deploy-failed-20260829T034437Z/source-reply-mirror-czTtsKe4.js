import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.js";
import { o as normalizeOptionalTrimmedStringList } from "./string-normalization-e_fvmxMf.js";
import { n as normalizeAccountId } from "./account-id-BH0zJUew.js";
import { f as resolveAgentIdFromSessionKey } from "./session-key-Dbce_H9p.js";
import { o as resolveSessionStorePathCore } from "./paths-DVAvlIOc.js";
import { n as readTrimmedStringAlias } from "./string-readers-e58-jh1A.js";
import { f as loadSessionEntry } from "./session-accessor.sqlite-entry-CNdoUuFZ.js";
import { t as getChannelPlugin } from "./registry-CL5HFEAI.js";
import "./plugins-CmLI4MOi.js";
import { r as getOwnedSessionTranscriptWriterFence } from "./transcript-write-context-LK0MNWC3.js";
import { nt as updateSessionEntry } from "./session-accessor-B-FKZX9M.js";
import { a as hasRestartRecoveryTerminalRun, r as hasActiveRestartRecoverySourceClaim } from "./restart-recovery-state-6FYlAu33.js";
import "./sessions-CdrF1uzY.js";
import { t as appendAssistantMessageToSessionTranscript } from "./transcript-DIvtCZB2.js";
import { r as resolveChannelThreadAddressing } from "./thread-addressing-Bcb_z0XK.js";
import { E as normalizeOutboundLocation } from "./reply-payload-i0RzN2iF.js";
import { s as projectOutboundPayloadPlanForMirror, t as createOutboundPayloadPlan } from "./payloads-BNOW0uoZ.js";
//#region src/config/sessions/restart-recovery-receipt.ts
function hasActiveClaim(entry, scope) {
	return entry.sessionId === scope.sessionId && hasActiveRestartRecoverySourceClaim(entry, scope.sourceTurnId);
}
function hasExactDeliveryClaim(entry, scope) {
	return hasActiveClaim(entry, scope) && entry.restartRecoveryDeliveryToolCallId === scope.toolCallId;
}
function hasClaimlessLiveDeliveryState(entry, scope) {
	return entry.sessionId === scope.sessionId && normalizeOptionalString(entry.restartRecoveryDeliveryRunId) === void 0 && normalizeOptionalString(entry.restartRecoveryDeliverySourceRunId) === void 0 && entry.restartRecoveryDeliveryReceiptState === void 0 && normalizeOptionalString(entry.restartRecoveryDeliveryToolCallId) === void 0;
}
function loadCurrent(scope) {
	return loadSessionEntry({
		sessionKey: scope.sessionKey,
		storePath: scope.storePath,
		readConsistency: "latest"
	});
}
/** Persists ambiguity before a terminal external send is allowed to start. */
async function beginRestartRecoveryTerminalDelivery(scope) {
	let started = false;
	const updated = await updateSessionEntry({
		sessionKey: scope.sessionKey,
		storePath: scope.storePath
	}, (entry) => {
		if (!hasActiveClaim(entry, scope) || entry.restartRecoveryDeliveryReceiptState || entry.restartRecoveryDeliveryToolCallId) return null;
		started = true;
		return {
			restartRecoveryDeliveryReceiptState: "terminal-pending",
			restartRecoveryDeliveryToolCallId: scope.toolCallId,
			updatedAt: Date.now()
		};
	}, {
		skipMaintenance: true,
		takeCacheOwnership: true
	});
	if (started && updated !== null && hasExactDeliveryClaim(updated, scope) && updated.restartRecoveryDeliveryReceiptState === "terminal-pending") return "started";
	const current = loadCurrent(scope);
	if (current?.sessionId === scope.sessionId && hasRestartRecoveryTerminalRun(current, scope.sourceTurnId)) return "already-delivered";
	if (current && hasClaimlessLiveDeliveryState(current, scope)) return "not-applicable";
	if (!current || !hasActiveClaim(current, scope)) return "stale";
	if (current.restartRecoveryDeliveryReceiptState || current.restartRecoveryDeliveryToolCallId) return current.restartRecoveryDeliveryReceiptState === "delivered-terminal" ? "already-delivered" : "delivery-ambiguous";
	throw new Error("failed to persist terminal delivery intent");
}
/** Resolves a pre-send ambiguity only after the provider confirms delivery. */
async function completeRestartRecoveryTerminalDelivery(scope) {
	const updated = await updateSessionEntry({
		sessionKey: scope.sessionKey,
		storePath: scope.storePath
	}, (entry) => {
		if (!hasExactDeliveryClaim(entry, scope) || entry.restartRecoveryDeliveryReceiptState !== "terminal-pending") return null;
		return {
			restartRecoveryDeliveryReceiptState: "delivered-terminal",
			updatedAt: Date.now()
		};
	}, {
		skipMaintenance: true,
		takeCacheOwnership: true
	});
	if (updated !== null && hasExactDeliveryClaim(updated, scope) && updated.restartRecoveryDeliveryReceiptState === "delivered-terminal") return "recorded";
	const current = loadCurrent(scope);
	if (!current || !hasActiveClaim(current, scope)) return "stale";
	if (hasExactDeliveryClaim(current, scope) && current.restartRecoveryDeliveryReceiptState === "delivered-terminal") return "recorded";
	throw new Error("failed to persist terminal delivery completion");
}
/** Clears the pre-send intent only when the provider proves no delivery occurred. */
async function cancelRestartRecoveryTerminalDelivery(scope) {
	const updated = await updateSessionEntry({
		sessionKey: scope.sessionKey,
		storePath: scope.storePath
	}, (entry) => {
		if (!hasExactDeliveryClaim(entry, scope) || entry.restartRecoveryDeliveryReceiptState !== "terminal-pending") return null;
		return {
			restartRecoveryDeliveryReceiptState: void 0,
			restartRecoveryDeliveryToolCallId: void 0,
			updatedAt: Date.now()
		};
	}, {
		skipMaintenance: true,
		takeCacheOwnership: true
	});
	if (updated !== null && hasActiveClaim(updated, scope) && !updated.restartRecoveryDeliveryReceiptState && !updated.restartRecoveryDeliveryToolCallId) return "cleared";
	const current = loadCurrent(scope);
	if (!current || !hasActiveClaim(current, scope)) return "stale";
	if (!current.restartRecoveryDeliveryReceiptState && !current.restartRecoveryDeliveryToolCallId) return "cleared";
	if (hasExactDeliveryClaim(current, scope) && current.restartRecoveryDeliveryReceiptState === "delivered-terminal") return "stale";
	throw new Error("failed to clear terminal delivery intent");
}
//#endregion
//#region src/infra/outbound/source-reply-mirror.ts
function buildTerminalSourceReplyNoSendResult(outcome) {
	return {
		outcome,
		result: {
			status: outcome,
			delivered: false,
			message: outcome === "already_delivered" ? "The completed reply was already delivered. Do not retry it." : "The completed reply may already have been delivered. Do not retry it."
		}
	};
}
function readStringArray(value) {
	return normalizeOptionalTrimmedStringList(value);
}
function readFirstString(params, keys) {
	return readTrimmedStringAlias(params, keys);
}
function resolveSourceReplyTarget(params) {
	return readFirstString(params, [
		"target",
		"to",
		"channelId",
		"chatId"
	]);
}
function resolveSourceReplyThreadId(params) {
	return readFirstString(params.actionParams, ["threadId", "messageThreadId"]);
}
function resolveDeliveredThreadPlacement(params, currentThreadId) {
	const payload = asOptionalRecord(params.deliveredPayload);
	const receipt = asOptionalRecord(asOptionalRecord(payload?.result)?.receipt) ?? asOptionalRecord(payload?.receipt);
	if (!receipt) return;
	const deliveredThreadId = normalizeOptionalString(receipt.threadId);
	return deliveredThreadId ? deliveredThreadId === currentThreadId ? "match" : "mismatch" : currentThreadId ? "mismatch" : "match";
}
function resolveSourceReplyThreadPlacement(params, threadAddressing) {
	const currentThreadId = normalizeOptionalString(params.toolContext?.currentThreadTs);
	const deliveredPlacement = resolveDeliveredThreadPlacement(params, currentThreadId);
	if (deliveredPlacement) return deliveredPlacement;
	if (params.actionParams.topLevel === true) return currentThreadId ? "mismatch" : "match";
	if (threadAddressing === "message" && params.replyToIsExplicit === true && !currentThreadId && normalizeOptionalString(params.actionParams.replyTo)) return "mismatch";
	for (const key of ["threadId", "messageThreadId"]) {
		if (!Object.hasOwn(params.actionParams, key)) continue;
		const explicitThreadId = normalizeOptionalString(params.actionParams[key]);
		if (!explicitThreadId) return currentThreadId ? "mismatch" : "match";
		return explicitThreadId === currentThreadId ? "match" : "mismatch";
	}
	return currentThreadId ? "unknown" : "match";
}
function resolveThreadedSourceTarget(params, requestedTarget) {
	const threadId = resolveSourceReplyThreadId(params);
	if (!threadId) return requestedTarget;
	return normalizeOptionalString(getChannelPlugin(params.channel)?.threading?.resolveCurrentChannelId?.({
		to: requestedTarget,
		threadId
	})) ?? requestedTarget;
}
function hasExplicitDeliveryFailure(payload, depth = 0) {
	if (!payload || typeof payload !== "object" || depth > 4) return false;
	if (Array.isArray(payload)) return payload.some((value) => hasExplicitDeliveryFailure(value, depth + 1));
	const record = payload;
	if (record.ok === false || record.delivered === false || record.dryRun === true) return true;
	const messageId = normalizeOptionalLowercaseString(record.messageId);
	if (messageId === "skipped" || messageId === "suppressed") return true;
	const status = normalizeOptionalLowercaseString(record.status);
	if (status === "failed" || status === "error" || status === "skipped" || status === "suppressed" || status === "dry_run") return true;
	const deliveryStatus = normalizeOptionalLowercaseString(record.deliveryStatus);
	if (deliveryStatus === "failed" || deliveryStatus === "error" || deliveryStatus === "skipped" || deliveryStatus === "suppressed" || deliveryStatus === "dry_run") return true;
	return [
		"details",
		"payload",
		"result",
		"results",
		"sendResult",
		"toolResult"
	].some((key) => hasExplicitDeliveryFailure(record[key], depth + 1));
}
function resolveCurrentSourceTurnId(toolContext) {
	return normalizeOptionalString(toolContext?.currentSourceTurnId);
}
function resolveTerminalSourceReplyDeliveryReceipt(params) {
	const toolCallId = normalizeOptionalString(params.toolCallId);
	if (params.sourceReplyFinal !== true) return;
	if (!toolCallId) throw new Error("terminal source reply requires tool-call correlation");
	if (!params.sessionId || !isCurrentSourceConversation(params)) return;
	const sourceTurnId = resolveCurrentSourceTurnId(params.toolContext);
	if (!sourceTurnId) return;
	const agentId = params.agentId ?? resolveAgentIdFromSessionKey(params.sessionKey);
	return {
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		sourceTurnId,
		storePath: resolveSessionStorePathCore(params.cfg.session?.store, { agentId }),
		toolCallId
	};
}
/** Arms the fail-closed state before a terminal source reply can reach a provider. */
async function beginTerminalSourceReplyDelivery(params) {
	const receipt = resolveTerminalSourceReplyDeliveryReceipt(params);
	if (!receipt) return;
	const result = await beginRestartRecoveryTerminalDelivery(receipt);
	if (result === "not-applicable") return;
	if (result === "already-delivered") return buildTerminalSourceReplyNoSendResult("already_delivered");
	if (result === "delivery-ambiguous" || result === "stale") return buildTerminalSourceReplyNoSendResult("delivery_ambiguous");
	return receipt;
}
/** Cancels a pre-send intent only when dispatch proved that no send occurred. */
async function cancelTerminalSourceReplyDelivery(receipt) {
	if (receipt) await cancelRestartRecoveryTerminalDelivery(receipt);
}
/** Reconciles the provider result while an unresolved intent remains fail closed. */
async function reconcileTerminalSourceReplyDelivery(params) {
	if (!params.receipt) return "not-applicable";
	if (hasExplicitDeliveryFailure(params.deliveredPayload)) {
		if (params.preservePendingOnExplicitFailure) return "pending";
		await cancelRestartRecoveryTerminalDelivery(params.receipt);
		return "not-delivered";
	}
	if (!isExactCurrentSourceConversation({
		...params.mirror,
		deliveredPayload: params.deliveredPayload
	})) return "not-source";
	await completeRestartRecoveryTerminalDelivery(params.receipt);
	return "delivered";
}
function resolveTranscriptMirrorIdempotencyKey(params) {
	if (params.sourceReplyFinal !== true || !params.idempotencyKey || !params.sourceTurnId) return params.idempotencyKey;
	return `${params.idempotencyKey}:terminal-receipt:${params.sourceTurnId}`;
}
function isCurrentSourceConversation(params, threadPlacement = resolveSourceReplyThreadPlacement(params, resolveChannelThreadAddressing(params.channel))) {
	if (params.action !== "send" && params.action !== "poll") return false;
	if (!params.sessionKey?.trim()) return false;
	const toolContext = params.toolContext;
	if (!toolContext) return false;
	const accountId = normalizeOptionalString(params.accountId);
	if (accountId) {
		const currentAccountId = normalizeOptionalString(params.currentAccountId);
		if (!currentAccountId || normalizeAccountId(accountId) !== normalizeAccountId(currentAccountId)) return false;
	}
	const currentChannel = normalizeOptionalLowercaseString(toolContext.currentChannelProvider);
	if (!currentChannel || currentChannel !== normalizeOptionalLowercaseString(params.channel)) return false;
	const currentTargets = [normalizeOptionalString(toolContext.currentMessagingTarget), normalizeOptionalString(toolContext.currentChannelId)].filter((target) => Boolean(target));
	if (currentTargets.length === 0) return false;
	const requestedTarget = resolveSourceReplyTarget(params.actionParams);
	if (!requestedTarget) return false;
	if (threadPlacement === "mismatch") return false;
	const threadedTarget = resolveThreadedSourceTarget(params, requestedTarget);
	const matchesToolContextTarget = getChannelPlugin(params.channel)?.threading?.matchesToolContextTarget;
	if (threadPlacement === "match" && (matchesToolContextTarget?.({
		target: requestedTarget,
		toolContext
	}) || threadedTarget !== requestedTarget && matchesToolContextTarget?.({
		target: threadedTarget,
		toolContext
	}))) return true;
	return currentTargets.some((currentTarget) => requestedTarget === currentTarget || threadedTarget === currentTarget);
}
function isExactCurrentSourceConversation(params) {
	const threadPlacement = resolveSourceReplyThreadPlacement(params, resolveChannelThreadAddressing(params.channel));
	return threadPlacement === "match" && isCurrentSourceConversation(params, threadPlacement);
}
/** Confirms that a successful send reached the exact trusted source conversation. */
function isDeliveredCurrentSourceReply(params) {
	return !hasExplicitDeliveryFailure(params.deliveredPayload) && isExactCurrentSourceConversation(params);
}
const CURRENT_SOURCE_REPLY_ACTION_NAMES = /* @__PURE__ */ new Set(["reply"]);
/** Reply-type message actions address a message id rather than a conversation target. */
function isCurrentSourceReplyActionName(action) {
	return CURRENT_SOURCE_REPLY_ACTION_NAMES.has(action.trim().toLowerCase());
}
function normalizeMessageIdValue(value) {
	if (typeof value === "number" && Number.isFinite(value)) return String(value);
	return normalizeOptionalString(value);
}
/**
* Confirms a successful reply-type action addressed the message that triggered the
* current run. Reply actions resolve their conversation from the replied-to message,
* so target matching cannot apply; replying to the run's own inbound message is the
* one implicit route that provably lands in the current source conversation.
*/
function isDeliveredCurrentSourceReplyAction(params) {
	if (!isCurrentSourceReplyActionName(params.action)) return false;
	if (hasExplicitDeliveryFailure(params.deliveredPayload)) return false;
	if (!params.sessionKey?.trim()) return false;
	const toolContext = params.toolContext;
	if (!toolContext) return false;
	const accountId = normalizeOptionalString(params.accountId);
	if (accountId) {
		const currentAccountId = normalizeOptionalString(params.currentAccountId);
		if (!currentAccountId || normalizeAccountId(accountId) !== normalizeAccountId(currentAccountId)) return false;
	}
	const currentChannel = normalizeOptionalLowercaseString(toolContext.currentChannelProvider);
	if (!currentChannel || currentChannel !== normalizeOptionalLowercaseString(params.channel)) return false;
	const requestedTarget = resolveSourceReplyTarget(params.actionParams);
	if (requestedTarget) {
		const matchesToolContextTarget = getChannelPlugin(params.channel)?.threading?.matchesToolContextTarget;
		if (!matchesToolContextTarget?.({
			target: requestedTarget,
			toolContext
		})) {
			if (![normalizeOptionalString(toolContext.currentMessagingTarget), normalizeOptionalString(toolContext.currentChannelId)].filter((target) => Boolean(target)).some((target) => target === requestedTarget)) return false;
		}
	}
	const repliedToMessageId = normalizeMessageIdValue(params.actionParams.messageId ?? params.actionParams.replyTo);
	const currentMessageId = normalizeMessageIdValue(toolContext.currentMessageId);
	return Boolean(repliedToMessageId && currentMessageId && repliedToMessageId === currentMessageId);
}
/** Mirrors successful outbound source replies into the owning session transcript. */
async function mirrorDeliveredSourceReplyToTranscript(params) {
	if (hasExplicitDeliveryFailure(params.deliveredPayload)) return false;
	const threadPlacement = resolveSourceReplyThreadPlacement(params, resolveChannelThreadAddressing(params.channel));
	if (!isCurrentSourceConversation(params, threadPlacement)) return false;
	if (params.sourceReplyFinal === true && threadPlacement !== "match") return false;
	const mirror = projectOutboundPayloadPlanForMirror(createOutboundPayloadPlan([{
		text: readFirstString(params.actionParams, [
			"message",
			"content",
			"text",
			"caption"
		]) ?? "",
		mediaUrl: readFirstString(params.actionParams, [
			"mediaUrl",
			"media",
			"path",
			"filePath",
			"fileUrl"
		]),
		mediaUrls: readStringArray(params.actionParams.mediaUrls),
		presentation: params.actionParams.presentation,
		interactive: params.actionParams.interactive,
		channelData: params.actionParams.channelData,
		location: normalizeOutboundLocation(params.actionParams.location)
	}]));
	if (!mirror.text && mirror.mediaUrls.length === 0) return false;
	const sourceTurnId = resolveCurrentSourceTurnId(params.toolContext);
	const writerFence = getOwnedSessionTranscriptWriterFence();
	if ((await appendAssistantMessageToSessionTranscript({
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		...params.sessionId ? { expectedSessionId: params.sessionId } : {},
		...writerFence?.expectedLifecycleRevision !== void 0 ? { expectedLifecycleRevision: writerFence.expectedLifecycleRevision } : {},
		...writerFence ? { expectedWriterRunId: writerFence.expectedWriterRunId } : {},
		text: mirror.text,
		mediaUrls: mirror.mediaUrls.length ? mirror.mediaUrls : void 0,
		idempotencyKey: resolveTranscriptMirrorIdempotencyKey({
			idempotencyKey: params.idempotencyKey,
			sourceReplyFinal: params.sourceReplyFinal,
			sourceTurnId
		}),
		...params.sourceReplyFinal !== void 0 ? { deliveryMirror: {
			kind: "message-tool-source-reply",
			final: params.sourceReplyFinal,
			...params.toolCallId ? { toolCallId: params.toolCallId } : {},
			...sourceTurnId ? { sourceTurnId } : {}
		} } : {},
		config: params.cfg
	})).ok) return true;
	return false;
}
//#endregion
export { isDeliveredCurrentSourceReplyAction as a, isDeliveredCurrentSourceReply as i, cancelTerminalSourceReplyDelivery as n, mirrorDeliveredSourceReplyToTranscript as o, isCurrentSourceReplyActionName as r, reconcileTerminalSourceReplyDelivery as s, beginTerminalSourceReplyDelivery as t };
