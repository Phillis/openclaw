import { w as resolveStateDir } from "./paths-BBSTUjD5.js";
import { o as sha256HexPrefixCore } from "./crypto-digest-IGAbV2KW.js";
import { r as runCommandWithTimeout } from "./exec-D2kbpwdA.js";
import { n as withOpenClawStateLease } from "./openclaw-state-lease-DRTqyY7R.js";
import { t as slugifyWorktreeTitle } from "./name-DmUK_jiX.js";
import { a as removeProjectCheckoutReference, d as withProjectCheckoutLifecycle, n as listProjectRegistry, r as registerClonedProjectRegistry } from "./project-registry-DuJO7XqH.js";
import os from "node:os";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/projects/project-clone-runtime.ts
const PROJECT_CLONE_TIMEOUT_MS = 10 * 6e4;
var ProjectCloneError = class extends Error {
	constructor(failure, message) {
		super(message);
		this.failure = failure;
		this.name = "ProjectCloneError";
	}
};
function cloneCommandEnv(token, env) {
	const gitEnv = {
		...env,
		GIT_TERMINAL_PROMPT: "0",
		GIT_CONFIG_NOSYSTEM: "1",
		GIT_CONFIG_GLOBAL: os.devNull,
		GIT_TEMPLATE_DIR: "",
		GIT_EDITOR: "",
		GIT_SEQUENCE_EDITOR: "",
		GIT_EXTERNAL_DIFF: "",
		GIT_ASKPASS: void 0,
		SSH_ASKPASS: void 0,
		GIT_DIR: void 0,
		GIT_WORK_TREE: void 0,
		GIT_COMMON_DIR: void 0,
		GIT_INDEX_FILE: void 0,
		GIT_OBJECT_DIRECTORY: void 0,
		GIT_ALTERNATE_OBJECT_DIRECTORIES: void 0,
		GIT_NAMESPACE: void 0,
		GIT_EXEC_PATH: void 0,
		GIT_SSH: void 0,
		GIT_SSH_COMMAND: void 0,
		GIT_SSL_NO_VERIFY: void 0
	};
	if (token) {
		gitEnv.GIT_CONFIG_COUNT = "1";
		gitEnv.GIT_CONFIG_KEY_0 = "http.https://github.com/.extraHeader";
		gitEnv.GIT_CONFIG_VALUE_0 = `Authorization: Basic ${Buffer.from(`x-access-token:${token}`).toString("base64")}`;
	}
	return gitEnv;
}
function classifyCloneFailure(params) {
	const detail = params.output.toLowerCase();
	if (params.timedOut || /could not resolve host|connection timed out|failed to connect/u.test(detail)) return new ProjectCloneError("network", "Git clone could not reach GitHub. Check the Gateway network connection and retry.");
	if (/authentication failed|permission denied|could not read username|access denied/u.test(detail)) return new ProjectCloneError("auth_required", params.tokenConfigured ? "GitHub rejected the active Control UI credential. Update gateway.controlUi.github.token when set; otherwise update the shared Gateway process environment, then retry." : "GitHub authentication is required. Configure gateway.controlUi.github.token or set GH_TOKEN/GITHUB_TOKEN in the shared Gateway process environment to clone private repositories.");
	if (/repository not found|not found/u.test(detail)) return params.tokenConfigured ? new ProjectCloneError("not_found", "GitHub could not find that repository. Check the URL and repository access.") : new ProjectCloneError("auth_required", "The repository was not found or is private. Check the URL, or configure gateway.controlUi.github.token (or the shared Gateway process environment) for private repositories.");
	return new ProjectCloneError("clone_failed", "Git could not clone that repository. Check the URL and Gateway Git configuration, then retry.");
}
/** Clones one already-validated source into an unoccupied managed target. */
async function cloneProjectCheckout(input, options = {}) {
	const env = options.env ?? process.env;
	if (await fs.lstat(input.target).then(() => true, () => false)) throw new ProjectCloneError("target_exists", "A managed checkout already exists for this repository. Register or remove it before retrying.");
	await fs.mkdir(path.dirname(input.target), { recursive: true });
	const result = await runCommandWithTimeout([
		"git",
		"clone",
		"--no-recurse-submodules",
		"--",
		input.url,
		input.target
	], {
		env: cloneCommandEnv(options.token, env),
		timeoutMs: options.timeoutMs ?? PROJECT_CLONE_TIMEOUT_MS,
		signal: options.signal,
		killProcessTree: true,
		maxOutputBytes: 256 * 1024
	});
	if (result.code === 0 && result.termination === "exit") return;
	await fs.rm(input.target, {
		recursive: true,
		force: true
	}).catch(() => {});
	throw classifyCloneFailure({
		output: `${result.stderr}\n${result.stdout}`,
		tokenConfigured: Boolean(options.token),
		timedOut: result.termination === "timeout" || result.termination === "no-output-timeout"
	});
}
//#endregion
//#region src/projects/project-git-url.ts
const GITHUB_PATH_SEGMENT = /^[A-Za-z0-9_.-]+$/u;
function githubPathParts(pathname) {
	const segments = pathname.split("/").filter(Boolean);
	const owner = segments[0];
	const repo = segments[1]?.replace(/\.git$/iu, "");
	if (segments.length !== 2 || !owner || !repo || !GITHUB_PATH_SEGMENT.test(owner) || !GITHUB_PATH_SEGMENT.test(repo) || owner === "." || owner === ".." || repo === "." || repo === "..") return null;
	return {
		owner,
		repo
	};
}
/** Canonicalizes the GitHub clone forms accepted by projects.add. */
function parseProjectGitUrl(raw) {
	const trimmed = raw.trim();
	if (!trimmed || trimmed.startsWith("-") || trimmed.includes("\0") || /[\r\n\t ]/u.test(trimmed)) return null;
	const scp = /^git@github\.com:(.+)$/iu.exec(trimmed);
	let parts;
	if (scp) parts = githubPathParts(scp[1] ?? "");
	else try {
		const url = new URL(trimmed);
		const isHttps = url.protocol === "https:";
		const isDefaultSsh = url.protocol === "ssh:" && url.username === "git" && (!url.port || url.port === "22");
		if (!isHttps && !isDefaultSsh || url.hostname.toLowerCase() !== "github.com" || url.password || isHttps && url.username || url.search || url.hash) return null;
		parts = githubPathParts(url.pathname);
	} catch {
		return null;
	}
	if (!parts) return null;
	return {
		url: `https://github.com/${parts.owner.toLowerCase()}/${parts.repo.toLowerCase()}.git`,
		name: parts.repo
	};
}
//#endregion
//#region src/projects/project-clone.ts
const PROJECT_CLONE_LEASE_MS = 3e4;
const PROJECT_CLONE_WAIT_MS = 3e4;
function existingCanonicalProject(cfg, canonicalUrl, options) {
	return listProjectRegistry(cfg, options).find((project) => {
		return (project.originUrl ? parseProjectGitUrl(project.originUrl) : null)?.url === canonicalUrl;
	});
}
/** Materializes and registers a project from an accepted GitHub remote. */
async function materializeProjectClone(input, options = {}) {
	const parsed = parseProjectGitUrl(input.gitUrl);
	if (!parsed) throw new ProjectCloneError("invalid_url", "Use a GitHub HTTPS or git@github.com repository URL. Local paths and file URLs are not accepted.");
	const env = options.env ?? process.env;
	const fingerprint = sha256HexPrefixCore(parsed.url, 16);
	return await withOpenClawStateLease({
		scope: "projects.clone",
		key: fingerprint,
		database: {
			scope: "shared",
			options
		},
		leaseMs: PROJECT_CLONE_LEASE_MS,
		waitMs: PROJECT_CLONE_WAIT_MS,
		...options.signal ? { signal: options.signal } : {},
		leaseLabel: "project clone lease",
		operationLabel: "projects.clone.lease"
	}, async (lease) => {
		while (true) {
			const candidate = existingCanonicalProject(input.cfg, parsed.url, options);
			if (!candidate) break;
			const existing = await withProjectCheckoutLifecycle(candidate.repoRoot, options, async () => {
				const current = existingCanonicalProject(input.cfg, parsed.url, options);
				return current?.repoRoot === candidate.repoRoot ? current : void 0;
			});
			if (existing) return existing;
		}
		const displayName = input.name?.trim() || parsed.name;
		const directoryName = slugifyWorktreeTitle(displayName) ?? "project";
		const target = path.join(resolveStateDir(env), "projects", fingerprint, directoryName);
		await cloneProjectCheckout({
			url: parsed.url,
			target
		}, {
			env,
			signal: lease.signal,
			timeoutMs: options.timeoutMs,
			token: options.token
		});
		try {
			lease.assertOwned();
			return await registerClonedProjectRegistry({
				path: target,
				name: displayName,
				originUrl: parsed.url
			}, options);
		} catch (error) {
			await fs.rm(target, {
				recursive: true,
				force: true
			}).catch(() => {});
			throw error;
		}
	});
}
async function resolveClonedProjectCheckout(project, options = {}) {
	if (project.source !== "cloned") throw new ProjectCloneError("clone_failed", "Only projects cloned by the Gateway can delete their checkout.");
	const managedRoot = await fs.realpath(path.join(resolveStateDir(options.env), "projects"));
	const checkout = await fs.realpath(project.repoRoot).catch(() => {
		throw new ProjectCloneError("clone_failed", "The managed project checkout is already unavailable. Remove only its registry entry instead.");
	});
	const relative = path.relative(managedRoot, checkout);
	const segments = relative.split(path.sep);
	if (!relative || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative) || segments.length !== 2 || !/^[a-f0-9]{16}$/u.test(segments[0] ?? "")) throw new ProjectCloneError("clone_failed", "The cloned project is outside the Gateway-managed projects area, so its checkout was not deleted.");
	return checkout;
}
/** Removes one cloned-project reference and deletes its checkout only after the final reference. */
async function removeClonedProjectCheckout(project, assertUnreferenced, options = {}) {
	return await withProjectCheckoutLifecycle(project.repoRoot, options, async (lease) => {
		const checkout = await resolveClonedProjectCheckout(project, options);
		await assertUnreferenced();
		const result = removeProjectCheckoutReference(project, lease, options);
		if (result === "missing") return false;
		if (result === "changed") throw new ProjectCloneError("clone_failed", "The cloned project changed before deletion.");
		if (result === "remaining") return true;
		lease.assertOwned();
		await fs.rm(checkout, { recursive: true });
		await fs.rmdir(path.dirname(checkout)).catch(() => {});
		return true;
	});
}
//#endregion
export { ProjectCloneError as i, removeClonedProjectCheckout as n, parseProjectGitUrl as r, materializeProjectClone as t };
