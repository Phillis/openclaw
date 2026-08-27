import { l as stripSilentToken, n as SILENT_REPLY_TOKEN, o as isSilentReplyText } from "./tokens-CMI0yx54.js";
//#region src/gateway/control-reply-text.ts
const SUPPRESSED_CONTROL_REPLY_TOKENS = [
	SILENT_REPLY_TOKEN,
	"ANNOUNCE_SKIP",
	"REPLY_SKIP"
];
const MIN_BARE_PREFIX_LENGTH_BY_TOKEN = {
	[SILENT_REPLY_TOKEN]: 2,
	ANNOUNCE_SKIP: 3,
	REPLY_SKIP: 3
};
function normalizeSuppressedControlReplyFragment(text) {
	const trimmed = text.trim();
	if (!trimmed) return "";
	const normalized = trimmed.toUpperCase();
	if (/[^A-Z_]/.test(normalized)) return "";
	return normalized;
}
/**
* Return true when a chat-visible reply is exactly an internal control token.
*/
function isSuppressedControlReplyText(text) {
	const normalized = text.trim();
	return SUPPRESSED_CONTROL_REPLY_TOKENS.some((token) => isSilentReplyText(normalized, token));
}
/** Remove internal control tokens when a model appends one to visible reply text. */
function stripSuppressedControlReplyToken(text) {
	if (isSuppressedControlReplyText(text)) return "";
	let stripped = text;
	for (const token of SUPPRESSED_CONTROL_REPLY_TOKENS) {
		const next = stripSilentToken(stripped, token);
		if (next !== stripped.trim()) stripped = next;
	}
	return stripped;
}
/**
* Return true when streamed assistant text looks like the leading fragment of a control token.
*/
function isSuppressedControlReplyLeadFragment(text) {
	const trimmed = text.trim();
	const normalized = normalizeSuppressedControlReplyFragment(text);
	if (!normalized) return false;
	return SUPPRESSED_CONTROL_REPLY_TOKENS.some((token) => {
		const tokenUpper = token.toUpperCase();
		if (normalized === tokenUpper) return false;
		if (!tokenUpper.startsWith(normalized)) return false;
		if (normalized.includes("_")) return true;
		if (token !== "NO_REPLY" && trimmed !== trimmed.toUpperCase()) return false;
		return normalized.length >= MIN_BARE_PREFIX_LENGTH_BY_TOKEN[token];
	});
}
//#endregion
export { isSuppressedControlReplyText as n, stripSuppressedControlReplyToken as r, isSuppressedControlReplyLeadFragment as t };
