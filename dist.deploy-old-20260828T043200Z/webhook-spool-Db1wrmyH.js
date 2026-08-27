import { s as normalizeNullableString } from "./string-coerce-CIXf7egm.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { At as boolean, Rn as string, Tn as object, Zn as unknown, fn as looseObject, wn as number, yt as _enum } from "./schemas-CZ9Toj_c.js";
import "./ingress-retry-policy-BoJKd6vi.js";
import { t as DEFAULT_INGRESS_ADOPTION_STALL_MS } from "./ingress-drain-ypsN4E6P.js";
import { g as bindIngressLifecycleToReplyOptions, h as createChannelIngressError } from "./channel-outbound-0oFCMpw9.js";
import "./error-runtime-CmA1H4Zg.js";
import "./string-coerce-runtime-C8jKEm3h.js";
import { n as createChannelIngressMonitor } from "./ingress-monitor-5WsYdIbW.js";
import { l as runDetachedWebhookWork } from "./webhook-request-guards-BYzmIdMp.js";
import { t as getZaloRuntime } from "./runtime-DCdSmvQG.js";
import { t as ZaloApiError } from "./api-BmvllmdQ.js";
//#region extensions/zalo/src/webhook-spool.ts
const ZALO_WEBHOOK_SPOOL_VERSION = 1;
const ZALO_WEBHOOK_DRAIN_INTERVAL_MS = 500;
const ZALO_WEBHOOK_MAX_CONCURRENT_DELIVERIES = 8;
const ZaloWebhookPayloadError = createChannelIngressError("ZaloWebhookPayloadError");
const nonEmptyWebhookStringSchema = string().transform((value) => normalizeNullableString(value)).pipe(string());
const optionalWebhookStringSchema = string().optional().catch(void 0);
const webhookEnvelopeSchema = looseObject({
	ok: unknown().optional(),
	result: looseObject({}).optional().catch(void 0)
}).transform((envelope) => envelope.ok === true && envelope.result ? envelope.result : envelope);
const webhookAdmissionSchema = looseObject({ message: looseObject({
	message_id: nonEmptyWebhookStringSchema,
	chat: looseObject({ id: nonEmptyWebhookStringSchema })
}) });
const webhookMessageSchema = object({
	message_id: nonEmptyWebhookStringSchema,
	from: object({
		id: nonEmptyWebhookStringSchema,
		name: optionalWebhookStringSchema,
		display_name: optionalWebhookStringSchema,
		avatar: optionalWebhookStringSchema,
		is_bot: boolean().optional().catch(void 0)
	}),
	chat: object({
		id: nonEmptyWebhookStringSchema,
		chat_type: _enum(["PRIVATE", "GROUP"])
	}),
	date: number().finite(),
	text: optionalWebhookStringSchema,
	photo_url: optionalWebhookStringSchema,
	caption: optionalWebhookStringSchema,
	sticker: optionalWebhookStringSchema,
	message_type: optionalWebhookStringSchema
});
const webhookUpdateSchema = object({
	event_name: _enum([
		"message.text.received",
		"message.image.received",
		"message.sticker.received",
		"message.unsupported.received"
	]),
	message: webhookMessageSchema
}).superRefine((update, context) => {
	if (update.event_name === "message.text.received" && update.message.text === void 0) context.addIssue({
		code: "custom",
		path: ["message", "text"],
		message: "text event requires message.text"
	});
});
function parseRawRecord(rawEvent) {
	let parsed;
	try {
		parsed = JSON.parse(rawEvent);
	} catch (error) {
		throw new ZaloWebhookPayloadError("Zalo webhook body contains invalid JSON.", { cause: error });
	}
	const envelope = webhookEnvelopeSchema.safeParse(parsed);
	if (!envelope.success) throw new ZaloWebhookPayloadError("Zalo webhook body must be a JSON object.");
	return envelope.data;
}
function inspectZaloWebhookEvent(rawEvent) {
	const update = parseRawRecord(rawEvent);
	const admission = webhookAdmissionSchema.safeParse(update);
	if (!admission.success) {
		if (admission.error.issues.some((issue) => issue.path[0] === "message" && (issue.path.length === 1 || issue.path[1] === "message_id"))) throw new ZaloWebhookPayloadError("Zalo webhook message is missing message.message_id.");
		if (admission.error.issues.some((issue) => issue.path[0] === "message" && issue.path[1] === "chat")) throw new ZaloWebhookPayloadError("Zalo webhook message is missing message.chat.id.");
		throw new ZaloWebhookPayloadError("Zalo webhook message is missing message.message_id.");
	}
	return {
		eventId: admission.data.message.message_id,
		laneKey: `chat:${admission.data.message.chat.id}`,
		update
	};
}
function parseClaimedUpdate(payload, claimedId) {
	if (payload.version !== ZALO_WEBHOOK_SPOOL_VERSION || typeof payload.rawEvent !== "string") throw new ZaloWebhookPayloadError("Zalo webhook spool payload is invalid.");
	const facts = inspectZaloWebhookEvent(payload.rawEvent);
	if (facts.eventId !== claimedId) throw new ZaloWebhookPayloadError("Zalo webhook message id changed after durable admission.");
	const parsed = webhookUpdateSchema.safeParse(facts.update);
	if (!parsed.success) {
		const paths = parsed.error.issues.map((issue) => issue.path.join("."));
		if (paths.some((path) => path === "event_name")) throw new ZaloWebhookPayloadError("Zalo webhook event_name is unsupported.");
		if (paths.some((path) => path === "message.from" || path.startsWith("message.from.id"))) throw new ZaloWebhookPayloadError("Zalo webhook message is missing message.from.id.");
		if (paths.some((path) => path === "message.chat" || path.startsWith("message.chat.id"))) throw new ZaloWebhookPayloadError("Zalo webhook message is missing message.chat.id.");
		if (paths.some((path) => path.startsWith("message.chat.chat_type"))) throw new ZaloWebhookPayloadError("Zalo webhook message has an invalid chat type.");
		if (paths.some((path) => path.startsWith("message.date"))) throw new ZaloWebhookPayloadError("Zalo webhook message has an invalid date.");
		if (paths.some((path) => path.startsWith("message.text"))) throw new ZaloWebhookPayloadError("Zalo text event is missing message.text.");
		throw new ZaloWebhookPayloadError("Zalo webhook event_name is unsupported.");
	}
	const { event_name: eventName, message } = parsed.data;
	return {
		event_name: eventName,
		message: {
			message_id: claimedId,
			from: message.from,
			chat: message.chat,
			date: message.date,
			...message.text !== void 0 ? { text: message.text } : {},
			...message.photo_url !== void 0 ? { photo_url: message.photo_url } : {},
			...message.caption !== void 0 ? { caption: message.caption } : {},
			...message.sticker !== void 0 ? { sticker: message.sticker } : {},
			...message.message_type !== void 0 ? { message_type: message.message_type } : {}
		}
	};
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
