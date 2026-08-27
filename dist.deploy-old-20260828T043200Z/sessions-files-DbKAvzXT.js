import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { i as asOptionalObjectRecord } from "./record-coerce-DItp3I4t.js";
import { t as pruneMapToMaxSize } from "./map-size-DAGm21RM.js";
import { t as FsSafeError } from "./errors-CQDiIdj7.js";
import { a as isPathInside } from "./path-D138yf8v.js";
import "./fs-safe-CmrQUApq.js";
import "./path-guards-CQoZeoCG.js";
import "./agent-scope-DigoIwHb.js";
import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
import { f as resolveAgentWorkspaceDir } from "./agent-scope-config-CUBiGmG3.js";
import { c as parseAgentSessionKey } from "./session-key-utils-Di3FvABa.js";
import { t as ErrorCodes } from "./gateway-error-details-C2IaYyht.js";
import { Br as validateSessionsFilesListParams, Hr as validateSessionsFilesSetParams, Vr as validateSessionsFilesRevealParams, wb as isCloudWorkerPlacementState, zr as validateSessionsFilesGetParams } from "./src-4dv5TpeQ.js";
import { f as readSessionTranscriptVisibleMessageDeltaCore } from "./session-accessor-B-FKZX9M.js";
import { n as detectMime } from "./mime-Hm4eS2i0.js";
import { d as errorShape } from "./validation-errors-rELRlKfn.js";
import { r as resolveToCwd } from "./path-utils-B1jqPblH.js";
import { d as sqliteMessageEventWithSeq, f as toTranscriptReadScope, u as resolveTranscriptReadTarget } from "./session-transcript-readers-CgCxlOAj.js";
import { a as insideGitCheckout } from "./git-CsWoUZAt.js";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-C9E8iDY4.js";
import { i as loadGatewaySessionEntryReadOnly } from "./session-utils-store-DtQnSTMm.js";
import "./session-utils-BTR52tOf.js";
import { t as assertValidParams } from "./validation-kYFXohur.js";
import { a as openWorkspaceRoot, c as resolveWorkspacePath, d as statWorkspacePath, f as toUpdatedAtMs, i as normalizeRelativePath, l as sortDirents, m as workspaceStatKind, n as decodeUtf8Strict, o as readWorkspaceFile, p as updateWorkspaceFile, r as listWorkspacePath, s as readWorkspaceFilePrefix, t as WORKSPACE_PREVIEW_MAX_BYTES, u as sortWorkspaceEntries } from "./workspace-fs-B3ZndQc6.js";
import { a as sanitizePathForLog, i as resolveOpenPathCommand, n as formatOpenPathError, r as isHeadlessOpenPathError, t as execOpenPath } from "./open-path-BTHbDD17.js";
import path from "node:path";
import { createHash } from "node:crypto";
//#region src/gateway/server-methods/sessions-files.ts
const MAX_PREVIEW_BYTES = WORKSPACE_PREVIEW_MAX_BYTES;
const MAX_BROWSER_ENTRIES = 250;
const MAX_SEARCH_ENTRIES = 500;
const MAX_SEARCH_VISITED_ENTRIES = 5e3;
const TOUCHED_FILES_CACHE_LIMIT = 256;
const TOUCHED_FILES_DELTA_MAX_MESSAGES = 1e3;
const TOUCHED_FILES_DELTA_MAX_BYTES = 1e6;
const MIME_SNIFF_PREFIX_BYTES = 4100;
const BROWSER_PREVIEW_IMAGE_MIME_TYPES = /* @__PURE__ */ new Set([
	"image/avif",
	"image/gif",
	"image/jpeg",
	"image/png",
	"image/webp"
]);
const DETECTED_TEXT_MIME_TYPES = /* @__PURE__ */ new Set([
	"application/rtf",
	"application/xml",
	"application/x-ms-regedit",
	"model/stl"
]);
const SEARCH_SKIP_DIRS = /* @__PURE__ */ new Set([
	".git",
	".hg",
	".next",
	".turbo",
	".yarn",
	"coverage",
	"dist",
	"node_modules"
]);
const touchedFilesCache = /* @__PURE__ */ new Map();
const touchedFilesFolds = /* @__PURE__ */ new Map();
function readTouchedFilesCache(key) {
	const cached = touchedFilesCache.get(key);
	if (cached) {
		touchedFilesCache.delete(key);
		touchedFilesCache.set(key, cached);
	}
	return cached;
}
function writeTouchedFilesCache(key, entry) {
	touchedFilesCache.delete(key);
	touchedFilesCache.set(key, entry);
	pruneMapToMaxSize(touchedFilesCache, TOUCHED_FILES_CACHE_LIMIT);
}
function sessionFilesError(type, message, details) {
	return errorShape(ErrorCodes.INVALID_REQUEST, message, { details: {
		type,
		...details
	} });
}
function readPathArg(args) {
	return normalizeOptionalString(args.path) ?? normalizeOptionalString(args.file_path) ?? normalizeOptionalString(args.filePath) ?? normalizeOptionalString(args.file);
}
function addTouchedFile(files, filePath, kind) {
	if (!filePath) return;
	const existing = files.get(filePath);
	if (existing?.kind === "modified" || existing && kind === "read") return;
	files.set(filePath, {
		path: filePath,
		kind
	});
}
function addRawPatchFiles(files, input) {
	if (typeof input !== "string") return;
	for (const match of input.matchAll(/^\*\*\* (?:Add|Update|Delete) File: (.+)$/gm)) addTouchedFile(files, match[1]?.trim(), "modified");
	for (const match of input.matchAll(/^\*\*\* Move to: (.+)$/gm)) addTouchedFile(files, match[1]?.trim(), "modified");
}
function addStructuredPatchFiles(files, changes) {
	if (!Array.isArray(changes)) return;
	for (const changeValue of changes) {
		const change = asOptionalObjectRecord(changeValue);
		addTouchedFile(files, normalizeOptionalString(change?.path), "modified");
		const kind = asOptionalObjectRecord(change?.kind);
		addTouchedFile(files, normalizeOptionalString(kind?.move_path) ?? normalizeOptionalString(kind?.movePath), "modified");
	}
}
function addPatchFiles(files, args) {
	addRawPatchFiles(files, args.input);
	addStructuredPatchFiles(files, args.changes);
}
function isToolCallBlockType(value) {
	if (typeof value !== "string") return false;
	const normalized = value.toLowerCase().replace(/[_-]/g, "");
	return normalized === "toolcall" || normalized === "tooluse";
}
function collectTouchedFilesFromMessage(message, files) {
	const record = asOptionalObjectRecord(message);
	if (record?.role !== "assistant" || !Array.isArray(record.content)) return;
	for (const blockValue of record.content) {
		const block = asOptionalObjectRecord(blockValue);
		if (!block || !isToolCallBlockType(block.type)) continue;
		const toolName = normalizeOptionalString(block.name)?.toLowerCase();
		const args = asOptionalObjectRecord(block.arguments) ?? asOptionalObjectRecord(block.input) ?? asOptionalObjectRecord(block.args);
		if (!toolName || !args) continue;
		if (toolName === "read") addTouchedFile(files, readPathArg(args), "read");
		else if (toolName === "write" || toolName === "edit") addTouchedFile(files, readPathArg(args), "modified");
		else if (toolName === "apply_patch") addPatchFiles(files, args);
	}
}
async function foldSqliteTouchedFiles(scope, cacheKey) {
	let cached = readTouchedFilesCache(cacheKey);
	let cursor = cached?.cursor;
	let files = cached?.files ?? /* @__PURE__ */ new Map();
	let maxBytes = TOUCHED_FILES_DELTA_MAX_BYTES;
	while (true) {
		const delta = readSessionTranscriptVisibleMessageDeltaCore(scope, {
			...cursor ? { cursor } : {},
			maxBytes,
			maxMessages: TOUCHED_FILES_DELTA_MAX_MESSAGES
		});
		if (delta.kind === "missing") {
			touchedFilesCache.delete(cacheKey);
			return /* @__PURE__ */ new Map();
		}
		if (delta.kind === "reset") {
			cached = {
				cursor: delta.cursor,
				files: /* @__PURE__ */ new Map()
			};
			cursor = cached.cursor;
			files = cached.files;
			writeTouchedFilesCache(cacheKey, cached);
			continue;
		}
		for (const event of delta.events) {
			const message = sqliteMessageEventWithSeq(event);
			if (message !== void 0) collectTouchedFilesFromMessage(message, files);
		}
		cached = {
			cursor: delta.cursor,
			files
		};
		cursor = cached.cursor;
		writeTouchedFilesCache(cacheKey, cached);
		if (!delta.hasMore) return files;
		if (delta.requiredBytes !== void 0) maxBytes = delta.requiredBytes;
		await new Promise((resolve) => {
			setImmediate(resolve);
		});
	}
}
async function loadSqliteTouchedFiles(scope, cacheKey) {
	const inFlight = touchedFilesFolds.get(cacheKey);
	if (inFlight) return inFlight;
	const fold = foldSqliteTouchedFiles(scope, cacheKey);
	touchedFilesFolds.set(cacheKey, fold);
	try {
		return await fold;
	} finally {
		touchedFilesFolds.delete(cacheKey);
	}
}
function toDisplayPath(root, resolved) {
	const relative = path.relative(root, resolved);
	if (!relative) return "";
	return relative.split(path.sep).join("/");
}
function resolveTouchedFilePath(params) {
	if (!params.root) return;
	const base = params.fileRoot ?? params.root;
	const resolved = resolveToCwd(params.filePath, base);
	if (!isPathInside(params.root, resolved)) return;
	return resolved;
}
function resolveFileRoot(params) {
	if (!params.root) return;
	if (!params.spawnedCwd) return params.root;
	const resolvedCwd = path.resolve(params.spawnedCwd);
	return isPathInside(path.resolve(params.root), resolvedCwd) ? params.spawnedCwd : params.root;
}
function relevanceForKind(kind) {
	return kind;
}
function mergeRelevance(current, next) {
	if (!current) return next;
	if (!next || current === next) return current;
	return "mixed";
}
function buildSessionRelevanceMap(files, root, fileRoot) {
	const relevance = /* @__PURE__ */ new Map();
	if (!root) {
		for (const file of files) relevance.set(normalizeRelativePath(file.path), relevanceForKind(file.kind));
		return relevance;
	}
	for (const file of files) {
		const resolved = resolveTouchedFilePath({
			root,
			fileRoot,
			filePath: file.path
		});
		if (!resolved) continue;
		relevance.set(toDisplayPath(root, resolved), relevanceForKind(file.kind));
	}
	return relevance;
}
function relevanceForBrowserPath(browserPath, kind, relevance) {
	if (kind === "file") return relevance.get(browserPath);
	const prefix = browserPath ? `${browserPath}/` : "";
	let aggregate;
	for (const [filePath, sessionKind] of relevance) if (filePath.startsWith(prefix) && filePath !== browserPath) aggregate = mergeRelevance(aggregate, sessionKind);
	return aggregate;
}
function displayNameForPath(filePath) {
	return path.basename(filePath) || filePath;
}
function isDetectedTextMime(mimeType) {
	return mimeType.startsWith("text/") || mimeType.endsWith("+xml") || DETECTED_TEXT_MIME_TYPES.has(mimeType);
}
function applyInlineFilePreview(entry, buffer, mimeType) {
	if (mimeType && BROWSER_PREVIEW_IMAGE_MIME_TYPES.has(mimeType)) {
		entry.mimeType = mimeType;
		entry.contentEncoding = "base64";
		entry.previewKind = "image";
		entry.content = buffer.toString("base64");
		return;
	}
	const text = decodeUtf8Strict(buffer);
	if ((!mimeType || isDetectedTextMime(mimeType)) && text !== void 0) {
		entry.mimeType = mimeType ?? "text/plain";
		entry.contentEncoding = "utf8";
		entry.previewKind = "text";
		entry.content = text;
		entry.hash = createHash("sha256").update(buffer).digest("hex");
		return;
	}
	entry.previewKind = "unsupported";
	if (mimeType) entry.mimeType = mimeType;
}
function applyOversizedFileMetadata(entry, buffer, mimeType) {
	const prefixIsText = decodeUtf8Strict(buffer) !== void 0;
	if (!mimeType && prefixIsText || mimeType && isDetectedTextMime(mimeType) && prefixIsText) return;
	entry.previewKind = "unsupported";
	if (mimeType) entry.mimeType = mimeType;
}
async function toSessionFileEntry(touched, root, fileRoot, opts = {}) {
	const resolved = resolveTouchedFilePath({
		root,
		fileRoot,
		filePath: touched.path
	});
	const base = {
		path: touched.path,
		name: displayNameForPath(touched.path),
		kind: touched.kind
	};
	if (!resolved) return {
		...base,
		missing: true
	};
	const browserPath = toDisplayPath(root, resolved);
	const stat = await statWorkspacePath(opts.workspaceRoot ?? root, browserPath);
	if (!stat || workspaceStatKind(stat) !== "file") return {
		...base,
		missing: true
	};
	const entry = {
		...base,
		workspacePath: browserPath,
		missing: false,
		size: stat.size,
		updatedAtMs: toUpdatedAtMs(stat.mtimeMs)
	};
	if (!opts.includeContent) return entry;
	if (stat.size <= MAX_PREVIEW_BYTES) {
		const read = await readWorkspaceFile(root, browserPath);
		if (!read) return {
			...base,
			missing: true
		};
		if (read === "too-large") return entry;
		entry.workspacePath = read.canonicalPath;
		entry.size = read.stat.size;
		entry.updatedAtMs = toUpdatedAtMs(read.stat.mtimeMs);
		const mimeType = await detectMime({ buffer: read.buffer });
		applyInlineFilePreview(entry, read.buffer, mimeType);
		return entry;
	}
	const prefix = await readWorkspaceFilePrefix(root, browserPath, MIME_SNIFF_PREFIX_BYTES);
	if (!prefix) return {
		...base,
		missing: true
	};
	entry.workspacePath = prefix.canonicalPath;
	entry.size = prefix.stat.size;
	entry.updatedAtMs = toUpdatedAtMs(prefix.stat.mtimeMs);
	const mimeType = await detectMime({ buffer: prefix.buffer });
	applyOversizedFileMetadata(entry, prefix.buffer, mimeType);
	return entry;
}
function loadSessionFileRoot(params) {
	const loaded = loadGatewaySessionEntryReadOnly(params.sessionKey, { agentId: params.agentId });
	if (!loaded.entry?.sessionId) return {
		...loaded,
		agentId: void 0,
		root: void 0,
		fileRoot: void 0
	};
	const agentId = normalizeAgentId(loaded.agentId ?? parseAgentSessionKey(loaded.canonicalKey)?.agentId ?? params.agentId ?? parseAgentSessionKey(params.sessionKey)?.agentId);
	const spawnedCwd = normalizeOptionalString(loaded.entry.spawnedCwd);
	const spawnedWorkspaceDir = normalizeOptionalString(loaded.entry.spawnedWorkspaceDir);
	const configuredWorkspaceDir = spawnedCwd || spawnedWorkspaceDir ? void 0 : normalizeOptionalString(resolveAgentWorkspaceDir(loaded.cfg, agentId));
	const diffCwd = spawnedCwd ?? spawnedWorkspaceDir ?? configuredWorkspaceDir;
	const root = spawnedWorkspaceDir ?? spawnedCwd ?? configuredWorkspaceDir;
	return {
		...loaded,
		agentId,
		root,
		fileRoot: resolveFileRoot({
			root,
			spawnedCwd
		}),
		diffCwd
	};
}
/**
* Canonical workspace root of a session that lives on this Gateway's own disk.
* Workspace identity surfaces must name the same directory the file routes
* open, so they read it from here instead of re-deriving the precedence.
*
* An exec-node session's directory only exists on the remote host, while the
* precedence below falls back to the local agent workspace — returning that
* would describe the wrong machine. `sessions.files.reveal` refuses the same
* case; callers here get "no local root" and their own absent-workspace path.
*/
function resolveLocalSessionWorkspaceRoot(params) {
	const loaded = loadSessionFileRoot(params);
	return loaded.entry?.execNode ? void 0 : loaded.root;
}
function resolveSessionFileCandidates(params) {
	return [resolveTouchedFilePath(params), resolveWorkspacePath(params.root, params.filePath)].filter((candidate, index, all) => {
		return candidate !== void 0 && all.indexOf(candidate) === index;
	});
}
async function toBrowserEntry(browserPath, dirent, relevance) {
	const statKind = workspaceStatKind(dirent);
	const kind = statKind === "directory" ? "directory" : statKind === "file" ? "file" : null;
	if (!kind) return;
	const sessionKind = relevanceForBrowserPath(browserPath, kind, relevance);
	return {
		path: browserPath,
		name: dirent.name,
		kind,
		...kind === "file" ? { size: dirent.size } : {},
		updatedAtMs: toUpdatedAtMs(dirent.mtimeMs),
		...sessionKind ? { sessionKind } : {}
	};
}
function matchesSearch(entryPath, name, query) {
	const normalizedQuery = query.toLowerCase();
	return name.toLowerCase().includes(normalizedQuery) || entryPath.toLowerCase().includes(normalizedQuery);
}
async function searchBrowserEntries(params) {
	const entries = [];
	let visitedEntries = 0;
	let truncated = false;
	const shouldStop = () => {
		if (entries.length >= MAX_SEARCH_ENTRIES || visitedEntries >= MAX_SEARCH_VISITED_ENTRIES) {
			truncated = true;
			return true;
		}
		return false;
	};
	const visit = async (dir) => {
		if (shouldStop()) return;
		const dirents = await listWorkspacePath(params.root, dir);
		if (!dirents) return;
		for (const dirent of sortDirents(dirents)) {
			if (shouldStop()) return;
			visitedEntries += 1;
			const browserPath = dir ? `${dir}/${dirent.name}` : dirent.name;
			if (matchesSearch(browserPath, dirent.name, params.query)) {
				const entry = await toBrowserEntry(browserPath, dirent, params.relevance);
				if (entry) entries.push(entry);
			}
			if (workspaceStatKind(dirent) === "directory" && !SEARCH_SKIP_DIRS.has(dirent.name)) await visit(browserPath);
		}
	};
	await visit("");
	return {
		entries: sortWorkspaceEntries(entries),
		...truncated ? { truncated } : {}
	};
}
async function buildBrowserResult(params) {
	if (!params.root) return;
	const search = normalizeOptionalString(params.search);
	const relevance = buildSessionRelevanceMap(params.files, params.root, params.fileRoot);
	if (search) {
		const result = await searchBrowserEntries({
			root: params.workspaceRoot ?? params.root,
			query: search,
			relevance
		});
		return {
			path: "",
			search,
			entries: result.entries,
			...result.truncated ? { truncated: result.truncated } : {}
		};
	}
	const browserPath = normalizeRelativePath(params.path);
	if (!resolveWorkspacePath(params.root, browserPath)) return;
	const stat = await statWorkspacePath(params.workspaceRoot ?? params.root, browserPath);
	if (!stat || workspaceStatKind(stat) !== "directory") return;
	const dirents = await listWorkspacePath(params.workspaceRoot ?? params.root, browserPath);
	if (!dirents) return;
	const entries = (await Promise.all(sortDirents(dirents).slice(0, 251).map((dirent) => {
		return toBrowserEntry(browserPath ? `${browserPath}/${dirent.name}` : dirent.name, dirent, relevance);
	}))).filter((entry) => Boolean(entry));
	const parent = path.dirname(browserPath);
	return {
		path: browserPath,
		...browserPath ? { parentPath: parent === "." ? "" : parent } : {},
		entries: sortWorkspaceEntries(entries.slice(0, MAX_BROWSER_ENTRIES)),
		...entries.length > MAX_BROWSER_ENTRIES ? { truncated: true } : {}
	};
}
async function loadSessionFiles(params) {
	const loaded = loadSessionFileRoot(params);
	const { storePath, entry, canonicalKey, agentId } = loaded;
	if (!entry?.sessionId || !storePath || !agentId) return { files: [] };
	const target = resolveTranscriptReadTarget({
		agentId,
		sessionEntry: entry,
		sessionId: entry.sessionId,
		sessionKey: canonicalKey,
		storePath
	});
	const files = await loadSqliteTouchedFiles(toTranscriptReadScope(target), `${agentId}\0${entry.sessionId}\0${target.storePath ?? ""}`);
	return {
		root: loaded.root,
		fileRoot: loaded.fileRoot,
		diffCwd: loaded.diffCwd,
		files: [...files.values()].toSorted((a, b) => {
			if (a.kind !== b.kind) return a.kind === "modified" ? -1 : 1;
			return a.path.localeCompare(b.path);
		})
	};
}
async function buildListResult(params) {
	const loaded = await loadSessionFiles(params);
	const root = loaded.root;
	const gitCheckout = loaded.diffCwd ? insideGitCheckout(loaded.diffCwd) : void 0;
	const workspaceRoot = root ? await openWorkspaceRoot(root) : void 0;
	const workspaceFiles = root ? loaded.files.filter((file) => Boolean(resolveTouchedFilePath({
		root,
		fileRoot: loaded.fileRoot,
		filePath: file.path
	}))) : loaded.files;
	const files = await Promise.all(workspaceFiles.map((file) => toSessionFileEntry(file, loaded.root, loaded.fileRoot, { workspaceRoot })));
	const browser = await buildBrowserResult({
		root,
		workspaceRoot,
		fileRoot: loaded.fileRoot,
		path: params.path,
		search: params.search,
		files: workspaceFiles
	});
	return {
		...root ? { root } : {},
		...gitCheckout === void 0 ? {} : { gitCheckout },
		files,
		...browser ? { browser } : {}
	};
}
async function findSessionFile(params) {
	const loaded = await loadSessionFiles(params);
	const exactTouched = loaded.files.find((file) => file.path === params.path);
	if (exactTouched) return {
		...loaded.root ? { root: loaded.root } : {},
		file: await toSessionFileEntry(exactTouched, loaded.root, loaded.fileRoot, { includeContent: true })
	};
	if (!loaded.root) return {};
	const candidates = resolveSessionFileCandidates({
		root: loaded.root,
		fileRoot: loaded.fileRoot,
		filePath: params.path
	});
	if (candidates.length === 0) return { root: loaded.root };
	const relevance = buildSessionRelevanceMap(loaded.files, loaded.root, loaded.fileRoot);
	for (const candidate of candidates) {
		const browserPath = toDisplayPath(loaded.root, candidate);
		const file = await toSessionFileEntry({
			path: browserPath,
			kind: relevance.get(browserPath) === "modified" ? "modified" : "read"
		}, loaded.root, loaded.root, { includeContent: true });
		if (!file.missing) return {
			root: loaded.root,
			file
		};
	}
	return { root: loaded.root };
}
function respondSessionFileNotFound(respond, filePath) {
	respond(false, void 0, sessionFilesError("session_file_not_found", "session file not found", { path: filePath }));
}
function respondSessionFileTooLarge(respond, file, filePath) {
	respond(false, void 0, sessionFilesError("session_file_too_large", "session file is too large to preview", {
		maxPreviewBytes: MAX_PREVIEW_BYTES,
		path: file.path || filePath,
		size: file.size
	}));
}
function respondSessionFileUnsafe(respond, filePath) {
	respond(false, void 0, sessionFilesError("session_file_unsafe", "session file could not be written safely", { path: filePath }));
}
function requireSessionFilesAgentId(params) {
	const requestedAgent = resolveRequestedSessionAgentId(params.cfg, params.sessionKey, params.agentId);
	if (!requestedAgent.ok) {
		params.respond(false, void 0, requestedAgent.error);
		return;
	}
	return requestedAgent.agentId;
}
/** Gateway handlers for session files and workspace browsing. */
const sessionsFilesHandlers = {
	"sessions.files.list": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateSessionsFilesListParams, "sessions.files.list", respond)) return;
		const agentId = requireSessionFilesAgentId({
			cfg: context.getRuntimeConfig(),
			sessionKey: params.sessionKey,
			agentId: params.agentId,
			respond
		});
		if (!agentId) return;
		const result = await buildListResult({
			...params,
			agentId
		});
		respond(true, {
			sessionKey: params.sessionKey,
			...result
		});
	},
	"sessions.files.get": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateSessionsFilesGetParams, "sessions.files.get", respond)) return;
		const agentId = requireSessionFilesAgentId({
			cfg: context.getRuntimeConfig(),
			sessionKey: params.sessionKey,
			agentId: params.agentId,
			respond
		});
		if (!agentId) return;
		const result = await findSessionFile({
			...params,
			agentId
		});
		if (!result.file || result.file.missing) {
			respondSessionFileNotFound(respond, params.path);
			return;
		}
		if (typeof result.file.content !== "string" && result.file.previewKind !== "unsupported") {
			respondSessionFileTooLarge(respond, result.file, params.path);
			return;
		}
		respond(true, {
			sessionKey: params.sessionKey,
			...result
		});
	},
	"sessions.files.set": async ({ params, respond, context, sessionMutationAuthorization }) => {
		if (!assertValidParams(params, validateSessionsFilesSetParams, "sessions.files.set", respond)) return;
		const agentId = requireSessionFilesAgentId({
			cfg: context.getRuntimeConfig(),
			sessionKey: params.sessionKey,
			agentId: params.agentId,
			respond
		});
		if (!agentId) return;
		if (params.content.includes("\0")) {
			respondSessionFileUnsafe(respond, params.path);
			return;
		}
		const contentSize = Buffer.byteLength(params.content, "utf8");
		if (contentSize > MAX_PREVIEW_BYTES) {
			respond(false, void 0, sessionFilesError("session_file_too_large", "session file content is too large", {
				maxPreviewBytes: MAX_PREVIEW_BYTES,
				path: params.path,
				size: contentSize
			}));
			return;
		}
		if (Buffer.from(params.content, "utf8").toString("utf8") !== params.content) {
			respondSessionFileUnsafe(respond, params.path);
			return;
		}
		const loaded = loadSessionFileRoot({
			...params,
			agentId
		});
		if (!loaded.root) {
			respondSessionFileNotFound(respond, params.path);
			return;
		}
		const candidates = resolveSessionFileCandidates({
			root: loaded.root,
			fileRoot: loaded.fileRoot,
			filePath: params.path
		});
		let browserPath;
		for (const candidate of candidates) {
			const candidatePath = toDisplayPath(loaded.root, candidate);
			const stat = await statWorkspacePath(loaded.root, candidatePath);
			if (stat && workspaceStatKind(stat) === "file") {
				browserPath = candidatePath;
				break;
			}
		}
		if (!browserPath) {
			respondSessionFileNotFound(respond, params.path);
			return;
		}
		let update;
		sessionMutationAuthorization?.assertCurrent();
		try {
			update = await updateWorkspaceFile(loaded.root, browserPath, params.content, params.expectedHash);
		} catch (err) {
			if (!(err instanceof FsSafeError)) throw err;
			respondSessionFileUnsafe(respond, params.path);
			return;
		}
		if (update.status === "conflict") {
			respond(false, void 0, sessionFilesError("session_file_conflict", "session file changed since it was read", {
				path: params.path,
				currentHash: update.currentHash
			}));
			return;
		}
		if (update.status === "unsafe") {
			respondSessionFileUnsafe(respond, params.path);
			return;
		}
		respond(true, {
			sessionKey: params.sessionKey,
			root: loaded.root,
			file: {
				path: params.path,
				workspacePath: update.canonicalPath,
				name: displayNameForPath(update.canonicalPath),
				kind: "modified",
				missing: false,
				size: update.stat.size,
				updatedAtMs: toUpdatedAtMs(update.stat.mtimeMs),
				hash: update.hash
			}
		});
	},
	"sessions.files.reveal": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateSessionsFilesRevealParams, "sessions.files.reveal", respond)) return;
		const agentId = requireSessionFilesAgentId({
			cfg: context.getRuntimeConfig(),
			sessionKey: params.key,
			agentId: params.agentId,
			respond
		});
		if (!agentId) return;
		const loaded = loadSessionFileRoot({
			sessionKey: params.key,
			agentId
		});
		const workspaceRoot = loaded.root;
		if (!workspaceRoot) {
			respond(true, {
				ok: false,
				error: "No workspace root is available for this session."
			});
			return;
		}
		if (loaded.entry?.execNode) {
			respond(true, {
				ok: false,
				path: workspaceRoot,
				error: "Cannot reveal this workspace because the session runs on an exec node."
			});
			return;
		}
		const placement = loaded.entry?.sessionId ? context.workerSessionPlacementService?.getMany([loaded.entry.sessionId]).get(loaded.entry.sessionId) : void 0;
		if (isCloudWorkerPlacementState(placement?.state)) {
			respond(true, {
				ok: false,
				path: workspaceRoot,
				error: `Cannot reveal this workspace because the session runs remotely (${placement.state}).`
			});
			return;
		}
		try {
			await execOpenPath(resolveOpenPathCommand(workspaceRoot));
			respond(true, {
				ok: true,
				path: workspaceRoot
			});
		} catch (error) {
			const errorMessage = formatOpenPathError(error);
			const detailedError = isHeadlessOpenPathError(errorMessage) ? `Cannot open path in headless environment. Path: ${workspaceRoot}. This environment appears to lack a graphical or terminal browser handler.` : `Failed to reveal session workspace: ${errorMessage}`;
			context.logGateway.warn(`sessions.files.reveal failed path=${sanitizePathForLog(workspaceRoot)}: ${errorMessage}`);
			respond(true, {
				ok: false,
				path: workspaceRoot,
				error: detailedError
			});
		}
	}
};
//#endregion
export { resolveLocalSessionWorkspaceRoot, sessionsFilesHandlers };
