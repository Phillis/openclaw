import { t as createSubsystemLogger } from "./subsystem-CDLhGl2-.js";
import { i as resolveLegacyInheritedAuthDir, r as resolveLegacyInheritedAuthAgentId } from "./legacy-inherited-auth-dir-DqCM942-.js";
import { f as listProviderUsagePluginDescriptors } from "./provider-runtime-D4zJxL0d.js";
import { r as ensureAuthProfileStore } from "./store-2zwMbXSG.js";
import { t as resolveEnvApiKey } from "./model-auth-env-B8fM73iy.js";
import "./auth-profiles-i3N9ji0c.js";
import { t as externalCliDiscoveryForConfigStatus } from "./external-cli-discovery-DM5kEN0f.js";
import { x as resolveUsableCustomProviderApiKey } from "./model-auth-provider-config-BoRNjJxC.js";
import "./model-auth-Dv8Z8nNS.js";
import { n as fingerprintAuthProfileOwnerShape, o as fingerprintResolvedProviderAuth, t as fingerprintAuthProfileCredential } from "./execution-auth-binding-CmucNoqo.js";
import { t as formatForLog } from "./ws-log-DAJ6wT2O.js";
import { t as loadProviderUsageSummary } from "./provider-usage.load-BJ8FsHHp.js";
//#region src/gateway/server-methods/models-auth-status-usage-cache.ts
const log = createSubsystemLogger("provider-usage-cache");
const USAGE_CACHE_TTL_MS = 6e4;
const usageCacheByAgentId = /* @__PURE__ */ new Map();
const usageRefreshByAgentId = /* @__PURE__ */ new Map();
let cacheGeneration = 0;
function sortedRecordEntries(value) {
	return Object.entries(value ?? {}).toSorted(([left], [right]) => left.localeCompare(right));
}
function fingerprintProviderUsageCredentials(params) {
	const profiles = Object.entries(params.store.profiles).toSorted(([left], [right]) => left.localeCompare(right)).map(([profileId, credential]) => {
		return fingerprintAuthProfileCredential({
			profileId,
			credential
		}) ?? fingerprintAuthProfileOwnerShape({
			profileId,
			credential
		}) ?? `${profileId}:${credential.type}:${credential.provider}`;
	});
	const direct = [...params.directApiKeys].toSorted(([left], [right]) => left.localeCompare(right)).map(([provider, evidence]) => {
		const configured = resolveUsableCustomProviderApiKey({
			cfg: params.cfg,
			provider,
			env: process.env
		});
		const envValue = evidence?.envVar ? process.env[evidence.envVar]?.trim() : void 0;
		const resolved = configured ?? (envValue ? {
			apiKey: envValue,
			source: `env: ${evidence?.envVar}`
		} : void 0);
		return [provider, (resolved ? fingerprintResolvedProviderAuth({
			apiKey: resolved.apiKey,
			source: resolved.source,
			mode: "api-key"
		}) : void 0) ?? null];
	});
	return JSON.stringify({
		profiles,
		direct,
		order: sortedRecordEntries(params.store.order),
		lastGood: sortedRecordEntries(params.store.lastGood),
		usageStats: sortedRecordEntries(params.store.usageStats)
	});
}
function clearModelAuthStatusUsageCache() {
	cacheGeneration += 1;
	usageCacheByAgentId.clear();
	usageRefreshByAgentId.clear();
}
function providerUsageCacheKey(providerIds) {
	return providerIds.toSorted().join("\0");
}
function scopeProviderUsageCredentialKey(credentialKey, providerIds) {
	try {
		const parsed = JSON.parse(credentialKey);
		if (!Array.isArray(parsed.direct)) return credentialKey;
		const providers = new Set(providerIds);
		return JSON.stringify({
			...parsed,
			direct: parsed.direct.filter(([provider, fingerprint]) => providers.has(provider) && fingerprint !== null)
		});
	} catch {
		return credentialKey;
	}
}
function mapProviderUsage(usage) {
	const usageByProvider = /* @__PURE__ */ new Map();
	for (const snap of usage.providers) usageByProvider.set(snap.provider, {
		windows: snap.windows,
		...snap.summary ? { summary: snap.summary } : {},
		...snap.plan ? { plan: snap.plan } : {},
		...snap.billing?.length ? { billing: snap.billing } : {},
		...snap.accountEmail ? { accountEmail: snap.accountEmail } : {}
	});
	return usageByProvider;
}
function scheduleProviderUsageRefresh(params) {
	const active = usageRefreshByAgentId.get(params.agentId);
	if (active?.agentDir === params.agentDir && active.configRef === params.configRef && active.credentialKey === params.credentialKey && active.providerKey === params.providerKey) return active.promise;
	const publishGeneration = cacheGeneration;
	const promise = loadProviderUsageSummary({
		providers: params.providerIds,
		agentDir: params.agentDir,
		timeoutMs: 3500
	}).then((usage) => {
		if (publishGeneration === cacheGeneration && usageRefreshByAgentId.get(params.agentId) === refresh) usageCacheByAgentId.set(params.agentId, {
			agentDir: params.agentDir,
			configRef: params.configRef,
			credentialKey: params.credentialKey,
			providerKey: params.providerKey,
			refreshedAt: Date.now(),
			summary: usage,
			usageByProvider: mapProviderUsage(usage)
		});
		return usage;
	}).catch((err) => {
		log.debug(`usage refresh failed: providers=${params.providerIds.join(",")} error=${formatForLog(err)}`);
		throw err;
	}).finally(() => {
		if (usageRefreshByAgentId.get(params.agentId) === refresh) usageRefreshByAgentId.delete(params.agentId);
	});
	const refresh = {
		agentDir: params.agentDir,
		configRef: params.configRef,
		credentialKey: params.credentialKey,
		providerKey: params.providerKey,
		promise
	};
	usageRefreshByAgentId.set(params.agentId, refresh);
	return promise;
}
function resolveProviderUsageCacheRead(params) {
	const providerIds = params.providerIds.toSorted();
	const providerKey = providerUsageCacheKey(providerIds);
	const credentialKey = scopeProviderUsageCredentialKey(params.credentialKey, providerIds);
	const cached = usageCacheByAgentId.get(params.agentId);
	const matching = cached?.agentDir === params.agentDir && cached.configRef === params.configRef && cached.credentialKey === credentialKey && cached.providerKey === providerKey ? cached : void 0;
	return {
		credentialKey,
		matching,
		needsRefresh: params.forceRefresh === true || !matching || params.now - matching.refreshedAt >= USAGE_CACHE_TTL_MS,
		providerIds,
		providerKey
	};
}
function readProviderUsageStaleWhileRevalidate(params) {
	if (params.providerIds.length === 0) {
		usageCacheByAgentId.delete(params.agentId);
		return /* @__PURE__ */ new Map();
	}
	const { credentialKey, matching, needsRefresh, providerIds, providerKey } = resolveProviderUsageCacheRead(params);
	if (needsRefresh) scheduleProviderUsageRefresh({
		agentId: params.agentId,
		agentDir: params.agentDir,
		configRef: params.configRef,
		credentialKey,
		providerIds,
		providerKey
	}).catch(() => {});
	return matching?.usageByProvider ?? /* @__PURE__ */ new Map();
}
/** Returns cached provider usage, awaiting only a cold miss and refreshing stale data in place. */
async function loadProviderUsageSummaryStaleWhileRevalidate(params) {
	if (params.providerIds.length === 0) {
		usageCacheByAgentId.delete(params.agentId);
		return {
			updatedAt: params.now,
			providers: []
		};
	}
	const { credentialKey, matching, needsRefresh, providerIds, providerKey } = resolveProviderUsageCacheRead(params);
	if (matching && !needsRefresh) return matching.summary;
	const refresh = scheduleProviderUsageRefresh({
		agentId: params.agentId,
		agentDir: params.agentDir,
		configRef: params.configRef,
		credentialKey,
		providerIds,
		providerKey
	});
	if (matching) {
		refresh.catch(() => {});
		return matching.summary;
	}
	return await refresh;
}
/** Shares the models.authStatus cache contract with the unscoped usage.status RPC. */
async function loadUsageStatusStaleWhileRevalidate(params) {
	const agentId = resolveLegacyInheritedAuthAgentId(params.config);
	const agentDir = resolveLegacyInheritedAuthDir(params.config);
	const store = ensureAuthProfileStore(agentDir, { externalCli: externalCliDiscoveryForConfigStatus({ cfg: params.config }) });
	const providerIds = listProviderUsagePluginDescriptors({
		config: params.config,
		env: process.env
	}).map((descriptor) => descriptor.provider);
	const directApiKeys = /* @__PURE__ */ new Map();
	for (const provider of providerIds) {
		const resolved = resolveUsableCustomProviderApiKey({
			cfg: params.config,
			provider,
			env: process.env
		}) ?? resolveEnvApiKey(provider, process.env, { config: params.config });
		if (!resolved) continue;
		const envVar = resolved.source.match(/^(?:shell env|env): ([A-Z][A-Z0-9_]*)$/u)?.[1];
		directApiKeys.set(provider, envVar ? {
			source: "env",
			envVar
		} : { source: "config" });
	}
	return await loadProviderUsageSummaryStaleWhileRevalidate({
		agentId,
		agentDir,
		configRef: params.config,
		credentialKey: fingerprintProviderUsageCredentials({
			cfg: params.config,
			directApiKeys,
			store
		}),
		providerIds,
		now: params.now ?? Date.now()
	});
}
//#endregion
export { readProviderUsageStaleWhileRevalidate as i, fingerprintProviderUsageCredentials as n, loadUsageStatusStaleWhileRevalidate as r, clearModelAuthStatusUsageCache as t };
