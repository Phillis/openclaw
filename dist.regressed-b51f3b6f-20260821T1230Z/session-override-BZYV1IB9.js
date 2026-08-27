import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.js";
import { C as resolveSessionAuthProfileOverrideSource } from "./agent-scope-BizOtGGz.js";
import { a as isModelScopedCooldownReason, o as isProfileInCooldown, r as isActiveUnusableWindow } from "./usage-state-B_WYg1ed.js";
import { i as resolveAuthProfileOrder, n as isStoredCredentialCompatibleWithAuthProvider, t as isConfiguredAwsSdkAuthProfileForProvider } from "./order-jGX4iJ3y.js";
import { r as ensureAuthProfileStore } from "./store-BfXdFfLh.js";
import { t as hasAnyAuthProfileStoreSource } from "./source-check-Bvz8QyBz.js";
import "./usage-BN1_P7wk.js";
//#region src/agents/auth-profiles/session-override.ts
/**
* Session-level auth profile override rotation.
* Keeps automatic profile choice stable within a session while still rotating
* across new sessions, compactions, provider changes, and cooldowns.
*/
const sessionAccessorLoader = createLazyImportLoader(() => import("./session-accessor-8W38mURE.js"));
function loadSessionAccessor() {
	return sessionAccessorLoader.load();
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
/** Resolves and optionally rotates the session auth-profile override. */
async function resolveSessionAuthProfileOverride(params) {
	const { cfg, provider, agentDir, sessionEntry, sessionStore, sessionKey, storePath, isNewSession } = params;
	if (!sessionEntry || !sessionStore || !sessionKey) return sessionEntry?.authProfileOverride;
	const hasConfiguredAuthProfiles = Boolean(params.cfg.auth?.profiles && Object.keys(params.cfg.auth.profiles).length > 0) || Boolean(params.cfg.auth?.order && Object.keys(params.cfg.auth.order).length > 0);
	if (!sessionEntry.authProfileOverride?.trim() && !hasConfiguredAuthProfiles && !hasAnyAuthProfileStoreSource(agentDir)) return;
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
	if (source === "user" && current) return current;
	if (current && order.length > 0 && !order.includes(current)) {
		await clearSessionAuthProfileOverride({
			sessionEntry,
			sessionStore,
			sessionKey,
			storePath
		});
		current = void 0;
	}
	if (order.length === 0) return;
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
			return latestProfileId && latestSource === "user" && isProfileForProvider({
				cfg,
				providers,
				profileId: latestProfileId,
				store
			}) ? latestProfileId : void 0;
		}
		return;
	}
	const isProfileUnavailableForSessionModel = (profileId) => isProfileInCooldown(store, profileId, void 0, sessionEntry.model);
	const pickFirstAvailable = () => order.find((profileId) => !isProfileUnavailableForSessionModel(profileId)) ?? order[0];
	const pickNextAvailable = (active) => {
		const startIndex = order.indexOf(active);
		if (startIndex < 0) return pickFirstAvailable();
		for (let offset = 1; offset <= order.length; offset += 1) {
			const candidate = order[(startIndex + offset) % order.length];
			if (candidate && !isProfileUnavailableForSessionModel(candidate)) return candidate;
		}
		return order[startIndex] ?? order[0];
	};
	const compactionCount = sessionEntry.compactionCount ?? 0;
	const storedCompaction = typeof sessionEntry.authProfileOverrideCompactionCount === "number" ? sessionEntry.authProfileOverrideCompactionCount : compactionCount;
	const replacementForUnusableCurrent = current && isProfileUnavailableForSessionModel(current) ? order.find((profileId) => profileId !== current && !isProfileUnavailableForSessionModel(profileId)) : void 0;
	if (replacementForUnusableCurrent) current = void 0;
	let next = current;
	if (replacementForUnusableCurrent) next = replacementForUnusableCurrent;
	else if (isNewSession) next = current ? pickNextAvailable(current) : pickFirstAvailable();
	else if (current && compactionCount > storedCompaction) next = pickNextAvailable(current);
	else if (!current || isProfileUnavailableForSessionModel(current)) next = pickFirstAvailable();
	if (!next) return current;
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
	return next;
}
//#endregion
export { resolveSessionAuthProfileOverride as n, clearSessionAuthProfileOverride as t };
