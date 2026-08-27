import { l as pathExists, m as shortenHomePath } from "./utils-DEqefz4f.js";
import { C as resolveOAuthDir, f as resolveConfigPath, w as resolveStateDir } from "./paths-CqeDjSA4.js";
import { l as readConfigFileSnapshot } from "./io-CeQckj5v.js";
import "./config-Dl8DJbzM.js";
import { n as isWindowsDrivePath } from "./archive-entry-DulHWXJZ.js";
import "./archive-path-C2hsuc07.js";
import { n as isPathWithin, t as buildCleanupPlan } from "./cleanup-utils-CAt2PsMZ.js";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/commands/backup-shared.ts
const BACKUP_MAX_DECOMPRESSION_RATIO = 1100;
function backupAssetPriority(kind) {
	switch (kind) {
		case "state": return 0;
		case "config": return 1;
		case "credentials": return 2;
		case "workspace": return 3;
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
	const configInsideState = params.configInsideState ?? false;
	const oauthInsideState = params.oauthInsideState ?? false;
	if (onlyConfig) {
		const resolvedConfigPath = path.resolve(configPath);
		if (!await pathExists(resolvedConfigPath)) return {
			stateDir,
			configPath,
			oauthDir,
			workspaceDirs: [],
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
	return {
		stateDir,
		configPath,
		oauthDir,
		workspaceDirs: workspaceDirs.map((entry) => path.resolve(entry)),
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
		return await fs.realpath(targetPath);
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
		const realProbe = await fs.realpath(probe);
		return suffix.length === 0 ? realProbe : path.join(realProbe, ...suffix.toReversed());
	} catch {
		const parent = path.dirname(probe);
		if (parent === probe) return resolved;
		suffix.push(path.basename(probe));
		probe = parent;
	}
}
/** Resolve the backup plan from the current OpenClaw state/config/workspace paths on disk. */
async function resolveBackupPlanFromDisk(params = {}) {
	const includeWorkspace = params.includeWorkspace ?? true;
	const onlyConfig = params.onlyConfig ?? false;
	const stateDir = resolveStateDir();
	const configPath = resolveConfigPath();
	const oauthDir = resolveOAuthDir();
	const configSnapshot = await readConfigFileSnapshot({ observe: false });
	if (includeWorkspace && configSnapshot.exists && !configSnapshot.valid) throw new Error(`Config invalid at ${shortenHomePath(configSnapshot.path)}. OpenClaw cannot reliably discover custom workspaces for backup. Fix the config or rerun with --no-include-workspace for a partial backup.`);
	const cleanupPlan = buildCleanupPlan({
		cfg: configSnapshot.config,
		stateDir,
		configPath,
		oauthDir
	});
	return await resolveBackupPlanFromPaths({
		stateDir,
		configPath,
		oauthDir,
		workspaceDirs: includeWorkspace ? cleanupPlan.workspaceDirs : [],
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
	if (!isArchivePathWithin(path.posix.normalize(path.posix.join(path.posix.dirname(entryPath), params.linkpath)), normalizeArchiveRoot(params.archiveRoot))) throw new Error(`Archive symbolic link target is outside the declared archive root: ${params.entryPath} -> ${params.linkpath}`);
}
//#endregion
export { BACKUP_MAX_DECOMPRESSION_RATIO as a, buildBackupArchiveRoot as c, normalizeArchiveRoot as i, canonicalizePathForContainment as l, isArchivePathWithin as n, buildBackupArchiveBasename as o, normalizeArchivePath as r, buildBackupArchivePath as s, assertArchiveSymbolicLinkTarget as t, resolveBackupPlanFromDisk as u };
