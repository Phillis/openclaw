import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { i as stripMemoryAnnotationCarriers } from "./curated-annotations-mTWgerpx.js";
import "./text-utility-runtime-LRU688AB.js";
import "./memory-core-host-engine-storage-BgooD0hf.js";
import { r as getActiveMemorySearchManager } from "./memory-host-search-Cusa86Hu.js";
import { n as buildPromptPrefix } from "./prompt-v7N3MFUz.js";
//#region extensions/active-memory/trigger-recall.ts
const TRIGGER_CANDIDATE_LIMIT = 24;
const TRIGGER_INJECTION_LIMIT = 3;
const MAX_TRIGGER_CONTEXT_CHARS = 1800;
const STRONG_TRIGGER_MATCH_SCORE = .65;
const WORD_RE = /[\p{L}\p{N}_]+/gu;
function normalizeWords(value) {
	return (value.toLowerCase().match(WORD_RE) ?? []).filter((word) => word.length > 1);
}
function splitTriggerPhrases(value) {
	return value.split(/[\n;|]+/u).map((phrase) => phrase.trim()).filter(Boolean);
}
function scoreTriggerPhrase(message, phrase) {
	const messageWords = normalizeWords(message);
	const triggerWords = [...new Set(normalizeWords(phrase))];
	if (triggerWords.length === 0) return 0;
	if (triggerWords.length === 1) return messageWords.includes(triggerWords[0] ?? "") ? .85 : 0;
	if (messageWords.some((_, start) => triggerWords.every((word, offset) => messageWords[start + offset] === word))) return 1;
	const messageWordSet = new Set(messageWords);
	const overlap = triggerWords.filter((word) => messageWordSet.has(word)).length;
	if (overlap === 0) return 0;
	return overlap / triggerWords.length * .8 + Math.min(1, overlap / 2) * .2;
}
function isPromotedTrustedMemoryEntry(entry, activeProjectKeys = []) {
	if (entry.projectKey) {
		const storedProjectKeys = [...new Set(entry.projectKey.split(";").map((key) => key.trim()).filter(Boolean))];
		if (storedProjectKeys.length === 0 || !storedProjectKeys.every((key) => activeProjectKeys.includes(key))) return false;
	}
	if (entry.originClass === "owner" || entry.originClass === "agent") return true;
	if (entry.source !== "memory") return false;
	const normalized = entry.path.replaceAll("\\", "/").replace(/^\.\//u, "").toUpperCase();
	return normalized === "MEMORY.MD" || normalized === "USER.MD";
}
function scoreTriggerMatch(message, entry) {
	if (!entry.triggers) return 0;
	const triggerScore = Math.max(0, ...splitTriggerPhrases(entry.triggers).map((phrase) => scoreTriggerPhrase(message, phrase)));
	const relevance = Math.max(0, Math.min(1, entry.score));
	return triggerScore * .8 + relevance * .2;
}
function selectStrongTriggerMatches(message, entries, activeProjectKeys = []) {
	return entries.filter((entry) => isPromotedTrustedMemoryEntry(entry, activeProjectKeys)).map((entry) => Object.assign({}, entry, { matchScore: scoreTriggerMatch(message, entry) })).filter((entry) => entry.matchScore >= STRONG_TRIGGER_MATCH_SCORE).toSorted((left, right) => right.matchScore - left.matchScore || left.path.localeCompare(right.path) || left.startLine - right.startLine).slice(0, TRIGGER_INJECTION_LIMIT);
}
function buildTriggerRecallContext(matches) {
	if (matches.length === 0) return;
	return buildPromptPrefix(truncateUtf16Safe(matches.map((entry) => `- ${stripMemoryAnnotationCarriers(entry.snippet).trim()} (Source: ${entry.path}#L${String(entry.startLine)})`).join("\n"), MAX_TRIGGER_CONTEXT_CHARS));
}
const triggerRecallPrewarms = /* @__PURE__ */ new Map();
async function loadTriggerRecallCandidates(params) {
	params.signal?.throwIfAborted();
	const activeProjectKeys = params.activeProjectKeys ?? [];
	const lookup = await waitForTriggerLookup(getActiveMemorySearchManager({
		cfg: params.cfg,
		agentId: params.agentId
	}), params.signal);
	if (!lookup.manager?.listTriggerCandidates) return [];
	const [retrieved, triggerCandidates] = await waitForTriggerLookup(Promise.all([lookup.manager.search(params.query, {
		maxResults: TRIGGER_CANDIDATE_LIMIT,
		minScore: 0,
		sources: ["memory"],
		signal: params.signal,
		lexicalOnly: true,
		activeProjectKeys: [...activeProjectKeys]
	}).catch(() => []), lookup.manager.listTriggerCandidates({ activeProjectKeys: [...activeProjectKeys] }).catch(() => [])]), params.signal);
	return [...new Map([...triggerCandidates, ...retrieved].map((entry) => [`${entry.source}:${entry.path}:${String(entry.startLine)}:${String(entry.endLine)}`, entry])).values()];
}
function resolveTriggerRecallCandidates(params) {
	const runId = params.runId?.trim();
	if (!runId) return loadTriggerRecallCandidates(params);
	const existing = triggerRecallPrewarms.get(runId);
	const activeProjectKeys = params.activeProjectKeys ?? [];
	if (existing && existing.cfg === params.cfg && existing.agentId === params.agentId && existing.query === params.query && existing.activeProjectKeys.length === activeProjectKeys.length && existing.activeProjectKeys.every((key, index) => key === activeProjectKeys[index])) return existing.promise;
	const entry = {
		activeProjectKeys: [...activeProjectKeys],
		agentId: params.agentId,
		cfg: params.cfg,
		promise: loadTriggerRecallCandidates(params),
		query: params.query
	};
	triggerRecallPrewarms.set(runId, entry);
	entry.promise.catch(() => {
		if (triggerRecallPrewarms.get(runId) === entry) triggerRecallPrewarms.delete(runId);
	});
	return entry.promise;
}
/** Open and exercise the exact local lookup path used by lane 1 before its deadline starts. */
async function prewarmTriggerRecall(params) {
	await resolveTriggerRecallCandidates(params);
}
async function resolveTriggerRecall(params) {
	params.signal?.throwIfAborted();
	const activeProjectKeys = params.activeProjectKeys ?? [];
	const candidates = await waitForTriggerLookup(resolveTriggerRecallCandidates(params), params.signal);
	const matches = selectStrongTriggerMatches(params.message, candidates, activeProjectKeys);
	const context = buildTriggerRecallContext(matches);
	return {
		...context ? { context } : {},
		hasStrongHit: matches.length > 0,
		injectedCount: matches.length
	};
}
function forgetTriggerRecallPrewarm(runId) {
	if (runId) triggerRecallPrewarms.delete(runId);
}
function resetTriggerRecallPrewarmsForTests() {
	triggerRecallPrewarms.clear();
}
function waitForTriggerLookup(work, signal) {
	if (!signal) return work;
	signal.throwIfAborted();
	return new Promise((resolve, reject) => {
		const onAbort = () => reject(signal.reason instanceof Error ? signal.reason : new Error("active-memory trigger recall aborted", { cause: signal.reason }));
		signal.addEventListener("abort", onAbort, { once: true });
		work.then((value) => {
			signal.removeEventListener("abort", onAbort);
			resolve(value);
		}, (error) => {
			signal.removeEventListener("abort", onAbort);
			reject(error instanceof Error ? error : new Error(String(error)));
		});
	});
}
//#endregion
export { isPromotedTrustedMemoryEntry as a, resolveTriggerRecall as c, forgetTriggerRecallPrewarm as i, scoreTriggerMatch as l, STRONG_TRIGGER_MATCH_SCORE as n, prewarmTriggerRecall as o, buildTriggerRecallContext as r, resetTriggerRecallPrewarmsForTests as s, MAX_TRIGGER_CONTEXT_CHARS as t, selectStrongTriggerMatches as u };
