import "./utils-Bw16L5tB.js";
import { t as sleep } from "./sleep-D7nua6TP.js";
import { g as resolveNodeLaunchAgentLabel, l as resolveGatewayLaunchAgentLabel, m as resolveGatewayWindowsTaskName, p as resolveGatewaySystemdServiceName } from "./constants-ChqKLfPp.js";
import { _ as resolveGatewayPort, a as isDefaultInstallIdentity } from "./paths-BBSTUjD5.js";
import { t as formatCliCommand } from "./command-format-HwSAdvXB.js";
import { t as ExitError } from "./runtime-LRpY2Icg.js";
import { s as getResolvedLoggerSettings } from "./logger-ij8OHrrv.js";
import { n as NON_DEFAULT_INSTALL_SERVICE_SKIP_REASON } from "./gateway-supervision-C0L8fX98.js";
import { f as isWSL, m as isWSLEnv } from "./undici-runtime-CWs3Ll9x.js";
import "./config-B2bSneS2.js";
import { j as classifySystemdUnavailableDetail } from "./systemd-scope-Dt6qzIxA.js";
import { n as gatewayInstallErrorHint, t as buildGatewayInstallPlan } from "./daemon-install-helpers-B0Xkgy-u.js";
import { n as GATEWAY_DAEMON_RUNTIME_OPTIONS, t as DEFAULT_GATEWAY_DAEMON_RUNTIME } from "./daemon-runtime-DMPJy4HP.js";
import { t as resolveGatewayInstallToken } from "./gateway-install-token-CpV7IZtu.js";
import { _ as resolveGatewayRequiredListenHosts, h as resolveGatewayBindHost } from "./net-DeK7gO-9.js";
import { g as launchAgentPlistExists, h as isLaunchAgentLoaded, s as repairLaunchAgentBootstrap } from "./launchd-DLjWImVd.js";
import { a as isExpectedGatewayListeners, r as formatPortDiagnostics } from "./ports-format-FOKK5FaA.js";
import { n as inspectPortUsage, t as inspectPortConnections } from "./ports-inspect-8eZVwL-B.js";
import { a as readGatewayServiceState, o as resolveGatewayService, t as describeGatewayServiceRestart } from "./service-BR9ZQQM7.js";
import { i as renderSystemdUnavailableHints, r as isSystemdUnavailableDetail, t as buildPlatformRuntimeLogHints } from "./runtime-hints-B9Y8o0pU.js";
import { n as isSystemdCgroupHygieneRisk, r as isSystemdStartLimitHit, t as getSystemdCgroupHygieneSummary } from "./service-runtime-E6hYEM49.js";
import { t as formatRuntimeStatus } from "./runtime-format-DtKf8bRh.js";
import { n as readLastGatewayErrorLine } from "./diagnostics-BAKcur8h.js";
import { n as formatGatewayRestartHandoffDiagnostic, r as readGatewayRestartHandoffSync } from "./restart-handoff-Cn-vtimu.js";
import { r as findSystemGatewayServices } from "./inspect-Dd_Zh1yU.js";
import "./logging-aRZskxqi.js";
import { t as note } from "./note-YH_0kY-3.js";
import { r as formatHealthCheckFailure, t as formatGatewayClosedDiagnostic } from "./health-format-Cx2_DXmn.js";
import { o as healthCommandNonExiting } from "./health-Cd71fzeu.js";
import { a as resolveServiceRepairPolicy, i as isServiceRepairExternallyManaged, n as SERVICE_REPAIR_POLICY_ENV, o as shouldManageGatewayService, r as confirmDoctorServiceRepair, t as EXTERNAL_SERVICE_REPAIR_NOTE } from "./doctor-service-repair-policy-6Ohsg2Q7.js";
//#region src/commands/doctor-format.ts
/** Formatting helpers for gateway runtime summaries and doctor repair hints. */
/** Formats the platform-specific gateway service runtime into a compact status line. */
function formatGatewayRuntimeSummary(runtime) {
	return formatRuntimeStatus(runtime);
}
/** Builds follow-up hints for stopped, missing, or unhealthy gateway service runtimes. */
function buildGatewayRuntimeHints(runtime, options = {}) {
	const hints = [];
	if (!runtime) return hints;
	const platform = options.platform ?? process.platform;
	const env = options.env ?? process.env;
	const fileLog = (() => {
		try {
			return getResolvedLoggerSettings().file;
		} catch {
			return null;
		}
	})();
	if (platform === "linux" && isSystemdUnavailableDetail(runtime.detail)) {
		hints.push(...renderSystemdUnavailableHints({
			wsl: isWSLEnv(env),
			kind: classifySystemdUnavailableDetail(runtime.detail),
			env
		}));
		if (fileLog) hints.push(`File logs: ${fileLog}`);
		return hints;
	}
	if (runtime.cachedLabel && platform === "darwin") {
		const label = resolveGatewayLaunchAgentLabel(env.OPENCLAW_PROFILE);
		hints.push(`LaunchAgent label cached but plist missing. Clear with: launchctl bootout gui/$UID/${label}`);
		hints.push(`Then reinstall: ${formatCliCommand("openclaw gateway install", env)}`);
	}
	if (runtime.missingUnit) {
		hints.push(`Service not installed. Run: ${formatCliCommand("openclaw gateway install", env)}`);
		if (fileLog) hints.push(`File logs: ${fileLog}`);
		return hints;
	}
	if (runtime.missingGuiSession && platform === "darwin") {
		hints.push("LaunchAgent requires a logged-in macOS GUI session; SSH/headless/sudo shells cannot bootstrap gui/$UID.");
		hints.push(`Sign in to the macOS desktop as this user, then run: ${formatCliCommand("openclaw gateway restart", env)}`);
		hints.push("For headless VM setups, enable auto-login for the target user or use a custom LaunchDaemon (not shipped).");
		if (fileLog) hints.push(`File logs: ${fileLog}`);
		return hints;
	}
	if (runtime.missingSupervision && platform === "darwin") {
		hints.push(`LaunchAgent installed but not loaded. Run: ${formatCliCommand("openclaw gateway restart", env)}`);
		if (fileLog) hints.push(`File logs: ${fileLog}`);
		return hints;
	}
	if (runtime.status === "stopped") {
		if (platform === "linux" && isSystemdStartLimitHit(runtime)) hints.push("systemd stopped restarting the gateway after repeated crashes.", `Recover with: ${formatCliCommand("openclaw gateway restart", env)}, then inspect logs if it keeps crashing.`);
		else hints.push("Service is loaded but not running (likely exited immediately).");
		if (fileLog) hints.push(`File logs: ${fileLog}`);
		hints.push(...buildPlatformRuntimeLogHints({
			platform,
			env,
			systemdServiceName: resolveGatewaySystemdServiceName(env.OPENCLAW_PROFILE),
			windowsTaskName: resolveGatewayWindowsTaskName(env.OPENCLAW_PROFILE)
		}));
	}
	if (platform === "linux" && isSystemdCgroupHygieneRisk(runtime.systemd)) {
		const unit = runtime.systemd?.unit ?? `${resolveGatewaySystemdServiceName(env.OPENCLAW_PROFILE)}.service`;
		const summary = getSystemdCgroupHygieneSummary(runtime.systemd);
		if (summary) hints.push(`Systemd cgroup hygiene looks elevated: ${summary}.`, "This usually means old helper or browser processes may still be attached to the gateway service.", `Run: systemctl --user show ${unit} -p KillMode -p TasksCurrent -p MemoryCurrent -p MainPID`, `Run: systemd-cgls --user-unit ${unit}`, `After reviewing service settings, run: ${formatCliCommand("openclaw gateway restart", env)}`);
	}
	return hints;
}
//#endregion
//#region src/commands/doctor-gateway-daemon-flow.ts
/** Doctor gateway daemon repair flow for service install, bootstrap, restart, and port hints. */
function noteGatewayRuntime(serviceRuntime, env) {
	const summary = formatGatewayRuntimeSummary(serviceRuntime);
	const hints = buildGatewayRuntimeHints(serviceRuntime, {
		platform: process.platform,
		env
	});
	const lines = summary ? [`Runtime: ${summary}`, ...hints] : hints;
	if (lines.length > 0) note(lines.join("\n"), "Gateway");
}
async function maybeRepairLaunchAgentBootstrap(params) {
	if (process.platform !== "darwin" || !await launchAgentPlistExists(params.env) || await isLaunchAgentLoaded({ env: params.env })) return { status: "skipped" };
	note("LaunchAgent is installed but not loaded in launchd.", `${params.title} LaunchAgent`);
	if (params.serviceRepairExternal) {
		note(EXTERNAL_SERVICE_REPAIR_NOTE, `${params.title} LaunchAgent`);
		return { status: "not-loaded" };
	}
	if (!await confirmDoctorServiceRepair(params.prompter, {
		message: `Repair ${params.title} LaunchAgent bootstrap now?`,
		initialValue: true
	})) return { status: "not-loaded" };
	params.runtime.log(`Bootstrapping ${params.title} LaunchAgent...`);
	const repair = await repairLaunchAgentBootstrap({ env: params.env });
	if (!repair.ok) {
		if (repair.status === "system-launchdaemon-conflict" || repair.status === "system-launchdaemon-unverifiable") return {
			status: "system-launchdaemon-blocked",
			detail: repair.detail
		};
		if (repair.status === "gui-session-unavailable") return {
			status: "gui-session-unavailable",
			detail: repair.detail
		};
		params.runtime.error(`${params.title} LaunchAgent bootstrap failed: ${repair.detail ?? "unknown error"}`);
		return { status: "not-loaded" };
	}
	if (!await isLaunchAgentLoaded({ env: params.env })) {
		params.runtime.error(`${params.title} LaunchAgent still not loaded after repair.`);
		return { status: "not-loaded" };
	}
	note(`${params.title} LaunchAgent repaired.`, `${params.title} LaunchAgent`);
	return { status: "repaired" };
}
function renderBlockingSystemGatewayServices(services) {
	return [
		"System-level OpenClaw gateway service detected while the user gateway service is not installed.",
		...services.map((svc) => `- ${svc.label} (${svc.detail})`),
		"OpenClaw will not install a second user-level gateway service automatically.",
		"Run `openclaw gateway status --deep` or `openclaw doctor --deep` to inspect duplicate services.",
		`Set ${SERVICE_REPAIR_POLICY_ENV}=external if a system supervisor owns the gateway lifecycle.`
	].join("\n");
}
function renderEstablishedGatewayConnections(connections) {
	return [
		"Established Gateway TCP clients detected:",
		...connections.slice(0, 8).map((connection) => {
			return `- ${connection.pid ? `pid=${connection.pid}` : "pid=?"} ${connection.direction}${connection.command ? ` ${connection.command}` : ""}${connection.address ? ` ${connection.address}` : ""}${connection.commandLine ? ` cmd=${connection.commandLine}` : ""}`;
		}),
		...connections.length > 8 ? [`- ... ${connections.length - 8} more connection(s)`] : [],
		"If logs show protocol mismatch after rollback, stop stale OpenClaw client processes listed here and rerun doctor."
	].join("\n");
}
async function maybeReportEstablishedGatewayClients(cfg, deep, port) {
	if (!deep || cfg.gateway?.mode === "remote") return;
	const clients = (await inspectPortConnections(port ?? resolveGatewayPort(cfg, process.env)).catch(() => null))?.connections.filter(({ direction }) => direction !== "server");
	if (clients?.length) note(renderEstablishedGatewayConnections(clients), "Gateway clients");
}
async function noteGatewayPortDiagnostics(cfg, deep) {
	const port = resolveGatewayPort(cfg, process.env);
	const diagnostics = await inspectPortUsage(port, { probeHosts: resolveGatewayRequiredListenHosts(await resolveGatewayBindHost(cfg.gateway?.bind ?? "loopback", cfg.gateway?.customBindHost)) });
	await maybeReportEstablishedGatewayClients(cfg, deep, port);
	const conflict = diagnostics.status === "busy" && !isExpectedGatewayListeners(diagnostics.listeners, diagnostics.port);
	if (conflict) note(formatPortDiagnostics(diagnostics).join("\n"), "Gateway port");
	return conflict;
}
async function noteGatewayServiceInspectionFailure(loadState) {
	const lines = [`Gateway service status could not be determined: ${loadState.detail}`];
	const kind = process.platform === "linux" && classifySystemdUnavailableDetail(loadState.detail);
	if (kind) lines.push(...renderSystemdUnavailableHints({
		wsl: await isWSL(),
		kind
	}));
	lines.push(`Run ${formatCliCommand("openclaw gateway status --deep")} and retry doctor.`);
	note(lines.join("\n"), "Gateway");
}
/**
* Repairs or diagnoses the local gateway service after the health check fails.
*
* Remote gateway mode is only diagnosed; local mode may bootstrap launchd, install missing
* services, report port conflicts, or restart unhealthy supervision when policy allows.
*/
async function maybeRepairGatewayDaemon(params) {
	if (!isDefaultInstallIdentity(process.env)) {
		note(NON_DEFAULT_INSTALL_SERVICE_SKIP_REASON, "Gateway");
		return;
	}
	if (params.healthOk) {
		await maybeReportEstablishedGatewayClients(params.cfg, params.options.deep ?? false);
		return;
	}
	if (params.healthSkipped && params.cfg.gateway?.mode === "remote") return;
	if (!await shouldManageGatewayService()) {
		if (params.cfg.gateway?.mode !== "remote") await noteGatewayPortDiagnostics(params.cfg, params.options.deep ?? false);
		note(EXTERNAL_SERVICE_REPAIR_NOTE, "Gateway");
		return;
	}
	const serviceRepairPolicy = resolveServiceRepairPolicy();
	const serviceRepairExternal = isServiceRepairExternallyManaged(serviceRepairPolicy);
	const service = resolveGatewayService();
	const restartGatewayService = async () => {
		try {
			return await service.restart({
				env: process.env,
				stdout: process.stdout
			});
		} catch (error) {
			note(`Gateway service restart failed: ${error instanceof Error ? error.message : String(error)}`, "Gateway");
			return null;
		}
	};
	const isLocalDarwinGateway = process.platform === "darwin" && params.cfg.gateway?.mode !== "remote";
	const serviceState = await readGatewayServiceState(service, { env: process.env });
	if (serviceState.loadState.status === "unknown") {
		await noteGatewayServiceInspectionFailure(serviceState.loadState);
		return;
	}
	let loaded = serviceState.loadState.status === "loaded";
	let serviceRuntime = serviceState.runtime;
	const serviceEnv = serviceState.env;
	if (params.options.deep) {
		const handoff = readGatewayRestartHandoffSync(serviceEnv);
		if (handoff) note(formatGatewayRestartHandoffDiagnostic(handoff), "Gateway");
	}
	if (isLocalDarwinGateway) {
		const gatewayRepair = serviceRuntime?.missingGuiSession ? {
			status: "gui-session-unavailable",
			detail: serviceRuntime.detail ?? ""
		} : await maybeRepairLaunchAgentBootstrap({
			env: process.env,
			title: "Gateway",
			runtime: params.runtime,
			prompter: params.prompter,
			serviceRepairExternal
		});
		await maybeRepairLaunchAgentBootstrap({
			env: {
				...process.env,
				OPENCLAW_LAUNCHD_LABEL: resolveNodeLaunchAgentLabel()
			},
			title: "Node",
			runtime: params.runtime,
			prompter: params.prompter,
			serviceRepairExternal
		});
		if (gatewayRepair.status === "not-loaded") return;
		if (gatewayRepair.status === "system-launchdaemon-blocked") {
			note(gatewayRepair.detail, "Gateway");
			return;
		}
		if (gatewayRepair.status === "gui-session-unavailable") serviceRuntime = {
			status: "unknown",
			detail: gatewayRepair.detail || serviceRuntime?.detail,
			missingGuiSession: true
		};
		if (gatewayRepair.status === "repaired") {
			const repairedState = await readGatewayServiceState(service, { env: process.env });
			if (repairedState.loadState.status === "unknown") {
				await noteGatewayServiceInspectionFailure(repairedState.loadState);
				return;
			}
			loaded = repairedState.loadState.status === "loaded";
			serviceRuntime = repairedState.runtime;
		}
	}
	if (isLocalDarwinGateway && serviceRuntime?.systemLaunchDaemon) {
		noteGatewayRuntime(serviceRuntime, process.env);
		return;
	}
	if (params.cfg.gateway?.mode !== "remote") {
		if (!await noteGatewayPortDiagnostics(params.cfg, params.options.deep ?? false) && loaded && serviceRuntime?.status === "running") {
			const lastError = await readLastGatewayErrorLine(process.env);
			if (lastError) note(`Last gateway error: ${lastError}`, "Gateway");
		}
	}
	if (!loaded) {
		if (isLocalDarwinGateway && (serviceRuntime?.missingGuiSession || serviceRuntime?.missingSupervision || serviceRuntime?.cachedLabel || serviceRuntime?.systemLaunchDaemon)) {
			noteGatewayRuntime(serviceRuntime, process.env);
			return;
		}
		note("Gateway service not installed.", "Gateway");
		if (params.cfg.gateway?.mode !== "remote") {
			if (process.platform === "linux") {
				const systemGatewayServices = await findSystemGatewayServices();
				if (systemGatewayServices.length > 0) {
					note(renderBlockingSystemGatewayServices(systemGatewayServices), "Gateway");
					return;
				}
			}
			if (serviceRepairExternal) {
				note(EXTERNAL_SERVICE_REPAIR_NOTE, "Gateway");
				return;
			}
			const install = await confirmDoctorServiceRepair(params.prompter, {
				message: "Install gateway service now?",
				initialValue: true,
				requiresInteractiveConfirmation: true
			}, serviceRepairPolicy);
			if (!install) note(`Run ${formatCliCommand("openclaw gateway install")} when you want to install the gateway service.`, "Gateway");
			if (install) {
				const daemonRuntime = await params.prompter.select({
					message: "Gateway service runtime",
					options: GATEWAY_DAEMON_RUNTIME_OPTIONS,
					initialValue: DEFAULT_GATEWAY_DAEMON_RUNTIME
				}, DEFAULT_GATEWAY_DAEMON_RUNTIME);
				const tokenResolution = await resolveGatewayInstallToken({
					config: params.cfg,
					env: process.env
				});
				for (const warning of tokenResolution.warnings) note(warning, "Gateway");
				if (tokenResolution.unavailableReason) {
					note([
						"Gateway service install aborted.",
						tokenResolution.unavailableReason,
						"Fix gateway auth config/token input and rerun doctor."
					].join("\n"), "Gateway");
					return;
				}
				const port = resolveGatewayPort(params.cfg, process.env);
				const { programArguments, workingDirectory, environment, environmentValueSources } = await buildGatewayInstallPlan({
					env: process.env,
					port,
					runtime: daemonRuntime,
					warn: (message, title) => note(message, title),
					config: params.cfg
				});
				try {
					await service.install({
						env: process.env,
						stdout: process.stdout,
						programArguments,
						workingDirectory,
						environment,
						environmentValueSources
					});
				} catch (err) {
					note(`Gateway service install failed: ${String(err)}`, "Gateway");
					note(gatewayInstallErrorHint(), "Gateway");
				}
			}
		}
		return;
	}
	noteGatewayRuntime(serviceRuntime, process.env);
	if (serviceRuntime?.status !== "running") {
		if (params.healthSkipped && serviceRuntime?.status !== "stopped") return;
		if (serviceRepairExternal) {
			note(EXTERNAL_SERVICE_REPAIR_NOTE, "Gateway");
			return;
		}
		if (await confirmDoctorServiceRepair(params.prompter, {
			message: "Start gateway service now?",
			initialValue: true
		}, serviceRepairPolicy)) {
			const restartResult = await restartGatewayService();
			if (!restartResult) return;
			const restartStatus = describeGatewayServiceRestart("Gateway", restartResult);
			if (!restartStatus.scheduled) await sleep(1500);
			else note(restartStatus.message, "Gateway");
		}
	}
	if (process.platform === "darwin") {
		const label = resolveGatewayLaunchAgentLabel(process.env.OPENCLAW_PROFILE);
		note(`LaunchAgent loaded; stopping requires "${formatCliCommand("openclaw gateway stop")}" or launchctl bootout gui/$UID/${label}.`, "Gateway");
	}
	if (serviceRuntime?.status === "running") {
		if (params.healthSkipped) return;
		if (serviceRepairExternal) {
			note(EXTERNAL_SERVICE_REPAIR_NOTE, "Gateway");
			return;
		}
		if (readGatewayRestartHandoffSync(serviceEnv)) try {
			await healthCommandNonExiting({
				json: false,
				timeoutMs: 1e4
			}, params.runtime);
			note("Gateway is healthy after recent restart; skipping restart prompt.", "Gateway");
			return;
		} catch {}
		if (params.options.nonInteractive === true) return;
		if (await confirmDoctorServiceRepair(params.prompter, {
			message: "Restart gateway service now?",
			initialValue: false
		}, serviceRepairPolicy)) {
			const restartResult = await restartGatewayService();
			if (!restartResult) return;
			const restartStatus = describeGatewayServiceRestart("Gateway", restartResult);
			if (restartStatus.scheduled) {
				note(restartStatus.message, "Gateway");
				return;
			}
			await sleep(1500);
			try {
				await healthCommandNonExiting({
					json: false,
					timeoutMs: 1e4
				}, params.runtime);
			} catch (err) {
				if (err instanceof ExitError) return;
				const closedDiagnostic = formatGatewayClosedDiagnostic(err);
				if (closedDiagnostic) {
					note(closedDiagnostic, "Gateway");
					note(params.gatewayDetailsMessage, "Gateway connection");
				} else params.runtime.error(formatHealthCheckFailure(err));
			}
		}
	}
}
//#endregion
export { maybeRepairGatewayDaemon };
