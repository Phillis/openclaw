import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import "./src-BntaCZM-.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { r as parseTcpPortFromArgs } from "./tcp-port-C3gLZtJi.js";
import { _ as resolveGatewayPort, p as resolveConfigPathCandidate, w as resolveStateDir } from "./paths-BBSTUjD5.js";
import { t as formatCliCommand } from "./command-format-HwSAdvXB.js";
import { a as writeRuntimeJson, r as defaultRuntime } from "./runtime-LRpY2Icg.js";
import { S as createConfigIO, a as readBestEffortConfig, l as readConfigFileSnapshotForWrite } from "./io-DlN5njvP.js";
import { t as parseDurationMs } from "./parse-duration-CuuCHKpt.js";
import { i as formatExternalSupervisorActionRequired, o as isGatewayExternallySupervised, r as assertGatewayServiceMutationAllowed, s as resolveGatewayServiceMutationError } from "./gateway-supervision-C0L8fX98.js";
import { r as theme } from "./theme-vjDs9tao.js";
import "./config-B2bSneS2.js";
import { a as readActiveGatewayLockPort, i as readActiveGatewayLockIdentity, r as isSameGatewayLockIdentity } from "./gateway-lock-G9roAjek.js";
import { n as findInstalledSystemdGatewayScope } from "./systemd-scope-Dt6qzIxA.js";
import { i as resolveOpenClawWrapperPath, t as OPENCLAW_WRAPPER_ENV_KEY } from "./program-args-DPGT6RM4.js";
import { t as buildGatewayInstallPlan } from "./daemon-install-helpers-B0Xkgy-u.js";
import { i as resolveBunRuntimeInfo } from "./runtime-paths-BWwciIgl.js";
import { i as resolveGatewayDaemonRuntime } from "./daemon-runtime-DMPJy4HP.js";
import { t as resolveGatewayInstallToken } from "./gateway-install-token-CpV7IZtu.js";
import { f as resolveLaunchAgentLabel, t as assertNoSystemLaunchDaemonOwnership } from "./launchd-system-4KAEGLKr.js";
import { g as launchAgentPlistExists, p as formatLaunchAgentGuiSessionError, s as repairLaunchAgentBootstrap } from "./launchd-DLjWImVd.js";
import { n as probePortUsage } from "./ports-probe-hhQ4vd04.js";
import { n as mergeGatewayServiceEnv, t as resolveGatewayServiceProbeHosts } from "./gateway-service-probe-hosts-Cnn-HT7z.js";
import { i as terminateStaleGatewayPids } from "./restart-stale-pids-g_celehk.js";
import { a as restartSystemdService, g as resolveManagedGatewayServiceCommand, h as hasGatewayServiceLauncherOverride, p as hasGatewayServiceEnvironmentDifference, s as stopSystemdService } from "./systemd-fY9j-7P4.js";
import { n as formatGatewayServiceStartRepairIssues, o as resolveGatewayService } from "./service-BR9ZQQM7.js";
import { n as formatGatewayPidList, r as signalVerifiedGatewayPidSync, t as findVerifiedGatewayListenerPidsOnPortSync } from "./gateway-processes-DEnCr0sT.js";
import { h as createNullWriter, l as renderGatewayServiceStartHints, m as createDaemonActionContext, s as parsePortFromArgs } from "./shared-AtIdcOsw.js";
import { t as mergeInstallInvocationEnv } from "./install-b4UHtMIw.js";
import { n as isRestartEnabled } from "./commands.flags-CZN5Wwe1.js";
import { s as callGatewayCli } from "./call-Bwn2P4nz.js";
import { Cm as GATEWAY_SERVER_CAPS } from "./src-4dv5TpeQ.js";
import { n as probeGateway } from "./probe-BacF_Vdh.js";
import { a as writeGatewayRestartIntentSync, t as clearGatewayRestartIntentSync } from "./restart-intent-B5BUJHU-.js";
import { u as resolveGatewayRestartDeferralTimeoutMs } from "./restart-Znvaw4so.js";
import { n as NON_INTERACTIVE_GATEWAY_STOP_MESSAGE, r as isTerminalInteractive } from "./terminal-interactivity-DXUXAq5U.js";
import { a as appendGatewayLifecycleAudit, i as runServiceUninstall, n as runServiceStart, o as createGatewayLifecycleMutationAudit, r as runServiceStop, t as runServiceRestart } from "./lifecycle-core-DFuIjMuC.js";
import { a as renderRestartDiagnostics, i as renderGatewayPortHealthDiagnostics, n as waitForGatewayHealthyRestart, o as DEFAULT_RESTART_HEALTH_ATTEMPTS, r as waitForGatewayHealthyListener } from "./restart-health-riU8q_VE.js";
import path from "node:path";
//#region src/cli/daemon-cli/launchd-recovery.ts
const LAUNCH_AGENT_RECOVERY_MESSAGE = "Gateway LaunchAgent was installed but not loaded; re-bootstrapped launchd service.";
/** Re-bootstrap an installed but unloaded LaunchAgent after a daemon start/restart command. */
async function recoverInstalledLaunchAgent(params) {
	if (process.platform !== "darwin") return null;
	const env = params.env ?? process.env;
	await assertNoSystemLaunchDaemonOwnership(resolveLaunchAgentLabel(env));
	if (!await launchAgentPlistExists(env).catch(() => false)) return null;
	const repaired = await repairLaunchAgentBootstrap({ env }).catch(() => ({
		ok: false,
		status: "bootstrap-failed"
	}));
	if (!repaired.ok) {
		if (repaired.status === "system-launchdaemon-conflict" || repaired.status === "system-launchdaemon-unverifiable") throw new Error(repaired.detail);
		if (repaired.status === "gui-session-unavailable") {
			const actionHint = params.result === "started" ? "openclaw gateway start" : "openclaw gateway restart";
			throw new Error(formatLaunchAgentGuiSessionError({
				detail: repaired.detail,
				domain: repaired.domain,
				actionHint
			}));
		}
		return null;
	}
	return {
		result: params.result,
		loaded: true,
		message: LAUNCH_AGENT_RECOVERY_MESSAGE
	};
}
//#endregion
//#region src/cli/daemon-cli/lifecycle-safe-restart.ts
function formatSafeRestartWarnings(result) {
	return result.preflight.blockers.length === 0 ? void 0 : [result.preflight.summary];
}
function resolveGatewayRestartIntentOptions(opts) {
	if (opts.force && opts.wait !== void 0) throw new Error("--force cannot be combined with --wait");
	if (opts.force) return { force: true };
	return opts.wait === void 0 ? void 0 : { waitMs: parseDurationMs(opts.wait) };
}
async function runSafeGatewayRestart(opts, target) {
	if (opts.force) throw new Error("--safe cannot be combined with --force; omit --safe to force restart now");
	if (opts.wait !== void 0) throw new Error("--safe cannot be combined with --wait; safe restart uses gateway deferral");
	const skipDeferral = opts.skipDeferral === true;
	const params = { reason: "gateway.restart.safe" };
	if (target) {
		params.safe = true;
		params.target = {
			pid: target.pid,
			ownerId: target.ownerId,
			port: target.port
		};
	}
	if (skipDeferral) params.skipDeferral = true;
	const result = await callGatewayCli({
		method: "gateway.restart.request",
		params,
		...target ? {
			ignoreEnvUrlOverride: true,
			localPortOverride: target.port,
			requiredCapabilities: [GATEWAY_SERVER_CAPS.GATEWAY_RESTART_TARGET_SAFE]
		} : {},
		timeoutMs: 1e4
	});
	if (target && result.restart.pid !== target.pid) throw new Error("invalid safe restart acknowledgement");
	appendGatewayLifecycleAudit({
		action: "restart",
		source: "safe-rpc",
		mode: result.status,
		pid: result.restart.pid
	});
	const message = result.status === "coalesced" ? "safe restart request joined an existing pending gateway restart" : result.status === "deferred" ? "safe restart requested; gateway will restart after active work drains (bounded wait; may force after the timeout expires)" : skipDeferral ? "safe restart requested; gateway bypassing active-work deferral; shutdown may still wait for pending replies to drain" : "safe restart requested; gateway will restart momentarily";
	const payload = {
		ok: true,
		result: result.status,
		message,
		preflight: result.preflight,
		restart: result.restart,
		warnings: formatSafeRestartWarnings(result)
	};
	if (opts.json) writeRuntimeJson(defaultRuntime, payload);
	else {
		defaultRuntime.log(message);
		if (result.preflight.blockers.length > 0) defaultRuntime.log(theme.warn(result.preflight.summary));
	}
	return true;
}
//#endregion
//#region src/cli/daemon-cli/start-repair.ts
const GATEWAY_TARGET_ENV_KEYS = [
	"HOME",
	"USERPROFILE",
	"OPENCLAW_HOME",
	"OPENCLAW_PROFILE",
	"OPENCLAW_STATE_DIR",
	"OPENCLAW_CONFIG_PATH",
	"OPENCLAW_GATEWAY_PORT"
];
function resolveInstalledGatewayTargetEnvironment(existingEnvironment) {
	const installedEnv = {};
	for (const key of GATEWAY_TARGET_ENV_KEYS) {
		const value = existingEnvironment?.[key]?.trim();
		if (value) installedEnv[key] = value;
	}
	return installedEnv;
}
function normalizeTargetPath(value) {
	const resolved = path.resolve(value);
	return process.platform === "win32" ? resolved.toLowerCase() : resolved;
}
function assertGatewayRepairTargetMatches(params) {
	const installedEnv = resolveInstalledGatewayTargetEnvironment(params.existingEnvironment);
	const installedStateOverride = installedEnv.OPENCLAW_STATE_DIR?.trim();
	const installedHome = installedEnv.OPENCLAW_HOME?.trim() || installedEnv.HOME?.trim() || installedEnv.USERPROFILE?.trim();
	if (!installedStateOverride && !installedHome) throw new Error(`Refusing to repair the managed Gateway service because its installed state directory cannot be determined from the service definition. Run \`openclaw gateway install --force\` to replace it intentionally.`);
	const installedStateDir = resolveStateDir(installedEnv);
	const installedConfigPath = resolveConfigPathCandidate(installedEnv);
	const ambientStateDir = resolveStateDir(process.env);
	const ambientConfigPath = resolveConfigPathCandidate(process.env);
	const ambientPort = resolveGatewayPort(params.config, process.env);
	const sameConfigPath = normalizeTargetPath(installedConfigPath) === normalizeTargetPath(ambientConfigPath);
	const installedPort = params.installedPort ?? (sameConfigPath ? resolveGatewayPort(params.config, installedEnv) : null);
	const differences = [];
	for (const [name, installed, ambient] of [[
		"OPENCLAW_STATE_DIR",
		installedStateDir,
		ambientStateDir
	], [
		"OPENCLAW_CONFIG_PATH",
		installedConfigPath,
		ambientConfigPath
	]]) if (normalizeTargetPath(installed) !== normalizeTargetPath(ambient)) differences.push({
		name,
		installed,
		ambient
	});
	if (installedPort !== null && installedPort !== ambientPort) differences.push({
		name: "gateway.port",
		installed: String(installedPort),
		ambient: String(ambientPort)
	});
	if (differences.length === 0) return installedPort ?? ambientPort;
	const details = differences.map(({ name, installed, ambient }) => `- ${name}: installed=${JSON.stringify(installed)}, ambient=${JSON.stringify(ambient)}`).join("\n");
	throw new Error(`Refusing to repair the managed Gateway service because the current invocation targets a different Gateway:\n${details}\nRun \`openclaw gateway ${params.action}\` with the installed state directory, config path, and port (or unset conflicting environment overrides). To retarget intentionally, run \`openclaw gateway install --force\`.`);
}
async function repairLoadedGatewayServiceForStart(params) {
	assertGatewayServiceMutationAllowed("repair the gateway service");
	if (hasGatewayServiceLauncherOverride(params.state.command) || hasGatewayServiceEnvironmentDifference(params.state.command, GATEWAY_TARGET_ENV_KEYS)) {
		const unitName = path.basename(params.state.command?.sourcePath ?? "<unit>");
		throw new Error(`Refusing to repair the managed Gateway service because a systemd drop-in overrides its command, working directory, or Gateway target environment. Inspect the unit with \`systemctl --user cat ${unitName}\`, then update or remove the operator-owned drop-in before retrying.`);
	}
	const managedCommand = resolveManagedGatewayServiceCommand(params.state.command);
	const { snapshot: configSnapshot, writeOptions: configWriteOptions } = await readConfigFileSnapshotForWrite();
	const cfg = configSnapshot.valid ? configSnapshot.sourceConfig : configSnapshot.config;
	const existingEnvironment = managedCommand?.environment;
	const existingEnvironmentValueSources = managedCommand?.environmentValueSources;
	const installedPort = parseTcpPortFromArgs(managedCommand?.programArguments);
	const port = assertGatewayRepairTargetMatches({
		action: params.action ?? "start",
		config: cfg,
		existingEnvironment,
		installedPort
	});
	const installEnv = mergeInstallInvocationEnv({
		env: process.env,
		existingServiceEnv: existingEnvironment
	});
	const wrapperPath = await resolveOpenClawWrapperPath(installEnv[OPENCLAW_WRAPPER_ENV_KEY]);
	const installedRuntimePath = resolveGatewayDaemonRuntime(managedCommand?.programArguments) === "bun" ? managedCommand?.programArguments[0] : void 0;
	const runtime = installedRuntimePath && (await resolveBunRuntimeInfo(installedRuntimePath)).supported ? "bun" : "node";
	const tokenResolution = await resolveGatewayInstallToken({
		config: cfg,
		configSnapshot,
		configWriteOptions,
		env: installEnv,
		autoGenerateWhenMissing: true,
		persistGeneratedToken: true
	});
	if (tokenResolution.unavailableReason) throw new Error(tokenResolution.unavailableReason);
	const warnings = [formatGatewayServiceStartRepairIssues(params.issues), ...tokenResolution.warnings].filter((warning) => warning.trim().length > 0);
	if (!params.json) {
		defaultRuntime.log("Gateway service definition needs repair:");
		for (const warning of warnings) defaultRuntime.log(`- ${warning}`);
	}
	const { programArguments, workingDirectory, environment, environmentValueSources } = await buildGatewayInstallPlan({
		env: installEnv,
		port,
		runtime,
		runtimePath: runtime === "bun" ? installedRuntimePath : void 0,
		wrapperPath,
		existingEnvironment,
		existingEnvironmentValueSources,
		config: cfg,
		warn: (message) => {
			warnings.push(message);
			if (!params.json) defaultRuntime.log(`- ${message}`);
		}
	});
	await params.service.install({
		env: installEnv,
		stdout: params.stdout,
		warn: params.warn,
		programArguments,
		workingDirectory,
		environment,
		environmentValueSources
	});
	let loaded;
	try {
		loaded = await params.service.isLoaded({ env: installEnv });
	} catch {
		loaded = true;
	}
	return {
		result: params.action === "restart" ? "restarted" : "started",
		message: params.action === "restart" ? "Gateway service definition repaired and restarted." : "Gateway service definition repaired and started. Reopen the Control UI with `openclaw dashboard` or copy a fresh auth URL with `openclaw dashboard --no-open`.",
		warnings: warnings.length ? warnings : void 0,
		loaded
	};
}
//#endregion
//#region src/cli/daemon-cli/lifecycle.ts
const POST_RESTART_HEALTH_ATTEMPTS = DEFAULT_RESTART_HEALTH_ATTEMPTS;
const POST_RESTART_HEALTH_DELAY_MS = 500;
const WINDOWS_POST_RESTART_HEALTH_TIMEOUT_MS = 18e4;
function postRestartHealthAttempts() {
	return process.platform === "win32" ? Math.ceil(WINDOWS_POST_RESTART_HEALTH_TIMEOUT_MS / POST_RESTART_HEALTH_DELAY_MS) : POST_RESTART_HEALTH_ATTEMPTS;
}
function formatRestartFailure(params) {
	if (params.health.waitOutcome === "stopped-free") {
		const elapsedSeconds = Math.max(1, Math.round((params.health.elapsedMs ?? 0) / 1e3));
		return {
			statusLine: `Gateway restart failed after ${elapsedSeconds}s: service stayed stopped and port ${params.port} stayed free.`,
			failMessage: `Gateway restart failed after ${elapsedSeconds}s: service stayed stopped and health checks never came up.`
		};
	}
	const elapsed = params.health.elapsedMs;
	const timeoutSeconds = Math.max(1, Math.round(elapsed === void 0 ? params.defaultTimeoutSeconds : elapsed / 1e3));
	return {
		statusLine: `Timed out after ${timeoutSeconds}s waiting for gateway port ${params.port} to become healthy.`,
		failMessage: `Gateway restart timed out after ${timeoutSeconds}s waiting for health checks.`
	};
}
async function resolveGatewayLifecycleContext(service = resolveGatewayService()) {
	const command = await service.readCommand(process.env).catch(() => null);
	const env = mergeGatewayServiceEnv(process.env, command);
	const config = await createConfigIO({
		env,
		observe: false,
		pluginValidation: "skip",
		suppressFutureVersionWarning: true
	}).readBestEffortConfig().catch(() => void 0);
	return {
		port: parsePortFromArgs(command?.programArguments) ?? resolveGatewayPort(config, env),
		env,
		command
	};
}
async function resolveGatewayPortFallback() {
	return resolveGatewayPort(await readBestEffortConfig({ observe: false }).catch(() => void 0), process.env);
}
async function resolveExplicitGatewayConfigPort() {
	return (await readBestEffortConfig({ observe: false }).catch(() => void 0))?.gateway?.port;
}
async function assertUnmanagedGatewayRestartEnabled(port) {
	const probe = await probeGateway({
		url: `${(await readBestEffortConfig({ observe: false }).catch(() => void 0))?.gateway?.tls?.enabled ? "wss" : "ws"}://127.0.0.1:${port}`,
		auth: {
			token: normalizeOptionalString(process.env.OPENCLAW_GATEWAY_TOKEN),
			password: normalizeOptionalString(process.env.OPENCLAW_GATEWAY_PASSWORD)
		},
		timeoutMs: 1e3
	}).catch(() => null);
	if (!probe?.ok) return;
	if (!isRestartEnabled(probe.configSnapshot)) throw new Error("Gateway restart is disabled in the running gateway config (commands.restart=false); unmanaged SIGUSR1 restart would be ignored");
}
function resolveVerifiedGatewayListenerPids(port) {
	return findVerifiedGatewayListenerPidsOnPortSync(port).filter((pid) => Number.isFinite(pid) && pid > 0);
}
async function handleSystemScopeSystemdGateway(action) {
	if (process.platform !== "linux") return null;
	const installed = await findInstalledSystemdGatewayScope(process.env).catch(() => null);
	if (installed?.scope !== "system") return null;
	const stdout = createNullWriter();
	if (action === "stop") {
		await stopSystemdService({
			stdout,
			env: process.env,
			onMutation: createGatewayLifecycleMutationAudit({ action: "stop" })
		});
		return {
			result: "stopped",
			message: `Gateway stopped via system-scope systemd unit ${installed.unitName}.`
		};
	}
	await restartSystemdService({
		stdout,
		env: process.env,
		onMutation: createGatewayLifecycleMutationAudit({ action: "restart" })
	});
	return {
		result: "restarted",
		message: `Gateway restarted via system-scope systemd unit ${installed.unitName}.`
	};
}
async function stopGatewayWithoutServiceManager(port, lockOwnerPid, serviceContext) {
	const managed = await handleSystemScopeSystemdGateway("stop");
	if (managed) return managed;
	const listenerPids = resolveVerifiedGatewayListenerPids(port);
	const pids = listenerPids.length > 0 ? listenerPids : lockOwnerPid ? [lockOwnerPid] : [];
	if (pids.length === 0) {
		const portUsage = await probePortUsage(port, await resolveGatewayServiceProbeHosts(serviceContext ?? {}));
		if (portUsage !== "free") throw new Error(portUsage === "busy" ? `Port ${port} is in use but the owning process could not be identified. Run ${formatCliCommand("openclaw gateway status --deep")} to diagnose.` : `Could not determine whether port ${port} is still in use, so the gateway cannot be confirmed stopped. Run ${formatCliCommand("openclaw gateway status --deep")} to diagnose.`);
		return null;
	}
	for (const pid of pids) {
		signalVerifiedGatewayPidSync(pid, "SIGTERM");
		appendGatewayLifecycleAudit({
			action: "stop",
			source: "cli",
			mode: "sigterm",
			pid
		});
	}
	return {
		result: "stopped",
		message: `Gateway stop signal sent to unmanaged process${pids.length === 1 ? "" : "es"} on port ${port}: ${formatGatewayPidList(pids)}.`
	};
}
async function resolveRestartListenerHealthWait(restartIntent) {
	let drainTimeoutMs;
	if (restartIntent?.force) drainTimeoutMs = 0;
	else if (typeof restartIntent?.waitMs === "number" && Number.isFinite(restartIntent.waitMs)) drainTimeoutMs = restartIntent.waitMs > 0 ? Math.floor(restartIntent.waitMs) : void 0;
	else drainTimeoutMs = resolveGatewayRestartDeferralTimeoutMs();
	const replacementHealthAttempts = postRestartHealthAttempts();
	if (drainTimeoutMs === void 0) return {
		attempts: replacementHealthAttempts,
		waitIndefinitelyForPreviousOwner: true,
		timeoutSeconds: Math.round(replacementHealthAttempts * POST_RESTART_HEALTH_DELAY_MS / 1e3)
	};
	const attempts = replacementHealthAttempts + Math.ceil(drainTimeoutMs / POST_RESTART_HEALTH_DELAY_MS);
	return {
		attempts,
		waitIndefinitelyForPreviousOwner: false,
		timeoutSeconds: Math.round(attempts * POST_RESTART_HEALTH_DELAY_MS / 1e3)
	};
}
async function signalGatewayRestart(port, params) {
	if (params.enforceRestartConfig) await assertUnmanagedGatewayRestartEnabled(port);
	const pids = resolveVerifiedGatewayListenerPids(port);
	if (pids.length === 0) return null;
	if (pids.length > 1) throw new Error(`multiple gateway processes are listening on port ${port}: ${formatGatewayPidList(pids)}; use "openclaw gateway status --deep" before retrying restart`);
	const pid = expectDefined(pids[0], "pids entry at 0");
	const isWindows = process.platform === "win32";
	const requiresTargetedDelivery = params.requireLockIdentity === true || isWindows;
	const previousLockIdentity = requiresTargetedDelivery ? await readActiveGatewayLockIdentity() : void 0;
	if (requiresTargetedDelivery && (!previousLockIdentity || previousLockIdentity.pid !== pid || previousLockIdentity.port !== port)) throw new Error(`gateway lock identity does not match the verified listener on port ${port}; refusing an ambiguous restart`);
	const intentWritten = previousLockIdentity?.ownerId ? false : writeGatewayRestartIntentSync({
		targetPid: pid,
		reason: "gateway.restart",
		...params.restartIntent ? { intent: params.restartIntent } : {}
	});
	if (requiresTargetedDelivery && !previousLockIdentity?.ownerId && !intentWritten) throw new Error("failed to persist the gateway restart intent");
	try {
		if (previousLockIdentity) {
			const currentLockIdentity = await readActiveGatewayLockIdentity();
			if (!currentLockIdentity || !isSameGatewayLockIdentity(previousLockIdentity, currentLockIdentity)) throw new Error(`gateway lock owner changed before the restart request could be delivered on port ${port}`);
		}
		if (previousLockIdentity?.ownerId) {
			const result = await callGatewayCli({
				method: "gateway.restart.request",
				params: {
					reason: "gateway.restart",
					target: {
						pid,
						ownerId: previousLockIdentity.ownerId,
						port
					},
					...params.restartIntent ? { restartIntent: params.restartIntent } : {}
				},
				localPortOverride: port,
				ignoreEnvUrlOverride: true,
				timeoutMs: 1e4
			});
			expectDefined(result.pid === pid ? result : void 0, "invalid restart acknowledgement");
		} else if (isWindows) await callGatewayCli({
			method: "gateway.restart.request",
			params: {
				reason: "gateway.restart",
				skipDeferral: true
			},
			localPortOverride: port,
			ignoreEnvUrlOverride: true,
			timeoutMs: 1e4
		});
		else signalVerifiedGatewayPidSync(pid, "SIGUSR1");
	} catch (err) {
		if (intentWritten) clearGatewayRestartIntentSync();
		throw err;
	}
	appendGatewayLifecycleAudit({
		action: "restart",
		source: params.auditSource,
		mode: previousLockIdentity?.ownerId || isWindows ? "rpc" : "sigusr1",
		pid
	});
	return {
		result: "restarted",
		pid,
		previousLockIdentity,
		message: `Gateway restart request sent to ${params.processLabel} process on port ${port}: ${pid}.`
	};
}
async function restartUnmanaged(port, intent, allowSystem = true) {
	const managed = allowSystem ? await handleSystemScopeSystemdGateway("restart") : null;
	if (managed) return managed;
	return await signalGatewayRestart(port, {
		restartIntent: intent,
		enforceRestartConfig: true,
		processLabel: "unmanaged",
		auditSource: "cli"
	});
}
function isGatewaySignalRestartResult(result) {
	return result !== null && "pid" in result && typeof result.pid === "number";
}
async function runExternalSupervisorRestart(opts) {
	const { emit, fail } = createDaemonActionContext({
		action: "restart",
		json: Boolean(opts.json)
	});
	const restartIntent = resolveGatewayRestartIntentOptions(opts);
	const lockIdentity = await readActiveGatewayLockIdentity().catch(() => void 0);
	if (!lockIdentity?.ownerId) {
		fail("Gateway restart failed: the active Gateway lock predates targeted restart ownership; update the running Gateway before retrying");
		return false;
	}
	if (opts.safe) return await runSafeGatewayRestart(opts, {
		...lockIdentity,
		ownerId: lockIdentity.ownerId
	});
	let signaled;
	try {
		signaled = await signalGatewayRestart(lockIdentity.port, {
			restartIntent,
			enforceRestartConfig: false,
			processLabel: "externally supervised",
			requireLockIdentity: true,
			auditSource: "supervisor"
		});
	} catch (err) {
		fail(`Gateway restart failed: ${String(err)}`);
		return false;
	}
	if (!signaled) {
		fail(`No verified gateway process is listening on port ${lockIdentity.port}. ${formatExternalSupervisorActionRequired("start the gateway")}`);
		return false;
	}
	const healthWait = await resolveRestartListenerHealthWait(restartIntent);
	const health = await waitForGatewayHealthyListener({
		port: lockIdentity.port,
		attempts: healthWait.attempts,
		delayMs: POST_RESTART_HEALTH_DELAY_MS,
		previousLockIdentity: signaled.previousLockIdentity,
		waitIndefinitelyForPreviousOwner: healthWait.waitIndefinitelyForPreviousOwner
	});
	if (!health.healthy) {
		fail(`Gateway restart timed out after ${healthWait.timeoutSeconds}s waiting for health checks.`, renderGatewayPortHealthDiagnostics(health));
		return false;
	}
	emit({
		ok: true,
		result: signaled.result,
		message: signaled.message
	});
	if (!opts.json) defaultRuntime.log(signaled.message);
	return true;
}
/** Uninstall the managed Gateway service after stopping it. */
async function runDaemonUninstall(opts = {}) {
	assertGatewayServiceMutationAllowed("uninstall the gateway service");
	return await runServiceUninstall({
		serviceNoun: "Gateway",
		service: resolveGatewayService(),
		opts,
		stopBeforeUninstall: true,
		assertNotLoadedAfterUninstall: true
	});
}
/** Start the managed Gateway service, repairing stale service definitions when possible. */
async function runDaemonStart(opts = {}) {
	assertGatewayServiceMutationAllowed("start the gateway");
	const service = resolveGatewayService();
	const expectedPort = await resolveExplicitGatewayConfigPort();
	return await runServiceStart({
		serviceNoun: "Gateway",
		service,
		renderStartHints: renderGatewayServiceStartHints,
		onNotLoaded: process.platform === "darwin" ? async () => {
			const recovered = await recoverInstalledLaunchAgent({ result: "started" });
			if (recovered) appendGatewayLifecycleAudit({
				action: "start",
				source: "cli",
				mode: "launchd-bootstrap"
			});
			return recovered;
		} : void 0,
		repairLoadedService: async ({ json, stdout, warn, state, issues }) => await repairLoadedGatewayServiceForStart({
			service,
			json,
			stdout,
			warn,
			state,
			issues
		}),
		expectedPort,
		opts
	});
}
/** Stop the managed Gateway service or verified unmanaged listener fallback. */
async function runDaemonStop(opts = {}) {
	if (!isTerminalInteractive() && !opts.force) {
		const { fail } = createDaemonActionContext({
			action: "stop",
			json: Boolean(opts.json)
		});
		fail(NON_INTERACTIVE_GATEWAY_STOP_MESSAGE);
		return;
	}
	assertGatewayServiceMutationAllowed("stop the gateway");
	const service = resolveGatewayService();
	return await runServiceStop({
		serviceNoun: "Gateway",
		service,
		opts,
		stopWhenNotLoaded: process.platform === "darwin" && Boolean(opts.disable),
		onNotLoaded: async ({ stdout }) => {
			if (process.platform === "linux") {
				if ((await service.readRuntime(process.env).catch(() => null))?.status === "running") {
					await service.stop({
						env: process.env,
						stdout,
						onMutation: createGatewayLifecycleMutationAudit({ action: "stop" })
					});
					return { result: "stopped" };
				}
			}
			const lock = await readActiveGatewayLockIdentity().catch(() => void 0);
			const ctx = lock ? null : await resolveGatewayLifecycleContext(service).catch(() => null);
			return await stopGatewayWithoutServiceManager(lock?.port ?? ctx?.port ?? await resolveGatewayPortFallback(), lock?.pid, ctx ?? void 0);
		}
	});
}
/** Restart the Gateway service or a verified unmanaged listener, then prove health. */
async function runDaemonRestart(opts = {}) {
	if (opts.skipDeferral && !opts.safe) throw new Error("--skip-deferral requires --safe");
	if (isGatewayExternallySupervised()) return await runExternalSupervisorRestart(opts);
	if (opts.safe) return await runSafeGatewayRestart(opts);
	const jsonOutput = Boolean(opts.json);
	const service = resolveGatewayService();
	let restartedWithoutServiceManager = false;
	let unmanagedPreviousLockIdentity;
	const restartIntent = resolveGatewayRestartIntentOptions(opts);
	const configuredPort = await resolveExplicitGatewayConfigPort();
	let managedRestartContext = await resolveGatewayLifecycleContext(service).catch(async () => ({
		port: await resolveGatewayPortFallback(),
		env: process.env
	}));
	let managedRestartPort = configuredPort ?? managedRestartContext.port;
	const unmanagedPort = await readActiveGatewayLockPort().catch(() => void 0) ?? managedRestartPort;
	const restartHealthAttempts = postRestartHealthAttempts();
	const restartWaitMs = restartHealthAttempts * POST_RESTART_HEALTH_DELAY_MS;
	const restartWaitSeconds = Math.round(restartWaitMs / 1e3);
	let unmanagedRestartHealthAttempts = restartHealthAttempts;
	let unmanagedRestartWaitIndefinitely = false;
	let unmanagedRestartWaitSeconds = restartWaitSeconds;
	return await runServiceRestart({
		serviceNoun: "Gateway",
		service,
		renderStartHints: renderGatewayServiceStartHints,
		opts: {
			...opts,
			...restartIntent ? { restartIntent } : {}
		},
		checkTokenDrift: true,
		expectedPort: configuredPort,
		beforeServiceMutation: () => assertGatewayServiceMutationAllowed("restart the gateway"),
		repairLoadedService: async ({ json, stdout, warn, state, issues }) => {
			const result = await repairLoadedGatewayServiceForStart({
				action: "restart",
				service,
				json,
				stdout,
				warn,
				state,
				issues
			});
			managedRestartContext = await resolveGatewayLifecycleContext(service);
			managedRestartPort = configuredPort ?? managedRestartContext.port;
			return result;
		},
		onNotLoaded: async () => {
			const mutationError = resolveGatewayServiceMutationError("restart the gateway");
			if (process.platform === "darwin" && !mutationError) {
				const recovered = await recoverInstalledLaunchAgent({ result: "restarted" });
				if (recovered) {
					appendGatewayLifecycleAudit({
						action: "restart",
						source: "cli",
						mode: "launchd-bootstrap"
					});
					return recovered;
				}
			}
			const handled = await restartUnmanaged(unmanagedPort, restartIntent, !mutationError);
			if (handled) {
				restartedWithoutServiceManager = true;
				if (isGatewaySignalRestartResult(handled) && handled.previousLockIdentity) {
					unmanagedPreviousLockIdentity = handled.previousLockIdentity;
					const healthWait = await resolveRestartListenerHealthWait(restartIntent);
					unmanagedRestartHealthAttempts = healthWait.attempts;
					unmanagedRestartWaitIndefinitely = healthWait.waitIndefinitelyForPreviousOwner;
					unmanagedRestartWaitSeconds = healthWait.timeoutSeconds;
				}
				return handled;
			}
			if (mutationError) throw mutationError;
			return null;
		},
		postRestartCheck: async ({ warnings, fail, stdout, warn }) => {
			if (restartedWithoutServiceManager) {
				const health = await waitForGatewayHealthyListener({
					port: unmanagedPort,
					attempts: unmanagedRestartHealthAttempts,
					delayMs: POST_RESTART_HEALTH_DELAY_MS,
					...unmanagedPreviousLockIdentity ? {
						previousLockIdentity: unmanagedPreviousLockIdentity,
						waitIndefinitelyForPreviousOwner: unmanagedRestartWaitIndefinitely
					} : {}
				});
				if (health.healthy) return;
				const diagnostics = renderGatewayPortHealthDiagnostics(health);
				const timeoutLine = `Timed out after ${unmanagedRestartWaitSeconds}s waiting for gateway port ${unmanagedPort} to become healthy.`;
				if (!jsonOutput) {
					defaultRuntime.log(theme.warn(timeoutLine));
					for (const line of diagnostics) defaultRuntime.log(theme.muted(line));
				} else {
					warnings.push(timeoutLine);
					warnings.push(...diagnostics);
				}
				fail(`Gateway restart timed out after ${unmanagedRestartWaitSeconds}s waiting for health checks.`, [formatCliCommand("openclaw gateway status --deep"), formatCliCommand("openclaw doctor")]);
				throw new Error("unreachable after gateway restart health failure");
			}
			let health = await waitForGatewayHealthyRestart({
				service,
				port: managedRestartPort,
				attempts: restartHealthAttempts,
				delayMs: POST_RESTART_HEALTH_DELAY_MS,
				env: managedRestartContext.env,
				includeUnknownListenersAsStale: process.platform === "win32",
				supervisorKeepsAlive: process.platform === "darwin"
			});
			if (!health.healthy && health.staleGatewayPids.length > 0) {
				const staleMsg = `Found stale gateway process(es): ${health.staleGatewayPids.join(", ")}.`;
				warnings.push(staleMsg);
				if (!jsonOutput) {
					defaultRuntime.log(theme.warn(staleMsg));
					defaultRuntime.log(theme.muted("Stopping stale process(es) and retrying restart..."));
				}
				await terminateStaleGatewayPids(health.staleGatewayPids);
				const retryRestart = await service.restart({
					env: process.env,
					stdout,
					warn,
					onMutation: createGatewayLifecycleMutationAudit({ action: "restart" })
				});
				if (retryRestart.outcome === "scheduled") return retryRestart;
				health = await waitForGatewayHealthyRestart({
					service,
					port: managedRestartPort,
					attempts: restartHealthAttempts,
					delayMs: POST_RESTART_HEALTH_DELAY_MS,
					env: managedRestartContext.env,
					includeUnknownListenersAsStale: process.platform === "win32",
					supervisorKeepsAlive: process.platform === "darwin"
				});
			}
			if (health.healthy) return;
			const diagnostics = renderRestartDiagnostics(health);
			const failure = formatRestartFailure({
				health,
				port: managedRestartPort,
				defaultTimeoutSeconds: restartWaitSeconds
			});
			const runningNoPortLine = health.runtime.status === "running" && health.portUsage.status === "free" ? `Gateway process is running but port ${managedRestartPort} is still free (startup hang/crash loop or very slow VM startup).` : null;
			if (!jsonOutput) {
				defaultRuntime.log(theme.warn(failure.statusLine));
				if (runningNoPortLine) defaultRuntime.log(theme.warn(runningNoPortLine));
				for (const line of diagnostics) defaultRuntime.log(theme.muted(line));
			} else {
				warnings.push(failure.statusLine);
				if (runningNoPortLine) warnings.push(runningNoPortLine);
				warnings.push(...diagnostics);
			}
			fail(failure.failMessage, [formatCliCommand("openclaw gateway status --deep"), formatCliCommand("openclaw doctor")]);
			throw new Error("unreachable after gateway restart failure");
		}
	});
}
//#endregion
export { recoverInstalledLaunchAgent as a, runDaemonUninstall as i, runDaemonStart as n, runDaemonStop as r, runDaemonRestart as t };
