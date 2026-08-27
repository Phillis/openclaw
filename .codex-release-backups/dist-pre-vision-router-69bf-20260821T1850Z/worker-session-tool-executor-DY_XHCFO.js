import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { c as redactSensitiveText } from "./redact-DP7p9QfH.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { r as getRuntimeConfig } from "./io-BTBpQ7uO.js";
import { n as sha256Base64Url } from "./crypto-digest-PR8Utwzg.js";
import "./config-CfeGo4K4.js";
import "./worker-admission-R0mXKdG7.js";
import { t as jsonResult } from "./tool-results-BCM3fdVS.js";
import { E as loadGatewaySessionEntryReadOnly } from "./session-utils-row-xwseApeF.js";
import "./session-utils-DvNvk7rk.js";
import { g as callInProcessGatewayToolWithCreation, m as callAgentToolGatewayRequest } from "./sessions-helpers-DkT3wqUw.js";
import { a as runWithScopedSessionAccess, r as createSessionsSendTool, t as createSessionsSpawnTool } from "./sessions-spawn-tool-5xd0wTD0.js";
import { i as WORKER_TOOL_NAMES } from "./tool-authority-DJXVjqm0.js";
import { isDeepStrictEqual } from "node:util";
//#region src/gateway/worker-environments/worker-session-tool-topology.ts
function relationKey(value) {
	return value?.trim() || void 0;
}
function resolveWorkerSessionToolSource(params) {
	const identity = params.identity;
	if (!identity.sessionId || !identity.runId) throw new Error("Worker session operation requires an active source turn");
	const placement = params.placements.get(identity.sessionId);
	if (!placement || placement.state !== "active" && placement.state !== "draining" || placement.environmentId !== identity.environmentId || placement.activeOwnerEpoch !== identity.ownerEpoch || placement.turnClaim?.owner !== "worker" || placement.turnClaim.runId !== identity.runId || placement.turnClaim.ownerEpoch !== identity.ownerEpoch) throw new Error("Worker source session placement changed");
	const loaded = loadGatewaySessionEntryReadOnly(placement.sessionKey, { agentId: placement.agentId });
	if (loaded.canonicalKey !== placement.sessionKey || loaded.entry?.sessionId !== identity.sessionId || loaded.entry.archivedAt !== void 0) throw new Error("Worker source session incarnation changed");
	return {
		agentId: placement.agentId,
		sessionKey: placement.sessionKey,
		sessionId: identity.sessionId,
		binding: {
			sessionId: identity.sessionId,
			agentId: placement.agentId,
			sessionKey: placement.sessionKey,
			environmentId: identity.environmentId,
			ownerEpoch: identity.ownerEpoch,
			runId: identity.runId
		},
		entry: loaded.entry
	};
}
function resolveWorkerSessionToolTarget(params) {
	const loaded = loadGatewaySessionEntryReadOnly(params.requestedSessionKey);
	const entry = loaded.entry;
	const targetSessionId = entry?.sessionId;
	if (loaded.canonicalKey !== params.requestedSessionKey || !targetSessionId || !entry || entry.archivedAt !== void 0 || targetSessionId === params.source.sessionId) throw new Error("Worker sessions_send target is not an exact live session");
	const sourceParent = relationKey(params.source.entry.parentSessionKey) ?? relationKey(params.source.entry.spawnedBy);
	const sourceParentId = relationKey(params.source.entry.parentSessionId);
	const targetParent = relationKey(entry.parentSessionKey) ?? relationKey(entry.spawnedBy);
	const targetParentId = relationKey(entry.parentSessionId);
	const parentToChild = targetParent === params.source.sessionKey && targetParentId === params.source.sessionId;
	const childToParent = sourceParent === loaded.canonicalKey && sourceParentId === targetSessionId;
	const parent = Boolean(sourceParent && sourceParentId && sourceParent === targetParent && sourceParentId === targetParentId) && sourceParent && sourceParentId ? loadGatewaySessionEntryReadOnly(sourceParent) : void 0;
	const siblingToSibling = Boolean(parent && parent.canonicalKey === sourceParent && parent.entry?.sessionId === sourceParentId && parent.entry?.archivedAt === void 0);
	if (!parentToChild && !childToParent && !siblingToSibling) throw new Error("Worker sessions_send target is outside the authorized session tree");
	const targetPlacement = params.placements.get(targetSessionId);
	if (!targetPlacement || targetPlacement.state !== "active" || targetPlacement.sessionKey !== loaded.canonicalKey) throw new Error("Worker sessions_send target is not an active cloud session incarnation");
	return {
		agentId: targetPlacement.agentId,
		sessionKey: targetPlacement.sessionKey,
		sessionId: targetPlacement.sessionId,
		...siblingToSibling && sourceParent && sourceParentId ? { topologyParent: {
			sessionKey: sourceParent,
			sessionId: sourceParentId
		} } : {}
	};
}
function assertWorkerSessionToolChild(params) {
	const loaded = loadGatewaySessionEntryReadOnly(params.childSessionKey, { agentId: params.targetAgentId });
	const parent = relationKey(loaded.entry?.parentSessionKey) ?? relationKey(loaded.entry?.spawnedBy);
	const parentSessionId = relationKey(loaded.entry?.parentSessionId);
	if (loaded.canonicalKey !== params.childSessionKey || loaded.entry?.sessionId !== params.childSessionId || loaded.entry.archivedAt !== void 0 || parent !== params.sourceSessionKey || parentSessionId !== params.sourceSessionId) throw new Error("Spawned cloud child session incarnation changed");
}
//#endregion
//#region src/gateway/worker-environments/worker-session-tool-executor.ts
var WorkerSessionToolOutcomeUnknownError = class extends Error {
	constructor(cause) {
		super("Worker session operation outcome is unknown; it was not replayed", { cause });
		this.name = "WorkerSessionToolOutcomeUnknownError";
	}
};
function computeRequestDigest(value) {
	return sha256Base64Url(`openclaw.worker-session-tool-request.v1\0${JSON.stringify(value)}`);
}
function operationKey(operationSeed, purpose) {
	return sha256Base64Url(`openclaw.worker-session-tool-operation.v1\0${operationSeed}\0${purpose}`);
}
function errorResult(error) {
	return jsonResult({
		status: "error",
		error: truncateUtf16Safe(redactSensitiveText(error instanceof Error ? error.message : "Worker session operation failed", { mode: "tools" }), 1024)
	});
}
function responseFrameBytes(resultJson) {
	return Buffer.byteLength(JSON.stringify({
		type: "res",
		id: "x".repeat(128),
		ok: true,
		payload: { resultJson }
	}), "utf8");
}
function serializeResult(result) {
	const resultJson = JSON.stringify(result);
	if (responseFrameBytes(resultJson) > 65536) return JSON.stringify(errorResult(/* @__PURE__ */ new Error("Worker session tool result exceeded the limit")));
	return resultJson;
}
function throwIfAborted(signal) {
	signal?.throwIfAborted();
}
function childSessionKey(params) {
	const suffix = operationKey(params.operationSeed, "child-session").slice(0, 32);
	return `agent:${params.targetAgentId}:dashboard:cloud-${suffix}`;
}
function createWorkerSessionToolExecutor(params) {
	const inFlight = /* @__PURE__ */ new Map();
	const spawn = async (operation) => {
		throwIfAborted(operation.signal);
		const sourceEnvironment = params.environments.get(operation.identity.environmentId);
		if (!sourceEnvironment || sourceEnvironment.state !== "attached" || sourceEnvironment.ownerEpoch !== operation.identity.ownerEpoch || sourceEnvironment.attachedSessionIds.length !== 1 || sourceEnvironment.attachedSessionIds[0] !== operation.source.sessionId) throw new Error("Worker source environment changed before child spawn");
		const targetAgentId = normalizeAgentId(operation.request.agentId ?? operation.source.agentId);
		const authorizedTools = WORKER_TOOL_NAMES.filter((name) => params.placements.isWorkerTurnToolAuthorized(operation.source.binding, name));
		const gatewayCall = async (method, requestParams) => {
			if (method !== "sessions.create") return await callAgentToolGatewayRequest({
				method,
				params: requestParams,
				...operation.signal ? { signal: operation.signal } : {},
				timeoutMs: null
			});
			throwIfAborted(operation.signal);
			resolveWorkerSessionToolSource({
				identity: operation.identity,
				placements: params.placements
			});
			let loaded = loadGatewaySessionEntryReadOnly(operation.childSessionKey, { agentId: targetAgentId });
			let createResponse;
			let creationAttempted = false;
			if (loaded.entry?.sessionId) {
				const parent = relationKey(loaded.entry.parentSessionKey) ?? relationKey(loaded.entry.spawnedBy);
				const parentSessionId = relationKey(loaded.entry.parentSessionId);
				if (loaded.canonicalKey !== operation.childSessionKey || parent !== operation.source.sessionKey || parentSessionId !== operation.source.sessionId) throw new Error("Cloud child idempotency key is already owned by another session");
				createResponse = {
					ok: true,
					key: loaded.canonicalKey,
					sessionId: loaded.entry.sessionId,
					entry: loaded.entry
				};
			} else {
				const createParams = {
					...requestParams,
					key: operation.childSessionKey
				};
				delete createParams.task;
				creationAttempted = true;
				try {
					createResponse = await callInProcessGatewayToolWithCreation("sessions.create", createParams, {
						via: "spawn",
						actor: {
							type: "agent",
							id: operation.source.sessionKey
						},
						inheritedToolPolicy: {
							version: 1,
							allow: authorizedTools,
							deny: []
						}
					}, {
						...operation.signal ? { signal: operation.signal } : {},
						timeoutMs: null
					});
				} catch (error) {
					loaded = loadGatewaySessionEntryReadOnly(operation.childSessionKey, { agentId: targetAgentId });
					if (!loaded.entry?.sessionId) throw error;
					createResponse = {
						ok: true,
						key: loaded.canonicalKey,
						sessionId: loaded.entry.sessionId,
						entry: loaded.entry
					};
				}
				loaded = loadGatewaySessionEntryReadOnly(operation.childSessionKey, { agentId: targetAgentId });
			}
			const childSessionId = loaded.entry?.sessionId;
			if (!childSessionId) {
				const error = /* @__PURE__ */ new Error("Cloud child session creation did not persist an incarnation");
				throw creationAttempted ? new WorkerSessionToolOutcomeUnknownError(error) : error;
			}
			try {
				assertWorkerSessionToolChild({
					childSessionKey: operation.childSessionKey,
					childSessionId,
					sourceSessionKey: operation.source.sessionKey,
					sourceSessionId: operation.source.sessionId,
					targetAgentId
				});
			} catch (error) {
				if (creationAttempted) throw new WorkerSessionToolOutcomeUnknownError(error);
				throw error;
			}
			try {
				const assertActiveChildPlacement = () => {
					const placement = params.placements.get(childSessionId);
					if (placement?.state !== "active" || placement.sessionKey !== operation.childSessionKey) throw new Error("Cloud child placement did not become active");
					const environment = params.environments.get(placement.environmentId);
					if (environment?.state !== "attached" || environment.ownerEpoch !== placement.activeOwnerEpoch || environment.attachedSessionIds.length !== 1 || environment.attachedSessionIds[0] !== childSessionId || environment.profileId !== sourceEnvironment.profileId || environment.providerId !== sourceEnvironment.providerId || !isDeepStrictEqual(environment.profileSnapshot, sourceEnvironment.profileSnapshot)) throw new Error("Cloud child placement does not match its parent profile");
				};
				const childPlacement = params.placements.get(childSessionId);
				throwIfAborted(operation.signal);
				resolveWorkerSessionToolSource({
					identity: operation.identity,
					placements: params.placements
				});
				if (childPlacement?.state !== "active") try {
					await params.dispatchChild({
						sessionId: childSessionId,
						sessionKey: operation.childSessionKey,
						agentId: targetAgentId,
						profileId: sourceEnvironment.profileId,
						executionMode: "worker-turn",
						inheritedProfile: {
							providerId: sourceEnvironment.providerId,
							profileSnapshot: sourceEnvironment.profileSnapshot
						}
					});
				} catch (error) {
					try {
						assertActiveChildPlacement();
					} catch {
						throw new WorkerSessionToolOutcomeUnknownError(error);
					}
				}
				assertActiveChildPlacement();
				resolveWorkerSessionToolSource({
					identity: operation.identity,
					placements: params.placements
				});
				throwIfAborted(operation.signal);
				assertWorkerSessionToolChild({
					childSessionKey: operation.childSessionKey,
					childSessionId,
					sourceSessionKey: operation.source.sessionKey,
					sourceSessionId: operation.source.sessionId,
					targetAgentId
				});
				const childRunId = operationKey(operation.operationSeed, "initial-task");
				const run = await runWithScopedSessionAccess({
					cfg: getRuntimeConfig(),
					expectedSessionId: childSessionId,
					targetSessionKey: operation.childSessionKey,
					...operation.signal ? { signal: operation.signal } : {},
					run: async () => {
						let sendResult;
						for (let attempt = 0; attempt < 2; attempt += 1) try {
							throwIfAborted(operation.signal);
							resolveWorkerSessionToolSource({
								identity: operation.identity,
								placements: params.placements
							});
							assertWorkerSessionToolChild({
								childSessionKey: operation.childSessionKey,
								childSessionId,
								sourceSessionKey: operation.source.sessionKey,
								sourceSessionId: operation.source.sessionId,
								targetAgentId
							});
							assertActiveChildPlacement();
							sendResult = await callAgentToolGatewayRequest({
								method: "chat.send",
								params: {
									sessionKey: operation.childSessionKey,
									sessionId: childSessionId,
									message: operation.request.task,
									idempotencyKey: `worker-session-spawn:${childRunId}`
								},
								...operation.signal ? { signal: operation.signal } : {},
								timeoutMs: null
							});
							break;
						} catch (error) {
							if (attempt === 1) throw new WorkerSessionToolOutcomeUnknownError(error);
						}
						if (!sendResult) throw new WorkerSessionToolOutcomeUnknownError(/* @__PURE__ */ new Error("Cloud child initial task did not return a result"));
						return sendResult;
					}
				});
				const runId = typeof run.runId === "string" ? run.runId : void 0;
				return {
					...createResponse,
					...run,
					runStarted: Boolean(runId),
					...runId ? { runId } : {}
				};
			} catch (error) {
				throw error instanceof WorkerSessionToolOutcomeUnknownError ? error : new WorkerSessionToolOutcomeUnknownError(error);
			}
		};
		return await createSessionsSpawnTool({
			agentSessionKey: operation.source.sessionKey,
			requesterTurnRunId: operation.identity.runId ?? void 0,
			requesterAgentIdOverride: operation.source.agentId,
			inheritedToolAllowlist: authorizedTools,
			inheritedToolDenylist: [],
			callGateway: gatewayCall,
			expectedParentSessionId: operation.source.sessionId,
			...operation.signal ? { signal: operation.signal } : {}
		}).execute(operation.request.toolCallId, {
			task: operation.request.task,
			...operation.request.label ? { label: operation.request.label } : {},
			...operation.request.agentId ? { agentId: operation.request.agentId } : {},
			...operation.request.model ? { model: operation.request.model } : {},
			...operation.request.runTimeoutSeconds === void 0 ? {} : { runTimeoutSeconds: operation.request.runTimeoutSeconds },
			visible: true,
			worktree: true
		});
	};
	const send = async (operation) => {
		throwIfAborted(operation.signal);
		resolveWorkerSessionToolSource({
			identity: operation.identity,
			placements: params.placements
		});
		const config = getRuntimeConfig();
		const executeFencedSend = async () => {
			const assertCurrentTarget = () => {
				const target = resolveWorkerSessionToolTarget({
					source: operation.source,
					requestedSessionKey: operation.request.sessionKey,
					placements: params.placements
				});
				if (target.sessionId !== operation.target.sessionId || target.topologyParent?.sessionKey !== operation.target.topologyParent?.sessionKey || target.topologyParent?.sessionId !== operation.target.topologyParent?.sessionId) throw new Error("Worker sessions_send target incarnation changed");
			};
			assertCurrentTarget();
			const tool = createSessionsSendTool({
				agentSessionKey: operation.source.sessionKey,
				expectedTargetSessionId: operation.target.sessionId,
				idempotencyKey: operation.idempotencyKey,
				config,
				...operation.signal ? { signal: operation.signal } : {},
				callGateway: (request) => callAgentToolGatewayRequest({
					...request,
					...operation.signal ? { signal: operation.signal } : {}
				})
			});
			for (let attempt = 0; attempt < 2; attempt += 1) try {
				throwIfAborted(operation.signal);
				resolveWorkerSessionToolSource({
					identity: operation.identity,
					placements: params.placements
				});
				assertCurrentTarget();
				return await tool.execute(operation.request.toolCallId, {
					sessionKey: operation.target.sessionKey,
					message: operation.request.message,
					...operation.request.timeoutSeconds === void 0 ? {} : { timeoutSeconds: operation.request.timeoutSeconds }
				});
			} catch (error) {
				if (attempt === 1) throw new WorkerSessionToolOutcomeUnknownError(error);
			}
			throw new WorkerSessionToolOutcomeUnknownError(/* @__PURE__ */ new Error("Worker sessions_send did not return a result"));
		};
		const topologyParent = operation.target.topologyParent;
		if (!topologyParent) return await executeFencedSend();
		return await runWithScopedSessionAccess({
			cfg: config,
			expectedSessionId: topologyParent.sessionId,
			targetSessionKey: topologyParent.sessionKey,
			...operation.signal ? { signal: operation.signal } : {},
			run: executeFencedSend
		});
	};
	return async (request) => {
		const source = resolveWorkerSessionToolSource({
			identity: request.identity,
			placements: params.placements
		});
		const requestDigest = computeRequestDigest(request.toolName === "sessions_spawn" ? {
			toolName: request.toolName,
			sourceSessionId: source.sessionId,
			task: request.request.task,
			label: request.request.label ?? null,
			agentId: request.request.agentId ?? null,
			model: request.request.model ?? null,
			runTimeoutSeconds: request.request.runTimeoutSeconds ?? null
		} : {
			toolName: request.toolName,
			sourceSessionId: source.sessionId,
			sessionKey: request.request.sessionKey,
			message: request.request.message,
			timeoutSeconds: request.request.timeoutSeconds ?? null
		});
		const started = params.placements.beginWorkerSessionToolOperation({
			binding: source.binding,
			toolName: request.toolName,
			toolCallId: request.request.toolCallId,
			requestDigest
		});
		if (started.kind === "completed") return { resultJson: started.resultJson };
		if (started.kind === "unknown") return { resultJson: serializeResult(errorResult(/* @__PURE__ */ new Error("The prior operation outcome is unknown; it was not replayed"))) };
		if (started.kind === "conflict") return { resultJson: serializeResult(errorResult(/* @__PURE__ */ new Error("Worker tool call id was reused"))) };
		if (started.kind === "capacity") return { resultJson: serializeResult(errorResult(/* @__PURE__ */ new Error("Too many worker session operations are already in progress"))) };
		if (started.kind === "unauthorized") throw new Error("Worker session tool authority changed");
		const inFlightKey = `${source.sessionId}\0${started.claimId}\0${request.request.toolCallId}`;
		if (started.kind === "in-progress") {
			const existing = inFlight.get(inFlightKey);
			return { resultJson: (existing ? await existing : void 0) ?? serializeResult(errorResult(/* @__PURE__ */ new Error("Worker session operation is already in progress"))) };
		}
		const operation = (async () => {
			let result;
			let failed = false;
			try {
				const target = request.toolName === "sessions_send" ? resolveWorkerSessionToolTarget({
					source,
					requestedSessionKey: request.request.sessionKey,
					placements: params.placements
				}) : void 0;
				let childKey = started.childSessionKey;
				if (request.toolName === "sessions_spawn" && !childKey) {
					const targetAgentId = normalizeAgentId(request.request.agentId ?? source.agentId);
					childKey = childSessionKey({
						operationSeed: started.operationSeed,
						targetAgentId
					});
					if (!params.placements.bindWorkerSessionToolOperationChild({
						sourceSessionId: source.sessionId,
						sourceClaimId: started.claimId,
						toolCallId: request.request.toolCallId,
						requestDigest,
						childSessionKey: childKey
					})) throw new Error("Worker child spawn operation changed before execution");
				}
				result = request.toolName === "sessions_spawn" ? await spawn({
					source,
					identity: request.identity,
					request: request.request,
					operationSeed: started.operationSeed,
					childSessionKey: childKey,
					...request.signal ? { signal: request.signal } : {}
				}) : await send({
					source,
					identity: request.identity,
					target,
					request: request.request,
					idempotencyKey: `worker-session-send:${operationKey(started.operationSeed, "target-send")}`,
					...request.signal ? { signal: request.signal } : {}
				});
			} catch (error) {
				if (error instanceof WorkerSessionToolOutcomeUnknownError || request.signal?.aborted) {
					if (!params.placements.abandonWorkerSessionToolOperation({
						sourceSessionId: source.sessionId,
						sourceClaimId: started.claimId,
						toolCallId: request.request.toolCallId,
						requestDigest
					})) return serializeResult(errorResult(/* @__PURE__ */ new Error("Worker session operation lost ownership")));
					return serializeResult(errorResult(error instanceof WorkerSessionToolOutcomeUnknownError ? error : /* @__PURE__ */ new Error("Worker session operation outcome is unknown after cancellation")));
				}
				failed = true;
				result = errorResult(error);
			}
			const resultJson = serializeResult(result);
			if (!params.placements.completeWorkerSessionToolOperation({
				sourceSessionId: source.sessionId,
				sourceClaimId: started.claimId,
				toolCallId: request.request.toolCallId,
				requestDigest,
				resultJson,
				failed
			})) return serializeResult(errorResult(/* @__PURE__ */ new Error("Worker session operation lost ownership")));
			return resultJson;
		})();
		inFlight.set(inFlightKey, operation);
		try {
			return { resultJson: await operation };
		} finally {
			if (inFlight.get(inFlightKey) === operation) inFlight.delete(inFlightKey);
		}
	};
}
//#endregion
export { createWorkerSessionToolExecutor };
