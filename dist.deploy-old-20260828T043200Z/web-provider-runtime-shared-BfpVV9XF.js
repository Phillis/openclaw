import { a as normalizePluginId } from "./config-state-Bgpvw0Q6.js";
import { c as hasExplicitPluginIdScope, u as normalizePluginIdScope } from "./current-plugin-metadata-snapshot-CKAJM6x9.js";
import { m as getActivePluginRegistryWorkspaceDir } from "./runtime-DMlUh4Cg.js";
import { P as isPluginRegistryLoadInFlight, s as loadOpenClawPlugins } from "./loader-D0AfkRZe.js";
import { r as withActivatedPluginIds } from "./activation-context-uSIB1oKw.js";
import { n as getLoadedRuntimePluginRegistry } from "./active-runtime-registry-BGBjj91t.js";
import { n as buildPluginRuntimeLoadOptionsFromValues, r as createPluginRuntimeLoaderLogger } from "./load-context-Cj6rxf47.js";
//#region src/plugins/web-provider-runtime-shared.ts
function resolveWebProviderRuntimeContext(params, deps) {
	const env = params.env ?? process.env;
	const workspaceDir = params.workspaceDir ?? getActivePluginRegistryWorkspaceDir();
	const shouldFilterProviders = params.config !== void 0 || params.onlyPluginIds !== void 0 || params.origin !== void 0 || params.sandboxed === true;
	const { config, activationSourceConfig, autoEnabledReasons, manifestRecords } = deps.resolveBundledResolutionConfig({
		...params,
		workspaceDir,
		env
	});
	const discoveredPluginIds = normalizePluginIdScope(deps.resolveCandidatePluginIds({
		config: params.config,
		workspaceDir,
		env,
		onlyPluginIds: params.onlyPluginIds,
		origin: params.origin,
		sandboxed: params.sandboxed,
		...manifestRecords ? { manifestRecords } : {}
	}));
	const allowedPluginIds = config?.plugins?.allow;
	const allowSet = allowedPluginIds?.length ? new Set(allowedPluginIds.map((pluginId) => normalizePluginId(pluginId))) : void 0;
	const allowlistedPluginIds = allowSet ? discoveredPluginIds?.filter((pluginId) => allowSet.has(normalizePluginId(pluginId))) : discoveredPluginIds;
	const candidatePluginIds = allowlistedPluginIds?.length ? allowlistedPluginIds : discoveredPluginIds;
	return {
		activationSourceConfig,
		autoEnabledReasons,
		config,
		env,
		manifestRecords,
		...params.manifestRecords ? { preparedManifestRegistry: {
			plugins: [...params.manifestRecords],
			diagnostics: []
		} } : {},
		loadPluginIds: candidatePluginIds,
		onlyPluginIds: shouldFilterProviders ? candidatePluginIds : void 0,
		workspaceDir
	};
}
function resolveWebProviderLoadOptions(context, params) {
	return buildPluginRuntimeLoadOptionsFromValues({
		env: context.env,
		config: context.config,
		activationSourceConfig: context.activationSourceConfig,
		autoEnabledReasons: context.autoEnabledReasons,
		workspaceDir: context.workspaceDir,
		logger: createPluginRuntimeLoaderLogger(),
		...context.preparedManifestRegistry ? { manifestRegistry: context.preparedManifestRegistry } : {}
	}, {
		cache: params.cache ?? true,
		activate: params.activate ?? false,
		...hasExplicitPluginIdScope(context.loadPluginIds) ? { onlyPluginIds: context.loadPluginIds } : {}
	});
}
function resolveRuntimeRegistryWebProviders(params) {
	if (!params.registry) return;
	const providers = params.mapRegistryProviders({
		registry: params.registry,
		onlyPluginIds: params.onlyPluginIds
	});
	return {
		providers,
		shouldReturn: providers.length > 0 || params.hasExplicitEmptyScope
	};
}
/** Resolves plugin web providers from setup, active runtime, or a scoped load. */
function resolvePluginWebProviders(params, deps) {
	const env = params.env ?? process.env;
	const workspaceDir = params.workspaceDir ?? getActivePluginRegistryWorkspaceDir();
	if (params.mode === "setup") {
		const pluginIds = deps.resolveCandidatePluginIds({
			config: params.config,
			workspaceDir,
			env,
			onlyPluginIds: params.onlyPluginIds,
			origin: params.origin,
			sandboxed: params.sandboxed,
			...params.manifestRecords ? { manifestRecords: params.manifestRecords } : {}
		}) ?? [];
		if (pluginIds.length === 0) return [];
		if (params.activate !== true) {
			const bundledArtifactProviders = deps.resolveBundledPublicArtifactProviders?.({
				config: params.config,
				workspaceDir,
				env,
				onlyPluginIds: pluginIds,
				...params.manifestRecords ? { manifestRecords: params.manifestRecords } : {}
			});
			if (bundledArtifactProviders) return bundledArtifactProviders;
		}
		const registry = loadOpenClawPlugins(buildPluginRuntimeLoadOptionsFromValues({
			config: withActivatedPluginIds({
				config: params.config,
				pluginIds
			}),
			activationSourceConfig: params.config,
			autoEnabledReasons: {},
			workspaceDir,
			env,
			logger: createPluginRuntimeLoaderLogger(),
			...params.manifestRecords ? { manifestRegistry: {
				plugins: [...params.manifestRecords],
				diagnostics: []
			} } : {}
		}, {
			onlyPluginIds: pluginIds,
			cache: params.cache ?? true,
			activate: params.activate ?? false
		}));
		return deps.mapRegistryProviders({
			registry,
			onlyPluginIds: pluginIds
		});
	}
	const context = resolveWebProviderRuntimeContext(params, deps);
	const loadOptions = resolveWebProviderLoadOptions(context, params);
	const compatible = getLoadedRuntimePluginRegistry({
		env: context.env,
		loadOptions,
		workspaceDir: context.workspaceDir,
		requiredPluginIds: context.loadPluginIds
	});
	const scopedPluginIds = context.onlyPluginIds;
	const hasExplicitEmptyScope = scopedPluginIds !== void 0 && scopedPluginIds.length === 0;
	const compatibleProviders = resolveRuntimeRegistryWebProviders({
		hasExplicitEmptyScope,
		mapRegistryProviders: deps.mapRegistryProviders,
		onlyPluginIds: context.onlyPluginIds,
		registry: compatible
	});
	if (compatibleProviders?.shouldReturn) return compatibleProviders.providers;
	if (compatibleProviders) {}
	if (isPluginRegistryLoadInFlight(loadOptions)) return [];
	if (hasExplicitEmptyScope) return [];
	if (params.activate !== true && context.loadPluginIds && deps.resolveBundledRuntimeArtifactProviders) {
		const bundledArtifactProviders = deps.resolveBundledRuntimeArtifactProviders({
			config: context.config,
			workspaceDir: context.workspaceDir,
			env: context.env,
			onlyPluginIds: context.loadPluginIds,
			...context.manifestRecords ? { manifestRecords: context.manifestRecords } : {}
		});
		if (bundledArtifactProviders) return bundledArtifactProviders;
	}
	const registry = loadOpenClawPlugins(loadOptions);
	return deps.mapRegistryProviders({
		registry,
		onlyPluginIds: context.onlyPluginIds
	});
}
/** Resolves web providers from the active runtime registry before falling back to plugin loading. */
function resolveRuntimeWebProviders(params, deps) {
	return resolvePluginWebProviders(params, deps);
}
//#endregion
export { resolveRuntimeWebProviders as n, resolvePluginWebProviders as t };
