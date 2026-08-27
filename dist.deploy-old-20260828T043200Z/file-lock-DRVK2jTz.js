import { r as asNullableRecord } from "./record-coerce-DItp3I4t.js";
import "./fs-safe-defaults-BPVQr7Lx.js";
import { i as resetFileLockManagerForTest, r as drainFileLockManagerForTest, t as acquireFileLock$1 } from "./file-lock-BEYhVT9i.js";
import { t as getFileLockProcessStartTime } from "./pid-alive-BcyyC-CC.js";
import { n as shouldRemoveDeadOwnerOrExpiredLock, t as isLockOwnerDefinitelyStale } from "./stale-lock-file-7k32f-I2.js";
import fs from "node:fs/promises";
//#region src/plugin-sdk/file-lock.ts
/** Stable error code used when lock acquisition retries are exhausted. */
const FILE_LOCK_TIMEOUT_ERROR_CODE = "file_lock_timeout";
/** Stable error code used when stale lock recovery cannot proceed safely. */
const FILE_LOCK_STALE_ERROR_CODE = "file_lock_stale";
const FILE_LOCK_MANAGER_KEY = "openclaw.plugin-sdk.file-lock";
const STALE_FILE_LOCK_RECLAIM_MANAGER_KEY = "openclaw.plugin-sdk.stale-file-lock-reclaim";
let currentProcessStartTime;
function getCurrentProcessStartTime() {
	if (currentProcessStartTime === void 0) currentProcessStartTime = getFileLockProcessStartTime(process.pid);
	return currentProcessStartTime;
}
function createCurrentProcessLockPayload() {
	const payload = {
		pid: process.pid,
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	};
	const starttime = getCurrentProcessStartTime();
	if (starttime !== null) payload.starttime = starttime;
	return payload;
}
function asLockPayload(payload) {
	return asNullableRecord(payload);
}
function sameStatValue(left, right) {
	return typeof left === typeof right ? left === right : BigInt(left) === BigInt(right);
}
function sameFileIdentity(left, right) {
	if (!sameStatValue(left.ino, right.ino)) return false;
	if (sameStatValue(left.dev, right.dev)) return true;
	return process.platform === "win32" && (left.dev === 0 || left.dev === 0n || right.dev === 0 || right.dev === 0n);
}
async function isSameRegularFile(filePath, observed) {
	try {
		const current = await fs.lstat(filePath, { bigint: true });
		return current.isFile() && sameFileIdentity(current, observed);
	} catch {
		return false;
	}
}
function normalizeLockError(err) {
	if (err.code === "file_lock_timeout") throw Object.assign(new Error(err.message), {
		code: FILE_LOCK_TIMEOUT_ERROR_CODE,
		lockPath: err.lockPath ?? ""
	});
	if (err.code === "file_lock_stale") throw Object.assign(new Error(err.message), {
		code: FILE_LOCK_STALE_ERROR_CODE,
		lockPath: err.lockPath ?? ""
	});
	throw err;
}
/** Reset process-local file-lock state for tests that isolate lock managers. */
function resetFileLockStateForTest() {
	resetFileLockManagerForTest(FILE_LOCK_MANAGER_KEY, FILE_LOCK_MANAGER_KEY);
}
/** Wait for process-local file-lock state to drain before test teardown. */
async function drainFileLockStateForTest() {
	await drainFileLockManagerForTest(FILE_LOCK_MANAGER_KEY, FILE_LOCK_MANAGER_KEY);
}
/** Acquire an owner-scoped process-local file lock backed by a `.lock` sidecar file. */
async function acquireFileLock(filePath, options) {
	const staleRecovery = options.staleRecovery ?? "remove-if-unchanged";
	try {
		const lock = await acquireFileLock$1(filePath, {
			managerKey: FILE_LOCK_MANAGER_KEY,
			staleMs: options.stale,
			retry: options.retries,
			staleRecovery,
			reentrantOwner: options.reentrantOwner,
			payload: createCurrentProcessLockPayload,
			shouldReclaim: (params) => staleRecovery === "fail-closed" ? isLockOwnerDefinitelyStale({ payload: asLockPayload(params.payload) }) : shouldRemoveDeadOwnerOrExpiredLock({
				payload: asLockPayload(params.payload),
				staleMs: params.staleMs,
				nowMs: params.nowMs
			}),
			...staleRecovery === "remove-if-unchanged" ? { shouldRemoveStaleLock: (snapshot) => shouldRemoveDeadOwnerOrExpiredLock({
				payload: asLockPayload(snapshot.payload),
				staleMs: options.stale
			}) } : {}
		});
		return {
			lockPath: lock.lockPath,
			release: lock.release
		};
	} catch (err) {
		return normalizeLockError(err);
	}
}
/** Remove one definitely stale, unchanged regular lock sidecar; retain every ambiguous owner. */
async function reclaimDefinitelyStaleFileLock(lockPath) {
	let observed;
	try {
		observed = await fs.lstat(lockPath, { bigint: true });
	} catch (err) {
		if (err.code === "ENOENT") return "missing";
		throw err;
	}
	if (!observed.isFile()) return "retained";
	const ownerIsDefinitelyStale = async (payload) => await isSameRegularFile(lockPath, observed) && isLockOwnerDefinitelyStale({ payload: asLockPayload(payload) });
	const targetPath = lockPath.endsWith(".lock") ? lockPath.slice(0, -5) : lockPath;
	try {
		await (await acquireFileLock$1(targetPath, {
			managerKey: STALE_FILE_LOCK_RECLAIM_MANAGER_KEY,
			lockPath,
			staleMs: 0,
			retry: { retries: 0 },
			staleRecovery: "remove-if-unchanged",
			payload: createCurrentProcessLockPayload,
			shouldReclaim: ({ payload }) => ownerIsDefinitelyStale(payload),
			shouldRemoveStaleLock: ({ payload }) => ownerIsDefinitelyStale(payload)
		})).release();
		return "removed";
	} catch (err) {
		const code = err.code;
		if (code === "file_lock_timeout" || code === "file_lock_stale") return "retained";
		throw err;
	}
}
/** Run an async callback while holding a file lock, always releasing the lock afterward. */
async function withFileLock(filePath, options, fn) {
	const lock = await acquireFileLock(filePath, options);
	try {
		return await fn();
	} finally {
		await lock.release();
	}
}
//#endregion
export { reclaimDefinitelyStaleFileLock as a, drainFileLockStateForTest as i, FILE_LOCK_TIMEOUT_ERROR_CODE as n, resetFileLockStateForTest as o, acquireFileLock as r, withFileLock as s, FILE_LOCK_STALE_ERROR_CODE as t };
