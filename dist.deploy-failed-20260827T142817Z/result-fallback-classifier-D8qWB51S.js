import { i as isSilentReplyPayloadText } from "./tokens-CMI0yx54.js";
import { t as classifyFailoverReason } from "./classify-DbL6Dp79.js";
import "./user-copy-B4A_rZVy.js";
import { i as hasVisibleAgentPayload } from "./message-visibility-CIRFeK2g.js";
import { c as hasCommittedOutboundDeliveryEvidence } from "./delivery-evidence-B9g3AV3B.js";
//#region src/agents/embedded-agent-runner/result-fallback-classifier.ts
/** Classifies embedded-agent run results for model fallback decisions. */
/**
* Classifies embedded-agent terminal results for model fallback decisions.
*
* The classifier only flags failed invisible outcomes or exact generic external-runner failure
* copy; delivered messages, deliberate silent replies, hook blocks, and aborts must not trigger
* another model attempt.
*/
function isEmbeddedAgentRunResult(value) {
	return Boolean(value && typeof value === "object" && "meta" in value && value.meta && typeof value.meta === "object");
}
/** Keeps final-candidate bookkeeping while surfacing the best trusted terminal payload. */
function mergeEmbeddedAgentRunResultForModelFallbackExhaustion(params) {
	const executionTrace = params.latestResult.meta.executionTrace;
	const filteredAttempts = executionTrace?.attempts?.filter((attempt) => attempt.result !== "success");
	const traceNeedsNormalization = executionTrace !== void 0 && (executionTrace.winnerProvider !== void 0 || executionTrace.winnerModel !== void 0 || filteredAttempts?.length !== executionTrace.attempts?.length);
	if (params.latestResult === params.preferredResult && !traceNeedsNormalization) return params.latestResult;
	return {
		...params.latestResult,
		payloads: params.preferredResult.payloads,
		meta: {
			...params.latestResult.meta,
			error: params.preferredResult.meta.error,
			...traceNeedsNormalization ? { executionTrace: {
				...executionTrace,
				winnerProvider: void 0,
				winnerModel: void 0,
				attempts: filteredAttempts?.length ? filteredAttempts : void 0
			} } : {}
		}
	};
}
function hasDeliberateSilentTerminalReply(result) {
	if (result.meta.error?.kind === "hook_block") return true;
	return [result.meta.finalAssistantRawText, result.meta.finalAssistantVisibleText].some((text) => typeof text === "string" && isSilentReplyPayloadText(text));
}
function hasDeliverableAssistantPayload(result) {
	const finalVisibleText = result.meta?.finalAssistantVisibleText;
	const payloads = Array.isArray(result.payloads) ? result.payloads.filter((payload) => {
		if (!payload || typeof payload !== "object" || Array.isArray(payload)) return true;
		const record = payload;
		return record.isCommentary !== true && record.visible !== false;
	}) : [];
	return typeof finalVisibleText === "string" && finalVisibleText.trim().length > 0 && !isSilentReplyPayloadText(finalVisibleText) || hasVisibleAgentPayload({ payloads }, {
		includeErrorPayloads: false,
		includeReasoningPayloads: false
	});
}
function hasNonTextVisiblePayloadContent(payload) {
	const { isError: _isError, text: _text, ...payloadWithoutText } = payload;
	return hasDeliverableAssistantPayload({ payloads: [payloadWithoutText] });
}
function classifyGenericExternalRunFailurePayload(params) {
	const payloads = params.result.payloads;
	if (!Array.isArray(payloads) || payloads.length !== 1) return null;
	const [payload] = payloads;
	const text = payload?.text;
	if (payload?.isError === true || payload?.isReasoning === true || typeof text !== "string" || text.trim() !== "⚠️ Something went wrong while processing your request. Please try again, or use /new to start a fresh session." || !payload || hasNonTextVisiblePayloadContent(payload)) return null;
	return {
		message: `${params.provider}/${params.model} ended with a generic external runner failure: ${text}`,
		reason: "format",
		code: "generic_external_run_failure",
		rawError: text
	};
}
function classifyHarnessResult(params) {
	switch (params.result.meta.agentHarnessResultClassification) {
		case "empty": return {
			message: `${params.provider}/${params.model} ended without a visible assistant reply`,
			reason: "format",
			code: "empty_result"
		};
		case "reasoning-only": return {
			message: `${params.provider}/${params.model} ended with reasoning only`,
			reason: "format",
			code: "reasoning_only_result"
		};
		case "planning-only": return {
			message: `${params.provider}/${params.model} ended with a structured plan but no final answer`,
			reason: "format",
			code: "planning_only_result"
		};
		default: return null;
	}
}
function classifyProviderErrorPayloadReason(errorText, provider) {
	if (!errorText.trim()) return null;
	const failoverReason = classifyFailoverReason(errorText, { provider });
	switch (failoverReason) {
		case "auth":
		case "auth_permanent":
		case "billing":
		case "rate_limit":
		case "server_error":
		case "overloaded": return failoverReason;
		default: return null;
	}
}
/** Returns a fallback classification when an embedded run failed without user-visible output. */
function classifyEmbeddedAgentRunResultForModelFallback(params) {
	if (!isEmbeddedAgentRunResult(params.result)) return null;
	if (params.result.meta.aborted || params.hasDirectlySentBlockReply === true || params.hasBlockReplyPipelineOutput === true) return null;
	const incompleteTurn = params.result.meta.error?.kind === "incomplete_turn";
	if (incompleteTurn && params.result.meta.error?.fallbackSafe !== true) return null;
	const fallbackSafeIncompleteTurn = incompleteTurn;
	if (params.result.meta.replayInvalid === true && !fallbackSafeIncompleteTurn) return null;
	if (hasCommittedOutboundDeliveryEvidence(params.result)) return null;
	if (params.result.meta.error?.kind === "hook_block") return null;
	const payloads = params.result.payloads ?? [];
	const genericExternalFailureClassification = classifyGenericExternalRunFailurePayload({
		provider: params.provider,
		model: params.model,
		result: params.result
	});
	if (genericExternalFailureClassification) return genericExternalFailureClassification;
	if (hasDeliverableAssistantPayload(params.result)) return null;
	if (fallbackSafeIncompleteTurn) return {
		message: payloads.find((payload) => payload.isError === true && typeof payload.text === "string")?.text ?? `${params.provider}/${params.model} ended with an incomplete terminal response`,
		reason: "format",
		code: "incomplete_result",
		preserveResultOnExhaustion: true,
		preserveResultPriority: params.result.meta.error?.terminalPresentation === true ? 1 : 0
	};
	const harnessClassification = classifyHarnessResult({
		provider: params.provider,
		model: params.model,
		result: params.result
	});
	if (harnessClassification) return harnessClassification;
	const errorText = payloads.filter((payload) => payload?.isError === true).map((payload) => typeof payload.text === "string" ? payload.text : "").join("\n");
	const failoverReason = classifyProviderErrorPayloadReason(errorText, params.provider);
	if (failoverReason) return {
		message: `${params.provider}/${params.model} ended with a provider error: ${errorText}`,
		reason: failoverReason,
		code: "embedded_error_payload",
		rawError: errorText
	};
	if (hasDeliberateSilentTerminalReply(params.result)) return null;
	if (errorText.trim()) return null;
	if (payloads.some((payload) => payload.isError === true && hasNonTextVisiblePayloadContent(payload))) return null;
	const assistantPayloads = payloads.filter((payload) => payload.isError !== true);
	if (assistantPayloads.length > 0 && assistantPayloads.every((payload) => payload.isReasoning === true)) return {
		message: `${params.provider}/${params.model} ended with reasoning only`,
		reason: "format",
		code: "reasoning_only_result"
	};
	return {
		message: `${params.provider}/${params.model} ended without a visible assistant reply`,
		reason: "format",
		code: "empty_result"
	};
}
//#endregion
export { hasDeliberateSilentTerminalReply as n, mergeEmbeddedAgentRunResultForModelFallbackExhaustion as r, classifyEmbeddedAgentRunResultForModelFallback as t };
