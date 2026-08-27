import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { n as isTruthyEnvValue } from "./env-ChWDbSFK.js";
import { v as resolveSecretInputRef } from "./types.secrets-Bre8L6Ts.js";
import { _ as resolveGatewayPort, a as isDefaultInstallIdentity, y as resolveIsNixMode } from "./paths-BBSTUjD5.js";
import { n as NON_DEFAULT_INSTALL_SERVICE_SKIP_REASON } from "./gateway-supervision-C0L8fX98.js";
import { r as replaceConfigFile } from "./mutate-BjBakg7Z.js";
import "./config-B_0xOnKq.js";
import { i as readWindowsProcessArgsSync } from "./windows-port-pids-Dw25m5j1.js";
import { C as isSystemdUnitActive, a as isSystemUnitActiveAndEnabled, r as findSystemdGatewayInstallation } from "./systemd-scope-Dt6qzIxA.js";
import { t as OPENCLAW_WRAPPER_ENV_KEY } from "./program-args-DPGT6RM4.js";
import { c as normalizeServiceEnvKey, d as readManagedServiceEnvKeysFromEnvironment } from "./service-managed-env-D38lJbxp.js";
import { t as buildGatewayInstallPlan } from "./daemon-install-helpers-DoMAs6SE.js";
import { n as inspectGatewayHeapLimit, t as formatGatewayHeapLimitReport } from "./gateway-heap-BfwKOqCU.js";
import { d as SERVICE_PROXY_ENV_KEYS, r as renderSystemNodeWarning, s as resolveSystemNodeInfo } from "./runtime-paths-BWwciIgl.js";
import { i as resolveGatewayDaemonRuntime } from "./daemon-runtime-DMPJy4HP.js";
import { t as resolveGatewayAuthToken } from "./auth-token-resolution-DK7WyWXU.js";
import { h as isLaunchctlNotLoaded, p as execLaunchctl } from "./launchd-system-4KAEGLKr.js";
import { c as uninstallLegacySystemdUnits, g as resolveManagedGatewayServiceCommand, h as hasGatewayServiceLauncherOverride, l as uninstallUserSystemdGatewayUnit, m as hasGatewayServiceEnvironmentOverride } from "./systemd-fY9j-7P4.js";
import { a as readEmbeddedGatewayToken, i as needsNodeRuntimeMigration, n as auditGatewayServiceConfig, t as SERVICE_AUDIT_CODES } from "./service-audit-CTe7YK1F.js";
import { o as resolveGatewayService } from "./service-BYLPjc81.js";
import { d as readWindowsStartupFallbackRuntimeForUpdate } from "./schtasks-CCsMuBUU.js";
import { i as renderGatewayServiceCleanupHints, n as findExtraGatewayServices } from "./inspect-Dd_Zh1yU.js";
import { t as note } from "./note-YH_0kY-3.js";
import { i as UPDATE_PARENT_ALLOWS_GATEWAY_SERVICE_REPAIR_ENV, r as UPDATE_PARENT_ALLOWS_GATEWAY_ACTIVATION_ENV } from "./update-phase-CUQAfBmE.js";
import { t as summarizeGatewayServiceLayout } from "./service-layout-CQRBnufE.js";
import { a as resolveServiceRepairPolicy, i as isServiceRepairExternallyManaged, o as shouldManageGatewayService, r as confirmDoctorServiceRepair, t as EXTERNAL_SERVICE_REPAIR_NOTE } from "./doctor-service-repair-policy-DH8LJx_0.js";
import { t as isDoctorUpdateRepairMode } from "./doctor-repair-mode-B7-Votzc.js";
import os from "node:os";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/commands/doctor-gateway-auth-token.ts
/**
* Resolves the token a managed gateway service can receive at install/update time.
*
* Exec SecretRefs are skipped by default because the service installer cannot safely evaluate
* arbitrary commands. Configured SecretRefs never fall back to ambient credentials.
*/
async function resolveGatewayAuthTokenForService(cfg, env, options = {}) {
	if (resolveSecretInputRef({
		value: cfg.gateway?.auth?.token,
		defaults: cfg.secrets?.defaults
	}).ref?.source === "exec" && options.allowExecSecretRefs !== true) return { unavailableReason: "gateway.auth.token SecretRef is configured but unavailable because exec SecretRef resolution is disabled." };
	const resolved = await resolveGatewayAuthToken({
		cfg,
		env,
		unresolvedReasonStyle: "detailed"
	});
	if (resolved.token) return { token: resolved.token };
	if (!resolved.secretRefConfigured) return {};
	if (resolved.unresolvedRefReason?.includes("resolved to an empty value")) return { unavailableReason: resolved.unresolvedRefReason };
	return { unavailableReason: `gateway.auth.token SecretRef is configured but unresolved (${resolved.unresolvedRefReason ?? "unknown reason"}).` };
}
//#endregion
//#region src/commands/doctor-gateway-services.ts
/** Doctor repairs for installed gateway service config and duplicate legacy services. */
function shouldSkipLegacyUpdateRepairConfigWrite(env) {
	return isTruthyEnvValue(env["OPENCLAW_UPDATE_IN_PROGRESS"]) && !isTruthyEnvValue(env["OPENCLAW_UPDATE_PARENT_SUPPORTS_DOCTOR_CONFIG_WRITE"]);
}
function updateParentAllowsGatewayActivation(env) {
	const activationPolicy = env[UPDATE_PARENT_ALLOWS_GATEWAY_ACTIVATION_ENV];
	if (activationPolicy !== void 0) return isTruthyEnvValue(activationPolicy);
	const parentArgs = readWindowsProcessArgsSync(process.ppid, 1500);
	if (parentArgs === null) return false;
	const normalizedParentArgs = parentArgs.map(normalizeLowercaseStringOrEmpty);
	const updateIndex = Math.max(normalizedParentArgs.lastIndexOf("update"), normalizedParentArgs.lastIndexOf("--update"));
	const legacyDoctorUpdateParent = normalizedParentArgs.lastIndexOf("doctor") >= 0;
	const legacyWizardParent = updateIndex >= 0 && normalizedParentArgs[updateIndex + 1] === "wizard";
	return (updateIndex >= 0 || legacyDoctorUpdateParent) && !legacyWizardParent && !normalizedParentArgs.includes("--no-restart");
}
function updateParentAllowsGatewayServiceRepair(env) {
	const repairPolicy = env[UPDATE_PARENT_ALLOWS_GATEWAY_SERVICE_REPAIR_ENV];
	return repairPolicy !== void 0 && isTruthyEnvValue(repairPolicy);
}
const EXECSTART_REPAIR_CODES = /* @__PURE__ */ new Set([SERVICE_AUDIT_CODES.gatewayCommandMissing, SERVICE_AUDIT_CODES.gatewayEntrypointMismatch]);
const DOCTOR_LAUNCHCTL_TIMEOUT_MS = 5e3;
const DOCTOR_LAUNCHCTL_CONFIRM_POLL_MS = 100;
async function confirmLegacyLaunchdServiceUnloaded(serviceTarget) {
	const deadline = Date.now() + DOCTOR_LAUNCHCTL_TIMEOUT_MS;
	while (Date.now() < deadline) {
		const remainingMs = Math.max(1, deadline - Date.now());
		const probe = await execLaunchctl(["print", serviceTarget], Math.min(DOCTOR_LAUNCHCTL_TIMEOUT_MS, remainingMs));
		if (probe.code !== 0) return isLaunchctlNotLoaded(probe);
		const delayMs = Math.min(DOCTOR_LAUNCHCTL_CONFIRM_POLL_MS, deadline - Date.now());
		if (delayMs <= 0) break;
		await new Promise((resolve) => {
			setTimeout(resolve, delayMs);
		});
	}
	return false;
}
const GATEWAY_SERVICES_EXTRA_CHECK_ID = "core/doctor/gateway-services/extra";
function findGatewayEntrypoint(programArguments) {
	if (!programArguments || programArguments.length === 0) return null;
	const gatewayIndex = programArguments.indexOf("gateway");
	if (gatewayIndex <= 0) return null;
	return programArguments[gatewayIndex - 1] ?? null;
}
async function buildExpectedGatewayServicePlan(params) {
	return buildGatewayInstallPlan({
		env: params.serviceInstallEnv,
		port: params.port,
		runtime: params.runtime,
		runtimePath: params.runtimePath,
		existingEnvironment: params.command.environment,
		existingEnvironmentValueSources: params.command.environmentValueSources,
		warn: (message, title) => note(message, title),
		config: params.cfg
	});
}
async function normalizeExecutablePath(value) {
	const resolvedPath = path.resolve(value);
	try {
		return await fs.realpath(resolvedPath);
	} catch {
		return resolvedPath;
	}
}
function extractDetailPath(detail, prefix) {
	if (!detail.startsWith(prefix)) return null;
	const value = detail.slice(prefix.length).trim();
	return value.length > 0 ? value : null;
}
function isExecStartRepairIssue(issue) {
	return EXECSTART_REPAIR_CODES.has(issue.code);
}
function isOperatorOwnedEnvironmentIssue(issue, command, environmentValueSources) {
	switch (issue.code) {
		case SERVICE_AUDIT_CODES.gatewayPathMissing:
		case SERVICE_AUDIT_CODES.gatewayPathMissingDirs:
		case SERVICE_AUDIT_CODES.gatewayPathNonMinimal: return hasGatewayServiceEnvironmentOverride(command, ["PATH"], { environmentValueSources });
		case SERVICE_AUDIT_CODES.gatewayTokenEmbedded:
		case SERVICE_AUDIT_CODES.gatewayTokenMismatch:
		case SERVICE_AUDIT_CODES.gatewayTokenDrift: return hasGatewayServiceEnvironmentOverride(command, ["OPENCLAW_GATEWAY_TOKEN"], { environmentValueSources });
		case SERVICE_AUDIT_CODES.gatewayManagedEnvEmbedded: return hasGatewayServiceEnvironmentOverride(command, issue.environmentKeys ?? [], {
			environmentValueSources,
			normalizeKey: normalizeServiceEnvKey
		});
		case SERVICE_AUDIT_CODES.gatewayProxyEnvEmbedded: return hasGatewayServiceEnvironmentOverride(command, (issue.environmentKeys ?? []).filter((key) => SERVICE_PROXY_ENV_KEYS.some((proxyKey) => proxyKey === key)), { ignoreResets: true });
		default: return false;
	}
}
function resolveSystemdScopeFromServicePath(sourcePath) {
	const normalized = sourcePath?.replaceAll("\\", "/") ?? "";
	return normalized.startsWith("/etc/systemd/") || normalized.startsWith("/usr/lib/systemd/") || normalized.startsWith("/lib/systemd/") ? "system" : "user";
}
function resolveSystemdUnitNameFromServicePath(sourcePath) {
	const base = sourcePath ? path.posix.basename(sourcePath.replaceAll("\\", "/")) : "";
	return base.endsWith(".service") ? base : "openclaw-gateway.service";
}
function shouldDeferUpdateModeSystemdServiceRepair(params) {
	return process.platform === "linux" && isDoctorUpdateRepairMode(params.repairMode) && !params.shouldForce;
}
async function readWindowsGatewayRuntimeForUpdateRepair(params) {
	if (process.platform !== "win32") return null;
	return await params.service.readRuntime(params.env).catch(() => null);
}
async function resolveSystemdServiceRewriteBlock(command, issues) {
	if (process.platform !== "linux" || !issues.some(isExecStartRepairIssue)) return;
	const unitName = resolveSystemdUnitNameFromServicePath(command.sourcePath);
	const scope = resolveSystemdScopeFromServicePath(command.sourcePath);
	const active = await isSystemdUnitActive(process.env, unitName, scope);
	if (!active.ok) return `Could not determine whether gateway service ${unitName} is active: ${active.error}. Leaving supervisor metadata unchanged. Check \`systemctl${scope === "user" ? " --user" : ""} status ${unitName}\` and rerun doctor.`;
	if (!active.value) return;
	issues.splice(0, issues.length, ...issues.filter((issue) => !isExecStartRepairIssue(issue)));
	return `Gateway service ${unitName} is running; skipped command/entrypoint rewrites and leaving supervisor metadata unchanged. Stop the service first or use \`openclaw gateway install --force\` when you want to replace the active launcher.`;
}
async function filterInactiveExtraGatewayServices(services) {
	if (process.platform !== "linux") return services;
	const activeOrLegacy = [];
	for (const svc of services) {
		if (svc.platform !== "linux" || svc.legacy === true) {
			activeOrLegacy.push(svc);
			continue;
		}
		const active = await isSystemdUnitActive(process.env, svc.label, svc.scope);
		if (!active.ok || active.value) activeOrLegacy.push(svc);
	}
	return activeOrLegacy;
}
async function detectExtraGatewayServiceIssues(options = {}) {
	if (!isDefaultInstallIdentity(process.env) || !await shouldManageGatewayService()) return [];
	return await filterInactiveExtraGatewayServices(await findExtraGatewayServices(process.env, { deep: options.deep }));
}
function extraGatewayServiceToHealthFinding(service) {
	return {
		checkId: GATEWAY_SERVICES_EXTRA_CHECK_ID,
		severity: service.legacy === true ? "warning" : "info",
		message: `Other gateway-like service detected: ${service.label} (${service.scope}, ${service.detail})`,
		source: service.platform,
		target: service.label,
		fixHint: service.legacy === true ? "Run openclaw doctor --fix to remove legacy gateway services." : "Run a single gateway per machine unless this extra gateway is intentional."
	};
}
function extraGatewayServiceToRepairEffects(service) {
	if (service.legacy !== true) return [];
	return [{
		kind: "service",
		action: "would-remove-legacy-gateway-service",
		target: service.label,
		dryRunSafe: false
	}];
}
async function cleanupLegacyLaunchdService(params) {
	const domain = typeof process.getuid === "function" ? `gui/${process.getuid()}` : "gui/501";
	await execLaunchctl([
		"bootout",
		domain,
		params.plistPath
	], DOCTOR_LAUNCHCTL_TIMEOUT_MS);
	await execLaunchctl(["unload", params.plistPath], DOCTOR_LAUNCHCTL_TIMEOUT_MS);
	if (!await confirmLegacyLaunchdServiceUnloaded(`${domain}/${params.label}`)) return {
		status: "failed",
		reason: "launchctl could not confirm unload"
	};
	const trashDir = path.join(os.homedir(), ".Trash");
	try {
		await fs.mkdir(trashDir, { recursive: true });
	} catch {}
	try {
		await fs.access(params.plistPath);
	} catch (error) {
		if (error.code === "ENOENT") return { status: "removed" };
		return {
			status: "failed",
			reason: "could not inspect plist"
		};
	}
	const dest = path.join(trashDir, `${params.label}-${Date.now()}.plist`);
	try {
		await fs.rename(params.plistPath, dest);
		return {
			status: "removed",
			destination: dest
		};
	} catch {
		return {
			status: "failed",
			reason: "could not move plist"
		};
	}
}
function classifyLegacyServices(legacyServices) {
	const darwinUserServices = [];
	const linuxUserServices = [];
	const failed = [];
	for (const svc of legacyServices) {
		if (svc.platform === "darwin") {
			if (svc.scope === "user") darwinUserServices.push(svc);
			else failed.push(`${svc.label} (${svc.scope})`);
			continue;
		}
		if (svc.platform === "linux") {
			if (svc.scope === "user") linuxUserServices.push(svc);
			else failed.push(`${svc.label} (${svc.scope})`);
			continue;
		}
		failed.push(`${svc.label} (${svc.platform})`);
	}
	return {
		darwinUserServices,
		linuxUserServices,
		failed
	};
}
async function cleanupLegacyDarwinServices(services) {
	const removed = [];
	const failed = [];
	for (const svc of services) {
		const plistPath = extractDetailPath(svc.detail, "plist:");
		if (!plistPath) {
			failed.push(`${svc.label} (missing plist path)`);
			continue;
		}
		const result = await cleanupLegacyLaunchdService({
			label: svc.label,
			plistPath
		});
		if (result.status === "removed") removed.push(result.destination ? `${svc.label} -> ${result.destination}` : svc.label);
		else failed.push(`${svc.label} (${result.reason})`);
	}
	return {
		removed,
		failed
	};
}
async function cleanupLegacyLinuxUserServices(services, runtime) {
	const removed = [];
	const failed = [];
	try {
		const removedUnits = await uninstallLegacySystemdUnits({
			env: process.env,
			stdout: process.stdout
		});
		const removedByLabel = new Map(removedUnits.map((unit) => [`${unit.name}.service`, unit]));
		for (const svc of services) {
			const removedUnit = removedByLabel.get(svc.label);
			if (!removedUnit) {
				failed.push(`${svc.label} (legacy unit name not recognized)`);
				continue;
			}
			removed.push(`${svc.label} -> ${removedUnit.unitPath}`);
		}
	} catch (err) {
		runtime.error(`Legacy Linux gateway cleanup failed: ${String(err)}`);
		for (const svc of services) failed.push(`${svc.label} (linux cleanup failed)`);
	}
	return {
		removed,
		failed
	};
}
/**
* Audits and optionally rewrites the installed local gateway service configuration.
*
* The repair preserves managed env sources and avoids Nix/remote installs. Update-mode repairs
* stay staged except for running Windows services, which must be activated to replace a fallback.
*/
async function maybeRepairGatewayServiceConfig(cfg, mode, runtime, prompter, options = {}) {
	if (!isDefaultInstallIdentity(process.env)) {
		note(NON_DEFAULT_INSTALL_SERVICE_SKIP_REASON, "Gateway");
		return cfg;
	}
	if (resolveIsNixMode(process.env)) {
		note("Nix mode detected; skip service updates.", "Gateway");
		return cfg;
	}
	if (mode === "remote") {
		note("Gateway mode is remote; skipped local service audit.", "Gateway");
		return cfg;
	}
	const service = resolveGatewayService();
	let command;
	try {
		command = await service.readCommand(process.env);
	} catch {
		command = null;
	}
	if (!command) return cfg;
	const managedDefinition = resolveManagedGatewayServiceCommand(command) ?? command;
	note(formatGatewayHeapLimitReport(inspectGatewayHeapLimit(command.environment?.NODE_OPTIONS)), "Gateway heap");
	const managedWrapperPath = managedDefinition.environment?.[OPENCLAW_WRAPPER_ENV_KEY]?.trim();
	const serviceInstallEnv = managedWrapperPath && !Object.hasOwn(process.env, "OPENCLAW_WRAPPER") ? {
		...process.env,
		[OPENCLAW_WRAPPER_ENV_KEY]: managedWrapperPath
	} : process.env;
	const serviceWrapperPath = normalizeOptionalString(command.environment?.[OPENCLAW_WRAPPER_ENV_KEY]);
	if (serviceWrapperPath) note(`Gateway service invokes ${OPENCLAW_WRAPPER_ENV_KEY}: ${serviceWrapperPath}`, "Gateway");
	const serviceLayout = await summarizeGatewayServiceLayout(command);
	const sourceCheckoutWarning = serviceLayout?.entrypointSourceCheckout ? [`Gateway service entrypoint resolves to a source checkout: ${serviceLayout.packageRootReal ?? serviceLayout.packageRoot ?? serviceLayout.entrypointReal ?? serviceLayout.entrypoint}.`, "Run `openclaw doctor --fix` from the intended package install, or reinstall the gateway service with `openclaw gateway install --force`."].join("\n") : null;
	const tokenRefConfigured = Boolean(resolveSecretInputRef({
		value: cfg.gateway?.auth?.token,
		defaults: cfg.secrets?.defaults
	}).ref);
	const gatewayTokenResolution = await resolveGatewayAuthTokenForService(cfg, process.env, { allowExecSecretRefs: options.allowExecSecretRefs === true });
	if (gatewayTokenResolution.unavailableReason) note(`Unable to verify gateway service token drift: ${gatewayTokenResolution.unavailableReason}`, "Gateway service config");
	const expectedGatewayToken = tokenRefConfigured ? void 0 : gatewayTokenResolution.token;
	const port = resolveGatewayPort(cfg, process.env);
	const runtimeChoice = resolveGatewayDaemonRuntime(managedDefinition.programArguments);
	const installedRuntimePath = runtimeChoice === "bun" ? managedDefinition.programArguments[0] : void 0;
	const expectedPlan = await buildExpectedGatewayServicePlan({
		cfg,
		command: managedDefinition,
		serviceInstallEnv,
		port,
		runtime: runtimeChoice,
		runtimePath: installedRuntimePath
	});
	const expectedManagedServiceEnvKeys = readManagedServiceEnvKeysFromEnvironment(expectedPlan.environment);
	const audit = await auditGatewayServiceConfig({
		env: process.env,
		command,
		expectedGatewayToken,
		expectedManagedServiceEnvKeys,
		expectedServicePath: expectedPlan.environment.PATH,
		expectedPort: port
	});
	const serviceToken = readEmbeddedGatewayToken(command);
	if (tokenRefConfigured && serviceToken) audit.issues.push({
		code: SERVICE_AUDIT_CODES.gatewayTokenMismatch,
		message: "Gateway service OPENCLAW_GATEWAY_TOKEN should be unset when gateway.auth.token is SecretRef-managed",
		detail: "service token is stale",
		level: "recommended"
	});
	const needsNodeRuntime = needsNodeRuntimeMigration(audit.issues);
	const systemNodeInfo = needsNodeRuntime ? await resolveSystemNodeInfo({ env: process.env }) : null;
	const systemNodePath = systemNodeInfo?.supported ? systemNodeInfo.path : null;
	if (needsNodeRuntime && !systemNodePath && runtimeChoice !== "node") {
		const warning = renderSystemNodeWarning(systemNodeInfo);
		if (warning) note(warning, "Gateway runtime");
		else note("System Node 22 LTS (22.22.3+) or Node 24.15+ not found. Install via Homebrew/apt/choco and rerun doctor to migrate off Bun/version managers.", "Gateway runtime");
	}
	const { programArguments } = needsNodeRuntime && systemNodePath ? await buildExpectedGatewayServicePlan({
		cfg,
		command: managedDefinition,
		serviceInstallEnv,
		port,
		runtime: "node",
		runtimePath: systemNodePath
	}) : expectedPlan;
	const expectedEntrypoint = findGatewayEntrypoint(programArguments);
	const currentEntrypoint = findGatewayEntrypoint(command.programArguments);
	const normalizedExpectedEntrypoint = expectedEntrypoint ? await normalizeExecutablePath(expectedEntrypoint) : null;
	const normalizedCurrentEntrypoint = serviceLayout?.entrypoint ? await normalizeExecutablePath(serviceLayout.entrypoint) : null;
	if (normalizedExpectedEntrypoint && normalizedCurrentEntrypoint && normalizedExpectedEntrypoint !== normalizedCurrentEntrypoint) audit.issues.push({
		code: SERVICE_AUDIT_CODES.gatewayEntrypointMismatch,
		message: "Gateway service entrypoint does not match the current install.",
		detail: `${currentEntrypoint} -> ${expectedEntrypoint}`,
		level: "recommended"
	});
	const serviceRewriteBlock = await resolveSystemdServiceRewriteBlock(command, audit.issues);
	if (serviceRewriteBlock) note(serviceRewriteBlock, "Gateway service config");
	const hasEntrypointMismatch = audit.issues.some((issue) => issue.code === SERVICE_AUDIT_CODES.gatewayEntrypointMismatch);
	const showSourceCheckoutWarning = sourceCheckoutWarning !== null && !hasEntrypointMismatch;
	if (audit.issues.length === 0) {
		if (sourceCheckoutWarning !== null && !hasEntrypointMismatch) note(sourceCheckoutWarning, "Gateway service config");
		return cfg;
	}
	const serviceRepairExternal = isServiceRepairExternallyManaged(resolveServiceRepairPolicy());
	const consolidatedLines = [];
	let emittedSourceCheckoutWarning = false;
	if (sourceCheckoutWarning !== null && showSourceCheckoutWarning) {
		consolidatedLines.push(sourceCheckoutWarning);
		consolidatedLines.push("");
		emittedSourceCheckoutWarning = true;
	}
	consolidatedLines.push(...audit.issues.map((issue) => issue.detail ? `- ${issue.message} (${issue.detail})` : `- ${issue.message}`));
	note(consolidatedLines.join("\n"), "Gateway service config");
	const needsAggressive = audit.issues.filter((issue) => issue.level === "aggressive").length > 0;
	if (needsAggressive && !prompter.shouldForce) note("Custom or unexpected service edits detected. Rerun with --force to overwrite.", "Gateway service config");
	if (serviceRepairExternal) {
		note(EXTERNAL_SERVICE_REPAIR_NOTE, "Gateway service config");
		return cfg;
	}
	if (serviceRewriteBlock) return cfg;
	if (process.platform === "linux" && audit.issues.some((issue) => isExecStartRepairIssue(issue) && hasGatewayServiceLauncherOverride(command) || issue.code === SERVICE_AUDIT_CODES.gatewayPortMismatch && hasGatewayServiceLauncherOverride(command, { includeWorkingDirectory: false }) || isOperatorOwnedEnvironmentIssue(issue, command, expectedPlan.environmentValueSources))) {
		const unitName = resolveSystemdUnitNameFromServicePath(command.sourcePath);
		note(`Gateway service command, working directory, or environment comes from an operator-owned systemd drop-in; rewriting the managed unit cannot repair it. Inspect with \`${`systemctl${resolveSystemdScopeFromServicePath(command.sourcePath) === "user" ? " --user" : ""} cat ${unitName}`}\`, then update or remove the drop-in and rerun doctor.`, "Gateway service config");
		return cfg;
	}
	const updateRepairMode = isDoctorUpdateRepairMode(prompter.repairMode);
	if (updateRepairMode && !updateParentAllowsGatewayServiceRepair(process.env)) {
		note("Update parent did not authorize changes to this gateway service definition; leaving it unchanged.", "Gateway service config");
		return cfg;
	}
	if (shouldDeferUpdateModeSystemdServiceRepair({
		repairMode: prompter.repairMode,
		shouldForce: prompter.shouldForce
	})) {
		note("Update-mode doctor detected gateway service drift but left the live systemd unit unchanged. Review the service file and run `openclaw gateway install --force` when you want OpenClaw to rewrite its managed unit; operator-owned drop-ins remain unchanged.", "Gateway service config");
		return cfg;
	}
	const repairMessage = needsAggressive ? "Overwrite gateway service config with current defaults now?" : "Update gateway service config to the recommended defaults now?";
	if (!(updateRepairMode ? needsAggressive ? await prompter.confirmAggressiveAutoFix({
		message: repairMessage,
		initialValue: prompter.shouldForce
	}) : await prompter.confirmAutoFix({
		message: repairMessage,
		initialValue: true
	}) : await prompter.confirmRuntimeRepair({
		message: repairMessage,
		initialValue: needsAggressive ? prompter.shouldForce : true,
		requiresInteractiveConfirmation: true
	}))) {
		if (!emittedSourceCheckoutWarning) note("Run `openclaw gateway install --force` when you want to replace the gateway service definition.", "Gateway service config");
		return cfg;
	}
	const serviceEmbeddedToken = readEmbeddedGatewayToken(managedDefinition);
	const gatewayTokenForRepair = expectedGatewayToken ?? serviceEmbeddedToken;
	const configuredGatewayToken = typeof cfg.gateway?.auth?.token === "string" ? normalizeOptionalString(cfg.gateway.auth.token) : void 0;
	let cfgForServiceInstall = cfg;
	const updateRepairWillRewriteWindowsTask = updateRepairMode && process.platform === "win32";
	const serviceRuntimeEnv = {
		...serviceInstallEnv,
		...managedDefinition.environment
	};
	const installedWindowsTaskName = managedDefinition.environment?.OPENCLAW_WINDOWS_TASK_NAME?.trim();
	const serviceRepairEnv = updateRepairWillRewriteWindowsTask && installedWindowsTaskName ? {
		...serviceInstallEnv,
		OPENCLAW_WINDOWS_TASK_NAME: installedWindowsTaskName
	} : serviceInstallEnv;
	const updateRepairShouldInstall = (updateRepairWillRewriteWindowsTask && updateParentAllowsGatewayActivation(process.env) ? await readWindowsGatewayRuntimeForUpdateRepair({
		service,
		env: serviceRuntimeEnv
	}) : null)?.status === "running";
	let startupFallbackTakeoverRuntime;
	if (updateRepairShouldInstall) try {
		const fallbackRuntime = await readWindowsStartupFallbackRuntimeForUpdate(serviceRuntimeEnv);
		if (fallbackRuntime && (fallbackRuntime.status !== "running" || !fallbackRuntime.pid)) {
			note("Could not verify the running Windows login item before service repair; leaving it unchanged.", "Gateway");
			return cfg;
		}
		startupFallbackTakeoverRuntime = fallbackRuntime ?? void 0;
	} catch (err) {
		runtime.error(`Could not inspect the Windows login item before service repair: ${String(err)}`);
		return cfg;
	}
	if ((!updateRepairMode || updateRepairWillRewriteWindowsTask) && !tokenRefConfigured && !configuredGatewayToken && gatewayTokenForRepair) {
		if (updateRepairWillRewriteWindowsTask && shouldSkipLegacyUpdateRepairConfigWrite(process.env)) {
			note("Legacy update parent cannot persist gateway.auth.token before service repair; leaving the existing gateway service unchanged.", "Gateway");
			return cfg;
		}
		const nextCfg = {
			...cfg,
			gateway: {
				...cfg.gateway,
				auth: {
					...cfg.gateway?.auth,
					mode: cfg.gateway?.auth?.mode ?? "token",
					token: gatewayTokenForRepair
				}
			}
		};
		try {
			await replaceConfigFile({
				nextConfig: nextCfg,
				afterWrite: { mode: "auto" },
				writeOptions: {
					auditOrigin: "doctor",
					allowConfigSizeDrop: options.allowConfigSizeDrop === true || updateRepairMode,
					skipPluginValidation: options.skipPluginValidation === true || updateRepairMode,
					preservedLegacyRootKeys: options.preservedLegacyRootKeys,
					...options.lastTouchedVersionOverride ? { lastTouchedVersionOverride: options.lastTouchedVersionOverride } : {}
				}
			});
			cfgForServiceInstall = nextCfg;
			note(expectedGatewayToken ? "Persisted gateway.auth.token from environment before reinstalling service." : "Persisted gateway.auth.token from existing service definition before reinstalling service.", "Gateway");
		} catch (err) {
			runtime.error(`Failed to persist gateway.auth.token before service repair: ${String(err)}`);
			return cfg;
		}
	}
	const updatedPort = resolveGatewayPort(cfgForServiceInstall, process.env);
	const updatedPlan = await buildExpectedGatewayServicePlan({
		cfg: cfgForServiceInstall,
		command: managedDefinition,
		serviceInstallEnv,
		port: updatedPort,
		runtime: needsNodeRuntime && systemNodePath ? "node" : runtimeChoice,
		runtimePath: needsNodeRuntime && systemNodePath ? systemNodePath : installedRuntimePath
	});
	const repairService = updateRepairMode && !updateRepairShouldInstall ? service.stage : service.install;
	try {
		await repairService({
			env: serviceRepairEnv,
			stdout: process.stdout,
			warn: (message) => note(message, "Gateway"),
			programArguments: updatedPlan.programArguments,
			workingDirectory: updatedPlan.workingDirectory,
			environment: updatedPlan.environment,
			environmentValueSources: updatedPlan.environmentValueSources,
			startupFallbackTakeoverRuntime
		});
		if (updateRepairShouldInstall && !isTruthyEnvValue(process.env["OPENCLAW_UPDATE_PARENT_SUPPORTS_GATEWAY_RESTART"])) {
			const restartEnv = {
				...serviceRepairEnv,
				...updatedPlan.environment
			};
			if (installedWindowsTaskName) restartEnv.OPENCLAW_WINDOWS_TASK_NAME = installedWindowsTaskName;
			await service.restart({
				env: restartEnv,
				stdout: process.stdout
			});
			note("Restarted the repaired gateway for a legacy update parent.", "Gateway");
		}
	} catch (err) {
		runtime.error(`Gateway service update failed: ${String(err)}`);
	}
	return cfgForServiceInstall;
}
/**
* Reports duplicate gateway-like services and removes legacy user services after confirmation.
*/
async function maybeScanExtraGatewayServices(options, runtime, prompter) {
	if (!isDefaultInstallIdentity(process.env)) {
		note(NON_DEFAULT_INSTALL_SERVICE_SKIP_REASON, "Gateway");
		return;
	}
	const extraServices = await detectExtraGatewayServiceIssues(options);
	if (extraServices.length === 0) return;
	note(extraServices.map((svc) => `- ${svc.label} (${svc.scope}, ${svc.detail})`).join("\n"), "Other gateway-like services detected");
	const legacyServices = extraServices.filter((svc) => svc.legacy === true);
	if (legacyServices.length > 0) {
		const serviceRepairPolicy = resolveServiceRepairPolicy();
		const serviceRepairExternal = isServiceRepairExternallyManaged(serviceRepairPolicy);
		if (serviceRepairExternal) note(EXTERNAL_SERVICE_REPAIR_NOTE, "Legacy gateway cleanup skipped");
		if (serviceRepairExternal ? false : await confirmDoctorServiceRepair(prompter, {
			message: "Remove legacy gateway services now?",
			initialValue: true
		}, serviceRepairPolicy)) {
			const removed = [];
			const { darwinUserServices, linuxUserServices, failed } = classifyLegacyServices(legacyServices);
			if (darwinUserServices.length > 0) {
				const result = await cleanupLegacyDarwinServices(darwinUserServices);
				removed.push(...result.removed);
				failed.push(...result.failed);
			}
			if (linuxUserServices.length > 0) {
				const result = await cleanupLegacyLinuxUserServices(linuxUserServices, runtime);
				removed.push(...result.removed);
				failed.push(...result.failed);
			}
			if (removed.length > 0) note(removed.map((line) => `- ${line}`).join("\n"), "Legacy gateway removed");
			if (failed.length > 0) note(failed.map((line) => `- ${line}`).join("\n"), "Legacy gateway cleanup skipped");
			if (removed.length > 0) runtime.log("Legacy gateway services removed. Installing OpenClaw gateway next.");
		}
	}
	const cleanupHints = renderGatewayServiceCleanupHints(extraServices.filter((service) => service.legacy !== true));
	if (cleanupHints.length > 0) note(cleanupHints.map((hint) => `- ${hint}`).join("\n"), "Cleanup hints");
	note([
		"Recommendation: run a single gateway per machine for most setups.",
		"One gateway supports multiple agents.",
		"If you need multiple gateways (e.g., a rescue bot on the same host), isolate ports + config/state (see docs: /gateway#multiple-gateways-same-host)."
	].join("\n"), "Gateway recommendation");
}
/**
* Resolves a `dueling` systemd install (both a user-scope and a system-scope
* gateway unit present) by removing the redundant user-scope unit after
* confirmation, keeping the root-installed system-scope unit as authoritative.
*
* This is the fix for issue #79375: on Linux the two units bind the same port
* and SIGTERM each other in an endless restart loop. The canonical units are
* deliberately excluded from `findExtraGatewayServices`, so this detects the
* condition directly via `findSystemdGatewayInstallation`. Removing a unit
* under `$HOME` needs no root; the system-scope unit is never auto-removed
* (only a `sudo`-flavored hint is offered for that direction).
*/
async function maybeResolveDuelingSystemdGatewayScopes(runtime, prompter) {
	if (process.platform !== "linux") return;
	const installation = await findSystemdGatewayInstallation(process.env).catch(() => null);
	if (installation?.kind !== "dueling") return;
	const { user, system } = installation;
	note([
		"Both a user-scope and a system-scope OpenClaw gateway unit are installed:",
		`- user:   ${user.unitPath}`,
		`- system: ${system.unitPath}`,
		"They bind the same port and will SIGTERM each other in a restart loop."
	].join("\n"), "Dueling gateway services detected");
	if (!await isSystemUnitActiveAndEnabled(process.env, system.unitName).catch(() => false)) {
		note([
			"Could not verify the system-scope unit is both running and enabled at boot, so the",
			"user-scope unit may be your working gateway. Not removing anything",
			"automatically.",
			"If the system-scope unit is the one you want, activate it and re-run doctor:",
			`- sudo systemctl enable --now ${system.unitName}`,
			"If the user-scope unit is the one you want, remove the system unit:",
			`- sudo systemctl disable --now ${system.unitName} && sudo rm ${system.unitPath}`
		].join("\n"), "Gateway cleanup needs an owner decision");
		return;
	}
	note(["The system-scope unit is the active and boot-enabled supervisor and is", "treated as authoritative; the user-scope unit is the redundant leftover."].join("\n"), "System-scope unit owns the gateway");
	const policy = resolveServiceRepairPolicy();
	if (isServiceRepairExternallyManaged(policy)) {
		note(EXTERNAL_SERVICE_REPAIR_NOTE, "Gateway cleanup skipped");
		return;
	}
	if (!await confirmDoctorServiceRepair(prompter, {
		message: "Remove the redundant user-scope gateway unit and keep the system-scope unit?",
		initialValue: true
	}, policy)) {
		const hints = renderGatewayServiceCleanupHints();
		if (hints.length > 0) note(hints.map((hint) => `- ${hint}`).join("\n"), "Cleanup hints");
		return;
	}
	try {
		const result = await uninstallUserSystemdGatewayUnit({
			env: process.env,
			stdout: process.stdout
		});
		note(result.removed ? `Removed user-scope unit ${result.unitPath}.` : `User-scope unit already absent at ${result.unitPath}.`, "Redundant user gateway removed");
		runtime.log(result.disabled ? "Removed the redundant user-scope gateway unit. The system-scope unit is now the sole gateway manager." : `Removed the user-scope unit file, but systemctl was unavailable to stop it. Run: systemctl --user disable --now ${result.unitName} && systemctl --user daemon-reload`);
	} catch (err) {
		runtime.error(`Failed to remove redundant user-scope gateway unit: ${String(err)}`);
		const hints = renderGatewayServiceCleanupHints();
		if (hints.length > 0) note(hints.map((hint) => `- ${hint}`).join("\n"), "Cleanup hints");
	}
}
//#endregion
export { detectExtraGatewayServiceIssues, extraGatewayServiceToHealthFinding, extraGatewayServiceToRepairEffects, maybeRepairGatewayServiceConfig, maybeResolveDuelingSystemdGatewayScopes, maybeScanExtraGatewayServices };
