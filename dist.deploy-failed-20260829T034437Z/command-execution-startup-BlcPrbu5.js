import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.js";
import { n as loggingState } from "./state-1gznqwxe.js";
import { t as resolveCliArgvInvocation } from "./argv-invocation-DXuFeGZ6.js";
import { a as routeLogsToStderr } from "./console-SZn871dT.js";
import { t as resolveCliCommandPathPolicy } from "./command-path-policy-DKqm4ZZQ.js";
import { t as resolveCliStartupPolicy } from "./command-startup-policy-B4oVNNcS.js";
import { t as measureCliCommandStartup } from "./command-startup-timing-C3y3vrH_.js";
//#region src/cli/plugin-registry-loader.ts
const pluginRegistryModuleLoader = createLazyImportLoader(() => import("./plugin-registry-B2rmHNCb.js"));
function loadPluginRegistryModule() {
	return pluginRegistryModuleLoader.load();
}
/** Load the CLI plugin registry and optionally route activation logs to stderr. */
async function ensureCliPluginRegistryLoaded(params) {
	const { ensurePluginRegistryLoaded } = await measureCliCommandStartup("plugin-registry-module-import", loadPluginRegistryModule);
	await measureCliCommandStartup("plugin-registry-runtime-load", () => {
		const previousForceStderr = loggingState.forceConsoleToStderr;
		if (params.routeLogsToStderr) loggingState.forceConsoleToStderr = true;
		try {
			ensurePluginRegistryLoaded({
				scope: params.scope,
				...params.config ? { config: params.config } : {},
				...params.activationSourceConfig ? { activationSourceConfig: params.activationSourceConfig } : {}
			});
		} finally {
			loggingState.forceConsoleToStderr = previousForceStderr;
		}
	});
}
//#endregion
//#region src/cli/command-bootstrap.ts
const configGuardModuleLoader = createLazyImportLoader(() => import("./config-guard-DRP9MsFc.js"));
function loadConfigGuardModule() {
	return configGuardModuleLoader.load();
}
/** Run the lazy command bootstrap steps selected by command policy. */
async function ensureCliCommandBootstrap(params) {
	if (!params.skipConfigGuard) await measureCliCommandStartup("config-ready", async () => {
		const { ensureConfigReady } = await loadConfigGuardModule();
		await ensureConfigReady({
			runtime: params.runtime,
			commandPath: params.commandPath,
			measure: (stage, run) => measureCliCommandStartup(stage, run),
			...params.allowInvalid ? { allowInvalid: true } : {},
			...params.validateConfigOnly ? { validateConfigOnly: true } : {},
			...params.beforeStateMigrations ? { beforeStateMigrations: params.beforeStateMigrations } : {},
			...params.suppressDoctorStdout ? { suppressDoctorStdout: true } : {},
			...params.skipPristineStartupStateMigrations ? { skipPristineStartupStateMigrations: true } : {},
			...params.skipPristineCoreStateMigrations ? { skipPristineCoreStateMigrations: true } : {}
		});
	});
	if (!params.loadPlugins) return;
	const pluginRegistryLoadPolicy = params.pluginRegistry ?? resolveCliCommandPathPolicy(params.commandPath).pluginRegistry;
	await measureCliCommandStartup("plugin-registry", () => ensureCliPluginRegistryLoaded({
		scope: pluginRegistryLoadPolicy.scope,
		routeLogsToStderr: params.suppressDoctorStdout
	}));
}
//#endregion
//#region src/cli/command-execution-startup.ts
const hasJsonFlag = (argv) => argv.some((arg) => arg === "--json" || arg.startsWith("--json="));
const hasVersionFlag = (argv) => argv.some((arg) => arg === "--version" || arg === "-V");
function resolveCliExecutionStartupContext(params) {
	const invocation = resolveCliArgvInvocation(params.argv);
	const commandPath = params.commandPath ?? invocation.commandPath;
	return {
		invocation,
		commandPath,
		startupPolicy: resolveCliStartupPolicy({
			argv: params.argv,
			commandPath,
			jsonOutputMode: params.jsonOutputMode,
			machineOutputMode: params.machineOutputMode,
			env: params.env
		})
	};
}
async function applyCliExecutionStartupPresentation(params) {
	if (params.startupPolicy.suppressDoctorStdout && params.routeLogsToStderrOnSuppress !== false) routeLogsToStderr();
	if (params.startupPolicy.hideBanner || params.showBanner === false || !params.version) return;
	if (params.argv && (hasJsonFlag(params.argv) || hasVersionFlag(params.argv))) return;
	const { emitCliBanner } = await import("./banner-somSRpoB.js");
	if (params.argv) {
		emitCliBanner(params.version, { argv: params.argv });
		return;
	}
	emitCliBanner(params.version);
}
async function ensureCliExecutionBootstrap(params) {
	await ensureCliCommandBootstrap({
		runtime: params.runtime,
		commandPath: params.commandPath,
		suppressDoctorStdout: params.startupPolicy.suppressDoctorStdout,
		allowInvalid: params.allowInvalid,
		...params.beforeStateMigrations ? { beforeStateMigrations: params.beforeStateMigrations } : {},
		loadPlugins: params.loadPlugins ?? params.startupPolicy.loadPlugins,
		pluginRegistry: params.startupPolicy.pluginRegistry,
		skipConfigGuard: params.skipConfigGuard ?? params.startupPolicy.skipConfigGuard,
		...params.validateConfigOnly ?? params.startupPolicy.validateConfigOnly ? { validateConfigOnly: true } : {},
		...params.skipPristineStartupStateMigrations ? { skipPristineStartupStateMigrations: true } : {},
		...params.skipPristineCoreStateMigrations ? { skipPristineCoreStateMigrations: true } : {}
	});
}
//#endregion
export { ensureCliExecutionBootstrap as n, resolveCliExecutionStartupContext as r, applyCliExecutionStartupPresentation as t };
