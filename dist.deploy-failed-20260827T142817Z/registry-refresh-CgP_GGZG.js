import { c as tracePluginLifecyclePhaseAsync } from "./discovery-C2Bhkw0t.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { n as loadInstalledPluginIndexInstallRecords } from "./installed-plugin-index-record-reader-DArXGVRI.js";
import { o as refreshPluginRegistry } from "./plugin-registry-snapshot-CiUpn9fa.js";
import "./plugin-registry-Bt5nAmAy.js";
import "./installed-plugin-index-records-ClSyB6F3.js";
//#region src/plugins/registry-refresh.ts
/** Refresh persisted plugin registry and clear runtime discovery after a config mutation. */
async function refreshPluginRegistryAfterConfigMutation(params) {
	try {
		const installRecords = params.installRecords ?? await tracePluginLifecyclePhaseAsync("install records load", () => loadInstalledPluginIndexInstallRecords(params.env ? { env: params.env } : {}), { command: params.traceCommand ?? "registry-refresh" });
		await tracePluginLifecyclePhaseAsync("registry refresh", () => refreshPluginRegistry({
			config: params.config,
			reason: params.reason,
			installRecords,
			...params.policyPluginIds ? { policyPluginIds: params.policyPluginIds } : {},
			...params.workspaceDir ? { workspaceDir: params.workspaceDir } : {},
			...params.env ? { env: params.env } : {}
		}), {
			command: params.traceCommand ?? "registry-refresh",
			reason: params.reason
		});
	} catch (error) {
		params.logger?.warn?.(`Plugin registry refresh failed: ${formatErrorMessage(error)}`);
	}
	if (params.invalidateRuntimeCache !== false) await invalidatePluginRuntimeDiscoveryAfterConfigMutation(params);
}
async function invalidatePluginRuntimeDiscoveryAfterConfigMutation(params) {
	try {
		const { clearPluginRegistryLoadCache } = await import("./plugins/loader.js");
		clearPluginRegistryLoadCache();
	} catch (error) {
		params.logger?.warn?.(`Plugin runtime cache invalidation failed: ${formatErrorMessage(error)}`);
	}
}
//#endregion
export { refreshPluginRegistryAfterConfigMutation as n, invalidatePluginRuntimeDiscoveryAfterConfigMutation as t };
