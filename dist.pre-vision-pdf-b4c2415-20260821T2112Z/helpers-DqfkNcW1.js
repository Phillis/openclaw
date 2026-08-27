import { i as generateSecureToken } from "./secure-random-Ds4AFLgz.js";
import { dt as deriveContextPromptTokens, gt as normalizeUsage, mt as hasNonzeroUsage } from "./session-accessor-Bi6bzKQE.js";
import { n as extractAssistantTextForPhase } from "./chat-message-content-BibNiFIq.js";
import { a as extractAssistantVisibleText } from "./embedded-agent-utils-c5haLV7t.js";
//#region src/agents/embedded-agent-runner/usage-accumulator.ts
const createUsageAccumulator = () => ({
	input: 0,
	output: 0,
	cacheRead: 0,
	cacheWrite: 0,
	reasoningTokens: 0,
	total: 0,
	assistantTurns: 0
});
const hasUsageValues = (usage) => {
	if (!usage) return false;
	return [
		usage.input,
		usage.output,
		usage.cacheRead,
		usage.cacheWrite,
		usage.contextUsage?.state === "available" ? usage.contextUsage.promptTokens : void 0,
		usage.contextUsage?.state === "available" ? usage.contextUsage.totalTokens : void 0,
		usage.reasoningTokens,
		usage.total
	].some((value) => typeof value === "number" && Number.isFinite(value) && value > 0) || usage.contextUsage?.state === "unavailable";
};
const mergeUsageIntoAccumulator = (target, usage) => {
	if (!hasUsageValues(usage)) return;
	const callTotal = usage.total ?? (usage.input ?? 0) + (usage.output ?? 0) + (usage.cacheRead ?? 0) + (usage.cacheWrite ?? 0);
	target.input += usage.input ?? 0;
	target.output += usage.output ?? 0;
	target.cacheRead += usage.cacheRead ?? 0;
	target.cacheWrite += usage.cacheWrite ?? 0;
	target.reasoningTokens += usage.reasoningTokens ?? 0;
	target.total += callTotal;
};
/**
* Folds one attempt's run stats into the accumulator. Attempt cleanup clears
* the per-attempt tool-search catalog, so retries would otherwise discard
* earlier bridge counts and undercount the documented cumulative run totals.
*/
const mergeAttemptRunStatsIntoAccumulator = (target, attempt) => {
	target.assistantTurns += attempt.assistantTurns ?? 0;
	if (!attempt.bridgeCalls) return;
	const bridgeCalls = target.bridgeCalls ?? {
		search: 0,
		describe: 0,
		call: 0
	};
	bridgeCalls.search += attempt.bridgeCalls.search;
	bridgeCalls.describe += attempt.bridgeCalls.describe;
	bridgeCalls.call += attempt.bridgeCalls.call;
	target.bridgeCalls = bridgeCalls;
};
const toNormalizedUsage = (usage) => {
	if (!(usage.input > 0 || usage.output > 0 || usage.cacheRead > 0 || usage.cacheWrite > 0 || usage.reasoningTokens > 0 || usage.total > 0)) return;
	return {
		input: usage.input || void 0,
		output: usage.output || void 0,
		cacheRead: usage.cacheRead || void 0,
		cacheWrite: usage.cacheWrite || void 0,
		...usage.reasoningTokens > 0 ? { reasoningTokens: usage.reasoningTokens } : {},
		total: usage.total || void 0
	};
};
//#endregion
//#region src/agents/embedded-agent-runner/run/helpers.ts
/**
* Shared run helpers for retry limits, model reporting, and final text.
*/
const RUNTIME_AUTH_REFRESH_MARGIN_MS = 300 * 1e3;
const RUNTIME_AUTH_REFRESH_RETRY_MS = 60 * 1e3;
const RUNTIME_AUTH_REFRESH_MIN_DELAY_MS = 5 * 1e3;
const DEFAULT_OVERLOAD_FAILOVER_BACKOFF_MS = 0;
const DEFAULT_MAX_OVERLOAD_PROFILE_ROTATIONS = 1;
const DEFAULT_MAX_RATE_LIMIT_PROFILE_ROTATIONS = 1;
const SAME_MODEL_RATE_LIMIT_BACKOFF_STEP_MS = 1e4;
const SAME_MODEL_RATE_LIMIT_MAX_BACKOFF_MS = 6e4;
function resolveOverloadFailoverBackoffMs() {
	return DEFAULT_OVERLOAD_FAILOVER_BACKOFF_MS;
}
function resolveOverloadProfileRotationLimit() {
	return DEFAULT_MAX_OVERLOAD_PROFILE_ROTATIONS;
}
function resolveRateLimitProfileRotationLimit() {
	return DEFAULT_MAX_RATE_LIMIT_PROFILE_ROTATIONS;
}
/**
* Backoff before the next same-model rate_limit retry, given how many such
* retries already happened. Linear and deterministic (no jitter) so RPM
* windows clear predictably and tests can assert exact values.
*/
function resolveSameModelRateLimitRetryDelayMs(params) {
	const backoffDelayMs = SAME_MODEL_RATE_LIMIT_BACKOFF_STEP_MS * (Math.max(0, params.retriesSoFar) + 1);
	const backoffMs = Math.min(SAME_MODEL_RATE_LIMIT_MAX_BACKOFF_MS, backoffDelayMs);
	const retryAfterMs = Number.isFinite(params.retryAfterSeconds) ? Math.ceil(Math.max(0, params.retryAfterSeconds ?? 0) * 1e3) : 0;
	return Math.max(backoffMs, Math.min(SAME_MODEL_RATE_LIMIT_MAX_BACKOFF_MS, retryAfterMs));
}
function resolveNextSameModelRateLimitRetryCount(params) {
	return params.retriedSameModelRateLimit ? Math.max(0, params.retriesSoFar) + 1 : 0;
}
const ANTHROPIC_MAGIC_STRING_TRIGGER_REFUSAL = "ANTHROPIC_MAGIC_STRING_TRIGGER_REFUSAL";
const ANTHROPIC_MAGIC_STRING_REPLACEMENT = "ANTHROPIC MAGIC STRING TRIGGER REFUSAL (redacted)";
function scrubAnthropicRefusalMagic(prompt) {
	if (!prompt.includes(ANTHROPIC_MAGIC_STRING_TRIGGER_REFUSAL)) return prompt;
	return prompt.replaceAll(ANTHROPIC_MAGIC_STRING_TRIGGER_REFUSAL, ANTHROPIC_MAGIC_STRING_REPLACEMENT);
}
/** Anthropic's transport interprets this marker even for native-owned attempts. */
function resolveEmbeddedAttemptBasePrompt(params) {
	if (params.provider !== "anthropic") return params.prompt;
	return scrubAnthropicRefusalMagic(params.prompt);
}
function createRunRecoveryDiagId() {
	return `ovf-${Date.now().toString(36)}-${generateSecureToken(4)}`;
}
const BASE_RUN_RETRY_ITERATIONS = 24;
const RUN_RETRY_ITERATIONS_PER_PROFILE = 8;
const MIN_RUN_RETRY_ITERATIONS = 32;
const MAX_RUN_RETRY_ITERATIONS = 160;
function resolveMaxRunRetryIterations(profileCandidateCount) {
	const scaled = BASE_RUN_RETRY_ITERATIONS + Math.max(1, profileCandidateCount) * RUN_RETRY_ITERATIONS_PER_PROFILE;
	return Math.min(MAX_RUN_RETRY_ITERATIONS, Math.max(MIN_RUN_RETRY_ITERATIONS, scaled));
}
function resolveActiveErrorContext(params) {
	return resolveReportedModelRef(params);
}
function isAssistantForModelRef(assistant, ref) {
	if (!assistant) return false;
	const resolved = resolveReportedModelRef({
		...ref,
		assistant
	});
	return resolved.provider === ref.provider && resolved.model === ref.model;
}
function isEmbeddedHarnessProvider(provider) {
	return provider.trim().toLowerCase() === "openclaw";
}
function resolveReportedModelRef(params) {
	const assistantProvider = params.assistant?.provider?.trim();
	const assistantModel = params.assistant?.model?.trim();
	if (!assistantProvider) return {
		provider: params.provider,
		model: assistantModel || params.model
	};
	if (isEmbeddedHarnessProvider(assistantProvider)) return {
		provider: params.provider,
		model: params.model
	};
	return {
		provider: assistantProvider,
		model: assistantModel || params.model
	};
}
function resolveLatestCallUsage(params) {
	const currentAttempt = params.currentAttemptCandidates.find(hasNonzeroUsage);
	const carriedUsage = hasNonzeroUsage(params.carriedUsage) ? params.carriedUsage : void 0;
	const transcriptFallback = hasNonzeroUsage(params.transcriptFallback) ? params.transcriptFallback : void 0;
	return {
		currentAttempt,
		latest: currentAttempt ?? carriedUsage ?? transcriptFallback
	};
}
function normalizeAssistantUsageForContext(assistant) {
	if (assistant?.api === "cli" && assistant.usage && typeof assistant.usage === "object" && !Array.isArray(assistant.usage) && assistant.usage.contextUsage === void 0) return { contextUsage: { state: "unavailable" } };
	return normalizeUsage(assistant?.usage);
}
function buildUsageAgentMetaFields(params) {
	const usage = toNormalizedUsage(params.usageAccumulator);
	const latestUsage = normalizeUsage(params.latestUsage);
	const lastCallUsage = hasNonzeroUsage(latestUsage) ? latestUsage : hasNonzeroUsage(params.lastRunPromptUsage) ? params.lastRunPromptUsage : void 0;
	return {
		usage,
		lastCallUsage,
		promptTokens: deriveContextPromptTokens({ lastCallUsage })
	};
}
/**
* Build agentMeta for error return paths, preserving accumulated usage so that
* session totalTokens reflects the actual context size rather than going stale.
* Without this, error returns omit usage and the session keeps whatever
* totalTokens was set by the previous successful run.
*/
function buildErrorAgentMeta(params) {
	const usageMeta = buildUsageAgentMetaFields({
		usageAccumulator: params.usageAccumulator,
		latestUsage: normalizeAssistantUsageForContext(params.currentAttemptAssistant),
		lastRunPromptUsage: params.lastRunPromptUsage
	});
	return {
		sessionId: params.sessionId,
		...params.sessionFile ? { sessionFile: params.sessionFile } : {},
		provider: params.provider,
		model: params.model,
		...params.contextTokens ? { contextTokens: params.contextTokens } : {},
		...usageMeta.usage ? { usage: usageMeta.usage } : {},
		...usageMeta.lastCallUsage ? { lastCallUsage: usageMeta.lastCallUsage } : {},
		...usageMeta.promptTokens ? { promptTokens: usageMeta.promptTokens } : {}
	};
}
function resolveFinalAssistantVisibleText(lastAssistant) {
	if (!lastAssistant) return;
	return extractAssistantVisibleText(lastAssistant).trim() || void 0;
}
function resolveFinalAssistantRawText(lastAssistant) {
	if (!lastAssistant) return;
	return (extractAssistantTextForPhase(lastAssistant, { phase: "final_answer" }) ?? extractAssistantTextForPhase(lastAssistant) ?? "").trim() || void 0;
}
//#endregion
export { mergeUsageIntoAccumulator as C, mergeAttemptRunStatsIntoAccumulator as S, resolveOverloadProfileRotationLimit as _, buildUsageAgentMetaFields as a, resolveSameModelRateLimitRetryDelayMs as b, normalizeAssistantUsageForContext as c, resolveFinalAssistantRawText as d, resolveFinalAssistantVisibleText as f, resolveOverloadFailoverBackoffMs as g, resolveNextSameModelRateLimitRetryCount as h, buildErrorAgentMeta as i, resolveActiveErrorContext as l, resolveMaxRunRetryIterations as m, RUNTIME_AUTH_REFRESH_MIN_DELAY_MS as n, createRunRecoveryDiagId as o, resolveLatestCallUsage as p, RUNTIME_AUTH_REFRESH_RETRY_MS as r, isAssistantForModelRef as s, RUNTIME_AUTH_REFRESH_MARGIN_MS as t, resolveEmbeddedAttemptBasePrompt as u, resolveRateLimitProfileRotationLimit as v, createUsageAccumulator as x, resolveReportedModelRef as y };
