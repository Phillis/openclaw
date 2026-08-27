import { F as resolveTimerTimeoutMs, I as resolveTimestampMsToIsoString, P as resolvePositiveTimerTimeoutMs } from "./number-coercion-oCkfUEEq.js";
import { f as resolveConfigPath, g as resolveGatewayLockDir, w as resolveStateDir } from "./paths-CqeDjSA4.js";
import { Rn as string, Tn as object, dn as literal, wn as number, yt as _enum } from "./schemas-C7gqXY2T.js";
import { o as tryAcquireExclusiveSqliteCoordinator } from "./node-sqlite-B9zMic_z.js";
import { o as sha256HexPrefixCore } from "./crypto-digest-PR8Utwzg.js";
import { t as safeParseJsonWithSchema } from "./zod-parse-Bip-sZi_.js";
import { n as createFileLockManager } from "./file-lock-SACs8h1J.js";
import { r as isPidAlive, t as getFileLockProcessStartTime } from "./pid-alive-ClLrY9h9.js";
import "./file-lock-manager-jkXU9xR_.js";
import { a as readWindowsProcessStartTimeSync, c as isOpenClawCommandArgv, i as readWindowsProcessArgsSync, l as parseProcCmdline, o as isGatewayArgv, s as isOpenClawArgv } from "./windows-port-pids-CMSygYlL.js";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { execFileSync } from "node:child_process";
//#region src/infra/gateway-lock.ts
const DEFAULT_TIMEOUT_MS = 5e3;
const DEFAULT_POLL_INTERVAL_MS = 100;
const DEFAULT_STALE_MS = 3e4;
const GATEWAY_LOCKS = createFileLockManager("openclaw.gateway-lock");
const LockPayloadSchema = object({
	pid: number(),
	ownerId: string().min(1).optional(),
	cronOwnerProjection: literal("dynamic-default-v1").optional(),
	createdAt: string(),
	configPath: string(),
	port: number().int().min(1).max(65535).optional(),
	role: _enum([
		"gateway",
		"agent-embedded",
		"skill-workshop-apply",
		"sqlite-maintenance"
	]).optional(),
	stateDir: string().optional(),
	startTime: number().optional()
});
function isSameGatewayLockIdentity(previous, current) {
	if (previous.ownerId && current.ownerId) return previous.ownerId === current.ownerId;
	return previous.pid === current.pid && previous.createdAt === current.createdAt && previous.startTime === current.startTime;
}
var GatewayLockError = class extends Error {
	constructor(message, cause) {
		super(message);
		this.cause = cause;
		this.name = "GatewayLockError";
	}
};
function readLinuxCmdline(pid) {
	try {
		return parseProcCmdline(fs.readFileSync(`/proc/${pid}/cmdline`, "utf8"));
	} catch {
		return null;
	}
}
const CMDLINE_EXEC_TIMEOUT_MS = 1e3;
function readWindowsCmdline(pid) {
	return readWindowsProcessArgsSync(pid, CMDLINE_EXEC_TIMEOUT_MS);
}
/**
* Read the command line of a macOS/BSD process via `ps`.
*
* `ps -o command=` outputs an unquoted flat string, so the naive whitespace
* split will misparse paths containing spaces. This is acceptable because
* standard macOS install paths do not contain spaces, and when the split
* does fail the caller falls back to "alive" (conservative).
*/
function readDarwinCmdline(pid) {
	try {
		const line = execFileSync("ps", [
			"-p",
			String(pid),
			"-o",
			"command="
		], {
			encoding: "utf8",
			timeout: CMDLINE_EXEC_TIMEOUT_MS,
			stdio: [
				"ignore",
				"pipe",
				"ignore"
			]
		}).trim();
		if (!line) return null;
		return line.split(/\s+/).filter(Boolean);
	} catch {
		return null;
	}
}
function readProcessStartTime(pid, platform) {
	if (platform !== process.platform) return null;
	return platform === "win32" ? readWindowsProcessStartTimeSync(pid, CMDLINE_EXEC_TIMEOUT_MS) : getFileLockProcessStartTime(pid);
}
function defaultReadProcessCmdline(pid, platform) {
	if (platform === "linux") return readLinuxCmdline(pid);
	if (platform === "win32") return readWindowsCmdline(pid);
	if (platform === "darwin") return readDarwinCmdline(pid);
	return null;
}
async function resolveGatewayOwnerStatus(pid, payload, platform, readCmdline, readStartTime, opts = {}) {
	const role = payload?.role ?? "gateway";
	if (!isPidAlive(pid)) return "dead";
	const payloadStartTime = payload?.startTime;
	if (Number.isFinite(payloadStartTime)) {
		const currentStartTime = (readStartTime ?? ((ownerPid) => readProcessStartTime(ownerPid, platform)))(pid);
		if (currentStartTime != null) return currentStartTime === payloadStartTime ? "alive" : "dead";
	}
	const readFn = readCmdline ?? ((p) => defaultReadProcessCmdline(p, platform));
	if (role === "agent-embedded" || role === "sqlite-maintenance" || role === "skill-workshop-apply") {
		const args = readFn(pid);
		if (!args) return "unknown";
		if (role === "agent-embedded") return isOpenClawArgv(args) ? "alive" : "dead";
		return isOpenClawCommandArgv(args, role === "sqlite-maintenance" ? "doctor" : "skills") ? "alive" : "dead";
	}
	const args = readFn(pid);
	if (!args) return platform === "linux" || opts.trustUnknownCmdlineOwner === false ? "unknown" : "alive";
	return isGatewayArgv(args, { allowGatewayBinary: true }) ? "alive" : "dead";
}
async function readLockPayload(lockPath) {
	try {
		return parseGatewayLockPayload(await fs$1.readFile(lockPath, "utf8"));
	} catch {
		return null;
	}
}
function parseGatewayLockPayload(raw) {
	return safeParseJsonWithSchema(LockPayloadSchema, raw);
}
async function shouldReclaimGatewayLock(params) {
	const ownerPid = params.payload?.pid;
	const ownerStatus = ownerPid ? await resolveGatewayOwnerStatus(ownerPid, params.payload, params.platform, params.readProcessCmdline, params.readProcessStartTime) : "unknown";
	if (ownerPid) return ownerStatus === "dead";
	if (params.payload?.createdAt) {
		const createdAt = Date.parse(params.payload.createdAt);
		if (Number.isFinite(createdAt) && params.now() - createdAt > params.staleMs) return true;
	}
	try {
		const stat = await fs$1.stat(params.lockPath);
		return params.now() - stat.mtimeMs > params.staleMs;
	} catch {
		return false;
	}
}
function canonicalizeStateDir(stateDir) {
	const resolved = path.resolve(stateDir);
	try {
		return fs.realpathSync.native(resolved);
	} catch {
		const missingSegments = [];
		let current = resolved;
		while (true) {
			const parent = path.dirname(current);
			if (parent === current) return resolved;
			missingSegments.push(path.basename(current));
			current = parent;
			try {
				return path.join(fs.realpathSync.native(current), ...missingSegments.toReversed());
			} catch {}
		}
	}
}
function resolveGatewayLockPaths(env, suppliedLockDir) {
	const resolvedStateDir = resolveStateDir(env);
	const stateDir = canonicalizeStateDir(resolvedStateDir);
	const lockDir = suppliedLockDir ?? resolveGatewayLockDir(stateDir);
	const configPath = resolveConfigPath(env, resolvedStateDir);
	const configHash = sha256HexPrefixCore(configPath, 8);
	return {
		configLockPath: path.join(lockDir, `gateway.${configHash}.lock`),
		configPath,
		stateDir,
		stateLockPath: path.join(lockDir, "gateway.state.lock")
	};
}
async function readActiveGatewayLockPort(opts = {}) {
	return (await readActiveGatewayLockIdentity(opts))?.port;
}
async function readActiveGatewayLockIdentity(opts = {}) {
	const { configLockPath, stateLockPath } = resolveGatewayLockPaths(opts.env ?? process.env, opts.lockDir);
	return await readVerifiedGatewayLockIdentity(configLockPath, opts) ?? await readVerifiedGatewayLockIdentity(stateLockPath, opts);
}
async function readVerifiedGatewayLockIdentity(lockPath, opts) {
	const payload = await readLockPayload(lockPath);
	if (!payload?.port || payload.role && payload.role !== "gateway") return;
	if (await resolveGatewayOwnerStatus(payload.pid, payload, opts.platform ?? process.platform, opts.readProcessCmdline, opts.readProcessStartTime, { trustUnknownCmdlineOwner: false }) !== "alive") return;
	return {
		pid: payload.pid,
		...payload.ownerId ? { ownerId: payload.ownerId } : {},
		...payload.cronOwnerProjection ? { cronOwnerProjection: payload.cronOwnerProjection } : {},
		createdAt: payload.createdAt,
		port: payload.port,
		...payload.startTime !== void 0 ? { startTime: payload.startTime } : {}
	};
}
async function acquireGatewayLock(opts = {}) {
	const env = opts.env ?? process.env;
	if (!(opts.allowInTests === true) && (env.VITEST || env.NODE_ENV === "test")) return null;
	const role = opts.role ?? "gateway";
	const ownerId = randomUUID();
	const paths = resolveGatewayLockPaths(env, opts.lockDir);
	const stateLock = await acquireLockFile({
		...opts,
		configPath: paths.configPath,
		env,
		lockPath: paths.stateLockPath,
		role,
		stateDir: paths.stateDir,
		ownerId
	});
	if (!(role !== "gateway" || env.OPENCLAW_ALLOW_MULTI_GATEWAY !== "1")) return {
		...stateLock,
		stateLockPath: stateLock.lockPath
	};
	try {
		const configLock = await acquireLockFile({
			...opts,
			configPath: paths.configPath,
			env,
			lockPath: paths.configLockPath,
			role,
			stateDir: paths.stateDir,
			ownerId
		});
		return {
			...configLock,
			stateLockPath: stateLock.lockPath,
			release: async () => {
				let releaseError;
				try {
					await configLock.release();
				} catch (error) {
					releaseError = error instanceof Error ? error : new GatewayLockError("failed to release config lock", error);
				}
				try {
					await stateLock.release();
				} catch (error) {
					releaseError ??= error instanceof Error ? error : new GatewayLockError("failed to release state lock", error);
				}
				if (releaseError) throw releaseError;
			}
		};
	} catch (error) {
		await stateLock.release().catch(() => void 0);
		throw error;
	}
}
async function acquireLockFile(opts) {
	const timeoutMs = resolveTimerTimeoutMs(opts.timeoutMs, DEFAULT_TIMEOUT_MS, 0);
	const pollIntervalMs = resolvePositiveTimerTimeoutMs(opts.pollIntervalMs, DEFAULT_POLL_INTERVAL_MS);
	const staleMs = resolveTimerTimeoutMs(opts.staleMs, DEFAULT_STALE_MS, 0);
	const platform = opts.platform ?? process.platform;
	const now = opts.now ?? Date.now;
	const sleep = opts.sleep ?? (async (ms) => await new Promise((resolve) => {
		setTimeout(resolve, ms);
	}));
	const { configPath, lockPath, stateDir } = opts;
	await fs$1.mkdir(path.dirname(lockPath), { recursive: true });
	const startedAt = now();
	let lastPayload = null;
	const buildPayload = () => {
		const startTime = (opts.readProcessStartTime ?? ((pid) => readProcessStartTime(pid, platform)))(process.pid);
		return {
			pid: process.pid,
			ownerId: opts.ownerId,
			...opts.role === "gateway" ? { cronOwnerProjection: "dynamic-default-v1" } : {},
			createdAt: resolveTimestampMsToIsoString(now()),
			configPath,
			stateDir,
			...typeof opts.port === "number" && Number.isInteger(opts.port) && opts.port > 0 && opts.port <= 65535 ? { port: opts.port } : {},
			...opts.role !== "gateway" ? { role: opts.role } : {},
			...typeof startTime === "number" && Number.isFinite(startTime) ? { startTime } : {}
		};
	};
	const shouldReclaim = (payload) => shouldReclaimGatewayLock({
		lockPath,
		payload,
		staleMs,
		now,
		platform,
		readProcessCmdline: opts.readProcessCmdline,
		readProcessStartTime: opts.readProcessStartTime
	});
	while (now() - startedAt < timeoutMs) {
		let coordinator;
		try {
			coordinator = tryAcquireExclusiveSqliteCoordinator(`${lockPath}.sqlite`);
		} catch (error) {
			throw new GatewayLockError(`failed to acquire gateway lock at ${lockPath}`, error);
		}
		if (!coordinator) lastPayload = await readLockPayload(lockPath);
		else try {
			const lock = await GATEWAY_LOCKS.acquire(lockPath, {
				lockPath,
				staleMs,
				timeoutMs: 0,
				retry: { retries: 0 },
				staleRecovery: "remove-if-unchanged",
				payload: buildPayload,
				parsePayload: parseGatewayLockPayload,
				shouldReclaim: ({ payload }) => shouldReclaim(payload),
				shouldRemoveStaleLock: ({ payload }) => shouldReclaim(payload)
			});
			return {
				lockPath,
				configPath,
				release: async () => {
					let releaseError;
					await lock.release().catch((error) => {
						releaseError = error;
					});
					try {
						coordinator.release();
					} catch (error) {
						releaseError ??= error;
					}
					if (releaseError) throw new GatewayLockError(`failed to release gateway lock at ${lockPath}`, releaseError);
				}
			};
		} catch (error) {
			coordinator.release();
			const code = error.code;
			if (code !== "file_lock_timeout" && code !== "file_lock_stale") throw new GatewayLockError(`failed to acquire gateway lock at ${lockPath}`, error);
			lastPayload = await readLockPayload(lockPath);
		}
		const remainingMs = timeoutMs - (now() - startedAt);
		if (remainingMs <= 0) break;
		await sleep(Math.min(pollIntervalMs, remainingMs));
	}
	const ownerPid = lastPayload?.pid ? ` (pid ${lastPayload.pid})` : "";
	throw new GatewayLockError(`${lastPayload?.role === "agent-embedded" ? `another embedded OpenClaw state writer is active${ownerPid}` : lastPayload?.role && lastPayload.role !== "gateway" ? `state directory is locked by ${lastPayload.role}${ownerPid}` : `gateway already running${ownerPid}`}; lock timeout after ${timeoutMs}ms`);
}
//#endregion
export { readActiveGatewayLockPort as a, readActiveGatewayLockIdentity as i, acquireGatewayLock as n, isSameGatewayLockIdentity as r, GatewayLockError as t };
