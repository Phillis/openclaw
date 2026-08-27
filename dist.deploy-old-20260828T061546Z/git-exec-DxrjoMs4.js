import { r as runCommandWithTimeout, t as runCommandBuffered } from "./exec-D2kbpwdA.js";
//#region src/infra/git-exec.ts
const GIT_TIMEOUT_MS = 12e4;
async function executeGitCommand(cwd, args, options = {}) {
	return await runCommandWithTimeout([
		"git",
		"-C",
		cwd,
		...args
	], {
		timeoutMs: GIT_TIMEOUT_MS,
		env: options.env,
		input: options.input
	});
}
function createGitCommandError(command, result) {
	const detail = (result.stderr || result.stdout).trim().split("\n").slice(-12).join("\n");
	return /* @__PURE__ */ new Error(`${command} failed${detail ? `:\n${detail}` : ""}`);
}
async function requireGitCommand(cwd, args, options = {}) {
	const result = await executeGitCommand(cwd, args, options);
	if (result.code !== 0) throw createGitCommandError(`git ${args.join(" ")}`, result);
	return result.stdout.trim();
}
async function requireGitCommandRaw(cwd, args, options = {}) {
	const result = await executeGitCommand(cwd, args, options);
	if (result.code !== 0) throw createGitCommandError(`git ${args.join(" ")}`, result);
	return result.stdout;
}
async function requireGitCommandBuffer(cwd, args, options = {}) {
	const result = await runCommandBuffered([
		"git",
		"-C",
		cwd,
		...args
	], {
		timeoutMs: GIT_TIMEOUT_MS,
		env: options.env,
		input: options.input,
		...options.maxOutputBytes !== void 0 ? { maxOutputBytes: options.maxOutputBytes } : {}
	});
	if (result.code !== 0) {
		const detail = (result.stderr.length > 0 ? result.stderr : result.stdout).toString("utf8").trim().split("\n").slice(-12).join("\n");
		throw new Error(`git ${args.join(" ")} failed${detail ? `:\n${detail}` : ""}`);
	}
	return result.stdout;
}
//#endregion
export { requireGitCommandBuffer as a, requireGitCommand as i, createGitCommandError as n, requireGitCommandRaw as o, executeGitCommand as r, GIT_TIMEOUT_MS as t };
