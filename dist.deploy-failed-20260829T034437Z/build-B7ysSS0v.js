import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.js";
import { i as isSilentReplyPayloadText } from "./tokens-DbQz-n_m.js";
import { c as resolveProviderFollowupFallbackRoute, f as resolveProviderRuntimePluginHandle } from "./provider-hook-runtime-C6OwLIWh.js";
import { L as transformProviderSystemPrompt, O as resolveProviderSystemPromptContribution, k as resolveProviderTextTransforms } from "./provider-runtime-XSAeyFFJ.js";
import { t as buildAgentRuntimeAuthPlan } from "./auth-DLBRR8X_.js";
import { o as hasReplyPayloadContent } from "./payload-C7E4iMOo.js";
import { a as resolvePreparedExtraParams } from "./extra-params-DztvRYf4.js";
import { u as resolveTranscriptPolicy } from "./settled-turn-finalization-result-cHPv9pc9.js";
import { i as normalizeProviderToolSchemas, r as logProviderToolSchemaDiagnostics } from "./tools-B99gQSFe.js";
import { t as classifyEmbeddedAgentRunResultForModelFallback } from "./result-fallback-classifier-Ba94zysF.js";
//#region src/agents/runtime-plan/build.ts
function formatResolvedRef(params) {
	return `${params.provider}/${params.modelId}`;
}
function asOpenClawConfig(value) {
	return asOptionalRecord(value);
}
function asProviderRuntimeModel(value) {
	return value !== void 0 ? value : void 0;
}
function resolvePreparedMetadataSnapshot(params) {
	return params.metadataSnapshot;
}
function resolvePreparedProviderRuntimeHandle(params) {
	if (params.providerRuntimeHandle?.prepared === true && params.providerRuntimeHandle.provider === params.provider && params.providerRuntimeHandle.modelId === params.modelId && params.providerRuntimeHandle.workspaceDir === params.workspaceDir) return params.providerRuntimeHandle;
	const metadataSnapshot = resolvePreparedMetadataSnapshot(params);
	return {
		...resolveProviderRuntimePluginHandle({
			provider: params.provider,
			modelId: params.modelId,
			config: asOpenClawConfig(params.config),
			workspaceDir: params.workspaceDir,
			env: process.env,
			...metadataSnapshot ? { pluginMetadataSnapshot: metadataSnapshot } : {}
		}),
		modelId: params.modelId,
		prepared: true
	};
}
/** Build delivery-specific runtime decisions for one provider/model. */
function buildAgentRuntimeDeliveryPlan(params) {
	const config = asOpenClawConfig(params.config);
	const providerRuntimeHandle = resolvePreparedProviderRuntimeHandle(params);
	return {
		isSilentPayload(payload) {
			return isSilentReplyPayloadText(payload.text, "NO_REPLY") && !hasReplyPayloadContent({
				...payload,
				text: void 0
			}, { trimText: true });
		},
		resolveFollowupRoute(routeParams) {
			return resolveProviderFollowupFallbackRoute({
				provider: params.provider,
				config,
				workspaceDir: params.workspaceDir,
				runtimeHandle: providerRuntimeHandle,
				context: {
					config,
					agentDir: params.agentDir,
					workspaceDir: params.workspaceDir,
					provider: params.provider,
					modelId: params.modelId,
					payload: routeParams.payload,
					originatingChannel: routeParams.originatingChannel,
					originatingTo: routeParams.originatingTo,
					originRoutable: routeParams.originRoutable,
					dispatcherAvailable: routeParams.dispatcherAvailable
				}
			});
		}
	};
}
/** Build run-outcome classification hooks for model fallback decisions. */
function buildAgentRuntimeOutcomePlan() {
	return { classifyRunResult: classifyEmbeddedAgentRunResultForModelFallback };
}
/** Build the complete runtime plan for an embedded agent attempt. */
function buildAgentRuntimePlan(params) {
	const config = asOpenClawConfig(params.config);
	const model = asProviderRuntimeModel(params.model);
	const modelApi = params.modelApi ?? params.model?.api ?? void 0;
	const transport = params.resolvedTransport;
	const toolPlanningMetadataSnapshot = resolvePreparedMetadataSnapshot(params);
	const preparedPlanning = toolPlanningMetadataSnapshot ? { metadataSnapshot: toolPlanningMetadataSnapshot } : void 0;
	const providerRuntimeHandleForPlugins = resolvePreparedProviderRuntimeHandle(params);
	const auth = params.preparedAuthPlan ?? buildAgentRuntimeAuthPlan({
		provider: params.provider,
		modelId: params.modelId,
		authProfileProvider: params.authProfileProvider,
		authProfileMode: params.authProfileMode,
		sessionAuthProfileId: params.sessionAuthProfileId,
		sessionAuthProfileSource: params.sessionAuthProfileSource,
		sessionAuthProfileCandidateIds: params.sessionAuthProfileCandidateIds,
		modelRoute: params.modelRoute,
		config,
		workspaceDir: params.workspaceDir,
		metadataSnapshot: toolPlanningMetadataSnapshot,
		harnessId: params.harnessId,
		harnessRuntime: params.harnessRuntime,
		allowHarnessAuthProfileForwarding: params.allowHarnessAuthProfileForwarding
	});
	const resolvedRef = {
		provider: params.provider,
		modelId: params.modelId,
		...modelApi ? { modelApi } : {},
		...params.harnessId ? { harnessId: params.harnessId } : {},
		...transport ? { transport } : {}
	};
	const toolContext = {
		provider: params.provider,
		config,
		workspaceDir: params.workspaceDir,
		env: process.env,
		runtimeHandle: providerRuntimeHandleForPlugins,
		modelId: params.modelId,
		modelApi,
		model
	};
	const resolveToolContext = (overrides) => ({
		...toolContext,
		...overrides?.workspaceDir !== void 0 ? { workspaceDir: overrides.workspaceDir } : {},
		...overrides?.modelApi !== void 0 ? { modelApi: overrides.modelApi } : {},
		...overrides?.model !== void 0 ? { model: asProviderRuntimeModel(overrides.model) } : {}
	});
	const resolveTranscriptRuntimePolicy = (overrides) => resolveTranscriptPolicy({
		provider: params.provider,
		modelId: params.modelId,
		config,
		workspaceDir: overrides?.workspaceDir ?? params.workspaceDir,
		env: process.env,
		runtimeHandle: providerRuntimeHandleForPlugins,
		modelApi: overrides?.modelApi ?? modelApi,
		model: asProviderRuntimeModel(overrides?.model) ?? model
	});
	const resolveTransportExtraParams = (overrides = {}) => resolvePreparedExtraParams({
		cfg: config,
		provider: params.provider,
		modelId: params.modelId,
		agentDir: params.agentDir,
		workspaceDir: overrides.workspaceDir ?? params.workspaceDir,
		extraParamsOverride: overrides.extraParamsOverride ?? params.extraParamsOverride,
		thinkingLevel: overrides.thinkingLevel ?? params.thinkingLevel,
		agentId: overrides.agentId ?? params.agentId,
		model: asProviderRuntimeModel(overrides.model) ?? model,
		resolvedTransport: overrides.resolvedTransport ?? transport,
		providerRuntimeHandle: providerRuntimeHandleForPlugins
	});
	let memoizedTranscriptPolicy;
	let memoizedTransportExtraParams;
	const resolveDefaultTranscriptPolicy = () => {
		memoizedTranscriptPolicy ??= resolveTranscriptRuntimePolicy();
		return memoizedTranscriptPolicy;
	};
	const resolveDefaultTransportExtraParams = () => {
		memoizedTransportExtraParams ??= resolveTransportExtraParams();
		return memoizedTransportExtraParams;
	};
	const providerTextTransforms = resolveProviderTextTransforms({
		provider: params.provider,
		config,
		workspaceDir: params.workspaceDir,
		env: process.env,
		runtimeHandle: providerRuntimeHandleForPlugins
	});
	return {
		resolvedRef,
		providerRuntimeHandle: providerRuntimeHandleForPlugins,
		auth,
		prompt: {
			provider: params.provider,
			modelId: params.modelId,
			textTransforms: providerTextTransforms,
			resolveSystemPromptContribution(context) {
				return resolveProviderSystemPromptContribution({
					provider: params.provider,
					config,
					workspaceDir: context.workspaceDir ?? params.workspaceDir,
					runtimeHandle: providerRuntimeHandleForPlugins,
					context: {
						...context,
						config: asOpenClawConfig(context.config)
					}
				});
			},
			transformSystemPrompt(context) {
				return transformProviderSystemPrompt({
					provider: params.provider,
					config,
					workspaceDir: context.workspaceDir ?? params.workspaceDir,
					runtimeHandle: providerRuntimeHandleForPlugins,
					context: {
						...context,
						config: asOpenClawConfig(context.config)
					}
				});
			}
		},
		tools: {
			preparedPlanning,
			normalize(tools, overrides) {
				return normalizeProviderToolSchemas({
					...resolveToolContext(overrides),
					tools
				});
			},
			logDiagnostics(tools, overrides) {
				logProviderToolSchemaDiagnostics({
					...resolveToolContext(overrides),
					tools
				});
			}
		},
		transcript: {
			get policy() {
				return resolveDefaultTranscriptPolicy();
			},
			resolvePolicy: resolveTranscriptRuntimePolicy
		},
		delivery: buildAgentRuntimeDeliveryPlan({
			...params,
			providerRuntimeHandle: providerRuntimeHandleForPlugins
		}),
		outcome: buildAgentRuntimeOutcomePlan(),
		transport: {
			get extraParams() {
				return resolveDefaultTransportExtraParams();
			},
			resolveExtraParams: resolveTransportExtraParams
		},
		observability: {
			resolvedRef: formatResolvedRef({
				provider: params.provider,
				modelId: params.modelId
			}),
			provider: params.provider,
			modelId: params.modelId,
			...modelApi ? { modelApi } : {},
			...params.harnessId ? { harnessId: params.harnessId } : {},
			...auth.forwardedAuthProfileId ? { authProfileId: auth.forwardedAuthProfileId } : {},
			...transport ? { transport } : {}
		}
	};
}
//#endregion
export { buildAgentRuntimePlan as n, buildAgentRuntimeDeliveryPlan as t };
