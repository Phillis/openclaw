import { t as killProcessTree } from "./kill-tree-B-nnBWyI.js";
import { t as createSubsystemLogger } from "./subsystem-CDLhGl2-.js";
import { r as runCommandWithTimeout } from "./exec-BL80Wdzl.js";
import { n as hasBinary } from "./config-eval-DKSGptfj.js";
import "./config-Dq2GoT57.js";
import { D as resolveGogServeInvocation, E as resolveGogExecutable, T as resolveGmailHookRuntimeConfig, _ as buildGogWatchServeLogArgs, g as buildGogWatchServeArgs, i as ensureTailscaleEndpoint, v as buildGogWatchStartArgs } from "./gmail-setup-utils-BxURm_Om.js";
import process from "node:process";
import { spawn } from "node:child_process";
//#region src/hooks/gmail-watcher-errors.ts
const ADDRESS_IN_USE_RE = /address already in use|EADDRINUSE/i;
/** Detect watcher startup failures caused by an occupied bind port. */
function isAddressInUseError(line) {
	return ADDRESS_IN_USE_RE.test(line);
}
//#endregion
//#region src/hooks/gmail-watcher.ts
/**
* Gmail Watcher Service
*
* Automatically starts `gog gmail watch serve` when the gateway starts,
* if hooks.gmail is configured with an account.
*/
const log = createSubsystemLogger("gmail-watcher");
let watcherProcess = null;
let renewInterval = null;
let renewalInFlight = null;
let renewalAbortController = null;
let shuttingDown = false;
let currentConfig = null;
let respawnTimeout = null;
/**
* Check if gog binary is available
*/
function isGogAvailable() {
	return hasBinary("gog");
}
/**
* Start the Gmail watch (registers with Gmail API)
*/
async function startGmailWatch(cfg, options = {}) {
	const args = [resolveGogExecutable(), ...buildGogWatchStartArgs(cfg)];
	try {
		const result = await runCommandWithTimeout(args, {
			timeoutMs: 12e4,
			signal: options.signal
		});
		if (result.code !== 0) {
			const message = result.stderr || result.stdout || "gog watch start failed";
			log.error(`watch start failed: ${message}`);
			return false;
		}
		log.info(`watch started for ${cfg.account}`);
		return true;
	} catch (err) {
		log.error(`watch start error: ${String(err)}`);
		return false;
	}
}
/**
* Spawn the gog gmail watch serve process
*/
function spawnGogServe(cfg) {
	const args = buildGogWatchServeArgs(cfg);
	log.info(`starting gog ${buildGogWatchServeLogArgs(cfg).join(" ")}`);
	let addressInUse = false;
	let spawnFailed = false;
	let stderrTail = "";
	const invocation = resolveGogServeInvocation(args);
	const child = spawn(invocation.command, invocation.args, {
		stdio: [
			"ignore",
			"pipe",
			"pipe"
		],
		detached: process.platform !== "win32",
		windowsHide: invocation.windowsHide,
		windowsVerbatimArguments: invocation.windowsVerbatimArguments
	});
	child.stdout?.on("error", (err) => {
		log.error(`gog stdout error: ${String(err)}`);
	});
	child.stdout?.on("data", (data) => {
		const line = data.toString().trim();
		if (line) log.info(`[gog] ${line}`);
	});
	child.stderr?.on("error", (err) => {
		log.error(`gog stderr error: ${String(err)}`);
	});
	child.stderr?.on("data", (data) => {
		const chunk = data.toString();
		const combined = stderrTail + chunk;
		if (!addressInUse && isAddressInUseError(combined)) addressInUse = true;
		stderrTail = combined.slice(-512);
		const line = chunk.trim();
		if (!line) return;
		log.warn(`[gog] ${line}`);
	});
	child.on("error", (err) => {
		if (child.pid === void 0) spawnFailed = true;
		log.error(`gog process error: ${String(err)}`);
	});
	child.on("close", (code, signal) => {
		if (watcherProcess !== null && watcherProcess !== child) return;
		if (shuttingDown) return;
		if (spawnFailed) {
			watcherProcess = null;
			return;
		}
		if (addressInUse) {
			log.warn("gog serve failed to bind (address already in use); stopping restarts. Another watcher is likely running. Set OPENCLAW_SKIP_GMAIL_WATCHER=1 or stop the other process.");
			watcherProcess = null;
			return;
		}
		log.warn(`gog exited (code=${code}, signal=${signal}); restarting in 5s`);
		watcherProcess = null;
		respawnTimeout = setTimeout(() => {
			respawnTimeout = null;
			if (shuttingDown || !currentConfig) return;
			watcherProcess = spawnGogServe(currentConfig);
		}, 5e3);
	});
	return child;
}
/**
* Signal the gog process tree to exit gracefully (SIGTERM, SIGKILL after 3 s)
* and resolve on exit/close/error or a final 8 s safety timeout.
*/
function settleProcess(proc) {
	return new Promise((resolve) => {
		let settled = false;
		let processSettled = false;
		let graceElapsed = false;
		let graceTimer;
		const settle = () => {
			if (settled) return;
			settled = true;
			if (graceTimer) clearTimeout(graceTimer);
			if (finalTimeout) clearTimeout(finalTimeout);
			resolve();
		};
		const settleAfterEscalation = () => {
			processSettled = true;
			if (graceElapsed) settle();
		};
		const finalTimeout = setTimeout(() => {
			if (!settled) {
				log.warn("gog process did not exit after SIGKILL; giving up");
				settle();
			}
		}, 8e3);
		proc.on("exit", settleAfterEscalation);
		proc.on("close", settleAfterEscalation);
		proc.on("error", settleAfterEscalation);
		if (typeof proc.pid === "number") {
			killProcessTree(proc.pid, {
				graceMs: 3e3,
				detached: process.platform !== "win32"
			});
			graceTimer = setTimeout(() => {
				graceElapsed = true;
				if (processSettled) settle();
			}, 3025);
		} else {
			try {
				proc.kill("SIGTERM");
			} catch {}
			graceElapsed = true;
		}
	});
}
async function stopPeriodicRenewal() {
	if (renewInterval) {
		clearInterval(renewInterval);
		renewInterval = null;
	}
	const renewal = renewalInFlight;
	const controller = renewalAbortController;
	if (!renewal) {
		renewalAbortController = null;
		return;
	}
	controller?.abort();
	await renewal;
	if (renewalInFlight === renewal) renewalInFlight = null;
	if (renewalAbortController === controller) renewalAbortController = null;
}
function cancelledGmailWatcherStart(expectedConfig) {
	if (currentConfig === expectedConfig) currentConfig = null;
	return {
		started: false,
		reason: "startup cancelled"
	};
}
function isGmailWatcherStartCancelled(options) {
	return options.signal?.aborted === true || options.isCancelled?.() === true;
}
function createGmailWatcherCancellation(options) {
	if (!options.signal && !options.isCancelled) return {
		dispose: () => {},
		isCancelled: () => false
	};
	const abortController = new AbortController();
	const abort = () => {
		if (!abortController.signal.aborted) abortController.abort();
	};
	const onAbort = () => abort();
	options.signal?.addEventListener("abort", onAbort, { once: true });
	let cancelPoll = null;
	if (options.isCancelled) {
		cancelPoll = setInterval(() => {
			if (options.isCancelled?.()) abort();
		}, 100);
		cancelPoll.unref?.();
	}
	if (isGmailWatcherStartCancelled(options)) abort();
	return {
		dispose: () => {
			if (cancelPoll) {
				clearInterval(cancelPoll);
				cancelPoll = null;
			}
			options.signal?.removeEventListener("abort", onAbort);
		},
		isCancelled: () => abortController.signal.aborted || isGmailWatcherStartCancelled(options),
		signal: abortController.signal
	};
}
/**
* Start the Gmail watcher service.
* Called automatically by the gateway if hooks.gmail is configured.
*/
async function startGmailWatcher(cfg, options = {}) {
	if (!cfg.hooks?.enabled) return {
		started: false,
		reason: "hooks not enabled"
	};
	if (!cfg.hooks?.gmail?.account) return {
		started: false,
		reason: "no gmail account configured"
	};
	if (!isGogAvailable()) return {
		started: false,
		reason: "gog binary not found"
	};
	const resolved = resolveGmailHookRuntimeConfig(cfg, {});
	if (!resolved.ok) return {
		started: false,
		reason: resolved.error
	};
	const runtimeConfig = resolved.value;
	if (isGmailWatcherStartCancelled(options)) return cancelledGmailWatcherStart(runtimeConfig);
	currentConfig = runtimeConfig;
	if (watcherProcess || renewInterval || renewalInFlight || respawnTimeout) {
		shuttingDown = true;
		if (respawnTimeout) {
			clearTimeout(respawnTimeout);
			respawnTimeout = null;
		}
		await stopPeriodicRenewal();
		if (watcherProcess) {
			const oldProcess = watcherProcess;
			watcherProcess = null;
			await settleProcess(oldProcess);
			oldProcess.removeAllListeners();
		}
		shuttingDown = false;
	}
	if (runtimeConfig.tailscale.mode !== "off") {
		const cancellation = createGmailWatcherCancellation(options);
		try {
			await ensureTailscaleEndpoint({
				mode: runtimeConfig.tailscale.mode,
				path: runtimeConfig.tailscale.path,
				port: runtimeConfig.serve.port,
				signal: cancellation.signal,
				target: runtimeConfig.tailscale.target
			});
			log.info(`tailscale ${runtimeConfig.tailscale.mode} configured for port ${runtimeConfig.serve.port}`);
			if (cancellation.isCancelled()) return cancelledGmailWatcherStart(runtimeConfig);
		} catch (err) {
			if (cancellation.isCancelled()) return cancelledGmailWatcherStart(runtimeConfig);
			log.error(`tailscale setup failed: ${String(err)}`);
			return {
				started: false,
				reason: `tailscale setup failed: ${String(err)}`
			};
		} finally {
			cancellation.dispose();
		}
	}
	const cancellation = createGmailWatcherCancellation(options);
	const watchStarted = await startGmailWatch(runtimeConfig, { signal: cancellation.signal });
	cancellation.dispose();
	if (cancellation.isCancelled()) return cancelledGmailWatcherStart(runtimeConfig);
	if (!watchStarted) log.warn("gmail watch start failed, but continuing with serve");
	if (isGmailWatcherStartCancelled(options)) return cancelledGmailWatcherStart(runtimeConfig);
	shuttingDown = false;
	watcherProcess = spawnGogServe(runtimeConfig);
	const renewMs = runtimeConfig.renewEveryMinutes * 6e4;
	renewInterval = setInterval(() => {
		if (shuttingDown || renewalInFlight) return;
		const controller = new AbortController();
		renewalAbortController = controller;
		const renewal = startGmailWatch(runtimeConfig, { signal: controller.signal }).finally(() => {
			if (renewalInFlight === renewal) renewalInFlight = null;
			if (renewalAbortController === controller) renewalAbortController = null;
		});
		renewalInFlight = renewal;
	}, renewMs);
	log.info(`gmail watcher started for ${runtimeConfig.account} (renew every ${runtimeConfig.renewEveryMinutes}m)`);
	return { started: true };
}
/**
* Stop the Gmail watcher service.
*/
async function stopGmailWatcher() {
	shuttingDown = true;
	if (respawnTimeout) {
		clearTimeout(respawnTimeout);
		respawnTimeout = null;
	}
	await stopPeriodicRenewal();
	if (watcherProcess) {
		log.info("stopping gmail watcher");
		const proc = watcherProcess;
		watcherProcess = null;
		await settleProcess(proc);
	}
	currentConfig = null;
	log.info("gmail watcher stopped");
}
//#endregion
export { stopGmailWatcher as n, startGmailWatcher as t };
