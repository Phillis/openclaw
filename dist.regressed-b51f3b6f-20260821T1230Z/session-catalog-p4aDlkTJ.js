import { i as normalizeBoundedOptionalString } from "./string-coerce-CIXf7egm.js";
import { d as asPositiveSafeInteger, v as parseDateFirstTimestampMs } from "./number-coercion-oCkfUEEq.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { r as withTimeout } from "./timing-8WD1In27.js";
import { p as resolveDefaultAgentId } from "./agent-scope-config-BdXMWufB.js";
import "./number-runtime-CoAPZzJY.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import "./agent-runtime-BOIKP1my.js";
import "./security-runtime-Bm9RUgAZ.js";
import { a as CLAUDE_CLI_DEFAULT_MODEL_REF, n as CLAUDE_CLI_BACKEND_ID } from "./cli-constants-BoJ2vZl0.js";
import { a as ClaudeCatalogParamsError, n as CLAUDE_SESSIONS_LIST_COMMAND, o as isResumableClaudeSource, r as CLAUDE_SESSION_READ_COMMAND } from "./session-catalog-shared-B8NbCO28.js";
import { t as readClaudeDesktopCustomGroups } from "./claude-desktop-groups-We61sCgC.js";
import { n as adoptedSessionKey, r as adoptedSourceKey, t as CLAUDE_LOCAL_SESSION_HOST_ID } from "./session-catalog-adoption-C3d_naEs.js";
import { t as isExactClaudeSessionCursor } from "./session-catalog-cursor-NPLrVaSJ.js";
import { t as importClaudeHistory } from "./session-catalog-history-DcVjRnDe.js";
import { n as resolveNodeLabel, t as createNodeListFailedError } from "./session-catalog-node-helpers-Bb_Ro2Ey.js";
import { n as listBoundClaudeSessions, r as resolveClaudeCliRoutedModelId, t as currentClaudeSessionCatalogConfig } from "./session-catalog-runtime-DFVssKJj.js";
import { a as terminalEligibility, i as startClaudeCatalogTerminal, n as isClaudeCliAvailable, r as openClaudeCatalogTerminal, t as claudeNodeTerminalCapability } from "./session-catalog-terminal-TXFZe8Bn.js";
import { n as parseTranscriptLine, t as collectTranscriptText } from "./session-catalog-transcript-MpK0Zp4A.js";
import { n as continueOperations, r as linkContinued, t as checkClaudeUpstreamActivity } from "./session-upstream-activity-rL4Aj9-4.js";
import os from "node:os";
import path from "node:path";
import fs from "node:fs/promises";
//#region extensions/anthropic/session-catalog.ts
const DEFAULT_PAGE_LIMIT = 50;
const MAX_PAGE_LIMIT = 100;
const DEFAULT_TRANSCRIPT_LIMIT = 20;
const MAX_TRANSCRIPT_LIMIT = 50;
const MAX_HOSTS = 100;
const MAX_STRING_LENGTH = 4096;
const MAX_SEARCH_LENGTH = 500;
const MAX_SESSION_PULL_REQUESTS = 20;
const MAX_CATALOG_DISCOVERY_FILES = 1e4;
const MAX_CATALOG_DISCOVERY_CACHE_ENTRIES = 2e4;
const MAX_CATALOG_JSON_CACHE_ENTRIES = 4e3;
const MAX_CLAUDE_SESSION_SCAN_CACHE_ENTRIES = 8;
const CLAUDE_SESSION_SCAN_HARD_TTL_MS = 5 * 6e4;
const CLAUDE_PARTIAL_SCAN_TTL_MS = 15e3;
const CLAUDE_DESKTOP_SCAN_TTL_MS = 6e4;
const CLAUDE_CATALOG_IO_CONCURRENCY = 32;
const CLAUDE_METADATA_PREFIX_BYTES = 1024 * 1024;
const CLAUDE_METADATA_READ_CHUNK_BYTES = 16 * 1024;
const MAX_CATALOG_METADATA_SCAN_BYTES = 64 * 1024 * 1024;
const TRANSCRIPT_READ_CHUNK_BYTES = 128 * 1024;
const MAX_TRANSCRIPT_SCAN_BYTES = 64 * 1024 * 1024;
const MAX_TRANSCRIPT_PAGE_BYTES = 20 * 1024 * 1024;
const CLI_ENTRYPOINTS = /* @__PURE__ */ new Set(["cli", "sdk-cli"]);
const NODE_INVOKE_TIMEOUT_MS = 3e4;
const NODE_CATALOG_LIST_RESPONSE_TIMEOUT_MS = 8e3;
const CLAUDE_HISTORY_IMPORT_MAX_ITEMS = 200;
const CLAUDE_HISTORY_IMPORT_MAX_BYTES = 512 * 1024;
const catalogDiscoveryCache = /* @__PURE__ */ new Map();
const catalogJsonCache = /* @__PURE__ */ new Map();
const claudeSessionScanCache = /* @__PURE__ */ new Map();
async function mapConcurrent(values, limit, mapper) {
	const results = [];
	results.length = values.length;
	let nextIndex = 0;
	const workers = Array.from({ length: Math.min(limit, values.length) }, async () => {
		while (nextIndex < values.length) {
			const index = nextIndex++;
			results[index] = await mapper(values[index]);
		}
	});
	await Promise.all(workers);
	return results;
}
function setBoundedCache(cache, key, value, maxEntries) {
	cache.delete(key);
	cache.set(key, value);
	while (cache.size > maxEntries) {
		const oldest = cache.keys().next();
		if (oldest.done) break;
		cache.delete(oldest.value);
	}
}
function cacheCatalogDiscovery(filePath, entry) {
	setBoundedCache(catalogDiscoveryCache, filePath, entry, MAX_CATALOG_DISCOVERY_CACHE_ENTRIES);
}
function pullRequestState(value) {
	if (typeof value !== "string") return;
	switch (value.trim().toLowerCase()) {
		case "open":
		case "draft":
		case "merged":
		case "closed": return value.trim().toLowerCase();
		default: return;
	}
}
function desktopPullRequestSummary(metadata) {
	const visibleByNumber = /* @__PURE__ */ new Map();
	const dismissed = /* @__PURE__ */ new Set();
	if (Array.isArray(metadata.prs)) for (const value of metadata.prs) {
		if (!isRecord(value)) continue;
		const entry = value;
		const number = asPositiveSafeInteger(entry.prNumber);
		if (!number) continue;
		if (entry.dismissed === true) {
			dismissed.add(number);
			visibleByNumber.delete(number);
			continue;
		}
		if (!dismissed.has(number) && !visibleByNumber.has(number)) visibleByNumber.set(number, pullRequestState(entry.state));
	}
	const currentNumber = asPositiveSafeInteger(metadata.prNumber);
	let currentState = currentNumber ? visibleByNumber.get(currentNumber) : void 0;
	if (currentNumber && !dismissed.has(currentNumber)) {
		currentState = pullRequestState(metadata.prState) ?? currentState;
		visibleByNumber.delete(currentNumber);
		visibleByNumber.set(currentNumber, currentState);
	}
	const visible = [...visibleByNumber].map(([number, state]) => ({
		number,
		state
	}));
	if (visible.length === 0) return;
	const state = currentState ?? visible.at(-1)?.state;
	if (!state) return;
	return {
		numbers: visible.slice(-20).map((entry) => entry.number),
		state
	};
}
function parsePullRequestSummary(value) {
	if (value === void 0) return;
	if (!isRecord(value) || !Array.isArray(value.numbers)) throw new Error("Claude node returned an invalid pull request summary");
	const numbers = value.numbers.map(asPositiveSafeInteger);
	const state = pullRequestState(value.state);
	if (numbers.length === 0 || numbers.length > MAX_SESSION_PULL_REQUESTS || numbers.some((number) => number === void 0) || new Set(numbers).size !== numbers.length || !state) throw new Error("Claude node returned an invalid pull request summary");
	return {
		numbers,
		state
	};
}
function isCliEntrypoint(value) {
	return typeof value === "string" && CLI_ENTRYPOINTS.has(value);
}
function parseClaudeCatalogTimestampMs(value) {
	return parseDateFirstTimestampMs(value);
}
function isWithin(root, candidate) {
	const relative = path.relative(path.resolve(root), path.resolve(candidate));
	return relative === "" || !relative.startsWith("..") && !path.isAbsolute(relative);
}
async function safeSessionFile(root, resolvedRoot, candidate, sessionId) {
	if (!isWithin(root, candidate) || path.basename(candidate) !== `${sessionId}.jsonl`) return;
	try {
		const resolvedCandidate = await fs.realpath(candidate);
		if (!isWithin(resolvedRoot, resolvedCandidate)) return;
		const stat = await fs.stat(resolvedCandidate);
		return stat.isFile() ? {
			filePath: resolvedCandidate,
			stat
		} : void 0;
	} catch (error) {
		const code = error && typeof error === "object" && "code" in error ? error.code : void 0;
		if (code === "ENOENT" || code === "ENOTDIR") return;
		throw new Error("Claude session file validation failed", { cause: error });
	}
}
function safeSessionFileForScan(context, candidate, sessionId) {
	if (!context.resolvedRoot) return Promise.resolve(void 0);
	const key = `${sessionId}\0${path.resolve(candidate)}`;
	let pending = context.safeFiles.get(key);
	if (!pending) {
		pending = safeSessionFile(context.root, context.resolvedRoot, candidate, sessionId).catch(() => {
			context.complete = false;
			if (context.safeFiles.get(key) === pending) context.safeFiles.delete(key);
		});
		context.safeFiles.set(key, pending);
	}
	return pending;
}
async function readJsonFile(filePath, options = {}) {
	const stat = await fs.stat(filePath).catch(() => {
		options.onIoFailure?.();
	});
	if (!stat?.isFile()) {
		catalogJsonCache.delete(filePath);
		return;
	}
	const cached = catalogJsonCache.get(filePath);
	if (cached && cached.mtimeMs === stat.mtimeMs && cached.size === stat.size) {
		setBoundedCache(catalogJsonCache, filePath, cached, MAX_CATALOG_JSON_CACHE_ENTRIES);
		return cached.value;
	}
	let content;
	try {
		content = await fs.readFile(filePath, "utf8");
	} catch {
		options.onIoFailure?.();
		return;
	}
	try {
		const value = JSON.parse(content);
		setBoundedCache(catalogJsonCache, filePath, {
			mtimeMs: stat.mtimeMs,
			size: stat.size,
			value
		}, MAX_CATALOG_JSON_CACHE_ENTRIES);
		return value;
	} catch {
		return;
	}
}
async function childDirectories(root) {
	try {
		return (await fs.readdir(root, { withFileTypes: true })).filter((entry) => entry.isDirectory()).map((entry) => path.join(root, entry.name));
	} catch {
		return [];
	}
}
function projectsDir(homeDir, configDir) {
	return path.join(configDir ?? path.join(homeDir, ".claude"), "projects");
}
async function readProjectsTreeSnapshot(root) {
	let entries;
	try {
		entries = await fs.readdir(root, { withFileTypes: true });
	} catch {
		return {
			root,
			projectDirectories: [],
			treeStamp: "unavailable"
		};
	}
	const directoryEntries = entries.filter((entry) => entry.isDirectory());
	const [resolvedRoot, directories] = await Promise.all([fs.realpath(root).catch(() => void 0), mapConcurrent(directoryEntries, CLAUDE_CATALOG_IO_CONCURRENCY, async (entry) => {
		const directory = path.join(root, entry.name);
		const [stat, children] = await Promise.all([fs.stat(directory).catch(() => void 0), fs.readdir(directory, { withFileTypes: true }).catch(() => void 0)]);
		return {
			entry,
			directory,
			stat,
			children
		};
	})]);
	const childSignatures = await mapConcurrent(directories.flatMap(({ directory, children }, directoryIndex) => (children ?? []).map((child) => ({
		directoryIndex,
		directory,
		child
	}))), CLAUDE_CATALOG_IO_CONCURRENCY, async ({ directoryIndex, directory, child }) => {
		const childStat = await fs.stat(path.join(directory, child.name)).catch(() => void 0);
		return {
			directoryIndex,
			signature: childStat?.isFile() ? [
				child.name,
				childStat.mtimeMs,
				childStat.size,
				childStat.ino
			] : void 0
		};
	});
	const signaturesByDirectory = Array.from({ length: directories.length }, () => []);
	for (const { directoryIndex, signature } of childSignatures) if (signature) signaturesByDirectory[directoryIndex]?.push(signature);
	const directorySnapshots = directories.map(({ entry, directory, stat, children }, index) => {
		const fileSignatures = signaturesByDirectory[index] ?? [];
		const maxChildMtime = fileSignatures.reduce((maximum, [, mtime]) => Math.max(maximum ?? mtime, mtime), null);
		return {
			directory,
			childNames: children?.map((child) => child.name) ?? [],
			stamp: [
				entry.name,
				stat?.isDirectory() === true ? stat.mtimeMs : null,
				children?.map((child) => child.name) ?? null,
				maxChildMtime ?? null,
				fileSignatures
			]
		};
	});
	return {
		root,
		...resolvedRoot ? { resolvedRoot } : {},
		projectDirectories: directorySnapshots.map(({ directory, childNames }) => ({
			directory,
			childNames
		})),
		treeStamp: JSON.stringify([resolvedRoot ?? null, directorySnapshots.map(({ stamp }) => stamp)])
	};
}
async function desktopSessionStoreAvailable(homeDir) {
	return (await fs.stat(desktopSessionsDir(homeDir)).catch(() => void 0))?.isDirectory() === true;
}
function desktopSessionsDir(homeDir) {
	return path.join(homeDir, "Library", "Application Support", "Claude", "claude-code-sessions");
}
function currentHomeDir(env = process.env) {
	return env.HOME?.trim() || env.USERPROFILE?.trim() || os.homedir();
}
function configuredClaudeConfigDir(env = process.env) {
	const configured = env.CLAUDE_CONFIG_DIR?.trim();
	return configured ? path.resolve(configured) : void 0;
}
function gatewayClaudeScanOptions(allowProcessHomeFallback) {
	const configDir = configuredClaudeConfigDir();
	return {
		...configDir ? { configDir } : {},
		includeDesktop: allowProcessHomeFallback !== false
	};
}
async function readDesktopMetadata(homeDir) {
	const active = /* @__PURE__ */ new Map();
	const archived = /* @__PURE__ */ new Set();
	const customGroups = await readClaudeDesktopCustomGroups(homeDir);
	for (const accountDir of await childDirectories(desktopSessionsDir(homeDir))) for (const workspaceDir of await childDirectories(accountDir)) {
		let entries;
		try {
			entries = await fs.readdir(workspaceDir);
		} catch {
			continue;
		}
		for (const name of entries) {
			if (!name.startsWith("local_") || !name.endsWith(".json")) continue;
			const raw = await readJsonFile(path.join(workspaceDir, name));
			if (!isRecord(raw)) continue;
			const metadata = raw;
			const cliSessionId = normalizeBoundedOptionalString(metadata.cliSessionId, 256);
			if (!cliSessionId) continue;
			if (metadata.isArchived === true) {
				archived.add(cliSessionId);
				active.delete(cliSessionId);
				continue;
			}
			if (!archived.has(cliSessionId)) {
				const localSessionId = normalizeBoundedOptionalString(metadata.sessionId, 256);
				const customGroup = localSessionId ? customGroups.get(localSessionId) : void 0;
				active.set(cliSessionId, customGroup ? {
					...metadata,
					customGroup
				} : metadata);
			}
		}
	}
	return {
		active,
		archived
	};
}
async function readIndexRecords(context) {
	const records = /* @__PURE__ */ new Map();
	const sidechainIds = /* @__PURE__ */ new Set();
	if (!context.resolvedRoot) return {
		records,
		sidechainIds
	};
	const indexes = await mapConcurrent(context.projectDirectories, CLAUDE_CATALOG_IO_CONCURRENCY, async ({ directory, childNames }) => ({
		directory,
		raw: childNames.includes("sessions-index.json") ? await readJsonFile(path.join(directory, "sessions-index.json"), { onIoFailure: () => {
			context.complete = false;
		} }) : void 0
	}));
	const candidates = [];
	for (const { directory, raw } of indexes) {
		if (!isRecord(raw) || !Array.isArray(raw.entries)) continue;
		for (const candidate of raw.entries) {
			if (!isRecord(candidate)) continue;
			const entry = candidate;
			const sessionId = normalizeBoundedOptionalString(entry.sessionId, 256);
			if (!sessionId) continue;
			candidates.push({
				directory,
				entry,
				sessionId
			});
		}
	}
	const safeFiles = await mapConcurrent(candidates, CLAUDE_CATALOG_IO_CONCURRENCY, async ({ directory, entry, sessionId }) => {
		if (entry.isSidechain === true) return;
		return await safeSessionFileForScan(context, normalizeBoundedOptionalString(entry.fullPath, MAX_STRING_LENGTH) ?? path.join(directory, `${sessionId}.jsonl`), sessionId);
	});
	for (const [index, candidate] of candidates.entries()) {
		const { entry, sessionId } = candidate;
		if (entry.isSidechain === true) {
			sidechainIds.add(sessionId);
			records.delete(sessionId);
			continue;
		}
		const safeFile = safeFiles[index];
		if (!safeFile) continue;
		const createdAt = parseClaudeCatalogTimestampMs(entry.created);
		const updatedAt = parseClaudeCatalogTimestampMs(entry.modified) ?? parseClaudeCatalogTimestampMs(entry.fileMtime);
		const summary = normalizeBoundedOptionalString(entry.summary, 500);
		const firstPrompt = normalizeBoundedOptionalString(entry.firstPrompt, 500);
		records.set(sessionId, {
			threadId: sessionId,
			name: summary ?? firstPrompt ?? null,
			cwd: normalizeBoundedOptionalString(entry.projectPath, MAX_STRING_LENGTH),
			status: "stored",
			...createdAt !== void 0 ? { createdAt } : {},
			...updatedAt !== void 0 ? {
				updatedAt,
				recencyAt: updatedAt
			} : {},
			source: "claude-cli",
			modelProvider: "anthropic",
			...normalizeBoundedOptionalString(entry.gitBranch, 500) ? { gitBranch: normalizeBoundedOptionalString(entry.gitBranch, 500) } : {},
			archived: false,
			filePath: safeFile.filePath
		});
	}
	return {
		records,
		sidechainIds
	};
}
async function locateSessionFile(context, sessionId) {
	const fileName = `${sessionId}.jsonl`;
	for (const { directory, childNames } of context.projectDirectories) {
		if (!childNames.includes(fileName)) continue;
		const safeFile = await safeSessionFileForScan(context, path.join(directory, fileName), sessionId);
		if (safeFile) return safeFile.filePath;
	}
}
async function discoverCliRecords(context, records, sidechainIds) {
	const { root } = context;
	if (!context.resolvedRoot) {
		for (const [cachedPath, entry] of catalogDiscoveryCache) if (entry.root === root) catalogDiscoveryCache.delete(cachedPath);
		return;
	}
	let discoveredFiles = 0;
	let scannedBytes = 0;
	let truncated = false;
	const seenFilePaths = /* @__PURE__ */ new Set();
	const candidates = [];
	collect: for (const { directory, childNames } of context.projectDirectories) for (const name of childNames) {
		if (!name.endsWith(".jsonl")) continue;
		if (discoveredFiles >= MAX_CATALOG_DISCOVERY_FILES) {
			truncated = true;
			break collect;
		}
		discoveredFiles += 1;
		const sessionId = name.slice(0, -6);
		if (sessionId) candidates.push({
			directory,
			name,
			sessionId
		});
	}
	const safeFiles = await mapConcurrent(candidates, CLAUDE_CATALOG_IO_CONCURRENCY, async ({ directory, name, sessionId }) => records.has(sessionId) || sidechainIds.has(sessionId) ? void 0 : await safeSessionFileForScan(context, path.join(directory, name), sessionId));
	for (const [candidateIndex, candidate] of candidates.entries()) {
		const { sessionId } = candidate;
		if (records.has(sessionId) || sidechainIds.has(sessionId)) continue;
		const safeFile = safeFiles[candidateIndex];
		if (!safeFile) continue;
		const { filePath, stat: fileStat } = safeFile;
		seenFilePaths.add(filePath);
		const cached = catalogDiscoveryCache.get(filePath);
		if (cached && cached.root === root && cached.mtimeMs === fileStat.mtimeMs && cached.size === fileStat.size && cached.ino === fileStat.ino && cached.sessionId === sessionId && scannedBytes + cached.scannedBytes <= MAX_CATALOG_METADATA_SCAN_BYTES) {
			if (cached.sidechain) sidechainIds.add(sessionId);
			if (cached.record) records.set(sessionId, cached.record);
			scannedBytes += cached.scannedBytes;
			if (scannedBytes >= MAX_CATALOG_METADATA_SCAN_BYTES) {
				truncated = true;
				break;
			}
			continue;
		}
		const handle = await fs.open(filePath, "r").catch(() => {
			context.complete = false;
		});
		if (!handle) continue;
		let cacheable = false;
		let fileScannedBytes = 0;
		try {
			const stat = await handle.stat();
			let aiTitle;
			let pending = Buffer.alloc(0);
			let fileOffset = 0;
			let stopFile = false;
			const inspectLine = (line) => {
				let raw;
				try {
					raw = JSON.parse(line.toString("utf8"));
				} catch {
					return false;
				}
				if (!isRecord(raw) || raw.sessionId !== sessionId) return false;
				if (raw.type === "ai-title") {
					aiTitle = normalizeBoundedOptionalString(raw.aiTitle, 500) ?? aiTitle;
					return false;
				}
				if (typeof raw.entrypoint === "string" && !isCliEntrypoint(raw.entrypoint)) return true;
				if (isCliEntrypoint(raw.entrypoint) && raw.isSidechain === true) {
					sidechainIds.add(sessionId);
					return true;
				}
				if (!isCliEntrypoint(raw.entrypoint) || raw.type !== "user" || !isRecord(raw.message) || raw.message.role !== "user") return false;
				const fragments = [];
				collectTranscriptText(raw.message.content, fragments);
				const firstPrompt = normalizeBoundedOptionalString(fragments[0], 500);
				const createdAt = parseClaudeCatalogTimestampMs(raw.timestamp);
				records.set(sessionId, {
					threadId: sessionId,
					name: aiTitle ?? firstPrompt ?? null,
					cwd: normalizeBoundedOptionalString(raw.cwd, MAX_STRING_LENGTH),
					status: "stored",
					...createdAt !== void 0 ? { createdAt } : {},
					updatedAt: stat.mtimeMs,
					recencyAt: stat.mtimeMs,
					source: "claude-cli",
					modelProvider: "anthropic",
					...normalizeBoundedOptionalString(raw.version, 256) ? { cliVersion: normalizeBoundedOptionalString(raw.version, 256) } : {},
					...normalizeBoundedOptionalString(raw.gitBranch, 500) ? { gitBranch: normalizeBoundedOptionalString(raw.gitBranch, 500) } : {},
					archived: false,
					filePath
				});
				return true;
			};
			while (!stopFile && fileOffset < stat.size && fileOffset < CLAUDE_METADATA_PREFIX_BYTES && scannedBytes < MAX_CATALOG_METADATA_SCAN_BYTES) {
				const size = Math.min(CLAUDE_METADATA_READ_CHUNK_BYTES, stat.size - fileOffset, CLAUDE_METADATA_PREFIX_BYTES - fileOffset, MAX_CATALOG_METADATA_SCAN_BYTES - scannedBytes);
				const chunk = Buffer.allocUnsafe(size);
				const { bytesRead } = await handle.read(chunk, 0, size, fileOffset);
				if (bytesRead === 0) break;
				fileOffset += bytesRead;
				scannedBytes += bytesRead;
				pending = pending.length ? Buffer.concat([pending, chunk.subarray(0, bytesRead)]) : chunk.subarray(0, bytesRead);
				let newline;
				while (!stopFile && (newline = pending.indexOf(10)) >= 0) {
					stopFile = inspectLine(pending.subarray(0, newline));
					pending = pending.subarray(newline + 1);
				}
			}
			if (!stopFile && fileOffset >= stat.size && pending.length > 0) inspectLine(pending);
			cacheable = !(scannedBytes >= MAX_CATALOG_METADATA_SCAN_BYTES) && (stopFile || fileOffset >= stat.size || fileOffset >= CLAUDE_METADATA_PREFIX_BYTES);
			fileScannedBytes = fileOffset;
		} finally {
			await handle.close();
		}
		if (cacheable) cacheCatalogDiscovery(filePath, {
			root,
			mtimeMs: fileStat.mtimeMs,
			size: fileStat.size,
			ino: fileStat.ino,
			sessionId,
			scannedBytes: fileScannedBytes,
			record: records.get(sessionId) ?? null,
			sidechain: sidechainIds.has(sessionId)
		});
		if (scannedBytes >= MAX_CATALOG_METADATA_SCAN_BYTES) {
			truncated = true;
			break;
		}
	}
	if (!truncated) {
		for (const [cachedPath, entry] of catalogDiscoveryCache) if (entry.root === root && !seenFilePaths.has(cachedPath)) catalogDiscoveryCache.delete(cachedPath);
	}
}
async function scanClaudeSessions(homeDir, snapshot, includeDesktop) {
	const context = {
		...snapshot,
		complete: true,
		safeFiles: /* @__PURE__ */ new Map()
	};
	const [indexed, desktop] = await Promise.all([readIndexRecords(context), includeDesktop ? readDesktopMetadata(homeDir) : Promise.resolve({
		active: /* @__PURE__ */ new Map(),
		archived: /* @__PURE__ */ new Set()
	})]);
	const records = indexed.records;
	await discoverCliRecords(context, records, indexed.sidechainIds);
	for (const sessionId of desktop.archived) records.delete(sessionId);
	for (const [sessionId, metadata] of desktop.active) {
		if (indexed.sidechainIds.has(sessionId)) continue;
		const existing = records.get(sessionId);
		const filePath = existing?.filePath ?? await locateSessionFile(context, sessionId);
		if (!filePath) continue;
		const createdAt = parseClaudeCatalogTimestampMs(metadata.createdAt) ?? existing?.createdAt;
		const updatedAt = parseClaudeCatalogTimestampMs(metadata.lastActivityAt) ?? existing?.updatedAt;
		const customGroup = normalizeBoundedOptionalString(metadata.customGroup, 500);
		const pullRequest = desktopPullRequestSummary(metadata);
		records.set(sessionId, {
			...existing ?? {
				threadId: sessionId,
				status: "stored",
				modelProvider: "anthropic",
				archived: false
			},
			name: normalizeBoundedOptionalString(metadata.title, 500) ?? existing?.name ?? null,
			cwd: normalizeBoundedOptionalString(metadata.cwd, MAX_STRING_LENGTH) ?? normalizeBoundedOptionalString(metadata.originCwd, MAX_STRING_LENGTH) ?? existing?.cwd,
			...createdAt !== void 0 ? { createdAt } : {},
			...updatedAt !== void 0 ? {
				updatedAt,
				recencyAt: updatedAt
			} : {},
			...customGroup ? { customGroup } : {},
			...pullRequest ? { pullRequest } : {},
			source: "claude-desktop",
			filePath
		});
	}
	return {
		records: [...records.values()].toSorted((left, right) => {
			return (right.recencyAt ?? right.updatedAt ?? 0) - (left.recencyAt ?? left.updatedAt ?? 0) || left.threadId.localeCompare(right.threadId);
		}),
		complete: context.complete
	};
}
async function listClaudeSessions(homeDir = currentHomeDir(), options = {}) {
	const root = projectsDir(homeDir, options.configDir);
	const includeDesktop = options.includeDesktop !== false;
	const cacheKey = `${root}\0${includeDesktop ? "desktop" : "cli"}`;
	const [treeSnapshot, desktopStoreAvailable] = await Promise.all([readProjectsTreeSnapshot(root), includeDesktop ? desktopSessionStoreAvailable(homeDir) : Promise.resolve(false)]);
	const now = Date.now();
	const cached = claudeSessionScanCache.get(cacheKey);
	if (options.forceRefresh !== true && cached && cached.treeStamp === treeSnapshot.treeStamp && cached.hardExpiresAt > now && cached.desktopStoreAvailable === desktopStoreAvailable && (!desktopStoreAvailable || cached.desktopExpiresAt > now)) {
		setBoundedCache(claudeSessionScanCache, cacheKey, cached, MAX_CLAUDE_SESSION_SCAN_CACHE_ENTRIES);
		return await cached.records;
	}
	const scan = scanClaudeSessions(homeDir, treeSnapshot, includeDesktop);
	let scanComplete = true;
	const records = scan.then((result) => {
		scanComplete = result.complete;
		return result.records;
	});
	const entry = {
		treeStamp: treeSnapshot.treeStamp,
		hardExpiresAt: now + CLAUDE_SESSION_SCAN_HARD_TTL_MS,
		desktopStoreAvailable,
		desktopExpiresAt: now + CLAUDE_DESKTOP_SCAN_TTL_MS,
		records
	};
	setBoundedCache(claudeSessionScanCache, cacheKey, entry, MAX_CLAUDE_SESSION_SCAN_CACHE_ENTRIES);
	try {
		const result = await records;
		if (!scanComplete && claudeSessionScanCache.get(cacheKey) === entry) entry.hardExpiresAt = Date.now() + CLAUDE_PARTIAL_SCAN_TTL_MS;
		return result;
	} catch (error) {
		if (claudeSessionScanCache.get(cacheKey) === entry) claudeSessionScanCache.delete(cacheKey);
		throw error;
	}
}
function encodeOffset(offset) {
	return Buffer.from(JSON.stringify({ offset }), "utf8").toString("base64url");
}
function decodeOffset(cursor, label) {
	if (cursor === void 0) return 0;
	if (!isExactClaudeSessionCursor(cursor)) throw new ClaudeCatalogParamsError(`${label} cursor is invalid`);
	try {
		const parsed = JSON.parse(Buffer.from(cursor, "base64url").toString("utf8"));
		if (!isRecord(parsed) || !Number.isSafeInteger(parsed.offset) || parsed.offset < 0) throw new Error("invalid offset");
		return parsed.offset;
	} catch (error) {
		throw new ClaudeCatalogParamsError(`${label} cursor is invalid`, { cause: error });
	}
}
function readLimit(value, fallback, max) {
	if (value === void 0) return fallback;
	if (!Number.isInteger(value) || value < 1 || value > max) throw new ClaudeCatalogParamsError(`limit must be an integer from 1 to ${max}`);
	return value;
}
function readRequiredCursor(value, message) {
	if (!isExactClaudeSessionCursor(value)) throw new ClaudeCatalogParamsError(message);
	return value;
}
function readOptionalCursor(value, label) {
	if (value === void 0) return;
	return readRequiredCursor(value, `${label} cursor is invalid`);
}
function readListParams(value) {
	if (value === void 0 || value === null) return { limit: DEFAULT_PAGE_LIMIT };
	if (!isRecord(value)) throw new ClaudeCatalogParamsError("Claude session catalog parameters must be an object");
	const allowed = /* @__PURE__ */ new Set([
		"cursor",
		"limit",
		"searchTerm"
	]);
	const unknown = Object.keys(value).find((key) => !allowed.has(key));
	if (unknown) throw new ClaudeCatalogParamsError(`unknown Claude session catalog parameter: ${unknown}`);
	const cursor = readOptionalCursor(value.cursor, "catalog");
	const searchTerm = normalizeBoundedOptionalString(value.searchTerm, MAX_SEARCH_LENGTH);
	return {
		limit: readLimit(value.limit, DEFAULT_PAGE_LIMIT, MAX_PAGE_LIMIT),
		...cursor ? { cursor } : {},
		...searchTerm ? { searchTerm } : {}
	};
}
async function listLocalClaudeSessionPage(value, homeDir, scanOptions) {
	const resolvedHome = homeDir ?? currentHomeDir();
	const resolvedScanOptions = scanOptions ?? (homeDir === void 0 ? gatewayClaudeScanOptions(true) : {});
	const params = readListParams(value);
	const offset = decodeOffset(params.cursor, "catalog");
	const search = params.searchTerm?.toLocaleLowerCase();
	const records = (await listClaudeSessions(resolvedHome, resolvedScanOptions)).filter((record) => {
		if (!search) return true;
		return [
			record.name,
			record.cwd,
			record.gitBranch,
			record.threadId
		].some((candidate) => candidate?.toLocaleLowerCase().includes(search));
	});
	const page = records.slice(offset, offset + params.limit).map(({ filePath: _filePath, ...record }) => record);
	const nextOffset = offset + page.length;
	return {
		sessions: page,
		...nextOffset < records.length ? { nextCursor: encodeOffset(nextOffset) } : {}
	};
}
function readTranscriptParams(value, options = {}) {
	if (!isRecord(value)) throw new ClaudeCatalogParamsError("Claude session read parameters must be an object");
	const allowed = /* @__PURE__ */ new Set([
		"threadId",
		"cursor",
		"limit",
		...options.includeHostId ? ["hostId"] : []
	]);
	const unknown = Object.keys(value).find((key) => !allowed.has(key));
	if (unknown) throw new ClaudeCatalogParamsError(`unknown Claude session read parameter: ${unknown}`);
	const threadId = normalizeBoundedOptionalString(value.threadId, 256);
	if (!threadId || !/^[A-Za-z0-9._:-]+$/.test(threadId)) throw new ClaudeCatalogParamsError("threadId is invalid");
	const cursor = readOptionalCursor(value.cursor, "transcript");
	return {
		threadId,
		limit: readLimit(value.limit, DEFAULT_TRANSCRIPT_LIMIT, MAX_TRANSCRIPT_LIMIT),
		...cursor ? { cursor } : {}
	};
}
async function readLocalClaudeTranscriptPage(value, homeDir, scanOptions) {
	const resolvedHome = homeDir ?? currentHomeDir();
	const resolvedScanOptions = scanOptions ?? (homeDir === void 0 ? gatewayClaudeScanOptions(true) : {});
	const params = readTranscriptParams(value);
	let filePath = (await listClaudeSessions(resolvedHome, resolvedScanOptions)).find((record) => record.threadId === params.threadId)?.filePath;
	if (!filePath) filePath = (await listClaudeSessions(resolvedHome, {
		...resolvedScanOptions,
		forceRefresh: true
	})).find((record) => record.threadId === params.threadId)?.filePath;
	if (!filePath) throw new ClaudeCatalogParamsError("Claude session is unavailable");
	const handle = await fs.open(filePath, "r");
	try {
		const stat = await handle.stat();
		const requestedEnd = params.cursor ? decodeOffset(params.cursor, "transcript") : stat.size;
		if (requestedEnd > stat.size) throw new ClaudeCatalogParamsError("transcript cursor is invalid");
		let position = requestedEnd;
		let scanned = 0;
		let fragments = [];
		const found = [];
		while (position > 0 && scanned < MAX_TRANSCRIPT_SCAN_BYTES && found.length <= params.limit) {
			const size = Math.min(TRANSCRIPT_READ_CHUNK_BYTES, position, MAX_TRANSCRIPT_SCAN_BYTES - scanned);
			position -= size;
			const chunk = Buffer.allocUnsafe(size);
			let filled = 0;
			while (filled < size) {
				const { bytesRead } = await handle.read(chunk, filled, size - filled, position + filled);
				if (bytesRead === 0) throw new Error("Claude transcript changed while it was being read");
				filled += bytesRead;
			}
			scanned += filled;
			let right = filled;
			for (let index = filled - 1; index >= 0; index -= 1) {
				if (chunk[index] !== 10) continue;
				const segment = chunk.subarray(index + 1, right);
				if (segment.length > 0 || fragments.length > 0) {
					const item = parseTranscriptLine(Buffer.concat([segment, ...fragments.toReversed()]), normalizeBoundedOptionalString);
					fragments = [];
					if (item) {
						found.push({
							item,
							start: position + index + 1
						});
						if (found.length > params.limit) break;
					}
				}
				right = index;
			}
			if (found.length > params.limit) break;
			const prefix = chunk.subarray(0, right);
			if (position === 0) {
				if (prefix.length > 0 || fragments.length > 0) {
					const item = parseTranscriptLine(Buffer.concat([prefix, ...fragments.toReversed()]), normalizeBoundedOptionalString);
					if (item) found.push({
						item,
						start: 0
					});
				}
				fragments = [];
			} else if (prefix.length > 0) fragments.push(prefix);
		}
		if (position > 0 && found.length < params.limit) throw new Error("Claude transcript page exceeded the safe scan limit");
		const requested = found.slice(0, params.limit);
		const selected = [];
		let selectedBytes = 0;
		for (const entry of requested) {
			const itemBytes = Buffer.byteLength(JSON.stringify(entry.item), "utf8");
			if (selected.length > 0 && selectedBytes + itemBytes > MAX_TRANSCRIPT_PAGE_BYTES - 64 * 1024) break;
			selected.push(entry);
			selectedBytes += itemBytes;
		}
		const earliestStart = selected.at(-1)?.start;
		const hasEarlierItems = selected.length < found.length || position > 0;
		return {
			threadId: params.threadId,
			items: selected.map((entry) => entry.item),
			...hasEarlierItems && earliestStart !== void 0 && earliestStart > 0 ? { nextCursor: encodeOffset(earliestStart) } : {}
		};
	} finally {
		await handle.close();
	}
}
function readNodePageCursor(value, invalidPageMessage) {
	if (!("nextCursor" in value)) return;
	if (!isExactClaudeSessionCursor(value.nextCursor)) throw new Error(invalidPageMessage);
	return value.nextCursor;
}
function parseCatalogPage(value) {
	if (!isRecord(value) || !Array.isArray(value.sessions) || value.sessions.length > MAX_PAGE_LIMIT) throw new Error("Claude node returned an invalid session page");
	const sessions = value.sessions.map((candidate) => {
		if (!isRecord(candidate)) throw new Error("Claude node returned an invalid session");
		const threadId = normalizeBoundedOptionalString(candidate.threadId, 256);
		const source = candidate.source;
		if (!threadId || candidate.archived !== false || candidate.status !== "stored" || source !== "claude-cli" && source !== "claude-desktop" || candidate.modelProvider !== "anthropic") throw new Error("Claude node returned an invalid session");
		const parseStringField = (key, maxLength = MAX_STRING_LENGTH) => {
			if (!(key in candidate)) return;
			const parsed = normalizeBoundedOptionalString(candidate[key], maxLength);
			if (!parsed) throw new Error("Claude node returned an invalid session");
			return parsed;
		};
		const parseNumberField = (key, nullable = false) => {
			if (!(key in candidate)) return;
			if (nullable && candidate[key] === null) return null;
			const parsed = candidate[key];
			if (typeof parsed !== "number" || !Number.isFinite(parsed)) throw new Error("Claude node returned an invalid session");
			return parsed;
		};
		let name;
		if (candidate.name === null) name = null;
		else name = parseStringField("name", 500);
		const cwd = parseStringField("cwd");
		const createdAt = parseNumberField("createdAt");
		const updatedAt = parseNumberField("updatedAt");
		const recencyAt = parseNumberField("recencyAt", true);
		const cliVersion = parseStringField("cliVersion", 256);
		const gitBranch = parseStringField("gitBranch", 500);
		const pullRequest = parsePullRequestSummary(candidate.pullRequest);
		return {
			threadId,
			status: "stored",
			source,
			modelProvider: "anthropic",
			archived: false,
			...name !== void 0 ? { name } : {},
			...cwd ? { cwd } : {},
			...createdAt !== void 0 ? { createdAt } : {},
			...updatedAt !== void 0 ? { updatedAt } : {},
			...recencyAt !== void 0 ? { recencyAt } : {},
			...cliVersion ? { cliVersion } : {},
			...gitBranch ? { gitBranch } : {},
			...pullRequest ? { pullRequest } : {}
		};
	});
	const nextCursor = readNodePageCursor(value, "Claude node returned an invalid session page");
	return {
		sessions,
		...nextCursor ? { nextCursor } : {}
	};
}
function unwrapNodePayload(value) {
	if (isRecord(value) && typeof value.payloadJSON === "string") return JSON.parse(value.payloadJSON);
	return value;
}
function parseGatewayQuery(value) {
	if (value === void 0 || value === null) return { limitPerHost: DEFAULT_PAGE_LIMIT };
	if (!isRecord(value)) throw new ClaudeCatalogParamsError("Claude session catalog parameters must be an object");
	const allowed = /* @__PURE__ */ new Set([
		"search",
		"limitPerHost",
		"hostIds",
		"cursors"
	]);
	const unknown = Object.keys(value).find((key) => !allowed.has(key));
	if (unknown) throw new ClaudeCatalogParamsError(`unknown Claude session catalog parameter: ${unknown}`);
	const search = normalizeBoundedOptionalString(value.search, MAX_SEARCH_LENGTH);
	let hostIds;
	if (value.hostIds !== void 0) {
		if (!Array.isArray(value.hostIds) || value.hostIds.length > MAX_HOSTS) throw new ClaudeCatalogParamsError("hostIds must be a bounded array");
		hostIds = [...new Set(value.hostIds.map((hostId) => {
			const normalized = normalizeBoundedOptionalString(hostId, 256);
			if (!normalized || normalized !== "gateway:local" && !normalized.startsWith("node:")) throw new ClaudeCatalogParamsError("hostId is invalid");
			return normalized;
		}))];
	}
	let cursors;
	if (value.cursors !== void 0) {
		if (!isRecord(value.cursors) || Object.keys(value.cursors).length > MAX_HOSTS) throw new ClaudeCatalogParamsError("cursors must be a bounded object");
		cursors = Object.fromEntries(Object.entries(value.cursors).map(([hostId, cursor]) => {
			return [hostId, readRequiredCursor(cursor, `cursor for ${hostId} is invalid`)];
		}));
	}
	return {
		limitPerHost: readLimit(value.limitPerHost, DEFAULT_PAGE_LIMIT, MAX_PAGE_LIMIT),
		...search ? { search } : {},
		...hostIds ? { hostIds } : {},
		...cursors ? { cursors } : {}
	};
}
async function listClaudeSessionCatalog(params) {
	const query = parseGatewayQuery(params.query);
	const requested = query.hostIds ? new Set(query.hostIds) : void 0;
	const scanOptions = gatewayClaudeScanOptions(params.allowProcessHomeFallback);
	const localHosts = (params.allowProcessHomeFallback !== false || scanOptions.configDir !== void 0) && (!requested || requested.has("gateway:local")) ? [(async () => {
		try {
			return {
				hostId: CLAUDE_LOCAL_SESSION_HOST_ID,
				label: "Local Claude",
				kind: "gateway",
				connected: true,
				...await listLocalClaudeSessionPage({
					limit: query.limitPerHost,
					...query.search ? { searchTerm: query.search } : {},
					...query.cursors?.["gateway:local"] !== void 0 ? { cursor: query.cursors[CLAUDE_LOCAL_SESSION_HOST_ID] } : {}
				}, currentHomeDir(), scanOptions)
			};
		} catch {
			return {
				hostId: CLAUDE_LOCAL_SESSION_HOST_ID,
				label: "Local Claude",
				kind: "gateway",
				connected: true,
				sessions: [],
				error: {
					code: "LOCAL_READ_FAILED",
					message: "Local Claude sessions are unavailable"
				}
			};
		}
	})()] : [];
	for (const host of localHosts) if (params.onHost) host.then(params.onHost).catch(() => void 0);
	if (!(!requested || query.hostIds?.some((hostId) => hostId.startsWith("node:")))) return { hosts: await Promise.all(localHosts) };
	let nodes;
	try {
		nodes = (await (params.listNodes?.() ?? params.runtime.nodes.list())).nodes;
	} catch (error) {
		const registryHost = {
			hostId: "node:registry",
			label: "Paired nodes",
			kind: "node",
			connected: false,
			sessions: [],
			error: createNodeListFailedError(error)
		};
		params.onHost?.(registryHost);
		return { hosts: [...await Promise.all(localHosts), registryHost] };
	}
	const eligible = nodes.filter((node) => node.gatewayLocal !== true && node.commands?.includes("anthropic.claude.sessions.list.v1") && (!requested || requested.has(`node:${node.nodeId}`))).slice(0, MAX_HOSTS - localHosts.length).toSorted((left, right) => resolveNodeLabel(left).localeCompare(resolveNodeLabel(right)));
	const nodeHosts = await Promise.all(eligible.map(async (node) => {
		const hostId = `node:${node.nodeId}`;
		const common = {
			hostId,
			label: resolveNodeLabel(node),
			kind: "node",
			connected: node.connected === true,
			nodeId: node.nodeId,
			canContinueClaude: node.commands?.includes("anthropic.claude.sessions.read.v1") === true && node.commands.includes("agent.cli.claude.run.v1") && node.invocableCommands?.includes("anthropic.claude.sessions.list.v1") === true && node.invocableCommands.includes("anthropic.claude.sessions.read.v1") && node.invocableCommands.includes("agent.cli.claude.run.v1"),
			...claudeNodeTerminalCapability(node)
		};
		if (node.connected !== true) {
			const host = Object.assign({}, common, {
				sessions: [],
				error: {
					code: "NODE_OFFLINE",
					message: "Paired node is offline"
				}
			});
			params.onHost?.(host);
			return host;
		}
		const eventualHost = Promise.resolve().then(async () => {
			const raw = await params.runtime.nodes.invoke({
				nodeId: node.nodeId,
				command: CLAUDE_SESSIONS_LIST_COMMAND,
				params: {
					limit: query.limitPerHost,
					...query.search ? { searchTerm: query.search } : {},
					...query.cursors?.[hostId] !== void 0 ? { cursor: query.cursors[hostId] } : {}
				},
				timeoutMs: NODE_INVOKE_TIMEOUT_MS,
				scopes: ["operator.write"]
			});
			return Object.assign({}, common, parseCatalogPage(unwrapNodePayload(raw)));
		}).catch(() => Object.assign({}, common, {
			sessions: [],
			error: {
				code: "NODE_INVOKE_FAILED",
				message: "Paired node Claude sessions are unavailable"
			}
		}));
		if (params.onHost) eventualHost.then(params.onHost).catch(() => void 0);
		try {
			return await withTimeout(eventualHost, NODE_CATALOG_LIST_RESPONSE_TIMEOUT_MS, { message: "paired node Claude session catalog timed out" });
		} catch {
			return Object.assign({}, common, {
				sessions: [],
				error: {
					code: "NODE_INVOKE_FAILED",
					message: "Paired node Claude sessions are unavailable"
				}
			});
		}
	}));
	return { hosts: [...await Promise.all(localHosts), ...nodeHosts] };
}
async function readClaudeSessionTranscript(params) {
	const cursor = readOptionalCursor(params.cursor, "transcript");
	if (params.hostId === "gateway:local") {
		assertClaudeLocalAccess(params.hostId, params.allowProcessHomeFallback);
		return {
			hostId: params.hostId,
			label: "Local Claude",
			...await readLocalClaudeTranscriptPage({
				threadId: params.threadId,
				limit: params.limit,
				...cursor !== void 0 ? { cursor } : {}
			}, currentHomeDir(), gatewayClaudeScanOptions(params.allowProcessHomeFallback))
		};
	}
	if (!params.hostId.startsWith("node:")) throw new ClaudeCatalogParamsError("hostId is invalid");
	const nodeId = params.hostId.slice(5);
	const node = (await params.runtime.nodes.list()).nodes.find((candidate) => candidate.nodeId === nodeId && candidate.connected === true && candidate.commands?.includes("anthropic.claude.sessions.read.v1"));
	if (!node) throw new ClaudeCatalogParamsError("paired-node Claude session host is unavailable");
	const page = unwrapNodePayload(await params.runtime.nodes.invoke({
		nodeId,
		command: CLAUDE_SESSION_READ_COMMAND,
		params: {
			threadId: params.threadId,
			limit: params.limit,
			...cursor !== void 0 ? { cursor } : {}
		},
		timeoutMs: NODE_INVOKE_TIMEOUT_MS,
		scopes: ["operator.write"]
	}));
	if (!isRecord(page) || !Array.isArray(page.items) || page.items.length > MAX_TRANSCRIPT_LIMIT || page.items.some((item) => !isRecord(item) || typeof item.type !== "string") || page.threadId !== params.threadId || Buffer.byteLength(JSON.stringify(page), "utf8") > MAX_TRANSCRIPT_PAGE_BYTES) throw new Error("Claude node returned an invalid transcript page");
	const nextCursor = readNodePageCursor(page, "Claude node returned an invalid transcript page");
	return {
		hostId: params.hostId,
		label: resolveNodeLabel(node),
		threadId: params.threadId,
		items: page.items,
		...nextCursor !== void 0 ? { nextCursor } : {}
	};
}
function assertClaudeLocalAccess(hostId, allowProcessHomeFallback) {
	if (hostId === "gateway:local" && allowProcessHomeFallback === false && configuredClaudeConfigDir() === void 0) throw new ClaudeCatalogParamsError("local Claude sessions are unavailable in isolated state");
}
async function readBoundedClaudeHistory(params) {
	const items = [];
	let cursor;
	let bytes = 0;
	while (items.length < CLAUDE_HISTORY_IMPORT_MAX_ITEMS) {
		const page = await readClaudeSessionTranscript({
			runtime: params.runtime,
			hostId: params.hostId,
			threadId: params.threadId,
			limit: Math.min(MAX_TRANSCRIPT_LIMIT, CLAUDE_HISTORY_IMPORT_MAX_ITEMS - items.length),
			allowProcessHomeFallback: params.allowProcessHomeFallback,
			...cursor ? { cursor } : {}
		});
		for (const item of page.items) {
			const itemBytes = Buffer.byteLength(JSON.stringify(item), "utf8");
			if (items.length > 0 && bytes + itemBytes > CLAUDE_HISTORY_IMPORT_MAX_BYTES) return items;
			items.push(item);
			bytes += itemBytes;
		}
		if (!page.nextCursor || page.nextCursor === cursor) break;
		cursor = page.nextCursor;
	}
	return items;
}
async function resolveNodeClaudeRecord(params) {
	let cursor;
	for (let pageIndex = 0; pageIndex < 100; pageIndex += 1) {
		const page = parseCatalogPage(unwrapNodePayload(await params.runtime.nodes.invoke({
			nodeId: params.nodeId,
			command: CLAUDE_SESSIONS_LIST_COMMAND,
			params: {
				limit: MAX_PAGE_LIMIT,
				searchTerm: params.threadId,
				...cursor ? { cursor } : {}
			},
			timeoutMs: NODE_INVOKE_TIMEOUT_MS,
			scopes: ["operator.write"]
		})));
		const record = page.sessions.find((candidate) => candidate.threadId === params.threadId);
		if (record) return record;
		if (!page.nextCursor || page.nextCursor === cursor) break;
		cursor = page.nextCursor;
	}
	throw new ClaudeCatalogParamsError("Claude session is unavailable on the paired node");
}
async function continueClaudeSession(api, hostId, threadId, allowProcessHomeFallback) {
	const scanOptions = gatewayClaudeScanOptions(allowProcessHomeFallback);
	const sourceKey = adoptedSourceKey(hostId, threadId);
	const linkSession = async (sessionKey, history) => await linkContinued({
		sessionKey,
		hostId,
		threadId,
		...history ? { history } : {},
		listLocalSessions: () => listClaudeSessions(currentHomeDir(), scanOptions),
		readRemote: async () => (await readClaudeSessionTranscript({
			runtime: api.runtime,
			hostId,
			threadId,
			limit: 1,
			allowProcessHomeFallback
		})).items
	});
	const existing = listBoundClaudeSessions(api).get(sourceKey);
	if (existing) return await linkSession(existing);
	const pending = continueOperations.get(sourceKey);
	if (pending) return await pending;
	const operation = (async () => {
		let nodeId;
		let record;
		if (hostId === "gateway:local") {
			record = (await listClaudeSessions(currentHomeDir(), scanOptions)).find((candidate) => candidate.threadId === threadId);
			if (!record || !isResumableClaudeSource(record.source)) throw new ClaudeCatalogParamsError("only local Claude Code sessions can be continued");
		} else if (hostId.startsWith("node:")) {
			nodeId = hostId.slice(5);
			if (!(await api.runtime.nodes.list()).nodes.find((candidate) => candidate.nodeId === nodeId && candidate.connected === true && candidate.commands?.includes("anthropic.claude.sessions.list.v1") && candidate.commands.includes("anthropic.claude.sessions.read.v1") && candidate.commands.includes("agent.cli.claude.run.v1") && candidate.invocableCommands?.includes("anthropic.claude.sessions.list.v1") === true && candidate.invocableCommands.includes("anthropic.claude.sessions.read.v1") && candidate.invocableCommands.includes("agent.cli.claude.run.v1"))) throw new ClaudeCatalogParamsError("paired node does not permit Claude CLI session continuation");
			record = await resolveNodeClaudeRecord({
				runtime: api.runtime,
				nodeId,
				threadId
			});
			if (!record || record.source !== "claude-cli") throw new ClaudeCatalogParamsError("only Claude CLI sessions can be continued");
		} else throw new ClaudeCatalogParamsError("hostId is invalid");
		if (hostId === "gateway:local") {
			if (!(await fs.stat(record.filePath).catch(() => void 0))?.isFile()) throw new ClaudeCatalogParamsError("Claude session transcript is unavailable");
		}
		const history = await readBoundedClaudeHistory({
			runtime: api.runtime,
			hostId,
			threadId,
			allowProcessHomeFallback
		});
		const config = currentClaudeSessionCatalogConfig(api);
		const model = resolveClaudeCliRoutedModelId(config, resolveDefaultAgentId(config)) ?? CLAUDE_CLI_DEFAULT_MODEL_REF.slice(`claude-cli/`.length);
		const marker = {
			sourceThreadId: threadId,
			...hostId !== "gateway:local" ? { sourceHostId: hostId } : {}
		};
		try {
			const created = await api.runtime.agent.session.createSessionEntry({
				cfg: config,
				key: adoptedSessionKey(hostId, threadId),
				agentId: resolveDefaultAgentId(config),
				recoverMatchingInitialEntry: true,
				...record.name ? { label: record.name } : {},
				...record.cwd ? { spawnedCwd: record.cwd } : {},
				...nodeId ? {
					execNode: nodeId,
					...record.cwd ? { execCwd: record.cwd } : {}
				} : {},
				initialEntry: {
					cliBackendId: CLAUDE_CLI_BACKEND_ID,
					model,
					modelSelectionLocked: true,
					pluginOwnerId: api.id,
					cliSessionBinding: {
						sessionId: threadId,
						forceReuse: true,
						forkNextResume: true
					},
					pluginExtensions: { anthropic: { sessionCatalog: marker } }
				},
				afterCreate: async (entry) => {
					await importClaudeHistory({
						items: history,
						threadId,
						sessionId: entry.sessionId,
						sessionKey: entry.key,
						agentId: entry.agentId,
						storePath: api.runtime.agent.session.resolveStorePath(config.session?.store, { agentId: entry.agentId }),
						...record.cwd ? { cwd: record.cwd } : {},
						config
					});
					return { pluginExtensions: { anthropic: { sessionCatalog: marker } } };
				}
			});
			return await linkSession(created.key, history);
		} catch (error) {
			const raced = listBoundClaudeSessions(api).get(sourceKey);
			if (raced) return await linkSession(raced, history);
			throw error;
		}
	})();
	continueOperations.set(sourceKey, operation);
	try {
		return await operation;
	} finally {
		if (continueOperations.get(sourceKey) === operation) continueOperations.delete(sourceKey);
	}
}
function toGenericClaudeItem(item) {
	const type = (/* @__PURE__ */ new Set([
		"userMessage",
		"agentMessage",
		"reasoning",
		"toolCall",
		"toolResult",
		"other"
	])).has(item.type) ? item.type : "other";
	return {
		...item.uuid ? { id: item.uuid } : {},
		type,
		...item.text ? { text: item.text } : {},
		...item.timestamp ? { timestamp: item.timestamp } : {},
		...item.model ? { model: item.model } : {},
		...item.truncated ? { truncated: true } : {},
		...item.content !== void 0 ? { raw: item.content } : {}
	};
}
function toGenericClaudeHost(host, adopted, cliAvailable) {
	return {
		hostId: host.hostId,
		label: host.label,
		kind: host.kind,
		connected: host.connected,
		...host.nodeId ? { nodeId: host.nodeId } : {},
		sessions: host.sessions.map((session) => {
			const terminal = terminalEligibility(host, session.source, cliAvailable);
			const nodeCli = host.kind === "node" && host.canContinueClaude === true && session.source === "claude-cli";
			const existingSessionKey = adopted.get(adoptedSourceKey(host.hostId, session.threadId));
			const continuable = terminal.localResumable || nodeCli || Boolean(existingSessionKey);
			return {
				threadId: session.threadId,
				...session.name ? { name: session.name } : {},
				...session.cwd ? { cwd: session.cwd } : {},
				status: session.status,
				...session.createdAt !== void 0 ? { createdAt: session.createdAt } : {},
				...session.updatedAt !== void 0 ? { updatedAt: session.updatedAt } : {},
				...session.recencyAt != null ? { recencyAt: session.recencyAt } : {},
				source: session.source,
				modelProvider: session.modelProvider,
				...session.cliVersion ? { cliVersion: session.cliVersion } : {},
				...session.gitBranch ? { gitBranch: session.gitBranch } : {},
				...session.customGroup ? { customGroup: session.customGroup } : {},
				...session.pullRequest ? { pullRequest: session.pullRequest } : {},
				archived: session.archived,
				...continuable && existingSessionKey ? { sessionKey: existingSessionKey } : {},
				canContinue: continuable,
				canArchive: false,
				canOpenTerminal: terminal.canOpenTerminal
			};
		}),
		...host.nextCursor ? { nextCursor: host.nextCursor } : {},
		...host.error ? { error: host.error } : {}
	};
}
function createClaudeSessionCatalogRuntime(api) {
	return {
		list: async (query) => {
			const adopted = listBoundClaudeSessions(api, query.sessionEntries);
			const localCliAvailable = isClaudeCliAvailable();
			const { allowProcessHomeFallback, listNodes, onHost, sessionEntries: _sessionEntries, ...gatewayQuery } = query;
			const mapHost = (host) => toGenericClaudeHost(host, adopted, localCliAvailable);
			return (await listClaudeSessionCatalog({
				runtime: api.runtime,
				query: gatewayQuery,
				allowProcessHomeFallback,
				listNodes,
				...onHost ? { onHost: (host) => onHost(mapHost(host)) } : {}
			})).hosts.map(mapHost);
		},
		read: async (request) => {
			const { allowProcessHomeFallback, ...catalogRequest } = request;
			const page = await readClaudeSessionTranscript({
				runtime: api.runtime,
				hostId: catalogRequest.hostId,
				threadId: catalogRequest.threadId,
				cursor: catalogRequest.cursor,
				limit: catalogRequest.limit ?? DEFAULT_TRANSCRIPT_LIMIT,
				allowProcessHomeFallback
			});
			return {
				...page,
				items: page.items.map(toGenericClaudeItem)
			};
		},
		continueSession: async (request) => {
			assertClaudeLocalAccess(request.hostId, request.allowProcessHomeFallback);
			return await continueClaudeSession(api, request.hostId, request.threadId, request.allowProcessHomeFallback);
		},
		startTerminalSession: async (request) => {
			if (!request.nodeId) assertClaudeLocalAccess(CLAUDE_LOCAL_SESSION_HOST_ID, request.allowProcessHomeFallback);
			return await startClaudeCatalogTerminal(request);
		},
		openTerminal: async (request) => {
			assertClaudeLocalAccess(request.hostId, request.allowProcessHomeFallback);
			return await openClaudeCatalogTerminal({
				api,
				...request,
				listClaudeSessions: () => listClaudeSessions(currentHomeDir(), gatewayClaudeScanOptions(request.allowProcessHomeFallback)),
				resolveNodeClaudeRecord
			});
		},
		checkUpstreamActivity: async (probes, policy) => {
			const localAllowed = policy?.allowProcessHomeFallback !== false || configuredClaudeConfigDir() !== void 0;
			return await checkClaudeUpstreamActivity(probes.filter((probe) => probe.hostId !== "gateway:local" || localAllowed), async (probe) => {
				return (await readClaudeSessionTranscript({
					runtime: api.runtime,
					hostId: probe.hostId,
					threadId: probe.threadId,
					limit: MAX_TRANSCRIPT_LIMIT,
					allowProcessHomeFallback: policy?.allowProcessHomeFallback
				})).items;
			});
		}
	};
}
//#endregion
export { listLocalClaudeSessionPage as n, readLocalClaudeTranscriptPage as r, createClaudeSessionCatalogRuntime as t };
