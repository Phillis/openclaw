import { s as __toESM } from "./rolldown-runtime-DE1ahGrs.js";
import { r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { t as coerceErrorMessage } from "./error-coercion-DisD0JTb.js";
import { F as resolveTimerTimeoutMs, g as isFutureDateTimestampMs } from "./number-coercion-oCkfUEEq.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { r as withTimeout } from "./timing-8WD1In27.js";
import { t as readSecretFile } from "./secret-read-async-oIy8Pzit.js";
import { h as normalizeSecretInputString, l as hasConfiguredSecretInput, m as normalizeResolvedSecretInputString } from "./types.secrets-BrIfhxSG.js";
import { b as ssrfPolicyFromHttpBaseUrlAllowedOrigin, u as isPrivateIpAddress } from "./ssrf-UFPP-fbI.js";
import { r as fetchWithSsrFGuard } from "./fetch-guard-Bk80Ti5l.js";
import { p as readProviderJsonResponse } from "./provider-http-errors-BH2HGv8j.js";
import { t as decodeHtmlEntities } from "./html-entities-CvDVeY8C.js";
import { h as resolveProviderOperationTimeoutMs, n as createProviderOperationDeadline } from "./shared-CzcciRDF.js";
import "./error-runtime-CmlvK1A3.js";
import { t as responseWithRelease } from "./fetch-runtime-ULXJgZw8.js";
import "./number-runtime-CoAPZzJY.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import "./secret-input-Dv7SE4A5.js";
import "./secret-file-DD5yEM8Q.js";
import { a as normalizeHostnameSuffixAllowlist, n as buildHostnameAllowlistPolicyFromSuffixAllowlist, r as isHttpsUrlAllowedByHostnameSuffixAllowlist } from "./ssrf-policy-DykNyVe7.js";
import "./ssrf-runtime-DEEsG6Hl.js";
import "./text-utility-runtime-LRU688AB.js";
import "./provider-http-DfD6NQiF.js";
import "./html-entity-runtime-DaPF1Tq9.js";
import { t as getMSTeamsRuntime } from "./runtime-WoHzfrEz.js";
import "./runtime-api-D_0cmyak.js";
import { c as createMSTeamsHttpError, n as refreshMSTeamsDelegatedTokens } from "./oauth.token-C67Z7l9i.js";
import { i as loadMSTeamsDelegatedTokens, o as saveMSTeamsDelegatedTokens } from "./delegated-state-B9V2InOX.js";
import { createRequire } from "node:module";
import { lookup } from "node:dns/promises";
import { Buffer } from "node:buffer";
//#region extensions/msteams/src/inbound.ts
/**
* Strip HTML tags, preserving text content.
*/
function htmlToPlainText(html) {
	return decodeHtmlEntities(html.replace(/<[^>]*>/g, " ")).replaceAll("\xA0", " ").replace(/\s+/g, " ").trim();
}
/**
* Extract quote info from MS Teams HTML reply attachments.
* Teams wraps quoted content in a blockquote with itemtype="http://schema.skype.com/Reply".
*/
function extractMSTeamsQuoteInfo(attachments) {
	for (const att of attachments) {
		let content = "";
		if (typeof att.content === "string") content = att.content;
		else if (typeof att.content === "object" && att.content !== null) {
			const record = att.content;
			content = typeof record.text === "string" ? record.text : typeof record.body === "string" ? record.body : "";
		}
		if (!content) continue;
		if (!content.includes("http://schema.skype.com/Reply")) continue;
		const senderMatch = /<strong[^>]*itemprop=["']mri["'][^>]*>(.*?)<\/strong>/i.exec(content);
		const sender = senderMatch?.[1] ? htmlToPlainText(senderMatch[1]) : void 0;
		const bodyMatch = /<p[^>]*itemprop=["']copy["'][^>]*>(.*?)<\/p>/is.exec(content) ?? /<p[^>]*itemprop=["']preview["'][^>]*>(.*?)<\/p>/is.exec(content);
		const body = bodyMatch?.[1] ? htmlToPlainText(bodyMatch[1]) : void 0;
		const id = /<blockquote[^>]*\bitemid=["']([^"']+)["'][^>]*>/is.exec(content)?.[1]?.trim() || void 0;
		if (body) return {
			sender: sender ?? "unknown",
			body,
			...id ? { id } : {}
		};
	}
}
function normalizeMSTeamsConversationId(raw) {
	return raw.split(";")[0] ?? raw;
}
function extractMSTeamsConversationMessageId(raw) {
	if (!raw) return;
	return (/(?:^|;)messageid=([^;]+)/i.exec(raw)?.[1]?.trim() ?? "") || void 0;
}
function parseMSTeamsActivityTimestamp(value) {
	if (!value) return;
	if (value instanceof Date) return value;
	if (typeof value !== "string") return;
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? void 0 : date;
}
function stripMSTeamsMentionTags(text) {
	return text.replace(/<at[^>]*>.*?<\/at>/gi, "").trim();
}
function wasMSTeamsBotMentioned(activity) {
	const botId = activity.recipient?.id;
	if (!botId) return false;
	return (activity.entities ?? []).some((e) => e.type === "mention" && e.mentioned?.id === botId);
}
//#endregion
//#region extensions/msteams/src/request-timeout.ts
const MSTEAMS_REQUEST_TIMEOUT_MS = 3e4;
const MSTEAMS_SHAREPOINT_UPLOAD_BASE_TIMEOUT_MS = 5 * 6e4;
const MSTEAMS_SHAREPOINT_UPLOAD_MIN_BYTES_PER_SECOND = 256 * 1024;
const MSTEAMS_INBOUND_PREPROCESS_TIMEOUT_MS = 1e4;
function createMSTeamsInboundDeadline() {
	return createProviderOperationDeadline({
		label: "MS Teams inbound preprocessing",
		timeoutMs: MSTEAMS_INBOUND_PREPROCESS_TIMEOUT_MS
	});
}
function resolveMSTeamsRequestTimeoutMs(deadline) {
	return deadline ? resolveProviderOperationTimeoutMs({
		deadline,
		defaultTimeoutMs: MSTEAMS_REQUEST_TIMEOUT_MS
	}) : MSTEAMS_REQUEST_TIMEOUT_MS;
}
/** Bound non-abortable SDK and credential work to the same operation deadline as fetches. */
async function withMSTeamsRequestDeadline(params) {
	const timeoutMs = resolveMSTeamsRequestTimeoutMs(params.deadline);
	return await withTimeout(params.work(), timeoutMs, params.label);
}
function resolveMSTeamsSharePointUploadTimeoutMs(sizeInBytes) {
	const transferBudgetMs = Math.ceil((Number.isFinite(sizeInBytes) && sizeInBytes > 0 ? Math.ceil(sizeInBytes) : 0) / MSTEAMS_SHAREPOINT_UPLOAD_MIN_BYTES_PER_SECOND * 1e3);
	return resolveTimerTimeoutMs(MSTEAMS_SHAREPOINT_UPLOAD_BASE_TIMEOUT_MS + transferBudgetMs, MSTEAMS_SHAREPOINT_UPLOAD_BASE_TIMEOUT_MS, 1);
}
function createMSTeamsRequestTimeoutError(label, timeoutMs) {
	const error = /* @__PURE__ */ new Error(`${label} timed out after ${timeoutMs}ms`);
	error.name = "TimeoutError";
	return error;
}
async function withMSTeamsAbortableRequestTimeout(params) {
	const controller = new AbortController();
	const timeoutMs = resolveTimerTimeoutMs(params.timeoutMs, MSTEAMS_REQUEST_TIMEOUT_MS, 1);
	const work = Promise.resolve().then(() => params.work(controller.signal));
	try {
		return await withTimeout(work, timeoutMs, { createError: () => createMSTeamsRequestTimeoutError(params.label, timeoutMs) });
	} catch (error) {
		controller.abort(error);
		throw error;
	}
}
//#endregion
//#region extensions/msteams/src/attachments/shared.ts
const IMAGE_EXT_RE = /\.(avif|bmp|gif|heic|heif|jpe?g|png|tiff?|webp)$/i;
const IMG_SRC_RE = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
const ATTACHMENT_TAG_RE = /<attachment[^>]+id=["']([^"']+)["'][^>]*>/gi;
const GRAPH_HOSTED_CONTENT_SRC_RE = /\/hostedContents\/([^/?#]+)/i;
function resolveInlineImageSourceId(src) {
	const hostedContentId = GRAPH_HOSTED_CONTENT_SRC_RE.exec(src)?.[1];
	if (!hostedContentId) return src;
	try {
		return decodeURIComponent(hostedContentId);
	} catch {
		return hostedContentId;
	}
}
const DEFAULT_MEDIA_HOST_ALLOWLIST = [
	"graph.microsoft.com",
	"graph.microsoft.us",
	"graph.microsoft.de",
	"graph.microsoft.cn",
	"sharepoint.com",
	"sharepoint.us",
	"sharepoint.de",
	"sharepoint.cn",
	"sharepoint-df.com",
	"1drv.ms",
	"onedrive.com",
	"teams.microsoft.com",
	"teams.cdn.office.net",
	"statics.teams.cdn.office.net",
	"office.com",
	"office.net",
	"asm.skype.com",
	"ams.skype.com",
	"media.ams.skype.com",
	"trafficmanager.net",
	"botframework.azure.cn",
	"blob.core.windows.net",
	"azureedge.net",
	"microsoft.com"
];
const DEFAULT_MEDIA_AUTH_HOST_ALLOWLIST = [
	"api.botframework.com",
	"botframework.com",
	"smba.trafficmanager.net",
	"botframework.azure.cn",
	"graph.microsoft.com",
	"graph.microsoft.us",
	"graph.microsoft.de",
	"graph.microsoft.cn"
];
const GRAPH_ROOT = "https://graph.microsoft.com/v1.0";
function estimateBase64DecodedBytes(base64) {
	let effectiveLen = 0;
	for (let i = 0; i < base64.length; i += 1) {
		if (base64.charCodeAt(i) <= 32) continue;
		effectiveLen += 1;
	}
	if (effectiveLen === 0) return 0;
	let padding = 0;
	let end = base64.length - 1;
	while (end >= 0 && base64.charCodeAt(end) <= 32) end -= 1;
	if (end >= 0 && base64[end] === "=") {
		padding = 1;
		end -= 1;
		while (end >= 0 && base64.charCodeAt(end) <= 32) end -= 1;
		if (end >= 0 && base64[end] === "=") padding = 2;
	}
	const estimated = Math.floor(effectiveLen * 3 / 4) - padding;
	return Math.max(0, estimated);
}
/**
* Host suffixes for SharePoint/OneDrive shared links that must be fetched via
* the Graph `/shares/{shareId}/driveItem/content` endpoint instead of directly.
*
* Direct fetches of SharePoint/OneDrive shared URLs return empty/HTML landing
* pages unless encoded as a Graph share id. See
* https://learn.microsoft.com/en-us/graph/api/shares-get for the encoding.
*/
const GRAPH_SHARED_LINK_HOST_SUFFIXES = [
	".sharepoint.com",
	".sharepoint.us",
	".sharepoint.de",
	".sharepoint.cn",
	".sharepoint-df.com",
	"1drv.ms",
	"onedrive.live.com",
	"onedrive.com"
];
/**
* Returns true when the URL points at a SharePoint or OneDrive host whose
* shared-link content must be fetched through the Graph shares API rather
* than directly.
*/
function isGraphSharedLinkUrl(url) {
	let host;
	try {
		host = normalizeLowercaseStringOrEmpty(new URL(url).hostname);
	} catch {
		return false;
	}
	if (!host) return false;
	return GRAPH_SHARED_LINK_HOST_SUFFIXES.some((suffix) => host === suffix || host.endsWith(suffix));
}
/**
* Encode a SharePoint/OneDrive URL as a Graph shareId using the documented
* `u!` + base64url (no padding) scheme:
* https://learn.microsoft.com/en-us/graph/api/shares-get#encoding-sharing-urls
*/
function encodeGraphShareId(url) {
	return `u!${Buffer.from(url, "utf8").toString("base64url")}`;
}
/**
* When `url` is a SharePoint/OneDrive shared link, return the matching
* `GET /shares/{shareId}/driveItem/content` URL that actually yields the file
* bytes. Returns `undefined` for non-shared-link URLs so callers can fall
* through to the existing fetch path.
*/
function tryBuildGraphSharesUrlForSharedLink(url) {
	if (!isGraphSharedLinkUrl(url)) return;
	return `${GRAPH_ROOT}/shares/${encodeGraphShareId(url)}/driveItem/content`;
}
function resolveRequestUrl(input) {
	if (typeof input === "string") return input;
	if (input instanceof URL) return input.toString();
	if (typeof input === "object" && input && "url" in input && typeof input.url === "string") return input.url;
	try {
		return JSON.stringify(input);
	} catch {
		return "";
	}
}
function normalizeContentType(value) {
	const trimmed = normalizeOptionalString(value);
	if (!trimmed) return;
	const parameterIndex = trimmed.indexOf(";");
	if (parameterIndex === -1) return trimmed.toLowerCase();
	return `${trimmed.slice(0, parameterIndex).trim().toLowerCase()}${trimmed.slice(parameterIndex)}`;
}
function resolveMSTeamsMediaKind(params) {
	const mime = normalizeLowercaseStringOrEmpty(params.contentType ?? "");
	const name = normalizeLowercaseStringOrEmpty(params.fileName ?? "");
	const fileType = normalizeLowercaseStringOrEmpty(params.fileType ?? "");
	return mime.startsWith("image/") || IMAGE_EXT_RE.test(name) || IMAGE_EXT_RE.test(`x.${fileType}`) ? "image" : "document";
}
function isLikelyImageAttachment(att) {
	const contentType = normalizeContentType(att.contentType) ?? "";
	const name = typeof att.name === "string" ? att.name : "";
	if (contentType.startsWith("image/")) return true;
	if (IMAGE_EXT_RE.test(name)) return true;
	if (contentType === "application/vnd.microsoft.teams.file.download.info" && isRecord(att.content)) {
		const fileType = typeof att.content.fileType === "string" ? att.content.fileType : "";
		if (fileType && IMAGE_EXT_RE.test(`x.${fileType}`)) return true;
		const fileName = typeof att.content.fileName === "string" ? att.content.fileName : "";
		if (fileName && IMAGE_EXT_RE.test(fileName)) return true;
	}
	return false;
}
/**
* Returns true if the attachment can be downloaded (any file type).
* Used when downloading all files, not just images.
*/
function isDownloadableAttachment(att) {
	if ((normalizeContentType(att.contentType) ?? "") === "application/vnd.microsoft.teams.file.download.info" && isRecord(att.content) && typeof att.content.downloadUrl === "string") return true;
	if (typeof att.contentUrl === "string" && att.contentUrl.trim()) return true;
	return false;
}
function isAdvertisedFileAttachment(attachment) {
	const contentType = normalizeContentType(attachment.contentType) ?? "";
	if (contentType.startsWith("text/html") || contentType.startsWith("application/vnd.microsoft.card.") || contentType.startsWith("application/vnd.microsoft.teams.card.")) return false;
	return Boolean(isDownloadableAttachment(attachment) || isLikelyImageAttachment(attachment) || attachment.name?.trim() || contentType);
}
function isHtmlAttachment(att) {
	return (normalizeContentType(att.contentType) ?? "").startsWith("text/html");
}
function extractHtmlFromAttachment(att) {
	if (!isHtmlAttachment(att)) return;
	if (typeof att.content === "string") return att.content;
	if (!isRecord(att.content)) return;
	return typeof att.content.text === "string" ? att.content.text : typeof att.content.body === "string" ? att.content.body : typeof att.content.content === "string" ? att.content.content : void 0;
}
function canonicalizeInlineBase64Payload(value) {
	let cleaned = "";
	let padding = 0;
	let sawPadding = false;
	for (let index = 0; index < value.length; index += 1) {
		const code = value.charCodeAt(index);
		if (code <= 32) continue;
		if (code === 61) {
			padding += 1;
			if (padding > 2) return;
			sawPadding = true;
			cleaned += "=";
			continue;
		}
		if (sawPadding || !(code >= 65 && code <= 90 || code >= 97 && code <= 122 || code >= 48 && code <= 57 || code === 43 || code === 47)) return;
		cleaned += value[index];
	}
	return cleaned && cleaned.length % 4 === 0 ? cleaned : void 0;
}
function decodeDataImageWithLimits(src, opts) {
	const match = /^data:(image\/[a-z0-9.+-]+)?(;base64)?,(.*)$/i.exec(src);
	if (!match) return {
		candidate: null,
		estimatedBytes: 0
	};
	const contentType = normalizeLowercaseStringOrEmpty(match[1] ?? "");
	if (!Boolean(match[2])) return {
		candidate: null,
		estimatedBytes: 0
	};
	const canonicalPayload = canonicalizeInlineBase64Payload(match[3] ?? "");
	if (!canonicalPayload) return {
		candidate: null,
		estimatedBytes: 0
	};
	const estimatedBytes = estimateBase64DecodedBytes(canonicalPayload);
	if (estimatedBytes <= 0) return {
		candidate: null,
		estimatedBytes: 0
	};
	if (typeof opts.maxInlineBytes === "number" && estimatedBytes > opts.maxInlineBytes) return {
		candidate: null,
		estimatedBytes
	};
	try {
		return {
			candidate: {
				kind: "data",
				data: Buffer.from(canonicalPayload, "base64"),
				contentType
			},
			estimatedBytes
		};
	} catch {
		return {
			candidate: null,
			estimatedBytes: 0
		};
	}
}
function fileHintFromUrl(src) {
	try {
		return new URL(src).pathname.split("/").pop() || void 0;
	} catch {
		return;
	}
}
function extractInlineImageCandidates(attachments, limits) {
	const out = [];
	const seenReferences = /* @__PURE__ */ new Set();
	const representedAttachmentIds = new Set(attachments.flatMap((attachment) => {
		const id = attachment.id?.trim();
		return id && !extractHtmlFromAttachment(attachment) ? [id] : [];
	}));
	let totalEstimatedInlineBytes = 0;
	for (const att of attachments) {
		const html = extractHtmlFromAttachment(att);
		if (!html) continue;
		IMG_SRC_RE.lastIndex = 0;
		let match = IMG_SRC_RE.exec(html);
		while (match) {
			const src = match[1]?.trim();
			if (src) {
				if (src.startsWith("data:")) {
					const { candidate: decoded, estimatedBytes } = decodeDataImageWithLimits(src, { maxInlineBytes: limits?.maxInlineBytes });
					if (decoded) {
						const nextTotal = totalEstimatedInlineBytes + estimatedBytes;
						if (typeof limits?.maxInlineTotalBytes === "number" && nextTotal > limits.maxInlineTotalBytes) out.push({ kind: "unavailable" });
						else {
							totalEstimatedInlineBytes = nextTotal;
							out.push(decoded);
						}
					} else out.push({ kind: "unavailable" });
				} else if (!seenReferences.has(src)) {
					seenReferences.add(src);
					if (src.startsWith("cid:")) {
						const sourceId = src.slice(4) || void 0;
						if (!sourceId || !representedAttachmentIds.has(sourceId)) out.push({
							kind: "unavailable",
							sourceId
						});
						match = IMG_SRC_RE.exec(html);
						continue;
					}
					out.push({
						kind: "url",
						url: src,
						fileHint: fileHintFromUrl(src),
						sourceId: resolveInlineImageSourceId(src)
					});
				}
			}
			match = IMG_SRC_RE.exec(html);
		}
	}
	return out;
}
function safeHostForUrl(url) {
	try {
		return normalizeLowercaseStringOrEmpty(new URL(url).hostname);
	} catch {
		return "invalid-url";
	}
}
function resolveAllowedHosts(input) {
	return normalizeHostnameSuffixAllowlist(input, DEFAULT_MEDIA_HOST_ALLOWLIST);
}
function resolveAuthAllowedHosts(input) {
	return normalizeHostnameSuffixAllowlist(input, DEFAULT_MEDIA_AUTH_HOST_ALLOWLIST);
}
function isMockFetchFn(fetchFn) {
	const candidate = fetchFn;
	return Boolean(candidate.mock || Object.hasOwn(candidate, "_isMockFunction"));
}
function resolveGuardedFetchImpl(params) {
	if (!params.fetchFn) return;
	if (params.fetchFnSupportsDispatcher === true || params.fetchFn === fetch || params.fetchFn === globalThis.fetch || isMockFetchFn(params.fetchFn)) return params.fetchFn;
	throw new Error("MSTeams attachment fetchFn must set fetchFnSupportsDispatcher to use guarded DNS pinning");
}
function resolveRetainedAuthorizationRedirectHostnameAllowlist(input) {
	if (!input) return;
	if (input.includes("*")) return ["*"];
	return resolveMediaSsrfPolicy(input)?.hostnameAllowlist;
}
function resolveAttachmentFetchPolicy(params) {
	return {
		allowHosts: resolveAllowedHosts(params?.allowHosts),
		authAllowHosts: resolveAuthAllowedHosts(params?.authAllowHosts)
	};
}
function isUrlAllowed(url, allowlist) {
	return isHttpsUrlAllowedByHostnameSuffixAllowlist(url, allowlist);
}
function applyAuthorizationHeaderForUrl(params) {
	if (!params.bearerToken) {
		params.headers.delete("Authorization");
		return;
	}
	if (isUrlAllowed(params.url, params.authAllowHosts)) {
		params.headers.set("Authorization", `Bearer ${params.bearerToken}`);
		return;
	}
	params.headers.delete("Authorization");
}
function resolveMediaSsrfPolicy(allowHosts) {
	return buildHostnameAllowlistPolicyFromSuffixAllowlist(allowHosts);
}
/**
* Returns true if the given IPv4 or IPv6 address is in a private, loopback,
* or link-local range that must never be reached from media downloads.
*
* Delegates to the SDK's `isPrivateIpAddress` which handles IPv4-mapped IPv6,
* expanded notation, NAT64, 6to4, Teredo, octal IPv4, and fails closed on
* parse errors.
*/
const isPrivateOrReservedIP = isPrivateIpAddress;
/**
* Resolve a hostname via DNS and reject private/reserved IPs.
* Throws if the resolved IP is private or resolution fails.
*/
async function resolveAndValidateIP(hostname, resolveFn) {
	const resolve = resolveFn ?? lookup;
	let resolved;
	try {
		resolved = await resolve(hostname);
	} catch {
		throw new Error(`DNS resolution failed for "${hostname}"`);
	}
	if (isPrivateOrReservedIP(resolved.address)) throw new Error(`Hostname "${hostname}" resolves to private/reserved IP (${resolved.address})`);
	return resolved.address;
}
/** Maximum number of redirects to follow in safeFetch. */
const MAX_SAFE_REDIRECTS = 5;
function isRedirectStatus(status) {
	return status === 301 || status === 302 || status === 303 || status === 307 || status === 308;
}
/**
* Fetch a URL with redirect: "manual", validating each redirect target
* against the hostname allowlist and optional DNS-resolved IP (anti-SSRF).
*
* This prevents:
* - Auto-following redirects to non-allowlisted hosts
* - DNS rebinding attacks when a lookup function is provided
*/
async function safeFetch(params) {
	const resolveFn = params.resolveFn ?? lookup;
	const hasDispatcher = Boolean(params.requestInit && typeof params.requestInit === "object" && "dispatcher" in params.requestInit);
	const currentHeaders = new Headers(params.requestInit?.headers);
	let currentUrl = params.url;
	if (!isUrlAllowed(currentUrl, params.allowHosts)) throw new Error(`Initial download URL blocked: ${currentUrl}`);
	if (currentHeaders.has("authorization") && params.authorizationAllowHosts && !isUrlAllowed(currentUrl, params.authorizationAllowHosts)) currentHeaders.delete("authorization");
	if (!hasDispatcher) {
		const lookupFn = async (hostname) => {
			const resolved = await resolveFn(hostname);
			return [{
				...resolved,
				family: resolved.address.includes(":") ? 6 : 4
			}];
		};
		const guarded = await fetchWithSsrFGuard({
			url: currentUrl,
			fetchImpl: resolveGuardedFetchImpl({
				fetchFn: params.fetchFn,
				fetchFnSupportsDispatcher: params.fetchFnSupportsDispatcher
			}),
			init: {
				...params.requestInit,
				headers: currentHeaders
			},
			maxRedirects: MAX_SAFE_REDIRECTS,
			requireHttps: true,
			policy: resolveMediaSsrfPolicy(params.allowHosts),
			lookupFn,
			retainAuthorizationRedirectHostnameAllowlist: resolveRetainedAuthorizationRedirectHostnameAllowlist(params.authorizationAllowHosts),
			auditContext: "msteams.attachment",
			timeoutMs: params.timeoutMs ?? 3e4
		});
		return responseWithRelease(guarded.response, guarded.release);
	}
	if (resolveFn) try {
		const initialHost = new URL(currentUrl).hostname;
		await resolveAndValidateIP(initialHost, resolveFn);
	} catch {
		throw new Error(`Initial download URL blocked: ${currentUrl}`);
	}
	for (let i = 0; i <= MAX_SAFE_REDIRECTS; i++) {
		const res = await (params.fetchFn ?? fetch)(currentUrl, {
			...params.requestInit,
			headers: currentHeaders,
			redirect: "manual"
		});
		if (!isRedirectStatus(res.status)) return res;
		const location = res.headers.get("location");
		if (!location) return res;
		let redirectUrl;
		try {
			redirectUrl = new URL(location, currentUrl).toString();
		} catch {
			throw new Error(`Invalid redirect URL: ${location}`);
		}
		if (!isUrlAllowed(redirectUrl, params.allowHosts)) throw new Error(`Media redirect target blocked by allowlist: ${redirectUrl}`);
		if (currentHeaders.has("authorization") && params.authorizationAllowHosts && !isUrlAllowed(redirectUrl, params.authorizationAllowHosts)) currentHeaders.delete("authorization");
		if (hasDispatcher) return res;
		if (resolveFn) {
			const redirectHost = new URL(redirectUrl).hostname;
			await resolveAndValidateIP(redirectHost, resolveFn);
		}
		currentUrl = redirectUrl;
	}
	throw new Error(`Too many redirects (>${MAX_SAFE_REDIRECTS})`);
}
async function safeFetchWithPolicy(params) {
	return await safeFetch({
		url: params.url,
		allowHosts: params.policy.allowHosts,
		authorizationAllowHosts: params.policy.authAllowHosts,
		fetchFn: params.fetchFn,
		fetchFnSupportsDispatcher: params.fetchFnSupportsDispatcher,
		requestInit: params.requestInit,
		resolveFn: params.resolveFn,
		timeoutMs: params.timeoutMs
	});
}
//#endregion
//#region extensions/msteams/src/cloud.ts
const DEFAULT_MSTEAMS_CLOUD = "Public";
const PUBLIC_MSTEAMS_SERVICE_HOST = "smba.trafficmanager.net";
const CHINA_BOT_FRAMEWORK_SERVICE_HOST = "botframework.azure.cn";
function normalizeOptionalServiceUrl(value) {
	const trimmed = value?.trim();
	if (!trimmed) return null;
	try {
		const parsed = new URL(trimmed);
		parsed.hash = "";
		parsed.search = "";
		parsed.pathname = parsed.pathname.replace(/\/+$/, "");
		return {
			value: parsed.toString().replace(/\/+$/, ""),
			host: parsed.hostname.toLowerCase()
		};
	} catch {
		return null;
	}
}
function resolveMSTeamsSdkCloudOptions(cfg) {
	const cloud = cfg?.cloud ?? DEFAULT_MSTEAMS_CLOUD;
	const serviceUrl = cfg?.serviceUrl?.trim();
	if (cloud !== "Public" && cloud !== "China" && !serviceUrl) throw new Error(`channels.msteams.cloud=${cloud} requires channels.msteams.serviceUrl so SDK proactive operations use the matching Teams Bot Connector endpoint.`);
	return {
		cloud,
		...serviceUrl ? { serviceUrl } : {}
	};
}
function isChinaBotFrameworkServiceHost(host) {
	return host === CHINA_BOT_FRAMEWORK_SERVICE_HOST || host.endsWith(`.${CHINA_BOT_FRAMEWORK_SERVICE_HOST}`);
}
function isChinaBotFrameworkServiceUrl(value) {
	const parsed = normalizeOptionalServiceUrl(value);
	return Boolean(parsed && isChinaBotFrameworkServiceHost(parsed.host));
}
function validateMSTeamsProactiveServiceUrlBoundary(params) {
	const configured = normalizeOptionalServiceUrl(params.configuredServiceUrl);
	if (params.cloud !== "Public" && params.cloud !== "China" && !configured) throw new Error(`msteams proactive send blocked for ${params.conversationId}: channels.msteams.cloud=${params.cloud} requires channels.msteams.serviceUrl so SDK proactive operations use the matching Teams Bot Connector endpoint.`);
	if (params.cloud === "China" && configured && !isChinaBotFrameworkServiceHost(configured.host)) throw new Error(`msteams proactive send blocked for ${params.conversationId}: configured Teams serviceUrl (${configured.value}) is not a Microsoft Teams China Bot Framework channel endpoint.`);
	if (params.cloud !== "China" && configured && isChinaBotFrameworkServiceHost(configured.host)) throw new Error(`msteams proactive send blocked for ${params.conversationId}: configured Teams serviceUrl (${configured.value}) requires channels.msteams.cloud=China.`);
	if (configured) {
		const stored = normalizeOptionalServiceUrl(params.storedServiceUrl);
		if (!stored) throw new Error(`msteams proactive send blocked for ${params.conversationId}: stored conversation reference is missing a valid serviceUrl. Ask the bot to receive a new Teams message in this conversation, then retry.`);
		if (stored.host !== configured.host) throw new Error(`msteams proactive send blocked for ${params.conversationId}: stored conversation serviceUrl (${stored.value}) does not match configured Teams SDK serviceUrl host (${configured.host}). Set channels.msteams.cloud/channels.msteams.serviceUrl for the Teams cloud that owns this conversation, or refresh the stored conversation by receiving a new message.`);
		return;
	}
	const stored = normalizeOptionalServiceUrl(params.storedServiceUrl);
	if (!stored) throw new Error(`msteams proactive send blocked for ${params.conversationId}: stored conversation reference is missing a valid serviceUrl. Ask the bot to receive a new Teams message in this conversation, then retry.`);
	if (params.cloud === "China") {
		if (!isChinaBotFrameworkServiceHost(stored.host)) throw new Error(`msteams proactive send blocked for ${params.conversationId}: stored conversation serviceUrl (${stored.value}) is not a Microsoft Teams China Bot Framework channel endpoint. Use a conversation reference received from the China/21Vianet Teams cloud.`);
		return;
	}
	if (isChinaBotFrameworkServiceUrl(stored.value)) throw new Error(`msteams proactive send blocked for ${params.conversationId}: stored conversation serviceUrl (${stored.value}) requires channels.msteams.cloud=China.`);
	if (stored.host !== PUBLIC_MSTEAMS_SERVICE_HOST) throw new Error(`msteams proactive send blocked for ${params.conversationId}: stored conversation serviceUrl (${stored.value}) is not a Microsoft Teams public-cloud Bot Connector endpoint. Set channels.msteams.cloud and channels.msteams.serviceUrl for the supported Teams cloud that owns this conversation.`);
}
//#endregion
//#region extensions/msteams/src/bot-framework-service-url.ts
const BOT_FRAMEWORK_SERVICE_URL_HOST_ALLOWLIST = normalizeHostnameSuffixAllowlist([
	"smba.trafficmanager.net",
	"smba.infra.gcc.teams.microsoft.com",
	"smba.infra.gov.teams.microsoft.us",
	"smba.infra.dod.teams.microsoft.us",
	"botframework.azure.cn"
]);
function describeBotFrameworkServiceUrlHost(serviceUrl) {
	try {
		return new URL(serviceUrl.trim()).hostname || "invalid-url";
	} catch {
		return "invalid-url";
	}
}
function isAllowedBotFrameworkServiceUrl(serviceUrl) {
	if (typeof serviceUrl !== "string") return false;
	const trimmed = serviceUrl.trim();
	return Boolean(trimmed && isHttpsUrlAllowedByHostnameSuffixAllowlist(trimmed, BOT_FRAMEWORK_SERVICE_URL_HOST_ALLOWLIST));
}
function tryNormalizeBotFrameworkServiceUrl(serviceUrl) {
	if (!isAllowedBotFrameworkServiceUrl(serviceUrl)) return;
	return serviceUrl.trim().replace(/\/+$/, "");
}
function normalizeBotFrameworkServiceUrl(serviceUrl) {
	const normalized = tryNormalizeBotFrameworkServiceUrl(serviceUrl);
	if (normalized) return normalized;
	throw new Error(`Blocked Microsoft Teams serviceUrl host: ${describeBotFrameworkServiceUrlHost(serviceUrl)}`);
}
//#endregion
//#region extensions/msteams/src/qa/private-runtime.ts
const PRIVATE_QA_BUILD_ENV = "OPENCLAW_BUILD_PRIVATE_QA";
const PRIVATE_QA_NONCE_HEADER = "x-openclaw-msteams-qa-nonce";
const PRIVATE_QA_RUNTIME_SYMBOL = Symbol.for("openclaw.msteams.privateQaRuntime");
var PrivateQaHttpClient = class PrivateQaHttpClient {
	constructor(connectorUrl, nonce, options = {}) {
		this.connectorUrl = connectorUrl;
		this.nonce = nonce;
		this.options = options;
	}
	clone(options = {}) {
		return new PrivateQaHttpClient(this.connectorUrl, this.nonce, {
			...this.options,
			...options,
			headers: {
				...this.options.headers,
				...options.headers
			}
		});
	}
	async request(config) {
		const sourceUrl = new URL(config.url ?? "", "https://smba.trafficmanager.net");
		const targetUrl = new URL(`${sourceUrl.pathname}${sourceUrl.search}`, this.connectorUrl);
		const headers = new Headers(this.options.headers);
		for (const [key, value] of Object.entries(config.headers ?? {})) if (value != null) headers.set(key, String(value));
		headers.set(PRIVATE_QA_NONCE_HEADER, this.nonce);
		const token = typeof this.options.token === "function" ? await this.options.token() : this.options.token;
		if (token) headers.set("authorization", `Bearer ${token}`);
		const method = String(config.method ?? "GET").toUpperCase();
		const { response, release } = await fetchWithSsrFGuard({
			url: targetUrl.toString(),
			init: {
				method,
				headers,
				body: method === "GET" || method === "HEAD" || config.data == null ? void 0 : typeof config.data === "string" ? config.data : JSON.stringify(config.data)
			},
			policy: ssrfPolicyFromHttpBaseUrlAllowedOrigin(targetUrl.toString()),
			maxRedirects: 0,
			auditContext: "msteams-private-qa-connector"
		});
		try {
			const text = await response.text();
			const data = text ? JSON.parse(text) : void 0;
			if (!response.ok) throw new Error(`Microsoft Teams private QA connector returned HTTP ${response.status}`);
			return {
				data,
				status: response.status,
				statusText: response.statusText,
				headers: Object.fromEntries(response.headers),
				config
			};
		} finally {
			await release();
		}
	}
	get(url, config = {}) {
		return this.request({
			...config,
			method: "GET",
			url
		});
	}
	post(url, data, config = {}) {
		return this.request({
			...config,
			data,
			method: "POST",
			url
		});
	}
	put(url, data, config = {}) {
		return this.request({
			...config,
			data,
			method: "PUT",
			url
		});
	}
	patch(url, data, config = {}) {
		return this.request({
			...config,
			data,
			method: "PATCH",
			url
		});
	}
	delete(url, config = {}) {
		return this.request({
			...config,
			method: "DELETE",
			url
		});
	}
};
function resolveMSTeamsPrivateQaRuntime(env = process.env, bootstrap = globalThis[PRIVATE_QA_RUNTIME_SYMBOL]) {
	if (!bootstrap) return;
	if (env[PRIVATE_QA_BUILD_ENV] !== "1") throw new Error("Microsoft Teams private QA runtime requires OPENCLAW_BUILD_PRIVATE_QA=1");
	const connectorUrl = bootstrap.connectorUrl?.trim();
	const nonce = bootstrap.nonce?.trim();
	const botToken = bootstrap.botToken?.trim();
	if (!connectorUrl || !nonce || !botToken) throw new Error("Microsoft Teams private QA bootstrap requires connector URL, nonce, and bot token");
	const parsedConnectorUrl = new URL(connectorUrl);
	if (parsedConnectorUrl.protocol !== "http:" || parsedConnectorUrl.hostname !== "127.0.0.1" && parsedConnectorUrl.hostname !== "localhost") throw new Error("Microsoft Teams private QA connector must use loopback HTTP");
	return {
		client: new PrivateQaHttpClient(parsedConnectorUrl.toString(), nonce),
		listenHost: "127.0.0.1",
		skipAuth: true,
		token: async () => botToken
	};
}
//#endregion
//#region extensions/msteams/src/user-agent.ts
let cachedUserAgent;
function resolveTeamsSdkVersion() {
	try {
		return createRequire(import.meta.url)("@microsoft/teams.apps/package.json").version ?? "unknown";
	} catch {
		return "unknown";
	}
}
function resolveOpenClawVersion() {
	try {
		return getMSTeamsRuntime().version;
	} catch {
		return "unknown";
	}
}
/**
* Build a combined User-Agent string that preserves the Teams SDK identity
* and appends the OpenClaw version.
*
* Format: "teams.ts[apps]/<sdk-version> OpenClaw/<openclaw-version>"
* Example: "teams.ts[apps]/2.0.5 OpenClaw/2026.3.22"
*
* This lets the Teams backend track SDK usage while also identifying the
* host application.
*/
function buildUserAgent() {
	if (cachedUserAgent) return cachedUserAgent;
	cachedUserAgent = `teams.ts[apps]/${resolveTeamsSdkVersion()} OpenClaw/${resolveOpenClawVersion()}`;
	return cachedUserAgent;
}
/**
* User-Agent fragment for the Teams SDK App's client. The SDK's Client.clone
* merges this with its own `teams.ts[apps]/<sdk-version>` identifier, so we
* only contribute the OpenClaw piece — passing the full `buildUserAgent()`
* would double-print the SDK token.
*
* Format: "OpenClaw/<openclaw-version>"
*/
function buildOpenClawUserAgentFragment() {
	return `OpenClaw/${resolveOpenClawVersion()}`;
}
function ensureUserAgentHeader(headers) {
	const nextHeaders = new Headers(headers);
	if (!nextHeaders.has("User-Agent")) nextHeaders.set("User-Agent", buildUserAgent());
	return nextHeaders;
}
//#endregion
//#region extensions/msteams/src/sdk.ts
const AZURE_IDENTITY_MODULE = "@azure/identity";
const loadAzureIdentity = createLazyRuntimeModule(() => import(AZURE_IDENTITY_MODULE));
const loadSdkModules = createLazyRuntimeModule(() => Promise.all([import("./dist-mGQDDpcc.js").then((m) => /* @__PURE__ */ __toESM(m.default, 1)), import("./dist-CNu2W2ol.js").then((m) => /* @__PURE__ */ __toESM(m.default, 1))]).then(([apps, api]) => ({
	App: apps.App,
	ExpressAdapter: apps.ExpressAdapter,
	cloudFromName: api.cloudFromName
})));
/**
* Lazily construct an ExpressAdapter that the Teams SDK App can register its
* routes on. The dynamic import keeps the SDK bundle off the hot startup path
* when msteams is disabled; the structural return type matches what
* `loadMSTeamsSdkWithAuth` accepts as its `httpServerAdapter` option.
*/
async function createMSTeamsExpressAdapter(serverOrApp) {
	const { ExpressAdapter } = await loadSdkModules();
	return new ExpressAdapter(serverOrApp);
}
/**
* Create a Teams SDK App instance from credentials. The App manages token
* acquisition, JWT validation, and the HTTP server lifecycle.
*
* Auth modes:
* - Secret: clientId + clientSecret → MSAL client credential flow (SDK built-in)
* - Managed identity: clientId + managedIdentityClientId → SDK built-in MI support
* - Certificate: clientId + custom token provider via @azure/identity
*/
async function createMSTeamsApp(creds, options) {
	const { App, cloudFromName } = await loadSdkModules();
	const privateQaRuntime = resolveMSTeamsPrivateQaRuntime();
	const cloud = options?.cloud ?? "Public";
	const serviceUrl = options?.serviceUrl ? normalizeBotFrameworkServiceUrl(options.serviceUrl) : void 0;
	const appOptions = {
		client: privateQaRuntime?.client ?? options?.httpClient ?? {
			headers: { "User-Agent": buildOpenClawUserAgentFragment() },
			timeout: 3e4
		},
		...privateQaRuntime ? {
			clientSecret: "",
			skipAuth: privateQaRuntime.skipAuth,
			token: privateQaRuntime.token
		} : {},
		...options?.httpServerAdapter ? { httpServerAdapter: options.httpServerAdapter } : {},
		...options?.messagingEndpoint ? { messagingEndpoint: options.messagingEndpoint } : {},
		cloud: cloudFromName(cloud),
		...serviceUrl ? { serviceUrl } : {},
		...options?.oauthDefaultConnectionName ? { oauth: { defaultConnectionName: options.oauthDefaultConnectionName } } : {}
	};
	if (creds.type === "federated") return await createFederatedApp(creds, App, appOptions);
	return new App({
		clientId: creds.appId,
		clientSecret: creds.appPassword,
		tenantId: creds.tenantId,
		...appOptions
	});
}
async function createFederatedApp(creds, App, appOptions) {
	if (creds.useManagedIdentity) return new App({
		clientId: creds.appId,
		tenantId: creds.tenantId,
		managedIdentityClientId: creds.managedIdentityClientId ?? "system",
		...appOptions
	});
	if (!creds.certificatePath) throw new Error("Federated credentials require either a certificate path or managed identity.");
	let privateKey;
	try {
		privateKey = await readSecretFile(creds.certificatePath, "Microsoft Teams certificate");
	} catch (err) {
		const msg = coerceErrorMessage(err);
		throw new Error(`Failed to read certificate file at '${creds.certificatePath}': ${msg}`, { cause: err });
	}
	return createCertificateApp(creds, privateKey, App, appOptions);
}
function createCertificateApp(creds, privateKey, App, appOptions) {
	let credentialPromise = null;
	const getCredential = async () => {
		if (!credentialPromise) credentialPromise = loadAzureIdentity().then((az) => new az.ClientCertificateCredential(creds.tenantId, creds.appId, { certificate: privateKey }));
		return credentialPromise;
	};
	const tokenProvider = async (scope) => {
		const token = await (await getCredential()).getToken(scope);
		if (!token?.token) throw new Error("Failed to acquire token via certificate credential.");
		return token.token;
	};
	return new App({
		clientId: creds.appId,
		tenantId: creds.tenantId,
		token: tokenProvider,
		...appOptions
	});
}
/**
* Build a token provider that uses the Teams SDK App's public tokenManager
* for token acquisition.
*/
function createMSTeamsTokenProvider(app) {
	const tokenToString = (token) => {
		if (token == null) return "";
		return token.toString();
	};
	return { async getAccessToken(scope) {
		if (scope.includes("graph.microsoft.com") || scope.includes("graph.microsoft.us") || scope.includes("microsoftgraph.chinacloudapi.cn")) {
			if (app.cloud?.graphScope?.includes("microsoftgraph.chinacloudapi.cn")) throw new Error("Microsoft Teams Graph operations are not supported for channels.msteams.cloud=China until Graph requests are routed through the Azure China Graph endpoint.");
			return tokenToString(await app.tokenManager.getGraphToken());
		}
		return tokenToString(await app.tokenManager.getBotToken());
	} };
}
async function loadMSTeamsSdkWithAuth(creds, options) {
	return { app: await createMSTeamsApp(creds, options) };
}
//#endregion
//#region extensions/msteams/src/token-response.ts
function readAccessToken(value) {
	if (typeof value === "string") return value;
	if (value && typeof value === "object") {
		const token = value.accessToken ?? value.token;
		return typeof token === "string" ? token : null;
	}
	return null;
}
//#endregion
//#region extensions/msteams/src/token.ts
function resolveAuthType(cfg) {
	const fromCfg = cfg?.authType;
	if (fromCfg === "secret" || fromCfg === "federated") return fromCfg;
	if (process.env.MSTEAMS_AUTH_TYPE === "federated") return "federated";
	return "secret";
}
function resolveFederatedPath(configValue, envValue) {
	if (normalizeOptionalString(configValue)) return configValue;
	if (normalizeOptionalString(envValue)) return envValue;
}
function hasConfiguredMSTeamsCredentials(cfg) {
	const authType = resolveAuthType(cfg);
	const hasAppId = Boolean(normalizeSecretInputString(cfg?.appId) || normalizeSecretInputString(process.env.MSTEAMS_APP_ID));
	const hasTenantId = Boolean(normalizeSecretInputString(cfg?.tenantId) || normalizeSecretInputString(process.env.MSTEAMS_TENANT_ID));
	if (authType === "federated") {
		const hasCert = Boolean(resolveFederatedPath(cfg?.certificatePath, process.env.MSTEAMS_CERTIFICATE_PATH));
		const hasManagedIdentity = cfg?.useManagedIdentity ?? process.env.MSTEAMS_USE_MANAGED_IDENTITY === "true";
		return hasAppId && hasTenantId && (hasCert || hasManagedIdentity);
	}
	return Boolean(normalizeSecretInputString(cfg?.appId) && hasConfiguredSecretInput(cfg?.appPassword) && normalizeSecretInputString(cfg?.tenantId));
}
function resolveMSTeamsCredentials(cfg) {
	const authType = resolveAuthType(cfg);
	const appId = normalizeSecretInputString(cfg?.appId) || normalizeSecretInputString(process.env.MSTEAMS_APP_ID);
	const tenantId = normalizeSecretInputString(cfg?.tenantId) || normalizeSecretInputString(process.env.MSTEAMS_TENANT_ID);
	if (!appId || !tenantId) return;
	if (authType === "federated") {
		const certificatePath = resolveFederatedPath(cfg?.certificatePath, process.env.MSTEAMS_CERTIFICATE_PATH);
		const certificateThumbprint = cfg?.certificateThumbprint || process.env.MSTEAMS_CERTIFICATE_THUMBPRINT || void 0;
		const useManagedIdentity = cfg?.useManagedIdentity ?? process.env.MSTEAMS_USE_MANAGED_IDENTITY === "true";
		const managedIdentityClientId = cfg?.managedIdentityClientId || process.env.MSTEAMS_MANAGED_IDENTITY_CLIENT_ID || void 0;
		if (!certificatePath && !useManagedIdentity) return;
		return {
			type: "federated",
			appId,
			tenantId,
			certificatePath,
			certificateThumbprint,
			useManagedIdentity: useManagedIdentity || void 0,
			managedIdentityClientId
		};
	}
	const appPassword = normalizeResolvedSecretInputString({
		value: cfg?.appPassword,
		path: "channels.msteams.appPassword"
	}) || normalizeSecretInputString(process.env.MSTEAMS_APP_PASSWORD);
	if (!appPassword) return;
	return {
		type: "secret",
		appId,
		appPassword,
		tenantId
	};
}
function loadDelegatedTokens() {
	return loadMSTeamsDelegatedTokens();
}
function saveDelegatedTokens(tokens) {
	saveMSTeamsDelegatedTokens(tokens);
}
async function resolveDelegatedAccessToken(params) {
	const tokens = loadDelegatedTokens();
	if (!tokens) return;
	if (isFutureDateTimestampMs(tokens.expiresAt)) return tokens.accessToken;
	try {
		const refreshed = await refreshMSTeamsDelegatedTokens({
			tenantId: params.tenantId,
			clientId: params.clientId,
			clientSecret: params.clientSecret,
			refreshToken: tokens.refreshToken,
			scopes: tokens.scopes
		});
		saveDelegatedTokens(refreshed);
		return refreshed.accessToken;
	} catch {
		return;
	}
}
//#endregion
//#region extensions/msteams/src/graph.ts
const GRAPH_BETA = "https://graph.microsoft.com/beta";
function normalizeQuery(value) {
	return value?.trim() ?? "";
}
function escapeOData(value) {
	return value.replace(/'/g, "''");
}
async function requestGraph(params) {
	const hasBody = params.body !== void 0;
	const { response, release } = await fetchWithSsrFGuard({
		url: `${params.root ?? "https://graph.microsoft.com/v1.0"}${params.path}`,
		init: {
			method: params.method,
			headers: {
				"User-Agent": buildUserAgent(),
				Authorization: `Bearer ${params.token}`,
				...hasBody ? { "Content-Type": "application/json" } : {},
				...params.headers
			},
			body: hasBody ? JSON.stringify(params.body) : void 0
		},
		auditContext: "msteams.graph",
		timeoutMs: resolveMSTeamsRequestTimeoutMs(params.deadline)
	});
	let releaseInFinally = true;
	try {
		if (!response.ok) throw await createMSTeamsHttpError(response, `${params.errorPrefix ?? "Graph"} ${params.path} failed`);
		releaseInFinally = false;
		return responseWithRelease(response, release);
	} finally {
		if (releaseInFinally) await release();
	}
}
async function readOptionalGraphJson(res, label) {
	if (res.status === 204 || res.headers.get("content-length") === "0") return;
	return await readProviderJsonResponse(res, label);
}
async function mutateGraphJson(params) {
	const errorPrefix = `Graph${params.beta ? " beta" : ""} ${params.method}`;
	return readOptionalGraphJson(await requestGraph({
		token: params.token,
		path: params.path,
		method: params.method,
		body: params.body,
		root: params.beta ? GRAPH_BETA : void 0,
		errorPrefix
	}), `${errorPrefix} ${params.path} failed`);
}
async function fetchGraphJson(params) {
	return await readOptionalGraphJson(await requestGraph({
		token: params.token,
		path: params.path,
		headers: params.headers,
		deadline: params.deadline
	}), `Graph ${params.path} failed`);
}
/**
* Fetch JSON from an absolute Graph API URL (for example @odata.nextLink
* pagination URLs) without prepending GRAPH_ROOT.
*/
async function fetchGraphAbsoluteUrl(params) {
	const { response, release } = await fetchWithSsrFGuard({
		url: params.url,
		init: { headers: {
			"User-Agent": buildUserAgent(),
			Authorization: `Bearer ${params.token}`,
			...params.headers
		} },
		auditContext: "msteams.graph.absolute",
		timeoutMs: MSTEAMS_REQUEST_TIMEOUT_MS
	});
	try {
		if (!response.ok) throw await createMSTeamsHttpError(response, `Graph ${params.url} failed`);
		return await readProviderJsonResponse(response, `Graph ${params.url} failed`);
	} finally {
		await release();
	}
}
/**
* Fetch all pages of a Graph API collection, following @odata.nextLink.
* Optionally stop early when `findOne` matches an item.
*/
async function fetchAllGraphPages(params) {
	const maxPages = params.maxPages ?? 50;
	const items = [];
	let nextPath = params.path;
	for (let page = 0; page < maxPages && nextPath; page++) {
		const res = await fetchGraphJson({
			token: params.token,
			path: nextPath,
			headers: params.headers
		});
		const pageItems = res.value ?? [];
		if (params.findOne) {
			const match = pageItems.find(params.findOne);
			if (match) {
				items.push(...pageItems);
				return {
					items,
					truncated: false,
					found: match
				};
			}
		}
		items.push(...pageItems);
		const rawNext = res["@odata.nextLink"];
		if (rawNext) nextPath = rawNext.replace("https://graph.microsoft.com/v1.0", "").replace("https://graph.microsoft.com/beta", "");
		else nextPath = void 0;
	}
	return {
		items,
		truncated: Boolean(nextPath)
	};
}
async function resolveGraphToken(cfg, options) {
	const msteamsCfg = cfg?.channels?.msteams;
	const creds = resolveMSTeamsCredentials(msteamsCfg);
	if (!creds) throw new Error("MS Teams credentials missing");
	if (msteamsCfg?.cloud === "China") throw new Error("Microsoft Teams Graph operations are not supported for channels.msteams.cloud=China until Graph requests are routed through the Azure China Graph endpoint.");
	if (options?.preferDelegated && msteamsCfg?.delegatedAuth?.enabled && creds.type === "secret") {
		const delegated = await resolveDelegatedAccessToken({
			tenantId: creds.tenantId,
			clientId: creds.appId,
			clientSecret: creds.appPassword
		});
		if (delegated) return delegated;
	}
	const { app } = await loadMSTeamsSdkWithAuth(creds, resolveMSTeamsSdkCloudOptions(msteamsCfg));
	const tokenProvider = createMSTeamsTokenProvider(app);
	const accessToken = readAccessToken(await withMSTeamsRequestDeadline({
		label: "MS Teams Graph token",
		work: () => tokenProvider.getAccessToken("https://graph.microsoft.com")
	}));
	if (!accessToken) throw new Error("MS Teams graph token unavailable");
	return accessToken;
}
async function listTeamsByName(token, query) {
	return (await listTeamsByNameWithPageInfo(token, query)).items;
}
async function listTeamsByNameWithPageInfo(token, query) {
	const filter = `resourceProvisioningOptions/Any(x:x eq 'Team') and startsWith(displayName,'${escapeOData(query)}')`;
	return await fetchAllGraphPages({
		token,
		path: `/groups?$filter=${encodeURIComponent(filter)}&$select=id,displayName`
	});
}
async function deleteGraphRequest(params) {
	await (await requestGraph({
		token: params.token,
		path: params.path,
		method: "DELETE",
		errorPrefix: "Graph DELETE"
	})).body?.cancel().catch(() => void 0);
}
async function listChannelsForTeam(token, teamId) {
	return (await listChannelsForTeamWithPageInfo(token, teamId)).items;
}
async function listChannelsForTeamWithPageInfo(token, teamId) {
	return await fetchAllGraphPages({
		token,
		path: `/teams/${encodeURIComponent(teamId)}/channels?$select=id,displayName`
	});
}
//#endregion
//#region extensions/msteams/src/graph-users.ts
async function searchGraphUsers(params) {
	const query = params.query.trim();
	if (!query) return [];
	if (query.includes("@")) {
		const escaped = escapeOData(query);
		const filter = `(mail eq '${escaped}' or userPrincipalName eq '${escaped}')`;
		const path = `/users?$filter=${encodeURIComponent(filter)}&$select=id,displayName,mail,userPrincipalName`;
		return (await fetchGraphJson({
			token: params.token,
			path
		})).value ?? [];
	}
	const top = typeof params.top === "number" && params.top > 0 ? params.top : 10;
	const path = `/users?$search=${encodeURIComponent(`"displayName:${query}"`)}&$select=id,displayName,mail,userPrincipalName&$top=${top}`;
	return (await fetchGraphJson({
		token: params.token,
		path,
		headers: { ConsistencyLevel: "eventual" }
	})).value ?? [];
}
async function findGraphUsersByExactIdentity(params) {
	const query = params.query.trim();
	if (!query) return {
		items: [],
		truncated: false
	};
	const escaped = escapeOData(query);
	const filter = `(displayName eq '${escaped}' or mail eq '${escaped}' or userPrincipalName eq '${escaped}')`;
	const path = `/users?$filter=${encodeURIComponent(filter)}&\$select=id,displayName,mail,userPrincipalName`;
	return await fetchAllGraphPages({
		token: params.token,
		path
	});
}
//#endregion
export { resolveMSTeamsRequestTimeoutMs as $, validateMSTeamsProactiveServiceUrlBoundary as A, isLikelyImageAttachment as B, ensureUserAgentHeader as C, normalizeBotFrameworkServiceUrl as D, isAllowedBotFrameworkServiceUrl as E, encodeGraphShareId as F, resolveMSTeamsMediaKind as G, isUrlAllowed as H, extractHtmlFromAttachment as I, safeFetchWithPolicy as J, resolveMediaSsrfPolicy as K, extractInlineImageCandidates as L, GRAPH_ROOT as M, IMG_SRC_RE as N, tryNormalizeBotFrameworkServiceUrl as O, applyAuthorizationHeaderForUrl as P, createMSTeamsInboundDeadline as Q, isAdvertisedFileAttachment as R, buildUserAgent as S, describeBotFrameworkServiceUrlHost as T, normalizeContentType as U, isRedirectStatus as V, resolveAttachmentFetchPolicy as W, tryBuildGraphSharesUrlForSharedLink as X, safeHostForUrl as Y, MSTEAMS_REQUEST_TIMEOUT_MS as Z, saveDelegatedTokens as _, fetchGraphAbsoluteUrl as a, normalizeMSTeamsConversationId as at, createMSTeamsTokenProvider as b, listChannelsForTeamWithPageInfo as c, wasMSTeamsBotMentioned as ct, mutateGraphJson as d, resolveMSTeamsSharePointUploadTimeoutMs as et, normalizeQuery as f, resolveMSTeamsCredentials as g, loadDelegatedTokens as h, escapeOData as i, extractMSTeamsQuoteInfo as it, ATTACHMENT_TAG_RE as j, resolveMSTeamsSdkCloudOptions as k, listTeamsByName as l, hasConfiguredMSTeamsCredentials as m, searchGraphUsers as n, withMSTeamsRequestDeadline as nt, fetchGraphJson as o, parseMSTeamsActivityTimestamp as ot, resolveGraphToken as p, resolveRequestUrl as q, deleteGraphRequest as r, extractMSTeamsConversationMessageId as rt, listChannelsForTeam as s, stripMSTeamsMentionTags as st, findGraphUsersByExactIdentity as t, withMSTeamsAbortableRequestTimeout as tt, listTeamsByNameWithPageInfo as u, readAccessToken as v, resolveMSTeamsPrivateQaRuntime as w, loadMSTeamsSdkWithAuth as x, createMSTeamsExpressAdapter as y, isDownloadableAttachment as z };
