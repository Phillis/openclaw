import { i as truncateWithMarker } from "./utf16-slice-D_ngcYKd.js";
import { v as uniqueStrings } from "./string-normalization-e_fvmxMf.js";
import "./redact-DP7p9QfH.js";
import "./fs-safe-defaults-DOtRnikw.js";
import "./fs-safe-X_oyl7Rx.js";
import { s as statRegularFileSync } from "./regular-file-SotPWt-b.js";
import "./path-guards-CQdx2c2I.js";
import "./errors-CqPTYU6G.js";
import "./replace-file-Bcj2RH0f.js";
import "./proxy-env-CVpLKmqL.js";
import "./ssrf-CQ4RdJXm.js";
import "./private-file-store-CQOUjKsU.js";
import "./ports-pcwgnLvC.js";
import { a as wrapExternalContent } from "./external-content-IQUFD6xt.js";
import "./dm-policy-shared-C0uxEJYi.js";
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
