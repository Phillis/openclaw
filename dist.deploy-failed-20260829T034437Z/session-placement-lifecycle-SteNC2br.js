//#region src/gateway/worker-environments/session-placement-lifecycle.ts
var SessionWorkerPlacementMutationError = class extends Error {
	constructor(state, action, key) {
		super(`Session ${key} cannot ${action} while cloud worker placement is ${state}.`);
	}
};
function isFailedWorkerPlacementEnvironmentGone(params) {
	if (params.placement.environmentId === null) return true;
	if (!params.environmentService) return false;
	try {
		const environment = params.environmentService.get(params.placement.environmentId);
		return environment === void 0 || environment.state === "destroyed" || environment.state === "failed" && environment.leaseId === null;
	} catch {
		return false;
	}
}
function isWorkerPlacementSafeForMutation(context, placement) {
	if (placement.state === "failed") return isFailedWorkerPlacementEnvironmentGone({
		environmentService: context.workerEnvironmentService,
		placement
	});
	return placement.state === "local" || placement.state === "reclaimed";
}
function resolveWorkerPlacementArchiveRestoreError(params) {
	if (!params.placement || isWorkerPlacementSafeForMutation(params.context, params.placement)) return;
	return `Session ${params.key} cannot change archive state while cloud worker placement is ${params.placement.state}.`;
}
function retirementGuard(placement) {
	return {
		status: "retirement-required",
		sessionId: placement.sessionId,
		expectedState: placement.state,
		expectedGeneration: placement.generation
	};
}
function resolveSessionWorkerPlacementMutationGuard(params) {
	const placement = params.sessionId ? params.context.workerSessionPlacementService?.getMany([params.sessionId]).get(params.sessionId) : void 0;
	if (!placement) return { status: "allowed" };
	if (isWorkerPlacementSafeForMutation(params.context, placement)) {
		if (params.action === "delete" || params.action === "reset") return retirementGuard(placement);
		if (placement.state === "local" || params.action === "fork") return { status: "allowed" };
	}
	return {
		status: "blocked",
		error: new SessionWorkerPlacementMutationError(placement.state, params.action, params.key)
	};
}
function retireSessionWorkerPlacementBeforeMutation(params) {
	const guard = resolveSessionWorkerPlacementMutationGuard(params);
	if (guard.status !== "retirement-required") return guard.status === "blocked" ? guard.error : void 0;
	const retirementService = params.context.workerSessionPlacementService;
	if (!retirementService?.retireSessionPlacement) throw new Error("Worker session placement retirement service is unavailable");
	retirementService.retireSessionPlacement(guard);
}
function resolveSessionWorkerPlacementMutationError(params) {
	const guard = resolveSessionWorkerPlacementMutationGuard(params);
	return guard.status === "blocked" ? guard.error : void 0;
}
async function prepareSessionWorkerPlacementForArchive(params) {
	const { agentId, context, sessionId, sessionKey } = params;
	if (!sessionId) return;
	const request = {
		agentId,
		sessionId,
		sessionKey
	};
	const placement = context.workerSessionPlacementService?.getMany([sessionId]).get(sessionId);
	if (!placement) return;
	const matches = (candidate) => candidate.sessionId === sessionId && candidate.sessionKey === sessionKey && candidate.agentId === agentId;
	if (!matches(placement)) throw new Error(`Session ${sessionKey} cloud worker placement identity changed.`);
	if (isWorkerPlacementSafeForMutation(context, placement)) return;
	if (placement.state !== "active") throw new Error(`Session ${sessionKey} cannot archive from placement ${placement.state}.`);
	if (!params.reclaimActive) return;
	if (!context.workerPlacementDispatchService?.reclaim) throw new Error(`Session ${sessionKey} cloud worker reclaim is unavailable.`);
	const reclaimed = params.authorize ? await context.workerPlacementDispatchService.reclaim(request, params.authorize) : await context.workerPlacementDispatchService.reclaim(request);
	const settled = context.workerSessionPlacementService?.getMany([sessionId]).get(sessionId);
	if (reclaimed.state !== "reclaimed" || !matches(reclaimed) || settled?.state !== "reclaimed" || !matches(settled) || settled.generation !== reclaimed.generation) throw new Error(`Session ${sessionKey} cloud worker reclaim identity changed.`);
}
//#endregion
export { retireSessionWorkerPlacementBeforeMutation as a, resolveWorkerPlacementArchiveRestoreError as i, prepareSessionWorkerPlacementForArchive as n, resolveSessionWorkerPlacementMutationError as r, isFailedWorkerPlacementEnvironmentGone as t };
