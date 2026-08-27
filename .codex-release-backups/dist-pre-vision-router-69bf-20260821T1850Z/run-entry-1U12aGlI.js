import { at as normalizeAgentRunTerminalReplySnapshot, rt as buildAgentRunTerminalReplySnapshot } from "./openclaw-state-db-BciZ4rHE.js";
import { S as requireActivePluginRegistry } from "./runtime-LV4GwzTm.js";
import { t as ensureSelectedAgentHarnessPlugin } from "./runtime-plugin-CJ0GKn_5.js";
import { n as buildAgentRunTerminalOutcome } from "./agent-run-terminal-outcome-CpRY9lPn.js";
import { m as resolveAgentRunAbortLifecycleFields } from "./run-termination-0Y8XLbCX.js";
import { t as runWithModelFallback } from "./model-fallback-runner-BswjSwzJ.js";
import { i as createContextEngineLogicalTurnLease, r as finalizeAcceptedContextEngineTurn, t as discardContextEngineTurnAttemptIntent } from "./context-engine-turn-attempt-CQccTaUe.js";
import { c as selectAgentHarness } from "./selection-C0s8kcIb.js";
import { r as mergeEmbeddedAgentRunResultForModelFallbackExhaustion, t as classifyEmbeddedAgentRunResultForModelFallback } from "./result-fallback-classifier-CdKCxys7.js";
import { t as normalizeAgentRunTerminalReceipt } from "./agent-run-terminal-receipt-DLoyhERI.js";
//#region src/agents/embedded-agent-runner/run-entry.ts
const PRESERVED_FOLLOWUP_RESULT_CODES = /* @__PURE__ */ new Set([
	"empty_result",
	"reasoning_only_result",
	"planning_only_result"
]);
function preserveFollowupResultForDelivery(classification) {
	if (!classification || !("code" in classification) || !classification.code || !PRESERVED_FOLLOWUP_RESULT_CODES.has(classification.code)) return classification;
	return {
		...classification,
		preserveResultOnExhaustion: true,
		preserveResultPriority: -1
	};
}
function resolveTerminalStatus(params) {
	const meta = params.result.meta;
	if (meta.stopReason === "timeout" || meta.timeoutPhase) return "timeout";
	if (params.fallbackExhausted || meta.aborted === true || meta.error || meta.stopReason === "error") return "error";
	return "ok";
}
function canAdvanceContextEngineTurn(params) {
	const meta = params.result.meta;
	return params.fallbackOutcome === "completed" && params.terminal.outcome.status === "ok" && meta.yielded !== true && meta.aborted !== true && meta.error === void 0 && meta.timeoutPhase === void 0 && meta.stopReason !== "error" && meta.stopReason !== "timeout";
}
function buildTerminal(params) {
	const meta = params.result.meta;
	const outcome = buildAgentRunTerminalOutcome({
		status: resolveTerminalStatus(params),
		error: meta.error?.message,
		stopReason: meta.stopReason,
		livenessState: meta.livenessState,
		timeoutPhase: meta.timeoutPhase,
		providerStarted: meta.providerStarted
	});
	const terminalReply = normalizeAgentRunTerminalReplySnapshot(meta.terminalReply) ?? buildAgentRunTerminalReplySnapshot({
		visibleText: meta.finalAssistantVisibleText,
		rawText: meta.finalAssistantRawText,
		terminalReplyKind: meta.terminalReplyKind
	});
	const metadata = { terminalReply };
	const terminalReceipt = normalizeAgentRunTerminalReceipt(meta.agentMeta?.terminalReceipt);
	if (terminalReceipt?.runId === params.runId) metadata.terminalReceipt = {
		...terminalReceipt,
		terminalDisposition: terminalReply.disposition === "visible" ? "visible" : "not-visible"
	};
	if (params.behavior.kind === "channel-delivery" || params.behavior.kind === "followup-delivery") for (const key of [
		"stopReason",
		"yielded",
		"timeoutPhase",
		"providerStarted",
		"aborted",
		"livenessState",
		"replayInvalid"
	]) {
		if (!Object.hasOwn(meta, key)) continue;
		metadata[key] = key in outcome ? outcome[key] : meta[key];
	}
	else {
		for (const key of [
			"stopReason",
			"livenessState",
			"timeoutPhase",
			"providerStarted"
		]) if (outcome[key] !== void 0) metadata[key] = outcome[key];
		if (typeof meta.aborted === "boolean") metadata.aborted = meta.aborted;
		if (meta.replayInvalid === true) metadata.replayInvalid = true;
		if (meta.yielded === true) metadata.yielded = true;
	}
	return {
		outcome,
		metadata
	};
}
/** Runs one logical turn across model candidates and advances only the accepted winner. */
async function runEmbeddedAgentEntry(params) {
	const contextEngineLogicalTurnLease = await createContextEngineLogicalTurnLease({
		config: params.selection.cfg,
		agentDir: params.selection.agentDir,
		workspaceDir: params.harness.workspaceDir
	});
	let unsettledContextEngineTurnAttempt;
	let candidateIndex = 0;
	const committedSideEffect = params.behavior.kind === "command-rpc" ? params.behavior.hasCommittedSideEffect : void 0;
	const readChannelDeliveryEvidence = params.behavior.kind === "channel-delivery" ? params.behavior.readDeliveryEvidence : void 0;
	const preparedHarnessRuntimes = /* @__PURE__ */ new Set();
	const prepareHarnessRuntime = async (candidate) => {
		const key = [
			candidate.provider,
			candidate.model,
			candidate.agentHarnessRuntimeOverride ?? ""
		].join("\0");
		if (preparedHarnessRuntimes.has(key)) return;
		const prepare = () => ensureSelectedAgentHarnessPlugin({
			config: params.selection.cfg,
			provider: candidate.provider,
			modelId: candidate.model,
			agentId: params.identity.agentId,
			sessionKey: params.harness.sessionKey,
			agentHarnessId: candidate.agentHarnessRuntimeOverride,
			agentHarnessRuntimeOverride: candidate.agentHarnessRuntimeOverride,
			workspaceDir: params.harness.workspaceDir,
			pluginRegistry: requireActivePluginRegistry()
		});
		if (params.harness.preparation.kind === "measured") await params.harness.preparation.run(prepare);
		else await prepare();
		preparedHarnessRuntimes.add(key);
	};
	const canFallbackAfterError = committedSideEffect ? () => !committedSideEffect() : readChannelDeliveryEvidence ? () => {
		const evidence = readChannelDeliveryEvidence();
		return !evidence.hasDirectlySentBlockReply && !evidence.hasBlockReplyPipelineOutput;
	} : void 0;
	try {
		const fallbackResult = await runWithModelFallback({
			...params.selection,
			...params.identity,
			abortSignal: params.abortSignal,
			resolveAgentHarnessRuntimeOverride: params.harness.resolveRuntimeOverride,
			prepareCandidateChain: async (candidates) => {
				for (const candidate of candidates) try {
					const agentHarnessRuntimeOverride = params.harness.resolveRuntimeOverride(candidate.provider, candidate.model);
					await prepareHarnessRuntime({
						provider: candidate.provider,
						model: candidate.model,
						...agentHarnessRuntimeOverride ? { agentHarnessRuntimeOverride } : {}
					});
					const host = params.harness.resolveContextEngineHost?.(candidate.provider, candidate.model) ?? (() => {
						const harness = selectAgentHarness({
							provider: candidate.provider,
							modelId: candidate.model,
							config: params.selection.cfg,
							agentId: params.identity.agentId,
							sessionKey: params.harness.sessionKey,
							agentHarnessRuntimeOverride
						});
						return {
							id: `agent-harness:${harness.id}`,
							label: `agent harness "${harness.id}"`,
							capabilities: harness.contextEngineHostCapabilities ?? []
						};
					})();
					contextEngineLogicalTurnLease.selectForHost({
						host,
						operation: "agent-run",
						requiresDurableCommit: false
					});
				} catch {
					contextEngineLogicalTurnLease.degradeBeforeStart("a model fallback candidate harness could not be validated before dispatch");
					return;
				}
			},
			prepareAgentHarnessRuntime: prepareHarnessRuntime,
			onFallbackStep: params.onFallbackStep,
			...params.behavior.kind === "maintenance" ? {} : { classifyResult: ({ result: candidate, provider, model }) => {
				const deliveryEvidence = params.behavior.kind === "channel-delivery" ? params.behavior.readDeliveryEvidence() : void 0;
				const classification = classifyEmbeddedAgentRunResultForModelFallback({
					result: candidate.result,
					provider,
					model,
					...deliveryEvidence
				});
				const effectiveClassification = params.behavior.kind === "followup-delivery" ? preserveFollowupResultForDelivery(classification) : classification;
				return effectiveClassification && committedSideEffect?.() ? void 0 : effectiveClassification;
			} },
			...canFallbackAfterError ? { canFallbackAfterError } : {},
			...params.behavior.kind === "maintenance" ? {} : { mergeExhaustedResult: ({ latestResult, preferredResult }) => ({
				result: mergeEmbeddedAgentRunResultForModelFallbackExhaustion({
					latestResult: latestResult.result,
					preferredResult: preferredResult.result
				}),
				turnAttempt: latestResult.turnAttempt
			}) },
			run: async (provider, model, options) => {
				const isFallbackRetry = candidateIndex > 0;
				candidateIndex += 1;
				let contextEngineTurnCandidate;
				return {
					result: await params.runCandidate(provider, model, {
						allowTransientCooldownProbe: options?.allowTransientCooldownProbe,
						isFinalFallbackAttempt: options?.isFinalFallbackAttempt,
						isFallbackRetry,
						contextEngineLogicalTurnLease,
						onContextEngineTurnCandidate: (facts) => {
							contextEngineTurnCandidate = facts;
							unsettledContextEngineTurnAttempt = facts;
						}
					}),
					turnAttempt: contextEngineTurnCandidate
				};
			}
		});
		const abortFields = params.behavior.kind === "command-rpc" ? resolveAgentRunAbortLifecycleFields(params.abortSignal) : {};
		const result = abortFields.aborted === true ? {
			...fallbackResult.result.result,
			meta: {
				...fallbackResult.result.result.meta,
				...abortFields
			}
		} : fallbackResult.result.result;
		const settledResult = {
			...fallbackResult,
			outcome: fallbackResult.outcome === "exhausted" ? "exhausted" : "completed",
			result
		};
		const terminal = buildTerminal({
			result,
			fallbackExhausted: settledResult.outcome === "exhausted",
			behavior: params.behavior,
			runId: params.identity.runId
		});
		if (fallbackResult.result.turnAttempt) {
			if (canAdvanceContextEngineTurn({
				result,
				fallbackOutcome: settledResult.outcome,
				terminal
			})) await finalizeAcceptedContextEngineTurn({
				facts: fallbackResult.result.turnAttempt,
				lease: contextEngineLogicalTurnLease
			});
			else discardContextEngineTurnAttemptIntent({
				facts: fallbackResult.result.turnAttempt,
				lease: contextEngineLogicalTurnLease
			});
			unsettledContextEngineTurnAttempt = void 0;
		}
		let sessionOverrideSettled = false;
		const settleSessionOverride = async () => {
			if (sessionOverrideSettled) return;
			sessionOverrideSettled = true;
			if (settledResult.outcome === "completed" && params.sessionOverride.kind === "reconcile-completed") await params.sessionOverride.reconcile({
				provider: settledResult.provider,
				model: settledResult.model
			});
		};
		return {
			...settledResult,
			terminal,
			settleSessionOverride
		};
	} finally {
		if (unsettledContextEngineTurnAttempt) discardContextEngineTurnAttemptIntent({
			facts: unsettledContextEngineTurnAttempt,
			lease: contextEngineLogicalTurnLease
		});
		await contextEngineLogicalTurnLease.dispose();
	}
}
//#endregion
export { runEmbeddedAgentEntry as t };
