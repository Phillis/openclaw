import { n as resolveRealpathOrAbsolute } from "./boundary-path-DDLrDh1C.js";
import { d as getActivePluginRegistry, w as requireActivePluginRegistry } from "./runtime-B2KAtS3O.js";
import { t as resolvePreferredBuiltRuntimeArtifact } from "./plugin-runtime-artifact-selection-VqjOEbH8.js";
import fs from "node:fs";
import path from "node:path";
//#region src/plugins/plugin-runtime-artifact-resolution.ts
/** Resolves the exact root and entry selected by the plugin runtime loader. */
function clearPluginRuntimeArtifactResolutionMemo() {
	getActivePluginRegistry()?.pluginRuntimeArtifacts.clear();
}
/** Canonical packaged runtime replaces staging-only dist-runtime artifacts. */
function resolveCanonicalDistRuntimeSource(source) {
	const marker = `${path.sep}dist-runtime${path.sep}extensions${path.sep}`;
	const index = source.indexOf(marker);
	if (index === -1) return source;
	const candidate = `${source.slice(0, index)}${path.sep}dist${path.sep}extensions${path.sep}${source.slice(index + marker.length)}`;
	return fs.existsSync(candidate) ? candidate : source;
}
/** Applies both loader selection phases in their runtime order. */
function resolvePluginRuntimeArtifact(params) {
	const rootDir = resolveCanonicalDistRuntimeSource(resolveRealpathOrAbsolute(params.rootDir));
	const source = resolveCanonicalDistRuntimeSource(resolveRealpathOrAbsolute(params.source));
	const memoKey = JSON.stringify([
		params.pluginId,
		rootDir,
		params.entryKind
	]);
	const targetRegistry = params.registry ?? requireActivePluginRegistry();
	const cached = targetRegistry.pluginRuntimeArtifacts.get(memoKey);
	if (cached) {
		targetRegistry.pluginRuntimeArtifacts.set(memoKey, cached);
		return { ...cached };
	}
	const preferred = resolvePreferredBuiltRuntimeArtifact({
		...params,
		source,
		rootDir
	});
	const resolved = {
		source: resolveCanonicalDistRuntimeSource(preferred.source),
		rootDir: resolveCanonicalDistRuntimeSource(preferred.rootDir)
	};
	targetRegistry.pluginRuntimeArtifacts.set(memoKey, resolved);
	return { ...resolved };
}
//#endregion
export { resolveCanonicalDistRuntimeSource as n, resolvePluginRuntimeArtifact as r, clearPluginRuntimeArtifactResolutionMemo as t };
