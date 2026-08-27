import { r as getRuntimeConfig } from "./io-CeQckj5v.js";
import { t as createSubsystemLogger } from "./subsystem-CDLhGl2-.js";
import { n as registerPluginMetadataProcessMemoLifecycleClear } from "./plugin-metadata-lifecycle-DQWVBcP_.js";
import { v as extractPluginInstallRecordsFromInstalledPluginIndex } from "./installed-plugin-index-CqyEIHSI.js";
import { c as resolvePluginControlPlaneWorkspace } from "./plugin-registry-snapshot-wrChZCpl.js";
import { r as setCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-DwABKB-T.js";
import { a as rebasePluginMetadataSnapshotManifestRegistry, n as isPluginMetadataSnapshotCompatible, s as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-BV6-k_Y4.js";
import { t as resolveConfigWidePluginManifestRegistry } from "./io.plugin-metadata-BQhELyO0.js";
import "./config-Dl8DJbzM.js";
import { n as fingerprintPluginAutoEnableConfig, r as fingerprintPluginAutoEnableEnv, t as applyPluginAutoEnable } from "./plugin-auto-enable-CuLWfZ5w.js";
import { t as resolvePluginActivationSourceConfig } from "./activation-source-config-CiDINKqT.js";
import "./logging-B9hJxSny.js";
//#region src/plugins/runtime/load-context.ts
const log = createSubsystemLogger("plugins");
let currentAutoEnableCache;
registerPluginMetadataProcessMemoLifecycleClear(() => {
	currentAutoEnableCache = void 0;
});
function samePluginIds(left, right) {
	return left === right || left !== void 0 && right !== void 0 && left.length === right.length && left.every((pluginId, index) => pluginId === right[index]);
}
function applyCurrentPluginAutoEnable(params) {
	if (!params.snapshot || !params.manifestRegistry || params.env !== process.env) return applyPluginAutoEnable({
		config: params.config,
		env: params.env,
		manifestRegistry: params.manifestRegistry,
		discovery: params.snapshot?.discovery
	});
	const workspaceDir = params.snapshot.workspaceDir ?? params.workspaceDir;
	const cached = currentAutoEnableCache;
	if (cached !== void 0 && cached.metadataConfigFingerprint === params.snapshot.configFingerprint && cached.policyHash === params.snapshot.policyHash && cached.workspaceDir === workspaceDir && samePluginIds(cached.pluginIds, params.snapshot.pluginIds)) {
		if (cached.config === params.config && cached.env === params.env) return cached.result;
		const autoEnableConfigFingerprint = cached.config === params.config ? cached.autoEnableConfigFingerprint : fingerprintPluginAutoEnableConfig(params.config);
		const autoEnableEnvFingerprint = cached.env === params.env ? cached.autoEnableEnvFingerprint : fingerprintPluginAutoEnableEnv(params.env);
		if (cached.autoEnableConfigFingerprint === autoEnableConfigFingerprint && cached.autoEnableEnvFingerprint === autoEnableEnvFingerprint) {
			currentAutoEnableCache = {
				...cached,
				config: params.config,
				env: params.env
			};
			return cached.result;
		}
	}
	const result = applyPluginAutoEnable({
		config: params.config,
		env: params.env,
		manifestRegistry: params.manifestRegistry,
		discovery: params.snapshot.discovery
	});
	const autoEnableConfigFingerprint = fingerprintPluginAutoEnableConfig(params.config);
	const autoEnableEnvFingerprint = fingerprintPluginAutoEnableEnv(params.env);
	currentAutoEnableCache = {
		config: params.config,
		env: params.env,
		autoEnableConfigFingerprint,
		autoEnableEnvFingerprint,
		metadataConfigFingerprint: params.snapshot.configFingerprint,
		pluginIds: params.snapshot.pluginIds,
		policyHash: params.snapshot.policyHash,
		result,
		workspaceDir
	};
	return result;
}
/** Creates the default plugin runtime loader logger. */
function createPluginRuntimeLoaderLogger() {
	return {
		info: (message) => log.info(message),
		warn: (message) => log.warn(message),
		error: (message) => log.error(message),
		debug: (message) => log.debug(message)
	};
}
/** Resolves config, manifests, install records, and auto-enable state for runtime loads. */
function resolvePluginRuntimeLoadContext(options) {
	const env = options?.env ?? process.env;
	const rawConfig = options?.config ?? getRuntimeConfig();
	const rawWorkspaceDir = resolvePluginControlPlaneWorkspace({
		config: rawConfig,
		env,
		workspaceDir: options?.workspaceDir
	}).workspaceDir;
	const resolveMetadataSnapshot = (params) => {
		const snapshot = resolvePluginMetadataSnapshot({
			config: params.config,
			env,
			workspaceDir: rawWorkspaceDir,
			allowWorkspaceScopedCurrent: true,
			...params.index ? { index: params.index } : {},
			...options?.onlyPluginIds !== void 0 ? { pluginIds: options.onlyPluginIds } : {}
		});
		if (options?.workspaceDir !== void 0) return snapshot;
		return rebasePluginMetadataSnapshotManifestRegistry(snapshot, resolveConfigWidePluginManifestRegistry({
			config: params.config,
			env,
			...options?.onlyPluginIds !== void 0 ? { pluginIds: options.onlyPluginIds } : {}
		}));
	};
	const initialMetadataSnapshot = options?.metadataSnapshot ?? (options?.manifestRegistry === void 0 ? resolveMetadataSnapshot({ config: rawConfig }) : void 0);
	const manifestRegistry = options?.manifestRegistry ?? initialMetadataSnapshot?.manifestRegistry;
	const activationSourceConfig = resolvePluginActivationSourceConfig({
		config: rawConfig,
		activationSourceConfig: options?.activationSourceConfig
	});
	const autoEnabled = applyCurrentPluginAutoEnable({
		config: rawConfig,
		env,
		workspaceDir: rawWorkspaceDir,
		manifestRegistry,
		snapshot: initialMetadataSnapshot
	});
	const config = autoEnabled.config;
	const workspaceDir = resolvePluginControlPlaneWorkspace({
		config,
		env,
		workspaceDir: options?.workspaceDir
	}).workspaceDir;
	const metadataSnapshot = options?.manifestRegistry !== void 0 ? void 0 : initialMetadataSnapshot && isPluginMetadataSnapshotCompatible({
		snapshot: initialMetadataSnapshot,
		config,
		env,
		workspaceDir
	}) ? initialMetadataSnapshot : resolveMetadataSnapshot({
		config,
		...initialMetadataSnapshot ? { index: initialMetadataSnapshot.index } : {}
	});
	const finalManifestRegistry = options?.manifestRegistry ?? metadataSnapshot?.manifestRegistry;
	const installRecords = metadataSnapshot ? extractPluginInstallRecordsFromInstalledPluginIndex(metadataSnapshot.index) : void 0;
	if (metadataSnapshot && metadataSnapshot.pluginIds === void 0) setCurrentPluginMetadataSnapshot(metadataSnapshot, {
		config: rawConfig,
		compatibleConfigs: [config, activationSourceConfig],
		env,
		workspaceDir
	});
	return {
		rawConfig,
		config,
		activationSourceConfig,
		autoEnabledReasons: autoEnabled.autoEnabledReasons,
		workspaceDir,
		env,
		logger: options?.logger ?? createPluginRuntimeLoaderLogger(),
		...finalManifestRegistry ? { manifestRegistry: finalManifestRegistry } : {},
		...metadataSnapshot ? { metadataSnapshot } : {},
		installRecords
	};
}
/** Builds plugin load options from a resolved runtime load context. */
function buildPluginRuntimeLoadOptions(context, overrides) {
	return buildPluginRuntimeLoadOptionsFromValues(context, overrides);
}
/** Builds plugin load options from explicit runtime load values. */
function buildPluginRuntimeLoadOptionsFromValues(values, overrides) {
	return {
		config: values.config,
		activationSourceConfig: values.activationSourceConfig,
		autoEnabledReasons: values.autoEnabledReasons,
		workspaceDir: values.workspaceDir,
		env: values.env,
		logger: values.logger,
		manifestRegistry: values.manifestRegistry,
		installRecords: values.installRecords,
		...overrides
	};
}
//#endregion
export { resolvePluginRuntimeLoadContext as i, buildPluginRuntimeLoadOptionsFromValues as n, createPluginRuntimeLoaderLogger as r, buildPluginRuntimeLoadOptions as t };
