import { a as createLazyRuntimeSurface } from "./lazy-runtime-CgCh8H_K.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { t as formatCliCommand } from "./command-format-HwSAdvXB.js";
import { a as resolveAgentModelPrimaryValue } from "./model-input-ILUprkGk.js";
import { u as resolveDefaultSecretProviderAlias } from "./ref-contract-BHWY70rN.js";
import { r as enablePluginWithCapabilityConsent } from "./enable-Cs_eB1UN.js";
import { n as resolveManifestProviderAuthChoice, t as resolveManifestDeprecatedProviderAuthChoice } from "./provider-auth-choices-DZw3W3ra.js";
import { a as normalizeSecretInputModeInput } from "./provider-auth-input-BGFTRqyG.js";
import { t as applyAutoLocalModelLean } from "./local-model-lean-auto-BPUF8q0b.js";
import { a as projectAgentModelDefaults, i as prepareAgentModelDefaults } from "./onboard-agent-target-CwN0HHjK.js";
import { r as resolveProviderInstallCatalogEntry, t as resolveDeprecatedProviderInstallCatalogEntry } from "./provider-install-catalog-BvC2DHvQ.js";
import { r as formatAuthChoiceChoicesForCli } from "./auth-choice-options-qs_3-EHk.js";
import { t as rejectOnboardingOption } from "./onboard-options-BiFqtCCq.js";
import { i as resolveDeprecatedAuthChoiceReplacement, n as isDeprecatedAuthChoice, t as formatDeprecatedNonInteractiveAuthChoiceError } from "./auth-choice-legacy-DC0oIf6i.js";
import { t as resolvePreferredProviderForAuthChoice } from "./provider-auth-choice-preference-BkJydP0v.js";
import { t as normalizeApiKeyTokenProviderAuthChoice } from "./auth-choice.apply.api-providers-DVHKaPwd.js";
import { r as ensureModelSelectionRuntimePlugins, t as CODEX_RUNTIME_PLUGIN_ID } from "./runtime-plugin-install-Bm9kY3KL.js";
import { t as createNonInteractiveLoggingPrompter } from "./non-interactive-prompter-DLCGsi38.js";
import { c as parseNonInteractiveCustomApiFlags, d as resolveCustomProviderId, n as applyCustomApiConfig, t as CustomApiError } from "./onboard-custom-config-BU-PAsLb.js";
import { t as resolveNonInteractiveApiKey } from "./api-keys-Woo7oGPB.js";
//#region src/commands/onboard-non-interactive/local/auth-choice.plugin-providers.ts
const PROVIDER_PLUGIN_CHOICE_PREFIX = "provider-plugin:";
async function loadPluginProviderRuntime() {
	return import("./auth-choice.plugin-providers.runtime.js");
}
const loadAuthChoicePluginProvidersRuntime = createLazyRuntimeSurface(loadPluginProviderRuntime, ({ authChoicePluginProvidersRuntime }) => authChoicePluginProvidersRuntime);
/** Applies a plugin-defined auth choice, or returns undefined when it is not plugin-backed. */
async function applyNonInteractivePluginProviderChoice(params) {
	const { agentDir, workspaceDir } = params.target;
	const reject = (message) => {
		rejectOnboardingOption(params.opts, params.runtime, message);
		return null;
	};
	let nextConfig = params.nextConfig;
	const prefixedProviderId = params.authChoice.startsWith(PROVIDER_PLUGIN_CHOICE_PREFIX) ? params.authChoice.slice(16).split(":", 1)[0]?.trim() : void 0;
	if (prefixedProviderId === "") return reject(`Auth choice ${JSON.stringify(params.authChoice)} is missing a provider id. Use "${PROVIDER_PLUGIN_CHOICE_PREFIX}<provider-id>".`);
	const preferredProviderId = prefixedProviderId || await resolvePreferredProviderForAuthChoice({
		choice: params.authChoice,
		config: nextConfig,
		workspaceDir,
		includeUntrustedWorkspacePlugins: false
	});
	const trustedManifestMatch = resolveManifestProviderAuthChoice(params.authChoice, {
		config: nextConfig,
		workspaceDir,
		includeUntrustedWorkspacePlugins: false
	});
	if (trustedManifestMatch) {
		const enabled = await enablePluginWithCapabilityConsent(nextConfig, trustedManifestMatch.pluginId, { workspaceDir });
		if (!enabled.enabled) return reject(enabled.reason ?? "Provider plugin could not be enabled.");
		nextConfig = enabled.config;
	}
	const { resolveOwningPluginIdsForProviderRef, resolveProviderPluginChoice, resolvePluginProviders } = await loadAuthChoicePluginProvidersRuntime();
	const owningPluginIds = preferredProviderId ? resolveOwningPluginIdsForProviderRef({
		provider: preferredProviderId,
		config: nextConfig,
		workspaceDir
	}) : void 0;
	let providerChoice = resolveProviderPluginChoice({
		providers: resolvePluginProviders({
			config: nextConfig,
			workspaceDir,
			onlyPluginIds: owningPluginIds,
			...preferredProviderId ? { providerRefs: [preferredProviderId] } : {},
			mode: "setup",
			includeUntrustedWorkspacePlugins: false
		}),
		choice: params.authChoice
	});
	if (!providerChoice) {
		if (prefixedProviderId) return reject([`Auth choice "${params.authChoice}" was not matched to a trusted provider plugin.`, "If this provider comes from a workspace plugin, trust/allow it first and retry."].join("\n"));
		if (!trustedManifestMatch && resolveManifestProviderAuthChoice(params.authChoice, {
			config: nextConfig,
			workspaceDir,
			includeUntrustedWorkspacePlugins: true
		})) return reject([`Auth choice "${params.authChoice}" matched a provider plugin that is not trusted or enabled for setup.`, "If this provider comes from a workspace plugin, trust/allow it first and retry."].join("\n"));
		const installCatalogParams = {
			config: nextConfig,
			workspaceDir,
			includeUntrustedWorkspacePlugins: false
		};
		const deprecatedInstallCatalogEntry = resolveDeprecatedProviderInstallCatalogEntry(params.authChoice, installCatalogParams);
		if (deprecatedInstallCatalogEntry) return reject(`${JSON.stringify(params.authChoice)} is no longer supported. Use --auth-choice ${JSON.stringify(deprecatedInstallCatalogEntry.choiceId)} instead.`);
		const installCatalogEntry = resolveProviderInstallCatalogEntry(params.authChoice, installCatalogParams);
		if (!installCatalogEntry) return;
		const { ensureOnboardingPluginInstalled } = await import("./onboarding-plugin-install-DGpTZhUw.js");
		const installResult = await ensureOnboardingPluginInstalled({
			cfg: nextConfig,
			entry: {
				pluginId: installCatalogEntry.pluginId,
				label: installCatalogEntry.label,
				install: installCatalogEntry.install,
				...installCatalogEntry.origin === "bundled" ? { trustedSourceLinkedOfficialInstall: true } : {}
			},
			prompter: createNonInteractiveLoggingPrompter(params.runtime, (message) => `Non-interactive setup cannot prompt for plugin install: ${message}`),
			runtime: params.runtime,
			workspaceDir,
			promptInstall: false
		});
		if (!installResult.installed) return reject(`Unable to install the ${installCatalogEntry.label} plugin for non-interactive setup.`);
		nextConfig = installResult.cfg;
		providerChoice = resolveProviderPluginChoice({
			providers: resolvePluginProviders({
				config: nextConfig,
				workspaceDir,
				onlyPluginIds: [installCatalogEntry.pluginId],
				providerRefs: [installCatalogEntry.providerId],
				mode: "setup",
				includeUntrustedWorkspacePlugins: false
			}),
			choice: params.authChoice
		});
		if (!providerChoice) return reject(`Installed plugin "${installCatalogEntry.label}" did not expose auth choice "${params.authChoice}".`);
	}
	const enableResult = await enablePluginWithCapabilityConsent(nextConfig, providerChoice.provider.pluginId ?? providerChoice.provider.id, { workspaceDir });
	if (!enableResult.enabled) return reject(`${providerChoice.provider.label} plugin is disabled (${enableResult.reason ?? "blocked"}).`);
	const method = providerChoice.method;
	if (!method.runNonInteractive) return reject([`Auth choice "${params.authChoice}" requires interactive mode.`, `The ${providerChoice.provider.label} provider plugin does not implement non-interactive setup.`].join("\n"));
	const agentScopedModels = enableResult.config.agents?.ownership === "explicit";
	const providerConfig = agentScopedModels ? prepareAgentModelDefaults(enableResult.config, params.target) : enableResult.config;
	const projectProviderResult = (updated) => agentScopedModels ? projectAgentModelDefaults(enableResult.config, params.target, updated) : updated;
	const result = await method.runNonInteractive({
		authChoice: params.authChoice,
		config: providerConfig,
		baseConfig: params.baseConfig,
		opts: params.opts,
		runtime: params.runtime,
		agentDir,
		workspaceDir,
		resolveApiKey: params.resolveApiKey,
		toApiKeyCredential: params.toApiKeyCredential
	});
	if (!result) return result;
	const selectedModel = resolveAgentModelPrimaryValue(result.agents?.defaults?.model);
	if (!selectedModel) return projectProviderResult(result);
	const runtimes = await ensureModelSelectionRuntimePlugins({
		cfg: result,
		model: selectedModel,
		prompter: createNonInteractiveLoggingPrompter(params.runtime, (message) => message),
		runtime: params.runtime,
		workspaceDir,
		output: "silent"
	});
	if (!runtimes.ok) return reject(runtimes.message);
	if (runtimes.codexInstalled) {
		const { offerPostInstallMigrations } = await import("./setup.post-install-migration-BoyKmXVE.js");
		await offerPostInstallMigrations({
			config: runtimes.cfg,
			runtime: params.runtime,
			installedPluginIds: [CODEX_RUNTIME_PLUGIN_ID],
			nonInteractive: true
		});
	}
	const previousModel = providerConfig.agents?.defaults?.model;
	const previousAutoModel = enableResult.config.wizard?.localModelLeanAutoModel;
	const retainsAutoModelOwnership = previousAutoModel !== void 0 && previousAutoModel === resolveAgentModelPrimaryValue(previousModel) && previousAutoModel === runtimes.cfg.wizard?.localModelLeanAutoModel;
	return projectProviderResult(applyAutoLocalModelLean({
		config: runtimes.cfg,
		providerId: providerChoice.provider.id,
		modelRef: selectedModel,
		...retainsAutoModelOwnership ? { previousModelRef: previousAutoModel } : {}
	}).config);
}
//#endregion
//#region src/commands/onboard-non-interactive/local/auth-choice.ts
/** Applies a local non-interactive auth choice to the pending OpenClaw config. */
async function applyNonInteractiveAuthChoice(params) {
	const { opts, runtime, baseConfig } = params;
	let authChoice = normalizeApiKeyTokenProviderAuthChoice({
		authChoice: params.authChoice,
		tokenProvider: opts.tokenProvider,
		config: params.nextConfig,
		workspaceDir: params.target.workspaceDir,
		env: process.env
	});
	const nextConfig = params.nextConfig;
	const requestedSecretInputMode = normalizeSecretInputModeInput(opts.secretInputMode);
	if (opts.secretInputMode && !requestedSecretInputMode) {
		rejectOnboardingOption(opts, runtime, `Invalid --secret-input-mode. Use "plaintext" or "ref", or run ${formatCliCommand("openclaw onboard")} for interactive setup.`);
		return null;
	}
	const toStoredSecretInput = (paramsLocal) => {
		const { resolved } = paramsLocal;
		if (requestedSecretInputMode !== "ref") return resolved.key;
		if (resolved.source !== "env" || !resolved.envVarName) {
			const envHint = paramsLocal.envVarName ? `Set ${paramsLocal.envVarName} in env and retry` : "Set the provider API key env var and retry";
			rejectOnboardingOption(opts, runtime, [`--secret-input-mode ref requires an explicit environment variable for provider "${paramsLocal.provider}".`, `${envHint}, or use --secret-input-mode plaintext.`].join("\n"));
			return null;
		}
		return {
			source: "env",
			provider: resolveDefaultSecretProviderAlias(baseConfig, "env", { preferFirstProviderForSource: true }),
			id: resolved.envVarName
		};
	};
	const resolveApiKey = (input) => resolveNonInteractiveApiKey({
		...input,
		agentDir: params.target.agentDir,
		workspaceDir: params.target.workspaceDir,
		secretInputMode: requestedSecretInputMode,
		json: opts.json
	});
	const toApiKeyCredential = (paramsLocal) => {
		const stored = toStoredSecretInput({
			resolved: paramsLocal.resolved,
			provider: paramsLocal.provider
		});
		if (!stored) return null;
		return {
			type: "api_key",
			provider: paramsLocal.provider,
			...typeof stored === "string" ? { key: stored } : { keyRef: stored },
			...paramsLocal.email ? { email: paramsLocal.email } : {},
			...paramsLocal.metadata ? { metadata: paramsLocal.metadata } : {}
		};
	};
	if (isDeprecatedAuthChoice(authChoice, {
		config: nextConfig,
		workspaceDir: params.target.workspaceDir,
		env: process.env
	})) {
		const replacement = resolveDeprecatedAuthChoiceReplacement(authChoice, {
			config: nextConfig,
			workspaceDir: params.target.workspaceDir,
			env: process.env
		});
		if (replacement) {
			runtime.log(replacement.message);
			authChoice = replacement.normalized;
		} else {
			rejectOnboardingOption(opts, runtime, formatDeprecatedNonInteractiveAuthChoiceError(authChoice, {
				config: nextConfig,
				workspaceDir: params.target.workspaceDir,
				env: process.env
			}));
			return null;
		}
	}
	const deprecatedChoice = resolveManifestDeprecatedProviderAuthChoice(authChoice, {
		config: nextConfig,
		workspaceDir: params.target.workspaceDir,
		env: process.env
	});
	const deprecatedInstallChoice = deprecatedChoice ? void 0 : resolveDeprecatedProviderInstallCatalogEntry(authChoice, {
		config: nextConfig,
		workspaceDir: params.target.workspaceDir,
		env: process.env,
		includeUntrustedWorkspacePlugins: false
	});
	const replacementChoiceId = deprecatedChoice?.choiceId ?? deprecatedInstallChoice?.choiceId;
	if (replacementChoiceId) {
		rejectOnboardingOption(opts, runtime, `${JSON.stringify(authChoice)} is no longer supported. Use --auth-choice ${JSON.stringify(replacementChoiceId)} instead.`);
		return null;
	}
	const validAuthChoices = formatAuthChoiceChoicesForCli({
		includeSkip: true,
		config: nextConfig,
		workspaceDir: params.target.workspaceDir,
		env: process.env
	}).split("|");
	if (!validAuthChoices.includes(authChoice) && !authChoice.startsWith("provider-plugin:")) {
		rejectOnboardingOption(opts, runtime, `Unknown --auth-choice ${JSON.stringify(authChoice)}. Valid choices: ${validAuthChoices.join(", ")}.`);
		return null;
	}
	const pluginProviderChoice = await applyNonInteractivePluginProviderChoice({
		nextConfig,
		authChoice,
		opts,
		runtime,
		baseConfig,
		target: params.target,
		resolveApiKey: (input) => resolveApiKey({
			...input,
			cfg: nextConfig,
			runtime
		}),
		toApiKeyCredential
	});
	if (pluginProviderChoice !== void 0) return pluginProviderChoice;
	if (authChoice === "setup-token" || authChoice === "token") {
		rejectOnboardingOption(opts, runtime, [`Auth choice "${params.authChoice}" was not matched to a provider setup flow.`, "For Anthropic legacy token auth, use \"--auth-choice setup-token --token-provider anthropic --token <token>\" or pass \"--auth-choice token --token-provider anthropic\"."].join("\n"));
		return null;
	}
	if (authChoice === "custom-api-key") try {
		const customAuth = parseNonInteractiveCustomApiFlags({
			baseUrl: opts.customBaseUrl,
			modelId: opts.customModelId,
			compatibility: opts.customCompatibility,
			apiKey: opts.customApiKey,
			providerId: opts.customProviderId,
			supportsImageInput: opts.customImageInput
		});
		const resolvedProviderId = resolveCustomProviderId({
			config: nextConfig,
			baseUrl: customAuth.baseUrl,
			providerId: customAuth.providerId
		});
		const resolvedCustomApiKey = await resolveApiKey({
			provider: resolvedProviderId.providerId,
			cfg: nextConfig,
			flagValue: customAuth.apiKey,
			flagName: "--custom-api-key",
			envVar: "CUSTOM_API_KEY",
			envVarName: "CUSTOM_API_KEY",
			runtime,
			required: false
		});
		let customApiKeyInput;
		if (resolvedCustomApiKey && (requestedSecretInputMode !== "ref" || resolvedCustomApiKey.source !== "profile")) {
			const stored = toStoredSecretInput({
				resolved: resolvedCustomApiKey,
				provider: resolvedProviderId.providerId,
				envVarName: "CUSTOM_API_KEY"
			});
			if (!stored) return null;
			customApiKeyInput = stored;
		}
		const result = applyCustomApiConfig({
			config: nextConfig,
			baseUrl: customAuth.baseUrl,
			modelId: customAuth.modelId,
			compatibility: customAuth.compatibility,
			apiKey: customApiKeyInput,
			providerId: customAuth.providerId,
			supportsImageInput: customAuth.supportsImageInput,
			target: params.target
		});
		if (result.providerIdRenamedFrom && result.providerId) runtime.log(`Custom provider ID "${result.providerIdRenamedFrom}" already exists for a different base URL. Using "${result.providerId}".`);
		return result.config;
	} catch (err) {
		rejectOnboardingOption(opts, runtime, err instanceof CustomApiError && (err.code === "missing_required" || err.code === "invalid_compatibility") ? err.message : `Invalid custom provider config: ${err instanceof CustomApiError ? err.message : formatErrorMessage(err)}`);
		return null;
	}
	if (authChoice === "chutes" || authChoice === "minimax-global-oauth" || authChoice === "minimax-cn-oauth") {
		rejectOnboardingOption(opts, runtime, "OAuth requires interactive mode.");
		return null;
	}
	return nextConfig;
}
//#endregion
export { applyNonInteractiveAuthChoice };
