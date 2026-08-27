import { i as resolveAgentModelFallbackValues } from "./model-input-ILUprkGk.js";
import { u as resolveAgentModelFallbacksOverride } from "./agent-scope-DigoIwHb.js";
import { i as buildModelAliasIndex, m as resolveAllowedModelRefFromAliasIndex, s as getModelRefStatus } from "./model-selection-shared-I5TmV9jL.js";
//#region src/agents/model-selection-resolve.ts
/**
* Model selection resolution facade.
*
* This module resolves configured fallbacks and explicit model selections.
*/
/** Resolve agent-owned fallback overrides without loading the full selection facade. */
function resolveConfiguredModelFallbacks(params) {
	if (params.agentId) {
		const override = resolveAgentModelFallbacksOverride(params.cfg, params.agentId);
		if (override !== void 0) return override;
	}
	return resolveAgentModelFallbackValues(params.cfg.agents?.defaults?.model);
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
		agentId: params.agentId,
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
export { resolveConfiguredModelFallbacks as n, resolveAllowedModelRefCore as t };
