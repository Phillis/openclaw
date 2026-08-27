import { r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
import { t as DEFAULT_GATEWAY_REQUEST_TIMEOUT_MS } from "./timeouts-D2XMKe-X.js";
import { c as WRITE_SCOPE, n as APPROVALS_SCOPE } from "./operator-scopes-Dw7Gu2cA.js";
import "./method-scopes-BTnJZEGh.js";
import { a as cancelSubagentCompletionToolHandoff, c as dispatchGatewayRequestInProcess, s as registerSubagentCompletionToolHandoff } from "./server-plugin-in-process-dispatch-CbWBpml7.js";
import { t as createSyntheticPluginRuntimeClient } from "./server-plugin-runtime-client-CH1JKwCJ.js";
import { r as registerGatewayRecoveryRuntime } from "./server-recovery-runtime-context-Cx7vLPdb.js";
import { t as createApprovalNativeRouteCoordinator } from "./approval-native-route-coordinator-DsBpx6ff.js";
import { t as GATEWAY_NATIVE_APPROVAL_METHODS } from "./approval-gateway-runtime-methods-DJBMXVto.js";
import { t as createOutboundSendDeps } from "./outbound-send-deps-CzQHPhLv.js";
import { t as createInternalAgentTurnFacade } from "./internal-facade-BmpmJYWp.js";
//#region src/gateway/server-instance-runtime.ts
const loadOutboundMessageRuntime = createLazyRuntimeModule(() => import("./message-_J88K0Tx.js"));
const RECOVERY_NOTICE_COMPLETION_RETENTION = {
	idPrefix: "main-session-restart-recovery:",
	maxAgeMs: 1440 * 6e4,
	maxEntries: 2e3
};
/** Creates closed internal principals bound to one concrete Gateway lifecycle. */
function createGatewayInstanceRuntime(options) {
	const approvalSubscribers = /* @__PURE__ */ new Set();
	const routeCoordinator = createApprovalNativeRouteCoordinator();
	let closed = false;
	const assertDispatchAvailable = (method) => {
		if (closed || !options.isDispatchAvailable()) throw new Error(`Gateway instance dispatch unavailable for ${method}`);
	};
	const dispatch = async (params) => {
		assertDispatchAvailable(params.method);
		if (!params.allowedMethods.has(params.method)) throw new Error(`Gateway internal principal cannot dispatch ${params.method}`);
		return await dispatchGatewayRequestInProcess(params.method, params.payload, {
			client: params.client,
			context: options.getContext(),
			methodRegistry: options.getMethodRegistry(),
			requestIdPrefix: "gateway-internal",
			timeoutMs: params.timeoutMs
		});
	};
	const recoveryClient = createSyntheticPluginRuntimeClient({
		operatorRoleActor: { kind: "system" },
		scopes: [WRITE_SCOPE]
	});
	const recoveryAgentTurns = createInternalAgentTurnFacade({
		client: recoveryClient,
		getContext: options.getContext,
		getMethodRegistry: options.getMethodRegistry
	});
	const recoveryControlMethods = /* @__PURE__ */ new Set(["chat.abort"]);
	const approvalClient = createSyntheticPluginRuntimeClient({
		operatorRoleActor: { kind: "system" },
		scopes: [APPROVALS_SCOPE]
	});
	const approvalMethods = new Set(GATEWAY_NATIVE_APPROVAL_METHODS);
	const approvalRouteClient = createSyntheticPluginRuntimeClient({
		operatorRoleActor: { kind: "system" },
		scopes: [WRITE_SCOPE]
	});
	const approvalRouteMethods = /* @__PURE__ */ new Set(["send"]);
	const recovery = {
		abortAgent: async (payload, timeoutMs) => await dispatch({
			allowedMethods: recoveryControlMethods,
			client: recoveryClient,
			method: "chat.abort",
			payload,
			timeoutMs
		}),
		dispatchAgent: async (payload, timeoutMs, dispatchOptions = {}) => {
			assertDispatchAvailable("agent");
			const delegatedToolPolicyHandoffId = dispatchOptions.delegatedToolPolicyHandoff ? registerSubagentCompletionToolHandoff(dispatchOptions.delegatedToolPolicyHandoff) : void 0;
			const agentTurns = Boolean(dispatchOptions.allowModelOverride === true || dispatchOptions.allowSyntheticModelOverride === true || dispatchOptions.allowSyntheticCronRunContinuation === true || dispatchOptions.internalDeliveryMediaUrls || dispatchOptions.internalDeliverySuppressText === true || delegatedToolPolicyHandoffId || dispatchOptions.scopes || dispatchOptions.syntheticScopes) ? createInternalAgentTurnFacade({
				client: createSyntheticPluginRuntimeClient({
					operatorRoleActor: { kind: "system" },
					allowModelOverride: dispatchOptions.allowModelOverride === true || dispatchOptions.allowSyntheticModelOverride === true,
					cronRunContinuation: dispatchOptions.allowSyntheticCronRunContinuation === true,
					internalDeliveryMediaUrls: dispatchOptions.internalDeliveryMediaUrls,
					internalDeliverySuppressText: dispatchOptions.internalDeliverySuppressText,
					delegatedToolPolicyHandoffId,
					scopes: dispatchOptions.scopes ?? dispatchOptions.syntheticScopes
				}),
				getContext: options.getContext,
				getMethodRegistry: options.getMethodRegistry
			}) : recoveryAgentTurns;
			try {
				return await agentTurns.dispatch(payload, {
					expectFinal: dispatchOptions.expectFinal,
					onAccepted: dispatchOptions.onAccepted,
					onExecutionStarted: dispatchOptions.onExecutionStarted,
					onSignalAbort: dispatchOptions.onSignalAbort,
					signal: dispatchOptions.signal,
					timeoutMs
				});
			} finally {
				cancelSubagentCompletionToolHandoff(delegatedToolPolicyHandoffId);
			}
		},
		waitForAgent: async (payload, timeoutMs) => {
			assertDispatchAvailable("agent.wait");
			return await recoveryAgentTurns.wait(payload, timeoutMs);
		},
		sendRecoveryNotice: async (payload) => {
			if (closed || !options.isDispatchAvailable()) throw new Error("Gateway instance dispatch unavailable for recovery notice");
			const { sendMessage } = await loadOutboundMessageRuntime();
			const context = options.getContext();
			const result = await sendMessage({
				cfg: context.getRuntimeConfig(),
				deps: createOutboundSendDeps(context.deps),
				channel: payload.channel,
				to: payload.to,
				accountId: payload.accountId,
				threadId: payload.threadId,
				content: payload.text,
				gatewayOwnedDelivery: true,
				bestEffort: true,
				idempotencyKey: payload.idempotencyKey,
				deliveryIntentId: payload.idempotencyKey,
				reusePendingDeliveryIntent: true,
				completionRetention: RECOVERY_NOTICE_COMPLETION_RETENTION,
				abortSignal: AbortSignal.timeout(1e4)
			});
			if (result.deliveryStatus === "failed" || result.deliveryStatus === "partial_failed") throw new Error(result.error ?? "recovery notice delivery failed");
			return { suppressed: result.deliveryStatus === "suppressed" };
		}
	};
	const releaseRecoveryRuntime = registerGatewayRecoveryRuntime(recovery);
	const publish = (kind, callback, shouldDeliver) => {
		if (closed) return 0;
		let delivered = 0;
		for (const subscriber of approvalSubscribers) {
			if (!subscriber.eventKinds.has(kind)) continue;
			try {
				if (shouldDeliver && !shouldDeliver(subscriber)) continue;
				callback(subscriber);
				delivered += 1;
			} catch (error) {
				options.logError?.(`internal approval subscriber failed: ${String(error)}`);
			}
		}
		return delivered;
	};
	return {
		approvalEvents: {
			publishRequested: (kind, request) => publish(kind, (subscriber) => subscriber.onRequested(request), (subscriber) => subscriber.shouldHandle(request)),
			publishResolved: (kind, resolved) => {
				publish(kind, (subscriber) => subscriber.onResolved(resolved));
			}
		},
		nativeApprovals: {
			request: async (method, payload, requestOptions) => await dispatch({
				allowedMethods: approvalMethods,
				client: requestOptions?.clientDisplayName ? {
					...approvalClient,
					connect: {
						...approvalClient.connect,
						client: {
							...approvalClient.connect.client,
							displayName: requestOptions.clientDisplayName
						}
					}
				} : approvalClient,
				method,
				payload,
				timeoutMs: DEFAULT_GATEWAY_REQUEST_TIMEOUT_MS
			}),
			requestRoute: async (method, payload) => await dispatch({
				allowedMethods: approvalRouteMethods,
				client: approvalRouteClient,
				method,
				payload,
				timeoutMs: DEFAULT_GATEWAY_REQUEST_TIMEOUT_MS
			}),
			routeCoordinator,
			subscribe: (subscriber) => {
				if (closed) throw new Error("Gateway instance approval runtime is closed");
				approvalSubscribers.add(subscriber);
				let subscribed = true;
				return () => {
					if (!subscribed) return;
					subscribed = false;
					approvalSubscribers.delete(subscriber);
				};
			}
		},
		recovery,
		isAvailable: () => !closed && options.isDispatchAvailable(),
		close: () => {
			closed = true;
			releaseRecoveryRuntime();
			approvalSubscribers.clear();
			routeCoordinator.close();
		}
	};
}
//#endregion
export { createGatewayInstanceRuntime };
