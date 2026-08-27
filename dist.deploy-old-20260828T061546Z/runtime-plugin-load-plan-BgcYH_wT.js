import { i as isTestDefaultMemorySlotDisabled, l as resolveEffectivePluginActivationState, p as resolveSelectedContextEnginePluginId } from "./config-state-Bgpvw0Q6.js";
import { m as hashJson, y as isPluginEnabledByDefaultForPlatform } from "./installed-plugin-index-Cr71VmpU.js";
import { f as loadPluginRegistrySnapshot } from "./plugin-metadata-snapshot-BI5GxVU3.js";
import { r as normalizePluginsConfigWithRegistry } from "./plugin-registry-contributions-JopjOY3b.js";
import "./plugin-registry-BcpcjwxL.js";
import { _ as isDefaultAgentRuntimeId, y as normalizeOptionalAgentRuntimeId } from "./openai-routing-Chr0R2hQ.js";
import { f as createInstalledPluginIndexScopeLookup, m as normalizePluginsConfigForInstalledIndex, p as addConfiguredSlotPluginIds } from "./gateway-startup-plugin-ids-Dy6KWM9Y.js";
import { t as resolveAgentHarnessPolicy } from "./policy-Cj3P99a_.js";
import { t as collectConfiguredAgentHarnessRuntimes } from "./harness-runtimes-CXIGNdMq.js";
import { t as resolveManifestActivationPlan } from "./activation-planner-BdMmGHtb.js";
import { d as resolveOwningPluginIdsForProviderRef, n as resolveBundledProviderCompatPluginIds, t as resolveActivatableProviderOwnerPluginIds } from "./providers-BY0gR-NY.js";
import { r as withActivatedPluginIds } from "./activation-context-DrJmxyjh.js";
import { i as isCliRuntimeAliasForProvider } from "./model-runtime-aliases-Rrd1VaX1.js";
//#region src/agents/harness/runtime-plugin-load-plan.ts
function dedupePluginIds(values) {
	const result = [];
	for (const value of values) {
		const pluginId = value.trim();
		if (pluginId && !result.includes(pluginId)) result.push(pluginId);
	}
	return result;
}
function restrictiveAllowlistOmitsPlugin(config, pluginId) {
	const allow = config?.plugins?.allow ?? [];
	return allow.length > 0 && !allow.includes(pluginId);
}
function resolveSelectedMemoryPluginIds(params) {
	if (isTestDefaultMemorySlotDisabled(params.config ?? {})) return [];
	const registry = loadPluginRegistrySnapshot({
		config: params.config,
		workspaceDir: params.metadataSnapshot?.workspaceDir ?? params.workspaceDir,
		...params.metadataSnapshot ? { index: params.metadataSnapshot.index } : {}
	});
	const plugins = normalizePluginsConfigWithRegistry(params.config?.plugins, registry);
	const memorySlot = plugins.slots.memory;
	if (typeof memorySlot !== "string" || restrictiveAllowlistOmitsPlugin(params.config, memorySlot)) return [];
	const plugin = registry.plugins.find((entry) => entry.pluginId === memorySlot);
	if (!plugin?.startup.memory) return [];
	return resolveEffectivePluginActivationState({
		id: plugin.pluginId,
		origin: plugin.origin,
		config: plugins,
		rootConfig: params.config,
		enabledByDefault: isPluginEnabledByDefaultForPlatform(plugin)
	}).activated ? [plugin.pluginId] : [];
}
function resolveAgentRuntimePluginSelections(config, selections) {
	return [...collectConfiguredAgentHarnessRuntimes(config ?? {}).map((runtime) => ({
		runtime,
		provider: "",
		modelId: ""
	})), ...selections];
}
function resolveAgentRuntimeMetadataPluginIds(params) {
	const lookup = createInstalledPluginIndexScopeLookup(params.index);
	const pluginsConfig = normalizePluginsConfigForInstalledIndex(params.config?.plugins, lookup);
	if (!pluginsConfig.enabled) return [];
	const pluginIds = /* @__PURE__ */ new Set();
	lookup.addShorthandModelOwners(pluginIds, params.shorthandModelIds ?? []);
	const selections = resolveAgentRuntimePluginSelections(params.config, params.selections);
	const providerIds = dedupePluginIds(selections.map((selection) => selection.provider));
	for (const providerId of providerIds) {
		const providerPluginIds = /* @__PURE__ */ new Set();
		lookup.addDirectProviderOwners(providerPluginIds, [providerId]);
		if (providerPluginIds.size === 0) lookup.addProviderContributionOwners(providerPluginIds, [providerId]);
		if (providerPluginIds.size !== 1) return;
		for (const pluginId of providerPluginIds) pluginIds.add(pluginId);
	}
	const runtimeIds = dedupePluginIds(selections.map((selection) => resolveSelectedAgentHarnessRuntime(selection, params.config)).filter((runtime) => !isDefaultAgentRuntimeId(runtime) && runtime !== "openclaw"));
	if (!lookup.hasAgentHarnessOwners(runtimeIds)) return;
	lookup.addAgentHarnessOwners(pluginIds, runtimeIds);
	addConfiguredSlotPluginIds(pluginIds, {
		activationSourceConfig: params.config ?? {},
		activationSourcePlugins: pluginsConfig,
		lookup
	});
	if (!lookup.hasInstalledPluginIds(pluginIds)) return;
	return [...pluginIds].toSorted((left, right) => left.localeCompare(right));
}
/** Narrows cold manifest preparation to candidates needed by one selected runtime generation. */
function createAgentRuntimeMetadataPluginIdScope(params) {
	return {
		key: hashJson({
			kind: "agent-runtime",
			config: params.config ?? null,
			workspaceDir: params.workspaceDir,
			selections: params.selections,
			shorthandModelIds: params.shorthandModelIds ?? []
		}),
		resolve: ({ index }) => resolveAgentRuntimeMetadataPluginIds({
			config: params.config,
			selections: params.selections,
			shorthandModelIds: params.shorthandModelIds,
			index
		})
	};
}
function resolveSelectedProviderOwnerPluginIds(params) {
	const providerOwnerPluginIds = dedupePluginIds(resolveOwningPluginIdsForProviderRef(params) ?? []);
	if (providerOwnerPluginIds.length === 0) return [];
	const safeProviderOwnerPluginIds = dedupePluginIds([...resolveBundledProviderCompatPluginIds({
		config: params.config,
		workspaceDir: params.workspaceDir,
		onlyPluginIds: providerOwnerPluginIds,
		manifestRegistry: params.metadataSnapshot?.manifestRegistry
	}), ...resolveActivatableProviderOwnerPluginIds({
		pluginIds: providerOwnerPluginIds,
		config: params.config,
		workspaceDir: params.workspaceDir,
		...params.metadataSnapshot ? {
			registry: params.metadataSnapshot.index,
			manifestRegistry: params.metadataSnapshot.manifestRegistry
		} : {}
	})]);
	return providerOwnerPluginIds.filter((pluginId) => safeProviderOwnerPluginIds.includes(pluginId));
}
/** Resolve manifest owners required by one selected non-core harness runtime. */
function resolveAgentHarnessOwnerPluginIds(params) {
	const harnessPluginIds = resolveManifestActivationPlan({
		trigger: {
			kind: "agentHarness",
			runtime: params.runtime
		},
		config: params.config,
		workspaceDir: params.workspaceDir,
		requireExplicitManifestOwnerTrust: true,
		manifestRecords: params.metadataSnapshot?.plugins
	}).entries.map((entry) => entry.pluginId);
	if (harnessPluginIds.length === 0 || params.runtime !== "codex" || !harnessPluginIds.includes("codex") || restrictiveAllowlistOmitsPlugin(params.config, "codex")) return harnessPluginIds;
	const providerOwnerPluginIds = params.providerOwnerPluginIds ?? resolveSelectedProviderOwnerPluginIds(params);
	if (providerOwnerPluginIds.length === 0) return harnessPluginIds;
	return dedupePluginIds([...harnessPluginIds, ...providerOwnerPluginIds.filter((pluginId) => pluginId !== "codex")]);
}
function withRuntimePluginIdsAllowed(config, pluginIds, materializeAllowlist) {
	const existingAllowlist = config?.plugins?.allow ?? [];
	if (pluginIds.length === 0 || !materializeAllowlist && existingAllowlist.length === 0) return config;
	return {
		...config,
		plugins: {
			...config?.plugins,
			allow: dedupePluginIds([...existingAllowlist, ...pluginIds])
		}
	};
}
function resolveSelectedAgentHarnessRuntime(selection, config) {
	const requestedRuntime = normalizeOptionalAgentRuntimeId(selection.runtime);
	return requestedRuntime && !isDefaultAgentRuntimeId(requestedRuntime) ? requestedRuntime : resolveAgentHarnessPolicy({
		provider: selection.provider,
		modelId: selection.modelId,
		config,
		agentId: selection.agentId
	}).runtime;
}
function requiresAgentHarnessPluginSelection(selection, config) {
	const runtime = resolveSelectedAgentHarnessRuntime(selection, config);
	if (isDefaultAgentRuntimeId(runtime) || runtime === "openclaw") return false;
	return runtime === "codex" || !isCliRuntimeAliasForProvider({
		runtime,
		provider: selection.provider,
		cfg: config
	});
}
/** Folds selected harness, memory, and context-engine owners into one deterministic load plan. */
function resolveAgentRuntimePluginLoadPlan(params) {
	let config = params.config;
	const memoryPluginIds = resolveSelectedMemoryPluginIds({
		config: params.config,
		workspaceDir: params.workspaceDir,
		metadataSnapshot: params.metadataSnapshot
	});
	const contextEnginePluginId = resolveSelectedContextEnginePluginId(params.config);
	const contextEnginePluginIds = contextEnginePluginId ? [contextEnginePluginId] : [];
	const basePluginIds = (params.basePluginIds ?? []).filter((pluginId) => !restrictiveAllowlistOmitsPlugin(params.config, pluginId));
	const pluginIds = [
		...basePluginIds,
		...memoryPluginIds,
		...contextEnginePluginIds
	];
	const forceActivatedPluginIds = [...memoryPluginIds, ...contextEnginePluginIds];
	for (const selection of params.selections) {
		const runtime = resolveSelectedAgentHarnessRuntime(selection, config);
		const providerOwnerPluginIds = resolveSelectedProviderOwnerPluginIds({
			provider: selection.provider,
			config,
			workspaceDir: params.workspaceDir,
			metadataSnapshot: params.metadataSnapshot
		});
		pluginIds.push(...providerOwnerPluginIds);
		forceActivatedPluginIds.push(...providerOwnerPluginIds);
		if (!requiresAgentHarnessPluginSelection(selection, config)) continue;
		const harnessPluginIds = resolveAgentHarnessOwnerPluginIds({
			runtime,
			provider: selection.provider,
			config,
			workspaceDir: params.workspaceDir,
			providerOwnerPluginIds,
			metadataSnapshot: params.metadataSnapshot
		});
		pluginIds.push(...harnessPluginIds);
		const allowedHarnessPluginIds = runtime === "codex" ? restrictiveAllowlistOmitsPlugin(params.config, "codex") ? [] : harnessPluginIds : harnessPluginIds.filter((pluginId) => !restrictiveAllowlistOmitsPlugin(params.config, pluginId));
		forceActivatedPluginIds.push(...allowedHarnessPluginIds);
	}
	const scopedPluginIds = dedupePluginIds(pluginIds).toSorted((left, right) => left.localeCompare(right));
	config = withRuntimePluginIdsAllowed(config, [...basePluginIds, ...forceActivatedPluginIds], params.basePluginIds !== void 0);
	const activatedConfig = withActivatedPluginIds({
		config,
		pluginIds: forceActivatedPluginIds.toSorted()
	}) ?? config;
	if (params.basePluginIds === void 0 && (params.config?.plugins?.allow?.length ?? 0) === 0 && activatedConfig?.plugins) {
		const plugins = { ...activatedConfig.plugins };
		if (params.config?.plugins?.allow === void 0) delete plugins.allow;
		else plugins.allow = params.config.plugins.allow;
		config = {
			...activatedConfig,
			plugins
		};
	} else config = activatedConfig;
	return {
		...config ? { config } : {},
		...params.basePluginIds === void 0 && scopedPluginIds.length === 0 ? {} : { pluginIds: scopedPluginIds }
	};
}
//#endregion
export { resolveSelectedAgentHarnessRuntime as a, resolveAgentRuntimePluginSelections as i, resolveAgentHarnessOwnerPluginIds as n, resolveAgentRuntimePluginLoadPlan as r, createAgentRuntimeMetadataPluginIdScope as t };
