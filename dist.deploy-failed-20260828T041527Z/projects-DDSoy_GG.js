import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { t as pruneMapToMaxSize } from "./map-size-DAGm21RM.js";
import { a as isPathInside } from "./path-D138yf8v.js";
import "./path-guards-CQoZeoCG.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { c as parseAgentSessionKey } from "./session-key-utils-Di3FvABa.js";
import { c as WRITE_SCOPE } from "./operator-scopes-Dw7Gu2cA.js";
import { n as GatewayErrorDetailCodes, t as ErrorCodes } from "./gateway-error-details-C2IaYyht.js";
import { Bn as validateProjectsRemoveParams, Ln as validateProjectsAddParams, Rn as validateProjectsListParams, Vn as validateProjectsSearchRemoteParams, zn as validateProjectsRegisterParams } from "./src-4dv5TpeQ.js";
import { r as authorizeOperatorScopesForRequiredScope } from "./method-scopes-BQC2sTma.js";
import { n as loadCombinedSessionStoreForGatewayCore } from "./combined-store-gateway-ChJFvtyM.js";
import { d as errorShape } from "./validation-errors-rELRlKfn.js";
import { d as isTrustedSecretSurfaceUnavailableError } from "./runtime-degraded-state-D5EZZ925.js";
import { c as resolveUserProfileId, m as listProfiles } from "./user-profiles-CBL8neN1.js";
import "./session-utils-uVsFjoXC.js";
import { b as listRegistryWorktrees } from "./registry-DC6q9xGA.js";
import { c as githubApiToken, f as readGitHubJsonResponse, h as resolveGitHubApiCredentialScope, m as requiredString, o as fetchGitHubApi, p as readOptionalGitHubString, r as GITHUB_API_ORIGIN, s as fetchGitHubJson, t as CONTROL_UI_GITHUB_CREDENTIAL_UNAVAILABLE_MESSAGE } from "./control-ui-github-api-DURS8eJ_.js";
import { u as createSessionListEntryFilter } from "./session-sharing-DSLYm21V.js";
import { l as managedWorktrees } from "./service-Be0GN-Co.js";
import { t as assertValidParams } from "./validation-kYFXohur.js";
import { i as ProjectCloneError, n as removeClonedProjectCheckout, r as parseProjectGitUrl, t as materializeProjectClone } from "./project-clone-BIIMr8xP.js";
import { i as registerProjectRegistry, l as resolveProjectRegistry, n as listProjectRegistry, o as removeProjectRegistry, t as ProjectCheckoutError } from "./project-registry-DuJO7XqH.js";
import path from "node:path";
//#region src/gateway/project-github-search.ts
const SEARCH_CACHE_MS = 6e4;
const SEARCH_CACHE_LIMIT = 100;
const SEARCH_RESULT_LIMIT = 10;
const AFFILIATED_RESULT_LIMIT = 10;
const EXACT_REPO_QUERY = /^[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\/[A-Za-z0-9._-]+$/;
const searchCache = /* @__PURE__ */ new Map();
function boundedString(value, maxLength) {
	const trimmed = value?.trim();
	return trimmed ? trimmed.slice(0, maxLength) : void 0;
}
function parseRepository(value) {
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
	const description = boundedString(readOptionalGitHubString(value, "description"), 500);
	return {
		name: name.slice(0, 100),
		fullName: fullName.slice(0, 200),
		cloneUrl: clone.url,
		webUrl,
		private: value.private === true,
		...description ? { description } : {}
	};
}
function repositoryArray(value) {
	return (Array.isArray(value) ? value : isRecord(value) && Array.isArray(value.items) ? value.items : []).flatMap((item) => {
		const parsed = parseRepository(item);
		return parsed ? [parsed] : [];
	});
}
function matchesAffiliatedQuery(project, query) {
	const needle = query.toLowerCase();
	return [
		project.name,
		project.fullName,
		project.description ?? ""
	].join("\n").toLowerCase().includes(needle);
}
async function loadExactRepository(query, fetchImpl, token) {
	const url = new URL(`/repos/${query}`, GITHUB_API_ORIGIN);
	try {
		return parseRepository(await fetchGitHubJson(url.href, fetchImpl, token));
	} catch {
		return null;
	}
}
async function loadAffiliatedRepositories(fetchImpl, token) {
	const url = new URL("/user/repos", GITHUB_API_ORIGIN);
	url.searchParams.set("affiliation", "owner,collaborator,organization_member");
	url.searchParams.set("sort", "updated");
	url.searchParams.set("direction", "desc");
	url.searchParams.set("per_page", String(AFFILIATED_RESULT_LIMIT));
	try {
		return repositoryArray(await readGitHubJsonResponse(await fetchGitHubApi(url.href, fetchImpl, token)));
	} catch {
		return [];
	}
}
async function loadRepositorySearch(query, fetchImpl, token) {
	const url = new URL("/search/repositories", GITHUB_API_ORIGIN);
	url.searchParams.set("q", `${query} in:name,description`);
	url.searchParams.set("per_page", String(SEARCH_RESULT_LIMIT));
	return repositoryArray(await fetchGitHubJson(url.href, fetchImpl, token));
}
async function searchProjectsUncached(params) {
	const [exact, affiliated, global] = await Promise.all([
		EXACT_REPO_QUERY.test(params.query) ? loadExactRepository(params.query, params.fetchImpl, params.token) : null,
		params.token ? loadAffiliatedRepositories(params.fetchImpl, params.token) : [],
		loadRepositorySearch(params.query, params.fetchImpl, params.token)
	]);
	const ranked = [
		...exact ? [exact] : [],
		...affiliated.filter((project) => matchesAffiliatedQuery(project, params.query)),
		...global
	];
	const deduped = /* @__PURE__ */ new Map();
	for (const project of ranked) {
		const key = project.fullName.toLowerCase();
		if (!deduped.has(key)) deduped.set(key, project);
	}
	return {
		credential: params.token ? "configured" : "missing",
		projects: [...deduped.values()].slice(0, SEARCH_RESULT_LIMIT)
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
	const cfg = context.getRuntimeConfig();
	const { store } = loadCombinedSessionStoreForGatewayCore(cfg, { projection: "list" });
	const rawCandidates = [];
	const visibilityFilter = createSessionListEntryFilter({
		client,
		cfg
	});
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
function findProjectCheckoutReference(cfg, repoRoot) {
	const normalizedRoot = path.resolve(repoRoot);
	const workspaceReference = listProjectRegistry(cfg).find((candidate) => candidate.source === "workspace" && path.resolve(candidate.repoRoot) === normalizedRoot);
	const worktreeReference = listRegistryWorktrees(process.env).find((worktree) => !worktree.removedAt && path.resolve(worktree.repoRoot) === normalizedRoot);
	const sessionReference = Object.entries(loadCombinedSessionStoreForGatewayCore(cfg, { projection: "list" }).store).find(([, entry]) => {
		if (entry.archivedAt) return false;
		const sessionRoot = entry.worktree?.repoRoot;
		if (sessionRoot && path.resolve(sessionRoot) === normalizedRoot) return true;
		const cwd = entry.spawnedCwd;
		return Boolean(cwd && (path.resolve(cwd) === normalizedRoot || isPathInside(normalizedRoot, path.resolve(cwd))));
	});
	return workspaceReference ? `agent workspace ${workspaceReference.displayName}` : worktreeReference ? `managed worktree ${worktreeReference.name}` : sessionReference ? `session ${sessionReference[0]}` : void 0;
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
				if (isTrustedSecretSurfaceUnavailableError(error)) {
					respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, CONTROL_UI_GITHUB_CREDENTIAL_UNAVAILABLE_MESSAGE, {
						details: {
							code: GatewayErrorDetailCodes.PROJECT_CLONE_FAILED,
							cause: "auth_required"
						},
						retryable: false
					}));
					return;
				}
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
			} catch (error) {
				const credentialUnavailable = isTrustedSecretSurfaceUnavailableError(error);
				const message = credentialUnavailable ? CONTROL_UI_GITHUB_CREDENTIAL_UNAVAILABLE_MESSAGE : "GitHub project search is unavailable. Retry shortly.";
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, message, { retryable: !credentialUnavailable }));
			}
		},
		"projects.remove": async ({ params, respond, context }) => {
			if (!assertValidParams(params, validateProjectsRemoveParams, "projects.remove", respond)) return;
			const respondUnknownProject = () => {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `unknown project id: ${params.id}`));
			};
			const project = resolveProjectRegistry(context.getRuntimeConfig(), params.id);
			if (!project || project.source === "workspace") {
				respondUnknownProject();
				return;
			}
			let removed;
			if (params.deleteCheckout) {
				if (project.source !== "cloned") {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Only projects cloned by the Gateway can delete their checkout."));
					return;
				}
				try {
					removed = await removeClonedProjectCheckout(project, () => {
						const reference = findProjectCheckoutReference(context.getRuntimeConfig(), project.repoRoot);
						if (reference) throw new ProjectCheckoutError(`Project checkout is still referenced by ${reference}. Remove that reference before deleting the checkout.`);
					});
				} catch (error) {
					respond(false, void 0, errorShape(error instanceof ProjectCheckoutError ? ErrorCodes.INVALID_REQUEST : ErrorCodes.UNAVAILABLE, formatErrorMessage(error)));
					return;
				}
			} else removed = removeProjectRegistry(params.id);
			if (!removed) {
				respondUnknownProject();
				return;
			}
			respond(true, { removed: true }, void 0);
		}
	};
}
const projectsHandlers = createProjectsHandlers(managedWorktrees);
//#endregion
export { projectsHandlers };
