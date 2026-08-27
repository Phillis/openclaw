import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { c as resolveUserPath } from "./home-dir-DcrXWQPU.js";
import { m as shortenHomePath } from "./utils-DEqefz4f.js";
import { _ as resolveGatewayPort } from "./paths-CqeDjSA4.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import "./agent-scope-BizOtGGz.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { _ as toAgentEntriesRecord, r as listAgentEntries } from "./agent-scope-config-BdXMWufB.js";
import { N as validateConfigObjectWithPlugins, f as readConfigFileSnapshotWithPluginMetadata, l as readConfigFileSnapshot, nt as resolveConfigSnapshotHash } from "./io-D1h6pxaD.js";
import { i as formatExternalSupervisorActionRequired } from "./gateway-supervision-Cr5lTl_D.js";
import { n as enablePluginInConfig } from "./enable-DlxSFwiq.js";
import { r as hasResolvedRosterBeforeMigrations } from "./agent-roster-provenance-DMVAWWCV.js";
import { t as applyMergePatch } from "./merge-patch-CQFyXoKe.js";
import "./config-CW-q_d35.js";
import { r as isReservedSystemAgentId } from "./agent-id-BYpRMvce.js";
import { i as sameDefaultInferenceRoute, t as projectDefaultInferenceRoute } from "./inference-route-BdB9LAmv.js";
import { i as resolveSystemAgentOnboardingTarget } from "./onboard-agent-target-RTxUCH5n.js";
import { isDeepStrictEqual } from "node:util";
//#region src/system-agent/setup-config-snapshot.ts
function requireValidSystemAgentSetupSnapshot(snapshot) {
	if (snapshot.exists && !snapshot.valid) {
		const issue = snapshot.issues?.[0];
		const detail = issue ? ` (${issue.path ? `${issue.path}: ` : ""}${issue.message})` : "";
		throw new Error(`OpenClaw config ${shortenHomePath(snapshot.path)} is invalid${detail}. Fix it before running setup.`);
	}
	const sourceConfig = snapshot.exists ? snapshot.sourceConfig ?? snapshot.config : {};
	const runtimeConfig = snapshot.exists ? snapshot.runtimeConfig ?? snapshot.config : {};
	const reservedAgent = listAgentEntries(runtimeConfig).find((entry) => isReservedSystemAgentId(entry.id));
	if (reservedAgent) throw new Error(`Agent id "${normalizeAgentId(reservedAgent.id)}" is reserved for the system agent. Rename that configured agent, then retry setup.`);
	return {
		sourceConfig,
		runtimeConfig
	};
}
//#endregion
//#region src/system-agent/setup-inference-route-guard.ts
function withoutAgentIdentity(projection) {
	const agent = isRecord(projection.agent) ? {
		...projection.agent,
		id: "<agent>",
		agentDir: "<agent-dir>"
	} : projection.agent;
	return {
		...projection,
		route: projection.route ? {
			...projection.route,
			agentId: "<agent>",
			agentDir: "<agent-dir>"
		} : null,
		defaultSelection: { explicitIds: [] },
		...agent ? { agent } : {}
	};
}
function sameSetupInferenceRoute(left, right, ignoreAgentIdentity) {
	return ignoreAgentIdentity ? isDeepStrictEqual(withoutAgentIdentity(left), withoutAgentIdentity(right)) : sameDefaultInferenceRoute(left, right);
}
function sameSetupConfiguredRoute(left, right, ignoreAgentIdentity) {
	if (!ignoreAgentIdentity) return isDeepStrictEqual(left, right);
	const normalize = (route) => route ? {
		...route,
		agentId: "<agent>",
		agentDir: "<agent-dir>"
	} : null;
	return isDeepStrictEqual(normalize(left), normalize(right));
}
function assertSetupTarget(params) {
	const agentId = params.resolveDefaultAgentId(params.config);
	if (params.expectedAgentId && agentId !== params.expectedAgentId) throw new Error("The default agent changed while AI access was being tested. Try setup again.");
	if (params.expectedAgentDir && params.resolveAgentDir(params.config, agentId) !== params.expectedAgentDir) throw new Error("The agent credential location changed while AI access was being tested. Try setup again.");
	if (params.expectedModelRef) {
		const current = params.resolveDefaultModelForAgent({
			cfg: params.config,
			agentId
		});
		if (`${current.provider}/${current.model}` !== params.expectedModelRef) throw new Error("The default model changed while AI access was being tested. Try setup again.");
	}
}
//#endregion
//#region src/system-agent/setup-apply.ts
/** Prompter for quickstart-only flows: notes go to the log, prompts fail loud. */
function createQuickstartNotePrompter(runtime) {
	const unexpected = (kind) => {
		throw new Error(`openclaw setup hit an interactive ${kind} prompt; quickstart must not ask`);
	};
	return {
		intro: async () => {},
		outro: async () => {},
		note: async (message, title) => {
			runtime.log(title ? `${title}: ${message}` : message);
		},
		select: async (params) => {
			if (params.initialValue !== void 0) return params.initialValue;
			return unexpected("select");
		},
		multiselect: async () => unexpected("multiselect"),
		text: async () => unexpected("text"),
		confirm: async (params) => params.initialValue ?? true,
		progress: (label) => {
			runtime.log(label);
			return {
				update: (message) => runtime.log(message),
				stop: (message) => {
					if (message) runtime.log(message);
				}
			};
		}
	};
}
function applySecurityAcknowledgement(config) {
	if (config.wizard?.securityAcknowledgedAt) return config;
	return {
		...config,
		wizard: {
			...config.wizard,
			securityAcknowledgedAt: (/* @__PURE__ */ new Date()).toISOString()
		}
	};
}
function applySystemAgentModelSelectionWithModules(params, modules) {
	const { agentScope, modelConfig, runtimePolicy } = modules;
	const nextConfig = structuredClone(params.config);
	const targetAgentId = params.targetAgentId ? normalizeAgentId(params.targetAgentId) : void 0;
	const agentId = targetAgentId ?? agentScope.resolveDefaultAgentId(nextConfig);
	const roster = agentScope.listAgentEntries(nextConfig);
	if (targetAgentId && !roster.some((entry) => normalizeAgentId(entry.id) === targetAgentId)) throw new Error(`Could not resolve configured agent "${targetAgentId}".`);
	const writesAgent = Boolean(targetAgentId || agentScope.resolveAgentExplicitModelPrimary(nextConfig, agentId));
	nextConfig.agents ??= {};
	nextConfig.agents.defaults ??= {};
	const agentDefaults = nextConfig.agents.defaults;
	const target = modelConfig.resolveModelTarget({
		raw: params.model,
		cfg: nextConfig
	});
	const key = modelConfig.upsertCanonicalModelConfigEntry({}, target);
	const configuredVisibleModels = agentDefaults.models;
	if (configuredVisibleModels && Object.keys(configuredVisibleModels).length > 0) {
		const defaultModels = { ...configuredVisibleModels };
		modelConfig.upsertCanonicalModelConfigEntry(defaultModels, target);
		agentDefaults.models = defaultModels;
	}
	const agentEntries = toAgentEntriesRecord(roster);
	if (writesAgent || params.agentRuntimeId) {
		const { list: _legacyList, ...agentConfig } = nextConfig.agents;
		nextConfig.agents = {
			...agentConfig,
			entries: agentEntries
		};
	}
	const agentEntryKey = roster.find((entry) => normalizeAgentId(entry.id) === agentId)?.id ?? agentId;
	let agent = agentEntries[agentEntryKey];
	if (writesAgent) {
		if (!agent) throw new Error(`Could not resolve configured default agent "${agentId}".`);
		const agentModels = { ...agent.models };
		agent.models = agentModels;
		modelConfig.upsertCanonicalModelConfigEntry(agentModels, target);
	}
	if (params.agentRuntimeId) {
		if (!agent) {
			agent = { default: true };
			agentEntries[agentEntryKey] = agent;
		}
		const agentModels = { ...agent.models };
		const agentKey = modelConfig.upsertCanonicalModelConfigEntry(agentModels, target);
		agentModels[agentKey] = {
			...agentModels[agentKey],
			agentRuntime: { id: params.agentRuntimeId }
		};
		agent.models = agentModels;
	} else {
		const clearRuntimePin = (models) => {
			const nextModels = { ...models };
			const modelKey = modelConfig.upsertCanonicalModelConfigEntry(nextModels, target);
			const entry = { ...nextModels[modelKey] };
			delete entry.agentRuntime;
			nextModels[modelKey] = entry;
			return nextModels;
		};
		const defaultModels = agentDefaults.models;
		if (defaultModels && Object.keys(defaultModels).length > 0) agentDefaults.models = clearRuntimePin(defaultModels);
		if (agent?.models && Object.keys(agent.models).length > 0) agent.models = clearRuntimePin(agent.models);
	}
	const selectedModel = params.authProfileId ? `${key}@${params.authProfileId}` : key;
	agentScope.setAgentEffectiveModelPrimary(nextConfig, agentId, selectedModel, { forceAgent: Boolean(targetAgentId) });
	if (params.agentRuntimeId) {
		if (runtimePolicy.resolveModelRuntimePolicy({
			config: nextConfig,
			provider: target.provider,
			modelId: target.model,
			agentId
		}).policy?.id !== params.agentRuntimeId) throw new Error(`Could not pin ${key} to the ${params.agentRuntimeId} runtime.`);
	}
	return nextConfig;
}
async function createSystemAgentModelSelectionUpdater(params) {
	const [agentScope, modelConfig, runtimePolicy] = await Promise.all([
		import("./agent-scope-B7ocz6pI.js"),
		import("./shared-Dxv9lSdh.js"),
		import("./model-runtime-policy-CYG72Do5.js")
	]);
	const modules = {
		agentScope,
		modelConfig,
		runtimePolicy
	};
	return (config) => applySystemAgentModelSelectionWithModules({
		...params,
		config
	}, modules);
}
async function applySystemAgentModelSelection(params) {
	return (await createSystemAgentModelSelectionUpdater(params))(params.config);
}
async function applySystemAgentSetup(params, hooks) {
	const { workspace, model, agentRuntimeId, authProfileId, expectedAgentId, expectedAgentDir, expectedModelRef, expectedConfigHash, configPatch, finalizeConfig, enablePluginId, refreshPluginRegistry, assertCommitPreconditions, surface, runtime } = params;
	const hasExpectedConfigHash = Object.hasOwn(params, "expectedConfigHash");
	const commit = hooks ? async (effect) => await hooks.commit(effect) : async (effect) => await effect();
	const [{ readSetupConfigFileSnapshot, resolveQuickstartGatewayDefaults }, onboardHelpers, { applyLocalSetupWorkspaceConfig, resolveOnboardingWorkspaceConflict }, { transformConfigWithPendingPluginInstalls }] = await Promise.all([
		import("./setup.shared-BmVj-Htu.js"),
		import("./onboard-helpers-DG0mt_gD.js"),
		import("./onboard-config-NB8UUxrg.js"),
		import("./install-record-commit-D6TP1hTK.js")
	]);
	let snapshot = await readSetupConfigFileSnapshot();
	let snapshotConfig = requireValidSystemAgentSetupSnapshot(snapshot);
	const configHashBefore = resolveConfigSnapshotHash(snapshot);
	const startedWithoutAuthoredRoster = !hasResolvedRosterBeforeMigrations(snapshot);
	let verifiedRoute = params.expectedInferenceRoute;
	let guardedExpectedAgentId = expectedAgentId;
	let guardedExpectedAgentDir = expectedAgentDir;
	let sessionMigrationWarnings = [];
	if (hasExpectedConfigHash && resolveConfigSnapshotHash(snapshot) !== expectedConfigHash) throw new Error("OpenClaw config changed while AI access was being tested. Try setup again.");
	let guardModules = expectedAgentId || expectedAgentDir || expectedModelRef ? await Promise.all([import("./agent-scope-B7ocz6pI.js"), import("./model-selection-CACl5c-f.js")]) : void 0;
	const assertExpectedTarget = (config) => {
		if (!guardModules) return;
		assertSetupTarget({
			config,
			expectedAgentId: guardedExpectedAgentId,
			expectedAgentDir: guardedExpectedAgentDir,
			expectedModelRef,
			resolveAgentDir: guardModules[0].resolveAgentDir,
			resolveDefaultAgentId: (currentConfig) => resolveSystemAgentOnboardingTarget(currentConfig).agentId,
			resolveDefaultModelForAgent: guardModules[1].resolveDefaultModelForAgent
		});
	};
	assertExpectedTarget(snapshotConfig.runtimeConfig);
	const assertVerifiedRoute = async (setupSnapshot, expectedRoute = verifiedRoute, phase = "before", ignoreAgentIdentity = false) => {
		if (!expectedRoute) return;
		const verifiedSnapshot = await readConfigFileSnapshot();
		const setupSource = setupSnapshot.exists ? setupSnapshot.sourceConfig ?? setupSnapshot.config : {};
		const verifiedSource = verifiedSnapshot.exists ? verifiedSnapshot.sourceConfig ?? verifiedSnapshot.config : {};
		const currentRoute = verifiedSnapshot.exists && verifiedSnapshot.valid && verifiedSnapshot.path === setupSnapshot.path && verifiedSnapshot.hash === setupSnapshot.hash && isDeepStrictEqual(verifiedSource, setupSource) ? await projectDefaultInferenceRoute(verifiedSnapshot.runtimeConfig ?? verifiedSnapshot.config) : null;
		if (!currentRoute || !sameSetupInferenceRoute(currentRoute, expectedRoute, ignoreAgentIdentity)) throw new Error(phase === "before" ? "The default-agent inference route changed before setup could start, so no workspace or Gateway settings were changed. Retry setup from the current OpenClaw session." : "The default-agent inference route changed after the config write, so no further setup effects were applied. Retry setup from the current OpenClaw session.");
		return currentRoute;
	};
	await assertVerifiedRoute(snapshot);
	let expectedWriteHash = expectedConfigHash;
	if (startedWithoutAuthoredRoster) {
		const { ensureOnboardingAgent } = await import("./onboard-agent-BC30vRBi.js");
		const onboardingSourceConfig = snapshot.sourceConfigBeforeMigrations ?? snapshotConfig.sourceConfig;
		const created = await commit(async () => await ensureOnboardingAgent({
			config: onboardingSourceConfig,
			workspace,
			baseConfig: onboardingSourceConfig,
			firstAgent: params.firstAgent ?? { name: "main" },
			expectedConfigHash: configHashBefore ?? null
		}));
		if (!created.createdAgent || !created.configHash) throw new Error("OpenClaw did not create the approved first agent because the roster changed. Retry setup.");
		snapshot = await readSetupConfigFileSnapshot();
		snapshotConfig = requireValidSystemAgentSetupSnapshot(snapshot);
		if ((resolveConfigSnapshotHash(snapshot) ?? null) !== created.configHash) throw new Error("OpenClaw config changed after first-agent creation. Retry setup.");
		const createdRoster = listAgentEntries(snapshotConfig.sourceConfig);
		if (createdRoster.length !== 1 || normalizeAgentId(createdRoster[0]?.id ?? "") !== created.agentId) throw new Error("OpenClaw first-agent ownership changed during setup. Retry setup.");
		verifiedRoute = await assertVerifiedRoute(snapshot, verifiedRoute, "before", true) ?? verifiedRoute;
		guardModules ??= await Promise.all([import("./agent-scope-B7ocz6pI.js"), import("./model-selection-CACl5c-f.js")]);
		guardedExpectedAgentId = created.agentId;
		guardedExpectedAgentDir = guardModules[0].resolveAgentDir(snapshotConfig.runtimeConfig, created.agentId);
		assertExpectedTarget(snapshotConfig.runtimeConfig);
		expectedWriteHash = created.configHash;
		sessionMigrationWarnings = created.sessionMigrationWarnings ?? [];
	}
	const prompter = createQuickstartNotePrompter(runtime);
	const { configureGatewayForSetup } = await import("./setup.gateway-config-Bl5Dbu8x.js");
	const buildSetupCandidate = async (currentBaseConfig, hasAuthoredRosterEntries) => {
		const roster = listAgentEntries(currentBaseConfig);
		const workspaceConflict = !hasAuthoredRosterEntries ? void 0 : resolveOnboardingWorkspaceConflict(currentBaseConfig, workspace);
		const currentHasRoster = hasAuthoredRosterEntries && roster.length > 0;
		const allowWorkspaceWrite = params.allowWorkspaceChange || !workspaceConflict && !currentHasRoster;
		let setupBaseConfig = currentBaseConfig;
		if (enablePluginId) {
			const enabled = enablePluginInConfig(setupBaseConfig, enablePluginId);
			if (!enabled.enabled) throw new Error(`Provider plugin ${enablePluginId} is ${enabled.reason}.`);
			setupBaseConfig = enabled.config;
		}
		if (configPatch !== void 0) setupBaseConfig = applyMergePatch(setupBaseConfig, configPatch);
		if (currentHasRoster) {
			const { list: _legacyList, ...agents } = setupBaseConfig.agents ?? {};
			setupBaseConfig = {
				...setupBaseConfig,
				agents: {
					...agents,
					entries: toAgentEntriesRecord(roster)
				}
			};
		}
		const preserveWorkspace = (currentHasRoster || Boolean(workspaceConflict)) && !params.allowWorkspaceChange;
		if (preserveWorkspace) {
			const defaults = { ...setupBaseConfig.agents?.defaults };
			const currentDefaults = currentBaseConfig.agents?.defaults;
			if (currentDefaults && Object.hasOwn(currentDefaults, "workspace")) defaults.workspace = currentDefaults.workspace;
			else delete defaults.workspace;
			setupBaseConfig = {
				...setupBaseConfig,
				agents: {
					...setupBaseConfig.agents,
					defaults
				}
			};
		}
		let candidate = applyLocalSetupWorkspaceConfig(setupBaseConfig, workspace, {
			allowWorkspaceChange: allowWorkspaceWrite,
			preserveWorkspace
		});
		if (model) {
			const targetAgentId = candidate.agents?.defaults?.systemAgent?.agentId;
			candidate = await applySystemAgentModelSelection({
				config: candidate,
				model,
				...targetAgentId ? { targetAgentId } : {},
				...agentRuntimeId ? { agentRuntimeId } : {},
				...authProfileId ? { authProfileId } : {}
			});
		}
		candidate = applySecurityAcknowledgement(candidate);
		const gateway = await configureGatewayForSetup({
			flow: "quickstart",
			baseConfig: currentBaseConfig,
			nextConfig: candidate,
			localPort: resolveGatewayPort(currentBaseConfig),
			quickstartGateway: resolveQuickstartGatewayDefaults(currentBaseConfig),
			prompter,
			runtime
		});
		return {
			nextConfig: onboardHelpers.applyWizardMetadata(gateway.nextConfig, {
				command: "onboard",
				mode: "local"
			}),
			settings: gateway.settings
		};
	};
	const committed = await commit(async () => await transformConfigWithPendingPluginInstalls({
		afterWrite: { mode: "auto" },
		writeOptions: {
			auditOrigin: "system-agent",
			allowConfigSizeDrop: false
		},
		transform: async (currentConfig, context) => {
			const currentSnapshot = requireValidSystemAgentSetupSnapshot(context.snapshot);
			if ((hasExpectedConfigHash || startedWithoutAuthoredRoster) && context.previousHash !== expectedWriteHash) throw new Error("OpenClaw config changed while AI access was being tested. Try setup again.");
			await assertVerifiedRoute(context.snapshot);
			assertExpectedTarget(currentSnapshot.runtimeConfig);
			const setupCandidate = await buildSetupCandidate(currentConfig, startedWithoutAuthoredRoster ? false : hasResolvedRosterBeforeMigrations(context.snapshot));
			const finalizedConfig = finalizeConfig ? finalizeConfig(setupCandidate.nextConfig, currentSnapshot.sourceConfig) : setupCandidate.nextConfig;
			const expectedSourceRoute = verifiedRoute ? await projectDefaultInferenceRoute(finalizedConfig) : void 0;
			if (verifiedRoute && (!verifiedRoute.route || !expectedSourceRoute?.route || !sameSetupConfiguredRoute(expectedSourceRoute.route, verifiedRoute.route, false))) throw new Error("The setup candidate no longer preserves the exact verified inference route, so it was not saved. Retry setup from the current OpenClaw session.");
			if (assertCommitPreconditions) {
				assertCommitPreconditions(currentSnapshot.sourceConfig);
				if (resolveUserPath(resolveSystemAgentOnboardingTarget(finalizedConfig).workspaceDir) !== resolveUserPath(workspace)) throw new Error("Another onboarding run owns a different workspace. Retry onboarding with its approved workspace.");
			}
			return {
				nextConfig: finalizedConfig,
				result: { settings: setupCandidate.settings }
			};
		}
	}));
	const nextConfig = committed.nextConfig;
	const settings = committed.result?.settings;
	if (!settings) throw new Error("OpenClaw setup committed without resolved Gateway settings.");
	const onboardingTarget = resolveSystemAgentOnboardingTarget(nextConfig);
	const effectiveWorkspace = onboardingTarget.workspaceDir;
	if (verifiedRoute) {
		const afterRead = await readConfigFileSnapshotWithPluginMetadata();
		const afterSnapshot = afterRead.snapshot;
		requireValidSystemAgentSetupSnapshot(afterSnapshot);
		const expectedRuntime = validateConfigObjectWithPlugins(committed.nextConfig, {
			env: process.env,
			pluginMetadataSnapshot: afterRead.pluginMetadataSnapshot
		});
		if (!expectedRuntime.ok) {
			const issue = expectedRuntime.issues[0];
			const detail = issue ? ` (${issue.path ? `${issue.path}: ` : ""}${issue.message})` : "";
			throw new Error(`OpenClaw could not validate the setup route after its config write${detail}. No further setup effects were applied. Retry setup from the current OpenClaw session.`);
		}
		const expectedPersistedRoute = await projectDefaultInferenceRoute(expectedRuntime.config);
		await assertVerifiedRoute(afterSnapshot, expectedPersistedRoute, "after");
		if (!sameSetupConfiguredRoute(expectedPersistedRoute.route, verifiedRoute.route, false)) throw new Error("The materialized inference route no longer matches the exact verified route, so no further setup effects were applied. Retry setup from the current OpenClaw session.");
	}
	const lines = [
		...sessionMigrationWarnings,
		`Workspace: ${shortenHomePath(effectiveWorkspace)}`,
		model ? `Default model: ${model}` : void 0
	].filter((line) => line !== void 0);
	const runCommittedFollowUp = async (effect, onFailure) => {
		let effectStarted = false;
		try {
			return await commit(async () => {
				effectStarted = true;
				return await effect();
			});
		} catch (error) {
			if (!effectStarted) throw error;
			onFailure(error);
			return;
		}
	};
	const effectiveAgentId = onboardingTarget.agentId;
	const workspaceResult = await runCommittedFollowUp(async () => await onboardHelpers.ensureWorkspaceAndSessions(effectiveWorkspace, runtime, {
		agentId: effectiveAgentId,
		skipBootstrap: Boolean(nextConfig.agents?.defaults?.skipBootstrap),
		skipOptionalBootstrapFiles: nextConfig.agents?.defaults?.skipOptionalBootstrapFiles
	}), (error) => lines.push(`Workspace files: ${formatErrorMessage(error)}`));
	await runCommittedFollowUp(async () => {
		const { updateExecApprovals } = await import("./exec-approvals-Cqj47tqr.js");
		await updateExecApprovals({ update: (approvals) => approvals.agents?.openclaw ? null : {
			...approvals,
			agents: {
				...approvals.agents,
				openclaw: {
					security: "full",
					ask: "off"
				}
			}
		} });
	}, (error) => lines.push(`OpenClaw exec approval: ${formatErrorMessage(error)}; local model harnesses may ask again.`));
	if (refreshPluginRegistry && enablePluginId) await runCommittedFollowUp(async () => {
		const { refreshPluginRegistryAfterConfigMutation } = await import("./registry-refresh-D799YyWZ.js");
		await refreshPluginRegistryAfterConfigMutation({
			config: nextConfig,
			reason: "source-changed",
			workspaceDir: onboardingTarget.workspaceDir,
			traceCommand: "openclaw-setup",
			logger: { warn: (message) => lines.push(message) }
		});
	}, (error) => lines.push(`Plugin registry refresh failed: ${formatErrorMessage(error)}`));
	let gateway = {
		status: "ready",
		action: "reused"
	};
	if (surface === "cli") await runCommittedFollowUp(async () => {
		const { ensureGatewayServiceForOnboarding } = await import("./setup.finalize-D73pfEnh.js");
		gateway = (await ensureGatewayServiceForOnboarding({
			flow: "quickstart",
			opts: {},
			nextConfig,
			settings,
			prompter,
			runtime,
			loadedAction: params.resume ? "resume" : "restart"
		})).gateway;
		if (gateway.status === "failed") lines.push(`Gateway service: ${gateway.error}`);
		else if (gateway.status === "ready") {
			const probeLinks = onboardHelpers.resolveLocalControlUiProbeLinks({
				bind: settings.bind,
				port: settings.port,
				customBindHost: settings.customBindHost,
				basePath: void 0,
				tlsEnabled: nextConfig.gateway?.tls?.enabled === true
			});
			const probe = await onboardHelpers.waitForGatewayReachable({
				url: probeLinks.wsUrl,
				token: settings.authMode === "token" ? settings.gatewayToken : void 0,
				password: settings.authMode === "password" ? await (await import("./setup.secret-input-BBC1fJCj.js")).resolveSetupSecretInputString({
					config: nextConfig,
					value: nextConfig.gateway?.auth?.password,
					path: "gateway.auth.password",
					env: process.env
				}) : void 0,
				deadlineMs: 15e3
			});
			if (probe.ok) lines.push(`Gateway: running at ${probeLinks.wsUrl}`);
			else {
				const detail = probe.detail ?? "still starting";
				gateway = {
					status: "failed",
					error: `Gateway is not reachable yet (${detail}).`
				};
				lines.push(`Gateway: not reachable yet (${detail}) — say \`gateway status\` to check`);
			}
		} else if (gateway.reason === "external") lines.push(`Gateway: ${formatExternalSupervisorActionRequired("start the gateway")}`);
		else lines.push("Gateway: service install skipped — say `start gateway` when you want it running.");
	}, (error) => {
		const message = formatErrorMessage(error);
		gateway = {
			status: "failed",
			error: message
		};
		lines.push(`Gateway service: ${message}`);
	});
	else lines.push("Gateway: running (managed by this app).");
	return {
		configPath: committed.path,
		configHashBefore,
		configHashAfter: committed.persistedHash,
		bootstrapPending: workspaceResult?.bootstrapPending === true,
		workspaceReady: workspaceResult !== void 0,
		gateway,
		lines
	};
}
//#endregion
export { createSystemAgentModelSelectionUpdater as i, applySystemAgentSetup as n, createQuickstartNotePrompter as r, applySystemAgentModelSelection as t };
