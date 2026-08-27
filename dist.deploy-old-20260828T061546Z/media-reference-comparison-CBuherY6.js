import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { s as hasEncodedFileUrlSeparator } from "./read-open-flags-DGgM-BoE.js";
import "./local-file-access-C2hsuc07.js";
import { fileURLToPath } from "node:url";
import path from "node:path";
//#region src/agents/embedded-agent-helpers/messaging-dedupe.ts
/**
* Normalizes outbound message text to suppress duplicate send actions.
*/
const MIN_DUPLICATE_TEXT_LENGTH = 10;
const MIN_SUBSTRING_DUPLICATE_RATIO = .5;
/**
* Normalize text for duplicate comparison.
* - Trims whitespace
* - Lowercases
* - Strips emoji (Emoji_Presentation and Extended_Pictographic)
* - Collapses multiple spaces to single space
*/
function normalizeTextForComparison(text) {
	return normalizeLowercaseStringOrEmpty(text).replace(/\p{Emoji_Presentation}|\p{Extended_Pictographic}/gu, "").replace(/\s+/g, " ").trim();
}
/** Compare already-normalized message text against prior sends. */
function isMessagingToolDuplicateNormalized(normalized, normalizedSentTexts) {
	if (normalizedSentTexts.length === 0) return false;
	if (!normalized || normalized.length < MIN_DUPLICATE_TEXT_LENGTH) return false;
	return normalizedSentTexts.some((normalizedSent) => {
		if (!normalizedSent || normalizedSent.length < MIN_DUPLICATE_TEXT_LENGTH) return false;
		if (normalized.includes(normalizedSent)) return normalizedSent.length >= normalized.length * MIN_SUBSTRING_DUPLICATE_RATIO;
		return normalizedSent.includes(normalized) && normalized.length >= normalizedSent.length * MIN_SUBSTRING_DUPLICATE_RATIO;
	});
}
/** Return true when raw message text duplicates a prior sent message. */
function isMessagingToolDuplicate(text, sentTexts) {
	if (sentTexts.length === 0) return false;
	const normalized = normalizeTextForComparison(text);
	if (!normalized || normalized.length < MIN_DUPLICATE_TEXT_LENGTH) return false;
	return isMessagingToolDuplicateNormalized(normalized, sentTexts.map(normalizeTextForComparison));
}
//#endregion
//#region src/media/media-reference-comparison.ts
const PATH_PARENT_SEGMENT_RE = /(?:^|[\\/])\.\.(?:[\\/]|$)/u;
const FORWARD_NETWORK_PATH_PREFIX_RE = /^\/\//u;
const FILE_URL_PREFIX_RE = /^file:(?:\/\/)?/iu;
const FILE_URL_LOCAL_NETWORK_KEY_PREFIX = "\0file-url-local-network:";
function normalizeAbsoluteLocalPath(value) {
	if (!path.isAbsolute(value) || PATH_PARENT_SEGMENT_RE.test(value) || FORWARD_NETWORK_PATH_PREFIX_RE.test(value)) return value;
	return path.normalize(value);
}
function normalizeFileUrlLocalPath(value) {
	if (!value.startsWith("//")) return normalizeAbsoluteLocalPath(value);
	const normalized = PATH_PARENT_SEGMENT_RE.test(value) ? value : `//${path.normalize(value.slice(2))}`;
	return `${FILE_URL_LOCAL_NETWORK_KEY_PREFIX}${normalized}`;
}
function normalizeMalformedLocalFileUrl(value) {
	const remainder = value.replace(FILE_URL_PREFIX_RE, "");
	let localPath;
	if (remainder.startsWith("/")) localPath = remainder;
	else if (/^localhost(?:\/|$)/iu.test(remainder)) localPath = remainder.slice(9);
	else return;
	if (process.platform === "win32" && /^\/[a-z]:[\\/]/iu.test(localPath)) localPath = localPath.slice(1);
	return normalizeFileUrlLocalPath(localPath);
}
/** Canonicalizes equivalent local media references without resolving the filesystem. */
function normalizeMediaReferenceForComparison(value) {
	const trimmed = value.trim();
	if (!trimmed) return "";
	if (!FILE_URL_PREFIX_RE.test(trimmed)) return normalizeAbsoluteLocalPath(trimmed);
	try {
		const parsed = new URL(trimmed);
		if (parsed.protocol === "file:") {
			if (hasEncodedFileUrlSeparator(parsed.pathname)) return trimmed;
			return normalizeFileUrlLocalPath(fileURLToPath(parsed, { windows: process.platform === "win32" && (parsed.hostname !== "" || /^\/[a-z]:[\\/]/iu.test(parsed.pathname)) }));
		}
	} catch {}
	return normalizeMalformedLocalFileUrl(trimmed) ?? trimmed;
}
//#endregion
export { normalizeTextForComparison as i, isMessagingToolDuplicate as n, isMessagingToolDuplicateNormalized as r, normalizeMediaReferenceForComparison as t };
