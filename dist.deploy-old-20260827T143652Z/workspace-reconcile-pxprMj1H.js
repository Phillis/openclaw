import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { t as FsSafeError } from "./errors-CQDiIdj7.js";
import { n as hasNodeErrorCode } from "./path-D138yf8v.js";
import { r as root } from "./fs-safe-C9N8pCh1.js";
import "./path-guards-fBZukd5S.js";
import { r as runCommandWithTimeout, t as runCommandBuffered } from "./exec-BL80Wdzl.js";
import { a as isDerivedWorkspacePath } from "./workspace-path-exclusions-DDdHI_3m.js";
import { a as activeWorkspaceHashContext, d as withWorkspaceHashMemo, h as MAX_RECONCILIATION_TOTAL_BYTES, m as MAX_RECONCILIATION_FILE_BYTES, n as readActualWorkspaceManifestImpl, p as MAX_RECONCILIATION_ENTRIES, r as readWorkspaceFileSnapshotWithLimit, u as withWorkspaceHashContext } from "./workspace-actual-manifest-B7ccel6H.js";
import { createHash, randomBytes } from "node:crypto";
import os from "node:os";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/gateway/worker-environments/workspace-reconcile-derived-paths.ts
function reconciliationEntries(entries) {
	return entries.filter((entry) => !isDerivedWorkspacePath(entry.path));
}
function reconciliationDirectories(directories) {
	return (directories ?? []).filter((directory) => !isDerivedWorkspacePath(directory));
}
function localPath$1(root, relative) {
	return path.join(root, ...relative.split("/"));
}
async function removeDerivedWorkspaceDescendants(root, relativeDirectory) {
	for (const entry of await root.list(relativeDirectory, { withFileTypes: true })) {
		const child = relativeDirectory ? `${relativeDirectory}/${entry.name}` : entry.name;
		if (isDerivedWorkspacePath(child)) {
			await removeDerivedWorkspaceEntry(root, child, entry.isDirectory);
			continue;
		}
		if (entry.isDirectory) {
			await removeDerivedWorkspaceDescendants(root, child);
			if ((await root.list(child)).length === 0) await root.remove(child);
		}
	}
}
async function removeDerivedWorkspaceEntry(root, relativePath, isDirectory) {
	if (isDirectory) {
		let entries;
		try {
			entries = await root.list(relativePath, { withFileTypes: true });
		} catch (error) {
			if (!(error instanceof FsSafeError) || !["not-found", "path-alias"].includes(error.code)) throw error;
			entries = void 0;
		}
		for (const entry of entries ?? []) await removeDerivedWorkspaceEntry(root, `${relativePath}/${entry.name}`, entry.isDirectory);
	}
	await root.remove(relativePath).catch((error) => {
		if (!(error instanceof FsSafeError) || error.code !== "not-found") throw error;
	});
}
async function hasWorkspaceSymlinkAncestor(root, relativePath) {
	const segments = relativePath.split("/");
	for (let index = 1; index < segments.length; index += 1) if ((await fs.lstat(localPath$1(root, segments.slice(0, index).join("/"))).catch(() => void 0))?.isSymbolicLink()) return true;
	return false;
}
async function prepareNonDirectoryTargets(root$1, entries) {
	const workspaceRoot = await root(root$1);
	for (const entry of reconciliationEntries(entries)) {
		if (await hasWorkspaceSymlinkAncestor(root$1, entry.path)) continue;
		let stats;
		try {
			stats = await workspaceRoot.stat(entry.path);
		} catch (error) {
			if (error instanceof FsSafeError && ["not-found", "path-alias"].includes(error.code)) continue;
			throw error;
		}
		if (stats.isDirectory) {
			await removeDerivedWorkspaceDescendants(workspaceRoot, entry.path);
			if ((await workspaceRoot.list(entry.path)).length === 0) await workspaceRoot.remove(entry.path);
		}
	}
}
//#endregion
//#region src/gateway/worker-environments/workspace-reconcile-fs.ts
const PATCH_TIMEOUT_MS$1 = 10 * 6e4;
function localPath(root, relative) {
	return path.join(root, ...relative.split("/"));
}
async function readWorkspaceFileSnapshot(root, entryPath) {
	return await readWorkspaceFileSnapshotWithLimit(localPath(root, entryPath), MAX_RECONCILIATION_FILE_BYTES, root);
}
async function readAbsoluteFileSnapshot(absolute) {
	return await readWorkspaceFileSnapshotWithLimit(absolute, MAX_RECONCILIATION_FILE_BYTES);
}
async function absoluteEntryMatches(absolute, entry) {
	const stats = await fs.lstat(absolute).catch(() => void 0);
	if (!stats) return false;
	if (entry.type === "symlink") return stats.isSymbolicLink() && await fs.readlink(absolute) === entry.target;
	if (!stats.isFile() || stats.isSymbolicLink()) return false;
	const snapshot = await readAbsoluteFileSnapshot(absolute).catch(() => void 0);
	return snapshot?.type === "file" && snapshot.mode === entry.mode && snapshot.size === entry.size && snapshot.sha256 === entry.sha256;
}
async function entryMatches(root, entry) {
	if (entry.type === "symlink") return await absoluteEntryMatches(localPath(root, entry.path), entry);
	const snapshot = await readWorkspaceFileSnapshot(root, entry.path).catch(() => void 0);
	return snapshot?.type === "file" && snapshot.mode === entry.mode && snapshot.size === entry.size && snapshot.sha256 === entry.sha256;
}
async function readWorkspaceTreeFile(params) {
	const listed = await runCommandBuffered([
		"git",
		"--literal-pathspecs",
		"-C",
		params.repositoryRoot,
		"ls-tree",
		"-z",
		"--full-tree",
		params.tree,
		"--",
		params.entry.path
	], {
		timeoutMs: PATCH_TIMEOUT_MS$1,
		maxOutputBytes: 1024 * 1024
	});
	if (listed.termination !== "exit" || listed.code !== 0) throw new Error(listed.stderr.toString("utf8").trim() || "git ls-tree failed");
	const record = listed.stdout;
	const terminator = record.indexOf(0);
	const separator = record.indexOf(9);
	if (terminator !== record.byteLength - 1 || separator < 0 || separator > terminator) throw new Error(`Cloud workspace recovery snapshot is missing: ${params.entry.path}`);
	const metadata = record.subarray(0, separator).toString("utf8");
	const match = /^100(?:644|755) blob ([a-f0-9]{40})$/u.exec(metadata);
	const listedPath = record.subarray(separator + 1, terminator);
	if (!match || !listedPath.equals(Buffer.from(params.entry.path))) throw new Error(`Cloud workspace recovery snapshot is invalid: ${params.entry.path}`);
	const blob = await runCommandBuffered([
		"git",
		"-C",
		params.repositoryRoot,
		"cat-file",
		"blob",
		match[1]
	], {
		timeoutMs: PATCH_TIMEOUT_MS$1,
		maxOutputBytes: MAX_RECONCILIATION_FILE_BYTES + 1
	});
	if (blob.termination !== "exit" || blob.code !== 0) throw new Error(blob.stderr.toString("utf8").trim() || "git cat-file failed");
	return blob.stdout;
}
async function directoryContainsOnlyJournalPaths(root, directory, paths, directories) {
	for (const name of await fs.readdir(localPath(root, directory))) {
		const child = `${directory}/${name}`;
		if (isDerivedWorkspacePath(child)) continue;
		const stats = await fs.lstat(localPath(root, child));
		if (stats.isDirectory() && !stats.isSymbolicLink()) {
			if (!directories.has(child) && !await directoryContainsOnlyDerivedWorkspaceEntries(root, child)) return false;
			if (directories.has(child) && !await directoryContainsOnlyJournalPaths(root, child, paths, directories)) return false;
		} else if (!paths.has(child)) return false;
	}
	return true;
}
async function directoryContainsOnlyDerivedWorkspaceEntries(root, directory) {
	const names = await fs.readdir(localPath(root, directory));
	let foundDerivedEntry = false;
	for (const name of names) {
		const child = `${directory}/${name}`;
		if (isDerivedWorkspacePath(child)) {
			foundDerivedEntry = true;
			continue;
		}
		const stats = await fs.lstat(localPath(root, child));
		if (!stats.isDirectory() || stats.isSymbolicLink() || !await directoryContainsOnlyDerivedWorkspaceEntries(root, child)) return false;
		foundDerivedEntry = true;
	}
	return foundDerivedEntry;
}
async function clearTemporaryWorkspace(repositoryRoot) {
	for (const name of await fs.readdir(repositoryRoot)) if (name !== ".git") await fs.rm(path.join(repositoryRoot, name), {
		recursive: true,
		force: true
	});
}
//#endregion
//#region src/gateway/worker-environments/workspace-reconcile-core.ts
const MAX_RECONCILIATION_PATH_BYTES = 64 * 1024 * 1024;
var ConcurrentWorkspacePathError = class extends Error {};
async function assertWorkspaceMatchesManifest(params) {
	const root = await fs.realpath(params.root);
	const expectedNodes = params.entries ? reconciliationEntries(params.entries) : [...manifestNodes(params.manifest).values()].filter((entry) => entry !== void 0);
	for (const entry of expectedNodes) if (!(entry.type === "file" || entry.type === "symlink" ? await entryMatches(root, entry) : sameEntry(await localWorkspaceNode(root, entry.path), entry))) throw new ConcurrentWorkspacePathError(`Gateway workspace changed after cloud dispatch: ${entry.path}`);
}
function sameEntry(left, right) {
	return JSON.stringify(left) === JSON.stringify(right);
}
function manifestNodes(manifest) {
	return new Map([...reconciliationDirectories(manifest.directories).map((entryPath) => [entryPath, {
		path: entryPath,
		type: "directory"
	}]), ...reconciliationEntries(manifest.entries).map((entry) => [entry.path, entry])]);
}
function hasPathAncestor(paths, entryPath) {
	const segments = entryPath.split("/");
	for (let index = 1; index < segments.length; index += 1) if (paths.has(segments.slice(0, index).join("/"))) return true;
	return false;
}
async function localWorkspaceNode(root, entryPath) {
	const absolute = localPath(root, entryPath);
	const stats = await fs.lstat(absolute).catch((error) => {
		if (hasNodeErrorCode(error, "ENOENT") || hasNodeErrorCode(error, "ENOTDIR")) return;
		throw error;
	});
	if (!stats) return;
	if (stats.isDirectory() && !stats.isSymbolicLink()) return {
		path: entryPath,
		type: "directory"
	};
	if (stats.isSymbolicLink()) return {
		path: entryPath,
		type: "symlink",
		mode: 511,
		target: await fs.readlink(absolute)
	};
	if (!stats.isFile()) return {
		path: entryPath,
		type: "unsupported"
	};
	const snapshot = await readWorkspaceFileSnapshot(root, entryPath);
	if (snapshot.type === "unsupported") return {
		path: entryPath,
		type: "unsupported"
	};
	return {
		path: entryPath,
		type: "file",
		mode: snapshot.mode,
		size: snapshot.size,
		sha256: snapshot.sha256
	};
}
async function localWorkspaceDescendantPaths(root, entryPaths) {
	const paths = [];
	const pending = [...entryPaths];
	let pathBytes = 0;
	let enumeratedEntries = 0;
	while (pending.length > 0) {
		const directory = pending.pop();
		const names = [];
		for await (const entry of await fs.opendir(localPath(root, directory))) {
			names.push(entry.name);
			enumeratedEntries += 1;
			if (enumeratedEntries > 25e3) throw new Error("Gateway workspace manifest has too many entries");
		}
		for (const name of names.toSorted()) {
			const childPath = `${directory}/${name}`;
			pathBytes += Buffer.byteLength(childPath);
			if (pathBytes > MAX_RECONCILIATION_PATH_BYTES) throw new Error("Gateway workspace manifest paths exceed their byte limit");
			if (isDerivedWorkspacePath(childPath)) continue;
			paths.push(childPath);
			const stats = await fs.lstat(localPath(root, childPath));
			if (stats.isDirectory() && !stats.isSymbolicLink()) pending.push(childPath);
		}
	}
	return paths;
}
async function readActualWorkspaceManifest(params) {
	return await readActualWorkspaceManifestImpl(params);
}
async function inspectAcceptedWorkerWorkspace(params) {
	const root = await fs.realpath(params.root);
	const { memo: hashMemo, metrics } = activeWorkspaceHashContext() ?? {};
	const preserveDirectories = new Set(reconciliationDirectories(params.current.directories));
	const includePaths = params.current.baseCommit ? /* @__PURE__ */ new Set([...manifestNodes(params.base).keys(), ...manifestNodes(params.current).keys()]) : void 0;
	const actual = await readActualWorkspaceManifest({
		root,
		baseCommit: params.current.baseCommit,
		preserveDirectories,
		includePaths
	});
	if (actual.manifestRef !== params.expectedManifestRef && !params.allowAdvancedLocalState) return;
	const preflight = await preflightWorkspaceApply({
		root,
		base: params.base,
		current: params.current
	});
	const conflictPaths = params.allowAdvancedLocalState ? retainedConflictPaths(preflight) : preflight.conflictPaths;
	const verifyLocalStable = async () => await assertActualWorkspaceManifest({
		root,
		expectedRef: actual.manifestRef,
		baseCommit: actual.manifest.baseCommit,
		preserveDirectories,
		includePaths
	});
	return {
		...actual,
		conflictPaths,
		verifyLocalStable: async () => hashMemo ? await withWorkspaceHashMemo(hashMemo, verifyLocalStable, metrics) : await verifyLocalStable()
	};
}
async function assertActualWorkspaceManifest(params) {
	if ((await readActualWorkspaceManifest(params)).manifestRef !== params.expectedRef) throw new ConcurrentWorkspacePathError("Gateway workspace changed after cloud reconciliation");
}
function changedPaths(base, current) {
	const baseByPath = manifestNodes(base);
	const currentByPath = manifestNodes(current);
	return new Set([.../* @__PURE__ */ new Set([...baseByPath.keys(), ...currentByPath.keys()])].filter((entryPath) => !sameEntry(baseByPath.get(entryPath), currentByPath.get(entryPath))));
}
async function applyWorkspaceDirectoryChanges(params) {
	const workspaceRoot = await root(params.root, { mode: 448 });
	const baseNodes = manifestNodes(params.base);
	const currentNodes = manifestNodes(params.current);
	const directoryPaths = [...params.applyPaths].filter((entryPath) => baseNodes.get(entryPath)?.type === "directory" || currentNodes.get(entryPath)?.type === "directory");
	for (const entryPath of directoryPaths.toSorted()) if (currentNodes.get(entryPath)?.type === "directory") await workspaceRoot.mkdir(entryPath);
	const removedDirectoryPaths = directoryPaths.filter((entryPath) => baseNodes.get(entryPath)?.type === "directory" && !currentNodes.has(entryPath));
	for (const entryPath of removedDirectoryPaths.toSorted((left, right) => right.localeCompare(left))) {
		const baseDirectory = baseNodes.get(entryPath);
		let directoryState;
		try {
			directoryState = await workspaceRoot.stat(entryPath);
		} catch (error) {
			if (error instanceof FsSafeError && ["not-found", "path-alias"].includes(error.code)) continue;
			throw error;
		}
		if (!directoryState.isDirectory || baseDirectory?.type !== "directory") continue;
		let children;
		try {
			children = await workspaceRoot.list(entryPath);
		} catch (error) {
			if (error instanceof FsSafeError && ["not-found", "path-alias"].includes(error.code)) continue;
			throw error;
		}
		if (children.length > 0) continue;
		try {
			await workspaceRoot.remove(entryPath);
		} catch (error) {
			if (error instanceof FsSafeError && ["not-found", "path-alias"].includes(error.code)) continue;
			if ((await workspaceRoot.list(entryPath).catch(() => void 0))?.length) continue;
			throw error;
		}
	}
}
function hasReplacedBaseEntryAncestor(entryPath, baseByPath, currentByPath) {
	const segments = entryPath.split("/");
	for (let index = 1; index < segments.length; index += 1) {
		const ancestor = segments.slice(0, index).join("/");
		const baseEntry = baseByPath.get(ancestor);
		if (baseEntry && !sameEntry(baseEntry, currentByPath.get(ancestor))) return true;
	}
	return false;
}
async function preflightWorkspaceApply(params) {
	const baseNodes = manifestNodes(params.base);
	const currentNodes = manifestNodes(params.current);
	const manifestPaths = [.../* @__PURE__ */ new Set([...baseNodes.keys(), ...currentNodes.keys()])];
	const changed = new Set(manifestPaths.filter((entryPath) => !sameEntry(baseNodes.get(entryPath), currentNodes.get(entryPath))));
	const structurallyReplacedDirectories = new Set([...changed].filter((entryPath) => baseNodes.get(entryPath)?.type === "directory" && currentNodes.get(entryPath)?.type !== "directory"));
	const structuralRoots = [...structurallyReplacedDirectories].filter((entryPath) => !hasPathAncestor(structurallyReplacedDirectories, entryPath));
	const localStructuralRoots = [];
	for (const entryPath of structuralRoots) {
		const stats = await fs.lstat(localPath(params.root, entryPath)).catch(() => void 0);
		if (stats?.isDirectory() && !stats.isSymbolicLink()) localStructuralRoots.push(entryPath);
	}
	const localStructuralPaths = await localWorkspaceDescendantPaths(params.root, localStructuralRoots);
	const paths = [.../* @__PURE__ */ new Set([...changed, ...localStructuralPaths])].toSorted();
	const applyPaths = /* @__PURE__ */ new Set();
	const conflicts = /* @__PURE__ */ new Set();
	const blockingConflicts = /* @__PURE__ */ new Set();
	const localNodes = /* @__PURE__ */ new Map();
	const localNode = (entryPath) => {
		const existing = localNodes.get(entryPath);
		if (existing) return existing;
		const node = localWorkspaceNode(params.root, entryPath);
		localNodes.set(entryPath, node);
		return node;
	};
	for (const entryPath of paths) {
		if (hasPathAncestor(blockingConflicts, entryPath)) continue;
		if (currentNodes.get(entryPath) === void 0 && !await fs.lstat(localPath(params.root, entryPath)).catch((error) => {
			if (hasNodeErrorCode(error, "ENOENT") || hasNodeErrorCode(error, "ENOTDIR")) return;
			throw error;
		})) continue;
		const segments = entryPath.split("/");
		let localAncestorConflict = false;
		for (let index = 1; index < segments.length; index += 1) {
			const ancestor = segments.slice(0, index).join("/");
			const baseAncestor = baseNodes.get(ancestor);
			const currentAncestor = currentNodes.get(ancestor);
			if (!baseAncestor && !currentAncestor) {
				const localAncestor = await localNode(ancestor);
				if (localAncestor && localAncestor.type !== "directory") {
					conflicts.add(ancestor);
					blockingConflicts.add(ancestor);
					localAncestorConflict = true;
					break;
				}
				continue;
			}
			const localAncestor = await localNode(ancestor);
			const localStructurallyMatchesBase = localAncestor?.type === "directory" && baseAncestor?.type === "directory" ? true : sameEntry(localAncestor, baseAncestor);
			const localStructurallyMatchesCurrent = localAncestor?.type === "directory" && currentAncestor?.type === "directory" ? true : sameEntry(localAncestor, currentAncestor);
			if (!localStructurallyMatchesBase && !localStructurallyMatchesCurrent) {
				conflicts.add(ancestor);
				blockingConflicts.add(ancestor);
				localAncestorConflict = true;
				break;
			}
		}
		if (localAncestorConflict) continue;
		let local;
		let replacedBaseAncestor = false;
		for (let index = 1; index < segments.length; index += 1) {
			const ancestor = segments.slice(0, index).join("/");
			const baseAncestor = baseNodes.get(ancestor);
			if (baseAncestor && baseAncestor.type !== "directory" && !sameEntry(baseAncestor, currentNodes.get(ancestor)) && sameEntry(await localNode(ancestor), baseAncestor)) {
				replacedBaseAncestor = true;
				break;
			}
		}
		if (replacedBaseAncestor) local = void 0;
		else {
			local = await localNode(entryPath);
			if (local?.type === "directory" && (!baseNodes.has(entryPath) || !currentNodes.has(entryPath)) && currentNodes.get(entryPath)?.type !== "directory" && await directoryContainsOnlyDerivedWorkspaceEntries(params.root, entryPath)) local = void 0;
		}
		if (sameEntry(local, baseNodes.get(entryPath))) {
			if (changed.has(entryPath)) applyPaths.add(entryPath);
		} else if (!sameEntry(local, currentNodes.get(entryPath))) {
			conflicts.add(entryPath);
			const current = currentNodes.get(entryPath);
			if (current?.type === "directory" && local !== void 0 && local.type !== "directory" || current !== void 0 && current.type !== "directory" && local?.type === "directory") blockingConflicts.add(entryPath);
		}
	}
	const initialConflictPaths = Array.from(conflicts);
	for (const conflictPath of initialConflictPaths) {
		const segments = conflictPath.split("/");
		for (let index = 1; index < segments.length; index += 1) {
			const ancestor = segments.slice(0, index).join("/");
			const workerNode = currentNodes.get(ancestor);
			if (changed.has(ancestor) && workerNode && workerNode.type !== "directory") {
				conflicts.add(ancestor);
				blockingConflicts.add(ancestor);
				break;
			}
		}
	}
	const conflictPaths = [...conflicts].filter((entryPath) => !hasPathAncestor(blockingConflicts, entryPath)).toSorted();
	const blockingConflictPaths = [...blockingConflicts].filter((entryPath) => !hasPathAncestor(blockingConflicts, entryPath)).toSorted();
	const conflictPathSet = new Set(conflictPaths);
	const blockingConflictPathSet = new Set(blockingConflictPaths);
	for (const entryPath of applyPaths) if (conflictPathSet.has(entryPath) || hasPathAncestor(blockingConflictPathSet, entryPath)) applyPaths.delete(entryPath);
	return {
		applyPaths,
		conflictPaths,
		blockingConflictPaths
	};
}
function retainedConflictPaths(preflight, originalApplyPaths) {
	const retainedApplyPaths = [...preflight.applyPaths].filter((entryPath) => !originalApplyPaths?.has(entryPath) || !preflight.conflictPaths.some((conflictPath) => conflictPath.startsWith(`${entryPath}/`)));
	const conflicts = /* @__PURE__ */ new Set([...preflight.conflictPaths, ...retainedApplyPaths]);
	const blockingConflicts = new Set(preflight.blockingConflictPaths);
	return [...conflicts].filter((entryPath) => !hasPathAncestor(blockingConflicts, entryPath)).toSorted();
}
async function assertWorkspaceResultStable(params) {
	await assertWorkspaceMatchesManifest({
		root: params.root,
		manifest: params.current
	});
	const preflight = await preflightWorkspaceApply(params);
	const unstablePath = preflight.conflictPaths[0] ?? preflight.applyPaths.values().next().value;
	if (unstablePath) throw new ConcurrentWorkspacePathError(`Gateway workspace changed after cloud dispatch: ${unstablePath}`);
}
//#endregion
//#region src/gateway/worker-environments/workspace-reconcile-recovery.ts
const PATCH_TIMEOUT_MS = 10 * 6e4;
async function requireGit(cwd, args, input, env) {
	const result = await runCommandWithTimeout([
		"git",
		"-C",
		cwd,
		...args
	], {
		timeoutMs: PATCH_TIMEOUT_MS,
		...input ? { input } : {},
		...env ? { env } : {},
		maxOutputBytes: 1024 * 1024
	});
	if (result.termination !== "exit" || result.code !== 0) throw new Error((result.stderr || result.stdout || `git ${args[0]} failed`).trim());
	return result.stdout.trim();
}
async function materializeSnapshotEntry(params) {
	const target = localPath(params.root, params.entry.path);
	await fs.mkdir(path.dirname(target), {
		recursive: true,
		mode: 448
	});
	if (params.entry.type === "symlink") {
		await fs.symlink(params.entry.target, target);
		return;
	}
	if (params.content) await fs.writeFile(target, params.content, {
		mode: params.entry.mode,
		flag: "wx"
	});
	else if (params.sourceRoot) await fs.copyFile(localPath(params.sourceRoot, params.entry.path), target);
	else throw new Error(`Cloud workspace snapshot content is missing: ${params.entry.path}`);
	await fs.chmod(target, params.entry.mode);
	if (!await absoluteEntryMatches(target, params.entry)) throw new Error(`Cloud workspace staged payload is invalid: ${params.entry.path}`);
}
async function writeRawWorkspaceTree(params) {
	const blobs = [];
	let mark = 1;
	for (const entry of reconciliationEntries(params.entries).toSorted((left, right) => left.path.localeCompare(right.path))) {
		const content = entry.type === "symlink" ? Buffer.from(entry.target) : await fs.readFile(localPath(params.repositoryRoot, entry.path));
		blobs.push({
			entry,
			mark,
			content
		});
		mark += 1;
	}
	const ref = `refs/heads/openclaw-snapshot-${randomBytes(16).toString("hex")}`;
	const chunks = [];
	for (const blob of blobs) {
		chunks.push(Buffer.from(`blob\nmark :${blob.mark}\ndata ${blob.content.byteLength}\n`));
		chunks.push(blob.content, Buffer.from("\n"));
	}
	chunks.push(Buffer.from(`commit ${ref}\ncommitter OpenClaw <noreply@openclaw.ai> 0 +0000\ndata 0\ndeleteall\n`));
	for (const blob of blobs) {
		const mode = blob.entry.type === "symlink" ? "120000" : (blob.entry.mode & 73) !== 0 ? "100755" : "100644";
		chunks.push(Buffer.from(`M ${mode} :${blob.mark} ${JSON.stringify(blob.entry.path)}\n`));
	}
	chunks.push(Buffer.from("done\n"));
	const imported = await runCommandBuffered([
		"git",
		"-C",
		params.repositoryRoot,
		"fast-import",
		"--quiet"
	], {
		input: Buffer.concat(chunks),
		timeoutMs: PATCH_TIMEOUT_MS,
		maxOutputBytes: {
			stdout: 1024 * 1024,
			stderr: 1024 * 1024
		}
	});
	if (imported.termination !== "exit" || imported.code !== 0) throw new Error(imported.stderr.toString("utf8").trim() || "git fast-import failed");
	return await requireGit(params.repositoryRoot, ["rev-parse", `${ref}^{tree}`]);
}
async function createWorkspacePatch(params) {
	const temporary = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-workspace-patch-"));
	try {
		await requireGit(temporary, [
			"init",
			"--quiet",
			"--object-format=sha1"
		]);
		let bytes = 0;
		for (const entry of params.baseEntries) {
			let content;
			if (entry.type === "file") {
				if (entry.size > 67108864) throw new Error(`Cloud workspace rollback file is too large: ${entry.path}`);
				content = await fs.readFile(localPath(params.root, entry.path));
				bytes += content.byteLength;
			}
			if (bytes > 268435456) throw new Error("Cloud workspace rollback exceeds its byte limit");
			await materializeSnapshotEntry({
				root: temporary,
				entry,
				content
			});
		}
		const baseTree = await writeRawWorkspaceTree({
			repositoryRoot: temporary,
			entries: params.baseEntries
		});
		const packed = await runCommandBuffered([
			"git",
			"-C",
			temporary,
			"pack-objects",
			"--stdout",
			"--revs"
		], {
			input: Buffer.from(`${baseTree}\n`),
			timeoutMs: PATCH_TIMEOUT_MS,
			maxOutputBytes: {
				stdout: MAX_RECONCILIATION_TOTAL_BYTES + 1,
				stderr: 1024 * 1024
			}
		});
		if (packed.termination !== "exit" || packed.code !== 0) throw new Error(packed.stderr.toString("utf8").trim() || "git pack-objects failed");
		if (packed.stdout.byteLength > 268435456) throw new Error("Cloud workspace recovery snapshot exceeds its byte limit");
		for (const name of await fs.readdir(temporary)) if (name !== ".git") await fs.rm(path.join(temporary, name), {
			recursive: true,
			force: true
		});
		for (const entry of params.appliedEntries) await materializeSnapshotEntry({
			root: temporary,
			entry,
			sourceRoot: params.stagingRoot
		});
		const diff = await runCommandBuffered([
			"git",
			"-C",
			temporary,
			"diff",
			"--binary",
			"--full-index",
			"--no-renames",
			baseTree,
			await writeRawWorkspaceTree({
				repositoryRoot: temporary,
				entries: params.appliedEntries
			}),
			"--"
		], {
			timeoutMs: PATCH_TIMEOUT_MS,
			maxOutputBytes: {
				stdout: MAX_RECONCILIATION_TOTAL_BYTES + 1,
				stderr: 1024 * 1024
			}
		});
		if (diff.termination !== "exit" || diff.code !== 0) throw new Error(diff.stderr.toString("utf8").trim() || "git diff failed");
		if (diff.stdout.byteLength > 268435456) throw new Error("Cloud workspace patch exceeds its byte limit");
		return {
			patch: diff.stdout,
			baseTree,
			basePack: packed.stdout
		};
	} finally {
		await fs.rm(temporary, {
			recursive: true,
			force: true
		});
	}
}
async function applyWorkspacePatch(params) {
	if (params.patch.byteLength === 0) return;
	const temporary = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-no-git-"));
	try {
		await requireGit(params.root, [
			"apply",
			"--no-index",
			"--binary",
			"--whitespace=nowarn",
			...params.reverse ? ["--reverse"] : []
		], params.patch, { GIT_DIR: path.join(temporary, ".git") });
	} finally {
		await fs.rm(temporary, {
			recursive: true,
			force: true
		});
	}
}
function validateJournalSnapshot(journal) {
	if (journal.basePack.byteLength > 268435456 || !/^[a-f0-9]{40}$/u.test(journal.baseTree) || createHash("sha256").update(journal.basePack).digest("hex") !== journal.basePackSha256) throw new Error("Cloud workspace reconciliation recovery snapshot is invalid");
}
async function createWorkspaceRecoveryPatch(params) {
	const temporary = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-workspace-recovery-"));
	try {
		await requireGit(temporary, [
			"init",
			"--quiet",
			"--object-format=sha1"
		]);
		await requireGit(temporary, ["index-pack", "--stdin"], params.journal.basePack);
		await requireGit(temporary, [
			"cat-file",
			"-e",
			`${params.journal.baseTree}^{tree}`
		]);
		const baseEntries = reconciliationEntries(params.journal.baseEntries);
		const appliedEntries = reconciliationEntries(params.journal.appliedEntries);
		const baseByPath = new Map(baseEntries.map((entry) => [entry.path, entry]));
		const appliedByPath = new Map(appliedEntries.map((entry) => [entry.path, entry]));
		const paths = /* @__PURE__ */ new Set([...baseByPath.keys(), ...appliedByPath.keys()]);
		const directories = /* @__PURE__ */ new Set();
		for (const entryPath of paths) {
			const segments = entryPath.split("/");
			for (let index = 1; index < segments.length; index += 1) directories.add(segments.slice(0, index).join("/"));
		}
		const actualEntries = [];
		for (const entryPath of [...paths].toSorted()) {
			const absolute = localPath(params.root, entryPath);
			const stats = await fs.lstat(absolute).catch(() => void 0);
			if (!stats) {
				const baseEntry = baseByPath.get(entryPath);
				const appliedEntry = appliedByPath.get(entryPath);
				if (baseEntry && appliedEntry) throw new ConcurrentWorkspacePathError(`Gateway workspace changed while cloud recovery was pending: ${entryPath}`);
				continue;
			}
			const baseEntry = baseByPath.get(entryPath);
			const appliedEntry = appliedByPath.get(entryPath);
			if (baseEntry && await entryMatches(params.root, baseEntry)) {
				actualEntries.push(baseEntry);
				continue;
			}
			if (appliedEntry && await entryMatches(params.root, appliedEntry)) {
				actualEntries.push(appliedEntry);
				continue;
			}
			if (!(stats.isDirectory() && !stats.isSymbolicLink() && (directories.has(entryPath) && await directoryContainsOnlyJournalPaths(params.root, entryPath, paths, directories) || await directoryContainsOnlyDerivedWorkspaceEntries(params.root, entryPath)))) throw new ConcurrentWorkspacePathError(`Gateway workspace changed while cloud recovery was pending: ${entryPath}`);
		}
		for (const entry of actualEntries) await materializeSnapshotEntry({
			root: temporary,
			entry,
			sourceRoot: params.root
		});
		const actualTree = await writeRawWorkspaceTree({
			repositoryRoot: temporary,
			entries: actualEntries
		});
		let recoveryBaseTree = params.journal.baseTree;
		if (baseEntries.length !== params.journal.baseEntries.length) {
			await clearTemporaryWorkspace(temporary);
			for (const entry of baseEntries) await materializeSnapshotEntry({
				root: temporary,
				entry,
				content: entry.type === "file" ? await readWorkspaceTreeFile({
					repositoryRoot: temporary,
					tree: params.journal.baseTree,
					entry
				}) : void 0
			});
			recoveryBaseTree = await writeRawWorkspaceTree({
				repositoryRoot: temporary,
				entries: baseEntries
			});
			await clearTemporaryWorkspace(temporary);
		}
		const diff = await runCommandBuffered([
			"git",
			"-C",
			temporary,
			"diff",
			"--binary",
			"--full-index",
			"--no-renames",
			actualTree,
			recoveryBaseTree,
			"--"
		], {
			timeoutMs: PATCH_TIMEOUT_MS,
			maxOutputBytes: {
				stdout: MAX_RECONCILIATION_TOTAL_BYTES + 1,
				stderr: 1024 * 1024
			}
		});
		if (diff.termination !== "exit" || diff.code !== 0) throw new Error(diff.stderr.toString("utf8").trim() || "git recovery diff failed");
		if (diff.stdout.byteLength > 268435456) throw new Error("Cloud workspace recovery patch exceeds its byte limit");
		return diff.stdout;
	} finally {
		await fs.rm(temporary, {
			recursive: true,
			force: true
		});
	}
}
async function assertWorkspaceRecoveryBase(params) {
	await assertWorkspaceMatchesManifest({
		root: params.root,
		manifest: {
			version: 1,
			baseCommit: null,
			entries: params.journal.baseEntries
		}
	});
	const baseEntries = reconciliationEntries(params.journal.baseEntries);
	const appliedEntries = reconciliationEntries(params.journal.appliedEntries);
	const baseDirectoryPaths = new Set(reconciliationDirectories(params.journal.baseDirectories ?? []));
	const appliedDirectoryPaths = new Set(reconciliationDirectories(params.journal.appliedDirectories ?? []));
	for (const entryPath of baseDirectoryPaths) if ((await localWorkspaceNode(params.root, entryPath))?.type !== "directory") throw new ConcurrentWorkspacePathError(`Gateway workspace changed while cloud recovery was pending: ${entryPath}`);
	const basePaths = new Set(baseEntries.map((entry) => entry.path));
	const baseDirectories = /* @__PURE__ */ new Set();
	for (const entryPath of basePaths) {
		const segments = entryPath.split("/");
		for (let index = 1; index < segments.length; index += 1) baseDirectories.add(segments.slice(0, index).join("/"));
	}
	for (const entry of appliedEntries) {
		if (basePaths.has(entry.path)) continue;
		const existing = await fs.lstat(localPath(params.root, entry.path)).catch(() => void 0);
		if (existing?.isDirectory() && !existing.isSymbolicLink() && baseDirectories.has(entry.path) && await directoryContainsOnlyJournalPaths(params.root, entry.path, basePaths, baseDirectories)) continue;
		if (existing) throw new ConcurrentWorkspacePathError(`Gateway workspace changed while cloud recovery was pending: ${entry.path}`);
	}
	for (const entryPath of appliedDirectoryPaths) {
		if (baseDirectoryPaths.has(entryPath) || basePaths.has(entryPath)) continue;
		const node = await localWorkspaceNode(params.root, entryPath);
		if (node && !(node.type === "directory" && await directoryContainsOnlyDerivedWorkspaceEntries(params.root, entryPath))) throw new ConcurrentWorkspacePathError(`Gateway workspace changed while cloud recovery was pending: ${entryPath}`);
	}
}
async function assertWorkspaceRecoveryDirectoriesRecoverable(params) {
	const baseDirectories = new Set(reconciliationDirectories(params.journal.baseDirectories));
	const appliedDirectories = new Set(reconciliationDirectories(params.journal.appliedDirectories));
	const baseEntries = new Map(reconciliationEntries(params.journal.baseEntries).map((entry) => [entry.path, entry]));
	const appliedEntries = new Map(reconciliationEntries(params.journal.appliedEntries).map((entry) => [entry.path, entry]));
	const appliedEntryPaths = new Set(appliedEntries.keys());
	const directoryPaths = /* @__PURE__ */ new Set([...baseDirectories, ...appliedDirectories]);
	for (const entryPath of directoryPaths) {
		const local = await localWorkspaceNode(params.root, entryPath);
		if (local?.type === "directory") {
			if (baseEntries.has(entryPath) && appliedDirectories.has(entryPath) && !await directoryContainsOnlyJournalPaths(params.root, entryPath, appliedEntryPaths, appliedDirectories)) throw new ConcurrentWorkspacePathError(`Gateway workspace changed while cloud recovery was pending: ${entryPath}`);
			continue;
		}
		if (!local) {
			if (baseDirectories.has(entryPath) && appliedDirectories.has(entryPath)) throw new ConcurrentWorkspacePathError(`Gateway workspace changed while cloud recovery was pending: ${entryPath}`);
			continue;
		}
		const baseEntry = baseEntries.get(entryPath);
		const appliedEntry = appliedEntries.get(entryPath);
		if (baseEntry && await entryMatches(params.root, baseEntry) || appliedEntry && await entryMatches(params.root, appliedEntry)) continue;
		throw new ConcurrentWorkspacePathError(`Gateway workspace changed while cloud recovery was pending: ${entryPath}`);
	}
}
async function restoreWorkspaceJournalDirectories(params) {
	const workspaceRoot = await root(params.root, { mode: 448 });
	const baseDirectories = reconciliationDirectories(params.journal.baseDirectories ?? []);
	const appliedDirectories = new Set(reconciliationDirectories(params.journal.appliedDirectories ?? []));
	for (const entryPath of baseDirectories.toSorted()) await workspaceRoot.mkdir(entryPath);
	const baseDirectoryPaths = new Set(baseDirectories);
	const baseEntryPaths = new Set(reconciliationEntries(params.journal.baseEntries).map((entry) => entry.path));
	for (const entryPath of [...appliedDirectories].toSorted((left, right) => right.localeCompare(left))) {
		if (baseDirectoryPaths.has(entryPath) || baseEntryPaths.has(entryPath)) continue;
		let children;
		try {
			children = await workspaceRoot.list(entryPath);
		} catch (error) {
			if (error instanceof FsSafeError && ["not-found", "path-alias"].includes(error.code)) continue;
			throw error;
		}
		if (children.length > 0) continue;
		try {
			await workspaceRoot.remove(entryPath);
		} catch (error) {
			if (error instanceof FsSafeError && ["not-found", "path-alias"].includes(error.code)) continue;
			if ((await workspaceRoot.list(entryPath).catch(() => void 0))?.length) continue;
			throw error;
		}
	}
}
async function recoverWorkerWorkspaceReconciliation(params) {
	if (params.journal.appliedManifestRef) throw new Error("Cloud workspace result is already applied and awaits fence acceptance");
	if (params.preservePaths?.size) throw new Error("Cloud workspace patch recovery cannot preserve partial paths");
	const root = await fs.realpath(params.root);
	validateJournalSnapshot(params.journal);
	try {
		await assertWorkspaceRecoveryBase({
			root,
			journal: params.journal
		});
		return;
	} catch {}
	await assertWorkspaceRecoveryDirectoriesRecoverable({
		root,
		journal: params.journal
	});
	const recoveryPatch = await createWorkspaceRecoveryPatch({
		root,
		journal: params.journal
	});
	await prepareNonDirectoryTargets(root, params.journal.baseEntries);
	await applyWorkspacePatch({
		root,
		patch: recoveryPatch
	});
	await restoreWorkspaceJournalDirectories({
		root,
		journal: params.journal
	});
	await assertWorkspaceRecoveryBase({
		root,
		journal: params.journal
	});
}
//#endregion
//#region src/gateway/worker-environments/workspace-accepted-publication.ts
const SETTLEMENT_OUTCOMES = /* @__PURE__ */ new Set([
	"begun",
	"rolled-back",
	"applied",
	"committed"
]);
var AcceptedWorkspacePublicationIndeterminateError = class extends Error {
	constructor(operation, publicationFailure, observationFailure) {
		super("Accepted workspace publication is indeterminate and requires recovery", { cause: publicationFailure });
		this.operation = operation;
		this.name = "AcceptedWorkspacePublicationIndeterminateError";
		Object.defineProperty(this, "observationFailure", { value: observationFailure });
	}
};
function isAcceptedWorkspacePublicationIndeterminateError(error) {
	return error instanceof AcceptedWorkspacePublicationIndeterminateError;
}
function parseAcceptedWorkspaceSettlement(stdout) {
	const lines = stdout.split(/\r?\n/u).filter(Boolean);
	if (lines.length !== 1) throw new Error("Worker returned an invalid accepted workspace settlement outcome");
	let value;
	try {
		value = JSON.parse(lines[0]);
	} catch (error) {
		throw new Error("Worker returned an invalid accepted workspace settlement outcome", { cause: error });
	}
	if (!isRecord(value) || Object.keys(value).length !== 2 || value.version !== 1 || typeof value.outcome !== "string" || !SETTLEMENT_OUTCOMES.has(value.outcome)) throw new Error("Worker returned an invalid accepted workspace settlement outcome");
	return value.outcome;
}
//#endregion
//#region src/gateway/worker-environments/workspace-reconcile-apply.ts
async function applyStagedWorkerWorkspace(params) {
	return await withWorkspaceHashContext(async () => await applyStagedWorkerWorkspaceWithMemo(params));
}
async function applyStagedWorkerWorkspaceWithMemo(params) {
	const { memo: hashMemo, metrics } = activeWorkspaceHashContext();
	const root = await fs.realpath(params.root);
	const preserveDirectories = new Set(reconciliationDirectories(params.current.directories));
	const includePaths = params.current.baseCommit ? /* @__PURE__ */ new Set([...manifestNodes(params.base).keys(), ...manifestNodes(params.current).keys()]) : void 0;
	const createApplyResult = (actual, conflictPaths) => ({
		...actual,
		conflictPaths,
		verifyLocalStable: async () => await withWorkspaceHashMemo(hashMemo, async () => await assertActualWorkspaceManifest({
			root,
			expectedRef: actual.manifestRef,
			baseCommit: actual.manifest.baseCommit,
			preserveDirectories,
			includePaths
		}), metrics)
	});
	const preflight = await preflightWorkspaceApply({
		root,
		base: params.base,
		current: params.current
	});
	const changed = changedPaths(params.base, params.current);
	if (changed.size === 0) {
		const actual = await readActualWorkspaceManifest({
			root,
			baseCommit: params.current.baseCommit,
			preserveDirectories,
			includePaths
		});
		await assertActualWorkspaceManifest({
			root,
			expectedRef: actual.manifestRef,
			baseCommit: actual.manifest.baseCommit,
			preserveDirectories,
			includePaths
		});
		const conflictPaths = retainedConflictPaths(preflight, preflight.applyPaths);
		await params.publishAcceptedManifest?.({
			...actual,
			conflictPaths
		});
		params.journal.commit(actual.manifestRef);
		return createApplyResult(actual, conflictPaths);
	}
	const baseByPath = new Map(reconciliationEntries(params.base.entries).map((entry) => [entry.path, entry]));
	const currentByPath = new Map(reconciliationEntries(params.current.entries).map((entry) => [entry.path, entry]));
	const baseNodes = manifestNodes(params.base);
	const currentNodes = manifestNodes(params.current);
	const baseEntries = reconciliationEntries(params.base.entries).filter((entry) => changed.has(entry.path) && preflight.applyPaths.has(entry.path));
	const appliedEntries = [];
	for (const entry of reconciliationEntries(params.current.entries)) {
		if (!changed.has(entry.path) || !preflight.applyPaths.has(entry.path)) continue;
		if (!baseByPath.has(entry.path) && !hasReplacedBaseEntryAncestor(entry.path, baseByPath, currentByPath) && await entryMatches(root, entry)) continue;
		appliedEntries.push(entry);
	}
	const baseDirectories = [...preflight.applyPaths].filter((entryPath) => baseNodes.get(entryPath)?.type === "directory").toSorted();
	const appliedDirectories = [...preflight.applyPaths].filter((entryPath) => currentNodes.get(entryPath)?.type === "directory").toSorted();
	if (baseEntries.length + appliedEntries.length + baseDirectories.length + appliedDirectories.length > 25e3) throw new Error(`Cloud workspace reconciliation exceeds the ${MAX_RECONCILIATION_ENTRIES} entry limit`);
	const snapshot = await createWorkspacePatch({
		root,
		stagingRoot: params.stagingRoot,
		baseEntries,
		appliedEntries
	});
	const confirmedPreflight = await preflightWorkspaceApply({
		root,
		base: params.base,
		current: params.current
	});
	if (JSON.stringify([...confirmedPreflight.applyPaths].toSorted()) !== JSON.stringify([...preflight.applyPaths].toSorted()) || JSON.stringify(confirmedPreflight.conflictPaths) !== JSON.stringify(preflight.conflictPaths) || JSON.stringify(confirmedPreflight.blockingConflictPaths) !== JSON.stringify(preflight.blockingConflictPaths)) throw new ConcurrentWorkspacePathError("Gateway workspace changed while cloud reconciliation was being prepared");
	const journal = {
		version: 1,
		temporaryNonce: randomBytes(16).toString("hex"),
		baseManifestRef: params.baseManifestRef,
		currentManifestRef: params.currentManifestRef,
		baseEntries,
		appliedEntries,
		baseDirectories,
		appliedDirectories,
		baseTree: snapshot.baseTree,
		basePackSha256: createHash("sha256").update(snapshot.basePack).digest("hex"),
		basePack: snapshot.basePack
	};
	params.journal.begin(journal);
	try {
		await prepareNonDirectoryTargets(root, appliedEntries);
		await applyWorkspacePatch({
			root,
			patch: snapshot.patch
		});
		await applyWorkspaceDirectoryChanges({
			root,
			base: params.base,
			current: params.current,
			applyPaths: preflight.applyPaths
		});
		const actual = await readActualWorkspaceManifest({
			root,
			baseCommit: params.current.baseCommit,
			preserveDirectories,
			includePaths
		});
		const finalPreflight = await preflightWorkspaceApply({
			root,
			base: params.base,
			current: params.current
		});
		await assertActualWorkspaceManifest({
			root,
			expectedRef: actual.manifestRef,
			baseCommit: actual.manifest.baseCommit,
			preserveDirectories,
			includePaths
		});
		const conflictPaths = retainedConflictPaths(finalPreflight, preflight.applyPaths);
		await params.publishAcceptedManifest?.({
			...actual,
			conflictPaths
		});
		params.journal.commit(actual.manifestRef);
		return createApplyResult(actual, conflictPaths);
	} catch (error) {
		if (isAcceptedWorkspacePublicationIndeterminateError(error)) throw error;
		try {
			await recoverWorkerWorkspaceReconciliation({
				root,
				journal
			});
			params.journal.abort();
		} catch (rollbackError) {
			const recoveryError = new Error("Cloud reconciliation failed and rollback needs recovery", { cause: error });
			Object.defineProperty(recoveryError, "rollbackError", { value: rollbackError });
			throw recoveryError;
		}
		throw error;
	}
}
//#endregion
export { recoverWorkerWorkspaceReconciliation as a, changedPaths as c, readActualWorkspaceManifest as d, absoluteEntryMatches as f, parseAcceptedWorkspaceSettlement as i, inspectAcceptedWorkerWorkspace as l, reconciliationEntries as m, AcceptedWorkspacePublicationIndeterminateError as n, assertWorkspaceMatchesManifest as o, localPath as p, isAcceptedWorkspacePublicationIndeterminateError as r, assertWorkspaceResultStable as s, applyStagedWorkerWorkspace as t, manifestNodes as u };
