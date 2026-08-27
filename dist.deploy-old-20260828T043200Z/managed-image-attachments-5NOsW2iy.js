import "./src-BntaCZM-.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { I as resolveTimestampMsToIsoString, l as asNonNegativeFiniteNumber, o as asDateTimestampMs } from "./number-coercion-CLj0HTDM.js";
import { t as pruneMapToMaxSize } from "./map-size-DAGm21RM.js";
import { h as sanitizeUntrustedFileName } from "./fs-safe-CmrQUApq.js";
import { n as openLocalFileSafely, r as readLocalFileSafely } from "./root-impl-BbMR4leC.js";
import { w as resolveStateDir } from "./paths-BBSTUjD5.js";
import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
import { c as parseAgentSessionKey } from "./session-key-utils-Di3FvABa.js";
import { n as getRuntimeConfig } from "./io-DlN5njvP.js";
import "./config-B2bSneS2.js";
import { t as safeEqualSecret } from "./secret-equal-DRsL8lKD.js";
import { n as authorizeOperatorScopesForMethod } from "./method-scopes-BTnJZEGh.js";
import { b as resolveSessionEntry } from "./session-accessor.sqlite-entry-CNdoUuFZ.js";
import { Pt as loadExactSessionEntryReadOnlyResult } from "./session-accessor-B-FKZX9M.js";
import { a as maxBytesForKind, o as mediaKindFromMime } from "./constants-Mf57IYS0.js";
import { u as mimeTypeFromFilePath } from "./mime-Hm4eS2i0.js";
import { c as getImageMetadata, f as readImageProbeFromHeader, s as createImageProcessor } from "./image-ops-CNJmjS8j.js";
import { n as probePlaybackMediaFileDescriptor } from "./media-services-B8MVUzbz.js";
import { f as saveMediaBuffer, p as saveMediaSource, s as getMediaDir, t as MEDIA_MAX_BYTES } from "./store-B6ILpvye.js";
import { a as resolveLocalMediaPath } from "./local-roots-CtOvegzo.js";
import { a as resolveLocalMediaRoots, n as assertLocalMediaAllowed } from "./local-media-access-fA_3dacW.js";
import { _ as resolveSessionHistoryTranscriptPathAsync, c as readSessionMessagesWithSourceAsync } from "./session-transcript-readers-CgCxlOAj.js";
import { i as tryResolveSessionCompatibilityOwnerAgentId } from "./session-request-agent-C9E8iDY4.js";
import { i as loadGatewaySessionEntryReadOnly } from "./session-utils-store-DtQnSTMm.js";
import "./session-utils-BTR52tOf.js";
import { m as loadPendingSessionDeliveries } from "./session-delivery-queue-storage-CouGbFe6.js";
import { g as resolveOpenAiCompatibleHttpSenderIsOwner, h as resolveOpenAiCompatibleHttpOperatorScopes, i as authorizeGatewayHttpRequestOrReply } from "./http-auth-utils-CrQlRW6b.js";
import { c as sendMethodNotAllowed, l as sendMissingScopeForbidden, s as sendJson } from "./http-common-m4pDgMA2.js";
import "./http-utils-BKAf5kRa.js";
import { t as resolveExistingAgentSessionStoreTargetsReadOnlyResult } from "./targets-read-availability-DUboLngd.js";
import { a as replacePlaybackFileExtension, i as buildAssistantMediaContentDisposition, n as resolveByteResponse, o as resolvePlaybackModeForSource, r as writeByteHeaders, s as resolvePlaybackTranscode, t as createGatewayByteStream } from "./http-byte-range-BCST9Jpp.js";
import { a as insertManagedImageRecord, i as deleteClaimedManagedImageRecord, n as attachManagedImageRecordToMessage, o as listManagedImageRecordEntries, r as claimManagedImageRecordCleanupIfCurrent, t as MANAGED_OUTGOING_ORIGINALS_SUBDIR, u as readManagedImageRecord } from "./managed-image-record-store-DRWMcXU5.js";
import path from "node:path";
import fs from "node:fs/promises";
import { createHmac, randomBytes, randomUUID } from "node:crypto";
import pLimit from "p-limit";
//#region src/gateway/managed-image-attachments.ts
const OUTGOING_IMAGE_ROUTE_PREFIX = "/api/chat/media/outgoing";
const DEFAULT_TRANSIENT_OUTGOING_IMAGE_TTL_MS = 900 * 1e3;
const MANAGED_OUTGOING_IMAGE_TICKET_SCOPE = "managed-outgoing-image";
const MANAGED_OUTGOING_IMAGE_TICKET_TTL_MS = 300 * 1e3;
const MANAGED_OUTGOING_IMAGE_ARTIFACT_ID_PREFIX = "artifact_managed_image_";
const MANAGED_OUTGOING_MEDIA_ARTIFACT_ID_PREFIX = "artifact_managed_media_";
const MANAGED_IMAGE_THUMBNAIL_MAX_SIDE = 300;
const MANAGED_IMAGE_THUMBNAIL_CACHE_MAX_ENTRIES = 128;
const MANAGED_IMAGE_THUMBNAIL_CACHE_MAX_BYTES = 16 * 1024 * 1024;
const MANAGED_IMAGE_THUMBNAIL_MAX_PENDING = 128;
const MANAGED_OUTGOING_ATTACHMENT_ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const managedOutgoingImageTicketSecret = randomBytes(32);
const managedImageThumbnailCache = /* @__PURE__ */ new Map();
const managedImageThumbnailJobs = /* @__PURE__ */ new Map();
const limitManagedImageThumbnails = pLimit(4);
let managedImageThumbnailCacheBytes = 0;
const DEFAULT_MANAGED_IMAGE_ATTACHMENT_LIMITS = {
	maxBytes: 12 * 1024 * 1024,
	maxWidth: 4096,
	maxHeight: 4096,
	maxPixels: 2e7
};
function readManagedImageThumbnail(cacheKey) {
	const thumbnail = managedImageThumbnailCache.get(cacheKey);
	if (!thumbnail) return;
	managedImageThumbnailCache.delete(cacheKey);
	managedImageThumbnailCache.set(cacheKey, thumbnail);
	return thumbnail;
}
function cacheManagedImageThumbnail(cacheKey, thumbnail) {
	const previous = managedImageThumbnailCache.get(cacheKey);
	if (previous) {
		managedImageThumbnailCache.delete(cacheKey);
		managedImageThumbnailCacheBytes -= previous.byteLength;
	}
	managedImageThumbnailCache.set(cacheKey, thumbnail);
	managedImageThumbnailCacheBytes += thumbnail.byteLength;
	while (managedImageThumbnailCache.size > MANAGED_IMAGE_THUMBNAIL_CACHE_MAX_ENTRIES || managedImageThumbnailCacheBytes > MANAGED_IMAGE_THUMBNAIL_CACHE_MAX_BYTES) {
		const oldest = managedImageThumbnailCache.entries().next().value;
		if (!oldest) break;
		managedImageThumbnailCache.delete(oldest[0]);
		managedImageThumbnailCacheBytes -= oldest[1].byteLength;
	}
}
async function resolveManagedImageThumbnail(cacheKey, create) {
	const cached = readManagedImageThumbnail(cacheKey);
	if (cached) return cached;
	const active = managedImageThumbnailJobs.get(cacheKey);
	if (active) return await active;
	if (limitManagedImageThumbnails.pendingCount >= MANAGED_IMAGE_THUMBNAIL_MAX_PENDING) throw new Error("managed image thumbnail queue is full");
	const pending = limitManagedImageThumbnails(create).then((thumbnail) => {
		cacheManagedImageThumbnail(cacheKey, thumbnail);
		return thumbnail;
	}).finally(() => {
		managedImageThumbnailJobs.delete(cacheKey);
	});
	managedImageThumbnailJobs.set(cacheKey, pending);
	return await pending;
}
const sessionManagedOutgoingAttachmentIndexCache = /* @__PURE__ */ new Map();
const MAX_SESSION_MANAGED_OUTGOING_ATTACHMENT_INDEX_CACHE_ENTRIES = 500;
function buildSessionManagedOutgoingAttachmentIndexCacheKey(sessionKey, agentId) {
	return sessionKey === "global" && agentId ? `agent:${agentId}:global` : sessionKey;
}
function resolveManagedImageAttachmentLimits(config) {
	return {
		maxBytes: config?.maxBytes ?? DEFAULT_MANAGED_IMAGE_ATTACHMENT_LIMITS.maxBytes,
		maxWidth: config?.maxWidth ?? DEFAULT_MANAGED_IMAGE_ATTACHMENT_LIMITS.maxWidth,
		maxHeight: config?.maxHeight ?? DEFAULT_MANAGED_IMAGE_ATTACHMENT_LIMITS.maxHeight,
		maxPixels: config?.maxPixels ?? DEFAULT_MANAGED_IMAGE_ATTACHMENT_LIMITS.maxPixels
	};
}
function formatLimitMiB(bytes) {
	if (bytes < 1024 * 1024) return `${bytes} bytes`;
	return Number.isInteger(bytes / (1024 * 1024)) ? `${bytes / (1024 * 1024)} MiB` : `${(bytes / (1024 * 1024)).toFixed(1)} MiB`;
}
function createManagedImageAttachmentError(message) {
	const error = new Error(message);
	error.name = "ManagedImageAttachmentError";
	return error;
}
function isManagedImageAttachmentSafeError(error) {
	if (!(error instanceof Error)) return false;
	if (error.name === "ManagedImageAttachmentError") return true;
	return error.message.startsWith("Managed image attachment ") || error.message.startsWith("Invalid image data URL");
}
function getSanitizedManagedImageAttachmentError(error, label, kind) {
	if (isManagedImageAttachmentSafeError(error)) return error;
	return createManagedImageAttachmentError(`Managed ${kind} attachment ${JSON.stringify(label)} could not be prepared`);
}
function validateManagedImageBuffer(buffer, alt, limits) {
	if (buffer.byteLength > limits.maxBytes) throw createManagedImageAttachmentError(`Managed image attachment ${JSON.stringify(alt)} exceeds the ${formatLimitMiB(limits.maxBytes)} byte limit`);
}
function maxBytesForManagedMediaKind(kind, imageLimits) {
	return kind === "image" ? imageLimits.maxBytes : maxBytesForKind(kind);
}
function createManagedMediaByteLimitError(params) {
	return createManagedImageAttachmentError(`Managed ${params.kind} attachment ${JSON.stringify(params.label)} exceeds the ${formatLimitMiB(params.maxBytes)} byte limit`);
}
function estimateBase64DecodedByteLength(base64) {
	const normalized = base64.replace(/\s+/g, "");
	const paddingMatch = /=+$/u.exec(normalized);
	const padding = Math.min(paddingMatch?.[0].length ?? 0, 2);
	return Math.floor(normalized.length * 3 / 4) - padding;
}
function getManagedImageMetadataLimitError(metadata, alt, limits) {
	if (!metadata) return `Managed image attachment ${JSON.stringify(alt)} is missing readable dimensions`;
	if (metadata.width > limits.maxWidth) return `Managed image attachment ${JSON.stringify(alt)} exceeds the ${limits.maxWidth}px width limit`;
	if (metadata.height > limits.maxHeight) return `Managed image attachment ${JSON.stringify(alt)} exceeds the ${limits.maxHeight}px height limit`;
	if (metadata.width * metadata.height > limits.maxPixels) return `Managed image attachment ${JSON.stringify(alt)} exceeds the ${limits.maxPixels.toLocaleString("en-US")} pixel limit`;
	return null;
}
function orientManagedImageMetadata(buffer, metadata) {
	if (!metadata) return null;
	const orientation = readImageProbeFromHeader(buffer)?.orientation;
	return orientation === 5 || orientation === 6 || orientation === 7 || orientation === 8 ? {
		width: metadata.height,
		height: metadata.width
	} : metadata;
}
async function resizeManagedImageBufferToLimits(params) {
	const resized = await createImageProcessor().encode(params.buffer, {
		format: "auto",
		limits: {
			maxWidth: params.limits.maxWidth,
			maxHeight: params.limits.maxHeight,
			maxPixels: params.limits.maxPixels
		},
		opaque: {
			format: "jpeg",
			quality: 92
		},
		transparent: {
			format: "png",
			compressionLevel: 9
		},
		transparency: "auto"
	});
	return {
		buffer: resized.data,
		contentType: resized.mimeType,
		width: resized.width,
		height: resized.height
	};
}
function resolveManagedImageOriginalPath(record) {
	if (!path.isAbsolute(record.original.mediaRoot) || record.original.mediaSubdir !== "outgoing/originals" || !record.original.mediaId || record.original.mediaId.includes("/") || record.original.mediaId.includes("\\") || record.original.mediaId.includes("\0")) throw new Error("Managed image record has an unsafe media identity");
	return path.join(record.original.mediaRoot, record.original.mediaSubdir, record.original.mediaId);
}
function resolveManagedImageOriginalsDir(stateDir) {
	const runtimeMediaRoot = path.resolve(stateDir) === path.resolve(resolveStateDir()) ? getMediaDir() : path.join(stateDir, "media");
	return path.join(runtimeMediaRoot, MANAGED_OUTGOING_ORIGINALS_SUBDIR);
}
async function hasUnmigratedManagedImageMetadata(stateDir) {
	try {
		return (await fs.readdir(path.join(stateDir, "media", "outgoing", "records"))).some((name) => name.endsWith(".json") || name.includes(".json.doctor-importing-"));
	} catch (error) {
		return error.code !== "ENOENT";
	}
}
async function deleteAgedOrphanManagedImageFiles(params) {
	if (await hasUnmigratedManagedImageMetadata(params.stateDir)) return 0;
	const referencedMediaIds = new Set(listManagedImageRecordEntries({ stateDir: params.stateDir }).map(({ record }) => record.original.mediaId));
	const originalsDir = resolveManagedImageOriginalsDir(params.stateDir);
	let names;
	try {
		names = await fs.readdir(originalsDir);
	} catch {
		return 0;
	}
	let deletedCount = 0;
	for (const name of names) {
		if (referencedMediaIds.has(name)) continue;
		const filePath = path.join(originalsDir, name);
		try {
			const stat = await fs.lstat(filePath);
			if (!stat.isFile() || stat.isSymbolicLink() || params.nowMs - stat.mtimeMs < params.minAgeMs) continue;
			await fs.rm(filePath, { force: true });
			deletedCount += 1;
		} catch {}
	}
	return deletedCount;
}
function buildOutgoingVariantUrl(sessionKey, attachmentId, variant) {
	return `${OUTGOING_IMAGE_ROUTE_PREFIX}/${encodeURIComponent(sessionKey)}/${attachmentId}/${variant}`;
}
function buildManagedOutgoingArtifactId(attachmentId, kind) {
	return `${kind === "image" ? MANAGED_OUTGOING_IMAGE_ARTIFACT_ID_PREFIX : MANAGED_OUTGOING_MEDIA_ARTIFACT_ID_PREFIX}${attachmentId}`;
}
function parseManagedOutgoingArtifactId(value) {
	const family = value.startsWith("artifact_managed_image_") ? "image" : value.startsWith("artifact_managed_media_") ? "media" : null;
	if (!family) return null;
	const prefix = family === "image" ? MANAGED_OUTGOING_IMAGE_ARTIFACT_ID_PREFIX : MANAGED_OUTGOING_MEDIA_ARTIFACT_ID_PREFIX;
	const attachmentId = value.slice(prefix.length);
	return MANAGED_OUTGOING_ATTACHMENT_ID_RE.test(attachmentId) ? {
		attachmentId,
		family
	} : null;
}
function signManagedOutgoingImageTicketPayload(encodedPayload) {
	return createHmac("sha256", managedOutgoingImageTicketSecret).update(encodedPayload).digest("base64url");
}
function createManagedOutgoingImageTicket(params) {
	const now = asDateTimestampMs(params.nowMs ?? Date.now());
	if (now === void 0) return null;
	const exp = asDateTimestampMs(now + MANAGED_OUTGOING_IMAGE_TICKET_TTL_MS);
	if (exp === void 0) return null;
	const payload = {
		scope: MANAGED_OUTGOING_IMAGE_TICKET_SCOPE,
		sessionKey: params.sessionKey,
		attachmentId: params.attachmentId,
		variant: "full",
		exp
	};
	const encodedPayload = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
	return {
		ticket: `v1.${encodedPayload}.${signManagedOutgoingImageTicketPayload(encodedPayload)}`,
		expiresAt: resolveTimestampMsToIsoString(exp)
	};
}
function verifyManagedOutgoingImageTicket(params) {
	const now = asDateTimestampMs(params.nowMs ?? Date.now());
	if (now === void 0) return false;
	const parts = params.ticket?.split(".");
	if (!parts || parts.length !== 3 || parts[0] !== "v1") return false;
	const [, encodedPayload, signature] = parts;
	if (!encodedPayload || !signature) return false;
	if (!safeEqualSecret(signature, signManagedOutgoingImageTicketPayload(encodedPayload))) return false;
	try {
		const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8"));
		return payload.scope === MANAGED_OUTGOING_IMAGE_TICKET_SCOPE && payload.sessionKey === params.sessionKey && payload.attachmentId === params.attachmentId && payload.variant === "full" && typeof payload.exp === "number" && Number.isFinite(payload.exp) && payload.exp >= now;
	} catch {
		return false;
	}
}
function deriveAltText(source, index) {
	const fallback = `Generated image ${index + 1}`;
	try {
		if (/^https?:\/\//i.test(source)) {
			const parsed = new URL(source);
			return path.basename(parsed.pathname || "").trim() || fallback;
		}
	} catch {}
	return path.basename(source).trim() || fallback;
}
function parseMediaDataUrl(source, label, imageLimits) {
	const trimmed = source.trim();
	if (!trimmed.startsWith("data:")) return { kind: "not-data-url" };
	const afterPrefix = trimmed.slice(5);
	const commaIdx = afterPrefix.indexOf(",");
	const mimeAndParams = commaIdx < 0 ? "" : afterPrefix.slice(0, commaIdx);
	if (mimeAndParams.slice(-7).toLowerCase() !== ";base64") throw new Error("Invalid image data URL");
	const semicolonIdx = mimeAndParams.indexOf(";");
	const contentType = (semicolonIdx < 0 ? mimeAndParams : mimeAndParams.slice(0, semicolonIdx)).trim().toLowerCase();
	if (!contentType) throw new Error("Invalid image data URL");
	const base64Part = afterPrefix.slice(commaIdx + 1);
	if (!/^[A-Za-z0-9+/=\s]+$/.test(base64Part)) throw new Error("Invalid image data URL");
	const mediaKind = mediaKindFromMime(contentType);
	if (mediaKind !== "image" && mediaKind !== "audio" && mediaKind !== "video") return { kind: "unsupported-data-url" };
	const maxBytes = maxBytesForManagedMediaKind(mediaKind, imageLimits);
	if (estimateBase64DecodedByteLength(base64Part) > maxBytes) throw createManagedMediaByteLimitError({
		kind: mediaKind,
		label,
		maxBytes
	});
	return {
		kind: "media-data-url",
		buffer: Buffer.from(base64Part.replace(/\s+/g, ""), "base64"),
		contentType,
		mediaKind
	};
}
async function getVariantStats(params) {
	const loaded = params.buffer ? {
		buffer: params.buffer,
		sizeBytes: params.sizeBytes ?? params.buffer.byteLength
	} : await (async () => {
		const { buffer, stat } = await readLocalFileSafely({ filePath: params.filePath });
		return {
			buffer,
			sizeBytes: stat.size
		};
	})();
	const metadataBuffer = loaded.buffer;
	const metadata = await getImageMetadata(metadataBuffer).catch(() => null) ?? {
		width: null,
		height: null
	};
	return {
		width: metadata.width ?? null,
		height: metadata.height ?? null,
		sizeBytes: Number.isFinite(loaded.sizeBytes) ? loaded.sizeBytes : null
	};
}
async function deleteManagedImageRecordArtifacts(record, stateDir = resolveStateDir(), alreadyClaimed = false) {
	if (!alreadyClaimed && !claimManagedImageRecordCleanupIfCurrent(record, stateDir)) return {
		deletedRecord: false,
		deletedFileCount: 0
	};
	try {
		await fs.rm(resolveManagedImageOriginalPath(record), { force: true });
	} catch {
		return {
			deletedRecord: false,
			deletedFileCount: 0
		};
	}
	return {
		deletedRecord: deleteClaimedManagedImageRecord(record, stateDir),
		deletedFileCount: 1
	};
}
async function cleanupManagedOutgoingMediaRecords(params) {
	const stateDir = params?.stateDir ?? resolveStateDir();
	const nowMs = params?.nowMs ?? Date.now();
	const transientMaxAgeMs = params?.transientMaxAgeMs ?? DEFAULT_TRANSIENT_OUTGOING_IMAGE_TTL_MS;
	const sessionKeyFilter = params?.sessionKey ?? null;
	const agentIdFilter = params?.agentId?.trim() ? normalizeAgentId(params.agentId) : void 0;
	const globalCompatibilityOwnerAgentId = sessionKeyFilter === "global" && agentIdFilter ? tryResolveSessionCompatibilityOwnerAgentId(getRuntimeConfig(), "global") : void 0;
	const forceDeleteSessionRecords = params?.forceDeleteSessionRecords === true;
	const entries = listManagedImageRecordEntries({ stateDir });
	let pendingPreparedAttachmentIds;
	let deletedRecordCount = 0;
	let deletedFileCount = 0;
	let retainedCount = 0;
	const transcriptAttachmentIndexCache = /* @__PURE__ */ new Map();
	const sessionStoreAvailabilityCache = /* @__PURE__ */ new Map();
	const sessionStoreTargetsReadCache = /* @__PURE__ */ new Map();
	for (const entry of entries) {
		const { record } = entry;
		if (sessionKeyFilter && record.sessionKey !== sessionKeyFilter) {
			retainedCount += 1;
			continue;
		}
		if (sessionKeyFilter === "global" && record.sessionKey === "global" && (!agentIdFilter || resolveManagedSessionOwnerAgentId(record.sessionKey, record.agentId, globalCompatibilityOwnerAgentId) !== agentIdFilter)) {
			retainedCount += 1;
			continue;
		}
		let shouldDelete = entry.cleanupPending;
		if (!entry.cleanupPending && forceDeleteSessionRecords && (!sessionKeyFilter || record.sessionKey === sessionKeyFilter)) shouldDelete = true;
		else if (!entry.cleanupPending && record.messageId) shouldDelete = await recordMatchesTranscriptMessage(record, transcriptAttachmentIndexCache, sessionStoreAvailabilityCache, sessionStoreTargetsReadCache, stateDir) === "missing";
		else if (!entry.cleanupPending) {
			const createdAtMs = Date.parse(record.createdAt);
			if (Number.isFinite(createdAtMs) && nowMs - createdAtMs >= transientMaxAgeMs && params?.hasActiveSessionRun?.(record.sessionKey, record.agentId?.trim() || void 0) !== true) {
				if (pendingPreparedAttachmentIds === void 0) pendingPreparedAttachmentIds = await loadPendingPreparedAttachmentIds(stateDir);
				shouldDelete = pendingPreparedAttachmentIds !== null && !pendingPreparedAttachmentIds.has(record.attachmentId);
			}
		}
		if (shouldDelete) {
			const deleted = await deleteManagedImageRecordArtifacts(record, stateDir, entry.cleanupPending);
			if (deleted.deletedRecord) {
				deletedRecordCount += 1;
				deletedFileCount += deleted.deletedFileCount;
			} else retainedCount += 1;
		} else retainedCount += 1;
	}
	deletedFileCount += await deleteAgedOrphanManagedImageFiles({
		stateDir,
		nowMs,
		minAgeMs: Math.max(transientMaxAgeMs, DEFAULT_TRANSIENT_OUTGOING_IMAGE_TTL_MS)
	});
	return {
		deletedRecordCount,
		deletedFileCount,
		retainedCount
	};
}
async function removeManagedOutgoingMediaBlocks(params) {
	const stateDir = params.stateDir ?? resolveStateDir();
	await Promise.all(collectManagedOutgoingAttachmentRefs(params.blocks).map(async ({ attachmentId }) => {
		const record = readManagedImageRecord(attachmentId, stateDir);
		if (record?.messageId === params.messageId) await deleteManagedImageRecordArtifacts(record, stateDir);
	}));
}
function resolveManagedSessionOwnerAgentId(sessionKey, explicitAgentId, compatibilityAgentId) {
	const ownerAgentId = explicitAgentId?.trim() || parseAgentSessionKey(sessionKey)?.agentId || compatibilityAgentId?.trim();
	return ownerAgentId ? normalizeAgentId(ownerAgentId) : void 0;
}
function resolveManagedRecordKind(record) {
	const kind = mediaKindFromMime(record.original.contentType);
	return kind === "image" || kind === "audio" || kind === "video" ? kind : null;
}
function buildManagedMediaBlock(record, playback) {
	const kind = resolveManagedRecordKind(record);
	if (!kind) throw new Error("Managed media record has an unsupported content type");
	const fullUrl = buildOutgoingVariantUrl(record.sessionKey, record.attachmentId, "full");
	return {
		type: kind,
		artifactId: buildManagedOutgoingArtifactId(record.attachmentId, kind),
		url: fullUrl,
		openUrl: fullUrl,
		...kind === "image" ? { alt: record.alt } : { fileName: record.original.filename },
		mimeType: record.original.contentType,
		...playback ? { playback } : {},
		...kind === "image" ? {
			width: record.original.width,
			height: record.original.height
		} : {},
		sizeBytes: record.original.sizeBytes
	};
}
function buildManagedOutgoingAttachmentRefKey(messageId, attachmentId) {
	return `${messageId}::${attachmentId}`;
}
function buildManagedImageResizeWarningBlock(params) {
	return {
		type: "text",
		text: `[Image warning] ${params.alt} exceeded gateway dimension/pixel limits and was resized from ${params.originalWidth}×${params.originalHeight} to ${params.resizedWidth}×${params.resizedHeight}.`
	};
}
function toRecordFilename(filePath, attachmentName, fallbackName) {
	const fallback = fallbackName ?? path.basename(filePath).trim();
	if (!attachmentName?.trim()) return fallback || null;
	const safeName = sanitizeUntrustedFileName(attachmentName, fallback);
	return `${path.parse(safeName).name}${path.extname(filePath)}`;
}
function asArray(value) {
	return Array.isArray(value) ? value.filter((item) => typeof item === "string" && item.trim()) : [];
}
function parseManagedOutgoingRoute(value) {
	try {
		const match = new URL(value, "http://localhost").pathname.match(/^\/api\/chat\/media\/outgoing\/([^/]+)\/([^/]+)\/full$/);
		if (!match) return null;
		if (!MANAGED_OUTGOING_ATTACHMENT_ID_RE.test(expectDefined(match[2], "managed image attachments regex capture 2"))) return null;
		return {
			sessionKey: decodeURIComponent(expectDefined(match[1], "managed image attachments regex capture 1")),
			attachmentId: expectDefined(match[2], "managed image attachments regex capture 2")
		};
	} catch {
		return null;
	}
}
function collectManagedOutgoingAttachmentRefs(blocks, expectedSessionKey) {
	const refs = /* @__PURE__ */ new Map();
	for (const block of blocks ?? []) {
		if (block?.type !== "image" && block?.type !== "audio" && block?.type !== "video") continue;
		for (const candidate of [block.url, block.openUrl]) {
			if (typeof candidate !== "string") continue;
			const parsed = parseManagedOutgoingRoute(candidate);
			if (!parsed) continue;
			if (expectedSessionKey && parsed.sessionKey !== expectedSessionKey) continue;
			const attachmentId = expectDefined(parsed.attachmentId, "managed image attachment id");
			refs.set(attachmentId, {
				attachmentId,
				sessionKey: parsed.sessionKey
			});
		}
	}
	return [...refs.values()];
}
async function loadPendingPreparedAttachmentIds(stateDir) {
	try {
		const attachmentIds = /* @__PURE__ */ new Set();
		for (const entry of await loadPendingSessionDeliveries(stateDir)) {
			if (entry.kind !== "agentTurn") continue;
			for (const blocks of Object.values(entry.preparedMediaBlocks ?? {})) for (const ref of collectManagedOutgoingAttachmentRefs(blocks, entry.sessionKey)) attachmentIds.add(ref.attachmentId);
		}
		return attachmentIds;
	} catch {
		return null;
	}
}
function getCachedSessionManagedOutgoingAttachmentIndex(sessionKey, agentId, stat) {
	const cacheKey = buildSessionManagedOutgoingAttachmentIndexCacheKey(sessionKey, agentId);
	const cached = sessionManagedOutgoingAttachmentIndexCache.get(cacheKey);
	if (!cached) return null;
	if (cached.transcriptPath !== stat.transcriptPath || cached.mtimeMs !== stat.mtimeMs || cached.size !== stat.size) {
		sessionManagedOutgoingAttachmentIndexCache.delete(cacheKey);
		return null;
	}
	sessionManagedOutgoingAttachmentIndexCache.delete(cacheKey);
	sessionManagedOutgoingAttachmentIndexCache.set(cacheKey, cached);
	return cached.index;
}
function setCachedSessionManagedOutgoingAttachmentIndex(sessionKey, agentId, stat, index) {
	sessionManagedOutgoingAttachmentIndexCache.set(buildSessionManagedOutgoingAttachmentIndexCacheKey(sessionKey, agentId), {
		transcriptPath: stat.transcriptPath,
		mtimeMs: stat.mtimeMs,
		size: stat.size,
		index
	});
	pruneMapToMaxSize(sessionManagedOutgoingAttachmentIndexCache, MAX_SESSION_MANAGED_OUTGOING_ATTACHMENT_INDEX_CACHE_ENTRIES);
}
function sameManagedOutgoingAttachmentTranscriptStat(left, right) {
	return left?.transcriptPath === right?.transcriptPath && left?.mtimeMs === right?.mtimeMs && left?.size === right?.size;
}
async function getSessionManagedOutgoingAttachmentIndex(sessionKey, cache, agentId, storeAvailabilityCache, storeTargetsReadCache, stateDir) {
	const cacheKey = buildSessionManagedOutgoingAttachmentIndexCacheKey(sessionKey, agentId);
	if (cache?.has(cacheKey)) return {
		kind: "available",
		index: cache.get(cacheKey) ?? null
	};
	const cfg = getRuntimeConfig();
	const ownerAgentId = resolveManagedSessionOwnerAgentId(sessionKey, agentId) ?? tryResolveSessionCompatibilityOwnerAgentId(cfg, sessionKey);
	if (!ownerAgentId) return {
		kind: "unavailable",
		reason: "read-failed"
	};
	const discovery = storeAvailabilityCache?.get(ownerAgentId) ?? resolveExistingAgentSessionStoreTargetsReadOnlyResult(cfg, ownerAgentId, {
		cache: storeTargetsReadCache,
		...stateDir ? { env: {
			...process.env,
			OPENCLAW_STATE_DIR: stateDir
		} } : {}
	});
	storeAvailabilityCache?.set(ownerAgentId, discovery);
	if (!discovery.available) return {
		kind: "unavailable",
		reason: discovery.reason
	};
	const usesRuntimeState = !stateDir || path.resolve(stateDir) === path.resolve(resolveStateDir());
	const env = stateDir ? {
		...process.env,
		OPENCLAW_STATE_DIR: stateDir
	} : process.env;
	let matched;
	for (const target of discovery.targets) {
		const exact = loadExactSessionEntryReadOnlyResult({
			agentId: ownerAgentId,
			clone: false,
			env,
			sessionKey,
			storePath: target.storePath
		});
		if (!exact.found) return {
			kind: "unavailable",
			reason: exact.reason
		};
		let targetEntry = exact.value?.entry;
		if (!targetEntry) try {
			targetEntry = resolveSessionEntry({
				agentId: ownerAgentId,
				clone: false,
				env,
				sessionKey,
				storePath: target.storePath
			}, { readOnly: true }).existing;
		} catch {
			return {
				kind: "unavailable",
				reason: "row-invalid"
			};
		}
		if (targetEntry) {
			if (matched) return {
				kind: "unavailable",
				reason: "read-failed"
			};
			matched = {
				entry: targetEntry,
				storePath: target.storePath
			};
		}
	}
	let entry = matched?.entry;
	let storePath = matched?.storePath ?? discovery.targets[0]?.storePath ?? "";
	if (!entry && usesRuntimeState) {
		const loaded = loadGatewaySessionEntryReadOnly(sessionKey, { agentId: ownerAgentId });
		const exact = loadExactSessionEntryReadOnlyResult({
			agentId: ownerAgentId,
			clone: false,
			sessionKey,
			storePath: loaded.storePath
		});
		if (!exact.found) return {
			kind: "unavailable",
			reason: exact.reason
		};
		entry = exact.value?.entry ?? loaded.entry;
		storePath = loaded.storePath;
	}
	const sessionId = entry?.sessionId;
	if (!sessionId) {
		cache?.set(cacheKey, null);
		return {
			kind: "available",
			index: null
		};
	}
	let transcriptStat = null;
	const resolvedTranscriptPath = await resolveSessionHistoryTranscriptPathAsync(sessionId, storePath, void 0, { allowResetArchiveFallback: true });
	if (resolvedTranscriptPath) try {
		const stat = await fs.stat(resolvedTranscriptPath);
		transcriptStat = {
			transcriptPath: resolvedTranscriptPath,
			mtimeMs: stat.mtimeMs,
			size: stat.size
		};
		const cachedIndex = getCachedSessionManagedOutgoingAttachmentIndex(sessionKey, agentId, transcriptStat);
		if (cachedIndex) {
			cache?.set(cacheKey, cachedIndex);
			return {
				kind: "available",
				index: cachedIndex
			};
		}
	} catch {
		sessionManagedOutgoingAttachmentIndexCache.delete(cacheKey);
	}
	else sessionManagedOutgoingAttachmentIndexCache.delete(cacheKey);
	const readResult = await readSessionMessagesWithSourceAsync({
		agentId,
		sessionEntry: entry,
		sessionId,
		sessionKey,
		storePath
	}, {
		mode: "full",
		reason: "managed outgoing attachment index",
		allowResetArchiveFallback: true
	});
	const messages = readResult.messages;
	const preReadTranscriptStat = transcriptStat;
	if (readResult.transcriptPath) try {
		const stat = await fs.stat(readResult.transcriptPath);
		const postReadTranscriptStat = {
			transcriptPath: readResult.transcriptPath,
			mtimeMs: stat.mtimeMs,
			size: stat.size
		};
		transcriptStat = sameManagedOutgoingAttachmentTranscriptStat(preReadTranscriptStat, postReadTranscriptStat) ? postReadTranscriptStat : null;
	} catch {
		transcriptStat = null;
	}
	else transcriptStat = null;
	const index = /* @__PURE__ */ new Set();
	for (const message of messages) {
		const messageId = (message?.["__openclaw"])?.id;
		if (typeof messageId !== "string" || !messageId) continue;
		for (const ref of collectManagedOutgoingAttachmentRefs(Array.isArray(message?.content) ? message.content : [], sessionKey)) index.add(buildManagedOutgoingAttachmentRefKey(messageId, ref.attachmentId));
	}
	if (transcriptStat) setCachedSessionManagedOutgoingAttachmentIndex(sessionKey, agentId, transcriptStat, index);
	cache?.set(cacheKey, index);
	return {
		kind: "available",
		index
	};
}
async function recordMatchesTranscriptMessage(record, cache, storeAvailabilityCache, storeTargetsReadCache, stateDir) {
	if (!record.messageId) return "missing";
	const read = await getSessionManagedOutgoingAttachmentIndex(record.sessionKey, cache, record.agentId, storeAvailabilityCache, storeTargetsReadCache, stateDir);
	if (read.kind === "unavailable") return "unavailable";
	return read.index?.has(buildManagedOutgoingAttachmentRefKey(record.messageId, record.attachmentId)) ? "match" : "missing";
}
async function resolveManagedOutgoingMediaArtifactDownloadForRecord(record, stateDir) {
	if (await recordMatchesTranscriptMessage(record, void 0, void 0, void 0, stateDir) !== "match") return null;
	const kind = resolveManagedRecordKind(record);
	if (!kind) return null;
	const ticket = createManagedOutgoingImageTicket({
		sessionKey: record.sessionKey,
		attachmentId: record.attachmentId
	});
	if (!ticket) return null;
	try {
		if (!(await fs.stat(resolveManagedImageOriginalPath(record))).isFile()) return null;
	} catch {
		return null;
	}
	const canonicalUrl = buildOutgoingVariantUrl(record.sessionKey, record.attachmentId, "full");
	const params = new URLSearchParams({ mediaTicket: ticket.ticket });
	return {
		artifactId: buildManagedOutgoingArtifactId(record.attachmentId, kind),
		sessionKey: record.sessionKey,
		type: kind,
		title: kind === "image" ? record.alt : record.original.filename ?? record.alt,
		...record.original.contentType ? { mimeType: record.original.contentType } : {},
		...record.original.sizeBytes != null ? { sizeBytes: record.original.sizeBytes } : {},
		url: `${canonicalUrl}?${params.toString()}`,
		expiresAt: ticket.expiresAt
	};
}
/** Resolve one transcript-backed media artifact to a short-lived HTTP capability. */
async function resolveManagedOutgoingMediaArtifactDownload(params) {
	const parsed = parseManagedOutgoingArtifactId(params.artifactId);
	if (!parsed) return null;
	const record = readManagedImageRecord(parsed.attachmentId, params.stateDir);
	if (!record || record.sessionKey !== params.sessionKey) return null;
	const requestedAgentId = params.agentId ? normalizeAgentId(params.agentId) : void 0;
	const recordAgentId = resolveManagedSessionOwnerAgentId(record.sessionKey, record.agentId, params.defaultAgentId);
	if (requestedAgentId && recordAgentId !== requestedAgentId) return null;
	const kind = resolveManagedRecordKind(record);
	if (!kind || parsed.family === "image" !== (kind === "image")) return null;
	return await resolveManagedOutgoingMediaArtifactDownloadForRecord(record, params.stateDir);
}
/** Upgrade legacy managed-image URLs that predate stable artifact ids. */
async function resolveManagedOutgoingMediaUrlDownload(params) {
	const parsed = parseManagedOutgoingRoute(params.url);
	if (!parsed || parsed.sessionKey !== params.sessionKey) return null;
	const record = readManagedImageRecord(parsed.attachmentId, params.stateDir);
	if (!record || record.sessionKey !== params.sessionKey) return null;
	return await resolveManagedOutgoingMediaArtifactDownloadForRecord(record, params.stateDir);
}
function attachManagedOutgoingMediaToMessage(params) {
	const messageId = params.messageId.trim();
	if (!messageId) return false;
	const refs = collectManagedOutgoingAttachmentRefs(params.blocks);
	if (refs.length === 0) return false;
	return refs.map(({ attachmentId, sessionKey }) => attachManagedImageRecordToMessage({
		attachmentId,
		sessionKey,
		messageId,
		updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
		stateDir: params.stateDir
	})).every(Boolean);
}
async function createManagedOutgoingMediaBlocks(params) {
	const sessionKey = params.sessionKey.trim();
	if (!sessionKey) return [];
	const mediaUrls = asArray(params.mediaUrls);
	if (mediaUrls.length === 0) return [];
	const stateDir = params.stateDir ?? resolveStateDir();
	const limits = resolveManagedImageAttachmentLimits(params.limits);
	const blocks = [];
	let resolvedLocalRoots;
	for (const [index, mediaUrl] of mediaUrls.entries()) {
		const attachmentMetadata = params.attachments?.[index];
		const trimmedMediaUrl = mediaUrl.trim();
		const dataUrlKind = /^data:(image|audio|video)\//iu.exec(trimmedMediaUrl)?.[1];
		const fallbackLabel = `Generated ${dataUrlKind ?? "media"} ${index + 1}`;
		const isDataUrl = trimmedMediaUrl.startsWith("data:");
		const localMediaPath = isDataUrl ? void 0 : resolveLocalMediaPath(mediaUrl);
		const label = isDataUrl ? fallbackLabel : deriveAltText(localMediaPath ?? mediaUrl, index);
		const inferredKind = mediaKindFromMime(mimeTypeFromFilePath(localMediaPath ?? mediaUrl));
		const hintedKind = dataUrlKind === "image" || dataUrlKind === "audio" || dataUrlKind === "video" ? dataUrlKind : inferredKind === "image" || inferredKind === "audio" || inferredKind === "video" ? inferredKind : "media";
		let savedOriginalPath = null;
		try {
			const parsedDataUrl = parseMediaDataUrl(mediaUrl, fallbackLabel, limits);
			if (parsedDataUrl.kind === "unsupported-data-url") continue;
			if (localMediaPath && (hintedKind === "audio" || hintedKind === "video") && params.allowLocalNonImage !== true) throw new Error("Local audio/video media requires an explicitly trusted reply payload");
			let resizeWarning = null;
			let savedOriginal = parsedDataUrl.kind === "media-data-url" ? await saveMediaBuffer(parsedDataUrl.buffer, parsedDataUrl.contentType, "outgoing/originals", maxBytesForManagedMediaKind(parsedDataUrl.mediaKind, limits), `generated-${parsedDataUrl.mediaKind}-${index + 1}`) : await (async () => {
				if (localMediaPath) {
					const localRoots = params.localRoots;
					await assertLocalMediaAllowed(localMediaPath, localRoots, localRoots === "any" ? void 0 : { resolveRoots: async () => {
						resolvedLocalRoots ??= await resolveLocalMediaRoots(localRoots);
						return resolvedLocalRoots;
					} });
				}
				return await saveMediaSource(localMediaPath ?? mediaUrl, void 0, "outgoing/originals", Math.max(limits.maxBytes, maxBytesForKind("audio"), maxBytesForKind("video"), MEDIA_MAX_BYTES));
			})();
			savedOriginalPath = savedOriginal.path;
			let savedOriginalContentType = savedOriginal.contentType;
			if (!savedOriginalContentType) {
				await fs.rm(savedOriginal.path, { force: true }).catch(() => {});
				savedOriginalPath = null;
				continue;
			}
			const mediaKind = mediaKindFromMime(savedOriginalContentType);
			if (mediaKind !== "image" && mediaKind !== "audio" && mediaKind !== "video") {
				await fs.rm(savedOriginal.path, { force: true }).catch(() => {});
				savedOriginalPath = null;
				continue;
			}
			if (localMediaPath && mediaKind !== "image" && params.allowLocalNonImage !== true) throw new Error("Local audio/video media requires an explicitly trusted reply payload");
			const maxBytes = maxBytesForManagedMediaKind(mediaKind, limits);
			if (savedOriginal.size > maxBytes) throw createManagedMediaByteLimitError({
				kind: mediaKind,
				label,
				maxBytes
			});
			let originalStats = {
				width: null,
				height: null,
				sizeBytes: savedOriginal.size
			};
			if (mediaKind === "image") {
				let originalBuffer = parsedDataUrl.kind === "media-data-url" ? parsedDataUrl.buffer : (await readLocalFileSafely({ filePath: savedOriginal.path })).buffer;
				validateManagedImageBuffer(originalBuffer, label, limits);
				originalStats = await getVariantStats({
					filePath: savedOriginal.path,
					buffer: originalBuffer,
					sizeBytes: savedOriginal.size
				});
				if (originalStats.sizeBytes != null && originalStats.sizeBytes > maxBytes) throw createManagedMediaByteLimitError({
					kind: mediaKind,
					label,
					maxBytes
				});
				const originalMetadata = originalStats.width != null && originalStats.height != null ? {
					width: originalStats.width,
					height: originalStats.height
				} : await getImageMetadata(originalBuffer);
				const originalDisplayMetadata = orientManagedImageMetadata(originalBuffer, originalMetadata);
				let effectiveMetadata = originalDisplayMetadata;
				let metadataLimitError = getManagedImageMetadataLimitError(effectiveMetadata, label, limits);
				for (let resizeAttempt = 0; metadataLimitError; resizeAttempt += 1) {
					if (!effectiveMetadata || resizeAttempt >= 3) throw createManagedImageAttachmentError(metadataLimitError);
					const resized = await resizeManagedImageBufferToLimits({
						buffer: originalBuffer,
						limits
					});
					validateManagedImageBuffer(resized.buffer, label, limits);
					const replacement = await saveMediaBuffer(resized.buffer, resized.contentType, "outgoing/originals", limits.maxBytes, toRecordFilename(savedOriginal.path) ?? `generated-image-${index + 1}`);
					await fs.rm(savedOriginal.path, { force: true }).catch(() => {});
					savedOriginal = replacement;
					savedOriginalContentType = replacement.contentType ?? resized.contentType;
					savedOriginalPath = savedOriginal.path;
					originalBuffer = resized.buffer;
					originalStats = await getVariantStats({
						filePath: savedOriginal.path,
						buffer: originalBuffer,
						sizeBytes: savedOriginal.size
					});
					effectiveMetadata = orientManagedImageMetadata(originalBuffer, originalStats.width != null && originalStats.height != null ? {
						width: originalStats.width,
						height: originalStats.height
					} : await getImageMetadata(originalBuffer));
					metadataLimitError = getManagedImageMetadataLimitError(effectiveMetadata, label, limits);
					if (!metadataLimitError) resizeWarning = buildManagedImageResizeWarningBlock({
						alt: label,
						originalWidth: originalDisplayMetadata?.width ?? effectiveMetadata?.width ?? resized.width,
						originalHeight: originalDisplayMetadata?.height ?? effectiveMetadata?.height ?? resized.height,
						resizedWidth: effectiveMetadata?.width ?? resized.width,
						resizedHeight: effectiveMetadata?.height ?? resized.height
					});
				}
			}
			const record = {
				attachmentId: randomUUID(),
				sessionKey,
				...sessionKey === "global" && params.agentId?.trim() ? { agentId: params.agentId.trim() } : {},
				messageId: params.messageId ?? null,
				createdAt: (/* @__PURE__ */ new Date()).toISOString(),
				retentionClass: params.messageId ? "history" : "transient",
				alt: label,
				original: {
					mediaRoot: path.dirname(path.dirname(path.dirname(path.resolve(savedOriginal.path)))),
					mediaId: savedOriginal.id,
					mediaSubdir: MANAGED_OUTGOING_ORIGINALS_SUBDIR,
					contentType: savedOriginalContentType,
					width: originalStats.width,
					height: originalStats.height,
					sizeBytes: originalStats.sizeBytes,
					filename: toRecordFilename(savedOriginal.path, attachmentMetadata?.name, mediaKind === "image" ? void 0 : label)
				}
			};
			let playback;
			if (mediaKind === "audio" || mediaKind === "video") {
				const opened = await openLocalFileSafely({ filePath: savedOriginal.path });
				try {
					const probe = await probePlaybackMediaFileDescriptor(opened.handle.fd, mediaKind);
					playback = await resolvePlaybackModeForSource({
						sourcePath: opened.realPath,
						sourceStat: opened.stat,
						mimeType: savedOriginalContentType,
						kind: mediaKind,
						probe
					});
				} finally {
					await opened.handle.close().catch(() => {});
				}
			}
			const block = buildManagedMediaBlock(record, playback);
			insertManagedImageRecord(record, stateDir);
			const durationMs = asNonNegativeFiniteNumber(attachmentMetadata?.durationMs);
			const width = asNonNegativeFiniteNumber(attachmentMetadata?.width);
			const height = asNonNegativeFiniteNumber(attachmentMetadata?.height);
			blocks.push({
				...block,
				...durationMs !== void 0 ? { durationMs } : {},
				...mediaKind === "video" && width !== void 0 ? { width } : {},
				...mediaKind === "video" && height !== void 0 ? { height } : {}
			});
			if (resizeWarning) blocks.push(resizeWarning);
		} catch (error) {
			if (savedOriginalPath) await fs.rm(savedOriginalPath, { force: true }).catch(() => {});
			const sanitizedError = getSanitizedManagedImageAttachmentError(error, label, hintedKind);
			if (params.continueOnPrepareError) {
				params.onPrepareError?.(sanitizedError);
				continue;
			}
			throw sanitizedError;
		}
	}
	return blocks;
}
function sendStatus(res, statusCode, body) {
	if (res.writableEnded) return;
	res.statusCode = statusCode;
	res.setHeader("content-type", "text/plain; charset=utf-8");
	res.end(body);
}
function buildManagedMediaContentDisposition(value, contentType) {
	const fallback = contentType.startsWith("image/") ? "generated-image" : "generated-media";
	const filename = (value ?? fallback).replace(/[\r\n"\\]/g, "_").trim() || fallback;
	return /^[\x20-\x7e]+$/u.test(filename) ? `inline; filename="${filename}"` : buildAssistantMediaContentDisposition(filename, contentType);
}
async function handleManagedOutgoingMediaHttpRequest(req, res, opts) {
	const requestUrl = new URL(req.url ?? "/", "http://localhost");
	const match = (opts.basePath && requestUrl.pathname.startsWith(`${opts.basePath}/`) ? requestUrl.pathname.slice(opts.basePath.length) : requestUrl.pathname).match(/^\/api\/chat\/media\/outgoing\/([^/]+)\/([^/]+)\/(full|thumbnail)$/);
	if (!match) return false;
	if (req.method !== "GET" && req.method !== "HEAD") {
		sendMethodNotAllowed(res, "GET, HEAD");
		return true;
	}
	const encodedSessionKey = match[1];
	const attachmentId = match[2];
	const variant = match[3];
	if (!encodedSessionKey || !attachmentId || variant !== "full" && variant !== "thumbnail") return false;
	if (!MANAGED_OUTGOING_ATTACHMENT_ID_RE.test(attachmentId)) {
		sendStatus(res, 404, "not found");
		return true;
	}
	let sessionKey;
	try {
		sessionKey = decodeURIComponent(encodedSessionKey);
	} catch {
		sendStatus(res, 404, "not found");
		return true;
	}
	const hasValidMediaTicket = verifyManagedOutgoingImageTicket({
		ticket: requestUrl.searchParams.get("mediaTicket"),
		sessionKey,
		attachmentId
	});
	if (!hasValidMediaTicket) {
		const requestAuth = await authorizeGatewayHttpRequestOrReply({
			req,
			res,
			auth: opts.auth,
			trustedProxies: opts.trustedProxies,
			allowRealIpFallback: opts.allowRealIpFallback,
			rateLimiter: opts.rateLimiter
		});
		if (!requestAuth) return true;
		const scopeAuth = authorizeOperatorScopesForMethod("chat.history", resolveOpenAiCompatibleHttpOperatorScopes(req, requestAuth));
		if (!scopeAuth.allowed) {
			sendMissingScopeForbidden(res, scopeAuth.missingScope);
			return true;
		}
		if (!resolveOpenAiCompatibleHttpSenderIsOwner(req, requestAuth)) {
			sendJson(res, 403, {
				ok: false,
				error: {
					type: "forbidden",
					message: "owner access required"
				}
			});
			return true;
		}
	}
	const stateDir = opts.stateDir ?? resolveStateDir();
	const record = readManagedImageRecord(attachmentId, stateDir);
	if (!record || record.sessionKey !== sessionKey) {
		sendStatus(res, 404, "not found");
		return true;
	}
	if (await recordMatchesTranscriptMessage(record, void 0, void 0, void 0, stateDir) !== "match") {
		sendStatus(res, 404, "not found");
		return true;
	}
	let opened;
	try {
		opened = await openLocalFileSafely({ filePath: resolveManagedImageOriginalPath(record) });
	} catch {
		sendStatus(res, 404, "not found");
		return true;
	}
	const respondNotFound = () => sendStatus(res, 404, "not found");
	let responseContentType = record.original.contentType || "application/octet-stream";
	let responseFilename = record.original.filename;
	const mediaKind = resolveManagedRecordKind(record);
	if (variant === "thumbnail") {
		if (mediaKind !== "image") {
			await opened.handle.close();
			sendStatus(res, 404, "not found");
			return true;
		}
		try {
			const thumbnail = await resolveManagedImageThumbnail(`${opened.realPath}\0${opened.stat.mtimeMs}\0${opened.stat.size}`, async () => {
				const source = await opened.handle.readFile();
				return (await createImageProcessor().encode(source, {
					format: "png",
					resize: {
						maxSide: MANAGED_IMAGE_THUMBNAIL_MAX_SIDE,
						enlarge: false
					},
					compressionLevel: 8
				})).data;
			});
			await opened.handle.close();
			const sourceName = path.parse(responseFilename ?? "generated-image").name;
			res.statusCode = 200;
			res.setHeader("content-type", "image/png");
			res.setHeader("content-length", String(thumbnail.byteLength));
			res.setHeader("x-content-type-options", "nosniff");
			res.setHeader("referrer-policy", "no-referrer");
			res.setHeader("cache-control", hasValidMediaTicket ? `private, max-age=${MANAGED_OUTGOING_IMAGE_TICKET_TTL_MS / 1e3}, immutable` : "private, max-age=31536000, immutable");
			res.setHeader("content-disposition", buildManagedMediaContentDisposition(`${sourceName}-thumbnail.png`, "image/png"));
			res.end(req.method === "HEAD" ? void 0 : thumbnail);
			return true;
		} catch {
			await opened.handle.close().catch(() => {});
			sendStatus(res, 404, "not found");
			return true;
		}
	}
	let byteStream = createGatewayByteStream(res, opened.handle, respondNotFound);
	if (requestUrl.searchParams.get("playback") === "1" && (mediaKind === "audio" || mediaKind === "video")) {
		const playback = await resolvePlaybackTranscode({
			sourcePath: opened.realPath,
			sourceStat: opened.stat,
			mimeType: responseContentType,
			kind: mediaKind
		}).catch(async (error) => {
			await byteStream.close();
			throw error;
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
				byteStream = createGatewayByteStream(res, opened.handle, respondNotFound);
				responseContentType = playback.contentType;
				responseFilename = replacePlaybackFileExtension(responseFilename ?? "generated-media", playback.extension);
			}
		}
	}
	res.setHeader("content-type", responseContentType);
	res.setHeader("x-content-type-options", "nosniff");
	res.setHeader("referrer-policy", "no-referrer");
	res.setHeader("cache-control", hasValidMediaTicket ? `private, max-age=${MANAGED_OUTGOING_IMAGE_TICKET_TTL_MS / 1e3}, immutable` : "private, max-age=31536000, immutable");
	res.setHeader("content-disposition", buildManagedMediaContentDisposition(responseFilename, responseContentType));
	const byteResponse = resolveByteResponse({
		file: opened.stat,
		method: req.method,
		request: req
	});
	writeByteHeaders(res, byteResponse);
	await byteStream.pipe(byteResponse, req.method);
	return true;
}
//#endregion
export { cleanupManagedOutgoingMediaRecords as a, parseManagedOutgoingArtifactId as c, resolveManagedOutgoingMediaArtifactDownload as d, resolveManagedOutgoingMediaUrlDownload as f, attachManagedOutgoingMediaToMessage as i, removeManagedOutgoingMediaBlocks as l, MANAGED_OUTGOING_IMAGE_ARTIFACT_ID_PREFIX as n, createManagedOutgoingMediaBlocks as o, MANAGED_OUTGOING_MEDIA_ARTIFACT_ID_PREFIX as r, handleManagedOutgoingMediaHttpRequest as s, DEFAULT_MANAGED_IMAGE_ATTACHMENT_LIMITS as t, resolveManagedImageAttachmentLimits as u };
