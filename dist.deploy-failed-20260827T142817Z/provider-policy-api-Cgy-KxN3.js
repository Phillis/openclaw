import { r as isCloudModelRef } from "./model-catalog-refs-BdjEHOKQ.js";
import { d as normalizeProviderId } from "./provider-model-shared-T9VIzWk7.js";
import { o as OLLAMA_DEFAULT_BASE_URL } from "./defaults-BNbpVpwQ.js";
import { t as supportsOllamaCloudFullThinkingEffort } from "./model-reasoning-CIPMK2a7.js";
//#region extensions/ollama/provider-policy-api.ts
const OLLAMA_REASONING_THINKING_PROFILE = {
	levels: [
		{ id: "off" },
		{ id: "low" },
		{ id: "medium" },
		{ id: "high" },
		{ id: "max" }
	],
	defaultLevel: "off"
};
const OLLAMA_NON_REASONING_THINKING_PROFILE = {
	levels: [{ id: "off" }],
	defaultLevel: "off"
};
/**
* Provider policy surface for Ollama: normalize provider configs used by
* core defaults/normalizers. This runs during config defaults application and
* normalization paths (not Zod validation).
*/
function normalizeConfig({ provider, providerConfig }) {
	if (!providerConfig || typeof providerConfig !== "object") return providerConfig;
	if ((provider ?? "").trim().toLowerCase() !== "ollama") return providerConfig;
	const next = { ...providerConfig };
	if (typeof next.baseUrl !== "string" || !next.baseUrl.trim()) next.baseUrl = OLLAMA_DEFAULT_BASE_URL;
	if (!Array.isArray(next.models)) next.models = [];
	return next;
}
/**
* Ollama's local and cloud providers do not normalize resolved models.
* Skip full plugin activation when the model-list path asks for that no-op.
*/
function projectConfiguredModelRow(ctx) {
	const provider = ctx.provider.trim().toLowerCase();
	return provider === "ollama" || provider === "ollama-cloud" ? null : void 0;
}
function resolveThinkingProfile({ modelId, provider, reasoning }) {
	const isCloudRoute = normalizeProviderId(provider) === "ollama-cloud" || isCloudModelRef(modelId);
	return reasoning === true || reasoning === void 0 && isCloudRoute && supportsOllamaCloudFullThinkingEffort(modelId) ? OLLAMA_REASONING_THINKING_PROFILE : OLLAMA_NON_REASONING_THINKING_PROFILE;
}
//#endregion
export { projectConfiguredModelRow as n, resolveThinkingProfile as r, normalizeConfig as t };
