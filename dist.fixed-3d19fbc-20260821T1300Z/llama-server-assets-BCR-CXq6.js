import { w as resolveStateDir } from "./paths-CqeDjSA4.js";
import "./state-paths-BIUvtBLx.js";
import os from "node:os";
import path from "node:path";
//#region extensions/llama-cpp/src/defaults.ts
const LLAMA_CPP_PROVIDER_ID = "llama-cpp";
const LLAMA_CPP_PROVIDER_LABEL = "llama.cpp";
const LLAMA_CPP_LOCAL_AUTH_MARKER = "llama-cpp-local";
const LLAMA_CPP_DEFAULT_PORT = 19432;
const LLAMA_CPP_READY_TIMEOUT_MS = 3e4;
const LLAMA_CPP_IDLE_STOP_MS = 10 * 6e4;
function resolveLlamaCppSyntheticApiKey() {
	return LLAMA_CPP_LOCAL_AUTH_MARKER;
}
const DEFAULT_LLAMA_CPP_MODEL_ID = "gemma-4-e4b-it-q4_k_m";
const DEFAULT_LLAMA_CPP_MODEL_REF = `${LLAMA_CPP_PROVIDER_ID}/${DEFAULT_LLAMA_CPP_MODEL_ID}`;
const DEFAULT_LLAMA_CPP_MODEL_URI = "hf:unsloth/gemma-4-E4B-it-GGUF/gemma-4-E4B-it-Q4_K_M.gguf";
const DEFAULT_LLAMA_CPP_MODEL_REVISION = "bfc15c382204943c3a8fff0c750b94ae2364d7a3";
const DEFAULT_LLAMA_CPP_MODEL_CACHE_FILE = "hf_unsloth_gemma-4-E4B-it-GGUF_gemma-4-E4B-it-Q4_K_M.gguf";
const DEFAULT_LLAMA_CPP_MODEL_SIZE_BYTES = 4977171584;
const DEFAULT_LLAMA_CPP_MODEL_SHA256 = "85a896a047553e842f25297ee5b031d64ff30147d9c4af17b1e4b394cd1fab87";
const DEFAULT_LLAMA_CPP_CONTEXT_SIZE = 65536;
const DEFAULT_LLAMA_CPP_EMBEDDING_MODEL = "hf:ggml-org/embeddinggemma-300m-qat-q8_0-GGUF/embeddinggemma-300m-qat-Q8_0.gguf";
const DEFAULT_LLAMA_CPP_EMBEDDING_MODEL_REVISION = "66f974f8cd48cc3b9c41c516b95508e75b4bee64";
const DEFAULT_LLAMA_CPP_EMBEDDING_MODEL_ID = "embeddinggemma-300m-qat-q8_0";
const DEFAULT_LLAMA_CPP_EMBEDDING_CACHE_FILE = "hf_ggml-org_embeddinggemma-300m-qat-Q8_0.gguf";
const DEFAULT_LLAMA_CPP_EMBEDDING_MODEL_SIZE_BYTES = 328577056;
const DEFAULT_LLAMA_CPP_EMBEDDING_MODEL_SHA256 = "6fa0c02a9c302be6f977521d399b4de3a46310a4f2621ee0063747881b673f67";
const LLAMA_CPP_DEFAULT_MODEL_RAM_FLOOR_BYTES = 16 * 1024 ** 3;
function meetsLlamaCppDefaultModelRamFloor(totalmemBytes = os.totalmem()) {
	return totalmemBytes >= LLAMA_CPP_DEFAULT_MODEL_RAM_FLOOR_BYTES;
}
function resolveLlamaCppDataDir() {
	return path.join(resolveStateDir(), "tools", "llama.cpp");
}
function resolveLlamaCppModelCacheDir(provider) {
	const configured = provider?.params?.modelCacheDir;
	return typeof configured === "string" && configured.trim() ? resolveHomePath(configured.trim()) : path.join(resolveStateDir(), "models", "llama.cpp");
}
function resolveLegacyLlamaCppModelCacheDir() {
	return path.join(os.homedir(), ".node-llama-cpp", "models");
}
function resolveHomePath(value) {
	if (value === "~") return os.homedir();
	if (value.startsWith("~/")) return path.join(os.homedir(), value.slice(2));
	return value;
}
function resolveLlamaCppModelSource(model) {
	const configured = model.params?.modelPath;
	if (typeof configured === "string" && configured.trim()) return resolveHomePath(configured.trim());
	return model.id === "gemma-4-e4b-it-q4_k_m" ? DEFAULT_LLAMA_CPP_MODEL_URI : resolveHomePath(model.id);
}
function resolveCachedLlamaCppModelPath(params) {
	const source = resolveLlamaCppModelSource(params.model);
	const cacheDir = resolveLlamaCppModelCacheDir(params.provider);
	if (source === "hf:unsloth/gemma-4-E4B-it-GGUF/gemma-4-E4B-it-Q4_K_M.gguf") return path.join(cacheDir, DEFAULT_LLAMA_CPP_MODEL_CACHE_FILE);
	if (/^(?:hf:|https?:\/\/)/iu.test(source)) return null;
	return path.isAbsolute(source) ? source : path.resolve(cacheDir, source);
}
function buildDefaultLlamaCppModel() {
	return {
		id: DEFAULT_LLAMA_CPP_MODEL_ID,
		name: "Gemma 4 E4B (Q4_K_M)",
		api: "openai-completions",
		reasoning: false,
		input: ["text"],
		cost: {
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0
		},
		contextWindow: DEFAULT_LLAMA_CPP_CONTEXT_SIZE,
		contextTokens: DEFAULT_LLAMA_CPP_CONTEXT_SIZE,
		maxTokens: 2048,
		params: {
			modelPath: DEFAULT_LLAMA_CPP_MODEL_URI,
			contextSize: DEFAULT_LLAMA_CPP_CONTEXT_SIZE
		},
		compat: {
			supportsTools: true,
			supportsUsageInStreaming: true,
			toolSchemaProfile: "llamacpp"
		}
	};
}
function buildLlamaCppProviderConfig(existing, managed) {
	const defaultModel = buildDefaultLlamaCppModel();
	const configuredModels = existing?.models ?? [];
	const models = configuredModels.some((model) => model.id === defaultModel.id) ? configuredModels : [...configuredModels, defaultModel];
	return {
		...existing,
		baseUrl: managed?.baseUrl ?? existing?.baseUrl ?? `http://127.0.0.1:19432/v1`,
		apiKey: existing?.apiKey ?? resolveLlamaCppSyntheticApiKey(),
		api: "openai-completions",
		timeoutSeconds: existing?.timeoutSeconds ?? 600,
		...managed ? { localService: {
			command: managed.command,
			args: managed.args,
			healthUrl: managed.healthUrl,
			readyTimeoutMs: LLAMA_CPP_READY_TIMEOUT_MS,
			idleStopMs: LLAMA_CPP_IDLE_STOP_MS
		} } : {},
		models
	};
}
//#endregion
//#region extensions/llama-cpp/src/llama-server-assets.ts
const LLAMA_SERVER_RELEASE = "b10357";
const LLAMA_SERVER_BUILD = 10357;
const LLAMA_SERVER_COMMIT = "689e227db485c6b33d061555e74034c93a867649";
const LLAMA_SERVER_ASSETS = [
	{
		platform: "darwin",
		arch: "arm64",
		backend: "metal",
		archive: "tar.gz",
		name: `llama-${LLAMA_SERVER_RELEASE}-bin-macos-arm64.tar.gz`,
		sha256: "7f464a2d473d53ebb9c1d7d16db1258ec98c371569816491850686e6a4334c52",
		executable: "llama-server"
	},
	{
		platform: "darwin",
		arch: "x64",
		backend: "cpu",
		archive: "tar.gz",
		name: `llama-${LLAMA_SERVER_RELEASE}-bin-macos-x64.tar.gz`,
		sha256: "8282cf6b30bfab87080044e98b7b78f2896bfc60414926fae6039a89c0fb6ec2",
		executable: "llama-server"
	},
	{
		platform: "linux",
		arch: "arm64",
		backend: "cpu",
		archive: "tar.gz",
		name: `llama-${LLAMA_SERVER_RELEASE}-bin-ubuntu-arm64.tar.gz`,
		sha256: "0653b6aa14de35920824045bca7e48f98f629f41943d0fefab1e317bbe8e22a8",
		executable: "llama-server"
	},
	{
		platform: "linux",
		arch: "x64",
		backend: "cpu",
		archive: "tar.gz",
		name: `llama-${LLAMA_SERVER_RELEASE}-bin-ubuntu-x64.tar.gz`,
		sha256: "6b0ba012036e6d727521100158bfcaa73b460fbb31acab2931c9485f347bd16b",
		executable: "llama-server"
	},
	{
		platform: "win32",
		arch: "arm64",
		backend: "cpu",
		archive: "zip",
		name: `llama-${LLAMA_SERVER_RELEASE}-bin-win-cpu-arm64.zip`,
		sha256: "a0d73be8d3151d9401fa193f1b83c6d7401191b41786e75f0a60184058333e86",
		executable: "llama-server.exe"
	},
	{
		platform: "win32",
		arch: "x64",
		backend: "cpu",
		archive: "zip",
		name: `llama-${LLAMA_SERVER_RELEASE}-bin-win-cpu-x64.zip`,
		sha256: "6c64cc7db679980fcb34bbbe96b2b1df6127e90ccdad2bd6fbe39532fee2fc4e",
		executable: "llama-server.exe"
	}
];
function selectLlamaServerAsset(platform = process.platform, arch = process.arch) {
	const asset = LLAMA_SERVER_ASSETS.find((candidate) => candidate.platform === platform && candidate.arch === arch);
	if (!asset) throw new Error(`No verified llama-server ${LLAMA_SERVER_RELEASE} build is available for ${platform}/${arch}. Install a compatible llama-server manually, then rerun llama.cpp setup with its absolute path.`);
	return asset;
}
function resolveManagedLlamaServerPaths(asset = selectLlamaServerAsset()) {
	const installDir = path.join(resolveLlamaCppDataDir(), LLAMA_SERVER_RELEASE, `${asset.platform}-${asset.arch}`);
	return {
		installDir,
		command: path.join(installDir, asset.executable),
		presetPath: path.join(resolveLlamaCppDataDir(), "models.ini")
	};
}
//#endregion
export { resolveLlamaCppModelSource as A, buildLlamaCppProviderConfig as C, resolveLegacyLlamaCppModelCacheDir as D, resolveHomePath as E, resolveLlamaCppDataDir as O, LLAMA_CPP_PROVIDER_LABEL as S, resolveCachedLlamaCppModelPath as T, DEFAULT_LLAMA_CPP_MODEL_SHA256 as _, selectLlamaServerAsset as a, LLAMA_CPP_DEFAULT_PORT as b, DEFAULT_LLAMA_CPP_EMBEDDING_MODEL as c, DEFAULT_LLAMA_CPP_EMBEDDING_MODEL_SHA256 as d, DEFAULT_LLAMA_CPP_EMBEDDING_MODEL_SIZE_BYTES as f, DEFAULT_LLAMA_CPP_MODEL_REVISION as g, DEFAULT_LLAMA_CPP_MODEL_REF as h, resolveManagedLlamaServerPaths as i, resolveLlamaCppSyntheticApiKey as j, resolveLlamaCppModelCacheDir as k, DEFAULT_LLAMA_CPP_EMBEDDING_MODEL_ID as l, DEFAULT_LLAMA_CPP_MODEL_ID as m, LLAMA_SERVER_COMMIT as n, DEFAULT_LLAMA_CPP_CONTEXT_SIZE as o, DEFAULT_LLAMA_CPP_MODEL_CACHE_FILE as p, LLAMA_SERVER_RELEASE as r, DEFAULT_LLAMA_CPP_EMBEDDING_CACHE_FILE as s, LLAMA_SERVER_BUILD as t, DEFAULT_LLAMA_CPP_EMBEDDING_MODEL_REVISION as u, DEFAULT_LLAMA_CPP_MODEL_SIZE_BYTES as v, meetsLlamaCppDefaultModelRamFloor as w, LLAMA_CPP_PROVIDER_ID as x, DEFAULT_LLAMA_CPP_MODEL_URI as y };
