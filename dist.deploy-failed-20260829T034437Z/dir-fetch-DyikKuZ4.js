import { r as root } from "./fs-safe-CmrQUApq.js";
import { t as runCommandBuffered } from "./exec-D2kbpwdA.js";
import "./security-runtime-CYUTzVOk.js";
import "./process-runtime-B-C-YQA7.js";
import { n as matchesFileIdentity, r as readPathBinding } from "./path-binding-ipb_4NPa.js";
import { a as statRequiredDirectory, i as resolveCanonicalReadPath, n as readAbsolutePath, r as rejectCanonicalPathChange, t as classifyFsSafeReadError } from "./path-errors-BoPPypb_.js";
import path from "node:path";
import fs from "node:fs/promises";
import crypto from "node:crypto";
//#region extensions/file-transfer/src/node-host/dir-fetch-archive.ts
const CANONICAL_PATH_CHANGED_EXIT_CODE = 78;
const CANONICAL_TAR_WORKER = [
	"const fs=require(\"node:fs\");",
	"const {spawn}=require(\"node:child_process\");",
	"const [directory,expected,device,inode,tar]=process.argv.slice(1);",
	"try{process.chdir(directory);}catch{process.exit(1);}",
	"if(fs.realpathSync(\".\")!==expected){process.exit(78);}",
	"const bound=fs.statSync(\".\",{bigint:true});",
	"if(String(bound.dev)!==device||String(bound.ino)!==inode){process.exit(78);}",
	"const child=spawn(tar,[\"-czf\",\"-\",\".\"],{stdio:[\"ignore\",\"inherit\",\"inherit\"]});",
	"child.once(\"error\",()=>process.exit(1));",
	"child.once(\"exit\",code=>process.exit(code??1));"
].join("");
async function createTarArchive(directoryPath, expectedCanonicalPath, expectedDevice, expectedInode, maxBytes) {
	const tarBin = process.platform !== "win32" ? "/usr/bin/tar" : "tar";
	const result = await runCommandBuffered([
		process.execPath,
		"-e",
		CANONICAL_TAR_WORKER,
		directoryPath,
		expectedCanonicalPath,
		expectedDevice,
		expectedInode,
		tarBin
	], {
		discardOutput: { stderr: true },
		maxOutputBytes: {
			stdout: maxBytes,
			stderr: 64 * 1024
		},
		timeoutMs: 6e4
	}).catch(() => null);
	if (!result) return "ERROR";
	if (result.termination === "timeout") return "TIMEOUT";
	if (result.termination === "output-limit" && result.outputLimitStream === "stdout") return "TOO_LARGE";
	if (result.termination === "exit" && result.code === CANONICAL_PATH_CHANGED_EXIT_CODE) return "CANONICAL_PATH_CHANGED";
	return result.termination === "exit" && result.code === 0 ? result.stdout : "ERROR";
}
//#endregion
//#region extensions/file-transfer/src/node-host/dir-fetch.ts
const DIR_FETCH_HARD_MAX_BYTES = 16 * 1024 * 1024;
const DIR_FETCH_DEFAULT_MAX_BYTES = 8 * 1024 * 1024;
function clampMaxBytes(input) {
	if (typeof input !== "number" || !Number.isFinite(input) || input <= 0) return DIR_FETCH_DEFAULT_MAX_BYTES;
	return Math.min(Math.floor(input), DIR_FETCH_HARD_MAX_BYTES);
}
function classifyFsError(err) {
	const safeCode = classifyFsSafeReadError(err);
	if (safeCode) return safeCode;
	if (err?.code === "ENOENT") return "NOT_FOUND";
	return "READ_ERROR";
}
async function preflightDu(dirPath, maxBytes) {
	const heuristicKb = Math.ceil(maxBytes * 4 / 1024);
	const result = await runCommandBuffered([
		"du",
		"-sk",
		dirPath
	], {
		discardOutput: { stderr: true },
		maxOutputBytes: 64 * 1024,
		timeoutMs: 1e4
	}).catch(() => null);
	if (!result || result.termination !== "exit" || result.code !== 0) return true;
	const match = /^(\d+)/.exec(result.stdout.toString("utf8").trim());
	return match ? Number.parseInt(match[0], 10) <= heuristicKb : true;
}
async function listTarEntries(tarBuffer) {
	const result = await runCommandBuffered([
		"tar",
		"-tzf",
		"-"
	], {
		discardOutput: { stderr: true },
		input: tarBuffer,
		maxOutputBytes: {
			stdout: 32 * 1024 * 1024,
			stderr: 64 * 1024
		},
		timeoutMs: 1e4
	}).catch(() => null);
	if (!result || result.termination !== "exit" || result.code !== 0) return null;
	const entries = [];
	const output = result.stdout.toString("utf8");
	let start = 0;
	while (start <= output.length) {
		const end = output.indexOf("\n", start);
		const line = output.slice(start, end === -1 ? output.length : end).replace(/\\/gu, "/").replace(/^\.\//u, "").replace(/\/$/u, "");
		if (line.length > 0) entries.push(line);
		if (end === -1) break;
		start = end + 1;
	}
	return entries.toSorted((left, right) => left.localeCompare(right));
}
async function listTreeEntries(root$1, maxEntries, expectedIdentity) {
	const results = [];
	const rootHandle = await root(root$1);
	if (!matchesFileIdentity(await fs.stat(rootHandle.rootReal, { bigint: true }), expectedIdentity)) throw Object.assign(/* @__PURE__ */ new Error("filesystem identity differs from the authorized target"), { code: "CANONICAL_PATH_CHANGED" });
	async function visit(relativeDir) {
		const entries = await rootHandle.list(relativeDir, { withFileTypes: true });
		for (const entry of entries.toSorted((left, right) => left.name.localeCompare(right.name))) {
			const rel = path.posix.join(relativeDir === "." ? "" : relativeDir, entry.name);
			results.push(rel);
			if (results.length > maxEntries) return false;
			if (entry.isDirectory) {
				if (!await visit(rel)) return false;
			}
		}
		return true;
	}
	return await visit(".") ? results : "TOO_MANY";
}
async function handleDirFetch(params) {
	const requestedPath = readAbsolutePath(params.path);
	if (typeof requestedPath !== "string") return requestedPath;
	const maxBytes = clampMaxBytes(params.maxBytes);
	params.includeDotfiles;
	const followSymlinks = params.followSymlinks === true;
	const preflightOnly = params.preflightOnly === true;
	const canonical = await resolveCanonicalReadPath({
		requestedPath,
		followSymlinks,
		classifyError: classifyFsError,
		notFoundMessage: "directory not found"
	});
	if (typeof canonical !== "string") return canonical;
	const canonicalPathChange = rejectCanonicalPathChange(params.expectedCanonicalPath, canonical);
	if (canonicalPathChange) return canonicalPathChange;
	const directory = await statRequiredDirectory(canonical, classifyFsError);
	if (!directory.ok) return directory;
	const expectedBinding = readPathBinding(params.expectedBinding);
	if (params.expectedBinding !== void 0 && expectedBinding?.kind !== "existing") return {
		ok: false,
		code: "CANONICAL_PATH_CHANGED",
		message: "filesystem identity differs from the authorized target",
		canonicalPath: canonical
	};
	if (expectedBinding?.kind === "existing" && (expectedBinding.device !== directory.identity.device || expectedBinding.inode !== directory.identity.inode)) return {
		ok: false,
		code: "CANONICAL_PATH_CHANGED",
		message: "filesystem identity differs from the authorized target",
		canonicalPath: canonical
	};
	const boundIdentity = expectedBinding?.kind === "existing" ? expectedBinding : directory.identity;
	if (preflightOnly) {
		let entries;
		try {
			entries = await listTreeEntries(canonical, 5e3, boundIdentity);
		} catch (err) {
			return {
				ok: false,
				code: (err && typeof err === "object" && "code" in err ? err.code : void 0) === "CANONICAL_PATH_CHANGED" ? "CANONICAL_PATH_CHANGED" : classifyFsError(err),
				message: `preflight readdir failed: ${String(err)}`,
				canonicalPath: canonical
			};
		}
		if (entries === "TOO_MANY") return {
			ok: false,
			code: "TREE_TOO_LARGE",
			message: "directory tree exceeds 5000 entries during preflight",
			canonicalPath: canonical
		};
		const tarBuffer = await createTarArchive(canonical, canonical, boundIdentity.device, boundIdentity.inode, maxBytes);
		if (tarBuffer === "TOO_LARGE") return {
			ok: false,
			code: "TREE_TOO_LARGE",
			message: `tarball exceeded ${maxBytes} byte limit during preflight`,
			canonicalPath: canonical
		};
		if (tarBuffer === "TIMEOUT") return {
			ok: false,
			code: "READ_ERROR",
			message: "tar command exceeded 60s wall-clock timeout (slow filesystem or symlink loop?)",
			canonicalPath: canonical
		};
		if (tarBuffer === "CANONICAL_PATH_CHANGED") return {
			ok: false,
			code: "CANONICAL_PATH_CHANGED",
			message: "canonical path differs from the authorized target",
			canonicalPath: canonical
		};
		if (tarBuffer === "ERROR") {
			const currentDirectory = await statRequiredDirectory(canonical, classifyFsError);
			if (!currentDirectory.ok) return currentDirectory;
			return {
				ok: false,
				code: "READ_ERROR",
				message: "tar command failed",
				canonicalPath: canonical
			};
		}
		return {
			ok: true,
			path: canonical,
			tarBase64: "",
			tarBytes: 0,
			sha256: "",
			fileCount: entries.length,
			entries,
			preflightOnly: true,
			binding: {
				kind: "existing",
				...directory.identity
			}
		};
	}
	if (!await preflightDu(canonical, maxBytes)) return {
		ok: false,
		code: "TREE_TOO_LARGE",
		message: `directory tree exceeds estimated size limit (${maxBytes} bytes raw)`,
		canonicalPath: canonical
	};
	const tarBuffer = await createTarArchive(canonical, canonical, boundIdentity.device, boundIdentity.inode, maxBytes);
	if (tarBuffer === "TOO_LARGE") return {
		ok: false,
		code: "TREE_TOO_LARGE",
		message: `tarball exceeded ${maxBytes} byte limit mid-stream`,
		canonicalPath: canonical
	};
	if (tarBuffer === "TIMEOUT") return {
		ok: false,
		code: "READ_ERROR",
		message: "tar command exceeded 60s wall-clock timeout (slow filesystem or symlink loop?)",
		canonicalPath: canonical
	};
	if (tarBuffer === "CANONICAL_PATH_CHANGED") return {
		ok: false,
		code: "CANONICAL_PATH_CHANGED",
		message: "canonical path differs from the authorized target",
		canonicalPath: canonical
	};
	if (tarBuffer === "ERROR") return {
		ok: false,
		code: "READ_ERROR",
		message: "tar command failed",
		canonicalPath: canonical
	};
	const sha256 = crypto.createHash("sha256").update(tarBuffer).digest("hex");
	const tarBase64 = tarBuffer.toString("base64");
	const tarBytes = tarBuffer.byteLength;
	const entries = await listTarEntries(tarBuffer);
	if (entries === null) return {
		ok: false,
		code: "READ_ERROR",
		message: "tar entry listing failed",
		canonicalPath: canonical
	};
	return {
		ok: true,
		path: canonical,
		tarBase64,
		tarBytes,
		sha256,
		fileCount: entries.length,
		entries,
		binding: {
			kind: "existing",
			...directory.identity
		}
	};
}
//#endregion
export { handleDirFetch };
