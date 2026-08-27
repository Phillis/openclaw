import { c as resolveUserPath } from "./home-dir-BFvskzn8.js";
import "./utils-Bw16L5tB.js";
import { s as normalizePluginsConfig } from "./config-state-Bgpvw0Q6.js";
import { v as extractPluginInstallRecordsFromInstalledPluginIndex } from "./installed-plugin-index-B1BZ_yR8.js";
import { i as loadPluginMetadataSnapshot } from "./plugin-metadata-snapshot-CeAk9iRD.js";
import { d as getActivePluginRegistry } from "./runtime-DMlUh4Cg.js";
import { n as loadPluginRegistryHandle } from "./loader-D0AfkRZe.js";
import { i as getPluginRuntimeGatewayRequestScope, u as withPluginRuntimeRegistryScope } from "./gateway-request-scope-B19X7f09.js";
import { r as adoptRuntimeContextEngineRegistrations } from "./registry-BL4inl-J.js";
import { i as listRuntimePluginIdsFromRegistry, r as listLoadedRuntimePluginIds } from "./active-runtime-registry-BGBjj91t.js";
import { i as resolveAgentRuntimePluginSelections, r as resolveAgentRuntimePluginLoadPlan } from "./runtime-plugin-load-plan-DBGXY5LT.js";
//#region src/plugins/widget-presenters.ts
function hasMatchingLoadedOwner(registration, targetRegistry, runtimeRegistry) {
	const target = targetRegistry.plugins.find((plugin) => plugin.id === registration.pluginId);
	const runtime = runtimeRegistry.plugins.find((plugin) => plugin.id === registration.pluginId);
	return target?.status === "loaded" && runtime?.status === "loaded" && target.source === runtime.source && registration.source === runtime.source;
}
/** Copies full-only presenters into a matching discovery registry without rerunning plugin code. */
function adoptRuntimeWidgetPresenterRegistrations(targetRegistry, runtimeRegistry) {
	const presenters = [...targetRegistry.widgetPresenters];
	let changed = false;
	for (const registration of runtimeRegistry.widgetPresenters) {
		if (!hasMatchingLoadedOwner(registration, targetRegistry, runtimeRegistry)) continue;
		if (!presenters.some((candidate) => registration.presenter.target === "current_channel" ? candidate.pluginId === registration.pluginId && candidate.presenter.target === registration.presenter.target : candidate.presenter.target === registration.presenter.target)) {
			presenters.push(registration);
			changed = true;
		}
	}
	return changed ? {
		...targetRegistry,
		widgetPresenters: presenters
	} : targetRegistry;
}
/** Returns presenter registrations from the exact request registry when available. */
function resolveWidgetPresenters() {
	return (getPluginRuntimeGatewayRequestScope()?.pluginRegistry ?? getActivePluginRegistry() ?? void 0)?.widgetPresenters ?? [];
}
//#endregion
//#region src/agents/runtime-plugins.ts
function resolveAgentRuntimePluginRegistryLoad(params) {
	const requestedWorkspaceDir = typeof params.workspaceDir === "string" && params.workspaceDir.trim() ? resolveUserPath(params.workspaceDir) : void 0;
	if (params.config && !normalizePluginsConfig(params.config.plugins).enabled) return { loadOptions: {
		config: params.config,
		activationSourceConfig: params.config,
		...params.env ? { env: params.env } : {},
		workspaceDir: requestedWorkspaceDir,
		onlyPluginIds: [],
		runtimeOptions: params.allowGatewaySubagentBinding ? { allowGatewaySubagentBinding: true } : void 0
	} };
	const metadataSnapshot = params.metadataSnapshot ?? loadPluginMetadataSnapshot({
		config: params.config ?? {},
		env: params.env ?? process.env,
		...requestedWorkspaceDir ? { workspaceDir: requestedWorkspaceDir } : {}
	});
	const workspaceDir = metadataSnapshot.workspaceDir ?? requestedWorkspaceDir;
	const metadataLoadOptions = {
		...metadataSnapshot.discovery ? { discovery: metadataSnapshot.discovery } : {},
		installRecords: extractPluginInstallRecordsFromInstalledPluginIndex(metadataSnapshot.index),
		manifestRegistry: metadataSnapshot.manifestRegistry,
		...params.preferBuiltPluginArtifacts ? { preferBuiltPluginArtifacts: true } : {},
		...workspaceDir ? { workspaceDir } : {}
	};
	const requestPluginRegistry = getPluginRuntimeGatewayRequestScope()?.pluginRegistry;
	const activePluginIds = listLoadedRuntimePluginIds();
	const startupPluginIds = params.basePluginIds !== void 0 ? [...params.basePluginIds] : requestPluginRegistry ? listRuntimePluginIdsFromRegistry(requestPluginRegistry) : metadataSnapshot.pluginIds ? [...metadataSnapshot.pluginIds] : activePluginIds.length > 0 ? activePluginIds : void 0;
	const plan = resolveAgentRuntimePluginLoadPlan({
		config: params.config,
		workspaceDir: workspaceDir ?? process.cwd(),
		...startupPluginIds === void 0 ? {} : { basePluginIds: startupPluginIds },
		selections: resolveAgentRuntimePluginSelections(params.config, params.selections ?? []),
		metadataSnapshot
	});
	return { loadOptions: {
		config: plan.config,
		...plan.config ? { activationSourceConfig: plan.config } : {},
		...params.env ? { env: params.env } : {},
		...metadataLoadOptions,
		...startupPluginIds === void 0 || plan.pluginIds === void 0 ? {} : { onlyPluginIds: plan.pluginIds },
		...startupPluginIds === void 0 ? {} : { channelPluginLoadIntent: "full" },
		runtimeOptions: params.allowGatewaySubagentBinding ? { allowGatewaySubagentBinding: true } : void 0
	} };
}
/** Loads the registry handle owned by an agent prepared-runtime generation. */
function loadAgentRuntimePluginRegistryHandle(params) {
	const pluginRegistry = loadPluginRegistryHandle({
		...resolveAgentRuntimePluginRegistryLoad(params).loadOptions,
		activate: false
	});
	const activeRegistry = getActivePluginRegistry();
	if (!activeRegistry) return pluginRegistry;
	return adoptRuntimeWidgetPresenterRegistrations(adoptRuntimeContextEngineRegistrations(pluginRegistry, activeRegistry), activeRegistry);
}
/** Binds a scoped plugin generation when a direct host has no Gateway owner. */
async function withAgentPluginRegistry(params) {
	if (getPluginRuntimeGatewayRequestScope()?.pluginRegistry) return await params.run();
	return await withPluginRuntimeRegistryScope(loadAgentRuntimePluginRegistryHandle({
		basePluginIds: [],
		config: params.config,
		workspaceDir: params.workspaceDir
	}), params.run);
}
//#endregion
export { withAgentPluginRegistry as n, resolveWidgetPresenters as r, loadAgentRuntimePluginRegistryHandle as t };
