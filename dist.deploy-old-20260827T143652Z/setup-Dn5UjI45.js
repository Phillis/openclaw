import { r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { c as resolveUserPath } from "./home-dir-DcrXWQPU.js";
import "./utils-DEqefz4f.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { t as formatCliCommand } from "./command-format-Dr_cCOb_.js";
import { r as defaultRuntime } from "./runtime-DtFIMC-W.js";
import { i as resolveAgentModelPrimaryValue } from "./model-input-ekSMR50U.js";
import { r as listAgentEntries } from "./agent-scope-config-BdXMWufB.js";
import { Q as ConfigMutationConflictError } from "./io-CeQckj5v.js";
import { r as hasResolvedRosterBeforeMigrations } from "./agent-roster-provenance-DMVAWWCV.js";
import { n as createMergePatch, t as applyMergePatch } from "./merge-patch-CQFyXoKe.js";
import "./config-Dl8DJbzM.js";
import { r as resolveGatewayProbeAuthSafeWithSecretInputs } from "./probe-auth-DZpKkyuo.js";
import { r as resolveOnboardingAgentTarget } from "./onboard-agent-target-CMWQlqye.js";
import { n as t } from "./i18n-BzsUVhtU.js";
import { c as formatPluginCompatibilityNotice, r as buildPluginCompatibilitySnapshotNotices } from "./status-B5sf_ql3.js";
import { t as runWizardWithPromptNavigation } from "./navigation-prompter-CL-8dE9t.js";
import { t as resolveSetupSecretInputString } from "./setup.secret-input-CSQ3QeyY.js";
import { a as requireRiskAcknowledgement, i as readValidSetupConfigFile, n as hasQuickstartGatewayOverrides, o as resolveQuickstartGatewayDefaults, r as readSetupConfigFileSnapshot, s as writeWizardConfigFile, t as formatQuickstartGatewaySummary } from "./setup.shared-B9ACmMIv.js";
import { n as showSessionMigrationWarnings, t as promptFirstOnboardingAgent } from "./onboard-first-agent-BapWwLX8.js";
import { a as runSetupModelAuthStep, i as offerLiveModelVerification, n as listSetupMigrationOptions, r as runSetupMigrationImport, t as detectSetupMigrationSources } from "./setup.migration-import-Chyf1ex0.js";
import { n as SetupMigrationTargetChangedError, t as SetupMigrationFreshnessError } from "./setup.migration-snapshot-DhN9_LNX.js";
import { t as resolveSetupWorkspaceSelection } from "./setup.workspace-CaN_WE3-.js";
import { isDeepStrictEqual } from "node:util";
//#region src/wizard/setup.ts
const loadConfigLoggingModule = createLazyRuntimeModule(() => import("./logging-cIObUKoa.js"));
const loadOnboardConfigModule = createLazyRuntimeModule(() => import("./onboard-config-NB8UUxrg.js"));
async function runSetupWizard(opts, runtimeInput, prompter) {
	await runWizardWithPromptNavigation(prompter, async (navigationPrompter) => await runSetupWizardOnce(opts, runtimeInput, navigationPrompter));
}
async function runSetupWizardOnce(opts, runtimeInput, prompter) {
	const runtime = runtimeInput ?? defaultRuntime;
	const onboardHelpers = await import("./onboard-helpers-B2IyzQ1N.js");
	await onboardHelpers.printWizardHeader(runtime);
	await prompter.intro(t("wizard.setup.intro"));
	const snapshot = await readSetupConfigFileSnapshot();
	let currentSetupSnapshot = snapshot;
	let baseConfig = snapshot.valid ? snapshot.runtimeConfig ?? snapshot.config : {};
	let setupConfigMergeBase = structuredClone(baseConfig);
	baseConfig = await requireRiskAcknowledgement({
		opts,
		prompter,
		config: baseConfig
	});
	const writeSetupConfigFile = async (config, optsLocal = {}) => {
		const committed = await writeWizardConfigFile(config, {
			...optsLocal,
			mergeBase: setupConfigMergeBase
		});
		setupConfigMergeBase = structuredClone(committed);
		return committed;
	};
	if (snapshot.exists && !snapshot.valid) {
		await prompter.note(onboardHelpers.summarizeExistingConfig(baseConfig), t("wizard.setup.invalidConfigTitle"));
		if (snapshot.issues.length > 0) await prompter.note([
			...snapshot.issues.map((iss) => `- ${iss.path}: ${iss.message}`),
			"",
			"Docs: https://docs.openclaw.ai/gateway/configuration"
		].join("\n"), "Config issues");
		await prompter.outro(`Config invalid. Run \`${formatCliCommand("openclaw doctor")}\` to repair it, then re-run setup.`);
		runtime.exit(1);
		return;
	}
	const compatibilityNotices = snapshot.valid ? buildPluginCompatibilitySnapshotNotices({ config: baseConfig }) : [];
	if (compatibilityNotices.length > 0) await prompter.note([
		`Detected ${compatibilityNotices.length} plugin compatibility notice${compatibilityNotices.length === 1 ? "" : "s"} in the current config.`,
		...compatibilityNotices.slice(0, 4).map((notice) => `- ${formatPluginCompatibilityNotice(notice)}`),
		...compatibilityNotices.length > 4 ? [`- ... +${compatibilityNotices.length - 4} more`] : [],
		"",
		`Review: ${formatCliCommand("openclaw doctor")}`,
		`Inspect: ${formatCliCommand("openclaw plugins inspect --all")}`
	].join("\n"), t("wizard.setup.pluginCompatibilityTitle"));
	const quickstartHint = t("wizard.setup.flowQuickstartHint", { command: formatCliCommand("openclaw configure") });
	const manualHint = t("wizard.setup.flowAdvancedHint");
	const hasExistingModelConfig = resolveAgentModelPrimaryValue(baseConfig.agents?.defaults?.model) !== void 0;
	const migrationDetections = await detectSetupMigrationSources({
		config: baseConfig,
		runtime
	});
	const importOptions = (await listSetupMigrationOptions({
		baseConfig,
		detections: migrationDetections
	})).map((option) => {
		const choice = {
			value: `import:${option.providerId}`,
			label: t("wizard.migration.importFrom", { source: option.label })
		};
		if (option.hint) choice.hint = option.hint;
		return choice;
	});
	const explicitFlowRaw = opts.flow?.trim();
	const normalizedExplicitFlow = explicitFlowRaw === "manual" ? "advanced" : explicitFlowRaw;
	if (normalizedExplicitFlow && normalizedExplicitFlow !== "quickstart" && normalizedExplicitFlow !== "advanced" && normalizedExplicitFlow !== "import") {
		runtime.error("Invalid --flow. Use quickstart, manual, advanced, or import. Example: openclaw onboard --flow quickstart");
		runtime.exit(1);
		return;
	}
	const explicitFlow = normalizedExplicitFlow === "quickstart" || normalizedExplicitFlow === "advanced" || normalizedExplicitFlow === "import" ? normalizedExplicitFlow : void 0;
	const keepModelOption = hasExistingModelConfig ? {
		value: "keep-model",
		label: t("wizard.setup.flowKeepModel"),
		hint: t("wizard.setup.flowKeepModelHint")
	} : void 0;
	const importIntent = Boolean(opts.importFrom?.trim() || opts.importSource?.trim() || opts.importSecrets);
	const promptSetupFlow = async () => await prompter.select({
		message: t("wizard.setup.setupMode"),
		options: [
			...keepModelOption ? [keepModelOption] : [],
			{
				value: "quickstart",
				label: t("wizard.setup.flowQuickstart"),
				hint: quickstartHint
			},
			{
				value: "advanced",
				label: t("wizard.setup.flowAdvanced"),
				hint: manualHint
			},
			...importOptions
		],
		initialValue: hasExistingModelConfig ? "keep-model" : "quickstart"
	});
	const normalizeSetupFlow = async (choice) => {
		const keepExistingModelConfig = choice === "keep-model";
		let flow = keepExistingModelConfig ? "quickstart" : choice;
		if (opts.mode === "remote" && flow === "quickstart") {
			await prompter.note(t("wizard.setup.quickstartOnlyLocal"), t("wizard.setup.quickstartTitle"));
			flow = "advanced";
		}
		return {
			flow,
			keepExistingModelConfig
		};
	};
	const flowFromPrompt = explicitFlow === void 0 && !importIntent;
	let { flow, keepExistingModelConfig } = await normalizeSetupFlow(explicitFlow ?? (importIntent ? "import" : await promptSetupFlow()));
	if (snapshot.exists && !keepExistingModelConfig) await prompter.note(onboardHelpers.summarizeExistingConfig(baseConfig), t("wizard.setup.existingConfigTitle"));
	let usedImportFlow = false;
	let acknowledgeMigrationPromotion;
	let importedInferenceVerified = false;
	while (opts.importFrom || flow === "import" || flow.startsWith("import:")) {
		const importFrom = opts.importFrom ?? (flow.startsWith("import:") ? flow.slice(7) : void 0);
		prompter.disableBackNavigation?.();
		let migrationOutcome;
		try {
			migrationOutcome = await runSetupMigrationImport({
				opts: {
					...opts,
					...importFrom ? { importFrom } : {}
				},
				baseConfig,
				detections: migrationDetections,
				prompter,
				runtime,
				readConfigFile: readValidSetupConfigFile,
				async commitConfigFile(cfg, expectedConfig) {
					const latest = await readSetupConfigFileSnapshot();
					if (!latest.valid) throw new Error("Migration target config became invalid. Run `openclaw doctor`.");
					if (!isDeepStrictEqual(latest.exists ? latest.sourceConfig ?? latest.config : {}, expectedConfig)) throw new ConfigMutationConflictError("config changed during migration promotion", { currentHash: latest.hash ?? null });
					return await writeWizardConfigFile(cfg, {
						allowConfigSizeDrop: true,
						baseSnapshot: latest,
						...latest.hash !== void 0 ? { baseHash: latest.hash } : {}
					});
				},
				continueOnboarding: true
			});
		} catch (error) {
			if (!(error instanceof SetupMigrationFreshnessError || error instanceof SetupMigrationTargetChangedError) || !flowFromPrompt) throw error;
			await prompter.note(formatErrorMessage(error), t("wizard.setup.existingConfigTitle"));
			({flow, keepExistingModelConfig} = await normalizeSetupFlow(await promptSetupFlow()));
			continue;
		}
		usedImportFlow = true;
		acknowledgeMigrationPromotion = migrationOutcome.acknowledgePromotion;
		const migratedSnapshot = await readSetupConfigFileSnapshot();
		if (!migratedSnapshot.valid) throw new Error("Migration produced an invalid OpenClaw config. Run `openclaw doctor`.");
		currentSetupSnapshot = migratedSnapshot;
		baseConfig = migratedSnapshot.runtimeConfig ?? migratedSnapshot.config;
		setupConfigMergeBase = structuredClone(baseConfig);
		const importedModelRef = resolveAgentModelPrimaryValue(baseConfig.agents?.defaults?.model);
		importedInferenceVerified = migrationOutcome.kind === "verified-inference" && importedModelRef === migrationOutcome.modelRef;
		keepExistingModelConfig = importedInferenceVerified;
		flow = "quickstart";
		break;
	}
	const importSuppliedRoster = usedImportFlow && listAgentEntries(baseConfig).length > 0;
	if (importSuppliedRoster && opts.agentName !== void 0) {
		runtime.error("--agent-name cannot be combined with an import that supplies an agent roster. Remove --agent-name or choose an import without agents.");
		runtime.exit(1);
		return;
	}
	const wizardFlow = flow === "advanced" ? "advanced" : "quickstart";
	const hasExplicitQuickstartGatewayOverrides = wizardFlow === "quickstart" && hasQuickstartGatewayOverrides(opts);
	const quickstartGateway = resolveQuickstartGatewayDefaults(baseConfig, opts);
	if (flow === "quickstart") await prompter.note(formatQuickstartGatewaySummary(quickstartGateway, quickstartGateway.hasExisting && !hasExplicitQuickstartGatewayOverrides), "QuickStart");
	const localPort = quickstartGateway.port;
	const localUrl = `ws://127.0.0.1:${localPort}`;
	let localGatewayToken = process.env.OPENCLAW_GATEWAY_TOKEN;
	try {
		const resolvedGatewayToken = await resolveSetupSecretInputString({
			config: baseConfig,
			value: quickstartGateway.token,
			path: "gateway.auth.token",
			env: process.env
		});
		if (resolvedGatewayToken) localGatewayToken = resolvedGatewayToken;
	} catch (error) {
		await prompter.note([t("wizard.setup.secretRefProbeFailed", { field: "gateway.auth.token" }), formatErrorMessage(error)].join("\n"), t("wizard.gateway.auth"));
	}
	let localGatewayPassword = process.env.OPENCLAW_GATEWAY_PASSWORD;
	try {
		const resolvedGatewayPassword = await resolveSetupSecretInputString({
			config: baseConfig,
			value: quickstartGateway.password,
			path: "gateway.auth.password",
			env: process.env
		});
		if (resolvedGatewayPassword) localGatewayPassword = resolvedGatewayPassword;
	} catch (error) {
		await prompter.note([t("wizard.setup.secretRefProbeFailed", { field: "gateway.auth.password" }), formatErrorMessage(error)].join("\n"), t("wizard.gateway.auth"));
	}
	const localProbe = await onboardHelpers.probeGatewayReachable({
		url: localUrl,
		token: localGatewayToken,
		password: localGatewayPassword
	});
	const storedRemoteUrl = normalizeOptionalString(baseConfig.gateway?.remote?.url);
	const optionRemoteUrl = normalizeOptionalString(opts.remoteUrl);
	const optionRemoteToken = normalizeOptionalString(opts.remoteToken);
	const remoteUrlChanged = opts.remoteUrl !== void 0 && optionRemoteUrl !== storedRemoteUrl;
	const remoteSeedConfig = opts.remoteUrl === void 0 && opts.remoteToken === void 0 ? baseConfig : {
		...baseConfig,
		gateway: {
			...baseConfig.gateway,
			remote: {
				...baseConfig.gateway?.remote,
				...opts.remoteUrl !== void 0 ? { url: optionRemoteUrl } : {},
				...opts.remoteToken !== void 0 ? { token: optionRemoteToken } : remoteUrlChanged ? { token: void 0 } : {},
				...remoteUrlChanged ? { password: void 0 } : {}
			}
		}
	};
	const seededRemoteUrl = remoteSeedConfig.gateway?.remote?.url?.trim() ?? "";
	const remoteOnboard = seededRemoteUrl ? await import("./onboard-remote-OIbdLUBm.js") : null;
	const remoteUrl = seededRemoteUrl && remoteOnboard?.validateGatewayWebSocketUrl(seededRemoteUrl) === void 0 ? seededRemoteUrl : "";
	const remoteProbeAuth = remoteUrl ? await resolveGatewayProbeAuthSafeWithSecretInputs({
		cfg: remoteSeedConfig,
		env: process.env,
		mode: "remote",
		explicitAuth: { token: optionRemoteToken },
		...remoteUrlChanged ? {
			urlOverride: optionRemoteUrl,
			urlOverrideSource: "cli"
		} : {}
	}) : null;
	if (remoteProbeAuth?.warning) await prompter.note(["Could not resolve remote gateway SecretRef for setup probe.", remoteProbeAuth.warning].join("\n"), "Gateway auth");
	const remoteProbe = remoteUrl ? await onboardHelpers.probeGatewayReachable({
		url: remoteUrl,
		token: remoteProbeAuth?.auth.token,
		...remoteProbeAuth?.auth.password ? { password: remoteProbeAuth.auth.password } : {}
	}) : null;
	const mode = opts.mode ?? (flow === "quickstart" ? "local" : await prompter.select({
		message: t("wizard.setup.whatSetup"),
		options: [{
			value: "local",
			label: t("wizard.setup.localGateway"),
			hint: localProbe.ok ? t("wizard.setup.localGatewayReachable", { url: localUrl }) : t("wizard.setup.localGatewayMissing", { url: localUrl })
		}, {
			value: "remote",
			label: t("wizard.setup.remoteGateway"),
			hint: !remoteUrl ? t("wizard.setup.remoteGatewayMissing") : remoteProbe?.ok ? t("wizard.setup.remoteGatewayReachable", { url: remoteUrl }) : t("wizard.setup.remoteGatewayUnreachable", { url: remoteUrl })
		}]
	}));
	if (mode === "remote") {
		const { promptRemoteGatewayConfig } = remoteOnboard ?? await import("./onboard-remote-OIbdLUBm.js");
		const { applySkipBootstrapConfig } = await loadOnboardConfigModule();
		const { logConfigUpdated } = await loadConfigLoggingModule();
		let nextConfig = await promptRemoteGatewayConfig(remoteSeedConfig, prompter, { secretInputMode: opts.secretInputMode });
		if (opts.skipBootstrap) nextConfig = applySkipBootstrapConfig(nextConfig);
		nextConfig = onboardHelpers.applyWizardMetadata(nextConfig, {
			command: "onboard",
			mode
		});
		prompter.disableBackNavigation?.();
		await writeSetupConfigFile(nextConfig, { allowConfigSizeDrop: false });
		logConfigUpdated(runtime);
		await prompter.outro(t("wizard.setup.remoteConfigured"));
		return;
	}
	const requestedWorkspaceDir = resolveUserPath((opts.workspace ?? (flow === "quickstart" ? baseConfig.agents?.defaults?.workspace ?? onboardHelpers.DEFAULT_WORKSPACE : await prompter.text({
		message: t("wizard.setup.workspaceDirectory"),
		initialValue: baseConfig.agents?.defaults?.workspace ?? onboardHelpers.DEFAULT_WORKSPACE
	}))).trim() || onboardHelpers.DEFAULT_WORKSPACE);
	const { applyLocalSetupWorkspaceConfig, applySkipBootstrapConfig } = await loadOnboardConfigModule();
	const hasAuthoredRoster = importSuppliedRoster || hasResolvedRosterBeforeMigrations(currentSetupSnapshot);
	const { workspaceDir, allowWorkspaceChange } = await resolveSetupWorkspaceSelection({
		baseConfig,
		requestedWorkspaceDir,
		prompter,
		hasAuthoredRoster
	});
	const firstAgent = await promptFirstOnboardingAgent(hasAuthoredRoster, opts.agentName, prompter, opts.nonInteractive);
	let nextConfig = applyLocalSetupWorkspaceConfig(baseConfig, requestedWorkspaceDir, { allowWorkspaceChange: allowWorkspaceChange || !hasAuthoredRoster });
	if (opts.skipBootstrap) nextConfig = applySkipBootstrapConfig(nextConfig);
	const preModelAuthConfig = nextConfig;
	let stagedModelAuth;
	if (!keepExistingModelConfig) {
		stagedModelAuth = await runSetupModelAuthStep({
			config: nextConfig,
			opts,
			prompter,
			runtime
		});
		nextConfig = stagedModelAuth.config;
	}
	const { configureGatewayForSetup } = await import("./setup.gateway-config-7GGhcyZb.js");
	const gateway = await configureGatewayForSetup({
		flow: wizardFlow,
		baseConfig,
		nextConfig,
		localPort,
		quickstartGateway,
		secretInputMode: opts.secretInputMode,
		prompter,
		runtime
	});
	const { ensureOnboardingAgent } = await import("./onboard-agent-DylSVAgq.js");
	const onboardingAgent = await ensureOnboardingAgent({
		config: gateway.nextConfig,
		workspace: workspaceDir,
		preserveCandidateRoster: usedImportFlow,
		baseConfig,
		...firstAgent ? { firstAgent } : {}
	});
	nextConfig = onboardingAgent.config;
	const migrationWarnings = onboardingAgent.sessionMigrationWarnings;
	await showSessionMigrationWarnings(prompter, migrationWarnings);
	let liveModelVerified = false;
	let setupConfigPersisted = false;
	if (opts.nonInteractive !== true && !importedInferenceVerified && resolveAgentModelPrimaryValue(nextConfig.agents?.defaults?.model) !== void 0 && (usedImportFlow && keepExistingModelConfig || opts.authChoice !== "skip")) {
		const verificationTarget = resolveOnboardingAgentTarget(nextConfig);
		const verification = await offerLiveModelVerification({
			config: nextConfig,
			...stagedModelAuth ? { initialCandidate: {
				...stagedModelAuth,
				config: nextConfig
			} } : {},
			opts,
			prompter,
			runtime,
			workspaceDir: verificationTarget.workspaceDir,
			writeConfig: async (config) => await writeSetupConfigFile(config, { allowConfigSizeDrop: false }),
			required: usedImportFlow && keepExistingModelConfig
		});
		nextConfig = verification.config;
		liveModelVerified = verification.verified;
		setupConfigPersisted = verification.persisted;
		if (!verification.verified && verification.attempted && stagedModelAuth) nextConfig = applyMergePatch(nextConfig, createMergePatch(stagedModelAuth.config, preModelAuthConfig));
		else if (!verification.verified && stagedModelAuth) await stagedModelAuth.persistAuthProfiles();
	} else if (stagedModelAuth) await stagedModelAuth.persistAuthProfiles();
	if (!setupConfigPersisted) nextConfig = await writeSetupConfigFile(nextConfig, { allowConfigSizeDrop: false });
	prompter.disableBackNavigation?.();
	if (opts.skipChannels) await prompter.note(t("wizard.setup.skipChannels"), t("wizard.setup.channelsTitle"));
	else {
		const { listChannelPlugins } = await import("./plugins-DCGcYMgp.js");
		const { setupChannels } = await import("./onboard-channels-BdT43qEq.js");
		const quickstartAllowFromChannels = flow === "quickstart" ? listChannelPlugins().filter((plugin) => plugin.meta.quickstartAllowFrom).map((plugin) => plugin.id) : [];
		nextConfig = await setupChannels(nextConfig, runtime, prompter, {
			allowIMessageInstall: true,
			allowSignalInstall: true,
			deferStatusUntilSelection: flow === "quickstart",
			forceAllowFromChannels: quickstartAllowFromChannels,
			skipDmPolicyPrompt: flow === "quickstart",
			skipConfirm: flow === "quickstart",
			quickstartDefaults: flow === "quickstart",
			secretInputMode: opts.secretInputMode
		});
	}
	nextConfig = await writeSetupConfigFile(nextConfig, { allowConfigSizeDrop: false });
	let onboardingTarget = resolveOnboardingAgentTarget(nextConfig);
	const { logConfigUpdated } = await loadConfigLoggingModule();
	logConfigUpdated(runtime);
	await onboardHelpers.ensureWorkspaceAndSessions(onboardingTarget.workspaceDir, runtime, {
		skipBootstrap: Boolean(nextConfig.agents?.defaults?.skipBootstrap),
		skipOptionalBootstrapFiles: nextConfig.agents?.defaults?.skipOptionalBootstrapFiles,
		agentId: onboardingTarget.agentId
	});
	if (!usedImportFlow) {
		const { runSetupMemoryImportStep } = await import("./setup.memory-import-S8IVr1EF.js");
		await runSetupMemoryImportStep({
			config: nextConfig,
			prompter,
			runtime
		});
	}
	if (opts.skipSearch) await prompter.note(t("wizard.setup.skipSearch"), t("wizard.setup.searchTitle"));
	else {
		const { runSearchSetupFlow } = await import("./search-setup-D2xhd1jr.js");
		nextConfig = (await runSearchSetupFlow(nextConfig, runtime, prompter, {
			quickstartDefaults: flow === "quickstart",
			secretInputMode: opts.secretInputMode
		})).config;
	}
	if (opts.skipSkills) await prompter.note(t("wizard.setup.skipSkills"), t("wizard.setup.skillsTitle"));
	else {
		const { setupSkills } = await import("./onboard-skills-CaIi504I.js");
		nextConfig = await setupSkills(nextConfig, onboardingTarget.workspaceDir, runtime, prompter, { nodeManager: opts.nodeManager });
	}
	let commitAppRecommendationResult;
	if (flow !== "quickstart") {
		const { setupOfficialPluginInstalls } = await import("./setup.official-plugins-DDGyiQHF.js");
		nextConfig = await setupOfficialPluginInstalls({
			config: nextConfig,
			prompter,
			runtime,
			workspaceDir: onboardingTarget.workspaceDir
		});
		const { setupAppRecommendations } = await import("./setup.app-recommendations-BhcFKITO.js");
		const recommendationOutcome = await setupAppRecommendations({
			config: nextConfig,
			prompter,
			runtime,
			workspaceDir: onboardingTarget.workspaceDir,
			modelRouteVerified: liveModelVerified
		});
		nextConfig = recommendationOutcome.config;
		commitAppRecommendationResult = recommendationOutcome.commitResult;
		const { setupPluginConfig } = await import("./setup.plugin-config-CQ3_GCGO.js");
		nextConfig = await setupPluginConfig({
			config: nextConfig,
			prompter,
			workspaceDir: onboardingTarget.workspaceDir
		});
	}
	if (!opts.skipHooks) {
		const { enableDefaultOnboardingInternalHooks } = await import("./onboard-hooks-B9MyjyDR.js");
		nextConfig = enableDefaultOnboardingInternalHooks(nextConfig);
	}
	nextConfig = onboardHelpers.applyWizardMetadata(nextConfig, {
		command: "onboard",
		mode
	});
	nextConfig = await writeSetupConfigFile(nextConfig, { allowConfigSizeDrop: false });
	onboardingTarget = resolveOnboardingAgentTarget(nextConfig);
	commitAppRecommendationResult?.();
	const { finalizeSetupWizard } = await import("./setup.finalize-ig-AtkcQ.js");
	const finalizeResult = await finalizeSetupWizard({
		flow: wizardFlow,
		opts,
		baseConfig,
		hadExistingConfig: snapshot.exists,
		nextConfig,
		workspaceDir: onboardingTarget.workspaceDir,
		settings: gateway.settings,
		prompter,
		runtime
	});
	await acknowledgeMigrationPromotion?.();
	if (finalizeResult.launchedTui) runtime.exit(0);
}
//#endregion
export { runSetupWizard as t };
