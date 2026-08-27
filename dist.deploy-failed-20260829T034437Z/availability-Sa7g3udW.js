import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
import { g as resolveSessionAgentIds } from "./agent-scope-DigoIwHb.js";
import { a as resolveModelProviderRouteOverridePresence, i as resolveMergedModelProviderModels, n as resolveMergedModelProviderConfig } from "./model-provider-config-B3wTMsqG.js";
import { _ as isDefaultAgentRuntimeId, f as hasAuthoredProviderRequestParams, y as normalizeOptionalAgentRuntimeId } from "./openai-routing-mOc2UICM.js";
import { o as resolveProviderModelRoutes, s as projectConfigOntoRuntimeSourceSnapshot, t as canonicalizeProviderModelId } from "./provider-model-route-D-FYx-DP.js";
import { t as resolveAgentHarnessPolicy } from "./policy-23u__u-R.js";
import { n as getRegisteredAgentHarness, r as listRegisteredAgentHarnesses } from "./registry-lPXwErEe.js";
import { a as resolveAgentHarnessAutoSelectionHint } from "./session-runtime-compat-BJ6CDpbR.js";
//#region src/agents/harness/support.ts
/** Projects one prepared auth attempt into a secret-free native-runtime support fact. */
function resolveAgentHarnessPreparedAuthSupport(params) {
	const plan = params.plan;
	if (!plan) return;
	return {
		source: params.source ?? (plan.forwardedAuthProfileId ? "profile" : plan.selectedAuthMode ? "direct" : plan.harnessAuthProvider ? "harness" : "none"),
		...plan.selectedAuthMode ? { mode: plan.selectedAuthMode } : {},
		...plan.modelRoute ? { requirement: plan.modelRoute.authRequirement } : {}
	};
}
/** Projects the concrete or deferred prepared route into native-runtime support facts. */
function resolveAgentHarnessPreparedRouteSupport(plan) {
	const support = plan?.modelRoute ?? plan?.deferredRouteSupport;
	return support ? {
		requestTransportOverrides: support.requestTransportOverrides,
		runtimePolicy: support.runtimePolicy
	} : {};
}
/** Builds the provider/model facts passed to registered harness support probes. */
function buildAgentHarnessSupportContext(params) {
	const providerConfig = resolveMergedModelProviderConfig(params.config, params.provider);
	const authoredConfig = params.config ? projectConfigOntoRuntimeSourceSnapshot(params.config) : void 0;
	const modelId = params.modelId ? normalizeModelId(params.provider, params.modelId) : void 0;
	const modelConfig = modelId ? resolveMergedModelProviderModels({
		models: providerConfig?.models,
		normalizeModelId: (configuredModelId) => normalizeModelId(params.provider, configuredModelId)
	}).get(modelId) : void 0;
	const agentId = params.config && (params.agentId?.trim() || params.sessionKey?.trim()) ? resolveSessionAgentIds({
		config: params.config,
		agentId: params.agentId,
		sessionKey: params.sessionKey
	}).sessionAgentId : params.agentId;
	const hasConfiguredProviderRequestParams = hasAuthoredProviderRequestParams({
		config: params.config,
		provider: params.provider,
		modelId: params.modelId,
		agentId
	});
	const configuredModelProvider = providerConfig ? {
		api: modelConfig?.api ?? providerConfig.api ?? "openai-responses",
		baseUrl: modelConfig?.baseUrl ?? providerConfig.baseUrl,
		azureApiVersion: normalizeOptionalString(modelConfig?.params?.azureApiVersion ?? providerConfig.params?.azureApiVersion),
		request: providerConfig.request,
		requestTransportOverrides: resolveModelProviderRouteOverridePresence({
			provider: params.provider,
			modelId: params.modelId,
			authoredConfig,
			canonicalizeModelId: (configuredModelId) => canonicalizeProviderModelId(params.provider, configuredModelId)
		})
	} : void 0;
	const requestTransportOverrides = params.modelProvider?.requestTransportOverrides === "present" || configuredModelProvider?.requestTransportOverrides === "present" || hasConfiguredProviderRequestParams ? "present" : "none";
	const modelProviderFacts = params.modelProvider || configuredModelProvider || hasConfiguredProviderRequestParams ? {
		api: params.modelProvider?.api ?? configuredModelProvider?.api,
		baseUrl: params.modelProvider?.baseUrl ?? configuredModelProvider?.baseUrl,
		azureApiVersion: params.modelProvider?.azureApiVersion ?? configuredModelProvider?.azureApiVersion,
		request: params.modelProvider?.request ?? configuredModelProvider?.request,
		preparedAuth: params.modelProvider?.preparedAuth,
		requestTransportOverrides
	} : void 0;
	const routeRuntimeContract = params.modelProvider?.runtimePolicy ? {
		owned: true,
		policy: params.modelProvider.runtimePolicy
	} : params.preparedModelProvider ? { owned: true } : resolveHarnessRouteRuntimePolicy({
		provider: params.provider,
		modelId: params.modelId,
		modelProvider: modelProviderFacts,
		config: params.config
	});
	const modelProvider = modelProviderFacts || routeRuntimeContract.owned ? {
		...modelProviderFacts,
		runtimePolicy: params.modelProvider?.runtimePolicy ?? routeRuntimeContract.policy
	} : void 0;
	return {
		provider: params.provider,
		modelId: params.modelId,
		modelProvider,
		requestedRuntime: params.requestedRuntime,
		...params.providerOwnership ? {
			providerOwnerStatus: params.providerOwnership.status,
			providerOwnerPluginIds: params.providerOwnership.status === "unowned" ? [] : params.providerOwnership.pluginIds
		} : {}
	};
}
function resolveHarnessRouteRuntimePolicy(params) {
	const resolution = resolveProviderModelRoutes({
		provider: params.provider,
		modelId: params.modelId,
		api: params.modelProvider?.api,
		baseUrl: params.modelProvider?.baseUrl,
		config: params.config,
		requestTransportOverrides: params.modelProvider?.requestTransportOverrides
	});
	if (!resolution) return { owned: false };
	if (resolution.kind !== "routes") return { owned: true };
	const policies = resolution.routes.map((route) => route.runtimePolicy);
	const first = policies[0];
	if (!first || policies.some((policy) => !policy)) return { owned: true };
	return {
		owned: true,
		policy: { compatibleIds: first.compatibleIds.filter((id, index, ids) => ids.indexOf(id) === index && policies.every((policy) => policy?.compatibleIds.includes(id))) }
	};
}
/** Resolves the registered plugin harness that auto selection would choose. */
function resolveAutoAgentHarnessId(params) {
	const registeredHarnesses = listRegisteredAgentHarnesses();
	if (registeredHarnesses.length === 0) return;
	const candidates = registeredHarnesses.map(({ harness }) => ({
		harness,
		support: resolveAgentHarnessAutoSelectionHint({
			harness,
			provider: params.provider
		})
	}));
	if (candidates.every((entry) => entry.support !== void 0)) return;
	const supportContext = buildAgentHarnessSupportContext({
		...params,
		requestedRuntime: "auto"
	});
	return candidates.map(({ harness, support }) => ({
		harness,
		support: support ?? harness.supports(supportContext)
	})).filter(isSupportedHarness).toSorted(compareHarnessSupport)[0]?.harness.id;
}
function compareHarnessSupport(left, right) {
	const priorityDelta = (right.support.priority ?? 0) - (left.support.priority ?? 0);
	return priorityDelta !== 0 ? priorityDelta : left.harness.id.localeCompare(right.harness.id);
}
function isSupportedHarness(entry) {
	return entry.support.supported;
}
function normalizeModelId(provider, modelId) {
	const trimmed = modelId.trim();
	const slashIndex = trimmed.indexOf("/");
	return canonicalizeProviderModelId(provider, slashIndex > 0 && normalizeProviderId(trimmed.slice(0, slashIndex)) === normalizeProviderId(provider) ? trimmed.slice(slashIndex + 1).trim() : trimmed);
}
//#endregion
//#region src/agents/harness/availability.ts
/** Lightweight runtime availability shared by execution and next-turn projections. */
function resolveAvailableAgentHarnessPolicy(params) {
	return resolveAgentHarnessAvailabilityDecision(params).policy;
}
function resolveAgentHarnessAvailabilityDecision(params) {
	const configured = resolveAgentHarnessPolicy({
		...params,
		modelApi: params.modelProvider?.api ?? params.modelApi,
		modelBaseUrl: params.modelProvider?.baseUrl ?? params.modelBaseUrl,
		requestTransportOverrides: params.modelProvider?.requestTransportOverrides ?? params.requestTransportOverrides
	});
	const pinnedHarnessId = normalizeOptionalAgentRuntimeId(params.agentHarnessId);
	const runtimeOverride = pinnedHarnessId ?? normalizeOptionalAgentRuntimeId(params.agentHarnessRuntimeOverride);
	const policy = runtimeOverride && !isDefaultAgentRuntimeId(runtimeOverride) ? {
		...configured,
		runtime: runtimeOverride,
		runtimeSource: "model"
	} : configured;
	const implicit = policy.runtime === "codex" && policy.runtimeSource === "implicit";
	if (policy.runtime === "auto" || policy.runtime === "openclaw") return {
		kind: "available",
		policy
	};
	const registered = getRegisteredAgentHarness(policy.runtime);
	if (!registered) return implicit && params.mode !== "projection" ? {
		kind: "implicit-unavailable",
		policy: {
			...policy,
			runtime: "openclaw"
		}
	} : {
		kind: "available",
		policy
	};
	if (pinnedHarnessId === policy.runtime && !params.preparedModelProvider) return {
		kind: "available",
		policy
	};
	const provider = params.provider?.trim() ?? "";
	if (params.provider === void 0) return {
		kind: "available",
		policy
	};
	const support = registered.harness.supports(buildAgentHarnessSupportContext({
		...params,
		provider,
		requestedRuntime: policy.runtime,
		providerOwnership: params.resolveProviderOwnership?.()
	}));
	if (!support.supported && !policy.forcedByEnvironment) {
		if (implicit || support.fallbackRuntime === "openclaw") return {
			kind: implicit ? "implicit-unsupported" : "declared-fallback",
			policy: {
				...policy,
				runtime: "openclaw"
			},
			support
		};
	}
	return {
		kind: "available",
		policy,
		support
	};
}
//#endregion
export { resolveAgentHarnessPreparedAuthSupport as a, compareHarnessSupport as i, resolveAvailableAgentHarnessPolicy as n, resolveAgentHarnessPreparedRouteSupport as o, buildAgentHarnessSupportContext as r, resolveAutoAgentHarnessId as s, resolveAgentHarnessAvailabilityDecision as t };
