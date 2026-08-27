import { fetchRemoteEmbeddingVectors, normalizeEmbeddingModelWithPrefixes, resolveEmbeddingEndpointUrl, resolveRemoteEmbeddingBearerClient } from "openclaw/plugin-sdk/memory-core-host-engine-embeddings";
//#region extensions/voyage/embedding-provider.ts
const DEFAULT_VOYAGE_EMBEDDING_MODEL = "voyage-4-large";
const DEFAULT_VOYAGE_BASE_URL = "https://api.voyageai.com/v1";
const VOYAGE_MAX_INPUT_TOKENS = {
	"voyage-3": 32e3,
	"voyage-3-lite": 16e3,
	"voyage-code-3": 32e3
};
function normalizeVoyageModel(model) {
	return normalizeEmbeddingModelWithPrefixes({
		model,
		defaultModel: DEFAULT_VOYAGE_EMBEDDING_MODEL,
		prefixes: ["voyage/"]
	});
}
async function createVoyageEmbeddingProvider(options) {
	const client = await resolveVoyageEmbeddingClient(options);
	const url = resolveEmbeddingEndpointUrl(client.baseUrl, "embeddings");
	const embedMany = async (input, input_type, signal) => {
		if (input.length === 0) return [];
		const body = {
			model: client.model,
			input
		};
		if (input_type) body.input_type = input_type;
		return await fetchRemoteEmbeddingVectors({
			url,
			headers: client.headers,
			ssrfPolicy: client.ssrfPolicy,
			signal,
			body,
			errorPrefix: "voyage embeddings failed"
		});
	};
	return {
		provider: {
			id: "voyage",
			model: client.model,
			maxInputTokens: VOYAGE_MAX_INPUT_TOKENS[client.model],
			embed: async (input, optionsValue) => {
				const text = typeof input === "string" ? input : input.text;
				const [vec] = await embedMany([text], optionsValue?.inputType === "query" ? "query" : "document", optionsValue?.signal);
				return vec ?? [];
			},
			embedBatch: async (inputs, optionsLocal) => {
				const texts = inputs.map((input) => typeof input === "string" ? input : input.text);
				if (optionsLocal?.inputType === "query") return await Promise.all(texts.map(async (text) => {
					const [vec] = await embedMany([text], "query", optionsLocal.signal);
					return vec ?? [];
				}));
				return await embedMany(texts, "document", optionsLocal?.signal);
			}
		},
		client
	};
}
async function resolveVoyageEmbeddingClient(options) {
	const { baseUrl, headers, ssrfPolicy } = await resolveRemoteEmbeddingBearerClient({
		provider: "voyage",
		options,
		defaultBaseUrl: DEFAULT_VOYAGE_BASE_URL
	});
	return {
		baseUrl,
		headers,
		ssrfPolicy,
		model: normalizeVoyageModel(options.model)
	};
}
//#endregion
export { DEFAULT_VOYAGE_EMBEDDING_MODEL, createVoyageEmbeddingProvider };
