import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { t as createSubsystemLogger } from "./subsystem-a4KzJVZG.js";
import { i as isPidDefinitelyDead, t as getFileLockProcessStartTime } from "./pid-alive-BcyyC-CC.js";
import { d as runGit, o as listGitWorktrees, t as commandError } from "./git-CsWoUZAt.js";
import { S as releaseWorktreeRunLeaseRow, _ as hasLiveWorktreeRunLeaseRow, b as listRegistryWorktrees, c as finalizeWorktreeRemovalRows, f as getRegistryWorktree, i as claimWorktreeRemovalRow, n as abortWorktreeRemovalRow, r as admitWorktreeRunLeaseRow } from "./registry-DC6q9xGA.js";
import path from "node:path";
import fs from "node:fs/promises";
import { randomUUID } from "node:crypto";
//#region src/agents/worktrees/git-lock.ts
const OPENCLAW_LOCK_PATTERN = /^openclaw pid=(\d+)$/;
async function lockState(record) {
	const entry = (await listGitWorktrees(record.repoRoot)).find((candidate) => path.resolve(candidate.path) === path.resolve(record.path));
	if (!entry || entry.lockedReason === void 0) return { kind: "none" };
	const match = OPENCLAW_LOCK_PATTERN.exec(entry.lockedReason);
	if (!match) return {
		kind: "foreign",
		reason: entry.lockedReason
	};
	const pid = Number(match[1]);
	return isPidDefinitelyDead(pid) ? {
		kind: "dead",
		pid
	} : {
		kind: "live",
		pid
	};
}
function heldByThisProcess(state) {
	return state.kind === "live" && state.pid === process.pid;
}
async function runLock(record) {
	return await runGit(record.repoRoot, [
		"worktree",
		"lock",
		"--reason",
		`openclaw pid=${process.pid}`,
		record.path
	]);
}
async function lockWorktreeForProcess(record) {
	const result = await runLock(record);
	if (result.code === 0) return;
	const state = await lockState(record);
	if (heldByThisProcess(state)) return;
	if (state.kind !== "dead") throw commandError("git worktree lock", result);
	await unlockWorktree(record);
	const retry = await runLock(record);
	if (retry.code !== 0 && !heldByThisProcess(await lockState(record))) throw commandError("git worktree lock", retry);
}
async function unlockWorktree(record) {
	const result = await runGit(record.repoRoot, [
		"worktree",
		"unlock",
		record.path
	]);
	if (result.code !== 0) throw commandError("git worktree unlock", result);
}
//#endregion
//#region src/agents/worktrees/run-lease.ts
const log = createSubsystemLogger("agents/worktrees");
const RELEASE_MAX_ATTEMPTS = 3;
const heldGitLocks = /* @__PURE__ */ new Map();
const gitLockTransitionTails = /* @__PURE__ */ new Map();
let ownerChecks = {};
let resolveSelfStartTime = getFileLockProcessStartTime;
let releaseRunLeaseRow = releaseWorktreeRunLeaseRow;
let unlockWorktreeImpl = unlockWorktree;
const pendingLeaseCleanups = /* @__PURE__ */ new Set();
let exitCleanupRegistered = false;
async function withGitLockTransition(id, operation) {
	const previous = gitLockTransitionTails.get(id) ?? Promise.resolve();
	let finish;
	const current = new Promise((resolve) => {
		finish = resolve;
	});
	const tail = previous.then(() => current);
	gitLockTransitionTails.set(id, tail);
	await previous;
	try {
		return await operation();
	} finally {
		finish();
		if (gitLockTransitionTails.get(id) === tail) gitLockTransitionTails.delete(id);
	}
}
async function retainGitLock(env, id) {
	await withGitLockTransition(id, async () => {
		const held = heldGitLocks.get(id) ?? {
			refcount: 0,
			gitLocked: false
		};
		const needsLock = held.refcount === 0 && !held.gitLocked;
		held.refcount += 1;
		heldGitLocks.set(id, held);
		if (!needsLock) return;
		const record = getRegistryWorktree(env, id);
		if (!record) return;
		try {
			await lockWorktreeForProcess(record);
			held.gitLocked = true;
		} catch (error) {
			heldGitLocks.delete(id);
			throw new Error(`managed worktree is unusable because its Git removal guard could not be acquired: ${record.path}; repair the checkout or create a new worktree before retrying: ${formatErrorMessage(error)}`, { cause: error });
		}
	});
}
async function releaseGitLock(cleanup) {
	return await withGitLockTransition(cleanup.id, async () => {
		let held = heldGitLocks.get(cleanup.id);
		if (!cleanup.refcountReleased) {
			cleanup.refcountReleased = true;
			if (held) held.refcount -= 1;
		}
		held = heldGitLocks.get(cleanup.id);
		if (!held) {
			cleanup.gitUnlockPending = false;
			return true;
		}
		if (held.refcount > 0) {
			cleanup.gitUnlockPending = false;
			return true;
		}
		if (!held.gitLocked) {
			heldGitLocks.delete(cleanup.id);
			cleanup.gitUnlockPending = false;
			return true;
		}
		const record = getRegistryWorktree(cleanup.env, cleanup.id);
		if (!record) {
			heldGitLocks.delete(cleanup.id);
			cleanup.gitUnlockPending = false;
			return true;
		}
		try {
			await unlockWorktreeImpl(record);
		} catch (error) {
			cleanup.gitUnlockPending = true;
			log.warn(`failed to unlock worktree ${cleanup.id}: ${formatErrorMessage(error)}`);
			return false;
		}
		heldGitLocks.delete(cleanup.id);
		cleanup.gitUnlockPending = false;
		return true;
	});
}
async function realpathOrSelf(candidate) {
	try {
		return await fs.realpath(candidate);
	} catch {
		return path.resolve(candidate);
	}
}
async function resolveWorktreeIdForPath(params) {
	const env = params.env ?? process.env;
	const boundId = params.sessionEntry?.worktree?.id;
	if (boundId !== void 0) {
		const record = getRegistryWorktree(env, boundId);
		if (!record || record.removedAt !== void 0) throw new Error(`managed worktree was removed: ${record?.path ?? boundId}`);
		return boundId;
	}
	const records = listRegistryWorktrees(env).filter((record) => record.removedAt === void 0);
	if (records.length === 0) return;
	const bases = /* @__PURE__ */ new Map();
	for (const record of records) bases.set(record.id, await realpathOrSelf(record.path));
	const seen = /* @__PURE__ */ new Set();
	for (const candidate of params.candidatePaths) {
		if (!candidate || seen.has(candidate)) continue;
		seen.add(candidate);
		const real = await realpathOrSelf(candidate);
		for (const record of records) {
			const base = bases.get(record.id);
			if (base && (real === base || real.startsWith(`${base}${path.sep}`))) return record.id;
		}
	}
}
function deleteRunLeaseRowWithRetries(cleanup) {
	for (let attempt = 1; attempt <= RELEASE_MAX_ATTEMPTS; attempt += 1) try {
		releaseRunLeaseRow(cleanup.env, cleanup.id, cleanup.token);
		return true;
	} catch (error) {
		log.warn(`failed to release worktree run lease for ${cleanup.id} (attempt ${attempt}): ${formatErrorMessage(error)}`);
	}
	return false;
}
async function runLeaseCleanup(cleanup) {
	if (!cleanup.rowDeleted) {
		if (!deleteRunLeaseRowWithRetries(cleanup)) return false;
		cleanup.rowDeleted = true;
	}
	return await releaseGitLock(cleanup);
}
async function drainPendingLeaseCleanups() {
	for (const cleanup of pendingLeaseCleanups) if (await runLeaseCleanup(cleanup)) pendingLeaseCleanups.delete(cleanup);
}
function ensureExitCleanupRegistered() {
	if (exitCleanupRegistered) return;
	exitCleanupRegistered = true;
	process.on("exit", () => {
		for (const cleanup of pendingLeaseCleanups) if (!cleanup.rowDeleted) try {
			releaseRunLeaseRow(cleanup.env, cleanup.id, cleanup.token);
		} catch {}
	});
}
async function acquireWorktreeRunLease(id, opts = {}) {
	const env = opts.env ?? process.env;
	ensureExitCleanupRegistered();
	await drainPendingLeaseCleanups();
	const token = randomUUID();
	const pid = process.pid;
	admitWorktreeRunLeaseRow(env, {
		worktreeId: id,
		token,
		pid,
		startTime: resolveSelfStartTime(pid),
		now: Date.now(),
		checks: ownerChecks
	});
	const cleanup = {
		env,
		id,
		token,
		rowDeleted: false,
		refcountReleased: false,
		gitUnlockPending: false
	};
	try {
		await retainGitLock(env, id);
	} catch (error) {
		cleanup.refcountReleased = true;
		if (!await runLeaseCleanup(cleanup)) pendingLeaseCleanups.add(cleanup);
		throw error;
	}
	let released = false;
	return {
		id,
		token,
		release: async () => {
			if (released) return;
			released = true;
			if (!await runLeaseCleanup(cleanup)) pendingLeaseCleanups.add(cleanup);
		}
	};
}
function claimWorktreeRemoval(env, params) {
	const pid = process.pid;
	claimWorktreeRemovalRow(env, {
		...params,
		pid,
		startTime: resolveSelfStartTime(pid),
		now: Date.now(),
		checks: ownerChecks
	});
}
function finalizeWorktreeRemoval(env, worktreeId) {
	finalizeWorktreeRemovalRows(env, worktreeId);
}
function abortWorktreeRemoval(env, worktreeId, token) {
	abortWorktreeRemovalRow(env, worktreeId, token);
}
function hasLiveWorktreeRunLease(env, worktreeId) {
	return hasLiveWorktreeRunLeaseRow(env, worktreeId, ownerChecks);
}
const testing = {
	setProcessStartTimeResolverForTest(resolver) {
		resolveSelfStartTime = resolver ?? getFileLockProcessStartTime;
		ownerChecks = {
			...ownerChecks,
			getProcessStartTime: resolver ?? void 0
		};
	},
	setDeadPidResolverForTest(resolver) {
		ownerChecks = {
			...ownerChecks,
			isPidDefinitelyDead: resolver ?? void 0
		};
	},
	setReleaseRowImplForTest(impl) {
		releaseRunLeaseRow = impl ?? releaseWorktreeRunLeaseRow;
	},
	setUnlockImplForTest(impl) {
		unlockWorktreeImpl = impl ?? unlockWorktree;
	},
	async drainPendingCleanupsForTest() {
		await drainPendingLeaseCleanups();
	},
	resetForTest() {
		heldGitLocks.clear();
		gitLockTransitionTails.clear();
		pendingLeaseCleanups.clear();
		ownerChecks = {};
		resolveSelfStartTime = getFileLockProcessStartTime;
		releaseRunLeaseRow = releaseWorktreeRunLeaseRow;
		unlockWorktreeImpl = unlockWorktree;
	}
};
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.worktreeRunLeaseTestApi")] = { testing };
//#endregion
export { hasLiveWorktreeRunLease as a, lockWorktreeForProcess as c, finalizeWorktreeRemoval as i, unlockWorktree as l, acquireWorktreeRunLease as n, resolveWorktreeIdForPath as o, claimWorktreeRemoval as r, lockState as s, abortWorktreeRemoval as t };
