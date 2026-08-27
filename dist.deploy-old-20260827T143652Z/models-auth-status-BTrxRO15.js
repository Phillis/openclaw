import { o as asDateTimestampMs } from "./number-coercion-oCkfUEEq.js";
import { n as findNormalizedProviderValue, r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
import { t as createSubsystemLogger } from "./subsystem-CDLhGl2-.js";
import { l as hasConfiguredSecretInput, s as coerceSecretRef } from "./types.secrets-BrIfhxSG.js";
import { n as resolveProviderIdForAuth } from "./provider-auth-aliases-BdBosV0l.js";
import { t as ErrorCodes } from "./gateway-error-details-BWo6Le6w.js";
import { n as listProfilesForProvider } from "./profile-list-BA-END0g.js";
import { c as isNonSecretApiKeyMarker, g as resolveProviderEnvAuthLookupMaps, h as listProviderEnvAuthLookupKeys, s as isKnownEnvApiKeyMarker } from "./model-auth-markers-B67UeNMn.js";
import { s as errorShape } from "./error-codes-CMSvT5-d.js";
import { a as ensureAuthProfileStoreWithoutExternalProfiles, h as resolvePersistedAuthProfileOwnerAgentDir } from "./store-2zwMbXSG.js";
import { r as resolveProviderEnvAuthEvidence } from "./model-auth-env-B8fM73iy.js";
import "./auth-profiles-i3N9ji0c.js";
import { t as externalCliDiscoveryForConfigStatus } from "./external-cli-discovery-DM5kEN0f.js";
import { i as removeAuthProfilesAcrossOwnerStores, o as removeProviderAuthProfilesWithLock } from "./profiles-C-iqv9vt.js";
import { b as resolveProviderEntryApiKeyProfileReference, x as resolveUsableCustomProviderApiKey } from "./model-auth-provider-config-BoRNjJxC.js";
import "./model-auth-Dv8Z8nNS.js";
import { r as clearCurrentProviderAuthState } from "./model-provider-auth-state-DW_JYm-o.js";
import { i as warmCurrentProviderAuthStateOffMainThread } from "./model-provider-auth-DXu-ZMvj.js";
import { n as abortChatRunsForProvider } from "./chat-abort-Cm7ik-5J.js";
import { n as readPreparedCatalog, t as loadDeferredCatalog } from "./server-model-catalog-auth-DCNJBYb7.js";
import { c as resolveUsageProviderId, o as providerUsageLabel } from "./provider-usage.shared-DxRYR38m.js";
import { t as formatForLog } from "./ws-log-DAJ6wT2O.js";
import { n as buildAuthHealthSummary, r as formatRemainingShort } from "./auth-health-DNmXqR6Y.js";
import { i as readProviderUsageStaleWhileRevalidate, n as fingerprintProviderUsageCredentials, t as clearModelAuthStatusUsageCache } from "./models-auth-status-usage-cache-COF5pTNZ.js";
import { d as refreshActiveProviderAuthRuntimeSnapshot } from "./runtime-x5Mrmt5n.js";
import { n as resolveModelAuthAgentScope, t as modelAuthAgentScopeError } from "./model-auth-agent-scope-BAF4cYfY.js";
import { t as resolveModelProviderCapabilities } from "./model-provider-capabilities-BM_Jyldb.js";
//#region src/gateway/server-methods/models-auth-status.ts
const log = createSubsystemLogger("models-auth-status");
const apiKeyUsageStatusProviders = /* @__PURE__ */ new Set(["clawrouter", "deepseek"]);
function buildProviderCapabilities(params) {
	return resolveModelProviderCapabilities(params).capabilities;
}
function resolveAuthRefreshScope(cfg) {
	const discovery = externalCliDiscoveryForConfigStatus({ cfg });
	if (discovery.mode !== "scoped") return { providerIds: [] };
	const providerIds = [...discovery.providerIds ?? []];
	const profileIds = [...discovery.profileIds ?? []];
	return {
		providerIds,
		...profileIds.length > 0 ? { profileIds } : {}
	};
}
/**
* Invalidate auxiliary usage and prepared provider-auth state after an auth
* mutation. Auth health itself is rebuilt on every request; only outbound
* usage enrichment is cached.
*/
function invalidateModelAuthStatusCache() {
	clearModelAuthStatusUsageCache();
	clearCurrentProviderAuthState();
}
async function refreshModelAuthStatusRuntimeState() {
	try {
		await refreshActiveProviderAuthRuntimeSnapshot();
	} catch (err) {
		log.warn(`runtime auth snapshot refresh before auth status failed: ${formatForLog(err)}`);
	}
}
function readProviderParam(params) {
	const raw = params.provider;
	if (typeof raw !== "string") return null;
	return normalizeProviderId(raw) || null;
}
function readLogoutProfileSelection(params) {
	if (!("profileIds" in params)) return { ok: true };
	if (!Array.isArray(params.profileIds) || params.profileIds.length === 0) return {
		ok: false,
		message: "profileIds must be a non-empty string array"
	};
	const profileIds = [];
	for (const value of params.profileIds) {
		if (typeof value !== "string" || !value.trim()) return {
			ok: false,
			message: "profileIds must be a non-empty string array"
		};
		const profileId = value.trim();
		if (!profileIds.includes(profileId)) profileIds.push(profileId);
	}
	return {
		ok: true,
		profileIds
	};
}
function createAuthLogoutAbortOps(context) {
	return {
		chatAbortControllers: context.chatAbortControllers,
		chatRunState: context.chatRunState,
		removeChatRun: context.removeChatRun,
		agentRunSeq: context.agentRunSeq,
		broadcast: context.broadcast,
		nodeSendToSession: context.nodeSendToSession
	};
}
async function removeProviderAuthProfilesAcrossOwnerStores(params) {
	const ownerAgentDirs = /* @__PURE__ */ new Set([params.agentDir]);
	for (const profileId of params.profileIds) ownerAgentDirs.add(resolvePersistedAuthProfileOwnerAgentDir({
		agentDir: params.agentDir,
		profileId
	}));
	for (const ownerAgentDir of ownerAgentDirs) if (!await removeProviderAuthProfilesWithLock({
		provider: params.provider,
		agentDir: ownerAgentDir
	})) return false;
	return true;
}
function buildExpiry(remainingMs, expiresAt) {
	const normalizedExpiresAt = asDateTimestampMs(expiresAt);
	if (normalizedExpiresAt === void 0 || typeof remainingMs !== "number") return;
	return {
		at: normalizedExpiresAt,
		remainingMs,
		label: formatRemainingShort(remainingMs)
	};
}
function providerDisplayName(provider) {
	const usageId = resolveUsageProviderId(provider);
	const usageLabel = usageId ? providerUsageLabel(usageId) : void 0;
	if (usageLabel) return usageLabel;
	return provider;
}
function aggregateProfileStatus(profiles, now) {
	const statuses = new Set(profiles.map((profile) => profile.status));
	const status = [
		"expired",
		"missing",
		"expiring",
		"ok",
		"static"
	].find((candidate) => statuses.has(candidate));
	const expirable = profiles.map((p) => p.expiresAt).filter((v) => asDateTimestampMs(v) !== void 0);
	const expiresAt = expirable.length > 0 ? Math.min(...expirable) : void 0;
	const remainingMs = expiresAt !== void 0 ? expiresAt - now : void 0;
	return {
		status: status ?? "static",
		expiresAt,
		remainingMs
	};
}
/**
* Aggregate the effective refreshable credential status for the dashboard.
* OAuth remains authoritative when present; token credentials are the
* supported fallback after an OAuth-to-token migration. Explicit auth-order
* exclusions remain authoritative through `effectiveProfiles`.
*
* `expectsOAuth` keeps an API-key-only provider `missing` after config switches
* to OAuth but login has not completed.
*/
function aggregateRefreshableAuthStatus(prov, now = Date.now(), expectsOAuth = false) {
	const profiles = prov.effectiveProfiles ?? prov.profiles;
	const oauth = profiles.filter((profile) => profile.type === "oauth");
	if (oauth.length > 0) return aggregateProfileStatus(oauth, now);
	const tokens = profiles.filter((profile) => profile.type === "token");
	if (tokens.length > 0) return aggregateProfileStatus(tokens, now);
	if (expectsOAuth) return { status: "missing" };
	return {
		status: prov.status,
		expiresAt: prov.expiresAt,
		remainingMs: prov.remainingMs
	};
}
function mapProvider(prov, usageByProvider, expectsOAuthSet, apiKeys, logoutProfileIds, configBoundProfileIds) {
	const usageProfile = prov.profiles.find((profile) => profile.type === "oauth" || profile.type === "token") ?? prov.profiles.find((profile) => profile.type === "api_key");
	const usageKey = resolveUsageProviderId(prov.provider, { credentialType: usageProfile?.type });
	const usage = usageKey ? usageByProvider.get(usageKey) : void 0;
	const rollup = aggregateRefreshableAuthStatus(prov, Date.now(), expectsOAuthSet.has(prov.provider));
	const apiKey = apiKeys.get(normalizeProviderId(prov.provider));
	const hasRefreshableProfile = prov.profiles.some((profile) => profile.type === "oauth" || profile.type === "token");
	return {
		provider: prov.provider,
		displayName: providerDisplayName(prov.provider),
		status: apiKey && !hasRefreshableProfile && rollup.status === "missing" ? "static" : rollup.status,
		expiry: buildExpiry(rollup.remainingMs, rollup.expiresAt),
		profiles: prov.profiles.map((prof) => ({
			profileId: prof.profileId,
			type: prof.type,
			status: prof.status,
			reasonCode: prof.reasonCode,
			expiry: buildExpiry(prof.remainingMs, prof.expiresAt),
			...(prof.type === "oauth" || prof.type === "token") && logoutProfileIds.has(prof.profileId) && !configBoundProfileIds.has(prof.profileId) ? { logoutSupported: true } : {}
		})),
		...apiKey ? { apiKey } : {},
		usage: usage && usageKey ? {
			providerId: usageKey,
			windows: usage.windows,
			...usage.summary ? { summary: usage.summary } : {},
			...usage.plan ? { plan: usage.plan } : {},
			...usage.billing?.length ? { billing: usage.billing } : {},
			...usage.accountEmail ? { accountEmail: usage.accountEmail } : {}
		} : void 0
	};
}
function resolveEnvVarName(source) {
	return /^(?:shell env|env): ([A-Z][A-Z0-9_]*)$/u.exec(source)?.[1];
}
function resolveProviderApiKeys(cfg, store, authAliasLookupParams) {
	const lookupMaps = resolveProviderEnvAuthLookupMaps({
		...authAliasLookupParams,
		config: cfg,
		env: process.env
	});
	const providerIds = /* @__PURE__ */ new Set([
		...Object.keys(cfg.models?.providers ?? {}),
		...Object.values(cfg.auth?.profiles ?? {}).map((profile) => profile?.provider).filter((provider) => typeof provider === "string"),
		...listProviderEnvAuthLookupKeys(lookupMaps)
	]);
	const apiKeys = /* @__PURE__ */ new Map();
	for (const rawProvider of providerIds) {
		const provider = normalizeProviderId(rawProvider);
		if (!provider) continue;
		const providerConfig = findNormalizedProviderValue(cfg.models?.providers, provider);
		if (hasConfiguredSecretInput(providerConfig?.apiKey, cfg.secrets?.defaults)) {
			const ref = coerceSecretRef(providerConfig?.apiKey, cfg.secrets?.defaults);
			const profileReference = resolveProviderEntryApiKeyProfileReference({
				cfg,
				authAliasLookupParams,
				provider,
				store
			});
			if (profileReference.kind !== "profile" && profileReference.kind !== "profile-incompatible") {
				if (ref && ref.source !== "env") {
					apiKeys.set(provider, { source: "config" });
					continue;
				}
				const available = resolveUsableCustomProviderApiKey({
					cfg,
					provider,
					env: process.env
				});
				if (available) {
					const rawKey = typeof providerConfig?.apiKey === "string" ? providerConfig.apiKey.trim() : "";
					if (rawKey && isNonSecretApiKeyMarker(rawKey, { includeEnvVarName: false })) continue;
					const envVar = ref?.source === "env" ? ref.id : profileReference.kind === "marker" && isKnownEnvApiKeyMarker(rawKey) ? rawKey : resolveEnvVarName(available.source);
					apiKeys.set(provider, envVar ? {
						source: "env",
						envVar
					} : { source: "config" });
					continue;
				}
			}
		}
		const envEvidence = resolveProviderEnvAuthEvidence(provider, process.env, {
			aliasMap: lookupMaps.aliasMap,
			candidateMap: lookupMaps.envCandidateMap,
			authEvidenceMap: lookupMaps.authEvidenceMap
		});
		if (envEvidence?.mode !== "api-key") continue;
		const envVar = resolveEnvVarName(envEvidence.source);
		apiKeys.set(provider, {
			source: "env",
			...envVar ? { envVar } : {}
		});
	}
	return apiKeys;
}
function resolveConfigBoundProfileIds(cfg, store, authAliasLookupParams) {
	const profileIds = /* @__PURE__ */ new Set();
	for (const provider of Object.keys(cfg.models?.providers ?? {})) {
		const reference = resolveProviderEntryApiKeyProfileReference({
			cfg,
			authAliasLookupParams,
			provider,
			store
		});
		if (reference.kind === "profile" || reference.kind === "profile-incompatible") profileIds.add(reference.profileId);
	}
	return profileIds;
}
function resolveConfiguredProviders(cfg, apiKeys) {
	const out = /* @__PURE__ */ new Set();
	const expectsOAuth = /* @__PURE__ */ new Set();
	for (const [id, provider] of Object.entries(cfg.models?.providers ?? {})) {
		const normalized = normalizeProviderId(id);
		if (!normalized) continue;
		const rawKey = typeof provider?.apiKey === "string" ? provider.apiKey.trim() : "";
		const hasApiKey = hasConfiguredSecretInput(provider?.apiKey, cfg.secrets?.defaults) && (rawKey === "secretref-managed" || !isNonSecretApiKeyMarker(rawKey, { includeEnvVarName: false }));
		const mode = provider?.auth;
		if (mode !== "oauth" && mode !== "token" && !hasApiKey) continue;
		if (apiKeys.has(normalized)) continue;
		out.add(normalized);
		if (mode === "oauth") expectsOAuth.add(normalized);
	}
	for (const profile of Object.values(cfg.auth?.profiles ?? {})) {
		const provider = profile?.provider;
		const mode = profile?.mode;
		if (typeof provider !== "string" || provider.length === 0 || mode !== "oauth" && mode !== "token") continue;
		const normalized = normalizeProviderId(provider);
		if (!normalized) continue;
		if (apiKeys.has(normalized)) continue;
		out.add(normalized);
		if (mode === "oauth") expectsOAuth.add(normalized);
	}
	return {
		providers: Array.from(out),
		expectsOAuth
	};
}
const modelsAuthStatusHandlers = {
	"models.authLogout": async ({ params, respond, context }) => {
		const provider = readProviderParam(params);
		if (!provider) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "provider is required"));
			return;
		}
		const selection = readLogoutProfileSelection(params);
		if (!selection.ok) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, selection.message));
			return;
		}
		try {
			const cfg = context.getRuntimeConfig();
			const scope = resolveModelAuthAgentScope(cfg, params.agentId);
			if (!scope.ok) {
				respond(false, void 0, modelAuthAgentScopeError(scope));
				return;
			}
			const { agentDir } = scope;
			const authProvider = resolveProviderIdForAuth(provider, { config: cfg });
			const store = ensureAuthProfileStoreWithoutExternalProfiles(agentDir);
			const availableProfiles = listProfilesForProvider(store, provider);
			const removedProfiles = selection.profileIds ?? availableProfiles;
			if (selection.profileIds && selection.profileIds.some((profileId) => {
				const profile = store.profiles[profileId];
				return !availableProfiles.includes(profileId) || profile?.type !== "oauth" && profile?.type !== "token";
			})) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "profileIds contain unavailable auth profiles"));
				return;
			}
			const configBoundProfileIds = selection.profileIds ? resolveConfigBoundProfileIds(cfg, store) : null;
			if (selection.profileIds?.some((profileId) => configBoundProfileIds?.has(profileId))) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "profileIds contain config-bound auth profiles"));
				return;
			}
			if (!(selection.profileIds ? await removeAuthProfilesAcrossOwnerStores({
				agentDir,
				profileIds: removedProfiles
			}) : await removeProviderAuthProfilesAcrossOwnerStores({
				provider,
				agentDir,
				profileIds: removedProfiles
			}))) {
				respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, `failed to remove saved auth profiles for provider ${provider}`));
				return;
			}
			invalidateModelAuthStatusCache();
			await refreshActiveProviderAuthRuntimeSnapshot();
			warmCurrentProviderAuthStateOffMainThread(context.getRuntimeConfig()).catch((err) => {
				log.warn(`provider auth state rewarm after logout failed: ${formatForLog(err)}`);
			});
			const { runIds: abortedRunIds } = selection.profileIds ? { runIds: [] } : abortChatRunsForProvider(createAuthLogoutAbortOps(context), {
				cfg,
				providerId: authProvider,
				agentId: scope.agentId,
				stopReason: "auth-revoked"
			});
			respond(true, {
				provider,
				removedProfiles,
				abortedRunIds
			}, void 0);
		} catch (err) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatForLog(err)));
		}
	},
	"models.authStatus": async ({ params, respond, context }) => {
		const now = Date.now();
		const refreshRequested = Boolean(params.refresh);
		try {
			let cfg = context.getRuntimeConfig();
			let scope = resolveModelAuthAgentScope(cfg, params.agentId);
			if (!scope.ok) {
				respond(false, void 0, modelAuthAgentScopeError(scope));
				return;
			}
			if (refreshRequested) {
				await refreshModelAuthStatusRuntimeState();
				cfg = context.getRuntimeConfig();
				scope = resolveModelAuthAgentScope(cfg, params.agentId);
				if (!scope.ok) {
					respond(false, void 0, modelAuthAgentScopeError(scope));
					return;
				}
			}
			const preparedSnapshot = refreshRequested ? await loadDeferredCatalog(context, scope.agentId, {
				readOnly: true,
				authScope: resolveAuthRefreshScope(cfg),
				refreshAuth: true
			}) : await readPreparedCatalog(context, scope.agentId);
			if (!preparedSnapshot) throw new Error(`prepared model auth owner is unavailable (${scope.agentId})`);
			cfg = preparedSnapshot.config;
			const { agentId, agentDir, authStore: store, workspaceDir } = preparedSnapshot;
			const authAliasLookupParams = {
				workspaceDir,
				metadataSnapshot: preparedSnapshot.metadataSnapshot,
				includeUntrustedWorkspacePlugins: false
			};
			const apiKeys = resolveProviderApiKeys(cfg, store, authAliasLookupParams);
			const configured = resolveConfiguredProviders(cfg, apiKeys);
			const statusProviderIds = new Set(configured.providers);
			for (const provider of apiKeys.keys()) statusProviderIds.add(provider);
			for (const profile of Object.values(store.profiles)) {
				const provider = normalizeProviderId(profile.provider);
				if (provider) statusProviderIds.add(provider);
			}
			const authHealth = buildAuthHealthSummary({
				store,
				cfg,
				providers: statusProviderIds.size > 0 ? [...statusProviderIds] : void 0,
				allowKeychainPrompt: false,
				authAliasLookupParams
			});
			const usageProviderIds = [...new Set(authHealth.profiles.filter((p) => {
				if (p.type === "oauth" || p.type === "token") return true;
				const usageProvider = resolveUsageProviderId(p.provider, { credentialType: p.type });
				return usageProvider ? apiKeyUsageStatusProviders.has(usageProvider) : false;
			}).map((p) => resolveUsageProviderId(p.provider, { credentialType: p.type })).filter((id) => Boolean(id)))];
			const usageByProvider = readProviderUsageStaleWhileRevalidate({
				agentId,
				agentDir,
				configRef: cfg,
				credentialKey: fingerprintProviderUsageCredentials({
					cfg,
					directApiKeys: apiKeys,
					store
				}),
				forceRefresh: refreshRequested,
				providerIds: usageProviderIds,
				now
			});
			const externalProfileIds = new Set(store.runtimeExternalProfileIds ?? []);
			const logoutProfileIds = new Set(Object.entries(store.profiles).filter(([profileId, profile]) => !externalProfileIds.has(profileId) && (profile.type === "oauth" || profile.type === "token")).map(([profileId]) => profileId));
			const configBoundProfileIds = resolveConfigBoundProfileIds(cfg, store, authAliasLookupParams);
			respond(true, {
				ts: now,
				providers: authHealth.providers.map((prov) => mapProvider(prov, usageByProvider, configured.expectsOAuth, apiKeys, logoutProfileIds, configBoundProfileIds)),
				providerCapabilities: buildProviderCapabilities({
					config: cfg,
					workspaceDir,
					metadataSnapshot: preparedSnapshot.metadataSnapshot
				})
			}, void 0);
		} catch (err) {
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, formatForLog(err)));
		}
	}
};
//#endregion
export { modelsAuthStatusHandlers };
