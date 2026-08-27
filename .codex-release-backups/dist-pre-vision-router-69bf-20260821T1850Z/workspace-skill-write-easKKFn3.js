import { a as isPathInside } from "./path-CYL8StfC.js";
import { s as pathExists } from "./absolute-path-DBVN5h2m.js";
import { r as root } from "./fs-safe-X_oyl7Rx.js";
import "./path-safety-D5Is7hSS.js";
import { a as sha256Hex } from "./crypto-digest-PR8Utwzg.js";
import { t as findContainingAllowedSkillSymlinkTarget } from "./symlink-targets-dMASWnA_.js";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/skills/lifecycle/workspace-skill-write.ts
const ALLOWED_SUPPORT_FILE_ROOTS = new Set("assets examples references scripts templates".split(" "));
const MAX_WORKSPACE_SKILL_SUPPORT_FILE_BYTES = 256 * 1024;
function normalizeWorkspaceSkillSupportPath(input) {
	const trimmed = input.trim();
	if (!trimmed) throw new Error("Support file path is required.");
	if (trimmed.includes("\\")) throw new Error("Support file paths must use forward slashes.");
	if (path.posix.isAbsolute(trimmed)) throw new Error("Support file paths must be relative.");
	if (trimmed.split("/").some((part) => !part || part === "." || part === ".." || part.startsWith("."))) throw new Error("Support file paths must use plain relative path segments.");
	if (!ALLOWED_SUPPORT_FILE_ROOTS.has(trimmed.split("/")[0] ?? "")) throw new Error(`Support file paths must be under one of: ${[...ALLOWED_SUPPORT_FILE_ROOTS].join(", ")}.`);
	if (trimmed === "PROPOSAL.md" || trimmed === "SKILL.md") throw new Error("Support files cannot replace the proposal or skill markdown file.");
	return trimmed;
}
function assertWorkspaceSkillSupportPathSetIsFileOnly(paths) {
	const sorted = paths.toSorted((a, b) => a.localeCompare(b));
	for (const filePath of sorted) if (!filePath.includes("/")) throw new Error("Support file paths must include a file below an allowed support directory.");
	for (let index = 1; index < sorted.length; index += 1) {
		const previous = sorted[index - 1];
		const current = sorted[index];
		if (previous && current?.startsWith(`${previous}/`)) throw new Error(`Support file paths cannot overlap: ${previous} and ${current}`);
	}
}
async function readWorkspaceSkillFile(filePath) {
	if (!await pathExists(filePath)) return null;
	return (await (await root(path.dirname(filePath))).read(path.basename(filePath), {
		hardlinks: "reject",
		maxBytes: 1024 * 1024,
		symlinks: "reject"
	})).buffer.toString("utf8");
}
async function readWorkspaceSupportFile(params) {
	const relativePath = normalizeWorkspaceSkillSupportPath(params.relativePath);
	if (!await pathExists(path.join(params.skillDir, ...relativePath.split("/")))) return null;
	return (await (await root(params.skillDir)).read(relativePath, {
		hardlinks: "reject",
		maxBytes: MAX_WORKSPACE_SKILL_SUPPORT_FILE_BYTES,
		symlinks: "reject"
	})).buffer.toString("utf8");
}
async function prepareWorkspaceSkillMutation(params) {
	assertInsideWorkspace(params.workspaceDir, params.skillDir, "skill directory");
	const supportFiles = normalizeSupportFiles(params.supportFiles ?? []);
	const skillTarget = await resolveWorkspaceSkillWriteTarget({
		workspaceDir: params.workspaceDir,
		filePath: params.skillFile,
		symlinkPolicy: params.symlinkPolicy
	});
	const previousContent = await readWorkspaceSkillFile(params.skillFile);
	if (params.mode === "create" && previousContent !== null) throw new Error(`Target skill already exists: ${params.skillFile}`);
	if (params.mode === "update" && previousContent === null) throw new Error(`Target skill is missing: ${params.skillFile}`);
	const preparedSupportFiles = [];
	for (const file of supportFiles) {
		const filePath = path.join(params.skillDir, ...file.path.split("/"));
		const target = await resolveWorkspaceSkillWriteTarget({
			workspaceDir: params.workspaceDir,
			filePath,
			symlinkPolicy: params.symlinkPolicy
		});
		const previousSupportContent = await readWorkspaceSupportFile({
			skillDir: params.skillDir,
			relativePath: file.path
		});
		if (params.mode === "create" && previousSupportContent !== null) throw new Error(`Target support file already exists: ${filePath}`);
		preparedSupportFiles.push({
			path: file.path,
			filePath,
			...target,
			previousContent: previousSupportContent,
			content: file.content,
			proposedContentHash: sha256Hex(file.content)
		});
	}
	return {
		mode: params.mode,
		workspaceDir: params.workspaceDir,
		skillDir: params.skillDir,
		skillFile: {
			filePath: params.skillFile,
			...skillTarget,
			previousContent,
			content: params.content,
			proposedContentHash: sha256Hex(params.content)
		},
		supportFiles: preparedSupportFiles
	};
}
async function prepareWorkspaceSkillRestoration(params) {
	assertInsideWorkspace(params.workspaceDir, params.skillDir, "skill directory");
	const supportFiles = (params.supportFiles ?? []).map((file) => ({
		path: normalizeWorkspaceSkillSupportPath(file.path),
		previousContent: file.previousContent,
		proposedContentHash: file.proposedContentHash
	}));
	assertWorkspaceSkillSupportPathSetIsFileOnly(supportFiles.map((file) => file.path));
	const skillTarget = await resolveWorkspaceSkillWriteTarget({
		workspaceDir: params.workspaceDir,
		filePath: params.skillFile,
		symlinkPolicy: params.symlinkPolicy
	});
	const preparedSupportFiles = [];
	for (const file of supportFiles) {
		const filePath = path.join(params.skillDir, ...file.path.split("/"));
		const target = await resolveWorkspaceSkillWriteTarget({
			workspaceDir: params.workspaceDir,
			filePath,
			symlinkPolicy: params.symlinkPolicy
		});
		preparedSupportFiles.push({
			path: file.path,
			filePath,
			...target,
			previousContent: file.previousContent,
			content: file.previousContent ?? "",
			proposedContentHash: file.proposedContentHash
		});
	}
	return {
		mode: params.mode,
		workspaceDir: params.workspaceDir,
		skillDir: params.skillDir,
		skillFile: {
			filePath: params.skillFile,
			...skillTarget,
			previousContent: params.previousContent,
			content: params.previousContent ?? "",
			proposedContentHash: params.proposedContentHash
		},
		supportFiles: preparedSupportFiles
	};
}
async function applyWorkspaceSkillMutation(mutation, writeFile = writeWorkspaceSkillFile) {
	const written = [];
	const writtenSupportPaths = [];
	try {
		for (const file of mutation.supportFiles) {
			await writePreparedWorkspaceFile(file, mutation.mode === "update", writeFile);
			written.push(file);
			writtenSupportPaths.push(file.path);
		}
		await writePreparedWorkspaceFile(mutation.skillFile, mutation.mode === "update", writeFile);
	} catch (error) {
		try {
			await restorePreparedWorkspaceFiles(written.toReversed());
		} catch (restoreError) {
			const failure = new Error(`Skill write failed and ${writtenSupportPaths.length} support file restoration(s) failed.`, { cause: error });
			Object.assign(failure, { restoreError });
			throw failure;
		}
		throw error;
	}
}
async function restoreWorkspaceSkillMutation(mutation) {
	await restorePreparedWorkspaceFiles(mutation.mode === "create" ? [mutation.skillFile, ...mutation.supportFiles.toReversed()] : [...mutation.supportFiles.toReversed(), mutation.skillFile]);
}
async function isWorkspaceSkillMutationApplied(mutation) {
	if (await readPreparedWorkspaceFile(mutation.skillFile, 1024 * 1024) !== mutation.skillFile.content) return false;
	for (const file of mutation.supportFiles) if (await readPreparedWorkspaceFile(file, 262144) !== file.content) return false;
	return true;
}
async function isWorkspaceSkillMutationRestored(mutation) {
	try {
		if (await readPreparedWorkspaceFile(mutation.skillFile, 1024 * 1024) !== mutation.skillFile.previousContent) return false;
		for (const file of mutation.supportFiles) if (await readPreparedWorkspaceFile(file, 262144) !== file.previousContent) return false;
		return true;
	} catch {
		return false;
	}
}
function normalizeSupportFiles(supportFiles) {
	const normalized = supportFiles.map((file) => ({
		...file,
		path: normalizeWorkspaceSkillSupportPath(file.path)
	}));
	assertWorkspaceSkillSupportPathSetIsFileOnly(normalized.map((file) => file.path));
	return normalized;
}
async function writePreparedWorkspaceFile(file, overwrite, writeFile) {
	try {
		await writeFile(file, overwrite);
	} catch (error) {
		const currentContent = await readPreparedWorkspaceFile(file, 1024 * 1024).catch(() => null);
		if (currentContent === file.content && currentContent !== file.previousContent) try {
			await restorePreparedWorkspaceFiles([file]);
		} catch (restoreError) {
			const failure = new Error("Skill write failed after commit and restoration failed.", { cause: error });
			Object.assign(failure, { restoreError });
			throw failure;
		}
		throw error;
	}
}
async function writeWorkspaceSkillFile(file, overwrite) {
	await (await root(file.rootDir)).write(file.relativePath, file.content, {
		encoding: "utf8",
		mkdir: true,
		overwrite
	});
}
async function restorePreparedWorkspaceFiles(files) {
	const errors = [];
	for (const file of files) try {
		const currentContent = await readPreparedWorkspaceFile(file, 1024 * 1024);
		if (currentContent === file.previousContent) continue;
		if (currentContent === null || sha256Hex(currentContent) !== file.proposedContentHash) throw new Error(`Workspace skill target changed before restoration: ${file.filePath}`);
		const targetRoot = await root(file.rootDir);
		if (file.previousContent === null) await targetRoot.remove(file.relativePath).catch((error) => {
			if (error?.code !== "ENOENT") throw error;
		});
		else await targetRoot.write(file.relativePath, file.previousContent, {
			encoding: "utf8",
			mkdir: true,
			overwrite: true
		});
	} catch (error) {
		errors.push(error);
	}
	if (errors.length > 0) throw new AggregateError(errors, "Failed to restore the previous workspace skill state.");
}
async function readPreparedWorkspaceFile(file, maxBytes) {
	if (!await pathExists(path.join(file.rootDir, file.relativePath))) return null;
	return (await (await root(file.rootDir)).read(file.relativePath, {
		hardlinks: "reject",
		maxBytes,
		symlinks: "reject"
	})).buffer.toString("utf8");
}
async function resolveWorkspaceSkillWriteTarget(params) {
	assertInsideWorkspace(params.workspaceDir, params.filePath, "skill file");
	const workspaceDir = path.resolve(params.workspaceDir);
	const filePath = path.resolve(params.filePath);
	const aliasTarget = await resolveWorkspaceAliasTarget({
		workspaceDir,
		filePath
	});
	if (!aliasTarget) return {
		rootDir: workspaceDir,
		relativePath: path.relative(workspaceDir, filePath)
	};
	const allowedRoot = params.symlinkPolicy.allowWrites ? findContainingAllowedSkillSymlinkTarget(params.symlinkPolicy.allowedTargetRealPaths, aliasTarget.realTarget) : null;
	if (!allowedRoot) throw new Error(`Skill file resolves through an untrusted symlink target: ${params.filePath}. Configure skills.load.allowSymlinkTargets and enable skills.workshop.allowSymlinkTargetWrites for intentional Skill Workshop symlink writes.`);
	return {
		rootDir: allowedRoot,
		relativePath: path.relative(allowedRoot, aliasTarget.realTarget)
	};
}
async function resolveWorkspaceAliasTarget(params) {
	const workspaceRealPath = await tryRealpath(params.workspaceDir) ?? params.workspaceDir;
	const realTarget = await resolveRealPathThroughExistingAncestors(params.workspaceDir, params.filePath);
	return isPathInside(workspaceRealPath, realTarget) ? null : { realTarget };
}
async function resolveRealPathThroughExistingAncestors(workspaceDir, filePath) {
	const segments = path.relative(workspaceDir, filePath).split(path.sep).filter(Boolean);
	let lexicalCursor = workspaceDir;
	let realCursor = await tryRealpath(workspaceDir) ?? workspaceDir;
	for (const segment of segments) {
		lexicalCursor = path.join(lexicalCursor, segment);
		realCursor = await tryRealpath(lexicalCursor) ?? path.join(realCursor, segment);
	}
	return path.resolve(realCursor);
}
async function tryRealpath(filePath) {
	try {
		return await fs.realpath(filePath);
	} catch {
		return null;
	}
}
function assertInsideWorkspace(workspaceDir, targetPath, label) {
	const resolvedWorkspaceDir = path.resolve(workspaceDir);
	const resolvedTarget = path.resolve(targetPath);
	if (resolvedTarget !== resolvedWorkspaceDir && !isPathInside(resolvedWorkspaceDir, resolvedTarget)) throw new Error(`${label} must stay inside the workspace.`);
}
//#endregion
export { isWorkspaceSkillMutationApplied as a, prepareWorkspaceSkillMutation as c, readWorkspaceSupportFile as d, restoreWorkspaceSkillMutation as f, assertWorkspaceSkillSupportPathSetIsFileOnly as i, prepareWorkspaceSkillRestoration as l, applyWorkspaceSkillMutation as n, isWorkspaceSkillMutationRestored as o, assertInsideWorkspace as r, normalizeWorkspaceSkillSupportPath as s, MAX_WORKSPACE_SKILL_SUPPORT_FILE_BYTES as t, readWorkspaceSkillFile as u };
