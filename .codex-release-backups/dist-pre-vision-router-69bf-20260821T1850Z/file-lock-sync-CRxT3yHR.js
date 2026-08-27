import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { t as FsSafeError } from "./errors-hdcLXK2n.js";
import { a as readSidecarLockSnapshotSync, c as serializeSidecarLockPayload, i as sidecarLockPayloadCreatedAtMs, l as sidecarLockSnapshotMatches, o as relativeSidecarLockPath, r as computeSidecarLockDelayMs, s as removeSidecarLockIfUnchangedSync } from "./sidecar-lock-BeGYQ7Dw.js";
import { n as sleepSync } from "./timing-DpgMro2Q.js";
import { t as getFileLockProcessStartTime } from "./pid-alive-ClLrY9h9.js";
import { t as isLockOwnerDefinitelyStale } from "./stale-lock-file-CEuvanrm.js";
import "./file-lock-manager-jkXU9xR_.js";
import fs from "node:fs";
import path from "node:path";
//#region ../../../../../../openclaw/node_modules/@openclaw/fs-safe/dist/file-lock-sync.js
const SYNC_HELD_LOCKS_KEY = Symbol.for("fsSafe.syncSidecarLocks");
const SYNC_CLEANUP_REGISTERED_KEY = Symbol.for("fsSafe.syncSidecarLockCleanupRegistered");
const SYNC_CLEANUP_HANDLER_KEY = Symbol.for("fsSafe.syncSidecarLockCleanupHandler");
function getSyncHeldLocks() {
	const globalWithState = globalThis;
	if (!globalWithState[SYNC_HELD_LOCKS_KEY]) globalWithState[SYNC_HELD_LOCKS_KEY] = /* @__PURE__ */ new Map();
	return globalWithState[SYNC_HELD_LOCKS_KEY];
}
function releaseAllSyncHeldLocks() {
	const heldLocks = getSyncHeldLocks();
	for (const [normalizedTargetPath, held] of heldLocks) {
		if (held.timer) {
			clearInterval(held.timer);
			held.timer = void 0;
		}
		try {
			fs.closeSync(held.fd);
		} catch {}
		try {
			removeSidecarLockIfUnchangedSync(held.lockPath, held.snapshot);
		} catch {}
		heldLocks.delete(normalizedTargetPath);
	}
}
function ensureSyncExitCleanupRegistered() {
	const globalWithCleanup = globalThis;
	if (globalWithCleanup[SYNC_CLEANUP_REGISTERED_KEY]) return;
	globalWithCleanup[SYNC_CLEANUP_REGISTERED_KEY] = true;
	globalWithCleanup[SYNC_CLEANUP_HANDLER_KEY] = releaseAllSyncHeldLocks;
	process.on("exit", releaseAllSyncHeldLocks);
}
function verifySyncHeldLock(held) {
	const current = readSidecarLockSnapshotSync(held.lockPath, held.parsePayload);
	return !!current && sidecarLockSnapshotMatches(current, held.snapshot);
}
function releaseSyncHeldLock(held) {
	const heldLocks = getSyncHeldLocks();
	if (heldLocks.get(held.normalizedTargetPath) !== held) return false;
	held.refCount -= 1;
	if (held.refCount > 0) return false;
	heldLocks.delete(held.normalizedTargetPath);
	if (held.timer) {
		clearInterval(held.timer);
		held.timer = void 0;
	}
	fs.closeSync(held.fd);
	removeSidecarLockIfUnchangedSync(held.lockPath, held.snapshot);
	return true;
}
function createSyncHeldLockHandle(held) {
	let released = false;
	const release = () => {
		if (released) return;
		released = true;
		releaseSyncHeldLock(held);
	};
	return {
		lockPath: held.lockPath,
		normalizedTargetPath: held.normalizedTargetPath,
		verifyStillHeld: () => verifySyncHeldLock(held),
		release,
		[Symbol.dispose]: release
	};
}
function normalizeTargetPath(targetPath) {
	const resolved = path.resolve(targetPath);
	fs.mkdirSync(path.dirname(resolved), { recursive: true });
	try {
		return path.join(fs.realpathSync(path.dirname(resolved)), path.basename(resolved));
	} catch {
		return resolved;
	}
}
function boundedLockPath(lockPath, lockRoot) {
	const resolved = path.resolve(lockPath);
	if (!lockRoot) return resolved;
	relativeSidecarLockPath(lockRoot, resolved);
	const parent = path.dirname(resolved);
	const parentReal = fs.realpathSync(parent);
	const parentRelative = path.relative(lockRoot.rootReal, parentReal);
	if (parentRelative === ".." || parentRelative.startsWith(`..${path.sep}`) || path.isAbsolute(parentRelative)) throw new FsSafeError("outside-workspace", "sidecar lock parent is outside lockRoot");
	return path.join(parentReal, path.basename(resolved));
}
function defaultShouldReclaim(payload, lockPath, staleMs, nowMs) {
	const createdAtMs = sidecarLockPayloadCreatedAtMs(payload);
	if (createdAtMs !== null) return nowMs - createdAtMs > staleMs;
	try {
		return nowMs - fs.statSync(lockPath).mtimeMs > staleMs;
	} catch {
		return true;
	}
}
function reclaimGuardExists(reclaimGuardPath) {
	try {
		fs.lstatSync(reclaimGuardPath);
		return true;
	} catch (error) {
		if (error.code === "ENOENT") return false;
		throw error;
	}
}
function acquireFileLockSync(targetPath, options) {
	const normalizedTargetPath = normalizeTargetPath(targetPath);
	const lockPath = boundedLockPath(options.lockPath ?? `${normalizedTargetPath}.lock`, options.lockRoot);
	const heldLocks = getSyncHeldLocks();
	const held = heldLocks.get(normalizedTargetPath);
	if (held && options.reentrantOwner !== void 0 && held.reentrantOwner !== void 0 && options.reentrantOwner === held.reentrantOwner) {
		held.refCount += 1;
		return createSyncHeldLockHandle(held);
	}
	const staleMs = options.staleMs ?? 3e4;
	const retry = options.retry ?? {};
	const startedAt = Date.now();
	let attempt = 0;
	const reclaimGuardPath = `${lockPath}.reclaim`;
	const waitForRetry = () => {
		const elapsed = Date.now() - startedAt;
		if (options.timeoutMs !== void 0 && elapsed >= options.timeoutMs || retry.retries !== void 0 && attempt >= retry.retries) throw Object.assign(/* @__PURE__ */ new Error(`file lock timeout for ${normalizedTargetPath}`), {
			code: "file_lock_timeout",
			lockPath,
			normalizedTargetPath
		});
		sleepSync(computeSidecarLockDelayMs(retry, attempt));
		attempt += 1;
	};
	while (true) {
		if (reclaimGuardExists(reclaimGuardPath)) {
			waitForRetry();
			continue;
		}
		let fd;
		try {
			const payload = options.payload();
			const { raw, ownershipToken } = serializeSidecarLockPayload(payload);
			const noFollow = process.platform !== "win32" && typeof fs.constants.O_NOFOLLOW === "number" ? fs.constants.O_NOFOLLOW : 0;
			fd = fs.openSync(lockPath, fs.constants.O_WRONLY | fs.constants.O_CREAT | fs.constants.O_EXCL | noFollow, 384);
			fs.writeFileSync(fd, raw, "utf8");
			fs.fsyncSync(fd);
			const snapshot = {
				raw,
				payload,
				stat: fs.fstatSync(fd),
				ownershipToken
			};
			const createdHeld = {
				fd,
				lockPath,
				normalizedTargetPath,
				parsePayload: options.parsePayload,
				refCount: 1,
				reentrantOwner: options.reentrantOwner,
				snapshot
			};
			heldLocks.set(normalizedTargetPath, createdHeld);
			ensureSyncExitCleanupRegistered();
			const returnedHandle = createSyncHeldLockHandle(createdHeld);
			if (options.onCompromised && (options.compromiseCheckIntervalMs ?? 0) > 0) {
				createdHeld.timer = setInterval(() => {
					if (!returnedHandle.verifyStillHeld()) {
						if (createdHeld.timer) clearInterval(createdHeld.timer);
						createdHeld.timer = void 0;
						options.onCompromised?.({
							lockPath,
							normalizedTargetPath
						});
					}
				}, options.compromiseCheckIntervalMs);
				createdHeld.timer.unref();
			}
			fd = void 0;
			return returnedHandle;
		} catch (error) {
			if (fd !== void 0) {
				const failed = {
					payload: null,
					stat: fs.fstatSync(fd)
				};
				fs.closeSync(fd);
				fd = void 0;
				removeSidecarLockIfUnchangedSync(lockPath, failed);
			}
			if (error.code !== "EEXIST") throw error;
			if (heldLocks.has(normalizedTargetPath)) {
				waitForRetry();
				continue;
			}
			const snapshot = readSidecarLockSnapshotSync(lockPath, options.parsePayload, { rejectNonFile: true });
			if (!snapshot) continue;
			const nowMs = Date.now();
			if (options.shouldReclaim ? options.shouldReclaim({
				lockPath,
				normalizedTargetPath,
				payload: snapshot.payload,
				staleMs,
				nowMs,
				heldByThisProcess: false
			}) : defaultShouldReclaim(snapshot.payload, lockPath, staleMs, nowMs)) {
				if (options.staleRecovery === "remove-if-unchanged" && snapshot.raw !== void 0 && options.shouldRemoveStaleLock?.({
					lockPath,
					normalizedTargetPath,
					raw: snapshot.raw,
					payload: snapshot.payload
				})) {
					let ownsReclaimGuard = false;
					try {
						fs.mkdirSync(reclaimGuardPath);
						ownsReclaimGuard = true;
						if (removeSidecarLockIfUnchangedSync(lockPath, snapshot)) continue;
					} catch (reclaimError) {
						if (reclaimError.code !== "EEXIST") throw reclaimError;
						waitForRetry();
						continue;
					} finally {
						if (ownsReclaimGuard) try {
							fs.rmdirSync(reclaimGuardPath);
						} catch {}
					}
				}
				throw Object.assign(/* @__PURE__ */ new Error(`file lock stale for ${normalizedTargetPath}`), {
					code: "file_lock_stale",
					lockPath,
					normalizedTargetPath
				});
			}
			waitForRetry();
		}
	}
}
//#endregion
//#region src/infra/file-lock-sync.ts
let processStartTime;
/** Synchronous lock for legacy stores that cannot transact in SQLite yet. */
function acquireFileLockSyncWithRetry(path) {
	rejectUnsupportedLockPath(`${path}.lock`);
	processStartTime ??= getFileLockProcessStartTime(process.pid);
	const createPayload = () => ({
		pid: process.pid,
		createdAt: (/* @__PURE__ */ new Date()).toISOString(),
		...processStartTime === null ? {} : { starttime: processStartTime }
	});
	const isStale = ({ payload }) => isLockOwnerDefinitelyStale({ payload: isRecord(payload) ? payload : null });
	const lock = acquireFileLockSync(path, {
		staleMs: 3e4,
		retry: {
			retries: 9,
			factor: 1,
			minTimeout: 20,
			maxTimeout: 20,
			randomize: false
		},
		staleRecovery: "remove-if-unchanged",
		payload: createPayload,
		shouldReclaim: isStale,
		shouldRemoveStaleLock: isStale
	});
	return () => lock.release();
}
function rejectUnsupportedLockPath(lockPath) {
	let observed;
	try {
		observed = fs.lstatSync(lockPath);
	} catch (error) {
		if (error.code === "ENOENT") return;
		throw error;
	}
	if (observed.isFile() && !observed.isSymbolicLink()) return;
	if (!observed.isDirectory() || observed.isSymbolicLink()) throw new Error(`Storage lock path has an unsupported legacy type: ${lockPath}`);
	throw Object.assign(/* @__PURE__ */ new Error(`Legacy storage lock requires manual removal after verifying no older OpenClaw process is running: ${lockPath}`), {
		code: "file_lock_stale",
		lockPath
	});
}
//#endregion
export { acquireFileLockSyncWithRetry as t };
