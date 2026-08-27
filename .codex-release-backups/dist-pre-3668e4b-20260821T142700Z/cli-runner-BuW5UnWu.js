import { r as formatErrorMessage } from "./errors-CqPTYU6G.js";
import { h as resolveSessionAgentId } from "./agent-scope-D9GLFAyB.js";
import { c as parseAgentSessionKey } from "./session-key-utils-D8x_bjrd.js";
import { r as resolvePersistedSessionStoreOwnerForTarget } from "./session-store-owner-CLtsGq3M.js";
import { o as resolveSessionStorePathCore } from "./paths-CfFmgJmW.js";
import { B as hasInternalDiagnosticEventListeners, C as createChildDiagnosticTraceContext, D as freezeDiagnosticTraceContext, N as runWithDiagnosticTraceContext, T as createDiagnosticTraceContextFromActiveScope, o as emitTrustedDiagnosticEvent, s as emitTrustedDiagnosticEventWithPrivateData, t as areDiagnosticsEnabledForProcess } from "./diagnostic-events-Djn4AVRp.js";
import { t as createSubsystemLogger } from "./subsystem-DNgaGOch.js";
import { n as SILENT_REPLY_TOKEN } from "./tokens-CMI0yx54.js";
import { g as withAgentRunLifecycleGeneration, n as captureAgentRunLifecycleGeneration, t as assertAgentRunLifecycleGenerationCurrent } from "./agent-events-Cmj8toCy.js";
import { h as resolveBlockMessage, t as getGlobalHookRunner } from "./hook-runner-global-BgVsqem2.js";
import { g as setReplyPayloadMetadata } from "./reply-payload-DVcGHORx.js";
import { en as patchSessionEntryCore } from "./session-accessor-CIiPoGwM.js";
import { d as loadAuthProfileStoreForRuntime } from "./store-DZy8rsrA.js";
import { a as markAuthProfileFailure } from "./usage-Cj2wt9Ks.js";
import { i as buildUsageWithNoCost, n as buildAssistantMessage } from "./stream-message-shared-Cyrn1UHN.js";
import { t as SessionManager } from "./session-manager-2mjIFFdj.js";
import { i as resolveCliBackendConfig } from "./cli-backends-BqBcI5I1.js";
import "./auth-profiles-TorfVJYv.js";
import { n as externalCliDiscoveryForProviderAuth } from "./external-cli-discovery-BKkEUFtz.js";
import { n as markAuthProfileSuccess } from "./profiles-CaIWIvwD.js";
import { a as resolveCliRuntimeOwnerFingerprint, i as resolveCliRuntimeArtifactFingerprint } from "./cli-auth-epoch-DXvzKYRI.js";
import { c as isFailoverError, d as isTimeoutError, i as coerceToFailoverError, u as isSignalTimeoutReason } from "./failover-error-DKFCUqL9.js";
import { n as appendExactAssistantMessageToSessionTranscript } from "./transcript-DOeEf3qR.js";
import { n as diagnosticErrorFailureKind, r as diagnosticErrorMessage, t as diagnosticErrorCategory } from "./diagnostic-error-metadata-B1vLwxgx.js";
import { n as runAgentHarnessBeforeMessageWriteHook } from "./hook-helpers-CPjTRX5t.js";
import { t as isHeartbeatLifecycleRunKind } from "./bootstrap-mode-HvSedbJl.js";
import { i as buildGenericCliContextEngineHostSupport } from "./host-compat-xESS3bi6.js";
import { d as waitForDeferredTurnMaintenanceForSession, i as bootstrapHarnessContextEngine, l as runHarnessContextEngineMaintenance, n as runAgentEndSideEffects, s as finalizeHarnessContextEngineTurn, t as awaitAgentEndSideEffects } from "./agent-end-side-effects-Bc-vI09R.js";
import { b as resolveExplicitFinalSourceReplyDeliveryEvidence } from "./delivery-evidence-CEFyQPkI.js";
import { n as buildAgentHookContextIdentityFields, t as buildAgentHookContextChannelFields } from "./hook-agent-context-D6EJ_Q3z.js";
import { a as runAgentHarnessLlmInputHook, o as runAgentHarnessLlmOutputHook, s as buildAgentHookContext } from "./lifecycle-hook-helpers-TMBfi70M.js";
import { i as runBeforeAgentReplyForTurn, n as resolveAuthProfileFailureReason, r as buildHandledBeforeAgentReplyPayloads, t as buildEmbeddedRunPayloads } from "./payloads-DEmmA8-C.js";
import { i as formatCliBackendOutputDigest, r as cliBackendLog } from "./log-CQHubbIW.js";
import { u as hashCliReseedPrompt } from "./cli-session-history.claude-DD2NttVO.js";
import { n as acceptsClaudeLive } from "./claude-live-session-policy-D5q03_Jx.js";
import { i as createCliFailoverError, n as getCliMessagingDeliveryEvidence, t as attachCliMessagingDeliveryEvidence } from "./delivery-evidence-BxhYWo-r.js";
import { c as CliAuthProfilePreparationError, i as loadCliSessionHistoryMessages, r as loadCliSessionContextEngineMessages, s as buildAgentHookConversationMessages, u as claudeCliSessionTranscriptHasContent } from "./session-history-txC-Ac5Z.js";
//#region src/agents/cli-runner/cli-run-recovery.ts
function resolveCliSessionId(reusableCliSession) {
	return reusableCliSession.mode === "reuse" || reusableCliSession.mode === "reuse-with-drift" ? reusableCliSession.sessionId : void 0;
}
function shouldRetryFreshCliSessionAfterFailover(params) {
	if (!params.hasHistoryPrompt) return false;
	switch (params.error.reason) {
		case "session_expired": return true;
		case "unknown": return params.error.code === "cli_unknown_empty_failure";
		case "empty_response": return params.error.code === "cli_unknown_empty_failure";
		case "format": return params.error.code === "cli_synthetic_no_response";
		case "timeout": return params.error.code === "cli_no_output_timeout";
		case "context_overflow": return params.error.code === "cli_context_overflow";
		default: return false;
	}
}
function shouldRetryForkedCliSessionAfterFailover(error) {
	return error.reason === "timeout" && error.code === "cli_no_output_timeout";
}
function isUnsupportedCliResumeAtError(error, resumeAtArg) {
	const message = formatErrorMessage(error).toLowerCase();
	return message.includes(resumeAtArg.toLowerCase()) && /\b(?:unknown|unexpected|unrecognized)\b|\bnot\s+recognized\b/.test(message);
}
async function runCliRecovery(params) {
	const { context } = params;
	const runParams = context.params;
	const reusableCliSessionId = resolveCliSessionId(context.reusableCliSession);
	const resumeCheckpointId = runParams.cliSessionBinding?.resumeCheckpointId;
	let retryableSessionId = reusableCliSessionId;
	try {
		return await params.finishAttempt(await params.executeAttempt(reusableCliSessionId, runParams.forkCliSessionOnResume ? { onForkSuccessorPersisted: (sessionId) => {
			retryableSessionId = sessionId;
		} } : void 0), reusableCliSessionId);
	} catch (err) {
		const deliveredFailure = await params.finishDeliveredFailure(err);
		if (deliveredFailure) return deliveredFailure;
		let recoveryError = err;
		if (runParams.forkCliSessionOnResume && resumeCheckpointId && context.preparedBackend.backend.resumeAtArg && isUnsupportedCliResumeAtError(err, context.preparedBackend.backend.resumeAtArg)) recoveryError = createCliFailoverError("CLI backend cannot resume from the stored checkpoint.", "session_expired", {
			provider: runParams.provider,
			model: context.modelId,
			sessionId: runParams.sessionId,
			lane: runParams.lane
		}, { cause: err });
		if (isFailoverError(recoveryError)) {
			if (!runParams.forkCliSessionOnResume && shouldRetryForkedCliSessionAfterFailover(recoveryError) && retryableSessionId && resumeCheckpointId && runParams.sessionKey && context.preparedBackend.backend.forkArg && context.preparedBackend.backend.resumeAtArg && runParams.onBeforeForkedCliSessionRetry) try {
				const retryTimeoutMs = runParams.timeoutMs - (Date.now() - context.started);
				if (retryTimeoutMs <= 0) throw recoveryError;
				if (!await runParams.onBeforeForkedCliSessionRetry({
					provider: runParams.provider,
					reason: recoveryError.reason,
					sessionId: retryableSessionId
				})) throw recoveryError;
				cliBackendLog.warn(`cli session recovery fork: provider=${runParams.provider} reason=${recoveryError.reason} sessionKey=${runParams.sessionKey}`);
				return await params.finishAttempt(await params.executeAttempt(retryableSessionId, {
					timeoutMs: retryTimeoutMs,
					forkCliSessionOnResume: true,
					resumeAt: resumeCheckpointId,
					onForkSuccessorPersisted: (sessionId) => {
						retryableSessionId = sessionId;
					}
				}));
			} catch (forkError) {
				const deliveredForkFailure = await params.finishDeliveredFailure(forkError);
				if (deliveredForkFailure) return deliveredForkFailure;
				recoveryError = isUnsupportedCliResumeAtError(forkError, context.preparedBackend.backend.resumeAtArg) ? err : forkError;
			}
			if (isFailoverError(recoveryError) && shouldRetryFreshCliSessionAfterFailover({
				error: recoveryError,
				hasHistoryPrompt: Boolean(context.openClawHistoryPrompt)
			}) && retryableSessionId && runParams.sessionKey) try {
				const retryTimeoutMs = runParams.timeoutMs - (Date.now() - context.started);
				if (retryTimeoutMs <= 0) throw recoveryError;
				if (runParams.onBeforeFreshCliSessionRetry) {
					if (!await runParams.onBeforeFreshCliSessionRetry({
						provider: runParams.provider,
						reason: recoveryError.reason,
						sessionId: retryableSessionId
					})) throw recoveryError;
				}
				cliBackendLog.warn(`cli session recovery retry: provider=${runParams.provider} reason=${recoveryError.reason} sessionKey=${runParams.sessionKey}`);
				return await params.finishAttempt(await params.executeAttempt(void 0, {
					timeoutMs: retryTimeoutMs,
					forkCliSessionOnResume: false
				}));
			} catch (retryErr) {
				const deliveredRetryFailure = await params.finishDeliveredFailure(retryErr);
				if (deliveredRetryFailure) return deliveredRetryFailure;
				await params.onTerminalFailure(retryErr);
				throw retryErr;
			}
		}
		await params.onTerminalFailure(recoveryError);
		throw recoveryError;
	}
}
//#endregion
//#region src/agents/cli-runner/cli-run-settlement.ts
const log$2 = createSubsystemLogger("agents/cli-runner");
const cliRunSettlementDeps = {
	claudeCliSessionTranscriptHasContent,
	delay: async (delayMs) => {
		await new Promise((resolve) => {
			setTimeout(resolve, delayMs);
		});
	},
	loadAuthProfileStoreForRuntime,
	markAuthProfileFailure,
	markAuthProfileSuccess
};
async function settleCliAuthProfile(params) {
	try {
		if (params.terminal.outcome === "success") {
			await cliRunSettlementDeps.markAuthProfileSuccess({
				store: params.store,
				profileId: params.profileId,
				provider: params.provider,
				agentDir: params.agentDir
			});
			return;
		}
		const error = params.terminal.error;
		const reason = resolveAuthProfileFailureReason({
			failoverReason: isFailoverError(error) ? error.reason : null,
			providerStarted: isFailoverError(error) && error.reason === "timeout" ? error.cliTimeout?.observedActivity : void 0
		});
		if (reason) await cliRunSettlementDeps.markAuthProfileFailure({
			store: params.store,
			profileId: params.profileId,
			reason,
			cfg: params.terminal.config,
			agentDir: params.agentDir,
			runId: params.terminal.runId,
			modelId: params.terminal.modelId
		});
	} catch (error) {
		log$2.warn(`CLI auth-profile ${params.terminal.outcome} settlement failed: ${formatErrorMessage(error)}`);
	}
}
function isClaudeCliBackend(provider) {
	return provider.trim().toLowerCase() === "claude-cli";
}
async function assertCliRuntimeBinding(context) {
	if (!context.runtimeArtifactFingerprint) return;
	const currentArtifact = await resolveCliRuntimeArtifactFingerprint({
		provider: context.params.provider,
		config: context.params.config ?? context.contextEngineConfig,
		agentId: context.params.agentId,
		runtimeArtifactId: context.backendResolved.id
	});
	if (currentArtifact !== context.runtimeArtifactFingerprint) throw new Error("CLI executable/package artifact changed during successful inference");
	if (!context.runtimeOwnerFingerprint) return;
	if (await resolveCliRuntimeOwnerFingerprint({
		provider: context.params.provider,
		config: context.params.config ?? context.contextEngineConfig,
		...context.agentDir ? { agentDir: context.agentDir } : {},
		agentId: context.params.agentId,
		runtimeOwnerId: context.backendResolved.id,
		...context.effectiveAuthProfileId ? { authProfileId: context.effectiveAuthProfileId } : {},
		...context.authBindingSkipsLocalCredential ? { skipLocalCredential: true } : {},
		runtimeArtifactFingerprint: currentArtifact
	}) !== context.runtimeOwnerFingerprint) throw new Error("CLI runtime owner changed during successful inference");
}
async function settleCliPreparationError(error, params) {
	if (!(error instanceof CliAuthProfilePreparationError)) return;
	await settleCliAuthProfile({
		store: cliRunSettlementDeps.loadAuthProfileStoreForRuntime(error.agentDir, { externalCli: externalCliDiscoveryForProviderAuth({
			cfg: params.config,
			provider: error.provider,
			profileId: error.profileId
		}) }),
		profileId: error.profileId,
		provider: error.provider,
		agentDir: error.agentDir,
		terminal: {
			outcome: "failure",
			error,
			config: params.config,
			runId: params.runId,
			modelId: params.model
		}
	});
}
async function settlePreparedCliRun(params) {
	const { context, diagnosticLifecycle, run } = params;
	const runParams = context.params;
	let result;
	let runError;
	try {
		result = await run();
	} catch (error) {
		runError = error;
	}
	const terminalRunError = runError;
	let cleanupError;
	const recordCleanupError = (error) => {
		cleanupError ??= error;
	};
	if (runParams.cleanupCliLiveSessionOnRunEnd === true) try {
		const { closeClaudeSession } = await import("./claude-live-registry-CkalzoTN.js");
		await closeClaudeSession(context, "restart");
	} catch (error) {
		recordCleanupError(error);
	}
	if (runParams.cleanupBundleMcpOnRunEnd === true) try {
		const { retireSessionMcpRuntime } = await import("./agent-bundle-mcp-tools-fF1ykLiU.js");
		await retireSessionMcpRuntime({
			sessionId: runParams.sessionId,
			reason: "cli-run-end",
			onError: recordCleanupError
		});
	} catch (error) {
		recordCleanupError(error);
	}
	if (cleanupError) if (runError || result?.didSendViaMessagingTool === true) log$2.warn(`cli run cleanup failed after completion: ${formatErrorMessage(cleanupError)}`);
	else {
		diagnosticLifecycle?.setPhase("cleanup");
		runError = cleanupError instanceof Error ? cleanupError : new Error(formatErrorMessage(cleanupError));
	}
	if (context.effectiveAuthProfileId && context.authProfileStore) {
		const profileId = context.effectiveAuthProfileId;
		const authProfileStore = context.authProfileStore;
		if (terminalRunError) await settleCliAuthProfile({
			store: authProfileStore,
			profileId,
			provider: authProfileStore.profiles[profileId]?.provider ?? runParams.provider,
			agentDir: context.agentDir,
			terminal: {
				outcome: "failure",
				error: terminalRunError,
				config: runParams.config,
				runId: runParams.runId,
				modelId: context.modelId
			}
		});
		else if (result?.meta.executionTrace?.attempts?.at(-1)?.result === "success") await settleCliAuthProfile({
			store: authProfileStore,
			profileId,
			provider: authProfileStore.profiles[profileId]?.provider ?? runParams.provider,
			agentDir: context.agentDir,
			terminal: { outcome: "success" }
		});
	}
	if (runError) throw runError instanceof Error ? runError : new Error(formatErrorMessage(runError));
	return result;
}
function resolveCliSourceReplyMirror(params) {
	const { evidence, modelId, runParams } = params;
	const payloads = buildEmbeddedRunPayloads({
		assistantTexts: [],
		lastAssistant: void 0,
		sessionKey: runParams.sessionKey ?? "",
		provider: runParams.provider,
		model: modelId,
		didSendViaMessagingTool: evidence.didSendViaMessagingTool,
		didDeliverSourceReplyViaMessageTool: evidence.didDeliverSourceReplyViaMessageTool,
		messagingToolSentTargets: evidence.messagingToolSentTargets,
		messagingToolSourceReplyPayloads: evidence.messagingToolSourceReplyPayloads,
		sourceReplyDeliveryMode: runParams.sourceReplyDeliveryMode,
		agentId: runParams.agentId,
		runId: runParams.runId
	});
	return {
		payloads,
		delivered: payloads.length > 0 || runParams.sourceReplyDeliveryMode === "message_tool_only" && evidence.didDeliverSourceReplyViaMessageTool === true,
		visibleText: payloads.map((payload) => payload.text?.trim() ?? "").filter(Boolean).join("\n\n") || void 0
	};
}
function buildBlockedCliRunResult(params) {
	const { context, message, preparedContextAgentMeta, sessionBindingDisabled } = params;
	const runParams = context.params;
	return {
		payloads: [{
			text: message,
			isError: true
		}],
		meta: {
			durationMs: Date.now() - context.started,
			finalAssistantVisibleText: message,
			finalAssistantRawText: message,
			livenessState: "blocked",
			error: {
				kind: "hook_block",
				message
			},
			systemPromptReport: context.systemPromptReport,
			executionTrace: {
				winnerProvider: runParams.provider,
				winnerModel: context.modelId,
				attempts: [{
					provider: runParams.provider,
					model: context.modelId,
					result: "error",
					reason: "before_agent_run blocked the run"
				}],
				fallbackUsed: false,
				runner: "cli"
			},
			requestShaping: {
				...runParams.thinkLevel ? { thinking: runParams.thinkLevel } : {},
				...context.effectiveAuthProfileId ? { authMode: "auth-profile" } : {}
			},
			completion: {
				finishReason: "blocked",
				stopReason: "blocked",
				refusal: true
			},
			agentMeta: {
				sessionId: runParams.sessionId ?? "",
				provider: runParams.provider,
				model: context.modelId,
				...preparedContextAgentMeta,
				...sessionBindingDisabled ? { clearCliSessionBinding: true } : {}
			}
		}
	};
}
function buildCliDeliveredFailure(params) {
	const { context, error, evidence, preparedContextAgentMeta, reusableCliSessionId, sessionBindingDisabled } = params;
	const runParams = context.params;
	const message = formatErrorMessage(error);
	const { payloads } = resolveCliSourceReplyMirror({
		evidence,
		runParams,
		modelId: context.modelId
	});
	const visiblePayloads = payloads.length > 0 ? payloads : resolveExplicitFinalSourceReplyDeliveryEvidence(evidence) === false ? [{
		text: "The reply stopped after sending progress. Please try again.",
		isError: true
	}] : void 0;
	return {
		...visiblePayloads ? { payloads: visiblePayloads } : {},
		meta: {
			durationMs: Date.now() - context.started,
			systemPromptReport: context.systemPromptReport,
			stopReason: "error",
			executionTrace: {
				winnerProvider: runParams.provider,
				winnerModel: context.modelId,
				attempts: [{
					provider: runParams.provider,
					model: context.modelId,
					result: "error",
					reason: message
				}],
				fallbackUsed: false,
				runner: "cli"
			},
			requestShaping: {
				...runParams.thinkLevel ? { thinking: runParams.thinkLevel } : {},
				...context.effectiveAuthProfileId ? { authMode: "auth-profile" } : {}
			},
			completion: {
				finishReason: "error",
				stopReason: "error",
				refusal: false
			},
			agentMeta: {
				sessionId: "",
				provider: runParams.provider,
				model: context.modelId,
				...preparedContextAgentMeta,
				...sessionBindingDisabled || reusableCliSessionId ? { clearCliSessionBinding: true } : {}
			}
		},
		didSendViaMessagingTool: true,
		...evidence.didDeliverSourceReplyViaMessageTool ? { didDeliverSourceReplyViaMessageTool: true } : {},
		...evidence.messagingToolSentTexts?.length ? { messagingToolSentTexts: evidence.messagingToolSentTexts } : {},
		...evidence.messagingToolSentMediaUrls?.length ? { messagingToolSentMediaUrls: evidence.messagingToolSentMediaUrls } : {},
		...evidence.messagingToolSentTargets?.length ? { messagingToolSentTargets: evidence.messagingToolSentTargets } : {},
		...evidence.messagingToolSourceReplyPayloads?.length ? { messagingToolSourceReplyPayloads: evidence.messagingToolSourceReplyPayloads } : {}
	};
}
function buildCliRunResult(params) {
	const { assistantTranscriptOwned, bindingFlushOk, context, effectiveCliSessionId, output, preparedContextAgentMeta, sessionBindingDisabled, usedHistoryPrompt, userTurnHandled } = params;
	const runParams = context.params;
	const text = output.text?.trim();
	const rawText = output.rawText?.trim();
	const sourceReplyMirror = resolveCliSourceReplyMirror({
		evidence: output,
		runParams,
		modelId: context.modelId
	});
	const finalAssistantVisibleText = sourceReplyMirror.delivered ? sourceReplyMirror.visibleText : text;
	const payloads = sourceReplyMirror.payloads.length > 0 ? sourceReplyMirror.payloads : sourceReplyMirror.delivered ? void 0 : text ? [assistantTranscriptOwned ? setReplyPayloadMetadata({ text }, { assistantTranscriptOwned: true }) : { text }] : runParams.allowEmptyAssistantReplyAsSilent === true ? [{ text: SILENT_REPLY_TOKEN }] : void 0;
	const unflushedCliSessionId = !sessionBindingDisabled && effectiveCliSessionId && bindingFlushOk === false ? effectiveCliSessionId : void 0;
	const persistedCliSessionId = sessionBindingDisabled ? void 0 : unflushedCliSessionId ? void 0 : effectiveCliSessionId;
	const createdReseedReceipt = persistedCliSessionId && usedHistoryPrompt && isClaudeCliBackend(runParams.provider) && output.finalPromptText !== void 0 && userTurnHandled && runParams.sessionId ? {
		version: 1,
		promptHash: hashCliReseedPrompt(output.finalPromptText),
		localSessionId: runParams.sessionId,
		userTurnDisposition: runParams.userTurnTranscriptRecorder?.hasPersisted() ? "persisted" : "omitted"
	} : void 0;
	const preservedReseedReceipt = runParams.cliSessionBinding && persistedCliSessionId === runParams.cliSessionBinding.sessionId ? runParams.cliSessionBinding.reseedReceipt : void 0;
	const reseedReceipt = createdReseedReceipt ?? preservedReseedReceipt;
	const agentSessionId = sessionBindingDisabled ? runParams.sessionId ?? "" : unflushedCliSessionId ? "" : effectiveCliSessionId ?? runParams.sessionId ?? "";
	const yielded = output.yielded === true;
	const stopReason = yielded ? "end_turn" : "completed";
	runParams.onSuccessfulAuthBinding?.({
		...context.effectiveAuthProfileId ? { authProfileId: context.effectiveAuthProfileId } : {},
		...context.authBindingFingerprint ? { authFingerprint: context.authBindingFingerprint } : {},
		...!context.authBindingFingerprint && context.runtimeOwnerFingerprint ? {
			runtimeOwnerFingerprint: context.runtimeOwnerFingerprint,
			runtimeOwnerKind: "cli-runtime",
			runtimeOwnerId: context.backendResolved.id
		} : {},
		...context.runtimeArtifactFingerprint ? {
			runtimeArtifactFingerprint: context.runtimeArtifactFingerprint,
			runtimeArtifactId: context.backendResolved.id
		} : {},
		...context.authBindingSkipsLocalCredential ? { skipLocalCredential: true } : {}
	});
	return {
		payloads,
		meta: {
			durationMs: Date.now() - context.started,
			...output.finalPromptText ? { finalPromptText: output.finalPromptText } : {},
			...finalAssistantVisibleText || rawText ? {
				...finalAssistantVisibleText ? { finalAssistantVisibleText } : {},
				...rawText ? { finalAssistantRawText: rawText } : {}
			} : {},
			systemPromptReport: context.systemPromptReport,
			...yielded ? {
				yielded: true,
				livenessState: "paused",
				stopReason
			} : {},
			executionTrace: {
				winnerProvider: runParams.provider,
				winnerModel: context.modelId,
				attempts: [{
					provider: runParams.provider,
					model: context.modelId,
					result: "success"
				}],
				fallbackUsed: false,
				runner: "cli"
			},
			requestShaping: {
				...runParams.thinkLevel ? { thinking: runParams.thinkLevel } : {},
				...context.effectiveAuthProfileId ? { authMode: "auth-profile" } : {}
			},
			completion: {
				finishReason: yielded ? "end_turn" : "stop",
				stopReason,
				refusal: false
			},
			...output.toolSummary ? { toolSummary: output.toolSummary } : {},
			agentMeta: {
				sessionId: agentSessionId,
				provider: runParams.provider,
				model: context.modelId,
				...preparedContextAgentMeta,
				usage: output.usage,
				...output.usage ? { lastCallUsage: output.usage } : {},
				...output.diagnosticUsage ? { diagnosticUsage: output.diagnosticUsage } : {},
				...persistedCliSessionId ? { cliSessionBinding: {
					sessionId: persistedCliSessionId,
					...context.effectiveAuthProfileId ? { authProfileId: context.effectiveAuthProfileId } : {},
					...output.resumeCheckpointId ? { resumeCheckpointId: output.resumeCheckpointId } : {},
					...context.authEpoch ? { authEpoch: context.authEpoch } : {},
					authEpochVersion: context.authEpochVersion,
					...context.extraSystemPromptHash ? { extraSystemPromptHash: context.extraSystemPromptHash } : {},
					...context.messageToolPolicyHash ? { messageToolPolicyHash: context.messageToolPolicyHash } : {},
					...context.promptToolNamesHash ? { promptToolNamesHash: context.promptToolNamesHash } : {},
					...context.cwdHash ? { cwdHash: context.cwdHash } : {},
					...context.preparedBackend.mcpConfigHash ? { mcpConfigHash: context.preparedBackend.mcpConfigHash } : {},
					...context.preparedBackend.mcpResumeHash ? { mcpResumeHash: context.preparedBackend.mcpResumeHash } : {},
					...reseedReceipt ? { reseedReceipt } : {}
				} } : {},
				...sessionBindingDisabled || unflushedCliSessionId ? { clearCliSessionBinding: true } : {}
			}
		},
		...output.didSendViaMessagingTool ? { didSendViaMessagingTool: true } : {},
		...output.didDeliverSourceReplyViaMessageTool ? { didDeliverSourceReplyViaMessageTool: true } : {},
		...output.messagingToolSentTexts?.length ? { messagingToolSentTexts: output.messagingToolSentTexts } : {},
		...output.messagingToolSentMediaUrls?.length ? { messagingToolSentMediaUrls: output.messagingToolSentMediaUrls } : {},
		...output.messagingToolSentTargets?.length ? { messagingToolSentTargets: output.messagingToolSentTargets } : {},
		...output.messagingToolSourceReplyPayloads?.length ? { messagingToolSourceReplyPayloads: output.messagingToolSourceReplyPayloads } : {}
	};
}
function settleCliBackendOutcome(params) {
	const { cleanupError, deliveredMessagingSideEffect, diagnosticLifecycle, failoverContext, runError, runFailed, runResult } = params;
	if (cleanupError) {
		if (!deliveredMessagingSideEffect) {
			if (runFailed) log$2.warn(`CLI run also failed before backend cleanup: ${formatErrorMessage(runError)}`);
			diagnosticLifecycle?.setPhase("cleanup");
			throw cleanupError;
		}
		log$2.warn(`CLI backend cleanup failed after confirmed message delivery: ${formatErrorMessage(cleanupError)}`);
	}
	if (runFailed) throw coerceToFailoverError(runError, failoverContext) ?? runError;
	if (!runResult) throw new Error("CLI run completed without a result");
	return runResult;
}
//#endregion
//#region src/agents/cli-runner/cli-run-transcript.ts
const log$1 = createSubsystemLogger("agents/cli-runner");
function buildCliHookUserMessage(prompt) {
	return {
		role: "user",
		content: prompt,
		timestamp: Date.now()
	};
}
function buildCliHookAssistantMessage(params) {
	return {
		role: "assistant",
		content: [{
			type: "text",
			text: params.text
		}],
		api: "responses",
		provider: params.provider,
		model: params.model,
		...params.usage ? { usage: params.usage } : {},
		stopReason: "stop",
		timestamp: Date.now()
	};
}
function isAgentMessage(value) {
	return Boolean(value && typeof value === "object" && "role" in value);
}
function buildCliContextEngineUserMessage(prompt) {
	return {
		role: "user",
		content: prompt,
		timestamp: Date.now()
	};
}
function buildCliContextEngineAssistantMessage(params) {
	return buildCliHookAssistantMessage(params);
}
function shouldAwaitCliAgentEndHook(params) {
	return !params.messageChannel && !params.messageProvider;
}
async function runCliAgentEndHook(params, hookParams) {
	if (shouldAwaitCliAgentEndHook(params)) {
		await awaitAgentEndSideEffects(hookParams);
		return;
	}
	runAgentEndSideEffects(hookParams);
}
async function persistApprovedCliUserTurnTranscript(params) {
	const recorder = params.userTurnTranscriptRecorder;
	const reusingPersistedTurn = params.suppressNextUserMessagePersistence === true;
	if (!recorder || reusingPersistedTurn && !recorder.hasPersisted()) return recorder?.isBlocked() === true;
	const persisted = await recorder.persistApproved({ cwd: params.cwd ?? params.workspaceDir });
	if (!persisted && !recorder.hasPersisted() && await recorder.resolveMessage()) recorder.markBlocked();
	if (persisted && !reusingPersistedTurn) try {
		const notification = params.onUserMessagePersisted?.(persisted.message);
		if (notification) Promise.resolve(notification).catch((error) => {
			log$1.warn(`CLI user turn persistence notification failed: ${formatErrorMessage(error)}`);
		});
	} catch (error) {
		log$1.warn(`CLI user turn persistence notification failed: ${formatErrorMessage(error)}`);
	}
	return persisted !== void 0 || recorder.hasPersisted() || recorder.isBlocked();
}
async function persistCliAssistantTranscript(params) {
	const { runParams } = params;
	if (runParams.currentInboundEventKind === "room_event") {
		const admission = runParams.userTurnTranscriptRecorder?.getAdmissionReceipt();
		return {
			owned: true,
			...admission ? { terminalAnchor: admission } : {}
		};
	}
	if (!params.text) {
		const admission = runParams.userTurnTranscriptRecorder?.getAdmissionReceipt();
		return {
			owned: false,
			...admission ? { terminalAnchor: admission } : {}
		};
	}
	if (!runParams.persistAssistantTranscript || !runParams.sessionKey) return { owned: false };
	try {
		const result = await appendExactAssistantMessageToSessionTranscript({
			sessionKey: runParams.sessionKey,
			agentId: runParams.agentId,
			expectedSessionId: runParams.sessionId,
			...runParams.expectedLifecycleRevision !== void 0 ? { expectedLifecycleRevision: runParams.expectedLifecycleRevision } : {},
			...runParams.expectedWriterRunId !== void 0 ? { expectedWriterRunId: runParams.expectedWriterRunId } : {},
			storePath: runParams.storePath,
			idempotencyKey: `cli-assistant:${runParams.runId}`,
			config: runParams.config,
			beforeMessageWrite: runAgentHarnessBeforeMessageWriteHook,
			message: buildAssistantMessage({
				model: {
					api: "cli",
					provider: runParams.provider,
					id: params.modelId
				},
				content: [{
					type: "text",
					text: params.text
				}],
				stopReason: "stop",
				usage: buildUsageWithNoCost({
					input: params.usage?.input,
					output: params.usage?.output,
					cacheRead: params.usage?.cacheRead,
					cacheWrite: params.usage?.cacheWrite,
					totalTokens: params.usage?.total
				})
			})
		});
		if (!result.ok) {
			log$1.warn(`CLI assistant transcript persistence skipped: ${result.reason}`);
			return { owned: result.code === "blocked" || result.code === "session-rebound" };
		}
		return {
			owned: true,
			...result.anchor ? { terminalAnchor: result.anchor } : {}
		};
	} catch (error) {
		log$1.warn(`CLI assistant transcript persistence failed: ${formatErrorMessage(error)}`);
		return { owned: false };
	}
}
async function notifyCliUserMessagePersisted(params, message, context) {
	try {
		await Promise.resolve(params.onUserMessagePersisted?.(message));
	} catch (err) {
		log$1.warn(`${context} notification failed: ${formatErrorMessage(err)}`);
	}
}
async function persistCliRunBlock(params, block) {
	const nowMs = Date.now();
	const redactedUserMessage = {
		role: "user",
		content: [{
			type: "text",
			text: block.message
		}],
		timestamp: nowMs,
		idempotencyKey: `hook-block:before_agent_run:user:${params.runId}`,
		__openclaw: { beforeAgentRunBlocked: {
			blockedBy: block.pluginId,
			blockedAt: nowMs
		} }
	};
	try {
		const persisted = await params.userTurnTranscriptRecorder?.persistBlocked(redactedUserMessage);
		if (persisted) {
			await notifyCliUserMessagePersisted(params, persisted.message, "before_agent_run block user-turn persistence");
			return;
		}
	} catch (err) {
		log$1.warn(`before_agent_run block: failed to persist canonical CLI user message: ${formatErrorMessage(err)}`);
	}
	try {
		const sessionKey = params.sessionKey?.trim() || params.sessionId;
		const targetAgentId = params.sessionTarget?.agentId;
		const targetStorePath = params.sessionTarget?.storePath;
		const targetStoreOwner = resolvePersistedSessionStoreOwnerForTarget({
			config: params.config ?? {},
			sessionKey,
			storePath: targetStorePath
		});
		const agentId = (targetAgentId && targetStorePath && !parseAgentSessionKey(sessionKey)?.agentId && targetStoreOwner.kind === "none" ? targetAgentId : void 0) ?? resolveSessionAgentId({
			agentId: targetAgentId ?? params.agentId,
			config: params.config,
			sessionKey
		});
		let sessionManager = params.sessionManager;
		if (!sessionManager) {
			const sessionTarget = params.sessionTarget ?? {
				agentId,
				sessionId: params.sessionId,
				sessionKey,
				storePath: params.storePath ?? resolveSessionStorePathCore(params.config?.session?.store, { agentId })
			};
			if ((await patchSessionEntryCore(sessionTarget, (entry, patchContext) => {
				if (patchContext.existingEntry && entry.sessionId !== sessionTarget.sessionId) return null;
				return {
					sessionId: sessionTarget.sessionId,
					updatedAt: Date.now()
				};
			}, {
				fallbackEntry: params.sessionEntry ? void 0 : {
					sessionId: sessionTarget.sessionId,
					updatedAt: Date.now()
				},
				skipMaintenance: true
			}))?.sessionId !== sessionTarget.sessionId) return;
			sessionManager = SessionManager.open(sessionTarget);
		}
		sessionManager.appendMessage(redactedUserMessage);
		sessionManager.flushPendingPersistence();
	} catch (err) {
		log$1.warn(`before_agent_run block: failed to persist redacted CLI user message: ${formatErrorMessage(err)}`);
	}
}
async function finalizeCliContextEngineTurn(params) {
	const { context } = params;
	if (!context.contextEngine) return;
	const { params: runParams } = context;
	const prePromptMessages = params.historyMessages.filter(isAgentMessage);
	const turnMessages = [];
	if (context.contextEngineTurnPrompt) turnMessages.push(buildCliContextEngineUserMessage(context.contextEngineTurnPrompt));
	if (params.assistantText) turnMessages.push(buildCliContextEngineAssistantMessage({
		text: params.assistantText,
		provider: runParams.provider,
		model: context.modelId,
		usage: params.output.usage
	}));
	const contextEngineHostSupport = buildGenericCliContextEngineHostSupport({ backendId: context.backendResolved.id });
	const finalizeTurn = async (transcript) => {
		let deferredTurnMaintenance;
		if ((await finalizeHarnessContextEngineTurn({
			contextEngine: context.contextEngine,
			promptError: false,
			aborted: runParams.abortSignal?.aborted === true,
			yieldAborted: false,
			sessionIdUsed: runParams.sessionId,
			sessionKey: runParams.sessionKey,
			sessionFile: runParams.sessionFile,
			isHeartbeat: isHeartbeatLifecycleRunKind(runParams.bootstrapContextRunKind),
			messagesSnapshot: transcript.messagesSnapshot,
			prePromptMessageCount: transcript.prePromptMessageCount,
			sessionManager: transcript.sessionManager,
			config: context.contextEngineConfig,
			contextEngineHostSupport,
			providerId: runParams.provider,
			modelId: context.modelId,
			runMaintenance: async (maintenanceParams) => await runHarnessContextEngineMaintenance({
				...maintenanceParams,
				withSessionManagerRewriteLock: transcript.withSessionManagerRewriteLock,
				onDeferredMaintenance: (promise) => {
					deferredTurnMaintenance = promise;
				}
			}),
			warn: (message) => log$1.warn(message)
		})).postTurnFinalizationSucceeded && deferredTurnMaintenance) context.contextEngineDeferredTurnMaintenance = deferredTurnMaintenance;
	};
	const admission = runParams.userTurnTranscriptRecorder?.getAdmissionReceipt();
	if (runParams.onContextEngineTurnCandidate) {
		if (admission && params.terminalAnchor) runParams.onContextEngineTurnCandidate({
			boundary: {
				admission,
				terminal: params.terminalAnchor
			},
			sessionIdUsed: runParams.sessionId,
			sessionKey: runParams.sessionKey,
			sessionTarget: runParams.sessionTarget,
			sessionFile: runParams.sessionFile,
			promptError: false,
			aborted: runParams.abortSignal?.aborted === true,
			yieldAborted: false,
			contextEngineHostSupport,
			providerId: runParams.provider,
			modelId: context.modelId,
			config: context.contextEngineConfig,
			isHeartbeat: isHeartbeatLifecycleRunKind(runParams.bootstrapContextRunKind)
		});
	} else await finalizeTurn({
		messagesSnapshot: [...prePromptMessages, ...turnMessages],
		prePromptMessageCount: prePromptMessages.length,
		withSessionManagerRewriteLock: async (operation) => await operation()
	});
}
//#endregion
//#region src/agents/cli-runner/run-diagnostics.ts
/** Trusted run hierarchy for Claude Code CLI-backed agent turns. */
function diagnosticBase(params, trace) {
	const channel = params.messageChannel ?? params.messageProvider;
	return {
		runId: params.runId,
		sessionId: params.sessionId,
		...params.sessionKey ? { sessionKey: params.sessionKey } : {},
		provider: params.modelProvider ?? "anthropic",
		...params.model ? { model: params.model } : {},
		...params.trigger ? { trigger: params.trigger } : {},
		...channel ? { channel } : {},
		trace
	};
}
function resultRunOutcome(result) {
	if (result.meta.livenessState === "blocked") return "blocked";
	if (result.meta.aborted === true) return "aborted";
	if (result.meta.error) return "error";
	return "completed";
}
function errorHarnessOutcome(error, abortSignal) {
	const failureKind = diagnosticErrorFailureKind(error);
	if (failureKind === "timeout") return "timed_out";
	if (failureKind === "aborted") return abortSignal?.aborted && isSignalTimeoutReason(abortSignal.reason) ? "timed_out" : "aborted";
	if (abortSignal?.aborted === true) return isSignalTimeoutReason(abortSignal.reason) ? "timed_out" : "aborted";
	if (isTimeoutError(error)) return "timed_out";
	return "error";
}
/**
* Wraps one OpenClaw Claude CLI turn in synthetic harness/run boundaries.
* The child run scope makes every real Claude CLI model call nest beneath it.
*/
async function runClaudeCliAgentTurnWithDiagnostics(params, run) {
	const harnessTrace = freezeDiagnosticTraceContext(createDiagnosticTraceContextFromActiveScope());
	const runTrace = freezeDiagnosticTraceContext(createChildDiagnosticTraceContext(harnessTrace));
	const harnessBase = {
		...diagnosticBase(params, harnessTrace),
		harnessId: "claude-cli"
	};
	const runBase = diagnosticBase(params, runTrace);
	const startedAt = Date.now();
	let phase = "prepare";
	emitTrustedDiagnosticEvent({
		type: "harness.run.started",
		...harnessBase
	});
	emitTrustedDiagnosticEvent({
		type: "run.started",
		...runBase
	});
	try {
		const result = await runWithDiagnosticTraceContext(runTrace, () => run({ setPhase: (nextPhase) => {
			phase = nextPhase;
		} }));
		const runOutcome = resultRunOutcome(result);
		const resultErrorMessage = result.meta.error?.message;
		const runErrorMessage = runOutcome === "error" ? resultErrorMessage : void 0;
		emitTrustedDiagnosticEventWithPrivateData({
			type: "run.completed",
			...runBase,
			durationMs: Date.now() - startedAt,
			outcome: runOutcome,
			...runOutcome === "blocked" ? { blockedBy: "before_agent_run" } : {},
			...runOutcome === "error" && result.meta.error ? { errorCategory: result.meta.error.kind } : {}
		}, runErrorMessage ? { errorMessage: runErrorMessage } : void 0);
		emitTrustedDiagnosticEventWithPrivateData({
			type: "harness.run.completed",
			...harnessBase,
			durationMs: Date.now() - startedAt,
			outcome: result.meta.timeoutPhase !== void 0 ? "timed_out" : runOutcome === "aborted" ? "aborted" : runOutcome === "completed" ? "completed" : "error",
			...typeof result.meta.yielded === "boolean" ? { yieldDetected: result.meta.yielded } : {}
		}, resultErrorMessage && (runOutcome === "error" || runOutcome === "blocked") ? { errorMessage: resultErrorMessage } : void 0);
		return result.diagnosticTrace ? result : {
			...result,
			diagnosticTrace: harnessTrace
		};
	} catch (error) {
		const errorMessage = diagnosticErrorMessage(error);
		const harnessOutcome = errorHarnessOutcome(error, params.abortSignal);
		emitTrustedDiagnosticEventWithPrivateData({
			type: "run.completed",
			...runBase,
			durationMs: Date.now() - startedAt,
			outcome: harnessOutcome === "error" ? "error" : "aborted",
			...harnessOutcome === "error" ? { errorCategory: diagnosticErrorCategory(error) } : {}
		}, errorMessage ? { errorMessage } : void 0);
		if (harnessOutcome === "error") emitTrustedDiagnosticEventWithPrivateData({
			type: "harness.run.error",
			...harnessBase,
			durationMs: Date.now() - startedAt,
			phase,
			errorCategory: diagnosticErrorCategory(error)
		}, errorMessage ? { errorMessage } : void 0);
		else emitTrustedDiagnosticEvent({
			type: "harness.run.completed",
			...harnessBase,
			durationMs: Date.now() - startedAt,
			outcome: harnessOutcome
		});
		throw error;
	}
}
//#endregion
//#region src/agents/cli-runner.ts
/**
* Top-level CLI-backed agent runner orchestration.
*/
const log = createSubsystemLogger("agents/cli-runner");
const cliRunnerDeps = cliRunSettlementDeps;
/** Checks whether a Claude CLI session binding has reached its transcript file. */
async function isCliBindingFlushed(sessionId, provider, workspaceDir, options) {
	if (!provider || !isClaudeCliBackend(provider)) return true;
	if (!sessionId) return false;
	if (options?.skipTranscriptProbe) return true;
	for (const delayMs of [
		0,
		50,
		150
	]) {
		if (delayMs > 0) await cliRunnerDeps.delay(delayMs);
		if (await cliRunnerDeps.claudeCliSessionTranscriptHasContent({
			sessionId,
			workspaceDir
		})) return true;
	}
	return false;
}
/** Prepares and runs one CLI-backed agent turn. */
function runCliAgent(paramsInput) {
	const lifecycleGeneration = paramsInput.lifecycleGeneration ?? captureAgentRunLifecycleGeneration(paramsInput.runId);
	const params = {
		...paramsInput,
		lifecycleGeneration
	};
	return withAgentRunLifecycleGeneration(lifecycleGeneration, () => isClaudeCliBackend(params.provider) && areDiagnosticsEnabledForProcess() && hasInternalDiagnosticEventListeners() ? runClaudeCliAgentTurnWithDiagnostics(params, (diagnosticLifecycle) => runCliAgentInternal(params, diagnosticLifecycle)) : runCliAgentInternal(params));
}
async function runCliAgentInternal(params, diagnosticLifecycle) {
	assertAgentRunLifecycleGenerationCurrent(params.lifecycleGeneration);
	params.onExecutionStarted?.();
	const hookStartedAt = Date.now();
	const hookResult = params.isolatedCompletion || params.controlOperation ? void 0 : await runBeforeAgentReplyForTurn({
		runId: params.runId,
		trigger: params.trigger,
		event: { cleanedBody: params.prompt },
		context: {
			runId: params.runId,
			jobId: params.jobId,
			agentId: params.agentId,
			sessionKey: params.sessionKey,
			sessionId: params.sessionId,
			workspaceDir: params.workspaceDir,
			trigger: params.trigger,
			...buildAgentHookContextChannelFields(params),
			...buildAgentHookContextIdentityFields({
				trigger: params.trigger,
				senderId: params.senderId,
				chatId: params.chatId,
				channelContext: params.channelContext
			})
		},
		onDispatch: () => params.onExecutionPhase?.({
			phase: "before_agent_reply",
			provider: params.provider,
			model: params.model ?? ""
		}),
		onDeclined: () => params.onExecutionPhase?.({
			phase: "runtime_plugins",
			provider: params.provider,
			model: params.model ?? ""
		})
	});
	if (hookResult?.handled) {
		const finalText = hookResult.reply?.text ?? "NO_REPLY";
		const sessionBindingDisabled = resolveCliBackendConfig(params.provider, params.config, { agentId: params.agentId })?.config.sessionMode === "none";
		cliBackendLog.info(`cli synthetic turn: provider=${params.provider} model=<synthetic> requestedModel=${params.model ?? ""} durationMs=${Date.now() - hookStartedAt} ${formatCliBackendOutputDigest(finalText)}`);
		return {
			payloads: buildHandledBeforeAgentReplyPayloads(hookResult.reply),
			meta: {
				durationMs: Date.now() - hookStartedAt,
				agentMeta: {
					sessionId: "",
					provider: params.provider,
					model: params.model ?? "",
					...sessionBindingDisabled ? { clearCliSessionBinding: true } : {}
				},
				finalAssistantVisibleText: finalText,
				finalAssistantRawText: finalText
			}
		};
	}
	const { prepareCliRunContext } = await import("./prepare.runtime.js");
	let context;
	try {
		context = await prepareCliRunContext(params);
	} catch (error) {
		await settleCliPreparationError(error, params);
		throw error;
	}
	return await settlePreparedCliRun({
		context,
		diagnosticLifecycle,
		run: async () => await runPreparedCliAgent(context, diagnosticLifecycle)
	});
}
/** Runs an already-prepared CLI agent context through hooks and execution. */
async function runPreparedCliAgent(context, diagnosticLifecycle) {
	const { executePreparedCliRun } = await import("./execute.runtime.js");
	const { params } = context;
	const cliFailoverContext = {
		provider: params.provider,
		model: context.modelId,
		sessionId: params.sessionId,
		lane: params.lane
	};
	const sessionBindingDisabled = context.preparedBackend.backend.sessionMode === "none";
	const preparedContextAgentMeta = isClaudeCliBackend(params.provider) && context.contextWindowInfo ? { contextTokens: context.contextWindowInfo.tokens } : {};
	const isolatedCompletion = params.isolatedCompletion === true;
	const controlOperation = params.controlOperation !== void 0;
	const turnSideEffectsDisabled = isolatedCompletion || controlOperation;
	const hookRunner = turnSideEffectsDisabled ? void 0 : getGlobalHookRunner();
	const hasLlmInputHooks = hookRunner?.hasHooks("llm_input") === true;
	const hasLlmOutputHooks = hookRunner?.hasHooks("llm_output") === true;
	const hasAgentEndHooks = hookRunner?.hasHooks("agent_end") === true;
	const hasBeforeAgentRunHooks = hookRunner?.hasHooks("before_agent_run") === true;
	const needsHookHistory = hasLlmInputHooks || hasAgentEndHooks || hasBeforeAgentRunHooks;
	if (!turnSideEffectsDisabled) await waitForDeferredTurnMaintenanceForSession(params.sessionKey ?? params.sessionId);
	const historyMessages = needsHookHistory ? await loadCliSessionHistoryMessages({
		sessionId: params.sessionId,
		sessionFile: params.sessionFile,
		sessionKey: params.sessionKey,
		agentId: params.agentId,
		config: params.config
	}) : [];
	const llmInputEvent = {
		runId: params.runId,
		sessionId: params.sessionId,
		provider: params.provider,
		model: context.modelId,
		systemPrompt: context.systemPrompt,
		prompt: params.prompt,
		historyMessages,
		imagesCount: params.images?.length ?? 0
	};
	const hookContext = {
		runId: params.runId,
		jobId: params.jobId,
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		sessionId: params.sessionId,
		...params.agentHarnessId ? { agentHarnessId: params.agentHarnessId } : {},
		...params.agentHarnessEpoch ? { agentHarnessEpoch: params.agentHarnessEpoch } : {},
		workspaceDir: params.workspaceDir,
		trigger: params.trigger,
		...params.config ? { config: params.config } : {},
		...context.contextWindowInfo?.tokens ? { contextTokenBudget: context.contextWindowInfo.tokens } : {},
		...context.contextWindowInfo?.source ? { contextWindowSource: context.contextWindowInfo.source } : {},
		...context.contextWindowInfo?.referenceTokens ? { contextWindowReferenceTokens: context.contextWindowInfo.referenceTokens } : {},
		...buildAgentHookContextChannelFields(params),
		...buildAgentHookContextIdentityFields({
			trigger: params.trigger,
			senderId: params.senderId,
			chatId: params.chatId,
			channelContext: params.channelContext
		})
	};
	const buildAgentEndMessages = (lastAssistant) => [...buildAgentHookConversationMessages({
		historyMessages,
		currentTurnMessages: [buildCliHookUserMessage(params.prompt), ...lastAssistant ? [lastAssistant] : []]
	})];
	const buildFailedAgentEndEvent = (error) => ({
		messages: buildAgentEndMessages(),
		success: false,
		terminal: true,
		error,
		durationMs: Date.now() - context.started
	});
	const buildBlockedAgentEndEvent = (message) => ({
		messages: buildAgentHookConversationMessages({
			historyMessages,
			currentTurnMessages: [buildCliHookUserMessage(message)]
		}),
		success: false,
		terminal: true,
		error: message,
		durationMs: Date.now() - context.started
	});
	let deliveredMessagingSideEffect = false;
	let userTurnHandled = false;
	const executeCliAttempt = async (cliSessionIdToUse, options) => {
		const timeoutMs = options?.timeoutMs ?? params.timeoutMs;
		const forkCliSessionOnResume = options?.forkCliSessionOnResume ?? context.params.forkCliSessionOnResume;
		const cliSessionResumeAt = cliSessionIdToUse && forkCliSessionOnResume ? options?.resumeAt ?? context.params.cliSessionResumeAt ?? context.params.cliSessionBinding?.resumeCheckpointId : void 0;
		const persistCliSessionForkSuccessor = options?.onForkSuccessorPersisted && context.params.persistCliSessionForkSuccessor ? async (sessionId) => {
			await context.params.persistCliSessionForkSuccessor?.(sessionId);
			options.onForkSuccessorPersisted?.(sessionId);
		} : context.params.persistCliSessionForkSuccessor;
		const attemptContext = timeoutMs === params.timeoutMs && forkCliSessionOnResume === context.params.forkCliSessionOnResume && cliSessionResumeAt === context.params.cliSessionResumeAt && persistCliSessionForkSuccessor === context.params.persistCliSessionForkSuccessor ? context : {
			...context,
			params: {
				...context.params,
				timeoutMs,
				forkCliSessionOnResume,
				cliSessionResumeAt,
				persistCliSessionForkSuccessor
			}
		};
		diagnosticLifecycle?.setPhase("send");
		const output = await executePreparedCliRun(attemptContext, cliSessionIdToUse, diagnosticLifecycle ? { onPhase: diagnosticLifecycle.setPhase } : void 0);
		diagnosticLifecycle?.setPhase("resolve");
		const sourceReplyMirror = resolveCliSourceReplyMirror({
			evidence: output,
			runParams: params,
			modelId: context.modelId
		});
		const assistantText = sourceReplyMirror.delivered ? sourceReplyMirror.visibleText ?? "" : output.text.trim();
		if (!assistantText && !output.didSendViaMessagingTool && params.allowEmptyAssistantReplyAsSilent !== true) {
			const process = output.diagnostics?.process;
			if (process) {
				const diagnostics = [
					`backend=${process.backendId}`,
					`reason=${process.processReason}`,
					`exitCode=${process.exitCode ?? "null"}`,
					`exitSignal=${process.exitSignal ?? "null"}`,
					`durationMs=${process.durationMs}`,
					`stdoutBytes=${process.stdoutBytes}`,
					`stdoutHash=${process.stdoutHash}`,
					`stderrBytes=${process.stderrBytes}`,
					`stderrHash=${process.stderrHash}`,
					`useResume=${process.useResume ? "true" : "false"}`
				].join(" ");
				cliBackendLog.warn(`cli empty response diagnostics: ${diagnostics}`);
			}
			throw attachCliMessagingDeliveryEvidence(createCliFailoverError("CLI backend returned an empty response.", "empty_response", cliFailoverContext), output);
		}
		const assistantTexts = assistantText ? [assistantText] : [];
		const lastAssistant = assistantText.length > 0 ? buildCliHookAssistantMessage({
			text: assistantText,
			provider: params.provider,
			model: context.modelId,
			usage: output.usage
		}) : void 0;
		if (assistantText.length > 0 && hasLlmOutputHooks) runAgentHarnessLlmOutputHook({
			event: {
				runId: params.runId,
				sessionId: params.sessionId,
				provider: params.provider,
				model: context.modelId,
				...context.contextWindowInfo?.tokens ? { contextTokenBudget: context.contextWindowInfo.tokens } : {},
				...context.contextWindowInfo?.source ? { contextWindowSource: context.contextWindowInfo.source } : {},
				...context.contextWindowInfo?.referenceTokens ? { contextWindowReferenceTokens: context.contextWindowInfo.referenceTokens } : {},
				resolvedRef: `${params.provider}/${context.modelId}`,
				assistantTexts,
				...lastAssistant ? { lastAssistant } : {},
				...output.usage ? { usage: output.usage } : {}
			},
			ctx: hookContext,
			hookRunner
		});
		return {
			output,
			assistantText,
			lastAssistant,
			sourceReplyWasDelivered: sourceReplyMirror.delivered,
			usedHistoryPrompt: cliSessionIdToUse === void 0 && context.openClawHistoryPrompt !== void 0
		};
	};
	const executeRun = async () => {
		if (isolatedCompletion) {
			const { output, usedHistoryPrompt } = await executeCliAttempt();
			return buildCliRunResult({
				context,
				output,
				bindingFlushOk: true,
				assistantTranscriptOwned: false,
				usedHistoryPrompt,
				userTurnHandled,
				sessionBindingDisabled,
				preparedContextAgentMeta
			});
		}
		if (controlOperation) {
			const reusableCliSessionId = resolveCliSessionId(context.reusableCliSession);
			if (!reusableCliSessionId) throw new Error(`CLI backend ${context.backendResolved.id} cannot ${params.controlOperation} without a reusable native session.`);
			const { output, usedHistoryPrompt } = await executeCliAttempt(reusableCliSessionId);
			return buildCliRunResult({
				context,
				output,
				effectiveCliSessionId: reusableCliSessionId,
				bindingFlushOk: true,
				assistantTranscriptOwned: false,
				usedHistoryPrompt,
				userTurnHandled,
				sessionBindingDisabled,
				preparedContextAgentMeta
			});
		}
		await bootstrapHarnessContextEngine({
			hadSessionFile: context.hadSessionFile,
			contextEngine: context.contextEngine,
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			sessionFile: params.sessionFile,
			config: context.contextEngineConfig,
			contextEngineHostSupport: buildGenericCliContextEngineHostSupport({ backendId: context.backendResolved.id }),
			providerId: params.provider,
			modelId: context.modelId,
			warn: (message) => log.warn(message)
		});
		const contextEngineHistoryMessages = context.contextEngine ? await loadCliSessionContextEngineMessages({
			sessionId: params.sessionId,
			sessionFile: params.sessionFile,
			sessionKey: params.sessionKey,
			agentId: params.agentId,
			config: params.config
		}) : [];
		const finishCliAttempt = async (result, fallbackCliSessionId) => {
			const { output, assistantText, lastAssistant, sourceReplyWasDelivered, usedHistoryPrompt } = result;
			try {
				await assertCliRuntimeBinding(context);
				const effectiveCliSessionId = output.sessionId ?? fallbackCliSessionId;
				const assistantTranscript = await persistCliAssistantTranscript({
					runParams: params,
					text: sourceReplyWasDelivered ? "" : assistantText,
					modelId: context.modelId,
					usage: output.usage
				});
				await finalizeCliContextEngineTurn({
					context,
					historyMessages: context.contextEngine ? contextEngineHistoryMessages : historyMessages,
					assistantText,
					terminalAnchor: assistantTranscript.terminalAnchor,
					output
				});
				const bindingFlushOk = sessionBindingDisabled ? true : await isCliBindingFlushed(effectiveCliSessionId, params.provider, context.cwd ?? context.workspaceDir, { skipTranscriptProbe: acceptsClaudeLive(context) });
				await runCliAgentEndHook(params, {
					event: {
						messages: buildAgentEndMessages(lastAssistant),
						success: true,
						terminal: true,
						durationMs: Date.now() - context.started
					},
					ctx: hookContext,
					hookRunner
				});
				return buildCliRunResult({
					context,
					output,
					effectiveCliSessionId,
					bindingFlushOk,
					assistantTranscriptOwned: assistantTranscript.owned,
					usedHistoryPrompt,
					userTurnHandled,
					sessionBindingDisabled,
					preparedContextAgentMeta
				});
			} catch (error) {
				throw attachCliMessagingDeliveryEvidence(error, output);
			}
		};
		const finishDeliveredFailure = async (error) => {
			const evidence = getCliMessagingDeliveryEvidence(error);
			if (!evidence) return;
			await runCliAgentEndHook(params, {
				event: buildFailedAgentEndEvent(formatErrorMessage(error)),
				ctx: hookContext,
				hookRunner
			});
			deliveredMessagingSideEffect = true;
			return buildCliDeliveredFailure({
				error,
				evidence,
				context,
				preparedContextAgentMeta,
				sessionBindingDisabled,
				reusableCliSessionId: resolveCliSessionId(context.reusableCliSession)
			});
		};
		if (hasBeforeAgentRunHooks && hookRunner) {
			let beforeRunResult;
			try {
				beforeRunResult = await hookRunner.runBeforeAgentRun({
					prompt: params.prompt,
					systemPrompt: context.systemPrompt,
					messages: buildAgentHookConversationMessages({
						historyMessages,
						currentTurnMessages: []
					}),
					channelId: hookContext.channelId,
					accountId: params.agentAccountId,
					senderId: params.senderId ?? void 0,
					senderIsOwner: params.senderIsOwner ?? void 0
				}, buildAgentHookContext(hookContext));
			} catch {
				const blockMessage = resolveBlockMessage({
					outcome: "block",
					reason: "before_agent_run hook failed"
				}, { blockedBy: "before_agent_run" });
				await persistCliRunBlock(params, {
					message: blockMessage,
					pluginId: "before_agent_run"
				});
				await runCliAgentEndHook(params, {
					event: buildBlockedAgentEndEvent(blockMessage),
					ctx: hookContext,
					hookRunner
				});
				return buildBlockedCliRunResult({
					message: blockMessage,
					context,
					preparedContextAgentMeta,
					sessionBindingDisabled
				});
			}
			const beforeRunDecision = beforeRunResult?.decision;
			if (beforeRunDecision?.outcome === "block") {
				const blockMessage = resolveBlockMessage(beforeRunDecision, { blockedBy: beforeRunResult?.pluginId ?? "unknown" });
				await persistCliRunBlock(params, {
					message: blockMessage,
					pluginId: beforeRunResult?.pluginId ?? "unknown"
				});
				await runCliAgentEndHook(params, {
					event: buildBlockedAgentEndEvent(blockMessage),
					ctx: hookContext,
					hookRunner
				});
				return buildBlockedCliRunResult({
					message: blockMessage,
					context,
					preparedContextAgentMeta,
					sessionBindingDisabled
				});
			}
		}
		userTurnHandled = await persistApprovedCliUserTurnTranscript(params);
		runAgentHarnessLlmInputHook({
			event: llmInputEvent,
			ctx: hookContext,
			hookRunner
		});
		return await runCliRecovery({
			context,
			executeAttempt: executeCliAttempt,
			finishAttempt: finishCliAttempt,
			finishDeliveredFailure,
			onTerminalFailure: async (error) => {
				await runCliAgentEndHook(params, {
					event: buildFailedAgentEndEvent(formatErrorMessage(error)),
					ctx: hookContext,
					hookRunner
				});
			}
		});
	};
	let runResult;
	let runError;
	let runFailed = false;
	try {
		runResult = await executeRun();
	} catch (error) {
		runFailed = true;
		runError = error;
	}
	let cleanupError;
	try {
		await context.preparedBackend.cleanup?.();
	} catch (error) {
		cleanupError = error;
	}
	return settleCliBackendOutcome({
		runResult,
		runError,
		runFailed,
		cleanupError,
		deliveredMessagingSideEffect,
		diagnosticLifecycle,
		failoverContext: cliFailoverContext
	});
}
//#endregion
export { runCliAgent as n, runPreparedCliAgent as r, isCliBindingFlushed as t };
