import { _ as hasNonTextEmbeddingParts } from "./internal-y_9W5i9a.js";
import { c as mapBatchEmbeddingsByIndex, l as sanitizeEmbeddingCacheHeaders, s as isMissingEmbeddingApiKeyError } from "./memory-core-host-engine-embeddings-vIl5eOM9.js";
import { i as isGeminiEmbedding2Model, n as buildGeminiEmbeddingRequest, r as createGeminiEmbeddingProvider, t as DEFAULT_GEMINI_EMBEDDING_MODEL } from "./embedding-provider-C_GyEgUW.js";
import { t as runGeminiEmbeddingBatches } from "./embedding-batch-CUdzJSEE.js";
//#region extensions/google/memory-embedding-adapter.ts
const geminiMemoryEmbeddingProviderAdapter = {
	id: "gemini",
	defaultModel: DEFAULT_GEMINI_EMBEDDING_MODEL,
	transport: "remote",
	authProviderId: "google",
	autoSelectPriority: 30,
	allowExplicitWhenConfiguredAuto: true,
	supportsMultimodalEmbeddings: ({ model }) => isGeminiEmbedding2Model(model),
	shouldContinueAutoSelection: isMissingEmbeddingApiKeyError,
	create: async (options) => {
		const { provider, client } = await createGeminiEmbeddingProvider({
			...options,
			provider: "gemini",
			fallback: "none"
		});
		return {
			provider,
			runtime: {
				id: "gemini",
				cacheKeyData: {
					provider: "gemini",
					baseUrl: client.baseUrl,
					model: client.model,
					outputDimensionality: client.outputDimensionality,
					headers: sanitizeEmbeddingCacheHeaders(client.headers, [
						"authorization",
						"x-goog-api-key",
						"x-goog-api-client"
					])
				},
				batchEmbed: async (batch) => {
					if (batch.chunks.some((chunk) => hasNonTextEmbeddingParts(chunk.embeddingInput))) return null;
					return mapBatchEmbeddingsByIndex(await runGeminiEmbeddingBatches({
						gemini: client,
						agentId: batch.agentId,
						requests: batch.chunks.map((chunk, index) => ({
							custom_id: String(index),
							request: buildGeminiEmbeddingRequest({
								input: chunk.embeddingInput ?? { text: chunk.text },
								model: client.model,
								role: "document",
								taskType: "RETRIEVAL_DOCUMENT",
								modelPath: client.modelPath,
								outputDimensionality: client.outputDimensionality
							})
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
export { geminiMemoryEmbeddingProviderAdapter as t };
