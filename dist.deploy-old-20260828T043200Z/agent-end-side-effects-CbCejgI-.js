import { l as normalizeOptionalString, s as normalizeNullableString } from "./string-coerce-CIXf7egm.js";
import { s as asFiniteNumber } from "./number-coercion-CLj0HTDM.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { f as resolveAgentIdFromSessionKey } from "./session-key-Dbce_H9p.js";
import { o as resolveSessionStorePathCore } from "./paths-DVAvlIOc.js";
import { t as createSubsystemLogger } from "./subsystem-a4KzJVZG.js";
import { p as stripRuntimeContextCustomMessages } from "./internal-runtime-context-E3ku7Huk.js";
import { t as GatewayDrainingError } from "./gateway-work-admission-CTDt7IQ1.js";
import { g as publishTranscriptUpdate } from "./session-accessor.sqlite-lifecycle-state-DAt_gV_K.js";
import "./session-accessor-B-FKZX9M.js";
import { P as runWithSessionTranscriptReadFence } from "./session-accessor.sqlite-transcript-store-Bx_F0DmJ.js";
import { l as resolveContextEngineOwnerPluginId } from "./registry-BL4inl-J.js";
import { h as consumeRunSkillUsage } from "./agent-tools.before-tool-call-DoS1-Lb6.js";
import "./sessions-PHTfe5gZ.js";
import { t as SessionManager } from "./session-manager-NHyzKWb5.js";
import { c as recordTaskRunProgressByRunId, i as failTaskRunByRunId, n as createQueuedTaskRun, t as completeTaskRunByRunId, u as startTaskRunByRunId } from "./detached-task-runtime-BAMhKtnX.js";
import { r as enqueueCommandInLane, u as isGatewayDraining } from "./command-queue-CBS1Vl32.js";
import { T as findActiveSessionTask } from "./media-generation-task-status-BciEsE_o.js";
import { n as OPENCLAW_EMBEDDED_CONTEXT_ENGINE_HOST } from "./host-compat-xESS3bi6.js";
import { t as log$1 } from "./logger-ZAfp-Df-.js";
import { v as runWithPreparedMemoryPromptSection } from "./memory-state-B_83SJ8T.js";
import { n as rewriteTranscriptEntriesInSessionManager, t as resolveRuntimeTranscriptReadTarget } from "./transcript-runtime-state-BKSN3FAG.js";
import { d as resolveContextEngineCapabilities, n as buildAfterTurnRuntimeContextFromUsage, t as buildAfterTurnRuntimeContext } from "./attempt-prompt-helpers-7ku-2qy7.js";
import { c as updateTaskNotifyPolicyForOwner, i as findTaskByRunIdForOwner, n as cancelTaskByIdForOwner } from "./task-owner-access-DEqG-4SY.js";
import { r as runAgentHarnessAgentEndHook, t as awaitAgentHarnessAgentEndHook } from "./lifecycle-hook-helpers-D2leHcq2.js";
import { randomUUID } from "node:crypto";
//#region src/context-engine/runtime-settings.ts
const RUNTIME_REASON_CODES = /* @__PURE__ */ new Set([
	"provider_timeout",
	"provider_unavailable",
	"rate_limited",
	"context_overflow",
	"runtime_unavailable",
	"unknown"
]);
const RUNTIME_REASON_PATTERNS = [
	["provider_timeout", /timeout/iu],
	["rate_limited", /rate|limit|429/iu],
	["context_overflow", /overflow|context|pressure/iu],
	["runtime_unavailable", /runtime/iu],
	["provider_unavailable", /provider|primary|unavailable/iu]
];
function normalizeReasonCode(value) {
	const normalized = normalizeNullableString(value);
	if (!normalized) return null;
	if (RUNTIME_REASON_CODES.has(normalized)) return normalized;
	return RUNTIME_REASON_PATTERNS.find(([, pattern]) => pattern.test(normalized))?.[0] ?? "unknown";
}
function buildContextEngineRuntimeSettings(params) {
	const hostId = normalizeNullableString(params.contextEngineHost.id);
	const selectedId = normalizeNullableString(params.selectedContextEngineId);
	const selectionSource = params.contextEngineSelectionSource ?? (selectedId ? "configured" : "unknown");
	const requestedModel = normalizeNullableString(params.requestedModel);
	const resolvedModel = normalizeNullableString(params.resolvedModel);
	const fallbackReason = normalizeReasonCode(params.fallbackReason);
	const degradedReason = normalizeReasonCode(params.degradedReason);
	const resolvedViaFallback = requestedModel !== null && resolvedModel !== null && requestedModel !== resolvedModel;
	return {
		schemaVersion: 1,
		runtime: {
			host: "openclaw",
			mode: params.mode ?? (degradedReason ? "degraded" : fallbackReason || resolvedViaFallback ? "fallback" : "normal"),
			harnessId: normalizeNullableString(params.harnessId),
			runtimeId: normalizeNullableString(params.runtimeId)
		},
		model: {
			requested: requestedModel,
			resolved: resolvedModel,
			provider: normalizeNullableString(params.provider),
			family: normalizeNullableString(params.modelFamily)
		},
		contextEngineSelection: {
			selectedId,
			source: selectionSource
		},
		executionHost: {
			id: hostId,
			label: normalizeNullableString(params.contextEngineHost.label)
		},
		limits: {
			promptTokenBudget: asFiniteNumber(params.promptTokenBudget) ?? null,
			maxOutputTokens: asFiniteNumber(params.maxOutputTokens) ?? null
		},
		diagnostics: {
			fallbackReason,
			degradedReason
		}
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/context-engine-maintenance.ts
/**
* Schedules and runs deferred context-engine turn maintenance.
*/
const TURN_MAINTENANCE_TASK_KIND = "context_engine_turn_maintenance";
const TURN_MAINTENANCE_LANE_PREFIX = "context-engine-turn-maintenance:";
const TURN_MAINTENANCE_LONG_WAIT_MS = 1e4;
const DEFERRED_TURN_MAINTENANCE_ABORT_STATE_KEY = Symbol.for("openclaw.contextEngineTurnMaintenanceAbortState");
const activeDeferredTurnMaintenanceRuns = /* @__PURE__ */ new Map();
function unregisterDeferredTurnMaintenanceAbortSignalHandlers(processLike, state) {
	for (const [signal, handler] of state.cleanupHandlers) processLike.off(signal, handler);
	state.cleanupHandlers.clear();
}
async function disposeDeferredMaintenanceContextEngine(contextEngine) {
	try {
		await contextEngine.dispose?.();
	} catch (err) {
		log$1.warn("context engine dispose failed after deferred maintenance", { errorMessage: formatErrorMessage(err) });
	}
}
function createDeferredTurnMaintenanceAbortSignal(params) {
	const processLike = params?.processLike ?? process;
	const state = processLike[DEFERRED_TURN_MAINTENANCE_ABORT_STATE_KEY] ??= {
		controllers: /* @__PURE__ */ new Set(),
		cleanupHandlers: /* @__PURE__ */ new Map()
	};
	const handleTerminationSignal = (signalName) => {
		const shouldReraise = processLike.listenerCount?.(signalName) === 1;
		for (const activeController of state.controllers) if (!activeController.signal.aborted) activeController.abort(/* @__PURE__ */ new Error(`received ${signalName} while waiting for deferred maintenance`));
		state.controllers.clear();
		unregisterDeferredTurnMaintenanceAbortSignalHandlers(processLike, state);
		if (shouldReraise && typeof processLike.kill === "function") try {
			processLike.kill(processLike.pid ?? process.pid, signalName);
		} catch {}
	};
	if (state.cleanupHandlers.size === 0) for (const signal of ["SIGINT", "SIGTERM"]) {
		const handler = () => handleTerminationSignal(signal);
		state.cleanupHandlers.set(signal, handler);
		processLike.on(signal, handler);
	}
	const controller = new AbortController();
	state.controllers.add(controller);
	return {
		abortSignal: controller.signal,
		dispose: () => {
			state.controllers.delete(controller);
			if (state.controllers.size === 0) unregisterDeferredTurnMaintenanceAbortSignalHandlers(processLike, state);
		}
	};
}
function resetDeferredTurnMaintenanceStateForTest() {
	activeDeferredTurnMaintenanceRuns.clear();
	const processLike = process;
	const state = processLike[DEFERRED_TURN_MAINTENANCE_ABORT_STATE_KEY];
	if (!state) return;
	state.controllers.clear();
	unregisterDeferredTurnMaintenanceAbortSignalHandlers(processLike, state);
	delete processLike[DEFERRED_TURN_MAINTENANCE_ABORT_STATE_KEY];
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.contextEngineMaintenanceTestApi")] = {
	createDeferredTurnMaintenanceAbortSignal,
	resetDeferredTurnMaintenanceStateForTest
};
async function waitForDeferredTurnMaintenanceForSession(sessionKey) {
	const normalizedSessionKey = normalizeOptionalString(sessionKey);
	if (!normalizedSessionKey) return;
	await activeDeferredTurnMaintenanceRuns.get(normalizedSessionKey)?.promise;
}
function buildTurnMaintenanceTaskDescriptor(params) {
	const runId = params.runId ?? `turn-maint:${params.sessionKey}:${Date.now().toString(36)}:${randomUUID().slice(0, 8)}`;
	return createQueuedTaskRun({
		runtime: "acp",
		taskKind: TURN_MAINTENANCE_TASK_KIND,
		sourceId: TURN_MAINTENANCE_TASK_KIND,
		requesterSessionKey: params.sessionKey,
		ownerKey: params.sessionKey,
		scopeKind: "session",
		runId,
		label: "Context engine turn maintenance",
		task: "Deferred context-engine maintenance after turn.",
		notifyPolicy: params.notifyPolicy ?? "silent",
		deliveryStatus: params.deliveryStatus ?? "not_applicable",
		preferMetadata: true
	});
}
/**
* Attach runtime-owned transcript rewrite helpers to an existing
* context-engine runtime context payload.
*/
function buildContextEngineMaintenanceRuntimeContext(params) {
	return {
		...params.runtimeContext,
		...resolveContextEngineCapabilities({
			config: params.config,
			sessionKey: params.sessionKey,
			explicitAgentId: params.contextEngineAgentId,
			authProfileId: normalizeOptionalString(params.runtimeContext?.authProfileId),
			contextEnginePluginId: params.contextEnginePluginId,
			purpose: params.purpose ?? "context-engine.maintenance"
		}),
		...params.sessionTarget ? { sessionTarget: params.sessionTarget } : {},
		...params.allowDeferredCompactionExecution ? { allowDeferredCompactionExecution: true } : {},
		rewriteTranscriptEntries: async (request) => {
			const runtimeAgentId = params.sessionTarget?.agentId ?? params.agentId;
			const runtimeSessionKey = normalizeOptionalString(params.sessionTarget?.sessionKey ?? params.sessionKey);
			if (!runtimeSessionKey) throw new Error("Context-engine transcript rewrite requires a session key");
			const runtimeStorePath = params.sessionTarget?.storePath ?? (runtimeAgentId ? resolveSessionStorePathCore(params.config?.session?.store, { agentId: runtimeAgentId }) : void 0);
			let runtimeTarget;
			let sessionManager = params.sessionManager;
			if (!sessionManager) {
				runtimeTarget = await resolveRuntimeTranscriptReadTarget({
					sessionId: params.sessionTarget?.sessionId ?? params.sessionId,
					sessionKey: runtimeSessionKey,
					sessionFile: params.sessionFile,
					...runtimeAgentId ? { agentId: runtimeAgentId } : {},
					...runtimeStorePath ? { storePath: runtimeStorePath } : {}
				});
				sessionManager = SessionManager.open(runtimeTarget);
			}
			const rewriteSessionManagerEntries = () => rewriteTranscriptEntriesInSessionManager({
				sessionManager,
				replacements: request.replacements
			});
			const result = params.withSessionManagerRewriteLock ? await params.withSessionManagerRewriteLock(rewriteSessionManagerEntries) : rewriteSessionManagerEntries();
			if (result.changed && runtimeTarget) await publishTranscriptUpdate(runtimeTarget);
			return result;
		}
	};
}
async function executeContextEngineMaintenance(params) {
	if (typeof params.contextEngine.maintain !== "function") return;
	const result = await params.contextEngine.maintain({
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		sessionTarget: params.sessionTarget,
		sessionFile: params.sessionFile,
		runtimeSettings: params.runtimeSettings,
		runtimeContext: buildContextEngineMaintenanceRuntimeContext({
			...params,
			sessionManager: params.executionMode === "background" ? void 0 : params.sessionManager,
			withSessionManagerRewriteLock: params.executionMode === "background" ? void 0 : params.withSessionManagerRewriteLock,
			allowDeferredCompactionExecution: params.executionMode === "background",
			purpose: `context-engine.${params.reason}.maintenance`,
			contextEnginePluginId: resolveContextEngineOwnerPluginId(params.contextEngine)
		})
	});
	if (result.changed) log$1.info(`[context-engine] maintenance(${params.reason}) changed transcript rewrittenEntries=${result.rewrittenEntries} bytesFreed=${result.bytesFreed} sessionKey=${params.sessionKey ?? params.sessionId ?? "unknown"}`);
	return result;
}
async function runDeferredTurnMaintenanceWorker(params) {
	let surfacedUserNotice = false;
	let longRunningTimer;
	const shutdownAbort = createDeferredTurnMaintenanceAbortSignal();
	const taskRun = {
		runId: params.runId,
		runtime: "acp",
		sessionKey: params.sessionKey
	};
	const makeTaskVisible = (notifyPolicy) => buildTurnMaintenanceTaskDescriptor({
		sessionKey: params.sessionKey,
		runId: params.runId,
		notifyPolicy,
		deliveryStatus: "pending"
	});
	try {
		const runningAt = Date.now();
		startTaskRunByRunId({
			...taskRun,
			startedAt: runningAt,
			lastEventAt: runningAt,
			progressSummary: "Running deferred maintenance.",
			eventSummary: "Starting deferred maintenance."
		});
		longRunningTimer = setTimeout(() => {
			try {
				makeTaskVisible("state_changes");
				surfacedUserNotice = true;
				const summary = "Deferred maintenance is still running.";
				recordTaskRunProgressByRunId({
					...taskRun,
					lastEventAt: Date.now(),
					progressSummary: summary,
					eventSummary: summary
				});
			} catch (error) {
				log$1.warn(`failed to surface deferred maintenance progress: ${String(error)}`);
			}
		}, TURN_MAINTENANCE_LONG_WAIT_MS);
		const result = await executeContextEngineMaintenance({
			...params,
			executionMode: "background"
		});
		const endedAt = Date.now();
		completeTaskRunByRunId({
			...taskRun,
			endedAt,
			lastEventAt: endedAt,
			progressSummary: result?.changed ? "Deferred maintenance completed with transcript changes." : "Deferred maintenance completed.",
			terminalSummary: result?.changed ? `Rewrote ${result.rewrittenEntries} transcript entr${result.rewrittenEntries === 1 ? "y" : "ies"} and freed ${result.bytesFreed} bytes.` : "No transcript changes were needed."
		});
	} catch (err) {
		if (shutdownAbort.abortSignal.aborted) {
			const task = findTaskByRunIdForOwner({
				runId: params.runId,
				callerOwnerKey: params.sessionKey,
				callerAgentId: params.agentId,
				config: params.config
			});
			if (task) cancelTaskByIdForOwner({
				taskId: task.taskId,
				callerOwnerKey: params.sessionKey,
				callerAgentId: params.agentId,
				config: params.config,
				endedAt: Date.now(),
				terminalSummary: "Deferred maintenance cancelled during shutdown."
			});
			return;
		}
		const endedAt = Date.now();
		const reason = formatErrorMessage(err);
		if (!surfacedUserNotice) makeTaskVisible("done_only");
		failTaskRunByRunId({
			...taskRun,
			endedAt,
			lastEventAt: endedAt,
			error: reason,
			progressSummary: "Deferred maintenance failed.",
			terminalSummary: reason
		});
		log$1.warn(`deferred context engine maintenance failed: ${reason}`);
	} finally {
		if (longRunningTimer) clearTimeout(longRunningTimer);
		shutdownAbort.dispose();
		if (params.disposeContextEngineAfterMaintenance) await disposeDeferredMaintenanceContextEngine(params.contextEngine);
	}
}
function scheduleDeferredTurnMaintenance(params) {
	const sessionKey = normalizeOptionalString(params.sessionKey);
	if (!sessionKey) return;
	if (isGatewayDraining()) {
		params.onScheduleFailure?.(new GatewayDrainingError());
		return;
	}
	const activeRun = activeDeferredTurnMaintenanceRuns.get(sessionKey);
	if (activeRun) {
		const supersededParams = activeRun.rerunRequested ? activeRun.latestParams : void 0;
		activeRun.rerunRequested = true;
		activeRun.latestParams = {
			...params,
			sessionKey
		};
		if (supersededParams?.disposeContextEngineAfterMaintenance && supersededParams.contextEngine !== params.contextEngine) disposeDeferredMaintenanceContextEngine(supersededParams.contextEngine);
		return activeRun.promise;
	}
	const existingTask = findActiveSessionTask({
		sessionKey,
		runtime: "acp",
		taskKind: TURN_MAINTENANCE_TASK_KIND
	});
	const reusableTask = existingTask?.runId?.trim() ? existingTask : void 0;
	if (existingTask && !reusableTask) {
		updateTaskNotifyPolicyForOwner({
			taskId: existingTask.taskId,
			callerOwnerKey: sessionKey,
			callerAgentId: params.agentId,
			config: params.config,
			notifyPolicy: "silent"
		});
		cancelTaskByIdForOwner({
			taskId: existingTask.taskId,
			callerOwnerKey: sessionKey,
			callerAgentId: params.agentId,
			config: params.config,
			endedAt: Date.now(),
			terminalSummary: "Superseded by refreshed deferred maintenance task."
		});
	}
	const task = reusableTask ?? buildTurnMaintenanceTaskDescriptor({ sessionKey });
	if (!task) {
		log$1.warn("[context-engine] failed to create deferred turn maintenance task", { sessionKey });
		return;
	}
	const lane = `${TURN_MAINTENANCE_LANE_PREFIX}${sessionKey}`;
	log$1.info(`[context-engine] deferred turn maintenance ${reusableTask ? "resuming" : "queued"} taskId=${task.taskId} sessionKey=${sessionKey} lane=${lane}`);
	const cancelFailedTask = (error) => {
		const errorMessage = formatErrorMessage(error);
		log$1.warn(`failed to schedule deferred context engine maintenance: ${errorMessage}`);
		cancelTaskByIdForOwner({
			taskId: task.taskId,
			callerOwnerKey: sessionKey,
			callerAgentId: params.agentId,
			config: params.config,
			endedAt: Date.now(),
			terminalSummary: `Deferred maintenance could not be scheduled: ${errorMessage}`
		});
	};
	const schedulerAbort = createDeferredTurnMaintenanceAbortSignal();
	let runPromise;
	try {
		runPromise = enqueueCommandInLane(lane, () => runDeferredTurnMaintenanceWorker({
			...params,
			sessionKey,
			runId: task.runId
		}));
	} catch (err) {
		schedulerAbort.dispose();
		cancelFailedTask(err);
		return;
	}
	const cleanupDeferredTurnMaintenance = async () => {
		schedulerAbort.dispose();
		const current = activeDeferredTurnMaintenanceRuns.get(sessionKey);
		if (current !== state) return;
		const shutdownTriggered = schedulerAbort.abortSignal.aborted;
		const rerunParams = current.rerunRequested && !shutdownTriggered ? current.latestParams : void 0;
		const discardedRerunParams = current.rerunRequested && shutdownTriggered ? current.latestParams : void 0;
		activeDeferredTurnMaintenanceRuns.delete(sessionKey);
		if (rerunParams) await scheduleDeferredTurnMaintenance(rerunParams);
		else if (discardedRerunParams?.disposeContextEngineAfterMaintenance) await disposeDeferredMaintenanceContextEngine(discardedRerunParams.contextEngine);
	};
	const trackedPromise = runPromise.catch((err) => {
		params.onScheduleFailure?.(err);
		cancelFailedTask(err);
	}).then(cleanupDeferredTurnMaintenance, async (error) => {
		await cleanupDeferredTurnMaintenance();
		throw error;
	});
	const state = {
		promise: trackedPromise,
		rerunRequested: false,
		latestParams: {
			...params,
			sessionKey
		}
	};
	activeDeferredTurnMaintenanceRuns.set(sessionKey, state);
	return trackedPromise;
}
/**
* Run optional context-engine transcript maintenance and normalize the result.
*/
async function runContextEngineMaintenance(params) {
	const contextEngine = params.contextEngine;
	if (typeof contextEngine?.maintain !== "function") return;
	const executionMode = params.executionMode ?? "foreground";
	if (params.reason === "turn" && executionMode !== "background" && contextEngine.info.turnMaintenanceMode === "background") {
		try {
			const sessionKey = normalizeOptionalString(params.sessionKey);
			if (!sessionKey) {
				params.onDeferredMaintenanceFailure?.(/* @__PURE__ */ new Error("Deferred context-engine maintenance requires a session key"));
				return;
			}
			const deferred = scheduleDeferredTurnMaintenance({
				...params,
				contextEngine,
				sessionKey,
				disposeContextEngineAfterMaintenance: params.disposeDeferredContextEngineAfterMaintenance,
				onScheduleFailure: params.onDeferredMaintenanceFailure
			});
			if (deferred) params.onDeferredMaintenance?.(deferred);
		} catch (err) {
			log$1.warn(`failed to schedule deferred context engine maintenance: ${String(err)}`);
		}
		return;
	}
	try {
		return await executeContextEngineMaintenance({
			...params,
			contextEngine,
			executionMode
		});
	} catch (err) {
		log$1.warn(`context engine maintain failed (${params.reason}): ${String(err)}`);
		return;
	}
}
//#endregion
//#region src/agents/harness/context-engine-lifecycle.ts
function preparePreTurnRuntimeContext(runtimeContext) {
	if (!runtimeContext?.rewriteTranscriptEntries) return runtimeContext;
	const { rewriteTranscriptEntries: _rewriteTranscriptEntries, ...fenced } = runtimeContext;
	return fenced;
}
function runWithHarnessContextEngineTranscriptFence(transcriptReadFence, run) {
	return runWithSessionTranscriptReadFence(transcriptReadFence, run);
}
function buildHarnessContextEngineRuntimeSettings(params) {
	return params.runtimeSettings ?? (() => {
		const selectedId = params.contextEngine?.info.id;
		return buildContextEngineRuntimeSettings({
			contextEngineHost: params.contextEngineHostSupport ?? OPENCLAW_EMBEDDED_CONTEXT_ENGINE_HOST,
			harnessId: params.harnessId,
			runtimeId: params.runtimeId,
			provider: params.providerId,
			requestedModel: params.requestedModelId,
			resolvedModel: params.modelId ?? params.requestedModelId,
			modelFamily: params.modelFamily ?? null,
			selectedContextEngineId: selectedId,
			contextEngineSelectionSource: selectedId === "legacy" ? "default" : selectedId ? "configured" : "unknown",
			promptTokenBudget: params.tokenBudget,
			maxOutputTokens: params.maxOutputTokens,
			fallbackReason: params.fallbackReason,
			degradedReason: params.degradedReason
		});
	})();
}
/**
* Run optional bootstrap + bootstrap maintenance for a harness-owned context engine.
*/
async function bootstrapHarnessContextEngine(params) {
	if (!params.hadSessionFile || !(params.contextEngine?.bootstrap || params.contextEngine?.maintain)) return;
	try {
		const runtimeSettings = buildHarnessContextEngineRuntimeSettings(params);
		const runtimeContext = preparePreTurnRuntimeContext(params.runtimeContext);
		await runWithHarnessContextEngineTranscriptFence(params.transcriptReadFence, async () => {
			if (typeof params.contextEngine?.bootstrap === "function") await params.contextEngine.bootstrap({
				sessionId: params.sessionId,
				sessionKey: params.sessionKey,
				sessionTarget: params.sessionTarget,
				sessionFile: params.sessionFile,
				runtimeSettings,
				runtimeContext
			});
			await (params.runMaintenance ?? runHarnessContextEngineMaintenance)({
				contextEngine: params.contextEngine,
				sessionId: params.sessionId,
				sessionKey: params.sessionKey,
				sessionTarget: params.sessionTarget,
				sessionFile: params.sessionFile,
				reason: "bootstrap",
				sessionManager: params.sessionManager,
				runtimeContext,
				runtimeSettings,
				config: params.config
			});
		});
	} catch (bootstrapErr) {
		params.warn(`context engine bootstrap failed: ${String(bootstrapErr)}`);
	}
}
/**
* Assemble model context through the active harness-owned context engine.
*/
async function assembleHarnessContextEngine(params) {
	if (!params.contextEngine) return;
	const contextEngine = params.contextEngine;
	const messages = stripRuntimeContextCustomMessages(params.messages).slice();
	const runtimeSettings = buildHarnessContextEngineRuntimeSettings(params);
	const runtimeContext = preparePreTurnRuntimeContext(params.runtimeContext);
	const assemble = () => contextEngine.assemble({
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		messages,
		tokenBudget: params.tokenBudget,
		...params.availableTools ? { availableTools: params.availableTools } : {},
		...params.citationsMode ? { citationsMode: params.citationsMode } : {},
		model: params.modelId,
		runtimeSettings,
		runtimeContext,
		...params.prompt !== void 0 ? { prompt: params.prompt } : {}
	});
	return ensureAssembleResultShape(await runWithHarnessContextEngineTranscriptFence(params.transcriptReadFence, async () => contextEngine.info.id === "legacy" ? await assemble() : await runWithPreparedMemoryPromptSection({
		availableTools: new Set(params.availableTools),
		citationsMode: params.citationsMode,
		agentId: params.agentId ?? resolveAgentIdFromSessionKey(params.sessionKey),
		agentSessionKey: params.sessionKey,
		sandboxed: params.sandboxed
	}, assemble)), contextEngine.info.id);
}
/**
* Validate that a context engine's assemble() return value matches the
* AssembleResult contract before the runner consumes it. Engines that omit
* `messages` or return a non-array previously crashed the runner downstream
* when prompt assembly tried to read `activeSession.messages.length` (#75541).
*
* Throws a descriptive error so the runner's existing assemble try/catch can
* log the offending engine id and fall back to the unmodified pipeline
* messages instead of poisoning session state.
*/
function ensureAssembleResultShape(result, engineId) {
	if (!result || typeof result !== "object") throw new Error(`context engine "${engineId}" assemble() returned an invalid result: expected an object with a "messages" array (got ${describeAssembleResultType(result)})`);
	const candidate = result;
	if (!Array.isArray(candidate.messages)) throw new Error(`context engine "${engineId}" assemble() returned an invalid result: expected an object with a "messages" array (got messages of type ${describeAssembleResultType(candidate.messages)})`);
	return result;
}
function describeAssembleResultType(value) {
	if (value === null) return "null";
	if (Array.isArray(value)) return "array";
	return typeof value;
}
/**
* Finalize a completed harness turn via afterTurn or ingest fallbacks.
*/
async function finalizeHarnessContextEngineTurn(params) {
	if (!params.contextEngine) return { postTurnFinalizationSucceeded: true };
	if (params.promptError || params.aborted || params.yieldAborted) return { postTurnFinalizationSucceeded: true };
	const conversationSnapshot = buildContextEngineConversationSnapshot({
		messagesSnapshot: params.messagesSnapshot,
		prePromptMessageCount: params.prePromptMessageCount
	});
	const runtimeSettings = buildHarnessContextEngineRuntimeSettings(params);
	const runtimeContext = params.runtimeContext;
	let postTurnFinalizationSucceeded = true;
	if (typeof params.contextEngine.afterTurn === "function") try {
		await params.contextEngine.afterTurn({
			sessionId: params.sessionIdUsed,
			sessionKey: params.sessionKey,
			sessionTarget: params.sessionTarget,
			sessionFile: params.sessionFile,
			messages: conversationSnapshot.messages,
			prePromptMessageCount: conversationSnapshot.prePromptMessageCount,
			tokenBudget: params.tokenBudget,
			runtimeSettings,
			runtimeContext,
			isHeartbeat: params.isHeartbeat
		});
	} catch (afterTurnErr) {
		postTurnFinalizationSucceeded = false;
		params.warn(`context engine afterTurn failed: ${String(afterTurnErr)}`);
	}
	else {
		const newMessages = conversationSnapshot.messages.slice(conversationSnapshot.prePromptMessageCount);
		if (newMessages.length > 0) if (typeof params.contextEngine.ingestBatch === "function") try {
			await params.contextEngine.ingestBatch({
				sessionId: params.sessionIdUsed,
				sessionKey: params.sessionKey,
				messages: newMessages,
				isHeartbeat: params.isHeartbeat
			});
		} catch (ingestErr) {
			postTurnFinalizationSucceeded = false;
			params.warn(`context engine ingest failed: ${String(ingestErr)}`);
		}
		else for (const msg of newMessages) try {
			await params.contextEngine.ingest?.({
				sessionId: params.sessionIdUsed,
				sessionKey: params.sessionKey,
				message: msg,
				isHeartbeat: params.isHeartbeat
			});
		} catch (ingestErr) {
			postTurnFinalizationSucceeded = false;
			params.warn(`context engine ingest failed: ${String(ingestErr)}`);
		}
	}
	if (!params.promptError && !params.aborted && !params.yieldAborted && postTurnFinalizationSucceeded) await (params.runMaintenance ?? runHarnessContextEngineMaintenance)({
		contextEngine: params.contextEngine,
		sessionId: params.sessionIdUsed,
		sessionKey: params.sessionKey,
		sessionTarget: params.sessionTarget,
		sessionFile: params.sessionFile,
		reason: "turn",
		sessionManager: params.sessionManager,
		runtimeContext,
		runtimeSettings,
		config: params.config
	});
	return { postTurnFinalizationSucceeded };
}
function buildContextEngineConversationSnapshot(params) {
	const prePromptMessages = stripRuntimeContextCustomMessages(params.messagesSnapshot.slice(0, params.prePromptMessageCount));
	const turnMessages = stripRuntimeContextCustomMessages(params.messagesSnapshot.slice(params.prePromptMessageCount));
	return {
		messages: [...prePromptMessages, ...turnMessages],
		prePromptMessageCount: prePromptMessages.length
	};
}
/**
* Build runtime context passed into harness context-engine hooks.
*/
function buildHarnessContextEngineRuntimeContext(params) {
	return buildAfterTurnRuntimeContext(params);
}
/**
* Build runtime context passed into harness context-engine hooks from usage data.
*/
function buildHarnessContextEngineRuntimeContextFromUsage(params) {
	return buildAfterTurnRuntimeContextFromUsage(params);
}
/**
* Run optional transcript maintenance for a harness-owned context engine.
*/
async function runHarnessContextEngineMaintenance(params) {
	const runtimeSettings = buildHarnessContextEngineRuntimeSettings(params);
	return await runContextEngineMaintenance({
		contextEngine: params.contextEngine,
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		sessionTarget: params.sessionTarget,
		sessionFile: params.sessionFile,
		reason: params.reason,
		sessionManager: params.sessionManager,
		withSessionManagerRewriteLock: params.withSessionManagerRewriteLock,
		runtimeContext: params.runtimeContext,
		runtimeSettings,
		executionMode: params.executionMode,
		onDeferredMaintenance: params.onDeferredMaintenance,
		config: params.config
	});
}
/**
* Return true when a non-legacy context engine should affect plugin harness behavior.
*/
function isActiveHarnessContextEngine(contextEngine) {
	return Boolean(contextEngine && contextEngine.info.id !== "legacy");
}
//#endregion
//#region src/agents/harness/agent-end-side-effects.ts
/**
* Agent-end side effect runner.
*
* Harnesses use this to trigger skill experience review and plugin agent_end hooks
* either fire-and-forget or awaited during tests/shutdown.
*/
const log = createSubsystemLogger("agents/harness");
async function runCoreAgentEndSideEffects(params) {
	const usedSkills = consumeRunSkillUsage(params.ctx.runId);
	if (!params.ctx.foregroundPromptContext) return;
	const ctx = {
		...params.ctx,
		foregroundPromptContext: params.ctx.foregroundPromptContext
	};
	try {
		const { scheduleSkillExperienceReview } = await import("./experience-review-default-BlzLASE8.js");
		scheduleSkillExperienceReview({
			event: params.event,
			ctx,
			usedSkills,
			...params.ctx.config ? { config: params.ctx.config } : {}
		});
	} catch (error) {
		log.warn(`skill experience review scheduling failed: ${String(error)}`);
	}
}
/** Starts agent-end side effects without waiting for completion. */
function runAgentEndSideEffects(params) {
	runCoreAgentEndSideEffects(params);
	runAgentHarnessAgentEndHook(params);
}
/** Runs agent-end side effects and waits for plugin/core completion. */
async function awaitAgentEndSideEffects(params) {
	await runCoreAgentEndSideEffects(params);
	await awaitAgentHarnessAgentEndHook(params);
}
//#endregion
export { buildHarnessContextEngineRuntimeContext as a, isActiveHarnessContextEngine as c, waitForDeferredTurnMaintenanceForSession as d, buildContextEngineRuntimeSettings as f, bootstrapHarnessContextEngine as i, runHarnessContextEngineMaintenance as l, runAgentEndSideEffects as n, buildHarnessContextEngineRuntimeContextFromUsage as o, assembleHarnessContextEngine as r, finalizeHarnessContextEngineTurn as s, awaitAgentEndSideEffects as t, runContextEngineMaintenance as u };
