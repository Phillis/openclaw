import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import "./error-runtime-CmA1H4Zg.js";
import { i as isMemoryRecallTimeoutError, o as runWithTimeout, t as MemoryRecallEmbeddingError } from "./embeddings-BZP7mGAy.js";
import { t as dropMediaNoteLines } from "./memory-capture-sanitization-7MoIA8yo.js";
import { c as formatRelevantMemoriesContext, d as normalizeRecallQuery, i as extractLatestUserText, t as cleanMemorySearchResults } from "./memory-policy-VbMAtSuk.js";
//#region extensions/memory-lancedb/auto-recall.ts
const AUTO_RECALL_TIMEOUT_MS = 15e3;
const AUTO_RECALL_OVERFETCH_LIMIT = 10;
const AUTO_RECALL_RESULT_CAP = 3;
function createAutoRecallHook(params) {
	return async (event, ctx) => {
		const currentCfg = params.resolveCurrentConfig();
		const recallMaxChars = currentCfg.recallMaxChars;
		if (!currentCfg.autoRecall) return;
		const toolAuthority = ctx.toolAuthority;
		if (!toolAuthority) {
			params.logger.debug?.("memory-lancedb: auto-recall skipped because this prompt has no turn tool authority");
			return;
		}
		toolAuthority.assertActive();
		if (!toolAuthority.allows("memory_recall")) {
			params.logger.debug?.("memory-lancedb: auto-recall skipped by turn tool policy");
			return;
		}
		const agentId = params.resolveEnabledAgentId(ctx.agentId);
		if (!agentId || !event.prompt || event.prompt.length < 5) return;
		const cooldown = params.readCooldown(agentId);
		if (cooldown) {
			params.logger.debug?.(`memory-lancedb: auto-recall skipped during recall cooldown: ${cooldown.error}`);
			return;
		}
		try {
			const recallQuery = normalizeRecallQuery(dropMediaNoteLines(extractLatestUserText(event.messages) ?? event.prompt), recallMaxChars);
			if (!recallQuery) return;
			let recallPhase = "embedding";
			toolAuthority.assertActive();
			const recall = await runWithTimeout({
				timeoutMs: AUTO_RECALL_TIMEOUT_MS,
				task: async (deadlineAtMs) => {
					let vector;
					try {
						vector = await params.embeddings.embed(agentId, recallQuery, currentCfg.embedding, Math.max(1, deadlineAtMs - Date.now()));
					} catch (error) {
						throw new MemoryRecallEmbeddingError(error);
					}
					toolAuthority.assertActive();
					recallPhase = "search";
					return await params.db.search(agentId, vector, AUTO_RECALL_OVERFETCH_LIMIT, .3, { timeoutMs: Math.max(0, deadlineAtMs - Date.now()) });
				}
			});
			toolAuthority.assertActive();
			if (recall.status === "timeout") {
				if (recallPhase === "embedding") params.recordCooldown(agentId, `auto-recall timed out after ${Math.round(AUTO_RECALL_TIMEOUT_MS / 1e3)}s`);
				params.logger.warn?.(`memory-lancedb: auto-recall timed out after ${AUTO_RECALL_TIMEOUT_MS}ms; skipping memory injection to avoid stalling agent startup`);
				return;
			}
			const cleanResults = cleanMemorySearchResults(recall.value).map(({ result, text }) => ({
				category: result.entry.category,
				text
			})).slice(0, AUTO_RECALL_RESULT_CAP);
			if (cleanResults.length === 0) return;
			params.logger.info?.(`memory-lancedb: injecting ${cleanResults.length} memories into context`);
			const context = formatRelevantMemoriesContext(cleanResults, recallMaxChars);
			return context ? { prependContext: context } : void 0;
		} catch (err) {
			if (err instanceof MemoryRecallEmbeddingError && isMemoryRecallTimeoutError(err.originalError)) params.recordCooldown(agentId, formatErrorMessage(err.originalError));
			params.logger.warn(`memory-lancedb: recall failed: ${String(err)}`);
			return;
		}
	};
}
//#endregion
export { createAutoRecallHook as t };
