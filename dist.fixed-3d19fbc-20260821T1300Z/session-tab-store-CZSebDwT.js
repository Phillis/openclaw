import { t as createPluginRuntimeStore } from "./runtime-store-CjjjpvHZ.js";
import { createHash } from "node:crypto";
//#region extensions/browser/src/browser-runtime-state.ts
const { setRuntime: setBrowserStateRuntime, getRuntime: getBrowserStateRuntime, tryGetRuntime: getOptionalBrowserStateRuntime } = createPluginRuntimeStore({
	pluginId: "browser",
	errorMessage: "Browser state runtime not initialized"
});
//#endregion
//#region extensions/browser/src/browser/session-tab-ephemeral-aliases.ts
const durableAliasStateSymbol = Symbol.for("openclaw.browser.session-tabs.interaction-storage-keys");
const durableExactStateSymbol = Symbol.for("openclaw.browser.session-tabs.exact-interaction-storage-keys");
const volatileAliasStateSymbol = Symbol.for("openclaw.browser.session-tabs.volatile-aliases");
const volatileExactStateSymbol = Symbol.for("openclaw.browser.session-tabs.exact-volatile-aliases");
function interactionKey(identity) {
	return `${identity.sessionKey}\u0000${identity.baseUrl ?? ""}\u0000${identity.profile ?? ""}\u0000${identity.targetId}`;
}
function normalizedTargetIds(identity, aliases) {
	return /* @__PURE__ */ new Set([identity.targetId, ...aliases.flatMap((alias) => {
		const targetId = alias?.trim();
		return targetId ? [targetId] : [];
	})]);
}
function normalizedProfiles(identity, aliases) {
	const profiles = /* @__PURE__ */ new Set([identity.profile]);
	for (const alias of aliases) {
		const profile = alias?.trim();
		if (profile) profiles.add(profile);
	}
	return profiles;
}
function durableKeysByInteraction() {
	const state = globalThis;
	state[durableAliasStateSymbol] ??= /* @__PURE__ */ new Map();
	return state[durableAliasStateSymbol];
}
function durableExactKeysByInteraction() {
	const state = globalThis;
	state[durableExactStateSymbol] ??= /* @__PURE__ */ new Map();
	return state[durableExactStateSymbol];
}
function removeStorageKey(mappings, storageKey) {
	for (const [key, storageKeys] of mappings) {
		storageKeys.delete(storageKey);
		if (storageKeys.size === 0) mappings.delete(key);
	}
}
function resetDurableTabAliases() {
	durableKeysByInteraction().clear();
	durableExactKeysByInteraction().clear();
}
function clearDurableTabAliases(storageKey) {
	removeStorageKey(durableKeysByInteraction(), storageKey);
	removeStorageKey(durableExactKeysByInteraction(), storageKey);
}
function rememberDurableTabAliases(identity, aliases, storageKey, profileAliases = []) {
	clearDurableTabAliases(storageKey);
	const mappings = durableKeysByInteraction();
	const exactMappings = durableExactKeysByInteraction();
	for (const profile of normalizedProfiles(identity, profileAliases)) {
		const exactKey = interactionKey({
			...identity,
			profile
		});
		const exactStorageKeys = exactMappings.get(exactKey) ?? /* @__PURE__ */ new Set();
		exactStorageKeys.add(storageKey);
		exactMappings.set(exactKey, exactStorageKeys);
		for (const targetId of normalizedTargetIds(identity, aliases)) {
			const key = interactionKey({
				...identity,
				profile,
				targetId
			});
			const storageKeys = mappings.get(key) ?? /* @__PURE__ */ new Set();
			storageKeys.add(storageKey);
			mappings.set(key, storageKeys);
		}
	}
}
function resolveDurableTabAlias(identity) {
	const storageKeys = durableKeysByInteraction().get(interactionKey(identity));
	return storageKeys?.size === 1 ? storageKeys.values().next().value : void 0;
}
function hasDurableTabAlias(identity) {
	return (durableKeysByInteraction().get(interactionKey(identity))?.size ?? 0) > 0;
}
function resolveDurableTabExact(identity) {
	const storageKeys = durableExactKeysByInteraction().get(interactionKey(identity));
	return storageKeys?.size === 1 ? storageKeys.values().next().value : void 0;
}
function hasDurableTabExact(identity) {
	return (durableExactKeysByInteraction().get(interactionKey(identity))?.size ?? 0) > 0;
}
function volatileAliasTargetKey(target) {
	return JSON.stringify([target.sessionKey, target.tabKey]);
}
function volatileAliasesByInteraction() {
	const state = globalThis;
	state[volatileAliasStateSymbol] ??= /* @__PURE__ */ new Map();
	return state[volatileAliasStateSymbol];
}
function volatileExactTargetsByInteraction() {
	const state = globalThis;
	state[volatileExactStateSymbol] ??= /* @__PURE__ */ new Map();
	return state[volatileExactStateSymbol];
}
function removeVolatileTarget(mappings, targetKey) {
	for (const [key, targets] of mappings) {
		targets.delete(targetKey);
		if (targets.size === 0) mappings.delete(key);
	}
}
function clearVolatileTabAliases(sessionKey, tabKey) {
	const targetKey = volatileAliasTargetKey({
		sessionKey,
		tabKey
	});
	removeVolatileTarget(volatileAliasesByInteraction(), targetKey);
	removeVolatileTarget(volatileExactTargetsByInteraction(), targetKey);
}
function rememberVolatileTabAliases(identity, aliases, tabKey, profileAliases = []) {
	clearVolatileTabAliases(identity.sessionKey, tabKey);
	const target = {
		sessionKey: identity.sessionKey,
		tabKey
	};
	const mappings = volatileAliasesByInteraction();
	const exactMappings = volatileExactTargetsByInteraction();
	for (const profile of normalizedProfiles(identity, profileAliases)) {
		const exactKey = interactionKey({
			...identity,
			profile
		});
		const exactTargets = exactMappings.get(exactKey) ?? /* @__PURE__ */ new Map();
		exactTargets.set(volatileAliasTargetKey(target), target);
		exactMappings.set(exactKey, exactTargets);
		for (const targetId of normalizedTargetIds(identity, aliases)) {
			const key = interactionKey({
				...identity,
				profile,
				targetId
			});
			const targets = mappings.get(key) ?? /* @__PURE__ */ new Map();
			targets.set(volatileAliasTargetKey(target), target);
			mappings.set(key, targets);
		}
	}
}
function resolveVolatileTabAlias(identity) {
	const targets = volatileAliasesByInteraction().get(interactionKey(identity));
	return targets?.size === 1 ? targets.values().next().value : void 0;
}
function hasVolatileTabAlias(identity) {
	return (volatileAliasesByInteraction().get(interactionKey(identity))?.size ?? 0) > 0;
}
function resolveVolatileTabExact(identity) {
	const targets = volatileExactTargetsByInteraction().get(interactionKey(identity));
	return targets?.size === 1 ? targets.values().next().value : void 0;
}
function hasVolatileTabExact(identity) {
	return (volatileExactTargetsByInteraction().get(interactionKey(identity))?.size ?? 0) > 0;
}
function forgetVolatileTabAlias(identity) {
	volatileAliasesByInteraction().delete(interactionKey(identity));
	volatileExactTargetsByInteraction().delete(interactionKey(identity));
}
//#endregion
//#region extensions/browser/src/browser/session-tab-store.ts
const BROWSER_SESSION_TABS_NAMESPACE = "browser.session-tabs";
const BROWSER_SESSION_TABS_MAX_ENTRIES = 5e3;
/** Opens and publishes Browser's canonical durable tab store during plugin registration. */
function initializeBrowserSessionTabStore(runtime) {
	const sessionTabs = runtime.state.openSyncKeyedStore({
		namespace: BROWSER_SESSION_TABS_NAMESPACE,
		maxEntries: BROWSER_SESSION_TABS_MAX_ENTRIES,
		overflowPolicy: "reject-new"
	});
	setBrowserStateRuntime({ sessionTabs });
	resetDurableTabAliases();
	for (const entry of sessionTabs.entries()) {
		const record = parseBrowserSessionTabRecord(entry.value);
		if (!record || browserSessionTabStorageKey(record) !== entry.key) continue;
		rememberDurableTabAliases({
			sessionKey: record.sessionKey,
			targetId: record.nativeTargetId,
			profile: record.profile
		}, [], entry.key, record.profileAliases);
	}
}
function getBrowserSessionTabStore() {
	return getBrowserStateRuntime().sessionTabs;
}
function getOptionalBrowserSessionTabStore() {
	return getOptionalBrowserStateRuntime()?.sessionTabs;
}
function browserSessionTabStorageKey(record) {
	return `sha256:${createHash("sha256").update(JSON.stringify([
		record.sessionKey,
		record.nativeTargetId,
		record.profileFingerprint,
		record.browserInstanceFingerprint
	])).digest("hex")}`;
}
function browserSessionTabNativeIdentity(record) {
	return `${record.sessionKey}\u0000${record.profile}\u0000${record.nativeTargetId}`;
}
function isTimestamp(value) {
	return typeof value === "number" && Number.isFinite(value) && value >= 0;
}
function compareBrowserSessionTabProfileAliases(left, right) {
	return left < right ? -1 : left > right ? 1 : 0;
}
function isCanonicalProfileAliases(value, profile) {
	if (value === void 0) return true;
	if (!Array.isArray(value) || value.length === 0 || value.some((entry) => typeof entry !== "string" || !entry || entry !== entry.trim().toLowerCase())) return false;
	const canonical = [...new Set(value)].toSorted(compareBrowserSessionTabProfileAliases);
	return !canonical.includes(String(profile)) && canonical.every((entry, index) => entry === value[index]);
}
function parseBrowserSessionTabRecord(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return;
	const record = value;
	const cleanupFieldsValid = record.cleanupRequestedAt === void 0 && record.cleanupAttemptToken === void 0 && record.cleanupKind === void 0 || isTimestamp(record.cleanupRequestedAt) && typeof record.cleanupAttemptToken === "string" && record.cleanupAttemptToken.length > 0 && (record.cleanupKind === "lifecycle" || record.cleanupKind === "sweep");
	if (record.version !== 1 || typeof record.sessionKey !== "string" || !record.sessionKey || typeof record.nativeTargetId !== "string" || !record.nativeTargetId || typeof record.profile !== "string" || !record.profile || !isCanonicalProfileAliases(record.profileAliases, record.profile) || typeof record.profileFingerprint !== "string" || !record.profileFingerprint || typeof record.browserInstanceFingerprint !== "string" || !record.browserInstanceFingerprint || record.interactionTargetKind !== "native" && record.interactionTargetKind !== "opaque" || !isTimestamp(record.trackedAt) || !isTimestamp(record.lastUsedAt) || !cleanupFieldsValid || Object.hasOwn(record, "baseUrl") || Object.hasOwn(record, "interactionTargetId")) return;
	return record;
}
function sameBrowserSessionTabRecord(left, right) {
	return left.version === right.version && left.sessionKey === right.sessionKey && left.nativeTargetId === right.nativeTargetId && left.profile === right.profile && (left.profileAliases?.length ?? 0) === (right.profileAliases?.length ?? 0) && (left.profileAliases ?? []).every((alias, index) => alias === right.profileAliases?.[index]) && left.profileFingerprint === right.profileFingerprint && left.browserInstanceFingerprint === right.browserInstanceFingerprint && left.interactionTargetKind === right.interactionTargetKind && left.trackedAt === right.trackedAt && left.lastUsedAt === right.lastUsedAt && left.cleanupRequestedAt === right.cleanupRequestedAt && left.cleanupAttemptToken === right.cleanupAttemptToken && left.cleanupKind === right.cleanupKind;
}
function withoutBrowserSessionTabCleanup(record) {
	const active = { ...record };
	delete active.cleanupRequestedAt;
	delete active.cleanupAttemptToken;
	delete active.cleanupKind;
	return active;
}
function updateBrowserSessionTab(key, update) {
	const updateStore = getBrowserSessionTabStore().update;
	if (!updateStore) throw new Error("Browser session tab store requires atomic update support");
	return updateStore(key, update);
}
function deleteBrowserSessionTabIf(key, predicate) {
	const deleteIf = getBrowserSessionTabStore().deleteIf;
	if (!deleteIf) throw new Error("Browser session tab store requires atomic deleteIf support");
	return deleteIf(key, predicate);
}
//#endregion
export { resolveVolatileTabAlias as C, resolveDurableTabExact as S, hasVolatileTabAlias as _, getBrowserSessionTabStore as a, rememberVolatileTabAliases as b, parseBrowserSessionTabRecord as c, withoutBrowserSessionTabCleanup as d, clearDurableTabAliases as f, hasDurableTabExact as g, hasDurableTabAlias as h, deleteBrowserSessionTabIf as i, sameBrowserSessionTabRecord as l, forgetVolatileTabAlias as m, browserSessionTabStorageKey as n, getOptionalBrowserSessionTabStore as o, clearVolatileTabAliases as p, compareBrowserSessionTabProfileAliases as r, initializeBrowserSessionTabStore as s, browserSessionTabNativeIdentity as t, updateBrowserSessionTab as u, hasVolatileTabExact as v, resolveVolatileTabExact as w, resolveDurableTabAlias as x, rememberDurableTabAliases as y };
