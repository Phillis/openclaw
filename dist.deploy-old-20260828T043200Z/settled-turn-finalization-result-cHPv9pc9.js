import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { i as toErrorObject } from "./error-coercion-CKFmnpjH.js";
import { n as estimateStringChars } from "./cjk-chars-B-gnWt4x.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { F as resolveTimerTimeoutMs, N as resolveOptionalIntegerOption, w as parseStrictPositiveInteger } from "./number-coercion-CLj0HTDM.js";
import { s as sleepWithAbort } from "./src-BQ327IOM.js";
import { n as isAbortError } from "./abort-signal-D2k14JsD.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { D as freezeDiagnosticTraceContext } from "./diagnostic-events-BGzDm6gu.js";
import { t as createSubsystemLogger } from "./subsystem-a4KzJVZG.js";
import { n as resolveRuntimeWorkerUrl } from "./runtime-worker-url-DTpp6ccf.js";
import { o as isSilentReplyText } from "./tokens-DbQz-n_m.js";
import { t as retryAsync } from "./retry-DIUON3ys.js";
import { n as resolvePluginControlPlaneFingerprint } from "./plugin-control-plane-context-3yWCh0UH.js";
import { s as normalizeProviderId } from "./model-ref-shared-D4yx0hwT.js";
import "./defaults-CdX9UGcX.js";
import "./backoff-BkMI1WEL.js";
import { d as resolveProviderRuntimePlugin } from "./provider-hook-runtime-C6OwLIWh.js";
import { dt as generateSummary } from "./sessions-PHTfe5gZ.js";
import { B as COMPACTION_SUMMARY_SUFFIX, L as BRANCH_SUMMARY_PREFIX, M as CompactionError, R as BRANCH_SUMMARY_SUFFIX, V as bashExecutionToText, _ as calculateContextTokens, m as IMAGE_BLOCK_TOKENS, z as COMPACTION_SUMMARY_PREFIX } from "./agent-core-CK8RXNcu.js";
import "./session-manager-codec-BQhwecUx.js";
import { t as resolveEffectiveCompactionReserveTokens } from "./agent-compaction-constants-CzVH4jGZ.js";
import { c as buildSummaryChunks, d as projectCompactionMessagesForPlanning, f as sanitizeCompactionMessages, l as computeAdaptiveChunkRatio, o as buildOversizedFallbackPlan, r as SAFETY_MARGIN, s as buildStageSplitPlan } from "./compaction-planning-Cn01L4m1.js";
import "./model-selection-DHDS-v4K.js";
import { u as normalizeAgentRunAttemptTerminal } from "./agent-run-terminal-outcome-DafVNgmX.js";
import { d as isTimeoutError } from "./failover-error-DVBvcQuA.js";
import { o as isGoogleModelApi } from "./embedded-agent-helpers-B7K3_Rpy.js";
import { t as estimateToolResultReductionPotential } from "./tool-result-truncation-BZr2-1Tz.js";
import { u as shouldDropClaudeThinkingBlocks } from "./provider-replay-helpers-By8YdHBX.js";
import { n as buildAgentHookContextIdentityFields, t as buildAgentHookContextChannelFields } from "./hook-agent-context-J29Zot7j.js";
import { f as resolveFinalAssistantVisibleText } from "./helpers-B90C6K_y.js";
import { Worker } from "node:worker_threads";
//#region src/agents/compaction-planning-worker-runtime.ts
const COMPACTION_PLANNING_WORKER_TIMEOUT_MS = 6e4;
var CompactionPlanningWorkerError = class extends Error {
	constructor(message, code) {
		super(message);
		this.code = code;
		this.name = "CompactionPlanningWorkerError";
	}
};
function compactionPlanningWorkerUrl() {
	return resolveRuntimeWorkerUrl({
		currentModuleUrl: import.meta.url,
		sourceWorkerName: "compaction-planning.worker",
		distWorkerPath: "agents/compaction-planning.worker.js"
	});
}
function runCompactionPlanningWorker(params) {
	const abortError = () => toErrorObject(params.signal?.reason ?? /* @__PURE__ */ new Error("compaction planning aborted"), "Non-Error rejection");
	if (params.signal?.aborted) return Promise.reject(abortError());
	const workerUrl = params.workerUrl ?? compactionPlanningWorkerUrl();
	const sourceWorkerExecArgv = workerUrl.pathname.endsWith(".ts") ? ["--import", "tsx"] : void 0;
	let worker;
	try {
		worker = new Worker(workerUrl, {
			workerData: params.input,
			execArgv: sourceWorkerExecArgv
		});
	} catch (error) {
		return Promise.reject(new CompactionPlanningWorkerError(error instanceof Error ? error.message : String(error), "unavailable"));
	}
	worker.unref?.();
	return new Promise((resolve, reject) => {
		let settled = false;
		const timeout = setTimeout(() => fail(new CompactionPlanningWorkerError("compaction planning worker timed out", "timeout")), resolveTimerTimeoutMs(params.timeoutMs, COMPACTION_PLANNING_WORKER_TIMEOUT_MS));
		const abort = () => fail(abortError());
		const settle = (finish, terminate) => {
			if (settled) return;
			settled = true;
			clearTimeout(timeout);
			params.signal?.removeEventListener("abort", abort);
			worker.removeAllListeners();
			if (terminate) worker.terminate();
			finish();
		};
		const fail = (error, terminate = true) => settle(() => reject(error), terminate);
		params.signal?.addEventListener("abort", abort, { once: true });
		worker.once("message", (message) => {
			settle(() => {
				if (message.status === "ok") {
					resolve(message.value);
					return;
				}
				reject(new CompactionPlanningWorkerError(message.error, "failed"));
			}, false);
		});
		worker.once("error", (error) => {
			const message = error instanceof Error ? error.message : String(error);
			fail(new CompactionPlanningWorkerError(message, "unavailable"));
		});
		worker.once("exit", (code) => {
			if (code === 0) return;
			fail(new CompactionPlanningWorkerError(`compaction planning worker exited with code ${code}`, "unavailable"), false);
		});
	});
}
//#endregion
//#region src/agents/compaction-planning-worker.ts
/**
* Runs CPU-heavy compaction planning in a worker thread when histories are
* large enough to risk starving the main event loop.
*/
const COMPACTION_PLANNING_WORKER_MIN_MESSAGES = 64;
function restoreIndexedMessages(source, indexes) {
	return indexes.map((index) => {
		const message = source.at(index);
		if (!Number.isInteger(index) || index < 0 || !message) throw new CompactionPlanningWorkerError("compaction planning result contains an invalid message index", "failed");
		return message;
	});
}
async function runCompactionPlan(params) {
	params.signal?.throwIfAborted();
	const messages = sanitizeCompactionMessages(params.input.messages);
	if (messages.length < COMPACTION_PLANNING_WORKER_MIN_MESSAGES) return params.fallback(params.input.messages);
	try {
		const value = await runCompactionPlanningWorker({
			input: {
				...params.input,
				messages: projectCompactionMessagesForPlanning(messages)
			},
			signal: params.signal
		});
		params.signal?.throwIfAborted();
		if (value.kind !== params.input.kind) throw new CompactionPlanningWorkerError("unexpected compaction planning worker result", "failed");
		return params.restore(value, messages);
	} catch (error) {
		if (error instanceof CompactionPlanningWorkerError && error.code === "unavailable") {
			params.signal?.throwIfAborted();
			return params.fallback(messages);
		}
		throw error;
	}
}
/** Builds summary chunks, offloading large histories to the planning worker. */
async function buildSummaryChunksWithWorker(params) {
	const { signal, ...planningInput } = params;
	return runCompactionPlan({
		input: {
			kind: "summaryChunks",
			...planningInput
		},
		signal,
		fallback: (messages) => buildSummaryChunks({
			...planningInput,
			messages
		}),
		restore: (value, messages) => value.chunkIndexes.map((indexes) => restoreIndexedMessages(messages, indexes))
	});
}
/** Builds an oversized-message fallback plan, using the worker when worthwhile. */
async function buildOversizedFallbackPlanWithWorker(params) {
	const { signal, ...planningInput } = params;
	return runCompactionPlan({
		input: {
			kind: "oversizedFallback",
			...planningInput
		},
		signal,
		fallback: (messages) => buildOversizedFallbackPlan({
			...planningInput,
			messages
		}),
		restore: (value, messages) => ({
			smallMessages: restoreIndexedMessages(messages, value.smallMessageIndexes),
			oversizedNotes: value.oversizedNotes
		})
	});
}
/** Builds a staged summarization split plan with worker fallback. */
async function buildStageSplitPlanWithWorker(params) {
	const { signal, ...planningInput } = params;
	return runCompactionPlan({
		input: {
			kind: "stageSplit",
			...planningInput
		},
		signal,
		fallback: (messages) => buildStageSplitPlan({
			...planningInput,
			messages
		}),
		restore: (value, messages) => value.mode === "split" ? {
			mode: "split",
			chunks: value.chunkIndexes.map((indexes) => restoreIndexedMessages(messages, indexes))
		} : { mode: "single" }
	});
}
/** Computes the adaptive compaction chunk ratio with worker fallback. */
async function computeAdaptiveChunkRatioWithWorker(params) {
	const { signal, ...planningInput } = params;
	return runCompactionPlan({
		input: {
			kind: "adaptiveChunkRatio",
			...planningInput
		},
		signal,
		fallback: () => computeAdaptiveChunkRatio(planningInput.messages, planningInput.contextWindow),
		restore: (value) => value.ratio
	});
}
//#endregion
//#region src/agents/compaction.ts
const log = createSubsystemLogger("compaction");
const DEFAULT_SUMMARY_FALLBACK = "No prior history.";
const MERGE_SUMMARIES_INSTRUCTIONS = [
	"Merge these partial summaries into a single cohesive summary.",
	"",
	"MUST PRESERVE:",
	"- Active tasks and their current status (in-progress, blocked, pending)",
	"- Batch operation progress (e.g., '5/17 items completed')",
	"- The last thing the user requested and what was being done about it",
	"- Decisions made and their rationale",
	"- TODOs, open questions, and constraints",
	"- Any commitments or follow-ups promised",
	"",
	"PRIORITIZE recent context over older history. The agent needs to know",
	"what it was doing, not just what was discussed."
].join("\n");
const IDENTIFIER_PRESERVATION_INSTRUCTIONS = "Preserve all opaque identifiers exactly as written (no shortening or reconstruction), including UUIDs, hashes, IDs, hostnames, IPs, ports, URLs, and file names.";
function resolveIdentifierPreservationInstructions(instructions) {
	if (instructions?.identifierPolicy === "off") return;
	return instructions?.identifierPolicy === "custom" ? instructions.identifierInstructions?.trim() || IDENTIFIER_PRESERVATION_INSTRUCTIONS : IDENTIFIER_PRESERVATION_INSTRUCTIONS;
}
/** Combines identifier-preservation and caller-provided compaction instructions. */
function buildCompactionSummarizationInstructions(customInstructions, instructions) {
	const custom = customInstructions?.trim();
	const identifierPreservation = resolveIdentifierPreservationInstructions(instructions);
	if (!custom) return identifierPreservation;
	return identifierPreservation ? `${identifierPreservation}\n\nAdditional focus:\n${custom}` : `Additional focus:\n${custom}`;
}
async function summarizeChunks(params) {
	if (params.messages.length === 0) return params.previousSummary ?? DEFAULT_SUMMARY_FALLBACK;
	const chunks = await buildSummaryChunksWithWorker({
		messages: params.messages,
		maxChunkTokens: params.maxChunkTokens,
		signal: params.signal
	});
	let summary = params.previousSummary;
	const effectiveInstructions = buildCompactionSummarizationInstructions(params.customInstructions, params.summarizationInstructions);
	for (const [completedChunks, chunk] of chunks.entries()) try {
		summary = await retryAsync(() => generateSummary(chunk, params.model, params.reserveTokens, params.apiKey, params.headers, params.signal, effectiveInstructions, summary, params.thinkingLevel, params.streamFn), {
			attempts: 3,
			minDelayMs: 500,
			maxDelayMs: 5e3,
			jitter: .2,
			label: "compaction/generateSummary",
			sleep: (ms) => sleepWithAbort(ms, params.signal),
			shouldRetry: (err) => !params.signal.aborted && (isAbortError(err) || !isTimeoutError(err))
		});
	} catch (err) {
		if (params.signal.aborted || !isAbortError(err) && isTimeoutError(err) || completedChunks === 0 || summary === void 0) throw err;
		log.warn("chunk summarization failed after retries; partial summary available", {
			err,
			completedChunks,
			totalChunks: chunks.length
		});
		const partial = /* @__PURE__ */ new Error("partial summarization failure");
		partial.partialSummary = `${summary}\n\n[Partial summary: chunks 1-${completedChunks} of ${chunks.length} were summarized. Chunks ${completedChunks + 1}-${chunks.length} could not be processed.]`;
		throw partial;
	}
	return summary ?? DEFAULT_SUMMARY_FALLBACK;
}
/**
* Summarize with progressive fallback for handling oversized messages.
* If full summarization fails, tries partial summarization excluding oversized messages.
*/
async function summarizeWithFallback(params) {
	const { messages, contextWindow } = params;
	if (messages.length === 0) return params.previousSummary ?? DEFAULT_SUMMARY_FALLBACK;
	let partialSummaryFallback;
	let lastError;
	try {
		return await summarizeChunks(params);
	} catch (err) {
		lastError = err;
		if (params.signal.aborted) throw lastError;
		log.warn(`Full summarization failed: ${formatErrorMessage(lastError)}`);
		partialSummaryFallback = lastError.partialSummary;
	}
	const { smallMessages, oversizedNotes } = await buildOversizedFallbackPlanWithWorker({
		messages,
		contextWindow,
		signal: params.signal
	});
	const oversizedSuffix = oversizedNotes.length > 0 ? `\n\n${oversizedNotes.join("\n")}` : "";
	if (smallMessages.length > 0 && smallMessages.length !== messages.length) try {
		return await summarizeChunks({
			...params,
			messages: smallMessages
		}) + oversizedSuffix;
	} catch (partialError) {
		lastError = partialError;
		if (params.signal.aborted) throw lastError;
		log.warn(`Partial summarization also failed: ${formatErrorMessage(lastError)}`);
		const retryPartial = lastError.partialSummary;
		if (retryPartial) partialSummaryFallback = retryPartial + oversizedSuffix;
	}
	if (partialSummaryFallback) return partialSummaryFallback;
	throw new CompactionError("summarization_failed", `All summarization attempts failed for ${messages.length} messages. Last error: ${lastError instanceof Error ? lastError.message : String(lastError)}`, lastError instanceof Error ? lastError : void 0);
}
/** Extracts a compact timestamp range from a chunk of messages for merge metadata. */
function extractChunkTimeRange(chunk) {
	let earliest = Number.POSITIVE_INFINITY;
	let latest = 0;
	for (const message of chunk) {
		const timestamp = message.timestamp;
		if (typeof timestamp !== "number" || timestamp <= 0 || !Number.isFinite(new Date(timestamp).getTime())) continue;
		earliest = Math.min(earliest, timestamp);
		latest = Math.max(latest, timestamp);
	}
	if (!Number.isFinite(earliest)) return "";
	const format = (timestamp) => new Date(timestamp).toISOString().replace("T", " ").slice(0, 16);
	return ` [${earliest === latest ? format(earliest) : `${format(earliest)} — ${format(latest)}`} UTC]`;
}
/** Summarizes history in multiple stages when a single pass would be too large. */
async function summarizeInStages(params) {
	const { messages } = params;
	if (messages.length === 0) return await summarizeWithFallback(params);
	const plan = await buildStageSplitPlanWithWorker({
		messages,
		maxChunkTokens: params.maxChunkTokens,
		parts: params.parts,
		minMessagesForSplit: params.minMessagesForSplit,
		signal: params.signal
	});
	if (plan.mode === "single") return await summarizeWithFallback(params);
	const partialSummaries = [];
	for (const [index, chunk] of plan.chunks.entries()) try {
		const summary = await summarizeWithFallback({
			...params,
			messages: chunk,
			previousSummary: void 0
		});
		partialSummaries.push(summary);
	} catch (err) {
		if (err instanceof CompactionError) throw err;
		throw new CompactionError("summarization_failed", `Chunk ${index + 1} summarization failed: ${err instanceof Error ? err.message : String(err)}`, err instanceof Error ? err : void 0);
	}
	if (partialSummaries.length === 1) {
		const summary = partialSummaries.at(0);
		if (summary === void 0) throw new Error("Compaction summary plan produced no summary");
		return summary;
	}
	const now = Date.now();
	const summaryMessages = partialSummaries.map((summary, index) => {
		const chunk = plan.chunks.at(index);
		if (!chunk) throw new Error(`Compaction summary plan is missing chunk ${index}`);
		const timeRange = extractChunkTimeRange(chunk);
		return {
			role: "user",
			content: `${index === 0 ? `[Chunk 1 — oldest messages${timeRange}]` : index === partialSummaries.length - 1 ? `[Chunk ${partialSummaries.length} — most recent messages${timeRange}]` : `[Chunk ${index + 1}/${partialSummaries.length}${timeRange}]`}\n${summary}`,
			timestamp: now - (partialSummaries.length - 1 - index)
		};
	});
	const custom = params.customInstructions?.trim();
	const mergeInstructions = custom ? `${MERGE_SUMMARIES_INSTRUCTIONS}\n\n${custom}` : MERGE_SUMMARIES_INSTRUCTIONS;
	return await summarizeWithFallback({
		...params,
		messages: summaryMessages,
		customInstructions: mergeInstructions
	});
}
/** Resolves a positive context-window token count from model metadata. */
function resolveContextWindowTokens(model) {
	const effective = model?.contextTokens ?? model?.contextWindow;
	return Math.max(1, Math.floor(effective ?? 2e5));
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.compactionTestApi")] = {
	buildCompactionSummarizationInstructions,
	summarizeWithFallback
};
//#endregion
//#region src/agents/embedded-agent-runner/run/preemptive-compaction.ts
/**
* Estimates prompt pressure and decides pre-prompt compaction routing.
*/
const PREEMPTIVE_OVERFLOW_ERROR_TEXT = "Context overflow: prompt too large for the model (precheck).";
const ESTIMATED_CHARS_PER_TOKEN = 4;
const TOOL_RESULT_CHARS_PER_TOKEN = 2;
const JSON_PAYLOAD_CHARS_PER_TOKEN = 3;
const MESSAGE_BOUNDARY_OVERHEAD_TOKENS = 12;
const CONTENT_BLOCK_OVERHEAD_TOKENS = 6;
const TRUNCATION_ROUTE_BUFFER_TOKENS = 512;
function estimateStringTokenPressure(text, charsPerToken = ESTIMATED_CHARS_PER_TOKEN, mode = "general") {
	const estimatedTokens = Math.ceil(estimateStringChars(text) / charsPerToken);
	return mode === "tool-result" ? Math.max(Math.ceil(text.length / TOOL_RESULT_CHARS_PER_TOKEN), estimatedTokens) : estimatedTokens;
}
function estimateJsonPayloadTokenPressure(value, charsPerToken = JSON_PAYLOAD_CHARS_PER_TOKEN, mode = "general") {
	try {
		const serialized = JSON.stringify(value);
		return typeof serialized === "string" ? estimateStringTokenPressure(serialized, charsPerToken, mode) : 1;
	} catch {
		return 256;
	}
}
function estimateIdentifierTokenPressure(value, charsPerToken = JSON_PAYLOAD_CHARS_PER_TOKEN) {
	if (value == null) return 0;
	if (typeof value === "string" || typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") return estimateStringTokenPressure(String(value), charsPerToken);
	return estimateJsonPayloadTokenPressure(value, charsPerToken);
}
function estimateContentBlockTokenPressure(block, charsPerToken = ESTIMATED_CHARS_PER_TOKEN, mode = "general") {
	if (typeof block === "string") return estimateStringTokenPressure(block, charsPerToken, mode);
	if (!isRecord(block)) return estimateJsonPayloadTokenPressure(block, charsPerToken, mode);
	const type = block.type;
	const text = type === "text" ? block.text : type === "thinking" ? block.thinking : void 0;
	if (typeof text === "string") return CONTENT_BLOCK_OVERHEAD_TOKENS + estimateStringTokenPressure(text, charsPerToken, mode);
	if (type === "image") return IMAGE_BLOCK_TOKENS;
	return CONTENT_BLOCK_OVERHEAD_TOKENS + estimateJsonPayloadTokenPressure(block, charsPerToken, mode);
}
function estimateAssistantToolCallTokenPressure(block) {
	const args = block.arguments ?? block.input ?? block.args ?? {};
	return CONTENT_BLOCK_OVERHEAD_TOKENS + estimateIdentifierTokenPressure(block.name, JSON_PAYLOAD_CHARS_PER_TOKEN) + estimateJsonPayloadTokenPressure(args, JSON_PAYLOAD_CHARS_PER_TOKEN);
}
function estimateContentTokenPressure(content, mode = "general") {
	if (typeof content === "string") return estimateStringTokenPressure(content, ESTIMATED_CHARS_PER_TOKEN, mode);
	if (Array.isArray(content)) return content.reduce((sum, block) => sum + estimateContentBlockTokenPressure(block, ESTIMATED_CHARS_PER_TOKEN, mode), 0);
	if (content !== void 0) return estimateJsonPayloadTokenPressure(content, mode === "tool-result" ? ESTIMATED_CHARS_PER_TOKEN : JSON_PAYLOAD_CHARS_PER_TOKEN, mode);
	return 0;
}
function estimateMessageTokenPressure(message) {
	if ("excludeFromContext" in message && message.excludeFromContext === true) return 0;
	const legacy = isRecord(message) ? message : {};
	let tokens = MESSAGE_BOUNDARY_OVERHEAD_TOKENS;
	if (message.role === "toolResult" || legacy.role === "tool" || legacy.type === "toolResult") {
		const content = message.role === "toolResult" ? message.content : legacy.content;
		const toolName = message.role === "toolResult" ? message.toolName : legacy.toolName;
		tokens += estimateContentTokenPressure(content, "tool-result");
		tokens += estimateIdentifierTokenPressure(toolName ?? legacy.tool_name);
		return tokens;
	}
	if (message.role === "bashExecution") {
		tokens += estimateStringTokenPressure(bashExecutionToText(message));
		return tokens;
	}
	if (message.role === "branchSummary" || message.role === "compactionSummary") {
		const [prefix, suffix] = message.role === "branchSummary" ? [BRANCH_SUMMARY_PREFIX, BRANCH_SUMMARY_SUFFIX] : [COMPACTION_SUMMARY_PREFIX, COMPACTION_SUMMARY_SUFFIX];
		return tokens + estimateStringTokenPressure(prefix + message.summary + suffix);
	}
	if (message.role === "assistant") {
		if (Array.isArray(message.content)) for (const block of message.content) {
			if (isRecord(block)) {
				const blockType = block.type;
				if (blockType === "toolCall" || blockType === "tool_use") {
					tokens += estimateAssistantToolCallTokenPressure(block);
					continue;
				}
			}
			tokens += estimateContentBlockTokenPressure(block);
		}
		else tokens += estimateContentTokenPressure(message.content);
		const toolCalls = legacy.toolCalls ?? legacy.tool_calls;
		if (Array.isArray(toolCalls)) for (const toolCall of toolCalls) tokens += isRecord(toolCall) ? estimateAssistantToolCallTokenPressure(toolCall) : estimateJsonPayloadTokenPressure(toolCall);
		return tokens;
	}
	tokens += estimateContentTokenPressure(legacy.content);
	return tokens;
}
/**
* Estimates the prompt pressure at the LLM boundary from transcript messages,
* optional system prompt, and current prompt text. The result intentionally
* includes a safety margin because this path runs before provider tokenization.
*/
function estimateRenderedPromptTokens(params) {
	return (typeof params.systemPrompt === "string" && params.systemPrompt.trim().length > 0 ? MESSAGE_BOUNDARY_OVERHEAD_TOKENS + estimateStringTokenPressure(params.systemPrompt) : 0) + MESSAGE_BOUNDARY_OVERHEAD_TOKENS + estimateStringTokenPressure(params.prompt);
}
function isProviderContextUsageBarrier(message) {
	if (message.role !== "assistant" || !message.usage) return false;
	return message.api === "cli" && message.usage.contextUsage === void 0 || message.usage.contextUsage?.state === "unavailable" && calculateContextTokens(message.usage) === 0;
}
function resolveProviderContextBoundary(messages) {
	for (let index = messages.length - 1; index >= 0; index -= 1) {
		const message = messages[index];
		if (message && isProviderContextUsageBarrier(message)) return;
		const contextUsage = message?.role === "assistant" ? message.usage?.contextUsage : void 0;
		if (contextUsage?.state === "available" && Number.isFinite(contextUsage.totalTokens) && contextUsage.totalTokens > 0) return {
			index,
			totalTokens: Math.ceil(contextUsage.totalTokens)
		};
	}
}
function estimateTranscriptBoundaryTokenPressure(params) {
	const boundary = resolveProviderContextBoundary(params.messages);
	const locallyEstimatedTokens = (boundary ? params.messages.slice(boundary.index + 1) : params.messages).reduce((sum, message) => sum + estimateMessageTokenPressure(message), estimateRenderedPromptTokens(params));
	return {
		estimatedPromptTokens: (boundary?.totalTokens ?? 0) + Math.ceil(locallyEstimatedTokens * SAFETY_MARGIN),
		source: boundary ? "provider_context_usage" : "transcript_estimate"
	};
}
function estimateLlmBoundaryTokenPressure(params) {
	return estimateTranscriptBoundaryTokenPressure(params).estimatedPromptTokens;
}
/** Estimates only the rendered prompt/system portion when history has already been accounted for. */
function estimateRenderedLlmBoundaryTokenPressure(params) {
	return Math.max(0, Math.ceil(estimateRenderedPromptTokens(params) * SAFETY_MARGIN));
}
function normalizeLlmBoundaryTokenPressure(pressure) {
	if (!pressure || !Number.isFinite(pressure.estimatedPromptTokens)) return;
	return {
		estimatedPromptTokens: Math.max(0, Math.ceil(pressure.estimatedPromptTokens)),
		source: pressure.source.trim() || "rendered_llm_boundary",
		...typeof pressure.renderedChars === "number" && Number.isFinite(pressure.renderedChars) ? { renderedChars: Math.max(0, Math.ceil(pressure.renderedChars)) } : {}
	};
}
/**
* Decides whether a run should compact before submitting the prompt, and
* whether reducible tool results can avoid or follow compaction. Rendered LLM
* boundary pressure wins over local transcript estimates when supplied.
*/
function shouldPreemptivelyCompactBeforePrompt(params) {
	let messagesForPressure = params.messages;
	const llmBoundaryTokenPressure = normalizeLlmBoundaryTokenPressure(params.llmBoundaryTokenPressure);
	const transcriptTokenPressure = llmBoundaryTokenPressure ? void 0 : estimateTranscriptBoundaryTokenPressure({
		messages: params.messages,
		systemPrompt: params.systemPrompt,
		prompt: params.prompt
	});
	let estimatedPromptTokens = llmBoundaryTokenPressure?.estimatedPromptTokens ?? transcriptTokenPressure?.estimatedPromptTokens ?? 0;
	let pressureSource = llmBoundaryTokenPressure?.source ?? transcriptTokenPressure?.source ?? "transcript_estimate";
	if (params.unwindowedMessages && params.unwindowedMessages !== params.messages) {
		const unwindowedTokenPressure = estimateTranscriptBoundaryTokenPressure({
			messages: params.unwindowedMessages,
			systemPrompt: params.systemPrompt,
			prompt: params.prompt
		});
		if (unwindowedTokenPressure.estimatedPromptTokens > estimatedPromptTokens) {
			estimatedPromptTokens = unwindowedTokenPressure.estimatedPromptTokens;
			messagesForPressure = params.unwindowedMessages;
			pressureSource = `unwindowed_${unwindowedTokenPressure.source}`;
		}
	}
	const contextTokenBudget = Math.max(1, Math.floor(params.contextTokenBudget));
	const effectiveReserveTokens = resolveEffectiveCompactionReserveTokens({
		contextTokenBudget,
		reserveTokens: params.reserveTokens
	});
	const promptBudgetBeforeReserve = Math.max(1, contextTokenBudget - effectiveReserveTokens);
	const overflowTokens = Math.max(0, estimatedPromptTokens - promptBudgetBeforeReserve);
	const toolResultPotential = estimateToolResultReductionPotential({
		messages: messagesForPressure,
		contextWindowTokens: params.contextTokenBudget,
		maxCharsOverride: params.toolResultMaxChars
	});
	const overflowChars = overflowTokens * ESTIMATED_CHARS_PER_TOKEN;
	const truncateOnlyThresholdChars = Math.max(overflowChars + TRUNCATION_ROUTE_BUFFER_TOKENS * ESTIMATED_CHARS_PER_TOKEN, Math.ceil(overflowChars * 1.5));
	const toolResultReducibleChars = toolResultPotential.maxReducibleChars;
	let route = "fits";
	if (overflowTokens > 0) if (toolResultReducibleChars <= 0) route = "compact_only";
	else if (toolResultReducibleChars >= truncateOnlyThresholdChars) route = "truncate_tool_results_only";
	else route = "compact_then_truncate";
	return {
		route,
		shouldCompact: route === "compact_only" || route === "compact_then_truncate",
		estimatedPromptTokens,
		pressureSource,
		promptBudgetBeforeReserve,
		overflowTokens,
		toolResultReducibleChars,
		effectiveReserveTokens
	};
}
/** Formats the compact operator log line for one pre-prompt budget check. */
function formatPrePromptPrecheckLog(params) {
	const { result } = params;
	return `[context-overflow-precheck] pre-prompt check sessionKey=${params.sessionKey ?? params.sessionId ?? "unknown"} provider=${params.provider}/${params.modelId} route=${result.route} estimatedPromptTokens=${result.estimatedPromptTokens} pressureSource=${result.pressureSource ?? "unknown"} promptBudgetBeforeReserve=${result.promptBudgetBeforeReserve} overflowTokens=${result.overflowTokens} toolResultReducibleChars=${result.toolResultReducibleChars} reserveTokens=${params.reserveTokens} effectiveReserveTokens=${result.effectiveReserveTokens} contextTokenBudget=${params.contextTokenBudget} messages=${params.messageCount} unwindowedMessages=${params.unwindowedMessageCount ?? params.messageCount} sessionFile=${params.sessionFile}`;
}
/** Converts the pre-prompt decision into the persisted session context-budget status record. */
function buildPrePromptContextBudgetStatus(params) {
	const { result } = params;
	const remainingPromptBudgetTokens = Math.max(0, result.promptBudgetBeforeReserve - result.estimatedPromptTokens);
	return {
		schemaVersion: 1,
		source: "pre-prompt-estimate",
		updatedAt: params.now ?? Date.now(),
		provider: params.provider,
		model: params.modelId,
		route: result.route,
		shouldCompact: result.shouldCompact,
		estimatedPromptTokens: result.estimatedPromptTokens,
		contextTokenBudget: Math.max(1, Math.floor(params.contextTokenBudget)),
		promptBudgetBeforeReserve: result.promptBudgetBeforeReserve,
		reserveTokens: Math.max(0, Math.floor(params.reserveTokens)),
		effectiveReserveTokens: result.effectiveReserveTokens,
		remainingPromptBudgetTokens,
		overflowTokens: result.overflowTokens,
		toolResultReducibleChars: result.toolResultReducibleChars,
		messageCount: Math.max(0, Math.floor(params.messageCount)),
		unwindowedMessageCount: Math.max(0, Math.floor(params.unwindowedMessageCount ?? params.messageCount)),
		...params.sessionId ? { sessionId: params.sessionId } : {}
	};
}
//#endregion
//#region src/agents/transcript-policy.ts
/**
* Transcript replay policy resolution.
* Combines provider plugin replay hooks with core transport fallbacks so chat
* history sanitization, tool IDs, thinking blocks, and turn validation align.
*/
const SIGNED_THINKING_PROVIDERS = /* @__PURE__ */ new Set([
	"anthropic",
	"amazon-bedrock",
	"anthropic-vertex"
]);
/** Return true when a provider family owns signed thinking blocks. */
function providerRequiresSignedThinking(provider) {
	return SIGNED_THINKING_PROVIDERS.has(normalizeProviderId(provider ?? ""));
}
/** Decide whether signed thinking can be replayed under the current provider policy. */
function shouldAllowProviderOwnedThinkingReplay(params) {
	const hasProviderOwnedSignedThinking = params.policy.preserveSignatures || providerRequiresSignedThinking(params.provider);
	return isAnthropicApi(params.modelApi) && params.policy.validateAnthropicTurns && hasProviderOwnedSignedThinking && !params.policy.dropThinkingBlocks;
}
const DEFAULT_TRANSCRIPT_POLICY = {
	sanitizeMode: "images-only",
	sanitizeToolCallIds: false,
	toolCallIdMode: void 0,
	duplicateToolCallIdStyle: void 0,
	preserveNativeAnthropicToolUseIds: false,
	repairToolUseResultPairing: true,
	preserveSignatures: false,
	sanitizeThoughtSignatures: void 0,
	dropThinkingBlocks: false,
	dropReasoningFromHistory: false,
	applyGoogleTurnOrdering: false,
	validateGeminiTurns: false,
	validateAnthropicTurns: false,
	allowSyntheticToolResults: false
};
function isAnthropicApi(modelApi) {
	return modelApi === "anthropic-messages" || modelApi === "bedrock-converse-stream";
}
function isOpenAiResponsesCompatibleApi(modelApi) {
	return modelApi === "openai-responses" || modelApi === "openai-chatgpt-responses" || modelApi === "azure-openai-responses";
}
function isClaudeFamilyModelId(modelId) {
	const id = normalizeLowercaseStringOrEmpty(modelId);
	return /(?:^|[./:_-])claude(?:$|[./:_-])/.test(id);
}
function modelDisablesReasoningEffort(model) {
	return (model?.compat)?.supportsReasoningEffort === false;
}
function shouldPreserveReasoningContentReplay(params) {
	return params.model?.reasoning === true || requiresReasoningContentReplay(params.modelId);
}
/**
* Provides a narrow replay-policy fallback for providers that do not have an
* owning runtime plugin.
*
* This exists to preserve generic custom-provider behavior. Bundled providers
* should express replay ownership through `buildReplayPolicy` instead.
*/
function buildUnownedProviderTransportReplayFallback(params) {
	const isGoogle = isGoogleModelApi(params.modelApi);
	const isAnthropic = isAnthropicApi(params.modelApi);
	const isStrictOpenAiCompatible = params.modelApi === "openai-completions";
	const requiresOpenAiCompatibleToolIdSanitization = params.modelApi === "openai-completions" || params.modelApi === "openai-responses" || params.modelApi === "openai-chatgpt-responses" || params.modelApi === "azure-openai-responses";
	if (!isGoogle && !isAnthropic && !isStrictOpenAiCompatible && !requiresOpenAiCompatibleToolIdSanitization) return;
	const modelId = normalizeLowercaseStringOrEmpty(params.modelId);
	const isClaudeOpenAiResponses = isOpenAiResponsesCompatibleApi(params.modelApi) ? isClaudeFamilyModelId(modelId) : false;
	return {
		...isGoogle || isAnthropic ? { sanitizeMode: "full" } : {},
		...isGoogle || isAnthropic || requiresOpenAiCompatibleToolIdSanitization ? {
			sanitizeToolCallIds: true,
			toolCallIdMode: "strict"
		} : {},
		...isAnthropic ? { preserveSignatures: true } : {},
		...isGoogle ? { sanitizeThoughtSignatures: {
			allowBase64Only: true,
			includeCamelCase: true
		} } : {},
		...isAnthropic && shouldDropClaudeThinkingBlocks(modelId, params.model) ? { dropThinkingBlocks: true } : {},
		...isAnthropic && modelDisablesReasoningEffort(params.model) ? { dropThinkingBlocks: true } : {},
		...isStrictOpenAiCompatible ? { dropReasoningFromHistory: !shouldPreserveReasoningContentReplay(params) } : {},
		...isGoogle || isStrictOpenAiCompatible ? { applyAssistantFirstOrderingFix: true } : {},
		...isGoogle || isStrictOpenAiCompatible ? { validateGeminiTurns: true } : {},
		...isAnthropic || isStrictOpenAiCompatible || isClaudeOpenAiResponses ? { validateAnthropicTurns: true } : {},
		...isGoogle || isAnthropic || isOpenAiResponsesCompatibleApi(params.modelApi) ? { allowSyntheticToolResults: true } : {}
	};
}
const REASONING_CONTENT_REPLAY_MODEL_IDS = /* @__PURE__ */ new Set([
	"kimi-for-coding",
	"kimi-k2.5",
	"kimi-k2.6",
	"kimi-k2.7-code",
	"kimi-k2.7-code-highspeed",
	"kimi-k3",
	"kimi-k2-thinking",
	"kimi-k2-thinking-turbo",
	"mimo-v2-pro",
	"mimo-v2-omni",
	"mimo-v2.5",
	"mimo-v2.5-pro",
	"mimo-v2.6-pro"
]);
function requiresReasoningContentReplay(modelId) {
	const normalized = normalizeLowercaseStringOrEmpty(modelId);
	if (!normalized) return false;
	const parts = normalized.split("/").filter(Boolean);
	const finalPart = parts[parts.length - 1] ?? normalized;
	const candidates = [finalPart];
	const colonParts = finalPart.split(":").filter(Boolean);
	if (colonParts.length > 1) candidates.push(colonParts[0] ?? "", colonParts[colonParts.length - 1] ?? "");
	return candidates.some((candidate) => REASONING_CONTENT_REPLAY_MODEL_IDS.has(candidate));
}
function mergeTranscriptPolicy(policy, basePolicy = DEFAULT_TRANSCRIPT_POLICY) {
	if (!policy) return basePolicy;
	return {
		...basePolicy,
		...policy.sanitizeMode != null ? { sanitizeMode: policy.sanitizeMode } : {},
		...typeof policy.sanitizeToolCallIds === "boolean" ? { sanitizeToolCallIds: policy.sanitizeToolCallIds } : {},
		...policy.toolCallIdMode ? { toolCallIdMode: policy.toolCallIdMode } : {},
		...policy.duplicateToolCallIdStyle ? { duplicateToolCallIdStyle: policy.duplicateToolCallIdStyle } : {},
		...typeof policy.preserveNativeAnthropicToolUseIds === "boolean" ? { preserveNativeAnthropicToolUseIds: policy.preserveNativeAnthropicToolUseIds } : {},
		...typeof policy.repairToolUseResultPairing === "boolean" ? { repairToolUseResultPairing: policy.repairToolUseResultPairing } : {},
		...typeof policy.preserveSignatures === "boolean" ? { preserveSignatures: policy.preserveSignatures } : {},
		...policy.sanitizeThoughtSignatures ? { sanitizeThoughtSignatures: policy.sanitizeThoughtSignatures } : {},
		...typeof policy.dropThinkingBlocks === "boolean" ? { dropThinkingBlocks: policy.dropThinkingBlocks } : {},
		...typeof policy.dropReasoningFromHistory === "boolean" ? { dropReasoningFromHistory: policy.dropReasoningFromHistory } : {},
		...typeof policy.applyAssistantFirstOrderingFix === "boolean" ? { applyGoogleTurnOrdering: policy.applyAssistantFirstOrderingFix } : {},
		...typeof policy.validateGeminiTurns === "boolean" ? { validateGeminiTurns: policy.validateGeminiTurns } : {},
		...typeof policy.validateAnthropicTurns === "boolean" ? { validateAnthropicTurns: policy.validateAnthropicTurns } : {},
		...typeof policy.allowSyntheticToolResults === "boolean" ? { allowSyntheticToolResults: policy.allowSyntheticToolResults } : {}
	};
}
const transcriptPolicyCache = /* @__PURE__ */ new WeakMap();
function canCacheTranscriptPolicy(params) {
	if (!params.config) return false;
	return !params.env || params.env === process.env;
}
function resolveTranscriptPolicyCacheKey(params) {
	return JSON.stringify({
		provider: params.provider,
		modelApi: params.modelApi ?? "",
		modelId: params.modelId ?? "",
		canonicalModelId: typeof params.model?.params?.canonicalModelId === "string" ? params.model.params.canonicalModelId : "",
		dropsThinkingForReasoningCompat: modelDisablesReasoningEffort(params.model),
		preservesReasoningContentReplay: params.model?.reasoning === true,
		workspaceDir: params.workspaceDir ?? "",
		pluginControlPlane: resolvePluginControlPlaneFingerprint({
			config: params.config,
			workspaceDir: params.workspaceDir,
			env: params.env
		})
	});
}
/** Resolve and cache the effective replay policy for a provider/model/config tuple. */
function resolveTranscriptPolicy(params) {
	const provider = normalizeProviderId(params.provider ?? "");
	const cacheConfig = canCacheTranscriptPolicy(params) ? params.config : void 0;
	const cacheKey = cacheConfig ? resolveTranscriptPolicyCacheKey({
		...params,
		provider,
		config: cacheConfig
	}) : void 0;
	if (cacheConfig && cacheKey) {
		const cached = transcriptPolicyCache.get(cacheConfig)?.get(cacheKey);
		if (cached) return cached;
	}
	const runtimePlugin = params.runtimeHandle?.plugin ?? (provider ? resolveProviderRuntimePlugin({
		provider,
		modelId: params.modelId,
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env
	}) : void 0);
	const context = {
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env,
		provider,
		modelId: params.modelId ?? "",
		modelApi: params.modelApi,
		model: params.model
	};
	const buildReplayPolicy = runtimePlugin?.buildReplayPolicy;
	const policy = buildReplayPolicy ? mergeTranscriptPolicy(buildReplayPolicy(context) ?? void 0) : mergeTranscriptPolicy(buildUnownedProviderTransportReplayFallback({
		modelApi: params.modelApi,
		modelId: params.modelId,
		model: params.model
	}));
	if (cacheConfig && cacheKey) {
		let configCache = transcriptPolicyCache.get(cacheConfig);
		if (!configCache) {
			configCache = /* @__PURE__ */ new Map();
			transcriptPolicyCache.set(cacheConfig, configCache);
		}
		configCache.set(cacheKey, policy);
	}
	return policy;
}
//#endregion
//#region src/agents/run-cleanup-timeout.ts
/**
* Agent cleanup timeout guard.
*
* Bounds cleanup steps so run completion cannot hang forever while preserving late-failure diagnostics.
*/
const AGENT_CLEANUP_STEP_TIMEOUT_MS = 1e4;
const AGENT_CLEANUP_STEP_TIMEOUT_ENV = "OPENCLAW_AGENT_CLEANUP_TIMEOUT_MS";
const TRAJECTORY_FLUSH_TIMEOUT_ENV = "OPENCLAW_TRAJECTORY_FLUSH_TIMEOUT_MS";
const CLEANUP_TIMEOUT_DETAILS_MAX_CHARS = 512;
const CLEANUP_TIMEOUT_DETAILS_TRUNCATED_SUFFIX = "...[truncated]";
function parseTimeoutEnvValue(value) {
	const trimmed = value?.trim();
	if (!trimmed) return;
	return parseStrictPositiveInteger(trimmed);
}
function resolveCleanupTimeoutDetails(getTimeoutDetails) {
	try {
		const timeoutDetails = getTimeoutDetails?.()?.trim();
		return timeoutDetails ? ` details=${truncateCleanupTimeoutDetails(timeoutDetails)}` : "";
	} catch (error) {
		return ` detailsError=${truncateCleanupTimeoutDetails(formatErrorMessage(error))}`;
	}
}
function truncateCleanupTimeoutDetails(value) {
	if (value.length <= CLEANUP_TIMEOUT_DETAILS_MAX_CHARS) return value;
	return `${truncateUtf16Safe(value, Math.max(0, CLEANUP_TIMEOUT_DETAILS_MAX_CHARS - 14))}${CLEANUP_TIMEOUT_DETAILS_TRUNCATED_SUFFIX}`;
}
function resolveAgentCleanupStepTimeoutMs(params) {
	const explicitTimeoutMs = resolveOptionalIntegerOption(params.timeoutMs, { min: 1 });
	if (explicitTimeoutMs !== void 0) return explicitTimeoutMs;
	const env = params.env ?? process.env;
	if (params.step === "openclaw-trajectory-flush") {
		const trajectoryTimeoutMs = parseTimeoutEnvValue(env[TRAJECTORY_FLUSH_TIMEOUT_ENV]);
		if (trajectoryTimeoutMs !== void 0) return trajectoryTimeoutMs;
	}
	return parseTimeoutEnvValue(env[AGENT_CLEANUP_STEP_TIMEOUT_ENV]) ?? AGENT_CLEANUP_STEP_TIMEOUT_MS;
}
/** Run one cleanup step with timeout logging and late-rejection handling. */
async function runAgentCleanupStep(params) {
	const timeoutMs = resolveAgentCleanupStepTimeoutMs({
		step: params.step,
		timeoutMs: params.timeoutMs,
		env: params.env
	});
	let timeoutHandle;
	let timedOut = false;
	const cleanupPromise = Promise.resolve().then(params.cleanup);
	const observedCleanupPromise = cleanupPromise.catch((error) => {
		if (!timedOut) params.log.warn(`agent cleanup failed: runId=${params.runId} sessionId=${params.sessionId} step=${params.step} error=${formatErrorMessage(error)}`);
	});
	const timeoutPromise = new Promise((resolve) => {
		timeoutHandle = setTimeout(() => {
			timedOut = true;
			resolve("timeout");
		}, timeoutMs);
		timeoutHandle.unref?.();
	});
	const result = await Promise.race([observedCleanupPromise.then(() => "done"), timeoutPromise]);
	if (timeoutHandle) clearTimeout(timeoutHandle);
	if (result === "timeout") {
		const details = resolveCleanupTimeoutDetails(params.getTimeoutDetails);
		params.log.warn(`agent cleanup timed out: runId=${params.runId} sessionId=${params.sessionId} step=${params.step} timeoutMs=${timeoutMs}${details}`);
		cleanupPromise.catch((error) => {
			params.log.warn(`agent cleanup rejected after timeout: runId=${params.runId} sessionId=${params.sessionId} step=${params.step} error=${formatErrorMessage(error)}`);
		});
	}
}
//#endregion
//#region src/agents/embedded-agent-runner/run/agent-end-context.ts
function buildEmbeddedForegroundPromptContext(run, agentDir) {
	const callerOrigin = run.cronCreatorAuthorityCapability?.callerOrigin;
	return {
		agentId: run.agentId,
		agentDir,
		workspaceDir: run.workspaceDir,
		cwd: run.cwd,
		sandboxSessionKey: run.sandboxSessionKey ?? run.sessionKey ?? run.sessionId,
		promptCacheKey: run.promptCacheKey,
		reasoningLevel: run.reasoningLevel,
		messageChannel: run.messageChannel,
		messageProvider: run.messageProvider,
		clientCaps: run.clientCaps,
		toolBindings: run.toolBindings,
		chatType: run.chatType,
		agentAccountId: run.agentAccountId,
		trigger: run.trigger,
		messageTo: run.messageTo,
		messageThreadId: run.messageThreadId,
		conversationToolPolicy: run.conversationToolPolicy,
		groupId: run.groupId,
		groupChannel: run.groupChannel,
		groupSpace: run.groupSpace,
		memberRoleIds: run.memberRoleIds,
		messageActionTurnCapability: run.messageActionTurnCapability,
		spawnedBy: run.spawnedBy,
		isCanonicalWorkspace: run.isCanonicalWorkspace,
		senderId: run.senderId,
		senderName: run.senderName,
		senderUsername: run.senderUsername,
		senderE164: run.senderE164,
		senderIsOwner: run.senderIsOwner,
		approvalReviewerDeviceId: run.approvalReviewerDeviceId,
		currentChannelId: run.currentChannelId,
		chatId: run.chatId,
		channelContext: run.channelContext,
		currentMessagingTarget: run.currentMessagingTarget,
		currentThreadTs: run.currentThreadTs,
		currentMessageId: run.currentMessageId,
		currentInboundAudio: run.currentInboundAudio,
		replyToMode: run.replyToMode,
		requireExplicitMessageTarget: run.requireExplicitMessageTarget,
		disableMessageTool: run.disableMessageTool,
		githubPublicationAvailable: run.githubPublicationAvailable,
		conversationRecall: run.conversationRecall,
		toolOverrides: run.toolOverrides,
		skillsSnapshot: run.skillsSnapshot,
		currentInboundEventKind: run.currentInboundEventKind,
		clientTools: run.clientTools,
		disableTools: run.disableTools,
		contextWindow: run.contextWindow,
		promptMode: run.promptMode,
		forceMessageTool: run.forceMessageTool,
		enableHeartbeatTool: run.enableHeartbeatTool,
		forceHeartbeatTool: run.forceHeartbeatTool,
		allowGatewaySubagentBinding: run.allowGatewaySubagentBinding,
		extraSystemPrompt: run.extraSystemPrompt,
		sourceReplyDeliveryMode: run.sourceReplyDeliveryMode,
		taskSuggestionDeliveryMode: run.taskSuggestionDeliveryMode,
		silentReplyPromptMode: run.silentReplyPromptMode,
		ownerNumbers: run.ownerNumbers,
		toolsAllow: run.toolsAllow,
		runtimePluginToolGrant: run.runtimePluginToolGrant,
		inputProvenance: run.inputProvenance,
		scheduledToolPolicy: run.scheduledToolPolicy,
		modelThinkingCapability: run.modelThinkingCapability,
		modelFallbacksOverride: run.modelFallbacksOverride,
		...callerOrigin && callerOrigin.kind !== "unknown" ? { cronCreatorCallerOrigin: callerOrigin } : {}
	};
}
function buildEmbeddedAgentEndContext(params) {
	const run = params.run;
	return {
		runId: run.runId,
		trace: params.trace,
		agentId: params.agentId,
		sessionKey: run.sessionKey,
		sessionId: run.sessionId,
		workspaceDir: run.workspaceDir,
		modelProviderId: run.provider,
		modelId: run.modelId,
		modelContextWindowTokens: run.contextTokenBudget ?? run.model.contextWindow,
		foregroundPromptContext: buildEmbeddedForegroundPromptContext({
			...run,
			agentId: params.agentId
		}, params.agentDir),
		authProfileId: run.authProfileId,
		skillWorkshopAvailable: params.skillWorkshopAvailable,
		compacted: params.compacted,
		trigger: run.trigger,
		...run.config ? { config: run.config } : {},
		...buildAgentHookContextChannelFields(run),
		...buildAgentHookContextIdentityFields({
			trigger: run.trigger,
			senderId: run.senderId,
			chatId: run.chatId,
			channelContext: run.channelContext
		})
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/attempt-tool-run-context.ts
/**
* Builds tool run context passed to embedded-agent tool handlers.
*/
/**
* Builds the stable tool-run context forwarded into an embedded-attempt execution.
*/
function buildEmbeddedAttemptToolRunContext(params) {
	return {
		trigger: params.trigger,
		jobId: params.jobId,
		memoryFlushWritePath: params.memoryFlushWritePath,
		...params.toolsAllow ? { runtimeToolAllowlist: params.toolsAllow } : {},
		...params.conversationToolPolicy ? { conversationToolPolicy: params.conversationToolPolicy } : {},
		...params.trace ? { trace: freezeDiagnosticTraceContext(params.trace) } : {}
	};
}
//#endregion
//#region src/agents/harness/settled-turn-finalization-outcome.ts
/** A normally stopped finalizer exhausted its visible answer without failing or using tools. */
var EmptySettledTurnFinalizationError = class extends Error {
	constructor(result) {
		super("Settled-turn finalization completed without a visible answer");
		this.result = result;
		this.name = "EmptySettledTurnFinalizationError";
	}
};
//#endregion
//#region src/agents/harness/settled-turn-finalization-result.ts
const ALLOWED_SETTLED_FINALIZATION_RESULT_KEYS = /* @__PURE__ */ new Set([
	"assistant",
	"usage",
	"assistantTranscriptOwned",
	"assistantTranscriptIdempotencyKey",
	"assistantMessageIndex",
	"diagnosticTrace"
]);
function assistantContainsToolCall(assistant) {
	return assistant.content.some((block) => block !== null && typeof block === "object" && block.type === "toolCall");
}
/**
* Validates the deliberately narrow finalizer result before core turns it into
* a terminal reply. Capability and delivery fields cannot cross this contract.
*/
function assertSettledTurnFinalizationResult(result) {
	const unknownKey = Object.keys(result).find((key) => !ALLOWED_SETTLED_FINALIZATION_RESULT_KEYS.has(key));
	if (unknownKey) throw new Error(`Settled-turn finalization returned unsupported result field: ${unknownKey}`);
	if (!result.assistant || result.assistant.role !== "assistant") throw new Error("Settled-turn finalization did not return an assistant message");
	if (result.assistant.stopReason === "toolUse" || assistantContainsToolCall(result.assistant)) throw new Error("Settled-turn finalization returned a tool call");
	if (result.assistant.stopReason !== "stop") throw new Error(`Settled-turn finalization returned unsuccessful stop reason: ${result.assistant.stopReason}`);
	if (result.assistantMessageIndex !== void 0 && (!Number.isSafeInteger(result.assistantMessageIndex) || result.assistantMessageIndex < 0)) throw new Error("Settled-turn finalization returned an invalid assistant message index");
	resolveSettledTurnFinalizationText(result);
	return result;
}
function resolveSettledTurnFinalizationText(result) {
	const text = resolveFinalAssistantVisibleText(result.assistant);
	if (!text) throw new EmptySettledTurnFinalizationError(result);
	if (isSilentReplyText(text)) throw new Error("Settled-turn finalization completed without a visible answer");
	return text;
}
/**
* Projects a harness-owned full attempt engine into the narrow finalization
* contract, rejecting canonical failure or capability evidence first.
*/
function projectSettledTurnFinalizationAttemptResult(result) {
	if (("terminal" in result ? result.terminal : normalizeAgentRunAttemptTerminal(result)).kind !== "ok" || (result.compactionCount ?? 0) > 0 || result.promptTimeoutOutcome || result.preflightRecovery || result.beforeAgentFinalizeRevisionReason || result.codexAppServerFailure || result.cloudCodeAssistFormatError) throw new Error("Settled-turn finalization attempt did not complete successfully");
	if (result.toolMetas.length > 0 || result.itemLifecycle.startedCount > 0 || result.itemLifecycle.completedCount > 0 || result.itemLifecycle.activeCount > 0 || result.replayMetadata.hadPotentialSideEffects || !result.replayMetadata.replaySafe || result.currentAttemptReplayMetadata?.hadPotentialSideEffects || result.currentAttemptReplayMetadata && !result.currentAttemptReplayMetadata.replaySafe || (result.clientToolCalls?.length ?? 0) > 0 || (result.acceptedSessionSpawns?.length ?? 0) > 0 || result.didSendViaMessagingTool || result.didDeliverSourceReplyViaMessageTool || result.didSendDeterministicApprovalPrompt || result.messagingToolSentTexts.length > 0 || result.messagingToolSentMediaUrls.length > 0 || result.messagingToolSentTargets.length > 0 || (result.messagingToolSourceReplyPayloads?.length ?? 0) > 0 || result.heartbeatToolResponse || (result.toolMediaUrls?.length ?? 0) > 0 || (result.hostOwnedToolMediaUrls?.length ?? 0) > 0 || result.toolAudioAsVoice || result.toolTrustedLocalMedia || result.hasToolMediaBlockReply || result.lastToolError || (result.successfulCronAdds ?? 0) > 0 || result.yieldDetected) throw new Error("Settled-turn finalization attempt reported capability activity");
	const assistant = result.currentAttemptCompletedAssistant;
	if (!assistant) throw new Error("Settled-turn finalization attempt returned no completed assistant message");
	return assertSettledTurnFinalizationResult({
		assistant,
		...result.attemptUsage ? { usage: result.attemptUsage } : {},
		...result.assistantTranscriptOwned ? {
			assistantTranscriptOwned: true,
			...result.assistantTranscriptIdempotencyKey ? { assistantTranscriptIdempotencyKey: result.assistantTranscriptIdempotencyKey } : {}
		} : result.lastAssistantTextMessageIndex !== void 0 ? { assistantMessageIndex: result.lastAssistantTextMessageIndex } : {},
		...result.diagnosticTrace ? { diagnosticTrace: result.diagnosticTrace } : {}
	});
}
//#endregion
export { shouldPreemptivelyCompactBeforePrompt as _, buildEmbeddedAttemptToolRunContext as a, computeAdaptiveChunkRatioWithWorker as b, runAgentCleanupStep as c, shouldAllowProviderOwnedThinkingReplay as d, PREEMPTIVE_OVERFLOW_ERROR_TEXT as f, formatPrePromptPrecheckLog as g, estimateRenderedLlmBoundaryTokenPressure as h, EmptySettledTurnFinalizationError as i, providerRequiresSignedThinking as l, estimateLlmBoundaryTokenPressure as m, projectSettledTurnFinalizationAttemptResult as n, buildEmbeddedAgentEndContext as o, buildPrePromptContextBudgetStatus as p, resolveSettledTurnFinalizationText as r, buildEmbeddedForegroundPromptContext as s, assertSettledTurnFinalizationResult as t, resolveTranscriptPolicy as u, resolveContextWindowTokens as v, summarizeInStages as y };
