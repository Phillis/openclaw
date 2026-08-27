import { c as isRecord } from "../../record-coerce-DItp3I4t.js";
import { v as uniqueStrings } from "../../string-normalization-e_fvmxMf.js";
import { a as listAgentIds } from "../../agent-scope-config-BdXMWufB.js";
import { o as resolveSessionStorePathCore } from "../../paths-B2oibYbs.js";
import { t as definePluginDoctorMigrationFromPlans } from "../../doctor-migration-plan-adapter-6M7Lxx8c.js";
import "../../string-coerce-runtime-D9ocX9lc.js";
import { n as resolveDefaultTelegramAccountId, t as listTelegramAccountIds } from "../../account-selection-JF6zaKJE.js";
import { t as fileExists } from "../../security-runtime-Bm9RUgAZ.js";
import "../../session-store-paths-BLBZAOYT.js";
import "../../runtime-doctor-migrations-Bxiar_G3.js";
import "../../agent-scope-runtime-Cx8GdDGm.js";
import { n as parseTelegramMessageThreadId } from "../../outbound-params-B_YGyvIG.js";
import { a as listTelegramLegacyBotInfoCacheEntries, n as normalizeCompatibilityConfig, r as TELEGRAM_BOT_INFO_CACHE_NAMESPACE, s as resolveTelegramBotInfoCachePath, t as legacyConfigRules } from "../../doctor-contract-BEUtGlMP.js";
import { t as resolveTelegramAccountOwnerAgentId } from "../../account-owner-DaJ2nuG9.js";
import { a as resolveTelegramThreadBindingsPath, n as TELEGRAM_THREAD_BINDINGS_NAMESPACE, r as listTelegramLegacyThreadBindingEntries, t as TELEGRAM_THREAD_BINDINGS_MAX_ENTRIES } from "../../thread-bindings-store-Bx9mFb83.js";
import { n as TELEGRAM_STICKER_CACHE_NAMESPACE, r as listTelegramLegacyStickerCacheEntries, t as TELEGRAM_STICKER_CACHE_MAX_ENTRIES } from "../../sticker-cache-store.legacy-state-CLECyPgO.js";
import { a as normalizeTelegramUpdateOffsetAccountId, i as listTelegramLegacyUpdateOffsetEntries, n as TELEGRAM_UPDATE_OFFSET_NAMESPACE, s as shouldReplaceTelegramUpdateOffsetEntry, t as TELEGRAM_UPDATE_OFFSET_MAX_ENTRIES } from "../../update-offset-store-DK3gq50L.js";
import { c as TELEGRAM_MESSAGE_CACHE_PERSISTENT_NAMESPACE, d as resolveTelegramMessageCachePath, f as resolveTelegramMessageCachePersistentScopeKey, i as listTelegramLegacySentMessageCacheEntries, l as isTelegramMessageCacheSourceMessage, n as TELEGRAM_SENT_MESSAGE_CACHE_NAMESPACE, s as TELEGRAM_MESSAGE_CACHE_PERSISTENT_MAX_MESSAGES, t as TELEGRAM_SENT_MESSAGE_CACHE_MAX_ENTRIES } from "../../sent-message-cache.legacy-state-Dmk5VjYs.js";
import { a as resolveTopicNameCachePath, i as resolveTopicNameCacheNamespace, o as resolveTopicNameCacheScope, r as listTelegramLegacyTopicNameCacheEntries, t as TELEGRAM_TOPIC_NAME_CACHE_MAX_ENTRIES } from "../../topic-name-cache-J5QhVzFx.js";
import fs from "node:fs";
import path from "node:path";
//#region extensions/telegram/src/state-migrations.ts
function resolveLegacySessionStorePath(params) {
	return path.join(resolveMigrationStateDir(params), "sessions", "sessions.json");
}
function resolveAgentSessionStorePath(params) {
	return resolveSessionStorePathCore(params.cfg.session?.store, {
		env: params.env,
		agentId: params.agentId
	});
}
function listLegacyAgentSessionStorePaths(params) {
	return uniqueStrings([
		...listAgentIds(params.cfg).map((agentId) => resolveAgentSessionStorePath({
			...params,
			agentId
		})),
		resolveAgentSessionStorePath({
			...params,
			agentId: "main"
		}),
		resolveLegacySessionStorePath(params)
	]);
}
function resolveTelegramLegacyStateOwnerAgentId(cfg) {
	const configuredAccountIds = listTelegramAccountIds(cfg);
	const ownerAgentIds = uniqueStrings((configuredAccountIds.length > 0 ? configuredAccountIds : [resolveDefaultTelegramAccountId(cfg)]).map((accountId) => resolveTelegramAccountOwnerAgentId({
		cfg,
		accountId
	})));
	if (ownerAgentIds.length === 1) return ownerAgentIds[0];
	throw new Error(`Legacy Telegram state has multiple routed owners (${ownerAgentIds.join(", ")}); preserve it until one migration owner is configured.`);
}
function resolveMigrationStateDir(params) {
	return params.stateDir ?? path.dirname(path.dirname(path.dirname(path.dirname(resolveSessionStorePathCore(void 0, {
		env: params.env,
		agentId: "main"
	})))));
}
function parseLegacyMessageCacheJson(text) {
	try {
		const value = JSON.parse(text);
		return Array.isArray(value) ? value : [value];
	} catch {
		return;
	}
}
function readLegacyMessageCacheValues(raw) {
	const text = raw.trim();
	const whole = parseLegacyMessageCacheJson(text);
	if (whole) return whole;
	const values = [];
	let jsonl = text;
	if (text.startsWith("[")) for (const match of text.matchAll(/\](?=\s*\{\s*"key"\s*:)/g)) {
		const arrayEnd = (match.index ?? -1) + 1;
		const initial = parseLegacyMessageCacheJson(text.slice(0, arrayEnd));
		if (initial) {
			values.push(...initial);
			jsonl = text.slice(arrayEnd);
			break;
		}
	}
	for (const line of jsonl.split("\n")) values.push(...parseLegacyMessageCacheJson(line) ?? []);
	return values;
}
function listTelegramLegacyMessageCacheEntries(persistedPath) {
	let raw;
	try {
		raw = fs.readFileSync(persistedPath, "utf8");
	} catch {
		return [];
	}
	const entries = /* @__PURE__ */ new Map();
	for (const value of readLegacyMessageCacheValues(raw)) {
		if (!isRecord(value) || typeof value.key !== "string" || !value.key.trim() || !value.key.includes(":") || !isRecord(value.node)) continue;
		const sourceMessage = value.node.sourceMessage;
		if (!isTelegramMessageCacheSourceMessage(sourceMessage)) continue;
		const { openclaw_prompt_context_projection: _projection, ...canonicalSourceMessage } = sourceMessage;
		const parsedThreadId = parseTelegramMessageThreadId(value.node.threadId);
		const threadId = parsedThreadId === void 0 ? void 0 : String(parsedThreadId);
		const key = `${value.key.slice(0, value.key.lastIndexOf(":") + 1)}${sourceMessage.message_id}`;
		entries.delete(key);
		entries.set(key, {
			version: 1,
			sourceMessage: canonicalSourceMessage,
			...threadId ? { threadId } : {}
		});
		if (entries.size > 3e3) {
			const oldest = entries.keys().next().value;
			if (oldest !== void 0) entries.delete(oldest);
		}
	}
	return Array.from(entries, ([key, value]) => ({
		key,
		value
	}));
}
function listTelegramLegacySidecarAccountIds(params) {
	let persistedAccountIds;
	try {
		persistedAccountIds = fs.readdirSync(path.join(params.stateDir, "telegram"), { withFileTypes: true }).filter((entry) => entry.isFile() && entry.name.startsWith(params.prefix) && entry.name.endsWith(params.suffix)).map((entry) => entry.name.slice(params.prefix.length, -params.suffix.length)).filter(Boolean);
	} catch {
		persistedAccountIds = [];
	}
	return uniqueStrings([...listTelegramAccountIds(params.cfg), ...persistedAccountIds]);
}
function detectTelegramMessageCacheLegacyStateMigration(params) {
	const persistedPaths = listLegacyAgentSessionStorePaths(params).map(resolveTelegramMessageCachePath).filter(fileExists);
	if (persistedPaths.length === 0) return [];
	const scopeKey = resolveTelegramMessageCachePersistentScopeKey(resolveTelegramMessageCachePath(resolveAgentSessionStorePath({
		...params,
		agentId: resolveTelegramLegacyStateOwnerAgentId(params.cfg)
	})));
	return persistedPaths.map((persistedPath) => {
		return {
			kind: "plugin-state-import",
			label: "Telegram prompt-context message cache",
			sourcePath: persistedPath,
			targetPath: `plugin state:${TELEGRAM_MESSAGE_CACHE_PERSISTENT_NAMESPACE}`,
			pluginId: "telegram",
			namespace: TELEGRAM_MESSAGE_CACHE_PERSISTENT_NAMESPACE,
			maxEntries: TELEGRAM_MESSAGE_CACHE_PERSISTENT_MAX_MESSAGES,
			scopeKey,
			cleanupSource: "rename",
			preview: `- Telegram prompt-context message cache: ${persistedPath} → plugin state (${TELEGRAM_MESSAGE_CACHE_PERSISTENT_NAMESPACE})`,
			readEntries: () => listTelegramLegacyMessageCacheEntries(persistedPath)
		};
	});
}
function detectTelegramBotInfoCacheLegacyStateMigration(params) {
	return listTelegramAccountIds(params.cfg).flatMap((accountId) => {
		const persistedPath = resolveTelegramBotInfoCachePath(accountId, params.env);
		if (!fileExists(persistedPath)) return [];
		return {
			kind: "plugin-state-import",
			label: "Telegram startup bot info cache",
			sourcePath: persistedPath,
			targetPath: `plugin state:${TELEGRAM_BOT_INFO_CACHE_NAMESPACE}`,
			pluginId: "telegram",
			namespace: TELEGRAM_BOT_INFO_CACHE_NAMESPACE,
			maxEntries: 128,
			scopeKey: "",
			cleanupSource: "rename",
			preview: `- Telegram startup bot info cache: ${persistedPath} → plugin state (${TELEGRAM_BOT_INFO_CACHE_NAMESPACE})`,
			readEntries: () => {
				return listTelegramLegacyBotInfoCacheEntries({
					accountId,
					persistedPath
				});
			}
		};
	});
}
async function detectTelegramUpdateOffsetLegacyStateMigration(params) {
	const { resolveTelegramToken } = await import("../../telegram/token.js");
	const stateDir = resolveMigrationStateDir(params);
	return listTelegramLegacySidecarAccountIds({
		cfg: params.cfg,
		stateDir,
		prefix: "update-offset-",
		suffix: ".json"
	}).flatMap((accountId) => {
		const normalized = normalizeTelegramUpdateOffsetAccountId(accountId);
		const persistedPath = path.join(stateDir, "telegram", `update-offset-${normalized}.json`);
		if (!fileExists(persistedPath)) return [];
		let botToken;
		try {
			botToken = resolveTelegramToken(params.cfg, {
				accountId,
				envToken: params.env.TELEGRAM_BOT_TOKEN
			}).token || void 0;
		} catch {
			botToken = void 0;
		}
		return {
			kind: "plugin-state-import",
			label: "Telegram update offset",
			sourcePath: persistedPath,
			targetPath: `plugin state:${TELEGRAM_UPDATE_OFFSET_NAMESPACE}`,
			pluginId: "telegram",
			namespace: TELEGRAM_UPDATE_OFFSET_NAMESPACE,
			maxEntries: TELEGRAM_UPDATE_OFFSET_MAX_ENTRIES,
			scopeKey: "",
			cleanupSource: "rename",
			preview: `- Telegram update offset: ${persistedPath} → plugin state (${TELEGRAM_UPDATE_OFFSET_NAMESPACE})`,
			readEntries: () => listTelegramLegacyUpdateOffsetEntries({
				accountId,
				persistedPath
			}),
			shouldReplaceExistingEntry: ({ existingValue, incomingValue }) => shouldReplaceTelegramUpdateOffsetEntry({
				existingValue,
				incomingValue,
				botToken
			})
		};
	});
}
function detectTelegramStickerCacheLegacyStateMigration(params) {
	const stateDir = resolveMigrationStateDir(params);
	const persistedPath = path.join(stateDir, "telegram", "sticker-cache.json");
	if (!fileExists(persistedPath)) return [];
	return [{
		kind: "plugin-state-import",
		label: "Telegram sticker cache",
		sourcePath: persistedPath,
		targetPath: `plugin state:${TELEGRAM_STICKER_CACHE_NAMESPACE}`,
		pluginId: "telegram",
		namespace: TELEGRAM_STICKER_CACHE_NAMESPACE,
		maxEntries: TELEGRAM_STICKER_CACHE_MAX_ENTRIES,
		scopeKey: "",
		cleanupSource: "rename",
		preview: `- Telegram sticker cache: ${persistedPath} → plugin state (${TELEGRAM_STICKER_CACHE_NAMESPACE})`,
		readEntries: () => listTelegramLegacyStickerCacheEntries({ persistedPath })
	}];
}
function detectTelegramSentMessageCacheLegacyStateMigration(params) {
	const sourcePaths = listLegacyAgentSessionStorePaths(params).map((storePath) => `${storePath}.telegram-sent-messages.json`).filter(fileExists);
	if (sourcePaths.length === 0) return [];
	const ownerAgentId = resolveTelegramLegacyStateOwnerAgentId(params.cfg);
	const targetStorePath = resolveAgentSessionStorePath({
		...params,
		agentId: ownerAgentId
	});
	return sourcePaths.map((sourcePath) => {
		return {
			kind: "plugin-state-import",
			label: "Telegram sent-message cache",
			sourcePath,
			targetPath: `plugin state:${TELEGRAM_SENT_MESSAGE_CACHE_NAMESPACE}`,
			pluginId: "telegram",
			namespace: TELEGRAM_SENT_MESSAGE_CACHE_NAMESPACE,
			maxEntries: TELEGRAM_SENT_MESSAGE_CACHE_MAX_ENTRIES,
			scopeKey: "",
			cleanupSource: "rename",
			cleanupWhenEmpty: true,
			preview: `- Telegram sent-message cache: ${sourcePath} → plugin state (${TELEGRAM_SENT_MESSAGE_CACHE_NAMESPACE})`,
			readEntries: () => listTelegramLegacySentMessageCacheEntries({
				cfg: params.cfg,
				agentId: ownerAgentId,
				persistedPath: sourcePath,
				targetStorePath
			})
		};
	});
}
function detectTelegramThreadBindingLegacyStateMigration(params) {
	const stateDir = resolveMigrationStateDir(params);
	return listTelegramLegacySidecarAccountIds({
		cfg: params.cfg,
		stateDir,
		prefix: "thread-bindings-",
		suffix: ".json"
	}).flatMap((accountId) => {
		const persistedPath = resolveTelegramThreadBindingsPath(accountId, params.env);
		if (!fileExists(persistedPath)) return [];
		return {
			kind: "plugin-state-import",
			label: "Telegram thread bindings",
			sourcePath: persistedPath,
			targetPath: `plugin state:${TELEGRAM_THREAD_BINDINGS_NAMESPACE}`,
			pluginId: "telegram",
			namespace: TELEGRAM_THREAD_BINDINGS_NAMESPACE,
			maxEntries: TELEGRAM_THREAD_BINDINGS_MAX_ENTRIES,
			scopeKey: "",
			cleanupSource: "rename",
			preview: `- Telegram thread bindings: ${persistedPath} → plugin state (${TELEGRAM_THREAD_BINDINGS_NAMESPACE})`,
			readEntries: () => listTelegramLegacyThreadBindingEntries({
				accountId,
				persistedPath
			})
		};
	});
}
function topicNameCacheImportSource(params) {
	const scope = resolveTopicNameCacheScope(params.targetStorePath ?? params.sourceStorePath);
	return {
		sourcePath: resolveTopicNameCachePath(params.sourceStorePath),
		namespace: resolveTopicNameCacheNamespace(scope)
	};
}
function detectTelegramTopicNameCacheLegacyStateMigration(params) {
	const accountSources = listTelegramAccountIds(params.cfg).map((accountId) => {
		return topicNameCacheImportSource({ sourceStorePath: resolveSessionStorePathCore(params.cfg.session?.store, {
			env: params.env,
			agentId: accountId
		}) });
	});
	const agentSources = listAgentIds(params.cfg).map((agentId) => topicNameCacheImportSource({ sourceStorePath: resolveAgentSessionStorePath({
		...params,
		agentId
	}) }));
	const legacyMainStorePath = resolveAgentSessionStorePath({
		...params,
		agentId: "main"
	});
	const legacyStorePath = resolveLegacySessionStorePath(params);
	const legacySourcePath = resolveTopicNameCachePath(legacyStorePath);
	const fixedSources = [
		...accountSources,
		...agentSources,
		topicNameCacheImportSource({ sourceStorePath: legacyMainStorePath })
	].filter((source) => fileExists(source.sourcePath));
	if (fixedSources.length === 0 && !fileExists(legacySourcePath)) return [];
	let legacySource;
	if (fileExists(legacySourcePath)) {
		const ownerStorePath = resolveAgentSessionStorePath({
			...params,
			agentId: resolveTelegramLegacyStateOwnerAgentId(params.cfg)
		});
		legacySource = topicNameCacheImportSource({
			sourceStorePath: legacyStorePath,
			targetStorePath: params.cfg.agents?.entries !== void 0 || params.cfg.agents?.list !== void 0 ? ownerStorePath : resolveSessionStorePathCore(params.cfg.session?.store, {
				env: params.env,
				agentId: resolveDefaultTelegramAccountId(params.cfg)
			})
		});
	}
	return [...new Map([...fixedSources, ...legacySource ? [legacySource] : []].map((source) => [`${source.sourcePath}\0${source.namespace}`, source])).values()].map((source) => {
		return {
			kind: "plugin-state-import",
			label: "Telegram forum topic-name cache",
			sourcePath: source.sourcePath,
			targetPath: `plugin state:${source.namespace}`,
			pluginId: "telegram",
			namespace: source.namespace,
			maxEntries: TELEGRAM_TOPIC_NAME_CACHE_MAX_ENTRIES,
			scopeKey: "",
			cleanupSource: "rename",
			preview: `- Telegram forum topic-name cache: ${source.sourcePath} → plugin state (${source.namespace})`,
			readEntries: () => {
				return listTelegramLegacyTopicNameCacheEntries({
					persistedPath: source.sourcePath,
					maxEntries: TELEGRAM_TOPIC_NAME_CACHE_MAX_ENTRIES
				});
			}
		};
	});
}
async function detectTelegramLegacyStateMigrations(params) {
	const plans = [];
	plans.push(...await detectTelegramUpdateOffsetLegacyStateMigration(params));
	plans.push(...detectTelegramBotInfoCacheLegacyStateMigration(params));
	plans.push(...detectTelegramStickerCacheLegacyStateMigration(params));
	plans.push(...detectTelegramMessageCacheLegacyStateMigration(params));
	plans.push(...detectTelegramSentMessageCacheLegacyStateMigration(params));
	plans.push(...detectTelegramTopicNameCacheLegacyStateMigration(params));
	plans.push(...detectTelegramThreadBindingLegacyStateMigration(params));
	return plans;
}
//#endregion
//#region extensions/telegram/doctor-contract-api.ts
const stateMigrations = [definePluginDoctorMigrationFromPlans({
	id: "telegram-legacy-state",
	label: "Telegram legacy state",
	resolvePlans: detectTelegramLegacyStateMigrations
})];
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig, stateMigrations };
