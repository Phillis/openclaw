import { r as root } from "./fs-safe-CmrQUApq.js";
import { n as detectMime } from "./mime-Hm4eS2i0.js";
import "./media-mime-DQ4Ibr5o.js";
import "./security-runtime-CYUTzVOk.js";
import { n as matchesFileIdentity, r as readPathBinding, t as fileIdentity } from "./path-binding-ipb_4NPa.js";
import { i as resolveCanonicalReadPath, n as readAbsolutePath, r as rejectCanonicalPathChange, t as classifyFsSafeReadError } from "./path-errors-BoPPypb_.js";
import path from "node:path";
import crypto from "node:crypto";
//#region extensions/file-transfer/src/node-host/file-fetch.ts
const FILE_FETCH_HARD_MAX_BYTES = 16 * 1024 * 1024;
const FILE_FETCH_DEFAULT_MAX_BYTES = 8 * 1024 * 1024;
const TEXT_SNIFF_MAX_BYTES = 8192;
function clampMaxBytes(input) {
	if (typeof input !== "number" || !Number.isFinite(input) || input <= 0) return FILE_FETCH_DEFAULT_MAX_BYTES;
	return Math.min(Math.floor(input), FILE_FETCH_HARD_MAX_BYTES);
}
function classifyFsError(err) {
	const safeCode = classifyFsSafeReadError(err);
	if (safeCode) return safeCode;
	const code = err?.code;
	if (code === "not-file") return "IS_DIRECTORY";
	if (code === "ENOENT") return "NOT_FOUND";
	if (code === "EACCES" || code === "EPERM") return "PERMISSION_DENIED";
	if (code === "EISDIR") return "IS_DIRECTORY";
	return "READ_ERROR";
}
function isLikelyPlainText(buffer) {
	if (buffer.byteLength === 0) return true;
	const sample = buffer.subarray(0, TEXT_SNIFF_MAX_BYTES);
	if (sample.includes(0)) return false;
	try {
		new TextDecoder("utf-8", { fatal: true }).decode(sample);
	} catch {
		return false;
	}
	let controlBytes = 0;
	for (const byte of sample) if (byte < 32 && byte !== 9 && byte !== 10 && byte !== 13) controlBytes += 1;
	return controlBytes / sample.byteLength < .01;
}
async function detectFetchedFileMime(params) {
	const detected = await detectMime(params);
	if (detected) return detected;
	return isLikelyPlainText(params.buffer) ? "text/plain" : "application/octet-stream";
}
async function handleFileFetch(params) {
	const requestedPath = readAbsolutePath(params.path);
	if (typeof requestedPath !== "string") return requestedPath;
	const maxBytes = clampMaxBytes(params.maxBytes);
	const followSymlinks = params.followSymlinks === true;
	const preflightOnly = params.preflightOnly === true;
	const canonical = await resolveCanonicalReadPath({
		requestedPath,
		followSymlinks,
		classifyError: classifyFsError,
		notFoundMessage: "file not found"
	});
	if (typeof canonical !== "string") return canonical;
	let opened;
	try {
		opened = await (await root(path.dirname(canonical))).open(path.basename(canonical));
	} catch (err) {
		const code = classifyFsError(err);
		return {
			ok: false,
			code,
			message: code === "IS_DIRECTORY" ? "path is a directory" : `open failed: ${String(err)}`,
			canonicalPath: canonical
		};
	}
	try {
		const canonicalPathChange = rejectCanonicalPathChange(params.expectedCanonicalPath, opened.realPath);
		if (canonicalPathChange) return canonicalPathChange;
		const stats = opened.stat;
		const identityStats = await opened.handle.stat({ bigint: true });
		const identity = fileIdentity(identityStats);
		const expectedBinding = readPathBinding(params.expectedBinding);
		if (params.expectedBinding !== void 0 && expectedBinding?.kind !== "existing" || expectedBinding?.kind === "existing" && !matchesFileIdentity(identityStats, expectedBinding)) return {
			ok: false,
			code: "CANONICAL_PATH_CHANGED",
			message: "filesystem identity differs from the authorized target",
			canonicalPath: opened.realPath
		};
		if (stats.size > maxBytes) return {
			ok: false,
			code: "FILE_TOO_LARGE",
			message: `file size ${stats.size} exceeds limit ${maxBytes}`,
			canonicalPath: opened.realPath
		};
		if (preflightOnly) return {
			ok: true,
			path: opened.realPath,
			size: stats.size,
			mimeType: "",
			base64: "",
			sha256: "",
			preflightOnly: true,
			binding: {
				kind: "existing",
				...identity
			}
		};
		const buffer = await opened.handle.readFile();
		if (buffer.byteLength > maxBytes) return {
			ok: false,
			code: "FILE_TOO_LARGE",
			message: `read ${buffer.byteLength} bytes exceeds limit ${maxBytes}`,
			canonicalPath: opened.realPath
		};
		const sha256 = crypto.createHash("sha256").update(buffer).digest("hex");
		const base64 = buffer.toString("base64");
		const mimeType = await detectFetchedFileMime({
			buffer,
			filePath: opened.realPath
		});
		return {
			ok: true,
			path: opened.realPath,
			size: buffer.byteLength,
			mimeType,
			base64,
			sha256,
			binding: {
				kind: "existing",
				...identity
			}
		};
	} catch (err) {
		return {
			ok: false,
			code: classifyFsError(err),
			message: `read failed: ${String(err)}`,
			canonicalPath: opened.realPath
		};
	} finally {
		await opened.handle.close().catch(() => void 0);
	}
}
//#endregion
export { handleFileFetch };
