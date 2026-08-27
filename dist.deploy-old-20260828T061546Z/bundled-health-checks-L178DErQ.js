import { i as asOptionalObjectRecord } from "./record-coerce-DItp3I4t.js";
import { a as normalizePluginId, s as normalizePluginsConfig } from "./config-state-Bgpvw0Q6.js";
import { t as loadBundledPluginManifestRegistry } from "./manifest-registry-DqYRJvWI.js";
import { n as loadPluginManifestRegistryForPluginRegistry } from "./plugin-registry-contributions-JopjOY3b.js";
import "./plugin-registry-BcpcjwxL.js";
import { n as loadBundledPluginPublicArtifactModuleSync, t as loadBundledPluginPublicArtifactModuleFromCandidatesSync } from "./public-surface-loader-Zllbp6of.js";
import { i as passesManifestOwnerBasePolicy } from "./manifest-owner-policy-BL1Kt38K.js";
import { t as collectConfiguredAgentHarnessRuntimes } from "./harness-runtimes-CXIGNdMq.js";
import { n as listBundledWorkerProviderOwners, t as collectConfiguredWorkerProviderIds } from "./worker-provider-config-B0KhVQMV.js";
import { i as resolveProviderPolicySurface } from "./provider-public-artifacts--Ss5eLs5.js";
import { o as registerHealthCheck, r as getHealthCheck } from "./health-check-registry-CBs_fO63.js";
//#region src/flows/bundled-health-checks.ts
function loadMemoryCoreHealthApi() {
	return loadBundledPluginPublicArtifactModuleSync({
		dirName: "memory-core",
		artifactBasename: "doctor-health-api.js"
	});
}
function resolveBundledHealthCheckPluginStateMode(selection) {
	if (selection.includeAllChecks !== true && (selection.onlyIds === void 0 || selection.onlyIds.length === 0)) return "direct";
	const isolatedIds = new Set(loadMemoryCoreHealthApi().pluginStateIsolatedDoctorCheckIds ?? []);
	const skippedIds = new Set(selection.skipIds ?? []);
	const selectedOnlyIds = [...new Set(selection.onlyIds ?? [])].filter((id) => !skippedIds.has(id));
	if ((selectedOnlyIds.length > 0 ? selectedOnlyIds.filter((id) => isolatedIds.has(id)) : [...isolatedIds].filter((id) => !skippedIds.has(id))).length === 0) return "direct";
	if (selectedOnlyIds.length > 0 && selectedOnlyIds.every((id) => isolatedIds.has(id))) return "deferred";
	return "isolated";
}
/** Registers bundled health checks that are explicitly enabled by config and owner policy. */
function registerBundledHealthChecks(params) {
	const env = params.env ?? process.env;
	loadMemoryCoreHealthApi().registerMemoryCoreDoctorChecks?.({
		getHealthCheck,
		registerHealthCheck,
		async inspectEmbeddingProviderSetup(providerParams) {
			const inspect = async (pluginMetadataEnv) => {
				const manifestRegistry = loadPluginManifestRegistryForPluginRegistry({
					config: params.cfg,
					workspaceDir: params.cwd,
					env: pluginMetadataEnv
				});
				const inspector = resolveProviderPolicySurface(providerParams.provider, { manifestRegistry })?.inspectEmbeddingProviderSetup;
				return inspector ? await inspector({
					...providerParams,
					env: pluginMetadataEnv
				}) : void 0;
			};
			return params.runWithPluginStateSnapshot ? await params.runWithPluginStateSnapshot(inspect) : await inspect(env);
		},
		memoryCoreActive: isMemoryCoreActive(params.cfg)
	});
	if (shouldRegisterCodexManagedHealth(params.cfg)) loadBundledPluginPublicArtifactModuleSync({
		dirName: "codex",
		artifactBasename: "api.js"
	}).registerCodexManagedAppServerDoctorChecks?.({
		getHealthCheck,
		registerHealthCheck
	});
	if (shouldRegisterPolicyHealth(params)) loadBundledPluginPublicArtifactModuleSync({
		dirName: "policy",
		artifactBasename: "api.js"
	}).registerPolicyDoctorChecks?.({ registerHealthCheck });
	if (shouldRegisterPluginHealth(params.cfg, "cua-computer")) loadBundledPluginPublicArtifactModuleSync({
		dirName: "cua-computer",
		artifactBasename: "api.js"
	}).registerCuaDriverDoctorChecks?.({ registerHealthCheck });
	registerBundledWorkerProviderHealthChecks(params, env);
}
function registerBundledWorkerProviderHealthChecks(params, env) {
	const providerIds = collectConfiguredWorkerProviderIds(params.cfg);
	if (providerIds.length === 0) return;
	const manifestRegistry = loadBundledPluginManifestRegistry({ env });
	const pluginIds = new Set(listBundledWorkerProviderOwners(manifestRegistry, providerIds).map((owner) => owner.pluginId));
	for (const pluginId of pluginIds) loadBundledPluginPublicArtifactModuleFromCandidatesSync({
		dirName: pluginId,
		artifactCandidates: ["doctor-health-api.js"]
	})?.registerWorkerProviderDoctorChecks?.({
		getHealthCheck,
		registerHealthCheck
	});
}
function shouldRegisterCodexManagedHealth(cfg) {
	if (!collectConfiguredAgentHarnessRuntimes(cfg).includes("codex")) return false;
	if (cfg.plugins?.entries?.codex?.enabled === false) return false;
	return passesManifestOwnerBasePolicy({
		plugin: { id: "codex" },
		normalizedConfig: normalizePluginsConfig(cfg.plugins)
	});
}
function isMemoryCoreActive(cfg) {
	const plugins = normalizePluginsConfig(cfg.plugins);
	const selectedMemoryPluginId = typeof plugins.slots.memory === "string" ? normalizePluginId(plugins.slots.memory) : plugins.slots.memory;
	const configuredMemorySlot = cfg.plugins?.slots?.memory;
	const explicitlySelected = typeof configuredMemorySlot === "string" && normalizePluginId(configuredMemorySlot) === "memory-core";
	return selectedMemoryPluginId === "memory-core" && passesManifestOwnerBasePolicy({
		plugin: { id: "memory-core" },
		normalizedConfig: plugins,
		allowRestrictiveAllowlistBypass: explicitlySelected
	});
}
function shouldRegisterPluginHealth(cfg, pluginId) {
	if ((cfg.plugins?.entries?.[pluginId])?.enabled !== true) return false;
	return passesManifestOwnerBasePolicy({
		plugin: { id: pluginId },
		normalizedConfig: normalizePluginsConfig(cfg.plugins)
	});
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
export { resolveBundledHealthCheckPluginStateMode as n, registerBundledHealthChecks as t };
