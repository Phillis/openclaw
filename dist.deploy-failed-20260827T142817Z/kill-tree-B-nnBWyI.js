import { readFileSync } from "node:fs";
import { spawn, spawnSync } from "node:child_process";
//#region packages/agent-core/src/harness/env/kill-tree.ts
const DEFAULT_GRACE_MS = 3e3;
const MAX_GRACE_MS = 6e4;
const TASKKILL_COMPLETION_TIMEOUT_MS = 3e3;
/**
* Best-effort process-tree termination with graceful shutdown.
* - Windows: use taskkill /T to include descendants. Sends SIGTERM-equivalent
*   first (without /F), then force-kills if taskkill refuses or the process
*   survives the grace period.
* - Unix: send SIGTERM to process group first, wait grace period, then SIGKILL.
*
* Group kill (`process.kill(-pid, ...)`) is only used when the PID is verified
* as its own process group leader, unless `detached: true` is explicitly passed.
* This prevents accidentally signaling the gateway's process group when the
* child shares its parent's group.
*
* - `detached: false`: skip group kill unconditionally.
* - `detached: true`: use group kill unconditionally (trust caller).
* - `detached` omitted: use group kill only when PID is the group leader.
*/
function killProcessTree(pid, opts) {
	if (!Number.isFinite(pid) || pid <= 0) return;
	if (process.platform === "win32") {
		if (opts?.force === true) {
			signalProcessTreeWindows(pid, "SIGKILL");
			return;
		}
		killProcessTreeWindows(pid, normalizeGraceMs(opts?.graceMs));
		return;
	}
	const useGroupKill = opts?.detached === true || opts?.detached !== false && isProcessGroupLeader(pid);
	if (opts?.force === true) {
		signalProcessTreeUnix(pid, "SIGKILL", useGroupKill);
		return;
	}
	const graceMs = normalizeGraceMs(opts?.graceMs);
	signalProcessTreeUnix(pid, "SIGTERM", useGroupKill);
	setTimeout(() => {
		if (!(useGroupKill ? isProcessAlive(-pid) || isProcessAlive(pid) : isProcessAlive(pid))) return;
		signalProcessTreeUnix(pid, "SIGKILL", useGroupKill);
	}, graceMs).unref();
}
function signalProcessTree(pid, signal, opts) {
	if (!Number.isFinite(pid) || pid <= 0) {
		opts?.onComplete?.();
		return;
	}
	if (process.platform === "win32") {
		signalProcessTreeWindowsAndWait(pid, signal).then(opts?.onComplete);
		return;
	}
	signalProcessTreeUnix(pid, signal, opts?.detached === true || opts?.detached !== false && isProcessGroupLeader(pid));
	opts?.onComplete?.();
}
function normalizeGraceMs(value) {
	if (typeof value !== "number" || !Number.isFinite(value)) return DEFAULT_GRACE_MS;
	return Math.max(0, Math.min(MAX_GRACE_MS, Math.floor(value)));
}
function isProcessAlive(pid) {
	try {
		process.kill(pid, 0);
		return true;
	} catch {
		return false;
	}
}
function parseProcessGroupId(value) {
	if (typeof value !== "string" || !/^\d+$/.test(value.trim())) return;
	const pgid = Number(value.trim());
	return Number.isSafeInteger(pgid) && pgid > 0 ? pgid : void 0;
}
function readProcessGroupIdFromPs(pid) {
	try {
		const res = spawnSync("ps", [
			"-p",
			String(pid),
			"-o",
			"pgid="
		], {
			encoding: "utf8",
			timeout: 500
		});
		if (res.error || res.status !== 0) return;
		return parseProcessGroupId(res.stdout);
	} catch {
		return;
	}
}
function readProcessGroupIdFromProc(pid) {
	try {
		const stat = readFileSync(`/proc/${pid}/stat`, "utf8");
		const commEnd = stat.lastIndexOf(")");
		if (commEnd < 0) return;
		return parseProcessGroupId(stat.slice(commEnd + 1).trim().split(/\s+/)[2]);
	} catch {
		return;
	}
}
/** Fail closed to direct-PID signaling when group ownership cannot be proved. */
function isProcessGroupLeader(pid) {
	return ((process.platform === "linux" ? readProcessGroupIdFromProc(pid) : void 0) ?? readProcessGroupIdFromPs(pid)) === pid;
}
function signalProcessTreeUnix(pid, signal, useGroupKill) {
	if (useGroupKill) try {
		process.kill(-pid, signal);
		return;
	} catch {}
	try {
		process.kill(pid, signal);
	} catch {}
}
function runTaskkill(args, onExit) {
	return new Promise((resolve) => {
		let settled = false;
		const finish = (code) => {
			if (settled) return;
			settled = true;
			clearTimeout(completionTimer);
			onExit?.(code);
			resolve();
		};
		const completionTimer = setTimeout(() => finish(null), TASKKILL_COMPLETION_TIMEOUT_MS);
		completionTimer.unref?.();
		try {
			const child = spawn("taskkill", args, {
				stdio: "ignore",
				detached: true,
				windowsHide: true
			});
			child.once("error", () => finish(null));
			child.once("close", (code) => finish(code));
		} catch {
			finish(null);
		}
	});
}
function killProcessTreeWindows(pid, graceMs) {
	let forced = false;
	let graceTimer;
	const forceKill = () => {
		if (forced) return;
		forced = true;
		if (graceTimer !== void 0) {
			clearTimeout(graceTimer);
			graceTimer = void 0;
		}
		if (!isProcessAlive(pid)) return;
		signalProcessTreeWindows(pid, "SIGKILL");
	};
	signalProcessTreeWindows(pid, "SIGTERM", (code) => {
		if (code !== null && code !== 0) forceKill();
	});
	graceTimer = setTimeout(forceKill, graceMs);
	graceTimer.unref();
}
function signalProcessTreeWindows(pid, signal, onExit) {
	signalProcessTreeWindowsAndWait(pid, signal, onExit);
}
function signalProcessTreeWindowsAndWait(pid, signal, onExit) {
	return runTaskkill(signal === "SIGKILL" ? [
		"/F",
		"/T",
		"/PID",
		String(pid)
	] : [
		"/T",
		"/PID",
		String(pid)
	], onExit);
}
//#endregion
export { signalProcessTree as n, killProcessTree as t };
