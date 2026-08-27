import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.js";
import { r as formatAcpErrorChain } from "./errors-CIvv7cvF.js";
import { c as redactSensitiveText } from "./redact-Cl7lwBnl.js";
import { c as resolveUserPath } from "./home-dir-DcrXWQPU.js";
import "./utils-DEqefz4f.js";
import { t as sanitizeForLog } from "./ansi-DjDeieuH.js";
import { C as resolveSessionAuthProfileOverrideSource } from "./agent-scope-BizOtGGz.js";
import { a as isSubagentSessionKey } from "./session-key-utils-D8x_bjrd.js";
import { o as emitTrustedDiagnosticEvent } from "./diagnostic-events-Djn4AVRp.js";
import { t as createSubsystemLogger } from "./subsystem-CDLhGl2-.js";
import { n as isToolAllowedByPolicies, t as isRuntimeToolAllowed } from "./tool-policy-match-CEXvGj1C.js";
import { u as resolveOpenAIRuntimeProvider } from "./openai-routing-BGuHAkXI.js";
import { i as emitAgentEvent, r as emitAgentAuditEvent } from "./agent-events-Cmj8toCy.js";
import { i as resolveAuthProfileOrder } from "./order-jGX4iJ3y.js";
import { at as getCliSessionBinding, w as persistSessionTranscriptTurn } from "./session-accessor-Bi6bzKQE.js";
import "./message-channel-T4W5YOto.js";
import { r as ensureAuthProfileStore } from "./store-BH6qiWJF.js";
import { i as buildUsageWithNoCost } from "./stream-message-shared-Cyrn1UHN.js";
import { i as resolveCliBackendConfig } from "./cli-backends-Ap-awZem.js";
import { s as resolveCliRuntimeExecutionProvider } from "./model-runtime-aliases-HmfG8BuO.js";
import { t as isCliProvider } from "./model-selection-cli-DsoAow-_.js";
import "./model-selection-Dg63KcCa.js";
import { n as cliBackendAcceptsAuthProfileForwarding, r as resolveCliExecutionAuthProfileId } from "./cli-execution-auth-CqsrYCFO.js";
import { t as buildAgentRuntimeAuthPlan } from "./auth-MvPINxZs.js";
import "./errors-DZb6J9ws.js";
import "./manager.turn-timeout-h9nNYDaU.js";
import { m as resolveAgentRunAbortLifecycleFields } from "./run-termination-B0y7ra5H.js";
import { i as getGeneratedMediaTaskIdsForSessionKey, o as hasNewGeneratedMediaTaskForSessionKey } from "./task-status-access-CmX3QA7J.js";
import { r as annotateInterSessionPromptText } from "./input-provenance-BA6fPshG.js";
import { n as resolveSandboxRuntimeStatus } from "./runtime-status-DwfYu5UM.js";
import { U as injectTimestamp, W as timestampOptsFromConfig } from "./builtin-openclaw-B7zVdTs_.js";
import { n as normalizeReplyPayload } from "./normalize-reply--NSgVK7M.js";
import { n as runAgentHarnessBeforeMessageWriteHook } from "./hook-helpers-iH4TEUnM.js";
import { i as isTrustedSubagentCompletionHandoffForRun, r as isSubagentAnnounceCompletionHandoff, t as hasVerifiedRequesterCompletionHandoff } from "./requester-tool-policy-CwUL8hn9.js";
import { t as resolveConversationCapabilityProfile } from "./conversation-capability-profile-jN4PguVr.js";
import { s as resolveBootstrapWarningSignaturesSeen } from "./bootstrap-budget-BjndRqg9.js";
import { t as DEFAULT_MAX_LIVE_TOOL_RESULT_CHARS } from "./tool-result-limits-DISobJ_J.js";
import { r as buildPersistedUserTurnMessage, s as preparePersistedUserTurnMessageForTranscriptWrite } from "./user-turn-transcript-BVy1mkbt.js";
import { a as messageToolOwnsVisibleReply } from "./local-model-lean-BMyyuL8b.js";
import { r as resolveConversationToolPolicies } from "./conversation-tool-policy-pipeline-4ugqRa_4.js";
import { r as resolveCliSessionClearReason, s as shouldClearFailedCliSessionBinding } from "./cli-session-BMkhQ-yp.js";
import { i as resolveAvailableAgentHarnessPolicy } from "./selection-CwGHsBVN.js";
import { a as setChannelSourceTurnSameThreadRequired, i as setChannelSourceTurnId, n as readChannelSourceTurnId, r as readChannelSourceTurnSameThreadRequired } from "./source-turn-id-BnVTXtrn.js";
import "./run-context-rDNqB6D8.js";
import { r as withLocalSessionPlacementTurnAdmission } from "./session-placement-admission-CG0soa0B.js";
import { t as runEmbeddedAgent } from "./embedded-agent-B-4M60T9.js";
import { n as resolveCliRuntimeToolsAllow } from "./tool-policy-DbdtO-eX.js";
import { a as resizeExecApprovalContinuationPrompt } from "./bash-tools.exec-approval-output-CMOkHvfh.js";
import { u as hasClaudeSession } from "./claude-live-registry-DvemukXn.js";
import { l as buildClaudeCliFallbackContextPrelude, p as resolveFallbackRetryPrompt, u as claudeCliSessionTranscriptHasContent } from "./session-history-D4e3ZFCN.js";
import { n as runCliAgent } from "./cli-runner-BAkJz_Uv.js";
import { t as resolveAcpToolTerminalOutcome } from "./tool-status-CyYVXMyT.js";
import { a as restoreCliSessionForkInStore, n as consumeCliSessionForkInStore, r as persistCliSessionForkSuccessorInStore, t as clearCliSessionInStore } from "./session-store-CXDk1Jvg.js";
//#region src/agents/command/attempt-execution.ts
const log = createSubsystemLogger("agents/agent-command");
function rebaseExecApprovalContinuationPromptRange(params) {
	if (!params.range) return;
	if (!params.prompt.endsWith(params.body)) throw new Error("exec approval continuation prompt range could not be rebased");
	const offset = params.prompt.length - params.body.length;
	return {
		start: offset + params.range.start,
		end: offset + params.range.end
	};
}
const ACP_TRANSCRIPT_USAGE = {
	input: 0,
	output: 0,
	cacheRead: 0,
	cacheWrite: 0,
	totalTokens: 0,
	cost: {
		input: 0,
		output: 0,
		cacheRead: 0,
		cacheWrite: 0,
		total: 0
	}
};
const CLI_TRANSCRIPT_UNAVAILABLE_USAGE = {
	input: 0,
	output: 0,
	cacheRead: 0,
	cacheWrite: 0,
	total: 0,
	contextUsage: { state: "unavailable" }
};
function resolveCliTranscriptUsage(usage) {
	if (!usage) return CLI_TRANSCRIPT_UNAVAILABLE_USAGE;
	if (usage.contextUsage) return usage;
	const promptTokens = (usage.input ?? 0) + (usage.cacheRead ?? 0) + (usage.cacheWrite ?? 0);
	return {
		...usage,
		contextUsage: promptTokens > 0 ? {
			state: "available",
			promptTokens,
			totalTokens: promptTokens + (usage.output ?? 0)
		} : { state: "unavailable" }
	};
}
function shouldSuppressEmbeddedLiveStreamOutput(params) {
	return params.opts.sessionEffects === "internal" && params.opts.deliver !== true;
}
function resolveProfileAuthFromStore(params) {
	const profileId = params.profileId?.trim();
	if (!profileId) return {};
	const credential = ensureAuthProfileStore(params.agentDir, {
		allowKeychainPrompt: false,
		externalCliProfileIds: [profileId]
	}).profiles[profileId];
	return {
		provider: credential?.provider,
		mode: credential?.type
	};
}
function resolveHarnessAuthProfileSelection(params) {
	const sessionAuthProfileId = params.sessionAuthProfileId?.trim();
	if (sessionAuthProfileId) {
		const profileAuth = resolveProfileAuthFromStore({
			agentDir: params.agentDir,
			profileId: sessionAuthProfileId
		});
		return {
			authProfileId: sessionAuthProfileId,
			authProfileIdSource: params.sessionAuthProfileSource,
			authProfileProvider: profileAuth.provider ?? params.authProfileProvider,
			authProfileMode: profileAuth.mode
		};
	}
	if (!params.allowHarnessAuthProfileForwarding) return { authProfileProvider: params.authProfileProvider };
	const harnessAuthProvider = buildAgentRuntimeAuthPlan({
		provider: params.provider,
		authProfileProvider: params.authProfileProvider,
		config: params.config,
		workspaceDir: params.workspaceDir,
		...params.metadataSnapshot ? { metadataSnapshot: params.metadataSnapshot } : {},
		providerAuthAliasesEnabled: params.providerAuthAliasesEnabled,
		harnessId: params.harnessId,
		harnessRuntime: params.harnessRuntime,
		allowHarnessAuthProfileForwarding: params.allowHarnessAuthProfileForwarding
	}).harnessAuthProvider;
	if (!harnessAuthProvider) return { authProfileProvider: params.authProfileProvider };
	const store = ensureAuthProfileStore(params.agentDir, {
		allowKeychainPrompt: false,
		externalCliProviderIds: [harnessAuthProvider]
	});
	const authProfileId = resolveAuthProfileOrder({
		cfg: params.config,
		store,
		provider: harnessAuthProvider
	})[0];
	return authProfileId ? {
		authProfileId,
		authProfileIdSource: "auto",
		authProfileProvider: harnessAuthProvider
	} : { authProfileProvider: params.authProfileProvider };
}
function resolveTranscriptUsage(usage) {
	if (!usage) return ACP_TRANSCRIPT_USAGE;
	const resolved = buildUsageWithNoCost({
		input: usage.input,
		output: usage.output,
		cacheRead: usage.cacheRead,
		cacheWrite: usage.cacheWrite,
		totalTokens: usage.total
	});
	return usage.contextUsage ? {
		...resolved,
		contextUsage: usage.contextUsage
	} : resolved;
}
async function persistTextTurnTranscript(params) {
	const promptText = params.transcriptBody ?? params.body;
	const replyText = params.skipAssistantTurn === true ? "" : params.finalText;
	const userMessage = params.userMessage ?? (promptText ? {
		role: "user",
		content: promptText,
		timestamp: Date.now()
	} : void 0);
	if (!userMessage && !replyText) return {
		kind: "persisted",
		sessionEntry: params.sessionEntry
	};
	const messages = [];
	if (userMessage) messages.push({
		message: userMessage,
		idempotencyLookup: "scan",
		prepareMessageAfterIdempotencyCheck: (message) => preparePersistedUserTurnMessageForTranscriptWrite(message, {
			agentId: params.sessionAgentId,
			sessionKey: params.sessionKey,
			beforeMessageWrite: runAgentHarnessBeforeMessageWriteHook
		})
	});
	if (replyText) messages.push({ message: {
		role: "assistant",
		content: [{
			type: "text",
			text: replyText
		}],
		api: params.assistant.api,
		provider: params.assistant.provider,
		model: params.assistant.model,
		usage: resolveTranscriptUsage(params.assistant.usage),
		stopReason: "stop",
		timestamp: Date.now()
	} });
	const turn = await persistSessionTranscriptTurn({
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		sessionFile: params.sessionFile,
		sessionEntry: params.sessionEntry,
		sessionStore: params.sessionStore,
		storePath: params.storePath,
		agentId: params.sessionAgentId,
		threadId: params.threadId
	}, {
		config: params.config,
		cwd: params.sessionCwd,
		messages,
		publishWhen: "always",
		touchSessionEntry: true,
		updateMode: "file-only",
		...params.sessionStore && params.storePath ? { expectedSessionId: params.sessionId } : {}
	});
	if (turn.rejectedReason === "session-rebound") return {
		kind: "session-rebound",
		sessionEntry: void 0
	};
	return {
		kind: "persisted",
		sessionEntry: turn.sessionEntry
	};
}
function resolveCliTranscriptReplyText(result) {
	const visibleText = result.meta.finalAssistantVisibleText?.trim();
	if (visibleText) return visibleText;
	return (result.payloads ?? []).filter((payload) => !payload.isError && !payload.isReasoning).map((payload) => payload.text?.trim() ?? "").filter(Boolean).join("\n\n");
}
function isClaudeCliProvider(provider) {
	return provider.trim().toLowerCase() === "claude-cli";
}
async function persistAcpTurnTranscript(params) {
	return await persistTextTurnTranscript({
		...params,
		...params.userInput ? { userMessage: buildPersistedUserTurnMessage(params.userInput) } : {},
		assistant: {
			api: "openai-responses",
			provider: "openclaw",
			model: "acp-runtime"
		}
	});
}
async function persistCliTurnTranscript(params) {
	const { result, skipUserTurn: requestedSkipUserTurn, ...transcript } = params;
	const replyText = resolveCliTranscriptReplyText(result);
	const provider = result.meta.agentMeta?.provider?.trim() ?? "cli";
	const model = result.meta.agentMeta?.model?.trim() ?? "default";
	const skipUserTurn = requestedSkipUserTurn === true;
	return await persistTextTurnTranscript({
		...transcript,
		body: skipUserTurn ? "" : transcript.body,
		transcriptBody: skipUserTurn ? void 0 : transcript.transcriptBody,
		userMessage: skipUserTurn ? void 0 : transcript.userMessage,
		finalText: replyText,
		assistant: {
			api: "cli",
			provider,
			model,
			usage: resolveCliTranscriptUsage(result.meta.agentMeta?.lastCallUsage)
		}
	});
}
function runAgentAttempt(params) {
	const sessionAuthProfileId = params.sessionEntry?.authProfileOverride?.trim();
	const sessionAuthProfileSource = resolveSessionAuthProfileOverrideSource(params.sessionEntry);
	const selectedAuthProfile = sessionAuthProfileId && sessionAuthProfileSource !== "auto" ? {
		id: sessionAuthProfileId,
		source: sessionAuthProfileSource
	} : params.configuredAuthProfileId?.trim() ? {
		id: params.configuredAuthProfileId.trim(),
		source: "user"
	} : sessionAuthProfileId ? {
		id: sessionAuthProfileId,
		source: sessionAuthProfileSource
	} : void 0;
	const isRawModelRun = params.opts.modelRun === true || params.opts.promptMode === "none";
	const isSubagentAnnounceHandoff = isSubagentAnnounceCompletionHandoff({
		inputProvenance: params.opts.inputProvenance,
		internalEvents: params.opts.internalEvents
	});
	const trustedSubagentAnnounceHandoff = isSubagentAnnounceHandoff && isTrustedSubagentCompletionHandoffForRun({
		handoff: params.opts.trustedInternalHandoff,
		inputProvenance: params.opts.inputProvenance,
		internalEvents: params.opts.internalEvents,
		sessionKey: params.sessionKey,
		sessionId: params.sessionId,
		provider: params.providerOverride,
		model: params.modelOverride
	}) && hasVerifiedRequesterCompletionHandoff({
		config: params.cfg,
		sessionKey: params.sessionKey,
		inputProvenance: params.opts.inputProvenance,
		trustedInternalHandoff: params.opts.trustedInternalHandoff,
		sessionId: params.sessionId,
		modelProvider: params.providerOverride,
		modelId: params.modelOverride
	});
	const completionRequestsMessageDelivery = trustedSubagentAnnounceHandoff && !isRawModelRun && params.opts.disableMessageTool !== true && messageToolOwnsVisibleReply(params.opts);
	const completionSandboxStatus = completionRequestsMessageDelivery ? resolveSandboxRuntimeStatus({
		cfg: params.cfg,
		sessionKey: params.sessionKey,
		agentId: params.sessionAgentId
	}) : void 0;
	const completionCapabilityProfile = completionRequestsMessageDelivery ? resolveConversationCapabilityProfile({
		config: params.cfg,
		sessionKey: params.sessionKey,
		sessionId: params.sessionId,
		agentId: params.sessionAgentId,
		senderId: params.runContext.senderId,
		modelProvider: params.providerOverride,
		modelId: params.modelOverride,
		sandboxToolPolicy: completionSandboxStatus?.sandboxed ? completionSandboxStatus.toolPolicy : void 0,
		inputProvenance: params.opts.inputProvenance,
		trustedInternalHandoff: params.opts.trustedInternalHandoff
	}) : void 0;
	const completionToolPolicies = completionCapabilityProfile ? resolveConversationToolPolicies({
		capabilityProfile: completionCapabilityProfile,
		additionalProfileAllow: ["message"],
		additionalPolicyAllow: ["message"],
		additionalInheritedAllow: ["message"]
	}) : void 0;
	const completionNeedsMessageDelivery = completionCapabilityProfile?.policy.requesterPolicySource === "completion-handoff" && completionToolPolicies !== void 0 && isToolAllowedByPolicies("message", Object.values(completionToolPolicies)) && isRuntimeToolAllowed("message", params.opts.toolsAllow);
	const claudeCliFallbackPrelude = !isRawModelRun && params.isFallbackRetry && isClaudeCliProvider(params.originalProvider) && !isClaudeCliProvider(params.providerOverride) ? buildClaudeCliFallbackContextPrelude({ cliSessionId: getCliSessionBinding(params.sessionEntry, "claude-cli")?.sessionId }) : "";
	const resolvedPrompt = resolveFallbackRetryPrompt({
		body: params.body,
		isFallbackRetry: params.isFallbackRetry,
		sessionHasHistory: params.sessionHasHistory,
		priorContextPrelude: claudeCliFallbackPrelude
	});
	const effectivePrompt = isRawModelRun ? resolvedPrompt : annotateInterSessionPromptText(resolvedPrompt, params.opts.inputProvenance);
	const embeddedExecApprovalContinuationPromptRange = rebaseExecApprovalContinuationPromptRange({
		body: params.body,
		prompt: effectivePrompt,
		range: params.opts.execApprovalContinuationPromptRange
	});
	const continuationTranscriptBody = params.opts.execApprovalContinuationPromptRange ? params.transcriptBody ?? params.body : params.transcriptBody;
	const continuationTranscriptPromptRange = params.opts.execApprovalContinuationTranscriptPromptRange ?? params.opts.execApprovalContinuationPromptRange;
	const bootstrapPromptWarningSignaturesSeen = resolveBootstrapWarningSignaturesSeen(params.sessionEntry?.systemPromptReport);
	const bootstrapPromptWarningSignature = bootstrapPromptWarningSignaturesSeen[bootstrapPromptWarningSignaturesSeen.length - 1];
	const requestedAgentHarnessId = isRawModelRun ? "openclaw" : void 0;
	const sessionRuntimeOverride = isRawModelRun ? void 0 : params.agentHarnessRuntimeOverride;
	const locksSessionRuntimeOverride = sessionRuntimeOverride !== void 0 && params.sessionEntry?.modelSelectionLocked === true;
	const sessionCliRuntime = sessionRuntimeOverride && !locksSessionRuntimeOverride && isCliProvider(sessionRuntimeOverride, params.cfg) ? sessionRuntimeOverride : void 0;
	const configuredCliRuntime = !isRawModelRun && !sessionRuntimeOverride ? resolveCliRuntimeExecutionProvider({
		provider: params.providerOverride,
		cfg: params.cfg,
		agentId: params.sessionAgentId,
		modelId: params.modelOverride,
		authProfileId: selectedAuthProfile?.id
	}) : void 0;
	const cliExecutionProvider = isRawModelRun ? params.providerOverride : sessionCliRuntime ?? configuredCliRuntime ?? params.providerOverride;
	const isCliExecutionProvider = sessionRuntimeOverride ? sessionCliRuntime !== void 0 : isCliProvider(cliExecutionProvider, params.cfg);
	const completionRetainsRequesterTools = trustedSubagentAnnounceHandoff && !isRawModelRun && !isCliExecutionProvider && (!messageToolOwnsVisibleReply(params.opts) || completionNeedsMessageDelivery);
	const runtimeToolsAllow = isSubagentAnnounceHandoff ? completionRetainsRequesterTools ? params.opts.toolsAllow : completionNeedsMessageDelivery ? ["message"] : void 0 : params.opts.toolsAllow;
	const disableTools = params.opts.modelRun === true || isSubagentAnnounceHandoff && !completionRetainsRequesterTools && !completionNeedsMessageDelivery;
	if (params.fallbackRuntimeState && params.fallbackRuntimeState.originRuntime === void 0) params.fallbackRuntimeState.originRuntime = !isRawModelRun && isCliExecutionProvider ? "cli" : "embedded";
	const shouldForwardImagesToEmbedded = !params.isFallbackRetry || params.fallbackRuntimeState?.originRuntime === "cli";
	const allowCliAuthProfileForwarding = isCliExecutionProvider && cliBackendAcceptsAuthProfileForwarding({
		provider: cliExecutionProvider,
		config: params.cfg,
		agentId: params.sessionAgentId
	});
	const agentHarnessPolicy = isRawModelRun ? {
		runtime: "openclaw",
		runtimeSource: "model"
	} : sessionRuntimeOverride ? {
		runtime: sessionRuntimeOverride,
		runtimeSource: "model"
	} : resolveAvailableAgentHarnessPolicy({
		provider: params.providerOverride,
		modelId: params.modelOverride,
		config: params.cfg,
		agentId: params.sessionAgentId,
		sessionKey: params.sessionKey ?? params.sessionId
	});
	const harnessAuthSelection = resolveHarnessAuthProfileSelection({
		config: params.cfg,
		agentDir: params.agentDir,
		workspaceDir: params.workspaceDir,
		provider: params.providerOverride,
		authProfileProvider: params.authProfileProvider,
		sessionAuthProfileId: selectedAuthProfile?.id,
		sessionAuthProfileSource: selectedAuthProfile?.source,
		harnessId: requestedAgentHarnessId,
		harnessRuntime: agentHarnessPolicy.runtime,
		...params.metadataSnapshot ? { metadataSnapshot: params.metadataSnapshot } : {},
		providerAuthAliasesEnabled: params.pluginsEnabled,
		allowHarnessAuthProfileForwarding: !isCliExecutionProvider
	});
	const runtimeAuthPlan = buildAgentRuntimeAuthPlan({
		provider: params.providerOverride,
		authProfileProvider: harnessAuthSelection.authProfileProvider,
		authProfileMode: harnessAuthSelection.authProfileMode,
		sessionAuthProfileId: harnessAuthSelection.authProfileId,
		config: params.cfg,
		workspaceDir: params.workspaceDir,
		...params.metadataSnapshot ? { metadataSnapshot: params.metadataSnapshot } : {},
		providerAuthAliasesEnabled: params.pluginsEnabled,
		harnessId: requestedAgentHarnessId,
		harnessRuntime: agentHarnessPolicy.runtime,
		allowHarnessAuthProfileForwarding: !isCliExecutionProvider
	});
	const cliAuthProfileId = allowCliAuthProfileForwarding ? resolveCliExecutionAuthProfileId({
		cliExecutionProvider,
		authProfileProvider: params.authProfileProvider,
		config: params.cfg,
		agentDir: params.agentDir,
		selected: harnessAuthSelection
	}) : void 0;
	const authProfileId = allowCliAuthProfileForwarding ? cliAuthProfileId : runtimeAuthPlan.forwardedAuthProfileId;
	const embeddedAgentProvider = resolveOpenAIRuntimeProvider({
		provider: params.providerOverride,
		harnessRuntime: agentHarnessPolicy.runtime,
		agentHarnessId: requestedAgentHarnessId,
		authProfileProvider: runtimeAuthPlan.authProfileProviderForAuth,
		authProfileId,
		config: params.cfg,
		workspaceDir: params.workspaceDir
	});
	const embeddedAgentHarnessOverride = requestedAgentHarnessId ?? sessionRuntimeOverride ?? (agentHarnessPolicy.runtime === "openclaw" && agentHarnessPolicy.runtimeSource !== "implicit" ? "openclaw" : void 0);
	if (!isRawModelRun && isCliExecutionProvider) {
		const cliSessionBinding = getCliSessionBinding(params.sessionEntry, cliExecutionProvider);
		const cliProcessCwd = params.cwd ? resolveUserPath(params.cwd) : params.workspaceDir;
		const cliContinuationBody = params.opts.execApprovalContinuationPromptRange ? resizeExecApprovalContinuationPrompt({
			prompt: params.body,
			range: params.opts.execApprovalContinuationPromptRange,
			maxOutputUtf16Units: DEFAULT_MAX_LIVE_TOOL_RESULT_CHARS
		}) : params.body;
		const cliResolvedPrompt = params.opts.execApprovalContinuationPromptRange ? resolveFallbackRetryPrompt({
			body: cliContinuationBody,
			isFallbackRetry: params.isFallbackRetry,
			sessionHasHistory: params.sessionHasHistory,
			priorContextPrelude: claudeCliFallbackPrelude
		}) : resolvedPrompt;
		const cliEffectivePrompt = params.opts.execApprovalContinuationPromptRange ? annotateInterSessionPromptText(cliResolvedPrompt, params.opts.inputProvenance) : effectivePrompt;
		const cliTranscriptPrompt = continuationTranscriptBody === void 0 || !continuationTranscriptPromptRange ? continuationTranscriptBody : resizeExecApprovalContinuationPrompt({
			prompt: continuationTranscriptBody,
			range: continuationTranscriptPromptRange,
			maxOutputUtf16Units: DEFAULT_MAX_LIVE_TOOL_RESULT_CHARS
		});
		params.userTurnTranscriptRecorder?.replaceTextBeforePersistence?.(cliTranscriptPrompt ?? cliContinuationBody);
		const cliPrompt = params.opts.inputProvenance?.kind === "inter_session" ? cliEffectivePrompt : injectTimestamp(cliEffectivePrompt, timestampOptsFromConfig(params.cfg));
		const mutableCliSessionStore = params.sessionKey && params.sessionStore && params.storePath ? {
			sessionKey: params.sessionKey,
			sessionStore: params.sessionStore,
			storePath: params.storePath
		} : void 0;
		const resolveReusableCliSessionBinding = async () => {
			const hasManagedClaudeLiveSession = Boolean(isClaudeCliProvider(cliExecutionProvider) && cliSessionBinding?.sessionId && hasClaudeSession({
				backendId: cliExecutionProvider,
				agentAccountId: params.runContext.accountId,
				agentId: params.sessionAgentId,
				authProfileId: cliSessionBinding.authProfileId,
				sessionId: params.sessionId,
				sessionKey: params.sessionKey
			}));
			if (!isClaudeCliProvider(cliExecutionProvider) || !cliSessionBinding?.sessionId || hasManagedClaudeLiveSession || await claudeCliSessionTranscriptHasContent({
				sessionId: cliSessionBinding.sessionId,
				workspaceDir: cliProcessCwd
			})) return cliSessionBinding;
			log.warn(`cli session reset: provider=${sanitizeForLog(cliExecutionProvider)} reason=transcript-missing sessionKey=${params.sessionKey ?? params.sessionId}`);
			if (mutableCliSessionStore) params.sessionEntry = await clearCliSessionInStore({
				provider: cliExecutionProvider,
				...mutableCliSessionStore
			}) ?? params.sessionEntry;
			return cliSessionBinding;
		};
		const mediaTaskIdsBefore = getGeneratedMediaTaskIdsForSessionKey(params.sessionKey);
		const runCliWithSession = async (nextCliSessionId, activeCliSessionBinding = cliSessionBinding) => {
			const forkCliSessionOnResume = activeCliSessionBinding?.forkNextResume === true;
			const resolvedCliBackend = resolveCliBackendConfig(cliExecutionProvider, params.cfg, { agentId: params.sessionAgentId });
			const supportsCliSessionFork = Boolean(resolvedCliBackend?.config.forkArg);
			if (forkCliSessionOnResume && !supportsCliSessionFork) throw new Error(`CLI backend "${cliExecutionProvider}" does not support session forks`);
			const forkStoreParams = supportsCliSessionFork && nextCliSessionId && mutableCliSessionStore ? {
				provider: cliExecutionProvider,
				expectedCliSessionId: nextCliSessionId,
				...mutableCliSessionStore
			} : void 0;
			return withLocalSessionPlacementTurnAdmission({
				sessionId: params.sessionId,
				sessionKey: params.sessionKey ?? params.sessionId,
				agentId: params.sessionAgentId,
				runId: params.runId
			}, async () => {
				return await runCliAgent({
					preparedRunAdmission: params.preparedRunAdmission,
					sessionId: params.sessionId,
					sessionKey: params.sessionKey,
					sessionTarget: params.sessionTarget,
					sessionEntry: params.sessionEntry,
					chatType: params.sessionEntry?.chatType,
					agentId: params.sessionAgentId,
					trigger: "user",
					sessionFile: params.sessionFile,
					storePath: params.storePath,
					persistAssistantTranscript: params.storePath !== void 0 && params.sessionStore !== void 0,
					workspaceDir: params.workspaceDir,
					cwd: params.cwd,
					config: params.cfg,
					prompt: cliPrompt,
					transcriptPrompt: cliTranscriptPrompt,
					modelProvider: params.providerOverride,
					provider: cliExecutionProvider,
					model: params.modelOverride,
					thinkLevel: params.resolvedThinkLevel,
					timeoutMs: params.timeoutMs,
					runTimeoutOverrideMs: params.runTimeoutOverrideMs,
					runId: params.runId,
					lifecycleGeneration: params.lifecycleGeneration,
					onExecutionStarted: params.opts.onExecutionStarted,
					lane: params.opts.lane,
					extraSystemPrompt: params.opts.extraSystemPrompt,
					inputProvenance: params.opts.inputProvenance,
					sourceReplyDeliveryMode: params.opts.sourceReplyDeliveryMode,
					requireExplicitMessageTarget: params.opts.requireExplicitMessageTarget ?? isSubagentSessionKey(params.sessionKey),
					cliSessionBindingFacts: params.opts.cliSessionBindingFacts,
					cliSessionId: nextCliSessionId,
					cliSessionBinding: nextCliSessionId === activeCliSessionBinding?.sessionId ? activeCliSessionBinding : void 0,
					forkCliSessionOnResume,
					...forkStoreParams ? {
						claimCliSessionFork: async () => {
							const claimed = await consumeCliSessionForkInStore(forkStoreParams);
							if (claimed) params.sessionEntry = claimed;
							return Boolean(claimed);
						},
						restoreCliSessionFork: async () => {
							const restored = await restoreCliSessionForkInStore(forkStoreParams);
							if (restored) params.sessionEntry = restored;
						},
						persistCliSessionForkSuccessor: async (successorCliSessionId) => {
							const persisted = await persistCliSessionForkSuccessorInStore({
								...forkStoreParams,
								successorCliSessionId
							});
							if (!persisted) throw new Error("CLI session fork successor could not be persisted");
							params.sessionEntry = persisted;
						}
					} : {},
					authProfileId,
					bootstrapPromptWarningSignaturesSeen,
					bootstrapPromptWarningSignature,
					imagePrompt: params.body,
					images: params.opts.images,
					imageOrder: params.opts.imageOrder,
					media: params.opts.media,
					skillsSnapshot: params.skillsSnapshot,
					messageChannel: params.messageChannel,
					streamParams: params.opts.streamParams,
					messageProvider: params.opts.messageProvider ?? params.messageChannel,
					currentChannelId: params.runContext.currentChannelId ?? (completionNeedsMessageDelivery ? params.opts.replyTo ?? params.opts.to : void 0),
					chatId: params.runContext.chatId,
					channelContext: params.runContext.channelContext,
					currentThreadTs: params.runContext.currentThreadTs,
					currentInboundAudio: params.runContext.currentInboundAudio,
					approvalReviewerDeviceId: params.opts.approvalReviewerDeviceId,
					agentAccountId: params.runContext.accountId,
					senderId: params.runContext.senderId,
					senderIsOwner: params.opts.senderIsOwner,
					bashElevated: params.opts.bashElevated,
					groupId: params.runContext.groupId,
					groupChannel: params.runContext.groupChannel,
					groupSpace: params.runContext.groupSpace,
					spawnedBy: params.spawnedBy,
					toolsAllow: resolveCliRuntimeToolsAllow(runtimeToolsAllow, params.opts.toolsAllowIsDefault),
					scheduledToolPolicy: params.opts.scheduledToolPolicy,
					cleanupBundleMcpOnRunEnd: params.opts.cleanupBundleMcpOnRunEnd,
					cleanupCliLiveSessionOnRunEnd: params.opts.cleanupCliLiveSessionOnRunEnd,
					oneShotCliRun: params.opts.oneShotCliRun,
					userTurnTranscriptRecorder: params.userTurnTranscriptRecorder,
					contextEngineLogicalTurnLease: params.contextEngineLogicalTurnLease,
					onContextEngineTurnCandidate: params.onContextEngineTurnCandidate,
					suppressNextUserMessagePersistence: params.suppressPromptPersistenceOnRetry === true,
					disableTools,
					allowEmptyAssistantReplyAsSilent: isSubagentAnnounceHandoff,
					...forkStoreParams && !forkCliSessionOnResume ? { onBeforeForkedCliSessionRetry: async (retry) => {
						if (hasNewGeneratedMediaTaskForSessionKey(params.sessionKey, mediaTaskIdsBefore) || retry.sessionId !== activeCliSessionBinding?.sessionId) return false;
						log.warn(`CLI session stalled, arming forked recovery: provider=${sanitizeForLog(cliExecutionProvider)} sessionKey=${forkStoreParams.sessionKey}`);
						const armed = await restoreCliSessionForkInStore(forkStoreParams);
						if (armed) params.sessionEntry = armed;
						return Boolean(armed);
					} } : {},
					...mutableCliSessionStore ? { onBeforeFreshCliSessionRetry: async (retry) => {
						if (hasNewGeneratedMediaTaskForSessionKey(params.sessionKey, mediaTaskIdsBefore)) return false;
						log.warn(`CLI session failed, clearing before fresh retry: provider=${sanitizeForLog(cliExecutionProvider)} sessionKey=${mutableCliSessionStore.sessionKey} reason=${sanitizeForLog(retry.reason)}`);
						const cleared = await clearCliSessionInStore({
							provider: cliExecutionProvider,
							expectedCliSessionId: retry.sessionId,
							...mutableCliSessionStore
						});
						if (!cleared) return false;
						params.sessionEntry = cleared;
						return true;
					} } : {}
				});
			});
		};
		return resolveReusableCliSessionBinding().then(async (activeCliSessionBinding) => {
			try {
				return await runCliWithSession(activeCliSessionBinding?.sessionId, activeCliSessionBinding);
			} catch (err) {
				const failedCliSessionBinding = getCliSessionBinding(params.sessionEntry, cliExecutionProvider);
				const failedCliSessionId = failedCliSessionBinding?.sessionId;
				if (isClaudeCliProvider(cliExecutionProvider) && shouldClearFailedCliSessionBinding({
					error: err,
					binding: failedCliSessionBinding,
					hasNewGeneratedMediaTask: hasNewGeneratedMediaTaskForSessionKey(params.sessionKey, mediaTaskIdsBefore)
				}) && failedCliSessionId && mutableCliSessionStore) {
					log.warn(`CLI session cleared after failed reused turn: provider=${sanitizeForLog(cliExecutionProvider)} sessionKey=${mutableCliSessionStore.sessionKey} reason=${sanitizeForLog(resolveCliSessionClearReason(err))}`);
					params.sessionEntry = await clearCliSessionInStore({
						provider: cliExecutionProvider,
						expectedCliSessionId: failedCliSessionId,
						...mutableCliSessionStore
					}) ?? params.sessionEntry;
				}
				throw err;
			}
		});
	}
	const embeddedRunParams = {
		preparedRunAdmission: params.preparedRunAdmission,
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		chatType: params.sessionEntry?.chatType,
		sessionTarget: params.sessionTarget,
		sandboxSessionKey: params.sessionKey,
		agentId: params.sessionAgentId,
		trigger: "user",
		messageChannel: params.messageChannel,
		messageProvider: params.opts.messageProvider ?? params.messageChannel,
		agentAccountId: params.runContext.accountId,
		messageTo: params.opts.replyTo ?? params.opts.to,
		messageThreadId: params.opts.threadId,
		groupId: params.runContext.groupId,
		groupChannel: params.runContext.groupChannel,
		groupSpace: params.runContext.groupSpace,
		spawnedBy: params.spawnedBy,
		currentChannelId: params.runContext.currentChannelId,
		chatId: params.runContext.chatId,
		channelContext: params.runContext.channelContext,
		currentThreadTs: params.runContext.currentThreadTs,
		currentInboundAudio: params.runContext.currentInboundAudio,
		replyToMode: params.runContext.replyToMode,
		hasRepliedRef: params.runContext.hasRepliedRef,
		senderId: params.runContext.senderId,
		senderIsOwner: params.opts.senderIsOwner,
		sessionFile: params.sessionFile,
		workspaceDir: params.workspaceDir,
		cwd: params.cwd,
		config: params.cfg,
		agentHarnessId: embeddedAgentHarnessOverride,
		modelSelectionLocked: !isRawModelRun && params.sessionEntry?.modelSelectionLocked === true,
		agentHarnessRuntimeOverride: embeddedAgentHarnessOverride,
		skillsSnapshot: params.skillsSnapshot,
		prompt: effectivePrompt,
		transcriptPrompt: continuationTranscriptBody,
		images: shouldForwardImagesToEmbedded ? params.opts.images : void 0,
		imageOrder: shouldForwardImagesToEmbedded ? params.opts.imageOrder : void 0,
		media: params.opts.media,
		clientTools: params.opts.clientTools,
		provider: embeddedAgentProvider,
		model: params.modelOverride,
		modelFallbacksOverride: params.modelFallbacksOverride,
		authProfileId,
		authProfileIdSource: authProfileId ? harnessAuthSelection.authProfileIdSource : void 0,
		thinkLevel: params.resolvedThinkLevel,
		fastMode: params.fastMode,
		fastModeStartedAtMs: params.fastModeStartedAtMs,
		fastModeAutoOnSeconds: params.fastModeAutoOnSeconds,
		isFinalFallbackAttempt: params.isFinalFallbackAttempt,
		verboseLevel: params.resolvedVerboseLevel,
		bashElevated: params.opts.bashElevated,
		execApprovalContinuationPromptRange: embeddedExecApprovalContinuationPromptRange,
		execApprovalContinuationTranscriptPromptRange: continuationTranscriptPromptRange,
		approvalReviewerDeviceId: params.opts.approvalReviewerDeviceId,
		timeoutMs: params.timeoutMs,
		runTimeoutOverrideMs: params.runTimeoutOverrideMs,
		runId: params.runId,
		lifecycleGeneration: params.lifecycleGeneration,
		lane: params.opts.lane,
		suppressLiveStreamOutput: shouldSuppressEmbeddedLiveStreamOutput(params),
		abortSignal: params.opts.abortSignal,
		extraSystemPrompt: params.opts.extraSystemPrompt,
		bootstrapContextMode: params.opts.bootstrapContextMode,
		bootstrapContextRunKind: params.opts.bootstrapContextRunKind,
		toolsAllow: runtimeToolsAllow,
		runtimePluginToolGrant: params.opts.runtimePluginToolGrant,
		trustedInternalHandoff: trustedSubagentAnnounceHandoff ? params.opts.trustedInternalHandoff : void 0,
		scheduledToolPolicy: params.opts.scheduledToolPolicy,
		cronCreatorAuthorityCapability: params.opts.cronCreatorAuthorityCapability,
		internalEvents: params.opts.internalEvents,
		inputProvenance: params.opts.inputProvenance,
		sourceReplyDeliveryMode: params.opts.sourceReplyDeliveryMode,
		requireExplicitMessageTarget: params.opts.requireExplicitMessageTarget,
		disableMessageTool: params.opts.disableMessageTool,
		swarmCollector: params.opts.swarmCollector,
		swarmOutputSchema: params.opts.swarmOutputSchema,
		forceRestartSafeTools: params.opts.forceRestartSafeTools,
		forceCodeModeTools: params.opts.forceCodeModeTools,
		streamParams: params.opts.streamParams,
		agentDir: params.agentDir,
		allowGatewaySubagentBinding: params.opts.allowGatewaySubagentBinding,
		allowTransientCooldownProbe: params.allowTransientCooldownProbe,
		cleanupBundleMcpOnRunEnd: params.opts.cleanupBundleMcpOnRunEnd,
		oneShotCliRun: params.opts.oneShotCliRun,
		modelRun: params.opts.modelRun,
		promptMode: params.opts.promptMode,
		disableTools,
		allowEmptyAssistantReplyAsSilent: isSubagentAnnounceHandoff,
		onAgentEvent: params.onAgentEvent,
		deferTerminalLifecycle: params.deferTerminalLifecycle,
		suppressNextUserMessagePersistence: params.suppressPromptPersistenceOnRetry === true,
		userTurnTranscriptRecorder: params.userTurnTranscriptRecorder,
		contextEngineLogicalTurnLease: params.contextEngineLogicalTurnLease,
		onContextEngineTurnCandidate: params.onContextEngineTurnCandidate,
		onUserMessagePersisted: params.onUserMessagePersisted,
		onExecutionStarted: (info) => {
			params.opts.onExecutionStarted?.();
			if (info?.lifecycleGeneration) params.onLifecycleGenerationChanged?.(info.lifecycleGeneration);
		},
		onSessionIdChanged: params.opts.onSessionIdChanged,
		bootstrapPromptWarningSignaturesSeen,
		bootstrapPromptWarningSignature
	};
	setChannelSourceTurnId(embeddedRunParams, readChannelSourceTurnId(params.runContext));
	setChannelSourceTurnSameThreadRequired(embeddedRunParams, readChannelSourceTurnSameThreadRequired(params.runContext));
	return runEmbeddedAgent(embeddedRunParams);
}
function buildAcpResult(params) {
	const normalizedFinalPayload = normalizeReplyPayload({ text: params.payloadText });
	const payloads = normalizedFinalPayload ? [normalizedFinalPayload] : [];
	const abortFields = resolveAgentRunAbortLifecycleFields(params.abortSignal);
	const resultCancelled = params.resultStatus === "cancelled";
	return {
		payloads,
		meta: {
			durationMs: Date.now() - params.startedAt,
			aborted: abortFields.aborted ?? resultCancelled,
			stopReason: abortFields.stopReason ?? (resultCancelled ? "stop" : params.stopReason),
			...params.terminalReply ? { terminalReply: params.terminalReply } : {}
		}
	};
}
function emitAcpLifecycleStart(params) {
	(params.auditOnly ? emitAgentAuditEvent : emitAgentEvent)({
		runId: params.runId,
		...params.sessionKey ? { sessionKey: params.sessionKey } : {},
		...params.agentId ? { agentId: params.agentId } : {},
		...params.lifecycleGeneration ? { lifecycleGeneration: params.lifecycleGeneration } : {},
		stream: "lifecycle",
		data: {
			phase: "start",
			startedAt: params.startedAt
		}
	});
}
const ACP_PROXY_ENV_KEYS = [
	"HTTP_PROXY",
	"HTTPS_PROXY",
	"ALL_PROXY",
	"http_proxy",
	"https_proxy",
	"all_proxy"
];
const MAX_TRACKED_ACP_TOOLS = 4096;
function createAcpToolLifecycleTracker() {
	return {
		active: /* @__PURE__ */ new Map(),
		terminalToolCallIds: /* @__PURE__ */ new Set(),
		saturated: false
	};
}
function acpAuditToolName(kind) {
	switch (kind) {
		case "read":
		case "edit":
		case "delete":
		case "move":
		case "search":
		case "execute":
		case "fetch":
		case "switch_mode":
		case "think":
		case "other": return `acp_${kind}`;
		default: return "acp_tool";
	}
}
function resolveAcpToolTerminalReason(signal, stopReason, error, resultStatus) {
	const abortFields = resolveAgentRunAbortLifecycleFields(signal);
	if (abortFields.aborted) return abortFields.stopReason === "timeout" ? "timed_out" : "cancelled";
	const normalizedStopReason = normalizeOptionalLowercaseString(stopReason);
	if (normalizedStopReason === "timeout") return "timed_out";
	if (resultStatus === "cancelled") return "cancelled";
	if (error instanceof Error && error.detailCode === "TURN_TIMEOUT") return "timed_out";
	if (normalizedStopReason === "cancel" || normalizedStopReason === "cancelled" || normalizedStopReason === "manual-cancel") return "cancelled";
	return "failed";
}
function resolveAcpLifecycleEndFields(signal, stopReason, resultStatus) {
	const abortFields = resolveAgentRunAbortLifecycleFields(signal);
	if (abortFields.aborted) return abortFields;
	const terminalReason = resolveAcpToolTerminalReason(void 0, stopReason, void 0, resultStatus);
	if (terminalReason === "timed_out") return {
		aborted: true,
		stopReason: "timeout",
		status: "timed_out"
	};
	if (terminalReason === "cancelled") return {
		aborted: true,
		stopReason: "stop",
		status: "cancelled"
	};
	return {};
}
function emitAcpToolExecutionEvent(params) {
	const { event } = params;
	const now = Date.now();
	const toolCallId = event.toolCallId?.trim() ? event.toolCallId : void 0;
	const activeTool = toolCallId ? params.toolTracker.active.get(toolCallId) : void 0;
	const terminalOutcome = resolveAcpToolTerminalOutcome(event.status);
	const toolName = acpAuditToolName(event.kind);
	if (toolCallId && !activeTool) {
		if (params.toolTracker.terminalToolCallIds.has(toolCallId)) return;
		const trackedIdentities = params.toolTracker.active.size + params.toolTracker.terminalToolCallIds.size;
		if (params.toolTracker.saturated || trackedIdentities >= MAX_TRACKED_ACP_TOOLS) {
			params.toolTracker.saturated = true;
			return;
		}
	}
	if (!activeTool && (toolCallId !== void 0 || toolCallId === void 0 && terminalOutcome !== void 0)) {
		emitTrustedDiagnosticEvent({
			type: "tool.execution.started",
			runId: params.runId,
			...params.sessionKey ? { sessionKey: params.sessionKey } : {},
			...params.agentId ? { agentId: params.agentId } : {},
			...toolCallId ? { toolCallId } : {},
			toolName,
			toolSource: "core",
			toolOwner: "acp"
		});
		if (toolCallId) params.toolTracker.active.set(toolCallId, {
			runId: params.runId,
			...params.sessionKey ? { sessionKey: params.sessionKey } : {},
			...params.agentId ? { agentId: params.agentId } : {},
			toolCallId,
			toolName,
			startedAt: now
		});
	}
	if (!terminalOutcome) return;
	const terminalReason = resolveAcpToolTerminalReason(params.abortSignal, void 0, void 0, terminalOutcome === "cancelled" ? "cancelled" : void 0);
	const durationMs = Math.max(0, now - (activeTool?.startedAt ?? now));
	emitTrustedDiagnosticEvent(terminalOutcome === "completed" ? {
		type: "tool.execution.completed",
		runId: params.runId,
		...params.sessionKey ? { sessionKey: params.sessionKey } : {},
		...params.agentId ? { agentId: params.agentId } : {},
		...toolCallId ? { toolCallId } : {},
		toolName: activeTool?.toolName ?? toolName,
		toolSource: "core",
		toolOwner: "acp",
		durationMs
	} : {
		type: "tool.execution.error",
		runId: params.runId,
		...params.sessionKey ? { sessionKey: params.sessionKey } : {},
		...params.agentId ? { agentId: params.agentId } : {},
		...toolCallId ? { toolCallId } : {},
		toolName: activeTool?.toolName ?? toolName,
		toolSource: "core",
		toolOwner: "acp",
		durationMs,
		errorCategory: terminalReason === "cancelled" ? "aborted" : "acp_tool",
		terminalReason
	});
	if (toolCallId) {
		params.toolTracker.active.delete(toolCallId);
		params.toolTracker.terminalToolCallIds.add(toolCallId);
	}
}
function finalizeAcpToolsForRun(toolTracker, runId, terminalReason) {
	const now = Date.now();
	for (const activeTool of toolTracker.active.values()) emitTrustedDiagnosticEvent({
		type: "tool.execution.error",
		runId,
		...activeTool.sessionKey ? { sessionKey: activeTool.sessionKey } : {},
		...activeTool.agentId ? { agentId: activeTool.agentId } : {},
		toolName: activeTool.toolName,
		toolSource: "core",
		toolOwner: "acp",
		toolCallId: activeTool.toolCallId,
		durationMs: Math.max(0, now - activeTool.startedAt),
		errorCategory: terminalReason === "cancelled" ? "aborted" : "acp_tool_incomplete",
		terminalReason
	});
	toolTracker.active.clear();
	toolTracker.terminalToolCallIds.clear();
	toolTracker.saturated = false;
}
function resolvePresentProxyEnvKeys(env = process.env) {
	return ACP_PROXY_ENV_KEYS.filter((key) => {
		const value = env[key];
		return typeof value === "string" && value.trim().length > 0;
	});
}
function sanitizeAcpDiagnosticText(value) {
	return truncateUtf16Safe(redactSensitiveText(value).replace(/\s+/g, " ").trim(), 240);
}
function acpRuntimeEventDiagnostics(event) {
	if (event.type === "status") return {
		eventType: event.type,
		text: sanitizeAcpDiagnosticText(event.text),
		...event.tag ? { tag: event.tag } : {}
	};
	if (event.type === "tool_call") return {
		eventType: event.type,
		text: sanitizeAcpDiagnosticText(event.text),
		...event.tag ? { tag: event.tag } : {},
		...event.status ? { status: sanitizeAcpDiagnosticText(event.status) } : {},
		...event.title ? { title: sanitizeAcpDiagnosticText(event.title) } : {},
		...event.toolCallId ? { toolCallId: sanitizeAcpDiagnosticText(event.toolCallId) } : {}
	};
	if (event.type === "error") return {
		eventType: event.type,
		message: sanitizeAcpDiagnosticText(event.message),
		...event.code ? { code: sanitizeAcpDiagnosticText(event.code) } : {},
		...typeof event.retryable === "boolean" ? { retryable: event.retryable } : {}
	};
	if (event.type === "done") return {
		eventType: event.type,
		...event.status ? { status: event.status } : {},
		...event.stopReason ? { stopReason: sanitizeAcpDiagnosticText(event.stopReason) } : {}
	};
	return {
		eventType: event.type,
		stream: event.stream ?? "output"
	};
}
function emitAcpPromptSubmitted(params) {
	emitAgentEvent({
		runId: params.runId,
		stream: "acp",
		...params.sessionKey ? { sessionKey: params.sessionKey } : {},
		data: {
			phase: "prompt_submitted",
			at: params.at,
			proxyEnvKeys: resolvePresentProxyEnvKeys()
		}
	});
}
function emitAcpRuntimeEvent(params) {
	if (params.event.type === "tool_call") emitAcpToolExecutionEvent({
		runId: params.runId,
		toolTracker: params.toolTracker,
		...params.sessionKey ? { sessionKey: params.sessionKey } : {},
		...params.agentId ? { agentId: params.agentId } : {},
		...params.abortSignal ? { abortSignal: params.abortSignal } : {},
		event: params.event
	});
	if (!params.auditOnly) emitAgentEvent({
		runId: params.runId,
		stream: "acp",
		...params.sessionKey ? { sessionKey: params.sessionKey } : {},
		...params.agentId ? { agentId: params.agentId } : {},
		data: {
			phase: "runtime_event",
			...acpRuntimeEventDiagnostics(params.event)
		}
	});
}
function emitAcpLifecycleEnd(params) {
	finalizeAcpToolsForRun(params.toolTracker, params.runId, resolveAcpToolTerminalReason(params.abortSignal, params.stopReason, void 0, params.resultStatus));
	(params.auditOnly ? emitAgentAuditEvent : emitAgentEvent)({
		runId: params.runId,
		...params.sessionKey ? { sessionKey: params.sessionKey } : {},
		...params.agentId ? { agentId: params.agentId } : {},
		...params.lifecycleGeneration ? { lifecycleGeneration: params.lifecycleGeneration } : {},
		stream: "lifecycle",
		data: {
			phase: "end",
			endedAt: Date.now(),
			...resolveAcpLifecycleEndFields(params.abortSignal, params.stopReason, params.resultStatus),
			...params.terminalReply ? { terminalReply: params.terminalReply } : {}
		}
	});
}
function emitAcpLifecycleError(params) {
	const terminalReason = resolveAcpToolTerminalReason(params.abortSignal, void 0, params.error);
	finalizeAcpToolsForRun(params.toolTracker, params.runId, terminalReason);
	const lifecycleFields = params.terminalOutcome === "blocked" ? { livenessState: "blocked" } : terminalReason === "timed_out" ? {
		aborted: true,
		stopReason: "timeout",
		status: "timed_out"
	} : resolveAgentRunAbortLifecycleFields(params.abortSignal);
	(params.auditOnly ? emitAgentAuditEvent : emitAgentEvent)({
		runId: params.runId,
		...params.agentId ? { agentId: params.agentId } : {},
		...params.lifecycleGeneration ? { lifecycleGeneration: params.lifecycleGeneration } : {},
		stream: "lifecycle",
		...params.sessionKey ? { sessionKey: params.sessionKey } : {},
		data: {
			phase: "error",
			...!params.auditOnly ? { error: formatAcpErrorChain(params.error) } : {},
			endedAt: Date.now(),
			...lifecycleFields
		}
	});
}
function emitAcpAssistantDelta(params) {
	emitAgentEvent({
		runId: params.runId,
		stream: "assistant",
		data: {
			text: params.text,
			delta: params.delta
		}
	});
}
//#endregion
export { emitAcpLifecycleError as a, emitAcpRuntimeEvent as c, resolveCliTranscriptReplyText as d, runAgentAttempt as f, emitAcpLifecycleEnd as i, persistAcpTurnTranscript as l, createAcpToolLifecycleTracker as n, emitAcpLifecycleStart as o, emitAcpAssistantDelta as r, emitAcpPromptSubmitted as s, buildAcpResult as t, persistCliTurnTranscript as u };
