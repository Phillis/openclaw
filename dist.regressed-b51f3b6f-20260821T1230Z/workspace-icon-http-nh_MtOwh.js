import { r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
import { t as pruneMapToMaxSize } from "./map-size-DAGm21RM.js";
import { n as openRootFileFollowingParents, r as readFileDescriptorBounded } from "./boundary-file-read-BoOq_oud.js";
import { r as normalizeControlUiBasePath } from "./control-ui-shared-BqBD1Err.js";
import { n as authorizeOperatorScopesForMethod } from "./method-scopes-DRTuNy7j.js";
import { p as CONTROL_UI_WORKSPACE_ICON_PATH_PREFIX } from "./control-ui-contract-eurzifU_.js";
import { m as resolveOpenAiCompatibleHttpSenderIsOwner, n as authorizeGatewayHttpRequestOrReply, p as resolveOpenAiCompatibleHttpOperatorScopes } from "./http-auth-utils-CM89UREd.js";
import { c as sendMethodNotAllowed, l as sendMissingScopeForbidden, s as sendJson } from "./http-common-BIedCt0N.js";
import "./http-utils-Cc5uth5g.js";
import { t as matchesHttpIfNoneMatch } from "./http-conditional-BWrY1Un1.js";
import { r as respondNotFound } from "./control-ui-http-utils-Bg-q1q5E.js";
import { createHash } from "node:crypto";
import { close } from "node:fs";
import path from "node:path";
import { promisify } from "node:util";
import { fileTypeFromBuffer } from "file-type";
//#region src/gateway/workspace-icon-http.ts
/**
* Conventional project icon locations in deterministic product precedence.
* Resolution stops at the first valid hit, so this fixed list is the whole
* filesystem cost of opening a workspace and never becomes a recursive scan.
*/
const WORKSPACE_ICON_RELATIVE_PATHS = [
	"favicon.svg",
	"favicon.ico",
	"favicon.png",
	"public/favicon.svg",
	"public/favicon.ico",
	"public/favicon.png",
	"public/favicon-32.png",
	"public/apple-touch-icon.png",
	"static/favicon.svg",
	"static/favicon.ico",
	"static/favicon.png",
	"ui/public/favicon-32.png",
	"ui/public/favicon.svg",
	"ui/public/favicon.ico",
	"ui/public/favicon.png",
	"app/favicon.ico",
	"app/favicon.png",
	"app/icon.svg",
	"app/icon.png",
	"app/icon.ico",
	"src/favicon.ico",
	"src/favicon.svg",
	"src/app/favicon.ico",
	"src/app/icon.svg",
	"src/app/icon.png",
	"assets/icon.svg",
	"assets/icon.png",
	"assets/logo.svg",
	"assets/logo.png"
];
/** Icons are small by construction; anything larger is not a favicon. */
const WORKSPACE_ICON_MAX_BYTES = 512 * 1024;
/** Vector icons are markup the renderer must parse, so they get a tighter cap. */
const SVG_ICON_MAX_BYTES = 64 * 1024;
const WORKSPACE_ICON_CACHE_MAX_ENTRIES = 32;
const SESSION_WORKSPACE_ICON_CACHE_MAX_ENTRIES = 128;
const SVG_MIME_TYPE = "image/svg+xml";
const ICO_MIME_TYPE = "image/x-icon";
const closeFileDescriptor = promisify(close);
/** Sniffable raster types the Control UI can render inside an <img> element. */
const ALLOWED_RASTER_ICON_MIME_TYPES = /* @__PURE__ */ new Set([
	"image/avif",
	"image/gif",
	"image/jpeg",
	"image/png",
	"image/webp",
	ICO_MIME_TYPE
]);
let workspaceIconCache = /* @__PURE__ */ new Map();
let sessionWorkspaceIconCache = /* @__PURE__ */ new Map();
function clearWorkspaceIconCacheForTest() {
	workspaceIconCache = /* @__PURE__ */ new Map();
	sessionWorkspaceIconCache = /* @__PURE__ */ new Map();
}
/**
* Bounds an SVG icon before it can reach a browser. `<img>` runs no script, so
* this is about render cost and outbound references rather than execution: a
* doctype or entity can expand, an external reference can make the renderer
* fetch, and unbounded markup can stall a decode. Favicons are tiny, so a much
* lower cap than the raster limit still accepts every realistic one while
* leaving no room for a decode bomb.
*/
function isRenderableSvg(body) {
	if (body.byteLength > 65536) return false;
	const text = body.toString("utf8");
	return !text.includes("\0") && !/<!doctype|<!entity/iu.test(text) && !/<\s*(?:script|foreignObject|image|use|iframe)\b/iu.test(text) && !/\b(?:href|xlink:href|src)\s*=/iu.test(text) && /^\s*(?:<\?xml[^>]*>\s*)?(?:<!--[\s\S]*?-->\s*)*<svg(?:\s|>)/iu.test(text);
}
async function resolveIconContentType(relativePath, body) {
	if (path.extname(relativePath) === ".svg") return isRenderableSvg(body) ? SVG_MIME_TYPE : void 0;
	const sniffed = (await fileTypeFromBuffer(body))?.mime;
	const normalized = sniffed === "image/vnd.microsoft.icon" ? ICO_MIME_TYPE : sniffed;
	return normalized && ALLOWED_RASTER_ICON_MIME_TYPES.has(normalized) ? normalized : void 0;
}
async function readWorkspaceIconCandidate(workspaceRoot, relativePath) {
	const opened = await openRootFileFollowingParents({
		absolutePath: path.join(workspaceRoot, relativePath),
		rootPath: workspaceRoot,
		boundaryLabel: "workspace root",
		maxBytes: WORKSPACE_ICON_MAX_BYTES
	});
	if (!opened.ok) return;
	let body;
	try {
		body = await readFileDescriptorBounded(opened.fd, WORKSPACE_ICON_MAX_BYTES);
	} catch {
		return;
	} finally {
		await closeFileDescriptor(opened.fd);
	}
	if (body.byteLength === 0) return;
	const contentType = await resolveIconContentType(relativePath, body);
	if (!contentType) return;
	return {
		body,
		contentType,
		etag: `"${createHash("sha256").update(body).digest("base64url")}"`
	};
}
async function scanWorkspaceIcon(workspaceRoot) {
	for (const relativePath of WORKSPACE_ICON_RELATIVE_PATHS) {
		const icon = await readWorkspaceIconCandidate(workspaceRoot, relativePath);
		if (icon) return icon;
	}
	return null;
}
/**
* Resolves a workspace icon once per Gateway process. Project icons are
* process-stable metadata like plugin manifests: a changed icon is picked up on
* the next Gateway start, never by re-scanning the workspace on a hot path.
*/
function resolveWorkspaceIcon(workspaceRoot) {
	const cacheKey = path.resolve(workspaceRoot);
	const cached = workspaceIconCache.get(cacheKey);
	if (cached) {
		workspaceIconCache.delete(cacheKey);
		workspaceIconCache.set(cacheKey, cached);
		return cached;
	}
	const pending = scanWorkspaceIcon(cacheKey);
	workspaceIconCache.set(cacheKey, pending);
	pruneMapToMaxSize(workspaceIconCache, WORKSPACE_ICON_CACHE_MAX_ENTRIES);
	return pending;
}
const getSessionsFilesModule = createLazyRuntimeModule(() => import("./sessions-files-CG76OPFD.js"));
/**
* Prepares the immutable icon snapshot while opening a chat. The HTTP asset
* request only reads this map: no session-store or filesystem work is allowed
* on that hot path, and icon changes become visible after Gateway restart.
*/
async function prepareSessionWorkspaceIcon(params) {
	const preparation = (async () => {
		const workspaceRoot = (await getSessionsFilesModule()).resolveLocalSessionWorkspaceRoot(params);
		return workspaceRoot ? await resolveWorkspaceIcon(workspaceRoot) : null;
	})();
	sessionWorkspaceIconCache.delete(params.sessionKey);
	sessionWorkspaceIconCache.set(params.sessionKey, preparation.catch(() => null));
	pruneMapToMaxSize(sessionWorkspaceIconCache, SESSION_WORKSPACE_ICON_CACHE_MAX_ENTRIES);
	await preparation;
}
function readPreparedSessionWorkspaceIcon(sessionKey) {
	const prepared = sessionWorkspaceIconCache.get(sessionKey);
	if (prepared) {
		sessionWorkspaceIconCache.delete(sessionKey);
		sessionWorkspaceIconCache.set(sessionKey, prepared);
	}
	return prepared;
}
function parseWorkspaceIconRequest(urlRaw, basePath) {
	if (!urlRaw) return { matched: false };
	const pathname = new URL(urlRaw, "http://localhost").pathname;
	const prefix = `${normalizeControlUiBasePath(basePath)}${CONTROL_UI_WORKSPACE_ICON_PATH_PREFIX}/`;
	if (!pathname.startsWith(prefix)) return { matched: false };
	const encoded = pathname.slice(prefix.length);
	if (!encoded || encoded.includes("/")) return {
		matched: true,
		sessionKey: null
	};
	try {
		return {
			matched: true,
			sessionKey: decodeURIComponent(encoded) || null
		};
	} catch {
		return {
			matched: true,
			sessionKey: null
		};
	}
}
/**
* Serves the icon snapshot prepared when the chat opened. The request names a
* session, never a path, and performs no filesystem or session-store work.
*/
async function handleWorkspaceIconHttpRequest(req, res, opts) {
	const parsed = parseWorkspaceIconRequest(req.url, opts.basePath);
	if (!parsed.matched) return false;
	const method = req.method;
	if (method !== "GET" && method !== "HEAD") {
		sendMethodNotAllowed(res, "GET, HEAD");
		return true;
	}
	const requestAuth = await authorizeGatewayHttpRequestOrReply({
		req,
		res,
		auth: opts.auth,
		trustedProxies: opts.trustedProxies,
		allowRealIpFallback: opts.allowRealIpFallback,
		rateLimiter: opts.rateLimiter
	});
	if (!requestAuth) return true;
	const scopeAuth = authorizeOperatorScopesForMethod("sessions.list", resolveOpenAiCompatibleHttpOperatorScopes(req, requestAuth));
	if (!scopeAuth.allowed) {
		sendMissingScopeForbidden(res, scopeAuth.missingScope);
		return true;
	}
	if (!resolveOpenAiCompatibleHttpSenderIsOwner(req, requestAuth)) {
		sendJson(res, 403, {
			ok: false,
			error: {
				message: "owner access required",
				type: "forbidden"
			}
		});
		return true;
	}
	if (!parsed.sessionKey) {
		res.setHeader("cache-control", "no-store");
		respondNotFound(res);
		return true;
	}
	const prepared = readPreparedSessionWorkspaceIcon(parsed.sessionKey);
	if (!prepared) {
		res.statusCode = 503;
		res.setHeader("cache-control", "no-store");
		res.setHeader("retry-after", "1");
		res.end("workspace icon snapshot is not ready");
		return true;
	}
	const icon = await prepared;
	if (!icon) {
		res.setHeader("cache-control", "no-store");
		respondNotFound(res);
		return true;
	}
	res.setHeader("etag", icon.etag);
	res.setHeader("cache-control", "private, max-age=3600");
	res.setHeader("cross-origin-resource-policy", "same-origin");
	res.setHeader("x-content-type-options", "nosniff");
	res.setHeader("content-security-policy", "default-src 'none'; base-uri 'none'; object-src 'none'; frame-ancestors 'none'; sandbox");
	res.setHeader("content-disposition", "attachment; filename=\"workspace-icon\"");
	if (matchesHttpIfNoneMatch(req.headers["if-none-match"], icon.etag)) {
		res.statusCode = 304;
		res.end();
		return true;
	}
	res.statusCode = 200;
	res.setHeader("content-type", icon.contentType);
	res.setHeader("content-length", String(icon.body.byteLength));
	res.end(method === "HEAD" ? void 0 : icon.body);
	return true;
}
//#endregion
export { prepareSessionWorkspaceIcon as a, handleWorkspaceIconHttpRequest as i, WORKSPACE_ICON_MAX_BYTES as n, resolveWorkspaceIcon as o, clearWorkspaceIconCacheForTest as r, SVG_ICON_MAX_BYTES as t };
