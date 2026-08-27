import { c as resolveUserPath } from "./home-dir-DcrXWQPU.js";
import { m as shortenHomePath } from "./utils-DEqefz4f.js";
import { t as formatCliCommand } from "./command-format-Dr_cCOb_.js";
import { l as withConsoleSubsystemsSuppressed } from "./console-Dqa67THW.js";
import { n as formatConfigIssueLines } from "./issue-format-I3BIXbd4.js";
import { r as hasResolvedRosterBeforeMigrations } from "./agent-roster-provenance-DMVAWWCV.js";
import { n as t } from "./i18n-BzsUVhtU.js";
import { t as isUnconfiguredConfigSource } from "./fresh-install-config-DhP5LyQI.js";
import { t as WizardCancelledError } from "./prompts-B0iOB1_a.js";
import { a as requireRiskAcknowledgement } from "./setup.shared-B9ACmMIv.js";
import { n as showSessionMigrationWarnings, t as promptFirstOnboardingAgent } from "./onboard-first-agent-BapWwLX8.js";
import { n as runInteractiveOnboarding, t as hasInteractiveOnboardingTty } from "./onboard-interactive-runner-DCjqfU2_.js";
import { randomUUID } from "node:crypto";
//#region src/commands/onboard-guided-manual.ts
const SETUP_FAILURE_REASON_KEYS = {
	auth: "wizard.guided.failureAuth",
	rate_limit: "wizard.guided.failureRateLimit",
	billing: "wizard.guided.failureBilling",
	timeout: "wizard.guided.failureTimeout",
	format: "wizard.guided.failureFormat",
	unavailable: "wizard.guided.failureUnavailable",
	unknown: "wizard.guided.failureUnknown"
};
function setupFailureReason(status) {
	return t(SETUP_FAILURE_REASON_KEYS[status]);
}
function formatSetupCandidateFailure(failure) {
	return t("wizard.guided.testFailure", {
		label: failure.label,
		reason: setupFailureReason(failure.result.status),
		detail: failure.result.error
	});
}
async function noteActivationFailure(params) {
	await params.prompter.note(formatSetupCandidateFailure({
		label: params.label,
		result: params.result
	}), t("wizard.guided.aiAccessTitle"));
}
async function tryCandidate(params) {
	const progress = params.prompter.progress(t("wizard.guided.testingCandidate", {
		label: params.candidate.label,
		modelRef: params.candidate.modelRef
	}));
	const result = await withConsoleSubsystemsSuppressed(() => params.activate({
		kind: params.candidate.kind,
		modelRef: params.candidate.modelRef,
		workspace: params.workspace,
		surface: "cli",
		runtime: params.runtime
	}));
	progress.stop(result.ok ? t("wizard.guided.testPassed") : t("wizard.guided.testFailed"));
	if (result.ok) return {
		kind: "success",
		result
	};
	if (params.collectFailure) params.collectFailure({
		label: params.candidate.label,
		result
	});
	else await noteActivationFailure({
		prompter: params.prompter,
		label: params.candidate.label,
		result
	});
	return { kind: "failure" };
}
async function runManualStage(params) {
	const allowedChoices = /* @__PURE__ */ new Set([
		...params.detection.manualProviders.map((provider) => provider.id),
		...params.detection.authOptions.map((option) => option.id),
		...(params.detection.prepareOptions ?? []).map((option) => option.id)
	]);
	const detectedOptions = params.detection.candidates.map((candidate) => ({
		value: `candidate:${candidate.kind}`,
		label: t(params.autoAttemptedKinds.has(candidate.kind) ? "wizard.guided.retryCandidate" : "wizard.guided.tryCandidate", {
			label: candidate.label,
			detail: candidate.detail
		})
	}));
	if (detectedOptions.length === 0 && allowedChoices.size === 0) {
		await params.prompter.note(t("wizard.guided.noInferenceOptions"), t("wizard.guided.aiAccessTitle"));
		throw new WizardCancelledError("no inference setup options");
	}
	const additionalGroups = detectedOptions.length ? [{
		value: "detected-ai",
		label: t("wizard.guided.detectedGroupLabel"),
		hint: params.detection.candidates.map((candidate) => candidate.label).join(", "),
		methodMessage: t("wizard.guided.detectedGroupPrompt"),
		options: detectedOptions
	}] : [];
	const [{ ensureAuthProfileStore }, { detectAvailableSetupProviderIds }, { promptAuthChoiceGrouped }] = await Promise.all([
		import("./agents/auth-profiles.runtime.js"),
		import("./provider-setup-availability-BgLPXS51.js"),
		import("./auth-choice-prompt-C4NrRWL2.js")
	]);
	const store = ensureAuthProfileStore(void 0, { allowKeychainPrompt: false });
	const detectedProviderIds = await detectAvailableSetupProviderIds({
		config: params.config,
		workspaceDir: params.workspace
	});
	while (true) {
		const choice = await promptAuthChoiceGrouped({
			prompter: params.prompter,
			store,
			includeSkip: true,
			assistantVisibleOnly: false,
			allowedChoices,
			additionalGroups,
			config: params.config,
			workspaceDir: params.workspace,
			detectedProviderIds
		});
		if (choice === "skip") {
			if (params.hasActiveRoute) {
				await params.prompter.note(t("wizard.guided.keepingCurrent"), t("wizard.guided.aiAccessTitle"));
				return null;
			}
			await params.prompter.note(t("wizard.guided.nextStepsWithoutAi", { workspace: params.workspace }), t("wizard.guided.nextStepsTitle"));
			return null;
		}
		if (choice.startsWith("candidate:")) {
			const kind = choice.slice(10);
			const candidate = params.detection.candidates.find((item) => item.kind === kind);
			if (!candidate) continue;
			const attempt = await tryCandidate({
				candidate,
				workspace: params.workspace,
				runtime: params.runtime,
				prompter: params.prompter,
				activate: params.activate
			});
			if (attempt.kind === "success") return activationLines(attempt.result);
			continue;
		}
		const providerAuthOption = [...params.detection.authOptions, ...params.detection.prepareOptions ?? []].find((item) => item.id === choice);
		if (providerAuthOption) {
			const result = await withConsoleSubsystemsSuppressed(() => params.activate({
				kind: "provider-auth",
				authChoice: providerAuthOption.id,
				workspace: params.workspace,
				surface: "cli",
				runtime: params.runtime,
				prompter: params.prompter
			}));
			if (result.ok) return activationLines(result);
			await noteActivationFailure({
				prompter: params.prompter,
				label: providerAuthOption.label,
				result
			});
			continue;
		}
		const provider = params.detection.manualProviders.find((item) => item.id === choice);
		if (!provider) continue;
		const apiKey = await params.prompter.text({
			message: t("wizard.guided.apiKeyPrompt", { label: provider.label }),
			sensitive: true,
			validate: (value) => value.trim() ? void 0 : t("common.required")
		});
		const progress = params.prompter.progress(t("wizard.guided.testingManualProvider", { label: provider.label }));
		const result = await withConsoleSubsystemsSuppressed(() => params.activate({
			kind: "api-key",
			authChoice: provider.id,
			apiKey,
			workspace: params.workspace,
			surface: "cli",
			runtime: params.runtime
		}));
		progress.stop(result.ok ? t("wizard.guided.testPassed") : t("wizard.guided.testFailed"));
		if (result.ok) return activationLines(result);
		await noteActivationFailure({
			prompter: params.prompter,
			label: provider.label,
			result
		});
	}
}
function activationLines(result) {
	return [...result.lines, t("wizard.guided.repliedIn", { seconds: (result.latencyMs / 1e3).toFixed(1) })];
}
//#endregion
//#region src/commands/onboard-guided.ts
async function openSystemAgentChat(deps, workspace, runtime, acceptRisk, agentName) {
	await (deps.runSystemAgentChat ?? (async (setupWorkspace, chatRuntime, riskAccepted, setupAgentName) => {
		const { runConversationalOnboarding } = await import("./onboard-interactive-Dpkp8Hl8.js");
		await runConversationalOnboarding({
			workspace: setupWorkspace,
			...setupAgentName ? { agentName: setupAgentName } : {},
			...riskAccepted ? { acceptRisk: true } : {}
		}, chatRuntime);
	}))(workspace, runtime, acceptRisk, agentName);
}
async function persistRiskAcknowledgement(config) {
	const securityAcknowledgedAt = config.wizard?.securityAcknowledgedAt;
	if (!securityAcknowledgedAt) return;
	const { mutateConfigFileWithRetry } = await import("./config/config.js");
	return (await mutateConfigFileWithRetry({ mutate: (draft) => {
		if (draft.wizard?.securityAcknowledgedAt) return;
		draft.wizard = {
			...draft.wizard,
			securityAcknowledgedAt
		};
	} })).nextConfig.wizard?.securityAcknowledgedAt;
}
async function runGuidedOnboardingFlow(opts, runtime, deps) {
	const onboardHelpers = await import("./onboard-helpers-B2IyzQ1N.js");
	const prompter = await (deps.createPrompter?.() ?? import("./clack-prompter--aajjdty.js").then(({ createClackPrompter }) => createClackPrompter()));
	await onboardHelpers.printWizardHeader(runtime);
	await prompter.intro(t("wizard.guided.custodianIntro"));
	await prompter.note(t("wizard.guided.escapeHatches"), t("wizard.guided.welcomeTitle"));
	const { readConfigFileSnapshot } = await import("./config/config.js");
	const snapshot = await readConfigFileSnapshot();
	if (snapshot.exists && !snapshot.valid) {
		const issues = snapshot.issues.length > 0 ? formatConfigIssueLines(snapshot.issues, "-").join("\n") : t("wizard.guided.invalidConfigUnknown");
		await prompter.note(t("wizard.guided.invalidConfigDetails", {
			path: shortenHomePath(snapshot.path),
			issues
		}), t("wizard.setup.invalidConfigTitle"));
		await prompter.outro(t("wizard.guided.invalidConfigRepair", {
			fixCommand: formatCliCommand("openclaw doctor --fix"),
			inspectCommand: formatCliCommand("openclaw config validate")
		}));
		runtime.exit(1);
		return null;
	}
	const existingConfig = snapshot.exists && snapshot.valid ? snapshot.sourceConfig ?? snapshot.config : {};
	const custodianMode = (deps.handoffMode ?? "hatch") === "hatch";
	const localOnboarding = custodianMode ? await import("./local-onboarding-state-DL3bC6f_.js") : void 0;
	const previousLocalSetup = localOnboarding?.readLocalOnboardingState(snapshot.path);
	let acknowledgedConfig = await requireRiskAcknowledgement({
		opts,
		prompter,
		config: existingConfig
	});
	let securityAcknowledgedAt = acknowledgedConfig.wizard?.securityAcknowledgedAt;
	if (!existingConfig.wizard?.securityAcknowledgedAt) {
		const persistedAcknowledgement = await (deps.persistRiskAcknowledgement ?? persistRiskAcknowledgement)(acknowledgedConfig);
		if (persistedAcknowledgement) {
			securityAcknowledgedAt = persistedAcknowledgement;
			acknowledgedConfig = {
				...acknowledgedConfig,
				wizard: {
					...acknowledgedConfig.wizard,
					securityAcknowledgedAt
				}
			};
		}
	}
	const onboardingSecurityAcknowledgedAt = securityAcknowledgedAt;
	if (!onboardingSecurityAcknowledgedAt) throw new Error("Local onboarding requires its persisted security acknowledgement.");
	const firstAgent = await promptFirstOnboardingAgent(hasResolvedRosterBeforeMigrations(snapshot), opts.agentName, prompter);
	let localSetup = snapshot.exists ? localOnboarding?.readLocalOnboardingStateForConfig(snapshot.path, existingConfig) : void 0;
	if (previousLocalSetup?.status === "pending" && localSetup === void 0) {
		const currentSnapshot = await readConfigFileSnapshot();
		const currentAcknowledgement = currentSnapshot.valid ? (currentSnapshot.sourceConfig ?? currentSnapshot.config).wizard?.securityAcknowledgedAt : void 0;
		if (currentAcknowledgement === previousLocalSetup.securityAcknowledgedAt || currentAcknowledgement && currentAcknowledgement !== onboardingSecurityAcknowledgedAt) throw new Error("Another onboarding run already owns this installation. Retry setup.");
	}
	const replacePreviousSetup = !snapshot.exists || previousLocalSetup?.status === "pending" && localSetup === void 0 || previousLocalSetup?.status === "completed" && isUnconfiguredConfigSource(existingConfig);
	const resumingSetup = localSetup?.status === "pending";
	if (localSetup?.status === "pending" && opts.workspace?.trim() && resolveUserPath(opts.workspace.trim()) !== resolveUserPath(localSetup.workspace)) throw new Error("Another onboarding run owns a different workspace. Retry onboarding with its approved workspace.");
	const assertLocalSetupOwner = (config) => {
		if (localSetup?.status === "pending" && localOnboarding?.readLocalOnboardingStateForConfig(snapshot.path, config)?.runId !== localSetup.runId) throw new Error("Another onboarding run replaced this setup operation. Retry onboarding.");
	};
	let accessMode = "full";
	if (custodianMode) {
		accessMode = await prompter.select({
			message: t("wizard.guided.accessQuestion"),
			options: [{
				value: "full",
				label: t("wizard.guided.accessFullLabel"),
				hint: t("wizard.guided.accessFullHint")
			}, {
				value: "guarded",
				label: t("wizard.guided.accessGuardedLabel"),
				hint: t("wizard.guided.accessGuardedHint")
			}],
			initialValue: existingConfig.wizard?.accessMode === "guarded" ? "guarded" : "full"
		}) === "guarded" ? "guarded" : "full";
		if (existingConfig.wizard?.accessMode !== accessMode) await (deps.persistAccessMode ?? persistAccessMode)(accessMode);
	}
	const workspace = resolveUserPath(opts.workspace?.trim() || (resumingSetup ? localSetup?.workspace : void 0) || acknowledgedConfig.agents?.defaults?.workspace?.trim() || onboardHelpers.DEFAULT_WORKSPACE);
	const activateInference = deps.activate ?? (await import("./system-agent/setup-inference.js")).activateSetupInference;
	const detect = deps.detect ?? (await import("./system-agent/setup-inference.js")).detectSetupInference;
	const autoAttemptedKinds = /* @__PURE__ */ new Set();
	const ladderFailures = [];
	let detection;
	let resultLines;
	let successLabel;
	const activate = async (params) => {
		if (!localOnboarding || !resumingSetup && (existingConfig.gateway || detection?.setupComplete === true)) return await activateInference(params);
		return await activateInference({
			...params,
			onCommitStarted: (sourceConfig) => {
				params.onCommitStarted?.(sourceConfig);
				const committedSecurityAcknowledgedAt = sourceConfig.wizard?.securityAcknowledgedAt;
				if (committedSecurityAcknowledgedAt !== onboardingSecurityAcknowledgedAt) throw new Error("The onboarding configuration changed before inference could be saved. Retry onboarding.");
				if (localSetup?.status === "pending") {
					assertLocalSetupOwner(sourceConfig);
					return;
				}
				const runId = randomUUID();
				const claimedSetup = localOnboarding.beginLocalOnboarding({
					configPath: snapshot.path,
					workspace,
					securityAcknowledgedAt: committedSecurityAcknowledgedAt,
					runId,
					...replacePreviousSetup ? {
						replace: true,
						...previousLocalSetup ? { expectedRunId: previousLocalSetup.runId } : {}
					} : {}
				});
				if (claimedSetup.runId !== runId) throw new Error("Another onboarding run already owns this installation. Retry setup.");
				localSetup = claimedSetup;
			}
		});
	};
	const wantsDiscovery = accessMode === "full" || await prompter.select({
		message: t("wizard.guided.lookAroundQuestion"),
		options: [{
			value: "look",
			label: t("wizard.guided.lookAroundYes")
		}, {
			value: "manual",
			label: t("wizard.guided.lookAroundManual")
		}],
		initialValue: "look"
	}) !== "manual";
	if (wantsDiscovery) {
		const detectionProgress = prompter.progress(t("wizard.guided.detecting"));
		detection = await detect();
		detectionProgress.stop(t("wizard.guided.detected"));
		if (detection.candidates.length === 0) {
			await prompter.note(t("wizard.guided.foundNothing"), t("wizard.guided.detectedTitle"));
			if (detection.recommendedInstalls.length > 0) {
				const recommendedInstalls = detection.recommendedInstalls.map((install) => t("wizard.guided.recommendedInstall", {
					label: install.label,
					hint: install.hint,
					website: install.website
				}));
				await prompter.note(recommendedInstalls.join("\n"), t("wizard.guided.recommendedInstallsTitle"));
			}
		} else {
			const candidates = detection.candidates.map((candidate) => t("wizard.guided.detectedCandidate", {
				label: candidate.label,
				detail: candidate.detail,
				recommended: ""
			}));
			await prompter.note(candidates.join("\n"), t("wizard.guided.detectedTitle"));
			const codingAgents = !custodianMode ? [] : detection.candidates.filter((candidate) => candidate.kind === "claude-cli" || candidate.kind === "codex-cli").map((candidate) => candidate.label);
			if (codingAgents.length > 0) await prompter.note(t("wizard.guided.codingAgentQuip", { labels: codingAgents.join(", ") }), t("wizard.guided.detectedTitle"));
		}
		if (detection.unavailableCandidates.length > 0) {
			const unavailable = detection.unavailableCandidates.map((candidate) => t("wizard.guided.unavailableCandidate", {
				label: candidate.label,
				detail: candidate.detail,
				reason: candidate.reason
			}));
			await prompter.note(unavailable.join("\n"), t("wizard.guided.unavailableTitle"));
		}
		for (const candidate of detection.candidates.filter((item) => item.credentials !== false)) {
			autoAttemptedKinds.add(candidate.kind);
			const attempt = await tryCandidate({
				candidate,
				workspace,
				runtime,
				prompter,
				activate,
				...custodianMode ? { collectFailure: (failure) => ladderFailures.push(failure) } : {}
			});
			if (attempt.kind === "success") {
				resultLines = activationLines(attempt.result);
				successLabel = candidate.kind === "existing-model" ? `${candidate.label} (${candidate.modelRef})` : candidate.label;
				break;
			}
			if (candidate.kind === "existing-model") {
				await prompter.note(t("wizard.guided.existingModelKept"), t("wizard.guided.aiAccessTitle"));
				break;
			}
		}
	} else detection = {
		candidates: [],
		unavailableCandidates: [],
		recommendedInstalls: [],
		...await (deps.listManualOptions ?? (await import("./system-agent/setup-inference.js")).listManualSetupInferenceOptions)()
	};
	if (resultLines && successLabel && custodianMode) {
		if (ladderFailures.length > 0) await prompter.note(t("wizard.guided.silentFailures", { count: String(ladderFailures.length) }), t("wizard.guided.aiAccessTitle"));
		if (await prompter.select({
			message: t("wizard.guided.routeConfirm", { label: successLabel }),
			options: [{
				value: "use",
				label: t("wizard.guided.routeUse", { label: successLabel })
			}, {
				value: "other",
				label: t("wizard.guided.routeOther")
			}],
			initialValue: "use"
		}) === "other") {
			if (ladderFailures.length > 0) await prompter.note([t("wizard.guided.failedOptionsIntro"), ...ladderFailures.map(formatSetupCandidateFailure)].join("\n"), t("wizard.guided.aiAccessTitle"));
			const manualResult = await runManualStage({
				detection,
				autoAttemptedKinds,
				config: existingConfig,
				workspace,
				runtime,
				prompter,
				activate,
				hasActiveRoute: true
			});
			if (manualResult) resultLines = manualResult;
		}
	} else if (!resultLines) {
		if (ladderFailures.length > 0) {
			const failureLines = ladderFailures.map(formatSetupCandidateFailure);
			await prompter.note([t("wizard.guided.failedOptionsIntro"), ...failureLines].join("\n"), t("wizard.guided.aiAccessTitle"));
		}
		const manualResult = await runManualStage({
			detection,
			autoAttemptedKinds,
			config: existingConfig,
			workspace,
			runtime,
			prompter,
			activate
		});
		if (!manualResult) return null;
		resultLines = manualResult;
	}
	await prompter.note(resultLines.join("\n"), t("wizard.guided.appliedTitle"));
	const persistedSnapshot = await readConfigFileSnapshot();
	let persistedConfig = persistedSnapshot.valid ? persistedSnapshot.sourceConfig ?? persistedSnapshot.config : acknowledgedConfig;
	if (!custodianMode) {
		if (wantsDiscovery) await (deps.runSetupMemoryImportStep ?? (await import("./setup.memory-import-S8IVr1EF.js")).runSetupMemoryImportStep)({
			config: persistedConfig,
			prompter,
			runtime
		});
		return {
			workspace,
			next: "chat",
			...firstAgent ? { agentName: firstAgent.name } : {}
		};
	}
	const alreadyConfigured = localSetup?.status !== "pending" && Boolean(detection?.setupComplete || existingConfig.gateway);
	const { resolveSetupWorkspaceSelection } = await import("./setup.workspace-CrOyMRNV.js");
	const workspaceSelection = await resolveSetupWorkspaceSelection({
		baseConfig: existingConfig,
		requestedWorkspaceDir: workspace,
		prompter,
		canConfirmMove: !alreadyConfigured
	});
	const { allowWorkspaceChange, conflict: workspaceConflict } = workspaceSelection;
	const appliedWorkspace = workspaceSelection.workspaceDir;
	if (localSetup?.status === "pending" && resolveUserPath(appliedWorkspace) !== localSetup.workspace) throw new Error("Another onboarding run owns a different workspace. Retry onboarding with its approved workspace.");
	if (alreadyConfigured) {
		await prompter.note(t("wizard.guided.alreadySetUp"), t("wizard.guided.welcomeTitle"));
		if (workspaceConflict) await prompter.note(t("wizard.guided.workspaceConflictClassic", { command: formatCliCommand("openclaw onboard --classic") }), t("wizard.setup.workspaceConflictTitle"));
		if (firstAgent) {
			const { ensureOnboardingAgent } = await import("./onboard-agent-DylSVAgq.js");
			const created = await ensureOnboardingAgent({
				config: persistedConfig,
				workspace: appliedWorkspace,
				baseConfig: persistedConfig,
				firstAgent
			});
			persistedConfig = created.config;
			await showSessionMigrationWarnings(prompter, created.sessionMigrationWarnings);
		}
	} else {
		const applyProgress = prompter.progress(t("wizard.guided.settingUp"));
		try {
			if (localSetup?.status === "pending") {
				const ownerSnapshot = await readConfigFileSnapshot();
				if (!ownerSnapshot.exists || !ownerSnapshot.valid || resolveUserPath(ownerSnapshot.path) !== localSetup.configPath) throw new Error("Another onboarding run replaced this setup operation. Retry onboarding.");
				assertLocalSetupOwner(ownerSnapshot.sourceConfig ?? ownerSnapshot.config);
			}
			const applySetup = deps.applySetup ?? (await import("./setup-apply-DGBbZXLz.js")).applySystemAgentSetup;
			const applied = await withConsoleSubsystemsSuppressed(() => applySetup({
				workspace,
				...firstAgent ? { firstAgent } : {},
				...allowWorkspaceChange ? { allowWorkspaceChange: true } : {},
				...resumingSetup ? { resume: true } : {},
				...localSetup?.status === "pending" ? { assertCommitPreconditions: assertLocalSetupOwner } : {},
				surface: "cli",
				runtime
			}));
			if (applied.lines.length > 0) await prompter.note(applied.lines.join("\n"), t("wizard.guided.appliedTitle"));
			if (!applied.workspaceReady) throw new Error("The agent workspace could not be prepared. Retry onboarding to finish setup.");
			if (applied.gateway.status === "failed") throw new Error(applied.gateway.error);
			const appliedSnapshot = localSetup?.status === "pending" ? await (await import("./setup-recovery-HS4FDMH3.js")).completeLocalSetupRecovery({
				owner: localSetup,
				appliedConfigPath: applied.configPath
			}) : await readConfigFileSnapshot();
			if (!appliedSnapshot.valid) throw new Error("Setup wrote an invalid OpenClaw config.");
			persistedConfig = appliedSnapshot.sourceConfig ?? appliedSnapshot.config;
			applyProgress.stop(t("wizard.guided.setupDone"));
		} catch (error) {
			applyProgress.stop(t("wizard.guided.testFailed"));
			await prompter.note(t("wizard.guided.applyFailedFallback", { detail: error instanceof Error ? error.message : String(error) }), t("wizard.guided.aiAccessTitle"));
			return {
				workspace,
				next: "chat",
				...firstAgent ? { agentName: firstAgent.name } : {}
			};
		}
	}
	if (wantsDiscovery) {
		await (deps.runSetupMemoryImportStep ?? (await import("./setup.memory-import-S8IVr1EF.js")).runSetupMemoryImportStep)({
			config: persistedConfig,
			prompter,
			runtime
		});
		const recommendationOutcome = await (deps.runAppRecommendations ?? (await import("./setup.app-recommendations-BhcFKITO.js")).setupAppRecommendations)({
			config: persistedConfig,
			prompter,
			runtime,
			workspaceDir: workspace,
			modelRouteVerified: true
		});
		const recommendedConfig = recommendationOutcome.config;
		if (recommendedConfig !== persistedConfig) {
			const { writeWizardConfigFile } = await import("./setup.shared-BaXgZkEJ.js");
			persistedConfig = await writeWizardConfigFile(recommendedConfig, {
				allowConfigSizeDrop: false,
				mergeBase: persistedConfig
			});
		}
		recommendationOutcome.commitResult();
	}
	const hatchWorkspace = alreadyConfigured ? resolveUserPath(existingConfig.agents?.defaults?.workspace?.trim() || onboardHelpers.DEFAULT_WORKSPACE) : appliedWorkspace;
	if (opts.skipUi === true) {
		await prompter.outro(t("wizard.guided.complete"));
		return null;
	}
	if (opts.tui !== true) {
		if ((await (deps.runBrowserHandoff ?? (await import("./onboard-browser-handoff-C668zz06.js")).runBrowserHatchHandoff)({
			config: persistedConfig,
			prompter,
			...opts.suppressGatewayTokenOutput ? { suppressTokenOutput: true } : {}
		})).handedOff) {
			await prompter.outro(t("wizard.guided.browserHandoffReady"));
			return {
				workspace: hatchWorkspace,
				next: "browser"
			};
		}
	}
	await prompter.note(t("wizard.guided.findMeLater"), t("wizard.guided.welcomeTitle"));
	await prompter.outro(t("wizard.guided.hatchingNow"));
	return {
		workspace: hatchWorkspace,
		next: "hatch"
	};
}
async function persistAccessMode(mode) {
	const { mutateConfigFileWithRetry } = await import("./config/config.js");
	await mutateConfigFileWithRetry({ mutate: (draft) => {
		if (draft.wizard?.accessMode === mode) return;
		draft.wizard = {
			...draft.wizard,
			accessMode: mode
		};
	} });
}
async function launchHatchTui(workspace) {
	const [{ launchTuiCli }, { DEFAULT_BOOTSTRAP_FILENAME }, { restoreTerminalState }, fs, path] = await Promise.all([
		import("./tui-launch-C75uxsMK.js"),
		import("./workspace-CrKP9njv.js"),
		import("./terminal-core/restore.js"),
		import("node:fs"),
		import("node:path")
	]);
	const hasBootstrap = fs.existsSync(path.join(workspace, DEFAULT_BOOTSTRAP_FILENAME));
	restoreTerminalState("guided hatch tui", { resumeStdinIfPaused: false });
	try {
		await launchTuiCli({
			local: true,
			deliver: false,
			...hasBootstrap ? { message: t("wizard.finalize.bootstrapHatchMessage") } : {}
		});
	} finally {
		restoreTerminalState("post guided hatch tui", { resumeStdinIfPaused: false });
	}
}
async function runGuidedOnboarding(opts, runtime, deps = {}) {
	if (!hasInteractiveOnboardingTty()) {
		runtime.error(t("wizard.guided.ttyRequired"));
		runtime.exit(1);
		return;
	}
	const state = { handoff: null };
	await runInteractiveOnboarding(async () => {
		state.handoff = await runGuidedOnboardingFlow(opts, runtime, deps);
	}, runtime);
	const handoff = state.handoff;
	if (!handoff) return;
	if (handoff.next === "hatch") {
		await (deps.launchHatchTui ?? launchHatchTui)(handoff.workspace);
		return;
	}
	if (handoff.next === "browser") return;
	await openSystemAgentChat(deps, handoff.workspace, runtime, true, handoff.agentName);
}
//#endregion
export { runGuidedOnboarding as t };
