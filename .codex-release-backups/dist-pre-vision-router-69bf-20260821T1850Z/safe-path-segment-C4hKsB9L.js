import { t as FsSafeError } from "./errors-hdcLXK2n.js";
//#region ../../../../../../openclaw/node_modules/@openclaw/fs-safe/dist/safe-path-segment.js
const SAFE_PATH_SEGMENT_PATTERN = /^[A-Za-z0-9_-][A-Za-z0-9._-]*$/;
const SAFE_DOT_PREFIX_PATH_SEGMENT_PATTERN = /^[A-Za-z0-9._-]+$/;
const DRIVE_RELATIVE_PREFIX = /^[A-Za-z]:(?![\\/])/;
const HYPHEN_CHAR_CODE = 45;
function isDriveRelativePath(value) {
	return DRIVE_RELATIVE_PREFIX.test(value);
}
function assertNoDriveRelativePathSegments(value, label) {
	if (value.split("/").some(isDriveRelativePath)) throw new FsSafeError("invalid-path", `${label} must not contain a drive letter`);
	return value;
}
function trimHyphenEdges(value) {
	let start = 0;
	let end = value.length;
	while (start < end && value.charCodeAt(start) === HYPHEN_CHAR_CODE) start += 1;
	while (end > start && value.charCodeAt(end - 1) === HYPHEN_CHAR_CODE) end -= 1;
	return start === 0 && end === value.length ? value : value.slice(start, end);
}
function isSafePathSegment(segment, options = {}) {
	return segment !== "" && segment !== "." && segment !== ".." && !segment.includes("/") && !segment.includes("\\") && !segment.includes("\0") && (options.allowDotPrefix === true || !segment.startsWith(".")) && (options.allowDotPrefix === true ? SAFE_DOT_PREFIX_PATH_SEGMENT_PATTERN.test(segment) : SAFE_PATH_SEGMENT_PATTERN.test(segment));
}
function assertSafePathSegment(segment, options = {}) {
	if (!isSafePathSegment(segment, options)) throw new FsSafeError("invalid-path", `${options.label ?? "path segment"} must be a safe path segment`);
	return segment;
}
function sanitizeSafePathSegment(value, fallback, options = {}) {
	const trimmed = trimHyphenEdges(value.trim().replace(/[\\/]+/g, "-").replace(/\0/g, "").replace(/[^A-Za-z0-9._-]+/g, "-"));
	if (isSafePathSegment(trimmed, options)) return trimmed;
	return assertSafePathSegment(fallback, {
		...options,
		label: "fallback path segment"
	});
}
function assertSafePathPrefix(prefix, options = {}) {
	if (prefix.includes("/") || prefix.includes("\\") || prefix.includes("\0")) return assertSafePathSegment(prefix, {
		allowDotPrefix: true,
		...options,
		label: options.label ?? "path prefix"
	});
	return assertSafePathSegment(prefix.replace(/[^A-Za-z0-9._-]+/g, "-"), {
		allowDotPrefix: true,
		...options,
		label: options.label ?? "path prefix"
	});
}
//#endregion
export { sanitizeSafePathSegment as a, isDriveRelativePath as i, assertSafePathPrefix as n, assertSafePathSegment as r, assertNoDriveRelativePathSegments as t };
