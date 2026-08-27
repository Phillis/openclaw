import { t as resolveRealpathOrAbsolute } from "./boundary-path-dOybNsjk.js";
//#region src/plugins/runtime-degraded-state.ts
let activeDegradedPlugins = [];
function cloneDegradedPlugin(plugin) {
	return {
		...plugin,
		diagnostic: { ...plugin.diagnostic }
	};
}
/** Converts verified ownership failures into the quarantine state used for this boot. */
function buildDegradedPluginsFromVerificationFailures(failures) {
	const degraded = /* @__PURE__ */ new Map();
	for (const failure of failures) {
		if (degraded.has(failure.pluginId)) continue;
		degraded.set(failure.pluginId, {
			pluginId: failure.pluginId,
			state: "configured-unavailable",
			diagnostic: {
				kind: "plugin-verification",
				reason: failure.reason,
				detail: failure.detail,
				...failure.installPath ? { installPath: failure.installPath } : {}
			}
		});
	}
	return [...degraded.values()];
}
/** Replaces the process-local quarantine snapshot established before Gateway plugin loading. */
function setActiveDegradedPlugins(plugins) {
	activeDegradedPlugins = plugins.map(cloneDegradedPlugin);
}
function listActiveDegradedPlugins() {
	return activeDegradedPlugins.map(cloneDegradedPlugin);
}
function findActiveDegradedPlugin(pluginId) {
	const plugin = activeDegradedPlugins.find((entry) => entry.pluginId === pluginId);
	return plugin ? cloneDegradedPlugin(plugin) : void 0;
}
/** Drops a verification failure that belongs to a different selected plugin root. */
function clearActiveDegradedPlugin(pluginId) {
	activeDegradedPlugins = activeDegradedPlugins.filter((entry) => entry.pluginId !== pluginId);
}
/** Matches an install-record path and discovered root across symlink/path aliases. */
function pluginInstallPathMatchesRoot(installPath, rootDir) {
	if (!installPath) return false;
	return resolveRealpathOrAbsolute(installPath) === resolveRealpathOrAbsolute(rootDir);
}
/** Matches install-record and discovered roots across symlink/path aliases. */
function degradedPluginMatchesRoot(plugin, rootDir) {
	return pluginInstallPathMatchesRoot(plugin.diagnostic.installPath, rootDir);
}
/** Removes the known private install root before diagnostics leave the Gateway process. */
function toPublicPluginVerificationDiagnostic(diagnostic) {
	const detail = diagnostic.reason === "missing-openclaw-peer-link" ? "Plugin declares peerDependency \"openclaw\", but its host peer link is missing or invalid." : diagnostic.installPath ? diagnostic.detail.replaceAll(diagnostic.installPath, "<plugin-install>") : diagnostic.detail;
	return {
		kind: diagnostic.kind,
		reason: diagnostic.reason,
		detail
	};
}
function formatPluginVerificationDiagnostic(diagnostic) {
	const publicDiagnostic = toPublicPluginVerificationDiagnostic(diagnostic);
	return `configured plugin payload verification failed (${publicDiagnostic.reason}): ${publicDiagnostic.detail}`;
}
//#endregion
export { formatPluginVerificationDiagnostic as a, setActiveDegradedPlugins as c, findActiveDegradedPlugin as i, toPublicPluginVerificationDiagnostic as l, clearActiveDegradedPlugin as n, listActiveDegradedPlugins as o, degradedPluginMatchesRoot as r, pluginInstallPathMatchesRoot as s, buildDegradedPluginsFromVerificationFailures as t };
