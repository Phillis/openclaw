import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { E as isMissingPathError } from "./redact-Cl7lwBnl.js";
import { w as resolveStateDir } from "./paths-CqeDjSA4.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { t as createSubsystemLogger } from "./subsystem-CDLhGl2-.js";
import { r as runCommandWithTimeout } from "./exec-BL80Wdzl.js";
import { i as requireGitCommandBuffer, n as executeGitCommand, r as requireGitCommand } from "./git-exec-CI8c1NB4.js";
import { a as listGitWorktrees, c as requireGitBuffer, d as worktreePathExists, i as insideGitCheckout, l as requireGitRaw, o as removeEmptyParents, s as requireGit, t as commandError, u as runGit } from "./git-DHuziQrS.js";
import { n as withOpenClawStateLease } from "./openclaw-state-lease-uU0VhaXS.js";
import { t as createCrustaceanSlug } from "./session-slug-DUj8bbny.js";
import { a as hasLiveWorktreeRunLease, c as lockWorktreeForProcess, i as finalizeWorktreeRemoval, l as unlockWorktree, r as claimWorktreeRemoval, s as lockState, t as abortWorktreeRemoval } from "./run-lease-BMckFku4.js";
import { a as clearRegistryWorktreeProvisionedChunks, b as listRegistryWorktrees, d as findRegistryWorktreeByPath, f as getRegistryWorktree, h as getRegistryWorktreeProvisionedState, l as findLiveRegistryWorktreeByOwner, m as getRegistryWorktreeProvisionedPaths, o as deleteRegistryWorktree, p as getRegistryWorktreeProvisionedChunk, t as WorktreeRemovalContentionError, u as findLiveRegistryWorktreeByPath, v as insertRegistryWorktree, w as updateRegistryWorktree, y as insertRegistryWorktreeProvisionedChunk } from "./registry-C0l4nYnM.js";
import { createHash, randomUUID } from "node:crypto";
import { constants } from "node:fs";
import os from "node:os";
import path from "node:path";
import fs$1 from "node:fs/promises";
//#region src/agents/worktrees/base-ref.ts
async function resolveWorktreeBase(repoRoot, baseRef) {
	if (baseRef) {
		let gitOperand = baseRef;
		if (baseRef !== "-" && baseRef.startsWith("-")) {
			const symbolic = await runGit(repoRoot, [
				"-c",
				"core.warnAmbiguousRefs=true",
				"rev-parse",
				"--symbolic-full-name",
				"--verify",
				"--end-of-options",
				baseRef
			]);
			const fullRef = symbolic.stdout.trim();
			if (symbolic.code !== 0) throw commandError("git rev-parse --symbolic-full-name --verify", symbolic);
			if (fullRef) {
				if (!fullRef.startsWith("refs/") || fullRef.includes("\n")) throw commandError("git rev-parse --symbolic-full-name --verify", symbolic);
				gitOperand = fullRef;
			} else {
				if (symbolic.stderr.trim()) throw commandError("git rev-parse --symbolic-full-name --verify", symbolic);
				gitOperand = await requireGit(repoRoot, [
					"rev-parse",
					"--verify",
					"--end-of-options",
					`${baseRef}^{commit}`
				]);
			}
		}
		return {
			gitOperand,
			recordRef: baseRef,
			remote: false
		};
	}
	if ((await runGit(repoRoot, ["fetch", "origin"])).code === 0) {
		const remoteHead = await runGit(repoRoot, [
			"symbolic-ref",
			"--quiet",
			"--short",
			"refs/remotes/origin/HEAD"
		]);
		if (remoteHead.code === 0 && remoteHead.stdout.trim()) {
			const remoteRef = remoteHead.stdout.trim();
			return {
				gitOperand: remoteRef,
				recordRef: remoteRef,
				remote: true
			};
		}
	}
	return {
		gitOperand: "HEAD",
		recordRef: "HEAD",
		remote: false
	};
}
//#endregion
//#region src/agents/worktrees/name.ts
const WORKTREE_NAME_MAX_LENGTH = 64;
const WORKTREE_ALLOCATION_FAMILY_LENGTH = 59;
/** Converts a short human-readable title into a valid managed-worktree name. */
function slugifyWorktreeTitle(title) {
	return title.normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, WORKTREE_NAME_MAX_LENGTH).replace(/-+$/g, "") || void 0;
}
/** Maps names that can converge after a `-1000` suffix into one allocation lane. */
function worktreeNameAllocationFamily(name) {
	let base = name;
	while (/-\d+$/.test(base)) base = base.replace(/-\d+$/, "");
	return (base || name).slice(0, WORKTREE_ALLOCATION_FAMILY_LENGTH).replace(/-+$/g, "");
}
//#endregion
//#region src/agents/worktrees/owner.ts
function worktreeOwnerMatches(record, params) {
	return record.ownerKind === (params.ownerKind ?? "manual") && (record.ownerId ?? void 0) === (params.ownerId ?? void 0);
}
//#endregion
//#region src/agents/worktrees/provisioned-files.ts
function normalizeRelativePath(relativePath) {
	if (path.isAbsolute(relativePath)) return;
	const segments = relativePath.split("/");
	if (segments.length === 0 || segments.some((segment) => !segment || segment === "." || segment === "..")) return;
	return segments.join("/");
}
function resolveGitPath(root, relativePath) {
	return path.join(root, ...relativePath.split("/"));
}
async function hasSafeParentDirectories(root, relativePath) {
	const segments = relativePath.split("/");
	let current = root;
	for (const segment of segments.slice(0, -1)) {
		current = path.join(current, segment);
		try {
			const stat = await fs$1.lstat(current);
			if (stat.isSymbolicLink() || !stat.isDirectory()) return false;
		} catch (error) {
			if (error.code !== "ENOENT") throw error;
		}
	}
	return true;
}
async function lstatIfExists(target) {
	try {
		return await fs$1.lstat(target);
	} catch (error) {
		if (error.code === "ENOENT") return;
		throw error;
	}
}
async function copyProvisionedFile(params) {
	const normalized = normalizeRelativePath(params.relativePath);
	if (!normalized || !await hasSafeParentDirectories(params.repoRoot, normalized) || !await hasSafeParentDirectories(params.worktreePath, normalized)) return false;
	const source = resolveGitPath(params.repoRoot, normalized);
	const destination = resolveGitPath(params.worktreePath, normalized);
	const sourceStat = await fs$1.lstat(source).catch(() => void 0);
	if (!sourceStat?.isFile() || sourceStat.isSymbolicLink()) return false;
	await fs$1.mkdir(path.dirname(destination), { recursive: true });
	try {
		await fs$1.copyFile(source, destination, constants.COPYFILE_EXCL);
	} catch (error) {
		if (error.code === "EEXIST") return false;
		throw error;
	}
	await fs$1.chmod(destination, sourceStat.mode);
	return true;
}
/** Copies the current manifest matches and returns only paths this call actually created. */
async function provisionIncludedFiles(repoRoot, worktreePath) {
	const includePath = path.join(repoRoot, ".worktreeinclude");
	if (!await worktreePathExists(includePath)) return [];
	const candidatesRaw = await requireGitRaw(repoRoot, [
		"ls-files",
		"--others",
		"--ignored",
		"--exclude-standard",
		"-z"
	]);
	const includedRaw = await requireGitRaw(repoRoot, [
		"ls-files",
		"--others",
		"--ignored",
		`--exclude-from=${includePath}`,
		"-z"
	]);
	const included = new Set(includedRaw.split("\0").filter(Boolean));
	const provisioned = [];
	for (const relativePath of candidatesRaw.split("\0").filter(Boolean)) {
		if (!included.has(relativePath)) continue;
		const normalized = normalizeRelativePath(relativePath);
		if (normalized && await copyProvisionedFile({
			repoRoot,
			worktreePath,
			relativePath: normalized
		})) provisioned.push(normalized);
	}
	return provisioned.toSorted();
}
const SNAPSHOT_CHUNK_BYTES = 1024 * 1024;
async function captureParentDirectoryIdentities(root, relativePath) {
	const segments = relativePath.split("/");
	const directories = [root];
	let current = root;
	for (const segment of segments.slice(0, -1)) {
		current = path.join(current, segment);
		directories.push(current);
	}
	const identities = [];
	for (const directory of directories) {
		const stat = await fs$1.lstat(directory);
		if (!stat.isDirectory() || stat.isSymbolicLink()) throw new Error(`unsafe provisioned parent directory: ${directory}`);
		identities.push({
			path: directory,
			dev: stat.dev,
			ino: stat.ino
		});
	}
	return identities;
}
async function validateDirectoryIdentities(identities) {
	for (const identity of identities) {
		const stat = await fs$1.lstat(identity.path);
		if (!stat.isDirectory() || stat.isSymbolicLink() || stat.dev !== identity.dev || stat.ino !== identity.ino) throw new Error(`provisioned parent directory changed: ${identity.path}`);
	}
}
async function inspectProvisionedFiles(worktreePath, provisionedPaths) {
	if (provisionedPaths === void 0) return;
	const files = [];
	for (const relativePath of provisionedPaths) {
		const normalized = normalizeRelativePath(relativePath);
		if (!normalized || !await hasSafeParentDirectories(worktreePath, normalized)) throw new Error(`unsafe provisioned path: ${relativePath}`);
		const target = resolveGitPath(worktreePath, normalized);
		const stat = await lstatIfExists(target);
		if (!stat) {
			files.push({
				path: normalized,
				target,
				mode: null
			});
			continue;
		}
		if (!stat.isFile() || stat.isSymbolicLink()) throw new Error(`provisioned path is no longer a regular file: ${relativePath}`);
		files.push({
			path: normalized,
			target,
			mode: stat.mode & 4095
		});
	}
	return files.toSorted((a, b) => a.path.localeCompare(b.path));
}
async function hasUnsnapshotableProvisionedFiles(worktreePath, provisionedPaths) {
	try {
		return await inspectProvisionedFiles(worktreePath, provisionedPaths) === void 0;
	} catch {
		return true;
	}
}
function sameFileState(left, right) {
	return left.dev === right.dev && left.ino === right.ino && left.mode === right.mode && left.size === right.size && left.mtimeMs === right.mtimeMs && left.ctimeMs === right.ctimeMs;
}
/** Stores provisioned bytes outside Git so ignored credentials never enter its object database. */
async function snapshotProvisionedFiles(env, worktreeId, worktreePath, provisionedPaths) {
	const files = await inspectProvisionedFiles(worktreePath, provisionedPaths);
	if (files === void 0) throw new Error("provisioned path ledger is unavailable");
	const ignoredUntracked = new Set((await requireGitRaw(worktreePath, [
		"ls-files",
		"--others",
		"--ignored",
		"--exclude-standard",
		"-z"
	])).split("\0").filter(Boolean));
	const currentTracked = new Set((await requireGitRaw(worktreePath, [
		"ls-files",
		"--cached",
		"-z"
	])).split("\0").filter(Boolean));
	const trackedAtHead = new Set((await requireGitBuffer(worktreePath, [
		"ls-tree",
		"-r",
		"--name-only",
		"-z",
		"HEAD"
	])).toString("utf8").split("\0").filter(Boolean));
	clearRegistryWorktreeProvisionedChunks(env, worktreeId);
	const states = [];
	try {
		for (const file of files) {
			if (file.mode === null) {
				states.push({
					path: file.path,
					mode: null,
					chunks: 0
				});
				continue;
			}
			if (currentTracked.has(file.path)) throw new Error(`provisioned path is now tracked: ${file.path}`);
			if (trackedAtHead.has(file.path)) throw new Error(`provisioned path is tracked at HEAD: ${file.path}`);
			if (!ignoredUntracked.has(file.path)) throw new Error(`provisioned path is no longer ignored: ${file.path}`);
			const parentIdentities = await captureParentDirectoryIdentities(worktreePath, file.path);
			const handle = await fs$1.open(file.target, constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0));
			try {
				await validateDirectoryIdentities(parentIdentities);
				const before = await handle.stat();
				const buffer = Buffer.allocUnsafe(SNAPSHOT_CHUNK_BYTES);
				let chunkIndex = 0;
				let offset = 0;
				while (offset < before.size) {
					const { bytesRead } = await handle.read(buffer, 0, Math.min(buffer.byteLength, before.size - offset), offset);
					if (bytesRead === 0) throw new Error(`provisioned file changed while snapshotting: ${file.path}`);
					insertRegistryWorktreeProvisionedChunk(env, {
						worktreeId,
						path: file.path,
						chunkIndex,
						data: buffer.subarray(0, bytesRead)
					});
					offset += bytesRead;
					chunkIndex += 1;
				}
				const [after, current] = await Promise.all([handle.stat(), fs$1.lstat(file.target)]);
				await validateDirectoryIdentities(parentIdentities);
				if (!sameFileState(before, after) || !sameFileState(before, current)) throw new Error(`provisioned file changed while snapshotting: ${file.path}`);
				states.push({
					path: file.path,
					mode: before.mode & 4095,
					chunks: chunkIndex
				});
			} finally {
				await handle.close();
			}
		}
		return states;
	} catch (error) {
		clearRegistryWorktreeProvisionedChunks(env, worktreeId);
		throw error;
	}
}
async function writeAll(handle, data) {
	let offset = 0;
	while (offset < data.byteLength) {
		const { bytesWritten } = await handle.write(data, offset, data.byteLength - offset);
		if (bytesWritten === 0) throw new Error("provisioned snapshot write made no progress");
		offset += bytesWritten;
	}
}
/** Restores provisioned bytes and modes from SQLite, never from the mutable source checkout. */
async function restoreProvisionedFiles(env, worktreeId, worktreePath, states) {
	for (const state of states) {
		const normalized = normalizeRelativePath(state.path);
		if (!normalized || !await hasSafeParentDirectories(worktreePath, normalized)) throw new Error(`unsafe provisioned path: ${state.path}`);
		const target = resolveGitPath(worktreePath, normalized);
		if (state.mode === null) {
			if (await lstatIfExists(target)) throw new Error(`snapshot expected provisioned path to be absent: ${state.path}`);
			continue;
		}
		await fs$1.mkdir(path.dirname(target), { recursive: true });
		const parentIdentities = await captureParentDirectoryIdentities(worktreePath, normalized);
		const handle = await fs$1.open(target, constants.O_CREAT | constants.O_EXCL | constants.O_WRONLY | (constants.O_NOFOLLOW ?? 0), state.mode);
		try {
			await validateDirectoryIdentities(parentIdentities);
			for (let chunkIndex = 0; chunkIndex < state.chunks; chunkIndex += 1) {
				const chunk = getRegistryWorktreeProvisionedChunk(env, {
					worktreeId,
					path: state.path,
					chunkIndex
				});
				if (!chunk) throw new Error(`provisioned snapshot chunk missing: ${state.path}:${chunkIndex}`);
				await writeAll(handle, chunk);
			}
			await handle.chmod(state.mode);
			await validateDirectoryIdentities(parentIdentities);
		} finally {
			await handle.close();
		}
	}
}
//#endregion
//#region src/agents/worktrees/service.ts
const IDLE_GC_MS = 10080 * 60 * 1e3;
const SNAPSHOT_RETENTION_MS = 720 * 60 * 60 * 1e3;
const WORKTREE_GC_INTERVAL_MS = 3600 * 1e3;
const NAME_PATTERN = /^[a-z0-9][a-z0-9-]{0,63}$/;
const WORKTREE_CREATE_LEASE_SCOPE = "core:managed-worktrees:create";
const WORKTREE_OWNER_LEASE_SCOPE = "core:managed-worktrees:owner";
const WORKTREE_CREATE_LEASE_MS = 6e4;
const WORKTREE_CREATE_LEASE_WAIT_MS = 5 * 6e4;
/** Non-forced removal aborted because the safety snapshot failed. */
var WorktreeSnapshotError = class extends Error {
	constructor(snapshotError, options) {
		super(`worktree snapshot failed; removal aborted: ${snapshotError}`, options);
		this.snapshotError = snapshotError;
	}
};
var WorktreeRepositoryError = class extends Error {};
const SNAPSHOT_REF_PREFIX = "refs/openclaw/snapshots";
const log = createSubsystemLogger("agents/worktrees");
/** Returns the default no-limit policy for age-based managed-worktree cleanup. */
function resolveWorktreeCleanupLimits() {
	return {};
}
function resultMessage(result) {
	return (result.stderr || result.stdout).trim().split("\n").slice(-12).join("\n");
}
function validateName(name) {
	if (!NAME_PATTERN.test(name)) throw new Error("worktree name must match [a-z0-9][a-z0-9-]{0,63}");
	return name;
}
async function nameIsUnavailable(env, repoRoot, root, name, owner) {
	const worktreePath = path.join(root, name);
	const registered = findRegistryWorktreeByPath(env, worktreePath);
	if (owner.ownerId && registered && registered.removedAt === void 0 && worktreeOwnerMatches(registered, owner)) return false;
	if (registered || await worktreePathExists(worktreePath)) return true;
	const branchExists = await executeGitCommand(repoRoot, [
		"show-ref",
		"--quiet",
		"--verify",
		`refs/heads/${`openclaw/${name}`}`
	]);
	if (branchExists.code === 0) return true;
	if (branchExists.code !== 1) throw commandError("git show-ref --verify", branchExists);
	return (await listGitWorktrees(repoRoot)).some((entry) => path.resolve(entry.path) === path.resolve(worktreePath));
}
function appendNameOrdinal(name, ordinal) {
	const suffix = `-${ordinal}`;
	return `${name.slice(0, 64 - suffix.length).replace(/-+$/g, "")}${suffix}`;
}
async function generateName(env, repoRoot, root, owner, suggestedName) {
	validateName(suggestedName);
	for (let ordinal = 1; ordinal <= 1e3; ordinal += 1) {
		const candidate = ordinal === 1 ? suggestedName : appendNameOrdinal(suggestedName, ordinal);
		if (!await nameIsUnavailable(env, repoRoot, root, candidate, owner)) return candidate;
	}
	throw new Error(`no available worktree name for ${suggestedName}`);
}
async function resolveRepositoryFromRealPath(requested, requestedLabel) {
	const rootResult = await executeGitCommand(requested, ["rev-parse", "--show-toplevel"]);
	if (rootResult.code !== 0) throw new WorktreeRepositoryError(`not a git checkout: ${requestedLabel}`);
	const sourceRoot = await fs$1.realpath(rootResult.stdout.trim());
	if ((await executeGitCommand(sourceRoot, [
		"rev-parse",
		"--verify",
		"HEAD^{commit}"
	])).code !== 0) throw new WorktreeRepositoryError(`git checkout has no commits: ${requestedLabel}`);
	const commonRaw = await requireGitCommand(sourceRoot, ["rev-parse", "--git-common-dir"]);
	const commonDir = await fs$1.realpath(path.isAbsolute(commonRaw) ? commonRaw : path.resolve(sourceRoot, commonRaw));
	const primary = (await listGitWorktrees(sourceRoot))[0]?.path ?? sourceRoot;
	const canonicalRoot = await fs$1.realpath(primary);
	const origin = await executeGitCommand(canonicalRoot, [
		"config",
		"--get",
		"remote.origin.url"
	]);
	const originUrl = origin.code === 0 ? origin.stdout.trim() : "";
	return {
		repoRoot: canonicalRoot,
		sourceRoot,
		commonDir,
		originUrl,
		fingerprint: createHash("sha256").update(`${commonDir}\n${originUrl}`).digest("hex").slice(0, 16)
	};
}
async function resolveRepository(repoRoot) {
	return await resolveRepositoryFromRealPath(await fs$1.realpath(repoRoot).catch(() => {
		throw new Error(`repository does not exist: ${repoRoot}`);
	}), repoRoot);
}
async function canonicalPathKey(target) {
	const canonical = await fs$1.realpath(target);
	return process.platform === "win32" ? canonical.toLowerCase() : canonical;
}
async function shouldPreserveOrphanCandidate(target, managedPaths) {
	const targetKey = await canonicalPathKey(target);
	if (managedPaths.has(targetKey)) return true;
	if (!await worktreePathExists(path.join(target, ".git"))) return false;
	const listed = await listGitWorktrees(target);
	for (const entry of listed) {
		let listedKey;
		try {
			listedKey = await canonicalPathKey(entry.path);
		} catch (error) {
			if (isMissingPathError(error)) continue;
			throw error;
		}
		if (listedKey === targetKey) return true;
	}
	return false;
}
async function cleanupFailedCreate(repoRoot, worktreePath, branch) {
	const removed = await executeGitCommand(repoRoot, [
		"worktree",
		"remove",
		"--force",
		worktreePath
	]);
	const deletedBranch = await executeGitCommand(repoRoot, [
		"branch",
		"-D",
		branch
	]);
	await executeGitCommand(repoRoot, ["worktree", "prune"]);
	if (removed.code !== 0 || deletedBranch.code !== 0) throw new Error(`failed to clean up worktree creation: ${resultMessage(removed) || resultMessage(deletedBranch)}`);
}
async function resetFailedWorktreeAdd(repoRoot, worktreePath, branch) {
	if ((await listGitWorktrees(repoRoot)).some((entry) => path.resolve(entry.path) === path.resolve(worktreePath))) {
		const removed = await executeGitCommand(repoRoot, [
			"worktree",
			"remove",
			"--force",
			worktreePath
		]);
		if (removed.code !== 0) throw commandError("git worktree remove", removed);
	} else if (await worktreePathExists(worktreePath)) await fs$1.rm(worktreePath, {
		recursive: true,
		force: true
	});
	if ((await executeGitCommand(repoRoot, [
		"show-ref",
		"--quiet",
		"--verify",
		`refs/heads/${branch}`
	])).code === 0) await requireGitCommand(repoRoot, [
		"branch",
		"-D",
		branch
	]);
	await requireGitCommand(repoRoot, ["worktree", "prune"]);
}
async function canResetFailedWorktreeAdd(repoRoot, worktreePath, branch, failure) {
	const message = resultMessage(failure);
	const createdBranch = message.includes(`Preparing worktree (new branch '${branch}')`);
	if (message.includes("unable to checkout working tree") || createdBranch) return true;
	if ((await listGitWorktrees(repoRoot)).some((entry) => path.resolve(entry.path) === path.resolve(worktreePath)) || await worktreePathExists(worktreePath)) return false;
	return (await executeGitCommand(repoRoot, [
		"show-ref",
		"--quiet",
		"--verify",
		`refs/heads/${branch}`
	])).code === 1;
}
async function runSetupScript(repoRoot, worktreePath) {
	const setupScript = path.join(repoRoot, ".openclaw", "worktree-setup.sh");
	const stat = await fs$1.stat(setupScript).catch(() => void 0);
	if (!stat?.isFile() || (stat.mode & 73) === 0) return;
	const result = await runCommandWithTimeout([setupScript], {
		timeoutMs: 12e4,
		cwd: worktreePath,
		env: {
			OPENCLAW_SOURCE_TREE_PATH: repoRoot,
			OPENCLAW_WORKTREE_PATH: worktreePath
		}
	});
	if (result.code !== 0) throw new Error(`worktree setup failed${resultMessage(result) ? `:\n${resultMessage(result)}` : ""}`);
}
/**
* Sums file sizes without following symlinks, so a link cannot inflate or escape
* the worktree. Missing paths are tolerated because cleanup races with removals;
* other failures propagate so an unreadable tree is never measured as zero bytes.
*/
async function directorySizeBytes(root) {
	let entries;
	try {
		entries = await fs$1.readdir(root, { withFileTypes: true });
	} catch (error) {
		if (isMissingPathError(error)) return 0;
		throw error;
	}
	let total = 0;
	for (const entry of entries) {
		const child = path.join(root, entry.name);
		if (entry.isDirectory() && !entry.isSymbolicLink()) total += await directorySizeBytes(child);
		else try {
			total += (await fs$1.lstat(child)).size;
		} catch (error) {
			if (!isMissingPathError(error)) throw error;
		}
	}
	return total;
}
async function containsGitMarker(root, checkoutRoot = false) {
	let entries;
	try {
		entries = await fs$1.readdir(root, { withFileTypes: true });
	} catch (error) {
		if (isMissingPathError(error)) return false;
		throw error;
	}
	for (const entry of entries) {
		if (entry.name === ".git") {
			if (!checkoutRoot) return true;
			continue;
		}
		if (entry.isDirectory() && await containsGitMarker(path.join(root, entry.name), false)) return true;
	}
	return false;
}
function splitNullBuffer(input) {
	const fields = [];
	let start = 0;
	for (let index = 0; index < input.length; index += 1) {
		if (input[index] !== 0) continue;
		if (index > start) fields.push(input.subarray(start, index));
		start = index + 1;
	}
	if (start < input.length) fields.push(input.subarray(start));
	return fields;
}
function gitPathKey(gitPath) {
	return gitPath.toString("hex");
}
function checkoutPathFromGitBytes(checkoutRoot, gitPath) {
	if (process.platform === "win32") return path.join(checkoutRoot, ...gitPath.toString("utf8").split("/"));
	return Buffer.concat([
		Buffer.from(checkoutRoot),
		Buffer.from(path.sep),
		gitPath
	]);
}
async function rawPathExists(target) {
	try {
		await fs$1.lstat(target);
		return true;
	} catch (error) {
		if (isMissingPathError(error)) return false;
		throw error;
	}
}
async function snapshotWorktree(record, reason, provisionedPaths) {
	const tempDir = await fs$1.mkdtemp(path.join(os.tmpdir(), "openclaw-worktree-index-"));
	const indexPath = path.join(tempDir, "index");
	const snapshotRef = `${SNAPSHOT_REF_PREFIX}/${record.id}`;
	const env = {
		GIT_INDEX_FILE: indexPath,
		GIT_AUTHOR_NAME: "OpenClaw",
		GIT_AUTHOR_EMAIL: "openclaw@localhost",
		GIT_COMMITTER_NAME: "OpenClaw",
		GIT_COMMITTER_EMAIL: "openclaw@localhost",
		...process.platform === "win32" ? {} : {
			GIT_CONFIG_COUNT: "1",
			GIT_CONFIG_KEY_0: "core.filemode",
			GIT_CONFIG_VALUE_0: "true"
		}
	};
	try {
		if (await containsGitMarker(record.path, true)) throw new Error("nested git repositories cannot be snapshotted losslessly");
		const provisioned = new Set(provisionedPaths.map((entry) => gitPathKey(Buffer.from(entry))));
		const snapshotPaths = /* @__PURE__ */ new Map();
		const addSnapshotPath = (entry) => {
			const key = gitPathKey(entry);
			if (!provisioned.has(key)) snapshotPaths.set(key, entry);
		};
		const sparseConfig = await executeGitCommand(record.path, [
			"config",
			"--bool",
			"core.sparseCheckout"
		]);
		if (sparseConfig.code !== 0 && sparseConfig.code !== 1) throw commandError("git config --bool core.sparseCheckout", sparseConfig);
		const sparseCheckout = sparseConfig.code === 0 && sparseConfig.stdout.trim() === "true";
		const sparseCandidates = [];
		for (const entry of splitNullBuffer(await requireGitCommandBuffer(record.path, [
			"ls-files",
			"-v",
			"-z"
		]))) {
			if (entry.length < 3) continue;
			const tag = String.fromCharCode(entry[0] ?? 0).toUpperCase();
			const trackedPath = entry.subarray(2);
			if (tag !== "S" || await rawPathExists(checkoutPathFromGitBytes(record.path, trackedPath)) || !sparseCheckout) addSnapshotPath(trackedPath);
			else sparseCandidates.push(trackedPath);
		}
		if (sparseCandidates.length > 0) {
			const included = await requireGitCommandBuffer(record.path, [
				"sparse-checkout",
				"check-rules",
				"-z"
			], { input: Buffer.concat(sparseCandidates.flatMap((entry) => [entry, Buffer.from([0])])) });
			for (const entry of splitNullBuffer(included)) addSnapshotPath(entry);
		}
		for (const args of [[
			"diff-index",
			"--cached",
			"--name-only",
			"-z",
			"HEAD",
			"--"
		], [
			"ls-files",
			"-z",
			"--others",
			"--exclude-standard"
		]]) for (const entry of splitNullBuffer(await requireGitCommandBuffer(record.path, args))) addSnapshotPath(entry);
		await requireGitCommand(record.path, ["read-tree", "HEAD"], { env });
		await requireGitCommand(record.path, [
			"update-index",
			"--add",
			"--remove",
			"-z",
			"--stdin"
		], {
			env,
			input: snapshotPaths.size > 0 ? Buffer.concat([...snapshotPaths.values()].flatMap((entry) => [entry, Buffer.from([0])])) : Buffer.alloc(0)
		});
		const tree = await requireGitCommand(record.path, ["write-tree"], { env });
		for (const provisionedPath of provisionedPaths) if (await requireGitCommand(record.path, [
			"--literal-pathspecs",
			"ls-tree",
			"-r",
			"--name-only",
			tree,
			"--",
			provisionedPath
		])) throw new Error(`provisioned path entered Git snapshot: ${provisionedPath}`);
		if ((await requireGitCommand(record.path, [
			"ls-tree",
			"-r",
			tree
		])).split("\n").some((entry) => entry.startsWith("160000 "))) throw new Error("nested git repositories cannot be snapshotted losslessly");
		const parent = await requireGitCommand(record.path, ["rev-parse", "HEAD"]);
		const commit = await requireGitCommand(record.path, [
			"commit-tree",
			tree,
			"-p",
			parent,
			"-m",
			`OpenClaw worktree snapshot: ${reason}`
		], { env });
		await requireGitCommand(record.repoRoot, [
			"update-ref",
			snapshotRef,
			commit
		]);
		return snapshotRef;
	} finally {
		await fs$1.rm(tempDir, {
			recursive: true,
			force: true
		});
	}
}
var ManagedWorktreeService = class {
	constructor(options = {}) {
		this.env = options.env ?? process.env;
		this.now = options.now ?? Date.now;
	}
	async worktreesRoot() {
		const root = path.join(resolveStateDir(this.env), "worktrees");
		await fs$1.mkdir(root, { recursive: true });
		return await fs$1.realpath(root);
	}
	async create(params) {
		const repository = await resolveRepository(params.repoRoot);
		if (params.ownerId) {
			const ownerKind = params.ownerKind ?? "manual";
			const ownerId = params.ownerId;
			const ownerKey = createHash("sha256").update(`${ownerKind}\0${ownerId}`).digest("hex");
			return await withOpenClawStateLease({
				scope: WORKTREE_OWNER_LEASE_SCOPE,
				key: ownerKey,
				database: {
					scope: "shared",
					options: { env: this.env }
				},
				leaseMs: WORKTREE_CREATE_LEASE_MS,
				waitMs: WORKTREE_CREATE_LEASE_WAIT_MS,
				leaseLabel: "managed worktree owner lease",
				operationLabel: "agents.worktrees.create.owner-lease"
			}, async () => {
				const existing = findLiveRegistryWorktreeByOwner(this.env, ownerKind, ownerId);
				if (existing && await worktreePathExists(existing.path)) {
					if (existing.repoRoot !== repository.repoRoot) throw new Error(`worktree owner ${ownerKind} ${ownerId} is already bound to another repository`);
					return existing;
				}
				if (existing) updateRegistryWorktree(this.env, existing.id, { removedAt: this.now() });
				return await this.createWithAllocationLease(params, repository);
			});
		}
		return await this.createWithAllocationLease(params, repository);
	}
	async createWithAllocationLease(params, repository) {
		const allocationName = params.name ?? params.suggestedName ?? createCrustaceanSlug();
		return await withOpenClawStateLease({
			scope: WORKTREE_CREATE_LEASE_SCOPE,
			key: `${repository.fingerprint}:${worktreeNameAllocationFamily(allocationName)}`,
			database: {
				scope: "shared",
				options: { env: this.env }
			},
			leaseMs: WORKTREE_CREATE_LEASE_MS,
			waitMs: WORKTREE_CREATE_LEASE_WAIT_MS,
			leaseLabel: "managed worktree creation lease",
			operationLabel: "agents.worktrees.create.lease"
		}, async () => await this.createForRepository(params, repository, allocationName));
	}
	async createForRepository(params, repository, inferredName) {
		const root = path.join(await this.worktreesRoot(), repository.fingerprint);
		const name = validateName(params.name ?? await generateName(this.env, repository.repoRoot, root, params, params.suggestedName ?? inferredName));
		const worktreePath = path.join(root, name);
		const existing = findRegistryWorktreeByPath(this.env, worktreePath);
		if (existing?.name === name && !existing.removedAt && !worktreeOwnerMatches(existing, params)) throw new Error(`worktree name is already in use by ${existing.ownerKind}${existing.ownerId ? ` ${existing.ownerId}` : ""}: ${name}`);
		if (existing?.name === name && existing.removedAt === void 0) {
			if (await worktreePathExists(existing.path)) return existing;
			updateRegistryWorktree(this.env, existing.id, { removedAt: this.now() });
		}
		if (existing?.name === name && existing.removedAt !== void 0 && existing.snapshotRef) {
			if (!worktreeOwnerMatches(existing, params)) throw new Error(`worktree name is already in use by ${existing.ownerKind}${existing.ownerId ? ` ${existing.ownerId}` : ""}: ${name}`);
			return await this.restore({ id: existing.id });
		}
		const branch = `openclaw/${name}`;
		const branchExists = await executeGitCommand(repository.repoRoot, [
			"show-ref",
			"--quiet",
			"--verify",
			`refs/heads/${branch}`
		]);
		if (branchExists.code === 0) throw new Error(`branch already exists: ${branch}`);
		if (branchExists.code !== 1) throw commandError("git show-ref --verify", branchExists);
		const base = await resolveWorktreeBase(repository.repoRoot, params.baseRef);
		params.commitGuard?.();
		await fs$1.mkdir(root, { recursive: true });
		let gitBase = base.gitOperand;
		let recordBase = base.recordRef;
		const runRepositorySetup = params.runSetupScript !== false;
		const worktreeAddArgs = () => [
			...runRepositorySetup ? [] : ["-c", `core.hooksPath=${os.devNull}`],
			"worktree",
			"add",
			"-b",
			branch,
			"--",
			worktreePath,
			gitBase
		];
		let added = await executeGitCommand(repository.repoRoot, worktreeAddArgs());
		if (added.code !== 0 && base.remote) {
			if (!await canResetFailedWorktreeAdd(repository.repoRoot, worktreePath, branch, added)) throw commandError("git worktree add", added);
			await resetFailedWorktreeAdd(repository.repoRoot, worktreePath, branch);
			gitBase = "HEAD";
			recordBase = "HEAD";
			added = await executeGitCommand(repository.repoRoot, worktreeAddArgs());
		}
		if (added.code !== 0) throw commandError("git worktree add", added);
		let provisionedPaths;
		try {
			provisionedPaths = await provisionIncludedFiles(repository.sourceRoot, worktreePath);
			if (runRepositorySetup) await runSetupScript(repository.sourceRoot, worktreePath);
			params.commitGuard?.();
		} catch (error) {
			try {
				await cleanupFailedCreate(repository.repoRoot, worktreePath, branch);
			} catch (cleanupError) {
				throw new Error(`${String(error)}\n${String(cleanupError)}`, { cause: cleanupError });
			}
			throw error;
		}
		const createdAt = this.now();
		const record = {
			id: randomUUID(),
			name,
			repoFingerprint: repository.fingerprint,
			repoRoot: repository.repoRoot,
			path: worktreePath,
			branch,
			baseRef: recordBase,
			ownerKind: params.ownerKind ?? "manual",
			...params.ownerId ? { ownerId: params.ownerId } : {},
			createdAt,
			lastActiveAt: createdAt
		};
		insertRegistryWorktree(this.env, record, { provisionedPaths });
		return record;
	}
	async list() {
		const records = listRegistryWorktrees(this.env);
		for (const record of records) if (record.removedAt === void 0 && !await worktreePathExists(record.path)) {
			const removedAt = this.now();
			updateRegistryWorktree(this.env, record.id, { removedAt });
			record.removedAt = removedAt;
		}
		return records.filter((record) => record.removedAt === void 0 || record.snapshotRef);
	}
	/** Returns persisted worktree facts without probing paths or mutating lifecycle state. */
	listRegistryRecords() {
		return listRegistryWorktrees(this.env);
	}
	findLiveByOwner(ownerKind, ownerId) {
		return findLiveRegistryWorktreeByOwner(this.env, ownerKind, ownerId);
	}
	findLiveById(id) {
		const record = getRegistryWorktree(this.env, id);
		return record?.removedAt === void 0 ? record : void 0;
	}
	/** Resolves the canonical registry root and the caller's own checkout root. */
	async resolveRepositoryPaths(repoRoot) {
		const resolved = await resolveRepository(repoRoot);
		return {
			canonicalRoot: resolved.repoRoot,
			sourceRoot: resolved.sourceRoot
		};
	}
	/** Resolves the repository facts shared by managed worktrees and project discovery. */
	async resolveRepositoryIdentity(repoRoot) {
		const resolved = await resolveRepository(repoRoot);
		return {
			checkoutRoot: resolved.sourceRoot,
			repoRoot: resolved.repoRoot,
			originUrl: resolved.originUrl,
			fingerprint: resolved.fingerprint
		};
	}
	/**
	* Lists selectable base refs for a repository without touching the network.
	* Base-ref pickers must stay snappy; resolveWorktreeBase() still fetches on create
	* when no explicit ref is chosen.
	*/
	async listRepositoryBranches(repoRoot, options = {}) {
		let repository;
		if (options.includeRepositoryStatus) try {
			const requested = await fs$1.realpath(repoRoot);
			if (!(await fs$1.stat(requested)).isDirectory()) return {
				branches: [],
				repositoryStatus: "unavailable"
			};
			if (!insideGitCheckout(requested)) return {
				branches: [],
				repositoryStatus: "not_git"
			};
			repository = await resolveRepositoryFromRealPath(requested, repoRoot);
		} catch {
			return {
				branches: [],
				repositoryStatus: "unavailable"
			};
		}
		else repository = await resolveRepository(repoRoot);
		const branches = /* @__PURE__ */ new Map();
		const remoteRaw = await executeGitCommand(repository.repoRoot, [
			"for-each-ref",
			"--format=%(refname)",
			"refs/remotes"
		]);
		if (remoteRaw.code === 0) for (const refname of remoteRaw.stdout.split("\n")) {
			const trimmed = refname.trim();
			if (!trimmed.startsWith("refs/remotes/")) continue;
			const withoutPrefix = trimmed.slice(13);
			const slash = withoutPrefix.indexOf("/");
			if (slash <= 0) continue;
			const shortName = withoutPrefix.slice(slash + 1);
			if (!shortName || shortName === "HEAD") continue;
			branches.set(shortName, {
				name: withoutPrefix,
				kind: "remote"
			});
		}
		const localRaw = await executeGitCommand(repository.repoRoot, [
			"for-each-ref",
			"--format=%(refname:short)",
			"refs/heads"
		]);
		if (localRaw.code === 0) for (const line of localRaw.stdout.split("\n")) {
			const name = line.trim();
			if (name) branches.set(name, {
				name,
				kind: "local"
			});
		}
		const remoteHead = await executeGitCommand(repository.repoRoot, [
			"symbolic-ref",
			"--quiet",
			"--short",
			"refs/remotes/origin/HEAD"
		]);
		const defaultShort = remoteHead.code === 0 ? remoteHead.stdout.trim().replace(/^origin\//, "") || void 0 : void 0;
		const head = await executeGitCommand(repository.repoRoot, [
			"symbolic-ref",
			"--quiet",
			"--short",
			"HEAD"
		]);
		const headBranch = head.code === 0 ? head.stdout.trim() || void 0 : void 0;
		const defaultBranch = defaultShort ? branches.get(defaultShort)?.name ?? defaultShort : void 0;
		const rank = (shortName) => shortName === defaultShort ? 0 : shortName === headBranch ? 1 : 2;
		return {
			branches: [...branches.entries()].toSorted(([aShort, a], [bShort, b]) => rank(aShort) - rank(bShort) || a.name.localeCompare(b.name)).map(([, branch]) => branch),
			...defaultBranch ? { defaultBranch } : {},
			...headBranch ? { headBranch } : {},
			...options.includeRepositoryStatus ? { repositoryStatus: "git" } : {}
		};
	}
	async acquire(id) {
		const record = this.requireLiveRecord(id);
		await lockWorktreeForProcess(record);
		const lastActiveAt = this.now();
		updateRegistryWorktree(this.env, id, { lastActiveAt });
		return {
			...record,
			lastActiveAt
		};
	}
	async release(id) {
		const record = getRegistryWorktree(this.env, id);
		if (!record || record.removedAt !== void 0 || !await worktreePathExists(record.path)) return;
		const state = await lockState(record);
		if (state.kind === "live" && state.pid !== process.pid) return;
		if (state.kind === "foreign") return;
		if (state.kind !== "none") await unlockWorktree(record);
	}
	async remove(params) {
		const record = this.requireLiveRecord(params.id);
		const force = params.force ?? false;
		const claimToken = params.claimToken ?? randomUUID();
		claimWorktreeRemoval(this.env, {
			worktreeId: record.id,
			token: claimToken,
			force
		});
		try {
			const state = await lockState(record);
			if ((state.kind === "live" || state.kind === "foreign") && !force) throw new Error(state.kind === "live" ? `worktree is locked by live OpenClaw pid ${state.pid}` : `worktree has a foreign lock${state.reason ? `: ${state.reason}` : ""}`);
			if (state.kind !== "none") await requireGitCommand(record.repoRoot, [
				"worktree",
				"unlock",
				record.path
			]);
			let snapshotRef = record.snapshotRef;
			let snapshotError;
			try {
				const provisionedState = await snapshotProvisionedFiles(this.env, record.id, record.path, getRegistryWorktreeProvisionedPaths(this.env, record.id));
				snapshotRef = await snapshotWorktree(record, params.reason, provisionedState.map((entry) => entry.path));
				updateRegistryWorktree(this.env, record.id, {
					snapshotRef,
					provisionedState
				});
			} catch (error) {
				snapshotError = error instanceof Error ? error.message : String(error);
				try {
					clearRegistryWorktreeProvisionedChunks(this.env, record.id);
				} catch (cleanupError) {
					throw new WorktreeSnapshotError(`${snapshotError}; provisioned snapshot cleanup failed: ${String(cleanupError)}`, { cause: cleanupError });
				}
				if (!force) throw new WorktreeSnapshotError(snapshotError, { cause: error });
			}
			const removed = await executeGitCommand(record.repoRoot, [
				"worktree",
				"remove",
				"--force",
				record.path
			]);
			if (removed.code !== 0) throw commandError("git worktree remove", removed);
			const branchDelete = await executeGitCommand(record.repoRoot, [
				"branch",
				"-D",
				record.branch
			]);
			if (branchDelete.code !== 0) throw commandError("git branch -D", branchDelete);
			await requireGitCommand(record.repoRoot, ["worktree", "prune"]);
			await removeEmptyParents(path.dirname(record.path), await this.worktreesRoot());
			const removedAt = this.now();
			updateRegistryWorktree(this.env, record.id, {
				removedAt,
				snapshotRef,
				...params.runEndCleanup ? { runEndCleanup: params.runEndCleanup } : {}
			});
			finalizeWorktreeRemoval(this.env, record.id);
			return {
				removed: true,
				...snapshotRef ? { snapshotRef } : {},
				...snapshotError ? { snapshotError } : {}
			};
		} catch (error) {
			abortWorktreeRemoval(this.env, record.id, claimToken);
			throw error;
		}
	}
	async restore(params) {
		const record = getRegistryWorktree(this.env, params.id);
		if (!record?.snapshotRef || record.removedAt === void 0) throw new Error(`worktree ${params.id} is not restorable`);
		if (!await worktreePathExists(record.repoRoot)) throw new Error(`source repository no longer exists: ${record.repoRoot}`);
		const parent = await requireGitCommand(record.repoRoot, ["rev-parse", `${record.snapshotRef}^`]);
		await fs$1.mkdir(path.dirname(record.path), { recursive: true });
		await requireGitCommand(record.repoRoot, [
			"worktree",
			"add",
			"--detach",
			record.path,
			record.snapshotRef
		]);
		let branchCreated = false;
		let restoredProvisionedPaths;
		try {
			await requireGitCommand(record.repoRoot, [
				"branch",
				record.branch,
				parent
			]);
			branchCreated = true;
			await requireGitCommand(record.path, [
				"symbolic-ref",
				"HEAD",
				`refs/heads/${record.branch}`
			]);
			await requireGitCommand(record.path, ["reset"]);
			const provisionedState = getRegistryWorktreeProvisionedState(this.env, record.id);
			if (provisionedState === void 0) throw new Error(`worktree ${record.id} snapshot lacks provisioned file metadata`);
			await restoreProvisionedFiles(this.env, record.id, record.path, provisionedState);
			restoredProvisionedPaths = provisionedState.map((state) => state.path);
		} catch (error) {
			const removed = await executeGitCommand(record.repoRoot, [
				"worktree",
				"remove",
				"--force",
				record.path
			]);
			const branchDeleted = branchCreated ? await executeGitCommand(record.repoRoot, [
				"branch",
				"-D",
				record.branch
			]) : void 0;
			if (removed.code !== 0 || branchDeleted && branchDeleted.code !== 0) throw new Error(`${String(error)}\nrestore cleanup failed: ${resultMessage(removed) || (branchDeleted ? resultMessage(branchDeleted) : "")}`, { cause: error });
			throw error;
		}
		const lastActiveAt = Math.max(this.now(), record.lastActiveAt + 1);
		updateRegistryWorktree(this.env, params.id, {
			removedAt: void 0,
			lastActiveAt,
			provisionedPaths: restoredProvisionedPaths,
			runEndCleanup: void 0
		});
		finalizeWorktreeRemoval(this.env, params.id);
		const restored = {
			...record,
			lastActiveAt
		};
		delete restored.removedAt;
		delete restored.runEndCleanup;
		return restored;
	}
	async removeIfLossless(id) {
		const record = this.requireLiveRecord(id);
		const claimToken = randomUUID();
		const recordOutcome = (outcome, error) => {
			updateRegistryWorktree(this.env, id, { runEndCleanup: {
				outcome,
				at: this.now(),
				...outcome === "failed" ? { reason: truncateUtf16Safe(formatErrorMessage(error), 500) } : {}
			} }, {
				onlyIfLive: true,
				onlyIfActiveAt: record.lastActiveAt
			});
		};
		try {
			claimWorktreeRemoval(this.env, {
				worktreeId: id,
				token: claimToken,
				force: false
			});
		} catch (error) {
			if (error instanceof WorktreeRemovalContentionError) {
				if (error.kind === "finalized") return false;
				recordOutcome("retained-busy");
				return false;
			}
			try {
				recordOutcome("failed", error);
			} catch {}
			throw error;
		}
		try {
			const status = await requireGitCommand(record.path, ["status", "--porcelain"]);
			const unpushed = await requireGitCommand(record.path, [
				"log",
				"HEAD",
				"--not",
				"--remotes",
				"--oneline"
			]);
			const ignoredDrift = await hasUnsnapshotableProvisionedFiles(record.path, getRegistryWorktreeProvisionedPaths(this.env, record.id));
			const retainedOutcome = status ? "retained-dirty" : unpushed ? "retained-unpushed" : ignoredDrift ? "retained-provisioned-drift" : void 0;
			if (retainedOutcome) {
				abortWorktreeRemoval(this.env, id, claimToken);
				recordOutcome(retainedOutcome);
				return false;
			}
		} catch (error) {
			abortWorktreeRemoval(this.env, id, claimToken);
			recordOutcome("failed", error);
			throw error;
		}
		try {
			await this.release(id);
			await this.remove({
				id,
				reason: "run-end",
				claimToken,
				runEndCleanup: {
					outcome: "removed-lossless",
					at: this.now()
				}
			});
		} catch (error) {
			abortWorktreeRemoval(this.env, id, claimToken);
			recordOutcome("failed", error);
			throw error;
		}
		return true;
	}
	async removeIfLosslessByPath(worktreePath, owner) {
		const record = findLiveRegistryWorktreeByPath(this.env, worktreePath);
		if (!record || !worktreeOwnerMatches(record, owner)) return false;
		return await this.removeIfLossless(record.id);
	}
	async releaseByPath(worktreePath) {
		const record = findLiveRegistryWorktreeByPath(this.env, worktreePath);
		if (record) await this.release(record.id);
	}
	async gc(params = {}) {
		const now = this.now();
		const removed = [];
		const records = listRegistryWorktrees(this.env);
		for (const record of records) try {
			if (record.removedAt === void 0 && !await worktreePathExists(record.path)) {
				updateRegistryWorktree(this.env, record.id, { removedAt: now });
				record.removedAt = now;
			}
			const expiresWhenIdle = record.ownerKind === "workboard" || record.ownerKind === "session";
			if (record.removedAt === void 0 && expiresWhenIdle && now - record.lastActiveAt > 6048e5) {
				if (await this.isProtectedFromAutoRemoval(record, params.shouldProtectOwner)) continue;
				await this.remove({
					id: record.id,
					reason: "idle-gc"
				});
				removed.push(record.id);
			}
		} catch (error) {
			log.warn(`idle cleanup failed for ${record.id}: ${String(error)}`);
		}
		removed.push(...await this.enforceCleanupLimits(params));
		const orphansDeleted = await this.reconcileOrphans(records);
		let snapshotsPruned = 0;
		for (const record of listRegistryWorktrees(this.env)) {
			if (record.removedAt === void 0 || now - record.removedAt <= 2592e6) continue;
			try {
				if (record.snapshotRef && await worktreePathExists(record.repoRoot)) await requireGitCommand(record.repoRoot, [
					"update-ref",
					"-d",
					record.snapshotRef
				]);
				deleteRegistryWorktree(this.env, record.id);
				snapshotsPruned += 1;
			} catch (error) {
				log.warn(`snapshot retention failed for ${record.id}: ${String(error)}`);
			}
		}
		return {
			removed,
			orphansDeleted,
			snapshotsPruned
		};
	}
	/**
	* Shared auto-removal guard for idle and limit cleanup: owner protection, live
	* run leases, and live/foreign git locks veto removal; a dead lock is cleared.
	*/
	async isProtectedFromAutoRemoval(record, shouldProtectOwner) {
		if (record.ownerId !== void 0 && shouldProtectOwner?.(record.ownerKind, record.ownerId) === true) return true;
		if (hasLiveWorktreeRunLease(this.env, record.id)) return true;
		if (await hasUnsnapshotableProvisionedFiles(record.path, getRegistryWorktreeProvisionedPaths(this.env, record.id))) return true;
		const state = await lockState(record);
		if (state.kind === "live" || state.kind === "foreign") return true;
		if (state.kind === "dead") await requireGitCommand(record.repoRoot, [
			"worktree",
			"unlock",
			record.path
		]);
		return false;
	}
	/**
	* Enforces optional count/size retention across all live managed worktrees.
	* Manual worktrees count toward the totals but are never limit-evicted, so a
	* limit can stay exceeded when only protected worktrees remain.
	*/
	async enforceCleanupLimits(params) {
		const limits = params.limits ?? {};
		if (limits.maxCount === void 0 && limits.maxTotalSizeBytes === void 0) return [];
		const live = listRegistryWorktrees(this.env).filter((record) => record.removedAt === void 0);
		const sizes = /* @__PURE__ */ new Map();
		let totalBytes = 0;
		if (limits.maxTotalSizeBytes !== void 0) for (const record of live) try {
			const bytes = await directorySizeBytes(record.path);
			sizes.set(record.id, bytes);
			totalBytes += bytes;
		} catch (error) {
			log.warn(`worktree size measurement failed for ${record.id}: ${String(error)}`);
		}
		let liveCount = live.length;
		const overLimit = () => limits.maxCount !== void 0 && liveCount > limits.maxCount || limits.maxTotalSizeBytes !== void 0 && totalBytes > limits.maxTotalSizeBytes;
		if (!overLimit()) return [];
		const refreshTotals = () => {
			const liveIds = new Set(listRegistryWorktrees(this.env).filter((record) => record.removedAt === void 0).map((record) => record.id));
			liveCount = liveIds.size;
			if (limits.maxTotalSizeBytes !== void 0) {
				totalBytes = 0;
				for (const [id, bytes] of sizes) if (liveIds.has(id)) totalBytes += bytes;
			}
			return liveIds;
		};
		const removed = [];
		const candidates = live.filter((record) => record.ownerKind === "workboard" || record.ownerKind === "session").toSorted((a, b) => a.lastActiveAt - b.lastActiveAt);
		for (const record of candidates) {
			const liveIds = refreshTotals();
			if (!overLimit()) break;
			if (!liveIds.has(record.id)) continue;
			try {
				if (await this.isProtectedFromAutoRemoval(record, params.shouldProtectOwner)) continue;
				await this.remove({
					id: record.id,
					reason: "limit-gc"
				});
			} catch (error) {
				log.warn(`cleanup limit removal failed for ${record.id}: ${String(error)}`);
				continue;
			}
			removed.push(record.id);
		}
		refreshTotals();
		if (overLimit()) log.warn(`worktree cleanup limits still exceeded after evicting ${removed.length}; remaining worktrees are protected or manual`);
		return removed;
	}
	requireLiveRecord(id) {
		const record = getRegistryWorktree(this.env, id);
		if (!record || record.removedAt !== void 0) throw new Error(`unknown active worktree: ${id}`);
		return record;
	}
	async reconcileOrphans(records) {
		const managedPaths = /* @__PURE__ */ new Set();
		for (const record of records) try {
			managedPaths.add(await canonicalPathKey(record.path));
		} catch (error) {
			if (!isMissingPathError(error)) throw error;
		}
		const worktreesRoot = await this.worktreesRoot();
		const fingerprints = await fs$1.readdir(worktreesRoot, { withFileTypes: true }).catch(() => []);
		let deleted = 0;
		for (const fingerprint of fingerprints) {
			if (!fingerprint.isDirectory()) continue;
			const fingerprintPath = path.join(worktreesRoot, fingerprint.name);
			if (await shouldPreserveOrphanCandidate(fingerprintPath, managedPaths)) continue;
			const names = await fs$1.readdir(fingerprintPath, { withFileTypes: true }).catch(() => []);
			for (const name of names) {
				if (!name.isDirectory()) continue;
				const candidate = path.join(fingerprintPath, name.name);
				if (await shouldPreserveOrphanCandidate(candidate, managedPaths)) continue;
				await fs$1.rm(candidate, {
					recursive: true,
					force: true
				});
				deleted += 1;
			}
			await fs$1.rmdir(fingerprintPath).catch(() => void 0);
		}
		return deleted;
	}
};
const managedWorktrees = new ManagedWorktreeService();
//#endregion
export { WorktreeRepositoryError as a, resolveWorktreeCleanupLimits as c, WORKTREE_GC_INTERVAL_MS as i, slugifyWorktreeTitle as l, ManagedWorktreeService as n, WorktreeSnapshotError as o, SNAPSHOT_RETENTION_MS as r, managedWorktrees as s, IDLE_GC_MS as t };
