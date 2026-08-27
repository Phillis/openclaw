import { m as projectWorkerSessionTurnClaim, v as serializeWorkerSessionTurnClaim } from "./placement-record-nLiaHmTd.js";
import { i as getWorkerTurnExecutionIdentityCapability } from "./placement-turn-claim-events-DXxC6aUk.js";
//#region src/gateway/worker-environments/placement-worker-gate.ts
function claimForBinding(record, binding) {
	const claim = record ? projectWorkerSessionTurnClaim(record) : void 0;
	return claim?.sessionId === binding.sessionId && claim.owner.environmentId === binding.environmentId && claim.owner.ownerEpoch === binding.ownerEpoch ? claim : void 0;
}
function createWorkerSessionPlacementGate(store, options = {}) {
	const recoveryOnlyClaims = new Set(options.rejectExistingWorkerClaims ? store.list().flatMap((record) => {
		const claim = projectWorkerSessionTurnClaim(record);
		return claim ? [serializeWorkerSessionTurnClaim(claim)] : [];
	}) : []);
	const isOperational = (claim) => !recoveryOnlyClaims.has(serializeWorkerSessionTurnClaim(claim)) && store.validateTurnClaim(claim);
	const readWorkerTurnClaim = (binding) => {
		const claim = claimForBinding(store.get(binding.sessionId), binding);
		return claim && store.validateTurnClaim(claim) ? claim : void 0;
	};
	const validateWorkerTurn = (claim) => isOperational(claim);
	return {
		readWorkerTurnClaim,
		getExecutionIdentityCapability: (claim) => getWorkerTurnExecutionIdentityCapability(store, claim),
		validateWorkerTurn,
		readWorkerTurnLiveAckCursor(claim) {
			if (!validateWorkerTurn(claim)) throw new Error(`Cannot read ACK cursor for stale worker turn ${claim.sessionId}`);
			const placement = store.get(claim.sessionId);
			if (!placement) throw new Error(`Worker placement disappeared for session ${claim.sessionId}`);
			return placement.lastLiveEventAckCursor ?? 0;
		},
		isWorkerTurnToolAuthorized(claim, toolName) {
			return validateWorkerTurn(claim) && store.isWorkerTurnToolAuthorized(claim, toolName);
		},
		updateAckCursors(input) {
			if (!validateWorkerTurn(input.claim)) throw new Error(`Cannot ACK stale worker turn for session ${input.claim.sessionId}`);
			store.updateAckCursors({
				claim: input.claim,
				...input.transcriptSeq === void 0 ? {} : { transcript: input.transcriptSeq },
				...input.liveSeq === void 0 ? {} : { liveEvent: input.liveSeq }
			});
		},
		registerTurnClaimClosedHandler: (handler) => store.registerTurnClaimClosedHandler(handler)
	};
}
//#endregion
export { createWorkerSessionPlacementGate };
