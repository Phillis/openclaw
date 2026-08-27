import "./agent-scope-DigoIwHb.js";
import { x as tryResolveConfiguredAgentWorkspaceDir } from "./agent-scope-config-CUBiGmG3.js";
import { n as resolveDefaultAgentWorkspaceDir } from "./workspace-default-DNxmF3kK.js";
import { _ as collectRegisteredEmbeddingProviderIds, v as collectUnregisteredConfiguredMemoryEmbeddingProviders } from "./gateway-startup-plugin-ids-Dy6KWM9Y.js";
import { d as getActivePluginRegistry, k as setActivePluginRegistry } from "./runtime-B2KAtS3O.js";
import "./loader-BcKpDiEM.js";
import { t as createEmptyPluginRegistry } from "./registry-empty-55wlVNzO.js";
import { r as listAmbientOnlyConfiguredChannelIds } from "./channel-presence-policy-oJ8soWzX.js";
import "./channel-plugin-ids-CD1dMDba.js";
import { t as loadPluginLookUpTable } from "./plugin-lookup-table-uBq9rwQq.js";
import { p as initSubagentRegistry } from "./subagent-registry-ROej5jsc.js";
import { r as resolveGatewayStartupPluginActivationConfig } from "./plugin-activation-runtime-config-DPqAt6wD.js";
import { n as listGatewayMethods } from "./server-methods-list-CMePMmg_.js";
//#region src/gateway/server-startup-plugins.ts
/** Returns the config snapshot used by channel/plugin startup maintenance. */
function resolveGatewayStartupMaintenanceConfig(params) {
	return params.cfgAtStart.channels === void 0 && params.startupRuntimeConfig.channels !== void 0 ? {
		...params.cfgAtStart,
		channels: params.startupRuntimeConfig.channels
	} : params.cfgAtStart;
}
/** Runs channel, session, and pairing maintenance before plugin bootstrap. */
async function runGatewayStartupMaintenance(params) {
	const startupMaintenanceConfig = resolveGatewayStartupMaintenanceConfig({
		cfgAtStart: params.cfgAtStart,
		startupRuntimeConfig: params.startupRuntimeConfig
	});
	if (!params.minimalTestGateway || startupMaintenanceConfig.channels !== void 0) {
		const { runChannelPluginStartupMaintenance } = await import("./lifecycle-startup-CAn7e09N.js");
		const startupTasks = [runChannelPluginStartupMaintenance({
			cfg: startupMaintenanceConfig,
			env: process.env,
			log: params.log
		})];
		if (!params.minimalTestGateway) {
			const { runStartupSessionMigration } = await import("./server-startup-session-migration-Hw8mjL_F.js");
			startupTasks.push(runStartupSessionMigration({
				cfg: params.cfgAtStart,
				env: process.env,
				log: params.log
			}));
			const { migrateLegacyDevicePairingStore } = await import("./device-pairing-migration-mmucCnI8.js");
			const { migrateLegacyNodePairingStore } = await import("./node-pairing-migration-DFWI9Siv.js");
			startupTasks.push(migrateLegacyDevicePairingStore({ log: params.log }).then(() => migrateLegacyNodePairingStore({ log: params.log }).then(() => void 0, (error) => {
				params.log.warn(`node pairing store migration failed: ${String(error)}`);
			}), (error) => {
				params.log.warn(`device pairing store migration failed: ${String(error)}`);
			}));
		}
		await Promise.all(startupTasks);
	}
}
/** Builds plugin startup state and gateway method lists before the server binds. */
async function prepareGatewayPluginBootstrap(params) {
	const activationSourceConfig = params.activationSourceConfig ?? params.cfgAtStart;
	initSubagentRegistry();
	const gatewayPluginConfig = params.minimalTestGateway ? params.cfgAtStart : resolveGatewayStartupPluginActivationConfig({
		runtimeConfig: params.cfgAtStart,
		activationSourceConfig,
		env: process.env,
		...params.pluginMetadataSnapshot?.manifestRegistry ? { manifestRegistry: params.pluginMetadataSnapshot.manifestRegistry } : {},
		discovery: params.pluginMetadataSnapshot?.discovery,
		ambientEnvTriggers: params.ambientEnvTriggers
	});
	const pluginsGloballyDisabled = gatewayPluginConfig.plugins?.enabled === false;
	const pluginWorkspaceDir = tryResolveConfiguredAgentWorkspaceDir(gatewayPluginConfig);
	const defaultWorkspaceDir = pluginWorkspaceDir ?? resolveDefaultAgentWorkspaceDir();
	const pluginLookUpTable = params.minimalTestGateway || pluginsGloballyDisabled ? void 0 : loadPluginLookUpTable({
		config: gatewayPluginConfig,
		workspaceDir: pluginWorkspaceDir,
		env: process.env,
		activationSourceConfig,
		metadataSnapshot: params.pluginMetadataSnapshot,
		workerProviderIds: params.workerProviderIds ?? [],
		ambientEnvTriggers: params.ambientEnvTriggers
	});
	const pluginManifestRecords = pluginLookUpTable?.manifestRegistry.plugins ?? params.pluginMetadataSnapshot?.manifestRegistry.plugins ?? [];
	const startupPluginIds = [...pluginLookUpTable?.startup.pluginIds ?? []];
	const ambientAutostartSuppressedChannelIds = params.ambientEnvTriggers === "suppress" ? new Set(listAmbientOnlyConfiguredChannelIds({
		config: params.cfgAtStart,
		activationSourceConfig,
		env: process.env,
		includePersistedAuthState: false,
		manifestRecords: pluginManifestRecords
	})) : /* @__PURE__ */ new Set();
	const baseMethods = listGatewayMethods();
	const emptyPluginRegistry = createEmptyPluginRegistry();
	const pluginRegistry = params.minimalTestGateway ? getActivePluginRegistry() ?? emptyPluginRegistry : emptyPluginRegistry;
	setActivePluginRegistry(pluginRegistry);
	return {
		gatewayPluginConfigAtStart: gatewayPluginConfig,
		defaultWorkspaceDir,
		pluginWorkspaceDir,
		startupPluginIds,
		pluginManifestRecords,
		pluginMetadataSnapshot: pluginLookUpTable ?? params.pluginMetadataSnapshot,
		pluginLookUpTable,
		baseMethods,
		pluginRegistry,
		baseGatewayMethods: baseMethods,
		ambientAutostartSuppressedChannelIds
	};
}
/**
* Warn when `memory.search.provider` selects a memory embedding provider
* that no loaded plugin registered. Without the owning plugin, `active-memory`
* cannot embed and silently falls back to keyword/FTS-only recall.
*/
function warnUnregisteredConfiguredMemoryEmbeddingProviders(params) {
	const unregistered = collectUnregisteredConfiguredMemoryEmbeddingProviders({
		config: params.config,
		registeredProviderIds: collectRegisteredEmbeddingProviderIds(params.pluginRegistry)
	});
	for (const provider of unregistered) {
		const path = `memory.search.${provider.source}`;
		params.log.warn(`${path}="${provider.configuredId}" is configured, but no loaded plugin registered a memory embedding provider that can serve "${provider.configuredId}". Semantic memory recall will fall back to keyword/FTS-only search. Ensure the plugin that provides "${provider.configuredId}" is installed and enabled.`);
	}
}
/** Loads startup plugin runtimes after the gateway listener binds. */
async function loadGatewayStartupPluginRuntime(params) {
	const { loadGatewayStartupPlugins } = await import("./server-plugin-bootstrap-C0SLJemX.js");
	await params.pluginRuntimeClaim?.waitForUnblocked();
	if (params.pluginRuntimeClaim && !params.pluginRuntimeClaim.isCurrent()) {
		const currentPluginRegistry = params.getCurrentPluginRegistry?.();
		if (!currentPluginRegistry) throw new Error("superseded Gateway startup cannot resolve the current plugin runtime");
		return {
			pluginRegistry: currentPluginRegistry,
			gatewayMethods: params.baseMethods
		};
	}
	const loaded = loadGatewayStartupPlugins({
		cfg: params.cfg,
		activationSourceConfig: params.activationSourceConfig,
		workspaceDir: params.workspaceDir,
		log: params.log,
		coreGatewayMethodNames: params.coreGatewayMethodNames ?? params.baseMethods,
		baseMethods: params.baseMethods,
		...params.hostServices !== void 0 && { hostServices: params.hostServices },
		pluginIds: params.startupPluginIds,
		pluginLookUpTable: params.pluginLookUpTable,
		channelPluginLoadIntent: "full",
		startupTrace: params.startupTrace,
		ambientEnvTriggers: params.ambientEnvTriggers,
		...params.resolveGatewayContext ? { resolveGatewayContext: params.resolveGatewayContext } : {}
	});
	warnUnregisteredConfiguredMemoryEmbeddingProviders({
		config: params.cfg,
		pluginRegistry: loaded.pluginRegistry,
		log: params.log
	});
	return loaded;
}
//#endregion
export { loadGatewayStartupPluginRuntime, prepareGatewayPluginBootstrap, resolveGatewayStartupMaintenanceConfig, runGatewayStartupMaintenance, warnUnregisteredConfiguredMemoryEmbeddingProviders };
