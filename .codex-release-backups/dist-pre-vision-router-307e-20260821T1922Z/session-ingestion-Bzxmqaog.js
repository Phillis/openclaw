import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { t as appendRegularFile } from "./regular-file-CXw3t-8J.js";
import { f as parseUsageCountedSessionIdFromFileName } from "./artifacts-Cg2BoGvO.js";
import { y as formatMemoryDreamingDay } from "./dreaming-BMAUTQQQ.js";
import "./security-runtime-Bm9RUgAZ.js";
import "./memory-core-host-engine-foundation-DKNcJ3AR.js";
import { d as statSessionEntrySync, l as sessionPathForFile, t as buildSessionEntry } from "./memory-core-host-engine-sessions-BrEhWBmC.js";
import "./memory-core-host-status-DrMh3wbR.js";
import { a as DREAMING_SESSION_INGESTION_SEEN_NAMESPACE, i as DREAMING_SESSION_INGESTION_FILES_NAMESPACE, x as writeMemoryCoreWorkspaceEntries, y as readMemoryCoreWorkspaceEntries } from "./dreaming-state-DWEtHClN.js";
import { i as normalizeSessionIngestionState, t as SESSION_INGESTION_MAX_TRACKED_MESSAGES_PER_SESSION } from "./dreaming-ingestion-state-DRWrcALI.js";
import { createHash } from "node:crypto";
import path from "node:path";
import fs from "node:fs/promises";
//#region extensions/memory-core/src/session-ingestion.ts
const SESSION_CORPUS_RELATIVE_DIR = path.join("memory", ".dreams", "session-corpus");
const SESSION_INGESTION_SCORE = .58;
const SESSION_INGESTION_MIN_SNIPPET_CHARS = 12;
const SESSION_INGESTION_MAX_SNIPPET_CHARS = 280;
function buildSessionScope(agentId, sessionId) {
	return `${agentId}:${parseUsageCountedSessionIdFromFileName(sessionId) ?? parseUsageCountedSessionIdFromFileName(`${sessionId}.jsonl`) ?? sessionId}`;
}
function sessionPathFromCorpus(entry) {
	return entry.transcriptSource === "sqlite" ? path.join("sessions", entry.agentId, entry.sessionId).replace(/\\/g, "/") : sessionPathForFile(entry.sessionFile);
}
function sessionIngestionSourceFromCorpus(entry) {
	const sessionPath = sessionPathFromCorpus(entry);
	if (entry.sessionKind !== "interactive") return null;
	const scope = entry.transcriptSource === "sqlite" ? `${entry.agentId}:${sessionPath}` : buildSessionScope(entry.agentId, path.basename(entry.sessionFile));
	return {
		agentId: entry.agentId,
		absolutePath: entry.sessionFile,
		foreign: false,
		sessionPath,
		stateKey: `${entry.agentId}:${sessionPath}`,
		scope,
		...entry.transcriptSource === "sqlite" ? { legacyScope: buildSessionScope(entry.agentId, entry.sessionId) } : {},
		buildOptions: {
			sessionKind: "interactive",
			...entry.transcriptSource === "sqlite" ? {
				agentId: entry.agentId,
				sessionId: entry.sessionId
			} : {},
			...entry.sessionKey ? { sessionKey: entry.sessionKey } : {},
			...entry.storePath ? { storePath: entry.storePath } : {},
			...entry.updatedAtMs !== void 0 ? { updatedAtMs: entry.updatedAtMs } : {},
			...entry.generatedByDreamingNarrative ? { generatedByDreamingNarrative: true } : {},
			...entry.generatedByCronRun ? { generatedByCronRun: true } : {}
		}
	};
}
function sessionIngestionStateKeyFromCorpus(entry) {
	return `${entry.agentId}:${sessionPathFromCorpus(entry)}`;
}
function foreignSessionIngestionSource(agentId, archiveFile) {
	const absolutePath = path.resolve(archiveFile);
	const normalizedPath = absolutePath.replaceAll("\\", "/");
	return {
		agentId,
		absolutePath,
		foreign: true,
		sessionPath: sessionPathForFile(absolutePath),
		stateKey: `session-backfill:${normalizedPath}`,
		scope: `archive:${agentId}:${normalizedPath}`,
		buildOptions: { sessionKind: "interactive" }
	};
}
function normalizeSessionCorpusSnippet(value) {
	return truncateUtf16Safe(value.replace(/\s+/g, " ").trim(), SESSION_INGESTION_MAX_SNIPPET_CHARS);
}
function hashSessionMessageId(value) {
	return createHash("sha1").update(value).digest("hex");
}
async function statSessionSource(source) {
	if (source.buildOptions.agentId && source.buildOptions.storePath) try {
		const stat = statSessionEntrySync(source.absolutePath, source.buildOptions);
		return stat ? {
			mtimeMs: Math.floor(Math.max(0, stat.mtimeMs)),
			size: Math.floor(stat.size)
		} : null;
	} catch {
		return;
	}
	const stat = await fs.stat(source.absolutePath).catch((error) => {
		if (error.code === "ENOENT") return null;
		throw error;
	});
	return stat ? {
		mtimeMs: Math.floor(Math.max(0, stat.mtimeMs)),
		size: Math.floor(stat.size)
	} : null;
}
async function scanSessionIngestionSource(params) {
	const emptyScan = (status, fileState) => ({
		status,
		candidates: [],
		...fileState ? { fileState } : {},
		scannedEndIndex: fileState?.lastContentLine ?? 0
	});
	const fingerprint = await statSessionSource(params.source);
	if (fingerprint === null) return emptyScan("absent");
	if (!params.verifyContent && fingerprint && params.previous?.mtimeMs === fingerprint.mtimeMs && params.previous.size === fingerprint.size && params.previous.contentHash.length > 0 && params.previous.lastContentLine >= params.previous.lineCount) return emptyScan("unchanged", params.previous);
	const entry = await buildSessionEntry(params.source.absolutePath, params.source.buildOptions);
	if (!entry) return emptyScan("unavailable", params.previous);
	const fileFingerprint = {
		mtimeMs: Math.floor(Math.max(0, entry.mtimeMs)),
		size: Math.floor(Math.max(0, entry.size))
	};
	const lines = entry.content ? entry.content.split("\n") : [];
	const terminalState = {
		...fileFingerprint,
		contentHash: entry.hash.trim(),
		lineCount: lines.length,
		lastContentLine: lines.length
	};
	if (entry.generatedByDreamingNarrative || entry.generatedByCronRun) return emptyScan("excluded", terminalState);
	if (params.previous?.mtimeMs === fileFingerprint.mtimeMs && params.previous.size === fileFingerprint.size && params.previous.contentHash === terminalState.contentHash && params.previous.lineCount === lines.length && params.previous.lastContentLine >= lines.length) return emptyScan("unchanged", params.previous);
	const startIndex = params.previous?.mtimeMs === fileFingerprint.mtimeMs && params.previous.size === fileFingerprint.size && params.previous.contentHash === terminalState.contentHash && params.previous.lineCount === lines.length ? Math.max(0, Math.min(params.previous?.lastContentLine ?? 0, lines.length)) : 0;
	const seen = new Set(params.seenMessages[params.source.scope] ?? []);
	const legacySeen = params.source.legacyScope ? new Set(params.seenMessages[params.source.legacyScope] ?? []) : void 0;
	const candidates = [];
	let progressBlockIndex;
	let scannedEndIndex = startIndex;
	for (let index = startIndex; index < lines.length; index += 1) {
		if (params.maxCandidates !== void 0 && candidates.length >= params.maxCandidates) break;
		scannedEndIndex = index + 1;
		const snippet = normalizeSessionCorpusSnippet(lines[index] ?? "");
		if (snippet.length < SESSION_INGESTION_MIN_SNIPPET_CHARS) continue;
		const lineNumber = entry.lineMap[index] ?? index + 1;
		const timestampMs = entry.messageTimestampsMs[index] ?? 0;
		const parsedProvenance = entry.lineProvenance[index] ?? {
			originClass: "untrusted",
			sessionKind: "interactive",
			observedAt: timestampMs || entry.mtimeMs
		};
		const provenance = params.source.foreign ? {
			...parsedProvenance,
			originClass: "untrusted"
		} : parsedProvenance;
		if (params.acceptProvenance && !params.acceptProvenance(provenance)) continue;
		const day = formatMemoryDreamingDay(timestampMs || entry.mtimeMs, params.timezone);
		const disposition = params.classifyDay(day);
		if (disposition !== "include") {
			if (disposition === "block") progressBlockIndex ??= index;
			continue;
		}
		const basis = timestampMs > 0 ? `ts:${Math.floor(timestampMs)}` : `line:${lineNumber}`;
		const hash = hashSessionMessageId(`${params.source.scope}\n${basis}\n${snippet}`);
		const legacyHash = params.source.legacyScope ? hashSessionMessageId(`${params.source.legacyScope}\n${basis}\n${snippet}`) : void 0;
		if (seen.has(hash) || legacyHash && legacySeen?.has(legacyHash)) continue;
		candidates.push({
			contentIndex: index,
			day,
			hash,
			lineNumber,
			provenance,
			rendered: truncateUtf16Safe(`[${params.source.agentId}/${params.source.sessionPath}#L${lineNumber}] ${snippet}`, 344),
			scope: params.source.scope,
			stateKey: params.source.stateKey,
			snippet
		});
		seen.add(hash);
	}
	return {
		status: "scanned",
		candidates,
		fileState: {
			...terminalState,
			lastContentLine: scannedEndIndex
		},
		...progressBlockIndex !== void 0 ? { progressBlockIndex } : {},
		scannedEndIndex
	};
}
function mergeTrackedMessageHashes(existing, additions) {
	return [.../* @__PURE__ */ new Set([...existing, ...additions])].slice(-SESSION_INGESTION_MAX_TRACKED_MESSAGES_PER_SESSION);
}
function trimTrackedSessionScopes(seenMessages) {
	const keep = new Set(Object.keys(seenMessages).toSorted().slice(-2048));
	return Object.fromEntries(Object.entries(seenMessages).filter(([scope]) => keep.has(scope)));
}
async function readSessionIngestionState(workspaceDir) {
	const [files, seenChunks] = await Promise.all([readMemoryCoreWorkspaceEntries({
		namespace: DREAMING_SESSION_INGESTION_FILES_NAMESPACE,
		workspaceDir
	}), readMemoryCoreWorkspaceEntries({
		namespace: DREAMING_SESSION_INGESTION_SEEN_NAMESPACE,
		workspaceDir
	})]);
	const seenMessages = {};
	for (const { value } of seenChunks.toSorted((a, b) => a.value.index - b.value.index)) {
		if (!value.scope.trim()) continue;
		seenMessages[value.scope] = [...seenMessages[value.scope] ?? [], ...value.hashes];
	}
	return normalizeSessionIngestionState({
		version: 3,
		files: Object.fromEntries(files.map((entry) => [entry.key, entry.value])),
		seenMessages
	});
}
async function writeSessionIngestionState(workspaceDir, state) {
	const seenEntries = Object.entries(state.seenMessages).flatMap(([scope, hashes]) => Array.from({ length: Math.ceil(hashes.length / 512) }, (_, index) => ({
		key: `${scope}:${index}`,
		value: {
			scope,
			index,
			hashes: hashes.slice(index * 512, (index + 1) * 512)
		}
	})));
	await Promise.all([writeMemoryCoreWorkspaceEntries({
		namespace: DREAMING_SESSION_INGESTION_FILES_NAMESPACE,
		workspaceDir,
		entries: Object.entries(state.files).map(([key, value]) => ({
			key,
			value
		}))
	}), writeMemoryCoreWorkspaceEntries({
		namespace: DREAMING_SESSION_INGESTION_SEEN_NAMESPACE,
		workspaceDir,
		entries: seenEntries
	})]);
}
async function appendSessionCorpusLines(params) {
	if (params.lines.length === 0) return [];
	const relativePath = path.posix.join("memory", ".dreams", "session-corpus", `${params.day}.txt`);
	const absolutePath = path.join(params.workspaceDir, SESSION_CORPUS_RELATIVE_DIR, `${params.day}.txt`);
	await fs.mkdir(path.dirname(absolutePath), { recursive: true });
	const normalized = (await fs.readFile(absolutePath, "utf-8").catch((error) => {
		if (error.code === "ENOENT") return "";
		throw error;
	})).replace(/\r\n/g, "\n");
	const existingLines = normalized ? (normalized.endsWith("\n") ? normalized.slice(0, -1) : normalized).split("\n").length : 0;
	await appendRegularFile({
		filePath: absolutePath,
		content: `${params.lines.map((entry) => entry.rendered).join("\n")}\n`,
		rejectSymlinkParents: true
	});
	return params.lines.map((entry, index) => ({
		path: relativePath,
		startLine: existingLines + index + 1,
		endLine: existingLines + index + 1,
		score: SESSION_INGESTION_SCORE,
		snippet: entry.snippet,
		source: "memory",
		provenance: entry.provenance
	}));
}
//#endregion
export { mergeTrackedMessageHashes as a, sessionIngestionSourceFromCorpus as c, writeSessionIngestionState as d, foreignSessionIngestionSource as i, sessionIngestionStateKeyFromCorpus as l, SESSION_INGESTION_SCORE as n, readSessionIngestionState as o, appendSessionCorpusLines as r, scanSessionIngestionSource as s, SESSION_CORPUS_RELATIVE_DIR as t, trimTrackedSessionScopes as u };
