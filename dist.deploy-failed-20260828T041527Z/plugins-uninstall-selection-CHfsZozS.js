import { n as ok, t as err } from "./result-BQGgYouL.js";
import { t as parseClawHubPluginSpec } from "./clawhub-spec-Er3Np6VI.js";
//#region src/cli/plugins-uninstall-selection.ts
/** Resolve user input to the plugin id that should be removed from config/install records. */
function resolvePluginUninstallId(params) {
	const rawId = params.rawId.trim();
	const pluginConfig = params.config.plugins;
	const installs = pluginConfig?.installs ?? {};
	const resolveInstalledPlugin = (pluginId) => {
		const plugin = params.plugins.find((entry) => entry.id === pluginId);
		return plugin ? {
			pluginId,
			plugin
		} : { pluginId };
	};
	const exactPlugin = params.plugins.find((entry) => entry.id === rawId);
	if (exactPlugin) return ok({
		pluginId: exactPlugin.id,
		plugin: exactPlugin
	});
	if (Object.hasOwn(installs, rawId) || Object.hasOwn(pluginConfig?.entries ?? {}, rawId) || pluginConfig?.allow?.includes(rawId) || pluginConfig?.deny?.includes(rawId) || pluginConfig?.slots?.memory === rawId || pluginConfig?.slots?.contextEngine === rawId) return ok(resolveInstalledPlugin(rawId));
	const matchingPluginIds = new Set(params.plugins.filter((plugin) => plugin.name === rawId).map((plugin) => plugin.id));
	for (const [pluginId, install] of Object.entries(installs)) if (install.spec === rawId || install.resolvedSpec === rawId || install.resolvedName === rawId || install.marketplacePlugin === rawId) matchingPluginIds.add(pluginId);
	const requestedClawHub = parseClawHubPluginSpec(rawId);
	if (requestedClawHub) {
		for (const [pluginId, install] of Object.entries(installs)) if ((install.clawhubPackage ?? parseClawHubPluginSpec(install.spec ?? "")?.name ?? parseClawHubPluginSpec(install.resolvedSpec ?? "")?.name) === requestedClawHub.name) matchingPluginIds.add(pluginId);
	}
	if (matchingPluginIds.size > 1) return err(`Plugin uninstall target "${rawId}" is ambiguous; matches: ${[...matchingPluginIds].toSorted().join(", ")}. Use an exact plugin id.`);
	const [matchedPluginId] = matchingPluginIds;
	return ok(resolveInstalledPlugin(matchedPluginId ?? rawId));
}
//#endregion
export { resolvePluginUninstallId };
