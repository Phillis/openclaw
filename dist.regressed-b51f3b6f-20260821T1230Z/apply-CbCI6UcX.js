import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { u as asPositiveFiniteNumber } from "./number-coercion-oCkfUEEq.js";
import { i as shouldLogVerbose, r as logVerbose } from "./globals-CAwGc4B6.js";
import { d as normalizeMimeType, u as mimeTypeFromFilePath } from "./mime-Hm4eS2i0.js";
import { a as wrapExternalContent } from "./external-content-IQUFD6xt.js";
import { r as classifyMediaReferenceSource } from "./media-reference-BeABx1cr.js";
import { t as finalizeInboundContext } from "./inbound-context-LXL8l8JC.js";
import { t as resolveConcurrency } from "./resolve-II6CtamH.js";
import { t as attachmentClassFromMime } from "./attachment-classify-f0aBQf2E.js";
import { t as renderFileContextBlock } from "./file-context-Lbu5USC0.js";
import { i as extractFileContentFromSource, s as resolveInputFileLimits } from "./input-files-uwbMv1cN.js";
import { o as resolveAttachmentKind } from "./attachments.normalize-Bo4XFKe5.js";
import { d as selectAttachments } from "./runner.entries-DYdF7KsG.js";
import { a as createMediaAttachmentCache, i as runCapability, o as normalizeMediaAttachments, r as resolveMediaAttachmentLocalRoots, t as buildProviderRegistry } from "./runner-58cIY1dK.js";
import { n as sendTranscriptEcho } from "./echo-transcript-C8-HHykm.js";
import pMap from "p-map";
//#region packages/media-understanding-common/src/format.ts
const sectionByKind = {
	"audio.transcription": {
		title: "Audio",
		label: "Transcript"
	},
	"image.description": {
		title: "Image",
		label: "Description"
	},
	"video.description": {
		title: "Video",
		label: "Description"
	}
};
function formatSection(title, label, text, userText) {
	const lines = [`[${title}]`];
	if (userText) lines.push(`User text:\n${userText}`);
	lines.push(`${label}:\n${text}`);
	return lines.join("\n");
}
/** Formats media-understanding outputs into the chat body sent back to the model. */
function formatMediaUnderstandingBody(params) {
	const outputs = params.outputs.filter((output) => output.text.trim());
	if (outputs.length === 0) return params.body ?? "";
	const userText = params.body?.trim() || void 0;
	const sections = [];
	if (userText && outputs.length > 1) sections.push(`User text:\n${userText}`);
	const counts = /* @__PURE__ */ new Map();
	for (const output of outputs) counts.set(output.kind, (counts.get(output.kind) ?? 0) + 1);
	const seen = /* @__PURE__ */ new Map();
	for (const output of outputs) {
		const count = counts.get(output.kind) ?? 1;
		const next = (seen.get(output.kind) ?? 0) + 1;
		seen.set(output.kind, next);
		const suffix = count > 1 ? ` ${next}/${count}` : "";
		const section = sectionByKind[output.kind];
		sections.push(formatSection(`${section.title}${suffix}`, section.label, output.text, outputs.length === 1 ? userText : void 0));
	}
	return sections.join("\n\n").trim();
}
/** Formats one or more audio transcript outputs for legacy transcript-only callers. */
function formatAudioTranscripts(outputs) {
	if (outputs.length === 1) {
		const [output] = outputs;
		if (output) return output.text;
		throw new Error("expected single audio transcript to be defined");
	}
	return outputs.map((output, index) => `Audio ${index + 1}:\n${output.text}`).join("\n\n");
}
//#endregion
//#region src/media-understanding/apply-capability.ts
async function runMediaCapability(params) {
	try {
		return await runCapability(params);
	} catch (err) {
		if (shouldLogVerbose()) logVerbose(`Media understanding task failed: ${String(err)}`);
		const selection = selectAttachments({
			capability: params.capability,
			attachments: params.media,
			policy: params.config?.attachments
		});
		return {
			outputs: [],
			decision: {
				capability: params.capability,
				outcome: "failed",
				attachments: [],
				attachmentDispositions: Object.fromEntries([...selection.selected.map(({ index }) => [index, { kind: "failed" }]), ...selection.droppedAttachmentIndexes.map((index) => [index, { kind: "not-selected" }])]),
				...params.capability === "image" ? { nativeVisionActive: false } : {}
			}
		};
	}
}
//#endregion
//#region src/media-understanding/file-attachment-outcomes.ts
const MIME_TYPE = String.raw`([a-z0-9!#$&^_.+-]+/[a-z0-9!#$&^_.+-]+)`;
const HTTP_TOKEN = String.raw`[a-z0-9!#$%&'*+.^_\x60|~-]+`;
const HTTP_QUOTED_STRING = String.raw`"(?:[\t !#-\[\]-~]|\\[\t -~])*"`;
const MIME_PARAMETER = String.raw`[ \t]*;[ \t]*${HTTP_TOKEN}=(?:${HTTP_TOKEN}|${HTTP_QUOTED_STRING})`;
const MIME_TYPE_WITH_OPTIONAL_PARAMS = new RegExp(String.raw`^${MIME_TYPE}(?:${MIME_PARAMETER})*$`, "i");
const MARKER_MIME_MAX_CHARS = 100;
function sanitizeMimeType(value) {
	const trimmed = normalizeOptionalString(value);
	if (!trimmed) return;
	return trimmed.match(MIME_TYPE_WITH_OPTIONAL_PARAMS)?.[1]?.toLowerCase();
}
function markerSafeMime(value) {
	const mime = sanitizeMimeType(value);
	return mime && mime.length <= MARKER_MIME_MAX_CHARS ? mime : void 0;
}
function wrapUntrustedAttachmentContent(content) {
	return wrapExternalContent(content, {
		source: "unknown",
		includeWarning: false
	});
}
const MARKER_LOCAL_PATH_MAX_CHARS = 300;
const POSIX_ABSOLUTE_PATH = /^\//;
const WINDOWS_ABSOLUTE_PATH = /^[A-Za-z]:\\/;
const MARKER_PATH_SAFE = /^[\p{L}\p{M}\p{N} /\\:._-]+$/u;
function markerSafeLocalPath(value, allowWorkspaceRelative = false) {
	if (!value || value.length > MARKER_LOCAL_PATH_MAX_CHARS) return;
	if (!(POSIX_ABSOLUTE_PATH.test(value) || WINDOWS_ABSOLUTE_PATH.test(value)) && (!allowWorkspaceRelative || value.includes("\\") || value.split("/").some((segment) => !segment || segment === "." || segment === ".."))) return;
	return MARKER_PATH_SAFE.test(value) ? value : void 0;
}
const SKIPPED_FILE_OUTCOME_KINDS = /* @__PURE__ */ new Set([
	"unsupported-format",
	"policy-rejected",
	"read-failure",
	"url-sources-disabled"
]);
function isSkippedFileOutcome(outcome) {
	return SKIPPED_FILE_OUTCOME_KINDS.has(outcome.kind);
}
function renderFileAttachmentOutcome(outcome, options) {
	switch (outcome.kind) {
		case "extracted": return wrapUntrustedAttachmentContent(outcome.text);
		case "rendered-to-images": return "[PDF content rendered to images]";
		case "no-extractable-text": return "[No extractable text]";
		case "unsupported-format": {
			const mime = markerSafeMime(outcome.mime);
			const formatClause = mime ? `Unsupported document format: ${mime}.` : "Unsupported document format.";
			const localPath = markerSafeLocalPath(options?.selfServeLocalPath === false ? void 0 : options?.selfServeLocalPath ?? outcome.localPath, typeof options?.selfServeLocalPath === "string");
			const formatHint = outcome.mime?.startsWith("application/vnd.openxmlformats-officedocument") ? " (this Office file is a zip archive containing XML)" : "";
			return localPath ? [`[${formatClause} The approved local file path follows as external attachment metadata. Its text is not extracted automatically. Read the file yourself with your tools before answering${formatHint}; do not ask the user to paste the contents.]`, wrapUntrustedAttachmentContent(localPath)].join("") : `[${formatClause} PDF and plain-text attachments can be read.]`;
		}
		case "policy-rejected": {
			const mime = markerSafeMime(outcome.mime);
			return mime ? `[Attachment type not allowed: ${mime}]` : "[Attachment type not allowed]";
		}
		case "read-failure": return "[Attachment could not be read]";
		case "url-sources-disabled": return "[Attachment skipped: URL file sources are disabled]";
		case "claimed-elsewhere": return null;
		default: return outcome;
	}
}
//#endregion
//#region src/media-understanding/file-extraction-limits.ts
const INBOUND_FILE_EXTRACTION_DEFAULT_MAX_MB = 20;
const INBOUND_FILE_EXTRACTION_MAX_BYTES_CAP = 25 * 1024 * 1024;
const INBOUND_FILE_EXTRACTION_DEFAULT_MAX_PAGES = 20;
const INBOUND_FILE_EXTRACTION_MAX_PAGES_CAP = 150;
function resolveInboundFileExtractionMaxBytes(defaults) {
	const maxMb = asPositiveFiniteNumber(defaults?.mediaMaxMb) ?? INBOUND_FILE_EXTRACTION_DEFAULT_MAX_MB;
	return Math.min(Math.floor(maxMb * 1024 * 1024), INBOUND_FILE_EXTRACTION_MAX_BYTES_CAP);
}
function resolveInboundFileExtractionMaxPages(defaults) {
	const pages = asPositiveFiniteNumber(defaults?.pdfMaxPages) ?? INBOUND_FILE_EXTRACTION_DEFAULT_MAX_PAGES;
	return Math.min(Math.trunc(pages), INBOUND_FILE_EXTRACTION_MAX_PAGES_CAP);
}
/** Builds inbound attachment extraction limits, sized to the agent's media/PDF config. */
function resolveFileExtractionLimits(cfg) {
	const files = cfg.gateway?.http?.endpoints?.responses?.files;
	const allowedMimesConfigured = Boolean(files?.allowedMimes?.length);
	const defaults = cfg.agents?.defaults;
	return {
		...resolveInputFileLimits({
			...files,
			maxBytes: files?.maxBytes ?? resolveInboundFileExtractionMaxBytes(defaults),
			pdf: {
				...files?.pdf,
				maxPages: files?.pdf?.maxPages ?? resolveInboundFileExtractionMaxPages(defaults)
			}
		}),
		allowedMimesConfigured
	};
}
//#endregion
//#region src/media-understanding/media-attachment-outcomes.ts
function renderSkippedFileOverflowSummary(count) {
	return `[${count} more attachment${count === 1 ? "" : "s"} skipped]`;
}
function renderMediaAttachmentDisposition(capability, disposition) {
	const label = `${capability[0]?.toUpperCase()}${capability.slice(1)}`;
	switch (disposition.kind) {
		case "handled":
		case "handed-to-native-vision": return null;
		case "not-selected": return `[${label} attachment not processed: attachment limit reached]`;
		case "capability-disabled": return `[${label} attachment not analyzed: ${capability} understanding is disabled]`;
		case "no-model": return `[${label} attachment not analyzed: no ${capability}-understanding model is configured]`;
		case "scope-denied": return `[${label} attachment not analyzed in this chat]`;
		case "failed": return `[${label} attachment could not be analyzed]`;
		default: return disposition;
	}
}
//#endregion
//#region src/media-understanding/apply.ts
const CAPABILITY_ORDER = [
	"image",
	"audio",
	"video"
];
const AUDIO_ONLY_CAPABILITY_ORDER = ["audio"];
const EMPTY_VOICE_NOTE_PLACEHOLDER = "[Voice note could not be transcribed because the audio attachment was too small]";
function appendFileBlocks(body, blocks) {
	if (!blocks || blocks.length === 0) return body ?? "";
	const base = typeof body === "string" ? body.trim() : "";
	const suffix = blocks.join("\n\n").trim();
	if (!base) return suffix;
	return `${base}\n\n${suffix}`.trim();
}
function buildSyntheticSkippedAudioOutputs(decisions) {
	const audioDecision = decisions.find((decision) => decision.capability === "audio");
	if (!audioDecision) return [];
	return audioDecision.attachments.flatMap((attachment) => {
		if (!attachment.attempts.some((attempt) => attempt.reason?.trim().startsWith("tooSmall"))) return [];
		return [{
			kind: "audio.transcription",
			attachmentIndex: attachment.attachmentIndex,
			text: EMPTY_VOICE_NOTE_PLACEHOLDER,
			provider: "openclaw",
			model: "synthetic-empty-audio"
		}];
	});
}
function attachmentUrlDisplayName(url) {
	try {
		return new URL(url).pathname.split("/").findLast((segment) => segment.length > 0) || void 0;
	} catch {
		return;
	}
}
async function classifyFileAttachment(params) {
	const { attachment, cache, cfg, limits, skipAttachmentIndexes } = params;
	const attachmentFilename = attachment.path ?? (attachment.url ? attachmentUrlDisplayName(attachment.url) : void 0);
	if (skipAttachmentIndexes?.has(attachment.index)) return { outcome: { kind: "claimed-elsewhere" } };
	const extensionMime = mimeTypeFromFilePath(attachmentFilename);
	const forcedTextMime = attachmentClassFromMime(extensionMime) === "text" ? extensionMime : void 0;
	const kind = forcedTextMime ? "document" : resolveAttachmentKind(attachment);
	if (!forcedTextMime && (kind === "image" || kind === "video" || kind === "audio")) return { outcome: { kind: "claimed-elsewhere" } };
	if (!limits.allowUrl && attachment.url && !attachment.path && !classifyMediaReferenceSource(attachment.url).isMediaStoreUrl) {
		if (shouldLogVerbose()) logVerbose(`media: file attachment skipped (url disabled) index=${attachment.index}`);
		return {
			outcome: { kind: "url-sources-disabled" },
			filename: attachmentFilename
		};
	}
	let bufferResult;
	try {
		bufferResult = await cache.getBuffer({
			attachmentIndex: attachment.index,
			maxBytes: limits.maxBytes,
			timeoutMs: limits.timeoutMs
		});
	} catch (err) {
		if (shouldLogVerbose()) logVerbose(`media: file attachment skipped (buffer): ${String(err)}`);
		return {
			outcome: { kind: "read-failure" },
			filename: attachmentFilename
		};
	}
	const filename = bufferResult?.fileName;
	const classification = bufferResult.classification;
	const classifiedMime = sanitizeMimeType(classification.mime);
	const binaryMime = sanitizeMimeType(normalizeMimeType(attachment.mime)) ?? classifiedMime;
	const selfServeLocalPath = bufferResult.localPath;
	if (classification.class !== "text" && !(classification.class === "document" && classification.mime === "application/pdf")) {
		if (limits.allowedMimesConfigured && !(classifiedMime && limits.allowedMimes.has(classifiedMime))) return {
			outcome: {
				kind: "policy-rejected",
				mime: classifiedMime ?? binaryMime
			},
			filename,
			mimeType: classifiedMime ?? binaryMime
		};
		return {
			outcome: {
				kind: "unsupported-format",
				mime: binaryMime,
				...selfServeLocalPath ? { localPath: selfServeLocalPath } : {}
			},
			filename,
			mimeType: binaryMime
		};
	}
	const mimeType = sanitizeMimeType(classification.mime);
	if (classification.class === "text" && attachment.mime && normalizeMimeType(attachment.mime) !== classification.mime) logVerbose(`media: MIME override from "${attachment.mime}" to "${classification.mime}" for index=${attachment.index}`);
	if (!mimeType) {
		if (shouldLogVerbose()) logVerbose(`media: file attachment skipped (unknown mime) index=${attachment.index}`);
		return {
			outcome: { kind: "unsupported-format" },
			filename
		};
	}
	const allowedMimes = new Set(limits.allowedMimes);
	if (!limits.allowedMimesConfigured && classification.class === "text") allowedMimes.add(mimeType);
	if (!allowedMimes.has(mimeType)) {
		if (shouldLogVerbose()) logVerbose(`media: file attachment skipped (unsupported mime ${mimeType}) index=${attachment.index}`);
		return {
			outcome: limits.allowedMimesConfigured ? {
				kind: "policy-rejected",
				mime: mimeType
			} : {
				kind: "unsupported-format",
				mime: mimeType,
				...selfServeLocalPath ? { localPath: selfServeLocalPath } : {}
			},
			filename,
			mimeType
		};
	}
	let extracted;
	try {
		const { allowedMimesConfigured: _allowedMimesConfigured, ...baseLimits } = limits;
		extracted = await extractFileContentFromSource({
			source: {
				type: "base64",
				data: bufferResult.buffer.toString("base64"),
				mediaType: mimeType,
				filename: bufferResult.fileName
			},
			limits: {
				...baseLimits,
				allowedMimes
			},
			config: cfg,
			classification
		});
	} catch (err) {
		if (shouldLogVerbose()) logVerbose(`media: file attachment skipped (extract): ${String(err)}`);
		return {
			outcome: { kind: "read-failure" },
			filename,
			mimeType
		};
	}
	const text = extracted?.text?.trim() ?? "";
	const extractedImages = extracted?.images ?? [];
	if (text) return {
		outcome: {
			kind: "extracted",
			text,
			images: extractedImages
		},
		filename,
		mimeType
	};
	if (extractedImages.length > 0) return {
		outcome: {
			kind: "rendered-to-images",
			images: extractedImages
		},
		filename,
		mimeType
	};
	return {
		outcome: { kind: "no-extractable-text" },
		filename,
		mimeType
	};
}
async function extractFileContext(params) {
	const { attachments, cache, cfg, limits, skipAttachmentIndexes } = params;
	if (!attachments || attachments.length === 0) return {
		blocks: [],
		images: [],
		localPathSelfServeUpgrades: []
	};
	const blocks = [];
	const images = [];
	const localPathSelfServeUpgrades = [];
	for (const attachment of attachments) {
		if (!attachment) continue;
		const { outcome, filename, mimeType } = await classifyFileAttachment({
			attachment,
			cache,
			cfg,
			limits,
			skipAttachmentIndexes
		});
		if (outcome.kind === "extracted" || outcome.kind === "rendered-to-images") images.push(...outcome.images.map((image) => ({
			...image,
			attachmentIndex: attachment.index
		})));
		const blockText = renderFileAttachmentOutcome(outcome, { selfServeLocalPath: params.selfServePathsEnabled ? void 0 : false });
		if (blockText === null) continue;
		const renderBlock = (content) => renderFileContextBlock({
			filename,
			fallbackName: `file-${attachment.index + 1}`,
			mimeType,
			content
		});
		const text = renderBlock(blockText);
		blocks.push({
			text,
			consumesMarkerBudget: isSkippedFileOutcome(outcome)
		});
		if (outcome.kind === "unsupported-format" && outcome.localPath) {
			const fallback = renderFileAttachmentOutcome(outcome, { selfServeLocalPath: false });
			const selfServe = renderFileAttachmentOutcome(outcome);
			if (fallback && selfServe) localPathSelfServeUpgrades.push({
				attachmentIndex: attachment.index,
				fallback: renderBlock(fallback),
				render: (path) => {
					const rendered = renderFileAttachmentOutcome(outcome, path ? { selfServeLocalPath: path } : void 0);
					return rendered ? renderBlock(rendered) : void 0;
				}
			});
		}
	}
	return {
		blocks,
		images,
		localPathSelfServeUpgrades
	};
}
const SELF_SERVE_CONTEXT_FIELDS = [
	"Body",
	"BodyForAgent",
	"agentText"
];
function enableLocalPathSelfServe(upgrades, contexts, stagedPaths) {
	for (const context of contexts) for (const upgrade of upgrades) {
		const stagedPath = stagedPaths?.get(upgrade.attachmentIndex);
		if (stagedPaths && !stagedPath) continue;
		const selfServe = upgrade.render(stagedPath);
		if (!selfServe) continue;
		for (const field of SELF_SERVE_CONTEXT_FIELDS) {
			const value = context[field];
			if (typeof value === "string") context[field] = value.replace(upgrade.fallback, selfServe);
		}
	}
}
function renderMediaAttachmentMarkers(params) {
	const handledIndexes = new Set(params.outputs.map((output) => output.attachmentIndex));
	const decisions = new Map(params.decisions.map((decision) => [decision.capability, decision]));
	return params.attachments.flatMap((attachment) => {
		const capability = resolveAttachmentKind(attachment);
		if (capability !== "image" && capability !== "audio" && capability !== "video") return [];
		if (capability === "image" && params.deliveredImageIndexes?.has(attachment.index)) return [];
		const decision = decisions.get(capability);
		if (!decision || handledIndexes.has(attachment.index)) return [];
		const disposition = decision.attachmentDispositions?.[attachment.index];
		if (capability === "image" && decision.nativeVisionActive !== false && disposition?.kind !== "failed") return [];
		const text = disposition ? renderMediaAttachmentDisposition(capability, disposition) : null;
		return text ? [{
			text,
			consumesMarkerBudget: true
		}] : [];
	});
}
function applyAttachmentMarkerBudget(blocks) {
	const rendered = [];
	let markers = 0;
	let overflow = 0;
	for (const block of blocks) {
		if (block.consumesMarkerBudget && markers >= 5) {
			overflow += 1;
			continue;
		}
		markers += Number(block.consumesMarkerBudget);
		rendered.push(block.text);
	}
	return overflow > 0 ? [...rendered, renderSkippedFileOverflowSummary(overflow)] : rendered;
}
async function applyMediaUnderstanding(params) {
	const { ctx, cfg } = params;
	const originalUserText = [
		ctx.CommandBody,
		ctx.RawBody,
		ctx.Body
	].map((value) => normalizeOptionalString(value)).find((value) => value && value.trim()) ?? void 0;
	const attachments = normalizeMediaAttachments(ctx);
	const providerRegistry = buildProviderRegistry(params.providers, cfg);
	const cache = createMediaAttachmentCache(attachments, {
		localPathRoots: resolveMediaAttachmentLocalRoots({
			cfg,
			ctx,
			workspaceDir: params.workspaceDir
		}),
		ssrfPolicy: cfg.tools?.web?.fetch?.ssrfPolicy,
		workspaceDir: params.workspaceDir
	});
	try {
		const results = await pMap(params.processingMode === "audio-only" ? AUDIO_ONLY_CAPABILITY_ORDER : CAPABILITY_ORDER, async (capability) => await runMediaCapability({
			capability,
			cfg,
			ctx,
			attachments: cache,
			media: attachments,
			agentId: params.agentId,
			agentDir: params.agentDir,
			workspaceDir: params.workspaceDir,
			providerRegistry,
			config: cfg.tools?.media?.[capability],
			activeModel: params.activeModel
		}), {
			concurrency: resolveConcurrency(cfg),
			stopOnError: false
		});
		const outputs = [];
		const decisions = [];
		for (const entry of results) {
			for (const output of entry.outputs) outputs.push(output);
			decisions.push(entry.decision);
		}
		const audioOutputAttachmentIndexes = new Set(outputs.filter((output) => output.kind === "audio.transcription").map((output) => output.attachmentIndex));
		const syntheticSkippedAudioOutputs = buildSyntheticSkippedAudioOutputs(decisions).filter((output) => !audioOutputAttachmentIndexes.has(output.attachmentIndex));
		if (syntheticSkippedAudioOutputs.length > 0) {
			const audioAttachmentOrder = decisions.find((decision) => decision.capability === "audio")?.attachments.map((attachment) => attachment.attachmentIndex) ?? [];
			const audioOutputsByAttachmentIndex = /* @__PURE__ */ new Map();
			for (const output of outputs) if (output.kind === "audio.transcription") audioOutputsByAttachmentIndex.set(output.attachmentIndex, output);
			for (const output of syntheticSkippedAudioOutputs) audioOutputsByAttachmentIndex.set(output.attachmentIndex, output);
			const mergedAudio = audioAttachmentOrder.map((attachmentIndex) => audioOutputsByAttachmentIndex.get(attachmentIndex)).filter((output) => Boolean(output));
			const firstAudioIdx = outputs.findIndex((o) => o.kind === "audio.transcription");
			if (firstAudioIdx >= 0) {
				const before = outputs.slice(0, firstAudioIdx);
				const afterLastAudio = outputs.slice(outputs.reduce((last, o, i) => o.kind === "audio.transcription" ? i : last, firstAudioIdx) + 1);
				outputs.length = 0;
				outputs.push(...before, ...mergedAudio, ...afterLastAudio);
			} else {
				const firstVideoIdx = outputs.findIndex((o) => o.kind === "video.description");
				const audioInsertIdx = firstVideoIdx >= 0 ? firstVideoIdx : outputs.length;
				outputs.splice(audioInsertIdx, 0, ...mergedAudio);
			}
		}
		if (decisions.length > 0) ctx.MediaUnderstandingDecisions = [...ctx.MediaUnderstandingDecisions ?? [], ...decisions];
		if (outputs.length > 0) {
			ctx.Body = formatMediaUnderstandingBody({
				body: ctx.Body,
				outputs
			});
			const audioOutputs = outputs.filter((output) => output.kind === "audio.transcription");
			if (audioOutputs.length > 0) {
				const transcript = formatAudioTranscripts(audioOutputs);
				ctx.Transcript = transcript;
				if (originalUserText) {
					ctx.CommandBody = originalUserText;
					ctx.RawBody = originalUserText;
				} else {
					ctx.CommandBody = transcript;
					ctx.RawBody = transcript;
				}
				const audioCfg = cfg.tools?.media?.audio;
				if (audioCfg?.echoTranscript && transcript) await sendTranscriptEcho({
					ctx,
					cfg,
					transcript,
					format: audioCfg.echoFormat ?? "📝 \"{transcript}\""
				});
			} else if (originalUserText) {
				ctx.CommandBody = originalUserText;
				ctx.RawBody = originalUserText;
			}
			ctx.MediaUnderstanding = [...ctx.MediaUnderstanding ?? [], ...outputs];
		}
		const syntheticAudioIndexes = new Set(syntheticSkippedAudioOutputs.map((o) => o.attachmentIndex));
		const audioAttachmentIndexes = new Set(outputs.filter((output) => output.kind === "audio.transcription" && !syntheticAudioIndexes.has(output.attachmentIndex)).map((output) => output.attachmentIndex));
		const fileContext = params.processingMode === "audio-only" ? {
			blocks: [],
			images: [],
			localPathSelfServeUpgrades: []
		} : await extractFileContext({
			attachments,
			cache,
			cfg,
			limits: resolveFileExtractionLimits(cfg),
			skipAttachmentIndexes: audioAttachmentIndexes.size > 0 ? audioAttachmentIndexes : void 0,
			selfServePathsEnabled: params.selfServeLocalPaths === true
		});
		const mediaMarkers = params.processingMode === "audio-only" ? [] : renderMediaAttachmentMarkers({
			attachments,
			decisions,
			outputs,
			deliveredImageIndexes: params.deliveredImageIndexes
		});
		const contextBlocks = applyAttachmentMarkerBudget([...fileContext.blocks, ...mediaMarkers]);
		if (contextBlocks.length > 0) ctx.Body = appendFileBlocks(ctx.Body, contextBlocks);
		if (outputs.length > 0 || contextBlocks.length > 0) finalizeInboundContext(ctx, {
			forceBodyForAgent: true,
			forceBodyForCommands: true
		});
		return {
			outputs,
			decisions,
			extractedFileImages: fileContext.images,
			appliedImage: outputs.some((output) => output.kind === "image.description"),
			appliedAudio: outputs.some((output) => output.kind === "audio.transcription"),
			appliedVideo: outputs.some((output) => output.kind === "video.description"),
			appliedFile: fileContext.blocks.length > 0,
			...fileContext.localPathSelfServeUpgrades.length > 0 ? { enableLocalPathSelfServe: (contexts, stagedPaths) => enableLocalPathSelfServe(fileContext.localPathSelfServeUpgrades, contexts, stagedPaths) } : {}
		};
	} finally {
		await cache.cleanup();
	}
}
//#endregion
export { applyMediaUnderstanding as t };
