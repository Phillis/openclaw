import { n as resolveCliName } from "./cli-name-CVj-3DWf.js";
import { A as getCommanderSubcommandFact, D as getCommanderCommandPath, N as setCommanderErrorCommand, O as getCommanderErrorCommandNames, T as isModelsPlainMachineOutput, j as hasCommanderOptionToken, k as getCommanderErrorCommandPath, l as isHelpOrVersionInvocation, o as getVerboseFlag } from "./argv-CCdO9MSu.js";
import { t as resolveCliArgvInvocation } from "./argv-invocation-DXuFeGZ6.js";
import { r as isJsonOutputModeActive, t as applyResolvedCommandOutputMode } from "./json-output-mode-XMIkPNjr.js";
import { r as defaultRuntime } from "./runtime-LRpY2Icg.js";
import { r as setVerbose } from "./global-state-BCtvHc7P.js";
import { n as VERSION } from "./version-CkBmshxX.js";
import { n as inheritOptionFromParent } from "./command-options-BDuSHeWG.js";
import "./globals-GZNLg1ns.js";
import { n as resolvePluginInstallPreactionRequest, t as resolvePluginInstallInvalidConfigPolicy } from "./plugin-install-config-policy-B1yj6OFJ.js";
import { n as resolveCliChannelOptions } from "./channel-options-dp4EyufK.js";
import { n as isParentDefaultHelpAction } from "./parent-default-help-DQUF3qKA.js";
import { n as ensureCliExecutionBootstrap, r as resolveCliExecutionStartupContext, t as applyCliExecutionStartupPresentation } from "./command-execution-startup-BW4DetLg.js";
import { n as setProgramContext } from "./program-context-VEhF8JxS.js";
import { t as isCommandJsonOutputMode } from "./json-mode-BvX-XNl0.js";
import { t as forceFreePort } from "./ports-CSoH91Re.js";
import { t as registerProgramCommands } from "./command-registry-gmp47S_a.js";
import { t as configureProgramHelp } from "./help-C0QkhgXL.js";
import { t as createCliParseError } from "./error-output-EV6MZfsC.js";
import process$1 from "node:process";
import { Command, CommanderError } from "commander";
//#region src/cli/program/context.ts
/** Create a program context that resolves channel options once on first use. */
function createProgramContext() {
	let cachedChannelOptions;
	const getChannelOptions = () => {
		if (cachedChannelOptions === void 0) cachedChannelOptions = resolveCliChannelOptions();
		return cachedChannelOptions;
	};
	return {
		programVersion: VERSION,
		get channelOptions() {
			return getChannelOptions();
		},
		get messageChannelOptions() {
			return getChannelOptions().join("|");
		},
		get agentChannelOptions() {
			return ["last", ...getChannelOptions()].join("|");
		}
	};
}
//#endregion
//#region src/cli/program/openclaw-command.ts
var OpenClawCommand = class OpenClawCommand extends Command {
	createCommand(name) {
		return new OpenClawCommand(name);
	}
	error(message, errorOptions) {
		const restoreErrorCommand = setCommanderErrorCommand(this);
		try {
			return super.error(message, errorOptions);
		} catch (error) {
			if (error instanceof CommanderError && error.exitCode !== 0 && (isJsonOutputModeActive(process.argv) || isCommandJsonOutputMode(this, process.argv))) {
				if (!isCommandJsonOutputMode(this, process.argv) && !hasCommanderOptionToken(this, process.argv, /* @__PURE__ */ new Set(["--json"]), "flag")) {
					applyResolvedCommandOutputMode(false);
					throw error;
				}
				applyResolvedCommandOutputMode(true);
				throw createCliParseError(message, {
					argv: process.argv,
					commandPath: getCommanderErrorCommandPath(this),
					commandNames: getCommanderErrorCommandNames(this)
				}, { humanOutputWritten: true });
			}
			throw error;
		} finally {
			restoreErrorCommand();
		}
	}
	_outputHelpIfRequested(args) {
		const subcommandFact = getCommanderSubcommandFact(this, args);
		if (subcommandFact?.kind === "defer") return;
		if (subcommandFact?.kind === "unknown") this.error(`error: unknown command '${subcommandFact.name}'`, { code: "commander.unknownCommand" });
		super._outputHelpIfRequested(args);
	}
};
//#endregion
//#region src/cli/program/preaction.ts
const HELP_OR_VERSION_FLAGS = /* @__PURE__ */ new Set([
	"-h",
	"--help",
	"-V",
	"--version"
]);
function setProcessTitleForCommand(actionCommand) {
	let current = actionCommand;
	while (current.parent && current.parent.parent) current = current.parent;
	const name = current.name();
	const cliName = resolveCliName();
	if (!name || name === cliName) return;
	process.title = `${cliName}-${name}`;
}
function shouldAllowInvalidConfigForAction(actionCommand, commandPath) {
	return commandPath[0] === "update" || resolvePluginInstallInvalidConfigPolicy(resolvePluginInstallPreactionRequest({
		actionCommand,
		commandPath,
		argv: process.argv
	})) === "allow-plugin-recovery";
}
function getCliLogLevel(actionCommand) {
	if (actionCommand.getOptionValueSourceWithGlobals("logLevel") !== "cli") return;
	const logLevel = actionCommand.optsWithGlobals().logLevel;
	return typeof logLevel === "string" ? logLevel : void 0;
}
function getStateMigrationAgentId(actionCommand) {
	if (!actionCommand.options.some((option) => option.attributeName() === "agent")) return;
	const value = actionCommand.getOptionValueSource("agent") === "cli" ? actionCommand.getOptionValue("agent") : inheritOptionFromParent(actionCommand, "agent", "cli");
	return typeof value === "string" && value.trim() ? value.trim() : void 0;
}
function isBareParentDefaultHelpInvocation(actionCommand, argv) {
	if (!isParentDefaultHelpAction(actionCommand)) return false;
	const { commandPath } = resolveCliArgvInvocation(argv);
	const [primary, extra] = commandPath;
	if (extra !== void 0 || !primary) return false;
	return primary === actionCommand.name() || actionCommand.aliases().includes(primary);
}
function isGuidedConfigAction(actionCommand) {
	return actionCommand.name() === "config" && !actionCommand.parent?.parent;
}
function isGuidedConfigCommandPath(commandPath) {
	const [primary, secondary, extra] = commandPath;
	if (primary !== "config" || extra !== void 0) return false;
	return secondary !== "get" && secondary !== "set" && secondary !== "patch" && secondary !== "unset" && secondary !== "file" && secondary !== "schema" && secondary !== "validate";
}
function isGatewayRunAction(actionCommand) {
	if (actionCommand.name() === "gateway") return actionCommand.parent?.parent === null;
	return actionCommand.name() === "run" && actionCommand.parent?.name() === "gateway" && actionCommand.parent.parent?.parent === null;
}
/** Register global pre-action bootstrap hooks for every non-help command invocation. */
function registerPreActionHooks(program, programVersion) {
	program.hook("preAction", async (_thisCommand, actionCommand) => {
		setProcessTitleForCommand(actionCommand);
		const argv = process.argv;
		const helpOrVersionWasOptionValue = hasCommanderOptionToken(actionCommand, argv, HELP_OR_VERSION_FLAGS, "value");
		if (isHelpOrVersionInvocation(argv) && !helpOrVersionWasOptionValue || isBareParentDefaultHelpInvocation(actionCommand, argv)) return;
		const jsonOutputMode = isCommandJsonOutputMode(actionCommand, argv);
		const machineOutputMode = jsonOutputMode || isModelsPlainMachineOutput(argv, actionCommand);
		applyResolvedCommandOutputMode(jsonOutputMode, machineOutputMode);
		const { commandPath, startupPolicy } = resolveCliExecutionStartupContext({
			argv,
			commandPath: getCommanderCommandPath(actionCommand),
			jsonOutputMode,
			machineOutputMode,
			env: process.env
		});
		await applyCliExecutionStartupPresentation({
			startupPolicy,
			version: programVersion
		});
		const verbose = getVerboseFlag(argv, { includeDebug: true });
		setVerbose(verbose);
		const cliLogLevel = getCliLogLevel(actionCommand);
		if (cliLogLevel) process.env.OPENCLAW_LOG_LEVEL = cliLogLevel;
		if (!verbose) process.env.NODE_NO_WARNINGS ??= "1";
		if (isGuidedConfigAction(actionCommand) || isGuidedConfigCommandPath(commandPath)) return;
		if (startupPolicy.skipConfigGuard) {
			await ensureCliExecutionBootstrap({
				runtime: defaultRuntime,
				commandPath,
				startupPolicy,
				skipConfigGuard: true
			});
			return;
		}
		let beforeStateMigrations;
		let skipPristineStartupStateMigrations = false;
		let skipPristineCoreStateMigrations = false;
		let allowInvalid = shouldAllowInvalidConfigForAction(actionCommand, commandPath);
		if (isGatewayRunAction(actionCommand)) {
			const { prepareGatewayRunBootstrap, recheckGatewayRunBootstrap, wasPreparedGatewayRunCoreStatePristine, wasPreparedGatewayRunStatePristine } = await import("./pre-bootstrap-CDmFXqHn.js");
			const { resolveGatewayRunOptions } = await import("./run-options-BvaQ3F2u.js");
			const resolvedOptions = resolveGatewayRunOptions(actionCommand.opts(), actionCommand);
			allowInvalid ||= resolvedOptions.allowUnconfigured === true;
			const opts = {
				force: resolvedOptions.force === true,
				reset: resolvedOptions.reset === true
			};
			if (!await prepareGatewayRunBootstrap({
				opts,
				runtime: defaultRuntime
			})) return;
			skipPristineStartupStateMigrations = wasPreparedGatewayRunStatePristine();
			skipPristineCoreStateMigrations = wasPreparedGatewayRunCoreStatePristine();
			beforeStateMigrations = (snapshot) => recheckGatewayRunBootstrap({
				opts,
				runtime: defaultRuntime,
				...snapshot ? { snapshot } : {}
			});
		}
		const stateMigrationAgentId = getStateMigrationAgentId(actionCommand);
		if (stateMigrationAgentId) {
			const existingGuard = beforeStateMigrations;
			beforeStateMigrations = async (snapshot) => {
				if (snapshot) {
					const { isValidAgentId, normalizeAgentId } = await import("./normalization-core/agent-id.js");
					if (isValidAgentId(stateMigrationAgentId)) {
						const [{ listAgentIds }, { retainLegacyDefaultAgentId }] = await Promise.all([import("./agent-scope-config-BzhjOyi7.js"), import("./legacy.default-agent-owner-B9y09Tsk.js")]);
						const agentId = normalizeAgentId(stateMigrationAgentId);
						if (listAgentIds(snapshot.sourceConfig).includes(agentId)) retainLegacyDefaultAgentId(snapshot.sourceConfig, agentId);
					}
				}
				return await existingGuard?.(snapshot) ?? true;
			};
		}
		await ensureCliExecutionBootstrap({
			runtime: defaultRuntime,
			commandPath,
			startupPolicy,
			allowInvalid,
			...beforeStateMigrations ? { beforeStateMigrations } : {},
			...skipPristineStartupStateMigrations ? { skipPristineStartupStateMigrations: true } : {},
			...skipPristineCoreStateMigrations ? { skipPristineCoreStateMigrations: true } : {}
		});
		if (beforeStateMigrations && isGatewayRunAction(actionCommand)) {
			const { reloadTrustedGatewayRunEnvironment } = await import("./pre-bootstrap-CDmFXqHn.js");
			await reloadTrustedGatewayRunEnvironment({ runtime: defaultRuntime });
		}
	});
}
//#endregion
//#region src/cli/program/build-program.ts
function buildProgram() {
	const program = new OpenClawCommand();
	program.enablePositionalOptions();
	program.exitOverride((err) => {
		process$1.exitCode = typeof err.exitCode === "number" ? err.exitCode : 1;
		throw err;
	});
	const ctx = createProgramContext();
	const argv = process$1.argv;
	setProgramContext(program, ctx);
	configureProgramHelp(program, ctx);
	registerPreActionHooks(program, ctx.programVersion);
	registerProgramCommands(program, ctx, argv);
	return program;
}
//#endregion
export { buildProgram, forceFreePort };
