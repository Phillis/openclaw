import { r as asNullableRecord } from "./record-coerce-DItp3I4t.js";
import { w as resolveStateDir } from "./paths-BBSTUjD5.js";
import "./history-DLKGD0Dj.js";
import { c as stripRetiredChannelKeys, i as defineChannelAliasMigration, l as hasLegacyAccountStreamingAliases, o as normalizeChannelAccounts } from "./runtime-doctor-migrations-BXpzR2WJ.js";
import { n as readJsonFileWithFallback } from "./json-store-BMxA9fKZ.js";
import "./state-paths-DQKtm04E.js";
import { t as normalizeTelegramBotInfo } from "./bot-info-BabEIyfI.js";
import { n as getTelegramRuntime } from "./runtime-D4cq5Nic.js";
import { t as normalizeTelegramStateAccountId } from "./state-account-id-CdS1ON70.js";
import { t as fingerprintTelegramBotToken } from "./token-fingerprint-z983D2R-.js";
import os from "node:os";
import path from "node:path";
//#region extensions/telegram/src/bot-info-cache.ts
const LEGACY_STORE_VERSION = 1;
const TELEGRAM_BOT_INFO_CACHE_NAMESPACE = "telegram.bot-info-cache";
const TELEGRAM_BOT_INFO_CACHE_MAX_AGE_MS = 1440 * 60 * 1e3;
function fingerprintFromToken(botToken) {
	const trimmed = botToken?.trim();
	if (!trimmed) return null;
	return fingerprintTelegramBotToken(trimmed);
}
function resolveTelegramBotInfoCachePath(accountId, env = process.env) {
	const stateDir = resolveStateDir(env, os.homedir);
	return path.join(stateDir, "telegram", `bot-info-${normalizeTelegramStateAccountId(accountId)}.json`);
}
function openBotInfoCacheStore() {
	return getTelegramRuntime().state.openKeyedStore({
		namespace: TELEGRAM_BOT_INFO_CACHE_NAMESPACE,
		maxEntries: 128,
		defaultTtlMs: TELEGRAM_BOT_INFO_CACHE_MAX_AGE_MS
	});
}
function parseCachedTelegramBotInfo(value) {
	if (!value || typeof value !== "object") return null;
	const state = value;
	if (typeof state.tokenFingerprint !== "string" || typeof state.fetchedAt !== "string" || Number.isNaN(Date.parse(state.fetchedAt))) return null;
	const botInfo = normalizeTelegramBotInfo(state.botInfo);
	if (!botInfo) return null;
	return {
		tokenFingerprint: state.tokenFingerprint,
		fetchedAt: state.fetchedAt,
		botInfo
	};
}
function parseLegacyCachedTelegramBotInfo(value) {
	if (!value || typeof value !== "object") return null;
	if (value.version !== LEGACY_STORE_VERSION) return null;
	return parseCachedTelegramBotInfo(value);
}
async function readCachedTelegramBotInfo(params) {
	const tokenFingerprint = fingerprintFromToken(params.botToken);
	if (!tokenFingerprint) return null;
	const parsed = parseCachedTelegramBotInfo(await openBotInfoCacheStore().lookup(normalizeTelegramStateAccountId(params.accountId)));
	if (!parsed || parsed.tokenFingerprint !== tokenFingerprint) return null;
	const fetchedAtMs = Date.parse(parsed.fetchedAt);
	if ((params.now?.getTime() ?? Date.now()) - fetchedAtMs > TELEGRAM_BOT_INFO_CACHE_MAX_AGE_MS) return null;
	return {
		botInfo: parsed.botInfo,
		fetchedAt: parsed.fetchedAt
	};
}
async function writeCachedTelegramBotInfo(params) {
	const tokenFingerprint = fingerprintFromToken(params.botToken);
	if (!tokenFingerprint) return;
	const botInfo = normalizeTelegramBotInfo(params.botInfo);
	if (!botInfo) return;
	await openBotInfoCacheStore().register(normalizeTelegramStateAccountId(params.accountId), {
		tokenFingerprint,
		fetchedAt: (/* @__PURE__ */ new Date()).toISOString(),
		botInfo
	});
}
async function deleteCachedTelegramBotInfo(params) {
	await openBotInfoCacheStore().delete(normalizeTelegramStateAccountId(params.accountId));
}
async function listTelegramLegacyBotInfoCacheEntries(params) {
	const { value } = await readJsonFileWithFallback(params.persistedPath, null);
	const parsed = parseLegacyCachedTelegramBotInfo(value);
	if (!parsed) return [];
	return [{
		key: normalizeTelegramStateAccountId(params.accountId),
		value: parsed
	}];
}
//#endregion
//#region extensions/telegram/src/doctor-contract.ts
const streamingAliasMigration = defineChannelAliasMigration({
	channelId: "telegram",
	streaming: {
		defaultMode: "partial",
		includePreviewChunk: true
	}
});
const RETIRED_TUNING_KEYS = /* @__PURE__ */ new Set([
	"timeoutSeconds",
	"mediaGroupFlushMs",
	"pollingStallThresholdMs",
	"retry",
	"errorCooldownMs"
]);
function hasRetiredTelegramDmConfig(value) {
	const entry = asNullableRecord(value);
	if (!entry) return false;
	if (asNullableRecord(entry.dm)) return true;
	return Object.values(asNullableRecord(entry.direct) ?? {}).some((direct) => asNullableRecord(direct)?.threadReplies !== void 0);
}
function hasRetiredTelegramNativeDraftConfig(value) {
	const preview = asNullableRecord(asNullableRecord(asNullableRecord(value)?.streaming)?.preview);
	return preview?.nativeToolProgress !== void 0 || preview?.nativeToolProgressAllowFrom !== void 0;
}
function hasRetiredTelegramGroupHistoryContextConfig(value) {
	return asNullableRecord(value)?.includeGroupHistoryContext !== void 0;
}
function removeRetiredTelegramDmConfig(params) {
	let updated = params.entry;
	let changed = false;
	const dm = asNullableRecord(updated.dm);
	if (dm) {
		const { dm: _ignored, ...rest } = updated;
		updated = rest;
		params.changes.push(dm.threadReplies === void 0 ? `Removed ${params.pathPrefix}.dm.` : `Removed ${params.pathPrefix}.dm.threadReplies; DM topic sessions now follow Telegram getMe.has_topics_enabled.`);
		changed = true;
	}
	const direct = asNullableRecord(updated.direct);
	if (direct) {
		let directChanged = false;
		const nextDirect = { ...direct };
		for (const [chatId, rawDirectConfig] of Object.entries(direct)) {
			const directConfig = asNullableRecord(rawDirectConfig);
			if (!directConfig || directConfig.threadReplies === void 0) continue;
			const nextDirectConfig = { ...directConfig };
			delete nextDirectConfig.threadReplies;
			nextDirect[chatId] = nextDirectConfig;
			params.changes.push(`Removed ${params.pathPrefix}.direct.${chatId}.threadReplies; DM topic sessions now follow Telegram getMe.has_topics_enabled.`);
			directChanged = true;
		}
		if (directChanged) {
			updated = {
				...updated,
				direct: nextDirect
			};
			changed = true;
		}
	}
	return {
		entry: updated,
		changed
	};
}
function removeRetiredTelegramNativeDraftConfig(params) {
	const streaming = asNullableRecord(params.entry.streaming);
	const preview = asNullableRecord(streaming?.preview);
	if (!streaming || !preview || preview.nativeToolProgress === void 0 && preview.nativeToolProgressAllowFrom === void 0) return {
		entry: params.entry,
		changed: false
	};
	const nextPreview = { ...preview };
	delete nextPreview.nativeToolProgress;
	delete nextPreview.nativeToolProgressAllowFrom;
	const nextStreaming = { ...streaming };
	if (Object.keys(nextPreview).length > 0) nextStreaming.preview = nextPreview;
	else delete nextStreaming.preview;
	const updated = Object.keys(nextStreaming).length > 0 ? {
		...params.entry,
		streaming: nextStreaming
	} : Object.fromEntries(Object.entries(params.entry).filter(([key]) => key !== "streaming"));
	params.changes.push(`Removed ${params.pathPrefix}.streaming.preview native draft keys; Telegram previews now use rich send/edit messages.`);
	return {
		entry: updated,
		changed: true
	};
}
function removeRetiredTelegramGroupHistoryContextConfig(params) {
	if (params.entry.includeGroupHistoryContext === void 0) return {
		entry: params.entry,
		changed: false
	};
	const { includeGroupHistoryContext, ...rest } = params.entry;
	let updated = includeGroupHistoryContext === "none" ? {
		...rest,
		historyLimit: 0
	} : rest;
	if (includeGroupHistoryContext === "recent" && params.preserveRecentHistoryLimit !== void 0 && updated.historyLimit === void 0) updated = {
		...updated,
		historyLimit: params.preserveRecentHistoryLimit
	};
	const historyLimitNote = includeGroupHistoryContext === "none" ? " and set historyLimit to 0" : includeGroupHistoryContext === "recent" && params.preserveRecentHistoryLimit !== void 0 && params.entry.historyLimit === void 0 ? ` and set historyLimit to ${params.preserveRecentHistoryLimit}` : "";
	params.changes.push(`Removed ${params.pathPrefix}.includeGroupHistoryContext${historyLimitNote}; Telegram group history is always on for groups and bounded by historyLimit.`);
	return {
		entry: updated,
		changed: true
	};
}
function resolveCompatibleDefaultGroupEntry(section) {
	const existingGroups = section.groups;
	if (existingGroups !== void 0 && !asNullableRecord(existingGroups)) return null;
	const groups = asNullableRecord(existingGroups) ?? {};
	const existingEntry = groups["*"];
	if (existingEntry !== void 0 && !asNullableRecord(existingEntry)) return null;
	return {
		groups,
		entry: asNullableRecord(existingEntry) ?? {}
	};
}
const legacyConfigRules = [
	{
		path: [
			"channels",
			"telegram",
			"groupMentionsOnly"
		],
		message: "channels.telegram.groupMentionsOnly was removed; use channels.telegram.groups.\"*\".requireMention instead. Run \"openclaw doctor --fix\"."
	},
	{
		path: ["channels", "telegram"],
		message: "channels.telegram.dm and direct.<chatId>.threadReplies were removed; DM topic sessions now follow Telegram getMe.has_topics_enabled, so topics-enabled bots may use thread-scoped DM sessions. Run \"openclaw doctor --fix\".",
		match: hasRetiredTelegramDmConfig
	},
	{
		path: [
			"channels",
			"telegram",
			"accounts"
		],
		message: "channels.telegram.accounts.<id>.dm and direct.<chatId>.threadReplies were removed; DM topic sessions now follow Telegram getMe.has_topics_enabled, so topics-enabled bots may use thread-scoped DM sessions. Run \"openclaw doctor --fix\".",
		match: (value) => hasLegacyAccountStreamingAliases(value, hasRetiredTelegramDmConfig)
	},
	{
		path: ["channels", "telegram"],
		message: "channels.telegram.streaming.preview.nativeToolProgress and nativeToolProgressAllowFrom were removed; Telegram previews now use rich send/edit messages. Run \"openclaw doctor --fix\".",
		match: hasRetiredTelegramNativeDraftConfig
	},
	{
		path: [
			"channels",
			"telegram",
			"accounts"
		],
		message: "channels.telegram.accounts.<id>.streaming.preview.nativeToolProgress and nativeToolProgressAllowFrom were removed; Telegram previews now use rich send/edit messages. Run \"openclaw doctor --fix\".",
		match: (value) => hasLegacyAccountStreamingAliases(value, hasRetiredTelegramNativeDraftConfig)
	},
	{
		path: ["channels", "telegram"],
		message: "channels.telegram.includeGroupHistoryContext was removed; Telegram group history is always on for groups and bounded by historyLimit. Run \"openclaw doctor --fix\".",
		match: hasRetiredTelegramGroupHistoryContextConfig
	},
	{
		path: [
			"channels",
			"telegram",
			"accounts"
		],
		message: "channels.telegram.accounts.<id>.includeGroupHistoryContext was removed; Telegram group history is always on for groups and bounded by historyLimit. Run \"openclaw doctor --fix\".",
		match: (value) => hasLegacyAccountStreamingAliases(value, hasRetiredTelegramGroupHistoryContextConfig)
	},
	...streamingAliasMigration.legacyConfigRules
];
function normalizeCompatibilityConfig({ cfg }) {
	const changes = [];
	const tuningKnobs = stripRetiredChannelKeys({
		cfg: streamingAliasMigration.normalizeChannelConfig({
			cfg,
			changes
		}).config,
		channelId: "telegram",
		keys: RETIRED_TUNING_KEYS,
		scope: "recursive"
	});
	const rawEntry = asNullableRecord(tuningKnobs.config.channels?.telegram);
	if (!rawEntry) return {
		config: cfg,
		changes: []
	};
	let updated = rawEntry;
	let changed = tuningKnobs.config !== cfg;
	if (tuningKnobs.changed) changes.push("Removed retired Telegram tuning knobs.");
	const rootGroupHistoryContextMode = updated.includeGroupHistoryContext;
	const rootGroupHistoryLimitBeforeMigration = typeof updated.historyLimit === "number" ? updated.historyLimit : cfg.messages?.groupChat?.historyLimit ?? 50;
	const removedThreadReplies = removeRetiredTelegramDmConfig({
		entry: updated,
		pathPrefix: "channels.telegram",
		changes
	});
	updated = removedThreadReplies.entry;
	changed = changed || removedThreadReplies.changed;
	const removedNativeDraft = removeRetiredTelegramNativeDraftConfig({
		entry: updated,
		pathPrefix: "channels.telegram",
		changes
	});
	updated = removedNativeDraft.entry;
	changed = changed || removedNativeDraft.changed;
	const removedGroupHistoryContext = removeRetiredTelegramGroupHistoryContextConfig({
		entry: updated,
		pathPrefix: "channels.telegram",
		changes
	});
	updated = removedGroupHistoryContext.entry;
	changed = changed || removedGroupHistoryContext.changed;
	if (updated.groupMentionsOnly !== void 0) {
		const defaultGroupEntry = resolveCompatibleDefaultGroupEntry(updated);
		if (!defaultGroupEntry) changes.push("Skipped channels.telegram.groupMentionsOnly migration because channels.telegram.groups already has an incompatible shape; fix remaining issues manually.");
		else {
			const { groups, entry } = defaultGroupEntry;
			if (entry.requireMention === void 0) {
				entry.requireMention = updated.groupMentionsOnly;
				groups["*"] = entry;
				updated = {
					...updated,
					groups
				};
				changes.push("Moved channels.telegram.groupMentionsOnly → channels.telegram.groups.\"*\".requireMention.");
			} else changes.push("Removed channels.telegram.groupMentionsOnly (channels.telegram.groups.\"*\" already set).");
			const { groupMentionsOnly: _ignored, ...rest } = updated;
			updated = rest;
			changed = true;
		}
	}
	const accounts = normalizeChannelAccounts({
		entry: updated,
		pathPrefix: "channels.telegram",
		changes,
		normalizeAccount: ({ account, pathPrefix, changes: accountChanges }) => {
			const dm = removeRetiredTelegramDmConfig({
				entry: account,
				pathPrefix,
				changes: accountChanges
			});
			const nativeDraft = removeRetiredTelegramNativeDraftConfig({
				entry: dm.entry,
				pathPrefix,
				changes: accountChanges
			});
			const history = removeRetiredTelegramGroupHistoryContextConfig({
				entry: nativeDraft.entry,
				pathPrefix,
				changes: accountChanges,
				...rootGroupHistoryContextMode === "none" ? { preserveRecentHistoryLimit: rootGroupHistoryLimitBeforeMigration } : {}
			});
			return {
				entry: history.entry,
				changed: dm.changed || nativeDraft.changed || history.changed
			};
		}
	});
	updated = accounts.entry;
	changed = changed || accounts.changed;
	if (!changed && changes.length === 0) return {
		config: cfg,
		changes: []
	};
	return {
		config: {
			...tuningKnobs.config,
			channels: {
				...tuningKnobs.config.channels,
				telegram: updated
			}
		},
		changes
	};
}
//#endregion
export { listTelegramLegacyBotInfoCacheEntries as a, writeCachedTelegramBotInfo as c, deleteCachedTelegramBotInfo as i, normalizeCompatibilityConfig as n, readCachedTelegramBotInfo as o, TELEGRAM_BOT_INFO_CACHE_NAMESPACE as r, resolveTelegramBotInfoCachePath as s, legacyConfigRules as t };
