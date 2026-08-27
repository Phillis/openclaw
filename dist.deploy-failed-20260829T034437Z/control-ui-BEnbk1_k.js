import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { t as pruneMapToMaxSize } from "./map-size-DAGm21RM.js";
import { m as redactToolPayloadText } from "./redact-CWP17HFN.js";
import "./utils-Bw16L5tB.js";
import { t as ErrorCodes } from "./gateway-error-details-C2IaYyht.js";
import { d as errorShape } from "./validation-errors-rELRlKfn.js";
import { d as isTrustedSecretSurfaceUnavailableError } from "./runtime-degraded-state-D5EZZ925.js";
import { s as buildGatewaySessionRow } from "./session-utils-list-Bb0Qg6y4.js";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-C9E8iDY4.js";
import "./session-utils-BTR52tOf.js";
import { a as discardResponse, d as readBoundedResponse, f as readGitHubJsonResponse, g as withOptionalGitHubAuth, h as resolveGitHubApiCredentialScope, i as GITHUB_REQUEST_TIMEOUT_MS, m as requiredString, n as ControlUiGitHubError, o as fetchGitHubApi, p as readOptionalGitHubString, r as GITHUB_API_ORIGIN, t as CONTROL_UI_GITHUB_CREDENTIAL_UNAVAILABLE_MESSAGE, u as optionalNumber } from "./control-ui-github-api-DURS8eJ_.js";
import { u as createSessionListEntryFilter } from "./session-sharing-C4OmHGYo.js";
import { a as loadSessionEntriesForTarget } from "./sessions-shared-Cz1Xn6wW.js";
import { n as parseControlUiSessionPullRequestsSubscribeParams } from "./control-ui-session-pr-subscriptions-DcW5lXb7.js";
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
function cacheKey(target, credentialScope) {
	return `${target.kind}:${target.owner.toLowerCase()}/${target.repo.toLowerCase()}#${target.number}\0${credentialScope}`;
}
function loadControlUiGitHubPreview(target, fetchImpl = fetch) {
	const { token, cacheScope } = resolveGitHubApiCredentialScope();
	const key = cacheKey(target, cacheScope);
	const now = Date.now();
	const cached = previewCache.get(key);
	if (cached && cached.expiresAt > now) {
		previewCache.delete(key);
		previewCache.set(key, cached);
		return cached.promise;
	}
	if (cached) previewCache.delete(key);
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
const SESSION_PREVIEW_TEXT_MAX_CHARS = 200;
function boundedPreviewText(value, maxChars = SESSION_PREVIEW_TEXT_MAX_CHARS) {
	const trimmed = value?.trim();
	return trimmed ? truncateUtf16Safe(trimmed, maxChars) : void 0;
}
function parseSessionPreviewKey(params) {
	if (!isRecord(params) || Object.keys(params).some((key) => key !== "sessionKey")) return null;
	const sessionKey = typeof params.sessionKey === "string" ? params.sessionKey.trim() : "";
	return sessionKey && sessionKey.length <= 512 ? sessionKey : null;
}
function projectSessionPreview(source) {
	if (!source) return { status: "unavailable" };
	const lastMessagePreview = boundedPreviewText(source.lastMessagePreview ? redactToolPayloadText(source.lastMessagePreview) : void 0);
	const title = boundedPreviewText(source.title);
	const derivedTitle = boundedPreviewText(source.derivedTitle);
	const kind = boundedPreviewText(source.kind, 64);
	const channel = boundedPreviewText(source.channel, 80);
	return {
		status: "ok",
		sessionKey: source.sessionKey,
		agentId: source.agentId,
		...title ? { title } : {},
		...derivedTitle ? { derivedTitle } : {},
		...kind ? { kind } : {},
		...channel ? { channel } : {},
		...typeof source.updatedAt === "number" && Number.isFinite(source.updatedAt) ? { updatedAt: source.updatedAt } : {},
		...lastMessagePreview ? { lastMessagePreview } : {},
		...typeof source.archived === "boolean" ? { archived: source.archived } : {}
	};
}
function loadControlUiSessionPreview(sessionKey, context, client) {
	const cfg = context.getRuntimeConfig();
	const requestedAgent = resolveRequestedSessionAgentId(cfg, sessionKey);
	if (!requestedAgent.ok) return null;
	const { target, storePath, store, entry } = loadSessionEntriesForTarget({
		key: sessionKey,
		cfg,
		...requestedAgent.agentId ? { agentId: requestedAgent.agentId } : {}
	});
	if (!entry) return null;
	const entryFilter = createSessionListEntryFilter({
		client,
		cfg
	});
	if (entryFilter && !entryFilter(target.canonicalKey, entry)) return null;
	const row = buildGatewaySessionRow({
		cfg,
		storePath,
		store,
		key: target.canonicalKey,
		entry,
		includeDerivedTitles: true,
		includeLastMessage: true,
		transcriptUsageMaxBytes: 64 * 1024
	});
	return {
		sessionKey: row.key,
		agentId: row.agentId ?? target.agentId,
		title: row.displayName,
		derivedTitle: row.derivedTitle,
		kind: row.kind,
		channel: row.channel,
		updatedAt: row.updatedAt,
		lastMessagePreview: row.lastMessagePreview,
		archived: row.archived
	};
}
function createControlUiHandlers(loadGitHubPreview = loadControlUiGitHubPreview, loadSessionPreview = loadControlUiSessionPreview) {
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
				const credentialUnavailable = isTrustedSecretSurfaceUnavailableError(error);
				const message = credentialUnavailable ? CONTROL_UI_GITHUB_CREDENTIAL_UNAVAILABLE_MESSAGE : "GitHub preview unavailable";
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, message, { retryable: !credentialUnavailable && (statusCode === 429 || statusCode === 502) }));
			}
		},
		"controlUi.sessionPreview": async ({ params, client, context, respond }) => {
			const sessionKey = parseSessionPreviewKey(params);
			if (!sessionKey) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid controlUi.sessionPreview params"));
				return;
			}
			try {
				respond(true, projectSessionPreview(await loadSessionPreview(sessionKey, context, client)), void 0);
			} catch {
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "Session preview unavailable"));
			}
		},
		"controlUi.sessionPullRequests.subscribe": ({ params, client, context, respond }) => {
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
			if (parsed.refreshSessionKeys.length > 0) subscriptions.replace(connId, parsed.sessionKeys, new Set(parsed.refreshSessionKeys));
			else subscriptions.replace(connId, parsed.sessionKeys);
			respond(true, { subscribed: parsed.sessionKeys.length > 0 }, void 0);
		}
	};
}
const controlUiHandlers = createControlUiHandlers();
//#endregion
export { controlUiHandlers };
