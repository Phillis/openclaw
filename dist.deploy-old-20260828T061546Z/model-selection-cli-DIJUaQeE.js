import { r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
import { r as isInstalledPluginEnabled } from "./installed-plugin-index-Cr71VmpU.js";
import { s as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-BI5GxVU3.js";
import { s as normalizeProviderId$1 } from "./model-ref-shared-D4yx0hwT.js";
import { t as getActivePluginRegistryWorkspaceDirFromState } from "./runtime-state-B4nZOuAi.js";
import { t as resolveRuntimeCliBackends } from "./cli-backends.runtime.js";
//#region src/plugins/setup-registry.runtime.ts
/** Metadata lookup helpers for plugin setup CLI backend descriptors. */
let cachedSetupCliBackendDescriptors;
function resolveMetadataSnapshotForSetupCliBackends(params = {}) {
	const env = params.env ?? process.env;
	const workspaceDir = params.workspaceDir ?? getActivePluginRegistryWorkspaceDirFromState();
	return {
		snapshot: resolvePluginMetadataSnapshot({
			...params.config ? { config: params.config } : {},
			env,
			...workspaceDir ? { workspaceDir } : {},
			allowWorkspaceScopedCurrent: true
		}),
		cacheable: true
	};
}
function resolveSetupCliBackendDescriptors(params = {}) {
	const { snapshot, cacheable } = resolveMetadataSnapshotForSetupCliBackends(params);
	const configFingerprint = snapshot.configFingerprint;
	if (cacheable && configFingerprint && cachedSetupCliBackendDescriptors?.configFingerprint === configFingerprint) return cachedSetupCliBackendDescriptors.entries;
	const entries = snapshot.plugins.flatMap((plugin) => {
		if (!isInstalledPluginEnabled(snapshot.index, plugin.id)) return [];
		return [...plugin.cliBackends, ...plugin.setup?.cliBackends ?? []].map((backendId) => ({
			pluginId: plugin.id,
			backend: { id: backendId }
		}));
	});
	if (cacheable && configFingerprint) cachedSetupCliBackendDescriptors = {
		configFingerprint,
		entries
	};
	return entries;
}
function resolvePluginSetupCliBackendDescriptor(params) {
	const normalized = normalizeProviderId(params.backend);
	return resolveSetupCliBackendDescriptors(params).find((entry) => normalizeProviderId(entry.backend.id) === normalized);
}
/** Resolve enabled setup CLI backend ids from one metadata snapshot. */
function resolvePluginSetupCliBackendIds(params = {}) {
	return resolveSetupCliBackendDescriptors(params).map((entry) => entry.backend.id);
}
//#endregion
//#region src/agents/model-selection-cli.ts
/** Prepare one CLI-provider lookup for request paths that classify multiple models. */
function prepareCliProviderClassifier(cfg) {
	const providers = new Set([...resolveRuntimeCliBackends().map((backend) => backend.id), ...resolvePluginSetupCliBackendIds({ config: cfg })].map(normalizeProviderId$1));
	return (provider) => providers.has(normalizeProviderId$1(provider));
}
/** Return true when a provider id resolves to a configured or plugin CLI backend. */
function isCliProvider(provider, cfg) {
	const normalized = normalizeProviderId$1(provider);
	if (resolveRuntimeCliBackends().some((backend) => normalizeProviderId$1(backend.id) === normalized)) return true;
	if (resolvePluginSetupCliBackendDescriptor({
		backend: normalized,
		config: cfg
	})) return true;
	return false;
}
//#endregion
export { prepareCliProviderClassifier as n, isCliProvider as t };
