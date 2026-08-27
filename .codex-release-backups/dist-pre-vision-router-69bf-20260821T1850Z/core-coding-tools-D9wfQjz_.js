import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.js";
import { c as normalizeOptionalLowercaseString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { t as FsSafeError } from "./errors-hdcLXK2n.js";
import { n as canonicalPathFromExistingAncestor } from "./absolute-path-DBVN5h2m.js";
import { r as root } from "./fs-safe-X_oyl7Rx.js";
import { o as PATH_ALIAS_POLICIES } from "./root-impl-DNOINk8h.js";
import { t as createAbortError } from "./abort-signal-DEbc_zqk.js";
import { n as openRootFileFollowingParents } from "./boundary-file-read-Dy4MeTWa.js";
import { r as formatErrorMessage } from "./errors-CqPTYU6G.js";
import "./agent-scope-D9GLFAyB.js";
import { s as resolveAgentConfig } from "./agent-scope-config-CsnnOL14.js";
import { d as PROCESS_TOOL_DISPLAY_SUMMARY } from "./tool-catalog-Dl50knwD.js";
import { r as isAutomationsToolName } from "./automations-tool-name-CYqaxHxr.js";
import "./path-alias-guards-D5Is7hSS.js";
import { n as assertSandboxPath } from "./sandbox-paths-Bgdy3T5g.js";
import { n as toRelativeSandboxPath, t as resolvePathFromInput } from "./path-policy-B83zOsl0.js";
import { l as rewrapToolWithBeforeToolCallHook, u as wrapToolWithBeforeToolCallHook } from "./agent-tools.before-tool-call-rUQaaAPY.js";
import { B as withFileMutationQueues, D as createReadTool, H as hasOnlyCrlfLineEndings, U as normalizeToLF, V as decodeUtf8File, W as restoreLineEndings, z as withFileMutationQueue } from "./sessions-BHNzcBA2.js";
import { g as SANDBOX_AGENT_WORKSPACE_MOUNT } from "./constants-CZ9HY-fp.js";
import { S as isToolWrappedWithBeforeToolCallHook, d as copyAgentToolMetadata } from "./gateway-IvUFCG_L.js";
import { c as resolveReadOnlyWorkspaceSkillMounts } from "./workspace-mounts-CW0mGf0z.js";
import { t as applyExecPolicyLayer } from "./exec-policy-Dfxdv3TS.js";
import { n as mergeGatewayAgentCliPath } from "./openclaw-cli-shim-Dc7sNoEw.js";
import { t as wrapToolWithAbortSignal } from "./agent-tools.abort-DwMaME_s.js";
import { n as describeProcessTool, t as describeExecTool } from "./bash-tools.descriptions-ueSDULSM.js";
import { a as createSandboxedReadTool, f as withMemoryWriteProvenance, i as createSandboxedEditTool, l as wrapToolWorkspaceRootGuard, n as createHostWorkspaceWriteTool, o as createSandboxedWriteTool, r as createOpenClawReadTool, s as wrapReadToolWithSkillContent, t as createHostWorkspaceEditTool, u as wrapToolWorkspaceRootGuardWithOptions } from "./agent-tools.read-CHqaXxWI.js";
import { t as resolveExecCommandHighlighting } from "./exec-command-highlighting-CK8Z6Uxm.js";
import { i as resolveMergedSafeBinProfileFixtures } from "./exec-safe-bin-runtime-policy-DlryMXDl.js";
import { r as processSchema, t as execSchema } from "./bash-tools.schemas-401maNW8.js";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { Type } from "typebox";
import { normalizeToolParameterSchema } from "@openclaw/ai/internal/openai";
//#region src/agents/agent-tools.deferred-followup.ts
function replaceDescription(tool, description) {
	return copyAgentToolMetadata(tool, {
		...tool,
		description
	});
}
/** Return tools with exec/process descriptions adjusted for cron availability. */
function applyDeferredFollowupToolDescriptions(tools, params) {
	const hasCronTool = tools.some((tool) => isAutomationsToolName(tool.name));
	return tools.map((tool) => {
		if (tool.name === "exec") return replaceDescription(tool, describeExecTool({
			agentId: params?.agentId,
			hasCronTool
		}));
		if (tool.name === "process") return replaceDescription(tool, describeProcessTool({ hasCronTool }));
		return tool;
	});
}
//#endregion
//#region src/agents/agent-tools.schema.ts
/**
* Tool schema normalization wrappers.
* Applies provider-compatible parameter schema cleanup while preserving
* identity-backed metadata on normalized tools.
*/
function isObjectSchemaWithNoRequiredParams(schema) {
	if (!schema || typeof schema !== "object" || Array.isArray(schema)) return false;
	const record = schema;
	const type = record.type;
	if (!(type === "object" || Array.isArray(type) && type.some((entry) => entry === "object"))) return false;
	return !schemaHasRequiredParams(record);
}
function schemaHasRequiredParams(schema) {
	if (Array.isArray(schema.required) && schema.required.length > 0) return true;
	for (const key of [
		"allOf",
		"anyOf",
		"oneOf"
	]) {
		const variants = schema[key];
		if (!Array.isArray(variants)) continue;
		if (variants.some((variant) => variant !== null && typeof variant === "object" && !Array.isArray(variant) && schemaHasRequiredParams(variant))) return true;
	}
	return false;
}
function addEmptyObjectArgumentPreparation(tool, parameters) {
	if (!isObjectSchemaWithNoRequiredParams(parameters)) return tool;
	return {
		...tool,
		prepareArguments: (args) => {
			const prepared = tool.prepareArguments ? tool.prepareArguments(args) : args;
			return prepared === null || prepared === void 0 ? {} : prepared;
		}
	};
}
/** Normalize a tool's parameter schema for the selected provider/model. */
function normalizeToolParameters(tool, options) {
	const schema = tool.parameters && typeof tool.parameters === "object" ? tool.parameters : void 0;
	if (!schema) return tool;
	const parameters = normalizeToolParameterSchema(schema, options);
	return copyAgentToolMetadata(tool, {
		...tool,
		...addEmptyObjectArgumentPreparation(tool, parameters),
		parameters
	});
}
//#endregion
//#region src/agents/agent-tools.finalize.ts
/** Apply the shared schema, hook, abort, and description wrappers to an authorized tool set. */
function finalizeAgentTools(options) {
	const normalized = options.tools.map((tool) => normalizeToolParameters(tool, {
		modelProvider: options.modelProvider,
		modelId: options.modelId,
		modelCompat: options.modelCompat
	}));
	options.recordToolPrepStage?.("schema-normalization");
	const hookOptions = {
		emitDiagnostics: options.emitBeforeToolCallDiagnostics,
		...options.approvalMode ? { approvalMode: options.approvalMode } : {}
	};
	const withHooks = options.wrapBeforeToolCallHook === false ? normalized : normalized.map((tool) => isToolWrappedWithBeforeToolCallHook(tool) ? rewrapToolWithBeforeToolCallHook(tool, options.hookContext, hookOptions) : wrapToolWithBeforeToolCallHook(tool, options.hookContext, hookOptions));
	options.recordToolPrepStage?.("tool-hooks");
	const abortSignal = options.abortSignal;
	const withAbort = abortSignal ? withHooks.map((tool) => wrapToolWithAbortSignal(tool, abortSignal)) : withHooks;
	options.recordToolPrepStage?.("abort-wrappers");
	const finalized = applyDeferredFollowupToolDescriptions(withAbort, { agentId: options.agentId });
	options.recordToolPrepStage?.("deferred-followup-descriptions");
	return finalized;
}
//#endregion
//#region src/agents/apply-patch-model-policy.ts
function isApplyPatchAllowedForModel(params) {
	const allowModels = Array.isArray(params.allowModels) ? params.allowModels : [];
	if (allowModels.length === 0) return true;
	const modelId = params.modelId?.trim();
	if (!modelId) return false;
	const normalizedModelId = normalizeLowercaseStringOrEmpty(modelId);
	const provider = normalizeOptionalLowercaseString(params.modelProvider);
	const normalizedFull = provider && !normalizedModelId.includes("/") ? `${provider}/${normalizedModelId}` : normalizedModelId;
	return allowModels.some((entry) => {
		const normalized = normalizeOptionalLowercaseString(entry);
		return Boolean(normalized && (normalized === normalizedModelId || normalized === normalizedFull));
	});
}
//#endregion
//#region src/agents/apply-patch-file-ops.ts
async function createPatchTarget(params) {
	if (await params.ops.createFileExclusive(params.target.resolved, params.contents) === "exists") throw new Error(`Cannot create ${params.target.display}: the file already exists. ${params.hint}`);
}
function resolvePatchFileOps(options) {
	if (options.sandbox) {
		const { root, bridge } = options.sandbox;
		return withPatchMemoryWriteProvenance({
			observer: options.memoryWriteProvenance,
			operations: {
				readFile: async (filePath) => {
					return decodeUtf8File(await bridge.readFile({
						filePath,
						cwd: root
					}), filePath);
				},
				writeFile: (filePath, content) => bridge.writeFile({
					filePath,
					cwd: root,
					data: content
				}),
				createFileExclusive: (filePath, content) => {
					if (!bridge.createFileExclusive) throw new Error("Sandbox filesystem bridge does not support atomic file creation; refusing to overwrite an existing path.");
					return bridge.createFileExclusive({
						filePath,
						cwd: root,
						data: content
					});
				},
				remove: (filePath) => bridge.remove({
					filePath,
					cwd: root,
					force: false
				}),
				mkdirp: (dir) => bridge.mkdirp({
					filePath: dir,
					cwd: root
				})
			}
		});
	}
	if (options.workspaceOnly === false) return withPatchMemoryWriteProvenance({
		observer: options.memoryWriteProvenance,
		operations: {
			readFile: async (filePath) => decodeUtf8File(await fs$1.readFile(filePath), filePath),
			writeFile: async (filePath, content) => {
				await fs$1.writeFile(filePath, content, "utf8");
			},
			createFileExclusive: async (filePath, content) => {
				try {
					await fs$1.writeFile(filePath, content, {
						encoding: "utf8",
						flag: "wx"
					});
					return "created";
				} catch (error) {
					if (error.code === "EEXIST") return "exists";
					throw error;
				}
			},
			remove: (filePath) => fs$1.rm(filePath),
			mkdirp: async (dir) => {
				await fs$1.mkdir(dir, { recursive: true });
			}
		}
	});
	const rootPromise = root(options.cwd);
	const toCanonicalMutationRelative = async (filePath, pathOptions) => {
		const absolute = path.resolve(options.cwd, filePath);
		let canonicalAbsolute = absolute;
		try {
			const canonicalParent = await canonicalPathFromExistingAncestor(path.dirname(absolute));
			canonicalAbsolute = path.join(canonicalParent, path.basename(absolute));
		} catch {}
		return toRelativeSandboxPath(await fs$1.realpath(options.cwd).catch(() => options.cwd), canonicalAbsolute, pathOptions);
	};
	return withPatchMemoryWriteProvenance({
		observer: options.memoryWriteProvenance,
		operations: {
			readFile: async (filePath) => {
				const opened = await openRootFileFollowingParents({
					absolutePath: filePath,
					rootPath: options.cwd,
					boundaryLabel: "workspace root"
				});
				assertBoundaryRead(opened, filePath);
				try {
					return decodeUtf8File(fs.readFileSync(opened.fd), filePath);
				} finally {
					fs.closeSync(opened.fd);
				}
			},
			writeFile: async (filePath, content) => {
				const relative = await toCanonicalMutationRelative(filePath);
				await (await rootPromise).write(relative, content, { encoding: "utf8" });
			},
			createFileExclusive: async (filePath, content) => {
				const relative = await toCanonicalMutationRelative(filePath);
				try {
					await (await rootPromise).create(relative, content, { encoding: "utf8" });
					return "created";
				} catch (error) {
					if (error instanceof FsSafeError && (error.code === "already-exists" || error.code === "symlink")) return "exists";
					throw error;
				}
			},
			remove: async (filePath) => {
				const relative = await toCanonicalMutationRelative(filePath);
				await (await rootPromise).remove(relative);
			},
			mkdirp: async (dir) => {
				const relative = await toCanonicalMutationRelative(dir, { allowRoot: true });
				const root = await rootPromise;
				if (relative === "" || relative === ".") {
					await root.ensureRoot();
					return;
				}
				await root.mkdir(relative);
			}
		}
	});
}
var PatchCreateExistsSignal = class extends Error {};
function withPatchMemoryWriteProvenance(params) {
	const operations = withMemoryWriteProvenance(params.operations, params.observer);
	if (!params.observer) return operations;
	return {
		...operations,
		createFileExclusive: async (filePath, content) => {
			if (!params.observer?.classifies(filePath)) return params.operations.createFileExclusive(filePath, content);
			try {
				await params.observer.write({
					absolutePath: filePath,
					contentBefore: "",
					contentAfter: content,
					commit: async () => {
						if (await params.operations.createFileExclusive(filePath, content) === "exists") throw new PatchCreateExistsSignal();
					}
				});
				return "created";
			} catch (error) {
				if (error instanceof PatchCreateExistsSignal) return "exists";
				throw error;
			}
		}
	};
}
function assertBoundaryRead(opened, targetPath) {
	if (opened.ok) return;
	const reason = opened.reason === "validation" ? "unsafe path" : "path not found";
	const error = /* @__PURE__ */ new Error(`Failed boundary read for ${targetPath} (${reason})`);
	const sourceCode = opened.error && typeof opened.error === "object" && "code" in opened.error ? opened.error.code : void 0;
	if (sourceCode === "ENOENT" || sourceCode === "ENOTDIR") error.code = sourceCode;
	throw error;
}
//#endregion
//#region src/agents/apply-patch-update.ts
/**
* Update-hunk application for the apply_patch parser.
* Locates expected old lines with tolerant matching, applies chunks in order,
* and returns normalized file contents with a trailing newline.
*/
const DASH_PUNCTUATION = /[\u2010-\u2015\u2212]/g;
const SINGLE_QUOTE_PUNCTUATION = /[\u2018-\u201B]/g;
const DOUBLE_QUOTE_PUNCTUATION = /[\u201C-\u201F]/g;
const SPACE_PUNCTUATION = /[\u00A0\u2002-\u200A\u202F\u205F\u3000]/g;
async function defaultReadFile(filePath) {
	return fs$1.readFile(filePath, "utf8");
}
/** Apply parsed update chunks to one file and return the new file contents. */
async function applyUpdateHunk(filePath, chunks, options) {
	const originalContents = await (options?.readFile ?? defaultReadFile)(filePath).catch((err) => {
		throw new Error(`Failed to read file to update ${filePath}: ${formatErrorMessage(err)}`);
	});
	const preserveCrlf = hasOnlyCrlfLineEndings(originalContents);
	const originalLines = (preserveCrlf ? normalizeToLF(originalContents) : originalContents).split("\n");
	if (originalLines.length > 0 && originalLines[originalLines.length - 1] === "") originalLines.pop();
	let newLines = applyReplacements(originalLines, computeReplacements(originalLines, filePath, chunks));
	if (newLines.length === 0 || newLines[newLines.length - 1] !== "") newLines = [...newLines, ""];
	const updatedContents = newLines.join("\n");
	return preserveCrlf ? restoreLineEndings(updatedContents, "\r\n") : updatedContents;
}
function computeReplacements(originalLines, filePath, chunks) {
	const replacements = [];
	let lineIndex = 0;
	for (const chunk of chunks) {
		if (chunk.changeContext) {
			const ctxIndex = seekSequence(originalLines, [chunk.changeContext], lineIndex, false);
			if (ctxIndex === null) throw new Error(`Failed to find context '${chunk.changeContext}' in ${filePath}`);
			lineIndex = ctxIndex + 1;
		}
		if (chunk.oldLines.length === 0) {
			const insertionIndex = chunk.changeContext && !chunk.isEndOfFile ? lineIndex : originalLines.length > 0 && originalLines[originalLines.length - 1] === "" ? originalLines.length - 1 : originalLines.length;
			replacements.push([
				insertionIndex,
				0,
				chunk.newLines
			]);
			lineIndex = insertionIndex;
			continue;
		}
		let pattern = chunk.oldLines;
		let newSlice = chunk.newLines;
		let found = seekSequence(originalLines, pattern, lineIndex, chunk.isEndOfFile);
		if (found === null && pattern[pattern.length - 1] === "") {
			pattern = pattern.slice(0, -1);
			if (newSlice.length > 0 && newSlice[newSlice.length - 1] === "") newSlice = newSlice.slice(0, -1);
			found = seekSequence(originalLines, pattern, lineIndex, chunk.isEndOfFile);
		}
		if (found === null) throw new Error(`Failed to find expected lines in ${filePath}:\n${chunk.oldLines.join("\n")}`);
		replacements.push([
			found,
			pattern.length,
			keepContextBytes({
				originalLines,
				matchIndex: found,
				patternLength: pattern.length,
				newSlice,
				contextOldIndexes: chunk.contextOldIndexes
			})
		]);
		lineIndex = found + pattern.length;
	}
	replacements.sort((a, b) => a[0] - b[0]);
	return replacements;
}
function keepContextBytes(params) {
	const { originalLines, matchIndex, patternLength, newSlice, contextOldIndexes } = params;
	return newSlice.map((line, index) => {
		const oldIndex = contextOldIndexes.at(index);
		if (oldIndex === void 0 || oldIndex >= patternLength) return line;
		return originalLines.at(matchIndex + oldIndex) ?? line;
	});
}
function applyReplacements(lines, replacements) {
	const result = [...lines];
	for (const [startIndex, oldLen, newLines] of [...replacements].toReversed()) {
		for (let i = 0; i < oldLen; i += 1) if (startIndex < result.length) result.splice(startIndex, 1);
		for (const [i, line] of newLines.entries()) result.splice(startIndex + i, 0, line);
	}
	return result;
}
function seekSequence(lines, pattern, start, eof) {
	if (pattern.length === 0) return start;
	if (pattern.length > lines.length) return null;
	const maxStart = lines.length - pattern.length;
	const searchStart = eof && lines.length >= pattern.length ? maxStart : start;
	if (searchStart > maxStart) return null;
	const normalizers = [
		(value) => value,
		(value) => value.trimEnd(),
		(value) => value.trim(),
		(value) => normalizePunctuation(value.trim())
	];
	for (const normalize of normalizers) for (let i = searchStart; i <= maxStart; i += 1) if (linesMatch(lines, pattern, i, normalize)) return i;
	return null;
}
function linesMatch(lines, pattern, start, normalize) {
	for (let idx = 0; idx < pattern.length; idx += 1) {
		const line = lines.at(start + idx);
		const expected = pattern.at(idx);
		if (line === void 0 || expected === void 0 || normalize(line) !== normalize(expected)) return false;
	}
	return true;
}
function normalizePunctuation(value) {
	return value.replace(DASH_PUNCTUATION, "-").replace(SINGLE_QUOTE_PUNCTUATION, "'").replace(DOUBLE_QUOTE_PUNCTUATION, "\"").replace(SPACE_PUNCTUATION, " ");
}
//#endregion
//#region src/agents/apply-patch.ts
/**
* Runtime apply_patch tool and parser.
* Parses OpenAI-style patch envelopes and applies add/update/delete/move hunks
* through guarded host or sandbox filesystem operations.
*/
const BEGIN_PATCH_MARKER = "*** Begin Patch";
const END_PATCH_MARKER = "*** End Patch";
const ADD_FILE_MARKER = "*** Add File: ";
const DELETE_FILE_MARKER = "*** Delete File: ";
const UPDATE_FILE_MARKER = "*** Update File: ";
const MOVE_TO_MARKER = "*** Move to: ";
const EOF_MARKER = "*** End of File";
const CHANGE_CONTEXT_MARKER = "@@ ";
const EMPTY_CHANGE_CONTEXT_MARKER = "@@";
function normalizeUpdateComparison(content) {
	const normalized = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
	if (normalized.length === 0 || normalized.endsWith("\n")) return normalized;
	return `${normalized}\n`;
}
const applyPatchSchema = Type.Object({ input: Type.String({ description: "Patch content using the *** Begin Patch/End Patch format." }) });
const ApplyPatchToolOutputSchema = Type.Object({ summary: Type.Object({
	added: Type.Array(Type.String()),
	modified: Type.Array(Type.String()),
	deleted: Type.Array(Type.String())
}, { additionalProperties: false }) }, { additionalProperties: false });
/** Create the agent tool wrapper for applying patch-envelope input. */
function createApplyPatchTool(options = {}) {
	const cwd = options.cwd ?? process.cwd();
	const sandbox = options.sandbox;
	const workspaceOnly = options.workspaceOnly !== false;
	return {
		name: "apply_patch",
		label: "apply_patch",
		description: "Patch one/many files. Input requires *** Begin Patch and *** End Patch.",
		parameters: applyPatchSchema,
		outputSchema: ApplyPatchToolOutputSchema,
		execute: async (_toolCallId, args, signal) => {
			const params = args;
			const input = typeof params.input === "string" ? params.input : "";
			if (!input.trim()) throw new Error("Provide a patch input.");
			if (signal?.aborted) throw createAbortError("Aborted");
			const result = await applyPatch(input, {
				cwd,
				sandbox,
				workspaceOnly,
				memoryWriteProvenance: options.memoryWriteProvenance,
				signal
			});
			return {
				content: [{
					type: "text",
					text: result.text
				}],
				details: { summary: result.summary },
				...result.noOp ? { terminate: true } : {}
			};
		}
	};
}
/** Parse and apply a patch envelope to the configured filesystem target. */
async function applyPatch(input, options) {
	const parsed = parsePatchText(input);
	if (parsed.hunks.length === 0) throw new Error("No files were modified.");
	const summary = {
		added: [],
		modified: [],
		deleted: []
	};
	const seen = {
		added: /* @__PURE__ */ new Set(),
		modified: /* @__PURE__ */ new Set(),
		deleted: /* @__PURE__ */ new Set()
	};
	const noOpPaths = /* @__PURE__ */ new Set();
	const fileOps = resolvePatchFileOps(options);
	for (const hunk of parsed.hunks) {
		if (options.signal?.aborted) throw createAbortError("Aborted");
		if (hunk.kind === "add") {
			const target = await resolvePatchPath(hunk.path, options);
			await withFileMutationQueue(target.resolved, async () => {
				await assertPatchParentPath(hunk.path, options);
				await ensureDir(target.resolved, fileOps);
				await createPatchTarget({
					target,
					contents: hunk.contents,
					ops: fileOps,
					hint: `Use "*** Update File: ${target.display}" to change it, or delete it earlier in the same patch.`
				});
			});
			recordSummary(summary, seen, "added", target.display);
			continue;
		}
		if (hunk.kind === "delete") {
			const target = await resolvePatchPath(hunk.path, options, PATH_ALIAS_POLICIES.unlinkTarget);
			await withFileMutationQueue(target.resolved, () => fileOps.remove(target.resolved));
			recordSummary(summary, seen, "deleted", target.display);
			continue;
		}
		const target = await resolvePatchPath(hunk.path, options);
		const moveTarget = hunk.movePath ? await resolvePatchPath(hunk.movePath, options) : void 0;
		await withFileMutationQueues([target.resolved, ...moveTarget ? [moveTarget.resolved] : []], async () => {
			const applied = await applyUpdateHunk(target.resolved, hunk.chunks, { readFile: (pathLocal) => fileOps.readFile(pathLocal) });
			if (hunk.movePath && moveTarget) {
				await assertPatchParentPath(hunk.movePath, options);
				await ensureDir(moveTarget.resolved, fileOps);
				const moveResolvesToSource = path.resolve(moveTarget.resolved) === path.resolve(target.resolved);
				if (moveResolvesToSource) if (normalizeUpdateComparison(await fileOps.readFile(target.resolved)) === normalizeUpdateComparison(applied)) noOpPaths.add(target.display);
				else {
					noOpPaths.delete(target.display);
					await fileOps.writeFile(target.resolved, applied);
				}
				else {
					noOpPaths.delete(target.display);
					await createPatchTarget({
						target: moveTarget,
						contents: applied,
						ops: fileOps,
						hint: "Delete it earlier in the same patch to replace it."
					});
					await fileOps.remove(target.resolved);
				}
				if (!noOpPaths.has(target.display)) recordSummary(summary, seen, "modified", moveResolvesToSource ? target.display : moveTarget.display);
				return;
			}
			if (normalizeUpdateComparison(await fileOps.readFile(target.resolved)) === normalizeUpdateComparison(applied)) noOpPaths.add(target.display);
			else {
				noOpPaths.delete(target.display);
				await fileOps.writeFile(target.resolved, applied);
				recordSummary(summary, seen, "modified", target.display);
			}
		});
	}
	const noOp = noOpPaths.size > 0 && Object.values(summary).every((paths) => paths.length === 0);
	return {
		summary,
		text: noOp ? `No changes made to ${Array.from(noOpPaths).join(", ")}.` : formatSummary(summary),
		...noOp ? { noOp: true } : {}
	};
}
function recordSummary(summary, seen, bucket, value) {
	if (seen[bucket].has(value)) return;
	seen[bucket].add(value);
	summary[bucket].push(value);
}
function formatSummary(summary) {
	const lines = ["Success. Updated the following files:"];
	for (const file of summary.added) lines.push(`A ${file}`);
	for (const file of summary.modified) lines.push(`M ${file}`);
	for (const file of summary.deleted) lines.push(`D ${file}`);
	return lines.join("\n");
}
async function ensureDir(filePath, ops) {
	const parent = path.dirname(filePath);
	if (!parent || parent === ".") return;
	await ops.mkdirp(parent);
}
async function assertPatchParentPath(filePath, options) {
	if (options.workspaceOnly === false || options.sandbox) return;
	const parent = path.dirname(filePath);
	if (!parent || parent === ".") return;
	await assertSandboxPath({
		filePath: parent,
		cwd: options.cwd,
		root: options.cwd
	});
	await assertNoExistingParentAliases({
		parentPath: resolvePathFromInput(parent, options.cwd),
		rootPath: options.cwd
	});
}
async function assertNoExistingParentAliases(params) {
	const rootPath = path.resolve(params.rootPath);
	const parentPath = path.resolve(params.parentPath);
	const relative = path.relative(rootPath, parentPath);
	if (!relative || relative === "" || relativePathEscapesRoot(relative)) return;
	let current = rootPath;
	for (const segment of relative.split(path.sep)) {
		if (!segment) continue;
		current = path.join(current, segment);
		const stat = await fs$1.lstat(current).catch((error) => {
			if (error.code === "ENOENT") return null;
			throw error;
		});
		if (!stat) return;
		if (stat.isSymbolicLink()) throw new Error(`Path alias under sandbox root: ${path.relative(rootPath, current)}`);
	}
}
async function resolvePatchPath(filePath, options, aliasPolicy = PATH_ALIAS_POLICIES.strict) {
	if (options.sandbox) {
		const resolved = options.sandbox.bridge.resolvePath({
			filePath,
			cwd: options.cwd
		});
		if (options.workspaceOnly !== false && resolved.hostPath) await assertSandboxPath({
			filePath: resolved.hostPath,
			cwd: options.cwd,
			root: options.cwd,
			allowFinalSymlinkForUnlink: aliasPolicy.allowFinalSymlinkForUnlink,
			allowFinalHardlinkForUnlink: aliasPolicy.allowFinalHardlinkForUnlink
		});
		return {
			resolved: resolved.hostPath ?? resolved.containerPath,
			display: resolved.relativePath || resolved.containerPath
		};
	}
	const resolved = options.workspaceOnly !== false ? (await assertSandboxPath({
		filePath,
		cwd: options.cwd,
		root: options.cwd,
		allowFinalSymlinkForUnlink: aliasPolicy.allowFinalSymlinkForUnlink,
		allowFinalHardlinkForUnlink: aliasPolicy.allowFinalHardlinkForUnlink
	})).resolved : resolvePathFromInput(filePath, options.cwd);
	return {
		resolved,
		display: toDisplayPath(resolved, options.cwd)
	};
}
function toDisplayPath(resolved, cwd) {
	const relative = path.relative(cwd, resolved);
	if (!relative || relative === "") return path.basename(resolved);
	if (relativePathEscapesRoot(relative)) return resolved;
	return relative;
}
function relativePathEscapesRoot(relativePath) {
	return relativePath === ".." || relativePath.startsWith("../") || relativePath.startsWith("..\\") || path.isAbsolute(relativePath);
}
function parsePatchText(input) {
	const trimmed = input.trim();
	if (!trimmed) throw new Error("Invalid patch: input is empty.");
	const validated = checkPatchBoundariesLenient(trimmed.split(/\r?\n/));
	const hunks = [];
	const lastLineIndex = validated.length - 1;
	let remaining = validated.slice(1, lastLineIndex);
	let lineNumber = 2;
	while (remaining.length > 0) {
		const { hunk, consumed } = parseOneHunk(remaining, lineNumber);
		hunks.push(hunk);
		lineNumber += consumed;
		remaining = remaining.slice(consumed);
	}
	return {
		hunks,
		patch: validated.join("\n")
	};
}
function checkPatchBoundariesLenient(lines) {
	const strictError = checkPatchBoundariesStrict(lines);
	if (!strictError) return lines;
	if (lines.length < 4) throw new Error(strictError);
	const first = lines[0];
	const last = lines.at(-1);
	if (last && (first === "<<EOF" || first === "<<'EOF'" || first === "<<\"EOF\"") && last.endsWith("EOF")) {
		const inner = lines.slice(1, -1);
		const innerError = checkPatchBoundariesStrict(inner);
		if (!innerError) return inner;
		throw new Error(innerError);
	}
	throw new Error(strictError);
}
function checkPatchBoundariesStrict(lines) {
	const firstLine = lines[0]?.trim();
	const lastLine = lines[lines.length - 1]?.trim();
	if (firstLine === BEGIN_PATCH_MARKER && lastLine === END_PATCH_MARKER) return null;
	if (firstLine !== BEGIN_PATCH_MARKER) return "The first line of the patch must be '*** Begin Patch'";
	return "The last line of the patch must be '*** End Patch'";
}
function parseOneHunk(lines, lineNumber) {
	if (lines.length === 0) throw new Error(`Invalid patch hunk at line ${lineNumber}: empty hunk`);
	const firstLine = lines.at(0)?.trim();
	if (firstLine === void 0) throw new Error(`Invalid patch hunk at line ${lineNumber}: empty hunk`);
	if (firstLine.startsWith(ADD_FILE_MARKER)) {
		const targetPath = firstLine.slice(14);
		let contents = "";
		let consumed = 1;
		for (const addLine of lines.slice(1)) if (addLine.startsWith("+")) {
			contents += `${addLine.slice(1)}\n`;
			consumed += 1;
		} else break;
		return {
			hunk: {
				kind: "add",
				path: targetPath,
				contents
			},
			consumed
		};
	}
	if (firstLine.startsWith(DELETE_FILE_MARKER)) return {
		hunk: {
			kind: "delete",
			path: firstLine.slice(17)
		},
		consumed: 1
	};
	if (firstLine.startsWith(UPDATE_FILE_MARKER)) {
		const targetPath = firstLine.slice(17);
		let remaining = lines.slice(1);
		let consumed = 1;
		let movePath;
		const moveCandidate = remaining[0]?.trim();
		if (moveCandidate?.startsWith(MOVE_TO_MARKER)) {
			movePath = moveCandidate.slice(13);
			remaining = remaining.slice(1);
			consumed += 1;
		}
		const chunks = [];
		while (remaining.length > 0) {
			const firstRemaining = remaining.at(0);
			if (firstRemaining === void 0) break;
			if (firstRemaining.trim() === "") {
				remaining = remaining.slice(1);
				consumed += 1;
				continue;
			}
			if (firstRemaining.startsWith("***")) break;
			const { chunk, consumed: chunkLines } = parseUpdateFileChunk(remaining, lineNumber + consumed, chunks.length === 0);
			chunks.push(chunk);
			remaining = remaining.slice(chunkLines);
			consumed += chunkLines;
		}
		if (chunks.length === 0) throw new Error(`Invalid patch hunk at line ${lineNumber}: Update file hunk for path '${targetPath}' is empty`);
		return {
			hunk: {
				kind: "update",
				path: targetPath,
				movePath,
				chunks
			},
			consumed
		};
	}
	throw new Error(`Invalid patch hunk at line ${lineNumber}: '${lines[0]}' is not a valid hunk header. Valid hunk headers: '*** Add File: {path}', '*** Delete File: {path}', '*** Update File: {path}'`);
}
function parseUpdateFileChunk(lines, lineNumber, allowMissingContext) {
	if (lines.length === 0) throw new Error(`Invalid patch hunk at line ${lineNumber}: Update hunk does not contain any lines`);
	let changeContext;
	let startIndex = 0;
	const firstLine = lines.at(0);
	if (firstLine === EMPTY_CHANGE_CONTEXT_MARKER) startIndex = 1;
	else if (firstLine?.startsWith(CHANGE_CONTEXT_MARKER)) {
		changeContext = firstLine.slice(3);
		startIndex = 1;
	} else if (!allowMissingContext) throw new Error(`Invalid patch hunk at line ${lineNumber}: Expected update hunk to start with a @@ context marker, got: '${firstLine}'`);
	if (startIndex >= lines.length) throw new Error(`Invalid patch hunk at line ${lineNumber + 1}: Update hunk does not contain any lines`);
	const chunk = {
		changeContext,
		oldLines: [],
		newLines: [],
		contextOldIndexes: [],
		isEndOfFile: false
	};
	let parsedLines = 0;
	for (const line of lines.slice(startIndex)) {
		if (line === EOF_MARKER) {
			if (parsedLines === 0) throw new Error(`Invalid patch hunk at line ${lineNumber + 1}: Update hunk does not contain any lines`);
			chunk.isEndOfFile = true;
			parsedLines += 1;
			break;
		}
		const marker = line[0];
		if (!marker) {
			chunk.contextOldIndexes.push(chunk.oldLines.length);
			chunk.oldLines.push("");
			chunk.newLines.push("");
			parsedLines += 1;
			continue;
		}
		if (marker === " ") {
			const content = line.slice(1);
			chunk.contextOldIndexes.push(chunk.oldLines.length);
			chunk.oldLines.push(content);
			chunk.newLines.push(content);
			parsedLines += 1;
			continue;
		}
		if (marker === "+") {
			chunk.contextOldIndexes.push(void 0);
			chunk.newLines.push(line.slice(1));
			parsedLines += 1;
			continue;
		}
		if (marker === "-") {
			chunk.oldLines.push(line.slice(1));
			parsedLines += 1;
			continue;
		}
		if (parsedLines === 0) throw new Error(`Invalid patch hunk at line ${lineNumber + 1}: Unexpected line found in update hunk: '${line}'. Every line should start with ' ' (context line), '+' (added line), or '-' (removed line)`);
		break;
	}
	return {
		chunk,
		consumed: parsedLines + startIndex
	};
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.applyPatchTestApi")] = { applyPatch };
//#endregion
//#region src/agents/lazy-exec-tool.ts
const bashToolsModuleLoader$1 = createLazyImportLoader(() => import("./bash-tools-xIZCS4bo.js"));
/** Build the exec tool lazily so non-shell agent surfaces avoid loading bash runtime code. */
function createLazyExecTool(defaults, presentation) {
	let loadedTool;
	let loadingTool;
	const loadTool = () => {
		if (loadedTool) return Promise.resolve(loadedTool);
		loadingTool ??= bashToolsModuleLoader$1.load().then(({ createExecTool }) => {
			loadedTool = createExecTool(defaults);
			return loadedTool;
		});
		return loadingTool;
	};
	return {
		name: "exec",
		label: "exec",
		displaySummary: presentation?.displaySummary ?? "Run shell now.",
		get description() {
			return presentation?.description ?? describeExecTool({
				agentId: defaults?.agentId,
				hasCronTool: defaults?.hasCronTool === true
			});
		},
		parameters: presentation?.parameters ?? execSchema,
		prepareBeforeToolCallParams: async (...args) => (await loadTool()).prepareBeforeToolCallParams?.(...args) ?? args[0],
		finalizeBeforeToolCallParams: (params, preparedParams) => loadedTool?.finalizeBeforeToolCallParams?.(params, preparedParams) ?? params,
		execute: async (...args) => (await loadTool()).execute(...args)
	};
}
/** Resolve global and per-agent exec defaults before runtime-only overrides. */
function resolveExecToolConfig(params) {
	const cfg = params.cfg;
	const globalExec = cfg?.tools?.exec;
	const agentExec = cfg && params.agentId ? resolveAgentConfig(cfg, params.agentId)?.tools?.exec : void 0;
	const layeredPolicy = applyExecPolicyLayer(applyExecPolicyLayer({}, globalExec), agentExec);
	return {
		host: agentExec?.host ?? globalExec?.host,
		mode: layeredPolicy.mode,
		security: layeredPolicy.security,
		ask: layeredPolicy.ask,
		node: agentExec?.node ?? globalExec?.node,
		pathPrepend: mergeGatewayAgentCliPath(agentExec?.pathPrepend ?? globalExec?.pathPrepend),
		safeBins: agentExec?.safeBins ?? globalExec?.safeBins,
		strictInlineEval: agentExec?.strictInlineEval ?? globalExec?.strictInlineEval,
		commandHighlighting: resolveExecCommandHighlighting({
			config: cfg,
			agentId: params.agentId
		}),
		safeBinTrustedDirs: agentExec?.safeBinTrustedDirs ?? globalExec?.safeBinTrustedDirs,
		safeBinProfiles: resolveMergedSafeBinProfileFixtures({
			global: globalExec,
			local: agentExec
		}),
		reviewer: agentExec?.reviewer ?? globalExec?.reviewer,
		backgroundMs: agentExec?.backgroundMs ?? globalExec?.backgroundMs,
		timeoutSec: agentExec?.timeoutSeconds ?? globalExec?.timeoutSeconds,
		approvalRunningNoticeMs: agentExec?.approvalRunningNoticeMs ?? globalExec?.approvalRunningNoticeMs,
		cleanupMs: agentExec?.cleanupMs ?? globalExec?.cleanupMs,
		notifyOnExit: agentExec?.notifyOnExit ?? globalExec?.notifyOnExit,
		notifyOnExitEmptySuccess: agentExec?.notifyOnExitEmptySuccess ?? globalExec?.notifyOnExitEmptySuccess,
		applyPatch: agentExec?.applyPatch ?? globalExec?.applyPatch
	};
}
//#endregion
//#region src/agents/lazy-process-tool.ts
const bashToolsModuleLoader = createLazyImportLoader(() => import("./bash-tools-xIZCS4bo.js"));
/** Build process lazily so tool discovery does not load the shell runtime. */
function createLazyProcessTool(defaults) {
	let loadedTool;
	const loadTool = async () => {
		if (!loadedTool) {
			const { createProcessTool } = await bashToolsModuleLoader.load();
			loadedTool = createProcessTool(defaults);
		}
		return loadedTool;
	};
	return {
		name: "process",
		label: "process",
		displaySummary: PROCESS_TOOL_DISPLAY_SUMMARY,
		description: describeProcessTool({ hasCronTool: defaults?.hasCronTool === true }),
		parameters: processSchema,
		execute: async (...args) => (await loadTool()).execute(...args)
	};
}
//#endregion
//#region src/agents/core-coding-tools.ts
function readOnlySandboxReadMounts(sandbox, readOnlyWorkspaceSkillMounts) {
	const mounts = [];
	if (sandbox.workspaceAccess === "ro" && sandbox.agentWorkspaceDir !== sandbox.workspaceDir) mounts.push({
		containerRoot: SANDBOX_AGENT_WORKSPACE_MOUNT,
		hostRoot: sandbox.agentWorkspaceDir
	});
	if (sandbox.workspaceAccess === "rw") mounts.push(...readOnlyWorkspaceSkillMounts.map((mount) => ({
		containerRoot: mount.containerPath,
		hostRoot: mount.hostPath
	})));
	return mounts.length > 0 ? mounts : void 0;
}
function resolveSkillReadRoots(skillsSnapshot) {
	const roots = /* @__PURE__ */ new Set();
	for (const skill of skillsSnapshot?.resolvedSkills ?? []) {
		const baseDir = typeof skill.baseDir === "string" ? skill.baseDir.trim() : "";
		const filePath = typeof skill.filePath === "string" ? skill.filePath.trim() : "";
		const root = baseDir || (filePath ? path.dirname(filePath) : "");
		if (!root || !path.isAbsolute(root)) continue;
		roots.add(path.resolve(root));
	}
	return roots.size > 0 ? Array.from(roots) : void 0;
}
/** Materialize only the core file and shell families selected by the runtime owner. */
function createCoreCodingTools(options) {
	const sandbox = options.sandbox;
	const sandboxRoot = sandbox?.workspaceDir;
	const sandboxFsBridge = sandbox?.fsBridge;
	const allowWorkspaceWrites = sandbox?.workspaceAccess !== "ro";
	if (sandboxRoot && !sandboxFsBridge) throw new Error("Sandbox filesystem bridge is unavailable.");
	const skillReadRoots = sandboxRoot ? void 0 : resolveSkillReadRoots(options.skillsSnapshot);
	const needsReadOnlyWorkspaceSkillMounts = options.includeShellTools || options.includeBaseCodingTools && options.workspaceOnly;
	const readOnlyWorkspaceSkillMounts = sandbox && needsReadOnlyWorkspaceSkillMounts ? resolveReadOnlyWorkspaceSkillMounts({
		workspaceDir: sandbox.workspaceDir,
		agentWorkspaceDir: sandbox.agentWorkspaceDir,
		skillsWorkspaceDir: sandbox.skillsWorkspaceDir,
		workdir: sandbox.containerWorkdir,
		workspaceAccess: sandbox.workspaceAccess
	}) : [];
	const base = [];
	if (options.includeBaseCodingTools) {
		const baseToolNames = new Set(options.baseToolNames ?? [
			"read",
			"edit",
			"write"
		]);
		if (baseToolNames.has("read")) {
			const wrapped = sandboxRoot ? createSandboxedReadTool({
				root: sandboxRoot,
				bridge: sandboxFsBridge,
				modelContextWindowTokens: options.modelContextWindowTokens,
				imageSanitization: options.imageSanitization,
				createTool: options.baseToolFactories?.createReadTool
			}) : createOpenClawReadTool(options.baseToolFactories?.createReadTool(options.codingRoot) ?? createReadTool(options.codingRoot), {
				modelContextWindowTokens: options.modelContextWindowTokens,
				imageSanitization: options.imageSanitization
			});
			const guarded = options.workspaceOnly ? wrapToolWorkspaceRootGuardWithOptions(wrapped, sandboxRoot ?? options.codingRoot, sandboxRoot ? {
				additionalContainerMounts: readOnlySandboxReadMounts(sandbox, readOnlyWorkspaceSkillMounts),
				containerWorkdir: sandbox.containerWorkdir
			} : { additionalRoots: skillReadRoots }) : wrapped;
			base.push(wrapReadToolWithSkillContent(guarded, options.skillsSnapshot?.resolvedSkills, {
				modelContextWindowTokens: options.modelContextWindowTokens,
				imageSanitization: options.imageSanitization
			}));
		}
		if (!sandboxRoot && baseToolNames.has("edit")) {
			const edit = createHostWorkspaceEditTool(options.codingRoot, {
				workspaceOnly: options.workspaceOnly,
				memoryWriteProvenance: options.memoryWriteProvenance,
				createTool: options.baseToolFactories?.createEditTool
			});
			base.push(options.workspaceOnly ? wrapToolWorkspaceRootGuard(edit, options.codingRoot) : edit);
		}
		if (!sandboxRoot && baseToolNames.has("write")) {
			const write = createHostWorkspaceWriteTool(options.codingRoot, {
				workspaceOnly: options.workspaceOnly,
				memoryWriteProvenance: options.memoryWriteProvenance,
				createTool: options.baseToolFactories?.createWriteTool
			});
			base.push(options.workspaceOnly ? wrapToolWorkspaceRootGuard(write, options.codingRoot) : write);
		}
	}
	if (options.includeBaseCodingTools && sandboxRoot && allowWorkspaceWrites) {
		const toolOptions = {
			root: sandboxRoot,
			bridge: sandboxFsBridge,
			memoryWriteProvenance: options.memoryWriteProvenance
		};
		const edit = createSandboxedEditTool({
			...toolOptions,
			createTool: options.baseToolFactories?.createEditTool
		});
		const write = createSandboxedWriteTool({
			...toolOptions,
			createTool: options.baseToolFactories?.createWriteTool
		});
		base.push(options.workspaceOnly ? wrapToolWorkspaceRootGuardWithOptions(edit, sandboxRoot, { containerWorkdir: sandbox.containerWorkdir }) : edit, options.workspaceOnly ? wrapToolWorkspaceRootGuardWithOptions(write, sandboxRoot, { containerWorkdir: sandbox.containerWorkdir }) : write);
	}
	options.recordToolPrepStage?.("base-coding-tools");
	const shell = [];
	if (options.includeShellTools) {
		if (options.applyPatchEnabled && (!sandboxRoot || allowWorkspaceWrites)) shell.push(createApplyPatchTool({
			cwd: options.codingRoot,
			sandbox: sandboxRoot && allowWorkspaceWrites ? {
				root: sandboxRoot,
				bridge: sandboxFsBridge
			} : void 0,
			workspaceOnly: options.applyPatchWorkspaceOnly,
			memoryWriteProvenance: options.memoryWriteProvenance
		}));
		shell.push(createLazyExecTool({
			...options.execDefaults,
			cwd: options.codingRoot,
			sandbox: sandbox ? {
				containerName: sandbox.containerName,
				workspaceDir: sandbox.workspaceDir,
				containerWorkdir: sandbox.containerWorkdir,
				workdirValidation: sandbox.backend?.workdirValidation,
				validateWorkdir: sandbox.backend?.validateWorkdir?.bind(sandbox.backend),
				discardPreparedWorkdir: sandbox.backend?.discardPreparedWorkdir?.bind(sandbox.backend),
				workdirRoots: sandbox.backend?.workdirRoots,
				readOnlyWorkspaceSkillMounts,
				env: sandbox.backend?.env ?? sandbox.docker.env,
				buildExecSpec: sandbox.backend?.buildExecSpec.bind(sandbox.backend),
				finalizeExec: sandbox.backend?.finalizeExec?.bind(sandbox.backend)
			} : void 0
		}), createLazyProcessTool(options.processDefaults));
	}
	options.recordToolPrepStage?.("shell-tools");
	return [...base, ...shell];
}
//#endregion
export { finalizeAgentTools as a, isApplyPatchAllowedForModel as i, createLazyExecTool as n, resolveExecToolConfig as r, createCoreCodingTools as t };
