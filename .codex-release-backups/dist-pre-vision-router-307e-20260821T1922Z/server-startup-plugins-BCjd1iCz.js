import "./agent-scope-BizOtGGz.js";
import { v as tryResolveConfiguredAgentWorkspaceDir } from "./agent-scope-config-BdXMWufB.js";
import { n as resolveDefaultAgentWorkspaceDir } from "./workspace-default-kpBt4Iki.js";
import { g as collectUnregisteredConfiguredMemoryEmbeddingProviders, h as collectRegisteredEmbeddingProviderIds } from "./gateway-startup-plugin-ids-DTekdjuw.js";
import { E as setActivePluginRegistry, d as getActivePluginRegistry, k as createEmptyPluginRegistry } from "./runtime-g0R28Sy0.js";
import "./loader-B4G6K_LK.js";
import { r as listAmbientOnlyConfiguredChannelIds } from "./channel-presence-policy-BGHW2ysK.js";
import "./channel-plugin-ids-D_pdFp_m.js";
import { t as loadPluginLookUpTable } from "./plugin-lookup-table-Cm0ZEJkG.js";
import { f as initSubagentRegistry } from "./subagent-registry-AAq73FyJ.js";
import { r as resolveGatewayStartupPluginActivationConfig } from "./plugin-activation-runtime-config-CiFJvQoH.js";
import { n as listGatewayMethods } from "./server-methods-list-BTR8XDib.js";
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
		const { runChannelPluginStartupMaintenance } = await import("./lifecycle-startup--aFwhmo3.js");
		const startupTasks = [runChannelPluginStartupMaintenance({
			cfg: startupMaintenanceConfig,
			env: process.env,
			log: params.log
		})];
		if (!params.minimalTestGateway) {
			const { runStartupSessionMigration } = await import("./server-startup-session-migration-49Pm1mF-.js");
			startupTasks.push(runStartupSessionMigration({
				cfg: params.cfgAtStart,
				env: process.env,
				log: params.log
			}));
			const { migrateLegacyDevicePairingStore } = await import("./device-pairing-migration-CbAJ7w1j.js");
			const { migrateLegacyNodePairingStore } = await import("./node-pairing-migration-Bl59l7aq.js");
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
	const { loadGatewayStartupPlugins } = await import("./server-plugin-bootstrap-D6T4vTV1.js");
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
		ambientEnvTriggers: params.ambientEnvTriggers
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
