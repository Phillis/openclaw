import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { l as resolveAgentDir } from "./agent-scope-config-BdXMWufB.js";
import { S as findModelInCatalog } from "./model-selection-shared-DT9x3Cg2.js";
import { w as resolveDefaultModelForAgent } from "./codex-route-model-ref-Bw2nFxxx.js";
import { r as logVerbose } from "./globals-CAwGc4B6.js";
import { a as modelSupportsVision } from "./model-catalog-D1JZ_G7y.js";
import { i as loadPreparedModelCatalog } from "./prepared-model-catalog-BFweRhks.js";
import { s as resolveApiKeyForProviderCore } from "./model-auth-B7VlMZMb.js";
import { n as resolveAutoMediaKeyProviders, r as resolveDefaultMediaModel } from "./defaults-BM9x5Lhb.js";
import { n as resolveAutoImageModel } from "./runner-CF500_01.js";
import "./runtime-env-COkbgBI4.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import "./agent-runtime-C-ueAbwA.js";
import "./media-runtime-BdAMhkEx.js";
import { n as getTelegramRuntime } from "./runtime-D4cq5Nic.js";
import { i as normalizeCachedStickerForStore, n as TELEGRAM_STICKER_CACHE_NAMESPACE, t as TELEGRAM_STICKER_CACHE_MAX_ENTRIES } from "./sticker-cache-store.legacy-state-CLECyPgO.js";
//#region extensions/telegram/src/sticker-cache-store.ts
function openStickerCacheStore() {
	return getTelegramRuntime().state.openSyncKeyedStore({
		namespace: TELEGRAM_STICKER_CACHE_NAMESPACE,
		maxEntries: TELEGRAM_STICKER_CACHE_MAX_ENTRIES
	});
}
function readStickerCacheStore(operation, read, fallback) {
	try {
		return read(openStickerCacheStore());
	} catch (err) {
		logVerbose(`telegram sticker cache ${operation} failed: ${String(err)}`);
		return fallback;
	}
}
/**
* Get a cached sticker by its unique ID.
*/
function getCachedSticker(fileUniqueId) {
	return readStickerCacheStore("lookup", (store) => store.lookup(fileUniqueId) ?? null, null);
}
/**
* Add or update a sticker in the cache.
*/
function cacheSticker(sticker) {
	readStickerCacheStore("register", (store) => {
		store.register(sticker.fileUniqueId, normalizeCachedStickerForStore(sticker));
	}, void 0);
}
/**
* Search cached stickers by text query (fuzzy match on description + emoji + setName).
*/
function searchStickers(query, limit = 10) {
	const queryLower = normalizeLowercaseStringOrEmpty(query);
	const results = [];
	for (const { value: sticker } of readStickerCacheStore("entries", (store) => store.entries(), [])) {
		let score = 0;
		const descLower = normalizeLowercaseStringOrEmpty(sticker.description);
		if (descLower.includes(queryLower)) score += 10;
		const queryWords = queryLower.split(/\s+/).filter(Boolean);
		const descWords = descLower.split(/\s+/);
		for (const qWord of queryWords) if (descWords.some((dWord) => dWord.includes(qWord))) score += 5;
		if (sticker.emoji && query.includes(sticker.emoji)) score += 8;
		if (normalizeLowercaseStringOrEmpty(sticker.setName).includes(queryLower)) score += 3;
		if (score > 0) results.push({
			sticker,
			score
		});
	}
	return results.toSorted((a, b) => b.score - a.score).slice(0, limit).map((r) => r.sticker);
}
/**
* Get all cached stickers (for debugging/listing).
*/
function getAllCachedStickers() {
	return readStickerCacheStore("entries", (store) => store.entries().map((entry) => entry.value), []);
}
/**
* Get cache statistics.
*/
function getCacheStats() {
	const stickers = getAllCachedStickers();
	if (stickers.length === 0) return { count: 0 };
	const sorted = [...stickers].toSorted((a, b) => new Date(a.cachedAt).getTime() - new Date(b.cachedAt).getTime());
	return {
		count: stickers.length,
		oldestAt: sorted[0]?.cachedAt,
		newestAt: sorted[sorted.length - 1]?.cachedAt
	};
}
//#endregion
//#region extensions/telegram/src/sticker-cache.ts
const STICKER_DESCRIPTION_PROMPT = "Describe this sticker image in 1-2 sentences. Focus on what the sticker depicts (character, object, action, emotion). Be concise and objective.";
function isMinimaxVlmProvider(provider) {
	const normalized = normalizeLowercaseStringOrEmpty(provider);
	return normalized === "minimax" || normalized === "minimax-cn" || normalized === "minimax-portal" || normalized === "minimax-portal-cn";
}
/**
* Describe a sticker image using vision API.
* Auto-detects an available vision provider based on configured API keys.
* Returns null if no vision provider is available.
*/
async function describeStickerImage(params) {
	const { imagePath, cfg, agentDir, agentId } = params;
	const defaultModel = resolveDefaultModelForAgent({
		cfg,
		agentId
	});
	let activeModel = void 0;
	let catalog = [];
	try {
		catalog = await loadPreparedModelCatalog({
			config: cfg,
			...agentId ? {
				agentId,
				agentDir: agentDir ?? resolveAgentDir(cfg, agentId)
			} : agentDir ? { agentDir } : {},
			readOnly: true
		});
		if (modelSupportsVision(findModelInCatalog(catalog, defaultModel.provider, defaultModel.model))) {
			const model = isMinimaxVlmProvider(defaultModel.provider) ? resolveDefaultMediaModel({
				cfg,
				providerId: defaultModel.provider,
				capability: "image",
				includeConfiguredImageModels: false
			}) : defaultModel.model;
			if (model) activeModel = {
				provider: defaultModel.provider,
				model
			};
		}
	} catch {}
	const hasProviderKey = async (provider) => {
		try {
			await resolveApiKeyForProviderCore({
				provider,
				cfg,
				agentDir
			});
			return true;
		} catch {
			return false;
		}
	};
	const autoProviders = resolveAutoMediaKeyProviders({
		cfg,
		capability: "image"
	});
	const selectCatalogModel = (provider) => {
		const entries = catalog.filter((entry) => normalizeLowercaseStringOrEmpty(entry.provider) === normalizeLowercaseStringOrEmpty(provider) && modelSupportsVision(entry));
		if (entries.length === 0) return;
		const defaultId = resolveDefaultMediaModel({
			cfg,
			providerId: provider,
			capability: "image",
			includeConfiguredImageModels: !isMinimaxVlmProvider(provider)
		});
		const preferred = entries.find((entry) => entry.id === defaultId);
		if (isMinimaxVlmProvider(provider)) return preferred;
		return preferred ?? entries[0];
	};
	let resolved = null;
	if (activeModel && autoProviders.includes(activeModel.provider) && await hasProviderKey(activeModel.provider)) resolved = activeModel;
	if (!resolved) for (const provider of autoProviders) {
		if (!await hasProviderKey(provider)) continue;
		const entry = selectCatalogModel(provider);
		if (entry) {
			resolved = {
				provider,
				model: entry.id
			};
			break;
		}
	}
	if (!resolved) resolved = await resolveAutoImageModel({
		cfg,
		agentDir,
		activeModel
	});
	if (!resolved?.model) {
		logVerbose("telegram: no vision provider available for sticker description");
		return null;
	}
	const { provider, model } = resolved;
	logVerbose(`telegram: describing sticker with ${provider}/${model}`);
	try {
		return (await getTelegramRuntime().mediaUnderstanding.describeImageFileWithModel({
			filePath: imagePath,
			mime: "image/webp",
			cfg,
			agentDir,
			provider,
			model,
			prompt: STICKER_DESCRIPTION_PROMPT,
			maxTokens: 150,
			timeoutMs: 3e4
		})).text ?? null;
	} catch (err) {
		logVerbose(`telegram: failed to describe sticker: ${String(err)}`);
		return null;
	}
}
//#endregion
export { getCachedSticker as a, getCacheStats as i, cacheSticker as n, searchStickers as o, getAllCachedStickers as r, describeStickerImage as t };
