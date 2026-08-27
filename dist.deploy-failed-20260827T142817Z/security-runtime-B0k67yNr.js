import { i as truncateWithMarker } from "./utf16-slice-D_ngcYKd.js";
import { v as uniqueStrings } from "./string-normalization-e_fvmxMf.js";
import "./redact-Cl7lwBnl.js";
import "./fs-safe-defaults-BPVQr7Lx.js";
import "./fs-safe-C9N8pCh1.js";
import { s as statRegularFileSync } from "./regular-file-CXw3t-8J.js";
import "./path-guards-fBZukd5S.js";
import "./errors-CSNUPl5U.js";
import "./replace-file-sXUFaaUi.js";
import "./proxy-env-CVpLKmqL.js";
import "./ssrf-UFPP-fbI.js";
import "./private-file-store-p6c2I0-s.js";
import "./ports-DGhqGvd9.js";
import { a as wrapExternalContent } from "./external-content-IQUFD6xt.js";
import "./dm-policy-shared-C9SzMBWN.js";
//#region src/security/channel-metadata.ts
const DEFAULT_MAX_CHARS = 800;
const DEFAULT_MAX_ENTRY_CHARS = 400;
function normalizeEntry(entry) {
	return entry.replace(/\s+/g, " ").trim();
}
function truncateText(value, maxChars) {
	if (maxChars <= 0) return "";
	return truncateWithMarker(value, maxChars, {
		marker: "...",
		reserve: 3,
		trimEnd: true
	});
}
/**
* Build bounded, externally wrapped channel metadata for prompt context.
* Channel-provided labels can be user-controlled, so keep the result externally wrapped.
*/
function buildChannelMetadata(params) {
	const deduped = uniqueStrings(params.entries.map((entry) => typeof entry === "string" ? normalizeEntry(entry) : "").filter((entry) => Boolean(entry)).map((entry) => truncateText(entry, DEFAULT_MAX_ENTRY_CHARS)));
	if (deduped.length === 0) return;
	const body = deduped.join("\n");
	return wrapExternalContent(truncateText(`${`Channel metadata (${params.source})`}\n${`${params.label}:\n${body}`}`, params.maxChars ?? DEFAULT_MAX_CHARS), {
		source: "channel_metadata",
		includeWarning: false
	});
}
/** @deprecated Use buildChannelMetadata. Removal: after 2026-09-08 (see sdk-untrusted-context-identifier-aliases). */
const buildUntrustedChannelMetadata = buildChannelMetadata;
//#endregion
//#region src/plugin-sdk/security-runtime.ts
/** Public security runtime helpers for plugin-side trust boundaries. */
/** Return whether a path resolves to a regular file, treating filesystem errors as missing. */
function fileExists(filePath) {
	try {
		return !statRegularFileSync(filePath).missing;
	} catch {
		return false;
	}
}
//#endregion
export { buildChannelMetadata as n, buildUntrustedChannelMetadata as r, fileExists as t };
