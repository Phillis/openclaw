import { r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
import { a as toStringifiedError } from "./error-coercion-DisD0JTb.js";
import { r as normalizeOptionalAccountId } from "./account-id-BRqK6RmF.js";
import "./error-runtime-oXQewkZq.js";
import { o as createDeferred } from "./extension-shared-D4oakjAV.js";
import "./env-vars-B5wpK6d0.js";
import { n as LogService } from "./logger-Dn0f-vbT.js";
import { i as resolveMatrixAuthContext, r as resolveMatrixAuth } from "./create-client-CaXqBpjI.js";
import { t as awaitMatrixStartupWithAbort } from "./startup-abort-DHSHNH2b.js";
//#region extensions/matrix/src/matrix/client/shared.ts
const loadMatrixCreateClientDeps = createLazyRuntimeModule(() => import("./create-client-FX1Pt0fs.js").then((runtime) => ({ createMatrixClient: runtime.createMatrixClient })));
const MATRIX_TRANSIENT_LEASE_DRAIN_TIMEOUT_MS = 5e3;
const sharedClientStates = /* @__PURE__ */ new Map();
const sharedClientPromises = /* @__PURE__ */ new Map();
function buildSharedClientKey(auth) {
	return JSON.stringify([
		auth.homeserver,
		auth.userId,
		auth.accessToken,
		auth.encryption ? "e2ee" : "plain",
		auth.allowPrivateNetwork ? "private-net" : "strict-net",
		auth.dispatcherPolicy ?? null,
		auth.accountId
	]);
}
async function createSharedMatrixClient(params) {
	const { createMatrixClient } = await loadMatrixCreateClientDeps();
	const client = await createMatrixClient({
		homeserver: params.auth.homeserver,
		userId: params.auth.userId,
		accessToken: params.auth.accessToken,
		password: params.auth.password,
		deviceId: params.auth.deviceId,
		encryption: params.auth.encryption,
		localTimeoutMs: params.timeoutMs,
		initialSyncLimit: params.auth.initialSyncLimit,
		accountId: params.auth.accountId,
		allowPrivateNetwork: params.auth.allowPrivateNetwork,
		ssrfPolicy: params.auth.ssrfPolicy,
		dispatcherPolicy: params.auth.dispatcherPolicy
	});
	return {
		auth: params.auth,
		client,
		key: buildSharedClientKey(params.auth),
		started: false,
		cryptoReady: false,
		startPromise: null,
		phase: "open",
		leases: /* @__PURE__ */ new Set(),
		monitorRetirementPromises: /* @__PURE__ */ new Set(),
		noLeases: createDeferred(),
		retirementPromise: null,
		poisonError: null,
		releaseMode: "discard"
	};
}
function deleteSharedClientState(state) {
	if (sharedClientStates.get(state.key) === state) sharedClientStates.delete(state.key);
	sharedClientPromises.delete(state.key);
}
async function ensureSharedClientStarted(state, abortSignal) {
	if (state.started) return;
	if (state.startPromise) {
		await awaitMatrixStartupWithAbort(state.startPromise, abortSignal);
		return;
	}
	const guardedStart = (async () => {
		if (state.auth.encryption && !state.cryptoReady) try {
			const joinedRooms = await state.client.getJoinedRooms();
			if (state.client.crypto) {
				await state.client.crypto.prepare(joinedRooms);
				state.cryptoReady = true;
			}
		} catch (err) {
			LogService.warn("MatrixClientLite", "Failed to prepare crypto:", err);
		}
		await awaitMatrixStartupWithAbort(state.client.start({ abortSignal }), abortSignal);
		state.started = true;
	})().finally(() => {
		if (state.startPromise === guardedStart) state.startPromise = null;
	});
	state.startPromise = guardedStart;
	await awaitMatrixStartupWithAbort(guardedStart, abortSignal);
}
async function resolveSharedMatrixAuth(params) {
	const requestedAccountId = normalizeOptionalAccountId(params.accountId);
	if (params.auth && requestedAccountId && requestedAccountId !== params.auth.accountId) throw new Error(`Matrix shared client account mismatch: requested ${requestedAccountId}, auth resolved ${params.auth.accountId}`);
	if (params.auth) return params.auth;
	if (!params.cfg) throw new Error("Matrix shared client requires a resolved runtime config. Load and resolve config at the command or gateway boundary, then pass cfg through the runtime path.");
	const authContext = resolveMatrixAuthContext({
		cfg: params.cfg,
		env: params.env,
		accountId: params.accountId
	});
	return await resolveMatrixAuth({
		cfg: authContext.cfg,
		env: authContext.env,
		accountId: authContext.accountId
	});
}
async function resolveOpenSharedMatrixClientState(params) {
	const auth = await resolveSharedMatrixAuth(params);
	const key = buildSharedClientKey(auth);
	while (true) {
		const existing = sharedClientStates.get(key);
		if (existing?.poisonError) throw existing.poisonError;
		if (existing?.phase === "open") return existing;
		if (existing?.retirementPromise) {
			await awaitMatrixStartupWithAbort(existing.retirementPromise, params.abortSignal);
			continue;
		}
		const pending = sharedClientPromises.get(key);
		if (pending) {
			await awaitMatrixStartupWithAbort(pending, params.abortSignal);
			continue;
		}
		const creationPromise = createSharedMatrixClient({
			auth,
			timeoutMs: params.timeoutMs
		});
		sharedClientPromises.set(key, creationPromise);
		try {
			const created = await creationPromise;
			sharedClientStates.set(key, created);
			return created;
		} finally {
			sharedClientPromises.delete(key);
		}
	}
}
async function runMonitorRetirement(retirement) {
	if (!retirement) return;
	retirement.closeTaskAdmission();
	retirement.detachListeners();
	await retirement.waitForTasks();
	await retirement.cleanup();
}
function retireMonitorLease(state, lease) {
	if (lease.monitorRetirementPromise) return lease.monitorRetirementPromise;
	lease.monitorRetirementPromise = runMonitorRetirement(lease.monitorRetirement ?? void 0);
	state.monitorRetirementPromises.add(lease.monitorRetirementPromise);
	return lease.monitorRetirementPromise;
}
async function retireMonitorLeases(state, leases) {
	for (const lease of leases) retireMonitorLease(state, lease);
	const failure = (await Promise.allSettled(state.monitorRetirementPromises)).find((result) => result.status === "rejected");
	if (failure?.status === "rejected") throw failure.reason;
}
function mergeReleaseMode(current, requested) {
	if (current === "persist" || requested === "persist") return "persist";
	if (current === "stop" || requested === "stop") return "stop";
	return "discard";
}
function abortTransientLeases(state) {
	for (const lease of state.leases) if (lease.role === "transient") lease.abortController.abort();
}
function forceReleaseLeases(state, releasePromise = Promise.resolve()) {
	for (const lease of state.leases) {
		lease.abortController.abort();
		lease.releasePromise ??= releasePromise;
	}
	state.leases.clear();
	state.noLeases.resolve();
}
async function waitForLeaseDrain(state) {
	if (state.leases.size === 0) return;
	let deadline;
	try {
		await Promise.race([state.noLeases.promise, new Promise((_, reject) => {
			deadline = setTimeout(() => {
				reject(/* @__PURE__ */ new Error(`Matrix transient leases did not drain within ${MATRIX_TRANSIENT_LEASE_DRAIN_TIMEOUT_MS}ms`));
			}, MATRIX_TRANSIENT_LEASE_DRAIN_TIMEOUT_MS);
			deadline.unref?.();
		})]);
	} finally {
		if (deadline) clearTimeout(deadline);
	}
}
function beginGenerationRetirement(params) {
	const { state } = params;
	if (state.retirementPromise) return state.retirementPromise;
	state.phase = "quiescing";
	state.retirementPromise = Promise.resolve().then(async () => {
		try {
			await state.client.quiesceSync();
			state.started = false;
			await state.client.drainPendingDecryptions("matrix monitor sync quiesce");
		} catch (error) {
			state.poisonError = toStringifiedError(error);
		}
		try {
			await retireMonitorLeases(state, params.monitorLeases ?? []);
		} catch (error) {
			state.poisonError ??= toStringifiedError(error);
		}
		state.phase = "closing";
		try {
			await waitForLeaseDrain(state);
		} catch (error) {
			state.poisonError ??= toStringifiedError(error);
			forceReleaseLeases(state);
		}
		if (state.poisonError) {
			await state.client.drainPendingDecryptions("matrix poisoned client shutdown").catch(() => void 0);
			state.client.stopWithoutPersist();
			throw state.poisonError;
		}
		try {
			await state.client.drainPendingDecryptions("matrix shared client final shutdown");
		} catch (error) {
			state.poisonError = toStringifiedError(error);
			try {
				state.client.stopWithoutPersist();
			} finally {
				deleteSharedClientState(state);
			}
			throw state.poisonError;
		}
		try {
			if (state.releaseMode === "persist") await state.client.stopAndPersist();
			else if (state.releaseMode === "discard") state.client.stopWithoutPersist();
			else await state.client.stopAndPersist().catch(() => state.client.stopWithoutPersist());
		} finally {
			deleteSharedClientState(state);
		}
	});
	abortTransientLeases(state);
	return state.retirementPromise;
}
function createSharedMatrixClientLease(state, role) {
	const leaseState = {
		abortController: new AbortController(),
		monitorRetirement: null,
		monitorRetirementPromise: null,
		role,
		releasePromise: null
	};
	state.leases.add(leaseState);
	return {
		abortSignal: leaseState.abortController.signal,
		client: state.client,
		role,
		registerMonitorRetirement: (retirement) => {
			if (role !== "monitor") throw new Error("Matrix transient leases cannot register monitor retirement");
			if (leaseState.releasePromise || state.phase !== "open") throw new Error("Matrix monitor lease is already retiring");
			if (leaseState.monitorRetirement && leaseState.monitorRetirement !== retirement) throw new Error("Matrix monitor retirement is already registered");
			leaseState.monitorRetirement = retirement;
		},
		start: async (abortSignal) => {
			if (leaseState.releasePromise) throw new Error("Matrix client lease has already been released");
			if (state.phase !== "open") throw new Error("Matrix client generation is retiring");
			await ensureSharedClientStarted(state, abortSignal ? AbortSignal.any([abortSignal, leaseState.abortController.signal]) : leaseState.abortController.signal);
		},
		release: (releaseParams = {}) => {
			if (leaseState.releasePromise) return leaseState.releasePromise;
			state.releaseMode = mergeReleaseMode(state.releaseMode, releaseParams.mode ?? "stop");
			state.leases.delete(leaseState);
			if (state.leases.size === 0) state.noLeases.resolve();
			const finalMonitor = role === "monitor" && !Array.from(state.leases).some((lease) => lease.role === "monitor");
			if (role === "monitor" && !finalMonitor) {
				leaseState.releasePromise = retireMonitorLease(state, leaseState);
				return leaseState.releasePromise;
			}
			if (!(finalMonitor || state.leases.size === 0)) {
				leaseState.releasePromise = Promise.resolve();
				return leaseState.releasePromise;
			}
			leaseState.releasePromise = beginGenerationRetirement({
				state,
				monitorLeases: role === "monitor" ? [leaseState] : void 0
			});
			return leaseState.releasePromise;
		}
	};
}
async function acquireSharedMatrixClient(params = {}) {
	const lease = createSharedMatrixClientLease(await resolveOpenSharedMatrixClientState(params), params.role ?? "transient");
	if (params.startClient !== false) try {
		await lease.start(params.abortSignal);
	} catch (error) {
		await lease.release({ mode: "stop" }).catch(() => void 0);
		throw error;
	}
	return lease;
}
//#endregion
export { acquireSharedMatrixClient as t };
