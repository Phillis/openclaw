//#region src/gateway/http-conditional.ts
function matchesHttpIfNoneMatch(header, etag) {
	const value = Array.isArray(header) ? header.join(",") : header;
	if (!value) return false;
	return value.split(",").some((candidate) => {
		const tag = candidate.trim();
		return tag === "*" || tag === etag || tag.startsWith("W/") && tag.slice(2) === etag;
	});
}
//#endregion
export { matchesHttpIfNoneMatch as t };
