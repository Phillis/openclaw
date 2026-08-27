import { _ as hasNonTextEmbeddingParts } from "./internal-DooxwEh3.js";
import { c as isMissingEmbeddingApiKeyError, l as mapBatchEmbeddingsByIndex, u as sanitizeEmbeddingCacheHeaders } from "./memory-core-host-engine-embeddings-BI8nsdfO.js";
import { t as runGeminiEmbeddingBatches } from "./embedding-batch-DrVnnBUE.js";
import { n as buildGeminiEmbeddingRequest, r as createGeminiEmbeddingProvider, t as DEFAULT_GEMINI_EMBEDDING_MODEL } from "./embedding-provider-BUqfnSN6.js";
//#region extensions/google/memory-embedding-adapter.ts
function supportsGeminiMultimodalEmbeddings(model) {
	return model.trim().replace(/^models\//, "").replace(/^(gemini|google)\//, "") === "gemini-embedding-2-preview";
}
const geminiMemoryEmbeddingProviderAdapter = {
	id: "gemini",
	defaultModel: DEFAULT_GEMINI_EMBEDDING_MODEL,
	transport: "remote",
	authProviderId: "google",
	autoSelectPriority: 30,
	allowExplicitWhenConfiguredAuto: true,
	supportsMultimodalEmbeddings: ({ model }) => supportsGeminiMultimodalEmbeddings(model),
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
