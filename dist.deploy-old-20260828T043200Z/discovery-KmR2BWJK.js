import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { _ as sortUniqueStrings } from "./string-normalization-e_fvmxMf.js";
import { a as isPathInside, m as safeStatSync, p as safeRealpathSync } from "./path-D138yf8v.js";
import { c as resolveUserPath } from "./home-dir-BFvskzn8.js";
import "./utils-Bw16L5tB.js";
import { a as readRootJsonObjectSync, l as tryReadJsonSync } from "./json-Dx6zyhjY.js";
import "./json-files-E5e5TtK3.js";
import { n as registerPluginMetadataProcessMemoLifecycleClear } from "./plugin-metadata-lifecycle-DQWVBcP_.js";
import { r as createPluginCacheKey, t as PluginLruCache } from "./plugin-cache-primitives-Bm-Ppe_P.js";
import { i as resolveSourceCheckoutDependencyDiagnostic, n as hasUsableBundledPluginTree } from "./bundled-dir-DItVECdo.js";
import "./path-safety-Dv61TTin.js";
import { a as getPackageManifestMetadata, i as DEFAULT_PLUGIN_ENTRY_CANDIDATES, o as resolvePackageExtensionEntries, r as loadPluginManifest } from "./manifest-DFeZvDdx.js";
import { s as resolveCompatibilityHostVersion } from "./version-CkBmshxX.js";
import { a as detectBundleManifestFormat, l as withPluginScanExistenceCache, o as loadBundleManifest } from "./bundle-manifest-BaJfS3mk.js";
import { t as decodeMountInfoPath } from "./mountinfo-path-BCOIljp0.js";
import { t as shouldRejectHardlinkedPluginFiles } from "./hardlink-policy-jAYIsS4O.js";
import { s as parseRegistryNpmSpec } from "./npm-registry-spec-BdgyvSs0.js";
import { h as validatePluginId } from "./install-paths-DllFtsSG.js";
import { n as satisfiesPluginApiRange, t as resolvePackagePluginApiRange } from "./package-compat-BQXdZhrB.js";
import { n as resolvePackageSetupSource, t as resolvePackageRuntimeExtensionSources } from "./package-entry-resolution-ZXIkJGCl.js";
import { n as resolvePluginSourceRoots } from "./roots-Cb7EhqtT.js";
import fs from "node:fs";
import path from "node:path";
//#region node_modules/@openclaw/fs-safe/dist/mode.js
function formatPosixMode(mode) {
	return (mode & 511).toString(8).padStart(3, "0");
}
//#endregion
//#region src/plugins/bundled-load-path-aliases.ts
const PACKAGED_BUNDLED_ROOTS = [path.join("dist", "extensions"), path.join("dist-runtime", "extensions")];
/** Normalizes bundled lookup paths without preserving trailing separators. */
function normalizeBundledLookupPath(targetPath) {
	const normalized = path.normalize(targetPath);
	const root = path.parse(normalized).root;
	let trimmed = normalized;
	while (trimmed.length > root.length && (trimmed.endsWith(path.sep) || trimmed.endsWith("/"))) trimmed = trimmed.slice(0, -1);
	return trimmed;
}
function findPackagedBundledRoot(localPath) {
	const normalized = normalizeBundledLookupPath(localPath);
	for (const packagedRoot of PACKAGED_BUNDLED_ROOTS) {
		const marker = `${path.sep}${packagedRoot}`;
		const markerIndex = normalized.lastIndexOf(marker);
		if (markerIndex === -1) continue;
		const markerEnd = markerIndex + marker.length;
		if (normalized.length !== markerEnd && normalized[markerEnd] !== path.sep) continue;
		return {
			packageRoot: normalized.slice(0, markerIndex),
			bundledRoot: normalized.slice(0, markerEnd)
		};
	}
	return null;
}
/** Parses a path under a packaged bundled plugin root. */
function parsePackagedBundledPluginPath(localPath) {
	const packaged = findPackagedBundledRoot(localPath);
	if (!packaged) return null;
	const normalized = normalizeBundledLookupPath(localPath);
	if (normalized === packaged.bundledRoot) return null;
	return {
		...packaged,
		bundledLeaf: normalized.slice(packaged.bundledRoot.length + path.sep.length)
	};
}
/** Builds the legacy extensions-root alias for a packaged bundled plugin path. */
function buildLegacyBundledPath(localPath) {
	const packaged = parsePackagedBundledPluginPath(localPath);
	if (!packaged) return null;
	return path.join(packaged.packageRoot, "extensions", packaged.bundledLeaf);
}
/** Builds the legacy extensions root for a packaged bundled plugin root. */
function buildLegacyBundledRootPath(localPath) {
	const packaged = findPackagedBundledRoot(localPath);
	return packaged ? path.join(packaged.packageRoot, "extensions") : null;
}
/** Parses a path under the legacy bundled extensions root. */
function parseLegacyBundledPluginPath(localPath) {
	const normalized = normalizeBundledLookupPath(localPath);
	const marker = `${path.sep}extensions`;
	const markerIndex = normalized.lastIndexOf(marker);
	if (markerIndex === -1) return null;
	const markerEnd = markerIndex + marker.length;
	if (normalized.length === markerEnd || normalized[markerEnd] !== path.sep) return null;
	return {
		packageRoot: normalized.slice(0, markerIndex),
		legacyRoot: normalized.slice(0, markerEnd),
		bundledLeaf: normalized.slice(markerEnd + path.sep.length)
	};
}
/** Builds current and legacy aliases for a packaged bundled plugin path. */
function buildBundledPluginLoadPathAliases(localPath) {
	const legacyPath = buildLegacyBundledPath(localPath);
	if (!legacyPath) return [];
	return [{
		kind: "current",
		path: localPath
	}, {
		kind: "legacy",
		path: legacyPath
	}];
}
//#endregion
//#region src/plugins/bundled-source-overlays.ts
/** Parses Linux mountinfo content into absolute mount points. */
function parseLinuxMountInfoMountPoints(mountInfo) {
	const mountPoints = /* @__PURE__ */ new Set();
	for (const line of mountInfo.split(/\r?\n/u)) {
		const trimmed = line.trim();
		if (!trimmed) continue;
		const mountPoint = trimmed.split(" ")[4];
		if (!mountPoint) continue;
		mountPoints.add(path.resolve(decodeMountInfoPath(mountPoint)));
	}
	return mountPoints;
}
function readLinuxMountPoints() {
	try {
		return parseLinuxMountInfoMountPoints(fs.readFileSync("/proc/self/mountinfo", "utf8"));
	} catch {
		return /* @__PURE__ */ new Set();
	}
}
function isFilesystemMountPoint(targetPath) {
	try {
		const target = fs.statSync(targetPath);
		const parent = fs.statSync(path.dirname(targetPath));
		return target.dev !== parent.dev || target.ino === parent.ino;
	} catch {
		return false;
	}
}
function sourceOverlaysDisabled(env) {
	const raw = normalizeOptionalLowercaseString(env.OPENCLAW_DISABLE_BUNDLED_SOURCE_OVERLAYS);
	return raw === "1" || raw === "true";
}
/** True when a path appears to be a mounted bundled source overlay. */
function isBundledSourceOverlayPath(params) {
	const resolved = path.resolve(params.sourcePath);
	return (params.mountPoints ?? readLinuxMountPoints()).has(resolved) || isFilesystemMountPoint(resolved);
}
/** Lists source overlay directories that shadow packaged bundled plugin dirs. */
function listBundledSourceOverlayDirs(params) {
	if (sourceOverlaysDisabled(params.env ?? process.env) || !params.bundledRoot) return [];
	const legacyRoot = buildLegacyBundledRootPath(params.bundledRoot);
	if (!legacyRoot || !fs.existsSync(legacyRoot)) return [];
	let entries;
	try {
		entries = fs.readdirSync(legacyRoot, { withFileTypes: true });
	} catch {
		return [];
	}
	const mountPoints = params.mountPoints ?? readLinuxMountPoints();
	const legacyRootMounted = isBundledSourceOverlayPath({
		sourcePath: legacyRoot,
		mountPoints
	});
	const overlayDirs = [];
	for (const entry of entries) {
		if (!entry.isDirectory()) continue;
		const sourceDir = path.join(legacyRoot, entry.name);
		const bundledPeer = path.join(params.bundledRoot, entry.name);
		if (!fs.existsSync(bundledPeer)) continue;
		if (!legacyRootMounted && !isBundledSourceOverlayPath({
			sourcePath: sourceDir,
			mountPoints
		})) continue;
		overlayDirs.push(sourceDir);
	}
	return overlayDirs.toSorted((left, right) => left.localeCompare(right));
}
//#endregion
//#region src/plugins/candidate-install-owner.ts
const PLUGIN_CANDIDATE_INSTALL_OWNER = Symbol.for("openclaw.pluginCandidateInstallOwner");
const PLUGIN_INSTALL_OWNER_LOOKUP = Symbol.for("openclaw.pluginInstallOwnerLookup");
function recordPluginCandidateInstallOwner(candidate, installOwner, ambiguous = false) {
	if (!installOwner && !ambiguous) return candidate;
	Object.defineProperty(candidate, PLUGIN_CANDIDATE_INSTALL_OWNER, {
		configurable: true,
		enumerable: true,
		value: ambiguous ? { ambiguous: true } : { installOwner }
	});
	return candidate;
}
function readPluginCandidateInstallOwner(candidate) {
	return candidate[PLUGIN_CANDIDATE_INSTALL_OWNER];
}
function resolvePluginCandidateInstallOwner(candidate) {
	return readPluginCandidateInstallOwner(candidate)?.installOwner;
}
function isPluginCandidateInstallOwnerAmbiguous(candidate) {
	return readPluginCandidateInstallOwner(candidate)?.ambiguous === true;
}
function recordPluginInstallOwnerLookup(params, installOwnerByPluginId) {
	Object.defineProperty(params, PLUGIN_INSTALL_OWNER_LOOKUP, {
		configurable: false,
		enumerable: true,
		value: installOwnerByPluginId
	});
	return params;
}
function resolvePluginInstallOwnerLookup(params) {
	return params[PLUGIN_INSTALL_OWNER_LOOKUP];
}
//#endregion
//#region src/plugins/legacy-npm-declaration.ts
/** Reads legacy npm plugin declaration files left by early plugin installs. */
/** Legacy declaration filename used by early npm-backed plugin installs. */
const LEGACY_NPM_DECLARATION_FILE = "openclaw.extension.json";
/** Reads a legacy npm plugin declaration when a plugin directory still has one. */
function readLegacyNpmPluginDeclaration(pluginDir) {
	const source = path.join(pluginDir, LEGACY_NPM_DECLARATION_FILE);
	const parsed = tryReadJsonSync(source);
	if (!isRecord(parsed) || parsed.type !== "npm") return null;
	const pluginId = typeof parsed.name === "string" ? parsed.name.trim() : "";
	const npmSpec = typeof parsed.npmSpec === "string" ? parsed.npmSpec.trim() : "";
	if (!pluginId || validatePluginId(pluginId) || !parseRegistryNpmSpec(npmSpec)) return null;
	return {
		pluginId,
		npmSpec,
		source
	};
}
//#endregion
//#region src/plugins/plugin-lifecycle-trace.ts
/** Checks the opt-in plugin lifecycle tracing environment flag. */
function isPluginLifecycleTraceEnabled() {
	const raw = process.env.OPENCLAW_PLUGIN_LIFECYCLE_TRACE?.trim().toLowerCase();
	return raw === "1" || raw === "true" || raw === "yes";
}
function formatTraceValue(value) {
	if (typeof value === "number" || typeof value === "boolean") return String(value);
	return JSON.stringify(value);
}
function emitPluginLifecycleTrace(params) {
	const elapsedMs = Number(process.hrtime.bigint() - params.start) / 1e6;
	const detailText = Object.entries(params.details ?? {}).filter((entry) => entry[1] !== void 0).map(([key, value]) => `${key}=${formatTraceValue(value)}`).join(" ");
	const suffix = detailText ? ` ${detailText}` : "";
	console.error(`[plugins:lifecycle] phase=${JSON.stringify(params.phase)} ms=${elapsedMs.toFixed(2)} status=${params.status}${suffix}`);
}
/** Traces a synchronous plugin lifecycle phase when tracing is enabled. */
function tracePluginLifecyclePhase(phase, fn, details) {
	if (!isPluginLifecycleTraceEnabled()) return fn();
	const start = process.hrtime.bigint();
	let status;
	try {
		const result = fn();
		status = "ok";
		return result;
	} catch (error) {
		status = "error";
		throw error;
	} finally {
		emitPluginLifecycleTrace({
			phase,
			start,
			status: status ?? "error",
			details
		});
	}
}
/** Traces an async plugin lifecycle phase when tracing is enabled. */
async function tracePluginLifecyclePhaseAsync(phase, fn, details) {
	if (!isPluginLifecycleTraceEnabled()) return fn();
	const start = process.hrtime.bigint();
	let status;
	try {
		const result = await fn();
		status = "ok";
		return result;
	} catch (error) {
		status = "error";
		throw error;
	} finally {
		emitPluginLifecycleTrace({
			phase,
			start,
			status: status ?? "error",
			details
		});
	}
}
//#endregion
//#region src/plugins/status-dependencies-core.ts
function normalizeDependencyMap(raw) {
	if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
	const normalized = {};
	for (const [name, spec] of Object.entries(raw)) {
		const normalizedName = name.trim();
		if (!normalizedName || typeof spec !== "string" || !spec.trim()) continue;
		normalized[normalizedName] = spec.trim();
	}
	return normalized;
}
/** Normalizes raw package dependency maps into sorted plugin dependency specs. */
function normalizePluginDependencySpecs(params) {
	const dependencies = normalizeDependencyMap(params.dependencies);
	const optionalDependencies = normalizeDependencyMap(params.optionalDependencies);
	for (const name of Object.keys(optionalDependencies)) delete dependencies[name];
	return {
		dependencies,
		optionalDependencies
	};
}
function dependencyPathSegments(name) {
	const segments = name.split("/");
	if (segments.length === 1 && segments[0]) return [segments[0]];
	if (segments.length === 2 && segments[0]?.startsWith("@") && segments[1]) return segments;
	return null;
}
function findDependencyPackageDir(params) {
	const segments = dependencyPathSegments(params.name);
	if (!segments) return;
	let current = path.resolve(params.fromDir);
	while (true) {
		const candidate = path.join(current, "node_modules", ...segments);
		if (fs.existsSync(candidate)) return candidate;
		const parent = path.dirname(current);
		if (parent === current) return;
		current = parent;
	}
}
function buildDependencyEntries(params) {
	return Object.entries(params.dependencies).toSorted(([left], [right]) => left.localeCompare(right)).map(([name, spec]) => {
		const resolvedPath = params.rootDir ? findDependencyPackageDir({
			fromDir: params.rootDir,
			name
		}) : void 0;
		const entry = {
			name,
			spec,
			installed: resolvedPath !== void 0,
			optional: params.optional
		};
		if (resolvedPath) entry.resolvedPath = resolvedPath;
		return entry;
	});
}
/** Builds dependency installation status for a plugin package root. */
function buildPluginDependencyStatus(params) {
	const dependencies = buildDependencyEntries({
		rootDir: params.rootDir,
		dependencies: params.dependencies ?? {},
		optional: false
	});
	const optionalDependencies = buildDependencyEntries({
		rootDir: params.rootDir,
		dependencies: params.optionalDependencies ?? {},
		optional: true
	});
	const missing = dependencies.filter((entry) => !entry.installed).map((entry) => entry.name);
	const missingOptional = optionalDependencies.filter((entry) => !entry.installed).map((entry) => entry.name);
	const requiredInstalled = missing.length === 0;
	const optionalInstalled = missingOptional.length === 0;
	return {
		hasDependencies: dependencies.length > 0 || optionalDependencies.length > 0,
		installed: requiredInstalled,
		requiredInstalled,
		optionalInstalled,
		missing,
		missingOptional,
		dependencies,
		optionalDependencies
	};
}
/** Projects missing required dependencies consistently across cold plugin status surfaces. */
function projectPluginDependencyHealth(registry) {
	const diagnostics = [...registry.diagnostics];
	const plugins = registry.plugins.map((plugin) => {
		const status = plugin.dependencyStatus;
		if (!plugin.enabled || status?.requiredInstalled !== false) return plugin;
		const message = `Plugin "${plugin.id}" cannot load because required dependencies are missing: ${status.missing.join(", ")}. Install the plugin dependencies or reinstall/update the plugin, then restart the Gateway.`;
		const existingDiagnosticIndex = diagnostics.findIndex((entry) => entry.level === "error" && entry.pluginId === plugin.id);
		if (existingDiagnosticIndex === -1) diagnostics.push({
			level: "error",
			pluginId: plugin.id,
			source: plugin.source,
			message
		});
		else {
			const existingDiagnostic = diagnostics[existingDiagnosticIndex];
			if (existingDiagnostic && !existingDiagnostic.message.includes(message)) diagnostics[existingDiagnosticIndex] = {
				...existingDiagnostic,
				message: `${existingDiagnostic.message}\n${message}`
			};
		}
		if (plugin.status === "error") {
			const existingError = plugin.error;
			return {
				...plugin,
				error: existingError && !existingError.includes(message) ? `${existingError}\n${message}` : existingError ?? message
			};
		}
		return {
			...plugin,
			status: "error",
			error: message
		};
	});
	return {
		...registry,
		plugins,
		diagnostics
	};
}
//#endregion
//#region src/plugins/discovery.ts
/** Discovers plugin candidates from bundled, workspace, global, package, and bundle roots. */
const EXTENSION_EXTS = /* @__PURE__ */ new Set([
	".ts",
	".js",
	".mts",
	".cts",
	".mjs",
	".cjs"
]);
const SCANNED_DIRECTORY_IGNORE_NAMES = /* @__PURE__ */ new Set([
	".git",
	".hg",
	".svn",
	".turbo",
	".yarn",
	".yarn-cache",
	"build",
	"coverage",
	"dist",
	"node_modules"
]);
const PACKAGE_MANIFEST_CACHE_MAX_ENTRIES = 512;
const IMMUTABLE_NIX_STORE_ROOT = "/nix/store";
const packageManifestProcessCache = new PluginLruCache(PACKAGE_MANIFEST_CACHE_MAX_ENTRIES);
registerPluginMetadataProcessMemoLifecycleClear(() => {
	packageManifestProcessCache.clear();
});
function currentUid(overrideUid) {
	if (overrideUid !== void 0) return overrideUid;
	if (process.platform === "win32") return null;
	if (typeof process.getuid !== "function") return null;
	return process.getuid();
}
function checkSourceEscapesRoot(params) {
	const sourceRealPath = safeRealpathSync(params.source, params.realpathCache);
	const rootRealPath = safeRealpathSync(params.rootDir, params.realpathCache);
	if (!sourceRealPath || !rootRealPath) return null;
	if (isPathInside(rootRealPath, sourceRealPath)) return null;
	return {
		reason: "source_escapes_root",
		sourcePath: params.source,
		rootPath: params.rootDir,
		targetPath: params.source,
		sourceRealPath,
		rootRealPath
	};
}
function checkPathStatAndPermissions(params) {
	if (process.platform === "win32") return null;
	const pathsToCheck = [params.rootDir, params.source];
	const seen = /* @__PURE__ */ new Set();
	for (const targetPath of pathsToCheck) {
		const normalized = path.resolve(targetPath);
		if (seen.has(normalized)) continue;
		seen.add(normalized);
		let stat = safeStatSync(targetPath);
		if (!stat) return {
			reason: "path_stat_failed",
			sourcePath: params.source,
			rootPath: params.rootDir,
			targetPath
		};
		let modeBits = stat.mode & 511;
		if ((modeBits & 2) !== 0 && params.origin === "bundled") try {
			fs.chmodSync(targetPath, modeBits & -19);
			const repairedStat = safeStatSync(targetPath);
			if (!repairedStat) return {
				reason: "path_stat_failed",
				sourcePath: params.source,
				rootPath: params.rootDir,
				targetPath
			};
			stat = repairedStat;
			modeBits = repairedStat.mode & 511;
		} catch {}
		if ((modeBits & 2) !== 0) return {
			reason: "path_world_writable",
			sourcePath: params.source,
			rootPath: params.rootDir,
			targetPath,
			modeBits
		};
		if (params.origin !== "bundled" && params.uid !== null && typeof stat.uid === "number" && stat.uid !== params.uid && stat.uid !== 0) return {
			reason: "path_suspicious_ownership",
			sourcePath: params.source,
			rootPath: params.rootDir,
			targetPath,
			foundUid: stat.uid,
			expectedUid: params.uid
		};
	}
	return null;
}
function findCandidateBlockIssue(params) {
	const escaped = checkSourceEscapesRoot({
		source: params.source,
		rootDir: params.rootDir,
		realpathCache: params.realpathCache
	});
	if (escaped) return escaped;
	return checkPathStatAndPermissions({
		source: params.source,
		rootDir: params.rootDir,
		origin: params.origin,
		uid: currentUid(params.ownershipUid)
	});
}
function formatCandidateBlockMessage(issue) {
	if (issue.reason === "source_escapes_root") return `blocked plugin candidate: source escapes plugin root (${issue.sourcePath} -> ${issue.sourceRealPath}; root=${issue.rootRealPath})`;
	if (issue.reason === "path_stat_failed") return `blocked plugin candidate: cannot stat path (${issue.targetPath})`;
	if (issue.reason === "path_world_writable") return `blocked plugin candidate: world-writable path (${issue.targetPath}, mode=${formatPosixMode(issue.modeBits ?? 0)})`;
	return `blocked plugin candidate: suspicious ownership (${issue.targetPath}, uid=${issue.foundUid}, expected uid=${issue.expectedUid} or root)`;
}
function isUnsafePluginCandidate(params) {
	const issue = findCandidateBlockIssue({
		source: params.source,
		rootDir: params.rootDir,
		origin: params.origin,
		ownershipUid: params.ownershipUid,
		realpathCache: params.realpathCache
	});
	if (!issue) return false;
	params.diagnostics.push({
		level: "warn",
		...params.pluginId ? { pluginId: params.pluginId } : {},
		source: issue.targetPath,
		message: formatCandidateBlockMessage(issue)
	});
	return true;
}
function isExtensionFile(filePath) {
	const ext = path.extname(filePath);
	if (!EXTENSION_EXTS.has(ext)) return false;
	if (/\.d\.[cm]?ts$/.test(filePath)) return false;
	const baseName = normalizeLowercaseStringOrEmpty(path.basename(filePath));
	return !baseName.includes(".test.") && !baseName.includes(".live.test.") && !baseName.includes(".e2e.test.");
}
function shouldIgnoreScannedDirectory(dirName) {
	const normalized = normalizeLowercaseStringOrEmpty(dirName);
	if (!normalized) return true;
	if (SCANNED_DIRECTORY_IGNORE_NAMES.has(normalized)) return true;
	if (normalized.endsWith(".bak")) return true;
	if (normalized.includes(".backup-")) return true;
	if (normalized.includes(".disabled")) return true;
	return false;
}
function resolveScannedEntryType(entry, fullPath) {
	if (entry.isFile()) return "file";
	if (entry.isDirectory()) return "directory";
	if (!entry.isSymbolicLink()) return null;
	const stat = safeStatSync(fullPath);
	if (!stat) return null;
	if (stat.isFile()) return "file";
	if (stat.isDirectory()) return "directory";
	return null;
}
function resolvesToSameDirectory(left, right, realpathCache) {
	if (!left || !right) return false;
	const leftRealPath = safeRealpathSync(left, realpathCache);
	const rightRealPath = safeRealpathSync(right, realpathCache);
	if (leftRealPath && rightRealPath) return leftRealPath === rightRealPath;
	return path.resolve(left) === path.resolve(right);
}
function mergeCandidateInstallOwner(existing, candidateOwner, candidateOwnerAmbiguous) {
	const existingOwner = resolvePluginCandidateInstallOwner(existing);
	const ownerConflict = existingOwner && candidateOwner && existingOwner !== candidateOwner;
	if (isPluginCandidateInstallOwnerAmbiguous(existing) || candidateOwnerAmbiguous || ownerConflict) recordPluginCandidateInstallOwner(existing, void 0, true);
	else if (candidateOwner) recordPluginCandidateInstallOwner(existing, candidateOwner);
}
function addMissingRequiredPluginDiagnostics(result, params) {
	const candidateIds = new Set(result.candidates.map((candidate) => candidate.idHint));
	const seen = /* @__PURE__ */ new Set();
	let configuredFileManifestIds;
	for (const candidate of result.candidates) for (const requiredPluginId of candidate.requiredPluginIds ?? []) {
		if (candidateIds.has(requiredPluginId) || requiredPluginId === candidate.idHint) continue;
		if (!configuredFileManifestIds) {
			configuredFileManifestIds = /* @__PURE__ */ new Set();
			for (const configuredCandidate of result.candidates) {
				if (configuredCandidate.origin !== "config" || configuredCandidate.packageDir) continue;
				const rejectHardlinks = shouldRejectHardlinkedPluginFiles({
					origin: configuredCandidate.origin,
					rootDir: configuredCandidate.rootDir,
					env: params.env,
					realpathCache: params.realpathCache
				});
				const manifest = resolveCandidateManifest(configuredCandidate.rootDir, rejectHardlinks);
				if (manifest) configuredFileManifestIds.add(manifest.manifest.id);
			}
		}
		if (configuredFileManifestIds.has(requiredPluginId)) continue;
		const key = `${candidate.idHint}\0${requiredPluginId}`;
		if (seen.has(key)) continue;
		seen.add(key);
		result.diagnostics.push({
			level: "warn",
			pluginId: candidate.idHint,
			source: candidate.requiredPluginSource ?? candidate.source,
			message: `plugin "${candidate.idHint}" requires plugin "${requiredPluginId}"; install "${requiredPluginId}" to use it`
		});
	}
}
function prepareInstalledPluginPaths(installRecords, env, realpathCache, diagnostics) {
	const byPath = /* @__PURE__ */ new Map();
	const installedPluginDirKeys = /* @__PURE__ */ new Set();
	const managedPluginDirs = /* @__PURE__ */ new Set();
	const resolveRecordPath = (rawPath) => typeof rawPath === "string" && rawPath.trim() ? resolveUserPath(rawPath, env) : void 0;
	for (const [installOwner, record] of Object.entries(installRecords ?? {})) {
		const installPath = resolveRecordPath(record.installPath);
		const sourcePath = resolveRecordPath(record.sourcePath);
		for (const recordedPath of [installPath, sourcePath]) if (recordedPath && fs.existsSync(recordedPath)) {
			const key = resolveManagedPluginDirKey(recordedPath, realpathCache);
			if (key) managedPluginDirs.add(key);
		}
		const resolved = installPath ?? sourcePath;
		if (!resolved || !fs.existsSync(resolved)) continue;
		const pathKey = safeRealpathSync(resolved, realpathCache) ?? path.resolve(resolved);
		const requireBuiltRuntimeEntry = !(record.source === "path" && installPath && sourcePath && resolvesToSameDirectory(installPath, sourcePath, realpathCache));
		const existing = byPath.get(pathKey);
		if (existing) {
			existing.requireBuiltRuntimeEntry ||= requireBuiltRuntimeEntry;
			if (existing.installOwner !== installOwner) {
				delete existing.installOwner;
				existing.installOwnerAmbiguous = true;
				diagnostics.push({
					level: "error",
					source: resolved,
					message: "multiple plugin install records claim the same package path; refresh or reinstall the package before using managed lifecycle actions"
				});
			}
		} else {
			byPath.set(pathKey, {
				path: resolved,
				requireBuiltRuntimeEntry,
				installOwner
			});
			const dirKey = resolveManagedPluginDirKey(resolved, realpathCache);
			if (dirKey) installedPluginDirKeys.add(dirKey);
		}
	}
	return {
		installedPaths: [...byPath.values()],
		installedPluginDirKeys,
		managedPluginDirs
	};
}
function resolveManagedPluginDirKey(installedPath, realpathCache) {
	const stat = safeStatSync(installedPath);
	if (!stat) return null;
	const pluginDir = stat.isFile() ? path.dirname(installedPath) : installedPath;
	return safeRealpathSync(pluginDir, realpathCache) ?? path.resolve(pluginDir);
}
function isManagedPluginDir(params) {
	if (!params.managedPluginDirs || params.managedPluginDirs.size === 0) return false;
	const key = params.realpath ?? safeRealpathSync(params.dir, params.realpathCache) ?? path.resolve(params.dir);
	return params.managedPluginDirs.has(key);
}
function readPackageManifest(dir, rejectHardlinks = true, rootRealPath) {
	const result = readRootJsonObjectSync({
		rootDir: dir,
		...rootRealPath !== void 0 ? { rootRealPath } : {},
		relativePath: "package.json",
		boundaryLabel: "plugin package directory",
		rejectHardlinks
	});
	return result.ok ? result.value : null;
}
function readTrustedPackageManifest(dir) {
	return tryReadJsonSync(path.join(dir, "package.json"));
}
function readCandidatePackageManifest(params) {
	const rootRealPath = params.rootRealPath ?? safeRealpathSync(params.dir);
	const cacheKey = createPluginCacheKey([params.origin === "bundled" ? "trusted" : params.rejectHardlinks ? "external-reject" : "external-allow", rootRealPath ?? path.resolve(params.dir)]);
	const cached = params.packageManifestCache?.get(cacheKey);
	if (cached !== void 0) return cached;
	const canUseProcessCache = params.origin === "bundled" || !params.rejectHardlinks && typeof rootRealPath === "string" && (rootRealPath === IMMUTABLE_NIX_STORE_ROOT || rootRealPath.startsWith(`${IMMUTABLE_NIX_STORE_ROOT}/`));
	if (canUseProcessCache) {
		const processCached = packageManifestProcessCache.getResult(cacheKey);
		if (processCached.hit) {
			params.packageManifestCache?.set(cacheKey, processCached.value);
			return processCached.value;
		}
	}
	const manifest = params.origin === "bundled" ? readTrustedPackageManifest(params.dir) : readPackageManifest(params.dir, params.rejectHardlinks, params.rootRealPath);
	params.packageManifestCache?.set(cacheKey, manifest);
	if (canUseProcessCache) packageManifestProcessCache.set(cacheKey, manifest);
	return manifest;
}
function deriveIdHint(params) {
	const base = path.basename(params.filePath, path.extname(params.filePath));
	const pluginId = normalizeOptionalString(params.manifestId) ?? derivePackagePluginIdHint(params.packageName) ?? params.fallbackId;
	return params.hasMultipleExtensions ? `${pluginId}/${base}` : pluginId;
}
function derivePackagePluginIdHint(packageName) {
	const rawPackageName = normalizeOptionalString(packageName);
	if (!rawPackageName) return;
	const unscoped = rawPackageName.includes("/") ? rawPackageName.split("/").pop() ?? rawPackageName : rawPackageName;
	for (const suffix of ["-provider", "-plugin"]) if (unscoped.endsWith(suffix) && unscoped.length > suffix.length) return unscoped.slice(0, -suffix.length);
	return normalizeOptionalString(unscoped);
}
function pushInvalidPackageExtensionDiagnostic(params) {
	if (params.resolution.status === "invalid") {
		params.diagnostics.push({
			level: "error",
			source: params.source,
			message: params.resolution.error,
			...params.pluginId ? { pluginId: params.pluginId } : {}
		});
		return true;
	}
	if (params.resolution.status === "empty") {
		params.diagnostics.push({
			level: "error",
			source: params.source,
			message: "package.json openclaw.extensions is empty",
			...params.pluginId ? { pluginId: params.pluginId } : {}
		});
		return true;
	}
	return false;
}
function resolveCandidateManifest(rootDir, rejectHardlinks, rootRealPath) {
	const manifest = loadPluginManifest(rootDir, rejectHardlinks, rootRealPath);
	return manifest.ok ? {
		manifest: manifest.manifest,
		manifestPath: manifest.manifestPath
	} : void 0;
}
function addLegacyNpmDeclarationDiagnostic(params) {
	const declaration = readLegacyNpmPluginDeclaration(params.pluginDir);
	if (!declaration) return false;
	params.diagnostics.push({
		level: "warn",
		pluginId: declaration.pluginId,
		source: declaration.source,
		message: `legacy npm plugin declaration ignored for "${declaration.pluginId}"; run "openclaw doctor --fix" to install ${declaration.npmSpec} into the managed plugin root`
	});
	return true;
}
function shouldSkipIncompatiblePackagePluginApi(params) {
	if (params.origin === "bundled") return false;
	const packagePluginApiRangeCheck = resolvePackagePluginApiRange(params.packageManifest);
	if (!packagePluginApiRangeCheck.ok) {
		params.diagnostics.push({
			level: "warn",
			source: path.join(params.packageDir, "package.json"),
			message: `invalid package plugin API metadata: ${packagePluginApiRangeCheck.error}; skipping discovery (check package.json openclaw.compat.pluginApi)`,
			pluginId: params.pluginId
		});
		return true;
	}
	const packagePluginApiRange = packagePluginApiRangeCheck.range;
	if (!packagePluginApiRange) return false;
	const compatibilityHostVersion = resolveCompatibilityHostVersion(params.env);
	if (satisfiesPluginApiRange(compatibilityHostVersion, packagePluginApiRange)) return false;
	params.diagnostics.push({
		level: "warn",
		source: path.join(params.packageDir, "package.json"),
		message: `plugin requires plugin API ${packagePluginApiRange}, but this host is ${compatibilityHostVersion}; skipping discovery (check "openclaw --version", OPENCLAW_COMPATIBILITY_HOST_VERSION, or run "openclaw doctor")`,
		pluginId: params.pluginId
	});
	return true;
}
function isSourceCheckoutExtensionsDir(extensionsDir) {
	const packageRoot = path.dirname(extensionsDir);
	return fs.existsSync(path.join(packageRoot, ".git")) && fs.existsSync(path.join(packageRoot, "pnpm-workspace.yaml")) && fs.existsSync(path.join(packageRoot, "src")) && hasUsableBundledPluginTree(extensionsDir);
}
function resolveBundledSourceCheckoutExtensionsDir(bundledRoot) {
	if (!bundledRoot) return;
	const legacyRoot = buildLegacyBundledRootPath(bundledRoot);
	if (!legacyRoot || !isSourceCheckoutExtensionsDir(legacyRoot)) return;
	return legacyRoot;
}
function readChildDirectoryNames(dir) {
	if (!dir || !fs.existsSync(dir)) return /* @__PURE__ */ new Set();
	try {
		return new Set(sortUniqueStrings(fs.readdirSync(dir, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name)));
	} catch {
		return /* @__PURE__ */ new Set();
	}
}
function readBundledDistOptOutDirectoryNames(sourceExtensionsDir) {
	const names = /* @__PURE__ */ new Set();
	if (!sourceExtensionsDir) return names;
	for (const name of readChildDirectoryNames(sourceExtensionsDir)) if (getPackageManifestMetadata(readTrustedPackageManifest(path.join(sourceExtensionsDir, name)) ?? void 0)?.build?.bundledDist === false) names.add(name);
	return names;
}
function createPluginScanner(env, ownershipUid) {
	const result = {
		candidates: [],
		diagnostics: []
	};
	const { candidates, diagnostics } = result;
	const realpathCache = /* @__PURE__ */ new Map();
	const packageManifestCache = /* @__PURE__ */ new Map();
	const attemptedSources = /* @__PURE__ */ new Map();
	function addCandidate(params) {
		const resolved = path.resolve(params.source);
		if (attemptedSources.has(resolved)) {
			const existing = attemptedSources.get(resolved);
			if (existing) mergeCandidateInstallOwner(existing, params.installOwner, params.installOwnerAmbiguous === true);
			return;
		}
		const resolvedRoot = safeRealpathSync(params.rootDir, realpathCache) ?? path.resolve(params.rootDir);
		if (isUnsafePluginCandidate({
			source: resolved,
			rootDir: resolvedRoot,
			origin: params.origin,
			pluginId: params.idHint,
			diagnostics,
			ownershipUid,
			realpathCache
		})) {
			attemptedSources.set(resolved, void 0);
			return;
		}
		const manifest = params.manifest ?? null;
		const packageManifest = getPackageManifestMetadata(manifest ?? void 0);
		const packageDependencies = normalizePluginDependencySpecs({
			dependencies: manifest?.dependencies,
			optionalDependencies: manifest?.optionalDependencies
		});
		const candidate = {
			idHint: params.idHint,
			...params.effectivePluginId ? { effectivePluginId: params.effectivePluginId } : {},
			...params.diagnosticIdHint && params.diagnosticIdHint !== params.idHint ? { diagnosticIdHint: params.diagnosticIdHint } : {},
			source: resolved,
			setupSource: params.setupSource,
			rootDir: resolvedRoot,
			origin: params.origin,
			format: params.format ?? "openclaw",
			bundleFormat: params.bundleFormat,
			workspaceDir: params.workspaceDir,
			packageName: normalizeOptionalString(manifest?.name),
			packageVersion: normalizeOptionalString(manifest?.version),
			packageDescription: normalizeOptionalString(manifest?.description),
			packageDir: params.packageDir,
			packageManifest,
			packageDependencies: packageDependencies.dependencies,
			packageOptionalDependencies: packageDependencies.optionalDependencies,
			rawPackageManifest: manifest ?? void 0,
			bundledManifestId: params.bundledManifestId,
			bundledManifest: params.bundledManifest,
			bundledManifestPath: params.bundledManifestPath,
			...params.requiredPluginIds && params.requiredPluginIds.length > 0 ? { requiredPluginIds: params.requiredPluginIds } : {},
			...params.requiredPluginSource ? { requiredPluginSource: params.requiredPluginSource } : {}
		};
		recordPluginCandidateInstallOwner(candidate, params.installOwner, params.installOwnerAmbiguous === true);
		candidates.push(candidate);
		attemptedSources.set(resolved, candidate);
	}
	function discoverBundleInRoot(params) {
		return withPluginScanExistenceCache(() => {
			const bundleFormat = detectBundleManifestFormat(params.rootDir, params.hasPackageExtensions);
			if (!bundleFormat) return "none";
			const rootRealPath = safeRealpathSync(params.rootDir, realpathCache) ?? void 0;
			const rejectHardlinks = shouldRejectHardlinkedPluginFiles({
				origin: params.origin,
				rootDir: params.rootDir,
				env,
				realpathCache
			});
			const bundleManifest = loadBundleManifest({
				rootDir: params.rootDir,
				...rootRealPath !== void 0 ? { rootRealPath } : {},
				bundleFormat,
				rejectHardlinks
			});
			if (!bundleManifest.ok) {
				diagnostics.push({
					level: "error",
					message: bundleManifest.error,
					source: bundleManifest.manifestPath
				});
				return "invalid";
			}
			addCandidate({
				idHint: bundleManifest.manifest.id,
				source: params.rootDir,
				rootDir: params.rootDir,
				origin: params.origin,
				format: "bundle",
				bundleFormat,
				workspaceDir: params.workspaceDir,
				...params.installOwner ? { installOwner: params.installOwner } : {},
				...params.installOwnerAmbiguous ? { installOwnerAmbiguous: true } : {},
				manifest: params.manifest,
				packageDir: params.rootDir,
				bundledManifestId: bundleManifest.manifest.id,
				bundledManifestPath: bundleManifest.manifestPath
			});
			return "added";
		});
	}
	function discoverPluginDirectory(params) {
		const { dir, rootRealPath } = params;
		const requireBuiltRuntimeEntry = params.requireBuiltRuntimeEntry ?? isManagedPluginDir({
			dir,
			realpath: rootRealPath,
			managedPluginDirs: params.managedPluginDirs,
			realpathCache
		});
		const rejectHardlinks = shouldRejectHardlinkedPluginFiles({
			origin: params.origin,
			rootDir: dir,
			env,
			realpathCache
		});
		const manifest = readCandidatePackageManifest({
			dir,
			origin: params.origin,
			rejectHardlinks,
			...rootRealPath !== void 0 ? { rootRealPath } : {},
			packageManifestCache
		});
		const packageMetadata = getPackageManifestMetadata(manifest ?? void 0);
		const candidateManifest = resolveCandidateManifest(dir, rejectHardlinks, rootRealPath);
		const manifestId = candidateManifest?.manifest.id;
		const pluginIdHint = normalizeOptionalString(manifestId) ?? normalizeOptionalString(packageMetadata?.plugin?.id) ?? normalizeOptionalString(packageMetadata?.channel?.id) ?? derivePackagePluginIdHint(manifest?.name) ?? path.basename(dir);
		if (shouldSkipIncompatiblePackagePluginApi({
			origin: params.origin,
			packageManifest: packageMetadata,
			pluginId: pluginIdHint,
			packageDir: dir,
			env,
			diagnostics
		})) return true;
		const extensionResolution = resolvePackageExtensionEntries(manifest ?? void 0);
		if (pushInvalidPackageExtensionDiagnostic({
			resolution: extensionResolution,
			source: dir,
			pluginId: pluginIdHint,
			diagnostics
		})) return true;
		const extensions = extensionResolution.status === "ok" ? extensionResolution.entries : [];
		const setupSource = resolvePackageSetupSource({
			packageDir: dir,
			...rootRealPath !== void 0 ? { packageRootRealPath: rootRealPath } : {},
			manifest,
			pluginIdHint,
			origin: params.origin,
			requireBuiltRuntimeEntry,
			sourceLabel: dir,
			diagnostics,
			rejectHardlinks
		});
		const addPackageCandidate = (source, idHint, effectivePluginId) => {
			addCandidate({
				idHint,
				...effectivePluginId ? { effectivePluginId } : {},
				diagnosticIdHint: pluginIdHint,
				source,
				...setupSource ? { setupSource } : {},
				rootDir: dir,
				origin: params.origin,
				workspaceDir: params.workspaceDir,
				...params.installOwner ? { installOwner: params.installOwner } : {},
				...params.installOwnerAmbiguous ? { installOwnerAmbiguous: true } : {},
				manifest,
				packageDir: dir,
				requiredPluginIds: candidateManifest?.manifest.requiresPlugins,
				requiredPluginSource: candidateManifest?.manifestPath
			});
		};
		if (extensions.length > 0) {
			const resolvedRuntimeSources = resolvePackageRuntimeExtensionSources({
				packageDir: dir,
				...rootRealPath !== void 0 ? { packageRootRealPath: rootRealPath } : {},
				manifest,
				extensions,
				origin: params.origin,
				pluginIdHint,
				requireBuiltRuntimeEntry,
				sourceLabel: dir,
				diagnostics,
				rejectHardlinks
			});
			const entryIdSources = /* @__PURE__ */ new Map();
			for (const source of resolvedRuntimeSources) {
				const idHint = deriveIdHint({
					filePath: source,
					manifestId: manifestId ?? normalizeOptionalString(packageMetadata?.plugin?.id),
					packageName: manifest?.name,
					fallbackId: path.basename(dir),
					hasMultipleExtensions: extensions.length > 1
				});
				const sources = entryIdSources.get(idHint);
				if (sources) sources.push(source);
				else entryIdSources.set(idHint, [source]);
			}
			for (const [idHint, sources] of entryIdSources) {
				if (extensions.length > 1 && sources.length > 1) {
					diagnostics.push({
						level: "error",
						pluginId: idHint,
						source: dir,
						message: `plugin package entries collide on derived id "${idHint}" (${sources.map((s) => path.relative(dir, s)).join(", ")}); rename the entry files to unique basenames`
					});
					continue;
				}
				for (const source of sources) addPackageCandidate(source, idHint, extensions.length > 1 ? idHint : void 0);
			}
			return true;
		}
		if (discoverBundleInRoot({
			rootDir: dir,
			hasPackageExtensions: extensions.length > 0,
			origin: params.origin,
			workspaceDir: params.workspaceDir,
			...params.installOwner ? { installOwner: params.installOwner } : {},
			...params.installOwnerAmbiguous ? { installOwnerAmbiguous: true } : {},
			manifest
		}) === "added") return true;
		const indexFile = [...DEFAULT_PLUGIN_ENTRY_CANDIDATES].map((candidate) => path.join(dir, candidate)).find((candidate) => fs.existsSync(candidate));
		if (indexFile && isExtensionFile(indexFile)) {
			addPackageCandidate(indexFile, manifestId ?? path.basename(dir));
			return true;
		}
		return addLegacyNpmDeclarationDiagnostic({
			pluginDir: dir,
			diagnostics
		});
	}
	function discoverInDirectory(params) {
		if (!fs.existsSync(params.dir)) return;
		let entries;
		try {
			entries = fs.readdirSync(params.dir, { withFileTypes: true }).toSorted((left, right) => left.name < right.name ? -1 : left.name > right.name ? 1 : 0);
		} catch (err) {
			diagnostics.push({
				level: "warn",
				message: `failed to read extensions dir: ${params.dir} (${String(err)})`,
				source: params.dir
			});
			return;
		}
		for (const entry of entries) {
			const fullPath = path.join(params.dir, entry.name);
			const entryType = resolveScannedEntryType(entry, fullPath);
			if (entryType === "file") {
				if (!(params.scanFiles ?? params.origin === "bundled") || !isExtensionFile(fullPath)) continue;
				addCandidate({
					idHint: path.basename(entry.name, path.extname(entry.name)),
					source: fullPath,
					rootDir: path.dirname(fullPath),
					origin: params.origin,
					workspaceDir: params.workspaceDir,
					...params.installOwner ? { installOwner: params.installOwner } : {},
					...params.installOwnerAmbiguous ? { installOwnerAmbiguous: true } : {}
				});
				continue;
			}
			if (entryType !== "directory") continue;
			if (params.skipDirectories?.has(entry.name)) continue;
			if (shouldIgnoreScannedDirectory(entry.name)) continue;
			const fullPathRealPath = safeRealpathSync(fullPath, realpathCache) ?? void 0;
			const fullPathDirKey = fullPathRealPath ?? path.resolve(fullPath);
			if (params.skipRootDirKeys?.has(fullPathDirKey)) continue;
			discoverPluginDirectory({
				...params,
				dir: fullPath,
				rootRealPath: fullPathRealPath
			});
		}
	}
	function discoverFromPath(params) {
		const resolved = resolveUserPath(params.rawPath, env);
		if (!fs.existsSync(resolved)) {
			diagnostics.push({
				level: "error",
				message: `plugin path not found: ${resolved}`,
				source: resolved
			});
			return;
		}
		const stat = fs.statSync(resolved);
		if (stat.isFile()) {
			if (!isExtensionFile(resolved)) {
				diagnostics.push({
					level: "error",
					message: `plugin path is not a supported file: ${resolved}`,
					source: resolved
				});
				return;
			}
			addCandidate({
				idHint: path.basename(resolved, path.extname(resolved)),
				source: resolved,
				rootDir: path.dirname(resolved),
				origin: params.origin,
				workspaceDir: params.workspaceDir,
				...params.installOwner ? { installOwner: params.installOwner } : {},
				...params.installOwnerAmbiguous ? { installOwnerAmbiguous: true } : {}
			});
			return;
		}
		if (stat.isDirectory()) {
			if (discoverPluginDirectory({
				...params,
				dir: resolved,
				rootRealPath: safeRealpathSync(resolved, realpathCache) ?? void 0
			})) return;
			discoverInDirectory({
				dir: resolved,
				origin: params.origin,
				workspaceDir: params.workspaceDir,
				...params.scanFiles !== void 0 || params.origin === "config" ? { scanFiles: params.scanFiles ?? true } : {},
				...params.requireBuiltRuntimeEntry !== void 0 ? { requireBuiltRuntimeEntry: params.requireBuiltRuntimeEntry } : {},
				...params.managedPluginDirs ? { managedPluginDirs: params.managedPluginDirs } : {},
				...params.skipRootDirKeys ? { skipRootDirKeys: params.skipRootDirKeys } : {}
			});
		}
	}
	function discoverConfiguredPaths(loadPaths, workspaceDir) {
		for (const loadPath of loadPaths) if (typeof loadPath === "string" && loadPath.trim()) discoverFromPath({
			rawPath: loadPath.trim(),
			origin: "config",
			workspaceDir
		});
	}
	function finish() {
		const candidatesBySource = /* @__PURE__ */ new Map();
		const seenDiagnostics = /* @__PURE__ */ new Set();
		const uniqueDiagnostics = [];
		for (const candidate of candidates) {
			const key = safeRealpathSync(candidate.source, realpathCache) ?? path.resolve(candidate.source);
			const existing = candidatesBySource.get(key);
			if (existing) {
				mergeCandidateInstallOwner(existing, resolvePluginCandidateInstallOwner(candidate), isPluginCandidateInstallOwnerAmbiguous(candidate));
				continue;
			}
			candidatesBySource.set(key, candidate);
		}
		for (const diagnostic of diagnostics) {
			const key = [
				diagnostic.level,
				diagnostic.pluginId ?? "",
				diagnostic.source ?? "",
				diagnostic.message
			].join("\0");
			if (seenDiagnostics.has(key)) continue;
			seenDiagnostics.add(key);
			uniqueDiagnostics.push(diagnostic);
		}
		result.candidates = [...candidatesBySource.values()];
		result.diagnostics = uniqueDiagnostics;
		return result;
	}
	return {
		result,
		realpathCache,
		discoverConfiguredPaths,
		discoverFromPath,
		discoverInDirectory,
		finish,
		startSharedPhase: () => attemptedSources.clear()
	};
}
/** Discovers only explicit plugins.load.paths candidates without scanning shared roots. */
function discoverConfiguredPluginLoadPaths(params) {
	const scanner = createPluginScanner(params.env ?? process.env, params.ownershipUid);
	scanner.discoverConfiguredPaths(params.loadPaths, normalizeOptionalString(params.workspaceDir));
	return params.deduplicate ? scanner.finish() : scanner.result;
}
function discoverOpenClawPlugins(params) {
	const env = params.env ?? process.env;
	const workspaceDir = normalizeOptionalString(params.workspaceDir);
	const workspaceRoot = workspaceDir ? resolveUserPath(workspaceDir, env) : void 0;
	const roots = resolvePluginSourceRoots({
		workspaceDir: workspaceRoot,
		env
	});
	const scanner = createPluginScanner(env, params.ownershipUid);
	const { result, realpathCache, discoverFromPath, discoverInDirectory } = scanner;
	if (params.rootScope !== "bundled") tracePluginLifecyclePhase("discovery scan", () => {
		scanner.discoverConfiguredPaths(params.extraPaths ?? [], workspaceDir);
		const workspaceMatchesBundledRoot = resolvesToSameDirectory(workspaceRoot, roots.stock, realpathCache);
		if (roots.workspace && workspaceRoot && !workspaceMatchesBundledRoot) discoverInDirectory({
			dir: roots.workspace,
			origin: "workspace",
			workspaceDir: workspaceRoot
		});
	}, {
		scope: "scoped",
		extraPathCount: params.extraPaths?.length ?? 0
	});
	scanner.startSharedPhase();
	tracePluginLifecyclePhase("discovery scan", () => {
		for (const sourceOverlayDir of listBundledSourceOverlayDirs({
			bundledRoot: roots.stock,
			env
		})) {
			discoverFromPath({
				rawPath: sourceOverlayDir,
				origin: "bundled",
				workspaceDir
			});
			result.diagnostics.push({
				level: "warn",
				source: sourceOverlayDir,
				message: "using bind-mounted bundled plugin source overlay; this source overrides the packaged dist bundle for the same plugin id"
			});
		}
		const sourceCheckoutDependencyDiagnostic = resolveSourceCheckoutDependencyDiagnostic(env);
		if (sourceCheckoutDependencyDiagnostic) result.diagnostics.push({
			level: "warn",
			source: sourceCheckoutDependencyDiagnostic.source,
			message: sourceCheckoutDependencyDiagnostic.message
		});
		const sourceCheckoutExtensionsDir = resolveBundledSourceCheckoutExtensionsDir(roots.stock);
		const bundledDistOptOutDirectories = readBundledDistOptOutDirectoryNames(sourceCheckoutExtensionsDir);
		if (sourceCheckoutExtensionsDir) for (const dirName of bundledDistOptOutDirectories) discoverFromPath({
			rawPath: path.join(sourceCheckoutExtensionsDir, dirName),
			origin: "bundled",
			workspaceDir
		});
		if (roots.stock) discoverInDirectory({
			dir: roots.stock,
			origin: "bundled",
			skipDirectories: bundledDistOptOutDirectories
		});
		const sourceCheckoutMatchesBundledRoot = resolvesToSameDirectory(sourceCheckoutExtensionsDir, roots.stock, realpathCache);
		if (sourceCheckoutExtensionsDir && !sourceCheckoutMatchesBundledRoot) discoverInDirectory({
			dir: sourceCheckoutExtensionsDir,
			origin: "bundled",
			skipDirectories: readChildDirectoryNames(roots.stock)
		});
		if (params.rootScope !== "bundled") {
			const { installedPaths, installedPluginDirKeys, managedPluginDirs } = prepareInstalledPluginPaths(params.installRecords, env, realpathCache, result.diagnostics);
			for (const installedPath of installedPaths) discoverFromPath({
				rawPath: installedPath.path,
				origin: "global",
				workspaceDir,
				...installedPath.installOwner ? { installOwner: installedPath.installOwner } : {},
				...installedPath.installOwnerAmbiguous ? { installOwnerAmbiguous: true } : {},
				requireBuiltRuntimeEntry: installedPath.requireBuiltRuntimeEntry,
				managedPluginDirs,
				scanFiles: true
			});
			discoverInDirectory({
				dir: roots.global,
				origin: "global",
				managedPluginDirs,
				skipRootDirKeys: installedPluginDirKeys
			});
		}
	}, { scope: "shared" });
	scanner.finish();
	addMissingRequiredPluginDiagnostics(result, {
		env,
		realpathCache
	});
	return result;
}
//#endregion
export { buildBundledPluginLoadPathAliases as _, projectPluginDependencyHealth as a, parseLegacyBundledPluginPath as b, tracePluginLifecyclePhaseAsync as c, recordPluginCandidateInstallOwner as d, recordPluginInstallOwnerLookup as f, listBundledSourceOverlayDirs as g, isBundledSourceOverlayPath as h, normalizePluginDependencySpecs as i, readLegacyNpmPluginDeclaration as l, resolvePluginInstallOwnerLookup as m, discoverOpenClawPlugins as n, isPluginLifecycleTraceEnabled as o, resolvePluginCandidateInstallOwner as p, buildPluginDependencyStatus as r, tracePluginLifecyclePhase as s, discoverConfiguredPluginLoadPaths as t, isPluginCandidateInstallOwnerAmbiguous as u, buildLegacyBundledRootPath as v, parsePackagedBundledPluginPath as x, normalizeBundledLookupPath as y };
