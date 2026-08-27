import { v as uniqueStrings } from "./string-normalization-e_fvmxMf.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import { d as normalizeProviderId } from "./provider-model-shared-Br4ZCuuk.js";
//#region extensions/ollama/src/model-id.ts
const OLLAMA_PROVIDER_ID = "ollama";
function uniqueModelPrefixCandidates(providerId) {
	return uniqueStrings([
		providerId,
		normalizeProviderId(providerId ?? ""),
		OLLAMA_PROVIDER_ID
	].map((candidate) => candidate?.trim()).filter((candidate) => Boolean(candidate)));
}
function normalizeOllamaWireModelId(modelId, providerId) {
	const trimmed = modelId.trim();
	if (!trimmed) return trimmed;
	for (const candidate of uniqueModelPrefixCandidates(providerId)) {
		const prefix = `${candidate}/`;
		if (trimmed.startsWith(prefix)) return trimmed.slice(prefix.length);
	}
	return trimmed;
}
//#endregion
export { normalizeOllamaWireModelId as t };
