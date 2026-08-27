import { r as createLazyRuntimeModule } from "../../lazy-runtime-CgCh8H_K.js";
import { s as coerceSecretRef } from "../../types.secrets-BrIfhxSG.js";
import { n as collectConfiguredModelRefValues } from "../../configured-model-refs-0XUAFjEF.js";
import { t as resolveConfiguredSecretInputString } from "../../resolve-configured-secret-input-string-NhsX8URR.js";
import { c as isNonSecretApiKeyMarker } from "../../model-auth-markers-B67UeNMn.js";
import { n as buildApiKeyCredential } from "../../provider-auth-helpers-BIC1B3Gn.js";
import { a as buildOpenAICompatibleReplayPolicy } from "../../provider-replay-helpers-DLWvkd1n.js";
import "../../provider-auth-DKsH0m9K.js";
import { t as createProviderApiKeyAuthMethod } from "../../provider-api-key-auth-Ca9mRZqd.js";
import { t as definePluginEntry } from "../../plugin-entry-B4wzLSpS.js";
import "../../provider-model-shared-BLo15JHd.js";
import { r as buildProviderToolCompatFamilyHooks } from "../../provider-tools-mj-Qt8cY.js";
import { r as resolvePluginConfigObject } from "../../plugin-config-runtime-D7ikroCS.js";
import "../../provider-auth-api-key-DvNmTGQp.js";
import "../../secret-input-runtime-BLGhNtWu.js";
import { a as OLLAMA_DEFAULT_API_KEY, d as OLLAMA_GLM52_CLOUD_MODEL_ID, i as OLLAMA_CLOUD_PROVIDER_ID, n as OLLAMA_CLOUD_BASE_URL, o as OLLAMA_DEFAULT_BASE_URL, p as resolveOllamaSetupDefaultBaseUrl, r as OLLAMA_CLOUD_DEFAULT_MODELS, t as DEFAULT_OLLAMA_EMBEDDING_MODEL } from "../../defaults-BNbpVpwQ.js";
import { r as resolveThinkingProfile } from "../../provider-policy-api-CQYNw8CC.js";
import { t as readProviderBaseUrl } from "../../provider-base-url-E6aWTKii.js";
import { a as capLocalOllamaModelContext, d as isOllamaCloudModel, g as resolveOllamaApiBase, i as buildOllamaProvider, l as fetchLoadedOllamaModelNames, m as queryOllamaModelShowInfo, o as capLocalOllamaProviderContext, r as buildOllamaModelDefinition, t as buildDefaultOllamaCloudModelDefinition, u as fetchOllamaModels } from "../../provider-models-BDGCABOW.js";
import { a as shouldUseSyntheticOllamaAuth, i as resolveOllamaRuntimeBaseUrl, n as isLocalOllamaBaseUrl, r as resolveOllamaDiscoveryResult, t as OLLAMA_PROVIDER_ID } from "../../discovery-shared-DM7wPsWM.js";
import { c as OLLAMA_MODELS_COMMAND, d as OLLAMA_NODE_INFERENCE_DEFAULT_PLATFORMS, f as ollamaNodeInferenceToolDefinition, l as OLLAMA_NODE_INFERENCE_CAPABILITY, s as OLLAMA_CHAT_COMMAND, u as OLLAMA_NODE_INFERENCE_COMMANDS } from "../../node-inference-contract-Cw58lmaV.js";
import { c as orderPreferredOllamaModelIds, i as findAvailableOllamaModelName } from "../../setup-model-selection-CJWNhY9k.js";
import { r as resolveConfiguredOllamaProviderConfig, t as createConfiguredOllamaCompatStreamWrapper } from "../../stream-compat-2UgG7IXK.js";
import "../../stream-contract-CaPxW4Jp.js";
import { t as createLazyOllamaWebSearchProvider } from "../../web-search-provider-registration-C3NR9Xyy.js";
import { createHash } from "node:crypto";
//#region extensions/ollama/src/node-inference-registration.ts
const loadOllamaNodeInference = createLazyRuntimeModule(() => import("../../node-inference-DFRAG4sg.js"));
function createLazyNodeHostCommand(command) {
	let runtimeCommandPromise;
	const loadRuntimeCommand = () => runtimeCommandPromise ??= loadOllamaNodeInference().then((runtime) => {
		const runtimeCommand = runtime.createOllamaNodeHostCommands().find((candidate) => candidate.command === command);
		if (!runtimeCommand) throw new Error(`Ollama node inference runtime missing ${command}`);
		return runtimeCommand;
	});
	return {
		command,
		cap: OLLAMA_NODE_INFERENCE_CAPABILITY,
		handle: async (paramsJSON, io, context) => {
			return await (await loadRuntimeCommand()).handle(paramsJSON, io, context);
		}
	};
}
function createLazyOllamaNodeHostCommands() {
	return [createLazyNodeHostCommand(OLLAMA_MODELS_COMMAND), createLazyNodeHostCommand(OLLAMA_CHAT_COMMAND)];
}
function createOllamaNodeInvokePolicy() {
	return {
		commands: [...OLLAMA_NODE_INFERENCE_COMMANDS],
		defaultPlatforms: [...OLLAMA_NODE_INFERENCE_DEFAULT_PLATFORMS],
		handle: async (ctx) => await ctx.invokeNode()
	};
}
function createLazyOllamaNodeInferenceTool(api) {
	let toolPromise;
	const loadTool = () => toolPromise ??= loadOllamaNodeInference().then((runtime) => runtime.createOllamaNodeInferenceTool(api));
	return {
		...ollamaNodeInferenceToolDefinition,
		execute: async (...args) => {
			return await (await loadTool()).execute(...args);
		}
	};
}
//#endregion
//#region extensions/ollama/src/stream-registration.ts
const loadOllamaStreamRuntime = createLazyRuntimeModule(() => import("../../stream.runtime-D6YjE2Jn.js"));
function createLazyConfiguredOllamaStreamFn(params) {
	const streamFnPromise = loadOllamaStreamRuntime().then((runtime) => runtime.createConfiguredOllamaStreamFn(params));
	return async (...args) => {
		return (await streamFnPromise)(...args);
	};
}
//#endregion
//#region extensions/ollama/index.ts
const loadOllamaSetup = createLazyRuntimeModule(() => import("../../setup.runtime-DhWQkas8.js"));
const loadOllamaEmbeddingProvider = createLazyRuntimeModule(() => import("../../embedding-provider.runtime-CXddjLHm.js"));
const loadOllamaMemoryEmbeddingProviderAdapter = createLazyRuntimeModule(async () => (await import("../../memory-embedding-adapter-CtibHC-p.js")).ollamaMemoryEmbeddingProviderAdapter);
const loadOllamaMediaUnderstandingProvider = createLazyRuntimeModule(async () => (await import("../../media-understanding-provider-CPjvWr-h.js")).ollamaMediaUnderstandingProvider);
const lazyOllamaMemoryEmbeddingProviderAdapter = {
	id: OLLAMA_PROVIDER_ID,
	defaultModel: DEFAULT_OLLAMA_EMBEDDING_MODEL,
	transport: "remote",
	authProviderId: OLLAMA_PROVIDER_ID,
	create: async (options) => await (await loadOllamaMemoryEmbeddingProviderAdapter()).create(options)
};
const lazyOllamaMediaUnderstandingProvider = {
	id: OLLAMA_PROVIDER_ID,
	capabilities: ["image"],
	describeImage: async (request) => {
		const provider = await loadOllamaMediaUnderstandingProvider();
		if (!provider.describeImage) throw new Error("Ollama media understanding provider missing describeImage");
		return await provider.describeImage(request);
	},
	describeImages: async (request) => {
		const provider = await loadOllamaMediaUnderstandingProvider();
		if (!provider.describeImages) throw new Error("Ollama media understanding provider missing describeImages");
		return await provider.describeImages(request);
	}
};
async function checkWsl2CrashLoopRiskLazily(api) {
	try {
		const { isWSL2Sync } = await import("../../plugin-sdk/runtime-env.js");
		if (!isWSL2Sync()) return;
		const { checkWsl2CrashLoopRisk } = await import("../../wsl2-crash-loop-check-m0rxzGFy.js");
		await checkWsl2CrashLoopRisk(api.logger);
	} catch {}
}
function buildNativeOllamaReplayPolicy() {
	return {
		...buildOpenAICompatibleReplayPolicy("openai-completions", { sanitizeToolCallIds: false }),
		sanitizeToolCallIds: false
	};
}
function matchesOllamaContextOverflowError(errorMessage) {
	return /\bollama\b.*(?:context length|too many tokens|context window)/i.test(errorMessage) || /\btruncating input\b.*\btoo long\b/i.test(errorMessage);
}
function classifyOllamaFailoverReason(errorMessage) {
	return errorMessage.trim() === "Ollama API stream ended without a final response" ? "server_error" : void 0;
}
const dynamicModelCache = /* @__PURE__ */ new Map();
const dynamicManagedCredentialFingerprints = /* @__PURE__ */ new WeakMap();
const OLLAMA_CLOUD_DEFAULT_MODEL_REF = `${OLLAMA_CLOUD_PROVIDER_ID}/${OLLAMA_CLOUD_DEFAULT_MODELS[0].id}`;
const OLLAMA_CONFIGURED_SHOW_CONCURRENCY = 4;
const OLLAMA_CONFIGURED_SHOW_MAX_MODELS = 8;
async function validateOllamaNonInteractive(ctx) {
	const baseUrl = resolveOllamaApiBase((typeof ctx.opts.customBaseUrl === "string" ? ctx.opts.customBaseUrl.trim() : void 0) || resolveOllamaSetupDefaultBaseUrl());
	const discovery = await fetchOllamaModels(baseUrl);
	if (!discovery.reachable) {
		ctx.runtime.error(`Ollama could not be reached at ${baseUrl}.\nDownload it at https://ollama.com/download`);
		ctx.runtime.exit(1);
		return false;
	}
	const requestedModel = typeof ctx.opts.customModelId === "string" ? ctx.opts.customModelId.trim().replace(/^ollama\//i, "") : void 0;
	const selectedModel = requestedModel || "gemma4";
	const availableModelNames = discovery.models.map((model) => model.name);
	const normalizeAvailableModelName = (modelName) => modelName.trim().toLowerCase().replace(/:latest$/, "");
	const selectedModelIsAvailable = availableModelNames.some((modelName) => normalizeAvailableModelName(modelName) === normalizeAvailableModelName(selectedModel));
	if (requestedModel && isOllamaCloudModel(requestedModel)) {
		const { checkOllamaCloudAuth } = await loadOllamaSetup();
		const cloudAuth = await checkOllamaCloudAuth(baseUrl);
		if (!cloudAuth.signedIn) {
			ctx.runtime.error(`Cloud models on this Ollama host need \`ollama signin\`.\n${cloudAuth.signinUrl ?? "Run `ollama signin` on the configured Ollama host."}`);
			ctx.runtime.exit(1);
			return false;
		}
		const showInfo = await queryOllamaModelShowInfo(baseUrl, requestedModel);
		if (typeof showInfo.contextWindow !== "number" && (showInfo.capabilities?.length ?? 0) === 0) {
			ctx.runtime.error(`Ollama model ${requestedModel} was not found at ${baseUrl}.\nAvailable models: ${availableModelNames.join(", ") || "(none)"}`);
			ctx.runtime.exit(1);
			return false;
		}
		return true;
	}
	if (availableModelNames.length === 0) {
		ctx.runtime.error(`No Ollama models are available at ${baseUrl}.\nPull a model first, then re-run setup.`);
		ctx.runtime.exit(1);
		return false;
	}
	if (!selectedModelIsAvailable) {
		ctx.runtime.error(`Ollama model ${selectedModel} was not found at ${baseUrl}.\nAvailable models: ${availableModelNames.join(", ")}`);
		ctx.runtime.exit(1);
		return false;
	}
	return true;
}
async function buildLocalOllamaProvider(configuredBaseUrl, opts) {
	return capLocalOllamaProviderContext(await buildOllamaProvider(configuredBaseUrl, opts));
}
async function resolveAppGuidedOllamaConnection(ctx) {
	if (resolvePluginConfigObject(ctx.config, "ollama")?.discovery?.enabled === false) return null;
	const existing = resolveConfiguredOllamaProviderConfig({
		config: ctx.config,
		providerId: OLLAMA_PROVIDER_ID
	});
	const accessValue = await resolveAppGuidedOllamaApiKey(ctx, existing);
	return {
		existing,
		accessValue,
		discoveryAccess: accessValue ? { apiKey: accessValue } : {},
		baseUrl: resolveOllamaApiBase(readProviderBaseUrl(existing) ?? resolveOllamaSetupDefaultBaseUrl(ctx.env))
	};
}
async function detectAppGuidedOllamaAvailability(ctx) {
	const connection = await resolveAppGuidedOllamaConnection(ctx);
	if (!connection) return false;
	return (await fetchOllamaModels(connection.baseUrl, {
		...connection.discoveryAccess,
		...ctx.signal ? { signal: ctx.signal } : {}
	})).reachable;
}
async function discoverAppGuidedOllamaModel(ctx, options) {
	const connection = await resolveAppGuidedOllamaConnection(ctx);
	if (!connection) return null;
	const requestedPrefix = `${OLLAMA_PROVIDER_ID}/`;
	const requestedModelId = options?.modelRef?.startsWith(requestedPrefix) ? options.modelRef.slice(requestedPrefix.length) : void 0;
	if (options?.modelRef && !requestedModelId) return null;
	const configuredModels = connection.existing?.models ?? [];
	const requestedConfiguredModel = requestedModelId ? configuredModels.find((candidate) => findAvailableOllamaModelName(candidate.id, [requestedModelId]) !== void 0) : void 0;
	let requestedModelIsLoaded = false;
	let availableModelNames;
	if (requestedModelId) {
		if (!requestedConfiguredModel && !isOllamaCloudModel(requestedModelId)) {
			const loaded = await fetchLoadedOllamaModelNames(connection.baseUrl, {
				...connection.discoveryAccess,
				...ctx.signal ? { signal: ctx.signal } : {}
			});
			if (!loaded.reachable || findAvailableOllamaModelName(requestedModelId, loaded.models) === void 0) return null;
			requestedModelIsLoaded = true;
		}
		availableModelNames = [requestedModelId];
	} else {
		const loaded = await fetchLoadedOllamaModelNames(connection.baseUrl, {
			...connection.discoveryAccess,
			...ctx.signal ? { signal: ctx.signal } : {}
		});
		if (!loaded.reachable || loaded.models.length === 0) return null;
		availableModelNames = loaded.models;
	}
	const provider = await buildOllamaProvider(connection.baseUrl, {
		quiet: true,
		...connection.discoveryAccess
	});
	const providerModels = provider.models ?? [];
	const requestedProviderModel = requestedModelId ? providerModels.find((candidate) => candidate.compat?.supportsTools === true && findAvailableOllamaModelName(candidate.id, [requestedModelId]) !== void 0) : void 0;
	const requestedModel = (requestedConfiguredModel || requestedModelIsLoaded) && requestedProviderModel ? requestedProviderModel : requestedConfiguredModel && requestedModelId && isOllamaCloudModel(requestedModelId) ? requestedConfiguredModel : void 0;
	const toolModels = requestedModelId ? requestedModel ? [requestedModel] : [] : providerModels.filter((candidate) => candidate.compat?.supportsTools === true && findAvailableOllamaModelName(candidate.id, availableModelNames) !== void 0);
	let model;
	const candidatesById = new Map(toolModels.map((candidate) => [candidate.id, candidate]));
	for (const candidateId of orderPreferredOllamaModelIds(candidatesById.keys())) {
		const candidate = candidatesById.get(candidateId);
		if (!candidate) continue;
		const showInfo = await queryOllamaModelShowInfo(provider.baseUrl, candidate.id, connection.accessValue ? { apiKey: connection.accessValue } : void 0);
		const contextWindow = showInfo.contextWindow ?? candidate.contextWindow;
		if (!(showInfo.capabilities?.includes("tools") ?? candidate.compat?.supportsTools === true) || contextWindow === void 0 || contextWindow < 16384) continue;
		model = capLocalOllamaModelContext({
			...candidate,
			contextWindow,
			contextTokens: contextWindow,
			compat: {
				...candidate.compat,
				supportsTools: true
			}
		});
		break;
	}
	if (!model) return null;
	const preparedProvider = capLocalOllamaProviderContext({
		...provider,
		models: providerModels.some((candidate) => candidate.id === model.id) ? providerModels.map((candidate) => candidate.id === model.id ? model : candidate) : [...providerModels, model]
	});
	const ownerValue = connection.existing?.apiKey ?? (connection.accessValue ? "OLLAMA_API_KEY" : "ollama-local");
	return {
		existing: connection.existing,
		provider: preparedProvider,
		model,
		ownerValue
	};
}
function buildDynamicManagedSecretScope(provider, baseUrl, configuredApiKey) {
	const secretRef = coerceSecretRef(configuredApiKey);
	if (!secretRef || secretRef.source === "env") return;
	return `${provider}\0${resolveOllamaApiBase(baseUrl)}\0${secretRef.source}\0${secretRef.provider}\0${secretRef.id}`;
}
function buildDynamicCacheKey(provider, baseUrl, configuredApiKey, config) {
	const secretRef = coerceSecretRef(configuredApiKey);
	const managedSecretScope = buildDynamicManagedSecretScope(provider, baseUrl, configuredApiKey);
	const apiKey = readUsableOllamaShowApiKey({
		env: process.env,
		allowAmbientEnvFallback: !isLocalOllamaBaseUrl(baseUrl),
		explicitApiKey: configuredApiKey
	});
	const managedCredentialFingerprint = managedSecretScope && config ? dynamicManagedCredentialFingerprints.get(config)?.get(managedSecretScope) : void 0;
	const credentialScope = apiKey ?? (secretRef ? `${secretRef.source}\0${secretRef.provider}\0${secretRef.id}` : "");
	const credentialFingerprint = managedCredentialFingerprint ?? createHash("sha256").update(credentialScope).digest("hex");
	return `${provider}\0${resolveOllamaApiBase(baseUrl)}\0${credentialFingerprint}`;
}
function hasOllamaDiscoverySignal(providerConfig) {
	return Boolean(process.env.OLLAMA_API_KEY?.trim()) || shouldUseSyntheticOllamaAuth(providerConfig) || Boolean(providerConfig?.apiKey);
}
function toDynamicOllamaModel(params) {
	const input = (params.model.input ?? ["text"]).filter((value) => value === "text" || value === "image");
	return {
		id: params.model.id,
		name: params.model.name ?? params.model.id,
		provider: params.provider,
		api: params.providerConfig.api ?? "ollama",
		baseUrl: readProviderBaseUrl(params.providerConfig) ?? "",
		reasoning: params.model.reasoning ?? false,
		input: input.length > 0 ? input : ["text"],
		cost: params.model.cost ?? {
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0
		},
		contextWindow: params.model.contextWindow ?? 8192,
		...params.model.contextTokens !== void 0 ? { contextTokens: params.model.contextTokens } : {},
		maxTokens: params.model.maxTokens ?? 8192,
		...params.model.compat ? { compat: params.model.compat } : {},
		...params.model.params ? { params: params.model.params } : {}
	};
}
function stripTrailingAuthProfile(raw) {
	const trimmed = raw.trim();
	const lastSlash = trimmed.lastIndexOf("/");
	let delimiter = trimmed.indexOf("@", lastSlash + 1);
	if (delimiter <= 0) return trimmed;
	const suffix = () => trimmed.slice(delimiter + 1);
	if (/^\d{8}(?:@|$)/.test(suffix())) {
		const next = trimmed.indexOf("@", delimiter + 9);
		if (next < 0) return trimmed;
		delimiter = next;
	}
	if (/^(?:i?q\d+(?:_[a-z0-9]+)*|\d+bit)(?:@|$)/i.test(suffix())) {
		const next = trimmed.indexOf("@", delimiter + 1);
		if (next < 0) return trimmed;
		delimiter = next;
	}
	const model = trimmed.slice(0, delimiter).trim();
	const profile = trimmed.slice(delimiter + 1).trim();
	return model && profile ? model : trimmed;
}
function needsOllamaCatalogMetadata(entry) {
	return !(entry.contextWindow !== void 0 || entry.contextTokens !== void 0) || entry.reasoning === void 0 || entry.input === void 0 || entry.compat === void 0;
}
function readConfiguredOllamaApiKey(value) {
	if (typeof value === "string") return value.trim() || void 0;
	if (value && typeof value === "object" && "value" in value) {
		const resolved = value.value;
		if (typeof resolved === "string") return resolved.trim() || void 0;
	}
}
function readConcreteOllamaApiKey(value) {
	if (coerceSecretRef(value)) return;
	const apiKey = readConfiguredOllamaApiKey(value);
	return apiKey && !isNonSecretApiKeyMarker(apiKey) ? apiKey : void 0;
}
async function resolveAppGuidedOllamaApiKey(ctx, provider) {
	const input = provider?.apiKey;
	if (input === void 0 || input === null) {
		const configuredBaseUrl = readProviderBaseUrl(provider);
		if (!configuredBaseUrl || isLocalOllamaBaseUrl(configuredBaseUrl)) return;
		return readConcreteOllamaApiKey(ctx.env.OLLAMA_API_KEY);
	}
	const resolved = await resolveConfiguredSecretInputString({
		config: ctx.config,
		env: ctx.env,
		value: input,
		path: `models.providers.${OLLAMA_PROVIDER_ID}.apiKey`,
		unresolvedReasonStyle: "detailed"
	});
	if (resolved.unresolvedRefReason) return;
	const value = readConfiguredOllamaApiKey(resolved.value);
	return value === "OLLAMA_API_KEY" ? readConcreteOllamaApiKey(ctx.env.OLLAMA_API_KEY) : readConcreteOllamaApiKey(value);
}
function readEnvBackedOllamaApiKey(value, env) {
	const ref = coerceSecretRef(value);
	if (ref?.source === "env") return readConcreteOllamaApiKey(env[ref.id.trim()]);
}
function isAmbientOllamaApiKeyMarker(value) {
	return value === "ollama-local" || value === "OLLAMA_API_KEY";
}
function readUsableOllamaShowApiKey(params) {
	const explicitEnvApiKey = readEnvBackedOllamaApiKey(params.explicitApiKey, params.env);
	if (explicitEnvApiKey) return explicitEnvApiKey;
	const explicitApiKey = readConcreteOllamaApiKey(params.explicitApiKey);
	if (explicitApiKey) return explicitApiKey;
	const resolvedApiKey = readConfiguredOllamaApiKey(params.resolved?.apiKey);
	const canUseResolvedDiscovery = params.allowAmbientEnvFallback || !isAmbientOllamaApiKeyMarker(resolvedApiKey);
	const discoveryApiKey = readConcreteOllamaApiKey(params.resolved?.discoveryApiKey);
	if (discoveryApiKey && canUseResolvedDiscovery) return discoveryApiKey;
	const resolvedEnvApiKey = readEnvBackedOllamaApiKey(params.resolved?.apiKey, params.env);
	if (resolvedEnvApiKey && canUseResolvedDiscovery) return resolvedEnvApiKey;
	const apiKey = readConcreteOllamaApiKey(params.resolved?.apiKey);
	if (apiKey) return apiKey;
	return params.allowAmbientEnvFallback ? readConcreteOllamaApiKey(params.env.OLLAMA_API_KEY) : void 0;
}
function collectConfiguredOllamaModelIds(params) {
	const providerPrefix = `${params.provider.toLowerCase()}/`;
	const models = /* @__PURE__ */ new Map();
	const addModelId = (modelId, api, name) => {
		const trimmed = modelId.trim();
		if (!trimmed || trimmed === "*") return;
		const trimmedName = typeof name === "string" ? name.trim() : "";
		const existing = models.get(trimmed);
		if (existing) {
			if (!existing.api && api || !existing.name && trimmedName) models.set(trimmed, {
				...existing,
				...api && !existing.api ? { api } : {},
				...trimmedName && !existing.name ? { name: trimmedName } : {}
			});
			return;
		}
		models.set(trimmed, {
			id: trimmed,
			...api ? { api } : {},
			...trimmedName ? { name: trimmedName } : {}
		});
	};
	const addRef = (raw) => {
		if (typeof raw !== "string") return;
		const trimmed = stripTrailingAuthProfile(raw);
		if (!trimmed.toLowerCase().startsWith(providerPrefix)) return;
		const modelId = trimmed.slice(providerPrefix.length).trim();
		addModelId(modelId);
	};
	for (const ref of collectConfiguredModelRefValues(params.config)) addRef(ref);
	for (const entry of params.entries ?? []) if (entry.provider.toLowerCase() === params.provider.toLowerCase() && entry.id.trim() && needsOllamaCatalogMetadata(entry)) addModelId(entry.id.trim(), entry.api, entry.name);
	return [...models.values()];
}
function buildStaticOllamaCloudProvider() {
	return {
		baseUrl: OLLAMA_CLOUD_BASE_URL,
		api: "ollama",
		models: OLLAMA_CLOUD_DEFAULT_MODELS.map(buildDefaultOllamaCloudModelDefinition)
	};
}
async function buildOllamaCloudProvider(apiKey) {
	const discovered = await buildOllamaProvider(OLLAMA_CLOUD_BASE_URL, {
		...apiKey ? { apiKey } : {},
		quiet: true
	});
	if (!discovered.models?.length) return buildStaticOllamaCloudProvider();
	if (!apiKey || discovered.models.some((model) => model.id === "glm-5.2")) return discovered;
	const showInfo = await queryOllamaModelShowInfo(OLLAMA_CLOUD_BASE_URL, OLLAMA_GLM52_CLOUD_MODEL_ID, { apiKey });
	if (typeof showInfo.contextWindow !== "number" && (showInfo.capabilities?.length ?? 0) === 0) return discovered;
	const defaultModel = OLLAMA_CLOUD_DEFAULT_MODELS.find((model) => model.id === OLLAMA_GLM52_CLOUD_MODEL_ID);
	if (!defaultModel) return discovered;
	return {
		...discovered,
		models: [...discovered.models, buildDefaultOllamaCloudModelDefinition(defaultModel)]
	};
}
async function resolveRequestedDynamicOllamaModel(params) {
	const showBaseUrl = readProviderBaseUrl(params.providerConfig) ?? "http://127.0.0.1:11434";
	const showInfo = params.showApiKey ? await queryOllamaModelShowInfo(showBaseUrl, params.modelId, { apiKey: params.showApiKey }) : await queryOllamaModelShowInfo(showBaseUrl, params.modelId);
	if (typeof showInfo.contextWindow !== "number" && (showInfo.capabilities?.length ?? 0) === 0) return;
	const definition = buildOllamaModelDefinition(params.modelId, showInfo.contextWindow, showInfo.capabilities);
	const model = params.capContextTokens ? capLocalOllamaModelContext(definition) : definition;
	return toDynamicOllamaModel({
		provider: params.provider,
		providerConfig: params.providerConfig,
		model
	});
}
async function augmentConfiguredOllamaCatalogModels(params) {
	const models = collectConfiguredOllamaModelIds({
		config: params.config,
		provider: params.provider,
		entries: params.entries
	});
	if (models.length === 0) return [];
	const configuredProvider = resolveConfiguredOllamaProviderConfig({
		config: params.config,
		providerId: params.provider
	});
	const baseUrl = readProviderBaseUrl(configuredProvider) ?? params.defaultBaseUrl;
	const isLocalBaseUrl = isLocalOllamaBaseUrl(baseUrl);
	const showApiKey = readUsableOllamaShowApiKey({
		env: params.env,
		allowAmbientEnvFallback: !isLocalBaseUrl,
		explicitApiKey: configuredProvider?.apiKey,
		resolved: params.resolveProviderApiKey?.(params.provider)
	});
	if (!isLocalBaseUrl && !showApiKey) return [];
	const providerConfig = {
		...configuredProvider,
		models: configuredProvider?.models ?? [],
		baseUrl,
		api: configuredProvider?.api ?? "ollama"
	};
	const entries = [];
	const modelsToProbe = models.slice(0, OLLAMA_CONFIGURED_SHOW_MAX_MODELS);
	for (let index = 0; index < modelsToProbe.length; index += OLLAMA_CONFIGURED_SHOW_CONCURRENCY) {
		const batch = modelsToProbe.slice(index, index + OLLAMA_CONFIGURED_SHOW_CONCURRENCY);
		const rows = await Promise.all(batch.map(async (model) => {
			const requested = await resolveRequestedDynamicOllamaModel({
				provider: params.provider,
				providerConfig,
				modelId: model.id,
				showApiKey,
				capContextTokens: params.capContextTokens
			});
			return requested ? {
				id: requested.id,
				name: model.name ?? requested.name,
				provider: requested.provider,
				api: model.api ?? providerConfig.api,
				reasoning: requested.reasoning,
				input: requested.input,
				contextWindow: requested.contextWindow,
				contextTokens: requested.contextTokens,
				compat: requested.compat
			} : void 0;
		}));
		for (const row of rows) if (row) entries.push(row);
	}
	return entries;
}
const OLLAMA_SHARED_PROVIDER_HOOKS = {
	...buildProviderToolCompatFamilyHooks("llamacpp-gbnf"),
	createStreamFn: ({ config, model, provider }) => {
		if (model.api !== "ollama") return;
		return createLazyConfiguredOllamaStreamFn({
			model,
			providerBaseUrl: readProviderBaseUrl(resolveConfiguredOllamaProviderConfig({
				config,
				providerId: provider
			})) ?? (provider === "ollama-cloud" ? "https://ollama.com" : void 0)
		});
	},
	buildReplayPolicy: ({ modelApi }) => modelApi === "ollama" ? buildNativeOllamaReplayPolicy() : buildOpenAICompatibleReplayPolicy(modelApi),
	resolveReasoningOutputMode: () => "native",
	resolveThinkingProfile,
	wrapStreamFn: createConfiguredOllamaCompatStreamWrapper,
	matchesContextOverflowError: ({ errorMessage }) => matchesOllamaContextOverflowError(errorMessage),
	classifyFailoverReason: ({ errorMessage }) => classifyOllamaFailoverReason(errorMessage)
};
var ollama_default = definePluginEntry({
	id: "ollama",
	name: "Ollama Provider",
	description: "Bundled Ollama provider plugin",
	register(api) {
		const startupPluginConfig = api.pluginConfig ?? {};
		if (api.registrationMode === "full") checkWsl2CrashLoopRiskLazily(api);
		api.registerMemoryEmbeddingProvider(lazyOllamaMemoryEmbeddingProviderAdapter);
		api.registerMediaUnderstandingProvider(lazyOllamaMediaUnderstandingProvider);
		if (startupPluginConfig.nodeInference?.enabled !== false) for (const command of createLazyOllamaNodeHostCommands()) api.registerNodeHostCommand(command);
		api.registerNodeInvokePolicy(createOllamaNodeInvokePolicy());
		api.registerTool(createLazyOllamaNodeInferenceTool(api));
		const resolveCurrentPluginConfig = (config) => {
			const runtimePluginConfig = resolvePluginConfigObject(config, "ollama");
			if (runtimePluginConfig) return runtimePluginConfig;
			return config ? {} : startupPluginConfig;
		};
		api.registerWebSearchProvider(createLazyOllamaWebSearchProvider());
		api.registerProvider({
			id: OLLAMA_CLOUD_PROVIDER_ID,
			label: "Ollama Cloud",
			docsPath: "/providers/ollama",
			envVars: ["OLLAMA_API_KEY"],
			auth: [createProviderApiKeyAuthMethod({
				providerId: OLLAMA_CLOUD_PROVIDER_ID,
				methodId: "api-key",
				label: "Ollama Cloud API key",
				hint: "Hosted models via ollama.com",
				optionKey: "ollamaCloudApiKey",
				flagName: "--ollama-cloud-api-key",
				envVar: "OLLAMA_API_KEY",
				promptMessage: "Enter Ollama Cloud API key",
				defaultModel: OLLAMA_CLOUD_DEFAULT_MODEL_REF,
				noteTitle: "Ollama Cloud",
				noteMessage: "Manage API keys at https://ollama.com/settings/keys",
				wizard: {
					choiceId: "ollama-cloud",
					choiceLabel: "Ollama Cloud",
					choiceHint: "Hosted models via ollama.com",
					groupId: "ollama",
					groupLabel: "Ollama",
					groupHint: "Cloud and local open models"
				}
			})],
			catalog: {
				order: "simple",
				run: async (ctx) => {
					const resolvedAuth = ctx.resolveProviderApiKey(OLLAMA_CLOUD_PROVIDER_ID);
					const apiKey = resolvedAuth.apiKey ?? resolvedAuth.discoveryApiKey;
					if (!apiKey) return null;
					return { provider: {
						...await buildOllamaCloudProvider(readUsableOllamaShowApiKey({
							env: ctx.env,
							allowAmbientEnvFallback: true,
							resolved: resolvedAuth
						})),
						apiKey
					} };
				}
			},
			staticCatalog: {
				order: "simple",
				run: async () => ({ provider: buildStaticOllamaCloudProvider() })
			},
			...OLLAMA_SHARED_PROVIDER_HOOKS,
			resolveDynamicModel: ({ provider, modelId }) => {
				const cloudProvider = buildStaticOllamaCloudProvider();
				const model = cloudProvider.models?.find((entry) => entry.id === modelId);
				return model ? toDynamicOllamaModel({
					provider,
					providerConfig: cloudProvider,
					model
				}) : void 0;
			},
			augmentModelCatalog: async (ctx) => await augmentConfiguredOllamaCatalogModels({
				config: ctx.config,
				defaultBaseUrl: OLLAMA_CLOUD_BASE_URL,
				env: ctx.env,
				provider: OLLAMA_CLOUD_PROVIDER_ID,
				entries: ctx.entries,
				resolveProviderApiKey: ctx.resolveProviderApiKey
			}),
			buildUnknownModelHint: () => "Ollama Cloud requires an API key. Set OLLAMA_API_KEY or run \"openclaw onboard --auth-choice ollama-cloud\". See: https://docs.openclaw.ai/providers/ollama"
		});
		api.registerProvider({
			id: OLLAMA_PROVIDER_ID,
			label: "Ollama",
			docsPath: "/providers/ollama",
			envVars: ["OLLAMA_API_KEY"],
			auth: [{
				id: "local",
				label: "Ollama",
				hint: "Connect to an Ollama server and select a cloud or local model",
				kind: "custom",
				appGuidedSetup: {
					detectAvailability: detectAppGuidedOllamaAvailability,
					detect: async (ctx) => {
						const discovered = await discoverAppGuidedOllamaModel(ctx);
						if (!discovered) return null;
						return {
							modelRef: `${OLLAMA_PROVIDER_ID}/${discovered.model.id}`,
							detail: `${discovered.model.id} at ${discovered.provider.baseUrl}`
						};
					},
					prepare: async (ctx) => {
						const discovered = await discoverAppGuidedOllamaModel(ctx, { modelRef: ctx.modelRef });
						const prefix = `${OLLAMA_PROVIDER_ID}/`;
						if (!discovered || !ctx.modelRef.startsWith(prefix)) return null;
						if (ctx.modelRef.slice(prefix.length) !== discovered.model.id) return null;
						return {
							profiles: [],
							defaultModel: ctx.modelRef,
							configPatch: { models: {
								mode: ctx.config.models?.mode ?? "merge",
								providers: { [OLLAMA_PROVIDER_ID]: {
									...discovered.existing,
									...discovered.provider,
									...discovered.ownerValue ? { apiKey: discovered.ownerValue } : {},
									models: discovered.provider.models
								} }
							} }
						};
					}
				},
				run: async (ctx) => {
					const { promptAndConfigureOllama } = await loadOllamaSetup();
					const result = await promptAndConfigureOllama({
						cfg: ctx.config,
						env: ctx.env,
						opts: ctx.opts,
						prompter: ctx.prompter,
						...ctx.signal ? { signal: ctx.signal } : {},
						secretInputMode: ctx.secretInputMode,
						allowSecretRefPrompt: ctx.allowSecretRefPrompt
					});
					return {
						profiles: result.credential ? [{
							profileId: "ollama:default",
							credential: buildApiKeyCredential(OLLAMA_PROVIDER_ID, result.credential, void 0, result.credentialMode ? {
								secretInputMode: result.credentialMode,
								config: ctx.config
							} : void 0)
						}] : [],
						configPatch: result.config,
						...result.defaultModel ? { defaultModel: result.defaultModel } : {}
					};
				},
				validateNonInteractive: validateOllamaNonInteractive,
				runNonInteractive: async (ctx) => {
					const { configureOllamaNonInteractive } = await loadOllamaSetup();
					return await configureOllamaNonInteractive({
						nextConfig: ctx.config,
						opts: {
							customBaseUrl: ctx.opts.customBaseUrl,
							customModelId: ctx.opts.customModelId
						},
						runtime: ctx.runtime,
						agentDir: ctx.agentDir
					});
				}
			}],
			catalog: {
				order: "late",
				run: async (ctx) => await resolveOllamaDiscoveryResult({
					ctx,
					pluginConfig: resolveCurrentPluginConfig(ctx.config),
					buildProvider: buildLocalOllamaProvider
				})
			},
			wizard: {
				setup: {
					choiceId: "ollama",
					choiceLabel: "Ollama",
					choiceHint: "Connect to an Ollama server and select a cloud or local model",
					groupId: "ollama",
					groupLabel: "Ollama",
					groupHint: "Cloud and local open models",
					methodId: "local",
					modelSelection: {
						promptWhenAuthChoiceProvided: true,
						allowKeepCurrent: false
					}
				},
				modelPicker: {
					label: "Ollama (custom)",
					hint: "Detect models from a local or remote Ollama instance",
					methodId: "local"
				}
			},
			onModelSelected: async ({ config, model, prompter }) => {
				if (!model.startsWith("ollama/")) return;
				const { ensureOllamaModelPulled } = await loadOllamaSetup();
				await ensureOllamaModelPulled({
					config,
					model,
					prompter
				});
			},
			...OLLAMA_SHARED_PROVIDER_HOOKS,
			augmentModelCatalog: async (ctx) => await augmentConfiguredOllamaCatalogModels({
				config: ctx.config,
				defaultBaseUrl: OLLAMA_DEFAULT_BASE_URL,
				env: ctx.env,
				provider: OLLAMA_PROVIDER_ID,
				entries: ctx.entries,
				resolveProviderApiKey: ctx.resolveProviderApiKey,
				capContextTokens: true
			}),
			createEmbeddingProvider: async ({ config, model, provider: embeddingProvider, remote }) => {
				const { createOllamaEmbeddingProvider } = await loadOllamaEmbeddingProvider();
				const { provider, client } = await createOllamaEmbeddingProvider({
					config,
					remote,
					model: model || "nomic-embed-text",
					provider: embeddingProvider || "ollama"
				});
				return {
					...provider,
					client
				};
			},
			resolveSyntheticAuth: ({ provider, providerConfig }) => {
				if (!shouldUseSyntheticOllamaAuth(providerConfig)) return;
				return {
					apiKey: OLLAMA_DEFAULT_API_KEY,
					source: `models.providers.${provider ?? "ollama"} (synthetic local key)`,
					mode: "api-key"
				};
			},
			shouldDeferSyntheticProfileAuth: ({ resolvedApiKey }) => resolvedApiKey?.trim() === OLLAMA_DEFAULT_API_KEY,
			prepareDynamicModel: async (ctx) => {
				const providerConfig = resolveConfiguredOllamaProviderConfig({
					config: ctx.config,
					providerId: ctx.provider
				});
				if (!hasOllamaDiscoverySignal(providerConfig)) return;
				const baseUrl = readProviderBaseUrl(providerConfig);
				const managedSecretScope = buildDynamicManagedSecretScope(ctx.provider, baseUrl, providerConfig?.apiKey);
				let dynamicCacheKey = buildDynamicCacheKey(ctx.provider, baseUrl, providerConfig?.apiKey, ctx.config);
				let discoveryApiKey;
				if (providerConfig?.apiKey !== void 0 && providerConfig.apiKey !== null) {
					const resolved = await resolveConfiguredSecretInputString({
						config: ctx.config ?? {},
						env: process.env,
						value: providerConfig.apiKey,
						path: `models.providers.${ctx.provider}.apiKey`,
						unresolvedReasonStyle: "detailed"
					});
					if (resolved.unresolvedRefReason) {
						dynamicModelCache.delete(dynamicCacheKey);
						if (managedSecretScope && ctx.config) dynamicManagedCredentialFingerprints.get(ctx.config)?.delete(managedSecretScope);
						return;
					}
					const resolvedApiKey = readConfiguredOllamaApiKey(resolved.value);
					const configuredSecretRef = coerceSecretRef(providerConfig.apiKey);
					discoveryApiKey = configuredSecretRef ? resolvedApiKey : resolvedApiKey === "OLLAMA_API_KEY" ? readConcreteOllamaApiKey(process.env.OLLAMA_API_KEY) : readConcreteOllamaApiKey(resolvedApiKey);
					if (configuredSecretRef && !discoveryApiKey) {
						dynamicModelCache.delete(dynamicCacheKey);
						if (managedSecretScope && ctx.config) dynamicManagedCredentialFingerprints.get(ctx.config)?.delete(managedSecretScope);
						return;
					}
				} else if (!isLocalOllamaBaseUrl(baseUrl)) discoveryApiKey = readConcreteOllamaApiKey(process.env.OLLAMA_API_KEY);
				if (managedSecretScope && ctx.config && discoveryApiKey) {
					let fingerprints = dynamicManagedCredentialFingerprints.get(ctx.config);
					if (!fingerprints) {
						fingerprints = /* @__PURE__ */ new Map();
						dynamicManagedCredentialFingerprints.set(ctx.config, fingerprints);
					}
					const resolvedCredentialFingerprint = createHash("sha256").update(discoveryApiKey).digest("hex");
					if (fingerprints.has(managedSecretScope) && fingerprints.get(managedSecretScope) !== resolvedCredentialFingerprint) dynamicModelCache.delete(dynamicCacheKey);
					fingerprints.set(managedSecretScope, resolvedCredentialFingerprint);
					dynamicCacheKey = buildDynamicCacheKey(ctx.provider, baseUrl, providerConfig?.apiKey, ctx.config);
				}
				const provider = await buildLocalOllamaProvider(baseUrl, {
					quiet: true,
					...discoveryApiKey ? { apiKey: discoveryApiKey } : {}
				});
				const dynamicApi = providerConfig?.api ?? provider.api;
				const dynamicProvider = {
					...provider,
					baseUrl: resolveOllamaRuntimeBaseUrl({
						api: dynamicApi,
						configuredBaseUrl: baseUrl,
						discoveredBaseUrl: provider.baseUrl
					}),
					api: dynamicApi
				};
				const dynamicModels = (dynamicProvider.models ?? []).map((model) => toDynamicOllamaModel({
					provider: ctx.provider,
					providerConfig: dynamicProvider,
					model
				}));
				if (!dynamicModels.some((model) => model.id === ctx.modelId)) {
					const requestedModel = await resolveRequestedDynamicOllamaModel({
						provider: ctx.provider,
						providerConfig: dynamicProvider,
						modelId: ctx.modelId,
						showApiKey: discoveryApiKey,
						capContextTokens: true
					});
					if (requestedModel) dynamicModels.push(requestedModel);
				}
				dynamicModelCache.set(dynamicCacheKey, dynamicModels);
			},
			resolveDynamicModel: (ctx) => {
				const providerConfig = resolveConfiguredOllamaProviderConfig({
					config: ctx.config,
					providerId: ctx.provider
				});
				return dynamicModelCache.get(buildDynamicCacheKey(ctx.provider, readProviderBaseUrl(providerConfig), providerConfig?.apiKey, ctx.config))?.find((model) => model.id === ctx.modelId);
			},
			buildUnknownModelHint: () => "Ollama requires authentication to be registered as a provider. Set OLLAMA_API_KEY=\"ollama-local\" (any value works) or run \"openclaw configure\". See: https://docs.openclaw.ai/providers/ollama"
		});
	}
});
//#endregion
export { ollama_default as default };
