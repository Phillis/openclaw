import { f as isSimpleCommandHelpInvocation } from "./argv-CgA2urTO.js";
import { t as resolveCliArgvInvocation } from "./argv-invocation-CtNEO_uG.js";
import { n as VERSION } from "./version-o4XN9fka.js";
import { t as configureProgramHelp } from "./help-DVN9va4K.js";
import { Command, CommanderError } from "commander";
//#region src/cli/setup-onboard-configure-help-fast-path.ts
const SETUP_ONBOARD_CONFIGURE_HELP_COMMANDS = /* @__PURE__ */ new Set([
	"setup",
	"onboard",
	"configure"
]);
function resolveSetupOnboardConfigureHelpCommand(argv) {
	const invocation = resolveCliArgvInvocation(argv);
	if (invocation.commandPath.length !== 1 || !isSimpleCommandHelpInvocation(argv, SETUP_ONBOARD_CONFIGURE_HELP_COMMANDS)) return null;
	const command = invocation.commandPath[0];
	return SETUP_ONBOARD_CONFIGURE_HELP_COMMANDS.has(command) ? command : null;
}
function createHelpContext() {
	return {
		programVersion: VERSION,
		channelOptions: [],
		messageChannelOptions: "",
		agentChannelOptions: "last"
	};
}
async function registerHelpCommand(program, command) {
	if (command === "setup") {
		const { registerSetupCommand } = await import("./register.setup-opodCr6f.js");
		registerSetupCommand(program);
		return;
	}
	if (command === "onboard") {
		const { registerOnboardCommand } = await import("./register.onboard-D-cP4FeF.js");
		registerOnboardCommand(program);
		return;
	}
	const { registerConfigureCommand } = await import("./register.configure-CAzq9fhX.js");
	registerConfigureCommand(program);
}
async function tryOutputSetupOnboardConfigureHelp(argv) {
	const command = resolveSetupOnboardConfigureHelpCommand(argv);
	if (!command) return false;
	const program = new Command();
	program.enablePositionalOptions();
	program.exitOverride();
	configureProgramHelp(program, createHelpContext());
	await registerHelpCommand(program, command);
	try {
		await program.parseAsync(argv);
	} catch (error) {
		if (!(error instanceof CommanderError)) throw error;
		process.exitCode = error.exitCode;
	}
	return true;
}
//#endregion
export { tryOutputSetupOnboardConfigureHelp };
