import { n as normalizeAgentModelRefForConfig, r as resolveAgentModelFallbackValues, t as normalizeAgentModelMapForConfig } from "./model-input-ekSMR50U.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { b as tryResolveLegacyCompatibilityAgentId, d as resolveAgentWorkspaceDir, h as resolveSoleAgentId, l as resolveAgentDir } from "./agent-scope-config-BdXMWufB.js";
import "./legacy.default-agent-owner-D8ws5hED.js";
import { t as applyPrimaryModel } from "./provider-model-primary-DBnbBIB3.js";
import { i as ensureWorkspaceAndSessions } from "./onboard-helpers-DQoIxFmS.js";
//#region src/commands/onboard-agent-target.ts
function resolveOnboardingAgentTarget(config, explicitAgentId) {
	const agentId = normalizeAgentId(explicitAgentId ?? tryResolveLegacyCompatibilityAgentId(config) ?? resolveSoleAgentId(config));
	return {
		agentId,
		agentDir: resolveAgentDir(config, agentId),
		workspaceDir: resolveAgentWorkspaceDir(config, agentId)
	};
}
/** Resolve the configured System Agent as the owner of onboarding effects. */
function resolveSystemAgentOnboardingTarget(config) {
	return resolveOnboardingAgentTarget(config, config.agents?.defaults?.systemAgent?.agentId);
}
async function ensureOnboardingAgentWorkspace(target, runtime, options) {
	return ensureWorkspaceAndSessions(target.workspaceDir, runtime, {
		...options,
		agentId: target.agentId
	});
}
function applyOnboardingPrimaryModel(config, target, model) {
	const entry = config.agents?.entries?.[target.agentId];
	if (entry?.model === void 0) return applyPrimaryModel(config, model);
	const primary = normalizeAgentModelRefForConfig(model);
	const fallbackValues = resolveAgentModelFallbackValues(entry.model).map((fallback) => normalizeAgentModelRefForConfig(fallback));
	const models = normalizeAgentModelMapForConfig(entry.models ?? {});
	return {
		...config,
		agents: {
			...config.agents,
			entries: {
				...config.agents?.entries,
				[target.agentId]: {
					...entry,
					model: {
						...fallbackValues.length > 0 ? { fallbacks: fallbackValues } : {},
						primary
					},
					models: {
						...models,
						[primary]: models[primary] ?? {}
					}
				}
			}
		}
	};
}
//#endregion
export { resolveSystemAgentOnboardingTarget as i, ensureOnboardingAgentWorkspace as n, resolveOnboardingAgentTarget as r, applyOnboardingPrimaryModel as t };
