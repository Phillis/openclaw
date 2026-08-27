import { t as FsSafeError } from "./errors-CQDiIdj7.js";
import { n as readFileDescriptorBoundedSync, r as readFileHandleBounded } from "./bounded-read-pTKvsUkY.js";
import { t as sameFileIdentity } from "./file-identity-BDCAnrmX.js";
import { t as getNativeBinding } from "./native-CIvGO3cR.js";
import { randomBytes } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
//#region node_modules/@openclaw/fs-safe/dist/native-operations.js
function nativeOpenFlags(flags) {
	return flags | (fs.constants.O_CLOEXEC ?? 0) | (typeof fs.constants.O_NOFOLLOW === "number" ? fs.constants.O_NOFOLLOW : 0);
}
function writeAll(fd, data) {
	let offset = 0;
	while (offset < data.byteLength) {
		const written = fs.writeSync(fd, data, offset, data.byteLength - offset);
		if (written <= 0) throw Object.assign(/* @__PURE__ */ new Error("native file write made no progress"), { code: "EIO" });
		offset += written;
	}
}
function wrapNativeFd(fd, containment) {
	let open = true;
	return {
		fd,
		containment,
		async close() {
			if (open) {
				open = false;
				fs.closeSync(fd);
			}
		},
		async stat() {
			return fs.fstatSync(fd);
		},
		async writeFile(data, encoding) {
			writeAll(fd, Buffer.isBuffer(data) ? data : Buffer.from(data, encoding ?? "utf8"));
		}
	};
}
function removeNativeCreatedFileIfStillPinned(params) {
	if (!params.created) return;
	try {
		const parentPathStat = fs.lstatSync(params.parentPath);
		const parentFdStat = params.binding.fstatIdentity(params.parentFd);
		const targetPath = path.join(params.parentPath, params.basename);
		const target = fs.lstatSync(targetPath);
		if (!parentPathStat.isSymbolicLink() && parentPathStat.dev === parentFdStat.dev && parentPathStat.ino === parentFdStat.ino && !target.isSymbolicLink() && sameFileIdentity(target, params.created)) fs.rmSync(targetPath);
	} catch {}
}
async function createNativeExclusiveFile(targetPath, mode) {
	const binding = getNativeBinding();
	if (!binding) return;
	const parentPath = path.dirname(targetPath);
	const basename = path.basename(targetPath);
	const parent = await fs$1.open(parentPath, fs.constants.O_RDONLY | (typeof fs.constants.O_DIRECTORY === "number" ? fs.constants.O_DIRECTORY : 0));
	let fd;
	let created;
	try {
		let opened;
		try {
			opened = binding.openBeneath(parent.fd, basename, nativeOpenFlags(fs.constants.O_WRONLY | fs.constants.O_CREAT | fs.constants.O_EXCL));
		} catch (error) {
			const openError = error;
			if (process.platform === "win32" && openError.code === "EPERM") openError.path = targetPath;
			throw error;
		}
		fd = opened.fd;
		fs.fchmodSync(fd, mode);
		created = fs.fstatSync(fd);
		return wrapNativeFd(fd, opened.containment);
	} catch (error) {
		if (fd !== void 0) {
			try {
				fs.closeSync(fd);
			} catch {}
			removeNativeCreatedFileIfStillPinned({
				binding,
				parentPath,
				parentFd: parent.fd,
				basename,
				created
			});
		}
		throw error;
	} finally {
		await parent.close().catch(() => void 0);
	}
}
function syncNativeFileBestEffort(fd) {
	try {
		fs.fsyncSync(fd);
	} catch (error) {
		if (error.code !== "EPERM") throw error;
	}
}
function writeNativeFd(fd, data) {
	writeAll(fd, data);
}
function getFsSafeTestHooks() {}
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/sidecar-lock-reclaim.js
const MAX_LOCK_PAYLOAD_BYTES = 1024 * 1024;
const SIDECAR_LOCK_OWNERSHIP_TOKEN_BYTES = 16;
const SIDECAR_LOCK_OWNERSHIP_TOKEN_BITS = SIDECAR_LOCK_OWNERSHIP_TOKEN_BYTES * 8;
const SIDECAR_LOCK_OWNERSHIP_TOKEN_PREFIX = "	".repeat(8);
const SIDECAR_LOCK_OWNERSHIP_TOKEN_PATTERN = new RegExp(`\\n(${SIDECAR_LOCK_OWNERSHIP_TOKEN_PREFIX}[ \\t]{${SIDECAR_LOCK_OWNERSHIP_TOKEN_BITS}})\\n$`);
function createSidecarLockOwnershipToken() {
	let token = SIDECAR_LOCK_OWNERSHIP_TOKEN_PREFIX;
	for (const byte of randomBytes(SIDECAR_LOCK_OWNERSHIP_TOKEN_BYTES)) for (let bit = 7; bit >= 0; bit -= 1) token += byte & 1 << bit ? "	" : " ";
	return token;
}
function readSidecarLockOwnershipToken(raw) {
	return SIDECAR_LOCK_OWNERSHIP_TOKEN_PATTERN.exec(raw)?.[1];
}
function serializeSidecarLockPayload(payload) {
	const ownershipToken = createSidecarLockOwnershipToken();
	return {
		raw: `${JSON.stringify(payload, null, 2)}\n${ownershipToken}\n`,
		ownershipToken
	};
}
function relativeSidecarLockPath(lockRoot, lockPath) {
	const resolved = path.resolve(lockPath);
	const lexicalRelative = path.relative(lockRoot.rootDir, resolved);
	const relative = lexicalRelative !== ".." && !lexicalRelative.startsWith(`..${path.sep}`) && !path.isAbsolute(lexicalRelative) ? lexicalRelative : path.relative(lockRoot.rootReal, resolved);
	if (!relative || relative === ".." || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) throw new FsSafeError("outside-workspace", "sidecar lock path is outside lockRoot");
	return relative.split(path.sep).join(path.posix.sep);
}
function parseSidecarLockPayload(raw, parser) {
	if (parser) return parser(raw);
	try {
		const parsed = JSON.parse(raw);
		return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : null;
	} catch {
		return null;
	}
}
async function readSidecarLockSnapshot(lockPath, options = {}) {
	let handle;
	try {
		if (options.lockRoot) {
			const opened = await options.lockRoot.open(relativeSidecarLockPath(options.lockRoot, lockPath));
			try {
				const raw = (await readFileHandleBounded(opened.handle, MAX_LOCK_PAYLOAD_BYTES)).toString("utf8");
				return {
					raw,
					payload: parseSidecarLockPayload(raw, options.parsePayload),
					stat: opened.stat
				};
			} finally {
				await opened.handle.close().catch(() => void 0);
			}
		}
		const before = await fs$1.lstat(lockPath);
		if (!before.isFile() || before.isSymbolicLink()) {
			if (options.rejectNonFile) throw new FsSafeError("not-file", `sidecar lock is not a regular file: ${lockPath}`);
			return null;
		}
		await void 0;
		const noFollow = process.platform !== "win32" && typeof fs.constants.O_NOFOLLOW === "number" ? fs.constants.O_NOFOLLOW : 0;
		try {
			handle = await fs$1.open(lockPath, fs.constants.O_RDONLY | noFollow | (typeof fs.constants.O_NONBLOCK === "number" ? fs.constants.O_NONBLOCK : 0));
		} catch (error) {
			if (options.rejectNonFile && error.code === "ELOOP") throw new FsSafeError("not-file", `sidecar lock is not a regular file: ${lockPath}`, { cause: error });
			throw error;
		}
		const opened = await handle.stat();
		if (!opened.isFile()) {
			if (options.rejectNonFile) throw new FsSafeError("not-file", `sidecar lock is not a regular file: ${lockPath}`);
			return null;
		}
		if (!options.allowDescriptorIdentityDrift && !sameFileIdentity(before, opened)) return null;
		const raw = (await readFileHandleBounded(handle, MAX_LOCK_PAYLOAD_BYTES)).toString("utf8");
		const after = await fs$1.lstat(lockPath);
		if (!after.isFile() || !sameFileIdentity(before, after)) return null;
		return {
			raw,
			payload: parseSidecarLockPayload(raw, options.parsePayload),
			stat: after
		};
	} catch (err) {
		if (err.code === "ENOENT" || err instanceof FsSafeError && err.code === "not-found") return null;
		throw err;
	} finally {
		await handle?.close().catch(() => void 0);
	}
}
function readSidecarLockSnapshotSync(lockPath, parsePayload, options = {}) {
	let fd;
	try {
		const before = fs.lstatSync(lockPath);
		if (!before.isFile() || before.isSymbolicLink()) {
			if (options.rejectNonFile) throw new FsSafeError("not-file", `sidecar lock is not a regular file: ${lockPath}`);
			return null;
		}
		const noFollow = process.platform !== "win32" && typeof fs.constants.O_NOFOLLOW === "number" ? fs.constants.O_NOFOLLOW : 0;
		fd = fs.openSync(lockPath, fs.constants.O_RDONLY | noFollow);
		const opened = fs.fstatSync(fd);
		const raw = readFileDescriptorBoundedSync(fd, MAX_LOCK_PAYLOAD_BYTES).toString("utf8");
		const after = fs.lstatSync(lockPath);
		if (!sameFileIdentity(before, opened) || !sameFileIdentity(opened, after)) return null;
		return {
			raw,
			payload: parseSidecarLockPayload(raw, parsePayload),
			stat: after,
			ownershipToken: readSidecarLockOwnershipToken(raw)
		};
	} catch (error) {
		if (error.code === "ENOENT") return null;
		throw error;
	} finally {
		if (fd !== void 0) fs.closeSync(fd);
	}
}
function removeSidecarLockIfUnchangedSync(lockPath, observed) {
	const current = readSidecarLockSnapshotSync(lockPath);
	if (!current || !sidecarLockSnapshotMatches(current, observed)) return false;
	fs.rmSync(lockPath);
	return true;
}
function sidecarLockSnapshotMatches(current, observed) {
	if (observed.ownershipToken !== void 0) return current.stat?.isFile() === true && current.raw !== void 0 && observed.raw !== void 0 && readSidecarLockOwnershipToken(current.raw) === observed.ownershipToken && readSidecarLockOwnershipToken(observed.raw) === observed.ownershipToken && current.raw === observed.raw;
	if (observed.stat && current.stat && !sameFileIdentity(observed.stat, current.stat)) return false;
	if (observed.raw !== void 0) return current.raw === observed.raw;
	return observed.stat !== void 0 && current.stat !== void 0;
}
async function removeSidecarLockIfUnchanged(lockPath, observed, options = {}) {
	const current = await readSidecarLockSnapshot(lockPath, {
		...options,
		allowDescriptorIdentityDrift: observed?.ownershipToken !== void 0
	});
	if (!current || !observed || !sidecarLockSnapshotMatches(current, observed)) return false;
	if (options.lockRoot) await options.lockRoot.remove(relativeSidecarLockPath(options.lockRoot, lockPath)).catch(() => void 0);
	else await fs$1.rm(lockPath, { force: true }).catch(() => void 0);
	return true;
}
async function sidecarLockSnapshotStillPresent(lockPath, observed, options = {}) {
	const current = await readSidecarLockSnapshot(lockPath, {
		...options,
		allowDescriptorIdentityDrift: observed?.ownershipToken !== void 0
	});
	return !!current && !!observed && sidecarLockSnapshotMatches(current, observed);
}
async function sidecarReclaimGuardExists(pathname) {
	try {
		await fs$1.lstat(pathname);
		return true;
	} catch (err) {
		if (err.code === "ENOENT") return false;
		throw err;
	}
}
async function tryAcquireSidecarReclaimGuard(reclaimGuards, reclaimGuardPath) {
	try {
		await fs$1.mkdir(reclaimGuardPath);
		reclaimGuards.add(reclaimGuardPath);
		return true;
	} catch (err) {
		if (err.code === "EEXIST") return false;
		throw err;
	}
}
async function releaseSidecarReclaimGuard(reclaimGuards, reclaimGuardPath) {
	await fs$1.rmdir(reclaimGuardPath);
	reclaimGuards.delete(reclaimGuardPath);
}
async function removeStaleSidecarLockIfAllowed(params) {
	if (!params.shouldRemoveStaleLock || params.snapshot.raw === void 0) return "not-approved";
	const ioOptions = {
		lockRoot: params.lockRoot,
		parsePayload: params.parsePayload
	};
	if (!await sidecarLockSnapshotStillPresent(params.lockPath, params.snapshot, ioOptions)) return "changed";
	if (!await params.shouldRemoveStaleLock({
		lockPath: params.lockPath,
		normalizedTargetPath: params.normalizedTargetPath,
		raw: params.snapshot.raw,
		payload: params.snapshot.payload
	})) return "not-approved";
	if (!await sidecarLockSnapshotStillPresent(params.lockPath, params.snapshot, ioOptions)) return "changed";
	try {
		if (params.lockRoot) await params.lockRoot.remove(relativeSidecarLockPath(params.lockRoot, params.lockPath));
		else await fs$1.rm(params.lockPath);
		return "removed";
	} catch (err) {
		if (err.code === "ENOENT") return "changed";
		throw err;
	}
}
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/sidecar-lock-policy.js
function computeSidecarLockDelayMs(retry, attempt) {
	const minTimeout = retry.minTimeout ?? 50;
	const maxTimeout = retry.maxTimeout ?? 1e3;
	const factor = retry.factor ?? 1;
	const base = Math.min(maxTimeout, Math.max(minTimeout, minTimeout * factor ** attempt));
	const jitter = retry.randomize ? 1 + Math.random() : 1;
	return Math.min(maxTimeout, Math.round(base * jitter));
}
function isTransientLockFileDenial(error, lockPath) {
	const denial = error;
	return process.platform === "win32" && denial?.code === "EPERM" && denial.path === lockPath;
}
function sidecarLockPayloadCreatedAtMs(payload) {
	const createdAt = payload && typeof payload === "object" && "createdAt" in payload && typeof payload.createdAt === "string" ? payload.createdAt : "";
	const createdAtMs = Date.parse(createdAt);
	return Number.isFinite(createdAtMs) ? createdAtMs : null;
}
async function defaultSidecarLockShouldReclaim(params) {
	const createdAtMs = sidecarLockPayloadCreatedAtMs(params.payload);
	if (createdAtMs !== null) return params.nowMs - createdAtMs > params.staleMs;
	try {
		return params.nowMs - (await fs$1.stat(params.lockPath)).mtimeMs > params.staleMs;
	} catch {
		return true;
	}
}
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/sidecar-lock-acquire.js
async function resolveNormalizedTargetPath(targetPath) {
	const resolved = path.resolve(targetPath);
	const dir = path.dirname(resolved);
	await fs$1.mkdir(dir, { recursive: true });
	try {
		return path.join(await fs$1.realpath(dir), path.basename(resolved));
	} catch {
		return resolved;
	}
}
async function acquireSidecarLock(options, context) {
	context.ensureExitCleanupRegistered();
	const normalizedTargetPath = await resolveNormalizedTargetPath(options.targetPath);
	const lockPath = options.lockPath ?? `${normalizedTargetPath}.lock`;
	const held = context.held.get(normalizedTargetPath);
	if (held && options.reentrantOwner !== void 0 && held.reentrantOwner !== void 0 && options.reentrantOwner === held.reentrantOwner) {
		held.refCount += 1;
		return context.handleForHeldLock(normalizedTargetPath, held);
	}
	const startedAt = Date.now();
	const retry = options.retry ?? {};
	const maxRetries = options.timeoutMs === Number.POSITIVE_INFINITY ? void 0 : retry.retries;
	const reclaimGuardPath = `${lockPath}.reclaim`;
	let ownsReclaimGuard = false;
	let attempt = 0;
	let transientDenials = 0;
	const withinDenialBudget = () => ++transientDenials <= 8;
	const waitForRetry = async () => {
		const elapsed = Date.now() - startedAt;
		if (options.timeoutMs !== void 0 && options.timeoutMs !== Number.POSITIVE_INFINITY && elapsed >= options.timeoutMs || maxRetries !== void 0 && attempt >= maxRetries) throw Object.assign(/* @__PURE__ */ new Error(`file lock timeout for ${normalizedTargetPath}`), {
			code: "file_lock_timeout",
			lockPath,
			normalizedTargetPath
		});
		const remaining = options.timeoutMs === void 0 || options.timeoutMs === Number.POSITIVE_INFINITY ? Number.POSITIVE_INFINITY : Math.max(0, options.timeoutMs - elapsed);
		const delay = Math.min(computeSidecarLockDelayMs(retry, attempt), remaining);
		attempt += 1;
		await new Promise((resolve) => setTimeout(resolve, delay));
	};
	const retryOrRethrowDenial = async (denial) => {
		try {
			await waitForRetry();
		} catch (waitError) {
			if (waitError.code === "file_lock_timeout") throw denial;
			throw waitError;
		}
	};
	try {
		while (true) {
			if (!ownsReclaimGuard && await sidecarReclaimGuardExists(reclaimGuardPath)) {
				await waitForRetry();
				continue;
			}
			let handle = null;
			let createdSnapshot = null;
			let lockFileCreateDenied = false;
			try {
				const payload = await options.payload();
				const { raw, ownershipToken } = serializeSidecarLockPayload(payload);
				if (options.lockRoot) {
					const relativeLockPath = relativeSidecarLockPath(options.lockRoot, lockPath);
					try {
						await options.lockRoot.create(relativeLockPath, raw, {
							mkdir: true,
							mode: 384
						});
					} catch (error) {
						if (error instanceof FsSafeError && error.code === "already-exists") throw Object.assign(/* @__PURE__ */ new Error("sidecar lock exists"), { code: "EEXIST" });
						throw error;
					}
					createdSnapshot = {
						raw,
						payload,
						ownershipToken
					};
					handle = (await options.lockRoot.open(relativeLockPath)).handle;
				} else {
					try {
						handle = await createNativeExclusiveFile(lockPath, 384) ?? await fs$1.open(lockPath, "wx");
					} catch (createError) {
						lockFileCreateDenied = isTransientLockFileDenial(createError, lockPath);
						throw createError;
					}
					await handle.writeFile(raw, "utf8");
				}
				const snapshot = {
					raw,
					payload,
					stat: await handle.stat(),
					ownershipToken
				};
				const createdHeld = {
					refCount: 1,
					reentrantOwner: options.reentrantOwner,
					handle,
					lockPath,
					snapshot,
					acquiredAt: Date.now(),
					metadata: options.metadata ?? {},
					lockRoot: options.lockRoot,
					parsePayload: options.parsePayload
				};
				context.held.set(normalizedTargetPath, createdHeld);
				if (ownsReclaimGuard) try {
					await releaseSidecarReclaimGuard(context.reclaimGuards, reclaimGuardPath);
					ownsReclaimGuard = false;
				} catch (err) {
					await context.releaseHeldLock(normalizedTargetPath, createdHeld, { force: true });
					throw err;
				}
				const returnedHandle = context.handleForHeldLock(normalizedTargetPath, createdHeld);
				const interval = options.compromiseCheckIntervalMs;
				if (options.onCompromised && interval !== void 0 && interval > 0) {
					createdHeld.compromiseTimer = setInterval(() => {
						returnedHandle.verifyStillHeld().then((stillHeld) => {
							if (!stillHeld && createdHeld.compromiseTimer) {
								clearInterval(createdHeld.compromiseTimer);
								createdHeld.compromiseTimer = void 0;
								options.onCompromised?.({
									lockPath,
									normalizedTargetPath
								});
							}
						});
					}, interval);
					createdHeld.compromiseTimer.unref();
				}
				return returnedHandle;
			} catch (err) {
				if (handle) {
					const failedSnapshot = { payload: null };
					try {
						failedSnapshot.stat = await handle.stat();
					} catch {}
					if (context.held.get(normalizedTargetPath)?.handle === handle) context.held.delete(normalizedTargetPath);
					await handle.close().catch(() => void 0);
					await removeSidecarLockIfUnchanged(lockPath, failedSnapshot, {
						lockRoot: options.lockRoot,
						parsePayload: options.parsePayload
					});
				} else if (createdSnapshot) await removeSidecarLockIfUnchanged(lockPath, createdSnapshot, {
					lockRoot: options.lockRoot,
					parsePayload: options.parsePayload
				});
				if (lockFileCreateDenied && withinDenialBudget()) {
					await retryOrRethrowDenial(err);
					continue;
				}
				if (err.code !== "EEXIST") throw err;
				if (ownsReclaimGuard) {
					await releaseSidecarReclaimGuard(context.reclaimGuards, reclaimGuardPath);
					ownsReclaimGuard = false;
					continue;
				}
				const nowMs = Date.now();
				let snapshot;
				try {
					snapshot = await readSidecarLockSnapshot(lockPath, {
						lockRoot: options.lockRoot,
						parsePayload: options.parsePayload,
						rejectNonFile: true
					});
				} catch (readErr) {
					if (!isTransientLockFileDenial(readErr, lockPath) || !withinDenialBudget()) throw readErr;
					await retryOrRethrowDenial(readErr);
					continue;
				}
				if (!snapshot) continue;
				if (context.held.has(normalizedTargetPath)) {
					await waitForRetry();
					continue;
				}
				if (await (options.shouldReclaim ?? defaultSidecarLockShouldReclaim)({
					lockPath,
					normalizedTargetPath,
					payload: snapshot?.payload ?? null,
					staleMs: options.staleMs,
					nowMs,
					heldByThisProcess: context.held.has(normalizedTargetPath)
				})) {
					if (!await sidecarLockSnapshotStillPresent(lockPath, snapshot, {
						lockRoot: options.lockRoot,
						parsePayload: options.parsePayload
					})) continue;
					if ((options.staleRecovery ?? "fail-closed") === "remove-if-unchanged") {
						if (!await tryAcquireSidecarReclaimGuard(context.reclaimGuards, reclaimGuardPath)) {
							await waitForRetry();
							continue;
						}
						ownsReclaimGuard = true;
						const removal = await removeStaleSidecarLockIfAllowed({
							lockPath,
							normalizedTargetPath,
							snapshot,
							shouldRemoveStaleLock: options.shouldRemoveStaleLock,
							lockRoot: options.lockRoot,
							parsePayload: options.parsePayload
						});
						if (removal === "removed" || removal === "changed") continue;
						await releaseSidecarReclaimGuard(context.reclaimGuards, reclaimGuardPath);
						ownsReclaimGuard = false;
					}
					throw Object.assign(/* @__PURE__ */ new Error(`file lock stale for ${normalizedTargetPath}`), {
						code: "file_lock_stale",
						lockPath,
						normalizedTargetPath
					});
				}
				await waitForRetry();
			}
		}
	} finally {
		if (ownsReclaimGuard) await releaseSidecarReclaimGuard(context.reclaimGuards, reclaimGuardPath).catch(() => void 0);
	}
}
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/sidecar-lock-handle.js
function createSidecarLockHandle(params) {
	let released = false;
	const release = async () => {
		if (released) return;
		released = true;
		await params.release();
	};
	return {
		lockPath: params.lockPath,
		normalizedTargetPath: params.normalizedTargetPath,
		verifyStillHeld: params.verifyStillHeld,
		release,
		[Symbol.asyncDispose]: release
	};
}
function createHeldSidecarLockHandle(params) {
	return createSidecarLockHandle({
		lockPath: params.held.lockPath,
		normalizedTargetPath: params.normalizedTargetPath,
		verifyStillHeld: async () => await sidecarLockSnapshotStillPresent(params.held.lockPath, params.held.snapshot, {
			lockRoot: params.held.lockRoot,
			parsePayload: params.held.parsePayload
		}),
		release: params.release
	});
}
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/sidecar-lock.js
const GLOBAL_STATE_KEY = Symbol.for("fsSafe.sidecarLockManagers");
const GLOBAL_CLEANUP_KEY = Symbol.for("fsSafe.sidecarLockCleanupRegistered");
const GLOBAL_CLEANUP_HANDLER_KEY = Symbol.for("fsSafe.sidecarLockCleanupHandler");
function getGlobalManagers() {
	const globalWithState = globalThis;
	if (!globalWithState[GLOBAL_STATE_KEY]) globalWithState[GLOBAL_STATE_KEY] = /* @__PURE__ */ new Map();
	return globalWithState[GLOBAL_STATE_KEY];
}
function resolveManagerState(key) {
	const managers = getGlobalManagers();
	let state = managers.get(key);
	if (!state) {
		state = {
			cleanupRegistered: false,
			held: /* @__PURE__ */ new Map(),
			reclaimCleanupRegistered: false,
			reclaimGuards: /* @__PURE__ */ new Set()
		};
		managers.set(key, state);
	} else {
		state.reclaimCleanupRegistered ??= false;
		state.reclaimGuards ??= /* @__PURE__ */ new Set();
		for (const held of state.held.values()) held.refCount ??= 1;
	}
	return state;
}
function snapshotMatchesSync(lockPath, observed) {
	let fd;
	try {
		const beforeStat = fs.lstatSync(lockPath);
		if (!beforeStat.isFile()) return false;
		const openFlags = fs.constants.O_RDONLY | (process.platform !== "win32" && typeof fs.constants.O_NOFOLLOW === "number" ? fs.constants.O_NOFOLLOW : 0) | (typeof fs.constants.O_NONBLOCK === "number" ? fs.constants.O_NONBLOCK : 0);
		fd = fs.openSync(lockPath, openFlags);
		const openedStat = fs.fstatSync(fd);
		if (!openedStat.isFile()) return false;
		if (observed.raw !== void 0 && openedStat.size !== Buffer.byteLength(observed.raw)) return false;
		const raw = fs.readFileSync(fd, "utf8");
		const afterStat = fs.lstatSync(lockPath);
		if (!afterStat.isFile() || !sameFileIdentity(beforeStat, afterStat)) return false;
		return sidecarLockSnapshotMatches({
			raw,
			payload: null,
			stat: afterStat
		}, observed);
	} catch {
		return false;
	} finally {
		if (fd !== void 0) try {
			fs.closeSync(fd);
		} catch {}
	}
}
function releaseAllReclaimGuardsSync(state) {
	for (const reclaimGuardPath of state.reclaimGuards) try {
		fs.rmdirSync(reclaimGuardPath);
		state.reclaimGuards.delete(reclaimGuardPath);
	} catch {}
}
function releaseAllLocksSync(state) {
	for (const [normalizedTargetPath, held] of state.held) {
		held.handle.close().catch(() => void 0);
		try {
			if (!held.lockRoot && snapshotMatchesSync(held.lockPath, held.snapshot)) fs.rmSync(held.lockPath, { force: true });
		} catch {}
		state.held.delete(normalizedTargetPath);
	}
	releaseAllReclaimGuardsSync(state);
}
function ensureGlobalExitCleanupRegistered() {
	const globalWithCleanup = globalThis;
	if (globalWithCleanup[GLOBAL_CLEANUP_KEY]) return;
	globalWithCleanup[GLOBAL_CLEANUP_KEY] = true;
	const cleanup = () => {
		for (const state of getGlobalManagers().values()) releaseAllLocksSync(state);
	};
	globalWithCleanup[GLOBAL_CLEANUP_HANDLER_KEY] = cleanup;
	process.on("exit", cleanup);
}
async function releaseHeldLock(state, normalizedTargetPath, held, options = {}) {
	if (state.held.get(normalizedTargetPath) !== held) return false;
	if (options.force) held.refCount = 0;
	else {
		held.refCount -= 1;
		if (held.refCount > 0) return false;
	}
	if (held.releasePromise) {
		await held.releasePromise.catch(() => void 0);
		return true;
	}
	state.held.delete(normalizedTargetPath);
	if (held.compromiseTimer) {
		clearInterval(held.compromiseTimer);
		held.compromiseTimer = void 0;
	}
	held.releasePromise = (async () => {
		await held.handle.close().catch(() => void 0);
		await removeSidecarLockIfUnchanged(held.lockPath, held.snapshot, {
			lockRoot: held.lockRoot,
			parsePayload: held.parsePayload
		});
	})();
	try {
		await held.releasePromise;
		return true;
	} finally {
		held.releasePromise = void 0;
	}
}
function handleForHeldLock(state, normalizedTargetPath, held) {
	return createHeldSidecarLockHandle({
		normalizedTargetPath,
		held,
		release: async () => await releaseHeldLock(state, normalizedTargetPath, held)
	});
}
function createSidecarLockManager(key) {
	const state = resolveManagerState(key);
	function ensureExitCleanupRegistered() {
		state.cleanupRegistered = true;
		state.reclaimCleanupRegistered = true;
		ensureGlobalExitCleanupRegistered();
	}
	async function acquire(options) {
		return await acquireSidecarLock(options, {
			held: state.held,
			reclaimGuards: state.reclaimGuards,
			ensureExitCleanupRegistered,
			handleForHeldLock: (normalizedTargetPath, held) => handleForHeldLock(state, normalizedTargetPath, held),
			releaseHeldLock: async (normalizedTargetPath, held, releaseOptions) => await releaseHeldLock(state, normalizedTargetPath, held, releaseOptions)
		});
	}
	async function withLock(options, fn) {
		const lock = await acquire(options);
		try {
			return await fn();
		} finally {
			await lock.release();
		}
	}
	async function drain() {
		for (const [normalizedTargetPath, held] of Array.from(state.held.entries())) await releaseHeldLock(state, normalizedTargetPath, held, { force: true }).catch(() => void 0);
	}
	function reset() {
		releaseAllLocksSync(state);
	}
	function heldEntries() {
		return Array.from(state.held.entries()).map(([normalizedTargetPath, held]) => ({
			normalizedTargetPath,
			lockPath: held.lockPath,
			acquiredAt: held.acquiredAt,
			metadata: held.metadata,
			forceRelease: () => releaseHeldLock(state, normalizedTargetPath, held, { force: true })
		}));
	}
	return {
		acquire,
		withLock,
		drain,
		reset,
		heldEntries
	};
}
async function withSidecarLock(targetPath, options, fn) {
	const manager = createSidecarLockManager(options.managerKey ?? `fs-safe.sidecar-lock:${targetPath}`);
	const { managerKey: _managerKey, ...acquireOptions } = options;
	return await manager.withLock({
		...acquireOptions,
		targetPath
	}, fn);
}
//#endregion
export { readSidecarLockSnapshotSync as a, serializeSidecarLockPayload as c, removeNativeCreatedFileIfStillPinned as d, syncNativeFileBestEffort as f, sidecarLockPayloadCreatedAtMs as i, sidecarLockSnapshotMatches as l, withSidecarLock as n, relativeSidecarLockPath as o, writeNativeFd as p, computeSidecarLockDelayMs as r, removeSidecarLockIfUnchangedSync as s, createSidecarLockManager as t, getFsSafeTestHooks as u };
