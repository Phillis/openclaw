import { s as normalizeNullableString } from "./string-coerce-CIXf7egm.js";
//#region packages/session-url-contract/src/grammar.ts
const DEFAULT_MAIN_KEY = "main";
const SHORT_SESSION_REF_RE = /^(?:.*-)?([0-9a-f]{8,32})$/iu;
const FIXED_RESERVED_SESSION_RESTS = /* @__PURE__ */ new Set([
	"main",
	"global",
	"boot",
	"sessions"
]);
function normalizeControlUiBasePath(basePath) {
	const trimmed = basePath?.trim().replace(/^\/+|\/+$/gu, "") ?? "";
	return trimmed ? `/${trimmed}` : "";
}
function isReservedSessionRest(rest, mainKey) {
	const normalized = rest.toLowerCase();
	const configuredMainKey = normalizeNullableString(mainKey)?.toLowerCase() ?? "main";
	return FIXED_RESERVED_SESSION_RESTS.has(normalized) || normalized === configuredMainKey;
}
function parseShortSessionRef(sessionRef) {
	const shortId = sessionRef.match(SHORT_SESSION_REF_RE)?.[1]?.toLowerCase();
	if (!shortId) return null;
	const slugHint = sessionRef.slice(0, sessionRef.length - shortId.length).replace(/-+$/u, "");
	return slugHint ? {
		shortId,
		slugHint
	} : { shortId };
}
//#endregion
export { parseShortSessionRef as i, isReservedSessionRest as n, normalizeControlUiBasePath as r, DEFAULT_MAIN_KEY as t };
