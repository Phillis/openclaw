//#region src/plugins/uninstall-package-plan.ts
const PLUGIN_PACKAGE_UNINSTALL_PLAN = Symbol.for("openclaw.pluginPackageUninstallPlan");
function recordPluginPackageUninstallPlan(params, metadata) {
	Object.defineProperty(params, PLUGIN_PACKAGE_UNINSTALL_PLAN, {
		configurable: false,
		enumerable: true,
		value: metadata
	});
	return params;
}
function resolvePluginPackageUninstallPlan(params) {
	return params[PLUGIN_PACKAGE_UNINSTALL_PLAN];
}
function prepareConfigForPendingPluginDirectoryRemovalSet(config, pluginIds) {
	const entries = { ...config.plugins?.entries };
	for (const entryId of new Set(pluginIds)) entries[entryId] = {
		...entries[entryId],
		enabled: false
	};
	return {
		...config,
		plugins: {
			...config.plugins,
			entries
		}
	};
}
//#endregion
export { recordPluginPackageUninstallPlan as n, resolvePluginPackageUninstallPlan as r, prepareConfigForPendingPluginDirectoryRemovalSet as t };
