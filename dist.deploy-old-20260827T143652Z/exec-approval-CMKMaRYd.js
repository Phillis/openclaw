import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { v as uniqueStrings } from "./string-normalization-e_fvmxMf.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { t as ErrorCodes } from "./gateway-error-details-BWo6Le6w.js";
import { Ft as validateExecApprovalResolveParams, Nt as validateExecApprovalGetParams, Pt as validateExecApprovalRequestParams } from "./src-Bo4ezI_n.js";
import { s as errorShape } from "./error-codes-CMSvT5-d.js";
import { F as normalizeExecAsk, N as DEFAULT_EXEC_APPROVAL_TIMEOUT_MS, O as normalizeExecApprovalUnavailableDecisions, R as normalizeExecSecurity, j as resolveExecApprovalRequestAllowedDecisions } from "./exec-approvals-DkNiV-ux.js";
import { a as detectCommandCarrierArgv, s as detectInlineEvalInSegments } from "./risks-CsMxFHRL.js";
import { t as resolveExecCommandHighlighting } from "./exec-command-highlighting-md5t1l9z.js";
import { i as sanitizeExecApprovalWarningText, n as sanitizeExecApprovalDisplayText, r as sanitizeExecApprovalDisplayTextWithStatus, t as resolveExecApprovalCommandDisplay } from "./exec-approval-command-display-B8xcL7SB.js";
import { t as analyzeCommandForPolicy } from "./policy-KCMV8X4V.js";
import { a as buildSystemRunApprovalEnvBinding, i as buildSystemRunApprovalBinding } from "./system-run-command-Dyih2lau.js";
import { n as resolveSystemRunApprovalRequestContext } from "./system-run-approval-context-Blm3aAYL.js";
import { t as assertValidParams } from "./validation-CsGeElrb.js";
import { r as InvalidApprovalIdError } from "./exec-approval-manager-Cow8ArCV.js";
import { a as handleApprovalResolve, c as registerPendingApprovalRecord, f as listVisiblePendingApprovalRequests, i as buildRequestedApprovalEvent, l as resolveApprovalDecisionParams, m as respondPendingApprovalLookupError, n as bindApprovalReviewerDeviceIds, o as handleApprovalWaitDecision, p as resolvePendingApprovalRecord, s as handlePendingApprovalRequest, t as bindApprovalRequesterMetadata } from "./approval-shared-DPu2FPJR.js";
import { t as runApprovalRequestDeliveries } from "./approval-request-delivery-D-BFp1xC.js";
//#region src/infra/command-analysis/explain.ts
function riskLabel(risk) {
	switch (risk.kind) {
		case "inline-eval": return `${risk.command} ${risk.flag}`;
		case "shell-wrapper": return `${risk.executable} ${risk.flag}`;
		case "command-carrier": return risk.flag ? `${risk.command} ${risk.flag}` : risk.command;
		case "dynamic-argument": return `${risk.command} dynamic argument`;
		case "source": return risk.command;
		case "function-definition": return risk.name;
		default: return risk.kind;
	}
}
/** Summarizes parsed shell-command explanation data for display. */
function summarizeCommandExplanation(explanation) {
	const riskKinds = uniqueStrings(explanation.risks.map((risk) => risk.kind));
	const warningLines = explanation.risks.map((risk) => {
		const label = riskLabel(risk);
		return label === risk.kind ? `Contains ${risk.kind}` : `Contains ${risk.kind}: ${label}`;
	});
	return {
		commandCount: explanation.topLevelCommands.length,
		nestedCommandCount: explanation.nestedCommands.length,
		riskKinds,
		warningLines: uniqueStrings(warningLines)
	};
}
function summarizeCommandSegmentsForDisplay(segments) {
	const riskKinds = [];
	const warningLines = [];
	const inlineEval = detectInlineEvalInSegments(segments);
	if (inlineEval) {
		riskKinds.push("inline-eval");
		warningLines.push(`Contains inline-eval: ${inlineEval.normalizedExecutable} ${inlineEval.flag}`);
	}
	for (const segment of segments) {
		const effectiveArgv = segment.resolution?.effectiveArgv ?? segment.argv;
		for (const hit of detectCommandCarrierArgv(effectiveArgv)) {
			riskKinds.push("command-carrier");
			warningLines.push(hit.flag ? `Contains command-carrier: ${hit.command} ${hit.flag}` : `Contains command-carrier: ${hit.command}`);
		}
	}
	return {
		commandCount: segments.length,
		nestedCommandCount: 0,
		riskKinds: uniqueStrings(riskKinds),
		warningLines: uniqueStrings(warningLines)
	};
}
async function resolveCommandAnalysisSummaryForDisplay(params) {
	const summary = params.host === "node" ? (() => {
		if (!Array.isArray(params.commandArgv) || params.commandArgv.length === 0) return null;
		const analysis = analyzeCommandForPolicy({
			source: "argv",
			argv: params.commandArgv,
			cwd: params.cwd ?? void 0
		});
		return analysis.ok ? summarizeCommandSegmentsForDisplay(analysis.segments) : null;
	})() : (await explainCommandForDisplay(params.commandText))?.summary;
	if (!summary) return null;
	const sanitizeText = params.sanitizeText;
	if (!sanitizeText) return summary;
	return {
		commandCount: summary.commandCount,
		nestedCommandCount: summary.nestedCommandCount,
		riskKinds: summary.riskKinds.map((kind) => sanitizeText(kind)),
		warningLines: summary.warningLines.map((line) => sanitizeText(line))
	};
}
async function explainCommandForDisplay(command) {
	try {
		const { explainShellCommand } = await import("./extract-CJ9OFF2W.js");
		const explanation = await explainShellCommand(command);
		return {
			explanation,
			summary: summarizeCommandExplanation(explanation)
		};
	} catch {
		return null;
	}
}
//#endregion
//#region src/gateway/server-methods/exec-approval.ts
const APPROVAL_ALLOW_ALWAYS_UNAVAILABLE_DETAILS = { reason: "APPROVAL_ALLOW_ALWAYS_UNAVAILABLE" };
const RESERVED_PLUGIN_APPROVAL_ID_PREFIX = "plugin:";
function normalizeCommandSpans(spans, commandLength) {
	if (!spans) return;
	const candidates = spans.filter((span) => Number.isSafeInteger(span.startIndex) && Number.isSafeInteger(span.endIndex) && span.startIndex >= 0 && span.endIndex > span.startIndex && span.endIndex <= commandLength).toSorted((a, b) => a.startIndex - b.startIndex || b.endIndex - a.endIndex);
	const accepted = [];
	let cursor = 0;
	for (const span of candidates) {
		if (span.startIndex < cursor) continue;
		accepted.push({
			startIndex: span.startIndex,
			endIndex: span.endIndex
		});
		cursor = span.endIndex;
	}
	return accepted.length > 0 ? accepted : void 0;
}
function createExecApprovalHandlers(manager, opts) {
	return {
		"exec.approval.get": async ({ params, respond, client }) => {
			if (!assertValidParams(params, validateExecApprovalGetParams, "exec.approval.get", respond)) return;
			const resolved = resolvePendingApprovalRecord({
				manager,
				inputId: params.id,
				client,
				exposeAmbiguousPrefixError: true
			});
			if (!resolved.ok) {
				respondPendingApprovalLookupError({
					respond,
					response: resolved.response
				});
				return;
			}
			const { commandText, commandPreview } = resolveExecApprovalCommandDisplay(resolved.snapshot.request);
			respond(true, {
				id: resolved.approvalId,
				commandText,
				commandPreview,
				allowedDecisions: resolveExecApprovalRequestAllowedDecisions(resolved.snapshot.request),
				host: resolved.snapshot.request.host ?? null,
				nodeId: resolved.snapshot.request.nodeId ?? null,
				agentId: resolved.snapshot.request.agentId ?? null,
				expiresAtMs: resolved.snapshot.expiresAtMs
			}, void 0);
		},
		"exec.approval.list": async ({ respond, client }) => {
			respond(true, listVisiblePendingApprovalRequests({
				manager,
				client
			}), void 0);
		},
		"exec.approval.request": async ({ params, respond, context, client }) => {
			if (!assertValidParams(params, validateExecApprovalRequestParams, "exec.approval.request", respond)) return;
			const p = params;
			const twoPhase = p.twoPhase === true;
			const timeoutMs = typeof p.timeoutMs === "number" ? p.timeoutMs : DEFAULT_EXEC_APPROVAL_TIMEOUT_MS;
			const explicitId = p.id ?? null;
			const host = normalizeOptionalString(p.host) ?? "";
			const nodeId = normalizeOptionalString(p.nodeId) ?? "";
			const trustedAgentRuntime = client?.internal?.agentRuntimeIdentity;
			if (trustedAgentRuntime && context.validateAgentRuntimeApprovalAuthority?.(trustedAgentRuntime) !== true) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "agent runtime approval authority is no longer active"));
				return;
			}
			const approvalContext = resolveSystemRunApprovalRequestContext({
				host,
				command: p.command,
				commandArgv: p.commandArgv,
				systemRunPlan: p.systemRunPlan,
				cwd: p.cwd,
				agentId: trustedAgentRuntime?.agentId ?? p.agentId,
				sessionKey: trustedAgentRuntime?.sessionKey ?? p.sessionKey
			});
			const effectiveCommandArgv = approvalContext.commandArgv;
			const effectiveCwd = approvalContext.cwd;
			const effectiveAgentId = approvalContext.agentId;
			const effectiveSessionKey = approvalContext.sessionKey;
			const effectiveCommandText = approvalContext.commandText;
			const requestRunId = trustedAgentRuntime?.operationalRunInstance.runId ?? normalizeOptionalString(p.runId);
			if (host === "node" && !nodeId) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "nodeId is required for host=node"));
				return;
			}
			if (host === "node" && !approvalContext.plan) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "systemRunPlan is required for host=node"));
				return;
			}
			if (effectiveCommandText.trim().length === 0) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "command is required"));
				return;
			}
			if (explicitId?.startsWith(RESERVED_PLUGIN_APPROVAL_ID_PREFIX)) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `approval ids starting with ${RESERVED_PLUGIN_APPROVAL_ID_PREFIX} are reserved`));
				return;
			}
			if (host === "node" && (!Array.isArray(effectiveCommandArgv) || effectiveCommandArgv.length === 0)) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "commandArgv is required for host=node"));
				return;
			}
			const envBinding = buildSystemRunApprovalEnvBinding(p.env);
			const warningText = normalizeOptionalString(p.warningText);
			const commandHighlighting = resolveExecCommandHighlighting({
				config: typeof context.getRuntimeConfig === "function" ? context.getRuntimeConfig() : {},
				agentId: effectiveAgentId
			});
			const sanitizedCommandDisplay = sanitizeExecApprovalDisplayTextWithStatus(effectiveCommandText);
			if (sanitizedCommandDisplay.truncated || sanitizedCommandDisplay.oversized) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "command exceeds exec approval display limit", { details: { reason: "EXEC_APPROVAL_COMMAND_DISPLAY_LIMIT" } }));
				return;
			}
			const sanitizedCommandText = sanitizedCommandDisplay.text;
			const commandAnalysis = await resolveCommandAnalysisSummaryForDisplay({
				host,
				commandText: effectiveCommandText,
				commandArgv: effectiveCommandArgv,
				cwd: effectiveCwd,
				sanitizeText: sanitizeExecApprovalWarningText
			});
			const commandSpans = commandHighlighting && sanitizedCommandText === effectiveCommandText ? normalizeCommandSpans(p.commandSpans, sanitizedCommandText.length) : void 0;
			const systemRunBinding = host === "node" ? buildSystemRunApprovalBinding({
				argv: effectiveCommandArgv,
				cwd: effectiveCwd,
				agentId: effectiveAgentId,
				sessionKey: effectiveSessionKey,
				env: p.env
			}) : null;
			if (explicitId && manager.getSnapshot(explicitId)) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "approval id already pending"));
				return;
			}
			const unavailableDecisions = normalizeExecApprovalUnavailableDecisions(p.unavailableDecisions);
			const request = {
				command: sanitizedCommandText,
				commandPreview: host === "node" || !approvalContext.commandPreview ? void 0 : sanitizeExecApprovalDisplayText(approvalContext.commandPreview),
				commandArgv: host === "node" ? void 0 : effectiveCommandArgv,
				envKeys: envBinding.envKeys.length > 0 ? envBinding.envKeys : void 0,
				systemRunBinding: systemRunBinding?.binding ?? null,
				systemRunPlan: approvalContext.plan,
				cwd: effectiveCwd ? sanitizeExecApprovalDisplayText(effectiveCwd) : null,
				nodeId: host === "node" ? nodeId : null,
				host: host ? sanitizeExecApprovalDisplayText(host) : null,
				security: normalizeExecSecurity(p.security) ?? null,
				ask: normalizeExecAsk(p.ask) ?? null,
				warningText: warningText ? sanitizeExecApprovalWarningText(warningText) : null,
				commandAnalysis,
				commandSpans,
				unavailableDecisions: unavailableDecisions.length > 0 ? unavailableDecisions : void 0,
				allowedDecisions: resolveExecApprovalRequestAllowedDecisions({
					ask: p.ask ?? null,
					unavailableDecisions
				}),
				agentId: effectiveAgentId ?? null,
				resolvedPath: p.resolvedPath ? sanitizeExecApprovalDisplayText(p.resolvedPath) : null,
				sessionKey: effectiveSessionKey ?? null,
				sessionId: trustedAgentRuntime ? null : normalizeOptionalString(p.sessionId) ?? null,
				runId: requestRunId ?? null,
				toolCallId: normalizeOptionalString(p.toolCallId) ?? null,
				turnSourceChannel: trustedAgentRuntime ? trustedAgentRuntime.turnSourceChannel ?? null : normalizeOptionalString(p.turnSourceChannel) ?? null,
				turnSourceTo: trustedAgentRuntime ? trustedAgentRuntime.turnSourceTo ?? null : normalizeOptionalString(p.turnSourceTo) ?? null,
				turnSourceAccountId: trustedAgentRuntime ? trustedAgentRuntime.turnSourceAccountId ?? null : normalizeOptionalString(p.turnSourceAccountId) ?? null,
				turnSourceThreadId: trustedAgentRuntime ? trustedAgentRuntime.turnSourceThreadId ?? null : p.turnSourceThreadId ?? null
			};
			if (requestRunId && context.chatRunState.hasAbortMarker(requestRunId)) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "approval run already aborted", { details: { reason: "EXEC_APPROVAL_RUN_ABORTED" } }));
				return;
			}
			let record;
			try {
				record = manager.create(request, timeoutMs, explicitId);
			} catch (error) {
				if (error instanceof InvalidApprovalIdError) {
					respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, error.message, { details: {
						code: error.code,
						reason: error.reason
					} }));
					return;
				}
				throw error;
			}
			bindApprovalRequesterMetadata({
				record,
				client
			});
			if (trustedAgentRuntime) record.agentRuntimeDelegatedAuthority = trustedAgentRuntime.delegatedAuthority;
			const trustedExecutionIdentity = trustedAgentRuntime?.executionIdentity;
			if (trustedExecutionIdentity && requestRunId === trustedExecutionIdentity.runId) record.executionIdentityToken = trustedExecutionIdentity;
			if (client?.internal?.approvalRuntime === true) bindApprovalReviewerDeviceIds({
				record,
				deviceIds: p.approvalReviewerDeviceIds
			});
			const decisionPromise = registerPendingApprovalRecord({
				manager,
				record,
				timeoutMs,
				respond,
				context
			});
			if (!decisionPromise) return;
			const requestEvent = buildRequestedApprovalEvent(record);
			const forwardRequest = opts?.forwarder?.handleRequested.bind(opts.forwarder);
			const iosPushRequest = opts?.iosPushDelivery?.handleRequested?.bind(opts.iosPushDelivery);
			await handlePendingApprovalRequest({
				manager,
				record,
				decisionPromise,
				respond,
				context,
				clientConnId: client?.connId,
				requestEventName: "exec.approval.requested",
				requestEvent,
				twoPhase,
				approvalKind: "exec",
				requireDeliveryRoute: p.requireDeliveryRoute,
				suppressDelivery: p.suppressDelivery,
				deliverRequest: () => runApprovalRequestDeliveries({
					context,
					record,
					forward: forwardRequest ? [() => forwardRequest(requestEvent), "exec approvals: forward request failed"] : void 0,
					iosPush: iosPushRequest ? [(isTargetVisible) => iosPushRequest(requestEvent, { isTargetVisible }), "exec approvals: iOS push request failed"] : void 0
				}),
				afterDecision: async (decision) => {
					if (decision === null) await opts?.iosPushDelivery?.handleExpired?.(requestEvent);
				},
				afterDecisionErrorLabel: "exec approvals: iOS push expire failed"
			});
		},
		"exec.approval.waitDecision": async ({ params, respond, client, context }) => {
			await handleApprovalWaitDecision({
				manager,
				inputId: params.id,
				client,
				respond,
				resolveTerminalReason: (snapshot) => {
					const runId = normalizeOptionalString(snapshot.request.runId);
					return runId && context.chatRunState.hasAbortMarker(runId) ? "run-aborted" : void 0;
				}
			});
		},
		"exec.approval.resolve": async ({ params, respond, client, context }) => {
			const resolveParams = resolveApprovalDecisionParams({
				rawParams: params,
				validate: validateExecApprovalResolveParams,
				methodName: "exec.approval.resolve",
				respond
			});
			if (!resolveParams) return;
			const { inputId, decision, reviewer } = resolveParams;
			let autoReviewResolution = false;
			await handleApprovalResolve({
				approvalKind: "exec",
				manager,
				inputId,
				decision,
				respond,
				context,
				client,
				reviewer,
				exposeAmbiguousPrefixError: true,
				validateDecision: (snapshot) => {
					const autoReviewIdentity = client?.internal?.approvalRuntime === true ? client.internal.agentRuntimeIdentity : void 0;
					if (autoReviewIdentity) {
						const requestAgentId = normalizeAgentId(snapshot.request.agentId ?? void 0);
						const requestSessionKey = normalizeOptionalString(snapshot.request.sessionKey);
						if (decision !== "allow-once" || snapshot.request.host !== "node" || requestAgentId !== autoReviewIdentity.agentId || requestSessionKey !== autoReviewIdentity.sessionKey) return {
							message: "auto-review approval identity does not match request",
							details: { reason: "AUTO_REVIEW_APPROVAL_IDENTITY_MISMATCH" }
						};
						autoReviewResolution = true;
					}
					return resolveExecApprovalRequestAllowedDecisions(snapshot.request).includes(decision) ? null : {
						message: "allow-always is unavailable for this command",
						details: APPROVAL_ALLOW_ALWAYS_UNAVAILABLE_DETAILS
					};
				},
				resolveRecord: ({ approvalId, decision: decisionLocal, resolvedBy, resolver }) => {
					if (autoReviewResolution) return manager.resolveAutoReview(approvalId, resolvedBy);
					return resolver ? manager.resolveDetailed(approvalId, decisionLocal, resolver, resolvedBy).outcome === "resolved" : manager.resolve(approvalId, decisionLocal, resolvedBy);
				},
				forwardResolved: (resolvedEvent) => opts?.forwarder?.handleResolved(resolvedEvent),
				forwardResolvedErrorLabel: "exec approvals: forward resolve failed",
				extraResolvedHandlers: opts?.iosPushDelivery?.handleResolved ? [{
					run: (resolvedEvent) => opts.iosPushDelivery.handleResolved(resolvedEvent),
					errorLabel: "exec approvals: iOS push resolve failed"
				}] : void 0
			});
		}
	};
}
//#endregion
export { createExecApprovalHandlers };
