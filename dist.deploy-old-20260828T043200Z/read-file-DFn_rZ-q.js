import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { j as resolveIntegerOption } from "./number-coercion-CLj0HTDM.js";
import { a as isPathInside, o as isPathInsideWithRealpath } from "./path-D138yf8v.js";
import { i as root } from "./root-impl-BbMR4leC.js";
import { c as assertNoSymlinkParents, o as statRegularFile, r as readRegularFile } from "./regular-file-Dwz6p59y.js";
import { a as resolveMemoryHostAgentContextLimits, o as resolveMemoryHostAgentWorkspaceDir, s as resolveMemoryHostSearchPathConfig } from "./legacy-C3aoLO5V.js";
import { g as isExplicitExtraMarkdownFilePath, l as matchesExtraMemoryPathEntry, s as isMemoryPath, u as normalizeExtraMemoryPathEntries } from "./internal-BFGgxRGi.js";
import { t as isFileMissingError } from "./fs-utils-DgC06wMX.js";
import { n as retryTransientMemoryRead } from "./read-retry-DV0CdWmZ.js";
import path from "node:path";
import fs from "node:fs/promises";
//#region packages/memory-host-sdk/src/host/read-file-shared.ts
/** Default number of lines returned by memory read helpers. */
const DEFAULT_MEMORY_READ_LINES = 120;
/** Default max character budget for memory read helper output. */
const DEFAULT_MEMORY_READ_MAX_CHARS = 12e3;
/** Build the continuation notice appended to truncated memory excerpts. */
function buildContinuationNotice(params) {
	const base = typeof params.nextFrom === "number" ? `[More content available. Use from=${params.nextFrom} to continue.]` : "[More content available. Requested excerpt exceeded the default maxChars budget.]";
	const fallback = params.suggestReadFallback ? " If you need the full raw line, use read on the source file." : "";
	return `\n\n${base.slice(0, -1)}${fallback}]`;
}
/** Fit line slices to the response character budget while preserving line boundaries. */
function fitLinesToCharBudget(params) {
	const { lines, maxChars } = params;
	if (lines.length === 0) return {
		text: "",
		includedLines: 0,
		hardTruncatedSingleLine: false
	};
	let includedLines = lines.length;
	let text = lines.join("\n");
	while (includedLines > 1 && text.length > maxChars) {
		includedLines -= 1;
		text = lines.slice(0, includedLines).join("\n");
	}
	if (text.length <= maxChars) return {
		text,
		includedLines,
		hardTruncatedSingleLine: false
	};
	return {
		text: truncateUtf16Safe(text, maxChars),
		includedLines: 1,
		hardTruncatedSingleLine: true
	};
}
/** Build a memory read result from an already-selected line slice. */
function buildMemoryReadResultFromSlice(params) {
	const start = resolveIntegerOption(params.startLine, 1, { min: 1 });
	const fitted = fitLinesToCharBudget({
		lines: params.selectedLines,
		maxChars: resolveIntegerOption(params.maxChars, DEFAULT_MEMORY_READ_MAX_CHARS, { min: 1 })
	});
	const moreSourceLinesRemain = params.moreSourceLinesRemain ?? false;
	const charCapTruncated = fitted.hardTruncatedSingleLine || fitted.includedLines < params.selectedLines.length;
	const nextFrom = !fitted.hardTruncatedSingleLine && (moreSourceLinesRemain || fitted.includedLines < params.selectedLines.length) ? start + fitted.includedLines : void 0;
	const truncated = charCapTruncated || moreSourceLinesRemain;
	return {
		status: "ok",
		text: truncated && (fitted.text || fitted.hardTruncatedSingleLine) ? `${fitted.text}${buildContinuationNotice({
			nextFrom,
			suggestReadFallback: fitted.hardTruncatedSingleLine && params.suggestReadFallback
		})}` : fitted.text,
		path: params.relPath,
		from: start,
		lines: fitted.includedLines,
		...truncated ? { truncated: true } : {},
		...typeof nextFrom === "number" ? { nextFrom } : {}
	};
}
/** Build a memory read result from raw file content and caller range options. */
function buildMemoryReadResult(params) {
	const fileLines = params.content.split("\n");
	if (fileLines.at(-1) === "") fileLines.pop();
	const start = resolveIntegerOption(params.from, 1, { min: 1 });
	const requestedCount = resolveIntegerOption(params.lines ?? params.defaultLines, 120, { min: 1 });
	const selectedLines = fileLines.slice(start - 1, start - 1 + requestedCount);
	const moreSourceLinesRemain = start - 1 + selectedLines.length < fileLines.length;
	return buildMemoryReadResultFromSlice({
		selectedLines,
		relPath: params.relPath,
		startLine: start,
		moreSourceLinesRemain,
		maxChars: params.maxChars,
		suggestReadFallback: params.suggestReadFallback
	});
}
//#endregion
//#region packages/memory-host-sdk/src/host/read-file.ts
/** Check that an absolute path stays inside an allowed extra directory without symlink escapes. */
async function isAllowedAdditionalDirectoryPath(additionalPath, absPath) {
	if (!isPathInside(additionalPath, absPath)) return false;
	try {
		await assertNoSymlinkParents({
			rootDir: additionalPath,
			targetPath: absPath
		});
	} catch {
		return false;
	}
	if (!isPathInsideWithRealpath(additionalPath, absPath)) {
		try {
			await fs.lstat(absPath);
		} catch (err) {
			return isFileMissingError(err);
		}
		return false;
	}
	return true;
}
/** Return true when a file vanished after path validation but before content read. */
function isFileDisappearedDuringReadError(err) {
	return isFileMissingError(err) || Boolean(err && typeof err === "object" && "code" in err && err.code === "path-mismatch");
}
/** Read a validated memory markdown file from workspace or configured extra paths. */
async function readMemoryFile(params) {
	const rawPath = params.relPath.trim();
	if (!rawPath) throw new Error("path required");
	const absPath = path.isAbsolute(rawPath) ? path.resolve(rawPath) : path.resolve(params.workspaceDir, rawPath);
	const relPath = path.relative(params.workspaceDir, absPath).replace(/\\/g, "/");
	const allowedWorkspace = relPath.length > 0 && !relPath.startsWith("..") && !path.isAbsolute(relPath) && isMemoryPath(relPath);
	let allowedAdditional = false;
	if (!allowedWorkspace && (params.extraPaths?.length ?? 0) > 0) {
		const additionalPaths = normalizeExtraMemoryPathEntries(params.workspaceDir, params.extraPaths);
		for (const additionalPath of additionalPaths) try {
			const stat = await fs.lstat(additionalPath.path);
			if (stat.isSymbolicLink()) continue;
			if (stat.isDirectory()) {
				if (matchesExtraMemoryPathEntry(additionalPath, absPath) && await isAllowedAdditionalDirectoryPath(additionalPath.path, absPath)) {
					if ((await fs.lstat(absPath).catch(() => null))?.isSymbolicLink()) continue;
					allowedAdditional = "directory";
					break;
				}
				continue;
			}
			if (stat.isFile() && absPath === additionalPath.path && isExplicitExtraMarkdownFilePath(absPath)) {
				allowedAdditional = "file";
				break;
			}
		} catch {}
	}
	if (!allowedWorkspace && !allowedAdditional) throw new Error("path required");
	if (!absPath.endsWith(".md") && allowedAdditional !== "file") throw new Error("path required");
	if (allowedWorkspace) try {
		await (await root(params.workspaceDir)).resolve(relPath);
	} catch (err) {
		if (isFileMissingError(err)) return {
			status: "not_found",
			text: "",
			path: relPath
		};
		throw err;
	}
	if ((await statRegularFile(absPath)).missing) return {
		status: "not_found",
		text: "",
		path: relPath
	};
	let content;
	try {
		content = (await retryTransientMemoryRead(() => readRegularFile({ filePath: absPath }), `read memory file ${absPath}`)).buffer.toString("utf-8");
	} catch (err) {
		if (isFileDisappearedDuringReadError(err)) return {
			status: "not_found",
			text: "",
			path: relPath
		};
		throw err;
	}
	return buildMemoryReadResult({
		content,
		relPath,
		from: params.from,
		lines: params.lines,
		defaultLines: params.defaultLines ?? 120,
		maxChars: params.maxChars,
		suggestReadFallback: allowedWorkspace
	});
}
/** Resolve agent memory config and read one memory file for that agent. */
async function readAgentMemoryFile(params) {
	const settings = resolveMemoryHostSearchPathConfig(params.cfg, params.agentId);
	if (!settings) throw new Error("memory search disabled");
	const contextLimits = resolveMemoryHostAgentContextLimits(params.cfg, params.agentId);
	return await readMemoryFile({
		workspaceDir: resolveMemoryHostAgentWorkspaceDir(params.cfg, params.agentId),
		extraPaths: settings.extraPaths,
		relPath: params.relPath,
		from: params.from,
		lines: params.lines,
		maxChars: contextLimits?.memoryGetMaxChars
	});
}
//#endregion
export { buildMemoryReadResult as a, DEFAULT_MEMORY_READ_MAX_CHARS as i, readMemoryFile as n, buildMemoryReadResultFromSlice as o, DEFAULT_MEMORY_READ_LINES as r, readAgentMemoryFile as t };
