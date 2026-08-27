import "./src-BkwWvwB2.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { t as safeParseJson } from "./json-coercion-ighRFv8Y.js";
import { i as isNotFoundPathError, u as normalizeWindowsPathForComparison } from "./path-CYL8StfC.js";
import "./path-guards-CQdx2c2I.js";
import { l as tryReadJsonSync } from "./json-C_hP6p1e.js";
import "./json-files-cVJKU9JY.js";
import { n as compareValidSemver } from "./semver-aYpwYdrQ.js";
import { a as isPrereleaseResolutionAllowed, s as parseRegistryNpmSpec } from "./npm-registry-spec-D3pNhy09.js";
import { n as resolveActivePluginInstallRoots, t as hasActivePluginInstallRoots } from "./install-root-context-BK8PKHqw.js";
import { a as resolveDefaultPluginNpmDir, d as resolvePluginNpmProjectsDir, p as validatePluginId } from "./install-paths-Bp_9OgEZ.js";
import { a as inspectPluginInstallRecordMap, i as getPluginInstallRecordMapEntry, l as setPluginInstallRecordMapEntry, n as copyPluginInstallRecordMap, r as createPluginInstallRecordMap } from "./plugin-install-record-map-CWFLMnp7.js";
import { r as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-gKE3myqW.js";
import { n as withOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-BEJbbAaL.js";
import { o as resolveRetainedManagedNpmInstallPackageInfo, r as hasRetainedManagedNpmInstallMarker, s as listManagedPluginNpmProjectRootsSync } from "./managed-npm-retention-BnonUCDl.js";
import fs from "node:fs";
import path from "node:path";
//#region src/plugins/installed-plugin-index-record-cache.ts
const installRecordsCache = /* @__PURE__ */ new Map();
let installRecordsCacheGeneration = 0;
/** Returns cached installed plugin records for a store/recovery key. */
function getInstalledPluginIndexInstallRecordsCache(key) {
	return installRecordsCache.get(key);
}
/** Stores cached installed plugin records for a store/recovery key. */
function setInstalledPluginIndexInstallRecordsCache(key, entry) {
	installRecordsCache.set(key, entry);
}
/** Current cache generation used to detect concurrent clears during async loads. */
function getInstalledPluginIndexInstallRecordsCacheGeneration() {
	return installRecordsCacheGeneration;
}
/** Clears cached installed plugin records and advances the cache generation. */
function clearLoadInstalledPluginIndexInstallRecordsCache() {
	installRecordsCacheGeneration += 1;
	installRecordsCache.clear();
}
//#endregion
//#region src/plugins/installed-plugin-index-store-path.ts
const LEGACY_INSTALLED_PLUGIN_INDEX_STORE_PATH = path.join("plugins", "installs.json");
function resolveStoreEnv(options) {
	const env = options.env ?? process.env;
	if (options.stateDir) return {
		...env,
		OPENCLAW_STATE_DIR: options.stateDir
	};
	if (hasActivePluginInstallRoots()) return {
		...env,
		OPENCLAW_STATE_DIR: resolveActivePluginInstallRoots(env).stateDir
	};
	return env;
}
/** Resolves the canonical SQLite-backed installed plugin index path. */
function resolveInstalledPluginIndexStorePath(options = {}) {
	if (options.filePath) return options.filePath;
	return resolveOpenClawStateSqlitePath(resolveStoreEnv(options));
}
/** Resolves state database options for the installed plugin index store. */
function resolveInstalledPluginIndexStateDatabaseOptions(options = {}) {
	if (options.filePath) return {
		...options.env ? { env: options.env } : {},
		path: options.filePath
	};
	return { env: resolveStoreEnv(options) };
}
/** Resolves the legacy JSON installed plugin index path for migration/doctor use. */
function resolveLegacyInstalledPluginIndexStorePath(options = {}) {
	if (options.filePath) return options.filePath;
	const env = options.env ?? process.env;
	const stateDir = options.stateDir ?? resolveActivePluginInstallRoots(env).stateDir;
	return path.join(stateDir, LEGACY_INSTALLED_PLUGIN_INDEX_STORE_PATH);
}
//#endregion
//#region src/plugins/installed-plugin-index-record-state.ts
function inspectPersistedInstalledPluginIndexInstallRecordsSync(options = {}) {
	const storePath = resolveInstalledPluginIndexStorePath(options);
	if (!fs.existsSync(storePath) || options.filePath?.endsWith(".json")) return { status: "missing" };
	try {
		return withOpenClawStateDatabaseReadOnly(({ db }) => {
			if (!db.prepare(`SELECT 1
             FROM sqlite_master
            WHERE type = 'table' AND name = 'installed_plugin_index'`).get()) return { status: "missing" };
			const row = db.prepare(`
            SELECT install_records_json
              FROM installed_plugin_index
             WHERE index_key = ?
          `).get("installed-plugin-index");
			if (!row) return { status: "missing" };
			const parsed = safeParseJson(row.install_records_json);
			return parsed === void 0 ? { status: "invalid" } : inspectPluginInstallRecordMap(parsed);
		}, resolveInstalledPluginIndexStateDatabaseOptions(options));
	} catch {
		return { status: "invalid" };
	}
}
//#endregion
//#region src/plugins/installed-plugin-index-record-reader.ts
/** Reads installed-index records back into manifest registry records. */
function copyInstallRecords(records) {
	return copyPluginInstallRecordMap(records);
}
const BLOCKED_RECORD_KEYS = /* @__PURE__ */ new Set([
	"__proto__",
	"constructor",
	"prototype"
]);
function isSafeRecordKey(key) {
	return !BLOCKED_RECORD_KEYS.has(key);
}
function readJsonObjectFileSync(filePath) {
	const parsed = tryReadJsonSync(filePath);
	return isRecord(parsed) ? parsed : null;
}
function readStringRecord(value) {
	if (!isRecord(value)) return {};
	const record = {};
	for (const [key, raw] of Object.entries(value).toSorted(([left], [right]) => left.localeCompare(right))) {
		if (!isSafeRecordKey(key)) continue;
		if (typeof raw === "string" && raw.trim()) record[key] = raw.trim();
	}
	return record;
}
function hasPackagePluginMetadata(manifest) {
	const openclaw = manifest.openclaw;
	if (!isRecord(openclaw)) return false;
	const extensions = openclaw.extensions;
	return Array.isArray(extensions) && extensions.some((entry) => typeof entry === "string");
}
function readManifestPluginId(packageDir) {
	const manifest = readJsonObjectFileSync(path.join(packageDir, "openclaw.plugin.json"));
	return (typeof manifest?.id === "string" ? manifest.id.trim() : "") || void 0;
}
function resolveRecoveredManagedNpmRoot(options = {}) {
	return path.resolve(options.stateDir ? path.join(options.stateDir, "npm") : resolveDefaultPluginNpmDir(options.env));
}
function resolveRecoveredManagedNpmPluginId(params) {
	const packageManifest = readJsonObjectFileSync(path.join(params.packageDir, "package.json"));
	if (!packageManifest || !hasPackagePluginMetadata(packageManifest)) return;
	const packageName = typeof packageManifest.name === "string" && packageManifest.name.trim() ? packageManifest.name.trim() : params.packageName;
	const pluginId = readManifestPluginId(params.packageDir) ?? packageName;
	return validatePluginId(pluginId) ? void 0 : pluginId;
}
function readManagedNpmInstallTimestampMs(params) {
	const timestampPaths = params.sharedLegacyRoot ? [params.packageDir] : [path.join(params.projectRoot, "package.json"), params.projectRoot];
	for (const filePath of timestampPaths) try {
		return fs.statSync(filePath).mtimeMs;
	} catch {}
	return 0;
}
function buildRecoveredManagedNpmInstallCandidatesForRoot(params) {
	const dependencies = readStringRecord(readJsonObjectFileSync(path.join(params.projectRoot, "package.json"))?.dependencies);
	const candidates = [];
	for (const [packageName, dependencySpec] of Object.entries(dependencies)) {
		const packageDir = path.join(params.projectRoot, "node_modules", ...packageName.split("/"));
		let stat;
		try {
			stat = fs.statSync(packageDir);
		} catch {
			continue;
		}
		if (!stat.isDirectory()) continue;
		if (hasRetainedManagedNpmInstallMarker(packageDir)) continue;
		const pluginId = resolveRecoveredManagedNpmPluginId({
			packageName,
			packageDir
		});
		if (!pluginId) continue;
		const packageManifest = readJsonObjectFileSync(path.join(packageDir, "package.json"));
		const version = typeof packageManifest?.version === "string" && packageManifest.version.trim() ? packageManifest.version.trim() : void 0;
		candidates.push({
			pluginId,
			installTimestampMs: readManagedNpmInstallTimestampMs({
				packageDir,
				projectRoot: params.projectRoot,
				sharedLegacyRoot: params.sharedLegacyRoot
			}),
			installRecord: {
				source: "npm",
				spec: `${packageName}@${dependencySpec}`,
				installPath: packageDir,
				...version ? {
					version,
					resolvedName: packageName,
					resolvedVersion: version
				} : {},
				...version ? { resolvedSpec: `${packageName}@${version}` } : {}
			}
		});
	}
	return candidates;
}
/** Lists recoverable managed npm installs without assigning active precedence. */
function listRecoveredManagedNpmInstallCandidates(options = {}) {
	const npmRoot = resolveRecoveredManagedNpmRoot(options);
	return [...buildRecoveredManagedNpmInstallCandidatesForRoot({
		projectRoot: npmRoot,
		sharedLegacyRoot: true
	}), ...listManagedPluginNpmProjectRootsSync(npmRoot).flatMap((projectRoot) => buildRecoveredManagedNpmInstallCandidatesForRoot({
		projectRoot,
		sharedLegacyRoot: false
	}))];
}
function recordsShareInstallPath(left, right) {
	if (!left?.installPath || !right.installPath) return false;
	return normalizeInstallPathForComparison(left.installPath) === normalizeInstallPathForComparison(right.installPath);
}
function normalizeInstallPathForComparison(filePath) {
	const resolved = path.resolve(filePath);
	return process.platform === "win32" ? normalizeWindowsPathForComparison(resolved) : resolved;
}
function pickMostRecentRecoveredManagedNpmCandidate(candidates) {
	return candidates.toSorted((left, right) => {
		const byTimestamp = right.installTimestampMs - left.installTimestampMs;
		if (byTimestamp !== 0) return byTimestamp;
		return (right.installRecord.installPath ?? "").localeCompare(left.installRecord.installPath ?? "");
	})[0];
}
function emitManagedNpmRecoveryFallbackWarning(params) {
	process.emitWarning(`Managed npm recovery found ${params.candidates.length} installs for plugin "${params.pluginId}" without an authoritative active path; selected the most recently installed candidate. Run \`openclaw doctor --fix\` to persist and retire stale generations.`, {
		code: "OPENCLAW_PLUGIN_INSTALL_RECOVERY_FALLBACK",
		type: "OpenClawPluginRecoveryWarning",
		detail: JSON.stringify({
			pluginId: params.pluginId,
			selectedInstallPath: params.selected.installRecord.installPath,
			candidates: params.candidates.map((candidate) => ({
				installPath: candidate.installRecord.installPath,
				installTimestampMs: candidate.installTimestampMs
			}))
		})
	});
}
function buildRecoveredManagedNpmInstallRecords(persisted, options = {}) {
	const npmRoot = resolveRecoveredManagedNpmRoot(options);
	const records = createPluginInstallRecordMap();
	const candidatesByPluginId = /* @__PURE__ */ new Map();
	for (const candidate of listRecoveredManagedNpmInstallCandidates(options)) {
		const candidates = candidatesByPluginId.get(candidate.pluginId) ?? [];
		candidates.push(candidate);
		candidatesByPluginId.set(candidate.pluginId, candidates);
	}
	for (const [pluginId, candidates] of candidatesByPluginId) {
		const persistedRecord = getPluginInstallRecordMapEntry(persisted ?? void 0, pluginId);
		const authoritative = candidates.find((candidate) => recordsShareInstallPath(persistedRecord, candidate.installRecord));
		const selected = authoritative ?? pickMostRecentRecoveredManagedNpmCandidate(candidates);
		setPluginInstallRecordMapEntry(records, pluginId, selected.installRecord);
		const recoversUnavailableManagedPath = isUnavailableManagedNpmInstallRecord({
			npmRoot,
			persisted: persistedRecord,
			recovered: selected.installRecord
		});
		if (!authoritative && candidates.length > 1 && (!persistedRecord || recoversUnavailableManagedPath)) emitManagedNpmRecoveryFallbackWarning({
			pluginId,
			selected,
			candidates
		});
	}
	return records;
}
function readInstallRecordVersion(record) {
	return record?.resolvedVersion ?? record?.version;
}
function isUnavailableManagedNpmInstallRecord(params) {
	const installPath = params.persisted?.installPath;
	if (params.persisted?.source !== "npm" || !installPath) return false;
	try {
		if (fs.statSync(installPath).isDirectory()) return false;
	} catch (error) {
		if (!isNotFoundPathError(error)) return false;
	}
	const packageInfo = resolveRetainedManagedNpmInstallPackageInfo(installPath);
	if (!packageInfo || packageInfo.packageName !== params.recovered.resolvedName) return false;
	const npmRoot = normalizeInstallPathForComparison(params.npmRoot);
	return normalizeInstallPathForComparison(packageInfo.projectRoot) === npmRoot || normalizeInstallPathForComparison(path.dirname(packageInfo.projectRoot)) === normalizeInstallPathForComparison(resolvePluginNpmProjectsDir(params.npmRoot));
}
function mergeRecoveredManagedNpmMetadata(persisted, recovered, options = {}) {
	const next = {
		...persisted,
		...recovered
	};
	if (options.preservePersistedSpec) {
		const persistedSpec = persisted.spec ? parseRegistryNpmSpec(persisted.spec) : null;
		const selectorIsCompatible = persistedSpec !== null && isPrereleaseResolutionAllowed({
			spec: persistedSpec,
			resolvedVersion: recovered.resolvedVersion
		}) && (persistedSpec.selectorKind !== "exact-version" || persistedSpec.selector !== void 0 && recovered.resolvedVersion !== void 0 && compareValidSemver(persistedSpec.selector, recovered.resolvedVersion) === 0);
		if (persistedSpec?.name === recovered.resolvedName && selectorIsCompatible) next.spec = persisted.spec;
	}
	delete next.integrity;
	delete next.shasum;
	delete next.resolvedAt;
	delete next.installedAt;
	return next;
}
function mergeRecoveredManagedNpmRecord(params) {
	if (params.persisted && isUnavailableManagedNpmInstallRecord(params)) return mergeRecoveredManagedNpmMetadata(params.persisted, params.recovered, { preservePersistedSpec: true });
	const persistedVersion = readInstallRecordVersion(params.persisted);
	const recoveredVersion = readInstallRecordVersion(params.recovered);
	if (params.persisted?.source === "npm" && recordsShareInstallPath(params.persisted, params.recovered) && recoveredVersion && persistedVersion !== recoveredVersion) return mergeRecoveredManagedNpmMetadata(params.persisted, params.recovered);
	return params.persisted ?? params.recovered;
}
function mergeRecoveredManagedNpmInstallRecords(persisted, options) {
	const npmRoot = resolveRecoveredManagedNpmRoot(options);
	const recovered = buildRecoveredManagedNpmInstallRecords(persisted, options);
	const merged = copyPluginInstallRecordMap(persisted ?? void 0);
	for (const [pluginId, record] of Object.entries(recovered)) setPluginInstallRecordMapEntry(merged, pluginId, mergeRecoveredManagedNpmRecord({
		npmRoot,
		persisted: getPluginInstallRecordMapEntry(merged, pluginId),
		recovered: record
	}));
	return merged;
}
/** Reads install records from the persisted installed plugin index. */
async function readPersistedInstalledPluginIndexInstallRecords(options = {}) {
	const state = inspectPersistedInstalledPluginIndexInstallRecordsSync(options);
	return state.status === "valid" ? state.records : null;
}
function requireLoadablePluginInstallRecordState(options) {
	const state = inspectPersistedInstalledPluginIndexInstallRecordsSync(options);
	if (state.status === "invalid") throw new Error("Persisted plugin install records are invalid. Run openclaw doctor to inspect and repair plugin installation state.");
	return state.status === "valid" ? state.records : null;
}
function resolveInstallRecordsCacheKey(options) {
	return [path.resolve(resolveInstalledPluginIndexStorePath(options)), resolveRecoveredManagedNpmRoot(options)].join("\0");
}
/** Loads installed plugin records, recovering managed npm installs and caching the result. */
async function loadInstalledPluginIndexInstallRecords(params = {}) {
	const cacheKey = resolveInstallRecordsCacheKey(params);
	const cached = getInstalledPluginIndexInstallRecordsCache(cacheKey);
	if (cached) return copyInstallRecords(cached.records);
	const cacheGeneration = getInstalledPluginIndexInstallRecordsCacheGeneration();
	const records = mergeRecoveredManagedNpmInstallRecords(requireLoadablePluginInstallRecordState(params), params);
	if (cacheGeneration !== getInstalledPluginIndexInstallRecordsCacheGeneration()) return await loadInstalledPluginIndexInstallRecords(params);
	setInstalledPluginIndexInstallRecordsCache(cacheKey, { records });
	return copyInstallRecords(records);
}
/** Synchronously loads installed plugin records, recovering managed npm installs and caching them. */
function loadInstalledPluginIndexInstallRecordsSync(params = {}) {
	const cacheKey = resolveInstallRecordsCacheKey(params);
	const cached = getInstalledPluginIndexInstallRecordsCache(cacheKey);
	if (cached) return copyInstallRecords(cached.records);
	const records = mergeRecoveredManagedNpmInstallRecords(requireLoadablePluginInstallRecordState(params), params);
	setInstalledPluginIndexInstallRecordsCache(cacheKey, { records });
	return copyInstallRecords(records);
}
//#endregion
export { inspectPersistedInstalledPluginIndexInstallRecordsSync as a, resolveLegacyInstalledPluginIndexStorePath as c, readPersistedInstalledPluginIndexInstallRecords as i, clearLoadInstalledPluginIndexInstallRecordsCache as l, loadInstalledPluginIndexInstallRecords as n, resolveInstalledPluginIndexStateDatabaseOptions as o, loadInstalledPluginIndexInstallRecordsSync as r, resolveInstalledPluginIndexStorePath as s, listRecoveredManagedNpmInstallCandidates as t };
