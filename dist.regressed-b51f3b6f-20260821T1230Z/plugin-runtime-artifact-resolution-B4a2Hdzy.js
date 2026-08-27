import { t as resolveRealpathOrAbsolute } from "./boundary-path-dOybNsjk.js";
import { S as requireActivePluginRegistry, d as getActivePluginRegistry } from "./runtime-g0R28Sy0.js";
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
function rewriteBundledRuntimeArtifactRelativePath(relativePath) {
	return relativePath.replace(/\.[^.]+$/u, ".js");
}
function listPackageLocalRuntimeArtifactOutputExtensions(sourceExt) {
	switch (sourceExt) {
		case ".mts":
		case ".mjs": return [
			".mjs",
			".js",
			".cjs"
		];
		case ".cts":
		case ".cjs": return [
			".cjs",
			".js",
			".mjs"
		];
		default: return [
			".js",
			".mjs",
			".cjs"
		];
	}
}
function listPackageLocalRuntimeArtifactRelativePathBases(relativePath) {
	const ext = path.extname(relativePath).toLowerCase();
	const withoutExt = ext ? relativePath.slice(0, -ext.length) : relativePath;
	if (!withoutExt.startsWith(`src${path.sep}`) && !withoutExt.startsWith("src/")) return [withoutExt];
	return [withoutExt.slice(4), withoutExt];
}
function listPackageLocalDistRuntimeArtifactRelativePaths(relativePath) {
	const ext = path.extname(relativePath).toLowerCase();
	const candidates = /* @__PURE__ */ new Set();
	for (const base of listPackageLocalRuntimeArtifactRelativePathBases(relativePath)) for (const outputExt of listPackageLocalRuntimeArtifactOutputExtensions(ext)) candidates.add(`${base}${outputExt}`);
	return [...candidates];
}
function shouldPreferPackageLocalDistRuntimeArtifact(source) {
	switch (path.extname(source).toLowerCase()) {
		case ".ts":
		case ".tsx":
		case ".mts":
		case ".cts": return true;
		default: return false;
	}
}
function resolvePackageLocalDistRuntimeArtifact(params) {
	const relativeSource = path.relative(params.rootDir, params.source);
	if (!shouldPreferPackageLocalDistRuntimeArtifact(relativeSource) || relativeSource === "" || relativeSource.startsWith("..") || path.isAbsolute(relativeSource)) return null;
	const artifactRoot = path.join(params.rootDir, "dist");
	for (const artifactRelativePath of listPackageLocalDistRuntimeArtifactRelativePaths(relativeSource)) {
		const artifactSource = path.join(artifactRoot, artifactRelativePath);
		if (fs.existsSync(artifactSource)) return resolveRealpathOrAbsolute(artifactSource);
	}
	return null;
}
function resolvePreferredBuiltRuntimeArtifact(params) {
	const rootDir = resolveRealpathOrAbsolute(params.rootDir);
	const source = resolveRealpathOrAbsolute(params.source);
	if (!params.preferBuiltPluginArtifacts) return {
		source,
		rootDir
	};
	if (params.origin !== "bundled") {
		const artifactSource = resolvePackageLocalDistRuntimeArtifact({
			source,
			rootDir
		});
		if (artifactSource) return {
			source: artifactSource,
			rootDir
		};
		return {
			source,
			rootDir
		};
	}
	if (params.packageManifest?.build?.bundledDist === false) return {
		source,
		rootDir
	};
	const packageLocalArtifactSource = resolvePackageLocalDistRuntimeArtifact({
		source,
		rootDir
	});
	if (packageLocalArtifactSource) return {
		source: packageLocalArtifactSource,
		rootDir
	};
	const extensionsDir = path.dirname(rootDir);
	if (path.basename(extensionsDir) !== "extensions") return {
		source,
		rootDir
	};
	const packageRoot = path.dirname(extensionsDir);
	if (path.basename(packageRoot) === "dist" || path.basename(packageRoot) === "dist-runtime") return {
		source,
		rootDir
	};
	const relativeSource = path.relative(rootDir, source);
	if (relativeSource === "" || relativeSource.startsWith("..") || path.isAbsolute(relativeSource)) return {
		source,
		rootDir
	};
	const artifactRelativePath = rewriteBundledRuntimeArtifactRelativePath(relativeSource);
	for (const artifactRootName of ["dist-runtime", "dist"]) {
		const artifactRoot = path.join(packageRoot, artifactRootName, "extensions", path.basename(rootDir));
		const artifactSource = path.join(artifactRoot, artifactRelativePath);
		if (fs.existsSync(artifactSource)) return {
			source: resolveRealpathOrAbsolute(artifactSource),
			rootDir: resolveRealpathOrAbsolute(artifactRoot)
		};
	}
	return {
		source,
		rootDir
	};
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
