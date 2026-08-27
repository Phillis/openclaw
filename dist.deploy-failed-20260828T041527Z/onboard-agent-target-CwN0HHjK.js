import { m as shortenHomePath } from "./utils-Bw16L5tB.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { i as resolveAgentModelFallbackValues, n as normalizeAgentModelRefForConfig, s as toAgentModelListLike, t as normalizeAgentModelMapForConfig } from "./model-input-ILUprkGk.js";
import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
import { C as tryResolveLegacyCompatibilityAgentId, _ as resolveMutableAgentEntry, f as resolveAgentWorkspaceDir, l as resolveAgentDir, r as listAgentEntries, v as resolveSoleAgentId, y as toAgentEntriesRecord } from "./agent-scope-config-CUBiGmG3.js";
import "./legacy.default-agent-owner-CL_-T11Y.js";
import { t as applyPrimaryModel } from "./provider-model-primary-BB_KE6Xl.js";
import { r as ensureWorkspaceAndSessions } from "./onboard-helpers-DsV_5p6H.js";
import { isDeepStrictEqual } from "node:util";
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
/** Resolve onboarding setup to its existing or pending first-agent owner. */
function resolveOnboardingSetupTarget(config, pendingAgent) {
	if (config.agents?.ownership === "explicit") return resolveSystemAgentOnboardingTarget(config);
	if (pendingAgent) return {
		...resolveOnboardingAgentTarget(config, pendingAgent.name),
		workspaceDir: pendingAgent.workspaceDir
	};
	return resolveOnboardingAgentTarget(config);
}
async function ensureOnboardingAgentWorkspace(target, runtime, options) {
	try {
		return await ensureWorkspaceAndSessions(target.workspaceDir, runtime, {
			...options,
			agentId: target.agentId
		});
	} catch (error) {
		throw new Error(`Workspace provisioning for agent "${target.agentId}" at ${shortenHomePath(target.workspaceDir)} failed: ${formatErrorMessage(error)}`, { cause: error });
	}
}
function replaceOnboardingAgentEntry(config, updated, target, nextEntry) {
	const entries = listAgentEntries(config);
	const index = entries.findIndex((entry) => normalizeAgentId(entry.id) === target.agentId);
	const nextEntries = [...entries];
	const replacement = {
		id: index >= 0 ? entries[index].id : target.agentId,
		...nextEntry
	};
	if (index >= 0) nextEntries[index] = replacement;
	else nextEntries.push(replacement);
	const { list: _list, entries: _entries, ...agents } = config.agents ?? {};
	return {
		...updated,
		agents: {
			...agents,
			entries: toAgentEntriesRecord(nextEntries)
		}
	};
}
function applyOnboardingPrimaryModel(config, target, model) {
	const entry = resolveMutableAgentEntry(config, target.agentId);
	if (entry?.model === void 0 && config.agents?.ownership !== "explicit") return applyPrimaryModel(config, model);
	const primary = normalizeAgentModelRefForConfig(model);
	const fallbackValues = resolveAgentModelFallbackValues(entry?.model).map((fallback) => normalizeAgentModelRefForConfig(fallback));
	const models = normalizeAgentModelMapForConfig(entry?.models ?? {});
	return replaceOnboardingAgentEntry(config, config, target, {
		...entry,
		model: {
			...fallbackValues.length > 0 ? { fallbacks: fallbackValues } : {},
			primary
		},
		models: {
			...models,
			[primary]: models[primary] ?? {}
		}
	});
}
/** Expose one agent's effective model settings through the defaults-based provider contract. */
function prepareAgentModelDefaults(config, target) {
	const entry = resolveMutableAgentEntry(config, target.agentId);
	return {
		...config,
		agents: {
			...config.agents,
			defaults: {
				...config.agents?.defaults,
				...entry?.model !== void 0 ? { model: entry.model } : {},
				...entry?.models !== void 0 ? { models: entry.models } : {},
				...entry?.modelPolicy !== void 0 ? { modelPolicy: entry.modelPolicy } : {}
			}
		}
	};
}
/** Apply a model-default mutation to one agent without flattening it globally. */
function applyAgentModelDefaults(config, target, mutate) {
	return projectAgentModelDefaults(config, target, mutate(prepareAgentModelDefaults(config, target)));
}
/** Move a defaults-based model mutation onto one agent while preserving its other config changes. */
function projectAgentModelDefaults(config, target, updated) {
	const entry = resolveMutableAgentEntry(config, target.agentId);
	if (!entry && config.agents?.ownership !== "explicit") return updated;
	const updatedDefaults = updated.agents?.defaults;
	const originalDefaults = config.agents?.defaults;
	const agentModels = entry?.models !== void 0 ? updatedDefaults?.models : Object.fromEntries(Object.entries(updatedDefaults?.models ?? {}).filter(([modelRef, model]) => !Object.hasOwn(originalDefaults?.models ?? {}, modelRef) || !isDeepStrictEqual(model, originalDefaults?.models?.[modelRef])));
	const hasAgentModel = entry?.model !== void 0 || !isDeepStrictEqual(toAgentModelListLike(updatedDefaults?.model), toAgentModelListLike(originalDefaults?.model));
	const hasAgentModelPolicy = entry?.modelPolicy !== void 0 || !isDeepStrictEqual(updatedDefaults?.modelPolicy, originalDefaults?.modelPolicy);
	const { model: _model, models: _models, modelPolicy: _modelPolicy, ...entryRest } = entry ?? {};
	const nextEntry = {
		...entryRest,
		...hasAgentModel && updatedDefaults?.model !== void 0 ? { model: updatedDefaults.model } : {},
		...agentModels && Object.keys(agentModels).length > 0 ? { models: agentModels } : {},
		...hasAgentModelPolicy && updatedDefaults?.modelPolicy !== void 0 ? { modelPolicy: updatedDefaults.modelPolicy } : {}
	};
	const { model: _updatedModel, models: _updatedModels, modelPolicy: _updatedModelPolicy, ...sharedDefaults } = updatedDefaults ?? {};
	return replaceOnboardingAgentEntry({
		...config,
		agents: {
			...config.agents,
			...originalDefaults || updatedDefaults ? { defaults: {
				...sharedDefaults,
				...originalDefaults?.model !== void 0 ? { model: originalDefaults.model } : {},
				...originalDefaults?.models !== void 0 ? { models: originalDefaults.models } : {},
				...originalDefaults?.modelPolicy !== void 0 ? { modelPolicy: originalDefaults.modelPolicy } : {}
			} } : {}
		}
	}, updated, target, nextEntry);
}
//#endregion
export { projectAgentModelDefaults as a, resolveSystemAgentOnboardingTarget as c, prepareAgentModelDefaults as i, applyOnboardingPrimaryModel as n, resolveOnboardingAgentTarget as o, ensureOnboardingAgentWorkspace as r, resolveOnboardingSetupTarget as s, applyAgentModelDefaults as t };
