import { l as hasConfiguredSecretInput, m as normalizeResolvedSecretInputString, s as coerceSecretRef } from "./types.secrets-Bre8L6Ts.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { m as readProviderJsonResponse } from "./provider-http-errors-BXG5plR9.js";
import { b as ssrfPolicyFromHttpBaseUrlAllowedOrigin } from "./ssrf-arYIaOWE.js";
import { r as fetchConfiguredLocalOriginWithSsrFGuard } from "./fetch-guard-Dt4YqBT2.js";
import { t as resolveConfiguredSecretInputString } from "./resolve-configured-secret-input-string-B8bcUz8d.js";
import { c as isNonSecretApiKeyMarker, s as isKnownEnvApiKeyMarker } from "./model-auth-markers-Dy2BML3M.js";
import { t as normalizeOptionalSecretInput } from "./normalize-secret-input-Df_qhWv_.js";
import { t as resolveEnvApiKey } from "./model-auth-env-C2cLUS85.js";
import "./provider-auth-Bfz7g31-.js";
import { d as normalizeProviderId } from "./provider-model-shared-CF2CrQqB.js";
import "./ssrf-runtime-CIuLn0o4.js";
import "./ssrf-runtime-internal-CAlpCQO7.js";
import "./provider-auth-runtime-DZ1L5hge.js";
import "./provider-http-gpLoOs40.js";
import "./secret-input-runtime-BSLNpSkt.js";
import { n as OLLAMA_CLOUD_BASE_URL, t as DEFAULT_OLLAMA_EMBEDDING_MODEL } from "./defaults-BiE2_Zq0.js";
import { t as readProviderBaseUrl } from "./provider-base-url-E6aWTKii.js";
import { y as resolveOllamaApiBase } from "./provider-models-DEXVpKpX.js";
import { t as normalizeOllamaWireModelId } from "./model-id-DwpudSMr.js";
import { t as readOllamaResponseErrorText } from "./request-header-redaction-B3Z3QJ6v.js";
//#region extensions/ollama/src/embedding-provider.runtime.ts
const OLLAMA_EMBED_ERROR_BODY_LIMIT_BYTES = 8 * 1024;
const QUERY_INSTRUCTION_TEMPLATES = [
	{
		prefix: "qwen3-embedding",
		template: "Instruct: Given a user query, retrieve relevant memory notes and documents\nQuery:{query}"
	},
	{
		prefix: "nomic-embed-text",
		template: "search_query: {query}"
	},
	{
		prefix: "mxbai-embed-large",
		template: "Represent this sentence for searching relevant passages: {query}"
	}
];
function sanitizeAndNormalizeEmbedding(vec, outputDimensionality) {
	const sanitized = (typeof outputDimensionality === "number" ? vec.slice(0, outputDimensionality) : vec).map((value) => {
		if (typeof value !== "number") throw new Error("Ollama embed response contains a non-number embedding value");
		return Number.isFinite(value) ? value : 0;
	});
	const magnitude = Math.sqrt(sanitized.reduce((sum, value) => sum + value * value, 0));
	if (magnitude < 1e-10) return sanitized;
	return sanitized.map((value) => value / magnitude);
}
async function withRemoteHttpResponse(params) {
	const { response, release } = await fetchConfiguredLocalOriginWithSsrFGuard({
		url: params.url,
		init: params.init,
		signal: params.signal,
		policy: params.ssrfPolicy,
		configuredLocalOriginBaseUrl: params.configuredLocalOriginBaseUrl,
		auditContext: "ollama-memory-embedding"
	});
	try {
		return await params.onResponse(response);
	} finally {
		await release();
	}
}
async function readOllamaEmbeddingJsonResponse(response) {
	const payload = await readProviderJsonResponse(response, "Ollama embed response");
	if (typeof payload !== "object" || payload === null || Array.isArray(payload)) throw new Error("Ollama embed response returned a non-object JSON payload");
	return payload;
}
function normalizeEmbeddingModel(model, providerId) {
	const trimmed = model.trim();
	if (!trimmed) return DEFAULT_OLLAMA_EMBEDDING_MODEL;
	return normalizeOllamaWireModelId(trimmed, providerId);
}
function applyQueryInstructionTemplate(model, queryText) {
	const normalizedModel = model.trim().toLowerCase().replace(/^.*\//, "");
	const match = QUERY_INSTRUCTION_TEMPLATES.find(({ prefix }) => normalizedModel.startsWith(prefix));
	return match ? match.template.replace("{query}", () => queryText) : queryText;
}
function resolveConfiguredProvider(options) {
	const providers = options.config.models?.providers;
	if (!providers) return;
	const providerId = options.provider?.trim() || "ollama";
	const direct = providers[providerId];
	if (direct) return {
		providerId,
		config: direct
	};
	const normalized = normalizeProviderId(providerId);
	for (const [candidateId, candidate] of Object.entries(providers)) if (normalizeProviderId(candidateId) === normalized) return {
		providerId: candidateId,
		config: candidate
	};
	const fallback = providers.ollama;
	return fallback ? {
		providerId: "ollama",
		config: fallback
	} : void 0;
}
function resolveMemorySecretInputString(params) {
	if (!hasConfiguredSecretInput(params.value)) return;
	return normalizeResolvedSecretInputString({
		value: params.value,
		path: params.path
	});
}
function resolveSourcedOllamaEmbeddingKey(params) {
	if (params.configString !== void 0) {
		if (params.resolvedSecretRef || !isNonSecretApiKeyMarker(params.configString)) return { apiKey: params.configString };
		if (!isKnownEnvApiKeyMarker(params.configString)) return "opt-out";
		const envKey = resolveEnvApiKey("ollama")?.apiKey;
		return envKey && !isNonSecretApiKeyMarker(envKey) ? { apiKey: envKey } : "opt-out";
	}
	return params.declared ? "opt-out" : "unset";
}
async function resolveConfiguredOllamaEmbeddingSecret(params) {
	if (!coerceSecretRef(params.value, params.config.secrets?.defaults)) return normalizeOptionalSecretInput(params.value);
	const resolved = await resolveConfiguredSecretInputString({
		config: params.config,
		env: process.env,
		value: params.value,
		path: params.path,
		unresolvedReasonStyle: "detailed"
	});
	if (resolved.unresolvedRefReason) throw new Error(resolved.unresolvedRefReason);
	return normalizeOptionalSecretInput(resolved.value);
}
async function resolveOllamaEmbeddingResolvedKeys(options, providerConfig, providerOwnsHost) {
	const remoteValue = options.remote?.apiKey;
	const remote = resolveSourcedOllamaEmbeddingKey({
		configString: resolveMemorySecretInputString({
			value: remoteValue,
			path: "memory.search.remote.apiKey"
		}),
		declared: hasConfiguredSecretInput(remoteValue)
	});
	const providerValue = providerConfig?.config.apiKey;
	let provider = "unset";
	if (remote === "unset" && providerOwnsHost && providerConfig) provider = resolveSourcedOllamaEmbeddingKey({
		configString: await resolveConfiguredOllamaEmbeddingSecret({
			config: options.config,
			value: providerValue,
			path: `models.providers.${providerConfig.providerId}.apiKey`
		}),
		declared: hasConfiguredSecretInput(providerValue),
		resolvedSecretRef: Boolean(coerceSecretRef(providerValue, options.config.secrets?.defaults))
	});
	const envKey = resolveEnvApiKey("ollama")?.apiKey;
	const env = envKey && !isNonSecretApiKeyMarker(envKey) ? envKey : void 0;
	return {
		remote,
		provider,
		env
	};
}
function resolveOllamaEmbeddingBaseUrl(params) {
	const remoteBaseUrl = params.remoteBaseUrl?.trim();
	if (remoteBaseUrl) return {
		baseUrl: resolveOllamaApiBase(remoteBaseUrl),
		origin: "remote-config"
	};
	const providerBaseUrl = readProviderBaseUrl(params.providerConfig?.config);
	if (providerBaseUrl) return {
		baseUrl: resolveOllamaApiBase(providerBaseUrl),
		origin: "provider-config"
	};
	return {
		baseUrl: resolveOllamaApiBase(void 0),
		origin: "default"
	};
}
function normalizeOllamaHostKey(baseUrl) {
	try {
		const parsed = new URL(baseUrl);
		let hostname = parsed.hostname.toLowerCase();
		if (hostname === "localhost" || hostname === "::1" || hostname === "[::1]") hostname = "127.0.0.1";
		const port = parsed.port || (parsed.protocol === "https:" ? "443" : "80");
		const path = parsed.pathname === "/" ? "" : parsed.pathname.replace(/\/$/, "");
		return `${parsed.protocol}//${hostname}:${port}${path}`;
	} catch {
		return;
	}
}
function areOllamaHostsEquivalent(a, b) {
	const aKey = normalizeOllamaHostKey(a);
	const bKey = normalizeOllamaHostKey(b);
	return aKey !== void 0 && bKey !== void 0 && aKey === bKey;
}
function isOllamaCloudBaseUrl(baseUrl) {
	return areOllamaHostsEquivalent(baseUrl, OLLAMA_CLOUD_BASE_URL);
}
function selectOllamaEmbeddingApiKey(params) {
	if (params.resolved.remote !== "unset") return typeof params.resolved.remote === "object" ? params.resolved.remote.apiKey : void 0;
	if (params.resolved.provider !== "unset" && params.providerOwnsHost) return typeof params.resolved.provider === "object" ? params.resolved.provider.apiKey : void 0;
	if (params.resolved.env && isOllamaCloudBaseUrl(params.baseUrl)) return params.resolved.env;
}
async function resolveOllamaEmbeddingClient(options) {
	const providerConfig = resolveConfiguredProvider(options);
	const { baseUrl, origin: baseUrlOrigin } = resolveOllamaEmbeddingBaseUrl({
		remoteBaseUrl: options.remote?.baseUrl,
		providerConfig
	});
	const model = normalizeEmbeddingModel(options.model, options.provider);
	const providerOwnedHost = resolveOllamaApiBase(readProviderBaseUrl(providerConfig?.config));
	const providerOwnsHost = baseUrlOrigin !== "remote-config" || areOllamaHostsEquivalent(baseUrl, providerOwnedHost);
	const remoteHeaderNames = new Set(Object.keys(options.remote?.headers ?? {}).map((headerName) => headerName.toLowerCase()));
	const headerOverrides = {};
	if (providerOwnsHost && providerConfig?.config.headers) for (const [headerName, headerValue] of Object.entries(providerConfig.config.headers)) {
		if (remoteHeaderNames.has(headerName.toLowerCase())) continue;
		const resolvedValue = await resolveConfiguredOllamaEmbeddingSecret({
			config: options.config,
			value: headerValue,
			path: `models.providers.${providerConfig.providerId}.headers.${headerName}`
		});
		if (resolvedValue) headerOverrides[headerName] = resolvedValue;
	}
	Object.assign(headerOverrides, options.remote?.headers);
	const headers = {
		"Content-Type": "application/json",
		...headerOverrides
	};
	const apiKey = Object.entries(headers).some(([name, value]) => name.toLowerCase() === "authorization" && value.trim().length > 0) ? void 0 : selectOllamaEmbeddingApiKey({
		resolved: await resolveOllamaEmbeddingResolvedKeys(options, providerConfig, providerOwnsHost),
		baseUrl,
		providerOwnsHost
	});
	if (apiKey) headers.Authorization = `Bearer ${apiKey}`;
	const localService = providerConfig?.config.localService;
	return {
		baseUrl,
		headers,
		ssrfPolicy: ssrfPolicyFromHttpBaseUrlAllowedOrigin(baseUrl),
		model,
		outputDimensionality: options.dimensions,
		...localService && baseUrlOrigin !== "remote-config" ? {
			localServiceTarget: {
				providerId: providerConfig.providerId,
				baseUrl: `${baseUrl.replace(/\/+$/, "")}/v1`,
				headers
			},
			acquireLocalService: options.acquireLocalService
		} : {}
	};
}
async function createOllamaEmbeddingProvider(options) {
	const client = await resolveOllamaEmbeddingClient(options);
	const embedUrl = `${client.baseUrl.replace(/\/$/, "")}/api/embed`;
	const embedMany = async (input, signal) => {
		const localServiceLease = client.localServiceTarget && client.acquireLocalService ? await client.acquireLocalService(client.localServiceTarget, signal) : void 0;
		let json;
		try {
			json = await withRemoteHttpResponse({
				url: embedUrl,
				ssrfPolicy: client.ssrfPolicy,
				configuredLocalOriginBaseUrl: client.baseUrl,
				signal,
				init: {
					method: "POST",
					headers: client.headers,
					body: JSON.stringify({
						model: client.model,
						input
					})
				},
				onResponse: async (response) => {
					if (!response.ok) {
						const detail = await readOllamaResponseErrorText(response, OLLAMA_EMBED_ERROR_BODY_LIMIT_BYTES, client.headers).catch(() => "unknown error");
						throw new Error(`Ollama embed HTTP ${response.status}: ${detail}`);
					}
					return await readOllamaEmbeddingJsonResponse(response);
				}
			});
		} finally {
			localServiceLease?.release();
		}
		if (!Array.isArray(json.embeddings)) throw new Error("Ollama embed response missing embeddings[]");
		const expectedCount = Array.isArray(input) ? input.length : 1;
		if (json.embeddings.length !== expectedCount) throw new Error(`Ollama embed response returned ${json.embeddings.length} embeddings for ${expectedCount} inputs`);
		return json.embeddings.map((embedding) => {
			if (!Array.isArray(embedding)) throw new Error("Ollama embed response contains a non-array embedding");
			return sanitizeAndNormalizeEmbedding(embedding, client.outputDimensionality);
		});
	};
	const embedOne = async (text, signal) => {
		const [embedding] = await embedMany(text, signal);
		if (!embedding) throw new Error("Ollama embed response returned no embedding");
		return embedding;
	};
	const embedQuery = async (text, optionsValue) => await embedOne(applyQueryInstructionTemplate(client.model, text), optionsValue?.signal);
	const provider = {
		id: "ollama",
		model: client.model,
		embed: async (input, optionsValue) => {
			const text = typeof input === "string" ? input : input.text;
			return optionsValue?.inputType === "query" ? await embedQuery(text, optionsValue) : (await embedMany([text], optionsValue?.signal))[0] ?? [];
		},
		embedBatch: async (inputs, optionsLocal) => {
			const texts = inputs.map((input) => typeof input === "string" ? input : input.text);
			if (texts.length === 0) return [];
			if (optionsLocal?.inputType === "query") return await Promise.all(texts.map((text) => embedQuery(text, optionsLocal)));
			return await embedMany(texts, optionsLocal?.signal);
		}
	};
	return {
		provider,
		client: {
			...client,
			embedBatch: async (texts) => {
				try {
					return await provider.embedBatch(texts, { inputType: "document" });
				} catch (err) {
					throw new Error(formatErrorMessage(err), { cause: err });
				}
			}
		}
	};
}
//#endregion
export { DEFAULT_OLLAMA_EMBEDDING_MODEL, createOllamaEmbeddingProvider };
