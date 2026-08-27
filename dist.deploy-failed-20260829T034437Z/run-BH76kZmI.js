import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.js";
import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { n as isTruthyEnvValue } from "./env-ChWDbSFK.js";
import "./src-BntaCZM-.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { w as parseStrictPositiveInteger } from "./number-coercion-CLj0HTDM.js";
import { v as uniqueStrings } from "./string-normalization-e_fvmxMf.js";
import { a as isPathInside } from "./path-D138yf8v.js";
import "./path-guards-CQoZeoCG.js";
import { l as hasConfiguredSecretInput } from "./types.secrets-Bre8L6Ts.js";
import { i as GATEWAY_SERVICE_RUNTIME_PID_ENV } from "./constants-ChqKLfPp.js";
import { _ as resolveGatewayPort, l as normalizeStateDirEnv, t as CONFIG_PATH } from "./paths-BBSTUjD5.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { t as formatCliCommand } from "./command-format-HwSAdvXB.js";
import { r as defaultRuntime } from "./runtime-LRpY2Icg.js";
import { t as drainGlobalSingletonLifecycleState } from "./global-singleton-Dc_stLtU.js";
import { r as setVerbose } from "./global-state-BCtvHc7P.js";
import { i as flushLogger } from "./logger-ij8OHrrv.js";
import { o as setConsoleSubsystemFilter, s as setConsoleTimestampPrefix } from "./console-SZn871dT.js";
import { t as createSubsystemLogger } from "./subsystem-a4KzJVZG.js";
import { Tt as findOpenClawStateDatabaseSchemaMigrationRequiredError } from "./openclaw-state-db-CeAO_dqo.js";
import { p as ALLOW_OLDER_BINARY_DESTRUCTIVE_ACTIONS_ENV } from "./config-env-vars-C_yEEhJa.js";
import { t as clearRuntimeConfigSnapshot } from "./runtime-snapshot-Cv5MaU8U.js";
import { r as CONFIG_AUDIT_STORE_LABEL } from "./io.audit-BdMamP9p.js";
import { i as isInvalidConfigError, r as isDoctorRecoverableInvalidConfigError } from "./io.invalid-config-B4TKe0Mu.js";
import { n as acquireGatewayLock, t as GatewayLockError } from "./gateway-lock-G9roAjek.js";
import "./globals-GZNLg1ns.js";
import { t as isContainerEnvironment } from "./container-environment-CNsJSTpY.js";
import { h as resolveGatewayBindHost, o as isLoopbackHost, t as defaultGatewayBindMode } from "./net-DeK7gO-9.js";
import { n as isTailscaleRouteOwnershipConflictError } from "./tailscale-route-ownership-error-E8nE1Fea.js";
import { n as formatGatewayPidList, t as findVerifiedGatewayListenerPidsOnPortSync } from "./gateway-processes-DEnCr0sT.js";
import { n as formatInvalidConfigPort, r as formatInvalidPortOption } from "./error-format-HTpcnFye.js";
import { t as parsePort } from "./parse-port-Dw2bUWKg.js";
import { r as normalizeTlsFingerprint } from "./client-address-utils-ycG4vrin.js";
import { r as findOpenClawAgentDatabaseMediaMigrationRequiredError, t as GATEWAY_AGENT_MEDIA_MIGRATION_REQUIRED_REASON } from "./openclaw-agent-db-migration-required-RkIFq1cn.js";
import { r as isTerminalInteractive, t as NON_INTERACTIVE_GATEWAY_RUN_FORCE_MESSAGE } from "./terminal-interactivity-DXUXAq5U.js";
import { i as withDiagnosticPhase } from "./diagnostic-phase-wlaZXgp0.js";
import { a as markGatewayRestartTrace, f as startGatewayRestartTrace, o as measureGatewayRestartTrace, r as createGatewayRestartTraceHandoffEnv, t as captureGatewayRestartTraceHandoff } from "./restart-trace-DGYy4fPv.js";
import { r as withProgress } from "./progress-3-oJv0bD.js";
import { t as printClawBanner } from "./claw-banner-6G1-bTt6.js";
import { n as setGatewayWsLogStyle } from "./ws-logging-86BGsxSJ.js";
import { n as isGatewayRunFutureConfigAllowed, t as enforceGatewayRunFutureConfigGuard } from "./future-config-guard-XmzqA6Tz.js";
import { a as inspectGatewayCrashLoopBreaker, i as formatGatewayCrashLoopManualChannelStartHint, n as GATEWAY_CRASH_LOOP_RECOVERED_REASON, o as recordGatewayBootStart, r as completeGatewayBootLifecycle, s as recordGatewayCrashLoopRecovery, t as GATEWAY_CRASH_LOOP_BREAKER_REASON } from "./gateway-boot-lifecycle-BLkLmkEZ.js";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { randomUUID } from "node:crypto";
import net from "node:net";
import { Worker } from "node:worker_threads";
import { TLSSocket } from "node:tls";
import { request } from "node:http";
import { request as request$1 } from "node:https";
//#region src/cli/gateway-cli/qa-parent-watchdog.ts
const QA_PARENT_PID_ENV = "OPENCLAW_QA_PARENT_PID";
const QA_TEMP_ROOT_ENV = "OPENCLAW_QA_TEMP_ROOT";
const QA_STAGED_RUNTIME_ROOT_ENV = "OPENCLAW_QA_STAGED_RUNTIME_ROOT";
const DEFAULT_QA_PARENT_WATCHDOG_INTERVAL_MS = 1e3;
const QA_TEMP_ROOT_PREFIX = "openclaw-qa-suite-";
function resolveQaParentPid(env, ownPid) {
	const raw = env[QA_PARENT_PID_ENV]?.trim();
	if (!raw) return null;
	const parentPid = /^\d+$/.test(raw) ? Number(raw) : NaN;
	if (!Number.isSafeInteger(parentPid) || parentPid <= 0 || parentPid === ownPid) return null;
	return parentPid;
}
function resolveQaCleanupRoot(rawValue) {
	const raw = rawValue?.trim();
	if (!raw) return null;
	const cleanupRoot = path.resolve(raw);
	if (!path.basename(cleanupRoot).startsWith(QA_TEMP_ROOT_PREFIX)) return null;
	return cleanupRoot;
}
function resolveQaCleanupRoots(env) {
	return uniqueStrings([resolveQaCleanupRoot(env[QA_TEMP_ROOT_ENV]), resolveQaCleanupRoot(env[QA_STAGED_RUNTIME_ROOT_ENV])].filter((target) => target !== null));
}
function installQaParentWatchdog(deps = {}) {
	const env = deps.env ?? process.env;
	const parentPid = resolveQaParentPid(env, deps.ownPid ?? process.pid);
	if (parentPid === null) return null;
	const clearIntervalFn = deps.clearInterval ?? ((activeTimer) => {
		clearInterval(activeTimer);
	});
	const exit = deps.exit ?? ((code) => process.exit(code));
	const kill = deps.kill ?? ((pid, signal) => process.kill(pid, signal));
	const logger = deps.logger ?? createSubsystemLogger("gateway");
	const qaCleanupRoots = resolveQaCleanupRoots(env);
	const chdir = deps.chdir ?? ((directory) => process.chdir(directory));
	const cwd = deps.cwd ?? (() => process.cwd());
	const rm = deps.rm ?? (async (target) => {
		await fs$1.rm(target, {
			recursive: true,
			force: true
		});
	});
	const setIntervalFn = deps.setInterval ?? ((callback, ms) => setInterval(callback, ms));
	let stopped = false;
	let exiting = false;
	const stop = () => {
		if (stopped) return;
		stopped = true;
		clearIntervalFn(timer);
	};
	const timer = setIntervalFn(() => {
		if (stopped || exiting) return;
		try {
			kill(parentPid, 0);
		} catch (error) {
			if (error.code === "ESRCH") {
				logger.warn(`QA gateway parent pid ${parentPid} exited; shutting down orphaned QA gateway`);
				exiting = true;
				stop();
				(async () => {
					const currentCwd = path.resolve(cwd());
					const activeCwdRoot = qaCleanupRoots.find((cleanupRoot) => isPathInside(cleanupRoot, currentCwd));
					if (activeCwdRoot) {
						const safeCwd = path.dirname(activeCwdRoot);
						try {
							chdir(safeCwd);
						} catch (chdirError) {
							logger.warn(`QA gateway parent pid ${parentPid} exited; failed to leave runtime root ${activeCwdRoot}: ${chdirError instanceof Error ? chdirError.message : String(chdirError)}`);
						}
					}
					for (const cleanupRoot of qaCleanupRoots) await rm(cleanupRoot).catch((cleanupError) => {
						logger.warn(`QA gateway parent pid ${parentPid} exited; failed to clean runtime root ${cleanupRoot}: ${cleanupError instanceof Error ? cleanupError.message : String(cleanupError)}`);
					});
					exit(0);
				})();
			}
		}
	}, deps.intervalMs ?? DEFAULT_QA_PARENT_WATCHDOG_INTERVAL_MS);
	if (typeof timer === "object") timer.unref?.();
	return {
		parentPid,
		stop
	};
}
//#endregion
//#region src/cli/gateway-cli/shutdown-hard-exit.ts
function armShutdownHardExitWatchdog(params) {
	const reportError = (error) => {
		try {
			params.onError(error);
		} catch {}
	};
	let worker;
	try {
		worker = new Worker(`const { parentPort, workerData } = require("node:worker_threads");
       const timer = setTimeout(() => process.kill(process.pid, "SIGKILL"), workerData.delayMs);
       parentPort.once("message", () => {
         clearTimeout(timer);
         parentPort.close();
       });`, {
			eval: true,
			execArgv: [],
			workerData: { delayMs: Math.max(0, Math.floor(params.delayMs)) }
		});
	} catch (error) {
		reportError(error);
		return null;
	}
	let active = true;
	worker.once("error", (error) => {
		if (active) {
			active = false;
			reportError(error);
		}
	});
	return { cancel: () => {
		active = false;
		try {
			worker.postMessage("cancel", []);
		} catch (error) {
			reportError(error);
		}
	} };
}
//#endregion
//#region src/cli/gateway-cli/run-loop.ts
const gatewayLog$1 = createSubsystemLogger("gateway");
const LAUNCHD_SUPERVISED_RESTART_EXIT_DELAY_MS = 1500;
const DEFAULT_RESTART_DRAIN_TIMEOUT_MS = 3e5;
const RESTART_DRAIN_STILL_PENDING_WARN_MS = 3e4;
const RESTART_CLOSE_REPLY_DRAIN_SHUTDOWN_RESERVE_MS = 1e4;
const UPDATE_RESPAWN_HEALTH_TIMEOUT_MS = 1e4;
const UPDATE_RESPAWN_HEALTH_POLL_MS = 200;
const LOG_FLUSH_EXIT_TIMEOUT_MS = 4e3;
const HARD_EXIT_WATCHDOG_GRACE_MS = 2e3;
function isUpdateProcessRestartReason(reason) {
	return reason === "update.run" || reason === "update.auto";
}
const gatewayLifecycleRuntimeLoader = createLazyImportLoader(() => import("./cli/gateway-lifecycle.runtime.js"));
const loadGatewayLifecycleRuntimeModule = () => gatewayLifecycleRuntimeLoader.load();
async function waitForGatewayPortReady(host, port) {
	return await new Promise((resolve) => {
		const socket = net.createConnection({
			host,
			port
		});
		const finish = (value) => {
			socket.destroy();
			resolve(value);
		};
		socket.setTimeout(UPDATE_RESPAWN_HEALTH_POLL_MS, () => finish(false));
		socket.once("connect", () => finish(true));
		socket.once("error", () => finish(false));
	});
}
async function waitForHealthyGatewayChild(port, _pid, host = "127.0.0.1", timeoutMs = UPDATE_RESPAWN_HEALTH_TIMEOUT_MS) {
	const deadline = Date.now() + timeoutMs;
	while (Date.now() < deadline) {
		if (await waitForGatewayPortReady(host, port)) return true;
		await new Promise((resolve) => {
			setTimeout(resolve, UPDATE_RESPAWN_HEALTH_POLL_MS);
		});
	}
	return false;
}
async function runGatewayLoop(params) {
	if (process.title === "openclaw") process.title = "openclaw-gateway";
	let startupStartedAt;
	const eagerLifecycleRuntime = await loadGatewayLifecycleRuntimeModule();
	const supervisorMode = eagerLifecycleRuntime.detectGatewayRespawnSupervisor(process.env, process.platform, { includeLinuxOpenClawGatewayServiceMarker: true });
	let lock = await acquireGatewayLock({ port: params.lockPort });
	let server = null;
	let shuttingDown = false;
	let restartResolver = null;
	let pendingStartupRequest = null;
	let activeRestartRequest = null;
	let committedGenericSuccessor = null;
	let forceActiveRestartExit = null;
	let pendingStartupForceExitTimer = null;
	let restartDrainingMarked = false;
	let startupFailedWithoutServerHandle = false;
	const processInstanceId = randomUUID();
	const waitForHealthyChild = params.waitForHealthyChild ?? waitForHealthyGatewayChild;
	const getManagedUpdateOwner = () => (pendingStartupRequest ?? activeRestartRequest)?.restartIntent?.successorOwner;
	const sameManagedUpdateOwner = (left, right) => Boolean(left && right && left.handoffId === right.handoffId && left.installRoot === right.installRoot);
	const cleanupSignals = () => {
		process.removeListener("SIGTERM", onSigterm);
		process.removeListener("SIGINT", onSigint);
		process.removeListener("SIGUSR1", onSigusr1);
	};
	const exitProcess = (code) => {
		cleanupSignals();
		params.runtime.exit(code);
	};
	const exitProcessAfterLogFlush = async (code, initialOwner, initialOutcome = "update") => {
		let ownerToCommit = initialOwner;
		let commitOutcome = initialOutcome;
		let flushTimer;
		const flushed = await Promise.race([flushLogger().then(() => true), new Promise((resolve) => {
			flushTimer = setTimeout(() => resolve(false), LOG_FLUSH_EXIT_TIMEOUT_MS);
		})]);
		clearTimeout(flushTimer);
		if (!flushed) gatewayLog$1.warn(`log flush did not settle within ${LOG_FLUSH_EXIT_TIMEOUT_MS}ms; continuing shutdown`);
		for (;;) {
			const owner = getManagedUpdateOwner();
			if (!owner) {
				if (!ownerToCommit) exitProcess(code);
				return;
			}
			if (sameManagedUpdateOwner(owner, ownerToCommit) && eagerLifecycleRuntime.claimManagedServiceUpdateHandoff(owner) && await eagerLifecycleRuntime.commitManagedServiceUpdateHandoff(owner, commitOutcome) && sameManagedUpdateOwner(getManagedUpdateOwner(), owner) && eagerLifecycleRuntime.claimManagedServiceUpdateHandoff(owner)) {
				exitProcess(code);
				return;
			}
			await markRestartHandoffUnavailable();
			const ownerToCancel = ownerToCommit ?? owner;
			const restoration = await cancelManagedUpdateHandoffBeforeRecovery(ownerToCancel);
			if (!restoration) {
				const child = committedGenericSuccessor === true ? null : committedGenericSuccessor;
				if (child && child.exitCode === null && child.signalCode === null) {
					const exited = new Promise((resolve) => {
						child.once("exit", () => {
							resolve();
						});
					});
					try {
						child.kill("SIGKILL");
						await exited;
					} catch {}
				}
				return;
			}
			if (restoration === "restart-after-exit") {
				ownerToCommit = ownerToCancel;
				commitOutcome = "restore";
				const currentRequest = pendingStartupRequest ?? activeRestartRequest;
				if (currentRequest && !sameManagedUpdateOwner(currentRequest.restartIntent?.successorOwner, ownerToCancel)) currentRequest.restartIntent = {
					...currentRequest.restartIntent,
					successorOwner: ownerToCancel
				};
				continue;
			}
			if (!committedGenericSuccessor && initialOwner) return reacquireAndResumeInProcessRestart(getManagedUpdateOwner() ?? owner);
			exitProcess(code);
			return;
		}
	};
	const writeStabilityBundle = (reason, error) => {
		const result = eagerLifecycleRuntime.writeDiagnosticStabilityBundleForFailureSync(reason, error);
		if ("message" in result) gatewayLog$1.warn(result.message);
	};
	const releaseLockIfHeld = async () => {
		await lock?.release();
		lock = null;
	};
	const cancelManagedUpdateHandoffBeforeRecovery = async (initialOwner = getManagedUpdateOwner()) => {
		let owner = initialOwner;
		let requiresParentExit = false;
		try {
			for (;;) {
				if (!owner) return requiresParentExit ? "restart-after-exit" : "restored-in-process";
				const restoration = await eagerLifecycleRuntime.cancelManagedServiceUpdateHandoff(owner);
				if (!restoration) {
					gatewayLog$1.error("managed update handoff cancellation unconfirmed; remaining draining");
					return false;
				}
				requiresParentExit ||= restoration === "restart-after-exit";
				const replacement = getManagedUpdateOwner();
				if (!replacement || sameManagedUpdateOwner(owner, replacement)) return requiresParentExit ? "restart-after-exit" : "restored-in-process";
				owner = replacement;
			}
		} catch (err) {
			gatewayLog$1.error(`managed update handoff cancellation failed: ${formatErrorMessage(err)}`);
			return false;
		}
	};
	const forceExitAfterStabilityBundle = async (reason) => {
		try {
			writeStabilityBundle(reason);
		} finally {
			const owner = getManagedUpdateOwner();
			if (owner) forceActiveRestartExit?.();
			const restoration = await cancelManagedUpdateHandoffBeforeRecovery(owner);
			if (restoration) {
				params.completeBoot?.({
					outcome: "forced_stop",
					reason
				});
				if (restoration === "restart-after-exit") await exitProcessAfterLogFlush(1, owner, "restore");
				else exitProcess(1);
			}
		}
	};
	const reacquireAndResumeInProcessRestart = async (alreadyCancelledOwner) => {
		for (;;) {
			const restartRequest = activeRestartRequest;
			const restartOwner = restartRequest?.restartIntent?.successorOwner;
			const restoration = sameManagedUpdateOwner(restartOwner, alreadyCancelledOwner) ? "restored-in-process" : await cancelManagedUpdateHandoffBeforeRecovery(restartOwner);
			if (!restoration) return;
			if (restoration === "restart-after-exit") {
				await releaseLockIfHeld();
				return exitProcessAfterLogFlush(0, restartOwner, "restore");
			}
			if (activeRestartRequest !== restartRequest) continue;
			try {
				lock = await acquireGatewayLock({ port: params.lockPort });
			} catch (err) {
				if (activeRestartRequest !== restartRequest) continue;
				gatewayLog$1.error(`failed to reacquire gateway lock for in-process restart: ${String(err)}`);
				exitProcess(1);
				return;
			}
			if (activeRestartRequest === restartRequest) {
				activeRestartRequest = null;
				shuttingDown = false;
				restartResolver?.();
				return;
			}
			await releaseLockIfHeld();
		}
	};
	const markRestartHandoffUnavailable = async (reason = "restart-handoff-unavailable") => {
		await eagerLifecycleRuntime.markUpdateRestartSentinelFailure(reason).catch((err) => {
			gatewayLog$1.warn(`failed to mark update restart ${reason}: ${String(err)}`);
		});
	};
	const handleRestartAfterServerClose = async (expectedOwner, cancelled = false) => {
		await releaseLockIfHeld();
		const restartReason = activeRestartRequest?.restartReason;
		params.completeBoot?.({
			outcome: "planned_restart",
			reason: restartReason ?? "gateway.restart"
		});
		const isUpdateRestart = isUpdateProcessRestartReason(restartReason);
		if (cancelled) return reacquireAndResumeInProcessRestart(expectedOwner);
		if (activeRestartRequest?.restartIntent?.successorOwner) {
			if (!expectedOwner) {
				gatewayLog$1.error("managed update handoff arrived after successor parking closed");
				await markRestartHandoffUnavailable();
				return reacquireAndResumeInProcessRestart();
			}
			gatewayLog$1.info("restart mode: managed update handoff owns successor");
			return exitProcessAfterLogFlush(0, expectedOwner);
		}
		const respawnOptions = { env: createGatewayRestartTraceHandoffEnv(captureGatewayRestartTraceHandoff()) };
		const isStandaloneUpdate = isUpdateRestart && !supervisorMode;
		const respawn = isStandaloneUpdate ? eagerLifecycleRuntime.respawnGatewayProcessForUpdate(respawnOptions) : eagerLifecycleRuntime.restartGatewayProcessWithFreshPid(respawnOptions);
		if (respawn.mode === "spawned") {
			const port = params.lockPort;
			if (typeof port === "number" ? await waitForHealthyChild(port, respawn.pid, params.healthHost ?? "127.0.0.1") : false) {
				committedGenericSuccessor = respawn.child ?? true;
				gatewayLog$1.info(`restart mode: update process respawn (spawned pid ${respawn.pid ?? "unknown"})`);
				return exitProcessAfterLogFlush(0);
			}
			gatewayLog$1.warn(`update respawn child did not become healthy (${respawn.pid ?? "unknown"}); falling back to in-process restart`);
			try {
				respawn.child?.kill();
			} catch {}
			await markRestartHandoffUnavailable("restart-unhealthy");
			return reacquireAndResumeInProcessRestart();
		}
		if (respawn.mode === "supervised") {
			const restartKind = isUpdateRestart ? "update-process" : "full-process";
			markGatewayRestartTrace("restart.full-process-handoff", [
				["kind", restartKind],
				["mode", respawn.mode],
				["pid", "none"],
				["supervisorMode", supervisorMode ?? "none"]
			]);
			const handoff = eagerLifecycleRuntime.writeGatewayRestartHandoffSync({
				restartKind,
				reason: restartReason,
				processInstanceId,
				supervisorMode: supervisorMode ?? "external",
				restartTrace: captureGatewayRestartTraceHandoff()
			});
			if (supervisorMode === "external" && !handoff) {
				gatewayLog$1.warn("external supervisor restart handoff could not be persisted; falling back to in-process restart");
				if (isUpdateRestart) await markRestartHandoffUnavailable();
				return reacquireAndResumeInProcessRestart();
			}
			gatewayLog$1.info("restart mode: full process restart (supervisor restart)");
			if (supervisorMode === "launchd") {
				const delay = new Promise((resolve) => {
					setTimeout(resolve, LAUNCHD_SUPERVISED_RESTART_EXIT_DELAY_MS);
				});
				const spawned = respawn.handoffSpawned ? await Promise.race([respawn.handoffSpawned, delay.then(() => true)]) : false;
				await delay;
				if (!spawned) {
					writeStabilityBundle("gateway.restart_handoff_spawn_failed");
					gatewayLog$1.warn("launchd restart handoff failed to spawn; falling back to in-process restart");
					if (isUpdateRestart) await markRestartHandoffUnavailable();
					return reacquireAndResumeInProcessRestart();
				}
			}
			committedGenericSuccessor = true;
			return exitProcessAfterLogFlush(0);
		}
		if (respawn.mode === "failed") {
			if (!isStandaloneUpdate) writeStabilityBundle("gateway.restart_respawn_failed");
			gatewayLog$1.warn(`${isStandaloneUpdate ? "update respawn" : "full process restart"} failed (${respawn.detail ?? "unknown error"}); falling back to in-process restart`);
			if (isUpdateRestart) await markRestartHandoffUnavailable("restart-unhealthy");
		} else gatewayLog$1.info(`restart mode: in-process restart (${respawn.detail ?? "OPENCLAW_NO_RESPAWN"})`);
		if (!isUpdateRestart && isUpdateProcessRestartReason(activeRestartRequest?.restartReason)) return handleRestartAfterServerClose();
		return reacquireAndResumeInProcessRestart();
	};
	const SHUTDOWN_TIMEOUT_MS = 325e3;
	const clearPendingStartupForceExitTimer = () => {
		clearTimeout(pendingStartupForceExitTimer ?? void 0);
		pendingStartupForceExitTimer = null;
	};
	const armPendingStartupForceExitTimer = () => {
		if (pendingStartupForceExitTimer) return;
		pendingStartupForceExitTimer = setTimeout(() => {
			pendingStartupForceExitTimer = null;
			gatewayLog$1.error("startup restart request timed out before gateway returned a close handle; exiting for supervisor recovery");
			forceExitAfterStabilityBundle("gateway.restart_startup_request_timeout");
		}, SHUTDOWN_TIMEOUT_MS);
		pendingStartupForceExitTimer.unref?.();
	};
	const resolveRestartDrainTimeoutMs = (restartIntent) => {
		if (restartIntent?.force) return 0;
		if (typeof restartIntent?.waitMs === "number" && Number.isFinite(restartIntent.waitMs)) return restartIntent.waitMs > 0 ? Math.floor(restartIntent.waitMs) : void 0;
		try {
			return eagerLifecycleRuntime.resolveGatewayRestartDeferralTimeoutMs();
		} catch {
			return DEFAULT_RESTART_DRAIN_TIMEOUT_MS;
		}
	};
	const markRestartDraining = () => {
		if (restartDrainingMarked) return;
		eagerLifecycleRuntime.markGatewayDraining();
		restartDrainingMarked = true;
	};
	const runAcceptedRequest = (acceptedRequest) => {
		const { action, restartIntent } = acceptedRequest;
		const isRestart = action === "restart";
		if (isRestart) activeRestartRequest = acceptedRequest;
		let forceExitTimer = null;
		let hardExitWatchdog = null;
		const armForceExitTimer = (forceExitMs) => {
			if (forceExitTimer) return;
			forceExitTimer = setTimeout(() => {
				gatewayLog$1.error("shutdown timed out; exiting without full cleanup");
				forceExitAfterStabilityBundle(isRestart ? "gateway.restart_shutdown_timeout" : "gateway.stop_shutdown_timeout");
			}, forceExitMs);
			if (params.ownsProcessLifecycle === true) hardExitWatchdog = armShutdownHardExitWatchdog({
				delayMs: forceExitMs + HARD_EXIT_WATCHDOG_GRACE_MS,
				onError: (error) => {
					gatewayLog$1.warn(`hard-exit watchdog failed; retaining main-thread shutdown timer: ${formatErrorMessage(error)}`);
				}
			});
		};
		const clearForceExitTimer = () => {
			clearTimeout(forceExitTimer ?? void 0);
			forceExitTimer = null;
			hardExitWatchdog?.cancel();
			hardExitWatchdog = null;
		};
		if (isRestart) forceActiveRestartExit = () => {
			clearForceExitTimer();
			if (!getManagedUpdateOwner()) armForceExitTimer(SHUTDOWN_TIMEOUT_MS);
		};
		(async () => {
			let managedUpdateOwner;
			let managedUpdateCancellation;
			const restartDrainTimeoutMs = isRestart ? resolveRestartDrainTimeoutMs(restartIntent) : 0;
			const restartDrainDeadlineAt = isRestart && restartDrainTimeoutMs !== void 0 ? Date.now() + restartDrainTimeoutMs : void 0;
			if (!isRestart) armForceExitTimer(SHUTDOWN_TIMEOUT_MS);
			else if (restartDrainTimeoutMs !== void 0 && !getManagedUpdateOwner()) armForceExitTimer(restartDrainTimeoutMs + SHUTDOWN_TIMEOUT_MS);
			const formatRestartDrainBudget = () => restartDrainTimeoutMs === void 0 ? "without a timeout" : `with timeout ${restartDrainTimeoutMs}ms`;
			try {
				if (isRestart) {
					let activeWorkAtDrainStart = 0;
					let activeRunsAtDrainStart = 0;
					let drainTimedOut = false;
					await measureGatewayRestartTrace("restart.drain", async () => {
						const { abortEmbeddedAgentRun, createGatewayActiveWorkSnapshot, waitForGatewayActiveWork } = await loadGatewayLifecycleRuntimeModule();
						const formatBlockers = (snapshot) => snapshot.blockers.map((blocker) => blocker.message).join("; ");
						markRestartDraining();
						const initialSnapshot = createGatewayActiveWorkSnapshot();
						activeWorkAtDrainStart = initialSnapshot.counts.totalActive;
						activeRunsAtDrainStart = initialSnapshot.counts.embeddedRuns;
						if (activeRunsAtDrainStart > 0) abortEmbeddedAgentRun(void 0, {
							mode: "compacting",
							reason: "restart"
						});
						if (!initialSnapshot.idle) gatewayLog$1.info(`draining active work before restart ${formatRestartDrainBudget()}: ${formatBlockers(initialSnapshot)}`);
						if (restartIntent?.force) {
							gatewayLog$1.warn("forced restart requested; skipping active work drain");
							return;
						}
						let lastPendingWarningAt = Date.now();
						const drain = await waitForGatewayActiveWork(restartDrainDeadlineAt === void 0 ? void 0 : Math.max(0, restartDrainDeadlineAt - Date.now()), { onSnapshot: (snapshot) => {
							const now = Date.now();
							if (!snapshot.idle && now - lastPendingWarningAt >= RESTART_DRAIN_STILL_PENDING_WARN_MS) {
								lastPendingWarningAt = now;
								gatewayLog$1.warn(`still draining active work before restart: ${formatBlockers(snapshot)}`);
							}
						} });
						if (drain.drained) {
							if (!initialSnapshot.idle) gatewayLog$1.info("all active work drained");
							return;
						}
						drainTimedOut = true;
						gatewayLog$1.warn(`active-work drain timeout reached; proceeding with restart: ${formatBlockers(drain.snapshot)}`);
					}, () => [
						["activeWork", activeWorkAtDrainStart],
						["activeRuns", activeRunsAtDrainStart],
						["timedOut", drainTimedOut],
						["force", restartIntent?.force === true]
					]);
				} else try {
					const activeWorkDrain = await eagerLifecycleRuntime.waitForGatewayActiveWork(Math.max(0, SHUTDOWN_TIMEOUT_MS - RESTART_CLOSE_REPLY_DRAIN_SHUTDOWN_RESERVE_MS));
					if (!activeWorkDrain.drained) gatewayLog$1.warn(`gateway active-work drain timeout reached; proceeding with shutdown: ${activeWorkDrain.snapshot.blockers.map((blocker) => blocker.message).join("; ")}`);
				} catch (err) {
					gatewayLog$1.warn(`gateway active-work drain failed; proceeding with shutdown: ${formatErrorMessage(err)}`);
				}
				if (isRestart && activeRestartRequest?.restartIntent?.successorOwner) {
					const owner = activeRestartRequest.restartIntent.successorOwner;
					managedUpdateOwner = owner;
					try {
						if (!sameManagedUpdateOwner(getManagedUpdateOwner(), owner) || !await eagerLifecycleRuntime.requestManagedServiceUpdateHandoffPark(owner) || !sameManagedUpdateOwner(getManagedUpdateOwner(), owner) || !eagerLifecycleRuntime.claimManagedServiceUpdateHandoff(owner)) throw new Error("managed update helper lost exact ownership during service parking");
					} catch (err) {
						clearForceExitTimer();
						gatewayLog$1.error(`managed update handoff could not park ${supervisorMode}: ${String(err)}`);
						await markRestartHandoffUnavailable();
						managedUpdateCancellation = await cancelManagedUpdateHandoffBeforeRecovery(owner);
						if (!managedUpdateCancellation) return;
						if (managedUpdateCancellation === "restart-after-exit") {
							await releaseLockIfHeld();
							await exitProcessAfterLogFlush(0, owner, "restore");
							return;
						}
					}
				}
				if (isRestart && !forceExitTimer && (!managedUpdateOwner || managedUpdateCancellation === "restored-in-process")) armForceExitTimer(SHUTDOWN_TIMEOUT_MS);
				const closeDrainTimeoutMs = !isRestart ? null : restartDrainTimeoutMs === void 0 ? SHUTDOWN_TIMEOUT_MS - RESTART_CLOSE_REPLY_DRAIN_SHUTDOWN_RESERVE_MS : Math.max(0, (restartDrainDeadlineAt ?? Date.now()) - Date.now());
				await server?.close({
					reason: isRestart ? "gateway restarting" : "gateway stopping",
					restartExpectedMs: isRestart ? 1500 : null,
					...closeDrainTimeoutMs !== null ? { drainTimeoutMs: closeDrainTimeoutMs } : {}
				});
			} catch (err) {
				gatewayLog$1.error(`shutdown step failed (gateway server close): ${formatErrorMessage(err)}`);
			} finally {
				const handoffClosed = managedUpdateCancellation !== false && managedUpdateCancellation !== "restart-after-exit";
				if (handoffClosed) server = null;
				if (isRestart) try {
					if (handoffClosed) await handleRestartAfterServerClose(managedUpdateOwner, managedUpdateCancellation === "restored-in-process");
				} finally {
					clearForceExitTimer();
					forceActiveRestartExit = null;
				}
				else {
					clearForceExitTimer();
					params.completeBoot?.({
						outcome: "clean_stop",
						reason: "gateway.stop"
					});
					await releaseLockIfHeld();
					await exitProcessAfterLogFlush(0);
				}
			}
		})();
	};
	const flushPendingStartupRequest = (opts = {}) => {
		if (!pendingStartupRequest || !restartResolver) return;
		if (!server && opts.allowMissingServer !== true) return;
		const request = pendingStartupRequest;
		pendingStartupRequest = null;
		clearPendingStartupForceExitTimer();
		startupFailedWithoutServerHandle = false;
		runAcceptedRequest(request);
	};
	const request = (action, signal, restartReason, restartIntent) => {
		const acceptedRequest = {
			action,
			signal,
			restartReason,
			restartIntent
		};
		if (shuttingDown) {
			const currentRestartRequest = pendingStartupRequest ?? activeRestartRequest;
			if (action === "restart" && isUpdateProcessRestartReason(restartReason) && currentRestartRequest?.action === "restart" && (!isUpdateProcessRestartReason(currentRestartRequest.restartReason) || restartIntent?.successorOwner && !sameManagedUpdateOwner(restartIntent.successorOwner, currentRestartRequest.restartIntent?.successorOwner))) {
				const upgradedRequest = {
					...currentRestartRequest,
					signal,
					restartReason,
					restartIntent: {
						...currentRestartRequest.restartIntent,
						...restartIntent,
						force: true,
						reason: restartReason
					}
				};
				if (pendingStartupRequest) pendingStartupRequest = upgradedRequest;
				else {
					activeRestartRequest = upgradedRequest;
					forceActiveRestartExit?.();
				}
				gatewayLog$1.info(`received ${signal} during shutdown; upgrading to ${restartReason}`);
				return;
			}
			if (action === "stop" && pendingStartupRequest && !server) {
				gatewayLog$1.info(`received ${signal}; overriding pending startup restart with shutdown`);
				pendingStartupRequest = null;
				clearPendingStartupForceExitTimer();
				startupFailedWithoutServerHandle = false;
				runAcceptedRequest(acceptedRequest);
				return;
			}
			gatewayLog$1.info(`received ${signal} during shutdown; ignoring`);
			return;
		}
		const isRestart = action === "restart";
		markRestartDraining();
		shuttingDown = true;
		gatewayLog$1.info(`received ${signal}; ${isRestart ? "restarting" : "shutting down"}`);
		if (isRestart) startGatewayRestartTrace("restart.signal.received", [
			["signal", signal],
			["reason", restartReason ?? signal],
			["force", restartIntent?.force === true],
			["waitMs", restartIntent?.waitMs ?? "default"]
		]);
		if (action === "stop") {
			runAcceptedRequest(acceptedRequest);
			return;
		}
		if (!server && restartResolver && startupFailedWithoutServerHandle) {
			startupFailedWithoutServerHandle = false;
			runAcceptedRequest(acceptedRequest);
			return;
		}
		if (!server || !restartResolver) {
			pendingStartupRequest = acceptedRequest;
			armPendingStartupForceExitTimer();
			return;
		}
		runAcceptedRequest(acceptedRequest);
	};
	const onSigterm = () => {
		gatewayLog$1.debug("signal SIGTERM received");
		(async () => {
			const { consumeGatewayRestartIntentPayloadSync } = await loadGatewayLifecycleRuntimeModule();
			const restartIntent = consumeGatewayRestartIntentPayloadSync();
			request(restartIntent ? "restart" : "stop", "SIGTERM", restartIntent?.reason, restartIntent ?? void 0);
		})().catch((err) => {
			gatewayLog$1.error(`failed to handle SIGTERM: ${String(err)}`);
			request("stop", "SIGTERM");
		});
	};
	const onSigint = () => {
		gatewayLog$1.debug("signal SIGINT received");
		request("stop", "SIGINT");
	};
	const onSigusr1 = () => {
		gatewayLog$1.debug("signal SIGUSR1 received");
		(async () => {
			const { abortPendingChannelReloads, consumeGatewayRestartIntentPayloadSync, consumeGatewaySigusr1RestartIntent, consumeGatewaySigusr1RestartAuthorization, isGatewaySigusr1RestartExternallyAllowed, markGatewaySigusr1RestartHandled, peekGatewaySigusr1RestartReason, scheduleGatewaySigusr1Restart } = await loadGatewayLifecycleRuntimeModule();
			const restartIntent = consumeGatewayRestartIntentPayloadSync();
			if (restartIntent) {
				abortPendingChannelReloads();
				const authorized = consumeGatewaySigusr1RestartAuthorization();
				const processLocalIntent = authorized ? consumeGatewaySigusr1RestartIntent() : null;
				if (processLocalIntent?.successorOwner) Object.assign(restartIntent, processLocalIntent);
				markRestartDraining();
				if (authorized) markGatewaySigusr1RestartHandled();
				request("restart", "SIGUSR1", restartIntent.reason ?? "gateway.restart", restartIntent);
				return;
			}
			if (!consumeGatewaySigusr1RestartAuthorization()) {
				markGatewaySigusr1RestartHandled();
				if (!isGatewaySigusr1RestartExternallyAllowed()) {
					gatewayLog$1.warn("SIGUSR1 restart ignored (not authorized; commands.restart=false).");
					gatewayLog$1.warn("An unauthorized SIGUSR1 restart signal was received and ignored. If a pending gateway restart needs to be applied, run `openclaw gateway restart` or restart the gateway through your service manager.");
					return;
				}
				if (shuttingDown) {
					gatewayLog$1.info("received SIGUSR1 during shutdown; ignoring");
					return;
				}
				abortPendingChannelReloads();
				scheduleGatewaySigusr1Restart({
					delayMs: 0,
					reason: "SIGUSR1"
				});
				return;
			}
			abortPendingChannelReloads();
			const sigusr1RestartIntent = consumeGatewaySigusr1RestartIntent();
			const restartReason = peekGatewaySigusr1RestartReason();
			markRestartDraining();
			markGatewaySigusr1RestartHandled();
			request("restart", "SIGUSR1", sigusr1RestartIntent?.reason ?? restartReason, sigusr1RestartIntent ?? void 0);
		})().catch((err) => {
			gatewayLog$1.error(`SIGUSR1 handler failed: ${formatErrorMessage(err)}`);
			try {
				eagerLifecycleRuntime.markGatewaySigusr1RestartHandled();
			} catch {}
			try {
				eagerLifecycleRuntime.rollbackGatewayRestartSignalAdmission();
				restartDrainingMarked = false;
			} catch {}
		});
	};
	process.on("SIGTERM", onSigterm);
	process.on("SIGINT", onSigint);
	process.on("SIGUSR1", onSigusr1);
	try {
		const onRestart = async () => {
			const { abortActiveCronTaskRuns, advanceCronActiveJobGeneration, reloadTaskRuntimeStateFromStore, retireActiveCronTaskRunTracking, resetCronActiveJobs, resetAllLanes, resetGatewayRestartStateForInProcessRestart, resetGatewaySuspendCoordinatorForLifecycleRestart, rotateAgentEventLifecycleGeneration, waitForActiveCronJobs, waitForActiveCronTaskRuns } = await loadGatewayLifecycleRuntimeModule();
			rotateAgentEventLifecycleGeneration();
			advanceCronActiveJobGeneration();
			abortActiveCronTaskRuns("Gateway restarting.");
			const cronTaskDrain = await waitForActiveCronTaskRuns(1e3);
			const cronDrain = await waitForActiveCronJobs(1e3);
			if (!cronTaskDrain.drained || !cronDrain.drained) gatewayLog$1.warn(`cron run drain timed out during restart lifecycle reset after retiring old cron admission; ${cronTaskDrain.active} task handle(s) and ${cronDrain.active} active marker(s) remain after aborting old cron runs`);
			retireActiveCronTaskRunTracking();
			resetCronActiveJobs();
			resetGatewaySuspendCoordinatorForLifecycleRestart();
			resetAllLanes();
			clearRuntimeConfigSnapshot();
			resetGatewayRestartStateForInProcessRestart();
			try {
				await drainGlobalSingletonLifecycleState("restart");
			} catch (error) {
				gatewayLog$1.warn(`failed to reset ambient runtime state: ${formatErrorMessage(error)}`);
			}
			reloadTaskRuntimeStateFromStore();
			markGatewayRestartTrace("restart.next-start");
		};
		let isFirstIteration = true;
		for (;;) {
			restartDrainingMarked = false;
			let startupFailedBeforeServerHandle = false;
			const isRestartIteration = !isFirstIteration;
			isFirstIteration = false;
			try {
				if (isRestartIteration) await onRestart();
				startupStartedAt = Date.now();
				await params.beginBoot?.(startupStartedAt);
				const startedServer = await params.start({
					startupStartedAt,
					requestHotReloadRecovery: eagerLifecycleRuntime.requestGatewayRestartWithSignalAdmission
				});
				server = startedServer;
				startupFailedWithoutServerHandle = false;
				await new Promise((resolve, reject) => {
					restartResolver = () => {
						restartResolver = null;
						resolve();
					};
					startedServer.startupSettled.then(void 0, reject);
					flushPendingStartupRequest();
				});
			} catch (err) {
				const failedServer = server;
				server = null;
				const mediaMigrationRequired = findOpenClawAgentDatabaseMediaMigrationRequiredError(err);
				params.completeBoot?.({
					outcome: "startup_failed",
					reason: truncateUtf16Safe(formatErrorMessage(err), 500),
					...mediaMigrationRequired ? { startupReason: GATEWAY_AGENT_MEDIA_MIGRATION_REQUIRED_REASON } : {}
				});
				try {
					await failedServer?.close({ reason: "gateway startup failed" });
				} catch (closeError) {
					gatewayLog$1.warn(`failed to close gateway after startup failure: ${formatErrorMessage(closeError)}`);
				}
				if (!isRestartIteration) throw err;
				startupFailedWithoutServerHandle = true;
				startupFailedBeforeServerHandle = true;
				if (!pendingStartupRequest) await releaseLockIfHeld();
				const errMsg = formatErrorMessage(err);
				const errStack = err instanceof Error && err.stack ? `\n${err.stack}` : "";
				writeStabilityBundle("gateway.restart_startup_failed", err);
				gatewayLog$1.error(`gateway startup failed: ${errMsg}. Process will stay alive; fix the issue and restart.${errStack}`);
			}
			if (startupFailedBeforeServerHandle) await new Promise((resolve) => {
				restartResolver = () => {
					restartResolver = null;
					resolve();
				};
				flushPendingStartupRequest({ allowMissingServer: true });
			});
		}
	} finally {
		await releaseLockIfHeld();
		cleanupSignals();
	}
}
//#endregion
//#region src/cli/gateway-cli/run.ts
const gatewayLog = createSubsystemLogger("gateway");
const SUPERVISED_GATEWAY_LOCK_RETRY_MS = 5e3;
const SUPERVISED_GATEWAY_LOCK_RETRY_TIMEOUT_MS = 3e4;
const SUPERVISED_GATEWAY_HEALTH_PROBE_TIMEOUT_MS = 1e3;
const GATEWAY_HEALTH_PROBE_MAX_RESPONSE_CHARS = 1024;
const GATEWAY_SHELL_ENV_CONVERGENCE_MAX_READS = 4;
/**
* EX_CONFIG (78) from sysexits.h — used for configuration errors so systemd
* (via RestartPreventExitStatus=78) stops restarting instead of entering a
* restart storm that can render low-resource hosts unresponsive.
*/
const EXIT_CONFIG_ERROR = 78;
const GATEWAY_AUTH_MODES = [
	"none",
	"token",
	"password",
	"trusted-proxy"
];
const GATEWAY_TAILSCALE_MODES = [
	"off",
	"serve",
	"funnel"
];
const toOptionString = (value) => {
	if (typeof value === "string") return value;
	if (typeof value === "number" || typeof value === "bigint") return value.toString();
};
function extractGatewayMiskeys(parsed) {
	if (!parsed || typeof parsed !== "object") return {
		hasGatewayToken: false,
		hasRemoteToken: false
	};
	const gateway = parsed.gateway;
	if (!gateway || typeof gateway !== "object") return {
		hasGatewayToken: false,
		hasRemoteToken: false
	};
	const hasGatewayToken = "token" in gateway;
	const remote = gateway.remote;
	return {
		hasGatewayToken,
		hasRemoteToken: remote && typeof remote === "object" ? "token" in remote : false
	};
}
function createGatewayCliStartupTrace() {
	const enabled = isTruthyEnvValue(process.env.OPENCLAW_GATEWAY_STARTUP_TRACE);
	const started = performance.now();
	let last = started;
	const emit = (name, durationMs, totalMs) => {
		if (enabled) gatewayLog.info(`startup trace: ${name} ${durationMs.toFixed(1)}ms total=${totalMs.toFixed(1)}ms`);
	};
	const startMeasure = (name, run) => {
		const before = performance.now();
		let completedAt = before;
		let emitted = false;
		const result = withDiagnosticPhase(name, run).finally(() => {
			completedAt = performance.now();
		});
		return {
			result,
			settled: result.then(() => {}, () => {}),
			emit() {
				if (emitted) return;
				emitted = true;
				emit(name, completedAt - before, completedAt - started);
				last = completedAt;
			}
		};
	};
	return {
		mark(name) {
			const now = performance.now();
			emit(name, now - last, now - started);
			last = now;
		},
		startMeasure,
		async measure(name, run) {
			const measurement = startMeasure(name, run);
			try {
				return await measurement.result;
			} finally {
				await measurement.settled;
				measurement.emit();
			}
		}
	};
}
function warnInlinePasswordFlag() {
	defaultRuntime.error("Warning: --password can be exposed via process listings. Prefer --password-file or OPENCLAW_GATEWAY_PASSWORD.");
}
async function resolveGatewayPasswordOption(opts) {
	const direct = toOptionString(opts.password);
	const file = toOptionString(opts.passwordFile);
	if (direct && file) throw new Error("Use either --password or --password-file.");
	if (file) {
		const { readSecretFromFile } = await import("./secret-file-dpxeZYNT.js");
		return readSecretFromFile(file, "Gateway password");
	}
	return direct;
}
function parseEnumOption(raw, allowed) {
	if (!raw) return null;
	return allowed.includes(raw) ? raw : null;
}
function formatModeErrorList(modes) {
	const quoted = modes.map((mode) => `"${mode}"`);
	if (quoted.length === 0) return "";
	if (quoted.length === 1) return expectDefined(quoted[0], "quoted entry at 0");
	if (quoted.length === 2) return `${quoted[0]} or ${quoted[1]}`;
	return `${quoted.slice(0, -1).join(", ")}, or ${quoted[quoted.length - 1]}`;
}
function shouldBlockGatewayBindWithoutExplicitAuth(params) {
	return !isLoopbackHost(params.bindHost) && !params.hasSharedSecret && params.resolvedAuthMode !== "trusted-proxy";
}
function getGatewayStartGuardErrors(params) {
	if (params.allowUnconfigured || params.mode === "local") return [];
	if (!params.configExists) return [`Missing config. Run \`${formatCliCommand("openclaw setup")}\` or set gateway.mode=local (or pass --allow-unconfigured).`];
	if (params.mode === void 0) return [[
		"Gateway start blocked: existing config is missing gateway.mode.",
		"Treat this as suspicious or clobbered config.",
		`Re-run \`${formatCliCommand("openclaw onboard --mode local")}\` or \`${formatCliCommand("openclaw setup")}\`, set gateway.mode=local manually, or pass --allow-unconfigured.`
	].join(" "), `Config write audit: ${params.configAuditLocation}`];
	return [`Gateway start blocked: set gateway.mode=local (current: ${params.mode}) or pass --allow-unconfigured.`, `Config write audit: ${params.configAuditLocation}`];
}
async function readGatewayStartupConfig(params) {
	const { readConfigFileSnapshotWithPluginMetadata } = await import("./config/config.js");
	let blockedRecoveryConfig = null;
	const snapshotRead = await params.startupTrace.measure("cli.config-snapshot", () => readConfigFileSnapshotWithPluginMetadata({
		isolateEnv: true,
		...Object.keys(params.lowerPrecedenceEnv).length > 0 ? { lowerPrecedenceEnv: params.lowerPrecedenceEnv } : {},
		recoverSuspicious: true,
		allowSuspiciousRecovery: (config, current) => {
			const blockedConfig = [current, config].find((candidate) => !isGatewayRunFutureConfigAllowed({
				opts: params.opts,
				config: candidate
			}));
			if (!blockedConfig) return true;
			blockedRecoveryConfig = blockedConfig;
			return false;
		}
	}).catch(() => null));
	if (blockedRecoveryConfig) enforceGatewayRunFutureConfigGuard({
		opts: params.opts,
		runtime: defaultRuntime,
		config: blockedRecoveryConfig
	});
	const snapshot = snapshotRead?.snapshot ?? null;
	return {
		cfg: snapshot?.config ?? {},
		snapshot,
		...snapshotRead ? { startupConfigSnapshotRead: snapshotRead } : {}
	};
}
async function resolveGatewayRunShellEnvFallbackPlan(cfg) {
	const { createConfigRuntimeEnv } = await import("./env-vars-L2lfMc3k.js");
	const { resolveShellEnvFallbackTimeoutMs, shouldDeferShellEnvFallback, shouldEnableShellEnvFallback } = await import("./shell-env-BURAOfLk.js");
	const planEnv = createConfigRuntimeEnv(cfg, process.env);
	if (!((shouldEnableShellEnvFallback(planEnv) || cfg.env?.shellEnv?.enabled === true) && !shouldDeferShellEnvFallback(planEnv))) return { enabled: false };
	const { resolveShellEnvExpectedKeys } = await import("./shell-env-expected-keys-3VMygfjn.js");
	return {
		enabled: true,
		expectedKeys: resolveShellEnvExpectedKeys(planEnv),
		timeoutMs: cfg.env?.shellEnv?.timeoutMs ?? resolveShellEnvFallbackTimeoutMs(planEnv)
	};
}
async function loadGatewayRunShellEnvFallback(plan) {
	const { loadShellEnvFallback } = await import("./shell-env-BURAOfLk.js");
	const valuesBeforeLoad = new Map(plan.expectedKeys.map((key) => [key, process.env[key]]));
	loadShellEnvFallback({
		enabled: true,
		env: process.env,
		expectedKeys: plan.expectedKeys,
		logger: gatewayLog,
		timeoutMs: plan.timeoutMs
	});
	return Object.fromEntries(plan.expectedKeys.flatMap((key) => {
		const value = process.env[key];
		return value !== void 0 && value !== valuesBeforeLoad.get(key) ? [[key, value]] : [];
	}));
}
async function clearGatewayRunShellEnvFallback(values) {
	const keys = Object.keys(values);
	if (keys.length === 0) return;
	for (const [key, value] of Object.entries(values)) if (process.env[key] === value) delete process.env[key];
	const { clearShellEnvAppliedKeys } = await import("./shell-env-BURAOfLk.js");
	clearShellEnvAppliedKeys(keys);
}
function gatewayRunShellEnvFallbackPlanSignature(plan) {
	return JSON.stringify(plan);
}
async function readGatewayStartupConfigWithShellEnv(params) {
	let lowerPrecedenceEnv = {};
	let loadedPlanSignature;
	try {
		for (let readCount = 0; readCount < GATEWAY_SHELL_ENV_CONVERGENCE_MAX_READS; readCount += 1) {
			const startupConfig = await readGatewayStartupConfig({
				lowerPrecedenceEnv,
				opts: params.opts,
				startupTrace: params.startupTrace
			});
			const plan = await resolveGatewayRunShellEnvFallbackPlan(startupConfig.snapshot?.valid === true ? startupConfig.cfg : {});
			const planSignature = gatewayRunShellEnvFallbackPlanSignature(plan);
			if (!plan.enabled) {
				if (Object.keys(lowerPrecedenceEnv).length === 0) return {
					...startupConfig,
					lowerPrecedenceEnv
				};
				await clearGatewayRunShellEnvFallback(lowerPrecedenceEnv);
				lowerPrecedenceEnv = {};
				loadedPlanSignature = void 0;
				continue;
			}
			if (loadedPlanSignature === planSignature) return {
				...startupConfig,
				lowerPrecedenceEnv
			};
			await clearGatewayRunShellEnvFallback(lowerPrecedenceEnv);
			lowerPrecedenceEnv = await loadGatewayRunShellEnvFallback(plan);
			loadedPlanSignature = planSignature;
		}
	} catch (err) {
		await clearGatewayRunShellEnvFallback(lowerPrecedenceEnv);
		throw err;
	}
	await clearGatewayRunShellEnvFallback(lowerPrecedenceEnv);
	throw new Error("Gateway shell environment fallback settings changed repeatedly during startup. Retry startup.");
}
function isGatewayLockError(err) {
	return err instanceof GatewayLockError || Boolean(err) && typeof err === "object" && err.name === "GatewayLockError";
}
function isGatewayAlreadyRunningLockError(err) {
	if (!isGatewayLockError(err) || typeof err.message !== "string") return false;
	return err.message.includes("gateway already running") || err.message.includes("another gateway instance is already listening");
}
var SupervisedGatewayLockError = class extends GatewayLockError {
	constructor(message, cause, exitCode) {
		super(message, cause);
		this.exitCode = exitCode;
	}
};
function resolveGatewayLockErrorExitCode(err) {
	return err instanceof SupervisedGatewayLockError ? err.exitCode : 1;
}
function resolveGatewayStartupFailureExitCode(err) {
	return isInvalidConfigError(err) || isTailscaleRouteOwnershipConflictError(err) || findOpenClawAgentDatabaseMediaMigrationRequiredError(err) || findOpenClawStateDatabaseSchemaMigrationRequiredError(err) ? EXIT_CONFIG_ERROR : 1;
}
function normalizeGatewayHealthProbeHost(host) {
	if (host === "0.0.0.0" || host === "::") return "127.0.0.1";
	return host;
}
function isGatewayHealthzResponse(statusCode, body) {
	if (statusCode !== 200) return false;
	try {
		const payload = JSON.parse(body);
		return payload.ok === true && payload.status === "live";
	} catch {
		return false;
	}
}
async function probeGatewayHealthz(params) {
	const timeoutMs = params.timeoutMs ?? SUPERVISED_GATEWAY_HEALTH_PROBE_TIMEOUT_MS;
	return await new Promise((resolve) => {
		let settled = false;
		const finish = (healthy) => {
			if (settled) return;
			settled = true;
			clearTimeout(deadline);
			resolve(healthy);
		};
		const req = (params.tlsFingerprint ? request$1 : request)({
			hostname: normalizeGatewayHealthProbeHost(params.host),
			port: params.port,
			path: "/healthz",
			method: "GET",
			timeout: timeoutMs,
			...params.tlsFingerprint ? { rejectUnauthorized: false } : {}
		}, (res) => {
			if (params.tlsFingerprint) {
				if ((res.socket instanceof TLSSocket ? normalizeTlsFingerprint(res.socket.getPeerCertificate().fingerprint256 ?? "") : "") !== normalizeTlsFingerprint(params.tlsFingerprint)) {
					res.resume();
					finish(false);
					return;
				}
			}
			let body = "";
			res.setEncoding("utf8");
			res.on("data", (chunk) => {
				if (body.length + chunk.length > GATEWAY_HEALTH_PROBE_MAX_RESPONSE_CHARS) {
					res.destroy();
					finish(false);
					return;
				}
				body += chunk;
			});
			res.once("end", () => {
				finish(isGatewayHealthzResponse(res.statusCode, body));
			});
			res.once("error", () => {
				finish(false);
			});
		});
		const deadline = setTimeout(() => {
			req.destroy();
			finish(false);
		}, timeoutMs);
		req.once("timeout", () => {
			req.destroy();
			finish(false);
		});
		req.once("error", () => {
			finish(false);
		});
		req.end();
	});
}
function createConfiguredGatewayHealthProbe(cfg) {
	const tlsConfig = cfg.gateway?.tls;
	let tlsFingerprint;
	return async (params) => {
		if (tlsConfig?.enabled !== true) return await probeGatewayHealthz(params);
		if (!tlsFingerprint) tlsFingerprint = (await import("./gateway-BWx_elNL.js").then(({ loadGatewayTlsRuntime }) => loadGatewayTlsRuntime({
			...tlsConfig,
			autoGenerate: false
		})).catch(() => void 0))?.fingerprintSha256;
		if (!tlsFingerprint) return false;
		return await probeGatewayHealthz({
			...params,
			tlsFingerprint
		});
	};
}
async function runGatewayLoopWithSupervisedLockRecovery(params) {
	const supervisor = params.supervisor;
	if (!supervisor) {
		await params.startLoop();
		return;
	}
	const now = params.now ?? Date.now;
	const sleep = params.sleep ?? (async (ms) => await new Promise((resolve) => {
		setTimeout(resolve, ms);
	}));
	const probeHealth = params.probeHealth ?? ((probeParams) => probeGatewayHealthz(probeParams));
	const retryMs = params.retryMs ?? SUPERVISED_GATEWAY_LOCK_RETRY_MS;
	const timeoutMs = params.timeoutMs ?? SUPERVISED_GATEWAY_LOCK_RETRY_TIMEOUT_MS;
	const startedAt = now();
	for (;;) try {
		await params.startLoop();
		return;
	} catch (err) {
		if (!isGatewayAlreadyRunningLockError(err)) throw err;
		if (await probeHealth({
			host: params.healthHost,
			port: params.port
		})) {
			if (supervisor === "systemd") throw new SupervisedGatewayLockError("gateway already running under systemd; existing gateway is healthy, exiting with code 78 to prevent a systemd Restart=always loop", err, EXIT_CONFIG_ERROR);
			params.log.info(`gateway already running under ${supervisor}; existing gateway is healthy, leaving it in control`);
			return;
		}
		const elapsedMs = now() - startedAt;
		if (elapsedMs >= timeoutMs) throw new SupervisedGatewayLockError(`gateway already running under ${supervisor}; existing gateway did not become healthy after ${timeoutMs}ms`, err, 1);
		const waitMs = Math.min(retryMs, Math.max(0, timeoutMs - elapsedMs));
		params.log.warn(`gateway already running under ${supervisor}; waiting ${waitMs}ms before retrying startup`);
		await sleep(waitMs);
	}
}
async function maybeWriteGatewayStartupFailureBundle(err, reason = "gateway.startup_failed") {
	const { writeDiagnosticStabilityBundleForFailureSync } = await import("./diagnostic-stability-bundle-BOkinCX5.js");
	const result = writeDiagnosticStabilityBundleForFailureSync(reason, err);
	if ("message" in result) gatewayLog.warn(result.message);
}
async function runGatewayCommandOnce(opts, hooks = {}) {
	const inheritedGatewayServicePid = parseStrictPositiveInteger(process.env[GATEWAY_SERVICE_RUNTIME_PID_ENV]);
	normalizeStateDirEnv(process.env);
	const { clearGatewayRunConfigEnvironment } = await import("./pre-bootstrap-D3yU9m2v.js");
	clearGatewayRunConfigEnvironment();
	installQaParentWatchdog();
	const isDevProfile = normalizeOptionalLowercaseString(process.env.OPENCLAW_PROFILE) === "dev";
	const devMode = Boolean(opts.dev) || isDevProfile;
	const ambientEnvTriggers = opts.ambientChannels || opts.devAmbientChannels ? "allow" : "suppress";
	if (opts.reset && !devMode) {
		defaultRuntime.error("Use --reset with --dev.");
		defaultRuntime.exit(1);
		return;
	}
	setVerbose(Boolean(opts.verbose));
	if (opts.cliBackendLogs || opts.claudeCliLogs) {
		setConsoleSubsystemFilter(["agent/cli-backend"]);
		process.env.OPENCLAW_CLI_BACKEND_LOG_OUTPUT = "1";
	}
	const wsLogRaw = opts.compact ? "compact" : opts.wsLog;
	const wsLogStyle = wsLogRaw === "compact" ? "compact" : wsLogRaw === "full" ? "full" : "auto";
	if (wsLogRaw !== void 0 && wsLogRaw !== "auto" && wsLogRaw !== "compact" && wsLogRaw !== "full") {
		defaultRuntime.error("Invalid --ws-log. Use \"auto\", \"full\", or \"compact\".");
		defaultRuntime.exit(1);
	}
	setGatewayWsLogStyle(wsLogStyle);
	if (opts.rawStream) process.env.OPENCLAW_RAW_STREAM = "1";
	const rawStreamPath = toOptionString(opts.rawStreamPath);
	if (rawStreamPath) process.env.OPENCLAW_RAW_STREAM_PATH = rawStreamPath;
	const startupTrace = createGatewayCliStartupTrace();
	const serverImportMeasurement = startupTrace.startMeasure("cli.server-import", () => import("./server-8Q32pR_9.js"));
	const rawServerImport = serverImportMeasurement.result;
	const bannerDone = process.stdout.isTTY ? printClawBanner(defaultRuntime, { settleWhen: rawServerImport }) : Promise.resolve("static");
	const loadServerModule = async () => {
		try {
			return await bannerDone === "settled" ? await rawServerImport : await withProgress({
				label: "Loading gateway modules…",
				indeterminate: true
			}, async () => rawServerImport);
		} finally {
			await serverImportMeasurement.settled;
			serverImportMeasurement.emit();
		}
	};
	const { startGatewayServer } = await loadServerModule();
	setConsoleTimestampPrefix(true);
	if (devMode) {
		if (opts.reset) {
			const { recheckGatewayRunReset } = await import("./pre-bootstrap-D3yU9m2v.js");
			if (!await recheckGatewayRunReset({
				opts,
				runtime: defaultRuntime
			})) return;
		}
		const { ensureDevGatewayConfig } = await import("./dev-oJ60OeeN.js");
		await startupTrace.measure("cli.dev-config", () => ensureDevGatewayConfig({ reset: Boolean(opts.reset) }));
		if (opts.reset) {
			const { reloadTrustedGatewayRunEnvironment } = await import("./pre-bootstrap-D3yU9m2v.js");
			if (!await reloadTrustedGatewayRunEnvironment({ runtime: defaultRuntime })) return;
		}
	}
	gatewayLog.info("loading configuration…");
	const { cfg, lowerPrecedenceEnv, snapshot, startupConfigSnapshotRead } = await readGatewayStartupConfigWithShellEnv({
		opts,
		startupTrace
	});
	if (!enforceGatewayRunFutureConfigGuard({
		opts,
		runtime: defaultRuntime,
		snapshot
	})) return;
	if (snapshot) {
		const { applyFinalGatewayRunConfigEnv } = await import("./pre-bootstrap-D3yU9m2v.js");
		if (!await applyFinalGatewayRunConfigEnv({
			lowerPrecedenceEnv,
			runtime: defaultRuntime,
			snapshot
		})) return;
		const finalConfigEnteredServiceMode = Boolean(process.env.OPENCLAW_SERVICE_MARKER?.trim());
		const clearRejectedFinalConfigEnv = () => {
			clearGatewayRunConfigEnvironment();
			if (finalConfigEnteredServiceMode) delete process.env[ALLOW_OLDER_BINARY_DESTRUCTIVE_ACTIONS_ENV];
		};
		let finalConfigAllowed;
		try {
			finalConfigAllowed = enforceGatewayRunFutureConfigGuard({
				opts,
				runtime: defaultRuntime,
				snapshot
			});
		} catch (err) {
			clearRejectedFinalConfigEnv();
			throw err;
		}
		if (!finalConfigAllowed) {
			clearRejectedFinalConfigEnv();
			return;
		}
	}
	if (process.env.OPENCLAW_SERVICE_MARKER?.trim()) process.env[GATEWAY_SERVICE_RUNTIME_PID_ENV] = String(process.pid);
	await hooks.refreshManagedProxy?.(cfg.proxy);
	const portOverride = parsePort(opts.port);
	if (opts.port !== void 0 && portOverride === null) {
		defaultRuntime.error(formatInvalidPortOption("--port"));
		defaultRuntime.exit(1);
		return;
	}
	const port = portOverride ?? resolveGatewayPort(cfg);
	if (!Number.isFinite(port) || port <= 0 || port > 65535) {
		defaultRuntime.error(formatInvalidConfigPort("gateway.port"));
		defaultRuntime.exit(EXIT_CONFIG_ERROR);
		return;
	}
	const VALID_BIND_MODES = /* @__PURE__ */ new Set([
		"loopback",
		"lan",
		"auto",
		"custom",
		"tailnet"
	]);
	const bindExplicitRawStr = normalizeOptionalString(toOptionString(opts.bind) ?? cfg.gateway?.bind);
	if (bindExplicitRawStr !== void 0 && !VALID_BIND_MODES.has(bindExplicitRawStr)) {
		defaultRuntime.error("Invalid --bind. Use \"loopback\", \"lan\", \"tailnet\", \"auto\", or \"custom\".");
		defaultRuntime.exit(1);
		return;
	}
	const bindExplicitRaw = bindExplicitRawStr;
	if (process.env.OPENCLAW_SERVICE_MARKER?.trim()) {
		const { cleanStaleGatewayProcessesSync } = await import("./restart-stale-pids-DlfzgppX.js");
		const stale = cleanStaleGatewayProcessesSync(port, { protectedPid: inheritedGatewayServicePid });
		if (stale.length > 0) {
			gatewayLog.info(`service-mode: cleared ${stale.length} stale gateway pid(s) before bind on port ${port}`);
			if (process.platform === "linux") {
				const { findSystemdGatewayInstallation, formatDuelingScopesWarning } = await import("./systemd-R20Y84Rl.js");
				const installation = await findSystemdGatewayInstallation(process.env).catch(() => null);
				const warning = installation ? formatDuelingScopesWarning(installation, port) : null;
				if (warning) gatewayLog.warn(`service-mode: ${warning}`);
			}
		}
	}
	if (opts.force) {
		const interactive = isTerminalInteractive();
		const describeNonInteractiveGatewayOwner = () => {
			const gatewayPids = findVerifiedGatewayListenerPidsOnPortSync(port);
			if (gatewayPids.length === 0) return;
			return `${NON_INTERACTIVE_GATEWAY_RUN_FORCE_MESSAGE} Existing gateway listener pid${gatewayPids.length === 1 ? "" : "s"}: ${formatGatewayPidList(gatewayPids)}.`;
		};
		if (!interactive) {
			const refusal = describeNonInteractiveGatewayOwner();
			if (refusal) {
				defaultRuntime.error(refusal);
				defaultRuntime.exit(1);
				return;
			}
		}
		try {
			const { forceFreePortAndWait, waitForPortBindable } = await import("./ports-DBm2OBNx.js");
			const { killed, waitedMs, escalatedToSigkill } = await forceFreePortAndWait(port, {
				timeoutMs: 2e3,
				intervalMs: 100,
				sigtermTimeoutMs: 700,
				...interactive ? {} : { beforeSignal: () => {
					const refusal = describeNonInteractiveGatewayOwner();
					if (refusal) throw new Error(refusal);
				} }
			});
			if (killed.length === 0) gatewayLog.debug(`force: no listeners on port ${port}`);
			else {
				for (const proc of killed) gatewayLog.info(`force: killed pid ${proc.pid}${proc.command ? ` (${proc.command})` : ""} on port ${port}`);
				if (escalatedToSigkill) gatewayLog.info(`force: escalated to SIGKILL while freeing port ${port}`);
				if (waitedMs > 0) gatewayLog.info(`force: waited ${waitedMs}ms for port ${port} to free`);
			}
			const bindWaitMs = await waitForPortBindable(port, {
				timeoutMs: 3e3,
				intervalMs: 150,
				host: bindExplicitRaw === "loopback" ? "127.0.0.1" : bindExplicitRaw === "lan" ? "0.0.0.0" : bindExplicitRaw === "custom" ? toOptionString(cfg.gateway?.customBindHost) : void 0
			});
			if (bindWaitMs > 0) gatewayLog.info(`force: waited ${bindWaitMs}ms for port ${port} to become bindable`);
		} catch (err) {
			defaultRuntime.error(`Could not free port ${port}: ${formatErrorMessage(err)}. Run ${formatCliCommand("openclaw gateway status --deep")} to inspect the listener.`);
			defaultRuntime.exit(1);
			return;
		}
	}
	if (opts.token) {
		const token = toOptionString(opts.token);
		if (token) process.env.OPENCLAW_GATEWAY_TOKEN = token;
	}
	const authModeRaw = toOptionString(opts.auth);
	const authMode = parseEnumOption(authModeRaw, GATEWAY_AUTH_MODES);
	if (authModeRaw && !authMode) {
		defaultRuntime.error(`Invalid --auth. Use ${formatModeErrorList(GATEWAY_AUTH_MODES)}.`);
		defaultRuntime.exit(1);
		return;
	}
	const tailscaleRaw = toOptionString(opts.tailscale);
	const tailscaleMode = parseEnumOption(tailscaleRaw, GATEWAY_TAILSCALE_MODES);
	if (tailscaleRaw && !tailscaleMode) {
		defaultRuntime.error(`Invalid --tailscale. Use ${formatModeErrorList(GATEWAY_TAILSCALE_MODES)}.`);
		defaultRuntime.exit(1);
		return;
	}
	const effectiveTailscaleMode = tailscaleMode ?? cfg.gateway?.tailscale?.mode ?? "off";
	const bind = bindExplicitRaw ?? defaultGatewayBindMode(effectiveTailscaleMode);
	let passwordRaw;
	try {
		passwordRaw = await resolveGatewayPasswordOption(opts);
	} catch (err) {
		defaultRuntime.error(formatErrorMessage(err));
		defaultRuntime.exit(1);
		return;
	}
	if (toOptionString(opts.password)) warnInlinePasswordFlag();
	const tokenRaw = toOptionString(opts.token);
	gatewayLog.info("resolving authentication…");
	const configExists = snapshot?.exists ?? fs.existsSync(CONFIG_PATH);
	const mode = (snapshot?.valid ? snapshot.config : cfg).gateway?.mode;
	const guardErrors = getGatewayStartGuardErrors({
		allowUnconfigured: opts.allowUnconfigured,
		configExists,
		configAuditLocation: CONFIG_AUDIT_STORE_LABEL,
		mode
	});
	if (guardErrors.length > 0) {
		for (const error of guardErrors) defaultRuntime.error(error);
		defaultRuntime.exit(EXIT_CONFIG_ERROR);
		return;
	}
	const miskeys = extractGatewayMiskeys(snapshot?.parsed);
	const authOverride = authMode || passwordRaw || tokenRaw || authModeRaw ? {
		...authMode ? { mode: authMode } : {},
		...tokenRaw ? { token: tokenRaw } : {},
		...passwordRaw ? { password: passwordRaw } : {}
	} : void 0;
	const { resolveGatewayAuth } = await import("./auth-Cu4uN_-s.js");
	const resolvedAuth = await startupTrace.measure("cli.auth-resolve", () => resolveGatewayAuth({
		authConfig: cfg.gateway?.auth,
		authOverride,
		env: process.env,
		tailscaleMode: tailscaleMode ?? cfg.gateway?.tailscale?.mode ?? "off"
	}));
	const resolvedAuthMode = resolvedAuth.mode;
	const tokenValue = resolvedAuth.token;
	const passwordValue = resolvedAuth.password;
	const hasToken = typeof tokenValue === "string" && tokenValue.trim().length > 0;
	const hasPassword = typeof passwordValue === "string" && passwordValue.trim().length > 0;
	const tokenConfigured = hasToken || hasConfiguredSecretInput(authOverride?.token ?? cfg.gateway?.auth?.token, cfg.secrets?.defaults);
	const passwordConfigured = hasPassword || hasConfiguredSecretInput(authOverride?.password ?? cfg.gateway?.auth?.password, cfg.secrets?.defaults);
	const hasSharedSecret = resolvedAuthMode === "token" && tokenConfigured || resolvedAuthMode === "password" && passwordConfigured;
	const authHints = [];
	if (miskeys.hasGatewayToken) authHints.push("Found \"gateway.token\" in config. Use \"gateway.auth.token\" instead.");
	if (miskeys.hasRemoteToken) authHints.push("\"gateway.remote.token\" is for remote CLI calls; it does not enable local gateway auth.");
	if (resolvedAuthMode === "password" && !passwordConfigured) {
		defaultRuntime.error([
			"Gateway auth is set to password, but no password is configured.",
			"Set gateway.auth.password (or OPENCLAW_GATEWAY_PASSWORD), or pass --password.",
			...authHints
		].filter(Boolean).join("\n"));
		defaultRuntime.exit(EXIT_CONFIG_ERROR);
		return;
	}
	if (resolvedAuthMode === "none") gatewayLog.warn("Gateway auth mode=none explicitly configured; all gateway connections are unauthenticated.");
	const healthHost = await resolveGatewayBindHost(bind, cfg.gateway?.customBindHost);
	if (shouldBlockGatewayBindWithoutExplicitAuth({
		bindHost: healthHost,
		hasSharedSecret,
		resolvedAuthMode
	})) {
		defaultRuntime.error([
			`Refusing to bind gateway to ${bind} without auth.`,
			...isContainerEnvironment() ? ["Container environment detected — the gateway defaults to bind=auto (0.0.0.0) for port-forwarding compatibility.", "Set OPENCLAW_GATEWAY_TOKEN or OPENCLAW_GATEWAY_PASSWORD, or pass --token/--password to start with auth."] : ["Set gateway.auth.token/password (or OPENCLAW_GATEWAY_TOKEN/OPENCLAW_GATEWAY_PASSWORD) or pass --token/--password."],
			...authHints
		].filter(Boolean).join("\n"));
		defaultRuntime.exit(EXIT_CONFIG_ERROR);
		return;
	}
	const tailscaleOverride = tailscaleMode ? { mode: tailscaleMode } : void 0;
	gatewayLog.info("starting...");
	startupTrace.mark("cli.gateway-loop");
	let startupConfigSnapshotReadForNextStart = startupConfigSnapshotRead;
	const envSidecarStartupMode = isTruthyEnvValue(process.env.OPENCLAW_SKIP_CHANNELS) || isTruthyEnvValue(process.env.OPENCLAW_SKIP_PROVIDERS) ? "defer" : "start";
	let crashLoopDecision;
	let channelAutostartSuppression;
	let activeBootId;
	const tryRecoverChannelAutostartSuppression = () => {
		const decision = inspectGatewayCrashLoopBreaker(process.env);
		if (!decision.recovered || decision.uncleanBoots !== 0) return false;
		const recoveredBootId = recordGatewayCrashLoopRecovery(activeBootId, process.env);
		if (!recoveredBootId) return false;
		activeBootId = recoveredBootId;
		gatewayLog.info("gateway restart-loop breaker recovered; channel auto-start restored");
		return true;
	};
	const beginBoot = async (startedAtMs) => {
		crashLoopDecision = inspectGatewayCrashLoopBreaker(process.env, startedAtMs);
		const bootStartReason = crashLoopDecision.tripped ? crashLoopDecision.shouldWriteStabilityBundle ? GATEWAY_CRASH_LOOP_BREAKER_REASON : void 0 : crashLoopDecision.recovered ? GATEWAY_CRASH_LOOP_RECOVERED_REASON : void 0;
		activeBootId = recordGatewayBootStart(process.env, startedAtMs, bootStartReason);
		channelAutostartSuppression = void 0;
		if (crashLoopDecision.recovered) gatewayLog.info("gateway restart-loop breaker recovered; channel auto-start restored");
		if (!crashLoopDecision.tripped) return;
		const message = `gateway restart-loop breaker tripped: ${crashLoopDecision.uncleanBoots} unclean boot(s) within ${crashLoopDecision.windowMs}ms; suppressing channel/provider account auto-start. Inspect the stability bundle and fix the startup crash before restarting the service. ${formatGatewayCrashLoopManualChannelStartHint()}`;
		channelAutostartSuppression = {
			reason: "crash-loop-breaker",
			message
		};
		gatewayLog.error(message);
		if (crashLoopDecision.shouldWriteStabilityBundle) await maybeWriteGatewayStartupFailureBundle(new Error(message), GATEWAY_CRASH_LOOP_BREAKER_REASON);
	};
	const completeBoot = (completion) => {
		completeGatewayBootLifecycle(activeBootId, completion, process.env);
		activeBootId = void 0;
	};
	const startLoop = async () => await runGatewayLoop({
		runtime: defaultRuntime,
		ownsProcessLifecycle: true,
		lockPort: port,
		healthHost,
		beginBoot,
		completeBoot,
		start: async ({ startupStartedAt, requestHotReloadRecovery } = {}) => {
			const startupConfigSnapshotReadForThisStart = startupConfigSnapshotReadForNextStart;
			startupConfigSnapshotReadForNextStart = void 0;
			return await startGatewayServer(port, {
				bind,
				...activeBootId ? { bootId: activeBootId } : {},
				auth: authOverride,
				tailscale: tailscaleOverride,
				startupStartedAt,
				...requestHotReloadRecovery ? { hotReloadRecovery: requestHotReloadRecovery } : {},
				...startupConfigSnapshotReadForThisStart ? { startupConfigSnapshotRead: startupConfigSnapshotReadForThisStart } : {},
				...envSidecarStartupMode !== "start" ? { sidecarStartup: envSidecarStartupMode } : {},
				...channelAutostartSuppression ? { channelAutostartSuppression } : {},
				...channelAutostartSuppression ? { tryRecoverChannelAutostartSuppression } : {},
				ambientEnvTriggers
			});
		}
	});
	const { detectRespawnSupervisor } = await import("./supervisor-markers-HvJn4q-H.js");
	const supervisor = detectRespawnSupervisor(process.env);
	try {
		await runGatewayLoopWithSupervisedLockRecovery({
			startLoop,
			supervisor,
			port,
			healthHost,
			log: gatewayLog,
			probeHealth: createConfiguredGatewayHealthProbe(cfg)
		});
	} catch (err) {
		if (isGatewayLockError(err)) {
			const errMessage = formatErrorMessage(err);
			defaultRuntime.error(`Gateway failed to start: ${errMessage}\nIf the gateway is supervised, stop it with: ${formatCliCommand("openclaw gateway stop")}`);
			try {
				const [{ formatPortDiagnostics }, { inspectPortUsage }] = await Promise.all([import("./ports-format-C8KjBLXT.js"), import("./ports-inspect-JDWfmwLI.js")]);
				const diagnostics = await inspectPortUsage(port);
				if (diagnostics.status === "busy") for (const line of formatPortDiagnostics(diagnostics)) defaultRuntime.error(line);
			} catch {}
			const { maybeExplainGatewayServiceStop } = await import("./shared-B3y9L9QD.js");
			await maybeExplainGatewayServiceStop();
			defaultRuntime.exit(resolveGatewayLockErrorExitCode(err));
			return;
		}
		if (isInvalidConfigError(err)) throw err;
		if (findOpenClawAgentDatabaseMediaMigrationRequiredError(err)) try {
			const { parkCurrentLaunchAgentForMaintenance } = await import("./launchd-B1zWqbhb.js");
			if (await parkCurrentLaunchAgentForMaintenance()) gatewayLog.error(`gateway requires offline media migration; parked the managed LaunchAgent. Run ${formatCliCommand("openclaw doctor --fix")} to repair and restart it.`);
		} catch (parkError) {
			gatewayLog.error(`failed to park the managed LaunchAgent after migration-required startup: ${formatErrorMessage(parkError)}`);
		}
		if (findOpenClawStateDatabaseSchemaMigrationRequiredError(err)) try {
			const { parkCurrentLaunchAgentForMaintenance } = await import("./launchd-B1zWqbhb.js");
			if (await parkCurrentLaunchAgentForMaintenance()) gatewayLog.error(`gateway requires state database schema migration; parked the managed LaunchAgent. Run ${formatCliCommand("openclaw doctor --fix")} to repair and restart it.`);
		} catch (parkError) {
			gatewayLog.error(`failed to park the managed LaunchAgent after state schema migration-required startup: ${formatErrorMessage(parkError)}`);
		}
		await maybeWriteGatewayStartupFailureBundle(err);
		defaultRuntime.error(`Gateway failed to start: ${formatErrorMessage(err)}. Run ${formatCliCommand("openclaw gateway status --deep")} for diagnostics.`);
		defaultRuntime.exit(resolveGatewayStartupFailureExitCode(err));
	}
}
/** Run foreground Gateway startup with one consent-gated invalid-config repair attempt. */
async function runGatewayCommand(opts, hooks = {}, recoveryDeps) {
	try {
		await runGatewayCommandOnce(opts, hooks);
	} catch (error) {
		if (!isInvalidConfigError(error)) throw error;
		defaultRuntime.error(`Gateway failed to start: ${formatErrorMessage(error)}`);
		if (opts.allowUnconfigured || !isDoctorRecoverableInvalidConfigError(error)) {
			defaultRuntime.exit(EXIT_CONFIG_ERROR);
			return;
		}
		const { offerInvalidConfigRecovery } = await import("./invalid-config-recovery-BAQc393e.js");
		if ((await offerInvalidConfigRecovery({
			runtime: defaultRuntime,
			deps: recoveryDeps,
			retry: async () => await runGatewayCommandOnce(opts, hooks)
		})).status === "recovered") return;
		defaultRuntime.exit(EXIT_CONFIG_ERROR);
	}
}
const testing = {
	createConfiguredGatewayHealthProbe,
	isGatewayHealthzResponse,
	normalizeGatewayHealthProbeHost,
	probeGatewayHealthz,
	resolveGatewayLockErrorExitCode,
	resolveGatewayStartupFailureExitCode,
	runGatewayLoopWithSupervisedLockRecovery
};
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.gatewayRunTestApi")] = testing;
//#endregion
export { runGatewayCommand };
