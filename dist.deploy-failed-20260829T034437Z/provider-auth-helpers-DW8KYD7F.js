import { v as uniqueStrings } from "./string-normalization-e_fvmxMf.js";
import { p as safeRealpathSync } from "./path-D138yf8v.js";
import { g as parseEnvTemplateSecretRef, s as coerceSecretRef, t as DEFAULT_SECRET_PROVIDER_ALIAS } from "./types.secrets-Bre8L6Ts.js";
import "./boundary-path-DDLrDh1C.js";
import { w as resolveStateDir } from "./paths-BBSTUjD5.js";
import { h as resolveDefaultAgentDir } from "./agent-scope-config-CUBiGmG3.js";
import { l as isValidSecretRef } from "./ref-contract-BHWY70rN.js";
import { n as resolveProviderIdForAuth } from "./provider-auth-aliases-Csz_STEP.js";
import { t as getProviderEnvVars } from "./provider-env-vars-BuKwzcEZ.js";
import { n as normalizeSecretInput } from "./normalize-secret-input-Df_qhWv_.js";
import { t as buildAuthProfileId } from "./identity-BamcuBvi.js";
import { c as upsertAuthProfile, d as upsertAuthProfileWithLock, f as upsertAuthProfileWithLockOrThrow } from "./profiles-B9i8Wh87.js";
import fs from "node:fs";
import path from "node:path";
//#region src/plugins/provider-auth-helpers.ts
const resolveAuthAgentDir = (agentDir, config) => agentDir ?? resolveDefaultAgentDir(config ?? {});
function buildEnvSecretRef(id) {
	return {
		source: "env",
		provider: DEFAULT_SECRET_PROVIDER_ALIAS,
		id
	};
}
function resolveProviderDefaultEnvSecretRef(provider, config) {
	const envVar = getProviderEnvVars(provider, {
		...config ? { config } : {},
		includeUntrustedWorkspacePlugins: false
	})?.find((candidate) => candidate.trim().length > 0);
	if (!envVar) throw new Error(`Provider "${provider}" does not have a default env var mapping for secret-input-mode=ref.`);
	return buildEnvSecretRef(envVar);
}
function resolveApiKeySecretInput(provider, input, options) {
	if (input !== null && typeof input === "object") {
		const coercedRef = coerceSecretRef(input);
		if (!coercedRef || !isValidSecretRef(coercedRef)) throw new Error("API key SecretRef is invalid.");
		return coercedRef;
	}
	if (options?.secretInputMode === "plaintext") return normalizeSecretInput(input);
	const coercedRef = coerceSecretRef(input);
	if (coercedRef) {
		if (!isValidSecretRef(coercedRef)) throw new Error("API key SecretRef is invalid.");
		return coercedRef;
	}
	const normalized = normalizeSecretInput(input);
	const inlineEnvRef = parseEnvTemplateSecretRef(normalized, DEFAULT_SECRET_PROVIDER_ALIAS);
	if (inlineEnvRef) return inlineEnvRef;
	if (options?.secretInputMode === "ref") return resolveProviderDefaultEnvSecretRef(provider, options.config);
	return normalized;
}
function buildApiKeyCredential(provider, input, metadata, options) {
	const secretInput = resolveApiKeySecretInput(provider, input, options);
	if (typeof secretInput === "string") return {
		type: "api_key",
		provider,
		key: secretInput,
		...metadata ? { metadata } : {}
	};
	return {
		type: "api_key",
		provider,
		keyRef: secretInput,
		...metadata ? { metadata } : {}
	};
}
function upsertApiKeyProfile(params) {
	const profileId = params.profileId ?? buildAuthProfileId({ providerId: params.provider });
	upsertAuthProfile({
		profileId,
		credential: buildApiKeyCredential(params.provider, params.input, params.metadata, params.options),
		agentDir: resolveAuthAgentDir(params.agentDir, params.options?.config)
	});
	return profileId;
}
function applyAuthProfileConfig(cfg, params) {
	const normalizedProvider = resolveProviderIdForAuth(params.provider, { config: cfg });
	const profiles = {
		...cfg.auth?.profiles,
		[params.profileId]: {
			provider: params.provider,
			mode: params.mode,
			...params.email ? { email: params.email } : {},
			...params.displayName ? { displayName: params.displayName } : {}
		}
	};
	const configuredProviderProfiles = Object.entries(cfg.auth?.profiles ?? {}).filter(([, profile]) => resolveProviderIdForAuth(profile.provider, { config: cfg }) === normalizedProvider).map(([profileId, profile]) => ({
		profileId,
		mode: profile.mode
	}));
	const matchingProviderOrderEntries = Object.entries(cfg.auth?.order ?? {}).filter(([providerId]) => resolveProviderIdForAuth(providerId, { config: cfg }) === normalizedProvider);
	const existingProviderOrder = matchingProviderOrderEntries.length > 0 ? uniqueStrings(matchingProviderOrderEntries.flatMap(([, order]) => order)) : void 0;
	const preferProfileFirst = params.preferProfileFirst ?? true;
	const reorderedProviderOrder = existingProviderOrder && preferProfileFirst ? [params.profileId, ...existingProviderOrder.filter((profileId) => profileId !== params.profileId)] : existingProviderOrder;
	const hasMixedConfiguredModes = configuredProviderProfiles.some(({ profileId, mode }) => profileId !== params.profileId && mode !== params.mode);
	const derivedProviderOrder = existingProviderOrder === void 0 && preferProfileFirst && hasMixedConfiguredModes ? [params.profileId, ...configuredProviderProfiles.map(({ profileId }) => profileId).filter((profileId) => profileId !== params.profileId)] : void 0;
	const baseOrder = matchingProviderOrderEntries.length > 0 ? Object.fromEntries(Object.entries(cfg.auth?.order ?? {}).filter(([providerId]) => resolveProviderIdForAuth(providerId, { config: cfg }) !== normalizedProvider)) : cfg.auth?.order;
	const order = existingProviderOrder !== void 0 ? {
		...baseOrder,
		[normalizedProvider]: reorderedProviderOrder?.includes(params.profileId) ? reorderedProviderOrder : [...reorderedProviderOrder ?? [], params.profileId]
	} : derivedProviderOrder ? {
		...baseOrder,
		[normalizedProvider]: derivedProviderOrder
	} : baseOrder;
	return {
		...cfg,
		auth: {
			...cfg.auth,
			profiles,
			...order ? { order } : {}
		}
	};
}
/** Returns true when config still names a removed auth profile. */
function configReferencesAuthProfile(cfg, profileId) {
	return Boolean(cfg.auth?.profiles?.[profileId]) || Object.values(cfg.auth?.order ?? {}).some((order) => order.includes(profileId)) || Object.values(cfg.models?.providers ?? {}).some((provider) => provider.apiKey === profileId);
}
/**
* Drops a profile from `auth.profiles`, every `auth.order` list, and provider-entry
* `apiKey` references. An emptied provider order is deleted rather than left as
* `[]`, because an authored empty order is a hard "select no profiles" instruction.
*/
function removeAuthProfileConfig(cfg, profileId) {
	if (!configReferencesAuthProfile(cfg, profileId)) return cfg;
	const authReferencesProfile = Boolean(cfg.auth?.profiles?.[profileId]) || Object.values(cfg.auth?.order ?? {}).some((providerOrder) => providerOrder.includes(profileId));
	const profiles = Object.fromEntries(Object.entries(cfg.auth?.profiles ?? {}).filter(([id]) => id !== profileId));
	const order = Object.entries(cfg.auth?.order ?? {}).reduce((acc, [providerId, providerOrder]) => {
		const next = providerOrder.filter((id) => id !== profileId);
		if (next.length > 0 || next.length === providerOrder.length) acc[providerId] = next;
		return acc;
	}, {});
	const { order: _droppedOrder, ...auth } = cfg.auth ?? {};
	const providers = Object.fromEntries(Object.entries(cfg.models?.providers ?? {}).map(([providerId, provider]) => {
		if (provider.apiKey !== profileId) return [providerId, provider];
		const { apiKey: _droppedApiKey, ...nextProvider } = provider;
		return [providerId, nextProvider];
	}));
	return {
		...cfg,
		...authReferencesProfile ? { auth: {
			...auth,
			profiles,
			...Object.keys(order).length > 0 ? { order } : {}
		} } : {},
		...cfg.models?.providers ? { models: {
			...cfg.models,
			providers
		} } : {}
	};
}
function resolveSiblingAgentDirs(primaryAgentDir) {
	const normalized = path.resolve(primaryAgentDir);
	const parentOfAgent = path.dirname(normalized);
	const candidateAgentsRoot = path.dirname(parentOfAgent);
	const agentsRoot = path.basename(normalized) === "agent" && path.basename(candidateAgentsRoot) === "agents" ? candidateAgentsRoot : path.join(resolveStateDir(), "agents");
	const discovered = (() => {
		try {
			return fs.readdirSync(agentsRoot, { withFileTypes: true });
		} catch {
			return [];
		}
	})().filter((entry) => entry.isDirectory() || entry.isSymbolicLink()).map((entry) => path.join(agentsRoot, entry.name, "agent"));
	const seen = /* @__PURE__ */ new Set();
	const result = [];
	for (const dir of [normalized, ...discovered]) {
		const real = safeRealpathSync(path.resolve(dir));
		if (real && !seen.has(real)) {
			seen.add(real);
			result.push(real);
		}
	}
	return result;
}
async function writeOAuthCredentials(provider, creds, agentDir, options) {
	const email = typeof creds.email === "string" && creds.email.trim() ? creds.email.trim() : "default";
	const profileId = buildAuthProfileId({
		providerId: provider,
		profileName: options?.profileName ?? email
	});
	const resolvedAgentDir = path.resolve(resolveAuthAgentDir(agentDir));
	const targetAgentDirs = options?.syncSiblingAgents ? resolveSiblingAgentDirs(resolvedAgentDir) : [resolvedAgentDir];
	const credential = {
		type: "oauth",
		provider,
		...creds,
		...options?.displayName ? { displayName: options.displayName } : {}
	};
	await upsertAuthProfileWithLockOrThrow({
		profileId,
		credential,
		agentDir: resolvedAgentDir
	});
	if (options?.syncSiblingAgents) {
		const primaryReal = safeRealpathSync(path.resolve(resolvedAgentDir));
		for (const targetAgentDir of targetAgentDirs) {
			const targetReal = safeRealpathSync(path.resolve(targetAgentDir));
			if (targetReal && primaryReal && targetReal === primaryReal) continue;
			try {
				await upsertAuthProfileWithLock({
					profileId,
					credential,
					agentDir: targetAgentDir
				});
			} catch {}
		}
	}
	return profileId;
}
//#endregion
export { upsertApiKeyProfile as a, removeAuthProfileConfig as i, buildApiKeyCredential as n, writeOAuthCredentials as o, configReferencesAuthProfile as r, applyAuthProfileConfig as t };
