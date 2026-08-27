import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { c as getActivePluginGatewayNodePolicyRegistry } from "./runtime-g0R28Sy0.js";
import { f as resolvePluginApprovalTimeoutMs } from "./plugin-approvals-CmZhR5of.js";
import { l as resolveNodeCommandAllowlist, o as isNodeCommandAllowed } from "./node-command-policy-Cru_no7H.js";
import { i as sanitizeExecApprovalWarningText, n as sanitizeExecApprovalDisplayText } from "./exec-approval-command-display-B8xcL7SB.js";
import { i as buildRequestedApprovalEvent, s as handlePendingApprovalRequest, t as bindApprovalRequesterMetadata } from "./approval-shared-DPu2FPJR.js";
import { t as runApprovalRequestDeliveries } from "./approval-request-delivery-D-BFp1xC.js";
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
			severity: input.severity ?? "warning",
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
		const requestEvent = buildRequestedApprovalEvent(record);
		const forwardRequest = params.context.forwardPluginApprovalRequest;
		const iosPushRequest = params.context.pluginApprovalIosPushDelivery?.handleRequested?.bind(params.context.pluginApprovalIosPushDelivery);
		await handlePendingApprovalRequest({
			manager,
			record,
			decisionPromise,
			respond,
			context: params.context,
			clientConnId: params.client?.connId,
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
	const trustedTurnSource = params.client?.internal?.agentRuntimeIdentity ? params.turnSource : void 0;
	const entry = registry?.nodeInvokePolicies?.find((candidate) => candidate.policy.commands.includes(params.command));
	if (!entry) {
		const dangerousCommand = findDangerousPluginNodeCommand(registry, params.command);
		if (dangerousCommand) return {
			ok: false,
			code: "PLUGIN_POLICY_MISSING",
			message: `node.invoke ${params.command} is registered as dangerous by plugin ${dangerousCommand.pluginId} but has no plugin node.invoke policy`,
			details: { nodeCommandDispatched: false }
		};
		return null;
	}
	let nodeCommandDispatched = false;
	const invokeNode = async (override = {}) => {
		const callerIdentity = params.client?.internal?.agentRuntimeIdentity;
		if (callerIdentity && params.context.validateAgentRuntimeApprovalAuthority?.(callerIdentity) !== true) return {
			ok: false,
			code: "APPROVAL_AUTHORITY_CLOSED",
			message: "agent runtime approval authority closed before node dispatch"
		};
		if (params.isInvocationCurrent && !await params.isInvocationCurrent()) return {
			ok: false,
			code: "PAIRING_CHANGED",
			message: "node pairing changed before dispatch"
		};
		const currentNode = params.nodeSession.pairingGeneration ? params.context.nodeRegistry.getForPairingGeneration(params.nodeSession.nodeId, params.nodeSession.pairingGeneration) : params.context.nodeRegistry.get(params.nodeSession.nodeId);
		if (!currentNode || currentNode.connId !== params.nodeSession.connId) return {
			ok: false,
			code: "ROUTE_CHANGED",
			message: "node connection changed before dispatch"
		};
		if (currentNode.client.invalidated === true) return {
			ok: false,
			code: "PAIRING_CHANGED",
			message: "node pairing changed before dispatch"
		};
		const allowlist = resolveNodeCommandAllowlist(params.context.getRuntimeConfig(), {
			...currentNode,
			approvedCommands: currentNode.commands
		});
		const allowed = isNodeCommandAllowed({
			command: params.command,
			declaredCommands: currentNode.commands,
			allowlist
		});
		if (!allowed.ok) return {
			ok: false,
			code: "NODE_COMMAND_REVOKED",
			message: `node command not allowed at dispatch: ${allowed.reason}`,
			details: {
				command: params.command,
				reason: allowed.reason
			}
		};
		const remainingTimeoutMs = params.resolveRemainingTimeoutMs?.();
		if (remainingTimeoutMs === 0 && params.timeoutMs !== 0) return {
			ok: false,
			code: "TIMEOUT",
			message: "node invoke timed out"
		};
		const requestedTimeoutMs = override.timeoutMs ?? params.timeoutMs;
		const timeoutMs = typeof remainingTimeoutMs === "number" && remainingTimeoutMs > 0 ? typeof requestedTimeoutMs === "number" && requestedTimeoutMs > 0 ? Math.min(requestedTimeoutMs, remainingTimeoutMs) : remainingTimeoutMs : requestedTimeoutMs;
		if (callerIdentity && params.context.validateAgentRuntimeApprovalAuthority?.(callerIdentity) !== true) return {
			ok: false,
			code: "APPROVAL_AUTHORITY_CLOSED",
			message: "agent runtime approval authority closed before node dispatch"
		};
		if (params.isApprovalAuthorityActive?.() === false) return {
			ok: false,
			code: "APPROVAL_AUTHORITY_CLOSED",
			message: "approved runtime authority closed before node dispatch"
		};
		const res = await params.context.nodeRegistry.invoke({
			nodeId: params.nodeSession.nodeId,
			expectedConnId: params.nodeSession.connId,
			...params.nodeSession.pairingGeneration ? { expectedPairingGeneration: params.nodeSession.pairingGeneration } : {},
			command: params.command,
			params: override.params ?? params.params,
			timeoutMs,
			...params.signal ? { signal: params.signal } : {},
			idempotencyKey: override.idempotencyKey ?? params.idempotencyKey,
			isDispatchAuthorized: () => (!callerIdentity || params.context.validateAgentRuntimeApprovalAuthority?.(callerIdentity) === true) && params.isApprovalAuthorityActive?.() !== false,
			onDispatchReady: () => {
				nodeCommandDispatched = true;
				params.onNodeCommandDispatched?.();
			}
		});
		if (!res.ok) return {
			ok: false,
			code: res.error?.code,
			message: res.error?.message ?? "node command failed",
			details: { nodeError: res.error ?? null }
		};
		return {
			ok: true,
			payload: parsePayload(res.payloadJSON, res.payload),
			payloadJSON: res.payloadJSON ?? null
		};
	};
	const result = await entry.policy.handle({
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
		approvals: createApprovalRuntime({
			context: params.context,
			client: params.client,
			pluginId: entry.pluginId,
			turnSource: trustedTurnSource
		}),
		invokeNode
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
