import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { o as sha256HexPrefixCore } from "./crypto-digest-IGAbV2KW.js";
//#region src/logging/redact-identifier.ts
/** Returns a stable sha256 hex prefix for non-secret identifier correlation. */
function sha256HexPrefix(value, len = 12) {
	return sha256HexPrefixCore(value, Number.isFinite(len) ? Math.max(1, Math.floor(len)) : 12);
}
/** Redacts an identifier to a stable hash label, or "-" for missing values. */
function redactIdentifier(value, opts) {
	const trimmed = normalizeOptionalString(value);
	if (!trimmed) return "-";
	return `sha256:${sha256HexPrefix(trimmed, opts?.len ?? 12)}`;
}
//#endregion
export { sha256HexPrefix as n, redactIdentifier as t };
