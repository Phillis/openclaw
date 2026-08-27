import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { f as isDiagnosticsEnabled } from "./diagnostic-events-BGzDm6gu.js";
import { a as measureDiagnosticsTimelineSpan, o as measureDiagnosticsTimelineSpanSync } from "./diagnostics-timeline-DhDccUEp.js";
import { t as normalizeChatType } from "./chat-type-CG0X_HJM.js";
import { c as resolveCommandTurnContext, l as resolveCommandTurnTargetSessionKey } from "./command-turn-context-CmPEYNmV.js";
import { a as logMessageReceived } from "./diagnostic-DrSh1mZf.js";
import { t as finalizeInboundContext } from "./inbound-context-G3To7LaP.js";
import { a as createReplyDispatcherWithTyping, d as composeReplyDispatchBeforeDeliver, f as markReplyDispatchBeforeDeliverDeadlineOwned, i as createReplyDispatcher } from "./reply-dispatcher-DRSctPVt.js";
import { c as buildInboundReplyPayloadSendingBeforeDeliver, l as buildLegacyInboundMessageSendingBeforeDeliver, u as buildProjectedInboundMessageSendingBeforeDeliver } from "./deliver-prepare-C7KxLRYR.js";
import { t as createKeyedFifoLeaseRegistry } from "./keyed-fifo-lease-Bc9PJVw6.js";
import { h as withReplyDispatcher } from "./dispatch-from-config.finalize-CdP1lvBf.js";
import { t as dispatchReplyFromConfig } from "./dispatch-from-config-C7CkWC7g.js";
//#region src/auto-reply/dispatch.ts
/** Auto-reply dispatch orchestration, hook composition, and foreground delivery fencing. */
const replyPayloadSendingDispatchers = /* @__PURE__ */ new WeakSet();
const foregroundReplyLeases = createKeyedFifoLeaseRegistry(Symbol.for("openclaw.foregroundReplyFences"));
function applyRuntimeToolsAllow(replyOptions, toolsAllow) {
	if (toolsAllow === void 0) return replyOptions;
	return {
		...replyOptions,
		toolsAllow
	};
}
function resolveForegroundReplyOrderKey(finalized) {
	const sessionKey = normalizeOptionalString(finalized.SessionKey);
	const channel = normalizeOptionalString(finalized.OriginatingChannel) ?? normalizeOptionalString(finalized.Surface) ?? normalizeOptionalString(finalized.Provider);
	const target = normalizeOptionalString(finalized.OriginatingTo) ?? normalizeOptionalString(finalized.NativeChannelId) ?? normalizeOptionalString(finalized.From) ?? normalizeOptionalString(finalized.To);
	if (!sessionKey || !channel || !target) return;
	return JSON.stringify([
		"foreground",
		channel,
		normalizeOptionalString(finalized.AccountId) ?? "default",
		sessionKey,
		normalizeChatType(finalized.ChatType) ?? "unknown",
		target
	]);
}
function reserveForegroundReplyLease(finalized) {
	const key = resolveForegroundReplyOrderKey(finalized);
	return key ? foregroundReplyLeases.reserve([key]) : void 0;
}
async function runOrderedForegroundReplySettledDeliveries(lease, onSettled, onFreshSettledDelivery) {
	if (!onSettled && !onFreshSettledDelivery) return;
	await lease?.wait();
	await onSettled?.();
	await onFreshSettledDelivery?.();
}
function resolveDispatcherSilentReplyContext(ctx, cfg) {
	const finalized = finalizeInboundContext(ctx);
	const commandTargetSessionKey = resolveCommandTurnTargetSessionKey(finalized);
	const policySessionKey = commandTargetSessionKey ?? finalized.SessionKey;
	const chatType = normalizeChatType(finalized.ChatType);
	const conversationType = commandTargetSessionKey && commandTargetSessionKey !== finalized.SessionKey ? void 0 : chatType === "direct" ? "direct" : chatType === "group" || chatType === "channel" ? "group" : void 0;
	return {
		cfg,
		sessionKey: policySessionKey,
		surface: finalized.Surface ?? finalized.Provider,
		conversationType
	};
}
function bindReplyPayloadRunState(replyOptions, runState) {
	const onAgentRunStart = replyOptions?.onAgentRunStart;
	return {
		...replyOptions,
		onAgentRunStart: (runId, executionIdentityToken) => {
			runState.runId = runId;
			onAgentRunStart?.(runId, executionIdentityToken);
		}
	};
}
function installReplyPayloadSendingBeforeDeliver(dispatcher, ctx, runState) {
	if (replyPayloadSendingDispatchers.has(dispatcher)) return;
	const beforeDeliver = buildInboundReplyPayloadSendingBeforeDeliver(ctx, runState);
	if (!beforeDeliver || !dispatcher.appendBeforeDeliver) return;
	dispatcher.appendBeforeDeliver(beforeDeliver);
	replyPayloadSendingDispatchers.add(dispatcher);
}
function markReplyPayloadSendingBeforeDeliverInstalled(dispatcher, beforeDeliver) {
	if (beforeDeliver) replyPayloadSendingDispatchers.add(dispatcher);
}
function buildDispatchTimelineAttributes(ctx) {
	const commandTurn = resolveCommandTurnContext(ctx);
	return {
		surface: typeof ctx.Surface === "string" ? ctx.Surface : typeof ctx.Provider === "string" ? ctx.Provider : "unknown",
		hasSessionKey: typeof ctx.SessionKey === "string" || typeof ctx.CommandTargetSessionKey === "string",
		commandSource: commandTurn.source
	};
}
/** Dispatches one finalized inbound message through reply resolution and queued delivery. */
async function dispatchInboundMessage(params) {
	const replyOptions = applyRuntimeToolsAllow(params.replyOptions, params.toolsAllow);
	const replyPayloadRunState = params.replyPayloadRunState ?? { runId: replyOptions?.runId };
	const replyOptionsWithRunState = bindReplyPayloadRunState(replyOptions, replyPayloadRunState);
	const finalized = measureDiagnosticsTimelineSpanSync("auto_reply.finalize_context", () => finalizeInboundContext(params.ctx), {
		phase: "agent-turn",
		config: params.cfg,
		attributes: buildDispatchTimelineAttributes(params.ctx)
	});
	if (isDiagnosticsEnabled(params.cfg)) logMessageReceived({
		sessionKey: finalized.SessionKey,
		channel: finalized.Surface ?? finalized.Provider,
		chatId: finalized.To ?? finalized.From,
		messageId: finalized.MessageSid ?? finalized.MessageSidFirst ?? finalized.MessageSidLast,
		source: "dispatchInboundMessage"
	});
	if (params.outboundHooks !== "disabled") installReplyPayloadSendingBeforeDeliver(params.dispatcher, finalized, replyPayloadRunState);
	let settledReceipt;
	const result = await withReplyDispatcher({
		dispatcher: params.dispatcher,
		onSettled: params.onSettled,
		run: () => measureDiagnosticsTimelineSpan("auto_reply.dispatch_reply_from_config", () => (params.dispatchReplyFromConfig ?? dispatchReplyFromConfig)({
			ctx: finalized,
			cfg: params.cfg,
			dispatcher: params.dispatcher,
			replyOptions: replyOptionsWithRunState,
			replyResolver: params.replyResolver,
			onSessionMetadataChanges: params.onSessionMetadataChanges,
			usePublishedModelRuntime: true
		}), {
			phase: "agent-turn",
			config: params.cfg,
			attributes: buildDispatchTimelineAttributes(finalized)
		}),
		onSettledReceipt: (receipt) => {
			settledReceipt = receipt;
		}
	});
	return settledReceipt ? {
		...result,
		settledReceipt
	} : result;
}
async function dispatchInboundMessageWithBufferedDispatcherCore(params, ownership) {
	const finalized = finalizeInboundContext(params.ctx);
	const foregroundReplyLease = reserveForegroundReplyLease(finalized);
	const silentReplyContext = resolveDispatcherSilentReplyContext(finalized, params.cfg);
	const replyPayloadRunState = { runId: params.replyOptions?.runId };
	let settledDeliveries = Promise.resolve();
	const settleDeliveries = () => settledDeliveries = settledDeliveries.then(() => runOrderedForegroundReplySettledDeliveries(foregroundReplyLease, params.dispatcherOptions.onSettled, params.dispatcherOptions.onFreshSettledDelivery));
	const replyPayloadBeforeDeliver = ownership.outboundHooks === "disabled" ? void 0 : buildInboundReplyPayloadSendingBeforeDeliver(finalized, replyPayloadRunState, ownership.onReplyPayloadSuppressed);
	const globalBeforeDeliver = ownership.messageSending === "dispatcher" ? composeReplyDispatchBeforeDeliver(replyPayloadBeforeDeliver, buildLegacyInboundMessageSendingBeforeDeliver(finalized)) : replyPayloadBeforeDeliver;
	const configuredBeforeDeliver = params.dispatcherOptions.beforeDeliver ? composeReplyDispatchBeforeDeliver({
		hook: params.dispatcherOptions.beforeDeliver,
		options: params.dispatcherOptions.beforeDeliverOptions
	}, replyPayloadBeforeDeliver) : globalBeforeDeliver;
	const beforeDeliver = foregroundReplyLease || configuredBeforeDeliver ? markReplyDispatchBeforeDeliverDeadlineOwned(async (payload, info) => {
		await foregroundReplyLease?.wait();
		return configuredBeforeDeliver ? await configuredBeforeDeliver(payload, info) : payload;
	}) : void 0;
	const { dispatcher, replyOptions, markDispatchIdle, markRunComplete } = createReplyDispatcherWithTyping({
		...params.dispatcherOptions,
		beforeDeliver,
		onSettled: settleDeliveries,
		onFreshSettledDelivery: void 0,
		silentReplyContext: params.dispatcherOptions.silentReplyContext ?? silentReplyContext
	});
	const onTypingController = params.replyOptions?.onTypingController ? (typing) => {
		replyOptions.onTypingController?.(typing);
		params.replyOptions?.onTypingController?.(typing);
	} : replyOptions.onTypingController;
	markReplyPayloadSendingBeforeDeliverInstalled(dispatcher, replyPayloadBeforeDeliver);
	try {
		return await dispatchInboundMessage({
			ctx: finalized,
			cfg: params.cfg,
			dispatcher,
			toolsAllow: params.toolsAllow,
			replyResolver: params.replyResolver,
			dispatchReplyFromConfig: params.dispatchReplyFromConfig,
			replyOptions: {
				...params.replyOptions,
				...replyOptions,
				onTypingController
			},
			replyPayloadRunState,
			outboundHooks: ownership.outboundHooks,
			onSessionMetadataChanges: params.onSessionMetadataChanges
		});
	} finally {
		try {
			await settledDeliveries;
		} finally {
			foregroundReplyLease?.release();
			markRunComplete();
			markDispatchIdle();
		}
	}
}
async function dispatchInboundMessageWithBufferedDispatcher(params) {
	return await dispatchInboundMessageWithBufferedDispatcherCore(params, { messageSending: "dispatcher" });
}
async function dispatchInboundMessageWithRoutedChannelDispatcher(params) {
	const { onReplyPayloadSuppressed, suppressOutboundHooks, ...dispatcherParams } = params;
	return await dispatchInboundMessageWithBufferedDispatcherCore(dispatcherParams, {
		messageSending: "channel-delivery",
		...suppressOutboundHooks ? { outboundHooks: "disabled" } : { onReplyPayloadSuppressed }
	});
}
async function dispatchInboundMessageWithPlainDispatcherCore(params, messageSending) {
	const silentReplyContext = resolveDispatcherSilentReplyContext(params.ctx, params.cfg);
	const replyPayloadRunState = { runId: params.replyOptions?.runId };
	const replyPayloadBeforeDeliver = buildInboundReplyPayloadSendingBeforeDeliver(params.ctx, replyPayloadRunState);
	const globalBeforeDeliver = composeReplyDispatchBeforeDeliver(replyPayloadBeforeDeliver, messageSending === "projected" ? buildProjectedInboundMessageSendingBeforeDeliver(params.ctx) : buildLegacyInboundMessageSendingBeforeDeliver(params.ctx));
	const composedBeforeDeliver = params.dispatcherOptions.beforeDeliver ? composeReplyDispatchBeforeDeliver({
		hook: params.dispatcherOptions.beforeDeliver,
		options: params.dispatcherOptions.beforeDeliverOptions
	}, replyPayloadBeforeDeliver) : globalBeforeDeliver;
	const dispatcher = createReplyDispatcher({
		...params.dispatcherOptions,
		beforeDeliver: composedBeforeDeliver,
		silentReplyContext: params.dispatcherOptions.silentReplyContext ?? silentReplyContext
	});
	markReplyPayloadSendingBeforeDeliverInstalled(dispatcher, replyPayloadBeforeDeliver);
	return await dispatchInboundMessage({
		ctx: params.ctx,
		cfg: params.cfg,
		dispatcher,
		toolsAllow: params.toolsAllow,
		replyResolver: params.replyResolver,
		replyOptions: params.replyOptions,
		replyPayloadRunState,
		onSessionMetadataChanges: params.onSessionMetadataChanges
	});
}
/** Creates a plain dispatcher, installs global send hooks, and dispatches the inbound message. */
async function dispatchInboundMessageWithDispatcher(params) {
	return await dispatchInboundMessageWithPlainDispatcherCore(params, "legacy");
}
/** Creates a core-owned dispatcher whose modifiers fence projected output capture. */
async function dispatchInboundMessageWithProjectedDispatcher(params) {
	return await dispatchInboundMessageWithPlainDispatcherCore(params, "projected");
}
//#endregion
export { dispatchInboundMessageWithRoutedChannelDispatcher as a, dispatchInboundMessageWithProjectedDispatcher as i, dispatchInboundMessageWithBufferedDispatcher as n, dispatchInboundMessageWithDispatcher as r, dispatchInboundMessage as t };
