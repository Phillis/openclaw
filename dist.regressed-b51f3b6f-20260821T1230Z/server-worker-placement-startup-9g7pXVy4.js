import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { c as redactSensitiveText } from "./redact-Cl7lwBnl.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { c as parseAgentSessionKey } from "./session-key-utils-D8x_bjrd.js";
import { r as getRuntimeConfig } from "./io-CeQckj5v.js";
import { f as isDiagnosticsEnabled, o as emitTrustedDiagnosticEvent } from "./diagnostic-events-Djn4AVRp.js";
import { t as createSubsystemLogger } from "./subsystem-CDLhGl2-.js";
import { _ as isDefaultAgentRuntimeId, y as normalizeOptionalAgentRuntimeId } from "./openai-routing-BGuHAkXI.js";
import { w as resolveDefaultModelForAgent } from "./codex-route-model-ref-0uJOp6W2.js";
import { i as logWarn } from "./logger-DKrZPnAI.js";
import { n as resolveManifestActivationPluginIds } from "./activation-planner-DT7blh-E.js";
import "./config-Dl8DJbzM.js";
import { t as runTasksWithConcurrency } from "./run-with-concurrency-BHgpSCM6.js";
import { b as NODE_WORKER_WORKSPACE_RETAIN_COMMAND } from "./node-commands-DemsbVYQ.js";
import { Qt as loadSessionEntry, gt as normalizeUsage, mt as hasNonzeroUsage, tt as withTranscriptWriteTransaction } from "./session-accessor-Bi6bzKQE.js";
import { h as onSessionIdentityMutation, m as emitSessionLifecycleEvent } from "./session-accessor.sqlite-lifecycle-Cv8qGX3X.js";
import { $ as runExclusiveSessionStoreWrite, K as interruptSessionWorkAdmissions, R as SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS, X as runExclusiveSessionLifecycleMutation } from "./agent-harness-session-key-BMj1lPtX.js";
import { a as WORKER_PROTOCOL_MAX_INFERENCE_PAYLOAD_BYTES, t as WORKER_INFERENCE_MAX_CONTEXT_MESSAGES } from "./worker-inference-DaOiVsCq.js";
import { I as convertToLlm } from "./agent-core-CdSjGubM.js";
import "./messages-NpemKDlI.js";
import { t as SessionManager } from "./session-manager-BPvKNeAi.js";
import { o as resolveEffectiveAgentRuntime } from "./thinking-runtime-B4nRkQcs.js";
import { c as resolvePreparedRunAdmission } from "./admitted-run-context-BxSN0sUe.js";
import { i as resolveSandboxConfigForAgent } from "./config-l_EuSzmS.js";
import { n as resolveSandboxRuntimeStatus } from "./runtime-status-DwfYu5UM.js";
import { n as measureAgentRuntimeIdentityTokenBytes, r as mintAgentRuntimeIdentityToken } from "./agent-runtime-identity-token-DH59bpPs.js";
import { t as resolveConversationCapabilityProfile } from "./conversation-capability-profile-jN4PguVr.js";
import { t as createPreprovisionedSshSandboxBackend } from "./ssh-backend-CEwI-fcE.js";
import { t as createSandboxFsBridge } from "./fs-bridge-TWeIQFlK.js";
import { n as mapThinkingLevelForProvider } from "./utils-CefVZRZM.js";
import { n as projectConversationToolNames } from "./conversation-tool-policy-pipeline-4ugqRa_4.js";
import { t as applyEmbeddedAttemptToolsAllow } from "./attempt-tool-construction-plan-D_uFFO7I.js";
import { C as mergeUsageIntoAccumulator, a as buildUsageAgentMetaFields, x as createUsageAccumulator, y as resolveReportedModelRef } from "./helpers-DqfkNcW1.js";
import { t as clearSessionQueues } from "./cleanup-BqmfwZfX.js";
import { t as isFailedWorkerPlacementEnvironmentGone } from "./session-placement-lifecycle-BZjFQ_8W.js";
import { r as resolveWorkerSshSandboxSettings } from "./ssh-DfcMAYGe.js";
import { t as installSessionPlacementAdmissionProvider } from "./session-placement-admission-CG0soa0B.js";
import { i as projectWorkspaceResultConflict, n as WORKSPACE_CONFLICT_TRANSCRIPT_TYPE, r as formatWorkspaceConflictSummary, t as WORKSPACE_CONFLICT_CLEARED_TRANSCRIPT_TYPE } from "./workspace-conflicts-Vx0i_s3y.js";
import { t as emitAgentRunStatusEvent } from "./agent-run-status-events-CsJwJqrA.js";
import { n as parseNodeWorkerWorkspaceRetainResult } from "./node-workspace-retain-protocol-JcRERe5z.js";
import { i as parseWorkerLaunchPlan } from "./launch-descriptor-CCSAs-Jn.js";
import { n as WORKER_REQUIRED_LOCAL_TOOL_NAMES, r as WORKER_SESSION_TOOL_NAMES } from "./tool-authority-DJXVjqm0.js";
import { o as toWorkerTranscriptMessage, t as WORKER_PROVIDER_REPLAY_LOCAL_RETRY_MESSAGE } from "./transcript-message-DPb4STa5.js";
import { a as recoverWorkerWorkspaceReconciliation } from "./workspace-reconcile-pxprMj1H.js";
import { a as hasWorkerWorkspaceResultRef, c as preparedWorkerWorkspaceResultRef, i as deleteWorkerWorkspaceResultCleanupRefs, l as restoreStagedWorkerWorkspaceResultFromCleanup, n as cleanupWorkerWorkspaceResultRef, o as isWorkerWorkspaceResultCleanupRef, r as deleteStagedWorkerWorkspaceResult, s as moveStagedWorkerWorkspaceResultToCleanup, t as applyStagedWorkerWorkspaceResult, u as workerWorkspaceResultRef } from "./workspace-result-staging-Gr33yVbq.js";
import { n as WorkerTunnelOwnerDisconnectedError, t as WorkerRunnerUnavailableError } from "./tunnel-contract-DuVR-4hZ.js";
import { a as isDeviceWorkerAvailable } from "./device-provider-BH10kl6t.js";
import { i as supportsWorkerExecutionContextLaunch, t as deriveEnvironmentIntent } from "./service-contract-D-KMCo4L.js";
import { t as boundedWorkerError } from "./worker-error-BY3ISuTB.js";
import { r as verifyReconciledWorkspaceFinal, t as WorkerWorkspaceFinalFenceError } from "./workspace-finalize-i1F3pPpk.js";
import { t as ActiveTurnClaimError } from "./placement-turn-claims-CzcxARPk.js";
import { t as windowWorkerReplayMessages } from "./replay-message-window-Bq8t8hQh.js";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
//#region src/gateway/server-worker-placement-session-evidence.ts
const loadPlacementSessionEvidenceRuntime = createLazyRuntimeModule(async () => {
	const [sessionUtils, sessionAccessor] = await Promise.all([import("./session-utils-CYXzmnQF.js"), import("./session-accessor-8W38mURE.js")]);
	return {
		readSessionIdentityEvidence: sessionAccessor.readSessionIdentityEvidence,
		resolveGatewaySessionStoreTarget: sessionUtils.resolveGatewaySessionStoreTarget
	};
});
/** Resolves authoritative session existence without treating unreadable state as absence. */
async function resolveWorkerPlacementSessionEvidence(placement) {
	const runtime = await loadPlacementSessionEvidenceRuntime();
	const target = runtime.resolveGatewaySessionStoreTarget({
		cfg: getRuntimeConfig(),
		key: placement.sessionKey,
		agentId: placement.agentId
	});
	return runtime.readSessionIdentityEvidence({
		agentId: target.agentId,
		sessionId: placement.sessionId,
		sessionKey: target.canonicalKey,
		storePath: target.storePath
	}).status;
}
//#endregion
//#region src/gateway/worker-environments/node-workspace-retain-coordinator.ts
const RETAIN_COMMAND_TIMEOUT_MS = 10 * 6e4;
const TERMINAL_ENVIRONMENT_STATES = /* @__PURE__ */ new Set([
	"destroyed",
	"failed",
	"orphaned"
]);
function environmentDeviceId(environment) {
	const settings = environment.profileSnapshot.settings;
	const deviceId = isRecord(settings) ? settings.device : void 0;
	return typeof deviceId === "string" && deviceId.trim() ? deviceId.trim() : void 0;
}
function snapshotEntriesForNode(options, nodeId) {
	const placements = new Map(options.placements.list().map((placement) => [placement.sessionId, placement]));
	return options.environments.list().flatMap((environment) => {
		if (environment.providerId !== "device" || TERMINAL_ENVIRONMENT_STATES.has(environment.state) || environmentDeviceId(environment) !== nodeId || environment.attachedSessionIds.length !== 1) return [];
		const sessionId = environment.attachedSessionIds[0];
		const placement = placements.get(sessionId);
		const exactManifest = (placement?.state === "starting" || placement?.state === "active" || placement?.state === "draining" || placement?.state === "reconciling") && placement.environmentId === environment.environmentId && placement.workspaceBaseManifestRef && (placement.activeOwnerEpoch === environment.ownerEpoch || placement.state === "starting") ? [placement.workspaceBaseManifestRef] : null;
		return [{
			environmentId: environment.environmentId,
			sessionId,
			generation: environment.ownerEpoch,
			manifestRefs: exactManifest
		}];
	}).toSorted((left, right) => left.environmentId.localeCompare(right.environmentId) || left.sessionId.localeCompare(right.sessionId) || left.generation - right.generation);
}
function createNodeWorkspaceRetainCoordinator(options) {
	const controllerId = randomUUID();
	const abortController = new AbortController();
	const pendingNodes = /* @__PURE__ */ new Set();
	let transport;
	let sequence = 0;
	let pendingAll = false;
	let operation;
	let started = false;
	let stopped = false;
	const publishSnapshot = async (currentTransport, node) => {
		const input = {
			version: 1,
			gatewayNamespace: options.gatewayNamespace,
			controllerId,
			sequence: sequence += 1,
			retain: snapshotEntriesForNode(options, node.nodeId)
		};
		for (;;) {
			const result = await currentTransport.invoke({
				node,
				command: NODE_WORKER_WORKSPACE_RETAIN_COMMAND,
				params: input,
				timeoutMs: RETAIN_COMMAND_TIMEOUT_MS,
				signal: abortController.signal,
				isDispatchAuthorized: () => !stopped && transport === currentTransport
			});
			if (!result.ok) throw new Error(result.error?.message ?? `workspace retain command failed (${result.error?.code ?? "unknown"})`);
			let payload;
			try {
				payload = result.payloadJSON ? JSON.parse(result.payloadJSON) : void 0;
			} catch {
				throw new Error("workspace retain command returned malformed JSON");
			}
			const retained = parseNodeWorkerWorkspaceRetainResult(payload);
			if (!retained) throw new Error("workspace retain command violated its private result contract");
			if (!retained.applied || !retained.hasMore) return;
		}
	};
	const drain = async () => {
		while (pendingAll || pendingNodes.size > 0) {
			if (stopped) return;
			const reconcileAll = pendingAll;
			const requestedNodes = new Set(pendingNodes);
			pendingAll = false;
			pendingNodes.clear();
			const currentTransport = transport;
			if (!currentTransport) continue;
			let currentNodes;
			try {
				currentNodes = await currentTransport.listCurrentNodes();
			} catch (error) {
				options.warn(`Node workspace retain inventory failed: ${error instanceof Error ? error.message : String(error)}`);
				continue;
			}
			const targets = reconcileAll ? currentNodes : currentNodes.filter((node) => requestedNodes.has(node.nodeId));
			await Promise.all(targets.map(async (node) => {
				try {
					await publishSnapshot(currentTransport, node);
				} catch (error) {
					options.warn(`Node workspace retain publication failed (${node.nodeId}): ${error instanceof Error ? error.message : String(error)}`);
				}
			}));
		}
	};
	const schedule = (nodeId) => {
		if (stopped) return Promise.resolve();
		if (nodeId) pendingNodes.add(nodeId);
		else pendingAll = true;
		if (!started) return Promise.resolve();
		if (operation) return operation;
		const tracked = drain().catch((error) => {
			options.warn(`Node workspace retain reconciliation failed: ${error instanceof Error ? error.message : String(error)}`);
		}).finally(() => {
			if (operation !== tracked) return;
			operation = void 0;
			if (!stopped && (pendingAll || pendingNodes.size > 0)) schedule();
		});
		operation = tracked;
		return tracked;
	};
	return {
		bindTransport(next) {
			transport = next;
			if (started) schedule();
		},
		start() {
			started = true;
			return schedule();
		},
		schedule,
		async stop() {
			stopped = true;
			started = false;
			abortController.abort(/* @__PURE__ */ new Error("node workspace retention stopped"));
			pendingAll = false;
			pendingNodes.clear();
			await operation;
		}
	};
}
//#endregion
//#region src/gateway/worker-environments/placement-disk-space.ts
const MIB = 1024 * 1024;
const GIB = 1024 * MIB;
const DISK_SPACE_PROBE_CONCURRENCY = 8;
const DISK_SPACE_PROBE_TIMEOUT_MS = 3e4;
const REMOTE_DISK_SPACE_PROBE_JS = String.raw`
const fs = require("node:fs");
fs.statfs(process.argv[1], { bigint: true }, (error, stats) => {
  if (error) throw error;
  process.stdout.write(JSON.stringify({
    availableBytes: String(stats.bavail * stats.bsize),
    totalBytes: String(stats.blocks * stats.bsize),
  }));
});
`.trim();
function hasExactBinding(observation, placement) {
	return placement?.state === "active" && placement.sessionId === observation.sessionId && placement.generation === observation.generation && placement.environmentId === observation.environmentId && placement.activeOwnerEpoch === observation.activeOwnerEpoch;
}
function parseSafeByteCount(value, field) {
	if (typeof value !== "string" || !/^(?:0|[1-9]\d*)$/u.test(value)) throw new Error(`Worker disk-space probe returned an invalid ${field}`);
	const parsed = BigInt(value);
	if (parsed > BigInt(Number.MAX_SAFE_INTEGER)) throw new Error(`Worker disk-space probe ${field} exceeds the protocol limit`);
	return Number(parsed);
}
function classifyDiskSpace(availableBytes, totalBytes) {
	const available = BigInt(availableBytes);
	const total = BigInt(totalBytes);
	const used = total - available;
	if (availableBytes < 100 * MIB || total > 0n && used * 100n >= total * 98n && availableBytes < GIB) return "critical";
	if (availableBytes < 500 * MIB || total > 0n && used * 100n >= total * 95n && availableBytes < 5 * GIB) return "warning";
	return "ok";
}
function parseDiskSpaceProbe(stdout, observedAtMs) {
	let value;
	try {
		value = JSON.parse(stdout);
	} catch {
		throw new Error("Worker disk-space probe returned invalid JSON");
	}
	if (!isRecord(value)) throw new Error("Worker disk-space probe returned an invalid result");
	const availableBytes = parseSafeByteCount(value.availableBytes, "available byte count");
	const totalBytes = parseSafeByteCount(value.totalBytes, "total byte count");
	if (availableBytes > totalBytes) throw new Error("Worker disk-space probe returned more available bytes than total bytes");
	return {
		status: classifyDiskSpace(availableBytes, totalBytes),
		availableBytes,
		totalBytes,
		observedAtMs
	};
}
function createWorkerPlacementDiskSpaceMonitor(params) {
	const observations = /* @__PURE__ */ new Map();
	const now = params.now ?? Date.now;
	let observationVersion = 0;
	const read = (placement) => {
		const observation = observations.get(placement.sessionId);
		return observation && hasExactBinding(observation, placement) ? observation.snapshot : void 0;
	};
	const probe = async (placement) => {
		const result = await (await params.environments.startTunnel({
			environmentId: placement.environmentId,
			ownerEpoch: placement.activeOwnerEpoch
		})).runWorkspaceCommand({
			transportRetry: "idempotent",
			argv: [
				"node",
				"-e",
				REMOTE_DISK_SPACE_PROBE_JS,
				placement.remoteWorkspaceDir
			],
			timeoutMs: DISK_SPACE_PROBE_TIMEOUT_MS
		});
		if (result.termination !== "exit" || result.code !== 0) throw new Error("Worker disk-space probe command failed");
		const snapshot = parseDiskSpaceProbe(result.stdout, Math.max(0, Math.min(Number.MAX_SAFE_INTEGER, Math.floor(now()))));
		const current = params.placements.get(placement.sessionId);
		const candidate = {
			...placement,
			snapshot
		};
		if (!hasExactBinding(candidate, current)) return;
		const previous = observations.get(placement.sessionId);
		const previousStatus = previous && hasExactBinding(previous, current) ? previous.snapshot.status : void 0;
		const snapshotChanged = !previous || !hasExactBinding(previous, current) || previous.snapshot.status !== snapshot.status || previous.snapshot.availableBytes !== snapshot.availableBytes || previous.snapshot.totalBytes !== snapshot.totalBytes || previous.snapshot.observedAtMs !== snapshot.observedAtMs;
		observations.set(placement.sessionId, candidate);
		if (snapshotChanged) observationVersion += 1;
		if (previousStatus !== snapshot.status && (previousStatus !== void 0 || snapshot.status !== "ok")) emitSessionLifecycleEvent({
			sessionKey: placement.sessionKey,
			agentId: placement.agentId,
			reason: "worker-disk-space"
		});
	};
	const sweep = async () => {
		const active = params.placements.list().filter((placement) => placement.state === "active");
		for (const [sessionId, observation] of observations) if (!hasExactBinding(observation, params.placements.get(sessionId))) observations.delete(sessionId);
		await runTasksWithConcurrency({
			tasks: active.map((placement) => () => probe(placement)),
			limit: DISK_SPACE_PROBE_CONCURRENCY,
			onTaskError: (error, index) => {
				const placement = active[index];
				params.warn(`Worker disk-space probe failed${placement ? ` (${placement.sessionId})` : ""}: ${formatErrorMessage(error)}`);
			}
		});
	};
	return {
		read,
		sweep,
		version: () => observationVersion
	};
}
//#endregion
//#region src/gateway/worker-environments/placement-dispatch-coordinator.ts
/** Serializes reconciliation sweeps against dispatches and deduplicates exact requests. */
function coordinateWorkerPlacementDispatch(service) {
	let activeDispatchCount = 0;
	let reconciliation;
	const dispatchIdleWaiters = /* @__PURE__ */ new Set();
	const waitForDispatchIdle = () => {
		if (activeDispatchCount === 0) return Promise.resolve();
		return new Promise((resolve) => {
			dispatchIdleWaiters.add(resolve);
		});
	};
	const runReconciliation = (operation) => {
		if (reconciliation) return reconciliation;
		const current = (async () => {
			await waitForDispatchIdle();
			await operation();
		})();
		reconciliation = current;
		const clearCurrent = () => {
			if (reconciliation === current) reconciliation = void 0;
		};
		current.then(clearCurrent, clearCurrent);
		return current;
	};
	const runExclusivePlacementOperation = (operation) => {
		const current = (async () => {
			const pendingReconciliation = reconciliation;
			if (pendingReconciliation) await pendingReconciliation.catch(() => void 0);
			await waitForDispatchIdle();
			return await operation();
		})();
		const barrier = current.then(() => void 0, () => void 0);
		reconciliation = barrier;
		return current.finally(() => {
			if (reconciliation === barrier) reconciliation = void 0;
		});
	};
	const runPlacementOperation = async (operation) => {
		for (;;) {
			const pendingReconciliation = reconciliation;
			if (!pendingReconciliation) break;
			await pendingReconciliation.catch(() => void 0);
		}
		activeDispatchCount += 1;
		try {
			return await operation();
		} finally {
			activeDispatchCount -= 1;
			if (activeDispatchCount === 0) {
				const waiters = [...dispatchIdleWaiters];
				dispatchIdleWaiters.clear();
				for (const resolve of waiters) resolve();
			}
		}
	};
	const dispatchInFlight = /* @__PURE__ */ new Map();
	return {
		dispatch: async (request, onTransition) => {
			const inFlight = dispatchInFlight.get(request.sessionId);
			if (inFlight) {
				if (inFlight.request.sessionKey !== request.sessionKey || inFlight.request.agentId !== request.agentId || inFlight.request.profileId !== request.profileId || inFlight.request.deviceId !== request.deviceId || !isDeepStrictEqual(inFlight.request.inheritedProfile, request.inheritedProfile)) throw new Error(`Session ${request.sessionKey} is already dispatching another request`);
				return await inFlight.operation;
			}
			const operation = runPlacementOperation(() => service.dispatch(request, onTransition));
			dispatchInFlight.set(request.sessionId, {
				request,
				operation
			});
			try {
				return await operation;
			} finally {
				if (dispatchInFlight.get(request.sessionId)?.operation === operation) dispatchInFlight.delete(request.sessionId);
			}
		},
		forceDestroyEnvironment: (environmentId, onCleanupError) => runExclusivePlacementOperation(() => service.forceDestroyEnvironment(environmentId, onCleanupError)),
		reclaim: async (request) => await runPlacementOperation(() => service.reclaim(request)),
		reconcile: () => runReconciliation(service.reconcile),
		reconcileActive: (environmentId) => environmentId === void 0 ? runReconciliation(() => service.reconcileActive()) : runExclusivePlacementOperation(() => service.reconcileActive(environmentId))
	};
}
//#endregion
//#region src/gateway/worker-environments/placement-dispatch-failure.ts
const RECOVERY_ERROR_LIMIT = 1024;
const boundedError = boundedWorkerError;
function isUnavailableEnvironment(environment) {
	return environment.state === "draining" || environment.state === "destroying" || environment.state === "destroyed" || environment.state === "failed" || environment.state === "orphaned";
}
function createPlacementFailureActions(deps) {
	const { environments, placements } = deps;
	const updateFailure = (placement, error) => placements.fail({
		sessionId: placement.sessionId,
		expectedGeneration: placement.generation,
		recoveryError: boundedError(error)
	});
	const cleanupEnvironment = async (params) => {
		const teardownErrors = [];
		try {
			await environments.stopTunnel(params.environmentId, params.ownerEpoch ?? void 0);
		} catch (error) {
			teardownErrors.push(`tunnel stop: ${boundedError(error)}`);
		}
		try {
			await environments.destroy(params.environmentId);
		} catch (error) {
			teardownErrors.push(`environment destroy: ${boundedError(error)}`);
		}
		return teardownErrors;
	};
	const teardownEnvironment = async (params) => {
		const environmentId = params.environmentId;
		const teardownErrors = environmentId ? await cleanupEnvironment({
			environmentId,
			ownerEpoch: params.ownerEpoch
		}) : [];
		const recoveryError = [boundedError(params.primaryError), ...teardownErrors].join("; ");
		updateFailure(params.placement, new Error(truncateUtf16Safe(recoveryError, RECOVERY_ERROR_LIMIT)));
	};
	const retryFailedTeardown = async (placement) => {
		if (!placement.environmentId) return;
		const environment = environments.get(placement.environmentId);
		if (!environment || environment.state === "destroyed" || environment.state === "failed" || environment.state === "orphaned") return;
		const teardownErrors = await cleanupEnvironment({
			environmentId: placement.environmentId,
			ownerEpoch: placement.activeOwnerEpoch
		});
		if (teardownErrors.length > 0) {
			const recoveryError = [placement.recoveryError, ...teardownErrors].filter(Boolean).join("; ");
			placements.fail({
				sessionId: placement.sessionId,
				expectedGeneration: placement.generation,
				recoveryError: truncateUtf16Safe(recoveryError, RECOVERY_ERROR_LIMIT)
			});
		}
	};
	const startDrain = (placement) => {
		const draining = placements.startDrain({
			sessionId: placement.sessionId,
			environmentId: placement.environmentId,
			ownerEpoch: placement.activeOwnerEpoch,
			expectedGeneration: placement.generation
		});
		if (draining.state !== "draining") throw new Error("Worker placement drain did not produce a draining placement");
		return draining;
	};
	const startReconcile = (placement) => {
		const reconciling = placements.startReconcile({
			sessionId: placement.sessionId,
			environmentId: placement.environmentId,
			ownerEpoch: placement.activeOwnerEpoch,
			expectedGeneration: placement.generation
		});
		if (reconciling.state !== "reconciling") throw new Error("Worker placement reconcile did not produce a reconciling placement");
		return reconciling;
	};
	const finishReconcilingFailure = (placement, error, teardownErrors) => {
		const recoveryError = [boundedError(error), ...teardownErrors].join("; ");
		updateFailure(placement, new Error(truncateUtf16Safe(recoveryError, RECOVERY_ERROR_LIMIT)));
	};
	const failDraining = async (placement, error, options = {}) => {
		if (placement.turnClaim && !options.forceClaimFence) return;
		const current = placements.get(placement.sessionId);
		if (current?.state !== "draining") return;
		if (current.turnClaim) await placements.closeWorkerTurnToolState({
			sessionId: current.sessionId,
			claimId: current.turnClaim.claimId,
			runId: current.turnClaim.runId,
			placementGeneration: current.turnClaim.generation,
			owner: current.turnClaim.owner === "worker" ? {
				kind: "worker",
				environmentId: current.environmentId,
				ownerEpoch: current.turnClaim.ownerEpoch
			} : {
				kind: "local",
				environmentId: current.environmentId,
				ownerEpoch: current.activeOwnerEpoch
			}
		});
		const reconciling = startReconcile(current);
		const teardownErrors = await cleanupEnvironment({
			environmentId: current.environmentId,
			ownerEpoch: current.activeOwnerEpoch
		});
		finishReconcilingFailure(reconciling, error, teardownErrors);
	};
	const reclaimActive = async (placement, environment, claimedTurnError) => {
		const draining = startDrain(placement);
		if (draining.turnClaim) {
			await failDraining(draining, claimedTurnError, { forceClaimFence: true });
			return;
		}
		const reconciling = startReconcile(draining);
		if (!environment || environment.state === "destroyed" || environment.state === "failed" || environment.state === "orphaned") {
			finishReconcilingFailure(reconciling, claimedTurnError, []);
			return;
		}
		if (environment && !isUnavailableEnvironment(environment)) {
			const teardownErrors = await cleanupEnvironment({
				environmentId: placement.environmentId,
				ownerEpoch: placement.activeOwnerEpoch
			});
			if (teardownErrors.length > 0) {
				finishReconcilingFailure(reconciling, /* @__PURE__ */ new Error(`Worker reclaim teardown failed: ${teardownErrors.join("; ")}`), []);
				return;
			}
		}
		placements.transition({
			sessionId: reconciling.sessionId,
			from: "reconciling",
			to: "reclaimed",
			expectedGeneration: reconciling.generation
		});
	};
	const failActive = async (placement, error, options = {}) => {
		const draining = startDrain(placement);
		await failDraining(draining, error, options);
	};
	return {
		failActive,
		failDraining,
		reclaimActive,
		retryFailedTeardown,
		teardownEnvironment
	};
}
//#endregion
//#region src/gateway/worker-environments/worker-turn-admission.ts
const PREVIOUS_RESULT_RECONCILING_MESSAGE = "The previous cloud turn's workspace result is still reconciling; it retries automatically — try again shortly.";
function required(value, field) {
	const normalized = value?.trim();
	if (!normalized) throw new Error(`Worker turn ${field} is required`);
	return normalized;
}
function latestDurableWorkspaceConflict(entries) {
	for (const entry of entries.toReversed()) {
		if (entry.type !== "custom_message") continue;
		if (entry.customType === "cloud-workspace-conflict-cleared") return;
		if (entry.customType !== "cloud-workspace-conflict") continue;
		const details = entry.details;
		if (!Array.isArray(details?.paths) || details.paths.length === 0 || !details.paths.every((entryPath) => typeof entryPath === "string" && entryPath.length > 0) || typeof details.stagedResultRef !== "string" || details.totalCount !== void 0 && (!Number.isSafeInteger(details.totalCount) || details.totalCount < details.paths.length) || !/^refs\/openclaw\/worker-results\/[A-Za-z0-9-]+$/u.test(details.stagedResultRef)) return;
		return projectWorkspaceResultConflict(details.paths, details.stagedResultRef, details.totalCount);
	}
}
async function waitForTurnOperation(params) {
	const timeout = AbortSignal.timeout(params.timeoutMs);
	const signal = params.signal ? AbortSignal.any([params.signal, timeout]) : timeout;
	const abortError = () => signal.reason instanceof Error ? signal.reason : new Error("Cloud worker operation aborted", { cause: signal.reason });
	if (signal.aborted) throw abortError();
	return await new Promise((resolve, reject) => {
		const onAbort = () => reject(abortError());
		signal.addEventListener("abort", onAbort, { once: true });
		params.operation.then(resolve, reject).finally(() => {
			signal.removeEventListener("abort", onAbort);
		});
	});
}
function resolvePlacementIdentity(claim, placement) {
	return {
		sessionId: claim.sessionId,
		agentId: placement?.agentId ?? required(claim.agentId, "agent id"),
		sessionKey: placement?.sessionKey ?? required(claim.sessionKey, "session key")
	};
}
function requireActivePlacement(placement) {
	if (placement.state !== "active" || !placement.remoteWorkspaceDir || !placement.workerBundleHash) throw new Error(`Worker turn rejected in placement ${placement.state}`);
	return placement;
}
async function releaseClaimIfOwned(placements, turnClaim) {
	if (placements.validateTurnClaim(turnClaim)) {
		if (turnClaim.owner.kind === "worker") await placements.closeWorkerTurnToolState(turnClaim);
		placements.releaseTurn(turnClaim);
	}
}
async function claimWorkerTurn(params) {
	const claim = () => params.placements.claimTurn({
		...params.identity,
		claimId: randomUUID(),
		runId: params.runId,
		owner: {
			kind: "worker",
			environmentId: params.placement.environmentId,
			ownerEpoch: params.placement.activeOwnerEpoch
		}
	});
	try {
		return {
			placement: params.placement,
			turnClaim: claim()
		};
	} catch (error) {
		if (!(error instanceof ActiveTurnClaimError)) throw error;
		const activeClaim = params.placements.get(params.identity.sessionId)?.turnClaim;
		if (activeClaim?.runId === params.runId) throw error;
		if (!params.placements.listPendingWorkspaceResults().some((pending) => activeClaim?.owner === "worker" && pending.sessionId === params.identity.sessionId && pending.claimId === activeClaim.claimId && pending.runId === activeClaim.runId)) {
			const refreshed = params.placements.get(params.identity.sessionId);
			if (refreshed?.state !== "active" || refreshed.environmentId !== params.placement.environmentId || refreshed.activeOwnerEpoch !== params.placement.activeOwnerEpoch || refreshed.turnClaim) throw error;
			return {
				placement: refreshed,
				turnClaim: claim()
			};
		}
	}
	try {
		await params.placements.waitForTurnClaimRelease(params.identity.sessionId, {
			timeoutMs: SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS,
			...params.signal ? { signal: params.signal } : {}
		});
	} catch (error) {
		if (params.signal?.aborted) throw error;
		throw new Error(PREVIOUS_RESULT_RECONCILING_MESSAGE, { cause: error });
	}
	const refreshed = params.placements.get(params.identity.sessionId);
	if (refreshed?.state !== "active" || refreshed.environmentId !== params.placement.environmentId || refreshed.activeOwnerEpoch !== params.placement.activeOwnerEpoch) throw new Error(PREVIOUS_RESULT_RECONCILING_MESSAGE);
	try {
		return {
			placement: refreshed,
			turnClaim: claim()
		};
	} catch (error) {
		if (error instanceof ActiveTurnClaimError) throw new Error(PREVIOUS_RESULT_RECONCILING_MESSAGE, { cause: error });
		throw error;
	}
}
//#endregion
//#region src/gateway/worker-environments/worker-turn-transcript-target.ts
function resolveWorkerTurnTranscriptTarget(turn) {
	if (!turn.sessionTarget?.agentId || !turn.sessionTarget.sessionId || !turn.sessionTarget.sessionKey || !turn.sessionTarget.storePath) throw new Error("Cloud worker turn is missing its transcript identity");
	if (turn.sessionTarget.sessionId !== turn.sessionId) throw new Error("Cloud worker transcript identity does not match the active turn");
	const targetKeyAgentId = parseAgentSessionKey(turn.sessionTarget.sessionKey)?.agentId;
	if (turn.agentId && turn.sessionTarget.agentId !== turn.agentId || turn.sessionKey && turn.sessionTarget.sessionKey !== turn.sessionKey || targetKeyAgentId && targetKeyAgentId !== turn.sessionTarget.agentId) throw new Error("Cloud worker transcript identity does not match the active turn");
	if (loadSessionEntry({
		agentId: turn.sessionTarget.agentId,
		sessionKey: turn.sessionTarget.sessionKey,
		storePath: turn.sessionTarget.storePath
	})?.sessionId !== turn.sessionId) throw new Error("Cloud worker transcript identity is no longer current");
	return {
		agentId: turn.sessionTarget.agentId,
		sessionId: turn.sessionId,
		sessionKey: turn.sessionTarget.sessionKey,
		storePath: turn.sessionTarget.storePath
	};
}
//#endregion
//#region src/gateway/worker-environments/workspace-result-finalize.ts
var WorkerWorkspaceReconciliationError = class extends Error {};
function workspaceError(error) {
	return truncateUtf16Safe(redactSensitiveText(formatErrorMessage(error), { mode: "tools" }).replace(/\s+/gu, " ").trim() || "cloud worker turn failed", 1024);
}
function workspaceJournal(params) {
	const owner = {
		sessionId: params.placement.sessionId,
		environmentId: params.placement.environmentId,
		ownerEpoch: params.placement.activeOwnerEpoch,
		placementGeneration: params.placement.generation
	};
	let manifestAccepted = false;
	return {
		adapter: {
			load: () => params.placements.loadWorkspaceReconciliation(owner),
			begin: (next) => params.placements.beginWorkspaceReconciliation(owner, next),
			commit: (manifestRef) => {
				params.placements.updateWorkspaceBaseManifest({
					claim: params.turnClaim,
					manifestRef
				});
				manifestAccepted = true;
			},
			abort: () => params.placements.abortWorkspaceReconciliation(owner)
		},
		wasAccepted: () => manifestAccepted
	};
}
async function recoverWorkspaceBeforeTurn(params) {
	const journal = workspaceJournal(params).adapter;
	try {
		await params.workspaceOperations.run(params.placement.environmentId, async () => {
			if (!params.placements.validateTurnClaim(params.turnClaim)) throw new Error("Cloud worker workspace recovery lost its turn claim");
			const pending = journal.load();
			if (pending) {
				await recoverWorkerWorkspaceReconciliation({
					root: params.localWorkspaceDir,
					journal: pending
				});
				journal.abort();
			}
		});
	} catch (error) {
		throw new WorkerWorkspaceReconciliationError(`Cloud worker workspace recovery could not complete: ${workspaceError(error)}`, { cause: error });
	}
}
async function reconcileWorkspaceAfterTurn(params) {
	const currentPlacement = params.placements.get(params.placement.sessionId);
	const generationMatches = currentPlacement?.state === "active" ? currentPlacement.generation === params.turnClaim.placementGeneration : currentPlacement?.state === "draining" ? currentPlacement.generation === params.turnClaim.placementGeneration + 1 : false;
	if (currentPlacement?.state !== "active" && currentPlacement?.state !== "draining" || currentPlacement.environmentId !== params.placement.environmentId || currentPlacement.activeOwnerEpoch !== params.placement.activeOwnerEpoch || !generationMatches) throw new Error("Cloud worker placement changed before workspace reconciliation");
	const completed = SessionManager.open(params.transcriptTarget);
	const priorWorkspaceConflict = currentPlacement.workspaceResultConflict ?? latestDurableWorkspaceConflict(completed.getBranch());
	if (!params.placements.listPendingWorkspaceResults().some((pending) => pending.sessionId === params.turnClaim.sessionId && pending.claimId === params.turnClaim.claimId && pending.runId === params.turnClaim.runId)) throw new Error("Cloud worker completed without a durable workspace-result fence");
	const journal = workspaceJournal({
		placement: currentPlacement,
		placements: params.placements,
		turnClaim: params.turnClaim
	});
	let workspaceConflict;
	try {
		await params.workspaceOperations.run(currentPlacement.environmentId, async () => {
			if (!params.placements.validateTurnClaim(params.turnClaim)) throw new Error("Cloud worker workspace result lost its turn claim");
			const quiescence = await params.tunnel.quiesceWorkspace(currentPlacement.remoteWorkspaceDir);
			let resumed = false;
			try {
				const stagedResultRef = workerWorkspaceResultRef(params.turnClaim.claimId);
				const applied = await verifyReconciledWorkspaceFinal(await params.tunnel.reconcileWorkspace({
					localPath: params.localWorkspaceDir,
					remoteWorkspaceDir: currentPlacement.remoteWorkspaceDir,
					baseManifestRef: currentPlacement.workspaceBaseManifestRef,
					journal: journal.adapter,
					stagedResult: {
						ref: stagedResultRef,
						record: (ref) => params.placements.recordStagedWorkspaceResult(params.turnClaim, ref)
					}
				}), quiescence);
				if (!journal.wasAccepted()) throw new Error("Cloud worker workspace reconciliation was not durably accepted");
				params.placements.acceptWorkspaceResult(params.turnClaim);
				const recordedStagedResultRef = params.placements.listPendingWorkspaceResults().find((pending) => pending.sessionId === params.turnClaim.sessionId && pending.claimId === params.turnClaim.claimId && pending.runId === params.turnClaim.runId)?.stagedResultRef;
				if (applied?.conflictPaths.length && !recordedStagedResultRef) throw new Error("Cloud workspace conflict has no staged result reference");
				const finalized = await finalizeWorkspaceResultConflicts({
					placements: params.placements,
					turnClaim: params.turnClaim,
					conflictPaths: applied?.conflictPaths ?? [],
					priorConflict: priorWorkspaceConflict,
					stagedResultRef: recordedStagedResultRef,
					root: params.localWorkspaceDir,
					report: async (report) => {
						if ("cleared" in report) {
							SessionManager.open(params.transcriptTarget).appendCustomMessageEntry(WORKSPACE_CONFLICT_CLEARED_TRANSCRIPT_TYPE, "A later cloud workspace result superseded the previous conflict.", false);
							return;
						}
						workspaceConflict = {
							...report,
							summary: formatWorkspaceConflictSummary(report.paths, report.stagedResultRef, report.totalCount)
						};
						SessionManager.open(params.transcriptTarget).appendCustomMessageEntry(WORKSPACE_CONFLICT_TRANSCRIPT_TYPE, workspaceConflict.summary, true, {
							paths: workspaceConflict.paths,
							stagedResultRef: workspaceConflict.stagedResultRef,
							totalCount: workspaceConflict.totalCount
						});
					}
				});
				await settleStagedWorkspaceResult({
					placements: params.placements,
					turnClaim: params.turnClaim,
					root: params.localWorkspaceDir,
					stagedResultRef: recordedStagedResultRef,
					conflictRetained: finalized.conflictRetained,
					reclaim: false,
					beforeComplete: async () => {
						await quiescence.resume();
						resumed = true;
					}
				});
			} finally {
				if (!resumed) await quiescence.resume();
			}
		});
	} catch (error) {
		throw new WorkerWorkspaceReconciliationError(`Cloud worker finished, but its workspace result could not be reconciled: ${workspaceError(error)}`, { cause: error });
	}
	return workspaceConflict;
}
function appendWorkspaceConflict(result, workspaceConflict) {
	const payloads = result.payloads ? [...result.payloads] : [];
	const textIndex = payloads.findLastIndex((payload) => typeof payload.text === "string");
	if (textIndex === -1) payloads.push({ text: workspaceConflict.summary });
	else {
		const payload = payloads[textIndex];
		payloads[textIndex] = {
			...payload,
			text: payload.text ? `${payload.text}\n\n${workspaceConflict.summary}` : workspaceConflict.summary
		};
	}
	return {
		...result,
		payloads
	};
}
async function executeRemoteExecTurn(params) {
	const environment = params.environments.get(params.placement.environmentId);
	if (!environment || environment.state !== "attached" || environment.ownerEpoch !== params.placement.activeOwnerEpoch || environment.bootstrapReceipt?.bundleHash !== params.placement.workerBundleHash || environment.attachedSessionIds.length !== 1 || environment.attachedSessionIds[0] !== params.placement.sessionId) throw new Error("Active remote-exec placement does not match its attached environment");
	await recoverWorkspaceBeforeTurn(params);
	const tunnel = await waitForTurnOperation({
		operation: params.environments.startTunnel({
			environmentId: params.placement.environmentId,
			ownerEpoch: params.placement.activeOwnerEpoch
		}),
		...params.turn.abortSignal ? { signal: params.turn.abortSignal } : {},
		timeoutMs: params.turn.timeoutMs
	});
	const transcriptTarget = resolveWorkerTurnTranscriptTarget(params.turn);
	params.placements.markWorkspaceResultPending(params.turnClaim);
	params.onHandoff();
	let result;
	let executionError;
	try {
		result = await params.runLocal();
	} catch (error) {
		executionError = error;
	}
	const workspaceConflict = await reconcileWorkspaceAfterTurn({
		placement: params.placement,
		placements: params.placements,
		turnClaim: params.turnClaim,
		workspaceOperations: params.workspaceOperations,
		localWorkspaceDir: params.localWorkspaceDir,
		transcriptTarget,
		tunnel
	});
	if (executionError) throw executionError instanceof Error ? executionError : new Error(formatErrorMessage(executionError));
	if (!result) throw new Error("Remote-exec local harness completed without a result");
	if (!workspaceConflict) return result;
	const resultText = result.payloads?.flatMap((payload) => payload.text ? [payload.text] : []).join("\n\n");
	await Promise.resolve(params.turn.onAgentEvent?.({
		stream: "assistant",
		data: {
			text: resultText ? `${resultText}\n\n${workspaceConflict.summary}` : workspaceConflict.summary,
			delta: `${resultText ? "\n\n" : ""}${workspaceConflict.summary}`
		}
	})).catch(() => void 0);
	return appendWorkspaceConflict(result, workspaceConflict);
}
async function finalizeWorkspaceResultConflicts(params) {
	const retainedPriorConflict = params.retainPriorConflict && params.conflictPaths.length === 0 ? params.priorConflict : void 0;
	const supersededConflict = params.priorConflict && !retainedPriorConflict && (params.conflictPaths.length === 0 || params.priorConflict.stagedResultRef !== params.stagedResultRef) ? params.priorConflict : void 0;
	if (supersededConflict && supersededConflict.stagedResultRef !== params.stagedResultRef) await deleteStagedWorkerWorkspaceResult({
		root: params.root,
		stagedResultRef: supersededConflict.stagedResultRef
	});
	let conflict;
	if (params.conflictPaths.length > 0) {
		if (!params.stagedResultRef) throw new Error("Cloud workspace conflict has no staged result reference");
		conflict = projectWorkspaceResultConflict(params.conflictPaths, params.stagedResultRef);
		params.placements.recordWorkspaceResultConflict(params.turnClaim, conflict);
		await params.report(conflict);
	} else if (retainedPriorConflict) params.placements.recordWorkspaceResultConflict(params.turnClaim, retainedPriorConflict);
	else if (supersededConflict) {
		params.placements.recordWorkspaceResultConflict(params.turnClaim, void 0);
		await params.report({ cleared: true });
	}
	return {
		conflict,
		conflictRetained: conflict !== void 0
	};
}
async function settleStagedWorkspaceResult(params) {
	await params.placements.closeWorkerTurnToolState(params.turnClaim);
	const cleanupRef = params.stagedResultRef && !params.conflictRetained ? isWorkerWorkspaceResultCleanupRef(params.stagedResultRef) ? params.stagedResultRef : await moveStagedWorkerWorkspaceResultToCleanup({
		root: params.root,
		stagedResultRef: params.stagedResultRef
	}) : void 0;
	await params.beforeComplete();
	const completed = params.reclaim ? params.placements.completeWorkspaceResultAndReleaseTurn(params.turnClaim, { reclaim: true }) : params.placements.completeWorkspaceResultAndReleaseTurn(params.turnClaim);
	params.validateCompleted?.(completed);
	await params.afterComplete?.(completed);
	if (cleanupRef) await deleteStagedWorkerWorkspaceResult({
		root: params.root,
		stagedResultRef: cleanupRef
	}).catch(() => void 0);
	return completed;
}
//#endregion
//#region src/gateway/worker-environments/placement-dispatch-pending-results.ts
function sameActiveEnvironment$1(placement, environment) {
	return Boolean(environment && environment.state === "attached" && placement.environmentId && environment.environmentId === placement.environmentId && placement.activeOwnerEpoch !== null && environment.ownerEpoch === placement.activeOwnerEpoch && placement.workerBundleHash && environment.bootstrapReceipt?.bundleHash === placement.workerBundleHash && environment.attachedSessionIds.length === 1 && environment.attachedSessionIds[0] === placement.sessionId);
}
function pendingWorkerLossError(environment, sessionId) {
	if (!environment) return /* @__PURE__ */ new Error("cloud worker disappeared: environment record missing");
	if (environment.state === "destroyed" || environment.state === "failed" || environment.state === "orphaned") return /* @__PURE__ */ new Error(`cloud worker disappeared: ${environment.error ?? `environment state ${environment.state}`}`);
	return /* @__PURE__ */ new Error(`Pending cloud workspace result lost its worker: ${sessionId}`);
}
async function recoverPendingWorkspaceResults(deps, cleanupOrphans, environmentId) {
	const { environments, failure, placements } = deps;
	const stagedResultOwners = /* @__PURE__ */ new Set();
	for (const pending of placements.listPendingWorkspaceResults()) {
		if (pending.stagedResultRef) stagedResultOwners.add(pending.sessionId);
		const sameGatewayInstance = pending.gatewayInstanceId === placements.workspaceResultInstanceId();
		if (sameGatewayInstance && pending.recoveryRequestedAtMs === null) continue;
		const placement = placements.get(pending.sessionId);
		if (environmentId !== void 0 && placement?.environmentId !== environmentId) continue;
		try {
			const claim = placement?.turnClaim;
			if (placement?.state !== "active" && placement?.state !== "draining" || placement.environmentId !== pending.environmentId || placement.activeOwnerEpoch !== pending.ownerEpoch || claim?.owner !== "worker" || claim.claimId !== pending.claimId || claim.runId !== pending.runId || claim.generation !== pending.placementGeneration || claim.ownerEpoch !== pending.ownerEpoch) {
				if (pending.stagedResultRef && pending.workspaceAcceptedAtMs === null) continue;
				if (pending.stagedResultRef) {
					if (!placement) throw new Error(`Staged cloud workspace result lost its placement: ${pending.sessionId}`);
					await deleteStagedWorkerWorkspaceResult({
						root: await deps.resolveWorkspacePath(placement),
						stagedResultRef: pending.stagedResultRef
					});
				}
				if (placement?.state === "active" || placement?.state === "draining") {
					const failed = placements.failWorkspaceResultAndReleaseTurn(pending, /* @__PURE__ */ new Error(`Pending cloud workspace result has no active claim: ${pending.sessionId}`));
					if (failed.state === "failed") await failure.retryFailedTeardown(failed);
				} else placements.abandonWorkspaceResult(pending);
				continue;
			}
			const turnClaim = {
				sessionId: placement.sessionId,
				claimId: claim.claimId,
				runId: claim.runId,
				placementGeneration: claim.generation,
				owner: {
					kind: "worker",
					environmentId: placement.environmentId,
					ownerEpoch: placement.activeOwnerEpoch
				}
			};
			const localPath = await deps.resolveWorkspacePath({
				sessionId: placement.sessionId,
				sessionKey: placement.sessionKey,
				agentId: placement.agentId
			});
			const priorWorkspaceResultConflict = placement.workspaceResultConflict ?? await deps.resolveWorkspaceResultConflict({
				sessionId: placement.sessionId,
				sessionKey: placement.sessionKey,
				agentId: placement.agentId
			});
			const canonicalStagedResultRef = workerWorkspaceResultRef(turnClaim.claimId);
			let stagedResultRef = pending.stagedResultRef;
			if (!stagedResultRef && await hasWorkerWorkspaceResultRef({
				root: localPath,
				stagedResultRef: canonicalStagedResultRef
			})) {
				placements.recordStagedWorkspaceResult(turnClaim, canonicalStagedResultRef);
				stagedResultRef = canonicalStagedResultRef;
				stagedResultOwners.add(pending.sessionId);
			}
			if (stagedResultRef && pending.workspaceAcceptedAtMs !== null) {
				if (!await hasWorkerWorkspaceResultRef({
					root: localPath,
					stagedResultRef
				})) {
					const cleanupRef = cleanupWorkerWorkspaceResultRef(stagedResultRef);
					if (await hasWorkerWorkspaceResultRef({
						root: localPath,
						stagedResultRef: cleanupRef
					})) stagedResultRef = cleanupRef;
				}
			}
			const hasPreparedResult = !stagedResultRef && await hasWorkerWorkspaceResultRef({
				root: localPath,
				stagedResultRef: preparedWorkerWorkspaceResultRef(canonicalStagedResultRef)
			});
			const environment = environments.get(placement.environmentId);
			if (environment?.state === "attached" && environment.attachedSessionIds.includes(placement.sessionId) && environment.attachedSessionIds.length !== 1) continue;
			const stagedResultExists = stagedResultRef ? await hasWorkerWorkspaceResultRef({
				root: localPath,
				stagedResultRef
			}) : false;
			if (stagedResultRef && !stagedResultExists) {
				if (pending.workspaceAcceptedAtMs === null) continue;
				await placements.closeWorkerTurnToolState(turnClaim);
				if (environment && environment.state !== "destroyed" && environment.ownerEpoch === placement.activeOwnerEpoch) await environments.destroy(placement.environmentId);
				if (placements.completeWorkspaceResultAndReleaseTurn(turnClaim, { reclaim: true }).state !== "reclaimed") throw new Error("Recovered cleaned worker result did not reclaim its environment");
				await environments.stopTunnel(placement.environmentId, placement.activeOwnerEpoch).catch(() => void 0);
				continue;
			}
			if (stagedResultRef) {
				let ownedStagedResultRef = stagedResultRef;
				const owner = {
					sessionId: placement.sessionId,
					environmentId: placement.environmentId,
					ownerEpoch: placement.activeOwnerEpoch,
					placementGeneration: placement.generation
				};
				const journal = {
					load: () => placements.loadWorkspaceReconciliation(owner),
					begin: (next) => placements.beginWorkspaceReconciliation(owner, next),
					commit: (manifestRef) => placements.updateWorkspaceBaseManifest({
						claim: turnClaim,
						manifestRef
					}),
					abort: () => placements.abortWorkspaceReconciliation(owner)
				};
				await deps.workspaceOperations.run(placement.environmentId, async () => {
					const owned = placements.get(placement.sessionId);
					const ownedClaim = owned?.turnClaim;
					if (owned?.state !== "active" && owned?.state !== "draining" || owned.generation !== placement.generation || owned.environmentId !== placement.environmentId || owned.activeOwnerEpoch !== placement.activeOwnerEpoch || ownedClaim?.owner !== "worker" || ownedClaim.claimId !== claim.claimId || ownedClaim.runId !== claim.runId) throw new Error("Recovered workspace result lost its placement owner");
					const interrupted = journal.load();
					const alreadyApplied = interrupted?.appliedManifestRef !== void 0;
					if (interrupted && !alreadyApplied) {
						await recoverWorkerWorkspaceReconciliation({
							root: localPath,
							journal: interrupted
						});
						journal.abort();
					}
					const reconciliation = await applyStagedWorkerWorkspaceResult({
						root: localPath,
						stagedResultRef: ownedStagedResultRef,
						expectedBaseManifestRef: placement.workspaceBaseManifestRef,
						alreadyAccepted: pending.workspaceAcceptedAtMs !== null || alreadyApplied,
						journal
					});
					await reconciliation.verifyLocalStable();
					const conflictPaths = reconciliation.conflictPaths;
					if (pending.workspaceAcceptedAtMs === null) placements.acceptWorkspaceResult(turnClaim);
					if (conflictPaths.length > 0 && isWorkerWorkspaceResultCleanupRef(ownedStagedResultRef)) {
						await restoreStagedWorkerWorkspaceResultFromCleanup({
							root: localPath,
							cleanupRef: ownedStagedResultRef,
							stagedResultRef: canonicalStagedResultRef
						});
						ownedStagedResultRef = canonicalStagedResultRef;
					}
					const finalized = await finalizeWorkspaceResultConflicts({
						placements,
						turnClaim,
						conflictPaths,
						priorConflict: priorWorkspaceResultConflict,
						stagedResultRef: ownedStagedResultRef,
						root: localPath,
						report: async (report) => await deps.reportWorkspaceResultConflict({
							sessionId: placement.sessionId,
							sessionKey: placement.sessionKey,
							agentId: placement.agentId,
							...report
						})
					});
					await settleStagedWorkspaceResult({
						placements,
						turnClaim,
						root: localPath,
						stagedResultRef: ownedStagedResultRef,
						conflictRetained: finalized.conflictRetained,
						reclaim: true,
						beforeComplete: async () => {
							const currentEnvironment = environments.get(placement.environmentId);
							if (currentEnvironment && currentEnvironment.state !== "destroyed" && currentEnvironment.ownerEpoch === placement.activeOwnerEpoch) await environments.destroy(placement.environmentId);
						},
						validateCompleted: (completed) => {
							if (completed.state !== "reclaimed") throw new Error("Recovered worker result did not reclaim its stale environment");
						}
					});
					await environments.stopTunnel(placement.environmentId, placement.activeOwnerEpoch).catch(() => void 0);
				});
				continue;
			}
			if (!sameActiveEnvironment$1(placement, environment)) {
				if (hasPreparedResult) continue;
				if (pending.workspaceAcceptedAtMs !== null && environment?.state === "destroyed") {
					await placements.closeWorkerTurnToolState(turnClaim);
					placements.completeWorkspaceResultAndReleaseTurn(turnClaim, { reclaim: true });
					continue;
				}
				await placements.closeWorkerTurnToolState(turnClaim);
				const failed = placements.failWorkspaceResultAndReleaseTurn(pending, pendingWorkerLossError(environment, pending.sessionId));
				if (failed.state === "failed") await failure.retryFailedTeardown(failed);
				continue;
			}
			const owner = {
				sessionId: placement.sessionId,
				environmentId: placement.environmentId,
				ownerEpoch: placement.activeOwnerEpoch,
				placementGeneration: placement.generation
			};
			const journal = {
				load: () => placements.loadWorkspaceReconciliation(owner),
				begin: (next) => placements.beginWorkspaceReconciliation(owner, next),
				commit: (manifestRef) => placements.updateWorkspaceBaseManifest({
					claim: turnClaim,
					manifestRef
				}),
				abort: () => placements.abortWorkspaceReconciliation(owner)
			};
			const tunnel = await environments.startTunnel({
				environmentId: placement.environmentId,
				ownerEpoch: placement.activeOwnerEpoch
			});
			await deps.workspaceOperations.run(placement.environmentId, async () => {
				const owned = placements.get(placement.sessionId);
				const ownedClaim = owned?.turnClaim;
				if (owned?.state !== "active" && owned?.state !== "draining" || owned.generation !== placement.generation || owned.environmentId !== placement.environmentId || owned.activeOwnerEpoch !== placement.activeOwnerEpoch || ownedClaim?.owner !== "worker" || ownedClaim.claimId !== claim.claimId || ownedClaim.runId !== claim.runId) throw new Error("Recovered workspace result lost its placement owner");
				const quiescence = await tunnel.quiesceWorkspace(placement.remoteWorkspaceDir);
				let quiescenceHandled = false;
				try {
					const applied = await verifyReconciledWorkspaceFinal(await tunnel.reconcileWorkspace({
						localPath,
						remoteWorkspaceDir: placement.remoteWorkspaceDir,
						baseManifestRef: placement.workspaceBaseManifestRef,
						journal: { ...journal },
						stagedResult: {
							ref: canonicalStagedResultRef,
							record: (ref) => placements.recordStagedWorkspaceResult(turnClaim, ref)
						}
					}), quiescence);
					placements.acceptWorkspaceResult(turnClaim);
					const recordedStagedResultRef = placements.listPendingWorkspaceResults().find((result) => result.sessionId === turnClaim.sessionId && result.claimId === turnClaim.claimId && result.runId === turnClaim.runId)?.stagedResultRef;
					const conflictPaths = applied?.conflictPaths ?? [];
					if (conflictPaths.length > 0 && !recordedStagedResultRef) throw new Error("Recovered cloud workspace conflict has no staged result reference");
					const finalized = await finalizeWorkspaceResultConflicts({
						placements,
						turnClaim,
						conflictPaths,
						priorConflict: priorWorkspaceResultConflict,
						stagedResultRef: recordedStagedResultRef,
						root: localPath,
						report: async (report) => await deps.reportWorkspaceResultConflict({
							sessionId: placement.sessionId,
							sessionKey: placement.sessionKey,
							agentId: placement.agentId,
							...report
						})
					});
					await settleStagedWorkspaceResult({
						placements,
						turnClaim,
						root: localPath,
						stagedResultRef: recordedStagedResultRef,
						conflictRetained: finalized.conflictRetained,
						reclaim: !sameGatewayInstance,
						beforeComplete: async () => {
							if (sameGatewayInstance) await quiescence.resume();
							else await environments.destroy(placement.environmentId);
							quiescenceHandled = true;
						},
						validateCompleted: (completed) => {
							if (!sameGatewayInstance && completed.state !== "reclaimed") throw new Error("Recovered worker result did not reclaim its stale environment");
						},
						afterComplete: async () => {
							if (!sameGatewayInstance) await environments.stopTunnel(placement.environmentId, placement.activeOwnerEpoch).catch(() => void 0);
						}
					});
				} finally {
					if (!quiescenceHandled) await quiescence.resume();
				}
			});
		} catch {}
	}
	if (cleanupOrphans) {
		const retainedCleanupRefs = new Set(placements.listPendingWorkspaceResults().flatMap((pending) => pending.stagedResultRef ? [cleanupWorkerWorkspaceResultRef(pending.stagedResultRef)] : []));
		const cleanedWorkspaceRoots = /* @__PURE__ */ new Set();
		for (const placement of placements.list()) try {
			const root = await deps.resolveWorkspacePath(placement);
			if (!cleanedWorkspaceRoots.has(root)) {
				cleanedWorkspaceRoots.add(root);
				await deleteWorkerWorkspaceResultCleanupRefs({
					root,
					retainedRefs: retainedCleanupRefs
				});
			}
		} catch {}
	}
	return /* @__PURE__ */ new Set([...stagedResultOwners, ...placements.listPendingWorkspaceResults().map((pending) => pending.sessionId)]);
}
//#endregion
//#region src/gateway/worker-environments/placement-dispatch-recovery.ts
function supportsCurrentWorkerLaunch(environment) {
	return supportsWorkerExecutionContextLaunch(environment?.bootstrapReceipt);
}
function sameActiveEnvironment(placement, environment) {
	return Boolean(environment && environment.state === "attached" && placement.environmentId && environment.environmentId === placement.environmentId && placement.activeOwnerEpoch !== null && environment.ownerEpoch === placement.activeOwnerEpoch && placement.workerBundleHash && environment.bootstrapReceipt?.bundleHash === placement.workerBundleHash && supportsCurrentWorkerLaunch(environment) && environment.attachedSessionIds.length === 1 && environment.attachedSessionIds[0] === placement.sessionId);
}
function isStartingPlacement(placement) {
	return placement.state === "starting";
}
function isFailedPlacement(placement) {
	return placement.state === "failed";
}
function workerDisappearanceError(environment) {
	if (!environment) return /* @__PURE__ */ new Error("cloud worker disappeared: environment record missing");
	if (environment.state !== "destroyed" && environment.state !== "failed" && environment.state !== "orphaned") return;
	return /* @__PURE__ */ new Error(`cloud worker disappeared: ${environment.error ?? `environment state ${environment.state}`}`);
}
function blockingWorkspaceJournalSessions(placements) {
	const sessions = /* @__PURE__ */ new Set();
	for (const owner of placements.listWorkspaceReconciliationOwners()) {
		const placement = placements.get(owner.sessionId);
		if ((placement?.state === "active" || placement?.state === "draining") && placement.environmentId === owner.environmentId && placement.activeOwnerEpoch === owner.ownerEpoch && placement.generation === owner.placementGeneration) sessions.add(owner.sessionId);
	}
	return sessions;
}
function createPlacementRecoveryActions(deps) {
	const { environments, failure, placements } = deps;
	const adoptActive = async (placement) => {
		if (placement.turnClaim) {
			const error = /* @__PURE__ */ new Error("Active worker turn claim cannot be proven live after gateway restart");
			await failure.failActive(placement, error, { forceClaimFence: true });
			return;
		}
		const environment = placement.environmentId ? environments.get(placement.environmentId) : void 0;
		const disappearance = workerDisappearanceError(environment);
		if (disappearance || environment && isUnavailableEnvironment(environment)) {
			await failure.reclaimActive(placement, environment, disappearance ?? /* @__PURE__ */ new Error(`Active worker environment is ${environment?.state}`));
			return;
		}
		if (!environment || !sameActiveEnvironment(placement, environment)) {
			await failure.reclaimActive(placement, environment, /* @__PURE__ */ new Error("Active worker placement does not match its environment owner"));
			return;
		}
		try {
			if (environment.providerId !== "device") await environments.startTunnel({
				environmentId: environment.environmentId,
				ownerEpoch: environment.ownerEpoch
			});
			placements.adoptActive({
				sessionId: placement.sessionId,
				expectedGeneration: placement.generation,
				environmentId: environment.environmentId,
				ownerEpoch: environment.ownerEpoch
			});
		} catch (error) {
			await failure.failActive(placement, error);
		}
	};
	const resumeStarting = async (placement) => {
		const environment = placement.environmentId ? environments.get(placement.environmentId) : void 0;
		const expectedBundle = placement.workerBundleHash;
		const hasSyncedWorkspace = Boolean(placement.workspaceBaseManifestRef && placement.remoteWorkspaceDir);
		if (!(environment && expectedBundle && environment.bootstrapReceipt?.bundleHash === expectedBundle && supportsCurrentWorkerLaunch(environment) && hasSyncedWorkspace)) {
			const error = /* @__PURE__ */ new Error("Interrupted worker dispatch cannot safely resume");
			await failure.teardownEnvironment({
				placement,
				environmentId: placement.environmentId,
				ownerEpoch: environment?.ownerEpoch ?? null,
				primaryError: error
			});
			return;
		}
		try {
			const ownerEpoch = environment.state === "attached" && environment.attachedSessionIds.length === 1 && environment.attachedSessionIds[0] === placement.sessionId ? environment.ownerEpoch : environment.state === "ready" || environment.state === "idle" ? (await environments.attachSession({
				environmentId: environment.environmentId,
				ownerEpoch: environment.ownerEpoch,
				sessionId: placement.sessionId
			})).ownerEpoch : void 0;
			if (ownerEpoch === void 0) throw new Error(`Worker environment cannot resume dispatch from ${environment.state}`);
			await environments.startTunnel({
				environmentId: environment.environmentId,
				ownerEpoch
			});
			await deps.runActivationBarrier({
				sessionId: placement.sessionId,
				sessionKey: placement.sessionKey,
				agentId: placement.agentId,
				executionMode: placement.executionMode,
				activate: () => {
					const activated = placements.transition({
						sessionId: placement.sessionId,
						from: "starting",
						to: "active",
						expectedGeneration: placement.generation,
						patch: { activeOwnerEpoch: ownerEpoch }
					});
					if (activated.state !== "active") throw new Error("Worker dispatch activation did not produce an active placement");
					return activated;
				}
			});
		} catch (error) {
			await failure.teardownEnvironment({
				placement,
				environmentId: environment.environmentId,
				ownerEpoch: environment.ownerEpoch,
				primaryError: error
			});
		}
	};
	const reconcile = async () => {
		await environments.reconcileOnce();
		const pendingResultOwners = await recoverPendingWorkspaceResults(deps, true);
		const journalOwners = blockingWorkspaceJournalSessions(placements);
		for (const placement of placements.listForReconcile()) {
			if (journalOwners.has(placement.sessionId) || pendingResultOwners.has(placement.sessionId)) continue;
			if (placement.state === "local" || placement.state === "reclaimed") continue;
			if (placement.state === "active") {
				await adoptActive(placement);
				continue;
			}
			if (isFailedPlacement(placement)) {
				await failure.retryFailedTeardown(placement);
				continue;
			}
			if (isStartingPlacement(placement)) {
				await resumeStarting(placement);
				continue;
			}
			const error = /* @__PURE__ */ new Error(`Worker dispatch interrupted in ${placement.state}`);
			if (placement.state === "draining") {
				await failure.failDraining(placement, error, { forceClaimFence: true });
				continue;
			}
			await failure.teardownEnvironment({
				placement,
				environmentId: placement.environmentId,
				ownerEpoch: placement.activeOwnerEpoch,
				primaryError: error
			});
		}
	};
	const reconcileActive = async (environmentId) => {
		await environments.reconcileOnce();
		const pendingResultOwners = await recoverPendingWorkspaceResults(deps, false, environmentId);
		const journalOwners = blockingWorkspaceJournalSessions(placements);
		for (const placement of placements.listForReconcile()) {
			if (journalOwners.has(placement.sessionId) || pendingResultOwners.has(placement.sessionId)) continue;
			if (environmentId !== void 0 && placement.environmentId !== environmentId) continue;
			if (isFailedPlacement(placement)) {
				await failure.retryFailedTeardown(placement);
				continue;
			}
			if (placement.state !== "active") continue;
			const environment = environments.get(placement.environmentId);
			const disappearance = workerDisappearanceError(environment);
			if (disappearance || environment && isUnavailableEnvironment(environment)) {
				await failure.reclaimActive(placement, environment, disappearance ?? /* @__PURE__ */ new Error(`Active worker environment is ${environment?.state}`));
				continue;
			}
			if (!sameActiveEnvironment(placement, environment)) await failure.reclaimActive(placement, environment, /* @__PURE__ */ new Error("Active worker placement does not match its environment owner"));
		}
	};
	return {
		reconcile,
		reconcileActive
	};
}
//#endregion
//#region src/gateway/worker-environments/placement-force-abandon.ts
const FORCED_WORKER_ABANDONMENT_ERROR = "Cloud worker result abandoned by forced operator teardown";
async function tryResolveWorkspacePath(resolveWorkspacePath, placement, onCleanupError) {
	try {
		return await resolveWorkspacePath(placement);
	} catch (error) {
		reportCleanupError(onCleanupError, error);
		return;
	}
}
function reportCleanupError(onCleanupError, error) {
	try {
		onCleanupError?.(error);
	} catch {}
}
async function forceAbandonWorkerEnvironment(params) {
	const { environmentId, placements } = params;
	const recoveryError = FORCED_WORKER_ABANDONMENT_ERROR;
	const journalOwners = params.placements.listWorkspaceReconciliationOwners().filter((owner) => owner.environmentId === environmentId);
	const journalCleanups = [];
	const retainedJournalSessions = /* @__PURE__ */ new Set();
	for (const owner of journalOwners) {
		const placement = placements.get(owner.sessionId);
		const isCurrentOwner = (placement?.state === "active" || placement?.state === "draining") && placement.generation === owner.placementGeneration;
		const isForceFailedOwner = placement?.state === "failed" && placement.recoveryError.startsWith(recoveryError) && placement.generation > owner.placementGeneration;
		if (placement && (isCurrentOwner || isForceFailedOwner) && placement.environmentId === owner.environmentId && placement.activeOwnerEpoch === owner.ownerEpoch) try {
			const journal = placements.loadWorkspaceReconciliation(owner, isForceFailedOwner ? { allowFailedOwner: true } : void 0);
			if (journal) journalCleanups.push({
				owner,
				placement,
				journal
			});
		} catch (error) {
			reportCleanupError(params.onCleanupError, error);
			retainedJournalSessions.add(owner.sessionId);
		}
	}
	const stagedResultCleanups = [];
	for (const pending of placements.listPendingWorkspaceResults()) if (pending.environmentId === environmentId) {
		const placement = placements.get(pending.sessionId);
		if ((placement?.state === "active" || placement?.state === "draining") && placement.environmentId === pending.environmentId && placement.activeOwnerEpoch === pending.ownerEpoch && placement.generation === (placement.state === "active" ? pending.placementGeneration : pending.placementGeneration + 1)) {
			const finalRef = pending.stagedResultRef ?? workerWorkspaceResultRef(pending.claimId);
			stagedResultCleanups.push({
				placement,
				refs: [finalRef, preparedWorkerWorkspaceResultRef(finalRef)]
			});
			const claim = placement.turnClaim;
			if (claim?.owner === "worker" && claim.claimId === pending.claimId && claim.runId === pending.runId) await placements.closeWorkerTurnToolState({
				sessionId: placement.sessionId,
				claimId: claim.claimId,
				runId: claim.runId,
				placementGeneration: claim.generation,
				owner: {
					kind: "worker",
					environmentId: placement.environmentId,
					ownerEpoch: claim.ownerEpoch
				}
			});
			placements.failWorkspaceResultAndReleaseTurn(pending, recoveryError);
		} else placements.abandonWorkspaceResult(pending);
	}
	for (const placement of placements.listForReconcile()) {
		if (placement.environmentId !== environmentId) continue;
		let current = placements.get(placement.sessionId);
		if (current?.state === "active") current = placements.startDrain({
			sessionId: current.sessionId,
			environmentId: current.environmentId,
			ownerEpoch: current.activeOwnerEpoch,
			expectedGeneration: current.generation
		});
		if (current?.state === "draining") {
			if (current.turnClaim) await placements.closeWorkerTurnToolState({
				sessionId: current.sessionId,
				claimId: current.turnClaim.claimId,
				runId: current.turnClaim.runId,
				placementGeneration: current.turnClaim.generation,
				owner: current.turnClaim.owner === "worker" ? {
					kind: "worker",
					environmentId: current.environmentId,
					ownerEpoch: current.turnClaim.ownerEpoch
				} : {
					kind: "local",
					environmentId: current.environmentId,
					ownerEpoch: current.activeOwnerEpoch
				}
			});
			current = placements.startReconcile({
				sessionId: current.sessionId,
				environmentId: current.environmentId,
				ownerEpoch: current.activeOwnerEpoch,
				expectedGeneration: current.generation
			});
		}
		if (current && current.state !== "failed") placements.fail({
			sessionId: current.sessionId,
			expectedGeneration: current.generation,
			recoveryError
		});
	}
	for (const cleanup of journalCleanups) {
		if (cleanup.journal.appliedManifestRef) continue;
		try {
			await recoverWorkerWorkspaceReconciliation({
				root: await params.resolveWorkspacePath(cleanup.placement),
				journal: cleanup.journal
			});
		} catch (error) {
			reportCleanupError(params.onCleanupError, error);
			retainedJournalSessions.add(cleanup.owner.sessionId);
		}
	}
	for (const owner of journalOwners) {
		if (retainedJournalSessions.has(owner.sessionId)) continue;
		placements.abortWorkspaceReconciliation(owner, { force: true });
	}
	for (const cleanup of stagedResultCleanups) try {
		const root = await tryResolveWorkspacePath(params.resolveWorkspacePath, cleanup.placement, params.onCleanupError);
		if (!root) continue;
		for (const stagedResultRef of cleanup.refs) if (await hasWorkerWorkspaceResultRef({
			root,
			stagedResultRef
		})) await deleteStagedWorkerWorkspaceResult({
			root,
			stagedResultRef
		});
	} catch (error) {
		reportCleanupError(params.onCleanupError, error);
	}
}
//#endregion
//#region src/gateway/worker-environments/placement-dispatch.ts
function requireProvisionedEnvironment(environment, expectedEnvironmentId) {
	if (environment.state !== "ready" && environment.state !== "idle" || environment.environmentId !== expectedEnvironmentId) throw new Error(`Worker environment is not dispatchable with the current execution-context contract: ${environment.state}`);
	if (environment.providerId === "device" && !environment.sshEndpoint && environment.bootstrapReceipt?.installKind === "local" && supportsWorkerExecutionContextLaunch(environment.bootstrapReceipt)) return {
		transport: "node",
		environmentId: environment.environmentId,
		ownerEpoch: environment.ownerEpoch,
		bundleHash: environment.bootstrapReceipt.bundleHash
	};
	if (!environment.bootstrapReceipt || !supportsWorkerExecutionContextLaunch(environment.bootstrapReceipt)) throw new Error(`Worker environment is not dispatchable with the current execution-context contract: ${environment.state}`);
	return {
		transport: "ssh",
		environmentId: environment.environmentId,
		ownerEpoch: environment.ownerEpoch,
		bundleHash: environment.bootstrapReceipt.bundleHash
	};
}
function isExactAttachedEnvironment(environment, placement) {
	return environment?.environmentId === placement.environmentId && environment.state === "attached" && environment.ownerEpoch === placement.activeOwnerEpoch && environment.attachedSessionIds.length === 1 && environment.attachedSessionIds[0] === placement.sessionId;
}
function createWorkerPlacementDispatchService(options) {
	const { environments, placements } = options;
	const failure = createPlacementFailureActions({
		environments,
		placements
	});
	const recovery = createPlacementRecoveryActions({
		environments,
		failure,
		placements,
		runActivationBarrier: options.runActivationBarrier,
		resolveWorkspacePath: options.resolveWorkspacePath,
		reportWorkspaceResultConflict: options.reportWorkspaceResultConflict,
		resolveWorkspaceResultConflict: options.resolveWorkspaceResultConflict,
		workspaceOperations: options.workspaceOperations
	});
	const reportTransition = (observer, placement) => {
		try {
			observer?.(placement);
		} catch {}
	};
	const dispatch = async (request, onTransition) => {
		let placement;
		let environmentId = null;
		let ownerEpoch = null;
		try {
			placement = await options.runLocalBarrier({
				sessionId: request.sessionId,
				sessionKey: request.sessionKey,
				agentId: request.agentId,
				executionMode: request.executionMode,
				startDispatch: () => {
					placement = placements.startDispatch({
						sessionId: request.sessionId,
						sessionKey: request.sessionKey,
						agentId: request.agentId,
						executionMode: request.executionMode
					});
					reportTransition(onTransition, placement);
					return placement;
				}
			});
			if (request.deviceId && !await isDeviceWorkerAvailable(environments, request.deviceId)) throw new Error(`device worker requires a connected current node host; reconnect or reprovision: ${request.deviceId}`);
			const localPath = await options.resolveWorkspacePath(request);
			const idempotencyKey = `session-dispatch:${request.sessionId}:${placement.generation}`;
			const expectedEnvironmentId = deriveEnvironmentIntent(idempotencyKey).environmentId;
			placement = placements.transition({
				sessionId: request.sessionId,
				from: "requested",
				to: "provisioning",
				expectedGeneration: placement.generation,
				patch: { environmentId: expectedEnvironmentId }
			});
			reportTransition(onTransition, placement);
			const provisioned = requireProvisionedEnvironment(request.inheritedProfile ? await environments.createFromProfileSnapshot({
				profileId: request.profileId,
				providerId: request.inheritedProfile.providerId,
				profileSnapshot: request.inheritedProfile.profileSnapshot
			}, idempotencyKey) : await environments.create(request.profileId, idempotencyKey), expectedEnvironmentId);
			environmentId = provisioned.environmentId;
			ownerEpoch = provisioned.ownerEpoch;
			placement = placements.transition({
				sessionId: request.sessionId,
				from: "provisioning",
				to: "syncing",
				expectedGeneration: placement.generation,
				patch: {
					environmentId,
					workerBundleHash: provisioned.bundleHash
				}
			});
			reportTransition(onTransition, placement);
			ownerEpoch = (await environments.attachSession({
				environmentId,
				ownerEpoch,
				sessionId: request.sessionId
			})).ownerEpoch;
			const synced = await (await environments.startTunnel({
				environmentId,
				ownerEpoch
			})).syncWorkspace({
				localPath,
				sessionId: request.sessionId,
				generation: placement.generation
			});
			placement = placements.transition({
				sessionId: request.sessionId,
				from: "syncing",
				to: "starting",
				expectedGeneration: placement.generation,
				patch: {
					workspaceBaseManifestRef: synced.manifestRef,
					remoteWorkspaceDir: synced.remoteWorkspaceDir
				}
			});
			reportTransition(onTransition, placement);
			const startingPlacement = placement;
			return await options.runActivationBarrier({
				sessionId: request.sessionId,
				sessionKey: request.sessionKey,
				agentId: request.agentId,
				executionMode: request.executionMode,
				activate: () => {
					const activated = placements.transition({
						sessionId: request.sessionId,
						from: "starting",
						to: "active",
						expectedGeneration: startingPlacement.generation,
						patch: { activeOwnerEpoch: ownerEpoch }
					});
					if (activated.state !== "active") throw new Error("Worker dispatch activation did not produce an active placement");
					reportTransition(onTransition, activated);
					return activated;
				}
			});
		} catch (error) {
			try {
				const current = placement ? placements.get(request.sessionId) : void 0;
				if (current && current.state !== "local" && current.state !== "reclaimed") if (current.state === "active") await failure.failActive(current, error);
				else {
					const currentEnvironmentId = environmentId ?? current.environmentId;
					const currentEnvironment = currentEnvironmentId ? environments.get(currentEnvironmentId) : void 0;
					await failure.teardownEnvironment({
						placement: current,
						environmentId: currentEnvironment?.environmentId ?? null,
						ownerEpoch: ownerEpoch ?? currentEnvironment?.ownerEpoch ?? null,
						primaryError: error
					});
				}
			} finally {
				const finalPlacement = placements.get(request.sessionId);
				if (finalPlacement) reportTransition(onTransition, finalPlacement);
			}
			throw error;
		}
	};
	const reclaimOnce = async (request) => await options.runReclaimBarrier({
		...request,
		reclaim: async (localPath) => {
			const current = placements.get(request.sessionId);
			if (current?.state !== "active" || current.turnClaim) throw new Error(`Session ${request.sessionKey} cannot stop cloud worker from placement ${current?.state ?? "missing"}`);
			if (!isExactAttachedEnvironment(environments.get(current.environmentId), current)) throw new Error("Active cloud worker does not match its session placement");
			const journalOwner = {
				sessionId: current.sessionId,
				environmentId: current.environmentId,
				ownerEpoch: current.activeOwnerEpoch,
				placementGeneration: current.generation
			};
			const reclaimClaimId = `reclaim-${randomUUID()}`;
			const reclaimClaim = placements.claimReclaimWorkspaceResult({
				sessionId: current.sessionId,
				sessionKey: current.sessionKey,
				agentId: current.agentId,
				claimId: reclaimClaimId,
				runId: reclaimClaimId,
				owner: current.executionMode === "remote-exec" ? {
					kind: "local",
					environmentId: current.environmentId,
					ownerEpoch: current.activeOwnerEpoch
				} : {
					kind: "worker",
					environmentId: current.environmentId,
					ownerEpoch: current.activeOwnerEpoch
				}
			});
			const reclaimResultRef = workerWorkspaceResultRef(reclaimClaim.claimId);
			let manifestAccepted = false;
			const journal = {
				load: () => placements.loadWorkspaceReconciliation(journalOwner),
				begin: (next) => placements.beginWorkspaceReconciliation(journalOwner, next),
				commit: (manifestRef) => {
					placements.updateWorkspaceBaseManifest({
						claim: reclaimClaim,
						manifestRef
					});
					manifestAccepted = true;
				},
				abort: () => placements.abortWorkspaceReconciliation(journalOwner)
			};
			const cancelUnstagedFailedReclaim = async (allowCommitted) => {
				await options.workspaceOperations.run(current.environmentId, async () => {
					const stillOwnsEmptyResult = () => {
						const owned = placements.get(current.sessionId);
						const currentEnvironment = environments.get(current.environmentId);
						const pendingResult = placements.listPendingWorkspaceResults().find((pending) => pending.sessionId === reclaimClaim.sessionId && pending.claimId === reclaimClaim.claimId && pending.runId === reclaimClaim.runId);
						return (allowCommitted || !manifestAccepted) && owned?.state === "active" && owned.turnClaim?.claimId === reclaimClaim.claimId && reclaimClaim.owner.environmentId === current.environmentId && reclaimClaim.owner.ownerEpoch === current.activeOwnerEpoch && currentEnvironment?.state === "attached" && currentEnvironment.ownerEpoch === reclaimClaim.owner.ownerEpoch && currentEnvironment.attachedSessionIds.length === 1 && currentEnvironment.attachedSessionIds[0] === owned.sessionId && pendingResult?.workspaceAcceptedAtMs === null && pendingResult.stagedResultRef === null;
					};
					if (!stillOwnsEmptyResult()) return;
					const [canonicalExists, preparedExists] = await Promise.all([hasWorkerWorkspaceResultRef({
						root: localPath,
						stagedResultRef: reclaimResultRef
					}), hasWorkerWorkspaceResultRef({
						root: localPath,
						stagedResultRef: preparedWorkerWorkspaceResultRef(reclaimResultRef)
					})]);
					if (!canonicalExists && !preparedExists && stillOwnsEmptyResult()) {
						await placements.closeWorkerTurnToolState(reclaimClaim);
						placements.cancelWorkspaceResultAndReleaseTurn(reclaimClaim);
					}
				});
			};
			const finishReclaim = async () => {
				const pending = journal.load();
				if (pending) {
					await recoverWorkerWorkspaceReconciliation({
						root: localPath,
						journal: pending
					});
					journal.abort();
				}
				const tunnel = await environments.startTunnel({
					environmentId: current.environmentId,
					ownerEpoch: current.activeOwnerEpoch
				});
				const reclaimed = await options.workspaceOperations.run(current.environmentId, async () => {
					const owned = placements.get(current.sessionId);
					if (owned?.state !== "active" || owned.generation !== current.generation || owned.environmentId !== current.environmentId || owned.activeOwnerEpoch !== current.activeOwnerEpoch || owned.turnClaim?.claimId !== reclaimClaim.claimId) throw new Error("Cloud worker stop lost its placement owner before reconciliation");
					const quiescence = await tunnel.quiesceWorkspace(current.remoteWorkspaceDir);
					let destroyed = false;
					try {
						const reconciliation = await tunnel.reconcileWorkspace({
							localPath,
							remoteWorkspaceDir: current.remoteWorkspaceDir,
							baseManifestRef: current.workspaceBaseManifestRef,
							journal,
							stagedResult: {
								ref: reclaimResultRef,
								record: (ref) => placements.recordStagedWorkspaceResult(reclaimClaim, ref)
							}
						});
						const applied = await verifyReconciledWorkspaceFinal(reconciliation, quiescence);
						if (reconciliation.changed && !manifestAccepted) throw new Error("Cloud worker stop did not commit its reconciled workspace");
						placements.acceptWorkspaceResult(reclaimClaim);
						const recordedStagedResultRef = placements.listPendingWorkspaceResults().find((result) => result.sessionId === reclaimClaim.sessionId && result.claimId === reclaimClaim.claimId && result.runId === reclaimClaim.runId)?.stagedResultRef;
						const conflictPaths = applied?.conflictPaths ?? [];
						if (conflictPaths.length > 0 && !recordedStagedResultRef) throw new Error("Cloud worker stop conflict has no staged result reference");
						const priorWorkspaceResultConflict = current.workspaceResultConflict ?? await options.resolveWorkspaceResultConflict({
							sessionId: current.sessionId,
							sessionKey: current.sessionKey,
							agentId: current.agentId
						});
						const finalized = await finalizeWorkspaceResultConflicts({
							placements,
							turnClaim: reclaimClaim,
							conflictPaths,
							priorConflict: priorWorkspaceResultConflict,
							stagedResultRef: recordedStagedResultRef,
							retainPriorConflict: !reconciliation.changed,
							root: localPath,
							report: async (report) => await options.reportWorkspaceResultConflict({
								sessionId: current.sessionId,
								sessionKey: current.sessionKey,
								agentId: current.agentId,
								...report
							})
						});
						return await settleStagedWorkspaceResult({
							placements,
							turnClaim: reclaimClaim,
							root: localPath,
							stagedResultRef: recordedStagedResultRef,
							conflictRetained: finalized.conflictRetained,
							reclaim: true,
							beforeComplete: async () => {
								await environments.destroy(current.environmentId);
								destroyed = true;
							},
							validateCompleted: (completed) => {
								if (completed.state !== "reclaimed") throw new Error("Cloud worker stop did not produce a reclaimed placement");
							}
						});
					} finally {
						if (!destroyed && isExactAttachedEnvironment(environments.get(current.environmentId), current)) await quiescence.resume();
					}
				});
				try {
					await environments.stopTunnel(current.environmentId, current.activeOwnerEpoch);
				} catch {}
				return reclaimed;
			};
			try {
				return await finishReclaim();
			} catch (error) {
				await cancelUnstagedFailedReclaim(error instanceof WorkerWorkspaceFinalFenceError && error.reclaimDisposition === "retry").catch(() => void 0);
				throw error;
			}
		}
	});
	const reclaimInFlight = /* @__PURE__ */ new Map();
	const reclaim = async (request) => {
		const current = placements.get(request.sessionId);
		if (current?.state === "reclaimed") return current;
		const inFlight = reclaimInFlight.get(request.sessionId);
		if (inFlight) return await inFlight;
		const operation = (async () => {
			const owned = placements.get(request.sessionId);
			if (owned?.state === "failed") {
				if (!isFailedWorkerPlacementEnvironmentGone({
					environmentService: environments,
					placement: owned
				})) throw new Error("Failed cloud worker environment must be stopped before reclaim");
				const local = placements.transition({
					sessionId: request.sessionId,
					from: "failed",
					to: "local",
					expectedGeneration: owned.generation
				});
				if (local.state !== "local") throw new Error("Failed cloud worker reclaim did not produce a local placement");
				return local;
			}
			return await reclaimOnce(request);
		})().catch((error) => {
			const completed = placements.get(request.sessionId);
			if (error instanceof WorkerTunnelOwnerDisconnectedError && completed?.state === "reclaimed") return completed;
			throw error;
		});
		reclaimInFlight.set(request.sessionId, operation);
		try {
			return await operation;
		} finally {
			if (reclaimInFlight.get(request.sessionId) === operation) reclaimInFlight.delete(request.sessionId);
		}
	};
	return {
		dispatch,
		forceDestroyEnvironment: (environmentId, onCleanupError) => options.workspaceOperations.run(environmentId, async () => {
			await forceAbandonWorkerEnvironment({
				placements,
				environmentId,
				resolveWorkspacePath: options.resolveWorkspacePath,
				onCleanupError
			});
			try {
				return await environments.destroy(environmentId);
			} catch (error) {
				const current = environments.get(environmentId);
				if (!current || !isUnavailableEnvironment(current)) throw error;
				try {
					onCleanupError?.(error);
				} catch {}
				return current;
			}
		}),
		reclaim,
		reconcile: recovery.reconcile,
		reconcileActive: recovery.reconcileActive
	};
}
//#endregion
//#region src/gateway/worker-environments/placement-session-retirement.ts
function createPlacementSessionRetirement(deps) {
	const retireCurrent = (placement) => {
		if (placement.turnClaim) return false;
		const retirement = placement.state === "local" || placement.state === "reclaimed" ? {
			sessionId: placement.sessionId,
			expectedState: placement.state,
			expectedGeneration: placement.generation
		} : placement.state === "failed" && isFailedWorkerPlacementEnvironmentGone({
			environmentService: deps.environments,
			placement
		}) ? {
			sessionId: placement.sessionId,
			expectedState: placement.state,
			expectedGeneration: placement.generation
		} : void 0;
		if (!retirement) return false;
		deps.placements.retireSessionPlacement(retirement);
		return true;
	};
	const reconcilePlacement = async (placement) => {
		if (await deps.resolveSessionEvidence(placement) !== "absent") return;
		let current = deps.placements.get(placement.sessionId);
		if (!current) return;
		try {
			if (retireCurrent(current)) return;
		} catch {
			return;
		}
		const environmentId = current.environmentId;
		if (!environmentId) return;
		try {
			await deps.forceDestroyEnvironment(environmentId, (error) => {
				deps.warn(`Worker placement orphan cleanup deferred for ${current?.sessionId ?? placement.sessionId}: ${String(error)}`);
			});
		} catch (error) {
			deps.warn(`Worker placement orphan teardown failed for ${current.sessionId}: ${String(error)}`);
			return;
		}
		current = deps.placements.get(placement.sessionId);
		if (!current) return;
		try {
			retireCurrent(current);
		} catch {}
	};
	const reconcile = async () => {
		for (const placement of deps.placements.list()) try {
			await reconcilePlacement(placement);
		} catch (error) {
			deps.warn(`Worker placement session evidence check failed for ${placement.sessionId}: ${String(error)}`);
		}
	};
	return { reconcile };
}
//#endregion
//#region src/gateway/worker-environments/reclaimed-placement-redispatch.ts
function createReclaimedPlacementRedispatch(params) {
	return async (placement) => {
		const previousEnvironment = params.environments.get(placement.environmentId);
		if (!previousEnvironment) throw new Error(`Reclaimed worker placement has no environment record: ${placement.environmentId}`);
		return await params.dispatch({
			sessionId: placement.sessionId,
			sessionKey: placement.sessionKey,
			agentId: placement.agentId,
			profileId: previousEnvironment.profileId,
			executionMode: placement.executionMode,
			inheritedProfile: {
				providerId: previousEnvironment.providerId,
				profileSnapshot: previousEnvironment.profileSnapshot
			}
		});
	};
}
//#endregion
//#region src/gateway/worker-environments/placement-sandbox.ts
function requireRemoteWorkspaceDir(value) {
	if (!path.posix.isAbsolute(value) || value === "/" || path.posix.normalize(value) !== value || value.endsWith("/")) throw new Error("Remote-exec placement has an invalid managed workspace path");
	return value;
}
/** Builds the SSH sandbox owned by one exact active placement generation. */
async function createRemoteExecPlacementSandbox(params) {
	const { placement } = params;
	if (placement.executionMode !== "remote-exec") throw new Error(`Cloud placement ${placement.sessionId} is not a remote-exec placement`);
	const environment = params.environments.get(placement.environmentId);
	if (!environment || environment.state !== "attached" || environment.environmentId !== placement.environmentId || environment.ownerEpoch !== placement.activeOwnerEpoch || environment.attachedSessionIds.length !== 1 || environment.attachedSessionIds[0] !== placement.sessionId || !environment.leaseId || !environment.sshEndpoint) throw new Error(`Remote-exec placement ${placement.sessionId} has no matching active SSH environment`);
	const identity = await params.environments.resolveSshIdentity(environment.environmentId);
	const ssh = resolveWorkerSshSandboxSettings({
		ssh: environment.sshEndpoint,
		identity
	});
	const remoteWorkspaceDir = requireRemoteWorkspaceDir(placement.remoteWorkspaceDir);
	const runtimeId = [
		"remote-exec",
		environment.environmentId,
		environment.ownerEpoch,
		placement.generation
	].join(":");
	const base = resolveSandboxConfigForAgent(params.config, placement.agentId);
	const { binds: _ignoredBinds, ...docker } = base.docker;
	const cfg = {
		...base,
		mode: "all",
		backend: "ssh",
		scope: "session",
		workspaceAccess: "rw",
		docker,
		ssh: {
			...base.ssh,
			...ssh,
			workspaceRoot: path.posix.dirname(remoteWorkspaceDir)
		},
		browser: {
			...base.browser,
			enabled: false,
			allowHostControl: false
		},
		prune: {
			idleHours: 0,
			maxAgeDays: 0
		}
	};
	const backend = await createPreprovisionedSshSandboxBackend({
		sessionKey: placement.sessionKey,
		scopeKey: placement.sessionKey,
		workspaceDir: params.localWorkspaceDir,
		agentWorkspaceDir: params.localWorkspaceDir,
		cfg
	}, {
		runtimeId,
		remoteWorkspaceDir
	});
	const sandbox = {
		enabled: true,
		placementExecutionMode: "remote-exec",
		backendId: "ssh",
		sessionKey: placement.sessionKey,
		workspaceDir: params.localWorkspaceDir,
		agentWorkspaceDir: params.localWorkspaceDir,
		workspaceAccess: "rw",
		runtimeId,
		runtimeLabel: runtimeId,
		containerName: runtimeId,
		containerWorkdir: remoteWorkspaceDir,
		docker: cfg.docker,
		tools: cfg.tools,
		browserAllowHostControl: false,
		backend
	};
	sandbox.fsBridge = backend.createFsBridge?.({ sandbox }) ?? createSandboxFsBridge({ sandbox });
	return sandbox;
}
//#endregion
//#region src/gateway/worker-environments/worker-tool-authority.ts
function resolveWorkerCapabilityProfile(params) {
	const turn = params.turn;
	const sandboxSessionKey = turn.sandboxSessionKey?.trim() || turn.sessionKey?.trim() || turn.sessionId;
	const sandbox = resolveSandboxRuntimeStatus({
		cfg: turn.config,
		sessionKey: sandboxSessionKey,
		agentId: turn.agentId
	});
	return resolveConversationCapabilityProfile({
		config: turn.config,
		sessionKey: sandboxSessionKey,
		runSessionKey: turn.sessionKey && turn.sessionKey !== sandboxSessionKey ? turn.sessionKey : void 0,
		sessionId: turn.sessionId,
		runId: turn.runId,
		agentId: turn.agentId,
		agentDir: turn.agentDir,
		agentAccountId: turn.agentAccountId,
		messageProvider: turn.messageProvider,
		messageChannel: turn.messageChannel,
		chatType: turn.chatType,
		messageTo: turn.messageTo,
		messageThreadId: turn.messageThreadId,
		currentChannelId: turn.currentChannelId,
		currentMessagingTarget: turn.currentMessagingTarget,
		currentThreadTs: turn.currentThreadTs,
		currentMessageId: turn.currentMessageId,
		groupId: turn.groupId,
		groupChannel: turn.groupChannel,
		groupSpace: turn.groupSpace,
		memberRoleIds: turn.memberRoleIds,
		spawnedBy: turn.spawnedBy,
		senderId: turn.senderId,
		senderName: turn.senderName,
		senderUsername: turn.senderUsername,
		senderE164: turn.senderE164,
		senderIsOwner: turn.senderIsOwner,
		modelProvider: params.modelRef.provider,
		modelId: params.modelRef.model,
		workspaceDir: turn.workspaceDir,
		cwd: turn.cwd,
		isCanonicalWorkspace: turn.isCanonicalWorkspace,
		promptMode: turn.promptMode,
		skillsSnapshot: turn.skillsSnapshot,
		sandboxToolPolicy: sandbox.sandboxed ? sandbox.toolPolicy : void 0,
		runtimeToolAllowlist: turn.toolsAllow,
		inheritRuntimeToolAllowlist: true,
		runtimePluginToolGrant: turn.runtimePluginToolGrant,
		inputProvenance: turn.inputProvenance,
		trustedInternalHandoff: turn.trustedInternalHandoff,
		scheduledToolPolicy: turn.scheduledToolPolicy
	});
}
/** Resolves the final fixed worker surface at the trusted Gateway handoff boundary. */
function resolveWorkerToolAuthority(params) {
	const turn = params.turn;
	if (turn.disableTools === true || turn.modelRun === true || turn.promptMode === "none") return { allowedToolNames: [] };
	const runtimeCappedTools = applyEmbeddedAttemptToolsAllow([
		...WORKER_REQUIRED_LOCAL_TOOL_NAMES,
		...params.availableOptionalToolNames ?? [],
		...WORKER_SESSION_TOOL_NAMES
	].map((name) => ({ name })), turn.toolsAllow);
	return { allowedToolNames: projectConversationToolNames({
		capabilityProfile: resolveWorkerCapabilityProfile(params),
		toolNames: runtimeCappedTools.map((tool) => tool.name),
		warn: logWarn
	}) };
}
//#endregion
//#region src/gateway/worker-environments/worker-browser-launch-plan.ts
/** Plans the optional Browser surface from persisted provider metadata and normal tool policy. */
function resolveWorkerBrowserLaunchPlan(params) {
	const browserApp = params.desktop?.apps?.find((app) => app.id === "browser");
	const browserAvailable = browserApp !== void 0 && params.turn.config?.browser?.enabled !== false && resolveManifestActivationPluginIds({
		trigger: {
			kind: "capability",
			capability: "tool"
		},
		config: params.turn.config,
		onlyPluginIds: ["browser"]
	}).includes("browser");
	const toolAuthority = resolveWorkerToolAuthority({
		modelRef: params.modelRef,
		turn: params.turn,
		...browserAvailable ? { availableOptionalToolNames: ["browser"] } : {}
	});
	return {
		toolAuthority,
		...browserApp && toolAuthority.allowedToolNames.includes("browser") ? { browser: {
			cdpUrl: `http://127.0.0.1:${browserApp.cdpPort}`,
			launcherPath: browserApp.executablePath
		} } : {}
	};
}
//#endregion
//#region src/gateway/worker-environments/worker-turn-failure.ts
var WorkerTurnExecutionError = class extends Error {};
function workerTurnRecoveryError(error) {
	return truncateUtf16Safe(redactSensitiveText(formatErrorMessage(error), { mode: "tools" }).replace(/\s+/gu, " ").trim() || "cloud worker turn failed", 1024);
}
async function failHandedOffTurn(params) {
	const failures = [workerTurnRecoveryError(params.error)];
	let draining;
	try {
		draining = params.placements.startDrain({
			sessionId: params.placement.sessionId,
			environmentId: params.placement.environmentId,
			ownerEpoch: params.placement.activeOwnerEpoch,
			expectedGeneration: params.placement.generation
		});
	} catch {
		return;
	}
	if (draining.state !== "draining") return;
	await releaseClaimIfOwned(params.placements, params.turnClaim);
	try {
		await params.environments.stopTunnel(params.placement.environmentId, params.placement.activeOwnerEpoch);
	} catch (error) {
		failures.push(`tunnel stop: ${workerTurnRecoveryError(error)}`);
	}
	try {
		await params.environments.destroy(params.placement.environmentId);
	} catch (error) {
		failures.push(`environment destroy: ${workerTurnRecoveryError(error)}`);
	}
	try {
		const reconciling = params.placements.startReconcile({
			sessionId: draining.sessionId,
			environmentId: draining.environmentId,
			ownerEpoch: draining.activeOwnerEpoch,
			expectedGeneration: draining.generation
		});
		if (reconciling.state !== "reconciling") return;
		params.placements.fail({
			sessionId: reconciling.sessionId,
			expectedGeneration: reconciling.generation,
			recoveryError: failures.join("; ")
		});
	} catch {}
}
//#endregion
//#region src/gateway/worker-environments/worker-turn-payload.ts
function buildWorkerAgentRuntimeIdentity(params) {
	const { turn } = params;
	return {
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		operationalRunInstance: params.admittedRunContext.operationalRunInstance,
		executionIdentityToken: params.admittedRunContext.executionIdentityToken,
		turnSourceChannel: turn.messageChannel ?? turn.messageProvider,
		turnSourceTo: turn.currentMessagingTarget ?? turn.currentChannelId,
		turnSourceAccountId: turn.agentAccountId,
		turnSourceThreadId: turn.currentThreadTs,
		workerTurnClaim: params.turnClaim
	};
}
async function prepareWorkerAgentRuntimeIdentity(params) {
	const admittedRunContext = await resolvePreparedRunAdmission({
		runId: params.turn.runId,
		runtimeKind: "worker",
		runtimeInstanceId: params.runtimeInstanceId,
		admittedRunContext: params.turn.admittedRunContext,
		preparedRunAdmission: params.turn.preparedRunAdmission
	});
	return {
		operationalRunInstance: admittedRunContext.operationalRunInstance,
		runtimeIdentity: buildWorkerAgentRuntimeIdentity({
			...params,
			admittedRunContext
		})
	};
}
function emitProviderReplayRejected(config, details) {
	if (isDiagnosticsEnabled(config)) emitTrustedDiagnosticEvent({
		type: "payload.large",
		surface: "worker.provider-replay",
		action: "rejected",
		...details
	});
}
function windowInitialMessages(messages) {
	const windowed = windowWorkerReplayMessages(messages, WORKER_INFERENCE_MAX_CONTEXT_MESSAGES - 1);
	if (windowed.kind === "provider-replay-unavailable") return windowed;
	const projected = [];
	for (const message of windowed.messages) {
		const result = toWorkerTranscriptMessage(message, "inference");
		if (!result) continue;
		if (result.kind === "provider-replay-unavailable") return result;
		projected.push(result.message);
	}
	return {
		kind: "complete",
		messages: projected
	};
}
const WORKER_LAUNCH_ENDPOINT_OVERHEAD_BYTES = 4608;
/** Fits replay context before minting the exact worker-bound identity bearer. */
async function fitLaunchDescriptorWithRuntimeIdentity(params) {
	const tokenBytes = measureAgentRuntimeIdentityTokenBytes(params.runtimeIdentity);
	const plan = fitLaunchDescriptor((messages) => params.build("x".repeat(tokenBytes), messages), params.messages);
	if (plan.kind !== "launch") return plan;
	const token = await mintAgentRuntimeIdentityToken(params.runtimeIdentity);
	if (Buffer.byteLength(token, "utf8") !== tokenBytes) throw new Error("Agent runtime identity changed while preparing worker launch");
	return {
		kind: "launch",
		plan: {
			...plan.plan,
			assignment: {
				...plan.plan.assignment,
				agentRuntimeIdentityToken: token
			}
		}
	};
}
function fitLaunchDescriptor(build, messages) {
	let initialMessages = messages;
	while (true) {
		const plan = build(initialMessages);
		const bytes = Buffer.byteLength(JSON.stringify(plan), "utf8") + WORKER_LAUNCH_ENDPOINT_OVERHEAD_BYTES;
		if (bytes <= 26214400) return {
			kind: "launch",
			plan
		};
		const replayIndex = initialMessages.findLastIndex((message) => message.role === "assistant" && message.providerReplay !== void 0);
		if (replayIndex === 0) return {
			kind: "local-fallback",
			reason: "provider-replay-launch-payload-limit",
			bytes,
			limitBytes: WORKER_PROTOCOL_MAX_INFERENCE_PAYLOAD_BYTES
		};
		const nextTurn = initialMessages.findIndex((message, index) => index > 0 && message.role === "user");
		const nextStart = replayIndex > 0 && (nextTurn < 0 || nextTurn > replayIndex) ? replayIndex : nextTurn;
		if (nextStart < 0) throw new Error("Worker turn context exceeds the launch descriptor payload limit");
		initialMessages = initialMessages.slice(nextStart);
	}
}
function parseRuntimeResult(stdout) {
	let value;
	try {
		value = JSON.parse(stdout.trim());
	} catch (error) {
		throw new Error("Worker process returned invalid output", { cause: error });
	}
	if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Worker process returned invalid output");
	const result = value;
	if (result.status === "failed" && result.reason === "turn-failed" && (result.transcriptLeafId === null || typeof result.transcriptLeafId === "string") && typeof result.transcriptNextSeq === "number" && Number.isSafeInteger(result.transcriptNextSeq) && result.transcriptNextSeq >= 1 && Object.keys(result).every((key) => [
		"status",
		"reason",
		"transcriptLeafId",
		"transcriptNextSeq"
	].includes(key))) return result;
	if (result.status === "completed" && (result.transcriptLeafId === null || typeof result.transcriptLeafId === "string") && typeof result.transcriptNextSeq === "number" && Number.isSafeInteger(result.transcriptNextSeq) && result.transcriptNextSeq >= 1 && Object.keys(result).every((key) => [
		"status",
		"transcriptLeafId",
		"transcriptNextSeq"
	].includes(key))) return result;
	if (result.status === "fenced" && (result.reason === "credential-replaced" || result.reason === "owner-epoch-mismatch") && Object.keys(result).every((key) => ["status", "reason"].includes(key))) return result;
	throw new Error("Worker process returned invalid output");
}
function assistantText(message) {
	if (message.role !== "assistant") return "";
	return message.content.flatMap((part) => part.type === "text" ? [part.text] : []).join("");
}
function buildWorkerAgentMeta(params) {
	const usageAccumulator = createUsageAccumulator();
	const assistants = params.messages.filter((message) => message.role === "assistant");
	let lastRunPromptUsage;
	for (const assistant of assistants) {
		const usage = normalizeUsage(assistant.usage);
		mergeUsageIntoAccumulator(usageAccumulator, usage);
		if (hasNonzeroUsage(usage)) lastRunPromptUsage = usage;
	}
	const lastAssistant = assistants.at(-1);
	const usageMeta = buildUsageAgentMetaFields({
		usageAccumulator,
		latestUsage: lastAssistant?.usage,
		lastRunPromptUsage
	});
	const reportedModelRef = resolveReportedModelRef({
		...params.modelRef,
		assistant: lastAssistant
	});
	return {
		provider: reportedModelRef.provider,
		model: reportedModelRef.model,
		usage: usageMeta.usage,
		lastCallUsage: usageMeta.lastCallUsage,
		promptTokens: usageMeta.promptTokens
	};
}
function resolveTurnModelRef(params) {
	const explicitProvider = params.provider?.trim();
	const explicitModel = params.model?.trim();
	const defaults = explicitProvider && explicitModel ? void 0 : resolveDefaultModelForAgent({
		cfg: params.config ?? {},
		agentId: params.agentId
	});
	return {
		provider: explicitProvider ?? defaults?.provider ?? "",
		model: explicitModel ?? defaults?.model ?? ""
	};
}
function assertSupportedTurn(params) {
	if (params.images?.length || params.imageOrder?.length) throw new Error("Cloud worker turns do not yet support current-turn image input");
	if (params.clientTools?.length) throw new Error("Cloud worker turns do not support client-provided tools");
	const modelRef = resolveTurnModelRef(params);
	const explicitRuntime = normalizeOptionalAgentRuntimeId(params.agentHarnessId) ?? normalizeOptionalAgentRuntimeId(params.agentHarnessRuntimeOverride);
	const runtime = explicitRuntime && !isDefaultAgentRuntimeId(explicitRuntime) ? explicitRuntime : resolveEffectiveAgentRuntime({
		cfg: params.config ?? {},
		provider: modelRef.provider,
		modelId: modelRef.model,
		agentId: params.agentId,
		sessionKey: params.sessionKey
	});
	if (runtime !== "openclaw") throw new Error(`Cloud worker turns require the OpenClaw runtime, not ${runtime}`);
	return modelRef;
}
//#endregion
//#region src/gateway/worker-environments/workspace-operation-coordinator.ts
/** Serializes local workspace mutation and forced teardown per environment. */
function createWorkerWorkspaceOperationCoordinator() {
	const tails = /* @__PURE__ */ new Map();
	return { async run(environmentId, operation) {
		const result = (tails.get(environmentId) ?? Promise.resolve()).catch(() => void 0).then(operation);
		const tail = result.then(() => void 0, () => void 0);
		tails.set(environmentId, tail);
		tail.finally(() => {
			if (tails.get(environmentId) === tail) tails.delete(environmentId);
		});
		return await result;
	} };
}
//#endregion
//#region src/gateway/worker-environments/worker-turn-launcher.ts
async function executeLocalTurn(params) {
	const current = params.placements.get(params.claim.sessionId);
	const turnClaim = params.placements.claimTurn({
		...resolvePlacementIdentity(params.claim, current),
		claimId: randomUUID(),
		runId: params.claim.runId,
		owner: { kind: "local" }
	});
	try {
		return await params.runLocal();
	} finally {
		await releaseClaimIfOwned(params.placements, turnClaim);
	}
}
async function executeWorkerTurn(params) {
	const { placement, turn } = params;
	const modelRef = assertSupportedTurn(turn);
	const environment = params.environments.get(placement.environmentId);
	const bootstrapReceipt = environment?.bootstrapReceipt;
	if (!environment || environment.state !== "attached" || environment.ownerEpoch !== placement.activeOwnerEpoch || !bootstrapReceipt || bootstrapReceipt.bundleHash !== placement.workerBundleHash || environment.attachedSessionIds.length !== 1 || environment.attachedSessionIds[0] !== placement.sessionId) throw new Error("Active worker placement does not match its attached environment");
	if (!supportsWorkerExecutionContextLaunch(bootstrapReceipt)) throw new Error("Active worker bundle lacks the current execution-context capability; reprovision the worker before launch");
	await recoverWorkspaceBeforeTurn(params);
	const startedAt = Date.now();
	turn.onExecutionStarted?.({ lifecycleGeneration: turn.lifecycleGeneration });
	turn.onExecutionPhase?.({
		phase: "runner_entered",
		backend: "cloud-worker"
	});
	const transcriptTarget = resolveWorkerTurnTranscriptTarget(turn);
	const manager = SessionManager.open(transcriptTarget);
	const userMessageAlreadyPersisted = turn.suppressNextUserMessagePersistence === true || turn.userTurnTranscriptRecorder?.hasPersisted() === true;
	const contextMessages = convertToLlm(manager.buildSessionContext().messages);
	const leaf = manager.getLeafEntry();
	const initialMessagePlan = windowInitialMessages(userMessageAlreadyPersisted && leaf?.type === "message" && leaf.message.role === "user" ? contextMessages.slice(0, -1) : contextMessages);
	if (initialMessagePlan.kind === "provider-replay-unavailable") {
		const details = initialMessagePlan.details;
		emitProviderReplayRejected(turn.config, "bytes" in details ? details : {
			count: details.messageCount,
			reason: details.reason
		});
		throw new WorkerTurnExecutionError(WORKER_PROVIDER_REPLAY_LOCAL_RETRY_MESSAGE);
	}
	const initialMessages = initialMessagePlan.messages;
	let baseLeafId = manager.getLeafId();
	if (!userMessageAlreadyPersisted) {
		const persisted = turn.userTurnTranscriptRecorder ? await turn.userTurnTranscriptRecorder.persistApproved({ cwd: params.localWorkspaceDir }) : void 0;
		if (persisted) {
			baseLeafId = persisted.messageId;
			turn.userTurnTranscriptRecorder?.markRuntimePersisted(persisted.message, persisted.admission);
			turn.onUserMessagePersisted?.(persisted.message);
		} else if (turn.userTurnTranscriptRecorder?.hasPersisted()) baseLeafId = SessionManager.open(transcriptTarget).getLeafId();
		else if (!turn.userTurnTranscriptRecorder) {
			const message = {
				role: "user",
				content: [{
					type: "text",
					text: turn.transcriptPrompt ?? turn.prompt
				}],
				timestamp: Date.now()
			};
			baseLeafId = manager.appendMessage(message);
			turn.onUserMessagePersisted?.(message);
		} else throw new Error("Cloud worker turn could not persist its canonical user message");
	}
	turn.onExecutionPhase?.({
		phase: "model_resolution",
		backend: "cloud-worker",
		provider: modelRef.provider,
		model: modelRef.model
	});
	const credential = await params.environments.acquireTurnCredential({
		environmentId: placement.environmentId,
		ownerEpoch: placement.activeOwnerEpoch,
		sessionId: placement.sessionId
	});
	const tunnel = await waitForTurnOperation({
		operation: params.environments.startTunnel({
			environmentId: placement.environmentId,
			ownerEpoch: placement.activeOwnerEpoch
		}),
		...turn.abortSignal ? { signal: turn.abortSignal } : {},
		timeoutMs: turn.timeoutMs
	});
	const reasoning = mapThinkingLevelForProvider(turn.thinkLevel);
	const { browser, toolAuthority } = resolveWorkerBrowserLaunchPlan({
		desktop: environment.desktop,
		modelRef,
		turn
	});
	params.placements.authorizeWorkerTurnTools(params.turnClaim, toolAuthority.allowedToolNames);
	const { operationalRunInstance, runtimeIdentity } = await prepareWorkerAgentRuntimeIdentity({
		agentId: placement.agentId,
		runtimeInstanceId: placement.environmentId,
		sessionKey: placement.sessionKey,
		turn,
		turnClaim: params.turnClaim
	});
	const { bundleHash, openclawVersion, protocolFeatures } = bootstrapReceipt;
	const launchPlan = await fitLaunchDescriptorWithRuntimeIdentity({
		runtimeIdentity,
		messages: initialMessages,
		build: (agentRuntimeIdentityToken, windowedMessages) => parseWorkerLaunchPlan({
			version: 3,
			admission: {
				environmentId: placement.environmentId,
				credential: credential.credential,
				sessionId: placement.sessionId,
				ownerEpoch: placement.activeOwnerEpoch,
				rpcSetVersion: credential.rpcSetVersion,
				handshake: {
					bundleHash,
					openclawVersion,
					protocolFeatures
				}
			},
			assignment: {
				agentId: placement.agentId,
				operationalRunInstance,
				agentRuntimeIdentityToken,
				runId: turn.runId,
				turnId: randomUUID(),
				prompt: turn.prompt,
				suppressPromptTranscript: true,
				workspaceDir: placement.remoteWorkspaceDir,
				modelRef,
				inferenceOptions: reasoning ? { reasoning } : {},
				...turn.extraSystemPrompt === void 0 ? {} : { systemPrompt: turn.extraSystemPrompt },
				initialMessages: windowedMessages,
				transcript: {
					baseLeafId,
					nextSeq: (placement.lastTranscriptAckCursor ?? 0) + 1
				},
				liveEvents: {
					ackedSeq: placement.lastLiveEventAckCursor ?? 0,
					nextSeq: (placement.lastLiveEventAckCursor ?? 0) + 1
				},
				toolAuthority,
				...browser ? { browser } : {}
			}
		})
	});
	if (launchPlan.kind === "local-fallback") {
		emitProviderReplayRejected(turn.config, {
			bytes: launchPlan.bytes,
			limitBytes: launchPlan.limitBytes,
			reason: launchPlan.reason
		});
		throw new WorkerTurnExecutionError(WORKER_PROVIDER_REPLAY_LOCAL_RETRY_MESSAGE);
	}
	const plan = launchPlan.plan;
	turn.userTurnTranscriptRecorder?.markSentToProvider?.();
	turn.onExecutionPhase?.({
		phase: "attempt_dispatch",
		backend: "cloud-worker"
	});
	const handoffAbort = new AbortController();
	let handoffError;
	let dispatchReady = false;
	const onDispatchReady = () => {
		if (dispatchReady) return;
		dispatchReady = true;
		params.onHandoff();
		turn.onExecutionPhase?.({
			phase: "process_spawned",
			backend: "cloud-worker"
		});
		try {
			if (!params.environments.acknowledgeCredentialDelivery(credential)) handoffError = /* @__PURE__ */ new Error("Cloud worker credential owner changed during process handoff");
		} catch (error) {
			handoffError = new Error("Cloud worker credential handoff failed", { cause: error });
		}
		if (handoffError) handoffAbort.abort(handoffError);
	};
	const processResult = await tunnel.launchTurn({
		plan,
		placementGeneration: placement.generation,
		timeoutMs: turn.timeoutMs,
		signal: turn.abortSignal ? AbortSignal.any([turn.abortSignal, handoffAbort.signal]) : handoffAbort.signal,
		onDispatchReady
	});
	if (handoffError) throw handoffError;
	if (!dispatchReady) throw new Error("Cloud worker launch completed before transport dispatch");
	if (processResult.code !== 0 || processResult.signal !== null || processResult.killed) {
		const detail = truncateUtf16Safe(redactSensitiveText(processResult.stderr, { mode: "tools" }).replace(/\s+/gu, " ").trim(), 400);
		throw new Error(detail ? `Cloud worker process failed before completing the turn: ${detail}` : "Cloud worker process failed before completing the turn");
	}
	const runtimeResult = parseRuntimeResult(processResult.stdout);
	if (runtimeResult.status === "fenced") throw new Error(`Cloud worker turn was fenced: ${runtimeResult.reason}`);
	const workerTurnFailed = runtimeResult.status === "failed";
	const completed = SessionManager.open(transcriptTarget);
	const currentPlacement = params.placements.get(placement.sessionId);
	if (runtimeResult.transcriptLeafId !== completed.getLeafId() || runtimeResult.transcriptNextSeq !== (currentPlacement?.lastTranscriptAckCursor ?? 0) + 1) throw new Error(`Cloud worker result does not match its committed transcript acknowledgement (leaf=${runtimeResult.transcriptLeafId ?? "none"}/${completed.getLeafId() ?? "none"}, nextSeq=${runtimeResult.transcriptNextSeq}/${(currentPlacement?.lastTranscriptAckCursor ?? 0) + 1})`);
	const terminal = runtimeResult.transcriptLeafId ? completed.getEntry(runtimeResult.transcriptLeafId) : void 0;
	if (!terminal || terminal.type !== "message" || terminal.message.role !== "assistant") throw new Error("Cloud worker completed without a terminal assistant transcript message");
	const text = assistantText(terminal.message);
	const baseIndex = completed.getBranch().findIndex((entry) => entry.id === baseLeafId);
	const workerMessages = completed.getBranch().slice(baseIndex + 1).flatMap((entry) => entry.type === "message" ? [entry.message] : []);
	const workspaceConflict = await reconcileWorkspaceAfterTurn({
		placement,
		placements: params.placements,
		turnClaim: params.turnClaim,
		workspaceOperations: params.workspaceOperations,
		localWorkspaceDir: params.localWorkspaceDir,
		transcriptTarget,
		tunnel
	});
	if (workspaceConflict) {
		const reportedWorkspaceConflict = workspaceConflict;
		await Promise.resolve().then(() => turn.onAgentEvent?.({
			stream: "assistant",
			data: {
				text: text ? `${text}\n\n${reportedWorkspaceConflict.summary}` : reportedWorkspaceConflict.summary,
				delta: `${text ? "\n\n" : ""}${reportedWorkspaceConflict.summary}`
			}
		})).catch(() => void 0);
	}
	if (workerTurnFailed) throw new WorkerTurnExecutionError(terminal.message.errorMessage ?? "Cloud worker turn failed");
	const replyText = workspaceConflict ? text ? `${text}\n\n${workspaceConflict.summary}` : workspaceConflict.summary : text;
	return {
		...replyText ? { payloads: [{ text: replyText }] } : {},
		meta: {
			durationMs: Date.now() - startedAt,
			agentMeta: {
				sessionId: placement.sessionId,
				sessionFile: turn.sessionFile,
				...buildWorkerAgentMeta({
					messages: workerMessages,
					modelRef
				})
			},
			stopReason: terminal.message.stopReason
		}
	};
}
function createWorkerSessionTurnPlacementProvider(options) {
	const workspaceOperations = options.workspaceOperations ?? createWorkerWorkspaceOperationCoordinator();
	return {
		async resolveSandbox(params) {
			const placement = options.placements.get(params.sessionId);
			if (placement?.state !== "active" || placement.executionMode !== "remote-exec" || placement.agentId !== params.agentId || placement.sessionKey !== params.sessionKey) return null;
			const localWorkspaceDir = await options.resolveWorkspacePath({
				sessionId: placement.sessionId,
				agentId: placement.agentId,
				sessionKey: placement.sessionKey
			});
			if (!options.environments.resolveSshIdentity) throw new Error("Remote-exec sandbox identity resolver is unavailable");
			const sandbox = await createRemoteExecPlacementSandbox({
				config: params.config,
				environments: {
					get: options.environments.get,
					resolveSshIdentity: options.environments.resolveSshIdentity
				},
				localWorkspaceDir,
				placement
			});
			const current = options.placements.get(params.sessionId);
			if (current?.state !== "active" || current.executionMode !== "remote-exec" || current.environmentId !== placement.environmentId || current.activeOwnerEpoch !== placement.activeOwnerEpoch || current.generation !== placement.generation) throw new Error("Remote-exec placement changed while preparing its sandbox");
			return sandbox;
		},
		async executeLocalTurn(claim, runLocal) {
			if (!options.placements.get(claim.sessionId) && options.admitNewPlacements === false) return await runLocal();
			return await executeLocalTurn({
				claim,
				placements: options.placements,
				runLocal
			});
		},
		async executeTurn(claim, turn, runLocal, onAdmitted) {
			const current = options.placements.get(claim.sessionId);
			if (!current && (options.admitNewPlacements === false || turn.modelRun === true && !claim.sessionKey?.trim())) return await runLocal();
			if (!current || current.state === "local") return await executeLocalTurn({
				claim,
				placements: options.placements,
				runLocal
			});
			let routablePlacement = current;
			if (routablePlacement.state === "reclaimed") {
				if (!options.redispatchReclaimed) throw new Error("Reclaimed worker placement requires redispatch");
				emitAgentRunStatusEvent({
					runId: claim.runId,
					phase: "provisioning_environment",
					...claim.sessionKey ? { sessionKey: claim.sessionKey } : {},
					...claim.agentId ? { agentId: claim.agentId } : {}
				});
				routablePlacement = await options.redispatchReclaimed(routablePlacement);
			}
			const identity = resolvePlacementIdentity(claim, routablePlacement);
			let placement = requireActivePlacement(routablePlacement);
			const localWorkspaceDir = await options.resolveWorkspacePath(identity);
			const remoteExec = placement.executionMode === "remote-exec";
			let turnClaim;
			if (remoteExec) {
				turnClaim = options.placements.claimTurn({
					...identity,
					claimId: randomUUID(),
					runId: claim.runId,
					owner: {
						kind: "local",
						environmentId: placement.environmentId,
						ownerEpoch: placement.activeOwnerEpoch
					}
				});
				const refreshed = options.placements.get(claim.sessionId);
				if (refreshed?.state !== "active" || refreshed.executionMode !== "remote-exec" || refreshed.environmentId !== placement.environmentId || refreshed.activeOwnerEpoch !== placement.activeOwnerEpoch || refreshed.generation !== turnClaim.placementGeneration) {
					await releaseClaimIfOwned(options.placements, turnClaim);
					throw new Error("Remote-exec placement changed during turn admission");
				}
				placement = refreshed;
			} else {
				const admitted = await claimWorkerTurn({
					placements: options.placements,
					identity,
					placement,
					runId: claim.runId,
					...turn.abortSignal ? { signal: turn.abortSignal } : {}
				});
				placement = admitted.placement;
				turnClaim = admitted.turnClaim;
			}
			let handedOff = false;
			try {
				onAdmitted?.();
				const executionParams = {
					environments: options.environments,
					onHandoff: () => {
						handedOff = true;
					},
					placement,
					placements: options.placements,
					localWorkspaceDir,
					workspaceOperations,
					turn,
					turnClaim
				};
				return remoteExec ? await executeRemoteExecTurn({
					...executionParams,
					runLocal
				}) : await executeWorkerTurn(executionParams);
			} catch (error) {
				if (options.placements.listPendingWorkspaceResults().some((pending) => pending.sessionId === turnClaim.sessionId && pending.claimId === turnClaim.claimId && pending.runId === turnClaim.runId)) {
					options.placements.handoffWorkspaceResultRecovery(turnClaim);
					await options.recoverPendingWorkspaceResult?.(placement.environmentId);
					throw error;
				}
				if (error instanceof WorkerRunnerUnavailableError && !handedOff) {
					await releaseClaimIfOwned(options.placements, turnClaim);
					throw error;
				}
				const settledPlacement = options.placements.get(turnClaim.sessionId);
				if (remoteExec && settledPlacement?.state === "active" && settledPlacement.environmentId === placement.environmentId && settledPlacement.activeOwnerEpoch === placement.activeOwnerEpoch && settledPlacement.turnClaim === null) throw error;
				if (error instanceof WorkerWorkspaceReconciliationError && !handedOff) {
					await releaseClaimIfOwned(options.placements, turnClaim);
					throw error;
				}
				if (error instanceof WorkerTurnExecutionError) {
					if (options.placements.validateTurnClaim(turnClaim)) {
						await releaseClaimIfOwned(options.placements, turnClaim);
						throw error;
					}
					const workerSettledPlacement = options.placements.get(turnClaim.sessionId);
					if (workerSettledPlacement?.state === "active" && workerSettledPlacement.environmentId === placement.environmentId && workerSettledPlacement.activeOwnerEpoch === placement.activeOwnerEpoch && workerSettledPlacement.turnClaim === null) throw error;
				}
				if (handedOff) await failHandedOffTurn({
					environments: options.environments,
					placements: options.placements,
					placement,
					turnClaim,
					error
				});
				else await releaseClaimIfOwned(options.placements, turnClaim);
				throw error;
			}
		}
	};
}
//#endregion
//#region src/gateway/worker-workspace-conflict-transcript.ts
function createWorkerWorkspaceConflictTranscriptHandlers(loadSessionRuntime) {
	return {
		resolveWorkspaceResultConflict: async (identity) => {
			const { resolveCanonicalSessionEntryFromStoreKeys, resolveGatewaySessionStoreTargetWithStore } = await loadSessionRuntime();
			const target = resolveGatewaySessionStoreTargetWithStore({
				cfg: getRuntimeConfig(),
				key: identity.sessionKey,
				agentId: identity.agentId,
				clone: false
			});
			if (resolveCanonicalSessionEntryFromStoreKeys(target.store, target.storeKeys)?.sessionId !== identity.sessionId) return;
			return await withTranscriptWriteTransaction({
				agentId: target.agentId,
				sessionId: identity.sessionId,
				sessionKey: target.canonicalKey,
				storePath: target.storePath
			}, (transcriptTarget) => {
				for (const transcriptEntry of SessionManager.open(transcriptTarget).getBranch().toReversed()) {
					if (transcriptEntry.type !== "custom_message") continue;
					if (transcriptEntry.customType === "cloud-workspace-conflict-cleared") return;
					if (transcriptEntry.customType !== "cloud-workspace-conflict") continue;
					const details = transcriptEntry.details;
					if (Array.isArray(details?.paths) && details.paths.length > 0 && details.paths.every((entryPath) => typeof entryPath === "string" && entryPath.length > 0) && typeof details.stagedResultRef === "string" && (details.totalCount === void 0 || Number.isSafeInteger(details.totalCount) && details.totalCount >= details.paths.length) && /^refs\/openclaw\/worker-results\/[A-Za-z0-9-]+$/u.test(details.stagedResultRef)) return projectWorkspaceResultConflict(details.paths, details.stagedResultRef, details.totalCount);
					return;
				}
			});
		},
		reportWorkspaceResultConflict: async (conflict) => {
			const { resolveCanonicalSessionEntryFromStoreKeys, resolveGatewaySessionStoreTargetWithStore } = await loadSessionRuntime();
			const target = resolveGatewaySessionStoreTargetWithStore({
				cfg: getRuntimeConfig(),
				key: conflict.sessionKey,
				agentId: conflict.agentId,
				clone: false
			});
			if (resolveCanonicalSessionEntryFromStoreKeys(target.store, target.storeKeys)?.sessionId !== conflict.sessionId) throw new Error(`Recovered cloud workspace conflict lost session ${conflict.sessionId}`);
			await withTranscriptWriteTransaction({
				agentId: target.agentId,
				sessionId: conflict.sessionId,
				sessionKey: target.canonicalKey,
				storePath: target.storePath
			}, (transcriptTarget) => {
				const manager = SessionManager.open(transcriptTarget);
				const latestConflictEntry = manager.getBranch().toReversed().find((transcriptEntry) => transcriptEntry.type === "custom_message" && (transcriptEntry.customType === "cloud-workspace-conflict" || transcriptEntry.customType === "cloud-workspace-conflict-cleared"));
				if ("cleared" in conflict) {
					if (latestConflictEntry?.type !== "custom_message" || latestConflictEntry.customType !== "cloud-workspace-conflict-cleared") manager.appendCustomMessageEntry(WORKSPACE_CONFLICT_CLEARED_TRANSCRIPT_TYPE, "A later cloud workspace result superseded the previous conflict.", false);
					return;
				}
				const projectedConflict = projectWorkspaceResultConflict(conflict.paths, conflict.stagedResultRef, conflict.totalCount);
				const details = latestConflictEntry?.type === "custom_message" ? latestConflictEntry.details : void 0;
				if (!(latestConflictEntry?.type === "custom_message" && latestConflictEntry.customType === "cloud-workspace-conflict" && details?.stagedResultRef === projectedConflict.stagedResultRef && details.totalCount === projectedConflict.totalCount && Array.isArray(details.paths) && JSON.stringify(details.paths) === JSON.stringify(projectedConflict.paths))) manager.appendCustomMessageEntry(WORKSPACE_CONFLICT_TRANSCRIPT_TYPE, formatWorkspaceConflictSummary(projectedConflict.paths, projectedConflict.stagedResultRef, projectedConflict.totalCount), true, projectedConflict);
			});
		}
	};
}
//#endregion
//#region src/gateway/server-worker-placement-startup.ts
const WORKER_PLACEMENT_RECONCILE_INTERVAL_MS = 6e4;
const workerPlacementLog = createSubsystemLogger("gateway/worker-placement");
const loadWorkerPlacementSessionRuntimeModule = createLazyRuntimeModule(async () => {
	const [placementSessionRuntime, { managedWorktrees }, sessionUtils] = await Promise.all([
		import("./placement-session-runtime-CIrqMIbB.js"),
		import("./service-DCuEjlUx.js"),
		import("./session-utils-CYXzmnQF.js")
	]);
	return {
		resolveWorkerPlacementExecutionMode: placementSessionRuntime.resolveWorkerPlacementExecutionMode,
		managedWorktrees,
		resolveWorkerPlacementSessionRuntime: placementSessionRuntime.resolveWorkerPlacementSessionRuntime,
		resolveCanonicalSessionEntryFromStoreKeys: sessionUtils.resolveCanonicalSessionEntryFromStoreKeys,
		resolveGatewaySessionStoreTargetWithStore: sessionUtils.resolveGatewaySessionStoreTargetWithStore
	};
});
const loadWorkerWorkspacePreflight = createLazyRuntimeModule(async () => {
	const { preflightWorkerWorkspace } = await import("./workspace-sync-preflight-D8YUYmep.js");
	return preflightWorkerWorkspace;
});
var WorkerDispatchTargetChangedError = class extends Error {
	constructor(..._args) {
		super(..._args);
		this.code = "invalid_state";
	}
};
/** Keeps store identity, session incarnation, canonical ownership, and the live worktree
* in one cross-phase fence. Initial resolution throws normally; barrier revalidation
* supplies expectedTarget and yields an invalid_state retry when the target changed. */
function resolveWorkerPlacementSessionTarget(params) {
	const target = params.sessionRuntime.resolveGatewaySessionStoreTargetWithStore({
		cfg: params.config,
		key: params.sessionKey,
		agentId: params.agentId,
		clone: false
	});
	const entry = params.sessionRuntime.resolveCanonicalSessionEntryFromStoreKeys(target.store, target.storeKeys);
	const worktree = params.sessionRuntime.managedWorktrees.findLiveByOwner("session", target.canonicalKey);
	const expected = params.expectedTarget;
	if (expected && (target.storePath !== expected.storePath || target.canonicalKey !== expected.canonicalKey || target.agentId !== expected.agentId) || entry?.sessionId !== params.sessionId || !entry.worktree?.id || !worktree || worktree.id !== entry.worktree.id || worktree.ownerId !== target.canonicalKey) throw expected ? new WorkerDispatchTargetChangedError(params.errorMessage) : new Error(params.errorMessage);
	return {
		config: params.config,
		target,
		entry,
		worktree
	};
}
function createGatewayWorkerPlacementRuntime(params) {
	const workspaceOperations = createWorkerWorkspaceOperationCoordinator();
	const diskSpace = createWorkerPlacementDiskSpaceMonitor({
		placements: params.placements,
		environments: params.environments,
		warn: params.warn
	});
	const workspaceConflictHandlers = createWorkerWorkspaceConflictTranscriptHandlers(loadWorkerPlacementSessionRuntimeModule);
	const resolveWorkspacePath = async ({ sessionId, sessionKey, agentId }) => {
		const { worktree } = resolveWorkerPlacementSessionTarget({
			sessionRuntime: await loadWorkerPlacementSessionRuntimeModule(),
			config: getRuntimeConfig(),
			sessionId,
			sessionKey,
			agentId,
			errorMessage: `Session ${sessionKey} dispatch requires a session-owned managed worktree`
		});
		return worktree.path;
	};
	const resolveNodeWorkspaceBinding = async (binding) => {
		const placement = params.placements.get(binding.sessionId);
		if (!placement || placement.state !== "active" && placement.state !== "draining" && placement.state !== "reconciling" || placement.environmentId !== binding.environmentId || placement.activeOwnerEpoch !== binding.ownerEpoch) return;
		return {
			localPath: await resolveWorkspacePath({
				sessionId: placement.sessionId,
				sessionKey: placement.sessionKey,
				agentId: placement.agentId
			}),
			manifestRef: placement.workspaceBaseManifestRef,
			remoteWorkspaceDir: placement.remoteWorkspaceDir
		};
	};
	const dispatchService = coordinateWorkerPlacementDispatch(createWorkerPlacementDispatchService({
		placements: params.placements,
		environments: params.environments,
		...workspaceConflictHandlers,
		runLocalBarrier: async ({ sessionId, sessionKey, agentId, executionMode, startDispatch }) => {
			const sessionRuntime = await loadWorkerPlacementSessionRuntimeModule();
			const { resolveWorkerPlacementExecutionMode, resolveGatewaySessionStoreTargetWithStore, resolveWorkerPlacementSessionRuntime } = sessionRuntime;
			const target = resolveGatewaySessionStoreTargetWithStore({
				cfg: getRuntimeConfig(),
				key: sessionKey,
				agentId,
				clone: false
			});
			const lifecycleIdentities = [
				sessionKey,
				target.canonicalKey,
				...target.storeKeys,
				sessionId
			];
			let placement;
			await runExclusiveSessionLifecycleMutation({
				scope: target.storePath,
				identities: lifecycleIdentities,
				prepare: async () => {
					const { config: currentConfig, target: currentTarget, entry: currentEntry, worktree } = resolveWorkerPlacementSessionTarget({
						sessionRuntime,
						config: getRuntimeConfig(),
						sessionId,
						sessionKey,
						agentId,
						expectedTarget: target,
						errorMessage: `Session ${sessionKey} changed before cloud worker dispatch. Retry.`
					});
					if (currentEntry.archivedAt !== void 0) throw new WorkerDispatchTargetChangedError(`Session ${sessionKey} was archived before cloud worker dispatch. Retry.`);
					const currentRuntime = resolveWorkerPlacementSessionRuntime({
						cfg: currentConfig,
						entry: currentEntry,
						agentId: currentTarget.agentId,
						sessionKey: currentTarget.canonicalKey
					});
					if (resolveWorkerPlacementExecutionMode(currentRuntime) !== executionMode) throw new WorkerDispatchTargetChangedError(`Session ${sessionKey} runtime changed to ${currentRuntime} before cloud worker dispatch. Retry.`);
					await (await loadWorkerWorkspacePreflight())({ localPath: worktree.path });
					placement = startDispatch();
					clearSessionQueues(lifecycleIdentities);
					params.revokeSessionAuthority({
						sessionId,
						sessionKeys: lifecycleIdentities
					});
					if (!await interruptSessionWorkAdmissions({
						scope: target.storePath,
						identities: lifecycleIdentities,
						timeoutMs: 15e3
					})) throw new Error(`Session ${sessionKey} is still active; dispatch stopped`);
					await params.placements.waitForTurnClaimRelease(sessionId, { timeoutMs: SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS });
					await runExclusiveSessionStoreWrite(target.storePath, async () => {}, { reentrant: true });
				},
				run: async () => {
					if (!placement) throw new Error(`Session ${sessionKey} dispatch barrier did not start`);
				}
			});
			if (!placement) throw new Error(`Session ${sessionKey} dispatch barrier did not complete`);
			return placement;
		},
		runActivationBarrier: async ({ sessionId, sessionKey, agentId, executionMode, activate }) => {
			const sessionRuntime = await loadWorkerPlacementSessionRuntimeModule();
			const { resolveWorkerPlacementExecutionMode, resolveGatewaySessionStoreTargetWithStore, resolveWorkerPlacementSessionRuntime } = sessionRuntime;
			const target = resolveGatewaySessionStoreTargetWithStore({
				cfg: getRuntimeConfig(),
				key: sessionKey,
				agentId,
				clone: false
			});
			const lifecycleIdentities = [
				sessionKey,
				target.canonicalKey,
				...target.storeKeys,
				sessionId
			];
			let activePlacement;
			await runExclusiveSessionLifecycleMutation({
				scope: target.storePath,
				identities: lifecycleIdentities,
				run: async () => {
					const { config: currentConfig, target: currentTarget, entry: currentEntry } = resolveWorkerPlacementSessionTarget({
						sessionRuntime,
						config: getRuntimeConfig(),
						sessionId,
						sessionKey,
						agentId,
						expectedTarget: target,
						errorMessage: `Session ${sessionKey} changed before cloud worker activation. Retry.`
					});
					if (currentEntry.archivedAt !== void 0) throw new WorkerDispatchTargetChangedError(`Session ${sessionKey} was archived before cloud worker activation. Retry.`);
					const currentRuntime = resolveWorkerPlacementSessionRuntime({
						cfg: currentConfig,
						entry: currentEntry,
						agentId: currentTarget.agentId,
						sessionKey: currentTarget.canonicalKey
					});
					if (resolveWorkerPlacementExecutionMode(currentRuntime) !== executionMode) throw new WorkerDispatchTargetChangedError(`Session ${sessionKey} runtime changed to ${currentRuntime} before cloud worker activation. Retry.`);
					activePlacement = activate();
				}
			});
			if (!activePlacement) throw new Error(`Session ${sessionKey} activation barrier did not complete`);
			return activePlacement;
		},
		runReclaimBarrier: async ({ sessionId, sessionKey, agentId, reclaim }) => {
			const sessionRuntime = await loadWorkerPlacementSessionRuntimeModule();
			const { resolveGatewaySessionStoreTargetWithStore } = sessionRuntime;
			const target = resolveGatewaySessionStoreTargetWithStore({
				cfg: getRuntimeConfig(),
				key: sessionKey,
				agentId,
				clone: false
			});
			const lifecycleIdentities = [
				sessionKey,
				target.canonicalKey,
				...target.storeKeys,
				sessionId
			];
			let worktreePath;
			let reclaimedPlacement;
			await runExclusiveSessionLifecycleMutation({
				scope: target.storePath,
				identities: lifecycleIdentities,
				prepare: async () => {
					const { worktree } = resolveWorkerPlacementSessionTarget({
						sessionRuntime,
						config: getRuntimeConfig(),
						sessionId,
						sessionKey,
						agentId,
						expectedTarget: target,
						errorMessage: `Session ${sessionKey} changed before cloud worker stop. Retry.`
					});
					const placement = params.placements.get(sessionId);
					if (placement?.state !== "active" || placement.turnClaim) throw new Error(`Session ${sessionKey} has active work; wait before stopping its cloud worker`);
					worktreePath = worktree.path;
					if (!await interruptSessionWorkAdmissions({
						scope: target.storePath,
						identities: lifecycleIdentities,
						timeoutMs: 15e3
					})) throw new Error(`Session ${sessionKey} is still active; cloud worker stop cancelled`);
					await params.placements.waitForTurnClaimRelease(sessionId, { timeoutMs: SESSION_WORK_ADMISSION_DRAIN_TIMEOUT_MS });
					await runExclusiveSessionStoreWrite(target.storePath, async () => {}, { reentrant: true });
				},
				run: async () => {
					if (!worktreePath) throw new Error(`Session ${sessionKey} cloud worker stop barrier did not prepare`);
					reclaimedPlacement = await reclaim(worktreePath);
					params.revokeSessionAuthority({
						sessionId,
						sessionKeys: lifecycleIdentities
					});
				}
			});
			if (!reclaimedPlacement) throw new Error(`Session ${sessionKey} cloud worker stop barrier did not complete`);
			return reclaimedPlacement;
		},
		resolveWorkspacePath,
		workspaceOperations
	}));
	const sessionRetirement = createPlacementSessionRetirement({
		placements: params.placements,
		environments: params.environments,
		forceDestroyEnvironment: dispatchService.forceDestroyEnvironment,
		resolveSessionEvidence: resolveWorkerPlacementSessionEvidence,
		warn: params.warn
	});
	const nodeWorkspaceRetention = createNodeWorkspaceRetainCoordinator({
		gatewayNamespace: params.gatewayNamespace,
		placements: params.placements,
		environments: params.environments,
		warn: params.warn
	});
	const admissionProvider = createWorkerSessionTurnPlacementProvider({
		environments: params.environments,
		placements: params.placements,
		admitNewPlacements: params.admitNewPlacements,
		resolveWorkspacePath,
		recoverPendingWorkspaceResult: async (environmentId) => await dispatchService.reconcileActive(environmentId),
		redispatchReclaimed: createReclaimedPlacementRedispatch({
			environments: params.environments,
			dispatch: dispatchService.dispatch
		}),
		workspaceOperations
	});
	const recoverPendingWorkspaceReconciliations = async () => {
		const orphanedJournals = params.placements.pruneOrphanedWorkspaceReconciliations({ retainFailedOwner: (recoveryError) => recoveryError.startsWith(FORCED_WORKER_ABANDONMENT_ERROR) });
		for (const owner of orphanedJournals) workerPlacementLog.warn(`discarded orphaned cloud workspace journal for ${owner.sessionId}`);
		for (const owner of params.placements.listWorkspaceReconciliationOwners()) try {
			const placement = params.placements.get(owner.sessionId);
			if (placement?.state !== "active" && placement?.state !== "draining" || placement.environmentId !== owner.environmentId || placement.activeOwnerEpoch !== owner.ownerEpoch || placement.generation !== owner.placementGeneration) throw new Error(`Cloud workspace journal has no matching owner: ${owner.sessionId}`);
			const localPath = await resolveWorkspacePath({
				sessionId: placement.sessionId,
				sessionKey: placement.sessionKey,
				agentId: placement.agentId
			});
			const journal = params.placements.loadWorkspaceReconciliation(owner);
			if (!journal) continue;
			await recoverWorkerWorkspaceReconciliation({
				root: localPath,
				journal
			});
			params.placements.abortWorkspaceReconciliation(owner);
		} catch (error) {
			workerPlacementLog.error(`cloud workspace recovery deferred for ${owner.sessionId}: ${formatErrorMessage(error)}`);
		}
	};
	const startRuntime = async (hooks) => {
		const uninstallPlacementAdmission = installSessionPlacementAdmissionProvider(admissionProvider);
		let placementReconcileInterval;
		const placementReconcile = { current: void 0 };
		const diskSpaceSweep = { current: void 0 };
		let stopped = false;
		const trackOperation = (slot, current, failureMessage) => {
			slot.current = current;
			const clearCurrent = () => {
				if (slot.current === current) slot.current = void 0;
			};
			current.then(clearCurrent, (error) => {
				params.warn(`${failureMessage}: ${formatErrorMessage(error)}`);
				clearCurrent();
			});
			return current;
		};
		const reconcileActivePlacements = () => {
			if (stopped) return Promise.resolve();
			if (placementReconcile.current) return placementReconcile.current;
			return trackOperation(placementReconcile, (async () => {
				await sessionRetirement.reconcile();
				await dispatchService.reconcileActive();
				nodeWorkspaceRetention.schedule();
			})(), "Worker placement reconcile sweep failed");
		};
		const sweepDiskSpace = () => {
			if (stopped) return Promise.resolve();
			if (diskSpaceSweep.current) return diskSpaceSweep.current;
			return trackOperation(diskSpaceSweep, diskSpace.sweep(), "Worker disk-space sweep failed");
		};
		const sweepActivePlacements = () => {
			reconcileActivePlacements();
			sweepDiskSpace();
		};
		const uninstallSessionIdentityMutation = onSessionIdentityMutation((mutation) => {
			const previousSessionId = mutation.previous.sessionId;
			const currentSessionId = "current" in mutation ? mutation.current.sessionId : void 0;
			if (previousSessionId && previousSessionId !== currentSessionId) {
				const pending = placementReconcile.current;
				if (!pending) {
					reconcileActivePlacements();
					return;
				}
				pending.then(reconcileActivePlacements, reconcileActivePlacements);
			}
		});
		let stopPromise;
		const sidecar = { stop: () => {
			if (stopPromise) return stopPromise;
			stopped = true;
			clearInterval(placementReconcileInterval);
			placementReconcileInterval = void 0;
			uninstallSessionIdentityMutation();
			uninstallPlacementAdmission();
			stopPromise = (async () => {
				await Promise.allSettled([placementReconcile.current, diskSpaceSweep.current].filter((operation) => operation !== void 0));
				await nodeWorkspaceRetention.stop();
				await params.environments.stop();
			})();
			return stopPromise;
		} };
		hooks.registerSidecar(sidecar);
		const startupRecovery = recoverPendingWorkspaceReconciliations();
		placementReconcile.current = startupRecovery;
		try {
			await startupRecovery;
		} finally {
			if (placementReconcile.current === startupRecovery) placementReconcile.current = void 0;
		}
		if (hooks.isClosePreludeStarted()) {
			await sidecar.stop();
			return null;
		}
		const startupReconcile = (async () => {
			await dispatchService.reconcile();
			await sessionRetirement.reconcile();
		})();
		placementReconcile.current = startupReconcile;
		try {
			try {
				await startupReconcile;
			} finally {
				if (placementReconcile.current === startupReconcile) placementReconcile.current = void 0;
			}
			if (hooks.isClosePreludeStarted()) {
				await sidecar.stop();
				return null;
			}
			nodeWorkspaceRetention.start();
			if (hooks.isClosePreludeStarted()) {
				await sidecar.stop();
				return null;
			}
			params.environments.start();
			if (hooks.isClosePreludeStarted()) {
				await sidecar.stop();
				return null;
			}
			sweepDiskSpace();
			placementReconcileInterval = setInterval(sweepActivePlacements, WORKER_PLACEMENT_RECONCILE_INTERVAL_MS);
			placementReconcileInterval.unref?.();
			return sidecar;
		} catch (error) {
			await sidecar.stop();
			throw error;
		}
	};
	return {
		dispatchService,
		admissionProvider,
		diskSpace,
		placements: params.placements,
		resolveNodeWorkspaceBinding,
		bindNodeWorkerSupervisorTransport: (transport) => nodeWorkspaceRetention.bindTransport(transport),
		scheduleNodeWorkspaceRetention: (nodeId) => nodeWorkspaceRetention.schedule(nodeId),
		startRuntime
	};
}
//#endregion
export { createGatewayWorkerPlacementRuntime };
