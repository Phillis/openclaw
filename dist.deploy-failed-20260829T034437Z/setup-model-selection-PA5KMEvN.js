import { n as normalizeAgentId, r as normalizeAgentIdStrict } from "./agent-id-CeT3w4ap.js";
import { y as toAgentEntriesRecord } from "./agent-scope-config-CUBiGmG3.js";
//#region src/system-agent/setup-model-selection.ts
function applySystemAgentModelSelectionWithModules(params, modules) {
	const { agentScope, modelConfig, runtimePolicy } = modules;
	const nextConfig = structuredClone(params.config);
	const normalizedTarget = params.targetAgentId === void 0 ? null : normalizeAgentIdStrict(params.targetAgentId);
	if (normalizedTarget && !normalizedTarget.ok) throw new Error(`Could not resolve configured agent "${params.targetAgentId}".`);
	const targetAgentId = normalizedTarget?.value;
	const agentId = agentScope.resolveAmbientOwnerAgentId(nextConfig, targetAgentId);
	const roster = agentScope.listAgentEntries(nextConfig);
	if (targetAgentId && !roster.some((entry) => normalizeAgentId(entry.id) === targetAgentId)) throw new Error(`Could not resolve configured agent "${targetAgentId}".`);
	const writesAgent = Boolean(targetAgentId || agentScope.resolveAgentExplicitModelPrimary(nextConfig, agentId));
	nextConfig.agents ??= {};
	nextConfig.agents.defaults ??= {};
	const agentDefaults = nextConfig.agents.defaults;
	const target = modelConfig.resolveModelTarget({
		raw: params.model,
		cfg: nextConfig
	});
	const key = modelConfig.upsertCanonicalModelConfigEntry({}, target);
	const configuredVisibleModels = agentDefaults.models;
	if (configuredVisibleModels && Object.keys(configuredVisibleModels).length > 0) {
		const defaultModels = { ...configuredVisibleModels };
		modelConfig.upsertCanonicalModelConfigEntry(defaultModels, target);
		agentDefaults.models = defaultModels;
	}
	const agentEntries = toAgentEntriesRecord(roster);
	if (writesAgent || params.agentRuntimeId) {
		const { list: _legacyList, ...agentConfig } = nextConfig.agents;
		nextConfig.agents = {
			...agentConfig,
			entries: agentEntries
		};
	}
	const agentEntryKey = roster.find((entry) => normalizeAgentId(entry.id) === agentId)?.id ?? agentId;
	let agent = agentEntries[agentEntryKey];
	if (writesAgent) {
		if (!agent) throw new Error(`Could not resolve configured default agent "${agentId}".`);
		const agentModels = { ...agent.models };
		agent.models = agentModels;
		modelConfig.upsertCanonicalModelConfigEntry(agentModels, target);
	}
	if (params.agentRuntimeId) {
		if (!agent) {
			agent = { default: true };
			agentEntries[agentEntryKey] = agent;
		}
		const agentModels = { ...agent.models };
		const agentKey = modelConfig.upsertCanonicalModelConfigEntry(agentModels, target);
		agentModels[agentKey] = {
			...agentModels[agentKey],
			agentRuntime: { id: params.agentRuntimeId }
		};
		agent.models = agentModels;
	} else {
		const clearRuntimePin = (models) => {
			const nextModels = { ...models };
			const modelKey = modelConfig.upsertCanonicalModelConfigEntry(nextModels, target);
			const entry = { ...nextModels[modelKey] };
			delete entry.agentRuntime;
			nextModels[modelKey] = entry;
			return nextModels;
		};
		const defaultModels = agentDefaults.models;
		if (defaultModels && Object.keys(defaultModels).length > 0) agentDefaults.models = clearRuntimePin(defaultModels);
		if (agent?.models && Object.keys(agent.models).length > 0) agent.models = clearRuntimePin(agent.models);
	}
	const selectedModel = params.authProfileId ? `${key}@${params.authProfileId}` : key;
	agentScope.setAgentEffectiveModelPrimary(nextConfig, agentId, selectedModel, { forceAgent: Boolean(targetAgentId) });
	if (params.agentRuntimeId) {
		if (runtimePolicy.resolveModelRuntimePolicy({
			config: nextConfig,
			provider: target.provider,
			modelId: target.model,
			agentId
		}).policy?.id !== params.agentRuntimeId) throw new Error(`Could not pin ${key} to the ${params.agentRuntimeId} runtime.`);
	}
	return nextConfig;
}
async function createSystemAgentModelSelectionUpdater(params) {
	const [agentScope, modelConfig, runtimePolicy] = await Promise.all([
		import("./agent-scope-WWPxWnDc.js"),
		import("./shared-B6VTRXKM.js"),
		import("./model-runtime-policy-ByraZ4dg.js")
	]);
	const modules = {
		agentScope,
		modelConfig,
		runtimePolicy
	};
	return (config) => applySystemAgentModelSelectionWithModules({
		...params,
		config
	}, modules);
}
async function applySystemAgentModelSelection(params) {
	return (await createSystemAgentModelSelectionUpdater(params))(params.config);
}
//#endregion
export { createSystemAgentModelSelectionUpdater as n, applySystemAgentModelSelection as t };
