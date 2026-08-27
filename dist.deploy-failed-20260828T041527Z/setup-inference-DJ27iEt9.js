import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { c as resolveUserPath } from "./home-dir-BFvskzn8.js";
import "./utils-Bw16L5tB.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { a as resolveAgentModelPrimaryValue, n as normalizeAgentModelRefForConfig } from "./model-input-ILUprkGk.js";
import { o as resolveAgentEffectiveModelPrimary } from "./agent-scope-DigoIwHb.js";
import { f as resolveAgentWorkspaceDir, p as resolveAmbientOwnerAgentId, r as listAgentEntries } from "./agent-scope-config-CUBiGmG3.js";
import { o as normalizePluginTargetConfig } from "./config-state-Bgpvw0Q6.js";
import { s as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-BI5GxVU3.js";
import { s as normalizeProviderId } from "./model-ref-shared-D4yx0hwT.js";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BIKs-96s.js";
import { t as getActivePluginRegistryWorkspaceDirFromState } from "./runtime-state-B4nZOuAi.js";
import { n as createMergePatch, t as applyMergePatch } from "./merge-patch-BukSB2Pq.js";
import { u as withPluginRuntimeRegistryScope } from "./gateway-request-scope-B19X7f09.js";
import { n as enablePluginInConfig, r as enablePluginWithCapabilityConsent } from "./enable-Cs_eB1UN.js";
import { a as loadPersistedAuthProfileStore } from "./persisted-Bjx2XcL3.js";
import { n as resolvePluginProvidersCore } from "./providers.runtime-FOWiRwM8.js";
import { t as readCodexCliActiveApiKey } from "./cli-credentials-DZ9rGNcm.js";
import { b as updateAuthProfileStoreWithLock, d as loadAuthProfileStoreForRuntime } from "./store-C6iqqcJy.js";
import "./sessions-BLpYW515.js";
import { t as SessionManager } from "./session-manager-CBD-q5pC.js";
import { n as PreparedModelRuntimePublicationSupersededError } from "./prepared-model-runtime.errors-DeG6Ut3_.js";
import { t as loadAgentRuntimePluginRegistryHandle } from "./runtime-plugins-B0uJCbKb.js";
import { p as normalizeAuthProfileCredential } from "./profiles-FGrQtdwI.js";
import "./model-selection-Cp8EGD61.js";
import { a as GEMINI_CLI_DEFAULT_MODEL_REF, i as CODEX_APP_SERVER_DEFAULT_MODEL_REF, n as ANTHROPIC_API_DEFAULT_MODEL_REF, o as OPENAI_API_DEFAULT_MODEL_REF, r as CLAUDE_CLI_DEFAULT_MODEL_REF } from "./setup-inference-brand-DkVeLzTp.js";
import { C as redactSetupInferenceError, D as waitForProviderAuth, E as throwIfSetupInferenceCancelled, S as parseProviderAutoSetupChoiceId, T as setupInferenceLog, _ as SetupInferenceActivationIndeterminateError, a as extractRunWinnerError, b as SetupInferenceOwnerDriftError, c as prepareManualAuthForActivation, d as resolveSetupAgentRuntimeId, f as resolveStrictSetupAuthProfileError, i as configureCodexCliPreparedAuth, l as projectManualInferenceConfig, m as AUTO_LOCAL_MODEL_LEAN_ANNOUNCEMENT, o as mapFailoverReasonToSetupStatus, p as resolveToolFreeCliSetupError, r as canonicalizeSetupModelRef, s as parseRef, u as projectSetupTargetModelMetadata, v as SetupInferenceActivationUnavailableError, w as resolveSetupInferenceWorkspace, x as invalidSetupConfigError, y as SetupInferenceCancelledError } from "./setup-inference-detect-DSK04L4c.js";
import { t as withPluginLifecycleLease } from "./plugin-lifecycle-lease-QVxAzcU7.js";
import { n as resolveManifestProviderAuthChoice } from "./provider-auth-choices-DZw3W3ra.js";
import { a as supportsSetupTextInference, i as supportsSetupManualSecret } from "./setup-inference-auth-options-DDoD9isn.js";
import { a as describeFailoverError } from "./failover-error-DVBvcQuA.js";
import { o as prepareSystemAgentRunAdmission } from "./admitted-run-context-KQIZywud.js";
import { i as appendSystemAgentAuditEntry } from "./audit-BSOqBbQY.js";
import { t as CliExecutionAuthProfileError } from "./cli-execution-auth-B3Qx8vBT.js";
import { i as sameDefaultInferenceRoute, n as projectInferenceRoute, r as resolveSystemAgentConfiguredRouteFromConfig } from "./inference-route-B_O-SIuc.js";
import { a as resolveSystemAgentVerifiedInferenceRoute, n as createSystemAgentVerifiedInferenceBinding, r as hasCurrentSystemAgentOwnerPluginArtifacts, t as captureSystemAgentOwnerPluginArtifacts } from "./verified-inference-BWEX8g0I.js";
import { t as applyAutoLocalModelLean } from "./local-model-lean-auto-BPUF8q0b.js";
import { t as createPluginCapabilityConsentPrompter } from "./plugin-capability-consent-C2sZ7kh_.js";
import { n as WizardCancelledError, r as WizardNavigationError } from "./prompts-DLsO8MlU.js";
import { n as createQuickstartNotePrompter } from "./setup-apply-B17Ni1jg.js";
import { n as createSystemAgentModelSelectionUpdater, t as applySystemAgentModelSelection } from "./setup-model-selection-BuLlOjek.js";
import { n as extractAgentRunTerminalError, r as extractAgentRunText } from "./agent-run-result-DFovjOVm.js";
import { a as runProviderPluginAuthMethodUnpersisted, n as applyProviderPluginAuthMethodResultConfig } from "./provider-auth-choice-DLsmyMYu.js";
import os from "node:os";
import path from "node:path";
import fs from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { isDeepStrictEqual } from "node:util";
//#region src/system-agent/setup-inference-probe.ts
const SETUP_INFERENCE_TEST_MAX_TOKENS = 256;
/** Plugin and auto-selected harnesses may not support OpenClaw's request-scoped token cap. */
function resolveSetupInferenceProbeStreamParams(agentHarnessId) {
	return !agentHarnessId || agentHarnessId === "openclaw" ? { streamParams: { maxTokens: SETUP_INFERENCE_TEST_MAX_TOKENS } } : {};
}
//#endregion
//#region src/system-agent/setup-inference-persist.ts
async function cleanupSetupInferenceTempDir(params) {
	try {
		(params.deps.disposeOpenClawAgentDatabaseByPath ?? (await import("./openclaw-agent-db-Cmprgm7a.js")).disposeOpenClawAgentDatabaseByPath)(path.join(params.tempDir, "agent", "openclaw-agent.sqlite"));
	} catch {
		setupInferenceLog.warn("Could not dispose the temporary inference auth database.");
	}
	try {
		await (params.deps.removeTempDir ?? ((dir) => fs.rm(dir, {
			recursive: true,
			force: true
		})))(params.tempDir);
	} catch (error) {
		params.runtime?.error?.(`Could not remove temporary AI setup files: ${formatErrorMessage(error)}`);
		setupInferenceLog.warn("Could not remove the temporary inference test directory.");
	}
}
async function isCodexInstallRecordPersisted(record, deps) {
	try {
		const currentInstallRecords = await (deps.readPersistedInstalledPluginIndexInstallRecords ?? (await import("./installed-plugin-index-records-XoanF0fH.js")).readPersistedInstalledPluginIndexInstallRecords)();
		return currentInstallRecords !== null && isDeepStrictEqual(currentInstallRecords.codex, record);
	} catch {
		return false;
	}
}
async function retainUnownedCodexInstall(params) {
	if (params.verifyOwnership && await isCodexInstallRecordPersisted(params.record, params.deps)) return true;
	if (params.record.source !== "npm" || !params.record.installPath?.trim()) return true;
	try {
		const marked = await (params.deps.markRetainedManagedNpmInstall ?? (await import("./managed-npm-retention-CV7VHPqJ.js")).markRetainedManagedNpmInstall)({
			packageDir: params.record.installPath,
			pluginId: "codex",
			reason: "openclaw-inference-activation-not-committed"
		});
		if (!marked) setupInferenceLog.warn("Could not retain the uncommitted Codex runtime package generation.");
		return marked;
	} catch {
		setupInferenceLog.warn("Could not retain the uncommitted Codex runtime package generation.");
		return false;
	} finally {
		await clearUnownedCodexInstallCaches(params.deps);
	}
}
async function clearUnownedCodexInstallCaches(deps) {
	try {
		(deps.clearLoadInstalledPluginIndexInstallRecordsCache ?? (await import("./installed-plugin-index-records-XoanF0fH.js")).clearLoadInstalledPluginIndexInstallRecordsCache)();
	} catch {
		setupInferenceLog.warn("Could not clear the plugin install-record cache after failed Codex activation.");
	}
	try {
		(deps.clearPluginMetadataLifecycleCaches ?? (await import("./plugin-metadata-lifecycle-Cue5qbrU.js")).clearPluginMetadataLifecycleCaches)();
	} catch {
		setupInferenceLog.warn("Could not clear plugin metadata caches after failed Codex activation.");
	}
	try {
		await (deps.invalidatePluginRuntimeDiscoveryAfterConfigMutation ?? (await import("./registry-refresh-CeizkNvg.js")).invalidatePluginRuntimeDiscoveryAfterConfigMutation)({ logger: setupInferenceLog });
	} catch {
		setupInferenceLog.warn("Could not clear plugin runtime discovery after failed Codex activation.");
	}
}
async function reloadCodexRegistryAfterActivation(params) {
	let snapshot;
	try {
		snapshot = await params.readSnapshot();
	} catch {
		setupInferenceLog.warn("Could not read config while reloading the plugin registry after Codex activation.");
		return null;
	}
	if (params.requireValidConfig && (!snapshot.exists || !snapshot.valid)) {
		setupInferenceLog.warn("Could not reload the plugin registry after Codex activation because the committed config is unavailable.");
		return null;
	}
	const runtimeConfig = snapshot.exists && snapshot.valid ? snapshot.runtimeConfig ?? snapshot.config : {};
	const sourceConfig = snapshot.exists && snapshot.valid ? snapshot.sourceConfig ?? snapshot.config : {};
	try {
		await (params.deps.refreshPluginRegistryAfterConfigMutation ?? (await import("./registry-refresh-CeizkNvg.js")).refreshPluginRegistryAfterConfigMutation)({
			config: sourceConfig,
			reason: "source-changed",
			workspaceDir: params.workspaceDir,
			logger: setupInferenceLog
		});
	} catch {
		setupInferenceLog.warn("Could not refresh persisted plugin registry metadata after Codex activation.");
	}
	try {
		(params.deps.ensurePluginRegistryLoaded ?? (await import("./runtime-registry-loader-0HFPUyZV.js")).ensurePluginRegistryLoaded)({
			scope: "all",
			config: runtimeConfig,
			activationSourceConfig: sourceConfig,
			workspaceDir: params.workspaceDir
		});
		return runtimeConfig;
	} catch {
		setupInferenceLog.warn("Could not reload the active plugin registry after Codex inference activation.");
		return null;
	}
}
function isMergePatchObject(value) {
	return isRecord(value);
}
function mergePatchConflicts(base, current, patch) {
	if (!isMergePatchObject(patch)) return !isDeepStrictEqual(base, current);
	const baseIsObject = isMergePatchObject(base);
	const currentIsObject = isMergePatchObject(current);
	if (baseIsObject !== currentIsObject) return true;
	if (!baseIsObject && !currentIsObject && !isDeepStrictEqual(base, current)) return true;
	const baseRecord = baseIsObject ? base : {};
	const currentRecord = currentIsObject ? current : {};
	return Object.entries(patch).some(([key, childPatch]) => mergePatchConflicts(baseRecord[key], currentRecord[key], childPatch));
}
function applyManualAuthConfig(config, manualAuth, configKind, enablePlugin = enablePluginInConfig) {
	let enabledConfig = config;
	if (manualAuth.pluginId) {
		const enableResult = enablePlugin(config, manualAuth.pluginId);
		if (!enableResult.enabled) throw new Error(`Provider plugin ${manualAuth.pluginId} is ${enableResult.reason}.`);
		enabledConfig = enableResult.config;
	}
	if (mergePatchConflicts(configKind === "runtime" ? manualAuth.runtimeConfigBase : manualAuth.sourceConfigBase, enabledConfig, manualAuth.configPatch)) throw new Error("Provider configuration changed during the live inference test, so the verified credential was not saved. Review the current provider settings and retry.");
	return applyMergePatch(enabledConfig, manualAuth.configPatch);
}
function modelSelectionReferencesProfile(value, profileIds) {
	if (typeof value === "string") {
		const profile = splitTrailingAuthProfile(value).profile;
		return profile !== void 0 && profileIds.has(profile);
	}
	if (!isMergePatchObject(value)) return false;
	if (modelSelectionReferencesProfile(value.primary, profileIds)) return true;
	return Array.isArray(value.fallbacks) && value.fallbacks.some((fallback) => modelSelectionReferencesProfile(fallback, profileIds));
}
function configReferencesManualAuthProfiles(config, receipt) {
	const profileIds = new Set(receipt.profiles.map((profile) => profile.profileId));
	if (Object.keys(config.auth?.profiles ?? {}).some((profileId) => profileIds.has(profileId))) return true;
	if (Object.values(config.auth?.order ?? {}).some((order) => order.some((profileId) => profileIds.has(profileId)))) return true;
	if (modelSelectionReferencesProfile(config.agents?.defaults?.model, profileIds)) return true;
	return listAgentEntries(config).some((agent) => modelSelectionReferencesProfile(agent.model, profileIds));
}
function readManualAuthProfiles(receipt, deps) {
	let store;
	try {
		store = (deps.loadPersistedAuthProfileStore ?? loadPersistedAuthProfileStore)(receipt.agentDir);
	} catch {
		return "unknown";
	}
	if (!store) return "unknown";
	if (receipt.profiles.every((profile) => isDeepStrictEqual(store.profiles[profile.profileId], profile.credential))) return "present";
	if (receipt.profiles.every((profile) => store.profiles[profile.profileId] === void 0)) return "absent";
	return "mismatch";
}
function manualAuthProfilesPersisted(receipt, deps) {
	return readManualAuthProfiles(receipt, deps) === "present";
}
async function persistManualAuthProfiles(params) {
	const profiles = params.profiles.map((profile) => ({
		profileId: profile.profileId,
		credential: normalizeAuthProfileCredential(profile.credential)
	}));
	const insertedProfileIds = /* @__PURE__ */ new Set();
	const receipt = {
		agentDir: params.agentDir,
		profiles,
		insertedProfileIds
	};
	let collision = false;
	const updated = await (params.deps.updateAuthProfileStoreWithLock ?? updateAuthProfileStoreWithLock)({
		agentDir: params.agentDir,
		saveOptions: {
			filterExternalAuthProfiles: false,
			syncExternalCli: false
		},
		updater: (store) => {
			let changed = false;
			for (const profile of profiles) {
				const existing = store.profiles[profile.profileId];
				if (existing && !isDeepStrictEqual(existing, profile.credential)) {
					collision = true;
					return false;
				}
				if (!existing) {
					store.profiles[profile.profileId] = profile.credential;
					insertedProfileIds.add(profile.profileId);
					changed = true;
				}
			}
			return changed;
		}
	});
	if (collision) return { status: "not-persisted" };
	const readback = readManualAuthProfiles(receipt, params.deps);
	if (updated !== null || readback === "present") return {
		status: "persisted",
		receipt
	};
	return readback === "absent" ? { status: "not-persisted" } : {
		status: "unknown",
		receipt
	};
}
async function rollbackManualAuthProfiles(receipt, deps) {
	if (receipt.insertedProfileIds.size === 0) return true;
	const update = deps.updateAuthProfileStoreWithLock ?? updateAuthProfileStoreWithLock;
	for (let attempt = 0; attempt < 3; attempt += 1) {
		let updated = null;
		try {
			updated = await update({
				agentDir: receipt.agentDir,
				saveOptions: {
					filterExternalAuthProfiles: false,
					syncExternalCli: false
				},
				updater: (store) => {
					let changed = false;
					for (const profile of receipt.profiles) {
						if (!receipt.insertedProfileIds.has(profile.profileId)) continue;
						if (isDeepStrictEqual(store.profiles[profile.profileId], profile.credential)) {
							delete store.profiles[profile.profileId];
							changed = true;
						}
					}
					return changed;
				}
			});
		} catch {}
		if (updated && receipt.profiles.every((profile) => !receipt.insertedProfileIds.has(profile.profileId) || updated.profiles[profile.profileId] === void 0)) return true;
		let persistedStore;
		try {
			persistedStore = (deps.loadPersistedAuthProfileStore ?? loadPersistedAuthProfileStore)(receipt.agentDir);
		} catch {
			persistedStore = null;
		}
		if (persistedStore && receipt.profiles.every((profile) => !receipt.insertedProfileIds.has(profile.profileId) || persistedStore.profiles[profile.profileId] === void 0)) return true;
	}
	return false;
}
async function runSetupInferenceTest(params) {
	const { plan, tempDir, deps, authProfileStateMode, requireExecutionOwner } = params;
	const runId = `probe-setup-inference-${randomUUID()}`;
	const sessionId = runId;
	const sessionFile = `in-memory:${sessionId}`;
	const sessionManager = SessionManager.inMemory(tempDir);
	const effectiveAgentId = plan.routeAgentId ?? plan.agentId ?? "openclaw";
	const sessionKey = `agent:${effectiveAgentId}:setup-inference:incognito-${runId}`;
	const timeoutMs = deps.timeoutMs ?? 9e4;
	const started = Date.now();
	const failed = (status, error) => {
		setupInferenceLog.warn("Inference setup probe failed.", {
			event: "setup_inference_probe_failed",
			provider: plan.provider,
			model: plan.model,
			runner: plan.runner,
			status,
			timeoutMs,
			durationMs: Date.now() - started
		});
		return {
			ok: false,
			status,
			error
		};
	};
	const preparedRunAdmission = prepareSystemAgentRunAdmission(plan.config, runId, effectiveAgentId, "system-agent.setup-inference");
	let successfulAuth;
	try {
		if (plan.runner === "cli") {
			const unsupportedError = resolveToolFreeCliSetupError(plan);
			if (unsupportedError) return failed("unavailable", unsupportedError);
		}
		const strictProfileError = resolveStrictSetupAuthProfileError({
			plan,
			workspaceDir: tempDir,
			deps
		});
		if (strictProfileError) return failed("auth", strictProfileError);
		let result;
		if (plan.runner === "cli") result = await (deps.runCliAgent ?? (await import("./cli-runner-B_eCZ6FD.js")).runCliAgent)({
			preparedRunAdmission,
			sessionId,
			sessionKey,
			sessionManager,
			agentId: effectiveAgentId,
			trigger: "manual",
			sessionFile,
			workspaceDir: tempDir,
			...plan.agentDir ? { agentDir: plan.agentDir } : {},
			config: plan.executionConfig ?? plan.config,
			prompt: params.prompt ?? "Reply with the single word OK. Do not use tools.",
			provider: plan.provider,
			model: plan.model,
			...plan.authProfileId ? { authProfileId: plan.authProfileId } : {},
			timeoutMs,
			runId,
			messageChannel: "openclaw",
			messageProvider: "openclaw",
			executionMode: "side-question",
			disableTools: true,
			cleanupCliLiveSessionOnRunEnd: true,
			onSuccessfulAuthBinding: (binding) => {
				successfulAuth = binding;
			},
			...params.signal ? { abortSignal: params.signal } : {}
		});
		else result = await (deps.runEmbeddedAgent ?? (await import("./embedded-agent-fNRs635m.js")).runEmbeddedAgent)({
			preparedRunAdmission,
			sessionId,
			sessionKey,
			sessionManager,
			agentId: effectiveAgentId,
			trigger: "manual",
			sessionFile,
			workspaceDir: tempDir,
			...plan.agentDir ? { agentDir: plan.agentDir } : {},
			config: plan.executionConfig ?? plan.config,
			prompt: params.prompt ?? "Reply with the single word OK. Do not use tools.",
			provider: plan.provider,
			model: plan.model,
			...plan.authProfileId ? {
				authProfileId: plan.authProfileId,
				authProfileIdSource: "user"
			} : {},
			authProfileStateMode,
			preparedModelRuntimeMode: "isolated-read-only",
			...plan.cleanupBundleMcpOnRunEnd ? { cleanupBundleMcpOnRunEnd: true } : {},
			...plan.agentHarnessRuntimeOverride ? { agentHarnessRuntimeOverride: plan.agentHarnessRuntimeOverride } : {},
			timeoutMs,
			runId,
			lane: `session:probe-setup-inference:${plan.provider}`,
			thinkLevel: "off",
			reasoningLevel: "off",
			verboseLevel: "off",
			disableTrajectory: true,
			...params.prompt === void 0 ? resolveSetupInferenceProbeStreamParams(plan.agentHarnessRuntimeOverride) : {},
			disableTools: true,
			modelRun: true,
			messageChannel: "openclaw",
			messageProvider: "openclaw",
			onSuccessfulAuthBinding: (binding) => {
				successfulAuth = binding;
			},
			...params.signal ? { abortSignal: params.signal } : {}
		});
		if (params.signal?.aborted) throw new SetupInferenceCancelledError();
		const terminalError = extractAgentRunTerminalError(result);
		if (terminalError) {
			const described = describeFailoverError(new Error(terminalError));
			return failed(mapFailoverReasonToSetupStatus(described.reason), described.message);
		}
		const text = extractAgentRunText(result)?.trim();
		if (!text) return failed("format", "The model started but did not send a reply. Try again or pick another option.");
		const winnerError = await extractRunWinnerError(plan, result);
		if (winnerError) return failed("unknown", winnerError);
		if (requireExecutionOwner && !successfulAuth) return failed("unknown", "Inference succeeded, but its runtime did not report an owner that OpenClaw can safely reuse.");
		return {
			ok: true,
			latencyMs: Date.now() - started,
			text,
			auth: successfulAuth ?? (!requireExecutionOwner && plan.authProfileId ? { authProfileId: plan.authProfileId } : {})
		};
	} catch (error) {
		const described = describeFailoverError(error);
		return failed(mapFailoverReasonToSetupStatus(described.reason), described.message);
	} finally {
		preparedRunAdmission.close();
	}
}
//#endregion
//#region src/system-agent/setup-inference-activate-persist.ts
async function persistActivatedSetupInference(input) {
	const { params, deps, plan, testPlan, test, codexPluginPatch, pendingCodexInstall, cfg, sourceCfg, verifiedRoute, baselineRoute, stagedRoute, stagedOwnerPluginArtifacts, baselineTargetModelMetadata, sourceTargetModelMetadata, routeDeps, readSnapshot, hasPreparedAuthProfiles, state, revalidateOwner } = input;
	let committedConfig;
	let { codexInstallOwnership } = state;
	const requestedAgentId = params.agentId ? testPlan.routeAgentId : void 0;
	const projectRoute = (config) => projectInferenceRoute(config, requestedAgentId, routeDeps);
	const resolveRoute = (config) => resolveSystemAgentConfiguredRouteFromConfig(config, requestedAgentId, routeDeps);
	const { stripPendingPluginInstallRecords } = await import("./install-record-commit-Cj6iLNwc.js");
	const agentRuntimeId = resolveSetupAgentRuntimeId(params.kind);
	const selectModel = plan.persistModelRef ? await createSystemAgentModelSelectionUpdater({
		model: plan.persistModelRef,
		...params.agentId ? { targetAgentId: testPlan.routeAgentId } : {},
		...agentRuntimeId ? { agentRuntimeId } : {},
		...plan.manualAuth && plan.authProfileId ? { authProfileId: plan.authProfileId } : {}
	}) : void 0;
	const stageCandidate = (current, configKind) => {
		let next = codexPluginPatch === void 0 ? current : stripPendingPluginInstallRecords(current);
		if (plan.manualAuth) next = applyManualAuthConfig(next, plan.manualAuth, configKind, deps.enablePluginInConfig ?? enablePluginInConfig);
		if (codexPluginPatch !== void 0) {
			const enabledCodex = enablePluginInConfig(normalizePluginTargetConfig(applyMergePatch(next, codexPluginPatch), "codex"), "codex");
			if (!enabledCodex.enabled) throw new SetupInferenceActivationUnavailableError(`Could not enable the Codex runtime plugin: ${enabledCodex.reason ?? "plugin disabled"}.`);
			next = enabledCodex.config;
		}
		next = applyAutoLocalModelLean({
			config: next,
			providerId: testPlan.provider,
			modelRef: plan.modelRef
		}).config;
		next = selectModel ? selectModel(next) : next;
		if (!pendingCodexInstall) return next;
		return {
			...next,
			plugins: {
				...next.plugins,
				installs: { codex: pendingCodexInstall }
			}
		};
	};
	const persistedRoute = pendingCodexInstall ? await projectRoute(stripPendingPluginInstallRecords(stageCandidate(cfg, "runtime"))) : verifiedRoute;
	const expectedSourceCandidateRoute = await projectRoute(stageCandidate(sourceCfg, "source"));
	const transformConfig = deps.transformConfigWithPendingPluginInstalls ?? (await import("./install-record-commit-Cj6iLNwc.js")).transformConfigWithPendingPluginInstalls;
	let manualAuthReceipt;
	if (hasPreparedAuthProfiles && plan.manualAuth) {
		throwIfSetupInferenceCancelled(params);
		const initialCandidate = stageCandidate(cfg, "runtime");
		const initialRoute = await projectRoute(initialCandidate);
		const resolvedRoute = await resolveRoute(initialCandidate);
		if (!sameDefaultInferenceRoute(initialRoute, verifiedRoute) || !resolvedRoute || resolvedRoute.modelLabel !== plan.modelRef || resolvedRoute.authProfileId !== plan.authProfileId) throw new Error("The default-agent inference route changed during its live test, so the verified credential was not saved. Review the current model/auth/runtime settings and retry.");
		const persistedManualAuth = await persistManualAuthProfiles({
			profiles: plan.manualAuth.profiles,
			agentDir: resolvedRoute.agentDir,
			deps
		});
		if (persistedManualAuth.status === "unknown") {
			if (await rollbackManualAuthProfiles(persistedManualAuth.receipt, deps)) return {
				ok: false,
				status: "unknown",
				error: "Could not confirm the credential write, so it was rolled back. Try again in a moment."
			};
			throw new SetupInferenceActivationIndeterminateError("Inference activation could not confirm whether its verified credential was saved or rolled back. No config commit was attempted; run openclaw doctor --fix before retrying.");
		}
		if (persistedManualAuth.status === "not-persisted") return {
			ok: false,
			status: "unknown",
			error: "Could not save the verified credential; try again in a moment."
		};
		manualAuthReceipt = persistedManualAuth.receipt;
	}
	let commitMayHaveStarted = false;
	try {
		throwIfSetupInferenceCancelled(params);
		const committed = await transformConfig({
			base: "source",
			transform: async (current, context) => {
				const latestRuntime = context.snapshot.runtimeConfig ?? context.snapshot.config;
				const stagedRuntime = stageCandidate(latestRuntime, "runtime");
				if (!sameDefaultInferenceRoute(await projectRoute(latestRuntime), baselineRoute)) throw new Error("The default-agent inference route changed during its live test, so the verified candidate was not saved. Review the current model/auth/runtime settings and retry.");
				if (!isDeepStrictEqual(projectSetupTargetModelMetadata(latestRuntime, stagedRoute.modelLabel, requestedAgentId), baselineTargetModelMetadata)) throw new Error("The target model metadata changed during its live inference test, so the verified candidate was not saved. Review the current model settings and retry.");
				if (!sameDefaultInferenceRoute(await projectRoute(stagedRuntime), verifiedRoute)) throw new Error("The default-agent inference route changed during its live test, so the verified candidate was not saved. Review the current model/auth/runtime settings and retry.");
				const resolvedRoute = await resolveRoute(stagedRuntime);
				if (!resolvedRoute || resolvedRoute.modelLabel !== plan.modelRef || plan.authProfileId && resolvedRoute.authProfileId !== plan.authProfileId) throw new Error("The latest default-agent route no longer matches the verified candidate, so it was not saved. Review the current config and retry.");
				if (!isDeepStrictEqual(projectSetupTargetModelMetadata(current, stagedRoute.modelLabel, requestedAgentId), sourceTargetModelMetadata)) throw new Error("The authored target model metadata changed during its live inference test, so the verified candidate was not saved. Review the current model settings and retry.");
				const autoLocalModelLean = applyAutoLocalModelLean({
					config: current,
					providerId: testPlan.provider,
					modelRef: plan.modelRef
				});
				const nextConfig = stageCandidate(current, "source");
				const nextRouteProjection = await projectRoute(nextConfig);
				const nextResolvedRoute = await resolveRoute(nextConfig);
				if (!sameDefaultInferenceRoute(nextRouteProjection, expectedSourceCandidateRoute) || !nextResolvedRoute || nextResolvedRoute.modelLabel !== plan.modelRef || plan.authProfileId && nextResolvedRoute.authProfileId !== plan.authProfileId) throw new Error("The source config no longer matches the verified candidate, so it was not saved. Review the current config and retry.");
				await revalidateOwner({
					route: nextResolvedRoute,
					auth: test.auth,
					stagedOwnerPluginArtifacts,
					deps
				});
				throwIfSetupInferenceCancelled(params);
				params.onCommitStarted?.(current);
				commitMayHaveStarted = true;
				state.autoLocalModelLeanApplied = autoLocalModelLean.enabled;
				return { nextConfig };
			}
		});
		committedConfig = committed.nextConfig;
		state.gatewayRestartRequired = committed.followUp.requiresRestart;
		if (pendingCodexInstall) codexInstallOwnership = "owned";
	} catch (error) {
		if (!commitMayHaveStarted) {
			if (manualAuthReceipt) {
				if (!await rollbackManualAuthProfiles(manualAuthReceipt, deps)) throw new SetupInferenceActivationIndeterminateError("Inference activation stopped before its config commit, but could not confirm removal of its staged credential. Run openclaw doctor --fix before retrying.");
			}
			throw error;
		}
		const reconciledSnapshot = await readSnapshot().catch(() => null);
		const reconciledRuntime = reconciledSnapshot?.exists && reconciledSnapshot.valid ? reconciledSnapshot.runtimeConfig ?? reconciledSnapshot.config : void 0;
		const reconciledRoute = reconciledRuntime ? await projectRoute(reconciledRuntime) : void 0;
		const codexInstallPersisted = pendingCodexInstall ? await isCodexInstallRecordPersisted(pendingCodexInstall, deps) : true;
		const committedDespiteError = reconciledRoute !== void 0 && sameDefaultInferenceRoute(reconciledRoute, persistedRoute) && (!manualAuthReceipt || manualAuthProfilesPersisted(manualAuthReceipt, deps)) && codexInstallPersisted;
		if (pendingCodexInstall) codexInstallOwnership = committedDespiteError ? "owned" : "unowned";
		if (!committedDespiteError) {
			if (manualAuthReceipt) {
				if (!reconciledRuntime || configReferencesManualAuthProfiles(reconciledRuntime, manualAuthReceipt)) throw new SetupInferenceActivationIndeterminateError("Inference activation could not confirm its config commit state. The verified credential was retained because the current config may reference it. Run openclaw doctor --fix before retrying.");
				if (!await rollbackManualAuthProfiles(manualAuthReceipt, deps)) throw new SetupInferenceActivationIndeterminateError("Inference activation failed and its staged credential could not be rolled back. Run openclaw doctor --fix before retrying.");
			}
			throw error;
		}
		committedConfig = reconciledSnapshot?.sourceConfig ?? reconciledRuntime;
		state.gatewayRestartRequired = pendingCodexInstall !== void 0;
		setupInferenceLog.warn("Inference activation committed successfully despite a post-write cleanup error.");
	}
	state.committedConfig = committedConfig;
	state.codexInstallOwnership = codexInstallOwnership;
}
//#endregion
//#region src/system-agent/revalidate-inference-owner.ts
async function revalidateSetupInferenceOwner(params) {
	const configuredHarnessId = params.route.runner === "embedded" ? params.route.agentHarnessRuntimeOverride?.trim() : void 0;
	const successfulHarnessId = params.auth.agentHarnessId?.trim() || (configuredHarnessId && configuredHarnessId !== "auto" ? configuredHarnessId : void 0);
	let pluginRegistry;
	if (params.route.runner === "embedded" && successfulHarnessId && successfulHarnessId !== "openclaw") {
		const workspaceDir = resolveAgentWorkspaceDir(params.route.runConfig, params.route.agentId, process.env);
		pluginRegistry = loadAgentRuntimePluginRegistryHandle({
			config: params.route.runConfig,
			workspaceDir,
			selections: [{
				provider: params.route.provider,
				modelId: params.route.model,
				runtime: successfulHarnessId,
				agentId: params.route.agentId
			}]
		});
		if (!pluginRegistry) throw new Error(`Could not load the ${successfulHarnessId} runtime plugin.`);
	}
	const createBinding = params.deps.createSystemAgentVerifiedInferenceBinding ?? createSystemAgentVerifiedInferenceBinding;
	return await withPluginRuntimeRegistryScope(pluginRegistry, () => createBinding({
		configuredRoute: params.route,
		executionRoute: params.route,
		auth: params.auth,
		deps: params.deps
	}));
}
//#endregion
//#region src/system-agent/setup-inference-owner.ts
function hasSameOwnerPluginArtifacts(binding, snapshot) {
	return isDeepStrictEqual(binding.ownerPluginIds, snapshot.ownerPluginIds) && isDeepStrictEqual(binding.ownerPluginArtifacts, snapshot.ownerPluginArtifacts);
}
/**
* Revalidate the successful probe's owner against current config. Any drift
* throws SetupInferenceOwnerDriftError, which activation returns as an auth
* failure result — a throw that escapes here would crash the onboarding ladder.
*/
async function revalidateStableSetupInferenceOwner(params) {
	let binding;
	try {
		binding = await revalidateSetupInferenceOwner({
			route: params.route,
			auth: params.auth,
			deps: params.deps
		});
	} catch (error) {
		throw new SetupInferenceOwnerDriftError(`The verified inference owner changed before activation completed. Retry the inference check. (${formatErrorMessage(error)})`, { cause: error });
	}
	if (!params.stagedOwnerPluginArtifacts || !hasSameOwnerPluginArtifacts(binding, params.stagedOwnerPluginArtifacts)) throw new SetupInferenceOwnerDriftError("The verified inference owner changed before activation completed. Retry the inference check. (The owner plugin runtime changed during its live test.)");
	return binding;
}
//#endregion
//#region src/system-agent/setup-inference-plan-provider-auth.ts
async function runProviderManualSecretMethod(params) {
	const optionKey = params.choice.optionKey;
	const runNonInteractive = params.method.runNonInteractive;
	if (!optionKey || !params.choice.cliOption || !runNonInteractive) throw new Error("Provider does not expose app-guided secret setup.");
	let methodError = "";
	const isolatedRuntime = {
		log: () => {},
		error: (...args) => {
			methodError = args.map(String).join(" ");
		},
		exit: (code) => {
			throw new Error(methodError || `Provider setup exited with code ${code}.`);
		}
	};
	const existingPrimary = resolveAgentModelPrimaryValue(params.config.agents?.defaults?.model);
	const existingProvider = existingPrimary ? parseRef(existingPrimary).provider : void 0;
	let providerSetupConfig = params.config;
	if (existingProvider && normalizeProviderId(existingProvider) !== normalizeProviderId(params.choice.providerId)) {
		const agents = params.config.agents;
		const defaults = agents?.defaults;
		const model = defaults?.model;
		if (defaults && model !== void 0) {
			const { model: _model, ...defaultsWithoutModel } = defaults;
			let modelWithoutPrimary;
			if (typeof model === "object" && model !== null) {
				const { primary: _primary, ...remainingModelConfig } = model;
				modelWithoutPrimary = remainingModelConfig;
			}
			providerSetupConfig = {
				...params.config,
				agents: {
					...agents,
					defaults: modelWithoutPrimary && Object.keys(modelWithoutPrimary).length > 0 ? {
						...defaultsWithoutModel,
						model: modelWithoutPrimary
					} : defaultsWithoutModel
				}
			};
		}
	}
	const configured = await runNonInteractive({
		authChoice: params.choice.choiceId,
		config: providerSetupConfig,
		baseConfig: params.baseConfig,
		opts: {
			[optionKey]: params.apiKey,
			secretInputMode: "plaintext"
		},
		runtime: isolatedRuntime,
		agentDir: params.agentDir,
		workspaceDir: params.workspaceDir,
		resolveApiKey: async (input) => typeof input.flagValue === "string" && input.flagValue.trim() ? {
			key: input.flagValue.trim(),
			source: "flag"
		} : null,
		toApiKeyCredential: ({ provider, resolved, email, metadata }) => ({
			type: "api_key",
			provider,
			key: resolved.key,
			...email ? { email } : {},
			...metadata ? { metadata } : {}
		})
	});
	if (!configured) throw new Error(methodError || "Provider setup did not produce a configuration.");
	const store = loadPersistedAuthProfileStore(params.agentDir);
	const profiles = Object.entries(store?.profiles ?? {}).map(([profileId, credential]) => ({
		profileId,
		credential
	}));
	const previousModel = resolveAgentModelPrimaryValue(params.config.agents?.defaults?.model);
	const configuredModel = resolveAgentModelPrimaryValue(configured.agents?.defaults?.model);
	const configuredProvider = configuredModel ? parseRef(configuredModel).provider : void 0;
	const configuredModelOwnedByProvider = configuredProvider !== void 0 && normalizeProviderId(configuredProvider) === normalizeProviderId(params.choice.providerId);
	const defaultModel = configuredModel && (configuredModel !== previousModel || configuredModelOwnedByProvider) ? configuredModel : params.method.starterModel;
	if (profiles.length === 0 || !defaultModel) throw new Error("Provider setup did not produce credentials and a starter model.");
	return {
		result: {
			profiles,
			defaultModel
		},
		config: configured
	};
}
//#endregion
//#region src/system-agent/setup-inference-plan.ts
async function prepareSetupProviderAuthChoice(params, choice) {
	return await withPluginLifecycleLease({}, async () => {
		const enablePlugin = params.deps.enablePluginInConfig ?? enablePluginInConfig;
		const enableResult = await enablePluginWithCapabilityConsent(params.cfg, choice.pluginId, {
			workspaceDir: params.pluginWorkspaceDir,
			onCapabilityConsent: params.prompter ? createPluginCapabilityConsentPrompter(params.prompter, () => throwIfSetupInferenceCancelled(params)) : void 0
		});
		if (!enableResult.enabled) return { error: `${choice.choiceLabel} is disabled (${enableResult.reason ?? "blocked"}).` };
		const sourceEnableResult = enablePlugin(params.sourceCfg, choice.pluginId);
		if (!sourceEnableResult.enabled) return { error: `${choice.choiceLabel} is disabled (${sourceEnableResult.reason ?? "blocked"}).` };
		const provider = (params.deps.resolvePluginProviders ?? resolvePluginProvidersCore)({
			config: enableResult.config,
			workspaceDir: params.pluginWorkspaceDir,
			mode: "setup",
			includeUntrustedWorkspacePlugins: false,
			onlyPluginIds: [choice.pluginId]
		}).find((candidate) => candidate.pluginId === choice.pluginId && normalizeProviderId(candidate.id) === normalizeProviderId(choice.providerId));
		return {
			enableResult,
			sourceEnableResult,
			provider,
			method: provider?.auth.find((candidate) => candidate.id === choice.methodId)
		};
	});
}
async function buildTestPlan(params) {
	const { kind, cfg, workspaceDir } = params;
	const routeAgentId = resolveAmbientOwnerAgentId(cfg, params.routeAgentId);
	const resolveRouteModelRef = (defaultModelRef) => {
		const modelRef = params.modelRef?.trim() || defaultModelRef;
		const selected = parseRef(modelRef);
		const expected = parseRef(defaultModelRef);
		if (!selected.model || normalizeProviderId(selected.provider) !== normalizeProviderId(expected.provider)) return { error: `${modelRef} is not compatible with the ${kind} inference route.` };
		return modelRef;
	};
	const providerAutoChoiceId = parseProviderAutoSetupChoiceId(kind);
	if (providerAutoChoiceId) {
		const choice = (params.deps.resolveManifestProviderAuthChoice ?? resolveManifestProviderAuthChoice)(providerAutoChoiceId, {
			config: cfg,
			workspaceDir: params.pluginWorkspaceDir,
			includeUntrustedWorkspacePlugins: false,
			includeWorkspacePlugins: false
		});
		if (!choice || choice.appGuidedDiscovery !== true || !supportsSetupTextInference(choice.onboardingScopes)) return { error: "That detected provider is no longer available on this Gateway." };
		const providerChoice = await prepareSetupProviderAuthChoice(params, choice);
		if (providerChoice.error !== void 0) return { error: providerChoice.error };
		const { enableResult, sourceEnableResult, provider, method } = providerChoice;
		if (!provider || !method?.appGuidedSetup) return { error: "That detected provider is no longer available on this Gateway." };
		const modelRef = params.modelRef?.trim();
		if (!modelRef) return { error: "The detected provider model is missing. Run detection again." };
		try {
			const result = await method.appGuidedSetup.prepare({
				config: enableResult.config,
				env: process.env,
				workspaceDir: params.pluginWorkspaceDir,
				modelRef,
				...params.signal ? { signal: params.signal } : {}
			});
			const preparedModelRef = result?.defaultModel ? normalizeAgentModelRefForConfig(result.defaultModel) : "";
			if (!result || preparedModelRef !== modelRef) return { error: `${choice.choiceLabel} could not prepare the detected model. Run detection again.` };
			const ref = parseRef(modelRef);
			if (!ref.model || normalizeProviderId(ref.provider) !== normalizeProviderId(choice.providerId)) return { error: `${choice.choiceLabel} returned an invalid detected model.` };
			const preparedConfig = applyProviderPluginAuthMethodResultConfig({
				config: enableResult.config,
				result
			});
			const matchingProfile = result.profiles.find((profile) => normalizeProviderId(profile.credential.provider) === normalizeProviderId(ref.provider));
			if (result.profiles.length > 0 && !matchingProfile) return { error: `${choice.choiceLabel} did not return credentials for its detected model.` };
			const prepared = matchingProfile ? prepareManualAuthForActivation({
				baseConfig: enableResult.config,
				preparedConfig,
				profiles: result.profiles,
				selectedProfileId: matchingProfile.profileId,
				modelRef,
				providerId: ref.provider,
				pluginId: choice.pluginId,
				agentId: routeAgentId
			}) : {
				config: projectManualInferenceConfig({
					baseConfig: enableResult.config,
					preparedConfig,
					modelRef,
					providerId: ref.provider,
					pluginId: choice.pluginId,
					agentId: routeAgentId
				}),
				profiles: [],
				selectedProfileId: void 0
			};
			return {
				runner: "embedded",
				...ref,
				modelRef,
				agentDir: params.agentDir,
				config: prepared.config,
				agentId: "openclaw",
				routeAgentId,
				...prepared.selectedProfileId ? { authProfileId: prepared.selectedProfileId } : {},
				persistModelRef: modelRef,
				manualAuth: {
					profiles: prepared.profiles,
					runtimeConfigBase: enableResult.config,
					sourceConfigBase: sourceEnableResult.config,
					configPatch: createMergePatch(enableResult.config, prepared.config),
					pluginId: choice.pluginId
				}
			};
		} catch (error) {
			return { error: `${choice.choiceLabel} could not prepare app-guided setup: ${formatErrorMessage(error)}` };
		}
	}
	switch (kind) {
		case "existing-model": {
			let route;
			try {
				route = await resolveSystemAgentConfiguredRouteFromConfig(cfg, params.routeAgentId, { loadAuthProfileStoreForRuntime: params.deps.loadAuthProfileStoreForRuntime });
			} catch (error) {
				if (error instanceof CliExecutionAuthProfileError) return {
					error: error.message,
					status: "auth"
				};
				throw error;
			}
			if (!route) return { error: "No configured default-agent inference route is available." };
			const requestedModelRef = params.modelRef?.trim();
			const requestedTarget = requestedModelRef ? canonicalizeSetupModelRef({
				cfg,
				raw: requestedModelRef,
				defaultProvider: route.provider
			}) : void 0;
			if (requestedModelRef && requestedTarget !== route.modelLabel) return { error: `The configured default model changed from ${requestedModelRef} to ${route.modelLabel}. Try setup again.` };
			return {
				runner: route.runner,
				provider: route.provider,
				model: route.model,
				modelRef: route.modelLabel,
				config: cfg,
				executionConfig: route.runConfig,
				agentId: "openclaw",
				routeAgentId: route.agentId,
				agentDir: route.agentDir,
				...route.runner === "embedded" && route.agentHarnessRuntimeOverride ? { agentHarnessRuntimeOverride: route.agentHarnessRuntimeOverride } : {},
				...route.authProfileId ? { authProfileId: route.authProfileId } : {}
			};
		}
		case "claude-cli": {
			const modelRef = resolveRouteModelRef(CLAUDE_CLI_DEFAULT_MODEL_REF);
			if (typeof modelRef !== "string") return modelRef;
			return {
				runner: "cli",
				...parseRef(modelRef),
				modelRef,
				config: cfg,
				agentId: "openclaw",
				routeAgentId,
				persistModelRef: modelRef
			};
		}
		case "gemini-cli": {
			const modelRef = resolveRouteModelRef(GEMINI_CLI_DEFAULT_MODEL_REF);
			if (typeof modelRef !== "string") return modelRef;
			return {
				runner: "cli",
				...parseRef(modelRef),
				modelRef,
				config: cfg,
				agentId: "openclaw",
				routeAgentId,
				persistModelRef: modelRef
			};
		}
		case "codex-cli": {
			const modelRef = resolveRouteModelRef(CODEX_APP_SERVER_DEFAULT_MODEL_REF);
			if (typeof modelRef !== "string") return modelRef;
			const ref = parseRef(modelRef);
			if (params.codexCliApiKey) {
				const preparedAuth = prepareManualAuthForActivation({
					baseConfig: cfg,
					preparedConfig: cfg,
					profiles: [{
						profileId: "openai:codex-cli-api-key",
						credential: params.codexCliApiKey
					}],
					selectedProfileId: "openai:codex-cli-api-key",
					modelRef,
					providerId: ref.provider,
					agentId: routeAgentId
				});
				return {
					runner: "embedded",
					...ref,
					modelRef,
					agentHarnessRuntimeOverride: "codex",
					config: preparedAuth.config,
					agentId: "openclaw",
					routeAgentId,
					agentDir: params.agentDir,
					cleanupBundleMcpOnRunEnd: true,
					authProfileId: preparedAuth.selectedProfileId,
					persistModelRef: modelRef,
					manualAuth: {
						profiles: preparedAuth.profiles,
						runtimeConfigBase: cfg,
						sourceConfigBase: params.sourceCfg,
						configPatch: createMergePatch(cfg, preparedAuth.config)
					}
				};
			}
			return {
				runner: "embedded",
				...ref,
				modelRef,
				agentHarnessRuntimeOverride: "codex",
				config: cfg,
				agentId: "openclaw",
				routeAgentId,
				agentDir: params.agentDir,
				cleanupBundleMcpOnRunEnd: true,
				persistModelRef: modelRef
			};
		}
		case "openai-api-key": {
			const modelRef = resolveRouteModelRef(OPENAI_API_DEFAULT_MODEL_REF);
			if (typeof modelRef !== "string") return modelRef;
			return {
				runner: "embedded",
				...parseRef(modelRef),
				modelRef,
				config: cfg,
				agentId: "openclaw",
				routeAgentId,
				persistModelRef: modelRef
			};
		}
		case "anthropic-api-key": {
			const modelRef = resolveRouteModelRef(ANTHROPIC_API_DEFAULT_MODEL_REF);
			if (typeof modelRef !== "string") return modelRef;
			return {
				runner: "embedded",
				...parseRef(modelRef),
				modelRef,
				config: cfg,
				agentId: "openclaw",
				routeAgentId,
				persistModelRef: modelRef
			};
		}
		case "api-key":
		case "provider-auth": {
			const interactive = kind === "provider-auth";
			const apiKey = params.apiKey?.trim();
			if (!interactive && !apiKey) return { error: "Enter an API key or token first." };
			const authChoice = params.authChoice?.trim();
			const choice = authChoice ? (params.deps.resolveManifestProviderAuthChoice ?? resolveManifestProviderAuthChoice)(authChoice, {
				config: cfg,
				workspaceDir: params.pluginWorkspaceDir,
				includeUntrustedWorkspacePlugins: false,
				includeWorkspacePlugins: false
			}) : void 0;
			if (!choice || !supportsSetupTextInference(choice.onboardingScopes) || !interactive && !supportsSetupManualSecret(choice) || interactive && (choice.assistantVisibility === "manual-only" || !choice.appGuidedAuth && choice.appGuidedDiscovery !== true)) return { error: interactive ? "That provider setup is not available on this Gateway." : "That key-based provider is not available on this Gateway." };
			const providerChoice = await prepareSetupProviderAuthChoice(params, choice);
			if (providerChoice.error !== void 0) return { error: providerChoice.error };
			const { enableResult, sourceEnableResult, provider, method } = providerChoice;
			const resolved = provider && method ? {
				provider,
				method
			} : null;
			if (!resolved || !supportsSetupTextInference(resolved.method.wizard?.onboardingScopes) || interactive && choice.appGuidedDiscovery !== true && resolved.method.kind !== "oauth" && resolved.method.kind !== "device_code") return { error: interactive ? "That provider setup is not available on this Gateway." : "That key-based provider is not available on this Gateway." };
			let result;
			let preparedConfig;
			try {
				if (interactive) {
					if (!params.prompter) return { error: "This provider login requires an interactive setup session." };
					throwIfSetupInferenceCancelled(params);
					result = await waitForProviderAuth(runProviderPluginAuthMethodUnpersisted({
						config: enableResult.config,
						runtime: params.runtime,
						...params.signal ? { signal: params.signal } : {},
						isRemote: params.isRemoteProviderAuth,
						prompter: params.prompter,
						method: resolved.method,
						agentDir: params.agentDir,
						workspaceDir
					}), params.signal);
					throwIfSetupInferenceCancelled(params);
					preparedConfig = applyProviderPluginAuthMethodResultConfig({
						config: enableResult.config,
						result
					});
					if (choice.appGuidedDiscovery === true) {
						const guidedSetup = resolved.method.appGuidedSetup;
						if (!guidedSetup) return { error: "That provider setup is not available on this Gateway." };
						const selectedModelRef = result.defaultModel ? normalizeAgentModelRefForConfig(result.defaultModel) : "";
						const candidate = selectedModelRef ? { modelRef: selectedModelRef } : await guidedSetup.detect({
							config: preparedConfig,
							env: process.env,
							workspaceDir: params.pluginWorkspaceDir,
							...params.signal ? { signal: params.signal } : {}
						});
						if (!candidate) return { error: `${resolved.provider.label} setup completed, but no compatible model was found. Add a compatible model and try again.` };
						const prepared = await guidedSetup.prepare({
							config: preparedConfig,
							env: process.env,
							workspaceDir: params.pluginWorkspaceDir,
							modelRef: candidate.modelRef,
							...params.signal ? { signal: params.signal } : {}
						});
						const preparedModelRef = prepared?.defaultModel ? normalizeAgentModelRefForConfig(prepared.defaultModel) : "";
						if (!prepared || preparedModelRef !== candidate.modelRef) return { error: `${resolved.provider.label} could not prepare its detected model. Try setup again.` };
						preparedConfig = applyProviderPluginAuthMethodResultConfig({
							config: preparedConfig,
							result: prepared
						});
						const profiles = new Map([...result.profiles, ...prepared.profiles].map((profile) => [profile.profileId, profile]));
						result = {
							...prepared,
							profiles: [...profiles.values()]
						};
					}
				} else if (resolved.method.kind === "api_key" || resolved.method.kind === "token") {
					result = await runProviderPluginAuthMethodUnpersisted({
						config: enableResult.config,
						runtime: params.runtime,
						prompter: createQuickstartNotePrompter(params.runtime),
						method: resolved.method,
						agentDir: params.agentDir,
						workspaceDir,
						secretInputMode: "plaintext",
						allowSecretRefPrompt: false,
						opts: {
							token: apiKey,
							tokenProvider: resolved.provider.id
						}
					});
					preparedConfig = applyProviderPluginAuthMethodResultConfig({
						config: enableResult.config,
						result
					});
				} else {
					const prepared = await runProviderManualSecretMethod({
						config: enableResult.config,
						baseConfig: cfg,
						choice,
						method: resolved.method,
						apiKey,
						agentDir: params.agentDir,
						workspaceDir
					});
					result = prepared.result;
					preparedConfig = prepared.config;
				}
			} catch (error) {
				if (error instanceof SetupInferenceCancelledError || params.signal?.aborted) return { error: "Provider login was cancelled." };
				const detail = error instanceof Error ? error.message : String(error);
				return { error: `${resolved.provider.label} could not prepare this ${interactive ? "login" : "credential"} for app-guided setup: ${detail}` };
			}
			const modelRef = result.defaultModel ? normalizeAgentModelRefForConfig(result.defaultModel) : "";
			if (!modelRef) return { error: `${resolved.provider.label} does not expose a starter model for app-guided setup.` };
			const ref = parseRef(modelRef);
			if (!ref.model) return { error: `${resolved.provider.label} returned an invalid starter model.` };
			const matchingProfile = result.profiles.find((profile) => normalizeProviderId(profile.credential.provider) === normalizeProviderId(ref.provider));
			if (result.profiles.length > 0 && !matchingProfile) return { error: `${resolved.provider.label} did not return credentials for its starter model.` };
			const preparedAuth = matchingProfile ? prepareManualAuthForActivation({
				baseConfig: enableResult.config,
				preparedConfig,
				profiles: result.profiles,
				selectedProfileId: matchingProfile.profileId,
				modelRef,
				providerId: ref.provider,
				...resolved.provider.pluginId ? { pluginId: resolved.provider.pluginId } : {},
				agentId: routeAgentId
			}) : {
				config: projectManualInferenceConfig({
					baseConfig: enableResult.config,
					preparedConfig,
					modelRef,
					providerId: ref.provider,
					...resolved.provider.pluginId ? { pluginId: resolved.provider.pluginId } : {},
					agentId: routeAgentId
				}),
				profiles: [],
				selectedProfileId: void 0
			};
			return {
				runner: "embedded",
				...ref,
				modelRef,
				agentDir: params.agentDir,
				config: preparedAuth.config,
				agentId: "openclaw",
				routeAgentId,
				...preparedAuth.selectedProfileId ? { authProfileId: preparedAuth.selectedProfileId } : {},
				persistModelRef: modelRef,
				manualAuth: {
					profiles: preparedAuth.profiles,
					runtimeConfigBase: enableResult.config,
					sourceConfigBase: sourceEnableResult.config,
					configPatch: createMergePatch(enableResult.config, preparedAuth.config),
					...resolved.provider.pluginId ? { pluginId: resolved.provider.pluginId } : {}
				}
			};
		}
		default: return { error: `Unknown inference choice "${kind}".` };
	}
}
//#endregion
//#region src/system-agent/setup-inference-activate.ts
/**
* Test one candidate with a real completion, then persist it as the setup
* default. Manual credentials are tested from a temporary auth store and
* copied into the real agent store only after success. A managed Codex install
* record may remain after a failed probe because the installed package already exists.
*/
async function activateSetupInference(params) {
	const codexCliApiKey = params.kind === "codex-cli" ? (params.deps?.readCodexCliActiveApiKey ?? readCodexCliActiveApiKey)({ allowKeychainPrompt: true }) : null;
	try {
		const result = await activateSetupInferenceUnredacted(params, codexCliApiKey ?? void 0);
		if (result.ok) return {
			...result,
			lines: await Promise.all(result.lines.map((line) => redactSetupInferenceError(line, params.apiKey, codexCliApiKey?.key)))
		};
		return {
			...result,
			error: await redactSetupInferenceError(result.error, params.apiKey, codexCliApiKey?.key)
		};
	} catch (error) {
		const redacted = await redactSetupInferenceError(error instanceof Error ? error.message : String(error), params.apiKey, codexCliApiKey?.key);
		if (error instanceof WizardCancelledError) throw new WizardCancelledError(redacted);
		if (error instanceof WizardNavigationError) throw new WizardNavigationError(error.direction);
		if (error instanceof SetupInferenceCancelledError || params.signal?.aborted) return {
			ok: false,
			status: "unavailable",
			error: "Provider login was cancelled."
		};
		if (error instanceof SetupInferenceActivationUnavailableError) return {
			ok: false,
			status: "unavailable",
			error: redacted
		};
		if (error instanceof SetupInferenceOwnerDriftError) return {
			ok: false,
			status: "auth",
			error: redacted
		};
		if (error instanceof SetupInferenceActivationIndeterminateError) throw new SetupInferenceActivationIndeterminateError(redacted);
		throw new Error(redacted);
	}
}
async function activateSetupInferenceUnredacted(params, codexCliApiKey) {
	const deps = params.deps ?? {};
	const readSnapshot = deps.readConfigFileSnapshot ?? (await import("./config/config.js")).readConfigFileSnapshot;
	const snapshot = await readSnapshot();
	if (snapshot.exists && !snapshot.valid) throw new Error(invalidSetupConfigError(snapshot));
	const cfg = snapshot.runtimeConfig ?? snapshot.config;
	const sourceCfg = snapshot.sourceConfig ?? snapshot.config;
	const routeAgentId = resolveAmbientOwnerAgentId(cfg, params.agentId);
	const workspace = params.workspace?.trim() ? resolveUserPath(params.workspace) : (await resolveSetupInferenceWorkspace({
		configExists: snapshot.exists,
		configValid: snapshot.valid
	})).workspace;
	const tempDir = await (deps.createTempDir ?? (() => fs.mkdtemp(path.join(os.tmpdir(), "openclaw-setup-inference-"))))();
	const testAgentDir = path.join(tempDir, "agent");
	let pendingCodexInstall;
	let codexInstallOwnership = "unknown";
	let codexRegistryNeedsReload = false;
	let codexRegistryReloaded = false;
	let codexReloadedRuntimeConfig;
	let codexProbePluginRegistry;
	try {
		const plan = await buildTestPlan({
			kind: params.kind,
			...params.modelRef !== void 0 ? { modelRef: params.modelRef } : {},
			...params.authChoice !== void 0 ? { authChoice: params.authChoice } : {},
			...params.apiKey !== void 0 ? { apiKey: params.apiKey } : {},
			cfg,
			sourceCfg,
			workspaceDir: tempDir,
			pluginWorkspaceDir: workspace,
			agentDir: testAgentDir,
			runtime: params.runtime,
			...params.prompter ? { prompter: params.prompter } : {},
			...params.signal ? { signal: params.signal } : {},
			...params.isCancelled ? { isCancelled: params.isCancelled } : {},
			...params.kind === "provider-auth" ? { isRemoteProviderAuth: params.surface === "gateway" } : {},
			...codexCliApiKey ? { codexCliApiKey } : {},
			deps,
			routeAgentId
		});
		if ("error" in plan) return {
			ok: false,
			status: plan.status ?? "unavailable",
			error: plan.error
		};
		const hasPreparedAuthProfiles = (plan.manualAuth?.profiles.length ?? 0) > 0;
		let testPlan = plan;
		if (plan.persistModelRef) {
			const agentRuntimeId = resolveSetupAgentRuntimeId(params.kind);
			const stagedConfig = await applySystemAgentModelSelection({
				config: plan.config,
				model: plan.persistModelRef,
				...params.agentId ? { targetAgentId: testPlan.routeAgentId } : {},
				...agentRuntimeId ? { agentRuntimeId } : {},
				...plan.manualAuth && plan.authProfileId ? { authProfileId: plan.authProfileId } : {}
			});
			testPlan = {
				...plan,
				config: stagedConfig,
				routeAgentId: resolveAmbientOwnerAgentId(stagedConfig, params.agentId)
			};
		}
		let codexPluginPatch;
		if (params.kind === "codex-cli") {
			const preparationFailure = await withPluginLifecycleLease({ signal: params.signal }, async () => {
				const { stripPendingPluginInstallRecords } = await import("./install-record-commit-Cj6iLNwc.js");
				const codexInstallBase = stripPendingPluginInstallRecords(testPlan.config);
				const enabledCodexBase = await enablePluginWithCapabilityConsent(normalizePluginTargetConfig(codexInstallBase, "codex"), "codex", {
					workspaceDir: workspace,
					onCapabilityConsent: params.prompter ? createPluginCapabilityConsentPrompter(params.prompter, () => throwIfSetupInferenceCancelled(params)) : void 0
				});
				if (!enabledCodexBase.enabled) return {
					ok: false,
					status: "unavailable",
					error: `Could not enable the Codex runtime plugin: ${enabledCodexBase.reason ?? "plugin disabled"}.`
				};
				const ensured = await (deps.ensureCodexRuntimePlugin ?? (await import("./codex-runtime-plugin-install-CQ2fPeNx.js")).ensureCodexRuntimePluginForModelSelection)({
					cfg: enabledCodexBase.config,
					model: plan.modelRef,
					agentId: testPlan.routeAgentId,
					prompter: params.prompter ?? createQuickstartNotePrompter(params.runtime),
					runtime: params.runtime,
					workspaceDir: tempDir,
					beforePersistentEffect: () => throwIfSetupInferenceCancelled(params)
				});
				if (!ensured.ok) return {
					ok: false,
					status: ensured.status === "timed_out" ? "timeout" : "unavailable",
					error: ensured.message
				};
				codexRegistryNeedsReload = true;
				pendingCodexInstall = ensured.cfg.plugins?.installs?.codex;
				if (pendingCodexInstall) {
					if (!await retainUnownedCodexInstall({
						record: pendingCodexInstall,
						verifyOwnership: false,
						deps
					})) return {
						ok: false,
						status: "unavailable",
						error: "Could not retain the staged Codex runtime safely. No inference route was changed; retry after checking the plugin storage directory."
					};
				}
				const preparedAuth = configureCodexCliPreparedAuth(normalizePluginTargetConfig(ensured.cfg, "codex"), codexCliApiKey ? "agent" : "user");
				if (!preparedAuth.ok) return {
					ok: false,
					status: "unavailable",
					error: preparedAuth.error
				};
				const enabledCodex = enablePluginInConfig(preparedAuth.value, "codex");
				if (!enabledCodex.enabled) return {
					ok: false,
					status: "unavailable",
					error: `Could not enable the Codex runtime plugin: ${enabledCodex.reason ?? "plugin disabled"}.`
				};
				const stagedCodexConfig = enabledCodex.config;
				codexPluginPatch = createMergePatch(codexInstallBase, stripPendingPluginInstallRecords(stagedCodexConfig));
				testPlan = {
					...testPlan,
					config: stagedCodexConfig
				};
				const refreshPluginRegistry = deps.refreshPluginRegistryAfterConfigMutation ?? (await import("./registry-refresh-CeizkNvg.js")).refreshPluginRegistryAfterConfigMutation;
				let registryRefreshWarning;
				await refreshPluginRegistry({
					config: testPlan.config,
					reason: "source-changed",
					...testPlan.config.plugins?.installs ? { installRecords: testPlan.config.plugins.installs } : {},
					workspaceDir: workspace,
					policyPluginIds: ["codex"],
					traceCommand: "openclaw-setup-probe",
					logger: { warn: (message) => registryRefreshWarning = message }
				});
				try {
					codexProbePluginRegistry = loadAgentRuntimePluginRegistryHandle({
						config: testPlan.config,
						workspaceDir: tempDir,
						selections: [{
							provider: testPlan.provider,
							modelId: testPlan.model,
							runtime: "codex",
							agentId: testPlan.routeAgentId
						}]
					});
					if (!codexProbePluginRegistry) throw new Error("The Codex runtime plugin registry is unavailable.");
				} catch (error) {
					const loadError = `Could not load the Codex runtime plugin: ${formatErrorMessage(error)}`;
					return {
						ok: false,
						status: "unavailable",
						error: registryRefreshWarning ? `${registryRefreshWarning} ${loadError}` : loadError
					};
				}
			});
			if (preparationFailure) return preparationFailure;
		}
		const metadataWorkspaceDir = getActivePluginRegistryWorkspaceDirFromState();
		const routeDeps = { pluginMetadataPlugins: (deps.resolvePluginMetadataSnapshot ?? resolvePluginMetadataSnapshot)({
			config: testPlan.config,
			env: process.env,
			...metadataWorkspaceDir ? { workspaceDir: metadataWorkspaceDir } : {},
			...codexRegistryNeedsReload ? { allowCurrent: false } : {}
		}).plugins };
		const requestedAgentId = params.agentId ? testPlan.routeAgentId : void 0;
		const baselineRoute = await projectInferenceRoute(cfg, requestedAgentId, routeDeps);
		const verifiedRoute = await projectInferenceRoute(testPlan.config, requestedAgentId, routeDeps);
		const stagedRoute = verifiedRoute.route;
		const stagedExecutionRoute = await resolveSystemAgentConfiguredRouteFromConfig(testPlan.config, requestedAgentId, routeDeps);
		if (!stagedRoute || !stagedExecutionRoute || stagedRoute.runner !== testPlan.runner || stagedRoute.provider !== testPlan.provider || stagedRoute.model !== testPlan.model || stagedRoute.modelLabel !== plan.modelRef || plan.authProfileId && stagedRoute.authProfileId !== plan.authProfileId) return {
			ok: false,
			status: "unavailable",
			error: "The staged default-agent route does not match the requested inference candidate. Review model runtime policy and retry."
		};
		const baselineTargetModelMetadata = projectSetupTargetModelMetadata(cfg, stagedRoute.modelLabel, requestedAgentId);
		const sourceTargetModelMetadata = projectSetupTargetModelMetadata(sourceCfg, stagedRoute.modelLabel, requestedAgentId);
		testPlan = {
			...testPlan,
			executionConfig: stagedExecutionRoute.runConfig,
			agentDir: hasPreparedAuthProfiles ? testAgentDir : stagedRoute.agentDir,
			...testPlan.runner === "embedded" && stagedRoute.runner === "embedded" && stagedRoute.agentHarnessRuntimeOverride ? { agentHarnessRuntimeOverride: stagedRoute.agentHarnessRuntimeOverride } : {}
		};
		if (hasPreparedAuthProfiles && plan.manualAuth) {
			if ((await persistManualAuthProfiles({
				profiles: plan.manualAuth.profiles,
				agentDir: testAgentDir,
				deps
			})).status !== "persisted") return {
				ok: false,
				status: "unknown",
				error: "Could not stage the credential for its live inference test; try again in a moment."
			};
		}
		let stagedOwnerPluginArtifacts;
		try {
			stagedOwnerPluginArtifacts = withPluginRuntimeRegistryScope(codexProbePluginRegistry, () => (deps.captureSystemAgentOwnerPluginArtifacts ?? captureSystemAgentOwnerPluginArtifacts)({
				config: stagedExecutionRoute.runConfig,
				executionRoute: stagedExecutionRoute,
				deps
			}));
		} catch {
			return {
				ok: false,
				status: "unavailable",
				error: "Could not bind the staged inference plugin runtime. Refresh or reinstall the plugin and retry."
			};
		}
		if (params.signal?.aborted || params.isCancelled?.()) return {
			ok: false,
			status: "unavailable",
			error: "Provider login was cancelled."
		};
		let test;
		try {
			test = await withPluginRuntimeRegistryScope(codexProbePluginRegistry, () => runSetupInferenceTest({
				plan: testPlan,
				tempDir,
				deps,
				authProfileStateMode: "read-only",
				requireExecutionOwner: true,
				...params.signal ? { signal: params.signal } : {}
			}));
			throwIfSetupInferenceCancelled(params);
		} catch (error) {
			if (error instanceof SetupInferenceCancelledError || params.signal?.aborted) return {
				ok: false,
				status: "unavailable",
				error: "Provider login was cancelled."
			};
			throw error;
		}
		if (!test.ok) return test;
		if (plan.authProfileId && test.auth.authProfileId !== plan.authProfileId) return {
			ok: false,
			status: "auth",
			error: `The inference run used profile "${test.auth.authProfileId ?? "unknown"}" instead of the configured profile "${plan.authProfileId}". No model or credential route was saved.`
		};
		const autoLocalModelLeanUpdate = applyAutoLocalModelLean({
			config: sourceCfg,
			providerId: testPlan.provider,
			modelRef: plan.modelRef
		});
		const needsPersistence = plan.persistModelRef !== void 0 || plan.manualAuth !== void 0 || codexPluginPatch !== void 0 || pendingCodexInstall !== void 0 || autoLocalModelLeanUpdate.changed;
		if (!test.auth.authFingerprint && (!test.auth.runtimeOwnerFingerprint || !test.auth.runtimeOwnerKind || !test.auth.runtimeOwnerId?.trim())) return {
			ok: false,
			status: "unknown",
			error: "Inference succeeded, but its runtime did not report an owner that OpenClaw can safely reuse. No model or credential route was saved."
		};
		if (testPlan.runner === "cli" && (!test.auth.runtimeArtifactFingerprint || !test.auth.runtimeArtifactId?.trim())) return {
			ok: false,
			status: "unknown",
			error: "Inference succeeded, but its CLI executable/package artifact could not be safely reused. No model or credential route was saved."
		};
		if (testPlan.runner === "embedded") {
			const successfulHarnessId = test.auth.agentHarnessId?.trim();
			const configuredHarnessId = testPlan.agentHarnessRuntimeOverride?.trim();
			if (!successfulHarnessId || configuredHarnessId !== void 0 && configuredHarnessId !== "auto" && successfulHarnessId !== configuredHarnessId) return {
				ok: false,
				status: "unknown",
				error: "Inference succeeded, but its exact agent harness could not be safely reused. No model or credential route was saved."
			};
			if (successfulHarnessId !== "openclaw" && (test.auth.runtimeOwnerKind !== "plugin-harness" || test.auth.runtimeOwnerId?.trim() !== successfulHarnessId || !test.auth.runtimeArtifactFingerprint || !test.auth.runtimeArtifactId?.trim())) return {
				ok: false,
				status: "unknown",
				error: "Inference succeeded, but its agent harness artifact could not be safely reused. No model or credential route was saved."
			};
		}
		let committedConfig;
		let autoLocalModelLeanApplied = false;
		let gatewayRestartRequired = false;
		if (!needsPersistence) {
			const latestSnapshot = await readSnapshot();
			const latestRuntime = latestSnapshot.exists && latestSnapshot.valid ? latestSnapshot.runtimeConfig ?? latestSnapshot.config : void 0;
			const latestRoute = latestRuntime ? await projectInferenceRoute(latestRuntime, requestedAgentId, routeDeps) : void 0;
			if (!latestRoute || !sameDefaultInferenceRoute(latestRoute, verifiedRoute)) return {
				ok: false,
				status: "unknown",
				error: "The default-agent inference route changed during its live test. Review the current model/auth/runtime settings and retry."
			};
			const latestResolvedRoute = latestRuntime ? await resolveSystemAgentConfiguredRouteFromConfig(latestRuntime, requestedAgentId, routeDeps) : null;
			if (!latestResolvedRoute) return {
				ok: false,
				status: "unknown",
				error: "The default-agent inference route could not be resolved after its live test. Review the current model/auth/runtime settings and retry."
			};
			await revalidateStableSetupInferenceOwner({
				route: latestResolvedRoute,
				auth: test.auth,
				stagedOwnerPluginArtifacts,
				deps
			});
		}
		if (needsPersistence) {
			const persistenceState = {
				committedConfig,
				autoLocalModelLeanApplied,
				codexInstallOwnership,
				gatewayRestartRequired
			};
			const persistenceFailure = await persistActivatedSetupInference({
				params,
				deps,
				plan,
				testPlan,
				test,
				codexPluginPatch,
				pendingCodexInstall,
				cfg,
				sourceCfg,
				verifiedRoute,
				baselineRoute,
				stagedRoute,
				stagedOwnerPluginArtifacts,
				baselineTargetModelMetadata,
				sourceTargetModelMetadata,
				routeDeps,
				readSnapshot,
				hasPreparedAuthProfiles,
				state: persistenceState,
				revalidateOwner: revalidateStableSetupInferenceOwner
			});
			if (persistenceFailure) return persistenceFailure;
			({committedConfig, autoLocalModelLeanApplied, codexInstallOwnership, gatewayRestartRequired} = persistenceState);
		}
		if (codexRegistryNeedsReload && committedConfig) {
			const reloadedRuntimeConfig = await reloadCodexRegistryAfterActivation({
				readSnapshot,
				workspaceDir: workspace,
				deps,
				requireValidConfig: true
			});
			codexRegistryReloaded = reloadedRuntimeConfig !== null;
			codexReloadedRuntimeConfig = reloadedRuntimeConfig ?? void 0;
			if (!codexRegistryReloaded) throw new SetupInferenceActivationIndeterminateError("Inference activation committed, but the active plugin registry could not be reloaded. Restart the Gateway before using Codex inference.");
		}
		if (committedConfig && params.surface === "gateway" && params.kind === "codex-cli") try {
			if (!codexReloadedRuntimeConfig) throw new Error("committed runtime config is unavailable");
			await (deps.refreshPreparedModelRuntimeSnapshots ?? (await import("./prepared-model-runtime-CoQq9Qra.js")).refreshPreparedModelRuntimeSnapshots)(codexReloadedRuntimeConfig);
		} catch (error) {
			if (!(error instanceof PreparedModelRuntimePublicationSupersededError)) throw new SetupInferenceActivationIndeterminateError(`Inference activation committed, but the prepared model catalog could not be refreshed (${error instanceof Error ? error.message : String(error)}). Restart the Gateway before using the new inference route.`);
			setupInferenceLog.info("Prepared model catalog refresh superseded by a newer publication; activation proceeding.");
		}
		const announceAutoLocalModelLean = autoLocalModelLeanApplied && committedConfig?.agents?.defaults?.experimental?.localModelLean === true;
		let lines = [`Inference verified: ${plan.modelRef}`, ...announceAutoLocalModelLean ? [AUTO_LOCAL_MODEL_LEAN_ANNOUNCEMENT] : []];
		if (params.surface === "gateway" && params.recordSetupAudit !== false) {
			const after = await readSnapshot().catch(() => null);
			try {
				await appendSystemAgentAuditEntry({
					operation: "openclaw.setup",
					summary: "Verified and configured AI access through OpenClaw setup",
					configPath: after?.path ?? snapshot.path,
					configHashBefore: snapshot.hash ?? null,
					configHashAfter: after?.hash ?? null,
					details: {
						modelRef: plan.modelRef,
						inferenceKind: params.kind
					}
				});
			} catch (error) {
				const warning = `Inference setup completed, but OpenClaw could not record its audit entry: ${formatErrorMessage(error)}`;
				params.runtime.error?.(warning);
				lines = [...lines, warning];
			}
		}
		return {
			ok: true,
			modelRef: plan.modelRef,
			latencyMs: test.latencyMs,
			lines,
			...params.surface === "gateway" && gatewayRestartRequired ? { gatewayRestartRequired: true } : {}
		};
	} finally {
		let codexCleanupError;
		if (pendingCodexInstall && codexInstallOwnership !== "owned") {
			if (!await retainUnownedCodexInstall({
				record: pendingCodexInstall,
				verifyOwnership: false,
				deps
			})) codexCleanupError = new SetupInferenceActivationIndeterminateError("Inference activation stopped before its Codex runtime package could be retained safely. Restart the Gateway before retrying.");
		}
		if (codexRegistryNeedsReload && !codexRegistryReloaded) {
			codexRegistryReloaded = await reloadCodexRegistryAfterActivation({
				readSnapshot,
				workspaceDir: workspace,
				deps
			}) !== null;
			if (!codexRegistryReloaded) codexCleanupError = new SetupInferenceActivationIndeterminateError("Inference activation could not restore the active plugin registry after its Codex probe. Restart the Gateway before retrying.");
		}
		await cleanupSetupInferenceTempDir({
			tempDir,
			deps,
			runtime: params.runtime
		});
		if (codexCleanupError) throw codexCleanupError;
	}
}
//#endregion
//#region src/system-agent/setup-inference-verify.ts
async function verifySetupInference(params) {
	const readSnapshot = {
		...params.deps,
		...params.timeoutMs !== void 0 ? { timeoutMs: params.timeoutMs } : {}
	}.readConfigFileSnapshot ?? (await import("./config/config.js")).readConfigFileSnapshot;
	const snapshot = await readSnapshot();
	if (!snapshot.exists) return {
		ok: false,
		status: "unavailable",
		error: "No OpenClaw config exists. Run `openclaw onboard` first."
	};
	if (!snapshot.valid) return {
		ok: false,
		status: "format",
		error: invalidSetupConfigError(snapshot)
	};
	const cfg = snapshot.runtimeConfig ?? snapshot.config;
	const baselineRoute = await projectInferenceRoute(cfg, params.agentId);
	let verifiedBinding;
	const verification = await verifySetupInferenceConfig({
		config: cfg,
		runtime: params.runtime,
		requireExecutionOwner: params.bindSession === true,
		...params.agentId ? { agentId: params.agentId } : {},
		...params.timeoutMs !== void 0 ? { timeoutMs: params.timeoutMs } : {},
		...params.deps ? { deps: params.deps } : {},
		...params.bindSession ? { onVerifiedExecution: (_auth, binding) => {
			verifiedBinding = binding;
		} } : {}
	});
	if (!verification.ok) return verification;
	const latestSnapshot = await readSnapshot().catch(() => null);
	const latestConfig = latestSnapshot?.exists && latestSnapshot.valid ? latestSnapshot.runtimeConfig ?? latestSnapshot.config : void 0;
	const latestRoute = latestConfig ? await projectInferenceRoute(latestConfig, params.agentId) : void 0;
	if (!latestRoute || !sameDefaultInferenceRoute(baselineRoute, latestRoute)) return {
		ok: false,
		status: "unknown",
		error: "The inference route changed during its live test. Review current model/auth/runtime settings and retry."
	};
	if (!params.bindSession) return verification;
	if (!await resolveSystemAgentConfiguredRouteFromConfig(cfg, params.agentId) || !verifiedBinding) return {
		ok: false,
		status: "unknown",
		error: "The successful inference run did not report an exact execution binding. Retry setup before starting OpenClaw."
	};
	return {
		...verification,
		binding: verifiedBinding
	};
}
function executionRouteIdentity(route) {
	const { runConfig: _runConfig, ...identity } = route;
	return identity;
}
/**
* Strict credentials need only the static owner check. Opaque runtimes can
* prove liveness only by completing another exact turn at the side-effect
* boundary; the result must still be the original frozen route.
*/
async function resolvePersistentApplyInference(params) {
	const deps = params.deps ?? {};
	const resolveVerified = deps.resolveVerifiedInferenceRoute ?? resolveSystemAgentVerifiedInferenceRoute;
	const initialRoute = await resolveVerified(params.binding, deps);
	if (!initialRoute) return null;
	const hasCurrentOwnerPluginArtifacts = deps.hasCurrentOwnerPluginArtifacts ?? hasCurrentSystemAgentOwnerPluginArtifacts;
	if (!await hasCurrentOwnerPluginArtifacts(params.binding, deps)) return null;
	if (params.binding.auth.proofKind !== "runtime-owner") return initialRoute;
	const live = await (deps.verifyBoundInference ?? verifySetupInference)({
		runtime: params.runtime,
		bindSession: true,
		agentId: params.binding.execution.agentId,
		deps
	});
	if (!live.ok || !isDeepStrictEqual(live.binding.configuredRoute, params.binding.configuredRoute) || !isDeepStrictEqual(executionRouteIdentity(live.binding.execution), executionRouteIdentity(params.binding.execution)) || !isDeepStrictEqual(live.binding.executionFingerprint, params.binding.executionFingerprint) || !isDeepStrictEqual(live.binding.ownerPluginIds, params.binding.ownerPluginIds) || !isDeepStrictEqual(live.binding.ownerPluginArtifacts, params.binding.ownerPluginArtifacts) || !isDeepStrictEqual(live.binding.auth, params.binding.auth)) return null;
	const finalRoute = await resolveVerified(params.binding, deps);
	if (!finalRoute || !await hasCurrentOwnerPluginArtifacts(params.binding, deps)) return null;
	return finalRoute;
}
/** Live-test a staged default-agent route before any caller persists it. */
async function verifySetupInferenceConfig(params) {
	const deps = {
		...params.deps,
		...params.timeoutMs !== void 0 ? { timeoutMs: params.timeoutMs } : {}
	};
	const cfg = params.config;
	const routeAgentId = resolveAmbientOwnerAgentId(cfg, params.agentId);
	if (!resolveAgentEffectiveModelPrimary(cfg, routeAgentId)) return {
		ok: false,
		status: "unavailable",
		error: "No agent model is configured. Run `openclaw onboard` first."
	};
	const tempDir = await (deps.createTempDir ?? (() => fs.mkdtemp(path.join(os.tmpdir(), "openclaw-setup-inference-"))))();
	try {
		const builtPlan = await buildTestPlan({
			kind: "existing-model",
			cfg,
			sourceCfg: cfg,
			workspaceDir: tempDir,
			pluginWorkspaceDir: tempDir,
			agentDir: path.join(tempDir, "agent"),
			runtime: params.runtime,
			routeAgentId,
			deps
		});
		if ("error" in builtPlan) return {
			ok: false,
			status: builtPlan.status ?? "unavailable",
			error: builtPlan.error
		};
		let plan = params.agentDir ? {
			...builtPlan,
			agentDir: params.agentDir
		} : builtPlan;
		if (params.authProfiles && params.authProfiles.length > 0) {
			const selectedProfile = plan.authProfileId ? params.authProfiles.find((profile) => profile.profileId === plan.authProfileId) : params.authProfiles.find((profile) => normalizeProviderId(profile.credential.provider) === normalizeProviderId(plan.provider));
			if (!selectedProfile) return {
				ok: false,
				status: "auth",
				error: plan.authProfileId ? "The staged credential does not match the configured auth profile." : "The staged credential does not belong to the configured inference provider."
			};
			const stagedAgentDir = path.join(tempDir, "agent");
			if ((await persistManualAuthProfiles({
				profiles: params.authProfiles,
				agentDir: stagedAgentDir,
				deps
			})).status !== "persisted") return {
				ok: false,
				status: "unknown",
				error: "Could not stage the credential for its live inference test; try again in a moment."
			};
			plan = {
				...plan,
				agentDir: stagedAgentDir,
				authProfileId: selectedProfile.profileId
			};
		}
		const readStagedAuthProfiles = () => {
			if (!params.authProfiles || params.authProfiles.length === 0) return;
			const { profiles } = (deps.loadAuthProfileStoreForRuntime ?? loadAuthProfileStoreForRuntime)(plan.agentDir, {
				readOnly: true,
				allowKeychainPrompt: false,
				config: plan.config,
				externalCliProviderIds: [plan.provider]
			});
			return params.authProfiles.map((profile) => {
				const credential = profiles[profile.profileId];
				if (!credential) throw new Error("staged profile missing after verification");
				return {
					profileId: profile.profileId,
					credential
				};
			});
		};
		const retainStagedAuthProfiles = () => {
			try {
				return {
					ok: true,
					authProfiles: readStagedAuthProfiles()
				};
			} catch {
				return {
					ok: false,
					result: {
						ok: false,
						status: "unknown",
						error: "Could not retain the credential after its live inference test."
					}
				};
			}
		};
		const requiresExecutionOwner = params.requireExecutionOwner === true || params.onVerifiedExecution !== void 0;
		let configuredRoute;
		let stagedOwnerPluginArtifacts;
		if (requiresExecutionOwner) {
			configuredRoute = await resolveSystemAgentConfiguredRouteFromConfig(cfg, routeAgentId) ?? void 0;
			if (!configuredRoute) return {
				ok: false,
				status: "unknown",
				error: "The verified inference route could not be resolved for owner validation."
			};
			try {
				stagedOwnerPluginArtifacts = (deps.captureSystemAgentOwnerPluginArtifacts ?? captureSystemAgentOwnerPluginArtifacts)({
					config: cfg,
					executionRoute: configuredRoute,
					deps
				});
			} catch {
				return {
					ok: false,
					status: "unavailable",
					error: "Could not bind the configured inference plugin runtime. Refresh or reinstall the plugin and retry."
				};
			}
		}
		let test = await runSetupInferenceTest({
			plan,
			tempDir,
			deps,
			authProfileStateMode: "read-only",
			requireExecutionOwner: requiresExecutionOwner
		});
		let retained = retainStagedAuthProfiles();
		if (!retained.ok) return retained.result;
		let authProfiles = retained.authProfiles;
		if (test.ok) {
			const verifiedProfileId = test.auth.authProfileId;
			if (plan.authProfileId && verifiedProfileId !== plan.authProfileId) return {
				ok: false,
				status: "auth",
				error: `The inference run used profile "${verifiedProfileId ?? "unknown"}" instead of the configured profile "${plan.authProfileId}".`,
				...authProfiles ? { authProfiles } : {}
			};
			if (params.onVerifiedExecution && !plan.authProfileId && verifiedProfileId) {
				test = await runSetupInferenceTest({
					plan: {
						...plan,
						authProfileId: verifiedProfileId
					},
					tempDir,
					deps,
					authProfileStateMode: "read-only",
					requireExecutionOwner: true
				});
				retained = retainStagedAuthProfiles();
				if (!retained.ok) return retained.result;
				authProfiles = retained.authProfiles;
				if (!test.ok) return {
					...test,
					error: await redactSetupInferenceError(test.error),
					...authProfiles ? { authProfiles } : {}
				};
				if (test.auth.authProfileId !== verifiedProfileId) return {
					ok: false,
					status: "auth",
					error: "The selected inference credential changed during its locked verification.",
					...authProfiles ? { authProfiles } : {}
				};
			}
			if (params.requireExecutionOwner || params.onVerifiedExecution) try {
				const binding = await revalidateStableSetupInferenceOwner({
					route: configuredRoute,
					auth: test.auth,
					stagedOwnerPluginArtifacts,
					deps
				});
				params.onVerifiedExecution?.(test.auth, binding);
			} catch {
				return {
					ok: false,
					status: "auth",
					error: "The verified inference owner changed before validation completed. Retry the inference check.",
					...authProfiles ? { authProfiles } : {}
				};
			}
			return {
				ok: true,
				latencyMs: test.latencyMs,
				modelRef: plan.modelRef,
				...authProfiles ? { authProfiles } : {}
			};
		}
		return {
			...test,
			error: await redactSetupInferenceError(test.error),
			...authProfiles ? { authProfiles } : {}
		};
	} finally {
		await cleanupSetupInferenceTempDir({
			tempDir,
			deps,
			runtime: params.runtime
		});
	}
}
/** Run one tool-free completion through the configured setup inference route. */
async function completeSetupInference(params) {
	const snapshot = await (params.deps?.readConfigFileSnapshot ?? (await import("./config/config.js")).readConfigFileSnapshot)();
	if (!snapshot.exists) return {
		ok: false,
		status: "unavailable",
		error: "No OpenClaw config exists."
	};
	if (!snapshot.valid) return {
		ok: false,
		status: "format",
		error: invalidSetupConfigError(snapshot)
	};
	return await completeSetupInferenceConfig({
		config: snapshot.runtimeConfig ?? snapshot.config,
		prompt: params.prompt,
		...params.agentId ? { agentId: params.agentId } : {},
		runtime: params.runtime,
		...params.timeoutMs !== void 0 ? { timeoutMs: params.timeoutMs } : {},
		...params.deps ? { deps: params.deps } : {}
	});
}
/** Config-injected variant used by setup clients and live provider tests. */
async function completeSetupInferenceConfig(params) {
	const deps = {
		...params.deps,
		...params.timeoutMs !== void 0 ? { timeoutMs: params.timeoutMs } : {}
	};
	const routeAgentId = resolveAmbientOwnerAgentId(params.config, params.agentId);
	if (!resolveAgentEffectiveModelPrimary(params.config, routeAgentId)) return {
		ok: false,
		status: "unavailable",
		error: "No agent model is configured."
	};
	const tempDir = await (deps.createTempDir ?? (() => fs.mkdtemp(path.join(os.tmpdir(), "openclaw-setup-inference-"))))();
	try {
		const plan = await buildTestPlan({
			kind: "existing-model",
			cfg: params.config,
			sourceCfg: params.config,
			workspaceDir: tempDir,
			pluginWorkspaceDir: tempDir,
			agentDir: path.join(tempDir, "agent"),
			runtime: params.runtime,
			routeAgentId,
			deps
		});
		if ("error" in plan) return {
			ok: false,
			status: plan.status ?? "unavailable",
			error: plan.error
		};
		const result = await runSetupInferenceTest({
			plan,
			prompt: params.prompt,
			tempDir,
			deps,
			authProfileStateMode: "read-only",
			requireExecutionOwner: false
		});
		if (!result.ok) return {
			...result,
			error: await redactSetupInferenceError(result.error)
		};
		if (plan.authProfileId && result.auth.authProfileId !== plan.authProfileId) return {
			ok: false,
			status: "auth",
			error: "The inference completion used a different credential than the configured route."
		};
		return {
			ok: true,
			modelRef: plan.modelRef,
			latencyMs: result.latencyMs,
			text: result.text
		};
	} finally {
		await cleanupSetupInferenceTempDir({
			tempDir,
			deps,
			runtime: params.runtime
		});
	}
}
//#endregion
export { verifySetupInferenceConfig as a, verifySetupInference as i, completeSetupInferenceConfig as n, activateSetupInference as o, resolvePersistentApplyInference as r, completeSetupInference as t };
