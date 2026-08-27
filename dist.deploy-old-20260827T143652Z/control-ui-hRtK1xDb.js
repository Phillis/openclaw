import { i as getOrCreatePromise } from "./lazy-promise-DGqyc4Y4.js";
import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { I as resolveTimestampMsToIsoString, o as asDateTimestampMs } from "./number-coercion-oCkfUEEq.js";
import { t as pruneMapToMaxSize } from "./map-size-DAGm21RM.js";
import { t as FsSafeError } from "./errors-CQDiIdj7.js";
import { d as safeFileURLToPath } from "./read-open-flags-DGgM-BoE.js";
import { l as isWithinDir } from "./path-D138yf8v.js";
import "./fs-safe-C9N8pCh1.js";
import { n as openLocalFileSafely } from "./root-impl-YIsYOvqy.js";
import { i as openRootFileSync, n as matchRootFileOpenFailure } from "./root-file-Chr9dJBe.js";
import { c as resolveUserPath } from "./home-dir-DcrXWQPU.js";
import "./utils-DEqefz4f.js";
import { r as readFileDescriptorBounded } from "./boundary-file-read-BoOq_oud.js";
import "./path-safety-C2hsuc07.js";
import { t as resolveOpenClawPackageRoot } from "./openclaw-root-DSkQ6e_8.js";
import { c as resolveRuntimeServiceBuildId, l as resolveRuntimeServiceVersion } from "./version-o4XN9fka.js";
import { t as readFileWindowFully } from "./file-read-DtMn74uz.js";
import { c as resolveAvatarMime, l as AVATAR_MAX_BYTES } from "./avatar-policy-h0-yTt3d.js";
import { r as runCommandWithTimeout } from "./exec-BL80Wdzl.js";
import { t as safeEqualSecret } from "./secret-equal-DRsL8lKD.js";
import { b as resolveRequestClientIp } from "./net-BRYQcUG8.js";
import { c as AUTH_RATE_LIMIT_SCOPE_SHARED_SECRET, i as AUTH_RATE_LIMIT_SCOPE_DEVICE_TOKEN } from "./auth-rate-limit-Bw_B6Pm2.js";
import { n as authorizeHttpGatewayConnect } from "./auth-CCT61CRz.js";
import { n as buildControlUiAvatarUrl, r as normalizeControlUiBasePath, t as CONTROL_UI_AVATAR_PREFIX } from "./control-ui-shared-BqBD1Err.js";
import { n as authorizeOperatorScopesForMethod } from "./method-scopes-DRTuNy7j.js";
import { l as kindFromMime, n as detectMime } from "./mime-Hm4eS2i0.js";
import "./local-file-access-C2hsuc07.js";
import { n as probePlaybackMediaFileDescriptor } from "./media-services-BMidrwE0.js";
import { o as extractOriginalFilename } from "./store-CNsqBmYb.js";
import { c as resolveMediaReferenceLocalPathInfo, s as resolveMediaReferenceLocalPath } from "./media-reference-BeABx1cr.js";
import { n as getAgentScopedMediaLocalRoots } from "./local-roots-Beya70q2.js";
import { n as assertLocalMediaAllowed, r as getDefaultLocalRootsCore } from "./local-media-access-x5uqWCfl.js";
import { t as isTerminalConfigEnabled } from "./enabled-BSjeiWpO.js";
import { n as resolvePublicAgentAvatarSource } from "./identity-avatar-BVkVT7Ex.js";
import { g as verifyPairingToken } from "./device-bootstrap-ftwhmc0m.js";
import { D as verifyDeviceToken, d as listDevicePairing } from "./device-pairing-CkbDK__R.js";
import { f as CONTROL_UI_TERMINAL_ENABLED_ATTRIBUTE, n as CONTROL_UI_BOOTSTRAP_CONFIG_PATH, t as CONTROL_UI_BASE_PATH_ATTRIBUTE } from "./control-ui-contract-eurzifU_.js";
import { _ as setControlUiPluginAuthCookieForRequest, c as getBearerToken, d as resolveHttpBrowserOriginPolicy, g as resolveTrustedHttpOperatorScopes } from "./http-auth-utils-CM89UREd.js";
import { a as sendGatewayAuthFailure, n as buildMissingScopeForbiddenBody } from "./http-common-BIedCt0N.js";
import { t as resolveSharedGatewaySessionGeneration } from "./ws-shared-generation-BWx0sDdz.js";
import "./http-utils-BDzE3kVj.js";
import { a as replacePlaybackFileExtension, i as buildAssistantMediaContentDisposition, n as resolveByteResponse, o as resolvePlaybackModeForSource, r as writeByteHeaders, s as resolvePlaybackTranscode, t as createGatewayByteStream } from "./http-byte-range-BoqVPTde.js";
import { i as respondPlainText, n as isReadHttpMethod, r as respondNotFound } from "./control-ui-http-utils-Bg-q1q5E.js";
import { n as resolveAssistantIdentity, t as DEFAULT_ASSISTANT_IDENTITY } from "./assistant-identity-CRph4W92.js";
import { n as resolveGatewayAssistantAvatar, t as openGatewayAssistantAvatar } from "./assistant-avatar-D13pjEJ1.js";
import { n as isControlUiApprovalDocumentPath, t as classifyControlUiRequest } from "./control-ui-routing-p8rCHdZ_.js";
import { createHash, createHmac, randomBytes } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { brotliCompress, constants as constants$1, gzip } from "node:zlib";
//#region src/infra/dev-install-branch.ts
const GIT_TIMEOUT_MS = 3e3;
const HIDDEN_BRANCHES = /* @__PURE__ */ new Set([
	"main",
	"master",
	"HEAD"
]);
async function detectDevInstallGitBranch(params) {
	const run = params.runCommand ?? runCommandWithTimeout;
	const root = params.root ? path.resolve(params.root) : null;
	if (!root) return null;
	const topRes = await run([
		"git",
		"-C",
		root,
		"rev-parse",
		"--show-toplevel"
	], { timeoutMs: GIT_TIMEOUT_MS }).catch(() => null);
	if (!topRes || topRes.code !== 0) return null;
	const rootReal = await fs$1.realpath(root).catch(() => root);
	const top = topRes.stdout.trim();
	if (!top || path.resolve(top) !== path.resolve(rootReal)) return null;
	const branchRes = await run([
		"git",
		"-C",
		root,
		"rev-parse",
		"--abbrev-ref",
		"HEAD"
	], { timeoutMs: GIT_TIMEOUT_MS }).catch(() => null);
	if (!branchRes || branchRes.code !== 0) return null;
	const branch = branchRes.stdout.trim();
	return branch && !HIDDEN_BRANCHES.has(branch) ? branch : null;
}
let cached = null;
function resolveDevInstallGitBranch() {
	cached ??= resolveOpenClawPackageRoot({
		argv1: process.argv[1],
		cwd: process.cwd(),
		moduleUrl: import.meta.url
	}).then((root) => detectDevInstallGitBranch({ root })).catch(() => null);
	return cached;
}
//#endregion
//#region src/gateway/control-ui-csp.ts
const SCRIPT_ATTRIBUTE_NAME_RE = /\s([^\s=/>]+)(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?/g;
/**
* Compute SHA-256 CSP hashes for inline `<script>` blocks in an HTML string.
* Only scripts without a `src` attribute are considered inline.
*/
function computeInlineScriptHashes(html) {
	const hashes = [];
	const re = /<script(?:\s[^>]*)?>([^]*?)<\/script>/gi;
	let match;
	while ((match = re.exec(html)) !== null) {
		if (hasScriptSrcAttribute(match[0].slice(0, match[0].indexOf(">") + 1))) continue;
		const content = match[1];
		if (!content) continue;
		const hash = createHash("sha256").update(content, "utf8").digest("base64");
		hashes.push(`sha256-${hash}`);
	}
	return hashes;
}
function hasScriptSrcAttribute(openTag) {
	return Array.from(openTag.matchAll(SCRIPT_ATTRIBUTE_NAME_RE)).some((match) => normalizeLowercaseStringOrEmpty(match[1]) === "src");
}
/** Build the CSP header applied to Gateway-served Control UI HTML. */
function buildControlUiCspHeader(opts) {
	const hashes = opts?.inlineScriptHashes;
	const scriptTokens = ["'self'"];
	if (hashes?.length) scriptTokens.push(...hashes.map((h) => `'${h}'`));
	if (opts?.allowWasm) scriptTokens.push("'wasm-unsafe-eval'");
	const connectTokens = [
		"'self'",
		"ws:",
		"wss:",
		"data:",
		"https://api.openai.com",
		"https://tweakcn.com"
	];
	if (opts?.portalHost) try {
		const parsed = new URL(`http://${opts.portalHost}`);
		if (!parsed.username && !parsed.password && parsed.pathname === "/" && !parsed.search && !parsed.hash && parsed.hostname) connectTokens.push(`http://${parsed.hostname}:*`, `https://${parsed.hostname}:*`);
	} catch {}
	return [
		"default-src 'self'",
		"base-uri 'none'",
		"object-src 'none'",
		"frame-ancestors 'none'",
		"frame-src 'self' http: https:",
		`script-src ${scriptTokens.join(" ")}`,
		"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
		"img-src 'self' data: blob: https://gravatar.com",
		"media-src 'self' data: blob:",
		"font-src 'self' https://fonts.gstatic.com",
		"worker-src 'self'",
		`connect-src ${connectTokens.join(" ")}`
	].join("; ");
}
//#endregion
//#region src/gateway/control-ui-static.ts
const CONTROL_UI_IMMUTABLE_CACHE_CONTROL = "public, max-age=31536000, immutable";
const CONTROL_UI_HTML_COMPRESSION_CACHE_MAX_ENTRIES = 4;
const CONTROL_UI_COMPRESSIBLE_EXTENSIONS = /* @__PURE__ */ new Set([
	".css",
	".html",
	".js",
	".json",
	".svg",
	".txt",
	".wasm",
	".webmanifest"
]);
const CONTROL_UI_PRECOMPRESSED_ASSET_EXTENSIONS = /* @__PURE__ */ new Set([".br", ".gz"]);
/**
* Missing files with these extensions return 404 instead of the SPA index.
* `.html` stays excluded because client-side routes may use that suffix.
*/
const CONTROL_UI_STATIC_ASSET_EXTENSIONS = /* @__PURE__ */ new Set([
	".js",
	".css",
	".json",
	".map",
	".svg",
	".png",
	".jpg",
	".jpeg",
	".gif",
	".webp",
	".ico",
	".txt",
	".wasm",
	".webmanifest"
]);
function isControlUiStaticAssetExtension(extension) {
	return CONTROL_UI_STATIC_ASSET_EXTENSIONS.has(extension);
}
function isControlUiCompressibleExtension(extension) {
	return CONTROL_UI_COMPRESSIBLE_EXTENSIONS.has(extension);
}
function isControlUiPrecompressedAssetExtension(extension) {
	return CONTROL_UI_PRECOMPRESSED_ASSET_EXTENSIONS.has(extension);
}
const CONTROL_UI_DYNAMIC_ENCODINGS = /* @__PURE__ */ new Set(["br", "gzip"]);
const CONTROL_UI_QVALUE_PATTERN = /^(?:0(?:\.\d{0,3})?|1(?:\.0{0,3})?)$/;
const controlUiHtmlCompressionCache = /* @__PURE__ */ new Map();
function contentTypeForExtension(ext) {
	switch (ext) {
		case ".html": return "text/html; charset=utf-8";
		case ".js": return "application/javascript; charset=utf-8";
		case ".css": return "text/css; charset=utf-8";
		case ".json":
		case ".map": return "application/json; charset=utf-8";
		case ".svg": return "image/svg+xml";
		case ".png": return "image/png";
		case ".jpg":
		case ".jpeg": return "image/jpeg";
		case ".gif": return "image/gif";
		case ".webp": return "image/webp";
		case ".ico": return "image/x-icon";
		case ".txt": return "text/plain; charset=utf-8";
		case ".wasm": return "application/wasm";
		case ".webmanifest": return "application/manifest+json; charset=utf-8";
		default: return "application/octet-stream";
	}
}
function normalizedAcceptEncoding(req) {
	const value = req.headers?.["accept-encoding"];
	return Array.isArray(value) ? value.join(",") : value ?? "";
}
function resolveControlUiContentEncoding(req, availableEncodings) {
	const qualities = /* @__PURE__ */ new Map();
	for (const entry of normalizedAcceptEncoding(req).split(",")) {
		const [rawName, ...rawParams] = entry.split(";");
		const name = rawName?.trim().toLowerCase();
		if (!name) continue;
		const qualityText = rawParams.find((param) => param.trim().toLowerCase().startsWith("q="))?.trim().slice(2);
		const parsedQuality = qualityText === void 0 ? 1 : CONTROL_UI_QVALUE_PATTERN.test(qualityText) ? Number(qualityText) : NaN;
		const quality = Number.isFinite(parsedQuality) && parsedQuality >= 0 && parsedQuality <= 1 ? parsedQuality : 0;
		qualities.set(name, Math.max(qualities.get(name) ?? 0, quality));
	}
	if (!(normalizedAcceptEncoding(req).trim().length > 0)) return "identity";
	const wildcardQuality = qualities.get("*");
	const qualityFor = (name) => qualities.has(name) ? qualities.get(name) ?? 0 : wildcardQuality ?? 0;
	const candidates = [{
		encoding: "identity",
		quality: qualities.has("identity") ? qualities.get("identity") ?? 0 : wildcardQuality === 0 ? 0 : 1,
		rank: 0
	}];
	if (availableEncodings.has("gzip")) candidates.push({
		encoding: "gzip",
		quality: qualityFor("gzip"),
		rank: 1
	});
	if (availableEncodings.has("br")) candidates.push({
		encoding: "br",
		quality: qualityFor("br"),
		rank: 2
	});
	return candidates.filter((candidate) => candidate.quality > 0).toSorted((left, right) => right.quality - left.quality || right.rank - left.rank)[0]?.encoding ?? "not-acceptable";
}
function resolveControlUiHtmlEncoding(req) {
	return resolveControlUiContentEncoding(req, CONTROL_UI_DYNAMIC_ENCODINGS);
}
function resolveOpenedControlUiRepresentation(params) {
	const { req, sourceFile, precompressed, openPrecompressedFile } = params;
	const extension = path.extname(sourceFile.path).toLowerCase();
	const availableEncodings = precompressed && isControlUiCompressibleExtension(extension) ? new Set(CONTROL_UI_DYNAMIC_ENCODINGS) : /* @__PURE__ */ new Set();
	for (;;) {
		const selected = resolveControlUiContentEncoding(req, availableEncodings);
		if (selected === "not-acceptable") {
			fs.closeSync(sourceFile.fd);
			return null;
		}
		if (selected === "identity") return {
			bodyFile: sourceFile,
			contentPath: sourceFile.path
		};
		const suffix = selected === "br" ? ".br" : ".gz";
		let compressedFile;
		try {
			compressedFile = openPrecompressedFile(`${sourceFile.path}${suffix}`);
		} catch (error) {
			fs.closeSync(sourceFile.fd);
			throw error;
		}
		if (compressedFile) {
			fs.closeSync(sourceFile.fd);
			return {
				bodyFile: compressedFile,
				contentPath: sourceFile.path,
				encoding: selected
			};
		}
		availableEncodings.delete(selected);
	}
}
function setControlUiEncodingHeaders(res, extension, encoding) {
	res.setHeader("Vary", "Accept-Encoding");
	if (!CONTROL_UI_COMPRESSIBLE_EXTENSIONS.has(extension)) return;
	if (encoding !== "identity") res.setHeader("Content-Encoding", encoding);
}
function setControlUiFileHeaders(res, filePath, options) {
	const extension = path.extname(filePath).toLowerCase();
	res.setHeader("Content-Type", contentTypeForExtension(extension));
	res.setHeader("Cache-Control", options?.immutable ? CONTROL_UI_IMMUTABLE_CACHE_CONTROL : "no-cache");
	setControlUiEncodingHeaders(res, extension, options?.encoding ?? "identity");
}
function respondHeadForControlUiFile(res, filePath, options) {
	res.statusCode = 200;
	setControlUiFileHeaders(res, filePath, options);
	if (options?.contentLength !== void 0) res.setHeader("Content-Length", String(options.contentLength));
	res.end();
}
function compressControlUiBody(body, encoding) {
	return new Promise((resolve, reject) => {
		const callback = (error, compressed) => {
			if (error) {
				reject(error);
				return;
			}
			resolve(compressed);
		};
		if (encoding === "br") {
			brotliCompress(body, { params: { [constants$1.BROTLI_PARAM_QUALITY]: 4 } }, callback);
			return;
		}
		gzip(body, { level: 6 }, callback);
	});
}
async function serveControlUiAsset(res, filePath, body, options) {
	setControlUiFileHeaders(res, filePath, options);
	res.end(body);
}
function cachedCompressedControlUiHtml(body, encoding) {
	const key = `${encoding}\0${body}`;
	const cached = controlUiHtmlCompressionCache.get(key);
	if (cached) {
		controlUiHtmlCompressionCache.delete(key);
		controlUiHtmlCompressionCache.set(key, cached);
		return cached;
	}
	const compression = getOrCreatePromise(controlUiHtmlCompressionCache, key, () => compressControlUiBody(Buffer.from(body), encoding), { cacheRejections: false });
	pruneMapToMaxSize(controlUiHtmlCompressionCache, CONTROL_UI_HTML_COMPRESSION_CACHE_MAX_ENTRIES);
	return compression;
}
function respondControlUiNotAcceptable(res) {
	res.setHeader("Cache-Control", "no-store");
	res.setHeader("Vary", "Accept-Encoding");
	respondPlainText(res, 406, "Not Acceptable");
}
async function sendControlUiHtmlBody(req, res, body) {
	const encoding = resolveControlUiHtmlEncoding(req);
	if (encoding === "not-acceptable") {
		respondControlUiNotAcceptable(res);
		return;
	}
	setControlUiEncodingHeaders(res, ".html", encoding);
	res.end(encoding === "identity" ? body : await cachedCompressedControlUiHtml(body, encoding));
}
function readOpenedFile(fd) {
	return new Promise((resolve, reject) => {
		fs.readFile(fd, (error, data) => {
			if (error) {
				reject(error);
				return;
			}
			resolve(data);
		});
	});
}
async function readAndCloseControlUiFile(fd) {
	try {
		return await readOpenedFile(fd);
	} finally {
		fs.closeSync(fd);
	}
}
async function readAndCloseControlUiFileText(fd) {
	return (await readAndCloseControlUiFile(fd)).toString("utf8");
}
//#endregion
//#region src/gateway/control-ui.ts
const ROOT_PREFIX = "/";
const CONTROL_UI_ASSISTANT_MEDIA_PREFIX = "/__openclaw__/assistant-media";
const CONTROL_UI_ASSISTANT_MEDIA_TICKET_SCOPE = "assistant-media";
const CONTROL_UI_ASSISTANT_MEDIA_TICKET_TTL_MS = 300 * 1e3;
const CONTROL_UI_ASSETS_MISSING_MESSAGE = "Control UI assets not found. Build them with `pnpm ui:build` (auto-installs UI deps), or run `pnpm ui:dev` during development.";
const CONTROL_UI_OPERATOR_READ_SCOPE = "operator.read";
const CONTROL_UI_OPERATOR_ROLE = "operator";
const controlUiAssistantMediaTicketSecret = randomBytes(32);
const CONTROL_UI_NAMESPACE_PREFIX = "/__openclaw__/";
const CONTROL_UI_ROOT_PUBLIC_ASSETS = /* @__PURE__ */ new Set([
	"apple-touch-icon.png",
	"favicon-32.png",
	"favicon.ico",
	"favicon.svg",
	"manifest.webmanifest",
	"sw.js"
]);
/** Anchors bundled public assets before deep-linked documents begin preloading. */
function rewriteControlUiIndexHtmlPublicAssetHrefs(html, basePath) {
	const normalized = normalizeControlUiBasePath(basePath);
	let next = html;
	for (const asset of CONTROL_UI_ROOT_PUBLIC_ASSETS) {
		const assetHref = `href="${normalized}/${asset}"`;
		next = next.replaceAll(`href="./${asset}"`, assetHref);
		if (normalized) next = next.replaceAll(`href="/${asset}"`, assetHref);
	}
	return next;
}
function escapeHtmlAttribute(value) {
	return value.replaceAll("&", "&amp;").replaceAll("\"", "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("'", "&#39;");
}
function controlUiAvatarResolutionMeta(resolved) {
	if (!resolved) return {
		avatarSource: null,
		avatarStatus: null,
		avatarReason: null
	};
	return {
		avatarSource: resolvePublicAgentAvatarSource(resolved) ?? null,
		avatarStatus: resolved.kind,
		avatarReason: resolved.kind === "none" ? resolved.reason : null
	};
}
function applyControlUiSecurityHeaders(res) {
	res.setHeader("X-Frame-Options", "DENY");
	res.setHeader("Content-Security-Policy", buildControlUiCspHeader());
	res.setHeader("X-Content-Type-Options", "nosniff");
	res.setHeader("Referrer-Policy", "no-referrer");
	res.setHeader("Permissions-Policy", "camera=(self), microphone=*, geolocation=*, clipboard-write=*");
}
function sendJson(res, status, body) {
	res.statusCode = status;
	res.setHeader("Content-Type", "application/json; charset=utf-8");
	res.setHeader("Cache-Control", "no-cache");
	res.end(JSON.stringify(body));
}
function respondControlUiAssetsUnavailable(res, options) {
	const message = options?.preparing ? "Control UI assets are being prepared. Try again shortly." : options?.failed ? "Control UI assets could not be prepared. Check the Gateway logs or run `openclaw doctor --fix`." : options?.configuredRootPath ? `Control UI assets not found at ${options.configuredRootPath}. Build them with \`pnpm ui:build\` (auto-installs UI deps), or update gateway.controlUi.root.` : CONTROL_UI_ASSETS_MISSING_MESSAGE;
	if (options?.preparing) {
		res.setHeader("Cache-Control", "no-store");
		res.setHeader("Retry-After", "1");
	}
	respondPlainText(res, 503, message);
}
function isValidAgentPathSegment(agentId) {
	return /^[a-z0-9][a-z0-9_-]{0,63}$/i.test(agentId);
}
function normalizeAssistantMediaSource(source) {
	const trimmed = source.trim();
	if (!trimmed) return null;
	if (trimmed.startsWith("file://")) try {
		return safeFileURLToPath(trimmed);
	} catch {
		return null;
	}
	if (trimmed.startsWith("~")) return resolveUserPath(trimmed);
	return trimmed;
}
function resolveAssistantMediaRoutePath(basePath) {
	return `${basePath && basePath !== "/" ? basePath.endsWith("/") ? basePath.slice(0, -1) : basePath : ""}${CONTROL_UI_ASSISTANT_MEDIA_PREFIX}`;
}
function resolveAssistantMediaAuthToken(req) {
	const bearer = getBearerToken(req);
	if (bearer) return bearer;
	const urlRaw = req.url;
	if (!urlRaw) return;
	try {
		return new URL(urlRaw, "http://localhost").searchParams.get("token")?.trim() || void 0;
	} catch {
		return;
	}
}
function resolveControlUiReadAuthToken(req, opts) {
	const bearer = getBearerToken(req);
	if (bearer) return bearer;
	if (!opts?.allowQueryToken) return;
	return resolveAssistantMediaAuthToken(req);
}
async function authorizeControlUiReadRequest(req, res, opts) {
	if (!opts?.auth) {
		opts?.onPluginFrameGrants?.([]);
		return true;
	}
	const token = resolveControlUiReadAuthToken(req, { allowQueryToken: opts.allowQueryToken });
	const clientIp = resolveRequestClientIp(req, opts.trustedProxies, opts.allowRealIpFallback === true) ?? req.socket?.remoteAddress;
	const supportsDeviceTokenFallback = Boolean(token) && opts.auth.mode !== "trusted-proxy" && opts.auth.mode !== "none";
	const sharedSecretRateCheck = supportsDeviceTokenFallback ? opts.rateLimiter?.check(clientIp, AUTH_RATE_LIMIT_SCOPE_SHARED_SECRET) : void 0;
	const authResult = sharedSecretRateCheck && !sharedSecretRateCheck.allowed ? {
		ok: false,
		reason: "rate_limited",
		rateLimited: true,
		retryAfterMs: sharedSecretRateCheck.retryAfterMs
	} : await authorizeHttpGatewayConnect({
		auth: opts.auth,
		connectAuth: token ? {
			token,
			password: token
		} : null,
		req,
		browserOriginPolicy: resolveHttpBrowserOriginPolicy(req),
		trustedProxies: opts.trustedProxies,
		allowRealIpFallback: opts.allowRealIpFallback,
		rateLimiter: supportsDeviceTokenFallback ? void 0 : token ? opts.rateLimiter : void 0,
		clientIp,
		rateLimitScope: AUTH_RATE_LIMIT_SCOPE_SHARED_SECRET
	});
	const sharedSecretMismatch = authResult.reason === "token_mismatch" || authResult.reason === "password_mismatch";
	if (authResult.ok && supportsDeviceTokenFallback && (authResult.method === "token" || authResult.method === "password")) opts.rateLimiter?.reset(clientIp, AUTH_RATE_LIMIT_SCOPE_SHARED_SECRET);
	const sharedAuthGeneration = resolveSharedGatewaySessionGeneration(opts.auth, opts.trustedProxies);
	let resolvedAuthResult = authResult;
	let verifiedDeviceScopes;
	let deviceTokenValidationFailed = false;
	if (!resolvedAuthResult.ok && token && supportsDeviceTokenFallback) {
		const deviceRateCheck = opts.rateLimiter?.check(clientIp, AUTH_RATE_LIMIT_SCOPE_DEVICE_TOKEN);
		if (deviceRateCheck && !deviceRateCheck.allowed) resolvedAuthResult = {
			ok: false,
			reason: "rate_limited",
			rateLimited: true,
			retryAfterMs: deviceRateCheck.retryAfterMs
		};
		else {
			const deviceScopes = await authorizeControlUiDeviceReadToken(token, sharedAuthGeneration) ? await resolveControlUiDeviceReadTokenScopes(token) : null;
			if (deviceScopes) {
				verifiedDeviceScopes = deviceScopes;
				opts.rateLimiter?.reset(clientIp, AUTH_RATE_LIMIT_SCOPE_DEVICE_TOKEN);
				opts.rateLimiter?.reset(clientIp, AUTH_RATE_LIMIT_SCOPE_SHARED_SECRET);
				resolvedAuthResult = {
					ok: true,
					method: "device-token"
				};
			} else deviceTokenValidationFailed = true;
		}
	}
	if (!resolvedAuthResult.ok) {
		if (supportsDeviceTokenFallback && sharedSecretMismatch) await opts.rateLimiter?.recordFailureAndDelay(clientIp, AUTH_RATE_LIMIT_SCOPE_SHARED_SECRET);
		if (deviceTokenValidationFailed) await opts.rateLimiter?.recordFailureAndDelay(clientIp, AUTH_RATE_LIMIT_SCOPE_DEVICE_TOKEN);
		sendGatewayAuthFailure(res, resolvedAuthResult);
		return false;
	}
	const authMethod = resolvedAuthResult.method;
	const trustDeclaredOperatorScopes = authMethod === "trusted-proxy" || authMethod === "tailscale";
	if (opts.onPluginFrameGrants) opts.onPluginFrameGrants(setControlUiPluginAuthCookieForRequest(req, res, authMethod, trustDeclaredOperatorScopes, sharedAuthGeneration, verifiedDeviceScopes));
	if (!trustDeclaredOperatorScopes) return true;
	const requestedScopes = resolveTrustedHttpOperatorScopes(req, { trustDeclaredOperatorScopes });
	const scopeAuth = authorizeOperatorScopesForMethod(opts.requiredOperatorMethod ?? "assistant.media.get", requestedScopes);
	if (!scopeAuth.allowed) {
		sendJson(res, 403, buildMissingScopeForbiddenBody(scopeAuth.missingScope));
		return false;
	}
	return true;
}
async function authorizeControlUiDeviceReadToken(token, requiredSharedGatewaySessionGeneration) {
	const pairing = await listDevicePairing();
	for (const device of pairing.paired) {
		const operatorToken = device.tokens?.[CONTROL_UI_OPERATOR_ROLE];
		if (!operatorToken || operatorToken.revokedAtMs) continue;
		if (!verifyPairingToken(token, operatorToken.token)) continue;
		if ((await verifyDeviceToken({
			deviceId: device.deviceId,
			token,
			role: CONTROL_UI_OPERATOR_ROLE,
			scopes: [CONTROL_UI_OPERATOR_READ_SCOPE],
			requiredSharedGatewaySessionGeneration
		})).ok) return true;
	}
	return false;
}
async function resolveControlUiDeviceReadTokenScopes(token) {
	const pairing = await listDevicePairing();
	for (const device of pairing.paired) {
		const operatorBearer = device.tokens?.[CONTROL_UI_OPERATOR_ROLE];
		if (operatorBearer && !operatorBearer.revokedAtMs && verifyPairingToken(token, operatorBearer.token)) return operatorBearer.scopes;
	}
	return null;
}
function signAssistantMediaTicketPayload(encodedPayload) {
	return createHmac("sha256", controlUiAssistantMediaTicketSecret).update(encodedPayload).digest("base64url");
}
function createAssistantMediaTicket(source, nowMs = Date.now()) {
	const now = asDateTimestampMs(nowMs);
	if (now === void 0) return {};
	const exp = asDateTimestampMs(now + CONTROL_UI_ASSISTANT_MEDIA_TICKET_TTL_MS);
	if (exp === void 0) return {};
	const payload = {
		scope: CONTROL_UI_ASSISTANT_MEDIA_TICKET_SCOPE,
		source,
		exp
	};
	const encodedPayload = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
	return {
		mediaTicket: `v1.${encodedPayload}.${signAssistantMediaTicketPayload(encodedPayload)}`,
		mediaTicketExpiresAt: resolveTimestampMsToIsoString(exp)
	};
}
function verifyAssistantMediaTicket(ticket, source, nowMs = Date.now()) {
	const now = asDateTimestampMs(nowMs);
	if (now === void 0) return false;
	const parts = ticket?.split(".");
	if (!parts || parts.length !== 3 || parts[0] !== "v1") return false;
	const [, encodedPayload, sig] = parts;
	if (!encodedPayload || !sig) return false;
	if (!safeEqualSecret(sig, signAssistantMediaTicketPayload(encodedPayload))) return false;
	try {
		const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8"));
		return payload.scope === CONTROL_UI_ASSISTANT_MEDIA_TICKET_SCOPE && payload.source === source && typeof payload.exp === "number" && Number.isFinite(payload.exp) && payload.exp >= now;
	} catch {
		return false;
	}
}
function classifyAssistantMediaError(err) {
	if (err instanceof FsSafeError) switch (err.code) {
		case "not-found": return {
			available: false,
			code: "file-not-found",
			reason: "File not found"
		};
		case "not-file": return {
			available: false,
			code: "not-a-file",
			reason: "Not a file"
		};
		case "invalid-path":
		case "path-mismatch":
		case "symlink": return {
			available: false,
			code: "invalid-file",
			reason: "Invalid file"
		};
		default: return {
			available: false,
			code: "attachment-unavailable",
			reason: "Attachment unavailable"
		};
	}
	if (err instanceof Error && "code" in err) {
		const errorCode = err.code;
		switch (typeof errorCode === "string" ? errorCode : "") {
			case "path-not-allowed": return {
				available: false,
				code: "outside-allowed-folders",
				reason: "Outside allowed folders"
			};
			case "invalid-file-url":
			case "invalid-path":
			case "unsafe-bypass":
			case "network-path-not-allowed":
			case "invalid-root": return {
				available: false,
				code: "blocked-local-file",
				reason: "Blocked local file"
			};
			case "not-found": return {
				available: false,
				code: "file-not-found",
				reason: "File not found"
			};
			case "not-file": return {
				available: false,
				code: "not-a-file",
				reason: "Not a file"
			};
			default: break;
		}
	}
	return {
		available: false,
		code: "attachment-unavailable",
		reason: "Attachment unavailable"
	};
}
async function resolveAssistantMediaAvailability(source, localRoots) {
	try {
		const localPath = await resolveMediaReferenceLocalPath(source);
		await assertLocalMediaAllowed(localPath, localRoots);
		const opened = await openLocalFileSafely({ filePath: localPath });
		try {
			const sizeBytes = opened.stat.size;
			let mimeType;
			try {
				const sniffLength = Math.min(sizeBytes, 8192);
				const sniffBuffer = sniffLength > 0 ? Buffer.allocUnsafe(sniffLength) : void 0;
				const bytesRead = sniffBuffer ? await readFileWindowFully(opened.handle, sniffBuffer, 0) : 0;
				mimeType = await detectMime({
					buffer: sniffBuffer?.subarray(0, bytesRead),
					filePath: localPath
				}) ?? void 0;
			} catch {}
			const mediaKind = kindFromMime(mimeType);
			const playbackProbe = mediaKind === "audio" || mediaKind === "video" ? await probePlaybackMediaFileDescriptor(opened.handle.fd, mediaKind) : null;
			const probe = playbackProbe ? {
				...playbackProbe.durationMs ? { durationMs: playbackProbe.durationMs } : {},
				...playbackProbe.width && playbackProbe.height ? {
					width: playbackProbe.width,
					height: playbackProbe.height
				} : {}
			} : {};
			const playback = mimeType && (mediaKind === "audio" || mediaKind === "video") ? await resolvePlaybackModeForSource({
				sourcePath: opened.realPath,
				sourceStat: opened.stat,
				mimeType,
				kind: mediaKind,
				probe: playbackProbe
			}) : void 0;
			return {
				available: true,
				...mimeType ? { mimeType } : {},
				...playback ? { playback } : {},
				sizeBytes,
				...probe
			};
		} finally {
			await opened.handle.close().catch(() => {});
		}
	} catch (err) {
		return classifyAssistantMediaError(err);
	}
}
async function handleControlUiAssistantMediaRequest(req, res, opts) {
	const urlRaw = req.url;
	if (!urlRaw || !isReadHttpMethod(req.method)) return false;
	const url = new URL(urlRaw, "http://localhost");
	if (url.pathname !== resolveAssistantMediaRoutePath(opts?.basePath)) return false;
	applyControlUiSecurityHeaders(res);
	const source = normalizeAssistantMediaSource(url.searchParams.get("source") ?? "");
	if (!source) {
		respondNotFound(res);
		return true;
	}
	const isMetaRequest = url.searchParams.get("meta") === "1";
	if (!(!isMetaRequest && verifyAssistantMediaTicket(url.searchParams.get("mediaTicket"), source)) && !await authorizeControlUiReadRequest(req, res, {
		auth: opts?.auth,
		trustedProxies: opts?.trustedProxies,
		allowRealIpFallback: opts?.allowRealIpFallback,
		rateLimiter: opts?.rateLimiter,
		allowQueryToken: true
	})) return true;
	const localRoots = opts?.config ? getAgentScopedMediaLocalRoots(opts.config, opts.agentId) : getDefaultLocalRootsCore();
	if (isMetaRequest) {
		const availability = await resolveAssistantMediaAvailability(source, localRoots);
		sendJson(res, 200, availability.available ? {
			...availability,
			...createAssistantMediaTicket(source)
		} : availability);
		return true;
	}
	let byteStream;
	try {
		const resolvedReference = await resolveMediaReferenceLocalPathInfo(source);
		const localPath = resolvedReference.path;
		await assertLocalMediaAllowed(localPath, localRoots);
		let opened = await openLocalFileSafely({ filePath: localPath });
		byteStream = createGatewayByteStream(res, opened.handle, () => respondNotFound(res));
		const sniffLength = Math.min(opened.stat.size, 8192);
		const sniffBuffer = sniffLength > 0 ? Buffer.allocUnsafe(sniffLength) : void 0;
		const bytesRead = sniffBuffer && sniffLength > 0 ? await readFileWindowFully(opened.handle, sniffBuffer, 0) : 0;
		let contentType = await detectMime({
			buffer: sniffBuffer?.subarray(0, bytesRead),
			filePath: localPath
		}) ?? "application/octet-stream";
		let filename = resolvedReference.kind === "inbound" ? extractOriginalFilename(localPath) : path.basename(localPath);
		const mediaKind = kindFromMime(contentType);
		if (url.searchParams.get("playback") === "1" && (mediaKind === "audio" || mediaKind === "video")) {
			const playback = await resolvePlaybackTranscode({
				sourcePath: opened.realPath,
				sourceStat: opened.stat,
				mimeType: contentType,
				kind: mediaKind
			});
			if (playback.kind === "preparing") {
				await byteStream.close();
				sendJson(res, 202, { status: "preparing" });
				return true;
			}
			if (playback.kind === "transcoded") {
				const transcoded = await openLocalFileSafely({ filePath: playback.path }).catch(() => null);
				if (transcoded) {
					await byteStream.close();
					opened = transcoded;
					byteStream = createGatewayByteStream(res, opened.handle, () => respondNotFound(res));
					contentType = playback.contentType;
					filename = replacePlaybackFileExtension(filename, playback.extension);
				}
			}
		}
		res.setHeader("Content-Type", contentType);
		res.setHeader("Content-Disposition", buildAssistantMediaContentDisposition(filename, contentType));
		res.setHeader("Cache-Control", "no-cache");
		const byteResponse = resolveByteResponse({
			file: opened.stat,
			method: req.method,
			request: req
		});
		writeByteHeaders(res, byteResponse);
		await byteStream.pipe(byteResponse, req.method);
		return true;
	} catch {
		await byteStream?.close();
		respondNotFound(res);
		return true;
	}
}
async function handleControlUiAvatarRequest(req, res, opts) {
	const urlRaw = req.url;
	if (!urlRaw) return false;
	if (!isReadHttpMethod(req.method)) return false;
	const url = new URL(urlRaw, "http://localhost");
	const basePath = normalizeControlUiBasePath(opts.basePath);
	const pathname = url.pathname;
	const pathWithBase = basePath ? `${basePath}${CONTROL_UI_AVATAR_PREFIX}/` : `${CONTROL_UI_AVATAR_PREFIX}/`;
	if (!pathname.startsWith(pathWithBase)) return false;
	applyControlUiSecurityHeaders(res);
	const agentIdParts = pathname.slice(pathWithBase.length).split("/").filter(Boolean);
	const agentId = agentIdParts[0] ?? "";
	if (agentIdParts.length !== 1 || !agentId || !isValidAgentPathSegment(agentId)) {
		respondNotFound(res);
		return true;
	}
	if (!await authorizeControlUiReadRequest(req, res, {
		auth: opts.auth,
		trustedProxies: opts.trustedProxies,
		allowRealIpFallback: opts.allowRealIpFallback,
		rateLimiter: opts.rateLimiter
	})) return true;
	const identity = resolveAssistantIdentity({
		cfg: opts.config,
		agentId
	});
	const projection = openGatewayAssistantAvatar({
		cfg: opts.config,
		identity
	});
	const resolved = projection.resolution;
	if (url.searchParams.get("meta") === "1") {
		try {
			const meta = controlUiAvatarResolutionMeta(resolved);
			sendJson(res, 200, {
				avatarUrl: resolved?.kind === "local" ? buildControlUiAvatarUrl(basePath, agentId) : resolved?.kind === "remote" || resolved?.kind === "data" ? resolved.url : null,
				avatarSource: meta.avatarSource,
				avatarStatus: meta.avatarStatus,
				avatarReason: meta.avatarReason
			});
		} finally {
			if (projection.openedFile) fs.closeSync(projection.openedFile.fd);
		}
		return true;
	}
	if (resolved?.kind !== "local" || !projection.openedFile) {
		respondNotFound(res);
		return true;
	}
	try {
		res.setHeader("Content-Type", resolveAvatarMime(projection.openedFile.path));
		res.setHeader("Cache-Control", "no-cache");
		if (req.method === "HEAD") {
			res.statusCode = 200;
			res.setHeader("Content-Length", String(projection.openedFile.stat.size));
			res.end();
			return true;
		}
		const body = await readFileDescriptorBounded(projection.openedFile.fd, AVATAR_MAX_BYTES);
		res.end(body);
		return true;
	} catch {
		respondNotFound(res);
		return true;
	} finally {
		fs.closeSync(projection.openedFile.fd);
	}
}
async function serveResolvedIndexHtml(req, res, body, basePath, allowWasm) {
	const normalizedBasePath = normalizeControlUiBasePath(basePath);
	const withBasePath = rewriteControlUiIndexHtmlPublicAssetHrefs(body, normalizedBasePath);
	const basePathAttribute = normalizedBasePath ? ` ${CONTROL_UI_BASE_PATH_ATTRIBUTE}="${escapeHtmlAttribute(normalizedBasePath)}"` : "";
	const prepared = withBasePath.replace(/<html\b/i, `<html${basePathAttribute} ${CONTROL_UI_TERMINAL_ENABLED_ATTRIBUTE}="${allowWasm === true}"`);
	const hashes = computeInlineScriptHashes(prepared);
	res.setHeader("Content-Security-Policy", buildControlUiCspHeader({
		inlineScriptHashes: hashes,
		allowWasm,
		portalHost: req.headers.host
	}));
	res.setHeader("Content-Type", "text/html; charset=utf-8");
	res.setHeader("Cache-Control", "no-cache");
	await sendControlUiHtmlBody(req, res, prepared);
}
function isExpectedSafePathError(error) {
	const code = typeof error === "object" && error !== null && "code" in error ? String(error.code) : "";
	return code === "ENOENT" || code === "ENOTDIR" || code === "ELOOP";
}
function resolveSafeControlUiFile(rootReal, filePath, rejectHardlinks) {
	const opened = openRootFileSync({
		absolutePath: filePath,
		rootPath: rootReal,
		rootRealPath: rootReal,
		boundaryLabel: "control ui root",
		skipLexicalRootCheck: true,
		rejectSymlinks: false,
		rejectHardlinks
	});
	if (!opened.ok) return matchRootFileOpenFailure(opened, {
		io: (failure) => {
			throw failure.error;
		},
		fallback: () => null
	});
	return {
		path: opened.path,
		fd: opened.fd,
		size: opened.stat.size
	};
}
function isSafeRelativePath(relPath) {
	if (!relPath) return false;
	const normalized = path.posix.normalize(relPath);
	if (path.posix.isAbsolute(normalized) || path.win32.isAbsolute(normalized)) return false;
	if (normalized.startsWith("../") || normalized === "..") return false;
	if (normalized.includes("\0")) return false;
	return true;
}
const CONTROL_UI_DEFAULT_NAMESPACE_BOOTSTRAP_CONFIG_PATH = `${CONTROL_UI_NAMESPACE_PREFIX.replace(/\/$/, "")}${CONTROL_UI_BOOTSTRAP_CONFIG_PATH}`;
const LEGACY_BOOTSTRAP_CONFIG_PATH = `/__openclaw${CONTROL_UI_BOOTSTRAP_CONFIG_PATH}`;
/**
* Whether `pathname` should be served the Control UI bootstrap config payload.
*
* The canonical endpoint is the configured base path joined with the shared
* bootstrap constant (or the bare constant when no base path is configured).
* For every base path (configured or empty) we additionally accept the legacy
* single-underscore suffix `${basePath}/__openclaw/control-ui-config.json` that
* current main and v2026.6.1 serve and document, so older bundles and clients
* that still request the pre-#66946 endpoint keep receiving config after an
* upgrade instead of 404ing. When no base path is configured we further accept
* the default-namespace alias `/__openclaw__/control-ui-config.json`, which is
* what the default `/__openclaw__/` entry requests after inferring its base path
* from the URL. All compatibility endpoints are preserved; no path is removed.
*/
function matchesControlUiBootstrapConfigPath(pathname, basePath) {
	if (pathname === `${basePath}/control-ui-config.json` || pathname === `${basePath}${LEGACY_BOOTSTRAP_CONFIG_PATH}`) return true;
	return basePath === "" && pathname === CONTROL_UI_DEFAULT_NAMESPACE_BOOTSTRAP_CONFIG_PATH;
}
async function handleControlUiHttpRequest(req, res, opts) {
	const urlRaw = req.url;
	if (!urlRaw) return false;
	const url = new URL(urlRaw, "http://localhost");
	const basePath = normalizeControlUiBasePath(opts?.basePath);
	const pathname = url.pathname;
	const terminalEnabled = opts?.terminalEnabled ?? isTerminalConfigEnabled(opts?.config);
	const route = classifyControlUiRequest({
		basePath,
		pathname,
		search: url.search,
		method: req.method,
		accept: req.headers?.accept
	});
	if (route.kind === "not-control-ui") return false;
	if (route.kind === "not-found") {
		applyControlUiSecurityHeaders(res);
		respondNotFound(res);
		return true;
	}
	if (route.kind === "redirect") {
		applyControlUiSecurityHeaders(res);
		res.statusCode = 302;
		res.setHeader("Location", route.location);
		res.end();
		return true;
	}
	applyControlUiSecurityHeaders(res);
	if (matchesControlUiBootstrapConfigPath(pathname, basePath)) {
		let pluginFrameGrants = [];
		if (!await authorizeControlUiReadRequest(req, res, {
			auth: opts?.auth,
			trustedProxies: opts?.trustedProxies,
			allowRealIpFallback: opts?.allowRealIpFallback,
			rateLimiter: opts?.rateLimiter,
			onPluginFrameGrants: (grants) => {
				pluginFrameGrants = grants;
			}
		})) return true;
		if (req.method === "HEAD") {
			res.statusCode = 200;
			res.setHeader("Content-Type", "application/json; charset=utf-8");
			res.setHeader("Cache-Control", "no-cache");
			res.end();
			return true;
		}
		const config = opts?.config;
		const resolvedIdentity = config ? resolveAssistantIdentity({
			cfg: config,
			agentId: opts?.agentId
		}) : void 0;
		const identity = resolvedIdentity ?? DEFAULT_ASSISTANT_IDENTITY;
		const assistantAgentId = resolvedIdentity?.agentId;
		const avatarProjection = config && resolvedIdentity ? resolveGatewayAssistantAvatar({
			cfg: config,
			identity: resolvedIdentity
		}) : {
			avatar: identity.avatar,
			resolution: null
		};
		const avatarMeta = controlUiAvatarResolutionMeta(avatarProjection.resolution);
		sendJson(res, 200, {
			basePath,
			assistantName: identity.name,
			assistantAvatar: avatarProjection.avatar,
			assistantAvatarSource: avatarMeta.avatarSource,
			assistantAvatarStatus: avatarMeta.avatarStatus,
			assistantAvatarReason: avatarMeta.avatarReason,
			...assistantAgentId ? { assistantAgentId } : {},
			serverVersion: resolveRuntimeServiceVersion(process.env),
			serverBuildId: config?.gateway?.controlUi?.root === void 0 ? resolveRuntimeServiceBuildId() ?? void 0 : void 0,
			devGitBranch: await resolveDevInstallGitBranch() ?? void 0,
			localMediaPreviewRoots: [...getAgentScopedMediaLocalRoots(config ?? {}, assistantAgentId)],
			embedSandbox: config?.gateway?.controlUi?.embedSandbox === "trusted" ? "trusted" : config?.gateway?.controlUi?.embedSandbox === "strict" ? "strict" : "scripts",
			allowExternalEmbedUrls: config?.gateway?.controlUi?.allowExternalEmbedUrls === true,
			seamColor: config?.ui?.seamColor,
			terminalEnabled,
			cliAgentsEnabled: config?.gateway?.cliAgents?.enabled === true,
			pluginFrameGrants: pluginFrameGrants.map(({ pluginId, path: grantPath, match }) => ({
				pluginId,
				path: grantPath,
				match
			}))
		});
		return true;
	}
	const rootState = opts?.root;
	if (rootState?.kind === "invalid") {
		respondControlUiAssetsUnavailable(res, { configuredRootPath: rootState.path });
		return true;
	}
	if (rootState?.kind === "preparing") {
		respondControlUiAssetsUnavailable(res, { preparing: true });
		return true;
	}
	if (rootState?.kind === "failed") {
		respondControlUiAssetsUnavailable(res, { failed: true });
		return true;
	}
	if (!rootState || rootState.kind === "missing") {
		respondControlUiAssetsUnavailable(res);
		return true;
	}
	const root = rootState.path;
	const rootReal = (() => {
		if (rootState.realPath) return rootState.realPath;
		try {
			return fs.realpathSync(root);
		} catch (error) {
			if (isExpectedSafePathError(error)) return null;
			throw error;
		}
	})();
	if (!rootReal) {
		respondControlUiAssetsUnavailable(res);
		return true;
	}
	const uiPath = basePath && pathname.startsWith(`${basePath}/`) ? pathname.slice(basePath.length) : pathname;
	const approvalDocument = isControlUiApprovalDocumentPath({
		basePath,
		pathname
	});
	const rel = (() => {
		if (uiPath === ROOT_PREFIX) return "";
		if (uiPath.startsWith(CONTROL_UI_NAMESPACE_PREFIX)) {
			const namespacedRel = uiPath.slice(14);
			if (CONTROL_UI_ROOT_PUBLIC_ASSETS.has(namespacedRel)) return namespacedRel;
		}
		const assetsIndex = uiPath.indexOf("/assets/");
		if (assetsIndex >= 0) return uiPath.slice(assetsIndex + 1);
		return uiPath.slice(1);
	})();
	const fileRel = (approvalDocument ? "index.html" : rel && !rel.endsWith("/") ? rel : `${rel}index.html`) || "index.html";
	if (!isSafeRelativePath(fileRel)) {
		respondNotFound(res);
		return true;
	}
	const filePath = path.resolve(root, fileRel);
	if (!isWithinDir(root, filePath)) {
		respondNotFound(res);
		return true;
	}
	const isBundledRoot = rootState.kind === "bundled";
	if (isBundledRoot && isControlUiPrecompressedAssetExtension(path.extname(fileRel).toLowerCase())) {
		respondNotFound(res);
		return true;
	}
	const rejectHardlinks = !isBundledRoot;
	const immutableAsset = isBundledRoot && fileRel.startsWith("assets/");
	const safeFile = resolveSafeControlUiFile(rootReal, filePath, rejectHardlinks);
	if (safeFile) {
		if (path.basename(safeFile.path) === "index.html") {
			if (req.method === "HEAD") try {
				const encoding = resolveControlUiHtmlEncoding(req);
				if (encoding === "not-acceptable") {
					respondControlUiNotAcceptable(res);
					return true;
				}
				respondHeadForControlUiFile(res, safeFile.path, { encoding: encoding === "identity" ? void 0 : encoding });
				return true;
			} finally {
				fs.closeSync(safeFile.fd);
			}
			await serveResolvedIndexHtml(req, res, await readAndCloseControlUiFileText(safeFile.fd), basePath, terminalEnabled);
			return true;
		}
		const representation = resolveOpenedControlUiRepresentation({
			req,
			sourceFile: safeFile,
			precompressed: immutableAsset,
			openPrecompressedFile: (compressedPath) => resolveSafeControlUiFile(rootReal, compressedPath, false)
		});
		if (!representation) {
			respondControlUiNotAcceptable(res);
			return true;
		}
		if (req.method === "HEAD") try {
			respondHeadForControlUiFile(res, representation.contentPath, {
				immutable: immutableAsset,
				encoding: representation.encoding,
				contentLength: representation.bodyFile.size
			});
			return true;
		} finally {
			fs.closeSync(representation.bodyFile.fd);
		}
		const body = await readAndCloseControlUiFile(representation.bodyFile.fd);
		await serveControlUiAsset(res, representation.contentPath, body, {
			immutable: immutableAsset,
			encoding: representation.encoding
		});
		return true;
	}
	if (isControlUiStaticAssetExtension(path.extname(fileRel).toLowerCase())) {
		respondNotFound(res);
		return true;
	}
	if (!route.spaFallback) return false;
	const safeIndex = resolveSafeControlUiFile(rootReal, path.join(root, "index.html"), rejectHardlinks);
	if (safeIndex) {
		if (req.method === "HEAD") try {
			const encoding = resolveControlUiHtmlEncoding(req);
			if (encoding === "not-acceptable") {
				respondControlUiNotAcceptable(res);
				return true;
			}
			respondHeadForControlUiFile(res, safeIndex.path, { encoding: encoding === "identity" ? void 0 : encoding });
			return true;
		} finally {
			fs.closeSync(safeIndex.fd);
		}
		await serveResolvedIndexHtml(req, res, await readAndCloseControlUiFileText(safeIndex.fd), basePath, terminalEnabled);
		return true;
	}
	respondNotFound(res);
	return true;
}
//#endregion
export { handleControlUiAssistantMediaRequest, handleControlUiAvatarRequest, handleControlUiHttpRequest };
