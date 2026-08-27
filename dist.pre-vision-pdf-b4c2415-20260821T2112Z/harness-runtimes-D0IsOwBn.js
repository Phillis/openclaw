import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import "./utils-DEqefz4f.js";
import { i as parseModelCatalogRef } from "./model-catalog-refs-BdjEHOKQ.js";
import { r as listAgentEntries } from "./agent-scope-config-BdXMWufB.js";
import { i as listModelRefsFromConfigValue } from "./configured-model-refs-0XUAFjEF.js";
import { _ as isDefaultAgentRuntimeId, y as normalizeOptionalAgentRuntimeId } from "./openai-routing-BGuHAkXI.js";
import { t as resolveAgentHarnessPolicy } from "./policy-BHrZvZfs.js";
//#region src/agents/harness-runtimes.ts
/**
* Collects configured native harness runtime ids from model provider config.
*/
function normalizeConfiguredRuntimeId(value) {
	return normalizeOptionalAgentRuntimeId(value);
}
function isSelectablePluginRuntime(runtime) {
	return Boolean(runtime) && !isDefaultAgentRuntimeId(runtime) && normalizeOptionalAgentRuntimeId(runtime) !== "openclaw";
}
function parseConfiguredModelRef(value) {
	if (typeof value !== "string") return;
	return parseModelCatalogRef(value) ?? void 0;
}
function resolveConfiguredModelHarnessRuntime(params) {
	const parsed = parseConfiguredModelRef(params.modelRef);
	if (!parsed) return;
	const policy = resolveAgentHarnessPolicy({
		config: params.config,
		provider: parsed.provider,
		modelId: parsed.modelId,
		agentId: params.agentId
	});
	if (!params.includeImplicitRuntimePreferences && policy.runtimeSource === "implicit") return;
	const runtime = normalizeConfiguredRuntimeId(policy.runtime);
	return isSelectablePluginRuntime(runtime) ? runtime : void 0;
}
function pushConfiguredModelRuntimeIds(config, runtimes) {
	for (const providerConfig of Object.values(config.models?.providers ?? {})) {
		const providerRuntime = normalizeConfiguredRuntimeId(providerConfig?.agentRuntime?.id);
		if (isSelectablePluginRuntime(providerRuntime)) runtimes.add(providerRuntime);
		for (const modelConfig of providerConfig?.models ?? []) {
			const modelRuntime = normalizeConfiguredRuntimeId(modelConfig?.agentRuntime?.id);
			if (isSelectablePluginRuntime(modelRuntime)) runtimes.add(modelRuntime);
		}
	}
	const pushModelMapRuntimeIds = (models) => {
		if (!isRecord(models)) return;
		for (const entry of Object.values(models)) {
			if (!isRecord(entry)) continue;
			const runtime = normalizeConfiguredRuntimeId(isRecord(entry.agentRuntime) ? entry.agentRuntime.id : void 0);
			if (isSelectablePluginRuntime(runtime)) runtimes.add(runtime);
		}
	};
	pushModelMapRuntimeIds(config.agents?.defaults?.models);
	const agents = listAgentEntries(config);
	for (const agent of agents) pushModelMapRuntimeIds(isRecord(agent) ? agent.models : void 0);
}
function pushConfiguredAgentModelRuntimeIds(config, runtimes, includeImplicitRuntimePreferences) {
	const pushModelRefs = (modelRefs, agentId) => {
		for (const modelRef of modelRefs) {
			const runtime = resolveConfiguredModelHarnessRuntime({
				config,
				includeImplicitRuntimePreferences,
				modelRef,
				agentId
			});
			if (runtime) runtimes.add(runtime);
		}
	};
	const pushModelMapRefs = (models, agentId) => {
		if (!isRecord(models)) return;
		pushModelRefs(Object.keys(models), agentId);
	};
	const defaultsModel = config.agents?.defaults?.model;
	pushModelRefs(listModelRefsFromConfigValue(defaultsModel));
	pushModelMapRefs(config.agents?.defaults?.models);
	for (const agent of listAgentEntries(config)) {
		if (!isRecord(agent)) continue;
		const agentId = typeof agent.id === "string" ? agent.id : void 0;
		pushModelRefs(listModelRefsFromConfigValue(agent.model ?? defaultsModel), agentId);
		pushModelMapRefs(agent.models, agentId);
	}
}
/** Lists configured plugin harness runtime ids referenced by agent/model config. */
function collectConfiguredAgentHarnessRuntimes(config, options = {}) {
	const runtimes = /* @__PURE__ */ new Set();
	const includeImplicitRuntimePreferences = options.includeImplicitRuntimePreferences ?? true;
	pushConfiguredModelRuntimeIds(config, runtimes);
	pushConfiguredAgentModelRuntimeIds(config, runtimes, includeImplicitRuntimePreferences);
	return [...runtimes].toSorted((left, right) => left.localeCompare(right));
}
//#endregion
export { collectConfiguredAgentHarnessRuntimes as t };
