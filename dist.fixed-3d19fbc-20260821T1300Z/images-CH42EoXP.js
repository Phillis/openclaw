import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { a as assertNoWindowsNetworkPath, d as safeFileURLToPath } from "./read-open-flags-YbtjZqyj.js";
import { c as resolveUserPath } from "./home-dir-DcrXWQPU.js";
import "./utils-D9gvQMP6.js";
import { r as formatErrorMessage } from "./errors-CqPTYU6G.js";
import { i as MAX_VIDEO_BYTES } from "./constants-Mf57IYS0.js";
import { d as normalizeMimeType } from "./mime-Hm4eS2i0.js";
import "./local-file-access-D5Is7hSS.js";
import { f as readPersistedMediaFacts, l as isVideoMediaFact, m as readRuntimePromptMediaFacts, n as attachRuntimePromptMediaFacts, p as readRuntimePromptImageOrder, s as isImageMediaFact, u as normalizeMediaFacts } from "./media-facts-CdKKNGmE.js";
import { t as finalizeRuntimePromptImages } from "./runtime-prompt-image-provenance-a6jbLyXX.js";
import { n as sanitizeImageBlocks } from "./tool-images-DoRcRuZO.js";
import { s as resolveMediaReferenceLocalPath } from "./media-reference-8XBYb3Pm.js";
import { n as loadWebMedia } from "./web-media-DRJtrLMa.js";
import { t as log } from "./logger-BQ2aebRn.js";
import { n as resolveSandboxedBridgeMediaPath, t as createSandboxBridgeReadFile } from "./sandbox-media-paths-BvaOhl7Y.js";
import path from "node:path";
//#region src/agents/embedded-agent-runner/run/images.media-refs.ts
const URL_SCHEME_PATTERN = /^[a-z][a-z0-9+.-]*:/i;
const WINDOWS_DRIVE_PATH_PATTERN$1 = /^[A-Za-z]:[\\/]/;
function isOpenClawCliImageCachePath(filePath) {
	const parts = filePath.replaceAll("\\", "/").split("/");
	return parts.some((part, index) => {
		if (part === ".openclaw-cli-images") return true;
		const parent = parts[index - 1] ?? "";
		return part === "openclaw-cli-images" && /^openclaw(?:-\d+)?$/.test(parent);
	});
}
function resolveMediaFactLocalRef(fact) {
	const mediaUri = [fact.url, fact.path].find((value) => value?.startsWith("media://inbound/"));
	const identity = mediaUri ?? fact.path ?? fact.url;
	if (!identity) return;
	let resolved = mediaUri;
	if (!resolved && /^file:/i.test(identity)) try {
		resolved = safeFileURLToPath(identity);
	} catch {
		return;
	}
	else if (!resolved && (!URL_SCHEME_PATTERN.test(identity) || WINDOWS_DRIVE_PATH_PATTERN$1.test(identity))) resolved = identity;
	if (!resolved) return;
	return {
		raw: identity,
		type: mediaUri ? "media-uri" : "path",
		resolved: resolved.startsWith("~") ? resolveUserPath(resolved) : resolved
	};
}
function mediaFactToImageRef(fact, factIndex) {
	if (!isImageMediaFact(fact)) return;
	const identity = [fact.url, fact.path].find((value) => value?.startsWith("media://inbound/")) ?? fact.path ?? fact.url;
	if (!identity) return fact.hydrationSuppressed === true ? {
		aliases: [],
		detect: false,
		factIndex,
		raw: "",
		type: "path",
		resolved: "",
		hydrate: false,
		...fact.workspaceDir ? { workspaceDir: fact.workspaceDir } : {}
	} : void 0;
	const localRef = resolveMediaFactLocalRef(fact);
	const hydrate = fact.hydrationSuppressed !== true;
	if (!localRef || isOpenClawCliImageCachePath(localRef.resolved)) return {
		aliases: [fact.path, fact.url].filter((value) => Boolean(value)),
		detect: false,
		factIndex,
		raw: identity,
		type: "path",
		resolved: identity,
		hydrate: false,
		...fact.workspaceDir ? { workspaceDir: fact.workspaceDir } : {}
	};
	return {
		...localRef,
		aliases: [
			fact.path,
			fact.url,
			localRef.resolved
		].filter((value) => Boolean(value)),
		factIndex,
		hydrate,
		...fact.workspaceDir ? { workspaceDir: fact.workspaceDir } : {}
	};
}
function collectMediaImageRefs(media) {
	return normalizeMediaFacts(media).flatMap((fact, factIndex) => isImageMediaFact(fact) ? [mediaFactToImageRef(fact, factIndex)] : []);
}
function hasHydratableMediaImages(media) {
	return collectMediaImageRefs(media).some((ref) => ref?.hydrate === true);
}
//#endregion
//#region src/agents/embedded-agent-runner/run/prompt-image-metadata.ts
function readPersistedImageBlockFactIndexes(message) {
	const meta = message["__openclaw"];
	const value = meta && typeof meta === "object" && !Array.isArray(meta) ? meta.mediaImageBlockFactIndexes : void 0;
	if (!Array.isArray(value)) return;
	return value.map((entry) => typeof entry === "number" && Number.isSafeInteger(entry) && entry >= 0 ? entry : null);
}
function readPersistedMediaImageLayout(message) {
	const meta = message["__openclaw"];
	if (!meta || typeof meta !== "object" || Array.isArray(meta)) return;
	const layout = meta.mediaImageLayout;
	if (!layout || typeof layout !== "object" || Array.isArray(layout)) return;
	const record = layout;
	const slots = Array.isArray(record.slots) ? record.slots.flatMap((entry) => {
		if (!entry || typeof entry !== "object" || Array.isArray(entry)) return [];
		const slot = entry;
		if (slot.kind !== "inline" && slot.kind !== "offloaded") return [];
		const kind = slot.kind;
		const factIndex = slot.factIndex;
		return [{
			kind,
			...typeof factIndex === "number" && Number.isSafeInteger(factIndex) && factIndex >= 0 ? { factIndex } : {}
		}];
	}) : [];
	const suppressedFactIndexes = Array.isArray(record.suppressedFactIndexes) ? record.suppressedFactIndexes.filter((entry) => typeof entry === "number" && Number.isSafeInteger(entry) && entry >= 0) : [];
	return slots.length > 0 || suppressedFactIndexes.length > 0 ? {
		slots,
		suppressedFactIndexes
	} : void 0;
}
//#endregion
//#region src/agents/embedded-agent-runner/run/images.ts
const IMAGE_EXTENSION_NAMES = [
	"png",
	"jpg",
	"jpeg",
	"gif",
	"webp",
	"bmp",
	"tiff",
	"tif",
	"heic",
	"heif"
];
const IMAGE_EXTENSIONS = /* @__PURE__ */ new Set();
for (const ext of IMAGE_EXTENSION_NAMES) IMAGE_EXTENSIONS.add(`.${ext}`);
const IMAGE_EXTENSION_PATTERN = IMAGE_EXTENSION_NAMES.join("|");
const FILE_URL_REGEX_SOURCE = "file://[^\\s<>\"'`\\]]+\\.(?:" + IMAGE_EXTENSION_PATTERN + ")";
const WINDOWS_DRIVE_PATH_REGEX_SOURCE = "(?:^|\\s|[\"'`(])([A-Za-z]:[\\\\/][^\\s\"'`()\\[\\]]*\\.(?:" + IMAGE_EXTENSION_PATTERN + "))";
const PATH_REGEX_SOURCE = "(?:^|\\s|[\"'`(])((\\.\\.?/|[~/])[^\\s\"'`()\\[\\]]*\\.(?:" + IMAGE_EXTENSION_PATTERN + "))";
const FILE_URL_PATTERN = new RegExp(FILE_URL_REGEX_SOURCE, "gi");
const WINDOWS_DRIVE_PATH_PATTERN = new RegExp(WINDOWS_DRIVE_PATH_REGEX_SOURCE, "gi");
const PATH_PATTERN = new RegExp(PATH_REGEX_SOURCE, "gi");
const LEGACY_ATTACHMENT_MARKER_PATTERN = /\[(?:media attached(?:\s+\d+\/\d+)?:|Image:\s*source:)\s*[^\]]+\]/gi;
function isImageExtension(filePath) {
	const ext = normalizeLowercaseStringOrEmpty(path.extname(filePath));
	return IMAGE_EXTENSIONS.has(ext);
}
function normalizeRefForDedupe(raw) {
	const projected = process.platform === "darwin" && raw.startsWith("/private/var/") ? raw.slice(8) : raw;
	return process.platform === "win32" ? normalizeLowercaseStringOrEmpty(projected) : projected;
}
async function sanitizeImageEntriesWithLog(entries, label, imageSanitization) {
	const sanitized = [];
	let dropped = 0;
	let failedMediaCount = 0;
	for (const entry of entries) {
		const result = await sanitizeImageBlocks([entry.image], label, imageSanitization);
		const image = result.images[0];
		if (image) sanitized.push({
			image,
			factIndex: entry.factIndex
		});
		dropped += result.dropped;
		if (result.dropped > 0 && entry.factIndex !== null) failedMediaCount++;
	}
	if (dropped > 0) log.warn(`Native image: dropped ${dropped} image(s) after sanitization (${label}).`);
	return {
		entries: sanitized,
		failedMediaCount
	};
}
/** Detects explicit local image paths and file URLs in user prompt text. */
function detectImageReferences(prompt) {
	const refs = [];
	const seen = /* @__PURE__ */ new Set();
	const pathPrompt = prompt.replace(LEGACY_ATTACHMENT_MARKER_PATTERN, (marker) => " ".repeat(marker.length));
	const addPathRef = (raw) => {
		const trimmed = raw.trim();
		const dedupeKey = normalizeRefForDedupe(trimmed);
		if (!trimmed || seen.has(dedupeKey)) return;
		if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return;
		if (!isImageExtension(trimmed)) return;
		try {
			assertNoWindowsNetworkPath(trimmed, "Image path");
		} catch {
			return;
		}
		const resolved = trimmed.startsWith("~") ? resolveUserPath(trimmed) : trimmed;
		if (isOpenClawCliImageCachePath(resolved)) return;
		seen.add(dedupeKey);
		refs.push({
			raw: trimmed,
			type: "path",
			resolved
		});
	};
	FILE_URL_PATTERN.lastIndex = 0;
	WINDOWS_DRIVE_PATH_PATTERN.lastIndex = 0;
	PATH_PATTERN.lastIndex = 0;
	let match;
	while ((match = FILE_URL_PATTERN.exec(pathPrompt)) !== null) {
		const raw = match[0];
		const dedupeKey = normalizeRefForDedupe(raw);
		if (seen.has(dedupeKey)) continue;
		try {
			const resolved = safeFileURLToPath(raw);
			if (isOpenClawCliImageCachePath(resolved)) continue;
			seen.add(dedupeKey);
			refs.push({
				raw,
				type: "path",
				resolved
			});
		} catch {
			continue;
		}
	}
	while ((match = WINDOWS_DRIVE_PATH_PATTERN.exec(pathPrompt)) !== null) if (match[1]) addPathRef(match[1]);
	while ((match = PATH_PATTERN.exec(pathPrompt)) !== null) if (match[1]) addPathRef(match[1]);
	return refs;
}
function refDedupeKey(ref, workspaceDir) {
	const resolved = ref.type === "path" && workspaceDir && !path.isAbsolute(ref.resolved) ? path.resolve(workspaceDir, ref.resolved) : ref.resolved;
	return `${ref.type}\0${normalizeRefForDedupe(resolved)}`;
}
function rawAliasDedupeKey(alias) {
	return path.isAbsolute(alias) || /^[A-Za-z]:[\\/]/.test(alias) || /^[a-z][a-z0-9+.-]*:/i.test(alias) ? normalizeRefForDedupe(alias) : void 0;
}
async function loadMediaFromRef(ref, workspaceDir, options) {
	options?.signal?.throwIfAborted();
	try {
		let targetPath = ref.resolved;
		if (!options?.sandbox) targetPath = await resolveMediaReferenceLocalPath(targetPath);
		if (options?.sandbox) try {
			targetPath = (await resolveSandboxedBridgeMediaPath({
				sandbox: {
					root: options.sandbox.root,
					bridge: options.sandbox.bridge,
					workspaceOnly: options.workspaceOnly
				},
				mediaPath: targetPath,
				inboundFallbackDir: "media/inbound"
			})).resolved;
		} catch (err) {
			log.debug(`${options?.label ?? "Native media"}: sandbox validation failed: ${formatErrorMessage(err)}`);
			return null;
		}
		else if (!path.isAbsolute(targetPath)) targetPath = path.resolve(workspaceDir, targetPath);
		const media = options?.sandbox ? await loadWebMedia(targetPath, {
			maxBytes: options.maxBytes,
			sandboxValidated: true,
			readFile: createSandboxBridgeReadFile({ sandbox: options.sandbox })
		}) : await loadWebMedia(targetPath, options?.workspaceOnly || options?.localRoots ? {
			maxBytes: options.maxBytes,
			localRoots: options.localRoots ?? [workspaceDir]
		} : options?.maxBytes);
		options?.signal?.throwIfAborted();
		return media;
	} catch (err) {
		options?.signal?.throwIfAborted();
		log.debug(`${options?.label ?? "Native media"}: failed to load: ${formatErrorMessage(err)}`);
		return null;
	}
}
async function loadImageFromRef(ref, workspaceDir, options) {
	const media = await loadMediaFromRef(ref, workspaceDir, {
		...options,
		label: "Native image"
	});
	if (!media || media.kind !== "image") return null;
	return {
		type: "image",
		data: media.buffer.toString("base64"),
		mimeType: media.contentType ?? "image/jpeg"
	};
}
function modelSupportsImages(model) {
	return model.input?.includes("image") ?? false;
}
async function detectAndLoadPromptImages(params) {
	if (!modelSupportsImages(params.model)) return {
		images: [],
		imageFactIndexes: [],
		detectedRefs: [],
		failedMediaCount: 0,
		loadedCount: 0,
		skippedCount: 0
	};
	const media = normalizeMediaFacts(params.media);
	const suppressed = new Set(params.mediaImageLayout?.suppressedFactIndexes ?? []);
	const imageFactIndexes = media.flatMap((fact, factIndex) => isImageMediaFact(fact) && fact.hydrationSuppressed !== true && !suppressed.has(factIndex) ? [factIndex] : []);
	const refs = collectMediaImageRefs(media);
	const refsByFact = new Map(refs.flatMap((ref) => ref ? [[ref.factIndex, ref]] : []));
	const inferredSlots = (() => {
		if (params.imageOrder?.length === imageFactIndexes.length) return params.imageOrder.map((kind, index) => ({
			kind,
			factIndex: imageFactIndexes[index]
		}));
		if (params.imageOrder?.length) {
			const pending = [...imageFactIndexes];
			return [...params.imageOrder.map((kind) => ({
				kind,
				...kind === "offloaded" && pending.length ? { factIndex: pending.shift() } : {}
			})), ...pending.map((factIndex) => ({
				kind: "offloaded",
				factIndex
			}))];
		}
		return imageFactIndexes.map((factIndex, imageIndex) => ({
			factIndex,
			kind: !media[factIndex]?.path && !media[factIndex]?.url && imageIndex < (params.existingImages?.length ?? 0) ? "inline" : "offloaded"
		}));
	})();
	const slots = params.mediaImageLayout?.slots.length ? params.mediaImageLayout.slots.filter((slot) => slot.factIndex === void 0 || !suppressed.has(slot.factIndex)) : inferredSlots;
	const layoutInlineIndexes = slots.flatMap((slot) => slot.kind === "inline" ? [slot.factIndex ?? null] : []);
	const existingIndexes = params.existingImageFactIndexes ?? (layoutInlineIndexes.length === (params.existingImages?.length ?? 0) ? layoutInlineIndexes : params.existingImages?.map(() => null));
	const unusedExisting = (params.existingImages ?? []).map((image, index) => ({
		image,
		factIndex: existingIndexes?.[index] ?? null
	}));
	const takeExisting = (factIndex, allowUnowned) => {
		const exact = factIndex === void 0 ? -1 : unusedExisting.findIndex((entry) => entry.factIndex === factIndex);
		const index = exact >= 0 ? exact : allowUnowned ? unusedExisting.findIndex((entry) => entry.factIndex === null) : -1;
		return index >= 0 ? unusedExisting.splice(index, 1)[0] : void 0;
	};
	const availableRefs = refs.filter((ref) => Boolean(ref));
	const attachmentRefs = slots.flatMap((slot) => slot.kind === "offloaded" && slot.factIndex !== void 0 ? refsByFact.get(slot.factIndex) ?? [] : []);
	const attachmentKeys = new Set(attachmentRefs.map((ref) => refDedupeKey(ref, ref.workspaceDir ?? params.workspaceDir)));
	const attachmentRawKeys = new Set(attachmentRefs.flatMap((ref) => ref.aliases.flatMap((alias) => rawAliasDedupeKey(alias) ?? [])));
	const promptRefs = detectImageReferences(params.prompt).filter((ref) => !attachmentRawKeys.has(rawAliasDedupeKey(ref.raw) ?? "") && !attachmentKeys.has(refDedupeKey(ref, params.workspaceDir)));
	const detectedRefs = [...availableRefs.flatMap(({ detect, hydrate, raw, type, resolved }) => detect !== false && (hydrate || !resolved.startsWith("http://") && !resolved.startsWith("https://")) ? [{
		raw,
		type,
		resolved
	}] : []), ...promptRefs];
	let loadedCount = 0;
	let failedMediaCount = 0;
	let skippedCount = 0;
	const loadRef = async (ref) => {
		const image = await loadImageFromRef(ref, ref.workspaceDir ?? params.workspaceDir, {
			maxBytes: params.maxBytes,
			workspaceOnly: params.workspaceOnly,
			localRoots: params.localRoots ?? (params.workspaceOnly ? [params.workspaceDir] : void 0),
			sandbox: params.sandbox
		});
		if (image) {
			loadedCount++;
			log.debug(`Native image: loaded ${ref.type} ${ref.resolved}`);
		} else skippedCount++;
		return image;
	};
	const promptImages = [];
	for (const slot of slots) {
		const existing = takeExisting(slot.factIndex, slot.kind === "inline");
		if (existing) {
			promptImages.push(existing);
			continue;
		}
		if (slot.kind === "inline") {
			failedMediaCount++;
			continue;
		}
		const ref = slot.factIndex === void 0 ? void 0 : refsByFact.get(slot.factIndex);
		const image = ref?.hydrate ? await loadRef(ref) : null;
		if (ref?.hydrate && !image) failedMediaCount++;
		if (image) promptImages.push({
			image,
			factIndex: ref?.factIndex ?? null
		});
	}
	promptImages.push(...unusedExisting);
	for (const ref of promptRefs) {
		const image = await loadRef(ref);
		if (image) promptImages.push({
			image,
			factIndex: null
		});
	}
	const sanitizedPromptImages = await sanitizeImageEntriesWithLog(promptImages, "prompt:images", {
		maxBytes: params.maxBytes,
		maxDimensionPx: params.maxDimensionPx
	});
	return {
		...finalizeRuntimePromptImages(sanitizedPromptImages.entries),
		detectedRefs,
		failedMediaCount: failedMediaCount + sanitizedPromptImages.failedMediaCount,
		loadedCount,
		skippedCount
	};
}
const VIDEO_OMISSION = {
	unsupported: "(video omitted: provider does not support native video)",
	unavailable: "(video omitted: source unavailable)",
	invalid: "(video omitted: invalid video MIME type)",
	limit: "(video omitted: native video byte limit exceeded)"
};
async function materializeVideoFact(fact, budget, options) {
	if ((fact.sizeBytes ?? 0) > budget.remaining) return {
		type: "text",
		text: VIDEO_OMISSION.limit
	};
	const ref = resolveMediaFactLocalRef(fact);
	const loaded = ref ? await loadMediaFromRef(ref, fact.workspaceDir ?? options.workspaceDir, {
		label: "Native video",
		maxBytes: budget.remaining,
		signal: options.signal,
		workspaceOnly: options.workspaceOnly,
		localRoots: options.localRoots ?? (options.workspaceOnly ? [options.workspaceDir] : void 0),
		sandbox: options.sandbox
	}) : null;
	if (!loaded) return {
		type: "text",
		text: VIDEO_OMISSION.unavailable
	};
	const mimeType = normalizeMimeType(loaded.contentType);
	if (loaded.kind !== "video" || !mimeType?.startsWith("video/")) return {
		type: "text",
		text: VIDEO_OMISSION.invalid
	};
	if (loaded.buffer.length > budget.remaining) return {
		type: "text",
		text: VIDEO_OMISSION.limit
	};
	budget.remaining -= loaded.buffer.length;
	return {
		type: "video",
		data: loaded.buffer.toString("base64"),
		mimeType
	};
}
async function projectOrderedPromptMedia(params) {
	const generatedMarkers = new Set(Object.values(VIDEO_OMISSION));
	const projected = params.content.filter((block) => block.type === "text" && !generatedMarkers.has(block.text));
	const imagesByFact = /* @__PURE__ */ new Map();
	const factlessImages = [];
	params.images.forEach((image, index) => {
		const factIndex = params.imageFactIndexes[index];
		if (factIndex == null) factlessImages.push(image);
		else imagesByFact.set(factIndex, [...imagesByFact.get(factIndex) ?? [], image]);
	});
	for (const [factIndex, fact] of params.media.entries()) if (isImageMediaFact(fact)) projected.push(...imagesByFact.get(factIndex) ?? []);
	else if (isVideoMediaFact(fact)) projected.push(params.options.provider ? await materializeVideoFact(fact, params.budget, params.options) : {
		type: "text",
		text: VIDEO_OMISSION.unsupported
	});
	projected.push(...factlessImages);
	return projected;
}
/** Hydrates exact-message media facts for canonical replay or one provider call. */
async function materializePromptMediaMessages(messages, options) {
	let hydrated;
	const videoBudget = { remaining: MAX_VIDEO_BYTES };
	for (const [index, message] of messages.entries()) {
		if (message.role !== "user") continue;
		const runtimeMedia = readRuntimePromptMediaFacts(message);
		const meta = message["__openclaw"];
		const resolvedMedia = runtimeMedia ?? readPersistedMediaFacts(message) ?? [];
		const runtimeImageOrder = readRuntimePromptImageOrder(message);
		const mediaImageLayout = readPersistedMediaImageLayout(message);
		if (!resolvedMedia.length) continue;
		const content = Array.isArray(message.content) ? message.content : [{
			type: "text",
			text: message.content
		}];
		const existingImages = content.filter((block) => block.type === "image");
		const result = await detectAndLoadPromptImages({
			prompt: "",
			media: resolvedMedia,
			workspaceDir: options.workspaceDir,
			model: options.model,
			existingImages,
			existingImageFactIndexes: readPersistedImageBlockFactIndexes(message),
			mediaImageLayout,
			maxBytes: options.maxBytes,
			maxDimensionPx: options.maxDimensionPx,
			workspaceOnly: options.workspaceOnly,
			localRoots: options.localRoots,
			sandbox: options.sandbox
		});
		const projectedContent = await projectOrderedPromptMedia({
			content,
			media: resolvedMedia,
			images: result.images,
			imageFactIndexes: result.imageFactIndexes,
			options,
			budget: videoBudget
		});
		hydrated ??= messages.slice();
		if (options.provider) {
			hydrated[index] = {
				role: "user",
				content: projectedContent,
				timestamp: message.timestamp,
				...message.runtimeContextCarrier ? { runtimeContextCarrier: true } : {}
			};
			continue;
		}
		const nextMeta = meta && typeof meta === "object" && !Array.isArray(meta) ? { ...meta } : {};
		if (result.images.length > 0) nextMeta.mediaImageBlockFactIndexes = result.imageFactIndexes;
		else delete nextMeta.mediaImageBlockFactIndexes;
		const hydratedMessage = {
			...message,
			content: projectedContent
		};
		if (Object.keys(nextMeta).length > 0) hydratedMessage["__openclaw"] = nextMeta;
		else delete hydratedMessage["__openclaw"];
		if (runtimeMedia) attachRuntimePromptMediaFacts(hydratedMessage, runtimeMedia, runtimeImageOrder);
		hydrated[index] = hydratedMessage;
	}
	return hydrated ?? messages;
}
/** Hydrates non-enumerable facts carried by queued user turns before canonical replay. */
async function hydratePromptMediaMessages(messages, options) {
	return await materializePromptMediaMessages(messages, options);
}
/** Materializes one transient provider context from exact-message media facts. */
async function materializeProviderContext(params) {
	const messages = await materializePromptMediaMessages(params.context.messages, {
		workspaceDir: params.workspaceDir,
		model: { input: ["text", "image"] },
		workspaceOnly: params.workspaceOnly,
		localRoots: params.localRoots,
		sandbox: params.sandbox,
		provider: true,
		signal: params.signal
	});
	params.signal?.throwIfAborted();
	return messages === params.context.messages ? params.context : {
		...params.context,
		messages
	};
}
//#endregion
export { readPersistedMediaImageLayout as a, materializeProviderContext as i, detectImageReferences as n, hasHydratableMediaImages as o, hydratePromptMediaMessages as r, detectAndLoadPromptImages as t };
