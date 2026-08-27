import { r as resolveAgentModelFallbackValues } from "./model-input-ekSMR50U.js";
import { u as resolveAgentModelFallbacksOverride } from "./agent-scope-BizOtGGz.js";
import { i as buildModelAliasIndex, m as resolveAllowedModelRefFromAliasIndex, s as getModelRefStatusWithFallbackModels } from "./model-selection-shared-DT9x3Cg2.js";
//#region src/agents/model-selection-resolve.ts
/**
* Model selection resolution facade.
*
* This module exposes model-selection helpers that need default fallback model
* handling before checking aliases, allowlists, catalogs, and plugin manifests.
*/
/** Resolve agent-owned fallback overrides without loading the full selection facade. */
function resolveConfiguredModelFallbacks(params) {
	if (params.agentId) {
		const override = resolveAgentModelFallbacksOverride(params.cfg, params.agentId);
		if (override !== void 0) return override;
	}
	return resolveAgentModelFallbackValues(params.cfg.agents?.defaults?.model);
}
/** Returns whether a normalized model ref is available, allowed, or fallback-backed. */
function getModelRefStatus(params) {
	const { cfg, catalog, ref, defaultProvider, defaultModel, agentId, manifestPlugins } = params;
	return getModelRefStatusWithFallbackModels({
		cfg,
		catalog,
		ref,
		defaultProvider,
		defaultModel,
		agentId,
		fallbackModels: resolveConfiguredModelFallbacks({
			cfg,
			agentId
		}),
		manifestPlugins
	});
}
/** Resolves a raw model string into an allowed model ref or an explanatory error. */
function resolveAllowedModelRefCore(params) {
	const aliasIndex = buildModelAliasIndex({
		cfg: params.cfg,
		defaultProvider: params.defaultProvider,
		agentId: params.agentId,
		manifestPlugins: params.manifestPlugins
	});
	return resolveAllowedModelRefFromAliasIndex({
		cfg: params.cfg,
		raw: params.raw,
		defaultProvider: params.defaultProvider,
		aliasIndex,
		manifestPlugins: params.manifestPlugins,
		getStatus: (ref) => getModelRefStatus({
			cfg: params.cfg,
			catalog: params.catalog,
			ref,
			defaultProvider: params.defaultProvider,
			defaultModel: params.defaultModel,
			agentId: params.agentId,
			manifestPlugins: params.manifestPlugins
		})
	});
}
//#endregion
export { resolveAllowedModelRefCore as n, resolveConfiguredModelFallbacks as r, getModelRefStatus as t };
