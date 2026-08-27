import { a as isPathInside, n as hasNodeErrorCode } from "./path-D138yf8v.js";
import "./fs-safe-C9N8pCh1.js";
import { c as resolveOpenedFileRealPathForHandle } from "./root-impl-YIsYOvqy.js";
import "./path-guards-fBZukd5S.js";
import { a as isDerivedWorkspacePath } from "./workspace-path-exclusions-DDdHI_3m.js";
import { createHash } from "node:crypto";
import { constants } from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/gateway/worker-environments/workspace-inventory-limits.ts
const MAX_WORKSPACE_INVENTORY_ENTRIES = 25e4;
const MAX_WORKSPACE_GIT_CANDIDATES = MAX_WORKSPACE_INVENTORY_ENTRIES * 4;
const MAX_WORKSPACE_INVENTORY_PATH_BYTES = 64 * 1024 * 1024;
const MAX_WORKSPACE_MANIFEST_BYTES = 64 * 1024 * 1024;
const MAX_WORKSPACE_INVENTORY_TOTAL_BYTES = 4 * 1024 * 1024 * 1024;
//#endregion
//#region src/gateway/worker-environments/workspace-manifest.ts
const MAX_RECONCILIATION_ENTRIES = 25e3;
const MAX_RECONCILIATION_FILE_BYTES = 64 * 1024 * 1024;
const MAX_RECONCILIATION_TOTAL_BYTES = 256 * 1024 * 1024;
const MANIFEST_REF_PATTERN = /^sha256:([a-f0-9]{64})$/u;
const GIT_COMMIT_PATTERN = /^[a-f0-9]{40}(?:[a-f0-9]{24})?$/u;
function manifestPath(value) {
	if (typeof value !== "string" || !value || value.includes("\\") || path.posix.isAbsolute(value) || path.posix.normalize(value) !== value || value === "." || value === ".." || value.startsWith("../")) throw new Error("Worker workspace manifest contains an unsafe path");
	return value;
}
function manifestMode(value) {
	if (!Number.isInteger(value) || value < 0 || value > 511) throw new Error("Worker workspace manifest contains an invalid mode");
	return value;
}
function gitFileMode(mode) {
	return (mode & 73) === 0 ? 420 : 493;
}
function compareManifestPaths(left, right) {
	return left.path < right.path ? -1 : left.path > right.path ? 1 : 0;
}
function parseRawEntry(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Worker workspace manifest contains an invalid entry");
	const entry = value;
	const entryPath = manifestPath(entry.path);
	const mode = manifestMode(entry.mode);
	if (entry.type === "directory") return {
		path: entryPath,
		type: "directory",
		mode
	};
	if (entry.type === "file") {
		if (!Number.isSafeInteger(entry.size) || entry.size < 0 || typeof entry.sha256 !== "string" || !/^[a-f0-9]{64}$/u.test(entry.sha256)) throw new Error("Worker workspace manifest contains invalid file metadata");
		return {
			path: entryPath,
			type: "file",
			mode: gitFileMode(mode),
			size: entry.size,
			sha256: entry.sha256
		};
	}
	if (entry.type === "symlink") {
		if (typeof entry.target !== "string" || !entry.target || entry.target.includes("\\") || path.posix.isAbsolute(entry.target) || path.win32.parse(entry.target).root !== "") throw new Error("Worker workspace manifest contains an unsafe symlink");
		const syntheticRoot = "/workspace";
		const resolved = path.posix.resolve(path.posix.dirname(`${syntheticRoot}/${entryPath}`), entry.target);
		if (resolved !== syntheticRoot && !resolved.startsWith(`${syntheticRoot}/`)) throw new Error("Worker workspace manifest symlink escapes its root");
		return {
			path: entryPath,
			type: "symlink",
			mode: 511,
			target: entry.target
		};
	}
	throw new Error("Worker workspace manifest contains an unsupported entry type");
}
function validateAndProjectEntries(values) {
	if (values.length > 25e4) throw new Error("Worker workspace manifest has too many entries");
	const rawEntries = values.map(parseRawEntry);
	let previous = "";
	let pathBytes = 0;
	let totalBytes = 0;
	const byPath = /* @__PURE__ */ new Map();
	for (const entry of rawEntries) {
		if (byPath.has(entry.path) || previous && previous >= entry.path) throw new Error("Worker workspace manifest paths are not unique and sorted");
		const segments = entry.path.split("/");
		for (let index = 1; index < segments.length; index += 1) if (byPath.get(segments.slice(0, index).join("/"))?.type !== "directory") throw new Error("Worker workspace manifest entry has a non-directory parent");
		pathBytes += Buffer.byteLength(entry.path);
		totalBytes += entry.type === "file" ? entry.size : entry.type === "symlink" ? Buffer.byteLength(entry.target) : 0;
		if (pathBytes > 67108864) throw new Error("Worker workspace manifest paths exceed their byte limit");
		if (totalBytes > 4294967296) throw new Error("Worker workspace manifest exceeds its eligible byte limit");
		byPath.set(entry.path, entry);
		previous = entry.path;
	}
	return {
		entries: rawEntries.filter((entry) => entry.type !== "directory" && !isDerivedWorkspacePath(entry.path)),
		directories: rawEntries.filter((entry) => entry.type === "directory" && !isDerivedWorkspacePath(entry.path)).map((entry) => entry.path)
	};
}
function serializeWorkerWorkspaceManifest(manifest) {
	const entries = [...(manifest.directories ?? []).filter((entryPath) => !isDerivedWorkspacePath(entryPath)).map((entryPath) => ({
		path: entryPath,
		type: "directory",
		mode: 448
	})), ...manifest.entries.filter((entry) => !isDerivedWorkspacePath(entry.path))].toSorted(compareManifestPaths);
	if (entries.length > 25e4) throw new Error("Worker workspace manifest has too many entries");
	let pathBytes = 0;
	let totalBytes = 0;
	let entryBytes = 0;
	const emptyBytes = Buffer.byteLength(JSON.stringify({
		version: manifest.version,
		baseCommit: manifest.baseCommit,
		entries: []
	}));
	for (const entry of entries) {
		pathBytes += Buffer.byteLength(entry.path);
		totalBytes += entry.type === "file" ? entry.size : entry.type === "symlink" ? Buffer.byteLength(entry.target) : 0;
		entryBytes += Buffer.byteLength(JSON.stringify(entry));
		if (pathBytes > 67108864) throw new Error("Worker workspace manifest paths exceed their byte limit");
		if (totalBytes > 4294967296) throw new Error("Worker workspace manifest exceeds its eligible byte limit");
		if (emptyBytes + entryBytes + Math.max(0, entries.length - 1) > 67108864) throw new Error("Worker workspace manifest exceeds the 64 MiB safety limit");
	}
	return JSON.stringify({
		version: manifest.version,
		baseCommit: manifest.baseCommit,
		entries
	});
}
function parseWorkerWorkspaceManifest(raw, expectedRef) {
	if (Buffer.byteLength(raw) > 67108864) throw new Error("Worker workspace manifest exceeds the 64 MiB safety limit");
	const match = MANIFEST_REF_PATTERN.exec(expectedRef);
	if (!match) throw new Error("Worker workspace manifest reference is invalid");
	if (createHash("sha256").update(raw).digest("hex") !== match[1]) throw new Error("Worker workspace manifest digest does not match its reference");
	const value = JSON.parse(raw);
	if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Worker workspace manifest is invalid");
	const manifest = value;
	if (manifest.version !== 1 || manifest.baseCommit !== null && (typeof manifest.baseCommit !== "string" || !GIT_COMMIT_PATTERN.test(manifest.baseCommit)) || !Array.isArray(manifest.entries)) throw new Error("Worker workspace manifest has an unsupported shape");
	return {
		version: 1,
		baseCommit: manifest.baseCommit,
		...validateAndProjectEntries(manifest.entries)
	};
}
function parseJournalEntry(value) {
	const entry = parseRawEntry(value);
	if (entry.type === "directory") throw new Error("Worker workspace reconciliation journal contains a directory entry");
	return entry;
}
function serializeWorkerWorkspaceReconciliationPlan(journal) {
	return JSON.stringify({
		version: journal.version,
		temporaryNonce: journal.temporaryNonce,
		baseManifestRef: journal.baseManifestRef,
		currentManifestRef: journal.currentManifestRef,
		baseEntries: journal.baseEntries,
		appliedEntries: journal.appliedEntries,
		baseDirectories: journal.baseDirectories ?? [],
		appliedDirectories: journal.appliedDirectories ?? [],
		appliedManifestRef: journal.appliedManifestRef,
		baseTree: journal.baseTree,
		basePackSha256: journal.basePackSha256
	});
}
function parseWorkerWorkspaceReconciliationPlan(raw) {
	const value = JSON.parse(raw);
	if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Worker workspace reconciliation journal is invalid");
	const plan = value;
	if (plan.version !== 1 || typeof plan.temporaryNonce !== "string" || !/^[a-f0-9]{32}$/u.test(plan.temporaryNonce) || typeof plan.baseManifestRef !== "string" || !MANIFEST_REF_PATTERN.test(plan.baseManifestRef) || typeof plan.currentManifestRef !== "string" || !MANIFEST_REF_PATTERN.test(plan.currentManifestRef) || typeof plan.baseTree !== "string" || !/^[a-f0-9]{40}$/u.test(plan.baseTree) || typeof plan.basePackSha256 !== "string" || !/^[a-f0-9]{64}$/u.test(plan.basePackSha256) || !Array.isArray(plan.baseEntries) || !Array.isArray(plan.appliedEntries) || plan.baseDirectories !== void 0 && !Array.isArray(plan.baseDirectories) || plan.appliedDirectories !== void 0 && !Array.isArray(plan.appliedDirectories) || plan.appliedManifestRef !== void 0 && (typeof plan.appliedManifestRef !== "string" || !MANIFEST_REF_PATTERN.test(plan.appliedManifestRef)) || plan.baseEntries.length + plan.appliedEntries.length + (plan.baseDirectories?.length ?? 0) + (plan.appliedDirectories?.length ?? 0) > 25e3) throw new Error("Worker workspace reconciliation journal has an unsupported shape");
	const baseEntries = plan.baseEntries.map(parseJournalEntry);
	const appliedEntries = plan.appliedEntries.map(parseJournalEntry);
	const baseDirectories = (plan.baseDirectories ?? []).map(manifestPath);
	const appliedDirectories = (plan.appliedDirectories ?? []).map(manifestPath);
	for (const entries of [baseEntries, appliedEntries]) {
		const paths = entries.map((entry) => entry.path);
		if (new Set(paths).size !== paths.length) throw new Error("Worker workspace reconciliation journal has duplicate paths");
	}
	for (const directories of [baseDirectories, appliedDirectories]) if (new Set(directories).size !== directories.length) throw new Error("Worker workspace reconciliation journal has duplicate directories");
	return {
		version: 1,
		temporaryNonce: plan.temporaryNonce,
		baseManifestRef: plan.baseManifestRef,
		currentManifestRef: plan.currentManifestRef,
		baseEntries,
		appliedEntries,
		baseDirectories,
		appliedDirectories,
		appliedManifestRef: plan.appliedManifestRef,
		baseTree: plan.baseTree,
		basePackSha256: plan.basePackSha256
	};
}
//#endregion
//#region src/gateway/worker-environments/workspace-hash-memo.ts
const MAX_WORKSPACE_HASH_MEMO_BYTES = 8 * 1024 * 1024;
const workspaceHashContext = new AsyncLocalStorage();
function createWorkspaceReconcileMetrics() {
	return {
		gateway: {
			contentHashCount: 0,
			contentHashDurationMs: 0,
			memoHitCount: 0
		},
		remoteManifestCalls: 0,
		remoteContentHashCount: 0,
		remoteMemoHitCount: 0,
		remoteHashDurationMs: 0,
		remoteManifestDurationMs: 0,
		remoteManifestWallDurationMs: 0,
		localReconciliationDurationMs: 0
	};
}
function activeWorkspaceHashContext() {
	return workspaceHashContext.getStore();
}
async function withWorkspaceHashMemo(memo, operation, metrics) {
	const active = workspaceHashContext.getStore();
	const inheritedMetrics = metrics ?? active?.metrics;
	if (active?.memo === memo && active.metrics === inheritedMetrics) return await operation();
	return await workspaceHashContext.run({
		memo,
		metrics: inheritedMetrics
	}, operation);
}
async function withWorkspaceHashContext(operation) {
	const active = workspaceHashContext.getStore();
	return await withWorkspaceHashMemo(active?.memo ?? /* @__PURE__ */ new Map(), operation, active?.metrics);
}
function serializeRemoteWorkspaceHashMemo(memo) {
	const serialized = JSON.stringify([...memo].filter(([identity]) => identity.startsWith("worker:")).toSorted(([left], [right]) => left.localeCompare(right)));
	if (Buffer.byteLength(serialized) > 8388608) throw new Error("Workspace hash memo exceeds its byte limit");
	return serialized;
}
function recordRemoteWorkspaceHashMetrics(aggregate, metrics) {
	aggregate.remoteContentHashCount += metrics.contentHashCount;
	aggregate.remoteMemoHitCount += metrics.memoHitCount;
	aggregate.remoteHashDurationMs += metrics.contentHashDurationMs;
	aggregate.remoteManifestDurationMs += metrics.totalDurationMs;
}
async function measureLocalWorkspaceReconciliation(metrics, operation) {
	const startedAt = performance.now();
	try {
		return await operation();
	} finally {
		metrics.localReconciliationDurationMs += performance.now() - startedAt;
	}
}
function workspaceStatIdentity(owner, stats) {
	return `${owner}:${stats.dev}:${stats.ino}:${stats.size}:${stats.mtimeNs}:${stats.ctimeNs}`;
}
//#endregion
//#region src/gateway/worker-environments/workspace-actual-manifest.ts
function localPath(root, relative) {
	return path.join(root, ...relative.split("/"));
}
function isPortableRootContainedSymlink(root, entryPath, target) {
	if (!target || target.includes("\\") || path.posix.isAbsolute(target) || path.win32.parse(target).root !== "") return false;
	const resolved = path.resolve(path.dirname(localPath(root, entryPath)), target);
	return resolved === root || resolved.startsWith(`${root}${path.sep}`);
}
async function readWorkspaceFileSnapshotWithLimit(expectedPath, maxBytes, root) {
	const handle = await fs$1.open(expectedPath, constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK);
	try {
		const { memo: hashMemo, metrics } = activeWorkspaceHashContext() ?? {};
		const before = await handle.stat({ bigint: true });
		const realPath = await resolveOpenedFileRealPathForHandle(handle, expectedPath);
		if (!before.isFile() || root && !isPathInside(root, realPath)) throw new Error("Gateway workspace file changed while it was being read");
		if (before.size > BigInt(maxBytes)) return { type: "unsupported" };
		const identity = workspaceStatIdentity("gateway", before);
		let sha256 = hashMemo?.get(identity);
		let size = Number(before.size);
		if (sha256) {
			if (metrics) metrics.memoHitCount += 1;
		} else {
			const hashStartedAt = performance.now();
			const hash = createHash("sha256");
			const buffer = Buffer.allocUnsafe(64 * 1024);
			size = 0;
			for (;;) {
				const { bytesRead } = await handle.read(buffer, 0, buffer.length, size);
				if (bytesRead === 0) break;
				size += bytesRead;
				if (size > maxBytes) return { type: "unsupported" };
				hash.update(buffer.subarray(0, bytesRead));
			}
			sha256 = hash.digest("hex");
			if (metrics) {
				metrics.contentHashCount += 1;
				metrics.contentHashDurationMs += performance.now() - hashStartedAt;
			}
		}
		const after = await handle.stat({ bigint: true });
		if (after.size !== BigInt(size) || workspaceStatIdentity("gateway", after) !== identity) throw new Error("Gateway workspace file changed while it was being read");
		hashMemo?.set(identity, sha256);
		return {
			type: "file",
			mode: gitFileMode(Number(after.mode & 511n)),
			size,
			sha256
		};
	} finally {
		await handle.close();
	}
}
async function readActualWorkspaceManifestImpl(params) {
	const root = await fs$1.realpath(params.root);
	const rawEntries = [];
	let totalBytes = 0;
	let manifestPathBytes = 0;
	let traversedEntries = 0;
	let traversedPathBytes = 0;
	const addEntry = (entry, bytes = 0) => {
		totalBytes += bytes;
		if (totalBytes > 4294967296) throw new Error("Gateway workspace manifest exceeds its eligible byte limit");
		manifestPathBytes += Buffer.byteLength(entry.path);
		if (manifestPathBytes > 67108864) throw new Error("Gateway workspace manifest paths exceed their byte limit");
		rawEntries.push(entry);
		if (rawEntries.length > 25e4) throw new Error("Gateway workspace manifest has too many entries");
	};
	const checkTraversal = (relative) => {
		traversedEntries += 1;
		traversedPathBytes += Buffer.byteLength(relative);
		if (traversedEntries > 25e4) throw new Error("Gateway workspace manifest has too many entries");
		if (traversedPathBytes > 67108864) throw new Error("Gateway workspace manifest paths exceed their byte limit");
	};
	const addFile = async (relative) => {
		const snapshot = await readWorkspaceFileSnapshotWithLimit(localPath(root, relative), MAX_WORKSPACE_INVENTORY_TOTAL_BYTES - totalBytes, root);
		if (snapshot.type === "file") {
			addEntry({
				path: relative,
				type: "file",
				mode: snapshot.mode,
				size: snapshot.size,
				sha256: snapshot.sha256
			}, snapshot.size);
			return;
		}
		throw new Error("Gateway workspace manifest exceeds its eligible byte limit");
	};
	const addIncludedPath = async (relative, includedNodes, derivedOnlyDirectories) => {
		if (isDerivedWorkspacePath(relative)) return "derived-only";
		checkTraversal(relative);
		const absolute = localPath(root, relative);
		const stats = await fs$1.lstat(absolute).catch((error) => {
			if (hasNodeErrorCode(error, "ENOENT") || hasNodeErrorCode(error, "ENOTDIR")) return;
			throw error;
		});
		if (!stats) return "absent";
		if (stats.isDirectory() && !stats.isSymbolicLink()) {
			if (params.preserveDirectories?.has(relative)) {
				addEntry({
					path: relative,
					type: "directory",
					mode: stats.mode & 511
				});
				return "included";
			}
			let hasDerivedEntry = false;
			let hasIncludedEntry = false;
			for await (const entry of await fs$1.opendir(absolute)) {
				const child = `${relative}/${entry.name}`;
				if (isDerivedWorkspacePath(child) || derivedOnlyDirectories.has(child)) hasDerivedEntry = true;
				else if (includedNodes.has(child)) hasIncludedEntry = true;
			}
			if (hasIncludedEntry || !hasDerivedEntry) {
				addEntry({
					path: relative,
					type: "directory",
					mode: stats.mode & 511
				});
				return "included";
			}
			return "derived-only";
		}
		if (stats.isSymbolicLink()) {
			const target = await fs$1.readlink(absolute);
			if (isPortableRootContainedSymlink(root, relative, target)) {
				addEntry({
					path: relative,
					type: "symlink",
					mode: 511,
					target
				}, Buffer.byteLength(target));
				return "included";
			}
			return "absent";
		}
		if (stats.isFile()) {
			await addFile(relative);
			return "included";
		}
		return "absent";
	};
	const walk = async (relativeDirectory) => {
		const absoluteDirectory = relativeDirectory ? localPath(root, relativeDirectory) : root;
		let hasDerivedEntry = false;
		let hasNonDerivedEntry = false;
		for await (const directoryEntry of await fs$1.opendir(absoluteDirectory)) {
			const name = directoryEntry.name;
			const relative = relativeDirectory ? `${relativeDirectory}/${name}` : name;
			checkTraversal(relative);
			if (!relativeDirectory && name === ".git") continue;
			if (isDerivedWorkspacePath(relative)) {
				hasDerivedEntry = true;
				continue;
			}
			const absolute = localPath(root, relative);
			const stats = await fs$1.lstat(absolute);
			if (stats.isDirectory() && !stats.isSymbolicLink()) {
				const child = await walk(relative);
				if (child.included || params.preserveDirectories?.has(relative)) {
					addEntry({
						path: relative,
						type: "directory",
						mode: stats.mode & 511
					});
					hasNonDerivedEntry = true;
				} else hasDerivedEntry ||= child.hasDerivedEntry;
			} else if (stats.isSymbolicLink()) {
				hasNonDerivedEntry = true;
				const target = await fs$1.readlink(absolute);
				if (!isPortableRootContainedSymlink(root, relative, target)) continue;
				addEntry({
					path: relative,
					type: "symlink",
					mode: 511,
					target
				}, Buffer.byteLength(target));
			} else if (stats.isFile()) {
				hasNonDerivedEntry = true;
				await addFile(relative);
			} else {
				hasNonDerivedEntry = true;
				continue;
			}
		}
		return {
			hasDerivedEntry,
			included: hasNonDerivedEntry || !hasDerivedEntry
		};
	};
	if (params.includePaths) {
		const includedNodes = /* @__PURE__ */ new Set();
		const derivedOnlyDirectories = /* @__PURE__ */ new Set();
		const paths = [...params.includePaths].map((relative) => ({
			relative,
			depth: relative.split("/").length
		})).toSorted((left, right) => right.depth - left.depth || left.relative.localeCompare(right.relative));
		for (const { relative } of paths) {
			const state = await addIncludedPath(relative, includedNodes, derivedOnlyDirectories);
			if (state === "included") includedNodes.add(relative);
			else if (state === "derived-only") derivedOnlyDirectories.add(relative);
		}
	} else await walk("");
	const directories = rawEntries.filter((entry) => entry.type === "directory").toSorted((left, right) => left.path.localeCompare(right.path));
	const manifest = {
		version: 1,
		baseCommit: params.baseCommit,
		entries: rawEntries.filter((entry) => entry.type !== "directory").toSorted((left, right) => left.path.localeCompare(right.path)),
		directories: directories.map((entry) => entry.path)
	};
	const raw = serializeWorkerWorkspaceManifest(manifest);
	return {
		manifestRef: `sha256:${createHash("sha256").update(raw).digest("hex")}`,
		manifest
	};
}
//#endregion
export { MAX_WORKSPACE_INVENTORY_PATH_BYTES as C, MAX_WORKSPACE_INVENTORY_ENTRIES as S, MAX_WORKSPACE_MANIFEST_BYTES as T, parseWorkerWorkspaceManifest as _, activeWorkspaceHashContext as a, serializeWorkerWorkspaceReconciliationPlan as b, recordRemoteWorkspaceHashMetrics as c, withWorkspaceHashMemo as d, workspaceStatIdentity as f, gitFileMode as g, MAX_RECONCILIATION_TOTAL_BYTES as h, MAX_WORKSPACE_HASH_MEMO_BYTES as i, serializeRemoteWorkspaceHashMemo as l, MAX_RECONCILIATION_FILE_BYTES as m, readActualWorkspaceManifestImpl as n, createWorkspaceReconcileMetrics as o, MAX_RECONCILIATION_ENTRIES as p, readWorkspaceFileSnapshotWithLimit as r, measureLocalWorkspaceReconciliation as s, isPortableRootContainedSymlink as t, withWorkspaceHashContext as u, parseWorkerWorkspaceReconciliationPlan as v, MAX_WORKSPACE_INVENTORY_TOTAL_BYTES as w, MAX_WORKSPACE_GIT_CANDIDATES as x, serializeWorkerWorkspaceManifest as y };
