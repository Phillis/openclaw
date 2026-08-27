import { i as asOptionalObjectRecord } from "./record-coerce-DItp3I4t.js";
import { s as normalizePluginsConfig } from "./config-state-DLiU5GYQ.js";
import { n as loadBundledPluginPublicArtifactModuleSync } from "./public-surface-loader-DMySnkKb.js";
import { i as passesManifestOwnerBasePolicy } from "./manifest-owner-policy-DHFjJfjG.js";
import { o as registerHealthCheck } from "./health-check-registry-CBs_fO63.js";
//#region src/flows/bundled-health-checks.ts
/** Registers bundled health checks that are explicitly enabled by config and owner policy. */
function registerBundledHealthChecks(params) {
	if (!shouldRegisterPolicyHealth(params)) return;
	loadBundledPluginPublicArtifactModuleSync({
		dirName: "policy",
		artifactBasename: "api.js"
	}).registerPolicyDoctorChecks?.({ registerHealthCheck });
}
function shouldRegisterPolicyHealth(params) {
	const entry = params.cfg.plugins?.entries?.policy;
	const config = asOptionalObjectRecord(entry?.config) ?? {};
	if (entry === void 0 || entry.enabled === false || config.enabled === false) return false;
	if (!passesManifestOwnerBasePolicy({
		plugin: { id: "policy" },
		normalizedConfig: normalizePluginsConfig(params.cfg.plugins)
	})) return false;
	return entry.enabled === true || config.enabled === true;
}
//#endregion
export { registerBundledHealthChecks as t };
