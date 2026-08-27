import { s as normalizeNullableString } from "./string-coerce-CIXf7egm.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { r as formatErrorMessage } from "./errors-CqPTYU6G.js";
import "./ingress-retry-policy-9Z6cseGJ.js";
import { t as DEFAULT_INGRESS_ADOPTION_STALL_MS } from "./ingress-drain-SxsnEN8i.js";
import { m as bindIngressLifecycleToReplyOptions } from "./channel-outbound-BbXJ4rch.js";
import "./error-runtime-oXQewkZq.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import { n as createChannelIngressError, r as createChannelIngressMonitor } from "./ingress-monitor-D70rNE7-.js";
import "./channel-secret-basic-runtime-BUtqhYr9.js";
import { l as runDetachedWebhookWork } from "./webhook-request-guards-DNMZaVoi.js";
import { t as getZaloRuntime } from "./runtime-DCdSmvQG2.js";
import { t as ZaloApiError } from "./api-jUY4Yv4p.js";
//#region extensions/zalo/src/webhook-spool.ts
const ZALO_WEBHOOK_SPOOL_VERSION = 1;
const ZALO_WEBHOOK_DRAIN_INTERVAL_MS = 500;
const ZALO_WEBHOOK_MAX_CONCURRENT_DELIVERIES = 8;
const ZaloWebhookPayloadError = createChannelIngressError("ZaloWebhookPayloadError");
function parseRawRecord(rawEvent) {
	let parsed;
	try {
		parsed = JSON.parse(rawEvent);
	} catch (error) {
		throw new ZaloWebhookPayloadError("Zalo webhook body contains invalid JSON.", { cause: error });
	}
	if (!isRecord(parsed)) throw new ZaloWebhookPayloadError("Zalo webhook body must be a JSON object.");
	return parsed;
}
function resolveUpdateRecord(envelope) {
	if (envelope.ok === true && isRecord(envelope.result)) return envelope.result;
	return envelope;
}
function inspectZaloWebhookEvent(rawEvent) {
	const update = resolveUpdateRecord(parseRawRecord(rawEvent));
	const message = isRecord(update.message) ? update.message : null;
	const eventId = normalizeNullableString(message?.message_id);
	if (!eventId) throw new ZaloWebhookPayloadError("Zalo webhook message is missing message.message_id.");
	const chatId = normalizeNullableString((isRecord(message?.chat) ? message.chat : null)?.id);
	if (!chatId) throw new ZaloWebhookPayloadError("Zalo webhook message is missing message.chat.id.");
	return {
		eventId,
		laneKey: `chat:${chatId}`,
		update
	};
}
function parseClaimedUpdate(payload, claimedId) {
	if (payload.version !== ZALO_WEBHOOK_SPOOL_VERSION || typeof payload.rawEvent !== "string") throw new ZaloWebhookPayloadError("Zalo webhook spool payload is invalid.");
	const facts = inspectZaloWebhookEvent(payload.rawEvent);
	if (facts.eventId !== claimedId) throw new ZaloWebhookPayloadError("Zalo webhook message id changed after durable admission.");
	const eventName = normalizeNullableString(facts.update.event_name);
	if (eventName !== "message.text.received" && eventName !== "message.image.received" && eventName !== "message.sticker.received" && eventName !== "message.unsupported.received") throw new ZaloWebhookPayloadError("Zalo webhook event_name is unsupported.");
	const message = facts.update.message;
	const from = isRecord(message.from) ? message.from : null;
	const chat = isRecord(message.chat) ? message.chat : null;
	if (!normalizeNullableString(from?.id)) throw new ZaloWebhookPayloadError("Zalo webhook message is missing message.from.id.");
	if (chat?.chat_type !== "PRIVATE" && chat?.chat_type !== "GROUP") throw new ZaloWebhookPayloadError("Zalo webhook message has an invalid chat type.");
	if (typeof message.date !== "number" || !Number.isFinite(message.date)) throw new ZaloWebhookPayloadError("Zalo webhook message has an invalid date.");
	if (eventName === "message.text.received" && typeof message.text !== "string") throw new ZaloWebhookPayloadError("Zalo text event is missing message.text.");
	return facts.update;
}
function isZaloAuthenticationFailure(error) {
	let current = error;
	const seen = /* @__PURE__ */ new Set();
	while (current && typeof current === "object" && !seen.has(current)) {
		seen.add(current);
		const candidate = current;
		if (current instanceof ZaloApiError && (current.errorCode === 401 || current.errorCode === 403) || candidate.status === 401 || candidate.status === 403 || candidate.statusCode === 401 || candidate.statusCode === 403) return true;
		current = candidate.cause;
	}
	return false;
}
function createZaloWebhookIngress(options) {
	const monitor = createChannelIngressMonitor({
		queue: options.queue ?? getZaloRuntime().state.openChannelIngressQueue({ accountId: options.accountId }),
		inspect: (rawEvent) => inspectZaloWebhookEvent(rawEvent),
		payload: {
			storage: "raw-event",
			version: ZALO_WEBHOOK_SPOOL_VERSION,
			serialize: (rawEvent) => rawEvent,
			deserialize: (rawEvent) => rawEvent,
			createClaimError: (kind) => new ZaloWebhookPayloadError(kind === "invalid-version" ? "Zalo webhook spool payload is invalid." : "Zalo webhook identity changed after durable admission.")
		},
		deliver: async (_rawEvent, lifecycle, claim) => {
			const update = parseClaimedUpdate(claim.payload, claim.id);
			await options.deliver(update, bindIngressLifecycleToReplyOptions(lifecycle).turnAdoptionLifecycle);
		},
		pollIntervalMs: ZALO_WEBHOOK_DRAIN_INTERVAL_MS,
		retention: { failedMaxEntries: 5e3 },
		waitForDeliveryIdleBeforeRepump: false,
		runPumpTask: runDetachedWebhookWork,
		deferredClaims: "wait-on-stop",
		drain: {
			adoptionStallTimeoutMs: DEFAULT_INGRESS_ADOPTION_STALL_MS,
			startLimit: ZALO_WEBHOOK_MAX_CONCURRENT_DELIVERIES,
			retryPolicy: {
				maxAttempts: 8,
				deadLetterMinAgeMs: 0
			},
			resolveNonRetryableFailure: (error) => {
				if (error instanceof ZaloWebhookPayloadError) return {
					reason: "invalid-event",
					message: error.message
				};
				if (isZaloAuthenticationFailure(error)) return {
					reason: "authentication-failed",
					message: formatErrorMessage(error)
				};
				return null;
			},
			onLog: (message) => options.runtime.error?.(`zalo ingress: ${message}`)
		},
		createStoppedError: () => /* @__PURE__ */ new Error("Zalo ingress stopped."),
		onError: (error) => options.runtime.error?.(`zalo ingress drain failed: ${formatErrorMessage(error)}`)
	});
	return {
		accept: async (rawEvent) => {
			await monitor.admit(rawEvent);
		},
		start: monitor.start,
		stop: monitor.stop
	};
}
const zaloWebhookIngressRuntime = { createZaloWebhookIngress };
//#endregion
export { zaloWebhookIngressRuntime as n, ZaloWebhookPayloadError as t };
