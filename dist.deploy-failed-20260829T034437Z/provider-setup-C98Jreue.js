import { l as normalizeOptionalString, p as normalizeStringifiedOptionalString } from "./string-coerce-CIXf7egm.js";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.js";
import { f as normalizeTrimmedStringList } from "./string-normalization-e_fvmxMf.js";
import { n as findNormalizedProviderValue, r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
import { t as createSubsystemLogger } from "./subsystem-a4KzJVZG.js";
import { i as cancelUnreadResponseBody } from "./http-body-DthsuKdw.js";
import { t as listOpenClawPluginManifestMetadata } from "./manifest-metadata-scan-CfW0PrDt.js";
import { p as parseConfiguredModelVisibilityEntries } from "./model-selection-shared-I5TmV9jL.js";
import { m as readProviderJsonResponse } from "./provider-http-errors-BXG5plR9.js";
import { b as ssrfPolicyFromHttpBaseUrlAllowedOrigin } from "./ssrf-arYIaOWE.js";
import { i as fetchWithSsrFGuard } from "./fetch-guard-D2tMUB-B.js";
import { t as runTasksWithConcurrency } from "./run-with-concurrency-B6LtW2cN.js";
import { c as isNonSecretApiKeyMarker } from "./model-auth-markers-CYmICvL9.js";
import { t as normalizeOptionalSecretInput } from "./normalize-secret-input-Df_qhWv_.js";
import { d as upsertAuthProfileWithLock } from "./profiles-B9i8Wh87.js";
import { t as applyAuthProfileConfig } from "./provider-auth-helpers-DW8KYD7F.js";
import "./provider-model-shared-QR1VEK28.js";
//#region src/agents/self-hosted-provider-defaults.ts
/**
* Conservative defaults for self-hosted providers when the model catalog
* cannot supply pricing or token limits.
*/
/** Default context window used for self-hosted provider catalog entries. */
const SELF_HOSTED_DEFAULT_CONTEXT_WINDOW = 128e3;
/** Default output-token cap used for self-hosted provider catalog entries. */
const SELF_HOSTED_DEFAULT_MAX_TOKENS = 8192;
/** Zero-cost pricing used for self-hosted provider catalog entries. */
const SELF_HOSTED_DEFAULT_COST = {
	input: 0,
	output: 0,
	cacheRead: 0,
	cacheWrite: 0
};
//#endregion
//#region src/plugins/provider-self-hosted-setup.ts
function applyProviderDefaultModel(cfg, modelRef) {
	const existingModel = cfg.agents?.defaults?.model;
	const fallbacks = existingModel && typeof existingModel === "object" && "fallbacks" in existingModel ? existingModel.fallbacks : void 0;
	return {
		...cfg,
		agents: {
			...cfg.agents,
			defaults: {
				...cfg.agents?.defaults,
				model: {
					...fallbacks ? { fallbacks } : void 0,
					primary: modelRef
				}
			}
		}
	};
}
function buildOpenAICompatibleSelfHostedProviderConfig(params) {
	const modelRef = `${params.providerId}/${params.modelId}`;
	const profileId = `${params.providerId}:default`;
	return {
		config: {
			...params.cfg,
			models: {
				...params.cfg.models,
				mode: params.cfg.models?.mode ?? "merge",
				providers: {
					...params.cfg.models?.providers,
					[params.providerId]: {
						baseUrl: params.baseUrl,
						api: "openai-completions",
						apiKey: params.providerApiKey,
						models: [{
							id: params.modelId,
							name: params.modelId,
							reasoning: params.reasoning ?? false,
							input: params.input ?? ["text"],
							cost: SELF_HOSTED_DEFAULT_COST,
							contextWindow: params.contextWindow ?? 128e3,
							maxTokens: params.maxTokens ?? 8192
						}]
					}
				}
			}
		},
		modelId: params.modelId,
		modelRef,
		profileId
	};
}
async function promptAndConfigureOpenAICompatibleSelfHostedProvider(params) {
	const baseUrlRaw = await params.prompter.text({
		message: `${params.providerLabel} base URL`,
		initialValue: params.defaultBaseUrl,
		placeholder: params.defaultBaseUrl,
		validate: (value) => value?.trim() ? void 0 : "Required"
	});
	const apiKeyRaw = await params.prompter.text({
		message: `${params.providerLabel} API key`,
		placeholder: "sk-... (or any non-empty string)",
		validate: (value) => value?.trim() ? void 0 : "Required",
		sensitive: true
	});
	const modelIdRaw = await params.prompter.text({
		message: `${params.providerLabel} model`,
		placeholder: params.modelPlaceholder,
		validate: (value) => value?.trim() ? void 0 : "Required"
	});
	const baseUrl = (baseUrlRaw ?? "").trim().replace(/\/+$/, "");
	const apiKey = normalizeStringifiedOptionalString(apiKeyRaw) ?? "";
	const modelId = normalizeStringifiedOptionalString(modelIdRaw) ?? "";
	const credential = {
		type: "api_key",
		provider: params.providerId,
		key: apiKey
	};
	const configured = buildOpenAICompatibleSelfHostedProviderConfig({
		cfg: params.cfg,
		providerId: params.providerId,
		baseUrl,
		providerApiKey: params.defaultApiKeyEnvVar,
		modelId,
		input: params.input,
		reasoning: params.reasoning,
		contextWindow: params.contextWindow,
		maxTokens: params.maxTokens
	});
	return {
		config: configured.config,
		credential,
		modelId: configured.modelId,
		modelRef: configured.modelRef,
		profileId: configured.profileId
	};
}
async function promptAndConfigureOpenAICompatibleSelfHostedProviderAuth(params) {
	const result = await promptAndConfigureOpenAICompatibleSelfHostedProvider(params);
	return {
		profiles: [{
			profileId: result.profileId,
			credential: result.credential
		}],
		configPatch: result.config,
		defaultModel: result.modelRef
	};
}
async function discoverOpenAICompatibleSelfHostedProvider(params) {
	const configuredProvider = findNormalizedProviderValue(params.ctx.config.models?.providers, params.providerId);
	const configuredBaseUrl = configuredProvider ? normalizeOptionalString(configuredProvider.baseUrl) : void 0;
	if (configuredProvider) {
		if (!parseConfiguredModelVisibilityEntries({ cfg: params.ctx.config }).providerWildcards.has(normalizeProviderId(params.providerId))) return null;
	}
	const { apiKey, discoveryApiKey } = params.ctx.resolveProviderApiKey(params.providerId);
	if (!apiKey) return null;
	return { provider: {
		...await params.buildProvider({
			apiKey: discoveryApiKey,
			...configuredBaseUrl ? { baseUrl: configuredBaseUrl } : {}
		}),
		apiKey
	} };
}
function buildMissingNonInteractiveModelIdMessage(params) {
	return [`Missing --custom-model-id for --auth-choice ${params.authChoice}.`, `Pass the ${params.providerLabel} model id to use, for example ${params.modelPlaceholder}.`].join("\n");
}
function isProviderOwnedSyntheticAuthMarker(providerId, resolved) {
	if (resolved.source !== "flag" || !isNonSecretApiKeyMarker(resolved.key, { includeEnvVarName: false })) return false;
	const normalizedProvider = normalizeProviderId(providerId);
	const matchesProvider = (provider) => normalizeProviderId(provider) === normalizedProvider;
	const normalizedValue = resolved.key.trim();
	return listOpenClawPluginManifestMetadata().some(({ origin, manifest }) => origin === "bundled" && normalizeTrimmedStringList(manifest.providers).some(matchesProvider) && normalizeTrimmedStringList(manifest.syntheticAuthRefs).some(matchesProvider) && (normalizedValue === "custom-local" || normalizeTrimmedStringList(manifest.nonSecretAuthMarkers).includes(normalizedValue)));
}
async function configureOpenAICompatibleSelfHostedProviderNonInteractive(params) {
	const baseUrl = (normalizeOptionalSecretInput(params.ctx.opts.customBaseUrl) ?? params.defaultBaseUrl).replace(/\/+$/, "");
	const modelId = normalizeOptionalSecretInput(params.ctx.opts.customModelId);
	if (!modelId) {
		params.ctx.runtime.error(buildMissingNonInteractiveModelIdMessage({
			authChoice: params.ctx.authChoice,
			providerLabel: params.providerLabel,
			modelPlaceholder: params.modelPlaceholder
		}));
		params.ctx.runtime.exit(1);
		return null;
	}
	const resolved = await params.ctx.resolveApiKey({
		provider: params.providerId,
		flagValue: normalizeOptionalSecretInput(params.ctx.opts.customApiKey),
		flagName: "--custom-api-key",
		envVar: params.defaultApiKeyEnvVar,
		envVarName: params.defaultApiKeyEnvVar
	});
	if (!resolved) return null;
	const storesCredential = !isProviderOwnedSyntheticAuthMarker(params.providerId, resolved) && resolved.source !== "profile";
	const configured = buildOpenAICompatibleSelfHostedProviderConfig({
		cfg: params.ctx.config,
		providerId: params.providerId,
		baseUrl,
		providerApiKey: params.defaultApiKeyEnvVar,
		modelId,
		input: params.input,
		reasoning: params.reasoning,
		contextWindow: params.contextWindow,
		maxTokens: params.maxTokens
	});
	if (storesCredential) {
		const credential = params.ctx.toApiKeyCredential({
			provider: params.providerId,
			resolved
		});
		if (!credential) return null;
		await upsertAuthProfileWithLock({
			profileId: configured.profileId,
			credential,
			agentDir: params.ctx.agentDir
		});
	}
	const withProfile = storesCredential ? applyAuthProfileConfig(configured.config, {
		profileId: configured.profileId,
		provider: params.providerId,
		mode: "api_key"
	}) : configured.config;
	params.ctx.runtime.log(`Default ${params.providerLabel} model: ${modelId}`);
	return applyProviderDefaultModel(withProfile, configured.modelRef);
}
//#endregion
//#region src/plugins/provider-self-hosted-discovery.ts
const log = createSubsystemLogger("plugins/self-hosted-provider-discovery");
const SELF_HOSTED_DISCOVERY_JSON_MAX_BYTES = 16 * 1024 * 1024;
const SELF_HOSTED_RUNTIME_CONTEXT_MAX_MODELS = 200;
const SELF_HOSTED_RUNTIME_CONTEXT_CONCURRENCY = 8;
function readPositiveInteger(value) {
	if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return;
	return Math.trunc(value);
}
const OPENAI_COMPAT_CONTEXT_WINDOW_FIELDS = [
	"context_length",
	"context_window",
	"context_size"
];
function readOpenAICompatibleContextWindow(model) {
	for (const field of OPENAI_COMPAT_CONTEXT_WINDOW_FIELDS) {
		const contextWindow = readPositiveInteger(model?.[field]);
		if (contextWindow !== void 0) return contextWindow;
	}
}
function buildSelfHostedDiscoveryHeaders(params) {
	const headers = {
		...params.acceptJson ? { Accept: "application/json" } : {},
		...params.headers
	};
	const hasAuthorization = Object.keys(headers).some((name) => name.trim().toLowerCase() === "authorization");
	const apiKey = normalizeOptionalString(params.apiKey);
	if (apiKey && !isNonSecretApiKeyMarker(apiKey) && !hasAuthorization) headers.Authorization = `Bearer ${apiKey}`;
	return Object.keys(headers).length > 0 ? headers : void 0;
}
async function fetchSelfHostedDiscoveryJson(params) {
	let guarded;
	try {
		guarded = await fetchWithSsrFGuard({
			url: params.url,
			init: { headers: buildSelfHostedDiscoveryHeaders(params) },
			policy: ssrfPolicyFromHttpBaseUrlAllowedOrigin(params.origin),
			timeoutMs: params.timeoutMs,
			signal: params.signal,
			auditContext: "self-hosted-provider-discovery"
		});
	} catch (error) {
		return {
			kind: "unreachable",
			error
		};
	}
	try {
		if (!params.readBody || !guarded.response.ok) return {
			kind: "response",
			ok: guarded.response.ok,
			status: guarded.response.status
		};
		try {
			return {
				kind: "response",
				ok: true,
				status: guarded.response.status,
				body: await readProviderJsonResponse(guarded.response, `${params.label} discovery`, { maxBytes: SELF_HOSTED_DISCOVERY_JSON_MAX_BYTES })
			};
		} catch (error) {
			return {
				kind: "invalid-response",
				error
			};
		}
	} finally {
		await cancelUnreadResponseBody(guarded.response);
		await guarded.release();
	}
}
function readDiscoveryRows(body) {
	const bodyRecord = asOptionalRecord(body);
	if (!Array.isArray(bodyRecord?.data)) throw new Error("model list must contain data[]");
	return bodyRecord.data.flatMap((entry) => {
		const row = asOptionalRecord(entry);
		return row ? [row] : [];
	});
}
function shouldProbeRuntimeProps(model) {
	const status = asOptionalRecord(model.status)?.value;
	return status === void 0 || status === "loaded" || status === "sleeping";
}
function resolveRuntimePropsUrl(params) {
	const url = new URL(`${params.serverBaseUrl.replace(/\/+$/, "")}/props`);
	const modelId = normalizeOptionalString(params.modelId);
	if (modelId) {
		url.searchParams.set("model", modelId);
		url.searchParams.set("autoload", "false");
	}
	return url.toString();
}
/** Guarded model-row discovery for OpenAI-compatible self-hosted servers. */
async function discoverOpenAICompatibleModelRows(params) {
	const inferenceBaseUrl = params.inferenceBaseUrl.trim().replace(/\/+$/, "");
	const inferredServerBaseUrl = inferenceBaseUrl.replace(/\/v1$/u, "");
	const serverBaseUrl = (params.serverBaseUrl ?? inferredServerBaseUrl).replace(/\/+$/, "");
	const origin = new URL(serverBaseUrl).origin;
	const timeoutMs = params.timeoutMs ?? 5e3;
	let health = "unknown";
	if (params.healthPath) {
		const path = params.healthPath;
		const healthResult = await fetchSelfHostedDiscoveryJson({
			url: `${serverBaseUrl}${path}`,
			origin,
			apiKey: params.apiKey,
			headers: params.headers,
			acceptJson: true,
			timeoutMs,
			signal: params.signal,
			readBody: false,
			label: params.label
		});
		if (healthResult.kind === "unreachable") return healthResult;
		if (healthResult.kind === "invalid-response") return {
			...healthResult,
			path
		};
		health = healthResult.status === 200 ? "ready" : healthResult.status === 503 ? "loading" : "unknown";
		if (![
			200,
			404,
			503
		].includes(healthResult.status)) return {
			kind: "http-error",
			path,
			status: healthResult.status
		};
	}
	const modelCandidates = params.modelsPathOrder === "server-first" ? [{
		path: "/models",
		url: `${serverBaseUrl}/models`
	}, {
		path: "/v1/models",
		url: `${inferenceBaseUrl}/models`
	}] : [{
		path: "/v1/models",
		url: `${inferenceBaseUrl}/models`
	}];
	let modelsPath = modelCandidates[0]?.path ?? "/v1/models";
	let modelsResult;
	for (const [index, candidate] of modelCandidates.entries()) {
		modelsPath = candidate.path;
		modelsResult = await fetchSelfHostedDiscoveryJson({
			url: candidate.url,
			origin,
			apiKey: params.apiKey,
			headers: params.headers,
			acceptJson: params.modelsPathOrder === "server-first",
			timeoutMs,
			signal: params.signal,
			readBody: true,
			label: params.label
		});
		if (modelsResult.kind !== "response" || modelsResult.status !== 404 || index === modelCandidates.length - 1) break;
	}
	if (!modelsResult || modelsResult.kind === "unreachable") return modelsResult ?? {
		kind: "unreachable",
		error: /* @__PURE__ */ new Error("missing model response")
	};
	if (modelsResult.kind === "invalid-response") return {
		...modelsResult,
		path: modelsPath
	};
	if (!modelsResult.ok) return {
		kind: "http-error",
		path: modelsPath,
		status: modelsResult.status
	};
	let models;
	try {
		models = readDiscoveryRows(modelsResult.body);
	} catch (error) {
		return {
			kind: "invalid-response",
			path: modelsPath,
			error
		};
	}
	const rows = models.map((model) => ({ model }));
	if (params.discoverRuntimeContext !== false) {
		const queryByModel = params.routerModelProps && models.some((model) => asOptionalRecord(model.status) !== void 0) || !params.routerModelProps && models.length > 1;
		const probeIndexes = models.map((model, index) => shouldProbeRuntimeProps(model) ? index : -1).filter((index) => index >= 0).slice(0, SELF_HOSTED_RUNTIME_CONTEXT_MAX_MODELS);
		const deadline = Date.now() + timeoutMs;
		const { results } = await runTasksWithConcurrency({
			limit: SELF_HOSTED_RUNTIME_CONTEXT_CONCURRENCY,
			errorMode: "stop",
			throwOnError: true,
			tasks: probeIndexes.map((index) => async () => {
				const remainingMs = deadline - Date.now();
				if (remainingMs <= 0) return;
				const model = models[index];
				const modelId = normalizeOptionalString(model?.id);
				if (!model || !modelId) return;
				const result = await fetchSelfHostedDiscoveryJson({
					url: resolveRuntimePropsUrl({
						serverBaseUrl,
						modelId: queryByModel ? modelId : void 0
					}),
					origin,
					apiKey: params.apiKey,
					headers: params.headers,
					acceptJson: params.modelsPathOrder === "server-first",
					timeoutMs: Math.min(params.propsTimeoutMs ?? timeoutMs, remainingMs),
					signal: params.signal,
					readBody: true,
					label: `${params.label} /props`
				});
				const props = result.kind === "response" && result.ok ? asOptionalRecord(result.body) : void 0;
				return props ? [index, props] : void 0;
			})
		});
		for (const result of results) if (result) rows[result[0]] = {
			model: models[result[0]],
			props: result[1]
		};
	}
	return {
		kind: "success",
		health,
		rows,
		fetchedAt: Date.now()
	};
}
async function discoverOpenAICompatibleLocalModels(params) {
	const env = params.env ?? process.env;
	if (!params.rawResult && (env.VITEST || env.NODE_ENV === "test")) return [];
	const result = await discoverOpenAICompatibleModelRows({
		inferenceBaseUrl: params.baseUrl,
		serverBaseUrl: params.serverBaseUrl,
		apiKey: params.apiKey,
		headers: params.headers,
		label: params.label,
		healthPath: params.healthPath,
		modelsPathOrder: params.modelsPathOrder,
		routerModelProps: params.routerModelProps,
		discoverRuntimeContext: params.contextWindow === void 0 && params.discoverRuntimeContext !== false,
		timeoutMs: params.timeoutMs,
		propsTimeoutMs: params.propsTimeoutMs ?? 2500,
		signal: params.signal
	});
	if (params.rawResult) return result;
	if (result.kind !== "success") {
		if (result.kind === "invalid-response") log.warn(`${params.label} discovery: malformed JSON response: ${String(result.error)}`);
		else {
			const detail = result.kind === "http-error" ? result.status : String(result.error);
			log.warn(`Failed to discover ${params.label} models: ${detail}`);
		}
		return [];
	}
	if (result.rows.length === 0) {
		log.warn(`No ${params.label} models found on local instance`);
		return [];
	}
	return result.rows.flatMap(({ model, props }) => {
		const modelId = normalizeOptionalString(model.id);
		if (!modelId) return [];
		const meta = asOptionalRecord(model.meta);
		const runtimeContextTokens = readPositiveInteger(asOptionalRecord(props?.default_generation_settings)?.n_ctx) ?? readPositiveInteger(props?.n_ctx);
		return [{
			id: modelId,
			name: modelId,
			reasoning: /r1|reasoning|think|reason/i.test(modelId),
			input: ["text"],
			cost: SELF_HOSTED_DEFAULT_COST,
			contextWindow: params.contextWindow ?? readPositiveInteger(meta?.n_ctx_train) ?? readOpenAICompatibleContextWindow(model) ?? 128e3,
			maxTokens: params.maxTokens ?? 8192,
			...runtimeContextTokens ? { contextTokens: runtimeContextTokens } : {}
		}];
	});
}
//#endregion
export { promptAndConfigureOpenAICompatibleSelfHostedProviderAuth as a, SELF_HOSTED_DEFAULT_MAX_TOKENS as c, discoverOpenAICompatibleSelfHostedProvider as i, applyProviderDefaultModel as n, SELF_HOSTED_DEFAULT_CONTEXT_WINDOW as o, configureOpenAICompatibleSelfHostedProviderNonInteractive as r, SELF_HOSTED_DEFAULT_COST as s, discoverOpenAICompatibleLocalModels as t };
