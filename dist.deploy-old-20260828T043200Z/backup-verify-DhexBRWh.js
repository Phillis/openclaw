import { a as toStringifiedError } from "./error-coercion-CKFmnpjH.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { u as normalizeWindowsPathForComparison } from "./path-D138yf8v.js";
import { c as resolveUserPath } from "./home-dir-BFvskzn8.js";
import "./path-guards-CQoZeoCG.js";
import "./utils-Bw16L5tB.js";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { a as writeRuntimeJson } from "./runtime-LRpY2Icg.js";
import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
import { vt as SQLITE_SIDECAR_SUFFIXES } from "./openclaw-state-db-CeAO_dqo.js";
import { t as openNodeSqliteDatabase } from "./node-sqlite-_e3IvfT7.js";
import { t as assertSqliteIntegrity } from "./sqlite-integrity-D3VwDKmB.js";
import { n as assertOpenClawAgentDatabaseOwner } from "./openclaw-agent-db-maintenance-DDqVWNe-.js";
import { t as loadSqliteVecExtension } from "./sqlite-vec-yun6599L.js";
import "./engine-storage-DHIZuZ7Z.js";
import { t as isTransientSqliteBackupPath } from "./backup-volatile-filter-DWFmNw39.js";
import { a as BACKUP_MAX_DECOMPRESSION_RATIO, i as normalizeArchiveRoot, n as isArchivePathWithin, r as normalizeArchivePath, s as buildBackupArchivePath, t as assertArchiveSymbolicLinkTarget } from "./backup-archive-path-policy-BahRwjJ_.js";
import { n as formatDiskSpaceBytes, r as tryReadDiskSpace } from "./disk-space-CzASwJhY.js";
import os from "node:os";
import path from "node:path";
import fs from "node:fs/promises";
import * as tar from "tar";
//#region src/commands/backup-verify-manifest.ts
function parseBackupManifestSourcePath(value, label) {
	if (typeof value !== "string" || value.includes("\0")) throw new Error(`Backup manifest ${label} has an invalid sourcePath.`);
	const windowsPath = /^[A-Za-z]:[\\/]/u.test(value);
	const normalized = windowsPath ? path.win32.normalize(value) : path.posix.normalize(value);
	if (!windowsPath && !value.startsWith("/") || normalized !== value) throw new Error(`Backup manifest ${label} sourcePath must be absolute and normalized.`);
	return value;
}
function parseBackupManifestAgentRoots(value) {
	if (value === void 0) return;
	if (!Array.isArray(value)) throw new Error("Backup manifest agentRoots must be an array.");
	const agentRoots = [];
	const seenAgentIds = /* @__PURE__ */ new Set();
	const seenSourcePaths = /* @__PURE__ */ new Set();
	for (const agentRoot of value) {
		if (!isRecord(agentRoot) || Object.keys(agentRoot).length !== 2 || !Object.hasOwn(agentRoot, "agentId") || !Object.hasOwn(agentRoot, "sourcePath")) throw new Error("Backup manifest agent root must contain only agentId and sourcePath.");
		const { agentId, sourcePath } = agentRoot;
		if (typeof agentId !== "string" || !agentId || normalizeAgentId(agentId) !== agentId) throw new Error("Backup manifest agent root has an invalid or noncanonical agentId.");
		const normalizedSourcePath = parseBackupManifestSourcePath(sourcePath, "agent root");
		const sourcePathKey = /^[A-Za-z]:[\\/]/u.test(normalizedSourcePath) ? normalizeWindowsPathForComparison(normalizedSourcePath) : normalizedSourcePath;
		if (seenAgentIds.has(agentId) || seenSourcePaths.has(sourcePathKey)) throw new Error("Backup manifest contains duplicate agent root ownership.");
		seenAgentIds.add(agentId);
		seenSourcePaths.add(sourcePathKey);
		agentRoots.push({
			agentId,
			sourcePath: normalizedSourcePath
		});
	}
	return agentRoots;
}
function parseBackupManifest(raw) {
	let parsed;
	try {
		parsed = JSON.parse(raw);
	} catch (err) {
		throw new Error("Backup manifest is not valid JSON.", { cause: err });
	}
	if (!isRecord(parsed)) throw new Error("Backup manifest must be an object.");
	if (parsed.schemaVersion !== 1) throw new Error(`Unsupported backup manifest schemaVersion: ${String(parsed.schemaVersion)}`);
	if (typeof parsed.archiveRoot !== "string" || !parsed.archiveRoot.trim()) throw new Error("Backup manifest is missing archiveRoot.");
	if (typeof parsed.createdAt !== "string" || !parsed.createdAt.trim()) throw new Error("Backup manifest is missing createdAt.");
	if (!Array.isArray(parsed.assets)) throw new Error("Backup manifest is missing assets.");
	const assets = [];
	for (const asset of parsed.assets) {
		if (!isRecord(asset)) throw new Error("Backup manifest contains a non-object asset.");
		if (typeof asset.kind !== "string" || !asset.kind.trim()) throw new Error("Backup manifest asset is missing kind.");
		if (typeof asset.sourcePath !== "string" || !asset.sourcePath.trim()) throw new Error("Backup manifest asset is missing sourcePath.");
		if (typeof asset.archivePath !== "string" || !asset.archivePath.trim()) throw new Error("Backup manifest asset is missing archivePath.");
		assets.push({
			kind: asset.kind,
			sourcePath: asset.sourcePath,
			archivePath: asset.archivePath
		});
	}
	return {
		schemaVersion: 1,
		archiveRoot: parsed.archiveRoot,
		createdAt: parsed.createdAt,
		runtimeVersion: typeof parsed.runtimeVersion === "string" && parsed.runtimeVersion.trim() ? parsed.runtimeVersion : "unknown",
		platform: typeof parsed.platform === "string" ? parsed.platform : "unknown",
		nodeVersion: typeof parsed.nodeVersion === "string" ? parsed.nodeVersion : "unknown",
		paths: isRecord(parsed.paths) ? {
			...parsed.paths.stateDir === void 0 ? {} : { stateDir: parseBackupManifestSourcePath(parsed.paths.stateDir, "state directory") },
			agentRoots: parseBackupManifestAgentRoots(parsed.paths.agentRoots)
		} : void 0,
		assets
	};
}
function isRootBackupManifestEntry(entryPath) {
	const parts = entryPath.split("/");
	return parts.length === 2 && parts[0] !== "" && parts[1] === "manifest.json";
}
function verifyBackupManifestEntries(manifest, entries) {
	const archiveRoot = normalizeArchiveRoot(manifest.archiveRoot);
	const manifestEntryPath = path.posix.join(archiveRoot, "manifest.json");
	const normalizedEntries = [...entries];
	const normalizedEntrySet = new Set(normalizedEntries);
	if (!normalizedEntrySet.has(manifestEntryPath)) throw new Error(`Archive is missing manifest entry: ${manifestEntryPath}`);
	for (const entry of normalizedEntries) if (!isArchivePathWithin(entry, archiveRoot)) throw new Error(`Archive entry is outside the declared archive root: ${entry}`);
	const payloadRoot = path.posix.join(archiveRoot, "payload");
	for (const asset of manifest.assets) {
		const assetArchivePath = normalizeArchivePath(asset.archivePath, "Backup manifest asset path");
		if (!isArchivePathWithin(assetArchivePath, payloadRoot)) throw new Error(`Manifest asset path is outside payload root: ${asset.archivePath}`);
		const exact = normalizedEntrySet.has(assetArchivePath);
		const nested = normalizedEntries.some((entry) => entry !== assetArchivePath && isArchivePathWithin(entry, assetArchivePath));
		if (!exact && !nested) throw new Error(`Archive is missing payload for manifest asset: ${assetArchivePath}`);
	}
}
//#endregion
//#region src/commands/backup-verify.ts
const MAX_MANIFEST_BYTES = 1024 * 1024;
const MAX_SQLITE_SNAPSHOT_EXTRACT_BYTES = 64 * 1024 * 1024 * 1024;
const SQLITE_SNAPSHOT_FREE_SPACE_RESERVE_BYTES = 256 * 1024 * 1024;
async function listArchiveEntries(archivePath) {
	const entries = [];
	let invalidReason;
	await tar.t({
		file: archivePath,
		gzip: true,
		maxDecompressionRatio: BACKUP_MAX_DECOMPRESSION_RATIO,
		onwarn: (code, message) => {
			if (code === "TAR_BAD_ARCHIVE" && invalidReason === void 0) invalidReason = formatErrorMessage(message);
		},
		onReadEntry: (entry) => {
			entries.push({
				path: entry.path,
				...entry.linkpath ? { linkpath: entry.linkpath } : {},
				...Number.isSafeInteger(entry.size) && entry.size >= 0 ? { size: entry.size } : {},
				...entry.type ? { type: entry.type } : {}
			});
		}
	});
	return {
		entries,
		invalidReason
	};
}
async function extractManifest(params) {
	const limitError = /* @__PURE__ */ new Error(`Backup manifest exceeds ${MAX_MANIFEST_BYTES} byte limit.`);
	let manifestContentPromise;
	await tar.t({
		file: params.archivePath,
		gzip: true,
		maxDecompressionRatio: BACKUP_MAX_DECOMPRESSION_RATIO,
		filter: (entryPath) => entryPath === params.manifestEntryPath,
		onReadEntry: (entry) => {
			manifestContentPromise = entry.size > MAX_MANIFEST_BYTES ? Promise.resolve(limitError) : entry.concat().catch((error) => toStringifiedError(error));
		}
	});
	if (!manifestContentPromise) throw new Error(`Archive is missing manifest entry: ${params.manifestEntryPath}`);
	const content = await manifestContentPromise;
	if (content instanceof Error) throw content;
	return content.toString("utf8");
}
function verifyHardlinkTargetsAgainstArchiveRoot(hardlinkTargets, archiveRoot, entries) {
	const normalizedRoot = normalizeArchiveRoot(archiveRoot);
	for (const target of hardlinkTargets) {
		const normalizedTarget = isArchivePathWithin(target.normalized, normalizedRoot) ? target.normalized : path.posix.join(normalizedRoot, target.normalized);
		if (!isArchivePathWithin(normalizedTarget, normalizedRoot)) throw new Error(`Archive hardlink target is outside the declared archive root: ${target.entryPath} -> ${normalizedTarget}`);
		if (!entries.has(normalizedTarget)) throw new Error(`Archive hardlink target is missing from archive entries: ${target.entryPath} -> ${normalizedTarget}`);
	}
}
function formatResult(result) {
	return [
		`Backup archive OK: ${result.archivePath}`,
		`Archive root: ${result.archiveRoot}`,
		`Created at: ${result.createdAt}`,
		`Runtime version: ${result.runtimeVersion}`,
		`Assets verified: ${result.assetCount}`,
		`Archive entries scanned: ${result.entryCount}`,
		`Symbolic links checked: ${result.symlinkCount}`
	].join("\n");
}
function findDuplicateNormalizedEntryPath(entries) {
	const seen = /* @__PURE__ */ new Set();
	for (const entry of entries) {
		if (seen.has(entry.normalized)) return entry.normalized;
		seen.add(entry.normalized);
	}
}
function resolvePortableArchivePathKey(value) {
	return value.normalize("NFC").toLowerCase();
}
function findPortableArchiveEntryPathCollision(entries) {
	const seen = /* @__PURE__ */ new Map();
	for (const entry of entries) {
		const key = resolvePortableArchivePathKey(entry.normalized);
		const first = seen.get(key);
		if (first && first !== entry.normalized) return {
			first,
			second: entry.normalized
		};
		seen.set(key, entry.normalized);
	}
}
function isRegularArchiveFile(entryType) {
	return entryType === "File" || entryType === "OldFile" || entryType === "ContiguousFile";
}
function resolveCanonicalStateAssetRoot(manifest) {
	const stateAssets = manifest.assets.filter((asset) => asset.kind === "state");
	if (stateAssets.length === 0) return;
	if (stateAssets.length !== 1) throw new Error(`Backup manifest must contain at most one state asset; found ${stateAssets.length}.`);
	const stateAsset = stateAssets[0];
	if (!stateAsset) return;
	const stateAssetRoot = normalizeArchivePath(stateAsset.archivePath, "Backup manifest state asset path");
	if (stateAssetRoot !== buildBackupArchivePath(normalizeArchiveRoot(manifest.archiveRoot), stateAsset.sourcePath)) throw new Error("Backup manifest state asset archivePath does not match its sourcePath.");
	return stateAssetRoot;
}
function isSqliteSnapshotRelativePath(relativePath) {
	const portablePath = resolvePortableArchivePathKey(relativePath);
	if (!portablePath.endsWith(".sqlite")) return false;
	if (resolveExpectedSqliteRoleFromRelativePath(relativePath)) return true;
	return !portablePath.split("/").includes("node_modules") && !isTransientSqliteBackupPath(portablePath);
}
function resolveSqliteSnapshotSidecarDatabasePath(relativePath) {
	const portablePath = resolvePortableArchivePathKey(relativePath);
	for (const suffix of SQLITE_SIDECAR_SUFFIXES) if (portablePath.endsWith(suffix)) {
		const databasePath = relativePath.slice(0, -suffix.length);
		return isSqliteSnapshotRelativePath(databasePath) ? databasePath : void 0;
	}
}
function assertCanonicalSqlitePathCasing(relativePath, archivePath) {
	const segments = relativePath.split("/");
	const isGlobalAlias = resolvePortableArchivePathKey(relativePath) === "state/openclaw.sqlite" && relativePath !== "state/openclaw.sqlite";
	const isAgentAlias = segments.length === 4 && segments[0]?.toLowerCase() === "agents" && Boolean(segments[1]) && segments[2]?.toLowerCase() === "agent" && segments[3]?.toLowerCase() === "openclaw-agent.sqlite" && (segments[0] !== "agents" || segments[2] !== "agent" || segments[3] !== "openclaw-agent.sqlite");
	if (isGlobalAlias || isAgentAlias) throw new Error(`Backup contains a case-mangled canonical SQLite path: ${archivePath}`);
}
function listSqliteSnapshotEntries(manifest, entries) {
	const archiveRoot = normalizeArchiveRoot(manifest.archiveRoot);
	const roots = [...manifest.paths?.stateDir ? [{
		kind: "state",
		archiveRoot: buildBackupArchivePath(archiveRoot, manifest.paths.stateDir)
	}] : manifest.assets.filter((asset) => asset.kind === "state").map((asset) => ({
		kind: "state",
		archiveRoot: normalizeArchivePath(asset.archivePath, "Backup manifest state asset path")
	})), ...(manifest.paths?.agentRoots ?? []).map(({ agentId, sourcePath }) => ({
		kind: "agent",
		archiveRoot: buildBackupArchivePath(archiveRoot, sourcePath),
		agentId
	}))].map((root) => Object.assign(root, { portableArchiveRoot: resolvePortableArchivePathKey(root.archiveRoot) })).toSorted((left, right) => right.archiveRoot.length - left.archiveRoot.length);
	const sqliteEntries = [];
	for (const entry of entries) {
		const portableEntryPath = resolvePortableArchivePathKey(entry.normalized);
		const portableRoot = roots.find((root) => isArchivePathWithin(portableEntryPath, root.portableArchiveRoot));
		const sqliteRoot = roots.find((root) => isArchivePathWithin(entry.normalized, root.archiveRoot));
		if (portableRoot && portableRoot !== sqliteRoot) throw new Error(`Backup contains a case-mangled ${portableRoot.kind} asset path: ${entry.normalized}`);
		if (!sqliteRoot) continue;
		const relativePath = path.posix.relative(sqliteRoot.archiveRoot, entry.normalized);
		assertCanonicalSqlitePathCasing(relativePath, entry.normalized);
		if (sqliteRoot.kind === "agent" && resolvePortableArchivePathKey(relativePath) === "openclaw-agent.sqlite" && relativePath !== "openclaw-agent.sqlite") throw new Error(`Backup contains a case-mangled canonical SQLite path: ${entry.normalized}`);
		if (resolveSqliteSnapshotSidecarDatabasePath(relativePath)) throw new Error(`Backup contains a SQLite snapshot sidecar: ${entry.normalized}`);
		if (!isSqliteSnapshotRelativePath(relativePath)) continue;
		const candidate = {
			...entry,
			stateAssetRoot: sqliteRoot.archiveRoot,
			...sqliteRoot.kind === "agent" ? { agentId: sqliteRoot.agentId } : {}
		};
		if (resolveExpectedSqliteRole(candidate) || isRegularArchiveFile(entry.type)) sqliteEntries.push(candidate);
	}
	if (sqliteEntries.length > 0) resolveCanonicalStateAssetRoot(manifest);
	return sqliteEntries;
}
function resolveExpectedSqliteRole(entry) {
	const relativePath = path.posix.relative(entry.stateAssetRoot, entry.normalized);
	if (entry.agentId) return relativePath === "openclaw-agent.sqlite" ? "agent" : void 0;
	return resolveExpectedSqliteRoleFromRelativePath(relativePath);
}
function resolveExpectedSqliteRoleFromRelativePath(relativePath) {
	if (relativePath === "state/openclaw.sqlite") return "global";
	const segments = relativePath.split("/");
	if (segments.length === 4 && segments[0] === "agents" && segments[1] && segments[2] === "agent" && segments[3] === "openclaw-agent.sqlite") return "agent";
}
function resolveSqliteExtractionBytes(entries) {
	let totalBytes = 0;
	for (const entry of entries) {
		if (!Number.isSafeInteger(entry.size) || (entry.size ?? -1) < 0) throw new Error(`SQLite snapshot has an invalid archive size: ${entry.normalized}`);
		if (entry.size === 0) throw new Error(`SQLite snapshot is empty: ${entry.normalized}`);
		totalBytes += entry.size ?? 0;
		if (!Number.isSafeInteger(totalBytes)) throw new Error("SQLite snapshot extraction size exceeds the supported integer range.");
	}
	return totalBytes;
}
function assertSqliteExtractionBudget(params) {
	const totalBytes = resolveSqliteExtractionBytes(params.entries);
	if (totalBytes > MAX_SQLITE_SNAPSHOT_EXTRACT_BYTES) throw new Error(`SQLite snapshots require ${formatDiskSpaceBytes(totalBytes)} of extraction space; the verification limit is ${formatDiskSpaceBytes(MAX_SQLITE_SNAPSHOT_EXTRACT_BYTES)}.`);
	const diskSpace = (params.readDiskSpace ?? tryReadDiskSpace)(params.tempRoot);
	if (diskSpace && totalBytes + SQLITE_SNAPSHOT_FREE_SPACE_RESERVE_BYTES > diskSpace.availableBytes) throw new Error(`SQLite snapshots require ${formatDiskSpaceBytes(totalBytes)} of extraction space, but only ${formatDiskSpaceBytes(diskSpace.availableBytes)} is available near ${params.tempRoot}; verification reserves ${formatDiskSpaceBytes(SQLITE_SNAPSHOT_FREE_SPACE_RESERVE_BYTES)} for the host.`);
}
function assertExpectedSqliteRole(database, archivePath, expectedRole) {
	if (database.prepare("SELECT type FROM sqlite_schema WHERE name = 'schema_meta'").get()?.type !== "table") throw new Error(`SQLite snapshot ${archivePath} is missing the expected schema_meta table.`);
	const metadata = database.prepare("SELECT role FROM schema_meta WHERE meta_key = 'primary'").get();
	const actualRole = typeof metadata?.role === "string" ? metadata.role : "missing";
	if (actualRole !== expectedRole) throw new Error(`SQLite snapshot ${archivePath} has role ${actualRole}; expected ${expectedRole}.`);
}
async function assertSqliteSnapshotFileShape(extractedPath, archivePath, expectedSize) {
	const header = Buffer.alloc(100);
	const handle = await fs.open(extractedPath, "r");
	try {
		const { bytesRead } = await handle.read(header, 0, header.byteLength, 0);
		if (bytesRead !== header.byteLength || header.subarray(0, 16).toString("utf8") !== "SQLite format 3\0") throw new Error(`SQLite snapshot ${archivePath} has an invalid database header.`);
	} finally {
		await handle.close();
	}
	const encodedPageSize = header.readUInt16BE(16);
	const pageSize = encodedPageSize === 1 ? 65536 : encodedPageSize;
	if (!(pageSize >= 512 && pageSize <= 65536 && (pageSize & pageSize - 1) === 0) || expectedSize % pageSize !== 0) throw new Error(`SQLite snapshot ${archivePath} has an invalid page layout.`);
	const changeCounter = header.readUInt32BE(24);
	const declaredPageCount = header.readUInt32BE(28);
	const versionValidFor = header.readUInt32BE(92);
	if (declaredPageCount !== 0 && changeCounter === versionValidFor && declaredPageCount !== expectedSize / pageSize) throw new Error(`SQLite snapshot ${archivePath} has an invalid page layout.`);
}
async function verifySqliteSnapshots(params) {
	const sqliteEntries = listSqliteSnapshotEntries(params.manifest, params.entries);
	if (sqliteEntries.length === 0) return;
	for (const entry of sqliteEntries) if (!isRegularArchiveFile(entry.type)) throw new Error(`SQLite snapshot must be a regular archive file: ${entry.normalized}`);
	const tempRoot = os.tmpdir();
	assertSqliteExtractionBudget({
		entries: sqliteEntries,
		tempRoot
	});
	const tempDir = await fs.mkdtemp(path.join(tempRoot, "openclaw-backup-verify-sqlite-"));
	try {
		const sqliteEntriesByRawPath = new Map(sqliteEntries.map((entry) => [entry.raw, entry]));
		await tar.x({
			file: params.archivePath,
			gzip: true,
			maxDecompressionRatio: BACKUP_MAX_DECOMPRESSION_RATIO,
			cwd: tempDir,
			strict: true,
			preserveOwner: false,
			filter: (entryPath, archiveEntry) => {
				const expected = sqliteEntriesByRawPath.get(entryPath);
				if (!expected) return false;
				if (archiveEntry.size !== expected.size) throw new Error(`SQLite snapshot size changed during verification: ${entryPath}`);
				return true;
			}
		});
		for (const entry of sqliteEntries) {
			const extractedPath = path.join(tempDir, ...entry.normalized.split("/"));
			const extractedStat = await fs.lstat(extractedPath);
			if (!extractedStat.isFile()) throw new Error(`Extracted SQLite snapshot is not a regular file: ${entry.normalized}`);
			if (extractedStat.size !== entry.size) throw new Error(`Extracted SQLite snapshot size does not match archive: ${entry.normalized}`);
			let database;
			try {
				await assertSqliteSnapshotFileShape(extractedPath, entry.normalized, extractedStat.size);
				const expectedRole = resolveExpectedSqliteRole(entry);
				if (!expectedRole) continue;
				database = openNodeSqliteDatabase(extractedPath, {
					allowExtension: true,
					readOnly: true
				});
				database.exec("PRAGMA query_only = ON; PRAGMA trusted_schema = OFF;");
				await loadSqliteVecExtension({ db: database });
				assertSqliteIntegrity(database, entry.normalized);
				if (entry.agentId) assertOpenClawAgentDatabaseOwner(database, {
					agentId: entry.agentId,
					pathname: entry.normalized
				});
				else assertExpectedSqliteRole(database, entry.normalized, expectedRole);
			} catch (err) {
				const message = err instanceof Error ? err.message : String(err);
				throw new Error(`Backup SQLite snapshot failed verification: ${entry.normalized}. ${message}`, { cause: err });
			} finally {
				database?.close();
			}
		}
	} finally {
		await fs.rm(tempDir, {
			recursive: true,
			force: true
		});
	}
}
async function verifyResolvedBackupArchive(archivePath) {
	let archiveStat;
	try {
		archiveStat = await fs.stat(archivePath);
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) throw new Error("Archive does not exist. Check the path and run `openclaw backup verify <archive>` again.", { cause: error });
		throw new Error(`Archive could not be inspected. ${formatErrorMessage(error)} Check the path and file permissions, then try again.`, { cause: error });
	}
	if (!archiveStat.isFile()) throw new Error("Archive must be a regular file. Choose a backup archive created by `openclaw backup create` and try again.");
	const listing = await listArchiveEntries(archivePath).catch((error) => {
		throw new Error(`Archive could not be read or parsed. ${formatErrorMessage(error)} Check the file permissions and archive integrity, then try again.`);
	});
	if (listing.invalidReason) throw new Error(`Archive is not a valid OpenClaw backup. ${listing.invalidReason.replace(/[.!?]*$/u, ".")} Choose another archive or create a new one with \`openclaw backup create\`.`);
	const rawEntries = listing.entries;
	const entries = rawEntries.map((entry) => ({
		raw: entry.path,
		normalized: normalizeArchivePath(entry.path, "Archive entry"),
		...entry.size !== void 0 ? { size: entry.size } : {},
		...entry.type ? { type: entry.type } : {}
	}));
	const hardlinkTargets = rawEntries.filter((entry) => entry.type === "Link" && entry.linkpath).map((entry) => ({
		entryPath: entry.path,
		normalized: normalizeArchivePath(entry.linkpath ?? "", `Archive hardlink target for ${entry.path}`)
	}));
	const symbolicLinks = rawEntries.filter((entry) => entry.type === "SymbolicLink").map((entry) => ({
		entryPath: entry.path,
		linkpath: entry.linkpath
	}));
	const normalizedEntrySet = new Set(entries.map((entry) => entry.normalized));
	const manifestMatches = entries.filter((entry) => isRootBackupManifestEntry(entry.normalized));
	if (manifestMatches.length !== 1) throw new Error(`Expected exactly one backup manifest entry, found ${manifestMatches.length}.`);
	const duplicateEntryPath = findDuplicateNormalizedEntryPath(entries);
	if (duplicateEntryPath) throw new Error(`Archive contains duplicate entry path: ${duplicateEntryPath}`);
	const portablePathCollision = findPortableArchiveEntryPathCollision(entries);
	if (portablePathCollision) throw new Error(`Archive contains a portable path collision: ${portablePathCollision.first} and ${portablePathCollision.second}`);
	const manifestEntryPath = manifestMatches[0]?.raw;
	if (!manifestEntryPath) throw new Error("Backup archive manifest entry could not be resolved.");
	const manifest = parseBackupManifest(await extractManifest({
		archivePath,
		manifestEntryPath
	}));
	verifyBackupManifestEntries(manifest, normalizedEntrySet);
	verifyHardlinkTargetsAgainstArchiveRoot(hardlinkTargets, manifest.archiveRoot, normalizedEntrySet);
	for (const link of symbolicLinks) assertArchiveSymbolicLinkTarget({
		...link,
		archiveRoot: manifest.archiveRoot,
		assetArchivePaths: manifest.assets.map((asset) => asset.archivePath)
	});
	await verifySqliteSnapshots({
		archivePath,
		entries,
		manifest
	});
	return {
		ok: true,
		archivePath,
		archiveRoot: manifest.archiveRoot,
		createdAt: manifest.createdAt,
		runtimeVersion: manifest.runtimeVersion,
		assetCount: manifest.assets.length,
		entryCount: rawEntries.length,
		symlinkCount: symbolicLinks.length
	};
}
/** Verify a backup archive and return its normalized, integrity-checked inventory. */
async function verifyBackupArchive(archive) {
	const archivePath = resolveUserPath(archive);
	return await verifyResolvedBackupArchive(archivePath).catch((error) => {
		const detail = error instanceof Error ? error.message : formatErrorMessage(error);
		throw new Error(`Backup archive verification failed: ${archivePath}. ${detail}`);
	});
}
/** Verify a backup archive, including snapshot shape and canonical SQLite integrity checks. */
async function backupVerifyCommand(runtime, opts) {
	const result = await verifyBackupArchive(opts.archive);
	if (opts.json) writeRuntimeJson(runtime, result);
	else runtime.log(formatResult(result));
	return result;
}
const testApi = { assertSqliteExtractionBudget };
//#endregion
export { testApi as n, verifyBackupArchive as r, backupVerifyCommand as t };
