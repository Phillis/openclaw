import { i as toErrorObject } from "./error-coercion-DisD0JTb.js";
import "./errors-CSNUPl5U.js";
import { n as signalProcessTree } from "./kill-tree-B-nnBWyI.js";
import { t as createWindowsOutputDecoder } from "./windows-encoding-zzUQjdb4.js";
import { a as resolveWindowsCommandShim, i as resolveTrustedWindowsCmdExe, n as isWindowsBatchCommand, t as buildWindowsCmdExeCommandLine } from "./windows-command-LFdkl-nm.js";
import { n as spawnWithFallback } from "./spawn-utils-BBfh8_OA.js";
import { i as resolveWindowsExecutablePath, o as resolveWindowsSpawnProgramCandidate } from "./windows-spawn-zZP1Z6cM.js";
import { t as prepareOomScoreAdjustedSpawn } from "./linux-oom-score-eO5nXmjv.js";
//#region src/process/spawn-secret-input.ts
function addSecretInputStdio(stdio, secretInput) {
	if (!secretInput) return;
	if (!Number.isInteger(secretInput.fd) || secretInput.fd < 3) throw new Error("secret input file descriptor must be an integer greater than 2");
	while (stdio.length <= secretInput.fd) stdio.push("ignore");
	stdio[secretInput.fd] = process.platform === "win32" ? "overlapped" : "pipe";
}
async function writeSecretInputToChild(child, secretInput) {
	if (!secretInput) return;
	const stream = child.stdio[secretInput.fd];
	if (!stream || typeof stream.end !== "function") throw new Error(`secret input file descriptor ${secretInput.fd} is unavailable`);
	let data;
	try {
		data = secretInput.createData();
		await new Promise((resolve, reject) => {
			let settled = false;
			const settle = (error) => {
				if (settled) return;
				settled = true;
				if (error) reject(error);
				else resolve();
			};
			const onError = (error) => {
				settle(error);
			};
			stream.on("error", onError);
			stream.once("close", () => {
				stream.off("error", onError);
			});
			stream.end(data, settle);
		});
	} finally {
		data?.fill(0);
	}
}
//#endregion
//#region src/process/supervisor/adapters/env.ts
/** Convert Node's optional env values into the concrete string map spawn adapters expect. */
function toStringEnv(env) {
	if (!env) return {};
	const out = {};
	for (const [key, value] of Object.entries(env)) {
		if (value === void 0) continue;
		out[key] = value;
	}
	return out;
}
//#endregion
//#region src/process/supervisor/adapters/child.ts
const FORCE_KILL_WAIT_FALLBACK_MS = 4e3;
const FORCED_WINDOWS_CLOSE_SETTLE_MS = 250;
const WINDOWS_PACKAGE_MANAGER_SHIMS = [
	"npm",
	"pnpm",
	"yarn",
	"npx"
];
function resolveChildInvocation(params) {
	const command = params.argv[0] ?? "";
	const candidate = resolveWindowsSpawnProgramCandidate({
		command,
		env: params.env,
		execPath: process.platform === "win32" ? resolveWindowsExecutablePath("node", params.env ?? process.env) : void 0
	});
	const args = [...candidate.leadingArgv, ...params.argv.slice(1)];
	const resolvedCommand = candidate.resolution === "direct" && candidate.command === command ? resolveWindowsCommandShim({
		command,
		cmdCommands: WINDOWS_PACKAGE_MANAGER_SHIMS
	}) : candidate.command;
	if (!isWindowsBatchCommand(resolvedCommand)) return {
		command: resolvedCommand,
		args,
		windowsVerbatimArguments: params.windowsVerbatimArguments
	};
	return {
		command: resolveTrustedWindowsCmdExe(),
		args: [
			"/d",
			"/s",
			"/c",
			buildWindowsCmdExeCommandLine(resolvedCommand, args)
		],
		windowsVerbatimArguments: true
	};
}
const WORKER_START_MESSAGE = { type: "openclaw-worker-start-v1" };
function isServiceManagedRuntime() {
	return Boolean(process.env.OPENCLAW_SERVICE_MARKER?.trim());
}
async function createChildAdapter(params) {
	const baseEnv = params.env ? toStringEnv(params.env) : void 0;
	const invocation = resolveChildInvocation({
		argv: params.argv,
		env: baseEnv,
		windowsVerbatimArguments: params.windowsVerbatimArguments
	});
	const preparedSpawn = params.exactEnv ? {
		command: invocation.command,
		args: invocation.args,
		env: baseEnv,
		wrapped: false
	} : prepareOomScoreAdjustedSpawn(invocation.command, invocation.args, { env: baseEnv });
	const stdinMode = params.stdinMode ?? (params.input !== void 0 ? "pipe-closed" : "inherit");
	const useDetached = process.platform !== "win32" && (params.ownedWorker !== void 0 || !isServiceManagedRuntime());
	const stdio = [
		stdinMode === "inherit" ? "inherit" : "pipe",
		"pipe",
		"pipe"
	];
	addSecretInputStdio(stdio, params.secretInput);
	if (params.ownedWorker !== void 0) stdio.push("ipc");
	const options = {
		cwd: params.cwd,
		env: preparedSpawn.env,
		stdio,
		detached: useDetached,
		windowsHide: true,
		windowsVerbatimArguments: invocation.windowsVerbatimArguments
	};
	const spawned = await spawnWithFallback({
		argv: [preparedSpawn.command, ...preparedSpawn.args],
		options,
		fallbacks: useDetached && params.ownedWorker === void 0 ? [{
			label: "no-detach",
			options: { detached: false }
		}] : []
	});
	const child = spawned.child;
	if (params.ownedWorker !== void 0 && (!child.connected || !child.channel)) {
		spawned.child.kill("SIGKILL");
		throw new Error("worker lifecycle IPC channel was not created");
	}
	if (params.onWorkerMessage) child.on("message", (message) => {
		try {
			params.onWorkerMessage?.(message);
		} catch {}
	});
	const disconnectWorkerIpc = () => {
		if (!child.connected) return;
		try {
			child.disconnect();
		} catch (error) {
			if (error.code !== "ERR_IPC_DISCONNECTED") throw error;
		}
	};
	const ignoreOutputStreamError = () => {};
	child.stdout.on("error", ignoreOutputStreamError);
	child.stderr.on("error", ignoreOutputStreamError);
	const childStdin = spawned.child.stdin;
	let stdinDestroyed = childStdin?.destroyed ?? false;
	let stdinEnded = childStdin?.writableEnded === true || childStdin?.writableFinished === true;
	if (childStdin) {
		childStdin.once("finish", () => {
			stdinEnded = true;
		});
		childStdin.once("close", () => {
			stdinEnded = true;
			stdinDestroyed = true;
		});
		childStdin.once("error", () => {
			stdinDestroyed = true;
		});
		if (params.input !== void 0) {
			childStdin.write(params.input);
			stdinEnded = true;
			childStdin.end();
		} else if (stdinMode === "pipe-closed") {
			stdinEnded = true;
			childStdin.end();
		}
	}
	const stdin = childStdin ? {
		get destroyed() {
			return stdinDestroyed || childStdin.destroyed;
		},
		get writable() {
			return !stdinDestroyed && !stdinEnded && childStdin.writable;
		},
		get writableEnded() {
			return stdinEnded || childStdin.writableEnded;
		},
		get writableFinished() {
			return childStdin.writableFinished;
		},
		write: (data, cb) => {
			if (stdinDestroyed || stdinEnded || !childStdin.writable) {
				cb?.(/* @__PURE__ */ new Error("stdin is not writable"));
				return;
			}
			try {
				childStdin.write(data, cb);
			} catch (err) {
				cb?.(err);
			}
		},
		end: () => {
			try {
				stdinEnded = true;
				childStdin.end();
			} catch {}
		},
		destroy: () => {
			try {
				stdinDestroyed = true;
				stdinEnded = true;
				childStdin.destroy();
			} catch {}
		}
	} : void 0;
	const onStdout = (listener) => {
		const stdoutDecoder = createWindowsOutputDecoder();
		let flushed = false;
		const flush = () => {
			if (flushed) return;
			flushed = true;
			const tail = stdoutDecoder.flush();
			if (tail) listener(tail);
		};
		child.stdout.on("data", (chunk) => {
			const text = stdoutDecoder.decode(chunk);
			if (text) listener(text);
		});
		child.stdout.once("end", flush);
		child.stdout.once("close", flush);
	};
	const onStderr = (listener) => {
		const stderrDecoder = createWindowsOutputDecoder();
		let flushed = false;
		const flush = () => {
			if (flushed) return;
			flushed = true;
			const tail = stderrDecoder.flush();
			if (tail) listener(tail);
		};
		child.stderr.on("data", (chunk) => {
			const text = stderrDecoder.decode(chunk);
			if (text) listener(text);
		});
		child.stderr.once("end", flush);
		child.stderr.once("close", flush);
	};
	let waitResult = null;
	let waitError;
	let resolveWait = null;
	let rejectWait = null;
	let waitPromise = null;
	let forceKillWaitFallbackTimer = null;
	let forcedWindowsCloseTimer = null;
	let hardKillRequested = false;
	let windowsTreeKillCompleted = false;
	let childExitState = null;
	let childCloseState = null;
	let stdoutDrained = child.stdout == null;
	let stderrDrained = child.stderr == null;
	const clearForceKillWaitFallback = () => {
		if (!forceKillWaitFallbackTimer) return;
		clearTimeout(forceKillWaitFallbackTimer);
		forceKillWaitFallbackTimer = null;
	};
	const clearForcedWindowsCloseTimer = () => {
		if (!forcedWindowsCloseTimer) return;
		clearTimeout(forcedWindowsCloseTimer);
		forcedWindowsCloseTimer = null;
	};
	const settleWait = (value) => {
		if (waitResult || waitError !== void 0) return;
		clearForceKillWaitFallback();
		clearForcedWindowsCloseTimer();
		waitResult = value;
		if (resolveWait) {
			const resolve = resolveWait;
			resolveWait = null;
			rejectWait = null;
			resolve(value);
		}
	};
	const rejectPendingWait = (error) => {
		if (waitResult || waitError !== void 0) return;
		clearForceKillWaitFallback();
		clearForcedWindowsCloseTimer();
		waitError = error;
		if (rejectWait) {
			const reject = rejectWait;
			resolveWait = null;
			rejectWait = null;
			reject(error);
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
		forceKillWaitFallbackTimer.unref?.();
	};
	const resolveObservedExitState = (fallback) => {
		if (childExitState != null) return childExitState;
		return {
			code: child.exitCode ?? fallback.code,
			signal: child.signalCode ?? fallback.signal
		};
	};
	const scheduleForcedWindowsCloseSettlement = () => {
		if (process.platform !== "win32" || !hardKillRequested || !windowsTreeKillCompleted || childExitState == null || forcedWindowsCloseTimer) return;
		const exitState = childExitState;
		forcedWindowsCloseTimer = setTimeout(() => {
			child.stdout?.destroy();
			child.stderr?.destroy();
			settleWait(resolveObservedExitState(exitState));
		}, FORCED_WINDOWS_CLOSE_SETTLE_MS);
		forcedWindowsCloseTimer.unref?.();
	};
	const isWindowsHardKillSettlementBlocked = () => process.platform === "win32" && hardKillRequested && !windowsTreeKillCompleted;
	const maybeSettleAfterWindowsExit = () => {
		if (process.platform !== "win32" || isWindowsHardKillSettlementBlocked() || childExitState == null || !stdoutDrained || !stderrDrained) return;
		settleWait(resolveObservedExitState(childExitState));
	};
	child.stdout?.once("end", () => {
		stdoutDrained = true;
		maybeSettleAfterWindowsExit();
	});
	child.stdout?.once("close", () => {
		stdoutDrained = true;
		maybeSettleAfterWindowsExit();
	});
	child.stderr?.once("end", () => {
		stderrDrained = true;
		maybeSettleAfterWindowsExit();
	});
	child.stderr?.once("close", () => {
		stderrDrained = true;
		maybeSettleAfterWindowsExit();
	});
	child.once("error", (error) => {
		rejectPendingWait(error);
	});
	child.once("exit", (code, signal) => {
		childExitState = {
			code,
			signal
		};
		scheduleForcedWindowsCloseSettlement();
		maybeSettleAfterWindowsExit();
	});
	child.once("close", (code, signal) => {
		childCloseState = {
			code,
			signal
		};
		childExitState ??= childCloseState;
		if (isWindowsHardKillSettlementBlocked()) return;
		settleWait(resolveObservedExitState(childCloseState));
	});
	if (params.secretInput) try {
		await writeSecretInputToChild(spawned.child, params.secretInput);
	} catch (error) {
		spawned.child.kill("SIGKILL");
		throw error;
	}
	const wait = async () => {
		if (waitResult) return waitResult;
		if (waitError !== void 0) throw toErrorObject(waitError, "Non-Error thrown");
		if (!waitPromise) waitPromise = new Promise((resolve, reject) => {
			resolveWait = resolve;
			rejectWait = reject;
		});
		return waitPromise;
	};
	const childIsDetached = useDetached && !spawned.usedFallback;
	const signalProcessTreeForChild = (pid, signal) => {
		signalProcessTree(pid, signal, { detached: childIsDetached });
	};
	const signalProcessTreeForChildAndWait = (pid, signal) => new Promise((resolve) => {
		signalProcessTree(pid, signal, {
			detached: childIsDetached,
			onComplete: resolve
		});
	});
	const kill = (signal) => {
		const pid = child.pid ?? void 0;
		if (signal === void 0 || signal === "SIGKILL") {
			hardKillRequested = true;
			scheduleForcedWindowsCloseSettlement();
			if (pid) signalProcessTreeForChildAndWait(pid, "SIGKILL").then(() => {
				try {
					child.kill("SIGKILL");
				} catch {}
				windowsTreeKillCompleted = true;
				if (childCloseState) {
					settleWait(resolveObservedExitState(childCloseState));
					return;
				}
				maybeSettleAfterWindowsExit();
				scheduleForcedWindowsCloseSettlement();
			});
			else {
				windowsTreeKillCompleted = true;
				try {
					child.kill("SIGKILL");
				} catch {}
			}
			scheduleForceKillWaitFallback("SIGKILL");
			return;
		}
		if (signal === "SIGTERM" && pid) {
			signalProcessTreeForChild(pid, "SIGTERM");
			return;
		}
		try {
			child.kill(signal);
		} catch {}
	};
	const dispose = () => {
		clearForceKillWaitFallback();
		clearForcedWindowsCloseTimer();
		if (params.ownedWorker !== void 0) disconnectWorkerIpc();
		child.removeAllListeners();
	};
	const closeStartGate = params.ownedWorker ? disconnectWorkerIpc : void 0;
	let startGateOpened = false;
	const openStartGate = params.ownedWorker ? async () => {
		if (startGateOpened) return;
		startGateOpened = true;
		await new Promise((resolve, reject) => {
			if (!child.connected) {
				reject(/* @__PURE__ */ new Error("worker lifecycle IPC channel closed before startup"));
				return;
			}
			try {
				child.send(WORKER_START_MESSAGE, (error) => {
					if (error) {
						reject(error);
						return;
					}
					resolve();
				});
			} catch (error) {
				reject(toErrorObject(error, "worker lifecycle IPC send failed"));
			}
		});
	} : void 0;
	return {
		pid: child.pid ?? void 0,
		stdin,
		oomScoreWrapperSelected: preparedSpawn.wrapped,
		onStdout,
		onStderr,
		wait,
		kill,
		dispose,
		closeStartGate,
		openStartGate
	};
}
//#endregion
export { writeSecretInputToChild as i, toStringEnv as n, addSecretInputStdio as r, createChildAdapter as t };
