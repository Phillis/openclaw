import { A as resolveManagedUnsetPathsForWrite, I as validateConfigObjectRaw, at as stampConfigWriteMetadata, k as applyUnsetPathsForWrite } from "./io-DlN5njvP.js";
import { r as containsConfigIncludeDirective } from "./io.read-helpers-YVBmmwxJ.js";
import { r as replaceConfigFile } from "./mutate-C_fsUarr.js";
import "./config-B2bSneS2.js";
import { n as findDoctorLegacyConfigIssues } from "./legacy-config-issues-lmde6xrP.js";
import { isDeepStrictEqual } from "node:util";
//#region src/commands/doctor/shared/automatic-upgrade-config-repair.ts
const AUTOMATIC_UPGRADE_CONFIG_UNSET_PATHS = [["meta", "lastTouchedAt"], [
	"agents",
	"defaults",
	"heartbeat",
	"skipWhenBusy"
]];
const AUTOMATIC_UPGRADE_CONFIG_ISSUE_PATHS = /* @__PURE__ */ new Set(["meta", "agents.defaults.heartbeat"]);
/** Plans the one tagged stable-to-main config repair that is safe before full validation. */
function planUpgradeConfigRepair(snapshot) {
	if (snapshot.valid || !snapshot.exists || snapshot.raw === null || snapshot.issues.length === 0 || snapshot.issues.some((issue) => !AUTOMATIC_UPGRADE_CONFIG_ISSUE_PATHS.has(issue.path)) || snapshot.legacyIssues.some((issue) => issue.path !== "") || (snapshot.includedPaths?.length ?? 0) > 0 || containsConfigIncludeDirective(snapshot.parsed)) return null;
	const unsetPaths = AUTOMATIC_UPGRADE_CONFIG_UNSET_PATHS;
	const config = applyUnsetPathsForWrite(snapshot.sourceConfig, unsetPaths);
	if (isDeepStrictEqual(config, snapshot.sourceConfig) || !validateConfigObjectRaw(config).ok || findDoctorLegacyConfigIssues(config, config).length > 0) return null;
	return {
		config,
		unsetPaths,
		snapshot: {
			...snapshot,
			sourceConfig: config,
			resolved: config,
			runtimeConfig: config,
			config,
			valid: true,
			issues: [],
			legacyIssues: []
		}
	};
}
function resolveUpgradeConfigSnapshot(snapshot) {
	return snapshot.valid ? snapshot : planUpgradeConfigRepair(snapshot)?.snapshot;
}
/** Matches only the canonical writer result for a previously admitted upgrade repair. */
function isUpgradeConfigRepairResult(before, after) {
	const plan = planUpgradeConfigRepair(before);
	const expected = plan ? stampConfigWriteMetadata(applyUnsetPathsForWrite(plan.config, resolveManagedUnsetPathsForWrite(plan.unsetPaths)), void 0, void 0, before.parsed) : null;
	return Boolean(expected && after.valid && before.path === after.path && isDeepStrictEqual(expected, after.sourceConfig));
}
/** Commits a planned repair against the exact snapshot admitted under the startup lease. */
async function commitUpgradeConfigRepair(plan, snapshot) {
	await replaceConfigFile({
		nextConfig: plan.config,
		snapshot,
		afterWrite: {
			mode: "none",
			reason: "startup migration"
		},
		writeOptions: {
			auditOrigin: "doctor",
			unsetPaths: plan.unsetPaths,
			skipOutputLogs: true,
			skipRuntimeSnapshotRefresh: true
		}
	});
}
//#endregion
export { resolveUpgradeConfigSnapshot as i, isUpgradeConfigRepairResult as n, planUpgradeConfigRepair as r, commitUpgradeConfigRepair as t };
