import { n as findMarkdownCodeSpans } from "./reasoning-tags-3YlFC272.js";
//#region src/shared/text/code-regions.ts
/** Finds CommonMark block-aware fenced, indented, and inline code regions. */
function findCodeRegions(text) {
	return findMarkdownCodeSpans(text).map(([start, end]) => ({
		start,
		end
	}));
}
/** Returns true when a character offset falls inside one of the discovered code regions. */
function isInsideCode(pos, regions) {
	return regions.some((region) => pos >= region.start && pos < region.end);
}
//#endregion
export { isInsideCode as n, findCodeRegions as t };
