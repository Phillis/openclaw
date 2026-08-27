import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { t as modelKey } from "./model-key-CMdQNkZf.js";
import { S as resolveSessionModelOverrideRouteResolution, x as hasSessionAutoModelFallbackProvenance } from "./agent-scope-BizOtGGz.js";
import { o as normalizeModelRef } from "./model-ref-shared-poyRjWh_.js";
import { L as resolveSessionParentSessionKey } from "./agent-harness-session-key-BMj1lPtX.js";
import { o as resolveCliRuntimeCanonicalProvider } from "./cli-backends-C12K7TVt.js";
import { r as normalizeStoredOverrideModel, s as resolvePersistedOverrideModelRef } from "./model-selection-CMo6Emvk.js";
import { t as RUNTIME_MODEL_VISIBILITY_NORMALIZATION } from "./model-visibility-policy-BIpiPL3j.js";
//#region src/auto-reply/reply/stored-model-override.ts
/** Resolves only the current session's persisted model override. */
function resolveDirectStoredModelOverride(params) {
	const normalized = normalizeStoredOverrideModel({
		providerOverride: params.sessionEntry?.providerOverride,
		modelOverride: params.sessionEntry?.modelOverride
	});
	const direct = resolvePersistedOverrideModelRef({
		defaultProvider: params.defaultProvider,
		overrideProvider: normalized.providerOverride,
		overrideModel: normalized.modelOverride
	});
	return direct ? {
		...direct,
		source: "session",
		routeResolution: resolveSessionModelOverrideRouteResolution(params.sessionEntry)
	} : null;
}
/** Normalizes a stored model ref, resolving runtime aliases only for CLI-bound sessions. */
function normalizeStoredRuntimeModelRef(provider, model, cfg, sessionEntry, normalization = RUNTIME_MODEL_VISIBILITY_NORMALIZATION) {
	const normalized = normalizeModelRef(provider, model, normalization);
	const hasCliSessionBinding = sessionEntry?.cliSessionBindings?.[normalized.provider] !== void 0;
	const canonicalProvider = cfg && hasCliSessionBinding ? resolveCliRuntimeCanonicalProvider({
		runtime: normalized.provider,
		config: cfg,
		includeSetupRegistry: true
	}) : void 0;
	return canonicalProvider ? {
		...normalized,
		provider: canonicalProvider
	} : normalized;
}
function resolveParentSessionKeyCandidate(params) {
	const explicit = normalizeOptionalString(params.parentSessionKey);
	if (explicit && explicit !== params.sessionKey) return explicit;
	const derived = resolveSessionParentSessionKey(params.sessionKey);
	if (derived && derived !== params.sessionKey) return derived;
	return null;
}
/** Resolves the persisted model override visible to the current session. */
function resolveStoredModelOverride(params) {
	const direct = resolveDirectStoredModelOverride({
		sessionEntry: params.sessionEntry,
		defaultProvider: params.defaultProvider
	});
	if (direct) return direct;
	const parentKey = resolveParentSessionKeyCandidate({
		sessionKey: params.sessionKey,
		parentSessionKey: params.parentSessionKey
	});
	if (!parentKey) return null;
	const parentEntry = params.loadSessionEntry?.(parentKey) ?? params.sessionStore?.[parentKey];
	const normalizedParentOverride = normalizeStoredOverrideModel({
		providerOverride: parentEntry?.providerOverride,
		modelOverride: parentEntry?.modelOverride
	});
	const parentOverride = resolvePersistedOverrideModelRef({
		defaultProvider: params.defaultProvider,
		overrideProvider: normalizedParentOverride.providerOverride,
		overrideModel: normalizedParentOverride.modelOverride
	});
	if (!parentOverride) return null;
	return {
		...parentOverride,
		source: "parent",
		routeResolution: resolveSessionModelOverrideRouteResolution(parentEntry)
	};
}
function resolveModelRefKey(params) {
	const normalizedOverride = normalizeStoredOverrideModel({
		providerOverride: params.overrideProvider,
		modelOverride: params.overrideModel
	});
	const ref = resolvePersistedOverrideModelRef({
		defaultProvider: params.defaultProvider,
		overrideProvider: normalizedOverride.providerOverride,
		overrideModel: normalizedOverride.modelOverride
	});
	if (!ref) return null;
	const normalizedRef = normalizeModelRef(ref.provider, ref.model);
	return modelKey(normalizedRef.provider, normalizedRef.model);
}
/** Detects heartbeat auto-fallback overrides that no longer match the primary model. */
function isStaleHeartbeatAutoFallbackOverride(params) {
	if (params.isHeartbeat !== true || params.hasResolvedHeartbeatModelOverride === true) return false;
	if (params.storedOverride?.source !== "session") return false;
	const entry = params.sessionEntry;
	const recoveredAutoFallbackOverride = entry !== void 0 && entry.modelOverrideSource === void 0 && hasSessionAutoModelFallbackProvenance(entry);
	if (entry?.modelOverrideSource !== "auto" && !recoveredAutoFallbackOverride) return false;
	if (!entry) return false;
	const primaryKey = resolveModelRefKey({
		defaultProvider: params.defaultProvider,
		overrideProvider: params.primaryProvider ?? params.defaultProvider,
		overrideModel: params.primaryModel ?? params.defaultModel
	});
	if (!primaryKey) return false;
	const originKey = resolveModelRefKey({
		defaultProvider: params.defaultProvider,
		overrideProvider: entry.modelOverrideFallbackOriginProvider,
		overrideModel: entry.modelOverrideFallbackOriginModel
	});
	if (originKey) return originKey !== primaryKey;
	const noticeSelectedKey = resolveModelRefKey({
		defaultProvider: params.defaultProvider,
		overrideModel: normalizeOptionalString(entry.fallbackNotice?.selectedModel)
	});
	if (noticeSelectedKey) return noticeSelectedKey !== primaryKey;
	const storedOverrideKey = resolveModelRefKey({
		defaultProvider: params.defaultProvider,
		overrideProvider: params.storedOverride.provider,
		overrideModel: params.storedOverride.model
	});
	return storedOverrideKey !== null && storedOverrideKey !== primaryKey;
}
//#endregion
export { resolveStoredModelOverride as i, normalizeStoredRuntimeModelRef as n, resolveDirectStoredModelOverride as r, isStaleHeartbeatAutoFallbackOverride as t };
