import { t as sleep } from "./sleep-D7nua6TP.js";
import { n as extractErrorCode } from "./errors-Ccx0R-_Z.js";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.js";
import "./error-runtime-CmA1H4Zg.js";
import "./runtime-env-_YEv0JPQ.js";
import { c as SHORT_TERM_LOCK_NAMESPACE, g as memoryCoreWorkspaceStateKey, h as memoryCoreStateReference, s as SHORT_TERM_LOCK_MAX_ENTRIES, v as openMemoryCoreStateStore } from "./dreaming-state-B0qd2W7q.js";
import fs from "node:fs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region extensions/memory-core/src/memory-workspace-lock.ts
const MEMORY_WORKSPACE_LOCK_WAIT_TIMEOUT_MS = 1e4;
const SHORT_TERM_LOCK_STALE_MS = 6e4;
const MEMORY_WORKSPACE_LOCK_RETRY_DELAY_MS = 40;
const inProcessMemoryWorkspaceLocks = new KeyedAsyncQueue();
const memoryWorkspaceLockScopes = new AsyncLocalStorage();
function findActiveWorkspaceLockScope(key) {
	let scope = memoryWorkspaceLockScopes.getStore();
	while (scope) {
		if (!scope.active || !scope.lease.active) return;
		if (scope.lease.key === key) return scope;
		scope = scope.parent;
	}
}
async function runWorkspaceLockScope(lease, task) {
	const scope = {
		lease,
		active: true,
		childTail: Promise.resolve(),
		parent: memoryWorkspaceLockScopes.getStore()
	};
	try {
		return await memoryWorkspaceLockScopes.run(scope, task);
	} finally {
		scope.active = false;
		await scope.childTail;
	}
}
function resolveLockPath(workspaceDir) {
	return memoryCoreStateReference(SHORT_TERM_LOCK_NAMESPACE, workspaceDir);
}
function parseLockOwnerPid(raw) {
	const match = raw.trim().match(/^(\d+):/);
	if (!match) return null;
	const pid = Number.parseInt(match[1] ?? "", 10);
	if (!Number.isInteger(pid) || pid <= 0) return null;
	return pid;
}
function isProcessLikelyAlive(pid) {
	try {
		process.kill(pid, 0);
	} catch (err) {
		if (extractErrorCode(err) === "ESRCH") return false;
	}
	if (process.platform !== "linux") return true;
	try {
		const state = fs.readFileSync(`/proc/${pid}/status`, "utf8").match(/^State:\s+(\S)/m)?.[1];
		return state !== "Z" && state !== "X";
	} catch {
		return true;
	}
}
async function deleteShortTermLockEntryIfCurrent(lockStore, lockKey, expected) {
	if (!lockStore.deleteIf) throw new Error("memory-core short-term lock store requires conditional deletion");
	return await lockStore.deleteIf(lockKey, (current) => current.owner === expected.owner && current.acquiredAt === expected.acquiredAt);
}
async function withMemoryWorkspaceLock(workspaceDir, task) {
	const lockKey = memoryCoreWorkspaceStateKey(workspaceDir);
	const scope = findActiveWorkspaceLockScope(lockKey);
	if (scope) {
		const child = scope.childTail.then(() => runWorkspaceLockScope(scope.lease, task));
		scope.childTail = child.then(() => void 0, () => void 0);
		return await child;
	}
	const lockRef = resolveLockPath(workspaceDir);
	const lockStore = openMemoryCoreStateStore({
		namespace: SHORT_TERM_LOCK_NAMESPACE,
		maxEntries: SHORT_TERM_LOCK_MAX_ENTRIES
	});
	return await inProcessMemoryWorkspaceLocks.enqueue(lockKey, async () => {
		const startedAt = Date.now();
		while (true) {
			const lockEntry = {
				owner: `${process.pid}:${Date.now()}`,
				acquiredAt: Date.now()
			};
			if (await lockStore.registerIfAbsent(lockKey, lockEntry)) {
				const lease = {
					key: lockKey,
					active: true
				};
				try {
					return await runWorkspaceLockScope(lease, task);
				} finally {
					lease.active = false;
					await deleteShortTermLockEntryIfCurrent(lockStore, lockKey, lockEntry).catch(() => false);
				}
			}
			const existing = await lockStore.lookup(lockKey);
			if (existing && Date.now() - existing.acquiredAt > 6e4) {
				const ownerPid = parseLockOwnerPid(existing.owner);
				if (ownerPid === null || !isProcessLikelyAlive(ownerPid)) {
					if (await deleteShortTermLockEntryIfCurrent(lockStore, lockKey, existing)) continue;
				}
			}
			if (Date.now() - startedAt >= MEMORY_WORKSPACE_LOCK_WAIT_TIMEOUT_MS) throw new Error(`Timed out waiting for memory workspace lock at ${lockRef}`);
			await sleep(MEMORY_WORKSPACE_LOCK_RETRY_DELAY_MS);
		}
	});
}
//#endregion
export { resolveLockPath as a, parseLockOwnerPid as i, deleteShortTermLockEntryIfCurrent as n, withMemoryWorkspaceLock as o, isProcessLikelyAlive as r, SHORT_TERM_LOCK_STALE_MS as t };
