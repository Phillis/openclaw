import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-DnyL0lW9.js";
import "./temp-path-wP_7naJE.js";
import { h as listSessionTranscriptCorpusEntriesForAgent } from "./memory-core-host-engine-sessions-DvSeUqq9.js";
import { a as SESSION_BACKFILL_REWIND_NAMESPACE, m as deleteMemoryCoreWorkspaceEntry, x as writeMemoryCoreWorkspaceEntry, y as readMemoryCoreWorkspaceEntries } from "./dreaming-state-B0qd2W7q.js";
import { t as normalizeSessionBackfillSelection } from "./session-backfill-selection-CjIn4YJO.js";
import { o as withMemoryWorkspaceLock } from "./memory-workspace-lock-BGmos1BO.js";
import { i as removeBackfillDiaryEntries, o as writeBackfillDiaryEntries } from "./dreaming-narrative-DximNX4k.js";
import { t as previewGroundedRemMarkdown } from "./rem-evidence-BB-zqkMi.js";
import { l as readShortTermRecallEntries, r as removeGroundedShortTermCandidates, u as recordGroundedShortTermCandidates } from "./short-term-promotion-DRAdnxKa.js";
import { i as listMemorySessionTombstones } from "./memory-entry-origins-CdhL_OjM.js";
import { a as mergeTrackedMessageHashes, c as scanSessionIngestionSource, f as trimTrackedSessionScopes, i as foreignSessionIngestionSource, l as sessionExclusionReason, n as SESSION_INGESTION_SCORE, o as readSessionIngestionState, p as writeSessionIngestionState, r as appendSessionCorpusLines, s as resolveAdmissionPolicy, t as SESSION_CORPUS_RELATIVE_DIR, u as sessionIngestionSourceFromCorpus } from "./session-ingestion-DNwvB8PR.js";
import path from "node:path";
import fs from "node:fs/promises";
import { createHash } from "node:crypto";
//#region extensions/memory-core/src/session-backfill-lifecycle.ts
const SESSION_BACKFILL_BASELINE_KEY_PREFIX = "complete-baseline:";
async function recordSessionBackfillRewindBatch(params) {
	if (params.candidates.length === 0) return;
	const key = createHash("sha256").update(JSON.stringify(params.candidates)).digest("hex");
	await writeMemoryCoreWorkspaceEntry({
		namespace: SESSION_BACKFILL_REWIND_NAMESPACE,
		workspaceDir: params.workspaceDir,
		key,
		value: {
			version: 1,
			candidates: params.candidates
		}
	});
}
async function markSessionBackfillRewindBaseline(params) {
	await writeMemoryCoreWorkspaceEntry({
		namespace: SESSION_BACKFILL_REWIND_NAMESPACE,
		workspaceDir: params.workspaceDir,
		key: `${SESSION_BACKFILL_BASELINE_KEY_PREFIX}${params.agentId}`,
		value: {
			version: 1,
			complete: true,
			agentId: params.agentId
		}
	});
}
function isSessionBackfillRewindCandidate(value) {
	if (value === null || typeof value !== "object" || Array.isArray(value)) return false;
	const candidate = value;
	return Number.isInteger(candidate.contentIndex) && candidate.contentIndex >= 0 && typeof candidate.hash === "string" && candidate.hash.length > 0 && typeof candidate.scope === "string" && candidate.scope.length > 0 && typeof candidate.stateKey === "string" && candidate.stateKey.length > 0;
}
function isSessionBackfillRewindBatch(value) {
	return value.version === 1 && "candidates" in value && Array.isArray(value.candidates);
}
async function rewindSessionBackfillIngestionState(params) {
	const entries = await readMemoryCoreWorkspaceEntries({
		namespace: SESSION_BACKFILL_REWIND_NAMESPACE,
		workspaceDir: params.workspaceDir
	});
	const completeCoverage = entries.some((entry) => entry.key === `${SESSION_BACKFILL_BASELINE_KEY_PREFIX}${params.agentId}` && "complete" in entry.value && entry.value.agentId === params.agentId);
	const batchEntries = entries.filter((entry) => isSessionBackfillRewindBatch(entry.value));
	const candidates = batchEntries.flatMap((entry) => isSessionBackfillRewindBatch(entry.value) ? entry.value.candidates.filter(isSessionBackfillRewindCandidate) : []);
	if (candidates.length === 0) {
		await deleteSessionBackfillRewindBatches(params.workspaceDir, batchEntries);
		return {
			completeCoverage,
			rewoundCandidates: 0
		};
	}
	const state = await readSessionIngestionState(params.workspaceDir);
	const removedHashesByScope = /* @__PURE__ */ new Map();
	const rewindLineByStateKey = /* @__PURE__ */ new Map();
	for (const candidate of candidates) {
		const hashes = removedHashesByScope.get(candidate.scope) ?? /* @__PURE__ */ new Set();
		hashes.add(candidate.hash);
		removedHashesByScope.set(candidate.scope, hashes);
		rewindLineByStateKey.set(candidate.stateKey, Math.min(rewindLineByStateKey.get(candidate.stateKey) ?? candidate.contentIndex, candidate.contentIndex));
	}
	const seenMessages = { ...state.seenMessages };
	for (const [scope, removedHashes] of removedHashesByScope) {
		const remaining = (seenMessages[scope] ?? []).filter((hash) => !removedHashes.has(hash));
		if (remaining.length > 0) seenMessages[scope] = remaining;
		else delete seenMessages[scope];
	}
	const files = { ...state.files };
	for (const [stateKey, lastContentLine] of rewindLineByStateKey) {
		const current = files[stateKey];
		if (current) files[stateKey] = {
			...current,
			lastContentLine: Math.min(current.lastContentLine, lastContentLine)
		};
	}
	await writeSessionIngestionState(params.workspaceDir, {
		...state,
		files,
		seenMessages
	});
	await deleteSessionBackfillRewindBatches(params.workspaceDir, batchEntries);
	return {
		completeCoverage,
		rewoundCandidates: candidates.length
	};
}
async function deleteSessionBackfillRewindBatches(workspaceDir, entries) {
	await Promise.all(entries.map((entry) => deleteMemoryCoreWorkspaceEntry({
		namespace: SESSION_BACKFILL_REWIND_NAMESPACE,
		workspaceDir,
		key: entry.key
	})));
}
function belongsToAgentFileState(key, agentId) {
	return key.startsWith(`${agentId}:`);
}
function belongsToAgentSeenState(key, agentId) {
	if (!key.startsWith("archive:")) return key.startsWith(`${agentId}:`);
	const archiveAgentEnd = key.indexOf(":", 8);
	if (archiveAgentEnd === -1) return agentId === "archive";
	return key.slice(8, archiveAgentEnd) === agentId;
}
async function resetSessionBackfillIngestionState(params) {
	const state = await readSessionIngestionState(params.workspaceDir);
	await writeSessionIngestionState(params.workspaceDir, {
		...state,
		files: Object.fromEntries(Object.entries(state.files).filter(([key]) => !belongsToAgentFileState(key, params.agentId))),
		seenMessages: Object.fromEntries(Object.entries(state.seenMessages).filter(([key]) => !belongsToAgentSeenState(key, params.agentId)))
	});
}
async function drainSessionBackfill(params) {
	const batches = [];
	for (let batch = 1; batch <= params.maxBatches; batch += 1) {
		const execution = await params.executeBatch();
		batches.push(execution);
		if (!execution.continuation.hasMore) return aggregateSessionBackfillBatches(batches, params.topCandidateLimit);
		if (!execution.continuation.advanced) throw new Error(`Memory session-backfill stopped after ${batch} batches because the ingestion cursor did not advance.`);
	}
	throw new Error(`Memory session-backfill exceeded the ${params.maxBatches}-batch safety limit.`);
}
function aggregateSessionBackfillBatches(executions, topCandidateLimit) {
	const first = executions[0]?.result;
	if (!first) throw new Error("Memory session-backfill completed without executing a batch.");
	const days = /* @__PURE__ */ new Map();
	for (const execution of executions) for (const day of execution.result.days) {
		const current = days.get(day.day);
		days.set(day.day, {
			day: day.day,
			candidateCount: (current?.candidateCount ?? 0) + day.candidateCount,
			topCandidates: [...current?.topCandidates ?? [], ...day.topCandidates].slice(0, topCandidateLimit)
		});
	}
	return {
		...first,
		days: [...days.values()].toSorted((a, b) => a.day.localeCompare(b.day)),
		candidateCount: executions.reduce((sum, execution) => sum + execution.result.candidateCount, 0),
		stagedEntries: executions.reduce((sum, execution) => sum + execution.result.stagedEntries, 0),
		writtenDiaryEntries: executions.reduce((sum, execution) => sum + execution.result.writtenDiaryEntries, 0),
		replacedDiaryEntries: executions.reduce((sum, execution) => sum + execution.result.replacedDiaryEntries, 0),
		batchCount: executions.length,
		batches: executions.map((execution, index) => ({
			batch: index + 1,
			days: execution.result.days.length,
			candidates: execution.result.candidateCount,
			stagedEntries: execution.result.stagedEntries
		}))
	};
}
//#endregion
//#region extensions/memory-core/src/session-backfill.ts
const SESSION_BACKFILL_QUERY_PREFIX = "__dreaming_session_backfill__";
const TOP_CANDIDATE_LIMIT = 5;
const MAX_SESSION_BACKFILL_APPLY_BATCHES = 1e4;
async function listSessionBackfillSources(params) {
	const corpus = await listSessionTranscriptCorpusEntriesForAgent(params.agentId, { includeRetainedSqlite: true });
	const forgottenSessionIds = new Set(listMemorySessionTombstones({ agentId: params.agentId }).map((entry) => entry.sessionId));
	const sources = corpus.map(sessionIngestionSourceFromCorpus).filter((entry) => entry !== null && !entry.buildOptions.generatedByDreamingNarrative && !entry.buildOptions.generatedByCronRun && !sessionExclusionReason(entry, params.admissionPolicy, forgottenSessionIds));
	const canonicalPaths = new Set(sources.map((entry) => path.resolve(entry.absolutePath)));
	for (const archiveFile of params.archiveFiles) {
		const source = foreignSessionIngestionSource(params.agentId, archiveFile);
		if (!canonicalPaths.has(source.absolutePath)) {
			sources.push(source);
			canonicalPaths.add(source.absolutePath);
		}
	}
	return sources.toSorted((a, b) => a.sessionPath === b.sessionPath ? a.absolutePath.localeCompare(b.absolutePath) : a.sessionPath.localeCompare(b.sessionPath));
}
function compareSessionBackfillCandidates(a, b) {
	if (a.day !== b.day) return a.day.localeCompare(b.day);
	if (a.provenance.observedAt !== b.provenance.observedAt) return a.provenance.observedAt - b.provenance.observedAt;
	if (a.scope !== b.scope) return a.scope.localeCompare(b.scope);
	return a.lineNumber - b.lineNumber;
}
async function collectSessionBackfillCandidates(params) {
	const candidates = [];
	const scans = [];
	const perFileCap = Math.min(80, Math.max(12, Math.ceil(240 / Math.max(1, params.sources.length))));
	for (const source of params.sources) {
		const scan = await scanSessionIngestionSource({
			source,
			previous: params.files[source.stateKey],
			seenMessages: params.seenMessages,
			timezone: params.timezone,
			verifyContent: true,
			classifyDay: (day) => (params.from === void 0 || day >= params.from) && (params.to === void 0 || day <= params.to) ? "include" : "block",
			acceptProvenance: (provenance) => provenance.originClass === "owner" || provenance.originClass === "agent"
		});
		if (scan.status !== "scanned" || !scan.fileState) continue;
		candidates.push(...scan.candidates.toSorted(compareSessionBackfillCandidates).slice(0, perFileCap));
		scans.push({
			candidates: scan.candidates,
			contentHash: scan.fileState.contentHash,
			lineCount: scan.fileState.lineCount,
			mtimeMs: scan.fileState.mtimeMs,
			...scan.progressBlockIndex !== void 0 ? { progressBlockIndex: scan.progressBlockIndex } : {},
			scannedEndIndex: scan.scannedEndIndex,
			size: scan.fileState.size,
			stateKey: source.stateKey
		});
	}
	const selected = candidates.toSorted(compareSessionBackfillCandidates).slice(0, 240);
	const byDay = /* @__PURE__ */ new Map();
	for (const candidate of selected) {
		const bucket = byDay.get(candidate.day) ?? [];
		bucket.push(candidate);
		byDay.set(candidate.day, bucket);
	}
	return {
		byDay,
		scans
	};
}
function mergeSessionBackfillFileProgress(params) {
	const selectedHashes = new Set(params.selectedDays.flatMap((day) => day.candidates.map((candidate) => candidate.hash)));
	const files = { ...params.current };
	for (const scan of params.scans) {
		const firstUnselected = scan.candidates.find((candidate) => !selectedHashes.has(candidate.hash));
		const progressStops = [
			scan.scannedEndIndex,
			...firstUnselected ? [firstUnselected.contentIndex] : [],
			...scan.progressBlockIndex !== void 0 ? [scan.progressBlockIndex] : []
		];
		files[scan.stateKey] = {
			mtimeMs: scan.mtimeMs,
			size: scan.size,
			contentHash: scan.contentHash,
			lineCount: scan.lineCount,
			lastContentLine: Math.min(...progressStops)
		};
	}
	return files;
}
function summarizeDay(day, candidates) {
	return {
		day,
		candidateCount: candidates.length,
		topCandidates: candidates.slice(0, TOP_CANDIDATE_LIMIT).map((entry) => entry.snippet)
	};
}
function buildSummaryDiaryLines(day) {
	return [`Session backfill found ${day.candidateCount} trusted candidate${day.candidateCount === 1 ? "" : "s"}.`, ...day.topCandidates.map((candidate) => `- ${candidate}`)];
}
function groundedMarkdownToDiaryLines(markdown) {
	return markdown.split(/\r?\n/).map((line) => line.replace(/^##\s+/, "").trimEnd()).filter((line, index, lines) => !(line.length === 0 && lines[index - 1]?.length === 0));
}
async function buildRemDiaryEntries(params) {
	const scratchDir = await fs.mkdtemp(path.join(resolvePreferredOpenClawTmpDir(), "openclaw-session-backfill-"));
	try {
		const entries = [];
		for (const day of params.days) {
			const results = await appendSessionCorpusLines({
				workspaceDir: scratchDir,
				day: day.day,
				lines: day.candidates
			});
			if (results.length === 0) continue;
			const corpusPath = path.join(scratchDir, SESSION_CORPUS_RELATIVE_DIR, `${day.day}.txt`);
			const inputPath = path.join(scratchDir, "memory", `${day.day}.md`);
			const corpus = await fs.readFile(corpusPath, "utf-8");
			await fs.writeFile(inputPath, `## Session transcript\n\n${corpus}`);
			const file = (await previewGroundedRemMarkdown({
				workspaceDir: scratchDir,
				inputPaths: [inputPath]
			})).files.at(0);
			const hasGroundedContent = Boolean(file && (file.facts.length > 0 || file.reflections.length > 0 || file.memoryImplications.length > 0 || file.candidates.length > 0));
			entries.push({
				isoDay: day.day,
				sourcePath: results[0]?.path ?? `memory/.dreams/session-corpus/${day.day}.txt`,
				bodyLines: hasGroundedContent && file ? groundedMarkdownToDiaryLines(file.renderedMarkdown) : buildSummaryDiaryLines(summarizeDay(day.day, day.candidates))
			});
		}
		return entries;
	} finally {
		await fs.rm(scratchDir, {
			recursive: true,
			force: true
		});
	}
}
function coalesceBackfillClaims(results) {
	const claims = /* @__PURE__ */ new Map();
	return results.flatMap((result) => {
		const snippet = result.snippet.replace(/^(?:Assistant|User):\s*/i, "").trim();
		const key = snippet.replace(/\s+/g, " ").toLowerCase();
		if (!key) return [];
		const claim = claims.get(key) ?? {
			path: result.path,
			startLine: result.startLine,
			endLine: result.endLine,
			snippet
		};
		claims.set(key, claim);
		return [{
			...result,
			...claim
		}];
	});
}
async function applySessionBackfillDays(params) {
	const before = await readShortTermRecallEntries({
		workspaceDir: params.workspaceDir,
		nowMs: params.nowMs
	});
	for (const day of params.days) {
		const grounded = coalesceBackfillClaims(await appendSessionCorpusLines({
			workspaceDir: params.workspaceDir,
			day: day.day,
			lines: day.candidates
		}));
		if (grounded.length === 0) continue;
		await recordGroundedShortTermCandidates({
			workspaceDir: params.workspaceDir,
			query: `${SESSION_BACKFILL_QUERY_PREFIX}:${day.day}`,
			items: grounded.map((result) => ({
				path: result.path,
				startLine: result.startLine,
				endLine: result.endLine,
				snippet: result.snippet,
				score: SESSION_INGESTION_SCORE,
				dayBucket: day.day,
				provenance: result.provenance,
				sessionOrigin: result.sessionOrigin
			})),
			dedupeByQueryPerDay: true,
			nowMs: params.nowMs,
			...params.timezone !== void 0 ? { timezone: params.timezone } : {}
		});
	}
	const after = await readShortTermRecallEntries({
		workspaceDir: params.workspaceDir,
		nowMs: params.nowMs
	});
	return Math.max(0, after.length - before.length);
}
async function executeSessionBackfillCore(params) {
	const workspaceDir = params.workspaceDir.trim();
	if (!workspaceDir) throw new Error("Memory session-backfill requires a resolvable workspace directory.");
	if (params.rem && params.apply) throw new Error("Memory session-backfill --rem cannot be combined with --apply.");
	const execute = () => executeSessionBackfillBatchCore({
		...params,
		workspaceDir
	});
	return params.apply || params.rem || params.rollback ? withMemoryWorkspaceLock(workspaceDir, execute) : execute();
}
async function executeSessionBackfillBatchCore(params) {
	const workspaceDir = params.workspaceDir;
	const nowMs = Number.isFinite(params.nowMs) ? params.nowMs : Date.now();
	if (params.rollback) {
		const [diary, staged] = await Promise.all([removeBackfillDiaryEntries({ workspaceDir }), removeGroundedShortTermCandidates({ workspaceDir })]);
		if (!(await rewindSessionBackfillIngestionState({
			workspaceDir,
			agentId: params.agentId
		})).completeCoverage && (diary.removed > 0 || staged.removed > 0)) await resetSessionBackfillIngestionState({
			workspaceDir,
			agentId: params.agentId
		});
		await markSessionBackfillRewindBaseline({
			workspaceDir,
			agentId: params.agentId
		});
		return {
			result: {
				agentId: params.agentId,
				workspaceDir,
				applied: false,
				rem: false,
				days: [],
				candidateCount: 0,
				stagedEntries: 0,
				writtenDiaryEntries: 0,
				replacedDiaryEntries: 0,
				rollback: {
					removedDiaryEntries: diary.removed,
					removedStagedEntries: staged.removed
				}
			},
			continuation: {
				advanced: false,
				hasMore: false
			}
		};
	}
	const { from, to, limitDays } = normalizeSessionBackfillSelection(params);
	const state = await readSessionIngestionState(workspaceDir);
	const collected = await collectSessionBackfillCandidates({
		sources: await listSessionBackfillSources({
			agentId: params.agentId,
			archiveFiles: params.archiveFiles ?? [],
			admissionPolicy: resolveAdmissionPolicy(params.pluginConfig)
		}),
		files: state.files,
		seenMessages: state.seenMessages,
		...from !== void 0 ? { from } : {},
		...to !== void 0 ? { to } : {},
		...params.timezone !== void 0 ? { timezone: params.timezone } : {}
	});
	const selectedDays = [...collected.byDay.keys()].toSorted().slice(0, limitDays).map((day) => ({
		day,
		candidates: collected.byDay.get(day) ?? []
	}));
	const days = selectedDays.map((entry) => summarizeDay(entry.day, entry.candidates));
	const candidateCount = days.reduce((sum, day) => sum + day.candidateCount, 0);
	const selectedHashes = new Set(selectedDays.flatMap((day) => day.candidates.map((candidate) => candidate.hash)));
	const continuation = {
		advanced: Boolean(params.apply) && candidateCount > 0,
		hasMore: collected.scans.some((scan) => scan.candidates.some((candidate) => !selectedHashes.has(candidate.hash)))
	};
	let writtenDiaryEntries = 0;
	let replacedDiaryEntries = 0;
	let stagedEntries = 0;
	if (selectedDays.length > 0 && (params.rem || params.apply)) {
		const diary = await writeBackfillDiaryEntries({
			workspaceDir,
			entries: params.rem ? await buildRemDiaryEntries({ days: selectedDays }) : selectedDays.map((entry) => ({
				isoDay: entry.day,
				sourcePath: `memory/.dreams/session-corpus/${entry.day}.txt`,
				bodyLines: buildSummaryDiaryLines(summarizeDay(entry.day, entry.candidates))
			})),
			preserveExisting: true,
			...params.timezone !== void 0 ? { timezone: params.timezone } : {}
		});
		writtenDiaryEntries = diary.written;
		replacedDiaryEntries = diary.replaced;
	}
	if (params.apply) {
		await recordSessionBackfillRewindBatch({
			workspaceDir,
			candidates: selectedDays.flatMap((day) => day.candidates.map((candidate) => ({
				contentIndex: candidate.contentIndex,
				hash: candidate.hash,
				scope: candidate.scope,
				stateKey: candidate.stateKey
			})))
		});
		if (selectedDays.length > 0) stagedEntries = await applySessionBackfillDays({
			workspaceDir,
			days: selectedDays,
			nowMs,
			...params.timezone !== void 0 ? { timezone: params.timezone } : {}
		});
		const nextSeenMessages = { ...state.seenMessages };
		for (const { candidates } of selectedDays) {
			const hashesByScope = /* @__PURE__ */ new Map();
			for (const candidate of candidates) {
				const hashes = hashesByScope.get(candidate.scope) ?? [];
				hashes.push(candidate.hash);
				hashesByScope.set(candidate.scope, hashes);
			}
			for (const [scope, hashes] of hashesByScope) nextSeenMessages[scope] = mergeTrackedMessageHashes(nextSeenMessages[scope] ?? [], hashes);
		}
		await writeSessionIngestionState(workspaceDir, {
			...state,
			files: mergeSessionBackfillFileProgress({
				current: state.files,
				scans: collected.scans,
				selectedDays
			}),
			seenMessages: trimTrackedSessionScopes(nextSeenMessages)
		});
	}
	return {
		result: {
			agentId: params.agentId,
			workspaceDir,
			applied: Boolean(params.apply),
			rem: Boolean(params.rem),
			days,
			candidateCount,
			stagedEntries,
			writtenDiaryEntries,
			replacedDiaryEntries
		},
		continuation
	};
}
async function executeSessionBackfill(params) {
	return (await executeSessionBackfillCore(params)).result;
}
async function runSessionBackfill(params) {
	if (!params.apply || params.rollback) return (await executeSessionBackfillCore(params)).result;
	return await drainSessionBackfill({
		executeBatch: () => executeSessionBackfillCore(params),
		maxBatches: MAX_SESSION_BACKFILL_APPLY_BATCHES,
		topCandidateLimit: TOP_CANDIDATE_LIMIT
	});
}
async function executeSessionBackfillBatch(params) {
	return await executeSessionBackfillCore(params);
}
//#endregion
export { executeSessionBackfillBatch as n, runSessionBackfill as r, executeSessionBackfill as t };
