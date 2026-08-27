import { t as canonicalizeBase64 } from "./base64-Vw7DZYSc.js";
import { n as detectMime } from "./mime-Hm4eS2i0.js";
//#region src/media/sniff-mime-from-base64.ts
const BASE64_SNIFF_PREFIX_CHARS = 256;
/** Sniffs a MIME type from a small base64 prefix after validating the full payload. */
async function sniffMimeFromBase64(base64) {
	const canonical = canonicalizeBase64(base64);
	if (!canonical) return;
	const take = Math.min(BASE64_SNIFF_PREFIX_CHARS, canonical.length);
	const sliceLength = take - take % 4;
	if (sliceLength < 8) return;
	try {
		const canonicalPrefix = canonical.slice(0, sliceLength);
		return await detectMime({ buffer: Buffer.from(canonicalPrefix, "base64") });
	} catch {
		return;
	}
}
//#endregion
export { sniffMimeFromBase64 as t };
