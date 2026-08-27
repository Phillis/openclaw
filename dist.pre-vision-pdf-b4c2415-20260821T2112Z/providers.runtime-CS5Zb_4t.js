import { _ as sortUniqueStrings } from "./string-normalization-e_fvmxMf.js";
import { v as extractPluginInstallRecordsFromInstalledPluginIndex } from "./installed-plugin-index-CqyEIHSI.js";
import { o as hasExplicitPluginIdScope } from "./current-plugin-metadata-snapshot-DwABKB-T.js";
import { s as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-BV6-k_Y4.js";
import { _ as resolveProviderConfigApiOwnerHint } from "./gateway-startup-plugin-ids-DTekdjuw.js";
import { m as getActivePluginRegistryWorkspaceDir } from "./runtime-g0R28Sy0.js";
import { L as isPluginRegistryLoadInFlight, o as loadOpenClawPlugins, r as getRuntimePluginRegistryForLoadOptions } from "./loader-B4G6K_LK.js";
import { n as resolveManifestActivationPluginIds } from "./activation-planner-DT7blh-E.js";
import { a as resolveDiscoveredProviderPluginIds, d as resolveOwningPluginIdsForProviderRef, i as resolveDiscoverableProviderOwnerPluginIds, l as resolveOwningPluginIdsForModelRefs, o as resolveEnabledProviderPluginIds, t as resolveActivatableProviderOwnerPluginIds } from "./providers-o7UIOzTf.js";
import { n as resolvePluginActivationInputs, r as withActivatedPluginIds } from "./activation-context-ChwnBO6L.js";
import { n as getLoadedRuntimePluginRegistry } from "./active-runtime-registry-BGg0hzV1.js";
import { n as buildPluginRuntimeLoadOptionsFromValues, r as createPluginRuntimeLoaderLogger } from "./load-context-BOX7sK1g.js";
//#region src/plugins/providers.runtime.ts
function resolveExplicitProviderOwnerPluginIds(params, snapshot) {
	return sortUniqueStrings(params.providerRefs.flatMap((provider) => {
		const plannedPluginIds = resolveManifestActivationPluginIds({
			trigger: {
				kind: "provider",
				provider
			},
			config: params.config,
			workspaceDir: params.workspaceDir,
			env: params.env,
			manifestRecords: snapshot.manifestRegistry.plugins
		});
		if (plannedPluginIds.length > 0) return plannedPluginIds;
		const apiOwnerHint = resolveProviderConfigApiOwnerHint({
			provider,
			config: params.config
		});
		if (apiOwnerHint) {
			const apiOwnerPluginIds = resolveManifestActivationPluginIds({
				trigger: {
					kind: "provider",
					provider: apiOwnerHint
				},
				config: params.config,
				workspaceDir: params.workspaceDir,
				env: params.env,
				manifestRecords: snapshot.manifestRegistry.plugins
			});
			if (apiOwnerPluginIds.length > 0) return apiOwnerPluginIds;
		}
		return resolveOwningPluginIdsForProviderRef({
			provider,
			config: params.config,
			workspaceDir: params.workspaceDir,
			env: params.env,
			manifestRegistry: snapshot.manifestRegistry
		}) ?? [];
	}));
}
function mergeExplicitOwnerPluginIds(providerPluginIds, explicitOwnerPluginIds) {
	if (explicitOwnerPluginIds.length === 0) return [...providerPluginIds];
	return sortUniqueStrings([...providerPluginIds, ...explicitOwnerPluginIds]);
}
function resolvePluginProviderLoadBase(params, snapshot) {
	const env = params.env ?? process.env;
	const workspaceDir = params.workspaceDir ?? getActivePluginRegistryWorkspaceDir();
	const providerOwnedPluginIds = params.providerRefs?.length ? resolveExplicitProviderOwnerPluginIds({
		providerRefs: params.providerRefs,
		config: params.config,
		workspaceDir,
		env
	}, snapshot) : [];
	const modelOwnedPluginIds = params.modelRefs?.length ? resolveOwningPluginIdsForModelRefs({
		models: params.modelRefs,
		config: params.config,
		workspaceDir,
		env,
		manifestRegistry: snapshot.manifestRegistry
	}) : [];
	return {
		env,
		workspaceDir,
		requestedPluginIds: hasExplicitPluginIdScope(params.onlyPluginIds) || params.providerRefs?.length || params.modelRefs?.length || providerOwnedPluginIds.length > 0 || modelOwnedPluginIds.length > 0 ? sortUniqueStrings([
			...params.onlyPluginIds ?? [],
			...providerOwnedPluginIds,
			...modelOwnedPluginIds
		]) : void 0,
		explicitOwnerPluginIds: sortUniqueStrings([...providerOwnedPluginIds, ...modelOwnedPluginIds]),
		rawConfig: params.config
	};
}
function resolveProviderMetadataLookup(params) {
	const env = params.env ?? process.env;
	const workspaceDir = params.workspaceDir ?? getActivePluginRegistryWorkspaceDir();
	return {
		env,
		workspaceDir,
		snapshot: params.pluginMetadataSnapshot ?? resolvePluginMetadataSnapshot({
			config: params.config ?? {},
			workspaceDir,
			env
		})
	};
}
function resolveSetupProviderPluginLoadState(params, base, snapshot) {
	const setupPluginIds = mergeExplicitOwnerPluginIds(resolveDiscoveredProviderPluginIds({
		config: params.config,
		workspaceDir: base.workspaceDir,
		env: base.env,
		onlyPluginIds: base.requestedPluginIds,
		includeUntrustedWorkspacePlugins: params.includeUntrustedWorkspacePlugins,
		registry: snapshot.index,
		manifestRegistry: snapshot.manifestRegistry
	}), resolveDiscoverableProviderOwnerPluginIds({
		pluginIds: base.explicitOwnerPluginIds,
		config: params.config,
		workspaceDir: base.workspaceDir,
		env: base.env,
		includeUntrustedWorkspacePlugins: params.includeUntrustedWorkspacePlugins,
		registry: snapshot.index,
		manifestRegistry: snapshot.manifestRegistry
	}));
	if (setupPluginIds.length === 0) return;
	const setupConfig = withActivatedPluginIds({
		config: base.rawConfig,
		pluginIds: setupPluginIds
	});
	return { loadOptions: buildPluginRuntimeLoadOptionsFromValues({
		config: setupConfig,
		activationSourceConfig: setupConfig,
		autoEnabledReasons: {},
		workspaceDir: base.workspaceDir,
		env: base.env,
		logger: createPluginRuntimeLoaderLogger(),
		manifestRegistry: snapshot.manifestRegistry,
		installRecords: extractPluginInstallRecordsFromInstalledPluginIndex(snapshot.index)
	}, {
		onlyPluginIds: setupPluginIds,
		pluginSdkResolution: params.pluginSdkResolution,
		cache: params.cache ?? false,
		activate: params.activate ?? false
	}) };
}
function resolveRuntimeProviderPluginLoadState(params, base, snapshot) {
	const explicitOwnerPluginIds = resolveActivatableProviderOwnerPluginIds({
		pluginIds: base.explicitOwnerPluginIds,
		config: base.rawConfig,
		workspaceDir: base.workspaceDir,
		env: base.env,
		includeUntrustedWorkspacePlugins: params.includeUntrustedWorkspacePlugins,
		registry: snapshot.index,
		manifestRegistry: snapshot.manifestRegistry
	});
	const runtimeRequestedPluginIds = base.requestedPluginIds !== void 0 ? sortUniqueStrings([...params.onlyPluginIds ?? [], ...explicitOwnerPluginIds]) : void 0;
	const activation = resolvePluginActivationInputs({
		rawConfig: withActivatedPluginIds({
			config: base.rawConfig,
			pluginIds: explicitOwnerPluginIds
		}),
		env: base.env,
		workspaceDir: base.workspaceDir,
		applyAutoEnable: params.applyAutoEnable ?? true,
		discovery: snapshot.discovery,
		manifestRegistry: snapshot.manifestRegistry
	});
	const providerPluginIds = mergeExplicitOwnerPluginIds(resolveEnabledProviderPluginIds({
		config: activation.config,
		workspaceDir: base.workspaceDir,
		env: base.env,
		onlyPluginIds: runtimeRequestedPluginIds,
		registry: snapshot.index,
		manifestRegistry: snapshot.manifestRegistry
	}), explicitOwnerPluginIds);
	return { loadOptions: buildPluginRuntimeLoadOptionsFromValues({
		config: activation.config,
		activationSourceConfig: activation.activationSourceConfig,
		autoEnabledReasons: activation.autoEnabledReasons,
		workspaceDir: base.workspaceDir,
		env: base.env,
		logger: createPluginRuntimeLoaderLogger(),
		manifestRegistry: snapshot.manifestRegistry,
		installRecords: extractPluginInstallRecordsFromInstalledPluginIndex(snapshot.index)
	}, {
		onlyPluginIds: providerPluginIds,
		pluginSdkResolution: params.pluginSdkResolution,
		cache: params.cache ?? true,
		activate: params.activate ?? false
	}) };
}
function isPluginProvidersLoadInFlight(params) {
	const { env, workspaceDir, snapshot } = resolveProviderMetadataLookup(params);
	const base = resolvePluginProviderLoadBase({
		...params,
		workspaceDir,
		env
	}, snapshot);
	const loadState = params.mode === "setup" ? resolveSetupProviderPluginLoadState(params, base, snapshot) : resolveRuntimeProviderPluginLoadState(params, base, snapshot);
	if (!loadState) return false;
	return isPluginRegistryLoadInFlight(loadState.loadOptions);
}
function resolvePluginProvidersCore(params) {
	const { env, workspaceDir, snapshot } = resolveProviderMetadataLookup(params);
	const base = resolvePluginProviderLoadBase({
		...params,
		workspaceDir,
		env
	}, snapshot);
	if (params.mode === "setup") {
		const loadState = resolveSetupProviderPluginLoadState(params, base, snapshot);
		if (!loadState) return [];
		if (params.skipIfLoadInFlight && isPluginRegistryLoadInFlight(loadState.loadOptions)) return [];
		return loadOpenClawPlugins(loadState.loadOptions).providers.map((entry) => Object.assign({}, entry.provider, { pluginId: entry.pluginId }));
	}
	const loadState = resolveRuntimeProviderPluginLoadState(params, base, snapshot);
	if (params.skipIfLoadInFlight && isPluginRegistryLoadInFlight(loadState.loadOptions)) return [];
	const registry = loadState.loadOptions.onlyPluginIds?.length === 0 ? void 0 : getLoadedRuntimePluginRegistry({
		env: base.env,
		loadOptions: loadState.loadOptions,
		workspaceDir: base.workspaceDir,
		requiredPluginIds: loadState.loadOptions.onlyPluginIds
	}) ?? getRuntimePluginRegistryForLoadOptions(loadState.loadOptions);
	if (!registry) return [];
	return registry.providers.map((entry) => Object.assign({}, entry.provider, { pluginId: entry.pluginId }));
}
//#endregion
export { resolvePluginProvidersCore as n, isPluginProvidersLoadInFlight as t };
