import { n as sliceUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { F as resolveTimerTimeoutMs } from "./number-coercion-oCkfUEEq.js";
import { n as signalProcessTree } from "./kill-tree-B-nnBWyI.js";
import { o as getShellConfig } from "./shell-utils-_kOWJnU_.js";
import { t as prepareOomScoreAdjustedSpawn } from "./linux-oom-score-eO5nXmjv.js";
import { n as toStringEnv, t as createChildAdapter } from "./child-CoHIdy1v.js";
import { n as resolvePtyTerminalName, r as setPtyTerminalName, t as readPtyTerminalName } from "./pty-terminal-name-CCuR8Uei.js";
import crypto from "node:crypto";
import { performance } from "node:perf_hooks";
//#region src/process/supervisor/adapters/pty.ts
const FORCE_KILL_WAIT_FALLBACK_MS = 4e3;
async function createPtyAdapter(params) {
	const { spawn } = await import("@lydell/node-pty");
	const baseEnv = params.env ? toStringEnv(params.env) : void 0;
	const preparedSpawn = prepareOomScoreAdjustedSpawn(params.shell, params.args, { env: baseEnv });
	const terminalName = resolvePtyTerminalName(params.name ?? readPtyTerminalName(preparedSpawn.env, process.platform) ?? readPtyTerminalName(process.env, process.platform));
	const spawnEnv = preparedSpawn.env ? toStringEnv(preparedSpawn.env) : process.platform === "win32" ? toStringEnv(process.env) : void 0;
	if (spawnEnv) setPtyTerminalName({
		env: spawnEnv,
		name: terminalName,
		platform: process.platform
	});
	const pty = spawn(preparedSpawn.command, preparedSpawn.args, {
		cwd: params.cwd,
		env: spawnEnv,
		name: terminalName,
		cols: params.cols ?? 120,
		rows: params.rows ?? 30
	});
	let dataListener = null;
	let exitListener = null;
	let waitResult = null;
	let resolveWait = null;
	let waitPromise = null;
	let forceKillWaitFallbackTimer = null;
	let stdinDestroyed = false;
	let stdinEnded = false;
	const clearForceKillWaitFallback = () => {
		if (!forceKillWaitFallbackTimer) return;
		clearTimeout(forceKillWaitFallbackTimer);
		forceKillWaitFallbackTimer = null;
	};
	const settleWait = (value) => {
		if (waitResult) return;
		clearForceKillWaitFallback();
		stdinDestroyed = true;
		stdinEnded = true;
		waitResult = value;
		if (resolveWait) {
			const resolve = resolveWait;
			resolveWait = null;
			resolve(value);
		}
	};
	const scheduleForceKillWaitFallback = (signal) => {
		clearForceKillWaitFallback();
		forceKillWaitFallbackTimer = setTimeout(() => {
			settleWait({
				code: null,
				signal
			});
		}, FORCE_KILL_WAIT_FALLBACK_MS);
		forceKillWaitFallbackTimer.unref();
	};
	exitListener = pty.onExit((event) => {
		const signal = event.signal && event.signal !== 0 ? event.signal : null;
		settleWait({
			code: event.exitCode ?? null,
			signal
		});
	});
	const stdin = {
		get destroyed() {
			return stdinDestroyed;
		},
		get writable() {
			return !stdinDestroyed && !stdinEnded;
		},
		get writableEnded() {
			return stdinEnded;
		},
		get writableFinished() {
			return stdinEnded;
		},
		write: (data, cb) => {
			try {
				pty.write(data);
				cb?.(null);
			} catch (err) {
				cb?.(err);
			}
		},
		end: () => {
			try {
				stdinEnded = true;
				const eof = process.platform === "win32" ? "" : "";
				pty.write(eof);
			} catch {}
		},
		destroy: () => {
			stdinDestroyed = true;
			stdinEnded = true;
		}
	};
	const onStdout = (listener) => {
		dataListener = pty.onData((chunk) => {
			listener(chunk);
		});
	};
	const onStderr = (_listener) => {};
	const wait = async () => {
		if (waitResult) return waitResult;
		if (!waitPromise) waitPromise = new Promise((resolve) => {
			resolveWait = resolve;
			if (waitResult) {
				const settled = waitResult;
				resolveWait = null;
				resolve(settled);
			}
		});
		return waitPromise;
	};
	const kill = (signal = "SIGKILL") => {
		try {
			if ((signal === "SIGKILL" || signal === "SIGTERM") && typeof pty.pid === "number" && pty.pid > 0) signalProcessTree(pty.pid, signal, { detached: true });
			else if (process.platform === "win32") pty.kill();
			else pty.kill(signal);
		} catch {}
		if (signal === "SIGKILL") scheduleForceKillWaitFallback(signal);
	};
	const dispose = () => {
		stdinDestroyed = true;
		stdinEnded = true;
		try {
			dataListener?.dispose();
		} catch {}
		try {
			exitListener?.dispose();
		} catch {}
		clearForceKillWaitFallback();
		dataListener = null;
		exitListener = null;
		settleWait({
			code: null,
			signal: null
		});
	};
	return {
		pid: pty.pid || void 0,
		stdin,
		oomScoreWrapperSelected: preparedSpawn.wrapped,
		onStdout,
		onStderr,
		wait,
		kill,
		dispose
	};
}
//#endregion
//#region src/process/supervisor/registry.ts
/** In-memory run index for the supervisor; callers receive detached snapshots. */
function nowMs() {
	return Date.now();
}
const DEFAULT_MAX_EXITED_RECORDS = 2e3;
function resolveMaxExitedRecords(value) {
	if (typeof value !== "number" || !Number.isFinite(value) || value < 1) return DEFAULT_MAX_EXITED_RECORDS;
	return Math.max(1, Math.floor(value));
}
/**
* Create the supervisor's mutable run registry. Exited records are retained
* only for diagnostics, so the cap bounds memory without touching live runs.
*/
function createRunRegistry(options) {
	const records = /* @__PURE__ */ new Map();
	const maxExitedRecords = resolveMaxExitedRecords(options?.maxExitedRecords);
	const pruneExitedRecords = () => {
		if (!records.size) return;
		let exited = 0;
		for (const record of records.values()) if (record.state === "exited") exited += 1;
		if (exited <= maxExitedRecords) return;
		let remove = exited - maxExitedRecords;
		for (const [runId, record] of records.entries()) {
			if (remove <= 0) break;
			if (record.state !== "exited") continue;
			records.delete(runId);
			remove -= 1;
		}
	};
	const add = (record) => {
		records.set(record.runId, { ...record });
	};
	const get = (runId) => {
		const record = records.get(runId);
		return record ? { ...record } : void 0;
	};
	const updateState = (runId, state, patch) => {
		const current = records.get(runId);
		if (!current) return;
		const updatedAtMs = nowMs();
		const next = {
			...current,
			...patch,
			state,
			updatedAtMs,
			lastOutputAtMs: current.lastOutputAtMs
		};
		records.set(runId, next);
		return { ...next };
	};
	const touchOutput = (runId) => {
		const current = records.get(runId);
		if (!current) return;
		const ts = nowMs();
		records.set(runId, {
			...current,
			lastOutputAtMs: ts,
			updatedAtMs: ts
		});
	};
	const finalize = (runId, exit) => {
		const current = records.get(runId);
		if (!current || current.state === "exited") return;
		const ts = nowMs();
		const next = {
			...current,
			state: "exited",
			terminationReason: current.terminationReason ?? exit.reason,
			exitCode: exit.exitCode,
			exitSignal: exit.exitSignal,
			updatedAtMs: ts
		};
		records.set(runId, next);
		pruneExitedRecords();
	};
	return {
		add,
		get,
		updateState,
		touchOutput,
		finalize
	};
}
//#endregion
//#region src/process/supervisor/supervisor.ts
const GRACEFUL_CANCEL_TIMEOUT_MS = 5e3;
const DEFAULT_MAX_CAPTURED_OUTPUT_CHARS = 1024 * 1024;
const loadSupervisorLogRuntime = createLazyRuntimeModule(() => import("./supervisor-log.runtime.js"));
function normalizeTimeoutDuration(value) {
	if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return;
	return Math.max(1, Math.floor(value));
}
function clampCapturedOutputChars(value) {
	if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return DEFAULT_MAX_CAPTURED_OUTPUT_CHARS;
	return Math.max(256, Math.floor(value));
}
function appendCapturedOutput(current, chunk, stream, maxChars) {
	const next = current + chunk;
	if (next.length <= maxChars) return next;
	const marker = `[openclaw: captured ${stream} truncated to last ${maxChars} chars]\n`;
	return `${marker}${sliceUtf16Safe(next, -Math.max(0, maxChars - marker.length))}`;
}
function isTimeoutReason(reason) {
	return reason === "overall-timeout" || reason === "no-output-timeout";
}
function resolveElapsedTimeoutReason(params) {
	if (params.overallTimeoutDeadlineMs !== null && params.nowMs >= params.overallTimeoutDeadlineMs && (params.noOutputTimeoutDeadlineMs === null || params.nowMs < params.noOutputTimeoutDeadlineMs || params.overallTimeoutDeadlineMs <= params.noOutputTimeoutDeadlineMs)) return "overall-timeout";
	return params.noOutputTimeoutDeadlineMs !== null && params.nowMs >= params.noOutputTimeoutDeadlineMs ? "no-output-timeout" : null;
}
function createProcessSupervisor() {
	const registry = createRunRegistry();
	const active = /* @__PURE__ */ new Map();
	const startingRuns = /* @__PURE__ */ new Map();
	const startingScopes = /* @__PURE__ */ new Map();
	const cancel = (runId, reason = "manual-cancel") => {
		const current = active.get(runId);
		if (current) {
			current.run.cancel(reason);
			return;
		}
		const starting = startingRuns.get(runId);
		if (!starting) return;
		starting.terminationReason ??= reason;
		registry.updateState(runId, "exiting", { terminationReason: starting.terminationReason });
		starting.cancel?.(starting.terminationReason);
	};
	const cancelActiveScope = (scopeKey, reason) => {
		for (const [runId, run] of active.entries()) {
			if (run.scopeKey !== scopeKey) continue;
			cancel(runId, reason);
		}
	};
	const cancelScope = (scopeKey, reason = "manual-cancel") => {
		if (!scopeKey.trim()) return;
		cancelActiveScope(scopeKey, reason);
		for (const [runId, starting] of startingRuns.entries()) if (starting.scopeKey === scopeKey) cancel(runId, reason);
	};
	const startRun = async (input, scopeKey, runId, startingRun) => {
		const startedAtMs = Date.now();
		const startingTerminationReason = startingRun.terminationReason;
		const record = {
			runId,
			sessionId: input.sessionId,
			backendId: input.backendId,
			scopeKey,
			state: startingTerminationReason ? "exiting" : "starting",
			...startingTerminationReason ? { terminationReason: startingTerminationReason } : {},
			startedAtMs,
			lastOutputAtMs: startedAtMs,
			createdAtMs: startedAtMs,
			updatedAtMs: startedAtMs
		};
		registry.add(record);
		if (startingTerminationReason) {
			const exit = {
				reason: startingTerminationReason,
				exitCode: null,
				exitSignal: null,
				durationMs: Date.now() - startedAtMs,
				stdout: "",
				stderr: "",
				timedOut: isTimeoutReason(startingTerminationReason),
				noOutputTimedOut: startingTerminationReason === "no-output-timeout"
			};
			registry.finalize(runId, {
				reason: exit.reason,
				exitCode: exit.exitCode,
				exitSignal: exit.exitSignal
			});
			return {
				runId,
				startedAtMs,
				wait: async () => exit,
				cancel: () => void 0
			};
		}
		if (input.replaceExistingScope && scopeKey) cancelActiveScope(scopeKey, "manual-cancel");
		let forcedReason = startingRun.terminationReason ?? null;
		let settled = false;
		let stdout = "";
		let stderr = "";
		let stdoutListener = input.onStdout;
		let stderrListener = input.onStderr;
		let timeoutTimer = null;
		let noOutputTimer = null;
		let forceKillTimer = null;
		let cancelRequested = false;
		const captureOutput = input.captureOutput !== false;
		const maxCapturedOutputChars = clampCapturedOutputChars(input.maxCapturedOutputChars);
		const overallTimeoutMs = normalizeTimeoutDuration(input.timeoutMs);
		const noOutputTimeoutMs = normalizeTimeoutDuration(input.noOutputTimeoutMs);
		let overallTimeoutDeadlineMs = null;
		let noOutputTimeoutDeadlineMs = null;
		const setForcedReason = (reason) => {
			if (forcedReason) return;
			forcedReason = reason;
			registry.updateState(runId, "exiting", { terminationReason: reason });
		};
		let cancelAdapter = null;
		const requestCancel = (reason) => {
			setForcedReason(reason);
			cancelAdapter?.(reason);
		};
		startingRun.cancel = requestCancel;
		const scheduleTimeout = (reason, remainingMs, deadlineMs) => {
			const intervalMs = resolveTimerTimeoutMs(remainingMs, 1);
			return setTimeout(() => {
				if (settled) return;
				const nextRemainingMs = Math.min(remainingMs - intervalMs, deadlineMs - performance.now());
				if (nextRemainingMs <= 0) {
					requestCancel(reason);
					return;
				}
				const nextTimer = scheduleTimeout(reason, nextRemainingMs, deadlineMs);
				if (reason === "overall-timeout") timeoutTimer = nextTimer;
				else noOutputTimer = nextTimer;
			}, intervalMs);
		};
		const touchOutput = () => {
			registry.touchOutput(runId);
			if (!noOutputTimeoutMs || settled) return;
			noOutputTimeoutDeadlineMs = performance.now() + noOutputTimeoutMs;
			if (noOutputTimer) clearTimeout(noOutputTimer);
			noOutputTimer = scheduleTimeout("no-output-timeout", noOutputTimeoutMs, noOutputTimeoutDeadlineMs);
		};
		try {
			if (input.mode === "child" && input.argv.length === 0) throw new Error("spawn argv cannot be empty");
			const adapter = input.mode === "pty" ? await (async () => {
				const { shell, args: shellArgs } = getShellConfig();
				const ptyCommand = input.ptyCommand.trim();
				if (!ptyCommand) throw new Error("PTY command cannot be empty");
				return await createPtyAdapter({
					shell,
					args: [...shellArgs, ptyCommand],
					cwd: input.cwd,
					env: input.env
				});
			})() : await createChildAdapter({
				argv: input.argv,
				cwd: input.cwd,
				env: input.env,
				windowsVerbatimArguments: input.windowsVerbatimArguments,
				input: input.input,
				stdinMode: input.stdinMode,
				secretInput: input.secretInput
			});
			registry.updateState(runId, forcedReason ? "exiting" : "running", {
				pid: adapter.pid,
				...forcedReason ? { terminationReason: forcedReason } : {}
			});
			const clearTimers = () => {
				if (timeoutTimer) {
					clearTimeout(timeoutTimer);
					timeoutTimer = null;
				}
				if (noOutputTimer) {
					clearTimeout(noOutputTimer);
					noOutputTimer = null;
				}
				if (forceKillTimer) {
					clearTimeout(forceKillTimer);
					forceKillTimer = null;
				}
			};
			cancelAdapter = (reason) => {
				if (settled || cancelRequested) return;
				cancelRequested = true;
				if (process.platform === "win32" && (reason === "overall-timeout" || reason === "no-output-timeout")) {
					adapter.kill("SIGKILL");
					return;
				}
				adapter.kill("SIGTERM");
				forceKillTimer = setTimeout(() => {
					if (!settled) adapter.kill("SIGKILL");
				}, GRACEFUL_CANCEL_TIMEOUT_MS);
				forceKillTimer.unref?.();
			};
			if (overallTimeoutMs) {
				overallTimeoutDeadlineMs = performance.now() + overallTimeoutMs;
				timeoutTimer = scheduleTimeout("overall-timeout", overallTimeoutMs, overallTimeoutDeadlineMs);
			}
			if (noOutputTimeoutMs) {
				noOutputTimeoutDeadlineMs = performance.now() + noOutputTimeoutMs;
				noOutputTimer = scheduleTimeout("no-output-timeout", noOutputTimeoutMs, noOutputTimeoutDeadlineMs);
			}
			adapter.onStdout((chunk) => {
				if (captureOutput) stdout = appendCapturedOutput(stdout, chunk, "stdout", maxCapturedOutputChars);
				stdoutListener?.(chunk);
				touchOutput();
			});
			adapter.onStderr((chunk) => {
				if (captureOutput) stderr = appendCapturedOutput(stderr, chunk, "stderr", maxCapturedOutputChars);
				stderrListener?.(chunk);
				touchOutput();
			});
			const waitPromise = (async () => {
				const result = await adapter.wait();
				const deadlineReason = resolveElapsedTimeoutReason({
					nowMs: performance.now(),
					overallTimeoutDeadlineMs,
					noOutputTimeoutDeadlineMs
				});
				const terminalReason = forcedReason ?? deadlineReason;
				settled = true;
				clearTimers();
				adapter.dispose();
				active.delete(runId);
				const reason = terminalReason ?? (result.signal != null ? "signal" : "exit");
				const exit = {
					reason,
					exitCode: result.code,
					exitSignal: result.signal,
					oomScoreWrapperSelected: adapter.oomScoreWrapperSelected === true,
					durationMs: Date.now() - startedAtMs,
					stdout,
					stderr,
					timedOut: isTimeoutReason(reason),
					noOutputTimedOut: terminalReason === "no-output-timeout"
				};
				registry.finalize(runId, {
					reason: exit.reason,
					exitCode: exit.exitCode,
					exitSignal: exit.exitSignal
				});
				return exit;
			})().catch((err) => {
				if (!settled) {
					settled = true;
					clearTimers();
					active.delete(runId);
					adapter.dispose();
					registry.finalize(runId, {
						reason: "spawn-error",
						exitCode: null,
						exitSignal: null
					});
				}
				throw err;
			});
			const managedRun = {
				runId,
				pid: adapter.pid,
				startedAtMs,
				stdin: adapter.stdin,
				wait: async () => await waitPromise,
				cancel: (reason = "manual-cancel") => {
					requestCancel(reason);
				},
				detachOutput: () => {
					stdoutListener = void 0;
					stderrListener = void 0;
				}
			};
			active.set(runId, {
				run: managedRun,
				scopeKey
			});
			if (forcedReason) managedRun.cancel(forcedReason);
			return managedRun;
		} catch (err) {
			registry.finalize(runId, {
				reason: "spawn-error",
				exitCode: null,
				exitSignal: null
			});
			const { warnProcessSupervisorSpawnFailure } = await loadSupervisorLogRuntime();
			warnProcessSupervisorSpawnFailure(`spawn failed: runId=${runId} reason=${String(err)}`);
			throw err;
		}
	};
	const spawn = (input) => {
		const scopeKey = normalizeOptionalString(input.scopeKey);
		const runId = normalizeOptionalString(input.runId) ?? crypto.randomUUID();
		const startingRun = { scopeKey };
		startingRuns.set(runId, startingRun);
		const starting = scopeKey ? startingScopes.get(scopeKey) ?? { runs: /* @__PURE__ */ new Set() } : void 0;
		if (scopeKey && starting) startingScopes.set(scopeKey, starting);
		const previous = starting ? input.replaceExistingScope ? Array.from(starting.runs) : starting.replacement ? [starting.replacement] : [] : [];
		const pending = previous.length > 0 ? Promise.allSettled(previous).then(() => startRun(input, scopeKey, runId, startingRun)) : startRun(input, scopeKey, runId, startingRun);
		starting?.runs.add(pending);
		if (starting && input.replaceExistingScope) starting.replacement = pending;
		const clearPendingStart = () => {
			if (startingRuns.get(runId) === startingRun) startingRuns.delete(runId);
			starting?.runs.delete(pending);
			if (starting?.replacement === pending) delete starting.replacement;
			if (scopeKey && starting?.runs.size === 0 && startingScopes.get(scopeKey) === starting) startingScopes.delete(scopeKey);
		};
		pending.then(clearPendingStart, clearPendingStart);
		return pending;
	};
	return {
		spawn,
		cancel,
		cancelScope,
		getRecord: (runId) => registry.get(runId)
	};
}
//#endregion
//#region src/process/supervisor/index.ts
let singleton = null;
/** Return the process-wide supervisor used by runtime code that does not inject one. */
function getProcessSupervisor() {
	if (singleton) return singleton;
	singleton = createProcessSupervisor();
	return singleton;
}
//#endregion
export { getProcessSupervisor as t };
