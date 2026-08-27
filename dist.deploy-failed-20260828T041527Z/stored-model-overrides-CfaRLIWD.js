import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { C as hasSessionActiveAutoModelFallback, E as resolveSessionModelOverrideRouteResolution } from "./agent-scope-DigoIwHb.js";
import { o as resolveSessionParentSessionKey } from "./sessions-BI8dPUCI.js";
import { c as resolvePersistedOverrideModelRef, s as normalizeStoredOverrideModel } from "./model-selection-Cp8EGD61.js";
//#region src/sessions/stored-model-overrides.ts
function resolveStoredOverrideFromEntry(params) {
	const normalized = normalizeStoredOverrideModel({
		providerOverride: params.entry?.providerOverride,
		modelOverride: params.entry?.modelOverride
	});
	const ref = resolvePersistedOverrideModelRef({
		defaultProvider: params.defaultProvider,
		overrideProvider: normalized.providerOverride,
		overrideModel: normalized.modelOverride
	});
	return ref ? {
		...ref,
		source: params.source,
		routeResolution: resolveSessionModelOverrideRouteResolution(params.entry)
	} : null;
}
/** Resolves only the current session's persisted model override. */
function resolveDirectStoredModelOverride(params) {
	return resolveStoredOverrideFromEntry({
		entry: params.sessionEntry,
		defaultProvider: params.defaultProvider,
		source: "session"
	});
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
	if (hasSessionActiveAutoModelFallback(parentEntry)) return null;
	return resolveStoredOverrideFromEntry({
		entry: parentEntry,
		defaultProvider: params.defaultProvider,
		source: "parent"
	});
}
//#endregion
export { resolveStoredModelOverride as n, resolveDirectStoredModelOverride as t };
