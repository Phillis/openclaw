import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { t as createSubsystemLogger } from "./subsystem-a4KzJVZG.js";
import { a as resolveReceiptSourceId } from "./receipt-BzekpwQi.js";
import { f as normalizeMessagePresentation, o as hasReplyPayloadContent, v as renderMessagePresentationFallbackText } from "./payload-C7E4iMOo.js";
import { t as adaptMessagePresentationForChannel } from "./presentation-limits-WuXKq1ZQ.js";
import { t as resolveAgentScopedOutboundMediaAccess } from "./read-capability-Xm6bB9tS.js";
import { n as flattenMarkdownDetails, t as stripInternalRuntimeScaffolding } from "./protocol-scaffolding-CfV8Yu3p.js";
import { u as summarizeOutboundPayloadForTransport } from "./payloads-BNOW0uoZ.js";
import { n as resolveOutboundChannelMessageAdapter } from "./channel-resolution-B1taGHmD.js";
//#region src/infra/outbound/deliver-payload.ts
const log$1 = createSubsystemLogger("outbound/deliver");
function deliveryKindForPayload(payload, payloadSummary) {
	if (payloadSummary.mediaUrls.length > 0 || payload.mediaUrl || payload.mediaUrls?.length) return "media";
	if (payload.presentation || payload.interactive || payload.channelData || payload.audioAsVoice) return "other";
	return "text";
}
function normalizeEmptyPayloadForDelivery(payload) {
	const text = typeof payload.text === "string" ? payload.text : "";
	if (!text.trim()) {
		if (!hasReplyPayloadContent({
			...payload,
			text
		}, { extraContent: payload.location != null })) return null;
		if (text) return {
			...payload,
			text: ""
		};
	}
	return payload;
}
function normalizePayloadsForChannelDelivery(plan, handler) {
	const normalizedPayloads = [];
	for (const entry of plan) {
		let sanitizedPayload = stripInternalRuntimeScaffoldingFromPayload(entry.payload);
		if (!handler.preserveMarkdownDetails && sanitizedPayload.text) sanitizedPayload = {
			...sanitizedPayload,
			text: flattenMarkdownDetails(sanitizedPayload.text)
		};
		if (handler.sanitizeText && sanitizedPayload.text) {
			if (!handler.shouldSkipPlainTextSanitization?.(sanitizedPayload)) sanitizedPayload = {
				...sanitizedPayload,
				text: handler.sanitizeText(sanitizedPayload)
			};
		}
		const normalizedPayload = handler.normalizePayload ? handler.normalizePayload(sanitizedPayload) : sanitizedPayload;
		const normalized = normalizedPayload ? normalizeEmptyPayloadForDelivery(stripInternalRuntimeScaffoldingFromPayload(normalizedPayload)) : null;
		if (normalized) normalizedPayloads.push({
			index: entry.sourceIndex,
			payload: normalized
		});
	}
	return handler.normalizePayloadBatch ? handler.normalizePayloadBatch(normalizedPayloads) : normalizedPayloads;
}
function stripInternalRuntimeScaffoldingFromValue(value) {
	if (typeof value === "string") return stripInternalRuntimeScaffolding(value);
	if (Array.isArray(value)) {
		let changed = false;
		const next = value.map((entry) => {
			const stripped = stripInternalRuntimeScaffoldingFromValue(entry);
			changed ||= stripped !== entry;
			return stripped;
		});
		return changed ? next : value;
	}
	if (!value || typeof value !== "object") return value;
	const proto = Object.getPrototypeOf(value);
	if (proto !== Object.prototype && proto !== null) return value;
	let changed = false;
	const next = {};
	for (const [key, entry] of Object.entries(value)) {
		const stripped = stripInternalRuntimeScaffoldingFromValue(entry);
		changed ||= stripped !== entry;
		next[key] = stripped;
	}
	return changed ? next : value;
}
/** Every media reference a payload set carries, in payload order. */
function collectPayloadMediaSources(payloads) {
	return payloads.flatMap((payload) => [...typeof payload.mediaUrl === "string" && payload.mediaUrl.trim() ? [payload.mediaUrl] : [], ...(payload.mediaUrls ?? []).filter((url) => typeof url === "string" && url.trim())]);
}
/**
* Resolves the media read capability for one send. Queue staging and the live
* send must resolve it identically: staging copies exactly the bytes the send is
* already allowed to read, so a narrower gate here would reject media the send
* would have delivered, and a wider one would widen read authority.
*/
function resolveOutboundMediaAccessForSend(params, channel, mediaSources) {
	if (mediaSources.length === 0) return params.mediaAccess ?? {};
	return resolveAgentScopedOutboundMediaAccess({
		cfg: params.cfg,
		agentId: params.session?.agentId ?? params.mirror?.agentId,
		mediaSources,
		mediaAccess: params.mediaAccess,
		sessionKey: params.session?.policyKey ?? params.session?.key,
		messageProvider: params.session?.key ? void 0 : channel,
		accountId: params.session?.requesterAccountId ?? params.accountId,
		requesterSenderId: params.session?.requesterSenderId,
		requesterSenderName: params.session?.requesterSenderName,
		requesterSenderUsername: params.session?.requesterSenderUsername,
		requesterSenderE164: params.session?.requesterSenderE164
	});
}
function stripInternalRuntimeScaffoldingFromPayload(payload) {
	const stripped = stripInternalRuntimeScaffoldingFromValue(payload);
	return stripped && typeof stripped === "object" && !Array.isArray(stripped) ? stripped : payload;
}
function buildPayloadSummary(payload) {
	return summarizeOutboundPayloadForTransport(payload);
}
function hasDeliveryResultIdentity(result) {
	return resolveReceiptSourceId(result) !== void 0;
}
function normalizeDeliveryPin(payload) {
	const pin = payload.delivery?.pin;
	if (pin === true) return { enabled: true };
	if (!pin || typeof pin !== "object" || Array.isArray(pin)) return;
	if (!pin.enabled) return;
	const normalized = { enabled: true };
	if (pin.notify === true) normalized.notify = true;
	if (pin.required === true) normalized.required = true;
	return normalized;
}
async function maybePinDeliveredMessage(params) {
	const pin = normalizeDeliveryPin(params.payload);
	if (!pin) return;
	if (!params.messageId) {
		if (pin.required) throw new Error("Delivery pin requested, but no delivered message id was returned.");
		log$1.warn("Delivery pin requested, but no delivered message id was returned.", {
			channel: params.target.channel,
			to: params.target.to
		});
		return;
	}
	if (!params.handler.pinDeliveredMessage) {
		if (pin.required) throw new Error(`Delivery pin is not supported by channel: ${params.target.channel}`);
		log$1.warn("Delivery pin requested, but channel does not support pinning delivered messages.", {
			channel: params.target.channel,
			to: params.target.to
		});
		return;
	}
	try {
		await params.handler.pinDeliveredMessage({
			target: params.target,
			messageId: params.messageId,
			pin,
			gatewayClientScopes: params.gatewayClientScopes
		});
	} catch (err) {
		if (pin.required) throw err;
		log$1.warn("Delivery pin requested, but channel failed to pin delivered message.", {
			channel: params.target.channel,
			to: params.target.to,
			messageId: params.messageId,
			error: formatErrorMessage(err)
		});
	}
}
async function maybeNotifyAfterDeliveredPayload(params) {
	if (!params.handler.afterDeliverPayload || params.results.length === 0) return;
	try {
		await params.handler.afterDeliverPayload({
			target: params.target,
			payload: params.payload,
			results: params.results
		});
	} catch (err) {
		log$1.warn("Plugin outbound adapter after-delivery hook failed.", {
			channel: params.target.channel,
			to: params.target.to,
			error: formatErrorMessage(err)
		});
	}
}
async function renderPresentationForDelivery(handler, payload) {
	const presentation = normalizeMessagePresentation(payload.presentation);
	if (!presentation) return payload;
	const adaptedPresentation = adaptMessagePresentationForChannel({
		presentation,
		capabilities: handler.presentationCapabilities
	});
	const textIsFallback = payload.presentationTextMode === "fallback";
	const countDataBlocks = (blocks) => blocks.filter((block) => block.type === "table" || block.type === "chart").length;
	const hasInteractiveBlocks = presentation.blocks.some((block) => block.type === "buttons" || block.type === "select");
	if (textIsFallback && payload.text?.trim() && !hasInteractiveBlocks && countDataBlocks(presentation.blocks) > 0 && countDataBlocks(adaptedPresentation.blocks) === 0) {
		const { presentation: _degradedPresentation, presentationTextMode: _degradedPresentationTextMode, ...authoredFallback } = payload;
		return authoredFallback;
	}
	const adaptedPayload = {
		...payload,
		...textIsFallback ? { text: void 0 } : {},
		presentation: adaptedPresentation
	};
	const rendered = handler.renderPresentation ? await handler.renderPresentation(adaptedPayload) : null;
	if (rendered) {
		const { presentation: _presentation, presentationTextMode: _presentationTextMode, ...withoutPresentation } = rendered;
		return withoutPresentation;
	}
	const { presentation: _presentation, presentationTextMode: _presentationTextMode, ...withoutPresentation } = payload;
	return {
		...withoutPresentation,
		text: textIsFallback ? payload.text ?? renderMessagePresentationFallbackText({ presentation }) : renderMessagePresentationFallbackText({
			text: payload.text,
			presentation
		})
	};
}
//#endregion
//#region src/infra/outbound/delivery-commit-hooks.ts
const log = createSubsystemLogger("outbound/deliver");
const outboundDeliveryCommitHooks = /* @__PURE__ */ new WeakMap();
/** Attaches an after-commit hook without changing the delivery result shape. */
function attachOutboundDeliveryCommitHook(result, hook) {
	if (!hook) return result;
	const hooks = outboundDeliveryCommitHooks.get(result) ?? [];
	hooks.push(hook);
	outboundDeliveryCommitHooks.set(result, hooks);
	return result;
}
/** Runs after-commit hooks for delivered results while isolating hook failures. */
async function runOutboundDeliveryCommitHooks(results) {
	for (const result of results) for (const hook of outboundDeliveryCommitHooks.get(result) ?? []) try {
		await hook();
	} catch (err) {
		log.warn("Plugin message adapter after-commit hook failed.", {
			channel: result.channel,
			messageId: result.messageId,
			error: formatErrorMessage(err)
		});
	}
}
/** Type guard for batched outbound delivery results crossing loose boundaries. */
function isOutboundDeliveryResultArray(value) {
	return Array.isArray(value);
}
//#endregion
//#region src/infra/outbound/delivery-queue-reconciliation.ts
function buildUnknownSendContext(params) {
	const { entry } = params;
	return {
		cfg: params.cfg,
		queueId: entry.id,
		channel: entry.channel,
		to: entry.to,
		...entry.accountId !== void 0 ? { accountId: entry.accountId } : {},
		enqueuedAt: entry.enqueuedAt,
		retryCount: entry.retryCount,
		...entry.platformSendStartedAt !== void 0 ? { platformSendStartedAt: entry.platformSendStartedAt } : {},
		...entry.effectiveReplyToId !== void 0 ? { effectiveReplyToId: entry.effectiveReplyToId } : {},
		payloads: params.payloads,
		...entry.renderedBatchPlan ? { renderedBatchPlan: entry.renderedBatchPlan } : {},
		...entry.reply ? { replyToId: entry.reply.replyToId } : {},
		...entry.reply?.source === "implicit" ? { replyToMode: entry.reply.mode } : {},
		...entry.threadId !== void 0 ? { threadId: entry.threadId } : {},
		...entry.silent !== void 0 ? { silent: entry.silent } : {}
	};
}
/** Reconciles provider state without applying or rediscovering outbound policy. */
async function reconcileUnknownQueuedDelivery(params) {
	const adapter = resolveOutboundChannelMessageAdapter({
		channel: params.entry.channel,
		cfg: params.cfg,
		agentId: params.entry.session?.agentId,
		allowBootstrap: true
	});
	if (adapter?.durableFinal?.capabilities?.reconcileUnknownSend !== true) return null;
	const reconcileUnknownSend = adapter.durableFinal.reconcileUnknownSend;
	if (!reconcileUnknownSend) return null;
	const { entry } = params;
	try {
		return await reconcileUnknownSend(buildUnknownSendContext(params));
	} catch (error) {
		const message = formatErrorMessage(error);
		params.warn(`Delivery entry ${entry.id} unknown-send reconciliation failed: ${message}`);
		return {
			status: "unresolved",
			error: message,
			retryable: true
		};
	}
}
//#endregion
export { runOutboundDeliveryCommitHooks as a, deliveryKindForPayload as c, maybePinDeliveredMessage as d, normalizeEmptyPayloadForDelivery as f, stripInternalRuntimeScaffoldingFromPayload as g, resolveOutboundMediaAccessForSend as h, isOutboundDeliveryResultArray as i, hasDeliveryResultIdentity as l, renderPresentationForDelivery as m, reconcileUnknownQueuedDelivery as n, buildPayloadSummary as o, normalizePayloadsForChannelDelivery as p, attachOutboundDeliveryCommitHook as r, collectPayloadMediaSources as s, buildUnknownSendContext as t, maybeNotifyAfterDeliveredPayload as u };
