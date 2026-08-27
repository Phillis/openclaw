import { a as isPathInside } from "./path-CYL8StfC.js";
import { n as resolvePathViaExistingAncestorSync } from "./root-path-existing-rEeDyvjI.js";
import { r as resolveRootPathSync } from "./root-path-DwpcxAp1.js";
import "./path-guards-CQdx2c2I.js";
import "./boundary-path-BPbNzRAg.js";
import { w as resolveStateDir } from "./paths-CqeDjSA4.js";
import { n as acquireGatewayLock, t as GatewayLockError } from "./gateway-lock-Bs6SwFpn.js";
import fs from "node:fs";
import path from "node:path";
//#region src/commands/doctor-sqlite-maintenance-lock.ts
/** Serializes offline SQLite maintenance against the Gateway state owner. */
const MAINTENANCE_LOCK_TIMEOUT_MS = 250;
const MAINTENANCE_LOCK_POLL_INTERVAL_MS = 25;
var DoctorSqliteMaintenanceLockUnavailableError = class extends Error {
	constructor(operation, cause) {
		super(`Cannot run ${operation} while the Gateway or another SQLite maintenance command owns this OpenClaw state directory. Stop the Gateway and retry.`);
		this.cause = cause;
		this.name = "DoctorSqliteMaintenanceLockUnavailableError";
	}
};
function assertMaintenancePathsOwnedByStateDir(env, operation, protectedPaths) {
	if (protectedPaths.length === 0) return;
	const stateDir = path.resolve(resolveStateDir(env));
	const stateCanonicalDir = resolvePathViaExistingAncestorSync(stateDir);
	for (const protectedPath of protectedPaths) {
		const absolutePath = path.resolve(protectedPath);
		try {
			if (!isPathInside(stateDir, absolutePath) && !isPathInside(stateCanonicalDir, absolutePath)) throw new Error("path is not lexically owned by the active state directory");
			resolveRootPathSync({
				absolutePath,
				boundaryLabel: "OpenClaw state directory",
				rootCanonicalPath: stateCanonicalDir,
				rootPath: stateDir
			});
		} catch (error) {
			throw new Error(`Cannot run ${operation} for a path outside the active OpenClaw state directory: ${protectedPath}. Set OPENCLAW_STATE_DIR to the owning state directory and retry.`, { cause: error });
		}
	}
	assertDoctorSqliteMaintenancePathsNotAliased(operation, protectedPaths, [stateDir]);
}
/** Reject file aliases that destructive SQLite maintenance would mutate in place. */
function assertDoctorSqliteMaintenancePathsNotAliased(operation, protectedPaths, ownershipRoots = []) {
	const resolvedRoots = ownershipRoots.map((candidate) => path.resolve(candidate));
	for (const protectedPath of new Set(protectedPaths.map((candidate) => path.resolve(candidate)))) {
		assertPathComponentsNotSymbolicLinks(operation, protectedPath, resolvedRoots);
		let stat;
		try {
			stat = fs.lstatSync(protectedPath);
		} catch (error) {
			if (error.code === "ENOENT") continue;
			throw error;
		}
		if (stat.isSymbolicLink()) throw new Error(`Cannot run ${operation} for a symbolic-link path: ${protectedPath}. Replace the symbolic link with an owned regular file and retry.`);
		if (stat.isFile() && stat.nlink > 1) throw new Error(`Cannot run ${operation} for a hard-linked path: ${protectedPath}. Remove the additional hard link and retry.`);
	}
}
function assertPathComponentsNotSymbolicLinks(operation, protectedPath, ownershipRoots) {
	const rootPath = ownershipRoots.find((candidate) => isPathInside(candidate, protectedPath));
	if (!rootPath) return;
	const relativePath = path.relative(rootPath, protectedPath);
	let currentPath = rootPath;
	for (const segment of relativePath.split(path.sep).filter(Boolean)) {
		currentPath = path.join(currentPath, segment);
		let stat;
		try {
			stat = fs.lstatSync(currentPath);
		} catch (error) {
			if (error.code === "ENOENT") return;
			throw error;
		}
		if (stat.isSymbolicLink()) throw new Error(`Cannot run ${operation} through a symbolic-link path component: ${currentPath}. Replace the symbolic link with an owned directory or regular file and retry.`);
	}
}
function isDestructiveDoctorSessionSqliteMode(mode) {
	return mode === "import" || mode === "compact" || mode === "restore" || mode === "recover";
}
/** Run one destructive doctor operation while excluding Gateway startup and peer maintenance. */
async function withDoctorSqliteMaintenanceLock(params, deps = {}) {
	const env = params.env ?? process.env;
	const acquireLock = deps.acquireLock ?? acquireGatewayLock;
	const lockOptions = deps.lockOptions;
	let lock;
	try {
		lock = await acquireLock({
			...lockOptions,
			allowInTests: true,
			env,
			pollIntervalMs: lockOptions?.pollIntervalMs ?? MAINTENANCE_LOCK_POLL_INTERVAL_MS,
			role: "sqlite-maintenance",
			timeoutMs: lockOptions?.timeoutMs ?? MAINTENANCE_LOCK_TIMEOUT_MS
		});
	} catch (error) {
		if (error instanceof GatewayLockError) throw new DoctorSqliteMaintenanceLockUnavailableError(params.operation, error);
		throw error;
	}
	if (!lock) throw new Error(`Cannot run ${params.operation} without exclusive OpenClaw state ownership.`);
	try {
		assertMaintenancePathsOwnedByStateDir(env, params.operation, params.protectedPaths ?? []);
		return await params.run();
	} finally {
		await lock.release();
	}
}
//#endregion
export { withDoctorSqliteMaintenanceLock as i, assertDoctorSqliteMaintenancePathsNotAliased as n, isDestructiveDoctorSessionSqliteMode as r, DoctorSqliteMaintenanceLockUnavailableError as t };
