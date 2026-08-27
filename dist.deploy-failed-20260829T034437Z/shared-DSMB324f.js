import { P as resolvePositiveTimerTimeoutMs } from "./number-coercion-CLj0HTDM.js";
import "./utils-Bw16L5tB.js";
import { n as replaceFileAtomicSync } from "./replace-file-f6TD5O4c.js";
import "./replace-file-CLSCJ1qR.js";
import { n as privateFileStoreSync } from "./private-file-store-CcE8O0xd.js";
import path from "node:path";
//#region src/secrets/shared.ts
/** Shared parsing and file helpers for secrets migration/runtime code. */
/**
* Narrows to strings that contain non-whitespace content.
*/
function isNonEmptyString(value) {
	return typeof value === "string" && value.trim().length > 0;
}
/**
* Parses a simple .env assignment value, stripping one matching quote pair after trimming.
*/
function parseEnvValue(raw) {
	const trimmed = raw.trim();
	if (trimmed.startsWith("\"") && trimmed.endsWith("\"") || trimmed.startsWith("'") && trimmed.endsWith("'")) return trimmed.slice(1, -1);
	return trimmed;
}
/**
* Normalizes numeric config to a positive integer, falling back when the input is not finite.
*/
function normalizePositiveInt(value, fallback) {
	if (typeof value === "number" && Number.isFinite(value)) return Math.max(1, Math.floor(value));
	return Math.max(1, Math.floor(fallback));
}
/**
* Normalizes timer values with the shared timeout coercion rules used by secret providers.
*/
function normalizePositiveTimerMs(value, fallback) {
	return resolvePositiveTimerTimeoutMs(value, fallback);
}
/**
* Splits a dotted config path into non-empty trimmed segments.
*/
function parseDotPath(pathname) {
	return pathname.split(".").map((segment) => segment.trim()).filter((segment) => segment.length > 0);
}
/**
* Atomically writes secret-adjacent text, using the private store for default 0600 files.
*/
function writeTextFileAtomic(pathname, value, mode = 384) {
	if (mode !== 384) {
		replaceFileAtomicSync({
			filePath: pathname,
			content: value,
			mode,
			tempPrefix: ".openclaw-secrets"
		});
		return;
	}
	privateFileStoreSync(path.dirname(pathname)).writeText(path.basename(pathname), value);
}
//#endregion
export { parseEnvValue as a, parseDotPath as i, normalizePositiveInt as n, writeTextFileAtomic as o, normalizePositiveTimerMs as r, isNonEmptyString as t };
