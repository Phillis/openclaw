import { n as normalizeAgentModelRefForConfig } from "./model-input-ILUprkGk.js";
import "./agent-scope-DigoIwHb.js";
import { f as resolveAgentWorkspaceDir, g as resolveDefaultAgentId, l as resolveAgentDir } from "./agent-scope-config-CUBiGmG3.js";
import { n as resolveDefaultAgentWorkspaceDir } from "./workspace-default-DNxmF3kK.js";
import { n as sanitizeTerminalText } from "./safe-text-DbwznzfG.js";
import { r as formatLiteralProviderPrefixedModelRef } from "./model-ref-shared-D4yx0hwT.js";
import { r as enablePluginWithCapabilityConsent } from "./enable-DgqKtqMD.js";
import "./workspace-CYdcs93J.js";
import "./auth-profiles-zge5bJtu.js";
import { l as persistAuthProfileBatch } from "./profiles-B9i8Wh87.js";
import { t as withPluginLifecycleLease } from "./plugin-lifecycle-lease-BZTAJyJS.js";
import { n as resolveManifestProviderAuthChoice } from "./provider-auth-choices-BGnacuDj.js";
import { t as applyAuthProfileConfig } from "./provider-auth-helpers-DW8KYD7F.js";
import { n as t } from "./i18n-BQpjgFU-.js";
import { t as createPluginCapabilityConsentPrompter } from "./plugin-capability-consent-C2sZ7kh_.js";
import { n as openUrl } from "./browser-open-DkrpjQE8.js";
import { t as isRemoteEnvironment } from "./remote-env-Bssw9_R6.js";
import { n as applyProviderAuthConfigPatch, t as applyDefaultModel } from "./provider-auth-choice-helpers-CEEA2BzH.js";
import { r as resolveProviderInstallCatalogEntry } from "./provider-install-catalog-DObjtZ9x.js";
import { t as createVpsAwareOAuthHandlers } from "./provider-oauth-flow-Dv0MubEN.js";
//#region src/plugins/provider-auth-choice.ts
function preparedWithoutAuthProfiles(result) {
	return {
		...result,
		authProfiles: [],
		persistAuthProfiles: async () => {}
	};
}
function formatModelRefForDisplay(modelRef, provider) {
	if (!provider.preserveLiteralProviderPrefix) return modelRef;
	return formatLiteralProviderPrefixedModelRef(provider.id, modelRef);
}
function restoreConfiguredPrimaryModel(nextConfig, originalConfig) {
	const originalModel = originalConfig.agents?.defaults?.model;
	const nextAgents = nextConfig.agents;
	const nextDefaults = nextAgents?.defaults;
	if (!nextDefaults) return nextConfig;
	if (originalModel !== void 0) return {
		...nextConfig,
		agents: {
			...nextAgents,
			defaults: {
				...nextDefaults,
				model: originalModel
			}
		}
	};
	const { model: _model, ...restDefaults } = nextDefaults;
	return {
		...nextConfig,
		agents: {
			...nextAgents,
			defaults: restDefaults
		}
	};
}
function resolveConfiguredDefaultModelPrimary(cfg) {
	const model = cfg.agents?.defaults?.model;
	if (typeof model === "string") return model;
	if (model && typeof model === "object" && typeof model.primary === "string") return model.primary;
}
async function noteDefaultModelResult(params) {
	const selectedModelDisplay = params.selectedModelDisplay ?? params.selectedModel;
	if (params.preserveExistingDefaultModel === true && params.previousPrimary && params.previousPrimary !== params.selectedModel) {
		await params.prompter.note(t("wizard.model.keptExistingDefault", {
			current: params.previousPrimary,
			selected: selectedModelDisplay
		}), t("wizard.model.configuredTitle"));
		return;
	}
	await params.prompter.note(t("wizard.model.defaultSet", { model: selectedModelDisplay }), t("wizard.model.configuredTitle"));
}
async function applyDefaultModelFromAuthChoice(params) {
	const previousPrimary = resolveConfiguredDefaultModelPrimary(params.entryConfig);
	const preservesDifferentPrimary = params.preserveExistingDefaultModel === true && previousPrimary !== void 0 && previousPrimary !== params.selectedModel;
	const defaultModelBaseConfig = params.entryConfig;
	let nextConfig = applyDefaultModel(params.preserveExistingDefaultModel === true ? restoreConfiguredPrimaryModel(params.config, defaultModelBaseConfig) : params.config, params.selectedModel, { preserveExistingPrimary: params.preserveExistingDefaultModel === true });
	if (!preservesDifferentPrimary) {
		const runtimePlugins = await import("./runtime-plugin-install-hfoOZGLt.js");
		const installed = await runtimePlugins.ensureModelSelectionRuntimePlugins({
			cfg: nextConfig,
			model: params.selectedModel,
			prompter: params.prompter,
			runtime: params.runtime,
			beforePersistentEffect: params.beforePersistentEffect,
			...params.workspaceDir !== void 0 ? { workspaceDir: params.workspaceDir } : {}
		});
		if (!installed.ok) {
			await params.prompter.note(installed.message, "Runtime unavailable");
			return null;
		}
		nextConfig = installed.cfg;
		await params.runSelectedModelHook(nextConfig);
		if (installed.codexInstalled) {
			const { offerPostInstallMigrations } = await import("./setup.post-install-migration-DJp00BQP.js");
			nextConfig = (await offerPostInstallMigrations({
				config: nextConfig,
				runtime: params.runtime,
				prompter: params.prompter,
				installedPluginIds: [runtimePlugins.CODEX_RUNTIME_PLUGIN_ID]
			})).config;
		}
	}
	await noteDefaultModelResult({
		previousPrimary,
		selectedModel: params.selectedModel,
		selectedModelDisplay: params.selectedModelDisplay,
		preserveExistingDefaultModel: params.preserveExistingDefaultModel,
		prompter: params.prompter
	});
	return nextConfig;
}
async function loadPluginProviderRuntime() {
	return await import("./provider-auth-choice.runtime.js");
}
function resolveManifestAuthChoiceScope(params) {
	return resolveManifestProviderAuthChoice(params.authChoice, {
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env,
		includeUntrustedWorkspacePlugins: false
	});
}
function withProviderPluginId(provider, pluginId) {
	return provider.pluginId === pluginId ? provider : {
		...provider,
		pluginId
	};
}
async function runProviderPluginAuthMethodUnpersisted(params) {
	return await params.method.run({
		config: params.config,
		env: params.env,
		agentDir: params.agentDir,
		workspaceDir: params.workspaceDir,
		prompter: params.prompter,
		runtime: params.runtime,
		...params.signal ? { signal: params.signal } : {},
		opts: params.opts,
		secretInputMode: params.secretInputMode,
		allowSecretRefPrompt: params.allowSecretRefPrompt,
		isRemote: params.isRemote ?? isRemoteEnvironment(),
		openUrl: async (url) => {
			if (params.isRemote === true) {
				await params.prompter.openUrl?.(url);
				return;
			}
			await openUrl(url);
		},
		oauth: { createVpsAwareHandlers: (opts) => createVpsAwareOAuthHandlers(opts) }
	});
}
function applyProviderPluginAuthMethodResultConfig(params) {
	const { result } = params;
	let nextConfig = params.config;
	if (result.configPatch) nextConfig = applyProviderAuthConfigPatch(nextConfig, result.configPatch, { replaceDefaultModels: result.replaceDefaultModels });
	for (const profile of result.profiles) nextConfig = applyAuthProfileConfig(nextConfig, {
		profileId: profile.profileId,
		provider: profile.credential.provider,
		mode: profile.credential.type === "token" ? "token" : profile.credential.type,
		..."email" in profile.credential && profile.credential.email ? { email: profile.credential.email } : {},
		..."displayName" in profile.credential && profile.credential.displayName ? { displayName: profile.credential.displayName } : {}
	});
	return nextConfig;
}
async function runProviderPluginAuthMethod(params) {
	const prepared = await prepareProviderPluginAuthMethod(params);
	await prepared.persistAuthProfiles();
	return {
		config: prepared.config,
		...prepared.defaultModel ? { defaultModel: prepared.defaultModel } : {}
	};
}
async function prepareProviderPluginAuthMethod(params) {
	const agentId = params.agentId ?? resolveDefaultAgentId(params.config);
	const agentDir = params.agentDir ?? resolveAgentDir(params.config, agentId);
	const workspaceDir = params.workspaceDir ?? resolveAgentWorkspaceDir(params.config, agentId) ?? resolveDefaultAgentWorkspaceDir();
	const result = await runProviderPluginAuthMethodUnpersisted({
		config: params.config,
		env: params.env,
		runtime: params.runtime,
		prompter: params.prompter,
		method: params.method,
		agentDir,
		workspaceDir,
		...params.signal ? { signal: params.signal } : {},
		...params.isRemote !== void 0 ? { isRemote: params.isRemote } : {},
		secretInputMode: params.secretInputMode,
		allowSecretRefPrompt: params.allowSecretRefPrompt,
		opts: params.opts
	});
	if (params.emitNotes !== false && result.notes && result.notes.length > 0) await params.prompter.note(result.notes.join("\n"), "Provider notes");
	const nextConfig = applyProviderPluginAuthMethodResultConfig({
		config: params.config,
		result
	});
	const defaultModel = result.defaultModel ? normalizeAgentModelRefForConfig(result.defaultModel) : void 0;
	let profilesPersisted = false;
	const persistAuthProfiles = async (profiles = result.profiles) => {
		if (profilesPersisted) return;
		await params.beforePersistentEffect?.();
		await persistAuthProfileBatch({
			profiles,
			agentDir,
			stateDir: params.env?.OPENCLAW_STATE_DIR
		});
		profilesPersisted = true;
	};
	return {
		config: nextConfig,
		...defaultModel ? { defaultModel } : {},
		authProfiles: result.profiles,
		persistAuthProfiles
	};
}
async function prepareAuthChoiceLoadedPluginProvider(params) {
	const entryConfig = params.config;
	const agentId = params.agentId ?? resolveDefaultAgentId(params.config);
	const workspaceDir = params.workspaceDir ?? resolveAgentWorkspaceDir(params.config, agentId) ?? resolveDefaultAgentWorkspaceDir();
	const { resolvePluginProviders, resolvePluginSetupProvider, resolveProviderPluginChoice, runProviderModelSelectedHook } = await loadPluginProviderRuntime();
	const prepared = await withPluginLifecycleLease({ env: params.env }, async () => {
		let nextConfig = params.config;
		let enabledConfig = params.config;
		const manifestAuthChoice = resolveManifestAuthChoiceScope({
			authChoice: params.authChoice,
			config: nextConfig,
			workspaceDir,
			env: params.env
		});
		const installCatalogEntry = resolveProviderInstallCatalogEntry(params.authChoice, {
			config: nextConfig,
			workspaceDir,
			env: params.env,
			includeUntrustedWorkspacePlugins: false
		});
		const choicePlugin = manifestAuthChoice ? {
			pluginId: manifestAuthChoice.pluginId,
			label: manifestAuthChoice.choiceLabel
		} : installCatalogEntry ? {
			pluginId: installCatalogEntry.pluginId,
			label: installCatalogEntry.label
		} : void 0;
		if (choicePlugin) {
			const enableResult = await enablePluginWithCapabilityConsent(nextConfig, choicePlugin.pluginId, {
				env: params.env,
				workspaceDir,
				onCapabilityConsent: createPluginCapabilityConsentPrompter(params.prompter, params.beforePersistentEffect)
			});
			if (!enableResult.enabled) {
				const safeLabel = sanitizeTerminalText(choicePlugin.label);
				await params.prompter.note(`${safeLabel} plugin is disabled (${enableResult.reason ?? "blocked"}).`, safeLabel);
				return preparedWithoutAuthProfiles({ config: nextConfig });
			}
			enabledConfig = enableResult.config;
		}
		const resolveScopedRuntimeProviders = (config) => resolvePluginProviders({
			config,
			workspaceDir,
			env: params.env,
			mode: "setup",
			...manifestAuthChoice ? { onlyPluginIds: [manifestAuthChoice.pluginId] } : {}
		});
		const setupProvider = manifestAuthChoice ? resolvePluginSetupProvider({
			provider: manifestAuthChoice.providerId,
			config: enabledConfig,
			workspaceDir,
			env: params.env,
			pluginIds: [manifestAuthChoice.pluginId]
		}) : void 0;
		let providers = setupProvider ? [withProviderPluginId(setupProvider, manifestAuthChoice.pluginId)] : resolveScopedRuntimeProviders(enabledConfig);
		let resolved = resolveProviderPluginChoice({
			providers,
			choice: params.authChoice
		});
		if (!resolved && setupProvider) {
			providers = resolveScopedRuntimeProviders(enabledConfig);
			resolved = resolveProviderPluginChoice({
				providers,
				choice: params.authChoice
			});
		}
		if (!resolved && installCatalogEntry) {
			const { ensureOnboardingPluginInstalled } = await import("./onboarding-plugin-install-Cxlkxm8S.js");
			const installResult = await ensureOnboardingPluginInstalled({
				cfg: nextConfig,
				entry: {
					pluginId: installCatalogEntry.pluginId,
					label: installCatalogEntry.label,
					install: installCatalogEntry.install,
					...installCatalogEntry.origin === "bundled" ? { trustedSourceLinkedOfficialInstall: true } : {}
				},
				prompter: params.prompter,
				runtime: params.runtime,
				workspaceDir,
				beforePersistentEffect: params.beforePersistentEffect
			});
			if (!installResult.installed) return preparedWithoutAuthProfiles({
				config: installResult.cfg,
				retrySelection: true
			});
			nextConfig = installResult.cfg;
			providers = resolveScopedRuntimeProviders(nextConfig);
			resolved = resolveProviderPluginChoice({
				providers,
				choice: params.authChoice
			});
		}
		if (!resolved) return nextConfig === params.config ? null : preparedWithoutAuthProfiles({
			config: nextConfig,
			retrySelection: true
		});
		if (nextConfig === params.config && enabledConfig !== params.config) nextConfig = enabledConfig;
		return {
			nextConfig,
			resolved
		};
	});
	if (!prepared || !("resolved" in prepared)) return prepared;
	let { nextConfig } = prepared;
	const { resolved } = prepared;
	const applied = await prepareProviderPluginAuthMethod({
		config: nextConfig,
		env: params.env,
		runtime: params.runtime,
		prompter: params.prompter,
		method: resolved.method,
		agentDir: params.agentDir,
		agentId: params.agentId,
		workspaceDir,
		...params.signal ? { signal: params.signal } : {},
		...params.isRemote !== void 0 ? { isRemote: params.isRemote } : {},
		...params.beforePersistentEffect ? { beforePersistentEffect: params.beforePersistentEffect } : {},
		secretInputMode: params.opts?.secretInputMode,
		allowSecretRefPrompt: false,
		opts: params.opts
	});
	nextConfig = applied.config;
	let agentModelOverride;
	if (applied.defaultModel) {
		const selectedModel = applied.defaultModel;
		const selectedModelDisplay = formatModelRefForDisplay(selectedModel, resolved.provider);
		if (params.setDefaultModel) {
			const defaultModelConfig = await applyDefaultModelFromAuthChoice({
				config: nextConfig,
				entryConfig,
				selectedModel,
				selectedModelDisplay,
				preserveExistingDefaultModel: params.preserveExistingDefaultModel,
				prompter: params.prompter,
				runtime: params.runtime,
				workspaceDir,
				beforePersistentEffect: params.beforePersistentEffect,
				runSelectedModelHook: async (config) => {
					await runProviderModelSelectedHook({
						config,
						model: selectedModel,
						prompter: params.prompter,
						agentDir: params.agentDir,
						workspaceDir
					});
				}
			});
			if (!defaultModelConfig) return preparedWithoutAuthProfiles({
				config: entryConfig,
				retrySelection: true
			});
			nextConfig = defaultModelConfig;
			return {
				config: nextConfig,
				authProfiles: applied.authProfiles,
				persistAuthProfiles: applied.persistAuthProfiles
			};
		}
		nextConfig = restoreConfiguredPrimaryModel(nextConfig, params.config);
		agentModelOverride = selectedModel;
	}
	return {
		config: nextConfig,
		agentModelOverride,
		authProfiles: applied.authProfiles,
		persistAuthProfiles: applied.persistAuthProfiles
	};
}
async function applyAuthChoiceLoadedPluginProvider(params) {
	const prepared = await prepareAuthChoiceLoadedPluginProvider(params);
	if (!prepared) return null;
	await prepared.persistAuthProfiles();
	return {
		config: prepared.config,
		...prepared.agentModelOverride ? { agentModelOverride: prepared.agentModelOverride } : {},
		...prepared.retrySelection ? { retrySelection: true } : {}
	};
}
//#endregion
export { runProviderPluginAuthMethodUnpersisted as a, runProviderPluginAuthMethod as i, applyProviderPluginAuthMethodResultConfig as n, prepareAuthChoiceLoadedPluginProvider as r, applyAuthChoiceLoadedPluginProvider as t };
