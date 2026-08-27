import { r as resolveGlobalSet } from "./global-singleton-Dc_stLtU.js";
//#region src/cli/signal-exit-barrier.ts
const activeBarriers = resolveGlobalSet(Symbol.for("openclaw.signalExitBarriers"), "close-and-restart");
const activeGates = resolveGlobalSet(Symbol.for("openclaw.signalExitGates"), "close-and-restart");
function registerSignalExitGate(gate) {
	activeGates.add(gate);
	return () => activeGates.delete(gate);
}
function registerSignalExitBarrier(barrier) {
	activeBarriers.add(barrier);
	return () => activeBarriers.delete(barrier);
}
async function waitForSignalExitBarriers() {
	const gateResults = await Promise.allSettled(activeGates);
	const barrierResults = await Promise.allSettled([...activeBarriers].map((barrier) => barrier()));
	const failures = [...gateResults, ...barrierResults].filter((result) => result.status === "rejected").map((result) => result.reason);
	if (failures.length > 0) throw new AggregateError(failures, "Signal exit cleanup failed");
}
//#endregion
export { registerSignalExitGate as n, waitForSignalExitBarriers as r, registerSignalExitBarrier as t };
