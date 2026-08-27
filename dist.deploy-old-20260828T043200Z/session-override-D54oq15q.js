import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.js";
import { O as resolveSessionAuthProfileOverrideSource } from "./agent-scope-DigoIwHb.js";
import { a as listOpenAIAuthProfileProvidersForAgentRuntime } from "./openai-routing-mOc2UICM.js";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BIKs-96s.js";
import { o as resolveProviderModelRoutes } from "./provider-model-route-D-FYx-DP.js";
import { l as resolveProviderModelRouteAuthRequirement } from "./openai-model-routes-Bxpy3ufg.js";
import { a as isModelScopedCooldownReason, o as isProfileInCooldown, r as isActiveUnusableWindow } from "./usage-state-C0QBjJnZ.js";
import { i as resolveAuthProfileOrder, n as isStoredCredentialCompatibleWithAuthProvider, t as isConfiguredAwsSdkAuthProfileForProvider } from "./order-C7dw_-HZ.js";
import { r as ensureAuthProfileStore } from "./store-C0UG5FOx.js";
import { t as hasAnyAuthProfileStoreSource } from "./source-check-CdyIgAMR.js";
import "./usage-6-myLAu1.js";
//#region src/agents/auth-profiles/session-override.ts
/** Keeps automatic auth profiles stable within sessions while rotating at lifecycle boundaries. */
const sessionAccessorLoader = createLazyImportLoader(() => import("./session-accessor-BwigPrR8.js"));
function loadSessionAccessor() {
	return sessionAccessorLoader.load();
}
function profileAuthRequirement(params) {
	return resolveProviderModelRouteAuthRequirement(params.store?.profiles[params.profileId]?.type ?? params.cfg.auth?.profiles?.[params.profileId]?.mode);
}
function applySessionAuthProfileOverrideState(entry, state, updatedAt) {
	if (state.authProfileOverride === void 0) delete entry.authProfileOverride;
	else entry.authProfileOverride = state.authProfileOverride;
	if (state.authProfileOverrideSource === void 0) delete entry.authProfileOverrideSource;
	else entry.authProfileOverrideSource = state.authProfileOverrideSource;
	if (state.authProfileOverrideCompactionCount === void 0) delete entry.authProfileOverrideCompactionCount;
	else entry.authProfileOverrideCompactionCount = state.authProfileOverrideCompactionCount;
	entry.updatedAt = Math.max(entry.updatedAt ?? 0, updatedAt);
}
function matchesSessionAuthProfileOverrideSnapshot(entry, snapshot) {
	return entry.sessionId === snapshot.sessionId && entry.authProfileOverride === snapshot.authProfileOverride && entry.authProfileOverrideSource === snapshot.authProfileOverrideSource && entry.authProfileOverrideCompactionCount === snapshot.authProfileOverrideCompactionCount;
}
function synchronizeSessionEntry(entry, latest) {
	for (const key of Object.keys(entry)) if (!Object.hasOwn(latest, key)) Reflect.deleteProperty(entry, key);
	Object.assign(entry, latest);
}
async function persistSessionAuthProfileOverrideState(params) {
	const { sessionEntry, sessionStore, sessionKey, state, storePath, expectedSnapshot } = params;
	const updatedAt = Date.now();
	if (!storePath) {
		if (expectedSnapshot && !Object.hasOwn(sessionStore, sessionKey)) return;
		const latest = sessionStore[sessionKey] ?? sessionEntry;
		if (expectedSnapshot && !matchesSessionAuthProfileOverrideSnapshot(latest, expectedSnapshot)) {
			synchronizeSessionEntry(sessionEntry, latest);
			return latest;
		}
		const target = expectedSnapshot ? latest : sessionEntry;
		applySessionAuthProfileOverrideState(target, state, updatedAt);
		if (target !== sessionEntry) synchronizeSessionEntry(sessionEntry, target);
		sessionStore[sessionKey] = target;
		return target;
	}
	if (!expectedSnapshot) {
		applySessionAuthProfileOverrideState(sessionEntry, state, updatedAt);
		sessionStore[sessionKey] = sessionEntry;
	}
	const persisted = await (await loadSessionAccessor()).patchSessionEntryCore({
		storePath,
		sessionKey
	}, (current) => {
		if (expectedSnapshot && !matchesSessionAuthProfileOverrideSnapshot(current, expectedSnapshot)) return null;
		return {
			...state,
			updatedAt: Math.max(current.updatedAt ?? 0, updatedAt)
		};
	}, expectedSnapshot ? void 0 : { fallbackEntry: sessionEntry });
	if (persisted) {
		if (expectedSnapshot) synchronizeSessionEntry(sessionEntry, persisted);
		sessionStore[sessionKey] = persisted;
	}
	return persisted ?? (expectedSnapshot ? void 0 : sessionEntry);
}
function isProfileForProvider(params) {
	const entry = params.store.profiles[params.profileId];
	if (entry) {
		if (!entry.provider) return false;
		return params.providers.some((provider) => isStoredCredentialCompatibleWithAuthProvider({
			cfg: params.cfg,
			provider,
			credential: entry
		}));
	}
	return params.providers.some((provider) => isConfiguredAwsSdkAuthProfileForProvider({
		cfg: params.cfg,
		provider,
		profileId: params.profileId
	}));
}
function uniqueProviders(provider, acceptedProviderIds) {
	const providers = /* @__PURE__ */ new Set();
	const push = (value) => {
		const normalized = value?.trim();
		if (normalized) providers.add(normalized);
	};
	(acceptedProviderIds && acceptedProviderIds.length > 0 ? acceptedProviderIds : [provider]).forEach(push);
	return [...providers];
}
function isProfileGloballyInCooldown(store, profileId) {
	if (!isProfileInCooldown(store, profileId)) return false;
	const usage = store.usageStats?.[profileId];
	if (!usage) return true;
	const now = Date.now();
	return isActiveUnusableWindow(usage.disabledUntil, now) || isActiveUnusableWindow(usage.blockedUntil, now) && (usage.blockedScope !== "model" || !usage.blockedModel) || isActiveUnusableWindow(usage.cooldownUntil, now) && (!isModelScopedCooldownReason(usage.cooldownReason) || !usage.cooldownModel);
}
/** Clears an auth-profile override from a session and persists it when possible. */
async function clearSessionAuthProfileOverride(params) {
	const { sessionEntry, sessionStore, sessionKey, storePath } = params;
	await persistSessionAuthProfileOverrideState({
		sessionEntry,
		sessionStore,
		sessionKey,
		state: {
			authProfileOverride: void 0,
			authProfileOverrideSource: void 0,
			authProfileOverrideCompactionCount: void 0
		},
		storePath
	});
}
async function resolveSessionAuthProfileOverride(params) {
	const { cfg, provider, agentDir, sessionEntry, sessionStore, sessionKey, storePath, isNewSession } = params;
	if (!sessionEntry || !sessionStore || !sessionKey) return {
		profileId: sessionEntry?.authProfileOverride,
		store: void 0
	};
	const hasConfiguredAuthProfiles = Boolean(params.cfg.auth?.profiles && Object.keys(params.cfg.auth.profiles).length > 0) || Boolean(params.cfg.auth?.order && Object.keys(params.cfg.auth.order).length > 0);
	if (!sessionEntry.authProfileOverride?.trim() && !hasConfiguredAuthProfiles && !hasAnyAuthProfileStoreSource(agentDir)) return {
		profileId: void 0,
		store: void 0
	};
	const store = ensureAuthProfileStore(agentDir, { allowKeychainPrompt: false });
	const providers = uniqueProviders(provider, params.acceptedProviderIds);
	const order = [...new Set(providers.flatMap((candidateProvider) => resolveAuthProfileOrder({
		cfg,
		store,
		provider: candidateProvider
	})))];
	let current = sessionEntry.authProfileOverride?.trim();
	const source = resolveSessionAuthProfileOverrideSource(sessionEntry);
	const currentProfileId = current;
	if (currentProfileId && !store.profiles[currentProfileId] && !providers.some((candidateProvider) => isConfiguredAwsSdkAuthProfileForProvider({
		cfg,
		provider: candidateProvider,
		profileId: currentProfileId
	}))) {
		await clearSessionAuthProfileOverride({
			sessionEntry,
			sessionStore,
			sessionKey,
			storePath
		});
		current = void 0;
	}
	if (current && !isProfileForProvider({
		cfg,
		providers,
		profileId: current,
		store
	})) {
		await clearSessionAuthProfileOverride({
			sessionEntry,
			sessionStore,
			sessionKey,
			storePath
		});
		current = void 0;
	}
	if (source === "user" && current) return {
		profileId: current,
		store
	};
	if (current && order.length > 0 && !order.includes(current)) {
		await clearSessionAuthProfileOverride({
			sessionEntry,
			sessionStore,
			sessionKey,
			storePath
		});
		current = void 0;
	}
	if (order.length === 0) return {
		profileId: void 0,
		store
	};
	if (order.every((profileId) => isProfileGloballyInCooldown(store, profileId))) {
		if (current) {
			const latest = await persistSessionAuthProfileOverrideState({
				sessionEntry,
				sessionStore,
				sessionKey,
				state: {
					authProfileOverride: void 0,
					authProfileOverrideSource: void 0,
					authProfileOverrideCompactionCount: void 0
				},
				storePath,
				expectedSnapshot: {
					sessionId: sessionEntry.sessionId,
					authProfileOverride: sessionEntry.authProfileOverride,
					authProfileOverrideSource: sessionEntry.authProfileOverrideSource,
					authProfileOverrideCompactionCount: sessionEntry.authProfileOverrideCompactionCount
				}
			});
			const latestProfileId = latest?.authProfileOverride;
			const latestSource = resolveSessionAuthProfileOverrideSource(latest);
			return {
				profileId: latestProfileId && latestSource === "user" && isProfileForProvider({
					cfg,
					providers,
					profileId: latestProfileId,
					store
				}) ? latestProfileId : void 0,
				store
			};
		}
		return {
			profileId: void 0,
			store
		};
	}
	const isProfileUnavailableForSessionModel = (profileId) => isProfileInCooldown(store, profileId, void 0, sessionEntry.model);
	const currentUnavailable = current ? isProfileUnavailableForSessionModel(current) : false;
	const compactionCount = sessionEntry.compactionCount ?? 0;
	const storedCompaction = typeof sessionEntry.authProfileOverrideCompactionCount === "number" ? sessionEntry.authProfileOverrideCompactionCount : compactionCount;
	const shouldRotateCurrent = Boolean(current) && !isNewSession && (currentUnavailable || compactionCount > storedCompaction);
	const routeResolution = shouldRotateCurrent ? resolveProviderModelRoutes({
		provider,
		modelId: params.modelId,
		config: cfg
	}) : null;
	const currentAuthRequirement = current && routeResolution?.kind === "routes" && routeResolution.routes.length > 1 ? profileAuthRequirement({
		cfg,
		store,
		profileId: current
	}) : void 0;
	const rotationOrder = currentAuthRequirement ? order.filter((profileId) => profileAuthRequirement({
		cfg,
		store,
		profileId
	}) === currentAuthRequirement) : order;
	const pickAvailable = (active) => {
		const startIndex = active ? rotationOrder.indexOf(active) : -1;
		for (let offset = 1; offset <= rotationOrder.length; offset += 1) {
			const candidate = rotationOrder[(startIndex + offset) % rotationOrder.length];
			if (candidate && !isProfileUnavailableForSessionModel(candidate)) return candidate;
		}
		return rotationOrder[startIndex] ?? rotationOrder[0];
	};
	let next = current;
	if (isNewSession || shouldRotateCurrent) next = pickAvailable(currentUnavailable ? void 0 : current);
	else if (!current) next = pickAvailable();
	if (!next) return {
		profileId: current,
		store
	};
	if (next !== sessionEntry.authProfileOverride || sessionEntry.authProfileOverrideSource !== "auto" || sessionEntry.authProfileOverrideCompactionCount !== compactionCount) await persistSessionAuthProfileOverrideState({
		sessionEntry,
		sessionStore,
		sessionKey,
		state: {
			authProfileOverride: next,
			authProfileOverrideSource: "auto",
			authProfileOverrideCompactionCount: compactionCount
		},
		storePath
	});
	return {
		profileId: next,
		store
	};
}
/** Resolves the session credential and its prepared route facts. */
async function resolveSessionAuthSelection(params) {
	const { profileId: rotatedProfileId, store } = await resolveSessionAuthProfileOverride({
		...params,
		modelId: splitTrailingAuthProfile(params.modelId).model,
		acceptedProviderIds: listOpenAIAuthProfileProvidersForAgentRuntime({
			provider: params.provider,
			harnessRuntime: params.harnessRuntime,
			config: params.cfg
		})
	});
	const rotatedSource = rotatedProfileId ? params.sessionEntry?.authProfileOverride?.trim() === rotatedProfileId ? resolveSessionAuthProfileOverrideSource(params.sessionEntry) ?? "auto" : "auto" : void 0;
	const rotatedUserProfileId = rotatedSource === "user" ? rotatedProfileId : void 0;
	const configuredProfileId = params.configuredProfileId?.trim() || void 0;
	const profileId = rotatedUserProfileId ?? configuredProfileId ?? rotatedProfileId;
	if (!profileId) return;
	return {
		profileId,
		source: rotatedUserProfileId || configuredProfileId ? "user" : rotatedSource ?? "auto",
		routeRequirement: profileAuthRequirement({
			cfg: params.cfg,
			store,
			profileId
		})
	};
}
//#endregion
export { resolveSessionAuthSelection as n, clearSessionAuthProfileOverride as t };
