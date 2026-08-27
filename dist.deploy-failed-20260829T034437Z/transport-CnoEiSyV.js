import { execFile } from "node:child_process";
//#region extensions/codex/src/app-server/transport-process-containment.ts
const PROCESS_COLUMNS = "pid=,ppid=,pgid=,stat=,lstart=";
const MAX_CONTAINED_PROCESSES = 512;
const MAX_PROCESS_CONTAINMENT_MS = 2e3;
const MAX_PROCESS_QUIESCE_PASSES = 16;
const PROCESS_INSPECTION_MAX_BYTES = 8 * 1024 * 1024;
async function terminateCodexAppServerDescendants(child) {
	const rootPid = child.pid;
	if (process.platform === "win32" || !rootPid || !child.kill || hasExited(child)) return;
	const deadline = Date.now() + MAX_PROCESS_CONTAINMENT_MS;
	const snapshot = await readProcessSnapshot(deadline);
	if (!snapshot || Date.now() >= deadline) return;
	const root = snapshot.find((row) => row.pid === rootPid);
	if (!root || !isSameLiveRoot(root, root)) return;
	const initialDescendants = collectDescendants(snapshot, [rootPid]);
	if (initialDescendants.length > MAX_CONTAINED_PROCESSES) return;
	const stoppedDescendants = /* @__PURE__ */ new Map();
	if (!await signalSameRoot(root, "SIGSTOP", deadline)) return;
	let resumeRootOnUnwind = true;
	try {
		const descendants = await quiesceDescendants(root, initialDescendants, stoppedDescendants, deadline);
		if (!descendants) return;
		for (const descendant of descendants.toReversed()) {
			if (Date.now() >= deadline) return;
			if (!descendant.state.startsWith("Z")) {
				if (!await signalSameProcess(descendant, "SIGKILL", deadline) || Date.now() >= deadline) return;
			}
		}
		resumeRootOnUnwind = false;
		let resumed = false;
		return () => {
			if (resumed) return;
			resumed = true;
			resumeTransportRoot(child, root, false);
		};
	} finally {
		if (resumeRootOnUnwind) {
			for (const descendant of stoppedDescendants.values()) signalProcess(descendant.pid, "SIGCONT");
			resumeTransportRoot(child, root, true);
		}
	}
}
async function quiesceDescendants(root, initialDescendants, stopped, deadline) {
	const provenByPid = new Map(initialDescendants.map((descendant) => [descendant.pid, descendant]));
	const stopFailures = /* @__PURE__ */ new Map();
	for (let pass = 0; pass < MAX_PROCESS_QUIESCE_PASSES; pass += 1) {
		if (Date.now() >= deadline) return;
		const snapshot = await readProcessSnapshot(deadline);
		if (!snapshot || Date.now() >= deadline) return;
		const currentRoot = snapshot.find((row) => row.pid === root.pid);
		if (!currentRoot || !isSameLiveRoot(currentRoot, root)) return;
		if (!isSameLiveRoot(currentRoot, root, true)) {
			if (!await signalSameRoot(root, "SIGSTOP", deadline) || Date.now() >= deadline) return;
			continue;
		}
		const snapshotByPid = new Map(snapshot.map((process) => [process.pid, process]));
		const liveProven = [];
		for (const proven of provenByPid.values()) {
			const current = snapshotByPid.get(proven.pid);
			if (!current) {
				provenByPid.delete(proven.pid);
				stopped.delete(identityKey(proven));
				continue;
			}
			if (!hasSameIdentity(proven, current)) return;
			provenByPid.set(current.pid, current);
			const key = identityKey(current);
			if (stopped.has(key)) stopped.set(key, current);
			liveProven.push(current);
		}
		const descendants = collectDescendants(snapshot, [root.pid, ...liveProven.map(({ pid }) => pid)]);
		for (const descendant of descendants) {
			const proven = provenByPid.get(descendant.pid);
			if (proven && !hasSameIdentity(proven, descendant)) return;
			provenByPid.set(descendant.pid, descendant);
		}
		if (provenByPid.size > MAX_CONTAINED_PROCESSES) return;
		const quiescenceTargets = new Map(liveProven.map((process) => [process.pid, process]));
		for (const descendant of descendants) quiescenceTargets.set(descendant.pid, descendant);
		let allStopped = true;
		for (const descendant of quiescenceTargets.values()) {
			if (Date.now() >= deadline) return;
			if (isStoppedState(descendant.state)) continue;
			const stopQueued = await signalSameProcess(descendant, "SIGSTOP", deadline);
			if (Date.now() >= deadline) return;
			if (stopQueued) {
				stopFailures.delete(identityKey(descendant));
				stopped.set(identityKey(descendant), descendant);
			} else {
				const key = identityKey(descendant);
				const failures = (stopFailures.get(key) ?? 0) + 1;
				if (failures >= 2) return;
				stopFailures.set(key, failures);
			}
			if (!isUninterruptibleState(descendant.state) || !stopQueued) allStopped = false;
		}
		if (allStopped) return [...provenByPid.values()];
	}
}
async function readProcessSnapshot(deadline) {
	return await readProcesses(["-axo", PROCESS_COLUMNS], deadline);
}
async function readProcess(pid, deadline) {
	return (await readProcesses([
		"-o",
		PROCESS_COLUMNS,
		"-p",
		String(pid)
	], deadline))?.find((row) => row.pid === pid);
}
async function readProcesses(args, deadline) {
	const remainingMs = deadline - Date.now();
	if (remainingMs <= 0) return;
	return await new Promise((resolve) => {
		let settled = false;
		const settle = (processes) => {
			if (settled) return;
			settled = true;
			clearTimeout(timer);
			resolve(processes);
		};
		const inspector = execFile("ps", args, {
			encoding: "utf8",
			maxBuffer: PROCESS_INSPECTION_MAX_BYTES
		}, (error, stdout) => {
			settle(error ? void 0 : parseProcesses(stdout));
		});
		const timer = setTimeout(() => {
			settle(void 0);
			inspector.stdout?.destroy();
			inspector.stderr?.destroy();
			inspector.kill("SIGKILL");
			inspector.unref();
		}, Math.max(1, remainingMs));
		timer.unref?.();
	});
}
function parseProcesses(output) {
	const rows = [];
	for (const line of output.split("\n")) {
		const match = /^\s*(\d+)\s+(\d+)\s+(\d+)\s+(\S+)\s+(.+?)\s*$/.exec(line);
		if (!match) continue;
		const pid = Number(match[1] ?? "");
		const ppid = Number(match[2] ?? "");
		const pgid = Number(match[3] ?? "");
		const startedAt = (match[5] ?? "").trim().replace(/\s+/g, " ");
		if (![
			pid,
			ppid,
			pgid
		].every(Number.isSafeInteger) || pid <= 0 || ppid < 0 || pgid <= 0 || !startedAt) continue;
		rows.push({
			pid,
			ppid,
			pgid,
			state: match[4] ?? "",
			startedAt
		});
	}
	return rows;
}
function collectDescendants(snapshot, rootPids) {
	const childrenByParent = /* @__PURE__ */ new Map();
	for (const row of snapshot) {
		const children = childrenByParent.get(row.ppid) ?? [];
		children.push(row);
		childrenByParent.set(row.ppid, children);
	}
	const descendants = [];
	const pending = [...new Set(rootPids)];
	const seen = new Set(pending);
	for (const parentPid of pending) for (const child of childrenByParent.get(parentPid) ?? []) {
		if (seen.has(child.pid)) continue;
		seen.add(child.pid);
		descendants.push(child);
		pending.push(child.pid);
	}
	return descendants;
}
function isStoppedState(state) {
	return state.startsWith("T") || state.startsWith("t") || state.startsWith("Z");
}
function isQuiescedState(state) {
	return isStoppedState(state) || isUninterruptibleState(state);
}
function isUninterruptibleState(state) {
	return state.startsWith("D") || state.startsWith("U");
}
function isSameLiveProcess(current, expected) {
	return current.pgid === expected.pgid && !current.state.startsWith("Z") && hasSameIdentity(current, expected);
}
function isSameLiveRoot(current, expected, requireStopped = false) {
	return current.ppid === process.pid && (!requireStopped || isQuiescedState(current.state)) && isSameLiveProcess(current, expected);
}
async function signalSameRoot(root, signal, deadline) {
	const current = await readProcess(root.pid, deadline);
	return Boolean(current && isSameLiveRoot(current, root) && signalProcess(current.pid, signal));
}
function resumeTransportRoot(child, root, allowSynchronousPidFallback) {
	try {
		if (child.kill) {
			child.kill("SIGCONT");
			return;
		}
	} catch {
		if (!allowSynchronousPidFallback) return;
	}
	if (allowSynchronousPidFallback) signalProcess(root.pid, "SIGCONT");
}
async function signalSameProcess(expected, signal, deadline) {
	const current = await readProcess(expected.pid, deadline);
	return Boolean(current && isSameLiveProcess(current, expected) && signalProcess(current.pid, signal));
}
function hasSameIdentity(left, right) {
	return identityKey(left) === identityKey(right);
}
function identityKey(row) {
	return `${row.pid}\0${row.startedAt}`;
}
function hasExited(child) {
	return child.exitCode != null || child.signalCode != null;
}
function signalProcess(pid, signal) {
	try {
		process.kill(pid, signal);
		return true;
	} catch {
		return false;
	}
}
//#endregion
//#region extensions/codex/src/app-server/transport.ts
/**
* Shared transport lifecycle helpers for stdio and WebSocket Codex app-server
* connections.
*/
const CODEX_APP_SERVER_TRANSPORT_CLOSES = /* @__PURE__ */ new WeakMap();
/** Starts graceful transport shutdown and schedules a force kill fallback. */
function closeCodexAppServerTransport(child, options = {}) {
	beginCodexAppServerTransportClose(child, options);
}
function beginCodexAppServerTransportClose(child, options) {
	const current = CODEX_APP_SERVER_TRANSPORT_CLOSES.get(child);
	if (current) return current;
	if (process.platform === "win32" || !child.pid || !child.kill || hasCodexAppServerTransportExited(child)) {
		finishCodexAppServerTransportClose(child, options);
		const completed = Promise.resolve();
		CODEX_APP_SERVER_TRANSPORT_CLOSES.set(child, completed);
		return completed;
	}
	const closing = (async () => {
		let resumeRoot;
		try {
			resumeRoot = await terminateCodexAppServerDescendants(child);
		} catch {
			resumeRoot = void 0;
		}
		try {
			finishCodexAppServerTransportClose(child, options, resumeRoot);
		} catch {
			signalCodexAppServerTransport(child, "SIGKILL");
		}
	})();
	CODEX_APP_SERVER_TRANSPORT_CLOSES.set(child, closing);
	return closing;
}
function finishCodexAppServerTransportClose(child, options, resumeRoot) {
	const forceKillDelayMs = options.forceKillDelayMs ?? 1e3;
	const forceKill = setTimeout(() => {
		if (hasCodexAppServerTransportExited(child)) return;
		signalCodexAppServerTransport(child, "SIGKILL");
	}, Math.max(1, forceKillDelayMs));
	forceKill.unref?.();
	child.once("exit", () => {
		clearTimeout(forceKill);
		child.stdout.destroy?.();
		child.stderr.destroy?.();
	});
	try {
		child.stdin.end?.();
		child.stdin.destroy?.();
	} finally {
		resumeRoot?.();
	}
	child.unref?.();
	child.stdout.unref?.();
	child.stderr.unref?.();
	child.stdin.unref?.();
}
/** Closes a transport and waits briefly for an exit event. */
async function closeCodexAppServerTransportAndWait(child, options = {}) {
	if (!hasCodexAppServerTransportExited(child)) await beginCodexAppServerTransportClose(child, options);
	return await waitForCodexAppServerTransportExit(child, options.exitTimeoutMs ?? 2e3);
}
function hasCodexAppServerTransportExited(child) {
	return child.exitCode !== null && child.exitCode !== void 0 ? true : child.signalCode !== null && child.signalCode !== void 0;
}
async function waitForCodexAppServerTransportExit(child, timeoutMs) {
	if (hasCodexAppServerTransportExited(child)) return true;
	return await new Promise((resolve) => {
		let settled = false;
		const onExit = () => {
			if (settled) return;
			settled = true;
			clearTimeout(timeout);
			resolve(true);
		};
		const timeout = setTimeout(() => {
			if (settled) return;
			settled = true;
			child.off?.("exit", onExit);
			resolve(false);
		}, Math.max(1, timeoutMs));
		child.once("exit", onExit);
	});
}
function signalCodexAppServerTransport(child, signal) {
	if (child.pid && process.platform !== "win32") try {
		process.kill(-child.pid, signal);
		return;
	} catch {}
	child.kill?.(signal);
}
//#endregion
export { closeCodexAppServerTransportAndWait as n, closeCodexAppServerTransport as t };
