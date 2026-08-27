import { i as toErrorObject } from "./error-coercion-CKFmnpjH.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import "./utils-Bw16L5tB.js";
import { t as sleep } from "./sleep-D7nua6TP.js";
import { t as collectErrorGraphCandidates } from "./errors-Ccx0R-_Z.js";
import { t as createSubsystemLogger } from "./subsystem-a4KzJVZG.js";
import { n as SILENT_REPLY_TOKEN, o as isSilentReplyText } from "./tokens-DbQz-n_m.js";
import { r as generateSecureInt } from "./secure-random-Ds4AFLgz.js";
import { _ as setReplyPayloadMetadata, a as getReplyPayloadMetadata, i as copyReplyPayloadMetadata } from "./reply-payload-BeeUJOmJ.js";
import { n as registerDispatcher } from "./dispatcher-registry-B2AzyUtN.js";
import { i as findPlatformMessageRejectedError, s as isProvenDeliveryNotSentError } from "./delivery-recovery.shared-B2XgPiah.js";
import { o as settlePendingFinalDelivery } from "./delivery-completion-DBkrMmbZ.js";
import { r as normalizeReplyPayloadOutcome } from "./normalize-reply-uJ4oFasT.js";
//#region src/auto-reply/reply/reply-dispatch-before-deliver.ts
const DEFAULT_BEFORE_DELIVER_TIMEOUT_MS = 15e3;
const stagesByHook = /* @__PURE__ */ new WeakMap();
function resolveTimeoutMs(options) {
	const timeoutMs = options?.timeoutMs ?? 15e3;
	if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) throw new RangeError("beforeDeliver timeoutMs must be a positive finite number");
	return timeoutMs;
}
async function runReplyDispatchBeforeDeliverStage(stage, payload, info) {
	if (!stage.timeoutMs) return await stage.hook(payload, info);
	let timer;
	const timeout = new Promise((_, reject) => {
		timer = setTimeout(() => reject(/* @__PURE__ */ new Error(`beforeDeliver timed out after ${stage.timeoutMs}ms`)), stage.timeoutMs);
		timer.unref?.();
	});
	try {
		return await Promise.race([Promise.resolve(stage.hook(payload, info)), timeout]);
	} finally {
		clearTimeout(timer);
	}
}
function resolveStages(input) {
	if (!input) return [];
	const hook = typeof input === "function" ? input : input.hook;
	return stagesByHook.get(hook) ?? [{
		hook,
		timeoutMs: resolveTimeoutMs(typeof input === "function" ? void 0 : input.options)
	}];
}
function composeReplyDispatchBeforeDeliver(...hooks) {
	const stages = hooks.flatMap(resolveStages);
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
	stagesByHook.set(composed, stages);
	return composed;
}
function markReplyDispatchBeforeDeliverDeadlineOwned(hook) {
	stagesByHook.set(hook, [{ hook }]);
	return hook;
}
//#endregion
//#region src/auto-reply/reply/reply-dispatch-delay.ts
const DEFAULT_RANGE = {
	min: 800,
	max: 2500
};
function resolveHumanDelayRange(config) {
	if (!config?.mode || config.mode === "off") return;
	return config.mode === "custom" ? {
		min: config.minMs ?? DEFAULT_RANGE.min,
		max: config.maxMs ?? DEFAULT_RANGE.max
	} : DEFAULT_RANGE;
}
function getHumanDelay(config) {
	const range = resolveHumanDelayRange(config);
	if (!range || range.max <= range.min) return range?.min ?? 0;
	return range.min + generateSecureInt(range.max - range.min + 1);
}
function getHumanDelayMax(config) {
	const range = resolveHumanDelayRange(config);
	return range ? Math.max(range.min, range.max) : 0;
}
//#endregion
//#region src/auto-reply/reply/reply-dispatch-outcome.ts
const REPLY_DISPATCH_DELIVERY_ERROR_CODE = "REPLY_DISPATCH_DELIVERY_ERROR";
var ReplyDispatchDeliveryError = class extends Error {
	constructor(outcome) {
		super("queued reply delivery failed");
		this.outcome = outcome;
		this.code = REPLY_DISPATCH_DELIVERY_ERROR_CODE;
		this.name = "ReplyDispatchDeliveryError";
	}
};
function isReplyDispatchDeliveryError(error) {
	return isRecord(error) && error.code === REPLY_DISPATCH_DELIVERY_ERROR_CODE && (error.outcome === "delivered" || error.outcome === "delivered-not-visible" || error.outcome === "cancelled" || error.outcome === "failed-before-deliver" || error.outcome === "failed-deliver");
}
function isReplyDispatchProvenInvisible(outcome) {
	return outcome !== "delivered" && outcome !== "failed-deliver";
}
function isExplicitlyNonVisibleDelivery(result) {
	return isRecord(result) && result.visibleReplySent === false;
}
function createReplyDispatchSettledCounts() {
	return {
		delivered: 0,
		deliveredNotVisible: 0,
		cancelled: 0,
		failedBeforeSend: 0,
		failedAfterSend: 0
	};
}
//#endregion
//#region src/auto-reply/reply/reply-dispatcher.types.ts
function mapReplyDispatchCounts(counts, select) {
	return {
		tool: select(counts.tool),
		block: select(counts.block),
		final: select(counts.final)
	};
}
//#endregion
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
const silentReplyLogger = createSubsystemLogger("silent-reply/dispatcher");
const deliveryOutcomeTrackers = /* @__PURE__ */ new WeakMap();
const undeliveredFallbacks = /* @__PURE__ */ new WeakMap();
const conversationContextsByDispatcher = /* @__PURE__ */ new WeakMap();
const replyDispatcherPreparers = /* @__PURE__ */ new WeakMap();
/** Associate this turn's finalized prompt with its exact dispatcher without changing the SDK. */
function bindReplyDispatcherConversationContext(dispatcher, conversationContext) {
	conversationContextsByDispatcher.set(dispatcher, conversationContext);
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
function normalizeReplyPayloadInternal(payload, opts) {
	const prefixContext = opts.responsePrefixContextProvider?.() ?? opts.responsePrefixContext;
	return normalizeReplyPayloadOutcome(payload, {
		responsePrefix: opts.responsePrefix,
		responsePrefixContext: prefixContext,
		onHeartbeatStrip: opts.onHeartbeatStrip,
		transformReplyPayload: opts.transformReplyPayload,
		conversationContext: opts.conversationContext,
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
	let pending = 1;
	let completeCalled = false;
	let sentFirstBlock = false;
	const queuedCounts = {
		tool: 0,
		block: 0,
		final: 0
	};
	const settledCounts = {
		tool: createReplyDispatchSettledCounts(),
		block: createReplyDispatchSettledCounts(),
		final: createReplyDispatchSettledCounts()
	};
	let retryableNoSendError;
	let sendChain = Promise.resolve();
	let settlementChain = Promise.resolve();
	let pendingFinalizations = 0;
	let idleNotified = false;
	const ignoreResult = () => void 0;
	const notifyIdle = () => {
		if (idleNotified) return;
		idleNotified = true;
		try {
			Promise.resolve(options.onIdle?.()).catch(ignoreResult);
		} catch {}
	};
	const scheduleDelivery = (run) => {
		idleNotified = false;
		const delivery = sendChain.then(run);
		sendChain = delivery.then(ignoreResult, ignoreResult);
		const drained = sendChain;
		drained.then(() => drained === sendChain && pendingFinalizations > 0 && notifyIdle());
		return delivery;
	};
	const enqueueSettlement = (settle) => settlementChain = settlementChain.then(settle);
	const waitForIdle = async () => {
		let sent;
		let settled;
		do {
			sent = sendChain;
			settled = settlementChain;
			await Promise.all([sent, settled]);
		} while (sent !== sendChain || settled !== settlementChain);
	};
	const buildReceipt = () => ({
		counts: {
			tool: { ...settledCounts.tool },
			block: { ...settledCounts.block },
			final: { ...settledCounts.final }
		},
		anyVisibleDelivered: Object.values(settledCounts).some((counts) => counts.delivered > 0 || counts.failedAfterSend > 0)
	});
	const { unregister } = registerDispatcher({
		pending: () => pending,
		waitForIdle
	});
	const reportObserverError = (err, info) => {
		Promise.resolve(options.onError?.(err, info)).catch(() => void 0);
	};
	const normalizeForDispatch = (kind, payload, notifySkip) => normalizeReplyPayloadInternal(payload, {
		responsePrefix: options.responsePrefix,
		responsePrefixContext: options.responsePrefixContext,
		responsePrefixContextProvider: options.responsePrefixContextProvider,
		transformReplyPayload: options.transformReplyPayload,
		conversationContext: conversationContextsByDispatcher.get(dispatcher),
		onHeartbeatStrip: options.onHeartbeatStrip,
		onSkip: notifySkip ? (reason) => options.onSkip?.(payload, {
			...buildReplyDispatchRuntimeInfo(payload, kind),
			reason
		}) : void 0
	});
	const notifyBeforeDeliverCancelled = async (payload, info) => {
		const observer = options.onBeforeDeliverCancelled;
		if (!observer) return;
		try {
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
		const settleCustody = (state) => custody ? settlePendingFinalDelivery({
			kind: "pending-final",
			...custody
		}, state, ["queued"]) : void 0;
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
					return { settlement: Promise.resolve("cancelled") };
				}
				deliverPayload = copyReplyPayloadMetadata(payload, deliverPayload);
			}
			if (custody) {
				if ((await settlePendingFinalDelivery({
					kind: "pending-final",
					...custody
				}, "queued", ["prepared"])).state !== "queued") {
					await notifyBeforeDeliverCancelled(payload, info);
					return { settlement: Promise.resolve("cancelled") };
				}
			}
			deliveryStarted = true;
			const result = await options.deliver(deliverPayload, info);
			const finalization = isRecord(result) && result.finalization instanceof Promise ? result.finalization : void 0;
			pendingFinalizations += finalization ? 1 : 0;
			return { settlement: (async () => {
				try {
					const finalized = finalization ? await finalization : void 0;
					await settleCustody("delivered");
					return isExplicitlyNonVisibleDelivery(finalization && isRecord(result) && isRecord(finalized) ? {
						...result,
						...finalized,
						finalization: void 0
					} : result) ? "delivered-not-visible" : "delivered";
				} catch {
					await settleCustody("unknown");
					return "failed-deliver";
				} finally {
					pendingFinalizations -= finalization ? 1 : 0;
				}
			})() };
		} catch (error) {
			const retryableNoSend = isRetryableNoSendFailure(error);
			if (retryableNoSend) retryableNoSendError ??= toErrorObject(error, "reply delivery failed before dispatch");
			const outcome = deliveryStarted && !retryableNoSend ? "failed-deliver" : "failed-before-deliver";
			if (custody && deliveryStarted) await settlePendingFinalDelivery({
				kind: "pending-final",
				...custody
			}, outcome === "failed-deliver" ? "unknown" : "prepared", outcome === "failed-deliver" ? ["queued"] : ["queued", "unknown"]);
			try {
				await options.onError?.(error, info);
			} catch {}
			return { settlement: Promise.resolve(outcome) };
		}
	};
	const startSerializedDelivery = (payload, info, shouldDelay) => scheduleDelivery(async () => {
		if (shouldDelay) {
			const delayMs = getHumanDelay(options.humanDelay);
			if (delayMs > 0) await sleep(delayMs);
		}
		return await deliverOnce(payload, info);
	});
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
		const dispatchInfo = buildReplyDispatchRuntimeInfo(normalized, kind);
		const delivery = startSerializedDelivery(normalized, dispatchInfo, shouldDelay);
		enqueueSettlement(async () => {
			try {
				deliveryOutcome = await (await delivery).settlement;
				if (deliveryFallback && isReplyDispatchProvenInvisible(deliveryOutcome)) deliveryOutcome = await (await startSerializedDelivery(deliveryFallback, dispatchInfo, false)).settlement;
				const counts = settledCounts[kind];
				if (deliveryOutcome === "delivered") counts.delivered += 1;
				else if (deliveryOutcome === "delivered-not-visible") counts.deliveredNotVisible += 1;
				else if (deliveryOutcome === "cancelled") counts.cancelled += 1;
				else if (deliveryOutcome === "failed-before-deliver") counts.failedBeforeSend += 1;
				else counts.failedAfterSend += 1;
			} catch (err) {
				settledCounts[kind].failedBeforeSend += 1;
				try {
					await options.onError?.(err, dispatchInfo);
				} catch {}
				deliveryOutcome = "failed-before-deliver";
			} finally {
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
					notifyIdle();
				}
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
					notifyIdle();
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
		supportsSettledReceipt: true,
		waitForIdle: async () => {
			await waitForIdle();
			const receipt = buildReceipt();
			if (options.propagateRetryableNoSendFailure === true && !receipt.anyVisibleDelivered && retryableNoSendError !== void 0) throw retryableNoSendError;
			return receipt;
		},
		getQueuedCounts: () => ({ ...queuedCounts }),
		getCancelledCounts: () => mapReplyDispatchCounts(settledCounts, (counts) => counts.cancelled),
		getFailedCounts: () => mapReplyDispatchCounts(settledCounts, (counts) => counts.failedBeforeSend + counts.failedAfterSend),
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
	return dispatcher;
}
async function waitForReplyDispatcherIdle(dispatcher, abortSignal) {
	if (!abortSignal) return await dispatcher.waitForIdle() || void 0;
	if (abortSignal.aborted) return;
	let removeAbortListener;
	const aborted = new Promise((resolve) => {
		const onAbort = () => resolve(void 0);
		abortSignal.addEventListener("abort", onAbort, { once: true });
		removeAbortListener = () => abortSignal.removeEventListener("abort", onAbort);
	});
	try {
		return await Promise.race([dispatcher.waitForIdle(), aborted]) || void 0;
	} finally {
		removeAbortListener?.();
	}
}
function createReplyDispatcherWithTyping(options) {
	const { typingCallbacks, onReplyStart, onIdle, onSettled, onFreshSettledDelivery: _onFreshSettledDelivery, onCleanup, ...dispatcherOptions } = options;
	const resolvedOnReplyStart = onReplyStart ?? typingCallbacks?.onReplyStart;
	const resolvedOnIdle = onIdle ?? typingCallbacks?.onIdle;
	const resolvedOnCleanup = onCleanup ?? typingCallbacks?.onCleanup;
	let typingController;
	return {
		dispatcher: createReplyDispatcher({
			...dispatcherOptions,
			onIdle: async () => {
				typingController?.markDispatchIdle();
				const idle = resolvedOnIdle?.();
				if (idle) await Promise.resolve(idle);
				await onSettled?.();
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
export { createReplyDispatcherWithTyping as a, mapReplyDispatchCounts as c, composeReplyDispatchBeforeDeliver as d, markReplyDispatchBeforeDeliverDeadlineOwned as f, createReplyDispatcher as i, ReplyDispatchDeliveryError as l, bindReplyDispatcherConversationContext as n, prepareReplyPayloadForDispatcher as o, captureReplyDispatchDeliveryOutcome as r, waitForReplyDispatcherIdle as s, attachReplyDispatchUndeliveredFallback as t, isReplyDispatchDeliveryError as u };
