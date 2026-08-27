import { t as pruneMapToMaxSize } from "./map-size-DAGm21RM.js";
import { d as readImageMetadataFromHeader, s as createImageProcessor } from "./image-ops-CuoBGLvn.js";
import { r as readRemoteMediaBuffer } from "./fetch-Tlt0XWLM.js";
import { i as CONTROL_UI_CATALOG_ICON_PATH_PREFIX, u as CONTROL_UI_PLUGIN_ICON_PATH_PREFIX } from "./control-ui-contract-eurzifU_.js";
import { n as authorizeGatewayHttpRequestOrReply } from "./http-auth-utils-CM89UREd.js";
import { c as sendMethodNotAllowed } from "./http-common-BIedCt0N.js";
import "./http-utils-Cc5uth5g.js";
import { r as respondNotFound } from "./control-ui-http-utils-Bg-q1q5E.js";
import { o as resolveManagedPluginIconUrl, s as resolveManagedSetupCatalogIconUrl } from "./management-service-CMpIxAn3.js";
import { fileTypeFromBuffer } from "file-type";
//#region src/gateway/plugin-icon-http.ts
const PLUGIN_ID_RE = /^(?:[a-z0-9][a-z0-9._-]{0,127}|@[a-z0-9][a-z0-9._-]{0,63}\/[a-z0-9][a-z0-9._-]{0,127})$/iu;
const ALLOWED_IMAGE_MIME_TYPES = /* @__PURE__ */ new Set([
	"image/avif",
	"image/gif",
	"image/jpeg",
	"image/png",
	"image/svg+xml",
	"image/webp"
]);
const SVG_MIME_TYPE = "image/svg+xml";
const PLUGIN_ICON_CACHE_MAX_ENTRIES = 128;
const PLUGIN_ICON_MAX_BYTES = 256 * 1024;
const PLUGIN_ICON_MAX_REDIRECTS = 3;
const PLUGIN_ICON_REQUEST_TIMEOUT_MS = 5e3;
const PLUGIN_ICON_CACHE_TTL_MS = 3600 * 1e3;
let pluginIconCache = /* @__PURE__ */ new Map();
const pluginIconImageProcessor = createImageProcessor();
function normalizeBasePath(basePath) {
	const trimmed = basePath?.trim() ?? "";
	if (!trimmed || trimmed === "/") return "";
	return (trimmed.startsWith("/") ? trimmed : `/${trimmed}`).replace(/\/+$/u, "");
}
function resolvePluginIconRoutePrefix(basePath) {
	return `${normalizeBasePath(basePath)}${CONTROL_UI_PLUGIN_ICON_PATH_PREFIX}/`;
}
function parseIconRequestPath(urlRaw, prefix, isValid = Boolean) {
	if (!urlRaw) return { matched: false };
	const pathname = new URL(urlRaw, "http://localhost").pathname;
	if (!pathname.startsWith(prefix)) return { matched: false };
	const encodedValue = pathname.slice(prefix.length);
	if (!encodedValue || encodedValue.includes("/")) return {
		matched: true,
		value: null
	};
	try {
		const value = decodeURIComponent(encodedValue);
		return {
			matched: true,
			value: isValid(value) ? value : null
		};
	} catch {
		return {
			matched: true,
			value: null
		};
	}
}
function parsePluginIconRequest(urlRaw, basePath) {
	return parseIconRequestPath(urlRaw, resolvePluginIconRoutePrefix(basePath), (value) => PLUGIN_ID_RE.test(value));
}
function parseCatalogIconRequest(urlRaw, basePath) {
	return parseIconRequestPath(urlRaw, `${normalizeBasePath(basePath)}${CONTROL_UI_CATALOG_ICON_PATH_PREFIX}/`);
}
function normalizeMimeType(contentType) {
	return contentType?.split(";", 1)[0]?.trim().toLowerCase() || void 0;
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
	const pending = (async () => {
		try {
			const loaded = await readRemoteMediaBuffer({
				url: parsed.href,
				maxBytes: PLUGIN_ICON_MAX_BYTES,
				maxRedirects: 3,
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
			if (normalized.data.byteLength > 262144) return null;
			return {
				body: normalized.data,
				contentType: "image/png"
			};
		} catch {
			return null;
		}
	})();
	const entry = rememberIcon(pluginIconCache, cacheKey, {
		expiresAt: now + PLUGIN_ICON_CACHE_TTL_MS,
		promise: pending
	});
	const result = await pending;
	if (!result && pluginIconCache.get(cacheKey) === entry) pluginIconCache.delete(cacheKey);
	return result;
}
function clearPluginIconCacheForTest() {
	pluginIconCache = /* @__PURE__ */ new Map();
}
async function handlePluginIconHttpRequest(req, res, opts) {
	const pluginRequest = parsePluginIconRequest(req.url, opts.basePath);
	const catalogRequest = parseCatalogIconRequest(req.url, opts.basePath);
	if (!pluginRequest.matched && !catalogRequest.matched) return false;
	const pluginId = pluginRequest.matched ? pluginRequest.value : null;
	const catalogIconUrl = catalogRequest.matched ? catalogRequest.value : null;
	const method = req.method;
	if (method !== "GET" && method !== "HEAD") {
		sendMethodNotAllowed(res, "GET, HEAD");
		return true;
	}
	if (!await authorizeGatewayHttpRequestOrReply({
		req,
		res,
		auth: opts.auth,
		trustedProxies: opts.trustedProxies,
		allowRealIpFallback: opts.allowRealIpFallback,
		rateLimiter: opts.rateLimiter
	})) return true;
	const iconUrl = pluginId ? await resolveManagedPluginIconUrl({
		config: opts.config,
		pluginId
	}) : catalogIconUrl ? resolveManagedSetupCatalogIconUrl({
		config: opts.config,
		iconUrl: catalogIconUrl
	}) : void 0;
	if (!iconUrl) {
		respondNotFound(res);
		return true;
	}
	const icon = await loadCatalogIcon({
		cacheScope: pluginId ? `plugin:${pluginId}` : "catalog",
		iconUrl
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
	res.setHeader("content-disposition", "attachment; filename=\"plugin-icon\"");
	res.end(method === "HEAD" ? void 0 : icon.body);
	return true;
}
//#endregion
export { PLUGIN_ICON_CACHE_TTL_MS, PLUGIN_ICON_MAX_BYTES, PLUGIN_ICON_MAX_REDIRECTS, PLUGIN_ICON_REQUEST_TIMEOUT_MS, clearPluginIconCacheForTest, handlePluginIconHttpRequest, resolvePluginIconRoutePrefix };
