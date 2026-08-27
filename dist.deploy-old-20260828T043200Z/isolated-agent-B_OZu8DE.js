import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.js";
import { _ as resolvePrimaryStringValue, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { t as isFastTestRuntimeEnv } from "./test-runtime-env-DQDRzsLt.js";
import "./env-ChWDbSFK.js";
import { l as asNonNegativeFiniteNumber, n as MAX_TIMER_TIMEOUT_MS, u as asPositiveFiniteNumber } from "./number-coercion-CLj0HTDM.js";
import "./utils-Bw16L5tB.js";
import { a as resolveAgentModelPrimaryValue } from "./model-input-ILUprkGk.js";
import { _ as resolveSubagentModelConfigSelectionResult } from "./agent-scope-DigoIwHb.js";
import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
import { b as tryResolveAmbientOwnerAgentId, f as resolveAgentWorkspaceDir, l as resolveAgentDir, s as resolveAgentConfig } from "./agent-scope-config-CUBiGmG3.js";
import { c as parseAgentSessionKey, i as isCronSessionKey } from "./session-key-utils-Di3FvABa.js";
import { C as createChildDiagnosticTraceContext, D as freezeDiagnosticTraceContext, f as isDiagnosticsEnabled, o as emitTrustedDiagnosticEvent } from "./diagnostic-events-BGzDm6gu.js";
import { i as isSilentReplyPayloadText, n as SILENT_REPLY_TOKEN } from "./tokens-DbQz-n_m.js";
import { S as findModelInCatalog, _ as resolveConfiguredModelRef, g as resolveConfiguredModelPolicyAllow, s as getModelRefStatus, v as resolveHooksGmailModel } from "./model-selection-shared-I5TmV9jL.js";
import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "./defaults-CdX9UGcX.js";
import { S as selectApplicableRuntimeConfig, a as getRuntimeConfigSnapshot, c as getRuntimeConfigSourceSnapshot } from "./runtime-snapshot-Cv5MaU8U.js";
import { s as normalizeThinkLevel } from "./thinking.shared-bHYuuc1L.js";
import { i as logWarn } from "./logger-D4iLuGk3.js";
import { g as withAgentRunLifecycleGeneration, s as getAgentEventLifecycleGeneration, t as assertAgentRunLifecycleGenerationCurrent } from "./agent-events-CcZImb5w.js";
import { a as consumeCronNextCheckProposal, n as claimAgentRunContext, s as getAgentRunContext, v as releaseAgentRunContext } from "./agent-run-registry-t4kvUyNQ.js";
import { u as withPluginRuntimeRegistryScope } from "./gateway-request-scope-B19X7f09.js";
import { D as isDetachedCronSessionTarget, z as resolveCronScheduledToolPolicy } from "./row-codec-LoN9q1nV.js";
import "./config-B2bSneS2.js";
import { n as beginSessionWorkAdmission } from "./session-lifecycle-admission-1qqb7Ac0.js";
import { a as isAgentHarnessSessionKey, n as AGENT_HARNESS_SESSION_ID_LOCKED_MESSAGE, r as AGENT_HARNESS_SESSION_KEY_RESERVED_MESSAGE } from "./agent-harness-session-key-Bf-Q9dw5.js";
import { i as hasNonzeroUsage, r as deriveSessionTotalTokens, t as deriveContextPromptTokens } from "./usage-DNKCVmJi.js";
import "./sessions-CdrF1uzY.js";
import { s as resolveSessionWorkStartError } from "./lifecycle-DzPMUp4j.js";
import { n as resolveTrustedSessionContextTokens, t as resolveProjectedSessionContextTokens } from "./context-token-provenance-B2eCPcfc.js";
import { t as hasAnyAuthProfileStoreSource } from "./source-check-CdyIgAMR.js";
import { t as publishedModelCatalogOwnerMatchesAgent } from "./prepared-model-catalog-owner-BVMJbn_l.js";
import { c as loadProviderScopedThinkingCatalog, d as loadResolvedPublishedModelCatalogOwner } from "./prepared-model-catalog-U3rYWrrQ.js";
import { n as mapHookExternalContentSource, r as resolveHookExternalContentSource, t as isExternalHookSession } from "./external-content-source-DI01uOKv.js";
import { n as isThinkingLevelSupported, o as resolveSupportedThinkingLevel } from "./thinking-CNREPJ80.js";
import { i as resolveSessionRuntimeOverrideForProvider } from "./session-runtime-compat-BJ6CDpbR.js";
import { i as normalizeThinkingCatalogProviders, n as hasResolvedThinkingCatalogEntry, o as resolveEffectiveAgentRuntime } from "./thinking-runtime-1slENmfx.js";
import { p as ensureAgentWorkspace } from "./workspace-CYdcs93J.js";
import { t as PreparedModelRuntimeOwnerNotPublishedError } from "./prepared-model-runtime.errors-DeG6Ut3_.js";
import { t as resolveAllowedModelRefCore } from "./model-selection-resolve-DHCroTxz.js";
import { t as loadAgentRuntimePluginRegistryHandle } from "./runtime-plugins-7tauRyL1.js";
import { s as loadPublishedGatewayReplyDispatchRuntime, t as acquireAgentRunPreparedModelRuntime } from "./prepared-model-runtime-afzKiwqZ.js";
import { i as withPreparedModelRuntimePluginGenerationScope } from "./prepared-model-runtime-generation-scope-o4umnoSw.js";
import { n as resolveThinkingDefault, t as resolveConfiguredThinkingDefault } from "./model-thinking-default-Bs5EBLjZ.js";
import { t as isCliProvider } from "./model-selection-cli-C9Ha9V5X.js";
import { c as createAgentRunRestartAbortError } from "./run-termination-hzmbXtwI.js";
import { n as extractTextFromChatContent } from "./chat-content-BbLAEXko.js";
import { n as resolveAgentTimeoutMs } from "./timeout-DlFI6Ssz.js";
import { l as isCommandLaneTaskTimeoutError } from "./command-queue-CBS1Vl32.js";
import { t as createDiagnosticMessageLifecycle } from "./message-lifecycle-Bg6LF9Xa.js";
import { l as retireSessionMcpRuntime } from "./agent-bundle-mcp-manager-api-DUhEi3qH.js";
import "./agent-bundle-mcp-tools-BAxsm8bQ.js";
import { C as projectChatDisplayMessages, o as readSessionMessagesAsync } from "./session-transcript-readers-CgCxlOAj.js";
import { c as resolveAuthoredModelContextTokens } from "./context-resolution-PMHXNyx7.js";
import { t as resolveCronAgentSessionKey } from "./session-key-BcM5GBXo.js";
import { t as hasAcceptedSessionSpawn } from "./accepted-session-spawn-lNnDOLRj.js";
import { n as resolveCronStyleNow } from "./current-time-CCCy7gvK.js";
import { s as hasCommittedMessagingToolDeliveryEvidence } from "./delivery-evidence-JxKjzZU6.js";
import { i as normalizeCronRunErrorText, o as resolveCronAbortReasonText } from "./execution-errors-vaWEimoT.js";
import { t as removeCronRunContinuationSessionIfIdle } from "./cron-run-continuation-cleanup-C2bJtbz8.js";
import { n as resolveSourceDeliveryOutcome } from "./source-delivery-plan-B9uf2pUf.js";
import { r as hasIntentionalTerminalCompletion } from "./result-fallback-classifier-Ba94zysF.js";
import { n as isEmbeddedRunTerminalToolFailure, t as CODE_MODE_MCP_CATALOG_MISS_MESSAGE } from "./terminal-tool-failure-B4XlXdtD.js";
import { t as cleanupBrowserSessionsForLifecycleEnd } from "./browser-lifecycle-cleanup-qFybcCBn.js";
import { i as mergeCronRunDiagnostics, n as createCronRunDiagnosticsFromError, t as createCronRunDiagnosticsFromAgentResult } from "./run-diagnostics-Dqk4mQCD.js";
import { n as resolveCronJobEffectiveAgentId } from "./agent-id-CTTgGKaS.js";
import { n as resolveCronSession, t as loadCronSessionEntryLatest } from "./session-DEP63KSh.js";
import { c as loadCronDeliveryRuntime, l as resolveCronDeliveryContext, n as resolveCronPreflightCandidates, o as buildCronDeliveryTrace, s as createCronToolsAllowPreflightDiagnostics, u as resolveCronChannelOutputPolicy } from "./run-fallback-policy-DiEXeVrm.js";
import { a as markCronSessionPreRun, c as resolveCronLifecycleRevisionIdentity, i as createPersistCronSessionEntry, l as setCronSessionAgentHarnessId, m as resolveCronPayloadOutcome, n as adoptCronRunSessionMetadata, o as persistCronSkillsSnapshotIfChanged, r as createCronRunContinuationSession, s as projectCronOwnershipFields, t as CronSessionLifecycleClaimError, u as setCronSessionRuntimeModel } from "./run-session-state--ncnay7v.js";
import { t as cleanupCronRunSessionAfterRun } from "./session-cleanup-CUEajrrv.js";
import { isDeepStrictEqual } from "node:util";
//#region src/cron/isolated-agent/run-finalize.ts
/** Final persistence, telemetry, and delivery for an isolated cron run. */
const cronContextRuntimeLoader = createLazyImportLoader(() => import("./run-context.runtime.js"));
async function finalizeCronRun(params) {
	const { prepared, execution } = params;
	const finalRunResult = execution.runResult;
	const payloads = finalRunResult.payloads ?? [];
	let telemetry;
	const cleanupRunSession = async (reason) => {
		await cleanupCronRunSessionAfterRun({
			job: prepared.input.job,
			agentSessionKey: prepared.agentSessionKey,
			sessionId: prepared.currentRunSessionId(),
			lifecycleRevision: prepared.cronSession.lifecycleRevision,
			sessionUpdatedAt: prepared.cronSession.sessionEntry.updatedAt,
			beforeDelete: params.beforeSessionDelete,
			reason
		});
		params.markCronRunSessionCleanupAttempted();
	};
	if (!params.isAborted()) {
		if (finalRunResult.meta?.systemPromptReport) prepared.cronSession.sessionEntry.systemPromptReport = finalRunResult.meta.systemPromptReport;
		adoptCronRunSessionMetadata({
			entry: prepared.cronSession.sessionEntry,
			sessionKey: prepared.agentSessionKey,
			runMeta: finalRunResult.meta?.agentMeta
		});
	}
	const usage = finalRunResult.meta?.agentMeta?.usage;
	const diagnosticUsage = finalRunResult.meta?.agentMeta?.diagnosticUsage ?? usage;
	const lastCallUsage = finalRunResult.meta?.agentMeta?.lastCallUsage;
	const promptTokens = finalRunResult.meta?.agentMeta?.promptTokens;
	const modelUsed = finalRunResult.meta?.agentMeta?.model ?? execution.fallbackModel ?? execution.liveSelection.model;
	const providerUsed = finalRunResult.meta?.agentMeta?.provider ?? execution.fallbackProvider ?? execution.liveSelection.provider;
	const runtimeContextTokens = asPositiveFiniteNumber(finalRunResult.meta?.agentMeta?.contextTokens);
	const modelContextTokens = (await cronContextRuntimeLoader.load()).resolveContextTokensForModel({
		cfg: prepared.cfgWithAgentDefaults,
		provider: providerUsed,
		model: modelUsed,
		allowAsyncLoad: false
	});
	const agentHarnessId = normalizeOptionalString(finalRunResult.meta?.agentMeta?.agentHarnessId);
	const authoredContextTokens = resolveAuthoredModelContextTokens({
		cfg: prepared.cfgWithAgentDefaults,
		provider: providerUsed,
		model: modelUsed
	});
	const retainedRuntimeContextTokens = resolveTrustedSessionContextTokens({
		entry: prepared.cronSession.sessionEntry,
		provider: providerUsed,
		model: modelUsed,
		agentHarnessId
	});
	const projectedContextTokens = resolveProjectedSessionContextTokens({
		entry: prepared.cronSession.sessionEntry,
		provider: providerUsed,
		model: modelUsed,
		agentHarnessId,
		resolvedContextTokens: modelContextTokens,
		authoredContextTokens
	});
	const contextTokens = runtimeContextTokens ?? projectedContextTokens ?? 2e5;
	const projectedUsesPersistedContext = retainedRuntimeContextTokens !== void 0 && (prepared.cronSession.sessionEntry.modelSelectionLocked === true || authoredContextTokens === void 0 && projectedContextTokens === retainedRuntimeContextTokens);
	const contextTokensSource = runtimeContextTokens !== void 0 ? finalRunResult.meta?.agentMeta?.contextTokensSource ?? "resolved" : projectedUsesPersistedContext ? prepared.cronSession.sessionEntry.contextTokensSource : "resolved";
	if (!params.isAborted()) {
		setCronSessionRuntimeModel({
			entry: prepared.cronSession.sessionEntry,
			provider: providerUsed,
			model: modelUsed
		});
		setCronSessionAgentHarnessId({
			entry: prepared.cronSession.sessionEntry,
			agentHarnessId
		});
		prepared.cronSession.sessionEntry.contextTokens = contextTokens;
		prepared.cronSession.sessionEntry.contextTokensSource = contextTokensSource;
		if (isCliProvider(providerUsed, prepared.cfgWithAgentDefaults)) {
			const cliSessionBinding = finalRunResult.meta?.agentMeta?.cliSessionBinding;
			const cliSessionId = finalRunResult.meta?.agentMeta?.sessionId?.trim();
			if (finalRunResult.meta?.agentMeta?.clearCliSessionBinding === true) {
				const { clearCliSession } = await import("./cli-runner.runtime.js");
				clearCliSession(prepared.cronSession.sessionEntry, providerUsed);
			} else if (cliSessionBinding?.sessionId?.trim()) {
				const { setCliSessionBinding } = await import("./cli-runner.runtime.js");
				setCliSessionBinding(prepared.cronSession.sessionEntry, providerUsed, cliSessionBinding);
			} else if (cliSessionId) {
				const { setCliSessionId } = await import("./cli-runner.runtime.js");
				setCliSessionId(prepared.cronSession.sessionEntry, providerUsed, cliSessionId);
			}
		}
	}
	if (hasNonzeroUsage(usage)) {
		const { estimateUsageCost, resolveModelCostConfig } = await import("./usage-format-DTREDmKw.js");
		const input = usage.input ?? 0;
		const output = usage.output ?? 0;
		const cacheRead = usage.cacheRead ?? 0;
		const cacheWrite = usage.cacheWrite ?? 0;
		const lastCallTotalTokens = deriveSessionTotalTokens({
			usage: lastCallUsage,
			contextTokens,
			promptTokens
		});
		const totalTokens = typeof lastCallTotalTokens === "number" && lastCallTotalTokens > 0 ? lastCallTotalTokens : void 0;
		const costConfig = resolveModelCostConfig({
			provider: providerUsed,
			model: modelUsed,
			config: prepared.cfgWithAgentDefaults
		});
		const runEstimatedCostUsd = asNonNegativeFiniteNumber(estimateUsageCost({
			usage,
			cost: costConfig
		}));
		prepared.cronSession.sessionEntry.inputTokens = input;
		prepared.cronSession.sessionEntry.outputTokens = output;
		const bucketTotalTokens = input + output + cacheRead + cacheWrite;
		const aggregateTotalTokens = typeof usage.total === "number" && Number.isFinite(usage.total) ? Math.max(bucketTotalTokens, usage.total) : bucketTotalTokens;
		const telemetryUsage = {
			input_tokens: input,
			output_tokens: output,
			...aggregateTotalTokens > 0 ? { total_tokens: aggregateTotalTokens } : {},
			...cacheRead > 0 ? { cache_read_tokens: cacheRead } : {},
			...cacheWrite > 0 ? { cache_write_tokens: cacheWrite } : {}
		};
		if (typeof totalTokens === "number" && Number.isFinite(totalTokens) && totalTokens > 0) {
			prepared.cronSession.sessionEntry.totalTokens = totalTokens;
			prepared.cronSession.sessionEntry.totalTokensFresh = true;
			prepared.cronSession.sessionEntry.totalTokensVersion = 1;
		} else {
			prepared.cronSession.sessionEntry.totalTokens = void 0;
			prepared.cronSession.sessionEntry.totalTokensFresh = false;
			prepared.cronSession.sessionEntry.totalTokensVersion = void 0;
		}
		prepared.cronSession.sessionEntry.cacheRead = cacheRead;
		prepared.cronSession.sessionEntry.cacheWrite = cacheWrite;
		if (runEstimatedCostUsd !== void 0) prepared.cronSession.sessionEntry.estimatedCostUsd = runEstimatedCostUsd;
		telemetry = {
			model: modelUsed,
			provider: providerUsed,
			usage: telemetryUsage
		};
		if (isDiagnosticsEnabled(prepared.cfgWithAgentDefaults)) {
			const diagnosticInput = diagnosticUsage?.input ?? 0;
			const diagnosticOutput = diagnosticUsage?.output ?? 0;
			const diagnosticCacheRead = diagnosticUsage?.cacheRead ?? 0;
			const diagnosticCacheWrite = diagnosticUsage?.cacheWrite ?? 0;
			const usagePromptTokens = diagnosticInput + diagnosticCacheRead + diagnosticCacheWrite;
			const diagnosticBucketTotalTokens = usagePromptTokens + diagnosticOutput;
			const diagnosticTotalTokens = typeof diagnosticUsage?.total === "number" && Number.isFinite(diagnosticUsage.total) ? Math.max(diagnosticBucketTotalTokens, diagnosticUsage.total) : diagnosticBucketTotalTokens;
			const hasDiagnosticBillableUsageBuckets = diagnosticUsage?.input !== void 0 || diagnosticUsage?.output !== void 0 || diagnosticUsage?.cacheRead !== void 0 || diagnosticUsage?.cacheWrite !== void 0;
			const diagnosticEstimatedCostUsd = asNonNegativeFiniteNumber(estimateUsageCost({
				usage: diagnosticUsage,
				cost: costConfig
			}));
			const contextUsedTokens = deriveContextPromptTokens({
				lastCallUsage,
				promptTokens,
				usage
			});
			emitTrustedDiagnosticEvent({
				type: "model.usage",
				...finalRunResult.diagnosticTrace ? { trace: freezeDiagnosticTraceContext(createChildDiagnosticTraceContext(finalRunResult.diagnosticTrace)) } : {},
				sessionKey: prepared.runSessionKey,
				sessionId: prepared.currentRunSessionId(),
				channel: "cron",
				agentId: prepared.agentId,
				provider: providerUsed,
				model: modelUsed,
				usage: {
					input: diagnosticInput,
					output: diagnosticOutput,
					cacheRead: diagnosticCacheRead,
					cacheWrite: diagnosticCacheWrite,
					promptTokens: usagePromptTokens,
					total: diagnosticTotalTokens
				},
				lastCallUsage,
				context: {
					limit: contextTokens,
					...contextUsedTokens !== void 0 ? { used: contextUsedTokens } : {}
				},
				...hasDiagnosticBillableUsageBuckets && diagnosticEstimatedCostUsd !== void 0 ? { costUsd: diagnosticEstimatedCostUsd } : {},
				durationMs: execution.runEndedAt - execution.runStartedAt
			});
		}
	} else telemetry = {
		model: modelUsed,
		provider: providerUsed
	};
	await prepared.persistSessionEntry();
	await prepared.runContinuationSession?.seal({ basePersisted: true });
	if (params.isAborted()) return prepared.withRunSession({
		status: "error",
		error: params.abortReason(),
		diagnostics: mergeCronRunDiagnostics(prepared.preflightDiagnostics, createCronRunDiagnosticsFromAgentResult(finalRunResult, { finalStatus: "error" }), createCronRunDiagnosticsFromError("cron-setup", params.abortReason())),
		...telemetry
	});
	const cronPayloadOutcome = resolveCronPayloadOutcome({
		payloads,
		runLevelError: finalRunResult.meta?.error,
		failureSignal: finalRunResult.meta?.failureSignal,
		finalAssistantVisibleText: finalRunResult.meta?.finalAssistantVisibleText,
		preferFinalAssistantVisibleText: (await resolveCronChannelOutputPolicy(prepared.resolvedDelivery.channel, { deliveryRequested: prepared.deliveryRequested })).preferFinalAssistantVisibleText
	});
	if (finalRunResult.meta?.aborted === true && !cronPayloadOutcome.hasFatalErrorPayload) {
		const error = normalizeOptionalString(finalRunResult.meta.error?.message) ?? "cron isolated agent run aborted";
		await cleanupRunSession("cron-delete-after-run-aborted");
		return prepared.withRunSession({
			status: "error",
			error,
			diagnostics: mergeCronRunDiagnostics(prepared.preflightDiagnostics, createCronRunDiagnosticsFromAgentResult(finalRunResult, { finalStatus: "error" }), createCronRunDiagnosticsFromError("agent-run", error)),
			...telemetry
		});
	}
	const { deliveryDisposition, deliveryPayloadHasStructuredContent, hasFatalStructuredErrorPayload, pendingPresentationWarningError } = cronPayloadOutcome;
	let { synthesizedText, deliveryPayloads, summary, outputText, hasFatalErrorPayload, embeddedRunError } = cronPayloadOutcome;
	const terminalToolFailure = finalRunResult.meta?.terminalToolFailure;
	const hasTerminalToolFailure = isEmbeddedRunTerminalToolFailure(terminalToolFailure);
	if (hasFatalErrorPayload && hasTerminalToolFailure) summary = CODE_MODE_MCP_CATALOG_MISS_MESSAGE;
	const agentDiagnostics = createCronRunDiagnosticsFromAgentResult(finalRunResult, { finalStatus: hasFatalErrorPayload ? "error" : "ok" });
	const runDiagnostics = mergeCronRunDiagnostics(prepared.preflightDiagnostics, agentDiagnostics);
	const resolveRunOutcome = (result) => prepared.withRunSession({
		status: hasFatalErrorPayload ? "error" : "ok",
		...hasFatalErrorPayload ? { error: embeddedRunError ?? "cron isolated run returned an error payload" } : {},
		summary,
		outputText,
		delivered: result?.delivered,
		deliveryAttempted: result?.deliveryAttempted,
		deliveryError: result?.deliveryError,
		deliverySuppressionReason: result?.deliverySuppressionReason,
		delivery: result?.delivery,
		diagnostics: mergeCronRunDiagnostics(runDiagnostics, hasFatalErrorPayload && !hasTerminalToolFailure ? createCronRunDiagnosticsFromError("agent-run", embeddedRunError ?? "cron isolated run returned an error payload") : void 0, result?.deliveryError ? createCronRunDiagnosticsFromError("delivery", result.deliveryError) : void 0),
		...telemetry
	});
	const failPendingPresentationWarningUnlessDelivered = (delivered) => {
		if (pendingPresentationWarningError && delivered !== true) {
			hasFatalErrorPayload = true;
			embeddedRunError = pendingPresentationWarningError;
		}
	};
	const acceptedSessionSpawn = hasAcceptedSessionSpawn(finalRunResult.acceptedSessionSpawns);
	const heartbeatOnlyResponse = prepared.deliveryRequested && !hasFatalErrorPayload && deliveryDisposition.kind !== "visible";
	const heartbeatControlOnlyResponse = heartbeatOnlyResponse && (deliveryDisposition.kind === "empty" || deliveryDisposition.kind === "heartbeat" && deliveryDisposition.controlOnly);
	const spawnOnlyHandoff = acceptedSessionSpawn && (heartbeatControlOnlyResponse || deliveryPayloads.length === 0 && normalizeOptionalString(synthesizedText) === void 0);
	if (spawnOnlyHandoff && heartbeatControlOnlyResponse) {
		deliveryPayloads = [];
		synthesizedText = void 0;
		summary = void 0;
		outputText = void 0;
	}
	const skipHeartbeatDelivery = heartbeatOnlyResponse && !spawnOnlyHandoff;
	const sourceDeliveryOutcome = resolveSourceDeliveryOutcome(prepared.sourceDelivery, {
		didSendViaMessageTool: finalRunResult.didSendViaMessagingTool,
		messageToolSentTargets: finalRunResult.messagingToolSentTargets
	});
	let queueSourceSessionMessageToolAwareness;
	if (sourceDeliveryOutcome.visibleDeliveries.length > 0) {
		const { queueCronMessageToolDeliveryAwareness } = await loadCronDeliveryRuntime();
		queueSourceSessionMessageToolAwareness = await queueCronMessageToolDeliveryAwareness({
			cfg: prepared.cfgWithAgentDefaults,
			job: prepared.input.job,
			agentId: prepared.agentId,
			agentSessionKey: prepared.agentSessionKey,
			deferredTargetSessionKey: prepared.input.job.sessionTarget === "current" ? prepared.sourceSessionKey : void 0,
			runStartedAt: execution.runStartedAt,
			resolvedDelivery: prepared.resolvedDelivery,
			sourceDeliveryOutcome
		});
	}
	const hasCommittedTerminalProgress = hasCommittedMessagingToolDeliveryEvidence(finalRunResult) || finalRunResult.didSendDeterministicApprovalPrompt === true || acceptedSessionSpawn || (finalRunResult.successfulCronAdds ?? 0) > 0;
	const hasIntentionalSilentReply = finalRunResult.meta?.terminalReplyKind === "silent-empty" || isSilentReplyPayloadText(finalRunResult.meta?.finalAssistantRawText) || isSilentReplyPayloadText(finalRunResult.meta?.finalAssistantVisibleText);
	if (prepared.deliveryRequested && !hasFatalErrorPayload && !sourceDeliveryOutcome.satisfiesSourceDelivery && !hasCommittedTerminalProgress && !hasIntentionalSilentReply && !hasIntentionalTerminalCompletion(finalRunResult) && deliveryPayloads.length === 0 && normalizeOptionalString(synthesizedText) === void 0) {
		await queueSourceSessionMessageToolAwareness?.();
		const error = "cron isolated run completed without a final assistant payload";
		return prepared.withRunSession({
			status: "error",
			error,
			summary: error,
			outputText: error,
			delivered: false,
			deliveryAttempted: false,
			diagnostics: mergeCronRunDiagnostics(runDiagnostics, createCronRunDiagnosticsFromError("agent-run", error)),
			...telemetry
		});
	}
	if (hasFatalStructuredErrorPayload && prepared.deliveryRequested) {
		await cleanupRunSession("cron-delete-after-run-fatal-error");
		const deliveryTrace = buildCronDeliveryTrace({
			deliveryPlan: prepared.deliveryPlan,
			resolvedDelivery: prepared.resolvedDelivery,
			sourceDeliveryOutcome,
			fallbackUsed: false,
			delivered: sourceDeliveryOutcome.verifiedMessageToolDelivery
		});
		await queueSourceSessionMessageToolAwareness?.();
		return resolveRunOutcome({
			delivered: sourceDeliveryOutcome.verifiedMessageToolDelivery,
			deliveryAttempted: sourceDeliveryOutcome.verifiedMessageToolDelivery,
			delivery: deliveryTrace
		});
	}
	const { dispatchCronDelivery, resolveCronDeliveryBestEffort } = await loadCronDeliveryRuntime();
	const deliveryResult = await dispatchCronDelivery({
		cfg: prepared.input.cfg,
		cfgWithAgentDefaults: prepared.cfgWithAgentDefaults,
		deps: prepared.input.deps,
		job: prepared.input.job,
		agentId: prepared.agentId,
		agentSessionKey: prepared.agentSessionKey,
		sourceSessionKey: prepared.sourceSessionKey,
		runSessionKey: prepared.runSessionKey,
		sessionId: prepared.currentRunSessionId(),
		lifecycleRevision: prepared.cronSession.lifecycleRevision,
		sessionUpdatedAt: prepared.cronSession.sessionEntry.updatedAt,
		beforeSessionDelete: params.beforeSessionDelete,
		runStartedAt: execution.runStartedAt,
		runEndedAt: execution.runEndedAt,
		timeoutMs: prepared.timeoutMs,
		resolvedDelivery: prepared.resolvedDelivery,
		deliveryRequested: prepared.deliveryRequested,
		skipHeartbeatDelivery,
		spawnOnlyHandoff,
		sourceDeliveryOutcome,
		queueSourceSessionMessageToolAwareness,
		deliveryBestEffort: resolveCronDeliveryBestEffort(prepared.input.job),
		deliveryPayloadHasStructuredContent,
		deliveryPayloads,
		synthesizedText,
		ttsAuto: prepared.cronSession.sessionEntry.ttsAuto,
		summary,
		outputText,
		telemetry,
		abortSignal: prepared.input.abortSignal ?? prepared.input.signal,
		isAborted: params.isAborted,
		abortReason: params.abortReason,
		withRunSession: prepared.withRunSession
	});
	if (deliveryResult.cronRunSessionCleanupAttempted) params.markCronRunSessionCleanupAttempted();
	const deliveryTrace = buildCronDeliveryTrace({
		deliveryPlan: prepared.deliveryPlan,
		resolvedDelivery: prepared.resolvedDelivery,
		sourceDeliveryOutcome,
		fallbackUsed: prepared.deliveryRequested && deliveryResult.deliveryAttempted && !sourceDeliveryOutcome.satisfiesSourceDelivery,
		delivered: deliveryResult.delivered
	});
	if (deliveryResult.result) {
		const deliveryError = deliveryResult.result.deliveryError ?? deliveryResult.deliveryError;
		const deliveryDiagnosticError = deliveryError ?? (deliveryResult.result.status === "error" ? deliveryResult.result.error : void 0);
		const resultWithDeliveryMeta = {
			...deliveryResult.result,
			delivered: deliveryResult.result.delivered ?? deliveryResult.delivered,
			deliveryAttempted: deliveryResult.result.deliveryAttempted ?? deliveryResult.deliveryAttempted,
			deliveryError,
			delivery: deliveryTrace,
			diagnostics: mergeCronRunDiagnostics(runDiagnostics, deliveryResult.result.diagnostics, deliveryDiagnosticError ? createCronRunDiagnosticsFromError("delivery", deliveryDiagnosticError) : void 0)
		};
		failPendingPresentationWarningUnlessDelivered(resultWithDeliveryMeta.delivered ?? deliveryResult.delivered);
		if (!hasFatalErrorPayload) {
			const incompleteSpawnOnlyHandoff = spawnOnlyHandoff && normalizeOptionalString(deliveryResult.synthesizedText) === void 0;
			if (deliveryResult.result.status === "error" && deliveryResult.result.errorKind !== "delivery-target" && !incompleteSpawnOnlyHandoff && !params.isAborted()) {
				const failedDeliveryError = resultWithDeliveryMeta.error;
				const successfulResult = {
					...resultWithDeliveryMeta,
					status: "ok",
					delivered: resultWithDeliveryMeta.delivered ?? deliveryResult.delivered,
					...failedDeliveryError ? { deliveryError: failedDeliveryError } : {}
				};
				delete successfulResult.error;
				delete successfulResult.errorKind;
				return successfulResult;
			}
			return resultWithDeliveryMeta;
		}
		if (deliveryResult.result.status !== "ok") return resultWithDeliveryMeta;
		return resolveRunOutcome({
			delivered: deliveryResult.result.delivered,
			deliveryAttempted: resultWithDeliveryMeta.deliveryAttempted,
			deliverySuppressionReason: resultWithDeliveryMeta.deliverySuppressionReason,
			delivery: deliveryTrace
		});
	}
	summary = deliveryResult.summary;
	outputText = deliveryResult.outputText;
	failPendingPresentationWarningUnlessDelivered(deliveryResult.delivered);
	return resolveRunOutcome({
		delivered: deliveryResult.delivered,
		deliveryAttempted: deliveryResult.deliveryAttempted,
		deliveryError: deliveryResult.deliveryError,
		deliverySuppressionReason: deliveryResult.deliverySuppressionReason,
		delivery: deliveryTrace
	});
}
//#endregion
//#region src/skills/runtime/cron-snapshot.ts
const skillsSnapshotRuntimeLoader = createLazyImportLoader(() => import("./cron-snapshot.runtime.js"));
async function loadSkillsSnapshotRuntime() {
	return await skillsSnapshotRuntimeLoader.load();
}
async function resolveCronSkillsSnapshot(params) {
	if (params.isFastTestEnv) return params.existingSnapshot ?? {
		prompt: "",
		skills: []
	};
	const runtime = await loadSkillsSnapshotRuntime();
	const skillFilter = runtime.resolveEffectiveAgentSkillFilter(params.config, params.agentId);
	const nodeSkills = runtime.resolveNodeExecEligibility({
		cfg: params.config,
		agentId: params.agentId
	});
	return runtime.resolveReusableWorkspaceSkillSnapshot({
		workspaceDir: params.workspaceDir,
		config: params.config,
		agentId: params.agentId,
		existingSnapshot: params.existingSnapshot,
		skillFilter,
		eligibility: {
			nodeSkills,
			remote: runtime.getRemoteSkillEligibility({ advertiseExecNode: nodeSkills.canExec })
		},
		watch: false,
		hydrateExisting: false
	}).snapshot;
}
//#endregion
//#region src/cron/isolated-agent/run-config.ts
/** Selects the active reloadable config when it descends from the cron caller's snapshot. */
function resolveCronActiveRuntimeConfig(cfg) {
	const runtimeConfig = getRuntimeConfigSnapshot();
	const runtimeSourceConfig = getRuntimeConfigSourceSnapshot();
	if (!runtimeConfig || !runtimeSourceConfig) return cfg;
	return selectApplicableRuntimeConfig({
		inputConfig: cfg,
		runtimeConfig,
		runtimeSourceConfig
	}) ?? cfg;
}
function extractCronAgentDefaultsOverride(agentConfigOverride) {
	const { model: overrideModel, sandbox: _agentSandboxOverride, memory: _agentMemoryOverride, ...agentOverrideRest } = agentConfigOverride ?? {};
	return {
		overrideModel,
		definedOverrides: Object.fromEntries(Object.entries(agentOverrideRest).filter(([, value]) => value !== void 0))
	};
}
function mergeCronAgentModelOverride(params) {
	const nextDefaults = { ...params.defaults };
	const existingModel = nextDefaults.model && typeof nextDefaults.model === "object" ? nextDefaults.model : {};
	if (typeof params.overrideModel === "string") nextDefaults.model = {
		...existingModel,
		primary: params.overrideModel
	};
	else if (params.overrideModel) nextDefaults.model = {
		...existingModel,
		...params.overrideModel
	};
	return nextDefaults;
}
/** Selects the active runtime snapshot before deriving isolated cron agent defaults. */
function resolveCronAgentConfig(params) {
	const runtimeConfig = resolveCronActiveRuntimeConfig(params.config);
	const { overrideModel, definedOverrides } = extractCronAgentDefaultsOverride(params.agentConfigOverride);
	const agentDefaults = mergeCronAgentModelOverride({
		defaults: Object.assign({}, runtimeConfig.agents?.defaults, definedOverrides),
		overrideModel
	});
	return {
		runtimeConfig,
		agentDefaults,
		cfgWithAgentDefaults: {
			...runtimeConfig,
			agents: Object.assign({}, runtimeConfig.agents, { defaults: agentDefaults })
		}
	};
}
//#endregion
//#region src/cron/isolated-agent/model-selection.ts
function formatAllowedModelRefs(params) {
	const configured = resolveConfiguredModelPolicyAllow(params).refs;
	if (configured && configured.length > 0) return configured.toSorted().join(", ");
	return "(none configured)";
}
function formatCronPayloadModelRejection(params) {
	const { modelOverride, error } = params;
	if (error.startsWith("model not allowed:")) {
		const modelRef = error.slice(18).trim();
		return `automation model override '${modelOverride}' rejected by ${resolveConfiguredModelPolicyAllow(params).configPath ?? "agents.defaults.modelPolicy.allow"}: ${modelRef} is not in [${formatAllowedModelRefs(params)}]`;
	}
	return `automation model override '${modelOverride}' rejected: ${error}`;
}
async function resolveCronModelSelectionOwner(params) {
	const owner = await loadResolvedPublishedModelCatalogOwner({
		config: params.cfg,
		...params.agentId ? { agentId: params.agentId } : {},
		...params.agentDir ? { agentDir: params.agentDir } : {},
		...params.workspaceDir ? { workspaceDir: params.workspaceDir } : {},
		readOnly: true,
		allowGatewaySubagentBinding: true
	});
	if (params.requiredAgentId && !publishedModelCatalogOwnerMatchesAgent(owner, params.requiredAgentId)) throw new Error(`cron model catalog owner changed from ${params.requiredAgentId} to ${owner.agentId}`);
	return owner;
}
async function resolveCronThinkingCatalog(params) {
	const catalog = normalizeThinkingCatalogProviders(params.owner.modelCatalog.entries);
	if (hasResolvedThinkingCatalogEntry({
		catalog,
		provider: params.provider,
		model: params.model
	})) return catalog;
	return normalizeThinkingCatalogProviders(await loadProviderScopedThinkingCatalog({
		config: params.owner.config,
		provider: params.provider,
		model: params.model,
		agentId: params.owner.agentId,
		agentDir: params.owner.agentDir,
		workspaceDir: params.owner.workspaceDir
	}));
}
async function resolveCronThinkingSelection(params) {
	const immutableThinkLevel = normalizeThinkLevel(params.jobThinking) ?? normalizeThinkLevel(params.hookThinking) ?? normalizeThinkLevel(params.sessionThinking);
	const requestedThinkLevel = immutableThinkLevel ?? resolveConfiguredThinkingDefault({
		cfg: params.cfg,
		provider: params.provider,
		model: params.model
	});
	return {
		catalog: requestedThinkLevel === "off" ? params.owner.modelCatalog.entries : await resolveCronThinkingCatalog(params),
		immutableThinkLevel,
		loadThinkingCatalog: async (provider, model) => await resolveCronThinkingCatalog({
			owner: params.owner,
			provider,
			model
		}),
		requestedThinkLevel
	};
}
/** Resolves the effective model for an isolated cron run across defaults, agents, hooks, payload, and session state. */
async function resolveCronModelSelection(params) {
	const owner = params.owner ?? await resolveCronModelSelectionOwner({
		cfg: params.cfg,
		...params.agentId ? {
			agentId: params.agentId,
			requiredAgentId: params.agentId,
			agentDir: params.agentDir,
			workspaceDir: params.workspaceDir
		} : {}
	});
	const ownerAgentId = owner.agentId;
	const ownerAgentConfigOverride = params.agentConfigOverride ? owner.config === params.cfg && (!params.agentId || ownerAgentId === params.agentId) ? params.agentConfigOverride : resolveAgentConfig(owner.config, ownerAgentId) : void 0;
	const { cfgWithAgentDefaults } = resolveCronAgentConfig({
		config: owner.config,
		agentConfigOverride: ownerAgentConfigOverride
	});
	const catalog = owner.modelCatalog.entries;
	const resolvedDefault = resolveConfiguredModelRef({
		cfg: cfgWithAgentDefaults,
		defaultProvider: DEFAULT_PROVIDER,
		defaultModel: DEFAULT_MODEL
	});
	let provider = resolvedDefault.provider;
	let model = resolvedDefault.model;
	let modelSource = "default";
	const subagentModelConfigSelection = resolveSubagentModelConfigSelectionResult({
		cfg: owner.config,
		agentId: ownerAgentId,
		agentConfigOverride: ownerAgentConfigOverride
	});
	const subagentModelRaw = resolvePrimaryStringValue(subagentModelConfigSelection?.raw);
	const subagentModelSource = subagentModelConfigSelection?.source === "agent" ? "agent" : "subagent";
	if (subagentModelRaw) {
		const resolvedSubagent = resolveAllowedModelRefCore({
			cfg: owner.config,
			catalog,
			raw: subagentModelRaw,
			defaultProvider: resolvedDefault.provider,
			defaultModel: resolvedDefault.model,
			agentId: ownerAgentId
		});
		if (!("error" in resolvedSubagent)) {
			provider = resolvedSubagent.ref.provider;
			model = resolvedSubagent.ref.model;
			modelSource = subagentModelSource;
		}
	}
	let hooksGmailModelApplied = false;
	const hooksGmailModelRef = params.isGmailHook ? resolveHooksGmailModel({
		cfg: owner.config,
		defaultProvider: DEFAULT_PROVIDER
	}) : null;
	if (hooksGmailModelRef) {
		if (getModelRefStatus({
			cfg: owner.config,
			catalog,
			ref: hooksGmailModelRef,
			defaultProvider: resolvedDefault.provider,
			defaultModel: resolvedDefault.model,
			agentId: ownerAgentId
		}).allowed) {
			provider = hooksGmailModelRef.provider;
			model = hooksGmailModelRef.model;
			hooksGmailModelApplied = true;
			modelSource = "hook";
		}
	}
	const modelOverrideRaw = params.payload.kind === "agentTurn" ? params.payload.model : void 0;
	const modelOverride = typeof modelOverrideRaw === "string" ? modelOverrideRaw.trim() : void 0;
	if (modelOverride !== void 0 && modelOverride.length > 0) {
		const resolvedOverride = resolveAllowedModelRefCore({
			cfg: owner.config,
			catalog,
			raw: modelOverride,
			defaultProvider: resolvedDefault.provider,
			defaultModel: resolvedDefault.model,
			agentId: ownerAgentId
		});
		if ("error" in resolvedOverride) return {
			ok: false,
			error: formatCronPayloadModelRejection({
				cfg: owner.config,
				agentId: ownerAgentId,
				modelOverride,
				error: resolvedOverride.error
			})
		};
		provider = resolvedOverride.ref.provider;
		model = resolvedOverride.ref.model;
		modelSource = "payload";
	}
	if (!modelOverride && !hooksGmailModelApplied) {
		const sessionModelOverride = params.sessionEntry.modelOverride?.trim();
		if (sessionModelOverride) {
			const sessionProviderOverride = params.sessionEntry.providerOverride?.trim() || resolvedDefault.provider;
			const resolvedSessionOverride = resolveAllowedModelRefCore({
				cfg: owner.config,
				catalog,
				raw: `${sessionProviderOverride}/${sessionModelOverride}`,
				defaultProvider: resolvedDefault.provider,
				defaultModel: resolvedDefault.model,
				agentId: ownerAgentId
			});
			if (!("error" in resolvedSessionOverride)) {
				provider = resolvedSessionOverride.ref.provider;
				model = resolvedSessionOverride.ref.model;
				modelSource = "session";
			}
		}
	}
	return {
		ok: true,
		provider,
		model,
		modelSource,
		cfgWithAgentDefaults,
		owner
	};
}
//#endregion
//#region src/cron/isolated-agent/run-current-context.ts
const CURRENT_CONTEXT_RAW_MESSAGES_MAX = 220;
const CURRENT_CONTEXT_READ_MAX_BYTES = 256 * 1024;
const CURRENT_CONTEXT_MAX_LINE_CHARS = 220;
const CURRENT_CONTEXT_MAX_BLOCK_CHARS = 1400;
const CURRENT_CONTEXT_HEADER = "Recent conversation:";
function truncateContextLine(role, text) {
	const prefix = `- ${role === "user" ? "User" : "Assistant"}: `;
	const textLimit = CURRENT_CONTEXT_MAX_LINE_CHARS - prefix.length;
	if (text.length <= textLimit) return `${prefix}${text}`;
	return `${prefix}${truncateUtf16Safe(text, textLimit - 3).trimEnd()}...`;
}
function formatCurrentConversationContext(messages) {
	const lines = projectChatDisplayMessages(messages, { maxChars: CURRENT_CONTEXT_MAX_LINE_CHARS }).flatMap((message) => {
		if (!message || typeof message !== "object" || Array.isArray(message)) return [];
		const record = message;
		if (record.role !== "user" && record.role !== "assistant") return [];
		const text = extractTextFromChatContent(record.content);
		return text ? [truncateContextLine(record.role, text)] : [];
	}).slice(-10);
	while (lines.length > 0 && `${CURRENT_CONTEXT_HEADER}\n${lines.join("\n")}`.length > CURRENT_CONTEXT_MAX_BLOCK_CHARS) lines.shift();
	return lines.length > 0 ? `${CURRENT_CONTEXT_HEADER}\n${lines.join("\n")}` : void 0;
}
async function buildCurrentConversationContextBlock(params, deps = {}) {
	const sessionId = params.sourceSessionEntry.sessionId?.trim();
	if (!sessionId) return;
	try {
		const messages = await (deps.readSessionMessages ?? readSessionMessagesAsync)({
			agentId: params.agentId,
			sessionEntry: params.sourceSessionEntry,
			sessionId,
			sessionKey: params.sourceSessionKey,
			storePath: params.storePath
		}, {
			mode: "recent",
			maxBytes: CURRENT_CONTEXT_READ_MAX_BYTES,
			maxLines: CURRENT_CONTEXT_RAW_MESSAGES_MAX,
			maxMessages: CURRENT_CONTEXT_RAW_MESSAGES_MAX
		});
		return formatCurrentConversationContext(Array.isArray(messages) ? messages : []);
	} catch {
		return;
	}
}
//#endregion
//#region src/cron/isolated-agent/run-prepare-runtime.ts
/** Lazy preparation runtimes and session lifecycle helpers for cron runs. */
function resolveCronAgentTurnMessage(input) {
	if (input.job.payload.kind === "agentTurn") return input.job.payload.message;
	return input.message;
}
const sessionAccessorRuntimeLoader = createLazyImportLoader(() => import("./session-accessor-BwigPrR8.js"));
const cronExternalContentRuntimeLoader = createLazyImportLoader(() => import("./run-external-content.runtime.js"));
const cronAuthProfileRuntimeLoader = createLazyImportLoader(() => import("./run-auth-profile.runtime.js"));
const cronModelPreflightRuntimeLoader = createLazyImportLoader(() => import("./model-preflight.runtime.js"));
async function loadSessionAccessorRuntime() {
	return await sessionAccessorRuntimeLoader.load();
}
async function loadCronExternalContentRuntime() {
	return await cronExternalContentRuntimeLoader.load();
}
async function loadCronAuthProfileRuntime() {
	return await cronAuthProfileRuntimeLoader.load();
}
async function loadCronModelPreflightRuntime() {
	return await cronModelPreflightRuntimeLoader.load();
}
function hasConfiguredAuthProfiles(cfg) {
	return Boolean(cfg.auth?.profiles && Object.keys(cfg.auth.profiles).length > 0) || Boolean(cfg.auth?.order && Object.keys(cfg.auth.order).length > 0);
}
async function retireRolledCronSessionMcpRuntime(params) {
	if (params.job.sessionTarget === "isolated") return;
	const previousSessionId = normalizeOptionalString(params.cronSession.previousSessionId);
	const currentSessionId = normalizeOptionalString(params.cronSession.sessionEntry.sessionId);
	if (!previousSessionId || previousSessionId === currentSessionId) return;
	await retireSessionMcpRuntime({
		sessionId: previousSessionId,
		reason: "cron-session-rollover",
		onError: (error, sessionId) => {
			logWarn(`[cron:${params.job.id}] Failed to dispose retired bundle MCP runtime for session ${sessionId}: ${String(error)}`);
		}
	});
}
function appendCronUnattendedRunPreamble(commandBody, opts) {
	return `${commandBody}\n\n${`This is an unattended scheduled run. Nobody is present to clarify or approve, so complete the task with what you have. Your final reply is the deliverable — not a plan, an acknowledgement, or a request for input. If nothing needs doing, reply exactly ${SILENT_REPLY_TOKEN}. If something failed, state plainly what failed and what you tried — the scheduler owns retries and failure alerts.`}${opts.externalHook ? "" : " Where the job's own instructions conflict with this preamble, the job's instructions win (a question or plan the job explicitly requests is a valid deliverable). If this job is no longer needed, remove it if your available tools allow."}`;
}
//#endregion
//#region src/cron/isolated-agent/run-timeout.ts
/** Converts cron payload timeout overrides into embedded-runner timeout signals. */
/** Converts explicit cron payload timeoutSeconds into a timer-safe millisecond override signal. */
function resolveCronRunTimeoutOverrideMs(timeoutSeconds) {
	const timeoutMs = Math.floor((timeoutSeconds ?? 0) * 1e3);
	return Number.isFinite(timeoutSeconds) && timeoutMs > 0 ? Math.min(timeoutMs, MAX_TIMER_TIMEOUT_MS) : void 0;
}
//#endregion
//#region src/cron/isolated-agent/run-prepare.ts
/** Session identity and context preparation for isolated cron runs. */
async function prepareCronRunContext(params) {
	const { input } = params;
	const requestedRuntimeCfg = resolveCronActiveRuntimeConfig(input.cfg);
	const requestedAgentId = input.agentId?.trim() || input.job.agentId?.trim();
	const requiredAgentId = (requestedAgentId ? normalizeAgentId(requestedAgentId) : void 0) ?? parseAgentSessionKey(input.job.sessionKey ?? input.sessionKey)?.agentId;
	const initialAgentId = resolveCronJobEffectiveAgentId({ agentId: requiredAgentId }, tryResolveAmbientOwnerAgentId(requestedRuntimeCfg));
	const modelOwner = await resolveCronModelSelectionOwner({
		cfg: requestedRuntimeCfg,
		...requiredAgentId ? {
			agentId: initialAgentId,
			requiredAgentId,
			agentDir: resolveAgentDir(requestedRuntimeCfg, initialAgentId),
			workspaceDir: resolveAgentWorkspaceDir(requestedRuntimeCfg, initialAgentId)
		} : {}
	});
	const agentId = modelOwner.agentId;
	const agentDir = modelOwner.agentDir;
	const agentConfigOverride = requiredAgentId ? resolveAgentConfig(modelOwner.config, agentId) : void 0;
	const { runtimeConfig: runtimeCfg, agentDefaults: agentCfg } = resolveCronAgentConfig({
		config: modelOwner.config,
		agentConfigOverride
	});
	const baseSessionKey = (input.sessionKey?.trim() || `cron:${input.job.id}`).trim();
	const currentBoundSourceKey = input.job.sessionTarget === "current" ? input.job.sessionKey?.trim() : void 0;
	const usesDetachedRunSession = isDetachedCronSessionTarget(input.job.sessionTarget) || Boolean(currentBoundSourceKey);
	const baseSessionKeyIsCron = baseSessionKey.startsWith("cron:") || isCronSessionKey(baseSessionKey);
	const agentSessionKey = resolveCronAgentSessionKey({
		sessionKey: usesDetachedRunSession && !baseSessionKeyIsCron ? `cron:${input.job.id}` : baseSessionKey,
		agentId,
		mainKey: runtimeCfg.session?.mainKey,
		cfg: runtimeCfg
	});
	const resolvedBaseSessionKey = resolveCronAgentSessionKey({
		sessionKey: currentBoundSourceKey ?? baseSessionKey,
		agentId,
		mainKey: runtimeCfg.session?.mainKey,
		cfg: runtimeCfg
	});
	const sourceSessionKey = currentBoundSourceKey && resolvedBaseSessionKey !== agentSessionKey ? resolvedBaseSessionKey : void 0;
	const hookExternalContentSource = (input.job.payload.kind === "agentTurn" ? input.job.payload.externalContentSource : void 0) ?? resolveHookExternalContentSource(baseSessionKey);
	const workspaceDir = (await ensureAgentWorkspace({
		dir: modelOwner.workspaceDir,
		ensureBootstrapFiles: !agentCfg?.skipBootstrap && !params.isFastTestEnv,
		skipOptionalBootstrapFiles: agentCfg?.skipOptionalBootstrapFiles
	})).dir;
	const isGmailHook = hookExternalContentSource === "gmail";
	const now = Date.now();
	const cronSession = resolveCronSession({
		cfg: runtimeCfg,
		sessionKey: agentSessionKey,
		sourceSessionKey,
		agentId,
		nowMs: now,
		forceNew: usesDetachedRunSession,
		hookExternalContentSource
	});
	const reservedKey = isAgentHarnessSessionKey(agentSessionKey);
	if (cronSession.initialSessionEntry?.modelSelectionLocked === true) throw new Error(reservedKey ? AGENT_HARNESS_SESSION_KEY_RESERVED_MESSAGE : AGENT_HARNESS_SESSION_ID_LOCKED_MESSAGE);
	if (reservedKey && !cronSession.initialSessionEntry) throw new Error(AGENT_HARNESS_SESSION_KEY_RESERVED_MESSAGE);
	const runSessionId = cronSession.sessionEntry.sessionId;
	const currentRunSessionId = () => cronSession.sessionEntry.sessionId ?? runSessionId;
	const usesExactRunSession = usesDetachedRunSession || baseSessionKey.startsWith("cron:");
	const runSessionKey = usesExactRunSession ? `${agentSessionKey}:run:${runSessionId}` : agentSessionKey;
	const initialSessionEntry = cronSession.initialSessionEntry;
	const sessionWorkAdmission = await beginSessionWorkAdmission({
		scope: cronSession.storePath,
		identities: [
			agentSessionKey,
			initialSessionEntry?.sessionId,
			cronSession.sessionEntry.sessionId,
			resolveCronLifecycleRevisionIdentity(cronSession.lifecycleRevision),
			runSessionKey
		],
		signal: input.abortSignal ?? input.signal,
		onInterrupt: params.onLifecycleInterrupt,
		assertAllowed: () => {
			const currentEntry = loadCronSessionEntryLatest(cronSession.storePath, agentSessionKey);
			if (initialSessionEntry ? !currentEntry || !isDeepStrictEqual(projectCronOwnershipFields(currentEntry), projectCronOwnershipFields(initialSessionEntry)) : Boolean(currentEntry)) throw new CronSessionLifecycleClaimError(agentSessionKey);
			const archivedSessionError = resolveSessionWorkStartError(agentSessionKey, currentEntry);
			if (archivedSessionError) throw new CronSessionLifecycleClaimError(agentSessionKey, archivedSessionError);
		}
	});
	try {
		const persistCronSessionRow = async ({ storePath, sessionKey, fallbackEntry, resetBoundaryReason, update }) => {
			const { applySessionEntryLifecycleMutation, patchSessionEntryCore } = await loadSessionAccessorRuntime();
			if (resetBoundaryReason) {
				await applySessionEntryLifecycleMutation({
					activeSessionKey: sessionKey,
					agentId,
					storePath,
					upserts: [{
						sessionKey,
						resetBoundary: {
							context: "preserve-tail",
							reason: resetBoundaryReason
						},
						buildEntry: ({ currentEntry }) => update(currentEntry)
					}],
					skipMaintenance: true
				});
				return;
			}
			await patchSessionEntryCore({
				storePath,
				sessionKey,
				agentId
			}, (_entry, context) => update(context.existingEntry), {
				fallbackEntry,
				replaceEntry: true
			});
		};
		const persistSessionEntry = createPersistCronSessionEntry({
			cronSession,
			agentSessionKey,
			createdActor: input.job.createdActor,
			persistSessionEntry: persistCronSessionRow
		});
		const withRunSession = (result) => ({
			...result,
			sessionId: currentRunSessionId(),
			sessionKey: runSessionKey
		});
		if (!cronSession.sessionEntry.label?.trim() && baseSessionKey.startsWith("cron:")) {
			const labelSuffix = typeof input.job.name === "string" && input.job.name.trim() ? input.job.name.trim() : input.job.id;
			cronSession.sessionEntry.label = `Automation: ${labelSuffix}`;
		}
		const resolvedModelSelection = await resolveCronModelSelection({
			cfg: runtimeCfg,
			owner: modelOwner,
			agentConfigOverride,
			sessionEntry: cronSession.sessionEntry,
			payload: input.job.payload,
			isGmailHook,
			agentId,
			agentDir,
			workspaceDir
		});
		if (!resolvedModelSelection.ok) {
			sessionWorkAdmission.release();
			return {
				ok: false,
				result: withRunSession({
					status: "error",
					error: resolvedModelSelection.error,
					diagnostics: createCronRunDiagnosticsFromError("cron-preflight", resolvedModelSelection.error)
				})
			};
		}
		const cfgWithAgentDefaults = resolvedModelSelection.cfgWithAgentDefaults;
		const ownerAgentConfig = resolveAgentConfig(modelOwner.config, modelOwner.agentId);
		const matchesDefaultFallbackAgentStringModel = typeof ownerAgentConfig?.model === "string" && resolveAgentModelPrimaryValue(ownerAgentConfig.model) === resolveAgentModelPrimaryValue(modelOwner.config.agents?.defaults?.model);
		let provider = resolvedModelSelection.provider;
		let model = resolvedModelSelection.model;
		const useSubagentFallbacks = resolvedModelSelection.modelSource === "subagent";
		const inheritDefaultFallbacksForAgentStringModel = matchesDefaultFallbackAgentStringModel && (resolvedModelSelection.modelSource === "default" || resolvedModelSelection.modelSource === "agent");
		const modelPreflightRuntime = await loadCronModelPreflightRuntime();
		const preflightCandidates = resolveCronPreflightCandidates({
			cfg: cfgWithAgentDefaults,
			job: input.job,
			agentId: modelOwner.agentId,
			provider,
			model,
			useSubagentFallbacks,
			inheritDefaultFallbacksForAgentStringModel
		});
		let selectedPreflightCandidate;
		let selectedPreflightCandidateIndex = -1;
		let firstUnavailablePreflight;
		for (const [index, candidate] of preflightCandidates.entries()) {
			const candidatePreflight = await modelPreflightRuntime.preflightCronModelProvider({
				cfg: cfgWithAgentDefaults,
				provider: candidate.provider,
				model: candidate.model
			});
			if (candidatePreflight.status === "available") {
				selectedPreflightCandidate = candidate;
				selectedPreflightCandidateIndex = index;
				break;
			}
			firstUnavailablePreflight ??= candidatePreflight;
		}
		if (!selectedPreflightCandidate && firstUnavailablePreflight?.status === "unavailable") {
			logWarn(`[cron:${input.job.id}] ${firstUnavailablePreflight.reason}`);
			sessionWorkAdmission.release();
			return {
				ok: false,
				result: withRunSession({
					status: "skipped",
					error: firstUnavailablePreflight.reason,
					diagnostics: createCronRunDiagnosticsFromError("model-preflight", firstUnavailablePreflight.reason, { severity: "warn" }),
					provider,
					model
				})
			};
		}
		const modelFallbacksOverride = selectedPreflightCandidate && (selectedPreflightCandidate.provider !== provider || selectedPreflightCandidate.model !== model) ? preflightCandidates.slice(selectedPreflightCandidateIndex + 1).map((candidate) => `${candidate.provider}/${candidate.model}`) : void 0;
		if (selectedPreflightCandidate && modelFallbacksOverride) {
			if (firstUnavailablePreflight?.status === "unavailable") logWarn(`[cron:${input.job.id}] ${firstUnavailablePreflight.reason}; continuing with fallback ${selectedPreflightCandidate.provider}/${selectedPreflightCandidate.model}.`);
			provider = selectedPreflightCandidate.provider;
			model = selectedPreflightCandidate.model;
		}
		const thinkingSelection = await resolveCronThinkingSelection({
			cfg: cfgWithAgentDefaults,
			owner: modelOwner,
			provider,
			model,
			jobThinking: input.job.payload.kind === "agentTurn" ? input.job.payload.thinking : void 0,
			hookThinking: isGmailHook ? runtimeCfg.hooks?.gmail?.thinking : void 0,
			sessionThinking: cronSession.sessionEntry.thinkingLevel
		});
		const effectiveAgentRuntime = resolveEffectiveAgentRuntime({
			cfg: cfgWithAgentDefaults,
			provider,
			modelId: model,
			agentId: modelOwner.agentId,
			sessionKey: agentSessionKey,
			sessionEntry: cronSession.sessionEntry
		});
		let requestedThinkLevel = thinkingSelection.requestedThinkLevel;
		if (!requestedThinkLevel) requestedThinkLevel = resolveThinkingDefault({
			cfg: cfgWithAgentDefaults,
			provider,
			model,
			catalog: thinkingSelection.catalog,
			agentRuntime: effectiveAgentRuntime
		});
		if (!isThinkingLevelSupported({
			provider,
			model,
			level: requestedThinkLevel,
			catalog: thinkingSelection.catalog,
			agentRuntime: effectiveAgentRuntime
		})) {
			const fallbackThinkLevel = resolveSupportedThinkingLevel({
				provider,
				model,
				level: requestedThinkLevel,
				catalog: thinkingSelection.catalog,
				agentRuntime: effectiveAgentRuntime
			});
			if (fallbackThinkLevel !== requestedThinkLevel) logWarn(`[cron:${input.job.id}] Thinking level "${requestedThinkLevel}" is not supported for ${provider}/${model}; using "${fallbackThinkLevel}" for this candidate.`);
		}
		const explicitTimeoutSeconds = input.job.payload.kind === "agentTurn" ? input.job.payload.timeoutSeconds : void 0;
		const timeoutMs = resolveAgentTimeoutMs({
			cfg: cfgWithAgentDefaults,
			overrideSeconds: explicitTimeoutSeconds
		});
		const runTimeoutOverrideMs = resolveCronRunTimeoutOverrideMs(explicitTimeoutSeconds);
		const agentPayload = input.job.payload.kind === "agentTurn" ? input.job.payload : null;
		const configuredProvider = cfgWithAgentDefaults.models?.providers?.[provider];
		const modelApi = findModelInCatalog(thinkingSelection.catalog, provider, model)?.api ?? configuredProvider?.models?.find((candidate) => candidate.id === model)?.api ?? configuredProvider?.api;
		const preflightDiagnostics = await createCronToolsAllowPreflightDiagnostics({
			cfg: cfgWithAgentDefaults,
			jobId: input.job.id,
			provider,
			model,
			modelApi,
			agentId: modelOwner.agentId,
			agentDir: modelOwner.agentDir,
			workspaceDir,
			sessionKey: agentSessionKey,
			agentPayload,
			agentRuntime: effectiveAgentRuntime,
			toolsAllowProvenance: input.job.toolsAllowProvenance
		});
		const { deliveryPlan, deliveryRequested, resolvedDelivery, sourceDelivery } = await resolveCronDeliveryContext({
			cfg: cfgWithAgentDefaults,
			job: input.job,
			agentId
		});
		const { formattedTime, timeLine } = resolveCronStyleNow(runtimeCfg, now);
		const originalMessage = resolveCronAgentTurnMessage(input);
		const sourceSessionEntry = sourceSessionKey ? cronSession.store[sourceSessionKey] : void 0;
		const currentConversationContext = input.job.sessionTarget === "current" && agentPayload && sourceSessionKey && sourceSessionEntry ? await buildCurrentConversationContextBlock({
			agentId,
			sourceSessionEntry,
			sourceSessionKey,
			storePath: cronSession.storePath
		}) : void 0;
		const message = currentConversationContext ? `${currentConversationContext}\n\n${originalMessage}` : originalMessage;
		const base = `[cron:${input.job.id} ${input.job.name}] ${message}`.trim();
		const isExternalHook = hookExternalContentSource !== void 0 || isExternalHookSession(baseSessionKey);
		const allowUnsafeExternalContent = agentPayload?.allowUnsafeExternalContent === true || isGmailHook && input.cfg.hooks?.gmail?.allowUnsafeExternalContent === true;
		const shouldWrapExternal = isExternalHook && !allowUnsafeExternalContent;
		let commandBody;
		if (isExternalHook) {
			const { detectSuspiciousPatterns } = await loadCronExternalContentRuntime();
			const suspiciousPatterns = detectSuspiciousPatterns(message);
			if (suspiciousPatterns.length > 0) logWarn(`[security] Suspicious patterns detected in external hook content (session=${baseSessionKey}, patterns=${suspiciousPatterns.length}): ${suspiciousPatterns.slice(0, 3).join(", ")}`);
		}
		if (shouldWrapExternal) {
			const { buildSafeExternalPrompt } = await loadCronExternalContentRuntime();
			commandBody = `${buildSafeExternalPrompt({
				content: message,
				source: mapHookExternalContentSource(hookExternalContentSource ?? "webhook"),
				jobName: input.job.name,
				jobId: input.job.id,
				timestamp: formattedTime
			})}\n\n${timeLine}`.trim();
		} else commandBody = `${base}\n${timeLine}`.trim();
		commandBody = appendCronUnattendedRunPreamble(commandBody, { externalHook: isExternalHook });
		const skillsSnapshot = await resolveCronSkillsSnapshot({
			workspaceDir,
			config: cfgWithAgentDefaults,
			agentId,
			existingSnapshot: cronSession.sessionEntry.skillsSnapshot,
			isFastTestEnv: params.isFastTestEnv
		});
		await persistCronSkillsSnapshotIfChanged({
			isFastTestEnv: params.isFastTestEnv,
			cronSession,
			skillsSnapshot,
			nowMs: Date.now(),
			persistSessionEntry
		});
		markCronSessionPreRun({
			entry: cronSession.sessionEntry,
			provider,
			model
		});
		try {
			await persistSessionEntry();
		} catch (err) {
			if (err instanceof CronSessionLifecycleClaimError) throw err;
			logWarn(`[cron:${input.job.id}] Failed to persist pre-run session entry: ${String(err)}`);
		}
		await retireRolledCronSessionMcpRuntime({
			job: input.job,
			cronSession
		});
		const storedAuthProfileId = cronSession.sessionEntry.authProfileOverride?.trim();
		const authSelection = !Boolean(storedAuthProfileId) && !hasConfiguredAuthProfiles(cfgWithAgentDefaults) && !hasAnyAuthProfileStoreSource(agentDir) ? void 0 : await (await loadCronAuthProfileRuntime()).resolveSessionAuthSelection({
			cfg: cfgWithAgentDefaults,
			provider,
			modelId: model,
			harnessRuntime: effectiveAgentRuntime,
			agentDir,
			sessionEntry: cronSession.sessionEntry,
			sessionStore: cronSession.store,
			sessionKey: agentSessionKey,
			storePath: cronSession.storePath,
			isNewSession: cronSession.isNewSession && input.job.sessionTarget !== "isolated"
		});
		const authProfileId = authSelection?.profileId;
		const liveSelection = {
			provider,
			model,
			agentRuntimeOverride: resolveSessionRuntimeOverrideForProvider({
				provider,
				entry: cronSession.sessionEntry,
				cfg: cfgWithAgentDefaults
			}),
			authProfileId,
			authProfileIdSource: authSelection?.source
		};
		const runtimePluginCandidates = selectedPreflightCandidateIndex >= 0 ? preflightCandidates.slice(selectedPreflightCandidateIndex) : preflightCandidates;
		const pluginRegistry = loadAgentRuntimePluginRegistryHandle({
			config: cfgWithAgentDefaults,
			workspaceDir,
			allowGatewaySubagentBinding: true,
			...modelOwner.metadataSnapshot ? { metadataSnapshot: modelOwner.metadataSnapshot } : {},
			selections: runtimePluginCandidates.map((candidate) => {
				const runtime = resolveSessionRuntimeOverrideForProvider({
					provider: candidate.provider,
					entry: cronSession.sessionEntry,
					cfg: cfgWithAgentDefaults
				});
				return runtime ? {
					provider: candidate.provider,
					modelId: candidate.model,
					runtime,
					agentId
				} : {
					provider: candidate.provider,
					modelId: candidate.model,
					agentId
				};
			})
		});
		const runContinuationSession = usesExactRunSession ? createCronRunContinuationSession({
			cronSession,
			runSessionKey,
			createdActor: input.job.createdActor,
			thinkingLevel: requestedThinkLevel,
			toolsAllow: agentPayload?.toolsAllow,
			toolsAllowIsDefault: agentPayload?.toolsAllowIsDefault,
			scheduledToolPolicy: resolveCronScheduledToolPolicy({
				toolsAllow: agentPayload?.toolsAllow,
				scheduledToolPolicy: input.job.scheduledToolPolicy,
				owner: input.job.owner
			}),
			scheduledToolCallerOrigin: input.job.toolsAllowProvenance?.callerOrigin,
			cliSessionBindingFacts: {
				sourceReplyDeliveryMode: sourceDelivery.sourceReplyDeliveryMode,
				requireExplicitMessageTarget: sourceDelivery.messageTool.requireExplicitTarget
			},
			persistSessionEntry: persistCronSessionRow
		}) : void 0;
		await runContinuationSession?.initialize();
		return {
			ok: true,
			context: {
				input,
				cfgWithAgentDefaults,
				agentId,
				agentCfg,
				agentDir,
				agentSessionKey,
				sourceSessionKey,
				runSessionId,
				currentRunSessionId,
				runSessionKey,
				usesDetachedRunSession,
				workspaceDir,
				commandBody,
				cronSession,
				sessionWorkAdmission,
				persistSessionEntry,
				runContinuationSession,
				withRunSession,
				agentPayload,
				deliveryPlan,
				resolvedDelivery,
				deliveryRequested,
				sourceDelivery,
				suppressExecNotifyOnExit: deliveryPlan.mode === "none",
				skillsSnapshot,
				liveSelection,
				useSubagentFallbacks,
				inheritDefaultFallbacksForAgentStringModel,
				modelFallbacksOverride,
				thinkingSelection,
				timeoutMs,
				preflightDiagnostics,
				runTimeoutOverrideMs,
				...pluginRegistry ? { pluginRegistry } : {}
			}
		};
	} catch (error) {
		sessionWorkAdmission.release();
		throw error;
	}
}
//#endregion
//#region src/cron/isolated-agent/run.ts
const cronExecutorRuntimeLoader = createLazyImportLoader(() => import("./run-executor.runtime.js"));
/**
* Gateway-hosted isolated runs reuse the published plugin generation instead of
* rebuilding metadata snapshots per run (#125596 carried this for the channel
* path; hook/cron turns share the invariant). Standalone hosts (no Gateway
* lifecycle) and startup/replacement races return undefined so the embedded
* orchestrator admits on whatever generation is current at execution time.
*/
async function acquireCronRunPluginGeneration(context) {
	try {
		const dispatchRuntime = await loadPublishedGatewayReplyDispatchRuntime({
			agentId: context.agentId,
			abortSignal: context.abortSignal
		});
		if (!dispatchRuntime) return;
		const lease = await acquireAgentRunPreparedModelRuntime({
			config: dispatchRuntime.config,
			agentId: dispatchRuntime.agentId,
			agentDir: dispatchRuntime.agentDir,
			allowGatewaySubagentBinding: true,
			workspaceDir: context.workspaceDir
		}, {
			catalogMode: "static",
			pluginGeneration: dispatchRuntime.pluginGeneration,
			abortSignal: context.abortSignal
		});
		let leaseActive = true;
		return {
			pluginGeneration: dispatchRuntime.pluginGeneration,
			borrowSnapshot: () => leaseActive ? lease.snapshot : void 0,
			release: () => {
				leaseActive = false;
				lease.release();
			}
		};
	} catch (error) {
		if (error instanceof PreparedModelRuntimeOwnerNotPublishedError) return;
		throw error;
	}
}
function isCronNestedLaneTaskTimeoutError(err) {
	return isCommandLaneTaskTimeoutError(err, "cron-nested");
}
/**
* Release runtime references held by a completed isolated cron run.
*
* After the final durable write and delivery complete, the cron session store
* and run context are no longer needed in memory.  This shallow disposal prevents
* the heap-retention pattern described in #85019 where ~113k copies of the skill
* prompt string accumulated through cron run contexts that were never released.
*
* O(1) — nulls known large fields without deep traversal.  MUST run after the
* final `persistSessionEntry()` and delivery construction, never before.
*/
async function disposeCronRunContext(params) {
	releaseAgentRunContext(params.sessionId, params.runContextOwnerToken);
	if (params.ownsRunContext) await retireSessionMcpRuntime({
		sessionId: params.sessionId,
		reason: "isolated-cron-dispose",
		onError: (error, sid) => {
			logWarn(`[cron] Failed to retire MCP runtime during isolated cron dispose ${sid}: ${String(error)}`);
		}
	}).catch(() => {});
	params.cronSession.store = void 0;
}
/** Runs one isolated cron agent turn, including setup, execution, delivery, and persistence. */
async function runCronIsolatedAgentTurn(params) {
	const admittedLifecycleGeneration = getAgentEventLifecycleGeneration();
	const upstreamAbortSignal = params.abortSignal ?? params.signal;
	const lifecycleAbortController = new AbortController();
	const abortSignal = upstreamAbortSignal ? AbortSignal.any([upstreamAbortSignal, lifecycleAbortController.signal]) : lifecycleAbortController.signal;
	const isAborted = () => abortSignal?.aborted ?? false;
	const abortReason = () => resolveCronAbortReasonText(abortSignal?.reason) ?? "cron: job execution timed out";
	const isFastTestEnv = isFastTestRuntimeEnv();
	let prepared;
	try {
		prepared = await prepareCronRunContext({
			input: {
				...params,
				abortSignal
			},
			isFastTestEnv,
			onLifecycleInterrupt: () => lifecycleAbortController.abort(createAgentRunRestartAbortError())
		});
	} catch (err) {
		if (err instanceof CronSessionLifecycleClaimError) return {
			status: "error",
			error: err.message,
			admissionDisposition: err.admissionDisposition
		};
		throw err;
	}
	if (!prepared.ok) return {
		...prepared.result,
		admissionDisposition: "rejected"
	};
	const initialSessionId = prepared.context.cronSession.sessionEntry.sessionId;
	const ownsRunContext = params.job.sessionTarget === "isolated";
	let runContextOwnerToken;
	let runLifecycleGeneration = admittedLifecycleGeneration;
	let executionStarted = false;
	const notifyExecutionStarted = (info) => {
		executionStarted = true;
		if (info?.lifecycleGeneration) runLifecycleGeneration = info.lifecycleGeneration;
		params.onExecutionStarted?.({
			jobId: params.job.id,
			agentId: prepared.context.agentId,
			sessionId: prepared.context.currentRunSessionId(),
			sessionKey: prepared.context.runSessionKey,
			...info?.isFallback === true ? { isFallback: true } : {},
			phase: "runner_entered",
			provider: info?.provider ?? prepared.context.liveSelection.provider,
			model: info?.model ?? prepared.context.liveSelection.model
		});
	};
	const notifyExecutionPhase = (info) => {
		params.onExecutionPhase?.({
			jobId: params.job.id,
			agentId: prepared.context.agentId,
			sessionId: prepared.context.currentRunSessionId(),
			sessionKey: prepared.context.runSessionKey,
			provider: prepared.context.liveSelection.provider,
			model: prepared.context.liveSelection.model,
			...info
		});
	};
	const turnStartedAtMs = Date.now();
	const messageLifecycle = (() => {
		try {
			const lifecycle = createDiagnosticMessageLifecycle({
				enabled: isDiagnosticsEnabled(params.cfg),
				sessionId: prepared.context.runSessionId,
				sessionKey: prepared.context.runSessionKey,
				channel: "cron",
				source: "cron-isolated",
				startedAtMs: turnStartedAtMs,
				trackSessionState: true
			});
			lifecycle.markProcessing();
			return lifecycle;
		} catch (error) {
			prepared.context.sessionWorkAdmission.release();
			throw error;
		}
	})();
	let outcome = "completed";
	let outcomeError;
	let cronRunSessionCleanupAttempted = false;
	try {
		assertAgentRunLifecycleGenerationCurrent(runLifecycleGeneration);
		const existingRunContext = getAgentRunContext(initialSessionId);
		runContextOwnerToken = claimAgentRunContext(initialSessionId, {
			sessionKey: ownsRunContext || !existingRunContext?.sessionKey ? prepared.context.runSessionKey : existingRunContext.sessionKey,
			sessionId: initialSessionId,
			lifecycleGeneration: runLifecycleGeneration,
			cronRunsByJobId: /* @__PURE__ */ new Map([[params.job.id, { pacingEnabled: params.job.pacing !== void 0 }]])
		}, {
			trackOwner: true,
			ownsContext: ownsRunContext
		});
		const { executeCronRun } = await cronExecutorRuntimeLoader.load();
		const executionParams = {
			cfg: params.cfg,
			cfgWithAgentDefaults: prepared.context.cfgWithAgentDefaults,
			job: params.job,
			agentId: prepared.context.agentId,
			agentDir: prepared.context.agentDir,
			agentSessionKey: prepared.context.agentSessionKey,
			runSessionKey: prepared.context.runSessionKey,
			usesDetachedRunSession: prepared.context.usesDetachedRunSession,
			workspaceDir: prepared.context.workspaceDir,
			lane: params.lane,
			resolvedDelivery: {
				channel: prepared.context.resolvedDelivery.channel,
				to: prepared.context.resolvedDelivery.to,
				accountId: prepared.context.resolvedDelivery.accountId,
				threadId: prepared.context.resolvedDelivery.threadId
			},
			resolvedDeliveryOk: prepared.context.resolvedDelivery.ok,
			deliveryRequested: prepared.context.deliveryRequested,
			sourceDelivery: prepared.context.sourceDelivery,
			skillsSnapshot: prepared.context.skillsSnapshot,
			agentPayload: prepared.context.agentPayload,
			useSubagentFallbacks: prepared.context.useSubagentFallbacks,
			inheritDefaultFallbacksForAgentStringModel: prepared.context.inheritDefaultFallbacksForAgentStringModel,
			modelFallbacksOverride: prepared.context.modelFallbacksOverride,
			agentVerboseDefault: prepared.context.agentCfg?.verboseDefault,
			liveSelection: prepared.context.liveSelection,
			cronSession: prepared.context.cronSession,
			commandBody: prepared.context.commandBody,
			persistSessionEntry: prepared.context.persistSessionEntry,
			persistRunContinuationSession: prepared.context.runContinuationSession?.sync,
			setRunContinuationCliExecutionProvider: prepared.context.runContinuationSession?.setCliExecutionProvider,
			abortSignal,
			onExecutionStarted: notifyExecutionStarted,
			onExecutionPhase: notifyExecutionPhase,
			onLaneWait: params.onLaneWait,
			abortReason,
			isAborted,
			immutableThinkLevel: prepared.context.thinkingSelection.immutableThinkLevel,
			thinkingCatalog: prepared.context.thinkingSelection.catalog,
			loadThinkingCatalog: prepared.context.thinkingSelection.loadThinkingCatalog,
			timeoutMs: prepared.context.timeoutMs,
			runTimeoutOverrideMs: prepared.context.runTimeoutOverrideMs,
			suppressExecNotifyOnExit: prepared.context.suppressExecNotifyOnExit,
			pluginRegistry: prepared.context.pluginRegistry,
			executionIdentity: params.executionIdentity
		};
		const runExecutionWithAdmission = () => prepared.context.sessionWorkAdmission.run(() => withAgentRunLifecycleGeneration(runLifecycleGeneration, () => withPluginRuntimeRegistryScope(prepared.context.pluginRegistry, () => executeCronRun(executionParams))));
		const pluginGenerationLease = await acquireCronRunPluginGeneration({
			...prepared.context,
			abortSignal
		});
		let execution;
		try {
			execution = pluginGenerationLease ? await withPreparedModelRuntimePluginGenerationScope(pluginGenerationLease.pluginGeneration, runExecutionWithAdmission, pluginGenerationLease.borrowSnapshot) : await runExecutionWithAdmission();
		} finally {
			pluginGenerationLease?.release();
		}
		const finalized = await finalizeCronRun({
			prepared: prepared.context,
			execution,
			abortReason,
			isAborted,
			markCronRunSessionCleanupAttempted: () => {
				cronRunSessionCleanupAttempted = true;
			},
			beforeSessionDelete: prepared.context.sessionWorkAdmission.release
		});
		if (finalized.status === "error") {
			outcome = "error";
			outcomeError = finalized.error;
		}
		const delayMs = consumeCronNextCheckProposal(initialSessionId, params.job.id);
		return finalized.status !== "ok" || delayMs === void 0 ? finalized : {
			...finalized,
			nextCheck: { delayMs }
		};
	} catch (err) {
		consumeCronNextCheckProposal(initialSessionId, params.job.id);
		const isCronLaneTimeout = isAborted() || isCronNestedLaneTaskTimeoutError(err);
		const error = isCronLaneTimeout ? abortReason() : normalizeCronRunErrorText(err);
		outcome = "error";
		outcomeError = error;
		return prepared.context.withRunSession({
			status: "error",
			error,
			executionStarted,
			...!executionStarted ? { admissionDisposition: err instanceof CronSessionLifecycleClaimError ? err.admissionDisposition : "rejected" } : {},
			provider: prepared.context.liveSelection.provider,
			model: prepared.context.liveSelection.model,
			diagnostics: mergeCronRunDiagnostics(prepared.context.preflightDiagnostics, createCronRunDiagnosticsFromError(isCronLaneTimeout ? "cron-setup" : "agent-run", isCronLaneTimeout ? error : err))
		});
	} finally {
		try {
			await prepared.context.runContinuationSession?.seal();
		} catch (sealError) {
			logWarn(`[cron:${params.job.id}] Failed to seal run continuation during cleanup: ${String(sealError)}`);
		}
		const finalSessionRef = {
			sessionId: prepared.context.currentRunSessionId(),
			sessionKey: prepared.context.runSessionKey
		};
		try {
			messageLifecycle.markIdle(void 0, finalSessionRef);
			messageLifecycle.markProcessed(outcome, {
				...finalSessionRef,
				error: outcomeError
			});
		} finally {
			try {
				if (!cronRunSessionCleanupAttempted) await cleanupCronRunSessionAfterRun({
					job: params.job,
					agentSessionKey: prepared.context.agentSessionKey,
					sessionId: prepared.context.currentRunSessionId(),
					lifecycleRevision: prepared.context.cronSession.lifecycleRevision,
					sessionUpdatedAt: prepared.context.cronSession.sessionEntry.updatedAt,
					beforeDelete: prepared.context.sessionWorkAdmission.release,
					reason: "cron-delete-after-run-finally"
				});
			} finally {
				try {
					if (prepared.context.runContinuationSession) try {
						await removeCronRunContinuationSessionIfIdle(prepared.context.runSessionKey);
					} catch (error) {
						logWarn(`[cron:${params.job.id}] Failed to remove unused run continuation: ${String(error)}`);
					}
					await disposeCronRunContext({
						sessionId: initialSessionId,
						cronSession: prepared.context.cronSession,
						ownsRunContext,
						runContextOwnerToken
					});
				} finally {
					prepared.context.sessionWorkAdmission.release();
					if (prepared.context.runSessionKey !== prepared.context.agentSessionKey) await cleanupBrowserSessionsForLifecycleEnd({
						cfg: prepared.context.cfgWithAgentDefaults,
						sessionKeys: [prepared.context.runSessionKey],
						onWarn: (message) => logWarn(`[cron:${params.job.id}] ${message}`)
					});
				}
			}
		}
	}
}
//#endregion
export { resolveCronActiveRuntimeConfig as n, resolveCronAgentConfig as r, runCronIsolatedAgentTurn as t };
