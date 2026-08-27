import { _ as sortUniqueStrings, v as uniqueStrings } from "./string-normalization-e_fvmxMf.js";
import { t as pruneMapToMaxSize } from "./map-size-DAGm21RM.js";
import { t as isBlockedObjectKey } from "./prototype-keys-CuYw53fZ.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { t as sanitizeForLog } from "./ansi-DjDeieuH.js";
import "./agent-scope-BizOtGGz.js";
import { v as tryResolveConfiguredAgentWorkspaceDir } from "./agent-scope-config-BdXMWufB.js";
import { n as normalizeAccountId, r as normalizeOptionalAccountId, t as DEFAULT_ACCOUNT_ID } from "./account-id-BRqK6RmF.js";
import { t as createSubsystemLogger } from "./subsystem-CDLhGl2-.js";
import { n as getCachedPluginModuleLoader } from "./plugin-module-loader-cache-DW5Tr4Iu.js";
import { n as registerPluginMetadataProcessMemoLifecycleClear } from "./plugin-metadata-lifecycle-DQWVBcP_.js";
import { i as getBundledChannelSetupPlugin } from "./bundled-CY1EA4MS.js";
import { s as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-BV6-k_Y4.js";
import { o as getActivePluginChannelRegistryVersion } from "./runtime-g0R28Sy0.js";
import { t as resolveConfigWidePluginManifestRegistry } from "./io.plugin-metadata-BQhELyO0.js";
import { d as resolveDiscoverableScopedChannelPluginIds, n as hasExplicitChannelConfig, o as listConfiguredChannelIdsForReadOnlyScope } from "./channel-presence-policy-BGHW2ysK.js";
import { x as resolveRuntimeConfigCacheKey } from "./runtime-snapshot-Dp7mvsA3.js";
import { i as listChannelPlugins } from "./registry-B3yYjPW1.js";
import { a as resolveSetupChannelRegistration, t as channelPluginIdBelongsToManifest } from "./loader-channel-setup-D4vvII1R.js";
import { n as resolveNormalizedAccountEntry } from "./account-lookup-gtl3eJfy.js";
import "./channel-plugin-ids-D_pdFp_m.js";
import { s as resolveListedDefaultAccountId } from "./account-helpers-CEliAVvN.js";
import { n as normalizeChannelCommandDefaults, r as readOwnRecordValue, t as isSafeManifestChannelId } from "./read-only-command-defaults-BOtbfxpr.js";
import { createHash } from "node:crypto";
//#region src/channels/plugins/read-only.ts
/**
* Read-only channel plugin discovery.
*
* Builds lightweight channel plugin views from config, manifests, and setup metadata.
*/
const moduleLoaders = /* @__PURE__ */ new Map();
const log = createSubsystemLogger("channels");
const readOnlyChannelPluginResolutionCache = /* @__PURE__ */ new Map();
const MAX_READ_ONLY_CHANNEL_PLUGIN_RESOLUTION_CACHE_SIZE = 8;
const readOnlyChannelPluginObjectIds = /* @__PURE__ */ new WeakMap();
let nextReadOnlyChannelPluginObjectId = 1;
registerPluginMetadataProcessMemoLifecycleClear(() => {
	readOnlyChannelPluginResolutionCache.clear();
});
function cloneReadOnlyChannelPluginResolution(resolution) {
	return {
		plugins: [...resolution.plugins],
		manifestRecords: [...resolution.manifestRecords],
		configuredChannelIds: [...resolution.configuredChannelIds],
		missingConfiguredChannelIds: [...resolution.missingConfiguredChannelIds],
		loadFailures: resolution.loadFailures.map((failure) => ({ ...failure }))
	};
}
function rememberReadOnlyChannelPluginResolution(key, resolution) {
	if (readOnlyChannelPluginResolutionCache.has(key)) readOnlyChannelPluginResolutionCache.delete(key);
	readOnlyChannelPluginResolutionCache.set(key, cloneReadOnlyChannelPluginResolution(resolution));
	pruneMapToMaxSize(readOnlyChannelPluginResolutionCache, MAX_READ_ONLY_CHANNEL_PLUGIN_RESOLUTION_CACHE_SIZE);
}
function resolveReadOnlyChannelPluginResolutionCacheKey(params) {
	if (params.env !== process.env) return null;
	if (params.options.includePersistedAuthState !== false) return null;
	const activationSourceConfig = params.options.activationSourceConfig ?? params.cfg;
	return [
		resolveRuntimeConfigCacheKey(params.cfg),
		activationSourceConfig === params.cfg ? "activation:same" : resolveRuntimeConfigCacheKey(activationSourceConfig),
		`channel-registry:${getActivePluginChannelRegistryVersion()}`,
		`loaded-channels:${fingerprintLoadedChannelPlugins(params.loadedChannelPlugins)}`,
		`env:${hashEnvironment(params.env)}`,
		`cwd:${process.cwd()}`,
		`state:${params.options.stateDir ?? ""}`,
		`workspace:${params.workspaceDir}`,
		`setup:${params.options.includeSetupFallbackPlugins === true}`
	].join("\0");
}
function resolveReadOnlyChannelPluginObjectId(plugin) {
	const existing = readOnlyChannelPluginObjectIds.get(plugin);
	if (existing !== void 0) return existing;
	const next = nextReadOnlyChannelPluginObjectId;
	nextReadOnlyChannelPluginObjectId += 1;
	readOnlyChannelPluginObjectIds.set(plugin, next);
	return next;
}
function fingerprintLoadedChannelPlugins(plugins) {
	return plugins.map((plugin) => `${plugin.id}:${resolveReadOnlyChannelPluginObjectId(plugin)}`).join(",");
}
function hashEnvironment(env) {
	const hash = createHash("sha256");
	for (const key of Object.keys(env).toSorted((left, right) => left.localeCompare(right))) {
		hash.update(key);
		hash.update("\0");
		hash.update(env[key] ?? "");
		hash.update("\0");
	}
	return hash.digest("base64url");
}
function addChannelPlugins(byId, plugins, options) {
	for (const plugin of plugins) {
		if (!plugin) continue;
		if (options?.onlyIds && !options.onlyIds.has(plugin.id)) continue;
		if (options?.allowOverwrite === false && byId.has(plugin.id)) continue;
		byId.set(plugin.id, plugin);
	}
}
function rebindChannelScopedString(value, sourceChannelId, targetChannelId) {
	const sourcePrefix = `channels.${sourceChannelId}`;
	if (value === sourcePrefix) return `channels.${targetChannelId}`;
	if (value.startsWith(`${sourcePrefix}.`)) return `channels.${targetChannelId}${value.slice(sourcePrefix.length)}`;
	return value;
}
function normalizeManifestText(value, fallback) {
	return sanitizeForLog(value?.trim() || fallback).trim();
}
function rebindChannelConfig(cfg, sourceChannelId, targetChannelId) {
	if (sourceChannelId === targetChannelId || !cfg.channels) return cfg;
	return {
		...cfg,
		channels: {
			...cfg.channels,
			[sourceChannelId]: cfg.channels[targetChannelId]
		}
	};
}
function restoreReboundChannelConfig(params) {
	if (params.sourceChannelId === params.targetChannelId || !params.updated.channels) return params.updated;
	const nextChannels = { ...params.updated.channels };
	if (Object.hasOwn(nextChannels, params.sourceChannelId)) nextChannels[params.targetChannelId] = nextChannels[params.sourceChannelId];
	else delete nextChannels[params.targetChannelId];
	if (params.original.channels && Object.hasOwn(params.original.channels, params.sourceChannelId)) nextChannels[params.sourceChannelId] = params.original.channels[params.sourceChannelId];
	else delete nextChannels[params.sourceChannelId];
	return {
		...params.updated,
		channels: nextChannels
	};
}
function getChannelConfigRecord(cfg, channelId) {
	if (!isSafeManifestChannelId(channelId)) return {};
	const channels = cfg.channels;
	if (!channels || typeof channels !== "object" || Array.isArray(channels)) return {};
	const entry = readOwnRecordValue(channels, channelId);
	return entry && typeof entry === "object" && !Array.isArray(entry) ? entry : {};
}
function normalizeManifestAccountConfigKey(accountId) {
	return normalizeOptionalAccountId(accountId) ?? "";
}
function listManifestChannelAccountIds(cfg, channelId) {
	const accounts = getChannelConfigRecord(cfg, channelId).accounts;
	if (accounts && typeof accounts === "object" && !Array.isArray(accounts)) return sortUniqueStrings(Object.keys(accounts).filter((accountId) => !isBlockedObjectKey(accountId)).map((accountId) => normalizeOptionalAccountId(accountId)).filter((accountId) => Boolean(accountId)));
	return hasExplicitChannelConfig({
		config: cfg,
		channelId
	}) ? [DEFAULT_ACCOUNT_ID] : [];
}
function resolveManifestChannelDefaultAccountId(cfg, channelId) {
	const channelConfig = getChannelConfigRecord(cfg, channelId);
	const configuredDefaultAccountId = normalizeOptionalAccountId(typeof channelConfig.defaultAccount === "string" ? channelConfig.defaultAccount : void 0);
	return resolveListedDefaultAccountId({
		accountIds: listManifestChannelAccountIds(cfg, channelId),
		configuredDefaultAccountId
	});
}
function resolveManifestChannelAccountConfig(params) {
	const channelConfig = getChannelConfigRecord(params.cfg, params.channelId);
	const resolvedAccountId = normalizeAccountId(params.accountId);
	const accounts = channelConfig.accounts;
	if (accounts && typeof accounts === "object" && !Array.isArray(accounts)) {
		const accountConfig = resolveNormalizedAccountEntry(accounts, resolvedAccountId, normalizeManifestAccountConfigKey);
		if (accountConfig && typeof accountConfig === "object" && !Array.isArray(accountConfig)) return accountConfig;
	}
	return channelConfig;
}
function buildManifestChannelPlugin(params) {
	if (!isSafeManifestChannelId(params.channelId)) return;
	const catalogMeta = params.record.channelCatalogMeta?.id === params.channelId ? params.record.channelCatalogMeta : void 0;
	const channelConfigValue = params.record.channelConfigs ? readOwnRecordValue(params.record.channelConfigs, params.channelId) : void 0;
	if (!catalogMeta && (!channelConfigValue || typeof channelConfigValue !== "object" || Array.isArray(channelConfigValue)) && !params.record.channels.includes(params.channelId)) return;
	const channelConfig = channelConfigValue && typeof channelConfigValue === "object" && !Array.isArray(channelConfigValue) ? channelConfigValue : void 0;
	const label = normalizeManifestText(channelConfig?.label ?? catalogMeta?.label, params.record.name || params.channelId) || params.channelId;
	const blurb = normalizeManifestText(channelConfig?.description ?? catalogMeta?.blurb, params.record.description || "");
	const commands = normalizeChannelCommandDefaults(channelConfig?.commands ?? catalogMeta?.commands);
	return {
		id: params.channelId,
		meta: {
			id: params.channelId,
			label,
			selectionLabel: label,
			docsPath: `/channels/${encodeURIComponent(params.channelId)}`,
			blurb,
			...channelConfig?.preferOver?.length ? { preferOver: channelConfig.preferOver } : catalogMeta?.preferOver?.length ? { preferOver: catalogMeta.preferOver } : {}
		},
		capabilities: { chatTypes: ["direct"] },
		...commands ? { commands } : {},
		...channelConfig ? { configSchema: {
			schema: channelConfig.schema,
			...channelConfig.uiHints ? { uiHints: channelConfig.uiHints } : {},
			...channelConfig.runtime ? { runtime: channelConfig.runtime } : {}
		} } : {},
		config: {
			listAccountIds: (cfg) => listManifestChannelAccountIds(cfg, params.channelId),
			defaultAccountId: (cfg) => resolveManifestChannelDefaultAccountId(cfg, params.channelId),
			resolveAccount: (cfg, accountId) => ({
				accountId: normalizeAccountId(accountId),
				config: resolveManifestChannelAccountConfig({
					cfg,
					channelId: params.channelId,
					accountId
				})
			}),
			isEnabled: (_account, cfg) => getChannelConfigRecord(cfg, params.channelId).enabled !== false,
			isConfigured: (_account, cfg) => hasExplicitChannelConfig({
				config: cfg,
				channelId: params.channelId
			}),
			hasConfiguredState: ({ cfg }) => hasExplicitChannelConfig({
				config: cfg,
				channelId: params.channelId
			})
		}
	};
}
function canUseManifestChannelPlugin(record, channelId) {
	if (Boolean(record.channelConfigs && Object.hasOwn(record.channelConfigs, channelId))) return record.setup?.requiresRuntime === false || !record.setupSource;
	return record.channelCatalogMeta?.id === channelId || !record.setupSource;
}
function loadSetupChannelPluginFromManifestRecord(params) {
	if (!params.record.setupSource || !params.record.channels.includes(params.channelId)) return {};
	try {
		const registration = resolveSetupChannelRegistration(getCachedPluginModuleLoader({
			cache: moduleLoaders,
			modulePath: params.record.setupSource,
			importerUrl: import.meta.url,
			preferBuiltDist: true,
			loaderFilename: import.meta.url,
			tryNative: true,
			cacheScopeKey: "read-only-setup-entry"
		})(params.record.setupSource));
		if (registration.loadError) return { failure: {
			channelId: params.channelId,
			pluginId: params.record.id,
			source: params.record.setupSource,
			message: `failed to load setup entry: ${formatErrorMessage(registration.loadError)}`
		} };
		if (!registration.plugin) return {};
		if (!channelPluginIdBelongsToManifest({
			channelId: registration.plugin.id,
			pluginId: params.record.id,
			manifestChannels: params.record.channels
		})) return {};
		return { plugin: registration.plugin };
	} catch (error) {
		const detail = formatErrorMessage(error);
		log.warn(`[channels] failed to load channel setup ${params.record.id}: ${detail}`);
		return { failure: {
			channelId: params.channelId,
			pluginId: params.record.id,
			source: params.record.setupSource,
			message: `failed to load setup entry: ${detail}`
		} };
	}
}
function rebindChannelPluginConfig(config, sourceChannelId, targetChannelId) {
	const rebind = (cfg) => rebindChannelConfig(cfg, sourceChannelId, targetChannelId);
	return {
		...config,
		listAccountIds: (cfg) => config.listAccountIds(rebind(cfg)),
		resolveAccount: (cfg, accountId) => config.resolveAccount(rebind(cfg), accountId),
		inspectAccount: config.inspectAccount ? (cfg, accountId) => config.inspectAccount?.(rebind(cfg), accountId) : void 0,
		defaultAccountId: config.defaultAccountId ? (cfg) => config.defaultAccountId?.(rebind(cfg)) ?? "" : void 0,
		setAccountEnabled: config.setAccountEnabled ? (params) => restoreReboundChannelConfig({
			original: params.cfg,
			updated: config.setAccountEnabled?.({
				...params,
				cfg: rebind(params.cfg)
			}) ?? params.cfg,
			sourceChannelId,
			targetChannelId
		}) : void 0,
		deleteAccount: config.deleteAccount ? (params) => restoreReboundChannelConfig({
			original: params.cfg,
			updated: config.deleteAccount?.({
				...params,
				cfg: rebind(params.cfg)
			}) ?? params.cfg,
			sourceChannelId,
			targetChannelId
		}) : void 0,
		isEnabled: config.isEnabled ? (account, cfg) => config.isEnabled?.(account, rebind(cfg)) ?? false : void 0,
		disabledReason: config.disabledReason ? (account, cfg) => config.disabledReason?.(account, rebind(cfg)) ?? "" : void 0,
		isConfigured: config.isConfigured ? (account, cfg) => config.isConfigured?.(account, rebind(cfg)) ?? false : void 0,
		isLinked: config.isLinked ? (account, cfg) => config.isLinked?.(account, rebind(cfg)) ?? "unknown" : void 0,
		unconfiguredReason: config.unconfiguredReason ? (account, cfg) => config.unconfiguredReason?.(account, rebind(cfg)) ?? "" : void 0,
		unlinkedReason: config.unlinkedReason ? (account, cfg) => config.unlinkedReason?.(account, rebind(cfg)) ?? "" : void 0,
		describeAccount: config.describeAccount ? (account, cfg) => config.describeAccount(account, rebind(cfg)) : void 0,
		resolveAllowFrom: config.resolveAllowFrom ? (params) => config.resolveAllowFrom?.({
			...params,
			cfg: rebind(params.cfg)
		}) : void 0,
		formatAllowFrom: config.formatAllowFrom ? (params) => config.formatAllowFrom?.({
			...params,
			cfg: rebind(params.cfg)
		}) ?? [] : void 0,
		hasConfiguredState: config.hasConfiguredState ? (params) => config.hasConfiguredState?.({
			...params,
			cfg: rebind(params.cfg)
		}) ?? false : void 0,
		hasPersistedAuthState: config.hasPersistedAuthState ? (params) => config.hasPersistedAuthState?.({
			...params,
			cfg: rebind(params.cfg)
		}) ?? false : void 0,
		resolveDefaultTo: config.resolveDefaultTo ? (params) => config.resolveDefaultTo?.({
			...params,
			cfg: rebind(params.cfg)
		}) : void 0
	};
}
function rebindChannelPluginSecrets(secrets, sourceChannelId, targetChannelId) {
	if (!secrets) return;
	return {
		...secrets,
		secretTargetRegistryEntries: secrets.secretTargetRegistryEntries?.map((entry) => ({
			...entry,
			id: rebindChannelScopedString(entry.id, sourceChannelId, targetChannelId),
			pathPattern: rebindChannelScopedString(entry.pathPattern, sourceChannelId, targetChannelId),
			...entry.refPathPattern ? { refPathPattern: rebindChannelScopedString(entry.refPathPattern, sourceChannelId, targetChannelId) } : {}
		})),
		unsupportedSecretRefSurfacePatterns: secrets.unsupportedSecretRefSurfacePatterns?.map((pattern) => rebindChannelScopedString(pattern, sourceChannelId, targetChannelId)),
		collectRuntimeConfigAssignments: secrets.collectRuntimeConfigAssignments ? (params) => secrets.collectRuntimeConfigAssignments?.({
			...params,
			config: rebindChannelConfig(params.config, sourceChannelId, targetChannelId)
		}) : void 0
	};
}
function cloneChannelPluginForChannelId(plugin, channelId) {
	if (plugin.id === channelId && plugin.meta.id === channelId) return plugin;
	const sourceChannelId = plugin.id;
	return {
		...plugin,
		id: channelId,
		meta: {
			...plugin.meta,
			id: channelId
		},
		config: rebindChannelPluginConfig(plugin.config, sourceChannelId, channelId),
		secrets: rebindChannelPluginSecrets(plugin.secrets, sourceChannelId, channelId)
	};
}
function addManifestChannelPlugins(byId, records, options) {
	const channelIds = new Set(options.channelIds);
	for (const record of records) {
		if (!options.pluginIds.has(record.id)) continue;
		for (const channelId of record.channels) {
			if (!isSafeManifestChannelId(channelId)) continue;
			if (!channelIds.has(channelId)) continue;
			if (!canUseManifestChannelPlugin(record, channelId)) continue;
			addChannelPlugins(byId, [buildManifestChannelPlugin({
				record,
				channelId
			})], {
				onlyIds: channelIds,
				allowOverwrite: false
			});
		}
	}
}
function resolveReadOnlyWorkspaceDir(cfg, options) {
	return options.workspaceDir ?? tryResolveConfiguredAgentWorkspaceDir(cfg, options.env);
}
function listExternalChannelManifestRecords(records) {
	return records.filter((plugin) => plugin.origin !== "bundled" && plugin.channels.length > 0);
}
function listBundledChannelManifestRecords(records) {
	return records.filter((plugin) => plugin.origin === "bundled" && plugin.channels.length > 0);
}
function resolveExternalReadOnlyChannelPluginIds(params) {
	if (params.channelIds.length === 0) return [];
	const candidatePluginIds = resolveDiscoverableScopedChannelPluginIds({
		config: params.cfg,
		activationSourceConfig: params.activationSourceConfig,
		channelIds: params.channelIds,
		workspaceDir: params.workspaceDir,
		env: params.env,
		manifestRecords: params.records
	});
	if (candidatePluginIds.length === 0) return [];
	const requestedChannelIds = new Set(params.channelIds);
	const candidatePluginIdSet = new Set(candidatePluginIds);
	return params.records.filter((plugin) => candidatePluginIdSet.has(plugin.id) && plugin.channels.some((channelId) => requestedChannelIds.has(channelId))).map((plugin) => plugin.id).toSorted((left, right) => left.localeCompare(right));
}
function listReadOnlyChannelPluginsForConfig(cfg, options) {
	return resolveReadOnlyChannelPluginsForConfig(cfg, options).plugins;
}
function resolveReadOnlyChannelPluginsForConfig(cfg, options = {}) {
	const env = options.env ?? process.env;
	const workspaceDir = resolveReadOnlyWorkspaceDir(cfg, options);
	const loadedChannelPlugins = listChannelPlugins();
	const cacheKey = resolveReadOnlyChannelPluginResolutionCacheKey({
		cfg,
		options,
		env,
		loadedChannelPlugins,
		workspaceDir
	});
	const cached = cacheKey ? readOnlyChannelPluginResolutionCache.get(cacheKey) : void 0;
	if (cached) return cloneReadOnlyChannelPluginResolution(cached);
	const manifestRecords = options.metadataSnapshot?.plugins ?? (options.workspaceDir !== void 0 ? resolvePluginMetadataSnapshot({
		config: cfg,
		stateDir: options.stateDir,
		workspaceDir: options.workspaceDir,
		env,
		allowWorkspaceScopedCurrent: true
	}).plugins : resolveConfigWidePluginManifestRegistry({
		config: cfg,
		stateDir: options.stateDir,
		env
	}).plugins);
	const bundledManifestRecords = listBundledChannelManifestRecords(manifestRecords);
	const externalManifestRecords = listExternalChannelManifestRecords(manifestRecords);
	const activationSourceConfig = options.activationSourceConfig ?? cfg;
	const configuredChannelIds = uniqueStrings([...listConfiguredChannelIdsForReadOnlyScope({
		config: cfg,
		activationSourceConfig,
		workspaceDir,
		env,
		includePersistedAuthState: options.includePersistedAuthState,
		manifestRecords
	}), ...activationSourceConfig === cfg ? [] : listConfiguredChannelIdsForReadOnlyScope({
		config: activationSourceConfig,
		activationSourceConfig,
		workspaceDir,
		env,
		includePersistedAuthState: options.includePersistedAuthState,
		manifestRecords
	})]).filter(isSafeManifestChannelId);
	const byId = /* @__PURE__ */ new Map();
	const loadFailures = [];
	addChannelPlugins(byId, loadedChannelPlugins);
	if (options.includeSetupFallbackPlugins === true) for (const channelId of configuredChannelIds) {
		if (byId.has(channelId)) continue;
		const setupResults = bundledManifestRecords.filter((record) => record.channels.includes(channelId)).map((record) => loadSetupChannelPluginFromManifestRecord({
			record,
			channelId
		}));
		loadFailures.push(...setupResults.map((result) => result.failure).filter((failure) => Boolean(failure)));
		const bundledSetupPlugin = setupResults.map((result) => result.plugin).find((plugin) => plugin) ?? getBundledChannelSetupPlugin(channelId, env);
		addChannelPlugins(byId, [bundledSetupPlugin && cloneChannelPluginForChannelId(bundledSetupPlugin, channelId)]);
	}
	const bundledManifestMissingChannelIds = configuredChannelIds.filter((channelId) => !byId.has(channelId));
	const bundledManifestMissingChannelIdSet = new Set(bundledManifestMissingChannelIds);
	addManifestChannelPlugins(byId, bundledManifestRecords, {
		pluginIds: new Set(bundledManifestRecords.flatMap((record) => record.channels.some((channelId) => bundledManifestMissingChannelIdSet.has(channelId)) ? [record.id] : [])),
		channelIds: bundledManifestMissingChannelIds
	});
	const missingConfiguredChannelIds = configuredChannelIds.filter((channelId) => !byId.has(channelId));
	const externalPluginIds = resolveExternalReadOnlyChannelPluginIds({
		cfg,
		activationSourceConfig: options.activationSourceConfig ?? cfg,
		channelIds: missingConfiguredChannelIds,
		records: externalManifestRecords,
		workspaceDir,
		env
	});
	if (externalPluginIds.length > 0) {
		const externalPluginIdSet = new Set(externalPluginIds);
		if (options.includeSetupFallbackPlugins === true) {
			const missingChannelIdSet = new Set(missingConfiguredChannelIds);
			for (const record of externalManifestRecords) {
				if (!externalPluginIdSet.has(record.id) || !record.setupSource) continue;
				const ownedMissingChannelIds = record.channels.filter((channelId) => missingChannelIdSet.has(channelId) && !byId.has(channelId));
				const firstChannelId = ownedMissingChannelIds[0];
				if (!firstChannelId) continue;
				const setupResult = loadSetupChannelPluginFromManifestRecord({
					record,
					channelId: firstChannelId
				});
				const failure = setupResult.failure;
				if (failure) {
					loadFailures.push(...ownedMissingChannelIds.map((channelId) => ({
						...failure,
						channelId
					})));
					continue;
				}
				const plugin = setupResult.plugin;
				if (plugin) addChannelPlugins(byId, ownedMissingChannelIds.map((channelId) => cloneChannelPluginForChannelId(plugin, channelId)), { allowOverwrite: false });
			}
		}
		addManifestChannelPlugins(byId, externalManifestRecords, {
			pluginIds: externalPluginIdSet,
			channelIds: missingConfiguredChannelIds.filter((channelId) => !byId.has(channelId))
		});
	}
	const resolution = {
		plugins: [...byId.values()],
		manifestRecords,
		configuredChannelIds,
		missingConfiguredChannelIds: configuredChannelIds.filter((channelId) => !byId.has(channelId)),
		loadFailures
	};
	if (cacheKey) rememberReadOnlyChannelPluginResolution(cacheKey, resolution);
	return cloneReadOnlyChannelPluginResolution(resolution);
}
//#endregion
export { resolveReadOnlyChannelPluginsForConfig as n, listReadOnlyChannelPluginsForConfig as t };
