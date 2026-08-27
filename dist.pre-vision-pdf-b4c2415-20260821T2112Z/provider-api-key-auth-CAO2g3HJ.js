import { a as createLazyRuntimeSurface } from "./lazy-runtime-CgCh8H_K.js";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { m as normalizeUniqueStringEntries } from "./string-normalization-e_fvmxMf.js";
import { i as resolveAgentModelPrimaryValue } from "./model-input-ekSMR50U.js";
import { t as normalizeOptionalSecretInput } from "./normalize-secret-input-Df_qhWv_.js";
import { u as upsertAuthProfileWithLockOrThrow } from "./profiles-DTzgjRzO.js";
//#region src/plugins/provider-api-key-auth.ts
/** Builds API-key provider auth methods that write profiles and config updates. */
const loadProviderApiKeyAuthRuntime = createLazyRuntimeSurface(() => import("./provider-api-key-auth.runtime.js"), ({ providerApiKeyAuthRuntime }) => providerApiKeyAuthRuntime);
function resolveStringOption(opts, optionKey) {
	return normalizeOptionalSecretInput(opts?.[optionKey]);
}
function resolveProfileId(params) {
	return normalizeOptionalString(params.profileId) || `${params.providerId}:default`;
}
function resolveProfileIds(params) {
	const explicit = normalizeUniqueStringEntries(params.profileIds ?? []);
	if (explicit.length > 0) return explicit;
	return [resolveProfileId(params)];
}
async function resolveDefaultModel(params, context) {
	if (!params.resolveDefaultModel) return params.defaultModel;
	try {
		return await params.resolveDefaultModel(context);
	} catch {
		context.signal?.throwIfAborted();
		return params.defaultModel;
	}
}
async function applyApiKeyConfig(params) {
	const { applyAuthProfileConfig, applyPrimaryModel } = await loadProviderApiKeyAuthRuntime();
	let next = params.ctx.config;
	for (const profileId of params.profileIds) next = applyAuthProfileConfig(next, {
		profileId,
		provider: normalizeOptionalString(profileId.split(":", 1)[0]) || params.providerId,
		mode: "api_key"
	});
	if (params.applyConfig) next = params.applyConfig(next);
	if (!params.defaultModel) return next;
	if (params.preserveExistingPrimary === true && resolveAgentModelPrimaryValue(next.agents?.defaults?.model) !== void 0) return next;
	return applyPrimaryModel(next, params.defaultModel);
}
/** Creates a provider auth method that captures, stores, and configures API-key credentials. */
function createProviderApiKeyAuthMethod(params) {
	const resolveNonInteractiveCredential = async (ctx) => {
		const opts = ctx.opts;
		return await ctx.resolveApiKey({
			provider: params.providerId,
			flagValue: resolveStringOption(opts, params.optionKey),
			flagName: params.flagName,
			envVar: params.envVar,
			...params.allowProfile === false ? { allowProfile: false } : {}
		});
	};
	return {
		id: params.methodId,
		label: params.label,
		hint: params.hint,
		kind: "api_key",
		starterModel: params.defaultModel,
		wizard: params.wizard,
		run: async (ctx) => {
			const opts = ctx.opts;
			const flagValue = resolveStringOption(opts, params.optionKey);
			let capturedSecretInput;
			let capturedCredential = false;
			let capturedMode;
			const { buildApiKeyCredential, ensureApiKeyFromOptionEnvOrPrompt, normalizeApiKeyInput, validateApiKeyInput } = await loadProviderApiKeyAuthRuntime();
			const apiKey = await ensureApiKeyFromOptionEnvOrPrompt({
				token: flagValue ?? normalizeOptionalSecretInput(ctx.opts?.token),
				tokenProvider: flagValue ? params.providerId : normalizeOptionalSecretInput(ctx.opts?.tokenProvider),
				secretInputMode: ctx.allowSecretRefPrompt === false ? ctx.secretInputMode ?? "plaintext" : ctx.secretInputMode,
				config: ctx.config,
				env: ctx.env,
				expectedProviders: params.expectedProviders ?? [params.providerId],
				provider: params.providerId,
				envLabel: params.envVar,
				promptMessage: params.promptMessage,
				normalize: normalizeApiKeyInput,
				validate: validateApiKeyInput,
				prompter: ctx.prompter,
				noteMessage: params.noteMessage,
				noteTitle: params.noteTitle,
				setCredential: async (credential, mode) => {
					capturedSecretInput = credential;
					capturedCredential = true;
					capturedMode = mode;
				}
			});
			if (!capturedCredential) throw new Error(`Missing API key input for provider "${params.providerId}".`);
			const credentialInput = capturedSecretInput ?? "";
			const profileIds = resolveProfileIds(params);
			const defaultModel = await resolveDefaultModel(params, {
				apiKey,
				config: ctx.config,
				...ctx.signal ? { signal: ctx.signal } : {}
			});
			return {
				profiles: profileIds.map((profileId) => ({
					profileId,
					credential: buildApiKeyCredential(normalizeOptionalString(profileId.split(":", 1)[0]) || params.providerId, credentialInput, params.metadata, capturedMode ? {
						secretInputMode: capturedMode,
						config: ctx.config
					} : void 0)
				})),
				...params.applyConfig ? { configPatch: params.applyConfig(ctx.config) } : {},
				...defaultModel ? { defaultModel } : {}
			};
		},
		validateNonInteractive: async (ctx) => Boolean(await resolveNonInteractiveCredential(ctx)),
		runNonInteractive: async (ctx) => {
			const resolved = await resolveNonInteractiveCredential(ctx);
			if (!resolved) return null;
			const profileIds = resolveProfileIds(params);
			if (resolved.source !== "profile") for (const profileId of profileIds) {
				const credential = ctx.toApiKeyCredential({
					provider: normalizeOptionalString(profileId.split(":", 1)[0]) || params.providerId,
					resolved,
					...params.metadata ? { metadata: params.metadata } : {}
				});
				if (!credential) return null;
				await upsertAuthProfileWithLockOrThrow({
					profileId,
					credential,
					agentDir: ctx.agentDir
				});
			}
			return await applyApiKeyConfig({
				ctx,
				providerId: params.providerId,
				profileIds,
				defaultModel: await resolveDefaultModel(params, {
					apiKey: resolved.key,
					config: ctx.config
				}),
				preserveExistingPrimary: params.preserveExistingPrimary,
				applyConfig: params.applyConfig
			});
		}
	};
}
//#endregion
export { createProviderApiKeyAuthMethod as t };
