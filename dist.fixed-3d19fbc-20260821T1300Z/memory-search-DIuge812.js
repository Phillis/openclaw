import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { P as resolvePositiveTimerTimeoutMs, n as MAX_TIMER_TIMEOUT_MS } from "./number-coercion-oCkfUEEq.js";
import { i as clampNumber, r as clampInt } from "./utils-D9gvQMP6.js";
import { r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
import "./agent-scope-D9GLFAyB.js";
import { s as resolveAgentConfig } from "./agent-scope-config-CsnnOL14.js";
import { c as resolveRememberAcrossConversations, i as normalizeConfiguredMemoryExtraPaths } from "./legacy-KwIPIjLH.js";
import { A as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db-maintenance-CAGHh5rr.js";
import { r as assertSecretOwnerAvailable } from "./runtime-degraded-state-DqIBoQI-.js";
import { t as getMemoryEmbeddingProvider } from "./memory-embedding-provider-runtime-D8D_3Wmy.js";
import { t as runtimeMemorySecretOwnerId } from "./runtime-memory-secret-owner-DT6fIHS1.js";
//#region packages/memory-host-sdk/src/host/multimodal.ts
const MEMORY_MULTIMODAL_SPECS = {
	image: {
		labelPrefix: "Image file",
		extensions: [
			".jpg",
			".jpeg",
			".png",
			".webp",
			".gif",
			".heic",
			".heif"
		]
	},
	audio: {
		labelPrefix: "Audio file",
		extensions: [
			".mp3",
			".wav",
			".ogg",
			".opus",
			".m4a",
			".m2a",
			".aac",
			".flac"
		]
	}
};
/** All supported multimodal memory modalities in stable config order. */
const MEMORY_MULTIMODAL_MODALITIES = Object.keys(MEMORY_MULTIMODAL_SPECS);
/** Default max bytes for one multimodal memory file. */
const DEFAULT_MEMORY_MULTIMODAL_MAX_FILE_BYTES = 10 * 1024 * 1024;
/** Normalize user modality selections to supported modalities. */
function normalizeMemoryMultimodalModalities(raw) {
	if (raw === void 0 || raw.includes("all")) return [...MEMORY_MULTIMODAL_MODALITIES];
	const normalized = /* @__PURE__ */ new Set();
	for (const value of raw) if (value === "image" || value === "audio") normalized.add(value);
	return Array.from(normalized);
}
/** Normalize user multimodal settings, including disabled-state empty modality list. */
function normalizeMemoryMultimodalSettings(raw) {
	const enabled = raw.enabled === true;
	const maxFileBytes = typeof raw.maxFileBytes === "number" && Number.isFinite(raw.maxFileBytes) ? Math.max(1, Math.floor(raw.maxFileBytes)) : DEFAULT_MEMORY_MULTIMODAL_MAX_FILE_BYTES;
	return {
		enabled,
		modalities: enabled ? normalizeMemoryMultimodalModalities(raw.modalities) : [],
		maxFileBytes
	};
}
/** Return true when multimodal memory ingestion has at least one enabled modality. */
function isMemoryMultimodalEnabled(settings) {
	return settings.enabled && settings.modalities.length > 0;
}
/** Return accepted file extensions for a modality. */
function getMemoryMultimodalExtensions(modality) {
	return MEMORY_MULTIMODAL_SPECS[modality].extensions;
}
/** Build the text label that accompanies embedded multimodal file content. */
function buildMemoryMultimodalLabel(modality, normalizedPath) {
	return `${MEMORY_MULTIMODAL_SPECS[modality].labelPrefix}: ${normalizedPath}`;
}
/** Build a glob that matches an extension case-insensitively for indexed sources. */
function buildCaseInsensitiveExtensionGlob(extension) {
	const normalized = normalizeLowercaseStringOrEmpty(extension).replace(/^\./, "");
	if (!normalized) return "*";
	return `*.${Array.from(normalized, (char) => `[${char.toLowerCase()}${char.toUpperCase()}]`).join("")}`;
}
/** Classify a file path into a supported multimodal modality under current settings. */
function classifyMemoryMultimodalPath(filePath, settings) {
	if (!isMemoryMultimodalEnabled(settings)) return null;
	const lower = normalizeLowercaseStringOrEmpty(filePath);
	for (const modality of settings.modalities) for (const extension of getMemoryMultimodalExtensions(modality)) if (lower.endsWith(extension)) return modality;
	return null;
}
//#endregion
//#region src/agents/memory-search.ts
/**
* Resolves memory-search source, sync, and ranking configuration.
*/
const DEFAULT_CHUNK_TOKENS = 400;
const DEFAULT_CHUNK_OVERLAP = 80;
const DEFAULT_WATCH_DEBOUNCE_MS = 1500;
const DEFAULT_SESSION_DELTA_BYTES = 1e5;
const DEFAULT_SESSION_DELTA_MESSAGES = 50;
const DEFAULT_MAX_RESULTS = 6;
const DEFAULT_MIN_SCORE = .35;
const DEFAULT_HYBRID_ENABLED = true;
const DEFAULT_HYBRID_VECTOR_WEIGHT = .7;
const DEFAULT_HYBRID_TEXT_WEIGHT = .3;
const DEFAULT_HYBRID_CANDIDATE_MULTIPLIER = 4;
const DEFAULT_MMR_ENABLED = true;
const DEFAULT_MMR_LAMBDA = .7;
const DEFAULT_TEMPORAL_DECAY_ENABLED = true;
const DEFAULT_TEMPORAL_DECAY_HALF_LIFE_DAYS = 30;
const DEFAULT_CACHE_ENABLED = true;
const DEFAULT_CACHE_MAX_ENTRIES = void 0;
const DEFAULT_SOURCES = ["memory"];
const DEFAULT_MEMORY_EMBEDDING_PROVIDER = "openai";
const DEFAULT_REMOTE_BATCH_POLL_INTERVAL_MS = 2e3;
const DEFAULT_REMOTE_BATCH_TIMEOUT_MINUTES = 60;
const MAX_REMOTE_BATCH_TIMEOUT_MINUTES = Math.floor(MAX_TIMER_TIMEOUT_MS / 6e4);
function resolveRemoteBatchPollIntervalMs(overrideValue, defaultValue) {
	return resolvePositiveTimerTimeoutMs(overrideValue ?? defaultValue, DEFAULT_REMOTE_BATCH_POLL_INTERVAL_MS);
}
function resolveRemoteBatchTimeoutMinutes(overrideValue, defaultValue) {
	const value = overrideValue ?? defaultValue;
	return typeof value === "number" && Number.isFinite(value) && value > 0 ? clampInt(value, 1, MAX_REMOTE_BATCH_TIMEOUT_MINUTES) : DEFAULT_REMOTE_BATCH_TIMEOUT_MINUTES;
}
function normalizeSources(sources, sessionMemoryEnabled) {
	const normalized = /* @__PURE__ */ new Set();
	const input = sources?.length ? sources : DEFAULT_SOURCES;
	for (const source of input) {
		if (source === "memory") normalized.add("memory");
		if (source === "sessions" && sessionMemoryEnabled) normalized.add("sessions");
	}
	if (normalized.size === 0) normalized.add("memory");
	return Array.from(normalized);
}
function getConfiguredMemoryEmbeddingProvider(providerId, cfg) {
	if (normalizeProviderId(providerId) === "none") return;
	return getMemoryEmbeddingProvider(providerId, cfg);
}
function mergeConfig(cfg, defaults, overrides, agentId) {
	const enabled = overrides?.enabled ?? defaults?.enabled ?? true;
	const rememberAcrossConversations = resolveRememberAcrossConversations(cfg, agentId);
	const configuredSessionMemory = overrides?.experimental?.sessionMemory ?? defaults?.experimental?.sessionMemory ?? false;
	const sessionMemory = rememberAcrossConversations || configuredSessionMemory;
	const rawProvider = overrides?.provider ?? defaults?.provider;
	const provider = rawProvider?.trim() === "auto" ? DEFAULT_MEMORY_EMBEDDING_PROVIDER : rawProvider?.trim() || DEFAULT_MEMORY_EMBEDDING_PROVIDER;
	const primaryAdapter = getConfiguredMemoryEmbeddingProvider(provider, cfg);
	const defaultRemote = defaults?.remote;
	const overrideRemote = overrides?.remote;
	const fallback = overrides?.fallback ?? defaults?.fallback ?? "none";
	const fallbackAdapter = normalizeProviderId(provider) !== "none" && fallback && fallback !== "none" ? getConfiguredMemoryEmbeddingProvider(fallback, cfg) : void 0;
	const includeRemote = Boolean(overrideRemote?.baseUrl || overrideRemote?.apiKey || overrideRemote?.headers || defaultRemote?.baseUrl || defaultRemote?.apiKey || defaultRemote?.headers || false) || primaryAdapter?.transport !== "local" || fallbackAdapter?.transport === "remote";
	const batch = {
		enabled: overrideRemote?.batch?.enabled ?? defaultRemote?.batch?.enabled ?? false,
		wait: true,
		concurrency: 2,
		pollIntervalMs: resolveRemoteBatchPollIntervalMs(void 0, void 0),
		timeoutMinutes: resolveRemoteBatchTimeoutMinutes(void 0, void 0)
	};
	const remote = includeRemote ? {
		baseUrl: overrideRemote?.baseUrl ?? defaultRemote?.baseUrl,
		apiKey: overrideRemote?.apiKey ?? defaultRemote?.apiKey,
		headers: overrideRemote?.headers ?? defaultRemote?.headers,
		batch
	} : void 0;
	const modelDefault = primaryAdapter?.defaultModel;
	const model = overrides?.model ?? defaults?.model ?? modelDefault ?? "";
	const inputType = overrides?.inputType?.trim() || defaults?.inputType?.trim() || void 0;
	const queryInputType = overrides?.queryInputType?.trim() || defaults?.queryInputType?.trim() || void 0;
	const documentInputType = overrides?.documentInputType?.trim() || defaults?.documentInputType?.trim() || void 0;
	const outputDimensionality = overrides?.outputDimensionality ?? defaults?.outputDimensionality;
	const local = { modelPath: overrides?.local?.modelPath ?? defaults?.local?.modelPath };
	const configuredSources = overrides?.sources ?? defaults?.sources;
	const searchSources = normalizeSources(configuredSources, configuredSessionMemory || rememberAcrossConversations && configuredSources?.includes("sessions") === true);
	const sources = normalizeSources(rememberAcrossConversations ? [...searchSources, "sessions"] : configuredSources, sessionMemory);
	const extraPaths = normalizeConfiguredMemoryExtraPaths([...defaults?.extraPaths ?? [], ...overrides?.extraPaths ?? []]);
	const multimodal = normalizeMemoryMultimodalSettings({
		enabled: overrides?.multimodal?.enabled ?? defaults?.multimodal?.enabled,
		modalities: overrides?.multimodal?.modalities ?? defaults?.multimodal?.modalities,
		maxFileBytes: overrides?.multimodal?.maxFileBytes ?? defaults?.multimodal?.maxFileBytes
	});
	const vector = {
		enabled: overrides?.store?.vector?.enabled ?? defaults?.store?.vector?.enabled ?? true,
		extensionPath: overrides?.store?.vector?.extensionPath ?? defaults?.store?.vector?.extensionPath
	};
	const fts = { tokenizer: overrides?.store?.fts?.tokenizer ?? defaults?.store?.fts?.tokenizer ?? "unicode61" };
	const store = {
		driver: "sqlite",
		databasePath: resolveOpenClawAgentSqlitePath({
			agentId,
			env: process.env
		}),
		fts,
		vector
	};
	const chunking = {
		tokens: DEFAULT_CHUNK_TOKENS,
		overlap: DEFAULT_CHUNK_OVERLAP
	};
	const sync = resolveSyncConfig(defaults, overrides);
	const query = {
		maxResults: overrides?.query?.maxResults ?? defaults?.query?.maxResults ?? DEFAULT_MAX_RESULTS,
		minScore: overrides?.query?.minScore ?? defaults?.query?.minScore ?? DEFAULT_MIN_SCORE
	};
	const hybrid = {
		enabled: DEFAULT_HYBRID_ENABLED,
		vectorWeight: DEFAULT_HYBRID_VECTOR_WEIGHT,
		textWeight: DEFAULT_HYBRID_TEXT_WEIGHT,
		candidateMultiplier: DEFAULT_HYBRID_CANDIDATE_MULTIPLIER,
		mmr: {
			enabled: DEFAULT_MMR_ENABLED,
			lambda: DEFAULT_MMR_LAMBDA
		},
		temporalDecay: {
			enabled: DEFAULT_TEMPORAL_DECAY_ENABLED,
			halfLifeDays: DEFAULT_TEMPORAL_DECAY_HALF_LIFE_DAYS
		}
	};
	const cache = {
		enabled: overrides?.cache?.enabled ?? defaults?.cache?.enabled ?? DEFAULT_CACHE_ENABLED,
		maxEntries: DEFAULT_CACHE_MAX_ENTRIES
	};
	const overlap = clampNumber(chunking.overlap, 0, Math.max(0, chunking.tokens - 1));
	const minScore = clampNumber(query.minScore, 0, 1);
	const vectorWeight = clampNumber(hybrid.vectorWeight, 0, 1);
	const textWeight = clampNumber(hybrid.textWeight, 0, 1);
	const sum = vectorWeight + textWeight;
	const normalizedVectorWeight = sum > 0 ? vectorWeight / sum : DEFAULT_HYBRID_VECTOR_WEIGHT;
	const normalizedTextWeight = sum > 0 ? textWeight / sum : DEFAULT_HYBRID_TEXT_WEIGHT;
	const candidateMultiplier = clampInt(hybrid.candidateMultiplier, 1, 20);
	const temporalDecayHalfLifeDays = Math.max(1, Math.floor(Number.isFinite(hybrid.temporalDecay.halfLifeDays) ? hybrid.temporalDecay.halfLifeDays : DEFAULT_TEMPORAL_DECAY_HALF_LIFE_DAYS));
	const deltaBytes = clampInt(sync.sessions.deltaBytes, 0, Number.MAX_SAFE_INTEGER);
	const deltaMessages = clampInt(sync.sessions.deltaMessages, 0, Number.MAX_SAFE_INTEGER);
	const postCompactionForce = sync.sessions.postCompactionForce;
	return {
		enabled,
		rememberAcrossConversations,
		sources,
		searchSources,
		extraPaths,
		multimodal,
		provider,
		remote,
		experimental: { sessionMemory },
		fallback,
		model,
		inputType,
		queryInputType,
		documentInputType,
		outputDimensionality,
		local,
		store,
		chunking: {
			tokens: Math.max(1, chunking.tokens),
			overlap
		},
		sync: {
			...sync,
			sessions: {
				deltaBytes,
				deltaMessages,
				postCompactionForce
			}
		},
		query: {
			...query,
			minScore,
			hybrid: {
				enabled: hybrid.enabled,
				vectorWeight: normalizedVectorWeight,
				textWeight: normalizedTextWeight,
				candidateMultiplier,
				mmr: {
					enabled: hybrid.mmr.enabled,
					lambda: Number.isFinite(hybrid.mmr.lambda) ? Math.max(0, Math.min(1, hybrid.mmr.lambda)) : DEFAULT_MMR_LAMBDA
				},
				temporalDecay: {
					enabled: hybrid.temporalDecay.enabled,
					halfLifeDays: temporalDecayHalfLifeDays
				}
			}
		},
		cache: {
			enabled: cache.enabled,
			maxEntries: typeof cache.maxEntries === "number" && Number.isFinite(cache.maxEntries) ? Math.max(1, Math.floor(cache.maxEntries)) : void 0
		}
	};
}
function resolveSyncConfig(_defaults, _overrides) {
	return {
		onSessionStart: true,
		onSearch: true,
		watch: true,
		watchDebounceMs: DEFAULT_WATCH_DEBOUNCE_MS,
		intervalMinutes: 0,
		embeddingBatchTimeoutSeconds: void 0,
		sessions: {
			deltaBytes: DEFAULT_SESSION_DELTA_BYTES,
			deltaMessages: DEFAULT_SESSION_DELTA_MESSAGES,
			postCompactionForce: true
		}
	};
}
function resolveMemorySearchConfig(cfg, agentId) {
	const defaults = cfg.memory?.search;
	const overrides = resolveAgentConfig(cfg, agentId)?.memory?.search;
	const resolved = mergeConfig(cfg, defaults, overrides, agentId);
	if (!resolved.enabled) return null;
	assertSecretOwnerAvailable("capability", runtimeMemorySecretOwnerId(agentId));
	const isFtsOnly = normalizeProviderId(resolved.provider) === "none";
	const multimodalActive = isMemoryMultimodalEnabled(resolved.multimodal);
	const multimodalProvider = isFtsOnly ? void 0 : getConfiguredMemoryEmbeddingProvider(resolved.provider, cfg);
	if (!isFtsOnly && multimodalActive && multimodalProvider && !(multimodalProvider.supportsMultimodalEmbeddings?.({ model: resolved.model }) ?? false)) throw new Error("memory.search.multimodal requires a provider adapter that supports multimodal embeddings for the configured model.");
	if (multimodalActive && resolved.fallback !== "none") throw new Error("memory.search.multimodal does not support memory.search.fallback. Set fallback to \"none\".");
	return resolved;
}
function resolveMemorySearchSyncConfig(cfg, agentId) {
	const defaults = cfg.memory?.search;
	const overrides = resolveAgentConfig(cfg, agentId)?.memory?.search;
	if (!(overrides?.enabled ?? defaults?.enabled ?? true)) return null;
	return resolveSyncConfig(defaults, overrides);
}
//#endregion
export { classifyMemoryMultimodalPath as a, buildMemoryMultimodalLabel as i, resolveMemorySearchSyncConfig as n, getMemoryMultimodalExtensions as o, buildCaseInsensitiveExtensionGlob as r, resolveMemorySearchConfig as t };
