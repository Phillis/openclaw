import { n as collectUniqueCommandDescriptors } from "./command-descriptor-utils-C7spGKc4.js";
import { t as normalizePluginPolicyId } from "./plugin-policy-id-4QxPdFqy.js";
import { r as hasKind } from "./slots-CQdAEuat.js";
import { d as resolveMemorySlotDecision, s as normalizePluginsConfig } from "./config-state-Bgpvw0Q6.js";
import { r as isInstalledPluginEnabled } from "./installed-plugin-index-Cr71VmpU.js";
import { h as validatePluginConfig } from "./loader-shared-clOILqTh.js";
import { a as resolvePluginRuntimeLoadContext, t as buildPluginRuntimeLoadOptions } from "./load-context-B4HwYEoR.js";
//#region src/plugins/cli-root-descriptors.ts
/** Resolves root CLI help from process-stable manifests before plugin code loads. */
const quietLogger = {
	info: () => {},
	warn: () => {},
	error: () => {},
	debug: () => {}
};
async function getPluginCliCommandDescriptors(cfg, env, loaderOptions) {
	const descriptorGroups = [];
	try {
		const context = resolvePluginRuntimeLoadContext({
			config: cfg,
			env,
			logger: quietLogger
		});
		const snapshot = context.metadataSnapshot;
		if (!snapshot) return [];
		const legacyExternalPluginIds = [];
		const seenPluginIds = /* @__PURE__ */ new Set();
		let selectedMemoryPluginId = null;
		const memorySlot = context.config.plugins?.slots?.memory;
		const normalizedConfig = normalizePluginsConfig(context.config.plugins);
		for (const plugin of snapshot.plugins) {
			if (seenPluginIds.has(plugin.id)) continue;
			seenPluginIds.add(plugin.id);
			if (!isInstalledPluginEnabled(snapshot.index, plugin.id, context.config)) continue;
			const pluginConfig = normalizedConfig.entries[normalizePluginPolicyId(plugin.id)]?.config;
			if (!validatePluginConfig({
				schema: plugin.configSchema,
				cacheKey: plugin.schemaCacheKey,
				value: pluginConfig
			}).ok) continue;
			const memoryDecision = resolveMemorySlotDecision({
				id: plugin.id,
				kind: plugin.kind,
				slot: memorySlot,
				selectedId: selectedMemoryPluginId
			});
			if (!memoryDecision.enabled) continue;
			if (memoryDecision.selected && hasKind(plugin.kind, "memory")) selectedMemoryPluginId = plugin.id;
			if (plugin.cliCommands) descriptorGroups.push(plugin.cliCommands);
			else if (plugin.origin !== "bundled" && plugin.format !== "bundle") legacyExternalPluginIds.push(plugin.id);
		}
		if (legacyExternalPluginIds.length > 0) {
			const { loadOpenClawPluginCliRegistry } = await import("./plugins/loader.js");
			const registry = await loadOpenClawPluginCliRegistry(buildPluginRuntimeLoadOptions(context, {
				...loaderOptions,
				onlyPluginIds: legacyExternalPluginIds
			}));
			descriptorGroups.push(...registry.cliRegistrars.filter((entry) => (entry.parentPath ?? []).length === 0).map((entry) => entry.descriptors));
		}
		return collectUniqueCommandDescriptors(descriptorGroups);
	} catch {
		return collectUniqueCommandDescriptors(descriptorGroups);
	}
}
//#endregion
export { getPluginCliCommandDescriptors as t };
