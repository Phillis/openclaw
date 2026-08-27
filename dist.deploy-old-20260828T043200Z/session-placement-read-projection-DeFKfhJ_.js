import { n as projectWorkerPlacementMove, r as projectWorkerSessionPlacement } from "./placement-projector-1PRmQMM5.js";
//#region src/gateway/server-methods/session-placement-read-projection.ts
function projectSessionPlacementFields(params) {
	const placement = params.sessionId ? params.placements?.get(params.sessionId) : void 0;
	const move = params.sessionId ? params.moves?.get(params.sessionId) : void 0;
	return {
		...placement ? { placement: projectWorkerSessionPlacement(placement, params.context.workerPlacementDiskSpaceReader?.read(placement), params.context.workerPlacementRunnerAvailabilityReader?.read(placement)) } : {},
		...move ? { placementMove: projectWorkerPlacementMove(move) } : {}
	};
}
function createSessionPlacementBatchProjector(context, sessions) {
	const sessionIds = sessions.flatMap((session) => session.sessionId ? [session.sessionId] : []);
	const placements = context.workerSessionPlacementService?.getMany(sessionIds);
	const moves = context.workerSessionPlacementService?.getPlacementMoves?.(sessionIds);
	return (sessionId) => projectSessionPlacementFields({
		context,
		sessionId,
		placements,
		moves
	});
}
function readSessionPlacementFields(context, sessionId) {
	return createSessionPlacementBatchProjector(context, sessionId ? [{ sessionId }] : [{}])(sessionId);
}
//#endregion
export { readSessionPlacementFields as n, createSessionPlacementBatchProjector as t };
