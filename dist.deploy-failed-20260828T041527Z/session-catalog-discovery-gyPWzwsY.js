import { i as normalizeBoundedOptionalString } from "./string-coerce-CIXf7egm.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { d as asPositiveSafeInteger, v as parseDateFirstTimestampMs } from "./number-coercion-CLj0HTDM.js";
import "./number-runtime-Cy4drVnh.js";
import "./string-coerce-runtime-C8jKEm3h.js";
import { t as readClaudeDesktopCustomGroups } from "./claude-desktop-groups-We61sCgC.js";
import { a as desktopSessionStoreAvailable, c as mapConcurrent, d as readProjectsTreeSnapshot, f as safeSessionFileForScan, i as currentHomeDir, l as projectsDir, n as childDirectories, o as desktopSessionsDir, p as setBoundedCache, u as readJsonFile } from "./session-catalog-scan-Br4cebMu.js";
import { t as collectTranscriptText } from "./session-catalog-transcript-Bz8I3DB8.js";
import path from "node:path";
import fs from "node:fs/promises";
//#region extensions/anthropic/session-catalog-discovery.ts
const MAX_STRING_LENGTH = 4096;
const MAX_SESSION_PULL_REQUESTS = 20;
const MAX_CATALOG_DISCOVERY_FILES = 1e4;
const MAX_CATALOG_DISCOVERY_CACHE_ENTRIES = 2e4;
const MAX_CLAUDE_SESSION_SCAN_CACHE_ENTRIES = 8;
const CLAUDE_SESSION_SCAN_HARD_TTL_MS = 5 * 6e4;
const CLAUDE_PARTIAL_SCAN_TTL_MS = 15e3;
const CLAUDE_DESKTOP_SCAN_TTL_MS = 6e4;
const CLAUDE_METADATA_PREFIX_BYTES = 1024 * 1024;
const CLAUDE_METADATA_READ_CHUNK_BYTES = 16 * 1024;
const MAX_CATALOG_METADATA_SCAN_BYTES = 64 * 1024 * 1024;
const CLI_ENTRYPOINTS = /* @__PURE__ */ new Set(["cli", "sdk-cli"]);
const catalogDiscoveryCache = /* @__PURE__ */ new Map();
const claudeSessionScanCache = /* @__PURE__ */ new Map();
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
	const indexes = await mapConcurrent(context.projectDirectories, 32, async ({ directory, childNames }) => ({
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
	const safeFiles = await mapConcurrent(candidates, 32, async ({ directory, entry, sessionId }) => {
		if (entry.isSidechain === true) return;
		return await safeSessionFileForScan(context, normalizeBoundedOptionalString(entry.fullPath, 4096) ?? path.join(directory, `${sessionId}.jsonl`), sessionId);
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
	const safeFiles = await mapConcurrent(candidates, 32, async ({ directory, name, sessionId }) => records.has(sessionId) || sidechainIds.has(sessionId) ? void 0 : await safeSessionFileForScan(context, path.join(directory, name), sessionId));
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
			cwd: normalizeBoundedOptionalString(metadata.cwd, 4096) ?? normalizeBoundedOptionalString(metadata.originCwd, 4096) ?? existing?.cwd,
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
//#endregion
export { listClaudeSessions as n, parsePullRequestSummary as r, MAX_STRING_LENGTH as t };
