import { l as resolveEffectivePluginActivationState } from "./config-state-Bgpvw0Q6.js";
import { y as isPluginEnabledByDefaultForPlatform } from "./installed-plugin-index-Cr71VmpU.js";
import { s as createPluginIdScopeSet } from "./current-plugin-metadata-snapshot-AW4B7-Km.js";
import { o as loadManifestContractSnapshot } from "./manifest-contract-eligibility-DI1_0gqL.js";
import { t as resolveBundledCompatActivationInputs } from "./activation-context-DrJmxyjh.js";
//#region src/plugins/bundled-manifest-contract-plugins.ts
/** Lists bundled plugin ids with a non-empty contract contribution in a manifest snapshot. */
function listBundledManifestContractPluginIds(params) {
	const onlyPluginIdSet = createPluginIdScopeSet(params.onlyPluginIds);
	return params.plugins.filter((plugin) => plugin.origin === "bundled" && (!onlyPluginIdSet || onlyPluginIdSet.has(plugin.id)) && (plugin.contracts?.[params.contract]?.length ?? 0) > 0).map((plugin) => plugin.id).toSorted((left, right) => left.localeCompare(right));
}
/** Applies config activation and compatibility rules before returning bundled contract owners. */
function resolveEnabledBundledManifestContractPlugins(params) {
	if (params.config?.plugins?.enabled === false) return [];
	let manifestRecords = params.manifestRecords;
	const loadManifestRecords = () => {
		manifestRecords ??= loadManifestContractSnapshot({
			config: params.config,
			workspaceDir: params.workspaceDir,
			env: params.env
		}).plugins;
		return manifestRecords;
	};
	const activation = resolveBundledCompatActivationInputs({
		rawConfig: params.config,
		env: params.env,
		workspaceDir: params.workspaceDir,
		onlyPluginIds: params.onlyPluginIds,
		applyAutoEnable: true,
		resolveBundledPluginIds: (compatParams) => listBundledManifestContractPluginIds({
			plugins: loadManifestRecords(),
			contract: params.contract,
			onlyPluginIds: compatParams.onlyPluginIds
		})
	});
	const onlyPluginIdSet = createPluginIdScopeSet(params.onlyPluginIds);
	return loadManifestRecords().filter((plugin) => {
		if (plugin.origin !== "bundled" || onlyPluginIdSet && !onlyPluginIdSet.has(plugin.id) || (plugin.contracts?.[params.contract]?.length ?? 0) === 0) return false;
		return resolveEffectivePluginActivationState({
			id: plugin.id,
			origin: plugin.origin,
			config: activation.normalized,
			rootConfig: activation.config,
			enabledByDefault: isPluginEnabledByDefaultForPlatform(plugin),
			activationSource: activation.activationSource
		}).enabled;
	});
}
//#endregion
export { resolveEnabledBundledManifestContractPlugins as t };
