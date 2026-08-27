import { g as readStringValue, t as hasNonEmptyString } from "./string-coerce-CIXf7egm.js";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.js";
import { c as normalizeToolPolicyName } from "./tool-policy-shared-DmpG3HvD.js";
import "./tool-policy-B1rvCc4B.js";
import { o as readToolResultDetails, r as isToolResultError } from "./tool-result-error-CnEQjVCq.js";
import { c as isMessageToolSendActionName, s as isMessageToolConversationCreateActionName, u as isMessagingToolDeliveryAction } from "./tool-loop-detection-BBBu2KgN.js";
import { i as pluginEnvelopeHas, o as readEmbeddedMessageDeliveryFact, r as pluginBroadcastHasDelivery } from "./embedded-agent-message-delivery-Dwtqwdl4.js";
//#region src/agents/embedded-agent-message-tool-source-reply.ts
const EXPLICIT_MESSAGE_ROUTE_KEYS = [
	"channel",
	"target",
	"to",
	"channelId",
	"provider"
];
function resolveMessageToolSourceReplyFinal(args) {
	return (asOptionalRecord(args) ?? {}).final !== false;
}
function resultConfirmsCurrentSourceRoute(value) {
	return asOptionalRecord(asOptionalRecord(value)?.details)?.sourceReplyRoute === "current-source";
}
function hasExplicitMessageRoute(args) {
	return EXPLICIT_MESSAGE_ROUTE_KEYS.some((key) => hasNonEmptyString(args[key])) || Array.isArray(args.targets) && args.targets.some((value) => hasNonEmptyString(value));
}
function isMessageToolSourceReplyActionName(action) {
	return isMessageToolSendActionName(action) || [
		"reply",
		"thread-reply",
		"poll"
	].includes(normalizeStatus(action) ?? "");
}
function readMessageToolSourceReplyText(args) {
	const record = asOptionalRecord(args) ?? {};
	if (!isMessageToolSourceReplyActionName(record.action)) return;
	if (normalizeStatus(record.action) === "poll") return readStringValue(record.pollQuestion) ?? readStringValue(record.poll_question);
	return [
		"content",
		"message",
		"text",
		"body"
	].map((key) => readStringValue(record[key])).find((value) => value !== void 0);
}
function normalizeStatus(value) {
	return typeof value === "string" ? value.trim().toLowerCase() : void 0;
}
function hasPluginMessagingDeliveryId(value) {
	return pluginEnvelopeHas(value, "deliveryId");
}
function isDeliveredMessagingToolResult(params) {
	const args = asOptionalRecord(params.args) ?? {};
	const action = normalizeStatus(args.action);
	const results = [params.result, params.hookResult];
	if (args.dryRun === true || results.some((result) => pluginEnvelopeHas(result, "dryRun"))) return false;
	if (results.some((result) => pluginEnvelopeHas(result, "partial"))) return true;
	if (action && isMessageToolConversationCreateActionName(action) && results.some((result) => pluginEnvelopeHas(result, "conversation"))) return true;
	if (action === "broadcast" && results.some(pluginBroadcastHasDelivery)) return true;
	if (params.isError || results.some(isToolResultError)) return false;
	const normalizedToolName = normalizeToolPolicyName(params.toolName ?? "message");
	const nonDelivery = results.some((result) => pluginEnvelopeHas(result, "nonDelivery"));
	const noOp = results.some((result) => pluginEnvelopeHas(result, "noOp"));
	if (!nonDelivery && !noOp && isMessagingToolDeliveryAction(normalizedToolName, args) && action !== "broadcast" && results.some((result) => pluginEnvelopeHas(result, "ok"))) return true;
	return !nonDelivery && !noOp && results.some((result) => pluginEnvelopeHas(result, "delivery"));
}
function isDeliveredMessageToolOnlySourceReplyResult(params) {
	const confirmedCurrentSourceRoute = resultConfirmsCurrentSourceRoute(params.result) || resultConfirmsCurrentSourceRoute(params.hookResult);
	const deliveryFact = readEmbeddedMessageDeliveryFact(readToolResultDetails(params.hookResult ?? params.result)?.messageDelivery);
	if (params.sourceReplyDeliveryMode !== "message_tool_only" && !confirmedCurrentSourceRoute) return false;
	if (normalizeToolPolicyName(params.toolName) !== "message") return false;
	const args = asOptionalRecord(params.args) ?? {};
	const sourceRouteReplyAction = (params.allowExplicitSourceRoute === true || confirmedCurrentSourceRoute) && isMessageToolSourceReplyActionName(args.action);
	if (!isMessageToolSendActionName(args.action) && !sourceRouteReplyAction) return false;
	if (hasExplicitMessageRoute(args) && params.allowExplicitSourceRoute !== true && !confirmedCurrentSourceRoute) return false;
	return params.deliveryConfirmed ?? (deliveryFact ? deliveryFact.status === "settled" && (!params.isError || deliveryFact.partialDelivery) : isDeliveredMessagingToolResult(params));
}
//#endregion
export { resolveMessageToolSourceReplyFinal as a, readMessageToolSourceReplyText as i, isDeliveredMessageToolOnlySourceReplyResult as n, isDeliveredMessagingToolResult as r, hasPluginMessagingDeliveryId as t };
