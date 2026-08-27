import { t as pruneMapToMaxSize } from "./map-size-DAGm21RM.js";
import { t as normalizeHostname } from "./hostname-_16721Le.js";
import { c as isBlockedHostnameOrIp } from "./ssrf-arYIaOWE.js";
import { d as readImageMetadataFromHeader, s as createImageProcessor } from "./image-ops-CNJmjS8j.js";
import { r as readRemoteMediaBuffer } from "./fetch-LdRI1MZX.js";
import { a as parseControlUiResourcePath } from "./control-ui-contract-CgrOMhfo.js";
import { n as authorizeControlUiReadRequestOrReply } from "./http-auth-utils-Bmffinhw.js";
import { c as sendMethodNotAllowed, v as respondNotFound } from "./http-common-Dy8Dj7pv.js";
import "./http-utils-Q1g14o7u.js";
import { o as resolveManagedPluginIconUrl, s as resolveManagedSetupCatalogIconUrl } from "./management-service-B2JHS0QY.js";
import { isIP } from "node:net";
import pLimit from "p-limit";
import { fileTypeFromBuffer } from "file-type";
//#region src/gateway/plugin-icon-http.ts
const PLUGIN_ID_RE = /^(?:[a-z0-9][a-z0-9._-]{0,127}|@[a-z0-9][a-z0-9._-]{0,63}\/[a-z0-9][a-z0-9._-]{0,127})$/iu;
const ALLOWED_IMAGE_MIME_TYPES = /* @__PURE__ */ new Set([
	"image/avif",
	"image/gif",
	"image/jpeg",
	"image/png",
	"image/svg+xml",
	"image/webp",
	"image/x-icon"
]);
const SVG_MIME_TYPE = "image/svg+xml";
const PLUGIN_ICON_CACHE_MAX_ENTRIES = 128;
const LINK_FAVICON_MAX_BYTES = 64 * 1024;
const LINK_FAVICON_NEGATIVE_CACHE_TTL_MS = 300 * 1e3;
const LINK_FAVICON_MAX_OUTSTANDING_FETCHES = 32;
const linkFaviconFetchLimit = pLimit(4);
const PLUGIN_ICON_MAX_BYTES = 256 * 1024;
const PLUGIN_ICON_MAX_REDIRECTS = 3;
const PLUGIN_ICON_REQUEST_TIMEOUT_MS = 5e3;
const PLUGIN_ICON_CACHE_TTL_MS = 3600 * 1e3;
let pluginIconCache = /* @__PURE__ */ new Map();
const pluginIconImageProcessor = createImageProcessor();
function normalizeLinkFaviconHostname(value) {
	if (value.length > 253) return null;
	const normalized = normalizeHostname(value);
	if (!normalized || isIP(normalized) !== 0 || isBlockedHostnameOrIp(normalized)) return null;
	try {
		return new URL(`https://${normalized}/`).hostname === normalized ? normalized : null;
	} catch {
		return null;
	}
}
function normalizeMimeType(contentType) {
	const normalized = contentType?.split(";", 1)[0]?.trim().toLowerCase() || void 0;
	return normalized === "image/vnd.microsoft.icon" ? "image/x-icon" : normalized;
}
async function validateImageMime(body, contentType) {
	if (contentType === SVG_MIME_TYPE) {
		const text = body.toString("utf8");
		return !text.includes("\0") && !/<!doctype|<!entity/iu.test(text) && /^\s*(?:<\?xml[^>]*>\s*)?(?:<!--[\s\S]*?-->\s*)*<svg(?:\s|>)/iu.test(text);
	}
	return normalizeMimeType((await fileTypeFromBuffer(body))?.mime) === contentType;
}
function rememberIcon(cache, cacheKey, entry) {
	cache.delete(cacheKey);
	cache.set(cacheKey, entry);
	pruneMapToMaxSize(cache, PLUGIN_ICON_CACHE_MAX_ENTRIES);
	return entry;
}
async function loadCatalogIcon(params) {
	let parsed;
	try {
		parsed = new URL(params.iconUrl);
	} catch {
		return null;
	}
	if (parsed.protocol !== "https:" || parsed.username || parsed.password || !parsed.hostname || parsed.hash) return null;
	const cacheKey = `${params.cacheScope}\0${parsed.href}`;
	const now = Date.now();
	const cached = pluginIconCache.get(cacheKey);
	if (cached && cached.expiresAt > now) {
		pluginIconCache.delete(cacheKey);
		pluginIconCache.set(cacheKey, cached);
		return await cached.promise;
	}
	if (cached) pluginIconCache.delete(cacheKey);
	const load = async () => {
		try {
			const loaded = await readRemoteMediaBuffer({
				url: parsed.href,
				maxBytes: params.maxBytes ?? 262144,
				maxRedirects: 3,
				requireHttps: params.requireHttps,
				timeoutMs: PLUGIN_ICON_REQUEST_TIMEOUT_MS,
				responseHeaderTimeoutMs: PLUGIN_ICON_REQUEST_TIMEOUT_MS,
				readIdleTimeoutMs: PLUGIN_ICON_REQUEST_TIMEOUT_MS,
				requestInit: { headers: { Accept: "image/avif,image/webp,image/png,image/jpeg,image/gif,image/svg+xml" } }
			});
			const contentType = normalizeMimeType(loaded.contentType);
			if (!contentType || !ALLOWED_IMAGE_MIME_TYPES.has(contentType) || !await validateImageMime(loaded.buffer, contentType)) return null;
			if (contentType === SVG_MIME_TYPE) return {
				body: loaded.buffer,
				contentType
			};
			if (contentType === "image/x-icon") return {
				body: loaded.buffer,
				contentType
			};
			const metadata = readImageMetadataFromHeader(loaded.buffer);
			if (!metadata || !Number.isInteger(metadata.width) || !Number.isInteger(metadata.height) || metadata.width <= 0 || metadata.height <= 0 || metadata.width > 25e6 / metadata.height) return null;
			const normalized = await pluginIconImageProcessor.encode(loaded.buffer, {
				format: "png",
				compressionLevel: 9,
				resize: {
					fit: "inside",
					maxSide: 256,
					enlarge: false
				}
			});
			if (normalized.data.byteLength > (params.maxBytes ?? 262144)) return null;
			return {
				body: normalized.data,
				contentType: "image/png"
			};
		} catch {
			return null;
		}
	};
	if (params.limitConcurrency && linkFaviconFetchLimit.activeCount + linkFaviconFetchLimit.pendingCount >= LINK_FAVICON_MAX_OUTSTANDING_FETCHES) return null;
	const pending = params.limitConcurrency ? linkFaviconFetchLimit(load) : load();
	const entry = rememberIcon(pluginIconCache, cacheKey, {
		expiresAt: now + PLUGIN_ICON_CACHE_TTL_MS,
		promise: pending
	});
	const result = await pending;
	if (!result && pluginIconCache.get(cacheKey) === entry) if (params.retainFailureForMs) entry.expiresAt = Date.now() + params.retainFailureForMs;
	else pluginIconCache.delete(cacheKey);
	return result;
}
function clearPluginIconCacheForTest() {
	pluginIconCache = /* @__PURE__ */ new Map();
}
async function handlePluginIconHttpRequest(req, res, opts) {
	const pathname = req.url ? new URL(req.url, "http://localhost").pathname : void 0;
	const pluginRequest = parseControlUiResourcePath("pluginIcon", pathname, opts.basePath);
	const catalogRequest = parseControlUiResourcePath("catalogIcon", pathname, opts.basePath);
	const faviconRequest = parseControlUiResourcePath("linkFavicon", pathname, opts.basePath);
	if (!pluginRequest.matched && !catalogRequest.matched && !faviconRequest.matched) return false;
	const pluginId = pluginRequest.matched && pluginRequest.value && PLUGIN_ID_RE.test(pluginRequest.value) ? pluginRequest.value : null;
	const catalogIconUrl = catalogRequest.matched ? catalogRequest.value : null;
	const faviconHostname = faviconRequest.matched ? faviconRequest.value ? normalizeLinkFaviconHostname(faviconRequest.value) : null : null;
	const method = req.method;
	if (method !== "GET" && method !== "HEAD") {
		sendMethodNotAllowed(res, "GET, HEAD");
		return true;
	}
	if (!await authorizeControlUiReadRequestOrReply({
		req,
		res,
		auth: opts.auth,
		trustedProxies: opts.trustedProxies,
		allowRealIpFallback: opts.allowRealIpFallback,
		rateLimiter: opts.rateLimiter
	})) return true;
	if (faviconRequest.matched && opts.config.gateway?.controlUi?.automaticallyFetchFavicons === false) {
		respondNotFound(res);
		return true;
	}
	const iconUrl = pluginId ? await resolveManagedPluginIconUrl({
		config: opts.config,
		pluginId
	}) : catalogIconUrl ? resolveManagedSetupCatalogIconUrl({
		config: opts.config,
		iconUrl: catalogIconUrl
	}) : faviconHostname ? `https://${faviconHostname}/favicon.ico` : void 0;
	if (!iconUrl) {
		respondNotFound(res);
		return true;
	}
	const icon = await loadCatalogIcon({
		cacheScope: pluginId ? `plugin:${pluginId}` : faviconHostname ? "favicon" : "catalog",
		iconUrl,
		...faviconHostname ? {
			maxBytes: LINK_FAVICON_MAX_BYTES,
			requireHttps: true,
			retainFailureForMs: LINK_FAVICON_NEGATIVE_CACHE_TTL_MS,
			limitConcurrency: true
		} : {}
	});
	if (!icon) {
		respondNotFound(res);
		return true;
	}
	res.statusCode = 200;
	res.setHeader("content-type", icon.contentType);
	res.setHeader("content-length", String(icon.body.byteLength));
	res.setHeader("cache-control", "private, max-age=3600");
	res.setHeader("cross-origin-resource-policy", "same-origin");
	res.setHeader("x-content-type-options", "nosniff");
	res.setHeader("content-security-policy", "default-src 'none'; base-uri 'none'; object-src 'none'; frame-ancestors 'none'; sandbox");
	res.setHeader("content-disposition", `attachment; filename="${faviconHostname ? "link-favicon" : "plugin-icon"}"`);
	res.end(method === "HEAD" ? void 0 : icon.body);
	return true;
}
//#endregion
export { LINK_FAVICON_MAX_BYTES, PLUGIN_ICON_CACHE_TTL_MS, PLUGIN_ICON_MAX_BYTES, PLUGIN_ICON_MAX_REDIRECTS, PLUGIN_ICON_REQUEST_TIMEOUT_MS, clearPluginIconCacheForTest, handlePluginIconHttpRequest };
