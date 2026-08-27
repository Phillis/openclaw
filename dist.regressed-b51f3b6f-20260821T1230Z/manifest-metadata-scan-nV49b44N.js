import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { S as parseJsonWithJson5Fallback } from "./redact-Cl7lwBnl.js";
import { i as readRegularFileSync } from "./regular-file-CXw3t-8J.js";
import { r as resolveHomeRelativePath } from "./home-dir-DcrXWQPU.js";
import { t as resolveRealpathOrAbsolute } from "./boundary-path-dOybNsjk.js";
import { n as resolveOpenClawPackageRootSync } from "./openclaw-root-DSkQ6e_8.js";
import "./regular-file-C2hsuc07.js";
import { t as createSubsystemLogger } from "./subsystem-CDLhGl2-.js";
import { r as resolveBundledPluginsDir } from "./bundled-dir-CvTl0ZdS.js";
import { r as resolveDefaultPluginExtensionsDir } from "./install-paths-BYSW9x3z.js";
import { i as readPersistedInstalledPluginIndexSync } from "./installed-plugin-index-store-CVIoH-T0.js";
import fs from "node:fs";
import path from "node:path";
//#region src/plugins/manifest-metadata-scan.ts
const PLUGIN_MANIFEST_METADATA_MAX_BYTES = 256 * 1024;
const log = createSubsystemLogger("plugins/manifest-metadata-scan");
const PLUGIN_MANIFEST_FILENAME = "openclaw.plugin.json";
let manifestMetadataCache;
function listChildPluginDirs(root, rank, startOrder, origin) {
	if (!root || !fs.existsSync(root)) return [];
	const dirs = [];
	let order = startOrder;
	try {
		const entries = fs.readdirSync(root, { withFileTypes: true }).toSorted((left, right) => left.name < right.name ? -1 : left.name > right.name ? 1 : 0);
		for (const entry of entries) if (entry.isDirectory()) dirs.push({
			pluginDir: path.join(root, entry.name),
			rank,
			order: order++,
			origin
		});
	} catch {
		return [];
	}
	return dirs;
}
function readJsonObject(filePath) {
	try {
		const { buffer } = readRegularFileSync({
			filePath,
			maxBytes: PLUGIN_MANIFEST_METADATA_MAX_BYTES
		});
		const parsed = parseJsonWithJson5Fallback(buffer.toString("utf-8"));
		return isRecord(parsed) ? parsed : void 0;
	} catch (err) {
		if (err instanceof Error && err.message.includes("exceeds")) log.warn(`Ignoring oversized plugin manifest at ${filePath}: file exceeds the ${PLUGIN_MANIFEST_METADATA_MAX_BYTES}-byte limit`);
		return;
	}
}
function readManifestObject(pluginDir) {
	return readJsonObject(path.join(pluginDir, PLUGIN_MANIFEST_FILENAME));
}
function manifestFileFingerprint(pluginDir) {
	const manifestPath = path.join(pluginDir, PLUGIN_MANIFEST_FILENAME);
	try {
		const stat = fs.statSync(manifestPath);
		return `${manifestPath}:${stat.mtimeMs}:${stat.size}`;
	} catch {
		return `${manifestPath}:missing`;
	}
}
function listPersistedIndexPluginDirs(env, startOrder) {
	const index = readPersistedInstalledPluginIndexSync({ env });
	if (!index) return [];
	const dirs = [];
	let order = startOrder;
	for (const plugin of index.plugins) {
		const rootDir = normalizeOptionalString(plugin.rootDir);
		if (!rootDir) continue;
		dirs.push({
			pluginDir: resolveHomeRelativePath(rootDir, { env }),
			rank: plugin.origin === "bundled" ? 3 : 1,
			order: order++,
			origin: normalizeOptionalString(plugin.origin)
		});
	}
	return dirs;
}
function isSourceCheckoutRoot(packageRoot) {
	return fs.existsSync(path.join(packageRoot, "pnpm-workspace.yaml")) && fs.existsSync(path.join(packageRoot, "src")) && fs.existsSync(path.join(packageRoot, "extensions"));
}
function resolvePackageRootsForSourceManifestMetadata() {
	const roots = [];
	for (const params of [{ argv1: process.argv[1] }, { moduleUrl: import.meta.url }]) {
		const root = resolveOpenClawPackageRootSync(params);
		if (root && !roots.includes(root)) roots.push(root);
	}
	return roots;
}
function listSourceCheckoutPluginDirs(startOrder) {
	const dirs = [];
	let order = startOrder;
	for (const packageRoot of resolvePackageRootsForSourceManifestMetadata()) {
		if (!isSourceCheckoutRoot(packageRoot)) continue;
		dirs.push(...listChildPluginDirs(path.join(packageRoot, "extensions"), 3, order, "source"));
		order = startOrder + dirs.length;
	}
	return dirs;
}
function uniqueCandidateDirs(candidates) {
	const byPath = /* @__PURE__ */ new Map();
	for (const candidate of candidates) {
		const key = resolveRealpathOrAbsolute(candidate.pluginDir);
		const existing = byPath.get(key);
		if (!existing || candidate.rank < existing.rank || candidate.order < existing.order) byPath.set(key, candidate);
	}
	return [...byPath.values()].toSorted((left, right) => left.rank - right.rank || left.order - right.order);
}
/** Lists plugin manifest metadata from installed, bundled, and global plugin roots. */
function listOpenClawPluginManifestMetadata(env = process.env) {
	const candidates = [];
	let order = 0;
	candidates.push(...listPersistedIndexPluginDirs(env, order));
	order = candidates.length;
	candidates.push(...listChildPluginDirs(resolveBundledPluginsDir(env), 2, order, "bundled"));
	order = candidates.length;
	candidates.push(...listSourceCheckoutPluginDirs(order));
	order = candidates.length;
	candidates.push(...listChildPluginDirs(resolveDefaultPluginExtensionsDir(env), 4, order, "global"));
	const uniqueCandidates = uniqueCandidateDirs(candidates);
	const cacheKey = JSON.stringify(uniqueCandidates.map((candidate) => [
		candidate.pluginDir,
		candidate.rank,
		candidate.order,
		candidate.origin ?? "",
		manifestFileFingerprint(candidate.pluginDir)
	]));
	if (manifestMetadataCache?.key === cacheKey) return manifestMetadataCache.records.slice();
	const byManifestId = /* @__PURE__ */ new Map();
	const records = [];
	for (const candidate of uniqueCandidates) {
		const manifest = readManifestObject(candidate.pluginDir);
		if (!manifest) continue;
		const manifestId = normalizeOptionalString(manifest.id);
		if (manifestId) {
			const existing = byManifestId.get(manifestId);
			if (existing && existing.rank <= candidate.rank) continue;
			byManifestId.set(manifestId, candidate);
		}
		records.push({
			pluginDir: candidate.pluginDir,
			manifest,
			origin: candidate.origin
		});
	}
	manifestMetadataCache = {
		key: cacheKey,
		records
	};
	return records;
}
//#endregion
export { listOpenClawPluginManifestMetadata as t };
