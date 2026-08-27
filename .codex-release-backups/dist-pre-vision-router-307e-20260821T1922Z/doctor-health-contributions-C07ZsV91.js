import { a as isDefaultInstallIdentity, y as resolveIsNixMode } from "./paths-CqeDjSA4.js";
import { n as isExperimentalClawsEnabled } from "./experimental-BMzbGmT5.js";
import { n as NON_DEFAULT_INSTALL_SERVICE_SKIP_REASON } from "./gateway-supervision-Cr5lTl_D.js";
import { i as writeConfigMachineState } from "./config-machine-state-DtXnQEX3.js";
import { t as note } from "./note-D7f3pYFE.js";
import { n as hasActiveGatewayExecCredential, t as resolveDoctorWorkspaceSuggestionScopes } from "./doctor-workspace-suggestion-scopes-DXWhymOp.js";
import { t as scrubDoctorErrorMessage } from "./doctor-error-message-DDF8eM88.js";
import { l as isLegacyParentWritableUpdateDoctorPass } from "./update-phase-sBAgYpaQ.js";
import { a as isUpdateDoctorRun, c as resolveLegacyParentVersionOverride, i as createDoctorHealthContribution, n as runCoreHealthFindingNote, o as resolveDoctorMode, r as runStructuredHealthRepairs, s as resolveDoctorWorkspaceDir, t as runCoreContributionHealth } from "./doctor-health-contribution-core-DjJWFzNP.js";
import { n as noteBackupDoctorHint } from "./backup-health-C6iQOkyz.js";
import { t as normalizeHealthCheck } from "./health-check-adapter-N54q7s7x.js";
import fs from "node:fs";
import path from "node:path";
//#region src/flows/doctor-health-contribution-runners.config.ts
function isExplicitOptOutEnvValue(value) {
	if (!value) return false;
	const normalized = value.trim().toLowerCase();
	return normalized !== "" && normalized !== "0" && normalized !== "false" && normalized !== "no";
}
function shouldSkipLegacyUpdateDoctorConfigWrite(env) {
	return isExplicitOptOutEnvValue(env.OPENCLAW_UPDATE_IN_PROGRESS) && !isExplicitOptOutEnvValue(env["OPENCLAW_UPDATE_PARENT_SUPPORTS_DOCTOR_CONFIG_WRITE"]);
}
async function runWriteConfigHealth(ctx, options = {}) {
	if (ctx.configWriteDeferredByCronOwnership === true) return;
	const { applyWizardMetadata } = await import("./onboard-helpers-B2IyzQ1N.js");
	const { replaceConfigFile } = await import("./config/config.js");
	const { logConfigUpdated } = await import("./logging-cIObUKoa.js");
	const { shortenHomePath } = await import("./utils-eenn1bKU.js");
	const configResultWritePending = ctx.configResult.shouldWriteConfig === true && ctx.configResultWriteCommitted !== true;
	if (configResultWritePending || JSON.stringify(ctx.cfg) !== JSON.stringify(ctx.cfgForPersistence)) {
		const updateDoctorRun = isUpdateDoctorRun(ctx.env ?? process.env);
		if (ctx.configResult.skipWizardMetadataForIncludeWrite !== true) ctx.cfg = applyWizardMetadata(ctx.cfg, {
			command: "doctor",
			mode: resolveDoctorMode(ctx.cfg)
		});
		if (shouldSkipLegacyUpdateDoctorConfigWrite(ctx.env ?? process.env)) {
			ctx.runtime.log("Skipping doctor config write during legacy update handoff.");
			return;
		}
		const legacyParentVersionOverride = resolveLegacyParentVersionOverride(ctx).lastTouchedVersionOverride;
		try {
			await replaceConfigFile({
				nextConfig: ctx.cfg,
				afterWrite: { mode: "auto" },
				writeOptions: {
					auditOrigin: "doctor",
					allowConfigSizeDrop: ctx.configResult.shouldWriteConfig === true || updateDoctorRun,
					skipPluginValidation: ctx.configResult.skipPluginValidationOnWrite === true || updateDoctorRun,
					...configResultWritePending && ctx.configResult.explicitSetPaths ? { explicitSetPaths: ctx.configResult.explicitSetPaths } : {},
					preservedLegacyRootKeys: ctx.configResult.preservedLegacyRootKeys,
					...legacyParentVersionOverride ? { lastTouchedVersionOverride: legacyParentVersionOverride } : {}
				}
			});
		} catch (error) {
			const { isCronOwnerWriteRefusalError } = await import("./io.cron-owner-refusal-sI_iFg70.js");
			if (!isCronOwnerWriteRefusalError(error)) throw error;
			const { note } = await import("./terminal-core/note.js");
			note([
				error.message,
				"Doctor left the config unchanged, preserving any retained legacy owner for a later repair.",
				"Resolve the reported Gateway or cron-store condition, then rerun \"openclaw doctor --fix\"."
			].join("\n"), "Doctor warnings");
			ctx.configWriteDeferredByCronOwnership = true;
			return;
		}
		ctx.cfgForPersistence = structuredClone(ctx.cfg);
		if (ctx.configResult.shouldWriteConfig === true) ctx.configResultWriteCommitted = true;
		logConfigUpdated(ctx.runtime);
		const preUpdateSnapshotPath = `${ctx.configPath}.pre-update`;
		if (updateDoctorRun && fs.existsSync(preUpdateSnapshotPath)) ctx.runtime.log(`Update changed config; pre-update backup: ${shortenHomePath(preUpdateSnapshotPath)}`);
	}
	if (options.runPostWriteRepairs === false) return;
	if (ctx.configResult.retiredPhoneControlStateCleanupPending === true) {
		const { finalizeRetiredPhoneControlCleanup } = await import("./doctor-retired-phone-control-CtQrlymc.js");
		const { note } = await import("./terminal-core/note.js");
		const cleanup = await finalizeRetiredPhoneControlCleanup({ env: ctx.env ?? process.env });
		if (cleanup.changes.length > 0) note(cleanup.changes.join("\n"), "Doctor changes");
		if (cleanup.warnings.length > 0) note(cleanup.warnings.join("\n"), "Doctor warnings");
	}
	if (ctx.configResult.shouldRepairCronCodexModelRefsAfterConfigWrite !== true || ctx.postConfigWriteRepairsCommitted === true) return;
	const { repairCronCodexModelRefsAfterConfigWrite } = await import("./legacy-repair-BrmsuAD9.js");
	const result = await repairCronCodexModelRefsAfterConfigWrite({
		cfg: ctx.cfg,
		...ctx.configResult.blockedCodexModelIdentities?.length ? { blockedModelIdentities: new Set(ctx.configResult.blockedCodexModelIdentities) } : {}
	});
	ctx.postConfigWriteRepairsCommitted = true;
	const { note } = await import("./terminal-core/note.js");
	if (result.changes.length > 0) note(result.changes.join("\n"), "Doctor changes");
	if (result.warnings.length > 0) note(result.warnings.join("\n"), "Doctor warnings");
}
/** Commits the finalized config-flow candidate before fallible health diagnostics start. */
async function runInitialConfigWriteHealth(ctx) {
	if (ctx.configResult.shouldWriteConfig !== true) return;
	await runWriteConfigHealth(ctx, { runPostWriteRepairs: false });
}
async function collectWriteConfigHealthFindings(ctx) {
	const findings = [];
	const configPath = ctx.configPath;
	if (resolveIsNixMode(process.env)) findings.push({
		checkId: "core/doctor/write-config",
		severity: "warning",
		message: "Doctor config writes are disabled because OpenClaw is running in Nix mode.",
		...configPath ? { path: configPath } : {},
		requirement: "mutable-config-write-path",
		fixHint: "Edit the Nix source for this install and rebuild; do not run doctor --fix against this config file."
	});
	if (!configPath) return findings;
	const configDirectory = path.dirname(configPath);
	const configPathExists = fs.existsSync(configPath);
	const existingParent = configPathExists ? configDirectory : findNearestExistingParent(configDirectory);
	if (!isDirectoryPath(existingParent)) {
		findings.push({
			checkId: "core/doctor/write-config",
			severity: "warning",
			message: "Doctor cannot create the config directory because a path component is a file.",
			path: existingParent,
			target: configDirectory,
			requirement: "config-directory-path",
			fixHint: "Move the file blocking the config directory path before running doctor --fix."
		});
		return findings;
	}
	try {
		fs.accessSync(existingParent, fs.constants.W_OK | fs.constants.X_OK);
	} catch {
		findings.push({
			checkId: "core/doctor/write-config",
			severity: "warning",
			message: configPathExists ? "Doctor cannot write config because the config directory is not writable." : "Doctor cannot create the config directory because the nearest existing parent is not writable.",
			path: existingParent,
			target: configPathExists ? configPath : configDirectory,
			requirement: "writable-config-directory",
			fixHint: "Make the existing config directory or parent directory writable before running doctor --fix."
		});
	}
	return findings;
}
function findNearestExistingParent(path$1) {
	let candidate = path$1;
	while (!pathEntryExists(candidate)) {
		const parent = path.dirname(candidate);
		if (parent === candidate) return candidate;
		candidate = parent;
	}
	return candidate;
}
function pathEntryExists(path) {
	if (fs.existsSync(path)) return true;
	try {
		fs.lstatSync(path);
		return true;
	} catch {
		return false;
	}
}
function isDirectoryPath(path) {
	try {
		return fs.statSync(path).isDirectory();
	} catch {
		return false;
	}
}
async function runFinalConfigValidationHealth(ctx) {
	const { readConfigFileSnapshot } = await import("./config/config.js");
	const finalSnapshot = await readConfigFileSnapshot({
		skipPluginValidation: isUpdateDoctorRun(ctx.env ?? process.env),
		preservedLegacyRootKeys: ctx.configResult.preservedLegacyRootKeys
	});
	if (finalSnapshot.exists && !finalSnapshot.valid) {
		ctx.runtime.error("Invalid config:");
		for (const issue of finalSnapshot.issues) ctx.runtime.error(`- ${issue.path || "<root>"}: ${issue.message}`);
	}
}
//#endregion
//#region src/flows/doctor-health-contribution-runners.gateway.ts
async function runCommandOwnerHealth(ctx) {
	const { noteCommandOwnerHealth } = await import("./doctor-command-owner-DnyxwuPn.js");
	noteCommandOwnerHealth(ctx.cfg);
}
async function runClaudeCliHealth(ctx) {
	const { noteClaudeCliHealth } = await import("./doctor-claude-cli-C_y-c4en.js");
	noteClaudeCliHealth(ctx.cfg);
}
async function runGatewayServicesHealth(ctx) {
	if (!isDefaultInstallIdentity(ctx.env ?? process.env)) {
		note(NON_DEFAULT_INSTALL_SERVICE_SKIP_REASON, "Gateway");
		return;
	}
	const { maybeRepairGatewayServiceConfig, maybeResolveDuelingSystemdGatewayScopes, maybeScanExtraGatewayServices } = await import("./doctor-gateway-services-CYsNHwXZ.js");
	const { noteMacLaunchAgentOverrides, noteMacLaunchctlGatewayEnvOverrides, noteMacStaleOpenClawUpdateLaunchdJobs } = await import("./doctor-platform-notes-CaAJex9z.js");
	await maybeScanExtraGatewayServices(ctx.options, ctx.runtime, ctx.prompter);
	await maybeResolveDuelingSystemdGatewayScopes(ctx.runtime, ctx.prompter);
	const updateDoctorRun = isUpdateDoctorRun(ctx.env ?? process.env);
	ctx.cfg = await maybeRepairGatewayServiceConfig(ctx.cfg, resolveDoctorMode(ctx.cfg), ctx.runtime, ctx.prompter, {
		allowExecSecretRefs: ctx.options.allowExec === true,
		allowConfigSizeDrop: ctx.configResult.shouldWriteConfig === true || updateDoctorRun,
		skipPluginValidation: ctx.configResult.skipPluginValidationOnWrite === true || updateDoctorRun,
		preservedLegacyRootKeys: ctx.configResult.preservedLegacyRootKeys,
		...resolveLegacyParentVersionOverride(ctx)
	});
	await noteMacLaunchAgentOverrides();
	await noteMacStaleOpenClawUpdateLaunchdJobs();
	await noteMacLaunchctlGatewayEnvOverrides(ctx.cfg);
}
async function runHostDesktopHealth(ctx) {
	const { noteHostDesktopHealth } = await import("./doctor-host-desktop-BUzRWiae.js");
	await noteHostDesktopHealth(ctx.cfg, { prompter: ctx.prompter });
}
async function runStartupChannelMaintenanceHealth(ctx) {
	const { maybeRunDoctorStartupChannelMaintenance } = await import("./doctor-startup-channel-maintenance-DlJS1QlL.js");
	await maybeRunDoctorStartupChannelMaintenance({
		cfg: ctx.cfg,
		env: process.env,
		runtime: ctx.runtime,
		shouldRepair: ctx.prompter.shouldRepair
	});
}
async function runSecurityHealth(ctx) {
	const { noteInstallPolicyHealth } = await import("./doctor-install-policy-CvAtEDVJ.js");
	const { noteSecurityWarnings } = await import("./doctor-security-BeeJyZ3u.js");
	await noteSecurityWarnings(ctx.cfg);
	await noteInstallPolicyHealth(ctx.cfg, {
		deep: ctx.options.deep === true,
		env: ctx.env
	});
}
async function runWebFetchProxyHealth(ctx) {
	if (!isDefaultInstallIdentity(ctx.env ?? process.env)) return;
	const { noteWebFetchProxyDiagnostic } = await import("./doctor-web-fetch-proxy-DGvDya3L.js");
	await noteWebFetchProxyDiagnostic({
		cfg: ctx.cfg,
		env: ctx.env ?? process.env
	});
}
async function runGitHubProjectHealth(ctx) {
	const { githubApiToken } = await import("./control-ui-github-api-DqFIh3eT.js");
	if (!githubApiToken(ctx.env ?? process.env)) note("Set GH_TOKEN in the Gateway environment to enable authenticated GitHub project search, including private repositories.", "GitHub projects");
}
async function runBrowserHealth(ctx) {
	const { noteChromeMcpBrowserReadiness } = await import("./doctor-browser-B0rhRxPj.js");
	await runCoreContributionHealth(ctx, ["core/doctor/browser-clawd-profile-residue"]);
	await noteChromeMcpBrowserReadiness(ctx.cfg);
}
async function runOpenAIOAuthTlsHealth(ctx) {
	const { noteOpenAIOAuthTlsPrerequisites } = await import("./provider-openai-chatgpt-oauth-tls-Dth049vJ.js");
	await noteOpenAIOAuthTlsPrerequisites({
		cfg: ctx.cfg,
		deep: ctx.options.deep === true
	});
}
async function runWhatsappResponsivenessHealth(ctx) {
	const { noteWhatsappResponsivenessHealth } = await import("./doctor-whatsapp-responsiveness-BV3lxUNs.js");
	await noteWhatsappResponsivenessHealth({
		cfg: ctx.cfg,
		status: ctx.gatewayStatus,
		shouldRepair: ctx.prompter.shouldRepair
	});
}
async function runDevicePairingHealth(ctx) {
	const { noteDevicePairingHealth } = await import("./doctor-device-pairing-tgfg0BAk.js");
	await noteDevicePairingHealth({
		cfg: ctx.cfg,
		healthOk: ctx.healthOk ?? false
	});
}
async function runGatewayDaemonHealth(ctx) {
	if (!isDefaultInstallIdentity(ctx.env ?? process.env)) return;
	const { maybeRepairGatewayDaemon } = await import("./doctor-gateway-daemon-flow-D3FHS6dC.js");
	await maybeRepairGatewayDaemon({
		cfg: ctx.cfg,
		runtime: ctx.runtime,
		prompter: ctx.prompter,
		options: ctx.options,
		gatewayDetailsMessage: ctx.gatewayDetails?.message ?? "",
		healthOk: ctx.healthOk ?? false,
		healthSkipped: ctx.gatewayHealthSkipped === true
	});
}
//#endregion
//#region src/flows/doctor-health-contribution-runners.workspace.ts
const loadDoctorStateIntegrityModule$1 = async () => await import("./doctor-state-integrity-B4WgukQz.js");
async function runActiveToolSchemaWarningsHealth(ctx) {
	if (!ctx.prompter.shouldRepair) return;
	const { collectActiveToolSchemaProjectionWarnings } = await import("./active-tool-schema-warnings-BGfiUQVO.js");
	const warnings = await collectActiveToolSchemaProjectionWarnings({
		cfg: ctx.cfg,
		env: ctx.env ?? process.env,
		...ctx.runWithPluginMetadataSnapshot ? { runWithPluginMetadataSnapshot: ctx.runWithPluginMetadataSnapshot } : {}
	});
	if (warnings.length === 0) return;
	const { note } = await import("./terminal-core/note.js");
	note(warnings.join("\n"), "Doctor warnings");
}
async function runHooksModelHealth(ctx) {
	if (!ctx.cfg.hooks?.gmail?.model?.trim()) return;
	const { DEFAULT_MODEL, DEFAULT_PROVIDER } = await import("./defaults-RjT9WtG0.js");
	const { loadPreparedModelCatalog } = await import("./prepared-model-catalog-BGLDTo2i.js");
	const { getModelRefStatus, resolveConfiguredModelRef, resolveHooksGmailModel } = await import("./model-selection-0mI527hu.js");
	const { note } = await import("./terminal-core/note.js");
	const hooksModelRef = resolveHooksGmailModel({
		cfg: ctx.cfg,
		defaultProvider: DEFAULT_PROVIDER
	});
	if (!hooksModelRef) {
		note(`- hooks.gmail.model "${ctx.cfg.hooks.gmail.model}" could not be resolved`, "Hooks");
		return;
	}
	const { provider: defaultProvider, model: defaultModel } = resolveConfiguredModelRef({
		cfg: ctx.cfg,
		defaultProvider: DEFAULT_PROVIDER,
		defaultModel: DEFAULT_MODEL
	});
	const catalog = await loadPreparedModelCatalog({
		config: ctx.cfg,
		readOnly: true,
		providerDiscoveryProviderIds: []
	});
	const status = getModelRefStatus({
		cfg: ctx.cfg,
		catalog,
		ref: hooksModelRef,
		defaultProvider,
		defaultModel
	});
	const warnings = [];
	if (!status.allowed) warnings.push(`- hooks.gmail.model "${status.key}" not allowed by agents.defaults.modelPolicy.allow (will use primary instead)`);
	if (!status.inCatalog) warnings.push(`- hooks.gmail.model "${status.key}" not in the model catalog (may fail at runtime)`);
	if (warnings.length > 0) note(warnings.join("\n"), "Hooks");
}
async function collectWorkspaceStatusPluginVersionDrift(params) {
	if (params.cfg.gateway?.mode === "remote") return;
	try {
		const { gatherDaemonStatus } = await import("./status.gather-BP34m8Bk.js");
		const status = await gatherDaemonStatus({
			rpc: {
				timeout: params.options?.nonInteractive === true ? "3000" : "10000",
				json: true
			},
			probe: true,
			requireRpc: false,
			deep: params.options?.deep === true,
			allowExecSecretRefs: params.options?.allowExec === true
		});
		const hasProbedGatewayVersion = typeof status.gateway?.version === "string" && status.gateway.version.trim() !== "";
		if (status.pluginVersionDrift && hasProbedGatewayVersion && !status.rpc?.authWarning) return status.pluginVersionDrift;
	} catch {}
}
async function runWorkspaceStatusHealth(ctx) {
	const pluginVersionDrift = await collectWorkspaceStatusPluginVersionDrift({
		cfg: ctx.cfg,
		options: ctx.options
	});
	const { noteWorkspaceStatus } = await import("./doctor-workspace-status-DyyGZ05J.js");
	noteWorkspaceStatus(ctx.cfg, {
		pluginVersionDrift,
		...ctx.runWithPluginMetadataSnapshot ? { runWithPluginMetadataSnapshot: ctx.runWithPluginMetadataSnapshot } : {}
	});
}
async function runSkillsHealth(ctx) {
	const { maybeRepairSkillReadiness } = await import("./doctor-skills-Cbk6xbK5.js");
	ctx.cfg = await maybeRepairSkillReadiness({
		cfg: ctx.cfg,
		prompter: ctx.prompter,
		...ctx.runWithPluginMetadataSnapshot ? { runWithPluginMetadataSnapshot: ctx.runWithPluginMetadataSnapshot } : {}
	});
}
async function runBootstrapSizeHealth(ctx) {
	const { noteBootstrapFileSize } = await import("./doctor-bootstrap-size-BJ1yhWDa.js");
	await noteBootstrapFileSize(ctx.cfg);
}
async function runHeartbeatCadenceMigrationHealth(ctx) {
	const { maybeMigrateHeartbeatCadenceToCron } = await import("./doctor-heartbeat-cadence-migration-DkGjVUVF.js");
	await maybeMigrateHeartbeatCadenceToCron({
		cfg: ctx.cfg,
		shouldRepair: ctx.prompter.shouldRepair,
		env: ctx.env
	});
}
async function runHeartbeatScratchMigrationHealth(ctx) {
	const { maybeMigrateHeartbeatFilesToScratch } = await import("./doctor-heartbeat-scratch-migration-DN1tJLm8.js");
	await maybeMigrateHeartbeatFilesToScratch({
		cfg: ctx.cfg,
		shouldRepair: ctx.prompter.shouldRepair,
		env: ctx.env
	});
}
async function runToolsMdMigrationHealth(ctx) {
	const { maybeMigrateToolsMd } = await import("./doctor-tools-md-migration-Czey-q5Z.js");
	await maybeMigrateToolsMd({
		cfg: ctx.cfg,
		shouldRepair: ctx.prompter.shouldRepair,
		env: ctx.env
	});
}
async function runHeartbeatTaskMigrationHealth(ctx) {
	const { maybeMigrateHeartbeatTasksToCron } = await import("./doctor-heartbeat-task-migration-q6s8Y5el.js");
	await maybeMigrateHeartbeatTasksToCron({
		cfg: ctx.cfg,
		shouldRepair: ctx.prompter.shouldRepair,
		env: ctx.env
	});
}
async function runMemorySearchHealthContribution(ctx) {
	const { maybeRepairMemoryRecallHealth, noteMemoryRecallHealth, noteMemorySearchHealth } = await import("./doctor-memory-search-DWmroryn.js");
	if (ctx.prompter.shouldRepair) await maybeRepairMemoryRecallHealth({
		cfg: ctx.cfg,
		prompter: ctx.prompter
	});
	await noteMemorySearchHealth(ctx.cfg, { gatewayMemoryProbe: ctx.gatewayMemoryProbe ?? {
		checked: false,
		ready: false,
		skipped: false
	} });
	if (ctx.options.deep === true) await noteMemoryRecallHealth(ctx.cfg);
}
function memorySearchNoteToFinding(message) {
	const lines = message.split("\n");
	const firstLine = (lines[0] ?? message).trim();
	if (firstLine === "Memory search is explicitly disabled (enabled: false).") return null;
	const fixHint = lines.slice(1).map((line) => line.trimEnd()).join("\n").trim();
	let path = "memory.search.provider";
	if (firstLine.includes("No active memory plugin")) path = "plugins.slots.memory";
	else if (firstLine.includes("OpenAI-compatible embeddings endpoint")) path = "memory.search.remote.baseUrl";
	else if (firstLine.includes("OpenAI-compatible embedding model")) path = "memory.search.model";
	return {
		checkId: "core/doctor/memory-search",
		severity: "warning",
		message: firstLine,
		path,
		...fixHint ? { fixHint } : {}
	};
}
async function collectMemorySearchHealthFindings(ctx) {
	const { noteMemorySearchHealth } = await import("./doctor-memory-search-DWmroryn.js");
	const notes = [];
	await noteMemorySearchHealth(ctx.cfg, {
		includeWorkspaceMemoryHealth: false,
		skipAuthProfileResolution: true,
		gatewayMemoryProbe: {
			checked: false,
			ready: false,
			skipped: true
		},
		noteFn: (message) => notes.push(String(message))
	});
	return notes.flatMap((message) => {
		const finding = memorySearchNoteToFinding(message);
		return finding ? [finding] : [];
	});
}
async function runWorkspaceSuggestionsHealth(ctx) {
	if (ctx.options.workspaceSuggestions === false) return;
	const { collectWorkspaceBackupTip } = await loadDoctorStateIntegrityModule$1();
	const { MEMORY_SYSTEM_PROMPT, shouldSuggestMemorySystem } = await import("./doctor-workspace-CgY68CA_.js");
	const { note } = await import("./terminal-core/note.js");
	for (const { agentId, workspaceDir, labelAgent } of resolveDoctorWorkspaceSuggestionScopes(ctx.cfg)) {
		const prefix = labelAgent ? `Agent "${agentId}": ` : "";
		const backupTip = collectWorkspaceBackupTip(workspaceDir);
		if (backupTip) note(`${prefix}${backupTip}`, "Workspace");
		if (await shouldSuggestMemorySystem(workspaceDir)) note(`${prefix}${MEMORY_SYSTEM_PROMPT}`, "Workspace");
	}
}
//#endregion
//#region src/flows/doctor-health-contributions-final.ts
function resolveFinalDoctorHealthContributions(params) {
	return [
		createDoctorHealthContribution({
			id: "doctor:gateway-services",
			label: "Gateway services",
			healthCheckIds: ["core/doctor/gateway-services/extra", "core/doctor/gateway-services/platform-notes"],
			run: runGatewayServicesHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:host-desktop",
			label: "Host desktop",
			healthChecks: {
				description: "Gateway-host desktop enablement, reachability, and RFB security state.",
				defaultEnabled: false,
				async detect(ctx) {
					const { collectHostDesktopHealthFindings } = await import("./doctor-host-desktop-BUzRWiae.js");
					return collectHostDesktopHealthFindings(ctx.cfg);
				}
			},
			run: runHostDesktopHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:default-account-routing",
			label: "Default account routing",
			healthChecks: {
				description: "Multi-account channels have explicit default routing or complete bindings.",
				defaultEnabled: false,
				async detect(ctx) {
					const { collectMissingDefaultAccountBindingWarnings, collectMissingExplicitDefaultAccountWarnings } = await import("./default-account-warnings-BvT3ql_G.js");
					return [...collectMissingDefaultAccountBindingWarnings(ctx.cfg), ...collectMissingExplicitDefaultAccountWarnings(ctx.cfg)].map((message) => ({
						checkId: "core/doctor/default-account-routing",
						severity: "warning",
						message: message.replace(/^- /, "").trim()
					}));
				}
			}
		}),
		createDoctorHealthContribution({
			id: "doctor:startup-channel-maintenance",
			label: "Startup channel maintenance",
			healthChecks: [{
				id: "core/doctor/channel-plugin-blockers",
				description: "Configured channels must have loadable backing channel plugins.",
				defaultEnabled: false,
				async detect(ctx) {
					const { channelPluginBlockerHitToHealthFinding, scanConfiguredChannelPluginBlockers } = await import("./channel-plugin-blockers-Cbpzlxso.js");
					return scanConfiguredChannelPluginBlockers(ctx.cfg, process.env).map(channelPluginBlockerHitToHealthFinding);
				}
			}, {
				id: "core/doctor/channel-preview-warnings",
				description: "Channel doctor preview warnings are captured as structured findings.",
				defaultEnabled: false,
				async detect(ctx) {
					const { collectChannelPreviewWarningHealthFindings } = await import("./doctor-startup-channel-maintenance-DlJS1QlL.js");
					return collectChannelPreviewWarningHealthFindings({
						cfg: ctx.cfg,
						allowExec: ctx.allowExecSecretRefs === true
					});
				}
			}],
			run: runStartupChannelMaintenanceHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:security",
			label: "Security",
			healthCheckIds: ["core/doctor/security"],
			run: runSecurityHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:web-fetch-proxy",
			label: "Web fetch proxy",
			run: runWebFetchProxyHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:github-projects",
			label: "GitHub projects",
			run: runGitHubProjectHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:browser",
			label: "Browser",
			healthCheckIds: ["core/doctor/browser", "core/doctor/browser-clawd-profile-residue"],
			run: runBrowserHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:oauth-tls",
			label: "OAuth TLS",
			healthCheckIds: ["core/doctor/oauth-tls"],
			run: runOpenAIOAuthTlsHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:hooks-model",
			label: "Hooks model",
			healthCheckIds: ["core/doctor/hooks-model"],
			run: runHooksModelHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:provider-catalog-projection",
			label: "Provider catalog projection",
			healthCheckIds: ["core/doctor/provider-catalog-projection"],
			run: (ctx) => runCoreHealthFindingNote(ctx, "core/doctor/provider-catalog-projection")
		}),
		createDoctorHealthContribution({
			id: "doctor:local-audio-acceleration",
			label: "Local audio acceleration",
			healthCheckIds: ["core/doctor/local-audio-acceleration"],
			run: (ctx) => runCoreHealthFindingNote(ctx, "core/doctor/local-audio-acceleration")
		}),
		createDoctorHealthContribution({
			id: "doctor:runtime-tool-schemas",
			label: "Runtime tool schemas",
			healthCheckIds: ["core/doctor/runtime-tool-schemas"],
			run: (ctx) => runCoreHealthFindingNote(ctx, "core/doctor/runtime-tool-schemas")
		}),
		createDoctorHealthContribution({
			id: "doctor:skill-workshop-tool-policy",
			label: "Skill Workshop tool policy",
			healthCheckIds: ["core/doctor/skill-workshop-tool-policy"],
			run: (ctx) => runCoreHealthFindingNote(ctx, "core/doctor/skill-workshop-tool-policy")
		}),
		createDoctorHealthContribution({
			id: "doctor:systemd-linger",
			label: "systemd linger",
			healthChecks: {
				description: "Disabled systemd user lingering is reported as a finding.",
				defaultEnabled: false,
				detect: params.detectSystemdLingerFindings
			},
			run: params.runSystemdLingerHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:workspace-status",
			label: "Workspace status",
			healthChecks: {
				description: "Workspace plugin/status diagnostics are exposed as findings.",
				defaultEnabled: false,
				async detect(ctx) {
					const { collectWorkspaceStatusHealthFindings } = await import("./doctor-workspace-status-DyyGZ05J.js");
					const pluginVersionDrift = await collectWorkspaceStatusPluginVersionDrift({
						cfg: ctx.cfg,
						options: {
							nonInteractive: true,
							allowExec: ctx.allowExecSecretRefs === true
						}
					});
					const runWithPluginMetadataSnapshot = ctx.runWithPluginMetadataSnapshot;
					return collectWorkspaceStatusHealthFindings(ctx.cfg, {
						pluginVersionDrift,
						...runWithPluginMetadataSnapshot ? { runWithPluginMetadataSnapshot } : {}
					});
				}
			},
			run: runWorkspaceStatusHealth
		}),
		...isExperimentalClawsEnabled() ? [createDoctorHealthContribution({
			id: "doctor:claws-state",
			label: "Claws state",
			healthCheckIds: ["core/doctor/claws-state"],
			run: (ctx) => runCoreHealthFindingNote(ctx, "core/doctor/claws-state")
		})] : [],
		createDoctorHealthContribution({
			id: "doctor:skills",
			label: "Skills",
			healthCheckIds: ["core/doctor/skills-readiness"],
			run: runSkillsHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:bootstrap-size",
			label: "Bootstrap size",
			healthCheckIds: ["core/doctor/bootstrap-size"],
			run: runBootstrapSizeHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:heartbeat-cadence-migration",
			label: "Heartbeat cadence migration",
			healthChecks: {
				description: "Heartbeat cadence config must be materialized in cron monitor rows.",
				defaultEnabled: true,
				async detect(ctx) {
					const { collectHeartbeatCadenceMigrationFindings } = await import("./doctor-heartbeat-cadence-migration-DkGjVUVF.js");
					return collectHeartbeatCadenceMigrationFindings(ctx.cfg, ctx.env);
				}
			},
			run: runHeartbeatCadenceMigrationHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:heartbeat-scratch-migration",
			label: "Heartbeat scratch migration",
			healthChecks: {
				description: "Workspace HEARTBEAT.md files must migrate into cron-owned scratch.",
				defaultEnabled: true,
				async detect(ctx) {
					const { collectHeartbeatScratchMigrationFindings } = await import("./doctor-heartbeat-scratch-migration-DN1tJLm8.js");
					return collectHeartbeatScratchMigrationFindings(ctx.cfg);
				}
			},
			run: runHeartbeatScratchMigrationHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:tools-md-migration",
			label: "TOOLS.md migration",
			healthChecks: {
				description: "Workspace TOOLS.md notes must migrate into the AGENTS.md Tools section.",
				defaultEnabled: true,
				async detect(ctx) {
					const { collectToolsMdMigrationFindings } = await import("./doctor-tools-md-migration-Czey-q5Z.js");
					return collectToolsMdMigrationFindings(ctx.cfg);
				}
			},
			run: runToolsMdMigrationHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:heartbeat-task-cron-migration",
			label: "Heartbeat task cron migration",
			healthChecks: {
				description: "Heartbeat scratch task blocks must migrate into automations.",
				defaultEnabled: true,
				async detect(ctx) {
					const { collectHeartbeatTaskMigrationFindings } = await import("./doctor-heartbeat-task-migration-q6s8Y5el.js");
					return collectHeartbeatTaskMigrationFindings(ctx.cfg, ctx.env);
				}
			},
			run: runHeartbeatTaskMigrationHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:shell-completion",
			label: "Shell completion",
			healthCheckIds: ["core/doctor/shell-completion"],
			run: params.runShellCompletionHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:gateway-health",
			label: "Gateway health",
			healthCheckIds: ["core/doctor/gateway-health"],
			run: params.runGatewayHealthChecks
		}),
		createDoctorHealthContribution({
			id: "doctor:whatsapp-responsiveness",
			label: "WhatsApp responsiveness",
			healthChecks: {
				description: "WhatsApp responsiveness pressure from degraded Gateway and local TUI clients.",
				defaultEnabled: false,
				async detect(ctx) {
					const { collectWhatsappResponsivenessHealthFindings } = await import("./doctor-whatsapp-responsiveness-BV3lxUNs.js");
					let status;
					if (!(await hasActiveGatewayExecCredential({ cfg: ctx.cfg }) && ctx.allowExecSecretRefs !== true)) {
						const { callGateway } = await import("./call-DrX49UA-.js");
						status = await callGateway({
							method: "status",
							params: { includeChannelSummary: false },
							timeoutMs: 3e3,
							config: ctx.cfg,
							deviceIdentity: null
						}).catch(() => void 0);
					}
					return collectWhatsappResponsivenessHealthFindings({
						cfg: ctx.cfg,
						status
					});
				}
			},
			run: runWhatsappResponsivenessHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:memory-search",
			label: "Memory search",
			healthChecks: {
				description: "Memory search provider and backend readiness are captured as findings.",
				defaultEnabled: false,
				detect: collectMemorySearchHealthFindings
			},
			run: runMemorySearchHealthContribution
		}),
		createDoctorHealthContribution({
			id: "doctor:device-pairing",
			label: "Device pairing",
			healthChecks: {
				description: "Device pairing requests and stale device-auth records are findings.",
				defaultEnabled: false,
				async detect(ctx) {
					const { collectDevicePairingHealthFindings } = await import("./doctor-device-pairing-tgfg0BAk.js");
					return collectDevicePairingHealthFindings({
						cfg: ctx.cfg,
						healthOk: false
					});
				}
			},
			run: runDevicePairingHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:gateway-daemon",
			label: "Gateway daemon",
			healthCheckIds: ["core/doctor/gateway-daemon"],
			run: runGatewayDaemonHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:write-config",
			label: "Write config",
			healthChecks: {
				description: "Config write blockers are findings before doctor repair writes.",
				defaultEnabled: false,
				detect: collectWriteConfigHealthFindings
			},
			run: runWriteConfigHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:workspace-suggestions",
			label: "Workspace suggestions",
			healthCheckIds: ["core/doctor/workspace-suggestions"],
			run: runWorkspaceSuggestionsHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:final-config-validation",
			label: "Final config validation",
			healthCheckIds: ["core/doctor/final-config-validation"],
			run: runFinalConfigValidationHealth
		})
	];
}
//#endregion
//#region src/flows/doctor-health-contribution-runners.state.ts
const loadDoctorStateIntegrityModule = async () => await import("./doctor-state-integrity-B4WgukQz.js");
async function runLegacyPluginManifestHealth(ctx) {
	const { maybeRepairLegacyPluginManifestContracts } = await import("./doctor-plugin-manifests-DbpOo-1a.js");
	if (await maybeRepairLegacyPluginManifestContracts({
		config: ctx.cfg,
		env: process.env,
		runtime: ctx.runtime,
		prompter: ctx.prompter
	})) ctx.invalidatePluginMetadataSnapshot?.();
}
async function runPluginRegistryHealth(ctx) {
	const { maybeRepairPluginRegistryState } = await import("./doctor-plugin-registry-B5yuu8s8.js");
	const result = await maybeRepairPluginRegistryState({
		config: ctx.cfg,
		env: process.env,
		prompter: ctx.prompter
	});
	ctx.cfg = result.config;
	if (result.pluginInventoryChanged) ctx.invalidatePluginMetadataSnapshot?.();
}
async function runReleaseConfiguredPluginInstallsHealth(ctx) {
	if (!ctx.sourceConfigValid || !ctx.prompter.shouldRepair) return;
	const { maybeRunConfiguredPluginInstallReleaseStep } = await import("./release-configured-plugin-installs-j-jlFK7K.js");
	const { note } = await import("./terminal-core/note.js");
	const { VERSION } = await import("./version-qnM0RpgZ.js");
	const result = await maybeRunConfiguredPluginInstallReleaseStep({
		cfg: ctx.cfg,
		env: ctx.env ?? process.env,
		touchedVersion: ctx.configResult.sourceLastTouchedVersion ?? ctx.cfg.meta?.lastTouchedVersion
	});
	if (result.pluginInventoryChanged) ctx.invalidatePluginMetadataSnapshot?.();
	if (result.postInstallDoctorResult) ctx.postInstallDoctorResult = result.postInstallDoctorResult;
	if (result.changes.length > 0) note(result.changes.join("\n"), "Doctor changes");
	if (result.warnings.length > 0) note(result.warnings.join("\n"), "Doctor warnings");
	if (!result.touchedConfig) return;
	const lastTouchedVersion = isLegacyParentWritableUpdateDoctorPass(ctx.env ?? process.env) ? ctx.configResult.sourceLastTouchedVersion?.trim() || ctx.cfg.meta?.lastTouchedVersion || VERSION : VERSION;
	ctx.cfg = {
		...ctx.cfg,
		meta: {
			...ctx.cfg.meta,
			lastTouchedVersion
		}
	};
	writeConfigMachineState("config.lastTouchedAt", (/* @__PURE__ */ new Date()).toISOString());
}
async function runDiskSpaceHealth(ctx) {
	const { noteDiskSpace } = await import("./doctor-disk-space-DcGpC97u.js");
	noteDiskSpace(ctx.cfg);
}
async function runDatabaseBloatHealth(ctx) {
	const { noteSqliteDatabaseBloat } = await import("./doctor-db-bloat-7KJZYMt7.js");
	noteSqliteDatabaseBloat(ctx.cfg);
}
async function runAgentMemorySchemaHealth(ctx) {
	const { noteDoctorAgentMemorySchemaHealth } = await import("./doctor-agent-memory-schema-Za_ALz01.js");
	await noteDoctorAgentMemorySchemaHealth({
		env: ctx.env ?? process.env,
		shouldRepair: ctx.prompter.shouldRepair
	});
}
async function runChannelIngressDeadLettersHealth() {
	const { noteChannelIngressDeadLetters } = await import("./doctor-channel-ingress-9cwRAscV.js");
	noteChannelIngressDeadLetters();
}
async function runStateIntegrityHealth(ctx) {
	const { noteStateIntegrity } = await loadDoctorStateIntegrityModule();
	await noteStateIntegrity(ctx.cfg, ctx.prompter, ctx.configPath, { stateDirExistedAtStart: ctx.stateDirExistedAtStart });
	noteBackupDoctorHint(ctx.env ?? process.env);
}
async function runCodexSessionRouteHealth(ctx) {
	const { maybeRepairCodexSessionRoutes } = await import("./codex-route-warnings-DTWn0EPo.js");
	const { note } = await import("./terminal-core/note.js");
	const result = await maybeRepairCodexSessionRoutes({
		cfg: ctx.cfg,
		env: ctx.env ?? process.env,
		shouldRepair: ctx.prompter.shouldRepair,
		...ctx.configResult.blockedCodexModelIdentities?.length ? { blockedModelIdentities: new Set(ctx.configResult.blockedCodexModelIdentities) } : {},
		...ctx.configResult.openAICodexAuthProfileIdMap?.size ? { authProfileIdMap: ctx.configResult.openAICodexAuthProfileIdMap } : {}
	});
	if (result.changes.length > 0) note(result.changes.join("\n"), "Doctor changes");
	if (result.warnings.length > 0) note(result.warnings.join("\n"), "Doctor warnings");
}
async function runSessionTranscriptsHealth(ctx) {
	const { noteSessionTranscriptHealth } = await import("./doctor-session-transcripts-CNrfRaOP.js");
	await noteSessionTranscriptHealth({
		cfg: ctx.cfg,
		env: ctx.env ?? process.env,
		shouldRepair: ctx.prompter.shouldRepair
	});
}
async function runSessionTranscriptHeadersHealth(ctx) {
	const { noteSessionTranscriptHeaderHealth } = await import("./doctor-session-transcript-headers-BDZzobsL.js");
	await noteSessionTranscriptHeaderHealth({
		cfg: ctx.cfg,
		env: ctx.env ?? process.env,
		shouldRepair: ctx.prompter.shouldRepair
	});
}
async function runSessionTranscriptLabelsHealth(ctx) {
	const { noteSessionTranscriptLabelHealth } = await import("./doctor-session-transcript-labels-BVzKZ15S.js");
	await noteSessionTranscriptLabelHealth({
		cfg: ctx.cfg,
		env: ctx.env ?? process.env,
		shouldRepair: ctx.prompter.shouldRepair
	});
}
async function runSessionSnapshotsHealth(ctx) {
	const { noteSessionSnapshotHealth } = await import("./doctor-session-snapshots-DlWA17v8.js");
	await noteSessionSnapshotHealth({
		cfg: ctx.cfg,
		env: ctx.env ?? process.env,
		shouldRepair: ctx.prompter.shouldRepair
	});
}
async function runConfigAuditScrubHealth(ctx) {
	const { maybeRepairLegacyRuntimeFiles } = await import("./doctor-usage-cost-cache-BsyIK6GF.js");
	await maybeRepairLegacyRuntimeFiles(ctx.prompter.shouldRepair, ctx.env);
}
async function runLegacyCronHealth(ctx) {
	const { maybeRepairLegacyCronStore, noteLegacyWhatsAppCrontabHealthCheck } = await import("./cron-6fAG4xmm.js");
	await noteLegacyWhatsAppCrontabHealthCheck();
	await maybeRepairLegacyCronStore({
		cfg: ctx.cfg,
		options: ctx.options,
		prompter: ctx.prompter
	});
}
async function runSandboxHealth(ctx) {
	const { maybeRepairSandboxImages, maybeRepairSandboxRegistryFiles, noteSandboxScopeWarnings } = await import("./doctor-sandbox-C7vd6-eb.js");
	await maybeRepairSandboxRegistryFiles(ctx.prompter);
	ctx.cfg = await maybeRepairSandboxImages(ctx.cfg, ctx.runtime, ctx.prompter);
	noteSandboxScopeWarnings(ctx.cfg);
}
//#endregion
//#region src/flows/doctor-health-contributions-initial.ts
function legacyOwnedRepair(collectEffects, reason) {
	return async (ctx) => {
		const effects = await collectEffects(ctx);
		return ctx.dryRun === true ? {
			status: "repaired",
			changes: [],
			effects
		} : {
			status: "skipped",
			reason,
			changes: [],
			effects
		};
	};
}
async function runTelegramGeneralTopicConversationHealth(ctx) {
	const { runCoreContributionHealth } = await import("./doctor-health-contribution-core-LrQ0p21g.js");
	await runCoreContributionHealth(ctx, ["core/doctor/telegram-general-topic-conversations"]);
}
function resolveInitialDoctorHealthContributions(params) {
	return [
		createDoctorHealthContribution({
			id: "doctor:write-config-migrations",
			label: "Write config migrations",
			required: true,
			run: runInitialConfigWriteHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:gateway-config",
			label: "Gateway config",
			healthCheckIds: ["core/doctor/gateway-config"],
			run: params.runGatewayConfigHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:auth-profiles",
			label: "Auth profiles",
			healthChecks: {
				description: "Auth profile cooldown, expiry, missing credential, and legacy override state",
				defaultEnabled: false,
				async detect(ctx) {
					const { collectAuthProfileHealthFindings } = await import("./doctor-auth-BjifsFh3.js");
					return collectAuthProfileHealthFindings({
						cfg: ctx.cfg,
						allowKeychainPrompt: false
					});
				}
			},
			run: params.runAuthProfileHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:claude-cli",
			label: "Claude CLI",
			healthCheckIds: ["core/doctor/claude-cli"],
			run: runClaudeCliHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:gateway-auth",
			label: "Gateway auth",
			healthCheckIds: ["core/doctor/gateway-auth"],
			run: params.runGatewayAuthHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:command-owner",
			label: "Command owner",
			healthCheckIds: ["core/doctor/command-owner"],
			run: runCommandOwnerHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:structured-health-repairs",
			label: "Structured health repairs",
			run: params.runStructuredHealthRepairs
		}),
		createDoctorHealthContribution({
			id: "doctor:legacy-state",
			label: "Legacy state",
			healthCheckIds: ["core/doctor/legacy-state", "core/doctor/removed-workspaces-state"],
			run: params.runLegacyStateHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:session-transcripts",
			label: "Session transcripts",
			healthChecks: {
				description: "Legacy or branchy session transcript files are represented as findings.",
				defaultEnabled: false,
				async detect() {
					const { detectSessionTranscriptHealthIssues, sessionTranscriptIssueToHealthFinding } = await import("./doctor-session-transcripts-CNrfRaOP.js");
					return (await detectSessionTranscriptHealthIssues()).map(sessionTranscriptIssueToHealthFinding);
				},
				repair: legacyOwnedRepair(async () => {
					const { detectSessionTranscriptHealthIssues, sessionTranscriptIssueToRepairEffect } = await import("./doctor-session-transcripts-CNrfRaOP.js");
					return (await detectSessionTranscriptHealthIssues()).map(sessionTranscriptIssueToRepairEffect);
				}, "legacy doctor session transcript contribution owns transcript rewrites")
			},
			run: runSessionTranscriptsHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:agent-memory-schema",
			label: "Agent memory schema",
			run: runAgentMemorySchemaHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:legacy-plugin-manifests",
			label: "Legacy plugin manifests",
			healthChecks: {
				description: "Legacy plugin manifest capability keys are reported as findings.",
				defaultEnabled: false,
				async detect(ctx) {
					const { collectLegacyPluginManifestContractMigrations, legacyPluginManifestContractMigrationToHealthFinding } = await import("./doctor-plugin-manifests-DbpOo-1a.js");
					return collectLegacyPluginManifestContractMigrations({
						config: ctx.cfg,
						env: process.env
					}).map(legacyPluginManifestContractMigrationToHealthFinding);
				}
			},
			run: runLegacyPluginManifestHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:legacy-plugin-dependencies",
			label: "Legacy plugin dependencies",
			healthChecks: {
				description: "Legacy plugin dependency state roots are represented as findings.",
				defaultEnabled: false,
				async detect() {
					const { detectLegacyPluginDependencyStateIssues, legacyPluginDependencyStateIssueToHealthFinding } = await import("./plugin-dependency-cleanup-BI3CGTXG.js");
					return (await detectLegacyPluginDependencyStateIssues({ env: process.env })).map(legacyPluginDependencyStateIssueToHealthFinding);
				}
			},
			run: async () => {}
		}),
		createDoctorHealthContribution({
			id: "doctor:stale-plugin-runtime-symlinks",
			label: "Stale plugin runtime symlinks",
			healthChecks: {
				description: "Stale plugin-runtime symlinks are represented as findings.",
				defaultEnabled: false,
				async detect() {
					const { collectStalePluginRuntimeSymlinkHealthFindings } = await import("./plugin-runtime-symlinks-BoO7SvAe.js");
					return collectStalePluginRuntimeSymlinkHealthFindings();
				}
			},
			run: async () => {}
		}),
		createDoctorHealthContribution({
			id: "doctor:release-configured-plugin-installs",
			label: "Configured plugin repair",
			healthChecks: {
				id: "core/doctor/configured-plugin-installs",
				description: "Configured plugin install records and package payloads are repairable.",
				defaultEnabled: false,
				async detect(ctx) {
					const { detectConfiguredPluginInstallHealthIssues, configuredPluginInstallIssueToHealthFinding } = await import("./missing-configured-plugin-install-DTdqcc_i.js");
					return (await detectConfiguredPluginInstallHealthIssues({
						cfg: ctx.cfg,
						env: process.env
					})).map(configuredPluginInstallIssueToHealthFinding);
				},
				repair: legacyOwnedRepair(async (ctx) => {
					const { detectConfiguredPluginInstallHealthIssues, configuredPluginInstallIssueToRepairEffect } = await import("./missing-configured-plugin-install-DTdqcc_i.js");
					return (await detectConfiguredPluginInstallHealthIssues({
						cfg: ctx.cfg,
						env: process.env
					})).map(configuredPluginInstallIssueToRepairEffect);
				}, "legacy doctor configured plugin install repair owns package mutation")
			},
			run: runReleaseConfiguredPluginInstallsHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:plugin-registry",
			label: "Plugin registry",
			healthChecks: {
				description: "Plugin registry migration, stale shadow, and peer-link issues are findings.",
				defaultEnabled: false,
				async detect(ctx) {
					const { detectPluginRegistryHealthIssues, pluginRegistryIssueToHealthFinding } = await import("./doctor-plugin-registry-B5yuu8s8.js");
					return (await detectPluginRegistryHealthIssues({
						config: ctx.cfg,
						env: process.env,
						prompter: { shouldRepair: false }
					})).map(pluginRegistryIssueToHealthFinding);
				},
				repair: legacyOwnedRepair(async (ctx) => {
					const { detectPluginRegistryHealthIssues, pluginRegistryIssueToRepairEffect } = await import("./doctor-plugin-registry-B5yuu8s8.js");
					return (await detectPluginRegistryHealthIssues({
						config: ctx.cfg,
						env: process.env,
						prompter: { shouldRepair: false }
					})).map(pluginRegistryIssueToRepairEffect);
				}, "legacy doctor plugin registry contribution owns registry repairs")
			},
			run: runPluginRegistryHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:active-tool-schema-warnings",
			label: "Active tool schema warnings",
			run: runActiveToolSchemaWarningsHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:ui-protocol-freshness",
			label: "UI protocol freshness",
			healthCheckIds: ["core/doctor/ui-protocol-freshness"],
			run: async () => {}
		}),
		createDoctorHealthContribution({
			id: "doctor:disk-space",
			label: "Disk space",
			healthChecks: {
				description: "Low disk space around the OpenClaw state directory is a finding.",
				defaultEnabled: false,
				async detect(ctx) {
					const { collectDiskSpaceHealthFindings } = await import("./doctor-disk-space-DcGpC97u.js");
					return collectDiskSpaceHealthFindings(ctx.cfg);
				}
			},
			run: runDiskSpaceHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:db-bloat",
			label: "SQLite database size",
			run: runDatabaseBloatHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:channel-ingress-dead-letters",
			label: "Channel ingress dead letters",
			run: runChannelIngressDeadLettersHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:state-integrity",
			label: "State integrity",
			healthChecks: {
				description: "State directory, config permission, and runtime state issues are findings.",
				defaultEnabled: false,
				async detect(ctx) {
					const { detectStateIntegrityHealthIssues, stateIntegrityIssueToHealthFinding } = await import("./doctor-state-integrity-B4WgukQz.js");
					return detectStateIntegrityHealthIssues(ctx.cfg, {
						configPath: ctx.configPath,
						env: process.env
					}).map(stateIntegrityIssueToHealthFinding);
				},
				repair: legacyOwnedRepair(async (ctx) => {
					const { detectStateIntegrityHealthIssues, stateIntegrityIssueToRepairEffect } = await import("./doctor-state-integrity-B4WgukQz.js");
					return detectStateIntegrityHealthIssues(ctx.cfg, {
						configPath: ctx.configPath,
						env: process.env
					}).map(stateIntegrityIssueToRepairEffect);
				}, "legacy doctor state integrity contribution owns state repairs")
			},
			run: runStateIntegrityHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:codex-session-routes",
			label: "Codex session routes",
			healthCheckIds: ["core/doctor/codex-session-routes"],
			run: runCodexSessionRouteHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:telegram-general-topic-conversations",
			label: "Telegram General-topic conversations",
			healthCheckIds: ["core/doctor/telegram-general-topic-conversations"],
			run: runTelegramGeneralTopicConversationHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:session-transcript-headers",
			label: "Session transcript headers",
			run: runSessionTranscriptHeadersHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:session-transcript-labels",
			label: "Session transcript labels",
			run: runSessionTranscriptLabelsHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:session-snapshots",
			label: "Session snapshots",
			healthChecks: {
				description: "Stale cached session snapshot paths are represented as findings.",
				defaultEnabled: false,
				async detect(ctx) {
					const { detectSessionSnapshotHealthIssues, sessionSnapshotIssueToHealthFinding } = await import("./doctor-session-snapshots-DlWA17v8.js");
					return (await detectSessionSnapshotHealthIssues({
						cfg: ctx.cfg,
						env: process.env
					})).map(sessionSnapshotIssueToHealthFinding);
				},
				repair: legacyOwnedRepair(async (ctx) => {
					const { detectSessionSnapshotHealthIssues, sessionSnapshotIssueToRepairEffect } = await import("./doctor-session-snapshots-DlWA17v8.js");
					return (await detectSessionSnapshotHealthIssues({
						cfg: ctx.cfg,
						env: process.env
					})).map(sessionSnapshotIssueToRepairEffect);
				}, "legacy doctor session snapshot contribution owns snapshot rewrites")
			},
			run: runSessionSnapshotsHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:config-audit-scrub",
			label: "Config audit",
			healthChecks: {
				description: "Historical config-audit argv redaction gaps are represented as structured findings.",
				defaultEnabled: false,
				async detect() {
					const { configAuditScrubToHealthFinding, detectConfigAuditScrubIssue } = await import("./doctor-config-audit-scrub-CmjMzJv4.js");
					const result = await detectConfigAuditScrubIssue();
					return result.rewritten > 0 ? [configAuditScrubToHealthFinding(result)] : [];
				},
				repair: legacyOwnedRepair(async () => {
					const { configAuditScrubToRepairEffect, detectConfigAuditScrubIssue } = await import("./doctor-config-audit-scrub-CmjMzJv4.js");
					const result = await detectConfigAuditScrubIssue();
					return result.rewritten > 0 ? [configAuditScrubToRepairEffect(result)] : [];
				}, "legacy doctor config audit contribution owns cleanup")
			},
			run: runConfigAuditScrubHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:legacy-cron",
			label: "Legacy cron",
			healthCheckIds: ["core/doctor/legacy-whatsapp-crontab", "core/doctor/legacy-cron-store"],
			run: runLegacyCronHealth
		}),
		createDoctorHealthContribution({
			id: "doctor:sandbox",
			label: "Sandbox",
			healthChecks: {
				id: "core/doctor/sandbox/registry-files",
				description: "Legacy sandbox registry files are represented in SQLite registry storage.",
				async detect() {
					const { detectLegacySandboxRegistryFileIssues, legacySandboxRegistryInspectionToHealthFinding } = await import("./doctor-sandbox-C7vd6-eb.js");
					return (await detectLegacySandboxRegistryFileIssues()).map(legacySandboxRegistryInspectionToHealthFinding);
				},
				repair: legacyOwnedRepair(async () => {
					const { detectLegacySandboxRegistryFileIssues, legacySandboxRegistryInspectionToRepairEffect } = await import("./doctor-sandbox-C7vd6-eb.js");
					return (await detectLegacySandboxRegistryFileIssues()).map(legacySandboxRegistryInspectionToRepairEffect);
				}, "legacy doctor sandbox contribution owns registry migration")
			},
			run: runSandboxHealth
		})
	];
}
//#endregion
//#region src/flows/doctor-health-contributions.ts
const loadCommandFormatModule = async () => await import("./command-format-BM6rVX-c.js");
const loadDoctorCoreChecksModule = async () => await import("./doctor-core-checks-BT-1mSih.js");
const loadNoteModule = async () => await import("./terminal-core/note.js");
const loadOnboardHelpersModule = async () => await import("./onboard-helpers-B2IyzQ1N.js");
const loadSecretTypesModule = async () => await import("./types.secrets-vXm6qYq1.js");
async function runGatewayConfigHealth(ctx) {
	const { formatCliCommand } = await loadCommandFormatModule();
	const { hasAmbiguousGatewayAuthModeConfig } = await import("./auth-mode-policy-BAtfQeR1.js");
	const { note } = await loadNoteModule();
	if (!ctx.cfg.gateway?.mode) {
		const lines = [
			"gateway.mode is unset; gateway start will be blocked.",
			`Fix: run ${formatCliCommand("openclaw configure")} and set Gateway mode (local/remote).`,
			`Or set directly: ${formatCliCommand("openclaw config set gateway.mode local")}`
		];
		if (!fs.existsSync(ctx.configPath)) lines.push(`Missing config: run ${formatCliCommand("openclaw setup")} first.`);
		note(lines.join("\n"), "Gateway");
	}
	if (resolveDoctorMode(ctx.cfg) === "local" && hasAmbiguousGatewayAuthModeConfig(ctx.cfg)) note([
		"gateway.auth.token and gateway.auth.password are both configured while gateway.auth.mode is unset.",
		"Set an explicit mode to avoid ambiguous auth selection and startup/runtime failures.",
		`Set token mode: ${formatCliCommand("openclaw config set gateway.auth.mode token")}`,
		`Set password mode: ${formatCliCommand("openclaw config set gateway.auth.mode password")}`
	].join("\n"), "Gateway auth");
}
async function runAuthProfileHealth(ctx) {
	const { maybeMigrateAuthProfileJsonStoresToSqlite } = await import("./doctor-auth-flat-profiles-Dd2ReHzo.js");
	const { maybeRepairLegacyOAuthProfileIds } = await import("./doctor-auth-legacy-oauth-BDWYsEL2.js");
	const { maybeRepairLegacyOAuthSidecarProfiles } = await import("./doctor-auth-oauth-sidecar-Cct15UGe.js");
	const { maybeMigrateLegacyPluginModelCatalogs } = await import("./doctor-plugin-model-catalog-2qG47oQk.js");
	const { noteAuthProfileHealth, noteLegacyCodexProviderOverride, noteSharedAuthStoreStatus } = await import("./doctor-auth-BjifsFh3.js");
	const { buildGatewayConnectionDetails } = await import("./call-DrX49UA-.js");
	const { note } = await loadNoteModule();
	await maybeRepairLegacyOAuthSidecarProfiles({
		cfg: ctx.cfg,
		prompter: ctx.prompter
	});
	await maybeMigrateAuthProfileJsonStoresToSqlite({
		cfg: ctx.cfg,
		prompter: ctx.prompter,
		...ctx.env ? { env: ctx.env } : {}
	});
	await maybeMigrateLegacyPluginModelCatalogs({
		cfg: ctx.cfg,
		...ctx.env ? { env: ctx.env } : {},
		prompter: ctx.prompter,
		runtime: ctx.runtime
	});
	const { maybeMigrateModelCatalogCredentials } = await import("./doctor-model-catalog-credentials-fv8adyiH.js");
	await maybeMigrateModelCatalogCredentials({
		cfg: ctx.cfg,
		...ctx.env ? { env: ctx.env } : {},
		prompter: ctx.prompter,
		runtime: ctx.runtime
	});
	ctx.cfg = await maybeRepairLegacyOAuthProfileIds(ctx.cfg, ctx.prompter);
	await noteAuthProfileHealth({
		cfg: ctx.cfg,
		prompter: ctx.prompter,
		allowKeychainPrompt: ctx.options.nonInteractive !== true && process.stdin.isTTY
	});
	noteLegacyCodexProviderOverride(ctx.cfg);
	noteSharedAuthStoreStatus(ctx.env);
	ctx.gatewayDetails = buildGatewayConnectionDetails({ config: ctx.cfg });
	if (ctx.gatewayDetails.remoteFallbackNote) note(ctx.gatewayDetails.remoteFallbackNote, "Gateway");
}
async function runGatewayAuthHealth(ctx) {
	const { resolveSecretInputRef } = await loadSecretTypesModule();
	const { buildGatewayTokenSecretRefFixHint, buildGatewayTokenSecretRefUnavailableMessage } = await loadDoctorCoreChecksModule();
	const { resolveGatewayAuth } = await import("./auth-B0hjvL5-.js");
	const { resolveGatewayAuthToken } = await import("./auth-token-resolution-B9zidYZP.js");
	const { note } = await loadNoteModule();
	const { randomToken } = await loadOnboardHelpersModule();
	if (resolveDoctorMode(ctx.cfg) !== "local" || !ctx.sourceConfigValid) return;
	const gatewayTokenRef = resolveSecretInputRef({
		value: ctx.cfg.gateway?.auth?.token,
		defaults: ctx.cfg.secrets?.defaults
	}).ref;
	const auth = resolveGatewayAuth({
		authConfig: ctx.cfg.gateway?.auth,
		tailscaleMode: ctx.cfg.gateway?.tailscale?.mode ?? "off"
	});
	const hasInlineToken = typeof auth.token === "string" && auth.token.trim() !== "";
	if (!(auth.mode !== "password" && auth.mode !== "none" && auth.mode !== "trusted-proxy" && (auth.mode !== "token" || !hasInlineToken || Boolean(gatewayTokenRef)))) return;
	let unresolvedRefReason;
	if (gatewayTokenRef && gatewayTokenRef.source === "exec") {
		const { getSkippedExecRefStaticError } = await import("./exec-resolution-policy-CO2J4WR8.js");
		if (getSkippedExecRefStaticError({
			ref: gatewayTokenRef,
			config: ctx.cfg
		})) unresolvedRefReason = void 0;
		else if (ctx.options.allowExec !== true) return;
		else {
			const resolvedToken = await resolveGatewayAuthToken({
				cfg: ctx.cfg,
				env: ctx.env ?? process.env,
				unresolvedReasonStyle: "detailed",
				envFallback: "never"
			});
			if (resolvedToken.source === "secretRef") return;
			unresolvedRefReason = resolvedToken.unresolvedRefReason;
		}
	} else {
		const resolvedToken = await resolveGatewayAuthToken({
			cfg: ctx.cfg,
			env: ctx.env ?? process.env,
			unresolvedReasonStyle: "detailed",
			envFallback: gatewayTokenRef ? "never" : "always"
		});
		if (gatewayTokenRef ? resolvedToken.source === "secretRef" : resolvedToken.token) return;
		unresolvedRefReason = resolvedToken.unresolvedRefReason;
	}
	if (gatewayTokenRef) {
		note([
			buildGatewayTokenSecretRefUnavailableMessage({
				cfg: ctx.cfg,
				ref: gatewayTokenRef,
				unresolvedRefReason
			}),
			"Doctor will not overwrite gateway.auth.token with a plaintext value.",
			buildGatewayTokenSecretRefFixHint(gatewayTokenRef)
		].join("\n"), "Gateway auth");
		return;
	}
	note("Gateway auth is off or missing a token. Token auth is now the recommended default (including loopback).", "Gateway auth");
	if (!(ctx.options.generateGatewayToken === true ? true : ctx.options.nonInteractive === true ? false : await ctx.prompter.confirmAutoFix({
		message: "Generate and configure a gateway token now?",
		initialValue: true
	}))) return;
	const nextToken = randomToken();
	ctx.cfg = {
		...ctx.cfg,
		gateway: {
			...ctx.cfg.gateway,
			auth: {
				...ctx.cfg.gateway?.auth,
				mode: "token",
				token: nextToken
			}
		}
	};
	note("Gateway token configured.", "Gateway auth");
}
async function runLegacyStateHealth(ctx) {
	const { detectLegacyStateMigrations, runLegacyStateMigrations } = await import("./doctor-state-migrations-zFpFTfYO.js");
	const { note } = await loadNoteModule();
	await runCoreContributionHealth(ctx, ["core/doctor/removed-workspaces-state"]);
	const { prepareLegacySessionSurfaces } = await import("./legacy-session-surfaces-DW7EJQe-.js");
	const legacySessionSurfaces = prepareLegacySessionSurfaces({ config: ctx.cfg });
	const doctorOnlyStateMigrations = ctx.options.repair === true || ctx.options.yes === true;
	const legacyState = await detectLegacyStateMigrations({
		cfg: ctx.cfg,
		...doctorOnlyStateMigrations ? { doctorOnlyStateMigrations: true } : {},
		legacySessionSurfaces
	});
	if (legacyState.warnings.length > 0) note(legacyState.warnings.join("\n"), "Doctor warnings");
	if (legacyState.notices.length > 0) note(legacyState.notices.join("\n"), "Doctor notices");
	if (legacyState.preview.length === 0) return;
	note(legacyState.preview.join("\n"), "Legacy state detected");
	if (!(ctx.options.nonInteractive === true ? true : await ctx.prompter.confirm({
		message: "Migrate detected legacy state now?",
		initialValue: true
	}))) return;
	const migrated = await runLegacyStateMigrations({
		detected: legacyState,
		config: ctx.cfg,
		...doctorOnlyStateMigrations ? { doctorOnlyStateMigrations: true } : {},
		recoverCorruptTargetStore: ctx.options.repair === true || ctx.options.yes === true,
		legacySessionSurfaces
	});
	if (migrated.changes.length > 0) note(migrated.changes.join("\n"), "Doctor changes");
	const notices = migrated.notices ?? [];
	if (notices.length > 0) note(notices.join("\n"), "Doctor notices");
	if (migrated.warnings.length > 0) note(migrated.warnings.join("\n"), "Doctor warnings");
}
async function runSystemdLingerHealth(ctx) {
	if (ctx.options.nonInteractive === true || process.platform !== "linux" || resolveDoctorMode(ctx.cfg) !== "local") return;
	const { resolveGatewayService } = await import("./service-D1osYpUO.js");
	const { ensureSystemdUserLingerInteractive } = await import("./systemd-linger-C7XSSfSe.js");
	const { note } = await loadNoteModule();
	const service = resolveGatewayService();
	let loaded;
	try {
		loaded = await service.isLoaded({ env: process.env });
	} catch {
		loaded = false;
	}
	if (!loaded) return;
	await ensureSystemdUserLingerInteractive({
		runtime: ctx.runtime,
		prompter: {
			confirm: async (p) => ctx.prompter.confirm(p),
			note
		},
		reason: "Gateway runs as a systemd user service. Without lingering, systemd stops the user session on logout/idle and kills the Gateway.",
		requireConfirm: true
	});
}
async function detectSystemdLingerFindings(ctx) {
	if (process.platform !== "linux" || resolveDoctorMode(ctx.cfg) !== "local") return [];
	const { resolveGatewayService } = await import("./service-D1osYpUO.js");
	const service = resolveGatewayService();
	let loaded;
	try {
		loaded = await service.isLoaded({ env: process.env });
	} catch {
		loaded = false;
	}
	if (!loaded) return [];
	const { isSystemdUserServiceAvailable, readSystemdUserLingerStatus, resolveSystemdUserServiceAccount } = await import("./systemd-CW7e5Yxp.js");
	if (!await isSystemdUserServiceAvailable(process.env)) return [];
	const user = resolveSystemdUserServiceAccount(process.env);
	if (!user) return [];
	const status = await readSystemdUserLingerStatus({
		env: process.env,
		user
	});
	if (!status || status.linger === "yes") return [];
	return [{
		checkId: "core/doctor/systemd-linger",
		severity: "warning",
		source: "doctor",
		message: `Systemd lingering is disabled for ${status.user}.`,
		target: `systemd.user.${status.user}`,
		requirement: "systemd user lingering enabled",
		fixHint: `Run: sudo loginctl enable-linger ${status.user}`
	}];
}
async function runShellCompletionHealth(ctx) {
	const { doctorShellCompletion } = await import("./doctor-completion-CteGM4gS.js");
	await doctorShellCompletion(ctx.runtime, ctx.prompter, { nonInteractive: ctx.options.nonInteractive });
}
async function runGatewayHealthChecks(ctx) {
	const { note } = await loadNoteModule();
	if (await hasActiveGatewayExecCredential(ctx) && ctx.options.allowExec !== true) {
		note("Gateway health probes skipped because gateway credentials use an exec SecretRef. Run `openclaw doctor --allow-exec` to verify Gateway health with exec SecretRefs.", "Gateway");
		ctx.gatewayHealthSkipped = true;
		ctx.gatewayMemoryProbe = {
			checked: false,
			ready: false,
			skipped: true
		};
		return;
	}
	const { checkGatewayHealth, probeGatewayMemoryStatus } = await import("./doctor-gateway-health-eOrZ7cPB.js");
	const { healthOk, authenticated, status } = await checkGatewayHealth({
		runtime: ctx.runtime,
		cfg: ctx.cfg,
		timeoutMs: ctx.options.nonInteractive === true ? 3e3 : 1e4
	});
	ctx.gatewayHealthSkipped = false;
	ctx.healthOk = healthOk;
	ctx.gatewayHealthAuthenticated = authenticated;
	ctx.gatewayStatus = status;
	ctx.gatewayMemoryProbe = authenticated ? await probeGatewayMemoryStatus({
		cfg: ctx.cfg,
		timeoutMs: ctx.options.nonInteractive === true ? 3e3 : 1e4
	}) : {
		checked: false,
		ready: false,
		skipped: healthOk
	};
}
function resolveDoctorHealthContributions() {
	return [...resolveInitialDoctorHealthContributions({
		runStructuredHealthRepairs: (ctx) => runStructuredHealthRepairs(ctx, resolveDoctorContributionHealthChecks),
		runGatewayConfigHealth,
		runAuthProfileHealth,
		runGatewayAuthHealth,
		runLegacyStateHealth
	}), ...resolveFinalDoctorHealthContributions({
		runSystemdLingerHealth,
		detectSystemdLingerFindings,
		runShellCompletionHealth,
		runGatewayHealthChecks
	})];
}
async function resolveDoctorContributionHealthChecks() {
	const { createCoreHealthChecks } = await import("./doctor-core-checks-BT-1mSih.js");
	const checksById = new Map(createCoreHealthChecks().map((check) => [check.id, check]));
	const checks = [];
	for (const contribution of resolveDoctorHealthContributions()) {
		if (contribution.healthChecks.length > 0) {
			checks.push(...contribution.healthChecks.map(normalizeHealthCheck));
			continue;
		}
		for (const id of contribution.healthCheckIds) {
			const check = checksById.get(id);
			if (check === void 0) throw new Error(`doctor contribution ${contribution.id} references unknown core health check ${id}`);
			checks.push(check);
		}
	}
	return checks;
}
async function runDoctorHealthContributionList(ctx, contributions) {
	const runWithPluginMetadataSnapshot = ctx.runWithPluginMetadataSnapshot;
	for (const contribution of contributions) try {
		if (!runWithPluginMetadataSnapshot) await contribution.run(ctx);
		else {
			const workspaceDir = resolveDoctorWorkspaceDir(ctx.cfg, ctx.env);
			await runWithPluginMetadataSnapshot({
				config: ctx.cfg,
				workspaceDir
			}, () => contribution.run(ctx));
		}
		if (ctx.configWriteDeferredByCronOwnership === true) return;
	} catch (error) {
		await (contribution.required ? Promise.reject(error) : Promise.resolve());
		const { note } = await loadNoteModule();
		note(`${contribution.id} run failed: ${scrubDoctorErrorMessage(error)}`, "Doctor warnings");
	}
}
async function runDoctorHealthContributions(ctx) {
	await runDoctorHealthContributionList(ctx, resolveDoctorHealthContributions());
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.doctorHealthContributionsTestApi")] = {
	createDoctorHealthContribution,
	resolveDoctorHealthContributions,
	runDoctorHealthContributionList
};
//#endregion
export { runDoctorHealthContributions as n, resolveDoctorContributionHealthChecks as t };
