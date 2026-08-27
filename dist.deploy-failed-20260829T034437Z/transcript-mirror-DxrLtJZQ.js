import path from "node:path";
//#region src/config/sessions/transcript-mirror.ts
function stripQuery(value) {
	const noHash = value.split("#")[0] ?? value;
	return noHash.split("?")[0] ?? noHash;
}
function extractFileNameFromMediaUrl(value) {
	const trimmed = value.trim();
	if (!trimmed) return null;
	const cleaned = stripQuery(trimmed);
	try {
		const parsed = new URL(cleaned);
		const base = path.basename(parsed.pathname);
		if (!base) return null;
		try {
			return decodeURIComponent(base);
		} catch {
			return base;
		}
	} catch {
		const base = path.basename(cleaned);
		if (!base || base === "/" || base === ".") return null;
		return base;
	}
}
/** Resolves compact text to mirror into session transcripts for text or media messages. */
function resolveMirroredTranscriptText(params) {
	const mediaUrls = params.mediaUrls?.filter((url) => url && url.trim()) ?? [];
	const trimmedText = params.text?.trim() ?? "";
	if (mediaUrls.length > 0) {
		const names = mediaUrls.map((url) => extractFileNameFromMediaUrl(url)).filter((name) => Boolean(name && name.trim()));
		const mediaText = names.length > 0 ? names.join(", ") : "media";
		return trimmedText ? `${trimmedText}\n${mediaText}` : mediaText;
	}
	return trimmedText ? trimmedText : null;
}
//#endregion
export { resolveMirroredTranscriptText as t };
