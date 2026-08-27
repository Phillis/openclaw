import { t as hasNonEmptyString } from "./string-coerce-CIXf7egm.js";
import "./src-BntaCZM-.js";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.js";
import { n as safeParseJsonRecord } from "./json-coercion-ighRFv8Y.js";
import { r as resolveMessageReceiptPrimaryId } from "./receipt-BzekpwQi.js";
//#region src/agents/embedded-agent-message-delivery.ts
const NON_DELIVERY_IDS = /* @__PURE__ */ new Set(["skipped", "suppressed"]);
const STATUSES = /* @__PURE__ */ new Set([
	"settled",
	"suppressed",
	"dryRun",
	"failed"
]);
const PLUGIN_ENVELOPE_KEYS = [
	"details",
	"payload",
	"result",
	"results",
	"toolResult"
];
const EMPTY_DELIVERY_FACT = {
	partialDelivery: false,
	createdThreadIds: []
};
function isDeliveryStatus(value) {
	return typeof value === "string" && STATUSES.has(value);
}
function deliveryId(value) {
	const id = typeof value === "string" ? value.trim() : "";
	return id && !NON_DELIVERY_IDS.has(id.toLowerCase()) ? id : void 0;
}
function projectReceiptIdentity(delivery) {
	const receipt = delivery?.receipt;
	const primaryPlatformMessageId = [
		receipt ? resolveMessageReceiptPrimaryId(receipt) : void 0,
		delivery?.messageId,
		delivery?.pollId,
		...receipt?.parts.map((part) => part.platformMessageId) ?? []
	].map(deliveryId).find(Boolean);
	const createdThreadIds = [receipt?.threadId, ...receipt?.parts.map((part) => part.threadId) ?? []].flatMap((id) => typeof id === "string" && id.trim() ? [id.trim()] : []);
	return {
		primaryPlatformMessageId,
		createdThreadIds: [...new Set(createdThreadIds)]
	};
}
function normalizeStatus(value) {
	return typeof value === "string" ? value.trim().toLowerCase() : void 0;
}
function visitPluginEnvelope(value, predicate, depth = 0) {
	if (!value || typeof value !== "object" || depth > 4) return false;
	if (Array.isArray(value)) return value.some((item) => visitPluginEnvelope(item, predicate, depth + 1));
	const record = asOptionalRecord(value);
	if (!record) return false;
	if (predicate(record)) return true;
	if (typeof record.text === "string") {
		const parsed = safeParseJsonRecord(record.text);
		if (parsed && visitPluginEnvelope(parsed, predicate, depth + 1)) return true;
	}
	if (Array.isArray(record.content) && record.content.some((item) => visitPluginEnvelope(item, predicate, depth + 1))) return true;
	return PLUGIN_ENVELOPE_KEYS.some((key) => visitPluginEnvelope(record[key], predicate, depth + 1));
}
const PLUGIN_SIGNALS = {
	dryRun: (record) => record.dryRun === true || normalizeStatus(record.status) === "dry_run",
	partial: (record) => record.sentBeforeError === true || record.visibleReplySent === true || normalizeStatus(record.status) === "partial_failed",
	conversation: (record) => [
		record.topicId,
		record.threadId,
		record.messageThreadId,
		asOptionalRecord(record.thread)?.id
	].some((id) => hasNonEmptyString(id) || typeof id === "number" && Number.isFinite(id)),
	nonDelivery: (record) => {
		const id = normalizeStatus(record.messageId);
		return id !== void 0 && NON_DELIVERY_IDS.has(id) || normalizeStatus(record.status) === "suppressed";
	},
	noOp: (record) => {
		const removed = record.removed;
		const status = normalizeStatus(record.status);
		return removed === null || removed === false || removed === 0 || Array.isArray(removed) && removed.length === 0 || record.applied === false || record.changed === false || record.created === false || record.deleted === false || record.sent === false || record.updated === false || status === "noop" || status === "no_op" || status === "not_found";
	},
	delivery: (record) => {
		const message = asOptionalRecord(record.message);
		return [
			record.messageId,
			record.pollId,
			message?.id
		].map(normalizeStatus).filter((id) => Boolean(id)).some((id) => !NON_DELIVERY_IDS.has(id)) || normalizeStatus(record.status) === "sent" || normalizeStatus(record.text) === "sent";
	},
	deliveryId: (record) => [
		record.messageId,
		record.pollId,
		asOptionalRecord(record.message)?.id
	].map(normalizeStatus).some((id) => Boolean(id && !NON_DELIVERY_IDS.has(id))),
	ok: (record) => record.ok === true || normalizeStatus(record.text) === "ok"
};
function pluginEnvelopeHas(value, signal) {
	return visitPluginEnvelope(value, PLUGIN_SIGNALS[signal]);
}
function readPluginDeliveryId(value) {
	let found;
	visitPluginEnvelope(value, (record) => {
		found = [
			record.messageId,
			record.pollId,
			asOptionalRecord(record.message)?.id
		].map(deliveryId).find(Boolean);
		return found !== void 0;
	});
	return found;
}
function projectPluginPayload(value) {
	if (pluginEnvelopeHas(value, "dryRun")) return {
		status: "dryRun",
		...EMPTY_DELIVERY_FACT
	};
	if (pluginEnvelopeHas(value, "partial")) return {
		status: "settled",
		partialDelivery: true,
		createdThreadIds: []
	};
	if (pluginEnvelopeHas(value, "nonDelivery")) return {
		status: "suppressed",
		...EMPTY_DELIVERY_FACT
	};
	if (pluginEnvelopeHas(value, "noOp")) return {
		status: "failed",
		...EMPTY_DELIVERY_FACT
	};
	if (!pluginEnvelopeHas(value, "delivery") && !pluginEnvelopeHas(value, "ok")) return;
	const primaryPlatformMessageId = readPluginDeliveryId(value);
	return {
		status: "settled",
		...primaryPlatformMessageId ? { primaryPlatformMessageId } : {},
		...EMPTY_DELIVERY_FACT
	};
}
function pluginBroadcastHasDelivery(value) {
	return visitPluginEnvelope(value, (record) => Array.isArray(record.results) && record.results.some((item) => {
		const entry = asOptionalRecord(item);
		if (!entry || entry.ok !== true || pluginEnvelopeHas(entry, "nonDelivery")) return false;
		return [entry.payload, entry.toolResult].some((payload) => projectPluginPayload(payload)?.status === "settled");
	}));
}
function projectSend(result) {
	const delivery = result.result;
	const { primaryPlatformMessageId, createdThreadIds } = projectReceiptIdentity(delivery);
	const partialDelivery = result.deliveryStatus === "partial_failed" || result.sentBeforeError === true;
	const nonDeliveryId = typeof delivery?.messageId === "string" && NON_DELIVERY_IDS.has(delivery.messageId.trim().toLowerCase());
	return {
		status: result.dryRun ? "dryRun" : partialDelivery ? "settled" : result.deliveryStatus === "suppressed" || nonDeliveryId ? "suppressed" : result.deliveryStatus === "sent" || primaryPlatformMessageId ? "settled" : "failed",
		...primaryPlatformMessageId ? { primaryPlatformMessageId } : {},
		partialDelivery,
		createdThreadIds
	};
}
function projectPoll(result) {
	const { primaryPlatformMessageId, createdThreadIds } = projectReceiptIdentity(result.result);
	return {
		status: result.dryRun ? "dryRun" : primaryPlatformMessageId ? "settled" : "failed",
		...primaryPlatformMessageId ? { primaryPlatformMessageId } : {},
		partialDelivery: false,
		createdThreadIds
	};
}
function projectEmbeddedMessageDeliveryFact(result) {
	if (result.kind === "send") return result.handledBy === "core" && result.sendResult ? projectSend(result.sendResult) : result.handledBy === "internal-source" ? {
		status: result.dryRun ? "dryRun" : "settled",
		partialDelivery: false,
		createdThreadIds: []
	} : void 0;
	if (result.kind === "poll") return result.handledBy === "core" && result.pollResult ? projectPoll(result.pollResult) : void 0;
	if (result.kind !== "broadcast") return;
	const entries = result.payload.results.map((entry) => ({
		entry,
		fact: entry.result ? projectSend(entry.result) : entry.sentBeforeError ? {
			status: "settled",
			partialDelivery: true,
			createdThreadIds: []
		} : entry.ok ? projectPluginPayload(entry.payload) : void 0
	}));
	const facts = entries.flatMap(({ fact }) => fact ? [fact] : []);
	const settled = facts.find((fact) => fact.status === "settled");
	if (settled || entries.some(({ entry, fact }) => entry.ok && !entry.result && !fact)) return settled;
	return facts.find((fact) => fact.status === "suppressed") ?? facts.find((fact) => fact.status === "dryRun") ?? {
		status: "failed",
		partialDelivery: false,
		createdThreadIds: []
	};
}
function attachEmbeddedMessageDeliveryFact(result, fact) {
	const details = asOptionalRecord(result.details);
	if (!fact) {
		if (!details || !("messageDelivery" in details)) return result;
		const { messageDelivery: _reserved, ...rest } = details;
		return {
			...result,
			details: rest
		};
	}
	return {
		...result,
		details: {
			...details,
			messageDelivery: fact
		}
	};
}
function isDeliveredCoreCurrentChannelWidgetResult(params) {
	if (params.sourceReplyDeliveryMode !== "message_tool_only" || params.toolName !== "show_widget" || params.isToolError || params.coreBuiltinToolNames?.has("show_widget") !== true) return false;
	const details = asOptionalRecord(params.result)?.details;
	const presentation = asOptionalRecord(asOptionalRecord(details)?.presentation);
	const receipt = asOptionalRecord(presentation?.receipt);
	if (asOptionalRecord(details)?.kind !== "widget" || presentation?.target !== "current_channel") return false;
	return [
		receipt?.primaryPlatformMessageId,
		...Array.isArray(receipt?.platformMessageIds) ? receipt.platformMessageIds : [],
		...Array.isArray(receipt?.parts) ? receipt.parts.map((part) => asOptionalRecord(part)?.platformMessageId) : []
	].some((id) => hasNonEmptyString(id));
}
function readEmbeddedMessageDeliveryFact(value) {
	const fact = asOptionalRecord(value);
	const createdThreadIds = Array.isArray(fact?.createdThreadIds) ? fact.createdThreadIds.filter((id) => typeof id === "string") : [];
	if (!fact || !isDeliveryStatus(fact.status) || typeof fact.partialDelivery !== "boolean" || !Array.isArray(fact.createdThreadIds) || createdThreadIds.length !== fact.createdThreadIds.length || fact.primaryPlatformMessageId !== void 0 && typeof fact.primaryPlatformMessageId !== "string") return;
	return {
		status: fact.status,
		...fact.primaryPlatformMessageId ? { primaryPlatformMessageId: fact.primaryPlatformMessageId } : {},
		partialDelivery: fact.partialDelivery,
		createdThreadIds
	};
}
//#endregion
export { projectEmbeddedMessageDeliveryFact as a, pluginEnvelopeHas as i, isDeliveredCoreCurrentChannelWidgetResult as n, readEmbeddedMessageDeliveryFact as o, pluginBroadcastHasDelivery as r, attachEmbeddedMessageDeliveryFact as t };
