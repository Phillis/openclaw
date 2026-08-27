import { s as asFiniteNumber } from "./number-coercion-CLj0HTDM.js";
//#region src/agents/usage.ts
/**
* Token usage normalization helpers.
* Converts provider-specific usage shapes into OpenClaw's normalized input,
* output, cache, reasoning, and total token accounting fields.
*/
/** Build a zeroed assistant usage snapshot. */
function makeZeroUsageSnapshot() {
	return {
		input: 0,
		output: 0,
		cacheRead: 0,
		cacheWrite: 0,
		totalTokens: 0,
		cost: {
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0,
			total: 0
		}
	};
}
/** Return true when any normalized usage bucket is positive. */
function hasNonzeroUsage(usage) {
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
	].some((v) => typeof v === "number" && Number.isFinite(v) && v > 0) || usage.contextUsage?.state === "unavailable";
}
const normalizeTokenCount = (value) => {
	const numeric = asFiniteNumber(value);
	if (numeric === void 0) return;
	if (numeric <= 0) return 0;
	return Math.min(Math.trunc(numeric), Number.MAX_SAFE_INTEGER);
};
/** Normalize provider-specific token usage fields into OpenClaw usage buckets. */
function normalizeUsage(raw) {
	if (!raw) return;
	const cli = raw;
	const cacheRead = normalizeTokenCount(raw.cacheRead ?? raw.cache_read ?? raw.cache_read_input_tokens ?? cli.cached_input_tokens ?? cli.cached ?? raw.cached_tokens ?? raw.input_tokens_details?.cached_tokens ?? raw.prompt_tokens_details?.cached_tokens);
	const cacheWrite = normalizeTokenCount(raw.cacheWrite ?? raw.cache_write ?? raw.cache_creation_input_tokens ?? cli.cache_write_input_tokens ?? cli.input_tokens_details?.cache_write_tokens ?? cli.prompt_tokens_details?.cache_write_tokens);
	const directInput = asFiniteNumber(raw.input);
	const rawInputValue = raw.input ?? raw.inputTokens ?? raw.input_tokens ?? raw.promptTokens ?? raw.prompt_tokens ?? raw.prompt_n ?? raw.timings?.prompt_n;
	const cliCacheReadIncludedInInput = cli.cached_input_tokens !== void 0 || cli.cached !== void 0;
	const openAiCacheReadIncludedInInput = raw.cached_tokens !== void 0 || raw.input_tokens_details?.cached_tokens !== void 0 || raw.prompt_tokens_details?.cached_tokens !== void 0;
	const cacheWriteIncludedInInput = cli.cache_write_input_tokens !== void 0 || cli.input_tokens_details?.cache_write_tokens !== void 0 || cli.prompt_tokens_details?.cache_write_tokens !== void 0;
	const rawInput = asFiniteNumber(rawInputValue);
	const normalizedInput = rawInput !== void 0 ? rawInput - (openAiCacheReadIncludedInInput || directInput === void 0 && cliCacheReadIncludedInInput ? cacheRead ?? 0 : 0) - (directInput === void 0 && cacheWriteIncludedInInput ? cacheWrite ?? 0 : 0) : rawInput;
	const input = normalizeTokenCount(normalizedInput);
	const output = normalizeTokenCount(raw.output ?? raw.outputTokens ?? raw.output_tokens ?? raw.completionTokens ?? raw.completion_tokens ?? raw.predicted_n ?? raw.timings?.predicted_n);
	const contextPromptTokens = raw.contextUsage?.state === "available" ? normalizeTokenCount(raw.contextUsage.promptTokens) : void 0;
	const contextTotalTokens = raw.contextUsage?.state === "available" ? normalizeTokenCount(raw.contextUsage.totalTokens) : void 0;
	const contextUsage = raw.contextUsage?.state === "unavailable" ? { state: "unavailable" } : contextPromptTokens !== void 0 && contextTotalTokens !== void 0 && contextTotalTokens >= contextPromptTokens ? {
		state: "available",
		promptTokens: contextPromptTokens,
		totalTokens: contextTotalTokens
	} : void 0;
	const reasoningTokens = normalizeTokenCount(raw.reasoningTokens ?? raw.reasoning_tokens ?? raw.completion_tokens_details?.reasoning_tokens ?? raw.output_tokens_details?.reasoning_tokens ?? raw.output_tokens_details?.thinking_tokens);
	const total = normalizeTokenCount(raw.total ?? raw.totalTokens ?? raw.total_tokens);
	if (input === void 0 && output === void 0 && cacheRead === void 0 && cacheWrite === void 0 && contextUsage === void 0 && reasoningTokens === void 0 && total === void 0) return;
	return {
		input,
		output,
		cacheRead,
		cacheWrite,
		...contextUsage ? { contextUsage } : {},
		...reasoningTokens !== void 0 ? { reasoningTokens } : {},
		total
	};
}
/**
* Maps normalized usage to OpenAI Chat Completions `usage` fields.
*
* `prompt_tokens` is input + cacheRead (cache write is excluded to match the
* OpenAI-style breakdown used by the compat endpoint).
*
* `total_tokens` is the greater of the component sum and aggregate `total` when
* present, so a partial breakdown cannot discard a valid upstream total.
*
* `prompt_tokens_details.cached_tokens` is emitted when `cacheRead > 0` so
* downstream chat-completions clients can compute the cache-aware blended
* cost. Field name and shape match OpenAI's documented usage breakdown:
* https://platform.openai.com/docs/guides/prompt-caching
*/
function toOpenAiChatCompletionsUsage(usage) {
	const input = usage?.input ?? 0;
	const output = usage?.output ?? 0;
	const cacheRead = usage?.cacheRead ?? 0;
	const promptTokens = Math.max(0, input + cacheRead);
	const completionTokens = Math.max(0, output);
	const componentTotal = promptTokens + completionTokens;
	const aggregateRaw = usage?.total;
	const aggregateTotal = typeof aggregateRaw === "number" && Number.isFinite(aggregateRaw) ? Math.max(0, aggregateRaw) : void 0;
	const totalTokens = aggregateTotal !== void 0 ? Math.max(componentTotal, aggregateTotal) : componentTotal;
	const reasoningTokens = normalizeTokenCount(usage?.reasoningTokens);
	return {
		prompt_tokens: promptTokens,
		completion_tokens: completionTokens,
		total_tokens: totalTokens,
		...cacheRead > 0 ? { prompt_tokens_details: { cached_tokens: cacheRead } } : {},
		...reasoningTokens !== void 0 ? { completion_tokens_details: { reasoning_tokens: reasoningTokens } } : {}
	};
}
/**
* Maps normalized usage to OpenAI Responses `usage` fields.
*
* Responses reports cache reads and writes as subsets of `input_tokens`, so
* recombine OpenClaw's separately priced buckets and retain their details.
* Reasoning tokens remain a detail of `output_tokens`, not an extra bucket.
*/
function toOpenAiResponsesUsage(usage) {
	const input = Math.max(0, usage?.input ?? 0);
	const output = Math.max(0, usage?.output ?? 0);
	const cacheRead = Math.max(0, usage?.cacheRead ?? 0);
	const cacheWrite = Math.max(0, usage?.cacheWrite ?? 0);
	const reasoningTokens = Math.max(0, usage?.reasoningTokens ?? 0);
	const inputTokens = input + cacheRead + cacheWrite;
	const componentTotal = inputTokens + output;
	const aggregateTotal = Math.max(0, usage?.total ?? 0);
	return {
		input_tokens: inputTokens,
		input_tokens_details: {
			cached_tokens: cacheRead,
			cache_write_tokens: cacheWrite
		},
		output_tokens: output,
		output_tokens_details: { reasoning_tokens: reasoningTokens },
		total_tokens: Math.max(componentTotal, aggregateTotal)
	};
}
/** Derive prompt/context tokens from normalized input and cache buckets. */
function derivePromptTokens(usage) {
	if (!usage) return;
	const input = usage.input ?? 0;
	const cacheRead = usage.cacheRead ?? 0;
	const cacheWrite = usage.cacheWrite ?? 0;
	const sum = input + cacheRead + cacheWrite;
	return sum > 0 ? sum : void 0;
}
function derivePromptTokensFromTotal(usage) {
	const total = usage?.total;
	const output = usage?.output;
	if (typeof total !== "number" || !Number.isFinite(total) || total <= 0 || typeof output !== "number" || !Number.isFinite(output) || output < 0) return;
	const promptTokens = total - output;
	return promptTokens > 0 ? promptTokens : void 0;
}
/** Resolve context prompt tokens from explicit override, last call, or aggregate usage. */
function deriveContextPromptTokens(params) {
	const promptOverride = params.promptTokens;
	if (typeof promptOverride === "number" && Number.isFinite(promptOverride) && promptOverride > 0) return promptOverride;
	if (params.lastCallUsage?.contextUsage?.state === "unavailable") return;
	if (params.lastCallUsage?.contextUsage?.state === "available") return params.lastCallUsage.contextUsage.promptTokens;
	const lastCallPromptTokens = derivePromptTokens(params.lastCallUsage) ?? derivePromptTokensFromTotal(params.lastCallUsage);
	if (lastCallPromptTokens !== void 0) return lastCallPromptTokens;
	if (params.usage?.contextUsage?.state === "unavailable") return;
	if (params.usage?.contextUsage?.state === "available") return params.usage.contextUsage.promptTokens;
	return derivePromptTokens(params.usage);
}
/** Derive the session prompt-token snapshot stored for context display. */
function deriveSessionTotalTokens(params) {
	const promptOverride = params.promptTokens;
	const hasPromptOverride = typeof promptOverride === "number" && Number.isFinite(promptOverride) && promptOverride > 0;
	const usage = params.usage;
	if (!params.lastCallUsage && !usage && !hasPromptOverride) return;
	const promptTokens = deriveContextPromptTokens({
		lastCallUsage: params.lastCallUsage,
		promptTokens: hasPromptOverride ? promptOverride : void 0,
		usage
	});
	if (!(typeof promptTokens === "number") || !Number.isFinite(promptTokens) || promptTokens <= 0) return;
	return promptTokens;
}
//#endregion
export { makeZeroUsageSnapshot as a, toOpenAiResponsesUsage as c, hasNonzeroUsage as i, derivePromptTokens as n, normalizeUsage as o, deriveSessionTotalTokens as r, toOpenAiChatCompletionsUsage as s, deriveContextPromptTokens as t };
