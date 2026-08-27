import { n as extractErrorCode, t as collectErrorGraphCandidates } from "./errors-Ccx0R-_Z.js";
//#region src/infra/error-graph-internal.ts
function extractErrorCodeOrErrno(err) {
	const code = extractErrorCode(err);
	if (code) return code.trim().toUpperCase();
	if (!err || typeof err !== "object") return;
	const errno = err.errno;
	if (typeof errno === "string" && errno.trim()) return errno.trim().toUpperCase();
	if (typeof errno === "number" && Number.isFinite(errno)) return String(errno);
}
function collectNestedErrorCandidates(err) {
	return collectErrorGraphCandidates(err, (current) => {
		const nested = [
			current.cause,
			current.reason,
			current.original,
			current.error,
			current.data
		];
		if (Array.isArray(current.errors)) nested.push(...current.errors);
		return nested;
	});
}
//#endregion
export { extractErrorCodeOrErrno as n, collectNestedErrorCandidates as t };
