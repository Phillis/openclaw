import { n as resolveCliName } from "./cli-name-CVj-3DWf.js";
import { r as defaultRuntime } from "./runtime-DtFIMC-W.js";
import { l as isHelpOrVersionInvocation, o as getVerboseFlag } from "./argv-CgA2urTO.js";
import { t as resolveCliArgvInvocation } from "./argv-invocation-CtNEO_uG.js";
import { r as setVerbose } from "./global-state-BCtvHc7P.js";
import { n as VERSION } from "./version-o4XN9fka.js";
import "./globals-CAwGc4B6.js";
import { t as applyResolvedCommandOutputMode } from "./json-output-mode-Bg5EcQwj.js";
import { n as resolvePluginInstallPreactionRequest, t as resolvePluginInstallInvalidConfigPolicy } from "./plugin-install-config-policy-C7KEW015.js";
import { n as resolveCliChannelOptions } from "./channel-options-dp4EyufK.js";
import { n as isParentDefaultHelpAction } from "./parent-default-help-DQUF3qKA.js";
import { n as ensureCliExecutionBootstrap, r as resolveCliExecutionStartupContext, t as applyCliExecutionStartupPresentation } from "./command-execution-startup-BzWOoDYP.js";
import { n as setProgramContext } from "./program-context-VEhF8JxS.js";
import { i as setCommanderErrorCommand, r as hasCommanderOptionValue, t as getCommanderCommandPath } from "./commander-parse-facts-BpRwmsnA.js";
import { t as isCommandJsonOutputMode } from "./json-mode-rPUbIBub.js";
import { t as forceFreePort } from "./ports-C5jOVUyU.js";
import { t as registerProgramCommands } from "./command-registry-BhoKisHS.js";
import { t as configureProgramHelp } from "./help-DVN9va4K.js";
import process$1 from "node:process";
import { Command } from "commander";
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
		} finally {
			restoreErrorCommand();
		}
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
		const helpOrVersionWasOptionValue = hasCommanderOptionValue(actionCommand, argv, HELP_OR_VERSION_FLAGS);
		if (isHelpOrVersionInvocation(argv) && !helpOrVersionWasOptionValue || isBareParentDefaultHelpInvocation(actionCommand, argv)) return;
		const jsonOutputMode = isCommandJsonOutputMode(actionCommand, argv);
		applyResolvedCommandOutputMode(jsonOutputMode);
		const { commandPath, startupPolicy } = resolveCliExecutionStartupContext({
			argv,
			commandPath: getCommanderCommandPath(actionCommand),
			jsonOutputMode,
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
			const { prepareGatewayRunBootstrap, recheckGatewayRunBootstrap, wasPreparedGatewayRunCoreStatePristine, wasPreparedGatewayRunStatePristine } = await import("./pre-bootstrap-B1LKN_Nd.js");
			const { resolveGatewayRunOptions } = await import("./run-options-0UUJEk6w.js");
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
		await ensureCliExecutionBootstrap({
			runtime: defaultRuntime,
			commandPath,
			startupPolicy,
			allowInvalid,
			...beforeStateMigrations ? { beforeStateMigrations } : {},
			...skipPristineStartupStateMigrations ? { skipPristineStartupStateMigrations: true } : {},
			...skipPristineCoreStateMigrations ? { skipPristineCoreStateMigrations: true } : {}
		});
		if (beforeStateMigrations) {
			const { reloadTrustedGatewayRunEnvironment } = await import("./pre-bootstrap-B1LKN_Nd.js");
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
