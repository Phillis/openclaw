import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import "./agent-scope-BizOtGGz.js";
import { l as resolveAgentDir } from "./agent-scope-config-BdXMWufB.js";
import { r as getRuntimeConfig } from "./io-CeQckj5v.js";
import { i as logWarn } from "./logger-DKrZPnAI.js";
import { n as createConfiguredProviderLocalServiceAcquirer } from "./provider-local-service-rVF87zTk.js";
import { t as resolveMemorySearchConfig } from "./memory-search-CFXa3Z-G.js";
import { t as getMemoryEmbeddingProvider } from "./memory-embedding-provider-runtime-BsgKV5VN.js";
import { l as getHeader, p as resolveOpenAiCompatibleHttpOperatorScopes, r as authorizeOpenAiCompatibleHttpModelOverride } from "./http-auth-utils-CM89UREd.js";
import { l as sendMissingScopeForbidden, m as watchClientDisconnect, s as sendJson } from "./http-common-BIedCt0N.js";
import { c as resolveAgentIdForRequest, o as isOpenClawAgentModelId, r as isAgentSelectionRequiredError, s as isUnknownGatewayAgentError } from "./http-utils-km1Cg96X.js";
import { t as handleGatewayPostJsonEndpoint } from "./http-endpoint-helpers-CsZuPF76.js";
import { Buffer } from "node:buffer";
//#region src/gateway/embeddings-http.ts
const DEFAULT_EMBEDDINGS_BODY_BYTES = 5 * 1024 * 1024;
const MAX_EMBEDDING_INPUTS = 128;
const MAX_EMBEDDING_INPUT_CHARS = 8192;
const MAX_EMBEDDING_TOTAL_CHARS = 65536;
const DEFAULT_MEMORY_EMBEDDING_PROVIDER = "openai";
const EMBEDDING_PROVIDER_RETIREMENTS = /* @__PURE__ */ new Map();
const EMBEDDING_PROVIDER_ADMISSION_TAILS = /* @__PURE__ */ new Map();
async function acquireEmbeddingProviderLease(scopeKey, signal, create, holdForCleanup) {
	const previous = EMBEDDING_PROVIDER_ADMISSION_TAILS.get(scopeKey) ?? Promise.resolve();
	const createLease = async () => {
		signal.throwIfAborted();
		await drainEmbeddingProviderRetirements(scopeKey);
		signal.throwIfAborted();
		const provider = await create();
		if (signal.aborted) {
			await closeEmbeddingProvider(scopeKey, provider);
			signal.throwIfAborted();
		}
		if (!holdForCleanup(provider)) return {
			provider,
			lifecycle: Promise.resolve(),
			release: () => {}
		};
		let release = () => {};
		return {
			provider,
			lifecycle: new Promise((resolve) => {
				release = resolve;
			}),
			release
		};
	};
	const acquired = previous.then(createLease, createLease);
	const tail = acquired.then(async ({ lifecycle }) => await lifecycle).then(() => void 0, () => void 0);
	EMBEDDING_PROVIDER_ADMISSION_TAILS.set(scopeKey, tail);
	tail.then(() => {
		if (EMBEDDING_PROVIDER_ADMISSION_TAILS.get(scopeKey) === tail) EMBEDDING_PROVIDER_ADMISSION_TAILS.delete(scopeKey);
	});
	const { provider, release } = await acquired;
	return {
		provider,
		release
	};
}
async function drainEmbeddingProviderRetirements(scopeKey) {
	const pending = EMBEDDING_PROVIDER_RETIREMENTS.get(scopeKey);
	if (!pending || pending.size === 0) return;
	let firstError;
	let closeFailed = false;
	for (const provider of pending) try {
		await provider.close?.();
		pending.delete(provider);
	} catch (err) {
		if (!closeFailed) firstError = err;
		closeFailed = true;
	}
	if (pending.size === 0) EMBEDDING_PROVIDER_RETIREMENTS.delete(scopeKey);
	if (closeFailed) throw firstError;
}
function retainEmbeddingProviderForRetirement(scopeKey, provider) {
	const pending = EMBEDDING_PROVIDER_RETIREMENTS.get(scopeKey) ?? /* @__PURE__ */ new Set();
	pending.add(provider);
	EMBEDDING_PROVIDER_RETIREMENTS.set(scopeKey, pending);
}
async function closeEmbeddingProvider(scopeKey, provider) {
	try {
		await provider.close?.();
	} catch (closeErr) {
		retainEmbeddingProviderForRetirement(scopeKey, provider);
		logWarn(`openai-compat: failed to close embeddings provider: ${formatErrorMessage(closeErr)}`);
	}
}
async function drainRetainedOpenAiEmbeddingProviders() {
	const activeLifecycles = Array.from(EMBEDDING_PROVIDER_ADMISSION_TAILS.values());
	if (activeLifecycles.length > 0) await Promise.allSettled(activeLifecycles);
	let firstError;
	let closeFailed = false;
	for (const scopeKey of Array.from(EMBEDDING_PROVIDER_RETIREMENTS.keys())) try {
		await drainEmbeddingProviderRetirements(scopeKey);
	} catch (err) {
		if (!closeFailed) firstError = err;
		closeFailed = true;
	}
	if (closeFailed) throw firstError;
}
function coerceRequest(value) {
	return value && typeof value === "object" ? value : {};
}
function resolveInputTexts(input) {
	if (typeof input === "string") return [input];
	if (!Array.isArray(input)) return null;
	if (input.every((entry) => typeof entry === "string")) return input;
	return null;
}
function encodeEmbeddingBase64(embedding) {
	const float32 = Float32Array.from(embedding);
	return Buffer.from(float32.buffer).toString("base64");
}
function validateInputTexts(texts) {
	if (texts.length === 0 || texts.some((text) => text.length === 0)) return "`input` must contain at least one non-empty string.";
	if (texts.length > MAX_EMBEDDING_INPUTS) return `Too many inputs (max ${MAX_EMBEDDING_INPUTS}).`;
	let totalChars = 0;
	for (const text of texts) {
		if (text.length > MAX_EMBEDDING_INPUT_CHARS) return `Input too long (max ${MAX_EMBEDDING_INPUT_CHARS} chars).`;
		totalChars += text.length;
		if (totalChars > MAX_EMBEDDING_TOTAL_CHARS) return `Total input too large (max ${MAX_EMBEDDING_TOTAL_CHARS} chars).`;
	}
}
function resolveEmbeddingProviderRemoteConfig(remote) {
	return remote ? {
		baseUrl: remote.baseUrl,
		apiKey: remote.apiKey,
		headers: remote.headers
	} : void 0;
}
function isLocalEmbeddingProvider(params) {
	return getMemoryEmbeddingProvider(params.provider === "auto" ? DEFAULT_MEMORY_EMBEDDING_PROVIDER : params.provider, params.cfg)?.transport === "local";
}
async function createConfiguredEmbeddingProvider(params) {
	const acquireLocalService = createConfiguredProviderLocalServiceAcquirer(() => params.cfg);
	const providerId = params.provider === "auto" ? DEFAULT_MEMORY_EMBEDDING_PROVIDER : params.provider;
	const adapter = getMemoryEmbeddingProvider(providerId, params.cfg);
	if (!adapter) throw new Error(`Unknown memory embedding provider: ${providerId}`);
	const createOptions = {
		config: params.cfg,
		agentDir: params.agentDir,
		provider: providerId,
		model: params.model || adapter.defaultModel || "",
		local: params.memorySearch?.local,
		remote: resolveEmbeddingProviderRemoteConfig(params.memorySearch?.remote),
		inputType: params.memorySearch?.inputType,
		queryInputType: params.memorySearch?.queryInputType,
		documentInputType: params.memorySearch?.documentInputType,
		outputDimensionality: params.memorySearch?.outputDimensionality,
		acquireLocalService
	};
	const { provider } = await adapter.create(createOptions);
	if (!provider) throw new Error(`Memory embedding provider ${providerId} is unavailable.`);
	return provider;
}
function resolveEmbeddingsTarget(params) {
	const configuredProvider = params.configuredProvider === "auto" ? DEFAULT_MEMORY_EMBEDDING_PROVIDER : params.configuredProvider;
	const raw = params.requestModel.trim();
	const slash = raw.indexOf("/");
	if (slash === -1) return {
		provider: configuredProvider,
		model: raw
	};
	const provider = normalizeLowercaseStringOrEmpty(raw.slice(0, slash));
	const model = raw.slice(slash + 1).trim();
	if (!model) return { errorMessage: "Unsupported embedding model reference." };
	if (provider !== configuredProvider) return { errorMessage: "This agent does not allow that embedding provider on `/v1/embeddings`." };
	return {
		provider: configuredProvider,
		model
	};
}
/** Handles OpenAI-compatible embeddings requests for the configured agent memory provider. */
async function handleOpenAiEmbeddingsHttpRequest(req, res, opts) {
	const handled = await handleGatewayPostJsonEndpoint(req, res, {
		pathname: "/v1/embeddings",
		requiredOperatorMethod: "chat.send",
		resolveOperatorScopes: resolveOpenAiCompatibleHttpOperatorScopes,
		auth: opts.auth,
		trustedProxies: opts.trustedProxies,
		allowRealIpFallback: opts.allowRealIpFallback,
		rateLimiter: opts.rateLimiter,
		maxBodyBytes: opts.maxBodyBytes ?? DEFAULT_EMBEDDINGS_BODY_BYTES
	});
	if (handled === false) return false;
	if (!handled) return true;
	const modelOverrideAuth = authorizeOpenAiCompatibleHttpModelOverride(req, handled.requestAuth);
	if (!modelOverrideAuth.allowed) {
		sendMissingScopeForbidden(res, modelOverrideAuth.missingScope);
		return true;
	}
	const payload = coerceRequest(handled.body);
	const requestModel = normalizeOptionalString(payload.model) ?? "";
	if (!requestModel) {
		sendJson(res, 400, { error: {
			message: "Missing `model`.",
			type: "invalid_request_error"
		} });
		return true;
	}
	const cfg = getRuntimeConfig();
	if (!isOpenClawAgentModelId(requestModel)) {
		sendJson(res, 400, { error: {
			message: "Invalid `model`. Use `openclaw` or `openclaw/<agentId>`.",
			type: "invalid_request_error"
		} });
		return true;
	}
	const texts = resolveInputTexts(payload.input);
	if (!texts) {
		sendJson(res, 400, { error: {
			message: "`input` must be a string or an array of strings.",
			type: "invalid_request_error"
		} });
		return true;
	}
	const inputError = validateInputTexts(texts);
	if (inputError) {
		sendJson(res, 400, { error: {
			message: inputError,
			type: "invalid_request_error"
		} });
		return true;
	}
	let agentId;
	try {
		agentId = resolveAgentIdForRequest({
			req,
			model: requestModel
		});
	} catch (err) {
		if (isAgentSelectionRequiredError(err) || isUnknownGatewayAgentError(err)) {
			sendJson(res, 400, { error: {
				message: err.message,
				type: "invalid_request_error"
			} });
			return true;
		}
		throw err;
	}
	const agentDir = resolveAgentDir(cfg, agentId);
	const memorySearch = resolveMemorySearchConfig(cfg, agentId);
	const configuredProvider = memorySearch?.provider ?? "openai";
	const target = resolveEmbeddingsTarget({
		requestModel: normalizeOptionalString(getHeader(req, "x-openclaw-model")) || normalizeOptionalString(memorySearch?.model) || "",
		configuredProvider
	});
	if ("errorMessage" in target) {
		sendJson(res, 400, { error: {
			message: target.errorMessage,
			type: "invalid_request_error"
		} });
		return true;
	}
	const providerScopeKey = JSON.stringify([agentId, target.provider]);
	const requestedProviderNeedsCleanup = isLocalEmbeddingProvider({
		cfg,
		provider: target.provider
	});
	if (req.socket.destroyed || res.destroyed || res.socket?.destroyed) return true;
	const abortController = new AbortController();
	const stopWatchingDisconnect = watchClientDisconnect(req, res, abortController);
	try {
		const { provider, release } = await acquireEmbeddingProviderLease(providerScopeKey, abortController.signal, async () => await createConfiguredEmbeddingProvider({
			cfg,
			agentDir,
			provider: target.provider,
			model: target.model,
			memorySearch: memorySearch ? {
				...memorySearch,
				outputDimensionality: typeof payload.dimensions === "number" && payload.dimensions > 0 ? Math.floor(payload.dimensions) : memorySearch.outputDimensionality
			} : void 0
		}), (createdProvider) => requestedProviderNeedsCleanup || isLocalEmbeddingProvider({
			cfg,
			provider: createdProvider.id
		}));
		try {
			const embeddings = await provider.embedBatch(texts, { signal: abortController.signal });
			if (abortController.signal.aborted) return true;
			const encodingFormat = payload.encoding_format === "base64" ? "base64" : "float";
			sendJson(res, 200, {
				object: "list",
				data: embeddings.map((embedding, index) => ({
					object: "embedding",
					index,
					embedding: encodingFormat === "base64" ? encodeEmbeddingBase64(embedding) : embedding
				})),
				model: requestModel,
				usage: {
					prompt_tokens: 0,
					total_tokens: 0
				}
			});
		} finally {
			try {
				await closeEmbeddingProvider(providerScopeKey, provider);
			} finally {
				release();
			}
		}
	} catch (err) {
		if (!abortController.signal.aborted) {
			logWarn(`openai-compat: embeddings request failed: ${formatErrorMessage(err)}`);
			sendJson(res, 500, { error: {
				message: "internal error",
				type: "api_error"
			} });
		}
	} finally {
		stopWatchingDisconnect();
	}
	return true;
}
//#endregion
export { drainRetainedOpenAiEmbeddingProviders, handleOpenAiEmbeddingsHttpRequest };
