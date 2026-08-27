import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { n as discoverOpenClawPlugins } from "./discovery-C2Bhkw0t.js";
import { r as loadPluginManifest } from "./manifest-BmA-DH7w.js";
import path from "node:path";
//#region src/plugins/bundled-sources.ts
function findBundledPluginSourceInMap(params) {
	const targetValue = params.lookup.value.trim();
	if (!targetValue) return;
	if (params.lookup.kind === "pluginId") return params.bundled.get(targetValue);
	for (const source of params.bundled.values()) if (params.lookup.kind === "npmSpec" && source.npmSpec === targetValue || params.lookup.kind === "localPath" && path.resolve(source.localPath) === path.resolve(targetValue)) return source;
}
function resolveBundledPluginSources(params) {
	const discovery = params.discovery ?? discoverOpenClawPlugins({
		workspaceDir: params.workspaceDir,
		env: params.env
	});
	const bundled = /* @__PURE__ */ new Map();
	for (const candidate of discovery.candidates) {
		if (candidate.origin !== "bundled") continue;
		const manifest = loadPluginManifest(candidate.rootDir, false);
		if (!manifest.ok) continue;
		const pluginId = manifest.manifest.id;
		if (bundled.has(pluginId)) continue;
		const npmSpec = normalizeOptionalString(candidate.packageManifest?.install?.npmSpec) || normalizeOptionalString(candidate.packageName) || void 0;
		const version = normalizeOptionalString(candidate.packageVersion) || normalizeOptionalString(manifest.manifest.version) || void 0;
		bundled.set(pluginId, {
			pluginId,
			localPath: candidate.rootDir,
			npmSpec,
			version,
			...isRecord(manifest.manifest.configSchema) ? { configSchema: manifest.manifest.configSchema } : {},
			requiresConfig: pluginConfigSchemaHasRequiredFields(manifest.manifest.configSchema)
		});
	}
	return bundled;
}
let processBundledPluginSources;
/** Bundled manifests are process-stable; installs and metadata changes require restart. */
function getProcessBundledPluginSources() {
	processBundledPluginSources ??= resolveBundledPluginSources({});
	return processBundledPluginSources;
}
function pluginConfigSchemaHasRequiredFields(schema) {
	if (!isRecord(schema)) return false;
	const required = schema.required;
	return Array.isArray(required) && required.some((entry) => typeof entry === "string");
}
function findBundledPluginSource(params) {
	return findBundledPluginSourceInMap({
		bundled: resolveBundledPluginSources({
			workspaceDir: params.workspaceDir,
			env: params.env
		}),
		lookup: params.lookup
	});
}
function resolveBundledPluginInstallCommandHint(params) {
	const bundledSource = findBundledPluginSource({
		lookup: {
			kind: "pluginId",
			value: params.pluginId
		},
		workspaceDir: params.workspaceDir,
		env: params.env
	});
	if (!bundledSource?.localPath) return null;
	return `openclaw plugins install ${bundledSource.localPath}`;
}
//#endregion
export { resolveBundledPluginSources as a, resolveBundledPluginInstallCommandHint as i, findBundledPluginSourceInMap as n, getProcessBundledPluginSources as r, findBundledPluginSource as t };
