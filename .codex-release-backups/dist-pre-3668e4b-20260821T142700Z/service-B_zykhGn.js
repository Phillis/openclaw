import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { n as parseTcpPort, r as parseTcpPortFromArgs } from "./tcp-port-B2WBWiMZ.js";
import { l as readConfigFileSnapshot } from "./io-BTBpQ7uO.js";
import { r as assertGatewayServiceMutationAllowed } from "./gateway-supervision-Cr5lTl_D.js";
import { h as resolveFutureConfigActionBlock, m as formatFutureConfigActionBlock } from "./config-env-vars-C1wvGC4M.js";
import "./config-CfeGo4K4.js";
import { _ as readSystemdServiceExecStart, a as restartSystemdService, d as stageSystemdService, f as uninstallSystemdService, n as readSystemdServiceRuntime, o as startSystemdService, p as findInstalledSystemdGatewayScope, s as stopSystemdService, t as isSystemdServiceEnabled, u as installSystemdService } from "./systemd-uvTpBsgP.js";
import { b as readLaunchAgentProgramArguments, c as restartLaunchAgent, d as stageLaunchAgent, f as uninstallLaunchAgent, h as isLaunchAgentLoaded, l as startLaunchAgent, m as isLaunchAgentEnabled, o as stopLaunchAgent, u as installLaunchAgent, y as readLaunchAgentRuntime } from "./launchd-CC10rjho.js";
import { n as mergeGatewayServiceEnv } from "./gateway-service-probe-hosts-CuhnKFyM.js";
import { f as readScheduledTaskCommand, i as restartScheduledTask, l as isScheduledTaskInstalled, n as stageScheduledTask, o as startScheduledTask, r as uninstallScheduledTask, s as stopScheduledTask, t as installScheduledTask, u as readScheduledTaskRuntime } from "./schtasks-BSKE595j.js";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
//#region src/daemon/future-config-guard.ts
/** Prevents daemon write actions when the config belongs to a newer OpenClaw. */
async function readFutureConfigActionBlock(action) {
	try {
		return resolveFutureConfigActionBlock({
			action,
			snapshot: await readConfigFileSnapshot()
		});
	} catch {
		return null;
	}
}
async function assertFutureConfigActionAllowed(action) {
	const block = await readFutureConfigActionBlock(action);
	if (block) throw new Error(formatFutureConfigActionBlock(block));
}
//#endregion
//#region src/daemon/service.ts
/** Platform service registry and shared gateway service start/repair logic. */
function ignoreServiceWriteResult(write) {
	return async (args) => {
		await write(args);
	};
}
const TEMP_PROGRAM_ROOTS = [
	os.tmpdir(),
	"/tmp",
	"/private/tmp",
	"/var/tmp"
].map((entry) => path.resolve(entry));
function pathIsSameOrChild(candidate, parent) {
	return candidate === parent || candidate.startsWith(`${parent}${path.sep}`);
}
function isTemporaryProgramPath(value) {
	if (!value || !path.isAbsolute(value)) return false;
	const resolved = path.resolve(value);
	return TEMP_PROGRAM_ROOTS.some((root) => pathIsSameOrChild(resolved, root));
}
function isMissingProgramPath(value) {
	if (!value || !path.isAbsolute(value)) return false;
	return !fs.existsSync(value);
}
function collectGatewayServiceStartRepairIssues(state, expectedPort) {
	const command = state.command;
	if (!state.loaded || !command) return [];
	const issues = [];
	const servicePort = parseTcpPortFromArgs(command.programArguments) ?? parseTcpPort(command.environment?.OPENCLAW_GATEWAY_PORT ?? "");
	if (expectedPort !== void 0 && servicePort !== null && servicePort !== expectedPort) issues.push({
		code: "port-mismatch",
		message: `service port ${servicePort} does not match current gateway config port ${expectedPort}`
	});
	for (const candidate of command.programArguments.slice(0, 2)) {
		if (isTemporaryProgramPath(candidate)) {
			issues.push({
				code: "temporary-program",
				message: `service command points at a temporary path: ${candidate}`
			});
			continue;
		}
		if (isMissingProgramPath(candidate)) issues.push({
			code: "missing-program",
			message: `service command points at a missing path: ${candidate}`
		});
	}
	return issues;
}
/** Reads the installed service and reports definition drift that must be repaired before launch. */
async function inspectGatewayServiceStartRepair(service, args, expectedPort) {
	const state = await readGatewayServiceState(service, args);
	return {
		state,
		issues: collectGatewayServiceStartRepairIssues(state, expectedPort)
	};
}
function formatGatewayServiceStartRepairIssues(issues) {
	return issues.map((issue) => issue.message).join("; ");
}
async function readGatewayServiceState(service, args = {}) {
	const baseEnv = args.env ?? process.env;
	const command = await service.readCommand(baseEnv).catch(() => null);
	const env = mergeGatewayServiceEnv(baseEnv, command);
	args.validateEnvBeforeStatusRead?.(env);
	const [loaded, runtime] = await Promise.all([service.isLoaded({
		env,
		timeoutMs: args.timeoutMs
	}).catch(() => false), service.readRuntime(env, { timeoutMs: args.timeoutMs }).catch((error) => ({
		status: "unknown",
		detail: String(error)
	}))]);
	return {
		installed: command !== null,
		loaded,
		running: runtime?.status === "running",
		env,
		command,
		runtime
	};
}
async function startGatewayService(service, args, expectedPort) {
	const { state, issues: repairIssues } = await inspectGatewayServiceStartRepair(service, { env: args.env }, expectedPort);
	if (!state.loaded && !state.installed) return {
		outcome: "missing-install",
		state
	};
	if (state.loaded && state.running) return {
		outcome: "already-running",
		state,
		issues: repairIssues
	};
	if (repairIssues.length > 0) return {
		outcome: "repair-required",
		state,
		issues: repairIssues
	};
	let nextState;
	try {
		await service.start({
			...args,
			env: state.env
		});
		nextState = await readGatewayServiceState(service, { env: state.env });
	} catch (err) {
		const recoveryState = await readGatewayServiceState(service, { env: state.env });
		if (!recoveryState.installed) return {
			outcome: "missing-install",
			state: recoveryState
		};
		throw err;
	}
	const runtime = nextState.runtime;
	const failedState = normalizeLowercaseStringOrEmpty(runtime?.state) === "failed";
	const newFailedExit = runtime?.status === "stopped" && typeof runtime.lastExitStatus === "number" && runtime.lastExitStatus !== 0 && runtime.lastExitStatus !== state.runtime?.lastExitStatus;
	if (failedState || newFailedExit) {
		const failure = failedState ? "state failed" : `exit ${runtime?.lastExitStatus}`;
		throw new Error(`Service failed to start (${failure}). Check the service logs and retry.`);
	}
	return {
		outcome: "started",
		state: nextState
	};
}
function describeGatewayServiceRestart(serviceNoun, result) {
	if (result.outcome === "scheduled") return {
		scheduled: true,
		daemonActionResult: "scheduled",
		message: `restart scheduled, ${normalizeLowercaseStringOrEmpty(serviceNoun)} will restart momentarily`,
		progressMessage: `${serviceNoun} service restart scheduled.`
	};
	return {
		scheduled: false,
		daemonActionResult: "restarted",
		message: `${serviceNoun} service restarted.`,
		progressMessage: `${serviceNoun} service restarted.`
	};
}
function createUnsupportedGatewayServiceError() {
	return /* @__PURE__ */ new Error(`Gateway service install not supported on ${process.platform}`);
}
async function rejectUnsupportedGatewayService() {
	throw createUnsupportedGatewayServiceError();
}
function createUnsupportedGatewayService() {
	return {
		label: "Gateway service",
		loadedText: "available",
		notLoadedText: "not installed",
		stage: rejectUnsupportedGatewayService,
		install: rejectUnsupportedGatewayService,
		uninstall: rejectUnsupportedGatewayService,
		start: rejectUnsupportedGatewayService,
		stop: rejectUnsupportedGatewayService,
		restart: rejectUnsupportedGatewayService,
		isLoaded: rejectUnsupportedGatewayService,
		readCommand: async () => null,
		readRuntime: async () => ({
			status: "unknown",
			detail: createUnsupportedGatewayServiceError().message
		})
	};
}
const GATEWAY_SERVICE_REGISTRY = {
	darwin: {
		label: "LaunchAgent",
		loadedText: "loaded",
		notLoadedText: "not loaded",
		stage: ignoreServiceWriteResult(stageLaunchAgent),
		install: ignoreServiceWriteResult(installLaunchAgent),
		uninstall: uninstallLaunchAgent,
		start: startLaunchAgent,
		stop: stopLaunchAgent,
		restart: restartLaunchAgent,
		isLoaded: isLaunchAgentLoaded,
		isEnabled: isLaunchAgentEnabled,
		readCommand: readLaunchAgentProgramArguments,
		readRuntime: readLaunchAgentRuntime
	},
	linux: {
		label: "systemd user",
		loadedText: "enabled",
		notLoadedText: "disabled",
		stage: ignoreServiceWriteResult(stageSystemdService),
		install: ignoreServiceWriteResult(installSystemdService),
		uninstall: uninstallSystemdService,
		start: startSystemdService,
		stop: stopSystemdService,
		restart: restartSystemdService,
		isLoaded: isSystemdServiceEnabled,
		hasInstalledDefinition: async ({ env }) => await findInstalledSystemdGatewayScope(env ?? process.env) !== null,
		readCommand: readSystemdServiceExecStart,
		readRuntime: readSystemdServiceRuntime
	},
	win32: {
		label: "Scheduled Task",
		loadedText: "registered",
		notLoadedText: "missing",
		stage: ignoreServiceWriteResult(stageScheduledTask),
		install: ignoreServiceWriteResult(installScheduledTask),
		uninstall: uninstallScheduledTask,
		start: startScheduledTask,
		stop: stopScheduledTask,
		restart: restartScheduledTask,
		isLoaded: isScheduledTaskInstalled,
		readCommand: readScheduledTaskCommand,
		readRuntime: readScheduledTaskRuntime
	}
};
function guardGatewayServiceMutation(action, mutate) {
	return async (args) => {
		assertGatewayServiceMutationAllowed(action, process.env);
		if (args.env && args.env !== process.env) assertGatewayServiceMutationAllowed(action, args.env);
		await assertFutureConfigActionAllowed(action);
		return await mutate(args);
	};
}
function withGatewayServiceMutationGuards(service) {
	return {
		...service,
		stage: guardGatewayServiceMutation("rewrite the gateway service", service.stage),
		install: guardGatewayServiceMutation("install or rewrite the gateway service", service.install),
		uninstall: guardGatewayServiceMutation("uninstall the gateway service", service.uninstall),
		start: guardGatewayServiceMutation("start the gateway service", service.start),
		stop: guardGatewayServiceMutation("stop the gateway service", service.stop),
		restart: guardGatewayServiceMutation("restart the gateway service", service.restart)
	};
}
function isSupportedGatewayServicePlatform(platform) {
	return Object.hasOwn(GATEWAY_SERVICE_REGISTRY, platform);
}
function resolveGatewayService() {
	if (isSupportedGatewayServicePlatform(process.platform)) return withGatewayServiceMutationGuards(GATEWAY_SERVICE_REGISTRY[process.platform]);
	return createUnsupportedGatewayService();
}
//#endregion
export { resolveGatewayService as a, readGatewayServiceState as i, formatGatewayServiceStartRepairIssues as n, startGatewayService as o, inspectGatewayServiceStartRepair as r, describeGatewayServiceRestart as t };
