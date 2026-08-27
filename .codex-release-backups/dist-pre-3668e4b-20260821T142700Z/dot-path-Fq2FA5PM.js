//#region src/shared/dot-path.ts
/** Joins path segments into their dotted-path representation. */
function toDotPath(segments) {
	return segments.join(".");
}
//#endregion
export { toDotPath as t };
