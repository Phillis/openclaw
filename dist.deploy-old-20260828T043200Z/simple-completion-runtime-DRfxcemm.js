import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { o as resolveAgentEffectiveModelPrimary } from "./agent-scope-DigoIwHb.js";
import { f as resolveAgentWorkspaceDir, g as resolveDefaultAgentId, l as resolveAgentDir } from "./agent-scope-config-CUBiGmG3.js";
import { s as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-CeAk9iRD.js";
import { i as isOpenAIProvider, n as OPENAI_PROVIDER_ID } from "./openai-routing-mOc2UICM.js";
import { b as resolveModelRefFromString, i as buildModelAliasIndex } from "./model-selection-shared-I5TmV9jL.js";
import "./defaults-CdX9UGcX.js";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BIKs-96s.js";
import { w as resolveDefaultModelForAgent } from "./codex-route-model-ref-Du1KAbLA.js";
import { a as resolveOpenAIModelRoutes, f as buildProviderModelAuthDirectSource, o as selectOpenAIModelRouteAuth, p as buildProviderModelAuthSourcePlan } from "./openai-model-routes-Bxpy3ufg.js";
import { t as resolveAgentHarnessPolicy } from "./policy-23u__u-R.js";
import { n as withPluginRuntimeGenerationScope } from "./generation-scope-DDjt_91x.js";
import { t as applyPreparedRuntimeAuthToModel } from "./provider-request-config-BAUXM8KH.js";
import { t as protectPreparedProviderRuntimeAuth } from "./provider-secret-egress-BXpRqyF7.js";
import { r as ensureAuthProfileStore } from "./store-C0UG5FOx.js";
import { d as resolveClaudeSonnet5ModelIdentity, u as resolveClaudeOpus5ModelIdentity } from "./src-5i09w5fd.js";
import { a as prepareProviderRuntimeAuth } from "./provider-runtime.runtime.js";
import { lt as getModelRegistryRuntime } from "./sessions-PHTfe5gZ.js";
import { a as bindModelLlmRuntime, n as completeSimple, s as getModelLlmRuntime } from "./stream-CXbsApnu.js";
import { t as createAgentRuntimeMetadataPluginIdScope } from "./runtime-plugin-load-plan-DBGXY5LT.js";
import { r as formatMissingAuthError } from "./model-auth-runtime-shared-C48YoQY0.js";
import { t as acquireAgentRunPreparedModelRuntime } from "./prepared-model-runtime-afzKiwqZ.js";
import { i as getApiKeyForModelCore, n as applyLocalNoAuthHeaderOverride, r as applySecretRefHeaderSentinels, s as resolveApiKeyForProviderCore } from "./model-auth-e0nL7cI2.js";
import "./model-selection-DHDS-v4K.js";
import { t as buildAgentRuntimeAuthPlan } from "./auth-DLBRR8X_.js";
import { n as resolveModelAsync } from "./model-mZvi1Kcu.js";
import { o as fingerprintResolvedProviderAuth, t as fingerprintAuthProfileCredential } from "./execution-auth-binding-CmucNoqo.js";
import { t as materializePreparedRuntimeModel } from "./materialize-model-CdqxvJe8.js";
import { n as resolveUtilityModelRefForAgent } from "./utility-model-DDmd0Hw9.js";
import { supportsOpenAIReasoningEffort } from "@openclaw/ai/internal/openai";
import { prepareModelForSimpleCompletion } from "@openclaw/ai/transports";
import { defaultApiRegistry } from "@openclaw/ai/internal/runtime";
//#region src/agents/simple-completion-scope.ts
/** Bind every resolution in one completion to one prepared generation and store pair. */
function createPreparedSimpleCompletionResolverContext(params) {
	const stores = params.preparedModelRuntime.createStores();
	const modelResolver = params.modelResolver ?? resolveModelAsync;
	return {
		preparedModelRuntime: params.preparedModelRuntime,
		workspaceDir: params.workspaceDir,
		modelResolver: (provider, modelId, agentDir, cfg, options) => modelResolver(provider, modelId, agentDir, cfg, {
			...options,
			authStorage: stores.authStorage,
			modelRegistry: stores.modelRegistry,
			preparedModelRuntime: params.preparedModelRuntime,
			workspaceDir: params.workspaceDir,
			...params.agentRuntimeId ? { agentRuntimeId: params.agentRuntimeId } : {}
		})
	};
}
//#endregion
//#region src/agents/simple-completion-runtime.ts
function resolveSimpleCompletionSelectionRequest(params) {
	const fallbackRef = resolveDefaultModelForAgent({
		cfg: params.cfg,
		agentId: params.agentId,
		manifestPlugins: params.manifestPlugins
	});
	const modelRef = params.modelRef?.trim() || (params.useUtilityModel ? resolveUtilityModelRefForAgent({
		cfg: params.cfg,
		agentId: params.agentId,
		primaryProvider: fallbackRef.provider,
		...params.manifestPlugins ? { metadataSnapshot: { plugins: params.manifestPlugins } } : {}
	}) : void 0) || resolveAgentEffectiveModelPrimary(params.cfg, params.agentId);
	const split = modelRef ? splitTrailingAuthProfile(modelRef) : null;
	const aliasIndex = buildModelAliasIndex({
		cfg: params.cfg,
		agentId: params.agentId,
		defaultProvider: fallbackRef.provider || "openai",
		manifestPlugins: params.manifestPlugins
	});
	const resolved = split ? resolveModelRefFromString({
		cfg: params.cfg,
		agentId: params.agentId,
		raw: split.model,
		defaultProvider: fallbackRef.provider || "openai",
		aliasIndex,
		manifestPlugins: params.manifestPlugins
	}) : null;
	const provider = resolved?.ref.provider ?? fallbackRef.provider;
	const modelId = resolved?.ref.model ?? fallbackRef.model;
	if (!provider || !modelId) return null;
	const runtimeProvider = isOpenAIProvider(provider) && resolveAgentHarnessPolicy({
		provider,
		modelId,
		config: params.cfg,
		agentId: params.agentId
	}).runtime === "codex" ? OPENAI_PROVIDER_ID : void 0;
	return {
		selection: {
			provider,
			modelId,
			...runtimeProvider ? { runtimeProvider } : {},
			profileId: split?.profile || void 0,
			agentDir: params.agentDir?.trim() || resolveAgentDir(params.cfg, params.agentId)
		},
		...split && !split.model.includes("/") ? { shorthandModelId: split.model } : {}
	};
}
function resolveSimpleCompletionSelectionForAgent(params) {
	return resolveSimpleCompletionSelectionRequest(params)?.selection ?? null;
}
async function prepareSimpleCompletionModel(params) {
	return await withPreparedSimpleCompletionRuntime(params, [{
		provider: params.provider,
		modelId: params.modelId,
		...params.agentRuntimeId ? { runtime: params.agentRuntimeId } : {}
	}], async (context) => await prepareSimpleCompletionModelCore({
		...params,
		agentDir: context.preparedModelRuntime.agentDir
	}, context));
}
async function prepareSimpleCompletionModelCore(params, context) {
	const { modelResolver, workspaceDir } = context;
	const resolved = await modelResolver(params.provider, params.modelId, params.agentDir, params.cfg, {
		...params.agentId ? { agentId: params.agentId } : {},
		...params.allowBundledStaticCatalogFallback !== void 0 ? { allowBundledStaticCatalogFallback: params.allowBundledStaticCatalogFallback } : {},
		...params.skipAgentDiscovery ? { skipAgentDiscovery: true } : {},
		authProfileId: params.profileId,
		preferredProfile: params.preferredProfile
	});
	if (!resolved.model) return { error: resolved.error ?? `Unknown model: ${params.provider}/${params.modelId}` };
	const initialModel = resolved.model;
	let resolvedModel = initialModel;
	const routeResolution = resolveOpenAIModelRoutes({
		provider: initialModel.provider,
		modelId: initialModel.id,
		api: initialModel.api,
		baseUrl: initialModel.baseUrl,
		config: params.cfg,
		env: process.env
	});
	const resolvesAuthBeforePhysicalRoute = routeResolution?.kind === "routes" && routeResolution.routes.length > 1;
	let auth;
	const authStore = params.bindAuthOwner ? ensureAuthProfileStore(params.agentDir, {
		readOnly: true,
		allowKeychainPrompt: false,
		config: params.cfg
	}) : void 0;
	try {
		auth = resolvesAuthBeforePhysicalRoute ? await resolveApiKeyForProviderCore({
			provider: initialModel.provider,
			cfg: params.cfg,
			agentDir: params.agentDir,
			workspaceDir,
			profileId: params.profileId,
			preferredProfile: params.preferredProfile,
			...authStore ? { store: authStore } : {},
			...params.bindAuthOwner && params.profileId ? { lockedProfile: true } : {},
			modelId: initialModel.id,
			secretSentinels: true
		}) : await getApiKeyForModelCore({
			model: initialModel,
			cfg: params.cfg,
			agentDir: params.agentDir,
			workspaceDir,
			profileId: params.profileId,
			preferredProfile: params.preferredProfile,
			...authStore ? { store: authStore } : {},
			...params.bindAuthOwner && params.profileId ? { lockedProfile: true } : {},
			secretSentinels: true
		});
		if (routeResolution?.kind === "routes") {
			const routeAuthDecision = selectOpenAIModelRouteAuth({
				resolution: routeResolution,
				sourcePlan: buildProviderModelAuthSourcePlan({
					ownership: {
						reason: "provider-binding",
						source: auth.profileId ? {
							kind: "profile",
							profileId: auth.profileId,
							provider: initialModel.provider,
							mode: auth.mode,
							readiness: "ready",
							cooldown: "clear"
						} : buildProviderModelAuthDirectSource({
							mode: auth.mode,
							availability: true,
							evidence: "runtime",
							authorization: "declared"
						})
					},
					profiles: []
				})
			});
			if (routeAuthDecision.kind !== "selected") throw new Error(routeAuthDecision.kind === "rejected" ? routeAuthDecision.message : "OpenAI route selection unexpectedly deferred after auth was resolved.");
			const route = routeAuthDecision.selection.route;
			resolvedModel = await materializePreparedRuntimeModel({
				plan: buildAgentRuntimeAuthPlan({
					provider: initialModel.provider,
					modelId: initialModel.id,
					authProfileProvider: initialModel.provider,
					authProfileMode: auth.mode,
					sessionAuthProfileId: auth.profileId,
					sessionAuthProfileSource: params.profileId ? "user" : "auto",
					modelRoute: {
						provider: initialModel.provider,
						modelId: initialModel.id,
						api: route.api,
						baseUrl: route.baseUrl,
						authRequirement: route.authRequirement,
						requestTransportOverrides: route.requestTransportOverrides,
						runtimePolicy: route.runtimePolicy
					},
					config: params.cfg,
					workspaceDir
				}),
				provider: initialModel.provider,
				modelId: initialModel.id,
				config: params.cfg,
				model: initialModel,
				resolveModel: ({ config, authProfileId, authProfileMode }) => modelResolver(initialModel.provider, initialModel.id, params.agentDir, config, {
					...params.agentId ? { agentId: params.agentId } : {},
					skipAgentDiscovery: true,
					allowBundledStaticCatalogFallback: true,
					preferBundledStaticCatalogTransport: true,
					authProfileId,
					authProfileMode
				})
			}) ?? initialModel;
			if (resolvesAuthBeforePhysicalRoute) auth = await getApiKeyForModelCore({
				model: resolvedModel,
				cfg: params.cfg,
				agentDir: params.agentDir,
				workspaceDir,
				profileId: auth.profileId,
				preferredProfile: params.preferredProfile,
				...authStore ? { store: authStore } : {},
				...params.bindAuthOwner && params.profileId ? { lockedProfile: true } : {},
				secretSentinels: true
			});
		}
	} catch (err) {
		return { error: `Auth lookup failed for provider "${initialModel.provider}": ${formatErrorMessage(err)}` };
	}
	const rawApiKey = auth.apiKey?.trim();
	if (!rawApiKey && !params.allowMissingApiKeyModes?.includes(auth.mode)) return {
		error: formatMissingAuthError(auth, resolvedModel.provider),
		auth
	};
	let authValue = rawApiKey;
	if (rawApiKey) {
		const preparedAuth = protectPreparedProviderRuntimeAuth({
			provider: resolvedModel.provider,
			preparedAuth: await prepareProviderRuntimeAuth({
				provider: resolvedModel.provider,
				config: params.cfg,
				workspaceDir,
				env: process.env,
				context: {
					config: params.cfg,
					workspaceDir,
					env: process.env,
					provider: resolvedModel.provider,
					modelId: resolvedModel.id,
					model: resolvedModel,
					apiKey: rawApiKey,
					authMode: auth.mode,
					profileId: auth.profileId
				}
			})
		});
		authValue = preparedAuth?.apiKey?.trim() || rawApiKey;
		resolved.authStorage.setRuntimeApiKey(resolvedModel.provider, authValue);
		resolvedModel = applyPreparedRuntimeAuthToModel(resolvedModel, preparedAuth);
	}
	const resolvedAuth = {
		...auth,
		apiKey: authValue
	};
	const profileCredential = params.profileId ? authStore?.profiles[params.profileId] : void 0;
	const sourceAuthFingerprint = params.bindAuthOwner ? profileCredential?.type === "oauth" && params.profileId ? fingerprintAuthProfileCredential({
		profileId: params.profileId,
		credential: profileCredential
	}) : fingerprintResolvedProviderAuth(auth) : void 0;
	const modelRuntime = getModelRegistryRuntime(resolved.modelRegistry);
	return {
		model: bindModelLlmRuntime(applySecretRefHeaderSentinels(applyLocalNoAuthHeaderOverride(resolvedModel, resolvedAuth), params.cfg), modelRuntime.llmRuntime),
		auth: resolvedAuth,
		...sourceAuthFingerprint ? { sourceAuthFingerprint } : {}
	};
}
async function withPreparedSimpleCompletionRuntime(params, runtimePluginSelections, run) {
	const config = params.cfg ?? {};
	const agentId = params.agentId ?? resolveDefaultAgentId(config);
	const agentDir = params.agentDir?.trim() || resolveAgentDir(config, agentId);
	const requestedWorkspaceDir = params.workspaceDir ?? params.preparedModelRuntime?.workspaceDir ?? resolveAgentWorkspaceDir(config, agentId);
	const lease = params.preparedModelRuntime ? void 0 : await acquireAgentRunPreparedModelRuntime({
		config,
		agentId,
		agentDir,
		workspaceDir: requestedWorkspaceDir,
		loadRuntimePlugins: true,
		runtimePluginSelections: runtimePluginSelections.map((selection) => ({
			...selection,
			agentId
		}))
	}, {
		catalogMode: "static",
		...params.pluginMetadataSnapshot ? { pluginMetadataSnapshot: params.pluginMetadataSnapshot } : {}
	});
	const preparedModelRuntime = params.preparedModelRuntime ?? lease.snapshot;
	const context = createPreparedSimpleCompletionResolverContext({
		preparedModelRuntime,
		workspaceDir: params.workspaceDir ?? preparedModelRuntime.workspaceDir ?? requestedWorkspaceDir,
		modelResolver: params.modelResolver,
		agentRuntimeId: params.agentRuntimeId
	});
	try {
		return await withPluginRuntimeGenerationScope(preparedModelRuntime, () => run(context));
	} finally {
		lease?.release();
	}
}
async function prepareSimpleCompletionModelForAgent(params) {
	const selectionParams = {
		cfg: params.cfg,
		agentId: params.agentId,
		agentDir: params.agentDir,
		modelRef: params.modelRef,
		useUtilityModel: params.useUtilityModel
	};
	const tentativeRequest = resolveSimpleCompletionSelectionRequest(selectionParams);
	if (!tentativeRequest) return { error: `No model configured for agent ${params.agentId}.` };
	const tentativeSelection = tentativeRequest.selection;
	const workspaceDir = resolveAgentWorkspaceDir(params.cfg, params.agentId);
	const pluginIdScope = createAgentRuntimeMetadataPluginIdScope({
		config: params.cfg,
		workspaceDir,
		selections: [{
			provider: tentativeSelection.runtimeProvider ?? tentativeSelection.provider,
			modelId: tentativeSelection.modelId,
			agentId: params.agentId
		}],
		...tentativeRequest.shorthandModelId ? { shorthandModelIds: [tentativeRequest.shorthandModelId] } : {}
	});
	let metadataSnapshot = resolvePluginMetadataSnapshot({
		config: params.cfg,
		env: process.env,
		workspaceDir,
		pluginIdScope,
		allowWorkspaceScopedCurrent: true
	});
	const resolveSelection = () => resolveSimpleCompletionSelectionForAgent({
		...selectionParams,
		manifestPlugins: metadataSnapshot.plugins
	});
	let selection = resolveSelection();
	if (!selection) return { error: `No model configured for agent ${params.agentId}.` };
	const canonicalPluginIdScope = createAgentRuntimeMetadataPluginIdScope({
		config: params.cfg,
		workspaceDir,
		selections: [{
			provider: selection.runtimeProvider ?? selection.provider,
			modelId: selection.modelId,
			agentId: params.agentId
		}],
		...tentativeRequest.shorthandModelId && selection.provider === tentativeSelection.provider && selection.modelId === tentativeSelection.modelId ? { shorthandModelIds: [tentativeRequest.shorthandModelId] } : {}
	});
	if (canonicalPluginIdScope.key !== pluginIdScope.key) {
		metadataSnapshot = resolvePluginMetadataSnapshot({
			config: params.cfg,
			env: process.env,
			workspaceDir,
			pluginIdScope: canonicalPluginIdScope,
			allowWorkspaceScopedCurrent: true
		});
		selection = resolveSelection();
		if (!selection) return { error: `No model configured for agent ${params.agentId}.` };
	}
	const selectedProvider = selection.runtimeProvider ?? selection.provider;
	return await withPreparedSimpleCompletionRuntime({
		...params,
		agentDir: selection.agentDir,
		pluginMetadataSnapshot: metadataSnapshot
	}, [{
		provider: selectedProvider,
		modelId: selection.modelId
	}], async (context) => {
		return {
			...await prepareSimpleCompletionModelCore({
				cfg: params.cfg,
				agentId: params.agentId,
				provider: selectedProvider,
				modelId: selection.modelId,
				agentDir: selection.agentDir,
				profileId: selection.profileId,
				preferredProfile: params.preferredProfile,
				allowMissingApiKeyModes: params.allowMissingApiKeyModes,
				...params.allowBundledStaticCatalogFallback !== void 0 ? { allowBundledStaticCatalogFallback: params.allowBundledStaticCatalogFallback } : {},
				skipAgentDiscovery: params.skipAgentDiscovery,
				bindAuthOwner: params.bindAuthOwner
			}, context),
			selection
		};
	});
}
async function completeWithPreparedSimpleCompletionModel(params) {
	const runtime = getModelLlmRuntime(params.model);
	let completionModel = prepareModelForSimpleCompletion({
		apiRegistry: runtime?.registry ?? defaultApiRegistry,
		model: params.model,
		cfg: params.cfg
	});
	if (runtime) completionModel = bindModelLlmRuntime(completionModel, runtime);
	const { reasoning: rawReasoning, ...options } = params.options ?? {};
	const reasoning = normalizeSimpleCompletionReasoning(rawReasoning, completionModel);
	return await completeSimple(completionModel, params.context, {
		...options,
		...reasoning ? { reasoning } : {},
		apiKey: params.auth.apiKey
	});
}
function normalizeSimpleCompletionReasoning(reasoning, model) {
	switch (reasoning) {
		case void 0: return;
		case "off": return resolveClaudeSonnet5ModelIdentity(model) || resolveClaudeOpus5ModelIdentity(model) ? "off" : void 0;
		case "adaptive": return "medium";
		case "ultra":
		case "max": return isOpenAIProvider(model.provider) && supportsOpenAIReasoningEffort(model, "max") ? "max" : "xhigh";
		default: return reasoning;
	}
}
//#endregion
export { resolveSimpleCompletionSelectionForAgent as i, prepareSimpleCompletionModel as n, prepareSimpleCompletionModelForAgent as r, completeWithPreparedSimpleCompletionModel as t };
