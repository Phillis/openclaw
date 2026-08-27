import { c as normalizeOptionalLowercaseString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { m as normalizeUniqueStringEntries } from "./string-normalization-e_fvmxMf.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { t as formatCliCommand } from "./command-format-Dr_cCOb_.js";
import { r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
import { f as resolveDefaultAgentDir } from "./agent-scope-config-BdXMWufB.js";
import { t as createSubsystemLogger } from "./subsystem-CDLhGl2-.js";
import { s as coerceSecretRef } from "./types.secrets-BrIfhxSG.js";
import { S as selectApplicableRuntimeConfig, a as getRuntimeConfigSnapshot, c as getRuntimeConfigSourceSnapshot } from "./runtime-snapshot-Dp7mvsA3.js";
import "./config-CW-q_d35.js";
import { s as mintSecretSentinel } from "./sentinel-DFKnr2-n.js";
import { i as resolveAuthStorePathForDisplay } from "./path-resolve-DH_naXF5.js";
import { i as assertAuthProfileMigrationReady } from "./legacy-source-diagnostic-oIpndhGF.js";
import { n as listProfilesForProvider } from "./profile-list-C3LUpGxc.js";
import { i as resolveAuthProfileOrder } from "./order-CPoPeUTn.js";
import { c as isNonSecretApiKeyMarker, g as resolveProviderEnvAuthLookupMaps, n as CUSTOM_LOCAL_AUTH_MARKER, u as isSecretRefHeaderValueMarker } from "./model-auth-markers-DJWHSR2r.js";
import { o as getModelProviderRequestTransport, r as attachModelProviderRequestTransport } from "./provider-request-config-BK7CLYaF.js";
import { d as resolveOwningPluginIdsForProviderRef } from "./providers-63828CFG.js";
import { A as resolveProviderSyntheticAuthWithPlugin, o as buildProviderMissingAuthMessageWithPlugin, z as shouldDeferProviderSyntheticProfileAuthWithPlugin } from "./provider-runtime-DStPs6cE.js";
import { c as readCodexCliCredentialsCached } from "./external-cli-sync-nInVHMn1.js";
import { r as ensureAuthProfileStore } from "./store-DOJuehrg.js";
import { t as resolveRuntimeSyntheticAuthProviderRefState } from "./synthetic-auth.runtime.js";
import { t as normalizeOptionalSecretInput } from "./normalize-secret-input-Df_qhWv_.js";
import { t as resolveEnvApiKey } from "./model-auth-env-CZG3X768.js";
import { t as OAuthRefreshFailureError } from "./oauth-refresh-failure-DLKK-cud.js";
import { n as SecretSurfaceUnavailableError } from "./runtime-degraded-state-DqIBoQI-.js";
import { n as ProviderAuthError } from "./model-auth-runtime-shared-C48YoQY0.js";
import "./auth-profiles-DybBsKKK.js";
import { n as resolveApiKeyForProfile } from "./oauth-C59avCH4.js";
import { n as externalCliDiscoveryForProviderAuth } from "./external-cli-discovery-DM5kEN0f.js";
import { C as sentinelizeSecretRefProfileApiKey, S as sentinelizeConfigSecretRefEnvApiKey, T as shouldUseImplicitAwsSdkAuth, _ as resolveProviderAuthOverride, a as hasSyntheticLocalProviderAuthConfig, c as isManagedSecretRefApiKeyMarker, d as resolveAwsSdkAuthInfo, f as resolveConfigAwareEnvApiKey, h as resolveInlineProviderApiKeyCooldownUntil, i as hasSecretRefProviderApiKey, l as profileTypeToAuthMode, m as resolveDirectProviderCredentialMode, o as hasUsableCustomProviderApiKey, p as resolveConfiguredAwsSdkProfileAuth, s as isConfigBackedInlineProviderApiKey, t as assertInlineProviderApiKeyUsable, u as providerConfigMatchesRuntimeSnapshot, v as resolveProviderConfig, w as shouldPreferExplicitConfigApiKeyAuth, x as resolveUsableCustomProviderApiKey, y as resolveProviderEntryApiKeyBinding } from "./model-auth-provider-config-CUFUPomY.js";
import { n as resolveManagedSecretRefRuntimeProviderAuth, t as assertRuntimeProviderSecretOwnerAvailable } from "./model-auth-runtime-config-BPErw-N5.js";
import path from "node:path";
//#region src/agents/model-auth-openai.ts
const OPENAI_PROVIDER_ID = "openai";
const OPENAI_CODEX_RESPONSES_API = "openai-chatgpt-responses";
function directOpenAIPlatformModelRequiresApiKey(params) {
	return normalizeProviderId(params.provider) === OPENAI_PROVIDER_ID && params.modelApi !== void 0 && normalizeLowercaseStringOrEmpty(params.modelApi) !== OPENAI_CODEX_RESPONSES_API;
}
function openAICodexTransportRequiresOAuth(params) {
	return normalizeProviderId(params.provider) === OPENAI_PROVIDER_ID && normalizeLowercaseStringOrEmpty(params.modelApi ?? "") === OPENAI_CODEX_RESPONSES_API;
}
function isAuthModeAllowedForModel(params) {
	if (openAICodexTransportRequiresOAuth(params)) return params.mode === "oauth" || params.mode === "token";
	return !directOpenAIPlatformModelRequiresApiKey(params) || params.mode === "api-key";
}
function assertAuthModeAllowedForModel(params) {
	if (isAuthModeAllowedForModel(params)) return;
	if (openAICodexTransportRequiresOAuth(params)) throw new Error(`Auth profile "${params.profileId}" uses ${params.mode} auth, but ${params.provider}/${params.modelApi} requires a ChatGPT subscription (OAuth or token) profile.`);
	throw new Error(`Auth profile "${params.profileId}" uses ${params.mode} auth, but ${params.provider}/${params.modelApi} requires an OpenAI API key profile.`);
}
//#endregion
//#region src/agents/model-auth-runtime.ts
/**
* Snapshot-aware and synthetic provider-auth availability.
*/
/** Builds stable env/synthetic auth lookup data for repeated provider checks. */
function createRuntimeProviderAuthLookup(params) {
	const env = params.env ?? process.env;
	const lookupParams = {
		config: params.cfg,
		workspaceDir: params.workspaceDir,
		env
	};
	const syntheticAuthProviderRefs = params.includePluginSyntheticAuth === false ? void 0 : resolveRuntimeSyntheticAuthProviderRefState(lookupParams);
	const authLookupMaps = resolveProviderEnvAuthLookupMaps(lookupParams);
	return {
		envApiKey: {
			aliasMap: authLookupMaps.aliasMap,
			candidateMap: authLookupMaps.envCandidateMap,
			authEvidenceMap: authLookupMaps.authEvidenceMap,
			skipSetupProviderFallback: true
		},
		setupProviderFallbackRefs: authLookupMaps.setupProviderFallbackRefs,
		syntheticAuthProviderRefs: syntheticAuthProviderRefs?.complete ? syntheticAuthProviderRefs.refs : void 0,
		syntheticAuthProviderRefsComplete: syntheticAuthProviderRefs?.complete
	};
}
function runtimeLookupAllowsSetupProviderFallback(params) {
	const refs = params.runtimeLookup?.setupProviderFallbackRefs;
	if (!refs?.length) return false;
	const normalizedProvider = normalizeProviderId(params.provider);
	const aliasTarget = params.runtimeLookup?.envApiKey.aliasMap?.[normalizedProvider];
	return refs.includes(normalizedProvider) || (aliasTarget ? refs.includes(aliasTarget) : false);
}
function resolveRuntimeEnvApiKeyLookupOptions(params) {
	const envApiKey = params.runtimeLookup?.envApiKey;
	if (!envApiKey) return;
	const skipSetupProviderFallback = envApiKey.skipSetupProviderFallback === true ? !runtimeLookupAllowsSetupProviderFallback(params) : envApiKey.skipSetupProviderFallback;
	return {
		...envApiKey,
		...skipSetupProviderFallback !== void 0 ? { skipSetupProviderFallback } : {}
	};
}
function listProviderSyntheticAuthRefs(params) {
	const refs = [params.provider];
	const providerConfig = resolveProviderConfig(params.cfg, params.provider);
	if (params.modelApi) refs.push(params.modelApi);
	if (providerConfig?.api) refs.push(providerConfig.api);
	return normalizeUniqueStringEntries(refs.map((ref) => normalizeProviderId(ref)));
}
function shouldResolvePluginSyntheticAuth(params) {
	const syntheticAuthProviderRefs = params.runtimeLookup?.syntheticAuthProviderRefs;
	if (!syntheticAuthProviderRefs) return true;
	const eligibleRefs = new Set(normalizeUniqueStringEntries(syntheticAuthProviderRefs.map((ref) => normalizeProviderId(ref))));
	if (eligibleRefs.size === 0) return false;
	return listProviderSyntheticAuthRefs(params).some((ref) => eligibleRefs.has(ref));
}
/** Fast auth-availability check for runtime provider/model selection. */
function hasRuntimeAvailableProviderAuth(params) {
	const provider = normalizeProviderId(params.provider);
	if (resolveProviderAuthOverride(params.cfg, provider) === "aws-sdk") return true;
	const inlineProviderApiKeyUsable = params.store ? (() => {
		const unusableUntil = resolveInlineProviderApiKeyCooldownUntil(params.store, provider);
		return unusableUntil === null || unusableUntil <= Date.now();
	})() : true;
	const envAuth = resolveEnvApiKey(provider, params.env, {
		config: params.cfg,
		workspaceDir: params.workspaceDir,
		...resolveRuntimeEnvApiKeyLookupOptions({
			provider,
			runtimeLookup: params.runtimeLookup
		})
	});
	if (envAuth && isAuthModeAllowedForModel({
		provider,
		modelApi: params.modelApi,
		mode: envAuth.source.includes("OAUTH_TOKEN") ? "oauth" : "api-key"
	}) && (!isConfigBackedInlineProviderApiKey({
		cfg: params.cfg,
		provider,
		source: envAuth.source,
		store: params.store
	}) || inlineProviderApiKeyUsable)) return true;
	if (resolveUsableCustomProviderApiKey({
		cfg: params.cfg,
		provider,
		env: params.env
	}) && inlineProviderApiKeyUsable) return true;
	const managedRuntimeAuth = resolveManagedSecretRefRuntimeProviderAuth({
		cfg: params.cfg,
		provider
	});
	if (managedRuntimeAuth && (!isConfigBackedInlineProviderApiKey({
		cfg: params.cfg,
		provider,
		source: managedRuntimeAuth.source,
		store: params.store
	}) || inlineProviderApiKeyUsable)) return true;
	if (hasSyntheticLocalProviderAuthConfig({
		cfg: params.cfg,
		provider
	})) return true;
	if (params.allowPluginSyntheticAuth !== false && shouldResolvePluginSyntheticAuth({
		cfg: params.cfg,
		provider,
		runtimeLookup: params.runtimeLookup
	}) && resolveSyntheticLocalProviderAuth({
		cfg: params.cfg,
		provider
	})) return true;
	return false;
}
function resolveProviderSyntheticRuntimeAuth(params) {
	const runtimeAuth = resolveManagedSecretRefRuntimeProviderAuth(params);
	if (runtimeAuth) return { auth: runtimeAuth };
	if (hasSecretRefProviderApiKey(params.cfg, params.provider)) return { blockedOnManagedSecretRef: true };
	const resolveFromConfig = (config) => {
		const providerConfig = resolveProviderConfig(config, params.provider);
		return resolveProviderSyntheticAuthWithPlugin({
			provider: params.provider,
			config,
			context: {
				config,
				provider: params.provider,
				providerConfig
			},
			modelApi: params.modelApi
		}) ?? void 0;
	};
	const directAuth = resolveFromConfig(params.cfg);
	if (!directAuth) return {};
	if (!isManagedSecretRefApiKeyMarker(directAuth.apiKey)) return { auth: directAuth };
	const runtimeConfig = getRuntimeConfigSnapshot();
	if (!runtimeConfig || runtimeConfig === params.cfg) return { blockedOnManagedSecretRef: true };
	const runtimePluginAuth = resolveFromConfig(runtimeConfig);
	const runtimeApiKey = runtimePluginAuth?.apiKey;
	if (!runtimePluginAuth || !runtimeApiKey || isNonSecretApiKeyMarker(runtimeApiKey)) return { blockedOnManagedSecretRef: true };
	return { auth: {
		...runtimePluginAuth,
		apiKey: params.secretSentinels ? mintSecretSentinel(runtimeApiKey, { label: `model-auth:${params.provider}` }) : runtimeApiKey
	} };
}
function resolveSyntheticLocalProviderAuth(params) {
	const syntheticProviderAuth = params.allowPluginSyntheticAuth === false ? {} : resolveProviderSyntheticRuntimeAuth(params);
	if (syntheticProviderAuth.auth) return syntheticProviderAuth.auth;
	if (syntheticProviderAuth.blockedOnManagedSecretRef) return null;
	if (!resolveProviderConfig(params.cfg, params.provider)) return null;
	if (hasSyntheticLocalProviderAuthConfig(params)) return {
		apiKey: CUSTOM_LOCAL_AUTH_MARKER,
		source: `models.providers.${params.provider} (synthetic local key)`,
		mode: "api-key"
	};
	return null;
}
//#endregion
//#region src/agents/model-auth-provider.ts
/**
* Ordered credential resolution for one provider request.
*/
const log$1 = createSubsystemLogger("model-auth");
function shouldDeferSyntheticProfileAuth(params) {
	const providerConfig = resolveProviderConfig(params.cfg, params.provider);
	return shouldDeferProviderSyntheticProfileAuthWithPlugin({
		provider: params.provider,
		config: params.cfg,
		modelApi: params.modelApi,
		context: {
			config: params.cfg,
			provider: params.provider,
			providerConfig,
			resolvedApiKey: params.resolvedApiKey
		}
	}) === true;
}
function resolveScopedAuthProfileStore(params) {
	return ensureAuthProfileStore(params.agentDir, { externalCli: externalCliDiscoveryForProviderAuth(params) });
}
/** Resolves the credential that should be used for one provider request. */
async function resolveApiKeyForProviderCore(params) {
	const { provider, cfg, profileId, preferredProfile } = params;
	const agentDir = params.agentDir?.trim() || (cfg ? resolveDefaultAgentDir(cfg) : void 0);
	assertAuthProfileMigrationReady(agentDir);
	assertRuntimeProviderSecretOwnerAvailable({
		cfg,
		provider
	});
	let scopedStore = params.store;
	const getScopedStore = (requestedProfileId) => scopedStore ??= resolveScopedAuthProfileStore({
		agentDir,
		cfg,
		provider,
		profileId: requestedProfileId,
		preferredProfile
	});
	if (profileId) {
		const awsSdkProfileAuth = resolveConfiguredAwsSdkProfileAuth({
			cfg,
			provider,
			profileId
		});
		if (awsSdkProfileAuth) return awsSdkProfileAuth;
		const store = getScopedStore(profileId);
		const configuredProfileType = store.profiles[profileId]?.type;
		if (configuredProfileType) assertAuthModeAllowedForModel({
			provider,
			modelApi: params.modelApi,
			profileId,
			mode: profileTypeToAuthMode(configuredProfileType)
		});
		const resolved = await resolveApiKeyForProfile({
			cfg,
			store,
			profileId,
			agentDir,
			forceRefresh: params.forceRefresh
		});
		if (!resolved) throw new Error(`No credentials found for profile "${profileId}".`);
		const resolvedProfileId = resolved.profileId ?? profileId;
		const mode = resolved.profileType ?? store.profiles[resolvedProfileId]?.type;
		const result = {
			apiKey: sentinelizeSecretRefProfileApiKey({
				apiKey: resolved.apiKey,
				enabled: params.secretSentinels,
				profileId: resolvedProfileId,
				provider,
				store
			}),
			profileId: resolvedProfileId,
			source: `profile:${resolvedProfileId}`,
			mode: mode ? profileTypeToAuthMode(mode) : "api-key"
		};
		assertAuthModeAllowedForModel({
			provider,
			modelApi: params.modelApi,
			profileId: resolvedProfileId,
			mode: result.mode
		});
		if (!params.lockedProfile && shouldDeferSyntheticProfileAuth({
			cfg,
			provider,
			resolvedApiKey: resolved.apiKey,
			modelApi: params.modelApi
		})) return resolveApiKeyForProviderCore({
			...params,
			store,
			profileId: void 0,
			lockedProfile: true
		}).catch(() => result);
		return result;
	}
	if (params.allowAuthProfileFallback !== false && (cfg?.auth?.profiles || cfg?.auth?.order)) {
		const configuredProfileOrder = resolveAuthProfileOrder({
			cfg,
			store: getScopedStore(),
			provider,
			preferredProfile,
			forModel: params.modelId
		});
		for (const candidate of configuredProfileOrder) {
			const awsSdkProfileAuth = resolveConfiguredAwsSdkProfileAuth({
				cfg,
				provider,
				profileId: candidate
			});
			if (awsSdkProfileAuth) return awsSdkProfileAuth;
		}
	}
	if (resolveProviderAuthOverride(cfg, provider) === "aws-sdk") return resolveAwsSdkAuthInfo();
	if (shouldUseImplicitAwsSdkAuth({
		cfg,
		provider,
		modelApi: params.modelApi
	})) return resolveAwsSdkAuthInfo();
	if (params.credentialPrecedence === "env-first") {
		const envResolved = resolveConfigAwareEnvApiKey(cfg, provider, params.workspaceDir, params.skipSetupProviderFallback);
		if (envResolved) {
			const resolvedMode = resolveDirectProviderCredentialMode({
				cfg,
				provider,
				inferredMode: envResolved.source.includes("OAUTH_TOKEN") ? "oauth" : "api-key"
			});
			if (resolvedMode === "api-key") {
				const inlineStore = getScopedStore();
				if (isConfigBackedInlineProviderApiKey({
					cfg,
					provider,
					source: envResolved.source,
					store: inlineStore
				})) assertInlineProviderApiKeyUsable({
					store: inlineStore,
					provider
				});
			}
			if (!isAuthModeAllowedForModel({
				provider,
				modelApi: params.modelApi,
				mode: resolvedMode
			})) return resolveApiKeyForProviderCore({
				...params,
				credentialPrecedence: "profile-first"
			});
			return {
				apiKey: sentinelizeConfigSecretRefEnvApiKey({
					apiKey: envResolved.apiKey,
					source: envResolved.source,
					cfg,
					provider,
					enabled: params.secretSentinels
				}),
				source: envResolved.source,
				mode: resolvedMode
			};
		}
	}
	const providerEntryBinding = await resolveProviderEntryApiKeyBinding({
		cfg,
		provider,
		store: getScopedStore(),
		agentDir,
		secretSentinels: params.secretSentinels
	});
	if (providerEntryBinding.kind === "profile-resolved") {
		assertAuthModeAllowedForModel({
			provider,
			modelApi: params.modelApi,
			profileId: providerEntryBinding.auth.profileId ?? provider,
			mode: providerEntryBinding.auth.mode
		});
		return providerEntryBinding.auth;
	}
	if (providerEntryBinding.kind === "profile-incompatible") {
		const reason = providerEntryBinding.reason === "credential-class" ? "which is not a bearer-style auth class" : "which is not compatible with this provider entry's auth binding";
		const action = providerEntryBinding.reason === "credential-class" ? "Use an api-key or token profile, or set apiKey to a literal bearer token." : "Use a compatible provider auth alias, configure the referenced provider entry with the same baseUrl, or set apiKey to a literal bearer token.";
		throw new Error(`Per-entry apiKey "${providerEntryBinding.profileId}" for provider "${provider}" references a "${providerEntryBinding.credentialType}" credential for provider "${providerEntryBinding.credentialProvider}", ${reason}. ${action}`);
	}
	if (providerEntryBinding.kind === "profile-unresolved") {
		const cause = providerEntryBinding.error ? formatErrorMessage(providerEntryBinding.error) : "credential resolution returned no key";
		throw new Error(`Per-entry apiKey "${providerEntryBinding.profileId}" for provider "${provider}" matched a stored profile but failed to resolve: ${cause}. Fix the referenced profile or set apiKey to a literal bearer token.`);
	}
	if (shouldPreferExplicitConfigApiKeyAuth(cfg, provider)) {
		const runtimeCustomKey = resolveManagedSecretRefRuntimeProviderAuth({
			cfg,
			provider,
			secretSentinels: params.secretSentinels
		});
		if (runtimeCustomKey) {
			assertInlineProviderApiKeyUsable({
				store: getScopedStore(),
				provider
			});
			return runtimeCustomKey;
		}
		const customKey = resolveUsableCustomProviderApiKey({
			cfg,
			provider,
			secretSentinels: params.secretSentinels
		});
		if (customKey) {
			assertInlineProviderApiKeyUsable({
				store: getScopedStore(),
				provider
			});
			return {
				apiKey: customKey.apiKey,
				source: customKey.source,
				mode: "api-key"
			};
		}
	}
	const providerConfig = resolveProviderConfig(cfg, provider);
	const configuredLocalKey = resolveUsableCustomProviderApiKey({
		cfg,
		provider,
		secretSentinels: params.secretSentinels
	});
	if (configuredLocalKey && isNonSecretApiKeyMarker(configuredLocalKey.apiKey)) return {
		apiKey: configuredLocalKey.apiKey,
		source: configuredLocalKey.source,
		mode: "api-key"
	};
	const localMarkerEnv = resolveConfigAwareEnvApiKey(cfg, provider, params.workspaceDir, params.skipSetupProviderFallback);
	if (localMarkerEnv && isNonSecretApiKeyMarker(localMarkerEnv.apiKey)) return {
		apiKey: localMarkerEnv.apiKey,
		source: localMarkerEnv.source,
		mode: "api-key"
	};
	const store = getScopedStore();
	const order = params.allowAuthProfileFallback === false ? [] : resolveAuthProfileOrder({
		cfg,
		store,
		provider,
		preferredProfile,
		forModel: params.modelId
	});
	let deferredAuthProfileResult = null;
	let refreshFailure;
	for (const candidate of order) {
		let candidateMode;
		try {
			const awsSdkProfileAuth = resolveConfiguredAwsSdkProfileAuth({
				cfg,
				provider,
				profileId: candidate
			});
			if (awsSdkProfileAuth) return awsSdkProfileAuth;
			const candidateType = store.profiles[candidate]?.type;
			candidateMode = candidateType ? profileTypeToAuthMode(candidateType) : void 0;
			if (candidateMode && !isAuthModeAllowedForModel({
				provider,
				modelApi: params.modelApi,
				mode: candidateMode
			})) continue;
			const resolved = await resolveApiKeyForProfile({
				cfg,
				store,
				profileId: candidate,
				agentDir,
				forceRefresh: params.forceRefresh
			});
			if (resolved) {
				const resolvedProfileId = resolved.profileId ?? candidate;
				const mode = resolved.profileType ?? store.profiles[resolvedProfileId]?.type;
				const resolvedMode = mode ? profileTypeToAuthMode(mode) : "api-key";
				const result = {
					apiKey: sentinelizeSecretRefProfileApiKey({
						apiKey: resolved.apiKey,
						enabled: params.secretSentinels,
						profileId: resolvedProfileId,
						provider,
						store
					}),
					profileId: resolvedProfileId,
					source: `profile:${resolvedProfileId}`,
					mode: resolvedMode
				};
				if (!isAuthModeAllowedForModel({
					provider,
					modelApi: params.modelApi,
					mode: result.mode
				})) continue;
				if (shouldDeferSyntheticProfileAuth({
					cfg,
					provider,
					resolvedApiKey: resolved.apiKey,
					modelApi: params.modelApi
				})) {
					deferredAuthProfileResult ??= result;
					continue;
				}
				return result;
			}
		} catch (err) {
			if (err instanceof SecretSurfaceUnavailableError) throw err;
			if (!refreshFailure && err instanceof OAuthRefreshFailureError && (!candidateMode || isAuthModeAllowedForModel({
				provider,
				modelApi: params.modelApi,
				mode: candidateMode
			}))) refreshFailure = err;
			log$1.debug?.(`auth profile "${candidate}" failed for provider "${provider}": ${String(err)}`);
		}
	}
	if (refreshFailure) throw refreshFailure;
	const envResolved = resolveConfigAwareEnvApiKey(cfg, provider, params.workspaceDir, params.skipSetupProviderFallback);
	if (envResolved) {
		const resolvedMode = resolveDirectProviderCredentialMode({
			cfg,
			provider,
			inferredMode: envResolved.source.includes("OAUTH_TOKEN") ? "oauth" : "api-key"
		});
		if (resolvedMode === "api-key") {
			const inlineStore = getScopedStore();
			if (isConfigBackedInlineProviderApiKey({
				cfg,
				provider,
				source: envResolved.source,
				store: inlineStore
			})) assertInlineProviderApiKeyUsable({
				store: inlineStore,
				provider
			});
		}
		if (isAuthModeAllowedForModel({
			provider,
			modelApi: params.modelApi,
			mode: resolvedMode
		})) return {
			apiKey: sentinelizeConfigSecretRefEnvApiKey({
				apiKey: envResolved.apiKey,
				source: envResolved.source,
				cfg,
				provider,
				enabled: params.secretSentinels
			}),
			source: envResolved.source,
			mode: resolvedMode
		};
	}
	const managedRuntimeAuth = resolveManagedSecretRefRuntimeProviderAuth({
		cfg,
		provider,
		secretSentinels: params.secretSentinels
	});
	if (managedRuntimeAuth && isAuthModeAllowedForModel({
		provider,
		modelApi: params.modelApi,
		mode: managedRuntimeAuth.mode
	})) {
		const inlineStore = getScopedStore();
		if (isConfigBackedInlineProviderApiKey({
			cfg,
			provider,
			source: managedRuntimeAuth.source,
			store: inlineStore
		})) assertInlineProviderApiKeyUsable({
			store: inlineStore,
			provider
		});
		return managedRuntimeAuth;
	}
	const customKey = resolveUsableCustomProviderApiKey({
		cfg,
		provider,
		secretSentinels: params.secretSentinels
	});
	if (customKey) {
		const mode = resolveDirectProviderCredentialMode({
			cfg,
			provider,
			inferredMode: "api-key"
		});
		if (isAuthModeAllowedForModel({
			provider,
			modelApi: params.modelApi,
			mode
		})) {
			assertInlineProviderApiKeyUsable({
				store: getScopedStore(),
				provider
			});
			return {
				apiKey: customKey.apiKey,
				source: customKey.source,
				mode
			};
		}
	}
	if (deferredAuthProfileResult) return deferredAuthProfileResult;
	const syntheticLocalAuth = resolveSyntheticLocalProviderAuth({
		cfg,
		provider,
		modelApi: params.modelApi,
		secretSentinels: params.secretSentinels,
		allowPluginSyntheticAuth: params.allowAuthProfileFallback !== false
	});
	if (syntheticLocalAuth) return syntheticLocalAuth;
	const hasInlineConfiguredModels = Array.isArray(providerConfig?.models) && providerConfig.models.length > 0;
	if ((params.allowAuthProfileFallback !== false && !hasInlineConfiguredModels ? resolveOwningPluginIdsForProviderRef({
		provider,
		config: cfg
	}) : void 0)?.length) {
		const pluginMissingAuthMessage = buildProviderMissingAuthMessageWithPlugin({
			provider,
			config: cfg,
			context: {
				config: cfg,
				agentDir,
				env: process.env,
				provider,
				listProfileIds: (providerId) => listProfilesForProvider(store, providerId)
			}
		});
		if (pluginMissingAuthMessage) throw new ProviderAuthError("missing-provider-auth", provider, pluginMissingAuthMessage, { providerGuidance: true });
	}
	const authStorePath = resolveAuthStorePathForDisplay(agentDir);
	const resolvedAgentDir = path.dirname(authStorePath);
	throw new ProviderAuthError("missing-provider-auth", provider, [
		`No API key found for provider "${provider}".`,
		`Auth store: ${authStorePath} (agentDir: ${resolvedAgentDir}).`,
		`Configure auth for this agent (${formatCliCommand("openclaw agents add <id>")}) or copy only portable static auth profiles from the main agentDir.`
	].join(" "));
}
//#endregion
//#region src/agents/model-auth-model.ts
/**
* Model-level auth diagnostics and request-header preparation.
*/
const log = createSubsystemLogger("model-auth");
/** Reports the strongest configured auth mode for provider-list UI and diagnostics. */
function resolveModelAuthMode(provider, cfg, store, options) {
	const resolved = provider?.trim();
	if (!resolved) return;
	if (resolveProviderAuthOverride(cfg, resolved) === "aws-sdk") return "aws-sdk";
	const authStore = store ?? resolveScopedAuthProfileStore({
		cfg,
		provider: resolved
	});
	const profiles = listProfilesForProvider(authStore, resolved);
	if (profiles.length > 0) {
		const modes = new Set(profiles.map((id) => authStore.profiles[id]?.type).filter((mode) => Boolean(mode)));
		if ([
			"oauth",
			"token",
			"api_key"
		].filter((k) => modes.has(k)).length >= 2) return "mixed";
		if (modes.has("oauth")) return "oauth";
		if (modes.has("token")) return "token";
		if (modes.has("api_key")) return "api-key";
	}
	const envKey = resolveConfigAwareEnvApiKey(cfg, resolved, options?.workspaceDir);
	if (envKey?.apiKey) return envKey.source.includes("OAUTH_TOKEN") ? "oauth" : "api-key";
	if (normalizeProviderId(resolved) === "codex" && readCodexCliCredentialsCached({
		ttlMs: 5e3,
		allowKeychainPrompt: false
	})) return "oauth";
	if (hasUsableCustomProviderApiKey(cfg, resolved)) return "api-key";
	return "unknown";
}
/** Checks provider auth availability, including profile fallback order. */
async function hasAvailableAuthForProvider(params) {
	const { provider, cfg, preferredProfile } = params;
	if (resolveProviderAuthOverride(cfg, provider) === "aws-sdk") return true;
	const store = params.store ?? resolveScopedAuthProfileStore({
		agentDir: params.agentDir,
		cfg,
		provider,
		preferredProfile
	});
	const inlineUnusableUntil = resolveInlineProviderApiKeyCooldownUntil(store, provider);
	const inlineProviderApiKeyUsable = typeof inlineUnusableUntil !== "number" || inlineUnusableUntil <= Date.now();
	const envAuth = resolveConfigAwareEnvApiKey(cfg, provider, params.workspaceDir);
	if (envAuth && isAuthModeAllowedForModel({
		provider,
		modelApi: params.modelApi,
		mode: envAuth.source.includes("OAUTH_TOKEN") ? "oauth" : "api-key"
	}) && (!isConfigBackedInlineProviderApiKey({
		cfg,
		provider,
		source: envAuth.source,
		store
	}) || inlineProviderApiKeyUsable)) return true;
	if (resolveUsableCustomProviderApiKey({
		cfg,
		provider
	}) && inlineProviderApiKeyUsable) return true;
	const syntheticLocalAuth = resolveSyntheticLocalProviderAuth({
		cfg,
		provider
	});
	if (syntheticLocalAuth && (!isConfigBackedInlineProviderApiKey({
		cfg,
		provider,
		source: syntheticLocalAuth.source,
		store
	}) || inlineProviderApiKeyUsable)) return true;
	const order = resolveAuthProfileOrder({
		cfg,
		store,
		provider,
		preferredProfile,
		forModel: params.modelId
	});
	for (const candidate of order) try {
		if (resolveConfiguredAwsSdkProfileAuth({
			cfg,
			provider,
			profileId: candidate
		})) return true;
		const candidateType = store.profiles[candidate]?.type;
		if (candidateType && !isAuthModeAllowedForModel({
			provider,
			modelApi: params.modelApi,
			mode: profileTypeToAuthMode(candidateType)
		})) continue;
		const resolved = await resolveApiKeyForProfile({
			cfg,
			store,
			profileId: candidate,
			agentDir: params.agentDir
		});
		const mode = resolved?.profileType ?? store.profiles[candidate]?.type;
		if (resolved && isAuthModeAllowedForModel({
			provider,
			modelApi: params.modelApi,
			mode: mode ? profileTypeToAuthMode(mode) : "api-key"
		})) return true;
	} catch (err) {
		log.debug?.(`auth profile "${candidate}" failed for provider "${provider}": ${String(err)}`);
	}
	return false;
}
/** Resolves request credentials from the provider attached to a model descriptor. */
async function getApiKeyForModelCore(params) {
	return resolveApiKeyForProviderCore({
		provider: params.model.provider,
		cfg: params.cfg,
		profileId: params.profileId,
		preferredProfile: params.preferredProfile,
		store: params.store,
		agentDir: params.agentDir,
		workspaceDir: params.workspaceDir,
		lockedProfile: params.lockedProfile,
		credentialPrecedence: params.credentialPrecedence,
		allowAuthProfileFallback: params.allowAuthProfileFallback,
		skipSetupProviderFallback: params.skipSetupProviderFallback,
		modelId: params.model.id,
		modelApi: params.model.api,
		secretSentinels: params.secretSentinels
	});
}
/** Clears auth for local OpenAI-compatible servers that explicitly use no auth. */
function applyLocalNoAuthHeaderOverride(model, auth) {
	if (auth?.apiKey !== "custom-local" || model.api !== "openai-completions") return model;
	const headers = {
		...model.headers,
		Authorization: null
	};
	return {
		...model,
		headers
	};
}
function applySecretRefHeaderSentinels(model, cfg) {
	if (!model.headers) return model;
	const runtimeConfig = getRuntimeConfigSnapshot();
	const runtimeSourceConfig = getRuntimeConfigSourceSnapshot();
	const usesRuntimeProvider = selectApplicableRuntimeConfig({
		inputConfig: cfg,
		runtimeConfig,
		runtimeSourceConfig
	}) === runtimeConfig || providerConfigMatchesRuntimeSnapshot({
		inputConfig: cfg,
		runtimeConfig,
		provider: model.provider
	});
	if (!runtimeConfig || !runtimeSourceConfig || !usesRuntimeProvider) return model;
	const sourceProvider = resolveProviderConfig(runtimeSourceConfig, model.provider);
	const runtimeProvider = resolveProviderConfig(runtimeConfig, model.provider);
	const replacements = /* @__PURE__ */ new Map();
	const isManagedSecret = (value) => coerceSecretRef(value) !== null || typeof value === "string" && isSecretRefHeaderValueMarker(value);
	const addReplacement = (name, value, replacement) => {
		replacements.set(name.trim().toLowerCase(), {
			value,
			replacement: replacement ?? mintSecretSentinel(value, { label: `model-auth:${model.provider}` })
		});
	};
	for (const [name, sourceValue] of Object.entries(sourceProvider?.headers ?? {})) {
		if (!isManagedSecret(sourceValue)) continue;
		const value = normalizeOptionalSecretInput(runtimeProvider?.headers?.[name]);
		if (value) addReplacement(name, value);
	}
	for (const [name, sourceValue] of Object.entries(sourceProvider?.request?.headers ?? {})) {
		if (!isManagedSecret(sourceValue)) continue;
		const value = normalizeOptionalSecretInput(runtimeProvider?.request?.headers?.[name]);
		if (value) addReplacement(name, value);
	}
	const sourceAuth = sourceProvider?.request?.auth;
	const runtimeAuth = runtimeProvider?.request?.auth;
	const attachedRequest = getModelProviderRequestTransport(model);
	let protectedRequest = attachedRequest;
	let protectedRequestHeaders;
	for (const [name, sourceValue] of Object.entries(sourceProvider?.request?.headers ?? {})) {
		if (!isManagedSecret(sourceValue)) continue;
		const value = normalizeOptionalSecretInput(runtimeProvider?.request?.headers?.[name]);
		if (!value || attachedRequest?.headers?.[name] !== value) continue;
		protectedRequestHeaders ??= { ...attachedRequest.headers };
		protectedRequestHeaders[name] = mintSecretSentinel(value, { label: `model-auth:${model.provider}` });
	}
	if (protectedRequestHeaders && attachedRequest) protectedRequest = {
		...attachedRequest,
		headers: protectedRequestHeaders
	};
	if (sourceAuth?.mode === "authorization-bearer" && runtimeAuth?.mode === "authorization-bearer" && isManagedSecret(sourceAuth.token)) {
		const token = normalizeOptionalSecretInput(runtimeAuth.token)?.trim();
		if (token) {
			if (attachedRequest?.auth?.mode === "authorization-bearer") protectedRequest = {
				...protectedRequest,
				auth: {
					...attachedRequest.auth,
					token: mintSecretSentinel(token, { label: `model-auth:${model.provider}` })
				}
			};
			addReplacement("Authorization", `Bearer ${token}`, `Bearer ${mintSecretSentinel(token, { label: `model-auth:${model.provider}` })}`);
		}
	} else if (sourceAuth?.mode === "header" && runtimeAuth?.mode === "header" && isManagedSecret(sourceAuth.value)) {
		const value = normalizeOptionalSecretInput(runtimeAuth.value)?.trim();
		const headerName = runtimeAuth.headerName.trim();
		const prefix = runtimeAuth.prefix?.trim() ?? "";
		if (headerName && value) {
			if (attachedRequest?.auth?.mode === "header") protectedRequest = {
				...protectedRequest,
				auth: {
					...attachedRequest.auth,
					value: mintSecretSentinel(value, { label: `model-auth:${model.provider}` })
				}
			};
			addReplacement(headerName, `${prefix}${value}`, `${prefix}${mintSecretSentinel(value, { label: `model-auth:${model.provider}` })}`);
		}
	}
	let headers;
	for (const [name, value] of Object.entries(model.headers)) {
		const replacement = replacements.get(name.trim().toLowerCase());
		if (replacement?.value !== value) continue;
		headers ??= { ...model.headers };
		headers[name] = replacement.replacement;
	}
	const protectedModel = headers ? {
		...model,
		headers
	} : model;
	return protectedRequest && protectedRequest !== attachedRequest ? attachModelProviderRequestTransport(protectedModel, protectedRequest) : protectedModel;
}
/**
* When the provider config sets `authHeader: true`, inject an explicit
* `Authorization: Bearer <apiKey>` header into the model so downstream SDKs
* (e.g. `@google/genai`) send credentials via the standard HTTP Authorization
* header instead of vendor-specific headers like `x-goog-api-key`.
*
* This is a no-op when `authHeader` is not `true`, when no API key is
* available, or when the API key is a synthetic marker (e.g. local-server
* placeholders) rather than a real credential.
*/
function applyAuthHeaderOverride(model, auth, cfg) {
	const sentinelModel = applySecretRefHeaderSentinels(model, cfg);
	if (!auth?.apiKey) return sentinelModel;
	if (isNonSecretApiKeyMarker(auth.apiKey)) return sentinelModel;
	if (!resolveProviderConfig(cfg, sentinelModel.provider)?.authHeader) return sentinelModel;
	const headers = {};
	if (sentinelModel.headers) {
		for (const [key, value] of Object.entries(sentinelModel.headers)) if (normalizeOptionalLowercaseString(key) !== "authorization") headers[key] = value;
	}
	headers.Authorization = `Bearer ${auth.apiKey}`;
	return {
		...sentinelModel,
		headers
	};
}
//#endregion
export { hasAvailableAuthForProvider as a, createRuntimeProviderAuthLookup as c, getApiKeyForModelCore as i, hasRuntimeAvailableProviderAuth as l, applyLocalNoAuthHeaderOverride as n, resolveModelAuthMode as o, applySecretRefHeaderSentinels as r, resolveApiKeyForProviderCore as s, applyAuthHeaderOverride as t };
