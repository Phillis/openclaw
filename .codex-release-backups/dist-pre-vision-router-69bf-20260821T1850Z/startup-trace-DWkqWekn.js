import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { n as isTruthyEnvValue } from "./env-uyT2Z2BT.js";
import { r as resolveHomeRelativePath } from "./home-dir-DcrXWQPU.js";
import { r as resolveProfileStateDir, t as isValidProfileName } from "./profile-utils-Bm_90Gp7.js";
import { d as resolveGatewaySystemdServiceName, f as resolveGatewayWindowsTaskName, s as resolveGatewayLaunchAgentLabel } from "./constants-B4HhnyPv.js";
import { n as consumeRootOptionToken } from "./cli-root-options-CpQG4BXe.js";
import { f as isSimpleCommandHelpInvocation, n as getCommandPathWithRootOptions } from "./argv-ubyZhwcH.js";
import { t as resolveCliArgvInvocation } from "./argv-invocation-DZhkFMuY.js";
import { a as scanCliRootOptions, i as takeCliRootOptionValue } from "./container-target-BxmLKL0n.js";
import process$1 from "node:process";
import os from "node:os";
import path from "node:path";
//#region src/cli/precomputed-help.ts
const PRECOMPUTED_COMMAND_HELP_NAMES = /* @__PURE__ */ new Set([
	"browser",
	"secrets",
	"nodes"
]);
const PRECOMPUTED_SUBCOMMAND_HELP_COMMANDS = /* @__PURE__ */ new Set([
	"doctor",
	"gateway",
	"models",
	"plugins",
	"sessions",
	"tasks"
]);
const HELP_FLAGS = /* @__PURE__ */ new Set(["-h", "--help"]);
const VERSION_FLAGS = /* @__PURE__ */ new Set(["-V", "--version"]);
const loadRootHelpLiveConfigModule = async () => await import("./root-help-live-config-DLFpCf-w.js");
const loadRootHelpMetadataModule = async () => await import("./root-help-metadata-Oxd_25lt.js");
function isPrecomputedSubcommandHelpName(value) {
	return PRECOMPUTED_SUBCOMMAND_HELP_COMMANDS.has(value);
}
function resolvePrecomputedSubcommandHelpCommand(argv) {
	const args = argv.slice(2);
	let commandName = null;
	let sawHelp = false;
	for (let index = 0; index < args.length; index += 1) {
		const arg = args[index];
		if (!arg || arg === "--") return null;
		if (VERSION_FLAGS.has(arg)) return null;
		if (!commandName) {
			const consumed = consumeRootOptionToken(args, index);
			if (consumed > 0) {
				index += consumed - 1;
				continue;
			}
			if (arg.startsWith("-") || !isPrecomputedSubcommandHelpName(arg)) return null;
			commandName = arg;
			continue;
		}
		if (HELP_FLAGS.has(arg)) {
			sawHelp = true;
			continue;
		}
		return null;
	}
	return commandName && sawHelp ? commandName : null;
}
function resolvePrecomputedCommandHelpName(argv) {
	if (!isSimpleCommandHelpInvocation(argv, PRECOMPUTED_COMMAND_HELP_NAMES)) return null;
	const commandPath = getCommandPathWithRootOptions(argv, 2);
	if (commandPath.length !== 1) return null;
	const [commandName] = commandPath;
	return commandName === "browser" || commandName === "secrets" || commandName === "nodes" ? commandName : null;
}
async function tryOutputPrecomputedCommandHelp(argv, deps = {}) {
	const env = deps.env ?? process.env;
	if (env.OPENCLAW_DISABLE_CLI_STARTUP_HELP_FAST_PATH === "1") return false;
	const commandName = resolvePrecomputedCommandHelpName(argv);
	const subcommandName = commandName ? null : resolvePrecomputedSubcommandHelpCommand(argv);
	if (subcommandName) return (deps.outputPrecomputedSubcommandHelpText ?? (await loadRootHelpMetadataModule()).outputPrecomputedSubcommandHelpText)(subcommandName);
	if (!commandName) return false;
	if (commandName === "nodes") {
		if (await (deps.loadRootHelpRenderOptionsForConfigSensitivePlugins ?? (await loadRootHelpLiveConfigModule()).loadRootHelpRenderOptionsForConfigSensitivePlugins)(env)) return false;
	}
	if (commandName === "browser") return (deps.outputPrecomputedBrowserHelpText ?? (await loadRootHelpMetadataModule()).outputPrecomputedBrowserHelpText)();
	if (commandName === "secrets") return (deps.outputPrecomputedSecretsHelpText ?? (await loadRootHelpMetadataModule()).outputPrecomputedSecretsHelpText)();
	return (deps.outputPrecomputedNodesHelpText ?? (await loadRootHelpMetadataModule()).outputPrecomputedNodesHelpText)();
}
//#endregion
//#region src/cli/profile.ts
function parseCliProfileArgs(argv) {
	let profile = null;
	let sawDev = false;
	const scanned = scanCliRootOptions(argv, ({ arg, args, index, out }) => {
		if (arg === "--dev") {
			if (resolveCliArgvInvocation(out).primary === "gateway") {
				out.push(arg);
				return { kind: "handled" };
			}
			if (profile && profile !== "dev") return {
				kind: "error",
				error: "Cannot combine --dev with --profile"
			};
			sawDev = true;
			profile = "dev";
			return { kind: "handled" };
		}
		if (arg === "--profile" || arg.startsWith("--profile=")) {
			const next = args[index + 1];
			const { value, consumedNext } = takeCliRootOptionValue(arg, next);
			const [primary, secondary] = resolveCliArgvInvocation(out).commandPath;
			if (primary === "qa" && secondary === "matrix") {
				out.push(arg);
				if (consumedNext && next !== void 0) out.push(next);
				return {
					kind: "handled",
					consumedNext
				};
			}
			if (sawDev) return {
				kind: "error",
				error: "Cannot combine --dev with --profile"
			};
			if (!value) return {
				kind: "error",
				error: "--profile requires a value"
			};
			if (!isValidProfileName(value)) return {
				kind: "error",
				error: "Invalid --profile (use letters, numbers, \"_\", \"-\" only)"
			};
			profile = value;
			return {
				kind: "handled",
				consumedNext
			};
		}
		return { kind: "pass" };
	});
	if (!scanned.ok) return scanned;
	return {
		ok: true,
		profile,
		argv: scanned.argv
	};
}
function applyCliProfileEnv(params) {
	const env = params.env ?? process.env;
	const homedir = params.homedir ?? os.homedir;
	const profile = params.profile.trim();
	if (!profile) return;
	const inheritedProfile = normalizeOptionalString(env.OPENCLAW_PROFILE) ?? "default";
	const existingStateDir = normalizeOptionalString(env.OPENCLAW_STATE_DIR);
	const existingConfigPath = normalizeOptionalString(env.OPENCLAW_CONFIG_PATH);
	const profileEnv = env;
	const inheritedProfileStateDir = resolveProfileStateDir(inheritedProfile, profileEnv, homedir);
	const selectedProfileStateDir = resolveProfileStateDir(profile, profileEnv, homedir);
	const switchesInheritedProfile = inheritedProfileStateDir !== selectedProfileStateDir;
	const switchesInheritedProfileState = Boolean(existingStateDir && switchesInheritedProfile && resolveHomeRelativePath(existingStateDir, {
		env,
		homedir
	}) === inheritedProfileStateDir);
	const replacesInheritedProfileConfig = Boolean(switchesInheritedProfile && (!existingStateDir || switchesInheritedProfileState) && existingConfigPath && resolveHomeRelativePath(existingConfigPath, {
		env,
		homedir
	}) === path.join(inheritedProfileStateDir, "openclaw.json"));
	env.OPENCLAW_PROFILE = profile;
	const stateDir = existingStateDir && !switchesInheritedProfileState ? existingStateDir : selectedProfileStateDir;
	if (!existingStateDir || switchesInheritedProfileState) env.OPENCLAW_STATE_DIR = stateDir;
	if (!existingConfigPath || replacesInheritedProfileConfig) env.OPENCLAW_CONFIG_PATH = path.join(stateDir, "openclaw.json");
	if (switchesInheritedProfile) {
		const inheritedSystemdServiceName = resolveGatewaySystemdServiceName(inheritedProfile);
		const inheritedServiceIdentities = {
			OPENCLAW_LAUNCHD_LABEL: [resolveGatewayLaunchAgentLabel(inheritedProfile)],
			OPENCLAW_SYSTEMD_UNIT: [inheritedSystemdServiceName, `${inheritedSystemdServiceName}.service`],
			OPENCLAW_WINDOWS_TASK_NAME: [resolveGatewayWindowsTaskName(inheritedProfile)]
		};
		for (const [key, inheritedValues] of Object.entries(inheritedServiceIdentities)) {
			const activeValue = normalizeOptionalString(env[key]);
			if (activeValue && inheritedValues.includes(activeValue)) delete env[key];
		}
	}
	if (profile === "dev" && !env.OPENCLAW_GATEWAY_PORT?.trim()) env.OPENCLAW_GATEWAY_PORT = "19001";
}
//#endregion
//#region src/cli/startup-trace.ts
const CLI_STARTUP_TIMELINE_PHASE = "cli.startup";
function hasDiagnosticsTimelinePath(env) {
	return Boolean(env.OPENCLAW_DIAGNOSTICS_TIMELINE_PATH?.trim());
}
function createGatewayDispatchStartupTrace(argv, source) {
	const enabled = isTruthyEnvValue(process$1.env.OPENCLAW_GATEWAY_STARTUP_TRACE) && argv.slice(2).includes("gateway");
	const started = performance.now();
	let last = started;
	let lineFormatter = null;
	let pendingMessages = [];
	const timelineModule = hasDiagnosticsTimelinePath(process$1.env) ? import("./diagnostics-timeline-CL-NV6fv.js").catch(() => null) : null;
	let timelineActivation = timelineModule ? "unknown" : "disabled";
	let timelineConfig;
	let timelineConfigResolved = false;
	const pendingTimelineEvents = [];
	let pendingTimelineWrites = Promise.resolve();
	const timelineName = (name) => `${source}.${name}`;
	const resolveTimelineActivation = async () => {
		if (timelineActivation !== "unknown" || !timelineModule) return timelineActivation;
		const module = await timelineModule;
		if (!module) {
			timelineActivation = "disabled";
			return timelineActivation;
		}
		if (module.isDiagnosticsTimelineEnabled({ env: process$1.env })) {
			timelineActivation = "enabled";
			return timelineActivation;
		}
		if (timelineConfigResolved) timelineActivation = module.isDiagnosticsTimelineEnabled({
			config: timelineConfig,
			env: process$1.env
		}) ? "enabled" : "disabled";
		return timelineActivation;
	};
	const writeTimelineEvent = (module, event) => {
		const commonOptions = {
			...timelineConfig ? { config: timelineConfig } : {},
			env: process$1.env
		};
		if (event.type === "mark") {
			module.emitDiagnosticsTimelineEvent({
				type: "mark",
				name: event.name,
				phase: CLI_STARTUP_TIMELINE_PHASE,
				durationMs: event.durationMs,
				attributes: { totalMs: event.totalMs }
			}, commonOptions);
			return;
		}
		module.emitCompletedDiagnosticsTimelineSpan(event.name, event.durationMs, {
			phase: CLI_STARTUP_TIMELINE_PHASE,
			...commonOptions
		});
	};
	const flushPendingTimelineEvents = async () => {
		const activation = await resolveTimelineActivation();
		if (activation === "unknown") return;
		if (activation === "disabled") {
			pendingTimelineEvents.length = 0;
			return;
		}
		const module = await timelineModule;
		if (!module) {
			pendingTimelineEvents.length = 0;
			return;
		}
		const events = pendingTimelineEvents.splice(0);
		for (const event of events) writeTimelineEvent(module, event);
	};
	const enqueueTimelineEvent = (event) => {
		if (!timelineModule || timelineActivation === "disabled") return;
		if (timelineActivation === "unknown") {
			pendingTimelineEvents.push(event);
			return;
		}
		pendingTimelineWrites = pendingTimelineWrites.then(async () => {
			const module = await timelineModule;
			if (module) writeTimelineEvent(module, event);
		});
	};
	const flushPending = (formatter) => {
		const queued = pendingMessages;
		pendingMessages = [];
		for (const message of queued) process$1.stderr.write(`${formatter(message)}\n`);
	};
	const flushPendingPlainOnExit = () => {
		if (!lineFormatter) flushPending((message) => message);
	};
	if (enabled) process$1.once("exit", flushPendingPlainOnExit);
	const writeMessage = (message) => {
		if (!lineFormatter) {
			pendingMessages.push(message);
			return;
		}
		process$1.stderr.write(`${lineFormatter(message)}\n`);
	};
	const emit = (name, durationMs, totalMs) => {
		if (!enabled) return;
		writeMessage(`[gateway] startup trace: ${source}.${name} ${durationMs.toFixed(1)}ms total=${totalMs.toFixed(1)}ms`);
	};
	return {
		enabled,
		async requiresDiagnosticsConfig() {
			await flushPendingTimelineEvents();
			return timelineActivation === "unknown";
		},
		async configureDiagnosticsTimeline(config) {
			timelineConfig = config;
			timelineConfigResolved = true;
			await flushPendingTimelineEvents();
			await pendingTimelineWrites;
		},
		setLineFormatter(formatter) {
			lineFormatter = formatter;
			process$1.off("exit", flushPendingPlainOnExit);
			flushPending(formatter);
		},
		mark(name) {
			const now = performance.now();
			const durationMs = now - last;
			const totalMs = now - started;
			emit(name, durationMs, totalMs);
			enqueueTimelineEvent({
				type: "mark",
				name: timelineName(name),
				durationMs,
				totalMs
			});
			last = now;
		},
		async measure(name, run, options = {}) {
			const before = performance.now();
			let bufferCompletedTimelineSpan = false;
			let completed = false;
			try {
				if (timelineModule && options.timeline !== false) {
					await flushPendingTimelineEvents();
					const module = await timelineModule;
					if (module && timelineActivation === "enabled") {
						await pendingTimelineWrites;
						return await module.measureDiagnosticsTimelineSpan(timelineName(name), () => Promise.resolve(run()), {
							phase: CLI_STARTUP_TIMELINE_PHASE,
							...timelineConfig ? { config: timelineConfig } : {},
							env: process$1.env
						});
					}
					bufferCompletedTimelineSpan = timelineActivation === "unknown";
				}
				const result = await run();
				completed = true;
				return result;
			} finally {
				const now = performance.now();
				if (bufferCompletedTimelineSpan && completed) enqueueTimelineEvent({
					type: "span",
					name: timelineName(name),
					durationMs: now - before
				});
				emit(name, now - before, now - started);
				last = now;
			}
		}
	};
}
async function configureGatewayStartupTraceConsoleFormatting(trace) {
	if (!trace.enabled) return;
	const { formatConsoleDiagnosticLine } = await import("./json-console-line-BVGe0_he.js");
	trace.setLineFormatter((message) => formatConsoleDiagnosticLine({
		level: "info",
		message
	}));
}
//#endregion
export { tryOutputPrecomputedCommandHelp as a, parseCliProfileArgs as i, createGatewayDispatchStartupTrace as n, applyCliProfileEnv as r, configureGatewayStartupTraceConsoleFormatting as t };
