import { i as toErrorObject } from "./error-coercion-CKFmnpjH.js";
import "./src-BntaCZM-.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { F as resolveTimerTimeoutMs } from "./number-coercion-CLj0HTDM.js";
import { t as killProcessTree } from "./kill-tree-CR2oLt9D.js";
import { r as markOpenClawExecEnv } from "./openclaw-exec-env-BmbZ1aqS.js";
import { a as getWindowsSystem32ExePath } from "./windows-install-roots-BdGcwph2.js";
import { i as resolveWindowsConsoleEncoding, n as decodeWindowsOutputBuffer } from "./windows-encoding-BFYUNnZu.js";
import { t as mergeProcessEnv } from "./process-env-CW4bkwqq.js";
import { n as logError, t as logDebug } from "./logger-D4iLuGk3.js";
import { i as shouldLogVerbose, t as danger } from "./globals-GZNLg1ns.js";
import { n as truncateUtf8Suffix } from "./utf8-truncate-Dro7v_iB.js";
import { r as resolveSafeChildProcessInvocation } from "./windows-command-CUOcsQOM.js";
import { t as resolveCommandStdio } from "./spawn-utils-DPql2kkW.js";
import process from "node:process";
import path from "node:path";
import { StringDecoder } from "node:string_decoder";
import { execa } from "execa";
//#region src/process/child-process.ts
const EXIT_STDIO_GRACE_MS = 100;
const EXIT_STDIO_MAX_DRAIN_MS = 1e3;
/**
* Execa waits for stdout/stderr after the direct child exits. Bound that wait
* when detached descendants keep inherited pipes open, while still draining
* short output tails. The returned cleanup must run after awaiting the child.
*/
function releaseChildProcessOutputAfterExit(child) {
	let idleTimer;
	let releaseImmediate;
	let deadlineTimer;
	const cleanup = () => {
		clearTimeout(idleTimer);
		clearImmediate(releaseImmediate);
		clearTimeout(deadlineTimer);
		child.removeListener("exit", onExit);
		child.stdout?.removeListener("data", onData);
		child.stderr?.removeListener("data", onData);
	};
	const release = () => {
		cleanup();
		child.stdout?.destroy();
		child.stderr?.destroy();
	};
	const scheduleRelease = () => {
		releaseImmediate ??= setImmediate(release);
		releaseImmediate.unref();
	};
	const armIdleTimer = () => {
		clearTimeout(idleTimer);
		clearImmediate(releaseImmediate);
		releaseImmediate = void 0;
		idleTimer = setTimeout(scheduleRelease, EXIT_STDIO_GRACE_MS);
		idleTimer.unref();
	};
	const onData = () => {
		if (deadlineTimer) armIdleTimer();
	};
	const onExit = () => {
		deadlineTimer = setTimeout(() => {
			deadlineTimer = void 0;
			scheduleRelease();
		}, EXIT_STDIO_MAX_DRAIN_MS);
		deadlineTimer.unref();
		armIdleTimer();
	};
	child.stdout?.on("data", onData);
	child.stderr?.on("data", onData);
	child.once("exit", onExit);
	return cleanup;
}
//#endregion
//#region src/process/exec-output.ts
const DEFAULT_COMMAND_OUTPUT_MAX_BYTES = 16 * 1024 * 1024;
const MAX_PRESERVED_PENDING_LINE_BYTES = 8 * 1024;
function createCapturedOutputBuffers() {
	return {
		chunks: [],
		bytes: 0,
		truncatedBytes: 0,
		preservedLines: [],
		decoder: new StringDecoder("utf8"),
		pendingLine: ""
	};
}
function normalizeMaxOutputBytes(value) {
	if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return DEFAULT_COMMAND_OUTPUT_MAX_BYTES;
	return Math.max(1, Math.floor(value));
}
function resolveMaxOutputBytes(value, stream) {
	return normalizeMaxOutputBytes(typeof value === "number" ? value : value?.[stream]);
}
function resolveOutputCapture(value, stream) {
	return (typeof value === "string" ? value : value?.[stream]) ?? "tail";
}
function shouldTerminateOnOutputLimit(value, limit) {
	return typeof value === "boolean" ? value : value?.[limit] === true;
}
function shouldTerminateOnOutputError(value, stream) {
	return typeof value === "boolean" ? value : value?.[stream] === true;
}
function appendCapturedOutput(capture, chunk, maxBytes, mode) {
	const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
	if (mode === "discard") {
		capture.truncatedBytes += buffer.byteLength;
		return;
	}
	if (mode === "head") {
		const remaining = Math.max(0, maxBytes - capture.bytes);
		if (remaining > 0) {
			const kept = buffer.subarray(0, remaining);
			capture.chunks.push(kept);
			capture.bytes += kept.byteLength;
		}
		capture.truncatedBytes += Math.max(0, buffer.byteLength - remaining);
		return;
	}
	if (buffer.byteLength >= maxBytes) {
		capture.chunks = [Buffer.from(buffer.subarray(buffer.byteLength - maxBytes))];
		capture.truncatedBytes += capture.bytes + buffer.byteLength - maxBytes;
		capture.bytes = maxBytes;
		return;
	}
	capture.chunks.push(buffer);
	capture.bytes += buffer.byteLength;
	while (capture.bytes > maxBytes && capture.chunks.length > 0) {
		const first = expectDefined(capture.chunks[0], "chunks entry at 0");
		const overflow = capture.bytes - maxBytes;
		if (first.byteLength <= overflow) {
			capture.chunks.shift();
			capture.bytes -= first.byteLength;
			capture.truncatedBytes += first.byteLength;
		} else {
			capture.chunks[0] = Buffer.from(first.subarray(overflow));
			capture.bytes -= overflow;
			capture.truncatedBytes += overflow;
		}
	}
}
function trimTruncatedUtf8Boundary(buffer, mode, truncatedBytes, forceUtf8) {
	if (truncatedBytes === 0 || buffer.length === 0 || process.platform === "win32" && !forceUtf8) return buffer;
	if (mode === "tail") {
		let start = 0;
		while (start < buffer.length && (expectDefined(buffer[start], "buffer byte") & 192) === 128) start += 1;
		return buffer.subarray(start);
	}
	const decoder = new TextDecoder("utf-8", { fatal: true });
	for (let removed = 0; removed <= 3 && removed <= buffer.length; removed += 1) {
		const end = buffer.length - removed;
		try {
			decoder.decode(buffer.subarray(0, end));
			return buffer.subarray(0, end);
		} catch {}
	}
	return buffer;
}
function finalizeCapturedOutput(capture, mode, forceUtf8 = false) {
	const buffered = Buffer.concat(capture.chunks, capture.bytes);
	const trimmed = trimTruncatedUtf8Boundary(buffered, mode, capture.truncatedBytes, forceUtf8);
	capture.truncatedBytes += buffered.byteLength - trimmed.byteLength;
	return trimmed;
}
function trimPreservedPendingLine(value, maxBytes) {
	return truncateUtf8Suffix(value, maxBytes);
}
function appendPreservedOutputLines(params) {
	if (!params.preserveOutputLine || params.maxPreservedOutputLines <= 0) return;
	const text = Buffer.isBuffer(params.chunk) ? params.capture.decoder.write(params.chunk) : params.chunk;
	if (!text) return;
	const lines = (params.capture.pendingLine + text).split(/\r?\n/);
	params.capture.pendingLine = trimPreservedPendingLine(lines.pop() ?? "", params.maxPendingLineBytes);
	for (const line of lines) if (params.capture.preservedLines.length < params.maxPreservedOutputLines && params.preserveOutputLine(line, params.stream)) params.capture.preservedLines.push(line);
}
function flushPreservedOutputLine(params) {
	if (!params.preserveOutputLine || params.maxPreservedOutputLines <= 0) return;
	const trailing = trimPreservedPendingLine(params.capture.pendingLine + params.capture.decoder.end(), params.maxPendingLineBytes);
	params.capture.pendingLine = "";
	if (trailing && params.capture.preservedLines.length < params.maxPreservedOutputLines && params.preserveOutputLine(trailing, params.stream)) params.capture.preservedLines.push(trailing);
}
//#endregion
//#region src/process/exec-result.ts
function createSanitizedCommandError(result) {
	const code = typeof result.code === "string" ? result.code : void 0;
	const exitCode = typeof result.exitCode === "number" ? result.exitCode : void 0;
	const signal = typeof result.signal === "string" ? result.signal : void 0;
	const message = result.timedOut ? "Command timed out" : result.isMaxBuffer ? "Command output exceeded its capture limit" : result.isCanceled ? "Command was canceled" : result.isTerminated ? `Command was terminated${signal ? ` by ${signal}` : ""}` : exitCode !== void 0 && exitCode !== 0 ? `Command exited with code ${exitCode}` : `Command failed during launch or output capture${code ? ` (${code})` : ""}`;
	return Object.assign(new Error(message), {
		...code ? { code } : {},
		...exitCode !== void 0 ? { exitCode } : {},
		...signal ? { signal } : {}
	});
}
function isPlainCommandExitFailure(result) {
	return result.failed && typeof result.exitCode === "number" && result.exitCode !== 0 && result.signal === void 0 && result.cause === void 0 && !result.timedOut && !result.isCanceled && !result.isMaxBuffer && !result.isTerminated;
}
function isPlainCommandSignalFailure(result) {
	return result.failed && result.exitCode === void 0 && typeof result.signal === "string" && result.cause === void 0 && !result.timedOut && !result.isCanceled && !result.isMaxBuffer && result.isTerminated === true;
}
function resolveProcessExitCode(params) {
	return params.explicitCode ?? params.childExitCode ?? (params.usesWindowsExitCodeShim && params.resolvedSignal == null && !params.timedOut && !params.noOutputTimedOut && !params.killIssuedByTimeout && !params.killIssuedByAbort ? 0 : null);
}
//#endregion
//#region src/process/exec-spawn.ts
function shouldSpawnWithShell(params) {
	return false;
}
function spawnCommandWithInvocation(argv, options = {}) {
	const { baseEnv, env, windowsVerbatimArguments, ...execaOptions } = options;
	const commandEnv = resolveCommandEnv({
		argv,
		baseEnv,
		env
	});
	const invocation = resolveSafeChildProcessInvocation({
		argv,
		cwd: execaOptions.cwd,
		env: commandEnv,
		windowsVerbatimArguments
	});
	return {
		child: execa(invocation.command, invocation.args, {
			...execaOptions,
			env: commandEnv,
			extendEnv: false,
			shell: false,
			windowsHide: invocation.windowsHide,
			windowsVerbatimArguments: invocation.windowsVerbatimArguments
		}),
		invocation
	};
}
/** Spawn through the canonical argv, environment, and Windows safety boundary. */
function spawnCommand(argv, options = {}) {
	return spawnCommandWithInvocation(argv, options).child;
}
function resolveCommandEnv(params) {
	const baseEnv = params.baseEnv ?? process.env;
	const platform = params.platform ?? process.platform;
	const argv = params.argv;
	const shouldSuppressNpmFund = (() => {
		const cmd = path.basename(argv[0] ?? "");
		if (cmd === "npm" || cmd === "npm.cmd" || cmd === "npm.exe") return true;
		if (cmd === "node" || cmd === "node.exe") return (argv[1] ?? "").includes("npm-cli.js");
		return false;
	})();
	const resolvedEnv = mergeProcessEnv([baseEnv, params.env], platform);
	if (shouldSuppressNpmFund) {
		if (resolvedEnv.NPM_CONFIG_FUND == null) resolvedEnv.NPM_CONFIG_FUND = "false";
		if (resolvedEnv.npm_config_fund == null) resolvedEnv.npm_config_fund = "false";
	}
	return markOpenClawExecEnv(resolvedEnv);
}
//#endregion
//#region src/process/exec-termination.ts
const WINDOWS_TASKKILL_TIMEOUT_MS = 5e3;
function createCommandTerminationController(params) {
	let processTreeSettleAt;
	let windowsTerminationPromise;
	const isDirectChildAlive = () => !params.isChildExited() && params.child.exitCode == null && params.child.signalCode == null;
	const killDirectChild = () => {
		if (isDirectChildAlive()) params.child.kill("SIGKILL");
	};
	const spawnTaskkillOrFallback = (args, onSpawnError) => {
		try {
			return spawnCommand([getWindowsSystem32ExePath("taskkill.exe"), ...args], {
				baseEnv: params.baseEnv,
				env: params.env,
				forceKillAfterDelay: 300,
				reject: false,
				stdio: "ignore",
				timeout: WINDOWS_TASKKILL_TIMEOUT_MS
			}).then((result) => {
				if (result.failed && result.exitCode === void 0) onSpawnError();
				return result;
			}, () => {
				onSpawnError();
			});
		} catch {
			onSpawnError();
			return;
		}
	};
	const startWindowsTermination = (childPid, graceful) => {
		const taskkills = [];
		const startTaskkill = (args) => {
			const taskkill = spawnTaskkillOrFallback(args, killDirectChild);
			if (taskkill) taskkills.push(taskkill);
		};
		windowsTerminationPromise = (async () => {
			if (graceful) {
				startTaskkill([
					"/PID",
					String(childPid),
					"/T"
				]);
				await new Promise((resolve) => {
					setTimeout(resolve, params.killGraceMs).unref();
				});
				if (isDirectChildAlive()) startTaskkill([
					"/PID",
					String(childPid),
					"/T",
					"/F"
				]);
			} else startTaskkill([
				"/PID",
				String(childPid),
				"/T",
				"/F"
			]);
			await Promise.allSettled(taskkills);
			if (!params.isCommandSettled()) params.cancelController.abort();
		})();
	};
	const terminate = () => {
		const childPid = params.child.pid;
		const directChildAlive = isDirectChildAlive();
		if (process.platform === "win32" && !directChildAlive) return false;
		if (params.processTree && typeof childPid === "number") {
			const force = params.processTree.mode === "force";
			if (!force) processTreeSettleAt ??= Date.now() + params.killGraceMs;
			if (process.platform === "win32") {
				startWindowsTermination(childPid, !force);
				return true;
			}
			killProcessTree(childPid, {
				...force ? { force: true } : { graceMs: params.killGraceMs },
				detached: true
			});
			return false;
		}
		if (!directChildAlive) return false;
		if (process.platform === "win32" && typeof childPid === "number") {
			startWindowsTermination(childPid, false);
			return true;
		}
		return false;
	};
	const settle = async () => {
		if (windowsTerminationPromise) await windowsTerminationPromise;
		if (params.processTree?.mode !== "graceful" || processTreeSettleAt === void 0 || typeof params.child.pid !== "number") return;
		const remainingMs = Math.max(0, processTreeSettleAt - Date.now());
		if (remainingMs > 0) await new Promise((resolve) => {
			setTimeout(resolve, remainingMs);
		});
		if (process.platform !== "win32") killProcessTree(params.child.pid, {
			force: true,
			detached: true
		});
	};
	return {
		terminate,
		settle
	};
}
//#endregion
//#region src/process/exec-runner.ts
const WINDOWS_CLOSE_STATE_SETTLE_TIMEOUT_MS = 250;
const WINDOWS_CLOSE_STATE_POLL_MS = 10;
async function runCommandWithTimeout(argv, optionsOrTimeout) {
	return await runCommandWithOutputEncoding(argv, optionsOrTimeout, false);
}
/** Run a command whose stdout and stderr are defined to be UTF-8 on every platform. */
async function runUtf8CommandWithTimeout(argv, optionsOrTimeout) {
	return await runCommandWithOutputEncoding(argv, optionsOrTimeout, true);
}
async function runCommandWithOutputEncoding(argv, optionsOrTimeout, forceUtf8) {
	const options = typeof optionsOrTimeout === "number" ? { timeoutMs: optionsOrTimeout } : optionsOrTimeout;
	const { timeoutMs, cwd, input, baseEnv, env, noOutputTimeoutMs, signal, killProcessTree, killSignal, killGraceMs } = options;
	const resolvedTimeoutMs = typeof timeoutMs === "number" ? resolveTimerTimeoutMs(timeoutMs, 1) : void 0;
	const hasInput = input !== void 0;
	const stdio = resolveCommandStdio({
		hasInput,
		preferInherit: true
	});
	const resolvedKillGraceMs = resolveTimerTimeoutMs(killGraceMs, 300, 0);
	if (signal?.aborted) return {
		stdout: "",
		stderr: "",
		code: null,
		signal: null,
		killed: false,
		termination: "signal",
		noOutputTimedOut: false
	};
	const stdoutCapture = createCapturedOutputBuffers();
	const stderrCapture = createCapturedOutputBuffers();
	const maxStdoutBytes = resolveMaxOutputBytes(options.maxOutputBytes, "stdout");
	const maxStderrBytes = resolveMaxOutputBytes(options.maxOutputBytes, "stderr");
	const maxCombinedOutputBytes = typeof options.maxCombinedOutputBytes === "number" && Number.isFinite(options.maxCombinedOutputBytes) && options.maxCombinedOutputBytes > 0 ? Math.max(1, Math.floor(options.maxCombinedOutputBytes)) : void 0;
	const stdoutCaptureMode = resolveOutputCapture(options.outputCapture, "stdout");
	const stderrCaptureMode = resolveOutputCapture(options.outputCapture, "stderr");
	if (maxCombinedOutputBytes !== void 0 && stdoutCaptureMode !== stderrCaptureMode) throw new Error("maxCombinedOutputBytes requires matching stdout and stderr capture modes");
	const usesCombinedTailCapture = maxCombinedOutputBytes !== void 0 && stdoutCaptureMode === "tail" && stderrCaptureMode === "tail";
	const maxPreservedPendingLineBytes = Math.min(Math.max(maxStdoutBytes, maxStderrBytes), MAX_PRESERVED_PENDING_LINE_BYTES);
	const maxPreservedOutputLines = Math.max(0, Math.floor(options.maxPreservedOutputLines ?? 16));
	const windowsEncoding = forceUtf8 ? null : resolveWindowsConsoleEncoding();
	const cancelController = new AbortController();
	let termination;
	let childExitState;
	let childExited = false;
	let commandSettled = false;
	let combinedOutputBytes = 0;
	let combinedCapturedBytes = 0;
	const outputBytesByStream = {
		stdout: 0,
		stderr: 0
	};
	const combinedCapturedBytesByStream = {
		stdout: 0,
		stderr: 0
	};
	const combinedTailChunks = [];
	let noOutputTimer;
	let outputObserverError;
	let outputErrorStream;
	let terminatingOutputError;
	const { child, invocation } = spawnCommandWithInvocation(argv, {
		buffer: false,
		cancelSignal: cancelController.signal,
		cwd,
		detached: Boolean(killProcessTree && process.platform !== "win32"),
		encoding: "buffer",
		baseEnv,
		env,
		forceKillAfterDelay: resolvedKillGraceMs,
		killSignal,
		...hasInput ? { input } : {},
		reject: false,
		stdio,
		stripFinalNewline: false,
		windowsVerbatimArguments: options.windowsVerbatimArguments
	});
	const nodeChild = child.nodeChildProcess;
	const releaseOutput = releaseChildProcessOutputAfterExit(nodeChild);
	nodeChild.once("exit", (code, signalValue) => {
		childExited = true;
		childExitState = {
			code,
			signal: signalValue
		};
	});
	const terminationController = createCommandTerminationController({
		child: nodeChild,
		cancelController,
		baseEnv,
		env,
		processTree: killProcessTree ? { mode: "graceful" } : void 0,
		isChildExited: () => childExited,
		isCommandSettled: () => commandSettled,
		killGraceMs: resolvedKillGraceMs
	});
	const clearNoOutputTimer = () => {
		if (noOutputTimer) {
			clearTimeout(noOutputTimer);
			noOutputTimer = void 0;
		}
	};
	const ownsExitedProcessTree = Boolean(killProcessTree && process.platform !== "win32");
	const cancel = (reason) => {
		if (termination || commandSettled || childExited && reason !== "output-limit" && !ownsExitedProcessTree) return;
		termination = reason;
		if (!terminationController.terminate()) cancelController.abort();
	};
	const resolvedNoOutputTimeoutMs = typeof noOutputTimeoutMs === "number" && Number.isFinite(noOutputTimeoutMs) && noOutputTimeoutMs > 0 ? resolveTimerTimeoutMs(noOutputTimeoutMs, 1) : void 0;
	const armNoOutputTimer = () => {
		if (resolvedNoOutputTimeoutMs === void 0 || commandSettled || termination || childExited && !ownsExitedProcessTree) return;
		clearNoOutputTimer();
		noOutputTimer = setTimeout(() => cancel("no-output-timeout"), resolvedNoOutputTimeoutMs);
	};
	const timeoutTimer = resolvedTimeoutMs === void 0 ? void 0 : setTimeout(() => cancel("timeout"), resolvedTimeoutMs);
	const onAbort = () => cancel("signal");
	signal?.addEventListener("abort", onAbort, { once: true });
	armNoOutputTimer();
	const captureOutput = (capture, chunk, maxBytes, stream, captureMode) => {
		const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
		outputBytesByStream[stream] += buffer.byteLength;
		const streamLimitExceeded = outputBytesByStream[stream] > maxBytes;
		if (maxCombinedOutputBytes === void 0) {
			appendCapturedOutput(capture, buffer, maxBytes, captureMode);
			if (streamLimitExceeded && shouldTerminateOnOutputLimit(options.terminateOnOutputLimit, stream)) cancel("output-limit");
			return;
		}
		const combinedBytesBeforeChunk = combinedOutputBytes;
		combinedOutputBytes += buffer.byteLength;
		const combinedLimitExceeded = combinedOutputBytes > maxCombinedOutputBytes;
		if (usesCombinedTailCapture) {
			combinedTailChunks.push({
				stream,
				buffer
			});
			combinedCapturedBytes += buffer.byteLength;
			combinedCapturedBytesByStream[stream] += buffer.byteLength;
			const removeCapturedBytes = (index, requestedBytes) => {
				const entry = expectDefined(combinedTailChunks[index], "combined tail chunk");
				const removedBytes = Math.min(requestedBytes, entry.buffer.byteLength);
				if (removedBytes === entry.buffer.byteLength) combinedTailChunks.splice(index, 1);
				else entry.buffer = Buffer.from(entry.buffer.subarray(removedBytes));
				combinedCapturedBytes -= removedBytes;
				combinedCapturedBytesByStream[entry.stream] -= removedBytes;
				(entry.stream === "stdout" ? stdoutCapture : stderrCapture).truncatedBytes += removedBytes;
			};
			while (combinedCapturedBytesByStream[stream] > maxBytes) {
				const index = combinedTailChunks.findIndex((entry) => entry.stream === stream);
				if (index < 0) break;
				removeCapturedBytes(index, combinedCapturedBytesByStream[stream] - maxBytes);
			}
			let combinedOverflow = combinedCapturedBytes - maxCombinedOutputBytes;
			while (combinedOverflow > 0) {
				removeCapturedBytes(0, combinedOverflow);
				combinedOverflow = combinedCapturedBytes - maxCombinedOutputBytes;
			}
		} else {
			const remaining = Math.max(0, maxCombinedOutputBytes - combinedBytesBeforeChunk);
			if (remaining > 0) appendCapturedOutput(capture, buffer.subarray(0, remaining), maxBytes, captureMode);
			capture.truncatedBytes += Math.max(0, buffer.byteLength - remaining);
		}
		if (combinedLimitExceeded && shouldTerminateOnOutputLimit(options.terminateOnOutputLimit, "combined") || streamLimitExceeded && shouldTerminateOnOutputLimit(options.terminateOnOutputLimit, stream)) cancel("output-limit");
	};
	const observeOutputChunk = (chunk, stream) => {
		const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
		if (termination || !options.onOutputChunk) return buffer;
		try {
			if (options.onOutputChunk(buffer, stream) === false) cancel("output-limit");
		} catch (error) {
			outputObserverError = error;
			cancel("output-limit");
		}
		return buffer;
	};
	const onOutputError = (error, stream) => {
		outputErrorStream ??= stream;
		if (termination || options.tolerateOutputError?.[stream] === true || !shouldTerminateOnOutputError(options.terminateOnOutputError, stream)) return;
		terminatingOutputError = toErrorObject(error, `Command ${stream} stream failed`);
		Object.assign(terminatingOutputError, { outputErrorStream: stream });
		cancel("signal");
	};
	child.stdout?.once("error", (error) => onOutputError(error, "stdout"));
	child.stderr?.once("error", (error) => onOutputError(error, "stderr"));
	child.stdout?.on("data", (chunk) => {
		const buffer = observeOutputChunk(chunk, "stdout");
		appendPreservedOutputLines({
			capture: stdoutCapture,
			chunk: buffer,
			stream: "stdout",
			preserveOutputLine: options.preserveOutputLine,
			maxPreservedOutputLines,
			maxPendingLineBytes: maxPreservedPendingLineBytes
		});
		captureOutput(stdoutCapture, buffer, maxStdoutBytes, "stdout", stdoutCaptureMode);
		armNoOutputTimer();
	});
	child.stderr?.on("data", (chunk) => {
		const buffer = observeOutputChunk(chunk, "stderr");
		appendPreservedOutputLines({
			capture: stderrCapture,
			chunk: buffer,
			stream: "stderr",
			preserveOutputLine: options.preserveOutputLine,
			maxPreservedOutputLines,
			maxPendingLineBytes: maxPreservedPendingLineBytes
		});
		captureOutput(stderrCapture, buffer, maxStderrBytes, "stderr", stderrCaptureMode);
		armNoOutputTimer();
	});
	const result = await child.finally(() => {
		commandSettled = true;
		if (timeoutTimer) clearTimeout(timeoutTimer);
		clearNoOutputTimer();
		signal?.removeEventListener("abort", onAbort);
		releaseOutput();
	});
	await terminationController.settle();
	if (terminatingOutputError) throw terminatingOutputError;
	if (outputObserverError !== void 0) throw toErrorObject(outputObserverError, "Command output observer failed");
	const isCauseLessWindowsShimResult = !termination && invocation.usesWindowsExitCodeShim && typeof nodeChild.pid === "number" && result.code === void 0 && result.cause === void 0 && !result.timedOut && !result.isCanceled && !result.isMaxBuffer && !result.isTerminated;
	if (isCauseLessWindowsShimResult) for (let elapsedMs = 0; elapsedMs < WINDOWS_CLOSE_STATE_SETTLE_TIMEOUT_MS; elapsedMs += WINDOWS_CLOSE_STATE_POLL_MS) {
		if (childExitState?.code != null || childExitState?.signal != null || nodeChild.exitCode != null || nodeChild.signalCode != null) break;
		await new Promise((resolve) => {
			setTimeout(resolve, WINDOWS_CLOSE_STATE_POLL_MS);
		});
	}
	if (result.failed && !termination && !isPlainCommandExitFailure(result) && !isPlainCommandSignalFailure(result) && !isCauseLessWindowsShimResult && !(result.exitCode === 0 && outputErrorStream !== void 0 && options.tolerateOutputError?.[outputErrorStream] === true)) {
		const error = createSanitizedCommandError(result);
		if (outputErrorStream) Object.assign(error, { outputErrorStream });
		throw error;
	}
	const resolvedSignal = result.signal ?? childExitState?.signal ?? nodeChild.signalCode ?? null;
	const resolvedCode = resolveProcessExitCode({
		explicitCode: result.exitCode ?? childExitState?.code,
		childExitCode: nodeChild.exitCode,
		resolvedSignal,
		usesWindowsExitCodeShim: invocation.usesWindowsExitCodeShim,
		timedOut: termination === "timeout",
		noOutputTimedOut: termination === "no-output-timeout",
		killIssuedByTimeout: termination === "timeout" || termination === "no-output-timeout",
		killIssuedByAbort: termination === "signal" || termination === "output-limit"
	});
	termination ??= resolvedSignal != null || result.isTerminated ? "signal" : "exit";
	const normalizedCode = termination === "timeout" || termination === "no-output-timeout" ? resolvedCode == null || resolvedCode === 0 ? 124 : resolvedCode : resolvedCode;
	flushPreservedOutputLine({
		capture: stdoutCapture,
		stream: "stdout",
		preserveOutputLine: options.preserveOutputLine,
		maxPreservedOutputLines,
		maxPendingLineBytes: maxPreservedPendingLineBytes
	});
	flushPreservedOutputLine({
		capture: stderrCapture,
		stream: "stderr",
		preserveOutputLine: options.preserveOutputLine,
		maxPreservedOutputLines,
		maxPendingLineBytes: maxPreservedPendingLineBytes
	});
	if (usesCombinedTailCapture) for (const entry of combinedTailChunks) {
		const capture = entry.stream === "stdout" ? stdoutCapture : stderrCapture;
		capture.chunks.push(entry.buffer);
		capture.bytes += entry.buffer.byteLength;
	}
	const decodeCapturedOutput = (capture, captureMode) => {
		const buffer = finalizeCapturedOutput(capture, captureMode, forceUtf8);
		return forceUtf8 ? buffer.toString("utf8") : decodeWindowsOutputBuffer({
			buffer,
			windowsEncoding
		});
	};
	return {
		pid: nodeChild.pid,
		stdout: decodeCapturedOutput(stdoutCapture, stdoutCaptureMode),
		stderr: decodeCapturedOutput(stderrCapture, stderrCaptureMode),
		stdoutTruncatedBytes: stdoutCapture.truncatedBytes || void 0,
		stderrTruncatedBytes: stderrCapture.truncatedBytes || void 0,
		preservedStdoutLines: stdoutCapture.preservedLines.length > 0 ? stdoutCapture.preservedLines : void 0,
		preservedStderrLines: stderrCapture.preservedLines.length > 0 ? stderrCapture.preservedLines : void 0,
		code: normalizedCode,
		signal: resolvedSignal,
		killed: nodeChild.killed,
		termination: termination === "output-limit" ? "signal" : termination,
		noOutputTimedOut: termination === "no-output-timeout",
		outputLimitExceeded: termination === "output-limit" || void 0,
		...outputErrorStream ? { outputErrorStream } : {}
	};
}
//#endregion
//#region src/process/exec.ts
const DEFAULT_EXEC_MAX_BUFFER_BYTES = 1024 * 1024;
async function runExec(command, args, opts = 1e4) {
	const timeout = typeof opts === "number" ? resolveTimerTimeoutMs(opts, 1) : typeof opts.timeoutMs === "number" ? resolveTimerTimeoutMs(opts.timeoutMs, 1) : void 0;
	const maxBuffer = typeof opts === "number" ? DEFAULT_EXEC_MAX_BUFFER_BYTES : opts.maxBuffer ?? DEFAULT_EXEC_MAX_BUFFER_BYTES;
	const resolvedOptions = typeof opts === "number" ? void 0 : opts;
	if (resolvedOptions?.input !== void 0 && resolvedOptions.stdinFileDescriptor !== void 0) throw new Error("runExec accepts either input or stdinFileDescriptor, not both");
	try {
		const subprocess = spawnCommand([command, ...args], {
			baseEnv: resolvedOptions?.baseEnv,
			cancelSignal: resolvedOptions?.signal,
			cwd: resolvedOptions?.cwd,
			encoding: "buffer",
			env: resolvedOptions?.env,
			forceKillAfterDelay: 300,
			...resolvedOptions?.input !== void 0 ? { input: resolvedOptions.input } : {},
			maxBuffer,
			reject: true,
			...resolvedOptions?.stdinFileDescriptor === void 0 ? { stdin: resolvedOptions?.input === void 0 ? "ignore" : void 0 } : { stdin: resolvedOptions.stdinFileDescriptor },
			stripFinalNewline: false,
			timeout
		});
		const releaseOutput = releaseChildProcessOutputAfterExit(subprocess.nodeChildProcess);
		const { stdout, stderr } = await subprocess.finally(releaseOutput);
		const windowsEncoding = resolveWindowsConsoleEncoding();
		const decodedStdout = decodeWindowsOutputBuffer({
			buffer: Buffer.from(stdout),
			windowsEncoding
		});
		const decodedStderr = decodeWindowsOutputBuffer({
			buffer: Buffer.from(stderr),
			windowsEncoding
		});
		if (resolvedOptions?.logOutput !== false && shouldLogVerbose()) {
			if (decodedStdout.trim()) logDebug(decodedStdout.trim());
			if (decodedStderr.trim()) logError(decodedStderr.trim());
		}
		return {
			stdout: decodedStdout,
			stderr: decodedStderr
		};
	} catch (err) {
		const windowsEncoding = resolveWindowsConsoleEncoding();
		if (err && typeof err === "object") {
			const errorWithOutput = err;
			if (errorWithOutput.code === void 0 && typeof errorWithOutput.exitCode === "number") errorWithOutput.code = errorWithOutput.exitCode;
			if (errorWithOutput.stdout instanceof Uint8Array) errorWithOutput.stdout = decodeWindowsOutputBuffer({
				buffer: Buffer.from(errorWithOutput.stdout),
				windowsEncoding
			});
			if (errorWithOutput.stderr instanceof Uint8Array) errorWithOutput.stderr = decodeWindowsOutputBuffer({
				buffer: Buffer.from(errorWithOutput.stderr),
				windowsEncoding
			});
		}
		if (resolvedOptions?.logOutput !== false && shouldLogVerbose()) logError(danger(`Command failed: ${command}`));
		throw err;
	}
}
/** Run a one-shot command with raw, independently capped stdout and stderr buffers. */
async function runCommandBuffered(argv, options = {}) {
	if (options.signal?.aborted) return {
		stdout: Buffer.alloc(0),
		stderr: Buffer.alloc(0),
		code: null,
		signal: null,
		killed: false,
		termination: "signal",
		...options.signal.reason instanceof Error ? { error: options.signal.reason } : {}
	};
	const chunks = {
		stdout: [],
		stderr: []
	};
	const capturedBytes = {
		stdout: 0,
		stderr: 0
	};
	const maxCombinedOutputBytes = typeof options.maxCombinedOutputBytes === "number" && Number.isFinite(options.maxCombinedOutputBytes) && options.maxCombinedOutputBytes > 0 ? Math.max(1, Math.floor(options.maxCombinedOutputBytes)) : void 0;
	let outputLimitStream;
	const appendChunk = (chunk, stream) => {
		if (options.discardOutput?.[stream]) return true;
		const maxBytes = resolveMaxOutputBytes(options.maxOutputBytes, stream);
		const combinedBytes = capturedBytes.stdout + capturedBytes.stderr;
		const combinedRemaining = maxCombinedOutputBytes === void 0 ? Number.POSITIVE_INFINITY : Math.max(0, maxCombinedOutputBytes - combinedBytes);
		const remaining = Math.max(0, Math.min(maxBytes - capturedBytes[stream], combinedRemaining));
		if (remaining > 0) {
			const captured = Buffer.from(chunk.subarray(0, remaining));
			chunks[stream].push(captured);
			capturedBytes[stream] += captured.byteLength;
		}
		if (chunk.byteLength > remaining) {
			outputLimitStream ??= stream;
			return false;
		}
		return true;
	};
	const capturedOutput = (stream) => Buffer.concat(chunks[stream], capturedBytes[stream]);
	try {
		const result = await runCommandWithTimeout(argv, {
			baseEnv: options.baseEnv,
			cwd: options.cwd,
			env: options.env,
			input: options.input,
			killProcessTree: options.killProcessTree ?? true,
			killGraceMs: options.killGraceMs,
			onOutputChunk: appendChunk,
			outputCapture: "discard",
			signal: options.signal,
			timeoutMs: options.timeoutMs,
			tolerateOutputError: {
				stdout: options.discardOutput?.stdout || options.tolerateOutputError?.stdout,
				stderr: options.discardOutput?.stderr || options.tolerateOutputError?.stderr
			},
			terminateOnOutputError: options.terminateOnOutputError
		});
		const termination = result.outputLimitExceeded ? "output-limit" : result.termination === "no-output-timeout" ? "timeout" : result.termination;
		return {
			stdout: capturedOutput("stdout"),
			stderr: capturedOutput("stderr"),
			code: termination === "exit" ? result.code : null,
			signal: result.signal,
			killed: result.killed,
			termination,
			...outputLimitStream ? { outputLimitStream } : {},
			...result.outputErrorStream ? { errorStream: result.outputErrorStream } : {}
		};
	} catch (error) {
		const commandError = error instanceof Error ? error : /* @__PURE__ */ new Error("Command execution failed");
		const metadata = commandError;
		const errorStream = metadata.outputErrorStream === "stdout" || metadata.outputErrorStream === "stderr" ? metadata.outputErrorStream : void 0;
		return {
			stdout: capturedOutput("stdout"),
			stderr: capturedOutput("stderr"),
			code: typeof metadata.exitCode === "number" ? metadata.exitCode : null,
			signal: null,
			killed: false,
			termination: "error",
			...errorStream ? { errorStream } : {},
			error: commandError
		};
	}
}
//#endregion
export { createCommandTerminationController as a, spawnCommand as c, resolveProcessExitCode as d, appendCapturedOutput as f, releaseChildProcessOutputAfterExit as h, runUtf8CommandWithTimeout as i, createSanitizedCommandError as l, finalizeCapturedOutput as m, runExec as n, resolveCommandEnv as o, createCapturedOutputBuffers as p, runCommandWithTimeout as r, shouldSpawnWithShell as s, runCommandBuffered as t, isPlainCommandExitFailure as u };
