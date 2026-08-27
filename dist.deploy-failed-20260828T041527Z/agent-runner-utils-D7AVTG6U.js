import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
import { p as resolveEffectiveModelFallbacks } from "./agent-scope-DigoIwHb.js";
import { i as normalizeChatChannelId } from "./ids-Cgp0iV_A.js";
import { n as resolveProviderIdForAuth } from "./provider-auth-aliases-BoHcdoGc.js";
import { S as selectApplicableRuntimeConfig, a as getRuntimeConfigSnapshot, c as getRuntimeConfigSourceSnapshot } from "./runtime-snapshot-Cv5MaU8U.js";
import "./registry-DbgR8dhg.js";
import { t as normalizeAnyChannelId } from "./registry-normalize-D2WRwH5s.js";
import "./config-B_0xOnKq.js";
import { t as normalizeChatType } from "./chat-type-CG0X_HJM.js";
import { t as getChannelPlugin } from "./registry-CZjiz1Jg.js";
import "./plugins-DYpQkXDD.js";
import { s as isReasoningTagProvider } from "./builtin-openclaw-BruFLvIP.js";
import { t as resolveFastModeState } from "./fast-mode-Dd78Dxbu.js";
import { t as resolveCommandSecretRefsViaGateway } from "./command-secret-gateway-PmjH1jWW.js";
import { f as getScopedChannelsCommandSecretTargets, n as getAgentRuntimeOptionalCommandSecretPaths, t as getAgentRuntimeCommandSecretTargetIds } from "./command-secret-targets-B3UG58Gq.js";
import { t as resolveMessageSecretScope } from "./message-secret-scope-Duxe5usd.js";
import { t as hasInboundAudio } from "./inbound-media-DouEFDOg.js";
import { t as resolveOriginMessageProvider } from "./origin-routing-Dv8H5khf.js";
import { n as readChannelSourceTurnId } from "./source-turn-id-qBM1Md8V.js";
//#region src/auto-reply/reply/agent-runner-auth-profile.ts
/** Keeps an auth profile only when the current provider shares the primary auth scope. */
function resolveProviderScopedAuthProfile(params) {
	const aliasParams = {
		config: params.config,
		workspaceDir: params.workspaceDir
	};
	const providerId = normalizeProviderId(params.provider);
	const primaryProviderId = normalizeProviderId(params.primaryProvider);
	const authProfileId = providerId !== "" && providerId === primaryProviderId || resolveProviderIdForAuth(params.provider, aliasParams) === resolveProviderIdForAuth(params.primaryProvider, aliasParams) ? params.authProfileId : void 0;
	return {
		authProfileId,
		authProfileIdSource: authProfileId ? params.authProfileIdSource : void 0
	};
}
/** Resolves the auth profile override for a queued follow-up run. */
function resolveRunAuthProfile(run, provider, params) {
	return resolveProviderScopedAuthProfile({
		provider,
		primaryProvider: run.provider,
		authProfileId: run.authProfileId,
		authProfileIdSource: run.authProfileIdSource,
		config: params?.config ?? run.config,
		workspaceDir: run.workspaceDir
	});
}
/** Applies an auto-fallback probe's pinned auth to its fallback candidate. */
function resolveFallbackCandidateRun(run, provider, model) {
	const probe = run.autoFallbackPrimaryProbe;
	const isPrimaryProbeCandidate = probe && provider === probe.provider && model === probe.model;
	if (!probe || provider !== probe.fallbackProvider || isPrimaryProbeCandidate || !probe.fallbackAuthProfileId) return run;
	const candidateRun = {
		...run,
		provider,
		model,
		authProfileId: probe.fallbackAuthProfileId
	};
	if (probe.fallbackAuthProfileIdSource) candidateRun.authProfileIdSource = probe.fallbackAuthProfileIdSource;
	else delete candidateRun.authProfileIdSource;
	return candidateRun;
}
//#endregion
//#region src/auto-reply/reply/agent-runner-run-params.ts
/** Builds embedded-agent run parameters from queued follow-up run state. */
/** Builds model fallback options for an embedded follow-up run. */
function resolveModelFallbackOptions(run, configOverride = run.config) {
	const config = configOverride;
	const fallbacksOverride = run.modelSelectionLocked ? [] : resolveEffectiveModelFallbacks({
		cfg: config,
		agentId: run.agentId,
		sessionKey: run.sessionKey,
		hasSessionModelOverride: run.hasSessionModelOverride === true,
		modelOverrideSource: run.modelOverrideSource,
		hasAutoFallbackProvenance: run.hasAutoFallbackProvenance === true
	});
	return {
		cfg: config,
		provider: run.provider,
		model: run.model,
		requestedRouteResolution: run.requestedRouteResolution,
		agentDir: run.agentDir,
		agentId: run.agentId,
		sessionKey: run.runtimePolicySessionKey ?? run.sessionKey,
		fallbacksOverride
	};
}
/** Resolves whether final-answer tags should be enforced for an embedded follow-up run. */
function resolveEnforceFinalTagWithResolver(run, provider, model, isReasoningTagProvider) {
	return (run.skipProviderRuntimeHints ? false : void 0) ?? (run.enforceFinalTag || isReasoningTagProvider?.(provider, {
		config: run.config,
		workspaceDir: run.workspaceDir,
		modelId: model
	}) || false);
}
/** Builds the shared embedded-agent run params from a queued follow-up run. */
function buildEmbeddedRunBaseParams$1(params) {
	const config = params.run.config;
	const modelFallbacksOverride = params.run.modelSelectionLocked ? [] : resolveEffectiveModelFallbacks({
		cfg: config,
		agentId: params.run.agentId,
		sessionKey: params.run.sessionKey,
		hasSessionModelOverride: params.run.hasSessionModelOverride === true,
		modelOverrideSource: params.run.modelOverrideSource,
		hasAutoFallbackProvenance: params.run.hasAutoFallbackProvenance === true
	});
	const enforceFinalTag = resolveEnforceFinalTagWithResolver(params.run, params.provider, params.model, params.isReasoningTagProvider);
	return {
		sessionFile: params.run.sessionFile,
		workspaceDir: params.run.workspaceDir,
		cwd: params.run.cwd,
		permissionMode: params.run.permissionMode,
		sessionRoot: params.run.sessionRoot,
		agentDir: params.run.agentDir,
		config,
		toolOverrides: params.run.toolOverrides,
		skillsSnapshot: params.run.skillsSnapshot,
		ownerNumbers: params.run.ownerNumbers,
		inputProvenance: params.run.inputProvenance,
		trustedInternalHandoff: params.run.trustedInternalHandoff,
		scheduledToolPolicy: params.run.scheduledToolPolicy,
		runtimePluginToolGrant: params.run.runtimePluginToolGrant,
		senderIsOwner: params.run.senderIsOwner,
		conversationToolPolicy: params.run.conversationToolPolicy,
		channelContext: params.run.channelContext,
		approvalReviewerDeviceId: params.run.approvalReviewerDeviceId,
		enforceFinalTag,
		silentExpected: params.run.silentExpected,
		allowEmptyAssistantReplyAsSilent: params.run.allowEmptyAssistantReplyAsSilent,
		terminalReplyExpectation: params.run.terminalReplyExpectation,
		silentReplyPromptMode: params.run.silentReplyPromptMode,
		sourceReplyDeliveryMode: params.run.sourceReplyDeliveryMode,
		clientCaps: params.run.clientCaps,
		toolBindings: params.run.toolBindings,
		taskSuggestionDeliveryMode: params.run.taskSuggestionDeliveryMode,
		skillWorkshopProposalRevision: params.run.skillWorkshopProposalRevision,
		provider: params.provider,
		model: params.model,
		modelSelectionLocked: params.run.modelSelectionLocked,
		modelFallbacksOverride,
		...params.authProfile,
		thinkLevel: params.run.thinkLevel,
		fastMode: params.run.fastMode,
		fastModeAutoOnSeconds: params.run.fastModeAutoOnSeconds,
		verboseLevel: params.run.verboseLevel,
		reasoningLevel: params.run.reasoningLevel,
		execOverrides: params.run.execOverrides,
		bashElevated: params.run.bashElevated,
		timeoutMs: params.run.timeoutMs,
		runId: params.runId,
		promptCacheKey: params.promptCacheKey,
		allowTransientCooldownProbe: params.allowTransientCooldownProbe
	};
}
//#endregion
//#region src/auto-reply/reply/agent-runner-utils.ts
/** Utilities for queued reply runtime config, auth, threading, and embedded run params. */
const BUN_FETCH_SOCKET_ERROR_RE = /socket connection was closed unexpectedly/i;
/** Selects the freshest runtime config usable by queued reply execution. */
function resolveQueuedReplyRuntimeConfig(config) {
	return selectApplicableRuntimeConfig({
		inputConfig: config,
		runtimeConfig: typeof getRuntimeConfigSnapshot === "function" ? getRuntimeConfigSnapshot() : null,
		runtimeSourceConfig: typeof getRuntimeConfigSourceSnapshot === "function" ? getRuntimeConfigSourceSnapshot() : null
	}) ?? config;
}
/** Resolves command secrets for queued reply execution, scoped to the origin route. */
async function resolveQueuedReplyExecutionConfig(config, params) {
	const runtimeConfig = resolveQueuedReplyRuntimeConfig(config);
	const { resolvedConfig } = await resolveCommandSecretRefsViaGateway({
		config: runtimeConfig,
		commandName: "reply",
		targetIds: getAgentRuntimeCommandSecretTargetIds(),
		optionalActivePaths: getAgentRuntimeOptionalCommandSecretPaths(runtimeConfig)
	});
	const baseResolvedConfig = resolvedConfig ?? runtimeConfig;
	const scope = resolveMessageSecretScope({
		channel: params?.originatingChannel,
		fallbackChannel: params?.messageProvider,
		accountId: params?.originatingAccountId,
		fallbackAccountId: params?.agentAccountId
	});
	if (!scope.channel) return baseResolvedConfig;
	const scopedTargets = getScopedChannelsCommandSecretTargets({
		config: baseResolvedConfig,
		channel: scope.channel,
		accountId: scope.accountId
	});
	if (scopedTargets.targetIds.size === 0) return baseResolvedConfig;
	return (await resolveCommandSecretRefsViaGateway({
		config: baseResolvedConfig,
		commandName: "reply",
		targetIds: scopedTargets.targetIds,
		...scopedTargets.allowedPaths ? { allowedPaths: scopedTargets.allowedPaths } : {}
	})).resolvedConfig ?? baseResolvedConfig;
}
/**
* Build provider-specific threading context for tool auto-injection.
*/
/** Builds channel threading context for message-tool replies. */
function buildThreadingToolContext(params) {
	const { sessionCtx, config, hasRepliedRef } = params;
	const currentMessageId = sessionCtx.InputProvenance?.kind === "internal_system" && sessionCtx.InputProvenance.sourceTool === "restart-sentinel" ? sessionCtx.ReplyToId : sessionCtx.MessageSidFull ?? sessionCtx.MessageSid;
	const currentSourceTurnId = readChannelSourceTurnId(sessionCtx);
	const originProvider = resolveOriginMessageProvider({
		originatingChannel: sessionCtx.OriginatingChannel,
		provider: sessionCtx.Provider
	});
	const originTo = sessionCtx.OriginatingTo ?? sessionCtx.To;
	if (!config) return {
		currentMessageId,
		currentSourceTurnId,
		replyToMode: sessionCtx.ReplyToMode
	};
	const rawProvider = normalizeOptionalLowercaseString(originProvider);
	if (!rawProvider) return {
		currentMessageId,
		currentSourceTurnId,
		replyToMode: sessionCtx.ReplyToMode
	};
	const provider = normalizeChatChannelId(rawProvider) ?? normalizeAnyChannelId(rawProvider);
	const threading = provider ? getChannelPlugin(provider)?.threading : void 0;
	if (!threading?.buildToolContext) return {
		currentChannelId: normalizeOptionalString(originTo),
		currentChannelProvider: provider ?? rawProvider,
		currentMessageId,
		currentSourceTurnId,
		replyToMode: sessionCtx.ReplyToMode,
		hasRepliedRef
	};
	const context = threading.buildToolContext({
		cfg: config,
		accountId: sessionCtx.AccountId,
		context: {
			Channel: originProvider,
			From: sessionCtx.From,
			To: originTo,
			ChatType: sessionCtx.ChatType,
			CurrentMessageId: currentMessageId,
			ReplyToMode: sessionCtx.ReplyToMode,
			ReplyToId: sessionCtx.ReplyToId,
			ReplyToIdFull: sessionCtx.ReplyToIdFull,
			ThreadLabel: sessionCtx.ThreadLabel,
			MessageThreadId: sessionCtx.MessageThreadId,
			TransportThreadId: sessionCtx.TransportThreadId,
			NativeChannelId: sessionCtx.NativeChannelId
		},
		hasRepliedRef
	}) ?? {};
	const hasAdapterCurrentMessageId = Object.hasOwn(context, "currentMessageId");
	return {
		...context,
		currentChannelProvider: provider,
		currentMessageId: hasAdapterCurrentMessageId ? context.currentMessageId : currentMessageId,
		currentSourceTurnId,
		replyToMode: context.replyToMode ?? sessionCtx.ReplyToMode
	};
}
/** Detects Bun socket-close errors that should be formatted more clearly. */
const isBunFetchSocketError = (message) => message ? BUN_FETCH_SOCKET_ERROR_RE.test(message) : false;
/** Formats Bun socket-close errors for user-facing reply output. */
const formatBunFetchSocketError = (message) => {
	return [
		"⚠️ LLM connection failed. This could be due to server issues, network problems, or context length exceeded (e.g., with local LLMs like LM Studio). Original error:",
		"```",
		message.trim() || "Unknown error",
		"```"
	].join("\n");
};
/** Resolves candidate-scoped fast mode after model fallback changes provider/model. */
function resolveRunFastModeForFallbackCandidate(params) {
	const state = resolveFastModeState({
		cfg: params.config,
		provider: params.provider,
		model: params.model,
		agentId: params.run.agentId,
		sessionEntry: params.sessionEntry
	});
	if (params.run.fastModeOverride) return {
		fastMode: params.run.fastMode,
		fastModeAutoOnSeconds: params.run.fastModeAutoOnSecondsOverride ? params.run.fastModeAutoOnSeconds : state.fastAutoOnSeconds
	};
	return {
		fastMode: state.mode,
		fastModeAutoOnSeconds: params.run.fastModeAutoOnSecondsOverride ? params.run.fastModeAutoOnSeconds : state.fastAutoOnSeconds
	};
}
/** Builds base embedded run params with auth and provider runtime hints. */
function buildEmbeddedRunBaseParams(params) {
	return buildEmbeddedRunBaseParams$1({
		...params,
		isReasoningTagProvider
	});
}
function buildEmbeddedContextFromTemplate(params) {
	const config = params.run.config;
	const sessionCtx = {
		...params.sessionCtx,
		OriginatingChannel: params.replyRoute?.originatingChannel ?? params.sessionCtx.OriginatingChannel,
		OriginatingTo: params.replyRoute?.originatingTo ?? params.sessionCtx.OriginatingTo,
		AccountId: params.replyRoute?.originatingAccountId ?? params.sessionCtx.AccountId ?? params.run.agentAccountId,
		ChatType: normalizeChatType(params.replyRoute?.originatingChatType) ?? normalizeChatType(params.sessionCtx.ChatType) ?? params.run.chatType,
		MessageThreadId: params.replyRoute?.originatingThreadId ?? params.sessionCtx.MessageThreadId,
		ReplyToId: params.replyRoute?.originatingReplyToId ?? params.sessionCtx.ReplyToId,
		ReplyToMode: params.replyRoute?.originatingReplyToMode ?? params.sessionCtx.ReplyToMode
	};
	return {
		sessionId: params.run.sessionId,
		sessionKey: params.run.sessionKey,
		sandboxSessionKey: params.run.runtimePolicySessionKey,
		agentId: params.run.agentId,
		messageProvider: resolveOriginMessageProvider({
			originatingChannel: sessionCtx.OriginatingChannel,
			provider: sessionCtx.Provider
		}),
		...sessionCtx.ChatType ? { chatType: sessionCtx.ChatType } : {},
		agentAccountId: sessionCtx.AccountId,
		messageTo: sessionCtx.OriginatingTo ?? sessionCtx.To,
		messageThreadId: sessionCtx.MessageThreadId ?? void 0,
		chatId: normalizeOptionalString(sessionCtx.NativeChannelId) ?? normalizeOptionalString(sessionCtx.ChatId),
		memberRoleIds: normalizeMemberRoleIds(sessionCtx.MemberRoleIds),
		...buildThreadingToolContext({
			sessionCtx,
			config,
			hasRepliedRef: params.hasRepliedRef
		}),
		currentInboundAudio: hasInboundAudio(sessionCtx)
	};
}
function normalizeMemberRoleIds(value) {
	const roles = Array.isArray(value) ? value.map((roleId) => normalizeOptionalString(roleId)).filter((roleId) => Boolean(roleId)) : [];
	return roles.length > 0 ? roles : void 0;
}
function buildTemplateSenderContext(sessionCtx) {
	return {
		senderId: normalizeOptionalString(sessionCtx.SenderId),
		channelContext: sessionCtx.ChannelContext,
		senderName: normalizeOptionalString(sessionCtx.SenderName),
		senderUsername: normalizeOptionalString(sessionCtx.SenderUsername),
		senderE164: normalizeOptionalString(sessionCtx.SenderE164)
	};
}
/** Builds execution-specific embedded run params for queued reply dispatch. */
function buildEmbeddedRunExecutionParams(params) {
	const authProfile = resolveRunAuthProfile(params.run, params.provider);
	return {
		embeddedContext: buildEmbeddedContextFromTemplate({
			run: params.run,
			replyRoute: params.replyRoute,
			sessionCtx: params.sessionCtx,
			hasRepliedRef: params.hasRepliedRef
		}),
		senderContext: buildTemplateSenderContext(params.sessionCtx),
		runBaseParams: buildEmbeddedRunBaseParams({
			run: params.run,
			provider: params.provider,
			model: params.model,
			runId: params.runId,
			promptCacheKey: params.promptCacheKey,
			authProfile,
			allowTransientCooldownProbe: params.allowTransientCooldownProbe
		})
	};
}
//#endregion
export { resolveQueuedReplyExecutionConfig as a, resolveModelFallbackOptions as c, isBunFetchSocketError as i, resolveFallbackCandidateRun as l, buildThreadingToolContext as n, resolveQueuedReplyRuntimeConfig as o, formatBunFetchSocketError as r, resolveRunFastModeForFallbackCandidate as s, buildEmbeddedRunExecutionParams as t, resolveRunAuthProfile as u };
