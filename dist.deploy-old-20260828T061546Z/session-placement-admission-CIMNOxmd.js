import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.js";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/agents/session-placement-admission.ts
const state = resolveGlobalSingleton(Symbol.for("openclaw.sessionPlacementAdmissionState"), () => ({}));
const forcedTerminalSettlement = resolveGlobalSingleton(Symbol.for("openclaw.sessionPlacementForcedTerminalSettlement"), () => new AsyncLocalStorage());
function withSessionPlacementForcedTerminalSettlement(settle, task) {
	return forcedTerminalSettlement.run(settle, task);
}
function resolveSessionPlacementForcedTerminalSettlement() {
	return forcedTerminalSettlement.getStore();
}
function installSessionPlacementAdmissionProvider(provider) {
	state.provider = provider;
	return () => {
		if (state.provider === provider) state.provider = void 0;
	};
}
async function withSessionPlacementTurnAdmission(claim, params, task, onAdmitted) {
	let admitted = false;
	const admitTurn = () => {
		if (admitted) return;
		admitted = true;
		onAdmitted?.();
	};
	const runAdmittedLocalTurn = () => {
		admitTurn();
		return task();
	};
	const provider = state.provider;
	if (!provider) return await runAdmittedLocalTurn();
	return await provider.executeTurn(claim, params, runAdmittedLocalTurn, admitTurn);
}
async function withLocalSessionPlacementTurnAdmission(claim, task) {
	const provider = state.provider;
	if (!provider) return await task();
	return await provider.executeLocalTurn(claim, task);
}
/** Resolves an authoritative sandbox only when the live placement owns remote execution. */
async function resolveSessionPlacementSandbox(params) {
	return await state.provider?.resolveSandbox?.(params) ?? null;
}
/** The current placement owner alone can settle a proven terminal worker turn. */
function recoverTerminalSessionPlacementTurn(session) {
	return state.provider?.recoverTerminalTurn?.(session);
}
//#endregion
export { withLocalSessionPlacementTurnAdmission as a, resolveSessionPlacementSandbox as i, recoverTerminalSessionPlacementTurn as n, withSessionPlacementForcedTerminalSettlement as o, resolveSessionPlacementForcedTerminalSettlement as r, withSessionPlacementTurnAdmission as s, installSessionPlacementAdmissionProvider as t };
