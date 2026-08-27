import { l as normalizeOptionalString, t as hasNonEmptyString } from "./string-coerce-CIXf7egm.js";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.js";
import { t as normalizeMediaReferenceForComparison } from "./media-reference-comparison-CpVTnBVR.js";
import { i as hasVisibleAgentPayload, t as collectMediaUrlsFromRecord } from "./message-visibility-CIRFeK2g.js";
//#region src/agents/accepted-session-spawn.ts
/** Normalizes accepted child-session spawn results from loose tool payloads. */
/** Normalize a tool result that accepted a child session spawn. */
function normalizeAcceptedSessionSpawnResult(result) {
	const details = asOptionalRecord(asOptionalRecord(result)?.details);
	if (!details || details.status !== "accepted") return null;
	const runId = normalizeOptionalString(details.runId);
	const childSessionKey = normalizeOptionalString(details.childSessionKey);
	if (!runId || !childSessionKey) return null;
	return {
		runId,
		childSessionKey
	};
}
/** Return true when a collection contains at least one accepted child spawn. */
function hasAcceptedSessionSpawn(acceptedSessionSpawns) {
	return (acceptedSessionSpawns ?? []).some((spawn) => {
		const record = asOptionalRecord(spawn);
		if (!record) return false;
		return Boolean(normalizeOptionalString(record.runId) && normalizeOptionalString(record.childSessionKey));
	});
}
//#endregion
//#region src/agents/embedded-agent-runner/delivery-evidence.ts
/**
* Extracts visible delivery evidence from embedded-agent run results.
*/
function collectSourceReplyFinalMarkers(value) {
	if (!Array.isArray(value)) return [];
	return value.flatMap((entry) => {
		if (!entry || typeof entry !== "object" || Array.isArray(entry)) return [];
		const marker = entry.sourceReplyFinal;
		return typeof marker === "boolean" ? [marker] : [];
	});
}
/** Resolve explicit progress/final evidence, or undefined for legacy runtimes. */
function resolveExplicitFinalSourceReplyDeliveryEvidence(result) {
	const markers = [...collectSourceReplyFinalMarkers(result.messagingToolSentTargets), ...collectSourceReplyFinalMarkers(result.messagingToolSourceReplyPayloads)];
	return markers.length > 0 ? markers.some(Boolean) : void 0;
}
/** Preserve legacy completion semantics unless the runtime emitted progress/final markers. */
function hasCompletedSourceReplyDeliveryEvidence(result) {
	return resolveExplicitFinalSourceReplyDeliveryEvidence(result) ?? hasCommittedSourceReplyDeliveryEvidence(result);
}
/** Returns whether messaging-tool evidence completes the current source reply. */
function hasCompletedMessagingToolDeliveryEvidence(result) {
	return resolveExplicitFinalSourceReplyDeliveryEvidence(result) ?? hasMessagingToolDeliveryEvidence(result);
}
/** Returns whether delivery evidence completes the current interactive turn. */
function hasCompletedTerminalDeliveryEvidence(result) {
	const explicitFinal = resolveExplicitFinalSourceReplyDeliveryEvidence(result);
	return hasCompletedSourceReplyDeliveryEvidence(result) || explicitFinal === void 0 && hasVisibleOutboundDeliveryEvidence(result) || result.didSendDeterministicApprovalPrompt === true;
}
function hasNonEmptyArray(value) {
	return Array.isArray(value) && value.length > 0;
}
function hasNonEmptyStringArray(value) {
	return Array.isArray(value) && value.some(hasNonEmptyString);
}
function collectStringValues(value, output) {
	if (typeof value === "string" && value.trim()) output.add(value.trim());
	else if (Array.isArray(value)) value.filter(hasNonEmptyString).forEach((entry) => output.add(entry.trim()));
}
function normalizeEvidenceStatus(value) {
	return typeof value === "string" ? value.trim().toLowerCase() || void 0 : void 0;
}
function hasVisibleMessagingToolTarget(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return false;
	const target = value;
	if ("text" in target || "mediaUrls" in target || "hasRichContent" in target || "visible" in target) return hasNonEmptyString(target.text) || hasNonEmptyStringArray(target.mediaUrls) || target.hasRichContent === true || target.visible === true;
	return true;
}
/** Collects media URLs from agent payloads and committed messaging-tool delivery metadata. */
function collectDeliveredMediaUrls(result) {
	const urls = /* @__PURE__ */ new Set();
	if (Array.isArray(result.payloads)) {
		for (const payload of result.payloads) if (payload && typeof payload === "object" && !Array.isArray(payload)) collectMediaUrlsFromRecord(payload, urls);
	}
	for (const url of collectMessagingToolDeliveredMediaUrls(result)) urls.add(url);
	return Array.from(urls);
}
/** Collects media URLs recorded by messaging-tool sends and their target attachments. */
function collectMessagingToolDeliveredMediaUrls(result) {
	const urls = /* @__PURE__ */ new Set();
	collectStringValues(result.messagingToolSentMediaUrls, urls);
	if (Array.isArray(result.messagingToolSentTargets)) {
		for (const target of result.messagingToolSentTargets) if (target && typeof target === "object" && !Array.isArray(target)) collectMediaUrlsFromRecord(target, urls);
	}
	return Array.from(urls);
}
function getPayloadDeliveryStatusRecord(result) {
	return result.deliveryStatus && typeof result.deliveryStatus === "object" ? result.deliveryStatus : void 0;
}
function getPayloadDeliveryOutcomes(result) {
	const outcomes = getPayloadDeliveryStatusRecord(result)?.payloadOutcomes;
	return Array.isArray(outcomes) ? outcomes : void 0;
}
function collectPayloadOutcomeMediaUrls(result, statuses) {
	const payloads = Array.isArray(result.payloads) ? result.payloads : [];
	const outcomes = getPayloadDeliveryOutcomes(result) ?? [];
	const urls = /* @__PURE__ */ new Set();
	for (const outcome of outcomes) {
		if (!outcome || typeof outcome !== "object" || Array.isArray(outcome)) continue;
		const record = outcome;
		if (!statuses(record)) continue;
		const index = typeof record.index === "number" && Number.isInteger(record.index) ? record.index : void 0;
		const payload = index === void 0 ? void 0 : payloads[index];
		if (!hasDeliverableAgentPayload(payload)) continue;
		for (const url of collectDeliveredMediaUrls({ payloads: [payload] })) urls.add(url);
	}
	return Array.from(urls);
}
function hasDeliverableAgentPayload(payload) {
	if (payload && typeof payload === "object" && !Array.isArray(payload)) {
		if (payload.visible === false) return false;
	}
	return hasVisibleAgentPayload({ payloads: [payload] }, {
		includeErrorPayloads: false,
		includeReasoningPayloads: false
	});
}
function collectDeliverablePayloadMediaUrls(payloads) {
	if (!Array.isArray(payloads)) return [];
	const urls = /* @__PURE__ */ new Set();
	for (const payload of payloads) {
		if (!hasDeliverableAgentPayload(payload)) continue;
		for (const url of collectDeliveredMediaUrls({ payloads: [payload] })) urls.add(url);
	}
	return Array.from(urls);
}
/** Collect automatic-delivery media proven sent by aggregate or per-payload evidence. */
function collectAutomaticDeliveredMediaUrls(result, options = {}) {
	const outcomes = getPayloadDeliveryOutcomes(result);
	if (outcomes) {
		const payloads = Array.isArray(result.payloads) ? result.payloads : [];
		return collectPayloadOutcomeMediaUrls(result, (outcome) => normalizeEvidenceStatus(outcome.status) === "sent" || options.includeSuppressedOutcomes !== false && normalizeEvidenceStatus(outcome.status) === "suppressed" || options.includeAmbiguousSinglePayloadFailure === true && normalizeEvidenceStatus(outcome.status) === "failed" && outcome.sentBeforeError === true && outcomes.length === 1 && payloads.length === 1);
	}
	const status = normalizeEvidenceStatus(result.deliveryStatus?.status);
	return status === "sent" || status === "suppressed" ? collectDeliverablePayloadMediaUrls(result.payloads) : [];
}
/** Collect media whose send may have committed before a per-payload failure. */
function collectAmbiguousAutomaticMediaUrls(result) {
	return collectPayloadOutcomeMediaUrls(result, (outcome) => normalizeEvidenceStatus(outcome.status) === "failed" && outcome.sentBeforeError === true);
}
/** Check that a partial automatic send classifies every expected-media payload. */
function hasCompleteAutomaticMediaDeliveryOutcomeEvidence(result, expectedMediaUrls) {
	if (result.payloadsTruncated === true) return false;
	const payloads = Array.isArray(result.payloads) ? result.payloads : [];
	const outcomes = Array.isArray(result.deliveryStatus?.payloadOutcomes) ? result.deliveryStatus.payloadOutcomes : [];
	if (payloads.length === 0 || outcomes.length === 0) return false;
	const classifiedIndexes = /* @__PURE__ */ new Set();
	for (const outcome of outcomes) {
		if (!outcome || typeof outcome !== "object" || Array.isArray(outcome)) continue;
		const record = outcome;
		const index = typeof record.index === "number" && Number.isInteger(record.index) && record.index >= 0 && record.index < payloads.length ? record.index : void 0;
		const status = normalizeEvidenceStatus(record.status);
		const classified = status === "sent" || status === "suppressed" || status === "failed" && typeof record.sentBeforeError === "boolean";
		if (index !== void 0 && classified) classifiedIndexes.add(index);
	}
	const expected = new Set(expectedMediaUrls.map(normalizeMediaReferenceForComparison));
	return payloads.every((payload, index) => {
		return !collectDeliveredMediaUrls({ payloads: [payload] }).some((url) => expected.has(normalizeMediaReferenceForComparison(url))) || classifiedIndexes.has(index);
	});
}
/** Returns whether any automatic payload was sent or may have committed before failure. */
function hasPayloadOutcomeSendEvidence(result) {
	return getPayloadDeliveryOutcomes(result)?.some((outcome) => {
		if (!outcome || typeof outcome !== "object" || Array.isArray(outcome)) return false;
		const record = outcome;
		return normalizeEvidenceStatus(record.status) === "sent" || record.sentBeforeError === true;
	}) === true;
}
function hasPositiveNumber(value) {
	return typeof value === "number" && Number.isFinite(value) && value > 0;
}
/** Extracts a gateway result payload when the response carries delivery evidence fields. */
function getGatewayAgentResult(response) {
	if (!response || typeof response !== "object") return null;
	const candidate = hasAgentDeliveryEvidenceShape(response) ? response : response.result;
	if (!candidate || typeof candidate !== "object" || !hasAgentDeliveryEvidenceShape(candidate)) return null;
	return candidate;
}
function hasAgentDeliveryEvidenceShape(value) {
	return "payloads" in value || "deliveryStatus" in value || "didSendViaMessagingTool" in value || "messagingToolSentTexts" in value || "messagingToolSentMediaUrls" in value || "messagingToolSentTargets" in value || "acceptedSessionSpawns" in value || "successfulCronAdds" in value || "meta" in value;
}
/** Returns whether the messaging tool attempted or committed an outbound delivery. */
function hasMessagingToolDeliveryEvidence(result) {
	return result.didSendViaMessagingTool === true || hasCommittedMessagingToolDeliveryEvidence(result);
}
/** Returns whether messaging-tool metadata proves committed text, media, or target delivery. */
function hasCommittedMessagingToolDeliveryEvidence(result) {
	return hasNonEmptyStringArray(result.messagingToolSentTexts) || hasNonEmptyStringArray(result.messagingToolSentMediaUrls) || hasNonEmptyArray(result.messagingToolSentTargets);
}
function collectNonEmptyStringArray(value) {
	return Array.isArray(value) ? value.flatMap((item) => typeof item === "string" && item.trim() ? [item.trim()] : []) : [];
}
function hasUnaccountedStrings(aggregate, accounted) {
	const remaining = /* @__PURE__ */ new Map();
	for (const value of accounted) remaining.set(value, (remaining.get(value) ?? 0) + 1);
	for (const value of aggregate) {
		const count = remaining.get(value) ?? 0;
		if (count === 0) return true;
		if (count === 1) remaining.delete(value);
		else remaining.set(value, count - 1);
	}
	return false;
}
/** Returns whether aggregate message-tool sends lack route-checkable target records. */
function hasUnaccountedMessagingToolAggregateEvidence(result) {
	const routeCheckableTargets = Array.isArray(result.messagingToolSentTargets) ? result.messagingToolSentTargets.flatMap((target) => {
		if (!target || typeof target !== "object" || Array.isArray(target)) return [];
		const record = target;
		return typeof record.to === "string" && record.to.trim() ? [record] : [];
	}) : [];
	const aggregateTexts = collectNonEmptyStringArray(result.messagingToolSentTexts);
	const aggregateMediaUrls = collectNonEmptyStringArray(result.messagingToolSentMediaUrls);
	const accountedTexts = routeCheckableTargets.flatMap((target) => typeof target.text === "string" && target.text.trim() ? [target.text.trim()] : []);
	const accountedMediaUrls = routeCheckableTargets.flatMap((target) => collectNonEmptyStringArray(target.mediaUrls));
	if (hasUnaccountedStrings(aggregateTexts, accountedTexts) || hasUnaccountedStrings(aggregateMediaUrls, accountedMediaUrls)) return true;
	return result.didSendViaMessagingTool === true && routeCheckableTargets.length === 0 && aggregateTexts.length === 0 && aggregateMediaUrls.length === 0;
}
/** Returns whether messaging-tool metadata proves a user-visible committed delivery. */
function hasVisibleCommittedMessagingToolDeliveryEvidence(result) {
	return hasNonEmptyStringArray(result.messagingToolSentTexts) || hasNonEmptyStringArray(result.messagingToolSentMediaUrls) || Array.isArray(result.messagingToolSentTargets) && result.messagingToolSentTargets.some(hasVisibleMessagingToolTarget);
}
function hasGranularMessagingToolDeliveryEvidence(result) {
	return result.messagingToolSentTexts !== void 0 || result.messagingToolSentMediaUrls !== void 0 || result.messagingToolSentTargets !== void 0;
}
/** Returns whether a source reply was visibly delivered through the message tool. */
function hasCommittedSourceReplyDeliveryEvidence(result) {
	return result.didDeliverSourceReplyViaMessageTool === true || hasVisibleAgentPayload({ payloads: result.messagingToolSourceReplyPayloads });
}
/** Returns whether outbound metadata proves a visible message, spawn, or cron side effect. */
function hasVisibleOutboundDeliveryEvidence(result) {
	return hasVisibleCommittedMessagingToolDeliveryEvidence(result) || result.didSendViaMessagingTool === true && !hasGranularMessagingToolDeliveryEvidence(result) || Array.isArray(result.acceptedSessionSpawns) && hasAcceptedSessionSpawn(result.acceptedSessionSpawns) || hasPositiveNumber(result.successfulCronAdds);
}
/** Returns whether committed non-messaging resource effects make replay unsafe. */
function hasCommittedNonMessagingOutboundDeliveryEvidence(result) {
	return Array.isArray(result.acceptedSessionSpawns) && hasAcceptedSessionSpawn(result.acceptedSessionSpawns) || hasPositiveNumber(result.successfulCronAdds);
}
/** Returns whether committed outbound evidence makes replay unsafe. */
function hasCommittedOutboundDeliveryEvidence(result) {
	return hasMessagingToolDeliveryEvidence(result) || hasCommittedNonMessagingOutboundDeliveryEvidence(result);
}
/** Returns whether any tool progress or outbound side effect makes a retry unsafe. */
function hasOutboundDeliveryEvidence(result) {
	return hasCommittedOutboundDeliveryEvidence(result) || hasPositiveNumber(result.meta?.toolSummary?.calls);
}
/** Formats an agent-command delivery failure message from delivery status metadata. */
function getAgentCommandDeliveryFailure(result) {
	const status = normalizeEvidenceStatus(result.deliveryStatus?.status);
	if (status !== "failed" && status !== "partial_failed") return;
	const message = result.deliveryStatus?.errorMessage;
	if (hasNonEmptyString(message)) return message;
	return status === "partial_failed" ? "agent delivery partially failed" : "agent delivery failed";
}
//#endregion
export { normalizeAcceptedSessionSpawnResult as S, hasUnaccountedMessagingToolAggregateEvidence as _, getAgentCommandDeliveryFailure as a, resolveExplicitFinalSourceReplyDeliveryEvidence as b, hasCommittedOutboundDeliveryEvidence as c, hasCompletedMessagingToolDeliveryEvidence as d, hasCompletedSourceReplyDeliveryEvidence as f, hasPayloadOutcomeSendEvidence as g, hasOutboundDeliveryEvidence as h, collectMessagingToolDeliveredMediaUrls as i, hasCommittedSourceReplyDeliveryEvidence as l, hasMessagingToolDeliveryEvidence as m, collectAutomaticDeliveredMediaUrls as n, getGatewayAgentResult as o, hasCompletedTerminalDeliveryEvidence as p, collectDeliveredMediaUrls as r, hasCommittedMessagingToolDeliveryEvidence as s, collectAmbiguousAutomaticMediaUrls as t, hasCompleteAutomaticMediaDeliveryOutcomeEvidence as u, hasVisibleCommittedMessagingToolDeliveryEvidence as v, hasAcceptedSessionSpawn as x, hasVisibleOutboundDeliveryEvidence as y };
