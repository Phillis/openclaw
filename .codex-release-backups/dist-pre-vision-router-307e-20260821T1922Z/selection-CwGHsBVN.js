import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { C as createChildDiagnosticTraceContext, D as freezeDiagnosticTraceContext, N as runWithDiagnosticTraceContext, O as getActiveDiagnosticTraceContext, o as emitTrustedDiagnosticEvent, s as emitTrustedDiagnosticEventWithPrivateData, w as createDiagnosticTraceContext } from "./diagnostic-events-Djn4AVRp.js";
import { t as createSubsystemLogger } from "./subsystem-CDLhGl2-.js";
import { r as isKnownCoreToolId } from "./tool-catalog-Dl50knwD.js";
import { c as mergeAlsoAllowPolicy, g as normalizeToolPolicyName, m as expandToolGroups, u as toolPolicyRestrictsTools } from "./tool-policy-CWmnHLY1.js";
import { _ as isDefaultAgentRuntimeId, y as normalizeOptionalAgentRuntimeId } from "./openai-routing-BGuHAkXI.js";
import { t as resolveAgentHarnessPolicy } from "./policy-BHrZvZfs.js";
import { a as resolveAgentHarnessOwnerPluginId, n as getRegisteredAgentHarness, r as listRegisteredAgentHarnesses } from "./registry-GCsrA8Io.js";
import { a as unwrapSecretSentinelsForProviderEgress, i as unwrapModelHeaderSentinelsForProviderEgress } from "./provider-secret-egress-BZ7aTRBx.js";
import { f as resolveProviderRefOwnership } from "./providers-o7UIOzTf.js";
import { i as isCliRuntimeAliasForProvider } from "./model-runtime-aliases-HmfG8BuO.js";
import { t as resolveAgentHarnessAutoSelectionHint } from "./auto-selection-Br-mlD8Y.js";
import { c as compareHarnessSupport, l as resolveAgentHarnessPreparedAuthSupport, s as buildAgentHarnessSupportContext, u as resolveAgentHarnessPreparedRouteSupport } from "./thinking-runtime-BnpBwpz_.js";
import { _ as MissingAgentHarnessError, b as recordAgentHarnessPreflightOwner, h as AgentHarnessPreflightError } from "./failover-error-EKvoWJQa.js";
import { l as normalizeAgentRunAttemptTerminal, u as projectAgentRunAttemptTerminal } from "./agent-run-terminal-outcome-D3lKKt7D.js";
import { n as resolveSandboxRuntimeStatus } from "./runtime-status-DwfYu5UM.js";
import { n as isBuiltInOpenClawAgentHarness, t as createOpenClawAgentHarness } from "./builtin-openclaw-B7zVdTs_.js";
import { i as resolveGroupToolPolicy } from "./agent-tools.policy-BjBsVONt.js";
import { r as diagnosticErrorMessage, t as diagnosticErrorCategory } from "./diagnostic-error-metadata-B1vLwxgx.js";
import { i as runWithAgentRingZeroTools, n as isHostScopedAgentToolActive } from "./agent-tools.ring-zero-context-C-QXByzs.js";
import { t as isHeartbeatLifecycleRunKind } from "./bootstrap-mode-HvSedbJl.js";
import { t as resolveConversationCapabilityProfile } from "./conversation-capability-profile-jN4PguVr.js";
import { r as assertContextEngineHostSupport } from "./host-compat-xESS3bi6.js";
import { i as EmptySettledTurnFinalizationError, t as assertSettledTurnFinalizationResult } from "./settled-turn-finalization-result-Duat7t1d.js";
import { a as selectContextEngineForTranscriptHost, n as drainPendingContextEngineTurnsBeforeRun } from "./context-engine-turn-attempt-iXA9vvp1.js";
import { t as createAgentHarnessHostCapabilities } from "./host-capability-Bv40csq9.js";
//#region src/agents/harness/result-classification.ts
/** Applies a harness classifier while replacing any stale prior classification. */
function applyAgentHarnessResultClassification(harness, result, params) {
	if (!harness.classify) return {
		...result,
		agentHarnessId: harness.id
	};
	const { agentHarnessResultClassification: _previousClassification, ...resultWithoutPrevious } = result;
	const classification = harness.classify(resultWithoutPrevious, params);
	if (!classification || classification === "ok") return {
		...resultWithoutPrevious,
		agentHarnessId: harness.id
	};
	return {
		...resultWithoutPrevious,
		agentHarnessId: harness.id,
		agentHarnessResultClassification: classification
	};
}
//#endregion
//#region src/agents/harness/lifecycle.ts
/**
* Agent harness lifecycle diagnostics wrapper.
*
* This module wraps harness attempts with context-engine support checks,
* diagnostic events, trace propagation, and result classification.
*/
function buildAgentHarnessContextEngineHostSupport(harness) {
	return {
		id: `agent-harness:${harness.id}`,
		label: `agent harness "${harness.id}"`,
		capabilities: harness.contextEngineHostCapabilities ?? []
	};
}
function assertAgentHarnessContextEngineSupport(harness, params) {
	if (!params.contextEngine || params.contextEngine.info.id === "legacy") return;
	assertContextEngineHostSupport({
		contextEngine: params.contextEngine,
		operation: "agent-run",
		host: buildAgentHarnessContextEngineHostSupport(harness)
	});
}
function agentHarnessDiagnosticBase(harness, params, trace) {
	const diagnosticTrace = trace ?? getActiveDiagnosticTraceContext();
	const channel = diagnosticChannel(params);
	return {
		runId: params.runId,
		sessionId: params.sessionId,
		provider: params.provider,
		model: params.modelId,
		harnessId: harness.id,
		...harness.pluginId ? { pluginId: harness.pluginId } : {},
		...params.sessionKey ? { sessionKey: params.sessionKey } : {},
		...params.trigger ? { trigger: params.trigger } : {},
		...channel ? { channel } : {},
		...diagnosticTrace ? { trace: freezeDiagnosticTraceContext(diagnosticTrace) } : {}
	};
}
function normalizeAgentHarnessAttemptResult(result) {
	const { aborted, externalAbort, idleTimedOut, promptError, promptErrorSource, timedOut, timedOutByRunBudget, timedOutDuringCompaction, timedOutDuringToolExecution, ...canonical } = result;
	const currentAttemptProvenance = Object.hasOwn(result, "currentAttemptAssistant") ? { currentAttemptAssistant: result.currentAttemptAssistant } : result.lastAssistant ? { currentAttemptAssistant: result.lastAssistant } : {};
	const canonicalWithAttemptProvenance = {
		...canonical,
		...currentAttemptProvenance
	};
	if ("terminal" in canonicalWithAttemptProvenance) return canonicalWithAttemptProvenance;
	const terminal = normalizeAgentRunAttemptTerminal({
		aborted,
		externalAbort,
		idleTimedOut,
		promptError,
		promptErrorSource,
		timedOut,
		timedOutByRunBudget,
		timedOutDuringCompaction,
		timedOutDuringToolExecution
	});
	return {
		...canonicalWithAttemptProvenance,
		terminal
	};
}
function agentHarnessRunOutcome(result) {
	const terminal = projectAgentRunAttemptTerminal(result.terminal);
	if (terminal.timedOut) return "timed_out";
	if (terminal.externalAbort || terminal.aborted) return "aborted";
	if (terminal.promptErrorSource !== null) return "error";
	return "completed";
}
function shouldEmitAgentRunDiagnostics(harness) {
	return harness.id !== "openclaw";
}
function diagnosticChannel(params) {
	return params.messageChannel ?? params.messageProvider;
}
function agentRunDiagnosticBase(params, trace) {
	const channel = diagnosticChannel(params);
	return {
		runId: params.runId,
		...params.sessionKey ? { sessionKey: params.sessionKey } : {},
		...params.sessionId ? { sessionId: params.sessionId } : {},
		provider: params.provider,
		model: params.modelId,
		...params.trigger ? { trigger: params.trigger } : {},
		...channel ? { channel } : {},
		trace
	};
}
function agentRunCompletion(result) {
	const terminal = projectAgentRunAttemptTerminal(result.terminal);
	if (terminal.timedOut || terminal.externalAbort || terminal.aborted) return { outcome: "aborted" };
	if (terminal.promptErrorSource === "hook:before_agent_run") return {
		outcome: "blocked",
		blockedBy: "before_agent_run"
	};
	if (terminal.promptErrorSource !== null) return {
		outcome: "error",
		error: terminal.promptError
	};
	return { outcome: "completed" };
}
function withFallbackDiagnosticTrace(result, trace) {
	if (result.diagnosticTrace || !trace) return result;
	return {
		...result,
		diagnosticTrace: freezeDiagnosticTraceContext(trace)
	};
}
function withFallbackFinalizationDiagnosticTrace(result, trace) {
	if (result.diagnosticTrace || !trace) return result;
	return {
		...result,
		diagnosticTrace: freezeDiagnosticTraceContext(trace)
	};
}
function emitAgentHarnessRunStarted(harness, params, trace) {
	emitTrustedDiagnosticEvent({
		type: "harness.run.started",
		...agentHarnessDiagnosticBase(harness, params, trace)
	});
}
function emitAgentHarnessRunCompleted(params) {
	const { harness, attemptParams, result, startedAt, trace } = params;
	const outcome = agentHarnessRunOutcome(result);
	const terminal = projectAgentRunAttemptTerminal(result.terminal);
	const errorMessage = outcome === "error" ? diagnosticErrorMessage(terminal.promptError) : void 0;
	emitTrustedDiagnosticEventWithPrivateData({
		type: "harness.run.completed",
		...agentHarnessDiagnosticBase(harness, attemptParams, trace ?? result.diagnosticTrace),
		durationMs: Date.now() - startedAt,
		outcome,
		...result.agentHarnessResultClassification ? { resultClassification: result.agentHarnessResultClassification } : {},
		...typeof result.yieldDetected === "boolean" ? { yieldDetected: result.yieldDetected } : {},
		itemLifecycle: { ...result.itemLifecycle }
	}, errorMessage ? { errorMessage } : void 0);
}
function emitAgentHarnessRunError(params) {
	const { harness, attemptParams, startedAt, phase, error, trace } = params;
	const errorMessage = diagnosticErrorMessage(error);
	emitTrustedDiagnosticEventWithPrivateData({
		type: "harness.run.error",
		...agentHarnessDiagnosticBase(harness, attemptParams, trace),
		durationMs: Date.now() - startedAt,
		phase,
		errorCategory: diagnosticErrorCategory(error)
	}, errorMessage ? { errorMessage } : void 0);
}
/** Runs one harness attempt with diagnostics, tracing, and result classification. */
async function runAgentHarnessLifecycleAttempt(harness, params, execute = (attemptParams) => harness.runAttempt(attemptParams)) {
	let result;
	let phase = "prepare";
	const startedAt = Date.now();
	const activeHarnessTrace = getActiveDiagnosticTraceContext();
	let agentRunTrace;
	let agentRunStartedAt = 0;
	let agentRunCompleted = false;
	const emitAgentRunCompleted = (completion) => {
		if (!agentRunTrace || agentRunCompleted) return;
		agentRunCompleted = true;
		const failed = completion.outcome === "error" && completion.error != null;
		const errorMessage = failed ? diagnosticErrorMessage(completion.error) : void 0;
		emitTrustedDiagnosticEventWithPrivateData({
			type: "run.completed",
			...agentRunDiagnosticBase(params, agentRunTrace),
			durationMs: Date.now() - agentRunStartedAt,
			outcome: completion.outcome,
			...completion.blockedBy ? { blockedBy: completion.blockedBy } : {},
			...failed ? { errorCategory: diagnosticErrorCategory(completion.error) } : {}
		}, errorMessage ? { errorMessage } : void 0);
	};
	emitAgentHarnessRunStarted(harness, params, activeHarnessTrace);
	try {
		phase = "prepare";
		assertAgentHarnessContextEngineSupport(harness, params);
		if (shouldEmitAgentRunDiagnostics(harness) && activeHarnessTrace) {
			agentRunTrace = freezeDiagnosticTraceContext(createChildDiagnosticTraceContext(activeHarnessTrace));
			agentRunStartedAt = Date.now();
			emitTrustedDiagnosticEvent({
				type: "run.started",
				...agentRunDiagnosticBase(params, agentRunTrace)
			});
		}
		const runAndClassify = async () => {
			phase = "send";
			const rawResult = await execute(params);
			phase = "resolve";
			return normalizeAgentHarnessAttemptResult(applyAgentHarnessResultClassification(harness, rawResult, params));
		};
		result = agentRunTrace ? await runWithDiagnosticTraceContext(agentRunTrace, runAndClassify) : await runAndClassify();
		result = withFallbackDiagnosticTrace(result, activeHarnessTrace);
	} catch (error) {
		recordAgentHarnessPreflightOwner(error, harness.id);
		emitAgentHarnessRunError({
			harness,
			attemptParams: params,
			startedAt,
			phase,
			error,
			trace: activeHarnessTrace
		});
		emitAgentRunCompleted({
			outcome: "error",
			error
		});
		throw error;
	}
	emitAgentRunCompleted(agentRunCompletion(result));
	emitAgentHarnessRunCompleted({
		harness,
		attemptParams: params,
		result,
		startedAt,
		trace: activeHarnessTrace
	});
	return result;
}
/** Runs one isolated finalization with diagnostics and its narrow result validator. */
async function runAgentHarnessLifecycleFinalization(harness, params, execute) {
	let phase = "prepare";
	const startedAt = Date.now();
	const activeHarnessTrace = getActiveDiagnosticTraceContext();
	const agentRunTrace = shouldEmitAgentRunDiagnostics(harness) && activeHarnessTrace ? freezeDiagnosticTraceContext(createChildDiagnosticTraceContext(activeHarnessTrace)) : void 0;
	emitAgentHarnessRunStarted(harness, params, activeHarnessTrace);
	if (agentRunTrace) emitTrustedDiagnosticEvent({
		type: "run.started",
		...agentRunDiagnosticBase(params, agentRunTrace)
	});
	try {
		const runAndValidate = async () => {
			phase = "send";
			const rawResult = await execute();
			phase = "resolve";
			try {
				return {
					outcome: "answered",
					result: assertSettledTurnFinalizationResult(rawResult)
				};
			} catch (error) {
				if (error instanceof EmptySettledTurnFinalizationError) return {
					outcome: "empty",
					result: error.result
				};
				throw error;
			}
		};
		const rawResult = agentRunTrace ? await runWithDiagnosticTraceContext(agentRunTrace, runAndValidate) : await runAndValidate();
		const result = {
			...rawResult,
			result: withFallbackFinalizationDiagnosticTrace(rawResult.result, activeHarnessTrace)
		};
		if (agentRunTrace) emitTrustedDiagnosticEvent({
			type: "run.completed",
			...agentRunDiagnosticBase(params, agentRunTrace),
			durationMs: Date.now() - startedAt,
			outcome: "completed"
		});
		emitTrustedDiagnosticEvent({
			type: "harness.run.completed",
			...agentHarnessDiagnosticBase(harness, params, result.result.diagnosticTrace ?? activeHarnessTrace),
			durationMs: Date.now() - startedAt,
			outcome: "completed",
			itemLifecycle: {
				startedCount: 0,
				completedCount: 0,
				activeCount: 0
			}
		});
		return result;
	} catch (error) {
		emitAgentHarnessRunError({
			harness,
			attemptParams: params,
			startedAt,
			phase,
			error,
			trace: activeHarnessTrace
		});
		if (agentRunTrace) {
			const errorMessage = diagnosticErrorMessage(error);
			emitTrustedDiagnosticEventWithPrivateData({
				type: "run.completed",
				...agentRunDiagnosticBase(params, agentRunTrace),
				durationMs: Date.now() - startedAt,
				outcome: "error",
				errorCategory: diagnosticErrorCategory(error)
			}, errorMessage ? { errorMessage } : void 0);
		}
		throw error;
	}
}
//#endregion
//#region src/agents/harness/selection.ts
const log = createSubsystemLogger("agents/harness");
const PLUGIN_HARNESS_SENDER_DENY_ALL_PROMPT = "Tool and file actions are disabled for this sender by chat policy. If asked to edit files or use tools, say this sender is not allowed by policy; do not imply retrying will help.";
const PLUGIN_HARNESS_GROUP_DENY_ALL_PROMPT = "Tool and file actions are disabled for this chat by policy. If asked to edit files or use tools, say this chat is not allowed by policy.";
const PLUGIN_HARNESS_RUNTIME_DENY_ALL_PROMPT = "Tool and file actions are disabled by runtime policy. If asked to edit files or use tools, say tools are disabled by policy.";
function listPluginAgentHarnesses() {
	return listRegisteredAgentHarnesses().map((entry) => entry.harness);
}
function resolveAvailableAgentHarnessPolicy(params) {
	return resolveAgentHarnessAvailabilityDecision(params).policy;
}
function resolveAgentHarnessAvailabilityDecision(params) {
	const policy = resolveAgentHarnessPolicy({
		...params,
		modelApi: params.modelProvider?.api,
		modelBaseUrl: params.modelProvider?.baseUrl,
		requestTransportOverrides: params.modelProvider?.requestTransportOverrides
	});
	if (policy.runtime !== "codex" || policy.runtimeSource !== "implicit") return {
		kind: "available",
		policy
	};
	const codexHarness = getRegisteredAgentHarness("codex");
	if (!codexHarness) return {
		kind: "implicit-unavailable",
		policy: {
			...policy,
			runtime: "openclaw"
		}
	};
	const provider = params.provider?.trim();
	if (!provider) return {
		kind: "available",
		policy
	};
	if (codexHarness.harness.supports(buildAgentHarnessSupportContext({
		provider,
		modelId: params.modelId,
		modelProvider: params.modelProvider,
		requestedRuntime: policy.runtime,
		config: params.config,
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		preparedModelProvider: params.preparedModelProvider
	})).supported) return {
		kind: "available",
		policy
	};
	return {
		kind: "implicit-unsupported",
		policy: {
			...policy,
			runtime: "openclaw"
		}
	};
}
function selectAgentHarness(params) {
	return selectAgentHarnessDecision(params).harness;
}
/** Selects one harness that can preserve every prepared route/auth retry candidate. */
function selectAgentHarnessForPreparedModelProviders(params) {
	const { modelProviders, ...selectionParams } = params;
	if (modelProviders.length === 0) return selectAgentHarness(selectionParams);
	const decisions = modelProviders.map((modelProvider) => selectAgentHarnessDecision({
		...selectionParams,
		modelProvider,
		preparedModelProvider: true
	}));
	const first = decisions[0];
	if (!first || decisions.every((decision) => decision.selectedHarnessId === first.selectedHarnessId)) return first?.harness ?? selectAgentHarness(selectionParams);
	return decisions.find((decision) => decision.selectedHarnessId === "openclaw")?.harness ?? createOpenClawAgentHarness();
}
/** Returns whether a plugin harness constructs OpenClaw tools inside its runtime. */
function agentHarnessBuildsOpenClawTools(harnessId) {
	return harnessId === "codex" || harnessId === "copilot";
}
/** Returns whether the selected harness exposes OpenClaw's agent-tool surface. */
function agentHarnessExposesOpenClawTools(harnessId) {
	return harnessId === "openclaw" || agentHarnessBuildsOpenClawTools(harnessId);
}
function selectAgentHarnessDecision(params) {
	const pinnedHarnessId = normalizeOptionalAgentRuntimeId(params.agentHarnessId);
	const runtimeOverride = normalizeOptionalAgentRuntimeId(params.agentHarnessRuntimeOverride);
	const requestedRuntimeOverride = pinnedHarnessId ?? runtimeOverride;
	const selectedRuntimeOverride = requestedRuntimeOverride && !isDefaultAgentRuntimeId(requestedRuntimeOverride) ? requestedRuntimeOverride : void 0;
	const availability = selectedRuntimeOverride ? {
		kind: "available",
		policy: resolveAgentHarnessPolicy({
			...params,
			modelApi: params.modelProvider?.api,
			modelBaseUrl: params.modelProvider?.baseUrl,
			requestTransportOverrides: params.modelProvider?.requestTransportOverrides
		})
	} : resolveAgentHarnessAvailabilityDecision(params);
	const resolvedPolicy = availability.policy;
	const policy = selectedRuntimeOverride ? {
		...resolvedPolicy,
		runtime: selectedRuntimeOverride,
		runtimeSource: "model"
	} : resolvedPolicy;
	const pluginHarnesses = listPluginAgentHarnesses();
	const openClawHarness = createOpenClawAgentHarness();
	const runtime = policy.runtime;
	if (runtime === "openclaw") return buildSelectionDecision({
		harness: openClawHarness,
		policy,
		selectedReason: selectedRuntimeOverride ? "forced_openclaw" : availability.kind === "implicit-unavailable" ? "implicit_plugin_unavailable_openclaw" : availability.kind === "implicit-unsupported" ? "implicit_plugin_unsupported_openclaw" : "forced_openclaw",
		candidates: listHarnessCandidates(pluginHarnesses)
	});
	if (runtime !== "auto") {
		const forced = pluginHarnesses.find((entry) => entry.id === runtime);
		if (forced) {
			if (pinnedHarnessId === runtime && !params.preparedModelProvider) return buildSelectionDecision({
				harness: forced,
				policy,
				selectedReason: "forced_plugin",
				candidates: listHarnessCandidates(pluginHarnesses)
			});
			const supportContext = buildAgentHarnessSupportContext({
				provider: params.provider,
				modelId: params.modelId,
				modelProvider: params.modelProvider,
				requestedRuntime: runtime,
				config: params.config,
				agentId: params.agentId,
				sessionKey: params.sessionKey,
				preparedModelProvider: params.preparedModelProvider,
				providerOwnership: resolveProviderRefOwnership({
					provider: params.provider,
					config: params.config
				})
			});
			const support = forced.supports(supportContext);
			if (support.supported) return buildSelectionDecision({
				harness: forced,
				policy,
				selectedReason: "forced_plugin",
				candidates: listHarnessCandidates(pluginHarnesses)
			});
			if (support.fallbackRuntime === "openclaw") return buildSelectionDecision({
				harness: openClawHarness,
				policy: {
					...policy,
					runtime: "openclaw"
				},
				selectedReason: "plugin_declared_fallback_openclaw",
				candidates: listHarnessCandidates(pluginHarnesses)
			});
			if (isCliRuntimeAliasForProvider({
				runtime,
				provider: params.provider
			})) return buildSelectionDecision({
				harness: openClawHarness,
				policy: {
					...policy,
					runtime: "openclaw"
				},
				selectedReason: "cli_runtime_passthrough_openclaw",
				candidates: listHarnessCandidates(pluginHarnesses)
			});
			throw new Error(`Requested agent harness "${runtime}" does not support ${formatProviderModel(params)}${support.reason ? ` (${support.reason})` : ""}.`);
		}
		if (runtime === "codex" && policy.runtimeSource === "implicit") return buildSelectionDecision({
			harness: openClawHarness,
			policy: {
				...policy,
				runtime: "openclaw"
			},
			selectedReason: "implicit_plugin_unavailable_openclaw",
			candidates: listHarnessCandidates(pluginHarnesses)
		});
		if (isCliRuntimeAliasForProvider({
			runtime,
			provider: params.provider,
			cfg: params.config
		})) return buildSelectionDecision({
			harness: openClawHarness,
			policy: {
				...policy,
				runtime: "openclaw"
			},
			selectedReason: "cli_runtime_passthrough_openclaw",
			candidates: listHarnessCandidates(pluginHarnesses)
		});
		throw new MissingAgentHarnessError(runtime);
	}
	const hintedCandidates = pluginHarnesses.map((harness) => ({
		harness,
		support: resolveAgentHarnessAutoSelectionHint({
			harness,
			provider: params.provider
		})
	}));
	const candidates = hintedCandidates.some((entry) => entry.support === void 0) ? (() => {
		const supportContext = buildAgentHarnessSupportContext({
			provider: params.provider,
			modelId: params.modelId,
			modelProvider: params.modelProvider,
			requestedRuntime: runtime,
			config: params.config,
			agentId: params.agentId,
			sessionKey: params.sessionKey,
			preparedModelProvider: params.preparedModelProvider,
			providerOwnership: resolveProviderRefOwnership({
				provider: params.provider,
				config: params.config
			})
		});
		return hintedCandidates.map(({ harness, support }) => ({
			harness,
			support: support ?? harness.supports(supportContext)
		}));
	})() : hintedCandidates.map(({ harness, support }) => ({
		harness,
		support
	}));
	const selected = candidates.filter((entry) => entry.support.supported).toSorted(compareHarnessSupport)[0]?.harness;
	if (selected) return buildSelectionDecision({
		harness: selected,
		policy,
		selectedReason: "auto_plugin",
		candidates: candidates.map(toSelectionCandidate)
	});
	return buildSelectionDecision({
		harness: openClawHarness,
		policy,
		selectedReason: "auto_openclaw",
		candidates: candidates.map(toSelectionCandidate)
	});
}
async function runAgentHarnessAttempt(params) {
	return runSelectedAgentHarnessAttempt(params);
}
/** Runs the selected harness's fail-closed settled-turn finalization operation. */
async function runAgentHarnessSettledTurnFinalization(params, settledAttempt, harness) {
	const internalParams = params;
	const finalizeSettledTurn = harness.finalizeSettledTurn?.bind(harness);
	if (!finalizeSettledTurn) throw new Error(`Agent harness ${harness.id} cannot safely finalize a settled tool turn.`);
	if (internalParams.systemAgentTool && !isSystemAgentOnlyAllowlist(internalParams.toolsAllow)) throw new Error("OpenClaw host authority requires toolsAllow: [\"openclaw\"]");
	const attemptParams = prepareHarnessFinalizationParams({
		...internalParams,
		operation: "settled-tool-finalization"
	}, isBuiltInOpenClawAgentHarness(harness));
	return await runAgentHarnessOperation(harness, params, () => runWithAgentRingZeroTools([], () => runAgentHarnessLifecycleFinalization(harness, attemptParams, () => finalizeSettledTurn({
		attempt: attemptParams,
		settledAttempt
	}))));
}
async function runSelectedAgentHarnessAttempt(params) {
	let internalParams = params;
	const selection = selectPreparedAgentHarness(params);
	const harness = selection.harness;
	if (internalParams.contextEngineLogicalTurnLease) {
		selectContextEngineForTranscriptHost({
			lease: internalParams.contextEngineLogicalTurnLease,
			host: {
				id: `agent-harness:${harness.id}`,
				label: `agent harness "${harness.id}"`,
				capabilities: harness.contextEngineHostCapabilities ?? []
			},
			operation: "agent-run",
			recorder: internalParams.userTurnTranscriptRecorder
		});
		await drainPendingContextEngineTurnsBeforeRun({
			admission: internalParams.userTurnTranscriptRecorder?.getAdmissionReceipt(),
			isHeartbeat: isHeartbeatLifecycleRunKind(internalParams.bootstrapContextRunKind),
			lease: internalParams.contextEngineLogicalTurnLease,
			recorder: internalParams.userTurnTranscriptRecorder,
			sessionTarget: internalParams.sessionTarget
		});
		const effective = internalParams.contextEngineLogicalTurnLease.begin();
		internalParams = {
			...internalParams,
			contextEngine: effective.engine.info.id === "legacy" ? void 0 : effective.engine
		};
	}
	if (internalParams.systemAgentTool && !isSystemAgentOnlyAllowlist(internalParams.toolsAllow)) throw new Error("OpenClaw host authority requires toolsAllow: [\"openclaw\"]");
	const ringZeroTools = internalParams.systemAgentTool ? [(await import("./system-agent-tool-V-X7tzD5.js")).createSystemAgentTool(internalParams.systemAgentTool)] : [];
	const pluginAttempt = withoutInternalHarnessAuthority(withoutHarnessSetupAuthority(internalParams), harness, selection.builtIn, selection.ownerPluginId);
	logAgentHarnessSelection(selection, {
		provider: params.provider,
		modelId: params.modelId,
		sessionKey: params.sessionKey,
		agentId: params.agentId
	});
	let result;
	try {
		result = await runAgentHarnessOperation(harness, params, () => runWithAgentRingZeroTools(ringZeroTools, () => {
			const hostOpenClawAuthority = isHostScopedAgentToolActive("openclaw") && isSystemAgentOnlyAllowlist(pluginAttempt.params.toolsAllow);
			const preparedParams = selection.builtIn ? pluginAttempt.params : preparePluginHarnessParams(pluginAttempt.params, harness);
			const effectiveAttemptParams = hostOpenClawAuthority && preparedParams.pluginHarnessToolPolicyRestricted ? {
				...preparedParams,
				pluginHarnessToolPolicyRestricted: false
			} : preparedParams;
			assertPluginHarnessConversationToolPolicySupport(harness, effectiveAttemptParams.pluginHarnessToolPolicyRestricted === true);
			return runAgentHarnessLifecycleAttempt(harness, effectiveAttemptParams);
		}));
	} finally {
		pluginAttempt.closeHostCapabilities();
	}
	const admission = internalParams.userTurnTranscriptRecorder?.getAdmissionReceipt();
	if (internalParams.onContextEngineTurnCandidate && admission && result.contextEngineTerminalAnchor) internalParams.onContextEngineTurnCandidate({
		boundary: {
			admission,
			terminal: result.contextEngineTerminalAnchor
		},
		sessionIdUsed: result.sessionIdUsed,
		sessionKey: internalParams.sessionKey,
		sessionTarget: internalParams.sessionTarget,
		sessionFile: result.sessionFileUsed ?? internalParams.sessionFile,
		promptError: result.terminal.kind === "failed",
		aborted: result.terminal.kind === "aborted" || result.terminal.kind === "timeout" && "aborted" in result.terminal && result.terminal.aborted === true,
		yieldAborted: result.terminal.kind === "aborted" && result.terminal.source === "yield_cleanup",
		isHeartbeat: isHeartbeatLifecycleRunKind(internalParams.bootstrapContextRunKind),
		tokenBudget: internalParams.contextTokenBudget,
		contextEngineHostSupport: {
			id: `agent-harness:${harness.id}`,
			label: `agent harness "${harness.id}"`,
			capabilities: harness.contextEngineHostCapabilities ?? []
		},
		harnessId: harness.id,
		providerId: internalParams.provider,
		requestedModelId: internalParams.requestedModelId,
		modelId: internalParams.modelId,
		fallbackReason: internalParams.fallbackReason,
		degradedReason: internalParams.degradedReason,
		config: internalParams.config
	});
	const { contextEngineTerminalAnchor: _contextEngineTerminalAnchor, ...publicResult } = result;
	return publicResult;
}
function selectPreparedAgentHarness(params) {
	return selectAgentHarnessDecision({
		provider: params.provider,
		modelId: params.modelId,
		modelProvider: {
			api: params.model.api,
			baseUrl: params.model.baseUrl,
			...resolveAgentHarnessPreparedRouteSupport(params.runtimePlan?.auth),
			preparedAuth: resolveAgentHarnessPreparedAuthSupport({ plan: params.runtimePlan?.auth })
		},
		config: params.config,
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		agentHarnessId: params.agentHarnessId,
		agentHarnessRuntimeOverride: params.agentHarnessRuntimeOverride,
		preparedModelProvider: params.runtimePlan?.auth !== void 0
	});
}
async function runAgentHarnessOperation(harness, params, execute) {
	const activeTrace = getActiveDiagnosticTraceContext();
	const harnessTrace = freezeDiagnosticTraceContext(activeTrace ? createChildDiagnosticTraceContext(activeTrace) : createDiagnosticTraceContext());
	if (isBuiltInOpenClawAgentHarness(harness)) return await runWithDiagnosticTraceContext(harnessTrace, execute);
	try {
		return await runWithDiagnosticTraceContext(harnessTrace, execute);
	} catch (error) {
		log.warn(`${harness.label} failed; not falling back to embedded OpenClaw backend`, {
			harnessId: harness.id,
			provider: params.provider,
			modelId: params.modelId,
			error: formatErrorMessage(error)
		});
		throw error;
	}
}
function isSystemAgentOnlyAllowlist(toolsAllow) {
	return toolsAllow?.length === 1 && normalizeToolPolicyName(toolsAllow[0] ?? "") === "openclaw";
}
function withoutHarnessSetupAuthority(params) {
	const { contextEngineLogicalTurnLease: _contextEngineLogicalTurnLease, systemAgentTool: _systemAgentTool, ...attemptParams } = params;
	return attemptParams;
}
function withoutInternalHarnessAuthority(params, harness, builtIn, ownerPluginId) {
	if (builtIn) return {
		params,
		closeHostCapabilities: () => {}
	};
	const pluginParams = withoutPluginHarnessPrivateState(params);
	const host = createAgentHarnessHostCapabilities({
		attempt: params,
		pluginId: ownerPluginId ?? (() => {
			throw new Error(`Agent harness ${harness.id} has no authoritative registry owner.`);
		})()
	});
	return {
		params: {
			...pluginParams,
			hostCapabilities: host.capabilities
		},
		closeHostCapabilities: host.close
	};
}
function prepareHarnessFinalizationParams(params, builtIn) {
	const { hostCapabilities: _hostCapabilities, systemAgentTool: _systemAgentTool, ...withoutCapabilities } = params;
	if (builtIn) return withoutCapabilities;
	const pluginParams = withoutPluginHarnessPrivateState(withoutCapabilities);
	const boundary = "plugin harness finalization handoff";
	return {
		...pluginParams,
		model: unwrapModelHeaderSentinelsForProviderEgress(pluginParams.model, boundary),
		resolvedApiKey: pluginParams.resolvedApiKey ? unwrapSecretSentinelsForProviderEgress(pluginParams.resolvedApiKey, boundary) : pluginParams.resolvedApiKey
	};
}
function withoutPluginHarnessPrivateState(params) {
	const { admittedRunContext: _admittedRunContext, contextEngineLogicalTurnLease: _contextEngineLogicalTurnLease, hostCapabilities: _hostCapabilities, onContextEngineTurnCandidate: _onContextEngineTurnCandidate, trajectoryRecorder: _trajectoryRecorder, __openclawSourceReplyDeliveryRuntime: _sourceReplyDeliveryRuntime, ...pluginParams } = params;
	return pluginParams;
}
function preparePluginHarnessParams(params, harness) {
	const boundary = "plugin harness handoff";
	const resolvedApiKey = params.resolvedApiKey ? unwrapSecretSentinelsForProviderEgress(params.resolvedApiKey, boundary) : params.resolvedApiKey;
	const model = unwrapModelHeaderSentinelsForProviderEgress(params.model, boundary);
	const preparedParams = model === params.model && resolvedApiKey === params.resolvedApiKey ? params : {
		...params,
		model,
		resolvedApiKey
	};
	const policies = resolvePluginHarnessToolPolicies(preparedParams, harness.conversationToolPolicySupport === "exact" ? harness.conversationToolPolicySafeDenyTools : void 0);
	return applyPluginHarnessDenyAllToolPolicy({
		...preparedParams,
		pluginHarnessToolPolicyRestricted: policies.toolPolicyRestricted
	}, policies);
}
function assertPluginHarnessConversationToolPolicySupport(harness, restricted) {
	if (harness.id !== "openclaw" && restricted && harness.conversationToolPolicySupport !== "exact") throw new AgentHarnessPreflightError(`${harness.label} cannot enforce this conversation's tool policy. Use the embedded runtime or ask in the main conversation.`, { scope: "harness" });
}
function applyPluginHarnessDenyAllToolPolicy(params, policies) {
	if (isHostScopedAgentToolActive("openclaw") && params.toolsAllow?.length === 1 && normalizeToolPolicyName(params.toolsAllow[0] ?? "") === "openclaw") return params;
	const prompt = resolvePluginHarnessDenyAllToolPolicyPrompt(policies);
	if (!prompt) return params;
	return {
		...params,
		toolsAllow: [],
		extraSystemPrompt: appendPluginHarnessToolPolicyPrompt(params.extraSystemPrompt, prompt)
	};
}
function resolvePluginHarnessPolicyToolsAllow(params) {
	const policies = resolvePluginHarnessToolPolicies(params);
	return [
		policies.senderPolicy,
		policies.groupPolicy,
		...policies.runtimePolicies
	].some(toolPolicyRestrictsTools) ? [] : void 0;
}
/** Resolves whether a harness operation must remove its ambient native tool surface. */
function resolveAgentHarnessNativeToolPolicyRestricted(params, harness) {
	return resolvePluginHarnessToolPolicies(params, harness.conversationToolPolicySupport === "exact" ? harness.conversationToolPolicySafeDenyTools : void 0).toolPolicyRestricted;
}
function resolvePluginHarnessDenyAllToolPolicyPrompt(policies) {
	if (policyDeniesAllTools(policies.senderPolicy) || policyDeniesAllTools(policies.senderScopedGroupPolicy)) return PLUGIN_HARNESS_SENDER_DENY_ALL_PROMPT;
	if (policyDeniesAllTools(policies.groupPolicy)) return PLUGIN_HARNESS_GROUP_DENY_ALL_PROMPT;
	return policies.runtimePolicies.some(policyDeniesAllTools) ? PLUGIN_HARNESS_RUNTIME_DENY_ALL_PROMPT : void 0;
}
function resolvePluginHarnessToolPolicies(params, safeDenyToolNames) {
	const messageProvider = params.messageProvider ?? params.messageChannel;
	const sandboxSessionKey = params.sandboxSessionKey ?? params.sessionKey;
	const sandboxRuntime = resolveSandboxRuntimeStatus({
		cfg: params.config,
		sessionKey: sandboxSessionKey
	});
	const sandboxPolicy = sandboxRuntime.sandboxed ? sandboxRuntime.toolPolicy : void 0;
	const capabilityProfile = resolveConversationCapabilityProfile({
		config: params.config,
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		sandboxSessionKey,
		agentId: params.agentId,
		modelProvider: params.provider,
		modelId: params.modelId,
		messageProvider,
		messageChannel: params.messageChannel,
		conversationToolPolicy: params.conversationToolPolicy,
		agentAccountId: params.agentAccountId,
		groupId: params.groupId,
		groupChannel: params.groupChannel,
		groupSpace: params.groupSpace,
		memberRoleIds: params.memberRoleIds,
		spawnedBy: params.spawnedBy,
		senderId: params.senderId,
		senderName: params.senderName,
		senderUsername: params.senderUsername,
		senderE164: params.senderE164,
		senderIsOwner: params.senderIsOwner,
		sandboxToolPolicy: sandboxPolicy,
		inputProvenance: params.inputProvenance,
		trustedInternalHandoff: params.trustedInternalHandoff,
		scheduledToolPolicy: params.scheduledToolPolicy,
		runtimePluginToolGrant: params.runtimePluginToolGrant
	});
	const groupPolicyParams = {
		config: params.config,
		sessionKey: params.scheduledToolPolicy?.ownerSessionKey ?? params.sessionKey,
		spawnedBy: params.spawnedBy,
		messageProvider,
		groupId: params.groupId,
		groupChannel: params.groupChannel,
		groupSpace: params.groupSpace,
		accountId: params.scheduledToolPolicy?.ownerAccountId ?? params.agentAccountId,
		requireConfiguredAccount: params.scheduledToolPolicy?.mode === "account",
		senderId: params.senderId,
		senderName: params.senderName,
		senderUsername: params.senderUsername,
		senderE164: params.senderE164,
		senderPolicyMode: params.scheduledToolPolicy ? "never" : "always"
	};
	const { policy } = capabilityProfile;
	const requestedToolPolicy = params.disableTools ? { allow: [] } : params.toolsAllow ? { allow: params.toolsAllow } : void 0;
	const explicitPolicies = [
		policy.globalPolicy,
		policy.globalProviderPolicy,
		policy.agentPolicy,
		policy.agentProviderPolicy,
		policy.groupPolicy,
		policy.senderPolicy,
		policy.sandboxPolicy,
		policy.subagentPolicy,
		policy.inheritedToolPolicy,
		policy.runtimeToolPolicyForInheritance,
		requestedToolPolicy
	];
	const safeDenyToolNameSet = safeDenyToolNames ? new Set(safeDenyToolNames.map(normalizeToolPolicyName)) : void 0;
	return {
		senderPolicy: policy.senderPolicy,
		senderScopedGroupPolicy: resolveSenderScopedGroupToolPolicy(params, groupPolicyParams, policy.groupPolicy),
		groupPolicy: policy.groupPolicy,
		runtimePolicies: [
			mergeAlsoAllowPolicy(policy.profilePolicy, policy.profileAlsoAllow),
			mergeAlsoAllowPolicy(policy.providerProfilePolicy, policy.providerProfileAlsoAllow),
			policy.globalPolicy,
			policy.globalProviderPolicy,
			policy.agentPolicy,
			policy.agentProviderPolicy,
			sandboxPolicy,
			policy.subagentPolicy,
			policy.inheritedToolPolicy,
			requestedToolPolicy
		],
		toolPolicyRestricted: explicitPolicies.some((explicitPolicy) => toolPolicyRestrictsHarnessNativeTools(explicitPolicy, safeDenyToolNameSet))
	};
}
function toolPolicyRestrictsHarnessNativeTools(policy, safeDenyToolNames) {
	if (!safeDenyToolNames) return toolPolicyRestrictsTools(policy);
	if (!policy || toolPolicyRestrictsTools({ allow: policy.allow })) return toolPolicyRestrictsTools(policy);
	return expandToolGroups(policy.deny ?? []).some((deniedName) => {
		const normalized = normalizeToolPolicyName(deniedName);
		return !isKnownCoreToolId(normalized) || !safeDenyToolNames.has(normalized);
	});
}
function resolveSenderScopedGroupToolPolicy(params, groupPolicyParams, groupPolicy) {
	if (!policyDeniesAllTools(groupPolicy) || !hasSenderIdentity(params)) return;
	return policyDeniesAllTools(resolveGroupToolPolicy({
		...groupPolicyParams,
		senderId: void 0,
		senderName: void 0,
		senderUsername: void 0,
		senderE164: void 0
	})) ? void 0 : groupPolicy;
}
function hasSenderIdentity(params) {
	return Boolean(params.senderId?.trim() || params.senderName?.trim() || params.senderUsername?.trim() || params.senderE164?.trim());
}
function appendPluginHarnessToolPolicyPrompt(existing, prompt) {
	const trimmed = existing?.trim();
	if (!trimmed) return prompt;
	return trimmed.includes(prompt) ? trimmed : `${trimmed}\n\n${prompt}`;
}
function policyDeniesAllTools(policy) {
	return expandToolGroups(policy?.deny ?? []).some((entry) => normalizeToolPolicyName(entry) === "*");
}
function listHarnessCandidates(harnesses) {
	return harnesses.map((harness) => ({
		id: harness.id,
		label: harness.label,
		pluginId: harness.pluginId
	}));
}
function toSelectionCandidate(entry) {
	return {
		id: entry.harness.id,
		label: entry.harness.label,
		pluginId: entry.harness.pluginId,
		supported: entry.support.supported,
		priority: entry.support.supported ? entry.support.priority : void 0,
		reason: entry.support.reason
	};
}
function buildSelectionDecision(params) {
	const builtIn = isBuiltInOpenClawAgentHarness(params.harness);
	return {
		harness: params.harness,
		builtIn,
		...!builtIn ? { ownerPluginId: resolveAgentHarnessOwnerPluginId(params.harness) } : {},
		policy: params.policy,
		selectedHarnessId: params.harness.id,
		selectedReason: params.selectedReason,
		candidates: params.candidates
	};
}
function logAgentHarnessSelection(selection, params) {
	if (!log.isEnabled("debug")) return;
	log.debug("agent harness selected", {
		provider: params.provider,
		modelId: params.modelId,
		sessionKey: params.sessionKey,
		agentId: params.agentId,
		selectedHarnessId: selection.selectedHarnessId,
		selectedReason: selection.selectedReason,
		runtime: selection.policy.runtime,
		candidates: selection.candidates
	});
}
function formatProviderModel(params) {
	return params.modelId ? `${params.provider}/${params.modelId}` : params.provider;
}
//#endregion
export { resolvePluginHarnessPolicyToolsAllow as a, selectAgentHarness as c, resolveAvailableAgentHarnessPolicy as i, selectAgentHarnessForPreparedModelProviders as l, agentHarnessExposesOpenClawTools as n, runAgentHarnessAttempt as o, resolveAgentHarnessNativeToolPolicyRestricted as r, runAgentHarnessSettledTurnFinalization as s, agentHarnessBuildsOpenClawTools as t };
