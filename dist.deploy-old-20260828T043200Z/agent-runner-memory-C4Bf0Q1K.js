import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.js";
import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { n as isAbortError } from "./abort-signal-D2k14JsD.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { g as resolveDefaultAgentId } from "./agent-scope-config-CUBiGmG3.js";
import { t as isIncognitoSessionKey } from "./incognito-session-key-BwpD1Lwd.js";
import { f as resolveAgentIdFromSessionKey, l as isUnscopedSessionKeySentinel } from "./session-key-Dbce_H9p.js";
import { o as resolveSessionStorePathCore } from "./paths-DVAvlIOc.js";
import { i as resolveMergedModelProviderModels, n as resolveMergedModelProviderConfig } from "./model-provider-config-B3wTMsqG.js";
import { l as normalizeStaticProviderModelId, s as normalizeProviderId } from "./model-ref-shared-D4yx0hwT.js";
import { c as resolveContextConfigProviderForRuntime, m as resolveModelExtraParamSources } from "./openai-routing-mOc2UICM.js";
import "./defaults-CdX9UGcX.js";
import { h as registerAgentRunContext, i as clearAgentRunContext } from "./agent-run-registry-t4kvUyNQ.js";
import { v as parseNonNegativeByteSize } from "./zod-schema-AsvAsngV.js";
import { r as logVerbose } from "./globals-GZNLg1ns.js";
import { w as resolveSessionStorePathForScope } from "./session-accessor.sqlite-entry-CNdoUuFZ.js";
import { D as selectSessionTranscriptLeafControlledPath } from "./session-transcript-index-DtVCy6vi.js";
import { o as resolveFreshSessionTotalTokens } from "./types-BEJRKmOU.js";
import { i as readRecentSessionTranscriptActiveEvents, nt as updateSessionEntry, s as readSessionTranscriptActiveStats } from "./session-accessor-B-FKZX9M.js";
import { i as hasNonzeroUsage, o as normalizeUsage, t as deriveContextPromptTokens } from "./usage-DNKCVmJi.js";
import { D as formatTokenCount } from "./sessions-CdrF1uzY.js";
import { t as resolveEffectiveCompactionReserveTokens } from "./agent-compaction-constants-CzVH4jGZ.js";
import { i as resolveSessionRuntimeOverrideForProvider, r as resolvePersistedSessionRuntimeId } from "./session-runtime-compat-BJ6CDpbR.js";
import { i as resolveCliBackendConfig } from "./cli-backends-BMTJeHWV.js";
import { i as isCliRuntimeAliasForProvider } from "./model-runtime-aliases-CGiGCCsY.js";
import { a as resolveCandidateThinkingLevel, o as resolveEffectiveAgentRuntime } from "./thinking-runtime-1slENmfx.js";
import { u as estimateMessagesTokens } from "./compaction-planning-Cn01L4m1.js";
import "./model-selection-DHDS-v4K.js";
import { t as isCliProvider } from "./model-selection-cli-C9Ha9V5X.js";
import { i as isRenderablePayload } from "./reply-payloads-DY0W7APw.js";
import { i as resolveSandboxConfigForAgent } from "./config-CfIhW1Vb.js";
import { n as resolveSandboxRuntimeStatus } from "./runtime-status-Jg1T3gN6.js";
import { Tt as isBenignCompactionSkipResult, g as readPostCompactionContext } from "./builtin-openclaw-OzMxJ-hX.js";
import { o as prepareSystemAgentRunAdmission } from "./admitted-run-context-KQIZywud.js";
import { o as resolveBootstrapWarningSignaturesSeen } from "./bootstrap-budget-BuQQfgcO.js";
import { _ as resolveMemoryFlushPlan } from "./memory-state-B_83SJ8T.js";
import "./sandbox-BUq3Yn9r.js";
import "./settled-turn-finalization-result-cHPv9pc9.js";
import { o as readSessionMessagesAsync } from "./session-transcript-readers-CgCxlOAj.js";
import { a as resolveContextTokensForModel } from "./context-Bj-w-uhp.js";
import { c as refreshQueuedFollowupSession } from "./settings-Cpt08fNP.js";
import { r as createToolResultPromptProjectionState } from "./session-prompt-state-CJQDP6Z0.js";
import "./queue-CrNP_exY.js";
import { t as runEmbeddedAgentEntry } from "./run-entry-izPK-l-k.js";
import { c as resolveModelFallbackOptions, t as buildEmbeddedRunExecutionParams } from "./agent-runner-utils-aqH36DGc.js";
import { n as incrementCompactionCount } from "./session-updates-DSmIoeOu.js";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { resolveOpenAIResponsesServerCompactionPlan } from "@openclaw/ai/internal/openai-responses-payload-policy";
import { resolveAnthropicServerCompactionPlan } from "@openclaw/ai/internal/anthropic";
//#region src/auto-reply/reply/memory-flush.ts
function resolveMemoryFlushContextWindowTokens(params) {
	return resolveContextTokensForModel({
		cfg: params.cfg,
		provider: params.provider,
		model: params.modelId,
		allowAsyncLoad: false
	}) ?? 2e5;
}
function resolveMaxActiveTranscriptBytes(cfg) {
	const parsed = parseNonNegativeByteSize(cfg?.agents?.defaults?.compaction?.maxActiveTranscriptBytes);
	return typeof parsed === "number" && parsed > 0 ? parsed : void 0;
}
function resolvePositiveTokenCount(value) {
	return typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.floor(value) : void 0;
}
/** Resolves the maintenance threshold owned by the selected memory provider. */
function resolveMemoryFlushThreshold(params) {
	const contextWindow = Math.max(1, Math.floor(params.contextWindowTokens));
	const reserveTokens = Math.max(0, Math.floor(params.reserveTokensFloor));
	const softThreshold = Math.max(0, Math.floor(params.softThresholdTokens));
	return Math.max(0, contextWindow - reserveTokens - softThreshold, Math.floor(params.minimumThresholdTokens ?? 0));
}
function resolveResponsesServerCompactionThreshold(params) {
	const provider = params.provider?.trim();
	const modelId = params.modelId?.trim();
	if (!provider || !modelId) return;
	const normalizedProvider = normalizeProviderId(provider);
	const normalizeModelId = (value) => normalizeStaticProviderModelId(normalizedProvider, value).trim().toLowerCase();
	const providerConfig = resolveMergedModelProviderConfig(params.cfg, provider);
	const configuredModel = resolveMergedModelProviderModels({
		models: providerConfig?.models,
		normalizeModelId
	}).get(normalizeModelId(modelId));
	const { defaultParams, modelParams } = resolveModelExtraParamSources({
		config: params.cfg,
		provider,
		modelId
	});
	const extraParams = {
		...defaultParams,
		...modelParams
	};
	if (normalizedProvider === "anthropic") return resolveAnthropicServerCompactionPlan({
		provider,
		api: configuredModel?.api ?? providerConfig?.api ?? "anthropic-messages",
		baseUrl: configuredModel?.baseUrl ?? providerConfig?.baseUrl,
		contextWindow: configuredModel?.contextWindow ?? resolveMemoryFlushContextWindowTokens({
			cfg: params.cfg,
			provider,
			modelId
		})
	}, extraParams).threshold;
	const defaultOpenAIBaseUrl = normalizedProvider === "openai" ? "https://api.openai.com/v1" : void 0;
	const activeContextTokens = resolveMemoryFlushContextWindowTokens({
		cfg: params.cfg,
		provider,
		modelId
	});
	return resolveOpenAIResponsesServerCompactionPlan({
		provider,
		api: configuredModel?.api ?? providerConfig?.api ?? (normalizedProvider === "openai" ? "openai-responses" : void 0),
		baseUrl: configuredModel?.baseUrl ?? providerConfig?.baseUrl ?? defaultOpenAIBaseUrl,
		compat: configuredModel?.compat,
		contextTokens: configuredModel?.contextTokens ?? activeContextTokens,
		contextWindow: configuredModel?.contextWindow ?? activeContextTokens
	}, extraParams).threshold;
}
function resolveMemoryFlushGateState(params) {
	if (!params.entry) return null;
	const totalTokens = resolvePositiveTokenCount(params.tokenCount) ?? resolveFreshSessionTotalTokens(params.entry);
	if (!totalTokens || totalTokens <= 0) return null;
	const threshold = resolveMemoryFlushThreshold(params);
	return threshold > 0 ? {
		entry: params.entry,
		totalTokens,
		threshold
	} : null;
}
function shouldRunMemoryFlush(params) {
	const state = resolveMemoryFlushGateState(params);
	if (!state || state.totalTokens < state.threshold) return false;
	if (hasAlreadyFlushedForCurrentCompaction(state.entry)) return false;
	return true;
}
function shouldRunPreflightCompaction(params) {
	const state = resolveMemoryFlushGateState(params);
	return Boolean(state && state.totalTokens >= state.threshold);
}
/**
* Returns true when a memory flush has already been performed for the current
* compaction cycle. This prevents repeated flush runs within the same cycle —
* important for both the token-based and transcript-size–based trigger paths.
*/
function hasAlreadyFlushedForCurrentCompaction(entry) {
	const compactionCount = entry.compactionCount ?? 0;
	const lastFlushAt = entry.memoryFlush?.compactionCount;
	return typeof lastFlushAt === "number" && lastFlushAt === compactionCount;
}
//#endregion
//#region src/auto-reply/reply/agent-runner-memory.ts
/** Preflight compaction and memory flush helpers for agent runner sessions. */
const MAX_VISIBLE_MEMORY_FLUSH_ERROR_CHARS = 600;
const MAX_FLUSH_FAILURES = 3;
const MAX_FLUSH_ERROR_LENGTH = 200;
const embeddedAgentRuntimeLoader = createLazyImportLoader(() => import("./embedded-agent-DjHmTlnD.js"));
const toolResultTruncationRuntimeLoader = createLazyImportLoader(() => import("./tool-result-truncation-CHf5mkAJ.js"));
function loadEmbeddedAgentRuntime() {
	return embeddedAgentRuntimeLoader.load();
}
async function compactEmbeddedAgentSessionDefault(...args) {
	const { compactEmbeddedAgentSession } = await loadEmbeddedAgentRuntime();
	return await compactEmbeddedAgentSession(...args);
}
async function runEmbeddedAgentDefault(...args) {
	const { runEmbeddedAgent } = await loadEmbeddedAgentRuntime();
	return await runEmbeddedAgent(...args);
}
async function updateSessionEntryDefault(params) {
	return await updateSessionEntry({
		storePath: params.storePath,
		sessionKey: params.sessionKey
	}, params.update, {
		skipMaintenance: params.skipMaintenance,
		takeCacheOwnership: params.takeCacheOwnership
	});
}
async function ensureMemoryFlushTargetFile(params) {
	const workspaceDir = normalizeOptionalString(params.workspaceDir);
	const relativePath = normalizeOptionalString(params.relativePath);
	if (!workspaceDir || !relativePath || path.isAbsolute(relativePath)) throw new Error("Invalid memory flush target path");
	const workspaceRoot = path.resolve(workspaceDir);
	const targetPath = path.resolve(workspaceRoot, relativePath);
	const targetRelativePath = path.relative(workspaceRoot, targetPath);
	if (!targetRelativePath || targetRelativePath.startsWith("..") || path.isAbsolute(targetRelativePath)) throw new Error("Memory flush target path must stay inside the workspace");
	await fs.promises.mkdir(path.dirname(targetPath), { recursive: true });
	await (await fs.promises.open(targetPath, "a")).close();
}
const memoryDeps = {
	compactEmbeddedAgentSession: compactEmbeddedAgentSessionDefault,
	runEmbeddedAgentEntry,
	runEmbeddedAgent: runEmbeddedAgentDefault,
	ensureMemoryFlushTargetFile,
	clearAgentRunContext,
	registerAgentRunContext,
	refreshQueuedFollowupSession,
	incrementCompactionCount,
	updateSessionEntry: updateSessionEntryDefault,
	randomUUID: () => crypto.randomUUID(),
	now: () => Date.now()
};
/** Overrides memory helper dependencies for tests. */
function setAgentRunnerMemoryTestDeps(overrides) {
	Object.assign(memoryDeps, {
		runEmbeddedAgentEntry,
		compactEmbeddedAgentSession: compactEmbeddedAgentSessionDefault,
		runEmbeddedAgent: runEmbeddedAgentDefault,
		ensureMemoryFlushTargetFile,
		clearAgentRunContext,
		registerAgentRunContext,
		refreshQueuedFollowupSession,
		incrementCompactionCount,
		updateSessionEntry: updateSessionEntryDefault,
		randomUUID: () => crypto.randomUUID(),
		now: () => Date.now(),
		...overrides
	});
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.agentRunnerMemoryTestApi")] = { setAgentRunnerMemoryTestDeps };
function estimatePromptTokensForMemoryFlush(prompt) {
	const trimmed = normalizeOptionalString(prompt);
	if (!trimmed) return;
	const tokens = estimateMessagesTokens([{
		role: "user",
		content: trimmed,
		timestamp: Date.now()
	}]);
	if (!Number.isFinite(tokens) || tokens <= 0) return;
	return Math.ceil(tokens);
}
function resolveEffectivePromptTokens(basePromptTokens, lastOutputTokens, promptTokenEstimate) {
	const base = Math.max(0, basePromptTokens ?? 0);
	const output = Math.max(0, lastOutputTokens ?? 0);
	const estimate = Math.max(0, promptTokenEstimate ?? 0);
	return base + output + estimate;
}
function resolveMemoryFlushModelFallbackOptions(run, model, configOverride = run.config) {
	const options = resolveModelFallbackOptions(run, configOverride);
	const override = normalizeOptionalString(model);
	if (!override) return options;
	const slashIdx = override.indexOf("/");
	if (slashIdx > 0) {
		const overrideProvider = override.slice(0, slashIdx).trim();
		const overrideModel = override.slice(slashIdx + 1).trim();
		if (overrideProvider && overrideModel) return {
			...options,
			provider: overrideProvider,
			model: overrideModel,
			requestedRouteResolution: "raw",
			fallbacksOverride: []
		};
	}
	return {
		...options,
		model: override,
		requestedRouteResolution: "raw",
		fallbacksOverride: []
	};
}
function followupUsesCliRuntime(params, runtimeId) {
	const provider = params.followupRun.run.provider;
	if (params.agentHarnessId) return isCliRuntimeAliasForProvider({
		provider,
		runtime: params.agentHarnessId,
		cfg: params.cfg
	});
	if (isCliProvider(provider, params.cfg)) return true;
	return [resolvePersistedSessionRuntimeId(params.sessionEntry), runtimeId].some((runtime) => isCliRuntimeAliasForProvider({
		provider,
		runtime,
		cfg: params.cfg
	}));
}
function resolveFollowupContextConfigProvider(params) {
	const provider = params.followupRun.run.provider;
	return resolveContextConfigProviderForRuntime({
		provider,
		runtimeId: resolveFollowupAgentRuntimeId(params),
		config: params.cfg
	});
}
function resolveFollowupAgentRuntimeId(params) {
	if (params.agentHarnessId) return params.agentHarnessId;
	const matchingSessionEntry = params.sessionEntry?.sessionId === params.followupRun.run.sessionId ? params.sessionEntry : void 0;
	return resolveEffectiveAgentRuntime({
		cfg: params.cfg,
		provider: params.followupRun.run.provider,
		modelId: params.followupRun.run.model,
		agentId: params.followupRun.run.agentId ?? resolveDefaultAgentId(params.cfg),
		sessionKey: params.runtimePolicySessionKey ?? params.sessionKey ?? params.followupRun.run.runtimePolicySessionKey ?? params.followupRun.run.sessionKey,
		sessionEntry: matchingSessionEntry
	});
}
function followupOwnsNativeCompaction(params, runtimeId) {
	return resolveCliBackendConfig(runtimeId, params.cfg, { agentId: params.followupRun.run.agentId })?.ownsNativeCompaction === true;
}
function resolveVisibleMemoryFlushErrorPayloads(payloads) {
	return (payloads ?? []).filter((payload) => payload.isError === true && isRenderablePayload(payload));
}
function buildVisibleMemoryFlushFailure(payloads) {
	const message = payloads.map((payload) => normalizeOptionalString(payload.text)).filter((text) => Boolean(text)).join("\n");
	return new Error(message || "Memory flush returned an error response");
}
function buildMemoryFlushErrorPayload(err) {
	if (isAbortError(err)) return;
	const message = normalizeOptionalString(formatErrorMessage(err));
	if (!message) return;
	const visibleText = message.startsWith("⚠️") ? message : `⚠️ ${message}`;
	return {
		text: visibleText.length > MAX_VISIBLE_MEMORY_FLUSH_ERROR_CHARS ? `${truncateUtf16Safe(visibleText, MAX_VISIBLE_MEMORY_FLUSH_ERROR_CHARS - 1)}…` : visibleText,
		isError: true
	};
}
function truncateMemoryFlushErrorMessage(err) {
	const message = normalizeOptionalString(formatErrorMessage(err)) || String(err);
	return message.length > MAX_FLUSH_ERROR_LENGTH ? `${truncateUtf16Safe(message, MAX_FLUSH_ERROR_LENGTH - 1)}…` : message;
}
function hasUsableProviderPromptUsage(usage) {
	return typeof usage?.promptTokens === "number" && Number.isFinite(usage.promptTokens) && usage.promptTokens > 0;
}
function isUnavailableContextBarrier(usage) {
	if (usage.contextUsage?.state !== "unavailable") return false;
	return [
		usage.input,
		usage.output,
		usage.cacheRead,
		usage.cacheWrite,
		usage.total
	].every((value) => !(typeof value === "number" && value > 0));
}
const TRANSCRIPT_OUTPUT_READ_BUFFER_TOKENS = 8192;
const SQLITE_USAGE_TAIL_MAX_EVENTS = 512;
function deriveTranscriptUsageSnapshot(snapshot) {
	const usage = snapshot?.usage;
	if (!usage) return;
	const promptTokens = deriveContextPromptTokens({ lastCallUsage: usage });
	const outputRaw = usage.output;
	const outputTokens = typeof outputRaw === "number" && Number.isFinite(outputRaw) && outputRaw > 0 ? outputRaw : void 0;
	if (!(typeof promptTokens === "number") && !(typeof outputTokens === "number")) return;
	return {
		promptTokens,
		outputTokens,
		trailingMessages: snapshot.trailingMessages
	};
}
function readLatestNonzeroUsageSnapshotFromTranscriptEvents(events) {
	const activeEvents = selectSessionTranscriptLeafControlledPath(events) ?? events;
	const trailingMessages = [];
	for (const event of activeEvents.toReversed()) {
		if (!event || typeof event !== "object" || Array.isArray(event)) continue;
		const record = event;
		if (record.type === "compaction" || record.type === "reset") return;
		const message = record.message && typeof record.message === "object" && !Array.isArray(record.message) ? record.message : void 0;
		const rawUsage = message?.usage ?? record.usage;
		if (message?.api === "cli" && rawUsage && rawUsage.contextUsage === void 0) return;
		const usage = normalizeUsage(rawUsage);
		if (usage && isUnavailableContextBarrier(usage)) return;
		if (usage && hasNonzeroUsage(usage)) return {
			usage,
			trailingMessages: trailingMessages.toReversed()
		};
		if (message) trailingMessages.push(message);
	}
}
function readActiveTurnTaintFromTranscriptEvents(events) {
	const activeEvents = selectSessionTranscriptLeafControlledPath(events) ?? events;
	for (const event of activeEvents.toReversed()) {
		if (!event || typeof event !== "object" || Array.isArray(event)) continue;
		const message = event.message;
		if (!message || typeof message !== "object" || Array.isArray(message)) continue;
		const record = message;
		if (record.role === "user") return {
			boundaryFound: true,
			tainted: false
		};
		const metadata = record["__openclaw"];
		if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) continue;
		const openClaw = metadata;
		if (openClaw.turnTainted === true || openClaw.resultContentSource === "network") return {
			boundaryFound: false,
			tainted: true
		};
	}
	return {
		boundaryFound: false,
		tainted: false
	};
}
function readSqliteSessionLogSnapshot(scope, options) {
	const snapshot = {};
	try {
		if (options.includeByteSize) {
			const stats = readSessionTranscriptActiveStats(scope);
			snapshot.byteSize = stats.sizeBytes;
			snapshot.eventCount = stats.eventCount;
		}
		if (options.includeUsage || options.includeTurnTaint) {
			const events = readRecentSessionTranscriptActiveEvents(scope, options.usageEventLimit ?? SQLITE_USAGE_TAIL_MAX_EVENTS);
			if (options.includeUsage) snapshot.usage = deriveTranscriptUsageSnapshot(readLatestNonzeroUsageSnapshotFromTranscriptEvents(events));
			if (options.includeTurnTaint) {
				const scan = readActiveTurnTaintFromTranscriptEvents(events);
				snapshot.turnTainted = scan.tainted || !scan.boundaryFound && events.length >= SQLITE_USAGE_TAIL_MAX_EVENTS;
			}
		}
	} catch {
		if (options.includeTurnTaint) snapshot.turnTainted = true;
		return snapshot;
	}
	return snapshot;
}
async function appendPostCompactionRefreshPrompt(params) {
	const refreshPrompt = await readPostCompactionContext(params.followupRun.run.workspaceDir, {
		cfg: params.cfg,
		agentId: params.followupRun.run.agentId
	});
	if (!refreshPrompt) return;
	const existingPrompt = normalizeOptionalString(params.followupRun.run.extraSystemPrompt);
	if (existingPrompt?.includes(refreshPrompt)) return;
	params.followupRun.run.extraSystemPrompt = [existingPrompt, refreshPrompt].filter(Boolean).join("\n\n");
}
function readSessionLogSnapshot(params) {
	const agentId = params.agentId ?? resolveAgentIdFromSessionKey(params.sessionKey);
	if (params.sessionId && params.storePath && agentId) return readSqliteSessionLogSnapshot({
		agentId,
		sessionId: params.sessionId,
		...params.sessionKey ? { sessionKey: params.sessionKey } : {},
		storePath: params.storePath
	}, params);
	return params.includeTurnTaint ? { turnTainted: true } : {};
}
async function estimateProviderPromptTokensFromMessages(messages, contextWindowTokens) {
	if (messages.length === 0) return 0;
	const { truncateOversizedToolResultsInMessages } = await toolResultTruncationRuntimeLoader.load();
	const projected = truncateOversizedToolResultsInMessages(messages, contextWindowTokens, void 0, void 0, createToolResultPromptProjectionState()).messages;
	const tokens = estimateMessagesTokens(projected);
	return Number.isFinite(tokens) && tokens >= 0 ? Math.ceil(tokens) : void 0;
}
async function estimatePromptTokensFromSessionTranscript(params) {
	const sessionId = normalizeOptionalString(params.sessionId);
	if (!sessionId) return;
	try {
		const snapshot = readSessionLogSnapshot({
			agentId: params.agentId,
			sessionId,
			sessionKey: params.sessionKey,
			storePath: params.storePath,
			includeByteSize: true,
			includeUsage: true
		});
		let usage = snapshot.usage;
		if (!hasUsableProviderPromptUsage(usage) && typeof snapshot.eventCount === "number" && snapshot.eventCount > SQLITE_USAGE_TAIL_MAX_EVENTS) usage = readSessionLogSnapshot({
			agentId: params.agentId,
			sessionId,
			sessionKey: params.sessionKey,
			storePath: params.storePath,
			includeByteSize: false,
			includeUsage: true,
			usageEventLimit: snapshot.eventCount
		}).usage;
		const normalizedOutputTokens = typeof usage?.outputTokens === "number" && Number.isFinite(usage.outputTokens) && usage.outputTokens > 0 ? Math.ceil(usage.outputTokens) : void 0;
		if (hasUsableProviderPromptUsage(usage)) {
			const trailingMessages = usage.trailingMessages;
			const trailingTokens = await estimateProviderPromptTokensFromMessages(trailingMessages, params.contextWindowTokens);
			if (trailingTokens === void 0) return;
			return {
				promptTokens: Math.ceil(usage.promptTokens) + trailingTokens,
				promptTokenSource: trailingMessages.length > 0 ? "provider_usage_plus_prompt_projection" : "provider_usage",
				outputTokens: normalizedOutputTokens,
				transcriptByteSize: snapshot.byteSize
			};
		}
		const estimatedTokens = await estimateProviderPromptTokensFromMessages(await readSessionMessagesAsync({
			agentId: params.agentId ?? resolveAgentIdFromSessionKey(params.sessionKey),
			sessionId,
			sessionKey: params.sessionKey,
			storePath: params.storePath
		}, {
			mode: "full",
			reason: "preflight-compaction-estimate"
		}), params.contextWindowTokens);
		if (estimatedTokens === void 0) return;
		return {
			promptTokens: estimatedTokens,
			promptTokenSource: "prompt_projection",
			promptIncludesOutput: true,
			outputTokens: normalizedOutputTokens,
			transcriptByteSize: snapshot.byteSize
		};
	} catch {
		return;
	}
}
/** Compacts session context before a reply or after a completed direct command. */
async function runSessionCompactionIfNeeded(params) {
	const deps = {
		compactEmbeddedAgentSession: memoryDeps.compactEmbeddedAgentSession,
		incrementCompactionCount: memoryDeps.incrementCompactionCount,
		refreshQueuedFollowupSession: memoryDeps.refreshQueuedFollowupSession
	};
	const assertActive = () => {
		params.abortSignal?.throwIfAborted();
		if (params.authorize?.() === false) throw new Error("Session compaction maintenance is no longer active");
	};
	if (!params.sessionKey) return params.sessionEntry;
	let entry = params.sessionEntry ?? (params.sessionKey ? params.sessionStore?.[params.sessionKey] : void 0);
	if (!entry?.sessionId) return entry ?? params.sessionEntry;
	const runtimeParams = {
		cfg: params.cfg,
		followupRun: params.followupRun,
		sessionEntry: entry,
		sessionKey: params.sessionKey,
		runtimePolicySessionKey: params.runtimePolicySessionKey,
		agentHarnessId: params.agentHarnessId
	};
	assertActive();
	const runtimeId = resolveFollowupAgentRuntimeId(runtimeParams);
	const isCli = followupUsesCliRuntime(runtimeParams, runtimeId);
	const ownsNativeCompaction = followupOwnsNativeCompaction(runtimeParams, runtimeId);
	if (params.isHeartbeat || isCli || ownsNativeCompaction) return entry ?? params.sessionEntry;
	const isCodexRuntime = normalizeLowercaseStringOrEmpty(runtimeId) === "codex";
	const compactionSessionKey = params.sessionKey ?? params.followupRun.run.sessionKey;
	if (!compactionSessionKey) return entry ?? params.sessionEntry;
	const configuredAgentId = params.followupRun.run.agentId ?? resolveDefaultAgentId(params.cfg);
	const compactionAgentId = isUnscopedSessionKeySentinel(compactionSessionKey) ? configuredAgentId : resolveAgentIdFromSessionKey(compactionSessionKey, configuredAgentId);
	const compactionStorePath = resolveSessionStorePathForScope({
		agentId: compactionAgentId,
		sessionKey: compactionSessionKey,
		storePath: params.storePath ?? resolveSessionStorePathCore(params.cfg.session?.store, { agentId: compactionAgentId })
	});
	const contextWindowTokens = resolveMemoryFlushContextWindowTokens({
		cfg: params.cfg,
		provider: resolveContextConfigProviderForRuntime({
			provider: params.followupRun.run.provider,
			runtimeId,
			config: params.cfg
		}),
		modelId: params.followupRun.run.model ?? params.defaultModel
	});
	const memoryFlushPlan = resolveMemoryFlushPlan({
		cfg: params.cfg,
		contextWindowTokens
	});
	const reserveTokensFloor = memoryFlushPlan?.reserveTokensFloor ?? resolveEffectiveCompactionReserveTokens({
		contextTokenBudget: contextWindowTokens,
		reserveTokens: 2e4
	});
	const softThresholdTokens = memoryFlushPlan?.softThresholdTokens ?? Math.min(4e3, Math.floor((contextWindowTokens - reserveTokensFloor) / 2));
	const freshPersistedTokens = resolveFreshSessionTotalTokens(entry);
	const promptTokenEstimate = estimatePromptTokensForMemoryFlush(params.promptForEstimate ?? params.followupRun.prompt);
	const responsesServerCompactionThreshold = resolveResponsesServerCompactionThreshold({
		cfg: params.cfg,
		provider: params.followupRun.run.provider,
		modelId: params.followupRun.run.model ?? params.defaultModel
	});
	const threshold = resolveMemoryFlushThreshold({
		contextWindowTokens,
		reserveTokensFloor,
		softThresholdTokens,
		minimumThresholdTokens: responsesServerCompactionThreshold
	});
	const freshNeedsOutputRead = typeof freshPersistedTokens === "number" && typeof promptTokenEstimate === "number" && threshold > 0 && freshPersistedTokens + promptTokenEstimate >= threshold - TRANSCRIPT_OUTPUT_READ_BUFFER_TOKENS;
	const maxActiveTranscriptBytes = resolveMaxActiveTranscriptBytes(params.cfg);
	const shouldCheckActiveTranscriptBytes = typeof maxActiveTranscriptBytes === "number";
	const transcriptUsageTokens = isCodexRuntime || typeof freshPersistedTokens === "number" && !freshNeedsOutputRead ? void 0 : await estimatePromptTokensFromSessionTranscript({
		agentId: compactionAgentId,
		sessionId: entry.sessionId,
		sessionKey: compactionSessionKey,
		storePath: compactionStorePath,
		contextWindowTokens
	});
	const transcriptSizeSnapshot = shouldCheckActiveTranscriptBytes && transcriptUsageTokens?.transcriptByteSize === void 0 ? readSessionLogSnapshot({
		agentId: compactionAgentId,
		sessionId: entry.sessionId,
		sessionKey: compactionSessionKey,
		storePath: compactionStorePath,
		includeByteSize: true,
		includeUsage: false
	}) : void 0;
	const activeTranscriptBytes = transcriptUsageTokens?.transcriptByteSize ?? transcriptSizeSnapshot?.byteSize;
	const shouldCompactByTranscriptBytes = typeof activeTranscriptBytes === "number" && typeof maxActiveTranscriptBytes === "number" && activeTranscriptBytes >= maxActiveTranscriptBytes;
	if (isCodexRuntime && !shouldCompactByTranscriptBytes) {
		logVerbose(`preflightCompaction skipped: sessionKey=${params.sessionKey} runtime=codex reason=codex_native_auto_compaction activeTranscriptBytes=${activeTranscriptBytes ?? "undefined"} maxActiveTranscriptBytes=${maxActiveTranscriptBytes ?? "undefined"}`);
		return entry ?? params.sessionEntry;
	}
	const transcriptPromptTokens = transcriptUsageTokens?.promptTokens;
	const transcriptOutputTokens = transcriptUsageTokens?.outputTokens;
	const transcriptEstimateOutputTokens = transcriptUsageTokens?.promptIncludesOutput ? void 0 : transcriptOutputTokens;
	const usageProjectedTokenCount = typeof transcriptPromptTokens === "number" ? resolveEffectivePromptTokens(transcriptPromptTokens, transcriptEstimateOutputTokens, promptTokenEstimate) : void 0;
	const freshProjectedTokenCount = typeof freshPersistedTokens === "number" ? resolveEffectivePromptTokens(freshPersistedTokens, transcriptOutputTokens, promptTokenEstimate) : void 0;
	const projectedTokenCount = Math.max(usageProjectedTokenCount ?? 0, freshProjectedTokenCount ?? 0);
	const tokenCountForCompaction = Number.isFinite(projectedTokenCount) && projectedTokenCount > 0 ? projectedTokenCount : void 0;
	logVerbose(`preflightCompaction check: sessionKey=${params.sessionKey} tokenCount=${tokenCountForCompaction ?? freshPersistedTokens ?? "undefined"} contextWindow=${contextWindowTokens} threshold=${threshold} responsesServerCompactionThreshold=${responsesServerCompactionThreshold ?? "undefined"} isHeartbeat=${params.isHeartbeat} isCli=${isCli} persistedFresh=${entry?.totalTokensFresh === true} transcriptPromptTokens=${transcriptPromptTokens ?? "undefined"} transcriptPromptSource=${transcriptUsageTokens?.promptTokenSource ?? "undefined"} promptTokensEst=${promptTokenEstimate ?? "undefined"} activeTranscriptBytes=${activeTranscriptBytes ?? "undefined"} maxActiveTranscriptBytes=${maxActiveTranscriptBytes ?? "undefined"} sizeTrigger=${shouldCompactByTranscriptBytes}`);
	if (!(shouldRunPreflightCompaction({
		entry,
		tokenCount: tokenCountForCompaction,
		contextWindowTokens,
		reserveTokensFloor,
		softThresholdTokens,
		minimumThresholdTokens: responsesServerCompactionThreshold
	}) || shouldCompactByTranscriptBytes)) return entry ?? params.sessionEntry;
	const compactionTrigger = shouldCompactByTranscriptBytes ? "transcript_bytes" : "tokens";
	logVerbose(`preflightCompaction triggered: sessionKey=${params.sessionKey} tokenCount=${tokenCountForCompaction ?? freshPersistedTokens ?? "undefined"} threshold=${threshold} trigger=${compactionTrigger} activeTranscriptBytes=${activeTranscriptBytes ?? "undefined"} maxActiveTranscriptBytes=${maxActiveTranscriptBytes ?? "undefined"}`);
	assertActive();
	params.onCompactionStart?.();
	const notifyCompaction = async (phase, text) => {
		try {
			if (text) await params.onCompactionNotice?.(phase, text);
			else await params.onCompactionNotice?.(phase);
		} catch (err) {
			logVerbose(`preflightCompaction notice delivery failed: ${String(err)}`);
		}
	};
	let startedCompactionNotice = false;
	let terminalCompactionNoticeSent = false;
	const notifyStartCompaction = async () => {
		startedCompactionNotice = true;
		await notifyCompaction("start");
	};
	const notifyTerminalCompaction = async (phase, text) => {
		terminalCompactionNoticeSent = true;
		await notifyCompaction(phase, text);
	};
	const expectedSession = params.authorize ? {
		sessionId: entry.sessionId,
		lifecycleRevision: entry.lifecycleRevision
	} : void 0;
	try {
		await notifyStartCompaction();
		assertActive();
		const result = await deps.compactEmbeddedAgentSession({
			sessionId: entry.sessionId,
			sessionKey: compactionSessionKey,
			sessionTarget: {
				agentId: compactionAgentId,
				sessionId: entry.sessionId,
				sessionKey: compactionSessionKey,
				storePath: compactionStorePath
			},
			sandboxSessionKey: params.runtimePolicySessionKey,
			allowGatewaySubagentBinding: true,
			messageChannel: params.followupRun.run.messageProvider,
			clientCaps: params.followupRun.run.clientCaps,
			conversationToolPolicy: params.followupRun.run.conversationToolPolicy,
			groupId: entry.groupId ?? params.followupRun.run.groupId,
			groupChannel: entry.groupChannel ?? params.followupRun.run.groupChannel,
			groupSpace: entry.space ?? params.followupRun.run.groupSpace,
			senderId: params.followupRun.run.senderId,
			senderName: params.followupRun.run.senderName,
			senderUsername: params.followupRun.run.senderUsername,
			senderE164: params.followupRun.run.senderE164,
			inputProvenance: params.followupRun.run.inputProvenance,
			sessionFile: compactionSessionKey,
			workspaceDir: params.followupRun.run.workspaceDir,
			cwd: params.followupRun.run.cwd,
			agentDir: params.followupRun.run.agentDir,
			config: params.cfg,
			skillsSnapshot: entry.skillsSnapshot ?? params.followupRun.run.skillsSnapshot,
			provider: params.followupRun.run.provider,
			model: params.followupRun.run.model,
			authProfileId: params.followupRun.run.authProfileId,
			authProfileIdSource: params.followupRun.run.authProfileIdSource,
			sessionEntry: entry,
			agentHarnessId: params.agentHarnessId ?? (entry.sessionId === params.followupRun.run.sessionId ? entry.modelSelectionLocked === true ? resolvePersistedSessionRuntimeId(entry) : runtimeId : void 0),
			modelSelectionLocked: entry.modelSelectionLocked === true,
			thinkLevel: params.followupRun.run.thinkLevel,
			bashElevated: params.followupRun.run.bashElevated,
			trigger: "budget",
			force: true,
			forcePreflight: true,
			preflightRequired: true,
			preflightCompactionTrigger: compactionTrigger,
			deferOwningContextEngineCompaction: false,
			contextTokenBudget: contextWindowTokens,
			currentTokenCount: tokenCountForCompaction ?? freshPersistedTokens,
			ownerNumbers: params.followupRun.run.ownerNumbers,
			abortSignal: params.abortSignal
		});
		assertActive();
		if (!result?.ok) {
			const reason = result?.reason ?? "not_compacted";
			if (result && isBenignCompactionSkipResult(result)) {
				await notifyTerminalCompaction("skipped");
				logVerbose(`preflightCompaction skipped: sessionKey=${params.sessionKey} reason=${reason}`);
				return entry ?? params.sessionEntry;
			}
			await notifyTerminalCompaction("incomplete");
			logVerbose(`preflightCompaction failed: sessionKey=${params.sessionKey} reason=${reason}`);
			throw new Error(`Preflight compaction required but failed: ${reason}`);
		}
		if (!result.compacted) {
			const reason = normalizeOptionalString(result.reason) ?? "not_compacted";
			if (isBenignCompactionSkipResult(result)) {
				await notifyTerminalCompaction("skipped");
				logVerbose(`preflightCompaction skipped: sessionKey=${params.sessionKey} reason=${reason}`);
				return entry ?? params.sessionEntry;
			}
			await notifyTerminalCompaction("incomplete");
			logVerbose(`preflightCompaction failed: sessionKey=${params.sessionKey} reason=${reason}`);
			throw new Error(`Preflight compaction required but failed: ${reason}`);
		}
		const compactionCount = await deps.incrementCompactionCount({
			agentId: compactionAgentId,
			cfg: params.cfg,
			sessionEntry: entry,
			sessionStore: params.sessionStore,
			sessionKey: compactionSessionKey,
			storePath: compactionStorePath,
			tokensAfter: result.result?.tokensAfter,
			newSessionId: result.result?.sessionId,
			compactionKind: result.compactionKind,
			...expectedSession ? {
				expectedSession,
				authorize: params.authorize
			} : {}
		});
		assertActive();
		if (expectedSession && compactionCount === void 0) throw new Error("Session changed before compaction maintenance could be recorded");
		await appendPostCompactionRefreshPrompt({
			cfg: params.cfg,
			followupRun: params.followupRun
		});
		assertActive();
		await notifyTerminalCompaction("end", result.compactionKind === "server-endpoint" && typeof result.result?.tokensBefore === "number" && typeof result.result.tokensAfter === "number" ? `🧹 Server-side compaction complete (${formatTokenCount(result.result.tokensBefore)} → ${formatTokenCount(result.result.tokensAfter)})` : void 0);
		assertActive();
		entry = params.sessionStore?.[params.sessionKey] ?? entry;
		if (entry) {
			const previousSessionId = params.followupRun.run.sessionId;
			params.followupRun.run.sessionId = entry.sessionId;
			params.onSessionIdChanged?.(entry.sessionId);
			const queueKey = params.followupRun.run.sessionKey ?? params.sessionKey;
			if (queueKey) {
				params.followupRun.run.sessionFile = queueKey;
				deps.refreshQueuedFollowupSession({
					key: queueKey,
					previousSessionId,
					nextSessionId: entry.sessionId,
					nextSessionFile: queueKey
				});
			}
		}
		return entry ?? params.sessionEntry;
	} catch (err) {
		if (startedCompactionNotice && !terminalCompactionNoticeSent) await notifyCompaction("incomplete");
		throw err;
	}
}
/** Runs pre-compaction memory flush when transcript state warrants it. */
async function runMemoryFlushIfNeeded(params) {
	const abortSignal = params.replyOperation?.abortSignal ?? params.abortSignal;
	const updateSessionId = (sessionId) => {
		params.replyOperation?.updateSessionId(sessionId);
		params.onSessionIdChanged?.(sessionId);
	};
	const memoryFlushWritable = (() => {
		if (!params.sessionKey) return true;
		const runtime = resolveSandboxRuntimeStatus({
			cfg: params.cfg,
			sessionKey: params.runtimePolicySessionKey ?? params.sessionKey
		});
		if (!runtime.sandboxed) return true;
		return resolveSandboxConfigForAgent(params.cfg, runtime.agentId).workspaceAccess === "rw";
	})();
	let entry = params.sessionEntry ?? (params.sessionKey ? params.sessionStore?.[params.sessionKey] : void 0);
	if (entry?.incognito === true || isIncognitoSessionKey(params.sessionKey)) return {
		sessionEntry: entry,
		outcome: "skipped"
	};
	const runtimeParams = {
		cfg: params.cfg,
		followupRun: params.followupRun,
		sessionEntry: entry,
		sessionKey: params.sessionKey,
		runtimePolicySessionKey: params.runtimePolicySessionKey
	};
	const runtimeId = resolveFollowupAgentRuntimeId(runtimeParams);
	const isCli = followupUsesCliRuntime(runtimeParams, runtimeId) || followupOwnsNativeCompaction(runtimeParams, runtimeId);
	if (!(memoryFlushWritable && !params.isHeartbeat && !isCli)) return {
		sessionEntry: entry ?? params.sessionEntry,
		outcome: "skipped"
	};
	const flushRunId = memoryDeps.randomUUID();
	let flushRunRegistered = false;
	let activeSessionEntry = entry ?? params.sessionEntry;
	const activeSessionStore = params.sessionStore;
	const recordFailure = (error) => recordMemoryFlushFailure(error, params, activeSessionEntry);
	const contextWindowTokens = resolveMemoryFlushContextWindowTokens({
		cfg: params.cfg,
		provider: resolveFollowupContextConfigProvider({
			cfg: params.cfg,
			followupRun: params.followupRun,
			sessionEntry: entry,
			sessionKey: params.sessionKey,
			runtimePolicySessionKey: params.runtimePolicySessionKey
		}),
		modelId: params.followupRun.run.model ?? params.defaultModel
	});
	let memoryFlushPlan;
	try {
		memoryFlushPlan = resolveMemoryFlushPlan({
			cfg: params.cfg,
			contextWindowTokens
		});
	} catch (error) {
		return await recordFailure(error);
	}
	if (!memoryFlushPlan) return {
		sessionEntry: activeSessionEntry,
		outcome: "skipped"
	};
	const promptTokenEstimate = estimatePromptTokensForMemoryFlush(params.promptForEstimate ?? params.followupRun.prompt);
	const persistedPromptTokensRaw = entry?.totalTokens;
	const persistedPromptTokens = typeof persistedPromptTokensRaw === "number" && Number.isFinite(persistedPromptTokensRaw) && persistedPromptTokensRaw > 0 ? persistedPromptTokensRaw : void 0;
	const hasFreshPersistedPromptTokens = resolveFreshSessionTotalTokens(entry) !== void 0;
	const flushThreshold = resolveMemoryFlushThreshold({
		contextWindowTokens,
		reserveTokensFloor: memoryFlushPlan.reserveTokensFloor,
		softThresholdTokens: memoryFlushPlan.softThresholdTokens
	});
	const shouldReadTranscriptForOutput = entry && hasFreshPersistedPromptTokens && typeof promptTokenEstimate === "number" && Number.isFinite(promptTokenEstimate) && flushThreshold > 0 && (persistedPromptTokens ?? 0) + promptTokenEstimate >= flushThreshold - TRANSCRIPT_OUTPUT_READ_BUFFER_TOKENS;
	const shouldReadTranscript = Boolean(entry && (!hasFreshPersistedPromptTokens || shouldReadTranscriptForOutput));
	const forceFlushTranscriptBytes = memoryFlushPlan.forceFlushTranscriptBytes;
	const shouldCheckTranscriptSizeForForcedFlush = Boolean(entry && Number.isFinite(forceFlushTranscriptBytes) && forceFlushTranscriptBytes > 0);
	const shouldReadTurnTaint = Boolean(entry);
	const sessionLogSnapshot = shouldReadTranscript || shouldCheckTranscriptSizeForForcedFlush || shouldReadTurnTaint ? readSessionLogSnapshot({
		agentId: params.followupRun.run.agentId,
		sessionId: params.followupRun.run.sessionId,
		sessionKey: params.sessionKey ?? params.followupRun.run.sessionKey,
		storePath: params.storePath,
		includeByteSize: shouldCheckTranscriptSizeForForcedFlush,
		includeTurnTaint: shouldReadTurnTaint,
		includeUsage: shouldReadTranscript
	}) : void 0;
	const transcriptByteSize = sessionLogSnapshot?.byteSize;
	const shouldForceFlushByTranscriptSize = typeof transcriptByteSize === "number" && transcriptByteSize >= forceFlushTranscriptBytes;
	const transcriptUsageSnapshot = sessionLogSnapshot?.usage;
	const transcriptPromptTokens = transcriptUsageSnapshot?.promptTokens;
	const transcriptOutputTokens = transcriptUsageSnapshot?.outputTokens;
	const hasReliableTranscriptPromptTokens = typeof transcriptPromptTokens === "number" && Number.isFinite(transcriptPromptTokens) && transcriptPromptTokens > 0;
	if (entry && hasReliableTranscriptPromptTokens && (!hasFreshPersistedPromptTokens || (transcriptPromptTokens ?? 0) > (persistedPromptTokens ?? 0))) {
		const nextEntry = {
			...entry,
			totalTokens: transcriptPromptTokens,
			totalTokensFresh: true,
			totalTokensVersion: 1
		};
		entry = nextEntry;
		if (params.sessionKey && params.sessionStore) params.sessionStore[params.sessionKey] = nextEntry;
		if (params.storePath && params.sessionKey) try {
			const updatedEntry = await updateSessionEntry({
				storePath: params.storePath,
				sessionKey: params.sessionKey
			}, () => ({
				totalTokens: transcriptPromptTokens,
				totalTokensFresh: true,
				totalTokensVersion: 1
			}), {
				skipMaintenance: true,
				takeCacheOwnership: true
			});
			if (updatedEntry) {
				entry = updatedEntry;
				if (params.sessionStore) params.sessionStore[params.sessionKey] = updatedEntry;
			}
		} catch (err) {
			logVerbose(`failed to persist derived prompt totalTokens: ${String(err)}`);
		}
	}
	const promptTokensSnapshot = Math.max(hasFreshPersistedPromptTokens ? persistedPromptTokens ?? 0 : 0, hasReliableTranscriptPromptTokens ? transcriptPromptTokens ?? 0 : 0);
	const projectedTokenCount = promptTokensSnapshot > 0 && (hasFreshPersistedPromptTokens || hasReliableTranscriptPromptTokens) ? resolveEffectivePromptTokens(promptTokensSnapshot, transcriptOutputTokens, promptTokenEstimate) : void 0;
	const tokenCountForFlush = typeof projectedTokenCount === "number" && Number.isFinite(projectedTokenCount) && projectedTokenCount > 0 ? projectedTokenCount : void 0;
	logVerbose(`memoryFlush check: sessionKey=${params.sessionKey} tokenCount=${tokenCountForFlush ?? "undefined"} contextWindow=${contextWindowTokens} threshold=${flushThreshold} isHeartbeat=${params.isHeartbeat} isCli=${isCli} memoryFlushWritable=${memoryFlushWritable} compactionCount=${entry?.compactionCount ?? 0} memoryFlushCompactionCount=${entry?.memoryFlush?.compactionCount ?? "undefined"} persistedPromptTokens=${persistedPromptTokens ?? "undefined"} persistedFresh=${entry?.totalTokensFresh === true} promptTokensEst=${promptTokenEstimate ?? "undefined"} transcriptPromptTokens=${transcriptPromptTokens ?? "undefined"} transcriptOutputTokens=${transcriptOutputTokens ?? "undefined"} projectedTokenCount=${projectedTokenCount ?? "undefined"} transcriptBytes=${transcriptByteSize ?? "undefined"} forceFlushTranscriptBytes=${forceFlushTranscriptBytes} forceFlushByTranscriptSize=${shouldForceFlushByTranscriptSize}`);
	if (!(shouldRunMemoryFlush({
		entry,
		tokenCount: tokenCountForFlush,
		contextWindowTokens,
		reserveTokensFloor: memoryFlushPlan.reserveTokensFloor,
		softThresholdTokens: memoryFlushPlan.softThresholdTokens
	}) || shouldForceFlushByTranscriptSize && entry != null && !hasAlreadyFlushedForCurrentCompaction(entry))) return {
		sessionEntry: entry ?? params.sessionEntry,
		outcome: "skipped"
	};
	logVerbose(`memoryFlush triggered: sessionKey=${params.sessionKey} tokenCount=${tokenCountForFlush ?? "undefined"} threshold=${flushThreshold}`);
	activeSessionEntry = entry ?? params.sessionEntry;
	params.replyOperation?.setPhase("memory_flushing");
	let bootstrapPromptWarningSignaturesSeen = resolveBootstrapWarningSignaturesSeen(activeSessionEntry?.systemPromptReport ?? (params.sessionKey ? activeSessionStore?.[params.sessionKey]?.systemPromptReport : void 0));
	const prepareMemoryFlushAttempt = async () => {
		const plan = resolveMemoryFlushPlan({
			cfg: params.cfg,
			nowMs: memoryDeps.now(),
			contextWindowTokens
		});
		if (!plan) return null;
		const writePath = plan.relativePath;
		await memoryDeps.ensureMemoryFlushTargetFile({
			workspaceDir: params.followupRun.run.workspaceDir,
			relativePath: writePath
		});
		return {
			plan,
			writePath,
			systemPrompt: [params.followupRun.run.extraSystemPrompt, plan.systemPrompt].filter(Boolean).join("\n\n"),
			selection: resolveMemoryFlushModelFallbackOptions(params.followupRun.run, plan.model, params.cfg),
			preparedRunAdmission: prepareSystemAgentRunAdmission(params.cfg, flushRunId, params.followupRun.run.agentId, "auto-reply.memory-flush")
		};
	};
	let preparedAttempt;
	try {
		preparedAttempt = await prepareMemoryFlushAttempt();
	} catch (error) {
		return await recordFailure(error);
	}
	if (!preparedAttempt) return {
		sessionEntry: activeSessionEntry,
		outcome: "skipped"
	};
	const { plan: activeMemoryFlushPlan, writePath: memoryFlushWritePath, systemPrompt: flushSystemPrompt, selection, preparedRunAdmission } = preparedAttempt;
	let memoryCompactionCompleted = false;
	let postCompactionSessionId;
	let visibleErrorPayloads = [];
	try {
		if (params.sessionKey) {
			memoryDeps.registerAgentRunContext(flushRunId, {
				sessionKey: params.sessionKey,
				...activeSessionEntry?.sessionId ? { sessionId: activeSessionEntry.sessionId } : {},
				verboseLevel: params.resolvedVerboseLevel,
				isControlUiVisible: false,
				projectSessionActive: false,
				projectSessionLifecycle: false,
				projectSessionMessages: false
			});
			flushRunRegistered = true;
		}
		await memoryDeps.runEmbeddedAgentEntry({
			selection: {
				cfg: selection.cfg,
				provider: selection.provider,
				model: selection.model,
				requestedRouteResolution: selection.requestedRouteResolution,
				agentDir: selection.agentDir,
				fallbacksOverride: selection.fallbacksOverride,
				userLockedAuthProfileId: params.followupRun.run.authProfileIdSource === "user" ? params.followupRun.run.authProfileId : void 0
			},
			identity: {
				runId: flushRunId,
				agentId: params.followupRun.run.agentId,
				sessionId: activeSessionEntry?.sessionId ?? params.followupRun.run.sessionId,
				sessionKey: selection.sessionKey,
				lane: "main"
			},
			harness: {
				workspaceDir: params.followupRun.run.workspaceDir,
				sessionKey: params.runtimePolicySessionKey ?? params.followupRun.run.runtimePolicySessionKey ?? params.sessionKey,
				preparation: { kind: "direct" },
				resolveRuntimeOverride: (provider) => resolveSessionRuntimeOverrideForProvider({
					provider,
					entry: activeSessionEntry,
					cfg: params.cfg
				})
			},
			behavior: { kind: "maintenance" },
			sessionOverride: { kind: "preserve" },
			abortSignal,
			runCandidate: async (provider, model, runOptions) => {
				const sessionRuntimeOverride = resolveSessionRuntimeOverrideForProvider({
					provider,
					entry: activeSessionEntry,
					cfg: params.cfg
				});
				const candidateThinkLevel = resolveCandidateThinkingLevel({
					cfg: params.cfg,
					provider,
					modelId: model,
					level: params.followupRun.run.thinkLevel,
					catalog: params.followupRun.run.thinkingCatalog,
					agentId: params.followupRun.run.agentId,
					sessionKey: params.runtimePolicySessionKey ?? params.followupRun.run.runtimePolicySessionKey ?? params.sessionKey,
					sessionEntry: activeSessionEntry,
					agentRuntime: sessionRuntimeOverride
				});
				const { embeddedContext, senderContext, runBaseParams } = buildEmbeddedRunExecutionParams({
					run: {
						...params.followupRun.run,
						thinkLevel: candidateThinkLevel
					},
					replyRoute: params.followupRun,
					sessionCtx: params.sessionCtx,
					hasRepliedRef: params.opts?.hasRepliedRef,
					provider,
					model,
					runId: flushRunId,
					allowTransientCooldownProbe: runOptions.allowTransientCooldownProbe
				});
				const result = await memoryDeps.runEmbeddedAgent({
					preparedRunAdmission,
					...embeddedContext,
					...senderContext,
					...runBaseParams,
					agentHarnessId: sessionRuntimeOverride,
					agentHarnessRuntimeOverride: sessionRuntimeOverride,
					sandboxSessionKey: params.runtimePolicySessionKey,
					allowGatewaySubagentBinding: true,
					silentExpected: true,
					allowEmptyAssistantReplyAsSilent: true,
					terminalReplyExpectation: "optional",
					trigger: "memory",
					memoryFlushWritePath,
					initialTurnTainted: !params.followupRun.run.senderIsOwner || sessionLogSnapshot?.turnTainted === true,
					prompt: activeMemoryFlushPlan.prompt,
					transcriptPrompt: "",
					extraSystemPrompt: flushSystemPrompt,
					isFinalFallbackAttempt: runOptions.isFinalFallbackAttempt,
					bootstrapPromptWarningSignaturesSeen,
					bootstrapPromptWarningSignature: bootstrapPromptWarningSignaturesSeen[bootstrapPromptWarningSignaturesSeen.length - 1],
					abortSignal,
					replyOperation: params.replyOperation,
					contextEngineLogicalTurnLease: runOptions.contextEngineLogicalTurnLease,
					onContextEngineTurnCandidate: runOptions.onContextEngineTurnCandidate,
					onAgentEvent: (evt) => {
						if (evt.stream === "compaction") {
							if ((typeof evt.data.phase === "string" ? evt.data.phase : "") === "end" && evt.data.completed === true) memoryCompactionCompleted = true;
						}
					}
				});
				visibleErrorPayloads = resolveVisibleMemoryFlushErrorPayloads(result.payloads);
				if (result.meta?.agentMeta?.sessionId) postCompactionSessionId = result.meta.agentMeta.sessionId;
				bootstrapPromptWarningSignaturesSeen = resolveBootstrapWarningSignaturesSeen(result.meta?.systemPromptReport);
				return result;
			}
		});
		const flushedCompactionCount = activeSessionEntry?.compactionCount ?? (params.sessionKey ? activeSessionStore?.[params.sessionKey]?.compactionCount : 0) ?? 0;
		if (memoryCompactionCompleted) {
			const previousSessionId = activeSessionEntry?.sessionId ?? params.followupRun.run.sessionId;
			await memoryDeps.incrementCompactionCount({
				agentId: params.followupRun.run.agentId,
				cfg: params.cfg,
				sessionEntry: activeSessionEntry,
				sessionStore: activeSessionStore,
				sessionKey: params.sessionKey,
				storePath: params.storePath,
				newSessionId: postCompactionSessionId
			});
			const updatedEntry = params.sessionKey ? activeSessionStore?.[params.sessionKey] : void 0;
			if (updatedEntry) {
				activeSessionEntry = updatedEntry;
				params.followupRun.run.sessionId = updatedEntry.sessionId;
				updateSessionId(updatedEntry.sessionId);
				const queueKey = params.followupRun.run.sessionKey ?? params.sessionKey;
				if (queueKey) {
					params.followupRun.run.sessionFile = queueKey;
					memoryDeps.refreshQueuedFollowupSession({
						key: queueKey,
						previousSessionId,
						nextSessionId: updatedEntry.sessionId,
						nextSessionFile: queueKey
					});
				}
			}
		}
		if (visibleErrorPayloads.length > 0) throw buildVisibleMemoryFlushFailure(visibleErrorPayloads);
		if (params.storePath && params.sessionKey) try {
			const updatedEntry = await memoryDeps.updateSessionEntry({
				storePath: params.storePath,
				sessionKey: params.sessionKey,
				skipMaintenance: true,
				takeCacheOwnership: true,
				update: async () => ({ memoryFlush: {
					kind: "succeeded",
					compactionCount: flushedCompactionCount
				} })
			});
			if (updatedEntry) {
				activeSessionEntry = updatedEntry;
				params.followupRun.run.sessionId = updatedEntry.sessionId;
				updateSessionId(updatedEntry.sessionId);
				const refreshedSessionKey = params.sessionKey ?? params.followupRun.run.sessionKey;
				if (refreshedSessionKey) params.followupRun.run.sessionFile = refreshedSessionKey;
			}
		} catch (err) {
			logVerbose(`failed to persist memory flush metadata: ${String(err)}`);
		}
		return {
			sessionEntry: activeSessionEntry,
			outcome: "completed"
		};
	} catch (error) {
		return await recordFailure(error);
	} finally {
		if (flushRunRegistered) memoryDeps.clearAgentRunContext(flushRunId);
		preparedRunAdmission.close();
	}
}
async function recordMemoryFlushFailure(error, run, initialSessionEntry) {
	let sessionEntry = initialSessionEntry;
	let outcome = "failed";
	const truncatedError = truncateMemoryFlushErrorMessage(error);
	const { sessionKey, storePath } = run;
	if (!isAbortError(error) && storePath && sessionKey) try {
		const adoptEntry = (entry) => {
			if (entry) {
				sessionEntry = entry;
				if (run.sessionStore) run.sessionStore[sessionKey] = entry;
			}
		};
		const updateEntry = (update) => memoryDeps.updateSessionEntry({
			storePath,
			sessionKey,
			skipMaintenance: true,
			takeCacheOwnership: true,
			update
		});
		const failedEntry = await updateEntry(async (currentEntry) => ({ memoryFlush: {
			kind: "failed",
			...currentEntry.memoryFlush?.compactionCount !== void 0 ? { compactionCount: currentEntry.memoryFlush.compactionCount } : {},
			failureCount: (currentEntry.memoryFlush?.kind === "failed" ? currentEntry.memoryFlush.failureCount : 0) + 1
		} }));
		adoptEntry(failedEntry);
		const failureCount = failedEntry?.memoryFlush?.kind === "failed" ? failedEntry.memoryFlush.failureCount : 0;
		logVerbose(`memory flush failed (attempt ${failureCount}/${MAX_FLUSH_FAILURES}): ${truncatedError}`);
		if (failedEntry && failureCount >= MAX_FLUSH_FAILURES) {
			outcome = "exhausted";
			logVerbose(`memory flush exhausted: skipping flush for this compaction cycle after ${failureCount} consecutive failures`);
			adoptEntry(await updateEntry(async (currentEntry) => ({ memoryFlush: {
				kind: "succeeded",
				compactionCount: currentEntry.compactionCount ?? 0
			} })));
			run.onVisibleErrorPayloads?.([{
				text: `⚠️ Memory flush failed after ${MAX_FLUSH_FAILURES} attempts; skipping for this cycle. It will retry after the next compaction.`,
				isError: true
			}]);
		}
	} catch (persistError) {
		logVerbose(`failed to persist memory flush failure metadata: ${String(persistError)}`);
	}
	else logVerbose(`memory flush run failed: ${String(error)}`);
	const visibleErrorPayload = buildMemoryFlushErrorPayload(error);
	if (visibleErrorPayload) run.onVisibleErrorPayloads?.([visibleErrorPayload]);
	return {
		sessionEntry,
		outcome
	};
}
//#endregion
export { runSessionCompactionIfNeeded as n, runMemoryFlushIfNeeded as t };
