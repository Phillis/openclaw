import { i as truncateWithMarker, r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.js";
import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { a as toAcpRuntimeError, n as AcpRuntimeError } from "./errors-CIvv7cvF.js";
import { t as formatAcpRuntimeErrorText } from "./error-text-DoaL-9xP.js";
import { o as isSessionIdentityPending, u as resolveSessionIdentityFromMeta } from "./session-identity-CY5KdnMP.js";
import { i as resolveAcpThreadSessionDetailLines } from "./session-identifiers-B5CDFQVW.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import "./agent-scope-BizOtGGz.js";
import { d as resolveAgentWorkspaceDir, l as resolveAgentDir } from "./agent-scope-config-BdXMWufB.js";
import { f as resolveAgentIdFromSessionKey } from "./session-key-D8GLfPr_.js";
import { f as isDiagnosticsEnabled } from "./diagnostic-events-Djn4AVRp.js";
import { a as generateSecureUuid } from "./secure-random-Ds4AFLgz.js";
import { u as toolPolicyRestrictsTools } from "./tool-policy-CWmnHLY1.js";
import { i as shouldCleanTtsDirectiveText, t as resolveConfiguredTtsMode } from "./tts-config-CxRyjtgI.js";
import { r as logVerbose } from "./globals-CAwGc4B6.js";
import { f as markReplyPayloadAsTtsSupplement, i as copyReplyPayloadMetadata, l as isReplyPayloadStatusNotice, u as isReplyPayloadTtsSupplement } from "./reply-payload-DVcGHORx.js";
import { l as readChannelContextAdmissionEvidence } from "./admission-evidence-UgNy_kxM.js";
import { o as prepareAgentRunAdmission, r as createOperationalRunInstanceRef, t as closeAdmittedRunDelegatedAuthority } from "./admitted-run-context-BxSN0sUe.js";
import "./errors-DZb6J9ws.js";
import { n as classifySessionStateActor } from "./session-state-events-C74I5OQg.js";
import { f as markDiagnosticSessionProgress } from "./diagnostic-CV4vi0UN.js";
import { a as hasOutboundReplyContent } from "./reply-payload-DBNGwex4.js";
import { a as resolveSendableOutboundReplyParts } from "./reply-payload-parts-CRXUQ13n.js";
import { a as resolveReplyDeliveryAccountId, o as resolveReplyToMode, t as createReplyDeliveryContext } from "./reply-threading-DYNwp2uC.js";
import { r as normalizeReplyPayloadOutcome } from "./normalize-reply--NSgVK7M.js";
import { c as prepareReplyPayloadForDispatcher, l as waitForReplyDispatcherIdle, n as attachReplyDispatchUndeliveredFallback, r as captureReplyDispatchDeliveryOutcome } from "./reply-dispatcher-o85-ZXwA.js";
import { a as cleanDeferredFinalText, c as shouldDeferFinalTtsText, i as buildCaptionedFinalTextFallback, n as needsTtsFallback, o as isCaptionedFinalTextPayload, p as readDispatcherFailedCounts, s as mergeDeferredFinalText } from "./dispatch-from-config.finalize-2GDE_rL1.js";
import { t as createTtsDirectiveTextStreamCleaner } from "./directives-BCGsQXMa.js";
import { t as resolveStatusTtsSnapshot } from "./status-config-e83XQcG5.js";
import { m as createBlockReplyPipeline } from "./dispatch-from-config.payloads-DUTjof5z.js";
import { n as resolveAcpAgentPolicyError, r as resolveAcpDispatchPolicyError } from "./policy-BFNGQx06.js";
import { n as formatToolSummary, o as resolveToolDisplay } from "./tool-display-DNnLx8TW.js";
import { n as resolveRoutedDeliveryThreadId } from "./routed-delivery-thread-DxMCHrWC.js";
import { t as EmbeddedBlockChunker } from "./embedded-agent-block-chunker-BDFESe1L.js";
import { r as createChannelReplyTransform } from "./reply-transform-D4mhFVwH.js";
import { r as prefixSystemMessage } from "./system-message-Dltw0_t9.js";
import { r as hasInboundMediaForUnderstanding } from "./inbound-media-DbDNHQxy.js";
import { i as appendRecentHistoryImageContext, n as resolveAgentTurnAttachments, r as resolveInlineAgentImageAttachments, t as loadAgentTurnMediaRuntime } from "./agent-turn-attachments-DD8wR6r6.js";
import { t as stripExtractedFileImageMetadata } from "./extracted-file-images-CdmNdoIK.js";
import { t as resolveAcpToolTerminalOutcome } from "./tool-status-CyYVXMyT.js";
import { n as resolveAcpProjectionSettings, r as resolveAcpStreamingConfig, t as isAcpTagVisible } from "./acp-stream-settings-sUuJ_k2_.js";
import { t as consumeChannelRunAdmission } from "./channel-run-admission-C_FNWUcS.js";
//#region src/auto-reply/reply/acp-projector.ts
const ACP_BLOCK_REPLY_TIMEOUT_MS = 15e3;
const ACP_LIVE_IDLE_FLUSH_FLOOR_MS = 750;
const ACP_LIVE_IDLE_MIN_CHARS = 80;
const ACP_LIVE_SOFT_FLUSH_CHARS = 220;
const ACP_LIVE_HARD_FLUSH_CHARS = 480;
const HIDDEN_BOUNDARY_TAGS = /* @__PURE__ */ new Set(["tool_call", "tool_call_update"]);
function truncateText(input, maxChars) {
	if (input.length <= maxChars) return input;
	if (maxChars <= 1) return truncateUtf16Safe(input, maxChars);
	return truncateWithMarker(input, maxChars, {
		marker: "…",
		reserve: 1,
		trimEnd: false
	});
}
function hashText(text) {
	return text.trim();
}
function normalizeToolStatus(status) {
	return normalizeOptionalLowercaseString(status) || void 0;
}
function resolveHiddenBoundarySeparatorText(mode) {
	if (mode === "space") return " ";
	if (mode === "newline") return "\n";
	if (mode === "paragraph") return "\n\n";
	return "";
}
function shouldInsertSeparator(params) {
	if (!params.separator) return false;
	if (!params.nextText) return false;
	const firstChar = params.nextText[0];
	if (typeof firstChar === "string" && /\s/.test(firstChar)) return false;
	const tail = params.previousTail ?? "";
	if (!tail) return false;
	if (params.separator === " " && /\s$/.test(tail)) return false;
	if ((params.separator === "\n" || params.separator === "\n\n") && tail.endsWith("\n")) return false;
	return true;
}
function shouldFlushLiveBufferOnBoundary(text) {
	if (!text) return false;
	if (text.length >= ACP_LIVE_HARD_FLUSH_CHARS) return true;
	if (text.endsWith("\n\n")) return true;
	if (/[.!?][)"'`]*\s$/.test(text)) return true;
	if (text.length >= ACP_LIVE_SOFT_FLUSH_CHARS && /\s$/.test(text)) return true;
	return false;
}
function shouldFlushLiveBufferOnIdle(text) {
	if (!text) return false;
	if (text.length >= ACP_LIVE_IDLE_MIN_CHARS) return true;
	if (/[.!?][)"'`]*$/.test(text.trimEnd())) return true;
	if (text.includes("\n")) return true;
	return false;
}
function renderToolSummaryText(event, shouldSendFullToolDetails) {
	const detailParts = [];
	const commandBearing = normalizeOptionalLowercaseString(event.kind) === "execute";
	const title = shouldSendFullToolDetails || !commandBearing ? normalizeOptionalString(event.title) : void 0;
	if (title) detailParts.push(title);
	const status = normalizeOptionalString(event.status);
	if (status) detailParts.push(`status=${status}`);
	const fallback = shouldSendFullToolDetails || !commandBearing ? normalizeOptionalString(event.text) : void 0;
	if (detailParts.length === 0 && fallback) detailParts.push(fallback);
	return formatToolSummary(resolveToolDisplay({
		name: "tool_call",
		meta: detailParts.join(" · ") || "tool call"
	}));
}
function createAcpReplyProjector(params) {
	const settings = resolveAcpProjectionSettings(params.cfg);
	const streaming = resolveAcpStreamingConfig({
		cfg: params.cfg,
		provider: params.provider,
		accountId: params.accountId,
		deliveryMode: settings.deliveryMode
	});
	const blockReplyPipeline = createBlockReplyPipeline({
		onBlockReply: async (payload) => {
			await params.deliver("block", payload);
		},
		timeoutMs: ACP_BLOCK_REPLY_TIMEOUT_MS,
		coalescing: settings.deliveryMode === "live" ? void 0 : streaming.coalescing
	});
	const chunker = new EmbeddedBlockChunker(streaming.chunking);
	const liveIdleFlushMs = Math.max(streaming.coalescing.idleMs, ACP_LIVE_IDLE_FLUSH_FLOOR_MS);
	let emittedOutputChars = 0;
	let truncationNoticeEmitted = false;
	let lastStatusHash;
	let lastToolHash;
	let lastUsageTuple;
	let lastVisibleOutputTail;
	let pendingHiddenBoundary = false;
	let liveBufferText = "";
	let finalOnlyOutputText = "";
	let liveIdleTimer;
	const pendingToolDeliveries = [];
	const toolLifecycleById = /* @__PURE__ */ new Map();
	const shouldSendToolSummaries = () => params.shouldSendToolSummariesNow?.() ?? params.shouldSendToolSummaries;
	const clearLiveIdleTimer = () => {
		if (!liveIdleTimer) return;
		clearTimeout(liveIdleTimer);
		liveIdleTimer = void 0;
	};
	const drainChunker = (force) => {
		if (settings.deliveryMode === "final_only" && !force) return;
		chunker.drain({
			force,
			emit: (chunk) => {
				blockReplyPipeline.enqueue({ text: chunk });
			}
		});
	};
	const flushLiveBuffer = (opts) => {
		if (settings.deliveryMode !== "live") return;
		if (!liveBufferText) return;
		if (opts?.idle && !shouldFlushLiveBufferOnIdle(liveBufferText)) return;
		const text = liveBufferText;
		liveBufferText = "";
		chunker.append(text);
		drainChunker(opts?.force === true);
	};
	const scheduleLiveIdleFlush = () => {
		if (settings.deliveryMode !== "live") return;
		if (liveIdleFlushMs <= 0 || !liveBufferText) return;
		clearLiveIdleTimer();
		liveIdleTimer = setTimeout(() => {
			flushLiveBuffer({
				force: true,
				idle: true
			});
			if (liveBufferText) scheduleLiveIdleFlush();
		}, liveIdleFlushMs);
	};
	const flushBufferedToolDeliveries = async (force) => {
		if (!(settings.deliveryMode === "final_only" && force)) return;
		if (!shouldSendToolSummaries()) {
			pendingToolDeliveries.length = 0;
			return;
		}
		for (const entry of pendingToolDeliveries.splice(0)) await params.deliver("tool", entry.payload, entry.meta);
	};
	const flush = async (force = false) => {
		if (settings.deliveryMode === "live") {
			clearLiveIdleTimer();
			flushLiveBuffer({ force: true });
		}
		await flushBufferedToolDeliveries(force);
		if (settings.deliveryMode === "final_only") {
			if (force && finalOnlyOutputText.trim().length > 0) {
				const text = finalOnlyOutputText;
				finalOnlyOutputText = "";
				await params.deliver("final", { text });
			}
		} else drainChunker(force);
		await blockReplyPipeline.flush({ force });
	};
	const emitSystemStatus = async (text, meta, opts) => {
		if (!shouldSendToolSummaries()) return;
		const bounded = truncateText(text.trim(), settings.maxSessionUpdateChars);
		if (!bounded) return;
		const formatted = prefixSystemMessage(bounded);
		const hash = hashText(formatted);
		if (settings.repeatSuppression && opts?.dedupe !== false && lastStatusHash === hash) return;
		if (settings.deliveryMode === "final_only") pendingToolDeliveries.push({
			payload: { text: formatted },
			meta
		});
		else {
			await flush(true);
			await params.deliver("tool", { text: formatted }, meta);
		}
		lastStatusHash = hash;
	};
	const markHiddenToolBoundary = (event) => {
		if (!event.tag || !HIDDEN_BOUNDARY_TAGS.has(event.tag)) return;
		const isTerminal = resolveAcpToolTerminalOutcome(normalizeToolStatus(event.status)) !== void 0;
		pendingHiddenBoundary = pendingHiddenBoundary || event.tag === "tool_call" || isTerminal;
	};
	const emitToolSummary = async (event) => {
		if (!shouldSendToolSummaries()) {
			markHiddenToolBoundary(event);
			return;
		}
		if (!isAcpTagVisible(settings, event.tag)) return;
		const renderedToolSummary = renderToolSummaryText(event, params.shouldSendFullToolDetails);
		const toolSummary = truncateText(renderedToolSummary, settings.maxSessionUpdateChars);
		const hash = hashText(renderedToolSummary);
		const toolCallId = normalizeOptionalString(event.toolCallId);
		const status = normalizeToolStatus(event.status);
		const isTerminal = resolveAcpToolTerminalOutcome(status) !== void 0;
		const isStart = status === "in_progress" || event.tag === "tool_call";
		if (settings.repeatSuppression) {
			if (toolCallId) {
				const state = toolLifecycleById.get(toolCallId) ?? {
					started: false,
					terminal: false
				};
				if (isTerminal && state.terminal) return;
				if (isStart && state.started) return;
				if (state.lastRenderedHash === hash) return;
				if (isStart) state.started = true;
				if (isTerminal) state.terminal = true;
				state.lastRenderedHash = hash;
				toolLifecycleById.set(toolCallId, state);
			} else if (lastToolHash === hash) return;
		}
		const deliveryMeta = {
			...event.tag ? { tag: event.tag } : {},
			...toolCallId ? { toolCallId } : {},
			...status ? { toolStatus: status } : {},
			allowEdit: Boolean(toolCallId && event.tag === "tool_call_update")
		};
		if (settings.deliveryMode === "final_only") {
			pendingToolDeliveries.push({
				payload: { text: toolSummary },
				meta: deliveryMeta
			});
			markHiddenToolBoundary(event);
		} else {
			await flush(true);
			await params.deliver("tool", { text: toolSummary }, deliveryMeta);
		}
		lastToolHash = hash;
	};
	const emitTruncationNotice = async () => {
		if (truncationNoticeEmitted) return;
		truncationNoticeEmitted = true;
		await emitSystemStatus("output truncated", { tag: "session_info_update" }, { dedupe: false });
	};
	const onEvent = async (event) => {
		params.onProgress?.();
		if (event.type === "text_delta") {
			if (event.stream && event.stream !== "output") return;
			if (!isAcpTagVisible(settings, event.tag)) return;
			let text = event.text;
			if (!text) return;
			if (pendingHiddenBoundary && shouldInsertSeparator({
				separator: resolveHiddenBoundarySeparatorText(settings.hiddenBoundarySeparator),
				previousTail: lastVisibleOutputTail,
				nextText: text
			})) text = `${resolveHiddenBoundarySeparatorText(settings.hiddenBoundarySeparator)}${text}`;
			pendingHiddenBoundary = false;
			if (emittedOutputChars >= settings.maxOutputChars) {
				await emitTruncationNotice();
				return;
			}
			const remaining = settings.maxOutputChars - emittedOutputChars;
			const accepted = remaining < text.length ? truncateUtf16Safe(text, remaining) : text;
			if (accepted.length > 0) {
				emittedOutputChars += accepted.length;
				lastVisibleOutputTail = accepted.slice(-1);
				if (settings.deliveryMode === "live") {
					liveBufferText += accepted;
					if (shouldFlushLiveBufferOnBoundary(liveBufferText)) {
						clearLiveIdleTimer();
						flushLiveBuffer({ force: true });
					} else scheduleLiveIdleFlush();
				} else finalOnlyOutputText += accepted;
			}
			if (accepted.length < text.length) {
				emittedOutputChars = settings.maxOutputChars;
				await emitTruncationNotice();
			}
			return;
		}
		if (event.type === "status") {
			if (!isAcpTagVisible(settings, event.tag)) return;
			if (event.tag === "usage_update" && settings.repeatSuppression) {
				const usageTuple = typeof event.used === "number" && typeof event.size === "number" ? `${event.used}/${event.size}` : hashText(event.text);
				if (usageTuple === lastUsageTuple) return;
				lastUsageTuple = usageTuple;
			}
			await emitSystemStatus(event.text, event.tag ? { tag: event.tag } : void 0, { dedupe: true });
			return;
		}
		if (event.type === "tool_call") {
			if (!isAcpTagVisible(settings, event.tag)) {
				markHiddenToolBoundary(event);
				return;
			}
			await emitToolSummary(event);
		}
	};
	return {
		onEvent,
		flush
	};
}
//#endregion
//#region src/auto-reply/reply/dispatch-acp-payload.ts
function prepareAcpDeliveryPayload(params) {
	if (!params.routed) return prepareReplyPayloadForDispatcher(params.dispatcher, params.kind, params.payload);
	return normalizeReplyPayloadOutcome(params.payload, { transformReplyPayload: createChannelReplyTransform({
		messaging: params.messaging,
		cfg: params.cfg,
		accountId: params.accountId
	}) });
}
//#endregion
//#region src/auto-reply/reply/dispatch-acp-delivery.ts
const routeReplyRuntimeLoader = createLazyImportLoader(() => import("./route-reply.runtime.js"));
const dispatchAcpTtsRuntimeLoader$1 = createLazyImportLoader(() => import("./tts.runtime.js"));
const channelPluginRuntimeLoader = createLazyImportLoader(() => import("./plugins-DCGcYMgp.js"));
const messageActionRuntimeLoader = createLazyImportLoader(() => import("./message-action-runner-DPF6Wk9q.js"));
function loadRouteReplyRuntime() {
	return routeReplyRuntimeLoader.load();
}
function loadDispatchAcpTtsRuntime$1() {
	return dispatchAcpTtsRuntimeLoader$1.load();
}
function loadChannelPluginRuntime() {
	return channelPluginRuntimeLoader.load();
}
function loadMessageActionRuntime() {
	return messageActionRuntimeLoader.load();
}
async function shouldTreatDeliveredTextAsVisible(params) {
	if (!normalizeOptionalString(params.text)) return false;
	if (params.kind === "final") return true;
	const channelId = normalizeOptionalLowercaseString(params.channel);
	if (!channelId) return false;
	const { getChannelPlugin } = await loadChannelPluginRuntime();
	const outbound = getChannelPlugin(channelId)?.outbound;
	const visibilityOverride = outbound?.shouldTreatDeliveredTextAsVisible ?? outbound?.shouldTreatRoutedTextAsVisible;
	if (visibilityOverride) return visibilityOverride({
		kind: params.kind,
		text: params.text
	});
	return false;
}
async function maybeApplyAcpTts(params) {
	if (params.skipTts) return params.payload;
	if (isReplyPayloadStatusNotice(params.payload)) return params.payload;
	const ttsStatus = resolveStatusTtsSnapshot({
		cfg: params.cfg,
		sessionAuto: params.ttsAuto,
		agentId: params.agentId,
		channelId: params.channel,
		accountId: params.accountId
	});
	if (!ttsStatus) return params.payload;
	if (ttsStatus.autoMode === "inbound" && !params.inboundAudio) return params.payload;
	if (params.kind !== "final" && resolveConfiguredTtsMode(params.cfg, {
		agentId: params.agentId,
		channelId: params.channel,
		accountId: params.accountId
	}) === "final") return params.payload;
	const { maybeApplyTtsToPayload } = await loadDispatchAcpTtsRuntime$1();
	const applied = await maybeApplyTtsToPayload({
		payload: params.payload,
		cfg: params.cfg,
		channel: params.channel,
		kind: params.kind,
		inboundAudio: params.inboundAudio,
		ttsAuto: params.ttsAuto,
		agentId: params.agentId,
		accountId: params.accountId
	});
	return copyReplyPayloadMetadata(params.payload, applied);
}
function createAcpDispatchDeliveryCoordinator(params) {
	const directChannel = normalizeOptionalLowercaseString(params.ctx.Provider ?? params.ctx.Surface);
	const routedChannel = normalizeOptionalLowercaseString(params.originatingChannel);
	const deliverySessionKey = normalizeOptionalString(params.sessionKey) ?? params.ctx.SessionKey;
	const explicitAccountId = normalizeOptionalString(params.originatingAccountId) ?? normalizeOptionalString(params.ctx.AccountId);
	const resolvedAccountId = resolveReplyDeliveryAccountId(params.cfg, routedChannel ?? directChannel, explicitAccountId);
	const routedReplyDelivery = params.originatingChannel ? createReplyDeliveryContext(resolveReplyToMode(params.cfg, params.originatingChannel, resolvedAccountId, params.originatingChatType ?? params.ctx.ChatType), params.originatingChatType ?? params.ctx.ChatType) : void 0;
	const state = {
		startedReplyLifecycle: false,
		accumulatedBlockText: "",
		accumulatedDeliveredBlockText: "",
		accumulatedVisibleBlockText: "",
		accumulatedBlockTtsText: "",
		accumulatedFinalText: "",
		accumulatedDeliveredFinalText: "",
		pendingTranscriptOutcomes: [],
		cleanBlockTtsDirectiveText: shouldCleanTtsDirectiveText({
			cfg: params.cfg,
			ttsAuto: params.sessionTtsAuto,
			agentId: params.agentId,
			channelId: params.ttsChannel,
			accountId: resolvedAccountId
		}) ? createTtsDirectiveTextStreamCleaner() : void 0,
		blockCount: 0,
		deliveredFinalReply: false,
		deliveredAnswerFinalToUser: false,
		deliveredFinalTtsMedia: false,
		deliveredVisibleText: false,
		failedVisibleTextDelivery: false,
		queuedDirectVisibleTextDeliveries: 0,
		settledDirectVisibleText: false,
		routedCounts: {
			tool: 0,
			block: 0,
			final: 0
		},
		suppressionReason: void 0,
		toolMessageByCallId: /* @__PURE__ */ new Map()
	};
	let hasPendingDirectBlockReplyDelivery = false;
	const appendDeliveredTranscriptText = (kind, blockText, finalText) => {
		if (kind === "block" && blockText) state.accumulatedDeliveredBlockText = state.accumulatedDeliveredBlockText ? `${state.accumulatedDeliveredBlockText}\n${blockText}` : blockText;
		if (kind === "final" && finalText) state.accumulatedDeliveredFinalText = state.accumulatedDeliveredFinalText ? `${state.accumulatedDeliveredFinalText}\n${finalText}` : finalText;
	};
	const waitForPendingDirectBlockReplyDelivery = async () => {
		if (!hasPendingDirectBlockReplyDelivery) return;
		hasPendingDirectBlockReplyDelivery = false;
		await waitForReplyDispatcherIdle(params.dispatcher, params.abortSignal);
	};
	const settleDirectVisibleText = async () => {
		if (state.settledDirectVisibleText || state.queuedDirectVisibleTextDeliveries === 0) return;
		state.settledDirectVisibleText = true;
		hasPendingDirectBlockReplyDelivery = false;
		await params.dispatcher.waitForIdle();
		const failedCounts = readDispatcherFailedCounts(params.dispatcher);
		const failedVisibleCount = failedCounts.block + failedCounts.final;
		if (failedVisibleCount > 0) state.failedVisibleTextDelivery = true;
		if (state.queuedDirectVisibleTextDeliveries > failedVisibleCount) state.deliveredVisibleText = true;
	};
	const startReplyLifecycleOnce = async () => {
		if (state.startedReplyLifecycle) return;
		state.startedReplyLifecycle = true;
		if (params.suppressReplyLifecycle) return;
		Promise.resolve(params.onReplyStart?.()).catch((error) => {
			logVerbose(`dispatch-acp: reply lifecycle start failed: ${error instanceof Error ? error.message : String(error)}`);
		});
	};
	const tryEditToolMessage = async (payload, toolCallId) => {
		if (!params.shouldRouteToOriginating || !params.originatingChannel || !params.originatingTo) return false;
		const handle = state.toolMessageByCallId.get(toolCallId);
		if (!handle?.messageId) return false;
		const message = normalizeOptionalString(payload.text);
		if (!message) return false;
		try {
			const { runMessageAction } = await loadMessageActionRuntime();
			await runMessageAction({
				cfg: params.cfg,
				action: "edit",
				params: {
					channel: handle.channel,
					to: handle.to,
					threadId: handle.threadId,
					messageId: handle.messageId,
					message
				},
				defaultAccountId: handle.accountId,
				sessionKey: params.ctx.SessionKey,
				requesterAccountId: params.ctx.AccountId
			});
			state.routedCounts.tool += 1;
			return true;
		} catch (error) {
			logVerbose(`dispatch-acp: tool message edit failed for ${toolCallId}: ${formatErrorMessage(error)}`);
			return false;
		}
	};
	const deliver = async (kind, payload, meta) => {
		let visiblePayload = payload;
		if (!params.suppressUserDelivery) {
			const routed = params.shouldRouteToOriginating && routedChannel !== void 0;
			const messaging = routed ? (await loadChannelPluginRuntime()).getChannelPlugin(routedChannel)?.messaging : void 0;
			const prepared = prepareAcpDeliveryPayload({
				cfg: params.cfg,
				dispatcher: params.dispatcher,
				kind,
				payload,
				routed,
				...messaging ? { messaging } : {},
				accountId: resolvedAccountId
			});
			if (prepared.kind === "suppress") {
				if (prepared.reason === "channel_transform") state.suppressionReason = prepared.reason;
				return false;
			}
			visiblePayload = prepared.payload;
		}
		const isStatusNotice = isReplyPayloadStatusNotice(visiblePayload);
		const rawBlockPayloadText = kind === "block" ? normalizeOptionalString(visiblePayload.text) : void 0;
		const rawBlockText = isStatusNotice ? void 0 : rawBlockPayloadText;
		if (rawBlockPayloadText) {
			const joinsBufferedTtsDirective = state.cleanBlockTtsDirectiveText?.hasBufferedDirectiveText() === true;
			if (rawBlockText) {
				if (state.accumulatedBlockText.length > 0) state.accumulatedBlockText += "\n";
				state.accumulatedBlockText += rawBlockText;
				if (state.accumulatedBlockTtsText.length > 0 && !joinsBufferedTtsDirective) state.accumulatedBlockTtsText += "\n";
				state.accumulatedBlockTtsText += rawBlockText;
				state.blockCount += 1;
			}
			if (state.cleanBlockTtsDirectiveText && rawBlockText) {
				const text = state.cleanBlockTtsDirectiveText.push(rawBlockPayloadText);
				visiblePayload = copyReplyPayloadMetadata(visiblePayload, {
					...visiblePayload,
					text: text.trim() ? text : void 0
				});
			}
			if (visiblePayload.text) {
				if (state.accumulatedVisibleBlockText.length > 0) state.accumulatedVisibleBlockText += "\n";
				state.accumulatedVisibleBlockText += visiblePayload.text;
			}
		}
		const rawFinalText = kind === "final" && !isStatusNotice ? normalizeOptionalString(visiblePayload.text) : void 0;
		if (rawFinalText) {
			if (state.accumulatedFinalText.length > 0) state.accumulatedFinalText += "\n";
			state.accumulatedFinalText += rawFinalText;
		}
		if (hasOutboundReplyContent(visiblePayload, { trimText: true })) await startReplyLifecycleOnce();
		else return false;
		if (params.suppressUserDelivery) return false;
		if (kind === "block" && params.suppressBlockUserDelivery && !isStatusNotice && !visiblePayload.isReasoning && !visiblePayload.isCommentary) {
			if (!Boolean(visiblePayload.mediaUrl || visiblePayload.mediaUrls?.length || visiblePayload.presentation || visiblePayload.interactive || visiblePayload.channelData)) return false;
			visiblePayload = copyReplyPayloadMetadata(visiblePayload, {
				...visiblePayload,
				text: void 0
			});
		}
		const appliedTtsPayload = await maybeApplyAcpTts({
			payload: visiblePayload,
			cfg: params.cfg,
			agentId: params.agentId,
			channel: params.ttsChannel,
			accountId: resolvedAccountId,
			kind,
			inboundAudio: params.inboundAudio,
			ttsAuto: params.sessionTtsAuto,
			skipTts: meta?.skipTts
		});
		const finalVisibleTextSource = kind === "final" && params.suppressBlockUserDelivery && state.cleanBlockTtsDirectiveText ? meta?.skipTts || visiblePayload.isError || isReplyPayloadTtsSupplement(visiblePayload) ? visiblePayload.text : mergeDeferredFinalText(state.accumulatedBlockTtsText, visiblePayload.text) : void 0;
		const ttsPayload = finalVisibleTextSource !== void 0 ? copyReplyPayloadMetadata(appliedTtsPayload, {
			...appliedTtsPayload,
			text: cleanDeferredFinalText(finalVisibleTextSource) || void 0
		}) : appliedTtsPayload;
		const hasFinalTtsMedia = kind === "final" && resolveSendableOutboundReplyParts(ttsPayload).hasMedia && isReplyPayloadTtsSupplement(ttsPayload);
		const isAnswerBearingFinal = kind === "final" && isCaptionedFinalTextPayload(visiblePayload);
		if (params.shouldRouteToOriginating && params.originatingChannel && params.originatingTo) {
			const toolCallId = normalizeOptionalString(meta?.toolCallId);
			if (kind === "tool" && meta?.allowEdit === true && toolCallId) {
				if (await tryEditToolMessage(ttsPayload, toolCallId)) return true;
			}
			const tracksVisibleText = await shouldTreatDeliveredTextAsVisible({
				channel: routedChannel,
				kind,
				text: ttsPayload.text,
				routed: true
			});
			const { routeReply } = await loadRouteReplyRuntime();
			const threadId = params.originatingThreadId ?? resolveRoutedDeliveryThreadId({
				ctx: params.ctx,
				sessionKey: deliverySessionKey
			});
			const result = await routeReply({
				payload: ttsPayload,
				channel: params.originatingChannel,
				to: params.originatingTo,
				sessionKey: deliverySessionKey,
				...deliverySessionKey !== params.ctx.SessionKey ? { policySessionKey: params.ctx.SessionKey } : {},
				accountId: resolvedAccountId,
				requesterSenderId: params.ctx.SenderId,
				requesterSenderName: params.ctx.SenderName,
				requesterSenderUsername: params.ctx.SenderUsername,
				requesterSenderE164: params.ctx.SenderE164,
				threadId,
				replyDelivery: routedReplyDelivery,
				cfg: params.cfg,
				abortSignal: params.abortSignal,
				mirror: false,
				replyKind: kind,
				runId: params.runId
			});
			if (!result.delivered && hasFinalTtsMedia && ttsPayload.text?.trim()) {
				if (!result.suppressed) logVerbose(`dispatch-acp: route-reply (acp/${kind}) failed: ${result.error ?? "unknown error"}`);
				return await deliver("final", { text: ttsPayload.text }, { skipTts: true });
			}
			if (!result.delivered && !result.suppressed) {
				if (tracksVisibleText) state.failedVisibleTextDelivery = true;
				logVerbose(`dispatch-acp: route-reply (acp/${kind}) failed: ${result.error ?? "unknown error"}`);
				return false;
			}
			if (result.suppressed) {
				if (kind === "final") state.deliveredFinalReply = true;
				if (tracksVisibleText) state.deliveredVisibleText = true;
				return true;
			}
			if (!result.ok) logVerbose(`dispatch-acp: route-reply (acp/${kind}) partially failed after delivery: ${result.error ?? "unknown error"}`);
			if (kind === "tool" && meta?.toolCallId && result.messageId) state.toolMessageByCallId.set(meta.toolCallId, {
				channel: params.originatingChannel,
				accountId: resolvedAccountId,
				to: params.originatingTo,
				...threadId != null ? { threadId } : {},
				messageId: result.messageId
			});
			appendDeliveredTranscriptText(kind, rawBlockText, rawFinalText);
			if (kind === "final") {
				state.deliveredFinalReply = true;
				if (isAnswerBearingFinal) {
					state.deliveredAnswerFinalToUser = true;
					state.deliveredFinalTtsMedia = hasFinalTtsMedia;
				}
			}
			if (tracksVisibleText) state.deliveredVisibleText = true;
			state.routedCounts[kind] += 1;
			return true;
		}
		if (kind === "tool") await waitForPendingDirectBlockReplyDelivery();
		const tracksVisibleText = await shouldTreatDeliveredTextAsVisible({
			channel: directChannel,
			kind,
			text: ttsPayload.text,
			routed: false
		});
		const transcriptOutcome = rawBlockText || rawFinalText || hasFinalTtsMedia ? captureReplyDispatchDeliveryOutcome(ttsPayload) : void 0;
		if (hasFinalTtsMedia && ttsPayload.text?.trim()) attachReplyDispatchUndeliveredFallback(ttsPayload, buildCaptionedFinalTextFallback(ttsPayload));
		const delivered = kind === "tool" ? params.dispatcher.sendToolResult(ttsPayload) : kind === "block" ? params.dispatcher.sendBlockReply(ttsPayload) : params.dispatcher.sendFinalReply(ttsPayload);
		if (delivered && transcriptOutcome) {
			if (transcriptOutcome.isTracked()) state.pendingTranscriptOutcomes.push(transcriptOutcome.promise.then((outcome) => {
				if (outcome === "delivered") appendDeliveredTranscriptText(kind, rawBlockText, rawFinalText);
			}));
		}
		if (kind === "final" && delivered) {
			state.deliveredFinalReply = true;
			if (isAnswerBearingFinal) {
				state.deliveredAnswerFinalToUser = true;
				state.deliveredFinalTtsMedia = hasFinalTtsMedia;
			}
		}
		if (delivered && tracksVisibleText) {
			state.queuedDirectVisibleTextDeliveries += 1;
			state.settledDirectVisibleText = false;
		} else if (!delivered && tracksVisibleText) state.failedVisibleTextDelivery = true;
		if (kind === "block" && delivered) hasPendingDirectBlockReplyDelivery = true;
		return delivered;
	};
	return {
		startReplyLifecycle: startReplyLifecycleOnce,
		deliver,
		getBlockCount: () => state.blockCount,
		getAccumulatedBlockText: () => state.accumulatedBlockText,
		getAccumulatedVisibleBlockText: () => state.accumulatedVisibleBlockText,
		getAccumulatedBlockTtsText: () => state.accumulatedBlockTtsText,
		getAccumulatedFinalText: () => state.accumulatedFinalText,
		getAccumulatedTranscriptText: () => state.accumulatedFinalText || state.accumulatedBlockText,
		resolveAccumulatedDeliveredTranscriptText: async () => {
			await Promise.all(state.pendingTranscriptOutcomes.splice(0));
			return state.accumulatedDeliveredFinalText || state.accumulatedDeliveredBlockText;
		},
		settleVisibleText: settleDirectVisibleText,
		hasDeliveredFinalReply: () => state.deliveredFinalReply,
		hasDeliveredAnswerFinalToUser: () => state.deliveredAnswerFinalToUser,
		hasDeliveredFinalTtsMedia: () => state.deliveredFinalTtsMedia,
		hasDeliveredVisibleText: () => state.deliveredVisibleText,
		hasFailedVisibleTextDelivery: () => state.failedVisibleTextDelivery,
		getDeliverySuppressionReason: () => state.suppressionReason,
		getRoutedCounts: () => ({ ...state.routedCounts }),
		applyRoutedCounts: (counts) => {
			counts.tool += state.routedCounts.tool;
			counts.block += state.routedCounts.block;
			counts.final += state.routedCounts.final;
		}
	};
}
//#endregion
//#region src/auto-reply/reply/dispatch-acp.ts
const dispatchAcpManagerRuntimeLoader = createLazyImportLoader(() => import("./dispatch-acp-manager.runtime.js"));
const dispatchAcpAuditRuntimeLoader = createLazyImportLoader(() => import("./attempt-execution.runtime.js"));
function appendOrderedAcpAttachments(params) {
	for (const [index, attachment] of params.attachments.entries()) params.entries.push({
		attachment,
		sourceIndex: params.sourceIndexes?.[index],
		sequence: params.entries.length
	});
}
function resolveMergedAcpAttachments(entries) {
	return entries.toSorted((left, right) => {
		if (left.sourceIndex !== void 0 && right.sourceIndex !== void 0) return left.sourceIndex - right.sourceIndex || left.sequence - right.sequence;
		if (left.sourceIndex !== void 0 || right.sourceIndex !== void 0) return left.sequence - right.sequence;
		return left.sequence - right.sequence;
	}).map((entry) => entry.attachment);
}
const dispatchAcpTtsRuntimeLoader = createLazyImportLoader(() => import("./tts.runtime.js"));
const dispatchAcpTranscriptRuntimeLoader = createLazyImportLoader(() => import("./dispatch-acp-transcript.runtime.js"));
function loadDispatchAcpManagerRuntime() {
	return dispatchAcpManagerRuntimeLoader.load();
}
function loadDispatchAcpAuditRuntime() {
	return dispatchAcpAuditRuntimeLoader.load();
}
function loadDispatchAcpTtsRuntime() {
	return dispatchAcpTtsRuntimeLoader.load();
}
function loadDispatchAcpTranscriptRuntime() {
	return dispatchAcpTranscriptRuntimeLoader.load();
}
function resolveAcpPromptText(ctx) {
	return ctx.agentText.trim();
}
function resolveAcpRequestId(ctx) {
	const id = ctx.MessageSidFull ?? ctx.MessageSid ?? ctx.MessageSidFirst ?? ctx.MessageSidLast;
	if (typeof id === "string") {
		const normalizedId = normalizeOptionalString(id);
		if (normalizedId) return normalizedId;
	}
	if (typeof id === "number" || typeof id === "bigint") return String(id);
	return generateSecureUuid();
}
function resolveAcpTurnText(params) {
	if (params.sourceReplyDeliveryMode !== "message_tool_only") return params.promptText;
	const guidance = prefixSystemMessage([
		"Source channel delivery is private by default for this turn.",
		"Normal ACP final output will not be automatically posted to the source channel.",
		"To send visible output, use message(action=send). The target defaults to the current source channel."
	].join(" "));
	return params.promptText ? `${guidance}\n\n${params.promptText}` : guidance;
}
function isRestrictiveRuntimeToolsAllow(toolsAllow) {
	if (toolsAllow === void 0) return false;
	return !toolsAllow.some((entry) => normalizeLowercaseStringOrEmpty(entry) === "*");
}
async function hasBoundConversationForSession(params) {
	const channel = normalizeOptionalLowercaseString(params.channelRaw) ?? "";
	if (!channel) return false;
	const accountId = normalizeOptionalLowercaseString(params.accountIdRaw) ?? "";
	const configuredDefaultAccountId = params.cfg.channels?.[channel]?.defaultAccount;
	const normalizedAccountId = accountId || normalizeOptionalLowercaseString(configuredDefaultAccountId) || "default";
	const { getSessionBindingService } = await loadDispatchAcpManagerRuntime();
	return getSessionBindingService().listBySession(params.sessionKey).some((binding) => {
		const bindingChannel = normalizeOptionalLowercaseString(binding.conversation.channel) ?? "";
		const bindingAccountId = normalizeOptionalLowercaseString(binding.conversation.accountId) ?? "";
		const conversationId = normalizeOptionalString(binding.conversation.conversationId) ?? "";
		return bindingChannel === channel && (bindingAccountId || "default") === normalizedAccountId && conversationId.length > 0;
	});
}
function finishAcpDispatchAttempt(params) {
	const counts = params.dispatcher.getQueuedCounts();
	params.delivery.applyRoutedCounts(counts);
	const suppressionReason = counts.tool + counts.block + counts.final > 0 || params.queuedFinal ? void 0 : params.delivery.getDeliverySuppressionReason();
	const acpStats = params.getStats();
	if (params.outcome.kind === "ok") {
		logVerbose(`acp-dispatch: session=${params.sessionKey} outcome=ok latencyMs=${Date.now() - params.startedAt} queueDepth=${acpStats.turns.queueDepth} activeRuntimes=${acpStats.runtimeCache.activeSessions}`);
		params.recordProcessed("completed", { reason: suppressionReason ?? "acp_dispatch" });
	} else {
		logVerbose(`acp-dispatch: session=${params.sessionKey} outcome=error code=${params.outcome.error.code} latencyMs=${Date.now() - params.startedAt} queueDepth=${acpStats.turns.queueDepth} activeRuntimes=${acpStats.runtimeCache.activeSessions}`);
		params.recordProcessed("completed", { reason: `acp_error:${normalizeLowercaseStringOrEmpty(params.outcome.error.code)}` });
	}
	params.markIdle("message_completed");
	return {
		queuedFinal: params.queuedFinal,
		counts
	};
}
const ACP_STALE_BINDING_UNBIND_REASON = "acp-session-init-failed";
function isStaleSessionInitError(params) {
	if (params.code !== "ACP_SESSION_INIT_FAILED") return false;
	return /(ACP (session )?metadata is missing|missing ACP metadata|Session is not ACP-enabled|Resource not found)/i.test(params.message);
}
async function maybeUnbindStaleBoundConversations(params) {
	if (!isStaleSessionInitError(params.error)) return;
	try {
		const { getSessionBindingService } = await loadDispatchAcpManagerRuntime();
		const removed = await getSessionBindingService().unbind({
			targetSessionKey: params.targetSessionKey,
			reason: ACP_STALE_BINDING_UNBIND_REASON
		});
		if (removed.length > 0) logVerbose(`dispatch-acp: removed ${removed.length} stale bound conversation(s) for ${params.targetSessionKey} after ${params.error.code}: ${params.error.message}`);
	} catch (error) {
		logVerbose(`dispatch-acp: failed to unbind stale bound conversations for ${params.targetSessionKey}: ${formatErrorMessage(error)}`);
	}
}
async function finalizeAcpTurnOutput(params) {
	const ttsMode = resolveConfiguredTtsMode(params.cfg, {
		agentId: params.agentId,
		channelId: params.ttsChannel,
		accountId: params.ttsAccountId
	});
	const accumulatedBlockTtsText = params.delivery.getAccumulatedBlockTtsText();
	const hasAccumulatedBlockText = accumulatedBlockTtsText.trim().length > 0;
	const ttsStatus = resolveStatusTtsSnapshot({
		cfg: params.cfg,
		sessionAuto: params.sessionTtsAuto,
		agentId: params.agentId,
		channelId: params.ttsChannel,
		accountId: params.ttsAccountId
	});
	const canAttemptFinalTts = ttsStatus != null && !(ttsStatus.autoMode === "inbound" && !params.inboundAudio);
	const shouldDeferVisibleTextForTts = params.shouldDeferVisibleTextForTts && ttsMode === "final" && hasAccumulatedBlockText && canAttemptFinalTts;
	const accumulatedVisibleBlockText = shouldDeferVisibleTextForTts ? cleanDeferredFinalText(accumulatedBlockTtsText) : params.delivery.getAccumulatedVisibleBlockText();
	if (!shouldDeferVisibleTextForTts) await params.delivery.settleVisibleText();
	let queuedFinal = params.delivery.hasDeliveredVisibleText() && !params.delivery.hasFailedVisibleTextDelivery();
	let finalMediaDelivered = params.delivery.hasDeliveredFinalTtsMedia();
	if (ttsMode === "final" && hasAccumulatedBlockText && canAttemptFinalTts && !finalMediaDelivered) try {
		const { maybeApplyTtsToPayload } = await loadDispatchAcpTtsRuntime();
		const ttsSyntheticReply = await maybeApplyTtsToPayload({
			payload: { text: accumulatedBlockTtsText },
			cfg: params.cfg,
			channel: params.ttsChannel,
			kind: "final",
			inboundAudio: params.inboundAudio,
			ttsAuto: params.sessionTtsAuto,
			agentId: params.agentId,
			accountId: params.ttsAccountId
		});
		if (ttsSyntheticReply.mediaUrl) {
			const finalTtsPayload = markReplyPayloadAsTtsSupplement(shouldDeferVisibleTextForTts ? {
				...ttsSyntheticReply,
				text: accumulatedVisibleBlockText || void 0,
				trustedLocalMedia: true
			} : {
				...ttsSyntheticReply,
				text: void 0,
				trustedLocalMedia: true
			}, accumulatedBlockTtsText, shouldDeferVisibleTextForTts ? void 0 : { visibleTextAlreadyDelivered: true });
			const delivered = await params.delivery.deliver("final", finalTtsPayload);
			queuedFinal = queuedFinal || delivered;
			finalMediaDelivered = params.delivery.hasDeliveredFinalTtsMedia();
		} else if (shouldDeferVisibleTextForTts && ttsSyntheticReply.text?.trim()) {
			const delivered = await params.delivery.deliver("final", { text: ttsSyntheticReply.text }, { skipTts: true });
			queuedFinal = queuedFinal || delivered;
		} else if (needsTtsFallback(true, accumulatedVisibleBlockText, ttsSyntheticReply.text)) {
			const delivered = await params.delivery.deliver("final", { text: ttsSyntheticReply.text }, { skipTts: true });
			queuedFinal = queuedFinal || delivered;
		}
	} catch (err) {
		logVerbose(`dispatch-acp: accumulated ACP block TTS failed: ${formatErrorMessage(err)}`);
	}
	if (ttsMode !== "all" && accumulatedVisibleBlockText.trim().length > 0 && !finalMediaDelivered && (shouldDeferVisibleTextForTts ? !params.delivery.hasDeliveredAnswerFinalToUser() : !params.delivery.hasDeliveredFinalReply() && (!params.delivery.hasDeliveredVisibleText() || params.delivery.hasFailedVisibleTextDelivery()))) {
		const delivered = await params.delivery.deliver("final", { text: accumulatedVisibleBlockText }, { skipTts: true });
		queuedFinal = queuedFinal || delivered;
	}
	if (params.shouldEmitResolvedIdentityNotice) {
		const { readAcpSessionEntry } = await loadDispatchAcpManagerRuntime();
		const currentMeta = readAcpSessionEntry({
			cfg: params.cfg,
			sessionKey: params.sessionKey,
			agentId: params.agentId
		})?.acp;
		if (!isSessionIdentityPending(resolveSessionIdentityFromMeta(currentMeta))) {
			const resolvedDetails = resolveAcpThreadSessionDetailLines({
				sessionKey: params.sessionKey,
				meta: currentMeta
			});
			if (resolvedDetails.length > 0) {
				const delivered = await params.delivery.deliver("final", { text: prefixSystemMessage(["Session ids resolved.", ...resolvedDetails].join("\n")) });
				queuedFinal = queuedFinal || delivered;
			}
		}
	}
	return queuedFinal;
}
async function tryDispatchAcpReplyCore(params) {
	const sessionKey = normalizeOptionalString(params.sessionKey);
	if (!sessionKey || params.bypassForCommand) return null;
	const { getAcpSessionManager } = await loadDispatchAcpManagerRuntime();
	const acpManager = getAcpSessionManager();
	const acpResolution = acpManager.resolveSession({
		cfg: params.cfg,
		sessionKey
	});
	if (acpResolution.kind === "none") return null;
	const canonicalSessionKey = acpResolution.sessionKey;
	const acpAgentId = resolveAgentIdFromSessionKey(canonicalSessionKey);
	const progressSessionKeys = isDiagnosticsEnabled(params.cfg) ? Array.from(new Set([
		params.ctx.SessionKey,
		sessionKey,
		canonicalSessionKey
	].map((key) => normalizeOptionalString(key)).filter((key) => Boolean(key)))) : [];
	const markAcpProgress = progressSessionKeys.length > 0 ? () => {
		for (const key of progressSessionKeys) markDiagnosticSessionProgress({ sessionKey: key });
	} : void 0;
	const identityPendingBeforeTurn = isSessionIdentityPending(resolveSessionIdentityFromMeta(acpResolution.kind === "ready" ? acpResolution.meta : void 0));
	const shouldEmitResolvedIdentityNotice = !params.suppressUserDelivery && identityPendingBeforeTurn && (Boolean(params.ctx.MessageThreadId != null && (normalizeOptionalString(String(params.ctx.MessageThreadId)) ?? "")) || await hasBoundConversationForSession({
		cfg: params.cfg,
		sessionKey: canonicalSessionKey,
		channelRaw: params.ctx.OriginatingChannel ?? params.ctx.Surface ?? params.ctx.Provider,
		accountIdRaw: params.ctx.AccountId
	}));
	const resolvedAcpAgent = acpResolution.kind === "ready" ? normalizeOptionalString(acpResolution.meta.agent) ?? normalizeOptionalString(params.cfg.acp?.defaultAgent) ?? resolveAgentIdFromSessionKey(canonicalSessionKey) : resolveAgentIdFromSessionKey(canonicalSessionKey);
	const normalizedDispatchChannel = normalizeOptionalLowercaseString(params.ctx.OriginatingChannel ?? params.ctx.Surface ?? params.ctx.Provider);
	const explicitDispatchAccountId = normalizeOptionalString(params.ctx.AccountId);
	const dispatchChannels = params.cfg.channels;
	const defaultDispatchAccount = normalizedDispatchChannel == null ? void 0 : dispatchChannels?.[normalizedDispatchChannel]?.defaultAccount;
	const effectiveDispatchAccountId = explicitDispatchAccountId ?? normalizeOptionalString(defaultDispatchAccount);
	const shouldDeferVisibleTextForTts = shouldDeferFinalTtsText({
		cfg: params.cfg,
		ttsAuto: params.sessionTtsAuto,
		agentId: acpAgentId,
		channelId: params.ttsChannel,
		accountId: effectiveDispatchAccountId,
		inboundAudio: params.inboundAudio
	});
	let queuedFinal = false;
	const delivery = createAcpDispatchDeliveryCoordinator({
		cfg: params.cfg,
		agentId: acpAgentId,
		ctx: params.ctx,
		dispatcher: params.dispatcher,
		inboundAudio: params.inboundAudio,
		sessionKey: canonicalSessionKey,
		sessionTtsAuto: params.sessionTtsAuto,
		ttsChannel: params.ttsChannel,
		suppressUserDelivery: params.suppressUserDelivery,
		suppressBlockUserDelivery: shouldDeferVisibleTextForTts,
		suppressReplyLifecycle: params.suppressReplyLifecycle,
		shouldRouteToOriginating: params.shouldRouteToOriginating,
		originatingChannel: params.originatingChannel,
		originatingTo: params.originatingTo,
		originatingAccountId: params.originatingAccountId,
		originatingThreadId: params.originatingThreadId,
		originatingChatType: params.originatingChatType,
		onReplyStart: params.onReplyStart,
		abortSignal: params.abortSignal,
		runId: params.runId
	});
	const deliverDeferredTextFallback = async () => {
		if (!shouldDeferVisibleTextForTts || delivery.hasDeliveredAnswerFinalToUser()) return false;
		const text = delivery.getAccumulatedVisibleBlockText();
		return text.trim() ? await delivery.deliver("final", { text }, { skipTts: true }) : false;
	};
	const projector = createAcpReplyProjector({
		cfg: params.cfg,
		shouldSendToolSummaries: params.shouldSendToolSummaries,
		shouldSendToolSummariesNow: params.shouldSendToolSummariesNow,
		shouldSendFullToolDetails: params.shouldSendFullToolDetails,
		deliver: delivery.deliver,
		onProgress: markAcpProgress,
		provider: params.ctx.Surface ?? params.ctx.Provider,
		accountId: effectiveDispatchAccountId
	});
	const acpDispatchStartedAt = Date.now();
	const finishAttempt = (options) => finishAcpDispatchAttempt({
		...options,
		dispatcher: params.dispatcher,
		delivery,
		getStats: () => acpManager.getObservabilitySnapshot(),
		sessionKey,
		startedAt: acpDispatchStartedAt,
		recordProcessed: params.recordProcessed,
		markIdle: params.markIdle
	});
	const requestId = resolveAcpRequestId(params.ctx);
	const existingRunId = normalizeOptionalString(params.runId);
	const auditOnly = existingRunId === void 0;
	const auditRunId = existingRunId ?? generateSecureUuid();
	const auditRuntime = await loadDispatchAcpAuditRuntime();
	const auditToolTracker = auditRuntime.createAcpToolLifecycleTracker();
	let auditStarted = false;
	let auditFinished = false;
	let auditTerminalOutcome;
	let auditStopReason;
	let auditResultStatus;
	let runtimeTurnWasCancelled = false;
	const emitAuditStart = () => {
		if (auditStarted) return;
		auditStarted = true;
		auditRuntime.emitAcpLifecycleStart({
			runId: auditRunId,
			sessionKey: canonicalSessionKey,
			agentId: acpAgentId,
			startedAt: Date.now(),
			auditOnly
		});
	};
	const emitAuditEnd = () => {
		if (auditFinished) return;
		emitAuditStart();
		auditFinished = true;
		auditRuntime.emitAcpLifecycleEnd({
			runId: auditRunId,
			toolTracker: auditToolTracker,
			sessionKey: canonicalSessionKey,
			agentId: acpAgentId,
			...params.abortSignal ? { abortSignal: params.abortSignal } : {},
			...auditStopReason ? { stopReason: auditStopReason } : {},
			...auditResultStatus ? { resultStatus: auditResultStatus } : {},
			auditOnly
		});
	};
	const emitAuditError = (error) => {
		if (auditFinished) return;
		emitAuditStart();
		auditFinished = true;
		auditRuntime.emitAcpLifecycleError({
			runId: auditRunId,
			toolTracker: auditToolTracker,
			sessionKey: canonicalSessionKey,
			agentId: acpAgentId,
			...params.abortSignal ? { abortSignal: params.abortSignal } : {},
			...auditTerminalOutcome ? { terminalOutcome: auditTerminalOutcome } : {},
			auditOnly,
			error
		});
	};
	let transcriptPromptText = "";
	let turnDispatched = false;
	let transcriptPersisted = false;
	const persistTranscript = async (finalText) => {
		if (transcriptPersisted) return;
		transcriptPersisted = true;
		try {
			const { persistAcpDispatchTranscript } = await loadDispatchAcpTranscriptRuntime();
			await persistAcpDispatchTranscript({
				cfg: params.cfg,
				sessionKey: canonicalSessionKey,
				promptText: transcriptPromptText,
				finalText,
				meta: acpResolution.kind === "ready" ? acpResolution.meta : void 0,
				threadId: params.ctx.MessageThreadId
			});
		} catch (error) {
			logVerbose(`dispatch-acp: transcript persistence failed for ${canonicalSessionKey}: ${formatErrorMessage(error)}`);
		}
	};
	let admittedRunContext;
	try {
		const dispatchPolicyError = resolveAcpDispatchPolicyError(params.cfg);
		if (dispatchPolicyError) {
			auditTerminalOutcome = "blocked";
			throw dispatchPolicyError;
		}
		if (isRestrictiveRuntimeToolsAllow(params.toolsAllow) || toolPolicyRestrictsTools(params.ctx.ConversationToolPolicy)) {
			auditTerminalOutcome = "blocked";
			throw new AcpRuntimeError("ACP_DISPATCH_DISABLED", "This session's bound runtime cannot enforce its tool policy; use an embedded runtime for this restricted conversation.");
		}
		if (acpResolution.kind === "stale") {
			emitAuditError(acpResolution.error);
			await maybeUnbindStaleBoundConversations({
				targetSessionKey: canonicalSessionKey,
				error: acpResolution.error
			});
			return finishAttempt({
				queuedFinal: await delivery.deliver("final", {
					text: formatAcpRuntimeErrorText(acpResolution.error),
					isError: true
				}),
				outcome: {
					kind: "error",
					error: acpResolution.error
				}
			});
		}
		const agentPolicyError = resolveAcpAgentPolicyError(params.cfg, resolvedAcpAgent);
		if (agentPolicyError) {
			auditTerminalOutcome = "blocked";
			throw agentPolicyError;
		}
		const resolvedTurnAttachments = await resolveAgentTurnAttachments({
			ctx: params.ctx,
			cfg: params.cfg,
			includeAttachmentIndexes: true
		});
		let extractedFileImages = params.extractedFileImages ?? [];
		if (hasInboundMediaForUnderstanding(params.ctx) && !params.ctx.MediaUnderstanding?.length) try {
			const { applyMediaUnderstanding } = await loadAgentTurnMediaRuntime();
			const mediaResult = await applyMediaUnderstanding({
				ctx: params.ctx,
				cfg: params.cfg,
				deliveredImageIndexes: new Set(resolvedTurnAttachments.attachmentIndexes ?? []),
				agentId: acpAgentId,
				agentDir: resolveAgentDir(params.cfg, acpAgentId),
				workspaceDir: resolveAgentWorkspaceDir(params.cfg, acpAgentId)
			});
			if (mediaResult.extractedFileImages.length > 0) extractedFileImages = [...extractedFileImages, ...mediaResult.extractedFileImages];
		} catch (err) {
			logVerbose(`dispatch-acp: media understanding failed, proceeding with raw content: ${formatErrorMessage(err)}`);
		}
		const promptText = resolveAcpPromptText(params.ctx);
		const mediaAttachments = resolvedTurnAttachments.attachments;
		const inlineAttachments = resolveInlineAgentImageAttachments(params.images);
		const extractedAttachments = resolveInlineAgentImageAttachments(extractedFileImages.map(stripExtractedFileImageMetadata));
		const mediaAttachmentsAreOnlyRecentHistory = mediaAttachments.length > 0 && mediaAttachments.length === resolvedTurnAttachments.recentHistoryImages.length;
		const useMediaAttachments = mediaAttachments.length > 0 && !(mediaAttachmentsAreOnlyRecentHistory && (inlineAttachments.length > 0 || extractedAttachments.length > 0));
		const attachmentEntries = [];
		if (useMediaAttachments) appendOrderedAcpAttachments({
			entries: attachmentEntries,
			attachments: mediaAttachments,
			sourceIndexes: resolvedTurnAttachments.attachmentIndexes
		});
		else appendOrderedAcpAttachments({
			entries: attachmentEntries,
			attachments: inlineAttachments
		});
		appendOrderedAcpAttachments({
			entries: attachmentEntries,
			attachments: extractedAttachments,
			sourceIndexes: extractedFileImages.map((image) => image.attachmentIndex)
		});
		const attachments = resolveMergedAcpAttachments(attachmentEntries);
		const turnPromptText = useMediaAttachments ? appendRecentHistoryImageContext({
			promptText,
			images: resolvedTurnAttachments.recentHistoryImages
		}) : promptText;
		transcriptPromptText = turnPromptText;
		if (!turnPromptText && attachments.length === 0) {
			const counts = params.dispatcher.getQueuedCounts();
			delivery.applyRoutedCounts(counts);
			params.recordProcessed("completed", { reason: "acp_empty_prompt" });
			params.markIdle("message_completed");
			return {
				queuedFinal: false,
				counts
			};
		}
		emitAuditStart();
		try {
			await delivery.startReplyLifecycle();
		} catch (error) {
			logVerbose(`dispatch-acp: start reply lifecycle failed: ${formatErrorMessage(error)}`);
		}
		turnDispatched = true;
		const channelAdmission = consumeChannelRunAdmission(readChannelContextAdmissionEvidence(params.ctx));
		admittedRunContext = await prepareAgentRunAdmission({
			cfg: params.cfg,
			operationalRunInstance: createOperationalRunInstanceRef(requestId),
			facts: {
				runId: requestId,
				agentId: acpAgentId,
				ingress: {
					kind: "acp",
					boundary: "auto-reply.acp",
					state: channelAdmission.ingressState
				},
				...channelAdmission.facts
			},
			onAdmitted: channelAdmission.onAdmitted
		}).admit("acp");
		await acpManager.runTurn({
			admittedRunContext,
			cfg: params.cfg,
			sessionKey: canonicalSessionKey,
			provenance: classifySessionStateActor({
				inputProvenance: params.ctx.InputProvenance,
				sessionEffects: params.ctx.InboundEventKind === "room_event" ? "internal" : "visible"
			}).actorType,
			text: resolveAcpTurnText({
				promptText: turnPromptText,
				sourceReplyDeliveryMode: params.sourceReplyDeliveryMode
			}),
			attachments: attachments.length > 0 ? attachments : void 0,
			mode: "prompt",
			requestId,
			...params.abortSignal ? { signal: params.abortSignal } : {},
			onEvent: async (event) => {
				auditRuntime.emitAcpRuntimeEvent({
					runId: auditRunId,
					toolTracker: auditToolTracker,
					sessionKey: canonicalSessionKey,
					agentId: acpAgentId,
					...params.abortSignal ? { abortSignal: params.abortSignal } : {},
					auditOnly,
					event
				});
				if (event.type === "done") {
					auditStopReason = event.stopReason;
					auditResultStatus = event.status;
					runtimeTurnWasCancelled = event.status === "cancelled";
				}
				await projector.onEvent(event);
			}
		});
		await projector.flush(true);
		if (runtimeTurnWasCancelled || params.abortSignal?.aborted) {
			queuedFinal = await deliverDeferredTextFallback() || queuedFinal;
			await persistTranscript(await delivery.resolveAccumulatedDeliveredTranscriptText());
			queuedFinal = delivery.hasDeliveredFinalReply() || queuedFinal;
			const counts = params.dispatcher.getQueuedCounts();
			delivery.applyRoutedCounts(counts);
			params.recordProcessed("completed", { reason: "acp_aborted" });
			params.markIdle("message_aborted");
			emitAuditEnd();
			return {
				queuedFinal,
				counts
			};
		}
		queuedFinal = await finalizeAcpTurnOutput({
			cfg: params.cfg,
			sessionKey: canonicalSessionKey,
			agentId: acpAgentId,
			delivery,
			inboundAudio: params.inboundAudio,
			sessionTtsAuto: params.sessionTtsAuto,
			ttsChannel: params.ttsChannel,
			ttsAccountId: effectiveDispatchAccountId,
			shouldDeferVisibleTextForTts,
			shouldEmitResolvedIdentityNotice
		}) || queuedFinal;
		await persistTranscript(delivery.getAccumulatedTranscriptText());
		const result = finishAttempt({
			queuedFinal,
			outcome: { kind: "ok" }
		});
		emitAuditEnd();
		return result;
	} catch (err) {
		const acpError = toAcpRuntimeError({
			error: err,
			fallbackCode: "ACP_TURN_FAILED",
			fallbackMessage: "ACP turn failed before completion."
		});
		emitAuditError(acpError);
		await projector.flush(true);
		queuedFinal = await deliverDeferredTextFallback() || queuedFinal;
		await maybeUnbindStaleBoundConversations({
			targetSessionKey: canonicalSessionKey,
			error: acpError
		});
		const errorText = formatAcpRuntimeErrorText(acpError);
		const partialText = delivery.getAccumulatedTranscriptText();
		const delivered = await delivery.deliver("final", {
			text: errorText,
			isError: true
		});
		if (turnDispatched) await persistTranscript(partialText ? `${partialText}\n\n${errorText}` : errorText);
		queuedFinal = queuedFinal || delivered;
		return finishAttempt({
			queuedFinal,
			outcome: {
				kind: "error",
				error: acpError
			}
		});
	} finally {
		if (admittedRunContext) closeAdmittedRunDelegatedAuthority(admittedRunContext);
	}
}
//#endregion
export { tryDispatchAcpReplyCore };
