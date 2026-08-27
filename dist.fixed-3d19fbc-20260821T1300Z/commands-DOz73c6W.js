import { c as pluginCommands, l as resolveCompatibilityPluginCommandRegistry } from "./command-registration-C98jrNmA.js";
import { t as listRegisteredPluginCommands } from "./plugin-command-registry-Be4XFGiW.js";
import { t as executeRegisteredPluginCommand } from "./plugin-command-execution-ZrEX7g7Q.js";
import { t as matchRegisteredPluginCommand } from "./plugin-command-matcher-HWL--X0R.js";
//#region src/plugins/commands.ts
/** Match one compatibility command invocation against the current command registry. */
function matchPluginCommand(commandBody, options = {}) {
	return matchRegisteredPluginCommand({
		commands: listRegisteredPluginCommands(resolveCompatibilityPluginCommandRegistry()),
		commandBody,
		channel: options.channel,
		aliasScope: { kind: "all" }
	});
}
async function executePluginCommand(params) {
	return await executeRegisteredPluginCommand(resolveCompatibilityPluginCommandRegistry(), params);
}
/** List registered plugin commands for help and command discovery. */
function listPluginCommands() {
	return Array.from(pluginCommands.values()).map((command) => ({
		name: command.name,
		description: command.description,
		pluginId: command.pluginId,
		acceptsArgs: command.acceptsArgs ?? false
	}));
}
//#endregion
export { listPluginCommands as n, matchPluginCommand as r, executePluginCommand as t };
