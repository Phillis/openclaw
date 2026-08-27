//#region packages/gateway-protocol/src/session-agent-status.ts
const SESSION_AGENT_ATTENTION_ICON_IDS = [
	"hand",
	"key",
	"alert",
	"flag",
	"lock",
	"hourglass"
];
const SESSION_ICON_GLYPH_IDS = [
	"braces",
	"book",
	"monitor",
	"bot",
	"kanban",
	"coins"
];
const SESSION_ICON_GLYPH_ID_SET = new Set(SESSION_ICON_GLYPH_IDS);
let sessionIconRe;
function sessionIconPattern() {
	if (sessionIconRe === void 0) try {
		sessionIconRe = /* @__PURE__ */ new RegExp("^\\p{RGI_Emoji}$", "v");
	} catch {
		sessionIconRe = null;
	}
	return sessionIconRe;
}
function isSingleNonAsciiGrapheme(value) {
	if (value.length > 16 || /^[!-~]$/u.test(value)) return false;
	return [...new Intl.Segmenter(void 0, { granularity: "grapheme" }).segment(value)].length === 1;
}
function normalizeSessionIconValue(value) {
	const normalized = value.trim();
	if (!normalized) return null;
	if (SESSION_ICON_GLYPH_ID_SET.has(normalized)) return normalized;
	const pattern = sessionIconPattern();
	return (pattern ? pattern.test(normalized) : isSingleNonAsciiGrapheme(normalized)) ? normalized : null;
}
//#endregion
export { SESSION_ICON_GLYPH_IDS as n, normalizeSessionIconValue as r, SESSION_AGENT_ATTENTION_ICON_IDS as t };
