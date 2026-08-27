import { t as getActiveRuntimePluginRegistry } from "./active-runtime-registry-C6lIiD1n.js";
//#region src/plugins/cli-backends.runtime.ts
/** Resolves CLI backends from the active runtime plugin registry. */
function resolveRuntimeCliBackends() {
	return (getActiveRuntimePluginRegistry()?.cliBackends ?? []).map((entry) => Object.assign({}, entry.backend, {
		pluginId: entry.pluginId,
		builtWithOpenClawVersion: entry.builtWithOpenClawVersion
	}));
}
//#endregion
export { resolveRuntimeCliBackends as t };
