import { t as pruneMapToMaxSize } from "./map-size-DAGm21RM.js";
import "./agent-scope-D9GLFAyB.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { b as tryResolveLegacyCompatibilityAgentId, d as resolveAgentWorkspaceDir, p as resolveDefaultAgentId } from "./agent-scope-config-CsnnOL14.js";
import "./legacy.default-agent-owner-0YGX8Nyg.js";
import { d as getActivePluginRegistry, p as getActivePluginRegistryVersion } from "./runtime-LV4GwzTm.js";
import { n as loadPluginRegistryHandle } from "./loader-BIAS8vL1.js";
import { d as resolveDiscoverableScopedChannelPluginIds } from "./channel-presence-policy-CdpkZk_Q.js";
import { x as resolveRuntimeConfigCacheKey } from "./runtime-snapshot-DIuCzlel.js";
import { t as applyPluginAutoEnable } from "./plugin-auto-enable-DqCmhXre.js";
import { r as withActivatedPluginIds } from "./activation-context-BX-sABLS.js";
import "./channel-plugin-ids-PXSMuTP5.js";
//#region src/infra/outbound/channel-bootstrap.runtime.ts
const MAX_BOOTSTRAP_CONFIG_GENERATIONS = 64;
const MAX_BOOTSTRAP_CHANNEL_OUTCOMES_PER_CONFIG = 64;
let bootstrapRegistryGeneration;
const bootstrapRegistriesByConfig = /* @__PURE__ */ new Map();
function cacheBootstrapOutcome(registries, key, outcome) {
	registries.delete(key);
	registries.set(key, outcome);
	pruneMapToMaxSize(registries, MAX_BOOTSTRAP_CHANNEL_OUTCOMES_PER_CONFIG);
}
function resolveBootstrapRegistryGeneration() {
	return String(getActivePluginRegistryVersion());
}
function resolveBootstrapRegistries(cfg) {
	const registryGeneration = resolveBootstrapRegistryGeneration();
	if (registryGeneration !== bootstrapRegistryGeneration) {
		bootstrapRegistryGeneration = registryGeneration;
		bootstrapRegistriesByConfig.clear();
	}
	const configKey = resolveRuntimeConfigCacheKey(cfg);
	const existing = bootstrapRegistriesByConfig.get(configKey);
	if (existing) {
		bootstrapRegistriesByConfig.delete(configKey);
		bootstrapRegistriesByConfig.set(configKey, existing);
		return existing;
	}
	pruneMapToMaxSize(bootstrapRegistriesByConfig, MAX_BOOTSTRAP_CONFIG_GENERATIONS - 1);
	const registries = /* @__PURE__ */ new Map();
	bootstrapRegistriesByConfig.set(configKey, registries);
	return registries;
}
/** Clears the per-generation channel bootstrap handle cache for isolated tests. */
function resetOutboundChannelBootstrapStateForTests() {
	bootstrapRegistryGeneration = void 0;
	bootstrapRegistriesByConfig.clear();
}
function channelEntryCanSend(entry) {
	return Boolean(entry?.plugin?.outbound?.sendText ?? entry?.plugin?.message?.send?.text);
}
function findChannelEntry(registry, channel) {
	return registry?.channels?.find((entry) => entry?.plugin?.id === channel);
}
function resolveSendCapableRegistry(registry, channel) {
	return registry && channelEntryCanSend(findChannelEntry(registry, channel)) ? registry : void 0;
}
/** Loads runtime plugins on demand when a selected outbound channel has only a setup shell. */
function bootstrapOutboundChannelPlugin(params) {
	const cfg = params.cfg;
	if (!cfg) return;
	const activeSendRegistry = resolveSendCapableRegistry(getActivePluginRegistry(), params.channel);
	if (activeSendRegistry) return activeSendRegistry;
	const agentId = params.agentId?.trim() ? normalizeAgentId(params.agentId) : tryResolveLegacyCompatibilityAgentId(cfg) ?? resolveDefaultAgentId(cfg);
	const outcomeKey = `${agentId}\0${params.channel}`;
	const registries = resolveBootstrapRegistries(cfg);
	const cachedRegistry = registries.get(outcomeKey);
	if (cachedRegistry !== void 0) {
		cacheBootstrapOutcome(registries, outcomeKey, cachedRegistry);
		return resolveSendCapableRegistry(cachedRegistry, params.channel);
	}
	const autoEnabled = applyPluginAutoEnable({ config: cfg });
	const workspaceDir = resolveAgentWorkspaceDir(cfg, agentId);
	const pluginIds = resolveDiscoverableScopedChannelPluginIds({
		config: autoEnabled.config,
		activationSourceConfig: cfg,
		channelIds: [params.channel],
		workspaceDir,
		env: process.env
	});
	const activatedConfig = withActivatedPluginIds({
		config: autoEnabled.config,
		pluginIds
	}) ?? autoEnabled.config;
	const activatedSourceConfig = withActivatedPluginIds({
		config: cfg,
		pluginIds
	}) ?? cfg;
	let sendRegistry;
	try {
		sendRegistry = resolveSendCapableRegistry(loadPluginRegistryHandle({
			config: activatedConfig,
			activationSourceConfig: activatedSourceConfig,
			autoEnabledReasons: autoEnabled.autoEnabledReasons,
			onlyPluginIds: pluginIds,
			workspaceDir,
			runtimeOptions: { allowGatewaySubagentBinding: true }
		}), params.channel);
	} catch {}
	cacheBootstrapOutcome(registries, outcomeKey, sendRegistry ?? null);
	return sendRegistry;
}
//#endregion
export { resetOutboundChannelBootstrapStateForTests as n, bootstrapOutboundChannelPlugin as t };
