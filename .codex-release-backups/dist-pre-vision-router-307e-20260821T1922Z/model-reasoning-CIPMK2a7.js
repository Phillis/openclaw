//#region extensions/ollama/src/model-reasoning.ts
function supportsOllamaCloudFullThinkingEffort(modelId) {
	const normalized = normalizeOllamaCloudModelId(modelId);
	return normalized === "glm-5.2" || /^deepseek-v4-(?:flash|pro)$/.test(normalized);
}
function normalizeOllamaCloudModelId(modelId) {
	return modelId.trim().toLowerCase().replace(/(?::cloud|-cloud)$/, "");
}
//#endregion
export { supportsOllamaCloudFullThinkingEffort as t };
