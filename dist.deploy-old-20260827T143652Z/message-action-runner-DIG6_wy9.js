import { r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import "./src-BkwWvwB2.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { h as resolveSessionAgentId } from "./agent-scope-BizOtGGz.js";
import { c as parseAgentSessionKey } from "./session-key-utils-D8x_bjrd.js";
import { o as resolveSessionStorePathCore } from "./paths-B2oibYbs.js";
import { t as createSubsystemLogger } from "./subsystem-CDLhGl2-.js";
import { n as readTrimmedStringAlias } from "./string-readers-e58-jh1A.js";
import { r as shouldAttemptTtsPayload } from "./tts-config-CxRyjtgI.js";
import { t as ErrorCodes } from "./gateway-error-details-BWo6Le6w.js";
import { t as normalizeChatType } from "./chat-type-CG0X_HJM.js";
import { t as INTERNAL_MESSAGE_CHANNEL } from "./message-channel-constants-2zSoJXQC.js";
import { n as normalizeMessageChannel } from "./message-channel-core-BDhVfGhd.js";
import { $t as loadSessionEntryReadOnly, fn as getOwnedSessionTranscriptWriterFence } from "./session-accessor-Bi6bzKQE.js";
import { t as isDeliverableMessageChannel } from "./message-channel-normalize-rAbqRXlG.js";
import "./message-channel-T4W5YOto.js";
import { _ as readToolStringParam, h as readStringArrayParam, p as readPositiveIntegerParam, y as readSnakeCaseParamRaw } from "./common-BGOZLJ2_.js";
import { s as stripPlainTextToolCallBlocks } from "./src-Rlms7fwG.js";
import { t as findCodeRegions } from "./code-regions-BWkFWnhP.js";
import "./sessions-D-jhKYGW.js";
import { t as appendAssistantMessageToSessionTranscript } from "./transcript-DcKMk0pM.js";
import { t as parseInlineDirectives } from "./directive-tags-CvzK-y8_.js";
import { C as normalizeOutboundLocation } from "./reply-payload-DBNGwex4.js";
import { a as resolveSendableOutboundReplyParts } from "./reply-payload-parts-CRXUQ13n.js";
import { d as normalizeLegacyInteractiveReply, f as normalizeMessagePresentation, n as hasLegacyInteractiveReplyBlocks, o as hasReplyPayloadContent, r as hasMessagePresentationBlocks, v as renderMessagePresentationFallbackText } from "./payload-ByplrRCQ.js";
import { u as stripUnsupportedCitationControlMarkers } from "./payloads-YIMlWZ2P.js";
import { a as resolveResponsePrefixTemplate } from "./normalize-reply--NSgVK7M.js";
import { r as throwIfAborted } from "./deliver-prepare-x_0C8l3i.js";
import { n as resolveAgentIdentity, o as resolveResponsePrefix } from "./identity-hPPJEi06.js";
import { n as getAgentScopedMediaLocalRoots } from "./local-roots-Beya70q2.js";
import { t as resolveAgentScopedOutboundMediaAccess } from "./read-capability-DmcqV7rf.js";
import { t as normalizeConversationReadInvocationOrigin } from "./conversation-read-origin-E3olMOwo.js";
import { a as normalizeTargetForProvider } from "./target-normalization-C0pzawLy.js";
import { i as resolveChannelTarget } from "./target-resolver--eBeHIN9.js";
import { i as enforceMessageActionAllowlist, n as buildCrossContextDecoration, o as resolveEffectiveMessageToolsConfig, r as enforceCrossContextPolicy, s as shouldApplyCrossContextMarker, t as applyCrossContextDecoration } from "./outbound-policy-27cK4DQD.js";
import { t as hasPotentialPluginActionParam } from "./message-action-param-keys-B9A0lF2Z.js";
import { a as actionHasTarget, i as actionHasResourceReference, o as actionRequiresTarget, r as applyTargetToParams, s as resolveActionDeliveryTargetAlias } from "./channel-target-CcCiXRbC.js";
import { t as readBooleanParam } from "./boolean-param-AuSHeYDH.js";
import { _ as parseJsonMessageParam, a as isDeliveredCurrentSourceReplyAction, c as dispatchChannelMessageAction, d as collectActionMediaSourceHints, f as collectAttachmentSources, g as parseInteractiveParam, h as normalizeSandboxMediaParams, i as isDeliveredCurrentSourceReply, l as prepareExternalMessageActionTargetForResolution, m as normalizeSandboxMediaList, n as cancelTerminalSourceReplyDelivery, p as hydrateAttachmentParamsForAction, r as isCurrentSourceReplyActionName, s as reconcileTerminalSourceReplyDelivery, t as beginTerminalSourceReplyDelivery, u as shouldDeferExternalMessageActionTargetResolution, v as resolveAttachmentMediaPolicy, y as resolveExtraActionMediaSourceParamKeys } from "./source-reply-mirror-F_ntpYtq.js";
import { r as resolvePollMaxSelections } from "./polls-C-v11_tu.js";
import { n as listConfiguredMessageChannels, r as resolveMessageChannelSelection } from "./channel-selection-Bf-ic8nE.js";
import { n as sendPoll, r as resolveOutboundMessageGatewayOptions, t as sendMessage } from "./message-Tw_BXMvJ.js";
import { r as validateExplicitMessageAccountSelection } from "./message-account-selection-CcvDN_PR.js";
import { n as ensureOutboundSessionEntry, r as resolveOutboundSessionRoute } from "./outbound-session-BJsbg3br.js";
import { t as shouldUseInternalSourceReplySink } from "./internal-source-reply-BtXmR4SL.js";
import { t as extractToolPayload } from "./tool-payload-DUsjEraY.js";
import { t as resolveFirstBoundAccountId } from "./bound-account-read-BjN2bqKX.js";
import { t as stripFormattedReasoningMessage } from "./formatted-reasoning-message-Cts4xQyU.js";
//#region src/poll-params.ts
const SHARED_POLL_CREATION_PARAM_DEFS = {
	pollQuestion: { kind: "string" },
	pollOption: { kind: "stringArray" },
	pollDurationHours: { kind: "positiveInteger" },
	pollMulti: { kind: "boolean" }
};
const POLL_CREATION_PARAM_DEFS = SHARED_POLL_CREATION_PARAM_DEFS;
const SHARED_POLL_CREATION_PARAM_NAMES = Object.keys(SHARED_POLL_CREATION_PARAM_DEFS);
function readPollParamRaw(params, key) {
	return readSnakeCaseParamRaw(params, key);
}
const CONTENT_BEARING_SHARED_POLL_PARAM_NAMES = ["pollQuestion", "pollOption"];
function hasContentBearingPollCreationParam(params) {
	for (const key of CONTENT_BEARING_SHARED_POLL_PARAM_NAMES) {
		const def = expectDefined(POLL_CREATION_PARAM_DEFS[key], "poll creation param defs entry at key");
		const value = readPollParamRaw(params, key);
		if (def.kind === "string" && typeof value === "string" && value.trim().length > 0) return true;
		if (def.kind === "stringArray") {
			if (Array.isArray(value) && value.some((entry) => typeof entry === "string" && entry.trim())) return true;
			if (typeof value === "string" && value.trim().length > 0) return true;
		}
	}
	return false;
}
function hasPollCreationParams(params) {
	return hasContentBearingPollCreationParam(params);
}
//#endregion
//#region src/infra/outbound/message-action-threading.ts
function suppressesImplicitThreading(actionParams) {
	return actionParams.topLevel === true || actionParams.threadId === null;
}
/** Resolves and writes the outbound thread id used by message-action sends. */
function resolveAndApplyOutboundThreadId(actionParams, context) {
	const threadId = readToolStringParam(actionParams, "threadId");
	if (!threadId && suppressesImplicitThreading(actionParams)) return;
	const replyToId = readToolStringParam(actionParams, "replyTo");
	const autoResolvedThreadId = threadId ? void 0 : context.resolveAutoThreadId?.({
		cfg: context.cfg,
		accountId: context.accountId,
		to: context.to,
		toolContext: context.toolContext,
		replyToId
	});
	const resolvedThreadId = threadId ?? autoResolvedThreadId;
	if (autoResolvedThreadId && !actionParams.threadId) actionParams.threadId = autoResolvedThreadId;
	if (replyToId && resolvedThreadId) {
		const canonicalReplyToId = context.resolveReplyTransport?.({
			cfg: context.cfg,
			accountId: context.accountId,
			threadId: resolvedThreadId,
			replyToId,
			replyToIsExplicit: context.replyToIsExplicit
		})?.replyToId;
		if (canonicalReplyToId && replyToId !== canonicalReplyToId) actionParams.replyTo = canonicalReplyToId;
	}
	return resolvedThreadId ?? void 0;
}
function isSameConversationTarget(actionParams, channel, toolContext, matchesToolContextTarget) {
	const currentChannelId = toolContext?.currentChannelId?.trim();
	const currentMessagingTarget = toolContext?.currentMessagingTarget?.trim();
	if (!currentChannelId && !currentMessagingTarget) return false;
	const currentChannelProvider = toolContext?.currentChannelProvider?.trim();
	if (currentChannelProvider && currentChannelProvider !== channel) return false;
	const explicitTarget = readToolStringParam(actionParams, "target") ?? readToolStringParam(actionParams, "to") ?? readToolStringParam(actionParams, "channelId");
	if (!explicitTarget) return true;
	const target = explicitTarget.trim();
	if (toolContext && matchesToolContextTarget?.({
		target,
		toolContext
	})) return true;
	return target === currentMessagingTarget || target === currentChannelId;
}
/** Resolves and writes reply-to metadata for same-conversation message-action sends. */
function resolveAndApplyOutboundReplyToId(actionParams, context) {
	const explicitReplyToId = readToolStringParam(actionParams, "replyTo");
	if (explicitReplyToId) {
		if (context.toolContext?.replyToMode === "first") {
			const hasRepliedRef = context.toolContext.hasRepliedRef;
			if (hasRepliedRef) hasRepliedRef.value = true;
		}
		return explicitReplyToId;
	}
	if (suppressesImplicitThreading(actionParams)) return;
	if (!isSameConversationTarget(actionParams, context.channel, context.toolContext, context.matchesToolContextTarget)) return;
	const currentMessageId = context.toolContext?.currentMessageId;
	if (currentMessageId == null) return;
	const mode = context.toolContext?.replyToMode ?? "off";
	if (mode === "off" || mode === "batched") return;
	if (mode === "first") {
		const hasRepliedRef = context.toolContext?.hasRepliedRef;
		if (hasRepliedRef?.value) return;
		if (hasRepliedRef) hasRepliedRef.value = true;
	}
	const resolvedReplyToId = typeof currentMessageId === "number" ? String(currentMessageId) : currentMessageId.trim();
	if (!resolvedReplyToId) return;
	actionParams.replyTo = resolvedReplyToId;
	return resolvedReplyToId;
}
/** Prepares outbound session mirroring metadata for message-action sends. */
async function prepareOutboundMirrorRoute(params) {
	const resolvedThreadId = resolveAndApplyOutboundThreadId(params.actionParams, {
		cfg: params.cfg,
		to: params.to,
		accountId: params.accountId,
		toolContext: params.toolContext,
		resolveAutoThreadId: params.resolveAutoThreadId,
		resolveReplyTransport: params.resolveReplyTransport,
		replyToIsExplicit: params.replyToIsExplicit
	});
	const replyToId = readToolStringParam(params.actionParams, "replyTo");
	const outboundRoute = params.agentId && !params.dryRun ? await params.resolveOutboundSessionRoute({
		cfg: params.cfg,
		channel: params.channel,
		agentId: params.agentId,
		accountId: params.accountId,
		target: params.to,
		currentSessionKey: params.currentSessionKey,
		resolvedTarget: params.resolvedTarget,
		replyToId,
		threadId: resolvedThreadId
	}) : null;
	if (outboundRoute && params.agentId && !params.dryRun) await params.ensureOutboundSessionEntry({
		cfg: params.cfg,
		channel: params.channel,
		accountId: params.accountId,
		route: outboundRoute
	});
	if (outboundRoute && !params.dryRun) params.actionParams["__sessionKey"] = outboundRoute.sessionKey;
	if (params.agentId) params.actionParams["__agentId"] = params.agentId;
	return {
		resolvedThreadId,
		outboundRoute
	};
}
//#endregion
//#region src/infra/outbound/outbound-send-service.ts
const log$1 = createSubsystemLogger("outbound/send-service");
function materializeMessagePresentationFallback(params) {
	const presentation = normalizeMessagePresentation(params.payload.presentation);
	const text = (params.text ?? params.payload.text ?? "").trim();
	if (!presentation) return text;
	const fallback = renderMessagePresentationFallbackText({ presentation });
	if (!fallback || text.includes(fallback)) return text;
	return [text, fallback].filter(Boolean).join("\n\n");
}
function hasCorePresentationDelivery(outbound) {
	return Boolean(outbound?.sendPayload || outbound?.sendText || outbound?.sendFormattedText);
}
async function sendCoreMessage(params) {
	const deliveredPayloads = [];
	const result = await sendMessage({
		cfg: params.ctx.cfg,
		to: params.to,
		content: params.message,
		...params.payloads ? { payloads: params.payloads } : {},
		agentId: params.ctx.agentId,
		requesterSessionKey: params.ctx.sessionKey,
		requesterAccountId: params.ctx.requesterAccountId ?? params.ctx.accountId ?? void 0,
		requesterSenderId: params.ctx.requesterSenderId,
		requesterSenderName: params.ctx.requesterSenderName,
		requesterSenderUsername: params.ctx.requesterSenderUsername,
		requesterSenderE164: params.ctx.requesterSenderE164,
		mediaUrl: params.mediaUrl || void 0,
		mediaUrls: params.mediaUrls,
		buffer: params.buffer,
		filename: params.filename,
		contentType: params.contentType,
		asVoice: params.asVoice,
		channel: params.ctx.channel || void 0,
		accountId: params.ctx.accountId ?? void 0,
		conversationType: params.ctx.conversationType,
		conversationReadOrigin: params.ctx.conversationReadOrigin,
		replyToId: params.replyToId,
		threadId: params.threadId,
		gifPlayback: params.gifPlayback,
		forceDocument: params.forceDocument,
		dryRun: params.ctx.dryRun,
		bestEffort: params.bestEffort ?? void 0,
		queuePolicy: params.queuePolicy,
		deps: params.ctx.deps,
		gateway: params.ctx.gateway,
		idempotencyKey: params.ctx.idempotencyKey,
		mirror: params.ctx.mirror,
		abortSignal: params.ctx.abortSignal,
		silent: params.ctx.silent,
		mediaAccess: params.ctx.mediaAccess,
		preparedMessageId: params.ctx.preparedMessageId,
		preparedPlugin: params.ctx.plugin,
		gatewayOwnedDelivery: params.ctx.gatewayOwnedDelivery,
		deliveryIntentId: params.ctx.deliveryIntentId,
		deliveryCompletion: params.ctx.deliveryCompletion,
		requireUnknownSendReconciliation: params.ctx.requireQueuePersistence ? false : void 0,
		onDeliveryIntent: params.ctx.onDeliveryIntent,
		onDeliveryResult: params.ctx.onDeliveryResult,
		onDeliveredPayload: (payload) => deliveredPayloads.push(payload)
	});
	const deliveredText = result.deliveryStatus === "sent" && deliveredPayloads.every((payload) => payload.mediaUrls.length === 0 && payload.audioAsVoice !== true) ? deliveredPayloads.map((payload) => payload.text).filter((text) => text.trim()).join("\n") : "";
	return {
		result,
		...deliveredText ? { deliveredText } : {}
	};
}
async function tryHandleWithPluginAction(params) {
	if (params.ctx.dryRun) return null;
	const mediaAccess = resolveAgentScopedOutboundMediaAccess({
		cfg: params.ctx.cfg,
		agentId: params.ctx.agentId ?? params.ctx.mirror?.agentId,
		mediaSources: collectActionMediaSourceHints(params.ctx.params, void 0, { structuredAttachments: params.action === "send" ? "all" : void 0 }),
		sessionKey: params.ctx.sessionKey,
		messageProvider: params.ctx.sessionKey ? void 0 : params.ctx.channel,
		accountId: (params.ctx.sessionKey ? params.ctx.requesterAccountId ?? params.ctx.accountId : params.ctx.accountId) ?? void 0,
		requesterSenderId: params.ctx.requesterSenderId,
		requesterSenderName: params.ctx.requesterSenderName,
		requesterSenderUsername: params.ctx.requesterSenderUsername,
		requesterSenderE164: params.ctx.requesterSenderE164,
		mediaAccess: params.ctx.mediaAccess,
		mediaReadFile: params.ctx.mediaReadFile
	});
	const handled = await dispatchChannelMessageAction(createChannelActionContext({
		ctx: params.ctx,
		action: params.action,
		mediaAccess
	}));
	if (!handled) return null;
	await params.onHandled?.();
	return {
		handledBy: "plugin",
		payload: extractToolPayload(handled),
		toolResult: handled
	};
}
function createChannelActionContext(params) {
	const mediaAccess = params.mediaAccess ?? params.ctx.mediaAccess;
	return {
		channel: params.ctx.channel,
		action: params.action,
		cfg: params.ctx.cfg,
		params: params.ctx.params,
		...mediaAccess ? { mediaAccess } : {},
		mediaLocalRoots: mediaAccess?.localRoots ?? params.ctx.mediaAccess?.localRoots,
		mediaReadFile: mediaAccess?.readFile ?? params.ctx.mediaReadFile,
		accountId: params.ctx.accountId ?? void 0,
		requesterAccountId: params.ctx.requesterAccountId,
		requesterSenderId: params.ctx.requesterSenderId,
		senderIsOwner: params.ctx.senderIsOwner,
		conversationReadOrigin: params.ctx.conversationReadOrigin,
		sessionKey: params.ctx.sessionKey,
		sessionId: params.ctx.sessionId,
		inboundEventKind: params.ctx.inboundEventKind,
		agentId: params.ctx.agentId,
		gateway: params.ctx.gateway,
		toolContext: params.ctx.toolContext,
		dryRun: params.ctx.dryRun
	};
}
async function preparePluginSendPayload(params) {
	const plugin = params.ctx.plugin;
	if (!plugin?.outbound) return { kind: "unavailable" };
	const prepareSendPayload = plugin?.actions?.prepareSendPayload;
	if (!prepareSendPayload) return { kind: "unavailable" };
	const payload = await prepareSendPayload({
		ctx: createChannelActionContext({
			ctx: params.ctx,
			action: "send"
		}),
		to: params.to,
		payload: params.payload,
		replyToId: params.replyToId,
		replyToIdSource: params.replyToIdSource,
		threadId: params.threadId
	});
	return payload ? {
		kind: "prepared",
		payload
	} : { kind: "declined" };
}
/** Executes a message-tool send through plugin handlers or the core outbound path. */
async function executeSendAction(params) {
	throwIfAborted(params.ctx.abortSignal);
	const defaultPayload = params.payload ?? {
		text: params.message,
		mediaUrl: params.mediaUrl,
		mediaUrls: params.mediaUrls,
		audioAsVoice: params.asVoice === true
	};
	const queuePolicy = params.bestEffort === false || params.ctx.requireQueuePersistence ? "required" : "best_effort";
	const requiresCoreDelivery = params.ctx.forceCoreDelivery === true || params.ctx.requireQueuePersistence === true;
	const pluginPreparation = requiresCoreDelivery ? { kind: "unavailable" } : await preparePluginSendPayload({
		ctx: params.ctx,
		to: params.to,
		payload: defaultPayload,
		replyToId: params.replyToId,
		replyToIdSource: params.replyToIdSource,
		threadId: params.threadId
	});
	const channelPlugin = params.ctx.plugin;
	const presentation = normalizeMessagePresentation(defaultPayload.presentation);
	const corePayload = requiresCoreDelivery ? defaultPayload : pluginPreparation.kind === "prepared" ? pluginPreparation.payload : pluginPreparation.kind === "unavailable" && presentation && hasCorePresentationDelivery(channelPlugin?.outbound) ? defaultPayload : null;
	if (corePayload) {
		throwIfAborted(params.ctx.abortSignal);
		const message = normalizeMessagePresentation(corePayload.presentation) && channelPlugin?.outbound?.deliveryMode === "gateway" ? materializeMessagePresentationFallback({
			payload: corePayload,
			text: params.message
		}) : params.message;
		const delivery = await sendCoreMessage({
			...params,
			message,
			queuePolicy,
			payloads: [corePayload]
		});
		return {
			handledBy: "core",
			payload: delivery.result,
			...delivery.deliveredText ? { deliveredText: delivery.deliveredText } : {},
			sendResult: delivery.result
		};
	}
	const pluginMessage = presentation ? materializeMessagePresentationFallback({
		payload: defaultPayload,
		text: params.message
	}) : params.message;
	const pluginCtx = pluginMessage === params.message ? params.ctx : {
		...params.ctx,
		params: {
			...params.ctx.params,
			message: pluginMessage
		}
	};
	const pluginHandled = requiresCoreDelivery ? null : await tryHandleWithPluginAction({
		ctx: pluginCtx,
		action: "send",
		onHandled: async () => {
			if (!params.ctx.mirror) return;
			const mirrorText = pluginMessage !== params.message ? pluginMessage : params.ctx.mirror.text?.trim() || pluginMessage;
			const mirrorMediaUrls = params.ctx.mirror.mediaUrls ?? params.mediaUrls ?? (params.mediaUrl ? [params.mediaUrl] : void 0);
			try {
				const writerFence = getOwnedSessionTranscriptWriterFence();
				const mirrorResult = await appendAssistantMessageToSessionTranscript({
					agentId: params.ctx.mirror.agentId,
					sessionKey: params.ctx.mirror.sessionKey,
					expectedSessionId: params.ctx.mirror.expectedSessionId,
					...writerFence?.expectedLifecycleRevision !== void 0 ? { expectedLifecycleRevision: writerFence.expectedLifecycleRevision } : {},
					...writerFence ? { expectedWriterRunId: writerFence.expectedWriterRunId } : {},
					text: mirrorText,
					mediaUrls: mirrorMediaUrls,
					idempotencyKey: params.ctx.mirror.idempotencyKey,
					deliveryMirror: params.ctx.mirror.deliveryMirror,
					config: params.ctx.cfg
				});
				if (!mirrorResult.ok) log$1.warn(`failed to mirror plugin-handled delivery; channel send already succeeded: ${mirrorResult.reason}`);
			} catch (error) {
				log$1.warn(`failed to mirror plugin-handled delivery; channel send already succeeded: ${formatErrorMessage(error)}`);
			}
		}
	});
	if (pluginHandled) return pluginHandled;
	throwIfAborted(params.ctx.abortSignal);
	const delivery = await sendCoreMessage({
		...params,
		queuePolicy
	});
	return {
		handledBy: "core",
		payload: delivery.result,
		...delivery.deliveredText ? { deliveredText: delivery.deliveredText } : {},
		sendResult: delivery.result
	};
}
/** Executes a message-tool poll through plugin handlers or the core poll path. */
async function executePollAction(params) {
	const pluginHandled = await tryHandleWithPluginAction({
		ctx: params.ctx,
		action: "poll"
	});
	if (pluginHandled) return pluginHandled;
	const corePoll = params.resolveCorePoll();
	const result = await sendPoll({
		cfg: params.ctx.cfg,
		to: corePoll.to,
		question: corePoll.question,
		options: corePoll.options,
		maxSelections: corePoll.maxSelections,
		durationSeconds: corePoll.durationSeconds ?? void 0,
		durationHours: corePoll.durationHours ?? void 0,
		channel: params.ctx.channel,
		accountId: params.ctx.accountId ?? void 0,
		threadId: corePoll.threadId ?? void 0,
		silent: params.ctx.silent ?? void 0,
		isAnonymous: corePoll.isAnonymous ?? void 0,
		dryRun: params.ctx.dryRun,
		gateway: params.ctx.gateway,
		idempotencyKey: params.ctx.idempotencyKey,
		preparedPlugin: params.ctx.plugin
	});
	return {
		handledBy: "core",
		payload: result,
		pollResult: result
	};
}
//#endregion
//#region src/infra/outbound/message-action-execution.ts
const log = createSubsystemLogger("outbound/message-action");
const loadMessageActionGatewayRuntime = createLazyRuntimeModule(() => import("./message.gateway.runtime.js"));
function annotateSourceDelivery(result, params) {
	const isReplyActionResult = result.kind === "action" && isCurrentSourceReplyActionName(result.action);
	if (result.kind !== "send" && result.kind !== "poll" && !isReplyActionResult) return result;
	const authorization = params.input.messageActionAuthorization;
	if (!authorization?.toolContext) return result;
	const mirrorParams = {
		action: isReplyActionResult ? result.action : result.kind === "poll" ? "poll" : "send",
		channel: params.channel,
		actionParams: params.actionParams,
		cfg: params.cfg,
		accountId: params.accountId,
		currentAccountId: authorization.requesterAccountId ?? params.input.defaultAccountId,
		sessionKey: params.input.sessionKey,
		sessionId: params.input.sessionId,
		agentId: params.agentId,
		toolContext: authorization.toolContext,
		deliveredPayload: result.payload,
		replyToIsExplicit: params.replyToIsExplicit
	};
	if (isReplyActionResult ? !isDeliveredCurrentSourceReplyAction(mirrorParams) : !isDeliveredCurrentSourceReply(mirrorParams)) return result;
	const payload = asOptionalRecord(result.payload);
	const details = asOptionalRecord(result.toolResult?.details);
	return {
		...result,
		payload: payload ? {
			...payload,
			sourceReplyRoute: "current-source"
		} : result.payload,
		...result.toolResult ? { toolResult: {
			...result.toolResult,
			details: {
				...details,
				sourceReplyRoute: "current-source"
			}
		} } : {}
	};
}
const MESSAGE_ACTION_RECONCILIATION_TIMEOUT_MS = 6e4;
const MESSAGE_ACTION_RECONCILIATION_MAX_MS = 9 * 6e4;
const MESSAGE_ACTION_INITIAL_SEND_TIMEOUT_MAX_MS = 3e4;
async function callGatewayMessageAction(params) {
	const { callGatewayLeastPrivilege, isGatewayTransportError } = await loadMessageActionGatewayRuntime();
	const gateway = resolveOutboundMessageGatewayOptions(params.gateway);
	const timeoutMs = params.actionParams.action === "send" ? Math.min(gateway.timeoutMs, MESSAGE_ACTION_INITIAL_SEND_TIMEOUT_MAX_MS) : gateway.timeoutMs;
	const call = {
		url: gateway.url,
		token: gateway.token,
		method: "message.action",
		params: params.actionParams,
		timeoutMs,
		signal: params.abortSignal,
		clientName: gateway.clientName,
		clientDisplayName: gateway.clientDisplayName,
		mode: gateway.mode,
		agentRuntimeIdentityToken: params.agentRuntimeIdentityToken
	};
	try {
		return await callGatewayLeastPrivilege(call);
	} catch (error) {
		if (!isGatewayTransportError(error) || error.kind !== "timeout" || params.actionParams.action !== "send") throw error;
		params.onUnknownDeliveryOutcome?.();
		throwIfAborted(params.abortSignal);
	}
	const reconciliationSignal = params.abortSignal ? AbortSignal.any([params.abortSignal, AbortSignal.timeout(MESSAGE_ACTION_RECONCILIATION_MAX_MS)]) : void 0;
	return await callGatewayLeastPrivilege({
		...call,
		timeoutMs: params.abortSignal ? null : Math.max(call.timeoutMs, MESSAGE_ACTION_RECONCILIATION_TIMEOUT_MS),
		signal: reconciliationSignal
	});
}
function isConfirmedGatewayMessageActionRejection(error) {
	if (!(error instanceof Error) || error.name !== "GatewayClientRequestError") return false;
	const requestError = error;
	if (typeof requestError.gatewayCode !== "string" || requestError.gatewayCode.length === 0) return false;
	if (requestError.gatewayCode !== ErrorCodes.UNAVAILABLE) return true;
	const details = requestError.details;
	return details !== null && typeof details === "object" && details.method === "message.action";
}
async function resolveGatewayActionIdempotencyKey(idempotencyKey) {
	if (idempotencyKey) return idempotencyKey;
	const { randomIdempotencyKey } = await loadMessageActionGatewayRuntime();
	return randomIdempotencyKey();
}
function applyCrossContextMessageDecoration({ params, message, decoration, preferPresentation }) {
	const applied = applyCrossContextDecoration({
		message,
		decoration,
		preferPresentation
	});
	params.message = applied.message;
	if (applied.presentation) {
		const existing = normalizeMessagePresentation(params.presentation);
		params.presentation = existing ? {
			...existing,
			blocks: [...applied.presentation.blocks, ...existing.blocks]
		} : applied.presentation;
	}
	return applied.message;
}
async function applyMessageCrossContextMarker(params) {
	if (!shouldApplyCrossContextMarker(params.action) || !params.toolContext) return params.message;
	const decoration = await buildCrossContextDecoration({
		cfg: params.cfg,
		channel: params.channel,
		target: params.target,
		toolContext: params.toolContext,
		accountId: params.accountId ?? void 0,
		agentId: params.agentId ?? void 0
	});
	if (!decoration) return params.message;
	return applyCrossContextMessageDecoration({
		params: params.args,
		message: params.message,
		decoration,
		preferPresentation: params.preferPresentation
	});
}
async function executeGatewayAction(params) {
	if (params.dryRun || !params.gateway) return null;
	if (!params.channelPlugin?.actions?.handleAction) return null;
	if ((params.channelPlugin.actions.resolveExecutionMode?.({ action: params.action }) ?? "local") !== "gateway") return null;
	const conversationReadOrigin = normalizeConversationReadInvocationOrigin(params.input.conversationReadOrigin);
	const idempotencyKey = await resolveGatewayActionIdempotencyKey(normalizeOptionalString(params.params.idempotencyKey));
	const callerOwnsTerminalReceipt = params.gateway.terminalSourceReplyReceiptOwner === "caller" && params.input.sourceReplyFinal === true;
	const agentRuntimeIdentityToken = await params.gateway.resolveAgentRuntimeIdentityToken?.({
		sourceReplyFinal: params.input.sourceReplyFinal,
		sourceReplyToolCallId: params.input.sourceReplyToolCallId
	});
	const sourceReplyMirror = {
		action: params.action,
		channel: params.channel,
		actionParams: params.params,
		cfg: params.cfg,
		accountId: params.accountId,
		currentAccountId: params.input.messageActionAuthorization?.requesterAccountId ?? params.input.defaultAccountId,
		sessionKey: params.input.sourceReplySessionKey ?? params.input.sessionKey,
		sessionId: params.input.sessionId,
		agentId: params.agentId,
		toolContext: params.input.messageActionAuthorization?.toolContext,
		idempotencyKey,
		sourceReplyFinal: params.input.sourceReplyFinal,
		toolCallId: params.input.sourceReplyToolCallId
	};
	const terminalDeliveryStart = callerOwnsTerminalReceipt ? await beginTerminalSourceReplyDelivery(sourceReplyMirror) : void 0;
	if (terminalDeliveryStart && "outcome" in terminalDeliveryStart) return params.result(terminalDeliveryStart.result);
	const terminalDeliveryReceipt = terminalDeliveryStart;
	let hadUnknownDeliveryOutcome = false;
	let payload;
	try {
		payload = await callGatewayMessageAction({
			gateway: params.gateway,
			abortSignal: params.input.abortSignal,
			agentRuntimeIdentityToken,
			onUnknownDeliveryOutcome: () => {
				hadUnknownDeliveryOutcome = true;
			},
			actionParams: {
				channel: params.channel,
				action: params.action,
				params: params.params,
				accountId: params.accountId ?? void 0,
				senderIsOwner: params.input.senderIsOwner,
				sessionKey: params.input.sessionKey,
				sessionId: params.input.sessionId,
				inboundTurnKind: params.input.inboundEventKind,
				agentId: params.agentId,
				...conversationReadOrigin === "direct-operator" ? { conversationReadOrigin } : {},
				idempotencyKey
			}
		});
	} catch (error) {
		if (callerOwnsTerminalReceipt && !hadUnknownDeliveryOutcome && isConfirmedGatewayMessageActionRejection(error)) await cancelTerminalSourceReplyDelivery(terminalDeliveryReceipt);
		throw error;
	}
	if (callerOwnsTerminalReceipt) try {
		await reconcileTerminalSourceReplyDelivery({
			deliveredPayload: payload,
			mirror: sourceReplyMirror,
			receipt: terminalDeliveryReceipt,
			...hadUnknownDeliveryOutcome ? { preservePendingOnExplicitFailure: true } : {}
		});
	} catch (error) {
		log.warn("Terminal source reply receipt reconciliation failed.", {
			channel: params.channel,
			sessionKey: params.input.sessionKey,
			error: formatErrorMessage(error)
		});
	}
	return params.result(payload);
}
async function executeMessagePoll(ctx) {
	const { cfg, params, channel, channelPlugin, accountId, dryRun, gateway, input, agentId, abortSignal } = ctx;
	throwIfAborted(abortSignal);
	const action = "poll";
	const to = readToolStringParam(params, "to", { required: true });
	const silent = readBooleanParam(params, "silent");
	const resolvedThreadId = resolveAndApplyOutboundThreadId(params, {
		cfg,
		to,
		accountId,
		toolContext: input.toolContext,
		resolveAutoThreadId: channelPlugin?.threading?.resolveAutoThreadId
	});
	const base = typeof params.message === "string" ? params.message : "";
	await applyMessageCrossContextMarker({
		cfg,
		channel,
		action,
		target: to,
		toolContext: input.toolContext,
		accountId,
		agentId,
		args: params,
		message: base,
		preferPresentation: false
	});
	const gatewayPluginAction = await executeGatewayAction({
		cfg,
		params,
		channel,
		channelPlugin,
		action,
		accountId,
		dryRun,
		gateway,
		input,
		agentId,
		result: (payload) => ({
			kind: "poll",
			channel,
			action,
			to,
			handledBy: "plugin",
			payload,
			dryRun
		})
	});
	const pollReplyToIsExplicit = Boolean(readToolStringParam(params, "replyTo"));
	if (gatewayPluginAction) return annotateSourceDelivery(gatewayPluginAction, {
		cfg,
		actionParams: params,
		channel,
		accountId,
		input,
		agentId,
		replyToIsExplicit: pollReplyToIsExplicit
	});
	const poll = await executePollAction({
		ctx: {
			cfg,
			channel,
			plugin: channelPlugin,
			params,
			idempotencyKey: ctx.idempotencyKey,
			accountId: accountId ?? void 0,
			agentId,
			requesterAccountId: input.requesterAccountId ?? void 0,
			requesterSenderId: input.requesterSenderId ?? void 0,
			conversationReadOrigin: normalizeConversationReadInvocationOrigin(input.conversationReadOrigin),
			sessionKey: input.sessionKey,
			sessionId: input.sessionId,
			inboundEventKind: input.inboundEventKind,
			gateway,
			toolContext: input.toolContext,
			dryRun,
			silent: silent ?? void 0
		},
		resolveCorePoll: () => {
			const question = readToolStringParam(params, "pollQuestion", { required: true });
			const options = readStringArrayParam(params, "pollOption", { required: true });
			if (options.length < 2) throw new Error("pollOption requires at least two values");
			const allowMultiselect = readBooleanParam(params, "pollMulti") ?? false;
			const durationHours = readPositiveIntegerParam(params, "pollDurationHours", { message: "pollDurationHours must be a positive integer" });
			return {
				to,
				question,
				options,
				maxSelections: resolvePollMaxSelections(options.length, allowMultiselect),
				durationHours: durationHours ?? void 0,
				threadId: resolvedThreadId ?? void 0
			};
		}
	});
	return annotateSourceDelivery({
		kind: "poll",
		channel,
		action,
		to,
		handledBy: poll.handledBy,
		payload: poll.payload,
		toolResult: poll.toolResult,
		pollResult: poll.pollResult,
		dryRun
	}, {
		cfg,
		actionParams: params,
		channel,
		accountId,
		input,
		agentId,
		replyToIsExplicit: pollReplyToIsExplicit
	});
}
async function executeMessagePlugin(ctx) {
	const { cfg, params, channel, channelPlugin, mediaAccess, accountId, dryRun, gateway, input, abortSignal, agentId } = ctx;
	throwIfAborted(abortSignal);
	const action = input.action;
	if (dryRun) return {
		kind: "action",
		channel,
		action,
		handledBy: "dry-run",
		payload: {
			ok: true,
			dryRun: true,
			channel,
			action
		},
		dryRun: true
	};
	if (!channelPlugin?.actions?.handleAction) throw new Error(`Channel ${channel} is unavailable for message actions (plugin not loaded).`);
	const rawActionMessage = params.message;
	if (typeof rawActionMessage === "string" && rawActionMessage) params.message = stripPlainTextToolCallBlocks(stripUnsupportedCitationControlMarkers(rawActionMessage));
	const targetForThreading = normalizeOptionalString(params.to) ?? normalizeOptionalString(params.channelId) ?? "";
	if (targetForThreading) resolveAndApplyOutboundThreadId(params, {
		cfg,
		to: targetForThreading,
		accountId,
		toolContext: input.toolContext,
		resolveAutoThreadId: channelPlugin.threading?.resolveAutoThreadId,
		resolveReplyTransport: channelPlugin.threading?.resolveReplyTransport,
		replyToIsExplicit: Boolean(readToolStringParam(params, "replyTo"))
	});
	const gatewayPluginAction = await executeGatewayAction({
		cfg,
		params,
		channel,
		channelPlugin,
		action,
		accountId,
		dryRun,
		gateway,
		input,
		agentId,
		result: (payload) => ({
			kind: "action",
			channel,
			action,
			handledBy: "plugin",
			payload,
			dryRun
		})
	});
	const replyToIsExplicit = Boolean(readToolStringParam(params, "replyTo"));
	if (gatewayPluginAction) return annotateSourceDelivery(gatewayPluginAction, {
		cfg,
		actionParams: params,
		channel,
		accountId,
		input,
		agentId,
		replyToIsExplicit
	});
	const authorization = input.messageActionAuthorization;
	const handled = await dispatchChannelMessageAction({
		channel,
		action,
		cfg,
		params,
		mediaAccess,
		mediaLocalRoots: mediaAccess.localRoots,
		mediaReadFile: mediaAccess.readFile,
		accountId: accountId ?? void 0,
		requesterAccountId: authorization !== void 0 ? authorization.requesterAccountId : input.requesterAccountId ?? void 0,
		requesterSenderId: authorization !== void 0 ? authorization.requesterSenderId : input.requesterSenderId ?? void 0,
		senderIsOwner: input.senderIsOwner,
		conversationReadOrigin: normalizeConversationReadInvocationOrigin(input.conversationReadOrigin),
		sessionKey: input.sessionKey,
		sessionId: input.sessionId,
		inboundEventKind: input.inboundEventKind,
		agentId,
		gateway,
		toolContext: authorization !== void 0 ? authorization.toolContext : input.toolContext,
		dryRun
	});
	if (!handled) throw new Error(`Message action ${action} not supported for channel ${channel}.`);
	return annotateSourceDelivery({
		kind: "action",
		channel,
		action,
		handledBy: "plugin",
		payload: extractToolPayload(handled),
		toolResult: handled,
		dryRun
	}, {
		cfg,
		actionParams: params,
		channel,
		accountId,
		input,
		agentId,
		replyToIsExplicit
	});
}
//#endregion
//#region src/infra/outbound/message-action-normalization.ts
function resolveImplicitMessageActionTarget(toolContext) {
	for (const value of [toolContext?.currentChannelId, toolContext?.currentMessagingTarget]) {
		const target = normalizeOptionalString(value);
		if (!target) continue;
		if (parseAgentSessionKey(target.replace(/^channel:/i, ""))) continue;
		return target;
	}
}
/** Normalizes message-action args before target validation and dispatch. */
function normalizeMessageActionInput(params) {
	const normalizedArgs = { ...params.args };
	const { action, toolContext } = params;
	const explicitChannel = normalizeOptionalString(normalizedArgs.channel) ?? "";
	const inferredChannel = explicitChannel || normalizeMessageChannel(toolContext?.currentChannelProvider) || "";
	const explicitTarget = normalizeOptionalString(normalizedArgs.target) ?? "";
	const hasExplicitTargets = Object.hasOwn(normalizedArgs, "targets");
	const hasLegacyTargetFields = typeof normalizedArgs.to === "string" || typeof normalizedArgs.channelId === "string";
	const hasLegacyTarget = (normalizeOptionalString(normalizedArgs.to) ?? "").length > 0 || (normalizeOptionalString(normalizedArgs.channelId) ?? "").length > 0;
	const legacyTarget = normalizeOptionalString(normalizedArgs.to) ?? normalizeOptionalString(normalizedArgs.channelId) ?? "";
	const deliveryAliasTarget = resolveActionDeliveryTargetAlias(action, normalizedArgs, {
		channel: inferredChannel,
		aliasSpec: params.targetAliasSpec
	});
	const hasResourceReference = actionHasResourceReference(action, normalizedArgs, {
		channel: inferredChannel,
		aliasSpec: params.targetAliasSpec
	});
	if (deliveryAliasTarget && explicitTarget && deliveryAliasTarget !== explicitTarget) throw new Error(`Action ${action} received conflicting target and delivery alias values.`);
	if (deliveryAliasTarget && legacyTarget && deliveryAliasTarget !== legacyTarget) throw new Error(`Action ${action} received conflicting target and delivery alias values.`);
	if (explicitTarget && hasLegacyTargetFields) {
		delete normalizedArgs.to;
		delete normalizedArgs.channelId;
	}
	if (!explicitTarget && !hasLegacyTarget && deliveryAliasTarget) normalizedArgs.target = deliveryAliasTarget;
	if (!explicitTarget && !hasExplicitTargets && !hasLegacyTarget && !deliveryAliasTarget && actionRequiresTarget(action) && (hasResourceReference || !actionHasTarget(action, normalizedArgs, { channel: inferredChannel }))) {
		const inferredTarget = resolveImplicitMessageActionTarget(toolContext);
		if (inferredTarget) normalizedArgs.target = inferredTarget;
	}
	if (!explicitTarget && actionRequiresTarget(action) && hasLegacyTarget) {
		if (legacyTarget) {
			normalizedArgs.target = legacyTarget;
			delete normalizedArgs.to;
			delete normalizedArgs.channelId;
		}
	}
	if (!explicitChannel) {
		if (inferredChannel && isDeliverableMessageChannel(inferredChannel)) normalizedArgs.channel = inferredChannel;
	}
	applyTargetToParams({
		action,
		args: normalizedArgs
	});
	const hasCanonicalTarget = [
		normalizedArgs.target,
		normalizedArgs.to,
		normalizedArgs.channelId
	].some((value) => Boolean(normalizeOptionalString(value)));
	if (actionRequiresTarget(action) && (!actionHasTarget(action, normalizedArgs, { channel: inferredChannel }) || hasResourceReference && !hasCanonicalTarget && !params.allowResourceOnly)) throw new Error(`Action ${action} requires a target.`);
	return normalizedArgs;
}
//#endregion
//#region src/infra/outbound/message-action-routing.ts
async function resolveChannel(cfg, params, toolContext, action, agentId) {
	const channel = readToolStringParam(params, "channel");
	const selection = await resolveMessageChannelSelection({
		cfg,
		channel,
		fallbackChannel: action === "read" && channel ? void 0 : toolContext?.currentChannelProvider,
		agentId
	});
	if (selection.source === "tool-context-fallback") params.channel = selection.channel;
	return selection;
}
function enforceCrossProviderEgressPolicyBeforeTargetResolution(params) {
	const currentProvider = params.toolContext?.currentChannelProvider;
	if (!currentProvider || currentProvider === params.channel) return;
	enforceCrossContextPolicy(params);
}
function addCandidateAndUnprefixedAlias(candidates, value) {
	const normalized = normalizeOptionalString(value);
	if (!normalized) return;
	candidates.add(normalized);
	const unprefixed = normalized.replace(/^(channel|group|user):/i, "").trim();
	if (unprefixed && unprefixed !== normalized) candidates.add(unprefixed);
}
function normalizeTargetForAccountBinding(channel, target) {
	try {
		return normalizeTargetForProvider(channel, target);
	} catch {
		return;
	}
}
function inferPeerKindForAccountBinding(channel, target, channelPlugin) {
	const inferred = normalizeChatType(channelPlugin?.messaging?.inferTargetChatType?.({ to: target }));
	if (inferred) return inferred;
	const candidates = [target, normalizeTargetForAccountBinding(channel, target)].filter((value) => Boolean(value));
	if (candidates.some((value) => /^user:/i.test(value))) return "direct";
	if (candidates.some((value) => /^(channel|group):/i.test(value))) return "channel";
}
function resolveTargetBoundAccountId(params) {
	if (!params.agentId) return;
	const target = normalizeOptionalString(params.args.to) ?? normalizeOptionalString(params.args.channelId) ?? "";
	if (!target) return resolveFirstBoundAccountId({
		cfg: params.cfg,
		channelId: params.channel,
		agentId: params.agentId
	});
	const candidates = /* @__PURE__ */ new Set();
	addCandidateAndUnprefixedAlias(candidates, target);
	addCandidateAndUnprefixedAlias(candidates, normalizeTargetForAccountBinding(params.channel, target));
	const [peerId, ...exactPeerIdAliases] = Array.from(candidates);
	return resolveFirstBoundAccountId({
		cfg: params.cfg,
		channelId: params.channel,
		agentId: params.agentId,
		peerId,
		exactPeerIdAliases,
		peerKind: inferPeerKindForAccountBinding(params.channel, target, params.channelPlugin)
	});
}
async function resolveActionTarget(params) {
	let resolvedTarget;
	const toRaw = normalizeOptionalString(params.args.to) ?? "";
	if (toRaw) {
		const resolved = await resolveResolvedTargetOrThrow({
			cfg: params.cfg,
			channel: params.channel,
			input: toRaw,
			accountId: params.accountId ?? void 0
		});
		params.args.to = resolved.to;
		resolvedTarget = resolved;
	}
	const channelIdRaw = normalizeOptionalString(params.args.channelId) ?? "";
	if (channelIdRaw) {
		const resolved = await resolveResolvedTargetOrThrow({
			cfg: params.cfg,
			channel: params.channel,
			input: channelIdRaw,
			accountId: params.accountId ?? void 0,
			preferredKind: "group",
			validateResolvedTarget: (target) => target.kind === "user" ? `Channel id "${channelIdRaw}" resolved to a user target.` : void 0
		});
		params.args.channelId = sanitizeGroupTargetId(resolved.to);
	}
	return resolvedTarget;
}
function sanitizeGroupTargetId(target) {
	return target.replace(/^(channel|group):/i, "");
}
async function resolveResolvedTargetOrThrow(params) {
	const resolved = await resolveChannelTarget({
		cfg: params.cfg,
		channel: params.channel,
		input: params.input,
		accountId: params.accountId,
		preferredKind: params.preferredKind
	});
	if (!resolved.ok) throw resolved.error;
	const validationError = params.validateResolvedTarget?.(resolved.target);
	if (validationError) throw new Error(validationError);
	return resolved.target;
}
function hasExplicitSingularTargetParam(params) {
	return readTrimmedStringAlias(params, [
		"target",
		"to",
		"channelId"
	]) !== void 0;
}
function hasExplicitTargetParam(params) {
	return hasExplicitSingularTargetParam(params) || Array.isArray(params.targets) && params.targets.some((value) => normalizeOptionalString(value));
}
function hasPotentialActionTargetInput(input, params) {
	return Boolean(hasExplicitSingularTargetParam(params) || resolveImplicitMessageActionTarget(input.toolContext) || hasPotentialPluginActionParam(params));
}
function isCurrentSourceTargetParam(input, params) {
	const currentChannelId = normalizeOptionalString(input.toolContext?.currentChannelId);
	const currentMessagingTarget = normalizeOptionalString(input.toolContext?.currentMessagingTarget);
	if (!currentChannelId && !currentMessagingTarget) return false;
	const currentChannelProvider = normalizeOptionalLowercaseString(input.toolContext?.currentChannelProvider);
	const explicitChannel = normalizeOptionalLowercaseString(params.channel);
	if (explicitChannel && currentChannelProvider && explicitChannel !== currentChannelProvider) return false;
	const explicitTarget = normalizeOptionalString(params.target) ?? normalizeOptionalString(params.to) ?? normalizeOptionalString(params.channelId);
	if (!explicitTarget) return false;
	const provider = explicitChannel ?? currentChannelProvider;
	const currentCandidates = /* @__PURE__ */ new Set();
	for (const currentTarget of [currentMessagingTarget, currentChannelId]) {
		if (!currentTarget) continue;
		addCandidateAndUnprefixedAlias(currentCandidates, currentTarget);
		if (provider) addCandidateAndUnprefixedAlias(currentCandidates, normalizeTargetForAccountBinding(provider, currentTarget));
	}
	const explicitCandidates = /* @__PURE__ */ new Set();
	addCandidateAndUnprefixedAlias(explicitCandidates, explicitTarget);
	if (provider) addCandidateAndUnprefixedAlias(explicitCandidates, normalizeTargetForAccountBinding(provider, explicitTarget));
	return Array.from(explicitCandidates).some((candidate) => currentCandidates.has(candidate));
}
function hasExplicitNonCurrentChannelParam(input, params) {
	const explicitChannel = normalizeOptionalLowercaseString(params.channel);
	if (!explicitChannel) return false;
	const currentChannelProvider = normalizeOptionalLowercaseString(input.toolContext?.currentChannelProvider);
	return !currentChannelProvider || explicitChannel !== currentChannelProvider;
}
function applyImplicitSourceReplySendPolicy(input, params) {
	if (input.action !== "send" || input.sourceReplyDeliveryMode !== "message_tool_only") return;
	if (hasExplicitNonCurrentChannelParam(input, params)) return;
	if (hasExplicitTargetParam(params) && !isCurrentSourceTargetParam(input, params)) return;
	params.bestEffort = true;
}
async function prepareMessageRoute(params) {
	const { input, agentId } = params;
	const cfg = input.cfg;
	const action = input.action;
	let actionParams = params.actionParams;
	applyImplicitSourceReplySendPolicy(input, actionParams);
	if (actionRequiresTarget(action) && !hasPotentialActionTargetInput(input, actionParams)) throw new Error(`Action ${action} requires a target.`);
	const { channel, plugin: channelPlugin } = await resolveChannel(cfg, actionParams, input.toolContext, action, agentId);
	actionParams.channel = channel;
	const explicitAccountId = validateExplicitMessageAccountSelection({
		cfg,
		channel,
		accountId: readToolStringParam(actionParams, "accountId"),
		plugin: channelPlugin
	});
	if (action !== "send" && action !== "poll" && channelPlugin?.actions?.supportsAction && !channelPlugin.actions.supportsAction({ action })) throw new Error(`Message action ${action} not supported for channel ${channel}.`);
	actionParams = normalizeMessageActionInput({
		action,
		args: actionParams,
		toolContext: input.toolContext,
		targetAliasSpec: channelPlugin?.actions?.messageActionTargetAliases?.[action],
		allowResourceOnly: input.conversationReadOrigin === "direct-operator"
	});
	let accountId = explicitAccountId ?? input.defaultAccountId;
	if (!accountId && agentId) accountId = resolveTargetBoundAccountId({
		cfg,
		channel,
		channelPlugin,
		args: actionParams,
		agentId
	});
	if (accountId) actionParams.accountId = accountId;
	const dryRun = Boolean(input.dryRun ?? readBooleanParam(actionParams, "dryRun"));
	enforceCrossProviderEgressPolicyBeforeTargetResolution({
		channel,
		action,
		args: actionParams,
		toolContext: input.toolContext,
		cfg,
		agentId
	});
	const delegatesActionToGateway = Boolean(input.gateway) && channelPlugin?.actions?.resolveExecutionMode?.({ action }) === "gateway";
	const defersExternalTargetResolution = delegatesActionToGateway && !dryRun && shouldDeferExternalMessageActionTargetResolution({
		channel,
		action,
		cfg,
		params: actionParams,
		accountId: accountId ?? void 0,
		conversationReadOrigin: normalizeConversationReadInvocationOrigin(input.conversationReadOrigin)
	});
	if (!delegatesActionToGateway || dryRun) {
		const authorization = input.messageActionAuthorization;
		actionParams = prepareExternalMessageActionTargetForResolution({
			channel,
			action,
			cfg,
			params: actionParams,
			accountId: accountId ?? void 0,
			requesterAccountId: authorization !== void 0 ? authorization.requesterAccountId : input.requesterAccountId ?? void 0,
			conversationReadOrigin: normalizeConversationReadInvocationOrigin(input.conversationReadOrigin),
			toolContext: authorization !== void 0 ? authorization.toolContext : input.toolContext
		});
	}
	return {
		params: actionParams,
		channel,
		channelPlugin,
		accountId,
		dryRun,
		defersExternalTargetResolution
	};
}
async function resolveMessageTarget(params) {
	const resolvedTarget = params.deferExternalTargetResolution ? void 0 : await resolveActionTarget({
		cfg: params.cfg,
		channel: params.channel,
		action: params.action,
		args: params.args,
		accountId: params.accountId
	});
	enforceCrossContextPolicy({
		channel: params.channel,
		action: params.action,
		args: params.args,
		toolContext: params.toolContext,
		cfg: params.cfg,
		agentId: params.agentId
	});
	return resolvedTarget;
}
//#endregion
//#region src/infra/outbound/message-action-tts.ts
const loadMessageActionTtsRuntime = createLazyRuntimeModule(() => import("./tts.runtime.js"));
/** Reads the session-level TTS auto mode for a message-action send. */
function resolveMessageActionSessionTtsAuto(params) {
	const sessionKey = params.sessionKey?.trim();
	if (!sessionKey) return;
	try {
		const storePath = resolveSessionStorePathCore(params.cfg.session?.store, { agentId: params.agentId });
		return loadSessionEntryReadOnly({
			agentId: params.agentId,
			sessionKey,
			storePath
		})?.ttsAuto;
	} catch {
		return;
	}
}
/** Applies automatic TTS to a message-action send payload when config/session policy allows it. */
async function maybeApplyTtsToMessageActionSendPayload(params) {
	if (params.dryRun) return params.payload;
	const ttsAuto = resolveMessageActionSessionTtsAuto({
		cfg: params.cfg,
		sessionKey: params.sessionKey,
		agentId: params.agentId
	});
	if (!shouldAttemptTtsPayload({
		cfg: params.cfg,
		ttsAuto,
		agentId: params.agentId,
		channelId: params.channel,
		accountId: params.accountId ?? void 0
	})) return params.payload;
	const { maybeApplyTtsToPayload } = await loadMessageActionTtsRuntime();
	return await maybeApplyTtsToPayload({
		payload: params.payload,
		cfg: params.cfg,
		channel: params.channel,
		kind: "final",
		inboundAudio: params.inboundAudio,
		ttsAuto,
		agentId: params.agentId,
		accountId: params.accountId ?? void 0
	});
}
//#endregion
//#region src/infra/outbound/message-action-send.ts
function updateSendPayloadPartsFromReplyPayload(parts, payload) {
	const sendable = resolveSendableOutboundReplyParts(payload);
	const mediaUrls = sendable.mediaUrls.length > 0 ? sendable.mediaUrls : void 0;
	return {
		...parts,
		message: payload.text ?? "",
		payload,
		mediaUrl: mediaUrls?.[0],
		mediaUrls,
		asVoice: payload.audioAsVoice === true
	};
}
function applySendLocationToActionParams(actionParams, location) {
	if (location) actionParams.location = location;
	else delete actionParams.location;
}
function applySendPayloadPartsToActionParams(actionParams, parts) {
	if (parts.message || !parts.payload.presentation) actionParams.message = parts.message;
	else delete actionParams.message;
	actionParams.media = parts.mediaUrl;
	actionParams.mediaUrl = parts.mediaUrl;
	actionParams.mediaUrls = parts.mediaUrls;
	actionParams.asVoice = parts.asVoice || void 0;
	actionParams.audioAsVoice = parts.asVoice || void 0;
	actionParams.asVideoNote = parts.payload.videoAsNote || void 0;
	applySendLocationToActionParams(actionParams, parts.payload.location);
}
function withSendNormalization$1(result, normalization) {
	return normalization && result.kind === "send" ? {
		...result,
		normalization
	} : result;
}
async function buildMessagePayload(params) {
	const { actionParams, input } = params;
	if (actionParams.pin === true && actionParams.delivery == null) actionParams.delivery = { pin: { enabled: true } };
	if (typeof actionParams.message !== "string" || !actionParams.message.trim()) for (const alias of [
		"SendMessage",
		"content",
		"text"
	]) {
		const value = actionParams[alias];
		if (typeof value === "string" && value.trim()) {
			actionParams.message = stripFormattedReasoningMessage(value);
			console.warn(`[message-tool] normalized alias "${alias}" to "message" for send action`);
			break;
		}
	}
	const mediaHint = readToolStringParam(actionParams, "media", { trim: false }) ?? readToolStringParam(actionParams, "mediaUrl", { trim: false }) ?? readToolStringParam(actionParams, "path", { trim: false }) ?? readToolStringParam(actionParams, "filePath", { trim: false }) ?? readToolStringParam(actionParams, "fileUrl", { trim: false }) ?? readToolStringParam(actionParams, "image", { trim: false });
	const mediaUrlHints = readStringArrayParam(actionParams, "mediaUrls") ?? [];
	const attachmentMediaHints = collectAttachmentSources(actionParams).map((source) => source.value);
	const hasBuffer = Boolean(readToolStringParam(actionParams, "buffer", { trim: false }));
	const hasMediaHint = hasBuffer || Boolean(mediaHint) || mediaUrlHints.length > 0 || attachmentMediaHints.length > 0;
	const hasPresentation = hasMessagePresentationBlocks(actionParams.presentation);
	const hasInteractive = hasLegacyInteractiveReplyBlocks(actionParams.interactive);
	const rawLocation = actionParams.location;
	let location = typeof rawLocation === "string" && normalizeOptionalString(rawLocation) === void 0 ? void 0 : normalizeOutboundLocation(rawLocation);
	const caption = readToolStringParam(actionParams, "caption", { allowEmpty: true }) ?? "";
	let message = readToolStringParam(actionParams, "message", {
		required: !hasMediaHint && !hasPresentation && !hasInteractive && !location,
		allowEmpty: true
	}) ?? "";
	if (message.includes("\\n")) message = message.replaceAll("\\n", "\n");
	if (!message.trim() && caption.trim()) message = caption;
	const parsed = parseInlineDirectives(message, {
		stripAudioTag: true,
		stripReplyTags: true
	});
	const mergedMediaUrls = [];
	const seenMedia = /* @__PURE__ */ new Set();
	const pushMedia = (value) => {
		const trimmed = normalizeOptionalString(value);
		if (!trimmed || seenMedia.has(trimmed)) return;
		seenMedia.add(trimmed);
		mergedMediaUrls.push(trimmed);
	};
	pushMedia(mediaHint);
	for (const mediaUrlHint of mediaUrlHints) pushMedia(mediaUrlHint);
	for (const attachmentMediaHint of attachmentMediaHints) pushMedia(attachmentMediaHint);
	const normalizedMediaUrls = await normalizeSandboxMediaList({
		values: mergedMediaUrls,
		sandboxRoot: input.sandboxRoot
	});
	mergedMediaUrls.length = 0;
	mergedMediaUrls.push(...normalizedMediaUrls);
	message = stripPlainTextToolCallBlocks(stripUnsupportedCitationControlMarkers(parsed.text), { resolveProtectedRanges: findCodeRegions });
	if (message || !hasPresentation) actionParams.message = message;
	else delete actionParams.message;
	if (!actionParams.replyTo && parsed.replyToId) actionParams.replyTo = parsed.replyToId;
	if (!actionParams.media) actionParams.media = mergedMediaUrls[0] || void 0;
	actionParams.mediaUrls = mergedMediaUrls.length > 0 ? [...mergedMediaUrls] : void 0;
	const hasLocationConflict = Boolean(location && (message.trim() || hasBuffer || mergedMediaUrls.length > 0 || hasPresentation || hasInteractive));
	const normalization = hasLocationConflict && input.actionOrigin === "message-tool" ? {
		locationOmitted: true,
		notice: "Content sent; location omitted because locations must be sent separately. Do not retry this send. Send a standalone location only if the user explicitly requested it."
	} : void 0;
	if (hasLocationConflict && !normalization) throw new Error("Location sends cannot be combined with message text or media.");
	if (normalization) location = void 0;
	applySendLocationToActionParams(actionParams, location);
	if (params.channel && params.target) message = await applyMessageCrossContextMarker({
		cfg: params.cfg,
		channel: params.channel,
		action: "send",
		target: params.target,
		toolContext: input.toolContext,
		accountId: params.accountId,
		agentId: params.agentId,
		args: actionParams,
		message,
		preferPresentation: true
	});
	const mediaUrl = readToolStringParam(actionParams, "media", { trim: false });
	if (!hasReplyPayloadContent({
		text: message,
		mediaUrl,
		mediaUrls: mergedMediaUrls,
		presentation: actionParams.presentation,
		interactive: actionParams.interactive,
		location
	})) throw new Error("send requires text or media or location");
	if (message || !hasPresentation) actionParams.message = message;
	else delete actionParams.message;
	const gifPlayback = readBooleanParam(actionParams, "gifPlayback") ?? false;
	const forceDocument = readBooleanParam(actionParams, "forceDocument") ?? readBooleanParam(actionParams, "asDocument") ?? false;
	const asVoice = readBooleanParam(actionParams, "asVoice") ?? readBooleanParam(actionParams, "audioAsVoice") ?? parsed.audioAsVoice;
	const asVideoNote = readBooleanParam(actionParams, "asVideoNote") ?? false;
	const bestEffort = readBooleanParam(actionParams, "bestEffort");
	const silent = readBooleanParam(actionParams, "silent");
	const mirrorMediaUrls = mergedMediaUrls.length > 0 ? mergedMediaUrls : mediaUrl ? [mediaUrl] : void 0;
	const rawDelivery = actionParams.delivery;
	const delivery = rawDelivery && typeof rawDelivery === "object" && !Array.isArray(rawDelivery) ? rawDelivery : void 0;
	const rawChannelData = actionParams.channelData;
	const channelData = rawChannelData && typeof rawChannelData === "object" && !Array.isArray(rawChannelData) ? rawChannelData : void 0;
	const presentation = normalizeMessagePresentation(actionParams.presentation);
	const interactive = normalizeLegacyInteractiveReply(actionParams.interactive);
	return {
		message,
		payload: {
			text: message,
			...mediaUrl ? { mediaUrl } : {},
			...mergedMediaUrls.length ? { mediaUrls: mergedMediaUrls } : {},
			...asVoice ? { audioAsVoice: true } : {},
			...asVideoNote ? { videoAsNote: true } : {},
			...location ? { location } : {},
			...presentation ? { presentation } : {},
			...interactive ? { interactive } : {},
			...delivery ? { delivery } : {},
			...channelData ? { channelData } : {}
		},
		...mediaUrl ? { mediaUrl } : {},
		...mirrorMediaUrls ? { mediaUrls: mirrorMediaUrls } : {},
		asVoice,
		gifPlayback,
		forceDocument,
		...bestEffort !== void 0 ? { bestEffort } : {},
		...silent !== void 0 ? { silent } : {},
		...normalization ? { normalization } : {}
	};
}
const UNRESOLVED_PREFIX_VAR_PATTERN = /\{[a-zA-Z][a-zA-Z0-9.]*\}/;
async function executeMessageSend(ctx) {
	const { cfg, params, channel, channelPlugin, accountId, dryRun, gateway, input, agentId, resolvedTarget, abortSignal } = ctx;
	throwIfAborted(abortSignal);
	const action = "send";
	const to = readToolStringParam(params, "to", { required: true });
	let sendPayload = await buildMessagePayload({
		cfg,
		actionParams: params,
		input,
		channel,
		target: to,
		accountId,
		agentId
	});
	const responsePrefix = resolveResponsePrefixTemplate(resolveResponsePrefix(cfg, agentId ?? "", {
		channel,
		accountId: accountId ?? void 0
	}), { identityName: normalizeOptionalString(resolveAgentIdentity(cfg, agentId ?? "")?.name) });
	const prefixHasUnresolvedVar = responsePrefix !== void 0 && UNRESOLVED_PREFIX_VAR_PATTERN.test(responsePrefix);
	if (responsePrefix && !prefixHasUnresolvedVar && sendPayload.message && !sendPayload.message.startsWith(responsePrefix)) {
		const prefixedMessage = `${responsePrefix} ${sendPayload.message}`;
		sendPayload = {
			...sendPayload,
			message: prefixedMessage,
			payload: {
				...sendPayload.payload,
				text: prefixedMessage
			}
		};
		applySendPayloadPartsToActionParams(params, sendPayload);
	}
	const replyToIsExplicit = Boolean(readToolStringParam(params, "replyTo"));
	resolveAndApplyOutboundReplyToId(params, {
		channel,
		toolContext: input.toolContext,
		matchesToolContextTarget: channelPlugin?.threading?.matchesToolContextTarget
	});
	const { resolvedThreadId, outboundRoute } = await prepareOutboundMirrorRoute({
		cfg,
		channel,
		to,
		actionParams: params,
		accountId,
		toolContext: input.toolContext,
		agentId,
		currentSessionKey: input.sessionKey,
		dryRun,
		resolvedTarget,
		resolveAutoThreadId: channelPlugin?.threading?.resolveAutoThreadId,
		resolveReplyTransport: channelPlugin?.threading?.resolveReplyTransport,
		replyToIsExplicit,
		resolveOutboundSessionRoute,
		ensureOutboundSessionEntry
	});
	const resolvedReplyToId = readToolStringParam(params, "replyTo");
	throwIfAborted(abortSignal);
	const ttsPayload = await maybeApplyTtsToMessageActionSendPayload({
		payload: sendPayload.payload,
		cfg,
		channel,
		accountId,
		agentId,
		sessionKey: input.sessionKey,
		inboundAudio: input.inboundAudio,
		dryRun
	});
	if (ttsPayload !== sendPayload.payload) {
		sendPayload = updateSendPayloadPartsFromReplyPayload(sendPayload, ttsPayload);
		applySendPayloadPartsToActionParams(params, sendPayload);
	}
	throwIfAborted(abortSignal);
	const mediaAccess = resolveAgentScopedOutboundMediaAccess({
		cfg,
		agentId,
		mediaSources: collectActionMediaSourceHints(params, ctx.extraActionMediaSourceParamKeys, { structuredAttachments: "all" }),
		sessionKey: input.sessionKey,
		messageProvider: input.sessionKey ? void 0 : channel,
		accountId: input.sessionKey ? input.requesterAccountId ?? accountId : accountId,
		requesterSenderId: input.requesterSenderId,
		requesterSenderName: input.requesterSenderName,
		requesterSenderUsername: input.requesterSenderUsername,
		requesterSenderE164: input.requesterSenderE164
	});
	const requiresCoreDelivery = input.forceCoreDelivery === true || input.requireQueuePersistence === true;
	const gatewayPluginAction = requiresCoreDelivery ? null : await executeGatewayAction({
		cfg,
		params,
		channel,
		channelPlugin,
		action,
		accountId,
		dryRun,
		gateway,
		input,
		agentId,
		result: (payload) => ({
			kind: "send",
			channel,
			action,
			to,
			handledBy: "plugin",
			payload,
			dryRun
		})
	});
	if (gatewayPluginAction) return annotateSourceDelivery(withSendNormalization$1(gatewayPluginAction, sendPayload.normalization), {
		cfg,
		actionParams: params,
		channel,
		accountId,
		input,
		agentId,
		replyToIsExplicit
	});
	const useCorePresentationDelivery = Boolean(sendPayload.payload.presentation && hasCorePresentationDelivery(channelPlugin?.outbound));
	if (sendPayload.payload.presentation && !useCorePresentationDelivery) {
		const fallbackMessage = materializeMessagePresentationFallback({
			payload: sendPayload.payload,
			text: sendPayload.message
		});
		sendPayload = {
			...sendPayload,
			message: fallbackMessage,
			payload: {
				...sendPayload.payload,
				text: fallbackMessage
			}
		};
		applySendPayloadPartsToActionParams(params, sendPayload);
	}
	const send = await executeSendAction({
		ctx: {
			cfg,
			channel,
			plugin: channelPlugin,
			params,
			idempotencyKey: ctx.idempotencyKey,
			agentId,
			sessionKey: input.sessionKey,
			requesterAccountId: input.requesterAccountId ?? void 0,
			requesterSenderId: input.requesterSenderId ?? void 0,
			requesterSenderName: input.requesterSenderName ?? void 0,
			requesterSenderUsername: input.requesterSenderUsername ?? void 0,
			requesterSenderE164: input.requesterSenderE164 ?? void 0,
			senderIsOwner: input.senderIsOwner,
			conversationReadOrigin: normalizeConversationReadInvocationOrigin(input.conversationReadOrigin),
			mediaAccess,
			accountId: accountId ?? void 0,
			conversationType: outboundRoute?.chatType,
			sessionId: input.sessionId,
			inboundEventKind: input.inboundEventKind,
			gateway,
			toolContext: input.toolContext,
			deps: input.deps,
			dryRun,
			preparedMessageId: input.preparedMessageId,
			gatewayOwnedDelivery: input.gatewayOwnedDelivery,
			forceCoreDelivery: requiresCoreDelivery,
			requireQueuePersistence: input.requireQueuePersistence,
			deliveryIntentId: input.deliveryIntentId,
			deliveryCompletion: input.deliveryCompletion,
			onDeliveryIntent: input.onDeliveryIntent,
			onDeliveryResult: input.onDeliveryResult,
			mirror: !dryRun && input.transcriptMirror ? {
				...input.transcriptMirror,
				text: sendPayload.message,
				mediaUrls: sendPayload.mediaUrls
			} : outboundRoute && !dryRun && input.suppressTranscriptMirror !== true ? {
				sessionKey: outboundRoute.sessionKey,
				agentId,
				text: sendPayload.message,
				mediaUrls: sendPayload.mediaUrls,
				idempotencyKey: normalizeOptionalString(params.idempotencyKey) ?? void 0
			} : void 0,
			abortSignal,
			silent: sendPayload.silent ?? void 0
		},
		to,
		message: sendPayload.message,
		payload: sendPayload.payload,
		mediaUrl: sendPayload.mediaUrl,
		mediaUrls: sendPayload.mediaUrls,
		buffer: readToolStringParam(params, "buffer", { trim: false }) ?? void 0,
		filename: readToolStringParam(params, "filename") ?? void 0,
		contentType: readToolStringParam(params, "contentType") ?? void 0,
		asVoice: sendPayload.asVoice,
		gifPlayback: sendPayload.gifPlayback,
		forceDocument: sendPayload.forceDocument,
		bestEffort: sendPayload.bestEffort,
		replyToId: resolvedReplyToId ?? void 0,
		replyToIdSource: resolvedReplyToId ? replyToIsExplicit ? "explicit" : "implicit" : void 0,
		threadId: resolvedThreadId ?? void 0
	});
	return annotateSourceDelivery(withSendNormalization$1({
		kind: "send",
		channel,
		action,
		to,
		handledBy: send.handledBy,
		payload: send.payload,
		...send.deliveredText ? { deliveredText: send.deliveredText } : {},
		toolResult: send.toolResult,
		sendResult: send.sendResult,
		dryRun
	}, sendPayload.normalization), {
		cfg,
		actionParams: params,
		channel,
		accountId,
		input,
		agentId,
		replyToIsExplicit
	});
}
//#endregion
//#region src/infra/outbound/message-action-runner.ts
function getToolResult(result) {
	return "toolResult" in result ? result.toolResult : void 0;
}
function withSendNormalization(result, normalization) {
	return normalization && result.kind === "send" ? {
		...result,
		normalization
	} : result;
}
function deriveBroadcastEntryOutcome(sendResult) {
	if (!sendResult || sendResult.deliveryStatus === void 0 || sendResult.deliveryStatus === "sent") return { ok: true };
	switch (sendResult.deliveryStatus) {
		case "suppressed": return {
			ok: false,
			error: `Broadcast send suppressed: ${sendResult.suppressionReason ?? "unknown reason"}.`
		};
		case "failed": return {
			ok: false,
			error: sendResult.error ?? "Broadcast send failed."
		};
		case "partial_failed": return {
			ok: false,
			error: sendResult.error ?? "Broadcast send partially failed.",
			sentBeforeError: true
		};
	}
	return sendResult.deliveryStatus;
}
async function handleBroadcastAction(input, params) {
	throwIfAborted(input.abortSignal);
	if (!(resolveEffectiveMessageToolsConfig({
		cfg: input.cfg,
		agentId: input.agentId
	})?.broadcast?.enabled !== false)) throw new Error("Broadcast is disabled. Set tools.message.broadcast.enabled to true.");
	const rawTargets = readStringArrayParam(params, "targets", { required: true });
	if (rawTargets.length === 0) throw new Error("Broadcast requires at least one target in --targets.");
	const channelHint = readToolStringParam(params, "channel");
	const explicitAccountId = validateExplicitMessageAccountSelection({
		cfg: input.cfg,
		accountId: readToolStringParam(params, "accountId"),
		checkResolvedAccount: false
	});
	if (input.broadcastAccountPlan && input.broadcastAccountPlan.accountId !== explicitAccountId) throw new Error("Broadcast account plan does not match the requested account.");
	const targetChannels = channelHint && normalizeOptionalLowercaseString(channelHint) !== "all" ? [(await resolveMessageChannelSelection({
		cfg: input.cfg,
		channel: channelHint,
		fallbackChannel: input.toolContext?.currentChannelProvider,
		agentId: input.agentId
	})).channel] : input.broadcastAccountPlan ? input.broadcastAccountPlan.candidateChannels : await (async () => {
		const configured = await listConfiguredMessageChannels(input.cfg);
		if (configured.length === 0) throw new Error("Broadcast requires at least one configured channel.");
		return configured;
	})();
	if (targetChannels.length === 0) throw new Error("Broadcast requires at least one configured channel.");
	const results = [];
	const isAbortError = (err) => err instanceof Error && err.name === "AbortError";
	for (const targetChannel of targetChannels) {
		throwIfAborted(input.abortSignal);
		for (const target of rawTargets) {
			throwIfAborted(input.abortSignal);
			try {
				const targetAccountId = validateExplicitMessageAccountSelection({
					cfg: input.cfg,
					channel: targetChannel,
					accountId: explicitAccountId
				});
				const targetArgs = { to: target };
				const resolved = await resolveMessageTarget({
					cfg: input.cfg,
					channel: targetChannel,
					action: "send",
					args: targetArgs,
					accountId: targetAccountId
				});
				if (!resolved) throw new Error("Broadcast target resolution unexpectedly deferred.");
				const sendResult = await runMessageAction({
					...input,
					action: "send",
					params: {
						...params,
						channel: targetChannel,
						target: resolved.to
					}
				});
				results.push({
					channel: targetChannel,
					to: resolved.to,
					...deriveBroadcastEntryOutcome(sendResult.kind === "send" ? sendResult.sendResult : void 0),
					payload: sendResult.kind === "send" ? sendResult.payload : void 0,
					result: sendResult.kind === "send" ? sendResult.sendResult : void 0
				});
			} catch (err) {
				if (isAbortError(err)) throw err;
				results.push({
					channel: targetChannel,
					to: target,
					ok: false,
					error: formatErrorMessage(err),
					...err && typeof err === "object" && err.sentBeforeError === true ? { sentBeforeError: true } : {}
				});
			}
		}
	}
	return {
		kind: "broadcast",
		channel: targetChannels[0] ?? normalizeOptionalLowercaseString(channelHint) ?? "unknown",
		action: "broadcast",
		handledBy: input.dryRun ? "dry-run" : "core",
		payload: { results },
		dryRun: Boolean(input.dryRun)
	};
}
async function handleInternalSourceReplySendAction(input, params) {
	throwIfAborted(input.abortSignal);
	const dryRun = Boolean(input.dryRun ?? readBooleanParam(params, "dryRun"));
	const sourceReply = await buildMessagePayload({
		cfg: input.cfg,
		actionParams: params,
		input,
		agentId: input.agentId ?? (input.sessionKey ? resolveSessionAgentId({
			sessionKey: input.sessionKey,
			config: input.cfg
		}) : void 0)
	});
	const payload = {
		status: "ok",
		deliveryStatus: dryRun ? "dry_run" : "sent",
		channel: INTERNAL_MESSAGE_CHANNEL,
		target: "current-run",
		sourceReplyDeliveryMode: input.sourceReplyDeliveryMode,
		...dryRun ? {} : { sourceReplySink: "internal-ui" },
		sourceReply: sourceReply.payload,
		...sourceReply.message ? { message: sourceReply.message } : {},
		...sourceReply.mediaUrl ? { mediaUrl: sourceReply.mediaUrl } : {},
		...sourceReply.mediaUrls?.length ? { mediaUrls: sourceReply.mediaUrls } : {},
		dryRun
	};
	return withSendNormalization({
		kind: "send",
		channel: INTERNAL_MESSAGE_CHANNEL,
		action: "send",
		to: "current-run",
		handledBy: "internal-source",
		payload,
		toolResult: buildInternalSourceReplyToolResult(payload),
		dryRun
	}, sourceReply.normalization);
}
function buildInternalSourceReplyToolResult(payload) {
	return {
		content: [{
			type: "text",
			text: `${payload.dryRun ? "Prepared" : "Sent"} visible reply to the current source conversation${payload.sourceReplySink ? ` via ${payload.sourceReplySink}` : ""}.`
		}],
		details: {
			status: payload.status,
			deliveryStatus: payload.deliveryStatus,
			channel: payload.channel,
			target: payload.target,
			...payload.sourceReplyDeliveryMode ? { sourceReplyDeliveryMode: payload.sourceReplyDeliveryMode } : {},
			...payload.sourceReplySink ? { sourceReplySink: payload.sourceReplySink } : {},
			sourceReply: payload.sourceReply,
			...payload.message ? { message: payload.message } : {},
			...payload.mediaUrl ? { mediaUrl: payload.mediaUrl } : {},
			...payload.mediaUrls?.length ? { mediaUrls: payload.mediaUrls } : {},
			dryRun: payload.dryRun
		}
	};
}
async function runMessageAction(input) {
	const cfg = input.cfg;
	let params = { ...input.params };
	const resolvedAgentId = input.agentId ?? (input.sessionKey ? resolveSessionAgentId({
		sessionKey: input.sessionKey,
		config: cfg
	}) : void 0);
	parseJsonMessageParam(params, "presentation");
	parseJsonMessageParam(params, "delivery");
	parseInteractiveParam(params);
	const action = input.action;
	enforceMessageActionAllowlist({
		cfg,
		agentId: resolvedAgentId,
		action
	});
	if (action === "broadcast") return handleBroadcastAction({
		...input,
		agentId: resolvedAgentId
	}, params);
	if (action === "send" && hasPollCreationParams(params)) throw new Error("Poll fields require action \"poll\"; use action \"poll\" instead of \"send\".");
	if (await shouldUseInternalSourceReplySink(input, params)) return handleInternalSourceReplySendAction({
		...input,
		agentId: resolvedAgentId
	}, params);
	const route = await prepareMessageRoute({
		input,
		actionParams: params,
		agentId: resolvedAgentId
	});
	params = route.params;
	const { channel, channelPlugin, accountId, dryRun, defersExternalTargetResolution } = route;
	const normalizationPolicy = resolveAttachmentMediaPolicy({
		sandboxRoot: input.sandboxRoot,
		mediaLocalRoots: getAgentScopedMediaLocalRoots(cfg, resolvedAgentId)
	});
	const extraActionMediaSourceParamKeys = resolveExtraActionMediaSourceParamKeys({
		cfg,
		action,
		args: params,
		channel,
		accountId,
		sessionKey: input.sessionKey,
		sessionId: input.sessionId,
		agentId: resolvedAgentId,
		requesterSenderId: input.requesterSenderId,
		senderIsOwner: input.senderIsOwner
	});
	const structuredAttachmentMode = action === "send" ? "all" : "selected";
	await normalizeSandboxMediaParams({
		args: params,
		mediaPolicy: normalizationPolicy,
		extraParamKeys: extraActionMediaSourceParamKeys,
		structuredAttachments: structuredAttachmentMode
	});
	const mediaAccess = resolveAgentScopedOutboundMediaAccess({
		cfg,
		agentId: resolvedAgentId,
		mediaSources: collectActionMediaSourceHints(params, extraActionMediaSourceParamKeys, { structuredAttachments: structuredAttachmentMode }),
		sessionKey: input.sessionKey,
		messageProvider: input.sessionKey ? void 0 : channel,
		accountId: input.sessionKey ? input.requesterAccountId ?? accountId : accountId,
		requesterSenderId: input.requesterSenderId,
		requesterSenderName: input.requesterSenderName,
		requesterSenderUsername: input.requesterSenderUsername,
		requesterSenderE164: input.requesterSenderE164
	});
	const mediaPolicy = resolveAttachmentMediaPolicy({
		sandboxRoot: input.sandboxRoot,
		mediaAccess
	});
	const gateway = input.gateway;
	const preserveSendBuffer = action === "send" && Boolean(gateway) && (channelPlugin?.actions?.resolveExecutionMode?.({ action: "send" }) === "gateway" || channelPlugin?.outbound?.deliveryMode === "gateway");
	const hydrateActionAttachmentParams = () => hydrateAttachmentParamsForAction({
		cfg,
		channel,
		accountId,
		args: params,
		action,
		dryRun,
		preserveSendBuffer,
		mediaPolicy,
		extraParamKeys: extraActionMediaSourceParamKeys
	});
	if (action !== "send") await hydrateActionAttachmentParams();
	const resolvedTarget = await resolveMessageTarget({
		cfg,
		channel,
		action,
		args: params,
		accountId,
		toolContext: input.toolContext,
		agentId: resolvedAgentId,
		deferExternalTargetResolution: defersExternalTargetResolution
	});
	if (action === "send") await hydrateActionAttachmentParams();
	const context = {
		cfg,
		params,
		idempotencyKey: normalizeOptionalString(params.idempotencyKey),
		channel,
		channelPlugin,
		mediaAccess,
		extraActionMediaSourceParamKeys,
		accountId,
		dryRun,
		gateway,
		input,
		agentId: resolvedAgentId,
		resolvedTarget,
		abortSignal: input.abortSignal
	};
	if (action === "send") return executeMessageSend(context);
	if (action === "poll") return executeMessagePoll(context);
	return executeMessagePlugin(context);
}
//#endregion
export { SHARED_POLL_CREATION_PARAM_NAMES as i, runMessageAction as n, POLL_CREATION_PARAM_DEFS as r, getToolResult as t };
