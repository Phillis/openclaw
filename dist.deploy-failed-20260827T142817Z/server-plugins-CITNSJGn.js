import { r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { D as resolveExpiresAtMsFromDurationMs, g as isFutureDateTimestampMs } from "./number-coercion-oCkfUEEq.js";
import { v as uniqueStrings } from "./string-normalization-e_fvmxMf.js";
import { t as createAbortError } from "./abort-signal-DEbc_zqk.js";
import { i as allowsProcessHomeSessionScan } from "./paths-CqeDjSA4.js";
import { i as resolveGlobalSingleton, n as resolveGlobalMap } from "./global-singleton-Dc_stLtU.js";
import { i as parseModelCatalogRef } from "./model-catalog-refs-BdjEHOKQ.js";
import { c as stripSelfProviderModelPrefix, n as normalizeBuiltInProviderModelId } from "./provider-model-id-normalization-DvssXFxG.js";
import { i as getPluginModuleLoaderStats } from "./plugin-module-loader-cache-DW5Tr4Iu.js";
import { s as normalizePluginsConfig } from "./config-state-CpuWFwzR.js";
import { v as extractPluginInstallRecordsFromInstalledPluginIndex } from "./installed-plugin-index-BC03OFwf.js";
import { r as isKnownCoreToolId } from "./tool-catalog-Dl50knwD.js";
import { g as normalizeToolPolicyName } from "./tool-policy-CWmnHLY1.js";
import { o as normalizeModelRef } from "./model-ref-shared-poyRjWh_.js";
import { n as parseModelRef } from "./model-selection-normalize-Cvi2hnhD.js";
import { c as resolveSafeTimeoutDelayMs } from "./timeouts-D2XMKe-X.js";
import { d as getActivePluginRegistry, k as createEmptyPluginRegistry } from "./runtime-CTbL314X.js";
import { F as activatePluginRegistry, t as loadAndActivateRootPluginRegistry } from "./loader-CwiP0Igf.js";
import { t as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-BULcX9xX.js";
import { t as ADMIN_SCOPE, u as normalizeOperatorScopeList } from "./operator-scopes-Dw7Gu2cA.js";
import { n as GATEWAY_CLIENT_IDS, r as GATEWAY_CLIENT_MODES } from "./client-info-yubNQC1L.js";
import "./version-CwNT1gaY.js";
import { t as GatewayClientRequestError } from "./request-error-Cviusa7U.js";
import "./method-scopes-rPUXjV_D.js";
import { t as applyPluginAutoEnable } from "./plugin-auto-enable-CAomcfJT.js";
import { p as resolvePluginSubagentCompletionRequester } from "./hook-runner-global-BNCkTxOs.js";
import { r as createPluginRuntimeLoaderLogger } from "./load-context-CjeR28RQ.js";
import { t as loadPluginLookUpTable } from "./plugin-lookup-table-C_nDqw7p.js";
import { n as getFallbackGatewayContext } from "./server-plugin-fallback-context-CA_ZMhwm.js";
import { l as resolveNodeCommandAllowlist, o as isNodeCommandAllowed } from "./node-command-policy-17xabuuj.js";
import { randomUUID } from "node:crypto";
import { performance } from "node:perf_hooks";
//#region src/gateway/server-in-process-dispatch.ts
function unwrapGatewayMethodDispatchResponse(method, response) {
	if (!response.ok) {
		const requestError = new GatewayClientRequestError({
			code: response.error?.code,
			message: response.error?.message ?? `Gateway method "${method}" failed.`,
			details: response.error?.details,
			retryable: response.error?.retryable,
			retryAfterMs: response.error?.retryAfterMs
		});
		const cause = response.error?.cause;
		if (cause !== void 0) Object.defineProperty(requestError, "cause", { value: cause });
		throw requestError;
	}
	return response.payload;
}
function resolveDispatchDeadlineMs(timeoutMs) {
	if (typeof timeoutMs !== "number" || !Number.isFinite(timeoutMs)) return;
	return Date.now() + resolveSafeTimeoutDelayMs(timeoutMs);
}
function resolveRemainingDispatchTimeoutMs(deadlineMs) {
	return deadlineMs === void 0 ? void 0 : resolveSafeTimeoutDelayMs(deadlineMs - Date.now(), { minMs: 0 });
}
function resolveDispatchAbortError(method, signal) {
	return signal.reason instanceof Error ? signal.reason : createAbortError(`gateway request aborted for ${method}`, { cause: signal.reason });
}
/** Reject before a cancelled in-process request can invoke method work. */
function throwIfGatewayDispatchAborted(method, signal) {
	if (signal?.aborted) throw resolveDispatchAbortError(method, signal);
}
async function waitForDispatch(method, promise, deadlineMs, signal, onSignalAbort) {
	let timeout;
	let onAbort;
	try {
		if (signal?.aborted) throw resolveDispatchAbortError(method, signal);
		const remainingTimeoutMs = resolveRemainingDispatchTimeoutMs(deadlineMs);
		if (remainingTimeoutMs === void 0 && !signal) return await promise;
		const cancellation = new Promise((_resolve, reject) => {
			if (remainingTimeoutMs !== void 0) timeout = setTimeout(() => {
				reject(/* @__PURE__ */ new Error(`gateway request timeout for ${method}`));
			}, remainingTimeoutMs);
			if (signal) {
				onAbort = () => reject(resolveDispatchAbortError(method, signal));
				signal.addEventListener("abort", onAbort, { once: true });
				if (signal.aborted) onAbort();
			}
		});
		return await Promise.race([promise, cancellation]);
	} catch (error) {
		if (signal?.aborted && onSignalAbort) await Promise.resolve().then(onSignalAbort).catch(() => {});
		throw error;
	} finally {
		if (timeout) clearTimeout(timeout);
		if (signal && onAbort) signal.removeEventListener("abort", onAbort);
	}
}
/** Applies the same non-cancelling deadline used by in-process Gateway dispatch. */
async function waitForGatewayDispatch(method, promise, timeoutMs, signal, onSignalAbort) {
	return await waitForDispatch(method, promise, resolveDispatchDeadlineMs(timeoutMs), signal, onSignalAbort);
}
/** Dispatches one request through the ordinary Gateway router without opening a transport. */
async function dispatchGatewayRequestInProcessRaw(method, params, options) {
	throwIfGatewayDispatchAborted(method, options.signal);
	let firstResponse;
	let finalResponse;
	let resolveFirstResponse;
	let rejectFirstResponse;
	let resolveFinalResponse;
	let rejectFinalResponse;
	let postFirstResponseError;
	const firstResponsePromise = new Promise((resolve, reject) => {
		resolveFirstResponse = resolve;
		rejectFirstResponse = reject;
	});
	const deadlineMs = resolveDispatchDeadlineMs(options.timeoutMs);
	const { handleGatewayRequest } = await import("./server-methods-C_s9GXs1.js");
	handleGatewayRequest({
		req: {
			type: "req",
			id: `${options.requestIdPrefix ?? "in-process"}-${randomUUID()}`,
			method,
			params
		},
		client: options.client,
		isWebchatConnect: options.isWebchatConnect ?? (() => false),
		respond: (ok, payload, error, meta) => {
			const response = {
				ok,
				payload,
				error,
				...meta ? { meta } : {}
			};
			if (!firstResponse) {
				firstResponse = response;
				resolveFirstResponse?.(response);
				return;
			}
			if (!finalResponse) {
				finalResponse = response;
				resolveFinalResponse?.(response);
			}
		},
		context: options.context,
		methodRegistry: options.methodRegistry,
		...options.signal ? { signal: options.signal } : {}
	}).then(() => {
		if (!firstResponse) rejectFirstResponse?.(/* @__PURE__ */ new Error(`Gateway method "${method}" completed without a response.`));
	}).catch((err) => {
		const error = err instanceof Error ? err : new Error(String(err));
		if (!firstResponse) {
			rejectFirstResponse?.(error);
			return;
		}
		postFirstResponseError = error;
		rejectFinalResponse?.(error);
	});
	firstResponse = await waitForDispatch(method, firstResponsePromise, deadlineMs, options.signal, options.onSignalAbort);
	const firstPayload = firstResponse.payload;
	if (options.expectFinal !== true || firstPayload?.status !== "accepted") return firstResponse;
	options.onAccepted?.(firstResponse.payload);
	if (postFirstResponseError) throw postFirstResponseError;
	return finalResponse ?? await waitForDispatch(method, new Promise((resolve, reject) => {
		resolveFinalResponse = resolve;
		rejectFinalResponse = reject;
		if (postFirstResponseError) {
			reject(postFirstResponseError);
			return;
		}
		if (finalResponse) resolve(finalResponse);
	}), deadlineMs, options.signal, options.onSignalAbort);
}
async function dispatchGatewayRequestInProcess(method, params, options) {
	return unwrapGatewayMethodDispatchResponse(method, await dispatchGatewayRequestInProcessRaw(method, params, options));
}
//#endregion
//#region src/gateway/server-plugin-runtime-client.ts
function createSyntheticPluginRuntimeClient(params) {
	const pluginRuntimeOwnerId = typeof params?.pluginRuntimeOwnerId === "string" && params.pluginRuntimeOwnerId.trim() ? params.pluginRuntimeOwnerId.trim() : void 0;
	return {
		connect: {
			minProtocol: 4,
			maxProtocol: 4,
			client: {
				id: GATEWAY_CLIENT_IDS.GATEWAY_CLIENT,
				version: "internal",
				platform: "node",
				mode: GATEWAY_CLIENT_MODES.BACKEND
			},
			role: "operator",
			scopes: params?.scopes ?? ["operator.write"]
		},
		internal: {
			syntheticClient: true,
			...params?.sessionCreation ? { sessionCreation: params.sessionCreation } : {},
			allowModelOverride: params?.allowModelOverride === true,
			...params?.agentRunTracking ? { agentRunTracking: params.agentRunTracking } : {},
			...params?.cronRunContinuation === true ? { cronRunContinuation: true } : {},
			...params?.internalDeliveryMediaUrls ? { internalDeliveryMediaUrls: [...params.internalDeliveryMediaUrls] } : {},
			...params?.internalDeliverySuppressText === true ? { internalDeliverySuppressText: true } : {},
			...params?.scopes?.includes("operator.approvals") ? { approvalRuntime: true } : {},
			...pluginRuntimeOwnerId ? { pluginRuntimeOwnerId } : {},
			...params?.pluginSubagentRequester ? { pluginSubagentRequester: params.pluginSubagentRequester } : {},
			...params?.runtimePluginToolGrant ? { runtimePluginToolGrant: params.runtimePluginToolGrant } : {},
			...params?.delegatedToolPolicyHandoffId ? { delegatedToolPolicyHandoffId: params.delegatedToolPolicyHandoffId } : {}
		}
	};
}
function mergePluginRuntimeClientInternal(client, internal) {
	if (!client || !internal) return client ?? null;
	return {
		...client,
		internal: {
			...client.internal,
			...internal
		}
	};
}
function resolvePluginSubagentToolsAlsoAllow(params) {
	const requested = uniqueStrings((params.toolsAlsoAllow ?? []).map((entry) => normalizeToolPolicyName(entry.trim())).filter(Boolean));
	if (requested.length === 0) return;
	const pluginId = params.pluginId?.trim();
	if (!pluginId) throw new Error("toolsAlsoAllow requires plugin identity for subagent runs.");
	const registry = getActivePluginRegistry();
	for (const toolName of requested) {
		if (isKnownCoreToolId(toolName)) throw new Error(`plugin "${pluginId}" may not add core tool "${toolName}" to subagent runs.`);
		const owners = uniqueStrings((registry?.tools ?? []).filter((registration) => [...registration.names, ...registration.declaredNames ?? []].some((registeredName) => normalizeToolPolicyName(registeredName) === toolName)).map((registration) => registration.pluginId));
		if (owners.length !== 1 || owners[0] !== pluginId) throw new Error(`plugin "${pluginId}" does not uniquely own subagent tool "${toolName}".`);
	}
	return {
		pluginId,
		toolNames: requested
	};
}
//#endregion
//#region src/gateway/subagent-completion-tool-handoff.ts
const SUBAGENT_COMPLETION_TOOL_HANDOFF_TTL_MS = 300 * 1e3;
const handoffs = resolveGlobalMap(Symbol.for("openclaw.subagentCompletionToolHandoffs"), "close-and-restart");
function normalizeRegistration(params) {
	const sourceSessionKey = normalizeOptionalString(params.sourceSessionKey);
	const sourceSessionId = normalizeOptionalString(params.sourceSessionId);
	const targetSessionKey = normalizeOptionalString(params.targetSessionKey);
	const targetSessionId = normalizeOptionalString(params.targetSessionId);
	const idempotencyKey = normalizeOptionalString(params.idempotencyKey);
	if (!sourceSessionKey || !targetSessionKey || !targetSessionId || !idempotencyKey) return;
	return {
		sourceSessionKey,
		...sourceSessionId ? { sourceSessionId } : {},
		targetSessionKey,
		targetSessionId,
		idempotencyKey
	};
}
function pruneExpired(nowMs) {
	for (const [handoffId, entry] of handoffs) if (!isFutureDateTimestampMs(entry.expiresAtMs, { nowMs })) handoffs.delete(handoffId);
}
/** Register one short-lived capability for the exact completion delivery request. */
function registerSubagentCompletionToolHandoff(params) {
	const normalized = normalizeRegistration(params);
	if (!normalized) return;
	const nowMs = params.nowMs ?? Date.now();
	pruneExpired(nowMs);
	const expiresAtMs = resolveExpiresAtMsFromDurationMs(SUBAGENT_COMPLETION_TOOL_HANDOFF_TTL_MS, { nowMs });
	if (expiresAtMs === void 0) return;
	const handoffId = randomUUID();
	handoffs.set(handoffId, {
		...normalized,
		expiresAtMs
	});
	return handoffId;
}
/** Remove an unconsumed capability after its in-process dispatch finishes or fails. */
function cancelSubagentCompletionToolHandoff(handoffId) {
	const normalized = normalizeOptionalString(handoffId);
	return normalized ? handoffs.delete(normalized) : false;
}
/**
* Consume the capability once and bind it to the model route admitted for this run.
* Mismatches do not burn the capability; only the exact request may consume it.
*/
function consumeSubagentCompletionToolHandoff(params) {
	const handoffId = normalizeOptionalString(params.handoffId);
	const sourceSessionKey = normalizeOptionalString(params.sourceSessionKey);
	const sourceSessionId = normalizeOptionalString(params.sourceSessionId);
	const targetSessionKey = normalizeOptionalString(params.targetSessionKey);
	const targetSessionId = normalizeOptionalString(params.targetSessionId);
	const idempotencyKey = normalizeOptionalString(params.idempotencyKey);
	const provider = normalizeOptionalString(params.provider)?.toLowerCase();
	const model = normalizeOptionalString(params.model);
	if (!handoffId || !sourceSessionKey || !targetSessionKey || !targetSessionId || !idempotencyKey || !provider || !model) return;
	pruneExpired(params.nowMs ?? Date.now());
	const entry = handoffs.get(handoffId);
	if (!entry || entry.sourceSessionKey !== sourceSessionKey || entry.sourceSessionId !== sourceSessionId || entry.targetSessionKey !== targetSessionKey || entry.targetSessionId !== targetSessionId || entry.idempotencyKey !== idempotencyKey) return;
	handoffs.delete(handoffId);
	return {
		kind: "subagent-completion",
		sourceSessionKey,
		...sourceSessionId ? { sourceSessionId } : {},
		targetSessionKey,
		targetSessionId,
		provider,
		model
	};
}
//#endregion
//#region src/gateway/server-plugin-in-process-dispatch.ts
const loadInternalAgentTurnFacade = createLazyRuntimeModule(() => import("./internal-facade.runtime.js"));
function resolveInProcessGatewayDispatch(method, options) {
	const scope = getPluginRuntimeGatewayRequestScope();
	const context = scope?.context ?? getFallbackGatewayContext();
	const isWebchatConnect = scope?.isWebchatConnect ?? (() => false);
	if (!context) throw new Error(`In-process gateway dispatch requires a gateway request scope (method: ${method}). No scope set and no fallback context available.`);
	if (options?.requireScopedClient === true && !scope?.client) throw new Error(`In-process gateway dispatch requires an authenticated plugin request scope (method: ${method}).`);
	const pluginRuntimeOwnerId = typeof options?.pluginRuntimeOwnerId === "string" && options.pluginRuntimeOwnerId.trim() ? options.pluginRuntimeOwnerId.trim() : void 0;
	const delegatedToolPolicyHandoffId = options?.delegatedToolPolicyHandoff ? registerSubagentCompletionToolHandoff(options.delegatedToolPolicyHandoff) : void 0;
	const syntheticClient = createSyntheticPluginRuntimeClient({
		allowModelOverride: options?.allowSyntheticModelOverride === true,
		agentRunTracking: options?.agentRunTracking,
		cronRunContinuation: options?.allowSyntheticCronRunContinuation === true,
		internalDeliveryMediaUrls: options?.internalDeliveryMediaUrls,
		internalDeliverySuppressText: options?.internalDeliverySuppressText,
		...pluginRuntimeOwnerId ? { pluginRuntimeOwnerId } : {},
		...options?.pluginSubagentRequester ? { pluginSubagentRequester: options.pluginSubagentRequester } : {},
		...options?.runtimePluginToolGrant ? { runtimePluginToolGrant: options.runtimePluginToolGrant } : {},
		delegatedToolPolicyHandoffId,
		...options?.sessionCreation ? { sessionCreation: options.sessionCreation } : {},
		scopes: options?.syntheticScopes
	});
	const scopedClient = mergePluginRuntimeClientInternal(scope?.client, pluginRuntimeOwnerId || options?.agentRunTracking || options?.pluginSubagentRequester || options?.runtimePluginToolGrant || options?.delegatedToolPolicyHandoff || scope?.client?.internal?.delegatedToolPolicyHandoffId ? {
		...options?.agentRunTracking ? { agentRunTracking: options.agentRunTracking } : {},
		...pluginRuntimeOwnerId ? { pluginRuntimeOwnerId } : {},
		...options?.pluginSubagentRequester ? { pluginSubagentRequester: options.pluginSubagentRequester } : {},
		runtimePluginToolGrant: options?.runtimePluginToolGrant,
		delegatedToolPolicyHandoffId
	} : void 0);
	if (options?.disableSyntheticClient === true && !scopedClient) {
		cancelSubagentCompletionToolHandoff(delegatedToolPolicyHandoffId);
		throw new Error(`In-process gateway dispatch requires a scoped client (method: ${method}).`);
	}
	return {
		client: options?.forceSyntheticClient === true ? syntheticClient : scopedClient ?? syntheticClient,
		context,
		delegatedToolPolicyHandoffId,
		isWebchatConnect
	};
}
async function withInProcessGatewayDispatch(method, options, run) {
	const resolved = resolveInProcessGatewayDispatch(method, options);
	try {
		return await run(resolved);
	} finally {
		cancelSubagentCompletionToolHandoff(resolved.delegatedToolPolicyHandoffId);
	}
}
async function dispatchGatewayMethodInProcessRaw(method, params, options) {
	return await withInProcessGatewayDispatch(method, options, async (resolved) => await dispatchGatewayRequestInProcessRaw(method, params, {
		client: resolved.client,
		context: resolved.context,
		expectFinal: options?.expectFinal,
		isWebchatConnect: resolved.isWebchatConnect,
		onAccepted: options?.onAccepted,
		onSignalAbort: options?.onSignalAbort,
		requestIdPrefix: "plugin-subagent",
		timeoutMs: options?.timeoutMs,
		...options?.signal ? { signal: options.signal } : {}
	}));
}
/** Live request context for trusted built-in tools that need direct runtime state. */
function getInProcessGatewayRequestContext() {
	return getPluginRuntimeGatewayRequestScope()?.context ?? getFallbackGatewayContext();
}
async function dispatchGatewayMethodInProcess(method, params, options) {
	if (method === "agent" || method === "agent.wait") return await withInProcessGatewayDispatch(method, options, async (resolved) => {
		const { createInternalAgentTurnFacade } = await loadInternalAgentTurnFacade();
		const facade = createInternalAgentTurnFacade({
			client: resolved.client,
			getContext: () => resolved.context,
			isWebchatConnect: resolved.isWebchatConnect
		});
		return method === "agent" ? await facade.dispatch(params, {
			expectFinal: options?.expectFinal,
			onAccepted: options?.onAccepted,
			onSignalAbort: options?.onSignalAbort,
			signal: options?.signal,
			timeoutMs: options?.timeoutMs
		}) : await facade.wait(params, options?.timeoutMs, options?.signal, options?.onSignalAbort);
	});
	return unwrapGatewayMethodDispatchResponse(method, await dispatchGatewayMethodInProcessRaw(method, params, options));
}
//#endregion
//#region src/gateway/server-plugin-subagent-runtime.ts
function normalizePluginSubagentAllowedModelRef(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return null;
	if (trimmed === "*") return "*";
	const parsed = parseModelCatalogRef(trimmed);
	if (!parsed) return null;
	const modelId = normalizeBuiltInProviderModelId(parsed.provider, stripSelfProviderModelPrefix(parsed.provider, parsed.modelId));
	return `${parsed.provider}/${modelId}`;
}
function resolvePluginSubagentRequestedModelRef(params) {
	if (params.provider && params.model) {
		const normalizedRequest = normalizeModelRef(params.provider, params.model);
		return `${normalizedRequest.provider}/${normalizedRequest.model}`;
	}
	const rawModel = params.model?.trim();
	if (!rawModel || !rawModel.includes("/")) return null;
	const parsed = parseModelRef(rawModel, "");
	if (!parsed?.provider || !parsed.model) return null;
	return `${parsed.provider}/${parsed.model}`;
}
function normalizePluginSubagentRunRuntime(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return;
	const record = value;
	const harness = typeof record.harness === "string" ? record.harness.trim() : "";
	const provider = typeof record.provider === "string" ? record.provider.trim() : "";
	const model = typeof record.model === "string" ? record.model.trim() : "";
	return harness && provider && model ? {
		harness,
		provider,
		model
	} : void 0;
}
//#endregion
//#region src/gateway/server-plugins-node-runtime.ts
function hasInProcessGatewayContext() {
	return Boolean(getPluginRuntimeGatewayRequestScope()?.context ?? getFallbackGatewayContext());
}
function projectGatewayRuntimeNodes(nodes) {
	const context = getPluginRuntimeGatewayRequestScope()?.context ?? getFallbackGatewayContext();
	return nodes.map((node) => {
		if (!node || typeof node !== "object" || Array.isArray(node) || !context?.nodeRegistry?.get || !context.getRuntimeConfig) return node;
		const nodeRecord = node;
		const nodeId = typeof nodeRecord.nodeId === "string" ? nodeRecord.nodeId : "";
		const liveNode = nodeId ? context.nodeRegistry.get(nodeId) : void 0;
		if (!liveNode) return node;
		const allowlist = resolveNodeCommandAllowlist(context.getRuntimeConfig(), {
			...liveNode,
			approvedCommands: liveNode.commands
		});
		const invocableCommands = liveNode.commands.filter((command) => isNodeCommandAllowed({
			command,
			declaredCommands: liveNode.commands,
			allowlist
		}).ok);
		return Object.assign({}, nodeRecord, { invocableCommands });
	});
}
//#endregion
//#region src/gateway/server-plugins.ts
const PLUGIN_SUBAGENT_POLICY_STATE_KEY = Symbol.for("openclaw.pluginSubagentOverridePolicyState");
const getPluginSubagentPolicyState = () => resolveGlobalSingleton(PLUGIN_SUBAGENT_POLICY_STATE_KEY, () => ({ policies: {} }));
function setPluginSubagentOverridePolicies(cfg) {
	const pluginSubagentPolicyState = getPluginSubagentPolicyState();
	const normalized = normalizePluginsConfig(cfg.plugins);
	const policies = {};
	for (const [pluginId, entry] of Object.entries(normalized.entries)) {
		const allowModelOverride = entry.subagent?.allowModelOverride === true;
		const hasConfiguredAllowlist = entry.subagent?.hasAllowedModelsConfig === true;
		const configuredAllowedModels = entry.subagent?.allowedModels ?? [];
		const allowedModels = /* @__PURE__ */ new Set();
		let allowAnyModel = false;
		for (const modelRef of configuredAllowedModels) {
			const normalizedModelRef = normalizePluginSubagentAllowedModelRef(modelRef);
			if (!normalizedModelRef) continue;
			if (normalizedModelRef === "*") {
				allowAnyModel = true;
				continue;
			}
			allowedModels.add(normalizedModelRef);
		}
		if (!allowModelOverride && !hasConfiguredAllowlist && allowedModels.size === 0 && !allowAnyModel) continue;
		policies[pluginId] = {
			allowModelOverride,
			allowAnyModel,
			hasConfiguredAllowlist,
			allowedModels
		};
	}
	pluginSubagentPolicyState.policies = policies;
}
function authorizeFallbackModelOverride(params) {
	const pluginSubagentPolicyState = getPluginSubagentPolicyState();
	const pluginId = params.pluginId?.trim();
	if (!pluginId) return {
		allowed: false,
		reason: "provider/model override requires plugin identity in fallback subagent runs."
	};
	const policy = pluginSubagentPolicyState.policies[pluginId];
	if (!policy?.allowModelOverride) return {
		allowed: false,
		reason: `plugin "${pluginId}" is not trusted for fallback provider/model override requests. See https://docs.openclaw.ai/plugins/sdk-runtime#api-runtime-subagent and search for: plugins.entries.<id>.subagent.allowModelOverride`
	};
	if (policy.allowAnyModel) return { allowed: true };
	if (policy.hasConfiguredAllowlist && policy.allowedModels.size === 0) return {
		allowed: false,
		reason: `plugin "${pluginId}" configured subagent.allowedModels, but none of the entries normalized to a valid provider/model target.`
	};
	if (policy.allowedModels.size === 0) return { allowed: true };
	const requestedModelRef = resolvePluginSubagentRequestedModelRef(params);
	if (!requestedModelRef) return {
		allowed: false,
		reason: "fallback provider/model overrides that use an allowlist must resolve to a canonical provider/model target."
	};
	if (policy.allowedModels.has(requestedModelRef)) return { allowed: true };
	return {
		allowed: false,
		reason: `model override "${requestedModelRef}" is not allowlisted for plugin "${pluginId}".`
	};
}
function hasAdminScope(client) {
	return (Array.isArray(client?.connect?.scopes) ? client.connect.scopes : []).includes(ADMIN_SCOPE);
}
function canClientUseModelOverride(client) {
	return hasAdminScope(client) || client?.internal?.allowModelOverride === true;
}
function canTrustedOfficialPluginRequestScopes(params) {
	if (!params.pluginId) return false;
	if (params.pluginOrigin === "bundled" || params.pluginTrustedOfficialInstall === true) return true;
	const record = getActivePluginRegistry()?.plugins.find((entry) => entry.id === params.pluginId);
	return record?.origin === "bundled" || record?.trustedOfficialInstall === true;
}
function resolveRuntimeNodeInvokeSyntheticScopes(params) {
	return params.requestedScopes && canTrustedOfficialPluginRequestScopes(params) ? params.requestedScopes : void 0;
}
async function dispatchTrustedPluginGatewayMethod(method, params = {}, options) {
	const scope = getPluginRuntimeGatewayRequestScope();
	const pluginId = scope?.pluginId?.trim();
	if (!canTrustedOfficialPluginRequestScopes(scope ?? {})) throw new Error("Gateway requests are only available to bundled or trusted official plugins.");
	const syntheticScopes = normalizeOperatorScopeList(options?.scopes);
	return await dispatchGatewayMethodInProcess(method, params, {
		forceSyntheticClient: true,
		pluginRuntimeOwnerId: pluginId,
		...syntheticScopes ? { syntheticScopes } : {},
		...options?.timeoutMs !== void 0 ? { timeoutMs: options.timeoutMs } : {}
	});
}
const PLUGIN_SUBAGENT_SESSION_MESSAGES_MAX_LIMIT = 1e3;
function createGatewaySubagentRuntime() {
	const getSessionMessages = async (params) => {
		const limit = params.limit == null || !Number.isFinite(params.limit) ? void 0 : Math.min(PLUGIN_SUBAGENT_SESSION_MESSAGES_MAX_LIMIT, Math.max(1, Math.floor(params.limit)));
		const payload = await dispatchGatewayMethodInProcess("sessions.get", {
			key: params.sessionKey,
			...limit != null && { limit }
		});
		return { messages: Array.isArray(payload?.messages) ? payload.messages : [] };
	};
	return {
		async run(params) {
			const pluginSubagentRequester = resolvePluginSubagentCompletionRequester(params.completionDelivery);
			const scope = getPluginRuntimeGatewayRequestScope();
			const pluginId = typeof scope?.pluginId === "string" && scope.pluginId.trim() ? scope.pluginId.trim() : void 0;
			const runtimePluginToolGrant = resolvePluginSubagentToolsAlsoAllow({
				pluginId,
				toolsAlsoAllow: params.toolsAlsoAllow
			});
			const overrideRequested = Boolean(params.provider || params.model);
			const hasRequestScopeClient = Boolean(scope?.client);
			let allowOverride = hasRequestScopeClient && canClientUseModelOverride(scope?.client ?? null);
			let allowSyntheticModelOverride = false;
			if (overrideRequested && !allowOverride && !hasRequestScopeClient) {
				const fallbackAuth = authorizeFallbackModelOverride({
					pluginId: scope?.pluginId,
					provider: params.provider,
					model: params.model
				});
				if (!fallbackAuth.allowed) throw new Error(fallbackAuth.reason);
				allowOverride = true;
				allowSyntheticModelOverride = true;
			}
			if (overrideRequested && !allowOverride) throw new Error("provider/model override is not authorized for this plugin subagent run.");
			const payload = await dispatchGatewayMethodInProcess("agent", {
				sessionKey: params.sessionKey,
				message: params.message,
				deliver: params.deliver ?? false,
				...allowOverride && params.provider && { provider: params.provider },
				...allowOverride && params.model && { model: params.model },
				...params.extraSystemPrompt && { extraSystemPrompt: params.extraSystemPrompt },
				...params.lane && { lane: params.lane },
				...params.cwd && { cwd: params.cwd },
				...params.lightContext === true && { bootstrapContextMode: "lightweight" },
				...params.toolsAllow !== void 0 && { toolsAllow: params.toolsAllow },
				idempotencyKey: params.idempotencyKey || randomUUID()
			}, {
				allowSyntheticModelOverride,
				agentRunTracking: "plugin_subagent",
				...pluginId ? { pluginRuntimeOwnerId: pluginId } : {},
				...pluginSubagentRequester ? { pluginSubagentRequester } : {},
				...runtimePluginToolGrant ? { runtimePluginToolGrant } : {}
			});
			const runId = payload?.runId;
			if (typeof runId !== "string" || !runId) throw new Error("Gateway agent method returned an invalid runId.");
			const runtime = normalizePluginSubagentRunRuntime(payload?.runtime);
			return {
				runId,
				...runtime ? { runtime } : {}
			};
		},
		async waitForRun(params) {
			const payload = await dispatchGatewayMethodInProcess("agent.wait", {
				runId: params.runId,
				...params.timeoutMs != null && { timeoutMs: params.timeoutMs }
			});
			let status = payload?.status;
			if (status === "completed" || status === "succeeded") status = "ok";
			else if (status === "error" && payload?.error?.trim().toLowerCase() === "completed") status = "ok";
			if (status !== "ok" && status !== "error" && status !== "timeout") throw new Error(`Gateway agent.wait returned unexpected status: ${payload?.status}`);
			return {
				status,
				...status !== "ok" && typeof payload?.error === "string" && payload.error && { error: payload.error }
			};
		},
		getSessionMessages,
		async deleteSession(params) {
			const scope = getPluginRuntimeGatewayRequestScope();
			const pluginId = typeof scope?.pluginId === "string" && scope.pluginId.trim() ? scope.pluginId.trim() : void 0;
			const pluginOwnedCleanupOptions = pluginId ? {
				pluginRuntimeOwnerId: pluginId,
				...!hasAdminScope(scope?.client) ? {
					forceSyntheticClient: true,
					syntheticScopes: [ADMIN_SCOPE]
				} : {}
			} : void 0;
			await dispatchGatewayMethodInProcess("sessions.delete", {
				key: params.sessionKey,
				deleteTranscript: params.deleteTranscript ?? true
			}, pluginOwnedCleanupOptions);
		}
	};
}
function createGatewayNodesRuntime() {
	return {
		async list(params) {
			const payload = await dispatchGatewayMethodInProcess("node.list", {});
			const nodes = Array.isArray(payload?.nodes) ? payload.nodes : [];
			return { nodes: projectGatewayRuntimeNodes(params?.connected === true ? nodes.filter((node) => typeof node === "object" && node?.connected === true) : nodes) };
		},
		async invoke(params) {
			const scope = getPluginRuntimeGatewayRequestScope();
			const pluginId = typeof scope?.pluginId === "string" && scope.pluginId.trim() ? scope.pluginId.trim() : void 0;
			const syntheticScopes = resolveRuntimeNodeInvokeSyntheticScopes({
				pluginId,
				pluginOrigin: scope?.pluginOrigin,
				pluginTrustedOfficialInstall: scope?.pluginTrustedOfficialInstall,
				requestedScopes: normalizeOperatorScopeList(params.scopes)
			});
			return await dispatchGatewayMethodInProcess("node.invoke", {
				nodeId: params.nodeId,
				command: params.command,
				...params.params !== void 0 && { params: params.params },
				timeoutMs: params.timeoutMs,
				idempotencyKey: params.idempotencyKey || randomUUID()
			}, {
				...pluginId ? { pluginRuntimeOwnerId: pluginId } : {},
				...syntheticScopes ? {
					forceSyntheticClient: true,
					syntheticScopes
				} : {},
				...params.signal ? { signal: params.signal } : {}
			});
		}
	};
}
const GATEWAY_PLUGIN_RUNTIME_BINDINGS_KEY = Symbol.for("openclaw.gatewayPluginRuntimeBindings");
function getGatewayPluginRuntimeBindings() {
	return resolveGlobalSingleton(GATEWAY_PLUGIN_RUNTIME_BINDINGS_KEY, () => ({
		nodes: createGatewayNodesRuntime(),
		subagent: createGatewaySubagentRuntime()
	}));
}
function createGatewayPluginRegistrationLogger(params) {
	const logger = createPluginRuntimeLoaderLogger();
	if (params?.suppressInfoLogs !== true) return logger;
	return {
		...logger,
		info: (_message) => void 0
	};
}
function loadGatewayPlugins(params) {
	const started = performance.now();
	const allowProcessHomeSessionCatalogs = allowsProcessHomeSessionScan();
	const activationAutoEnabled = params.activationSourceConfig !== void 0 && params.autoEnabledReasons === void 0 ? applyPluginAutoEnable({
		config: params.activationSourceConfig,
		env: process.env,
		...params.pluginLookUpTable?.manifestRegistry ? { manifestRegistry: params.pluginLookUpTable.manifestRegistry } : {},
		discovery: params.pluginLookUpTable?.discovery,
		ambientEnvTriggers: params.ambientEnvTriggers
	}) : void 0;
	const autoEnableMs = performance.now() - started;
	const autoEnabled = params.activationSourceConfig !== void 0 ? {
		config: params.cfg,
		changes: activationAutoEnabled?.changes ?? [],
		autoEnabledReasons: params.autoEnabledReasons ?? activationAutoEnabled?.autoEnabledReasons ?? {}
	} : params.autoEnabledReasons !== void 0 ? {
		config: params.cfg,
		changes: [],
		autoEnabledReasons: params.autoEnabledReasons
	} : applyPluginAutoEnable({
		config: params.cfg,
		env: process.env,
		...params.pluginLookUpTable?.manifestRegistry ? { manifestRegistry: params.pluginLookUpTable.manifestRegistry } : {},
		discovery: params.pluginLookUpTable?.discovery,
		ambientEnvTriggers: params.ambientEnvTriggers
	});
	const resolvedConfigMs = performance.now() - started;
	const resolvedConfig = autoEnabled.config;
	const pluginIds = params.pluginIds ?? [...(params.pluginLookUpTable ?? loadPluginLookUpTable({
		config: resolvedConfig,
		activationSourceConfig: params.activationSourceConfig,
		workspaceDir: params.workspaceDir,
		env: process.env,
		ambientEnvTriggers: params.ambientEnvTriggers
	})).startup.pluginIds];
	const pluginIdsMs = performance.now() - started;
	if (pluginIds.length === 0) {
		const pluginRegistry = createEmptyPluginRegistry();
		activatePluginRegistry(pluginRegistry, null, "gateway-bindable", params.workspaceDir);
		params.startupTrace?.detail("plugins.gateway-load", [
			["autoEnableMs", autoEnableMs],
			["resolvedConfigMs", resolvedConfigMs],
			["pluginIdsMs", pluginIdsMs],
			["loadMs", 0],
			["pluginIds", "0"],
			["pluginCount", 0],
			["gatewayHandlerCount", 0]
		]);
		return {
			pluginRegistry,
			gatewayMethods: [...params.baseMethods]
		};
	}
	const beforeLoad = performance.now();
	const loaderStatsBefore = getPluginModuleLoaderStats();
	const gatewayRuntimeBindings = getGatewayPluginRuntimeBindings();
	const pluginRegistry = loadAndActivateRootPluginRegistry({
		config: resolvedConfig,
		allowProcessHomeSessionCatalogs,
		activationSourceConfig: params.activationSourceConfig ?? params.cfg,
		autoEnabledReasons: autoEnabled.autoEnabledReasons,
		workspaceDir: params.workspaceDir,
		onlyPluginIds: pluginIds,
		logger: createGatewayPluginRegistrationLogger({ suppressInfoLogs: params.suppressPluginInfoLogs }),
		...params.coreGatewayHandlers !== void 0 && { coreGatewayHandlers: params.coreGatewayHandlers },
		...params.coreGatewayMethodNames !== void 0 && { coreGatewayMethodNames: params.coreGatewayMethodNames },
		...params.hostServices !== void 0 && { hostServices: params.hostServices },
		runtimeOptions: {
			allowGatewaySubagentBinding: true,
			...gatewayRuntimeBindings
		},
		channelPluginLoadIntent: params.channelPluginLoadIntent,
		preferBuiltPluginArtifacts: true,
		...params.startupTrace !== void 0 && { startupTrace: params.startupTrace },
		...params.pluginLookUpTable ? {
			manifestRegistry: params.pluginLookUpTable.manifestRegistry,
			installRecords: extractPluginInstallRecordsFromInstalledPluginIndex(params.pluginLookUpTable.index)
		} : {}
	});
	const loadMs = performance.now() - beforeLoad;
	const loaderStatsAfter = getPluginModuleLoaderStats();
	const pluginMethods = Object.keys(pluginRegistry.gatewayHandlers);
	const gatewayMethods = uniqueStrings([...params.baseMethods, ...pluginMethods]);
	params.startupTrace?.detail("plugins.gateway-load", [
		["autoEnableMs", autoEnableMs],
		["resolvedConfigMs", resolvedConfigMs],
		["pluginIdsMs", pluginIdsMs],
		["loadMs", loadMs],
		["pluginIds", String(pluginIds.length)],
		["pluginCount", pluginIds.length],
		["gatewayHandlers", String(pluginMethods.length)],
		["gatewayHandlerCount", pluginMethods.length],
		["loaderCallsCount", loaderStatsAfter.calls - loaderStatsBefore.calls],
		["loaderNativeHitsCount", loaderStatsAfter.nativeHits - loaderStatsBefore.nativeHits],
		["loaderNativeMissesCount", loaderStatsAfter.nativeMisses - loaderStatsBefore.nativeMisses],
		["loaderSourceTransformForcedCount", loaderStatsAfter.sourceTransformForced - loaderStatsBefore.sourceTransformForced],
		["loaderSourceTransformFallbacksCount", loaderStatsAfter.sourceTransformFallbacks - loaderStatsBefore.sourceTransformFallbacks],
		["loaderTopSourceTransformTargets", loaderStatsAfter.topSourceTransformTargets.slice(0, 3).map((entry) => `${entry.count}:${entry.target}`).join(",")]
	]);
	return {
		pluginRegistry,
		gatewayMethods
	};
}
//#endregion
export { setPluginSubagentOverridePolicies as a, dispatchGatewayMethodInProcessRaw as c, createSyntheticPluginRuntimeClient as d, dispatchGatewayRequestInProcess as f, waitForGatewayDispatch as h, loadGatewayPlugins as i, getInProcessGatewayRequestContext as l, unwrapGatewayMethodDispatchResponse as m, createGatewaySubagentRuntime as n, hasInProcessGatewayContext as o, throwIfGatewayDispatchAborted as p, dispatchTrustedPluginGatewayMethod as r, dispatchGatewayMethodInProcess as s, createGatewayNodesRuntime as t, consumeSubagentCompletionToolHandoff as u };
