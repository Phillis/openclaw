import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { n as resolveImageFallbackDefaultProvider, t as resolveImageFallbackCandidates } from "./model-fallback-candidates-BGnJ8Xq9.js";
import { d as runFallbackAttempt, m as throwFallbackFailureSummary } from "./model-fallback-attempt-g8386O_W.js";
//#region src/agents/model-fallback-image.ts
async function runWithImageModelFallback(params) {
	const candidates = resolveImageFallbackCandidates({
		cfg: params.cfg,
		defaultProvider: resolveImageFallbackDefaultProvider(params.cfg),
		modelOverride: params.modelOverride
	});
	if (candidates.length === 0) throw new Error("No image model configured. Set agents.defaults.imageModel.primary or agents.defaults.imageModel.fallbacks.");
	const attempts = [];
	let lastError;
	for (const [i, candidate] of candidates.entries()) {
		const attemptRun = await runFallbackAttempt({
			run: params.run,
			...candidate,
			attempts,
			attempt: i + 1,
			total: candidates.length,
			abortSignal: params.abortSignal
		}).catch((error) => {
			params.abortSignal?.throwIfAborted();
			throw error;
		});
		if ("success" in attemptRun) return attemptRun.success;
		const err = attemptRun.error;
		lastError = err;
		attempts.push({
			provider: candidate.provider,
			model: candidate.model,
			error: formatErrorMessage(err)
		});
		await params.onError?.({
			provider: candidate.provider,
			model: candidate.model,
			error: err,
			attempt: i + 1,
			total: candidates.length
		});
	}
	return throwFallbackFailureSummary({
		attempts,
		candidates,
		lastError,
		label: "image models",
		formatAttempt: (attempt) => `${attempt.provider}/${attempt.model}: ${attempt.error}`,
		cfg: params.cfg
	});
}
//#endregion
export { runWithImageModelFallback as t };
