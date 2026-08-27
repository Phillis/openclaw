import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { c as getActivePluginGatewayNodePolicyRegistry } from "./runtime-B2KAtS3O.js";
import { n as recordRuntimeActionDecision } from "./runtime-action-decision-C4JNkXkP.js";
import { r as sanitizeExecApprovalWarningText, t as sanitizeExecApprovalDisplayText } from "./exec-approval-text-sanitize-B7KSiT_n.js";
import { t as sanitizeApprovalScope } from "./approval-scope-B3MYegOV.js";
import { f as resolvePluginApprovalTimeoutMs } from "./plugin-approvals-DzVTK3Ht.js";
import { t as resolveCanonicalPluginApprovalRequestAllowedDecisions } from "./plugin-approval-canonical-decisions-D5YYHwBx.js";
import { l as resolveNodeCommandAllowlist, o as isNodeCommandAllowed } from "./node-command-policy-XnskQsTT.js";
import { i as buildRequestedApprovalEvent, s as handlePendingApprovalRequest, t as bindApprovalRequesterMetadata } from "./approval-shared-D87k2z1-.js";
import { t as runApprovalRequestDeliveries } from "./approval-request-delivery-Bmp5e8cS.js";
import { randomUUID } from "node:crypto";
//#region src/gateway/node-invoke-plugin-policy.ts
function sanitizeOptionalMeta(value) {
	const normalized = normalizeOptionalString(value);
	return normalized ? sanitizeExecApprovalDisplayText(normalized) : null;
}
function parseScopes(client) {
	return Array.isArray(client?.connect?.scopes) ? client.connect.scopes.filter((scope) => typeof scope === "string") : [];
}
function parsePayload(payloadJSON, payload) {
	if (!payloadJSON) return payload;
	try {
		return JSON.parse(payloadJSON);
	} catch {
		return payload;
	}
}
function normalizeRouteThreadId(value) {
	if (typeof value === "number" && Number.isFinite(value)) return value;
	return normalizeOptionalString(value) ?? null;
}
function resolveNodeInvokeTurnSourceFields(turnSource) {
	return {
		turnSourceChannel: normalizeOptionalString(turnSource?.channel) ?? null,
		turnSourceTo: normalizeOptionalString(turnSource?.to) ?? null,
		turnSourceAccountId: normalizeOptionalString(turnSource?.accountId) ?? null,
		turnSourceThreadId: normalizeRouteThreadId(turnSource?.threadId)
	};
}
function findDangerousPluginNodeCommand(registry, command) {
	const normalizedCommand = command.trim();
	if (!normalizedCommand) return null;
	return registry?.nodeHostCommands?.find((entry) => entry.command.dangerous === true && entry.command.command.trim() === normalizedCommand) ?? null;
}
function validateRiskClassification(value) {
	const family = normalizeOptionalString(value?.family);
	if (value?.level !== "ordinary" && value?.level !== "high" || !family || !/^[a-z0-9][a-z0-9._-]{0,63}$/u.test(family)) return null;
	return {
		level: value.level,
		family
	};
}
function createApprovalRuntime(params) {
	const manager = params.context.pluginApprovalManager;
	if (!manager) return;
	return { async request(input) {
		const timeoutMs = resolvePluginApprovalTimeoutMs(input.timeoutMs);
		const turnSource = resolveNodeInvokeTurnSourceFields(params.turnSource);
		const callerIdentity = params.client?.internal?.agentRuntimeIdentity;
		if (callerIdentity && params.context.validateAgentRuntimeApprovalAuthority?.(callerIdentity) !== true) throw new Error("agent runtime approval authority is no longer active");
		const request = {
			pluginId: params.pluginId,
			title: truncateUtf16Safe(sanitizeExecApprovalDisplayText(normalizeOptionalString(input.title) ?? ""), 80),
			description: truncateUtf16Safe(sanitizeExecApprovalWarningText(normalizeOptionalString(input.description) ?? ""), 256),
			scope: input.scope ? sanitizeApprovalScope(input.scope) : null,
			severity: input.severity ?? "warning",
			...input.allowedDecisions === void 0 ? {} : { allowedDecisions: resolveCanonicalPluginApprovalRequestAllowedDecisions({ allowedDecisions: input.allowedDecisions }) },
			toolName: sanitizeOptionalMeta(input.toolName),
			toolCallId: normalizeOptionalString(input.toolCallId) ?? null,
			agentId: callerIdentity?.agentId ?? sanitizeOptionalMeta(input.agentId),
			sessionKey: callerIdentity?.sessionKey ?? normalizeOptionalString(input.sessionKey) ?? null,
			runId: callerIdentity?.operationalRunInstance.runId ?? null,
			turnSourceChannel: turnSource.turnSourceChannel,
			turnSourceTo: turnSource.turnSourceTo,
			turnSourceAccountId: turnSource.turnSourceAccountId,
			turnSourceThreadId: turnSource.turnSourceThreadId
		};
		const record = manager.create(request, timeoutMs, `plugin:${randomUUID()}`);
		if (callerIdentity) {
			record.agentRuntimeDelegatedAuthority = callerIdentity.delegatedAuthority;
			if (callerIdentity.executionIdentity) record.executionIdentityToken = callerIdentity.executionIdentity;
		}
		bindApprovalRequesterMetadata({
			record,
			client: params.client
		});
		const respond = () => {};
		const decisionPromise = manager.register(record, timeoutMs);
		const requestEvent = buildRequestedApprovalEvent(record, "plugin");
		const forwardRequest = params.context.forwardPluginApprovalRequest;
		const iosPushRequest = params.context.pluginApprovalIosPushDelivery?.handleRequested?.bind(params.context.pluginApprovalIosPushDelivery);
		await handlePendingApprovalRequest({
			manager,
			record,
			decisionPromise,
			respond,
			context: params.context,
			requestEventName: "plugin.approval.requested",
			requestEvent,
			twoPhase: false,
			approvalKind: "plugin",
			deliverRequest: () => runApprovalRequestDeliveries({
				context: params.context,
				record,
				forward: forwardRequest ? [() => forwardRequest(requestEvent), "plugin approvals: forward node policy request failed"] : void 0,
				iosPush: iosPushRequest ? [(isTargetVisible) => iosPushRequest(requestEvent, { isTargetVisible }), "plugin approvals: iOS push node policy request failed"] : void 0
			}),
			afterDecision: async (decision) => {
				if (decision === null) await params.context.pluginApprovalIosPushDelivery?.handleExpired?.(requestEvent);
			},
			afterDecisionErrorLabel: "plugin approvals: iOS push node policy expire failed"
		});
		let decision = manager.projectDecisionIfActive(record.id, await decisionPromise);
		if (decision === "allow-once" && !manager.consumeAllowOnce(record.id, `plugin.node.invoke:${record.id}`)) return {
			id: record.id,
			decision: null
		};
		decision = manager.projectDecisionIfActive(record.id, decision);
		return {
			id: record.id,
			decision
		};
	} };
}
/** Applies the registered plugin policy for a node.invoke command, if one exists. */
async function applyPluginNodeInvokePolicy(params) {
	const registry = getActivePluginGatewayNodePolicyRegistry();
	const callerIdentity = params.client?.internal?.agentRuntimeIdentity;
	const token = callerIdentity?.executionIdentity;
	const isCallerRuntimeAuthorityActive = () => !callerIdentity || params.context.validateAgentRuntimeApprovalAuthority?.(callerIdentity) === true;
	const decisionOccurrenceId = randomUUID();
	let receiptOrdinal = 0;
	const recordNodeDecision = (input) => {
		receiptOrdinal += 1;
		recordRuntimeActionDecision({
			token,
			family: "node",
			operation: "invoke",
			outcome: input.outcome,
			coverageState: input.coverageState,
			reasonCode: input.reasonCode,
			owner: "node-runtime",
			decisionBoundary: "gateway.node-invoke-plugin-policy",
			policyRefs: [
				"node:pairing",
				"node:command-capability",
				"plugin:node-invoke-policy"
			],
			summary: input.summary,
			missingEvidence: input.missingEvidence,
			remediation: input.remediation ?? [],
			discriminator: JSON.stringify([
				input.pluginId,
				params.nodeSession.nodeId,
				params.command,
				decisionOccurrenceId,
				receiptOrdinal
			])
		});
	};
	const trustedTurnSource = params.client?.internal?.agentRuntimeIdentity ? params.turnSource : void 0;
	const entry = registry?.nodeInvokePolicies?.find((candidate) => candidate.policy.commands.includes(params.command));
	if (!entry) {
		const dangerousCommand = findDangerousPluginNodeCommand(registry, params.command);
		if (dangerousCommand) {
			recordNodeDecision({
				pluginId: dangerousCommand.pluginId,
				outcome: "denied",
				coverageState: "enforced",
				reasonCode: "node_plugin_policy_missing",
				summary: "A dangerous plugin-owned node command was denied because its policy was missing."
			});
			return {
				ok: false,
				code: "PLUGIN_POLICY_MISSING",
				message: `node.invoke ${params.command} is registered as dangerous by plugin ${dangerousCommand.pluginId} but has no plugin node.invoke policy`,
				details: { nodeCommandDispatched: false }
			};
		}
		return null;
	}
	let risk;
	if (entry.policy.classifyRisk) {
		try {
			risk = validateRiskClassification(entry.policy.classifyRisk({
				command: params.command,
				params: params.params
			})) ?? void 0;
		} catch {}
		if (!risk) {
			recordNodeDecision({
				pluginId: entry.pluginId,
				outcome: "denied",
				coverageState: "enforced",
				reasonCode: "node_risk_classification_failed",
				summary: "A plugin-owned node command was denied before transport after risk classification failed."
			});
			return {
				ok: false,
				code: "PLUGIN_POLICY_RISK_CLASSIFICATION_FAILED",
				message: `node.invoke ${params.command} arguments could not be classified by plugin ${entry.pluginId}`,
				details: { nodeCommandDispatched: false }
			};
		}
	}
	let nodeCommandDispatched = false;
	let nodeGateDecisionRecorded = false;
	const invokeNode = async (override = {}) => {
		const deny = (reasonCode, result) => {
			nodeGateDecisionRecorded = true;
			recordNodeDecision({
				pluginId: entry.pluginId,
				outcome: "denied",
				coverageState: "enforced",
				reasonCode,
				summary: "A plugin-owned node command was denied at the Gateway dispatch gate."
			});
			return result;
		};
		if (callerIdentity && params.context.validateAgentRuntimeApprovalAuthority?.(callerIdentity) !== true) return deny("node_runtime_authority_closed", {
			ok: false,
			code: "APPROVAL_AUTHORITY_CLOSED",
			message: "agent runtime approval authority closed before node dispatch"
		});
		if (params.isInvocationCurrent && !await params.isInvocationCurrent()) return deny("node_pairing_changed", {
			ok: false,
			code: "PAIRING_CHANGED",
			message: "node pairing changed before dispatch"
		});
		const currentNode = params.nodeSession.pairingGeneration ? params.context.nodeRegistry.getForPairingGeneration(params.nodeSession.nodeId, params.nodeSession.pairingGeneration) : params.context.nodeRegistry.get(params.nodeSession.nodeId);
		if (!currentNode || currentNode.connId !== params.nodeSession.connId) return deny("node_route_changed", {
			ok: false,
			code: "ROUTE_CHANGED",
			message: "node connection changed before dispatch"
		});
		if (currentNode.client.invalidated === true) return deny("node_pairing_changed", {
			ok: false,
			code: "PAIRING_CHANGED",
			message: "node pairing changed before dispatch"
		});
		const resolveCommandAuthorization = () => isNodeCommandAllowed({
			command: params.command,
			declaredCommands: currentNode.commands,
			allowlist: resolveNodeCommandAllowlist(params.context.getRuntimeConfig(), {
				...currentNode,
				approvedCommands: currentNode.commands
			})
		});
		const allowed = resolveCommandAuthorization();
		if (!allowed.ok) return deny("node_command_revoked", {
			ok: false,
			code: "NODE_COMMAND_REVOKED",
			message: `node command not allowed at dispatch: ${allowed.reason}`,
			details: {
				command: params.command,
				reason: allowed.reason
			}
		});
		const remainingTimeoutMs = params.resolveRemainingTimeoutMs?.();
		if (remainingTimeoutMs === 0 && params.timeoutMs !== 0) return deny("node_dispatch_timeout", {
			ok: false,
			code: "TIMEOUT",
			message: "node invoke timed out"
		});
		const requestedTimeoutMs = override.timeoutMs ?? params.timeoutMs;
		const timeoutMs = typeof remainingTimeoutMs === "number" && remainingTimeoutMs > 0 ? typeof requestedTimeoutMs === "number" && requestedTimeoutMs > 0 ? Math.min(requestedTimeoutMs, remainingTimeoutMs) : remainingTimeoutMs : requestedTimeoutMs;
		if (callerIdentity && params.context.validateAgentRuntimeApprovalAuthority?.(callerIdentity) !== true) return deny("node_runtime_authority_closed", {
			ok: false,
			code: "APPROVAL_AUTHORITY_CLOSED",
			message: "agent runtime approval authority closed before node dispatch"
		});
		if (params.isApprovalAuthorityActive?.() === false) return deny("node_approval_authority_closed", {
			ok: false,
			code: "APPROVAL_AUTHORITY_CLOSED",
			message: "approved runtime authority closed before node dispatch"
		});
		recordNodeDecision({
			pluginId: entry.pluginId,
			outcome: "allowed",
			coverageState: "enforced",
			reasonCode: "node_dispatch_gate_allowed",
			summary: "Gateway node pairing, capability, and plugin policy gates allowed transport dispatch."
		});
		nodeGateDecisionRecorded = true;
		const res = await params.context.nodeRegistry.invoke({
			nodeId: params.nodeSession.nodeId,
			expectedConnId: params.nodeSession.connId,
			...params.nodeSession.pairingGeneration ? { expectedPairingGeneration: params.nodeSession.pairingGeneration } : {},
			command: params.command,
			params: override.params ?? params.params,
			timeoutMs,
			...params.signal ? { signal: params.signal } : {},
			...params.sessionKey ? { sessionKey: params.sessionKey } : {},
			idempotencyKey: override.idempotencyKey ?? params.idempotencyKey,
			...params.nodeInvokeStream && {
				onProgress: params.nodeInvokeStream.onProgress,
				idleTimeoutMs: params.nodeInvokeStream.idleTimeoutMs
			},
			isDispatchAuthorized: () => (params.nodeInvokeStream?.isRuntimeCurrent() ?? true) && (!callerIdentity || params.context.validateAgentRuntimeApprovalAuthority?.(callerIdentity) === true) && params.isApprovalAuthorityActive?.() !== false && resolveCommandAuthorization().ok,
			onDispatchReady: (invokeId) => {
				nodeCommandDispatched = true;
				params.onNodeCommandDispatched?.();
				params.nodeInvokeStream?.onDispatchReady(invokeId);
			}
		});
		if (!res.ok) {
			if (nodeCommandDispatched) recordNodeDecision({
				pluginId: entry.pluginId,
				outcome: "unknown",
				coverageState: "unknown",
				reasonCode: "node_action_completion_unknown",
				summary: "The node transport accepted the action but did not report a successful outcome.",
				missingEvidence: ["node.action_completion"],
				remediation: [{
					code: "inspect_node_action",
					text: "Inspect the paired node before retrying an action whose completion is unknown."
				}]
			});
			return {
				ok: false,
				code: res.error?.code,
				message: res.error?.message ?? "node command failed",
				details: { nodeError: res.error ?? null }
			};
		}
		recordNodeDecision({
			pluginId: entry.pluginId,
			outcome: "allowed",
			coverageState: "attribution-only",
			reasonCode: "node_action_completed",
			summary: "The paired node reported successful completion; this is attribution, not authorization."
		});
		return {
			ok: true,
			payload: parsePayload(res.payloadJSON, res.payload),
			payloadJSON: res.payloadJSON ?? null
		};
	};
	let result;
	try {
		result = await entry.policy.handle({
			nodeId: params.nodeSession.nodeId,
			command: params.command,
			params: params.params,
			timeoutMs: params.timeoutMs,
			idempotencyKey: params.idempotencyKey,
			config: params.context.getRuntimeConfig(),
			pluginConfig: entry.pluginConfig,
			node: {
				nodeId: params.nodeSession.nodeId,
				displayName: params.nodeSession.displayName,
				platform: params.nodeSession.platform,
				deviceFamily: params.nodeSession.deviceFamily,
				commands: params.nodeSession.commands
			},
			client: params.client ? {
				connId: params.client.connId,
				scopes: parseScopes(params.client)
			} : null,
			...risk ? { risk } : {},
			approvals: createApprovalRuntime({
				context: params.context,
				client: params.client,
				pluginId: entry.pluginId,
				turnSource: trustedTurnSource
			}),
			invokeNode
		});
	} catch (error) {
		if (!nodeCommandDispatched && isCallerRuntimeAuthorityActive()) recordNodeDecision({
			pluginId: entry.pluginId,
			outcome: "denied",
			coverageState: "enforced",
			reasonCode: "node_plugin_policy_failed",
			summary: "The registered plugin policy failed closed before node transport dispatch."
		});
		throw error;
	}
	if (!nodeCommandDispatched && !nodeGateDecisionRecorded && isCallerRuntimeAuthorityActive()) recordNodeDecision({
		pluginId: entry.pluginId,
		outcome: result.ok ? "unknown" : "denied",
		coverageState: result.ok ? "unknown" : "enforced",
		reasonCode: result.ok ? "node_action_callback_missing" : "node_plugin_policy_denied",
		summary: result.ok ? "The plugin policy returned without invoking the expected OpenClaw node callback." : "The registered plugin policy denied node transport dispatch.",
		missingEvidence: result.ok ? ["node.action_callback"] : [],
		remediation: result.ok ? [{
			code: "add_node_action_callback",
			text: "Route the native action through the provided OpenClaw node callback."
		}] : []
	});
	if (result.ok) return result;
	return {
		...result,
		details: {
			...result.details,
			nodeCommandDispatched
		}
	};
}
//#endregion
export { applyPluginNodeInvokePolicy as t };
