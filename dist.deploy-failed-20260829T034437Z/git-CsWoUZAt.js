import { a as requireGitCommandBuffer, i as requireGitCommand, n as createGitCommandError, o as requireGitCommandRaw, r as executeGitCommand } from "./git-exec-DxrjoMs4.js";
import { existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import fs$1 from "node:fs/promises";
//#region src/agents/worktrees/git.ts
/**
* Gateway-run Git must never execute repository hooks or filesystem monitors;
* the admin-gated setup script is the sole intentional repository-code path.
* Exported so other Gateway-owned callers that must bypass the `runGit`/
* `requireGit*` wrappers (e.g. a buffered, non-throwing invocation with a
* custom timeout) still pin the same invariant instead of reimplementing it.
*/
function gitEnvironment(env) {
	return {
		...env ?? process.env,
		GIT_CONFIG_COUNT: "2",
		GIT_CONFIG_KEY_0: "core.hooksPath",
		GIT_CONFIG_VALUE_0: os.devNull,
		GIT_CONFIG_KEY_1: "core.fsmonitor",
		GIT_CONFIG_VALUE_1: "false"
	};
}
async function runGit(cwd, args, options = {}) {
	return await executeGitCommand(cwd, args, {
		...options,
		env: gitEnvironment(options.env)
	});
}
function commandError(command, result) {
	return createGitCommandError(command, result);
}
async function requireGit(cwd, args, options = {}) {
	return await requireGitCommand(cwd, args, {
		...options,
		env: gitEnvironment(options.env)
	});
}
async function requireGitRaw(cwd, args) {
	return await requireGitCommandRaw(cwd, args, { env: gitEnvironment() });
}
async function requireGitBuffer(cwd, args, options = {}) {
	return await requireGitCommandBuffer(cwd, args, {
		...options,
		env: gitEnvironment(options.env)
	});
}
function parseWorktreeList(output) {
	const entries = [];
	let current;
	for (const field of output.split("\0")) {
		if (!field) {
			if (current) {
				entries.push(current);
				current = void 0;
			}
			continue;
		}
		if (field.startsWith("worktree ")) {
			if (current) entries.push(current);
			current = { path: field.slice(9) };
		} else if (current && field === "locked") current.lockedReason = "";
		else if (current && field.startsWith("locked ")) current.lockedReason = field.slice(7);
	}
	if (current) entries.push(current);
	return entries;
}
async function listGitWorktrees(repoRoot) {
	return parseWorktreeList(await requireGitRaw(repoRoot, [
		"worktree",
		"list",
		"--porcelain",
		"-z"
	]));
}
/**
* True when dir sits inside a git checkout: a .git entry on itself or any ancestor.
* Existence, not directory-ness, is the signal — linked worktrees keep a .git file.
* Mirrors `git rev-parse --show-toplevel` discovery without spawning git, so UI
* capability checks and create-preflights cannot diverge from the worktree service.
*/
function findGitCheckoutRoot(start) {
	let current = path.resolve(start);
	for (;;) {
		if (existsSync(path.join(current, ".git"))) return current;
		const parent = path.dirname(current);
		if (parent === current) return null;
		current = parent;
	}
}
function insideGitCheckout(start) {
	return findGitCheckoutRoot(start) !== null;
}
async function hasSelfContainedGitMetadata(checkoutRoot) {
	try {
		return (await fs$1.lstat(path.join(checkoutRoot, ".git"))).isDirectory();
	} catch (error) {
		if (error.code === "ENOENT") return false;
		throw error;
	}
}
async function worktreePathExists(target) {
	try {
		await fs$1.lstat(target);
		return true;
	} catch (error) {
		if (error.code === "ENOENT") return false;
		throw error;
	}
}
async function removeEmptyParents(start, stop) {
	let current = start;
	while (current.startsWith(`${stop}${path.sep}`)) {
		try {
			await fs$1.rmdir(current);
		} catch {
			return;
		}
		current = path.dirname(current);
	}
}
//#endregion
export { insideGitCheckout as a, requireGit as c, runGit as d, worktreePathExists as f, hasSelfContainedGitMetadata as i, requireGitBuffer as l, findGitCheckoutRoot as n, listGitWorktrees as o, gitEnvironment as r, removeEmptyParents as s, commandError as t, requireGitRaw as u };
