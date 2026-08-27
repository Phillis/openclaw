import "./src-BntaCZM-.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { i as isSilentReplyPayloadText } from "./tokens-DbQz-n_m.js";
import { _ as parseCanonicalIpAddress, c as isIpv4Address, i as isCanonicalDottedDecimalIPv4, n as isBlockedSpecialUseIpv4Address, r as isBlockedSpecialUseIpv6Address, t as extractEmbeddedIpv4FromIpv6, u as isLegacyIpv4Literal, v as parseLooseIpAddress } from "./ip-Bc6HA4HC.js";
import { t as hasHttpUrlPrefix } from "./url-protocol-OU3K-ySz.js";
import { i as stripInlineDirectiveTagsForDelivery, t as parseInlineDirectives } from "./directive-tags-DqL78ij5.js";
import { r as parseFenceSpans } from "./fences-rLVnT2kD.js";
//#region src/media/audio-tags.ts
/**
* Extract audio mode tag from text.
* Supports [[audio_as_voice]] to send audio as voice message instead of file.
* Default is file (preserves backward compatibility).
*/
function parseAudioTag(text) {
	const result = parseInlineDirectives(text, { stripReplyTags: false });
	return {
		text: result.text,
		audioAsVoice: result.audioAsVoice,
		hadTag: result.hasAudioTag
	};
}
//#endregion
//#region src/media/parse.ts
/** Captures legacy MEDIA: attachment directives from model/tool output. */
const MEDIA_TOKEN_RE = /\bMEDIA:\s*`?([^\n]+)`?/gi;
const FILE_URL_PREFIX_RE = /^file:(?:\/\/)?/i;
/** Converts file URLs into plain local paths before downstream media validation. */
function normalizeMediaSource(src) {
	return src.replace(FILE_URL_PREFIX_RE, "");
}
const TRAILING_SERIALIZED_JSON_AFTER_EXT_RE = /^(.*\.\w{1,10})\\?"(?=[\]},:]|$).*/s;
function cleanCandidate(raw) {
	const stripped = raw.replace(/^[`"'[{(]+/, "").replace(/[`"'\\})\],]+$/, "");
	return TRAILING_SERIALIZED_JSON_AFTER_EXT_RE.exec(stripped)?.[1] ?? stripped;
}
const WINDOWS_DRIVE_RE = /^[a-zA-Z]:[\\/]/;
const MEDIA_SOURCE_ROOT_RE = /^(?:[a-z]:[\\/]|[/~]|\.{1,2}[\\/]|\\\\)/i;
const SCHEME_RE = /^[a-zA-Z][a-zA-Z0-9+.-]*:/;
const HAS_FILE_EXT = /\.\w{1,10}$/;
const TRAVERSAL_SEGMENT_RE = /(?:^|[/\\])\.\.(?:[/\\]|$)/;
function isSupportedHomeRelativePath(candidate) {
	return candidate.startsWith("~/") || candidate.startsWith("~\\");
}
function hasTraversalOrUnsupportedHomeDirPrefix(candidate) {
	return candidate.startsWith("../") || candidate === ".." || candidate.startsWith("~") && !isSupportedHomeRelativePath(candidate) || TRAVERSAL_SEGMENT_RE.test(candidate);
}
function looksLikeLocalFilePath(candidate) {
	return candidate.startsWith("/") || candidate.startsWith("./") || candidate.startsWith("../") || candidate.startsWith("~") || WINDOWS_DRIVE_RE.test(candidate) || candidate.startsWith("\\\\") || !SCHEME_RE.test(candidate) && (candidate.includes("/") || candidate.includes("\\"));
}
function isLikelyLocalPath(candidate) {
	if (hasTraversalOrUnsupportedHomeDirPrefix(candidate)) return false;
	return candidate.startsWith("/") || candidate.startsWith("./") || isSupportedHomeRelativePath(candidate) || WINDOWS_DRIVE_RE.test(candidate) || candidate.startsWith("\\\\") || !SCHEME_RE.test(candidate) && (candidate.includes("/") || candidate.includes("\\"));
}
function normalizeRemoteMediaHostname(value) {
	const normalized = value.trim().toLowerCase().replace(/^\[|\]$/g, "").replace(/\.+$/, "");
	if (normalized.split(".").some((label) => label.length === 0)) return "";
	return normalized;
}
function isBlockedRemoteMediaHostname(hostname) {
	const normalized = normalizeRemoteMediaHostname(hostname);
	if (!normalized) return true;
	if (!normalized.includes(".")) return true;
	if (normalized === "localhost" || normalized === "localhost.localdomain" || normalized === "metadata.google.internal" || normalized.endsWith(".localhost") || normalized.endsWith(".local") || normalized.endsWith(".internal")) return true;
	const strictIp = parseCanonicalIpAddress(normalized);
	if (strictIp) {
		if (isIpv4Address(strictIp)) return isBlockedSpecialUseIpv4Address(strictIp);
		if (isBlockedSpecialUseIpv6Address(strictIp)) return true;
		const embeddedIpv4 = extractEmbeddedIpv4FromIpv6(strictIp);
		return embeddedIpv4 ? isBlockedSpecialUseIpv4Address(embeddedIpv4) : false;
	}
	if (normalized.includes(":") && !parseLooseIpAddress(normalized)) return true;
	return !isCanonicalDottedDecimalIPv4(normalized) && isLegacyIpv4Literal(normalized);
}
function isAllowedRemoteMediaUrl(candidate) {
	try {
		const parsed = new URL(candidate);
		return parsed.protocol === "https:" && !parsed.username && !parsed.password && !isBlockedRemoteMediaHostname(parsed.hostname);
	} catch {
		return false;
	}
}
function isValidMedia(candidate, opts) {
	if (!candidate) return false;
	if (candidate.length > 4096) return false;
	if (!opts?.allowSpaces && /\s/.test(candidate)) return false;
	if (hasHttpUrlPrefix(candidate)) return isAllowedRemoteMediaUrl(candidate);
	if (isLikelyLocalPath(candidate)) return true;
	if (hasTraversalOrUnsupportedHomeDirPrefix(candidate)) return false;
	if (opts?.allowBareFilename && !SCHEME_RE.test(candidate) && HAS_FILE_EXT.test(candidate)) return true;
	return false;
}
function beginsIndependentMediaSource(raw) {
	const candidate = normalizeMediaSource(cleanCandidate(raw));
	return MEDIA_SOURCE_ROOT_RE.test(candidate) || SCHEME_RE.test(candidate);
}
function splitUnquotedMediaDirectiveParts(payload) {
	const parts = [];
	let previousEnd = 0;
	for (const match of payload.matchAll(/\S+/g)) {
		const candidate = normalizeMediaSource(cleanCandidate(match[0]));
		const previous = parts.at(-1);
		const previousCandidate = previous ? normalizeMediaSource(cleanCandidate(previous)) : "";
		if (MEDIA_SOURCE_ROOT_RE.test(previousCandidate) && !beginsIndependentMediaSource(candidate) && (!HAS_FILE_EXT.test(previousCandidate) || !isValidMedia(candidate))) parts[parts.length - 1] = `${previous}${payload.slice(previousEnd, match.index)}${match[0]}`;
		else parts.push(match[0]);
		previousEnd = match.index + match[0].length;
	}
	return parts;
}
function unwrapQuoted(value) {
	const trimmed = value.trim();
	if (trimmed.length < 2) return;
	const first = trimmed[0];
	if (first !== trimmed[trimmed.length - 1]) return;
	if (first !== `"` && first !== "'" && first !== "`") return;
	return trimmed.slice(1, -1).trim();
}
function normalizeMarkdownImageDestination(destination) {
	return normalizeMediaSource(cleanCandidate(unwrapQuoted(destination) ?? destination));
}
function mayContainFenceMarkers(input) {
	return input.includes("```") || input.includes("~~~");
}
function cleanLineText(text) {
	return text.replace(/[ \t]{2,}/g, " ").trim();
}
const MAX_MARKDOWN_IMAGE_LINE_LENGTH = 2e4;
const MAX_MARKDOWN_IMAGE_ATTEMPTS_PER_LINE = 80;
const MAX_MARKDOWN_IMAGE_MATCHES_PER_LINE = 50;
function findMatchingBracket(input, start, open, close) {
	let depth = 1;
	for (let i = start; i < input.length; i += 1) {
		const ch = input[i];
		if (ch === "\\") {
			i += 1;
			continue;
		}
		if (ch === open) {
			depth += 1;
			continue;
		}
		if (ch !== close) continue;
		depth -= 1;
		if (depth === 0) return i;
	}
}
function isRemoteMarkdownImageMedia(candidate) {
	return hasHttpUrlPrefix(candidate) && isValidMedia(candidate);
}
function parseMarkdownTitle(input, start) {
	let index = start;
	while (index < input.length && /\s/.test(input[index] ?? "")) index += 1;
	const opener = input[index];
	if (!opener) return;
	const closer = opener === "\"" || opener === "'" ? opener : opener === "(" ? ")" : null;
	if (!closer) return;
	const closingIndex = opener === "(" ? findMatchingBracket(input, index + 1, "(", ")") : (() => {
		for (let i = index + 1; i < input.length; i += 1) {
			const ch = input[i];
			if (ch === "\\") {
				i += 1;
				continue;
			}
			if (ch === closer) return i;
		}
	})();
	if (closingIndex == null) return;
	let tailIndex = closingIndex + 1;
	while (tailIndex < input.length && /\s/.test(input[tailIndex] ?? "")) tailIndex += 1;
	return input[tailIndex] === ")" ? tailIndex + 1 : void 0;
}
function parseMarkdownImageDestination(input, start) {
	let index = start;
	while (index < input.length && /\s/.test(input[index] ?? "")) index += 1;
	if (index >= input.length) return;
	if (input[index] === "<") {
		let closing = index + 1;
		while (closing < input.length) {
			const ch = input[closing];
			if (ch === "\\") {
				closing += 2;
				continue;
			}
			if (ch === ">") {
				const destination = input.slice(index + 1, closing).trim();
				if (!destination) return;
				let tailIndex = closing + 1;
				while (tailIndex < input.length && /\s/.test(input[tailIndex] ?? "")) tailIndex += 1;
				if (input[tailIndex] === ")") return {
					destination,
					end: tailIndex + 1
				};
				const titledEnd = parseMarkdownTitle(input, tailIndex);
				return titledEnd ? {
					destination,
					end: titledEnd
				} : void 0;
			}
			closing += 1;
		}
		return;
	}
	const destinationStart = index;
	let destinationEnd = index;
	let parenDepth = 0;
	while (index < input.length) {
		const ch = input.charAt(index);
		if (ch === "\\") {
			index += 2;
			destinationEnd = index;
			continue;
		}
		if (ch === "(") {
			parenDepth += 1;
			index += 1;
			destinationEnd = index;
			continue;
		}
		if (ch === ")") {
			if (parenDepth === 0) {
				const destination = input.slice(destinationStart, destinationEnd).trim();
				return destination ? {
					destination,
					end: index + 1
				} : void 0;
			}
			parenDepth -= 1;
			index += 1;
			destinationEnd = index;
			continue;
		}
		if (/\s/.test(ch) && parenDepth === 0) {
			const destination = input.slice(destinationStart, destinationEnd).trim();
			if (!destination) return;
			const titledEnd = parseMarkdownTitle(input, index);
			return titledEnd ? {
				destination,
				end: titledEnd
			} : void 0;
		}
		index += 1;
		destinationEnd = index;
	}
}
function findMarkdownImageMatches(line) {
	if (line.length > MAX_MARKDOWN_IMAGE_LINE_LENGTH) return [];
	const matches = [];
	let searchIndex = 0;
	let attempts = 0;
	while (matches.length < MAX_MARKDOWN_IMAGE_MATCHES_PER_LINE && attempts < MAX_MARKDOWN_IMAGE_ATTEMPTS_PER_LINE) {
		const index = line.indexOf("![", searchIndex);
		if (index < 0) break;
		attempts += 1;
		const altEnd = findMatchingBracket(line, index + 2, "[", "]");
		if (altEnd == null || line[altEnd + 1] !== "(") {
			searchIndex = index + 2;
			continue;
		}
		const parsed = parseMarkdownImageDestination(line, altEnd + 2);
		if (!parsed) {
			searchIndex = index + 2;
			continue;
		}
		matches.push({
			start: index,
			end: parsed.end,
			destination: parsed.destination
		});
		searchIndex = parsed.end;
	}
	return matches;
}
function collectMarkdownImageSegments(params) {
	const matches = findMarkdownImageMatches(params.line);
	if (matches.length === 0) return {
		lineSegments: [],
		foundMedia: false
	};
	const segmentPieces = [];
	const visiblePieces = [];
	const lineSegments = [];
	let cursor = 0;
	let foundMedia = false;
	for (const match of matches) {
		const before = params.line.slice(cursor, match.start);
		segmentPieces.push(before);
		visiblePieces.push(before);
		const target = normalizeMarkdownImageDestination(match.destination);
		const selectedTarget = params.allowlist?.get(target);
		if (selectedTarget || !params.allowlist && isRemoteMarkdownImageMedia(target)) {
			const beforeText = cleanLineText(segmentPieces.join(""));
			if (beforeText) lineSegments.push({
				type: "text",
				text: beforeText
			});
			segmentPieces.length = 0;
			const mediaTarget = selectedTarget ?? target;
			params.media.push(mediaTarget);
			lineSegments.push({
				type: "media",
				url: mediaTarget
			});
			foundMedia = true;
		} else {
			const original = params.line.slice(match.start, match.end);
			segmentPieces.push(original);
			visiblePieces.push(original);
		}
		cursor = match.end;
	}
	const after = params.line.slice(cursor);
	segmentPieces.push(after);
	visiblePieces.push(after);
	const trailingText = cleanLineText(segmentPieces.join(""));
	if (trailingText) lineSegments.push({
		type: "text",
		text: trailingText
	});
	return {
		cleanedLine: cleanLineText(visiblePieces.join("")) || void 0,
		lineSegments,
		foundMedia
	};
}
/** Splits tool/stdout text into visible text, media attachments, voice tags, and ordered segments. */
function splitMediaFromOutput(raw, options = {}) {
	const trimmedRaw = raw.trimEnd();
	if (!trimmedRaw.trim()) return { text: "" };
	const markdownImageAllowlist = options.markdownImageAllowlist === void 0 ? void 0 : new Map(options.markdownImageAllowlist.map((source) => [normalizeMarkdownImageDestination(source), source]));
	const extractMarkdownImages = markdownImageAllowlist !== void 0 || options.extractMarkdownImages === true;
	const extractMediaDirectives = options.extractMediaDirectives !== false;
	const mayContainMediaToken = extractMediaDirectives && /media:/i.test(trimmedRaw);
	const mayContainMarkdownImage = extractMarkdownImages && /!\[[^\]]*]\(/.test(trimmedRaw);
	const mayContainAudioTag = trimmedRaw.includes("[[");
	if (!mayContainMediaToken && !mayContainMarkdownImage && !mayContainAudioTag) return { text: trimmedRaw };
	const media = [];
	let foundMediaToken = false;
	const segments = [];
	let lastTextSegment;
	const pushTextSegment = (text) => {
		const last = segments[segments.length - 1];
		if (last?.type === "text") last.text = `${last.text}\n${text.trim() ? text : ""}`;
		else if (!text.trim()) {
			if (last?.type === "media" && lastTextSegment && !lastTextSegment.text.endsWith("\n")) lastTextSegment.text += "\n";
		} else {
			lastTextSegment = {
				type: "text",
				text
			};
			segments.push(lastTextSegment);
		}
	};
	const fenceSpans = mayContainFenceMarkers(trimmedRaw) ? parseFenceSpans(trimmedRaw) : [];
	const lines = trimmedRaw.split("\n");
	const keptLines = [];
	let lineOffset = 0;
	for (const line of lines) {
		if (fenceSpans.some((span) => lineOffset >= span.start && lineOffset < span.end)) {
			keptLines.push(line);
			pushTextSegment(line);
			lineOffset += line.length + 1;
			continue;
		}
		const trimmedStart = line.trimStart();
		if (!extractMediaDirectives || !trimmedStart.toUpperCase().startsWith("MEDIA:")) {
			const markdownImageResult = extractMarkdownImages ? collectMarkdownImageSegments({
				line,
				media,
				allowlist: markdownImageAllowlist
			}) : {
				lineSegments: [],
				foundMedia: false
			};
			if (!markdownImageResult.foundMedia) {
				keptLines.push(line);
				pushTextSegment(line);
			} else {
				foundMediaToken = true;
				if (markdownImageResult.cleanedLine) keptLines.push(markdownImageResult.cleanedLine);
				for (const segment of markdownImageResult.lineSegments) {
					if (segment.type === "text") {
						pushTextSegment(segment.text);
						continue;
					}
					segments.push(segment);
				}
			}
			lineOffset += line.length + 1;
			continue;
		}
		const matches = Array.from(line.matchAll(MEDIA_TOKEN_RE));
		if (matches.length === 0) {
			keptLines.push(line);
			pushTextSegment(line);
			lineOffset += line.length + 1;
			continue;
		}
		const pieces = [];
		const lineSegments = [];
		let cursor = 0;
		for (const match of matches) {
			const start = match.index ?? 0;
			pieces.push(line.slice(cursor, start));
			const payload = expectDefined(match[1], "parse regex capture 1");
			const unwrapped = unwrapQuoted(payload);
			const payloadValue = unwrapped ?? payload;
			const parts = unwrapped ? [unwrapped] : splitUnquotedMediaDirectiveParts(payload);
			const mediaStartIndex = media.length;
			let validCount = 0;
			const invalidParts = [];
			let hasValidMedia = false;
			for (const part of parts) {
				const candidate = normalizeMediaSource(cleanCandidate(part));
				if (isValidMedia(candidate, unwrapped || /\s/.test(part) ? { allowSpaces: true } : void 0)) {
					media.push(candidate);
					hasValidMedia = true;
					foundMediaToken = true;
					validCount += 1;
				} else if (!/\s/.test(part) || !hasTraversalOrUnsupportedHomeDirPrefix(candidate)) invalidParts.push(part);
			}
			const trimmedPayload = payloadValue.trim();
			const looksLikeLocalPath = looksLikeLocalFilePath(trimmedPayload) || FILE_URL_PREFIX_RE.test(trimmedPayload);
			if (!unwrapped && validCount === 1 && invalidParts.length > 0 && !parts.slice(1).some(beginsIndependentMediaSource) && /\s/.test(payloadValue) && looksLikeLocalPath) {
				const fallback = normalizeMediaSource(cleanCandidate(payloadValue));
				if (isValidMedia(fallback, { allowSpaces: true })) {
					media.splice(mediaStartIndex, media.length - mediaStartIndex, fallback);
					hasValidMedia = true;
					foundMediaToken = true;
					invalidParts.length = 0;
				}
			}
			if (!hasValidMedia && !unwrapped && /\s/.test(payloadValue)) {
				const spacedFallback = normalizeMediaSource(cleanCandidate(payloadValue));
				if (isValidMedia(spacedFallback, {
					allowSpaces: true,
					allowBareFilename: true
				})) {
					media.splice(mediaStartIndex, media.length - mediaStartIndex, spacedFallback);
					hasValidMedia = true;
					foundMediaToken = true;
					invalidParts.length = 0;
				}
			}
			if (!hasValidMedia) {
				const fallback = normalizeMediaSource(cleanCandidate(payloadValue));
				if (isValidMedia(fallback, {
					allowSpaces: true,
					allowBareFilename: true
				})) {
					media.push(fallback);
					hasValidMedia = true;
					foundMediaToken = true;
					invalidParts.length = 0;
				}
			}
			if (hasValidMedia) {
				const beforeText = cleanLineText(pieces.join(""));
				if (beforeText) lineSegments.push({
					type: "text",
					text: beforeText
				});
				pieces.length = 0;
				for (const url of media.slice(mediaStartIndex)) lineSegments.push({
					type: "media",
					url
				});
				if (invalidParts.length > 0) pieces.push(invalidParts.join(" "));
			} else if (looksLikeLocalPath) foundMediaToken = true;
			else pieces.push(match[0]);
			cursor = start + match[0].length;
		}
		pieces.push(line.slice(cursor));
		const cleanedLine = cleanLineText(pieces.join(""));
		if (cleanedLine) {
			keptLines.push(cleanedLine);
			lineSegments.push({
				type: "text",
				text: cleanedLine
			});
		}
		for (const segment of lineSegments) {
			if (segment.type === "text") {
				pushTextSegment(segment.text);
				continue;
			}
			segments.push(segment);
		}
		lineOffset += line.length + 1;
	}
	const visibleText = keptLines.join("\n").replace(/^(?:[ \t]*\n)+/, "");
	const audioTagResult = options.extractAudioDirectives === false ? {
		text: visibleText,
		audioAsVoice: false
	} : parseAudioTag(visibleText);
	const cleanedText = audioTagResult.text.trimEnd();
	const hasAudioAsVoice = audioTagResult.audioAsVoice;
	if (media.length === 0) {
		const parsedText = foundMediaToken || hasAudioAsVoice ? cleanedText : trimmedRaw;
		const result = {
			text: parsedText,
			segments: parsedText ? [{
				type: "text",
				text: parsedText
			}] : []
		};
		if (hasAudioAsVoice) result.audioAsVoice = true;
		return result;
	}
	return {
		text: cleanedText,
		mediaUrls: media,
		segments: segments.length > 0 ? segments : [{
			type: "text",
			text: cleanedText
		}],
		...hasAudioAsVoice ? { audioAsVoice: true } : {}
	};
}
//#endregion
//#region src/auto-reply/reply/reply-directives.ts
/** Parses inline reply directives such as media, reply targets, audio, and silence. */
/** Parses media, reply-target, audio, and silent directives from reply text. */
function parseReplyDirectives(raw, options = {}) {
	const split = splitMediaFromOutput(raw, {
		extractMarkdownImages: options.extractMarkdownImages,
		extractMediaDirectives: options.extractMediaDirectives
	});
	let text = split.text ?? "";
	const replyParsed = parseInlineDirectives(text, {
		currentMessageId: options.currentMessageId,
		stripAudioTag: false,
		stripReplyTags: true
	});
	text = stripInlineDirectiveTagsForDelivery(replyParsed.hasReplyTag ? replyParsed.text : text).text;
	const silentToken = options.silentToken ?? "NO_REPLY";
	const isSilent = isSilentReplyPayloadText(text, silentToken);
	if (isSilent) text = "";
	return {
		text,
		mediaUrls: split.mediaUrls,
		replyToId: replyParsed.replyToId,
		replyToCurrent: replyParsed.replyToCurrent || void 0,
		replyToTag: replyParsed.hasReplyTag,
		audioAsVoice: split.audioAsVoice,
		isSilent
	};
}
//#endregion
export { splitMediaFromOutput as n, parseReplyDirectives as t };
