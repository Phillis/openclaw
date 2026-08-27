import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
import { n as getRuntimeConfig } from "./io-DlN5njvP.js";
import { n as sha256Base64Url, o as sha256HexPrefixCore } from "./crypto-digest-IGAbV2KW.js";
import "./config-B2bSneS2.js";
import { t as jsonResult } from "./tool-results-BCM3fdVS.js";
import { a as withGatewayToolCallerIdentity, r as getGatewayToolCallerIdentity } from "./gateway-caller-context-D1DYQtHE.js";
import { C as withAgentToolGatewayRuntimeIdentity, b as callInProcessGatewayToolWithCreation, v as callAgentToolGatewayRequest } from "./sessions-helpers-Bafv8aOB.js";
import { x as buildSubagentExecutionSessionSpawnContext } from "./subagent-announce-output-FBD3gvKJ.js";
import { i as loadGatewaySessionEntryReadOnly } from "./session-utils-store-DtQnSTMm.js";
import "./session-utils-BTR52tOf.js";
import { a as createSessionsSendTool, l as formatPortalResult, s as runWithScopedSessionAccess, t as createSessionsSpawnTool } from "./sessions-spawn-tool-BqrrPqZS.js";
import { i as WORKER_TOOL_NAMES } from "./tool-authority-BfRQ7maz.js";
import { i as isCurrentPlacementTurnClaim } from "./placement-record-nLiaHmTd.js";
import { i as getWorkerTurnExecutionIdentityCapability } from "./placement-turn-claim-events-DXxC6aUk.js";
import { n as workerSessionToolErrorResult, t as serializeWorkerSessionToolResult } from "./worker-session-tool-result-wPAecg6D.js";
import { isDeepStrictEqual } from "node:util";
//#region src/gateway/worker-environments/worker-session-tool-topology.ts
function relationKey(value) {
	return value?.trim() || void 0;
}
function resolveWorkerSessionToolSource(params) {
	const identity = params.identity;
	const claim = identity.turnClaim;
	if (!identity.sessionId || !claim || claim.owner.kind !== "worker") throw new Error("Worker session operation requires an active source turn");
	const placement = params.placements.get(identity.sessionId);
	if (!placement || placement.state !== "active" && placement.state !== "draining" || !isCurrentPlacementTurnClaim(placement, claim)) throw new Error("Worker source session placement changed");
	const loaded = loadGatewaySessionEntryReadOnly(placement.sessionKey, { agentId: placement.agentId });
	if (loaded.canonicalKey !== placement.sessionKey || loaded.entry?.sessionId !== identity.sessionId || loaded.entry.archivedAt !== void 0) throw new Error("Worker source session incarnation changed");
	return {
		agentId: placement.agentId,
		sessionKey: placement.sessionKey,
		sessionId: identity.sessionId,
		turnClaim: {
			...claim,
			owner: claim.owner
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
//#region src/gateway/worker-environments/worker-portal-tool-executor.ts
/** Executes worker portals only while their exact placement and turn retain authority. */
function createWorkerPortalToolExecutor(params) {
	return async (request) => {
		const assertPortalAuthority = () => {
			const current = resolveWorkerSessionToolSource({
				identity: request.identity,
				placements: params.placements
			});
			if (!params.placements.isWorkerTurnToolAuthorized(current.turnClaim, "portal")) throw new Error("Worker session tool authority changed");
			const environment = params.environments.get(request.identity.environmentId);
			if (!environment || environment.state !== "attached" || environment.ownerEpoch !== request.identity.ownerEpoch || environment.attachedSessionIds.length !== 1 || environment.attachedSessionIds[0] !== current.sessionId) throw new Error("Worker source environment changed before portal operation");
			if (!environment.nodeDeviceId || environment.sshEndpoint !== null) throw new Error("Portals require a node-backed cloud-worker placement; move the session back to the gateway with sessions.move");
			return environment;
		};
		const environment = assertPortalAuthority();
		const service = params.portals.getService();
		if (!service) throw new Error("Gateway portals are unavailable");
		request.signal?.throwIfAborted();
		if (request.request.action === "list") {
			const result = { portals: service.listWorkerPortals(environment.environmentId, environment.ownerEpoch) };
			assertPortalAuthority();
			return { resultJson: serializeWorkerSessionToolResult(formatPortalResult({
				action: "list",
				result
			})) };
		}
		if (request.request.action === "close") {
			const id = request.request.id;
			if (!id) throw new Error("portal id required");
			if (!service.listWorkerPortals(environment.environmentId, environment.ownerEpoch).some((portal) => portal.id === id)) throw new Error("Worker portal is not owned by the active environment");
			await service.close(id, assertPortalAuthority);
			params.portals.onChanged();
			assertPortalAuthority();
			return { resultJson: serializeWorkerSessionToolResult(formatPortalResult({
				action: "close",
				id,
				result: { closed: true }
			})) };
		}
		const remotePort = request.request.port;
		if (remotePort === void 0) throw new Error("portal port required");
		const connection = await params.portals.carrier.open({
			environmentId: environment.environmentId,
			ownerEpoch: environment.ownerEpoch,
			remotePort
		});
		try {
			assertPortalAuthority();
			request.signal?.throwIfAborted();
		} catch (error) {
			await connection.close();
			throw error;
		}
		const opened = await service.open({
			targetPort: remotePort,
			assertCurrent: assertPortalAuthority,
			target: {
				kind: "worker",
				environmentId: environment.environmentId,
				ownerEpoch: environment.ownerEpoch,
				connect: connection.connect,
				remotePort
			},
			onClose: connection.close,
			origin: environment.profileId,
			...request.request.title !== void 0 ? { title: request.request.title } : {},
			...request.request.description !== void 0 ? { description: request.request.description } : {},
			...request.request.path !== void 0 ? { path: request.request.path } : {}
		});
		params.portals.onChanged();
		assertPortalAuthority();
		return { resultJson: serializeWorkerSessionToolResult(formatPortalResult({
			action: "open",
			result: opened
		})) };
	};
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
function childSessionKey(operationSeed, targetAgentId) {
	return `agent:${targetAgentId}:dashboard:cloud-${sha256HexPrefixCore(`openclaw.worker-session-tool-operation.v1\0${operationSeed}\0child-session`, 32)}`;
}
function createWorkerSessionToolExecutor(params) {
	const inFlight = /* @__PURE__ */ new Map();
	const executePortal = createWorkerPortalToolExecutor(params);
	const spawn = async (operation) => {
		operation.signal?.throwIfAborted();
		const sourceEnvironment = params.environments.get(operation.identity.environmentId);
		if (!sourceEnvironment || sourceEnvironment.state !== "attached" || sourceEnvironment.ownerEpoch !== operation.identity.ownerEpoch || !isDeepStrictEqual(sourceEnvironment.attachedSessionIds, [operation.source.sessionId])) throw new Error("Worker source environment changed before child spawn");
		const targetAgentId = normalizeAgentId(operation.request.agentId ?? operation.source.agentId);
		const authorizedTools = WORKER_TOOL_NAMES.filter((name) => params.placements.isWorkerTurnToolAuthorized(operation.source.turnClaim, name));
		const lineageCapability = getWorkerTurnExecutionIdentityCapability(params.placements, operation.source.turnClaim);
		let workerIdentity;
		const gatewayCall = async (method, requestParams) => {
			if (method !== "sessions.create") return await callAgentToolGatewayRequest({
				method,
				params: requestParams,
				...operation.signal ? { signal: operation.signal } : {},
				timeoutMs: null
			});
			operation.signal?.throwIfAborted();
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
					...operation.source.entry.permissionMode ? { permissionMode: operation.source.entry.permissionMode } : {},
					key: operation.childSessionKey
				};
				delete createParams.task;
				creationAttempted = true;
				try {
					createResponse = await callInProcessGatewayToolWithCreation("sessions.create", createParams, {
						via: "spawn",
						actor: {
							type: "agent",
							id: operation.source.agentId
						},
						requesterSessionKey: operation.source.sessionKey,
						inheritedToolPolicy: {
							version: 1,
							allow: authorizedTools,
							deny: []
						}
					}, {
						resolveGatewayContext: params.resolveGatewayContext,
						sessionMutationCommitGuard: () => resolveWorkerSessionToolSource({
							identity: operation.identity,
							placements: params.placements
						}),
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
				operation.signal?.throwIfAborted();
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
				operation.signal?.throwIfAborted();
				assertWorkerSessionToolChild({
					childSessionKey: operation.childSessionKey,
					childSessionId,
					sourceSessionKey: operation.source.sessionKey,
					sourceSessionId: operation.source.sessionId,
					targetAgentId
				});
				const childRunId = operationKey(operation.operationSeed, "initial-task");
				const config = getRuntimeConfig();
				const gatewayCaller = getGatewayToolCallerIdentity();
				const sessionSpawnContext = lineageCapability ? buildSubagentExecutionSessionSpawnContext({
					enabled: true,
					backend: "subagent",
					parentAgentId: operation.source.agentId,
					requesterRef: operation.source.sessionKey,
					controllerRef: operation.source.sessionKey,
					depth: (operation.source.entry.spawnDepth ?? 0) + 1,
					maxDepth: config.agents?.defaults?.subagents?.maxSpawnDepth ?? 1,
					targetAgentId,
					sandbox: "inherit",
					inheritedToolAllowlist: authorizedTools,
					inheritedToolDenylist: []
				}) : void 0;
				const run = await runWithScopedSessionAccess({
					cfg: config,
					expectedSessionId: childSessionId,
					targetSessionKey: operation.childSessionKey,
					...operation.signal ? { signal: operation.signal } : {},
					run: async () => {
						let sendResult;
						for (let attempt = 0; attempt < 2; attempt += 1) try {
							operation.signal?.throwIfAborted();
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
							const request = {
								method: "agent",
								agentRunTracking: "native_subagent",
								params: {
									sessionKey: operation.childSessionKey,
									sessionId: childSessionId,
									expectedExistingSessionId: childSessionId,
									message: operation.request.task,
									deliver: false,
									sessionEffects: "visible",
									idempotencyKey: `worker-session-spawn:${childRunId}`
								},
								...operation.signal ? { signal: operation.signal } : {},
								timeoutMs: null
							};
							sendResult = lineageCapability && workerIdentity ? await lineageCapability.run(async (identity) => {
								if (identity !== workerIdentity || gatewayCaller?.agentId !== identity.agentId || gatewayCaller.sessionKey !== identity.sessionKey || gatewayCaller.operationalRunInstance !== identity.operationalRunInstance || gatewayCaller.executionIdentityToken !== identity.executionIdentityToken || gatewayCaller.workerTurnClaim !== identity.turnClaim) throw new Error("worker child admission identity changed");
								return await callAgentToolGatewayRequest(withAgentToolGatewayRuntimeIdentity(request, {
									kind: "agentRuntime",
									agentId: identity.agentId,
									sessionKey: identity.sessionKey,
									operationalRunInstance: identity.operationalRunInstance,
									delegatedAuthority: {
										kind: "worker",
										...identity.delegatedAuthority,
										turnClaim: identity.turnClaim
									},
									executionIdentity: identity.executionIdentityToken,
									sessionSpawnContext
								}));
							}) : await callAgentToolGatewayRequest(request);
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
		const tool = createSessionsSpawnTool({
			agentSessionKey: operation.source.sessionKey,
			requesterTurnRunId: operation.identity.runId ?? void 0,
			requesterAgentIdOverride: operation.source.agentId,
			inheritedToolAllowlist: authorizedTools,
			inheritedToolDenylist: [],
			callGateway: gatewayCall,
			expectedParentSessionId: operation.source.sessionId,
			...operation.signal ? { signal: operation.signal } : {}
		});
		const executeSpawn = () => tool.execute(operation.request.toolCallId, {
			task: operation.request.task,
			...operation.request.label ? { label: operation.request.label } : {},
			...operation.request.agentId ? { agentId: operation.request.agentId } : {},
			...operation.request.model ? { model: operation.request.model } : {},
			...operation.request.runTimeoutSeconds === void 0 ? {} : { runTimeoutSeconds: operation.request.runTimeoutSeconds },
			expectsCompletionMessage: false,
			visible: true,
			worktree: true
		});
		return lineageCapability ? await lineageCapability.run(async (identity) => {
			workerIdentity = identity;
			try {
				return await withGatewayToolCallerIdentity({
					agentId: identity.agentId,
					sessionKey: identity.sessionKey,
					gatewayContextResolver: params.resolveGatewayContext,
					operationalRunInstance: identity.operationalRunInstance,
					executionIdentityToken: identity.executionIdentityToken,
					receiptAuthority: identity.receiptAuthority,
					workerTurnClaim: identity.turnClaim,
					workerTurnExecutionIdentityCapability: lineageCapability
				}, executeSpawn);
			} finally {
				workerIdentity = void 0;
			}
		}) : await withGatewayToolCallerIdentity({
			agentId: operation.source.agentId,
			sessionKey: operation.source.sessionKey,
			gatewayContextResolver: params.resolveGatewayContext
		}, executeSpawn);
	};
	const send = async (operation) => {
		operation.signal?.throwIfAborted();
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
				operation.signal?.throwIfAborted();
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
		if (request.toolName === "portal") return await executePortal(request);
		if (request.toolName === "github_publish") {
			const assertPublicationAuthority = () => {
				const current = resolveWorkerSessionToolSource({
					identity: request.identity,
					placements: params.placements
				});
				if (!params.placements.isWorkerTurnToolAuthorized(current.turnClaim, request.toolName)) throw new Error("Worker session tool authority changed");
			};
			assertPublicationAuthority();
			request.signal?.throwIfAborted();
			const publication = await params.githubPublication.requestForClaim({
				claim: source.turnClaim,
				sessionKey: source.sessionKey,
				agentId: source.agentId,
				idempotencyKey: request.request.toolCallId,
				...request.request.title ? { title: request.request.title } : {},
				...request.request.body ? { body: request.request.body } : {},
				assertCurrent: assertPublicationAuthority
			});
			assertPublicationAuthority();
			return { resultJson: serializeWorkerSessionToolResult(jsonResult(publication)) };
		}
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
			claim: source.turnClaim,
			toolName: request.toolName,
			toolCallId: request.request.toolCallId,
			requestDigest
		});
		if (started.kind === "completed") return { resultJson: started.resultJson };
		if (started.kind === "unknown") return { resultJson: serializeWorkerSessionToolResult(workerSessionToolErrorResult(/* @__PURE__ */ new Error("The prior operation outcome is unknown; it was not replayed"))) };
		if (started.kind === "conflict") return { resultJson: serializeWorkerSessionToolResult(workerSessionToolErrorResult(/* @__PURE__ */ new Error("Worker tool call id was reused"))) };
		if (started.kind === "capacity") return { resultJson: serializeWorkerSessionToolResult(workerSessionToolErrorResult(/* @__PURE__ */ new Error("Too many worker session operations are already in progress"))) };
		if (started.kind === "unauthorized") throw new Error("Worker session tool authority changed");
		const sourceClaimId = source.turnClaim.claimId;
		const inFlightKey = `${source.sessionId}\0${sourceClaimId}\0${request.request.toolCallId}`;
		if (started.kind === "in-progress") {
			const existing = inFlight.get(inFlightKey);
			return { resultJson: (existing ? await existing : void 0) ?? serializeWorkerSessionToolResult(workerSessionToolErrorResult(/* @__PURE__ */ new Error("Worker session operation is already in progress"))) };
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
					childKey = childSessionKey(started.operationSeed, targetAgentId);
					if (!params.placements.bindWorkerSessionToolOperationChild({
						sourceSessionId: source.sessionId,
						sourceClaimId,
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
						sourceClaimId,
						toolCallId: request.request.toolCallId,
						requestDigest
					})) return serializeWorkerSessionToolResult(workerSessionToolErrorResult(/* @__PURE__ */ new Error("Worker session operation lost ownership")));
					return serializeWorkerSessionToolResult(workerSessionToolErrorResult(error instanceof WorkerSessionToolOutcomeUnknownError ? error : /* @__PURE__ */ new Error("Worker session operation outcome is unknown after cancellation")));
				}
				failed = true;
				result = workerSessionToolErrorResult(error);
			}
			const resultJson = serializeWorkerSessionToolResult(result);
			if (!params.placements.completeWorkerSessionToolOperation({
				sourceSessionId: source.sessionId,
				sourceClaimId,
				toolCallId: request.request.toolCallId,
				requestDigest,
				resultJson,
				failed
			})) return serializeWorkerSessionToolResult(workerSessionToolErrorResult(/* @__PURE__ */ new Error("Worker session operation lost ownership")));
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
