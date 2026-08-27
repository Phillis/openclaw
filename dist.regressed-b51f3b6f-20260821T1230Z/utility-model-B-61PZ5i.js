import { o as resolveAgentEffectiveModelPrimary } from "./agent-scope-BizOtGGz.js";
import { s as resolveAgentConfig } from "./agent-scope-config-BdXMWufB.js";
import { t as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-DwABKB-T.js";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BIKs-96s.js";
import { w as resolveDefaultModelForAgent } from "./codex-route-model-ref-0uJOp6W2.js";
import "./model-selection-Adc4uFq_.js";
//#region src/agents/utility-model.ts
/**
* Reads the configured utility-model setting. A defined-but-empty value is an
* explicit opt-out ("disabled"), distinct from unset ("auto"); the agent-level
* value wins over defaults even when it is the empty string.
*/
function readUtilityModelSetting(cfg, agentId) {
	const value = resolveAgentConfig(cfg, agentId)?.utilityModel ?? cfg.agents?.defaults?.utilityModel;
	if (value === void 0) return { kind: "auto" };
	const trimmed = value.trim();
	return trimmed ? {
		kind: "explicit",
		modelRef: trimmed
	} : { kind: "disabled" };
}
/**
* Provider-declared default utility model (manifest
* `modelCatalog.providers.<id>.defaultUtilityModel`), or undefined when the
* provider does not declare one. Reads only the process-current plugin
* metadata snapshot, so the lookup stays synchronous and cheap; contexts
* without a snapshot simply get no derived default.
*/
function resolveProviderDefaultUtilityModelRef(params) {
	const provider = params.provider.trim().toLowerCase();
	if (!provider) return;
	const snapshot = params.metadataSnapshot ?? getCurrentPluginMetadataSnapshot({
		config: params.cfg,
		allowWorkspaceScopedSnapshot: true
	});
	if (!snapshot) return;
	for (const plugin of snapshot.plugins) {
		const modelId = (plugin.modelCatalog?.providers?.[provider]?.defaultUtilityModel)?.trim();
		if (modelId) return `${provider}/${modelId}`;
	}
}
/**
* The utility model ref to use for the agent, or undefined when utility
* routing is disabled or no default exists. Callers with a session-specific
* selection pass both primary fields so automatic routing keeps that session's
* provider and auth owner.
*/
function resolveUtilityModelRefForAgent(params) {
	const setting = readUtilityModelSetting(params.cfg, params.agentId);
	if (setting.kind === "explicit") return setting.modelRef;
	if (setting.kind === "disabled") return;
	const provider = params.primaryProvider?.trim() || resolveDefaultModelForAgent({
		cfg: params.cfg,
		agentId: params.agentId
	}).provider;
	if (!provider) return;
	const derived = resolveProviderDefaultUtilityModelRef({
		cfg: params.cfg,
		provider,
		metadataSnapshot: params.metadataSnapshot
	});
	if (!derived) return;
	const primaryRef = params.primaryModelRef?.trim() || resolveAgentEffectiveModelPrimary(params.cfg, params.agentId) || "";
	const primaryProfile = primaryRef ? splitTrailingAuthProfile(primaryRef)?.profile : void 0;
	return primaryProfile ? `${derived}@${primaryProfile}` : derived;
}
//#endregion
export { resolveUtilityModelRefForAgent as n, readUtilityModelSetting as t };
