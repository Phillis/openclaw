import { n as isTruthyEnvValue } from "./env-ChWDbSFK.js";
import { t as resolveCliCommandPathPolicy } from "./command-path-policy-DKqm4ZZQ.js";
//#region src/cli/command-startup-policy.ts
function shouldLoadPlugins(params) {
	const loadPlugins = params.loadPlugins;
	if (typeof loadPlugins === "function") return loadPlugins({
		argv: params.argv ?? [],
		commandPath: params.commandPath,
		jsonOutputMode: params.jsonOutputMode
	});
	return loadPlugins === "always" || loadPlugins === "text-only" && !params.jsonOutputMode;
}
function resolveCliStartupPolicy(params) {
	const commandPolicy = resolveCliCommandPathPolicy(params.commandPath);
	const machineOutputMode = params.jsonOutputMode || params.machineOutputMode === true;
	const suppressDoctorStdout = machineOutputMode || commandPolicy.ownsProtocolStdout;
	const configGuard = typeof commandPolicy.configGuard === "function" ? commandPolicy.configGuard({
		argv: params.argv ?? [],
		commandPath: params.commandPath
	}) : commandPolicy.configGuard;
	const env = params.env ?? process.env;
	return {
		suppressDoctorStdout,
		hideBanner: machineOutputMode || commandPolicy.hideBanner || isTruthyEnvValue(env.OPENCLAW_HIDE_BANNER),
		skipConfigGuard: configGuard === "skip" || configGuard === "when-suppressed" && suppressDoctorStdout,
		...configGuard === "validate" ? { validateConfigOnly: true } : {},
		loadPlugins: shouldLoadPlugins({
			argv: params.argv,
			commandPath: params.commandPath,
			jsonOutputMode: params.jsonOutputMode,
			loadPlugins: commandPolicy.loadPlugins
		}),
		pluginRegistry: commandPolicy.pluginRegistry
	};
}
//#endregion
export { resolveCliStartupPolicy as t };
