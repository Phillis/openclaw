import { n as resolvePathViaExistingAncestorSync } from "./root-path-existing-CLr-7fqF.js";
import "./boundary-path-DDLrDh1C.js";
import { o as tryAcquireExclusiveSqliteCoordinator } from "./node-sqlite-_e3IvfT7.js";
import { o as sha256HexPrefixCore } from "./crypto-digest-IGAbV2KW.js";
import fs, { chmodSync, statSync, unlinkSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { randomUUID } from "node:crypto";
//#region src/infra/private-mode.ts
const CHMOD_UNSUPPORTED_CODES = /* @__PURE__ */ new Set([
	"ENOTSUP",
	"EOPNOTSUPP",
	"EINVAL"
]);
const PRIVATE_PROBE_FILE_MODE = 384;
function hasRestrictivePermissions(target) {
	try {
		return (statSync(target).mode & 63) === 0;
	} catch {
		return false;
	}
}
function filesystemRejectsChmod(target) {
	let probePath;
	try {
		const probeDir = statSync(target).isDirectory() ? target : path.dirname(target);
		probePath = path.join(probeDir, `.openclaw-chmod-probe-${randomUUID()}`);
		writeFileSync(probePath, "", {
			flag: "wx",
			mode: PRIVATE_PROBE_FILE_MODE
		});
	} catch {
		return false;
	}
	try {
		chmodSync(probePath, PRIVATE_PROBE_FILE_MODE);
		return false;
	} catch (err) {
		return err.code === "EPERM";
	} finally {
		try {
			unlinkSync(probePath);
		} catch {}
	}
}
function canIgnorePrivateChmodError(target, code) {
	if (code && CHMOD_UNSUPPORTED_CODES.has(code)) return true;
	if (code === "EROFS") return hasRestrictivePermissions(target);
	if (code !== "EPERM") return false;
	return hasRestrictivePermissions(target) || filesystemRejectsChmod(target);
}
/**
* Applies a private POSIX mode, reporting unsupported filesystems without
* weakening real permission failures.
*/
function applyPrivateModeSync(target, mode) {
	try {
		chmodSync(target, mode);
		return { applied: true };
	} catch (err) {
		if (!canIgnorePrivateChmodError(target, err.code)) throw err;
		return {
			applied: false,
			error: err
		};
	}
}
//#endregion
//#region src/infra/sqlite-coordinator.ts
var SqliteCoordinatorError = class extends Error {
	constructor(message, cause) {
		super(message);
		this.cause = cause;
		this.name = "SqliteCoordinatorError";
	}
};
function createSqliteLifecycleAggregateError(errors, message, cause) {
	return new AggregateError(errors, message, { cause });
}
function runWithSqliteCoordinator(coordinator, operationLabel, operation) {
	let result;
	try {
		result = operation();
		if (result && typeof result.then === "function") throw new SqliteCoordinatorError(`${operationLabel} must remain synchronous`);
	} catch (operationError) {
		let releaseFailed = false;
		let releaseError;
		try {
			coordinator.release();
		} catch (error) {
			releaseFailed = true;
			releaseError = error;
		}
		if (releaseFailed) throw createSqliteLifecycleAggregateError([operationError, releaseError], `${operationLabel} and coordinator release both failed`, operationError);
		throw operationError;
	}
	try {
		coordinator.release();
	} catch (releaseError) {
		throw new SqliteCoordinatorError(`${operationLabel} completed, but releasing its coordinator failed`, releaseError);
	}
	return result;
}
function ensurePrivateSqliteCoordinatorDirectory(directoryPath, coordinatorLabel) {
	try {
		fs.mkdirSync(directoryPath, {
			mode: 448,
			recursive: true
		});
	} catch (error) {
		if (error.code !== "EEXIST") throw error;
	}
	const stats = fs.lstatSync(directoryPath);
	if (stats.isSymbolicLink() || !stats.isDirectory()) throw new SqliteCoordinatorError(`${coordinatorLabel} directory must be a real directory`);
	const uid = typeof process.getuid === "function" ? process.getuid() : void 0;
	if (uid !== void 0 && stats.uid !== uid) throw new SqliteCoordinatorError(`${coordinatorLabel} directory belongs to another user`);
	if (process.platform !== "win32") {
		applyPrivateModeSync(directoryPath, 448);
		const secured = fs.lstatSync(directoryPath);
		if (secured.isSymbolicLink() || !secured.isDirectory() || (secured.mode & 63) !== 0) throw new SqliteCoordinatorError(`${coordinatorLabel} directory permissions are not private`);
	}
}
//#endregion
//#region src/infra/state-database-coordinator.ts
const heldCoordinators = /* @__PURE__ */ new Map();
var StateDatabaseCoordinatorContentionError = class extends SqliteCoordinatorError {
	constructor(family) {
		super(`another OpenClaw process owns ${family}`);
		this.name = "StateDatabaseCoordinatorContentionError";
	}
};
function resolveStateLifecycleRuntimeDirectory() {
	return process.platform === "win32" ? path.join(os.homedir(), "AppData", "Local", "OpenClaw", "locks") : "/tmp";
}
function resolveLifecycleCoordinatorPath(family, params) {
	const canonicalDatabasePath = resolvePathViaExistingAncestorSync(params.databasePath);
	const canonicalRuntimeDirectory = resolvePathViaExistingAncestorSync(params.runtimeDirectory);
	const suffix = params.uid === void 0 ? "openclaw-state-locks" : `openclaw-state-locks-${params.uid}`;
	return path.join(canonicalRuntimeDirectory, suffix, `${family}.${sha256HexPrefixCore(canonicalDatabasePath, 8)}.lock.sqlite`);
}
function resolveStateDatabaseCoordinatorPath(params) {
	return resolveLifecycleCoordinatorPath("state-lifecycle", params);
}
function acquireLifecycleCoordinator(family, params) {
	const coordinatorPath = params.coordinatorPath ?? resolveLifecycleCoordinatorPath(family, {
		databasePath: params.databasePath,
		runtimeDirectory: params.runtimeDirectory ?? resolveStateLifecycleRuntimeDirectory(),
		uid: params.uid ?? (typeof process.getuid === "function" ? process.getuid() : void 0)
	});
	const held = heldCoordinators.get(coordinatorPath);
	if (held) held.references += 1;
	else {
		ensurePrivateSqliteCoordinatorDirectory(path.dirname(coordinatorPath), `${family} coordinator`);
		const coordinator = tryAcquireExclusiveSqliteCoordinator(coordinatorPath, { busyTimeoutMs: params.busyTimeoutMs });
		if (!coordinator) throw new StateDatabaseCoordinatorContentionError(family);
		heldCoordinators.set(coordinatorPath, {
			coordinator,
			references: 1
		});
	}
	let released = false;
	return {
		path: coordinatorPath,
		release: () => {
			if (released) return;
			released = true;
			const current = heldCoordinators.get(coordinatorPath);
			if (!current) return;
			current.references -= 1;
			if (current.references > 0) return;
			heldCoordinators.delete(coordinatorPath);
			try {
				current.coordinator.release();
			} catch (error) {
				throw new SqliteCoordinatorError(`failed to release ${family} coordinator`, error);
			}
		}
	};
}
function acquireGatewayLifecycleCoordinator(params) {
	return acquireLifecycleCoordinator("gateway-lifecycle", params);
}
function acquireStateDatabaseCoordinator(params) {
	return acquireLifecycleCoordinator("state-lifecycle", params);
}
//#endregion
export { resolveStateLifecycleRuntimeDirectory as a, ensurePrivateSqliteCoordinatorDirectory as c, resolveStateDatabaseCoordinatorPath as i, runWithSqliteCoordinator as l, acquireGatewayLifecycleCoordinator as n, SqliteCoordinatorError as o, acquireStateDatabaseCoordinator as r, createSqliteLifecycleAggregateError as s, StateDatabaseCoordinatorContentionError as t, applyPrivateModeSync as u };
