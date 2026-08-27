import { a as isPathInside, n as hasNodeErrorCode } from "./path-D138yf8v.js";
import { c as resolveUserPath } from "./home-dir-BFvskzn8.js";
import "./path-guards-CQoZeoCG.js";
import { l as pathExists, m as shortenHomePath } from "./utils-Bw16L5tB.js";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.js";
import { C as resolveOAuthDir, f as resolveConfigPath, w as resolveStateDir } from "./paths-BBSTUjD5.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { a as listAgentIds, l as resolveAgentDir } from "./agent-scope-config-CUBiGmG3.js";
import { s as readConfigFileSnapshot } from "./io-ClLVsBMp.js";
import { s as normalizePluginsConfig } from "./config-state-Bgpvw0Q6.js";
import { a as resolveDefaultPluginExtensionsDir } from "./install-paths-DllFtsSG.js";
import { Xt as resolveOpenClawStateSqlitePath } from "./openclaw-state-db-kmBThqu6.js";
import { s as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-BI5GxVU3.js";
import { n as isActivatedManifestOwner } from "./manifest-owner-policy-BL1Kt38K.js";
import { n as isManifestPluginAvailableForControlPlane } from "./manifest-contract-eligibility-DI1_0gqL.js";
import "./config-B_0xOnKq.js";
import { n as isWindowsDrivePath } from "./archive-entry-DulHWXJZ.js";
import "./archive-path-C2hsuc07.js";
import { n as isPathWithin, t as buildCleanupPlan } from "./cleanup-utils-DBlaUZGP.js";
import { i as resolveUpgradeConfigSnapshot } from "./automatic-upgrade-config-repair-BRdpeyxE.js";
import { r as recordBackupRunOutcome } from "./backup-run-records-BiroQsNb.js";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
//#region src/plugins/manifest-backup-resources.ts
function listPluginInstallRoots(env) {
	const extensionsDir = resolveDefaultPluginExtensionsDir(env);
	try {
		return fs.readdirSync(extensionsDir, { withFileTypes: true }).filter((entry) => entry.isDirectory() || entry.isSymbolicLink()).map((entry) => path.join(extensionsDir, entry.name));
	} catch (error) {
		if (hasNodeErrorCode(error, "ENOENT")) return [];
		throw error;
	}
}
/** Resolves effective plugin-owned backup policy without importing or activating plugin runtime. */
function resolveActivatedPluginBackupInventory(params) {
	const normalizedConfig = normalizePluginsConfig(params.config.plugins);
	const workspaceScopes = params.workspaceDirs?.length ? [...new Set(params.workspaceDirs)] : [void 0];
	const backupRoots = [params.stateDir, ...params.workspaceDirs ?? []].filter((root) => Boolean(root)).map((root) => path.resolve(root));
	const pluginRoots = /* @__PURE__ */ new Set();
	const addPluginRoot = (pluginRoot) => {
		const resolvedRoot = path.resolve(pluginRoot);
		if (backupRoots.some((backupRoot) => resolvedRoot === backupRoot || isPathInside(backupRoot, resolvedRoot))) pluginRoots.add(resolvedRoot);
	};
	for (const pluginRoot of listPluginInstallRoots(params.env)) addPluginRoot(pluginRoot);
	const resources = /* @__PURE__ */ new Map();
	for (const workspaceDir of workspaceScopes) {
		const snapshot = resolvePluginMetadataSnapshot({
			config: params.config,
			env: params.env,
			...params.stateDir ? { stateDir: params.stateDir } : {},
			...workspaceDir ? { workspaceDir } : {}
		});
		for (const candidate of snapshot.discovery?.candidates ?? []) addPluginRoot(candidate.rootDir);
		const invalidDeclaration = normalizedConfig.enabled ? snapshot.diagnostics.find((diagnostic) => {
			if (diagnostic.code !== "backup-resource-declaration-invalid") return false;
			if (!diagnostic.pluginId) return true;
			const indexedOwner = snapshot.index.plugins.find((owner) => owner.pluginId === diagnostic.pluginId);
			const discoveredOwner = snapshot.discovery?.candidates.find((owner) => (owner.diagnosticIdHint ?? owner.idHint) === diagnostic.pluginId);
			const owner = indexedOwner ?? discoveredOwner;
			if (!owner) return true;
			const plugin = {
				id: diagnostic.pluginId,
				origin: owner.origin,
				enabledByDefault: indexedOwner?.enabledByDefault,
				enabledByDefaultOnPlatforms: indexedOwner?.enabledByDefaultOnPlatforms?.slice()
			};
			return isActivatedManifestOwner({
				plugin,
				normalizedConfig,
				rootConfig: params.config
			}) && (!indexedOwner || isManifestPluginAvailableForControlPlane({
				snapshot,
				plugin,
				config: params.config
			}));
		}) : void 0;
		if (invalidDeclaration) throw new Error(invalidDeclaration.message);
		for (const plugin of snapshot.plugins) {
			if (!normalizedConfig.enabled || !plugin.backupResources?.length || !isActivatedManifestOwner({
				plugin,
				normalizedConfig,
				rootConfig: params.config
			}) || !isManifestPluginAvailableForControlPlane({
				snapshot,
				plugin,
				config: params.config
			})) continue;
			for (const resource of plugin.backupResources) {
				const key = `${plugin.id}\0${resource.scope}\0${resource.relativePath}\0${resource.disposition}`;
				if (!resources.has(key)) resources.set(key, {
					pluginId: plugin.id,
					...resource
				});
			}
		}
	}
	return {
		pluginRoots: [...pluginRoots].toSorted(),
		resources: [...resources.entries()].toSorted(([left], [right]) => left < right ? -1 : left > right ? 1 : 0).map(([, resource]) => resource)
	};
}
//#endregion
//#region src/commands/backup-resource-inventory.ts
const MANAGED_STATE_ROOTS = [
	"dev",
	"git",
	"npm",
	"npm-runtime",
	"tmp",
	"tools"
];
async function listDefaultAgentTemporaryRoots(stateDir, agentRoots) {
	const customAgentRoots = agentRoots.filter(({ agentId, sourcePath }) => sourcePath !== path.join(stateDir, "agents", agentId, "agent"));
	const temporaryRoots = [];
	const visit = async (directoryPath) => {
		if (customAgentRoots.some(({ sourcePath }) => isPathWithin(directoryPath, sourcePath))) return;
		let entries;
		try {
			entries = await fs$1.readdir(directoryPath, { withFileTypes: true });
		} catch (error) {
			if (hasErrnoCode(error, "ENOENT") || hasErrnoCode(error, "ENOTDIR")) return;
			throw error;
		}
		for (const entry of entries) {
			if (!entry.isDirectory()) continue;
			const entryPath = path.join(directoryPath, entry.name);
			if (customAgentRoots.some(({ sourcePath }) => isPathWithin(entryPath, sourcePath))) continue;
			if (entry.name === "tmp" || entry.name === ".tmp") {
				temporaryRoots.push(entryPath);
				continue;
			}
			await visit(entryPath);
		}
	};
	let agentDirectories;
	try {
		agentDirectories = await fs$1.readdir(path.join(stateDir, "agents"), { withFileTypes: true });
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT") || hasErrnoCode(error, "ENOTDIR")) return temporaryRoots;
		throw error;
	}
	for (const directory of agentDirectories) if (directory.isDirectory()) await visit(path.join(stateDir, "agents", directory.name, "agent"));
	return temporaryRoots;
}
/** Build the one immutable owner inventory used by backup planning and archive consumers. */
async function createBackupResourceInventory(params) {
	const stateDir = path.resolve(params.stateDir);
	const agentRoots = Object.freeze(params.agentRoots.map((root) => Object.freeze({
		agentId: root.agentId,
		sourcePath: path.resolve(root.sourcePath),
		databasePath: path.resolve(root.databasePath)
	})));
	const protectedPathSet = /* @__PURE__ */ new Set([path.resolve(params.configPath), resolveOpenClawStateSqlitePath({
		...process.env,
		OPENCLAW_STATE_DIR: stateDir
	})]);
	const regenerableRoots = [];
	const exclude = (kind, sourcePath) => {
		regenerableRoots.push({
			kind,
			sourcePath: path.resolve(sourcePath)
		});
	};
	if (!params.onlyConfig) {
		protectedPathSet.add(path.resolve(params.oauthDir));
		for (const workspaceDir of params.workspaceDirs) protectedPathSet.add(path.resolve(workspaceDir));
		for (const root of agentRoots) {
			protectedPathSet.add(root.sourcePath);
			protectedPathSet.add(root.databasePath);
		}
		for (const root of MANAGED_STATE_ROOTS) exclude("managed state", path.join(stateDir, root));
		for (const temporaryRoot of await listDefaultAgentTemporaryRoots(stateDir, agentRoots)) exclude("agent temporary files", temporaryRoot);
		exclude("plugin skills", path.join(stateDir, "plugin-skills"));
		for (const resource of params.pluginResources) {
			const anchors = resource.scope === "state" ? [{ sourcePath: stateDir }] : agentRoots;
			for (const anchor of anchors) {
				const sourcePath = path.resolve(anchor.sourcePath, ...resource.relativePath.split("/"));
				if (!isPathWithin(sourcePath, anchor.sourcePath)) throw new Error(`Plugin ${resource.pluginId} backup resource escapes its ${resource.scope} root: ${resource.relativePath}`);
				if (resource.disposition === "include") protectedPathSet.add(sourcePath);
				else exclude("plugin resource", sourcePath);
			}
		}
		for (const pluginRoot of params.pluginRoots) exclude("plugin dependencies", path.join(pluginRoot, "node_modules"));
	}
	const seenRegenerableRoots = /* @__PURE__ */ new Set();
	const uniqueRegenerableRoots = Object.freeze(regenerableRoots.toSorted((left, right) => left.sourcePath.localeCompare(right.sourcePath) || left.kind.localeCompare(right.kind)).filter((resource) => {
		const key = `${resource.kind}\0${resource.sourcePath}`;
		if (seenRegenerableRoots.has(key)) return false;
		seenRegenerableRoots.add(key);
		return true;
	}));
	const protectedPaths = Object.freeze([...protectedPathSet].toSorted());
	const excludedPaths = Object.freeze(uniqueRegenerableRoots.map((resource) => resource.sourcePath).toSorted((left, right) => right.length - left.length || left.localeCompare(right)));
	const isIncluded = (sourcePath) => {
		const candidate = path.resolve(sourcePath);
		const exclusion = excludedPaths.find((excludedPath) => isPathWithin(candidate, excludedPath));
		if (!exclusion) return true;
		return protectedPaths.some((protectedPath) => isPathWithin(candidate, protectedPath) && isPathWithin(protectedPath, exclusion));
	};
	const isTraversable = (sourcePath) => {
		const candidate = path.resolve(sourcePath);
		return isIncluded(candidate) || protectedPaths.some((protectedPath) => isPathWithin(protectedPath, candidate));
	};
	const isPackageContent = (sourcePath) => {
		const candidate = path.resolve(sourcePath);
		if (protectedPaths.some((protectedPath) => isPathWithin(candidate, protectedPath) || isPathWithin(protectedPath, candidate))) return false;
		if (!isPathWithin(candidate, stateDir)) return false;
		const segments = path.relative(stateDir, candidate).split(path.sep);
		if (segments[0] === "agents" && segments[1] && (segments.length === 2 || segments[2] === "agent" && (segments.length === 3 || segments.length === 4 && /^openclaw-agent\.sqlite(?:-wal|-shm|-journal)?$/u.test(segments[3] ?? "")))) return false;
		return segments.includes("node_modules");
	};
	return Object.freeze({
		stateDir,
		agentRoots,
		regenerableRoots: uniqueRegenerableRoots,
		isIncluded,
		isTraversable,
		isPackageContent
	});
}
//#endregion
//#region src/commands/backup-shared.ts
const BACKUP_MAX_DECOMPRESSION_RATIO = 1100;
function recordBackupOutcomeBestEffort(runtime, params) {
	try {
		recordBackupRunOutcome(params);
	} catch (error) {
		const label = params.kind === "git" ? "Git backup" : "backup";
		runtime.error(`Warning: the ${label} outcome could not be recorded: ${formatErrorMessage(error)}`);
	}
}
function resolveRequiredBackupPath(value, label) {
	const trimmed = value?.trim();
	if (!trimmed) throw new Error(`Missing required ${label} value.`);
	return resolveUserPath(trimmed);
}
function backupAssetPriority(kind) {
	switch (kind) {
		case "state": return 0;
		case "config": return 1;
		case "credentials": return 2;
		case "workspace": return 3;
		case "agent": return 4;
	}
	throw new Error("Unsupported backup asset kind");
}
/** Format a filesystem-safe local timestamp with explicit UTC offset for backup names. */
function formatBackupArchiveTimestamp(nowMs = Date.now(), offsetMinutes = -new Date(nowMs).getTimezoneOffset()) {
	const shifted = nowMs + offsetMinutes * 6e4;
	const local = new Date(shifted);
	const sign = offsetMinutes >= 0 ? "+" : "-";
	const absOffsetMinutes = Math.abs(offsetMinutes);
	const offsetHours = String(Math.floor(absOffsetMinutes / 60)).padStart(2, "0");
	const offsetMins = String(absOffsetMinutes % 60).padStart(2, "0");
	return `${String(local.getUTCFullYear()).padStart(4, "0")}-${String(local.getUTCMonth() + 1).padStart(2, "0")}-${String(local.getUTCDate()).padStart(2, "0")}T${String(local.getUTCHours()).padStart(2, "0")}-${String(local.getUTCMinutes()).padStart(2, "0")}-${String(local.getUTCSeconds()).padStart(2, "0")}.${String(local.getUTCMilliseconds()).padStart(3, "0")}${sign}${offsetHours}-${offsetMins}`;
}
/** Build the root directory name stored inside a backup tarball. */
function buildBackupArchiveRoot(nowMs = Date.now()) {
	return `${formatBackupArchiveTimestamp(nowMs)}-openclaw-backup`;
}
/** Build the default `.tar.gz` filename for a backup archive. */
function buildBackupArchiveBasename(nowMs = Date.now()) {
	return `${buildBackupArchiveRoot(nowMs)}.tar.gz`;
}
/** Encode an absolute or relative source path into a traversal-safe archive payload path. */
function encodeAbsolutePathForBackupArchive(sourcePath) {
	const normalized = sourcePath.replaceAll("\\", "/");
	const windowsMatch = normalized.match(/^([A-Za-z]):\/(.*)$/);
	if (windowsMatch) {
		const drive = windowsMatch[1]?.toUpperCase() ?? "UNKNOWN";
		const rest = windowsMatch[2] ?? "";
		return path.posix.join("windows", drive, rest);
	}
	if (normalized.startsWith("/")) return path.posix.join("posix", normalized.slice(1));
	return path.posix.join("relative", normalized);
}
/** Build the archive-relative payload path for one source path. */
function buildBackupArchivePath(archiveRoot, sourcePath) {
	return path.posix.join(archiveRoot, "payload", encodeAbsolutePathForBackupArchive(sourcePath));
}
/** Resolve a backup plan from explicit paths, deduplicating assets already covered by parents. */
async function resolveBackupPlanFromPaths(params) {
	const includeWorkspace = params.includeWorkspace ?? true;
	const onlyConfig = params.onlyConfig ?? false;
	const stateDir = params.stateDir;
	const configPath = params.configPath;
	const oauthDir = params.oauthDir;
	const archiveRoot = buildBackupArchiveRoot(params.nowMs);
	const workspaceDirs = includeWorkspace ? params.workspaceDirs ?? [] : [];
	const agentRoots = onlyConfig ? [] : params.agentRoots ?? [];
	const configInsideState = params.configInsideState ?? false;
	const oauthInsideState = params.oauthInsideState ?? false;
	const canonicalStateDir = await canonicalizePathForContainment(stateDir);
	const inventory = await createBackupResourceInventory({
		stateDir: canonicalStateDir,
		configPath: await canonicalizePathForContainment(configPath),
		oauthDir: await canonicalizePathForContainment(oauthDir),
		workspaceDirs: await Promise.all(workspaceDirs.map((workspaceDir) => canonicalizePathForContainment(workspaceDir))),
		agentRoots,
		pluginResources: params.pluginInventory?.resources ?? [],
		pluginRoots: params.pluginInventory?.pluginRoots ?? [],
		onlyConfig
	});
	if (onlyConfig) {
		const resolvedConfigPath = path.resolve(configPath);
		if (!await pathExists(resolvedConfigPath)) return {
			stateDir,
			configPath,
			oauthDir,
			workspaceDirs: [],
			inventory,
			included: [],
			skipped: [{
				kind: "config",
				sourcePath: resolvedConfigPath,
				displayPath: shortenHomePath(resolvedConfigPath),
				reason: "missing"
			}]
		};
		const canonicalConfigPath = await canonicalizeExistingPath(resolvedConfigPath);
		return {
			stateDir,
			configPath,
			oauthDir,
			workspaceDirs: [],
			inventory,
			included: [{
				kind: "config",
				sourcePath: canonicalConfigPath,
				displayPath: shortenHomePath(canonicalConfigPath),
				archivePath: buildBackupArchivePath(archiveRoot, canonicalConfigPath)
			}],
			skipped: []
		};
	}
	const rawCandidates = [
		{
			kind: "state",
			sourcePath: path.resolve(stateDir)
		},
		...configInsideState ? [] : [{
			kind: "config",
			sourcePath: path.resolve(configPath)
		}],
		...oauthInsideState ? [] : [{
			kind: "credentials",
			sourcePath: path.resolve(oauthDir)
		}],
		...workspaceDirs.map((workspaceDir) => ({
			kind: "workspace",
			sourcePath: path.resolve(workspaceDir)
		})),
		...agentRoots.map((root) => ({
			kind: "agent",
			sourcePath: root.sourcePath
		}))
	];
	const candidates = await Promise.all(rawCandidates.map(async (candidate) => {
		const exists = await pathExists(candidate.sourcePath);
		return Object.assign({}, candidate, {
			exists,
			canonicalPath: exists ? await canonicalizeExistingPath(candidate.sourcePath) : path.resolve(candidate.sourcePath)
		});
	}));
	const uniqueCandidates = [];
	const seenCanonicalPaths = /* @__PURE__ */ new Set();
	for (const candidate of [...candidates].toSorted(compareCandidates)) {
		if (seenCanonicalPaths.has(candidate.canonicalPath)) continue;
		seenCanonicalPaths.add(candidate.canonicalPath);
		uniqueCandidates.push(candidate);
	}
	const included = [];
	const skipped = [];
	for (const candidate of uniqueCandidates) {
		if (!candidate.exists) {
			if (candidate.kind === "agent" && agentRoots.some((root) => root.sourcePath === candidate.canonicalPath && root.sourcePath === path.join(canonicalStateDir, "agents", root.agentId, "agent"))) continue;
			skipped.push({
				kind: candidate.kind,
				sourcePath: candidate.sourcePath,
				displayPath: shortenHomePath(candidate.sourcePath),
				reason: "missing"
			});
			continue;
		}
		const coveredBy = included.find((asset) => isPathWithin(candidate.canonicalPath, asset.sourcePath));
		if (coveredBy) {
			skipped.push({
				kind: candidate.kind,
				sourcePath: candidate.canonicalPath,
				displayPath: shortenHomePath(candidate.canonicalPath),
				reason: "covered",
				coveredBy: coveredBy.displayPath
			});
			continue;
		}
		included.push({
			kind: candidate.kind,
			sourcePath: candidate.canonicalPath,
			displayPath: shortenHomePath(candidate.canonicalPath),
			archivePath: buildBackupArchivePath(archiveRoot, candidate.canonicalPath)
		});
	}
	const regenerableRoots = inventory.regenerableRoots.filter((resource) => !inventory.isIncluded(resource.sourcePath) && included.some((asset) => isPathWithin(resource.sourcePath, asset.sourcePath)));
	const regenerableResourceExists = await Promise.all(regenerableRoots.map((resource) => pathExists(resource.sourcePath)));
	for (const [index, resource] of regenerableRoots.entries()) {
		if (!regenerableResourceExists[index]) continue;
		skipped.push({
			kind: resource.kind,
			sourcePath: resource.sourcePath,
			displayPath: shortenHomePath(resource.sourcePath),
			reason: "regenerable"
		});
	}
	if (params.unresolvedOwnership) for (const kind of ["agent", "plugin resources"]) skipped.push({
		kind,
		sourcePath: configPath,
		displayPath: shortenHomePath(configPath),
		reason: "unresolved"
	});
	return {
		stateDir,
		configPath,
		oauthDir,
		workspaceDirs: workspaceDirs.map((entry) => path.resolve(entry)),
		inventory,
		included,
		skipped
	};
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.backupPlanTestApi")] = { resolveBackupPlanFromPaths };
function compareCandidates(left, right) {
	const depthDelta = left.canonicalPath.length - right.canonicalPath.length;
	if (depthDelta !== 0) return depthDelta;
	const priorityDelta = backupAssetPriority(left.kind) - backupAssetPriority(right.kind);
	if (priorityDelta !== 0) return priorityDelta;
	return left.canonicalPath.localeCompare(right.canonicalPath);
}
async function canonicalizeExistingPath(targetPath) {
	try {
		return await fs$1.realpath(targetPath);
	} catch {
		return path.resolve(targetPath);
	}
}
/** Resolve symlinks in the existing prefix while retaining a not-yet-created suffix. */
async function canonicalizePathForContainment(targetPath) {
	const resolved = path.resolve(targetPath);
	const suffix = [];
	let probe = resolved;
	while (true) try {
		const realProbe = await fs$1.realpath(probe);
		return suffix.length === 0 ? realProbe : path.join(realProbe, ...suffix.toReversed());
	} catch {
		const parent = path.dirname(probe);
		if (parent === probe) return resolved;
		suffix.push(path.basename(probe));
		probe = parent;
	}
}
/** Resolve one configured agent's canonical backup root and owner database path. */
async function resolveBackupAgentRoot(config, agentId) {
	const sourcePath = await canonicalizePathForContainment(resolveAgentDir(config, agentId));
	return {
		agentId,
		sourcePath,
		databasePath: path.join(sourcePath, "openclaw-agent.sqlite")
	};
}
/** Resolve configured agent storage roots and their canonical database paths for backup ownership. */
async function resolveBackupAgentRoots(config) {
	return await Promise.all(listAgentIds(config).map((agentId) => resolveBackupAgentRoot(config, agentId)));
}
/** Resolve the backup plan from the current OpenClaw state/config/workspace paths on disk. */
async function resolveBackupPlanFromDisk(params = {}) {
	const includeWorkspace = params.includeWorkspace ?? true;
	const onlyConfig = params.onlyConfig ?? false;
	const stateDir = resolveStateDir();
	const configPath = resolveConfigPath();
	const oauthDir = resolveOAuthDir();
	if (onlyConfig) return await resolveBackupPlanFromPaths({
		stateDir,
		configPath,
		oauthDir,
		includeWorkspace: false,
		onlyConfig: true,
		nowMs: params.nowMs
	});
	const configSnapshot = await readConfigFileSnapshot({ observe: false });
	const discoverySnapshot = resolveUpgradeConfigSnapshot(configSnapshot) ?? configSnapshot;
	if (includeWorkspace && discoverySnapshot.exists && !discoverySnapshot.valid) throw new Error(`Config invalid at ${shortenHomePath(discoverySnapshot.path)}. OpenClaw cannot reliably discover custom workspaces for backup. Fix the config or rerun with --no-include-workspace for a partial backup.`);
	const cleanupPlan = buildCleanupPlan({
		cfg: discoverySnapshot.config,
		stateDir,
		configPath,
		oauthDir
	});
	const unresolvedOwnership = discoverySnapshot.exists && !discoverySnapshot.valid;
	const agentRoots = unresolvedOwnership ? [] : await resolveBackupAgentRoots(discoverySnapshot.config);
	const workspaceDirs = includeWorkspace ? cleanupPlan.workspaceDirs : [];
	return await resolveBackupPlanFromPaths({
		stateDir,
		configPath,
		oauthDir,
		workspaceDirs,
		agentRoots,
		pluginInventory: unresolvedOwnership ? void 0 : resolveActivatedPluginBackupInventory({
			config: discoverySnapshot.config,
			env: process.env,
			stateDir,
			workspaceDirs
		}),
		unresolvedOwnership,
		includeWorkspace,
		onlyConfig,
		configInsideState: cleanupPlan.configInsideState,
		oauthInsideState: cleanupPlan.oauthInsideState,
		nowMs: params.nowMs
	});
}
//#endregion
//#region src/infra/backup-archive-path-policy.ts
function assertPortableRelativePathSyntax(value, label, reportedValue = value) {
	if (value.startsWith("/") || isWindowsDrivePath(value)) throw new Error(`${label} must be relative: ${reportedValue}`);
	if (value.includes("\\")) throw new Error(`${label} must use forward slashes: ${reportedValue}`);
}
function stripTrailingSlashes(value) {
	return value.replace(/\/+$/u, "");
}
function normalizeArchivePath(entryPath, label) {
	const trimmed = stripTrailingSlashes(entryPath.trim());
	if (!trimmed) throw new Error(`${label} is empty.`);
	assertPortableRelativePathSyntax(trimmed, label, entryPath);
	if (trimmed.split("/").some((segment) => segment === "." || segment === "..")) throw new Error(`${label} contains path traversal segments: ${entryPath}`);
	const normalized = stripTrailingSlashes(path.posix.normalize(trimmed));
	if (!normalized || normalized === "." || normalized === ".." || normalized.startsWith("../")) throw new Error(`${label} resolves outside the archive root: ${entryPath}`);
	return normalized;
}
function normalizeArchiveRoot(rootName) {
	const normalized = normalizeArchivePath(rootName, "Backup manifest archiveRoot");
	if (normalized.includes("/")) throw new Error(`Backup manifest archiveRoot must be a single path segment: ${rootName}`);
	return normalized;
}
function isArchivePathWithin(child, parent) {
	const relative = path.posix.relative(parent, child);
	return relative === "" || !relative.startsWith("../") && relative !== "..";
}
function assertArchiveSymbolicLinkTarget(params) {
	if (!params.linkpath) throw new Error(`Archive symbolic link is missing its target: ${params.entryPath}`);
	assertPortableRelativePathSyntax(params.linkpath, "Archive symbolic link target", `${params.entryPath} -> ${params.linkpath}`);
	const entryPath = normalizeArchivePath(params.entryPath, "Archive symbolic link path");
	const targetPath = path.posix.normalize(path.posix.join(path.posix.dirname(entryPath), params.linkpath));
	if (!isArchivePathWithin(targetPath, normalizeArchiveRoot(params.archiveRoot))) throw new Error(`Archive symbolic link target is outside the declared archive root: ${params.entryPath} -> ${params.linkpath}`);
	const insideDeclaredAsset = (linkPath) => params.assetArchivePaths.some((assetPath) => isArchivePathWithin(linkPath, normalizeArchivePath(assetPath, "Backup manifest asset path")));
	if (!insideDeclaredAsset(entryPath) || !insideDeclaredAsset(targetPath)) throw new Error(`Archive symbolic link is outside the declared backup assets: ${params.entryPath} -> ${params.linkpath}`);
}
//#endregion
export { BACKUP_MAX_DECOMPRESSION_RATIO as a, buildBackupArchiveRoot as c, resolveBackupAgentRoot as d, resolveBackupAgentRoots as f, normalizeArchiveRoot as i, canonicalizePathForContainment as l, resolveRequiredBackupPath as m, isArchivePathWithin as n, buildBackupArchiveBasename as o, resolveBackupPlanFromDisk as p, normalizeArchivePath as r, buildBackupArchivePath as s, assertArchiveSymbolicLinkTarget as t, recordBackupOutcomeBestEffort as u };
