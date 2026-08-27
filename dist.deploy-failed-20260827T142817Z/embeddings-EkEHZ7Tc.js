import { r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
import { i as toErrorObject } from "./error-coercion-DisD0JTb.js";
import { F as resolveTimerTimeoutMs } from "./number-coercion-oCkfUEEq.js";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { r as ensureGlobalUndiciEnvProxyDispatcher } from "./undici-global-dispatcher-BQQC_-bK.js";
import { t as canonicalizeBase64 } from "./base64-KcXAb-1x.js";
import "./error-runtime-CmlvK1A3.js";
import "./runtime-env-COkbgBI4.js";
import "./number-runtime-CoAPZzJY.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import "./routing-DG_rmd7A.js";
import "./media-runtime-BdAMhkEx.js";
import "./global-singleton-lspSlNkM.js";
import { resolve } from "node:path";
import { Buffer } from "node:buffer";
//#region extensions/memory-lancedb/embeddings.ts
const loadOpenAiModule = createLazyRuntimeModule(() => import("openai"));
const loadMemoryEmbeddingProviderModule = createLazyRuntimeModule(() => import("./plugin-sdk/memory-core-host-engine-embeddings.js"));
const PROVIDER_ADAPTER_LIFECYCLE = resolveGlobalSingleton(Symbol.for("openclaw.memoryLanceDbEmbeddingProviderLifecycle.v1"), () => ({
	retainedProviders: /* @__PURE__ */ new Set(),
	tail: Promise.resolve()
}));
function runProviderAdapterLifecycle(operation) {
	const result = PROVIDER_ADAPTER_LIFECYCLE.tail.then(operation, operation);
	PROVIDER_ADAPTER_LIFECYCLE.tail = result.then(() => void 0, () => void 0);
	return result;
}
async function drainRetainedProviders() {
	let firstError;
	let closeFailed = false;
	for (const provider of PROVIDER_ADAPTER_LIFECYCLE.retainedProviders) try {
		await provider.close?.();
		PROVIDER_ADAPTER_LIFECYCLE.retainedProviders.delete(provider);
	} catch (err) {
		if (!closeFailed) firstError = err;
		closeFailed = true;
	}
	if (closeFailed) throw toErrorObject(firstError, "memory-lancedb embedding provider retirement failed");
}
var OpenAiCompatibleEmbeddings = class {
	constructor(apiKey, model, baseUrl, dimensions) {
		this.model = model;
		this.dimensions = dimensions;
		this.clientPromise = loadOpenAiModule().then(({ default: OpenAI }) => new OpenAI({
			apiKey,
			baseURL: baseUrl
		}));
	}
	async embed(_agentId, text, options) {
		const dimensions = this.dimensions;
		const startedAtMs = options?.timeoutMs && Number.isFinite(options.timeoutMs) ? Date.now() : null;
		try {
			return normalizeEmbeddingVector((await this.postEmbedding(text, {
				includeDimensions: true,
				options
			})).data?.[0]?.embedding);
		} catch (error) {
			if (typeof dimensions !== "number" || !isEmbeddingDimensionsRejectedError(error)) throw error;
		}
		const fallbackOptions = startedAtMs === null || options?.timeoutMs === void 0 ? options : { timeoutMs: Math.max(1, options.timeoutMs - (Date.now() - startedAtMs)) };
		return truncateEmbeddingVector(normalizeEmbeddingVector((await this.postEmbedding(text, {
			includeDimensions: false,
			options: fallbackOptions
		})).data?.[0]?.embedding), dimensions, this.model);
	}
	async postEmbedding(text, request) {
		const params = {
			model: this.model,
			input: text,
			...request.includeDimensions && typeof this.dimensions === "number" ? { dimensions: this.dimensions } : {}
		};
		ensureGlobalUndiciEnvProxyDispatcher();
		return await (await this.clientPromise).post("/embeddings", {
			body: params,
			...request.options?.timeoutMs ? {
				timeout: request.options.timeoutMs,
				maxRetries: 0
			} : {}
		});
	}
};
function isEmbeddingDimensionsRejectedError(error) {
	const record = asOptionalRecord(error);
	if (record?.status !== 400 && record?.status !== 422) return false;
	const details = stringifyEmbeddingApiError(error).toLowerCase();
	return /\bdimensions\b/.test(details) && isUnsupportedEmbeddingFieldError(details);
}
function isUnsupportedEmbeddingFieldError(details) {
	if (/\b(?:parameter|field|argument)[_ -]value\b/.test(details)) return false;
	return /\bextra[_ -]forbidden\b/.test(details) || /\bextra inputs? (?:are )?not permitted\b/.test(details) || /\bextra fields? (?:are )?not permitted\b/.test(details) || /\b(?:unknown|unrecognized|unexpected|unsupported)[_ -](?:request[_ -])?(?:parameter|field|argument)\b/.test(details);
}
function stringifyEmbeddingApiError(error) {
	const record = asOptionalRecord(error);
	const parts = error instanceof Error ? [error.message] : [];
	for (const value of [
		record?.code,
		record?.type,
		record?.param,
		record?.error
	]) {
		if (typeof value === "string" || typeof value === "number") {
			parts.push(String(value));
			continue;
		}
		if (value && typeof value === "object") try {
			parts.push(JSON.stringify(value));
		} catch {}
	}
	return parts.join("\n");
}
function truncateEmbeddingVector(embedding, dimensions, model) {
	if (embedding.length < dimensions) throw new Error(`Embedding model ${model} returned ${embedding.length} dimensions, need at least ${dimensions} for local truncation`);
	const truncated = embedding.slice(0, dimensions);
	const magnitude = Math.sqrt(truncated.reduce((sum, value) => sum + value * value, 0));
	return magnitude > 0 ? truncated.map((value) => value / magnitude) : truncated;
}
var ProviderAdapterEmbeddings = class {
	constructor(api, embedding) {
		this.api = api;
		this.embedding = embedding;
		this.providers = /* @__PURE__ */ new Map();
		this.closePromise = null;
		this.closed = false;
		this.activeUses = 0;
		this.idleWaiters = /* @__PURE__ */ new Set();
	}
	getProvider(agentId) {
		const config = this.api.runtime.config?.current?.() ?? this.api.config;
		const agentDir = this.api.runtime.agent.resolveAgentDir(config, agentId);
		const existing = this.providers.get(agentId);
		if (existing?.config === config && existing.agentDir === agentDir) return existing;
		if (existing) {
			this.providers.delete(agentId);
			this.retireProvider(existing);
		}
		const entry = {
			config,
			agentDir,
			promise: this.createProvider(config, agentDir).catch((err) => {
				if (this.providers.get(agentId) === entry) this.providers.delete(agentId);
				throw err;
			}),
			activeUses: 0,
			idleWaiters: /* @__PURE__ */ new Set()
		};
		this.providers.set(agentId, entry);
		return entry;
	}
	retireProvider(entry) {
		runProviderAdapterLifecycle(async () => {
			if (entry.activeUses > 0) await new Promise((resolve) => {
				entry.idleWaiters.add(resolve);
			});
			const provider = await entry.promise.catch(() => null);
			if (provider) PROVIDER_ADAPTER_LIFECYCLE.retainedProviders.add(provider);
			await drainRetainedProviders();
		}).catch(() => void 0);
	}
	invalidateProvidersForAuthMutation(event) {
		const changedAgentDir = event.agentDir ? resolve(event.agentDir) : void 0;
		for (const [agentId, entry] of this.providers) {
			if (!event.affectsInheritedStores && resolve(entry.agentDir) !== changedAgentDir) continue;
			this.providers.delete(agentId);
			this.retireProvider(entry);
		}
	}
	acquireUse() {
		if (this.closed) throw new Error("memory-lancedb embeddings are closed");
		this.activeUses += 1;
		let released = false;
		return () => {
			if (released) return;
			released = true;
			this.activeUses -= 1;
			if (this.activeUses === 0) {
				const waiters = Array.from(this.idleWaiters);
				this.idleWaiters.clear();
				for (const resolve of waiters) resolve();
			}
		};
	}
	async awaitIdle() {
		if (this.activeUses === 0) return;
		await new Promise((resolve) => {
			this.idleWaiters.add(resolve);
		});
	}
	async createProvider(config, agentDir) {
		return await runProviderAdapterLifecycle(async () => {
			await drainRetainedProviders();
			return await this.createProviderAfterRetirement(config, agentDir);
		});
	}
	async createProviderAfterRetirement(config, agentDir) {
		const providerId = this.embedding.provider;
		const { getMemoryEmbeddingProvider, registerRuntimeAuthProfileStoreMutationListener } = await loadMemoryEmbeddingProviderModule();
		if (!this.closed && !this.unregisterAuthMutationListener) this.unregisterAuthMutationListener = registerRuntimeAuthProfileStoreMutationListener((event) => this.invalidateProvidersForAuthMutation(event));
		const adapter = getMemoryEmbeddingProvider(providerId, config);
		if (!adapter) throw new Error(`Unknown memory embedding provider: ${providerId}`);
		const remote = this.embedding.apiKey || this.embedding.baseUrl ? {
			...this.embedding.apiKey ? { apiKey: this.embedding.apiKey } : {},
			...this.embedding.baseUrl ? { baseUrl: this.embedding.baseUrl } : {}
		} : void 0;
		const result = await adapter.create({
			config,
			agentDir,
			provider: providerId,
			fallback: "none",
			model: this.embedding.model,
			...remote ? { remote } : {},
			...typeof this.embedding.dimensions === "number" ? { outputDimensionality: this.embedding.dimensions } : {}
		});
		if (!result.provider) throw new Error(`Memory embedding provider ${providerId} is unavailable.`);
		return result.provider;
	}
	async embed(agentId, text, options) {
		const releaseUse = this.acquireUse();
		try {
			const entry = this.getProvider(normalizeAgentId(agentId));
			entry.activeUses += 1;
			try {
				const provider = await entry.promise;
				if (!options?.timeoutMs) return await provider.embedQuery(text);
				const controller = new AbortController();
				let timer;
				try {
					timer = setTimeout(() => controller.abort(/* @__PURE__ */ new Error("memory-lancedb embedding timed out")), resolveTimerTimeoutMs(options.timeoutMs, 1));
					timer.unref?.();
					return await provider.embedQuery(text, { signal: controller.signal });
				} finally {
					if (timer) clearTimeout(timer);
				}
			} finally {
				entry.activeUses -= 1;
				if (entry.activeUses === 0) {
					const waiters = Array.from(entry.idleWaiters);
					entry.idleWaiters.clear();
					for (const resolve of waiters) resolve();
				}
			}
		} finally {
			releaseUse();
		}
	}
	async close() {
		const existingClose = this.closePromise;
		if (existingClose) {
			await existingClose;
			return;
		}
		const closeOperation = this.closeOnce();
		this.closePromise = closeOperation;
		try {
			await closeOperation;
		} catch (err) {
			if (this.closePromise === closeOperation) this.closePromise = null;
			throw err;
		}
	}
	async closeOnce() {
		this.closed = true;
		this.unregisterAuthMutationListener?.();
		this.unregisterAuthMutationListener = void 0;
		const providers = Array.from(this.providers.entries());
		await runProviderAdapterLifecycle(async () => {
			await this.awaitIdle();
			for (const [, entry] of providers) {
				const provider = await entry.promise.catch(() => null);
				if (provider) PROVIDER_ADAPTER_LIFECYCLE.retainedProviders.add(provider);
			}
			try {
				await drainRetainedProviders();
			} finally {
				for (const [agentId, entry] of providers) if (this.providers.get(agentId) === entry) this.providers.delete(agentId);
			}
		});
	}
};
async function runWithTimeout(params) {
	let timeout;
	const TIMEOUT = Symbol("timeout");
	const timeoutPromise = new Promise((resolve) => {
		timeout = setTimeout(() => resolve(TIMEOUT), resolveTimerTimeoutMs(params.timeoutMs, 1));
		timeout.unref?.();
	});
	const taskPromise = params.task();
	taskPromise.catch(() => void 0);
	try {
		const result = await Promise.race([taskPromise, timeoutPromise]);
		if (result === TIMEOUT) return { status: "timeout" };
		return {
			status: "ok",
			value: result
		};
	} finally {
		if (timeout) clearTimeout(timeout);
	}
}
function isMemoryRecallTimeoutError(error) {
	let current = error;
	for (let depth = 0; depth < 3 && current !== void 0; depth += 1) {
		const record = asOptionalRecord(current);
		const name = current instanceof Error ? current.name : typeof record?.name === "string" ? record.name : "";
		const message = current instanceof Error ? current.message : typeof record?.message === "string" ? record.message : "";
		const code = typeof record?.code === "string" ? record.code : "";
		if (name === "APIConnectionTimeoutError" || name === "TimeoutError" || code === "ETIMEDOUT" || /^UND_ERR_.*_TIMEOUT$/.test(code) || /\btimed out\b/i.test(message)) return true;
		current = record?.cause;
	}
	return false;
}
function buildMemoryRecallUnavailableResult(error) {
	return {
		content: [{
			type: "text",
			text: "Memory recall is unavailable right now."
		}],
		details: {
			count: 0,
			disabled: true,
			unavailable: true,
			error
		}
	};
}
var MemoryRecallEmbeddingError = class extends Error {
	constructor(originalError) {
		super(formatErrorMessage(originalError));
		this.originalError = originalError;
		this.name = "MemoryRecallEmbeddingError";
	}
};
const testing = {
	isEmbeddingDimensionsRejectedError,
	isMemoryRecallTimeoutError,
	runWithTimeout,
	truncateEmbeddingVector
};
function createEmbeddings(api, cfg) {
	const { provider, model, dimensions, apiKey, baseUrl } = cfg.embedding;
	if (provider === "openai" && apiKey) return new OpenAiCompatibleEmbeddings(apiKey, model, baseUrl, dimensions);
	return new ProviderAdapterEmbeddings(api, cfg.embedding);
}
function normalizeEmbeddingVector(value) {
	if (Array.isArray(value)) {
		if (!value.every((item) => typeof item === "number" && Number.isFinite(item))) throw new Error("Embedding response contains non-numeric values");
		return value;
	}
	if (typeof value === "string") {
		const canonicalEmbedding = canonicalizeBase64(value);
		if (!canonicalEmbedding) throw new Error("Base64 embedding response is malformed");
		const bytes = Buffer.from(canonicalEmbedding, "base64");
		if (bytes.byteLength % Float32Array.BYTES_PER_ELEMENT !== 0) throw new Error("Base64 embedding response has invalid byte length");
		const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
		const floats = [];
		for (let offset = 0; offset < bytes.byteLength; offset += Float32Array.BYTES_PER_ELEMENT) floats.push(view.getFloat32(offset, true));
		return floats;
	}
	throw new Error("Embedding response is missing a vector");
}
//#endregion
export { normalizeEmbeddingVector as a, isMemoryRecallTimeoutError as i, buildMemoryRecallUnavailableResult as n, runWithTimeout as o, createEmbeddings as r, testing as s, MemoryRecallEmbeddingError as t };
