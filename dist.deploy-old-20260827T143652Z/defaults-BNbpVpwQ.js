//#region extensions/ollama/src/defaults.ts
const OLLAMA_DEFAULT_BASE_URL = "http://127.0.0.1:11434";
const OLLAMA_DEFAULT_API_KEY = "ollama-local";
const OLLAMA_DOCKER_HOST_BASE_URL = "http://host.docker.internal:11434";
const OLLAMA_CLOUD_BASE_URL = "https://ollama.com";
const OLLAMA_CLOUD_PROVIDER_ID = "ollama-cloud";
const OLLAMA_GLM52_CLOUD_MODEL_ID = "glm-5.2";
const OLLAMA_CLOUD_DEFAULT_MODELS = [
	{
		id: "minimax-m2.7",
		contextWindow: 196608,
		capabilities: [
			"completion",
			"thinking",
			"tools"
		]
	},
	{
		id: "glm-5.1",
		contextWindow: 202752,
		capabilities: [
			"completion",
			"thinking",
			"tools"
		]
	},
	{
		id: OLLAMA_GLM52_CLOUD_MODEL_ID,
		contextWindow: 1e6,
		capabilities: [
			"completion",
			"thinking",
			"tools"
		]
	}
];
const OLLAMA_DEFAULT_CONTEXT_WINDOW = 128e3;
const OLLAMA_LOCAL_CONTEXT_TOKENS = 32768;
const OLLAMA_DEFAULT_MAX_TOKENS = 8192;
const OLLAMA_DEFAULT_COST = {
	input: 0,
	output: 0,
	cacheRead: 0,
	cacheWrite: 0
};
const OLLAMA_DEFAULT_MODEL = "gemma4";
const DEFAULT_OLLAMA_EMBEDDING_MODEL = "nomic-embed-text";
function resolveOllamaSetupDefaultBaseUrl(env = process.env) {
	return [
		"1",
		"true",
		"yes",
		"on"
	].includes(env.OPENCLAW_DOCKER_SETUP?.trim().toLowerCase() ?? "") ? OLLAMA_DOCKER_HOST_BASE_URL : OLLAMA_DEFAULT_BASE_URL;
}
//#endregion
export { OLLAMA_DEFAULT_API_KEY as a, OLLAMA_DEFAULT_COST as c, OLLAMA_GLM52_CLOUD_MODEL_ID as d, OLLAMA_LOCAL_CONTEXT_TOKENS as f, OLLAMA_CLOUD_PROVIDER_ID as i, OLLAMA_DEFAULT_MAX_TOKENS as l, OLLAMA_CLOUD_BASE_URL as n, OLLAMA_DEFAULT_BASE_URL as o, resolveOllamaSetupDefaultBaseUrl as p, OLLAMA_CLOUD_DEFAULT_MODELS as r, OLLAMA_DEFAULT_CONTEXT_WINDOW as s, DEFAULT_OLLAMA_EMBEDDING_MODEL as t, OLLAMA_DEFAULT_MODEL as u };
