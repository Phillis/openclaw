import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { n as estimateStringChars } from "./cjk-chars-B-gnWt4x.js";
import { o as walkDirectory } from "./fs-safe-C9N8pCh1.js";
import { o as statRegularFile, r as readRegularFile } from "./regular-file-CXw3t-8J.js";
import { i as normalizeConfiguredMemoryExtraPaths } from "./legacy-BXBI_5fp.js";
import { n as detectMime } from "./mime-Hm4eS2i0.js";
import { c as shouldSkipRootMemoryAuxiliaryPath, i as resolveCanonicalRootMemoryFile } from "./root-memory-files-BK9Jyqph.js";
import { t as isFileMissingError } from "./fs-utils-v5Xzu3x-.js";
import { a as classifyMemoryMultimodalPath, i as buildMemoryMultimodalLabel } from "./memory-search-CFXa3Z-G.js";
import { r as retryTransientMemoryRead, t as hashText } from "./hash-UcI2b9Aj.js";
import "./openclaw-runtime-memory-L2Tl7cYA.js";
import crypto from "node:crypto";
import fs from "node:fs";
import { homedir } from "node:os";
import path from "node:path";
import fs$1 from "node:fs/promises";
import pMap from "p-map";
//#region packages/memory-host-sdk/src/host/concurrency.ts
/** Run tasks with bounded concurrency, stopping admission and draining active work on failure. */
async function runWithConcurrency(tasks, limit) {
	const inFlight = /* @__PURE__ */ new Set();
	try {
		return await pMap(tasks, (task) => {
			const run = Promise.resolve().then(task);
			inFlight.add(run);
			run.then(() => inFlight.delete(run), () => inFlight.delete(run));
			return run;
		}, {
			concurrency: Math.max(1, Math.floor(limit)),
			stopOnError: true
		});
	} catch (error) {
		await Promise.allSettled(inFlight);
		throw error;
	}
}
//#endregion
//#region packages/memory-host-sdk/src/host/embedding-input-limits.ts
function estimateUtf8Bytes(text) {
	if (!text) return 0;
	return Buffer.byteLength(text, "utf8");
}
function estimateStructuredEmbeddingInputBytes(input) {
	if (!input.parts?.length) return estimateUtf8Bytes(input.text);
	let total = 0;
	for (const part of input.parts) {
		if (part.type === "text") {
			total += estimateUtf8Bytes(part.text);
			continue;
		}
		total += estimateUtf8Bytes(part.mimeType);
		total += estimateUtf8Bytes(part.data);
	}
	return total;
}
function splitTextToUtf8ByteLimit(text, maxUtf8Bytes) {
	if (maxUtf8Bytes <= 0) return [text];
	if (estimateUtf8Bytes(text) <= maxUtf8Bytes) return [text];
	const parts = [];
	let cursor = 0;
	while (cursor < text.length) {
		let low = cursor + 1;
		let high = Math.min(text.length, cursor + maxUtf8Bytes);
		let best = cursor;
		while (low <= high) {
			const mid = Math.floor((low + high) / 2);
			if (estimateUtf8Bytes(text.slice(cursor, mid)) <= maxUtf8Bytes) {
				best = mid;
				low = mid + 1;
			} else high = mid - 1;
		}
		if (best <= cursor) best = Math.min(text.length, cursor + 1);
		if (best < text.length && best > cursor && text.charCodeAt(best - 1) >= 55296 && text.charCodeAt(best - 1) <= 56319 && text.charCodeAt(best) >= 56320 && text.charCodeAt(best) <= 57343) best -= 1;
		const part = text.slice(cursor, best);
		if (!part) break;
		parts.push(part);
		cursor = best;
	}
	return parts;
}
//#endregion
//#region packages/memory-host-sdk/src/host/embedding-inputs.ts
/** Build the common text-only embedding input shape. */
function buildTextEmbeddingInput(text) {
	return { text };
}
/** Return true when a chunk needs structured provider handling, not text splitting. */
function hasNonTextEmbeddingParts(input) {
	if (!input?.parts?.length) return false;
	return input.parts.some((part) => part.type === "inline-data");
}
//#endregion
//#region packages/memory-host-sdk/src/host/explicit-extra-markdown.ts
function isExplicitExtraMarkdownFilePath(filePath, platform = process.platform) {
	return filePath.endsWith(".md") || platform === "win32" && filePath.toLowerCase().endsWith(".md");
}
//#endregion
//#region packages/memory-host-sdk/src/host/internal.ts
const MEMORY_CHUNKING_VERSION = 3;
const DISABLED_MULTIMODAL_SETTINGS = {
	enabled: false,
	modalities: [],
	maxFileBytes: 0
};
function ensureMemoryHostDir(dir) {
	fs.mkdirSync(dir, { recursive: true });
	return dir;
}
function normalizeRelPath(value) {
	return value.trim().replace(/^[./]+/, "").replace(/\\/g, "/");
}
function expandHomePath(value) {
	if (value === "~") return homedir();
	if (value.startsWith("~/") || value.startsWith("~\\")) return path.join(homedir(), value.slice(2));
	return value;
}
function normalizeExtraMemoryPathEntries(workspaceDir, extraPaths) {
	return normalizeConfiguredMemoryExtraPaths(extraPaths).map((entry) => {
		const configuredPath = typeof entry === "string" ? entry : entry.path;
		const normalized = { path: path.resolve(workspaceDir, expandHomePath(configuredPath)) };
		if (typeof entry !== "string") normalized.pattern = entry.pattern?.replaceAll("\\", "/");
		return normalized;
	});
}
function normalizeExtraMemoryPaths(workspaceDir, extraPaths) {
	return Array.from(new Set(normalizeExtraMemoryPathEntries(workspaceDir, extraPaths).map((entry) => entry.path)));
}
function matchesExtraMemoryPathEntry(entry, candidatePath) {
	if (!entry.pattern) return true;
	const relativePath = path.relative(entry.path, candidatePath);
	if (!relativePath) return true;
	if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) return false;
	try {
		return path.posix.matchesGlob(relativePath.replaceAll(path.sep, "/"), entry.pattern);
	} catch {
		return false;
	}
}
function isMemoryPath(relPath) {
	const normalized = normalizeRelPath(relPath);
	if (!normalized) return false;
	if (normalized === "MEMORY.md" || normalized === "USER.md" || normalized.toLowerCase() === "dreams.md") return true;
	return normalized.startsWith("memory/");
}
function isAllowedMemoryFilePath(filePath, multimodal) {
	if (filePath.endsWith(".md")) return true;
	return classifyMemoryMultimodalPath(filePath, multimodal ?? DISABLED_MULTIMODAL_SETTINGS) !== null;
}
function shouldDescendMemoryEntry(entry, shouldSkipPath) {
	if (shouldSkipPath?.(entry.path)) return false;
	return entry.kind === "directory" && entry.name !== ".openclaw-repair";
}
async function collectMemoryFilesFromDir(dir, files, multimodal, shouldSkipPath, extraPathEntry) {
	const scan = await walkDirectory(dir, {
		symlinks: "skip",
		descend: (entry) => shouldDescendMemoryEntry(entry, shouldSkipPath),
		include: (entry) => !shouldSkipPath?.(entry.path) && entry.kind === "file" && isAllowedMemoryFilePath(entry.path, multimodal) && (!extraPathEntry || matchesExtraMemoryPathEntry(extraPathEntry, entry.path))
	});
	files.push(...scan.entries.map((entry) => entry.path));
}
async function listMemoryFiles(workspaceDir, extraPaths, multimodal) {
	const result = [];
	const memoryDir = path.join(workspaceDir, "memory");
	const shouldSkipWorkspaceMemoryPath = (absPath) => shouldSkipRootMemoryAuxiliaryPath({
		workspaceDir,
		absPath
	});
	const addMarkdownFile = async (absPath) => {
		try {
			if ((await statRegularFile(absPath)).missing) return;
			if (!absPath.endsWith(".md")) return;
			result.push(absPath);
		} catch {}
	};
	const memoryFile = await resolveCanonicalRootMemoryFile(workspaceDir);
	if (memoryFile) await addMarkdownFile(memoryFile);
	await addMarkdownFile(path.join(workspaceDir, "USER.md"));
	try {
		const dirStat = await fs$1.lstat(memoryDir);
		if (!dirStat.isSymbolicLink() && dirStat.isDirectory()) await collectMemoryFilesFromDir(memoryDir, result, void 0, shouldSkipWorkspaceMemoryPath);
	} catch {}
	const normalizedExtraPaths = normalizeExtraMemoryPathEntries(workspaceDir, extraPaths);
	if (normalizedExtraPaths.length > 0) for (const entry of normalizedExtraPaths) {
		const inputPath = entry.path;
		if (shouldSkipWorkspaceMemoryPath(inputPath)) continue;
		try {
			const stat = await fs$1.lstat(inputPath);
			if (stat.isSymbolicLink()) continue;
			if (stat.isDirectory()) {
				await collectMemoryFilesFromDir(inputPath, result, multimodal, shouldSkipWorkspaceMemoryPath, entry);
				continue;
			}
			if (stat.isFile() && (isExplicitExtraMarkdownFilePath(inputPath) || isAllowedMemoryFilePath(inputPath, multimodal))) result.push(inputPath);
		} catch {}
	}
	if (result.length <= 1) return result;
	const seen = /* @__PURE__ */ new Set();
	const deduped = [];
	for (const entry of result) {
		let key = entry;
		try {
			key = await fs$1.realpath(entry);
		} catch {}
		if (seen.has(key)) continue;
		seen.add(key);
		deduped.push(entry);
	}
	return deduped;
}
async function buildFileEntry(absPath, workspaceDir, multimodal) {
	const regularFile = await statRegularFile(absPath);
	if (regularFile.missing) return null;
	const stat = regularFile.stat;
	const normalizedPath = path.relative(workspaceDir, absPath).replace(/\\/g, "/");
	const multimodalSettings = multimodal ?? DISABLED_MULTIMODAL_SETTINGS;
	const modality = classifyMemoryMultimodalPath(absPath, multimodalSettings);
	if (modality) {
		if (stat.size > multimodalSettings.maxFileBytes) return null;
		let buffer;
		try {
			buffer = (await retryTransientMemoryRead(() => readRegularFile({
				filePath: absPath,
				maxBytes: multimodalSettings.maxFileBytes
			}), `read multimodal memory file ${absPath}`)).buffer;
		} catch (err) {
			if (isFileMissingError(err)) return null;
			throw err;
		}
		const mimeType = await detectMime({
			buffer: buffer.subarray(0, 512),
			filePath: absPath
		});
		if (!mimeType || !mimeType.startsWith(`${modality}/`)) return null;
		const contentText = buildMemoryMultimodalLabel(modality, normalizedPath);
		const dataHash = crypto.createHash("sha256").update(buffer).digest("hex");
		const chunkHash = hashText(JSON.stringify({
			path: normalizedPath,
			contentText,
			mimeType,
			dataHash
		}));
		return {
			path: normalizedPath,
			absPath,
			mtimeMs: stat.mtimeMs,
			size: stat.size,
			hash: chunkHash,
			dataHash,
			kind: "multimodal",
			contentText,
			modality,
			mimeType
		};
	}
	let content;
	try {
		content = (await retryTransientMemoryRead(() => readRegularFile({ filePath: absPath }), `read memory index file ${absPath}`)).buffer.toString("utf-8");
	} catch (err) {
		if (isFileMissingError(err)) return null;
		throw err;
	}
	const hash = hashText(content);
	return {
		path: normalizedPath,
		absPath,
		mtimeMs: stat.mtimeMs,
		size: stat.size,
		hash,
		kind: "markdown"
	};
}
async function loadMultimodalEmbeddingInput(entry) {
	if (entry.kind !== "multimodal" || !entry.contentText || !entry.mimeType) return null;
	const regularFile = await statRegularFile(entry.absPath);
	if (regularFile.missing) return null;
	if (regularFile.stat.size !== entry.size) return null;
	let buffer;
	try {
		buffer = (await retryTransientMemoryRead(() => readRegularFile({
			filePath: entry.absPath,
			maxBytes: entry.size
		}), `read multimodal indexing file ${entry.absPath}`)).buffer;
	} catch (err) {
		if (isFileMissingError(err)) return null;
		throw err;
	}
	const dataHash = crypto.createHash("sha256").update(buffer).digest("hex");
	if (entry.dataHash && entry.dataHash !== dataHash) return null;
	return {
		text: entry.contentText,
		parts: [{
			type: "text",
			text: entry.contentText
		}, {
			type: "inline-data",
			mimeType: entry.mimeType,
			data: buffer.toString("base64")
		}]
	};
}
async function buildMultimodalChunkForIndexing(entry) {
	const embeddingInput = await loadMultimodalEmbeddingInput(entry);
	if (!embeddingInput) return null;
	return {
		chunk: {
			startLine: 1,
			endLine: 1,
			text: entry.contentText ?? embeddingInput.text,
			hash: entry.hash,
			embeddingInput
		},
		structuredInputBytes: estimateStructuredEmbeddingInputBytes(embeddingInput)
	};
}
function splitCuratedMarkdownEntries(content) {
	const lines = content.split("\n");
	const entries = [];
	let startIndex = 0;
	let kind = lines[0]?.startsWith("- ") ? "entry" : "section";
	const flush = (endIndex) => {
		if (endIndex < startIndex) return;
		entries.push({
			startLine: startIndex + 1,
			endLine: endIndex + 1,
			text: lines.slice(startIndex, endIndex + 1).join("\n"),
			kind
		});
	};
	for (let index = 1; index < lines.length; index += 1) {
		const line = lines[index] ?? "";
		const nextKind = line.startsWith("- ") ? "entry" : /^#{1,6}(?:\s|$)/u.test(line) ? "section" : void 0;
		if (!nextKind) continue;
		flush(index - 1);
		startIndex = index;
		kind = nextKind;
	}
	flush(lines.length - 1);
	return entries;
}
function chunkMarkdown(content, chunking) {
	const lines = content.split("\n");
	if (lines.length === 0) return [];
	const maxChars = Math.max(32, chunking.tokens * 4);
	const overlapChars = Math.max(0, chunking.overlap * 4);
	const chunks = [];
	let current = [];
	let currentChars = 0;
	let entryStartLine;
	let entryFirstChunk = 0;
	const curatedEntryStarts = chunking.perEntry ? new Map(splitCuratedMarkdownEntries(content).map((entry) => [entry.startLine, entry])) : void 0;
	const flush = () => {
		if (current.length === 0) return;
		const firstEntry = current[0];
		const lastEntry = current[current.length - 1];
		if (!firstEntry || !lastEntry) return;
		const text = current.map((entry) => entry.line).join("\n");
		const startLine = firstEntry.lineNo;
		const endLine = lastEntry.lineNo;
		chunks.push({
			startLine,
			endLine,
			text,
			hash: hashText(text),
			embeddingInput: buildTextEmbeddingInput(text)
		});
	};
	const carryOverlap = () => {
		if (overlapChars <= 0 || current.length === 0) {
			current = [];
			currentChars = 0;
			return;
		}
		let acc = 0;
		const kept = [];
		for (let i = current.length - 1; i >= 0; i -= 1) {
			const entry = current[i];
			if (!entry) continue;
			acc += estimateStringChars(entry.line) + 1;
			kept.unshift(entry);
			if (acc >= overlapChars) break;
		}
		current = kept;
		currentChars = acc;
	};
	const finishEntry = (entryEndLine) => {
		if (entryStartLine === void 0) return;
		for (const chunk of chunks.slice(entryFirstChunk)) {
			chunk.entryStartLine = entryStartLine;
			chunk.entryEndLine = entryEndLine;
		}
	};
	for (let i = 0; i < lines.length; i += 1) {
		const line = lines[i] ?? "";
		const lineNo = i + 1;
		const curatedEntry = curatedEntryStarts?.get(lineNo);
		if (curatedEntry) {
			if (current.length > 0) flush();
			finishEntry(lineNo - 1);
			current = [];
			currentChars = 0;
			entryStartLine = curatedEntry.kind === "entry" ? lineNo : void 0;
			entryFirstChunk = chunks.length;
		}
		const segments = [];
		if (line.length === 0) segments.push("");
		else for (let start = 0; start < line.length;) {
			const coarse = truncateUtf16Safe(line.slice(start), maxChars);
			if (estimateStringChars(coarse) > maxChars) {
				const fineStep = Math.max(1, chunking.tokens);
				for (let j = 0; j < coarse.length;) {
					let end = Math.min(j + fineStep, coarse.length);
					const lastCodeUnit = coarse.charCodeAt(end - 1);
					if (lastCodeUnit >= 55296 && lastCodeUnit <= 56319 && end < coarse.length) end += 1;
					segments.push(coarse.slice(j, end));
					j = end;
				}
			} else segments.push(coarse);
			start += coarse.length;
		}
		for (const segment of segments) {
			const lineSize = estimateStringChars(segment) + 1;
			if (currentChars + lineSize > maxChars && current.length > 0) {
				flush();
				carryOverlap();
			}
			current.push({
				line: segment,
				lineNo
			});
			currentChars += lineSize;
		}
	}
	flush();
	finishEntry(lines.length);
	return chunks;
}
/**
* Remap chunk startLine/endLine from content-relative positions to original
* source file positions using a lineMap.  Each entry in lineMap gives the
* 1-indexed source line for the corresponding 0-indexed content line.
*
* This is used for session JSONL files where buildSessionEntry() flattens
* messages into a plain-text string before chunking.  Without remapping the
* stored line numbers would reference positions in the flattened text rather
* than the original JSONL file.
*/
function remapChunkLines(chunks, lineMap) {
	if (!lineMap || lineMap.length === 0) return;
	for (const chunk of chunks) {
		chunk.startLine = lineMap[chunk.startLine - 1] ?? chunk.startLine;
		chunk.endLine = lineMap[chunk.endLine - 1] ?? chunk.endLine;
	}
}
function parseEmbedding(raw) {
	try {
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}
function cosineSimilarity(a, b) {
	if (a.length === 0 || b.length === 0) return 0;
	const len = Math.min(a.length, b.length);
	let dot = 0;
	let normA = 0;
	let normB = 0;
	for (let i = 0; i < len; i += 1) {
		const av = a[i] ?? 0;
		const bv = b[i] ?? 0;
		dot += av * bv;
		normA += av * av;
		normB += bv * bv;
	}
	if (normA === 0 || normB === 0) return 0;
	return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}
function runMemoryHostTasksWithConcurrency(tasks, limit) {
	return runWithConcurrency(tasks, limit);
}
//#endregion
export { hasNonTextEmbeddingParts as _, cosineSimilarity as a, splitTextToUtf8ByteLimit as b, listMemoryFiles as c, normalizeExtraMemoryPaths as d, parseEmbedding as f, isExplicitExtraMarkdownFilePath as g, splitCuratedMarkdownEntries as h, chunkMarkdown as i, matchesExtraMemoryPathEntry as l, runMemoryHostTasksWithConcurrency as m, buildFileEntry as n, ensureMemoryHostDir as o, remapChunkLines as p, buildMultimodalChunkForIndexing as r, isMemoryPath as s, MEMORY_CHUNKING_VERSION as t, normalizeExtraMemoryPathEntries as u, estimateStructuredEmbeddingInputBytes as v, estimateUtf8Bytes as y };
