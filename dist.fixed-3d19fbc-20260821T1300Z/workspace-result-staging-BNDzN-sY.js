import { r as runCommandWithTimeout, t as runCommandBuffered } from "./exec-Cmwsxh9J.js";
import { _ as parseWorkerWorkspaceManifest, a as activeWorkspaceHashContext, d as withWorkspaceHashMemo, m as MAX_RECONCILIATION_FILE_BYTES, p as MAX_RECONCILIATION_ENTRIES, u as withWorkspaceHashContext } from "./workspace-actual-manifest-oJ3NxEjy.js";
import { f as absoluteEntryMatches, l as inspectAcceptedWorkerWorkspace, m as reconciliationEntries, p as localPath, t as applyStagedWorkerWorkspace, u as manifestNodes } from "./workspace-reconcile-B4y8jodH.js";
import { createHash } from "node:crypto";
import os from "node:os";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/gateway/worker-environments/workspace-result-staging.ts
const PATCH_TIMEOUT_MS = 10 * 6e4;
const WORKER_RESULT_REF_PREFIX = "refs/openclaw/worker-results";
const WORKER_RESULT_CANDIDATE_REF_PREFIX = "refs/openclaw/worker-result-candidates";
const WORKER_RESULT_CLEANUP_REF_PREFIX = "refs/openclaw/worker-result-cleanup";
const WORKER_RESULT_CLAIM_ID_PATTERN = /^[A-Za-z0-9-]+$/u;
const STAGED_RESULT_MESSAGE = "OpenClaw worker workspace result";
const STAGED_RESULT_METADATA_LIMIT = 134221824;
const DISABLED_GIT_HOOKS_PATH = os.devNull;
function gitCommand(cwd, args) {
	return [
		"git",
		"-c",
		`core.hooksPath=${DISABLED_GIT_HOOKS_PATH}`,
		"-C",
		cwd,
		...args
	];
}
function workerWorkspaceTransferPaths(current, base) {
	return parseChangedWorkspaceResult(base, current).entries.map((entry) => entry.path);
}
function parseChangedWorkspaceResult(base, current, enforceRecordLimit = true) {
	const baseNodes = manifestNodes(base);
	const currentNodes = manifestNodes(current);
	const changed = new Set([.../* @__PURE__ */ new Set([...baseNodes.keys(), ...currentNodes.keys()])].filter((entryPath) => JSON.stringify(baseNodes.get(entryPath)) !== JSON.stringify(currentNodes.get(entryPath))));
	const recordCount = [...changed].reduce((count, entryPath) => count + Number(baseNodes.has(entryPath)) + Number(currentNodes.has(entryPath)), 0);
	if (enforceRecordLimit && recordCount > 25e3) throw new Error(`Cloud workspace reconciliation exceeds the ${MAX_RECONCILIATION_ENTRIES} entry limit`);
	let totalBytes = 0;
	const entries = reconciliationEntries(current.entries).filter((entry) => changed.has(entry.path));
	for (const entry of entries) {
		if (entry.type === "file" && entry.size > 67108864) throw new Error(`Cloud workspace result is too large: ${entry.path}`);
		totalBytes += entry.type === "file" ? entry.size : Buffer.byteLength(entry.target);
		if (totalBytes > 268435456) throw new Error("Cloud workspace staged result exceeds its byte limit");
	}
	return {
		changed: recordCount > 0,
		entries
	};
}
async function requireGit(cwd, args) {
	const result = await runCommandWithTimeout(gitCommand(cwd, args), {
		timeoutMs: PATCH_TIMEOUT_MS,
		maxOutputBytes: 1024 * 1024
	});
	if (result.termination !== "exit" || result.code !== 0) throw new Error((result.stderr || result.stdout || `git ${args[0]} failed`).trim());
	return result.stdout.trim();
}
function requireWorkerResultStorageRef(ref) {
	if (!new RegExp(`^(?:${WORKER_RESULT_REF_PREFIX}|${WORKER_RESULT_CANDIDATE_REF_PREFIX}|${WORKER_RESULT_CLEANUP_REF_PREFIX})/[A-Za-z0-9-]+$`, "u").test(ref)) throw new Error("Cloud workspace staged result reference is invalid");
	return ref;
}
function requireWorkerResultRef(ref) {
	if (!ref.startsWith(`${WORKER_RESULT_REF_PREFIX}/`)) throw new Error("Cloud workspace staged result reference is invalid");
	return requireWorkerResultStorageRef(ref);
}
function workerWorkspaceResultRef(claimId) {
	if (!WORKER_RESULT_CLAIM_ID_PATTERN.test(claimId)) throw new Error("Cloud workspace result claim id is invalid");
	return `${WORKER_RESULT_REF_PREFIX}/${claimId}`;
}
function preparedWorkerWorkspaceResultRef(stagedResultRef) {
	const ref = requireWorkerResultRef(stagedResultRef);
	return `${WORKER_RESULT_CANDIDATE_REF_PREFIX}/${ref.slice(29)}`;
}
function cleanupWorkerWorkspaceResultRef(stagedResultRef) {
	const ref = requireWorkerResultRef(stagedResultRef);
	return `${WORKER_RESULT_CLEANUP_REF_PREFIX}/${ref.slice(29)}`;
}
function isWorkerWorkspaceResultCleanupRef(ref) {
	return ref.startsWith(`${WORKER_RESULT_CLEANUP_REF_PREFIX}/`);
}
async function hasGitAdminPath(root) {
	let current = root;
	while (true) {
		try {
			await fs.lstat(path.join(current, ".git"));
			return true;
		} catch (error) {
			if (error.code !== "ENOENT") throw error;
		}
		const parent = path.dirname(current);
		if (parent === current) return false;
		current = parent;
	}
}
async function ensureWorkerWorkspaceResultRepository(root) {
	const resolved = await fs.realpath(root);
	const probe = await runCommandWithTimeout(gitCommand(resolved, ["rev-parse", "--git-dir"]), {
		timeoutMs: PATCH_TIMEOUT_MS,
		maxOutputBytes: 1024 * 1024
	});
	if (probe.termination === "exit" && probe.code === 0) return resolved;
	await requireGit(resolved, [
		"init",
		"--quiet",
		"--object-format=sha1"
	]);
	return resolved;
}
async function hasWorkerWorkspaceResultRef(params) {
	let root;
	try {
		root = await fs.realpath(params.root);
	} catch (error) {
		if (error.code === "ENOENT") return false;
		throw error;
	}
	if (!await hasGitAdminPath(root)) return false;
	const result = await runCommandWithTimeout(gitCommand(root, [
		"show-ref",
		"--verify",
		"--quiet",
		requireWorkerResultStorageRef(params.stagedResultRef)
	]), {
		timeoutMs: PATCH_TIMEOUT_MS,
		maxOutputBytes: 1024 * 1024
	});
	if (result.termination === "exit" && result.code === 0) return true;
	if (result.termination === "exit" && result.code === 1) return false;
	throw new Error((result.stderr || result.stdout || "git show-ref failed").trim());
}
function stagedResultMessage(params) {
	const base = Buffer.from(params.baseManifestRaw);
	const current = Buffer.from(params.currentManifestRaw);
	const header = Buffer.from(`${STAGED_RESULT_MESSAGE}\nversion 2\nbase-ref ${params.baseManifestRef}\ncurrent-ref ${params.currentManifestRef}\nbase-bytes ${base.byteLength}\ncurrent-bytes ${current.byteLength}\n\n`);
	return Buffer.concat([
		header,
		base,
		current
	]);
}
function quoteFastImportPath(entryPath) {
	const bytes = Buffer.from(entryPath);
	let quoted = "\"";
	for (const byte of bytes) {
		if (byte === 0) throw new Error("Cloud workspace staged result path contains a null byte");
		if (byte === 34 || byte === 92) quoted += `\\${String.fromCharCode(byte)}`;
		else if (byte >= 32 && byte < 127) quoted += String.fromCharCode(byte);
		else quoted += `\\${byte.toString(8).padStart(3, "0")}`;
	}
	return `${quoted}"`;
}
async function readGitBlob(params) {
	const result = await runCommandBuffered(gitCommand(params.root, [
		"cat-file",
		"blob",
		params.objectId
	]), {
		timeoutMs: PATCH_TIMEOUT_MS,
		maxOutputBytes: params.maxBytes + 1
	});
	if (result.termination !== "exit" || result.code !== 0) throw new Error(result.stderr.toString("utf8").trim() || "git cat-file failed");
	if (result.stdout.byteLength > params.maxBytes) throw new Error("Cloud workspace staged result exceeds its byte limit");
	return result.stdout;
}
async function stageWorkerWorkspaceResult(params) {
	const root = await ensureWorkerWorkspaceResultRepository(params.root);
	const stagedResultRef = requireWorkerResultStorageRef(params.stagedResultRef);
	const entries = parseChangedWorkspaceResult(parseWorkerWorkspaceManifest(params.baseManifestRaw, params.baseManifestRef), parseWorkerWorkspaceManifest(params.currentManifestRaw, params.currentManifestRef)).entries.toSorted((left, right) => left.path.localeCompare(right.path));
	const blobs = [];
	for (const [index, entry] of entries.entries()) {
		const source = localPath(params.stagingRoot, entry.path);
		if (!await absoluteEntryMatches(source, entry)) throw new Error(`Cloud workspace staged payload is invalid: ${entry.path}`);
		const content = entry.type === "symlink" ? Buffer.from(entry.target) : await fs.readFile(source);
		if (entry.type === "file" && (content.byteLength !== entry.size || createHash("sha256").update(content).digest("hex") !== entry.sha256)) throw new Error(`Cloud workspace staged payload changed while reading: ${entry.path}`);
		blobs.push({
			entry,
			mark: index + 1,
			content
		});
	}
	const message = stagedResultMessage(params);
	const chunks = [];
	for (const blob of blobs) {
		chunks.push(Buffer.from(`blob\nmark :${blob.mark}\ndata ${blob.content.byteLength}\n`));
		chunks.push(blob.content, Buffer.from("\n"));
	}
	chunks.push(Buffer.from(`commit ${stagedResultRef}\nauthor OpenClaw <openclaw@localhost> 0 +0000\ncommitter OpenClaw <openclaw@localhost> 0 +0000\ndata ${message.byteLength}\n`), message, Buffer.from("\ndeleteall\n"));
	for (const blob of blobs) {
		const mode = blob.entry.type === "symlink" ? "120000" : (blob.entry.mode & 73) !== 0 ? "100755" : "100644";
		chunks.push(Buffer.from(`M ${mode} :${blob.mark} ${quoteFastImportPath(blob.entry.path)}\n`));
	}
	chunks.push(Buffer.from("done\n"));
	const imported = await runCommandBuffered(gitCommand(root, ["fast-import", "--quiet"]), {
		input: Buffer.concat(chunks),
		timeoutMs: PATCH_TIMEOUT_MS,
		maxOutputBytes: {
			stdout: 1024 * 1024,
			stderr: 1024 * 1024
		}
	});
	if (imported.termination !== "exit" || imported.code !== 0) throw new Error(imported.stderr.toString("utf8").trim() || "git fast-import failed");
	await requireGit(root, ["rev-parse", `${stagedResultRef}^{commit}`]);
}
async function loadStagedWorkerWorkspace(root, stagedResultRef) {
	const ref = requireWorkerResultStorageRef(stagedResultRef);
	const rawCommit = await runCommandBuffered(gitCommand(root, [
		"cat-file",
		"commit",
		ref
	]), {
		timeoutMs: PATCH_TIMEOUT_MS,
		maxOutputBytes: STAGED_RESULT_METADATA_LIMIT
	});
	if (rawCommit.termination !== "exit" || rawCommit.code !== 0) throw new Error(rawCommit.stderr.toString("utf8").trim() || "git cat-file failed");
	const commitHeaderEnd = rawCommit.stdout.indexOf("\n\n");
	if (commitHeaderEnd < 0) throw new Error("Cloud workspace staged result metadata is invalid");
	const message = rawCommit.stdout.subarray(commitHeaderEnd + 2);
	const metadataEnd = message.indexOf("\n\n");
	if (metadataEnd < 0) throw new Error("Cloud workspace staged result metadata is invalid");
	const lines = message.subarray(0, metadataEnd).toString("utf8").split("\n");
	const version = lines[1] === "version 1" ? 1 : lines[1] === "version 2" ? 2 : void 0;
	const match = /^sha256:[a-f0-9]{64}$/u;
	const baseManifestRef = lines[2]?.slice(9) ?? "";
	const currentManifestRef = lines[3]?.slice(12) ?? "";
	const baseBytes = Number(lines[4]?.slice(11));
	const currentBytes = Number(lines[5]?.slice(14));
	if (lines[0] !== STAGED_RESULT_MESSAGE || version === void 0 || !lines[2]?.startsWith("base-ref ") || !lines[3]?.startsWith("current-ref ") || !lines[4]?.startsWith("base-bytes ") || !lines[5]?.startsWith("current-bytes ") || lines.length !== 6 || !match.test(baseManifestRef) || !match.test(currentManifestRef) || !Number.isSafeInteger(baseBytes) || baseBytes < 0 || !Number.isSafeInteger(currentBytes) || currentBytes < 0) throw new Error("Cloud workspace staged result metadata is invalid");
	const manifests = message.subarray(metadataEnd + 2);
	if (manifests.byteLength !== baseBytes + currentBytes) throw new Error("Cloud workspace staged result metadata is truncated");
	const baseRaw = manifests.subarray(0, baseBytes).toString("utf8");
	const currentRaw = manifests.subarray(baseBytes).toString("utf8");
	const base = parseWorkerWorkspaceManifest(baseRaw, baseManifestRef);
	const current = parseWorkerWorkspaceManifest(currentRaw, currentManifestRef);
	const changedResult = parseChangedWorkspaceResult(base, current, version !== 1);
	const changedEntries = changedResult.entries;
	const treeEntries = version === 1 ? reconciliationEntries(current.entries) : changedEntries;
	const tree = await runCommandBuffered(gitCommand(root, [
		"ls-tree",
		"-r",
		"-z",
		"--full-tree",
		ref
	]), {
		timeoutMs: PATCH_TIMEOUT_MS,
		maxOutputBytes: 2 * MAX_RECONCILIATION_FILE_BYTES
	});
	if (tree.termination !== "exit" || tree.code !== 0) throw new Error(tree.stderr.toString("utf8").trim() || "git ls-tree failed");
	const objectsByPath = /* @__PURE__ */ new Map();
	for (const record of tree.stdout.toString("utf8").split("\0").filter(Boolean)) {
		const parsed = /^(100644|100755|120000) blob ([a-f0-9]{40}|[a-f0-9]{64})\t([\s\S]+)$/u.exec(record);
		if (!parsed) throw new Error("Cloud workspace staged result tree is invalid");
		objectsByPath.set(parsed[3], {
			mode: parsed[1],
			objectId: parsed[2]
		});
	}
	if (objectsByPath.size !== treeEntries.length) throw new Error("Cloud workspace staged result tree does not match its manifest");
	for (const entry of treeEntries) {
		const object = objectsByPath.get(entry.path);
		const expectedMode = entry.type === "symlink" ? "120000" : (entry.mode & 73) !== 0 ? "100755" : "100644";
		if (!object || object.mode !== expectedMode) throw new Error(`Cloud workspace staged result tree is invalid: ${entry.path}`);
	}
	return {
		baseManifestRef,
		currentManifestRef,
		base,
		current,
		changed: changedResult.changed,
		changedEntries,
		objectsByPath
	};
}
async function materializeStagedEntry(params) {
	const target = localPath(params.root, params.entry.path);
	await fs.mkdir(path.dirname(target), {
		recursive: true,
		mode: 448
	});
	if (params.entry.type === "symlink") {
		await fs.symlink(params.entry.target, target);
		return;
	}
	if (!params.content) throw new Error(`Cloud workspace staged content is missing: ${params.entry.path}`);
	await fs.writeFile(target, params.content, {
		mode: params.entry.mode,
		flag: "wx"
	});
	await fs.chmod(target, params.entry.mode);
	if (!await absoluteEntryMatches(target, params.entry)) throw new Error(`Cloud workspace staged payload is invalid: ${params.entry.path}`);
}
async function applyStagedWorkerWorkspaceResult(params) {
	return await withWorkspaceHashContext(async () => await applyStagedWorkerWorkspaceResultWithMemo(params));
}
async function applyStagedWorkerWorkspaceResultWithMemo(params) {
	const root = await fs.realpath(params.root);
	const staged = await loadStagedWorkerWorkspace(root, params.stagedResultRef);
	if (params.alreadyAccepted || staged.baseManifestRef !== params.expectedBaseManifestRef) {
		const accepted = await inspectAcceptedWorkerWorkspace({
			root,
			expectedManifestRef: params.expectedBaseManifestRef,
			allowAdvancedLocalState: true,
			base: staged.base,
			current: staged.current
		});
		if (!accepted) throw new Error("Cloud workspace staged result does not match the placement base");
		params.journal.commit(accepted.manifestRef);
		return {
			...accepted,
			changed: staged.changed
		};
	}
	const stagingRoot = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-staged-result-"));
	try {
		for (const entry of staged.changedEntries) {
			const content = await readGitBlob({
				root,
				objectId: staged.objectsByPath.get(entry.path).objectId,
				maxBytes: MAX_RECONCILIATION_FILE_BYTES
			});
			if (entry.type === "symlink") {
				if (content.toString("utf8") !== entry.target) throw new Error(`Cloud workspace staged result tree is invalid: ${entry.path}`);
				await materializeStagedEntry({
					root: stagingRoot,
					entry
				});
			} else await materializeStagedEntry({
				root: stagingRoot,
				entry,
				content
			});
		}
		return {
			...await applyStagedWorkerWorkspace({
				root,
				stagingRoot,
				baseManifestRef: staged.baseManifestRef,
				currentManifestRef: staged.currentManifestRef,
				base: staged.base,
				current: staged.current,
				journal: params.journal,
				publishAcceptedManifest: params.publishAcceptedManifest
			}),
			changed: staged.changed
		};
	} finally {
		await fs.rm(stagingRoot, {
			recursive: true,
			force: true
		});
	}
}
async function prepareRequestedWorkerWorkspaceResult(params) {
	const stagedResult = params.request.stagedResult;
	if (!stagedResult) throw new Error("Cloud workspace durable result staging was not requested");
	const candidateRef = preparedWorkerWorkspaceResultRef(stagedResult.ref);
	const active = activeWorkspaceHashContext();
	const hashMemo = active?.memo ?? /* @__PURE__ */ new Map();
	const metrics = active?.metrics;
	let appliedWorkspaceResult;
	await stageWorkerWorkspaceResult({
		root: params.request.localPath,
		stagingRoot: params.stagingRoot,
		stagedResultRef: candidateRef,
		baseManifestRef: params.request.baseManifestRef,
		currentManifestRef: params.currentManifestRef,
		baseManifestRaw: params.baseManifestRaw,
		currentManifestRaw: params.currentManifestRaw
	});
	return {
		applyPreparedStagedResult: async () => {
			const root = await ensureWorkerWorkspaceResultRepository(params.request.localPath);
			appliedWorkspaceResult = await withWorkspaceHashMemo(hashMemo, async () => await applyStagedWorkerWorkspaceResult({
				root,
				stagedResultRef: candidateRef,
				expectedBaseManifestRef: params.request.baseManifestRef,
				journal: params.request.journal,
				publishAcceptedManifest: params.publishAcceptedManifest
			}), metrics);
		},
		getAppliedWorkspaceResult: () => appliedWorkspaceResult,
		verifyLocalStable: async () => {
			if (!appliedWorkspaceResult) throw new Error("Cloud workspace staged result has not been applied");
			await appliedWorkspaceResult.verifyLocalStable();
		},
		publishStagedResult: async () => {
			const root = await ensureWorkerWorkspaceResultRepository(params.request.localPath);
			const commit = await requireGit(root, ["rev-parse", `${candidateRef}^{commit}`]);
			await requireGit(root, [
				"update-ref",
				stagedResult.ref,
				commit
			]);
			await requireGit(root, [
				"update-ref",
				"-d",
				candidateRef
			]);
			stagedResult.record(stagedResult.ref);
		},
		discardPreparedStagedResult: async () => {
			await deleteStagedWorkerWorkspaceResult({
				root: params.request.localPath,
				stagedResultRef: candidateRef
			});
		}
	};
}
async function deleteStagedWorkerWorkspaceResult(params) {
	const root = await fs.realpath(params.root);
	const stagedResultRef = requireWorkerResultStorageRef(params.stagedResultRef);
	await requireGit(root, [
		"update-ref",
		"-d",
		stagedResultRef
	]);
	if (stagedResultRef.startsWith(`${WORKER_RESULT_REF_PREFIX}/`)) await requireGit(root, [
		"update-ref",
		"-d",
		preparedWorkerWorkspaceResultRef(stagedResultRef)
	]);
}
async function moveStagedWorkerWorkspaceResultToCleanup(params) {
	const root = await fs.realpath(params.root);
	const stagedResultRef = requireWorkerResultRef(params.stagedResultRef);
	const cleanupRef = cleanupWorkerWorkspaceResultRef(stagedResultRef);
	await requireGit(root, [
		"update-ref",
		cleanupRef,
		await requireGit(root, ["rev-parse", `${stagedResultRef}^{commit}`])
	]);
	await deleteStagedWorkerWorkspaceResult({
		root,
		stagedResultRef
	});
	return cleanupRef;
}
async function restoreStagedWorkerWorkspaceResultFromCleanup(params) {
	const root = await fs.realpath(params.root);
	const cleanupRef = requireWorkerResultStorageRef(params.cleanupRef);
	if (!isWorkerWorkspaceResultCleanupRef(cleanupRef)) throw new Error("Cloud workspace cleanup result reference is invalid");
	await requireGit(root, [
		"update-ref",
		requireWorkerResultRef(params.stagedResultRef),
		await requireGit(root, ["rev-parse", `${cleanupRef}^{commit}`])
	]);
	await requireGit(root, [
		"update-ref",
		"-d",
		cleanupRef
	]);
}
async function deleteWorkerWorkspaceResultCleanupRefs(params) {
	const root = await fs.realpath(params.root);
	const output = await requireGit(root, [
		"for-each-ref",
		"--format=%(refname)",
		`${WORKER_RESULT_CLEANUP_REF_PREFIX}/`
	]);
	for (const cleanupRef of output.split("\n").filter(Boolean)) {
		requireWorkerResultStorageRef(cleanupRef);
		if (!params.retainedRefs?.has(cleanupRef)) await requireGit(root, [
			"update-ref",
			"-d",
			cleanupRef
		]);
	}
}
const workerWorkspaceResultStaging = {
	prepareRequestedWorkerWorkspaceResult,
	stageWorkerWorkspaceResult
};
//#endregion
export { hasWorkerWorkspaceResultRef as a, preparedWorkerWorkspaceResultRef as c, workerWorkspaceResultStaging as d, workerWorkspaceTransferPaths as f, deleteWorkerWorkspaceResultCleanupRefs as i, restoreStagedWorkerWorkspaceResultFromCleanup as l, cleanupWorkerWorkspaceResultRef as n, isWorkerWorkspaceResultCleanupRef as o, deleteStagedWorkerWorkspaceResult as r, moveStagedWorkerWorkspaceResultToCleanup as s, applyStagedWorkerWorkspaceResult as t, workerWorkspaceResultRef as u };
