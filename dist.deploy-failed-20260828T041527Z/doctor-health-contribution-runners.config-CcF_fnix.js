import { y as resolveIsNixMode } from "./paths-BBSTUjD5.js";
import "./update-phase-CUQAfBmE.js";
import { i as resolveLegacyParentVersionOverride, n as resolveDoctorMode, t as isUpdateDoctorRun } from "./doctor-health-contribution-utils-0nWpp2v1.js";
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
/** Removes queued retired profiles after any config references have been durably repaired. */
async function runRetiredAuthProfileCleanup(ctx) {
	const retiredAuthProfileCleanupPlans = ctx.configResult.retiredAuthProfileCleanupPlans;
	if (!retiredAuthProfileCleanupPlans?.length) return;
	const { removeAuthProfilesAcrossOwnerStores } = await import("./auth-profiles-wbKTfiln.js");
	for (const plan of retiredAuthProfileCleanupPlans) if (!await removeAuthProfilesAcrossOwnerStores(plan)) throw new Error(`Failed to remove retired auth profile "${plan.profileIds.join(", ")}".`);
	delete ctx.configResult.retiredAuthProfileCleanupPlans;
}
async function runWriteConfigHealth(ctx, options = {}) {
	if (ctx.configWriteRefusal) return;
	const { applyWizardMetadata } = await import("./onboard-helpers-Cwjb9WEP.js");
	const { replaceConfigFile } = await import("./config/config.js");
	const { logConfigUpdated } = await import("./logging-B0JIUhGW.js");
	const { shortenHomePath } = await import("./utils-DbFQsLj1.js");
	if (ctx.configResult.shouldWriteConfig === true && ctx.configResultWriteCommitted !== true || JSON.stringify(ctx.cfg) !== JSON.stringify(ctx.cfgForPersistence)) {
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
					...ctx.configResult.explicitSetPaths ? { explicitSetPaths: ctx.configResult.explicitSetPaths } : {},
					preservedLegacyRootKeys: ctx.configResult.preservedLegacyRootKeys,
					...legacyParentVersionOverride ? { lastTouchedVersionOverride: legacyParentVersionOverride } : {}
				}
			});
		} catch (error) {
			const { isConfigValidationFailedError } = await import("./io.write-errors-BdB-lt_W.js");
			if (isConfigValidationFailedError(error)) {
				const { note } = await import("./terminal-core/note.js");
				const { formatConfigIssueLines } = await import("./issue-format-DO1b9GRU.js");
				const issueLines = Array.isArray(error.issues) ? formatConfigIssueLines(error.issues, "-", { normalizeRoot: true }) : [error.message];
				const unpersistedLine = ctx.configResultWriteCommitted === true ? "Earlier config fixes were already saved; the remaining changes were not written." : "No config changes were written.";
				note([
					"Doctor could not apply config fixes: the repaired config still fails validation.",
					...issueLines,
					`${unpersistedLine} Fix the value(s) above in ${shortenHomePath(ctx.configPath)} by hand, then rerun "openclaw doctor --fix".`
				].join("\n"), "Doctor warnings");
				ctx.configWriteRefusal = "validation";
				return;
			}
			const { isCronOwnerWriteRefusalError } = await import("./io.cron-owner-refusal-CyN5EnoN.js");
			if (!isCronOwnerWriteRefusalError(error)) throw error;
			const { note } = await import("./terminal-core/note.js");
			note([
				error.message,
				"Doctor left the config unchanged, preserving any retained legacy owner for a later repair.",
				"Resolve the reported Gateway or cron-store condition, then rerun \"openclaw doctor --fix\"."
			].join("\n"), "Doctor warnings");
			ctx.configWriteRefusal = "cron-owner-safety";
			return;
		}
		const pendingChangePanels = ctx.configResult.pendingChangePanels;
		if (pendingChangePanels?.length) {
			const { note } = await import("./terminal-core/note.js");
			for (const panel of pendingChangePanels) note(panel, "Doctor changes");
			delete ctx.configResult.pendingChangePanels;
		}
		ctx.cfgForPersistence = structuredClone(ctx.cfg);
		if (ctx.configResult.shouldWriteConfig === true) ctx.configResultWriteCommitted = true;
		logConfigUpdated(ctx.runtime);
		const preUpdateSnapshotPath = `${ctx.configPath}.pre-update`;
		if (updateDoctorRun && fs.existsSync(preUpdateSnapshotPath)) ctx.runtime.log(`Update changed config; pre-update backup: ${shortenHomePath(preUpdateSnapshotPath)}`);
	}
	if (options.runPostWriteRepairs === false) return;
	await runRetiredAuthProfileCleanup(ctx);
	if (ctx.configResult.retiredPhoneControlStateCleanupPending === true) {
		const { finalizeRetiredPhoneControlCleanup } = await import("./doctor-retired-phone-control-DmpjyUm3.js");
		const { note } = await import("./terminal-core/note.js");
		const cleanup = await finalizeRetiredPhoneControlCleanup({ env: ctx.env ?? process.env });
		if (cleanup.changes.length > 0) note(cleanup.changes.join("\n"), "Doctor changes");
		if (cleanup.warnings.length > 0) note(cleanup.warnings.join("\n"), "Doctor warnings");
	}
	if (ctx.configResult.shouldRepairCronCodexModelRefsAfterConfigWrite !== true || ctx.postConfigWriteRepairsCommitted === true) return;
	const { repairCronCodexModelRefsAfterConfigWrite } = await import("./legacy-repair-Cb_-I9Yq.js");
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
export { runWriteConfigHealth as a, runRetiredAuthProfileCleanup as i, runFinalConfigValidationHealth as n, runInitialConfigWriteHealth as r, collectWriteConfigHealthFindings as t };
