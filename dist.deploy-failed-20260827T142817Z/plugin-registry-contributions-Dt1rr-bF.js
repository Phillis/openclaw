import { c as normalizeSortedUniqueStringEntries } from "./string-normalization-e_fvmxMf.js";
import { c as normalizePluginsConfigWithResolverCore } from "./config-activation-shared-CdWoIbbr.js";
import { r as isInstalledPluginEnabled } from "./installed-plugin-index-BC03OFwf.js";
import { t as loadPluginManifestRegistryForInstalledIndex } from "./manifest-registry-installed-FCmk8v-i.js";
import { a as loadPluginRegistrySnapshotWithMetadata, i as loadPluginRegistrySnapshot, l as createPluginRegistryIdNormalizer } from "./plugin-registry-snapshot-CiUpn9fa.js";
//#region src/plugins/plugin-registry-contributions.ts
/** Loads manifest and installed-index contributions used to build plugin registry snapshots. */
function normalizeContributionId(value) {
	return value.trim();
}
function collectObjectKeys(value) {
	return value ? Object.keys(value) : [];
}
function collectContractKeys(plugin) {
	const contracts = plugin.contracts;
	if (!contracts) return [];
	return Object.entries(contracts).flatMap(([key, value]) => Array.isArray(value) && value.length > 0 ? [key] : []);
}
function listManifestContractValues(plugin, contract) {
	return plugin.contracts?.[contract] ?? [];
}
function loadManifestContractRegistry(params) {
	return loadPluginManifestRegistryForPluginRegistry({
		...params,
		pluginIds: params.onlyPluginIds,
		includeDisabled: true
	});
}
function listManifestContributionIds(plugin, contribution) {
	switch (contribution) {
		case "providers": return plugin.providers;
		case "channels": return plugin.channels;
		case "channelConfigs": return collectObjectKeys(plugin.channelConfigs);
		case "setupProviders": return plugin.setup?.providers?.map((provider) => provider.id) ?? [];
		case "cliBackends": return [...plugin.cliBackends, ...plugin.setup?.cliBackends ?? []];
		case "modelCatalogProviders": return [...collectObjectKeys(plugin.modelCatalog?.providers), ...collectObjectKeys(plugin.modelCatalog?.aliases)];
		case "commandAliases": return plugin.commandAliases?.map((alias) => alias.name) ?? [];
		case "contracts": return collectContractKeys(plugin);
	}
	return [];
}
function resolveContributionPluginIds(params) {
	if (params.includeDisabled) return params.index.plugins.map((plugin) => plugin.pluginId);
	return params.index.plugins.filter((plugin) => isInstalledPluginEnabled(params.index, plugin.pluginId, params.config)).map((plugin) => plugin.pluginId);
}
function loadContributionManifestRegistry(params) {
	return loadPluginManifestRegistryForInstalledIndex({
		index: params.index,
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env,
		pluginIds: resolveContributionPluginIds({
			index: params.index,
			includeDisabled: params.includeDisabled,
			config: params.config
		}),
		includeDisabled: true
	});
}
function listContributionManifestPlugins(params) {
	const plugins = params.lookUpTable?.plugins;
	if (plugins) {
		const enabledPluginIds = new Set(resolveContributionPluginIds({
			index: params.index,
			includeDisabled: params.includeDisabled,
			config: params.config
		}));
		return plugins.filter((plugin) => enabledPluginIds.has(plugin.id));
	}
	return loadContributionManifestRegistry({
		...params,
		index: params.index
	}).plugins;
}
function resolveContributionOwnerMap(table, contribution) {
	switch (contribution) {
		case "channels": return table.owners.channels;
		case "channelConfigs": return table.owners.channelConfigs;
		case "providers": return table.owners.providers;
		case "modelCatalogProviders": return table.owners.modelCatalogProviders;
		case "cliBackends": return table.owners.cliBackends;
		case "setupProviders": return table.owners.setupProviders;
		case "commandAliases": return table.owners.commandAliases;
		case "contracts": return table.owners.contracts;
	}
}
function filterContributionOwnerIds(params) {
	const enabledPluginIds = new Set(resolveContributionPluginIds({
		index: params.index,
		includeDisabled: params.includeDisabled,
		config: params.config
	}));
	return normalizeSortedUniqueStringEntries(params.owners.filter((owner) => enabledPluginIds.has(owner)));
}
function loadPluginManifestRegistryForPluginRegistry(params = {}) {
	const { snapshot: index, manifestRegistry } = loadPluginRegistrySnapshotWithMetadata(params);
	return loadPluginManifestRegistryForInstalledIndex({
		index,
		...manifestRegistry ? { manifestRegistry } : {},
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env,
		pluginIds: params.pluginIds,
		includeDisabled: params.includeDisabled,
		...params.bundledChannelConfigCollector ? { bundledChannelConfigCollector: params.bundledChannelConfigCollector } : {}
	});
}
function normalizePluginsConfigWithRegistry(config, index, options = {}) {
	return normalizePluginsConfigWithResolverCore(config, createPluginRegistryIdNormalizer(index, options));
}
function listPluginContributionIds(params) {
	const index = params.lookUpTable?.index ?? loadPluginRegistrySnapshot(params);
	return normalizeSortedUniqueStringEntries(listContributionManifestPlugins({
		...params,
		index
	}).flatMap((plugin) => listManifestContributionIds(plugin, params.contribution)));
}
function resolvePluginContributionOwners(params) {
	const index = params.lookUpTable?.index ?? loadPluginRegistrySnapshot(params);
	if (params.lookUpTable && typeof params.matches === "string") {
		const owners = resolveContributionOwnerMap(params.lookUpTable, params.contribution)?.get(params.matches);
		if (owners) return filterContributionOwnerIds({
			owners,
			index,
			includeDisabled: params.includeDisabled,
			config: params.config
		});
		return [];
	}
	const matcher = typeof params.matches === "string" ? (contributionId) => contributionId === params.matches : params.matches;
	return normalizeSortedUniqueStringEntries(listContributionManifestPlugins({
		...params,
		index
	}).flatMap((plugin) => listManifestContributionIds(plugin, params.contribution).some(matcher) ? [plugin.id] : []));
}
function resolveManifestContractPluginIds(params) {
	return loadManifestContractRegistry(params).plugins.filter((plugin) => (!params.origin || plugin.origin === params.origin) && listManifestContractValues(plugin, params.contract).length > 0).map((plugin) => plugin.id).toSorted((left, right) => left.localeCompare(right));
}
function resolveManifestContractOwnerPluginId(params) {
	const normalizedValue = normalizeContributionId(params.value ?? "").toLowerCase();
	if (!normalizedValue) return;
	return loadManifestContractRegistry(params).plugins.find((plugin) => (!params.origin || plugin.origin === params.origin) && listManifestContractValues(plugin, params.contract).some((candidate) => normalizeContributionId(candidate).toLowerCase() === normalizedValue))?.id;
}
//#endregion
export { resolveManifestContractPluginIds as a, resolveManifestContractOwnerPluginId as i, loadPluginManifestRegistryForPluginRegistry as n, resolvePluginContributionOwners as o, normalizePluginsConfigWithRegistry as r, listPluginContributionIds as t };
