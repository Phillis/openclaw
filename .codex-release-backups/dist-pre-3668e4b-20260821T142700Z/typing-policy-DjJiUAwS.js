import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.js";
import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { n as isVitestRuntimeEnv } from "./test-runtime-env-DQDRzsLt.js";
import "./env-uyT2Z2BT.js";
import { o as resolveSessionStorePathCore } from "./paths-CfFmgJmW.js";
import "./registry-BAJij-wJ.js";
import { t as normalizeAnyChannelId } from "./registry-normalize-D2WRwH5s.js";
import { t as applyMergePatch } from "./merge-patch-B5RMlh8J.js";
import { t as normalizeChatType } from "./chat-type-CG0X_HJM.js";
import "./message-channel-constants-2zSoJXQC.js";
import { Pt as listSessionEntriesCore, Qt as loadSessionEntry, gn as buildSessionCreationStamp } from "./session-accessor-CIiPoGwM.js";
import "./message-channel-C3nRvjrX.js";
import { d as DEFAULT_RESET_TRIGGERS } from "./restart-recovery-state-YPGO30LK.js";
import { a as hasStagedMediaFacts } from "./media-facts-CdKKNGmE.js";
import { c as resolveCommandTurnTargetSessionKey } from "./command-turn-context-CRxhzdEY.js";
import { r as normalizeCommandBody } from "./commands-registry-normalize-CaOk1bq2.js";
import { n as resolveSessionKey } from "./session-key-DrPL3_t2.js";
import { n as createReplySessionEntryHandle } from "./session-entry-handle-CZxMWW1P.js";
import { r as isFormattedGoalContinuationPrompt } from "./commands-goal-BOPtxYuO.js";
import { a as isModelSelectionLocked, n as MODEL_SELECTION_LOCKED_RESET_MESSAGE, r as ModelSelectionLockedError } from "./model-overrides-D4SC_nUZ.js";
import { n as hasInboundMedia } from "./inbound-media-DbDNHQxy.js";
import { t as resolveResetPreservedSelection } from "./reset-preserved-selection-SFXz1F3S.js";
import "./commands-registry-C38Kk_Ud.js";
import { a as stripMentions } from "./mentions-B-i6KK-E.js";
import "./history-DLKGD0Dj.js";
import { t as parseSoftResetCommand } from "./commands-reset-mode-CPsoHzU1.js";
import crypto from "node:crypto";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/auto-reply/reply/prepared-reply-dispatch-context.ts
const preparedReplyDispatchRuntime = new AsyncLocalStorage();
/** Keeps the configured Gateway generation request-scoped without widening the public resolver. */
function runWithPreparedReplyDispatchRuntime(runtime, run) {
	return preparedReplyDispatchRuntime.run(runtime, run);
}
function bindPreparedReplyDispatchRuntime(runtime, run) {
	return (...args) => runWithPreparedReplyDispatchRuntime(runtime, () => run(...args));
}
function getPreparedReplyDispatchRuntime() {
	return preparedReplyDispatchRuntime.getStore();
}
//#endregion
//#region src/auto-reply/reply/stage-remote-inbound-media.ts
/** Shared guard for staging remote inbound media into the local cache. */
const stageSandboxMediaRuntimeLoader = createLazyImportLoader(() => import("./stage-sandbox-media.runtime.js"));
/**
* Stage remote (SCP) inbound media before downstream consumers read the media
* facts into the local cache. Staged facts carry their workspace so later
* staging sites preserve the single-stage contract. Both the dispatch plugin-claim path and get-reply's
* media-understanding path rely on this rewrite to expose the local cache path
* instead of the unreachable remote host path; returns whether staging ran.
*/
async function stageRemoteInboundMediaIfNeeded(params) {
	if (!params.sessionKey || hasStagedMediaFacts(params.ctx.media) || !normalizeOptionalString(params.ctx.MediaRemoteHost) || !hasInboundMedia(params.ctx)) return false;
	const { stageSandboxMedia } = await stageSandboxMediaRuntimeLoader.load();
	if ((await stageSandboxMedia({
		ctx: params.ctx,
		sessionCtx: params.ctx,
		cfg: params.cfg,
		sessionKey: params.sessionKey,
		workspaceDir: params.workspaceDir,
		remoteMediaMode: params.remoteMediaMode
	})).staged.size === 0) return false;
	return true;
}
//#endregion
//#region src/auto-reply/reply/reply-config-runtime-mode.ts
const replyConfigRuntimeModes = /* @__PURE__ */ new WeakMap();
function markReplyConfigRuntimeMode(config, runtimeMode) {
	replyConfigRuntimeModes.set(config, runtimeMode);
	return config;
}
function isCompleteReplyConfig(config) {
	return Boolean(config && typeof config === "object" && replyConfigRuntimeModes.has(config));
}
function usesFullReplyRuntime(config) {
	if (!config || typeof config !== "object") return false;
	return replyConfigRuntimeModes.get(config) === "full";
}
//#endregion
//#region src/auto-reply/reply/session-reset-command.ts
function skipWhitespace(source, start) {
	let cursor = start;
	while (/\s/.test(source[cursor] ?? "")) cursor += 1;
	return cursor;
}
function skipHorizontalWhitespace(source, start) {
	let cursor = start;
	while (source[cursor] === " " || source[cursor] === "	") cursor += 1;
	return cursor;
}
function startsWithHistoryMarker(source, start) {
	return source.startsWith("[Chat messages since your last reply - for context]", start) || source.startsWith("[Current message - respond to this]", start);
}
function matchesKnownSenderPrefix(prefix, ctx) {
	const normalizedPrefix = normalizeLowercaseStringOrEmpty(prefix);
	if (!normalizedPrefix) return false;
	const senderUsername = ctx.SenderUsername?.trim().replace(/^@/, "");
	return [
		ctx.SenderName,
		ctx.SenderTag,
		senderUsername,
		senderUsername ? `@${senderUsername}` : void 0,
		ctx.SenderName && senderUsername ? `${ctx.SenderName} (@${senderUsername})` : void 0
	].some((candidate) => typeof candidate === "string" && normalizeLowercaseStringOrEmpty(candidate) === normalizedPrefix);
}
function resolveExplicitMessageStart(source, ctx) {
	let cursor = skipWhitespace(source, 0);
	if (startsWithHistoryMarker(source, cursor)) return;
	while (source[cursor] === "[") {
		const lineEnd = source.indexOf("\n", cursor);
		const envelopeEnd = source.indexOf("]", cursor + 1);
		if (envelopeEnd === -1 || lineEnd !== -1 && envelopeEnd > lineEnd) break;
		if (startsWithHistoryMarker(source, cursor)) return;
		cursor = skipHorizontalWhitespace(source, envelopeEnd + 1);
	}
	const lineEnd = source.indexOf("\n", cursor);
	const effectiveLineEnd = lineEnd === -1 ? source.length : lineEnd;
	const senderPrefixEnd = source.indexOf(":", cursor);
	if (senderPrefixEnd !== -1 && senderPrefixEnd < effectiveLineEnd) {
		const senderPrefix = source.slice(cursor, senderPrefixEnd).trim();
		if (senderPrefix && senderPrefix.length <= 120 && matchesKnownSenderPrefix(senderPrefix, ctx)) cursor = skipHorizontalWhitespace(source, senderPrefixEnd + 1);
	}
	return cursor;
}
function stripLeadingMention(params) {
	const triggerLower = normalizeLowercaseStringOrEmpty(params.trigger);
	if (normalizeLowercaseStringOrEmpty(params.source.slice(params.start, params.start + params.trigger.length)) === triggerLower) return params.start;
	if (!params.isGroup) return;
	let triggerStart = -1;
	for (let index = params.start; index < params.source.length; index += 1) if (normalizeLowercaseStringOrEmpty(params.source.slice(index, index + params.trigger.length)) === triggerLower) {
		triggerStart = index;
		break;
	}
	if (triggerStart === -1) return;
	const prefix = params.source.slice(params.start, triggerStart);
	if (prefix.includes("\n")) return;
	if (!stripMentions(prefix, params.ctx, params.cfg, params.agentId).trim()) return triggerStart;
	return params.ctx.WasMentioned === true && params.source.slice(triggerStart).trimEnd() === params.commandText.trim() ? triggerStart : void 0;
}
function isRecognizedCommandSuffix(params) {
	const botUsername = params.ctx.BotUsername?.trim().replace(/^@/, "");
	if (botUsername && normalizeLowercaseStringOrEmpty(params.suffix) === normalizeLowercaseStringOrEmpty(botUsername)) return true;
	if (!params.isGroup) return false;
	return !stripMentions(`@${params.suffix}`, params.ctx, params.cfg, params.agentId).trim();
}
function resolveAnchoredResetPayload(params) {
	if (params.source === "") return;
	const messageStart = resolveExplicitMessageStart(params.source, params.ctx);
	if (messageStart === void 0) return;
	const triggerStart = stripLeadingMention({
		...params,
		start: messageStart
	});
	if (triggerStart === void 0) return;
	let payloadStart = triggerStart + params.trigger.length;
	if (params.source[payloadStart] === "@") {
		const suffixStart = payloadStart + 1;
		payloadStart = suffixStart;
		while (params.source[payloadStart] !== void 0 && params.source[payloadStart] !== ":" && !/\s/.test(params.source[payloadStart] ?? "")) payloadStart += 1;
		const suffix = params.source.slice(suffixStart, payloadStart);
		if (!suffix || !isRecognizedCommandSuffix({
			suffix,
			ctx: params.ctx,
			cfg: params.cfg,
			agentId: params.agentId,
			isGroup: params.isGroup
		})) return;
	}
	const delimiter = params.source[payloadStart];
	if (delimiter === void 0) return "";
	if (delimiter === ":") payloadStart += 1;
	else if (!/\s/.test(delimiter)) return;
	return params.source.slice(payloadStart).trimStart();
}
function resolveCommandTextForSession(params) {
	const messageStart = resolveExplicitMessageStart(params.commandText, params.ctx);
	const anchored = messageStart === void 0 ? params.commandText.trim() : params.commandText.slice(messageStart);
	return (params.isGroup ? stripMentions(anchored, params.ctx, params.cfg, params.agentId) : anchored).replace(/\\n/g, " ").trim();
}
function isTranscriptOnlyCommand(ctx, commandText) {
	return typeof ctx.Transcript === "string" && commandText === ctx.Transcript.replace(/\\n/g, " ").trim();
}
function resolveSessionResetCommand(params) {
	const triggerBodyNormalized = resolveCommandTextForSession(params);
	const normalizedResetBody = normalizeCommandBody(triggerBodyNormalized, { botUsername: params.ctx.BotUsername });
	const softResetMatched = parseSoftResetCommand(normalizedResetBody).matched;
	const result = {
		normalizedResetBody,
		softResetMatched,
		triggerBodyNormalized
	};
	if (!params.resetAuthorized || softResetMatched || isTranscriptOnlyCommand(params.ctx, params.commandText)) return result;
	const normalizedResetBodyLower = normalizeLowercaseStringOrEmpty(normalizedResetBody);
	for (const trigger of params.resetTriggers) {
		const triggerLower = normalizeLowercaseStringOrEmpty(trigger);
		if (!triggerLower || normalizedResetBodyLower !== triggerLower && !normalizedResetBodyLower.startsWith(`${triggerLower} `)) continue;
		const payload = resolveAnchoredResetPayload({
			source: params.rawText,
			trigger,
			commandText: params.commandText,
			ctx: params.ctx,
			cfg: params.cfg,
			agentId: params.agentId,
			isGroup: params.isGroup
		});
		if (payload === void 0) continue;
		return {
			...result,
			matchedResetTriggerLower: triggerLower,
			payload
		};
	}
	return result;
}
//#endregion
//#region src/auto-reply/reply/get-reply-fast-path.ts
function isSlowReplyTestAllowed(env = process.env) {
	return isVitestRuntimeEnv(env) && env.OPENCLAW_ALLOW_SLOW_REPLY_TESTS === "1" || env.OPENCLAW_STRICT_FAST_REPLY_CONFIG === "0";
}
function resolveFastSessionKey(params) {
	const { ctx } = params;
	const nativeCommandTarget = resolveCommandTurnTargetSessionKey(ctx) ?? "";
	if (nativeCommandTarget) return nativeCommandTarget;
	return resolveSessionKey(params.sessionScope, ctx, params.mainKey, params.agentId);
}
function withFullRuntimeReplyConfig(config) {
	return markReplyConfigRuntimeMode(config, "full");
}
function resolveGetReplyConfig(params) {
	const { configOverride } = params;
	if (configOverride == null) return params.getRuntimeConfig();
	if (params.isFastTestEnv && !isCompleteReplyConfig(configOverride) && !isSlowReplyTestAllowed()) throw new Error("Fast reply tests must pass with withFastReplyConfig()/markCompleteReplyConfig(); set OPENCLAW_ALLOW_SLOW_REPLY_TESTS=1 to opt out.");
	if (params.isFastTestEnv && isCompleteReplyConfig(configOverride)) return configOverride;
	if (isCompleteReplyConfig(configOverride)) return configOverride;
	return applyMergePatch(params.getRuntimeConfig(), configOverride);
}
function shouldUseReplyFastTestBootstrap(params) {
	return params.isFastTestEnv && isCompleteReplyConfig(params.configOverride) && !usesFullReplyRuntime(params.configOverride);
}
function shouldUseReplyFastTestRuntime(params) {
	return params.isFastTestEnv && isCompleteReplyConfig(params.cfg) && !usesFullReplyRuntime(params.cfg);
}
function shouldUseReplyFastDirectiveExecution(params) {
	if (!params.isFastTestBootstrap || params.isGroup || params.isHeartbeat || params.resetTriggered) return false;
	return !params.triggerBodyNormalized.includes("/");
}
function buildFastReplyCommandContext(params) {
	const { ctx, cfg, agentId, sessionKey, isGroup, triggerBodyNormalized, commandAuthorized } = params;
	const originatingChannel = normalizeOptionalLowercaseString(ctx.OriginatingChannel);
	const surface = normalizeOptionalLowercaseString(ctx.Surface ?? ctx.Provider) ?? "";
	const channel = originatingChannel ?? normalizeOptionalLowercaseString(ctx.Provider ?? surface) ?? "";
	const from = normalizeOptionalString(ctx.From ?? ctx.SenderId);
	const to = normalizeOptionalString(ctx.To ?? ctx.OriginatingTo);
	return {
		surface,
		channel,
		channelId: normalizeAnyChannelId(channel) ?? normalizeAnyChannelId(surface) ?? void 0,
		accountId: normalizeOptionalString(ctx.AccountId),
		ownerList: [],
		senderIsOwner: false,
		isAuthorizedSender: commandAuthorized,
		senderId: from,
		abortKey: sessionKey ?? from ?? to,
		rawBodyNormalized: triggerBodyNormalized,
		commandBodyNormalized: normalizeCommandBody(isGroup ? stripMentions(triggerBodyNormalized, ctx, cfg, agentId) : triggerBodyNormalized, { botUsername: ctx.BotUsername }),
		from,
		to
	};
}
function shouldHandleFastReplyTextCommands(params) {
	return params.commandSource === "native" || params.cfg.commands?.text !== false;
}
function initFastReplySessionState(params) {
	const { ctx, cfg, agentId, commandAuthorized } = params;
	const sessionScope = cfg.session?.scope ?? "per-sender";
	const sessionKey = resolveFastSessionKey({
		ctx,
		sessionScope,
		mainKey: cfg.session?.mainKey,
		agentId
	});
	const storePath = resolveSessionStorePathCore(cfg.session?.store, { agentId });
	const sessionStore = Object.fromEntries(listSessionEntriesCore({ storePath }).map(({ sessionKey: entryKey, entry }) => [entryKey, entry]));
	const existingEntry = loadSessionEntry({
		storePath,
		sessionKey
	});
	const commandSource = ctx.commandText ?? "";
	const normalizedChatType = normalizeChatType(ctx.ChatType);
	const isGroup = normalizedChatType != null && normalizedChatType !== "direct";
	const resetCommand = resolveSessionResetCommand({
		commandText: commandSource,
		rawText: ctx.rawText,
		resetTriggers: cfg.session?.resetTriggers?.length ? cfg.session.resetTriggers : DEFAULT_RESET_TRIGGERS,
		ctx,
		cfg,
		agentId,
		isGroup,
		resetAuthorized: commandAuthorized
	});
	const triggerBodyNormalized = isFormattedGoalContinuationPrompt(commandSource) ? commandSource.trim() : resetCommand.triggerBodyNormalized;
	const resetTriggered = resetCommand.matchedResetTriggerLower !== void 0;
	if (resetTriggered && isModelSelectionLocked(existingEntry)) throw new ModelSelectionLockedError(MODEL_SELECTION_LOCKED_RESET_MESSAGE);
	const previousSessionEntry = resetTriggered && existingEntry ? { ...existingEntry } : void 0;
	const sessionId = !resetTriggered && existingEntry ? existingEntry.sessionId : crypto.randomUUID();
	const bodyStripped = resetTriggered ? resetCommand.payload ?? "" : ctx.agentText ?? "";
	const now = Date.now();
	const resetPreservedSelection = resetTriggered ? resolveResetPreservedSelection({ entry: existingEntry }) : {};
	const sessionEntry = {
		...!resetTriggered ? existingEntry : void 0,
		sessionId,
		...!existingEntry && ctx.SessionCreation ? buildSessionCreationStamp(ctx.SessionCreation) : {},
		...resetTriggered && existingEntry ? {
			previousSessionId: existingEntry.sessionId,
			spawnedBy: existingEntry.spawnedBy,
			spawnedWorkspaceDir: existingEntry.spawnedWorkspaceDir,
			spawnedCwd: existingEntry.spawnedCwd,
			parentSessionKey: existingEntry.parentSessionKey,
			parentSessionId: existingEntry.parentSessionId,
			forkedFromParent: existingEntry.forkedFromParent,
			forkSource: existingEntry.forkSource,
			createdVia: existingEntry.createdVia,
			createdActor: existingEntry.createdActor,
			createdAt: existingEntry.createdAt,
			spawnDepth: existingEntry.spawnDepth,
			subagentRole: existingEntry.subagentRole,
			subagentControlScope: existingEntry.subagentControlScope
		} : {},
		...resetPreservedSelection,
		updatedAt: now,
		sessionStartedAt: resetTriggered ? now : existingEntry?.sessionStartedAt ?? now,
		lastInteractionAt: now,
		agentStatus: void 0,
		thinkingLevel: existingEntry?.thinkingLevel,
		verboseLevel: existingEntry?.verboseLevel,
		reasoningLevel: existingEntry?.reasoningLevel,
		ttsAuto: existingEntry?.ttsAuto,
		responseUsage: existingEntry?.responseUsage,
		...normalizedChatType ? { chatType: normalizedChatType } : {},
		...normalizeOptionalString(ctx.Provider) ? { channel: normalizeOptionalString(ctx.Provider) } : {},
		...normalizeOptionalString(ctx.GroupSubject) ? { subject: normalizeOptionalString(ctx.GroupSubject) } : {},
		...normalizeOptionalString(ctx.GroupChannel) ? { groupChannel: normalizeOptionalString(ctx.GroupChannel) } : {}
	};
	sessionStore[sessionKey] = sessionEntry;
	const sessionEntryHandle = createReplySessionEntryHandle({
		sessionEntry,
		sessionKey,
		sessionStore
	});
	return {
		sessionCtx: {
			...ctx,
			commandText: ctx.commandText ?? "",
			agentText: bodyStripped,
			rawText: ctx.rawText ?? "",
			SessionKey: sessionKey,
			CommandAuthorized: commandAuthorized,
			BodyStripped: bodyStripped,
			...normalizedChatType ? { ChatType: normalizedChatType } : {}
		},
		sessionEntry,
		initialSessionEntry: existingEntry ? { ...existingEntry } : void 0,
		sessionEntryHandle,
		sessionStore,
		sessionKey,
		sessionId,
		isNewSession: resetTriggered || !existingEntry,
		resetTriggered,
		systemSent: false,
		abortedLastRun: false,
		storePath,
		sessionScope,
		groupResolution: void 0,
		isGroup,
		bodyStripped,
		triggerBodyNormalized,
		previousSessionEntry
	};
}
//#endregion
//#region src/auto-reply/reply/typing-policy.ts
/** Resolves typing policy and suppresses typing for non-user-visible turns. */
function resolveRunTypingPolicy(params) {
	const typingPolicy = params.isHeartbeat ? "heartbeat" : params.originatingChannel === "webchat" ? "internal_webchat" : params.systemEvent ? "system_event" : params.requestedPolicy ?? "auto";
	return {
		typingPolicy,
		suppressTyping: params.suppressTyping === true || typingPolicy === "heartbeat" || typingPolicy === "system_event" || typingPolicy === "internal_webchat"
	};
}
//#endregion
export { shouldHandleFastReplyTextCommands as a, shouldUseReplyFastTestRuntime as c, stageRemoteInboundMediaIfNeeded as d, bindPreparedReplyDispatchRuntime as f, resolveGetReplyConfig as i, withFullRuntimeReplyConfig as l, buildFastReplyCommandContext as n, shouldUseReplyFastDirectiveExecution as o, getPreparedReplyDispatchRuntime as p, initFastReplySessionState as r, shouldUseReplyFastTestBootstrap as s, resolveRunTypingPolicy as t, resolveSessionResetCommand as u };
