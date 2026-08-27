import { r as truncateUtf16Safe } from "../utf16-slice-D_ngcYKd.js";
import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "../string-coerce-CIXf7egm.js";
import { i as normalizeEnv, n as isTruthyEnvValue } from "../env-ChWDbSFK.js";
import { u as tryProcessCwd } from "../home-dir-BFvskzn8.js";
import { _ as resolveGatewayPort, w as resolveStateDir } from "../paths-BBSTUjD5.js";
import { a as isValueToken, n as consumeRootOptionToken } from "../cli-root-options-CpQG4BXe.js";
import { B as resolveGatewayCatalogCommandPath, K as getCoreCliCommandDescriptors, R as consumeGatewayFastPathRootOptionToken, V as resolveGatewayRunPreBootstrapOptions, Y as getCoreCliParentDefaultHelpCommands, et as isMachineOutputStdoutTTY, f as isSimpleCommandHelpInvocation, g as normalizeRootNoColorArgv, h as normalizeRootLogLevelArgv, m as normalizeRootHelpTargetArgv, p as normalizeGeneratedHelpCommandArgv, q as getCoreCliCommandNamesCore, s as hasFlag, v as getSubCliEntriesCore, y as getSubCliParentDefaultHelpCommands, z as consumeGatewayRunOptionToken } from "../argv-CCdO9MSu.js";
import { t as resolveCliArgvInvocation } from "../argv-invocation-DXuFeGZ6.js";
import { a as withConsoleLogsRoutedToStderrForJson, i as withConsoleLogsRoutedToStderr, n as hasJsonOutputFlag, r as isJsonOutputModeActive } from "../json-output-mode-XMIkPNjr.js";
import { t as requestExitAfterOneShotOutput } from "../one-shot-exit-CvLNCpcm.js";
import { n as parseCliContainerArgs, t as maybeRunCliInContainer } from "../container-target-DeeG-3q9.js";
import { a as tryOutputPrecomputedCommandHelp, i as parseCliProfileArgs, n as createGatewayDispatchStartupTrace, r as applyCliProfileEnv, t as configureGatewayStartupTraceConsoleFormatting } from "../startup-trace-DYLud0cA.js";
import { t as normalizeWindowsArgv } from "../windows-argv-Dl7Refj1.js";
import { n as sanitizeTerminalText } from "../safe-text-DbwznzfG.js";
import { n as resolveManifestCommandAliasOwnerInRegistry, r as resolveManifestToolOwnerInRegistry } from "../manifest-command-aliases-1m0oXcVG.js";
import { t as assertSupportedRuntime } from "../runtime-guard-xF0n8O8f.js";
import { t as normalizeWebSocketProtocol } from "../websocket-protocol-MDxbNIbL.js";
import { a as isLoopbackAddress, l as isSecureWebSocketUrl } from "../net-DeK7gO-9.js";
import { t as ensureOpenClawCliOnPath } from "../path-env-Bw07juFU.js";
import { a as shouldSkipPluginCommandRegistration, r as shouldRegisterPrimaryCommandOnly, t as isReservedNonPluginCommandRoot } from "../command-registration-policy-ybElENX5.js";
import { n as resolveCliNetworkProxyPolicy, t as resolveCliCommandPathPolicy } from "../command-path-policy-DKqm4ZZQ.js";
import { t as resolveCliStartupPolicy } from "../command-startup-policy-B4oVNNcS.js";
import { t as isUnconfiguredConfigSource } from "../fresh-install-config-DhP5LyQI.js";
import { r as waitForSignalExitBarriers, t as registerSignalExitBarrier } from "../signal-exit-barrier-Bs6DKn5_.js";
import process$1 from "node:process";
import { existsSync } from "node:fs";
import path from "node:path";
//#region src/cli/run-main-policy.ts
const ROOT_HELP_ALIASES = /* @__PURE__ */ new Set(["tools"]);
const SETUP_ONBOARD_CONFIGURE_HELP_COMMANDS = /* @__PURE__ */ new Set([
	"setup",
	"onboard",
	"configure"
]);
const BARE_PARENT_DEFAULT_HELP_COMMANDS = /* @__PURE__ */ new Set([...getCoreCliParentDefaultHelpCommands(), ...getSubCliParentDefaultHelpCommands()]);
function isBareParentDefaultHelpArgv(argv) {
	const invocation = resolveCliArgvInvocation(argv);
	const [primary, extra] = invocation.commandPath;
	return !invocation.hasHelpOrVersion && primary !== void 0 && extra === void 0 ? BARE_PARENT_DEFAULT_HELP_COMMANDS.has(primary) : false;
}
function rewriteUpdateFlagArgv(argv) {
	const updateIndex = argv.indexOf("--update");
	if (updateIndex === -1) return argv;
	for (let i = 2; i < argv.length; i++) {
		const arg = argv[i];
		if (!arg || arg === "--") return argv;
		if (i === updateIndex) {
			const next = [...argv];
			next.splice(updateIndex, 1, "update");
			return next;
		}
		const consumed = consumeRootOptionToken(argv, i);
		if (consumed > 0) {
			i += consumed - 1;
			continue;
		}
		if (!arg.startsWith("-")) return argv;
	}
	return argv;
}
function shouldEnsureCliPath(argv) {
	const invocation = resolveCliArgvInvocation(argv);
	if (invocation.hasHelpOrVersion || shouldHandleBareRoot(argv) || isBareParentDefaultHelpArgv(argv)) return false;
	return resolveCliCommandPathPolicy(invocation.commandPath).ensureCliPath;
}
function shouldUseRootHelpFastPath(argv, env = process.env) {
	const invocation = resolveCliArgvInvocation(argv);
	return env.OPENCLAW_DISABLE_CLI_STARTUP_HELP_FAST_PATH !== "1" && (invocation.isRootHelpInvocation || invocation.commandPath.length === 1 && ROOT_HELP_ALIASES.has(invocation.commandPath[0] ?? "") && invocation.hasHelpOrVersion || invocation.commandPath.length === 1 && invocation.commandPath[0] === "help" && invocation.hasHelpOrVersion);
}
function shouldUseSetupOnboardConfigureHelpFastPath(argv, env = process.env) {
	if (env.OPENCLAW_DISABLE_CLI_STARTUP_HELP_FAST_PATH === "1") return false;
	return isSimpleCommandHelpInvocation(argv, SETUP_ONBOARD_CONFIGURE_HELP_COMMANDS);
}
function shouldHandleBareRoot(argv) {
	const invocation = resolveCliArgvInvocation(argv);
	return invocation.commandPath.length === 0 && !invocation.hasHelpOrVersion;
}
function shouldStartProxyForCli(argv) {
	const policyArgv = rewriteUpdateFlagArgv(argv);
	const invocation = resolveCliArgvInvocation(policyArgv);
	const [primary] = invocation.commandPath;
	if (invocation.hasHelpOrVersion || !primary) return false;
	if (isBareParentDefaultHelpArgv(policyArgv)) return false;
	return resolveCliNetworkProxyPolicy(policyArgv) === "default";
}
function resolveMissingPluginCommandMessage(pluginId, config, options) {
	const normalizedPluginId = normalizeLowercaseStringOrEmpty(pluginId);
	if (!normalizedPluginId) return null;
	const allow = Array.isArray(config?.plugins?.allow) && config.plugins.allow.length > 0 ? config.plugins.allow.filter((entry) => typeof entry === "string").map((entry) => normalizeOptionalLowercaseString(entry)).filter(Boolean) : [];
	const commandAlias = options?.registry ? resolveManifestCommandAliasOwnerInRegistry({
		command: normalizedPluginId,
		registry: options.registry
	}) : options?.resolveCommandAliasOwner?.({
		command: normalizedPluginId,
		config,
		...options?.registry ? { registry: options.registry } : {}
	});
	const parentPluginId = commandAlias?.pluginId;
	if (parentPluginId) {
		if (allow.length > 0 && !allow.includes(parentPluginId)) {
			if (parentPluginId === normalizedPluginId) return `The \`openclaw ${normalizedPluginId}\` command is unavailable because \`plugins.allow\` excludes "${normalizedPluginId}". Add "${normalizedPluginId}" to \`plugins.allow\` if you want that bundled plugin CLI surface.`;
			return `"${normalizedPluginId}" is not a plugin; it is a command provided by the "${parentPluginId}" plugin. Add "${parentPluginId}" to \`plugins.allow\` instead of "${normalizedPluginId}".`;
		}
		if (config?.plugins?.entries?.[parentPluginId]?.enabled === false) return `The \`openclaw ${normalizedPluginId}\` command is unavailable because \`plugins.entries.${parentPluginId}.enabled=false\`. Re-enable that entry if you want the bundled plugin command surface.`;
		if (commandAlias.kind !== "runtime-slash" && commandAlias.enabledByDefault !== true && config?.plugins?.entries?.[parentPluginId]?.enabled !== true) return `The \`openclaw ${normalizedPluginId}\` command is provided by the "${parentPluginId}" plugin, but that bundled plugin is disabled by default. Run \`openclaw plugins enable ${parentPluginId}\` to enable that CLI surface.`;
		if (commandAlias.kind === "runtime-slash") return `"${normalizedPluginId}" is a runtime slash command (/${normalizedPluginId}), not a CLI command. It is provided by the "${parentPluginId}" plugin. ${commandAlias.cliCommand ? `Use \`openclaw ${commandAlias.cliCommand}\` for related CLI operations, or ` : "Use "}\`/${normalizedPluginId}\` in a chat session.`;
	}
	if (isReservedNonPluginCommandRoot(normalizedPluginId)) return null;
	const toolOwner = options?.registry ? resolveManifestToolOwnerInRegistry({
		toolName: normalizedPluginId,
		registry: options.registry
	}) : options?.resolveToolOwner?.({
		toolName: normalizedPluginId,
		config,
		...options?.registry ? { registry: options.registry } : {}
	});
	if (toolOwner) {
		if (config?.plugins?.entries?.[toolOwner.pluginId]?.enabled !== false && (allow.length === 0 || allow.includes(toolOwner.pluginId))) {
			if (toolOwner.availability === "manifest-only") return `"${normalizedPluginId}" may be provided by the "${toolOwner.pluginId}" plugin as an agent tool, not a CLI subcommand. Run \`openclaw --help\` to see available CLI subcommands.`;
			return `"${normalizedPluginId}" is an agent tool available from the "${toolOwner.pluginId}" plugin, not a CLI subcommand. Use it from an agent turn (model tool-use), not the CLI. Run \`openclaw --help\` to see available CLI subcommands.`;
		}
	}
	if (allow.length > 0 && !allow.includes(normalizedPluginId)) {
		if (parentPluginId && allow.includes(parentPluginId)) return null;
		const normalizedCliCommandSurfaceOwner = normalizeOptionalLowercaseString(options?.resolveCliCommandSurfaceOwner ? options.resolveCliCommandSurfaceOwner({
			command: normalizedPluginId,
			config,
			...options?.registry ? { registry: options.registry } : {}
		}) : options?.registry ? resolveManifestCommandAliasOwnerInRegistry({
			command: normalizedPluginId,
			registry: options.registry
		})?.pluginId : void 0);
		if (!normalizedCliCommandSurfaceOwner) return null;
		if (allow.includes(normalizedCliCommandSurfaceOwner)) return null;
		if (normalizedCliCommandSurfaceOwner !== normalizedPluginId) return `"${normalizedPluginId}" is not a plugin; it is a command provided by the "${normalizedCliCommandSurfaceOwner}" plugin. Add "${normalizedCliCommandSurfaceOwner}" to \`plugins.allow\` instead of "${normalizedPluginId}".`;
		return `The \`openclaw ${normalizedPluginId}\` command is unavailable because \`plugins.allow\` excludes "${normalizedPluginId}". Add "${normalizedPluginId}" to \`plugins.allow\` if you want that bundled plugin CLI surface.`;
	}
	if (config?.plugins?.entries?.[normalizedPluginId]?.enabled === false) return `The \`openclaw ${normalizedPluginId}\` command is unavailable because \`plugins.entries.${normalizedPluginId}.enabled=false\`. Re-enable that entry if you want the bundled plugin CLI surface.`;
	return null;
}
//#endregion
//#region src/cli/run-main.ts
const CLI_PROXY_ENV_KEYS = [
	"HTTP_PROXY",
	"HTTPS_PROXY",
	"ALL_PROXY",
	"http_proxy",
	"https_proxy",
	"all_proxy"
];
const UNKNOWN_COMMAND_DISPLAY_LIMIT = 128;
const loadRootHelpLiveConfigModule = async () => await import("../root-help-live-config-DLFpCf-w.js");
const loadRootHelpMetadataModule = async () => await import("../root-help-metadata-DiHQnjQW.js");
const loadLoggingModule = async () => await import("../logging-DomQW3r8.js");
const loadCliRegistryLoaderModule = async () => await import("../cli-registry-loader-B98joCAb.js");
const loadManifestCommandAliasesRuntimeModule = async () => await import("../manifest-command-aliases.runtime-wRRCUsCb.js");
const loadProxyLifecycleModule = async () => await import("../proxy-lifecycle-BHTEQBM9.js");
const loadProgressModule = async () => await import("../progress-fJsOMfFV.js");
function isRemoteAgentDispatchInvocation(argv, primary) {
	return primary === "agent" && !argv.includes("--local");
}
function isGatewayRunFastPathArgv(argv) {
	if (resolveCliArgvInvocation(argv).hasHelpOrVersion) return false;
	const args = argv.slice(2);
	let sawGateway = false;
	let sawRun = false;
	for (let index = 0; index < args.length; index += 1) {
		const arg = args[index];
		if (!arg || arg === "--") return false;
		if (!sawGateway) {
			const consumed = consumeGatewayFastPathRootOptionToken(args, index);
			if (consumed > 0) {
				index += consumed - 1;
				continue;
			}
			if (arg !== "gateway") return false;
			sawGateway = true;
			continue;
		}
		const rootConsumed = consumeRootOptionToken(args, index);
		if (rootConsumed > 0) {
			index += rootConsumed - 1;
			continue;
		}
		const consumed = consumeGatewayRunOptionToken(args, index);
		if (consumed > 0) {
			index += consumed - 1;
			continue;
		}
		if (!sawRun && arg === "run") {
			sawRun = true;
			continue;
		}
		return false;
	}
	return sawGateway;
}
function isGatewayRunInvocationArgv(argv) {
	const commandPath = resolveGatewayCatalogCommandPath(argv);
	return commandPath?.length === 1 || commandPath?.length === 2 && commandPath[0] === "gateway" && commandPath[1] === "run";
}
async function tryRunGatewayRunFastPath(argv, startupTrace) {
	if (!isGatewayRunFastPathArgv(argv)) return false;
	const [{ Command }, { addGatewayRunCommand }, { VERSION }, { emitCliBanner }, { ensureCliExecutionBootstrap }, { defaultRuntime }] = await startupTrace.measure("gateway-run-imports", () => Promise.all([
		import("commander"),
		import("../run-command-DspxWUTv.js"),
		import("../version-B4pBx2Bg.js"),
		import("../banner-somSRpoB.js"),
		import("../command-execution-startup-Db7cD35r.js"),
		import("../runtime-BO0y5md7.js")
	]));
	const commandPath = resolveGatewayCatalogCommandPath(argv) ?? ["gateway"];
	const startupPolicy = resolveCliStartupPolicy({
		argv,
		commandPath,
		jsonOutputMode: hasJsonOutputFlag(argv)
	});
	if (!startupPolicy.hideBanner) emitCliBanner(VERSION, { argv });
	const program = new Command();
	program.name("openclaw");
	program.enablePositionalOptions();
	program.option("--no-color", "Disable ANSI colors", false);
	program.exitOverride((err) => {
		process$1.exitCode = typeof err.exitCode === "number" ? err.exitCode : 1;
		throw err;
	});
	const beforeRun = async (opts) => {
		let beforeStateMigrations;
		let skipPristineStartupStateMigrations = false;
		let skipPristineCoreStateMigrations = false;
		if (!await startupTrace.measure("gateway-run-pre-bootstrap", async () => {
			const { prepareGatewayRunBootstrap, recheckGatewayRunBootstrap, wasPreparedGatewayRunCoreStatePristine, wasPreparedGatewayRunStatePristine } = await import("../pre-bootstrap-CDmFXqHn.js");
			const prepared = await prepareGatewayRunBootstrap({
				opts,
				runtime: defaultRuntime
			});
			if (prepared) {
				skipPristineStartupStateMigrations = wasPreparedGatewayRunStatePristine();
				skipPristineCoreStateMigrations = wasPreparedGatewayRunCoreStatePristine();
				beforeStateMigrations = (snapshot) => recheckGatewayRunBootstrap({
					opts,
					runtime: defaultRuntime,
					...snapshot ? { snapshot } : {}
				});
			}
			return prepared;
		})) return;
		await startupTrace.measure("gateway-run-bootstrap", async () => {
			await ensureCliExecutionBootstrap({
				runtime: defaultRuntime,
				commandPath,
				startupPolicy,
				loadPlugins: false,
				...beforeStateMigrations ? { beforeStateMigrations } : {},
				...skipPristineStartupStateMigrations ? { skipPristineStartupStateMigrations: true } : {},
				...skipPristineCoreStateMigrations ? { skipPristineCoreStateMigrations: true } : {}
			});
			const { reloadTrustedGatewayRunEnvironment } = await import("../pre-bootstrap-CDmFXqHn.js");
			await reloadTrustedGatewayRunEnvironment({ runtime: defaultRuntime });
		});
	};
	addGatewayRunCommand(addGatewayRunCommand(program.command("gateway").description("Run, inspect, and query the WebSocket Gateway"), { beforeRun }).command("run").description("Run the WebSocket Gateway (foreground)"), { beforeRun });
	try {
		await startupTrace.measure("gateway-run-parse", () => program.parseAsync(argv), { timeline: false });
	} catch (error) {
		if (!isCommanderParseExit(error)) throw error;
		process$1.exitCode = error.exitCode;
	}
	return true;
}
async function closeCliResources() {
	const finalizers = [
		async () => {
			const { listRegisteredAgentHarnesses, disposeRegisteredAgentHarnesses } = await import("../registry-DgbUiUis.js");
			if (listRegisteredAgentHarnesses().length > 0) await disposeRegisteredAgentHarnesses();
		},
		async () => {
			const { hasManagedProviderLocalServices } = await import("../provider-runtime-lifecycle-BpYe1F11.js");
			if (hasManagedProviderLocalServices()) {
				const { stopManagedProviderLocalServices } = await import("../provider-local-service-BcVhL2Hl.js");
				stopManagedProviderLocalServices();
			}
		},
		async () => {
			const { hasProviderTransportDispatcherPool } = await import("../provider-runtime-lifecycle-BpYe1F11.js");
			if (hasProviderTransportDispatcherPool()) {
				const { closeProviderTransportDispatcherPool } = await import("../provider-transport-dispatcher-pool-CFeenw-J.js");
				await closeProviderTransportDispatcherPool();
			}
		},
		async () => {
			const { getActiveMcpLoopbackRuntime } = await import("../mcp-http.loopback-runtime-D1jTp853.js");
			if (getActiveMcpLoopbackRuntime()) {
				const { closeMcpLoopbackServer } = await import("../mcp-http-DPJIi0Ok.js");
				await closeMcpLoopbackServer();
			}
		},
		async () => {
			const { hasMemoryRuntime } = await import("../plugins/memory-state.js");
			if (hasMemoryRuntime()) {
				const { closeActiveMemorySearchManagersCore } = await import("../memory-runtime-DMzxgbM0.js");
				await closeActiveMemorySearchManagersCore();
			}
		}
	];
	for (const finalize of finalizers) await finalize().catch(() => void 0);
}
function isUnconfiguredConfigSnapshot(snapshot) {
	if (!snapshot.exists) return true;
	if (!snapshot.valid) return false;
	return isUnconfiguredConfigSource(snapshot.sourceConfig);
}
async function shouldStartLocalOnboarding(snapshot) {
	if (isUnconfiguredConfigSnapshot(snapshot)) return true;
	if (!snapshot.valid || snapshot.sourceConfig.gateway?.mode === "remote") return false;
	const { readLocalOnboardingStateForConfig } = await import("../local-onboarding-state-DH18SU33.js");
	return readLocalOnboardingStateForConfig(snapshot.path, snapshot.sourceConfig)?.status === "pending";
}
async function shouldStartOnboardingForFreshInstall(argv) {
	if (!shouldHandleBareRoot(argv)) return false;
	const { readConfigFileSnapshot } = await import("../config/config.js");
	return shouldStartLocalOnboarding(await readConfigFileSnapshot());
}
async function resolveBareRootLaunchTarget(argv) {
	if (!shouldHandleBareRoot(argv)) return null;
	const { readConfigFileSnapshot } = await import("../config/config.js");
	const snapshot = await readConfigFileSnapshot();
	if (await shouldStartLocalOnboarding(snapshot)) return { kind: "onboarding" };
	if (!snapshot.valid) return {
		kind: "onboarding",
		classic: true
	};
	return resolveConfiguredTuiLaunchTarget(snapshot.config ?? snapshot.sourceConfig, { hasConfiguredGateway: snapshot.sourceConfig.gateway !== void 0 });
}
async function resolveConfiguredTuiLaunchTarget(config, options) {
	const gatewayResolution = await resolveReachableGateway(config, options);
	if (gatewayResolution.kind === "configured" || gatewayResolution.kind === "reachable-unverified" || gatewayResolution.kind === "configured-unreachable") {
		const gateway = gatewayResolution.gateway;
		const target = {
			kind: "tui",
			local: false,
			config,
			gatewayUrl: gateway.url
		};
		if (gateway.token) target.token = gateway.token;
		if (gateway.password) target.password = gateway.password;
		if (gateway.tlsFingerprint) target.tlsFingerprint = gateway.tlsFingerprint;
		return target;
	}
	if (gatewayResolution.kind === "missing-configured-model") {
		if (gatewayResolution.gateway.remote) return {
			kind: "remote-gateway-inference",
			target: {
				config,
				gatewayUrl: gatewayResolution.gateway.url,
				...gatewayResolution.gateway.token ? { token: gatewayResolution.gateway.token } : {},
				...gatewayResolution.gateway.password ? { password: gatewayResolution.gateway.password } : {},
				...gatewayResolution.gateway.tlsFingerprint ? { tlsFingerprint: gatewayResolution.gateway.tlsFingerprint } : {}
			}
		};
		return { kind: "onboarding" };
	}
	const { listAgentIds, resolveAgentEffectiveModelPrimary } = await import("../agent-scope-WWPxWnDc.js");
	if (!listAgentIds(config).some((agentId) => resolveAgentEffectiveModelPrimary(config, agentId))) return { kind: "onboarding" };
	return {
		kind: "tui",
		local: true
	};
}
function toReachableGateway(target, auth) {
	return {
		url: target.url,
		remote: target.scope === "remote",
		...auth.token ? { token: auth.token } : {},
		...auth.password ? { password: auth.password } : {},
		...target.tlsFingerprint ? { tlsFingerprint: target.tlsFingerprint } : {}
	};
}
async function resolveReachableGateway(config, options) {
	const { targets, auth } = await resolveGatewayProbePlan(config);
	if (targets.length === 0) return { kind: "unreachable" };
	const { probeGatewayConfiguredModel } = await import("../onboard-helpers-Cwjb9WEP.js");
	let missingModelGateway;
	let reachableUnverifiedGateway;
	let configuredGateway;
	for (const target of targets) {
		if (!isSafeGatewayProbeTarget(target)) continue;
		if (options.hasConfiguredGateway && !configuredGateway) configuredGateway = toReachableGateway(target, auth);
		const probeOptions = { url: target.url };
		if (config.gateway?.remote?.edgeAuth) probeOptions.config = config;
		if (auth.token) probeOptions.token = auth.token;
		if (auth.password) probeOptions.password = auth.password;
		if (target.tlsFingerprint) probeOptions.tlsFingerprint = target.tlsFingerprint;
		if (target.preauthHandshakeTimeoutMs) probeOptions.preauthHandshakeTimeoutMs = target.preauthHandshakeTimeoutMs;
		const probe = await probeGatewayConfiguredModel(probeOptions);
		if (probe.kind === "configured") return {
			kind: "configured",
			gateway: toReachableGateway(target, auth)
		};
		if (probe.kind === "missing-configured-model") {
			missingModelGateway ??= toReachableGateway(target, auth);
			continue;
		}
		if (probe.kind === "reachable-unverified" && !reachableUnverifiedGateway) reachableUnverifiedGateway = toReachableGateway(target, auth);
	}
	if (missingModelGateway) return {
		kind: "missing-configured-model",
		gateway: missingModelGateway
	};
	if (reachableUnverifiedGateway) return {
		kind: "reachable-unverified",
		gateway: reachableUnverifiedGateway
	};
	if (configuredGateway) return {
		kind: "configured-unreachable",
		gateway: configuredGateway
	};
	return { kind: "unreachable" };
}
async function resolveGatewayProbePlan(config) {
	const remoteUrl = normalizeOptionalString(config.gateway?.remote?.url);
	if (normalizeOptionalString(config.gateway?.mode) === "remote" && remoteUrl) try {
		const { resolveGatewayClientBootstrap } = await import("../client-bootstrap-DOeQqTku.js");
		const bootstrap = await resolveGatewayClientBootstrap({
			config,
			authPolicy: "probe",
			modeOverride: "remote",
			ignoreEnvUrlOverride: true
		});
		return {
			targets: [{
				url: bootstrap.url,
				scope: "remote",
				...bootstrap.tlsFingerprint ? { tlsFingerprint: bootstrap.tlsFingerprint } : {}
			}],
			auth: bootstrap.auth
		};
	} catch {
		return {
			targets: [],
			auth: {}
		};
	}
	return resolveLocalGatewayProbeTargets(config);
}
function isSafeGatewayProbeTarget(target) {
	if (target.scope === "remote") return isSafeRemoteGatewayProbeUrl(target.url);
	return isSecureWebSocketUrl(target.url, { allowPrivateWs: process$1.env.OPENCLAW_ALLOW_INSECURE_PRIVATE_WS === "1" });
}
function isSafeRemoteGatewayProbeUrl(url) {
	let parsed;
	try {
		parsed = new URL(url);
	} catch {
		return false;
	}
	const protocol = normalizeWebSocketProtocol(parsed.protocol);
	if (protocol === "wss:") return true;
	if (protocol !== "ws:") return false;
	if (isLoopbackGatewayHost(parsed.hostname)) return true;
	return process$1.env.OPENCLAW_ALLOW_INSECURE_PRIVATE_WS === "1" && isSecureWebSocketUrl(url, { allowPrivateWs: true });
}
function isLoopbackGatewayHost(hostname) {
	const normalized = hostname.toLowerCase().replace(/\.+$/, "");
	if (normalized === "localhost") return true;
	return isLoopbackAddress(normalized.startsWith("[") && normalized.endsWith("]") ? normalized.slice(1, -1) : normalized);
}
async function resolveLocalGatewayProbeTargets(config) {
	const [{ resolveControlUiLinks }, { resolveGatewayClientBootstrap }, { readActiveGatewayLockPort }] = await Promise.all([
		import("../control-ui-links-vkwfYEkc.js"),
		import("../client-bootstrap-DOeQqTku.js"),
		import("../gateway-lock-5zz6bLWk.js")
	]);
	const gateway = config.gateway;
	const configuredPort = resolveGatewayPort(config);
	const port = (Boolean(normalizeOptionalString(process$1.env.OPENCLAW_GATEWAY_PORT)) ? void 0 : await readActiveGatewayLockPort()) ?? configuredPort;
	const connection = await resolveGatewayClientBootstrap({
		config,
		authPolicy: "probe",
		modeOverride: "local",
		ignoreEnvUrlOverride: true,
		localPortOverride: port
	});
	const baseParams = {
		port,
		basePath: gateway?.controlUi?.basePath,
		tlsEnabled: gateway?.tls?.enabled === true
	};
	const sharedTarget = {
		...connection.tlsFingerprint ? { tlsFingerprint: connection.tlsFingerprint } : {},
		...connection.preauthHandshakeTimeoutMs ? { preauthHandshakeTimeoutMs: connection.preauthHandshakeTimeoutMs } : {}
	};
	const loopbackTarget = {
		...sharedTarget,
		url: connection.url,
		scope: "local-loopback"
	};
	const bind = gateway?.bind;
	if (bind !== "tailnet" && bind !== "custom") return {
		targets: [loopbackTarget],
		auth: connection.auth
	};
	const configuredLinks = resolveControlUiLinks({
		...baseParams,
		bind,
		customBindHost: gateway?.customBindHost
	});
	return {
		targets: configuredLinks.wsUrl === connection.url ? [loopbackTarget] : [loopbackTarget, {
			...sharedTarget,
			url: configuredLinks.wsUrl,
			scope: "local-configured"
		}],
		auth: connection.auth
	};
}
function pauseNonTtyStdinForCliExit() {
	const stdin = process$1.stdin;
	if (stdin.isTTY) return;
	try {
		stdin.pause();
	} catch {}
}
function shouldLoadCliDotEnv(loadGlobalEnv, env = process$1.env) {
	const cwd = tryProcessCwd();
	if (cwd && existsSync(path.join(cwd, ".env"))) return true;
	return loadGlobalEnv && existsSync(path.join(resolveStateDir(env), ".env"));
}
function isAgentExecInvocation(commandPath) {
	return commandPath[0] === "agent" && commandPath[1] === "exec";
}
function isCommanderParseExit(error) {
	if (!error || typeof error !== "object") return false;
	const candidate = error;
	return typeof candidate.exitCode === "number" && Number.isInteger(candidate.exitCode) && typeof candidate.code === "string" && candidate.code.startsWith("commander.");
}
function findCommandOption(command, token) {
	const equalsIndex = token.indexOf("=");
	const flag = equalsIndex === -1 ? token : token.slice(0, equalsIndex);
	return command.options.find((option) => option.long === flag || option.short === flag);
}
function findSubcommand(command, name) {
	return command.commands.find((subcommand) => subcommand.name() === name || subcommand.aliases().includes(name));
}
function shouldOptionConsumeFollowingToken(option, token, next) {
	if (!option || token.includes("=")) return false;
	if (option.required) return true;
	return option.optional && isValueToken(next);
}
function isNoColorConsumedAsCommandOptionValue(program, remainingArgs, noColorIndex) {
	let command = program;
	let pendingValue = false;
	for (let index = 0; index < noColorIndex; index += 1) {
		const arg = remainingArgs[index];
		if (!arg || arg === "--") return false;
		if (pendingValue) {
			pendingValue = false;
			continue;
		}
		if (arg.startsWith("-")) {
			const option = findCommandOption(command, arg);
			if (!option && index === noColorIndex - 1 && !arg.includes("=")) return true;
			pendingValue = shouldOptionConsumeFollowingToken(option, arg, remainingArgs[index + 1]);
			continue;
		}
		command = findSubcommand(command, arg) ?? command;
	}
	return pendingValue;
}
function isLogLevelConsumedAsCommandOption(program, remainingArgs, logLevelIndex) {
	let command = program;
	let pendingValue = false;
	for (let index = 0; index < logLevelIndex; index += 1) {
		const arg = remainingArgs[index];
		if (!arg || arg === "--") return false;
		if (pendingValue) {
			pendingValue = false;
			continue;
		}
		if (arg.startsWith("-")) {
			const option = findCommandOption(command, arg);
			if (!option && index === logLevelIndex - 1 && !arg.includes("=")) return true;
			pendingValue = shouldOptionConsumeFollowingToken(option, arg, remainingArgs[index + 1]);
			continue;
		}
		command = findSubcommand(command, arg) ?? command;
	}
	if (pendingValue) return true;
	const arg = remainingArgs[logLevelIndex];
	return command !== program && arg !== void 0 && findCommandOption(command, arg) !== void 0;
}
function normalizeRootNoColorArgvForProgram(argv, program) {
	return normalizeRootNoColorArgv(argv, { shouldPreserveNoColor: ({ remainingArgs, noColorIndex }) => isNoColorConsumedAsCommandOptionValue(program, remainingArgs, noColorIndex) });
}
function normalizeRootLogLevelArgvForProgram(argv, program) {
	return normalizeRootLogLevelArgv(argv, { shouldPreserveLogLevel: ({ remainingArgs, logLevelIndex }) => isLogLevelConsumedAsCommandOption(program, remainingArgs, logLevelIndex) });
}
async function ensureCliEnvProxyDispatcher() {
	try {
		const { hasEnvHttpProxyAgentConfigured } = await import("../proxy-env-CTV6mjac.js");
		if (!hasEnvHttpProxyAgentConfigured()) return;
		const { ensureGlobalUndiciEnvProxyDispatcher } = await import("../undici-global-dispatcher-FgDdlWwL.js");
		ensureGlobalUndiciEnvProxyDispatcher();
	} catch {}
}
function shouldBootstrapCliProxyBeforeFastPath(env = process$1.env) {
	if (isTruthyEnvValue(env.OPENCLAW_DEBUG_PROXY_ENABLED) || isTruthyEnvValue(env.OPENCLAW_DEBUG_PROXY_REQUIRE)) return true;
	return CLI_PROXY_ENV_KEYS.some((key) => {
		const value = env[key];
		return typeof value === "string" && value.trim().length > 0;
	});
}
function isKnownBuiltInCommandRoot(primary) {
	return getCoreCliCommandNamesCore().includes(primary) || getSubCliEntriesCore().some((entry) => entry.name === primary);
}
function resolvesMachineOutput(descriptor, argv) {
	return descriptor.machineOutput?.({
		argv,
		stdoutIsTTY: isMachineOutputStdoutTTY()
	}) ?? false;
}
function resolveBuiltInMachineOutput(argv) {
	const { primary } = resolveCliArgvInvocation(argv);
	if (!primary) return false;
	const descriptor = [...getCoreCliCommandDescriptors(), ...getSubCliEntriesCore()].find((entry) => entry.name === primary);
	return descriptor ? resolvesMachineOutput(descriptor, argv) : false;
}
async function resolvePluginMachineOutput(params) {
	const { primary } = resolveCliArgvInvocation(params.argv);
	if (!primary || isKnownBuiltInCommandRoot(primary)) return false;
	const { loadPluginCliDescriptors } = await loadCliRegistryLoaderModule();
	const descriptor = (await loadPluginCliDescriptors({
		cfg: params.config,
		env: process$1.env,
		primaryCommand: primary
	})).find((entry) => entry.name === primary);
	return descriptor ? resolvesMachineOutput(descriptor, params.argv) : false;
}
async function isPluginCliRoot(params) {
	try {
		const { resolvePluginCliRootOwnerIds } = await loadCliRegistryLoaderModule();
		const ownerIds = await resolvePluginCliRootOwnerIds({
			cfg: params.config,
			env: process$1.env,
			primaryCommand: params.primary
		});
		return ownerIds === null ? null : ownerIds.length > 0;
	} catch {
		return null;
	}
}
function createAllowlistAgnosticCliLookupConfig(config) {
	if (!Array.isArray(config.plugins?.allow) || config.plugins.allow.length === 0) return config;
	return {
		...config,
		plugins: {
			...config.plugins,
			allow: []
		}
	};
}
async function resolveCliCommandSurfaceOwner(params) {
	const { resolveManifestCliCommandSurfaceOwner } = await loadManifestCommandAliasesRuntimeModule();
	const manifestOwner = resolveManifestCliCommandSurfaceOwner({
		command: params.primary,
		config: params.config,
		env: process$1.env
	});
	if (manifestOwner) return manifestOwner;
	try {
		const { resolvePluginCliRootOwnerIds } = await loadCliRegistryLoaderModule();
		return (await resolvePluginCliRootOwnerIds({
			cfg: createAllowlistAgnosticCliLookupConfig(params.config),
			env: process$1.env,
			primaryCommand: params.primary
		}))?.[0];
	} catch {
		return;
	}
}
function resolveUnownedCliPrimaryCandidate(argv) {
	const { primary } = resolveCliArgvInvocation(rewriteUpdateFlagArgv(argv));
	if (!primary || primary === "help" || isReservedNonPluginCommandRoot(primary) || isKnownBuiltInCommandRoot(primary)) return null;
	return primary;
}
async function resolveUnownedCliPrimary(params) {
	const primary = resolveUnownedCliPrimaryCandidate(params.argv);
	if (!primary) return null;
	if (await isPluginCliRoot({
		primary,
		config: params.config
	}) !== false) return null;
	return primary;
}
async function resolveUnownedCliPrimaryError(params) {
	const { resolveManifestCommandAliasOwner, resolveManifestToolOwner } = await loadManifestCommandAliasesRuntimeModule();
	const cliCommandSurfaceOwner = await resolveCliCommandSurfaceOwner(params);
	const pluginPolicyMessage = resolveMissingPluginCommandMessage(params.primary, params.config, {
		resolveCommandAliasOwner: resolveManifestCommandAliasOwner,
		resolveToolOwner: resolveManifestToolOwner,
		resolveCliCommandSurfaceOwner: () => cliCommandSurfaceOwner
	});
	if (pluginPolicyMessage) return await createExpectedPluginPolicyError(pluginPolicyMessage);
	const sanitizedPrimary = sanitizeTerminalText(params.primary);
	const displayPrimary = sanitizedPrimary.length <= UNKNOWN_COMMAND_DISPLAY_LIMIT ? sanitizedPrimary : `${truncateUtf16Safe(sanitizedPrimary, UNKNOWN_COMMAND_DISPLAY_LIMIT - 1)}…`;
	const { createCliUnknownCommandError } = await import("../error-output-lANEvxJo.js");
	return createCliUnknownCommandError(displayPrimary, {
		argv: params.argv,
		...displayPrimary === params.primary ? {} : { commandNames: [] }
	});
}
async function createExpectedPluginPolicyError(message) {
	const { ExpectedCliError } = await import("../failure-output-Dl5h2loz.js");
	return new ExpectedCliError({
		message,
		humanOutput: message,
		machineOutput: message
	});
}
async function bootstrapCliProxyCaptureAndDispatcher(startupTrace, options = {}) {
	const [{ initializeDebugProxyCapture, finalizeDebugProxyCapture }, { maybeWarnAboutDebugProxyCoverage }] = await startupTrace.measure("proxy-imports", () => Promise.all([import("../runtime-DmMdGoDN.js"), import("../coverage-39SssipS.js")]));
	initializeDebugProxyCapture("cli");
	process$1.once("exit", () => {
		finalizeDebugProxyCapture();
	});
	if (options.ensureDispatcher !== false) await startupTrace.measure("proxy-dispatcher", () => ensureCliEnvProxyDispatcher());
	maybeWarnAboutDebugProxyCoverage(void 0, (message) => console.warn(message));
}
async function runCli(argv = process$1.argv, options = {}) {
	const originalArgv = normalizeWindowsArgv(argv);
	const builtInMachineOutput = resolveBuiltInMachineOutput(originalArgv);
	return await withConsoleLogsRoutedToStderrForJson(originalArgv, () => runCliWithPreparedOutputMode(originalArgv, {
		...options,
		builtInMachineOutput
	}), {
		machineOutput: builtInMachineOutput,
		restoreChanges: true,
		retainRoutingUntilProcessExit: options.retainConsoleRoutingUntilProcessExit
	});
}
async function runCliWithPreparedOutputMode(originalArgv, options) {
	const startupTrace = createGatewayDispatchStartupTrace(originalArgv, "cli.main");
	const earlyProfile = parseCliProfileArgs(originalArgv);
	if (earlyProfile.ok && earlyProfile.profile) applyCliProfileEnv({ profile: earlyProfile.profile });
	const originalInvocation = resolveCliArgvInvocation(originalArgv);
	let consoleCaptureInstalled = false;
	const installConsoleCapture = async () => {
		if (consoleCaptureInstalled) return;
		const { enableConsoleCapture } = await loadLoggingModule();
		enableConsoleCapture();
		consoleCaptureInstalled = true;
	};
	const configureStartupTraces = async () => {
		await configureGatewayStartupTraceConsoleFormatting(startupTrace);
		if (options.additionalStartupTrace) await configureGatewayStartupTraceConsoleFormatting(options.additionalStartupTrace);
	};
	const parsedContainer = parseCliContainerArgs(originalArgv);
	if (!parsedContainer.ok) {
		await installConsoleCapture();
		await configureStartupTraces();
		throw new Error(parsedContainer.error);
	}
	const parsedProfile = parseCliProfileArgs(parsedContainer.argv);
	const containerTargetName = parsedContainer.container ?? normalizeOptionalString(process$1.env.OPENCLAW_CONTAINER) ?? null;
	const hasPreHelpValidationError = !parsedProfile.ok || containerTargetName !== null && parsedProfile.profile !== null;
	if (!originalInvocation.hasHelpOrVersion || containerTargetName !== null || hasPreHelpValidationError) await installConsoleCapture();
	if (!parsedProfile.ok) {
		await configureStartupTraces();
		throw new Error(parsedProfile.error);
	}
	if (parsedProfile.profile) applyCliProfileEnv({ profile: parsedProfile.profile });
	if (containerTargetName && parsedProfile.profile) {
		await configureStartupTraces();
		throw new Error("--container cannot be combined with --profile/--dev");
	}
	let containerTarget;
	try {
		containerTarget = maybeRunCliInContainer(originalArgv);
	} catch (error) {
		await configureStartupTraces();
		throw error;
	}
	if (containerTarget.handled) {
		await configureStartupTraces();
		if (containerTarget.exitCode !== 0) process$1.exitCode = containerTarget.exitCode;
		return;
	}
	const normalizedArgv = rewriteUpdateFlagArgv(normalizeRootHelpTargetArgv(normalizeRootNoColorArgv(parsedProfile.argv)));
	const normalizedInvocation = resolveCliArgvInvocation(normalizedArgv);
	const isHelpOrVersionInvocation = normalizedInvocation.hasHelpOrVersion;
	const isGatewayRunInvocation = isGatewayRunInvocationArgv(normalizedArgv);
	const isDatabaseInvocation = normalizedInvocation.commandPath[0] === "database";
	const loadGlobalEnv = !isGatewayRunInvocation;
	startupTrace.mark("argv");
	assertSupportedRuntime();
	if (!isHelpOrVersionInvocation && !isDatabaseInvocation && !isAgentExecInvocation(normalizedInvocation.commandPath) && shouldLoadCliDotEnv(loadGlobalEnv)) await startupTrace.measure("dotenv", async () => {
		if (isRemoteAgentDispatchInvocation(normalizedArgv, normalizedInvocation.primary)) {
			const { loadGatewayDispatchCliDotEnv } = await import("../gateway-dispatch-dotenv-DVyMc7IL.js");
			await loadGatewayDispatchCliDotEnv({ quiet: true });
		} else {
			const { loadCliDotEnv } = await import("../dotenv-DLvHYU08.js");
			loadCliDotEnv({
				loadGlobalEnv,
				quiet: true
			});
		}
	});
	await configureStartupTraces();
	if (!isHelpOrVersionInvocation && isGatewayRunInvocation) await startupTrace.measure("gateway-run-select-environment", async () => {
		const [{ selectGatewayRunEnvironment }, { defaultRuntime }] = await Promise.all([import("../pre-bootstrap-CDmFXqHn.js"), import("../runtime-BO0y5md7.js")]);
		await selectGatewayRunEnvironment({
			opts: resolveGatewayRunPreBootstrapOptions(normalizedArgv) ?? {},
			runtime: defaultRuntime
		});
	});
	normalizeEnv();
	if (shouldEnsureCliPath(normalizedArgv)) ensureOpenClawCliOnPath();
	const mayContainBareSessionUrl = normalizedArgv.slice(2).some((arg) => arg.includes("://"));
	const bareSessionInvocation = !isHelpOrVersionInvocation && mayContainBareSessionUrl ? (await import("../session-ref-BorIRoYF.js")).parseBareSessionInvocation(normalizedArgv) : null;
	let proxyHandle = null;
	let onSigterm = null;
	let onSigint = null;
	let onExit = null;
	let unregisterProxySignalExitBarrier = null;
	let bestEffortConfigPromise = null;
	const isolateProxyConfigEnv = isGatewayRunInvocation;
	const bestEffortConfigStartupPolicy = resolveCliStartupPolicy({
		argv: normalizedArgv,
		commandPath: normalizedInvocation.commandPath,
		jsonOutputMode: options.builtInMachineOutput || hasJsonOutputFlag(normalizedArgv),
		env: process$1.env
	});
	const useSourceOnlyBestEffortConfig = normalizedInvocation.primary === "update" || normalizedInvocation.primary === "doctor" && hasFlag(normalizedArgv, "--lint");
	const readBestEffortCliConfig = async () => {
		if (!bestEffortConfigPromise) bestEffortConfigPromise = import("../io-D3NIoaFX.js").then((configIo) => useSourceOnlyBestEffortConfig ? configIo.readSourceConfigBestEffort() : configIo.readBestEffortConfig({
			...isolateProxyConfigEnv ? {
				isolateEnv: true,
				observe: false
			} : {},
			...bestEffortConfigStartupPolicy.skipConfigGuard || bestEffortConfigStartupPolicy.validateConfigOnly ? { observe: false } : {},
			skipPluginValidation: true
		}));
		return await bestEffortConfigPromise;
	};
	const startupTraces = [startupTrace, options.additionalStartupTrace].filter((trace) => Boolean(trace));
	if (!isDatabaseInvocation && (await Promise.all(startupTraces.map((trace) => trace.requiresDiagnosticsConfig()))).some(Boolean)) {
		const config = await withConsoleLogsRoutedToStderr(readBestEffortCliConfig);
		await Promise.all(startupTraces.map((trace) => trace.configureDiagnosticsTimeline(config)));
	}
	if (!isHelpOrVersionInvocation && !bareSessionInvocation && normalizedInvocation.primary && !isKnownBuiltInCommandRoot(normalizedInvocation.primary)) {
		const config = await withConsoleLogsRoutedToStderr(readBestEffortCliConfig);
		if (await withConsoleLogsRoutedToStderr(() => resolvePluginMachineOutput({
			argv: normalizedArgv,
			config
		}))) {
			const { routeLogsToStderr } = await loadLoggingModule();
			routeLogsToStderr();
		}
	}
	const uninstallProxySignalHandlers = () => {
		if (onSigterm) {
			process$1.off("SIGTERM", onSigterm);
			onSigterm = null;
		}
		if (onSigint) {
			process$1.off("SIGINT", onSigint);
			onSigint = null;
		}
		if (onExit) {
			process$1.off("exit", onExit);
			onExit = null;
		}
	};
	const stopStartedProxy = async () => {
		unregisterProxySignalExitBarrier?.();
		unregisterProxySignalExitBarrier = null;
		uninstallProxySignalHandlers();
		const handle = proxyHandle;
		proxyHandle = null;
		if (handle) {
			const { stopProxy } = await loadProxyLifecycleModule();
			await stopProxy(handle);
		}
	};
	const killStartedProxy = () => {
		const handle = proxyHandle;
		proxyHandle = null;
		handle?.kill("SIGTERM");
	};
	const installProxySignalHandlers = () => {
		if (!proxyHandle || onSigterm || onSigint || onExit) return;
		unregisterProxySignalExitBarrier = registerSignalExitBarrier(stopStartedProxy);
		const shutdown = (exitCode) => {
			waitForSignalExitBarriers().finally(() => {
				process$1.exit(exitCode);
			});
		};
		onSigterm = () => shutdown(143);
		onSigint = () => shutdown(130);
		onExit = () => killStartedProxy();
		process$1.once("SIGTERM", onSigterm);
		process$1.once("SIGINT", onSigint);
		process$1.once("exit", onExit);
	};
	const replaceStartedProxy = async (config) => {
		await stopStartedProxy();
		const { startProxy } = await loadProxyLifecycleModule();
		proxyHandle = await startProxy(config);
		installProxySignalHandlers();
	};
	if (!isHelpOrVersionInvocation && shouldStartProxyForCli(normalizedArgv)) {
		const config = await withConsoleLogsRoutedToStderr(readBestEffortCliConfig);
		if (!bareSessionInvocation) {
			const unownedPrimary = await resolveUnownedCliPrimary({
				argv: normalizedArgv,
				config
			});
			if (unownedPrimary) throw await resolveUnownedCliPrimaryError({
				argv: normalizedArgv,
				primary: unownedPrimary,
				config
			});
		}
		await replaceStartedProxy(config?.proxy ?? void 0);
	}
	let uninstallGatewayRunRuntimeHooks = null;
	if (!isHelpOrVersionInvocation && isGatewayRunInvocation) {
		const { installGatewayRunRuntimeHooks } = await import("../runtime-hooks-DrZePdac.js");
		uninstallGatewayRunRuntimeHooks = installGatewayRunRuntimeHooks({
			releaseManagedProxy: stopStartedProxy,
			refreshManagedProxy: replaceStartedProxy
		});
	}
	try {
		if (shouldUseRootHelpFastPath(normalizedArgv)) {
			const { loadRootHelpRenderOptionsForConfigSensitivePlugins } = await loadRootHelpLiveConfigModule();
			const liveRootHelpOptions = await loadRootHelpRenderOptionsForConfigSensitivePlugins(process$1.env);
			if (!liveRootHelpOptions) {
				const { outputPrecomputedRootHelpText } = await loadRootHelpMetadataModule();
				if (outputPrecomputedRootHelpText()) return;
			}
			const { outputRootHelp } = await import("../root-help-O3MVKtrv.js");
			await outputRootHelp(liveRootHelpOptions ?? void 0);
			return;
		}
		if (await tryOutputPrecomputedCommandHelp(normalizedArgv)) return;
		if (shouldUseSetupOnboardConfigureHelpFastPath(normalizedArgv)) {
			const { tryOutputSetupOnboardConfigureHelp } = await import("../setup-onboard-configure-help-fast-path-CSbDDDfe.js");
			if (await tryOutputSetupOnboardConfigureHelp(normalizedArgv)) return;
		}
		await installConsoleCapture();
		if (bareSessionInvocation) {
			if (!process$1.stdin.isTTY || !process$1.stdout.isTTY) {
				console.error("OpenClaw TUI needs an interactive TTY. Use `openclaw agent --local ...` for automation.");
				process$1.exitCode = 1;
				return;
			}
			const { runTuiCliAction } = await import("../tui-cli-C-0ksMXd.js");
			await runTuiCliAction(bareSessionInvocation.target, bareSessionInvocation.options);
			return;
		}
		if (resolveUnownedCliPrimaryCandidate(normalizedArgv)) {
			const config = await readBestEffortCliConfig();
			const unownedPrimary = await resolveUnownedCliPrimary({
				argv: normalizedArgv,
				config
			});
			if (unownedPrimary) throw await resolveUnownedCliPrimaryError({
				argv: normalizedArgv,
				primary: unownedPrimary,
				config
			});
		}
		const shouldRunBareRootCommand = shouldHandleBareRoot(normalizedArgv);
		if (shouldRunBareRootCommand) await ensureCliEnvProxyDispatcher();
		const bareRootLaunchTarget = shouldRunBareRootCommand ? await resolveBareRootLaunchTarget(normalizedArgv) : null;
		if (bareRootLaunchTarget) {
			if (bareRootLaunchTarget.kind === "remote-gateway-inference") {
				if (!process$1.stdin.isTTY || !process$1.stdout.isTTY) {
					console.error("Remote Gateway inference setup needs an interactive TTY. Re-run `openclaw` in a terminal connected to this Gateway.");
					process$1.exitCode = 1;
					return;
				}
				const { runRemoteGatewayInferenceOnboarding } = await import("../onboard-remote-gateway-DdpwM4de.js");
				await runRemoteGatewayInferenceOnboarding(bareRootLaunchTarget.target);
				return;
			}
			if (bareRootLaunchTarget.kind === "onboarding") {
				if (!process$1.stdin.isTTY || !process$1.stdout.isTTY) {
					console.error(bareRootLaunchTarget.classic ? "OpenClaw config is invalid. Run `openclaw doctor --fix` before onboarding." : "Onboarding needs an interactive TTY. Use `openclaw onboard --non-interactive --accept-risk ...` for automation.");
					process$1.exitCode = 1;
					return;
				}
				const { setupWizardCommand } = await import("../onboard-C8S4z1qv.js");
				await setupWizardCommand(bareRootLaunchTarget.classic ? { classic: true } : {});
				return;
			}
			if (bareRootLaunchTarget.kind === "tui") {
				if (!process$1.stdin.isTTY || !process$1.stdout.isTTY) {
					console.error("OpenClaw TUI needs an interactive TTY. Use `openclaw agent --local ...` for automation.");
					process$1.exitCode = 1;
					return;
				}
				const { runTui } = await import("../tui-Bs69Gc0u.js");
				await runTui({
					...bareRootLaunchTarget.local ? {
						deliver: false,
						local: true
					} : {
						deliver: false,
						config: bareRootLaunchTarget.config,
						boundGateway: {
							url: bareRootLaunchTarget.gatewayUrl,
							...bareRootLaunchTarget.token ? { token: bareRootLaunchTarget.token } : {},
							...bareRootLaunchTarget.password ? { password: bareRootLaunchTarget.password } : {},
							...bareRootLaunchTarget.tlsFingerprint ? { tlsFingerprint: bareRootLaunchTarget.tlsFingerprint } : {}
						}
					},
					forceProcessExitOnReturn: true
				});
				return;
			}
		}
		const shouldUseCliEnvProxy = !isHelpOrVersionInvocation && shouldStartProxyForCli(normalizedArgv);
		const bootstrapProxyBeforeFastPath = shouldUseCliEnvProxy && shouldBootstrapCliProxyBeforeFastPath();
		if (!bootstrapProxyBeforeFastPath && await tryRunGatewayRunFastPath(normalizedArgv, startupTrace)) return;
		if (!isHelpOrVersionInvocation && !isDatabaseInvocation) await bootstrapCliProxyCaptureAndDispatcher(startupTrace, { ensureDispatcher: shouldUseCliEnvProxy });
		if (bootstrapProxyBeforeFastPath && await tryRunGatewayRunFastPath(normalizedArgv, startupTrace)) return;
		if (!isHelpOrVersionInvocation) {
			const route = await startupTrace.measure("route-import", () => import("../route-Be-CPxsB.js"));
			if (await startupTrace.measure("route", () => options.builtInMachineOutput ? route.tryRouteCli(normalizedArgv, { machineOutput: true }) : route.tryRouteCli(normalizedArgv), { timeline: false })) return;
		}
		let parseArgv = normalizeGeneratedHelpCommandArgv(normalizedArgv);
		const suppressStartupProgress = options.builtInMachineOutput || hasJsonOutputFlag(parseArgv);
		const { createCliProgress } = await loadProgressModule();
		const startupProgress = createCliProgress({
			label: "Loading OpenClaw CLI…",
			indeterminate: true,
			delayMs: 0,
			...suppressStartupProgress ? { enabled: false } : {}
		});
		let startupProgressStopped = false;
		const stopStartupProgress = () => {
			if (startupProgressStopped) return;
			startupProgressStopped = true;
			startupProgress.done();
		};
		try {
			const [{ buildProgram }, { formatUncaughtError }, { formatCliFailureLines, formatCliJsonFailure }, { runFatalErrorHooks }, { installUnhandledRejectionHandler, isBenignUncaughtExceptionError, isUncaughtExceptionHandled }, { defaultRuntime, restoreRuntimeTerminalState }] = await startupTrace.measure("core-imports", () => Promise.all([
				import("../program-ChvQMOpm.js"),
				import("../infra/errors.js"),
				import("../failure-output-Dl5h2loz.js"),
				import("../fatal-error-hooks-BiXaGF_Q.js"),
				import("../unhandled-rejections-Btf0mDYJ.js"),
				import("../runtime-BO0y5md7.js")
			]));
			const program = await startupTrace.measure("build-program", () => buildProgram());
			installUnhandledRejectionHandler();
			process$1.on("uncaughtException", (error) => {
				if (isUncaughtExceptionHandled(error)) return;
				if (isBenignUncaughtExceptionError(error)) {
					console.warn("[openclaw] Non-fatal uncaught exception (continuing):", formatUncaughtError(error));
					return;
				}
				if (isJsonOutputModeActive(normalizedArgv)) defaultRuntime.writeJson(formatCliJsonFailure(error));
				for (const line of formatCliFailureLines({
					title: "OpenClaw hit an unexpected runtime error.",
					error,
					argv: normalizedArgv
				})) console.error(line);
				for (const message of runFatalErrorHooks({
					reason: "uncaught_exception",
					error
				})) console.error("[openclaw]", message);
				restoreRuntimeTerminalState("uncaught exception", { resumeStdinIfPaused: false });
				process$1.exit(1);
			});
			const invocation = resolveCliArgvInvocation(parseArgv);
			const { primary } = invocation;
			if (primary && shouldRegisterPrimaryCommandOnly(parseArgv)) await startupTrace.measure("register-primary", async () => {
				const { getProgramContext } = await import("../program-context-C5CVUqfZ.js");
				const ctx = getProgramContext(program);
				if (ctx) {
					const { registerCoreCliByName } = await import("../command-registry-DSewE6jy.js");
					await registerCoreCliByName(program, ctx, primary, parseArgv);
				}
				const { registerSubCliByName } = await import("../register.subclis-Bznf3QKf.js");
				await registerSubCliByName(program, primary, parseArgv);
			});
			const hasBuiltinPrimary = primary !== null && program.commands.some((command) => command.name() === primary || command.aliases().includes(primary));
			if (!shouldSkipPluginCommandRegistration({
				argv: parseArgv,
				primary,
				hasBuiltinPrimary
			})) {
				const config = await startupTrace.measure("register-plugin-commands", async () => {
					const { registerPluginCliCommandsFromValidatedConfig } = await import("../cli-C4iNqe7v.js");
					const startupPolicy = resolveCliStartupPolicy({
						argv: parseArgv,
						commandPath: invocation.commandPath,
						jsonOutputMode: suppressStartupProgress
					});
					return await registerPluginCliCommandsFromValidatedConfig(program, void 0, void 0, {
						mode: "lazy",
						primary,
						skipPluginValidation: startupPolicy.skipConfigGuard
					});
				});
				if (config) {
					if (primary && !program.commands.some((command) => command.name() === primary || command.aliases().includes(primary))) {
						const { resolveManifestCommandAliasOwner, resolveManifestToolOwner } = await loadManifestCommandAliasesRuntimeModule();
						const cliCommandSurfaceOwner = await resolveCliCommandSurfaceOwner({
							primary,
							config
						});
						const missingPluginCommandMessage = resolveMissingPluginCommandMessage(primary, config, {
							resolveCommandAliasOwner: resolveManifestCommandAliasOwner,
							resolveToolOwner: resolveManifestToolOwner,
							resolveCliCommandSurfaceOwner: () => cliCommandSurfaceOwner
						});
						if (missingPluginCommandMessage) throw await createExpectedPluginPolicyError(missingPluginCommandMessage);
					}
				}
			}
			parseArgv = normalizeRootLogLevelArgvForProgram(normalizeRootNoColorArgvForProgram(parseArgv, program), program);
			stopStartupProgress();
			let completedHelpOrVersion = false;
			try {
				await startupTrace.measure("parse", () => program.parseAsync(parseArgv), { timeline: false });
				completedHelpOrVersion = isHelpOrVersionInvocation;
			} catch (error) {
				if (!isCommanderParseExit(error)) throw error;
				if (isJsonOutputModeActive(parseArgv) && error.exitCode !== 0) throw error;
				process$1.exitCode = error.exitCode;
				completedHelpOrVersion = isHelpOrVersionInvocation && error.exitCode === 0;
			}
			if (completedHelpOrVersion) requestExitAfterOneShotOutput();
		} finally {
			stopStartupProgress();
		}
	} finally {
		uninstallGatewayRunRuntimeHooks?.();
		await stopStartedProxy();
		await closeCliResources();
		pauseNonTtyStdinForCliExit();
	}
}
//#endregion
export { isGatewayRunFastPathArgv, rewriteUpdateFlagArgv, runCli, shouldEnsureCliPath, shouldHandleBareRoot, shouldStartOnboardingForFreshInstall, shouldStartProxyForCli, shouldUseRootHelpFastPath, shouldUseSetupOnboardConfigureHelpFastPath };
