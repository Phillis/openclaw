import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { r as formatErrorMessage } from "./errors-CqPTYU6G.js";
import { n as sanitizeTerminalText } from "./safe-text-CpAuEO38.js";
//#region src/infra/exec-auto-review.ts
/** Keeps reviewer and provider explanations safe for human-facing approval text. */
function normalizeExecAutoReviewRationale(value, fallback) {
	return truncateUtf16Safe(sanitizeTerminalText(normalizeOptionalString(typeof value === "string" ? value : void 0) ?? fallback).replace(/[\p{Cf}\u2028\u2029]/gu, "").replace(/\s+/gu, " ").trim() || fallback, 500);
}
/** Turns reviewer and provider failures into a bounded, redacted human-review decision. */
function buildExecAutoReviewFailureDecision(prefix, error) {
	return {
		decision: "ask",
		risk: "unknown",
		rationale: normalizeExecAutoReviewRationale(`${prefix}: ${formatErrorMessage(error)}`, prefix)
	};
}
/** Custom reviewer failures must defer to a human, never authorize or crash execution. */
async function resolveExecAutoReviewDecision(reviewer, input) {
	try {
		return await reviewer(input);
	} catch (error) {
		return buildExecAutoReviewFailureDecision("exec reviewer failed", error);
	}
}
/**
* Conservative fallback used when no model-backed reviewer is available.
* Auto mode must never become a static allowlist; without a reviewer, defer to
* the normal human approval route.
*/
const defaultExecAutoReviewer = (input) => {
	return {
		decision: "ask",
		rationale: `no model-backed exec reviewer is configured for ${input.host}`,
		risk: input.analysis.inlineEval ? "medium" : "unknown"
	};
};
//#endregion
export { resolveExecAutoReviewDecision as i, defaultExecAutoReviewer as n, normalizeExecAutoReviewRationale as r, buildExecAutoReviewFailureDecision as t };
