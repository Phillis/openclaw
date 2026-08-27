import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.js";
import { i as isSilentReplyPayloadText, t as HEARTBEAT_TOKEN } from "./tokens-CMI0yx54.js";
import { h as runOncePerAgentRun } from "./agent-events-Cmj8toCy.js";
import { t as getGlobalHookRunner } from "./hook-runner-global-BgVsqem2.js";
import { g as setReplyPayloadMetadata, p as markReplyPayloadForSourceSuppressionDelivery } from "./reply-payload-DVcGHORx.js";
import { a as parseAssistantTextSignature, n as extractAssistantTextForPhase } from "./chat-message-content-BibNiFIq.js";
import { i as isPluginHookAgentTrigger } from "./types-DQ1qMLz0.js";
import { a as formatRawAssistantErrorForUi } from "./assistant-error-format-DYl5XHJg.js";
import { n as formatInlineCodeSpan } from "./markdown-code-Buzx6wvi.js";
import { n as sanitizeAssistantVisibleText, t as sanitizeAssistantFinalAnswerText } from "./assistant-visible-text-DkdYrwAv.js";
import { f as isRawApiErrorPayload, l as getApiErrorPayloadFingerprint, n as BILLING_ERROR_USER_MESSAGE } from "./user-copy-BKvImQfV.js";
import { t as isLikelyMutatingToolName } from "./tool-mutation-names-DbOogX1N.js";
import { o as hasReplyPayloadContent } from "./payload-ByplrRCQ.js";
import { n as parseReplyDirectives } from "./reply-directives-BKDbuE6s.js";
import { c as formatAssistantErrorText, l as formatUserFacingAssistantErrorText } from "./embedded-agent-helpers-DHqB9zvZ.js";
import { r as normalizeTextForComparison } from "./messaging-dedupe-CPPpWPVX.js";
import "./tool-mutation-D4StAzyF.js";
import { t as formatToolAggregate } from "./tool-meta-BqjtVe4I.js";
import { a as getHeartbeatToolNotificationText, i as createHeartbeatToolResponsePayload } from "./heartbeat-tool-response-CyHYyyCM.js";
import { b as resolveExplicitFinalSourceReplyDeliveryEvidence } from "./delivery-evidence-CEFyQPkI.js";
import { n as isExecLikeToolName } from "./tool-error-summary-Bw_A4yhp.js";
import { a as extractAssistantVisibleText, f as sanitizeAssistantVisibleStreamText, i as extractAssistantThinking } from "./embedded-agent-utils-D4SXH5E3.js";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/plugins/before-agent-reply.ts
const beforeAgentReplyObserver = resolveGlobalSingleton(Symbol.for("openclaw.beforeAgentReply.observer"), () => new AsyncLocalStorage());
/** Attaches durable admission bookkeeping without moving hook ownership out of the runner. */
function withBeforeAgentReplyObserver(observer, run) {
	return beforeAgentReplyObserver.run({ ...observer }, run);
}
/** Preserves the full plugin reply contract, including private payload metadata. */
function buildHandledBeforeAgentReplyPayloads(reply) {
	return [reply ?? { text: "NO_REPLY" }];
}
/** Runs the reply claim hook once for one admitted turn, across model fallbacks. */
function runBeforeAgentReplyForTurn(params) {
	const trigger = params.trigger;
	if (!isPluginHookAgentTrigger(trigger)) return Promise.resolve(void 0);
	const context = {
		...params.context,
		trigger
	};
	return runOncePerAgentRun(params.runId, "before_agent_reply", async () => {
		const hookRunner = getGlobalHookRunner();
		if (!hookRunner?.hasHooks("before_agent_reply", context)) return;
		const observerScope = beforeAgentReplyObserver.getStore();
		const observer = observerScope && (!observerScope.runId || observerScope.runId === params.runId) ? observerScope : void 0;
		if (observer && !observer.runId) observer.runId = params.runId;
		if (await observer?.beforeDispatch() === false) return;
		params.onDispatch?.();
		let result = await hookRunner.runBeforeAgentReply(params.event, context);
		if (!result?.handled) params.onDeclined?.();
		if (observer) result = await observer.afterDispatch(result);
		return result;
	});
}
//#endregion
//#region src/agents/embedded-agent-runner/run/auth-profile-failure-policy.ts
/**
* Returns the subset of failover reasons that should affect shared auth-profile
* health. Local helper failures and request-shape/transport outcomes stay
* session-local so one bad transcript or connection does not cool down an
* otherwise healthy provider profile.
*/
function resolveAuthProfileFailureReason(params) {
	if (params.policy === "local" || !params.failoverReason || params.failoverReason === "overloaded" || params.policy === "local_transient" && params.failoverReason === "rate_limit" && params.transientRateLimit === true || params.failoverReason === "server_error" || params.failoverReason === "tls_certificate" || params.failoverReason === "empty_response" || params.failoverReason === "context_overflow" || params.failoverReason === "format") return null;
	if (params.failoverReason === "timeout" && params.providerStarted !== true) return null;
	return params.failoverReason;
}
//#endregion
//#region src/agents/embedded-agent-runner/run/source-reply-payloads.ts
/** Builds transcript mirrors and completion evidence for message-tool source replies. */
function buildSourceReplyPayloadState(params) {
	const sourceReplyPayloads = params.payloads ?? [];
	const replyItems = sourceReplyPayloads.flatMap((payload, index) => {
		const text = normalizeOptionalString(payload.text) ?? "";
		const media = Array.from(/* @__PURE__ */ new Set([...payload.mediaUrl ? [payload.mediaUrl] : [], ...payload.mediaUrls ?? []])).filter((value) => value.trim().length > 0);
		if (!text && media.length === 0 && !payload.presentation && !payload.interactive && !payload.channelData) return [];
		return [{
			text,
			...payload.mediaUrl ? { mediaUrl: payload.mediaUrl } : {},
			...media.length ? { media } : {},
			...payload.audioAsVoice ? { audioAsVoice: true } : {},
			...payload.presentation ? { presentation: payload.presentation } : {},
			...payload.interactive ? { interactive: payload.interactive } : {},
			...payload.channelData ? { channelData: payload.channelData } : {},
			sourceReplyMirror: { idempotencyKey: payload.idempotencyKey ?? (params.runId ? `${params.runId}:internal-source-reply:${index}` : void 0) }
		}];
	});
	const hasSourceReplyPayload = replyItems.length > 0;
	const deliveredSourceReplyViaMessageTool = params.sourceReplyDeliveryMode === "message_tool_only" && params.didDeliverSourceReplyViaMessageTool === true;
	const explicitFinalSourceReply = resolveExplicitFinalSourceReplyDeliveryEvidence({
		messagingToolSentTargets: params.sentTargets,
		messagingToolSourceReplyPayloads: sourceReplyPayloads
	});
	return {
		replyItems,
		hasSourceReplyPayload,
		deliveredSourceReplyViaMessageTool,
		explicitFinalSourceReply,
		completedSourceReplyViaMessageTool: explicitFinalSourceReply ?? (hasSourceReplyPayload || deliveredSourceReplyViaMessageTool)
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/tool-error-warning.ts
const RECOVERABLE_TOOL_ERROR_KEYWORDS = [
	"required",
	"missing",
	"invalid",
	"must be",
	"must have",
	"needs",
	"requires"
];
function isRecoverableToolError(error) {
	const errorLower = normalizeOptionalLowercaseString(error) ?? "";
	return RECOVERABLE_TOOL_ERROR_KEYWORDS.some((keyword) => errorLower.includes(keyword));
}
function isVerboseToolDetailEnabled(level) {
	return level === "full";
}
function shouldMarkNonTerminalToolErrorWarning(lastToolError) {
	return lastToolError.middlewareError === true;
}
function formatToolErrorWarningText(params) {
	const terminalDiagnostic = params.lastToolError.terminalDiagnostic;
	if (terminalDiagnostic?.kind === "process") return `⚠️ ${formatToolAggregate("process", params.includeDetails ? [terminalDiagnostic.sessionId] : void 0, { markdown: params.useMarkdown })} failed (${terminalDiagnostic.reason.kind === "exit" ? `exit ${terminalDiagnostic.reason.exitCode}` : terminalDiagnostic.reason.kind === "signal" ? `signal ${terminalDiagnostic.reason.signal}` : terminalDiagnostic.reason.timeoutKind === "no-output-timeout" ? "timed out waiting for output" : "timed out"})${params.includeDetails && params.lastToolError.error ? `: ${params.lastToolError.error}` : ""}${params.includeDetails ? "" : ". Use /verbose full for complete output"}.`;
	if (isExecLikeToolName(params.lastToolError.toolName)) {
		const toolLabel = formatToolAggregate(params.lastToolError.toolName, void 0, { markdown: params.useMarkdown });
		const subject = params.includeDetails ? formatExecLikeFailureSubject(params.lastToolError.meta, params.useMarkdown) : "";
		const conciseExitSuffix = params.includeDetails ? "" : formatConciseExecExitSuffix(params.lastToolError.error);
		const errorSuffix = params.includeDetails && params.lastToolError.error ? `: ${params.lastToolError.error}` : "";
		return subject ? `⚠️ ${toolLabel} failed: ${subject}${conciseExitSuffix}${errorSuffix}` : `⚠️ ${toolLabel} failed${conciseExitSuffix}${errorSuffix}`;
	}
	return `⚠️ ${formatToolAggregate(params.lastToolError.toolName, params.includeDetails && params.lastToolError.meta ? [params.lastToolError.meta] : void 0, { markdown: params.useMarkdown })} failed${params.includeDetails && params.lastToolError.error ? `: ${params.lastToolError.error}` : ""}`;
}
function formatExecLikeFailureSubject(meta, markdown) {
	const normalized = normalizeOptionalString(meta);
	if (!normalized) return "";
	const { flags, body } = splitExecLikeFailureMeta(normalized);
	if (!body) return flags.join(" · ");
	const { text, suffix } = splitDisplayContextSuffix(body);
	const subject = `${maybeWrapInlineCode(extractLiteralExecCommand(text) ?? text, markdown)}${suffix}`;
	return flags.length > 0 ? `${flags.join(" · ")} · ${subject}` : subject;
}
function splitExecLikeFailureMeta(meta) {
	const flags = [];
	const bodyParts = [];
	for (const part of meta.split(" · ").map((candidate) => candidate.trim()).filter(Boolean)) {
		if (part === "elevated" || part === "pty") {
			flags.push(part);
			continue;
		}
		bodyParts.push(part);
	}
	return {
		flags,
		body: bodyParts.join(" · ")
	};
}
const SEMANTIC_RUN_SUMMARIES = /* @__PURE__ */ new Set([
	"tests",
	"build",
	"lint",
	"script",
	"command"
]);
const LITERAL_RUN_SUMMARY_PREFIXES = /* @__PURE__ */ new Set([
	"python",
	"python3",
	"ruby",
	"php",
	"git",
	"npm",
	"pnpm",
	"yarn",
	"bun",
	"openclaw",
	"make",
	"cargo",
	"go",
	"docker",
	"npx",
	"uv",
	"poetry",
	"pytest",
	"vitest",
	"jest",
	"deno"
]);
function extractLiteralExecCommand(body) {
	const rawCommand = extractRawExecCommand(body);
	if (rawCommand) return rawCommand;
	const nodeScript = body.match(/^run node script (.+)$/u);
	if (nodeScript?.[1]) return `node ${nodeScript[1]}`;
	const runSubject = body.match(/^run (.+)$/u)?.[1];
	if (runSubject && isKnownLiteralRunSummary(runSubject)) return runSubject;
}
function extractRawExecCommand(body) {
	const codeSpan = extractTrailingMarkdownCodeSpan(body);
	if (!codeSpan) return;
	const context = extractRawExecContext(codeSpan.prefix, codeSpan.value);
	const command = context.trailing.reduce((value, suffix) => `${value} ${suffix}`, codeSpan.value);
	return context.leading.length > 0 ? `${context.leading.join(" · ")} · ${command}` : command;
}
function extractTrailingMarkdownCodeSpan(body) {
	const trimmed = body.trimEnd();
	if (!trimmed.endsWith("`")) return;
	let delimiterLength = 0;
	for (let index = trimmed.length - 1; index >= 0 && trimmed[index] === "`"; index -= 1) delimiterLength += 1;
	const delimiter = "`".repeat(delimiterLength);
	const valueEnd = trimmed.length - delimiterLength;
	let searchIndex = 0;
	while (searchIndex < valueEnd) {
		const openIndex = trimmed.indexOf(delimiter, searchIndex);
		if (openIndex < 0 || openIndex >= valueEnd) return;
		const prefixMatch = trimmed.slice(0, openIndex).match(/^(?:(.*)(?:,\s*| · ))?$/u);
		if (prefixMatch) return {
			prefix: prefixMatch[1],
			value: unwrapMarkdownInlineCodePadding(trimmed.slice(openIndex + delimiterLength, valueEnd))
		};
		searchIndex = openIndex + delimiterLength;
	}
}
function unwrapMarkdownInlineCodePadding(value) {
	if (value.length < 2 || !value.startsWith(" ") || !value.endsWith(" ")) return value;
	const unwrapped = value.slice(1, -1);
	return /\S/u.test(unwrapped) ? unwrapped : value;
}
function extractRawExecContext(prefix, inlineCode) {
	const value = prefix ?? "";
	return {
		leading: [...value.matchAll(/(?:^|,\s*| · )(node:\s*[^,·]+)(?=,\s*| · |$)/gu)].map((match) => match[1]?.trim()).filter((part) => Boolean(part)),
		trailing: [...value.matchAll(/(\((?:agent|repo|sandbox|workspace)\)|\(in [^)\r\n]+\))(?=\s*(?:,\s*| · |$))/gu)].filter((match) => shouldKeepRawExecTrailingContext(value, match, inlineCode)).map((match) => match[1]?.trim()).filter((part) => Boolean(part))
	};
}
function shouldKeepRawExecTrailingContext(prefix, match, inlineCode) {
	const suffix = match[1]?.trim();
	if (!suffix || inlineCode.includes(suffix)) return false;
	const segment = prefix.slice(0, match.index ?? 0).trimEnd().split(/,\s*| · /u).at(-1)?.trim();
	if ((segment ? extractLiteralExecCommand(segment) : void 0) === inlineCode || segment === inlineCode) return true;
	if (isCompactCwdSuffix(suffix)) return true;
	return isPathLikeCwdSuffix(suffix);
}
function isCompactCwdSuffix(suffix) {
	return /^\((?:agent|repo|workspace)\)$/u.test(suffix);
}
function isPathLikeCwdSuffix(suffix) {
	const cwd = suffix.match(/^\(in ([^)\r\n]+)\)$/u)?.[1]?.trim();
	return Boolean(cwd && (/^(?:\/|~|\.{1,2}(?:\/|$)|[A-Za-z]:[\\/]|\\\\)/u.test(cwd) || cwd.includes("/")));
}
function isKnownLiteralRunSummary(subject) {
	if (SEMANTIC_RUN_SUMMARIES.has(subject) || subject.includes("→") || subject.includes("->") || /^(?:node|python3?|ruby|php) inline script(?: \(heredoc\))?$/u.test(subject)) return false;
	const match = subject.match(/^(\S+)\s+(.+)$/u);
	const command = match?.[1];
	const remainder = match?.[2];
	if (!command || !remainder || remainder === "command") return false;
	return LITERAL_RUN_SUMMARY_PREFIXES.has(command);
}
function splitDisplayContextSuffix(value) {
	const match = /^(.*?)( \((?:agent|repo|workspace|sandbox)\))$/u.exec(value);
	if (!match) return {
		text: value,
		suffix: ""
	};
	return {
		text: match[1] ?? value,
		suffix: match[2] ?? ""
	};
}
function formatConciseExecExitSuffix(error) {
	const code = normalizeOptionalString(error)?.match(/\b(?:command\s+)?(?:failed\s+with\s+exit\s+code|exited\s+with\s+code|exit(?:ed)?\s+code|exit\s+status)\s+(-?\d+)\b/iu)?.[1];
	return code ? ` (exit ${code})` : "";
}
function maybeWrapInlineCode(value, markdown) {
	return markdown ? formatInlineCodeSpan(value) : value;
}
/**
* Chooses whether a tool failure needs a separate user-visible warning and
* whether to include raw details. Mutating failures are stricter because a
* silent failed write/send/delete can make the assistant look successful.
*/
function resolveToolErrorWarningPolicy(params) {
	const normalizedToolName = normalizeOptionalLowercaseString(params.lastToolError.toolName) ?? "";
	let toolErrorWarningOverride;
	let dynamicToolErrorWarningsDisabled = false;
	if (typeof params.suppressToolErrorWarnings === "function") {
		toolErrorWarningOverride = params.suppressToolErrorWarnings();
		dynamicToolErrorWarningsDisabled = toolErrorWarningOverride === false;
	} else toolErrorWarningOverride = params.suppressToolErrorWarnings;
	const includeDetails = !dynamicToolErrorWarningsDisabled && isVerboseToolDetailEnabled(params.verboseLevel);
	if (toolErrorWarningOverride === true) return {
		showWarning: false,
		includeDetails
	};
	if (normalizedToolName === "sessions_send") return {
		showWarning: false,
		includeDetails
	};
	if (params.suppressToolErrors) return {
		showWarning: false,
		includeDetails
	};
	if (isExecLikeToolName(params.lastToolError.toolName)) return {
		showWarning: !params.hasUserFacingReply,
		includeDetails
	};
	if (params.lastToolError.terminalDiagnostic?.kind === "process") return {
		showWarning: !params.hasUserFacingReply,
		includeDetails
	};
	if (params.lastToolError.mutatingAction ?? isLikelyMutatingToolName(params.lastToolError.toolName)) return {
		showWarning: !params.hasUserFacingErrorReply && !params.hasUserFacingFailureAcknowledgement,
		includeDetails
	};
	return {
		showWarning: !params.hasUserFacingReply && !isRecoverableToolError(params.lastToolError.error),
		includeDetails
	};
}
function buildFailureWarning(params) {
	const warningPolicy = resolveToolErrorWarningPolicy(params);
	if (!warningPolicy.showWarning) return;
	return {
		text: formatToolErrorWarningText({
			lastToolError: params.lastToolError,
			includeDetails: warningPolicy.includeDetails,
			useMarkdown: params.useMarkdown
		}),
		nonTerminalToolErrorWarning: shouldMarkNonTerminalToolErrorWarning(params.lastToolError)
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run/tool-failure-acknowledgement.ts
const MUTATING_FAILURE_ACTION_PATTERN = "(?:write|edit|update|save|create|delete|remove|modify|change|apply|patch|move|rename|send|reply|message|run|execute|execution|command|script|shell|bash|exec|tool|action|operation)";
const MUTATING_FAILURE_INABILITY_PATTERN = new RegExp(`\\b(?:couldn't|could not|can't|cannot|unable to|am unable to|wasn't able to|was not able to|were unable to)\\b.{0,100}\\b${MUTATING_FAILURE_ACTION_PATTERN}\\b`, "u");
const MUTATING_FAILURE_ACTION_THEN_FAILURE_PATTERN = new RegExp(`\\b${MUTATING_FAILURE_ACTION_PATTERN}\\b.{0,100}\\b(?:failed|failure|errored)\\b`, "u");
const MUTATING_FAILURE_FAILURE_THEN_ACTION_PATTERN = new RegExp(`\\b(?:failed|failure)\\b.{0,100}\\b${MUTATING_FAILURE_ACTION_PATTERN}\\b`, "u");
const MUTATING_FAILURE_ERROR_WHILE_ACTION_PATTERN = new RegExp(`\\b(?:hit|encountered|ran into)\\b.{0,60}\\berror\\b.{0,100}\\b(?:while|trying to|when)\\b.{0,100}\\b${MUTATING_FAILURE_ACTION_PATTERN}\\b`, "u");
const DID_NOT_FAIL_PATTERN = /\b(?:did not|didn't)\s+fail\b/u;
const NEGATED_FAILURE_PATTERN = /\b(?:no|not|without)\s+(?:failures?|errors?)\b/u;
/** Detect a user-visible acknowledgement that a mutating action did not complete. */
function hasExplicitMutatingToolFailureAcknowledgement(text) {
	const normalizedText = normalizeTextForComparison(text);
	if (!normalizedText || DID_NOT_FAIL_PATTERN.test(normalizedText)) return false;
	if (MUTATING_FAILURE_INABILITY_PATTERN.test(normalizedText)) return true;
	if (NEGATED_FAILURE_PATTERN.test(normalizedText)) return false;
	return MUTATING_FAILURE_ACTION_THEN_FAILURE_PATTERN.test(normalizedText) || MUTATING_FAILURE_FAILURE_THEN_ACTION_PATTERN.test(normalizedText) || MUTATING_FAILURE_ERROR_WHILE_ACTION_PATTERN.test(normalizedText);
}
//#endregion
//#region src/agents/embedded-agent-runner/run/payloads.ts
/**
* Builds embedded-agent payload objects from attempt inputs and outcomes.
*/
function isAssistantTextContentBlockType(value) {
	return value === "text" || value === "input_text" || value === "output_text";
}
function resolveRawAssistantAnswerText(lastAssistant) {
	if (!lastAssistant) return "";
	const finalAnswerText = extractAssistantTextForPhase(lastAssistant, {
		phase: "final_answer",
		sanitizeText: sanitizeAssistantFinalAnswerText
	});
	if (finalAnswerText) return normalizeOptionalString(finalAnswerText) ?? "";
	if (Array.isArray(lastAssistant.content)) {
		if (!lastAssistant.content.some((block) => {
			if (!block || typeof block !== "object") return false;
			const record = block;
			return isAssistantTextContentBlockType(record.type) && Boolean(parseAssistantTextSignature(record)?.phase);
		})) {
			const signedUnphasedParts = lastAssistant.content.map((block) => {
				if (!block || typeof block !== "object") return null;
				const record = block;
				const signature = parseAssistantTextSignature(record);
				if (!isAssistantTextContentBlockType(record.type) || typeof record.text !== "string" || !signature?.id || signature.phase) return null;
				const text = sanitizeAssistantFinalAnswerText(record.text);
				return text.trim() ? text : null;
			}).filter((value) => typeof value === "string");
			if (signedUnphasedParts.length) return normalizeOptionalString(signedUnphasedParts.join("\n")) ?? "";
		}
	}
	return normalizeOptionalString(extractAssistantTextForPhase(lastAssistant, { sanitizeText: sanitizeAssistantVisibleText })) ?? "";
}
function normalizeReplyTextForComparison(text) {
	return normalizeTextForComparison(parseReplyDirectives(text).text ?? "");
}
/**
* Converts a completed embedded attempt into reply payloads for channels. This
* is the boundary that suppresses duplicate source replies, filters raw API
* errors, preserves directive metadata, and decides when tool failures must be
* surfaced to the user.
*/
function buildEmbeddedRunPayloads(params) {
	const heartbeatTerminalToolFailure = params.isHeartbeatTrigger === true && params.lastToolError && params.lastToolError.mutatingAction === true ? { toolName: params.lastToolError.toolName } : void 0;
	if (params.heartbeatToolResponse && !heartbeatTerminalToolFailure) return [createHeartbeatToolResponsePayload(params.heartbeatToolResponse)];
	const { replyItems, hasSourceReplyPayload, deliveredSourceReplyViaMessageTool, explicitFinalSourceReply, completedSourceReplyViaMessageTool } = buildSourceReplyPayloadState({
		payloads: params.messagingToolSourceReplyPayloads,
		sentTargets: params.messagingToolSentTargets,
		sourceReplyDeliveryMode: params.sourceReplyDeliveryMode,
		didDeliverSourceReplyViaMessageTool: params.didDeliverSourceReplyViaMessageTool,
		runId: params.runId
	});
	if (params.heartbeatToolResponse) {
		const heartbeatPayload = createHeartbeatToolResponsePayload(params.heartbeatToolResponse);
		replyItems.push({
			text: heartbeatPayload.text ?? "",
			...heartbeatPayload.channelData ? { channelData: heartbeatPayload.channelData } : {}
		});
	}
	const useMarkdown = params.toolResultFormat === "markdown";
	const suppressAssistantArtifacts = params.heartbeatToolResponse !== void 0 || params.didSendDeterministicApprovalPrompt === true || params.sourceReplyDeliveryMode === "message_tool_only" && hasSourceReplyPayload || deliveredSourceReplyViaMessageTool;
	const suppressFailureArtifacts = params.didSendDeterministicApprovalPrompt === true || params.sourceReplyDeliveryMode === "message_tool_only" && completedSourceReplyViaMessageTool;
	const nonEmptyAssistantTexts = params.assistantTexts.map((text) => sanitizeAssistantVisibleStreamText(text)).filter((text) => text.trim().length > 0);
	const assistantForPayload = params.currentAssistant ?? void 0 ?? (nonEmptyAssistantTexts.length === 1 ? void 0 : params.lastAssistant);
	const lastAssistantStopReason = assistantForPayload?.stopReason;
	const lastAssistantErrored = lastAssistantStopReason === "error";
	const lastAssistantAborted = lastAssistantStopReason === "aborted";
	const runAborted = params.runAborted === true || lastAssistantAborted;
	const lastAssistantNeedsErrorSurface = lastAssistantErrored || lastAssistantAborted;
	const rawErrorMessage = lastAssistantNeedsErrorSurface ? normalizeOptionalString(assistantForPayload?.errorMessage) : void 0;
	const errorText = assistantForPayload && lastAssistantNeedsErrorSurface ? suppressFailureArtifacts ? void 0 : lastAssistantErrored || rawErrorMessage ? formatUserFacingAssistantErrorText(assistantForPayload, {
		cfg: params.config,
		sessionKey: params.sessionKey,
		provider: params.provider,
		providerOwner: params.providerOwner,
		model: params.model,
		authMode: params.authMode
	}) : formatAssistantErrorText(assistantForPayload, {
		cfg: params.config,
		sessionKey: params.sessionKey,
		provider: params.provider,
		providerOwner: params.providerOwner,
		model: params.model,
		authMode: params.authMode
	}) : void 0;
	const rawErrorFingerprint = rawErrorMessage ? getApiErrorPayloadFingerprint(rawErrorMessage) : null;
	const formattedRawErrorMessage = rawErrorMessage ? formatRawAssistantErrorForUi(rawErrorMessage) : null;
	const normalizedFormattedRawErrorMessage = formattedRawErrorMessage ? normalizeTextForComparison(formattedRawErrorMessage) : null;
	const normalizedRawErrorText = rawErrorMessage ? normalizeTextForComparison(rawErrorMessage) : null;
	const normalizedErrorText = errorText ? normalizeTextForComparison(errorText) : null;
	const normalizedGenericBillingErrorText = normalizeTextForComparison(BILLING_ERROR_USER_MESSAGE);
	const genericErrorText = "The AI service returned an error. Please try again.";
	if (errorText) replyItems.push({
		text: errorText,
		isError: true
	});
	const reasoningText = suppressAssistantArtifacts || runAborted || lastAssistantNeedsErrorSurface ? "" : assistantForPayload && params.reasoningLevel === "on" && params.thinkingLevel !== "off" ? extractAssistantThinking(assistantForPayload) : "";
	if (reasoningText) replyItems.push({
		text: reasoningText,
		isReasoning: true
	});
	const fallbackAnswerText = assistantForPayload ? extractAssistantVisibleText(assistantForPayload) : "";
	const fallbackRawAnswerText = resolveRawAssistantAnswerText(assistantForPayload);
	const shouldSuppressRawErrorText = (text) => {
		if (!lastAssistantNeedsErrorSurface) return false;
		const trimmed = text.trim();
		if (!trimmed) return false;
		if (errorText) {
			const normalized = normalizeTextForComparison(trimmed);
			if (normalized && normalizedErrorText && normalized === normalizedErrorText) return true;
			if (trimmed === genericErrorText) return true;
			if (normalized && normalizedGenericBillingErrorText && normalized === normalizedGenericBillingErrorText) return true;
		}
		if (rawErrorMessage && trimmed === rawErrorMessage) return true;
		if (formattedRawErrorMessage && trimmed === formattedRawErrorMessage) return true;
		if (normalizedRawErrorText) {
			const normalized = normalizeTextForComparison(trimmed);
			if (normalized && normalized === normalizedRawErrorText) return true;
		}
		if (normalizedFormattedRawErrorMessage) {
			const normalized = normalizeTextForComparison(trimmed);
			if (normalized && normalized === normalizedFormattedRawErrorMessage) return true;
		}
		if (rawErrorFingerprint) {
			const fingerprint = getApiErrorPayloadFingerprint(trimmed);
			if (fingerprint && fingerprint === rawErrorFingerprint) return true;
		}
		return isRawApiErrorPayload(trimmed);
	};
	const rawAnswerDirectiveState = fallbackRawAnswerText ? parseReplyDirectives(fallbackRawAnswerText) : null;
	const rawAnswerHasMedia = (rawAnswerDirectiveState?.mediaUrls?.length ?? 0) > 0 || rawAnswerDirectiveState?.audioAsVoice;
	const assistantTextsHaveMedia = params.assistantTexts.some((text) => {
		const parsed = parseReplyDirectives(text);
		return (parsed.mediaUrls?.length ?? 0) > 0 || parsed.audioAsVoice;
	});
	const normalizedAssistantTexts = normalizeTextForComparison(nonEmptyAssistantTexts.join("\n\n"));
	const normalizedRawAnswerText = normalizeTextForComparison(rawAnswerDirectiveState?.text ?? "");
	const shouldPreferRawAnswerText = rawAnswerHasMedia && (!nonEmptyAssistantTexts.length || !assistantTextsHaveMedia && normalizedAssistantTexts.length > 0 && normalizedAssistantTexts === normalizedRawAnswerText);
	const fallbackAnswerSourceText = shouldPreferRawAnswerText && fallbackRawAnswerText ? fallbackRawAnswerText : fallbackAnswerText;
	const normalizedFallbackAnswerSourceText = fallbackAnswerSourceText ? normalizeReplyTextForComparison(fallbackAnswerSourceText) : "";
	const shouldUseCanonicalFinalAnswer = !lastAssistantNeedsErrorSurface && fallbackAnswerSourceText.length > 0 && normalizedFallbackAnswerSourceText.length > 0;
	const hasAssistantTextPayload = nonEmptyAssistantTexts.length > 0;
	const answerTexts = suppressAssistantArtifacts || runAborted || lastAssistantNeedsErrorSurface ? [] : (shouldUseCanonicalFinalAnswer ? [fallbackAnswerSourceText] : shouldPreferRawAnswerText && fallbackRawAnswerText ? [fallbackRawAnswerText] : hasAssistantTextPayload ? nonEmptyAssistantTexts : fallbackAnswerText ? [fallbackAnswerText] : []).filter((text) => !shouldSuppressRawErrorText(text));
	let hasUserFacingAssistantReply = completedSourceReplyViaMessageTool || params.heartbeatToolResponse?.notify === true;
	const hasUserFacingErrorReply = replyItems.some((item) => item.isError === true);
	let hasUserFacingFailureAcknowledgement = params.heartbeatToolResponse?.notify === true && (params.heartbeatToolResponse.outcome === "blocked" || hasExplicitMutatingToolFailureAcknowledgement(getHeartbeatToolNotificationText(params.heartbeatToolResponse)));
	for (const text of answerTexts) {
		const { text: cleanedText, mediaUrls, audioAsVoice, replyToId, replyToTag, replyToCurrent } = parseReplyDirectives(text);
		if (!cleanedText && (!mediaUrls || mediaUrls.length === 0) && !audioAsVoice) continue;
		replyItems.push({
			text: cleanedText,
			media: mediaUrls,
			audioAsVoice,
			replyToId,
			replyToTag,
			replyToCurrent
		});
		hasUserFacingAssistantReply = true;
		if (cleanedText && hasExplicitMutatingToolFailureAcknowledgement(cleanedText)) hasUserFacingFailureAcknowledgement = true;
	}
	if (params.lastToolError) {
		const failureWarning = buildFailureWarning({
			lastToolError: params.lastToolError,
			hasUserFacingReply: hasUserFacingAssistantReply,
			hasUserFacingErrorReply,
			hasUserFacingFailureAcknowledgement,
			suppressToolErrors: Boolean(params.config?.messages?.suppressToolErrors),
			suppressToolErrorWarnings: params.suppressToolErrorWarnings,
			verboseLevel: params.verboseLevel,
			useMarkdown
		});
		if (failureWarning) {
			const normalizedWarning = normalizeTextForComparison(failureWarning.text);
			if (!(normalizedWarning ? replyItems.some((item) => {
				if (!item.text) return false;
				const normalizedExisting = normalizeTextForComparison(item.text);
				return normalizedExisting.length > 0 && normalizedExisting === normalizedWarning;
			}) : false)) replyItems.push({
				text: failureWarning.text,
				isError: true,
				nonTerminalToolErrorWarning: hasUserFacingAssistantReply && failureWarning.nonTerminalToolErrorWarning
			});
		}
	}
	if (heartbeatTerminalToolFailure && !replyItems.some((item) => item.isReasoning !== true)) replyItems.push({ text: HEARTBEAT_TOKEN });
	const hasAudioAsVoiceTag = replyItems.some((item) => item.audioAsVoice);
	return replyItems.map((item) => {
		const payload = { text: normalizeOptionalString(item.text) };
		const mediaUrl = item.mediaUrl ?? item.media?.[0];
		if (mediaUrl) payload.mediaUrl = mediaUrl;
		if (item.media?.length) payload.mediaUrls = item.media;
		if (item.isError !== void 0) payload.isError = item.isError;
		if (item.isReasoning === true) payload.isReasoning = true;
		if (item.isError === true && params.sourceReplyDeliveryMode === "message_tool_only" && explicitFinalSourceReply === false) markReplyPayloadForSourceSuppressionDelivery(payload);
		if (item.nonTerminalToolErrorWarning) setReplyPayloadMetadata(payload, { nonTerminalToolErrorWarning: true });
		if (heartbeatTerminalToolFailure) setReplyPayloadMetadata(payload, { heartbeatTerminalToolFailure });
		if (!item.isError && !item.isReasoning && (params.assistantMessageIndex !== void 0 || params.assistantTranscriptOwned === true)) setReplyPayloadMetadata(payload, {
			...params.assistantMessageIndex !== void 0 ? { assistantMessageIndex: params.assistantMessageIndex } : {},
			...item.media?.length ? { assistantTranscriptMediaUrls: [...item.media] } : {},
			...params.assistantTranscriptOwned === true ? { assistantTranscriptOwned: true } : {},
			...params.assistantTranscriptIdempotencyKey ? { assistantTranscriptIdempotencyKey: params.assistantTranscriptIdempotencyKey } : {}
		});
		if (item.replyToId) payload.replyToId = item.replyToId;
		if (item.replyToTag !== void 0) payload.replyToTag = item.replyToTag;
		if (item.replyToCurrent !== void 0) payload.replyToCurrent = item.replyToCurrent;
		if (item.audioAsVoice || Boolean(hasAudioAsVoiceTag && item.media?.length)) payload.audioAsVoice = true;
		if (item.presentation) payload.presentation = item.presentation;
		if (item.interactive) payload.interactive = item.interactive;
		if (item.channelData) payload.channelData = item.channelData;
		if (item.sourceReplyMirror) {
			markReplyPayloadForSourceSuppressionDelivery(payload);
			if (params.sessionKey) {
				const sourceReplyTranscriptMirror = { sessionKey: params.sessionKey };
				if (params.agentId) sourceReplyTranscriptMirror.agentId = params.agentId;
				if (payload.text) sourceReplyTranscriptMirror.text = payload.text;
				if (payload.mediaUrls?.length) sourceReplyTranscriptMirror.mediaUrls = payload.mediaUrls;
				if (item.sourceReplyMirror.idempotencyKey) sourceReplyTranscriptMirror.idempotencyKey = item.sourceReplyMirror.idempotencyKey;
				setReplyPayloadMetadata(payload, { sourceReplyTranscriptMirror });
			}
		}
		if (payload.text && isSilentReplyPayloadText(payload.text, "NO_REPLY")) {
			const silentText = payload.text;
			payload.text = void 0;
			if (hasReplyPayloadContent(payload)) return payload;
			payload.text = silentText;
		}
		return payload;
	}).filter((p) => {
		if (!hasReplyPayloadContent(p)) return false;
		if (p.text && isSilentReplyPayloadText(p.text, "NO_REPLY")) return false;
		return true;
	});
}
//#endregion
export { withBeforeAgentReplyObserver as a, runBeforeAgentReplyForTurn as i, resolveAuthProfileFailureReason as n, buildHandledBeforeAgentReplyPayloads as r, buildEmbeddedRunPayloads as t };
