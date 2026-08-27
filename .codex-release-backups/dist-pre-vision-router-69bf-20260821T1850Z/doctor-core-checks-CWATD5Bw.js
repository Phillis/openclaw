import { c as resolveUserPath } from "./home-dir-DcrXWQPU.js";
import "./utils-D9gvQMP6.js";
import { a as isDefaultInstallIdentity, w as resolveStateDir } from "./paths-CqeDjSA4.js";
import { n as isExperimentalClawsEnabled } from "./experimental-BMzbGmT5.js";
import "./agent-scope-D9GLFAyB.js";
import { r as listAgentEntries, x as tryResolveSoleAgentId } from "./agent-scope-config-CsnnOL14.js";
import { v as resolveSecretInputRef } from "./types.secrets-BrIfhxSG.js";
import { n as hasAmbiguousGatewayAuthModeConfig } from "./auth-mode-policy-CYlOzqkO.js";
import { t as resolveGatewayAuthToken } from "./auth-token-resolution-zfntTpM2.js";
import { n as resolveGatewayAuth } from "./auth-resolve-CAPRAoQk.js";
import "./auth-BjIfKFX2.js";
import { t as resolveSkillWorkshopConfig } from "./config-Cjp42tXL.js";
import { i as noteChromeMcpBrowserReadiness, n as maybeArchiveLegacyClawdBrowserProfileResidue, r as maybeRepairOwnedChromeExtensionNativeHosts, t as detectLegacyClawdBrowserProfileResidue } from "./doctor-browser-DeugjArJ.js";
import { n as hasConfiguredCommandOwners } from "./doctor-command-owner-Dta8GlpE.js";
import { a as shellCompletionStatusToRepairEffects, i as shellCompletionStatusToHealthFindings, t as checkShellCompletionStatus } from "./doctor-completion-DZiVTT48.js";
import { n as disableUnavailableSkillsInConfig, r as formatMissingSkillSummary } from "./doctor-skills-core-DZQVCoNO.js";
import { i as uiProtocolFreshnessIssueToRepairEffects, r as uiProtocolFreshnessIssueToHealthFinding, t as detectUiProtocolFreshnessIssues } from "./doctor-ui-D3wCST5c.js";
import { a as collectDisabledCodexPluginRouteIssues, n as collectCodexRuntimeCompatibilityWarnings } from "./codex-route-warnings-8JeVeNAr.js";
import { t as getSkippedExecRefStaticError } from "./exec-resolution-policy-B6nnj48Q.js";
import { t as detectSkillWorkshopToolPolicyDiagnostic } from "./tool-policy-diagnostic-UJvZ0kd0.js";
import { n as hasActiveGatewayExecCredential, t as resolveDoctorWorkspaceSuggestionScopes } from "./doctor-workspace-suggestion-scopes-3ytv0vRP.js";
import path from "node:path";
import { lstat, realpath, rm } from "node:fs/promises";
//#region src/flows/doctor-removed-workspaces-state-check.ts
const CHECK_ID = "core/doctor/removed-workspaces-state";
function resolveRemovedWorkspacesStateDir() {
	return path.join(resolveStateDir(process.env), "workspaces");
}
async function pathKind(target) {
	try {
		const stats = await lstat(target);
		if (stats.isDirectory()) return "directory";
		return stats.isFile() ? "file" : null;
	} catch (error) {
		if (error.code === "ENOENT") return null;
		throw error;
	}
}
async function hasRemovedWorkspacesFingerprint(target) {
	if (await pathKind(target) !== "directory") return false;
	if (await pathKind(path.join(target, "workspaces.sqlite")) === "file") return true;
	const [widgetsKind, dataKind] = await Promise.all([pathKind(path.join(target, "widgets")), pathKind(path.join(target, "data"))]);
	return widgetsKind === "directory" && dataKind === "directory";
}
async function canonicalPath(target) {
	const resolved = path.resolve(target);
	try {
		return await realpath(resolved);
	} catch (error) {
		const code = error.code;
		if (code === "ENOENT" || code === "ENOTDIR") return resolved;
		throw error;
	}
}
function isSameOrDescendant(parent, candidate) {
	const relative = path.relative(parent, candidate);
	return relative === "" || !path.isAbsolute(relative) && !relative.startsWith(`..${path.sep}`) && relative !== "..";
}
async function configuredAgentWorkspaceCollisions(cfg, target) {
	const configured = [{
		label: "agents.defaults.workspace",
		workspace: cfg.agents?.defaults?.workspace
	}, ...listAgentEntries(cfg).map((agent) => ({
		label: `agents.list.${agent.id}.workspace`,
		workspace: agent.workspace
	}))];
	const resolvedTarget = await canonicalPath(target);
	return (await Promise.all(configured.filter((entry) => typeof entry.workspace === "string" && entry.workspace.trim().length > 0).map(async (entry) => ({
		label: entry.label,
		resolvedWorkspace: await canonicalPath(resolveUserPath(entry.workspace, process.env))
	})))).filter((entry) => isSameOrDescendant(resolvedTarget, entry.resolvedWorkspace) || isSameOrDescendant(entry.resolvedWorkspace, resolvedTarget)).map((entry) => entry.label);
}
function collisionWarning(target, collisions) {
	return `Retired Workspaces plugin fingerprints remain at ${target}, but ${collisions.join(", ")} resolves to that directory or an overlapping path. Automatic removal is disabled.`;
}
function repairEffect(target, dryRun) {
	return {
		kind: "state",
		action: dryRun ? "would-remove-retired-workspaces-state" : "remove-retired-workspaces-state",
		target,
		dryRunSafe: false
	};
}
const removedWorkspacesStateCheck = {
	id: CHECK_ID,
	kind: "core",
	description: "State from the retired experimental Workspaces plugin has been removed.",
	source: "doctor",
	async detect(ctx, scope) {
		const target = resolveRemovedWorkspacesStateDir();
		const scopedPaths = new Set(scope?.paths ?? []);
		if (scopedPaths.size > 0 && !scopedPaths.has(target) || !await hasRemovedWorkspacesFingerprint(target)) return [];
		const collisions = await configuredAgentWorkspaceCollisions(ctx.cfg, target);
		if (collisions.length > 0) return [{
			checkId: CHECK_ID,
			severity: "warning",
			message: collisionWarning(target, collisions),
			path: target
		}];
		return [{
			checkId: CHECK_ID,
			severity: "warning",
			message: `Retired Workspaces plugin state remains at ${target}.`,
			path: target,
			fixHint: "Run `openclaw doctor --fix` to remove the stale plugin state."
		}];
	},
	async repair(ctx) {
		const target = resolveRemovedWorkspacesStateDir();
		if (!await hasRemovedWorkspacesFingerprint(target)) return {
			status: "skipped",
			reason: "retired Workspaces plugin fingerprints are absent",
			changes: []
		};
		const collisions = await configuredAgentWorkspaceCollisions(ctx.cfg, target);
		if (collisions.length > 0) {
			const warning = collisionWarning(target, collisions);
			return {
				status: "skipped",
				reason: warning,
				changes: [],
				warnings: [warning]
			};
		}
		const dryRun = ctx.dryRun === true;
		const effects = [repairEffect(target, dryRun)];
		if (dryRun) return {
			changes: [`Would remove retired Workspaces plugin state at ${target}.`],
			effects
		};
		await rm(target, {
			force: true,
			recursive: true
		});
		return {
			changes: [`Removed retired Workspaces plugin state at ${target}.`],
			effects
		};
	}
};
//#endregion
//#region src/flows/doctor-core-checks.ts
const BROWSER_CLAWD_PROFILE_RESIDUE_CHECK_ID = "core/doctor/browser-clawd-profile-residue";
const CODEX_SESSION_ROUTES_CHECK_ID = "core/doctor/codex-session-routes";
const FINAL_CONFIG_VALIDATION_CHECK_ID = "core/doctor/final-config-validation";
const GATEWAY_DAEMON_CHECK_ID = "core/doctor/gateway-daemon";
const GATEWAY_HEALTH_CHECK_ID = "core/doctor/gateway-health";
const GATEWAY_SERVICES_EXTRA_CHECK_ID = "core/doctor/gateway-services/extra";
const TELEGRAM_GENERAL_TOPIC_CONVERSATIONS_CHECK_ID = "core/doctor/telegram-general-topic-conversations";
const SKILL_WORKSHOP_TOOL_POLICY_CHECK_ID = "core/doctor/skill-workshop-tool-policy";
const loadDoctorCoreChecksRuntimeModule = async () => await import("./doctor-core-checks.runtime.js");
const loadDoctorWorkspaceModule = async () => await import("./doctor-workspace-CKRf8Bd3.js");
async function detectUnavailableSkillsWithRuntime(ctx) {
	const runtime = await loadDoctorCoreChecksRuntimeModule();
	return ctx.cwd ? runtime.detectUnavailableSkills(ctx.cfg, ctx.cwd) : [];
}
async function collectSecurityWarningsWithRuntime(cfg) {
	const { collectSecurityWarnings } = await import("./doctor-security-DQ2Ug9C_.js");
	return collectSecurityWarnings(cfg);
}
async function collectWorkspaceSuggestionNotesWithRuntime(workspaceDir) {
	const { collectWorkspaceBackupTip } = await import("./doctor-state-integrity-mnapil-x.js");
	const { MEMORY_SYSTEM_PROMPT, shouldSuggestMemorySystem } = await loadDoctorWorkspaceModule();
	const notes = [];
	const backupTip = collectWorkspaceBackupTip(workspaceDir);
	if (backupTip) notes.push(backupTip);
	if (await shouldSuggestMemorySystem(workspaceDir)) notes.push(MEMORY_SYSTEM_PROMPT);
	return notes;
}
async function collectRuntimeToolSchemaFindingsWithRuntime(ctx) {
	const runtime = await loadDoctorCoreChecksRuntimeModule();
	const runWithPluginMetadataSnapshot = ctx.runWithPluginMetadataSnapshot;
	return runtime.collectRuntimeToolSchemaFindings(ctx.cfg, runWithPluginMetadataSnapshot ? { runWithPluginMetadataSnapshot } : void 0);
}
async function collectProviderCatalogProjectionFindingsWithRuntime(ctx) {
	return (await loadDoctorCoreChecksRuntimeModule()).collectProviderCatalogProjectionFindings(ctx.cfg, ctx.cwd);
}
async function collectLocalAudioAccelerationFindingsWithRuntime() {
	return (await loadDoctorCoreChecksRuntimeModule()).collectLocalAudioAccelerationFindings();
}
async function collectGatewayHealthFindingsWithRuntime(ctx) {
	return (await loadDoctorCoreChecksRuntimeModule()).collectGatewayHealthFindings(ctx);
}
async function collectGatewayDaemonFindingsWithRuntime(ctx) {
	return (await loadDoctorCoreChecksRuntimeModule()).collectGatewayDaemonFindings(ctx);
}
async function listGatewayCronJobsWithRuntime(ctx) {
	if (await hasActiveGatewayExecCredential({ cfg: ctx.cfg }) && ctx.allowExecSecretRefs !== true) throw new Error("Gateway cron inventory skipped because credentials use an exec SecretRef; rerun doctor with --allow-exec.");
	const { callGateway } = await import("./call-DrR5WyUw.js");
	const jobs = [];
	let offset = 0;
	let snapshotRevision;
	let total;
	while (total === void 0 || offset < total) {
		const page = await callGateway({
			method: "cron.list",
			params: {
				includeDisabled: true,
				limit: 200,
				offset
			},
			timeoutMs: 3e3,
			config: ctx.cfg,
			deviceIdentity: null
		});
		if (!(Array.isArray(page.jobs) && typeof page.snapshotRevision === "string" && page.snapshotRevision.length > 0 && Number.isSafeInteger(page.total) && page.total >= 0 && page.offset === offset && Number.isSafeInteger(page.limit) && page.limit > 0 && typeof page.hasMore === "boolean" && (page.nextOffset === null || Number.isSafeInteger(page.nextOffset)))) throw new Error("Gateway returned an invalid cron inventory response.");
		if (snapshotRevision !== void 0 && page.snapshotRevision !== snapshotRevision || total !== void 0 && page.total !== total) throw new Error("Gateway cron inventory changed while doctor was reading it.");
		snapshotRevision ??= page.snapshotRevision;
		total ??= page.total;
		jobs.push(...page.jobs);
		if (!page.hasMore) {
			if (page.nextOffset !== null || jobs.length !== total) throw new Error("Gateway returned an inconsistent cron inventory response.");
			return jobs;
		}
		const expectedNextOffset = offset + page.jobs.length;
		if (page.nextOffset !== expectedNextOffset || expectedNextOffset <= offset || expectedNextOffset >= total) throw new Error("Gateway returned an invalid cron inventory cursor.");
		offset = expectedNextOffset;
	}
	throw new Error("Gateway returned an incomplete cron inventory response.");
}
const defaultCoreHealthCheckDeps = {
	detectUnavailableSkills: detectUnavailableSkillsWithRuntime,
	collectSecurityWarnings: collectSecurityWarningsWithRuntime,
	collectWorkspaceSuggestionNotes: collectWorkspaceSuggestionNotesWithRuntime,
	collectRuntimeToolSchemaFindings: collectRuntimeToolSchemaFindingsWithRuntime,
	collectProviderCatalogProjectionFindings: collectProviderCatalogProjectionFindingsWithRuntime,
	collectLocalAudioAccelerationFindings: collectLocalAudioAccelerationFindingsWithRuntime,
	collectGatewayHealthFindings: collectGatewayHealthFindingsWithRuntime,
	collectGatewayDaemonFindings: collectGatewayDaemonFindingsWithRuntime,
	listGatewayCronJobs: listGatewayCronJobsWithRuntime
};
function configValidationIssuesToHealthFindings(issues) {
	return issues.map((issue) => ({
		checkId: FINAL_CONFIG_VALIDATION_CHECK_ID,
		severity: "error",
		message: issue.message,
		path: issue.path || "<root>"
	}));
}
const gatewayConfigCheck = {
	id: "core/doctor/gateway-config",
	kind: "core",
	description: "openclaw.jsonc gateway block is set and unambiguous.",
	source: "doctor",
	async detect(ctx) {
		const findings = [];
		if (!ctx.cfg.gateway?.mode) findings.push({
			checkId: "core/doctor/gateway-config",
			severity: "warning",
			message: "gateway.mode is unset; gateway start will be blocked.",
			path: "gateway.mode",
			fixHint: "Run `openclaw configure` and set Gateway mode (local/remote), or `openclaw config set gateway.mode local`."
		});
		if (ctx.cfg.gateway?.mode !== "remote" && hasAmbiguousGatewayAuthModeConfig(ctx.cfg)) findings.push({
			checkId: "core/doctor/gateway-config",
			severity: "warning",
			message: "gateway.auth.token and gateway.auth.password are both configured while gateway.auth.mode is unset; auth selection is ambiguous.",
			path: "gateway.auth.mode",
			fixHint: "Set an explicit mode: `openclaw config set gateway.auth.mode token` or `... password`."
		});
		return findings;
	}
};
const commandOwnerCheck = {
	id: "core/doctor/command-owner",
	kind: "core",
	description: "An owner account is configured for owner-only commands.",
	source: "doctor",
	async detect(ctx) {
		if (hasConfiguredCommandOwners(ctx.cfg)) return [];
		return [{
			checkId: "core/doctor/command-owner",
			severity: "info",
			message: "No command owner is configured. Owner-only commands (/diagnostics, /export-trajectory, /config, exec approvals) have no allowed sender.",
			path: "commands.ownerAllowFrom",
			fixHint: "Set commands.ownerAllowFrom to your channel user id, e.g. `openclaw config set commands.ownerAllowFrom '[\"telegram:123456789\"]'`."
		}];
	}
};
const skillWorkshopToolPolicyCheck = {
	id: SKILL_WORKSHOP_TOOL_POLICY_CHECK_ID,
	kind: "core",
	description: "Autonomous Skill Workshop capture has a callable review tool.",
	source: "doctor",
	async detect(ctx) {
		const diagnostic = detectSkillWorkshopToolPolicyDiagnostic({
			config: ctx.cfg,
			workshopEnabled: resolveSkillWorkshopConfig(ctx.cfg).autonomous.mode !== "off"
		});
		if (!diagnostic) return [];
		return [{
			checkId: SKILL_WORKSHOP_TOOL_POLICY_CHECK_ID,
			severity: "warning",
			message: diagnostic.detail,
			path: diagnostic.source,
			target: diagnostic.agentId,
			requirement: "Autonomous Skill Workshop review requires the skill_workshop tool.",
			fixHint: diagnostic.fix
		}];
	}
};
function resolveDoctorMode(cfg) {
	return cfg.gateway?.mode === "remote" ? "remote" : "local";
}
function buildGatewayTokenSecretRefUnavailableMessage(params) {
	if (params.unresolvedRefReason) return `Gateway token SecretRef could not be resolved: ${params.unresolvedRefReason}`;
	if (params.ref.source === "exec") {
		const staticError = getSkippedExecRefStaticError({
			ref: params.ref,
			config: params.cfg
		});
		if (staticError) return `Gateway token SecretRef could not be verified: ${staticError}`;
		return "Gateway token SecretRef uses an exec provider and did not resolve.";
	}
	return "Gateway token is managed via SecretRef and is currently unavailable.";
}
function buildGatewayTokenSecretRefFixHint(ref) {
	if (ref.source === "exec") return "Run `openclaw doctor --allow-exec` to verify exec SecretRefs during doctor, or `openclaw secrets audit --allow-exec` to audit all exec SecretRefs.";
	return "Resolve or rotate the external secret source, then rerun doctor.";
}
const gatewayAuthCheck = {
	id: "core/doctor/gateway-auth",
	kind: "core",
	description: "Local Gateway auth mode has a usable token or another explicit auth mode.",
	source: "doctor",
	async detect(ctx) {
		if (resolveDoctorMode(ctx.cfg) !== "local") return [];
		const gatewayTokenRef = resolveSecretInputRef({
			value: ctx.cfg.gateway?.auth?.token,
			defaults: ctx.cfg.secrets?.defaults
		}).ref;
		const auth = resolveGatewayAuth({
			authConfig: ctx.cfg.gateway?.auth,
			tailscaleMode: ctx.cfg.gateway?.tailscale?.mode ?? "off"
		});
		const hasInlineToken = typeof auth.token === "string" && auth.token.trim() !== "";
		if (!(auth.mode !== "password" && auth.mode !== "none" && auth.mode !== "trusted-proxy" && (auth.mode !== "token" || !hasInlineToken || Boolean(gatewayTokenRef)))) return [];
		let unresolvedRefReason;
		if (gatewayTokenRef && gatewayTokenRef.source === "exec") if (getSkippedExecRefStaticError({
			ref: gatewayTokenRef,
			config: ctx.cfg
		})) unresolvedRefReason = void 0;
		else if (ctx.allowExecSecretRefs !== true) return [];
		else {
			const resolvedToken = await resolveGatewayAuthToken({
				cfg: ctx.cfg,
				env: process.env,
				unresolvedReasonStyle: "detailed",
				envFallback: "never"
			});
			if (resolvedToken.source === "secretRef") return [];
			unresolvedRefReason = resolvedToken.unresolvedRefReason;
		}
		else {
			const resolvedToken = await resolveGatewayAuthToken({
				cfg: ctx.cfg,
				env: process.env,
				unresolvedReasonStyle: "detailed",
				envFallback: gatewayTokenRef ? "never" : "always"
			});
			if (gatewayTokenRef ? resolvedToken.source === "secretRef" : resolvedToken.token) return [];
			unresolvedRefReason = resolvedToken.unresolvedRefReason;
		}
		if (gatewayTokenRef) return [{
			checkId: "core/doctor/gateway-auth",
			severity: "warning",
			message: buildGatewayTokenSecretRefUnavailableMessage({
				cfg: ctx.cfg,
				ref: gatewayTokenRef,
				unresolvedRefReason
			}),
			path: "gateway.auth.token",
			fixHint: buildGatewayTokenSecretRefFixHint(gatewayTokenRef)
		}];
		return [{
			checkId: "core/doctor/gateway-auth",
			severity: "warning",
			message: "Gateway auth is off or missing a token.",
			path: "gateway.auth",
			fixHint: "Run `openclaw doctor --fix --generate-gateway-token` to generate a token."
		}];
	}
};
const hooksModelCheck = {
	id: "core/doctor/hooks-model",
	kind: "core",
	description: "hooks.gmail.model resolves to an allowed catalog model.",
	source: "doctor",
	async detect(ctx) {
		if (!ctx.cfg.hooks?.gmail?.model?.trim()) return [];
		const { DEFAULT_MODEL, DEFAULT_PROVIDER } = await import("./defaults-RjT9WtG0.js");
		const { loadPreparedModelCatalog } = await import("./prepared-model-catalog-BnhcKv7r.js");
		const { getModelRefStatus, resolveConfiguredModelRef, resolveHooksGmailModel } = await import("./model-selection-oGawnPze.js");
		const hooksModelRef = resolveHooksGmailModel({
			cfg: ctx.cfg,
			defaultProvider: DEFAULT_PROVIDER
		});
		if (!hooksModelRef) return [{
			checkId: "core/doctor/hooks-model",
			severity: "warning",
			message: `hooks.gmail.model "${ctx.cfg.hooks.gmail.model}" could not be resolved.`,
			path: "hooks.gmail.model"
		}];
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
		const findings = [];
		if (!status.allowed) findings.push({
			checkId: "core/doctor/hooks-model",
			severity: "warning",
			message: `hooks.gmail.model "${status.key}" is not allowed by agents.defaults.modelPolicy.allow.`,
			path: "hooks.gmail.model",
			fixHint: "Add the model or its provider wildcard to agents.defaults.modelPolicy.allow, or remove hooks.gmail.model."
		});
		if (!status.inCatalog) findings.push({
			checkId: "core/doctor/hooks-model",
			severity: "warning",
			message: `hooks.gmail.model "${status.key}" is not in the model catalog.`,
			path: "hooks.gmail.model",
			fixHint: "Choose a model from the configured provider catalog."
		});
		return findings;
	}
};
const legacyStateCheck = {
	id: "core/doctor/legacy-state",
	kind: "core",
	description: "Legacy sessions, agent state, and channel auth paths have been migrated.",
	source: "doctor",
	defaultEnabled: false,
	async detect(ctx) {
		const { detectLegacyStateMigrations } = await import("./doctor-state-migrations-CZltBM2v.js");
		const { prepareLegacySessionSurfaces } = await import("./legacy-session-surfaces-onyxF9z6.js");
		const legacySessionSurfaces = prepareLegacySessionSurfaces({ config: ctx.cfg });
		const detected = await detectLegacyStateMigrations({
			cfg: ctx.cfg,
			doctorOnlyStateMigrations: true,
			legacySessionSurfaces
		});
		return [...detected.preview.map((line) => ({
			checkId: "core/doctor/legacy-state",
			severity: "warning",
			message: line.replace(/^- /, ""),
			path: detected.stateDir,
			fixHint: "Run `openclaw doctor --fix` to migrate legacy state."
		})), ...detected.warnings.map((warning) => ({
			checkId: "core/doctor/legacy-state",
			severity: "warning",
			message: warning,
			path: detected.stateDir,
			fixHint: "Resolve the warning, then rerun `openclaw doctor --fix`."
		}))];
	}
};
const bootstrapSizeCheck = {
	id: "core/doctor/bootstrap-size",
	kind: "core",
	description: "Workspace bootstrap files fit within configured injection limits.",
	source: "doctor",
	async detect(ctx) {
		if (!ctx.cwd) return [];
		const { buildBootstrapInjectionStats, analyzeBootstrapBudget } = await import("./bootstrap-budget-BEC2_2JU.js");
		const { resolveBootstrapContextForRun } = await import("./bootstrap-files-D6eutqha.js");
		const { resolveBootstrapMaxChars, resolveBootstrapTotalMaxChars } = await import("./embedded-agent-helpers-CyYI-19q.js");
		const defaultAgentId = tryResolveSoleAgentId(ctx.cfg);
		const workspaceDir = ctx.cwd;
		const { bootstrapFiles, contextFiles } = await resolveBootstrapContextForRun({
			workspaceDir,
			config: ctx.cfg,
			agentId: defaultAgentId
		});
		const analysis = analyzeBootstrapBudget({
			files: buildBootstrapInjectionStats({
				bootstrapFiles,
				injectedFiles: contextFiles
			}),
			bootstrapMaxChars: resolveBootstrapMaxChars(ctx.cfg, defaultAgentId),
			bootstrapTotalMaxChars: resolveBootstrapTotalMaxChars(ctx.cfg, defaultAgentId)
		});
		const findings = [];
		for (const file of analysis.truncatedFiles) findings.push({
			checkId: "core/doctor/bootstrap-size",
			severity: "warning",
			message: `${file.name} exceeds bootstrap limits and will be truncated.`,
			path: file.path,
			fixHint: "Reduce the file size or tune `agents.entries.*.bootstrapMaxChars` / `bootstrapTotalMaxChars` for this agent, or the corresponding `agents.defaults.*` fallback."
		});
		for (const file of analysis.nearLimitFiles) {
			if (file.truncated) continue;
			findings.push({
				checkId: "core/doctor/bootstrap-size",
				severity: "info",
				message: `${file.name} is near the configured bootstrap file limit.`,
				path: file.path,
				fixHint: "Reduce the file size or tune `agents.entries.*.bootstrapMaxChars` for this agent, or `agents.defaults.bootstrapMaxChars` as fallback, for per-file limits."
			});
		}
		if (analysis.totalNearLimit) findings.push({
			checkId: "core/doctor/bootstrap-size",
			severity: analysis.hasTruncation ? "warning" : "info",
			message: "Total bootstrap context is near the configured total limit.",
			path: workspaceDir,
			fixHint: "Reduce bootstrap file sizes or tune `agents.entries.*.bootstrapTotalMaxChars` for this agent, or `agents.defaults.bootstrapTotalMaxChars` as fallback."
		});
		return findings;
	}
};
function createRuntimeToolSchemaCheck(deps) {
	return {
		id: "core/doctor/runtime-tool-schemas",
		kind: "core",
		description: "Active agent tool schemas project into model/runtime-compatible tool inputs.",
		source: "doctor",
		async detect(ctx) {
			return deps.collectRuntimeToolSchemaFindings(ctx);
		}
	};
}
function createProviderCatalogProjectionCheck(deps) {
	return {
		id: "core/doctor/provider-catalog-projection",
		kind: "core",
		description: "Provider catalog hooks project into unified text model catalog rows.",
		source: "doctor",
		async detect(ctx) {
			return deps.collectProviderCatalogProjectionFindings(ctx);
		}
	};
}
function normalizeDoctorNoteLine(line) {
	return line.replace(/^- /, "").trim();
}
function noteTextToFinding(params) {
	const lines = params.text.split("\n");
	const first = normalizeDoctorNoteLine(lines[0] ?? params.text);
	const rest = lines.slice(1).join("\n");
	return {
		checkId: params.checkId,
		severity: params.severity,
		message: first,
		...params.target ? { target: params.target } : {},
		...rest ? { fixHint: rest } : {}
	};
}
function inferCapturedNoteSeverity(text) {
	if (text.includes("CRITICAL")) return "error";
	if (text.includes("- Fix:") || text.includes("unavailable") || text.includes("not found") || text.includes("missing") || text.includes("not readable") || text.includes("not writable") || text.includes("readonly")) return "warning";
	return "info";
}
function createNoteCollector(checkId) {
	const findings = [];
	const noteFn = (message) => {
		const text = noteMessageToText(message);
		if (!text.trim()) return;
		const severity = inferCapturedNoteSeverity(text);
		if (severity === "info") return;
		findings.push(noteTextToFinding({
			checkId,
			severity,
			text
		}));
	};
	return {
		findings,
		noteFn
	};
}
function noteMessageToText(message) {
	if (message instanceof Error) return message.message;
	if (message == null) return "";
	if (typeof message === "string") return message;
	if (typeof message === "number" || typeof message === "boolean" || typeof message === "bigint") return String(message);
	try {
		return JSON.stringify(message) ?? "";
	} catch {
		return "";
	}
}
const claudeCliCheck = {
	id: "core/doctor/claude-cli",
	kind: "core",
	description: "Claude CLI readiness is captured as structured findings.",
	source: "doctor",
	async detect(ctx) {
		const { noteClaudeCliHealth } = await import("./doctor-claude-cli-B-VW3kd0.js");
		const collector = createNoteCollector("core/doctor/claude-cli");
		noteClaudeCliHealth(ctx.cfg, {
			noteFn: collector.noteFn,
			...ctx.cwd ? { workspaceDir: ctx.cwd } : {}
		});
		return collector.findings;
	}
};
function createSecurityCheck(deps) {
	return {
		id: "core/doctor/security",
		kind: "core",
		description: "Security posture checks produce structured findings.",
		source: "doctor",
		async detect(ctx) {
			return (await deps.collectSecurityWarnings(ctx.cfg)).map((warning) => noteTextToFinding({
				checkId: "core/doctor/security",
				severity: warning.includes("CRITICAL") ? "error" : "warning",
				text: warning
			}));
		}
	};
}
const openAIOAuthTlsCheck = {
	id: "core/doctor/oauth-tls",
	kind: "core",
	description: "OpenAI OAuth TLS prerequisites are satisfied before browser auth.",
	source: "doctor",
	async detect(ctx) {
		const { formatOpenAIOAuthTlsPreflightFix, runOpenAIOAuthTlsPreflight, shouldRunOpenAIOAuthTlsPrerequisites } = await import("./provider-openai-chatgpt-oauth-tls-B11xQZco.js");
		if (!shouldRunOpenAIOAuthTlsPrerequisites({
			cfg: ctx.cfg,
			deep: ctx.mode === "doctor"
		})) return [];
		const result = await runOpenAIOAuthTlsPreflight({ timeoutMs: 4e3 });
		if (result.ok || result.kind !== "tls-cert") return [];
		return [noteTextToFinding({
			checkId: "core/doctor/oauth-tls",
			severity: "warning",
			text: formatOpenAIOAuthTlsPreflightFix(result)
		})];
	}
};
const legacyWhatsAppCrontabCheck = {
	id: "core/doctor/legacy-whatsapp-crontab",
	kind: "core",
	description: "Legacy WhatsApp crontab health entries are detected as structured findings.",
	source: "doctor",
	defaultEnabled: false,
	async detect() {
		const { collectLegacyWhatsAppCrontabHealthWarning } = await import("./cron-CDPzIeGY.js");
		const warning = await collectLegacyWhatsAppCrontabHealthWarning();
		if (!warning) return [];
		return [noteTextToFinding({
			checkId: "core/doctor/legacy-whatsapp-crontab",
			severity: "warning",
			text: warning
		})];
	}
};
const legacyCronStoreCheck = {
	id: "core/doctor/legacy-cron-store",
	kind: "core",
	description: "Legacy cron store, run-log, and payload state is normalized.",
	source: "doctor",
	defaultEnabled: false,
	async detect(ctx) {
		const { collectLegacyCronStoreHealthFindings } = await import("./cron-CDPzIeGY.js");
		return collectLegacyCronStoreHealthFindings({ cfg: ctx.cfg });
	}
};
const codexSessionRoutesCheck = {
	id: CODEX_SESSION_ROUTES_CHECK_ID,
	kind: "core",
	description: "Codex runtime routes are compatible with the configured plugin harness.",
	source: "doctor",
	async detect(ctx) {
		const disabledPluginFindings = collectDisabledCodexPluginRouteIssues(ctx.cfg, ctx.env).map((issue) => ({
			checkId: CODEX_SESSION_ROUTES_CHECK_ID,
			severity: "warning",
			message: [`${issue.path} routes ${issue.modelRef} to ${issue.canonicalModel}`, "with Codex runtime, but the Codex plugin is disabled by config."].join(" "),
			path: issue.path,
			target: issue.canonicalModel,
			requirement: "Codex plugin enabled for routes that use the Codex runtime.",
			fixHint: issue.repairBlocked ? ["Enable plugins.entries.codex and plugin loading, and remove codex from plugins.deny;", "or set the affected OpenAI models to an OpenClaw runtime policy."].join(" ") : ["Run `openclaw doctor --fix`: it enables plugins.entries.codex,", "or set the affected OpenAI models to an OpenClaw runtime policy."].join(" ")
		}));
		const compatibilityFindings = collectCodexRuntimeCompatibilityWarnings(ctx.cfg, ctx.env).map((text) => noteTextToFinding({
			checkId: CODEX_SESSION_ROUTES_CHECK_ID,
			severity: "warning",
			text
		}));
		return [...disabledPluginFindings, ...compatibilityFindings];
	}
};
const telegramGeneralTopicConversationsCheck = {
	id: TELEGRAM_GENERAL_TOPIC_CONVERSATIONS_CHECK_ID,
	kind: "core",
	description: "Telegram General-topic conversation bindings use the canonical chat target.",
	source: "doctor",
	async detect(ctx) {
		const { detectTelegramGeneralTopicConversationRepairs } = await import("./doctor-telegram-general-topic-conversations-Cq4OSJoG.js");
		return detectTelegramGeneralTopicConversationRepairs({
			cfg: ctx.cfg,
			...ctx.env ? { env: ctx.env } : {}
		}).map((repair) => ({
			checkId: TELEGRAM_GENERAL_TOPIC_CONVERSATIONS_CHECK_ID,
			severity: "warning",
			message: `Agent ${repair.agentId} has a stale Telegram General-topic conversation identity.`,
			target: repair.agentId,
			requirement: "One canonical chat-scoped conversation binding for Telegram General topic.",
			fixHint: "Run `openclaw doctor --fix` to merge the stale topic-qualified identity."
		}));
	},
	async repair(ctx) {
		const { repairTelegramGeneralTopicConversations } = await import("./doctor-telegram-general-topic-conversations-Cq4OSJoG.js");
		const effect = {
			kind: "state",
			action: ctx.dryRun ? "would-merge-stale-bindings" : "merge-stale-bindings",
			target: "Telegram General topic conversations",
			dryRunSafe: false
		};
		if (ctx.dryRun) return {
			changes: ["Would merge stale Telegram General-topic identities."],
			effects: [effect]
		};
		const repaired = await repairTelegramGeneralTopicConversations({
			cfg: ctx.cfg,
			...ctx.env ? { env: ctx.env } : {}
		});
		return {
			changes: [`Merged ${repaired} stale Telegram General-topic conversation identity row(s).`],
			effects: repaired > 0 ? [effect] : []
		};
	}
};
const gatewayServicesExtraCheck = {
	id: GATEWAY_SERVICES_EXTRA_CHECK_ID,
	kind: "core",
	description: "Extra gateway-like services are represented as structured findings.",
	source: "doctor",
	async detect(ctx) {
		const coreCtx = ctx;
		const { detectExtraGatewayServiceIssues, extraGatewayServiceToHealthFinding } = await import("./doctor-gateway-services-Bg-afBmD.js");
		return (await detectExtraGatewayServiceIssues({ deep: coreCtx.deep === true })).map(extraGatewayServiceToHealthFinding);
	},
	async repair(ctx) {
		const coreCtx = ctx;
		const { detectExtraGatewayServiceIssues, extraGatewayServiceToRepairEffects } = await import("./doctor-gateway-services-Bg-afBmD.js");
		const effects = (await detectExtraGatewayServiceIssues({ deep: coreCtx.deep === true })).flatMap(extraGatewayServiceToRepairEffects);
		if (ctx.dryRun === true) return {
			status: "repaired",
			changes: [],
			effects
		};
		return {
			status: "skipped",
			reason: "legacy doctor gateway service contribution owns cleanup",
			changes: [],
			effects
		};
	}
};
const gatewayPlatformNotesCheck = {
	id: "core/doctor/gateway-services/platform-notes",
	kind: "core",
	description: "Gateway platform notes are captured as structured findings.",
	source: "doctor",
	async detect(ctx) {
		if (!isDefaultInstallIdentity(process.env)) return [];
		const { collectMacGatewayPlatformWarnings } = await import("./doctor-platform-notes-Qj2vD7er.js");
		return (await collectMacGatewayPlatformWarnings(ctx.cfg)).map((warning) => noteTextToFinding({
			checkId: "core/doctor/gateway-services/platform-notes",
			severity: "warning",
			text: warning
		}));
	}
};
function createGatewayHealthCheck(deps) {
	return {
		id: GATEWAY_HEALTH_CHECK_ID,
		kind: "core",
		description: "Gateway reachability is represented as structured findings.",
		source: "doctor",
		defaultEnabled: false,
		async detect(ctx) {
			return deps.collectGatewayHealthFindings(ctx);
		}
	};
}
function createGatewayDaemonCheck(deps) {
	return {
		id: GATEWAY_DAEMON_CHECK_ID,
		kind: "core",
		description: "Local Gateway daemon service state is represented as structured findings.",
		source: "doctor",
		defaultEnabled: false,
		async detect(ctx) {
			return deps.collectGatewayDaemonFindings(ctx);
		}
	};
}
const browserCheck = {
	id: "core/doctor/browser",
	kind: "core",
	description: "Browser readiness is captured as structured findings.",
	source: "doctor",
	async detect(ctx) {
		const collector = createNoteCollector("core/doctor/browser");
		await noteChromeMcpBrowserReadiness(ctx.cfg, { noteFn: collector.noteFn });
		return collector.findings;
	},
	async repair(ctx) {
		if (ctx.dryRun === true) return {
			status: "skipped",
			reason: "native-host repair requires filesystem writes",
			changes: []
		};
		const result = await maybeRepairOwnedChromeExtensionNativeHosts();
		return {
			...result.changes.length === 0 && result.warnings.length > 0 ? {
				status: "failed",
				reason: result.warnings.join("; ")
			} : {},
			changes: result.changes,
			warnings: result.warnings
		};
	}
};
function createSkillsReadinessCheck(deps) {
	const detectUnavailableSkills = async (ctx) => {
		const runWithPluginMetadataSnapshot = ctx.runWithPluginMetadataSnapshot;
		const detect = ctx.cwd ? () => deps.detectUnavailableSkills(ctx) : async () => [];
		if (!runWithPluginMetadataSnapshot) return await detect();
		return await runWithPluginMetadataSnapshot({
			config: ctx.cfg,
			workspaceDir: ctx.cwd
		}, detect);
	};
	return {
		id: "core/doctor/skills-readiness",
		kind: "core",
		description: "Allowed skills are usable in the current runtime environment.",
		source: "doctor",
		defaultEnabled: false,
		async detect(ctx, scope) {
			return filterUnavailableSkillsForScope(await detectUnavailableSkills(ctx), scope?.paths).map(unavailableSkillToFinding);
		},
		async repair(ctx, findings) {
			const unavailable = filterUnavailableSkillsForScope(await detectUnavailableSkills(ctx), findings.map((finding) => finding.path));
			if (unavailable.length === 0) return { changes: [] };
			return {
				config: disableUnavailableSkillsInConfig(ctx.cfg, unavailable),
				changes: unavailable.map((skill) => `Disabled unavailable skill ${skill.name}.`),
				effects: unavailable.map((skill) => ({
					kind: "config",
					action: ctx.dryRun === true ? "would-disable-skill" : "disable-skill",
					target: skillReadinessPath(skill),
					dryRunSafe: true
				}))
			};
		}
	};
}
function unavailableSkillToFinding(skill) {
	return {
		checkId: "core/doctor/skills-readiness",
		severity: "warning",
		message: `${skill.name} is allowed but unavailable: ${formatMissingSkillSummary(skill)}.`,
		path: skillReadinessPath(skill),
		fixHint: "Install/configure the missing requirement, or run `openclaw doctor --fix` to disable unused unavailable skills."
	};
}
function filterUnavailableSkillsForScope(unavailable, paths) {
	const scopedPaths = new Set(paths?.filter((pathLocal) => pathLocal !== void 0) ?? []);
	if (scopedPaths.size === 0) return [...unavailable];
	return unavailable.filter((skill) => scopedPaths.has(skillReadinessPath(skill)));
}
function skillReadinessPath(skill) {
	return `skills.entries.${skill.skillKey}.enabled`;
}
function browserResidueDeps(ctx) {
	return ctx.configPath ? { configDir: path.dirname(ctx.configPath) } : {};
}
function browserResidueFinding(residue) {
	return {
		checkId: BROWSER_CLAWD_PROFILE_RESIDUE_CHECK_ID,
		severity: "warning",
		message: `Legacy managed browser profile residue was found at ${residue.legacyProfileDir}.`,
		path: residue.legacyProfileDir,
		ocPath: "oc://state/browser/clawd",
		fixHint: "Run `openclaw doctor --fix` to archive the stale clawd profile safely instead of deleting it in place."
	};
}
function formatWouldArchiveBrowserResidue(residue) {
	return [
		"Would archive legacy clawd managed browser profile residue.",
		`- legacy profile: ${residue.legacyProfileDir}`,
		`- canonical profile: ${residue.canonicalUserDataDir}`
	].join("\n");
}
const browserClawdProfileResidueCheck = {
	id: BROWSER_CLAWD_PROFILE_RESIDUE_CHECK_ID,
	kind: "core",
	description: "Legacy clawd managed browser profile residue has been archived after the OpenClaw rename.",
	source: "doctor",
	async detect(ctx, scope) {
		const residue = await detectLegacyClawdBrowserProfileResidue(ctx.cfg, browserResidueDeps(ctx));
		if (!residue) return [];
		const scopedPaths = new Set(scope?.paths ?? []);
		if (scopedPaths.size > 0 && !scopedPaths.has(residue.legacyProfileDir)) return [];
		return [browserResidueFinding(residue)];
	},
	async repair(ctx) {
		const residue = await detectLegacyClawdBrowserProfileResidue(ctx.cfg, browserResidueDeps(ctx));
		if (!residue) return {
			status: "skipped",
			reason: "legacy clawd browser profile residue no longer exists",
			changes: []
		};
		const effect = {
			kind: "state",
			action: ctx.dryRun === true ? "would-archive-legacy-browser-profile-residue" : "archive-legacy-browser-profile-residue",
			target: residue.legacyProfileDir,
			dryRunSafe: false
		};
		if (ctx.dryRun === true) return {
			changes: [formatWouldArchiveBrowserResidue(residue)],
			effects: [effect]
		};
		const result = await maybeArchiveLegacyClawdBrowserProfileResidue(ctx.cfg, browserResidueDeps(ctx));
		if (result.changes.length === 0 && result.warnings.length > 0) return {
			status: "failed",
			reason: result.warnings.join("; "),
			changes: [],
			warnings: result.warnings,
			effects: []
		};
		return {
			changes: result.changes,
			warnings: result.warnings,
			effects: result.changes.length > 0 ? [effect] : []
		};
	}
};
const finalConfigValidationCheck = {
	id: FINAL_CONFIG_VALIDATION_CHECK_ID,
	kind: "core",
	description: "Active openclaw.jsonc parses and conforms to the config schema.",
	source: "doctor",
	async detect() {
		const { readConfigFileSnapshot } = await import("./config/config.js");
		const snap = await readConfigFileSnapshot({ observe: false });
		if (!snap.exists || snap.valid) return [];
		return configValidationIssuesToHealthFindings(snap.issues);
	}
};
const shellCompletionCheck = {
	id: "core/doctor/shell-completion",
	kind: "core",
	description: "Shell completion uses the cached completion path when configured.",
	source: "doctor",
	async detect() {
		return shellCompletionStatusToHealthFindings(await checkShellCompletionStatus());
	},
	async repair(ctx) {
		const effects = shellCompletionStatusToRepairEffects(await checkShellCompletionStatus());
		if (ctx.dryRun === true) return {
			status: "repaired",
			changes: [],
			effects
		};
		return {
			status: "skipped",
			reason: "legacy doctor shell-completion repair owns real mutations",
			changes: [],
			effects
		};
	}
};
const uiProtocolFreshnessCheck = {
	id: "core/doctor/ui-protocol-freshness",
	kind: "core",
	description: "Control UI assets are present and current with the Gateway protocol schema.",
	source: "doctor",
	async detect() {
		return (await detectUiProtocolFreshnessIssues()).map(uiProtocolFreshnessIssueToHealthFinding);
	},
	async repair(ctx) {
		const effects = (await detectUiProtocolFreshnessIssues()).flatMap(uiProtocolFreshnessIssueToRepairEffects);
		if (ctx.dryRun === true) return {
			status: "repaired",
			changes: [],
			effects
		};
		return {
			status: "skipped",
			reason: "legacy doctor UI freshness repair owns real mutations",
			changes: [],
			effects
		};
	}
};
function createWorkspaceSuggestionsCheck(deps) {
	return {
		id: "core/doctor/workspace-suggestions",
		kind: "core",
		description: "Workspace backup and memory-system suggestions are captured as structured findings.",
		defaultEnabled: false,
		source: "doctor",
		async detect(ctx) {
			const scopes = resolveDoctorWorkspaceSuggestionScopes(ctx.cfg);
			return (await Promise.all(scopes.map(async ({ agentId, workspaceDir, labelAgent }) => {
				const prefix = labelAgent ? `Agent "${agentId}": ` : "";
				return (await deps.collectWorkspaceSuggestionNotes(workspaceDir)).map((text) => noteTextToFinding({
					checkId: "core/doctor/workspace-suggestions",
					severity: "info",
					text: `${prefix}${text}`,
					...labelAgent ? { target: agentId } : {}
				}));
			}))).flat();
		}
	};
}
function createConvertedWorkflowChecks(deps) {
	return [
		claudeCliCheck,
		gatewayAuthCheck,
		legacyStateCheck,
		removedWorkspacesStateCheck,
		legacyWhatsAppCrontabCheck,
		legacyCronStoreCheck,
		codexSessionRoutesCheck,
		telegramGeneralTopicConversationsCheck,
		shellCompletionCheck,
		uiProtocolFreshnessCheck,
		gatewayServicesExtraCheck,
		gatewayPlatformNotesCheck,
		createGatewayHealthCheck(deps),
		createGatewayDaemonCheck(deps),
		createSecurityCheck(deps),
		browserCheck,
		openAIOAuthTlsCheck,
		hooksModelCheck,
		bootstrapSizeCheck,
		createProviderCatalogProjectionCheck(deps),
		{
			id: "core/doctor/local-audio-acceleration",
			kind: "core",
			description: "Local STT auto-selection and acceleration evidence are visible.",
			source: "doctor",
			async detect() {
				return await deps.collectLocalAudioAccelerationFindings();
			}
		},
		createRuntimeToolSchemaCheck(deps),
		createWorkspaceSuggestionsCheck(deps),
		skillWorkshopToolPolicyCheck,
		...isExperimentalClawsEnabled() ? [{
			id: "core/doctor/claws-state",
			kind: "core",
			description: "Claw lifecycle ownership and managed resources are consistent.",
			defaultEnabled: false,
			source: "doctor",
			async detect(ctx) {
				const [{ collectClawStateHealthFindings }, { listConfiguredMcpServers }] = await Promise.all([import("./doctor-Bw2DXxdb.js"), import("./mcp-config-DOU9IltT.js")]);
				return await collectClawStateHealthFindings({
					cfg: ctx.cfg,
					env: process.env,
					listMcpServers: listConfiguredMcpServers,
					cronGateway: { list: async () => await deps.listGatewayCronJobs(ctx) }
				});
			}
		}] : []
	];
}
function createCoreHealthChecks(deps = defaultCoreHealthCheckDeps) {
	return [
		gatewayConfigCheck,
		...createConvertedWorkflowChecks(deps),
		commandOwnerCheck,
		createSkillsReadinessCheck(deps),
		browserClawdProfileResidueCheck,
		finalConfigValidationCheck
	];
}
const CORE_HEALTH_CHECKS = createCoreHealthChecks();
//#endregion
export { createCoreHealthChecks as a, configValidationIssuesToHealthFindings as i, buildGatewayTokenSecretRefFixHint as n, buildGatewayTokenSecretRefUnavailableMessage as r, CORE_HEALTH_CHECKS as t };
