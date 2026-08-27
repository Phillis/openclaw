import { S as selectApplicableRuntimeConfig, a as getRuntimeConfigSnapshot, c as getRuntimeConfigSourceSnapshot } from "./runtime-snapshot-Dp7mvsA3.js";
import "./config-Dl8DJbzM.js";
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
