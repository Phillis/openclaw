import "./paths-CqeDjSA4.js";
import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.js";
import { r as isPidAlive, t as getFileLockProcessStartTime } from "./pid-alive-ClLrY9h9.js";
import { v as tryBeginGatewaySuspendAdmission } from "./gateway-work-admission-QDz202p9.js";
import { pc as GATEWAY_SUSPEND_MODE_LEGACY } from "./src-Bo4ezI_n.js";
import { t as createGatewayActiveWorkSnapshot } from "./gateway-active-work-uWcRcsjE.js";
import { createHash, randomUUID } from "node:crypto";
import { closeSync, constants, fstatSync, fsyncSync, linkSync, openSync, readFileSync, renameSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
//#region src/infra/gateway-suspend-coordinator-contract.ts
const GATEWAY_SCHEDULER_RECOVERY_RETRY_MS = 1e3;
function schedulerRecoveryResult() {
	return {
		status: "recovering",
		reason: "scheduler-resume-failed",
		retryAfterMs: GATEWAY_SCHEDULER_RECOVERY_RETRY_MS
	};
}
function resumeSchedulerRecoveryResult() {
	return {
		ok: false,
		reason: "scheduler-resume-failed",
		retryAfterMs: GATEWAY_SCHEDULER_RECOVERY_RETRY_MS
	};
}
function resolveGatewaySuspendMode(value) {
	if (value === void 0 || value === "legacy-auto-expire/v1") return GATEWAY_SUSPEND_MODE_LEGACY;
	return value === "handoff-durable-hold/v1" ? value : null;
}
//#endregion
//#region src/infra/gateway-suspend-durable-storage.ts
function syncDirectory(path) {
	const descriptor = openSync(path, constants.O_RDONLY);
	try {
		fsyncSync(descriptor);
	} finally {
		closeSync(descriptor);
	}
}
function assertPrivateHandoffStat(stat, allowedLinkCount = 1) {
	if (!stat.isFile() || stat.nlink !== allowedLinkCount || (stat.mode & 63) !== 0 || typeof process.getuid === "function" && stat.uid !== process.getuid()) throw new Error("gateway suspension handoff must be a private owner-controlled regular file");
}
function readPrivateDurableFileOnce(path, allowedLinkCounts = [1]) {
	const descriptor = openSync(path, constants.O_RDONLY | constants.O_NOFOLLOW);
	try {
		const before = fstatSync(descriptor);
		if (!allowedLinkCounts.includes(before.nlink)) throw new Error("gateway suspension handoff has an invalid link count");
		assertPrivateHandoffStat(before, before.nlink);
		const bytes = readFileSync(descriptor);
		const after = fstatSync(descriptor);
		if (before.dev !== after.dev || before.ino !== after.ino || before.size !== after.size || before.mtimeMs !== after.mtimeMs || before.ctimeMs !== after.ctimeMs) throw new Error("gateway suspension handoff changed while it was read");
		return {
			bytes,
			stat: after
		};
	} finally {
		closeSync(descriptor);
	}
}
function readPrivateDurableBytesOnce(path) {
	return readPrivateDurableFileOnce(path).bytes;
}
function readPrivateDurableBytes(path) {
	try {
		return readPrivateDurableBytesOnce(path);
	} catch (error) {
		if (error.code !== "ENOENT") throw error;
		syncDirectory(dirname(path));
		try {
			return readPrivateDurableBytesOnce(path);
		} catch (retryError) {
			if (retryError.code === "ENOENT") return null;
			throw retryError;
		}
	}
}
function provePrivateDurableBytes(path, expectedBytes) {
	const descriptor = openSync(path, constants.O_RDONLY | constants.O_NOFOLLOW);
	let synced;
	try {
		assertPrivateHandoffStat(fstatSync(descriptor));
		fsyncSync(descriptor);
		synced = fstatSync(descriptor);
		assertPrivateHandoffStat(synced);
	} finally {
		closeSync(descriptor);
	}
	syncDirectory(dirname(path));
	const currentDescriptor = openSync(path, constants.O_RDONLY | constants.O_NOFOLLOW);
	try {
		const current = fstatSync(currentDescriptor);
		assertPrivateHandoffStat(current);
		const actual = readFileSync(currentDescriptor);
		const after = fstatSync(currentDescriptor);
		if (synced.dev !== current.dev || synced.ino !== current.ino || synced.size !== current.size || synced.mtimeMs !== current.mtimeMs || synced.ctimeMs !== current.ctimeMs || current.dev !== after.dev || current.ino !== after.ino || current.size !== after.size || current.mtimeMs !== after.mtimeMs || current.ctimeMs !== after.ctimeMs || !actual.equals(expectedBytes)) throw new Error("gateway suspension handoff changed during durability proof");
	} finally {
		closeSync(currentDescriptor);
	}
}
function persistPrivateDurableBytes(path, bytes) {
	if (!Buffer.isBuffer(bytes) || bytes.length === 0) throw new Error("private durable file bytes are required");
	compareAndSwapPrivateDurableBytes(path, null, bytes);
}
function recoverPrivateDurableBytesCompareAndSwap(path, isValidReplacement, options = {}) {
	const lockPath = `${path}.cas-lock`;
	const oldPath = `${path}.cas-old`;
	const candidatePath = `${path}.cas-new`;
	let lockBytes;
	try {
		lockBytes = readPrivateDurableBytesOnce(lockPath);
	} catch (error) {
		if (error.code === "ENOENT") return;
		throw error;
	}
	let lockValue;
	try {
		lockValue = JSON.parse(lockBytes.toString("utf8"));
	} catch {
		throw new Error("private durable file CAS lock is malformed");
	}
	if (!isRecord(lockValue) || Object.keys(lockValue).toSorted().join(",") !== "expectedSha256,operation,ownerPid,ownerStartTime,replacementSha256,schema,txId" || lockValue.schema !== "openclaw-private-durable-cas/v2" || lockValue.operation !== "replace" && lockValue.operation !== "delete" || typeof lockValue.txId !== "string" || !/^[a-f0-9-]{36}$/u.test(lockValue.txId) || !Number.isSafeInteger(lockValue.ownerPid) || Number(lockValue.ownerPid) < 1 || lockValue.ownerStartTime !== null && (!Number.isSafeInteger(lockValue.ownerStartTime) || Number(lockValue.ownerStartTime) < 0) || lockValue.expectedSha256 !== null && (typeof lockValue.expectedSha256 !== "string" || !/^[a-f0-9]{64}$/u.test(lockValue.expectedSha256)) || lockValue.replacementSha256 !== null && (typeof lockValue.replacementSha256 !== "string" || !/^[a-f0-9]{64}$/u.test(lockValue.replacementSha256)) || lockValue.operation === "replace" && lockValue.replacementSha256 === null || lockValue.operation === "delete" && lockValue.replacementSha256 !== null) throw new Error("private durable file CAS lock is invalid");
	const ownerPid = Number(lockValue.ownerPid);
	const ownerStartTime = lockValue.ownerStartTime === null ? null : Number(lockValue.ownerStartTime);
	if (!options.allowLiveOwner && isPidAlive(ownerPid)) {
		const observedStartTime = getFileLockProcessStartTime(ownerPid);
		if (ownerPid === process.pid || ownerStartTime === null || observedStartTime === null || ownerStartTime === observedStartTime) throw new Error("private durable file CAS is owned by a live process");
	}
	const expectedSha256 = lockValue.expectedSha256;
	const replacementSha256 = lockValue.replacementSha256;
	const operation = lockValue.operation;
	const readOptional = (candidate, allowedLinkCounts = [1]) => {
		try {
			return readPrivateDurableFileOnce(candidate, allowedLinkCounts);
		} catch (error) {
			if (error.code === "ENOENT") return null;
			throw error;
		}
	};
	const current = readOptional(path, [1, 2]);
	const old = readOptional(oldPath, [1, 2]);
	const candidate = readOptional(candidatePath, [1, 2]);
	const digest = (bytes) => createHash("sha256").update(bytes).digest("hex");
	if (current === null && old !== null) {
		if (expectedSha256 === null || digest(old.bytes) !== expectedSha256) throw new Error("private durable file CAS old bytes do not match the transaction");
		if (operation === "delete") {
			if (candidate !== null) throw new Error("private durable file delete CAS unexpectedly has a candidate");
			unlinkSync(oldPath);
			unlinkSync(lockPath);
			syncDirectory(dirname(path));
			return;
		}
		renameSync(oldPath, path);
		if (candidate !== null) unlinkSync(candidatePath);
		unlinkSync(lockPath);
		syncDirectory(dirname(path));
		provePrivateDurableBytes(path, old.bytes);
		return;
	}
	if (current === null) {
		if (operation === "delete") {
			if (candidate !== null) throw new Error("private durable file delete CAS unexpectedly has a candidate");
			unlinkSync(lockPath);
			syncDirectory(dirname(path));
			return;
		}
		if (candidate !== null) unlinkSync(candidatePath);
		unlinkSync(lockPath);
		syncDirectory(dirname(path));
		return;
	}
	const currentSha256 = digest(current.bytes);
	if (old === null) {
		if (operation === "delete") {
			if (expectedSha256 !== null && currentSha256 === expectedSha256 && candidate === null) {
				unlinkSync(lockPath);
				syncDirectory(dirname(path));
				provePrivateDurableBytes(path, current.bytes);
				return;
			}
			throw new Error("private durable file delete CAS has an invalid recovery state");
		}
		if (currentSha256 === replacementSha256 && (candidate === null || current.stat.dev === candidate.stat.dev && current.stat.ino === candidate.stat.ino)) {
			if (candidate !== null) unlinkSync(candidatePath);
			unlinkSync(lockPath);
			syncDirectory(dirname(path));
			provePrivateDurableBytes(path, current.bytes);
			return;
		}
		if (currentSha256 === expectedSha256 && candidate === null) {
			unlinkSync(lockPath);
			syncDirectory(dirname(path));
			provePrivateDurableBytes(path, current.bytes);
			return;
		}
		if (currentSha256 === expectedSha256 && candidate !== null && digest(candidate.bytes) === replacementSha256) {
			unlinkSync(candidatePath);
			unlinkSync(lockPath);
			syncDirectory(dirname(path));
			provePrivateDurableBytes(path, current.bytes);
			return;
		}
		throw new Error("private durable file CAS has an invalid create-only recovery state");
	}
	const oldSha256 = digest(old.bytes);
	if (expectedSha256 === null || oldSha256 !== expectedSha256) throw new Error("private durable file CAS old bytes do not match the transaction");
	if (operation === "delete") {
		if (candidate !== null) throw new Error("private durable file delete CAS unexpectedly has a candidate");
		if (current.stat.dev === old.stat.dev && current.stat.ino === old.stat.ino && currentSha256 === expectedSha256) {
			unlinkSync(oldPath);
			unlinkSync(lockPath);
			syncDirectory(dirname(path));
			provePrivateDurableBytes(path, current.bytes);
			return;
		}
		throw new Error("private durable file delete CAS contains a mismatched target");
	}
	if (current.stat.dev === old.stat.dev && current.stat.ino === old.stat.ino && currentSha256 === expectedSha256 && candidate !== null && digest(candidate.bytes) === replacementSha256) {
		unlinkSync(candidatePath);
		unlinkSync(oldPath);
		unlinkSync(lockPath);
		syncDirectory(dirname(path));
		provePrivateDurableBytes(path, current.bytes);
		return;
	}
	if (currentSha256 === replacementSha256 && candidate === null && isValidReplacement(old.bytes, current.bytes)) {
		unlinkSync(oldPath);
		unlinkSync(lockPath);
		syncDirectory(dirname(path));
		provePrivateDurableBytes(path, current.bytes);
		return;
	}
	throw new Error("private durable file CAS contains a mismatched replacement");
}
function isRecord(value) {
	return value !== null && typeof value === "object" && !Array.isArray(value);
}
function writePrivateDurableCandidate(path, bytes) {
	const descriptor = openSync(path, constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | constants.O_NOFOLLOW, 384);
	try {
		writeFileSync(descriptor, bytes);
		fsyncSync(descriptor);
	} finally {
		closeSync(descriptor);
	}
}
function compareAndSwapPrivateDurableBytes(path, expectedBytes, replacementBytes) {
	if (!Buffer.isBuffer(replacementBytes) || replacementBytes.length === 0) throw new Error("private durable replacement bytes are required");
	const candidatePath = `${path}.cas-new`;
	const oldPath = `${path}.cas-old`;
	const lockPath = `${path}.cas-lock`;
	const digest = (bytes) => createHash("sha256").update(bytes).digest("hex");
	writePrivateDurableCandidate(lockPath, Buffer.from(`${JSON.stringify({
		expectedSha256: expectedBytes === null ? null : digest(expectedBytes),
		operation: "replace",
		ownerPid: process.pid,
		ownerStartTime: getFileLockProcessStartTime(process.pid),
		replacementSha256: digest(replacementBytes),
		schema: "openclaw-private-durable-cas/v2",
		txId: randomUUID()
	})}\n`, "utf8"));
	syncDirectory(dirname(path));
	writePrivateDurableCandidate(candidatePath, replacementBytes);
	try {
		if (expectedBytes === null) {
			if (readPrivateDurableBytes(path) !== null) {
				unlinkSync(candidatePath);
				unlinkSync(lockPath);
				syncDirectory(dirname(path));
				throw new Error("private durable file already exists before create-only CAS");
			}
			linkSync(candidatePath, path);
			syncDirectory(dirname(path));
			unlinkSync(candidatePath);
			syncDirectory(dirname(path));
			provePrivateDurableBytes(path, replacementBytes);
			unlinkSync(lockPath);
			syncDirectory(dirname(path));
			return;
		}
		linkSync(path, oldPath);
		const current = readPrivateDurableFileOnce(path, [2]);
		const old = readPrivateDurableFileOnce(oldPath, [2]);
		if (current.stat.dev !== old.stat.dev || current.stat.ino !== old.stat.ino || !current.bytes.equals(expectedBytes) || !old.bytes.equals(expectedBytes)) throw new Error("private durable file changed before CAS replacement");
		syncDirectory(dirname(path));
		renameSync(candidatePath, path);
		syncDirectory(dirname(path));
		provePrivateDurableBytes(path, replacementBytes);
		unlinkSync(oldPath);
		unlinkSync(lockPath);
		syncDirectory(dirname(path));
	} catch (error) {
		try {
			recoverPrivateDurableBytesCompareAndSwap(path, (previousBytes, currentBytes) => expectedBytes !== null && previousBytes.equals(expectedBytes) && currentBytes.equals(replacementBytes), { allowLiveOwner: true });
			if (readPrivateDurableBytes(path)?.equals(replacementBytes)) {
				provePrivateDurableBytes(path, replacementBytes);
				return;
			}
		} catch {}
		throw error;
	}
}
function deletePrivateDurableBytesCompareAndSwap(path, expectedBytes, options = {}) {
	if (!Buffer.isBuffer(expectedBytes) || expectedBytes.length === 0) throw new Error("private durable delete expected bytes are required");
	const oldPath = `${path}.cas-old`;
	const lockPath = `${path}.cas-lock`;
	const expectedSha256 = createHash("sha256").update(expectedBytes).digest("hex");
	writePrivateDurableCandidate(lockPath, Buffer.from(`${JSON.stringify({
		expectedSha256,
		operation: "delete",
		ownerPid: process.pid,
		ownerStartTime: getFileLockProcessStartTime(process.pid),
		replacementSha256: null,
		schema: "openclaw-private-durable-cas/v2",
		txId: randomUUID()
	})}\n`, "utf8"));
	syncDirectory(dirname(path));
	try {
		linkSync(path, oldPath);
		let current = readPrivateDurableFileOnce(path, [2]);
		let old = readPrivateDurableFileOnce(oldPath, [2]);
		if (current.stat.dev !== old.stat.dev || current.stat.ino !== old.stat.ino || !current.bytes.equals(expectedBytes) || !old.bytes.equals(expectedBytes)) throw new Error("private durable file changed before CAS deletion");
		syncDirectory(dirname(path));
		options.beforeDeleteCommit?.();
		current = readPrivateDurableFileOnce(path, [1, 2]);
		old = readPrivateDurableFileOnce(oldPath, [1, 2]);
		if (current.stat.dev !== old.stat.dev || current.stat.ino !== old.stat.ino || !current.bytes.equals(expectedBytes) || !old.bytes.equals(expectedBytes)) throw new Error("private durable file changed at the CAS deletion boundary");
		unlinkSync(path);
		syncDirectory(dirname(path));
		provePrivateDurableBytes(oldPath, expectedBytes);
		unlinkSync(oldPath);
		unlinkSync(lockPath);
		syncDirectory(dirname(path));
	} catch (error) {
		try {
			recoverPrivateDurableBytesCompareAndSwap(path, () => false, { allowLiveOwner: true });
			if (readPrivateDurableBytes(path) === null) return;
		} catch {}
		throw error;
	}
}
function syncPrivateDurableParentDirectory(path) {
	syncDirectory(dirname(path));
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.gatewaySuspendHandoffTestApi")] = { deletePrivateDurableBytesCompareAndSwap };
//#endregion
//#region src/infra/gateway-suspend-handoff.ts
const GATEWAY_SUSPEND_HANDOFF_SCHEMA_LEGACY = "openclaw-gateway-suspend-handoff/v2";
const GATEWAY_SUSPEND_HANDOFF_SCHEMA_DURABLE = "openclaw-gateway-suspend-handoff/v3";
function createGatewaySuspendHandoff(value) {
	const { suspendMode, ...handoff } = value;
	return suspendMode === "handoff-durable-hold/v1" ? {
		schema: GATEWAY_SUSPEND_HANDOFF_SCHEMA_DURABLE,
		suspendMode,
		...handoff
	} : {
		schema: GATEWAY_SUSPEND_HANDOFF_SCHEMA_LEGACY,
		...handoff
	};
}
function gatewaySuspendModeForHandoff(handoff) {
	return handoff.schema === "openclaw-gateway-suspend-handoff/v3" ? handoff.suspendMode : GATEWAY_SUSPEND_MODE_LEGACY;
}
function gatewaySuspendHandoffBytes(handoff) {
	return Buffer.from(`${JSON.stringify(handoff)}\n`, "utf8");
}
function gatewaySuspendHandoffIdentity(handoff) {
	const normalized = Object.fromEntries(Object.entries(handoff).toSorted(([left], [right]) => left.localeCompare(right)));
	return createHash("sha256").update(JSON.stringify(normalized)).digest("hex");
}
function persistDurableHandoff(path, handoff) {
	persistPrivateDurableBytes(path, gatewaySuspendHandoffBytes(handoff));
}
function proveDurableHandoff(path, expected) {
	const persisted = readDurableHandoff(path);
	const expectedIdentity = gatewaySuspendHandoffIdentity(expected);
	if (!persisted || gatewaySuspendHandoffIdentity(persisted.handoff) !== expectedIdentity) throw new Error("gateway suspension handoff does not match the active durable fence");
	provePrivateDurableBytes(path, persisted.bytes);
	const proven = readDurableHandoff(path);
	if (!proven || !proven.bytes.equals(persisted.bytes) || gatewaySuspendHandoffIdentity(proven.handoff) !== expectedIdentity) throw new Error("gateway suspension handoff changed before its durable replacement");
	return proven;
}
function replaceDurableHandoff(path, expected, replacement) {
	const persisted = proveDurableHandoff(path, expected);
	if (!isValidDurableHandoffCasReplacement(persisted.bytes, gatewaySuspendHandoffBytes(replacement))) throw new Error("gateway suspension handoff replacement is not an allowed transition");
	compareAndSwapPrivateDurableBytes(path, persisted.bytes, gatewaySuspendHandoffBytes(replacement));
	const proven = readDurableHandoff(path);
	if (!proven || gatewaySuspendHandoffIdentity(proven.handoff) !== gatewaySuspendHandoffIdentity(replacement)) throw new Error("gateway suspension handoff replacement was not durable");
}
function clearDurableHandoff(path) {
	const current = readPrivateDurableBytes(path);
	if (current !== null) {
		deletePrivateDurableBytesCompareAndSwap(path, current);
		return;
	}
	syncPrivateDurableParentDirectory(path);
}
/**
* Delete only the exact handoff generation the caller proved it owns.
* A missing path is an idempotent retry after unlink; a replacement is never
* removed. Callers must retain an independent durable transition record before
* accepting the missing-path case.
*/
function clearExactDurableHandoff(path, expected) {
	if (readDurableHandoff(path) === null) {
		clearDurableHandoff(path);
		return;
	}
	deletePrivateDurableBytesCompareAndSwap(path, proveDurableHandoff(path, expected).bytes);
}
function readDurableHandoff(path) {
	const bytes = readPrivateDurableBytes(path);
	if (bytes === null) return null;
	return {
		handoff: parseGatewaySuspendHandoffBytes(bytes),
		bytes
	};
}
function parseGatewaySuspendHandoffBytes(bytes) {
	const value = JSON.parse(bytes.toString("utf8"));
	if (value === null || typeof value !== "object" || Array.isArray(value)) throw new Error("gateway suspension handoff has an invalid shape");
	const handoff = value;
	const durable = handoff.schema === GATEWAY_SUSPEND_HANDOFF_SCHEMA_DURABLE;
	const releasePending = durable && handoff.resumeState === "release-pending";
	const expectedKeys = releasePending ? "expiresAtMs,gatewayInstanceId,gatewayPid,launchdRunCount,releaseAuthoritySha256,releaseCommittedAtMs,releaseRequestId,requestId,resumeBeforeMs,resumeState,schema,suspendMode,suspensionId" : durable ? "expiresAtMs,gatewayInstanceId,gatewayPid,launchdRunCount,requestId,resumeBeforeMs,resumeState,schema,suspendMode,suspensionId" : "expiresAtMs,gatewayInstanceId,gatewayPid,launchdRunCount,requestId,resumeBeforeMs,resumeState,schema,suspensionId";
	if (Object.keys(handoff).toSorted().join(",") !== expectedKeys) throw new Error("gateway suspension handoff has an invalid shape");
	if (handoff.schema !== GATEWAY_SUSPEND_HANDOFF_SCHEMA_LEGACY && handoff.schema !== "openclaw-gateway-suspend-handoff/v3" || durable && handoff.suspendMode !== "handoff-durable-hold/v1" || typeof handoff.requestId !== "string" || handoff.requestId.trim().length === 0 || typeof handoff.suspensionId !== "string" || handoff.suspensionId.trim().length === 0 || typeof handoff.gatewayInstanceId !== "string" || handoff.gatewayInstanceId.trim().length === 0 || !Number.isSafeInteger(handoff.gatewayPid) || Number(handoff.gatewayPid) < 1 || !Number.isSafeInteger(handoff.launchdRunCount) || Number(handoff.launchdRunCount) < 1 || !Number.isSafeInteger(handoff.expiresAtMs) || handoff.resumeState !== "held" && handoff.resumeState !== "resume-pending" && handoff.resumeState !== "resume-expired" && handoff.resumeState !== "resume-reopen-authorized" && handoff.resumeState !== "resume-cleanup" && handoff.resumeState !== "release-pending" || (handoff.resumeState === "held" ? handoff.resumeBeforeMs !== null : !Number.isSafeInteger(handoff.resumeBeforeMs) || Number(handoff.resumeBeforeMs) > Number(handoff.expiresAtMs)) || (releasePending ? typeof handoff.releaseRequestId !== "string" || !/^handoff-v2-release:[a-f0-9]{32}$/u.test(handoff.releaseRequestId) || typeof handoff.releaseAuthoritySha256 !== "string" || !/^[a-f0-9]{64}$/u.test(handoff.releaseAuthoritySha256) || handoff.releaseRequestId !== `handoff-v2-release:${handoff.releaseAuthoritySha256.slice(0, 32)}` || !Number.isSafeInteger(handoff.releaseCommittedAtMs) || Number(handoff.releaseCommittedAtMs) >= Number(handoff.resumeBeforeMs) : "releaseRequestId" in handoff || "releaseAuthoritySha256" in handoff || "releaseCommittedAtMs" in handoff)) throw new Error("gateway suspension handoff is invalid");
	return handoff;
}
function isValidDurableHandoffCasReplacement(previousBytes, currentBytes) {
	try {
		const previous = parseGatewaySuspendHandoffBytes(previousBytes);
		const current = parseGatewaySuspendHandoffBytes(currentBytes);
		if (previous.schema !== current.schema || previous.requestId !== current.requestId || previous.suspensionId !== current.suspensionId) return false;
		if (previous.resumeState === "held" && current.resumeState === "held") {
			const sameProcessIncarnation = previous.gatewayInstanceId === current.gatewayInstanceId && previous.gatewayPid === current.gatewayPid && previous.launchdRunCount === current.launchdRunCount;
			const adoptedSuccessorIncarnation = previous.gatewayInstanceId !== current.gatewayInstanceId && (previous.gatewayPid !== current.gatewayPid || previous.launchdRunCount !== current.launchdRunCount);
			return (sameProcessIncarnation ? current.expiresAtMs > previous.expiresAtMs : adoptedSuccessorIncarnation && current.expiresAtMs >= previous.expiresAtMs) && current.resumeBeforeMs === null && gatewaySuspendModeForHandoff(previous) === gatewaySuspendModeForHandoff(current);
		}
		if (previous.gatewayInstanceId !== current.gatewayInstanceId || previous.gatewayPid !== current.gatewayPid || previous.launchdRunCount !== current.launchdRunCount || previous.expiresAtMs !== current.expiresAtMs || gatewaySuspendModeForHandoff(previous) !== gatewaySuspendModeForHandoff(current)) return false;
		if (previous.resumeState === "held" && current.resumeState === "release-pending") return previous.schema === "openclaw-gateway-suspend-handoff/v3" && current.schema === "openclaw-gateway-suspend-handoff/v3" && current.resumeBeforeMs !== null && current.releaseCommittedAtMs !== void 0 && current.releaseCommittedAtMs < current.resumeBeforeMs;
		return (previous.resumeState === "held" && current.resumeState === "resume-pending" || previous.resumeState === "resume-pending" && (current.resumeState === "resume-reopen-authorized" || current.resumeState === "resume-expired") || previous.resumeState === "resume-reopen-authorized" && (current.resumeState === "resume-cleanup" || current.resumeState === "resume-expired")) && current.resumeBeforeMs !== null && (previous.resumeState === "held" || previous.resumeBeforeMs === current.resumeBeforeMs);
	} catch {
		return false;
	}
}
//#endregion
//#region src/infra/gateway-suspend-resume.ts
function isGatewaySuspendCleanupState(state) {
	return state === "resume-reopen-authorized" || state === "resume-cleanup";
}
function durableHandoffFor(lease, resumeState = lease.resumeState, resumeBeforeMs = lease.resumeBeforeMs) {
	return createGatewaySuspendHandoff({
		suspendMode: lease.suspendMode,
		requestId: lease.requestId,
		suspensionId: lease.suspensionId,
		gatewayInstanceId: lease.gatewayInstanceId,
		gatewayPid: lease.gatewayPid,
		launchdRunCount: lease.launchdRunCount,
		expiresAtMs: lease.expiresAtMs,
		resumeState,
		resumeBeforeMs
	});
}
function persistGatewaySuspendResumeState(lease, resumeState, resumeBeforeMs) {
	if (lease.durableHandoffPath) {
		if (!lease.durableHandoff) throw new Error("gateway suspension lease lacks its active durable fence");
		const replacement = durableHandoffFor(lease, resumeState, resumeBeforeMs);
		replaceDurableHandoff(lease.durableHandoffPath, lease.durableHandoff, replacement);
		lease.durableHandoff = replacement;
	}
	lease.resumeState = resumeState;
	lease.resumeBeforeMs = resumeBeforeMs;
}
function expireResumeAuthority(params) {
	const { lease } = params;
	params.clearTimer();
	lease.resumeState = "resume-expired";
	if (!lease.durableHandoffPath) return;
	try {
		persistGatewaySuspendResumeState(lease, "resume-expired", lease.resumeBeforeMs);
	} catch (err) {
		lease.warn?.(`gateway expired-resume fence persistence failed: ${String(err)}`);
		params.scheduleRetry(() => {
			if (params.isCurrent() && lease.resumeState === "resume-expired") expireResumeAuthority(params);
		});
	}
}
function attemptGatewaySuspendResume(params) {
	const { lease, nowMs } = params;
	const resumeBeforeMs = lease.resumeBeforeMs;
	if (resumeBeforeMs === null || nowMs() >= resumeBeforeMs) {
		expireResumeAuthority(params);
		return "authority-expired";
	}
	try {
		lease.resumeScheduling();
	} catch (err) {
		lease.warn?.(`gateway scheduler recovery failed: ${String(err)}`);
		params.scheduleRetry(() => {
			if (params.isCurrent() && lease.resumeState === "resume-pending") attemptGatewaySuspendResume(params);
		});
		return "failed";
	}
	if (!params.isCurrent()) return "resumed";
	if (nowMs() >= resumeBeforeMs) {
		expireResumeAuthority(params);
		return "authority-expired";
	}
	try {
		persistGatewaySuspendResumeState(lease, "resume-reopen-authorized", resumeBeforeMs);
	} catch (err) {
		lease.warn?.(`gateway resume authorization persistence failed: ${String(err)}`);
		params.scheduleRetry(() => {
			if (params.isCurrent() && lease.resumeState === "resume-pending") attemptGatewaySuspendResume(params);
		});
		return "failed";
	}
	if (nowMs() >= resumeBeforeMs) {
		expireResumeAuthority(params);
		return "authority-expired";
	}
	if (!lease.reopenAdmission()) {
		lease.warn?.("gateway scheduler recovery could not reopen admission");
		return "failed";
	}
	lease.admissionReopened = true;
	try {
		persistGatewaySuspendResumeState(lease, "resume-cleanup", resumeBeforeMs);
		if (lease.durableHandoffPath) {
			if (!lease.durableHandoff) throw new Error("gateway suspension cleanup lacks its exact durable fence");
			clearExactDurableHandoff(lease.durableHandoffPath, lease.durableHandoff);
		}
	} catch (err) {
		lease.warn?.(`gateway suspension handoff cleanup failed after reopen: ${String(err)}`);
		attemptGatewaySuspendCleanup(params);
		return "failed";
	}
	params.clearTimer();
	params.clearCurrent();
	return "resumed";
}
function attemptGatewaySuspendCleanup(params) {
	params.scheduleRetry(() => {
		const { lease } = params;
		if (!params.isCurrent() || !isGatewaySuspendCleanupState(lease.resumeState) || !lease.admissionReopened || !lease.durableHandoffPath) return;
		try {
			if (lease.resumeState === "resume-reopen-authorized") persistGatewaySuspendResumeState(lease, "resume-cleanup", lease.resumeBeforeMs);
			if (!lease.durableHandoff) throw new Error("gateway suspension cleanup retry lacks its exact durable fence");
			clearExactDurableHandoff(lease.durableHandoffPath, lease.durableHandoff);
			params.clearTimer();
			params.clearCurrent();
		} catch (err) {
			lease.warn?.(`gateway suspension handoff cleanup retry failed: ${String(err)}`);
			attemptGatewaySuspendCleanup(params);
		}
	});
}
//#endregion
//#region src/infra/gateway-suspend-coordinator.ts
const GATEWAY_SUSPEND_TTL_MS = 2 * 6e4;
const GATEWAY_SUSPEND_RETRY_AFTER_MS = 2e4;
const COORDINATOR_STATE = resolveGlobalSingleton(Symbol.for("openclaw.gatewaySuspendCoordinatorState"), () => ({
	current: null,
	retiredForLifecycleReset: null
}));
const GATEWAY_INSTANCE_ID = resolveGlobalSingleton(Symbol.for("openclaw.gatewayProcessIncarnationId"), () => randomUUID());
function clearEntryTimer(entry) {
	if (entry.timer) {
		clearTimeout(entry.timer);
		entry.timer = void 0;
	}
}
function scheduleEntry(entry, delayMs, callback) {
	clearEntryTimer(entry);
	entry.timer = setTimeout(callback, delayMs);
	entry.timer.unref?.();
}
function resumeAndReopen(entry) {
	try {
		entry.resumeScheduling();
	} catch (err) {
		entry.warn?.(`gateway scheduler recovery failed: ${String(err)}`);
		enterSchedulerRecovery(entry);
		return false;
	}
	if (COORDINATOR_STATE.current !== entry) return true;
	if (entry.durableHandoffPath) try {
		clearDurableHandoff(entry.durableHandoffPath);
	} catch (err) {
		entry.warn?.(`gateway suspension handoff cleanup failed: ${String(err)}`);
		enterSchedulerRecovery(entry);
		return false;
	}
	if (!entry.reopenAdmission()) {
		entry.warn?.("gateway scheduler recovery could not reopen admission");
		enterSchedulerRecovery(entry);
		return false;
	}
	clearEntryTimer(entry);
	COORDINATOR_STATE.current = null;
	return true;
}
function resumeAndReopenBefore(held, nowMs) {
	return attemptGatewaySuspendResume({
		lease: held,
		nowMs,
		isCurrent: () => COORDINATOR_STATE.current === held,
		clearCurrent: () => {
			COORDINATOR_STATE.current = null;
		},
		clearTimer: () => clearEntryTimer(held),
		scheduleRetry: (callback) => scheduleEntry(held, GATEWAY_SCHEDULER_RECOVERY_RETRY_MS, callback)
	});
}
function enterSchedulerRecovery(entry) {
	if (COORDINATOR_STATE.current !== entry) return;
	if (entry.kind === "recovering") {
		scheduleRecoveryRetry(entry);
		return;
	}
	clearEntryTimer(entry);
	const recovery = {
		kind: "recovering",
		owner: entry.owner,
		resumeScheduling: entry.resumeScheduling,
		reopenAdmission: entry.reopenAdmission,
		warn: entry.warn,
		durableHandoffPath: entry.durableHandoffPath
	};
	COORDINATOR_STATE.current = recovery;
	scheduleRecoveryRetry(recovery);
}
function scheduleRecoveryRetry(entry) {
	scheduleEntry(entry, GATEWAY_SCHEDULER_RECOVERY_RETRY_MS, () => {
		if (COORDINATOR_STATE.current === entry) resumeAndReopen(entry);
	});
}
function normalizeHeldSuspension(held) {
	if (held.resumeState === "held" && held.nowMs() >= held.expiresAtMs) {
		if (held.suspendMode === "legacy-auto-expire/v1") {
			resumeAndReopen(held);
			return COORDINATOR_STATE.current;
		}
		if (held.adoptedAtStartup === true) {
			held.warn?.("gateway durable hold expired; releasing");
			try {
				held.resumeScheduling();
			} catch (err) {
				held.warn?.(`gateway scheduler recovery failed during auto-release: ${String(err)}`);
				enterSchedulerRecovery(held);
				return COORDINATOR_STATE.current;
			}
			if (COORDINATOR_STATE.current !== held) return COORDINATOR_STATE.current;
			try {
				clearDurableHandoff(held.durableHandoffPath);
			} catch (err) {
				held.warn?.(`gateway suspension handoff cleanup failed during auto-release: ${String(err)}`);
				enterSchedulerRecovery(held);
				return COORDINATOR_STATE.current;
			}
			if (!held.reopenAdmission()) {
				held.warn?.("gateway scheduler recovery could not reopen admission during auto-release");
				enterSchedulerRecovery(held);
				return COORDINATOR_STATE.current;
			}
			clearEntryTimer(held);
			COORDINATOR_STATE.current = null;
			return null;
		}
		clearEntryTimer(held);
	}
	return held;
}
function armSchedulerRecovery(recovery) {
	const entry = {
		kind: "recovering",
		...recovery
	};
	scheduleRecoveryRetry(entry);
	return entry;
}
function resumeSchedulingBeforeReopen(params) {
	if (params.isInvalidated()) return true;
	try {
		params.resumeScheduling();
	} catch (err) {
		params.warn?.(`gateway scheduler resume failed during suspension rollback: ${String(err)}`);
		COORDINATOR_STATE.current = armSchedulerRecovery({
			owner: params.owner,
			resumeScheduling: params.resumeScheduling,
			reopenAdmission: params.reopenAdmission,
			warn: params.warn
		});
		return false;
	}
	if (!params.isInvalidated()) params.reopenAdmission();
	return true;
}
function createHeldSuspension(held) {
	const entry = {
		kind: "held",
		...held
	};
	if (entry.suspendMode === "legacy-auto-expire/v1" && entry.resumeState === "held") scheduleEntry(entry, Math.max(0, entry.expiresAtMs - entry.nowMs()), () => {
		if (COORDINATOR_STATE.current === entry) resumeAndReopen(entry);
	});
	return entry;
}
function renewHeldSuspension(held, nowMs, identity = held) {
	const expiresAtMs = nowMs + GATEWAY_SUSPEND_TTL_MS;
	const replacement = createGatewaySuspendHandoff({
		suspendMode: held.suspendMode,
		requestId: held.requestId,
		suspensionId: held.suspensionId,
		gatewayInstanceId: identity.gatewayInstanceId,
		gatewayPid: identity.gatewayPid,
		launchdRunCount: identity.launchdRunCount,
		expiresAtMs,
		resumeState: "held",
		resumeBeforeMs: null
	});
	if (held.durableHandoffPath) {
		if (!held.durableHandoff) throw new Error("gateway suspension lease lacks its active durable fence");
		replaceDurableHandoff(held.durableHandoffPath, held.durableHandoff, replacement);
		held.durableHandoff = replacement;
	}
	held.expiresAtMs = expiresAtMs;
	held.gatewayInstanceId = identity.gatewayInstanceId;
	held.gatewayPid = identity.gatewayPid;
	held.launchdRunCount = identity.launchdRunCount;
	held.resumeState = "held";
	held.resumeBeforeMs = null;
	if (held.suspendMode === "legacy-auto-expire/v1") scheduleEntry(held, GATEWAY_SUSPEND_TTL_MS, () => {
		if (COORDINATOR_STATE.current === held) resumeAndReopen(held);
	});
}
/** Acquire, inspect, and either roll back immediately or hold an idle fence. */
function prepareGatewaySuspend(params) {
	const suspendMode = resolveGatewaySuspendMode(params.suspendMode);
	if (!suspendMode) return { status: "mode-mismatch" };
	const currentGatewayInstanceId = params.currentGatewayInstanceId ?? GATEWAY_INSTANCE_ID;
	const currentGatewayPid = params.currentGatewayPid ?? process.pid;
	const gatewayPid = params.gatewayPid ?? currentGatewayPid;
	const launchdRunCount = params.launchdRunCount ?? 1;
	if (gatewayPid !== currentGatewayPid || params.gatewayInstanceId !== void 0 && params.gatewayInstanceId !== currentGatewayInstanceId) return { status: "process-mismatch" };
	const nowMs = (params.nowMs ?? Date.now)();
	const current = COORDINATOR_STATE.current;
	if (current?.kind === "recovering") return schedulerRecoveryResult();
	if (current?.kind === "held" && isGatewaySuspendCleanupState(current.resumeState)) return schedulerRecoveryResult();
	const existing = current ? normalizeHeldSuspension(current) : null;
	if (existing?.kind === "recovering") return schedulerRecoveryResult();
	if (existing) {
		if (existing.suspendMode !== suspendMode) return { status: "mode-mismatch" };
		if (existing.gatewayInstanceId !== currentGatewayInstanceId || !existing.adoptedAtStartup && (existing.gatewayPid !== gatewayPid || existing.launchdRunCount !== launchdRunCount)) return { status: "process-mismatch" };
		if (existing.requestId !== params.requestId) return {
			status: "conflict",
			expiresAtMs: existing.expiresAtMs
		};
		if ((existing.adoptedAtStartup || existing.resumeState !== "held" || nowMs >= existing.expiresAtMs) && params.suspensionId !== existing.suspensionId) return {
			status: "conflict",
			expiresAtMs: existing.expiresAtMs
		};
		if (existing.adoptedAtStartup || existing.resumeState !== "held") {
			existing.resumeScheduling = params.resumeScheduling;
			existing.warn = params.warn;
			params.pauseScheduling();
			const snapshot = createGatewayActiveWorkSnapshot(params.inspect);
			if (!snapshot.idle) return {
				status: "busy",
				reason: "active-work",
				retryAfterMs: GATEWAY_SUSPEND_RETRY_AFTER_MS,
				activeCount: snapshot.counts.totalActive,
				blockers: snapshot.blockers
			};
			existing.snapshot = snapshot;
		}
		existing.nowMs = params.nowMs ?? Date.now;
		renewHeldSuspension(existing, nowMs, {
			gatewayInstanceId: currentGatewayInstanceId,
			gatewayPid,
			launchdRunCount
		});
		existing.adoptedAtStartup = false;
		return {
			status: "ready",
			suspensionId: existing.suspensionId,
			gatewayInstanceId: existing.gatewayInstanceId,
			gatewayPid: existing.gatewayPid,
			launchdRunCount: existing.launchdRunCount,
			expiresAtMs: existing.expiresAtMs,
			suspendMode: existing.suspendMode,
			activeCount: existing.snapshot.counts.totalActive,
			blockers: existing.snapshot.blockers
		};
	}
	const owner = {};
	let suspensionInvalidated = false;
	const admission = tryBeginGatewaySuspendAdmission(() => {
		suspensionInvalidated = true;
		const activeEntry = COORDINATOR_STATE.current;
		if (activeEntry?.owner !== owner) return;
		clearEntryTimer(activeEntry);
		COORDINATOR_STATE.current = null;
		COORDINATOR_STATE.retiredForLifecycleReset = activeEntry;
	});
	if (!admission) {
		const snapshot = createGatewayActiveWorkSnapshot(params.inspect);
		return {
			status: "busy",
			reason: "gateway-draining",
			retryAfterMs: GATEWAY_SUSPEND_RETRY_AFTER_MS,
			activeCount: snapshot.counts.totalActive,
			blockers: snapshot.blockers
		};
	}
	let schedulingPaused = false;
	let admissionCommitted = false;
	let durableHandoffPersistenceStarted = false;
	try {
		params.pauseScheduling();
		schedulingPaused = true;
		const snapshot = createGatewayActiveWorkSnapshot(params.inspect);
		if (!snapshot.idle) {
			const resumed = resumeSchedulingBeforeReopen({
				owner,
				resumeScheduling: params.resumeScheduling,
				reopenAdmission: admission.rollback,
				isInvalidated: () => suspensionInvalidated,
				warn: params.warn
			});
			schedulingPaused = false;
			if (!resumed) return schedulerRecoveryResult();
			return {
				status: "busy",
				reason: "active-work",
				retryAfterMs: GATEWAY_SUSPEND_RETRY_AFTER_MS,
				activeCount: snapshot.counts.totalActive,
				blockers: snapshot.blockers
			};
		}
		if (!admission.commit()) throw new Error("gateway suspension admission changed during preparation");
		admissionCommitted = true;
		const suspensionId = (params.createSuspensionId ?? randomUUID)();
		const expiresAtMs = nowMs + GATEWAY_SUSPEND_TTL_MS;
		const durableHandoff = params.durableHandoffPath ? createGatewaySuspendHandoff({
			suspendMode,
			requestId: params.requestId,
			suspensionId,
			gatewayInstanceId: currentGatewayInstanceId,
			gatewayPid,
			launchdRunCount,
			expiresAtMs,
			resumeState: "held",
			resumeBeforeMs: null
		}) : void 0;
		const held = createHeldSuspension({
			owner,
			requestId: params.requestId,
			suspensionId,
			gatewayInstanceId: currentGatewayInstanceId,
			gatewayPid,
			launchdRunCount,
			suspendMode,
			expiresAtMs,
			snapshot,
			reopenAdmission: admission.release,
			resumeScheduling: params.resumeScheduling,
			nowMs: params.nowMs ?? Date.now,
			resumeState: "held",
			resumeBeforeMs: null,
			warn: params.warn,
			durableHandoffPath: params.durableHandoffPath,
			durableHandoff
		});
		if (held.durableHandoffPath && durableHandoff) {
			durableHandoffPersistenceStarted = true;
			persistDurableHandoff(held.durableHandoffPath, durableHandoff);
			durableHandoffPersistenceStarted = false;
		}
		COORDINATOR_STATE.current = held;
		return {
			status: "ready",
			suspensionId,
			gatewayInstanceId: currentGatewayInstanceId,
			gatewayPid,
			launchdRunCount,
			expiresAtMs,
			suspendMode,
			activeCount: snapshot.counts.totalActive,
			blockers: snapshot.blockers
		};
	} catch (err) {
		if (durableHandoffPersistenceStarted) {
			COORDINATOR_STATE.current = armSchedulerRecovery({
				owner,
				resumeScheduling: params.resumeScheduling,
				reopenAdmission: admission.release,
				warn: params.warn,
				durableHandoffPath: params.durableHandoffPath
			});
			return schedulerRecoveryResult();
		}
		if (schedulingPaused) {
			if (!resumeSchedulingBeforeReopen({
				owner,
				resumeScheduling: params.resumeScheduling,
				reopenAdmission: admissionCommitted ? admission.release : admission.rollback,
				isInvalidated: () => suspensionInvalidated,
				warn: params.warn
			})) return schedulerRecoveryResult();
		} else if (admissionCommitted) admission.release();
		else admission.rollback();
		throw err;
	}
}
function getGatewaySuspendStatus(params, currentGatewayInstanceId = GATEWAY_INSTANCE_ID) {
	if (params.gatewayInstanceId !== currentGatewayInstanceId) return { status: "process-mismatch" };
	const suspendMode = resolveGatewaySuspendMode(params.suspendMode);
	if (!suspendMode) return { status: "mode-mismatch" };
	const current = COORDINATOR_STATE.current;
	if (current?.kind === "recovering") return schedulerRecoveryResult();
	const held = current ? normalizeHeldSuspension(current) : null;
	if (held?.kind === "recovering") return schedulerRecoveryResult();
	if (held && isGatewaySuspendCleanupState(held.resumeState)) return schedulerRecoveryResult();
	if (!held) return {
		status: "running",
		gatewayInstanceId: currentGatewayInstanceId,
		suspendMode
	};
	if (held.suspendMode !== suspendMode) return { status: "mode-mismatch" };
	if (held.gatewayInstanceId !== currentGatewayInstanceId) return { status: "process-mismatch" };
	if (held.suspensionId !== params.suspensionId) return {
		status: "conflict",
		expiresAtMs: held.expiresAtMs
	};
	return {
		status: "ready",
		gatewayInstanceId: currentGatewayInstanceId,
		expiresAtMs: held.expiresAtMs,
		suspendMode: held.suspendMode
	};
}
function resumeGatewaySuspend(params, currentGatewayInstanceId, nowMs = Date.now) {
	const instanceId = currentGatewayInstanceId ?? GATEWAY_INSTANCE_ID;
	const p = typeof params === "string" ? {
		suspensionId: params,
		gatewayInstanceId: instanceId,
		resumeBeforeMs: nowMs() + GATEWAY_SUSPEND_TTL_MS
	} : params;
	const suspendMode = resolveGatewaySuspendMode(p.suspendMode);
	if (!suspendMode) return {
		ok: false,
		reason: "mode-mismatch"
	};
	if (!resolveGatewaySuspendMode(p.suspendMode)) return {
		ok: false,
		reason: "mode-mismatch"
	};
	if (p.gatewayInstanceId !== instanceId) return {
		ok: false,
		reason: "process-mismatch"
	};
	const current = COORDINATOR_STATE.current;
	if (current?.kind === "recovering") return resumeSchedulerRecoveryResult();
	const held = current ? normalizeHeldSuspension(current) : null;
	if (held?.kind === "recovering") return resumeSchedulerRecoveryResult();
	if (held && isGatewaySuspendCleanupState(held.resumeState)) return resumeSchedulerRecoveryResult();
	if (!held) return {
		ok: true,
		status: "running",
		resumed: false,
		gatewayInstanceId: instanceId,
		suspendMode
	};
	if (held.suspendMode !== suspendMode) return {
		ok: false,
		reason: "mode-mismatch"
	};
	if (held.gatewayInstanceId !== instanceId) return {
		ok: false,
		reason: "process-mismatch"
	};
	if (held.suspensionId !== p.suspensionId) return {
		ok: false,
		reason: "suspension-mismatch"
	};
	if (held.adoptedAtStartup) {
		if (suspendMode === GATEWAY_SUSPEND_MODE_DURABLE && held.resumeState === "held" && nowMs() >= held.expiresAtMs) {
			held.warn?.("manual resume for expired adopted durable hold; releasing");
			try {
				held.resumeScheduling();
			} catch (err) {
				held.warn?.(`gateway scheduler recovery failed during manual resume: ${String(err)}`);
				return resumeSchedulerRecoveryResult();
			}
			if (COORDINATOR_STATE.current !== held) return {
				ok: true,
				status: "running",
				resumed: true,
				gatewayInstanceId: instanceId,
				suspendMode
			};
			try {
				clearDurableHandoff(held.durableHandoffPath);
			} catch (err) {
				held.warn?.(`gateway suspension handoff cleanup failed during manual resume: ${String(err)}`);
				return resumeSchedulerRecoveryResult();
			}
			if (!held.reopenAdmission()) {
				held.warn?.("gateway scheduler recovery could not reopen admission during manual resume");
				return resumeSchedulerRecoveryResult();
			}
			clearEntryTimer(held);
			COORDINATOR_STATE.current = null;
			return {
				ok: true,
				status: "running",
				resumed: true,
				gatewayInstanceId: instanceId,
				suspendMode
			};
		}
		return {
			ok: false,
			reason: "suspension-mismatch"
		};
	}
	if (held.resumeState === "resume-expired") return {
		ok: false,
		reason: "resume-authority-expired"
	};
	if (nowMs() >= p.resumeBeforeMs) {
		if (held.resumeState === "resume-pending" && held.resumeBeforeMs === p.resumeBeforeMs) {
			held.nowMs = nowMs;
			resumeAndReopenBefore(held, nowMs);
		}
		return {
			ok: false,
			reason: "resume-authority-expired"
		};
	}
	if (p.resumeBeforeMs > held.expiresAtMs) return {
		ok: false,
		reason: "resume-authority-expired"
	};
	if (held.resumeState === "held") try {
		persistGatewaySuspendResumeState(held, "resume-pending", p.resumeBeforeMs);
	} catch (err) {
		held.warn?.(`gateway resume authority persistence failed: ${String(err)}`);
		return resumeSchedulerRecoveryResult();
	}
	else if (held.resumeBeforeMs !== p.resumeBeforeMs) return {
		ok: false,
		reason: "suspension-mismatch"
	};
	held.nowMs = nowMs;
	const resumeResult = resumeAndReopenBefore(held, nowMs);
	if (resumeResult === "authority-expired") return {
		ok: false,
		reason: "resume-authority-expired"
	};
	if (resumeResult === "failed") return resumeSchedulerRecoveryResult();
	return {
		ok: true,
		status: "running",
		resumed: true,
		gatewayInstanceId: instanceId,
		suspendMode: held.suspendMode
	};
}
function resetGatewaySuspendCoordinator() {
	const current = COORDINATOR_STATE.current;
	const retired = COORDINATOR_STATE.retiredForLifecycleReset;
	COORDINATOR_STATE.current = null;
	COORDINATOR_STATE.retiredForLifecycleReset = null;
	const entries = current && current !== retired ? [current, retired] : [current ?? retired];
	for (const entry of entries) {
		if (!entry) continue;
		clearEntryTimer(entry);
		if (entry.kind === "held" && isGatewaySuspendCleanupState(entry.resumeState)) continue;
		try {
			entry.resumeScheduling();
		} catch (err) {
			entry.warn?.(`gateway scheduler resume failed during lifecycle reset: ${String(err)}`);
		}
		entry.reopenAdmission();
	}
}
function resetGatewaySuspendCoordinatorForLifecycleRestart() {
	resetGatewaySuspendCoordinator();
}
//#endregion
export { resumeGatewaySuspend as i, prepareGatewaySuspend as n, resetGatewaySuspendCoordinatorForLifecycleRestart as r, getGatewaySuspendStatus as t };
