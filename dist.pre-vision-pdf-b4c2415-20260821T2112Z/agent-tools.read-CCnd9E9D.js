import { i as toErrorObject } from "./error-coercion-DisD0JTb.js";
import "./src-BkwWvwB2.js";
import { n as formatByteSize } from "./format-CgMRsTCK.js";
import { i as asOptionalObjectRecord } from "./record-coerce-DItp3I4t.js";
import { E as isMissingPathError } from "./redact-Cl7lwBnl.js";
import { t as FsSafeError } from "./errors-CQDiIdj7.js";
import { f as trySafeFileURLToPath, s as hasEncodedFileUrlSeparator } from "./read-open-flags-DGgM-BoE.js";
import { n as canonicalPathFromExistingAncestor } from "./absolute-path-BseY-yOe.js";
import { r as root } from "./fs-safe-C9N8pCh1.js";
import { i as clampNumber } from "./utils-DEqefz4f.js";
import "./errors-CSNUPl5U.js";
import { r as decodeWindowsTextFileBuffer } from "./windows-encoding-zzUQjdb4.js";
import { i as logWarn } from "./logger-DKrZPnAI.js";
import { n as isWindowsDrivePath } from "./archive-entry-DulHWXJZ.js";
import { n as detectMime } from "./mime-Hm4eS2i0.js";
import "./archive-path-C2hsuc07.js";
import "./local-file-access-C2hsuc07.js";
import { n as assertSandboxPath } from "./sandbox-paths-BihmZ4cR.js";
import { r as toRelativeWorkspacePath } from "./path-policy-fuudDMle.js";
import { D as createReadTool, L as createEditTool, T as createWriteTool } from "./sessions-BIUamgQ4.js";
import { r as sanitizeToolResultImages } from "./tool-images-pW75g61G.js";
import { t as expandOsHomePrefix } from "./path-utils-DhfwxP7G.js";
import { i as normalizeMediaReferenceSource, l as resolveMediaReferenceSandboxPath, r as classifyMediaReferenceSource } from "./media-reference-BeABx1cr.js";
import { i as normalizeFileToolPathParamsFromKeys, n as assertRequiredParams, o as wrapToolParamValidation, r as normalizeFileToolPathParam, t as REQUIRED_PARAM_GROUPS } from "./agent-tools.params-Cvm89ne0.js";
import { t as sniffMimeFromBase64 } from "./sniff-mime-from-base64-CcehgCxc.js";
import { URL } from "node:url";
import { realpathSync } from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
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
			await remove(absolutePath);
			await observer.clearAfterDelete(absolutePath);
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
	const normalized = relativePath.replaceAll(path.sep, "/");
	if ([
		"MEMORY.md",
		"memory.md",
		"USER.md"
	].includes(normalized)) return normalized;
	return normalized.startsWith("memory/") && normalized.endsWith(".md") ? normalized : void 0;
}
function createMemoryWriteProvenanceObserver(params) {
	if (!params.plan.recordWriteProvenance) return;
	const now = params.now ?? Date.now;
	return {
		classifies: (absolutePath) => resolveMemoryRelativePath(params.mutationRoot, absolutePath) !== void 0,
		write: async ({ absolutePath, contentBefore, contentAfter, commit }) => {
			const relativePath = resolveMemoryRelativePath(params.mutationRoot, absolutePath);
			if (!relativePath) {
				await commit();
				return;
			}
			const rollback = await params.plan.recordWriteProvenance?.({
				workspaceDir: params.workspaceDir,
				relativePath,
				contentBefore,
				contentAfter,
				originClass: params.resolveOriginClass(),
				observedAt: now()
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
		clearAfterDelete: async (absolutePath) => {
			const relativePath = resolveMemoryRelativePath(params.mutationRoot, absolutePath);
			if (!relativePath) return;
			try {
				await params.plan.clearWriteProvenance?.({
					workspaceDir: params.workspaceDir,
					relativePath
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
const READ_CONTINUATION_NOTICE_RE = /\n\n\[(?:Showing lines [^\]]*?Use offset=\d+ to continue\.|\d+ more lines in file\. Use offset=\d+ to continue\.)\]\s*$/;
const DAILY_MEMORY_PATH_RE = /^memory\/\d{4}-\d{2}-\d{2}\.md$/;
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
		firstLineExceedsLimit: record.firstLineExceedsLimit === true
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
function missingDailyMemoryReadResult(relativePath) {
	return {
		content: [{
			type: "text",
			text: `No daily memory file exists yet at ${relativePath}.`
		}],
		details: {
			status: "not_found",
			path: relativePath,
			optional: true
		}
	};
}
function normalizeDailyMemoryReadPath(value) {
	if (typeof value !== "string") return;
	const normalized = value.trim().replace(/\\/g, "/").replace(/^\.\/+/, "");
	return DAILY_MEMORY_PATH_RE.test(normalized) ? normalized : void 0;
}
function isNotFoundError(error) {
	if (isMissingPathError(error)) return true;
	if (!(error instanceof Error)) return false;
	return /\bENOENT\b|no such file or directory|file not found/i.test(error.message);
}
async function executeReadPage(params) {
	try {
		return await params.base.execute(params.toolCallId, params.args, params.signal);
	} catch (error) {
		const missingDailyMemoryPath = normalizeDailyMemoryReadPath(params.args.path);
		if (missingDailyMemoryPath && isNotFoundError(error)) return missingDailyMemoryReadResult(missingDailyMemoryPath);
		throw error;
	}
}
async function executeReadWithAdaptivePaging(params) {
	const userLimit = params.args.limit;
	if (typeof userLimit === "number" && Number.isFinite(userLimit) && userLimit > 0) return await executeReadPage(params);
	const offsetRaw = params.args.offset;
	let nextOffset = typeof offsetRaw === "number" && Number.isFinite(offsetRaw) && offsetRaw > 0 ? Math.floor(offsetRaw) : 1;
	let firstResult = null;
	let aggregatedText = "";
	let aggregatedBytes = 0;
	let capped = false;
	let continuationOffset;
	for (let page = 0; page < MAX_ADAPTIVE_READ_PAGES; page += 1) {
		const pageArgs = {
			...params.args,
			offset: nextOffset
		};
		const pageResult = await executeReadPage({
			base: params.base,
			toolCallId: params.toolCallId,
			args: pageArgs,
			signal: params.signal
		});
		firstResult ??= pageResult;
		const rawText = getToolResultText(pageResult);
		if (typeof rawText !== "string") return pageResult;
		const truncation = extractReadTruncationDetails(pageResult);
		const pageEndLine = nextOffset - 1 + (truncation?.outputLines ?? 0);
		const reachedEof = Boolean(truncation?.truncated) && pageEndLine >= (truncation?.totalLines ?? 0);
		const canContinue = Boolean(truncation?.truncated) && !truncation?.firstLineExceedsLimit && (truncation?.outputLines ?? 0) > 0 && pageEndLine < (truncation?.totalLines ?? 0) && page < MAX_ADAPTIVE_READ_PAGES - 1;
		const pageText = canContinue || reachedEof ? stripReadContinuationNotice(rawText) : rawText;
		const delimiter = aggregatedText && pageText ? "\n\n" : "";
		const nextBytes = Buffer.byteLength(`${delimiter}${pageText}`, "utf-8");
		if (aggregatedText && aggregatedBytes + nextBytes > params.maxBytes) {
			capped = true;
			continuationOffset = nextOffset;
			break;
		}
		aggregatedText += `${delimiter}${pageText}`;
		aggregatedBytes += nextBytes;
		if (!canContinue || !truncation) return withToolResultText(pageResult, aggregatedText);
		nextOffset += truncation.outputLines;
		continuationOffset = nextOffset;
		if (aggregatedBytes >= params.maxBytes) {
			capped = true;
			break;
		}
	}
	if (!firstResult) return await executeReadPage(params);
	let finalText = aggregatedText;
	if (capped && continuationOffset) finalText += `\n\n[Read output capped at ${formatBytes(params.maxBytes)} for this call. Use offset=${continuationOffset} to continue.]`;
	return withToolResultText(firstResult, finalText);
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
	if (truncation && typeof truncation === "object") return {
		...result,
		details: {
			kind: "truncated",
			content: text,
			truncation
		}
	};
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
			const normalizedRecord = record ? normalizeFileToolPathParamsFromKeys(record, ["path"]) : void 0;
			assertRequiredParams(normalizedRecord, REQUIRED_PARAM_GROUPS.write, tool.name);
			const filePath = typeof normalizedRecord?.path === "string" && normalizedRecord.path.trim() ? normalizedRecord.path : void 0;
			const content = typeof record?.content === "string" ? record.content : void 0;
			if (!filePath || content === void 0) return tool.execute(toolCallId, args, signal, onUpdate);
			if (resolveToolPathAgainstWorkspaceRoot({
				filePath,
				root: options.root,
				containerWorkdir: options.containerWorkdir
			}) !== allowedAbsolutePath) throw new Error(`Memory flush writes are restricted to ${options.relativePath}; use that path only.`);
			await appendMemoryFlushContent({
				absolutePath: allowedAbsolutePath,
				root: options.root,
				relativePath: options.relativePath,
				content,
				sandbox: options.sandbox,
				signal
			});
			return {
				content: [{
					type: "text",
					text: `Appended content to ${options.relativePath}.`
				}],
				details: {
					path: options.relativePath,
					appendOnly: true
				}
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
	for (const candidateRoot of params.roots) {
		const trimmedRoot = candidateRoot.trim();
		if (!trimmedRoot) continue;
		const root = path.resolve(trimmedRoot);
		if (seen.has(root)) continue;
		seen.add(root);
		try {
			return await assertSandboxPath({
				filePath: params.filePath,
				cwd: root,
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
				const filePath = normalizeFileToolPathParam(rawFilePath);
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
	return createOpenClawReadTool((params.createTool ?? createReadTool)(params.root, { operations: createSandboxReadOperations(params) }), {
		modelContextWindowTokens: params.modelContextWindowTokens,
		imageSanitization: params.imageSanitization
	});
}
/** Create a sandbox-backed write tool with required-parameter validation. */
function createSandboxedWriteTool(params) {
	return wrapToolParamValidation((params.createTool ?? createWriteTool)(params.root, { operations: createSandboxWriteOperations(params) }), REQUIRED_PARAM_GROUPS.write);
}
/** Create a sandbox-backed edit tool with required-parameter validation. */
function createSandboxedEditTool(params) {
	return wrapToolParamValidation((params.createTool ?? createEditTool)(params.root, { operations: createSandboxEditOperations(params) }), REQUIRED_PARAM_GROUPS.edit);
}
/** Create a host workspace write tool using guarded filesystem operations. */
function createHostWorkspaceWriteTool(root, options) {
	return wrapToolParamValidation((options?.createTool ?? createWriteTool)(root, { operations: createHostWriteOperations(root, options) }), REQUIRED_PARAM_GROUPS.write);
}
/** Create a host workspace edit tool using guarded filesystem operations. */
function createHostWorkspaceEditTool(root, options) {
	return wrapToolParamValidation((options?.createTool ?? createEditTool)(root, { operations: createHostEditOperations(root, options) }), REQUIRED_PARAM_GROUPS.edit);
}
/** Wrap the base read tool with OpenClaw paging, MIME, and image handling. */
function createOpenClawReadTool(base, options) {
	return {
		...base,
		execute: async (toolCallId, params, signal) => {
			const record = asOptionalObjectRecord(params);
			const normalizedRecord = record ? normalizeFileToolPathParamsFromKeys(record, ["path"]) : void 0;
			assertRequiredParams(normalizedRecord, REQUIRED_PARAM_GROUPS.read, base.name);
			const result = await executeReadWithAdaptivePaging({
				base,
				toolCallId,
				args: normalizedRecord ?? {},
				signal,
				maxBytes: resolveAdaptiveReadMaxBytes(options)
			});
			const filePath = typeof normalizedRecord?.path === "string" ? normalizedRecord.path : "<unknown>";
			return normalizeReadResultDetails(await sanitizeToolResultImages(await normalizeReadImageResult(stripReadTruncationContentDetails(result), filePath), `read:${filePath}`, options?.imageSanitization));
		}
	};
}
/** Serve exact non-filesystem skill locators before workspace path guards run. */
function wrapReadToolWithSkillContent(tool, skills, options) {
	const contentByPath = new Map((skills ?? []).flatMap((skill) => skill.filePath.startsWith("node://") && typeof skill.readContent === "string" ? [[skill.filePath, skill.readContent]] : []));
	if (contentByPath.size === 0) return tool;
	const readContent = (filePath) => {
		const content = contentByPath.get(filePath);
		if (content === void 0) throw Object.assign(/* @__PURE__ */ new Error(`Virtual skill file not found: ${filePath}`), { code: "ENOENT" });
		return content;
	};
	const virtualRead = createOpenClawReadTool(createReadTool("/", { operations: {
		resolvePath: (filePath) => filePath,
		access: async (filePath) => void readContent(filePath),
		readFile: async (filePath) => Buffer.from(readContent(filePath), "utf8")
	} }), options);
	return {
		...tool,
		execute: async (toolCallId, args, signal, onUpdate) => {
			const record = asOptionalObjectRecord(args);
			const rawPath = record?.path;
			const normalizedPath = typeof rawPath === "string" ? normalizeFileToolPathParam(rawPath) : void 0;
			if (normalizedPath && contentByPath.has(normalizedPath)) {
				const virtualArgs = normalizedPath === rawPath || !record ? args : {
					...record,
					path: normalizedPath
				};
				return virtualRead.execute(toolCallId, virtualArgs, signal, onUpdate);
			}
			return tool.execute(toolCallId, args, signal, onUpdate);
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
async function writeHostFile(absolutePath, content) {
	const resolved = resolveHostPath(absolutePath);
	await fs$1.mkdir(path.dirname(resolved), { recursive: true });
	await fs$1.writeFile(resolved, content, "utf-8");
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
export { createSandboxedReadTool as a, wrapToolMemoryFlushAppendOnlyWrite as c, createMemoryWriteProvenanceObserver as d, withMemoryWriteProvenance as f, createSandboxedEditTool as i, wrapToolWorkspaceRootGuard as l, createHostWorkspaceWriteTool as n, createSandboxedWriteTool as o, createOpenClawReadTool as r, wrapReadToolWithSkillContent as s, createHostWorkspaceEditTool as t, wrapToolWorkspaceRootGuardWithOptions as u };
