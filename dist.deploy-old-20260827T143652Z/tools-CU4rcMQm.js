import { r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { r as asNullableRecord } from "./record-coerce-DItp3I4t.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { g as resolveSessionAgentIds } from "./agent-scope-BizOtGGz.js";
import { c as parseAgentSessionKey } from "./session-key-utils-D8x_bjrd.js";
import { C as resolveMemoryDreamingPluginConfig, S as resolveMemoryDreamingConfig, x as resolveMemoryDeepDreamingConfig } from "./dreaming-BMAUTQQQ.js";
import { _ as readToolStringParam, p as readPositiveIntegerParam, r as asToolParamsRecord, u as readFiniteNumberParam } from "./common-BGOZLJ2_.js";
import { t as jsonResult } from "./tool-results-BCM3fdVS.js";
import { r as optionalFiniteNumberSchema, s as stringEnum } from "./typebox-BXRXV_Ve.js";
import { c as listMemoryCorpusSupplements } from "./memory-state-DhEOmKyi.js";
import { t as resolveMemorySearchConfig } from "./memory-search-DG7CB6wz.js";
import { i as stripMemoryAnnotationCarriers } from "./curated-annotations-mTWgerpx.js";
import { t as resolveMemorySearchStaleness } from "./types-Dpy5yVLQ.js";
import "./error-runtime-CmlvK1A3.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import "./channel-actions-CeWsyukw.js";
import "./memory-core-host-engine-storage-BgooD0hf.js";
import "./memory-core-host-status-DrMh3wbR.js";
import "./memory-core-host-runtime-core-CChiMOSh.js";
import { d as recordShortTermRecalls } from "./short-term-promotion-BjqkJVMc.js";
import { t as filterMemorySearchHitsBySessionVisibility } from "./session-search-visibility-OTWJUhJ3.js";
import { Type } from "typebox";
//#region extensions/memory-core/src/memory/search-deadline.ts
const DEFAULT_MEMORY_SEARCH_TIMEOUT_MS = 15e3;
function resolveMemorySearchAbortError(signal) {
	const { reason } = signal;
	if (reason instanceof Error) return reason;
	return new Error(typeof reason === "string" ? reason : "memory search aborted");
}
function createMemorySearchTimeoutError(timeoutMs) {
	return /* @__PURE__ */ new Error(`memory_search timed out after ${Math.round(timeoutMs / 1e3)}s`);
}
async function runMemorySearchWithDeadline(params) {
	if (params.parentSignal?.aborted) throw resolveMemorySearchAbortError(params.parentSignal);
	const controller = new AbortController();
	const timeoutError = createMemorySearchTimeoutError(params.timeoutMs);
	const timeoutOutcome = { type: "timeout" };
	const parentAbortOutcome = { type: "parent-abort" };
	let timer;
	const deadlineStartedAt = Date.now();
	let removeParentAbort;
	let resolveTimeout;
	const timeoutPromise = new Promise((resolve) => {
		resolveTimeout = resolve;
	});
	const reachDefaultDeadline = () => {
		resolveTimeout(timeoutOutcome);
		controller.abort(timeoutError);
	};
	timer = setTimeout(() => {
		timer = void 0;
		reachDefaultDeadline();
	}, params.timeoutMs);
	timer.unref?.();
	const parentSignal = params.parentSignal;
	const parentAbortPromise = parentSignal ? new Promise((resolve) => {
		const onAbort = () => {
			resolve(parentAbortOutcome);
			controller.abort(resolveMemorySearchAbortError(parentSignal));
		};
		parentSignal.addEventListener("abort", onAbort, { once: true });
		removeParentAbort = () => parentSignal.removeEventListener("abort", onAbort);
	}) : void 0;
	const task = Promise.resolve().then(() => params.run(controller.signal));
	task.catch(() => void 0);
	try {
		const result = await Promise.race(parentAbortPromise ? [
			task,
			timeoutPromise,
			parentAbortPromise
		] : [task, timeoutPromise]);
		if (result === parentAbortOutcome) throw resolveMemorySearchAbortError(parentSignal);
		if (result === timeoutOutcome) throw timeoutError;
		if (parentSignal?.aborted) throw resolveMemorySearchAbortError(parentSignal);
		if (timer !== void 0 && Date.now() - deadlineStartedAt >= params.timeoutMs) {
			reachDefaultDeadline();
			throw timeoutError;
		}
		return result;
	} finally {
		if (timer) clearTimeout(timer);
		removeParentAbort?.();
	}
}
//#endregion
//#region extensions/memory-core/src/tools.citations.ts
function resolveMemoryCitationsMode(cfg) {
	const mode = cfg.memory?.citations;
	if (mode === "on" || mode === "off" || mode === "auto") return mode;
	return "auto";
}
function decorateCitations(results, include) {
	if (!include) return results.map((entry) => ({
		...entry,
		citation: void 0
	}));
	return results.map((entry) => {
		const citation = formatCitation(entry);
		const snippet = `${entry.snippet.trim()}\n\nSource: ${citation}`;
		return {
			...entry,
			citation,
			snippet
		};
	});
}
function formatCitation(entry) {
	const lineRange = entry.startLine === entry.endLine ? `#L${entry.startLine}` : `#L${entry.startLine}-L${entry.endLine}`;
	return `${entry.path}${lineRange}`;
}
function shouldIncludeCitations(params) {
	if (params.mode === "on") return true;
	if (params.mode === "off") return false;
	return deriveChatTypeFromSessionKey(params.sessionKey) === "direct";
}
function deriveChatTypeFromSessionKey(sessionKey) {
	const parsed = parseAgentSessionKey(sessionKey);
	if (!parsed?.rest) return "direct";
	const tokens = new Set(normalizeLowercaseStringOrEmpty(parsed.rest).split(":").filter(Boolean));
	if (tokens.has("channel")) return "channel";
	if (tokens.has("group")) return "group";
	return "direct";
}
//#endregion
//#region extensions/memory-core/src/tools.shared.ts
const loadMemoryToolRuntime = createLazyRuntimeModule(() => import("./tools.runtime.js"));
const MemorySearchSchema = Type.Object({
	query: Type.String(),
	maxResults: Type.Optional(Type.Integer({ minimum: 1 })),
	minScore: optionalFiniteNumberSchema(),
	corpus: Type.Optional(stringEnum([
		"memory",
		"wiki",
		"all",
		"sessions"
	]))
});
const MemoryGetSchema = Type.Object({
	path: Type.String(),
	from: Type.Optional(Type.Integer()),
	lines: Type.Optional(Type.Integer()),
	corpus: Type.Optional(stringEnum([
		"memory",
		"wiki",
		"all"
	]))
});
function resolveMemoryToolContext(options) {
	const cfg = options.getConfig?.() ?? options.config;
	if (!cfg) return null;
	const { sessionAgentId: agentId } = resolveSessionAgentIds({
		sessionKey: options.agentSessionKey,
		config: cfg,
		agentId: options.agentId
	});
	if (!resolveMemorySearchConfig(cfg, agentId)) return null;
	return {
		cfg,
		agentId
	};
}
async function getMemoryManagerContextWithPurpose(params) {
	const { getMemorySearchManager } = await loadMemoryToolRuntime();
	const startedAt = Date.now();
	const { manager, debug, error } = await getMemorySearchManager({
		cfg: params.cfg,
		agentId: params.agentId,
		purpose: params.purpose,
		...params.acquireLocalService ? { acquireLocalService: params.acquireLocalService } : {}
	});
	return manager ? {
		manager,
		debug: {
			backend: debug?.backend ?? "builtin",
			purpose: debug?.purpose ?? params.purpose ?? "default",
			managerMs: debug?.managerMs ?? Math.max(0, Date.now() - startedAt)
		}
	} : { error };
}
function createMemoryTool(params) {
	const ctx = resolveMemoryToolContext(params.options);
	if (!ctx) return null;
	return {
		label: params.label,
		name: params.name,
		description: params.description,
		parameters: params.parameters,
		execute: async (toolCallId, toolParams, signal, onUpdate) => {
			const latestCtx = resolveMemoryToolContext(params.options) ?? ctx;
			return await params.execute(latestCtx)(toolCallId, toolParams, signal, onUpdate);
		}
	};
}
function buildMemorySearchUnavailableResult(error, overrides) {
	const reason = (error ?? "memory search unavailable").trim() || "memory search unavailable";
	const normalizedReason = normalizeLowercaseStringOrEmpty(reason);
	const isQuotaError = /insufficient_quota|quota|429/.test(normalizedReason);
	const isMissingNodeSqlite = /missing node:sqlite|no such built-?in module: node:sqlite/.test(normalizedReason);
	const warning = overrides?.warning ?? (isQuotaError ? "Memory search is unavailable because the embedding provider quota is exhausted." : isMissingNodeSqlite ? "Memory search is unavailable because this OpenClaw Node runtime does not provide SQLite support." : "Memory search is unavailable due to an embedding/provider error.");
	const action = overrides?.action ?? (isQuotaError ? "Top up or switch embedding provider, then retry memory_search." : isMissingNodeSqlite ? "Run OpenClaw with a Node runtime that includes node:sqlite, then retry memory_search." : "Check embedding provider configuration and retry memory_search.");
	return {
		results: [],
		disabled: true,
		unavailable: true,
		error: reason,
		warning,
		action,
		debug: {
			warning,
			action,
			error: reason
		}
	};
}
async function searchMemoryCorpusSupplements(params) {
	if (params.corpus === "memory" || params.corpus === "sessions") return [];
	const supplements = listMemoryCorpusSupplements();
	if (supplements.length === 0) return [];
	return (await Promise.all(supplements.map(async (registration) => await registration.supplement.search(params)))).flat().toSorted((left, right) => {
		if (left.score !== right.score) return right.score - left.score;
		return left.path.localeCompare(right.path);
	}).slice(0, Math.max(1, params.maxResults ?? 10));
}
async function getMemoryCorpusSupplementResult(params) {
	if (params.corpus === "memory" || params.corpus === "sessions") return null;
	for (const registration of listMemoryCorpusSupplements()) {
		const result = await registration.supplement.get(params);
		if (result) return result;
	}
	return null;
}
//#endregion
//#region extensions/memory-core/src/tools.ts
const MEMORY_SEARCH_TOOL_COOLDOWN_MS = 6e4;
const memorySearchToolCooldowns = /* @__PURE__ */ new Map();
/**
* Validate the model-authored corpus argument against the tool's closed enum.
* Provider tool schemas do not guarantee enum enforcement; an unknown corpus
* must fail closed instead of falling through to an unrestricted search that
* could surface recall-only indexed transcripts.
*/
function readCorpusParam(rawParams, allowed) {
	const raw = readToolStringParam(rawParams, "corpus");
	if (raw === void 0) return;
	if (allowed.includes(raw)) return raw;
	throw new Error(`corpus must be one of: ${allowed.join(", ")}`);
}
function mergeEmbeddingBootstrapRuntimeDebug(entries) {
	let merged;
	for (const entry of entries) if (entry.embeddingBootstrap) merged = entry.embeddingBootstrap;
	return merged;
}
function resolveMemorySearchToolCooldownKey(options) {
	return options.agentId ?? options.agentSessionKey ?? "default";
}
function readMemorySearchToolCooldown(key) {
	const entry = memorySearchToolCooldowns.get(key);
	if (!entry) return;
	if (entry.until <= Date.now()) {
		memorySearchToolCooldowns.delete(key);
		return;
	}
	return { error: entry.error };
}
function recordMemorySearchToolCooldown(key, error) {
	memorySearchToolCooldowns.set(key, {
		until: Date.now() + MEMORY_SEARCH_TOOL_COOLDOWN_MS,
		error
	});
}
const testing = { resetMemorySearchToolCooldowns() {
	memorySearchToolCooldowns.clear();
} };
function isActiveMemoryManagerContext(context) {
	return context !== null && "manager" in context;
}
async function closeMemoryManagers(managers, parentSignal) {
	const pending = Array.from(managers, async (manager) => await manager.close?.());
	if (pending.length === 0) return;
	try {
		await runMemorySearchWithDeadline({
			timeoutMs: DEFAULT_MEMORY_SEARCH_TIMEOUT_MS,
			parentSignal,
			run: async () => {
				await Promise.allSettled(pending);
			}
		});
	} catch {}
}
const PAUSED_MEMORY_INDEX_WARNING = "Tell the user: memory search is paused because the memory index was built with a different embedding provider/model/settings.";
const PAUSED_MEMORY_INDEX_ACTION = "Tell the user to run: openclaw memory status --index or openclaw memory index --force.";
function resolvePausedMemoryIndexIdentityReason(status) {
	const indexIdentity = asNullableRecord(asNullableRecord(status.custom)?.indexIdentity);
	if (indexIdentity?.status !== "mismatched" && indexIdentity?.status !== "missing") return;
	return typeof indexIdentity.reason === "string" && indexIdentity.reason.trim() ? indexIdentity.reason.trim() : "memory index identity is missing or mismatched";
}
function buildPausedMemoryIndexUnavailableResult(reason) {
	return buildMemorySearchUnavailableResult(reason, {
		warning: PAUSED_MEMORY_INDEX_WARNING,
		action: PAUSED_MEMORY_INDEX_ACTION
	});
}
function mergeRankedMemorySearchToolStreams(memoryResults, supplementResults) {
	const merged = [];
	let memoryIndex = 0;
	let supplementIndex = 0;
	while (memoryIndex < memoryResults.length && supplementIndex < supplementResults.length) {
		const memory = memoryResults[memoryIndex];
		const supplement = supplementResults[supplementIndex];
		if ((memory?.score ?? 0) >= (supplement?.score ?? 0)) {
			if (memory) merged.push(memory);
			memoryIndex += 1;
		} else {
			if (supplement) merged.push(supplement);
			supplementIndex += 1;
		}
	}
	merged.push(...memoryResults.slice(memoryIndex), ...supplementResults.slice(supplementIndex));
	return merged;
}
function mergeMemorySearchCorpusResults(params) {
	const memoryResults = params.memoryResults;
	const supplementResults = params.supplementResults;
	if (!params.balanceCorpora || memoryResults.length === 0 || supplementResults.length === 0) return mergeRankedMemorySearchToolStreams(memoryResults, supplementResults).slice(0, params.maxResults);
	const perCorpusCap = Math.ceil(params.maxResults / 2);
	let memoryTake = Math.min(perCorpusCap, memoryResults.length);
	let supplementTake = Math.min(perCorpusCap, supplementResults.length);
	while (memoryTake + supplementTake < params.maxResults) {
		const memory = memoryResults[memoryTake];
		const supplement = supplementResults[supplementTake];
		if (!memory && !supplement) break;
		if (!supplement || memory && memory.score >= supplement.score) memoryTake += 1;
		else supplementTake += 1;
	}
	return mergeRankedMemorySearchToolStreams(memoryResults.slice(0, memoryTake), supplementResults.slice(0, supplementTake)).slice(0, params.maxResults);
}
function isClosedMemoryStoreError(error) {
	const message = formatErrorMessage(error).toLowerCase();
	return message.includes("database is not open") || message.includes("database connection is not open") || message.includes("database handle is closed") || message.includes("memory search manager is closed");
}
function buildRecallKey(result) {
	return `${result.source}:${result.path}:${result.startLine}:${result.endLine}`;
}
function resolveRecallTrackingResults(rawResults, surfacedResults) {
	if (surfacedResults.length === 0 || rawResults.length === 0) return surfacedResults;
	const rawByKey = /* @__PURE__ */ new Map();
	for (const raw of rawResults) {
		const key = buildRecallKey(raw);
		if (!rawByKey.has(key)) rawByKey.set(key, raw);
	}
	return surfacedResults.map((surfaced) => rawByKey.get(buildRecallKey(surfaced)) ?? surfaced);
}
function queueShortTermRecallTracking(params) {
	const trackingResults = resolveRecallTrackingResults(params.rawResults, params.surfacedResults);
	recordShortTermRecalls({
		workspaceDir: params.workspaceDir,
		query: params.query,
		results: trackingResults,
		timezone: params.timezone
	}).catch(() => {});
}
async function getSupplementMemoryReadResult(params) {
	const supplement = await getMemoryCorpusSupplementResult({
		lookup: params.relPath,
		fromLine: params.from,
		lineCount: params.lines,
		agentId: params.agentId,
		agentSessionKey: params.agentSessionKey,
		sandboxed: params.sandboxed,
		corpus: params.corpus
	});
	if (!supplement) return null;
	const { content, ...rest } = supplement;
	return {
		...rest,
		text: content
	};
}
async function resolveMemoryReadFailureResult(params) {
	if (params.requestedCorpus === "all") try {
		const supplement = await getSupplementMemoryReadResult({
			relPath: params.relPath,
			from: params.from,
			lines: params.lines,
			agentId: params.agentId,
			agentSessionKey: params.agentSessionKey,
			sandboxed: params.sandboxed,
			corpus: params.requestedCorpus
		});
		if (supplement) return jsonResult(supplement);
	} catch {}
	const message = formatErrorMessage(params.error);
	return jsonResult({
		path: params.relPath,
		text: "",
		disabled: true,
		error: message
	});
}
function isMissingMemoryReadResult(result, relPath) {
	return result.path === relPath && result.text === "" && result.from === void 0;
}
async function executeMemoryReadResult(params) {
	try {
		const result = await params.read();
		if (params.requestedCorpus === "all" && isMissingMemoryReadResult(result, params.relPath)) {
			const supplement = await getSupplementMemoryReadResult({
				relPath: params.relPath,
				from: params.from,
				lines: params.lines,
				agentId: params.agentId,
				agentSessionKey: params.agentSessionKey,
				sandboxed: params.sandboxed,
				corpus: params.requestedCorpus
			});
			if (supplement) return jsonResult(supplement);
		}
		return jsonResult(result);
	} catch (error) {
		return await resolveMemoryReadFailureResult({
			error,
			requestedCorpus: params.requestedCorpus,
			relPath: params.relPath,
			from: params.from,
			lines: params.lines,
			agentId: params.agentId,
			agentSessionKey: params.agentSessionKey,
			sandboxed: params.sandboxed
		});
	}
}
function createMemorySearchTool(options) {
	return createMemoryTool({
		options,
		label: "Memory Search",
		name: "memory_search",
		description: "Mandatory recall step: semantically search MEMORY.md + memory/*.md (and optional session transcripts) before answering questions about prior work, decisions, dates, people, preferences, or todos. Optional `corpus=wiki` or `corpus=all` also searches registered compiled-wiki supplements. `corpus=memory` restricts hits to indexed memory files (excludes session transcript chunks from ranking). `corpus=sessions` restricts hits to indexed session transcripts (same visibility rules as session history tools). If response has disabled=true or stale=true, you must tell the user and include the warning/action guidance.",
		parameters: MemorySearchSchema,
		execute: ({ cfg, agentId }) => async (_toolCallId, params, callerSignal) => {
			const rawParams = asToolParamsRecord(params);
			if (callerSignal?.aborted) throw resolveMemorySearchAbortError(callerSignal);
			const query = readToolStringParam(rawParams, "query", { required: true });
			const maxResults = readPositiveIntegerParam(rawParams, "maxResults");
			const minScore = readFiniteNumberParam(rawParams, "minScore");
			const modelRequestedCorpus = readCorpusParam(rawParams, [
				"memory",
				"wiki",
				"all",
				"sessions"
			]);
			const requestedCorpus = options.conversationRecall?.corpus === "sessions" ? "sessions" : modelRequestedCorpus;
			const cooldownKey = resolveMemorySearchToolCooldownKey({
				agentId,
				agentSessionKey: options.agentSessionKey
			});
			const cooldown = requestedCorpus === "wiki" ? void 0 : readMemorySearchToolCooldown(cooldownKey);
			let activeUnavailablePhase;
			let failedUnavailablePhase;
			const runUnavailablePhase = async (phase, task) => {
				activeUnavailablePhase = phase;
				try {
					return await task();
				} catch (error) {
					failedUnavailablePhase = phase;
					throw error;
				} finally {
					if (activeUnavailablePhase === phase) activeUnavailablePhase = void 0;
				}
			};
			const runWithDefaultDeadline = async (task) => await runMemorySearchWithDeadline({
				timeoutMs: DEFAULT_MEMORY_SEARCH_TIMEOUT_MS,
				parentSignal: callerSignal,
				run: task
			});
			const runMemorySearchTool = async () => {
				const toolStartedAt = Date.now();
				const shouldQuerySupplements = requestedCorpus === "wiki" || requestedCorpus === "all";
				const shouldQueryMemory = requestedCorpus !== "wiki" && !cooldown;
				if (cooldown && !shouldQuerySupplements) return jsonResult(buildMemorySearchUnavailableResult(cooldown.error));
				const memoryManagerPurpose = options.oneShotCliRun ? "cli" : void 0;
				const memoryManagersToClose = /* @__PURE__ */ new Set();
				let cleanupStarted = false;
				const trackMemoryManager = (context) => {
					if (memoryManagerPurpose === "cli" && isActiveMemoryManagerContext(context)) if (cleanupStarted) closeMemoryManagers([context.manager]);
					else memoryManagersToClose.add(context.manager);
					return context;
				};
				try {
					const memorySetup = shouldQueryMemory ? await runUnavailablePhase("memory", async () => await runWithDefaultDeadline(async () => {
						return { context: trackMemoryManager(await getMemoryManagerContextWithPurpose({
							cfg,
							agentId,
							purpose: memoryManagerPurpose,
							acquireLocalService: options.acquireLocalService
						})) };
					})) : null;
					const memory = memorySetup?.context ?? null;
					if (shouldQueryMemory && memory && "error" in memory && !shouldQuerySupplements) {
						recordMemorySearchToolCooldown(cooldownKey, memory.error ?? "memory search unavailable");
						return jsonResult(buildMemorySearchUnavailableResult(memory.error));
					}
					const citationsMode = resolveMemoryCitationsMode(cfg);
					const includeCitations = shouldIncludeCitations({
						mode: citationsMode,
						sessionKey: options.agentSessionKey
					});
					const pluginConfig = resolveMemoryDreamingPluginConfig(cfg);
					const dreamingEnabled = resolveMemoryDreamingConfig({
						pluginConfig,
						cfg
					}).enabled;
					const dreaming = resolveMemoryDeepDreamingConfig({
						pluginConfig,
						cfg
					});
					const searchStartedAt = Date.now();
					let rawResults = [];
					let surfacedMemoryResults = [];
					let provider;
					let model;
					let fallback;
					let searchMode;
					let pausedIndexIdentityReason;
					let staleness;
					let managerMs;
					let searchDebug;
					if (shouldQueryMemory && memorySetup && memory && !("error" in memory)) {
						await runUnavailablePhase("memory", async () => {
							let activeMemory = memory;
							const runtimeDebug = [];
							const memorySearchConfig = resolveMemorySearchConfig(cfg, agentId);
							const defaultSearchSources = memorySearchConfig?.searchSources;
							const effectiveSearchSources = options.conversationRecall?.corpus === "configured" ? memorySearchConfig?.sources : defaultSearchSources;
							const trustedTranscriptRecall = options.conversationRecall !== void 0;
							const configuredSessionSearch = defaultSearchSources?.includes("sessions") === true;
							const searchSources = requestedCorpus === "sessions" ? trustedTranscriptRecall || configuredSessionSearch ? ["sessions"] : defaultSearchSources : requestedCorpus === "memory" ? ["memory"] : requestedCorpus == null || requestedCorpus === "all" ? effectiveSearchSources : void 0;
							const createSearchOptions = (signal) => ({
								maxResults,
								minScore,
								sessionKey: options.agentSessionKey,
								activeProjectKeys: options.activeProjectKeys ? [...options.activeProjectKeys] : void 0,
								signal,
								onDebug: (debug) => {
									runtimeDebug.push(debug);
								},
								...searchSources ? { sources: searchSources } : {}
							});
							const searchActiveMemory = async () => await runWithDefaultDeadline(async (signal) => await activeMemory.manager.search(query, createSearchOptions(signal)));
							managerMs = memory.debug?.managerMs;
							try {
								rawResults = await searchActiveMemory();
							} catch (error) {
								if (!isClosedMemoryStoreError(error)) throw error;
								const refreshed = await runWithDefaultDeadline(async () => trackMemoryManager(await getMemoryManagerContextWithPurpose({
									cfg,
									agentId,
									purpose: memoryManagerPurpose,
									acquireLocalService: options.acquireLocalService
								})));
								if ("error" in refreshed) throw error;
								managerMs = refreshed.debug?.managerMs;
								activeMemory = refreshed;
								rawResults = await searchActiveMemory();
							}
							pausedIndexIdentityReason = resolvePausedMemoryIndexIdentityReason(activeMemory.manager.status());
							if (pausedIndexIdentityReason) return;
							rawResults = await runWithDefaultDeadline(async () => await filterMemorySearchHitsBySessionVisibility({
								cfg,
								agentId,
								requesterSessionKey: options.agentSessionKey,
								sandboxed: options.sandboxed === true,
								hits: rawResults,
								conversationRecall: options.conversationRecall
							}));
							if (searchSources) {
								const allowedSources = new Set(searchSources);
								rawResults = rawResults.filter((hit) => allowedSources.has(hit.source));
							}
							if (requestedCorpus === "sessions") rawResults = rawResults.filter((hit) => hit.source === "sessions");
							else if (requestedCorpus === "memory") rawResults = rawResults.filter((hit) => hit.source === "memory");
							const status = activeMemory.manager.status();
							staleness = resolveMemorySearchStaleness(status, agentId) ?? void 0;
							const memoryResults = decorateCitations(rawResults.map((result) => ({
								...result,
								snippet: stripMemoryAnnotationCarriers(result.snippet)
							})), includeCitations);
							surfacedMemoryResults = memoryResults.map((result) => ({
								...result,
								corpus: result.source
							}));
							if (dreamingEnabled) queueShortTermRecallTracking({
								workspaceDir: status.workspaceDir,
								query,
								rawResults,
								surfacedResults: memoryResults,
								timezone: dreaming.timezone
							});
							provider = status.provider;
							model = status.model;
							fallback = status.fallback;
							const latestDebug = runtimeDebug.at(-1);
							const embeddingBootstrap = mergeEmbeddingBootstrapRuntimeDebug(runtimeDebug);
							searchMode = latestDebug?.effectiveMode;
							const searchMs = Math.max(0, Date.now() - searchStartedAt);
							searchDebug = {
								backend: status.backend,
								configuredMode: latestDebug?.configuredMode,
								effectiveMode: "n/a",
								fallback: latestDebug?.fallback,
								managerMs,
								searchMs,
								embeddingBootstrap,
								hits: rawResults.length
							};
						});
						if (pausedIndexIdentityReason) return jsonResult(buildPausedMemoryIndexUnavailableResult(pausedIndexIdentityReason));
					}
					const supplementResults = shouldQuerySupplements ? await runUnavailablePhase("supplement", async () => await runWithDefaultDeadline(async () => await searchMemoryCorpusSupplements({
						query,
						maxResults,
						agentId,
						agentSessionKey: options.agentSessionKey,
						sandboxed: options.sandboxed,
						corpus: requestedCorpus
					}))) : [];
					const results = mergeMemorySearchCorpusResults({
						memoryResults: surfacedMemoryResults,
						supplementResults,
						maxResults: Math.max(1, maxResults ?? 10),
						balanceCorpora: requestedCorpus === "all"
					});
					if (searchDebug) {
						const finalToolMs = Math.max(0, Date.now() - toolStartedAt);
						searchDebug = {
							...searchDebug,
							toolMs: finalToolMs,
							outsideSearchMs: Math.max(0, finalToolMs - searchDebug.searchMs)
						};
					}
					return jsonResult({
						results,
						provider,
						model,
						fallback,
						citations: citationsMode,
						mode: searchMode,
						...staleness,
						debug: searchDebug
					});
				} finally {
					cleanupStarted = true;
					await closeMemoryManagers(memoryManagersToClose, callerSignal);
				}
			};
			try {
				const result = await runMemorySearchTool();
				if (callerSignal?.aborted) throw resolveMemorySearchAbortError(callerSignal);
				return result;
			} catch (error) {
				if (callerSignal?.aborted) throw resolveMemorySearchAbortError(callerSignal);
				const shouldRecordCooldown = requestedCorpus !== "wiki" && (requestedCorpus !== "all" || (failedUnavailablePhase ?? activeUnavailablePhase) === "memory");
				const message = formatErrorMessage(error);
				if (shouldRecordCooldown) recordMemorySearchToolCooldown(cooldownKey, message);
				return jsonResult(buildMemorySearchUnavailableResult(message));
			}
		}
	});
}
function createMemoryGetTool(options) {
	return createMemoryTool({
		options,
		label: "Memory Get",
		name: "memory_get",
		description: "Safe exact excerpt read from MEMORY.md or memory/*.md. Defaults to a bounded excerpt when lines are omitted, includes truncation/continuation info when more content exists, and `corpus=wiki` reads from registered compiled-wiki supplements.",
		parameters: MemoryGetSchema,
		execute: ({ cfg, agentId }) => async (_toolCallId, params) => {
			const rawParams = asToolParamsRecord(params);
			const relPath = readToolStringParam(rawParams, "path", { required: true });
			const from = readPositiveIntegerParam(rawParams, "from");
			const lines = readPositiveIntegerParam(rawParams, "lines");
			const requestedCorpus = readCorpusParam(rawParams, [
				"memory",
				"wiki",
				"all"
			]);
			const { readAgentMemoryFile } = await loadMemoryToolRuntime();
			if (requestedCorpus === "wiki") return jsonResult(await getSupplementMemoryReadResult({
				relPath,
				from: from ?? void 0,
				lines: lines ?? void 0,
				agentId,
				agentSessionKey: options.agentSessionKey,
				sandboxed: options.sandboxed,
				corpus: requestedCorpus
			}) ?? {
				path: relPath,
				text: "",
				disabled: true,
				error: "wiki corpus result not found"
			});
			return await executeMemoryReadResult({
				read: async () => await readAgentMemoryFile({
					cfg,
					agentId,
					relPath,
					from: from ?? void 0,
					lines: lines ?? void 0
				}),
				requestedCorpus,
				relPath,
				from: from ?? void 0,
				lines: lines ?? void 0,
				agentId,
				agentSessionKey: options.agentSessionKey,
				sandboxed: options.sandboxed
			});
		}
	});
}
//#endregion
export { createMemoryGetTool, createMemorySearchTool, testing };
