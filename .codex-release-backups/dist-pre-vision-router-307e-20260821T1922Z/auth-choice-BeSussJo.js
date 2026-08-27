import { a as createLazyRuntimeSurface } from "./lazy-runtime-CgCh8H_K.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { t as formatCliCommand } from "./command-format-Dr_cCOb_.js";
import { i as resolveAgentModelPrimaryValue } from "./model-input-ekSMR50U.js";
import { c as resolveDefaultSecretProviderAlias } from "./ref-contract-BDz7f4XS.js";
import { n as enablePluginInConfig } from "./enable-DlxSFwiq.js";
import { n as resolveManifestProviderAuthChoice, t as resolveManifestDeprecatedProviderAuthChoice } from "./provider-auth-choices-_X1FPu-e.js";
import { t as applyAutoLocalModelLean } from "./local-model-lean-auto-BPUF8q0b.js";
import { r as resolveProviderInstallCatalogEntry, t as resolveDeprecatedProviderInstallCatalogEntry } from "./provider-install-catalog-Fc8DRSVR.js";
import { a as normalizeSecretInputModeInput } from "./provider-auth-input-CWTavMIA.js";
import { r as formatAuthChoiceChoicesForCli } from "./auth-choice-options-DKvqcps4.js";
import { i as resolveDeprecatedAuthChoiceReplacement, n as isDeprecatedAuthChoice, t as formatDeprecatedNonInteractiveAuthChoiceError } from "./auth-choice-legacy-BMDRagbU.js";
import { t as resolvePreferredProviderForAuthChoice } from "./provider-auth-choice-preference-CcslvCSh.js";
import { t as normalizeApiKeyTokenProviderAuthChoice } from "./auth-choice.apply.api-providers-D5J6mIJ9.js";
import { n as ensureCodexRuntimePluginForModelSelection, t as CODEX_RUNTIME_PLUGIN_ID } from "./codex-runtime-plugin-install-B12xkK7A.js";
import { c as parseNonInteractiveCustomApiFlags, d as resolveCustomProviderId, n as applyCustomApiConfig, t as CustomApiError } from "./onboard-custom-config-Cyqa2YWn.js";
import { t as ensureCopilotRuntimePluginForModelSelection } from "./copilot-runtime-plugin-install-B3Q4FlF5.js";
import { n as resolveNonInteractiveApiKey, t as createNonInteractiveLoggingPrompter } from "./non-interactive-prompter-BLRj4VN7.js";
//#region src/commands/onboard-non-interactive/local/auth-choice.plugin-providers.ts
const PROVIDER_PLUGIN_CHOICE_PREFIX = "provider-plugin:";
async function loadPluginProviderRuntime() {
	return import("./auth-choice.plugin-providers.runtime.js");
}
const loadAuthChoicePluginProvidersRuntime = createLazyRuntimeSurface(loadPluginProviderRuntime, ({ authChoicePluginProvidersRuntime }) => authChoicePluginProvidersRuntime);
/** Applies a plugin-defined auth choice, or returns undefined when it is not plugin-backed. */
async function applyNonInteractivePluginProviderChoice(params) {
	const { agentDir, workspaceDir } = params.target;
	let nextConfig = params.nextConfig;
	const prefixedProviderId = params.authChoice.startsWith(PROVIDER_PLUGIN_CHOICE_PREFIX) ? params.authChoice.slice(16).split(":", 1)[0]?.trim() : void 0;
	const preferredProviderId = prefixedProviderId || await resolvePreferredProviderForAuthChoice({
		choice: params.authChoice,
		config: nextConfig,
		workspaceDir,
		includeUntrustedWorkspacePlugins: false
	});
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
			mode: "setup",
			includeUntrustedWorkspacePlugins: false
		}),
		choice: params.authChoice
	});
	if (!providerChoice) {
		if (prefixedProviderId) {
			params.runtime.error([`Auth choice "${params.authChoice}" was not matched to a trusted provider plugin.`, "If this provider comes from a workspace plugin, trust/allow it first and retry."].join("\n"));
			params.runtime.exit(1);
			return null;
		}
		if (!resolveManifestProviderAuthChoice(params.authChoice, {
			config: nextConfig,
			workspaceDir,
			includeUntrustedWorkspacePlugins: false
		}) && resolveManifestProviderAuthChoice(params.authChoice, {
			config: nextConfig,
			workspaceDir,
			includeUntrustedWorkspacePlugins: true
		})) {
			params.runtime.error([`Auth choice "${params.authChoice}" matched a provider plugin that is not trusted or enabled for setup.`, "If this provider comes from a workspace plugin, trust/allow it first and retry."].join("\n"));
			params.runtime.exit(1);
			return null;
		}
		const installCatalogParams = {
			config: nextConfig,
			workspaceDir,
			includeUntrustedWorkspacePlugins: false
		};
		const deprecatedInstallCatalogEntry = resolveDeprecatedProviderInstallCatalogEntry(params.authChoice, installCatalogParams);
		if (deprecatedInstallCatalogEntry) {
			params.runtime.error(`${JSON.stringify(params.authChoice)} is no longer supported. Use --auth-choice ${JSON.stringify(deprecatedInstallCatalogEntry.choiceId)} instead.`);
			params.runtime.exit(1);
			return null;
		}
		const installCatalogEntry = resolveProviderInstallCatalogEntry(params.authChoice, installCatalogParams);
		if (!installCatalogEntry) return;
		const { ensureOnboardingPluginInstalled } = await import("./onboarding-plugin-install-TsI-2kzs.js");
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
		if (!installResult.installed) {
			params.runtime.error(`Unable to install the ${installCatalogEntry.label} plugin for non-interactive setup.`);
			params.runtime.exit(1);
			return null;
		}
		nextConfig = installResult.cfg;
		providerChoice = resolveProviderPluginChoice({
			providers: resolvePluginProviders({
				config: nextConfig,
				workspaceDir,
				onlyPluginIds: [installCatalogEntry.pluginId],
				mode: "setup",
				includeUntrustedWorkspacePlugins: false
			}),
			choice: params.authChoice
		});
		if (!providerChoice) {
			params.runtime.error(`Installed plugin "${installCatalogEntry.label}" did not expose auth choice "${params.authChoice}".`);
			params.runtime.exit(1);
			return null;
		}
	}
	const enableResult = enablePluginInConfig(nextConfig, providerChoice.provider.pluginId ?? providerChoice.provider.id);
	if (!enableResult.enabled) {
		params.runtime.error(`${providerChoice.provider.label} plugin is disabled (${enableResult.reason ?? "blocked"}).`);
		params.runtime.exit(1);
		return null;
	}
	const method = providerChoice.method;
	if (!method.runNonInteractive) {
		params.runtime.error([`Auth choice "${params.authChoice}" requires interactive mode.`, `The ${providerChoice.provider.label} provider plugin does not implement non-interactive setup.`].join("\n"));
		params.runtime.exit(1);
		return null;
	}
	const result = await method.runNonInteractive({
		authChoice: params.authChoice,
		config: enableResult.config,
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
	if (!selectedModel) return result;
	const nonInteractivePrompter = createNonInteractiveLoggingPrompter(params.runtime, (message) => `Non-interactive setup cannot prompt for plugin install: ${message}`);
	const codexInstall = await ensureCodexRuntimePluginForModelSelection({
		cfg: result,
		model: selectedModel,
		prompter: nonInteractivePrompter,
		runtime: params.runtime,
		workspaceDir
	});
	if (codexInstall.installed) {
		const { offerPostInstallMigrations } = await import("./setup.post-install-migration-BlbHyi0Z.js");
		await offerPostInstallMigrations({
			config: codexInstall.cfg,
			runtime: params.runtime,
			installedPluginIds: [CODEX_RUNTIME_PLUGIN_ID],
			nonInteractive: true
		});
	}
	const copilotInstall = await ensureCopilotRuntimePluginForModelSelection({
		cfg: codexInstall.cfg,
		model: selectedModel,
		prompter: nonInteractivePrompter,
		runtime: params.runtime,
		workspaceDir
	});
	const previousModel = enableResult.config.agents?.defaults?.model;
	const previousAutoModel = enableResult.config.wizard?.localModelLeanAutoModel;
	const retainsAutoModelOwnership = previousAutoModel !== void 0 && previousAutoModel === resolveAgentModelPrimaryValue(previousModel) && previousAutoModel === copilotInstall.cfg.wizard?.localModelLeanAutoModel;
	return applyAutoLocalModelLean({
		config: copilotInstall.cfg,
		providerId: providerChoice.provider.id,
		modelRef: selectedModel,
		...retainsAutoModelOwnership ? { previousModelRef: previousAutoModel } : {}
	}).config;
}
//#endregion
//#region src/commands/onboard-non-interactive/local/auth-choice.ts
const GENERIC_NON_INTERACTIVE_AUTH_CHOICES = [
	"oauth",
	"setup-token",
	"token",
	"apiKey"
];
/** Applies a local non-interactive auth choice to the pending OpenClaw config. */
async function applyNonInteractiveAuthChoice(params) {
	const { opts, runtime, baseConfig } = params;
	let authChoice = normalizeApiKeyTokenProviderAuthChoice({
		authChoice: params.authChoice,
		tokenProvider: opts.tokenProvider,
		config: params.nextConfig,
		env: process.env
	});
	const nextConfig = params.nextConfig;
	const requestedSecretInputMode = normalizeSecretInputModeInput(opts.secretInputMode);
	if (opts.secretInputMode && !requestedSecretInputMode) {
		runtime.error(`Invalid --secret-input-mode. Use "plaintext" or "ref", or run ${formatCliCommand("openclaw onboard")} for interactive setup.`);
		runtime.exit(1);
		return null;
	}
	const toStoredSecretInput = (paramsLocal) => {
		const { resolved } = paramsLocal;
		if (requestedSecretInputMode !== "ref") return resolved.key;
		if (resolved.source !== "env" || !resolved.envVarName) {
			const envHint = paramsLocal.envVarName ? `Set ${paramsLocal.envVarName} in env and retry` : "Set the provider API key env var and retry";
			runtime.error([`--secret-input-mode ref requires an explicit environment variable for provider "${paramsLocal.provider}".`, `${envHint}, or use --secret-input-mode plaintext.`].join("\n"));
			runtime.exit(1);
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
		secretInputMode: requestedSecretInputMode
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
			runtime.error(formatDeprecatedNonInteractiveAuthChoiceError(authChoice, {
				config: nextConfig,
				workspaceDir: params.target.workspaceDir,
				env: process.env
			}));
			runtime.exit(1);
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
		runtime.error(`${JSON.stringify(authChoice)} is no longer supported. Use --auth-choice ${JSON.stringify(replacementChoiceId)} instead.`);
		runtime.exit(1);
		return null;
	}
	const validAuthChoices = Array.from(/* @__PURE__ */ new Set([...formatAuthChoiceChoicesForCli({
		includeLegacyAliases: false,
		includeSkip: true,
		config: nextConfig,
		workspaceDir: params.target.workspaceDir,
		env: process.env
	}).split("|"), ...GENERIC_NON_INTERACTIVE_AUTH_CHOICES]));
	if (!validAuthChoices.includes(authChoice) && !authChoice.startsWith("provider-plugin:")) {
		runtime.error(`Unknown --auth-choice ${JSON.stringify(authChoice)}. Valid choices: ${validAuthChoices.join(", ")}.`);
		runtime.exit(1);
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
		runtime.error([`Auth choice "${params.authChoice}" was not matched to a provider setup flow.`, "For Anthropic legacy token auth, use \"--auth-choice setup-token --token-provider anthropic --token <token>\" or pass \"--auth-choice token --token-provider anthropic\"."].join("\n"));
		runtime.exit(1);
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
			supportsImageInput: customAuth.supportsImageInput
		});
		if (result.providerIdRenamedFrom && result.providerId) runtime.log(`Custom provider ID "${result.providerIdRenamedFrom}" already exists for a different base URL. Using "${result.providerId}".`);
		return result.config;
	} catch (err) {
		if (err instanceof CustomApiError) {
			switch (err.code) {
				case "missing_required":
				case "invalid_compatibility":
					runtime.error(err.message);
					break;
				default:
					runtime.error(`Invalid custom provider config: ${err.message}`);
					break;
			}
			runtime.exit(1);
			return null;
		}
		const reason = formatErrorMessage(err);
		runtime.error(`Invalid custom provider config: ${reason}`);
		runtime.exit(1);
		return null;
	}
	if (authChoice === "oauth" || authChoice === "chutes" || authChoice === "minimax-global-oauth" || authChoice === "minimax-cn-oauth") {
		runtime.error(authChoice === "oauth" ? "Auth choice \"oauth\" is no longer supported directly. Use \"--auth-choice setup-token --token-provider anthropic\" for Anthropic legacy token auth, or a provider-specific OAuth choice." : "OAuth requires interactive mode.");
		runtime.exit(1);
		return null;
	}
	return nextConfig;
}
//#endregion
export { applyNonInteractiveAuthChoice };
