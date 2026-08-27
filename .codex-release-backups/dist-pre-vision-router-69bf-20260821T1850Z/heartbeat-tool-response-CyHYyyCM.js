import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { n as readTrimmedStringAlias } from "./string-readers-e58-jh1A.js";
import { t as HEARTBEAT_TOKEN } from "./tokens-CMI0yx54.js";
import { n as assertCronJobScratchContent } from "./scratch-contract-DyG_7g0F.js";
//#region src/auto-reply/heartbeat-tool-response.ts
/** Tool name used by heartbeat runs to report visible or silent progress. */
const HEARTBEAT_RESPONSE_TOOL_NAME = "heartbeat_respond";
const HEARTBEAT_RESPONSE_CHANNEL_DATA_KEY = "openclawHeartbeatResponse";
const HEARTBEAT_SCRATCH_PROPOSAL = Symbol("openclawHeartbeatScratchProposal");
/** Allowed heartbeat response outcomes. */
const HEARTBEAT_TOOL_OUTCOMES = [
	"no_change",
	"progress",
	"done",
	"blocked",
	"needs_attention"
];
/** Allowed heartbeat notification priorities. */
const HEARTBEAT_TOOL_PRIORITIES = [
	"low",
	"normal",
	"high"
];
const OUTCOMES = new Set(HEARTBEAT_TOOL_OUTCOMES);
const PRIORITIES = new Set(HEARTBEAT_TOOL_PRIORITIES);
function readBooleanAlias(record, ...keys) {
	for (const key of keys) {
		const value = record[key];
		if (typeof value === "boolean") return value;
	}
}
/** Validate and normalize unknown heartbeat tool output. */
function normalizeHeartbeatToolResponse(value) {
	if (!isRecord(value)) return;
	const outcome = normalizeOptionalString(value.outcome);
	const notify = readBooleanAlias(value, "notify");
	const summary = normalizeOptionalString(value.summary);
	if (!outcome || !OUTCOMES.has(outcome) || notify === void 0 || !summary) return;
	const priority = normalizeOptionalString(value.priority);
	const notificationText = readTrimmedStringAlias(value, ["notificationText", "notification_text"]);
	const reason = normalizeOptionalString(value.reason);
	const nextCheck = readTrimmedStringAlias(value, ["nextCheck", "next_check"]);
	const scratch = typeof value.scratch === "string" ? value.scratch : void 0;
	if (scratch !== void 0) try {
		assertCronJobScratchContent(scratch);
	} catch {
		return;
	}
	return {
		outcome,
		notify,
		summary,
		...notificationText ? { notificationText } : {},
		...reason ? { reason } : {},
		...priority && PRIORITIES.has(priority) ? { priority } : {},
		...nextCheck ? { nextCheck } : {},
		...scratch !== void 0 ? { scratch } : {}
	};
}
/** Resolve the user-visible notification text for a heartbeat response. */
function getHeartbeatToolNotificationText(response) {
	return response.notify ? (response.notificationText ?? response.summary).trim() : "";
}
/** Store public heartbeat response metadata while keeping scratch process-private. */
function createHeartbeatToolResponsePayload(response) {
	const { scratch, ...publicResponse } = response;
	const payload = {
		text: response.notify ? getHeartbeatToolNotificationText(response) : HEARTBEAT_TOKEN,
		channelData: { [HEARTBEAT_RESPONSE_CHANNEL_DATA_KEY]: publicResponse }
	};
	if (scratch !== void 0) Object.defineProperty(payload, HEARTBEAT_SCRATCH_PROPOSAL, {
		value: scratch,
		enumerable: false
	});
	return payload;
}
function getHeartbeatToolResponseFromPayload(payload) {
	return normalizeHeartbeatToolResponse(payload?.channelData?.[HEARTBEAT_RESPONSE_CHANNEL_DATA_KEY]);
}
/** Find the last heartbeat tool response embedded in a reply result. */
function resolveHeartbeatToolResponseFromReplyResult(replyResult) {
	if (!replyResult) return;
	const payloads = Array.isArray(replyResult) ? replyResult : [replyResult];
	for (let idx = payloads.length - 1; idx >= 0; idx -= 1) {
		const response = getHeartbeatToolResponseFromPayload(payloads[idx]);
		if (response) return response;
	}
}
/** Reads the non-serializable scratch proposal captured for the heartbeat turn. */
function resolveHeartbeatScratchProposalFromReplyResult(replyResult) {
	if (!replyResult) return;
	const payloads = Array.isArray(replyResult) ? replyResult : [replyResult];
	for (let idx = payloads.length - 1; idx >= 0; idx -= 1) {
		const payload = payloads[idx];
		if (!getHeartbeatToolResponseFromPayload(payload)) continue;
		return payload?.[HEARTBEAT_SCRATCH_PROPOSAL];
	}
}
//#endregion
export { getHeartbeatToolNotificationText as a, resolveHeartbeatToolResponseFromReplyResult as c, createHeartbeatToolResponsePayload as i, HEARTBEAT_TOOL_OUTCOMES as n, normalizeHeartbeatToolResponse as o, HEARTBEAT_TOOL_PRIORITIES as r, resolveHeartbeatScratchProposalFromReplyResult as s, HEARTBEAT_RESPONSE_TOOL_NAME as t };
