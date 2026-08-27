import { p as normalizeOllamaCloudModelId } from "./defaults-BiE2_Zq0.js";
//#region extensions/ollama/src/model-reasoning.ts
function supportsOllamaCloudFullThinkingEffort(modelId) {
	const normalized = normalizeOllamaCloudModelId(modelId);
	return normalized === "glm-5.2" || /^deepseek-v4-(?:flash|pro)$/.test(normalized);
}
//#endregion
export { supportsOllamaCloudFullThinkingEffort as t };
