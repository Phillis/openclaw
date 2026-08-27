import { r as getRuntimeConfig } from "./io-BTBpQ7uO.js";
import { T as setRuntimeConfigSnapshot, c as getRuntimeConfigSourceSnapshot } from "./runtime-snapshot-DIuCzlel.js";
import "./config-CfeGo4K4.js";
import { u as getModelsCommandSecretTargetIds } from "./command-secret-targets-JklITWYj.js";
import { t as resolveCommandConfigWithSecrets } from "./command-config-resolution-C4AGlO6v.js";
//#region src/commands/models/load-config.ts
/** Config loader for model commands with command-scoped secret resolution. */
/** Loads config, resolves model command secrets, and preserves the source snapshot. */
async function loadModelsConfigWithSource(params) {
	const runtimeConfig = getRuntimeConfig(params.skipPluginValidation ? { skipPluginValidation: true } : void 0);
	const sourceConfig = getRuntimeConfigSourceSnapshot() ?? runtimeConfig;
	const { resolvedConfig, diagnostics } = await resolveCommandConfigWithSecrets({
		config: runtimeConfig,
		commandName: params.commandName,
		targetIds: getModelsCommandSecretTargetIds(),
		runtime: params.runtime
	});
	setRuntimeConfigSnapshot(resolvedConfig, sourceConfig);
	return {
		sourceConfig,
		resolvedConfig,
		diagnostics
	};
}
/** Loads the resolved model command config when callers do not need source metadata. */
async function loadModelsConfig(params) {
	return (await loadModelsConfigWithSource(params)).resolvedConfig;
}
//#endregion
export { loadModelsConfigWithSource as n, loadModelsConfig as t };
