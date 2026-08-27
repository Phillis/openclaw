import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.js";
import { r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
import { i as parseModelCatalogRef } from "./model-catalog-refs-BdjEHOKQ.js";
import { t as resolveModelRuntimePolicy } from "./model-runtime-policy-rNKXMHlB.js";
import { n as resolveProviderIdForAuth } from "./provider-auth-aliases-BdBosV0l.js";
import { n as listCliRuntimeModelBackendBindings, o as resolveCliRuntimeCanonicalProvider, r as listCliRuntimeProviderIds, s as resolveCliRuntimeModelBackendBinding, t as isCliRuntimeModelBackendForProvider } from "./cli-backends-Ap-awZem.js";
//#region src/agents/model-runtime-aliases.ts
/**
* Resolves CLI runtime aliases to provider/model auth labels and execution ids.
*/
const RETIRED_MODEL_PICKER_PROVIDERS = /* @__PURE__ */ new Set(["codex", "codex-cli"]);
/** True for retired provider ids that should stay out of model selection surfaces. */
function isRetiredModelPickerProvider(provider) {
	return RETIRED_MODEL_PICKER_PROVIDERS.has(normalizeProviderId(provider));
}
/** Creates a provider visibility predicate for model picker rendering. */
function createModelPickerVisibleProviderPredicate(params = {}) {
	const cliRuntimeProviders = new Set(listCliRuntimeProviderIds({
		config: params.config,
		env: params.env,
		includeSetupRegistry: params.includeSetupRegistry ?? false
	}));
	return (provider) => {
		const normalized = normalizeProviderId(provider);
		return !isRetiredModelPickerProvider(normalized) && !cliRuntimeProviders.has(normalized);
	};
}
/** True for CLI runtime provider ids such as `claude-cli` and `google-gemini-cli`. */
function isCliRuntimeProvider(provider, params = {}) {
	const normalized = normalizeProviderId(provider);
	return listCliRuntimeProviderIds({
		config: params.config,
		env: params.env,
		includeSetupRegistry: params.includeSetupRegistry ?? (params.config !== void 0 || params.env !== void 0)
	}).includes(normalized);
}
function isCliRuntimeAlias(runtime) {
	const normalized = normalizeProviderId(runtime ?? "");
	return normalized ? listCliRuntimeModelBackendBindings().some((binding) => binding.runtime === normalized) : false;
}
function isCliRuntimeAliasForProvider(params) {
	return isCliRuntimeModelBackendForProvider({
		provider: params.provider,
		runtime: params.runtime,
		config: params.cfg
	});
}
function canonicalizeRuntimeAliasProvider(provider, options = {}) {
	return resolveCliRuntimeCanonicalProvider({
		runtime: provider,
		config: options.config,
		env: options.env,
		includeSetupRegistry: options.includeSetupRegistry ?? (options.config !== void 0 || options.env !== void 0)
	}) ?? provider;
}
function normalizeRuntimeModelRefForComparison(raw, options = {}) {
	const trimmed = raw.trim();
	const parsed = parseModelCatalogRef(trimmed);
	if (!parsed) return normalizeProviderId(canonicalizeRuntimeAliasProvider(trimmed, options));
	return `${normalizeProviderId(canonicalizeRuntimeAliasProvider(parsed.provider, options))}/${parsed.modelId}`;
}
function normalizeRuntimeModelRefWithoutAlias(raw) {
	const trimmed = raw.trim();
	const parsed = parseModelCatalogRef(trimmed);
	if (!parsed) return normalizeProviderId(trimmed);
	return `${parsed.provider}/${parsed.modelId}`;
}
function areRuntimeModelRefsEquivalent(left, right, options = {}) {
	if (normalizeRuntimeModelRefWithoutAlias(left) === normalizeRuntimeModelRefWithoutAlias(right)) return true;
	return normalizeRuntimeModelRefForComparison(left, options) === normalizeRuntimeModelRefForComparison(right, options);
}
function shouldPreferActiveRuntimeAliasAuthLabel(params) {
	if (!params.runtimeAliasModelEquivalent) return false;
	const selectedAuth = normalizeOptionalLowercaseString(params.selectedAuthLabel);
	const activeAuth = normalizeOptionalLowercaseString(params.activeAuthLabel);
	if (!activeAuth || activeAuth === "unknown") return false;
	return selectedAuth === "unknown" || Boolean(selectedAuth?.startsWith("api-key")) && (activeAuth.startsWith("oauth") || activeAuth.startsWith("token"));
}
function resolveConfiguredRuntime(params) {
	const policy = resolveModelRuntimePolicy({
		config: params.cfg,
		provider: params.provider,
		modelId: params.modelId,
		agentId: params.agentId
	});
	return {
		runtime: policy.policy?.id?.trim() || void 0,
		matchedProvider: policy.matchedProvider
	};
}
function resolveRuntimeAuthProvider(provider, params) {
	return resolveProviderIdForAuth(provider, {
		config: params.cfg,
		...params.metadataSnapshot ? { metadataSnapshot: params.metadataSnapshot } : {}
	});
}
function resolveProfileRuntimeAlias(params) {
	const profile = params.cfg?.auth?.profiles?.[params.profileId];
	if (!profile?.provider) return;
	const provider = normalizeProviderId(params.provider);
	const profileProvider = normalizeProviderId(profile.provider);
	if (!provider || !profileProvider) return;
	if (resolveRuntimeAuthProvider(provider, params) !== resolveRuntimeAuthProvider(profileProvider, params)) return;
	if (profileProvider === provider) return;
	return resolveCliRuntimeModelBackendBinding({
		config: params.cfg,
		provider,
		runtime: profileProvider
	})?.runtime;
}
function resolveCliRuntimeFromAuthProfile(params) {
	if (!params.cfg?.auth?.profiles) return;
	if (params.authProfileId?.trim()) return resolveProfileRuntimeAlias({
		...params,
		provider: params.provider,
		profileId: params.authProfileId.trim()
	});
	const provider = normalizeProviderId(params.provider);
	const providerAuthKey = resolveRuntimeAuthProvider(provider, params);
	const orderedProfileIds = [...params.cfg.auth.order?.[providerAuthKey] ?? [], ...providerAuthKey === provider ? [] : params.cfg.auth.order?.[provider] ?? []];
	for (const profileId of orderedProfileIds) {
		const profile = params.cfg.auth.profiles[profileId];
		if (!profile?.provider) continue;
		if (resolveRuntimeAuthProvider(profile.provider, params) !== providerAuthKey) continue;
		return resolveProfileRuntimeAlias({
			...params,
			provider,
			profileId
		});
	}
	const compatibleProfileIds = Object.entries(params.cfg.auth.profiles).filter(([, profile]) => {
		if (!profile?.provider) return false;
		return resolveRuntimeAuthProvider(profile.provider, params) === providerAuthKey;
	}).map(([profileId]) => profileId);
	if (compatibleProfileIds.length !== 1) return;
	const [profileId] = compatibleProfileIds;
	return profileId ? resolveProfileRuntimeAlias({
		...params,
		provider,
		profileId
	}) : void 0;
}
function resolveCliRuntimeExecutionProvider(params) {
	const provider = normalizeProviderId(params.provider);
	const { runtime, matchedProvider } = resolveConfiguredRuntime({
		...params,
		provider
	});
	if (runtime === "openclaw") return;
	if (!runtime || runtime === "auto") return resolveCliRuntimeFromAuthProfile({
		...params,
		provider
	});
	const effectiveProvider = provider || normalizeProviderId(matchedProvider ?? "");
	if (!effectiveProvider) return;
	return resolveCliRuntimeModelBackendBinding({
		config: params.cfg,
		provider: effectiveProvider,
		runtime
	})?.runtime;
}
//#endregion
export { isCliRuntimeProvider as a, shouldPreferActiveRuntimeAliasAuthLabel as c, isCliRuntimeAliasForProvider as i, createModelPickerVisibleProviderPredicate as n, isRetiredModelPickerProvider as o, isCliRuntimeAlias as r, resolveCliRuntimeExecutionProvider as s, areRuntimeModelRefsEquivalent as t };
