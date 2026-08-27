import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import "./utils-DEqefz4f.js";
import { t as sleep } from "./sleep-Bd74jGcV.js";
import { t as collectErrorGraphCandidates } from "./errors-CSNUPl5U.js";
import { t as createSubsystemLogger } from "./subsystem-CDLhGl2-.js";
import { n as SILENT_REPLY_TOKEN, o as isSilentReplyText } from "./tokens-CMI0yx54.js";
import { r as generateSecureInt } from "./secure-random-Ds4AFLgz.js";
import { a as getReplyPayloadMetadata, g as setReplyPayloadMetadata, i as copyReplyPayloadMetadata } from "./reply-payload-DVcGHORx.js";
import { r as normalizeReplyPayloadOutcome } from "./normalize-reply--NSgVK7M.js";
import { n as registerDispatcher } from "./dispatcher-registry-B2AzyUtN.js";
import { i as findPlatformMessageRejectedError, s as isProvenDeliveryNotSentError } from "./delivery-recovery.shared-BBO0H6XC.js";
import { a as settlePendingFinalDelivery } from "./delivery-completion-Z3F4ws_r.js";
//#region src/auto-reply/reply/reply-dispatcher.ts
function isRetryableNoSendFailure(error) {
	return isProvenDeliveryNotSentError(error) && !findPlatformMessageRejectedError(error) && !collectErrorGraphCandidates(error, (candidate) => [
		candidate.cause,
		candidate.original,
		candidate.error,
		candidate.reason,
		...Array.isArray(candidate.errors) ? candidate.errors : []
	]).some((candidate) => isRecord(candidate) && (candidate.sentBeforeError === true || candidate.visibleReplySent === true || isRecord(candidate.deliveryResult) && candidate.deliveryResult.visibleReplySent === true));
}
const DEFAULT_HUMAN_DELAY_MIN_MS = 800;
const DEFAULT_HUMAN_DELAY_MAX_MS = 2500;
const DEFAULT_BEFORE_DELIVER_TIMEOUT_MS = 15e3;
const silentReplyLogger = createSubsystemLogger("silent-reply/dispatcher");
const beforeDeliverCancelledHooks = /* @__PURE__ */ new WeakMap();
const deliveryOutcomeTrackers = /* @__PURE__ */ new WeakMap();
const undeliveredFallbacks = /* @__PURE__ */ new WeakMap();
const replyDispatcherPreparers = /* @__PURE__ */ new WeakMap();
const beforeDeliverStagesByHook = /* @__PURE__ */ new WeakMap();
function resolveReplyDispatchBeforeDeliverTimeoutMs(options) {
	const timeoutMs = options?.timeoutMs ?? DEFAULT_BEFORE_DELIVER_TIMEOUT_MS;
	if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) throw new RangeError("beforeDeliver timeoutMs must be a positive finite number");
	return timeoutMs;
}
async function runReplyDispatchBeforeDeliverStage(stage, payload, info) {
	const timeoutMs = stage.timeoutMs;
	if (!timeoutMs) return await stage.hook(payload, info);
	let timer;
	const timeout = new Promise((_, reject) => {
		timer = setTimeout(() => reject(/* @__PURE__ */ new Error(`beforeDeliver timed out after ${timeoutMs}ms`)), timeoutMs);
		timer.unref?.();
	});
	try {
		return await Promise.race([Promise.resolve(stage.hook(payload, info)), timeout]);
	} finally {
		if (timer) clearTimeout(timer);
	}
}
function resolveReplyDispatchBeforeDeliverStages(input) {
	if (!input) return [];
	if (typeof input === "function") return beforeDeliverStagesByHook.get(input) ?? [{
		hook: input,
		timeoutMs: DEFAULT_BEFORE_DELIVER_TIMEOUT_MS
	}];
	const existingStages = beforeDeliverStagesByHook.get(input.hook);
	if (existingStages) return existingStages;
	return [{
		hook: input.hook,
		timeoutMs: resolveReplyDispatchBeforeDeliverTimeoutMs(input.options)
	}];
}
/** Compose core delivery stages while retaining a separate deadline for each actual hook. */
function composeReplyDispatchBeforeDeliver(...hooks) {
	const stages = [];
	for (const hook of hooks) if (hook) stages.push(...resolveReplyDispatchBeforeDeliverStages(hook));
	if (stages.length === 0) return;
	const composed = async (payload, info) => {
		let current = payload;
		for (const stage of stages) {
			if (!current) return null;
			const next = await runReplyDispatchBeforeDeliverStage(stage, current, info);
			current = next ? copyReplyPayloadMetadata(current, next) : null;
		}
		return current;
	};
	beforeDeliverStagesByHook.set(composed, stages);
	return composed;
}
/** Mark a core hook whose lifecycle owner controls settlement and any deadline. */
function markReplyDispatchBeforeDeliverDeadlineOwned(hook) {
	beforeDeliverStagesByHook.set(hook, [{ hook }]);
	return hook;
}
/** Adds a core-internal cancellation observer without expanding the plugin-facing dispatcher. */
function appendReplyDispatcherBeforeDeliverCancelled(dispatcher, hook) {
	const hooks = beforeDeliverCancelledHooks.get(dispatcher);
	if (!hooks) return false;
	hooks.push(hook);
	return true;
}
/** Capture one core-dispatcher delivery outcome without changing send* return types. */
function captureReplyDispatchDeliveryOutcome(payload) {
	let resolveOutcome;
	const tracker = {
		promise: new Promise((resolve) => {
			resolveOutcome = resolve;
		}),
		resolve: (outcome) => resolveOutcome(outcome),
		tracked: false
	};
	deliveryOutcomeTrackers.set(payload, tracker);
	return {
		promise: tracker.promise,
		isTracked: () => tracker.tracked
	};
}
/** Attach a text alternative that is delivered only when the primary payload is proven unsent. */
function attachReplyDispatchUndeliveredFallback(payload, fallback) {
	undeliveredFallbacks.set(payload, fallback);
}
function buildReplyDispatchRuntimeInfo(payload, kind) {
	const assistantMessageIndex = getReplyPayloadMetadata(payload)?.assistantMessageIndex;
	return {
		kind,
		...assistantMessageIndex !== void 0 ? { assistantMessageIndex } : {}
	};
}
/** Generate a random delay within the configured range. */
function getHumanDelay(config) {
	const mode = config?.mode ?? "off";
	if (mode === "off") return 0;
	const min = mode === "custom" ? config?.minMs ?? DEFAULT_HUMAN_DELAY_MIN_MS : DEFAULT_HUMAN_DELAY_MIN_MS;
	const max = mode === "custom" ? config?.maxMs ?? DEFAULT_HUMAN_DELAY_MAX_MS : DEFAULT_HUMAN_DELAY_MAX_MS;
	if (max <= min) return min;
	return min + generateSecureInt(max - min + 1);
}
function getHumanDelayMax(config) {
	const mode = config?.mode ?? "off";
	if (mode === "off") return 0;
	const min = mode === "custom" ? config?.minMs ?? DEFAULT_HUMAN_DELAY_MIN_MS : DEFAULT_HUMAN_DELAY_MIN_MS;
	const max = mode === "custom" ? config?.maxMs ?? DEFAULT_HUMAN_DELAY_MAX_MS : DEFAULT_HUMAN_DELAY_MAX_MS;
	return max <= min ? min : max;
}
function normalizeReplyPayloadInternal(payload, opts) {
	const prefixContext = opts.responsePrefixContextProvider?.() ?? opts.responsePrefixContext;
	return normalizeReplyPayloadOutcome(payload, {
		responsePrefix: opts.responsePrefix,
		responsePrefixContext: prefixContext,
		onHeartbeatStrip: opts.onHeartbeatStrip,
		transformReplyPayload: opts.transformReplyPayload,
		onSkip: opts.onSkip
	});
}
/** Normalize through a dispatcher's exact owner before TTS or other visible side effects. */
function prepareReplyPayloadForDispatcher(dispatcher, kind, payload) {
	const preparer = replyDispatcherPreparers.get(dispatcher);
	if (!preparer) return {
		kind: "deliver",
		payload
	};
	const outcome = preparer.normalize(kind, payload);
	return outcome.kind === "deliver" ? {
		kind: "deliver",
		payload: setReplyPayloadMetadata(outcome.payload, { replyDispatcherNormalizationOwner: preparer.owner })
	} : outcome;
}
function createReplyDispatcher(options) {
	let beforeDeliver = composeReplyDispatchBeforeDeliver(options.beforeDeliver ? {
		hook: options.beforeDeliver,
		options: options.beforeDeliverOptions
	} : void 0);
	const appendedBeforeDeliverCancelledHooks = [];
	let sendChain = Promise.resolve();
	let pending = 1;
	let completeCalled = false;
	let sentFirstBlock = false;
	const queuedCounts = {
		tool: 0,
		block: 0,
		final: 0
	};
	const failedCounts = {
		tool: 0,
		block: 0,
		final: 0
	};
	const cancelledCounts = {
		tool: 0,
		block: 0,
		final: 0
	};
	const { unregister } = registerDispatcher({
		pending: () => pending,
		waitForIdle: () => sendChain
	});
	const reportObserverError = (err, info) => {
		Promise.resolve(options.onError?.(err, info)).catch(() => void 0);
	};
	const normalizeForDispatch = (kind, payload, notifySkip) => normalizeReplyPayloadInternal(payload, {
		responsePrefix: options.responsePrefix,
		responsePrefixContext: options.responsePrefixContext,
		responsePrefixContextProvider: options.responsePrefixContextProvider,
		transformReplyPayload: options.transformReplyPayload,
		onHeartbeatStrip: options.onHeartbeatStrip,
		onSkip: notifySkip ? (reason) => options.onSkip?.(payload, {
			...buildReplyDispatchRuntimeInfo(payload, kind),
			reason
		}) : void 0
	});
	const notifyBeforeDeliverCancelled = async (payload, info) => {
		const observers = [...options.onBeforeDeliverCancelled ? [options.onBeforeDeliverCancelled] : [], ...appendedBeforeDeliverCancelledHooks];
		for (const observer of observers) try {
			await runReplyDispatchBeforeDeliverStage({
				hook: async (current, currentInfo) => {
					await observer(current, currentInfo);
					return current;
				},
				timeoutMs: DEFAULT_BEFORE_DELIVER_TIMEOUT_MS
			}, payload, info);
		} catch (err) {
			reportObserverError(err, info);
		}
	};
	const deliverOnce = async (payload, info) => {
		let deliverPayload = payload;
		let deliveryStarted = false;
		const custody = getReplyPayloadMetadata(payload)?.pendingFinalDeliveryCompletion;
		try {
			if (beforeDeliver) {
				try {
					deliverPayload = await beforeDeliver(payload, info);
				} catch (error) {
					await notifyBeforeDeliverCancelled(payload, info);
					throw error;
				}
				if (!deliverPayload) {
					if (custody) await settlePendingFinalDelivery({
						kind: "pending-final",
						...custody
					}, "suppressed", ["prepared"]);
					await notifyBeforeDeliverCancelled(payload, info);
					return "cancelled";
				}
				deliverPayload = copyReplyPayloadMetadata(payload, deliverPayload);
			}
			if (custody) {
				if ((await settlePendingFinalDelivery({
					kind: "pending-final",
					...custody
				}, "queued", ["prepared"])).state !== "queued") {
					await notifyBeforeDeliverCancelled(payload, info);
					return "cancelled";
				}
			}
			deliveryStarted = true;
			await options.deliver(deliverPayload, info);
			if (custody) await settlePendingFinalDelivery({
				kind: "pending-final",
				...custody
			}, "delivered", ["queued"]);
			return "delivered";
		} catch (error) {
			const outcome = deliveryStarted && !isRetryableNoSendFailure(error) ? "failed-deliver" : "failed-before-deliver";
			if (custody && deliveryStarted) await settlePendingFinalDelivery({
				kind: "pending-final",
				...custody
			}, outcome === "failed-deliver" ? "unknown" : "prepared", outcome === "failed-deliver" ? ["queued"] : ["queued", "unknown"]);
			try {
				await options.onError?.(error, info);
			} catch {}
			return outcome;
		}
	};
	const enqueue = (kind, payload) => {
		const fallback = undeliveredFallbacks.get(payload);
		undeliveredFallbacks.delete(payload);
		const originalWasExactSilent = isSilentReplyText(payload.text, SILENT_REPLY_TOKEN);
		const normalizedPrimary = getReplyPayloadMetadata(payload)?.replyDispatcherNormalizationOwner === dispatcher ? {
			kind: "deliver",
			payload
		} : normalizeForDispatch(kind, payload, true);
		const normalizedFallback = fallback && !(normalizedPrimary.kind === "suppress" && normalizedPrimary.reason === "channel_transform") ? normalizeForDispatch(kind, fallback, false) : void 0;
		const normalized = normalizedPrimary.kind === "deliver" ? normalizedPrimary.payload : normalizedFallback?.kind === "deliver" ? normalizedFallback.payload : null;
		if (!normalized) {
			if (kind === "final" && originalWasExactSilent) silentReplyLogger.debug("exact NO_REPLY final payload was skipped before delivery", {
				hasSessionKey: Boolean(options.silentReplyContext?.sessionKey),
				surface: options.silentReplyContext?.surface,
				conversationType: options.silentReplyContext?.conversationType
			});
			return false;
		}
		const deliveryFallback = normalizedPrimary.kind === "deliver" && normalizedFallback?.kind === "deliver" ? normalizedFallback.payload : null;
		queuedCounts[kind] += 1;
		pending += 1;
		const deliveryOutcomeTracker = deliveryOutcomeTrackers.get(payload);
		if (deliveryOutcomeTracker) deliveryOutcomeTracker.tracked = true;
		const shouldDelay = kind === "block" && sentFirstBlock;
		if (kind === "block") sentFirstBlock = true;
		let deliveryOutcome = "failed-before-deliver";
		sendChain = sendChain.then(async () => {
			if (shouldDelay) {
				const delayMs = getHumanDelay(options.humanDelay);
				if (delayMs > 0) await sleep(delayMs);
			}
			const dispatchInfo = buildReplyDispatchRuntimeInfo(normalized, kind);
			deliveryOutcome = await deliverOnce(normalized, dispatchInfo);
			if (deliveryFallback && (deliveryOutcome === "cancelled" || deliveryOutcome === "failed-before-deliver")) deliveryOutcome = await deliverOnce(deliveryFallback, dispatchInfo);
			if (deliveryOutcome === "cancelled") cancelledCounts[kind] += 1;
			else if (deliveryOutcome === "failed-before-deliver" || deliveryOutcome === "failed-deliver") failedCounts[kind] += 1;
		}).catch(async (err) => {
			failedCounts[kind] += 1;
			try {
				await options.onError?.(err, buildReplyDispatchRuntimeInfo(normalized, kind));
			} catch {}
			deliveryOutcome = "failed-before-deliver";
		}).finally(() => {
			const dispatchInfo = buildReplyDispatchRuntimeInfo(normalized, kind);
			deliveryOutcomeTracker?.resolve(deliveryOutcome);
			deliveryOutcomeTrackers.delete(payload);
			try {
				options.onDeliverySettled?.(dispatchInfo);
			} catch (err) {
				reportObserverError(err, dispatchInfo);
			}
			pending -= 1;
			if (pending === 1 && completeCalled) pending -= 1;
			if (pending === 0) {
				unregister();
				options.onIdle?.();
			}
		});
		return true;
	};
	const markComplete = () => {
		if (completeCalled) return;
		completeCalled = true;
		Promise.resolve().then(() => {
			if (pending === 1 && completeCalled) {
				pending -= 1;
				if (pending === 0) {
					unregister();
					options.onIdle?.();
				}
			}
		});
	};
	const dispatcher = {
		sendToolResult: (payload) => enqueue("tool", payload),
		sendBlockReply: (payload) => enqueue("block", payload),
		sendFinalReply: (payload) => enqueue("final", payload),
		appendBeforeDeliver: (hook, stageOptions) => {
			beforeDeliver = composeReplyDispatchBeforeDeliver(beforeDeliver, {
				hook,
				options: stageOptions
			});
		},
		waitForIdle: () => sendChain,
		getQueuedCounts: () => ({ ...queuedCounts }),
		getCancelledCounts: () => ({ ...cancelledCounts }),
		getFailedCounts: () => ({ ...failedCounts }),
		markComplete,
		resolveFollowupAdmissionBarrierTimeoutPolicy: options.resolveFollowupAdmissionBarrierTimeoutPolicy ? () => options.resolveFollowupAdmissionBarrierTimeoutPolicy?.({
			queuedCounts: { ...queuedCounts },
			humanDelayBudgetMs: Math.max(0, queuedCounts.block - 1) * getHumanDelayMax(options.humanDelay)
		}) : void 0
	};
	replyDispatcherPreparers.set(dispatcher, {
		owner: dispatcher,
		normalize: (kind, payload) => normalizeForDispatch(kind, payload, true)
	});
	beforeDeliverCancelledHooks.set(dispatcher, appendedBeforeDeliverCancelledHooks);
	return dispatcher;
}
async function waitForReplyDispatcherIdle(dispatcher, abortSignal) {
	if (!abortSignal) {
		await dispatcher.waitForIdle();
		return;
	}
	if (abortSignal.aborted) return;
	let removeAbortListener;
	const aborted = new Promise((resolve) => {
		const onAbort = () => resolve();
		abortSignal.addEventListener("abort", onAbort, { once: true });
		removeAbortListener = () => abortSignal.removeEventListener("abort", onAbort);
	});
	try {
		await Promise.race([dispatcher.waitForIdle(), aborted]);
	} finally {
		removeAbortListener?.();
	}
}
function createReplyDispatcherWithTyping(options) {
	const { typingCallbacks, onReplyStart, onIdle, onSettled: _onSettled, onFreshSettledDelivery: _onFreshSettledDelivery, onCleanup, ...dispatcherOptions } = options;
	const resolvedOnReplyStart = onReplyStart ?? typingCallbacks?.onReplyStart;
	const resolvedOnIdle = onIdle ?? typingCallbacks?.onIdle;
	const resolvedOnCleanup = onCleanup ?? typingCallbacks?.onCleanup;
	let typingController;
	return {
		dispatcher: createReplyDispatcher({
			...dispatcherOptions,
			onIdle: () => {
				typingController?.markDispatchIdle();
				return resolvedOnIdle?.();
			}
		}),
		replyOptions: {
			onReplyStart: resolvedOnReplyStart,
			onTypingCleanup: resolvedOnCleanup,
			onTypingController: (typing) => {
				typingController = typing;
			}
		},
		markDispatchIdle: () => {
			typingController?.markDispatchIdle();
			resolvedOnIdle?.();
		},
		markRunComplete: () => {
			typingController?.markRunComplete();
		}
	};
}
//#endregion
export { createReplyDispatcher as a, prepareReplyPayloadForDispatcher as c, composeReplyDispatchBeforeDeliver as i, waitForReplyDispatcherIdle as l, attachReplyDispatchUndeliveredFallback as n, createReplyDispatcherWithTyping as o, captureReplyDispatchDeliveryOutcome as r, markReplyDispatchBeforeDeliverDeadlineOwned as s, appendReplyDispatcherBeforeDeliverCancelled as t };
