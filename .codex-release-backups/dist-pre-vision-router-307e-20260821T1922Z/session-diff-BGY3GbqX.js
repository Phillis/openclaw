import "./src-BkwWvwB2.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { t as runCommandBuffered } from "./exec-BL80Wdzl.js";
import { u as runGit } from "./git-DHuziQrS.js";
import crypto from "node:crypto";
import { constants } from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
//#region src/sessions/session-diff-revisions.ts
/** Picks the merge base used for branch-relative session diffs. */
async function resolveSessionDiffBase(params) {
	const remoteDefault = (await params.gitOut(params.root, [
		"symbolic-ref",
		"--short",
		"refs/remotes/origin/HEAD"
	]))?.trim() || null;
	const defaultShort = remoteDefault?.replace(/^origin\//, "");
	if (remoteDefault && defaultShort && params.branch && params.branch !== defaultShort) {
		const mergeBase = await params.gitOut(params.root, [
			"merge-base",
			remoteDefault,
			"HEAD"
		]);
		if (mergeBase?.trim()) return {
			base: mergeBase.trim(),
			baseRef: defaultShort
		};
	}
	if (params.branch && params.branch !== "main" && params.branch !== "master") {
		for (const candidate of ["main", "master"]) if ((await params.gitOut(params.root, [
			"rev-parse",
			"--verify",
			"--quiet",
			candidate
		]))?.trim()) {
			const mergeBase = await params.gitOut(params.root, [
				"merge-base",
				candidate,
				"HEAD"
			]);
			if (mergeBase?.trim()) return {
				base: mergeBase.trim(),
				baseRef: candidate
			};
		}
	}
	return {
		base: "HEAD",
		baseRef: "HEAD"
	};
}
/** Resolves the repository-format-specific empty tree without writing it. */
async function resolveSessionDiffEmptyTree(root) {
	try {
		const result = await runGit(root, [
			"hash-object",
			"-t",
			"tree",
			"--stdin"
		], { input: "" });
		const emptyTree = result.code === 0 ? result.stdout.trim() : "";
		return emptyTree ? { base: emptyTree } : null;
	} catch {
		return null;
	}
}
function parseCommitRecord(line) {
	const separator = line.indexOf("\0");
	if (separator <= 0) return;
	return {
		sha: line.slice(0, separator),
		subject: line.slice(separator + 1)
	};
}
function parseCommitRecords(text) {
	return text.split("\n").map(parseCommitRecord).filter((record) => record !== void 0);
}
/** Loads the bounded branch history metadata shared by every diff scope. */
async function loadSessionDiffBranchMetadata(params) {
	if (params.base === "HEAD" || params.base === params.head) return {};
	const range = `${params.base}..HEAD`;
	const [aheadText, commitsText, mergeBaseText] = await Promise.all([
		params.gitOut(params.root, [
			"rev-list",
			"--count",
			range
		]),
		params.gitOut(params.root, [
			"log",
			"--max-count=50",
			"--format=%h%x00%s",
			range,
			"--"
		]),
		params.gitOut(params.root, [
			"show",
			"--no-patch",
			"--format=%h%x00%s",
			params.base,
			"--"
		])
	]);
	const normalizedAhead = aheadText?.trim();
	const aheadCount = normalizedAhead && /^\d+$/.test(normalizedAhead) ? Number.parseInt(normalizedAhead, 10) : void 0;
	const mergeBase = mergeBaseText ? parseCommitRecords(mergeBaseText)[0] : void 0;
	return {
		...aheadCount !== void 0 ? { aheadCount } : {},
		...commitsText !== null ? { commits: parseCommitRecords(commitsText) } : {},
		...mergeBase ? { mergeBase } : {}
	};
}
//#endregion
//#region src/sessions/session-diff.ts
const MAX_FILES = 500;
const MAX_UNTRACKED_FILES = 100;
const MAX_PATCH_BYTES_PER_FILE = 1e5;
const MAX_TOTAL_PATCH_BYTES = 15e5;
const MAX_BASELINE_GIT_OUTPUT_BYTES = 512e3;
const MAX_BASELINE_FILE_BYTES = 4 * 1024 * 1024;
const MAX_BASELINE_TOTAL_BYTES = 16 * 1024 * 1024;
const MAX_TOTAL_CHANGED_LINES = 1e5;
async function gitOut(cwd, args, okCodes = [0]) {
	try {
		const result = await runGit(cwd, [
			"-c",
			"core.quotePath=false",
			...args
		]);
		return okCodes.includes(result.code ?? -1) ? result.stdout : null;
	} catch {
		return null;
	}
}
/** Parses `git diff --name-status -z -M` output; R/C entries consume two paths. */
function parseNameStatusZ(text) {
	const tokens = text.split("\0");
	const entries = [];
	for (let i = 0; i < tokens.length; i += 1) {
		const code = tokens[i];
		if (!code) continue;
		const letter = code[0];
		if (letter === "R" || letter === "C") {
			const oldPath = tokens[i + 1];
			const path = tokens[i + 2];
			i += 2;
			if (path) entries.push({
				path,
				oldPath,
				status: letter === "R" ? "renamed" : "added"
			});
			continue;
		}
		const path = tokens[i + 1];
		i += 1;
		if (!path) continue;
		const status = letter === "A" ? "added" : letter === "D" ? "deleted" : "modified";
		entries.push({
			path,
			status
		});
	}
	return entries;
}
/** Parses `git diff --numstat -z -M`; rename entries put paths in follow-up tokens. */
function parseNumstatZ(text) {
	const tokens = text.split("\0");
	const byPath = /* @__PURE__ */ new Map();
	for (let i = 0; i < tokens.length; i += 1) {
		const token = tokens[i];
		if (!token) continue;
		const [added, deleted, inlinePath] = token.split("	");
		if (added === void 0 || deleted === void 0) continue;
		const binary = added === "-";
		const entry = {
			additions: binary ? 0 : Number.parseInt(added, 10) || 0,
			deletions: binary ? 0 : Number.parseInt(deleted, 10) || 0,
			binary
		};
		if (inlinePath) {
			byPath.set(inlinePath, entry);
			continue;
		}
		const path = tokens[i + 2];
		i += 2;
		if (path) byPath.set(path, entry);
	}
	return byPath;
}
function chunkPath(chunk) {
	const newFile = /^\+\+\+ b\/(.+)$/m.exec(chunk);
	if (newFile) return expectDefined(newFile[1], "new file capture group 1");
	const oldFile = /^--- a\/(.+)$/m.exec(chunk);
	if (oldFile) return expectDefined(oldFile[1], "old file capture group 1");
	const renameTo = /^rename to (.+)$/m.exec(chunk);
	if (renameTo) return expectDefined(renameTo[1], "rename to capture group 1");
	const header = /^diff --git a\/.+ b\/(.+)$/m.exec(chunk);
	return header ? expectDefined(header[1], "header capture group 1") : null;
}
/** Splits a multi-file `git diff --patch` into per-file chunks keyed by path. */
function splitPatchByFile(patch) {
	const byPath = /* @__PURE__ */ new Map();
	if (!patch.trim()) return byPath;
	const parts = patch.split(/^(?=diff --git )/m);
	for (const part of parts) {
		if (!part.startsWith("diff --git ")) continue;
		const path = chunkPath(part);
		if (path) byPath.set(path, part);
	}
	return byPath;
}
function isBinaryChunk(chunk) {
	return /^Binary files .* differ$/m.test(chunk) || chunk.includes("\nGIT binary patch\n");
}
function countPatchAdditions(chunk) {
	let additions = 0;
	let inHunk = false;
	for (const line of chunk.split("\n")) {
		if (line.startsWith("@@")) {
			inHunk = true;
			continue;
		}
		if (inHunk && line.startsWith("+")) additions += 1;
	}
	return additions;
}
/**
* A patch-producing `git diff` reads working-tree file contents, so a
* checkout-planted hardlink to an out-of-tree secret would otherwise leak
* through this read-scoped RPC (same threat the fs-safe workspace readers
* reject). Content is only emitted for a real, single-linked regular file
* whose realpath stays inside the checkout. Deleted files are exempt: git
* reads their content from the object DB, never the filesystem.
*/
async function isPatchableWorkingTreePath(realRoot, relPath) {
	const abs = path.resolve(realRoot, relPath);
	try {
		const info = await fs$1.lstat(abs);
		if (!info.isFile() || info.nlink !== 1) return false;
		const resolved = await fs$1.realpath(abs);
		return resolved === realRoot || resolved.startsWith(realRoot + path.sep);
	} catch {
		return false;
	}
}
function takePatch(chunk, budget) {
	if (!chunk) return { truncated: true };
	const bytes = Buffer.byteLength(chunk, "utf8");
	if (bytes > MAX_PATCH_BYTES_PER_FILE || bytes > budget.remaining) return { truncated: true };
	budget.remaining -= bytes;
	return { patch: chunk };
}
async function collectUntrackedFiles(root, realRoot, budget) {
	const paths = (await gitOut(root, [
		"ls-files",
		"--others",
		"--exclude-standard",
		"-z"
	]) ?? "").split("\0").filter(Boolean);
	const truncated = paths.length > MAX_UNTRACKED_FILES;
	const files = [];
	for (const filePath of paths.slice(0, MAX_UNTRACKED_FILES)) {
		if (!await isPatchableWorkingTreePath(realRoot, filePath)) {
			files.push({
				path: filePath,
				status: "added",
				additions: 0,
				deletions: 0,
				untracked: true,
				truncated: true
			});
			continue;
		}
		const patch = await gitOut(root, [
			"diff",
			"--no-color",
			"--no-ext-diff",
			"--no-textconv",
			"--no-index",
			"--",
			"/dev/null",
			filePath
		], [0, 1]);
		if (patch === null) {
			files.push({
				path: filePath,
				status: "added",
				additions: 0,
				deletions: 0,
				untracked: true,
				truncated: true
			});
			continue;
		}
		if (isBinaryChunk(patch)) {
			files.push({
				path: filePath,
				status: "added",
				additions: 0,
				deletions: 0,
				untracked: true,
				binary: true
			});
			continue;
		}
		const additions = countPatchAdditions(patch);
		files.push({
			path: filePath,
			status: "added",
			additions,
			deletions: 0,
			untracked: true,
			...takePatch(patch, budget)
		});
	}
	return {
		files,
		truncated
	};
}
async function collectTrackedFiles(root, realRoot, revisions, budget) {
	const diffArgs = (options) => [
		"diff",
		"-M",
		...options,
		...revisions,
		"--"
	];
	const nameStatus = await gitOut(root, diffArgs(["--name-status", "-z"]));
	if (nameStatus === null) return {
		files: [],
		truncated: false
	};
	const entries = parseNameStatusZ(nameStatus);
	if (entries.length === 0) return {
		files: [],
		truncated: false
	};
	const numstat = parseNumstatZ(await gitOut(root, diffArgs(["--numstat", "-z"])) ?? "");
	const patchText = [...numstat.values()].reduce((sum, entry) => sum + entry.additions + entry.deletions, 0) > MAX_TOTAL_CHANGED_LINES ? null : await gitOut(root, diffArgs([
		"--patch",
		"--no-color",
		"--no-ext-diff",
		"--no-textconv"
	]));
	const chunks = patchText === null ? /* @__PURE__ */ new Map() : splitPatchByFile(patchText);
	const truncated = entries.length > MAX_FILES;
	const files = [];
	for (const entry of entries.slice(0, MAX_FILES)) {
		const stat = numstat.get(entry.path);
		const chunk = chunks.get(entry.path);
		const binary = stat?.binary === true || chunk !== void 0 && isBinaryChunk(chunk);
		const file = {
			path: entry.path,
			status: entry.status,
			additions: stat?.additions ?? 0,
			deletions: stat?.deletions ?? 0
		};
		if (entry.oldPath) file.oldPath = entry.oldPath;
		if (binary) {
			file.binary = true;
			files.push(file);
			continue;
		}
		if (!(revisions.length === 2 || entry.status === "deleted" || await isPatchableWorkingTreePath(realRoot, entry.path))) {
			file.truncated = true;
			files.push(file);
			continue;
		}
		const taken = takePatch(chunk, budget);
		if (taken.patch !== void 0) file.patch = taken.patch;
		if (taken.truncated) file.truncated = true;
		files.push(file);
	}
	return {
		files,
		truncated
	};
}
async function loadCheckoutDiff(params) {
	const empty = (unavailableReason) => ({
		sessionKey: params.sessionKey,
		files: [],
		additions: 0,
		deletions: 0,
		...unavailableReason ? { unavailableReason } : {}
	});
	const root = (await gitOut(params.cwd, ["rev-parse", "--show-toplevel"]))?.trim();
	if (!root) return empty("not_git");
	const realRoot = await fs$1.realpath(root).catch(() => root);
	const branchOut = (await gitOut(root, [
		"rev-parse",
		"--abbrev-ref",
		"HEAD"
	]))?.trim();
	const branch = branchOut && branchOut !== "HEAD" ? branchOut : void 0;
	const head = (await gitOut(root, [
		"rev-parse",
		"--verify",
		"--quiet",
		"HEAD"
	]))?.trim();
	const branchBase = head ? await resolveSessionDiffBase({
		branch,
		gitOut,
		root
	}) : await resolveSessionDiffEmptyTree(root);
	const metadata = head && branchBase ? await loadSessionDiffBranchMetadata({
		base: branchBase.base,
		gitOut,
		head,
		root
	}) : {};
	const repositoryFields = {
		sessionKey: params.sessionKey,
		root,
		...branch ? { branch } : {},
		...branchBase?.baseRef ? { baseRef: branchBase.baseRef } : {},
		...metadata
	};
	const unknownCommit = () => ({
		...repositoryFields,
		files: [],
		additions: 0,
		deletions: 0,
		unavailableReason: "unknown_commit"
	});
	const scope = params.scope ?? "all";
	let revisions;
	if (scope === "commit") {
		if (!head || !branchBase || branchBase.base === "HEAD" || branchBase.base === head) return unknownCommit();
		const commit = (await gitOut(root, [
			"rev-parse",
			"--verify",
			"--quiet",
			"--end-of-options",
			`${params.commit}^{commit}`
		]))?.trim();
		if (!commit) return unknownCommit();
		const isCommitInHeadHistory = await gitOut(root, [
			"merge-base",
			"--is-ancestor",
			commit,
			"HEAD"
		], [0]) !== null;
		const isCommitInBaseHistory = await gitOut(root, [
			"merge-base",
			"--is-ancestor",
			commit,
			branchBase.base
		], [0]) !== null;
		if (!isCommitInHeadHistory || isCommitInBaseHistory) return unknownCommit();
		const parent = (await gitOut(root, [
			"rev-parse",
			"--verify",
			"--quiet",
			`${commit}^`
		]))?.trim();
		const commitBase = parent ? { base: parent } : await resolveSessionDiffEmptyTree(root);
		revisions = commitBase ? [commitBase.base, commit] : void 0;
	} else if (scope === "uncommitted") revisions = head ? ["HEAD"] : branchBase ? [branchBase.base] : void 0;
	else revisions = branchBase ? [branchBase.base] : void 0;
	const budget = { remaining: MAX_TOTAL_PATCH_BYTES };
	const tracked = revisions ? await collectTrackedFiles(root, realRoot, revisions, budget) : {
		files: [],
		truncated: false
	};
	const untracked = scope === "commit" ? {
		files: [],
		truncated: false
	} : await collectUntrackedFiles(root, realRoot, budget);
	const files = [...tracked.files, ...untracked.files].toSorted((a, b) => a.path.localeCompare(b.path));
	const additions = files.reduce((sum, file) => sum + file.additions, 0);
	const deletions = files.reduce((sum, file) => sum + file.deletions, 0);
	const truncated = tracked.truncated || untracked.truncated || files.some((file) => file.truncated === true);
	return {
		...repositoryFields,
		files,
		additions,
		deletions,
		...truncated ? { truncated: true } : {}
	};
}
function sameMutationFingerprint(left, right) {
	return left.ctimeNs === right.ctimeNs && left.dev === right.dev && left.ino === right.ino && left.mode === right.mode && left.mtimeNs === right.mtimeNs && left.nlink === right.nlink && left.size === right.size;
}
function hashBaselineDescriptor(candidate, content) {
	return crypto.createHash("sha256").update([
		candidate.path,
		candidate.oldPath ?? "",
		candidate.status,
		candidate.untracked === true ? "untracked" : "tracked",
		content
	].join("\0")).digest("hex");
}
async function fingerprintBaselineCandidate(params) {
	const { candidate } = params;
	if (candidate.status === "deleted") return hashBaselineDescriptor(candidate, "deleted");
	const absolutePath = path.resolve(params.root, candidate.path);
	const relativePath = path.relative(params.root, absolutePath);
	if (relativePath === ".." || relativePath.startsWith(`..${path.sep}`) || path.isAbsolute(relativePath)) return;
	const initial = await fs$1.lstat(absolutePath, { bigint: true }).catch(() => void 0);
	if (!initial) return;
	if (initial.isSymbolicLink()) {
		const target = await fs$1.readlink(absolutePath).catch(() => void 0);
		return target === void 0 ? void 0 : hashBaselineDescriptor(candidate, `symlink:${target}`);
	}
	if (!initial.isFile() || initial.nlink !== 1n || initial.size > BigInt(MAX_BASELINE_FILE_BYTES) || initial.size > BigInt(params.budget.remaining)) return;
	const resolved = await fs$1.realpath(absolutePath).catch(() => void 0);
	if (!resolved || resolved !== params.realRoot && !resolved.startsWith(params.realRoot + path.sep)) return;
	const handle = await fs$1.open(absolutePath, constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0)).catch(() => void 0);
	if (!handle) return;
	params.budget.remaining -= Number(initial.size);
	try {
		const opened = await handle.stat({ bigint: true });
		if (!opened.isFile() || opened.nlink !== 1n || !sameMutationFingerprint(initial, opened)) return;
		const digest = crypto.createHash("sha256");
		digest.update([
			candidate.path,
			candidate.oldPath ?? "",
			candidate.status,
			candidate.untracked === true ? "untracked" : "tracked",
			opened.mode.toString(),
			opened.size.toString()
		].join("\0"));
		const buffer = Buffer.allocUnsafe(64 * 1024);
		let offset = 0;
		while (offset < Number(opened.size)) {
			const { bytesRead } = await handle.read(buffer, 0, Math.min(buffer.length, Number(opened.size) - offset), offset);
			if (bytesRead === 0) return;
			digest.update(buffer.subarray(0, bytesRead));
			offset += bytesRead;
		}
		return sameMutationFingerprint(opened, await handle.stat({ bigint: true })) ? digest.digest("hex") : void 0;
	} finally {
		await handle.close().catch(() => void 0);
	}
}
async function gitOutForBaseline(cwd, args) {
	const result = await runCommandBuffered([
		"git",
		"-C",
		cwd,
		"-c",
		"core.quotePath=false",
		...args
	], {
		timeoutMs: 3e4,
		maxOutputBytes: {
			stdout: MAX_BASELINE_GIT_OUTPUT_BYTES,
			stderr: 32 * 1024
		}
	});
	if (result.termination !== "exit" || result.code !== 0) return null;
	return result.stdout.toString("utf8");
}
async function collectBaselineCandidates(params) {
	const root = (await gitOut(params.cwd, ["rev-parse", "--show-toplevel"]))?.trim();
	if (!root) return;
	const branchOut = (await gitOut(root, [
		"rev-parse",
		"--abbrev-ref",
		"HEAD"
	]))?.trim();
	const branch = branchOut && branchOut !== "HEAD" ? branchOut : void 0;
	const baseInfo = await gitOut(root, [
		"rev-parse",
		"--verify",
		"--quiet",
		"HEAD"
	]) !== null ? await resolveSessionDiffBase({
		branch,
		gitOut,
		root
	}) : await resolveSessionDiffEmptyTree(root);
	const trackedText = baseInfo ? await gitOutForBaseline(root, [
		"diff",
		"-M",
		baseInfo.base,
		"--name-status",
		"-z"
	]) : "";
	const untrackedText = await gitOutForBaseline(root, [
		"ls-files",
		"--others",
		"--exclude-standard",
		"-z"
	]);
	if (trackedText === null || untrackedText === null) return {
		root,
		candidates: [],
		truncated: true
	};
	const tracked = parseNameStatusZ(trackedText);
	const untrackedPaths = untrackedText.split("\0").filter(Boolean);
	return {
		root,
		candidates: [...tracked.slice(0, MAX_FILES), ...untrackedPaths.slice(0, MAX_UNTRACKED_FILES).map((path) => ({
			path,
			status: "added",
			untracked: true
		}))].toSorted((left, right) => left.path.localeCompare(right.path)),
		truncated: tracked.length > MAX_FILES || untrackedPaths.length > MAX_UNTRACKED_FILES
	};
}
async function fingerprintBaselineCandidates(params) {
	const realRoot = await fs$1.realpath(params.root).catch(() => params.root);
	const budget = { remaining: MAX_BASELINE_TOTAL_BYTES };
	const files = [];
	for (const candidate of params.candidates) {
		const fingerprint = await fingerprintBaselineCandidate({
			budget,
			candidate,
			realRoot,
			root: params.root
		});
		if (fingerprint) files.push({
			path: candidate.path,
			fingerprint
		});
	}
	return {
		files,
		truncated: files.length !== params.candidates.length
	};
}
async function captureSessionDiffBaseline(params) {
	const collected = await collectBaselineCandidates({ cwd: params.cwd });
	if (!collected) return;
	const fingerprinted = await fingerprintBaselineCandidates({
		candidates: collected.candidates,
		root: collected.root
	});
	return {
		version: 1,
		sessionId: params.sessionId,
		root: collected.root,
		files: fingerprinted.files,
		...collected.truncated || fingerprinted.truncated ? { truncated: true } : {}
	};
}
async function applySessionDiffBaseline(params) {
	const { baseline, diff } = params;
	if (baseline?.version !== 1 || baseline.sessionId !== params.sessionId || !diff.root || baseline.root !== diff.root) return diff;
	const fingerprints = new Map(baseline.files.map((file) => [file.path, file.fingerprint]));
	const current = await fingerprintBaselineCandidates({
		candidates: diff.files,
		root: diff.root
	});
	const currentFingerprints = new Map(current.files.map((file) => [file.path, file.fingerprint]));
	const files = diff.files.filter((file) => {
		const baselineFingerprint = fingerprints.get(file.path);
		return !baselineFingerprint || currentFingerprints.get(file.path) !== baselineFingerprint;
	});
	if (files.length === diff.files.length) return diff;
	return {
		...diff,
		files,
		additions: files.reduce((sum, file) => sum + file.additions, 0),
		deletions: files.reduce((sum, file) => sum + file.deletions, 0)
	};
}
//#endregion
export { parseNumstatZ as a, parseNameStatusZ as i, captureSessionDiffBaseline as n, splitPatchByFile as o, loadCheckoutDiff as r, applySessionDiffBaseline as t };
