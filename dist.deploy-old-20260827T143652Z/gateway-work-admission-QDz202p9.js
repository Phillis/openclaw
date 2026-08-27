import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.js";
import { t as createSubsystemLogger } from "./subsystem-CDLhGl2-.js";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/process/gateway-work-admission.ts
var GatewayDrainingError = class extends Error {
	constructor(message = "Gateway is draining; new tasks are not accepted") {
		super(message);
		this.name = "GatewayDrainingError";
	}
};
const admissionLog = createSubsystemLogger("gateway/admission");
const GATEWAY_WORK_ADMISSION_STATE = resolveGlobalSingleton(Symbol.for("openclaw.gatewayWorkAdmissionState"), () => ({
	restartDraining: false,
	restartSignalPending: false,
	restartSignalGeneration: 0,
	suspendPhase: "accepting",
	suspendGeneration: 0,
	activeRootWork: /* @__PURE__ */ new Set(),
	rootDrainWaiters: /* @__PURE__ */ new Set(),
	currentRootWork: new AsyncLocalStorage(),
	suspendOpenWaiters: /* @__PURE__ */ new Set()
}));
function logAdmissionClosed(reason) {
	admissionLog.info(`admission closed: ${reason}`);
}
function logAdmissionReopened(reason) {
	admissionLog.info(`admission reopened: ${reason}`);
}
function createGatewayRootWorkAdmission() {
	const admission = {
		references: 1,
		released: false
	};
	GATEWAY_WORK_ADMISSION_STATE.activeRootWork.add(admission);
	return {
		ownsRoot: true,
		release: createGatewayRootWorkRelease(admission),
		run: async (run) => await GATEWAY_WORK_ADMISSION_STATE.currentRootWork.run(admission, run)
	};
}
function createGatewayRootWorkRelease(admission) {
	let leaseReleased = false;
	return () => {
		if (leaseReleased || admission.released) return;
		leaseReleased = true;
		admission.references -= 1;
		if (admission.references > 0) return;
		admission.released = true;
		GATEWAY_WORK_ADMISSION_STATE.activeRootWork.delete(admission);
		if (GATEWAY_WORK_ADMISSION_STATE.activeRootWork.size === 0) resolveRootDrainWaiters();
	};
}
function resolveRootDrainWaiters() {
	const rootDrainWaiters = GATEWAY_WORK_ADMISSION_STATE.rootDrainWaiters;
	if (!rootDrainWaiters) return;
	const waiters = Array.from(rootDrainWaiters);
	rootDrainWaiters.clear();
	for (const resolve of waiters) resolve();
}
function invalidateSuspendAdmission() {
	const callback = GATEWAY_WORK_ADMISSION_STATE.suspendInvalidated;
	const wasClosed = GATEWAY_WORK_ADMISSION_STATE.suspendPhase !== "accepting";
	GATEWAY_WORK_ADMISSION_STATE.suspendInvalidated = void 0;
	GATEWAY_WORK_ADMISSION_STATE.suspendPhase = "accepting";
	GATEWAY_WORK_ADMISSION_STATE.suspendGeneration += 1;
	resolveSuspendOpenWaiters();
	if (wasClosed && !GATEWAY_WORK_ADMISSION_STATE.restartDraining) logAdmissionReopened("suspend phase");
	callback?.();
}
function clearRestartSignalFence() {
	if (GATEWAY_WORK_ADMISSION_STATE.restartDraining || !GATEWAY_WORK_ADMISSION_STATE.restartSignalPending) return false;
	GATEWAY_WORK_ADMISSION_STATE.restartSignalPending = false;
	GATEWAY_WORK_ADMISSION_STATE.restartSignalGeneration += 1;
	resolveSuspendOpenWaiters();
	logAdmissionReopened("restart-signal fence");
	return true;
}
function resolveSuspendOpenWaiters() {
	const waiters = Array.from(GATEWAY_WORK_ADMISSION_STATE.suspendOpenWaiters);
	GATEWAY_WORK_ADMISSION_STATE.suspendOpenWaiters.clear();
	for (const resolve of waiters) resolve();
}
/** True while restart signal/drain or host suspension rejects new process work. */
function isGatewayWorkAdmissionClosed() {
	return GATEWAY_WORK_ADMISSION_STATE.restartDraining || GATEWAY_WORK_ADMISSION_STATE.restartSignalPending || GATEWAY_WORK_ADMISSION_STATE.suspendPhase !== "accepting";
}
/** Existing admitted roots may finish spawning subordinate command/session work.
* New async chains still see the global fence, preserving refuse-only suspension. */
function isGatewaySubordinateWorkAdmissionClosed() {
	if (GATEWAY_WORK_ADMISSION_STATE.restartDraining || GATEWAY_WORK_ADMISSION_STATE.restartSignalPending) return true;
	const current = GATEWAY_WORK_ADMISSION_STATE.currentRootWork.getStore();
	if (current) return current.released;
	return GATEWAY_WORK_ADMISSION_STATE.suspendPhase !== "accepting";
}
function getGatewaySuspendAdmissionPhase() {
	return GATEWAY_WORK_ADMISSION_STATE.suspendPhase;
}
function isGatewayRestartDraining() {
	return GATEWAY_WORK_ADMISSION_STATE.restartDraining || GATEWAY_WORK_ADMISSION_STATE.restartSignalPending;
}
/** Restart drain is one-way until the in-process restart resets runtime state. */
function markGatewayRestartDraining() {
	if (GATEWAY_WORK_ADMISSION_STATE.restartDraining) return;
	GATEWAY_WORK_ADMISSION_STATE.restartSignalPending = false;
	GATEWAY_WORK_ADMISSION_STATE.restartSignalGeneration += 1;
	GATEWAY_WORK_ADMISSION_STATE.restartDraining = true;
	resolveSuspendOpenWaiters();
	logAdmissionClosed("restart drain");
	if (GATEWAY_WORK_ADMISSION_STATE.suspendPhase !== "accepting") invalidateSuspendAdmission();
}
/**
* Blocks suspension across signal emission until the run loop starts restart drain.
* Returns null when another owner already holds the fence or one-way drain is active.
* Callers must not invent a stand-in lease: a dead rollback handle is how the fence
* can stay closed after the real owner is lost.
*/
function beginGatewayRestartSignalAdmission() {
	if (GATEWAY_WORK_ADMISSION_STATE.restartDraining || GATEWAY_WORK_ADMISSION_STATE.restartSignalPending) return null;
	GATEWAY_WORK_ADMISSION_STATE.restartSignalPending = true;
	const generation = ++GATEWAY_WORK_ADMISSION_STATE.restartSignalGeneration;
	logAdmissionClosed("restart-signal fence");
	return { rollback: () => {
		if (!GATEWAY_WORK_ADMISSION_STATE.restartSignalPending || GATEWAY_WORK_ADMISSION_STATE.restartSignalGeneration !== generation) return false;
		return clearRestartSignalFence();
	} };
}
/**
* Reopens a reversible restart-signal fence that no longer has a live lease.
* No-op while one-way restart drain owns admission.
*/
function rollbackGatewayRestartSignalFence() {
	return clearRestartSignalFence();
}
/** Root RPC/timer admission. Nested work in the same async chain counts once. */
function tryBeginGatewayRootWorkAdmission() {
	const current = GATEWAY_WORK_ADMISSION_STATE.currentRootWork.getStore();
	if (current && !current.released) return {
		ownsRoot: false,
		release: () => {},
		run: async (run) => await run()
	};
	if (GATEWAY_WORK_ADMISSION_STATE.restartDraining || GATEWAY_WORK_ADMISSION_STATE.restartSignalPending || GATEWAY_WORK_ADMISSION_STATE.suspendPhase !== "accepting") return null;
	return createGatewayRootWorkAdmission();
}
/** Independent detached work counts separately even when launched by an admitted parent. */
function tryBeginGatewayIndependentRootWorkAdmission() {
	if (GATEWAY_WORK_ADMISSION_STATE.restartDraining || GATEWAY_WORK_ADMISSION_STATE.restartSignalPending || GATEWAY_WORK_ADMISSION_STATE.suspendPhase !== "accepting") return null;
	return createGatewayRootWorkAdmission();
}
/** Waits through a prepared lease, then joins the root-work set atomically. */
async function beginGatewayRootWorkAdmissionWhenOpen() {
	while (true) {
		if (GATEWAY_WORK_ADMISSION_STATE.restartDraining) throw new GatewayDrainingError();
		const admission = tryBeginGatewayRootWorkAdmission();
		if (admission) return admission;
		await new Promise((resolve) => {
			GATEWAY_WORK_ADMISSION_STATE.suspendOpenWaiters.add(resolve);
		});
	}
}
async function runWithGatewayIndependentRootWorkAdmission(run) {
	while (true) {
		if (GATEWAY_WORK_ADMISSION_STATE.restartDraining) throw new GatewayDrainingError("gateway is draining for restart");
		const admission = tryBeginGatewayIndependentRootWorkAdmission();
		if (admission) try {
			return await admission.run(run);
		} finally {
			admission.release();
		}
		await new Promise((resolve) => {
			GATEWAY_WORK_ADMISSION_STATE.suspendOpenWaiters.add(resolve);
		});
	}
}
/** Re-admits preserved work whose inherited root was retired before it could run. */
const runWithGatewayRootWorkReadmission = (run) => GATEWAY_WORK_ADMISSION_STATE.currentRootWork.getStore()?.retiredByReset ? runWithGatewayIndependentRootWorkAdmission(run) : run();
/**
* Detaches required follow-up from the current admitted transaction.
* A live parent synchronously reserves a tracked root even after restart or
* suspension closes admission; callers without a live parent use the normal
* independent-root fence.
*/
function runWithGatewayIndependentRootWorkContinuation(run) {
	const parent = GATEWAY_WORK_ADMISSION_STATE.currentRootWork.getStore();
	if (!parent || parent.released) return runWithGatewayIndependentRootWorkAdmission(run);
	const admission = createGatewayRootWorkAdmission();
	return admission.run(run).finally(admission.release);
}
/** Transfers an admitted request root to work that intentionally outlives its handler. */
function retainGatewayRootWorkAdmissionContinuation() {
	const current = GATEWAY_WORK_ADMISSION_STATE.currentRootWork.getStore();
	if (!current || current.released) return null;
	current.references += 1;
	return createGatewayRootWorkRelease(current);
}
/** Starts process-lifetime work without inheriting the request root that created it. */
function runOutsideGatewayRootWorkAdmission(run) {
	return GATEWAY_WORK_ADMISSION_STATE.currentRootWork.exit(run);
}
/** Active root requests/ticks, optionally excluding the caller running prepare. */
function getActiveGatewayRootWorkCount(opts) {
	let count = GATEWAY_WORK_ADMISSION_STATE.activeRootWork.size;
	const current = GATEWAY_WORK_ADMISSION_STATE.currentRootWork.getStore();
	if (opts?.excludeCurrent === true && current && !current.released && GATEWAY_WORK_ADMISSION_STATE.activeRootWork.has(current)) count -= 1;
	return Math.max(0, count);
}
/** Waits for admitted root transactions after restart has closed new admission. */
async function waitForActiveGatewayRootWork(timeoutMs) {
	if (GATEWAY_WORK_ADMISSION_STATE.activeRootWork.size === 0) return {
		drained: true,
		active: 0
	};
	const timeout = typeof timeoutMs === "number" && Number.isFinite(timeoutMs) ? Math.max(0, Math.floor(timeoutMs)) : void 0;
	if (timeout === 0) return {
		drained: false,
		active: GATEWAY_WORK_ADMISSION_STATE.activeRootWork.size
	};
	let timer;
	let resolveDrain = () => {};
	await new Promise((resolve) => {
		resolveDrain = () => resolve();
		(GATEWAY_WORK_ADMISSION_STATE.rootDrainWaiters ?? (GATEWAY_WORK_ADMISSION_STATE.rootDrainWaiters = /* @__PURE__ */ new Set())).add(resolveDrain);
		if (timeout !== void 0) timer = setTimeout(resolve, timeout);
	});
	if (timer) clearTimeout(timer);
	GATEWAY_WORK_ADMISSION_STATE.rootDrainWaiters?.delete(resolveDrain);
	const active = GATEWAY_WORK_ADMISSION_STATE.activeRootWork.size;
	return {
		drained: active === 0,
		active
	};
}
/** Atomically closes new suspension admission before synchronous inspection. */
function tryBeginGatewaySuspendAdmission(onInvalidated) {
	if (GATEWAY_WORK_ADMISSION_STATE.restartDraining || GATEWAY_WORK_ADMISSION_STATE.restartSignalPending || GATEWAY_WORK_ADMISSION_STATE.suspendPhase !== "accepting") return null;
	GATEWAY_WORK_ADMISSION_STATE.suspendPhase = "preparing";
	const generation = ++GATEWAY_WORK_ADMISSION_STATE.suspendGeneration;
	GATEWAY_WORK_ADMISSION_STATE.suspendInvalidated = onInvalidated;
	logAdmissionClosed("suspend phase");
	const transition = (expected, next) => {
		if (GATEWAY_WORK_ADMISSION_STATE.suspendGeneration !== generation || GATEWAY_WORK_ADMISSION_STATE.suspendPhase !== expected) return false;
		GATEWAY_WORK_ADMISSION_STATE.suspendPhase = next;
		if (next === "accepting") {
			GATEWAY_WORK_ADMISSION_STATE.suspendInvalidated = void 0;
			resolveSuspendOpenWaiters();
			logAdmissionReopened("suspend phase");
		}
		return true;
	};
	return {
		commit: () => transition("preparing", "prepared"),
		rollback: () => transition("preparing", "accepting"),
		release: () => transition("prepared", "accepting")
	};
}
/** Clears restart/suspend admission during SIGUSR1 and isolated tests. */
function resetGatewayWorkAdmission() {
	for (const admission of GATEWAY_WORK_ADMISSION_STATE.activeRootWork) {
		admission.references = 0;
		admission.retiredByReset = true;
		admission.released = true;
	}
	GATEWAY_WORK_ADMISSION_STATE.activeRootWork.clear();
	resolveRootDrainWaiters();
	GATEWAY_WORK_ADMISSION_STATE.restartDraining = false;
	GATEWAY_WORK_ADMISSION_STATE.restartSignalPending = false;
	GATEWAY_WORK_ADMISSION_STATE.restartSignalGeneration += 1;
	if (GATEWAY_WORK_ADMISSION_STATE.suspendPhase !== "accepting") invalidateSuspendAdmission();
	else {
		GATEWAY_WORK_ADMISSION_STATE.suspendGeneration += 1;
		GATEWAY_WORK_ADMISSION_STATE.suspendInvalidated = void 0;
	}
	resolveSuspendOpenWaiters();
}
//#endregion
export { tryBeginGatewayRootWorkAdmission as _, getGatewaySuspendAdmissionPhase as a, isGatewayWorkAdmissionClosed as c, retainGatewayRootWorkAdmissionContinuation as d, rollbackGatewayRestartSignalFence as f, runWithGatewayRootWorkReadmission as g, runWithGatewayIndependentRootWorkContinuation as h, getActiveGatewayRootWorkCount as i, markGatewayRestartDraining as l, runWithGatewayIndependentRootWorkAdmission as m, beginGatewayRestartSignalAdmission as n, isGatewayRestartDraining as o, runOutsideGatewayRootWorkAdmission as p, beginGatewayRootWorkAdmissionWhenOpen as r, isGatewaySubordinateWorkAdmissionClosed as s, GatewayDrainingError as t, resetGatewayWorkAdmission as u, tryBeginGatewaySuspendAdmission as v, waitForActiveGatewayRootWork as y };
