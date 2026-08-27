import { n as isTruthyEnvValue } from "./env-y-_yRnBE.js";
import { t as resolveCliCommandPathPolicy } from "./command-path-policy-DJ20rW4U.js";
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
	const suppressDoctorStdout = params.jsonOutputMode || commandPolicy.ownsProtocolStdout;
	const configGuard = typeof commandPolicy.configGuard === "function" ? commandPolicy.configGuard({
		argv: params.argv ?? [],
		commandPath: params.commandPath
	}) : commandPolicy.configGuard;
	return {
		suppressDoctorStdout,
		hideBanner: isTruthyEnvValue((params.env ?? process.env).OPENCLAW_HIDE_BANNER) || commandPolicy.hideBanner,
		skipConfigGuard: configGuard === "skip" || configGuard === "when-suppressed" && suppressDoctorStdout,
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
