import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { t as ErrorCodes } from "./gateway-error-details-C2IaYyht.js";
import { vn as validatePluginApprovalRequestParams, yn as validatePluginApprovalResolveParams } from "./src-4dv5TpeQ.js";
import { i as resolveStoredSessionKeyForAgentStore } from "./session-store-key-DRF7yKG5.js";
import { d as errorShape } from "./validation-errors-rELRlKfn.js";
import { r as sanitizeExecApprovalWarningText, t as sanitizeExecApprovalDisplayText } from "./exec-approval-text-sanitize-B7KSiT_n.js";
import { t as sanitizeApprovalScope } from "./approval-scope-B3MYegOV.js";
import { f as resolvePluginApprovalTimeoutMs, p as truncatePluginApprovalDetail } from "./plugin-approvals-DzVTK3Ht.js";
import { t as resolveCanonicalPluginApprovalRequestAllowedDecisions } from "./plugin-approval-canonical-decisions-D5YYHwBx.js";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-C9E8iDY4.js";
import { t as assertValidParams } from "./validation-kYFXohur.js";
import { a as handleApprovalResolve, c as registerPendingApprovalRecord, i as buildRequestedApprovalEvent, l as resolveApprovalDecisionParams, n as bindApprovalReviewerDeviceIds, o as handleApprovalWaitDecision, p as listVisiblePendingApprovalRequests, s as handlePendingApprovalRequest, t as bindApprovalRequesterMetadata } from "./approval-shared-C_QNR0ZK.js";
import { t as runApprovalRequestDeliveries } from "./approval-request-delivery-DdEKPYKV.js";
import { randomUUID } from "node:crypto";
//#region src/gateway/server-methods/plugin-approval.ts
/** Create plugin approval handlers backed by the shared approval manager. */
function createPluginApprovalHandlers(manager, opts) {
	return {
		"plugin.approval.list": async ({ respond, client, context }) => {
			respond(true, listVisiblePendingApprovalRequests({
				manager,
				client,
				approvalKind: "plugin",
				...client?.authenticatedUserProfile ? { cfg: context.getRuntimeConfig() } : {}
			}), void 0);
		},
		"plugin.approval.request": async ({ params, client, respond, context }) => {
			if (!assertValidParams(params, validatePluginApprovalRequestParams, "plugin.approval.request", respond)) return;
			const p = params;
			const twoPhase = p.twoPhase === true;
			const timeoutMs = resolvePluginApprovalTimeoutMs(p.timeoutMs);
			const trustedAgentRuntime = client?.internal?.agentRuntimeIdentity;
			if (trustedAgentRuntime && context.validateAgentRuntimeApprovalAuthority?.(trustedAgentRuntime) !== true) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "agent runtime approval authority is no longer active"));
				return;
			}
			if (trustedAgentRuntime && !trustedAgentRuntime.approvalOwnerPluginId) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "signed plugin approval owner is unavailable"));
				return;
			}
			const normalizeTrimmedString = (value) => normalizeOptionalString(value) || null;
			const rawSessionKey = normalizeOptionalString(trustedAgentRuntime?.sessionKey ?? p.sessionKey);
			const sessionOwner = rawSessionKey ? resolveRequestedSessionAgentId(context.getRuntimeConfig(), rawSessionKey, normalizeOptionalString(trustedAgentRuntime?.agentId ?? p.agentId)) : void 0;
			if (sessionOwner && !sessionOwner.ok) {
				respond(false, void 0, sessionOwner.error);
				return;
			}
			const sessionKey = rawSessionKey && sessionOwner?.ok ? resolveStoredSessionKeyForAgentStore({
				cfg: context.getRuntimeConfig(),
				agentId: sessionOwner.agentId,
				sessionKey: rawSessionKey
			}) : null;
			const sanitizedTitle = sanitizeExecApprovalDisplayText(p.title);
			const sanitizedDescription = sanitizeExecApprovalWarningText(p.description);
			if (Array.from(sanitizedTitle).length > 80 || Array.from(sanitizedDescription).length > 512) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "approval title or description exceeds the display limit after sanitization"));
				return;
			}
			const rawDetail = normalizeTrimmedString(p.detail);
			const sanitizeMeta = (value) => normalizeTrimmedString(value) === null ? null : sanitizeExecApprovalDisplayText(normalizeTrimmedString(value));
			const request = {
				pluginId: trustedAgentRuntime?.approvalOwnerPluginId ?? sanitizeMeta(p.pluginId),
				title: sanitizedTitle,
				description: sanitizedDescription,
				scope: p.scope ? sanitizeApprovalScope(p.scope) : null,
				detail: rawDetail === null ? null : truncatePluginApprovalDetail(sanitizeExecApprovalWarningText(rawDetail)),
				severity: p.severity ?? null,
				toolName: sanitizeMeta(p.toolName),
				toolCallId: p.toolCallId ?? null,
				...Array.isArray(p.allowedDecisions) ? { allowedDecisions: resolveCanonicalPluginApprovalRequestAllowedDecisions({ allowedDecisions: p.allowedDecisions }) } : {},
				agentId: trustedAgentRuntime?.agentId ?? (sessionOwner?.ok ? sessionOwner.agentId : sanitizeMeta(p.agentId)),
				sessionKey,
				runId: trustedAgentRuntime?.operationalRunInstance.runId ?? null,
				turnSourceChannel: trustedAgentRuntime ? normalizeTrimmedString(trustedAgentRuntime.turnSourceChannel) : normalizeTrimmedString(p.turnSourceChannel),
				turnSourceTo: trustedAgentRuntime ? normalizeTrimmedString(trustedAgentRuntime.turnSourceTo) : normalizeTrimmedString(p.turnSourceTo),
				turnSourceAccountId: trustedAgentRuntime ? normalizeTrimmedString(trustedAgentRuntime.turnSourceAccountId) : normalizeTrimmedString(p.turnSourceAccountId),
				turnSourceThreadId: trustedAgentRuntime ? trustedAgentRuntime.turnSourceThreadId ?? null : p.turnSourceThreadId ?? null
			};
			const record = manager.create(request, timeoutMs, `plugin:${randomUUID()}`);
			if (trustedAgentRuntime) record.agentRuntimeDelegatedAuthority = trustedAgentRuntime.delegatedAuthority;
			if (trustedAgentRuntime?.executionIdentity && request.runId === trustedAgentRuntime.executionIdentity.runId) record.executionIdentityToken = trustedAgentRuntime.executionIdentity;
			bindApprovalRequesterMetadata({
				record,
				client
			});
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
			const requestEvent = buildRequestedApprovalEvent(record, "plugin");
			const forwardRequest = opts?.forwarder?.handlePluginApprovalRequested?.bind(opts.forwarder);
			const iosPushRequest = opts?.iosPushDelivery?.handleRequested?.bind(opts.iosPushDelivery);
			await handlePendingApprovalRequest({
				manager,
				record,
				decisionPromise,
				respond,
				context,
				clientConnId: client?.connId,
				requestEventName: "plugin.approval.requested",
				requestEvent,
				twoPhase,
				approvalKind: "plugin",
				deliverRequest: () => runApprovalRequestDeliveries({
					context,
					record,
					forward: forwardRequest ? [() => forwardRequest(requestEvent), "plugin approvals: forward request failed"] : void 0,
					iosPush: iosPushRequest ? [(isTargetVisible) => iosPushRequest(requestEvent, { isTargetVisible }), "plugin approvals: iOS push request failed"] : void 0
				}),
				afterDecision: async (decision) => {
					if (decision === null) await opts?.iosPushDelivery?.handleExpired?.(requestEvent);
				},
				afterDecisionErrorLabel: "plugin approvals: iOS push expire failed"
			});
		},
		"plugin.approval.waitDecision": async ({ params, respond, client, context }) => {
			await handleApprovalWaitDecision({
				manager,
				inputId: params.id,
				client,
				...client?.authenticatedUserProfile ? { cfg: context.getRuntimeConfig() } : {},
				respond
			});
		},
		"plugin.approval.resolve": async ({ params, respond, client, context }) => {
			const resolveParams = resolveApprovalDecisionParams({
				rawParams: params,
				validate: validatePluginApprovalResolveParams,
				methodName: "plugin.approval.resolve",
				respond
			});
			if (!resolveParams) return;
			const { inputId, decision, reviewer } = resolveParams;
			await handleApprovalResolve({
				approvalKind: "plugin",
				manager,
				inputId,
				decision,
				respond,
				context,
				client,
				reviewer,
				exposeAmbiguousPrefixError: false,
				validateDecision: (snapshot) => resolveCanonicalPluginApprovalRequestAllowedDecisions(snapshot.request).includes(decision) ? null : {
					message: `${decision} is unavailable for this plugin approval`,
					details: { allowedDecisions: resolveCanonicalPluginApprovalRequestAllowedDecisions(snapshot.request) }
				},
				forwardResolved: (resolvedEvent) => opts?.forwarder?.handlePluginApprovalResolved?.(resolvedEvent),
				forwardResolvedErrorLabel: "plugin approvals: forward resolve failed",
				extraResolvedHandlers: opts?.iosPushDelivery?.handleResolved ? [{
					run: (resolvedEvent) => opts.iosPushDelivery.handleResolved(resolvedEvent),
					errorLabel: "plugin approvals: iOS push resolve failed"
				}] : void 0
			});
		}
	};
}
//#endregion
export { createPluginApprovalHandlers };
