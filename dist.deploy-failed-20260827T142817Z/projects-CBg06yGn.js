import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { t as pruneMapToMaxSize } from "./map-size-DAGm21RM.js";
import { a as isPathInside } from "./path-D138yf8v.js";
import "./path-guards-fBZukd5S.js";
import { w as resolveStateDir } from "./paths-CqeDjSA4.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { c as parseAgentSessionKey } from "./session-key-utils-D8x_bjrd.js";
import { o as sha256HexPrefixCore } from "./crypto-digest-PR8Utwzg.js";
import { c as WRITE_SCOPE } from "./operator-scopes-Dw7Gu2cA.js";
import { r as runCommandWithTimeout } from "./exec-BL80Wdzl.js";
import { n as GatewayErrorDetailCodes, t as ErrorCodes } from "./gateway-error-details-BWo6Le6w.js";
import { r as authorizeOperatorScopesForRequiredScope } from "./method-scopes-rPUXjV_D.js";
import { Fn as validateProjectsRegisterParams, In as validateProjectsRemoveParams, Ln as validateProjectsSearchRemoteParams, Nn as validateProjectsAddParams, Pn as validateProjectsListParams } from "./src-Bo4ezI_n.js";
import { s as errorShape } from "./error-codes-CMSvT5-d.js";
import { n as loadCombinedSessionStoreForGatewayCore } from "./combined-store-gateway-BPsv12Zv.js";
import { f as listProfiles, p as resolveUserProfileId } from "./user-profiles-eJiEIUE1.js";
import "./session-utils-rhyq5EVD.js";
import { n as withOpenClawStateLease } from "./openclaw-state-lease-uU0VhaXS.js";
import { l as slugifyWorktreeTitle, s as managedWorktrees } from "./service-BRAKemfS.js";
import { b as listRegistryWorktrees } from "./registry-C0l4nYnM.js";
import { l as createSessionListEntryFilter } from "./session-sharing-QTh4cZeN.js";
import { t as assertValidParams } from "./validation-CsGeElrb.js";
import { a as fetchGitHubApi, d as readOptionalGitHubString, f as requiredString, n as GITHUB_API_ORIGIN, o as fetchGitHubJson, p as resolveGitHubApiCredentialScope, s as githubApiToken, t as ControlUiGitHubError, u as readGitHubJsonResponse } from "./control-ui-github-api-DiLldJZ0.js";
import { a as removeProjectRegistry, i as registerProjectRegistry, n as listProjectRegistry, r as registerClonedProjectRegistry, s as resolveProjectRegistry, t as ProjectCheckoutError } from "./project-registry-7ift6YqA.js";
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
	if (/authentication failed|permission denied|could not read username|access denied/u.test(detail)) return new ProjectCloneError("auth_required", params.tokenConfigured ? "GitHub rejected the configured credential. Update GH_TOKEN in the Gateway environment and retry." : "GitHub authentication is required. Set GH_TOKEN in the Gateway environment to clone private repositories.");
	if (/repository not found|not found/u.test(detail)) return params.tokenConfigured ? new ProjectCloneError("not_found", "GitHub could not find that repository. Check the URL and repository access.") : new ProjectCloneError("auth_required", "The repository was not found or is private. Check the URL, or set GH_TOKEN in the Gateway environment for private repositories.");
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
	const existing = existingCanonicalProject(input.cfg, parsed.url, options);
	if (existing) return existing;
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
		const raced = existingCanonicalProject(input.cfg, parsed.url, options);
		if (raced) return raced;
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
/** Deletes a checkout only when it still occupies its exact managed project slot. */
async function deleteClonedProjectCheckout(project, options = {}) {
	if (project.source !== "cloned") throw new ProjectCloneError("clone_failed", "Only projects cloned by the Gateway can delete their checkout.");
	const managedRoot = await fs.realpath(path.join(resolveStateDir(options.env), "projects"));
	const checkout = await fs.realpath(project.repoRoot).catch(() => {
		throw new ProjectCloneError("clone_failed", "The managed project checkout is already unavailable. Remove only its registry entry instead.");
	});
	const relative = path.relative(managedRoot, checkout);
	const segments = relative.split(path.sep);
	if (!relative || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative) || segments.length !== 2 || !/^[a-f0-9]{16}$/u.test(segments[0] ?? "")) throw new ProjectCloneError("clone_failed", "The cloned project is outside the Gateway-managed projects area, so its checkout was not deleted.");
	await fs.rm(checkout, { recursive: true });
	await fs.rmdir(path.dirname(checkout)).catch(() => {});
}
//#endregion
//#region src/gateway/project-github-search.ts
const SEARCH_CACHE_MS = 6e4;
const SEARCH_CACHE_LIMIT = 100;
const SEARCH_RESULT_LIMIT = 10;
const AFFILIATED_RESULT_LIMIT = 10;
const searchCache = /* @__PURE__ */ new Map();
function boundedString(value, maxLength) {
	const trimmed = value?.trim();
	return trimmed ? trimmed.slice(0, maxLength) : void 0;
}
function parseRepository(value, affiliated) {
	if (!isRecord(value)) return null;
	let fullName;
	let name;
	try {
		fullName = requiredString(value, "full_name");
		name = requiredString(value, "name");
	} catch {
		return null;
	}
	const clone = parseProjectGitUrl(readOptionalGitHubString(value, "clone_url") ?? "");
	const webUrl = boundedString(readOptionalGitHubString(value, "html_url"), 2048);
	if (!clone || !webUrl) return null;
	return {
		affiliated,
		updatedAt: readOptionalGitHubString(value, "updated_at") ?? "",
		project: {
			name: name.slice(0, 100),
			fullName: fullName.slice(0, 200),
			cloneUrl: clone.url,
			webUrl,
			private: value.private === true,
			...boundedString(readOptionalGitHubString(value, "description"), 500) ? { description: boundedString(readOptionalGitHubString(value, "description"), 500) } : {}
		}
	};
}
function candidateSort(left, right) {
	if (left.affiliated !== right.affiliated) return left.affiliated ? -1 : 1;
	if (left.updatedAt !== right.updatedAt) return left.updatedAt > right.updatedAt ? -1 : 1;
	const leftName = left.project.fullName.toLowerCase();
	const rightName = right.project.fullName.toLowerCase();
	return leftName < rightName ? -1 : leftName > rightName ? 1 : 0;
}
function repositoryArray(value, affiliated) {
	return (Array.isArray(value) ? value : isRecord(value) && Array.isArray(value.items) ? value.items : []).flatMap((item) => {
		const parsed = parseRepository(item, affiliated);
		return parsed ? [parsed] : [];
	});
}
function matchesAffiliatedQuery(candidate, query) {
	const needle = query.toLowerCase();
	return [
		candidate.project.name,
		candidate.project.fullName,
		candidate.project.description ?? ""
	].join("\n").toLowerCase().includes(needle);
}
async function loadAffiliatedRepositories(fetchImpl, token) {
	const url = new URL("/user/repos", GITHUB_API_ORIGIN);
	url.searchParams.set("affiliation", "owner,collaborator,organization_member");
	url.searchParams.set("sort", "updated");
	url.searchParams.set("direction", "desc");
	url.searchParams.set("per_page", String(AFFILIATED_RESULT_LIMIT));
	try {
		return repositoryArray(await readGitHubJsonResponse(await fetchGitHubApi(url.href, fetchImpl, token)), true);
	} catch (error) {
		if (error instanceof ControlUiGitHubError) return [];
		throw error;
	}
}
async function loadRepositorySearch(query, fetchImpl, token) {
	const url = new URL("/search/repositories", GITHUB_API_ORIGIN);
	url.searchParams.set("q", `${query} in:name,description`);
	url.searchParams.set("sort", "updated");
	url.searchParams.set("order", "desc");
	url.searchParams.set("per_page", String(SEARCH_RESULT_LIMIT));
	return repositoryArray(await fetchGitHubJson(url.href, fetchImpl, token), false);
}
async function searchProjectsUncached(params) {
	const affiliated = params.token ? (await loadAffiliatedRepositories(params.fetchImpl, params.token)).filter((candidate) => matchesAffiliatedQuery(candidate, params.query)) : [];
	const global = await loadRepositorySearch(params.query, params.fetchImpl, params.token);
	const deduped = /* @__PURE__ */ new Map();
	for (const candidate of [...affiliated, ...global].toSorted(candidateSort)) {
		const key = candidate.project.fullName.toLowerCase();
		if (!deduped.has(key)) deduped.set(key, candidate);
	}
	return {
		credential: params.token ? "configured" : "missing",
		projects: [...deduped.values()].toSorted(candidateSort).slice(0, SEARCH_RESULT_LIMIT).map((candidate) => candidate.project)
	};
}
/** Searches affiliated and public GitHub repositories for the project picker. */
function searchRemoteProjects(query, options = {}) {
	const normalizedQuery = query.trim().toLowerCase();
	const { token, cacheScope } = resolveGitHubApiCredentialScope(options.env);
	const cacheKey = `${normalizedQuery}\0${cacheScope}`;
	const now = options.now ?? Date.now();
	const cached = searchCache.get(cacheKey);
	if (cached && cached.expiresAt > now) {
		searchCache.delete(cacheKey);
		searchCache.set(cacheKey, cached);
		return cached.promise;
	}
	const promise = searchProjectsUncached({
		query: query.trim(),
		fetchImpl: options.fetchImpl ?? fetch,
		token
	}).catch((error) => {
		if (searchCache.get(cacheKey)?.promise === promise) searchCache.delete(cacheKey);
		throw error;
	});
	searchCache.set(cacheKey, {
		expiresAt: now + SEARCH_CACHE_MS,
		promise
	});
	pruneMapToMaxSize(searchCache, SEARCH_CACHE_LIMIT);
	return promise;
}
//#endregion
//#region src/gateway/server-methods/projects.ts
const PROJECTS_LIST_MAX_RAW_CANDIDATES = Math.max(50, 50, 32);
function folderDisplayName(folder) {
	const trimmed = folder.replace(/[\\/]+$/u, "");
	return path.posix.basename(trimmed) || path.win32.basename(trimmed) || folder;
}
function checkoutName(checkoutPath) {
	const trimmed = checkoutPath.replace(/[\\/]+$/u, "");
	return trimmed.split(/[\\/]/u).at(-1) || trimmed;
}
function compareRawProjectCandidates(left, right) {
	return right.lastUsedAt - left.lastUsedAt || left.checkoutPath.localeCompare(right.checkoutPath) || left.kind.localeCompare(right.kind);
}
function retainNewestRawProjectCandidate(candidates, candidate) {
	const insertionIndex = candidates.findIndex((existing) => compareRawProjectCandidates(candidate, existing) < 0);
	if (insertionIndex < 0) {
		if (candidates.length < PROJECTS_LIST_MAX_RAW_CANDIDATES) candidates.push(candidate);
		return;
	}
	candidates.splice(insertionIndex, 0, candidate);
	if (candidates.length > PROJECTS_LIST_MAX_RAW_CANDIDATES) candidates.pop();
}
function sanitizePublicOriginUrl(originUrl) {
	const trimmed = originUrl.trim();
	const suffixIndex = trimmed.search(/[?#]/u);
	const withoutSuffix = suffixIndex < 0 ? trimmed : trimmed.slice(0, suffixIndex);
	const scp = /^[^@\s/:]+@(\[[^\]]+\]|[^:\s]+):(.+)$/u.exec(withoutSuffix);
	if (scp) return `${scp[1]}:${scp[2]}`;
	let parsed;
	try {
		parsed = new URL(withoutSuffix);
	} catch {
		return;
	}
	if (!parsed.username && !parsed.password) return withoutSuffix;
	parsed.username = "";
	parsed.password = "";
	return parsed.toString();
}
function sanitizeProjectRecord(project) {
	const { originUrl, ...record } = project;
	const sanitizedOriginUrl = originUrl ? sanitizePublicOriginUrl(originUrl) : void 0;
	return {
		...record,
		...sanitizedOriginUrl ? { originUrl: sanitizedOriginUrl } : {}
	};
}
function resolvePathProject(projects, folder, sessionKey) {
	const sessionAgentId = parseAgentSessionKey(sessionKey)?.agentId;
	return projects.filter((project) => project.repoRoot === folder).toSorted((left, right) => {
		const rank = (project) => project.source === "workspace" && project.agentId === sessionAgentId ? 0 : project.source !== "workspace" ? 1 : 2;
		return rank(left) - rank(right) || left.id.localeCompare(right.id);
	})[0];
}
function listProjectRecents(cfg, profileIds, projects) {
	const store = loadCombinedSessionStoreForGatewayCore(cfg, { projection: "list" }).store;
	const candidates = Object.entries(store).filter(([, entry]) => entry.createdActor?.type === "human" && Boolean(entry.createdActor.id && profileIds.has(entry.createdActor.id))).toSorted(([leftKey, left], [rightKey, right]) => (right.updatedAt ?? 0) - (left.updatedAt ?? 0) || leftKey.localeCompare(rightKey));
	const projectsById = new Map(projects.map((project) => [project.id, project]));
	const seen = /* @__PURE__ */ new Set();
	const recents = [];
	for (const [sessionKey, entry] of candidates) {
		const projectId = normalizeOptionalString(entry.projectId);
		const explicitProject = projectId ? projectsById.get(projectId) : void 0;
		const worktreeRoot = normalizeOptionalString(entry.worktree?.repoRoot);
		const spawnedCwd = normalizeOptionalString(entry.spawnedCwd);
		const execCwd = normalizeOptionalString(entry.execCwd);
		const folder = worktreeRoot ?? spawnedCwd ?? execCwd;
		const project = explicitProject ?? (folder ? resolvePathProject(projects, folder, sessionKey) : void 0);
		const key = project ? `project:${project.id}` : folder ? `folder:${normalizeOptionalString(entry.execNode) ?? ""}\0${folder}` : void 0;
		if (!key || seen.has(key)) continue;
		seen.add(key);
		recents.push(project ? {
			kind: "project",
			projectId: project.id,
			displayName: project.displayName
		} : {
			kind: "folder",
			folder,
			displayName: folderDisplayName(folder),
			...normalizeOptionalString(entry.execNode) ? { execNode: normalizeOptionalString(entry.execNode) } : {}
		});
		if (recents.length === 8) break;
	}
	return recents;
}
function projectCandidatesToSummaries(candidates) {
	const groups = /* @__PURE__ */ new Map();
	for (const candidate of candidates) {
		const group = groups.get(candidate.fingerprint) ?? {
			checkouts: /* @__PURE__ */ new Map(),
			lastUsedAt: candidate.lastUsedAt,
			name: checkoutName(candidate.checkoutPath),
			nameUsedAt: candidate.lastUsedAt
		};
		const checkout = group.checkouts.get(candidate.checkoutPath);
		if (!checkout || candidate.lastUsedAt > checkout.lastUsedAt) group.checkouts.set(candidate.checkoutPath, {
			path: candidate.checkoutPath,
			lastUsedAt: candidate.lastUsedAt
		});
		group.lastUsedAt = Math.max(group.lastUsedAt, candidate.lastUsedAt);
		if (candidate.lastUsedAt > group.nameUsedAt) {
			group.name = checkoutName(candidate.checkoutPath);
			group.nameUsedAt = candidate.lastUsedAt;
		}
		if (!group.originUrl && candidate.originUrl) group.originUrl = candidate.originUrl;
		groups.set(candidate.fingerprint, group);
	}
	return [...groups.values()].toSorted((left, right) => right.lastUsedAt - left.lastUsedAt || left.name.localeCompare(right.name)).slice(0, 50).map((group) => {
		const summary = {
			name: group.name,
			checkouts: [...group.checkouts.values()].toSorted((left, right) => right.lastUsedAt - left.lastUsedAt || left.path.localeCompare(right.path)).slice(0, 50).map((checkout) => ({
				runnerId: "gateway",
				path: checkout.path
			})),
			lastUsedAt: group.lastUsedAt
		};
		if (group.originUrl) {
			const originUrl = sanitizePublicOriginUrl(group.originUrl);
			if (originUrl) summary.originUrl = originUrl;
		}
		return summary;
	});
}
async function listObservedProjects(service, context, client) {
	const { store } = loadCombinedSessionStoreForGatewayCore(context.getRuntimeConfig(), { projection: "list" });
	const rawCandidates = [];
	const visibilityFilter = createSessionListEntryFilter({ client });
	const canSeeAll = !visibilityFilter;
	for (const [sessionKey, entry] of Object.entries(store)) {
		if (visibilityFilter && !visibilityFilter(sessionKey, entry)) continue;
		const checkoutPath = entry.execCwd?.trim();
		if (checkoutPath && !entry.execNode?.trim()) retainNewestRawProjectCandidate(rawCandidates, {
			kind: "session",
			checkoutPath,
			lastUsedAt: entry.updatedAt
		});
	}
	for (const worktree of service.listRegistryRecords()) {
		if (worktree.removedAt !== void 0) continue;
		if (!canSeeAll) {
			const ownerId = worktree.ownerKind === "session" ? worktree.ownerId?.trim() : void 0;
			const ownerEntry = ownerId ? store[ownerId] : void 0;
			if (!ownerId || !ownerEntry || !visibilityFilter?.(ownerId, ownerEntry)) continue;
		}
		retainNewestRawProjectCandidate(rawCandidates, {
			kind: "worktree",
			checkoutPath: worktree.path,
			fingerprint: worktree.repoFingerprint,
			lastUsedAt: worktree.lastActiveAt,
			repoRoot: worktree.repoRoot
		});
	}
	const candidates = [];
	const identities = /* @__PURE__ */ new Map();
	let identityProbeCount = 0;
	const resolveIdentity = (checkoutPath) => {
		const existing = identities.get(checkoutPath);
		if (existing) return existing;
		if (identityProbeCount >= 32) return;
		identityProbeCount += 1;
		const identity = Promise.resolve().then(() => service.resolveRepositoryIdentity(checkoutPath));
		identities.set(checkoutPath, identity);
		return identity;
	};
	for (const raw of rawCandidates) {
		if (raw.kind === "worktree") {
			let originUrl;
			const pendingIdentity = resolveIdentity(raw.repoRoot);
			try {
				originUrl = (pendingIdentity ? await pendingIdentity : void 0)?.originUrl || void 0;
			} catch {}
			candidates.push({
				checkoutPath: raw.checkoutPath,
				fingerprint: raw.fingerprint,
				lastUsedAt: raw.lastUsedAt,
				...originUrl ? { originUrl } : {}
			});
			continue;
		}
		const pendingIdentity = resolveIdentity(raw.checkoutPath);
		if (!pendingIdentity) continue;
		try {
			const identity = await pendingIdentity;
			candidates.push({
				checkoutPath: identity.checkoutRoot,
				fingerprint: identity.fingerprint,
				lastUsedAt: raw.lastUsedAt,
				...identity.originUrl ? { originUrl: identity.originUrl } : {}
			});
		} catch {}
	}
	return projectCandidatesToSummaries(candidates);
}
function createProjectsHandlers(service) {
	return {
		"projects.list": async ({ params, respond, context, client }) => {
			if (!assertValidParams(params, validateProjectsListParams, "projects.list", respond)) return;
			const registryProjects = listProjectRegistry(context.getRuntimeConfig());
			const projects = registryProjects.map(sanitizeProjectRecord);
			const profileId = client?.authenticatedUserProfile?.profileId;
			const canonicalProfileId = profileId ? resolveUserProfileId(profileId) ?? profileId : void 0;
			const recentProfileIds = canonicalProfileId ? /* @__PURE__ */ new Set([canonicalProfileId, ...listProfiles().filter((profile) => profile.mergedInto === canonicalProfileId).map((profile) => profile.id)]) : void 0;
			const recents = recentProfileIds ? listProjectRecents(context.getRuntimeConfig(), recentProfileIds, registryProjects) : void 0;
			const canWrite = authorizeOperatorScopesForRequiredScope(WRITE_SCOPE, Array.isArray(client?.connect.scopes) ? client.connect.scopes : []).allowed;
			if (params.includeObserved && canWrite) {
				try {
					const observedProjects = await listObservedProjects(service, context, client);
					respond(true, {
						projects,
						...recents ? { recents } : {},
						observedProjects
					}, void 0);
				} catch (error) {
					respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatErrorMessage(error)));
				}
				return;
			}
			if (canWrite) {
				respond(true, {
					projects,
					...recents ? { recents } : {}
				}, void 0);
				return;
			}
			respond(true, {
				projects: projects.map((project) => project.agentId ? {
					id: project.id,
					displayName: project.displayName,
					source: project.source,
					agentId: project.agentId
				} : {
					id: project.id,
					displayName: project.displayName,
					source: project.source
				}),
				...recents ? { recents: recents.filter((recent) => recent.kind === "project") } : {}
			}, void 0);
		},
		"projects.register": async ({ params, respond }) => {
			if (!assertValidParams(params, validateProjectsRegisterParams, "projects.register", respond)) return;
			try {
				respond(true, sanitizeProjectRecord(await registerProjectRegistry({
					path: params.path,
					name: params.name
				})), void 0);
			} catch (error) {
				respond(false, void 0, errorShape(error instanceof ProjectCheckoutError ? ErrorCodes.INVALID_REQUEST : ErrorCodes.UNAVAILABLE, formatErrorMessage(error)));
			}
		},
		"projects.add": async ({ params, respond, context, signal }) => {
			if (!assertValidParams(params, validateProjectsAddParams, "projects.add", respond)) return;
			try {
				respond(true, await materializeProjectClone({
					cfg: context.getRuntimeConfig(),
					gitUrl: params.gitUrl,
					name: params.name
				}, {
					signal,
					token: githubApiToken()
				}), void 0);
			} catch (error) {
				if (error instanceof ProjectCloneError) {
					respond(false, void 0, errorShape(error.failure === "invalid_url" ? ErrorCodes.INVALID_REQUEST : ErrorCodes.UNAVAILABLE, error.message, {
						details: {
							code: GatewayErrorDetailCodes.PROJECT_CLONE_FAILED,
							cause: error.failure
						},
						retryable: error.failure === "network" || error.failure === "clone_failed"
					}));
					return;
				}
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatErrorMessage(error)));
			}
		},
		"projects.searchRemote": async ({ params, respond }) => {
			if (!assertValidParams(params, validateProjectsSearchRemoteParams, "projects.searchRemote", respond)) return;
			try {
				respond(true, await searchRemoteProjects(params.query), void 0);
			} catch {
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "GitHub project search is unavailable. Retry shortly.", { retryable: true }));
			}
		},
		"projects.remove": async ({ params, respond, context }) => {
			if (!assertValidParams(params, validateProjectsRemoveParams, "projects.remove", respond)) return;
			const project = resolveProjectRegistry(context.getRuntimeConfig(), params.id);
			if (!project || project.source === "workspace") {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `unknown project id: ${params.id}`));
				return;
			}
			if (params.deleteCheckout) {
				if (project.source !== "cloned") {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Only projects cloned by the Gateway can delete their checkout."));
					return;
				}
				const normalizedRoot = path.resolve(project.repoRoot);
				const worktreeReference = listRegistryWorktrees(process.env).find((worktree) => !worktree.removedAt && path.resolve(worktree.repoRoot) === normalizedRoot);
				const sessionReference = Object.entries(loadCombinedSessionStoreForGatewayCore(context.getRuntimeConfig(), { projection: "list" }).store).find(([, entry]) => {
					if (entry.archivedAt) return false;
					const sessionRoot = entry.worktree?.repoRoot;
					if (sessionRoot && path.resolve(sessionRoot) === normalizedRoot) return true;
					const cwd = entry.spawnedCwd;
					return Boolean(cwd && (path.resolve(cwd) === normalizedRoot || isPathInside(normalizedRoot, path.resolve(cwd))));
				});
				if (worktreeReference || sessionReference) {
					const reference = worktreeReference ? `managed worktree ${worktreeReference.name}` : `session ${sessionReference?.[0]}`;
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `Project checkout is still referenced by ${reference}. Remove that reference before deleting the checkout.`));
					return;
				}
				try {
					await deleteClonedProjectCheckout(project);
				} catch (error) {
					respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatErrorMessage(error)));
					return;
				}
			}
			if (!removeProjectRegistry(params.id)) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `unknown project id: ${params.id}`));
				return;
			}
			respond(true, { removed: true }, void 0);
		}
	};
}
const projectsHandlers = createProjectsHandlers(managedWorktrees);
//#endregion
export { projectsHandlers };
