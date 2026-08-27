import { p as safeRealpathSync } from "./path-CYL8StfC.js";
import { c as resolveUserPath } from "./home-dir-DcrXWQPU.js";
import "./utils-D9gvQMP6.js";
import "./path-safety-CUWW7ipw.js";
import { r as resolveInstalledPluginIndexInstallOwner, t as isInstalledPluginIndexInstallOwnerAmbiguous } from "./installed-plugin-index-install-owner-Bd-Byre8.js";
import path from "node:path";
//#region src/plugins/installed-plugin-package-ownership.ts
function collectDuplicateInstallRecordOwners(index, env) {
	const ownersByPath = /* @__PURE__ */ new Map();
	const duplicateOwners = /* @__PURE__ */ new Set();
	const realpathCache = /* @__PURE__ */ new Map();
	for (const [installOwner, record] of Object.entries(index.installRecords)) {
		const rawPath = record.installPath?.trim() || record.sourcePath?.trim();
		if (!rawPath) continue;
		const resolved = path.resolve(resolveUserPath(rawPath, env));
		const pathKey = safeRealpathSync(resolved, realpathCache) ?? resolved;
		const existingOwner = ownersByPath.get(pathKey);
		if (existingOwner && existingOwner !== installOwner) {
			duplicateOwners.add(existingOwner);
			duplicateOwners.add(installOwner);
		}
		ownersByPath.set(pathKey, installOwner);
	}
	return duplicateOwners;
}
function ownershipError(pluginId, detail) {
	return {
		ok: false,
		error: `Plugin "${pluginId}" ${detail}. Refresh the plugin registry, then reinstall the package or run openclaw doctor before retrying.`
	};
}
function resolveInstalledPluginPackageOwnership(index, pluginId, env = process.env) {
	const target = index.plugins.find((entry) => entry.pluginId === pluginId);
	if (target && isInstalledPluginIndexInstallOwnerAmbiguous(target)) return ownershipError(pluginId, "has ambiguous package ownership");
	const ownerFromTarget = target ? resolveInstalledPluginIndexInstallOwner(target) : void 0;
	if (target && !ownerFromTarget) return ownershipError(pluginId, "has no authoritative package-owner metadata");
	const ownerFromRecord = Object.hasOwn(index.installRecords, pluginId) ? pluginId : void 0;
	const installOwner = ownerFromTarget ?? ownerFromRecord;
	if (!installOwner) return ownershipError(pluginId, "is not associated with a tracked package install");
	if (ownerFromTarget && ownerFromRecord && ownerFromTarget !== ownerFromRecord) return ownershipError(pluginId, "matches conflicting package owners");
	const installRecord = index.installRecords[installOwner];
	if (!installRecord) return ownershipError(pluginId, `references missing package owner "${installOwner}"`);
	if (collectDuplicateInstallRecordOwners(index, env).has(installOwner)) return ownershipError(pluginId, `shares package path ownership with "${installOwner}"`);
	const pluginIds = index.plugins.filter((entry) => resolveInstalledPluginIndexInstallOwner(entry) === installOwner && !isInstalledPluginIndexInstallOwnerAmbiguous(entry)).map((entry) => entry.pluginId).toSorted();
	if (pluginIds.length === 0) return ownershipError(pluginId, `package owner "${installOwner}" has no authoritative runtime child list`);
	if (target && !pluginIds.includes(target.pluginId)) return ownershipError(pluginId, `does not belong to package owner "${installOwner}"`);
	if (index.plugins.some((entry) => installRecordPathMatchesPluginRoot(installRecord, entry.rootDir, env) && (isInstalledPluginIndexInstallOwnerAmbiguous(entry) || resolveInstalledPluginIndexInstallOwner(entry) !== installOwner))) return ownershipError(pluginId, `package owner "${installOwner}" has conflicting child rows`);
	return {
		ok: true,
		value: {
			installOwner,
			installRecord,
			pluginIds
		}
	};
}
function installRecordPathMatchesPluginRoot(record, rootDir, env) {
	const realpathCache = /* @__PURE__ */ new Map();
	const resolvedRoot = safeRealpathSync(path.resolve(rootDir), realpathCache) ?? path.resolve(rootDir);
	return [record.installPath, record.sourcePath].some((candidate) => {
		if (!candidate?.trim()) return false;
		const candidatePath = path.resolve(resolveUserPath(candidate, env));
		const resolvedCandidate = safeRealpathSync(candidatePath, realpathCache) ?? candidatePath;
		const relative = path.relative(resolvedCandidate, resolvedRoot);
		return relative === "" || !relative.startsWith("..") && !path.isAbsolute(relative);
	});
}
function hasMissingInstalledPluginOwnerMetadata(index, env = process.env) {
	if (collectDuplicateInstallRecordOwners(index, env).size > 0) return true;
	const installRecords = Object.entries(index.installRecords);
	if (index.plugins.some((plugin) => isInstalledPluginIndexInstallOwnerAmbiguous(plugin) || !resolveInstalledPluginIndexInstallOwner(plugin) && installRecords.some(([, record]) => installRecordPathMatchesPluginRoot(record, plugin.rootDir, env)))) return true;
	return false;
}
//#endregion
export { resolveInstalledPluginPackageOwnership as n, hasMissingInstalledPluginOwnerMetadata as t };
