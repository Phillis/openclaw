import { a as isPathInside } from "./path-CYL8StfC.js";
import "./path-guards-CQdx2c2I.js";
import { a as resolveDefaultPluginNpmDir, d as resolvePluginNpmProjectsDir } from "./install-paths-Bp_9OgEZ.js";
import { i as getPluginInstallRecordMapEntry, l as setPluginInstallRecordMapEntry, n as copyPluginInstallRecordMap, r as createPluginInstallRecordMap } from "./plugin-install-record-map-CWFLMnp7.js";
import { n as loadInstalledPluginIndexInstallRecords } from "./installed-plugin-index-record-reader-CDDyVBh4.js";
import { a as resolveRetainedManagedNpmInstallMarkerPath, i as markRetainedManagedNpmInstall, n as clearRetainedManagedNpmInstallMarker, o as resolveRetainedManagedNpmInstallPackageInfo } from "./managed-npm-retention-BnonUCDl.js";
import { c as restorePersistedInstalledPluginIndexIfCurrent } from "./installed-plugin-index-store-DCxz0axS.js";
import { y as resolveConfigWriteAfterWrite } from "./runtime-snapshot-DIuCzlel.js";
import { a as transformConfigFileWithRetry, r as replaceConfigFile } from "./mutate-B2SI65Vd.js";
import "./config-CfeGo4K4.js";
import { c as writePersistedInstalledPluginIndexInstallRecordsWithLease, o as withoutPluginInstallRecords, t as PLUGIN_INSTALLS_CONFIG_PATH } from "./installed-plugin-index-records-1BeSqHzt.js";
import { t as withPluginLifecycleLease } from "./plugin-lifecycle-lease-say_7LA7.js";
import { n as recordPluginPackageUninstallPlan } from "./uninstall-package-plan-DVdwa1CC.js";
import { a as planPluginUninstall } from "./uninstall-DyFfFHQ5.js";
import fs from "node:fs";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
//#region src/plugins/install-record-commit.ts
function mergeUnsetPaths(left, right) {
	const merged = [...left ?? [], ...right ?? []];
	return merged.length > 0 ? merged : void 0;
}
/** Return whether config still contains legacy/transient plugin install records. */
function hasPendingPluginInstallRecords(config) {
	return Object.keys(config.plugins?.installs ?? {}).length > 0;
}
function pluginInstallRecordMapsEqual(left, right) {
	const leftEntries = Object.entries(left);
	return leftEntries.length === Object.keys(right).length && leftEntries.every(([pluginId, record]) => Object.hasOwn(right, pluginId) && isDeepStrictEqual(getPluginInstallRecordMapEntry(right, pluginId), record));
}
/** Find pending install records that match the base config and can be stripped as unchanged. */
function unchangedPendingPluginInstallRecordIds(config, baseConfig) {
	const pendingInstalls = config.plugins?.installs ?? {};
	return Object.entries(baseConfig.plugins?.installs ?? {}).filter(([pluginId, baseInstall]) => isDeepStrictEqual(getPluginInstallRecordMapEntry(pendingInstalls, pluginId), baseInstall)).map(([pluginId]) => pluginId);
}
/** Remove pending plugin install records from config, optionally only for selected ids. */
function stripPendingPluginInstallRecords(config, pluginIds) {
	if (!pluginIds) return withoutPluginInstallRecords(config);
	const removeIds = new Set(pluginIds);
	if (removeIds.size === 0 || !config.plugins?.installs) return config;
	const remainingInstalls = createPluginInstallRecordMap();
	for (const [pluginId, record] of Object.entries(config.plugins.installs)) if (!removeIds.has(pluginId)) setPluginInstallRecordMapEntry(remainingInstalls, pluginId, record);
	if (Object.keys(remainingInstalls).length === 0) return withoutPluginInstallRecords(config);
	return {
		...config,
		plugins: {
			...config.plugins,
			installs: remainingInstalls
		}
	};
}
const PLUGIN_SOURCE_CHANGED_RESTART_REASON = "plugin source changed";
function mergeAfterWrite(writeOptions, afterWrite) {
	if (afterWrite === void 0) return writeOptions;
	return {
		...writeOptions,
		afterWrite
	};
}
function isMissingInstallPathError(error) {
	const code = error.code;
	return code === "ENOENT" || code === "ENOTDIR";
}
function resolveExistingInstallPath(installPath) {
	const resolvedPath = path.resolve(installPath);
	try {
		return fs.realpathSync(resolvedPath);
	} catch (error) {
		if (isMissingInstallPathError(error)) return resolvedPath;
		throw error;
	}
}
function installPathsOverlap(left, right) {
	const resolvedLeft = resolveExistingInstallPath(left);
	const resolvedRight = resolveExistingInstallPath(right);
	return resolvedLeft === resolvedRight || isPathInside(resolvedLeft, resolvedRight) || isPathInside(resolvedRight, resolvedLeft);
}
function resolveRetainedManagedNpmInstallMarkerTarget(params) {
	if (params.previousRecord?.source !== "npm") return null;
	const previousInstallPath = params.previousRecord.installPath?.trim();
	const nextInstallPath = params.nextRecord?.installPath?.trim();
	if (!previousInstallPath) return null;
	if (params.nextRecord && (!nextInstallPath || installPathsOverlap(previousInstallPath, nextInstallPath))) return null;
	if (params.nextRecord?.source !== "npm") {
		const packageInfo = resolveRetainedManagedNpmInstallPackageInfo(previousInstallPath);
		if (!packageInfo) return null;
		try {
			const configuredNpmRoot = path.resolve(resolveDefaultPluginNpmDir());
			const npmRoot = fs.realpathSync(configuredNpmRoot);
			const configuredProjectRoot = path.resolve(packageInfo.projectRoot);
			const projectRoot = fs.realpathSync(configuredProjectRoot);
			const packageDir = fs.realpathSync(previousInstallPath);
			if (path.relative(configuredNpmRoot, configuredProjectRoot) !== path.relative(npmRoot, projectRoot) || path.relative(configuredProjectRoot, path.resolve(previousInstallPath)) !== path.relative(projectRoot, packageDir)) return null;
			if (projectRoot === npmRoot) return previousInstallPath;
			const projectsRoot = fs.realpathSync(resolvePluginNpmProjectsDir(npmRoot));
			return path.dirname(projectRoot) === projectsRoot ? previousInstallPath : null;
		} catch (error) {
			if (isMissingInstallPathError(error)) return null;
			throw error;
		}
	}
	const installs = createPluginInstallRecordMap();
	setPluginInstallRecordMapEntry(installs, params.pluginId, params.previousRecord);
	const plan = planPluginUninstall(recordPluginPackageUninstallPlan({
		config: { plugins: { installs } },
		pluginId: params.pluginId,
		deleteFiles: true
	}, { runtimePluginIds: [] }));
	if (!plan.ok || !plan.directoryRemoval || plan.directoryRemoval.cleanup?.kind !== "npm" || path.resolve(plan.directoryRemoval.target) !== path.resolve(previousInstallPath)) return null;
	if (nextInstallPath && installPathsOverlap(plan.directoryRemoval.target, nextInstallPath)) return null;
	return plan.directoryRemoval.target;
}
function resolveNpmInstallRecordPackageName(record) {
	if (record.source !== "npm" || !record.installPath?.trim()) return null;
	return resolveRetainedManagedNpmInstallPackageInfo(record.installPath)?.packageName ?? null;
}
function findReplacementNpmRecordForRemovedRecord(params) {
	const previousPackageName = resolveNpmInstallRecordPackageName(params.previousRecord);
	if (!previousPackageName) return null;
	for (const nextRecord of Object.values(params.nextInstallRecords)) if (resolveNpmInstallRecordPackageName(nextRecord) === previousPackageName) return nextRecord;
	return null;
}
async function markRetiredManagedNpmInstallRecords(params) {
	const markedPreviousPluginIds = /* @__PURE__ */ new Set();
	const activeInstallPaths = Object.values(params.nextInstallRecords).flatMap((record) => {
		const installPath = record.installPath?.trim();
		return installPath ? [installPath] : [];
	});
	const markRetiredInstall = async (pluginId, previousRecord, nextRecord) => {
		const previousInstallPath = previousRecord?.installPath?.trim();
		if (previousInstallPath && activeInstallPaths.some((installPath) => installPathsOverlap(previousInstallPath, installPath))) return;
		const packageDir = resolveRetainedManagedNpmInstallMarkerTarget({
			pluginId,
			previousRecord,
			nextRecord
		});
		if (!packageDir) return;
		const markerPath = resolveRetainedManagedNpmInstallMarkerPath(packageDir);
		const markerAlreadyExisted = fs.existsSync(markerPath);
		if (await markRetainedManagedNpmInstall({
			packageDir,
			pluginId,
			reason: nextRecord?.source === "npm" ? "replaced-by-managed-npm-generation-update" : nextRecord ? "replaced-by-plugin-source-change" : "removed-managed-npm-install-retained"
		}) && !markerAlreadyExisted) params.createdMarkerPaths.push(markerPath);
		markedPreviousPluginIds.add(pluginId);
	};
	for (const [pluginId, nextRecord] of Object.entries(params.nextInstallRecords)) await markRetiredInstall(pluginId, getPluginInstallRecordMapEntry(params.previousInstallRecords, pluginId), nextRecord);
	for (const [pluginId, previousRecord] of Object.entries(params.previousInstallRecords)) {
		if (markedPreviousPluginIds.has(pluginId) || getPluginInstallRecordMapEntry(params.nextInstallRecords, pluginId)) continue;
		await markRetiredInstall(pluginId, previousRecord, findReplacementNpmRecordForRemovedRecord({
			previousRecord,
			nextInstallRecords: params.nextInstallRecords
		}) ?? void 0);
	}
}
async function removeCreatedRetainedManagedNpmInstallMarkers(markerPaths) {
	for (const markerPath of markerPaths) await fs.promises.rm(markerPath, { force: true });
}
async function clearActiveRetainedManagedNpmInstallMarkers(nextInstallRecords, clearedMarkers) {
	for (const record of Object.values(nextInstallRecords)) {
		if (record.source !== "npm" || !record.installPath?.trim()) continue;
		let markerPath;
		try {
			markerPath = resolveRetainedManagedNpmInstallMarkerPath(record.installPath);
		} catch {
			continue;
		}
		let contents;
		try {
			contents = await fs.promises.readFile(markerPath, "utf8");
		} catch (error) {
			if (error.code === "ENOENT") continue;
			throw error;
		}
		if (await clearRetainedManagedNpmInstallMarker(record.installPath)) clearedMarkers.push({
			markerPath,
			contents
		});
	}
}
async function restoreClearedRetainedManagedNpmInstallMarkers(markerSnapshots) {
	for (const snapshot of markerSnapshots) {
		await fs.promises.mkdir(path.dirname(snapshot.markerPath), { recursive: true });
		await fs.promises.writeFile(snapshot.markerPath, snapshot.contents, "utf8");
	}
}
async function commitPluginInstallRecordsWithWriter(params) {
	return await withPluginLifecycleLease({}, async (lease) => {
		let tentativeWrite;
		const retainedMarkerPaths = [];
		const clearedMarkerSnapshots = [];
		try {
			const storeOptions = { filePath: lease.databasePath };
			const prepared = await params.prepareInstallRecords(storeOptions);
			tentativeWrite = await writePersistedInstalledPluginIndexInstallRecordsWithLease(prepared.nextInstallRecords, {
				...storeOptions,
				config: params.nextConfig,
				lease
			});
			await markRetiredManagedNpmInstallRecords({
				previousInstallRecords: prepared.previousInstallRecords,
				nextInstallRecords: prepared.nextInstallRecords,
				createdMarkerPaths: retainedMarkerPaths
			});
			await clearActiveRetainedManagedNpmInstallMarkers(prepared.nextInstallRecords, clearedMarkerSnapshots);
			const installRecordsChanged = !pluginInstallRecordMapsEqual(prepared.previousInstallRecords, prepared.nextInstallRecords);
			return {
				committed: await params.commit(params.nextConfig, {
					...params.writeOptions,
					...installRecordsChanged && params.writeOptions?.afterWrite === void 0 ? { afterWrite: {
						mode: "restart",
						reason: PLUGIN_SOURCE_CHANGED_RESTART_REASON
					} } : {},
					unsetPaths: mergeUnsetPaths(params.writeOptions?.unsetPaths, [Array.from(PLUGIN_INSTALLS_CONFIG_PATH)])
				}),
				nextInstallRecords: prepared.nextInstallRecords
			};
		} catch (error) {
			const tentative = tentativeWrite;
			if (tentative) try {
				if (await restorePersistedInstalledPluginIndexIfCurrent(tentative.previous, tentative.revision, {
					filePath: lease.databasePath,
					lease
				})) {
					await restoreClearedRetainedManagedNpmInstallMarkers(clearedMarkerSnapshots);
					await removeCreatedRetainedManagedNpmInstallMarkers(retainedMarkerPaths);
				}
			} catch (rollbackError) {
				throw new Error("Failed to commit plugin install records and could not roll back tentative plugin state", { cause: rollbackError });
			}
			throw error;
		}
	});
}
/** Persist plugin install records and commit the matching config update to disk. */
async function commitPluginInstallRecordsWithConfig(params) {
	await commitPluginInstallRecordsWithWriter({
		prepareInstallRecords: async (storeOptions) => ({
			previousInstallRecords: params.previousInstallRecords ?? await loadInstalledPluginIndexInstallRecords(storeOptions),
			nextInstallRecords: params.nextInstallRecords
		}),
		nextConfig: params.nextConfig,
		...params.writeOptions ? { writeOptions: params.writeOptions } : {},
		commit: async (nextConfig, writeOptions) => {
			return await replaceConfigFile({
				nextConfig,
				...params.baseHash !== void 0 ? { baseHash: params.baseHash } : {},
				...writeOptions ? { writeOptions } : {}
			});
		}
	});
}
/** Persist plugin install records without rewriting the user-authored config file. */
async function commitPluginInstallRecordsOnly(params) {
	await commitPluginInstallRecordsWithWriter({
		prepareInstallRecords: async (storeOptions) => ({
			previousInstallRecords: params.previousInstallRecords ?? await loadInstalledPluginIndexInstallRecords(storeOptions),
			nextInstallRecords: params.nextInstallRecords
		}),
		nextConfig: params.nextConfig,
		commit: async () => {
			await params.verifyConfigFresh?.();
		}
	});
}
/** Commit config while migrating any pending install records into the install index. */
async function commitConfigWriteWithPendingPluginInstalls(params) {
	const sourceInstallRecords = params.sourceConfig?.plugins?.installs ?? {};
	const nextPendingConfig = params.sourceConfig ? stripPendingPluginInstallRecords(params.nextConfig, unchangedPendingPluginInstallRecordIds(params.nextConfig, { plugins: { installs: sourceInstallRecords } })) : params.nextConfig;
	if (Object.keys(sourceInstallRecords).length === 0 && !hasPendingPluginInstallRecords(nextPendingConfig)) {
		const committed = params.writeOptions ? await params.commit(params.nextConfig, params.writeOptions) : await params.commit(params.nextConfig);
		return {
			config: params.nextConfig,
			installRecords: {},
			movedInstallRecords: false,
			persistedHash: committed?.persistedHash ?? null
		};
	}
	const pendingInstallRecords = nextPendingConfig.plugins?.installs ?? {};
	const strippedConfig = withoutPluginInstallRecords(params.nextConfig);
	const result = await commitPluginInstallRecordsWithWriter({
		prepareInstallRecords: async (storeOptions) => {
			const previousInstallRecords = await loadInstalledPluginIndexInstallRecords(storeOptions);
			const nextInstallRecords = copyPluginInstallRecordMap(sourceInstallRecords);
			for (const records of [previousInstallRecords, pendingInstallRecords]) for (const [pluginId, record] of Object.entries(records)) setPluginInstallRecordMapEntry(nextInstallRecords, pluginId, record);
			return {
				previousInstallRecords,
				nextInstallRecords
			};
		},
		nextConfig: strippedConfig,
		...params.writeOptions ? { writeOptions: params.writeOptions } : {},
		commit: params.commit
	});
	return {
		config: strippedConfig,
		installRecords: result.nextInstallRecords,
		movedInstallRecords: true,
		persistedHash: result.committed?.persistedHash ?? null
	};
}
/** Replace the config file after moving pending plugin install records into the install index. */
async function commitConfigWithPendingPluginInstalls(params) {
	return await commitConfigWriteWithPendingPluginInstalls({
		nextConfig: params.nextConfig,
		...params.writeOptions ? { writeOptions: params.writeOptions } : {},
		commit: async (nextConfig, writeOptions) => {
			return await replaceConfigFile({
				nextConfig,
				...params.baseHash !== void 0 ? { baseHash: params.baseHash } : {},
				...writeOptions ? { writeOptions } : {}
			});
		}
	});
}
/** Transform config with retry support while preserving plugin install index consistency. */
async function transformConfigWithPendingPluginInstalls(params) {
	const commit = async ({ nextConfig, snapshot, baseHash, writeOptions }) => {
		const requestedAfterWrite = params.afterWrite ?? params.writeOptions?.afterWrite;
		const committed = await commitConfigWriteWithPendingPluginInstalls({
			nextConfig,
			sourceConfig: snapshot.sourceConfig,
			...writeOptions ? { writeOptions: mergeAfterWrite(writeOptions, params.afterWrite) } : {},
			commit: async (config, commitWriteOptions) => {
				return await replaceConfigFile({
					nextConfig: config,
					snapshot,
					writeOptions: commitWriteOptions ?? {},
					...baseHash !== void 0 ? { baseHash } : {}
				});
			}
		});
		const afterWrite = resolveConfigWriteAfterWrite(requestedAfterWrite ?? (committed.movedInstallRecords ? {
			mode: "restart",
			reason: PLUGIN_SOURCE_CHANGED_RESTART_REASON
		} : void 0));
		return {
			config: committed.config,
			persistedHash: committed.persistedHash,
			afterWrite
		};
	};
	return await withPluginLifecycleLease({}, async () => {
		return await transformConfigFileWithRetry({
			...params,
			commit
		});
	});
}
//#endregion
export { hasPendingPluginInstallRecords as a, unchangedPendingPluginInstallRecordIds as c, commitPluginInstallRecordsWithConfig as i, commitConfigWriteWithPendingPluginInstalls as n, stripPendingPluginInstallRecords as o, commitPluginInstallRecordsOnly as r, transformConfigWithPendingPluginInstalls as s, commitConfigWithPendingPluginInstalls as t };
