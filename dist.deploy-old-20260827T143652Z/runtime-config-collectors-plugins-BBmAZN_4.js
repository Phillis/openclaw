import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { u as normalizeStringEntries } from "./string-normalization-e_fvmxMf.js";
import { t as parseConfigPathArrayIndex } from "./path-array-index-CvEcUJa-.js";
import { s as normalizePluginsConfig, u as resolveEnableState } from "./config-state-CpuWFwzR.js";
import { t as resolveConfigWidePluginManifestRegistry } from "./io.plugin-metadata-BQhELyO0.js";
import { t as collectPluginConfigContractMatches } from "./config-contract-matches-CJFCzwZy.js";
import { t as resolvePluginConfigContractsById } from "./config-contracts-DjQ2UJvq.js";
import "./shared-QozwPUGk.js";
import { n as collectRuntimeSecretInputAssignment } from "./runtime-shared-D-v-cKxA.js";
//#region src/secrets/runtime-config-collectors-plugins.ts
/** Collects plugin config secret refs from runtime plugin metadata. */
function parsePluginConfigArrayIndex(segment) {
	return parseConfigPathArrayIndex(segment);
}
/**
* Walk manifest-declared plugin config SecretRef surfaces and collect
* assignments for runtime materialization. Plugin-owned metadata controls which
* config paths support SecretRefs and whether bundled plugins stay inactive on
* that surface until explicitly enabled.
*
* When `loadablePluginOrigins` is provided, entries whose ID is not in the map
* are treated as inactive (stale config entries for plugins that are no longer
* installed). This prevents resolution failures for SecretRefs belonging to
* non-loadable plugins from blocking startup or preflight validation.
*/
/** Collects SecretRef assignments from plugin-owned config contract paths. */
function collectPluginConfigAssignments(params) {
	const entries = params.config.plugins?.entries;
	if (!isRecord(entries)) return;
	const normalizedConfig = normalizePluginsConfig(params.config.plugins);
	const manifestRegistry = params.context.manifestRegistry ?? resolveConfigWidePluginManifestRegistry({
		config: params.config,
		env: params.context.env
	});
	const bundledLoadablePluginIds = [...params.loadablePluginOrigins?.entries() ?? []].filter(([, origin]) => origin === "bundled").map(([pluginId]) => pluginId);
	const pluginSecretInputs = new Map([...resolvePluginConfigContractsById({
		config: params.config,
		env: params.context.env,
		fallbackToBundledMetadata: true,
		fallbackToBundledMetadataForResolvedBundled: true,
		fallbackBundledPluginIds: bundledLoadablePluginIds,
		pluginIds: Object.keys(entries),
		manifestRegistry
	}).entries()].flatMap(([pluginId, metadata]) => {
		const secretInputs = metadata.configContracts.secretInputs;
		if (!secretInputs?.paths.length) return [];
		return [[pluginId, {
			origin: metadata.origin,
			bundledDefaultEnabled: secretInputs.bundledDefaultEnabled,
			paths: secretInputs.paths
		}]];
	}));
	for (const [pluginId, entry] of Object.entries(entries)) {
		const secretInputs = pluginSecretInputs.get(pluginId);
		if (!secretInputs) continue;
		if (!isRecord(entry)) continue;
		const pluginConfig = entry.config;
		if (!isRecord(pluginConfig)) continue;
		const pluginOrigin = params.loadablePluginOrigins?.get(pluginId);
		if (params.loadablePluginOrigins && !pluginOrigin) {
			collectConfiguredPluginSecretAssignments({
				pluginId,
				pluginConfig,
				secretPaths: secretInputs.paths,
				active: false,
				inactiveReason: "plugin is not loadable (stale config entry).",
				defaults: params.defaults,
				context: params.context
			});
			continue;
		}
		const resolvedOrigin = pluginOrigin ?? secretInputs.origin;
		const enableState = resolveEnableState(pluginId, resolvedOrigin, normalizedConfig, resolvedOrigin === "bundled" ? secretInputs.bundledDefaultEnabled : void 0);
		collectConfiguredPluginSecretAssignments({
			pluginId,
			pluginConfig,
			secretPaths: secretInputs.paths,
			active: enableState.enabled,
			inactiveReason: enableState.reason ?? "plugin is disabled.",
			defaults: params.defaults,
			context: params.context
		});
	}
}
function collectConfiguredPluginSecretAssignments(params) {
	const seenPaths = /* @__PURE__ */ new Set();
	for (const secretPath of params.secretPaths) for (const match of collectPluginConfigContractMatches({
		root: params.pluginConfig,
		pathPattern: secretPath.path
	})) {
		const fullPath = `plugins.entries.${params.pluginId}.config.${match.path}`;
		if (seenPaths.has(fullPath)) continue;
		seenPaths.add(fullPath);
		collectRuntimeSecretInputAssignment({
			value: match.value,
			path: fullPath,
			expected: secretPath.expected ?? "string",
			defaults: params.defaults,
			context: params.context,
			active: params.active,
			inactiveReason: `plugin "${params.pluginId}": ${params.inactiveReason}`,
			...secretPath.ownerKind ? { owner: {
				ownerKind: secretPath.ownerKind,
				ownerId: fullPath,
				requiredForGateway: false,
				disposition: "isolate",
				contract: params.pluginConfig
			} } : {},
			apply: createPluginConfigAssignmentApply(params.pluginConfig, match.path)
		});
	}
}
function createPluginConfigAssignmentApply(pluginConfig, relativePath) {
	return (value) => {
		const segments = normalizeStringEntries(relativePath.replace(/\[(\d+)\]/g, ".$1").split("."));
		if (segments.length === 0) return;
		let current = pluginConfig;
		for (const segment of segments.slice(0, -1)) {
			if (Array.isArray(current)) {
				const index = parsePluginConfigArrayIndex(segment);
				current = index !== void 0 && index < current.length ? current[index] : void 0;
				continue;
			}
			current = isRecord(current) ? current[segment] : void 0;
		}
		const finalSegment = segments.at(-1);
		if (!finalSegment) return;
		if (Array.isArray(current)) {
			const index = parsePluginConfigArrayIndex(finalSegment);
			if (index !== void 0 && index < current.length) current[index] = value;
			return;
		}
		if (isRecord(current)) current[finalSegment] = value;
	};
}
//#endregion
export { collectPluginConfigAssignments as t };
