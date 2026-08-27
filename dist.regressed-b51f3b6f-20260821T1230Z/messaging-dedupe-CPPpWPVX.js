import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
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
export { isMessagingToolDuplicateNormalized as n, normalizeTextForComparison as r, isMessagingToolDuplicate as t };
