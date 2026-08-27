import { D as resolveExpiresAtMsFromDurationMs } from "./number-coercion-CLj0HTDM.js";
import { t as safeEqualSecret } from "./secret-equal-DRsL8lKD.js";
import { d as normalizeMimeType, u as mimeTypeFromFilePath } from "./mime-Hm4eS2i0.js";
import "./number-runtime-Cy4drVnh.js";
import { n as createHostedOutboundMediaStore, t as buildHostedOutboundMediaResponseHeaders } from "./outbound-media-Be17J8p1.js";
import "./media-mime-DQ4Ibr5o.js";
import "./security-runtime-CYUTzVOk.js";
import { t as createPluginRuntimeStore } from "./runtime-store-CjjjpvHZ.js";
import "./webhook-ingress-IarruVNi.js";
import { a as createWebhookInFlightLimiter } from "./webhook-request-guards-BYzmIdMp.js";
import { i as toSynologyHostedMediaStoreRoutePath, n as resolveSynologyHostedMediaRoute, t as SYNOLOGY_HOSTED_MEDIA_TOKEN_PARAM_PREFIX } from "./hosted-media-route-D-eaLrIJ.js";
import { createHash } from "node:crypto";
//#region extensions/synology-chat/src/runtime.ts
const { setRuntime: setSynologyRuntime, getRuntime: getSynologyRuntime } = createPluginRuntimeStore({
	pluginId: "synology-chat",
	errorMessage: "Synology Chat runtime not initialized - plugin not registered"
});
//#endregion
//#region extensions/synology-chat/src/outbound-media.ts
const SYNOLOGY_OUTBOUND_MEDIA_TTL_MS = 10 * 6e4;
const SYNOLOGY_OUTBOUND_MEDIA_MAX_BYTES = 32 * 1024 * 1024;
const SYNOLOGY_OUTBOUND_MEDIA_MAX_TOTAL_BYTES = 128 * 1024 * 1024;
const SYNOLOGY_OUTBOUND_MEDIA_MAX_ENTRIES = 16;
const SYNOLOGY_OUTBOUND_MEDIA_MAX_CHUNK_ROWS = 4096;
const SYNOLOGY_OUTBOUND_MEDIA_ID_RE = /^[a-f0-9]{24}$/;
const SYNOLOGY_OUTBOUND_MEDIA_PREPARE_TIMEOUT_MS = 6e4;
const SYNOLOGY_OUTBOUND_MEDIA_MAX_PREPARATIONS = 2;
const SYNOLOGY_OUTBOUND_MEDIA_MAX_SERVES = 4;
const SYNOLOGY_OUTBOUND_MEDIA_SERVE_TIMEOUT_MS = 2 * 6e4;
const SYNOLOGY_OUTBOUND_MEDIA_POST_EXPIRY_RETENTION_MS = 18e4;
const SYNOLOGY_OUTBOUND_MEDIA_SERVED_BYTES_WINDOW_MS = 6e4;
const SYNOLOGY_OUTBOUND_MEDIA_MAX_SERVED_BYTES_PER_WINDOW = 128 * 1024 * 1024;
const SYNOLOGY_OUTBOUND_MEDIA_MAX_BUDGET_ACCOUNTS = 128;
const ACTIVE_CONTENT_TYPES = /* @__PURE__ */ new Set([
	"image/svg+xml",
	"text/html",
	"application/xhtml+xml",
	"application/xml",
	"text/xml"
]);
const OUTBOUND_MEDIA_NAMESPACE = "hosted-outbound-media";
const OUTBOUND_MEDIA_CHUNKS_NAMESPACE = "hosted-outbound-media-chunks";
const preparationLimiter = createWebhookInFlightLimiter({
	maxInFlightPerKey: SYNOLOGY_OUTBOUND_MEDIA_MAX_PREPARATIONS,
	maxTrackedKeys: 128
});
const servingLimiter = createWebhookInFlightLimiter({
	maxInFlightPerKey: SYNOLOGY_OUTBOUND_MEDIA_MAX_SERVES,
	maxTrackedKeys: 128
});
const hostedMediaStores = /* @__PURE__ */ new Map();
const servedByteWindows = /* @__PURE__ */ new Map();
let hostedMediaRuntime;
function reserveServedBytes(accountId, byteLength, now = Date.now()) {
	const existing = servedByteWindows.get(accountId);
	const active = existing && now - existing.startedAt < SYNOLOGY_OUTBOUND_MEDIA_SERVED_BYTES_WINDOW_MS ? existing : {
		startedAt: now,
		bytes: 0
	};
	if (active.bytes + byteLength > SYNOLOGY_OUTBOUND_MEDIA_MAX_SERVED_BYTES_PER_WINDOW) return;
	servedByteWindows.delete(accountId);
	servedByteWindows.set(accountId, {
		startedAt: active.startedAt,
		bytes: active.bytes + byteLength
	});
	while (servedByteWindows.size > SYNOLOGY_OUTBOUND_MEDIA_MAX_BUDGET_ACCOUNTS) {
		const oldest = servedByteWindows.keys().next().value;
		if (oldest === void 0) break;
		servedByteWindows.delete(oldest);
	}
	return () => {
		const current = servedByteWindows.get(accountId);
		if (!current || current.startedAt !== active.startedAt) return;
		current.bytes = Math.max(0, current.bytes - byteLength);
		if (current.bytes === 0) servedByteWindows.delete(accountId);
	};
}
function holdServingLeaseUntilResponseDone(res, accountId) {
	let released = false;
	const release = () => {
		if (released) return;
		released = true;
		clearTimeout(timeout);
		res.off("finish", release);
		res.off("close", release);
		servingLimiter.release(accountId);
	};
	const timeout = setTimeout(() => {
		if (!res.headersSent) {
			res.statusCode = 504;
			res.end("Attachment response timed out");
		} else res.destroy();
		release();
	}, SYNOLOGY_OUTBOUND_MEDIA_SERVE_TIMEOUT_MS);
	timeout.unref?.();
	res.once("finish", release);
	res.once("close", release);
	return {
		isActive: () => !released,
		release
	};
}
async function writeHostedMediaChunk(res, chunk) {
	if (res.destroyed) throw new Error("Synology Chat attachment response closed before completion.");
	if (res.write(chunk)) return;
	await new Promise((resolve, reject) => {
		const cleanup = () => {
			res.off("drain", onDrain);
			res.off("close", onClose);
		};
		const onDrain = () => {
			cleanup();
			resolve();
		};
		const onClose = () => {
			cleanup();
			reject(/* @__PURE__ */ new Error("Synology Chat attachment response closed before completion."));
		};
		res.once("drain", onDrain);
		res.once("close", onClose);
		if (res.destroyed) onClose();
	});
}
function createHostedMediaStore(accountId) {
	const runtime = getSynologyRuntime();
	const accountScope = createHash("sha256").update(accountId).digest("hex").slice(0, 16);
	return createHostedOutboundMediaStore({
		metadataStore: runtime.state.openKeyedStore({
			namespace: `${OUTBOUND_MEDIA_NAMESPACE}-${accountScope}`,
			maxEntries: SYNOLOGY_OUTBOUND_MEDIA_MAX_ENTRIES,
			overflowPolicy: "reject-new"
		}),
		chunkStore: runtime.state.openKeyedStore({
			namespace: `${OUTBOUND_MEDIA_CHUNKS_NAMESPACE}-${accountScope}`,
			maxEntries: SYNOLOGY_OUTBOUND_MEDIA_MAX_CHUNK_ROWS,
			overflowPolicy: "reject-new"
		}),
		ttlMs: SYNOLOGY_OUTBOUND_MEDIA_TTL_MS,
		maxEntries: SYNOLOGY_OUTBOUND_MEDIA_MAX_ENTRIES,
		maxChunkRows: SYNOLOGY_OUTBOUND_MEDIA_MAX_CHUNK_ROWS,
		maxTotalBytes: SYNOLOGY_OUTBOUND_MEDIA_MAX_TOTAL_BYTES,
		postExpiryRetentionMs: SYNOLOGY_OUTBOUND_MEDIA_POST_EXPIRY_RETENTION_MS,
		overflowPolicy: "reject-new",
		resolveExpiresAtMs: (ttlMs) => resolveExpiresAtMsFromDurationMs(ttlMs)
	});
}
function getHostedMediaStore(accountId) {
	const runtime = getSynologyRuntime();
	if (hostedMediaRuntime !== runtime) {
		hostedMediaRuntime = runtime;
		hostedMediaStores.clear();
		preparationLimiter.clear();
		servingLimiter.clear();
		servedByteWindows.clear();
	}
	const existing = hostedMediaStores.get(accountId);
	if (existing) return existing;
	const created = createHostedMediaStore(accountId);
	hostedMediaStores.set(accountId, created);
	return created;
}
function createCleanup(store, id) {
	let cleanup;
	return async () => {
		const activeCleanup = cleanup ?? store.delete(id);
		cleanup = activeCleanup;
		try {
			await activeCleanup;
		} catch (error) {
			if (cleanup === activeCleanup) cleanup = void 0;
			throw error;
		}
	};
}
function normalizeMediaAccess(params) {
	const localRoots = params.mediaAccess?.localRoots ?? params.mediaLocalRoots;
	const readFile = params.mediaAccess?.readFile ?? params.mediaReadFile;
	const workspaceDir = params.mediaAccess?.workspaceDir;
	if (!localRoots && !readFile && !workspaceDir) return;
	return {
		...localRoots ? { localRoots } : {},
		...readFile ? { readFile } : {},
		...workspaceDir ? { workspaceDir } : {}
	};
}
function skipAsciiWhitespace(buffer, start) {
	let cursor = start;
	while (cursor < buffer.length) {
		const byte = buffer[cursor];
		if (byte !== 9 && byte !== 10 && byte !== 12 && byte !== 13 && byte !== 32) break;
		cursor += 1;
	}
	return cursor;
}
function isAsciiMarkupStart(byte) {
	return byte === 33 || byte === 63 || byte !== void 0 && (byte >= 65 && byte <= 90 || byte >= 97 && byte <= 122);
}
function readUnicodeCodePoint(buffer, offset, width, littleEndian) {
	if (width === 2) return littleEndian ? buffer.readUInt16LE(offset) : buffer.readUInt16BE(offset);
	return littleEndian ? buffer.readUInt32LE(offset) : buffer.readUInt32BE(offset);
}
function containsEncodedMarkupStart(buffer, width, littleEndian, offset = 0) {
	for (let cursor = offset; cursor + width * 2 <= buffer.length; cursor += width) if (readUnicodeCodePoint(buffer, cursor, width, littleEndian) === 60 && isAsciiMarkupStart(readUnicodeCodePoint(buffer, cursor + width, width, littleEndian))) return true;
	return false;
}
function detectBomlessUnicodeMarkupEncoding(buffer) {
	if (containsEncodedMarkupStart(buffer, 4, true)) return "utf-32le";
	if (containsEncodedMarkupStart(buffer, 4, false)) return "utf-32be";
	if (containsEncodedMarkupStart(buffer, 2, true)) return "utf-16le";
	if (containsEncodedMarkupStart(buffer, 2, false)) return "utf-16be";
}
function decodeUtf32(buffer, littleEndian, offset) {
	const chunks = [];
	let codePoints = [];
	for (let cursor = offset; cursor + 4 <= buffer.length; cursor += 4) {
		const decoded = readUnicodeCodePoint(buffer, cursor, 4, littleEndian);
		codePoints.push(decoded <= 1114111 && (decoded < 55296 || decoded > 57343) ? decoded : 65533);
		if (codePoints.length === 1024) {
			chunks.push(String.fromCodePoint(...codePoints));
			codePoints = [];
		}
	}
	if (codePoints.length > 0) chunks.push(String.fromCodePoint(...codePoints));
	return Buffer.from(chunks.join(""));
}
function decodeTextForActiveContentSniffing(buffer) {
	if (buffer[0] === 255 && buffer[1] === 254 && buffer[2] === 0 && buffer[3] === 0) return decodeUtf32(buffer, true, 4);
	if (buffer[0] === 0 && buffer[1] === 0 && buffer[2] === 254 && buffer[3] === 255) return decodeUtf32(buffer, false, 4);
	if (buffer[0] === 255 && buffer[1] === 254) return Buffer.from(buffer.subarray(2).toString("utf16le"));
	if (buffer[0] === 254 && buffer[1] === 255) return Buffer.from(new TextDecoder("utf-16be").decode(buffer.subarray(2)));
	const bomlessEncoding = detectBomlessUnicodeMarkupEncoding(buffer);
	if (bomlessEncoding === "utf-32le") return decodeUtf32(buffer, true, 0);
	if (bomlessEncoding === "utf-32be") return decodeUtf32(buffer, false, 0);
	if (bomlessEncoding === "utf-16le") return Buffer.from(buffer.toString("utf16le"));
	if (bomlessEncoding === "utf-16be") return Buffer.from(new TextDecoder("utf-16be").decode(buffer));
	return buffer;
}
function startsWithAsciiIgnoreCase(buffer, start, expected) {
	if (start + expected.length > buffer.length) return false;
	for (let index = 0; index < expected.length; index += 1) {
		const byte = buffer[start + index];
		if ((byte >= 65 && byte <= 90 ? byte + 32 : byte) !== expected.charCodeAt(index)) return false;
	}
	return true;
}
function readAsciiRootTag(buffer, start) {
	if (buffer[start] !== 60) return;
	let cursor = start + 1;
	const first = buffer[cursor];
	if (first === void 0 || !(first >= 65 && first <= 90 || first >= 97 && first <= 122 || first === 58 || first === 95 || first >= 128)) return;
	cursor += 1;
	while (cursor < buffer.length) {
		const byte = buffer[cursor];
		if (byte >= 65 && byte <= 90 || byte >= 97 && byte <= 122 || byte >= 48 && byte <= 57 || byte === 45 || byte === 46 || byte === 58 || byte === 95 || byte >= 128) {
			cursor += 1;
			continue;
		}
		if (byte === 47 || byte === 62 || skipAsciiWhitespace(buffer, cursor) > cursor) return buffer.subarray(start + 1, cursor).toString("utf8").toLowerCase();
		return;
	}
}
function skipRootHtmlComment(buffer, start) {
	let cursor = start + 4;
	if (buffer[cursor] === 62) return cursor + 1;
	if (buffer[cursor] === 45 && buffer[cursor + 1] === 62) return cursor + 2;
	while (cursor < buffer.length) {
		if (buffer[cursor] !== 45 || buffer[cursor + 1] !== 45) {
			cursor += 1;
			continue;
		}
		if (buffer[cursor + 2] === 62) return cursor + 3;
		if (buffer[cursor + 2] === 33 && buffer[cursor + 3] === 62) return cursor + 4;
		cursor += 2;
	}
}
function sniffActiveTextContent(buffer) {
	const decoded = decodeTextForActiveContentSniffing(buffer);
	let cursor = decoded.length >= 3 && decoded[0] === 239 && decoded[1] === 187 && decoded[2] === 191 ? 3 : 0;
	while (cursor < decoded.length) {
		cursor = skipAsciiWhitespace(decoded, cursor);
		if (decoded[cursor] === 60 && decoded[cursor + 1] === 63) return "application/xml";
		if (startsWithAsciiIgnoreCase(decoded, cursor, "<!--")) {
			const end = skipRootHtmlComment(decoded, cursor);
			if (end === void 0) return;
			cursor = end;
			continue;
		}
		if (startsWithAsciiIgnoreCase(decoded, cursor, "<!doctype")) return "application/xml";
		const rootTag = readAsciiRootTag(decoded, cursor);
		if (rootTag) return rootTag === "svg" ? "image/svg+xml" : "text/html";
		if (decoded[cursor] === 60) return "text/html";
		return;
	}
}
function detectActiveContentType(params) {
	const declaredType = normalizeMimeType(params.contentType);
	if (declaredType && ACTIVE_CONTENT_TYPES.has(declaredType)) return declaredType;
	const fileNameType = normalizeMimeType(mimeTypeFromFilePath(params.fileName));
	if (fileNameType && ACTIVE_CONTENT_TYPES.has(fileNameType)) return fileNameType;
	return sniffActiveTextContent(params.buffer);
}
async function prepareSynologyHostedMedia(params) {
	const route = resolveSynologyHostedMediaRoute(params.account);
	const store = getHostedMediaStore(params.account.accountId);
	if (!preparationLimiter.tryAcquire(params.account.accountId)) throw new Error("Synology Chat attachment preparation is busy. Retry after the current attachments finish preparing.");
	try {
		await store.cleanupExpired();
		const stagedUrl = new URL(await store.prepareUrl({
			mediaUrl: params.mediaUrl,
			routePath: route.localRoutePath,
			publicBaseUrl: route.publicBaseUrl,
			maxBytes: SYNOLOGY_OUTBOUND_MEDIA_MAX_BYTES,
			mediaAccess: normalizeMediaAccess(params),
			requestInit: { signal: AbortSignal.timeout(SYNOLOGY_OUTBOUND_MEDIA_PREPARE_TIMEOUT_MS) },
			validateBeforePersist: (media) => {
				const activeContentType = detectActiveContentType(media);
				if (activeContentType) throw new Error(`Synology Chat attachments do not support active content type ${activeContentType}.`);
			}
		}));
		const id = stagedUrl.pathname.split("/").at(-1) ?? "";
		const token = stagedUrl.searchParams.get("token");
		if (!SYNOLOGY_OUTBOUND_MEDIA_ID_RE.test(id) || !token) throw new Error("Synology Chat attachment capability could not be prepared.");
		const cleanup = createCleanup(store, id);
		const tokenParam = `${SYNOLOGY_HOSTED_MEDIA_TOKEN_PARAM_PREFIX}_${id}`;
		const querySeparator = route.publicSearch ? "&" : "?";
		return {
			url: `${route.publicBaseUrl}${route.publicRoutePath}${route.publicSearch}${querySeparator}${tokenParam}=${encodeURIComponent(token)}`,
			cleanup
		};
	} finally {
		preparationLimiter.release(params.account.accountId);
	}
}
async function tryHandleSynologyHostedMediaRequest(req, res, account) {
	let url;
	try {
		url = new URL(req.url ?? "/", "http://localhost");
	} catch {
		return false;
	}
	const tokenCandidates = [...url.searchParams.entries()].filter(([key]) => key.startsWith(`${SYNOLOGY_HOSTED_MEDIA_TOKEN_PARAM_PREFIX}_`)).map(([key, token]) => ({
		id: key.slice(SYNOLOGY_HOSTED_MEDIA_TOKEN_PARAM_PREFIX.length + 1),
		token
	})).filter((candidate) => SYNOLOGY_OUTBOUND_MEDIA_ID_RE.test(candidate.id));
	if (tokenCandidates.length === 0) return false;
	if (tokenCandidates.length !== 1) {
		res.statusCode = 400;
		res.end("Bad Request");
		return true;
	}
	const method = req.method ?? "GET";
	if (method !== "GET" && method !== "HEAD") {
		res.statusCode = 405;
		res.setHeader("Allow", "GET, HEAD");
		res.end("Method Not Allowed");
		return true;
	}
	const candidate = tokenCandidates[0];
	if (!candidate) return false;
	const store = getHostedMediaStore(account.accountId);
	if (!servingLimiter.tryAcquire(account.accountId)) {
		res.statusCode = 503;
		res.setHeader("Retry-After", "1");
		res.end("Attachment temporarily unavailable");
		return true;
	}
	let responseOwnsServingLease = false;
	let rollbackServedBytes;
	let entry;
	const servingLease = holdServingLeaseUntilResponseDone(res, account.accountId);
	try {
		const routePath = toSynologyHostedMediaStoreRoutePath(url.pathname);
		const metadata = await store.readMetadata(candidate.id);
		if (!servingLease.isActive() || res.destroyed || res.writableEnded) return true;
		if (!metadata || metadata.routePath !== routePath) {
			res.statusCode = 404;
			res.end("Not Found");
			return true;
		}
		if (!safeEqualSecret(candidate.token, metadata.token)) {
			res.statusCode = 401;
			res.end("Unauthorized");
			return true;
		}
		if (method === "GET") {
			rollbackServedBytes = reserveServedBytes(account.accountId, metadata.byteLength);
			if (!rollbackServedBytes) {
				res.statusCode = 429;
				res.setHeader("Retry-After", "60");
				res.end("Attachment download limit exceeded");
				return true;
			}
			entry = await store.read(candidate.id);
			if (!servingLease.isActive() || res.destroyed || res.writableEnded) return true;
			if (!entry) {
				res.statusCode = 404;
				res.end("Not Found");
				return true;
			}
		}
		for (const [name, value] of Object.entries(buildHostedOutboundMediaResponseHeaders(metadata, { fallbackFileName: `attachment-${candidate.id.slice(0, 10)}.bin` }))) res.setHeader(name, value);
		res.statusCode = 200;
		res.setHeader("Accept-Ranges", "none");
		responseOwnsServingLease = true;
		rollbackServedBytes = void 0;
		if (entry) try {
			await writeHostedMediaChunk(res, entry.buffer);
		} catch {
			if (!res.destroyed) res.destroy();
			return true;
		}
		res.end();
		return true;
	} finally {
		rollbackServedBytes?.();
		if (!responseOwnsServingLease) servingLease.release();
	}
}
//#endregion
export { setSynologyRuntime as i, tryHandleSynologyHostedMediaRequest as n, getSynologyRuntime as r, prepareSynologyHostedMedia as t };
