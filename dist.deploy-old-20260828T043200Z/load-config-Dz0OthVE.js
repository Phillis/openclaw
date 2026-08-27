import { n as getRuntimeConfig } from "./io-DlN5njvP.js";
import { T as setRuntimeConfigSnapshot, c as getRuntimeConfigSourceSnapshot } from "./runtime-snapshot-Cv5MaU8U.js";
import "./config-B2bSneS2.js";
import { u as getModelsCommandSecretTargetIds } from "./command-secret-targets-DLC-aqND.js";
import { t as resolveCommandConfigWithSecrets } from "./command-config-resolution-DHP7AXSk.js";
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
