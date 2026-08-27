//#region packages/media-core/src/base64.ts
/** Estimates decoded bytes without allocating a cleaned copy of the base64 payload. */
function estimateBase64DecodedBytes(base64) {
	let effectiveLen = 0;
	for (let i = 0; i < base64.length; i += 1) {
		if (base64.charCodeAt(i) <= 32) continue;
		effectiveLen += 1;
	}
	if (effectiveLen === 0) return 0;
	let padding = 0;
	let end = base64.length - 1;
	while (end >= 0 && base64.charCodeAt(end) <= 32) end -= 1;
	if (end >= 0 && base64[end] === "=") {
		padding = 1;
		end -= 1;
		while (end >= 0 && base64.charCodeAt(end) <= 32) end -= 1;
		if (end >= 0 && base64[end] === "=") padding = 2;
	}
	const estimated = Math.floor(effectiveLen * 3 / 4) - padding;
	return Math.max(0, estimated);
}
function isBase64DataChar(code) {
	return code >= 65 && code <= 90 || code >= 97 && code <= 122 || code >= 48 && code <= 57 || code === 43 || code === 47;
}
function base64DataValue(code) {
	if (code >= 65 && code <= 90) return code - 65;
	if (code >= 97 && code <= 122) return code - 97 + 26;
	if (code >= 48 && code <= 57) return code - 48 + 52;
	return code === 43 ? 62 : 63;
}
/**
* Normalizes and validates a base64 string, returning canonical no-whitespace
* base64 only when the input has valid alphabet, padding, and length.
*/
function canonicalizeBase64(base64) {
	let out;
	let outLen = 0;
	let padding = 0;
	let sawPadding = false;
	let lastDataCode = 0;
	for (let i = 0; i < base64.length; i += 1) {
		const code = base64.charCodeAt(i);
		if (code <= 32) {
			if (out === void 0) {
				out = Buffer.allocUnsafe(base64.length - 1);
				for (let j = 0; j < i; j += 1) out[j] = base64.charCodeAt(j);
				outLen = i;
			}
			continue;
		}
		if (code === 61) {
			padding += 1;
			if (padding > 2) return;
			sawPadding = true;
		} else if (sawPadding || !isBase64DataChar(code)) return;
		else lastDataCode = code;
		if (out !== void 0) {
			out[outLen] = code;
			outLen += 1;
		}
	}
	const cleanedLength = out === void 0 ? base64.length : outLen;
	if (cleanedLength === 0) return;
	const remainder = cleanedLength % 4;
	if (remainder !== 0 && (sawPadding || remainder === 1)) return;
	const effectivePadding = remainder === 0 ? padding : 4 - remainder;
	const padBitMask = effectivePadding === 2 ? 15 : effectivePadding === 1 ? 3 : 0;
	if (padBitMask !== 0 && (base64DataValue(lastDataCode) & padBitMask) !== 0) return;
	const cleaned = out === void 0 ? base64 : out.subarray(0, outLen).toString("latin1");
	return remainder === 0 ? cleaned : cleaned + "=".repeat(4 - remainder);
}
//#endregion
export { estimateBase64DecodedBytes as n, canonicalizeBase64 as t };
