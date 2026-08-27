import { c as isMissingEmbeddingApiKeyError, l as mapBatchEmbeddingsByIndex, u as sanitizeEmbeddingCacheHeaders } from "./memory-core-host-engine-embeddings-BI8nsdfO.js";
import { n as runOpenAiEmbeddingBatches, t as OPENAI_BATCH_ENDPOINT } from "./embedding-batch-Dv0Rfb5O.js";
import { n as createOpenAiEmbeddingProvider, t as DEFAULT_OPENAI_EMBEDDING_MODEL } from "./embedding-provider-IremAU_-.js";
//#region extensions/openai/memory-embedding-adapter.ts
function resolveEmbeddingCacheExcludedHeaders(providerId, baseUrl) {
	const excludedHeaders = ["authorization"];
	if (providerId !== "openai") return excludedHeaders;
	try {
		if (new URL(baseUrl).hostname.toLowerCase().replace(/\.+$/, "") === "api.openai.com") excludedHeaders.push("version", "user-agent");
	} catch {}
	return excludedHeaders;
}
const openAiMemoryEmbeddingProviderAdapter = {
	id: "openai",
	defaultModel: DEFAULT_OPENAI_EMBEDDING_MODEL,
	transport: "remote",
	authProviderId: "openai",
	autoSelectPriority: 20,
	allowExplicitWhenConfiguredAuto: true,
	shouldContinueAutoSelection: isMissingEmbeddingApiKeyError,
	create: async (options) => {
		const resolvedProvider = options.provider ?? "openai";
		const { provider, client } = await createOpenAiEmbeddingProvider({
			...options,
			provider: resolvedProvider,
			fallback: "none"
		});
		return {
			provider,
			runtime: {
				id: "openai",
				sourceWideBatchEmbed: true,
				cacheKeyData: {
					provider: resolvedProvider,
					baseUrl: client.baseUrl,
					model: client.model,
					outputDimensionality: client.outputDimensionality,
					documentInputType: client.documentInputType ?? client.inputType,
					headers: sanitizeEmbeddingCacheHeaders(client.headers, resolveEmbeddingCacheExcludedHeaders(resolvedProvider, client.baseUrl))
				},
				batchEmbed: async (batch) => {
					const inputType = client.documentInputType ?? client.inputType;
					return mapBatchEmbeddingsByIndex(await runOpenAiEmbeddingBatches({
						openAi: client,
						agentId: batch.agentId,
						requests: batch.chunks.map((chunk, index) => ({
							custom_id: String(index),
							method: "POST",
							url: OPENAI_BATCH_ENDPOINT,
							body: {
								model: client.model,
								input: chunk.text,
								...typeof client.outputDimensionality === "number" ? { dimensions: client.outputDimensionality } : {},
								...inputType ? { input_type: inputType } : {}
							}
						})),
						wait: batch.wait,
						concurrency: batch.concurrency,
						pollIntervalMs: batch.pollIntervalMs,
						timeoutMs: batch.timeoutMs,
						debug: batch.debug
					}), batch.chunks.length);
				}
			}
		};
	}
};
//#endregion
export { openAiMemoryEmbeddingProviderAdapter as t };
