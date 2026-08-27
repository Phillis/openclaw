import { a as resolveAgentModelPrimaryValue, i as resolveAgentModelFallbackValues } from "./model-input-ILUprkGk.js";
import "./agent-scope-DigoIwHb.js";
import { s as resolveAgentConfig } from "./agent-scope-config-CUBiGmG3.js";
import { a as createModelVisibilityPolicyWithFallbacks } from "./model-selection-shared-I5TmV9jL.js";
import { n as resolveConfiguredModelFallbacks } from "./model-selection-resolve-DHCroTxz.js";
//#region src/agents/model-visibility-policy.ts
/**
* Builds model visibility policies while retaining configured automatic fallbacks.
*/
const RUNTIME_MODEL_VISIBILITY_NORMALIZATION = {
	allowManifestNormalization: true,
	allowPluginNormalization: true
};
function resolveAdditionalConfiguredModelRefs(params) {
	const defaults = params.cfg.agents?.defaults;
	const agent = params.agentId ? resolveAgentConfig(params.cfg, params.agentId) : void 0;
	return [
		resolveAgentModelPrimaryValue(defaults?.model),
		...resolveAgentModelFallbackValues(defaults?.model),
		resolveAgentModelPrimaryValue(agent?.model),
		...resolveAgentModelFallbackValues(agent?.model),
		...Object.keys(defaults?.models ?? {}),
		...Object.keys(agent?.models ?? {}),
		agent?.utilityModel ?? defaults?.utilityModel,
		resolveAgentModelPrimaryValue(defaults?.imageModel),
		...resolveAgentModelFallbackValues(defaults?.imageModel),
		resolveAgentModelPrimaryValue(defaults?.pdfModel),
		...resolveAgentModelFallbackValues(defaults?.pdfModel)
	].filter((ref) => typeof ref === "string");
}
function createModelVisibilityPolicy(params) {
	return createModelVisibilityPolicyWithFallbacks({
		cfg: params.cfg,
		catalog: params.catalog,
		defaultProvider: params.defaultProvider,
		defaultModel: params.defaultModel,
		agentId: params.agentId,
		fallbackModels: resolveConfiguredModelFallbacks({
			cfg: params.cfg,
			agentId: params.agentId
		}),
		additionalConfiguredModelRefs: resolveAdditionalConfiguredModelRefs(params),
		allowManifestNormalization: params.allowManifestNormalization ?? false,
		allowPluginNormalization: params.allowPluginNormalization ?? false,
		manifestPlugins: params.manifestPlugins
	});
}
//#endregion
export { createModelVisibilityPolicy as n, RUNTIME_MODEL_VISIBILITY_NORMALIZATION as t };
