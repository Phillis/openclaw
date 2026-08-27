import { i as toErrorObject } from "./error-coercion-CKFmnpjH.js";
import "./src-BntaCZM-.js";
import { n as formatByteSize } from "./format-CgMRsTCK.js";
import { i as asOptionalObjectRecord } from "./record-coerce-DItp3I4t.js";
import { c as redactSecrets } from "./redact-CWP17HFN.js";
import { t as FsSafeError } from "./errors-CQDiIdj7.js";
import { f as trySafeFileURLToPath, s as hasEncodedFileUrlSeparator } from "./read-open-flags-DGgM-BoE.js";
import { n as canonicalPathFromExistingAncestor } from "./absolute-path-CYFPfAjt.js";
import { r as root } from "./fs-safe-CmrQUApq.js";
import { i as clampNumber } from "./utils-Bw16L5tB.js";
import { r as isMissingPathError, t as hasErrnoCode } from "./errno-CkbDOfLk.js";
import "./errors-Ccx0R-_Z.js";
import { r as decodeWindowsTextFileBuffer } from "./windows-encoding-BFYUNnZu.js";
import { i as logWarn } from "./logger-D4iLuGk3.js";
import { n as detectMime } from "./mime-Hm4eS2i0.js";
import { n as isWindowsDrivePath } from "./archive-entry-DulHWXJZ.js";
import "./archive-path-C2hsuc07.js";
import "./local-file-access-C2hsuc07.js";
import { n as assertSandboxPath } from "./sandbox-paths-C7Hkb46-.js";
import { i as toRelativeWorkspacePath } from "./path-policy-DK2wTBdY.js";
import { B as createEditTool, E as createWriteTool, O as createBoundedReadTextPage, Q as ReadToolContinuationSchema, j as formatReadContinuationNotice, k as createReadTool } from "./sessions-PHTfe5gZ.js";
import { r as sanitizeToolResultImages } from "./tool-images-DSTTabjp.js";
import { r as resolveToCwd, t as expandOsHomePrefix } from "./path-utils-B1jqPblH.js";
import { i as normalizeMediaReferenceSource, l as resolveMediaReferenceSandboxPath, r as classifyMediaReferenceSource } from "./media-reference-Q4z-WfN-.js";
import { a as assertRequiredParams, i as REQUIRED_PARAM_GROUPS, l as wrapToolParamValidation, o as normalizeFileToolPathParam, s as normalizeFileToolPathParamsFromKeys } from "./agent-tools.before-tool-call.decision-brX8VCIr.js";
import { t as sniffMimeFromBase64 } from "./sniff-mime-from-base64-CKfGfoBh.js";
import { a as recordMemoryArtifactWriteProvenance, r as normalizeMemoryArtifactRelativePath, t as clearMemoryArtifactProvenance } from "./memory-artifact-provenance-DT0NglMM.js";
import { URL } from "node:url";
import { realpathSync } from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { Value } from "typebox/value";
//#region src/agents/memory-write-provenance.ts
function withMemoryWriteProvenance(operations, observer) {
	if (!observer) return operations;
	const remove = operations.remove;
	return {
		...operations,
		writeFile: async (absolutePath, content) => {
			if (!observer.classifies(absolutePath)) {
				await operations.writeFile(absolutePath, content);
				return;
			}
			const contentBefore = await operations.readFile(absolutePath).then((value) => Buffer.isBuffer(value) ? value.toString("utf8") : value).catch((error) => {
				if (!isMissingPathError(error)) throw error;
				return "";
			});
			await observer.write({
				absolutePath,
				contentBefore,
				contentAfter: content,
				commit: () => operations.writeFile(absolutePath, content)
			});
		},
		...remove ? { remove: async (absolutePath) => {
			const contentBefore = observer.classifies(absolutePath) ? await operations.readFile(absolutePath).then((value) => Buffer.isBuffer(value) ? value.toString("utf8") : value).catch((error) => {
				if (!isMissingPathError(error)) throw error;
				return "";
			}) : "";
			await remove(absolutePath);
			await observer.clearAfterDelete(absolutePath, contentBefore);
		} } : {}
	};
}
function resolveMemoryRelativePath(root, absolutePath) {
	const canonicalPath = (candidate) => {
		try {
			return realpathSync.native(candidate);
		} catch {
			return path.join(realpathSync.native(path.dirname(candidate)), path.basename(candidate));
		}
	};
	const relativePath = path.relative(canonicalPath(root), canonicalPath(absolutePath));
	if (!relativePath || path.isAbsolute(relativePath) || relativePath === ".." || relativePath.startsWith(`..${path.sep}`)) return;
	return normalizeMemoryArtifactRelativePath(relativePath.replaceAll(path.sep, "/"));
}
function createMemoryWriteProvenanceObserver(params) {
	const now = params.now ?? Date.now;
	return {
		classifies: (absolutePath) => resolveMemoryRelativePath(params.mutationRoot, absolutePath) !== void 0,
		write: async ({ absolutePath, contentBefore, contentAfter, commit }) => {
			const relativePath = resolveMemoryRelativePath(params.mutationRoot, absolutePath);
			if (!relativePath) {
				await commit();
				return;
			}
			const rollback = await recordMemoryArtifactWriteProvenance({
				workspaceDir: params.workspaceDir,
				relativePath,
				contentBefore,
				contentAfter,
				originClass: params.resolveOriginClass(),
				observedAt: now(),
				sessionId: params.sessionId,
				sessionKey: params.sessionKey
			});
			try {
				await commit();
			} catch (error) {
				try {
					await rollback?.();
				} catch (rollbackError) {
					throw new Error(`File write failed and memory provenance rollback also failed: ${String(error)}`, { cause: rollbackError });
				}
				throw error;
			}
		},
		clearAfterDelete: async (absolutePath, contentBefore) => {
			const relativePath = resolveMemoryRelativePath(params.mutationRoot, absolutePath);
			if (!relativePath) return;
			try {
				await clearMemoryArtifactProvenance({
					workspaceDir: params.workspaceDir,
					relativePath,
					contentBefore
				});
			} catch (error) {
				logWarn(`memory provenance cleanup failed for ${relativePath}: ${String(error)}`);
			}
		}
	};
}
//#endregion
//#region src/agents/agent-tools.read.ts
const DEFAULT_READ_PAGE_MAX_BYTES = 32 * 1024;
const MAX_ADAPTIVE_READ_MAX_BYTES = 128 * 1024;
const ADAPTIVE_READ_CONTEXT_SHARE = .1;
const CHARS_PER_TOKEN_ESTIMATE = 4;
const MAX_ADAPTIVE_READ_PAGES = 4;
const ENV_FILE_PATH_RE = /(?:^|[/\\])(?:\.env(?:\.[^/\\]+)?|[^/\\]+\.env)$/i;
function createSkillInstructionDeliveryCache() {
	return /* @__PURE__ */ new Map();
}
/** Erase a schema-specific session tool only after its input passes that owned schema. */
function eraseSessionFileTool(tool) {
	return {
		...tool,
		execute: async (toolCallId, params, signal, onUpdate) => {
			if (!Value.Check(tool.parameters, params)) throw new Error(`Invalid parameters for ${tool.name}`);
			const typedParams = params;
			return await tool.execute(toolCallId, typedParams, signal, onUpdate ? (update) => onUpdate(update) : void 0);
		}
	};
}
const READ_CONTINUATION_NOTICE_RE = /\n\n\[(?:Showing (?:lines|part of line) [^\]]*|Read output capped [^\]]*|\d+ more lines? in file\. [^\]]*)\]\s*$/;
function resolveAdaptiveReadMaxBytes(options) {
	const contextWindowTokens = options?.modelContextWindowTokens;
	if (typeof contextWindowTokens !== "number" || !Number.isFinite(contextWindowTokens) || contextWindowTokens <= 0) return DEFAULT_READ_PAGE_MAX_BYTES;
	return clampNumber(Math.floor(contextWindowTokens * CHARS_PER_TOKEN_ESTIMATE * ADAPTIVE_READ_CONTEXT_SHARE), DEFAULT_READ_PAGE_MAX_BYTES, MAX_ADAPTIVE_READ_MAX_BYTES);
}
function malformedXmlArgValuePathError(key) {
	return /* @__PURE__ */ new Error(`Malformed path parameter: ${key}. Supply correct parameters before retrying.`);
}
function formatBytes(bytes) {
	return formatByteSize(bytes, {
		style: "legacy-binary",
		maxUnit: "mega",
		separator: "",
		fractionDigits: (_value, unit) => unit === "byte" ? null : unit === "kilo" ? 0 : 1
	});
}
function getToolResultText(result) {
	const textBlocks = (Array.isArray(result.content) ? result.content : []).map((block) => {
		if (block && typeof block === "object" && block.type === "text" && typeof block.text === "string") return block.text;
	}).filter((value) => typeof value === "string");
	if (textBlocks.length === 0) return;
	return textBlocks.join("\n");
}
function withToolResultText(result, text) {
	const content = Array.isArray(result.content) ? result.content : [];
	let replaced = false;
	const nextContent = content.map((block) => {
		if (!replaced && block && typeof block === "object" && block.type === "text") {
			replaced = true;
			return Object.assign({}, block, { text });
		}
		return block;
	});
	if (replaced) return {
		...result,
		content: nextContent
	};
	const textBlock = {
		type: "text",
		text
	};
	return {
		...result,
		content: [textBlock]
	};
}
function extractReadTruncationDetails(result) {
	const details = result.details;
	if (!details || typeof details !== "object") return null;
	const truncation = details.truncation;
	if (!truncation || typeof truncation !== "object") return null;
	const record = truncation;
	if (record.truncated !== true) return null;
	const outputLinesRaw = record.outputLines;
	const outputLines = typeof outputLinesRaw === "number" && Number.isFinite(outputLinesRaw) ? Math.max(0, Math.floor(outputLinesRaw)) : 0;
	const totalLinesRaw = record.totalLines;
	return {
		truncated: true,
		outputLines,
		totalLines: typeof totalLinesRaw === "number" && Number.isFinite(totalLinesRaw) ? Math.max(0, Math.floor(totalLinesRaw)) : 0,
		continuation: extractReadContinuation(details)
	};
}
function extractReadContinuation(details) {
	const candidate = "continuation" in details ? details.continuation : void 0;
	return Value.Check(ReadToolContinuationSchema, candidate) ? candidate : void 0;
}
function withReadContinuation(result, text, continuation, outputBytes, initialOffset, truncation) {
	const details = result.details && typeof result.details === "object" ? result.details : {};
	const authoritative = ("truncation" in details ? details.truncation : void 0) ?? truncation;
	if (!authoritative || typeof authoritative !== "object") return withToolResultText(result, text);
	return {
		...withToolResultText(result, text),
		details: {
			kind: "truncated",
			content: text,
			truncation: {
				...authoritative,
				outputLines: continuation.offset - initialOffset,
				outputBytes,
				lastLinePartial: continuation.kind === "cursor"
			},
			continuation
		}
	};
}
function stripReadContinuationNotice(text) {
	return text.replace(READ_CONTINUATION_NOTICE_RE, "");
}
function stripReadTruncationContentDetails(result) {
	const details = result.details;
	if (!details || typeof details !== "object") return result;
	const detailsRecord = details;
	const truncationRaw = detailsRecord.truncation;
	if (!truncationRaw || typeof truncationRaw !== "object") return result;
	const truncation = truncationRaw;
	if (!Object.hasOwn(truncation, "content")) return result;
	const { content: _content, ...restTruncation } = truncation;
	return {
		...result,
		details: {
			...detailsRecord,
			truncation: restTruncation
		}
	};
}
async function executeReadWithAdaptivePaging(params) {
	const userLimit = params.args.limit;
	const hasExplicitLimit = typeof userLimit === "number" && Number.isFinite(userLimit) && userLimit > 0;
	const offsetRaw = params.args.offset;
	const initialOffset = typeof offsetRaw === "number" && Number.isFinite(offsetRaw) && offsetRaw > 0 ? Math.floor(offsetRaw) : 1;
	const initialLimit = hasExplicitLimit ? { limit: Math.max(1, Math.floor(userLimit)) } : {};
	let next = typeof params.args.cursor === "number" ? {
		kind: "cursor",
		offset: initialOffset,
		cursor: params.args.cursor,
		...initialLimit
	} : {
		kind: "line",
		offset: initialOffset,
		...initialLimit
	};
	let firstResult;
	let aggregatedText = "";
	let aggregatedBytes = 0;
	let previousNotice = "";
	for (let page = 0; page < MAX_ADAPTIVE_READ_PAGES; page += 1) {
		const pageArgs = {
			...params.args,
			offset: next.offset,
			...next.kind === "cursor" ? { cursor: next.cursor } : {},
			...next.limit === void 0 ? {} : { limit: next.limit }
		};
		if (next.kind === "line") delete pageArgs.cursor;
		const pageResult = await params.base.execute(params.toolCallId, pageArgs, params.signal);
		firstResult ??= pageResult;
		const rawText = getToolResultText(pageResult);
		if (typeof rawText !== "string") return pageResult;
		const truncation = extractReadTruncationDetails(pageResult);
		const pageEndLine = next.offset - 1 + (truncation?.outputLines ?? 0);
		const reachedEof = Boolean(truncation?.truncated) && pageEndLine >= (truncation?.totalLines ?? 0);
		const pageContinuation = truncation?.continuation;
		const pageText = pageContinuation || reachedEof ? stripReadContinuationNotice(rawText) : rawText;
		const delimiter = aggregatedText && pageText && next.kind === "line" ? "\n" : "";
		const candidateBytes = aggregatedBytes + delimiter.length + Buffer.byteLength(pageText, "utf8");
		const continuationNotice = pageContinuation ? formatReadContinuationNotice(pageContinuation, params.maxBytes) : "";
		if (candidateBytes + Buffer.byteLength(continuationNotice, "utf8") > params.maxBytes) {
			if (aggregatedText) return withReadContinuation(firstResult, `${aggregatedText}${previousNotice}`, next, aggregatedBytes, initialOffset);
			const lineCount = pageText.split("\n").length;
			const bounded = createBoundedReadTextPage({
				content: pageText,
				startLine: next.offset,
				endLine: next.offset + lineCount - 1,
				totalLines: truncation?.totalLines ?? next.offset + lineCount - 1,
				...next.kind === "cursor" ? { cursor: next.cursor } : {},
				limit: next.limit,
				maxBytes: params.maxBytes,
				adaptive: true
			});
			if (bounded.kind === "text") return withToolResultText(pageResult, bounded.content);
			return withReadContinuation(firstResult, bounded.content, bounded.continuation, bounded.truncation.outputBytes, initialOffset, bounded.truncation);
		}
		aggregatedText += `${delimiter}${pageText}`;
		aggregatedBytes = candidateBytes;
		if (!pageContinuation || reachedEof) return withToolResultText(pageResult, aggregatedText);
		if (hasExplicitLimit || page === MAX_ADAPTIVE_READ_PAGES - 1) return withReadContinuation(firstResult, `${aggregatedText}${continuationNotice}`, pageContinuation, aggregatedBytes, initialOffset);
		previousNotice = continuationNotice;
		next = pageContinuation;
	}
	return firstResult;
}
function rewriteReadImageHeader(text, mimeType) {
	if (text.startsWith("Read image file [") && text.endsWith("]")) return `Read image file [${mimeType}]`;
	return text;
}
async function normalizeReadImageResult(result, filePath) {
	const content = Array.isArray(result.content) ? result.content : [];
	const image = content.find((b) => Boolean(b) && typeof b === "object" && b.type === "image" && typeof b.data === "string" && typeof b.mimeType === "string");
	if (!image) return result;
	if (!image.data.trim()) throw new Error(`read: image payload is empty (${filePath})`);
	const sniffed = await sniffMimeFromBase64(image.data);
	if (!sniffed) return result;
	if (!sniffed.startsWith("image/")) throw new Error(`read: file looks like ${sniffed} but was treated as ${image.mimeType} (${filePath})`);
	if (sniffed === image.mimeType) return result;
	const nextContent = content.map((block) => {
		if (block && typeof block === "object" && block.type === "image") return Object.assign({}, block, { mimeType: sniffed });
		if (block && typeof block === "object" && block.type === "text" && typeof block.text === "string") {
			const b = block;
			return Object.assign({}, b, { text: rewriteReadImageHeader(b.text, sniffed) });
		}
		return block;
	});
	return {
		...result,
		content: nextContent
	};
}
function normalizeReadResultDetails(result) {
	const currentDetails = result.details && typeof result.details === "object" ? result.details : void 0;
	if (currentDetails?.status === "not_found" && typeof currentDetails.path === "string" && currentDetails.optional === true) return {
		...result,
		details: {
			kind: "not_found",
			status: "not_found",
			path: currentDetails.path,
			optional: true
		}
	};
	const content = Array.isArray(result.content) ? result.content : [];
	const text = getToolResultText(result) ?? "";
	const image = content.find((block) => Boolean(block) && typeof block === "object" && block.type === "image" && typeof block.mimeType === "string");
	if (image) return {
		...result,
		details: {
			kind: "image",
			content: text,
			mimeType: image.mimeType
		}
	};
	const truncation = currentDetails?.truncation;
	if (currentDetails && truncation && typeof truncation === "object") {
		const continuation = extractReadContinuation(currentDetails);
		if (!continuation) return {
			...result,
			details: {
				kind: "text",
				content: text
			}
		};
		return {
			...result,
			details: {
				kind: "truncated",
				content: text,
				truncation,
				continuation
			}
		};
	}
	return {
		...result,
		details: {
			kind: "text",
			content: text
		}
	};
}
/** Wrap a file tool so path params stay inside the workspace root. */
function wrapToolWorkspaceRootGuard(tool, root) {
	return wrapToolWorkspaceRootGuardWithOptions(tool, root);
}
function mapContainerPathToWorkspaceRoot(params) {
	return mapContainerPathToRoot({
		filePath: params.filePath,
		root: params.root,
		containerRoot: params.containerWorkdir
	}).filePath;
}
function resolveContainerPathCandidate(filePath) {
	let candidate = filePath.startsWith("@") ? filePath.slice(1) : filePath;
	if (/^file:\/\//i.test(candidate)) {
		const localFilePath = trySafeFileURLToPath(candidate);
		if (localFilePath) candidate = localFilePath;
		else {
			let parsed;
			try {
				parsed = new URL(candidate);
			} catch {
				return filePath;
			}
			if (parsed.protocol !== "file:") return filePath;
			const host = parsed.hostname.trim().toLowerCase();
			if (host && host !== "localhost") return filePath;
			if (hasEncodedFileUrlSeparator(parsed.pathname)) return filePath;
			let normalizedPathname;
			try {
				normalizedPathname = decodeURIComponent(parsed.pathname).replace(/\\/g, "/");
			} catch {
				return filePath;
			}
			candidate = normalizedPathname;
		}
	}
	return candidate;
}
function mapContainerPathToRoot(params) {
	const containerRoot = params.containerRoot?.trim();
	if (!containerRoot) return {
		filePath: params.filePath,
		matched: false
	};
	const normalizedRoot = containerRoot.replace(/\\/g, "/").replace(/\/+$/, "");
	if (!normalizedRoot.startsWith("/") || !normalizedRoot) return {
		filePath: params.filePath,
		matched: false
	};
	const candidate = resolveContainerPathCandidate(params.filePath);
	if (candidate === null) return {
		filePath: params.filePath,
		matched: false
	};
	const normalizedCandidate = path.posix.normalize(candidate.replace(/\\/g, "/"));
	if (normalizedCandidate === normalizedRoot) return {
		filePath: path.resolve(params.root),
		matched: true
	};
	const prefix = `${normalizedRoot}/`;
	if (!normalizedCandidate.startsWith(prefix)) return {
		filePath: candidate,
		matched: false
	};
	const relative = normalizedCandidate.slice(prefix.length);
	if (!relative) return {
		filePath: path.resolve(params.root),
		matched: true
	};
	return {
		filePath: path.resolve(params.root, ...relative.split("/").filter(Boolean)),
		matched: true
	};
}
/** Resolve a model-supplied file path against the host workspace root. */
function resolveToolPathAgainstWorkspaceRoot(params) {
	const mapped = mapContainerPathToWorkspaceRoot(params);
	const candidate = mapped.startsWith("@") ? mapped.slice(1) : mapped;
	if (isWindowsDrivePath(candidate)) return path.win32.normalize(candidate);
	if (path.isAbsolute(candidate)) return path.resolve(candidate);
	return path.resolve(params.root, candidate || ".");
}
async function readOptionalUtf8File(params) {
	try {
		if (params.sandbox) {
			if (!await params.sandbox.bridge.stat({
				filePath: params.relativePath,
				cwd: params.sandbox.root,
				signal: params.signal
			})) return "";
			return (await params.sandbox.bridge.readFile({
				filePath: params.relativePath,
				cwd: params.sandbox.root,
				signal: params.signal
			})).toString("utf-8");
		}
		return await fs$1.readFile(params.absolutePath, "utf-8");
	} catch (error) {
		if (error?.code === "ENOENT") return "";
		throw error;
	}
}
async function appendMemoryFlushContent(params) {
	if (!params.sandbox) {
		await (await root(params.root)).append(params.relativePath, params.content, {
			mkdir: true,
			prependNewlineIfNeeded: true
		});
		return;
	}
	const existing = await readOptionalUtf8File({
		absolutePath: params.absolutePath,
		relativePath: params.relativePath,
		sandbox: params.sandbox,
		signal: params.signal
	});
	const next = `${existing}${existing.length > 0 && !existing.endsWith("\n") && !params.content.startsWith("\n") ? "\n" : ""}${params.content}`;
	if (params.sandbox) {
		const parent = path.posix.dirname(params.relativePath);
		if (parent && parent !== ".") await params.sandbox.bridge.mkdirp({
			filePath: parent,
			cwd: params.sandbox.root,
			signal: params.signal
		});
		await params.sandbox.bridge.writeFile({
			filePath: params.relativePath,
			cwd: params.sandbox.root,
			data: next,
			mkdir: true,
			signal: params.signal
		});
		return;
	}
	await fs$1.mkdir(path.dirname(params.absolutePath), { recursive: true });
	await fs$1.writeFile(params.absolutePath, next, "utf-8");
}
/** Restrict a write tool to appending memory-flush content to one path. */
function wrapToolMemoryFlushAppendOnlyWrite(tool, options) {
	const allowedAbsolutePath = path.resolve(options.root, options.relativePath);
	return {
		...tool,
		description: `${tool.description} During memory flush, this tool may only append to ${options.relativePath}.`,
		execute: async (toolCallId, args, signal, onUpdate) => {
			const record = asOptionalObjectRecord(args);
			const normalizedRecord = record ? await normalizeFileToolPathParamsFromKeys(record, ["path"], options.root, options.sandbox?.bridge) : void 0;
			assertRequiredParams(normalizedRecord, REQUIRED_PARAM_GROUPS.write, tool.name);
			const filePath = typeof normalizedRecord?.path === "string" && normalizedRecord.path.trim() ? normalizedRecord.path : void 0;
			const content = typeof record?.content === "string" ? record.content : void 0;
			if (!filePath || content === void 0) return tool.execute(toolCallId, args, signal, onUpdate);
			const resolvedPath = resolveToolPathAgainstWorkspaceRoot({
				filePath,
				root: options.root,
				containerWorkdir: options.containerWorkdir
			});
			if (filePath.startsWith("@") || resolvedPath !== allowedAbsolutePath) throw new Error(`Memory flush writes are restricted to ${options.relativePath}; use that path only.`);
			const contentBefore = await readOptionalUtf8File({
				absolutePath: allowedAbsolutePath,
				relativePath: options.relativePath,
				sandbox: options.sandbox,
				signal
			});
			const separator = contentBefore.length > 0 && !contentBefore.endsWith("\n") && !content.startsWith("\n") ? "\n" : "";
			const commit = () => appendMemoryFlushContent({
				absolutePath: allowedAbsolutePath,
				root: options.root,
				relativePath: options.relativePath,
				content,
				sandbox: options.sandbox,
				signal
			});
			if (options.memoryWriteProvenance?.classifies(allowedAbsolutePath)) await options.memoryWriteProvenance.write({
				absolutePath: allowedAbsolutePath,
				contentBefore,
				contentAfter: `${contentBefore}${separator}${content}`,
				commit
			});
			else await commit();
			return {
				content: [{
					type: "text",
					text: `Appended content to ${options.relativePath}.`
				}],
				details: { changed: true }
			};
		}
	};
}
function isSandboxRootEscapeError(error) {
	return error instanceof Error && /^Path escapes sandbox root \(/i.test(error.message);
}
function withWorkspaceSafeTempHint(error) {
	if (!isSandboxRootEscapeError(error)) return error;
	const message = error.message.includes(".openclaw/tmp/") ? error.message : `${error.message}. Use a relative path under \`.openclaw/tmp/\` inside the workspace for scratch/temp/meta files that file tools need to read or write later.`;
	return new Error(message, { cause: error });
}
async function assertSandboxPathWithinAnyRoot(params) {
	let firstRootEscapeError;
	const seen = /* @__PURE__ */ new Set();
	for (const [index, candidateRoot] of params.roots.entries()) {
		const trimmedRoot = candidateRoot.trim();
		if (!trimmedRoot) continue;
		const root = path.resolve(trimmedRoot);
		if (seen.has(root)) continue;
		seen.add(root);
		try {
			return await assertSandboxPath({
				filePath: params.filePath,
				cwd: index === 0 ? params.cwd ?? root : root,
				root
			});
		} catch (error) {
			if (!isSandboxRootEscapeError(error)) throw error;
			firstRootEscapeError ??= error;
		}
	}
	throw toErrorObject(firstRootEscapeError ?? /* @__PURE__ */ new Error("Path guard has no configured roots."), "Non-Error thrown");
}
/** Wrap a file tool with workspace guards and optional container path mapping. */
function wrapToolWorkspaceRootGuardWithOptions(tool, root, options) {
	const pathParamKeys = options?.pathParamKeys && options.pathParamKeys.length > 0 ? options.pathParamKeys : ["path"];
	return {
		...tool,
		execute: async (toolCallId, args, signal, onUpdate) => {
			const record = asOptionalObjectRecord(args);
			let normalizedRecord;
			for (const key of pathParamKeys) {
				const rawFilePath = record?.[key];
				if (typeof rawFilePath !== "string" || !rawFilePath.trim()) continue;
				const filePath = await normalizeFileToolPathParam(rawFilePath, options?.resolutionCwd ?? root, options?.bridge);
				if (!filePath.trim()) throw malformedXmlArgValuePathError(key);
				if (filePath !== rawFilePath && record) {
					normalizedRecord ??= { ...record };
					normalizedRecord[key] = filePath;
				}
				let guardedRoot = root;
				let workspaceMapping;
				let sandboxPath = filePath;
				for (const mount of [...options?.additionalContainerMounts ?? []].toSorted((a, b) => b.containerRoot.length - a.containerRoot.length)) {
					const mountMapping = mapContainerPathToRoot({
						filePath,
						root: mount.hostRoot,
						containerRoot: mount.containerRoot
					});
					if (mountMapping.matched) {
						guardedRoot = path.resolve(mount.hostRoot);
						sandboxPath = mountMapping.filePath;
						break;
					}
				}
				if (guardedRoot === root) {
					workspaceMapping = mapContainerPathToRoot({
						filePath,
						root,
						containerRoot: options?.containerWorkdir
					});
					sandboxPath = workspaceMapping.filePath;
				}
				const additionalRoots = guardedRoot === root && !workspaceMapping?.matched ? options?.additionalRoots ?? [] : [];
				let sandboxResult;
				try {
					sandboxResult = await assertSandboxPathWithinAnyRoot({
						cwd: guardedRoot === root && !workspaceMapping?.matched ? options?.resolutionCwd : void 0,
						filePath: sandboxPath,
						roots: [guardedRoot, ...additionalRoots]
					});
				} catch (error) {
					throw withWorkspaceSafeTempHint(error);
				}
				if (options?.normalizeGuardedPathParams && record) {
					normalizedRecord ??= { ...record };
					normalizedRecord[key] = sandboxResult.resolved;
				}
			}
			return tool.execute(toolCallId, normalizedRecord ?? args, signal, onUpdate);
		}
	};
}
/** Create a sandbox-backed read tool with OpenClaw result normalization. */
function createSandboxedReadTool(params) {
	return createOpenClawReadTool(eraseSessionFileTool((params.createTool ?? createReadTool)(params.root, {
		operations: createSandboxReadOperations(params),
		maxBytes: resolveAdaptiveReadMaxBytes(params),
		modelHasVision: params.modelHasVision
	})), {
		modelContextWindowTokens: params.modelContextWindowTokens,
		imageSanitization: params.imageSanitization,
		cwd: params.root,
		bridge: params.bridge
	});
}
/** Create a sandbox-backed write tool with required-parameter validation. */
function createSandboxedWriteTool(params) {
	return wrapToolParamValidation(eraseSessionFileTool((params.createTool ?? createWriteTool)(params.root, { operations: createSandboxWriteOperations(params) })), REQUIRED_PARAM_GROUPS.write, params.root, params.bridge);
}
/** Create a sandbox-backed edit tool with required-parameter validation. */
function createSandboxedEditTool(params) {
	return wrapToolParamValidation(eraseSessionFileTool((params.createTool ?? createEditTool)(params.root, { operations: createSandboxEditOperations(params) })), REQUIRED_PARAM_GROUPS.edit, params.root, params.bridge);
}
/** Create a host workspace write tool using guarded filesystem operations. */
function createHostWorkspaceWriteTool(root, options) {
	return wrapToolParamValidation(eraseSessionFileTool((options?.createTool ?? createWriteTool)(root, { operations: createHostWriteOperations(options?.containmentRoot ?? root, options) })), REQUIRED_PARAM_GROUPS.write, root);
}
/** Create a host workspace edit tool using guarded filesystem operations. */
function createHostWorkspaceEditTool(root, options) {
	return wrapToolParamValidation(eraseSessionFileTool((options?.createTool ?? createEditTool)(root, { operations: createHostEditOperations(options?.containmentRoot ?? root, options) })), REQUIRED_PARAM_GROUPS.edit, root);
}
/** Wrap the base read tool with OpenClaw paging, MIME, and image handling. */
function createOpenClawReadTool(base, options) {
	return {
		...base,
		execute: async (toolCallId, params, signal) => {
			const record = asOptionalObjectRecord(params);
			const normalizedRecord = record ? await normalizeFileToolPathParamsFromKeys(record, ["path"], options?.cwd, options?.bridge) : void 0;
			assertRequiredParams(normalizedRecord, REQUIRED_PARAM_GROUPS.read, base.name);
			const filePath = typeof normalizedRecord?.path === "string" ? normalizedRecord.path : "<unknown>";
			const dailyMemoryPath = process.platform === "win32" ? filePath.replace(/\\/g, "/") : filePath;
			const sanitizedResult = await sanitizeToolResultImages(await normalizeReadImageResult(stripReadTruncationContentDetails(await executeReadWithAdaptivePaging({
				base,
				toolCallId,
				args: normalizedRecord?.optional === void 0 && /^(?:\.\/)*memory\/\d{4}-\d{2}-\d{2}\.md$/u.test(dailyMemoryPath) ? {
					...normalizedRecord,
					optional: true
				} : normalizedRecord ?? {},
				signal,
				maxBytes: resolveAdaptiveReadMaxBytes(options)
			})), filePath), `read:${filePath}`, options?.imageSanitization);
			return normalizeReadResultDetails(ENV_FILE_PATH_RE.test(filePath) ? {
				...sanitizedResult,
				content: redactSecrets(sanitizedResult.content)
			} : sanitizedResult);
		}
	};
}
/** Serve exact non-filesystem skill locators before workspace path guards run. */
function wrapReadToolWithSkillContent(tool, skills, options) {
	const cwd = options?.cwd ?? process.cwd();
	const resolveInstructionPath = (filePath) => {
		if (filePath.startsWith("node://")) return filePath;
		return resolveToCwd(mapContainerPathToWorkspaceRoot({
			filePath,
			root: cwd,
			containerWorkdir: options?.containerWorkdir
		}), cwd);
	};
	const instructionContent = new Map((options?.instructionPaths ?? []).map((filePath) => [resolveInstructionPath(filePath), void 0]));
	for (const skill of skills ?? []) instructionContent.set(resolveInstructionPath(skill.filePath), skill.filePath.startsWith("node://") ? skill.readContent : void 0);
	if (instructionContent.size === 0) return tool;
	const instructionDeliveryCache = options?.instructionDeliveryCache;
	const alreadyDeliveredResult = () => {
		const text = "Skill instructions were already served whole earlier in the current model context. Reuse that content; the full document will be served again if compaction removes it.";
		return {
			content: [{
				type: "text",
				text
			}],
			details: {
				kind: "text",
				content: text
			}
		};
	};
	const readContent = (filePath) => {
		const content = instructionContent.get(filePath);
		if (content === void 0) throw Object.assign(/* @__PURE__ */ new Error(`Virtual skill file not found: ${filePath}`), { code: "ENOENT" });
		return content;
	};
	let virtualRead;
	return {
		...tool,
		execute: async (toolCallId, args, signal, onUpdate) => {
			const record = asOptionalObjectRecord(args);
			const rawPath = record?.path;
			const normalizedPath = typeof rawPath === "string" ? normalizeFileToolPathParam(rawPath) : void 0;
			const instructionPath = normalizedPath ? resolveInstructionPath(normalizedPath) : void 0;
			if (!normalizedPath || !instructionPath || !instructionContent.has(instructionPath)) return tool.execute(toolCallId, args, signal, onUpdate);
			for (;;) {
				const priorDelivery = instructionDeliveryCache?.get(instructionPath);
				if (!priorDelivery) break;
				const delivered = await priorDelivery;
				if (instructionDeliveryCache?.get(instructionPath) !== priorDelivery) continue;
				if (delivered) return alreadyDeliveredResult();
				instructionDeliveryCache?.delete(instructionPath);
			}
			let settleDelivery = (_delivered) => void 0;
			let delivery;
			if (instructionDeliveryCache) {
				delivery = new Promise((resolve) => {
					settleDelivery = resolve;
				});
				instructionDeliveryCache.set(instructionPath, delivery);
			}
			const resetDelivery = () => {
				settleDelivery(false);
				if (delivery && instructionDeliveryCache?.get(instructionPath) === delivery) instructionDeliveryCache.delete(instructionPath);
			};
			const instructionTool = typeof instructionContent.get(instructionPath) === "string" ? virtualRead ??= createOpenClawReadTool(eraseSessionFileTool(createReadTool("/", {
				maxBytes: resolveAdaptiveReadMaxBytes(options),
				operations: {
					resolvePath: (filePath) => filePath,
					access: async (filePath) => void readContent(filePath),
					readFile: async (filePath) => Buffer.from(readContent(filePath), "utf8")
				}
			})), options) : tool;
			const instructionArgs = {
				...record,
				path: normalizedPath
			};
			for (const key of [
				"offset",
				"limit",
				"cursor"
			]) delete instructionArgs[key];
			try {
				const result = await instructionTool.execute(toolCallId, instructionArgs, signal, onUpdate);
				const details = result.details;
				const detailsKind = details && typeof details === "object" && "kind" in details && typeof details.kind === "string" ? details.kind : void 0;
				if (detailsKind === "truncated") {
					resetDelivery();
					const text = `Skill instructions cannot be partially served: the whole document exceeds the ${formatBytes(resolveAdaptiveReadMaxBytes(options))} read budget. Ask the operator to reduce the document or increase the model context.`;
					return {
						content: [{
							type: "text",
							text
						}],
						details: {
							kind: "text",
							content: text
						}
					};
				}
				if (detailsKind !== "text") {
					resetDelivery();
					return result;
				}
				settleDelivery(true);
				return result;
			} catch (error) {
				resetDelivery();
				throw error;
			}
		}
	};
}
function createSandboxReadOperations(params) {
	return {
		resolvePath: (filePath) => {
			const normalizedMediaSource = normalizeMediaReferenceSource(filePath);
			if (classifyMediaReferenceSource(normalizedMediaSource).isMediaStoreUrl) return resolveMediaReferenceSandboxPath(normalizedMediaSource, "media/inbound").resolved;
			return resolveContainerPathCandidate(filePath) ?? filePath;
		},
		decodeText: ({ buffer, absolutePath }) => params.bridge.resolvePath({
			filePath: absolutePath,
			cwd: params.root
		}).hostPath ? decodeWindowsTextFileBuffer({ buffer }) : buffer.toString("utf8"),
		readFile: (absolutePath) => params.bridge.readFile({
			filePath: absolutePath,
			cwd: params.root
		}),
		access: (absolutePath) => assertSandboxFileExists(params, absolutePath),
		detectImageMimeType: async (absolutePath, buffer) => {
			const mime = await detectMime({
				buffer,
				filePath: absolutePath
			});
			return mime?.startsWith("image/") ? mime : void 0;
		}
	};
}
function createSandboxWriteOperations(params) {
	return withMemoryWriteProvenance({
		mkdir: async (dir) => {
			await params.bridge.mkdirp({
				filePath: dir,
				cwd: params.root
			});
		},
		writeFile: async (absolutePath, content) => {
			await params.bridge.writeFile({
				filePath: absolutePath,
				cwd: params.root,
				data: content
			});
		},
		readFile: (absolutePath) => params.bridge.readFile({
			filePath: absolutePath,
			cwd: params.root
		}),
		statFile: (absolutePath) => params.bridge.stat({
			filePath: absolutePath,
			cwd: params.root
		})
	}, params.memoryWriteProvenance);
}
function createSandboxEditOperations(params) {
	return withMemoryWriteProvenance({
		readFile: (absolutePath) => params.bridge.readFile({
			filePath: absolutePath,
			cwd: params.root
		}),
		writeFile: (absolutePath, content) => params.bridge.writeFile({
			filePath: absolutePath,
			cwd: params.root,
			data: content
		}),
		statFile: (absolutePath) => params.bridge.stat({
			filePath: absolutePath,
			cwd: params.root
		}),
		access: (absolutePath) => assertSandboxFileExists(params, absolutePath)
	}, params.memoryWriteProvenance);
}
async function assertSandboxFileExists(params, absolutePath) {
	const stat = await params.bridge.stat({
		filePath: absolutePath,
		cwd: params.root
	});
	if (!stat) throw createFsAccessError("ENOENT", absolutePath);
	if (stat.type === "directory") throw createFsAccessError("EISDIR", absolutePath);
}
function resolveHostPath(filePath) {
	return path.resolve(expandOsHomePrefix(filePath));
}
async function writeHostFileRange(handle, payload, offset, length, position) {
	let written = 0;
	while (written < length) {
		const { bytesWritten } = await handle.write(payload, offset + written, length - written, position + written);
		if (bytesWritten <= 0) throw new Error(`host file write made no progress at byte ${position + written}`);
		written += bytesWritten;
	}
}
async function readHostFilePrefix(handle, length) {
	const prefix = Buffer.alloc(length);
	let read = 0;
	while (read < length) {
		const { bytesRead } = await handle.read(prefix, read, length - read, read);
		if (bytesRead <= 0) throw new Error(`host file read made no progress at byte ${read}`);
		read += bytesRead;
	}
	return prefix;
}
async function overwriteHostFileInPlace(handle, payload, currentSize) {
	const prefixLength = Math.min(payload.length, currentSize);
	const originalPrefix = await readHostFilePrefix(handle, prefixLength);
	let prefixStarted = false;
	try {
		if (payload.length > currentSize) await writeHostFileRange(handle, payload, currentSize, payload.length - currentSize, currentSize);
		prefixStarted = true;
		await writeHostFileRange(handle, payload, 0, prefixLength, 0);
		if (payload.length < currentSize) await handle.truncate(payload.length);
	} catch (error) {
		if (prefixStarted) await writeHostFileRange(handle, originalPrefix, 0, prefixLength, 0).catch(() => void 0);
		await handle.truncate(currentSize).catch(() => void 0);
		throw error;
	}
}
async function openHostFileForUpdate(resolved) {
	try {
		return (await fs$1.stat(resolved)).isFile() ? await fs$1.open(resolved, "r+") : void 0;
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return;
		throw error;
	}
}
async function writeHostFile(absolutePath, content) {
	const resolved = resolveHostPath(absolutePath);
	await fs$1.mkdir(path.dirname(resolved), { recursive: true });
	const handle = await openHostFileForUpdate(resolved);
	if (!handle) {
		await fs$1.writeFile(resolved, content, "utf-8");
		return;
	}
	try {
		const stat = await handle.stat();
		await overwriteHostFileInPlace(handle, Buffer.from(content, "utf-8"), stat.size);
	} finally {
		await handle.close().catch(() => void 0);
	}
}
async function statHostFile(absolutePath) {
	try {
		const stat = await fs$1.stat(absolutePath);
		return {
			type: stat.isFile() ? "file" : stat.isDirectory() ? "directory" : "other",
			size: stat.size,
			mtimeMs: stat.mtimeMs
		};
	} catch (error) {
		if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") return null;
		throw error;
	}
}
async function writeWorkspaceFile(root, getRoot, absolutePath, content) {
	const relative = await toCanonicalRelativeWorkspacePath(root, absolutePath);
	const rootReal = await fs$1.realpath(root);
	if ((await fs$1.lstat(path.resolve(rootReal, relative)).catch(() => void 0))?.isSymbolicLink()) throw new FsSafeError("symlink", `refusing to write to symlink: ${absolutePath}`);
	await (await getRoot()).write(relative, content, { mkdir: true });
}
function createHostWriteOperations(root$1, options) {
	if (!(options?.workspaceOnly ?? false)) return withMemoryWriteProvenance({
		mkdir: async (dir) => {
			const resolved = resolveHostPath(dir);
			await fs$1.mkdir(resolved, { recursive: true });
		},
		writeFile: writeHostFile,
		readFile: async (absolutePath) => fs$1.readFile(path.resolve(expandOsHomePrefix(absolutePath))),
		statFile: (absolutePath) => statHostFile(path.resolve(expandOsHomePrefix(absolutePath)))
	}, options?.memoryWriteProvenance);
	let rootPromise;
	const getRoot = () => rootPromise ??= root(root$1);
	return withMemoryWriteProvenance({
		mkdir: async (dir) => {
			const relative = toRelativeWorkspacePath(root$1, dir, { allowRoot: true });
			const resolved = relative ? path.resolve(root$1, relative) : path.resolve(root$1);
			await assertSandboxPath({
				filePath: resolved,
				cwd: root$1,
				root: root$1
			});
			await fs$1.mkdir(resolved, { recursive: true });
		},
		writeFile: (absolutePath, content) => writeWorkspaceFile(root$1, getRoot, absolutePath, content),
		readFile: async (absolutePath) => {
			const relative = await toCanonicalRelativeWorkspacePath(root$1, absolutePath);
			return (await (await getRoot()).read(relative)).buffer;
		},
		statFile: async (absolutePath) => {
			const relative = toRelativeWorkspacePath(root$1, absolutePath);
			return statHostFile(path.resolve(root$1, relative));
		}
	}, options?.memoryWriteProvenance);
}
function createHostEditOperations(root$2, options) {
	if (!(options?.workspaceOnly ?? false)) return withMemoryWriteProvenance({
		readFile: async (absolutePath) => {
			return await fs$1.readFile(resolveHostPath(absolutePath));
		},
		writeFile: writeHostFile,
		statFile: (absolutePath) => statHostFile(resolveHostPath(absolutePath)),
		access: async (absolutePath) => {
			await fs$1.access(resolveHostPath(absolutePath));
		}
	}, options?.memoryWriteProvenance);
	let rootPromise;
	const getRoot = () => rootPromise ??= root(root$2);
	return withMemoryWriteProvenance({
		readFile: async (absolutePath) => {
			const relative = await toCanonicalRelativeWorkspacePath(root$2, absolutePath);
			return (await (await getRoot()).read(relative)).buffer;
		},
		writeFile: (absolutePath, content) => writeWorkspaceFile(root$2, getRoot, absolutePath, content),
		statFile: async (absolutePath) => {
			const relative = toRelativeWorkspacePath(root$2, absolutePath);
			return statHostFile(path.resolve(root$2, relative));
		},
		access: async (absolutePath) => {
			let relative;
			try {
				relative = await toCanonicalRelativeWorkspacePath(root$2, absolutePath);
			} catch {
				return;
			}
			try {
				await (await (await getRoot()).open(relative)).handle.close().catch(() => {});
			} catch (error) {
				if (error instanceof FsSafeError && error.code === "not-found") throw createFsAccessError("ENOENT", absolutePath);
				if (error instanceof FsSafeError && error.code === "outside-workspace") return;
				throw error;
			}
		}
	}, options?.memoryWriteProvenance);
}
async function toCanonicalRelativeWorkspacePath(root, absolutePath) {
	const lexicalRelative = toRelativeWorkspacePath(root, absolutePath);
	const lexicalPath = path.resolve(root, lexicalRelative);
	const parentPath = path.dirname(lexicalPath);
	const [rootReal, canonicalParentPath] = await Promise.all([fs$1.realpath(root), canonicalPathFromExistingAncestor(parentPath)]);
	return toRelativeWorkspacePath(rootReal, path.join(canonicalParentPath, path.basename(lexicalPath)));
}
function createFsAccessError(code, filePath) {
	const error = /* @__PURE__ */ new Error(`Sandbox FS error (${code}): ${filePath}`);
	error.code = code;
	return error;
}
//#endregion
export { createSandboxedReadTool as a, resolveAdaptiveReadMaxBytes as c, wrapToolWorkspaceRootGuard as d, wrapToolWorkspaceRootGuardWithOptions as f, createSandboxedEditTool as i, wrapReadToolWithSkillContent as l, withMemoryWriteProvenance as m, createHostWorkspaceWriteTool as n, createSandboxedWriteTool as o, createMemoryWriteProvenanceObserver as p, createOpenClawReadTool as r, createSkillInstructionDeliveryCache as s, createHostWorkspaceEditTool as t, wrapToolMemoryFlushAppendOnlyWrite as u };
