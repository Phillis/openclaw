import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import "./agent-scope-DigoIwHb.js";
import { C as tryResolveLegacyCompatibilityAgentId } from "./agent-scope-config-CUBiGmG3.js";
import { a as isSubagentSessionKey, c as parseAgentSessionKey } from "./session-key-utils-Di3FvABa.js";
import { o as resolveSessionStorePathCore } from "./paths-DVAvlIOc.js";
import { a as hasGatewayClientCap, t as GATEWAY_CLIENT_CAPS } from "./client-info-UYcIi_5g.js";
import { t as ErrorCodes } from "./gateway-error-details-C2IaYyht.js";
import { f as loadSessionEntry } from "./session-accessor.sqlite-entry-CNdoUuFZ.js";
import "./session-accessor-B-FKZX9M.js";
import "./sessions-CdrF1uzY.js";
import { d as errorShape } from "./validation-errors-rELRlKfn.js";
import { d as shouldPreserveUserFacingSessionStateForInputProvenance, l as isMainSessionRestartRecoveryInputProvenance, u as normalizeInputProvenance } from "./input-provenance-CCQsDhUy.js";
import { b as findSwarmCollectorSession, y as findAuthorizedSwarmCollectorRequest } from "./subagent-registry.store.sqlite-C0InRbpL.js";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-C9E8iDY4.js";
import { t as resolveSwarmConfig } from "./swarm-config-Df_H07Y6.js";
import { n as validateStructuredOutputSchema } from "./sessions-spawn-tool-BqrrPqZS.js";
import { n as normalizeSpawnedRunMetadata } from "./spawned-context-CcwhpB50.js";
import { a as parseExecApprovalFollowupApprovalId } from "./bash-tools.exec-approval-followup-state-CiA8RPlH.js";
import { a as readGatewayDedupeEntry, c as resolveCanUseCronRunContinuation, i as resolveExpectedExistingSessionConstraint, l as resolveCanUseInternalRuntimeHandoff, o as resolveAgentDedupeKeys, s as resolveAllowModelOverrideFromClient } from "./agent-turn-service-Wx3yeHr7.js";
import { i as transferGatewayLocalUserIngress } from "./local-user-ingress-Ci8q8U5g.js";
import path from "node:path";
//#region src/gateway/agent-turn/agent-request-preflight.ts
function prepareAgentRequestPreflight(params) {
	const { request } = params;
	const cfg = params.context.getRuntimeConfig();
	const canUseInternalRuntimeHandoff = resolveCanUseInternalRuntimeHandoff(params.client);
	const requestSessionKey = request.sessionKey?.trim();
	const parsedRequestSessionKey = requestSessionKey ? parseAgentSessionKey(requestSessionKey) : void 0;
	const bareSessionAgent = requestSessionKey && !parsedRequestSessionKey ? resolveRequestedSessionAgentId(cfg, requestSessionKey, request.agentId) : void 0;
	if (bareSessionAgent && !bareSessionAgent.ok) {
		params.io.emitAcceptance([
			false,
			void 0,
			bareSessionAgent.error
		]);
		return;
	}
	const selectedAgentId = requestSessionKey ? parsedRequestSessionKey?.agentId ?? bareSessionAgent?.agentId ?? normalizeOptionalString(request.agentId) ?? tryResolveLegacyCompatibilityAgentId(cfg) : normalizeOptionalString(request.agentId) ?? tryResolveLegacyCompatibilityAgentId(cfg);
	const collectorSession = findSwarmCollectorSession(requestSessionKey);
	const persistedCollectorSession = !collectorSession && requestSessionKey && isSubagentSessionKey(requestSessionKey) ? loadSessionEntry({
		...selectedAgentId ? { agentId: selectedAgentId } : {},
		storePath: resolveSessionStorePathCore(cfg.session?.store, { agentId: selectedAgentId }),
		sessionKey: requestSessionKey
	})?.swarmCollector === true : false;
	if (collectorSession || persistedCollectorSession || request.swarmCollector === true || request.swarmOutputSchema !== void 0) {
		const schemaError = request.swarmOutputSchema ? validateStructuredOutputSchema(request.swarmOutputSchema) : void 0;
		if (request.swarmCollector !== true || schemaError) {
			params.io.emitAcceptance([
				false,
				void 0,
				errorShape(ErrorCodes.INVALID_REQUEST, schemaError ?? "active swarm collector sessions require swarmCollector=true")
			]);
			return;
		}
		const registeredCollector = findAuthorizedSwarmCollectorRequest({
			childSessionKey: request.sessionKey,
			idempotencyKey: request.idempotencyKey,
			outputSchema: request.swarmOutputSchema
		});
		const collectorDedupe = readGatewayDedupeEntry({
			dedupe: params.context.dedupe,
			keys: resolveAgentDedupeKeys({ idempotencyKey: request.idempotencyKey })
		});
		const swarmRequesterSessionKey = registeredCollector?.swarmRequesterSessionKey ?? registeredCollector?.requesterSessionKey;
		const swarmEnabled = resolveSwarmConfig(cfg, registeredCollector?.requesterAgentId ?? (swarmRequesterSessionKey ? parseAgentSessionKey(swarmRequesterSessionKey)?.agentId ?? selectedAgentId : selectedAgentId)).enabled;
		const pendingCollectorLaunch = registeredCollector?.swarmLaunchPending === true && !registeredCollector.collectorCompletion && typeof registeredCollector.execution.endedAt !== "number";
		if (!swarmEnabled && !collectorDedupe || !canUseInternalRuntimeHandoff || request.lane !== "subagent" || !registeredCollector || !pendingCollectorLaunch && !collectorDedupe) {
			params.io.emitAcceptance([
				false,
				void 0,
				errorShape(ErrorCodes.INVALID_REQUEST, "swarm collector fields require an enabled, host-registered collector run")
			]);
			return;
		}
	}
	if (request.cwd && !path.isAbsolute(request.cwd)) {
		params.io.emitAcceptance([
			false,
			void 0,
			errorShape(ErrorCodes.INVALID_REQUEST, "cwd must be absolute")
		]);
		return;
	}
	if (request.cwd && !normalizeOptionalString(params.client?.internal?.pluginRuntimeOwnerId)) {
		params.io.emitAcceptance([
			false,
			void 0,
			errorShape(ErrorCodes.INVALID_REQUEST, "cwd is reserved for plugin-owned subagent runs")
		]);
		return;
	}
	const allowModelOverride = resolveAllowModelOverrideFromClient(params.client);
	const canUseCronRunContinuation = resolveCanUseCronRunContinuation(params.client);
	const expectedSessionResult = resolveExpectedExistingSessionConstraint({
		canUseInternalRuntimeHandoff,
		expectedExistingSessionId: request.expectedExistingSessionId,
		internalRuntimeHandoffId: request.internalRuntimeHandoffId
	});
	if (!expectedSessionResult.ok) {
		params.io.emitAcceptance([
			false,
			void 0,
			errorShape(ErrorCodes.INVALID_REQUEST, expectedSessionResult.error)
		]);
		return;
	}
	const requestedPromptPersistenceSuppression = request.suppressPromptPersistence === true;
	const requestedInternalSessionEffects = request.sessionEffects === "internal";
	const requestedModelOverride = Boolean(request.provider || request.model);
	const isOneShotModelRun = request.modelRun === true;
	const isRawModelRun = isOneShotModelRun || request.promptMode === "none";
	if (request.promptMode === "none" && !isOneShotModelRun) {
		params.io.emitAcceptance([
			false,
			void 0,
			errorShape(ErrorCodes.INVALID_REQUEST, "promptMode=\"none\" requires modelRun=true so the run cannot mutate a durable session.")
		]);
		return;
	}
	if (requestedModelOverride && !allowModelOverride) {
		params.io.emitAcceptance([
			false,
			void 0,
			errorShape(ErrorCodes.INVALID_REQUEST, "provider/model overrides are not authorized for this caller.")
		]);
		return;
	}
	if ((requestedInternalSessionEffects || requestedPromptPersistenceSuppression) && !canUseInternalRuntimeHandoff) {
		params.io.emitAcceptance([
			false,
			void 0,
			errorShape(ErrorCodes.INVALID_REQUEST, "internal session-effect controls are reserved for backend callers.")
		]);
		return;
	}
	const runId = request.idempotencyKey;
	const execApprovalFollowupApprovalId = parseExecApprovalFollowupApprovalId(runId);
	if (execApprovalFollowupApprovalId && !canUseInternalRuntimeHandoff) {
		params.io.emitAcceptance([
			false,
			void 0,
			errorShape(ErrorCodes.INVALID_REQUEST, "exec approval followup idempotency keys are reserved for backend callers.")
		]);
		return;
	}
	const inputProvenance = normalizeInputProvenance(request.inputProvenance);
	const isRestartRecoveryResumeRun = canUseInternalRuntimeHandoff && isMainSessionRestartRecoveryInputProvenance(inputProvenance);
	if ((request.internalExecutionIdentityRetry !== void 0 || request.internalExecutionIdentityRecoveryAttempt !== void 0) && !isRestartRecoveryResumeRun) {
		params.io.emitAcceptance([
			false,
			void 0,
			errorShape(ErrorCodes.INVALID_REQUEST, "internal execution identity recovery fields are reserved for main-session restart recovery.")
		]);
		return;
	}
	if (request.forceCodeModeTools === true && !isRestartRecoveryResumeRun) {
		params.io.emitAcceptance([
			false,
			void 0,
			errorShape(ErrorCodes.INVALID_REQUEST, "forceCodeModeTools is reserved for main-session restart recovery.")
		]);
		return;
	}
	const sessionEffects = isOneShotModelRun || requestedInternalSessionEffects ? "internal" : request.sessionEffects;
	const agentDedupeKeys = resolveAgentDedupeKeys({
		idempotencyKey: runId,
		execApprovalFollowupApprovalId
	});
	return {
		request,
		cfg,
		runId,
		allowModelOverride,
		canUseInternalRuntimeHandoff,
		canUseCronRunContinuation,
		expectedSession: expectedSessionResult.constraint,
		expectedExistingSessionId: expectedSessionResult.constraint?.sessionId,
		providerOverride: allowModelOverride ? request.provider : void 0,
		modelOverride: allowModelOverride ? request.model : void 0,
		execApprovalFollowupApprovalId,
		normalizedSpawned: normalizeSpawnedRunMetadata({
			groupId: request.groupId,
			groupChannel: request.groupChannel,
			groupSpace: request.groupSpace
		}),
		inputProvenance,
		isRestartRecoveryResumeRun,
		preserveUserFacingSessionModelState: canUseInternalRuntimeHandoff && shouldPreserveUserFacingSessionStateForInputProvenance(inputProvenance),
		sessionEffects,
		suppressVisibleSessionEffects: sessionEffects === "internal",
		requestedPromptPersistenceSuppression,
		isOneShotModelRun,
		isRawModelRun,
		agentDedupeKeys
	};
}
//#endregion
//#region src/gateway/agent-turn/principal.ts
/** Captures the transport identity without rebuilding its trusted metadata. */
function captureAgentTurnPrincipal(client) {
	if (!client) return null;
	const principal = {
		authenticatedUserId: client.authenticatedUserId,
		authenticatedUserProfile: client.authenticatedUserProfile,
		connId: client.connId,
		connect: client.connect,
		internal: client.internal,
		isDeviceTokenAuth: client.isDeviceTokenAuth
	};
	transferGatewayLocalUserIngress(client, principal);
	return principal;
}
/** Preserve capability-gated tool-event observation across agent turn entry paths. */
function resolveAgentTurnRunObserver(params) {
	const connId = params.principal?.connId;
	return connId && hasGatewayClientCap(params.principal?.connect?.caps, GATEWAY_CLIENT_CAPS.TOOL_EVENTS) ? (runId) => params.registerToolEventRecipient(runId, connId) : void 0;
}
//#endregion
export { resolveAgentTurnRunObserver as n, prepareAgentRequestPreflight as r, captureAgentTurnPrincipal as t };
