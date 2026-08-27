import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { F as resolveTimerTimeoutMs } from "./number-coercion-CLj0HTDM.js";
import { f as readResponseWithLimit } from "./http-body-DthsuKdw.js";
import { i as logWarn } from "./logger-D4iLuGk3.js";
import { i as fetchWithSsrFGuard } from "./fetch-guard-Dt4YqBT2.js";
import { n as estimateBase64DecodedBytes, t as canonicalizeBase64 } from "./base64-Vw7DZYSc.js";
import { d as normalizeMimeType, n as detectMime } from "./mime-Hm4eS2i0.js";
import { i as convertHeicToJpeg } from "./image-ops-CNJmjS8j.js";
import "./media-services-B8MVUzbz.js";
import { t as parseMediaContentLength } from "./content-length-CHOuQ9D3.js";
import { t as extractPdfContent } from "./pdf-extract-Cy8YafHg.js";
import { n as classifyAttachmentBytes } from "./attachment-classify-f0aBQf2E.js";
//#region src/media/input-files.ts
/** Default MIME allowlist for input_image sources. */
const DEFAULT_INPUT_IMAGE_MIMES = [
	"image/jpeg",
	"image/png",
	"image/gif",
	"image/webp",
	"image/heic",
	"image/heif"
];
/** Default MIME allowlist for input_file text/PDF extraction. */
const DEFAULT_INPUT_FILE_MIMES = [
	"text/plain",
	"text/markdown",
	"text/html",
	"text/csv",
	"application/json",
	"application/pdf"
];
/** Default decoded-byte cap for input_image payloads. */
const DEFAULT_INPUT_IMAGE_MAX_BYTES = 10 * 1024 * 1024;
/** Default decoded-byte cap for input_file payloads. */
const DEFAULT_INPUT_FILE_MAX_BYTES = 5 * 1024 * 1024;
/** Default maximum model-visible characters emitted from input_file text. */
const DEFAULT_INPUT_FILE_MAX_CHARS = 6e4;
/** Default timeout for guarded input source URL fetches. */
const DEFAULT_INPUT_TIMEOUT_MS = 1e4;
/** Default PDF page cap for input_file extraction. */
const DEFAULT_INPUT_PDF_MAX_PAGES = 4;
/** Default PDF raster pixel cap for extracted input_file images. */
const DEFAULT_INPUT_PDF_MAX_PIXELS = 4e6;
/** Default text threshold before PDF extraction keeps text-only output. */
const DEFAULT_INPUT_PDF_MIN_TEXT_CHARS = 200;
const NORMALIZED_INPUT_IMAGE_MIME = "image/jpeg";
const HEIC_INPUT_IMAGE_MIMES = /* @__PURE__ */ new Set(["image/heic", "image/heif"]);
function rejectOversizedBase64Payload(params) {
	const estimated = estimateBase64DecodedBytes(params.data);
	if (estimated > params.maxBytes) throw new Error(`${params.label} too large: ${estimated} bytes (limit: ${params.maxBytes} bytes)`);
}
/** Parses a Content-Type header into normalized MIME and optional charset values. */
function parseContentType(value) {
	if (!value) return {};
	const parts = value.split(";").map((part) => part.trim());
	return {
		mimeType: normalizeMimeType(parts[0]),
		charset: parts.map((part) => normalizeOptionalString(part.match(/^charset=(.+)$/i)?.[1])).find((part) => part && part.length > 0)
	};
}
/** Converts configured MIME lists into a normalized allowlist, using fallback defaults when empty. */
function normalizeMimeList(values, fallback) {
	const input = values && values.length > 0 ? values : fallback;
	return new Set(input.flatMap((value) => normalizeMimeType(value) ?? []));
}
/** Resolves input_file extraction limits from partial config and stable defaults. */
function resolveInputFileLimits(config) {
	return {
		allowUrl: config?.allowUrl ?? true,
		allowedMimes: normalizeMimeList(config?.allowedMimes, DEFAULT_INPUT_FILE_MIMES),
		maxBytes: config?.maxBytes ?? DEFAULT_INPUT_FILE_MAX_BYTES,
		maxChars: config?.maxChars ?? DEFAULT_INPUT_FILE_MAX_CHARS,
		maxRedirects: config?.maxRedirects ?? 3,
		timeoutMs: config?.timeoutMs ?? 1e4,
		pdf: {
			maxPages: config?.pdf?.maxPages ?? DEFAULT_INPUT_PDF_MAX_PAGES,
			maxPixels: config?.pdf?.maxPixels ?? DEFAULT_INPUT_PDF_MAX_PIXELS,
			minTextChars: config?.pdf?.minTextChars ?? DEFAULT_INPUT_PDF_MIN_TEXT_CHARS
		}
	};
}
/** Fetches an input source URL through SSRF, redirect, timeout, and byte-limit guards. */
async function fetchWithGuard(params) {
	const { response, release } = await fetchWithSsrFGuard({
		url: params.url,
		maxRedirects: params.maxRedirects,
		timeoutMs: params.timeoutMs,
		policy: params.policy,
		auditContext: params.auditContext,
		init: { headers: { "User-Agent": "OpenClaw-Gateway/1.0" } }
	});
	try {
		if (!response.ok) {
			await discardIgnoredResponseBody(response);
			throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
		}
		let contentLength;
		try {
			contentLength = parseMediaContentLength(response.headers.get("content-length"));
		} catch (err) {
			await discardIgnoredResponseBody(response);
			throw err;
		}
		if (contentLength !== null && contentLength > params.maxBytes) {
			await discardIgnoredResponseBody(response);
			throw new Error(`Content too large: ${contentLength} bytes (limit: ${params.maxBytes} bytes)`);
		}
		return {
			buffer: await readResponseWithLimit(response, params.maxBytes),
			contentType: response.headers.get("content-type") ?? void 0
		};
	} finally {
		await release();
	}
}
async function discardIgnoredResponseBody(response) {
	const body = response.body;
	if (!body) return;
	try {
		await body.cancel();
	} catch {}
}
function decodeTextContent(buffer, charset) {
	const encoding = normalizeOptionalLowercaseString(charset) || "utf-8";
	try {
		return new TextDecoder(encoding).decode(buffer);
	} catch {
		return new TextDecoder("utf-8").decode(buffer);
	}
}
function clampText(text, maxChars) {
	if (text.length <= maxChars) return text;
	return truncateUtf16Safe(text, maxChars);
}
function withInputFileTimeout(params) {
	const timeoutMs = resolveTimerTimeoutMs(params.timeoutMs, 1);
	let timeout;
	const timedOut = new Promise((_, reject) => {
		timeout = setTimeout(() => {
			reject(/* @__PURE__ */ new Error(`${params.label} timed out after ${timeoutMs}ms`));
		}, timeoutMs);
	});
	return Promise.race([params.task, timedOut]).finally(() => {
		if (timeout) clearTimeout(timeout);
	});
}
async function normalizeInputImage(params) {
	const declaredMime = normalizeMimeType(params.mimeType) ?? "application/octet-stream";
	const detectedMime = normalizeMimeType(await detectMime({
		buffer: params.buffer,
		headerMime: params.mimeType
	}));
	if (declaredMime.startsWith("image/") && detectedMime && !detectedMime.startsWith("image/")) throw new Error(`Unsupported image MIME type: ${detectedMime}`);
	const sourceMime = (detectedMime?.startsWith("image/") ? detectedMime : declaredMime).replace(/^(image\/hei[cf])-sequence$/, "$1");
	if (!params.limits.allowedMimes.has(sourceMime)) throw new Error(`Unsupported image MIME type: ${sourceMime}`);
	if (!HEIC_INPUT_IMAGE_MIMES.has(sourceMime)) return {
		type: "image",
		data: params.buffer.toString("base64"),
		mimeType: sourceMime
	};
	const normalizedBuffer = await convertHeicToJpeg(params.buffer);
	if (normalizedBuffer.byteLength > params.limits.maxBytes) throw new Error(`Image too large after HEIC conversion: ${normalizedBuffer.byteLength} bytes (limit: ${params.limits.maxBytes} bytes)`);
	return {
		type: "image",
		data: normalizedBuffer.toString("base64"),
		mimeType: NORMALIZED_INPUT_IMAGE_MIME
	};
}
/** Extracts and normalizes an input_image source from base64 or guarded URL input. */
async function extractImageContentFromSource(source, limits) {
	if (source.type === "base64") {
		rejectOversizedBase64Payload({
			data: source.data,
			maxBytes: limits.maxBytes,
			label: "Image"
		});
		const canonicalData = canonicalizeBase64(source.data);
		if (!canonicalData) throw new Error("input_image base64 source has invalid 'data' field");
		const buffer = Buffer.from(canonicalData, "base64");
		if (buffer.byteLength > limits.maxBytes) throw new Error(`Image too large: ${buffer.byteLength} bytes (limit: ${limits.maxBytes} bytes)`);
		return await normalizeInputImage({
			buffer,
			mimeType: normalizeMimeType(source.mediaType) ?? "image/png",
			limits
		});
	}
	if (source.type === "url") {
		if (!limits.allowUrl) throw new Error("input_image URL sources are disabled by config");
		const result = await fetchWithGuard({
			url: source.url,
			maxBytes: limits.maxBytes,
			timeoutMs: limits.timeoutMs,
			maxRedirects: limits.maxRedirects,
			policy: {
				allowPrivateNetwork: false,
				hostnameAllowlist: limits.urlAllowlist
			},
			auditContext: "openresponses.input_image"
		});
		return await normalizeInputImage({
			buffer: result.buffer,
			mimeType: parseContentType(result.contentType).mimeType,
			limits
		});
	}
	throw new Error(`Unsupported input_image source type: ${source.type}`);
}
/** Extracts model-visible text and images from an input_file source after MIME validation. */
async function extractFileContentFromSource(params) {
	const { source, limits } = params;
	const filename = source.filename || "file";
	let buffer;
	let mimeType;
	let charset;
	if (source.type === "base64") {
		rejectOversizedBase64Payload({
			data: source.data,
			maxBytes: limits.maxBytes,
			label: "File"
		});
		const canonicalData = canonicalizeBase64(source.data);
		if (!canonicalData) throw new Error("input_file base64 source has invalid 'data' field");
		const parsed = parseContentType(source.mediaType);
		mimeType = parsed.mimeType;
		charset = parsed.charset;
		buffer = Buffer.from(canonicalData, "base64");
	} else {
		if (!limits.allowUrl) throw new Error("input_file URL sources are disabled by config");
		const result = await fetchWithGuard({
			url: source.url,
			maxBytes: limits.maxBytes,
			timeoutMs: limits.timeoutMs,
			maxRedirects: limits.maxRedirects,
			policy: {
				allowPrivateNetwork: false,
				hostnameAllowlist: limits.urlAllowlist
			},
			auditContext: "openresponses.input_file"
		});
		const parsed = parseContentType(result.contentType);
		mimeType = parsed.mimeType;
		charset = parsed.charset;
		buffer = result.buffer;
	}
	if (buffer.byteLength > limits.maxBytes) throw new Error(`File too large: ${buffer.byteLength} bytes (limit: ${limits.maxBytes} bytes)`);
	const classification = params.classification ?? await classifyAttachmentBytes({
		buffer,
		declaredMime: mimeType
	});
	mimeType = classification.mime;
	charset = classification.charset ?? charset;
	if (!mimeType) throw new Error("input_file missing media type");
	if (!limits.allowedMimes.has(mimeType)) throw new Error(`Unsupported file MIME type: ${mimeType}`);
	if (mimeType === "application/pdf") {
		const extracted = await withInputFileTimeout({
			label: "PDF extraction",
			timeoutMs: limits.timeoutMs,
			task: extractPdfContent({
				buffer,
				maxPages: limits.pdf.maxPages,
				maxPixels: limits.pdf.maxPixels,
				minTextChars: limits.pdf.minTextChars,
				...params.config ? { config: params.config } : {},
				onImageExtractionError: (err) => {
					logWarn(`media: PDF image extraction skipped, ${String(err)}`);
				}
			})
		});
		return {
			filename,
			text: extracted.text ? clampText(extracted.text, limits.maxChars) : "",
			images: extracted.images.length > 0 ? extracted.images : void 0
		};
	}
	return {
		filename,
		text: clampText(decodeTextContent(buffer, charset), limits.maxChars)
	};
}
//#endregion
export { extractImageContentFromSource as a, extractFileContentFromSource as i, DEFAULT_INPUT_IMAGE_MIMES as n, normalizeMimeList as o, DEFAULT_INPUT_TIMEOUT_MS as r, resolveInputFileLimits as s, DEFAULT_INPUT_IMAGE_MAX_BYTES as t };
