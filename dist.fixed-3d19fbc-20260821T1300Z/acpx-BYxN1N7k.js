import { r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
import "./errors-D9kfm90G.js";
import "./registry-_hZm0hSC.js";
import { n as finalizeInboundContextForSdk, r as isFinalizedInboundContext } from "./inbound-context-LXL8l8JC.js";
import { t as hasExplicitCommandContextText } from "./context-text-D3m6Fy9M.js";
//#region src/plugin-sdk/acpx.ts
const loadDispatchAcpRuntime = createLazyRuntimeModule(() => import("./dispatch-acp.runtime.js"));
/**
* Dispatch a plugin reply hook through ACP when the event targets an ACP-bound session.
* Returns a handled result only when ACP consumes the reply; otherwise callers continue normal delivery.
*/
async function tryDispatchAcpReplyHook(event, ctx) {
	const finalizedCtx = isFinalizedInboundContext(event.ctx) ? event.ctx : finalizeInboundContextForSdk(event.ctx);
	if (event.sendPolicy === "deny" && !event.suppressUserDelivery && !hasExplicitCommandContextText(finalizedCtx) && !event.isTailDispatch) return;
	const runtime = await loadDispatchAcpRuntime();
	const bypassForCommand = await runtime.shouldBypassAcpDispatchForCommand(finalizedCtx, ctx.cfg);
	if (event.sendPolicy === "deny" && !event.suppressUserDelivery && !bypassForCommand && !event.isTailDispatch) return;
	const result = await runtime.tryDispatchAcpReply({
		ctx: finalizedCtx,
		cfg: ctx.cfg,
		dispatcher: ctx.dispatcher,
		runId: event.runId,
		sessionKey: event.sessionKey,
		toolsAllow: event.toolsAllow,
		images: event.images,
		abortSignal: ctx.abortSignal,
		inboundAudio: event.inboundAudio,
		sessionTtsAuto: event.sessionTtsAuto,
		ttsChannel: event.ttsChannel,
		suppressUserDelivery: event.suppressUserDelivery,
		suppressReplyLifecycle: event.suppressReplyLifecycle === true || event.sendPolicy === "deny",
		sourceReplyDeliveryMode: event.sourceReplyDeliveryMode,
		shouldRouteToOriginating: event.shouldRouteToOriginating,
		originatingChannel: event.originatingChannel,
		originatingTo: event.originatingTo,
		originatingAccountId: event.originatingAccountId,
		originatingThreadId: event.originatingThreadId,
		originatingChatType: event.originatingChatType,
		shouldSendToolSummaries: event.shouldSendToolSummaries,
		shouldSendToolSummariesNow: () => event.shouldSendToolSummaries,
		shouldSendFullToolDetails: event.shouldSendFullToolDetails,
		bypassForCommand,
		onReplyStart: ctx.onReplyStart,
		recordProcessed: ctx.recordProcessed,
		markIdle: ctx.markIdle
	});
	if (!result) return;
	return {
		handled: true,
		queuedFinal: result.queuedFinal,
		counts: result.counts
	};
}
//#endregion
export { tryDispatchAcpReplyHook as t };
