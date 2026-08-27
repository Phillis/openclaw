import { S as selectApplicableRuntimeConfig, a as getRuntimeConfigSnapshot, c as getRuntimeConfigSourceSnapshot } from "./runtime-snapshot-DIuCzlel.js";
import "./config-CfeGo4K4.js";
//#region src/agents/tool-runtime-config.ts
function resolveAgentRuntimeToolConfig(inputConfig) {
	const runtimeConfig = getRuntimeConfigSnapshot() ?? void 0;
	if (!runtimeConfig) return inputConfig;
	if (!inputConfig || inputConfig === runtimeConfig) return runtimeConfig;
	const runtimeSourceConfig = getRuntimeConfigSourceSnapshot() ?? void 0;
	if (!runtimeSourceConfig) return inputConfig;
	return selectApplicableRuntimeConfig({
		inputConfig,
		runtimeConfig,
		runtimeSourceConfig
	});
}
//#endregion
export { resolveAgentRuntimeToolConfig as t };
