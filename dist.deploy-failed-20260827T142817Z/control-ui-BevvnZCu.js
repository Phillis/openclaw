import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { t as pruneMapToMaxSize } from "./map-size-DAGm21RM.js";
import { t as ErrorCodes } from "./gateway-error-details-BWo6Le6w.js";
import { s as errorShape } from "./error-codes-CMSvT5-d.js";
import { a as fetchGitHubApi, c as optionalNumber, d as readOptionalGitHubString, f as requiredString, i as discardResponse, l as readBoundedResponse, m as withOptionalGitHubAuth, n as GITHUB_API_ORIGIN, r as GITHUB_REQUEST_TIMEOUT_MS, s as githubApiToken, t as ControlUiGitHubError, u as readGitHubJsonResponse } from "./control-ui-github-api-DiLldJZ0.js";
import { n as parseControlUiSessionPullRequestsSubscribeParams } from "./control-ui-session-pr-subscriptions-BfO8yact.js";
//#region src/gateway/control-ui-github-preview.ts
const GITHUB_AVATAR_HOST = "avatars.githubusercontent.com";
const GITHUB_AVATAR_MAX_BYTES = 256 * 1024;
const AUTHENTICATED_SUCCESS_CACHE_MS = 5 * 6e4;
const ANONYMOUS_SUCCESS_CACHE_MS = 60 * 6e4;
const FAILURE_CACHE_MS = 3e4;
const CACHE_LIMIT = 200;
const previewCache = /* @__PURE__ */ new Map();
function isValidOwner(value) {
	return /^(?=.{1,39}$)[a-z\d](?:[a-z\d-]*[a-z\d])?$/iu.test(value);
}
function isValidRepo(value) {
	if (value.length < 1 || value.length > 100) return false;
	const lower = value.toLowerCase();
	if (!/^[a-z\d._-]+$/iu.test(value) || lower === "." || lower === "..") return false;
	return !lower.endsWith(".git") && !lower.endsWith(".atom");
}
function parseControlUiGitHubPreviewTarget(value) {
	if (!isRecord(value)) return null;
	const kind = value.kind;
	const owner = typeof value.owner === "string" ? value.owner.trim() : "";
	const repo = typeof value.repo === "string" ? value.repo.trim() : "";
	const number = value.number;
	if (kind !== "issue" && kind !== "pull" || !isValidOwner(owner) || !isValidRepo(repo) || typeof number !== "number" || !Number.isSafeInteger(number) || number < 1 || number > 9999999999) return null;
	return {
		kind,
		number,
		owner,
		repo
	};
}
function previewApiUrl(target) {
	const collection = target.kind === "pull" ? "pulls" : "issues";
	return `${GITHUB_API_ORIGIN}/repos/${encodeURIComponent(target.owner)}/${encodeURIComponent(target.repo)}/${collection}/${target.number}`;
}
function repositoryApiUrl(target) {
	return `${GITHUB_API_ORIGIN}/repos/${encodeURIComponent(target.owner)}/${encodeURIComponent(target.repo)}`;
}
async function assertPublicRepositoryUrl(repositoryUrl, fetchImpl, token) {
	const parsed = await readGitHubJsonResponse(await fetchGitHubApi(repositoryUrl, fetchImpl, token));
	if (!isRecord(parsed) || parsed.private !== false) throw new ControlUiGitHubError(404, "GitHub repository is not public");
}
function redirectedRepositoryApiUrl(target, url) {
	const segments = url.pathname.split("/").filter(Boolean);
	const collection = target.kind === "pull" ? "pulls" : "issues";
	if (segments.length === 5 && segments[0] === "repos" && segments[1] && segments[2] && segments[3] === collection && /^\d+$/u.test(segments[4] ?? "")) return `${GITHUB_API_ORIGIN}/repos/${segments[1]}/${segments[2]}`;
	if (segments.length === 4 && segments[0] === "repositories" && /^\d+$/u.test(segments[1] ?? "") && segments[2] === collection && /^\d+$/u.test(segments[3] ?? "")) return `${GITHUB_API_ORIGIN}/repositories/${segments[1]}`;
	return null;
}
function previewRepositoryApiUrl(target, value) {
	if (target.kind === "issue") return requiredString(value, "repository_url");
	const base = isRecord(value.base) ? value.base : {};
	return requiredString(isRecord(base.repo) ? base.repo : {}, "url");
}
function parseGitHubResponse(target, value) {
	if (!isRecord(value)) throw new ControlUiGitHubError(502, "GitHub response was not an object");
	const user = isRecord(value.user) ? value.user : {};
	return {
		preview: {
			...target,
			additions: optionalNumber(value, "additions"),
			changedFiles: optionalNumber(value, "changed_files"),
			closedAt: readOptionalGitHubString(value, "closed_at"),
			comments: optionalNumber(value, "comments"),
			createdAt: requiredString(value, "created_at"),
			deletions: optionalNumber(value, "deletions"),
			draft: typeof value.draft === "boolean" ? value.draft : void 0,
			login: readOptionalGitHubString(user, "login") ?? "ghost",
			mergedAt: readOptionalGitHubString(value, "merged_at"),
			state: requiredString(value, "state"),
			stateReason: readOptionalGitHubString(value, "state_reason"),
			title: requiredString(value, "title"),
			updatedAt: requiredString(value, "updated_at")
		},
		avatarUrl: readOptionalGitHubString(user, "avatar_url")
	};
}
function safeAvatarUrl(raw) {
	if (!raw) return null;
	try {
		const url = new URL(raw);
		const rawPathEnd = raw.search(/[?#]/u);
		const rawPath = rawPathEnd === -1 ? raw : raw.slice(0, rawPathEnd);
		if (url.protocol !== "https:" || url.hostname !== GITHUB_AVATAR_HOST || url.hash || url.username || url.password || url.port || rawPath.includes("..") || rawPath.includes("\\") || url.pathname.includes("..") || url.pathname.includes("\\")) return null;
		url.search = "";
		url.searchParams.set("s", "64");
		return url;
	} catch {
		return null;
	}
}
async function fetchAvatarDataUrl(rawUrl, fetchImpl) {
	const url = safeAvatarUrl(rawUrl);
	if (!url) return;
	try {
		const response = await fetchImpl(url, {
			headers: { Accept: "image/webp,image/png,image/jpeg,image/gif" },
			redirect: "error",
			signal: AbortSignal.timeout(GITHUB_REQUEST_TIMEOUT_MS)
		});
		const contentType = response.headers.get("content-type")?.split(";", 1)[0]?.trim();
		if (!response.ok || !contentType || ![
			"image/gif",
			"image/jpeg",
			"image/png",
			"image/webp"
		].includes(contentType)) {
			await discardResponse(response);
			return;
		}
		return `data:${contentType};base64,${(await readBoundedResponse(response, GITHUB_AVATAR_MAX_BYTES)).toString("base64")}`;
	} catch {
		return;
	}
}
async function fetchPreview(target, fetchImpl, token) {
	if (token) await assertPublicRepositoryUrl(repositoryApiUrl(target), fetchImpl, token);
	const parsed = await readGitHubJsonResponse(await fetchGitHubApi(previewApiUrl(target), fetchImpl, token, token ? async (url) => {
		const repositoryUrl = redirectedRepositoryApiUrl(target, url);
		if (!repositoryUrl) throw new ControlUiGitHubError(502, "GitHub item returned an unsafe redirect");
		await assertPublicRepositoryUrl(repositoryUrl, fetchImpl, token);
	} : void 0));
	if (!isRecord(parsed)) throw new ControlUiGitHubError(502, "GitHub response was not an object");
	if (token) await assertPublicRepositoryUrl(previewRepositoryApiUrl(target, parsed), fetchImpl, token);
	const { preview, avatarUrl } = parseGitHubResponse(target, parsed);
	const avatarDataUrl = await fetchAvatarDataUrl(avatarUrl, fetchImpl);
	return avatarDataUrl ? {
		...preview,
		avatarDataUrl
	} : preview;
}
function cacheKey(target) {
	return `${target.kind}:${target.owner.toLowerCase()}/${target.repo.toLowerCase()}#${target.number}`;
}
function loadControlUiGitHubPreview(target, fetchImpl = fetch) {
	const key = cacheKey(target);
	const now = Date.now();
	const cached = previewCache.get(key);
	if (cached && cached.expiresAt > now) {
		previewCache.delete(key);
		previewCache.set(key, cached);
		return cached.promise;
	}
	if (cached) previewCache.delete(key);
	const token = githubApiToken();
	const entry = {
		expiresAt: now + (token ? AUTHENTICATED_SUCCESS_CACHE_MS : ANONYMOUS_SUCCESS_CACHE_MS),
		promise: withOptionalGitHubAuth(token, (requestToken) => fetchPreview(target, fetchImpl, requestToken)).catch((error) => {
			entry.expiresAt = Date.now() + FAILURE_CACHE_MS;
			throw error;
		})
	};
	previewCache.set(key, entry);
	pruneMapToMaxSize(previewCache, CACHE_LIMIT);
	return entry.promise;
}
//#endregion
//#region src/gateway/server-methods/control-ui.ts
function createControlUiHandlers(loadGitHubPreview = loadControlUiGitHubPreview) {
	return {
		"controlUi.githubPreview": async ({ params, respond }) => {
			const target = parseControlUiGitHubPreviewTarget(params);
			if (!target) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid controlUi.githubPreview params"));
				return;
			}
			try {
				respond(true, await loadGitHubPreview(target), void 0);
			} catch (error) {
				const statusCode = error instanceof ControlUiGitHubError ? error.statusCode : void 0;
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "GitHub preview unavailable", { retryable: statusCode === 429 || statusCode === 502 }));
			}
		},
		"controlUi.sessionPullRequests.subscribe": async ({ params, client, context, respond }) => {
			const parsed = parseControlUiSessionPullRequestsSubscribeParams(params);
			if (!parsed) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid controlUi.sessionPullRequests.subscribe params"));
				return;
			}
			const connId = client?.connId?.trim();
			const subscriptions = context.controlUiSessionPullRequests;
			if (!connId || !subscriptions) {
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "session pull request subscriptions unavailable"));
				return;
			}
			if (parsed.refreshSessionKeys.length > 0) await subscriptions.replace(connId, parsed.sessionKeys, new Set(parsed.refreshSessionKeys));
			else await subscriptions.replace(connId, parsed.sessionKeys);
			respond(true, { subscribed: parsed.sessionKeys.length > 0 }, void 0);
		}
	};
}
const controlUiHandlers = createControlUiHandlers();
//#endregion
export { controlUiHandlers };
