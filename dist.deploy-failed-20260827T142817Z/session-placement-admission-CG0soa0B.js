import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.js";
//#region src/agents/session-placement-admission.ts
const state = resolveGlobalSingleton(Symbol.for("openclaw.sessionPlacementAdmissionState"), () => ({}));
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
//#endregion
export { withSessionPlacementTurnAdmission as i, resolveSessionPlacementSandbox as n, withLocalSessionPlacementTurnAdmission as r, installSessionPlacementAdmissionProvider as t };
