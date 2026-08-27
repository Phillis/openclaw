import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { t as ErrorCodes } from "./gateway-error-details-BWo6Le6w.js";
import { $r as validateSessionsReclaimParams, Nr as validateSessionsDispatchParams } from "./src-Bo4ezI_n.js";
import { s as errorShape } from "./error-codes-CMSvT5-d.js";
import { n as resolveWorkerPlacementExecutionMode, r as resolveWorkerPlacementSessionRuntime } from "./placement-session-runtime-Bg1IJ7s4.js";
import { t as resolveRequestedSessionAgentId } from "./session-request-agent-BeVvXvOY.js";
import { s as managedWorktrees } from "./service-BRAKemfS.js";
import { t as isFailedWorkerPlacementEnvironmentGone } from "./session-placement-lifecycle-BZjFQ_8W.js";
import { t as SessionMutationAuthorizationChangedError } from "./session-sharing-QTh4cZeN.js";
import { n as emitSessionsChanged } from "./session-change-event-BanWv5Vf.js";
import { t as assertValidParams } from "./validation-CsGeElrb.js";
import { t as projectWorkerSessionPlacement } from "./placement-projector-CzC20wfT.js";
import { a as loadAccessorSessionEntryForGatewayTarget, i as isWorkerDispatchInputError, l as requireSessionKey } from "./sessions-shared-DhClIVMH.js";
import { t as DEVICE_WORKER_PROVIDER_ID } from "./device-provider-qXBtzPgH.js";
//#region src/gateway/server-methods/sessions-dispatch.ts
function respondInvalidWorkerSession(respond, message) {
	respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, message));
}
async function resolveWorkerSessionTarget(params) {
	const cfg = params.context.getRuntimeConfig();
	const requestedAgent = resolveRequestedSessionAgentId(cfg, params.key, params.agentId);
	if (!requestedAgent.ok) {
		params.respond(false, void 0, requestedAgent.error);
		return;
	}
	const profileId = normalizeOptionalString(params.profileId);
	const deviceId = normalizeOptionalString(params.deviceId);
	let dispatchTarget;
	if (profileId && !Object.hasOwn(cfg.cloudWorkers?.profiles ?? {}, profileId)) {
		respondInvalidWorkerSession(params.respond, `cloud worker profile is not configured: ${profileId}`);
		return;
	}
	if (profileId) dispatchTarget = { profileId };
	else if (deviceId) dispatchTarget = {
		profileId: `device:${deviceId}`,
		deviceId,
		inheritedProfile: {
			providerId: DEVICE_WORKER_PROVIDER_ID,
			profileSnapshot: {
				install: "bundle",
				settings: { device: deviceId }
			}
		}
	};
	const target = loadAccessorSessionEntryForGatewayTarget({
		key: params.key,
		cfg,
		agentId: requestedAgent.agentId
	});
	const entry = target.entry;
	const sessionId = normalizeOptionalString(entry?.sessionId);
	if (!entry || !sessionId) {
		respondInvalidWorkerSession(params.respond, `session not found: ${params.key}`);
		return;
	}
	return {
		cfg,
		target,
		entry,
		sessionId,
		dispatchTarget
	};
}
function hasManagedSessionWorktree(params) {
	const worktree = managedWorktrees.findLiveByOwner("session", params.sessionKey);
	if (params.entry.worktree?.id && worktree && worktree.id === params.entry.worktree.id && worktree.ownerId === params.sessionKey) return true;
	const article = params.method === "sessions.dispatch" ? "a" : "the";
	respondInvalidWorkerSession(params.respond, `${params.method} requires ${article} session-owned managed worktree`);
	return false;
}
function respondWorkerPlacement(params) {
	params.respond(true, {
		ok: true,
		key: params.key,
		sessionId: params.sessionId,
		placement: projectWorkerSessionPlacement(params.placement)
	}, void 0);
}
function respondWorkerDispatchError(error, respond) {
	if (error instanceof SessionMutationAuthorizationChangedError) throw error;
	respond(false, void 0, errorShape(isWorkerDispatchInputError(error) ? ErrorCodes.INVALID_REQUEST : ErrorCodes.UNAVAILABLE, formatErrorMessage(error)));
}
const sessionDispatchHandlers = {
	"sessions.dispatch": async ({ params, respond, context, sessionMutationAuthorization }) => {
		if (!assertValidParams(params, validateSessionsDispatchParams, "sessions.dispatch", respond)) return;
		const key = requireSessionKey(params.key, respond);
		if (!key) return;
		const dispatchService = context.workerPlacementDispatchService;
		const placementReader = context.workerSessionPlacementService;
		if (!dispatchService || !placementReader) {
			respondInvalidWorkerSession(respond, "cloud worker dispatch is not configured");
			return;
		}
		const resolved = await resolveWorkerSessionTarget({
			key,
			agentId: params.agentId,
			profileId: params.profileId,
			deviceId: params.deviceId,
			context,
			respond
		});
		if (!resolved) return;
		const { cfg, target, entry, sessionId, dispatchTarget } = resolved;
		if (!dispatchTarget) {
			respondInvalidWorkerSession(respond, "worker dispatch target is missing");
			return;
		}
		if (entry.archivedAt !== void 0) {
			respondInvalidWorkerSession(respond, "cannot dispatch an archived session");
			return;
		}
		const sessionRuntime = resolveWorkerPlacementSessionRuntime({
			cfg,
			entry,
			agentId: target.target.agentId,
			sessionKey: target.canonicalKey
		});
		const executionMode = resolveWorkerPlacementExecutionMode(sessionRuntime);
		if (!executionMode) {
			respondInvalidWorkerSession(respond, `runtime ${sessionRuntime} lacks cloud placement support`);
			return;
		}
		const existingPlacement = placementReader.getMany([sessionId]).get(sessionId);
		if (existingPlacement?.state === "failed" && !isFailedWorkerPlacementEnvironmentGone({
			environmentService: context.workerEnvironmentService,
			placement: existingPlacement
		})) {
			respondInvalidWorkerSession(respond, "cloud worker environment must be stopped before redispatch; use Stop cloud worker");
			return;
		}
		if (existingPlacement && (existingPlacement.state === "active" || existingPlacement.state === "draining" || existingPlacement.state === "reconciling")) {
			respondInvalidWorkerSession(respond, `session cannot dispatch from placement ${existingPlacement.state}`);
			return;
		}
		if (!hasManagedSessionWorktree({
			entry,
			sessionKey: target.canonicalKey,
			method: "sessions.dispatch",
			respond
		})) return;
		try {
			sessionMutationAuthorization?.assertCurrent();
			const placement = await dispatchService.dispatch({
				sessionId,
				sessionKey: target.canonicalKey,
				agentId: target.target.agentId,
				executionMode,
				...dispatchTarget
			}, () => emitSessionsChanged(context, {
				reason: "dispatch",
				sessionKey: target.canonicalKey
			}));
			respondWorkerPlacement({
				respond,
				key: target.canonicalKey,
				sessionId,
				placement
			});
		} catch (error) {
			respondWorkerDispatchError(error, respond);
		}
	},
	"sessions.reclaim": async ({ params, respond, context, sessionMutationAuthorization }) => {
		if (!assertValidParams(params, validateSessionsReclaimParams, "sessions.reclaim", respond)) return;
		const key = requireSessionKey(params.key, respond);
		if (!key) return;
		const placementService = context.workerPlacementDispatchService;
		const placementReader = context.workerSessionPlacementService;
		if (!placementService?.reclaim || !placementReader) {
			respondInvalidWorkerSession(respond, "cloud worker stop is not configured");
			return;
		}
		const resolved = await resolveWorkerSessionTarget({
			key,
			agentId: params.agentId,
			context,
			respond
		});
		if (!resolved) return;
		const { target, entry, sessionId } = resolved;
		const existingPlacement = placementReader.getMany([sessionId]).get(sessionId);
		if (existingPlacement?.state === "reclaimed") {
			respondWorkerPlacement({
				respond,
				key: target.canonicalKey,
				sessionId,
				placement: existingPlacement
			});
			return;
		}
		if (existingPlacement?.state !== "active" && existingPlacement?.state !== "failed") {
			respondInvalidWorkerSession(respond, `session cannot stop cloud worker from placement ${existingPlacement?.state ?? "local"}`);
			return;
		}
		if (!hasManagedSessionWorktree({
			entry,
			sessionKey: target.canonicalKey,
			method: "sessions.reclaim",
			respond
		})) return;
		try {
			sessionMutationAuthorization?.assertCurrent();
			const placement = await placementService.reclaim({
				sessionId,
				sessionKey: target.canonicalKey,
				agentId: target.target.agentId
			});
			respondWorkerPlacement({
				respond,
				key: target.canonicalKey,
				sessionId,
				placement
			});
		} catch (error) {
			respondWorkerDispatchError(error, respond);
		}
	}
};
//#endregion
export { sessionDispatchHandlers as t };
