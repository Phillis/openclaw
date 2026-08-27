import { c as resolveUserPath } from "./home-dir-BFvskzn8.js";
import "./utils-Bw16L5tB.js";
import { n as VERSION } from "./version-CkBmshxX.js";
import { a as resolveDefaultPluginExtensionsDir, s as resolveDefaultPluginNpmDir } from "./install-paths-DllFtsSG.js";
import { c as listManagedPluginNpmRoots } from "./managed-npm-retention-BqtSDJEu.js";
import { a as reconcileRegisteredOpenClawHostLinks, o as relinkOpenClawPeerDependenciesInManagedNpmRoot } from "./plugin-peer-link-CNPdFqM4.js";
import { s as UPDATE_POST_CORE_CONVERGENCE_ENV } from "./update-phase-CUQAfBmE.js";
import { t as repairMissingConfiguredPluginInstalls } from "./missing-configured-plugin-install-DC8-hW50.js";
import { n as pruneStaleLocalBundledPluginInstallRecords } from "./stale-local-bundled-plugin-install-records-DJnUS2cF.js";
import { n as runActivePluginPayloadSmokeCheck, t as filterRecordsToActive } from "./active-plugin-payload-validation-BuSrO2uN.js";
import path from "node:path";
//#region src/cli/update-cli/post-core-plugin-convergence.ts
const REPAIR_GUIDANCE = "Run `openclaw update repair` to retry plugin repair.";
const inspectGuidance = (pluginId) => `Run \`openclaw plugins inspect ${pluginId} --runtime --json\` for details.`;
function smokeFailureGuidance(failure) {
	if (failure.reason !== "unreadable-package-json") return [REPAIR_GUIDANCE, inspectGuidance(failure.pluginId)];
	return [`Fix file access for ${failure.installPath ? path.join(failure.installPath, "package.json") : "the plugin package.json"} so it is readable by the user running OpenClaw. For EACCES or EPERM, correct its ownership or permissions; otherwise resolve the reported filesystem I/O error, then retry.`, inspectGuidance(failure.pluginId)];
}
async function repairInstalledNpmOpenClawHostLinks(params) {
	const packageReadFailures = [];
	try {
		const npmRoots = await listManagedPluginNpmRoots(resolveDefaultPluginNpmDir(params.env));
		const repaired = (await Promise.all(npmRoots.map((npmRoot) => relinkOpenClawPeerDependenciesInManagedNpmRoot({
			npmRoot,
			logger: {},
			onPackageReadError: (error, packageDir) => {
				packageReadFailures.push({
					error,
					packageDir
				});
			}
		})))).reduce((total, result) => total + result.repaired, 0);
		const registeredRepair = await reconcileRegisteredOpenClawHostLinks({
			installRecords: params.installRecords,
			extensionsDir: resolveDefaultPluginExtensionsDir(params.env),
			env: params.env,
			mode: "repair",
			onPackageReadError: (error, packageDir) => {
				packageReadFailures.push({
					error,
					packageDir
				});
			}
		});
		return {
			changes: [...repaired > 0 ? [`Repaired OpenClaw host peer link(s) for ${repaired} managed npm plugin package(s).`] : [], ...registeredRepair.repaired > 0 ? [`Repaired OpenClaw host peer link(s) for ${registeredRepair.repaired} registered npm plugin package(s).`] : []],
			warnings: [],
			packageReadFailures
		};
	} catch (err) {
		const message = `Failed to repair managed npm OpenClaw host peer links: ${err instanceof Error ? err.message : String(err)}`;
		return {
			changes: [],
			warnings: [{
				reason: message,
				message,
				guidance: [REPAIR_GUIDANCE]
			}],
			packageReadFailures
		};
	}
}
function formatPeerLinkPackageReadWarning(failure) {
	const message = `Failed to repair managed npm OpenClaw host peer links: ${failure.error instanceof Error ? failure.error.message : String(failure.error)}`;
	return {
		reason: message,
		message,
		guidance: [REPAIR_GUIDANCE]
	};
}
/**
* Mandatory post-core convergence pass. Runs AFTER the core package files
* are swapped and the in-update doctor pass has already returned, but BEFORE
* the gateway is restarted. Missing-plugin repair failures stay nonblocking:
* an external package fetch may be transient, and failing the core update
* would strand the user. Explicit `openclaw update` callers keep reporting
* payload smoke failures as errors. Gateway startup consumes the same typed
* failures by quarantining each known plugin owner before any module import,
* then boots with that plugin marked configured-unavailable.
*/
async function runPostCorePluginConvergence(params) {
	const env = {
		...params.env,
		OPENCLAW_COMPATIBILITY_HOST_VERSION: params.compatibilityHostVersion ?? VERSION,
		[UPDATE_POST_CORE_CONVERGENCE_ENV]: "1"
	};
	const { maybeRepairStaleManagedNpmBundledPlugins } = await import("./doctor-plugin-registry-CbaYc_30.js");
	const staleManagedNpmBundledPluginRepair = maybeRepairStaleManagedNpmBundledPlugins({
		config: params.cfg,
		env,
		prompter: { shouldRepair: true },
		...params.baselineInstallRecords ? { installRecords: params.baselineInstallRecords } : {}
	});
	const convergenceBaseline = staleManagedNpmBundledPluginRepair?.installRecords ?? params.baselineInstallRecords;
	const prunedBaseline = convergenceBaseline ? pruneStaleLocalBundledPluginInstallRecords({
		installRecords: convergenceBaseline,
		env
	}) : null;
	const repair = await repairMissingConfiguredPluginInstalls({
		cfg: params.cfg,
		env,
		...prunedBaseline ? { baselineRecords: prunedBaseline.records } : {},
		...params.acknowledgeClawHubRisk ? { acknowledgeClawHubRisk: true } : {},
		...params.onClawHubRisk ? { onClawHubRisk: params.onClawHubRisk } : {}
	});
	const warnings = repair.warnings.map((message) => ({
		reason: message,
		message,
		guidance: [REPAIR_GUIDANCE]
	}));
	const peerLinkRepair = await repairInstalledNpmOpenClawHostLinks({
		env,
		installRecords: repair.records
	});
	warnings.push(...peerLinkRepair.warnings);
	const notices = (repair.notices ?? []).map((message) => ({
		reason: message,
		message,
		guidance: []
	}));
	const records = repair.records;
	const smoke = await runActivePluginPayloadSmokeCheck({
		cfg: params.cfg,
		records,
		env
	});
	const smokeRecords = filterRecordsToActive({
		cfg: params.cfg,
		records
	});
	const resolveInstallRecordPaths = (installRecords) => new Set(Object.values(installRecords).flatMap((record) => {
		const installPath = record.installPath?.trim();
		return installPath ? [path.resolve(resolveUserPath(installPath, env))] : [];
	}));
	const knownInstallPaths = resolveInstallRecordPaths(records);
	const activeInstallPaths = resolveInstallRecordPaths(smokeRecords);
	const smokeFailureInstallPaths = new Set(smoke.failures.flatMap((failure) => failure.installPath ? [path.resolve(failure.installPath)] : []));
	for (const failure of peerLinkRepair.packageReadFailures.toSorted((left, right) => left.packageDir.localeCompare(right.packageDir))) {
		const packageDir = path.resolve(failure.packageDir);
		const hasTypedFailure = smokeFailureInstallPaths.has(packageDir);
		const belongsToInactivePlugin = knownInstallPaths.has(packageDir) && !activeInstallPaths.has(packageDir);
		if (!hasTypedFailure && !belongsToInactivePlugin) warnings.push(formatPeerLinkPackageReadWarning(failure));
	}
	for (const failure of smoke.failures) warnings.push({
		pluginId: failure.pluginId,
		reason: `${failure.reason}: ${failure.detail}`,
		message: `Plugin "${failure.pluginId}" failed post-core payload smoke check (${failure.reason}): ${failure.detail}`,
		guidance: smokeFailureGuidance(failure)
	});
	return {
		changes: [
			...staleManagedNpmBundledPluginRepair?.removedPluginIds.map((pluginId) => `Removed stale managed install record for bundled plugin "${pluginId}".`) ?? [],
			...prunedBaseline?.stale.map((record) => `Removed stale local bundled plugin install record "${record.pluginId}".`) ?? [],
			...repair.changes,
			...peerLinkRepair.changes
		],
		notices,
		warnings,
		errored: smoke.failures.length > 0,
		smokeFailures: smoke.failures,
		installRecords: records
	};
}
/**
* Drop install records that the gateway would never activate: disabled
* plugin entries, plugins listed in `plugins.deny`, etc. Records that
* resolve as a trusted-source-linked official install (npm or ClawHub)
* are retained even when the entry is disabled, mirroring the existing
* `collectMissingPluginInstallPayloads({ skipDisabledPlugins: true,
* syncOfficialPluginInstalls: true })` policy at
* `update-command.ts:~218`. We do NOT collapse to the configured plugin
* id set here — that would over-filter and miss e.g. providers/runtimes
* that are enabled implicitly via auth profiles or model refs. Effective
* enable state is the right precision boundary.
*/
/**
* Pure helper used by `updatePluginsAfterCoreUpdate` to fold a convergence
* result into the existing `PluginUpdateOutcome[]` / warning shape that the
* post-core update result carries.
*
* Returns:
*  - `outcomes` to append to `pluginUpdateOutcomes`. Only convergence
*    warnings that name a `pluginId` produce per-plugin error outcomes; the
*    rest are surfaced via `warnings`.
*  - `errored` boolean that callers translate into `status: "error"`.
*    Repair warnings are nonblocking; smoke failures remain errors on the
*    explicit update path even though Gateway startup can quarantine them.
*/
function convergenceWarningsToOutcomes(convergence) {
	const outcomes = convergence.warnings.filter((w) => Boolean(w.pluginId)).map((w) => ({
		pluginId: w.pluginId,
		status: "error",
		message: w.message
	}));
	return {
		warnings: [...convergence.warnings, ...convergence.notices ?? []],
		outcomes,
		errored: convergence.errored
	};
}
//#endregion
export { runPostCorePluginConvergence as n, convergenceWarningsToOutcomes as t };
