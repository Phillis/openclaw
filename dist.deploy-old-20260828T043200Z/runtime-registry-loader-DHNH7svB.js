import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.js";
import { s as normalizePluginsConfig } from "./config-state-Bgpvw0Q6.js";
import { l as hasNonEmptyPluginIdScope } from "./current-plugin-metadata-snapshot-CKAJM6x9.js";
import { f as createInstalledPluginIndexScopeLookup, h as collectConfiguredMemoryEmbeddingProviderIds, r as resolveChannelPluginIds } from "./gateway-startup-plugin-ids-Dtzhwc1j.js";
import { s as loadOpenClawPlugins } from "./loader-D0AfkRZe.js";
import { l as resolveConfiguredChannelPluginIds } from "./channel-presence-policy-Cy9fjmLX.js";
import { r as withActivatedPluginIds } from "./activation-context-uSIB1oKw.js";
import { a as resolvePluginRuntimeLoadContext, n as buildPluginRuntimeLoadOptionsFromValues } from "./load-context-Cj6rxf47.js";
import "./channel-plugin-ids-BdzaxZ-5.js";
import { t as resolveEffectivePluginIds } from "./effective-plugin-ids-CnfdOAFI.js";
//#region src/plugins/runtime/runtime-registry-loader.ts
const CORE_SANDBOX_BACKEND_IDS = /* @__PURE__ */ new Set([
	"docker",
	"podman",
	"ssh"
]);
function resolveMemoryPluginIds(context) {
	const configuredProviderIds = [...collectConfiguredMemoryEmbeddingProviderIds(context.activationSourceConfig)];
	const pluginIds = /* @__PURE__ */ new Set();
	if (context.metadataSnapshot) createInstalledPluginIndexScopeLookup(context.metadataSnapshot.index).addProviderContributionOwners(pluginIds, configuredProviderIds);
	else for (const providerId of configuredProviderIds) pluginIds.add(providerId);
	const memoryPluginId = normalizePluginsConfig(context.config.plugins).slots.memory?.trim();
	if (memoryPluginId) pluginIds.add(memoryPluginId);
	return [...pluginIds].toSorted();
}
function resolveSandboxBackendPluginIds(context) {
	if (!context.metadataSnapshot) return [];
	const agents = context.activationSourceConfig.agents;
	const configuredBackendIds = [
		agents?.defaults?.sandbox?.backend,
		...Object.values(agents?.entries ?? {}).map((agent) => agent.sandbox?.backend),
		...(agents?.list ?? []).map((agent) => agent.sandbox?.backend)
	];
	const lookup = createInstalledPluginIndexScopeLookup(context.metadataSnapshot.index);
	const pluginIds = /* @__PURE__ */ new Set();
	for (const backendId of configuredBackendIds) {
		const normalizedBackendId = normalizeOptionalLowercaseString(backendId);
		if (!normalizedBackendId || CORE_SANDBOX_BACKEND_IDS.has(normalizedBackendId) || !lookup.hasInstalledPluginIds([normalizedBackendId])) continue;
		pluginIds.add(lookup.normalizePluginId(normalizedBackendId));
	}
	return [...pluginIds].toSorted();
}
function resolveScopePluginIds(params) {
	if (params.scope === "configured-channels") return resolveConfiguredChannelPluginIds({
		config: params.context.config,
		activationSourceConfig: params.context.activationSourceConfig,
		workspaceDir: params.context.workspaceDir,
		env: params.context.env
	});
	if (params.scope === "channels") return resolveChannelPluginIds({
		config: params.context.config,
		workspaceDir: params.context.workspaceDir,
		env: params.context.env
	});
	if (params.scope === "memory") return resolveMemoryPluginIds(params.context);
	if (params.scope === "sandbox-backends") return resolveSandboxBackendPluginIds(params.context);
	return resolveEffectivePluginIds({
		config: params.context.rawConfig,
		workspaceDir: params.context.workspaceDir,
		env: params.context.env
	});
}
function ensurePluginRegistryLoaded(options) {
	const scope = options?.scope ?? "all";
	const context = resolvePluginRuntimeLoadContext(options);
	const pluginIds = resolveScopePluginIds({
		scope,
		context
	});
	const activateConfigured = scope === "configured-channels" && pluginIds.length > 0;
	const config = activateConfigured ? withActivatedPluginIds({
		config: context.config,
		pluginIds
	}) ?? context.config : context.config;
	const activationSourceConfig = activateConfigured ? withActivatedPluginIds({
		config: context.activationSourceConfig,
		pluginIds
	}) ?? context.activationSourceConfig : context.activationSourceConfig;
	loadOpenClawPlugins(buildPluginRuntimeLoadOptionsFromValues({
		...context,
		config,
		activationSourceConfig
	}, {
		throwOnLoadError: true,
		...scope === "configured-channels" || scope === "memory" || scope === "sandbox-backends" || scope === "all" || hasNonEmptyPluginIdScope(pluginIds) ? { onlyPluginIds: pluginIds } : {}
	}));
}
//#endregion
export { ensurePluginRegistryLoaded as t };
