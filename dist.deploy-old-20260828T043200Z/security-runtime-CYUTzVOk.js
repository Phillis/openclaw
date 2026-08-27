import { i as truncateWithMarker } from "./utf16-slice-D_ngcYKd.js";
import { v as uniqueStrings } from "./string-normalization-e_fvmxMf.js";
import "./redact-CWP17HFN.js";
import "./fs-safe-defaults-BPVQr7Lx.js";
import "./fs-safe-CmrQUApq.js";
import { s as statRegularFileSync } from "./regular-file-Dwz6p59y.js";
import "./path-guards-CQoZeoCG.js";
import "./errors-Ccx0R-_Z.js";
import "./replace-file-CLSCJ1qR.js";
import "./proxy-env-TVpcGZHW.js";
import "./ssrf-arYIaOWE.js";
import "./private-file-store-CcE8O0xd.js";
import "./ports-8zXv4rN7.js";
import { a as wrapExternalContent } from "./external-content-IQUFD6xt.js";
import "./dm-policy-shared-AwbVZrOd.js";
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
