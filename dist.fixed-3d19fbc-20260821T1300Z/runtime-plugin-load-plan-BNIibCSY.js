import { i as isTestDefaultMemorySlotDisabled, l as resolveEffectivePluginActivationState, p as resolveSelectedContextEnginePluginId } from "./config-state-DLiU5GYQ.js";
import { t as isPluginEnabledByDefaultForPlatform } from "./default-enablement-CEIbpabL.js";
import { i as loadPluginRegistrySnapshot } from "./plugin-registry-snapshot-CxbzdC9E.js";
import { r as normalizePluginsConfigWithRegistry } from "./plugin-registry-contributions-CyOFsuOI.js";
import "./plugin-registry-102McyAT.js";
import { _ as isDefaultAgentRuntimeId, y as normalizeOptionalAgentRuntimeId } from "./openai-routing-BC0q3X-J.js";
import { t as resolveAgentHarnessPolicy } from "./policy-Ce8eESmX.js";
import { t as resolveManifestActivationPlan } from "./activation-planner-C2xU7Qqv.js";
import { d as resolveOwningPluginIdsForProviderRef, n as resolveBundledProviderCompatPluginIds, t as resolveActivatableProviderOwnerPluginIds } from "./providers-CEVEnHVm.js";
import { r as withActivatedPluginIds } from "./activation-context-BX-sABLS.js";
import { i as isCliRuntimeAliasForProvider } from "./model-runtime-aliases-BoIMzL8U.js";
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
	const registry = loadPluginRegistrySnapshot(params);
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
/** Resolve manifest owners required by one selected non-core harness runtime. */
function resolveAgentHarnessOwnerPluginIds(params) {
	const harnessPluginIds = resolveManifestActivationPlan({
		trigger: {
			kind: "agentHarness",
			runtime: params.runtime
		},
		config: params.config,
		workspaceDir: params.workspaceDir,
		requireExplicitManifestOwnerTrust: true
	}).entries.map((entry) => entry.pluginId);
	if (harnessPluginIds.length === 0 || params.runtime !== "codex" || !harnessPluginIds.includes("codex") || restrictiveAllowlistOmitsPlugin(params.config, "codex")) return harnessPluginIds;
	const providerOwnerPluginIds = dedupePluginIds(resolveOwningPluginIdsForProviderRef(params) ?? []);
	if (providerOwnerPluginIds.length === 0) return harnessPluginIds;
	const safeProviderOwnerPluginIds = dedupePluginIds([...resolveBundledProviderCompatPluginIds({
		config: params.config,
		workspaceDir: params.workspaceDir,
		onlyPluginIds: providerOwnerPluginIds
	}), ...resolveActivatableProviderOwnerPluginIds({
		pluginIds: providerOwnerPluginIds,
		config: params.config,
		workspaceDir: params.workspaceDir
	})]);
	return dedupePluginIds([...harnessPluginIds, ...providerOwnerPluginIds.filter((pluginId) => pluginId !== "codex" && safeProviderOwnerPluginIds.includes(pluginId))]);
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
/** Returns whether a selection needs a plugin-owned harness in its prepared generation. */
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
		workspaceDir: params.workspaceDir
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
		if (!requiresAgentHarnessPluginSelection(selection, config)) continue;
		const harnessPluginIds = resolveAgentHarnessOwnerPluginIds({
			runtime,
			provider: selection.provider,
			config,
			workspaceDir: params.workspaceDir
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
export { resolveSelectedAgentHarnessRuntime as i, resolveAgentHarnessOwnerPluginIds as n, resolveAgentRuntimePluginLoadPlan as r, requiresAgentHarnessPluginSelection as t };
