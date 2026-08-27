//#region packages/memory-host-sdk/src/host/curated-annotations.ts
const INVALID_PROJECT_ANNOTATION_KEY = "!invalid-project-annotation";
const MEMORY_ANNOTATION_CARRIER_RE = /<!--\s*(?:trigger|importance|project)\s*:[^\r\n]*?-->/giu;
function stripMemoryAnnotationCarriers(text) {
	let stripped = false;
	const withoutCarriers = text.replace(MEMORY_ANNOTATION_CARRIER_RE, () => {
		stripped = true;
		return "";
	});
	return stripped ? withoutCarriers.replace(/[ \t]+(?=\r?$)/gmu, "") : text;
}
function normalizeProjectAnnotationKey(value) {
	const trimmed = value.trim();
	if (!trimmed || /[\r\n<>]/u.test(trimmed)) return null;
	if (trimmed.startsWith("path:")) return trimmed;
	const separator = trimmed.indexOf("/");
	if (separator < 1) return trimmed;
	return `${trimmed.slice(0, separator).toLowerCase()}${trimmed.slice(separator)}`;
}
function extractProjectKeysFromCuratedEntry(text) {
	const keys = /* @__PURE__ */ new Set();
	const markerCount = [...text.matchAll(/<!--\s*project\s*:/giu)].length;
	let parsedCount = 0;
	let rawCount = 0;
	let validCount = 0;
	for (const match of text.matchAll(/<!--\s*project\s*:\s*([\s\S]*?)\s*-->/giu)) {
		parsedCount += 1;
		for (const rawKey of (match[1] ?? "").split(";")) {
			rawCount += 1;
			const key = normalizeProjectAnnotationKey(rawKey);
			if (key) {
				keys.add(key);
				validCount += 1;
			}
		}
	}
	const annotated = markerCount > 0;
	return {
		annotated,
		valid: !annotated || parsedCount === markerCount && rawCount > 0 && rawCount === validCount,
		keys: [...keys],
		rawCount,
		validCount
	};
}
//#endregion
export { stripMemoryAnnotationCarriers as i, extractProjectKeysFromCuratedEntry as n, normalizeProjectAnnotationKey as r, INVALID_PROJECT_ANNOTATION_KEY as t };
