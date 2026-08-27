import { n as resolveGlobalMap } from "./global-singleton-Dc_stLtU.js";
import { o as getActiveAgentRunDelegatedAuthority, w as validateAgentRunDelegatedAuthority } from "./agent-run-registry-t4kvUyNQ.js";
import { i as captureGatewayRootWorkAdmissionContinuationScope } from "./gateway-work-admission-CTDt7IQ1.js";
//#region src/gateway/worker-environments/placement-turn-claim-events.ts
const turnClaimReleaseWaiters = resolveGlobalMap(Symbol.for("openclaw.turnClaimReleaseWaiters"), (waitersByPath) => {
	const error = /* @__PURE__ */ new Error("Gateway lifecycle ended while waiting for turn claim release");
	for (const bySession of waitersByPath.values()) for (const waiters of bySession.values()) for (const reject of waiters) reject(error);
	waitersByPath.clear();
});
const workerTurnClaimClosedHandlers = resolveGlobalMap(Symbol.for("openclaw.workerTurnClaimClosedHandlers"), (handlersByPath) => {
	handlersByPath.clear();
});
const workerTurnOwners = resolveGlobalMap(Symbol.for("openclaw.workerTurnExecutionIdentities"), (ownersByPath) => {
	for (const owners of ownersByPath.values()) for (const owner of owners.values()) owner.continuation?.scope.release();
	ownersByPath.clear();
});
const WORKER_TURN_EXECUTION_IDENTITY_PATH = Symbol("workerTurnExecutionIdentityPath");
function claimKey(claim) {
	return JSON.stringify([
		claim.claimId,
		claim.runId,
		claim.placementGeneration,
		claim.owner.kind,
		claim.owner.kind === "worker" ? claim.owner.environmentId : null,
		claim.owner.kind === "worker" ? claim.owner.ownerEpoch : null
	]);
}
/** Bind diagnostic provenance to the exact live run and worker owners. */
function bindWorkerTurnExecutionIdentity(store, claim, token, operationalRunInstance, source) {
	const path = store[WORKER_TURN_EXECUTION_IDENTITY_PATH];
	const delegatedAuthority = getActiveAgentRunDelegatedAuthority(operationalRunInstance);
	if (!path || !store.validateTurnClaim(claim) || !delegatedAuthority) throw new Error(`Session ${claim.sessionId} worker turn authority changed`);
	const assertActive = () => {
		if (!store.validateTurnClaim(claim) || !validateAgentRunDelegatedAuthority(delegatedAuthority)) throw new Error(`Session ${claim.sessionId} worker turn authority changed`);
	};
	const identity = Object.freeze({
		agentId: source.agentId,
		delegatedAuthority,
		executionIdentityToken: token,
		operationalRunInstance,
		receiptAuthority: assertActive,
		sessionKey: source.sessionKey,
		turnClaim: claim
	});
	const capability = Object.freeze({ async run(callback) {
		assertActive();
		const result = await callback(identity);
		assertActive();
		return result;
	} });
	const owners = workerTurnOwners.get(path) ?? /* @__PURE__ */ new Map();
	const existing = owners.get(claim.sessionId);
	const currentClaimKey = claimKey(claim);
	if (existing && existing.claimKey !== currentClaimKey) existing.continuation?.scope.release();
	owners.set(claim.sessionId, {
		...existing?.claimKey === currentClaimKey ? existing : {},
		capability,
		claim,
		claimKey: currentClaimKey
	});
	workerTurnOwners.set(path, owners);
}
function getWorkerTurnExecutionIdentityCapability(store, claim) {
	const path = store[WORKER_TURN_EXECUTION_IDENTITY_PATH];
	const bound = path ? workerTurnOwners.get(path)?.get(claim.sessionId) : void 0;
	return bound && bound.claimKey === claimKey(claim) && store.validateTurnClaim(claim) ? bound.capability : void 0;
}
/** Completion authority follows the exact admitted run, not optional audit provenance. */
function bindWorkerTurnAdmissionContinuation(store, claim, operationalRunInstance) {
	const scope = captureGatewayRootWorkAdmissionContinuationScope();
	if (!scope) return;
	const path = store[WORKER_TURN_EXECUTION_IDENTITY_PATH];
	const delegatedAuthority = getActiveAgentRunDelegatedAuthority(operationalRunInstance);
	if (!path || !store.validateTurnClaim(claim) || !delegatedAuthority) {
		scope.release();
		throw new Error(`Session ${claim.sessionId} worker turn authority changed`);
	}
	const owners = workerTurnOwners.get(path) ?? /* @__PURE__ */ new Map();
	const existing = owners.get(claim.sessionId);
	existing?.continuation?.scope.release();
	const currentClaimKey = claimKey(claim);
	owners.set(claim.sessionId, {
		...existing?.claimKey === currentClaimKey ? existing : {},
		claim,
		claimKey: currentClaimKey,
		continuation: {
			delegatedAuthority,
			scope,
			store
		}
	});
	workerTurnOwners.set(path, owners);
}
function runWorkerTurnAdmissionContinuation(identity, run) {
	const claim = identity.turnClaim;
	if (!claim || claim.owner.kind !== "worker" || identity.sessionId !== claim.sessionId || identity.runId !== claim.runId || identity.environmentId !== claim.owner.environmentId || identity.ownerEpoch !== claim.owner.ownerEpoch) return null;
	const currentClaimKey = claimKey(claim);
	let owner;
	for (const owners of workerTurnOwners.values()) {
		const candidate = owners.get(claim.sessionId);
		if (candidate?.claimKey !== currentClaimKey) continue;
		if (owner) return null;
		owner = candidate;
	}
	const continuation = owner?.continuation;
	if (!owner || !continuation || !continuation.store.validateTurnClaim(owner.claim) || !validateAgentRunDelegatedAuthority(continuation.delegatedAuthority)) return null;
	return continuation.scope.run(run);
}
function attachWorkerTurnExecutionIdentityStore(store, path) {
	Object.defineProperty(store, WORKER_TURN_EXECUTION_IDENTITY_PATH, { value: path });
}
function waitersFor(path, sessionId) {
	let bySession = turnClaimReleaseWaiters.get(path);
	if (!bySession) {
		bySession = /* @__PURE__ */ new Map();
		turnClaimReleaseWaiters.set(path, bySession);
	}
	let waiters = bySession.get(sessionId);
	if (!waiters) {
		waiters = /* @__PURE__ */ new Set();
		bySession.set(sessionId, waiters);
	}
	return waiters;
}
function signalTurnClaimRelease(path, sessionId) {
	const bySession = turnClaimReleaseWaiters.get(path);
	const waiters = bySession?.get(sessionId);
	if (!bySession || !waiters) return;
	bySession.delete(sessionId);
	if (bySession.size === 0) turnClaimReleaseWaiters.delete(path);
	for (const resolve of waiters) resolve();
}
function removeTurnClaimReleaseWaiter(path, sessionId, waiter) {
	const bySession = turnClaimReleaseWaiters.get(path);
	const waiters = bySession?.get(sessionId);
	if (!bySession || !waiters) return;
	waiters.delete(waiter);
	if (waiters.size === 0) bySession.delete(sessionId);
	if (bySession.size === 0) turnClaimReleaseWaiters.delete(path);
}
function registerWorkerTurnClaimClosedHandler(path, handler) {
	const handlers = workerTurnClaimClosedHandlers.get(path) ?? /* @__PURE__ */ new Set();
	handlers.add(handler);
	workerTurnClaimClosedHandlers.set(path, handlers);
	return () => {
		handlers.delete(handler);
		if (handlers.size === 0) workerTurnClaimClosedHandlers.delete(path);
	};
}
function signalWorkerTurnClaimClosed(path, claim) {
	signalTurnClaimRelease(path, claim.sessionId);
	const owners = workerTurnOwners.get(path);
	const owner = owners?.get(claim.sessionId);
	if (owner?.claimKey === claimKey(claim)) {
		owner.continuation?.scope.release();
		owners?.delete(claim.sessionId);
		if (owners?.size === 0) workerTurnOwners.delete(path);
	}
	for (const handler of workerTurnClaimClosedHandlers.get(path) ?? []) try {
		handler(claim);
	} catch {}
}
//#endregion
export { registerWorkerTurnClaimClosedHandler as a, signalTurnClaimRelease as c, getWorkerTurnExecutionIdentityCapability as i, signalWorkerTurnClaimClosed as l, bindWorkerTurnAdmissionContinuation as n, removeTurnClaimReleaseWaiter as o, bindWorkerTurnExecutionIdentity as r, runWorkerTurnAdmissionContinuation as s, attachWorkerTurnExecutionIdentityStore as t, waitersFor as u };
