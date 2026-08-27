import "./fs-safe-defaults-DOtRnikw.js";
import { t as FsSafeError } from "./errors-hdcLXK2n.js";
import { n as readFileDescriptorBoundedSync$1, t as readFileDescriptorBounded$1 } from "./bounded-read-W_MSGG4q.js";
import { n as canonicalPathFromExistingAncestor } from "./absolute-path-DBVN5h2m.js";
import { n as matchRootFileOpenFailure, r as openRootFile } from "./root-file-CdmcBz8_.js";
import path from "node:path";
//#region src/infra/boundary-file-read.ts
/**
* Opens a root-scoped file after canonicalizing symlink parents. fs-safe
* rejects every symlink path component by default; the workspace contract
* follows contained parent symlinks (directory aliases) while final-symlink
* targets and out-of-root escapes stay rejected by openRootFile itself.
*/
async function openRootFileFollowingParents(params) {
	let absolutePath = path.resolve(params.absolutePath);
	try {
		const canonicalParent = await canonicalPathFromExistingAncestor(path.dirname(absolutePath));
		absolutePath = path.join(canonicalParent, path.basename(absolutePath));
	} catch {}
	return await openRootFile({
		...params,
		absolutePath
	});
}
const MISSING_PATH_ERROR_CODES = /* @__PURE__ */ new Set(["ENOENT", "ENOTDIR"]);
function readFailureErrorCode(error) {
	const code = error && typeof error === "object" ? error.code : void 0;
	return typeof code === "string" && code ? code : void 0;
}
/**
* Describes a root-scoped open failure without collapsing every cause into a
* containment violation. Only `validation` means the path failed the boundary or
* alias check; a missing artifact or an unreadable descriptor is an ordinary
* operational state, and reporting those as escapes sends operators hunting a
* security incident that never happened.
*/
function describeRootFileOpenFailure(params) {
	const unreadable = (code) => `${params.subject} could not be read${code ? ` (${code})` : ""}: ${params.filePath}`;
	return matchRootFileOpenFailure(params.failure, {
		path: (failure) => {
			const code = readFailureErrorCode(failure.error);
			return code && !MISSING_PATH_ERROR_CODES.has(code) ? unreadable(code) : `${params.subject} not found: ${params.filePath}`;
		},
		validation: () => `${params.subject} escapes ${params.boundaryLabel} or fails alias checks: ${params.filePath}`,
		fallback: (failure) => unreadable(readFailureErrorCode(failure.error))
	});
}
function preserveOpenClawOverflowError(error, maxBytes) {
	if (error instanceof FsSafeError && error.code === "too-large") throw new RangeError(`File exceeds ${maxBytes} bytes`, { cause: error });
	throw error;
}
/** Read a pinned descriptor without changing OpenClaw's user-facing overflow error. */
async function readFileDescriptorBounded(fd, maxBytes) {
	try {
		return await readFileDescriptorBounded$1(fd, maxBytes);
	} catch (error) {
		return preserveOpenClawOverflowError(error, maxBytes);
	}
}
/** Synchronous variant for callers that own a pinned descriptor. */
function readFileDescriptorBoundedSync(fd, maxBytes) {
	try {
		return readFileDescriptorBoundedSync$1(fd, maxBytes);
	} catch (error) {
		return preserveOpenClawOverflowError(error, maxBytes);
	}
}
//#endregion
export { readFileDescriptorBoundedSync as i, openRootFileFollowingParents as n, readFileDescriptorBounded as r, describeRootFileOpenFailure as t };
