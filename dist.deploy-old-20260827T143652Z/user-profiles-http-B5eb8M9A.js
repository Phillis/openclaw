import { i as getOrCreatePromise } from "./lazy-promise-DGqyc4Y4.js";
import { r as getRuntimeConfig } from "./io-CeQckj5v.js";
import { l as getUserProfileListItem, o as formatUserProfileAvatarEtag, s as getProfileAvatar, t as UserProfileNotFoundError } from "./user-profiles-DsqyqqQy.js";
import { r as matchUserProfileAvatarPath } from "./user-profiles-http-path-BFesDPdu.js";
import { h as resolveSharedSecretHttpOperatorScopes, o as authorizeScopedUserProfileAvatarHttpRequestOrReply } from "./http-auth-utils-CM89UREd.js";
import { c as sendMethodNotAllowed, s as sendJson } from "./http-common-BIedCt0N.js";
import "./http-utils-BDzE3kVj.js";
import { t as matchesHttpIfNoneMatch } from "./http-conditional-BWrY1Un1.js";
import { createHash } from "node:crypto";
//#region src/gateway/user-profiles-http.ts
const GRAVATAR_BASE_URL = "https://www.gravatar.com/avatar";
const GRAVATAR_FETCH_TIMEOUT_MS = 5e3;
const GRAVATAR_TOTAL_TIMEOUT_MS = 6e3;
const GRAVATAR_CACHE_MAX_ENTRIES = 256;
const GRAVATAR_CACHE_MAX_BYTES = 16 * 1024 * 1024;
const GRAVATAR_HIT_TTL_MS = 1440 * 6e4;
const GRAVATAR_MISS_TTL_MS = 15 * 6e4;
const MAX_GRAVATAR_BYTES = 1e6;
const MAX_GRAVATAR_EMAIL_LOOKUPS = 8;
const GRAVATAR_MIME_TYPES = /* @__PURE__ */ new Set([
	"image/gif",
	"image/jpeg",
	"image/png",
	"image/webp"
]);
function resolveAvatarCorsOrigin(req, cfg) {
	const rawOrigin = typeof req.headers.origin === "string" ? req.headers.origin.trim() : "";
	if (!rawOrigin) return;
	let origin;
	try {
		const parsed = new URL(rawOrigin);
		if (parsed.origin !== rawOrigin || parsed.username || parsed.password) return;
		origin = parsed.origin;
	} catch {
		return;
	}
	return (cfg.gateway?.controlUi?.allowedOrigins ?? []).some((candidate) => candidate.trim() === "*" || candidate.trim() === origin) ? origin : void 0;
}
function setAvatarCorsHeaders(req, res, cfg) {
	if (!req.headers.origin) return true;
	const origin = resolveAvatarCorsOrigin(req, cfg);
	if (!origin) return false;
	res.setHeader("Access-Control-Allow-Origin", origin);
	res.setHeader("Access-Control-Allow-Credentials", "true");
	res.setHeader("Vary", "Origin");
	return true;
}
const gravatarCache = /* @__PURE__ */ new Map();
const gravatarRequests = /* @__PURE__ */ new Map();
let gravatarCacheBytes = 0;
function deleteCachedGravatar(hash) {
	const cached = gravatarCache.get(hash);
	if (cached?.kind === "hit") gravatarCacheBytes -= cached.bytes.byteLength;
	gravatarCache.delete(hash);
}
function hashEmail(email) {
	return createHash("sha256").update(email.trim().toLowerCase()).digest("hex");
}
function getCachedGravatar(hash, nowMs) {
	const cached = gravatarCache.get(hash);
	if (!cached) return;
	if (cached.expiresAtMs <= nowMs) {
		deleteCachedGravatar(hash);
		return;
	}
	deleteCachedGravatar(hash);
	gravatarCache.set(hash, cached);
	if (cached.kind === "hit") gravatarCacheBytes += cached.bytes.byteLength;
	return cached.kind === "hit" ? {
		kind: "hit",
		bytes: cached.bytes,
		mime: cached.mime,
		etag: cached.etag
	} : { kind: "miss" };
}
function cacheGravatar(hash, result, nowMs) {
	const ttlMs = result.kind === "hit" ? GRAVATAR_HIT_TTL_MS : GRAVATAR_MISS_TTL_MS;
	deleteCachedGravatar(hash);
	const cached = {
		...result,
		expiresAtMs: nowMs + ttlMs
	};
	gravatarCache.set(hash, cached);
	if (cached.kind === "hit") gravatarCacheBytes += cached.bytes.byteLength;
	while (gravatarCache.size > GRAVATAR_CACHE_MAX_ENTRIES || gravatarCacheBytes > GRAVATAR_CACHE_MAX_BYTES) {
		const oldest = gravatarCache.keys().next().value;
		if (oldest === void 0) break;
		deleteCachedGravatar(oldest);
	}
}
function normalizeContentType(value) {
	return value?.split(";", 1)[0]?.trim().toLowerCase() ?? "";
}
async function readBoundedGravatarBody(body) {
	if (!body) return;
	const reader = body.getReader();
	const chunks = [];
	let totalBytes = 0;
	try {
		while (true) {
			const next = await reader.read();
			if (next.done) break;
			totalBytes += next.value.byteLength;
			if (totalBytes > MAX_GRAVATAR_BYTES) {
				await reader.cancel();
				return;
			}
			chunks.push(next.value);
		}
	} finally {
		reader.releaseLock();
	}
	if (totalBytes === 0) return;
	const bytes = new Uint8Array(totalBytes);
	let offset = 0;
	for (const chunk of chunks) {
		bytes.set(chunk, offset);
		offset += chunk.byteLength;
	}
	return bytes;
}
async function cancelGravatarBody(body) {
	try {
		await body?.cancel();
	} catch {}
}
async function fetchGravatar(hash, fetchImpl, deadline) {
	try {
		const perCall = AbortSignal.timeout(GRAVATAR_FETCH_TIMEOUT_MS);
		const response = await fetchImpl(`${GRAVATAR_BASE_URL}/${hash}?s=256&d=404`, {
			headers: { Accept: "image/webp,image/png,image/jpeg,image/gif" },
			signal: deadline ? AbortSignal.any([deadline, perCall]) : perCall
		});
		if (response.status === 404) {
			await cancelGravatarBody(response.body);
			return { kind: "miss" };
		}
		if (!response.ok) {
			await cancelGravatarBody(response.body);
			return { kind: "error" };
		}
		const mime = normalizeContentType(response.headers.get("content-type"));
		const declaredLength = Number(response.headers.get("content-length"));
		if (!GRAVATAR_MIME_TYPES.has(mime) || Number.isFinite(declaredLength) && declaredLength > MAX_GRAVATAR_BYTES) {
			await cancelGravatarBody(response.body);
			return { kind: "error" };
		}
		const bytes = await readBoundedGravatarBody(response.body);
		if (!bytes) return { kind: "error" };
		return {
			kind: "hit",
			bytes,
			mime,
			etag: `"gravatar-${createHash("sha256").update(bytes).digest("hex")}"`
		};
	} catch {
		return { kind: "error" };
	}
}
async function resolveGravatar(hash, options) {
	const cached = getCachedGravatar(hash, options.nowMs());
	if (cached) return cached;
	return await getOrCreatePromise(gravatarRequests, hash, async () => {
		const result = await fetchGravatar(hash, options.fetchImpl, options.deadline);
		if (result.kind !== "error") cacheGravatar(hash, result, options.nowMs());
		return result;
	}, { evictOnSettled: true });
}
function sendAvatar(req, res, avatar, cacheControl) {
	if (matchesHttpIfNoneMatch(req.headers["if-none-match"], avatar.etag)) {
		res.writeHead(304, {
			ETag: avatar.etag,
			"Cache-Control": cacheControl
		});
		res.end();
		return;
	}
	res.writeHead(200, {
		"Content-Type": avatar.mime,
		"Content-Length": avatar.bytes.byteLength,
		"Cache-Control": cacheControl,
		ETag: avatar.etag
	});
	res.end(req.method === "HEAD" ? void 0 : avatar.bytes);
}
/** Serves a profile avatar to authenticated HTTP or verified Tailscale UI sessions. */
async function handleUserProfileAvatarHttpRequest(req, res, pathname, opts) {
	const profileId = matchUserProfileAvatarPath(pathname);
	if (profileId === void 0) return false;
	const method = req.method;
	const corsAllowed = setAvatarCorsHeaders(req, res, getRuntimeConfig());
	if (method === "OPTIONS") {
		if (!corsAllowed) {
			sendJson(res, 403, {
				ok: false,
				error: { type: "origin_not_allowed" }
			});
			return true;
		}
		res.setHeader("Access-Control-Allow-Methods", "GET, HEAD");
		res.setHeader("Access-Control-Allow-Headers", "Authorization");
		res.setHeader("Access-Control-Max-Age", "600");
		res.writeHead(204);
		res.end();
		return true;
	}
	if (method !== "GET" && method !== "HEAD") {
		sendMethodNotAllowed(res, "GET, HEAD");
		return true;
	}
	if (!await authorizeScopedUserProfileAvatarHttpRequestOrReply({
		req,
		res,
		auth: opts.auth,
		trustedProxies: opts.trustedProxies,
		allowRealIpFallback: opts.allowRealIpFallback,
		rateLimiter: opts.rateLimiter,
		operatorMethod: "users.list",
		resolveOperatorScopes: resolveSharedSecretHttpOperatorScopes
	})) return true;
	res.setHeader("Cache-Control", "no-store");
	let uploadedAvatar;
	try {
		uploadedAvatar = getProfileAvatar(profileId);
	} catch (error) {
		if (error instanceof UserProfileNotFoundError) {
			sendJson(res, 404, {
				ok: false,
				error: { type: "not_found" }
			});
			return true;
		}
		sendJson(res, 500, {
			ok: false,
			error: { type: "profile_lookup_failed" }
		});
		return true;
	}
	if (uploadedAvatar) {
		sendAvatar(req, res, {
			bytes: uploadedAvatar.bytes,
			mime: uploadedAvatar.mime,
			etag: formatUserProfileAvatarEtag(uploadedAvatar.sha256, uploadedAvatar.mime)
		}, "private, max-age=0, must-revalidate");
		return true;
	}
	let hashes;
	try {
		hashes = getUserProfileListItem(profileId).emails.slice(0, MAX_GRAVATAR_EMAIL_LOOKUPS).map(hashEmail);
	} catch (error) {
		if (error instanceof UserProfileNotFoundError) {
			sendJson(res, 404, {
				ok: false,
				error: { type: "not_found" }
			});
			return true;
		}
		sendJson(res, 500, {
			ok: false,
			error: { type: "profile_lookup_failed" }
		});
		return true;
	}
	const deadline = AbortSignal.timeout(GRAVATAR_TOTAL_TIMEOUT_MS);
	let transientFailure = false;
	for (const hash of hashes) {
		const result = await resolveGravatar(hash, {
			fetchImpl: opts.fetchImpl ?? globalThis.fetch,
			nowMs: opts.nowMs ?? Date.now,
			deadline
		});
		if (result.kind === "hit") {
			sendAvatar(req, res, result, "private, max-age=0, must-revalidate");
			return true;
		}
		transientFailure ||= result.kind === "error";
		if (deadline.aborted) break;
	}
	sendJson(res, transientFailure ? 502 : 404, {
		ok: false,
		error: { type: transientFailure ? "avatar_upstream_unavailable" : "not_found" }
	});
	return true;
}
//#endregion
export { handleUserProfileAvatarHttpRequest };
